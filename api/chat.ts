// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = { runtime: 'nodejs' }; // válido en Vercel

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS básico (por si haces pruebas locales con otra origin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY (configúrala en Vercel → Project → Environment Variables → Build & Runtime).');
    }

    // Vercel puede darte body como string si no mandas el header correcto
    const rawBody = (req as any).body;
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {});
    const prompt: string = body?.prompt ?? '';

    if (!prompt) {
      return res.status(400).json({ ok: false, error: 'Missing "prompt" in request body' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ ok: true, text });
  } catch (err: any) {
    // Importante para ver el error en los logs de Vercel
    console.error('API /api/chat error:', err);
    return res.status(500).json({ ok: false, error: err?.message || 'Internal Server Error' });
  }
}
