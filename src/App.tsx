// src/App.tsx
import "./App.css";
import EntryForm from "./components/EntryForm";
import { useEffect, useState } from "react";
import abbey from './assets/beatles.jpeg';
import mjBad from './assets/Bad.png';
import queenAnato from './assets/queen.jpeg';


/* ---------- Badge de estado de red (TU CÓDIGO ORIGINAL) ---------- */
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

/* ---------- Grid de discos en la Home (NUEVO, inline para no tocar tu estructura) ---------- */
function HomeGrid() {
  // Ajusta estas rutas a tus imágenes reales
  const albums = [
    { title: "The Beatles – Abbey Road", img: abbey },
    { title: "Michael Jackson – BAD", img: mjBad },
    { title: "Queen – A Night at the Opera", img: queenAnato},
  ];

  return (
    <section className="grid-section" aria-label="Destacados">
      <div className="grid">
        {albums.map((a) => (
          <article key={a.title} className="card">
            <img src={a.img} alt={a.title} loading="lazy" />
            <h3>{a.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- App (TU ESTRUCTURA, con CTA y el grid antes del formulario) ---------- */
export default function App() {
  // Scroll suave al formulario
  const openForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/icons/icon-192.png" alt="Logo VinylBeat" width={32} height={32} />
        <h1>VinylBeat</h1>
      </header>

      <main>
        {/* Sección hero (TU CÓDIGO + botón CTA) */}
        <section className="hero">
          <h2>Descubre la música que nunca pasa de moda</h2>
          <p>Explora nuestros discos de colección y revive los mejores clásicos.</p>

          {/* CTA que te lleva al formulario */}
          <a href="#form" className="btn-ghost" onClick={openForm}>
            Añadir nota sin conexión
          </a>
        </section>

        {/* GRID en la home (nuevo) */}
        <HomeGrid />

        {/* Formulario (tu componente), envuelto con un id para el ancla */}
        <section id="form" style={{ scrollMarginTop: 80 }}>
          <EntryForm />
        </section>
      </main>

      <footer>© 2025 VinylBeat — Todos los derechos reservados</footer>
      <OnlineBadge />
    </div>
  );
}
