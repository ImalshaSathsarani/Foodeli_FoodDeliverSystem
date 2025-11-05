import mongoose from "mongoose";

 export const ConnectDB =() =>{
    mongoose.set("strictQuery",true);
    mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("Connected to MongoDB")).catch((err)=>{
        console.error("Failed to connect to MongoDB");
        console.error(err);
    })

}