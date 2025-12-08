import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js"; 
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import doctorRoutes from "./routes/doctors.js";
import reservationRoutes from "./routes/reservations.js";
import questionRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);


app.get("/", (req, res) => {
  res.json({ message: "MediCare API is running" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5055;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
