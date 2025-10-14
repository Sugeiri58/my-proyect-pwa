import './App.css'
import EntryForm from './components/EntryForm'
import EntriesPage from './pages/EntriesPage'
import { useEffect, useState } from 'react'
import { ensureSubscribed } from './lib/push'

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
    <div style={{
      position: 'fixed', right: 12, bottom: 12, padding: '6px 10px',
      borderRadius: 8, background: online ? '#1b5e20' : '#7b1fa2',
      color: '#fff', fontSize: 12
    }}>
      {online ? 'Online' : 'Offline'}
    </div>
  )
}

function PushButton() {
  async function onClick() {
    try {
      const key = import.meta.env.VITE_VAPID_PUBLIC
      console.log('[push] VITE_VAPID_PUBLIC =', key)
      if (!key) { alert('Falta VITE_VAPID_PUBLIC'); return }
      await ensureSubscribed(key)
      alert('Suscripción registrada. Ahora abre /api/test-push')
    } catch (e:any) {
      console.error(e)
      alert('No se pudo suscribir: ' + e.message)
    }
  }
  return <button onClick={onClick} style={{ margin: '8px 20px' }}>Habilitar notificaciones</button>
}

function App() {
  // Solo para depurar: ver la clave en consola/ventana
  useEffect(() => {
    (window as any).__VAPID__ = import.meta.env.VITE_VAPID_PUBLIC
    console.log('VAPID pública (cliente):', (window as any).__VAPID__)
  }, [])

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

        {/* Botón para suscribirse a Push */}
        <PushButton />

        {/* Form offline + listado */}
        <EntryForm />
        <h3 style={{ margin: '8px 20px' }}>Mis entradas (IndexedDB)</h3>
        <EntriesPage />
      </main>

      <footer>© 2025 VinylBeat — Todos los derechos reservados</footer>
      <OnlineBadge />
    </div>
  )
}

export default App
