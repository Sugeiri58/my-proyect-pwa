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
      if (!db.objectStoreNames.contains(STORE_ENTRIES)) {
        db.createObjectStore(STORE_ENTRIES, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function write(store: string, value: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const tx = db.transaction(store, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(store).add({ ...value, createdAt: Date.now() });
  });
}

export async function addEntry(data: any) {
  return write(STORE_ENTRIES, data);
}

export async function queueOutbox(data: any) {
  return write(STORE_OUTBOX, data);
}

// helpers opcionales para debug
export async function getAll(store: 'entries' | 'outbox') {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
