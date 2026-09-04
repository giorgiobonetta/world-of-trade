/* La schermata di lezione: riscontro e pulsante in un blocco solo, e la
   conferma quando si esce a metà. La X sta accanto alla barra di
   avanzamento e si tocca per sbaglio facilmente: uscire deve costare una
   lettura, ma solo quando c'è davvero qualcosa da perdere. */
import { boot, solver, suite, DIR } from './harness.mjs';
import fs from 'fs';

const CSS = fs.readFileSync(DIR + '/styles.css', 'utf8');
const t = suite('Uscita e riscontro della lezione');
const { w, errors } = await boot();
const L = w.__LEARN__;
const S = solver(w, L);
const d = w.document;

const apri = () => { L.startLesson(L.UNITS[0].lessons[0].id); };

/* ── il riscontro e il pulsante devono essere un blocco solo ── */
{
  apri();
  const piede = d.querySelector('.lesson-foot');
  t('a inizio lezione il piede non è colorato',
    piede.className.trim() === 'lesson-foot', piede.className);

  S.giusto(L.run.current.ex);
  L.onCheck();
  t('dopo una risposta giusta il piede diventa verde',
    piede.classList.contains('good'), piede.className);
  t('e il riscontro è visibile', d.getElementById('feedback').hidden === false);
  t('il pulsante per proseguire sta dentro la fascia colorata',
    piede.contains(d.getElementById('checkButton')));
  t('e in quel momento non si offre più di rivelare la risposta',
    /\.lesson-foot\.(good|bad)[^{]*\.btn\.reveal\s*\{[^}]*display:\s*none/.test(CSS)
    || /\.lesson-foot\.good \.btn\.reveal,\s*\n?\.lesson-foot\.bad \.btn\.reveal\{ display:none \}/.test(CSS));

  L.onCheck();
  t('passando alla domanda dopo il colore se ne va',
    piede.className.trim() === 'lesson-foot', piede.className);
}

{
  apri();
  const piede = d.querySelector('.lesson-foot');
  S.sbagliato(L.run.current.ex);
  L.onCheck();
  t('dopo una risposta sbagliata il piede diventa rosso',
    piede.classList.contains('bad'), piede.className);
}

/* ── la conferma di uscita ── */
{
  apri();
  const dlg = d.getElementById('quitDialog');
  t('la finestra di conferma esiste', !!dlg);
  t('e a lezione appena aperta è chiusa', dlg.hidden === true);

  // nessuna risposta data: non c'è niente da perdere, si esce e basta
  d.getElementById('quitButton').dispatchEvent(new w.Event('click', { bubbles: true }));
  t('senza risposte date si esce senza chiedere niente',
    dlg.hidden === true && d.getElementById('pathScreen').classList.contains('active'));
}

{
  L.state.lives = L.MAX_LIVES;          // fondo pieno: la lezione parte pulita
  apri();
  S.giusto(L.run.current.ex); L.onCheck(); L.onCheck();
  const dlg = d.getElementById('quitDialog');
  d.getElementById('quitButton').dispatchEvent(new w.Event('click', { bubbles: true }));
  t('con una risposta già data invece chiede conferma', dlg.hidden === false);
  t('rispondendo solo giusto non parla di salvagenti persi',
    !/lifebuoy/i.test(d.getElementById('quitCopy').textContent),
    d.getElementById('quitCopy').textContent.slice(0, 90));
  t('e la lezione non è ancora stata abbandonata',
    d.getElementById('lessonScreen').classList.contains('active'));

  const testo = d.getElementById('quitCopy').textContent;
  t('spiega a che punto sei', /\d+ of \d+ answered/.test(testo), testo.slice(0, 70));
  t('e che gli XP non sono ancora al sicuro', /not banked/i.test(testo));

  d.getElementById('quitStay').dispatchEvent(new w.Event('click', { bubbles: true }));
  t('"Keep going" richiude e lascia dove si era',
    dlg.hidden === true && d.getElementById('lessonScreen').classList.contains('active'));
}

{
  apri();
  S.giusto(L.run.current.ex); L.onCheck(); L.onCheck();
  const dlg = d.getElementById('quitDialog');
  d.getElementById('quitButton').dispatchEvent(new w.Event('click', { bubbles: true }));
  d.getElementById('quitLeave').dispatchEvent(new w.Event('click', { bubbles: true }));
  t('"Leave the level" esce davvero',
    dlg.hidden === true && d.getElementById('pathScreen').classList.contains('active'));
  t('e la lezione in corso viene chiusa', !L.run);
}

{
  apri();
  S.giusto(L.run.current.ex); L.onCheck(); L.onCheck();
  d.getElementById('quitButton').dispatchEvent(new w.Event('click', { bubbles: true }));
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  t('Escape equivale a restare',
    d.getElementById('quitDialog').hidden === true &&
    d.getElementById('lessonScreen').classList.contains('active'));
}

/* ── quando i salvagenti spesi contano, deve dirlo ── */
{
  L.state.lives = L.MAX_LIVES;
  apri();
  S.sbagliato(L.run.current.ex); L.onCheck(); L.onCheck();
  d.getElementById('quitButton').dispatchEvent(new w.Event('click', { bubbles: true }));
  t('se hai speso salvagenti lo dice, e conta solo quelli di questa lezione',
    /lifebuoy/i.test(d.getElementById('quitCopy').textContent),
    d.getElementById('quitCopy').textContent.slice(0, 90));
  d.getElementById('quitStay').dispatchEvent(new w.Event('click', { bubbles: true }));
}

t('nessun errore in console', errors.length === 0, errors.slice(0, 2).join(' | '));

t.fine();
