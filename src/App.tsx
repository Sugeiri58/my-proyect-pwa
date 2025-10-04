import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* Header fijo */}
      <header className="app-header">
        <img src="/icons/icon-192.png" alt="Logo VinylBeat" width={32} height={32} />
        <h1>VinylBeat</h1>
      </header>

      {/* Sección principal (Hero) */}
      <main>
        <section className="hero">
          <h2>Descubre la música que nunca pasa de moda</h2>
          <p>Explora nuestros discos de colección y revive los mejores clásicos.</p>
        </section>

        {/* Grid de discos destacados */}
        <section className="grid">
        <article className="card">
          <figure className="cover">
            <img src="/assets/beatles.jpeg" alt="Abbey Road" loading="lazy" />
          </figure>
          <h3>The Beatles – Abbey Road</h3>
        </article>

        <article className="card">
          <figure className="cover">
            <img src="/assets/Bad.png" alt="Michael Jackson – Bad" loading="lazy" />
          </figure>
          <h3>Michael Jackson – Bad</h3>
        </article>
        <article className="card">
          <figure className="cover">
            <img src="/assets/queen.jpeg" alt="A Night at the Opera" loading="lazy" />
          </figure>
          <h3>Queen – A Night at the Opera</h3>
        </article>
      </section>
      </main>

      {/* Footer */}
      <footer>
        © 2025 VinylBeat — Todos los derechos reservados
      </footer>
    </div>
  )
}

export default App
