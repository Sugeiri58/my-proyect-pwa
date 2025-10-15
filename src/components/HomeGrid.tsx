// src/components/HomeGrid.tsx
export default function HomeGrid() {
  const albums = [
    {
      title: "The Beatles – Abbey Road",
      img: "/assets/beatles.jpeg", // ajusta la ruta
    },
    {
      title: "Michael Jackson – BAD",
      img: "/assets/mj-bad.png",
    },
    {
      title: "Queen – A Night at the Opera",
      img: "/assets/queen.jpeg",
    },
  ];

  return (
    <section className="grid-section">
      <div className="grid">
        {albums.map((a) => (
          <article key={a.title} className="card">
            <img src={a.img} alt={a.title} />
            <h3>{a.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
