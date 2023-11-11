import { Error } from "mongoose";
import { app } from "./app.js";
import { connectDB } from "./utils/controllerUtils.js";
import dotenv from "dotenv";

// Handling Uncaught Exception
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Path for .env variables
dotenv.config({path:"backend/.env"});

// Connecting to database
connectDB();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on ${process.env.PORT}`);
});

// Unhandled Promise Rejection(env)
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});