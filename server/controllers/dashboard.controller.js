import Orders from "../models/Orders.model.js";
import User from "../models/User.model.js";
import Food from "../models/Food.model.js";
import mongoose from "mongoose";

//get summary counts for Summary cards
export const getSummary = async (req, res, next)=>{
    try{
        const totalSalesAgg = await Orders.aggregate([
            { $group: {_id:null,total:{ $sum:"$total_amount"}}},
        ]);
        const totalSales = totalSalesAgg[0]?.total || 0;

        const totalOrders = await Orders.countDocuments();
        const totalCustomers = await User.countDocuments({role:'user'});

        //top food by number of times ordered
        const topFoodAgg = await Orders.aggregate([
            {$unwind:"$products"},
            { $group: {_id:"$products.product", total:{$sum:"$products.quantity"}}},
            { $sort: {total:-1}},
            {$limit:1},
            {
                $lookup:{
                    from:"foods",
                    localField:"_id",
                    foreignField:"_id",
                    as:"food",
                },
            },
            { $unwind:"$food"},
            {$project:{name:"$food.name", total:1}},
        ]);

        const topFood = topFoodAgg[0]?.name || "N/A";

        res.json ({
            totalSales,
            totalOrders,
            totalCustomers,
            topFood,
        });

    }catch(e){
        next(e);
    }
}

//get sales chart data last 7 days
export const getSalesChart = async(req,res,next)=>{
    try{
      const last7Days = await Orders.aggregate([
        {
            $group:{
                _id:{ $dayOfWeek:"$createdAt"},
                total:{$sum:"$total_amount"},
            },
        },
        {$sort:{ "_id":1 }},
      ]);

      const daysMap = {
        1:"Sun",
        2:"Mon",
        3:"Tue",
        4:"Wed",
        5:"Thu",
        6:"Fri",
        7:"Sat",
      };

      const formatted = last7Days.map(item => ({
        day:daysMap[item._id],
        total:item.total,
      }));


      res.json({success:true,data:formatted});
    }catch(e){
        next(e);
    }
}

//customer chat new vs returning
export const getCustomerChart = async(req,res,next)=>{
    try{
        //new customer placed only 1 order
        const newCustomers = await Orders.aggregate([
            {$group: {_id:"$user", ordersCount:{ $sum:1}}},
            {$match:{ordersCount:1}},
        ]);

        const totalCustomers = await User.countDocuments({role:"user"});
        const newCount = newCustomers.length;
        const returningCount = totalCustomers - newCount;

        res.json ({
            new:newCount,
            returning:returningCount<0 ? 0 : returningCount,
        })

    }catch(e){
        next(e);
    }
}

//recent orders
export const getRecentOrders = async (req,res,next)=>{
    try{
        const orders = await Orders.find()
        .populate("user","name email")
        .populate("products.product","name")
        .sort({createdAt:-1})
        .limit(5);

        res.json(orders);

    }catch(e){
        next(e);
    }
}