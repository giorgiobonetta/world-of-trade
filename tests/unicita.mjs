/* Nessuna domanda deve ripetersi dentro la stessa unità.
   Trovato il 26/8: i 360 esercizi generati contenevano 177 domande distinte,
   con gruppi ripetuti fino a 6 volte — una per ogni lezione dell'unità,
   identici a meno dell'ordine delle opzioni. Chi studiava un desk incontrava
   la stessa domanda sei volte e capiva che era riempitivo. */
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
const U = ctx.window.CURRICULUM;

let ko = 0, ok = 0;
const t = (n, c, i = '') => { c ? (ok++, console.log('  ✓ ' + n + (i ? ' — ' + i : '')))
                                : (ko++, console.log('  ✗ ' + n + (i ? ' — ' + i : ''))); };

/* Due domande sono la stessa se chiedono la stessa cosa. Conta il prompt, ma
   anche il contenuto specifico del tipo: "Complete the sentence" è l'istruzione
   generica di tutti gli esercizi build, con frasi diverse — confrontare solo il
   prompt li segnalerebbe tutti come duplicati. */
const identita = e => JSON.stringify([
  e.type, e.prompt,
  (e.options || []).slice().sort(),
  e.answer !== undefined && e.type === 'numeric' ? e.answer : null,
  (e.sentence || []).join('|'),
  (e.items || []).slice().sort().join('|'),
  (e.pairs || []).map(p => p.join('=')).sort().join('|'),
]);
const scheletro = s => String(s).replace(/-?[\d][\d.,]*/g, '#').replace(/\s+/g, ' ').trim();

const tutte = U.flatMap(u => u.lessons.flatMap(l => l.exercises.map(e => ({ e, u: u.id, l: l.id }))));
const generate = tutte.filter(x => /^a\d+$/.test(x.u));

/* ── 1 · nessuna ripetizione dentro l'unità ── */
{
  const brutti = [];
  for (const u of U) {
    const dentro = {};
    u.lessons.forEach(l => l.exercises.forEach(e => {
      const k = identita(e);
      (dentro[k] = dentro[k] || []).push(l.id);
    }));
    Object.entries(dentro).filter(([, v]) => v.length > 1).forEach(([k, v]) =>
      brutti.push(`${u.id}: ${v.length}× "${JSON.parse(k)[1].slice(0, 52)}" [${v.join(' ')}]`));
  }
  t('nessuna domanda si ripete dentro la stessa unità', brutti.length === 0,
    brutti.length ? `${brutti.length} gruppi · ` + brutti.slice(0, 3).join(' | ') : '');
}

/* ── 2 · quante domande distinte ci sono davvero ── */
{
  const distinte = new Set(generate.map(x => identita(x.e))).size;
  const quota = distinte / generate.length;
  t('almeno il 95% degli esercizi generati è una domanda distinta', quota >= 0.95,
    `${distinte} distinte su ${generate.length} (${Math.round(quota * 100)}%)`);
}

/* ── 3 · varietà di forma: non solo numeri diversi nello stesso testo ── */
{
  const sk = new Set(generate.map(x => scheletro(x.e.prompt))).size;
  // obiettivo: ~20 concetti per desk × 12 desk = 240 forme
  t('almeno 200 forme di domanda diverse fra le generate', sk >= 200,
    `${sk} scheletri su ${generate.length} prompt`);
  // e nessuna forma può dominare un'unità
  const troppo = [];
  for (const u of U.filter(x => /^a\d+$/.test(x.id))) {
    const c = {};
    u.lessons.forEach(l => l.exercises.forEach(e => { const k = scheletro(e.prompt); c[k] = (c[k] || 0) + 1; }));
    // un esercizio numerico ripetuto con valori nuovi è un esercizio diverso:
    // è un drill legittimo. Tre volte per desk è il limite; una domanda a
    // scelta, che è testo fisso, non deve ripetersi affatto.
    Object.entries(c).filter(([, n]) => n > 3).forEach(([k, n]) => troppo.push(`${u.id} ${n}× ${k.slice(0, 44)}`));
  }
  t('nessuna forma appare più di tre volte nella stessa unità', troppo.length === 0,
    troppo.slice(0, 3).join(' | '));
  const chRip = [];
  for (const u of U.filter(x => /^a\d+$/.test(x.id))) {
    const c = {};
    u.lessons.forEach(l => l.exercises.filter(e => e.type === 'choice')
      .forEach(e => { c[e.prompt] = (c[e.prompt] || 0) + 1; }));
    Object.entries(c).filter(([, n]) => n > 1).forEach(([k, n]) => chRip.push(`${u.id} ${n}× ${k.slice(0, 40)}`));
  }
  t('nessuna domanda a scelta si ripete nello stesso desk', chRip.length === 0,
    chRip.slice(0, 3).join(' | '));
}

/* ── 4 · le unità curate a mano non devono regredire ── */
{
  const curate = tutte.filter(x => !/^a\d+$/.test(x.u));
  const d = new Set(curate.map(x => identita(x.e))).size;
  t('le 8 unità curate restano tutte distinte', d === curate.length,
    `${d} su ${curate.length}`);
}

/* ── 5 · ogni unità mantiene il suo numero di esercizi ── */
{
  const scarse = U.filter(u => u.lessons.reduce((a, l) => a + l.exercises.length, 0) < 12)
    .map(u => u.id + ':' + u.lessons.reduce((a, l) => a + l.exercises.length, 0));
  t('nessuna unità scende sotto 12 esercizi', scarse.length === 0, scarse.join(' '));
  const generateU = U.filter(u => /^a\d+$/.test(u.id));
  const conteggi = generateU.map(u => u.lessons.reduce((a, l) => a + l.exercises.length, 0));
  t('le unità specialistiche tengono 30 esercizi', conteggi.every(n => n === 30),
    [...new Set(conteggi)].join(','));
}

/* ── 6 · niente notazione ambigua ── */
{
  // "$3m" col simbolo di valuta è chiaro; "6m" nudo si legge anche "6 mesi"
  const ambigue = generate.filter(x => /(^|[^$\d])\d+\s?m(?![\w³3])/i.test(x.e.prompt) && !/month/i.test(x.e.prompt));
  t('nessun importo scritto come "6m" senza valuta', ambigue.length === 0,
    ambigue.slice(0, 2).map(x => x.e.prompt.slice(0, 56)).join(' | '));
}

console.log(`\nUnicità dei contenuti: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
