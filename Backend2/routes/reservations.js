import express from "express";
import {
  createReservation,
  updateReservationStatus,
  getReservationsByUser,
  deleteReservation,
} from "../controllers/reservationController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createReservation);
router.get("/user/:userId", auth, getReservationsByUser);
router.put("/status/:id", auth, updateReservationStatus);
router.delete("/:id", auth, deleteReservation);

export default router;
