const CACHE    = 'ha-v2';
const PAGES    = ['/', '/index.html'];
const FALLBACK = '/index.html';

// On install: cache the shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting())
  );
});

// On activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Navigation requests: network-first with cache fallback (SPA shell)
// - Images: cache-first (long lived)
// - JS/CSS assets: network-first, cache fallback
// - API / Supabase: network-only (never cache)
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Never intercept non-GET or Supabase / external API calls
  if (request.method !== 'GET') return;
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname !== self.location.hostname) return;

  // HTML navigation → network-first, fallback to cached shell
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(FALLBACK))
    );
    return;
  }

  // Images → cache-first (saves bandwidth on repeat visits)
  if (request.destination === 'image') {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // JS/CSS → network-first with cache fallback
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
