import { boot, suite, pausa } from './harness.mjs';
const t = suite('Link diretto alla lezione');
const seed = done => ({ done, xp: 20 * done.length, best: {}, badges: {}, misses: {},
                        doneAt: {}, streakBest: 0, updatedAt: 1 });

/* una lezione già fatta si apre */
{
  const { w, errors } = await boot({ query: '?lesson=u1l1', seed: seed(['u1l1']) });
  await pausa(80);
  t('una lezione completata si riapre dal link',
    w.document.querySelector('#lessonScreen').classList.contains('active'));
  t('ed è quella giusta', w.__LEARN__.run?.lesson?.id === 'u1l1', w.__LEARN__.run?.lesson?.id);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* la prossima lezione si apre */
{
  const { w } = await boot({ query: '?lesson=u1l1', seed: seed([]) });
  await pausa(80);
  t('la prima lezione, che è la prossima, si apre',
    w.document.querySelector('#lessonScreen').classList.contains('active'));
}

/* una lezione bloccata NON si apre */
{
  const { w, errors } = await boot({ query: '?lesson=u6l2', seed: seed([]) });
  await pausa(80);
  t('una lezione bloccata non si apre',
    !w.document.querySelector('#lessonScreen').classList.contains('active'));
  t('resta il percorso', w.document.querySelector('#pathScreen').classList.contains('active'));
  const nodo = w.document.querySelector('[data-lesson="u6l2"]');
  t('il nodo viene evidenziato, così l\'utente sa dov\'è', nodo?.classList.contains('flagged'));
  t('e gli si spiega perché', !w.document.querySelector('#lockedHint').hidden &&
    /still locked/.test(w.document.querySelector('#lockedHint').textContent),
    w.document.querySelector('#lockedHint').textContent);
  t('il progresso non è stato alterato', w.__LEARN__.state.done.length === 0);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* il controllo sta nel motore, non nel chiamante */
{
  const { w } = await boot({ seed: seed([]) });
  const L = w.__LEARN__;
  t('isUnlocked è esposta', typeof L.isUnlocked === 'function');
  t('la prima lezione è sbloccata', L.isUnlocked('u1l1'));
  t('una lontana no', !L.isUnlocked('u7l4'));
  L.startLesson('u7l4');                                  // tentativo diretto
  t('startLesson rifiuta una lezione bloccata anche chiamata a mano',
    !w.document.querySelector('#lessonScreen').classList.contains('active'));
  t('e non crea nessun run', !L.run);
  L.startLesson('u1l1');
  t('mentre una sbloccata parte', !!L.run && L.run.lesson.id === 'u1l1');
}

/* parametri assurdi non devono rompere niente */
for (const q of ['?lesson=', '?lesson=nonesiste', '?lesson=../../etc/passwd', '?lesson=u1l1&lesson=u9l9']) {
  const { w, errors } = await boot({ query: q, seed: seed([]) });
  await pausa(50);
  t(`"${q}" non rompe la pagina`, errors.length === 0 && w.document.querySelectorAll('.node').length === 31,
    errors.slice(0, 1).join(''));
}

/* i link del glossario puntano tutti a lezioni reali */
{
  const { w: g } = await boot({ pagina: 'glossary.html' });
  const href = [...g.document.querySelectorAll('.gl-link')].map(a => a.getAttribute('href'));
  const { w } = await boot();
  const validi = new Set(w.__LEARN__.allLessons.map(l => l.id));
  const rotti = href.filter(h => !validi.has(h.split('=')[1]));
  t('ogni link del glossario punta a una lezione esistente', rotti.length === 0, rotti.join(', '));
  t('e sono tutti nella forma attesa', href.every(h => /^learn\.html\?lesson=u\d+l\d+$/.test(h)),
    href.find(h => !/^learn\.html\?lesson=u\d+l\d+$/.test(h)) || '');
}
t.fine();
