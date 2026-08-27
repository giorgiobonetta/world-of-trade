import fs from 'node:fs';
global.window={CURRICULUM:[]};
new Function(fs.readFileSync('./content-engine.js','utf8'))();
for (const u of window.WOT_CONTENT.advancedUnits){
 console.log(`\n# ${u.id} ${u.title}`);
 for(const l of u.lessons){
  console.log(`\n## ${l.id} ${l.title} — ${l.goal}`);
  l.exercises.forEach((e,i)=>console.log(`${i+1}. [${e.type}] ${e.prompt}`));
 }
}
