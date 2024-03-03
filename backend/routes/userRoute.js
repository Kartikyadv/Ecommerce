import express from "express";
import { 
    deleteUser,
    forgotPassword,
    getAllUser,
    getOtherUserDetail,
    getUserDetails,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUserRole
 } from "../controllers/userController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/logout", logoutUser);
userRoute.post("/password/forgot", forgotPassword);
userRoute.put("/password/reset/:token", resetPassword);
userRoute.get("/me", isAuthenticatedUser ,getUserDetails);
userRoute.put("/password/update", isAuthenticatedUser , updatePassword);
userRoute.put("/me/updateProfile", isAuthenticatedUser , updateProfile);
userRoute.get("/admin/users",isAuthenticatedUser,authorizeRoles("admin"),getAllUser);

userRoute.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizeRoles("admin"),getOtherUserDetail)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);

export default userRoute;