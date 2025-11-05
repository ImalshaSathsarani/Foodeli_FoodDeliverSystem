import express from "express";
import { addToCart, addToFavourites, changePassword, createPaymnetIntentHandler, deactivateUserAccount, getAllCartItems, getAllOrders, getOrderById, getOrderDetailsById, getUserFavourites, getUserProfile, placeOrder, removeFromCart, removeFromFavourites, updateFoodStatus, updateUserProfile, UserLogin, UserRegister } from "../controllers/User.controller.js";
import { verifyToken } from "../middleware/verifyUser.js";
import * as dotenv from "dotenv";
import upload from "../middleware/upload.js"
import { isAdmin } from "../middleware/verifyUser.js";

dotenv.config();
const router = express.Router();

router.post("/signup",UserRegister);
router.post("/signin",UserLogin);

router.post('/cart',verifyToken,addToCart);
router.get('/cart',verifyToken,getAllCartItems);
router.patch('/cart',verifyToken,removeFromCart);

router.post("/favourite",verifyToken,addToFavourites);
router.get("/favourite",verifyToken,getUserFavourites);
router.patch('/favourite',verifyToken,removeFromFavourites);

router.post('/order',verifyToken, placeOrder);
router.get("/order",verifyToken,isAdmin,getAllOrders);
router.get('/myorders',verifyToken,getOrderById);
router.get('/order/:id',verifyToken,getOrderDetailsById);
router.put('/admin/update-order/:id/status',verifyToken,isAdmin,updateFoodStatus);

router.post ('/create-payment-intent',verifyToken, createPaymnetIntentHandler);

router.get("/profile",verifyToken, getUserProfile);
router.put("/update-profile",verifyToken,upload.single("img"),updateUserProfile);
router.put("/change-password",verifyToken,changePassword);
router.put("/deactivate",verifyToken,deactivateUserAccount);

export default router;