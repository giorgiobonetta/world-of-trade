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
  const LEAGUE_TABLE = 'league_scores';
  const SOCIAL_PROFILE_TABLE = 'social_profiles';
  const FRIEND_TABLE = 'friendships';
  const CHALLENGE_TABLE = 'friend_challenges';
  const CHALLENGE_SCORE_TABLE = 'friend_challenge_scores';
  const FRIEND_REQUEST_TABLE = 'friend_requests';

  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ── sessione ─────────────────────────────────────────────────────── */
  let session = null;
  const loadSession = () => { try { return JSON.parse(localStorage.getItem(SESS) || 'null'); } catch (e) { return null; } };
  const putSession = s => {
    session = s;
    try { s ? localStorage.setItem(SESS, JSON.stringify(s)) : localStorage.removeItem(SESS); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('wot:auth', { detail: { signedIn: !!s, session: s || null } })); } catch (e) {}
  };
  session = loadSession();

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


  /* ── classifica settimanale (tabella opzionale) ─────────────────── */
  const normalizeLeagueRow = r => ({
    ...r,
    tier: String(r?.tier ?? r?.division ?? 'bronze').toLowerCase(),
    score: Math.max(0, Number(r?.score ?? r?.weekly_xp) || 0),
  });

  async function leagueRows(week, tier) {
    if (!week) return [];
    // Current database schema uses division + weekly_xp. Keep a fallback for
    // early beta projects that still have tier + score.
    try {
      let path = `/rest/v1/${LEAGUE_TABLE}?select=user_id,week,alias,house,division,weekly_xp,updated_at&week=eq.${encodeURIComponent(week)}`;
      if (tier) path += `&division=eq.${encodeURIComponent(tier)}`;
      path += '&order=weekly_xp.desc&limit=500';
      const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
      return Array.isArray(rows) ? rows.map(normalizeLeagueRow) : [];
    } catch (e) {
      let path = `/rest/v1/${LEAGUE_TABLE}?select=user_id,week,alias,house,tier,score,updated_at&week=eq.${encodeURIComponent(week)}`;
      if (tier) path += `&tier=eq.${encodeURIComponent(tier)}`;
      path += '&order=score.desc&limit=500';
      const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
      return Array.isArray(rows) ? rows.map(normalizeLeagueRow) : [];
    }
  }

  async function houseRows(week) {
    if (!week) return [];
    try {
      const path = `/rest/v1/${LEAGUE_TABLE}?select=user_id,week,alias,house,division,weekly_xp&week=eq.${encodeURIComponent(week)}&order=weekly_xp.desc&limit=1000`;
      const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
      return Array.isArray(rows) ? rows.map(normalizeLeagueRow) : [];
    } catch (e) {
      const path = `/rest/v1/${LEAGUE_TABLE}?select=user_id,week,alias,house,tier,score&week=eq.${encodeURIComponent(week)}&order=score.desc&limit=1000`;
      const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
      return Array.isArray(rows) ? rows.map(normalizeLeagueRow) : [];
    }
  }

  async function pushLeague(entry) {
    const uid = idUtente();
    if (!uid || !entry?.week) return false;
    const alias = String(entry.alias || 'Trader').trim().replace(/\s+/g,' ').slice(0,24) || 'Trader';
    const division = String(entry.tier || entry.division || 'bronze').toLowerCase();
    const weeklyXp = Math.max(0,Math.round(Number(entry.score ?? entry.weekly_xp)||0));
    try {
      await withFreshToken(() => call(`/rest/v1/${LEAGUE_TABLE}`, {
        method:'POST', auth:true,
        headers:{ Prefer:'resolution=merge-duplicates,return=minimal' },
        body:[{ user_id:uid, week:String(entry.week), alias, house:entry.house || null,
          division, weekly_xp:weeklyXp, updated_at:new Date().toISOString() }],
      }));
    } catch (e) {
      // Compatibility with early beta schema.
      await withFreshToken(() => call(`/rest/v1/${LEAGUE_TABLE}`, {
        method:'POST', auth:true,
        headers:{ Prefer:'resolution=merge-duplicates,return=minimal' },
        body:[{ user_id:uid, week:String(entry.week), alias, house:entry.house || null,
          tier:division, score:weeklyXp, updated_at:new Date().toISOString() }],
      }));
    }
    return true;
  }


  /* ── social circle / referrals / head-to-head challenges ─────────── */
  const cleanUuid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||'')) ? String(v) : null;

  async function socialProfileByUser(userId) {
    const uid = cleanUuid(userId); if (!uid) return null;
    const rows = await call(`/rest/v1/${SOCIAL_PROFILE_TABLE}?select=user_id,alias,house,referral_code,trader_tag,created_at,updated_at&user_id=eq.${uid}&limit=1`, { method:'GET', auth:true });
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async function socialProfileByCode(code) {
    const c = String(code||'').trim().replace(/[^A-Za-z0-9_-]/g,'').slice(0,24);
    if (!c) return null;
    const rows = await call(`/rest/v1/${SOCIAL_PROFILE_TABLE}?select=user_id,alias,house,referral_code,trader_tag&referral_code=eq.${encodeURIComponent(c)}&limit=1`, { method:'GET', auth:true });
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async function upsertSocialProfile(profile = {}) {
    const uid = idUtente(); if (!uid) return null;
    const alias = String(profile.alias || 'Trader').trim().replace(/\s+/g,' ').slice(0,24) || 'Trader';
    const code = String(profile.referral_code || '').trim().replace(/[^A-Za-z0-9_-]/g,'').slice(0,24);
    const tagRaw = String(profile.trader_tag || '').trim().replace(/^@/,'').toLowerCase();
    const traderTag = tagRaw ? tagRaw.replace(/[^a-z0-9_]/g,'').slice(0,20) : '';
    if (!code) throw new Error('Referral code is missing.');
    const body = { user_id:uid, alias, house:profile.house || null, referral_code:code, updated_at:new Date().toISOString() };
    if (traderTag) body.trader_tag = traderTag;
    const rows = await withFreshToken(() => call(`/rest/v1/${SOCIAL_PROFILE_TABLE}`, {
      method:'POST', auth:true, headers:{ Prefer:'resolution=merge-duplicates,return=representation' },
      body:[body],
    }));
    return Array.isArray(rows) && rows[0] ? rows[0] : { ...body };
  }

  async function friendRows() {
    const uid = idUtente(); if (!uid) return [];
    const path = `/rest/v1/${FRIEND_TABLE}?select=pair_key,user_a,user_b,invited_by,source,created_at&or=(user_a.eq.${uid},user_b.eq.${uid})&order=created_at.desc&limit=500`;
    const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
    return Array.isArray(rows) ? rows : [];
  }

  async function socialProfiles(userIds = []) {
    const ids = [...new Set((userIds||[]).map(cleanUuid).filter(Boolean))].slice(0,500);
    if (!ids.length) return [];
    const rows = await call(`/rest/v1/${SOCIAL_PROFILE_TABLE}?select=user_id,alias,house,referral_code,trader_tag&user_id=in.(${ids.join(',')})`, { method:'GET', auth:true });
    return Array.isArray(rows) ? rows : [];
  }

  async function acceptReferral(code) {
    const uid = idUtente(); if (!uid) return { ok:false, reason:'signed-out' };
    const c = String(code||'').trim().replace(/[^A-Za-z0-9_-]/g,'').slice(0,24);
    if (!c) return { ok:false, reason:'not-found' };
    // The database function resolves the code and creates the friendship
    // server-side. This prevents clients from fabricating arbitrary friends
    // simply by knowing another public league user_id.
    const rows = await withFreshToken(() => call('/rest/v1/rpc/accept_wot_referral', {
      method:'POST', auth:true, body:{ p_code:c }
    }));
    const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
    if (!row?.inviter_id) return { ok:false, reason:row?.reason || 'not-found' };
    return { ok:true, inviter:{ user_id:row.inviter_id, alias:row.inviter_alias || 'Trader', referral_code:c } };
  }

  async function friendLeagueRows(week, userIds = []) {
    if (!week) return [];
    const ids = [...new Set((userIds||[]).map(cleanUuid).filter(Boolean))].slice(0,500);
    if (!ids.length) return [];
    try {
      const path = `/rest/v1/${LEAGUE_TABLE}?select=user_id,week,alias,house,division,weekly_xp,updated_at&week=eq.${encodeURIComponent(week)}&user_id=in.(${ids.join(',')})&order=weekly_xp.desc`;
      const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
      return Array.isArray(rows) ? rows.map(normalizeLeagueRow) : [];
    } catch (e) {
      const path = `/rest/v1/${LEAGUE_TABLE}?select=user_id,week,alias,house,tier,score,updated_at&week=eq.${encodeURIComponent(week)}&user_id=in.(${ids.join(',')})&order=score.desc`;
      const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
      return Array.isArray(rows) ? rows.map(normalizeLeagueRow) : [];
    }
  }

  async function createFriendChallenge({ opponent_id, desk, seed, week } = {}) {
    const uid = idUtente(), opp = cleanUuid(opponent_id);
    if (!uid || !opp || opp === uid) throw new Error('Invalid challenge opponent.');
    const rows = await withFreshToken(() => call(`/rest/v1/${CHALLENGE_TABLE}`, {
      method:'POST', auth:true, headers:{ Prefer:'return=representation' },
      body:[{ challenger_id:uid, opponent_id:opp, desk:String(desk||'').slice(0,60), seed:Math.max(1,Math.floor(Number(seed)||Date.now())), week:String(week||'').slice(0,10) || null }],
    }));
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async function friendChallenges() {
    const uid = idUtente(); if (!uid) return [];
    const path = `/rest/v1/${CHALLENGE_TABLE}?select=id,challenger_id,opponent_id,desk,seed,week,created_at,expires_at&or=(challenger_id.eq.${uid},opponent_id.eq.${uid})&order=created_at.desc&limit=100`;
    const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
    return Array.isArray(rows) ? rows : [];
  }

  async function friendChallengeScores(challengeIds = []) {
    const ids = [...new Set((challengeIds||[]).map(cleanUuid).filter(Boolean))].slice(0,200);
    if (!ids.length) return [];
    const rows = await withFreshToken(() => call(`/rest/v1/${CHALLENGE_SCORE_TABLE}?select=challenge_id,user_id,score,correct,total,completed_at&challenge_id=in.(${ids.join(',')})`, { method:'GET', auth:true }));
    return Array.isArray(rows) ? rows : [];
  }

  async function submitFriendChallengeScore(challengeId, result = {}) {
    const uid = idUtente(), cid = cleanUuid(challengeId); if (!uid || !cid) return false;
    try {
      await withFreshToken(() => call(`/rest/v1/${CHALLENGE_SCORE_TABLE}`, {
        method:'POST', auth:true, headers:{ Prefer:'return=minimal' },
        body:[{ challenge_id:cid, user_id:uid, score:Math.max(0,Math.round(Number(result.score)||0)), correct:Math.max(0,Math.round(Number(result.correct)||0)), total:Math.max(1,Math.round(Number(result.total)||10)), completed_at:new Date().toISOString() }],
      }));
      return true;
    } catch (e) {
      // Primary-key conflict means this player already locked a result.
      // We deliberately do not allow replaying until a better score appears.
      if (e.status === 409) return true;
      throw e;
    }
  }

  /* ── Account & social discovery v0.6 ─────────────────────────────── */
  async function updatePassword(password) {
    const value = String(password || '');
    if (value.length < 8) throw new Error('Use at least 8 characters.');
    const user = await withFreshToken(() => call('/auth/v1/user', {
      method:'PUT', auth:true, body:{ password:value }
    }));
    return user || true;
  }

  async function deleteMyAccount() {
    const uid = idUtente();
    if (!uid) throw new Error('You are not signed in.');
    await withFreshToken(() => call('/rest/v1/rpc/delete_wot_account', {
      method:'POST', auth:true, body:{}
    }));
    putSession(null);
    try { localStorage.removeItem(SESS); } catch (e) {}
    return true;
  }

  async function searchSocialProfiles(query) {
    const me = idUtente();
    const q = String(query || '').trim().replace(/^@/,'').replace(/[^A-Za-z0-9_ .-]/g,'').slice(0,40);
    if (q.length < 2) return [];
    const safe = encodeURIComponent(`*${q}*`);
    const path = `/rest/v1/${SOCIAL_PROFILE_TABLE}?select=user_id,alias,house,referral_code,trader_tag&or=(trader_tag.ilike.${safe},alias.ilike.${safe})&limit=20`;
    const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
    return (Array.isArray(rows) ? rows : []).filter(r => r.user_id !== me);
  }

  async function friendRequestRows() {
    const uid = idUtente(); if (!uid) return [];
    const path = `/rest/v1/${FRIEND_REQUEST_TABLE}?select=id,pair_key,requester_id,addressee_id,status,created_at,responded_at&or=(requester_id.eq.${uid},addressee_id.eq.${uid})&order=created_at.desc&limit=200`;
    const rows = await withFreshToken(() => call(path, { method:'GET', auth:true }));
    return Array.isArray(rows) ? rows : [];
  }

  async function sendFriendRequest(addresseeId) {
    const uid = idUtente(), other = cleanUuid(addresseeId);
    if (!uid || !other || uid === other) throw new Error('Invalid trader.');
    const rows = await withFreshToken(() => call('/rest/v1/rpc/send_wot_friend_request', {
      method:'POST', auth:true, body:{ p_addressee:other }
    }));
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async function respondFriendRequest(requestId, accept) {
    const rid = cleanUuid(requestId); if (!rid) throw new Error('Invalid friend request.');
    const rows = await withFreshToken(() => call('/rest/v1/rpc/respond_wot_friend_request', {
      method:'POST', auth:true, body:{ p_request:rid, p_accept:!!accept }
    }));
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
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
    const bossCompleted = maxMap(a.boss?.completed, b.boss?.completed);
    const bossCleared = Object.values(bossCompleted).filter(v => Number(v) >= 60).length;

    /* Lifebuoys are a spendable resource, so taking Math.max() would let an
       older device restore lives that were already spent. Keep the resource
       state from the newest save. Old cloud rows that do not contain lives
       never override a local balance. On an exact timestamp tie, prefer the
       lower balance as the conservative anti-duplication choice. */
    const hasLives = x => x && x.lives !== undefined && Number.isFinite(Number(x.lives));
    const ta = Number(a.updatedAt) || 0, tb = Number(b.updatedAt) || 0;
    let lifeSource = a;
    if (!hasLives(a) && hasLives(b)) lifeSource = b;
    else if (hasLives(a) && hasLives(b)) {
      if (tb > ta) lifeSource = b;
      else if (tb === ta && Number(b.lives) < Number(a.lives)) lifeSource = b;
    }
    const mergedLives = hasLives(lifeSource) ? Math.max(0, Math.min(5, Number(lifeSource.lives))) : 5;
    const mergedLivesAt = mergedLives >= 5 ? 0 : Math.max(0, Number(lifeSource.livesAt) || 0);

    const mergeCompetitive = (x = {}, y = {}) => {
      const hx = x.history || {}, hy = y.history || {};
      const history = maxMap(hx, hy);
      const wx = String(x.week || ''), wy = String(y.week || '');
      const newer = wy > wx ? y : x;
      if (wx && wy && wx === wy) {
        const starts = [Number(x.startXp), Number(y.startXp)].filter(v => Number.isFinite(v) && v >= 0);
        return { ...newer, week:wx, startXp:starts.length ? Math.min(...starts) : 0,
          tier:newer.tier || x.tier || y.tier || 'bronze', alias:newer.alias || x.alias || y.alias || '', house:newer.house || x.house || y.house || '',
          seasons:Math.max(Number(x.seasons)||0,Number(y.seasons)||0), history,
          lastPlacement:Number(newer.lastPlacement)||Number(x.lastPlacement)||Number(y.lastPlacement)||null,
          lastSeason:newer.lastSeason || x.lastSeason || y.lastSeason || null };
      }
      return { ...(newer || {}), history, seasons:Math.max(Number(x.seasons)||0,Number(y.seasons)||0) };
    };
    const mergeProfile = (x = {}, y = {}) => {
      const tx = Number(x.updatedAt) || 0, ty = Number(y.updatedAt) || 0;
      const newer = ty > tx ? y : x;
      const older = newer === y ? x : y;
      const owns = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);
      return {
        name: String(owns(newer,'name') ? newer.name : (older.name || '')).trim().slice(0,24),
        // An empty avatar is meaningful: it means the player removed the photo.
        avatar: String(owns(newer,'avatar') ? newer.avatar : (older.avatar || '')).slice(0,300000),
        updatedAt: Math.max(tx, ty),
      };
    };
    const mergeDaily = (x = {}, y = {}) => {
      const dx = x.day || '', dy = y.day || '';
      if (dx && dy && dx !== dy) return { ...(dx > dy ? x : y) };
      const claimed = { ...(x.claimed || {}) };
      for (const k of Object.keys(y.claimed || {})) claimed[k] = !!(claimed[k] || y.claimed[k]);
      return {
        day: dx || dy || null,
        dealDone: !!(x.dealDone || y.dealDone),
        dealBest: Math.max(Number(x.dealBest)||0, Number(y.dealBest)||0),
        dealPlays: Math.max(Number(x.dealPlays)||0, Number(y.dealPlays)||0),
        flashBest: Math.max(Number(x.flashBest)||0, Number(y.flashBest)||0),
        flashCorrect: Math.max(Number(x.flashCorrect)||0, Number(y.flashCorrect)||0),
        trainingRuns: Math.max(Number(x.trainingRuns)||0, Number(y.trainingRuns)||0),
        bossRuns: Math.max(Number(x.bossRuns)||0, Number(y.bossRuns)||0),
        claimed,
        bonusClaimed: !!(x.bonusClaimed || y.bonusClaimed),
      };
    };
    return {
      // la versione del programma è la più alta delle due: una carriera già
      // migrata non deve essere migrata una seconda volta
      rev: Math.max(Number(a.rev) || 0, Number(b.rev) || 0),
      done: [...new Set([...(a.done || []), ...(b.done || [])])],
      xp: Math.max(Number(a.xp) || 0, Number(b.xp) || 0),
      streak: Math.max(Number(a.streak) || 0, Number(b.streak) || 0),
      lastDay: [a.lastDay, b.lastDay].filter(Boolean).sort().pop() || null,
      reviews: Math.max(Number(a.reviews) || 0, Number(b.reviews) || 0),
      streakBest: Math.max(Number(a.streakBest) || 0, Number(b.streakBest) || 0),
      // resource state follows the newest write; never max-merge a spendable balance
      lives: mergedLives,
      livesAt: mergedLivesAt,
      livesEarned: Math.max(Number(a.livesEarned) || 0, Number(b.livesEarned) || 0),
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
      frontier: {
        best: Math.max(Number(a.frontier?.best) || 0, Number(b.frontier?.best) || 0),
        plays: Math.max(Number(a.frontier?.plays) || 0, Number(b.frontier?.plays) || 0),
        cleared: Math.max(Number(a.frontier?.cleared) || 0, Number(b.frontier?.cleared) || 0),
        correct: Math.max(Number(a.frontier?.correct) || 0, Number(b.frontier?.correct) || 0),
        total: Math.max(Number(a.frontier?.total) || 0, Number(b.frontier?.total) || 0),
      },
      boss: {
        best: Math.max(Number(a.boss?.best) || 0, Number(b.boss?.best) || 0),
        plays: Math.max(Number(a.boss?.plays) || 0, Number(b.boss?.plays) || 0),
        cleared: Math.max(bossCleared, Number(a.boss?.cleared) || 0, Number(b.boss?.cleared) || 0),
        completed: bossCompleted,
      },
      daily: mergeDaily(a.daily, b.daily),
      dailyStats: {
        deals: Math.max(Number(a.dailyStats?.deals)||0, Number(b.dailyStats?.deals)||0),
        perfectDays: Math.max(Number(a.dailyStats?.perfectDays)||0, Number(b.dailyStats?.perfectDays)||0),
      },
      dailyHistory: {
        deals: maxMap(a.dailyHistory?.deals, b.dailyHistory?.deals),
        perfect: maxMap(a.dailyHistory?.perfect, b.dailyHistory?.perfect),
      },
      profile: mergeProfile(a.profile, b.profile),
      competitive: mergeCompetitive(a.competitive, b.competitive),
      updatedAt: Math.max(Number(a.updatedAt) || 0, Number(b.updatedAt) || 0),
    };
  }

  function aggiornaGate(messaggioGate = '', tipo = '') {
    const gate = $('#authGate');
    const status = $('#authGateStatus');
    const locked = !session;
    document.body.classList.toggle('auth-locked', locked);
    if (gate) gate.hidden = !locked;
    if (status) {
      status.textContent = messaggioGate || (locked ? 'Sign in or create an account to continue.' : 'Access granted.');
      status.className = 'auth-gate-status' + (tipo ? ' ' + tipo : '');
    }
  }

  function gateNonConfigurato() {
    aggiornaGate(PERICOLO
      ? 'Authentication is blocked because supabase-config.js contains a secret key. Replace it with the public publishable/anon key.'
      : SANDBOX
        ? 'Secure access is disabled in sandbox mode.'
        : 'Authentication is not configured. Copy supabase-config.example.js to supabase-config.js and fill in your Supabase URL and publishable key — see SUPABASE-SETUP.md.', 'warn');
    $('#authSignIn')?.setAttribute('disabled','');
    $('#authSignUp')?.setAttribute('disabled','');
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

  if (!ON) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', gateNonConfigurato, { once:true });
    else gateNonConfigurato();
    return;
  }

  /* ── stato della sincronizzazione ─────────────────────────────────── */
  let inFlight = null, dirty = false, timer = null;

  function stato(testo, tipo = '') {
    const el = $('#cloudStatus');
    if (el) {
      el.textContent = testo || '';
      el.className = 'cloud-status' + (tipo ? ' ' + tipo : '');
      el.hidden = !testo;
    }
    if (document.body.classList.contains('auth-locked') && testo) aggiornaGate(testo, tipo);
  }

  async function sincronizza({ silenzioso = false } = {}) {
    if (!session) return;
    if (inFlight) return inFlight;
    inFlight = (async () => {
      try {
        if (!silenzioso) stato('Syncing…');
        const remoto = await pull();
        const locale = window.__LEARN__ ? window.__LEARN__.state : null;
        // la riga sul server può essere stata scritta prima che il corso
        // fosse riorganizzato sui desk del percorso: gli id delle lezioni
        // vanno tradotti prima di fondere, o si fondono carriere diverse
        const remotoMigrato = window.__LEARN__?.migraSalvataggio
          ? window.__LEARN__.migraSalvataggio(remoto) : remoto;
        const fuso = merge(locale, remotoMigrato);
        if (window.__LEARN__) window.__LEARN__.replaceState(fuso);
        await push(fuso);
        try { if (window.__LEARN__?.leagueEntry) await pushLeague(window.__LEARN__.leagueEntry()); } catch (leagueError) { /* optional table may not exist yet */ }
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
    aggiornaGate();
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
          <span aria-hidden="true">☁</span> Account required — sign in</button>
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
          stato('Account created. Confirm it from your inbox, then sign in to enter World of Trade.', 'ok');
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
    stato('Signed out. Sign in again to enter World of Trade.', 'ok');
    setTimeout(() => stato(''), 3200);
  }

  /* ── avvio ────────────────────────────────────────────────────────── */
  // la bandiera va dichiarata PRIMA di qualunque chiamata:
  // dichiararla dopo la mette nella temporal dead zone e la prima
  // invocazione lancia ReferenceError, lasciando l'interfaccia non disegnata
  let avviato = false;
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', avvia, { once: true });
  else avvia();
  async function avvia() {
    if (avviato) return; avviato = true;
    const signInGate = $('#authSignIn'), signUpGate = $('#authSignUp');
    if (signInGate) { signInGate.disabled = false; signInGate.addEventListener('click', () => apri('in')); }
    if (signUpGate) { signUpGate.disabled = false; signUpGate.addEventListener('click', () => apri('up')); }
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
    signUp, signIn, pull, push, leagueRows, houseRows, pushLeague,
    socialProfileByUser, socialProfileByCode, upsertSocialProfile, friendRows, socialProfiles, acceptReferral, friendLeagueRows,
    createFriendChallenge, friendChallenges, friendChallengeScores, submitFriendChallengeScore,
    searchSocialProfiles, friendRequestRows, sendFriendRequest, respondFriendRequest,
    updatePassword, deleteMyAccount,
    sincronizza, merge, apri, chiudi, disegna, esci,
    vaiA, leggiRitorno, idUtente, chiUtente, aggiornaGate,
  });
  // Object.assign copierebbe il VALORE del getter, non il getter:
  // dirty resterebbe congelato a false per sempre.
  Object.defineProperty(window.WOT_CLOUD_API, 'dirty', { get: () => dirty, configurable: true });
})();
