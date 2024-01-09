import express from "express";
import { 
    forgotPassword,
    getUserDetails,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword
 } from "../controllers/userController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/logout", logoutUser);
userRoute.post("/password/forgot", forgotPassword);
userRoute.put("/password/reset/:token", resetPassword);
userRoute.get("/me", isAuthenticatedUser ,getUserDetails);

export default userRoute;