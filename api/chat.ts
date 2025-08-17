// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { runtime: 'nodejs' };

type Msg = { role: 'user' | 'assistant'; content: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    // Parse body con tolerancia a string
    const raw = (req as any).body;
    const body = typeof raw === 'string' ? JSON.parse(raw || '{}') : (raw || {});
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];

    if (!messages.length) {
      return res.status(400).json({ ok: false, error: 'Missing "messages" array' });
    }

    // Mapea a formato Gemini Chat: role user|model
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const last = messages[messages.length - 1];
    const lastUserText = last.role === 'user' ? last.content : ''; // el último debería ser el userMsg

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({ history });

    const result = await chat.sendMessage(lastUserText || 'Hola');
    const reply = result.response.text();

    return res.status(200).json({ ok: true, reply });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return res.status(500).json({ ok: false, error: err?.message || 'Internal Server Error' });
  }
}
