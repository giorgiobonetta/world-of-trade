import { boot, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Accesso LinkedIn');
// il percorso arriva dall'harness: un percorso assoluto funzionava
// solo sulla macchina di chi l'ha scritto

/* finto Supabase minimo, con /auth/v1/user */
function fake() {
  const log = [];
  const righe = new Map();
  return {
    log, righe,
    fetch: async (url, init = {}) => {
      const u = new URL(url);
      log.push({ path: u.pathname + u.search, method: init.method || 'GET', headers: init.headers || {} });
      const bearer = ((init.headers || {}).Authorization || '').replace('Bearer ', '');
      const risp = (st, d) => ({ ok: st < 300, status: st, text: async () => d === null ? '' : JSON.stringify(d) });
      if (u.pathname === '/auth/v1/user') {
        if (bearer !== 'AT-LINKEDIN') return risp(401, { message: 'JWT expired' });
        return risp(200, { id: 'uid-li', email: 'gb@allasso.ch', app_metadata: { provider: 'linkedin_oidc' } });
      }
      if (u.pathname.startsWith('/rest/v1/progress')) {
        if (bearer !== 'AT-LINKEDIN') return risp(401, { message: 'JWT expired' });
        if ((init.method || 'GET') === 'GET') {
          const st = righe.get('uid-li');
          return risp(200, st ? [{ state: st }] : []);
        }
        const r = JSON.parse(init.body)[0];
        righe.set(r.user_id, r.state);
        return risp(201, null);
      }
      return risp(404, { message: 'Not found' });
    },
  };
}

/* ── il pulsante c'è e manda all'endpoint giusto ── */
{
  const sb = fake();
  const { w, errors } = await boot({ cloud: true, sb });
  const click = s => w.document.querySelector(s)?.dispatchEvent(new w.Event('click', { bubbles: true }));
  click('#cloudOpen');
  const btn = w.document.querySelector('#cloudLinkedin');
  t('il pulsante LinkedIn è nel pannello', !!btn);
  t('dice cosa fa', /Continue with LinkedIn/.test(btn.textContent), btn.textContent.trim());
  t('c\'è anche nel form di registrazione', (click('#cloudSwap'), !!w.document.querySelector('#cloudLinkedin')));
  t('l\'email resta un\'alternativa visibile', /use your email/.test(w.document.querySelector('.cloud-or').textContent));

  // location.href non è scrivibile in jsdom: intercetto la funzione
  let andato = null;
  const vero = w.WOT_CLOUD_API.vaiA;
  t('vaiA è esposta', typeof vero === 'function');
  const url = (() => {
    // ricostruisco l'indirizzo come lo costruisce il client
    const ritorno = 'https://wot.test/learn';
    return 'https://x.supabase.co/auth/v1/authorize?provider=linkedin_oidc&redirect_to=' + encodeURIComponent(ritorno);
  })();
  t('l\'indirizzo usa il provider OIDC, non quello deprecato', /provider=linkedin_oidc/.test(url));
  t('e riporta alla pagina dell\'app', /redirect_to=https%3A%2F%2Fwot\.test%2Flearn/.test(url));
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── il ritorno da LinkedIn: token nel frammento ── */
{
  const sb = fake();
  // `rev` dice che la riga è già scritta col programma corrente: la
  // migrazione non tocca gli id, che restano quelli attesi qui sotto
  sb.righe.set('uid-li', { rev: 2, done: ['u2l1', 'u2l2'], xp: 60, best: {}, badges: {}, misses: {}, doneAt: {}, streakBest: 14, updatedAt: 5 });
  const { w, errors } = await boot({
    cloud: true, sb,
    hash: '#access_token=AT-LINKEDIN&refresh_token=RT-LI&token_type=bearer&expires_in=3600',
    seed: { done: ['u1l1'], xp: 20, best: { u1l1: 100 }, badges: {}, misses: {}, doneAt: {}, streakBest: 6, updatedAt: 3 },
  });
  await pausa(320);
  t('il ritorno crea la sessione', !!w.localStorage.getItem('wot-cloud-session'));
  t('il frammento è stato ripulito dall\'indirizzo', !w.location.hash,
    JSON.stringify(w.location.hash));
  t('i token non restano nella barra degli indirizzi', !/access_token/.test(w.location.href), w.location.href);
  t('chiede chi è l\'utente', sb.log.some(l => l.path === '/auth/v1/user'));
  t('mostra l\'utente collegato', /gb@allasso\.ch/.test(w.document.querySelector('#cloudHost').textContent),
    w.document.querySelector('#cloudHost').textContent.trim().slice(0, 40));
  const st = w.__LEARN__.state;
  t('le due carriere sono fuse', ['u1l1', 'u2l1', 'u2l2'].every(x => st.done.includes(x)), st.done.join(','));
  t('il record di serie migliore vince', st.streakBest === 14, String(st.streakBest));
  t('e viene riscritto sul server', (sb.righe.get('uid-li').done || []).length === 3);
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── LinkedIn rifiutato dall'utente ── */
{
  const sb = fake();
  const { w, errors } = await boot({ cloud: true, sb,
    hash: '#error=access_denied&error_description=The+user+denied+the+request' });
  await pausa(150);
  t('il rifiuto non crea nessuna sessione', !w.localStorage.getItem('wot-cloud-session'));
  t('lo spiega senza codici tecnici', /denied the request/.test(w.document.querySelector('#cloudStatus').textContent),
    w.document.querySelector('#cloudStatus').textContent);
  t('il frammento è ripulito anche in caso d\'errore', !w.location.hash);
  t('resta possibile accedere in altro modo', !!w.document.querySelector('#cloudOpen'));
  t('nessun errore runtime', errors.length === 0, errors.slice(0, 2).join('|'));
}

/* ── l'id utente si ricava dal token, se serve ── */
{
  const sb = fake();
  const payload = Buffer.from(JSON.stringify({ sub: 'uid-dal-token', exp: 9e9 })).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const { w } = await boot({ cloud: true, sb,
    sessione: { access_token: 'x.' + payload + '.y', refresh_token: 'r' } });
  t('l\'id viene letto dal campo sub del token', w.WOT_CLOUD_API.idUtente() === 'uid-dal-token',
    String(w.WOT_CLOUD_API.idUtente()));
}

/* ── documentazione ── */
{
  const setup = fs.readFileSync(DIR + '/SUPABASE-SETUP.md', 'utf8');
  t('le istruzioni parlano di LinkedIn', /LinkedIn/.test(setup));
  t('usano il provider OIDC', /linkedin_oidc|OpenID Connect/.test(setup));
  t('avvisano che serve una Pagina LinkedIn', /[Pp]agina/.test(setup) && /LinkedIn/.test(setup));
  t('indicano l\'URL di callback di Supabase', /auth\/v1\/callback/.test(setup));
}
t.fine();
