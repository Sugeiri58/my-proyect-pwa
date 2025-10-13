import './App.css'
import EntryForm from './components/EntryForm'
import EntriesPage from './pages/EntriesPage'
import { useEffect, useState } from 'react'
import { askPermission, subscribePush } from './lib/push';

function OnlineBadge() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, padding: '6px 10px',
      borderRadius: 8, background: online ? '#1b5e20' : '#7b1fa2', color: '#fff', fontSize: 12 }}>
      {online ? 'Online' : 'Offline'}
    </div>
  )
}

function App() {
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
        </section>

        {/* ---- Nuevo: Form offline + listado desde IndexedDB ---- */}
        <EntryForm />

        <h3 style={{ margin: '8px 20px' }}>Mis entradas (IndexedDB)</h3>
        <EntriesPage />

        {/* Tu grid de discos puede seguir aquí si quieres */}
      </main>

      <footer>
        © 2025 VinylBeat — Todos los derechos reservados
      </footer>

      <OnlineBadge />
    </div>
  )
}
function PushButton() {
  async function enable() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push no soportado'); return;
    }
    if (!(await askPermission())) { alert('Permiso denegado'); return; }
    await subscribePush(import.meta.env.VITE_VAPID_PUBLIC || '<TU_PUBLIC_VAPID_KEY_BASE64URL>');
    alert('Suscripción creada. Abre /api/test-push para probar.');
  }
  return <button onClick={enable} style={{ margin: '8px 20px' }}>Habilitar notificaciones</button>;
}

export default App
