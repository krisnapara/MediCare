import express from "express";
import { getQuestions } from "../controllers/questionController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getQuestions); 

export default router;
