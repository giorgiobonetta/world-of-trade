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
  // Una suite che va in crash non stampa nessuna ✗: contare solo le crocette
  // la faceva apparire verde. Conta anche l'uscita del processo.
  const crash = r.status !== 0 && k === 0;
  tot += n; falliti += k + (crash ? 1 : 0);
  console.log(`${(k || crash ? '✗' : '✓')} ${f.padEnd(20)} ${String(n).padStart(3)} passati` +
    (k ? `, ${k} FALLITI` : '') + (crash ? ', INTERROTTA' : ''));
  if (k || r.status !== 0) {
    rotte.push(f);
    if (out) console.log(out.split('\n').filter(l => l.includes('✗')).join('\n'));
    if (crash) console.log('   ' + String(r.stderr || '').split('\n').filter(Boolean).slice(0, 3).join('\n   '));
  }
}
console.log(`\n${tot} asserzioni su ${suite.length} suite` +
  (rotte.length ? ` · ${rotte.length} suite con problemi: ${rotte.join(', ')}` : ' · tutte verdi'));
process.exit(rotte.length ? 1 : 0);
