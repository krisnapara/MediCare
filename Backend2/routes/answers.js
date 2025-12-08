import express from "express";
import {
  saveAnswers
} from "../controllers/answerController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, saveAnswers);

export default router;
