/* World of Trade — Learn · salvataggio della carriera in cloud
   Supabase via API REST, senza SDK: nessuna dipendenza esterna, niente build,
   e l'app resta installabile e utilizzabile offline.
   Se non è configurato, questo file non fa assolutamente nulla. */
(() => {
  'use strict';
  const CFG = window.WOT_CLOUD || {};
  const ON = !!(CFG.url && CFG.anonKey);
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
    const h = { apikey: CFG.anonKey, 'Content-Type': 'application/json', ...headers };
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

  const signUp = (email, password) => call('/auth/v1/signup', { body: { email, password } });
  const signIn = (email, password) => call('/auth/v1/token?grant_type=password', { body: { email, password } });

  async function pull() {
    const uid = session?.user?.id;
    if (!uid) return null;
    const rows = await withFreshToken(() => call(
      `/rest/v1/${TABLE}?select=state&user_id=eq.${encodeURIComponent(uid)}`,
      { method: 'GET', auth: true }));
    return (Array.isArray(rows) && rows[0] && rows[0].state) || null;
  }

  async function push(state) {
    const uid = session?.user?.id;
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
      best: maxMap(a.best, b.best),
      badges: maxMap(a.badges, b.badges),
      doneAt: maxMap(a.doneAt, b.doneAt),
      misses: maxMap(a.misses, b.misses),
      updatedAt: Math.max(Number(a.updatedAt) || 0, Number(b.updatedAt) || 0),
    };
  }

  window.WOT_CLOUD_API = { merge, messaggio, get session() { return session; }, enabled: ON };
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
    if (session?.user) {
      host.innerHTML = `<div class="cloud-box in">
        <span class="cloud-who">Signed in as <strong>${esc(session.user.email || '')}</strong></span>
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
  document.addEventListener('DOMContentLoaded', avvia);
  if (document.readyState !== 'loading') avvia();
  let avviato = false;
  function avvia() {
    if (avviato) return; avviato = true;
    $('#cloudClose')?.addEventListener('click', chiudi);
    $('#cloudDialog')?.addEventListener('click', e => { if (e.target.id === 'cloudDialog') chiudi(); });
    disegna();
    if (session) sincronizza({ silenzioso: true });
  }

  Object.assign(window.WOT_CLOUD_API, {
    signUp, signIn, pull, push, sincronizza, merge, apri, chiudi, disegna, esci,
  });
  // Object.assign copierebbe il VALORE del getter, non il getter:
  // dirty resterebbe congelato a false per sempre.
  Object.defineProperty(window.WOT_CLOUD_API, 'dirty', { get: () => dirty, configurable: true });
})();
