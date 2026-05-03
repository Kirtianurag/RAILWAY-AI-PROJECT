import express from "express";
import { chatWithAI } from "../Controllers/aiController.js";

const router = express.Router();

router.post("/chat", chatWithAI);

export default router;
