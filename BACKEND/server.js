import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

/* ================= FIXED CORS ================= */

app.use(cors({
  origin: [
    "https://railway-ai-project.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

// handle preflight request
app.options("*", cors());

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

/* ================= PORT ================= */

const PORT = process.env.PORT || 5000;

/* ================= DB ================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.log("Mongo error:", err.message);
});