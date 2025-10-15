const DB_NAME = 'vinylbeat-db';
const DB_VERSION = 1;
const STORE_OUTBOX = 'outbox';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllOutbox() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OUTBOX, 'readonly');
    const req = tx.objectStore(STORE_OUTBOX).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteIds(ids) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_OUTBOX, 'readwrite');
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
    const os = tx.objectStore(STORE_OUTBOX);
    ids.forEach(id => os.delete(id));
  });
}

async function flushOutbox() {
  const items = await getAllOutbox();
  const sent = [];

  for (const it of items) {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(it),
      });
      if (res.ok) sent.push(it.id);
    } catch (e) {
      // sigue intentando en la próxima sync
    }
  }
  if (sent.length) await deleteIds(sent);
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-entries') event.waitUntil(flushOutbox());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'FLUSH_OUTBOX') event.waitUntil(flushOutbox());
});
