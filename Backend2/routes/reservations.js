import express from "express";
import {
  createReservation,
  updateReservationStatus,
  getReservationsByUser,
  getReservationById,
  deleteReservation,
} from "../controllers/reservationController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createReservation);
router.get("/user", auth, getReservationsByUser);
router.get("/:id", auth, getReservationById);
router.put("/status/:id", auth, updateReservationStatus);
router.delete("/:id", auth, deleteReservation);

export default router;
