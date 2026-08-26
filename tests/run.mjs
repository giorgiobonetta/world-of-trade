/* Esegue tutte le suite e riassume. `npm test` da questa cartella. */
import { spawnSync } from 'child_process';
import fs from 'fs';
const suite = fs.readdirSync(new URL('.', import.meta.url))
  .filter(f => f.endsWith('.mjs') && !['harness.mjs','run.mjs'].includes(f)).sort();
let tot = 0, falliti = 0, rotte = [];
for (const f of suite) {
  const r = spawnSync('node', [f], { encoding: 'utf8' });
  const out = r.stdout || '';
  const n = (out.match(/✓/g) || []).length;
  const k = (out.match(/✗/g) || []).length;
  tot += n; falliti += k;
  console.log(`${(k ? '✗' : '✓')} ${f.padEnd(20)} ${String(n).padStart(3)} passati${k ? `, ${k} FALLITI` : ''}`);
  if (k || r.status !== 0) { rotte.push(f); if (out) console.log(out.split('\n').filter(l => l.includes('✗')).join('\n')); }
}
console.log(`\n${tot} asserzioni su ${suite.length} suite` + (falliti ? ` · ${falliti} FALLITE` : ' · tutte verdi'));
process.exit(rotte.length ? 1 : 0);
