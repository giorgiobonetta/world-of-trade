importScripts('./version.js');
/* World of Trade — service worker v0.8.3
   HTML/JS/CSS are network-first so a production deploy cannot be hidden by an
   old app shell. Images/fonts remain cache-first. supabase-config.js is never cached. */
const VERSION='wot-' + (globalThis.WOT_VERSION || '0.8.3');
const STATIC=VERSION+'-static';
const SHELL=[
  './','index.html','access.html','privacy.html','glossary.html','404.html',
  'site.css','auth.css','styles.css','mobile-native.css','site.js','access-page.js',
  'version.js',
  'glossary-page.js','glossary.js','curriculum.js','landing-curriculum.js',
  'learn.html','app.js','cloud.js','career.js','competitive.js','social.js','account-social.js',
  'content-engine.js','dialog-a11y.js','experience.js','game-feel.js','ui-polish.js','intro.js','mascot.js','scenes.js','sound.js','share.js','pwa.js','native-runtime.js',
  'manifest.webmanifest','logo-crest-220.webp','world-of-trade-premium-icon-192.png','world-of-trade-premium-icon-512.png'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(STATIC).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('wot-')&&k!==STATIC).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function networkFirst(req){try{const fresh=await fetch(req);if(fresh&&fresh.ok){const c=await caches.open(STATIC);c.put(req,fresh.clone());}return fresh;}catch(e){const cached=await caches.match(req);if(cached)return cached;throw e;}}
async function cacheFirst(req){const hit=await caches.match(req);if(hit)return hit;const fresh=await fetch(req);if(fresh&&fresh.ok){const c=await caches.open(STATIC);c.put(req,fresh.clone());}return fresh;}
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(url.pathname.endsWith('/supabase-config.js')){event.respondWith(fetch(req,{cache:'no-store'}));return;}
  const ext=url.pathname.split('.').pop().toLowerCase();
  if(req.mode==='navigate'||['html','js','css','webmanifest','json','xml'].includes(ext)){event.respondWith(networkFirst(req));return;}
  event.respondWith(cacheFirst(req));
});
