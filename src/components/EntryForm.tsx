import { useState } from 'react';
import { addEntry, queueOutbox } from '../../lib/db';

async function sendToServer(payload: any) {
  // TODO: reemplazar por tu endpoint real
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Network/Server error');
}

export default function EntryForm() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { title, notes };

    // 1) Guardar siempre en IndexedDB (histórico local)
    await addEntry(payload);

    try {
      // 2) Intentar enviar online
      if (navigator.onLine) {
        await sendToServer(payload);
        setStatus('Guardado y sincronizado con el servidor');
      } else {
        throw new Error('offline');
      }
    } catch {
      // 3) Cola para Background Sync
      await queueOutbox(payload);
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register('sync-entries');
      }
      setStatus('Sin conexión: se sincronizará cuando vuelva la red');
    }

    setTitle('');
    setNotes('');
  }

  return (
    <form onSubmit={onSubmit} style={{ margin: '24px 20px', maxWidth: 520 }}>
      <h3 style={{ margin: '0 0 8px' }}>Nueva entrada (offline friendly)</h3>

      <input
        required
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 8 }}
      />

      <textarea
        placeholder="Notas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ width: '100%', padding: 10, height: 100, borderRadius: 8 }}
      />

      <button type="submit" style={{ marginTop: 8 }}>Guardar</button>
      {status && <p style={{ color: '#aaa', marginTop: 8 }}>{status}</p>}
      {!navigator.onLine && <p style={{ color: '#aaa' }}>Estás offline</p>}
    </form>
  );
}
