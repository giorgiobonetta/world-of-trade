import { boot, solver, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Vedere la soluzione');
const seed = { done: [], xp: 0, best: {}, badges: {}, misses: {}, doneAt: {},
               streakNow: 0, streakBest: 0, updatedAt: 1 };

/* ── disponibilità ── */
{
  const { w, errors } = await boot({ seed });
  const L = w.__LEARN__, S = solver(w, L);
  t('fuori da una lezione il pulsante è nascosto', S.$('#revealButton').hidden);
  L.startLesson('u1l1');
  S.superaPresentazione();
  t('in lezione compare', !S.$('#revealButton').hidden);
  t('ed è attivo con tutte le vite', !S.$('#revealButton').disabled, 'vite ' + L.run.hearts);
  t('dice quanto costa', /costs 1 lifebuoy/.test(S.$('#revealButton').textContent),
    S.$('#revealButton').textContent);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── con una sola vita non si può: perdere così sarebbe confuso ── */
{
  const { w } = await boot({ seed });
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l1');
  S.superaPresentazione();
  L.run.hearts = 1;
  L.renderRivela();
  t('con una sola vita è disattivato', S.$('#revealButton').disabled);
  t('e lo spiega invece di restare muto', /needs a spare lifebuoy/.test(S.$('#revealButton').textContent),
    S.$('#revealButton').textContent);
  const prima = L.run.hearts;
  L.rivela();
  t('e premerlo non fa nulla', L.run.hearts === prima && L.run.state === 'answering');
}

/* ── in un checkpoint non esiste: è una verifica ── */
{
  const now = Date.now();
  // il primo corso ha sei livelli: il checkpoint compare solo se sono tutti fatti
  const fatte = ['u1l1','u1l2','u1l3','u1l4','u1l5','u1l6'];
  // rev: il salvataggio è già scritto col programma corrente, così la
  // migrazione non traduce gli id elencati qui sopra
  const { w } = await boot({ seed: { ...seed, rev: 2, done: fatte,
    doneAt: Object.fromEntries(fatte.map(id => [id, now])) } });
  const L = w.__LEARN__, S = solver(w, L);
  S.click(S.$('[data-check="u1"]'));
  await pausa(60);
  t('nel checkpoint il pulsante è nascosto', S.$('#revealButton').hidden, 'modo ' + L.run.mode);
  t('e la funzione rifiuta comunque', (L.rivela(), L.run.hearts === L.CHECK_HEARTS),
    'vite ' + L.run.hearts);
}

/* ── il costo e le conseguenze ── */
{
  const { w, errors } = await boot({ seed: { ...seed, streakNow: 7, streakBest: 9 } });
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l1');
  S.superaPresentazione();
  const ex = L.run.current.ex;
  const vitePrima = L.run.hearts, codaPrima = L.run.queue.length;
  L.rivela();
  t('costa esattamente una vita', L.run.hearts === vitePrima - 1, `${vitePrima} → ${L.run.hearts}`);
  t('le vite mostrate si aggiornano', /\d+ of \d+/.test(S.$('#hearts').getAttribute('aria-label')),
    S.$('#hearts').getAttribute('aria-label'));
  t('azzera la serie: non l\'hai presa, l\'hai vista', L.state.streakNow === 0, '7 → ' + L.state.streakNow);
  t('ma non intacca il record', L.state.streakBest === 9);
  t('finisce fra le cose da ripassare', Object.keys(L.state.misses).length === 1,
    JSON.stringify(L.state.misses));
  t('l\'esercizio torna in coda: vederla non è averla data',
    L.run.queue.length === codaPrima + 1, `${codaPrima} → ${L.run.queue.length}`);
  t('e torna marcato come ritentativo', L.run.queue[L.run.queue.length - 1].retry === true);
  t('non conta come presa al primo colpo', L.run.firstTry === 0);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── cosa vede l'utente ── */
{
  const { w } = await boot({ seed });
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l1');
  S.superaPresentazione();
  const ex = L.run.current.ex;
  L.rivela();
  const fb = S.$('#feedback');
  t('la spiegazione compare', !fb.hidden && fb.textContent.includes(ex.why.slice(0, 30)));
  t('Hélène non fa la faccia delusa, spiega', /teach/.test(fb.querySelector('svg')?.outerHTML || '') ||
    !/oops/.test(fb.querySelector('svg')?.outerHTML || ''));
  t('avverte che l\'esercizio tornerà', /still have to answer it yourself/.test(fb.textContent));
  t('il pannello è marcato come soluzione mostrata', fb.classList.contains('shown'));
  if (ex.type === 'choice') {
    const giusta = S.$$('.opt').find(b => Number(b.dataset.i) === ex.answer);
    t('la risposta corretta è evidenziata', giusta && giusta.classList.contains('ok'));
    t('le opzioni non sono più cliccabili', S.$$('.opt').every(b => b.disabled));
  }
  t('durante il feedback non si può rivelare di nuovo', S.$('#revealButton').disabled);
  t('si prosegue col pulsante principale', !S.$('#checkButton').disabled);
}

/* ── funziona su tutti e cinque i tipi ── */
{
  // serve uno stato che sblocchi anche le lezioni oltre la prima:
  // startLesson rifiuta correttamente quelle bloccate
  const { w: w0 } = await boot({ seed });
  const tutte = w0.__LEARN__.allLessons.map(l => l.id);
  const { w, errors } = await boot({ seed: { ...seed, done: tutte,
    doneAt: Object.fromEntries(tutte.map(id => [id, Date.now()])) } });
  const L = w.__LEARN__, S = solver(w, L);
  const tipi = {};
  // per ogni tipo cerco una lezione che lo contenga e ci arrivo rispondendo bene
  for (const tipo of ['choice','numeric','order','pairs','build']) {
    const lez = L.allLessons.find(l => l.exercises.some(e => e.type === tipo));
    if (!lez) { tipi[tipo] = 'assente dal curriculum'; continue; }
    L.startLesson(lez.id);
    S.superaPresentazione();
    let g = 0;
    while (L.run && g++ < 15) {
      // una presentazione può comparire anche a metà lezione, non solo all'inizio
      S.superaPresentazione();
      const ex = L.run.current.ex;
      if (ex.type === tipo) {
        L.run.hearts = 3;                     // il costo è già verificato altrove
        L.rivela();
        tipi[tipo] =
          tipo === 'choice'  ? L.run.picked === ex.answer :
          tipo === 'numeric' ? String(L.run.picked) === String(ex.answer) :
          tipo === 'order'   ? L.run.order.every((it, i2) => it.i === i2) :
          tipo === 'pairs'   ? L.run.pairState.matched.length === ex.pairs.length :
                               L.run.built.map(b => b.t).join(' ') === ex.sentence.join(' ');
        break;
      }
      S.giusto(ex); L.onCheck(); L.onCheck();
    }
    S.click(S.$('#quitButton'));   // esce dalla lezione e azzera il run
  }
  for (const k of ['choice','numeric','order','pairs','build'])
    t(`la soluzione è mostrata correttamente per "${k}"`, tipi[k] === true,
      tipi[k] === true ? '' : String(tipi[k]));
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── il pulsante è nel piede e accessibile ── */
{
  const html = fs.readFileSync(DIR + '/learn.html', 'utf8');
  t('il pulsante è dichiarato nel piede della lezione',
    /id="revealButton"[^>]*class="btn reveal"/.test(html));
  t('parte nascosto e disattivato', /id="revealButton"[^>]*hidden disabled/.test(html));
  t('è un button, non un link', /<button id="revealButton"/.test(html));
  const css = fs.readFileSync(DIR + '/styles.css', 'utf8');
  t('ha uno stato disattivato visibile', /\.btn\.reveal:disabled\{[^}]*opacity/.test(css));
  t('e un focus visibile da tastiera', /\.btn\.reveal:focus-visible/.test(css));
}
t.fine();
