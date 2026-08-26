import { boot, suite, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Visibilità (hidden vs CSS)');

/* IL BUG, per non rifarlo.
   La regola del browser è `[hidden]{display:none}`. Una regola d'autore come
   `.cloud-dialog{display:grid}` appartiene a un'origine più forte e la annulla
   senza dare alcun segnale: il pannello di accesso restava aperto sopra l'app,
   e col cloud non configurato nemmeno la X era agganciata. Niente si poteva chiudere.

   PERCHÉ I TEST NON L'AVEVANO PRESO
   Guardavano `el.hidden`, che era `true`: la proprietà era giusta, il rendering no.
   E getComputedStyle in jsdom non serve: senza iniettare il CSS non c'è cascata,
   e anche iniettandolo jsdom non implementa `!important`. Quindi la verifica
   affidabile è statica, sul testo del CSS. */

const css = fs.readFileSync(DIR + '/styles.css', 'utf8');
const html = fs.readFileSync(DIR + '/learn.html', 'utf8');

const GUARDIA = /\[hidden\]\s*\{\s*display:\s*none\s*!important\s*\}/;
t('esiste la regola che fa vincere hidden su qualunque display', GUARDIA.test(css));
const posGuardia = css.search(GUARDIA);

/* Tutto ciò che può essere nascosto: attributo nell'HTML o .hidden dal JS */
const { w } = await boot();
const daHtml = [...w.document.querySelectorAll('[hidden]')].map(e => e.id).filter(Boolean);
const js = ['app.js','cloud.js','share.js','pwa.js'].map(f => fs.readFileSync(DIR + '/' + f,'utf8')).join('\n');
const daJs = [...js.matchAll(/\$\('#([A-Za-z]+)'\)[^;\n]*\.hidden\s*=/g)].map(m => m[1]);
const ids = [...new Set([...daHtml, ...daJs, 'streakChip','streakToast','cloudDialog','shareDialog',
  'pathProgress','feedback','offlineFlag','runBanner','cloudStatus','shareMsg','cloudErr'])]
  .filter(id => w.document.getElementById(id));
t('l\'elenco degli elementi nascondibili non è vuoto', ids.length >= 6, ids.join(', '));

/* Per ognuno: qualche regola d'autore gli assegna un display diverso da none? */
const rischiosi = [];
for (const id of ids) {
  const el = w.document.getElementById(id);
  for (const sel of [`#${id}`, ...[...el.classList].map(c => `.${c}`)]) {
    const re = new RegExp(sel.replace(/[.#]/g, m => '\\' + m) + '\\s*\\{([^}]*)\\}', 'g');
    let m;
    while ((m = re.exec(css))) {
      const d = /display:\s*([a-z-]+)/.exec(m[1]);
      if (d && d[1] !== 'none') rischiosi.push({ id, sel, display: d[1], pos: m.index });
    }
  }
}
t('il test sa quali elementi sarebbero a rischio', rischiosi.length > 0,
  rischiosi.map(r => `${r.id}:${r.sel}=${r.display}`).join(' · '));

/* L'invariante: se esiste un solo elemento a rischio, la guardia deve esserci
   e deve venire prima, altrimenti l'attributo hidden non è affidabile. */
t('ogni elemento a rischio è protetto dalla guardia',
  rischiosi.length === 0 || (posGuardia >= 0 && rischiosi.every(r => posGuardia < r.pos)),
  posGuardia < 0 ? 'guardia assente' : `guardia a ${posGuardia}, primo rischio a ${Math.min(...rischiosi.map(r => r.pos))}`);

t('la guardia usa !important (senza, la specificità non basta)',
  /!important/.test((css.match(/\[hidden\][^}]*\}/) || [''])[0]));

/* I due modali devono essere chiudibili SEMPRE, anche col cloud spento:
   è la seconda linea di difesa, quella che evita il blocco totale. */
{
  const { w: w2, errors } = await boot();            // cloud NON configurato
  const prova = (sel, nome) => {
    const d = w2.document.querySelector(sel);
    t(`${nome} parte chiuso`, d.hidden);
    d.hidden = false;
    d.querySelector('.cloud-close').dispatchEvent(new w2.Event('click', { bubbles: true }));
    t(`${nome}: la X lo chiude col cloud spento`, d.hidden);
    d.hidden = false;
    w2.document.dispatchEvent(Object.assign(new w2.Event('keydown', { bubbles: true }), { key: 'Escape' }));
    t(`${nome}: Escape lo chiude`, d.hidden);
    d.hidden = false;
    d.dispatchEvent(new w2.Event('click', { bubbles: true }));
    t(`${nome}: il clic sullo sfondo lo chiude`, d.hidden);
  };
  prova('#cloudDialog', 'pannello di accesso');
  prova('#shareDialog', 'pannello di condivisione');
  t('col cloud spento non c\'è nemmeno un modo per aprirli',
    !w2.document.querySelector('#cloudOpen') && !w2.document.querySelector('.share-cta'));
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}
t.fine();
