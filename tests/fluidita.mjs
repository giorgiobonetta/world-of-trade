/* Fluidità. Non "sembra veloce" ma proprietà misurabili: cosa viene animato,
   che cosa continua a girare quando nessuno guarda, e se la pagina si muove
   sotto le dita dell'utente senza che l'abbia chiesto.

   Il criterio sulle animazioni è che il browser sa comporre solo transform e
   opacity senza rifare layout e pittura: tutto il resto costa un fotogramma. */
import { boot, solver, suite, DIR } from './harness.mjs';
import fs from 'fs';

const CSS = fs.readFileSync(DIR + '/styles.css', 'utf8');
const HTML = fs.readFileSync(DIR + '/learn.html', 'utf8');
const t = suite('Fluidità');

/* ── 1 · le animazioni non devono ridipingere ─────────────────────── */
const COSTOSE = ['box-shadow', 'filter', 'width', 'height', 'top', 'left',
                 'right', 'bottom', 'margin', 'padding', 'background', 'border',
                 'font-size'];

const keyframes = [...CSS.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]|\{[^}]*\})*)\}/g)]
  .map(m => ({ nome: m[1], corpo: m[2] }));

t('ci sono animazioni da controllare', keyframes.length > 10, `${keyframes.length} keyframes`);

const sporche = keyframes
  .map(k => ({ nome: k.nome, male: COSTOSE.filter(p => new RegExp(`(^|[;{\\s])${p}\\s*:`).test(k.corpo)) }))
  .filter(k => k.male.length);
t('nessuna animazione ridipinge a ogni fotogramma',
  sporche.length === 0,
  sporche.map(k => `${k.nome}: ${k.male.join(',')}`).join(' | '));

/* la rotta tratteggiata è l'unica eccezione ammessa, ed è decorativa:
   deve almeno fermarsi quando non la guarda nessuno */
t('anche la decorazione dello sfondo si ferma a scheda nascosta',
  /body\.in-pausa[^{]*\.bd-route/.test(CSS));
t('e durante una lezione',
  /body\.immersive[^{]*\.bd-route/.test(CSS));

/* ── 2 · il movimento si può spegnere ─────────────────────────────── */
const infinite = (CSS.match(/animation:[^;}]*infinite/g) || []).length;
t('le animazioni continue sono poche', infinite <= 14, `${infinite} continue`);
t('il rispetto di prefers-reduced-motion è diffuso',
  (CSS.match(/prefers-reduced-motion/g) || []).length >= 12,
  `${(CSS.match(/prefers-reduced-motion/g) || []).length} blocchi`);
t('l’anello del livello successivo si spegne su richiesta',
  /prefers-reduced-motion[^}]*\}[\s\S]{0,200}\.node\.next \.medal::after\{[^}]*animation:none/.test(CSS)
  || /\.node\.next \.medal::after\{ animation:none/.test(CSS));

/* ── 3 · il primo disegno non deve aspettare 660 KB di script ──────── */
{
  const tutti = [...HTML.matchAll(/<script(\s+defer)?\s+src="([^"]+)"/g)];
  t('la pagina dichiara i suoi script', tutti.length >= 10, `${tutti.length} script`);
  t('e sono tutti differiti', tutti.every(m => m[1]),
    tutti.filter(m => !m[1]).map(m => m[2]).join(' ') || 'tutti');
  t('l’ordine di caricamento è preservato',
    tutti.map(m => m[2]).indexOf('app.js') > tutti.map(m => m[2]).indexOf('curriculum.js'));
  t('i font di terze parti hanno il preconnect',
    /rel="preconnect" href="https:\/\/fonts\.gstatic\.com"/.test(HTML));
}

/* ── 4 · le sezioni fuori schermo non vanno disegnate ─────────────── */
t('il percorso salta il lavoro sulle sezioni fuori vista',
  /#pathBody \.unit\{[^}]*content-visibility:auto/.test(CSS));
t('senza far saltare la barra di scorrimento',
  /#pathBody \.unit\{[^}]*contain-intrinsic-size/.test(CSS));

/* ── 5 · la pagina non deve muoversi da sola ──────────────────────── */
{
  const { w } = await boot({ seed: { done: ['u1l1', 'u1l2'], xp: 120, lives: 5 } });
  const L = w.__LEARN__;

  // il contatore sta sul prototipo: renderPath ricrea i nodi a ogni chiamata,
  // quindi un finto metodo messo sulle singole schede sparirebbe subito
  let scorrimenti = 0;
  w.Element.prototype.scrollIntoView = function () { scorrimenti++; };

  // ridisegno di sfondo: la maturazione di un salvagente
  L.renderPath();
  t('un ridisegno di sfondo non sposta la pagina', scorrimenti === 0,
    `${scorrimenti} scorrimenti`);

  L.renderPath({ vaiAlPunto: true });
  t('entrando nel percorso invece si torna dove si era rimasti', scorrimenti === 1,
    `${scorrimenti} scorrimenti`);
}

/* ── 6 · le dita ─────────────────────────────────────────────────── */
t('la casella numerica apre il tastierino, non la tastiera intera',
  /inputmode="numeric"/.test(fs.readFileSync(DIR + '/app.js', 'utf8')));
t('il riquadro grigio del tocco è disattivato dove disturba',
  (CSS.match(/tap-highlight-color:transparent/g) || []).length >= 4,
  `${(CSS.match(/tap-highlight-color:transparent/g) || []).length} punti`);

/* ── 7 · lo scorrimento non deve essere bloccato dai listener ─────── */
{
  const APP = fs.readFileSync(DIR + '/app.js', 'utf8');
  const UI = fs.readFileSync(DIR + '/ui-polish.js', 'utf8');
  const scrolls = [...(APP + UI).matchAll(/addEventListener\(\s*['"]scroll['"][^)]*\)/g)].map(m => m[0]);
  t('ci sono listener di scorrimento da controllare', scrolls.length >= 2, `${scrolls.length}`);
  t('e sono tutti passivi, così non trattengono il dito',
    scrolls.every(s => /passive:\s*true/.test(s)),
    scrolls.filter(s => !/passive/.test(s)).join(' | ') || 'tutti passivi');
}

t.fine();
