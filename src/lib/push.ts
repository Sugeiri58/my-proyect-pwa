export async function askPermission() {
  const r = await Notification.requestPermission();
  return r === 'granted';
}

export async function subscribePush(vapidPublicKey: string) {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });
  await fetch('/api/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(sub) });
  return sub;
}

function urlBase64ToUint8Array(base64: string) {
  const pad = '='.repeat((4-(base64.length%4))%4);
  const b64 = (base64+pad).replace(/-/g,'+').replace(/_/g,'/');
  const raw = atob(b64); const out = new Uint8Array(raw.length);
  for (let i=0;i<raw.length;i++) out[i]=raw.charCodeAt(i);
  return out;
}
