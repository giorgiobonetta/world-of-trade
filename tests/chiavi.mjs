import { boot, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Chiavi Supabase');

const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64')
  .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const jwt = ruolo => 'eyJhbGciOiJIUzI1NiJ9.' + b64({ role: ruolo, iss: 'supabase' }) + '.firma';

/* con una chiave pubblica il cloud si accende */
for (const [nome, campo, valore] of [
  ['anon legacy (eyJ…)', 'anonKey', jwt('anon')],
  ['publishable nuova (sb_publishable_…)', 'publishableKey', 'sb_publishable_abc123'],
]) {
  const cfg = fs.readFileSync(DIR + '/supabase-config.js', 'utf8')
    .replace("url: ''", "url: 'https://x.supabase.co'")
    .replace(`${campo}: ''`, `${campo}: '${valore}'`);
  const { w, errors } = await bootConCfg(cfg);
  t(`${nome}: il cloud si accende`, w.WOT_CLOUD_API.enabled === true);
  t(`${nome}: nessun allarme`, w.WOT_CLOUD_API.chiaveSegreta === false);
  t(`${nome}: compare l'invito ad accedere`, !!w.document.querySelector('#cloudOpen'));
  t(`${nome}: nessun errore runtime`, errors.length === 0, errors.slice(0,2).join('|'));
}

/* con una chiave SEGRETA deve spegnersi e urlare */
for (const [nome, campo, valore] of [
  ['service_role legacy', 'anonKey', jwt('service_role')],
  ['sb_secret_ nuova', 'publishableKey', 'sb_secret_pericolosa'],
]) {
  const cfg = fs.readFileSync(DIR + '/supabase-config.js', 'utf8')
    .replace("url: ''", "url: 'https://x.supabase.co'")
    .replace(`${campo}: ''`, `${campo}: '${valore}'`);
  const { w } = await bootConCfg(cfg);
  t(`${nome}: riconosciuta come segreta`, w.WOT_CLOUD_API.chiaveSegreta === true);
  t(`${nome}: il cloud resta spento`, w.WOT_CLOUD_API.enabled === false);
  t(`${nome}: nessun pulsante di accesso`, !w.document.querySelector('#cloudOpen'));
  const avviso = w.document.querySelector('.cloud-danger');
  t(`${nome}: l'avviso è visibile all'utente`, !!avviso && /SECRET key/.test(avviso.textContent),
    avviso ? avviso.textContent.slice(0, 60) : 'assente');
  t(`${nome}: e dice di revocarla`, /rotate it/.test(avviso?.textContent || ''));
  t(`${nome}: l'avviso è annunciato`, avviso?.getAttribute('role') === 'alert');
}

/* il riconoscimento in sé */
{
  const { w } = await boot({ cloud: true });
  const seg = w.WOT_CLOUD_API.segreta;
  t('riconosce sb_secret_', seg('sb_secret_x') === true);
  t('riconosce un JWT service_role', seg(jwt('service_role')) === true);
  t('lascia passare sb_publishable_', seg('sb_publishable_x') === false);
  t('lascia passare un JWT anon', seg(jwt('anon')) === false);
  t('non si spaventa per una stringa qualunque', seg('boh') === false);
  t('né per una chiave vuota', seg('') === false);
}

/* il file spedito non deve contenere chiavi */
{
  const cfg = fs.readFileSync(DIR + '/supabase-config.js', 'utf8');
  t('la configurazione è spedita vuota',
    /url: ''/.test(cfg) && /anonKey: ''/.test(cfg) && /publishableKey: ''/.test(cfg));
  t('spiega quale chiave serve, con entrambi i nomi',
    /anon public/.test(cfg) && /publishable/.test(cfg));
  t('avverte esplicitamente su service_role e sb_secret',
    /service_role/.test(cfg) && /sb_secret/.test(cfg));
  t('nessuna chiave vera è finita nel pacchetto',
    !/eyJ[A-Za-z0-9_-]{20,}/.test(cfg) && !/sb_(secret|publishable)_[A-Za-z0-9]{6,}/.test(cfg));
  const setup = fs.readFileSync(DIR + '/SUPABASE-SETUP.md', 'utf8');
  t('le istruzioni coprono entrambi i nomi di chiave',
    /publishable/i.test(setup) && /anon/i.test(setup));
}

async function bootConCfg(cfg) {
  // stessa procedura di harness.boot, ma con la config sostituita
  const { JSDOM, VirtualConsole } = await import('jsdom');
  const errors = []; const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Not implemented/.test(e.message||'')) errors.push('ERR: '+e.message); });
  const html = fs.readFileSync(DIR + '/learn.html', 'utf8');
  const dom = new JSDOM(html, { runScripts:'outside-only', pretendToBeVisual:true,
    url:'https://wot.test/learn', virtualConsole: vc });
  const w = dom.window; w.confirm=()=>true; w.scrollTo=()=>{};
  w.fetch = async () => { throw new Error('rete non prevista'); };
  for (const f of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1])) {
    if (f === 'pwa.js') continue;
    w.eval(f === 'supabase-config.js' ? cfg : fs.readFileSync(DIR + '/' + f, 'utf8'));
  }
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  await pausa(80);
  return { w, errors };
}
t.fine();
