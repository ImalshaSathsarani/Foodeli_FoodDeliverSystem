import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    total_amount:{
        type:Number,
        required:true,
        
    },

    address:{
        type:String,
        required:true,
        
    }, 

    paymentStatus:{
        type:String,
        default:"Payment Done",
    },

    foodStatus:{
        type:String,
        default:"Preparing",
    },

    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    
    products:{
        type:[{
            product:{ type:mongoose.Types.ObjectId,ref:"Food",required:true},
            quantity:{
                type:Number,default:1
            },
        }]
    }
    
    
},{timestamps:true}
);

export default mongoose.model("Orders", OrderSchema);