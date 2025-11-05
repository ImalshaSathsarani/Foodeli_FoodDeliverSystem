import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {createError} from '../error.js';
import User from '../models/User.model.js';
import Orders from '../models/Orders.model.js';
import Stripe from 'stripe';
import mongoose from 'mongoose';

dotenv.config();

export const UserRegister = async (req,res,next)=>{
    try{
        const {name,email,password,img,role} = req.body;

        //Check for existing user
        const existingUser = await User.findOne({email}).exec();
        if(existingUser){
            return next(createError(409,"Email is already in use"))
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({
            name,
            email,password:hashedPassword,
            img,
            role: role || "user",
        });

        const createduser = await user.save();
        const token = jwt.sign({id:createduser._id, role:createduser.role},process.env.JWT_SECRET,{
            expiresIn:"7d"
        });
        return res.status(201).json({token,user:createduser});

    }catch(e){
      next(e);  
    }
}

export const UserLogin = async (req,res,next)=>{
    try{
        const {email,password} = req.body;

        //Check for existing user
        const user = await User.findOne({email}).exec();
        if(!user){
            return next(createError(404,"User not found"));
        }

        if(user.status === "inactive") {
            return next(createError(403, "Account is deactivated. Please contact support to reactivate your account."));
        }

        if(user.status === "banned") {
            return next(createError(403, "Account is banned. Please contact support for more information."));
        }

        const isPasswordCorrect = await bcrypt.compareSync(
            password,
            user.password,
        );

        if(!isPasswordCorrect){
            return next(createError(403,"Incorrect password"));
        }

        const token = jwt.sign({ id:user._id, role:user.role },process.env.JWT_SECRET,{expiresIn:"7d",});

        return res.status(201).json({ token,user});  

    }catch(e){
      next(e);  
    }
}


//Cart
export const addToCart = async (req,res,next)=>{
    try{
      const {productId, quantity } = req.body;
      const userJWT =req.user;
      const user = await User.findById(userJWT.id);
      const existingCartItemIndex = user.cart.findIndex((item)=>
    item.product.equals(productId)
    );

    if(existingCartItemIndex !== -1){
        user.cart[existingCartItemIndex].quantity += quantity;
    }else {
        user.cart.push({product:productId, quantity});
    }

    await user.save();
    return res.status(200).json({message:"Product added to cart successfully" , user});
    }catch(e){
        next(e);
    } 

}

export const removeFromCart = async (req,res,next)=>{
    try{
        const { productId, quantity} = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);
        if(!user){
            return next(createError(404,"User not found"));
        }
        const productIndex = user.cart.findIndex((item)=>
        item.product.equals(productId)
    );

    if(productIndex!==-1){
        if(quantity && quantity>0){
            user.cart[productIndex].quantity -= quantity;

            if(user.cart[productIndex].quantity<=0){
                user.cart.splice(productIndex,1);
            }
        }else{
            user.cart.splice(productIndex,1);
        }

        await user.save();
        return res.status(200).json({message:"Product removed from cart successfully", user});
    }else{
        return next(createError(404,"Product not found in cart"));
    }
    }catch(e){
        next(e);
    }
}

export const getAllCartItems = async (req,res,next)=>{
    try{
        const userJWT = req.user;
        const user = await User.findById(userJWT.id).populate({
            path:"cart.product",
            model:"Food",
        });
     
        const cartItems = user.cart;
        return res.status(200).json({cartItems});
    }catch(e){
        next(e);
    }
}

//Orders

export const placeOrder = async (req,res,next)=>{
    try{
     const { products, address, totalAmount} = req.body;
     const userJWT = req.user;
     const user = await User.findById(userJWT.id);

     const order = new Orders({
        products,
        user: user._id,
        total_amount:totalAmount,
        address,
     });

     await order.save();
     user.cart = [];

     await user.save();
     return res.status(200).json({message:"Order placed successfully", order});
    }catch(e){
        next(e);
    }
}

export const getAllOrders = async (req,res,next)=>{
    try{
      const orders = await Orders.find().populate("user","name email") // populate user info (only name & email)
    .populate("products.product")// populate product info inside products array
    .sort({createdAt:-1});
    return res.status(200).json({orders});
    }catch(e){
        next(e);
    }
};

export const getOrderById = async(req,res,next)=>{
    try{
       
    
       const userId = req.user.id;

       const orders = await Orders.find({user:userId})
         .populate("products.product")
         .populate("user" ,"name email")
         .sort({createdAt:-1});

         return res.status(200).json({orders});
    }catch(e){
        next(e);
    }
}

export const getOrderDetailsById = async(req,res,next)=>{
    try{

        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)){
                return next(createError(400,"Invalid product ID"));
              }

       const order = await Orders.findById(id).populate("products.product").populate("user","name email");
       if(!order){
        return next(createError(404,"Order not found"));
       }

         return res.status(200).json({order});


    }catch(e){
        next(e);
    }
}

export const updateFoodStatus = async (req,res,next)=>{
    try{
       const order = await Orders.findByIdAndUpdate(
        req.params.id,
        { foodStatus : req.body.foodStatus},
        { new: true }
       );
       return res.status(200).json({message:"Food status updated successfully", order});
    }catch(e){
        next(e);
    }
}
    

//Favourites

export const addToFavourites = async (req,res,next)=>{
    try{
      const { productId } = req.body;
      const userJWT = req.user;
      const user = await User.findById(userJWT.id);

      if(!user.favourites.includes(productId)){
        user.favourites.push(productId);
        await user.save();
      }

      return res.status(200).json({message:"Proudct addedd to favourites successfully",user});
    }catch(e){
        next(e);
    }
}

export const removeFromFavourites = async (req,res,next)=>{
    try{

        const { productId } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);
        user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
        await user.save();

        return res.status(200).json({message:"Product removed from favorites successfully", user});
    }catch(e){
        next(e);
    }
}

    export const getUserFavourites = async(req,res,next)=>{
        try{
          const userId = req.user.id;
          const user = await User.findById(userId).populate("favourites").exec();

          if(!user){
            return next(createError(404,"User not found"));
          }

          const favouriteProducts = user.favourites;
          return res.status(200).json({favouriteProducts});
        }catch(e){
            next(e);
        }
    } 

    export const createPaymnetIntentHandler = async (req,res,next)=>{
        try{
            const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);
            const {amount} = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount:amount,
                currency: "LKR",
                payment_method_types: ["card"],
            });
            return res.status(200).json({clientSecret:paymentIntent.client_secret});

        }catch(e){
            next(e);
        }
    }

    export const getUserProfile = async (req,res,next)=>{
        try{
            const user = await User.findById(req.user.id)
            .populate("favourites", "name price img")
            .populate("orders");
            console.log("Fetched user profile:", user);
            console.log("req.user:", req.user);


            if(!user) return res.status(404).json({message:"User not found"});

            return res.status(200).json({user});
            
        }catch(e){
            next(e);

        }
    }

    export const updateUserProfile = async (req,res,next) =>{
        try{
              const { name, email, phone, address,gender, img} =req.body;
              let updateFields = { name, email, phone, address, gender};

              if(req.file) {
                updateFields.img = `/uploads/${req.file.filename}`;
              }
              const user = await User.findByIdAndUpdate(
                req.user.id,
                updateFields,
                {new:true} );

                res.json({ message: "Profile updated successfully", user});
        }catch(e){
            next(e);
        }
    }

    export const changePassword = async (req,res,next) => {
        try{
            const { oldPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if(!isMatch) return res.status(400).json({message:"Old password incorrect"});

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            await user.save();
            return res.status(200).json({message:"Password changed successfully"});

        }catch(e){
            next(e);
        }
    }

    export const deactivateUserAccount = async (req,res,next) =>{
        try{
            const userId = req.user.id;
            const updateduser = await User.findByIdAndUpdate(
                userId,
                { status: "inactive" },
                { new: true }
            );

            if(!updateduser){
                return next(createError(404,"User not found"));
            }

            res.status(200).json({success:true, message:"User account deactivated successfully", user:updateduser});

        }catch(e){
            next(e);
        }
    }

