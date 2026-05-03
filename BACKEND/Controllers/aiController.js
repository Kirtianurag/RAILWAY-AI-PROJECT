import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message || !apiKey) {
      return res.status(400).json({ error: "Message or API Key is missing" });
    }

    // Using gemini-2.0-flash from your approved list
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;


    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `You are the official Railway AI Assistant. ${message}` }]
      }]
    });

    if (response.data && response.data.candidates) {
      const reply = response.data.candidates[0].content.parts[0].text;
      res.json({ reply });
    } else {
      res.status(500).json({ error: "Empty response from Gemini" });
    }

  } catch (error) {
    console.error("GEMINI ERROR:", error.response?.data || error.message);
    const detail = error.response?.data?.error?.message || error.message;
    res.status(500).json({ error: `AI Error: ${detail}` });
  }
};
