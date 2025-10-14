module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,svg,ico,json,jpg,jpeg,webp,woff2}'],
  swDest: 'dist/service-worker.js',

  // Fallback para navegaciones sin red
  navigateFallback: '/offline.html',
  //EXCLUIR todas las rutas /api/* del fallback de navegación
  navigateFallbackDenylist: [/^\/api\//],

  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,

  //vuelve a importar tus handlers de push/sync
  importScripts: ['sw-extra.js'],

  runtimeCaching: [
    // assets estáticos -> Stale-While-Revalidate
    {
      urlPattern: ({request, sameOrigin}) =>
        sameOrigin && ['style','script','image','font'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-swr' }
    },
    // llamadas fetch a /api/* -> NetworkFirst (NO afecta a navegaciones)
    {
      urlPattern: ({url}) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: { cacheName: 'api-network-first', networkTimeoutSeconds: 5 }
    }
  ]
};
