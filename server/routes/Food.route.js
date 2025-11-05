import express from "express";
import { addProducts, getCategories, getFoodById, getFoodItems, getPriceRange, restoreFoodStatus, searchFood, updateFood, updateFoodStatus, uploadFoodImage } from "../controllers/Food.controller.js";
import upload from '../middleware/upload.js';
import { isAdmin, verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.post('/add',verifyToken, isAdmin, addProducts);
router.get('/',getFoodItems);
router.get('/categories',getCategories);
router.get('/price-range',getPriceRange);
router.get('/:id',getFoodById);
router.post('/upload',verifyToken,isAdmin, upload.single('image'),uploadFoodImage)
router.put('/delete/:id',verifyToken,isAdmin,updateFoodStatus);
router.put('/update/:id',verifyToken,isAdmin,updateFood);
router.put('/restore/:id',verifyToken,isAdmin,restoreFoodStatus);
router.get('/search',verifyToken,searchFood);


export default router;