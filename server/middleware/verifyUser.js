import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async(req, res, next) => {
    try{
         if(!req.headers.authorization){
            return next (createError(401,"You are not authenticated!"));
         }

         const token = req.headers.authorization.split(" ")[1];
         if(!token) return next(createError(401,"You are not authorized!"));
         const decode = jwt.verify(token,process.env.JWT_SECRET);
         req.user = decode;
         return next();
    }catch(e){
        next(e);
    }
}

export const isAdmin = (req,res,next) =>{
    if(req.user.role !== "admin"){
        return next(createError(403,"Access Denied! You are not authorized as admin"));
    }
    next();
}