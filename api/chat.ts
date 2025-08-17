// api/chat.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "nodejs" };

type Msg = { role: "user" | "assistant"; content: string };

// Convierte tus mensajes (user/assistant) al formato de Gemini (user/model)
function toGeminiContents(messages: Msg[] = []) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content ?? "") }],
  }));
}

// Garantiza que el primer content para Gemini sea 'user'.
// Si la conversación comienza con un saludo del assistant, lo omite.
function normalizeStartingWithUser(messages: Msg[]) {
  if (!messages?.length) return [];
  const firstUserIdx = messages.findIndex((m) => m.role === "user");
  return firstUserIdx >= 0 ? messages.slice(firstUserIdx) : []; // si no hay user, devuelvo vacío
}

export default async function handler(req: any, res: any) {
  // CORS básico (útil si alguna vez pruebas cross-origin)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // Body tolerante (string u objeto)
    const raw = req.body;
    const body = typeof raw === "string" ? JSON.parse(raw || "{}") : (raw || {});
    const messages = (Array.isArray(body?.messages) ? body.messages : []) as Msg[];

    // Instrucción inicial (actúa como “sistema” pero Gemini no tiene rol system, así que va como user)
    const systemInstruction = {
      role: "user" as const,
      parts: [
        {
          text:
            "Eres Mindy, una asistente emocional empática. Responde SIEMPRE en español, de forma breve, clara y con apoyo emocional. " +
            "Prioriza validar emociones, hacer preguntas suaves y sugerir pasos simples (respiración, journaling, hablar con alguien de confianza). " +
            "Evita juicios, consejos médicos y contenido clínico; si detectas riesgo, sugiere buscar ayuda profesional y líneas de apoyo locales.",
        },
      ],
    };

    // Asegura que el historial empiece con el primer mensaje del usuario
    const usableHistory = normalizeStartingWithUser(messages);

    // Construye el array de contenidos para Gemini: instrucción + historial alternando user/model
    const contents = [
      systemInstruction,
      ...toGeminiContents(usableHistory),
    ];

    // Si no hay ningún mensaje de usuario, responde amigable sin llamar a Gemini
    const last = messages[messages.length - 1];
    const lastText = last?.role === "user" ? String(last.content ?? "") : "";
    if (!lastText) {
      return res.status(200).json({
        ok: true,
        reply:
          "¡Hola! Puedo escucharte. Cuéntame, ¿cómo te sientes hoy? 💙",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback amable si falta la key en runtime
      return res.status(200).json({
        ok: true,
        reply:
          "Ahora mismo no puedo conectarme, pero estoy aquí para escucharte. ¿Qué te gustaría contarme?",
      });
    }

    // --- Llamada a Gemini ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // puedes cambiar a "gemini-2.0-pro" si buscas mayor profundidad
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      },
      // safetySettings: [...] // opcional
    });

    // Con generateContent puedes pasar todo el contenido (instrucción + historial + último user)
    const response = await model.generateContent({ contents });

    // Texto de respuesta (SDK trae response.text())
    const reply =
      (response as any)?.response?.text?.() ??
      (response as any)?.text?.() ??
      "Gracias por compartir. Estoy contigo. 💜";

    return res.status(200).json({ ok: true, reply });
  } catch (err: any) {
    console.error("api/chat error:", err);
    // Respuesta empática de cortesía si algo falla
    return res.status(200).json({
      ok: true,
      reply:
        "Perdón, tuve un problema técnico. Aun así estoy aquí para ti. ¿Quieres contarme un poco más de cómo te sientes?",
    });
  }
}
