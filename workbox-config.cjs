module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,svg,ico,json,jpg,jpeg,webp,woff2}'],
  swDest: 'dist/service-worker.js',
  // sirve offline.html cuando no haya red en una navegación
  navigateFallback: '/offline.html',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  // Si tienes importScripts, mantenlo, pero vamos a quitar el fetch handler manual (ver b)
  // importScripts: ['sw-extra.js'],
  runtimeCaching: [
    {
      urlPattern: ({request, sameOrigin}) =>
        sameOrigin && ['style','script','image','font'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-swr' }
    },
    {
      urlPattern: ({url}) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: { cacheName: 'api-network-first', networkTimeoutSeconds: 5 }
    }
  ]
};
