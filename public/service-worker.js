// Service Worker para funcionamiento offline
const CACHE_NAME = 'ventas-v7-mobile-sidebar-fix';
const urlsToCache = [
  '/',
  '/index.html',
  'https://unpkg.com/qrcode@1.5.0/build/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://unpkg.com/html5-qrcode@2.3.4/html5-qrcode.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  // Solo cachear peticiones GET del mismo origen
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retornar del cache si existe
        if (response) {
          // Intentar actualizar en segundo plano
          fetch(event.request).then(fetchResponse => {
            if (fetchResponse && fetchResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, fetchResponse.clone());
              });
            }
          }).catch(() => {
            // Falló la actualización, pero tenemos cache
          });
          return response;
        }

        // Si no está en cache, intentar obtener de red
        return fetch(event.request).then(fetchResponse => {
          // Verificar si es una respuesta válida
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type === 'error') {
            return fetchResponse;
          }

          // Clonar la respuesta
          const responseToCache = fetchResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return fetchResponse;
        }).catch(() => {
          // Si falla la red y no hay cache, retornar página offline
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
