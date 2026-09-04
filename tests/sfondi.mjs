/* Ogni sezione del percorso è un corso e ha il suo sfondo. Le cose che
   possono rovinarlo, in ordine di gravità: un fondo troppo chiaro che manda
   il testo bianco sotto la soglia di contrasto; una scena che finisce davanti
   al testo invece che dietro; un tracciato senza riempimento che il CSS
   trasforma in una macchia piena; una scena che entra nell'albero di
   accessibilità e viene letta ad alta voce. Qui si verificano tutte e quattro. */
import { boot, suite, DIR } from './harness.mjs';
import fs from 'fs';

const t = suite('Sfondi delle sezioni');
const css = fs.readFileSync(DIR + '/styles.css', 'utf8');
const { w, errors } = await boot();
const L = w.__LEARN__;
const scene = w.WOT_SCENES || {};
const corsi = L.UNITS.filter(u => /^u\d+$/.test(u.id));

t('nessun errore runtime col disegno delle scene', errors.length === 0, errors.slice(0, 2).join('|'));

/* ── contrasto: il fondo più chiaro di ogni testata ── */
const Lum = h => { h = h.replace('#', '');
  const v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const R = (a, b) => { const x = Math.max(Lum(a), Lum(b)), y = Math.min(Lum(a), Lum(b)); return (x + 0.05) / (y + 0.05); };

// il titolo è bianco, il sottotitolo #d6e5ff, l'occhiello --gold-hi
const TESTI = [['titolo bianco', '#ffffff'], ['sottotitolo', '#d6e5ff'], ['occhiello oro', '#fff0b8']];
const palette = {};
for (const m of css.matchAll(/\.unit\[data-scene="([^"]+)"\]\{([^}]*)\}/g)) {
  const bg1 = /--sc-bg1:\s*(#[0-9a-fA-F]{6})/.exec(m[2]);
  const bg2 = /--sc-bg2:\s*(#[0-9a-fA-F]{6})/.exec(m[2]);
  if (bg1 && bg2) palette[m[1]] = { bg1: bg1[1], bg2: bg2[1] };
}

t('ogni scena usata ha la sua palette nel foglio di stile',
  corsi.every(u => palette[u.scene]),
  corsi.filter(u => !palette[u.scene]).map(u => `${u.id}:${u.scene}`).join(' ') || `${Object.keys(palette).length} palette`);

{
  const sotto = [];
  for (const [nome, colore] of TESTI) {
    for (const [id, p] of Object.entries(palette)) {
      // il fondo peggiore è il più chiaro dei due estremi del gradiente
      const peggiore = Lum(p.bg1) > Lum(p.bg2) ? p.bg1 : p.bg2;
      const r = R(colore, peggiore);
      if (r < 4.5) sotto.push(`${id}/${nome} ${r.toFixed(2)}:1`);
    }
  }
  t('ogni testo della testata resta sopra 4.5:1 su ogni scena',
    sotto.length === 0, sotto.slice(0, 5).join(' | ') ||
    `${Object.keys(palette).length} scene × ${TESTI.length} testi verificati`);
}

t('il fondo più scuro non è mai più chiaro di quello dichiarato chiaro',
  Object.values(palette).every(p => Lum(p.bg2) <= Lum(p.bg1)),
  Object.entries(palette).filter(([, p]) => Lum(p.bg2) > Lum(p.bg1)).map(([k]) => k).join(' ') || 'coerenti');

/* ── la testata legge davvero le variabili della scena ── */
t('la testata prende il fondo dalla palette della scena',
  /\.unit-head\{[^}]*background:linear-gradient\(180deg,var\(--sc-bg1\),var\(--sc-bg2\)\)/.test(css));
t('e il bordo pure', /\.unit-head\{[^}]*border:3px solid var\(--sc-accent\)/.test(css));
/* Il bug che ha reso identiche tutte le sedici sezioni: una regola di rifinitura
   più in basso nel foglio riscriveva il fondo con un colore fisso e !important.
   Qui si controlla che nessuna regola sulla testata lo faccia più. */
{
  const fissi = [...css.matchAll(/\.unit-head\{([^}]*)\}/g)]
    .map(m => m[1])
    .filter(d => /background:/.test(d) && !/--sc-bg1/.test(d));
  t('nessuna regola riscrive il fondo della testata con un colore fisso',
    fissi.length === 0, fissi.map(d => (d.match(/background:[^;!]*/) || [''])[0]).join(' | '));
}
t('su schermo stretto la scena si ritira',
  /@media \(max-width:520px\)\{[^}]*\.scene-art\{ width:50%/.test(css.replace(/\n\s*/g, '')));
t('la sezione dichiara i valori di ripiego, così senza scena resta leggibile',
  /\.unit\{[^}]*--sc-bg1:var\(--royal-mid\)/.test(css));

/* ── la scena sta dietro al testo ── */
t('la scena è al livello più basso della testata', /\.unit-scene\{[^}]*z-index:1/.test(css));
t('mentre occhiello, titolo e sottotitolo stanno sopra',
  /\.unit-head \.n,\.unit-head h2,\.unit-head p,\.unit-head \.unit-badge\{[^}]*z-index:3/.test(css));

/* ── un tracciato senza riempimento deve restare una linea ── */
for (const c of ['a', 'b', 'c']) {
  t(`un tracciato .${c} senza riempimento resta una linea`,
    new RegExp(`\\.scene-art \\.${c}\\[fill="none"\\]\\{fill:none;stroke:var\\(--sc-`).test(css));
}

/* ── le scene sono decorative ── */
{
  const conTesto = Object.entries(scene).filter(([, svg]) => /<text|<tspan|<title|<desc/.test(svg)).map(([k]) => k);
  t('nessuna scena contiene testo', conTesto.length === 0, conTesto.join(' '));
  const senzaAria = Object.entries(scene).filter(([, svg]) => !/aria-hidden="true"/.test(svg)).map(([k]) => k);
  t('ogni scena è nascosta alle tecnologie assistive', senzaAria.length === 0, senzaAria.join(' '));
  const conRiferimenti = Object.entries(scene)
    .filter(([, svg]) => /<image|url\(|xlink:href/.test(svg)).map(([k]) => k);
  t('nessuna scena scarica file esterni', conRiferimenti.length === 0, conRiferimenti.join(' '));
  const classiIgnote = [];
  for (const [id, svg] of Object.entries(scene))
    for (const m of svg.matchAll(/class="([^"]+)"/g))
      if (!['a', 'b', 'c', 'scene-art'].includes(m[1])) classiIgnote.push(`${id}:${m[1]}`);
  t('le scene usano solo le classi che il foglio di stile colora',
    classiIgnote.length === 0, classiIgnote.slice(0, 5).join(' '));
}

/* ── e arrivano nel percorso disegnato ── */
{
  const sezioni = [...w.document.querySelectorAll('#pathBody .unit')];
  t('il percorso disegna almeno una sezione', sezioni.length >= 1, `${sezioni.length} sezioni`);
  t('ogni sezione disegnata porta la sua scena',
    sezioni.every(s => s.dataset.scene && s.querySelector('.unit-scene .scene-art')),
    sezioni.map(s => s.dataset.scene || '—').join(' '));
  t('e la scena disegnata è quella del corso',
    sezioni.every(s => {
      const u = L.UNITS.find(x => `unit-${x.id}` === s.id);
      return u && s.dataset.scene === u.scene;
    }));
}

t.fine();
