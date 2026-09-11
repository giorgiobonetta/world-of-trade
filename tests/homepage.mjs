// Chi apre il dominio deve vedere la landing direttamente da index.html.
// La PWA installata e il launcher nativo preservato devono invece aprire il gioco.
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
const rootRewrite = (vercel.rewrites || []).find(r => r.source === '/');
t('la radice non dipende più da una rewrite', !rootRewrite,
  rootRewrite ? JSON.stringify(rootRewrite) : 'index.html è la landing');

const index = leggi('index.html');
t('index.html è una vera landing', /class="site-nav"/.test(index) && /id="main"/.test(index));
t('index.html porta al gioco', /href="learn\.html"/.test(index));
t('index.html non reindirizza automaticamente al gioco', !/location\.replace\(['"]learn\.html/.test(index));
t('index.html usa il dominio pubblico', /https:\/\/www\.worldoftrade\.app\//.test(index));

const landing = leggi('landing.html');
t('landing.html resta disponibile come alias', landing.length > 5000, landing.length + ' byte');

const senzaCache = (vercel.headers || [])
  .filter(h => JSON.stringify(h).includes('max-age=0'))
  .map(h => h.source);
const copre = f => senzaCache.some(src => {
  if (src === '/' + f) return true;
  const rx = new RegExp('^' + src.split('(.*)')
    .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return rx.test('/' + f);
});
t('la home non viene messa in cache dal CDN', copre('index.html'), senzaCache.join(' '));
t('e nemmeno il motore del gioco', copre('app.js') && copre('learn.html'));
t('né i fogli di stile', copre('styles.css') && copre('site.css'));

const native = leggi('native-index.html');
t('il launcher nativo preservato rimanda al gioco', /learn\.html/.test(native));

const manifest = JSON.parse(leggi('manifest.webmanifest'));
t('la PWA installata apre il gioco', /learn\.html/.test(manifest.start_url || ''),
  'start_url: ' + manifest.start_url);

console.log(`\nHome page: ${passed} passati, ${failed} falliti`);
process.exitCode = failed ? 1 : 0;
