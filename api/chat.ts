// api/chat.ts
export const config = { runtime: "nodejs" };


import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

function toGeminiContents(messages: Msg[] = []) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content ?? '' }],
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') return res.status(200).send('ok');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST, GET'); return res.status(405).send('Method Not Allowed'); }

    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });

    const ai = new GoogleGenAI({ apiKey: key });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages: Msg[] = Array.isArray(body.messages) ? body.messages : [];

    const system = { role: 'user', parts: [{ text: 'Eres Mindy, una asistente emocional empática. Responde en español, breve y clara.' }] };
    const contents = [system, ...toGeminiContents(messages)];

    const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents });
    const reply =
      (response as any)?.text ||
      (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Lo siento, no tengo respuesta ahora.';

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('Gemini function error:', err?.stack || err?.message || String(err));
    return res.status(500).json({ error: 'Function error' });
  }
}
