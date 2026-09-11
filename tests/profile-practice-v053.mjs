import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const read = n => fs.readFileSync(new URL(n, root),'utf8');
const html=read('learn.html'), app=read('app.js'), css=read('styles.css'), sw=read('sw.js');
/* Lo svuotamento della cache non passa piu' da "?v=NNN" ripetuto in ogni
   tag della pagina — sette punti da aggiornare a mano a ogni rilascio, e
   una chiave di cache diversa da quella che il service worker precarica.
   Lo fa la versione del service worker, che va avanti e non torna indietro. */
const cacheAlmeno = n => Number((sw.match(/const VERSION = 'v(\d+)'/) || [])[1] || 0) >= n;
const serve = f => sw.includes("'" + f + "'") && html.includes('src="' + f + '"') || sw.includes("'" + f + "'") && html.includes('href="' + f + '"');
const checks = [
 ['la pagina e il service worker indicano lo stesso foglio di stile', serve('styles.css')],
 ['e lo stesso motore', serve('app.js')],
 ['screen marker', app.includes('dataset.activeScreen = id')],
 ['profile editor markup', app.includes('profilePhotoChange') && app.includes('profileNameSave')],
 ['profile alias sync', app.includes('state.competitive.alias = name')],
 ['practice full viewport', css.includes('min-height:calc(100dvh - var(--app-header-h))!important')],
 ['practice safe-area paint', css.includes('body[data-active-screen="practiceScreen"] .tab-bar::after')],
 ['cache del service worker almeno v49', cacheAlmeno(49)]
];
let fail=0; for (const [n,ok] of checks){ console.log(`${ok?'PASS':'FAIL'} ${n}`); if(!ok) fail++; } process.exit(fail?1:0);
