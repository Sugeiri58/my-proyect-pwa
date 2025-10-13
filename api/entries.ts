// api/entries.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Aquí guardarías en una BD real. Para evidencias basta con responder 201.
  console.log('ENTRY_RECEIVED', req.body);

  // Simula latencia ligera (opcional, para ver el reintento del SW si falla)
  // await new Promise(r => setTimeout(r, 300));

  return res.status(201).json({ ok: true, receivedAt: Date.now() });
}
