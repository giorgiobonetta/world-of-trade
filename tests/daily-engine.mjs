import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const ctx = { window:{}, Math, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'career.js'),'utf8'), ctx);
const G = ctx.window.WOT_GAME;
let failed = 0, passed = 0;
const t = (name, ok) => { if (ok) { passed++; console.log('  ✓ '+name); } else { failed++; console.log('  ✗ '+name); } };
const day='2026-08-26';
const a=G.makeDailyDeal(day), b=G.makeDailyDeal(day), c=G.makeDailyDeal('2026-08-27');
t('same day is deterministic', JSON.stringify(a) === JSON.stringify(b));
t('daily has four decisions', a.steps.length === 4);
t('daily id carries calendar day', a.id === `daily-${day}`);
t('daily source is a boss factory', G.bossCatalog.some(x => x.id === a.sourceBossId));
t('different dates can produce different scenarios', JSON.stringify(a) !== JSON.stringify(c));
for (const meta of G.bossCatalog) {
  for (let i=0;i<100;i++) {
    const d=G.makeBossDeal(meta.id);
    const valid=d.steps.every(st => st.skill && (st.type==='choice'
      ? Number.isInteger(st.answer) && st.answer>=0 && st.answer<st.options.length
      : Number.isFinite(Number(st.answer))));
    if (!valid) failed++;
  }
}
t('boss factories remain mechanically valid', failed === 0);
console.log(`\nDaily engine: ${passed} passati, ${failed} falliti`);
process.exitCode = failed ? 1 : 0;
