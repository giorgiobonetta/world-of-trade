/* La barra di navigazione in fondo. Su telefono è il modo principale di
   muoversi nell'app, quindi deve esserci, funzionare, dire dove sei, e
   sparire quando non serve — durante una lezione e prima dell'accesso. */
import { boot, solver, suite, DIR } from './harness.mjs';
import fs from 'fs';

const CSS = fs.readFileSync(DIR + '/styles.css', 'utf8');

const t = suite('Barra di navigazione in fondo');
const { w, errors } = await boot();
const L = w.__LEARN__;
const S = solver(w, L);
const d = w.document;

const voci = [...d.querySelectorAll('#tabBar .tab-item')];

t('la barra esiste', !!d.getElementById('tabBar'));
t('con cinque voci', voci.length === 5, String(voci.length));
t('e sono le stesse cinque schede della nav superiore',
  JSON.stringify(voci.map(b => b.dataset.screen)) ===
  JSON.stringify([...d.querySelectorAll('#gameNav .nav-item')].map(b => b.dataset.screen)),
  voci.map(b => b.dataset.screen).join(' '));

t('ogni voce ha un nome leggibile ad alta voce',
  voci.every(b => (b.getAttribute('aria-label') || '').trim().length > 2),
  voci.map(b => b.getAttribute('aria-label')).join(' · '));

// Le voci sono solo simboli: il nome resta nel documento, nascosto alla
// vista ma non a chi legge la pagina con uno screen reader.
t('ogni voce porta un simbolo',
  voci.every(b => b.querySelector('.tab-glyph svg')));
t('e i simboli sono tutti diversi fra loro',
  new Set(voci.map(b => b.querySelector('.tab-glyph svg').innerHTML)).size === 5);
t('il nome resta leggibile da uno screen reader',
  voci.every(b => (b.querySelector('b.sr-only')?.textContent || '').trim().length > 2),
  voci.map(b => b.querySelector('b')?.textContent).join(' '));
t('nessuna scritta visibile sotto i simboli',
  !/\.tab-item b\{[^}]*font-size/.test(CSS));
t('la voce attiva si riconosce da una pastiglia',
  /\.tab-item\.active::before\{/.test(CSS));

/* ── deve davvero navigare ── */
{
  const play = voci.find(b => b.dataset.screen === 'playScreen');
  play.dispatchEvent(new w.Event('click', { bubbles: true }));
  t('toccare una voce cambia schermata',
    d.getElementById('playScreen').classList.contains('active'));
  t('e la voce toccata risulta quella attiva',
    play.classList.contains('active') && play.getAttribute('aria-current') === 'page');
  t('mentre le altre non lo sono',
    voci.filter(b => b.getAttribute('aria-current') === 'page').length === 1);
}

/* ── resta allineata anche quando la schermata cambia da altrove ── */
{
  L.startLesson(L.UNITS[0].lessons[0].id);
  t('durante una lezione il corpo è in modalità immersiva',
    d.body.classList.contains('immersive'));
  // la barra sparisce via CSS: si verifica che la regola ci sia, non il pixel
  t('e una regola toglie la barra in modalità immersiva',
    /body\.immersive\s+\.tab-bar\s*\{[^}]*display:\s*none/.test(CSS));
}

/* ── prima dell'accesso non deve comparire ── */
{
  const a = await boot({ sessione: undefined });
  const bloccato = a.w.document.body.classList.contains('auth-locked');
  t('senza accesso il corpo è bloccato', bloccato);
  t('e la barra è nascosta insieme al resto',
    /body\.auth-locked\s+\.tab-bar/.test(CSS));
}

t('nessun errore in console', errors.length === 0, errors.slice(0, 2).join(' | '));

/* ── il menu a panino non deve restare in mezzo ── */
t('il vecchio menu a panino è ancora nel documento per il desktop',
  !!d.getElementById('mobileSectionNav'));
t('ma su telefono la stessa regola che mostra la barra lo nasconde',
  /\.mobile-section-nav\s*\{\s*display:\s*none\s*!important/.test(CSS));
t('e la barra compare solo sotto gli 820px in verticale',
  /@media \(max-width:820px\) and \(orientation:portrait\)\{[\s\S]{0,400}\.tab-bar\s*\{/.test(CSS));
t('lasciando spazio in fondo perché non copra il contenuto',
  /body\s*\{\s*padding-bottom:calc\(\d+px \+ env\(safe-area-inset-bottom\)\)/.test(CSS));

t.fine();
