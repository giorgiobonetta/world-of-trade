import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const read = f => fs.readFileSync(new URL(f, root), 'utf8');
const feel = read('game-feel.js'), html = read('learn.html'), sw = read('sw.js'), app=read('app.js'), css=read('styles.css');
/* Lo svuotamento della cache non passa piu' da "?v=NNN" ripetuto in ogni
   tag della pagina — sette punti da aggiornare a mano a ogni rilascio, e
   una chiave di cache diversa da quella che il service worker precarica.
   Lo fa la versione del service worker, che va avanti e non torna indietro. */
const cacheAlmeno = n => Number((sw.match(/const VERSION = 'v(\d+)'/) || [])[1] || 0) >= n;
const serve = f => sw.includes("'" + f + "'") && html.includes('src="' + f + '"') || sw.includes("'" + f + "'") && html.includes('href="' + f + '"');
const checks = [
  ['desk unlock reward', feel.includes('NEW DESK UNLOCKED') && feel.includes('Enter Desk')],
  ['promotion reward', feel.includes('CAREER PROMOTION')],
  ['achievement reward', feel.includes('ACHIEVEMENT UNLOCKED')],
  ['rank progress', feel.includes('reward-rank055') && feel.includes('rankProgress')],
  // il nodo corrente porta un invito a partire, non un'etichetta di stato
  ['current tag', feel.includes("tag.textContent = 'START'")],
  ['reward queue', feel.includes('rewardQueue') && feel.includes('showNextReward')],
  ['profile preserved', app.includes('profile-editor') && app.includes('profilePhotoChange') && app.includes('profileNameSave')],
  ['practice hardfix preserved', css.includes('HARD FIX: PRACTICE CANVAS') && css.includes('#practiceScreen.active')],
  ['pagina e service worker concordano su motore, stile e game feel',
    serve('app.js') && serve('styles.css') && serve('game-feel.js')],
  ['pwa bump', cacheAlmeno(51)],
];
let bad=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`); if(!ok) bad++;}
if(bad) process.exit(1);
