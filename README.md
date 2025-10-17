Va bien, pero te recomiendo **ajustar el formato Markdown** (títulos, listas y bloques de código) para que sea más legible y profesional. Ahora mismo la segunda parte (VinylBeat) está como texto plano: conviene ponerla con `#`/`##`, viñetas y bloque de comandos.

Aquí tienes una **versión lista para pegar** que respeta tu contenido original (en inglés) y añade la sección de tu PWA (en español) con buen formato:

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


# VinylBeat — PWA (React + TS + Vite)

PWA con **modo offline**, **sincronización en segundo plano** e **integración de notificaciones push**.
Sin conexión, guarda en **IndexedDB**; al volver la red, sincroniza con **Firestore** vía **Vercel Functions**.

## Requisitos

* Node 18+
* Firebase (Firestore + credencial de servicio)
* Claves VAPID (Web Push)

## Variables de entorno

**Servidor (Vercel > Settings):**

* `VAPID_PUBLIC`
* `VAPID_PRIVATE`
* `FIREBASE_SERVICE_ACCOUNT` *(JSON stringificado de la credencial de servicio)*

**Cliente:**

* `VITE_VAPID_PUBLIC` *(misma clave pública VAPID)*

## Scripts

```bash
npm i
npm run dev
npm run build
npm run preview
```

## Endpoints

* `POST /api/entries` → guarda entrada(s) en Firestore
* `POST /api/subscribe` → registra suscripción push
* `POST /api/test-push` → envía notificación de prueba

## Offline & Sync

* **Workbox:** App Shell precache + estáticos **SWR**, páginas **Network-First**
* **IndexedDB:** `entries` + `outbox`
* **Background Sync:** vacía `outbox` con tag `sync-entries`

## Probar Push

1. Pulsa el botón **“Activar notificaciones”** en la app (acepta el permiso).
2. En la consola del navegador:

   ```js
   fetch('/api/test-push', { method:'POST' })
     .then(r => r.json())
     .then(console.log)
   ```

   Deberías recibir una notificación (en producción sirve por HTTPS).

## Despliegue

* **Vercel** (HTTPS, funciones en `/api/*`).
* Asegura las **variables de entorno** configuradas.

* URL pública: https://my-proyect-pwa.vercel.app
* URL del repositorio: https://github.com/Sugeiri58/my-proyect-pwa.git

