// api/chat.ts (versión simple)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  try {
    const raw = (req as any).body;
    const body = typeof raw === 'string' ? JSON.parse(raw || '{}') : (raw || {});
    const prompt: string = body?.prompt ?? '';

    if (!process.env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
    if (!prompt) return res.status(400).json({ ok: false, error: 'Missing "prompt"' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
