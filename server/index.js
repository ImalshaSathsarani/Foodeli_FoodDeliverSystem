import express from "express";
import cors from "cors";
import {ConnectDB} from "./config/db.js";
import * as dotenv from "dotenv";
import UserRoutes from "./routes/User.route.js";
import FoodRoutes from "./routes/Food.route.js";
import DashboardRoutes from "./routes/Dashboard.route.js"
import ContactRoutes from "./routes/Contact.route.js"
import path from "path";
dotenv.config();

console.log("JWT Secret loaded:", process.env.JWT_SECRET); 

const app = express();
app.use(cors());
app.use(express.json({ limi :"50mb"}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads',express.static(path.join(process.cwd(),'uploads')));

app.use("/api/user",UserRoutes);
app.use("/api/food",FoodRoutes);
app.use("/api/dashboard",DashboardRoutes);
app.use("/api/contact",ContactRoutes);
 

app.use((err,req,res,next) =>{
    const status= err.ststus||500;
    const message = err.message ||"Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    });
});

app.get("/",async (req,res)=>{
    res.status(200).json({
        message:"Hello world",
    });
});

const startServer = async()=>{
    try{
        ConnectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

        //app.listen(5000,()=>console.log("Server started on port 5000"))

    }catch(e){
console.log(e);
    }
} ;


startServer();