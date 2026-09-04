import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const read = n => fs.readFileSync(new URL(n, root),'utf8');
const html=read('learn.html'), app=read('app.js'), css=read('styles.css'), sw=read('sw.js');
const checks = [
 ['CSS cache bust', html.includes('styles.css?v=053')],
 ['app cache bust', html.includes('app.js?v=053')],
 ['screen marker', app.includes('dataset.activeScreen = id')],
 ['profile editor markup', app.includes('profilePhotoChange') && app.includes('profileNameSave')],
 ['profile alias sync', app.includes('state.competitive.alias = name')],
 ['practice full viewport', css.includes('min-height:calc(100dvh - var(--app-header-h))!important')],
 ['practice safe-area paint', css.includes('body[data-active-screen="practiceScreen"] .tab-bar::after')],
 ['sw v49', sw.includes("const VERSION = 'v49'")]
];
let fail=0; for (const [n,ok] of checks){ console.log(`${ok?'PASS':'FAIL'} ${n}`); if(!ok) fail++; } process.exit(fail?1:0);
