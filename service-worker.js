// service-worker.js
// Versión: 2025-12-10_v1
const CACHE_VERSION = 'v1.20251210';
const PRECACHE_NAME = `precache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',                      // index.html
  '/index.html',
  '/styles.css',
  '/script.js',
  '/site.webmanifest',
  '/manifest.json',
  '/images/favicon-32x32.png',
  '/images/favicon-16x16.png',
  '/images/apple-touch-icon.png',
  '/images/offline-image.png',
  '/images/banner.webp',
  '/images/perfil.webp',
  '/images/preview.jpg',
  // añade aquí otras imágenes críticas o assets que quieras precachear
  '/photo-gallery/1.webp',
  '/photo-gallery/2.webp',
  '/photo-gallery/3.webp',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => (key !== PRECACHE_NAME && key !== RUNTIME_CACHE))
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Strategy: Cache-first for precached assets, Network-first for HTML/form submission, Runtime-cache for images/APIs
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET
  if (req.method !== 'GET') return;

  // Serve navigation (HTML) with network-first so form submissions are reliable
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(networkRes => {
        // update cache
        caches.open(RUNTIME_CACHE).then(cache => cache.put(req, networkRes.clone()));
        return networkRes;
      }).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Images and media: cache-first with runtime cache fallback to precache then offline placeholder
  if (req.destination === 'image' || /\.(png|jpg|jpeg|webp|gif|svg)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(networkRes => {
          return caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        }).catch(() => caches.match('/images/offline-image.png'));
      })
    );
    return;
  }

  // CSS/JS: stale-while-revalidate
  if (req.destination === 'style' || req.destination === 'script' || /\.css$|\.js$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const networkFetch = fetch(req).then(networkRes => {
          caches.open(RUNTIME_CACHE).then(cache => cache.put(req, networkRes.clone()));
          return networkRes;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => {
      // fallback to precache root
      if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
        return caches.match('/offline.html');
      }
      return;
    }))
  );
});
