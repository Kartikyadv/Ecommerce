import { ErrorHandler } from "../utils/errorhandler.js";

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // CastError OR MongoDB error(id in params)
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    // Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    // Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json web Token is invalid, try again`;
        err = new ErrorHandler(message,400);
    }

    // JWT EXPIRE error
    if(err.name === "TokenExpiredError"){
        const message = `Json web Token is Expired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;
