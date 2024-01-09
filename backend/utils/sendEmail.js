import nodeMailer from "nodemailer";
import { catchAsyncError } from "../middleware/catchAsyncErrors.js";

export const sendEmail = catchAsyncError(async ({email,subject,message})=>{
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // console.log(email, subject, message);
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
    
});