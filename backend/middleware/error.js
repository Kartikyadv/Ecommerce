import { ErrorHandler } from "../utils/errorhandler.js";

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // CastError OR MongoDB error(id in params)
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;
