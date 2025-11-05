import express from "express";
import { isAdmin, verifyToken } from "../middleware/verifyUser.js";
import { getCustomerChart, getRecentOrders, getSalesChart, getSummary } from "../controllers/dashboard.controller.js";


const router = express.Router();

router.get("/summary",verifyToken,isAdmin,getSummary);
router.get("/sales-chart",verifyToken,isAdmin,getSalesChart);
router.get("/customer-chart",verifyToken,isAdmin,getCustomerChart);
router.get("/recent-orders",verifyToken,isAdmin,getRecentOrders);

export default router;