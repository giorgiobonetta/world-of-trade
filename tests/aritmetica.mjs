/* Oracolo indipendente per gli esercizi numerici generati.
   Il generatore calcola la risposta con la sua formula; qui la risposta viene
   ricostruita partendo SOLO dai numeri che compaiono nel testo, provando le
   combinazioni che un desk userebbe. Se nessuna combinazione ci arriva,
   l'esercizio va guardato a mano: o la formula è sbagliata, o il testo non
   contiene i dati per risolverlo — e il secondo caso è un problema uguale. */
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const ctx = { window: {}, Math, console };
vm.createContext(ctx);
for (const f of ['curriculum.js', 'content-engine.js', 'career.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);

let ok = 0, ko = 0;
const t = (n, c, i = '') => { c ? (ok++, console.log('  ✓ ' + n + (i ? ' — ' + i : '')))
                                : (ko++, console.log('  ✗ ' + n + (i ? ' — ' + i : ''))); };

const numeri = s => (String(s).match(/[\d][\d.,]*/g) || [])
  .map(x => parseFloat(x.replace(/,/g, ''))).filter(Number.isFinite);

function candidati(n) {
  const c = new Set();
  const add = v => { if (Number.isFinite(v)) { c.add(v); c.add(-v); } };
  const N = n.length;
  for (let i = 0; i < N; i++) {
    add(n[i]);
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      add(n[i] + n[j]); add(n[i] - n[j]); add(n[i] * n[j]); add(n[i] / n[j]);
      add(n[i] * n[j] / 100); add(n[i] * (1 + n[j] / 100)); add(n[i] * (1 - n[j] / 100));
      for (let k = 0; k < N; k++) {
        if (k === i || k === j) continue;
        add(n[i] - n[j] - n[k]);
        add((n[i] - n[j]) * n[k]); add((n[i] + n[j]) * n[k]);
        add(n[i] * n[j] + n[k]); add(n[i] * n[j] - n[k]); add(n[i] * n[j] * n[k]);
        add(n[i] * n[j] / n[k]); add(n[i] / n[j] * n[k]);
        add(n[i] * n[j] / 100 * n[k]); add(n[i] * n[j] / 100 / 360 * n[k]);
        add(n[i] * (1 - n[k] / n[j]));
        for (let m = 0; m < N; m++) {
          if ([i, j, k].includes(m)) continue;
          add(n[i] - n[j] - n[k] - n[m]);
          add((n[i] - n[j] - n[k]) * n[m]);
          add((n[i] - n[j]) * n[k] / n[m]);
          add(n[i] * n[j] / 100 * n[k] / n[m]);
        }
      }
    }
  }
  return c;
}

const U = ctx.window.CURRICULUM;
const gen = U.filter(u => /^a\d+$/.test(u.id))
  .flatMap(u => u.lessons.flatMap(l => l.exercises.map(e => ({ e, u: u.id, l: l.id }))))
  .filter(x => x.e.type === 'numeric');

const irrisolti = [];
for (const { e, u, l } of gen) {
  const tol = Math.max(Number(e.tolerance) || 0, Math.abs(e.answer) * 1e-6, 0.011);
  const set = candidati(numeri(e.prompt));
  if (![...set].some(v => Math.abs(v - e.answer) <= tol)) irrisolti.push(`${u}/${l}: "${e.prompt.slice(0, 62)}" → ${e.answer}`);
}
t(`ogni risposta numerica generata è ricostruibile dai dati del testo (${gen.length} esercizi)`,
  irrisolti.length === 0, irrisolti.slice(0, 5).join(' | '));

/* il testo deve contenere abbastanza numeri per essere risolvibile */
{
  const poveri = gen.filter(x => numeri(x.e.prompt).length < 2)
    .map(x => `${x.u}: ${x.e.prompt.slice(0, 50)}`);
  t('ogni esercizio numerico espone almeno due dati', poveri.length === 0, poveri.slice(0, 3).join(' | '));
}

/* una tolleranza serve solo se il risultato non è intero */
{
  const sospetti = gen.filter(x => !Number.isInteger(x.e.answer) && !(Number(x.e.tolerance) > 0))
    .map(x => `${x.u}: ${x.e.answer}`);
  t('i risultati non interi hanno una tolleranza', sospetti.length === 0, sospetti.slice(0, 4).join(' | '));
}

/* l'unità di misura deve esserci: "1100000" senza unità non insegna nulla */
{
  const senza = gen.filter(x => !x.e.unit || !String(x.e.unit).trim()).map(x => x.u);
  t('ogni esercizio numerico dichiara l\'unità di misura', senza.length === 0, [...new Set(senza)].join(','));
}

/* le risposte assurde tradiscono un errore di scala */
{
  const strane = gen.filter(x => Math.abs(x.e.answer) > 5e9 || (x.e.answer !== 0 && Math.abs(x.e.answer) < 0.01))
    .map(x => `${x.u}: ${x.e.answer} ${x.e.unit}`);
  t('nessuna risposta con un ordine di grandezza implausibile', strane.length === 0, strane.slice(0, 4).join(' | '));
}

/* la spiegazione deve mostrare il calcolo, non solo affermarlo */
{
  const muti = gen.filter(x => !/[×x*+\-−÷/=]/.test(x.e.why)).map(x => `${x.u}: ${x.e.why.slice(0, 46)}`);
  t('ogni spiegazione mostra il calcolo', muti.length === 0, muti.slice(0, 3).join(' | '));
}

console.log(`\nAritmetica generata: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
