import mongoose from "mongoose";

export const responseResolver = (code,successStatus,message,data) => {
    try {
        return {
            "code": code,
            "Success": successStatus,
            "message": message,
            "data": data
        }
    } catch (error) {
        console.log(error);
    }
}

export const connectDB = async (req,res) => {
    mongoose.connect(process.env.MONGO_URI).then((data)=>{
        console.log(`DB connected with ${data.connection.host}`);
    }).catch((e)=>{
        console.log(e);
    })
}