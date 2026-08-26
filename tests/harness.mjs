import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';
import path from 'path';
export const DIR = path.resolve(new URL('.', import.meta.url).pathname, '..');

/* Carica la pagina eseguendo ESATTAMENTE gli script che dichiara, nel suo ordine.
   Elencarli a mano qui dentro nascose una volta un <script> dimenticato. */
export async function boot({ seed, sessione, cloud = false, sb, hash = '', query = '', css = false, pagina = 'learn.html', readyState } = {}) {
  const errors = [];
  const vc = new VirtualConsole();
  // jsdom segnala al virtual console anche le API che non implementa (canvas, ecc.).
  // Non sono errori dell'app: le teniamo da parte invece di confonderle con i bug.
  const nonImplementate = [];
  vc.on('jsdomError', e => {
    const m = e.message || '';
    if (/Not implemented/.test(m)) nonImplementate.push(m.replace(/\n[\s\S]*/, ''));
    else errors.push('ERR: ' + (e.stack || m));
  });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  // Una async function che fallisce NON lancia: produce un rifiuto non gestito.
  // È così che un ReferenceError è passato inosservato lasciando l'interfaccia
  // non disegnata. Qui conta come errore.
  const suRifiuto = e => errors.push('rifiuto non gestito: ' + ((e && e.reason && e.reason.message) || e.reason || e));
  process.on('unhandledRejection', suRifiuto);
  const html = fs.readFileSync(DIR + '/' + pagina, 'utf8');
  // jsdom non scarica il CSS referenziato da <link>. Si può iniettare, ma
  // attenzione: jsdom non implementa `!important` nella cascata, quindi
  // getComputedStyle NON è una prova affidabile. Vedi visibilita.mjs.
  const conCss = css
    ? html.replace('</head>', '<style>' + fs.readFileSync(DIR + '/styles.css', 'utf8') + '</style></head>')
    : html;
  const dom = new JSDOM(conCss, { runScripts: 'outside-only', pretendToBeVisual: true,
    url: 'https://wot.test/' + pagina.replace('.html', '') + query + hash, virtualConsole: vc });
  const w = dom.window;
  w.confirm = () => true;
  w.scrollTo = () => {};
  if (sb) w.fetch = sb.fetch;
  if (seed !== undefined) w.localStorage.setItem('wot-learn-v1', JSON.stringify(seed));
  if (sessione !== undefined) w.localStorage.setItem('wot-cloud-session', JSON.stringify(sessione));

  // Per riprodurre davvero "il documento era già pronto quando lo script è partito"
  // non basta falsificare readyState: jsdom emette comunque DOMContentLoaded dopo,
  // dando agli script una seconda occasione che nel browser non avrebbero.
  // Bisogna aspettare che l'evento sia passato, e solo allora eseguirli.
  if (readyState && readyState !== 'loading') {
    await new Promise(r => {
      if (w.document.readyState !== 'loading') return r();
      w.document.addEventListener('DOMContentLoaded', r, { once: true });
      setTimeout(r, 400);
    });
    await pausa(20);
  }
  if (readyState) Object.defineProperty(w.document, 'readyState', { value: readyState, configurable: true });
  const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  if (!srcs.length) errors.push('nessuno script dichiarato in ' + pagina);
  for (const f of srcs) {
    if (f === 'pwa.js') continue;                       // testato a parte
    if (!fs.existsSync(DIR + '/' + f)) { errors.push('script dichiarato ma mancante: ' + f); continue; }
    let code = fs.readFileSync(DIR + '/' + f, 'utf8');
    if (f === 'supabase-config.js' && cloud)
      code = code.replace("url: ''", "url: 'https://x.supabase.co'")
                 .replace("anonKey: ''", "anonKey: 'CHIAVE_ANON'");
    w.eval(code);
  }
  // nel browser un documento già 'complete' non riemette DOMContentLoaded:
  // simularlo darebbe agli script una seconda occasione che nella realtà non hanno
  if (!readyState || readyState === 'loading')
    w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  await pausa(70);
  process.off('unhandledRejection', suRifiuto);
  return { w, errors, nonImplementate, scripts: srcs };
}

export const pausa = (ms = 120) => new Promise(r => setTimeout(r, ms));

/* Risolve un esercizio qualunque, correttamente o sbagliando. */
export function solver(w, L) {
  const $ = s => w.document.querySelector(s);
  const $$ = s => [...w.document.querySelectorAll(s)];
  const click = e => e && e.dispatchEvent(new w.Event('click', { bubbles: true }));
  const giusto = ex => {
    if (ex.type === 'choice') click($$('.opt')[ex.answer]);
    else if (ex.type === 'numeric') { const i = $('#numInput'); i.value = String(ex.answer); i.dispatchEvent(new w.Event('input', { bubbles: true })); }
    else if (ex.type === 'order') { for (let r = 0; r < 12; r++) for (let p = 0; p < L.run.order.length - 1; p++) if (L.run.order[p].i > L.run.order[p + 1].i) click($$('[data-mv="down"]')[p]); }
    else if (ex.type === 'pairs') ex.pairs.forEach((_, k) => { click($(`[data-side="l"][data-i="${k}"]`)); click($(`[data-side="r"][data-i="${k}"]`)); });
    else if (ex.type === 'build') ex.sentence.slice(1).forEach(word => click($$('[data-add]').find(x => x.dataset.word === word)));
  };
  const sbagliato = ex => {
    if (ex.type === 'choice') { click($$('.opt')[[0, 1, 2, 3].find(k => k !== ex.answer && $$('.opt')[k])]); return true; }
    if (ex.type === 'numeric') { const i = $('#numInput'); i.value = String((ex.answer || 0) + 7777); i.dispatchEvent(new w.Event('input', { bubbles: true })); return true; }
    return false;    // gli altri tipi non si sbagliano in modo deterministico
  };
  async function gioca(max = 90) {
    let g = 0;
    while ($('#lessonScreen').classList.contains('active') && g++ < max) {
      const ex = L.run?.current?.ex; if (!ex) break;
      giusto(ex); await pausa(10);
      click($('#checkButton')); await pausa(10);
      if ($('#doneScreen').classList.contains('active')) break;
      click($('#checkButton')); await pausa(10);
    }
    return $('#doneScreen').classList.contains('active');
  }
  return { $, $$, click, giusto, sbagliato, gioca };
}

/* Piccolo raccoglitore di asserzioni condiviso da tutte le suite. */
export function suite(nome) {
  const ok = [], ko = [];
  const t = (n, c, i = '') => { (c ? ok : ko).push(n + (i ? ' — ' + i : '')); };
  t.fine = () => {
    console.log(`\n${nome}: ${ok.length} passati, ${ko.length} falliti`);
    ok.forEach(l => console.log('  ✓ ' + l));
    if (ko.length) { console.log(''); ko.forEach(l => console.log('  ✗ ' + l)); }
    process.exitCode = ko.length ? 1 : 0;
    return ko.length;
  };
  return t;
}
