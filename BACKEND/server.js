import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: [
    "https://railway-ai-project.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);

/* health check route */

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

/* ================= PORT ================= */

const PORT = process.env.PORT || 3000;

/* ================= DB + SERVER ================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})
.catch((err) => {

  console.log("Mongo error:", err.message);

});