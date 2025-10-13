import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import { subscribers } from './subscribe.js';

webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC as string,
  process.env.VAPID_PRIVATE as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = JSON.stringify({ title: 'VinylBeat', body: '¡Notificación de prueba!' });
  const subs = Array.from(subscribers);
  await Promise.all(subs.map((s: any) => webpush.sendNotification(s, payload).catch(() => {})));
  return res.json({ ok: true, sent: subs.length });
}
