// api/entries.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/firebase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const snap = await db.collection('entries').orderBy('createdAt', 'desc').limit(100).get();
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ ok: true, entries });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const items = Array.isArray(body) ? body : [body];

      const batch = db.batch();
      for (const it of items) {
        const ref = db.collection('entries').doc();
        batch.set(ref, {
          title: String(it.title ?? it.titulo ?? '').trim(),
          notes: (it.notes ?? it.notas ?? '').toString(),
          createdAt: new Date().toISOString(),
        });
      }
      await batch.commit();

      return res.status(201).json({ ok: true, count: items.length });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
