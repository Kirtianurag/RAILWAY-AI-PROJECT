import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

// allow frontend (vercel) to call backend (railway)
app.use(cors({
  origin: [
    "https://railway-ai-project.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());


/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);


/* ================= HEALTH CHECK ================= */

// test route to check server status
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});


/* ================= START SERVER ================= */

const startServer = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("MongoDB connection failed:", error.message);
    process.exit(1);

  }

};

startServer();