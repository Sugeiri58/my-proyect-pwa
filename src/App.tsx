// src/App.tsx
import "./App.css";
import EntryForm from "./components/EntryForm";
import { useEffect, useState } from "react";

function OnlineBadge() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        padding: "6px 10px",
        borderRadius: 8,
        background: online ? "#1b5e20" : "#7b1fa2",
        color: "#fff",
        fontSize: 12,
      }}
    >
      {online ? "Online" : "Offline"}
    </div>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/icons/icon-192.png" alt="Logo VinylBeat" width={32} height={32} />
        <h1>VinylBeat</h1>
      </header>

      <main>
        <section className="hero">
          <h2>Descubre la música que nunca pasa de moda</h2>
          <p>Explora nuestros discos de colección y revive los mejores clásicos.</p>

          {/* CTA que te lleva al formulario */}
          <a href="#form" className="btn-ghost">
            Añadir nota offline
          </a>
        </section>

        {/* Solo el formulario (sin Entries list ni botón de notificaciones) */}
        <EntryForm />
      </main>

      <footer>© 2025 VinylBeat — Todos los derechos reservados</footer>
      <OnlineBadge />
    </div>
  );
}
