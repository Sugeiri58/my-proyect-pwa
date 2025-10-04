// workbox-config.js
module.exports = {
  // 👇 ¡Siempre sobre los archivos construidos!
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,svg,ico,json,jpg,jpeg,webp,woff2}'
  ],
  // 👇 El SW se genera en dist y se sirve como /service-worker.js
  swDest: 'dist/service-worker.js',

  // App Shell: si falla la navegación, sirve index.html desde caché
  navigateFallback: '/index.html',

  // Limpia cachés viejas de versiones anteriores
  cleanupOutdatedCaches: true,

  // Evita cachear archivos gigantes por error (ajusta si lo necesitas)
  maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB

  // Mantén UTM y fbclid fuera del caché para no multiplicar entradas
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],

  // Estrategias en runtime (complementan el precache)
  runtimeCaching: [
    {
      // JS/CSS/imagenes/fonts locales: SWR = rápido y se actualiza en 2º plano
      urlPattern: ({ request, sameOrigin }) =>
        sameOrigin && ['style','script','image','font'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-swr' }
    },
    {
      // Google Fonts (opcional)
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'google-fonts' }
    }
  ]
};
