import { boot, solver, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Condivisione LinkedIn');
// il percorso arriva dall'harness: un percorso assoluto funzionava
// solo sulla macchina di chi l'ha scritto
const seed = n => ({ done: ['u1l1'], xp: 30, best: { u1l1: 100 }, badges: {}, misses: {},
                     doneAt: {}, streakNow: 0, streakBest: n, updatedAt: 1 });

/* ── il pulsante appare solo se c'è qualcosa da condividere ── */
{
  const { w } = await boot({ seed: seed(0) });
  t('a zero non c\'è nulla da condividere', !w.document.querySelector('.share-cta'));
}
{
  const { w } = await boot({ seed: seed(4) });
  t('sotto la soglia il pulsante non compare', !w.document.querySelector('.share-cta'),
    'soglia ' + w.WOT_SHARE.SOGLIA);
}
{
  const { w, errors } = await boot({ seed: seed(17) });
  const btn = w.document.querySelector('.share-cta');
  t('dalla soglia in su compare', !!btn);
  t('dice il numero raggiunto', /17-answer streak/.test(btn.textContent), btn.textContent.trim());
  t('compare in entrambi i punti previsti', w.document.querySelectorAll('.share-cta').length === 2,
    w.document.querySelectorAll('.share-cta').length + ' pulsanti');
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── il contenuto della condivisione ── */
{
  const { w } = await boot({ seed: seed(23) });
  const S = w.WOT_SHARE;
  const testo = S.testoPost(23, 31);
  t('il testo apre col numero', /^23 correct answers in a row/.test(testo), testo.split('\n')[0]);
  t('nomina il dominio da cui è aperta la pagina', testo.includes('https://wot.test'),
    (testo.match(/https?:\/\/\S+/) || [])[0]);
  t('spiega cos\'è l\'app a chi non la conosce', /physical commodity trading/.test(testo));
  t('elenca gli argomenti veri', /incoterms/i.test(testo) && /hedging/i.test(testo) && /desk risk/i.test(testo));
  t('dice quante lezioni sono', /31 lessons/.test(testo));
  t('ha hashtag pertinenti', /#CommodityTrading/.test(testo) && /#TradeFinance/.test(testo));
  t('non promette nulla di falso', !/certif|qualification|expert/i.test(testo));

  const link = S.linkLinkedIn();
  t('usa l\'endpoint di condivisione documentato',
    link.startsWith('https://www.linkedin.com/sharing/share-offsite/?url='), link);
  t('non tenta di precompilare testo o titolo (LinkedIn li ignora)',
    !/title=|summary=|text=|mini=/.test(link), link);
  t('l\'indirizzo condiviso è codificato', /url=https%3A%2F%2F/.test(link));
  t('il nome del file immagine è parlante', S.nomeFile(23) === 'world-of-trade-23-in-a-row.png',
    S.nomeFile(23));
}

/* ── il pannello ── */
{
  const { w, errors, nonImplementate } = await boot({ seed: seed(31) });
  const click = s => w.document.querySelector(s)?.dispatchEvent(new w.Event('click', { bubbles: true }));
  click('.share-cta');
  const d = w.document.querySelector('#shareDialog');
  t('il pannello si apre', !d.hidden);
  t('il titolo è il risultato', /31 in a row/.test(w.document.querySelector('#shareTitle').textContent));
  t('spiega perché servono tre passaggi',
    /only lets a link carry the page/.test(w.document.querySelector('.share-sub').textContent));
  t('il testo è pronto nella casella', /31 correct answers/.test(w.document.querySelector('#shareText').value));
  t('la casella è di sola lettura', w.document.querySelector('#shareText').readOnly);
  t('i tre passaggi sono numerati',
    /1 ·/.test(w.document.querySelector('#shareCopy').textContent) &&
    /2 ·/.test(w.document.querySelector('#shareDown').textContent) &&
    /3 ·/.test(w.document.querySelector('#shareGo').textContent));
  const a = w.document.querySelector('#shareGo');
  t('il link a LinkedIn si apre in una nuova scheda', a.target === '_blank');
  t('con rel di sicurezza', /noopener/.test(a.rel) && /noreferrer/.test(a.rel), a.rel);
  t('senza canvas il pannello funziona comunque, nessun errore dell\'app',
    errors.length === 0, errors.slice(0, 2).join('|'));
  t('   il canvas mancante è solo un limite dell\'ambiente di test',
    nonImplementate.some(m => /getContext/.test(m)), nonImplementate[0] || 'nessuno');
  t('   e l\'anteprima viene rimossa invece di restare vuota',
    !w.document.querySelector('#sharePreview'));
  t('è un dialog accessibile', d.getAttribute('role') === 'dialog' && d.getAttribute('aria-modal') === 'true');
  click('#shareClose');
  t('si chiude', d.hidden);
}

/* ── il pulsante si aggiorna quando la serie cresce ── */
{
  const { w } = await boot({ seed: seed(0) });
  const L = w.__LEARN__, S = solver(w, L);
  t('all\'inizio nessun pulsante', !w.document.querySelector('.share-cta'));
  L.startLesson('u1l1');
  for (let i = 0; i < 5; i++) { S.giusto(L.run.current.ex); L.onCheck(); L.onCheck(); }
  await pausa(60);
  t('arrivati a 5 il pulsante compare da solo', !!w.document.querySelector('.share-cta'),
    'serie ' + L.state.streakBest);
  t('e riporta il numero giusto', /5-answer/.test(w.document.querySelector('.share-cta').textContent),
    w.document.querySelector('.share-cta').textContent.trim());
}

/* ── coerenza del pacchetto ── */
{
  const html = fs.readFileSync(DIR + '/learn.html', 'utf8');
  const sw = fs.readFileSync(DIR + '/sw.js', 'utf8');
  t('share.js è dichiarato nella pagina', /<script src="share\.js"><\/script>/.test(html));
  t('caricato dopo app.js (gli serve lo stato)', html.indexOf('app.js') < html.indexOf('share.js'));
  t('è nella shell offline', /'share\.js'/.test(sw));
  // il numero cresce a ogni rilascio: qui basta che il formato regga
  t('il service worker ha una versione leggibile', /const VERSION = 'v\d+'/.test(sw),
    (sw.match(/VERSION = '(v\d+)'/) || [])[1]);
  const cfg = fs.readFileSync(DIR + '/supabase-config.example.js', 'utf8');
  t('siteUrl è configurabile ma opzionale', /siteUrl: ''/.test(cfg));
}
t.fine();
