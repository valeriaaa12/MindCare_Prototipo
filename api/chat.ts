// api/chat.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "nodejs" };

type Msg = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  // CORS básico (útil si pruebas desde otros orígenes)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    // Parseo tolerante de body (string o objeto)
    const raw = req.body;
    const body = typeof raw === "string" ? JSON.parse(raw || "{}") : (raw || {});

    // --- Entrada: messages o prompt ---
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const last = messages[messages.length - 1];
    let prompt: string =
      (last?.role === "user" ? String(last.content ?? "") : "") ||
      (typeof body?.prompt === "string" ? body.prompt : "");

    // Construir history PARA GEMINI: debe iniciar con 'user'
    // 1) Tomamos todos los mensajes antes del último (que es el input actual del user)
    const prior = messages.slice(0, -1);

    // 2) Buscamos el primer 'user' y empezamos el historial DESDE ahí (ignoramos saludos del assistant al inicio)
    const firstUserIdx = prior.findIndex((m) => m.role === "user");
    const priorFromFirstUser = firstUserIdx >= 0 ? prior.slice(firstUserIdx) : [];

    // 3) Mapear a roles de Gemini ('user' | 'model')
    const history = priorFromFirstUser.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "") }],
    }));

    // Si no hay prompt (usuario no escribió nada), devolvemos 200 con aviso
    if (!prompt) {
      return res.status(200).json({
        ok: true,
        reply:
          "⚠️ No recibí texto del usuario. Envía { messages:[...{role:'user',content:'...'}] } o { prompt:'...' } con 'Content-Type: application/json'.",
      });
    }

    // Key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        ok: true,
        reply: `Echo (sin GEMINI_API_KEY): ${prompt.slice(0, 120)}`,
      });
    }

    // --- Llamada a Gemini ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();

    return res.status(200).json({ ok: true, reply: reply || "…" });
  } catch (e: any) {
    console.error("api/chat error:", e);
    // Evitamos 500 duros mientras depuras: te damos respuesta de cortesía
    return res.status(200).json({ ok: true, reply: "🤖 No pude responder ahora, intenta de nuevo en un momento." });
  }
}
