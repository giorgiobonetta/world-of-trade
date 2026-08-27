/* Una vita è disegnata come salvagente: il solo simbolo che significa
   letteralmente salvare una vita ed è insieme inconfondibilmente marittimo,
   che è dove le commodity fisiche si muovono. */
import { boot, solver, suite, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Il simbolo della vita');
const seed = { done: [], xp: 0, best: {}, badges: {}, misses: {}, doneAt: {}, updatedAt: 1 };

const { w, errors } = await boot({ seed });
const L = w.__LEARN__, S = solver(w, L);
L.startLesson('u1l1');

const vite = S.$$('#hearts .h');
t('una vita per cuore disponibile', vite.length === L.HEARTS, vite.length + ' disegnate');
t('è un disegno, non un carattere di testo', vite.every(v => !!v.querySelector('svg')),
  vite[0]?.textContent.trim() || '');
t('non è più il pallino di prima', !vite.some(v => /●/.test(v.textContent)));

const svg = vite[0].querySelector('svg');
t('il salvagente ha i quattro settori alternati',
  /stroke-dasharray="6\.6 6\.6"/.test(svg.outerHTML));
t('con la parte chiara sotto e quella colorata sopra',
  /#fdf6e8/.test(svg.outerHTML) && /currentColor/.test(svg.outerHTML));
t('e il foro centrale', (svg.outerHTML.match(/<circle/g) || []).length >= 3);
t('è invisibile agli screen reader: il conteggio lo dà il contenitore',
  svg.getAttribute('aria-hidden') === 'true' &&
  vite.every(v => v.getAttribute('aria-hidden') === 'true'));
t('il contenitore dice quante ne restano',
  /\d+ of \d+ lifebuoys left/.test(S.$('#hearts').getAttribute('aria-label')),
  S.$('#hearts').getAttribute('aria-label'));
t('fuori dal percorso di tabulazione', svg.getAttribute('focusable') === 'false');

/* la vita spesa deve restare riconoscibile, ma inequivocabilmente spenta */
{
  const ex = L.run.current.ex;
  S.sbagliato(ex); L.onCheck();
  const dopo = S.$$('#hearts .h');
  const spente = dopo.filter(v => v.classList.contains('gone'));
  t('perdere una vita ne spegne esattamente una', spente.length === 1, spente.length + ' spente');
  t('la vita spesa resta disegnata, non sparisce', !!spente[0].querySelector('svg'));
  t('il numero di salvagenti non cambia', dopo.length === L.HEARTS);
}

const css = fs.readFileSync(DIR + '/styles.css', 'utf8');
t('la vita piena è colorata', /\.hearts \.h\{[^}]*color:#ff6b52/.test(css));
t('quella spesa è spenta e rimpicciolita',
  /\.hearts \.h\.gone\{[^}]*opacity:\.3[^}]*scale\(\.8\)/.test(css));
t('nessuna dimensione di carattere: ora è un disegno',
  !/\.hearts\{[^}]*font-size/.test(css));
t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
t.fine();
