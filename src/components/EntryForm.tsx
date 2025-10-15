// src/components/EntryForm.tsx
import { useState } from "react";
import { addEntry, queueOutbox } from "../lib/db";

async function sendToServer(payload: any) {
  const res = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Network/Server error");
}

export default function EntryForm() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus(null);

    const payload = { title, notes };

    // Guarda siempre una copia local (histórico)
    await addEntry(payload);

    try {
      if (navigator.onLine) {
        await sendToServer(payload);
        setStatus("Guardado en el servidor");
      } else {
        throw new Error("offline");
      }
    } catch {
      await queueOutbox(payload);
      // si hay BG Sync lo registramos, si no, quedará en outbox
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register("sync-entries");
      }
      setStatus("📡 Sin conexión: se sincronizará cuando vuelva la red");
    } finally {
      setLoading(false);
      setTitle("");
      setNotes("");
    }
  }

  return (
    <section id="form" className="form-section">
      <div className="form-card">
        <div className="form-header">
          <div className="vinyl">
            <div className="label" />
          </div>
          <div>
            <h3>Agrega una nota de vinilo</h3>
            <p className="muted">Guárdala incluso sin conexión; luego se sincroniza.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="form-grid">
          <label className="field">
            <span>Título del disco *</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Abbey Road"
              className="input"
            />
          </label>

          <label className="field">
            <span>Notas</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Por qué te gusta? ¿Edición, prensado, pista favorita…?"
              className="textarea"
              rows={5}
            />
          </label>

          <div className="actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Guardando…" : "Guardar"}
            </button>
            <span
              className={`chip ${navigator.onLine ? "online" : "offline"}`}
              title={navigator.onLine ? "Conectado" : "Sin conexión"}
            >
              {navigator.onLine ? "En línea" : "Offline"}
            </span>
          </div>

          {status && <p className="status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
