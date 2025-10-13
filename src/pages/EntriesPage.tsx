import { useEffect, useState } from 'react';
import { listEntries } from '../lib/db';

export default function EntriesPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ listEntries().then(setItems); }, []);
  return (
    <section className="grid">
      {items.map(e=>(
        <article className="card" key={e.id}>
          <div className="cover" style={{aspectRatio:'1/1', background:'#000'}}/>
          <h3>{e.title}</h3>
        </article>
      ))}
    </section>
  );
}
