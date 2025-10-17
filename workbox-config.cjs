module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,svg,ico,json,jpg,jpeg,webp,woff2}'],
  swDest: 'dist/service-worker.js',

  navigateFallback: '/offline.html',
  navigateFallbackDenylist: [/^\/api\//],    

  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  importScripts: ['sw-extra.js'],           

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
