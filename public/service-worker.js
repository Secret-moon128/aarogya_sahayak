/* eslint-disable no-restricted-globals */


const CACHE_NAME = 'aarogya-cache-v1';
const urlsToCache = [
  '/', // Cache the root
  '/index.html',
  // Include other assets that your app needs offline, e.g.,
  // '/static/js/bundle.js',
  // '/static/css/main.css',
  // Add icons, fonts, etc. as required
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - cleanup old caches if any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});

// Fetch event - serve cached assets when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found, else fetch from network
        return cachedResponse || fetch(event.request);
      })
  );
});
