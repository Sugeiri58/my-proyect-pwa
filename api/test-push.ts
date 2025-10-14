import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import { subscribers } from './subscribe.js'; // si existe

webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC as string,
  process.env.VAPID_PRIVATE as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Si llega por POST con `sub`, enviamos a ese
    if (req.method === 'POST' && req.body?.sub) {
      await webpush.sendNotification(req.body.sub, JSON.stringify({
        title: 'VinylBeat',
        body: 'Notificación de prueba (POST directa)',
      }));
      return res.status(200).json({ ok: true, sent: 1, mode: 'direct' });
    }

    // Si no, enviamos a los que tengamos en memoria (puede ser 0 en serverless)
    const list = subscribers ? Array.from(subscribers) : [];
    let sent = 0;
    for (const s of list) {
      try {
        await webpush.sendNotification(s, JSON.stringify({
          title: 'VinylBeat',
          body: 'Notificación de prueba',
        }));
        sent++;
      } catch (_) { /* ignora fallos */ }
    }
    return res.status(200).json({ ok: true, sent, total: list.length, mode: 'memory' });
  } catch (e:any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
