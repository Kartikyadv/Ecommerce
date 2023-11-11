import express from "express";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import errorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(cookieParser());

// using routes
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);

// Middleware for Errors
app.use(errorMiddleware);