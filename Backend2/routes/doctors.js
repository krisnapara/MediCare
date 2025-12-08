import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctorController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", auth, createDoctor);  
router.put("/:id", auth, updateDoctor);
router.delete("/:id", auth, deleteDoctor);

export default router;
