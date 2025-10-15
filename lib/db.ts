import { openDB } from 'idb';

export const dbPromise = openDB('vinylbeat-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('entries'))
      db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
    if (!db.objectStoreNames.contains('outbox'))
      db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
  }
});

export async function addEntry(data: { title: string; notes?: string }) {
  const db = await dbPromise;
  return db.add('entries', { ...data, createdAt: Date.now() });
}

export async function listEntries() {
  const db = await dbPromise;
  return db.getAll('entries');
}

export async function queueOutbox(payload: any) {
  const db = await dbPromise;
  return db.add('outbox', { ...payload, createdAt: Date.now() });
}

export async function getOutbox() {
  const db = await dbPromise;
  return db.getAll('outbox');
}

export async function removeOutbox(ids: number[]) {
  const db = await dbPromise;
  const tx = db.transaction('outbox', 'readwrite');
  for (const id of ids) await tx.store.delete(id);
  await tx.done;
}
