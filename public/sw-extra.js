// ----- Offline fallback para navegaciones si la red falla -----
//self.addEventListener('fetch', (event) => {
//  if (event.request.mode === 'navigate') {
//    event.respondWith((async () => {
//      try { return await fetch(event.request); }
//      catch (e) {
//        // Intenta offline.html, si no existe usa index.html del precache
//        const cache = await caches.open('static-swr');
//        const offline = await cache.match('/offline.html');
//        if (offline) return offline;
//        const idx = await caches.match('/index.html');
//        return idx || Response.error();
//      }
//    })());
//  }
//});

// ---------- Background Sync ----------
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-entries') {
    event.waitUntil(flushOutbox());
  }
});

async function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('vinylbeat-db', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function getAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function deleteIds(store, ids) {
  const db = await openDB();
  const tx = db.transaction(store, 'readwrite');
  const os = tx.objectStore(store);
  ids.forEach(id => os.delete(id));
  return tx.done;
}
async function flushOutbox() {
  const items = await getAll('outbox');
  const sent = [];
  for (const it of items) {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(it),
      });
      if (res.ok) sent.push(it.id);
    } catch {}
  }
  if (sent.length) await deleteIds('outbox', sent);
}

// ---------- Push ----------
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'VinylBeat';
  const options = {
    body: data.body || 'Tienes novedades',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
