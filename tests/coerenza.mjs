/* Il calcolo mostrato nella spiegazione deve produrre la risposta accettata.
   Sembra ovvio e non lo è: si trovavano esercizi dove il "perché" mostrava
   $720,000 mentre l'unica risposta accettata era -720,000. Chi calcolava
   correttamente veniva segnato errore e poi leggeva la propria risposta
   nella spiegazione. */
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {}, Math, console };
vm.createContext(ctx);
for (const f of ['curriculum.js', 'career.js', 'content-engine.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
let ok = 0, ko = 0;
const t = (n, c, i = '') => { c ? (ok++, console.log('  ✓ ' + n + (i ? ' — ' + i : '')))
                                : (ko++, console.log('  ✗ ' + n + (i ? ' — ' + i : ''))); };

const num = ctx.window.CURRICULUM.flatMap(u => u.lessons.flatMap(l =>
  l.exercises.filter(e => e.type === 'numeric').map(e => ({ e, l: l.id }))));

/* Una spiegazione ha la forma "espressione = risultato". Vanno verificate
   due cose distinte: che l'espressione produca il risultato dichiarato, e che
   il risultato dichiarato sia la risposta accettata. */
function leggiCalcolo(why) {
  const p = String(why).replace(/[$,]/g, '').replace(/−/g, '-')
    .replace(/×/g, '*').replace(/÷/g, '/');
  const m = p.match(/^\s*(\(?[-\d][-\d\s().*/+]*\)?)\s*(?:=|≈)\s*(-?[\d.]+)/);
  if (!m) return null;
  if (/%/.test(m[1])) return null;          // le percentuali hanno semantica propria
  let sinistra;
  try { sinistra = Function('"use strict";return (' + m[1] + ')')(); }
  catch (e) { return null; }
  const destra = parseFloat(m[2]);
  if (!Number.isFinite(sinistra) || !Number.isFinite(destra)) return null;
  return { sinistra, destra };
}

const internamenteRotti = [], diversiDallaRisposta = [];
for (const { e, l } of num) {
  const c = leggiCalcolo(e.why);
  if (!c) continue;
  // il calcolo prosegue oltre la prima riga: non valutabile con certezza
  if (/=\s*-?[\d.,]+\s*(hours?|days?|t\b)/i.test(e.why)) continue;
  const tol = Math.max(Number(e.tolerance) || 0, 1e-9);
  if (Math.abs(c.sinistra - c.destra) > Math.max(tol, Math.abs(c.destra) * 1e-6))
    internamenteRotti.push(`${l}: ${+c.sinistra.toFixed(2)} ≠ ${c.destra}`);
  // la spiegazione può essere a più passaggi: quel che conta è che la
  // risposta accettata compaia, non che stia dopo il primo uguale
  const cifre = (String(e.why).replace(/[$,]/g, '').replace(/−/g, '-').match(/-?\d+(?:\.\d+)?/g) || [])
    .map(Number);
  if (!cifre.some(v => Math.abs(v - e.answer) <= tol))
    diversiDallaRisposta.push(`${l}: la spiegazione non contiene ${e.answer}`);
}

t('il calcolo mostrato nella spiegazione torna',
  internamenteRotti.length === 0,
  internamenteRotti.length ? `${internamenteRotti.length} · ` + internamenteRotti.slice(0, 3).join(' | ') : '');
t('e il risultato mostrato è la risposta accettata',
  diversiDallaRisposta.length === 0,
  diversiDallaRisposta.length ? `${diversiDallaRisposta.length} · ` + diversiDallaRisposta.slice(0, 3).join(' | ') : '');

/* una risposta non intera senza tolleranza è irraggiungibile a mano */
{
  const stretti = num.filter(({ e }) => !Number.isInteger(e.answer) && !(Number(e.tolerance) > 0))
    .map(({ l, e }) => `${l}: ${e.answer}`);
  t('i risultati non interi hanno una tolleranza', stretti.length === 0, stretti.slice(0, 4).join(' | '));
}

/* se la risposta può essere negativa, il testo deve dire come esprimerla */
{
  // dove il testo enuncia la formula — "(supply − demand)" — il segno è già definito
  const muti = num.filter(({ e }) => e.answer < 0
    && !/negative|loss as|use a minus/i.test(e.prompt)
    && !/[(−-]\s*\w[\w\s]*(−|-|minus)\s*\w/i.test(e.prompt)
  ).map(({ l, e }) => `${l}: ${e.prompt.slice(0, 46)}`);
  t('gli esercizi con risposta negativa dichiarano la convenzione di segno',
    muti.length === 0, muti.length ? `${muti.length} · ` + muti.slice(0, 3).join(' | ') : '');
}

console.log(`\nCoerenza risposta/spiegazione: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
