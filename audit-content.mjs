import fs from 'node:fs';
global.window={CURRICULUM:[]};
const src=fs.readFileSync('./content-engine.js','utf8');
new Function(src)();
for (const w of window.WOT_CONTENT.worlds){
  const pool=window.WOT_CONTENT.poolOf(w);
  console.log(`\n## ${w.id} ${w.title} pool=${pool.length}`);
  pool.forEach((fn,i)=>{
    let ex; try{ ex=fn((()=>{let x=0.417; return ()=> (x=(x*9301+49297)%233280)/233280;})()); }catch(e){ex={type:'ERR',prompt:e.message}}
    console.log(`${i}\t${ex.type}\t${ex.prompt}\tWHY: ${ex.why||''}`);
  });
}
