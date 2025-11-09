// Service Worker para funcionamiento offline
const CACHE_NAME = 'ventas-v15-network-first';
const urlsToCache = [
  '/',
  '/index.html'
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

  // ESTRATEGIA: Network First para index.html (siempre traer versión nueva)
  event.respondWith(
    fetch(event.request)
      .then(fetchResponse => {
        // Si la red responde correctamente, cachear y retornar
        if (fetchResponse && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        }
        return fetchResponse;
      })
      .catch(() => {
        // Si falla la red, intentar servir desde caché
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('Sirviendo desde caché (offline):', event.request.url);
            return cachedResponse;
          }
          // Si no hay caché y es un documento, servir index.html
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
