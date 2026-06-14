const CACHE_NAME = 'exec-report-pwa-v1';
const assets = ['index.html', 'manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
    if (e.request.mode === 'navigate' || e.request.url.includes('script.google.com')) {
        return;
    }
    e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});