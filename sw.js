const CACHE_NAME = 'sima-cache-v3.4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); }))));
});

// BACKGROUND REFRESH & SINKRONISASI LATAR BELAKANG
self.addEventListener('sync', event => {
  if (event.tag === 'sync-budget-refresh') {
    event.waitUntil(self.registration.showNotification("🔄 Background Sync Active", { body: "Sistem berhasil memperbarui data di latar belakang." }));
  }
});

// REALTIME PUSH NOTIFICATION RECEIVER ENGINE
self.addEventListener('push', event => {
  let payload = { title: 'SIMA Budget Alert', body: 'Terjadi pembaruan data pada dashboard keamanan.' };
  if (event.data) {
    try { payload = event.data.json().notification; } catch(e) { payload.body = event.data.text(); }
  }
  const options = {
    body: payload.body,
    icon: 'https://lh3.googleusercontent.com/d/1VshxTxYbt6qgGmeLCLGEedA1jktW9MDD',
    badge: 'https://lh3.googleusercontent.com/d/1VshxTxYbt6qgGmeLCLGEedA1jktW9MDD',
    vibrate: [120, 60, 120],
    data: { url: 'https://budget-monitoring.vercel.app' }
  };
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// NOTIFICATION CLICK EVENT TO APP LAUNCHER
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === event.notification.data.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});