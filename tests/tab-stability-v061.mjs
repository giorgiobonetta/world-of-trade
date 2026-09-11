import fs from 'node:fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const app=read('app.js'),css=read('styles.css'),ui=read('ui-polish.js'),acct=read('account-social.js'),html=read('learn.html'),sw=read('sw.js');
/* Lo svuotamento della cache passa dalla versione del service worker, non piu'
   da un "?v=NNN" ripetuto in ogni tag: sette punti da aggiornare a mano a ogni
   rilascio, e per giunta con una chiave di cache diversa da quella precaricata. */
const cacheAlmeno = n => Number((sw.match(/const VERSION = 'v(\d+)'/) || [])[1] || 0) >= n;
const serve = f => sw.includes("'" + f + "'") && (html.includes('src="' + f + '"') || html.includes('href="' + f + '"'));
const tests=[
 ['only destination hub redraws',app.includes('function renderHubForScreen(id)')&&!/if \(!immersive\) renderMetaScreens\(\)/.test(app)],
 ['same active tab does not rebuild',app.includes("if (previous === id && mainScreens.has(id))")],
 ['scroll restore happens synchronously',/window\.scrollTo\(0, clampScroll\(target\)\);[\s\S]{0,300}dispatchEvent/.test(app)],
 ['scroll restore is clamped',app.includes('function clampScroll(y)')&&app.includes('document.documentElement.scrollHeight')],
 ['switch guard is released next frame',app.includes("document.body.classList.add('tab-switching')")&&app.includes("document.body.classList.remove('tab-switching')")],
 ['all five mobile hubs have stable canvas rule',/\#pathScreen\.active,[\s\S]{0,220}\#profileScreen\.active\{[\s\S]{0,260}min-height:calc\(100dvh - var\(--app-header-h,64px\)\)/.test(css)],
 ['main hub entry animation disabled on mobile',/MOBILE TAB STABILITY PASS[\s\S]*animation:none!important/.test(css)],
 ['mobile reveal is immediate',ui.includes('mobileHub()')&&ui.includes("if (reduceMotion() || mobileHub() || !observer) el.classList.add('is-visible')")],
 ['overlay lock includes account sheets',ui.includes('.account-dialog060')&&css.includes('body.account-open060')],
 ['account shell installs synchronously on profile entry',/if\(id==='profileScreen'\)\{installProfileAccountCard\(\);loadAccount\(\)\.then\(installProfileAccountCard\);\}/.test(acct)],
 ['league internal tabs reset unsafe inherited scroll',acct.includes('if(changed) window.scrollTo(0,0);')],
 ['page and service worker agree on every v061 asset',
   serve('styles.css')&&serve('app.js')&&serve('account-social.js')&&serve('ui-polish.js')],
 ['pwa cache bumped',cacheAlmeno(53)]
];
let bad=0;for(const [n,ok] of tests){console.log(ok?'✓':'✗',n);if(!ok)bad++;}if(bad)process.exit(1);
