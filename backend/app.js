import express from "express";

export const app = express();

app.use(express.json());


// using routes
import productRoute from "./routes/productRoute.js";
app.use("/api/v1", productRoute);

// Middleware for Errors
import Error from "./middleware/error.js";
app.use(Error);