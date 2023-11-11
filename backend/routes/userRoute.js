import express from "express";
import { 
    loginUser,
    logoutUser,
    registerUser
 } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/logout", logoutUser);

export default userRoute;