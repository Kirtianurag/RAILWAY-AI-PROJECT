import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

// middlewares

app.use(cors());

app.use(express.json());

// routes

app.use("/api/auth", authRoutes);

// test route

app.get("/", (req, res) => {

  res.send("API is running");

});

// ✅ SAFE Mongo connection

const startServer = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");



    app.listen(5000, () => {

      console.log("Server running on http://localhost:5000");

    });

  } catch (error) {

    console.error("❌ MongoDB connection failed:", error.message);

    process.exit(1);

  }

};

startServer();