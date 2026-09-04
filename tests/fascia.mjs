/* La fascia di unità in cima al percorso. La logica vera è una sola —
   quale unità mostrare, dato dove si è arrivati a scorrere — ed è tenuta
   separata dallo scorrimento proprio per poterla provare: jsdom non
   restituisce posizioni reali, quindi un test che si affidasse ai
   rettangoli non proverebbe nulla. */
import { boot, suite, DIR } from './harness.mjs';
import fs from 'fs';

const CSS = fs.readFileSync(DIR + '/styles.css', 'utf8');
const t = suite('Fascia di unità');
const { w, errors } = await boot();
const L = w.__LEARN__;
const d = w.document;

t('la fascia esiste nella pagina', !!d.getElementById('unitBanner'));
t('resta in cima mentre si scorre',
  /\.unit-banner\{[^}]*position:sticky/.test(CSS));

/* ── la scelta dell'unità ── */
{
  const cime = [
    { id: 'u1', top: -400 },
    { id: 'u2', top: -120 },
    { id: 'u3', top: 300 },
  ];
  t('mostra l’ultima unità già passata sotto la fascia',
    L.unitaInFascia(cime, 60) === 'u2', String(L.unitaInFascia(cime, 60)));
  t('non anticipa quella ancora sotto',
    L.unitaInFascia(cime, 60) !== 'u3');
  t('in cima al percorso mostra la prima',
    L.unitaInFascia([{ id: 'u1', top: 200 }, { id: 'u2', top: 900 }], 60) === 'u1');
  t('e con una lista vuota non esplode',
    L.unitaInFascia([], 60) === null);
}

/* ── quello che scrive ── */
{
  const prima = L.UNITS[0];
  L.disegnaFascia(prima.id);
  const b = d.getElementById('unitBanner');
  t('disegnata, la fascia è visibile', b.hidden === false);
  t('dice il titolo del desk',
    d.getElementById('unitBannerTitle').textContent === prima.title,
    d.getElementById('unitBannerTitle').textContent);
  const kicker = d.getElementById('unitBannerKicker').textContent;
  t('e dice sezione e posizione nel percorso',
    /Section \d+/.test(kicker) && /Course 1 of \d+/.test(kicker), kicker);
  t('ricorda a quale unità si riferisce', b.dataset.unit === prima.id);
}

/* ── il colore cambia per sezione ── */
{
  const sezioni = new Set();
  for (const u of L.UNITS) { L.disegnaFascia(u.id); sezioni.add(d.getElementById('unitBanner').dataset.section); }
  t('le sezioni sono più di una', sezioni.size >= 4, [...sezioni].sort().join(' '));
  t('ognuna ha il suo colore nel foglio di stile',
    [...sezioni].every(n => new RegExp(`\\.unit-banner\\[data-section="${n}"\\]`).test(CSS)),
    [...sezioni].sort().join(' '));
  t('nessuna sezione resta senza numero',
    [...sezioni].every(n => /^\d+$/.test(n)));
}

/* ── ogni unità sa a che sezione appartiene ── */
t('ogni unità ha una sezione riconosciuta',
  L.UNITS.every(u => L.SEZIONI.includes(L.fasediUnita(u.id))),
  L.UNITS.filter(u => !L.SEZIONI.includes(L.fasediUnita(u.id))).map(u => u.id).join(' ') || 'tutte');

/* ── il pulsante del glossario ── */
{
  L.disegnaFascia('u10');
  const g = d.getElementById('unitBannerGuide');
  t('c’è un pulsante verso il glossario', !!g);
  t('con un nome leggibile ad alta voce',
    (g.getAttribute('aria-label') || '').length > 8, g.getAttribute('aria-label'));
  const gp = fs.readFileSync(DIR + '/glossary-page.js', 'utf8');
  t('e il glossario sa aprirsi filtrato su un’unità',
    /URLSearchParams\(location\.search\)\.get\('unit'\)/.test(gp));
}

/* ── fuori dal percorso non deve restare appesa ── */
{
  L.disegnaFascia(L.UNITS[0].id);
  w.dispatchEvent(new w.CustomEvent('wot:screen', { detail: { id: 'playScreen' } }));
  t('cambiando scheda la fascia sparisce',
    d.getElementById('unitBanner').hidden === true);
}

t('nessun errore in console', errors.length === 0, errors.slice(0, 2).join(' | '));

t.fine();
