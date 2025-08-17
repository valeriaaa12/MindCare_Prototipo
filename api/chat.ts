// api/chat.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "nodejs" };

// Tipos del front
type Msg = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  try {
    // CORS básico
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // ---- Parseo ultra tolerante ----
    const raw = req.body;
    const body = typeof raw === "string" ? JSON.parse(raw || "{}") : (raw || {});
    const contentType = req.headers?.["content-type"] || "";

    // Acepta { messages } ó { prompt }
    let prompt = "";
    let history: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(body?.messages)) {
      const messages = body.messages as Msg[];
      history = messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content ?? "") }],
      }));
      const last = messages[messages.length - 1];
      if (last?.role === "user") prompt = String(last.content ?? "");
    } else if (typeof body?.prompt === "string") {
      prompt = body.prompt;
    } else if (contentType.includes("text/plain") && typeof raw === "string") {
      // por si alguien manda texto plano
      prompt = raw;
    }

    console.log("content-type:", contentType);
    console.log("has GEMINI_API_KEY:", !!process.env.GEMINI_API_KEY);
    console.log("history.len:", history.length, "| prompt.len:", prompt.length);

    // Si no hay prompt, responde 200 con explicación (evitamos 400 para depurar)
    if (!prompt) {
      return res.status(200).json({
        ok: true,
        reply:
          "⚠️ No recibí texto del usuario. Asegúrate de enviar { messages:[...user], ... } o { prompt:\"...\" } con 'Content-Type: application/json'.",
      });
    }

    // ---- Llama a Gemini (si hay key) ----
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        ok: true,
        reply: `Echo (sin GEMINI_API_KEY): ${prompt.slice(0, 80)}`,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();

    return res.status(200).json({ ok: true, reply: reply || "…" });
  } catch (e: any) {
    console.error("chat error:", e);
    return res
      .status(200) // mantenemos 200 para ver feedback en el front mientras depuramos
      .json({ ok: true, reply: "🤖 No pude responder ahora, intenta de nuevo en un momento." });
  }
}
