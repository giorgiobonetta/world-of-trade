import fs from 'node:fs';
const app=fs.readFileSync(new URL('../app.js', import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../learn.html', import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles.css', import.meta.url),'utf8');
const intro=fs.readFileSync(new URL('../intro.js', import.meta.url),'utf8');
const checks=[
 ['desk briefing exists', app.includes('function disegnaDeskBrief') && app.includes("run.state = 'briefing'")],
 ['brief only first desk entry', app.includes('lessonIndex === 0 && !isDone(lesson.id)')],
 ['decision counter exists', html.includes('id="lessonStep"') && app.includes("step.textContent = `${current || run.total} / ${run.total}`")],
 ['progress counts resolved decisions', app.includes('progressDone') && app.includes('decisions cleared')],
 ['next assignment preview', html.includes('doneNextPreview') && app.includes('NEXT ASSIGNMENT')],
 ['three reward stats', html.includes('doneLives') && html.includes('First try')],
 ['desk challenge language', app.includes('Desk Challenge')],
 ['two-step onboarding', intro.includes('Go to Desk 1') && intro.includes('Welcome to the trading floor')],
 ['first-node callout', css.includes('.node.first-callout')],
 ['new desk reward animation', css.includes('wotDeskShine')],
];
let bad=0; for(const [name,ok] of checks){console.log(ok?'PASS':'FAIL',name); if(!ok)bad++;}
if(bad) process.exit(1);
