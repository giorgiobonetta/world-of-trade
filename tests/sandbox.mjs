import { boot, solver, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Sandbox e autodiagnosi');

/* ── la sandbox non deve toccare la carriera vera ── */
{
  const vera = { done: ['u1l1','u1l2','u1l3'], xp: 99, best: { u1l1: 100 }, badges: { u1: 90 },
                 misses: {}, doneAt: {}, streakBest: 12, updatedAt: 7 };
  const { w, errors } = await boot({ query: '?sandbox=1', seed: vera });
  const L = w.__LEARN__;
  t('la sandbox si attiva col parametro', L.SANDBOX === true);
  t('usa una chiave di salvataggio diversa', L.STORAGE_KEY === 'wot-learn-selftest', L.STORAGE_KEY);
  t('non legge la carriera vera', L.state.done.length === 0 && L.state.xp === 0,
    `${L.state.done.length} lezioni, ${L.state.xp} xp`);
  t('e il record di serie riparte da zero', L.state.streakBest === 0);

  // gioco e verifico che la chiave vera resti intatta
  const prima = w.localStorage.getItem('wot-learn-v1');
  const S = solver(w, L);
  L.startLesson('u1l1');
  await S.gioca();                                  // una lezione intera, davvero
  t('giocando in sandbox la carriera vera non cambia',
    w.localStorage.getItem('wot-learn-v1') === prima);
  t('e resta quella di partenza', JSON.parse(prima).xp === 99 && JSON.parse(prima).done.length === 3,
    'xp ' + JSON.parse(prima).xp);
  const grezzo = w.localStorage.getItem('wot-learn-selftest');
  t('mentre la chiave di prova viene scritta', !!grezzo);
  const prova = JSON.parse(grezzo || '{}');
  t('e contiene solo la lezione di prova', prova.done && prova.done.length === 1,
    JSON.stringify(prova.done));
  t('senza ereditare badge o serie dalla carriera vera',
    !Object.keys(prova.badges || {}).length && (prova.streakBest || 0) < 12,
    'badge ' + JSON.stringify(prova.badges) + ' · serie ' + prova.streakBest);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── senza il parametro tutto resta come prima ── */
{
  const vera = { done: ['u1l1','u1l2'], xp: 55, best: {}, badges: {}, misses: {}, doneAt: {}, updatedAt: 1 };
  const { w } = await boot({ seed: vera });
  t('senza parametro la sandbox è spenta', w.__LEARN__.SANDBOX === false);
  t('e si usa la chiave normale', w.__LEARN__.STORAGE_KEY === 'wot-learn-v1');
  t('la carriera si carica', w.__LEARN__.state.xp === 55);
}

/* ── in sandbox il cloud deve stare zitto ── */
{
  const chiamate = [];
  const sb = { fetch: async (u) => { chiamate.push(String(u)); throw new Error('non deve succedere'); } };
  const { w, errors } = await boot({ query: '?sandbox=1', cloud: true, sb,
    sessione: { access_token: 'x', refresh_token: 'y', user: { id: 'uid', email: 'a@b.it' } } });
  await pausa(200);
  t('in sandbox il cloud è disattivato', w.WOT_CLOUD_API.enabled === false);
  t('nessuna chiamata di rete, nemmeno con una sessione salvata', chiamate.length === 0,
    chiamate.join(', '));
  t('nessuna interfaccia di accesso', !w.document.querySelector('#cloudOpen') &&
    !w.document.querySelector('#cloudSync'));
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── la pagina di autodiagnosi ── */
{
  const html = fs.readFileSync(DIR + '/selftest.html', 'utf8');
  const js = fs.readFileSync(DIR + '/selftest.js', 'utf8');
  t('la pagina esiste ed è collegata al suo script',
    /<script src="selftest\.js"><\/script>/.test(html));
  t('non va indicizzata dai motori', /name="robots" content="noindex"/.test(html));
  t('apre l\'app in sandbox, non normalmente',
    /learn\.html\?sandbox=1/.test(js), (js.match(/learn\.html[^']*/) || [])[0]);
  t('l\'iframe è fuori schermo, non sopra la pagina', /\.st-frame\{[^}]*left:-10000px/.test(html));
  t('c\'è un pulsante per avviare', /id="stRun"/.test(html));
  t('e uno per copiare il report', /id="stCopy"/.test(html));

  // i controlli che giustificano l'esistenza di questa pagina
  const attesi = [
    ['visibilità reale calcolata', /getComputedStyle\(el\)\.display !== 'none'/],
    ['cosa c\'è al centro dello schermo', /elementFromPoint/],
    ['contrasto sui colori veri', /function rapporto\(/],
    ['sfondo effettivo risalendo gli antenati', /function sfondoEffettivo\(/],
    ['soglia diversa per il testo grande', /const soglia = /],
    ['traboccamento orizzontale', /scrollWidth <= w\.innerWidth/],
    ['testo tagliato dentro il suo box', /scrollWidth > el\.clientWidth/],
    ['dimensione minima dei tocchi', /r\.height < 44/],
    ['il font è caricato davvero', /document\.fonts\.check/],
    ['canvas funzionante', /toDataURL/],
    ['service worker registrato', /getRegistrations/],
    ['una sola versione di cache', /caches\.keys/],
    ['localStorage scrivibile', /localStorage\.setItem\('__st'/],
    ['una lezione giocata davvero', /#checkButton/],
    ['lo sfondo non intercetta i clic', /pointerEvents/],
    ['pulizia della chiave di prova', /removeItem\('wot-learn-selftest'\)/],
  ];
  for (const [nome, re] of attesi) t('controlla: ' + nome, re.test(js));

  t('se la pagina stessa esplode lo dice invece di restare muta',
    /the self-check itself crashed/.test(js));
  t('il report include il browser e la dimensione dello schermo',
    /navigator\.userAgent/.test(js) && /innerWidth/.test(js));
  t('la pagina non è in cache: deve testare la versione viva',
    !/selftest/.test(fs.readFileSync(DIR + '/sw.js', 'utf8')));
  const vc = JSON.parse(fs.readFileSync(DIR + '/vercel.json', 'utf8'));
  const noCache = vc.headers.filter(h => h.headers.some(k => /max-age=0/.test(k.value))).map(h => h.source);
  t('e nemmeno lato server', noCache.includes('/selftest.html') && noCache.includes('/selftest.js'));
}
t.fine();
