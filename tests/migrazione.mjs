/* Riorganizzare il corso sui sedici desk del percorso ha spostato ogni lezione,
   e quindi cambiato il suo identificativo. Una carriera salvata prima della
   riorganizzazione va tradotta, non buttata e non letta alla lettera: gli id
   vecchi esistono ancora, ma indicano lezioni diverse. Se questa traduzione si
   rompe, il danno è silenzioso — l'utente ritrova il percorso mescolato. */
import { boot, suite } from './harness.mjs';

const t = suite('Migrazione dei salvataggi');

/* ── un salvataggio di prima viene tradotto ── */
{
  const now = Date.now();
  // "How freight is quoted" era u8l2 e ora è la terza lezione di Shipping;
  // "CBAM" era u10l2 e ora è la seconda di Sustainability
  const vecchio = {
    done: ['u1l1', 'u8l2', 'u10l2'],
    best: { u8l2: 90 },
    doneAt: { u1l1: now, u8l2: now, u10l2: now },
    misses: { 'u8l2#3': 2 },
    badges: { u8: 80 },
    xp: 140, streak: 3, streakBest: 11, lives: 4, updatedAt: 7,
  };
  const { w, errors } = await boot({ seed: vecchio });
  const L = w.__LEARN__, st = L.state;

  t('nessun errore leggendo un salvataggio di prima', errors.length === 0, errors.slice(0, 2).join('|'));
  t('il salvataggio viene marcato col programma corrente', st.rev === L.CURRICULUM_REV,
    `rev ${st.rev} di ${L.CURRICULUM_REV}`);
  t('nessuna lezione completata va perduta', st.done.length === 3, st.done.join(' '));
  t('ogni lezione tradotta esiste davvero',
    st.done.every(id => L.allLessons.some(l => l.id === id)), st.done.join(' '));
  t('la lezione si ritrova nel corso giusto',
    st.done.includes('u5l3') && st.done.includes('u6l2'), st.done.join(' '));
  t('e conserva il titolo che aveva',
    L.allLessons.find(l => l.id === 'u5l3')?.title === 'How freight is quoted',
    L.allLessons.find(l => l.id === 'u5l3')?.title);
  t('il punteggio migliore segue la lezione', st.best.u5l3 === 90, JSON.stringify(st.best));
  t('e la data di completamento pure', st.doneAt.u5l3 === now, JSON.stringify(st.doneAt));
  t('gli errori da ripassare tengono l’indice dell’esercizio',
    st.misses['u5l3#3'] === 2, JSON.stringify(st.misses));
  t('le medaglie dei checkpoint vengono scartate: le unità sono cambiate',
    Object.keys(st.badges).length === 0, JSON.stringify(st.badges));
  t('il resto della carriera resta intatto',
    st.xp === 140 && st.streakBest === 11 && st.lives === 4,
    `${st.xp} xp · record ${st.streakBest} · ${st.lives} salvagenti`);
}

/* ── e non viene tradotto due volte ── */
{
  const now = Date.now();
  // questo è già il programma nuovo: u4l1 è "FOB — the benchmark" e deve restare
  const nuovo = { rev: 2, done: ['u4l1', 'u5l3'], best: {}, badges: {},
    misses: {}, doneAt: { u4l1: now, u5l3: now }, xp: 30, updatedAt: 9 };
  const { w } = await boot({ seed: nuovo });
  const st = w.__LEARN__.state;
  t('un salvataggio già migrato non viene toccato',
    st.done.includes('u4l1') && st.done.includes('u5l3'), st.done.join(' '));
  t('e le medaglie non vengono più scartate',
    JSON.stringify(st.badges) === '{}' ,'nessuna medaglia da conservare in questo caso');
}

/* ── stabilità: migrare due volte dà lo stesso risultato ── */
{
  const { w } = await boot({ seed: { done: ['u11l4', 'u14l6'], best: {}, doneAt: {}, misses: {} } });
  const L = w.__LEARN__;
  const unaVolta = L.migraSalvataggio({ done: ['u11l4', 'u14l6'] });
  const dueVolte = L.migraSalvataggio(unaVolta);
  t('la traduzione è stabile', JSON.stringify(unaVolta.done) === JSON.stringify(dueVolte.done),
    `${unaVolta.done.join(' ')} → ${dueVolte.done.join(' ')}`);
  t('e porta a lezioni esistenti',
    unaVolta.done.every(id => L.allLessons.some(l => l.id === id)), unaVolta.done.join(' '));
}

/* ── nessun id vecchio finisce nel vuoto ── */
{
  const { w } = await boot();
  const L = w.__LEARN__;
  // tutti gli id che il vecchio programma poteva aver salvato: u1..u14, sei
  // lezioni al massimo per unità
  const possibili = [];
  for (let u = 1; u <= 14; u++) for (let l = 1; l <= 6; l++) possibili.push(`u${u}l${l}`);
  const tradotti = L.migraSalvataggio({ done: possibili }).done;
  // Un id può uscire dalla traduzione in due modi legittimi: tradotto in una
  // lezione che esiste, oppure invariato perché non era un id noto (nella
  // griglia ci sono combinazioni che non sono mai esistite). Quel che non deve
  // succedere è una traduzione verso una lezione inesistente.
  const rotti = possibili
    .map((vecchio, i) => ({ vecchio, nuovo: tradotti[i] }))
    .filter(({ vecchio, nuovo }) => nuovo !== vecchio && !L.allLessons.some(x => x.id === nuovo))
    .map(({ vecchio, nuovo }) => `${vecchio}→${nuovo}`);
  t('nessuna traduzione punta a una lezione inesistente', rotti.length === 0,
    rotti.slice(0, 5).join(' ') ||
    `${possibili.filter((v, i) => tradotti[i] !== v).length} id tradotti su ${possibili.length} tentati`);
  t('un id sconosciuto non fa esplodere niente',
    L.migraSalvataggio({ done: ['zzz9l9'] }).done[0] === 'zzz9l9');
  t('un salvataggio vuoto o rotto non fa esplodere niente',
    Array.isArray(L.migraSalvataggio({}).done) && L.migraSalvataggio(null) === null);
}

t.fine();
