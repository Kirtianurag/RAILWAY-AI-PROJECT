import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();

const app = express();

/* middleware */

app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* routes */

app.use("/api/auth", authRoutes);

/* test route */

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

/* port */

const PORT = process.env.PORT || 8080;

/* start server */

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });

})
.catch((error) => {

  console.log("MongoDB error:", error.message);

});