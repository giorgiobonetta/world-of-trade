import fs from 'fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const css=read('styles.css'), app=read('app.js'), ui=read('ui-polish.js'), sw=read('sw.js');
const files=['landing.html','learn.html','app.js','curriculum.js','career.js','intro.js','social.js','privacy.html','glossary.html','README.md'];
const text=files.map(read).join('\n');
const checks=[
 ['header is fixed',/\.app-header\{[\s\S]*?position:fixed!important/.test(css)],
 ['content offsets fixed header',/padding-top:var\(--app-header-h\)!important/.test(css)],
 ['header height measured dynamically',/syncHeaderMetrics/.test(ui)&&/--app-header-h/.test(ui)],
 ['tab scroll positions are preserved',/const screenScroll = Object\.create\(null\)/.test(app)&&/screenScroll\[id\]/.test(app)],
 ['Practice has no upward entry animation on portrait',/#practiceScreen\.active\{animation:none!important;transform:none!important\}/.test(css)],
 ['no academic programme framing in product UI',!/(Master of Science|Geneva MSc|Université de Genève|University of Geneva|Autumn Semester|Spring Semester|MSc Core Courses|Commodity Trading master)/i.test(text)],
 ['PWA cache bumped',/const VERSION = 'v47'/.test(sw)]
];
let bad=0;for(const [n,ok] of checks){console.log(`${ok?'✓':'✗'} ${n}`);if(!ok)bad++}process.exit(bad?1:0);
