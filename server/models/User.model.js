import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:false,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    password:{
        type:String,
        required:true,
    },

    address:{
        type:String,
        default : "",
    },

    phone: {
        type: String,
        default: "",
    },

    gender:{
        type:String,
        default:"",
    },

    img:{
        type:String,
        default : null,
    },

    status:{
        type:String,
        enum:["active", "inactive", "banned"],
        default:"active",
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },

    favourites:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Food",
        default:[],
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Orders",
        default:[],
    },
    cart:{
        type:[
            {
        product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Food"
        },
        quantity:{
            type:Number,
            default:1,
        },
    },
    ],
    default:[],
    },

},{timestamps:true}
);

export default mongoose.model("User", UserSchema);