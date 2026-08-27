import { boot, solver, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Regressioni');
const leggi = f => fs.readFileSync(DIR + '/' + f, 'utf8');

/* ── cablaggio: la pagina deve dichiarare tutto ciò che usa ── */
{
  const html = leggi('learn.html');
  for (const f of ['mascot.js','curriculum.js','content-engine.js','career.js','competitive.js','app.js','pwa.js','cloud.js','share.js','supabase-config.js'])
    t('learn.html carica ' + f, html.includes(`<script src="${f}"></script>`));
  t('mascot.js prima di app.js', html.indexOf('mascot.js') < html.indexOf('app.js'));
  t('content-engine.js tra curriculum e career', html.indexOf('curriculum.js') < html.indexOf('content-engine.js') && html.indexOf('content-engine.js') < html.indexOf('career.js'));
  t('career.js prima di app.js', html.indexOf('career.js') < html.indexOf('app.js'));
  t('competitive.js tra career e app', html.indexOf('career.js') < html.indexOf('competitive.js') && html.indexOf('competitive.js') < html.indexOf('app.js'));
  t('cinque tab principali incluso League', (html.match(/class="nav-item/g)||[]).length === 5 && html.includes('data-screen="leagueScreen"'));
  t('config prima di cloud.js', html.indexOf('supabase-config.js') < html.indexOf('cloud.js'));
  const dichiarati = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  // supabase-config.js è dichiarato dalla pagina ma non spedito: lo crea chi installa
  const presente = f => fs.existsSync(DIR + '/' + f) ||
    (f === 'supabase-config.js' && fs.existsSync(DIR + '/supabase-config.example.js'));
  t('ogni script dichiarato esiste, o ha il suo esempio',
    dichiarati.every(presente), dichiarati.filter(f => !presente(f)).join(','));
}

/* ── curriculum ── */
{
  const { w, errors } = await boot();
  const L = w.__LEARN__;
  const es = L.allLessons.reduce((a, l) => a + l.exercises.length, 0);
  t('20 unità, 103 livelli, 505 esercizi',
    L.UNITS.length === 20 && L.allLessons.length === 103 && es === 505,
    `${L.UNITS.length}u ${L.allLessons.length}l ${es}e`);
  t('il percorso disegna un nodo per lezione', w.document.querySelectorAll('.node').length === 103);
  t('solo la prima è aperta',
    w.document.querySelectorAll('.node.next').length === 1 &&
    w.document.querySelectorAll('.node.locked').length === 102);
  t('le bloccate non sono cliccabili',
    [...w.document.querySelectorAll('.node.locked')].every(n => n.disabled));
  t('ogni esercizio ha una spiegazione',
    L.allLessons.every(l => l.exercises.every(e => e.why && e.why.length > 40)));
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── Hélène nei tre punti ── */
{
  const { w } = await boot();
  const L = w.__LEARN__, S = solver(w, L);
  t('Hélène sul percorso', !!w.document.querySelector('#pathGreet svg'));
  L.startLesson('u1l1');
  S.giusto(L.run.current.ex); L.onCheck();
  t('Hélène nel feedback', !!w.document.querySelector('#feedback svg'));
  t('con una reazione a parole', /Hélène/.test(S.$('#feedback').textContent));
  L.onCheck();
  await S.gioca();
  t('Hélène a fine lezione', !!w.document.querySelector('.done-crest svg'));
}

/* ── ripasso e checkpoint ── */
{
  const now = Date.now();
  const { w } = await boot({ seed: { done: ['u1l1','u1l2','u1l3','u1l4'], xp: 80, best: {}, badges: {},
    misses: { 'u1l2#1': 3 }, doneAt: { u1l1: now, u1l2: now, u1l3: now, u1l4: now }, reviews: 0, updatedAt: 1 } });
  const L = w.__LEARN__;
  t('la card di ripasso compare', !!w.document.querySelector('#reviewButton'));
  const items = L.reviewItems();
  t('il ripasso pesca 8 esercizi', items.length === 8, String(items.length));
  t('l\'errore ripetuto è il primo', items[0].lessonId === 'u1l2' && items[0].i === 1);
  t('solo da lezioni completate', items.every(i => L.state.done.includes(i.lessonId)));
  t('un solo checkpoint disponibile', w.document.querySelectorAll('[data-check]').length === 1);
  const cp = L.checkpointItems(L.UNITS[0]);
  t('il checkpoint pesca 8 domande su tutte le lezioni',
    cp.length === 8 && new Set(cp.map(x => x.lessonId)).size === 4);
  t('il checkpoint ha più vite di una lezione', L.CHECK_HEARTS > L.HEARTS);
}

/* ── compatibilità dei salvataggi ── */
{
  const { w, errors } = await boot({ seed: { done: ['u1l1','u1l2'], xp: 37, streak: 4, best: { u1l1: 80 } } });
  const st = w.__LEARN__.state;
  t('un salvataggio vecchio si carica', errors.length === 0 && st.xp === 37 && st.streak === 4);
  t('i campi nuovi sono ricostruiti',
    ['misses','doneAt','badges'].every(k => st[k] && typeof st[k] === 'object') &&
    st.reviews === 0 && st.streakBest === 0);
}
{
  const { w, errors } = await boot({ seed: '{"done":"non un array","best":42,"misses":null}' });
  t('un salvataggio corrotto non rompe nulla', errors.length === 0 && !!w.__LEARN__);
  t('i tipi sbagliati sono normalizzati',
    Array.isArray(w.__LEARN__.state.done) && typeof w.__LEARN__.state.best === 'object');
}

/* ── i due bug storici dell'engine ── */
{
  const { w } = await boot();
  const L = w.__LEARN__, S = solver(w, L);
  const bd = L.UNITS.flatMap(u => u.lessons).flatMap(l => l.exercises)
    .find(e => e.type === 'build' && new Set(e.sentence).size !== e.sentence.length);
  t('esiste un build con parole ripetute', !!bd, bd ? bd.sentence.join(' ') : '');
  const pr = L.UNITS.flatMap(u => u.lessons).flatMap(l => l.exercises)
    .find(e => e.type === 'pairs' && new Set(e.pairs.map(p => p[1])).size !== e.pairs.length);
  t('esiste un pairs con etichette destre identiche', !!pr, pr ? pr.pairs.map(p => p[1]).join('/') : '');
  // il pairs con doppioni deve accettare l'abbinamento corretto su entrambe
  const lez = L.UNITS.flatMap(u => u.lessons).find(l => l.exercises.includes(pr));
  L.startLesson(lez.id);
  let g = 0;
  while (L.run && L.run.current.ex !== pr && g++ < 20) { S.giusto(L.run.current.ex); L.onCheck(); L.onCheck(); }
  if (L.run && L.run.current.ex === pr) {
    let rifiutati = 0;
    [...pr.pairs.keys()].reverse().forEach(k => {
      S.click(S.$(`[data-side="l"][data-i="${k}"]`));
      const b = S.$$('[data-side="r"]').find(x => x.textContent === pr.pairs[k][1] && !x.classList.contains('matched'));
      S.click(b);
      if (b && b.classList.contains('no')) rifiutati++;
    });
    t('nessun abbinamento corretto viene rifiutato', rifiutati === 0, rifiutati + ' rifiutati');
    t('tutti gli abbinamenti sono riconosciuti',
      L.run.pairState.matched.length === pr.pairs.length && L.run.pairState.wrong === 0);
  }
}

/* ── accessibilità ── */
{
  const { w } = await boot();
  const L = w.__LEARN__, S = solver(w, L);
  const senzaNome = [...w.document.querySelectorAll('button,a[href]')]
    .filter(b => !(b.textContent || '').trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'));
  t('ogni controllo ha un nome accessibile', senzaNome.length === 0,
    senzaNome.map(b => b.id || b.className).join(','));
  t('nessun pulsante annidato', w.document.querySelectorAll('button button').length === 0);
  t('il feedback viene annunciato', S.$('#feedback').getAttribute('role') === 'status');
  t('le barre sono progressbar ARIA',
    S.$('#lessonProgressBar')?.getAttribute('role') === 'progressbar' &&
    S.$('#courseTrack')?.getAttribute('role') === 'progressbar');
  L.startLesson('u1l1');
  t('le vite dicono quante ne restano', /\d+ of \d+/.test(S.$('#hearts').getAttribute('aria-label')),
    S.$('#hearts').getAttribute('aria-label'));
  t('lo sfondo è invisibile alle tecnologie assistive',
    w.document.querySelector('svg.backdrop')?.getAttribute('aria-hidden') === 'true');
  t('e fuori dal percorso di tabulazione',
    w.document.querySelectorAll('.backdrop button, .backdrop a, .backdrop [tabindex]').length === 0);
}

/* ── PWA, cache e sicurezza del pacchetto ── */
{
  const m = JSON.parse(leggi('manifest.webmanifest'));
  t('il manifest apre l\'app, non la landing', m.start_url === 'learn.html', m.start_url);
  t('ha un\'icona maskable', m.icons.some(i => (i.purpose || '').includes('maskable')));
  t('tutte le icone esistono', m.icons.every(i => fs.existsSync(DIR + '/' + i.src)));
  const sw = leggi('sw.js');
  const shell = [...sw.matchAll(/^\s*'([^']+)',$/gm)].map(x => x[1]).filter(x => x !== './');
  t('ogni file della shell esiste', shell.every(f => fs.existsSync(DIR + '/' + f)),
    shell.filter(f => !fs.existsSync(DIR + '/' + f)).join(','));
  for (const f of ['learn.html','app.js','curriculum.js','career.js','competitive.js','mascot.js','styles.css','cloud.js','share.js'])
    t('shell include ' + f, shell.includes(f));
  t('l\'HTML è network-first', sw.indexOf('await fetch(req)') < sw.indexOf('caches.match(req)'));
  t('la cache è versionata e le vecchie si cancellano',
    /const VERSION = 'v\d+'/.test(sw) && /caches\.delete/.test(sw));
  t('niente addAll', !/addAll/.test(sw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')));
  const vc = JSON.parse(leggi('vercel.json'));
  const catchall = vc.headers.filter(h => h.source.startsWith('/(.*)'));
  t('nessuna immagine è immutable (la trappola della cache)',
    catchall.every(h => h.headers.every(k => !/immutable/.test(k.value))));
  const senzaCache = vc.headers.filter(h => h.headers.some(k => /max-age=0/.test(k.value))).map(h => h.source);
  for (const f of ['/sw.js','/supabase-config.js','/cloud.js','/share.js'])
    t('non cachato a lungo: ' + f, senzaCache.includes(f));
  t('la config di esempio è spedita vuota', /url: ''/.test(leggi('supabase-config.example.js')));
  t('e il file reale non è nel pacchetto', !fs.existsSync(DIR + '/supabase-config.js'),
    'includerlo cancellerebbe le chiavi di chi installa');
  // la PAROLA service_role compare legittimamente nel controllo di sicurezza:
  // qui va cercato materiale di chiave vero, non la menzione
  const sorgenti = ['cloud.js','supabase-config.example.js','learn.html','index.html','share.js','pwa.js']
    .map(leggi).join('\n');
  t('nessun JWT vero è finito nel codice', !/eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}/.test(sorgenti));
  t('nessuna chiave sb_secret_ o sb_publishable_ vera',
    !/sb_(secret|publishable)_[A-Za-z0-9]{8,}/.test(sorgenti));
  t('ma il codice sa riconoscere una chiave segreta',
    /sb_secret_/.test(leggi('cloud.js')) && /service_role/.test(leggi('cloud.js')));
  t('e la configurazione avverte di non incollarla',
    /service_role/.test(leggi('supabase-config.example.js')));
}

/* ── i loghi sono davvero ritagliati ── */
{
  const png = f => {
    const b = fs.readFileSync(DIR + '/' + f);
    // PNG: colour type 6 = RGBA, 4 = grigio+alpha (byte 25 dell'header IHDR)
    return { alpha: [4, 6].includes(b[25]), w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  };
  for (const f of ['logo-crest-500.png','logo-crest-220.png']) {
    const i = png(f);
    t(f + ': ha un canale alpha', i.alpha, `${i.w}x${i.h}`);
  }
  const a = png('logo-crest-500.png'), b = png('logo-crest-220.png');
  t('le due misure hanno lo stesso rapporto', Math.abs(a.w / a.h - b.w / b.h) < 0.02);
  t('le icone dell\'app restano opache (a un\'icona serve il fondo)',
    !png('world-of-trade-premium-icon-192.png').alpha && !png('icon-maskable-512.png').alpha);
  const land = leggi('index.html');
  t('i loghi hanno un nome versionato',
    /logo-crest-\d+\.(webp|png)/.test(land) && !/premium-logo/.test(land));
}
t.fine();
