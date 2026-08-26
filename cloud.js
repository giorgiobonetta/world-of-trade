/* World of Trade — Learn · salvataggio della carriera in cloud
   Supabase via API REST, senza SDK: nessuna dipendenza esterna, niente build,
   e l'app resta installabile e utilizzabile offline.
   Se non è configurato, questo file non fa assolutamente nulla. */
(() => {
  'use strict';
  const CFG = window.WOT_CLOUD || {};
  // Supabase sta passando da anon/service_role a publishable/secret:
  // accettiamo entrambi i nomi, così la configurazione si legge naturale
  const CHIAVE = CFG.anonKey || CFG.publishableKey || '';
  // in sandbox non si tocca l'account di nessuno: niente login, niente sincronizzazione
  const SANDBOX = (() => {
    try { return new URLSearchParams(location.search).has('sandbox'); } catch (e) { return false; }
  })();

  /* Una chiave segreta in un file pubblico è la peggior cosa che possa capitare
     a questo progetto: darebbe a chiunque accesso completo al database,
     scavalcando le policy. Meglio spegnere tutto e dirlo forte. */
  function segreta(k) {
    if (!k) return false;
    if (/^sb_secret_/.test(k)) return true;
    try {
      const p = JSON.parse(atob(String(k).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return p.role === 'service_role';
    } catch (e) { return false; }
  }
  const PERICOLO = segreta(CHIAVE);
  if (PERICOLO) {
    const avviso = 'STOP: supabase-config.js contains a SECRET key. '
      + 'Remove it now, rotate it in the Supabase dashboard, and paste the '
      + 'publishable (or anon) key instead. Cloud save is disabled until then.';
    try { console.error(avviso); } catch (e) {}
    document.addEventListener('DOMContentLoaded', () => {
      const h = document.querySelector('#cloudHost');
      if (h) h.innerHTML = '<p class="cloud-danger" role="alert">' + avviso + '</p>';
    });
  }

  const ON = !!(CFG.url && CHIAVE) && !SANDBOX && !PERICOLO;
  const SESS = 'wot-cloud-session';
  const TABLE = 'progress';

  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ── sessione ─────────────────────────────────────────────────────── */
  let session = null;
  const loadSession = () => { try { return JSON.parse(localStorage.getItem(SESS) || 'null'); } catch (e) { return null; } };
  const putSession = s => {
    session = s;
    try { s ? localStorage.setItem(SESS, JSON.stringify(s)) : localStorage.removeItem(SESS); } catch (e) {}
  };

  /* ── chiamate ─────────────────────────────────────────────────────── */
  async function call(path, { method = 'POST', body, auth = false, headers = {} } = {}) {
    const h = { apikey: CHIAVE, 'Content-Type': 'application/json', ...headers };
    if (auth && session) h.Authorization = `Bearer ${session.access_token}`;
    const res = await fetch(CFG.url.replace(/\/$/, '') + path, {
      method, headers: h, body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
    if (!res.ok) {
      const err = new Error(messaggio(res.status, data));
      err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  // gli errori di Supabase sono in inglese e tecnici: qui diventano leggibili
  function messaggio(status, d) {
    const raw = (d && (d.msg || d.message || d.error_description || d.error || d.hint)) || '';
    const t = String(raw).toLowerCase();
    if (t.includes('invalid login credentials')) return 'Wrong email or password.';
    if (t.includes('already registered') || t.includes('already been registered')) return 'That email already has an account. Try signing in.';
    if (t.includes('email not confirmed')) return 'Check your inbox and confirm your email first.';
    if (t.includes('password should be') || t.includes('at least')) return 'Password too short — use at least 6 characters.';
    if (t.includes('unable to validate email') || t.includes('invalid format')) return 'That does not look like an email address.';
    if (t.includes('rate limit') || status === 429) return 'Too many attempts. Wait a minute and try again.';
    if (t.includes('jwt') || t.includes('token')) return 'Your session expired. Sign in again — nothing was lost.';
    if (status === 0 || status >= 500) return 'The server is not answering. Your progress is safe on this device.';
    return raw ? String(raw) : 'Something went wrong. Your progress is safe on this device.';
  }

  async function withFreshToken(fn) {
    try { return await fn(); }
    catch (e) {
      if (e.status !== 401 || !session?.refresh_token) throw e;
      // token scaduto: lo rinnovo una volta sola e riprovo
      const s = await call('/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: session.refresh_token } });
      putSession(s);
      return await fn();
    }
  }

  // LinkedIn passa da Supabase: qui basta mandare il browser all'endpoint giusto
  // e poi raccogliere i token dal frammento dell'indirizzo al ritorno.
  function vaiA(provider) {
    const ritorno = location.origin + location.pathname;
    location.href = CFG.url.replace(/\/$/, '')
      + '/auth/v1/authorize?provider=' + encodeURIComponent(provider)
      + '&redirect_to=' + encodeURIComponent(ritorno);
  }

  // Supabase torna con #access_token=...&refresh_token=... oppure #error=...
  function leggiRitorno() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h) return null;
    const p = new URLSearchParams(h);
    const at = p.get('access_token'), rt = p.get('refresh_token');
    const err = p.get('error_description') || p.get('error');
    // l'indirizzo va ripulito in ogni caso: quei token non devono restare
    // nella barra, nella cronologia o in un link condiviso
    const pulisci = () => { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; } };
    if (err) { pulisci(); return { errore: decodeURIComponent(String(err).replace(/\+/g, ' ')) }; }
    if (!at) return null;
    pulisci();
    return { sessione: { access_token: at, refresh_token: rt || null, token_type: p.get('token_type') || 'bearer' } };
  }

  const signUp = (email, password) => call('/auth/v1/signup', { body: { email, password } });
  const signIn = (email, password) => call('/auth/v1/token?grant_type=password', { body: { email, password } });

  const chiUtente = () => withFreshToken(() => call('/auth/v1/user', { method: 'GET', auth: true }));

  // l'id utente sta anche dentro il token (campo "sub"): utile subito dopo OAuth
  function idUtente() {
    if (session?.user?.id) return session.user.id;
    try {
      const p = JSON.parse(atob(String(session.access_token).split('.')[1]
        .replace(/-/g, '+').replace(/_/g, '/')));
      return p.sub || null;
    } catch (e) { return null; }
  }

  async function pull() {
    const uid = idUtente();
    if (!uid) return null;
    const rows = await withFreshToken(() => call(
      `/rest/v1/${TABLE}?select=state&user_id=eq.${encodeURIComponent(uid)}`,
      { method: 'GET', auth: true }));
    return (Array.isArray(rows) && rows[0] && rows[0].state) || null;
  }

  async function push(state) {
    const uid = idUtente();
    if (!uid) return;
    await withFreshToken(() => call(`/rest/v1/${TABLE}`, {
      method: 'POST', auth: true,
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: [{ user_id: uid, state, updated_at: new Date().toISOString() }],
    }));
  }

  /* ── fusione ──────────────────────────────────────────────────────── */
  // Regole: nessuna lezione completata può sparire, nessun XP contato due volte.
  // Per ogni valore numerico si tiene il migliore fra i due lati.
  function merge(a, b) {
    a = a || {}; b = b || {};
    const maxMap = (x = {}, y = {}) => {
      const out = { ...x };
      for (const k of Object.keys(y)) out[k] = Math.max(Number(out[k]) || 0, Number(y[k]) || 0);
      return out;
    };
    return {
      done: [...new Set([...(a.done || []), ...(b.done || [])])],
      xp: Math.max(Number(a.xp) || 0, Number(b.xp) || 0),
      streak: Math.max(Number(a.streak) || 0, Number(b.streak) || 0),
      lastDay: [a.lastDay, b.lastDay].filter(Boolean).sort().pop() || null,
      reviews: Math.max(Number(a.reviews) || 0, Number(b.reviews) || 0),
      streakBest: Math.max(Number(a.streakBest) || 0, Number(b.streakBest) || 0),
      // la serie in corso è del dispositivo, non della carriera: non si eredita
      streakNow: Number(a.streakNow) || 0,
      best: maxMap(a.best, b.best),
      badges: maxMap(a.badges, b.badges),
      doneAt: maxMap(a.doneAt, b.doneAt),
      misses: maxMap(a.misses, b.misses),
      skillXp: maxMap(a.skillXp, b.skillXp),
      flash: {
        best: Math.max(Number(a.flash?.best) || 0, Number(b.flash?.best) || 0),
        plays: Math.max(Number(a.flash?.plays) || 0, Number(b.flash?.plays) || 0),
        correct: Math.max(Number(a.flash?.correct) || 0, Number(b.flash?.correct) || 0),
        total: Math.max(Number(a.flash?.total) || 0, Number(b.flash?.total) || 0),
      },
      updatedAt: Math.max(Number(a.updatedAt) || 0, Number(b.updatedAt) || 0),
    };
  }

  window.WOT_CLOUD_API = { merge, messaggio, get session() { return session; },
    enabled: ON, chiaveSegreta: PERICOLO, segreta };

  // I pannelli si devono poter chiudere in ogni caso, anche se il cloud è spento:
  // un modale che non si chiude blocca l'intera app.
  function agganciaChiusure() {
    document.querySelectorAll('.cloud-dialog').forEach(d => {
      d.hidden = true;
      d.addEventListener('click', e => { if (e.target === d) d.hidden = true; });
      d.querySelector('.cloud-close')?.addEventListener('click', () => { d.hidden = true; });
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.cloud-dialog').forEach(d => { d.hidden = true; });
    });
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', agganciaChiusure, { once: true });
  else agganciaChiusure();

  if (!ON) return;   // non configurato: nessuna interfaccia, nessuna chiamata

  /* ── stato della sincronizzazione ─────────────────────────────────── */
  let inFlight = null, dirty = false, timer = null;

  function stato(testo, tipo = '') {
    const el = $('#cloudStatus');
    if (!el) return;
    el.textContent = testo || '';
    el.className = 'cloud-status' + (tipo ? ' ' + tipo : '');
    el.hidden = !testo;
  }

  async function sincronizza({ silenzioso = false } = {}) {
    if (!session) return;
    if (inFlight) return inFlight;
    inFlight = (async () => {
      try {
        if (!silenzioso) stato('Syncing…');
        const remoto = await pull();
        const locale = window.__LEARN__ ? window.__LEARN__.state : null;
        const fuso = merge(locale, remoto);
        if (window.__LEARN__) window.__LEARN__.replaceState(fuso);
        await push(fuso);
        dirty = false;
        stato('Saved to your account', 'ok');
        setTimeout(() => { if (!dirty) stato(''); }, 2600);
      } catch (e) {
        dirty = true;
        if (e.status === 401) {
          // il rinnovo non è bastato: la sessione è finita davvero
          putSession(null); disegna();
          stato('Your session expired. Sign in again — nothing was lost.', 'warn');
        } else {
          // la rete può mancare: non è un errore dell'utente e non si perde nulla
          stato(navigator.onLine === false ? 'Offline — will sync later' : e.message, 'warn');
        }
      } finally { inFlight = null; }
    })();
    return inFlight;
  }

  function programmaPush() {
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(() => { if (session) sincronizza({ silenzioso: true }); }, 2500);
  }
  window.addEventListener('wot:saved', programmaPush);
  window.addEventListener('online', () => { if (session && dirty) sincronizza({ silenzioso: true }); });

  /* ── interfaccia ──────────────────────────────────────────────────── */
  function disegna() {
    const host = $('#cloudHost');
    if (!host) return;
    if (session) {
      host.innerHTML = `<div class="cloud-box in">
        <span class="cloud-who">${session.user?.email
          ? `Signed in as <strong>${esc(session.user.email)}</strong>`
          : 'Signed in <strong>with LinkedIn</strong>'}</span>
        <span class="cloud-acts">
          <button id="cloudSync" class="link-btn">Sync now</button>
          <button id="cloudOut" class="link-btn">Sign out</button>
        </span>
      </div>
      <p id="cloudStatus" class="cloud-status" hidden></p>`;
      $('#cloudSync').addEventListener('click', () => sincronizza());
      $('#cloudOut').addEventListener('click', esci);
    } else {
      host.innerHTML = `<button id="cloudOpen" class="cloud-cta">
          <span aria-hidden="true">☁</span> Save your progress to an account</button>
        <p id="cloudStatus" class="cloud-status" hidden></p>`;
      $('#cloudOpen').addEventListener('click', () => apri('in'));
    }
  }

  let ultimoFocus = null;
  function apri(modo) {
    ultimoFocus = document.activeElement;
    const d = $('#cloudDialog');
    d.hidden = false;
    modo === 'up' ? mostraRegistrazione() : mostraAccesso();
    setTimeout(() => $('#cloudEmail')?.focus(), 40);
    document.addEventListener('keydown', chiudiConEsc);
  }
  function chiudi() {
    $('#cloudDialog').hidden = true;
    document.removeEventListener('keydown', chiudiConEsc);
    ultimoFocus?.focus?.();
  }
  const chiudiConEsc = e => { if (e.key === 'Escape') chiudi(); };

  function form(titolo, sottotitolo, azione, altroTesto, altroModo) {
    $('#cloudDialogBody').innerHTML = `
      <h2 id="cloudTitle">${esc(titolo)}</h2>
      <p class="cloud-sub">${esc(sottotitolo)}</p>
      <button type="button" id="cloudLinkedin" class="li-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor"
          d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
        Continue with LinkedIn</button>
      <p class="cloud-or"><span>or use your email</span></p>
      <form id="cloudForm" novalidate>
        <label class="cloud-label" for="cloudEmail">Email</label>
        <input id="cloudEmail" type="email" autocomplete="email" required />
        <label class="cloud-label" for="cloudPass">Password</label>
        <input id="cloudPass" type="password" autocomplete="${azione === 'up' ? 'new-password' : 'current-password'}"
               minlength="6" required />
        <p id="cloudErr" class="cloud-err" role="alert" hidden></p>
        <button id="cloudGo" class="btn primary wide" type="submit">${azione === 'up' ? 'Create account' : 'Sign in'}</button>
      </form>
      <p class="cloud-alt">${esc(altroTesto)}
        <button class="link-btn" id="cloudSwap">${altroModo === 'up' ? 'Create one' : 'Sign in'}</button></p>`;
    $('#cloudLinkedin').addEventListener('click', () => {
      stato('Taking you to LinkedIn…');
      vaiA('linkedin_oidc');
    });
    $('#cloudSwap').addEventListener('click', () => altroModo === 'up' ? mostraRegistrazione() : mostraAccesso());
    $('#cloudForm').addEventListener('submit', e => { e.preventDefault(); invia(azione); });
  }
  const mostraAccesso = () => form('Welcome back', 'Your progress will be merged with whatever is on this device.',
    'in', 'No account yet?', 'up');
  const mostraRegistrazione = () => form('Create an account', 'So your career follows you to another device. Six characters minimum.',
    'up', 'Already have one?', 'in');

  function errore(msg) {
    const el = $('#cloudErr');
    if (!el) return;
    el.textContent = msg; el.hidden = !msg;
  }

  async function invia(azione) {
    const email = $('#cloudEmail').value.trim();
    const pass = $('#cloudPass').value;
    errore('');
    if (!email || !email.includes('@')) return errore('Enter your email address.');
    if (pass.length < 6) return errore('Password too short — use at least 6 characters.');
    const btn = $('#cloudGo');
    btn.disabled = true; btn.textContent = 'Working…';
    try {
      if (azione === 'up') {
        const r = await signUp(email, pass);
        if (r && r.access_token) putSession(r);
        else {
          // il progetto richiede la conferma via email: non c'è ancora una sessione
          chiudi(); disegna();
          stato('Account created. Confirm it from your inbox, then sign in.', 'ok');
          return;
        }
      } else {
        putSession(await signIn(email, pass));
      }
      chiudi(); disegna();
      await sincronizza();
    } catch (e) {
      errore(e.message);
    } finally {
      btn.disabled = false; btn.textContent = azione === 'up' ? 'Create account' : 'Sign in';
    }
  }

  async function esci() {
    if (dirty || inFlight) { try { await sincronizza({ silenzioso: true }); } catch (e) {} }
    try { await call('/auth/v1/logout', { auth: true }); } catch (e) {}
    putSession(null);
    disegna();
    stato('Signed out. Your progress stays on this device.', 'ok');
    setTimeout(() => stato(''), 3200);
  }

  /* ── avvio ────────────────────────────────────────────────────────── */
  session = loadSession();
  // la bandiera va dichiarata PRIMA di qualunque chiamata:
  // dichiararla dopo la mette nella temporal dead zone e la prima
  // invocazione lancia ReferenceError, lasciando l'interfaccia non disegnata
  let avviato = false;
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', avvia, { once: true });
  else avvia();
  async function avvia() {
    if (avviato) return; avviato = true;
    $('#cloudClose')?.addEventListener('click', chiudi);
    $('#cloudDialog')?.addEventListener('click', e => { if (e.target.id === 'cloudDialog') chiudi(); });

    const ritorno = leggiRitorno();
    if (ritorno?.errore) { disegna(); stato(ritorno.errore, 'warn'); return; }
    if (ritorno?.sessione) {
      putSession(ritorno.sessione);
      try {
        // il frammento non contiene l'email: la chiediamo, così sappiamo chi mostrare
        const u = await chiUtente();
        putSession({ ...session, user: u });
      } catch (e) { /* si sincronizza comunque: l'id arriva dal token */ }
      disegna();
      await sincronizza();
      return;
    }
    disegna();
    if (session) sincronizza({ silenzioso: true });
  }

  Object.assign(window.WOT_CLOUD_API, {
    signUp, signIn, pull, push, sincronizza, merge, apri, chiudi, disegna, esci,
    vaiA, leggiRitorno, idUtente, chiUtente,
  });
  // Object.assign copierebbe il VALORE del getter, non il getter:
  // dirty resterebbe congelato a false per sempre.
  Object.defineProperty(window.WOT_CLOUD_API, 'dirty', { get: () => dirty, configurable: true });
})();
