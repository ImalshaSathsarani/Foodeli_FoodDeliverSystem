import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendContactMessage = async(req,res,next)=>{
    try{
        const { name, email, message} = req.body;

        if(!name || !email || !message){
            return res.status(400).json({error:"All fields are required"})
        }

         //  Log to make sure env variables are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env");
      return res.status(500).json({ error: "Email configuration error" });
    }


        //create transporter
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            }
        });

        //Mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to:process.env.ADMIN_EMAIL,
            replyTo: email,
            subject:"New Contact Message - Foodeli",
            text:
            `You have a new message from Foodeli Contact page:
            Name:${name}
            Email:${email}
            Message:${message} `,
        };

        const info = await transporter.sendMail(mailOptions);
         console.log("✅ Message sent: %s", info.messageId);
         return res.status(200).json({ message: "Message sent successfully!" });

    }catch(e){
      next(e);
      console.error("❌ Error sending contact message:", e);
    }
}