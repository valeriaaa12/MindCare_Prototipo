// api/chat.ts  (en la RAÍZ del repo)
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "nodejs" };

type Msg = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

    const raw = req.body;
    const body = typeof raw === "string" ? JSON.parse(raw || "{}") : (raw || {});
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const last = messages[messages.length - 1];
    const lastText = last?.role === "user" ? String(last.content || "") : "";

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ ok: true, reply: "⚠️ Falta GEMINI_API_KEY en runtime." });
    }
    if (!lastText) {
      return res.status(400).json({ ok: false, error: 'Missing "messages" or last user message' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastText);
    const reply = result.response.text();

    return res.status(200).json({ ok: true, reply: reply || "…" });
  } catch (e: any) {
    console.error("chat error:", e);
    return res.status(200).json({ ok: true, reply: "🤖 No pude responder ahora, intenta de nuevo en un momento." });
  }
}
