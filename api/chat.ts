// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Configúrala en Vercel
});

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

function toGeminiContents(messages: Msg[] = []) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content ?? '' }],
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { messages = [] } = (req.body || {}) as { messages: Msg[] };

    // Instrucción de sistema (opcional, puedes quitarla o cambiar tono)
    const system = {
      role: 'user',
      parts: [{ text: 'Eres Mindy, una asistente emocional empática. Responde en español, breve y clara.' }],
    };

    const contents = [system, ...toGeminiContents(messages)];

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // rápido/estable. Cambia si quieres otro.
      contents,
    });

    const reply =
      (response as any)?.text ||
      (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Lo siento, no tengo respuesta ahora.';

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('Gemini error:', err?.message || err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
