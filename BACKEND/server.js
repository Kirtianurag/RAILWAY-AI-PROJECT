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


// health check route (VERY IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running successfully 🚀"
  });
});


// routes
app.use("/api/auth", authRoutes);


// start server after DB connects
const startServer = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("MongoDB connection failed:", error.message);

    process.exit(1);

  }
};

startServer();