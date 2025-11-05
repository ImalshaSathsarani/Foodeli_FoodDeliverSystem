import mongoose from "mongoose";
import Food from "../models/Food.model.js";
import {createError} from '../error.js';

export const addProducts = async (req, res, next) => {
    try{
       
        const foodData = req.body;
        if(!Array.isArray(foodData)){
            return next(
                createError(400,"Invalid request.Expected and array of foods.")
            );
        }
        let createdfoods =[];

        for(const foodInfo of foodData){
        const {name,desc,img,price,ingredients,category} = foodInfo;
        const product = new Food ({
            name,
            desc,
            img,
            price,
            ingredients,
            category,
        });
        const createdFoods = await product.save();
        createdfoods.push(createdFoods);
    }
    return res.status(201).json({message:"Products addedd successfully",createdfoods});

    }catch(e){
        next(e);
    }
}


export const uploadFoodImage = (req,res,next)=>{
   try{
      if(!req.file){
        return res.status(400).json({message:"No file uploaded"});
      }

      const imagePath = `/uploads/${req.file.filename}`;
      return res.status(200).json({imageUrl:imagePath});
   }catch(err){
    next(err);
   }
}
export const getFoodItems = async(req,res,next)=>{
    try{

     let { categories,minPrice, maxPrice , ingredients, search} = req.query;
     ingredients = ingredients?.split(",");
     categories =  categories?.split(",");  
     
     const filter = {
        // status:"Active",
     };

     if (categories && Array.isArray(categories)) {
        filter.category = { $in: categories };
     }
     if(ingredients && Array.isArray(ingredients)){
        filter.ingredients = {$in:ingredients};
     }

     if(maxPrice||minPrice){
        filter["price.org"] = {};
        if(minPrice){
            filter["price.org"]["$gte"] = parseFloat(minPrice);
        }
        if(maxPrice){
            filter["price.org"]["$lte"] = parseFloat(maxPrice);
        }
     }

     if(search){
        filter.$or = [
            { title:{$regex:new RegExp(search,"i")}},
            {desc:{$regex: new RegExp(search,"i")}},
        ];
     }

     const foodList = await Food.find(filter);

     return res.status(200).json(foodList);

    }catch(e){
         next(e);
    }
}


export const getCategories = async(req,res,next)=>{
    
    try{
        const categories = await Food.aggregate([
            {$unwind:"$category"},
            {$group:{_id:null,categories:{$addToSet:"$category"}}},
            {$project:{_id:0,categories:1}}
        ])

        return res.status(200).json(categories[0]?.categories || []);
    }catch(e){
        next(e);
    //     console.error("Error fetching categories:", e); // 👈 helpful log
    // return res.status(500).json({ message: "Server error", error: e.message });
    }
    
}

export const getPriceRange = async(req,res,next)=>{
    try{

        const prices = await Food.find().select("price.org -_id");

        if (prices.length === 0) {
            return res.status(200).json({ 
                min:0,
                max:0,
              message: "No food items found" 
            });
          }

        const priceValues = prices.map((item)=>item.price.org);
        const min = Math.min(...priceValues);
        const max = Math.max(...priceValues);
        res.status(200).json( {min,max} );
    }catch(e){
        next(e);
    }
}


export const getFoodById = async(req,res,next)=>{
    try{
      const { id } = req.params;
      if(!mongoose.isValidObjectId(id)){
        return next(createError(400,"Invalid product ID"));
      }
      const food = await Food.findById(id);

      if(!food){
        return next(createError(404,"Food Not Found"));
      }

      return res.status(200).json(food);
    }catch(e){
        next(e);
    }
}

export const updateFoodStatus = async(req,res,next)=>{
    try{
        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)){
            return next(createError(400,"Invalid Product Id"));
        }
        const updateFood = await Food.findByIdAndUpdate(
            id,
            {status:'Inactive'},
            {new:true}
        );

        if(!updateFood){
            return next(createError(404,"Food not found"));
        }

        res.status(200).json({success:true, message:"Food Deleted Successfully", food:updateFood});

    }catch(e){
        next(e);
    }
}

export const updateFood = async(req,res,next) =>{
    try{
        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)){
            return next(createError(400,"Invalid Food Id"));
        }
        const updateFood = await Food.findByIdAndUpdate(
            id,
            {$set:req.body},
            {new:true}
        );

        if(!updateFood){
            return next(createError(404,"Food not found"));
        }

          res.status(200).json({success:true, message:"Food Updated successfully", food:updateFood});

    }catch(e){
        next(e);
    }
}

export const restoreFoodStatus = async (req,res,next) =>{
    try{
        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)){
            return next(createError(400,"Invalid Food Id"))
        }

        const restoredFood = await Food.findByIdAndUpdate(
            id,
        {status:"Active"},
        {new:true}
)

if(!restoredFood){
    return next(createError(404,"Food Not found"))
}

res.status(200).json({
    success:true,
    message:'Food Restored Successfully',
    food: restoredFood,
})

    }catch(e){
        next(e);
    }
}

export const searchFood = async (req,res,next) =>{
    try{
        const { q } = req.query;
        if(!q || q.trim() === ""){
            return res.status(400).json({message:'Search query is required'});
        }

        const foods = await Food.find({
           $and:[
            {status:'Active'},
            {
               $or:[
                {name:{$regex:q, $options:'i'}},
                {desc:{$regex:q,$options:'i'}},
                 { category: { $regex: q, $options: "i" } }
            ],
            }
           ]
           
           
        }).select("_id name desc img status price category ingredients");;

        res.status(200).json(foods);

    }catch(e){
        next(e);
    }
}