import fs from 'fs';
const app = fs.readFileSync(new URL('../app.js', import.meta.url),'utf8');
const cloud = fs.readFileSync(new URL('../cloud.js', import.meta.url),'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url),'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url),'utf8');
/* La versione della cache del service worker sale a ogni rilascio: fissarla
   a un numero preciso fa fallire per sempre la suite di una funzionalita'
   vecchia. Conta che non sia RETROCEDUTA sotto la versione di quel rilascio. */
const cacheAlmeno = n => Number((sw.match(/const VERSION = 'v(\d+)'/) || [])[1] || 0) >= n;
let fail=0;
const ok=(cond,msg)=>{ console.log(`${cond?'✓':'✗'} ${msg}`); if(!cond) fail++; };
ok(app.includes("profile: { name:'', avatar:'', updatedAt:0 }"),'profile state has name, avatar and timestamp');
ok(app.includes('profilePhotoInput') && app.includes('profileNameInput'),'Profile UI exposes photo and name controls');
ok(app.includes("canvas.toDataURL('image/jpeg', .82)"),'profile photo is compressed client-side');
ok(cloud.includes('mergeProfile') && cloud.includes('profile: mergeProfile(a.profile, b.profile)'),'cloud merge persists latest profile');
ok(cloud.includes("owns(newer,'avatar') ? newer.avatar"),'removing a profile photo survives cloud merge');
ok(css.includes('html{\n  min-height:100%;\n  background:#050d20;'),'root background prevents white overscroll strip');
ok(css.includes('#practiceScreen.active{\n    min-height:calc(100dvh - var(--app-header-h) - 78px'),'Practice fills usable portrait viewport');
ok(cacheAlmeno(49),'PWA cache is at least v49');
process.exit(fail?1:0);
