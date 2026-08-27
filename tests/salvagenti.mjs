/* I salvagenti sono una risorsa persistente, non tre vite che ricominciano
   ogni volta. Regole: spenderne uno lo toglie davvero; il Ripasso non ne
   consuma ed è la via per riguadagnarli; dieci risposte giuste di fila ne
   restituiscono uno. */
import { boot, solver, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Salvagenti');
const base = { done: [], xp: 0, best: {}, badges: {}, misses: {}, doneAt: {},
               streakNow: 0, streakBest: 0, updatedAt: 1 };

/* ── il fondo si conserva ── */
{
  const { w, errors } = await boot({ seed: base });
  const L = w.__LEARN__, S = solver(w, L);
  t('si comincia con il fondo pieno', L.livesNow() === L.MAX_LIVES, String(L.livesNow()));
  t('il contatore in alto lo mostra', S.$('#statLives').textContent === String(L.MAX_LIVES));

  L.startLesson('u1l1');
  const ex = L.run.current.ex;
  S.sbagliato(ex); L.onCheck();
  t('sbagliare toglie un salvagente dal fondo', L.state.lives === L.MAX_LIVES - 1,
    `${L.MAX_LIVES} → ${L.state.lives}`);
  t('il contatore si aggiorna subito', S.$('#statLives').textContent === String(L.MAX_LIVES - 1));
  t('ed è già salvato su disco',
    JSON.parse(w.localStorage.getItem('wot-learn-v1')).lives === L.MAX_LIVES - 1);

  S.click(S.$('#quitButton'));
  t('uscire dalla lezione non le restituisce', L.state.lives === L.MAX_LIVES - 1);
  L.startLesson('u1l1');
  t('e ricominciando si riparte da quelle che restano', L.run.hearts === L.MAX_LIVES - 1,
    'run: ' + L.run.hearts);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── sopravvivono al riavvio ── */
{
  const { w } = await boot({ seed: { ...base, lives: 2 } });
  t('un fondo salvato viene riletto', w.__LEARN__.livesNow() === 2);
  t('e mostrato in alto', w.document.querySelector('#statLives').textContent === '2');
}
{
  const { w } = await boot({ seed: { done: ['u1l1'], xp: 20, best: {} } });
  t('un salvataggio precedente parte pieno, non a zero',
    w.__LEARN__.livesNow() === w.__LEARN__.MAX_LIVES, String(w.__LEARN__.livesNow()));
}

/* ── a zero non si comincia, ma il ripasso resta aperto ── */
{
  const now = Date.now();
  const { w, errors } = await boot({ seed: { ...base, lives: 0,
    done: ['u1l1','u1l2'], doneAt: { u1l1: now, u1l2: now } } });
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l3');
  t('senza salvagenti la lezione non parte',
    !S.$('#lessonScreen').classList.contains('active'));
  t('e viene spiegato perché', !S.$('#lockedHint').hidden &&
    /No lifebuoys left/.test(S.$('#lockedHint').textContent), S.$('#lockedHint').textContent);
  t('l\'avviso dice anche come rimediare', /Practice never costs one/.test(S.$('#lockedHint').textContent));

  L.startReview();
  t('il ripasso parte comunque: è la via d\'uscita',
    S.$('#lessonScreen').classList.contains('active'), 'modo ' + L.run?.mode);
  t('ed è marcato come gratuito', L.run.gratis === true);
  const ex = L.run.current.ex;
  if (S.sbagliato(ex)) {
    L.onCheck();
    t('sbagliare in ripasso non intacca il fondo', L.state.lives === 0, String(L.state.lives));
  }
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── dieci risposte giuste di fila ne restituiscono uno ── */
{
  const { w, errors } = await boot({ seed: { ...base, lives: 2, streakNow: 9 } });
  const L = w.__LEARN__, S = solver(w, L);
  t('la soglia è dichiarata', L.STREAK_PER_LIFE === 10, String(L.STREAK_PER_LIFE));
  L.startLesson('u1l1');
  S.giusto(L.run.current.ex); L.onCheck();
  t('alla decima risposta giusta si riguadagna un salvagente',
    L.state.lives === 3, `2 → ${L.state.lives}`);
  t('il contatore lo mostra', S.$('#statLives').textContent === '3');
  t('viene annunciato', !S.$('#streakToast').hidden &&
    /Lifebuoy earned/.test(S.$('#streakToast').textContent),
    S.$('#streakToast').textContent.replace(/\s+/g, ' ').trim().slice(0, 44));
  t('l\'annuncio dice quanti ne hai', /3 of 5/.test(S.$('#streakToast').textContent));
  t('il contatore dei recuperi cresce', L.state.livesEarned === 1);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}
{
  const { w } = await boot({ seed: { ...base, lives: 5, streakNow: 9 } });
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l1');
  S.giusto(L.run.current.ex); L.onCheck();
  t('col fondo pieno non si supera il massimo', L.state.lives === L.MAX_LIVES);
  t('e non viene annunciato nulla', !/Lifebuoy earned/.test(S.$('#streakToast').textContent || ''));
}

/* ── anche la soluzione rivelata paga dal fondo ── */
{
  const { w } = await boot({ seed: { ...base, lives: 4 } });
  const L = w.__LEARN__;
  L.startLesson('u1l1');
  L.rivela();
  t('rivelare la soluzione toglie un salvagente vero', L.state.lives === 3, `4 → ${L.state.lives}`);
}

/* ── il checkpoint pretende abbastanza salvagenti per dare un punteggio ── */
{
  const now = Date.now();
  const fatte = ['u1l1','u1l2','u1l3','u1l4'];
  const seedU1 = v => ({ ...base, lives: v, done: fatte,
    doneAt: Object.fromEntries(fatte.map(id => [id, now])) });
  {
    const { w } = await boot({ seed: seedU1(2) });
    const L = w.__LEARN__, S = solver(w, L);
    S.click(S.$('[data-check="u1"]'));
    t('con due salvagenti il checkpoint non parte',
      !S.$('#lessonScreen').classList.contains('active'));
    t('e spiega il motivo, non solo il divieto',
      /would end before giving you a score/.test(S.$('#lockedHint').textContent),
      S.$('#lockedHint').textContent.slice(0, 60));
  }
  {
    const { w } = await boot({ seed: seedU1(3) });
    const L = w.__LEARN__, S = solver(w, L);
    S.click(S.$('[data-check="u1"]'));
    t('con il minimo parte', S.$('#lessonScreen').classList.contains('active'), 'modo ' + L.run?.mode);
    t('e usa il fondo, non vite regalate', L.run.hearts === 3, String(L.run.hearts));
  }
}

/* ── il Path mostra solo i livelli ── */
{
  const html = fs.readFileSync(DIR + '/learn.html', 'utf8');
  const path = html.slice(html.indexOf('id="pathScreen"'), html.indexOf('id="playScreen"'));
  const prof = html.slice(html.indexOf('id="profileScreen"'), html.indexOf('id="flashScreen"'));
  t('la mappa dei desk non è più nel Path', !/worldMapHost/.test(path));
  t('né il riquadro del ruolo', !/careerHero/.test(path));
  t('la mappa è nel Profilo', /worldMapHost/.test(prof));
  t('e il ruolo pure', /careerHero/.test(prof));
  t('il Path conserva il percorso dei livelli', /id="pathBody"/.test(path));
  t('e dice dove è finito il resto', /in Profile/.test(path));
  const { w } = await boot({ seed: base });
  t('la mappa viene comunque disegnata', w.document.querySelectorAll('#worldMapHost .world-card').length >= 8,
    w.document.querySelectorAll('#worldMapHost .world-card').length + ' desk');
}
t.fine();
