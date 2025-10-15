// src/lib/db.ts
const DB_NAME = 'vinylbeat-db';
const DB_VERSION = 1; // ¡También usa 1 en el SW!
const STORE_ENTRIES = 'entries';
const STORE_OUTBOX = 'outbox';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('entries')) {
        db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addEntry(data: { title: string; notes?: string }) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    tx.objectStore('entries').add({ ...data, createdAt: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function queueOutbox(data: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('outbox', 'readwrite');
    tx.objectStore('outbox').add({ ...data, createdAt: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listEntries() {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction('entries', 'readonly');
    const req = tx.objectStore('entries').getAll();
    req.onsuccess = () => {
      const arr = (req.result || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      resolve(arr);
    };
    req.onerror = () => reject(req.error);
  });
}