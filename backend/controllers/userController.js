import { User } from "../models/userModel.js";
import { responseResolver } from "../utils/controllerUtils.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { catchAsyncError } from "../middleware/catchAsyncErrors.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// Register a User
export const registerUser = catchAsyncError( async (req,res,next) => {

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilePicture"
        }
    });

    sendToken(user,201,res);
});

// Login user
export const loginUser = catchAsyncError(async(req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user,200,res);
});

// Logout User
export const logoutUser = catchAsyncError(async(req,res,next) => {
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json(
        responseResolver(200,true,"Logged Out")
    );
});

// Forgot Password
export const forgotPassword = catchAsyncError(async(req,res,next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler(`User not found`, 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;

    try {
        sendEmail({
            email: user.email,
            subject: `Shopcart Password Recovery`,
            message,
        });
        return res.status(200).json(
            responseResolver(200, true,`Email sent to ${user.email} successfully`));
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message,500));
    }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req,res,next) => {

    //creating token hash from inputed email query token(string)
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    
    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset password Token is invalid or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user,200,res);
});

// Get User Detail
export const getUserDetails = catchAsyncError(async (req,res,next) => {
    const user = await User.findById(req.user.id);

    return res.status(200).json(
        responseResolver(200,true,`got user detail`,user)
    );
});

// Update User Password
export const updatePassword = catchAsyncError(async (req,res,next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler("Password not matched", 400));
    }
    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
});

// Get User Detail
export const updateProfile = catchAsyncError(async (req,res,next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.send(responseResolver(200,true,"Profile updated"));
});