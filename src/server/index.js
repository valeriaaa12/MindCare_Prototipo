// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Crea el cliente con la API key desde el .env (GEMINI_API_KEY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Convierte messages [{role:'user'|'assistant', content:string}]
 * al formato "contents" que espera Gemini:
 * [{ role:'user'|'model', parts: [{ text }]}]
 */
function toGeminiContents(messages = []) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content ?? "" }],
  }));
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [] } = req.body;

    // Prompt de sistema opcional para orientar el tono
    const systemInstruction = {
      role: "user",
      parts: [
        {
          text:
            "Eres Mindy, una asistente emocional empática. Responde en español, breve, clara y con apoyo emocional.",
        },
      ],
    };

    const contents = [systemInstruction, ...toGeminiContents(messages)];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // rápido y económico; usa 2.0-pro si quieres más calidad
      contents,
      // generationConfig: { temperature: 0.7 }, // opcional
      // safetySettings: [...]                   // opcional
    });

    // En el nuevo SDK, el texto viene como response.text
    const replyText =
      (response && (response.text || response.candidates?.[0]?.content?.parts?.[0]?.text)) ||
      "Lo siento, no tengo respuesta por ahora.";

    res.json({ reply: replyText });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AI server on http://localhost:${PORT}`));
