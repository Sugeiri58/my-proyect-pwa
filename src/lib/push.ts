export async function ensureSubscribed(vapidPublicKey: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push no soportado en este navegador');
  }

  console.log('[push] permiso actual:', Notification.permission);
  if (Notification.permission !== 'granted') {
    const res = await Notification.requestPermission();
    console.log('[push] permiso solicitado =>', res);
    if (res !== 'granted') throw new Error('Permiso denegado');
  }

  const reg = await navigator.serviceWorker.ready;
  console.log('[push] SW listo:', reg);

  // ¿Ya existe suscripción?
  let sub = await reg.pushManager.getSubscription();
  console.log('[push] suscripción previa:', sub);

  if (!sub) {
    // Suscribirse con la PUBLIC KEY (base64url -> UInt8Array)
    const appServerKey = urlBase64ToUint8Array(vapidPublicKey);
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appServerKey,
    });
    console.log('[push] nueva suscripción creada:', sub);
  }

  // IMPORTANTE: siempre envía (o re-envía) al servidor
  const resp = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub),
  });
  console.log('[push] POST /api/subscribe =>', resp.status);
  if (!resp.ok) throw new Error('Fallo al registrar suscripción en servidor');

  return sub;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}
