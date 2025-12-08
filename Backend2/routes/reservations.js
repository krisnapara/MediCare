import express from "express";
import {
  createReservation,
  updateReservationStatus,
  getReservationsByUser,
  deleteReservation
} from "../controllers/reservationController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", auth, createReservation);
router.get("/:id", auth, getReservationsByUser);
router.get("/user/:userId", auth, updateReservationStatus);
router.get("/doctor/:doctorId", auth, deleteReservation);

export default router;
