import express from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.post('/email', sendContactMessage);

export default router;