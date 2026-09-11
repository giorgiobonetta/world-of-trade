import fs from 'fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const html=read('learn.html'), app=read('app.js'), css=read('styles.css'), feel=read('game-feel.js'), sw=read('sw.js'), intro=read('intro.js');
/* La versione della cache del service worker sale a ogni rilascio: fissarla
   a un numero preciso fa fallire per sempre la suite di una funzionalita'
   vecchia. Conta che non sia RETROCEDUTA sotto la versione di quel rilascio. */
const cacheAlmeno = n => Number((sw.match(/const VERSION = 'v(\d+)'/) || [])[1] || 0) >= n;
const checks=[
 ['game feel module loaded',/game-feel\.js/.test(html)&&/game-feel\.js/.test(sw)],
 ['answer events emitted',/wot:answer/.test(app)],
 ['run complete event emitted',/wot:runcomplete/.test(app)],
 ['question transition is local, not page-wide',/#exerciseArea\.question-in/.test(css)&&!/#practiceScreen\.active[^}]*translateY/.test(css)],
 ['answer pulse does not overwrite ambient body pseudo-element',/#lessonScreen::after/.test(css)&&!/body\.answer-pulse-good::after/.test(css)],
 ['end screen shows career progress',/doneCareerLevel/.test(html)&&/doneLevelFill/.test(html)&&/done-career-progress/.test(css)],
 ['new desk reward exists',/NEW DESK UNLOCKED/.test(app)],
 ['perfect run reward exists',/PERFECT RUN/.test(app)],
 ['career lesson can continue directly to next level',/doneNextLessonId/.test(app)&&/Start next level/.test(app)],
 ['practice completion returns to Practice',/Back to Practice/.test(app)&&/doneReturnScreen = 'practiceScreen'/.test(app)],
 ['intro matches current content scale',/Welcome to the trading floor/.test(intro)&&/Clear every level in the desk/.test(intro)],
 ['PWA cache is at least v47',cacheAlmeno(47)]
];
let bad=0; for(const [name,ok] of checks){console.log(`${ok?'✓':'✗'} ${name}`); if(!ok) bad++} process.exit(bad?1:0);
