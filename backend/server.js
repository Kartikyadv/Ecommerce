import { app } from "./app.js";
import { connectDB } from "./utils/controllerUtils.js";
import dotenv from "dotenv";

dotenv.config({path:"backend/.env"});

connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on ${process.env.PORT}`);
});