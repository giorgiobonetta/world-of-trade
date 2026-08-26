/* World of Trade — Learn · service worker
   Regola: l'HTML si prende dalla rete quando c'è (così un aggiornamento
   arriva subito), tutto il resto dalla cache (così l'app parte offline).
   La versione nel nome della cache è ciò che manda via una shell vecchia. */
const VERSION = 'v7';
const CACHE = `wot-learn-${VERSION}`;

const SHELL = [
  './',
  'index.html',
  'learn.html',
  'styles.css',
  'app.js',
  'pwa.js',
  'cloud.js',
  'share.js',
  'supabase-config.js',
  'curriculum.js',
  'mascot.js',
  'manifest.webmanifest',
  'logo-crest-500.webp',
  'logo-crest-500.png',
  'logo-crest-220.webp',
  'logo-crest-220.png',
  'world-of-trade-premium-icon-192.png',
  'world-of-trade-premium-icon-512.png',
  'icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // un file mancante non deve annullare l'intero precache: uno alla volta
    await Promise.all(SHELL.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isHTML = req =>
  req.mode === 'navigate' ||
  (req.headers.get('accept') || '').includes('text/html');

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // font e CDN: lascio fare al browser

  if (isHTML(req)) {
    // rete per prima: una nuova versione non resta mai nascosta dietro la cache
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await caches.match(req) || await caches.match('learn.html');
        return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
    return;
  }

  // asset: cache per prima, poi aggiorno in background
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => null);
    return cached || (await network) || new Response('', { status: 504 });
  })());
});

// permette alla pagina di forzare l'attivazione di una versione nuova
self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});
