// Chi apre il dominio deve vedere la landing, non la schermata di accesso.
// L'app nativa e la PWA installata devono invece continuare ad aprire il gioco.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const leggi = f => fs.readFileSync(path.join(root, f), 'utf8');

let failed = 0, passed = 0;
const t = (name, ok, extra = '') => {
  if (ok) { passed++; console.log('  ✓ ' + name + (extra ? ' — ' + extra : '')); }
  else { failed++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
};

const vercel = JSON.parse(leggi('vercel.json'));
const rew = vercel.rewrites || [];
const home = rew.find(r => r.source === '/');

t('vercel.json dichiara una riscrittura per la radice', !!home,
  home ? '/ → ' + home.destination : 'nessuna: il dominio aprirebbe index.html');

t('la radice serve la landing', home && /landing\.html$/.test(home.destination),
  home ? home.destination : '');

t('il file servito sulla radice esiste', home && fs.existsSync(path.join(root, home.destination.replace(/^\//, ''))));

const landing = leggi('landing.html');
t('la landing porta al gioco', /href="learn\.html"/.test(landing));
t('la landing non è vuota', landing.length > 5000, landing.length + ' byte');

// La riscrittura non deve mettere in cache la home: cambia a ogni pubblicazione.
const senzaCache = (vercel.headers || [])
  .filter(h => JSON.stringify(h).includes('max-age=0'))
  .map(h => h.source);
t('la landing non viene messa in cache dal CDN', senzaCache.includes('/landing.html'));

// Il guscio Capacitor carica index.html dal filesystem locale: deve restare
// un trampolino verso il gioco, altrimenti l'app nativa si apre sulla vetrina.
const index = leggi('index.html');
t('index.html rimanda al gioco (serve al guscio nativo)', /learn\.html/.test(index));

// La PWA installata parte dal gioco, non dalla landing.
const manifest = JSON.parse(leggi('manifest.webmanifest'));
t('la PWA installata apre il gioco', /learn\.html/.test(manifest.start_url || ''),
  'start_url: ' + manifest.start_url);

console.log(`\nHome page: ${passed} passati, ${failed} falliti`);
process.exitCode = failed ? 1 : 0;
