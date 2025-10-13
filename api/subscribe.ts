import type { VercelRequest, VercelResponse } from '@vercel/node';
const subscribers = new Set<any>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  subscribers.add(req.body);
  return res.status(201).json({ ok: true, count: subscribers.size });
}
export { subscribers };
