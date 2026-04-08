import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

/* health routes */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/api", (req, res) => {
  res.send("API working");
});

const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("MongoDB connection failed:", error.message);
    process.exit(1);

  }
};

startServer();