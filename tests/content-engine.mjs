import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const ctx = { window:{}, Math, console };
vm.createContext(ctx);
for (const f of ['curriculum.js','content-engine.js','career.js'])
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'), ctx);
const C = ctx.window.WOT_CONTENT, G=ctx.window.WOT_GAME, U=ctx.window.CURRICULUM;
let failed=0, passed=0;
const t=(name,ok,info='')=>{ if(ok){passed++;console.log('  ✓ '+name)}else{failed++;console.log('  ✗ '+name+(info?' — '+info:''))} };
const L=U.flatMap(u=>u.lessons), E=L.flatMap(l=>l.exercises);
t('34 units',U.length===34,String(U.length));
t('219 career levels',L.length===219,String(L.length));
t('1086 career exercises',E.length===1086,String(E.length));
t('108 generated levels',C.generatedLevels===108,String(C.generatedLevels));
t('all generated lessons validate',U.filter(u=>/^a\d+$/.test(u.id)).flatMap(u=>u.lessons).every(C.validateLesson));
t('unit metadata covers every unit',U.every(u=>G.unitMeta[u.id]));
t('Partner requires all 219 Career levels',G.ranks.some(r=>r.id==='partner'&&r.lessons===219));
const dist=[0,0,0,0];
for(const ex of E.filter(e=>e.type==='choice'&&e.options.length===4)) dist[ex.answer]++;
t('generated answer positions are not biased to A',dist.every(n=>n>20),JSON.stringify(dist));
let bad=0;
for(let seed=0;seed<1000;seed++){
  const a=C.makeMasterySet('seed-'+seed,10,1+(seed%12));
  const b=C.makeMasterySet('seed-'+seed,10,1+(seed%12));
  if(a.length!==10||JSON.stringify(a)!==JSON.stringify(b)||a.some(x=>!C.validateExercise(x.ex))) bad++;
}
t('10,000 mastery questions deterministic and valid',bad===0,String(bad));
const goodPack={lessons:[{id:'ai-demo-1',title:'Demo',goal:'A valid external content pack.',exercises:Array.from({length:5},(_,i)=>({type:'choice',prompt:'Question '+i,options:['A','B'],answer:0,why:'A sufficiently long explanation for validation and learning.'}))}]};
t('AI-ready validator accepts valid pack',C.validateExternalPack(goodPack).ok);
t('AI-ready validator rejects broken pack',!C.validateExternalPack({lessons:[{id:'x',title:'x',goal:'x',exercises:[]}]}).ok);
console.log(`\nContent engine: ${passed} passati, ${failed} falliti`);
process.exitCode=failed?1:0;
