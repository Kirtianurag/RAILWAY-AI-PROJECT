import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());

/* routes */
app.use("/api/auth", authRoutes);

/* health check route */
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

/* start server */
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