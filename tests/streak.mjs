import { boot, solver, suite, pausa } from './harness.mjs';
const t = suite('Serie di risposte');

/* la serie cresce solo al primo colpo e si azzera sull'errore */
{
  const { w, errors } = await boot();
  const L = w.__LEARN__, S = solver(w, L);
  t('parte da zero', L.state.streakNow === 0 && L.state.streakBest === 0);
  L.startLesson('u1l1');
  t('l\'indicatore è nascosto sotto 3', S.$('#streakChip').hidden);

  for (let i = 0; i < 3; i++) { S.giusto(L.run.current.ex); L.onCheck(); L.onCheck(); }
  t('dopo 3 giuste la serie è 3', L.state.streakNow === 3, String(L.state.streakNow));
  t('l\'indicatore compare a 3', !S.$('#streakChip').hidden);
  t('mostra il numero', S.$('#streakNum').textContent === '3', S.$('#streakNum').textContent);
  t('è marcato come record', S.$('#streakChip').classList.contains('record'));

  const ex = L.run.current.ex;
  if (S.sbagliato(ex)) {
    L.onCheck();
    t('un errore azzera la serie', L.state.streakNow === 0, String(L.state.streakNow));
    t('ma il record resta', L.state.streakBest === 3, String(L.state.streakBest));
    t('l\'indicatore si nasconde', S.$('#streakChip').hidden);
    L.onCheck();
    // l'esercizio sbagliato torna in coda: riprenderlo NON deve contare
    let g = 0;
    while (L.run && g++ < 40) {
      const e = L.run.current.ex;
      const eraRitentativo = !!L.run.current.retry;
      const prima = L.state.streakNow;
      S.giusto(e); L.onCheck();
      if (eraRitentativo) {
        t('un ritentativo non fa crescere la serie', L.state.streakNow === prima,
          prima + ' → ' + L.state.streakNow);
        L.onCheck(); break;
      }
      L.onCheck();
    }
  }
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* la soglia festeggia */
{
  const { w } = await boot({ seed: { done: [], xp: 0, best: {}, badges: {}, misses: {}, doneAt: {},
                                     streakNow: 4, streakBest: 4, updatedAt: 1 } });
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l1');
  t('l\'indicatore riprende dalla serie salvata', S.$('#streakNum').textContent === '4');
  S.giusto(L.run.current.ex); L.onCheck();
  t('a 5 arriva il festeggiamento', !S.$('#streakToast').hidden && /5 in a row/.test(S.$('#streakToast').textContent),
    S.$('#streakToast').textContent.replace(/\s+/g, ' ').trim().slice(0, 40));
  t('dice che è un record', /personal best/.test(S.$('#streakToast').textContent));
  t('le soglie sono quelle attese', JSON.stringify(L.SOGLIE) === JSON.stringify([5,10,15,20,30,50,75,100]),
    JSON.stringify(L.SOGLIE));
}

/* la serie attraversa le lezioni */
{
  const { w } = await boot();
  const L = w.__LEARN__, S = solver(w, L);
  L.startLesson('u1l1');
  await S.gioca();
  const dopoPrima = L.state.streakNow;
  t('a fine lezione la serie è quella delle risposte date', dopoPrima >= 4, String(dopoPrima));
  S.click(S.$('#continueButton'));
  L.startLesson('u1l2');
  S.giusto(L.run.current.ex); L.onCheck();
  t('continua nella lezione successiva', L.state.streakNow === dopoPrima + 1,
    dopoPrima + ' → ' + L.state.streakNow);
}

/* fusione col cloud */
{
  const { w } = await boot({ cloud: false });
  const M = (await import('./harness.mjs'), w.WOT_CLOUD_API.merge);
  const f = M({ streakBest: 12, streakNow: 3 }, { streakBest: 27, streakNow: 19 });
  t('il record migliore vince nella fusione', f.streakBest === 27, String(f.streakBest));
  t('la serie in corso non si eredita da un altro dispositivo', f.streakNow === 3, String(f.streakNow));
}

/* salvataggio vecchio senza i nuovi campi */
{
  const { w, errors } = await boot({ seed: { done: ['u1l1'], xp: 20, best: { u1l1: 100 } } });
  t('un salvataggio precedente si carica', errors.length === 0 && w.__LEARN__.state.xp === 20);
  t('serie e record partono da zero', w.__LEARN__.state.streakNow === 0 && w.__LEARN__.state.streakBest === 0);
}
t.fine();
