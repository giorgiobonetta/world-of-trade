/* World of Trade — Learn · motore
   Percorso → lezione → esercizio → feedback → progresso.
   Nessun framework, tutto lato client, salvataggio in localStorage.
*/
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // La pagina di autodiagnosi apre l'app in un iframe e gioca davvero una lezione.
  // Senza una chiave separata rovinerebbe i progressi di chi sta usando l'app.
  const SANDBOX = (() => {
    try { return new URLSearchParams(location.search).has('sandbox'); } catch (e) { return false; }
  })();
  const KEY = SANDBOX ? 'wot-learn-selftest' : 'wot-learn-v1';
  /* ── economia dei salvagenti ──────────────────────────────────────
     I salvagenti sono una risorsa persistente, non tre vite che ricominciano
     a ogni lezione: se ne spendi uno lo hai perso davvero. Perché il gioco
     non possa mai bloccarsi, il Ripasso non ne consuma ed è il posto dove si
     riguadagnano. Questi quattro numeri sono l'intera economia. */
  const MAX_LIVES = 5;          // quanti se ne possono tenere
  const START_LIVES = 5;        // con quanti si comincia
  const STREAK_PER_LIFE = 10;   // risposte giuste di fila per riguadagnarne uno
  const LIFE_REGEN_MS = 20 * 60 * 1000;  // uno ogni venti minuti, anche a app chiusa
  const CHECK_MIN_LIVES = 3;    // un checkpoint deve poter arrivare a un punteggio
  const HEARTS = MAX_LIVES;
  const CHECK_HEARTS = MAX_LIVES;
  const SOGLIE = [5, 10, 15, 20, 30, 50, 75, 100];   // dove la serie si festeggia
  const XP_PER = 10;

  const UNITS = window.CURRICULUM || [];
  const GAME = window.WOT_GAME || { skills:{}, unitMeta:{}, ranks:[], randomFlash:null, bossCatalog:[], makeBossDeal:null, makeDailyDeal:null, dailyMeta:null };
  const COMP = window.WOT_COMP || { divisions:[], houses:[], achievements:[], weekKey:()=>'', weekRange:()=>'', division:id=>({id,name:'Bronze',promote:200}), seasonMove:id=>id, localOpponents:()=>[] };
  const CONTENT = window.WOT_CONTENT || { makeMasterySet:null, worldCatalog:[] };
  const allLessons = UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id })));
  const skillIdForLesson = lessonId => {
    const lesson = allLessons.find(l => l.id === lessonId);
    return lesson ? (GAME.unitMeta[lesson.unitId]?.skill || null) : null;
  };

  /* ── effetti ─────────────────────────────────────────────────────── */
  const motionOK = () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function confetti(n = 44) {
    if (!motionOK()) return;
    const colours = ['#ffd45c','#4fe08a','#3f7ae0','#ff7b8f','#a98bff','#fff0b8'];
    const layer = document.createElement('div');
    layer.className = 'confetti';
    for (let i = 0; i < n; i++) {
      const bit = document.createElement('i');
      bit.style.left = Math.random() * 100 + 'vw';
      bit.style.background = colours[i % colours.length];
      bit.style.animationDuration = (1.5 + Math.random() * 1.3) + 's';
      bit.style.animationDelay = (Math.random() * .45) + 's';
      bit.style.transform = `rotate(${Math.random() * 360}deg)`;
      layer.appendChild(bit);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 3400);
  }

  function countUp(el, to, prefix = '', suffix = '') {
    if (!el) return;
    if (!motionOK()) { el.textContent = prefix + to + suffix; return; }
    const start = performance.now(), dur = 750;
    const step = now => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(to * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function bump(el) {
    if (!el || !motionOK()) return;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }

  /* ── stato ───────────────────────────────────────────────────────── */
  const defaultState = () => ({
    done: [], xp: 0, streak: 0, lastDay: null, best: {},
    updatedAt: 0,   // quando questo dispositivo ha toccato la carriera l'ultima volta
    misses: {},    // 'u1l1#3' -> quante volte sbagliato, non ancora recuperato
    doneAt: {},    // quando una lezione e' stata completata (per l'anzianita')
    badges: {},    // punteggio migliore al checkpoint di ciascuna unita'
    reviews: 0,    // sessioni di ripasso fatte (ruota la selezione)
    streakNow: 0,  // risposte giuste consecutive al primo colpo, attraverso le lezioni
    streakBest: 0, // record personale, quello che si condivide
    lives: START_LIVES, // fondo di salvagenti: persiste fra le sessioni
    livesEarned: 0,// quanti ne sono stati riguadagnati con le serie
    livesAt: 0,    // da quando matura il prossimo salvagente: 0 = fondo pieno
    skillXp: {},    // pratica oltre al progresso base: skill -> punti
    flash: { best:0, plays:0, correct:0, total:0 },
    frontier: { best:0, plays:0, cleared:0, correct:0, total:0 },
    boss: { plays:0, cleared:0, best:0, completed:{} },
    daily: { day:null, dealDone:false, dealBest:0, dealPlays:0, flashBest:0, flashCorrect:0, trainingRuns:0, bossRuns:0, claimed:{}, bonusClaimed:false },
    dailyStats: { deals:0, perfectDays:0 },
    dailyHistory: { deals:{}, perfect:{} },
    competitive: { week:null, startXp:0, tier:'bronze', alias:'', house:'', seasons:0, history:{}, lastPlacement:null, lastSeason:null },
  });
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      const obj = v => (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
      // i salvataggi piu' vecchi non hanno questi campi: vanno ricostruiti, non assunti
      const flash = obj(s.flash), frontier = obj(s.frontier), boss = obj(s.boss), daily = obj(s.daily), dailyStats = obj(s.dailyStats), dailyHistory = obj(s.dailyHistory), competitive = obj(s.competitive);
      return { ...defaultState(), ...s,
        done: Array.isArray(s.done) ? s.done.filter(id => allLessons.some(l => l.id === id)) : [],
        best: obj(s.best), misses: obj(s.misses), doneAt: obj(s.doneAt), badges: obj(s.badges),
        skillXp: obj(s.skillXp),
        flash: { best:Number(flash.best)||0, plays:Number(flash.plays)||0,
          correct:Number(flash.correct)||0, total:Number(flash.total)||0 },
        frontier: { best:Number(frontier.best)||0, plays:Number(frontier.plays)||0, cleared:Number(frontier.cleared)||0, correct:Number(frontier.correct)||0, total:Number(frontier.total)||0 },
        boss: { plays:Number(boss.plays)||0, cleared:Math.max(Number(boss.cleared)||0, Object.values(obj(boss.completed)).filter(v => Number(v) >= 60).length), best:Number(boss.best)||0, completed:obj(boss.completed) },
        daily: { day:daily.day || null, dealDone:!!daily.dealDone, dealBest:Number(daily.dealBest)||0, dealPlays:Number(daily.dealPlays)||0, flashBest:Number(daily.flashBest)||0, flashCorrect:Number(daily.flashCorrect)||0, trainingRuns:Number(daily.trainingRuns)||0, bossRuns:Number(daily.bossRuns)||0, claimed:obj(daily.claimed), bonusClaimed:!!daily.bonusClaimed },
        dailyStats: { deals:Number(dailyStats.deals)||0, perfectDays:Number(dailyStats.perfectDays)||0 },
        dailyHistory: { deals:obj(dailyHistory.deals), perfect:obj(dailyHistory.perfect) },
        competitive: { week:competitive.week || null, startXp:Number(competitive.startXp)||0, tier:competitive.tier || 'bronze', alias:String(competitive.alias||''), house:String(competitive.house||''), seasons:Number(competitive.seasons)||0, history:obj(competitive.history), lastPlacement:Number(competitive.lastPlacement)||null, lastSeason:obj(competitive.lastSeason) },
        reviews: Number(s.reviews) || 0, updatedAt: Number(s.updatedAt) || 0,
        streakNow: Number(s.streakNow) || 0, streakBest: Number(s.streakBest) || 0,
        // un salvataggio precedente non ha il fondo: si parte pieni
        lives: s.lives === undefined ? START_LIVES : Math.max(0, Math.min(MAX_LIVES, Number(s.lives) || 0)),
        livesEarned: Number(s.livesEarned) || 0,
        livesAt: Number(s.livesAt) || 0 };
    } catch (e) { return defaultState(); }
  }
  function save() {
    ensureCompetitive();
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    try { renderTopStats(); } catch (e) {}
    // chi sincronizza col cloud ascolta questo, senza che il motore lo sappia
    try { window.dispatchEvent(new CustomEvent('wot:saved', { detail: { state } })); } catch (e) {}
  }

  // usata dal livello di sincronizzazione dopo aver fuso locale e remoto
  function replaceState(next) {
    if (!next || typeof next !== 'object') return false;
    const obj = v => (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    const f = obj(next.flash), fr = obj(next.frontier), b = obj(next.boss), d = obj(next.daily), ds = obj(next.dailyStats), dh = obj(next.dailyHistory), cp = obj(next.competitive);
    state = { ...defaultState(), ...next,
      done: Array.isArray(next.done) ? next.done.filter(id => allLessons.some(l => l.id === id)) : [],
      best: obj(next.best), misses: obj(next.misses), doneAt: obj(next.doneAt), badges: obj(next.badges),
      skillXp: obj(next.skillXp),
      flash: { best:Number(f.best)||0, plays:Number(f.plays)||0, correct:Number(f.correct)||0, total:Number(f.total)||0 },
      frontier: { best:Number(fr.best)||0, plays:Number(fr.plays)||0, cleared:Number(fr.cleared)||0, correct:Number(fr.correct)||0, total:Number(fr.total)||0 },
      boss: { plays:Number(b.plays)||0, cleared:Math.max(Number(b.cleared)||0, Object.values(obj(b.completed)).filter(v => Number(v) >= 60).length), best:Number(b.best)||0, completed:obj(b.completed) },
      daily: { day:d.day || null, dealDone:!!d.dealDone, dealBest:Number(d.dealBest)||0, dealPlays:Number(d.dealPlays)||0, flashBest:Number(d.flashBest)||0, flashCorrect:Number(d.flashCorrect)||0, trainingRuns:Number(d.trainingRuns)||0, bossRuns:Number(d.bossRuns)||0, claimed:obj(d.claimed), bonusClaimed:!!d.bonusClaimed },
      dailyStats: { deals:Number(ds.deals)||0, perfectDays:Number(ds.perfectDays)||0 },
      dailyHistory: { deals:obj(dh.deals), perfect:obj(dh.perfect) },
      competitive: { week:cp.week || null, startXp:Number(cp.startXp)||0, tier:cp.tier || 'bronze', alias:String(cp.alias||''), house:String(cp.house||''), seasons:Number(cp.seasons)||0, history:obj(cp.history), lastPlacement:Number(cp.lastPlacement)||null, lastSeason:obj(cp.lastSeason) } };
    ensureCompetitive(); 
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    _lastXp = null;
    renderPath();
    return true;
  }

  function touchStreak() {
    const todayDate = new Date(), yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const today = localDayKey(todayDate), yesterday = localDayKey(yesterdayDate);
    if (state.lastDay === today) return;
    state.streak = state.lastDay === yesterday ? (state.streak || 0) + 1 : 1;
    state.lastDay = today;
  }


  /* ── Daily loop ─────────────────────────────────────────────────── */
  const localDayKey = (date = new Date()) => {
    const y = date.getFullYear(), m = String(date.getMonth()+1).padStart(2,'0'), d = String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const hashDay = str => {
    let h = 2166136261 >>> 0;
    for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  function ensureDaily() {
    const day = localDayKey();
    if (!state.daily || state.daily.day !== day) {
      state.daily = { day, dealDone:false, dealBest:0, dealPlays:0, flashBest:0, flashCorrect:0, trainingRuns:0, bossRuns:0, claimed:{}, bonusClaimed:false };
    }
    state.dailyStats ||= { deals:0, perfectDays:0 };
    state.dailyHistory ||= { deals:{}, perfect:{} };
    state.dailyHistory.deals ||= {}; state.dailyHistory.perfect ||= {};
    state.daily.claimed ||= {};
    return state.daily;
  }
  const dailyDealCount = () => Math.max(Number(state.dailyStats?.deals)||0, Object.keys(state.dailyHistory?.deals || {}).length);
  const perfectDayCount = () => Math.max(Number(state.dailyStats?.perfectDays)||0, Object.keys(state.dailyHistory?.perfect || {}).length);
  function dailyQuests() {
    const d = ensureDaily(), seed = hashDay(d.day);
    const flashScoreTarget = 100 + (seed % 4) * 20;
    const flashCorrectTarget = 6 + (seed % 3) * 2;
    const deal = { id:'deal', icon:'◆', title:'Close today’s deal', copy:'Complete the Deal of the Day.', reward:35, done:!!d.dealDone, progress:d.dealDone ? 1 : 0, target:1 };
    const flashScore = { id:'flash-score', icon:'⚡', title:`Score ${flashScoreTarget} in Flash`, copy:'One strong 60-second run is enough.', reward:25, done:d.flashBest >= flashScoreTarget, progress:Math.min(d.flashBest,flashScoreTarget), target:flashScoreTarget };
    const flashCorrect = { id:'flash-correct', icon:'✓', title:`Get ${flashCorrectTarget} Flash answers right`, copy:'Correct answers accumulate across today’s runs.', reward:25, done:d.flashCorrect >= flashCorrectTarget, progress:Math.min(d.flashCorrect,flashCorrectTarget), target:flashCorrectTarget };
    const training = { id:'training', icon:'↻', title:'Complete one training session', copy:'Finish a Career level or a Practice session.', reward:25, done:d.trainingRuns >= 1, progress:Math.min(d.trainingRuns,1), target:1 };
    const bossQ = { id:'boss', icon:'♜', title:'Enter the dealing room', copy:'Complete one Boss Deal run today.', reward:30, done:d.bossRuns >= 1, progress:Math.min(d.bossRuns,1), target:1 };
    const variants = [[flashScore,training],[flashCorrect,bossQ],[flashScore,bossQ]];
    return [deal, ...variants[seed % variants.length]];
  }
  function claimDailyQuest(id) {
    ensureDaily();
    const q = dailyQuests().find(x => x.id === id);
    if (!q || !q.done || state.daily.claimed[id]) return;
    state.daily.claimed[id] = true;
    state.xp = (state.xp || 0) + q.reward;
    touchStreak();
    const allClaimed = dailyQuests().every(x => state.daily.claimed[x.id]);
    if (allClaimed && !state.daily.bonusClaimed) {
      state.daily.bonusClaimed = true;
      state.dailyStats.perfectDays = (state.dailyStats.perfectDays || 0) + 1;
      state.dailyHistory.perfect[state.daily.day] = 1;
      state.xp += 25;
      confetti(60);
    }
    save(); renderMetaScreens();
  }

  const isDone = id => state.done.includes(id);
  function nextLessonId() {
    const n = allLessons.find(l => !isDone(l.id));
    return n ? n.id : null;
  }

  /* ── ripasso e checkpoint ────────────────────────────────────────── */
  const REVIEW_SIZE = 8;
  const CHECK_SIZE = 8;
  const CHECK_PASS = 75;          // percentuale minima per il badge
  const STALE_DAYS = 3;           // dopo quanto una lezione chiede un ripasso

  const exKey = (lessonId, i) => `${lessonId}#${i}`;
  const ageDays = lessonId => {
    const t = state.doneAt[lessonId];
    return t ? (Date.now() - t) / 864e5 : STALE_DAYS * 2;   // salvataggi vecchi: trattati come scaduti
  };

  // quante cose ci sono da ripassare adesso
  function dueCount() {
    let n = 0;
    state.done.forEach(id => {
      const l = allLessons.find(x => x.id === id);
      if (!l) return;
      const stale = ageDays(id) >= STALE_DAYS;
      l.exercises.forEach((ex, i) => {
        if (state.misses[exKey(id, i)] > 0 || stale) n++;
      });
    });
    return n;
  }

  // peso: gli errori contano molto, l'anzianita' un po'
  function reviewItems(n = REVIEW_SIZE) {
    const pool = [];
    state.done.forEach(id => {
      const l = allLessons.find(x => x.id === id);
      if (!l) return;
      const age = Math.min(ageDays(id), 30);
      l.exercises.forEach((ex, i) => {
        const w = 1 + (state.misses[exKey(id, i)] || 0) * 4 + age / 10;
        pool.push({ ex, i, lessonId: id, w });
      });
    });
    if (!pool.length) return [];
    pool.sort((a, b) => b.w - a.w || a.lessonId.localeCompare(b.lessonId) || a.i - b.i);
    // ruoto fra i candidati migliori così due ripassi di fila non sono identici
    const top = pool.slice(0, Math.min(pool.length, n * 3));
    const off = top.length ? ((state.reviews || 0) * n) % top.length : 0;
    const rotated = top.slice(off).concat(top.slice(0, off));
    const out = [], seen = new Set();
    for (const it of rotated) {
      const k = exKey(it.lessonId, it.i);
      if (seen.has(k)) continue;
      seen.add(k); out.push(it);
      if (out.length === n) break;
    }
    return out;
  }

  const unitDone = u => u.lessons.every(l => isDone(l.id));

  // un checkpoint pesca a giro fra le lezioni, così nessuna resta fuori
  function checkpointItems(unit, n = CHECK_SIZE) {
    const byLesson = unit.lessons.map(l => l.exercises.map((ex, i) => ({ ex, i, lessonId: l.id })));
    const out = [];
    const maxLen = Math.max(...byLesson.map(x => x.length), 0);
    for (let round = 0; round < maxLen && out.length < n; round++) {
      for (const list of byLesson) {
        const it = list[round];
        if (!it) continue;
        out.push(it);
        if (out.length === n) break;
      }
    }
    return out;
  }


  /* ── competitive layer ───────────────────────────────────────────── */
  function traderAlias() {
    try {
      const k = `${KEY}:alias-seed`;
      let n = Number(localStorage.getItem(k));
      if (!n) { n = Math.floor(100 + Math.random() * 900); localStorage.setItem(k, String(n)); }
      return `Trader ${n}`;
    } catch (e) { return `Trader ${Math.floor(100 + Math.random() * 900)}`; }
  }

  function ensureCompetitive() {
    state.competitive ||= { week:null, startXp:Number(state.xp)||0, tier:'bronze', alias:'', house:'', seasons:0, history:{}, lastPlacement:null, lastSeason:null };
    const c = state.competitive;
    c.history ||= {};
    c.tier = COMP.division?.(c.tier)?.id || 'bronze';
    if (!c.alias) c.alias = traderAlias();
    const wk = COMP.weekKey ? COMP.weekKey(new Date()) : localDayKey();
    if (!c.week) { c.week = wk; c.startXp = Number(state.xp)||0; return c; }
    if (c.week !== wk) {
      const points = Math.max(0, (Number(state.xp)||0) - (Number(c.startXp)||0));
      c.history[c.week] = Math.max(Number(c.history[c.week])||0, points);
      const from = c.tier;
      const to = COMP.seasonMove ? COMP.seasonMove(from, points, c.lastPlacement) : from;
      c.lastSeason = { week:c.week, points, placement:c.lastPlacement || null, from, to };
      c.tier = to;
      c.seasons = (Number(c.seasons)||0) + 1;
      c.week = wk;
      c.startXp = Number(state.xp)||0;
      c.lastPlacement = null;
    }
    return c;
  }

  function leagueScore() {
    const c = ensureCompetitive();
    return Math.max(0, (Number(state.xp)||0) - (Number(c.startXp)||0));
  }

  function leagueEntry() {
    const c = ensureCompetitive();
    return { week:c.week, alias:c.alias, house:c.house || null, tier:c.tier, score:leagueScore() };
  }

  function achievementContext() {
    const skillValues = Object.keys(GAME.skills || {}).map(skillScore);
    return { done:state.done.length, xp:Number(state.xp)||0, streak:Number(state.streak)||0,
      flashBest:Number(state.flash?.best)||0, frontierBest:Number(state.frontier?.best)||0, frontierCleared:Number(state.frontier?.cleared)||0,
      bossBest:Number(state.boss?.best)||0, bossCleared:Number(state.boss?.cleared)||0, dailyDeals:dailyDealCount(), perfectDays:perfectDayCount(),
      skillValues, rank:careerRank().current.name };
  }

  function unlockedAchievements() {
    const ctx = achievementContext();
    return (COMP.achievements || []).filter(a => { try { return !!a.test(ctx); } catch (e) { return false; } });
  }

  let leagueFetchToken = 0;
  function renderLeagueRows(rows, online = false, houseRows = null) {
    const host = $('#leagueBoard'); if (!host) return;
    const c = ensureCompetitive(), uid = window.WOT_CLOUD_API?.idUtente?.();
    const own = { user_id:uid || 'local-me', alias:c.alias, house:c.house, tier:c.tier, score:leagueScore(), me:true };
    let list = Array.isArray(rows) ? rows.map(x => ({...x})) : [];
    if (!online) list = [...(COMP.localOpponents?.(c.week,c.tier,own.score) || []), own];
    else if (!list.some(x => uid && x.user_id === uid)) list.push(own);
    list = list.filter(x => (x.tier || c.tier) === c.tier).sort((a,b) => Number(b.score||0)-Number(a.score||0));
    const ownIndex = list.findIndex(x => x.me || (uid && x.user_id === uid));
    const pos = ownIndex >= 0 ? ownIndex + 1 : null;
    if (online && pos) { c.lastPlacement = pos; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
    let shown = list.slice(0,25);
    if (ownIndex >= 25) shown = [...shown, {separator:true}, list[ownIndex]];
    host.innerHTML = `<div class="league-head-row"><span>#</span><span>Trader</span><span>House</span><span>XP</span></div>` + shown.map((r,i) => {
      if (r.separator) return '<div class="league-separator">•••</div>';
      const actual = list.indexOf(r) + 1;
      const me = !!(r.me || (uid && r.user_id === uid));
      const house = (COMP.houses || []).find(h => h.id === r.house);
      return `<div class="league-row${me?' me':''}"><b>${actual}</b><span>${esc(r.alias || 'Trader')}${r.preview?' <small>preview</small>':''}</span><i>${esc(house?.icon || '—')}</i><strong>${Number(r.score)||0}</strong></div>`;
    }).join('');
    $('#leagueStatus').textContent = online ? `${list.length} live traders${pos ? ` · rank #${pos}` : ''}` : `Local preview${pos ? ` · rank #${pos}` : ''}`;
    renderHouseBoard(Array.isArray(houseRows) ? houseRows : list, online);
  }

  function renderHouseBoard(rows, online) {
    const host = $('#houseBoard'); if (!host) return;
    const sums = {};
    (COMP.houses || []).forEach(h => sums[h.id] = { score:0, members:0 });
    (rows || []).forEach(r => { if (r.house && sums[r.house]) { sums[r.house].score += Number(r.score)||0; sums[r.house].members++; } });
    const ranked = (COMP.houses || []).map(h => ({...h,...sums[h.id]})).sort((a,b)=>b.score-a.score);
    host.innerHTML = `<div class="house-rank-head"><span>House</span><span>${online?'Weekly XP':'Preview XP'}</span></div>` + ranked.map((h,i) => `<div class="house-rank-row${state.competitive.house===h.id?' mine':''}"><b>${i+1}</b><i>${esc(h.icon)}</i><span><strong>${esc(h.name)}</strong><small>${h.members} trader${h.members===1?'':'s'}</small></span><em>${h.score}</em></div>`).join('');
  }

  async function syncLeagueOnline(token) {
    const api = window.WOT_CLOUD_API;
    if (!api?.leagueRows) return;
    try {
      await api.pushLeague?.(leagueEntry());
      const [rows, houses] = await Promise.all([
        api.leagueRows(state.competitive.week, state.competitive.tier),
        api.houseRows ? api.houseRows(state.competitive.week) : Promise.resolve(null),
      ]);
      if (token !== leagueFetchToken || !$('#leagueScreen')?.classList.contains('active')) return;
      renderLeagueRows(rows, true, houses);
    } catch (e) {
      if (token === leagueFetchToken) $('#leagueStatus').textContent = 'Local preview · online league not configured';
    }
  }

  function renderLeagueHub() {
    const host = $('#leagueHero'); if (!host) return;
    const c = ensureCompetitive(), d = COMP.division?.(c.tier) || {name:'Bronze',icon:'III',promote:200};
    const points = leagueScore();
    const nextTarget = Number.isFinite(d.promote) ? d.promote : null;
    const pct = nextTarget ? Math.min(100, Math.round(points / nextTarget * 100)) : 100;
    $('#leagueXp').textContent = state.xp || 0;
    const seasonNote = c.lastSeason && c.lastSeason.to && c.lastSeason.from !== c.lastSeason.to
      ? `<small class="season-note">Last season · ${esc(COMP.division?.(c.lastSeason.from)?.name || c.lastSeason.from)} → ${esc(COMP.division?.(c.lastSeason.to)?.name || c.lastSeason.to)}</small>` : '';
    host.innerHTML = `<div class="league-emblem"><span>${esc(d.icon || 'III')}</span></div><div class="league-hero-copy"><span class="eyebrow">${esc(COMP.weekRange?.(c.week) || c.week)}</span><h2>${esc(d.name)} League</h2><p>${nextTarget ? `${Math.max(0,nextTarget-points)} weekly XP to the promotion target.` : 'You are competing in the top division.'}</p>${seasonNote}<div class="league-progress"><i style="width:${pct}%"></i></div><div class="league-hero-stats"><span><b>${points}</b> weekly XP</span><span><b>${c.seasons||0}</b> seasons</span></div></div>
      <div class="trader-card"><label for="leagueAlias">Trader alias</label><div><input id="leagueAlias" maxlength="24" value="${esc(c.alias)}" aria-label="Trader alias"><button id="leagueAliasSave">Save</button></div><small>Only this alias appears on public standings — never your email.</small></div>`;
    $('#leagueAliasSave')?.addEventListener('click', () => {
      const v = String($('#leagueAlias')?.value || '').trim().replace(/\s+/g,' ').slice(0,24);
      if (v.length < 3) return;
      c.alias = v; save(); renderLeagueHub();
    });

    const picker = $('#housePicker');
    if (picker) {
      picker.innerHTML = (COMP.houses || []).map(h => `<button class="house-choice${c.house===h.id?' selected':''}" data-house="${esc(h.id)}"><i>${esc(h.icon)}</i><span><b>${esc(h.name)}</b><small>${esc(h.motto)}</small></span></button>`).join('');
      $$('[data-house]',picker).forEach(b => b.addEventListener('click', () => { c.house=b.dataset.house; save(); renderLeagueHub(); }));
      const hs = $('#houseStatus'); if (hs) hs.textContent = c.house ? (COMP.houses.find(h=>h.id===c.house)?.name || 'House selected') : 'Choose your house';
    }

    const unlocked = unlockedAchievements(), ids = new Set(unlocked.map(a=>a.id));
    const ag = $('#achievementGrid');
    if (ag) ag.innerHTML = (COMP.achievements || []).map(a => `<article class="achievement${ids.has(a.id)?' unlocked':''}"><div>${esc(a.icon)}</div><span><b>${esc(a.title)}</b><small>${esc(a.copy)}</small></span>${ids.has(a.id)?'<em>UNLOCKED</em>':'<em>LOCKED</em>'}</article>`).join('');
    const ac = $('#achievementCount'); if (ac) ac.textContent = `${unlocked.length} / ${(COMP.achievements||[]).length}`;

    renderLeagueRows(null, false);
    const token = ++leagueFetchToken;
    syncLeagueOnline(token);
  }

  /* ── navigazione fra schermate ───────────────────────────────────── */
  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    const immersive = ['lessonScreen','doneScreen','flashScreen','bossScreen'].includes(id);
    document.body.classList.toggle('immersive', immersive);
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.screen === id));
    if (!immersive) renderMetaScreens();
    try { window.dispatchEvent(new CustomEvent('wot:screen', { detail: { id } })); } catch (e) {}
    window.scrollTo(0, 0);
  }

  /* ── schermata percorso ──────────────────────────────────────────── */
  let _lastXp = null;
  function renderTopStats() {
    const xpEl = $('#statXp'), stEl = $('#statStreak'), lvEl = $('#statLevel');
    if (stEl) stEl.textContent = state.streak || 0;
    if (lvEl) lvEl.textContent = careerLevel();
    if (xpEl) {
      if (_lastXp !== null && state.xp > _lastXp) { countUp(xpEl, state.xp); bump(xpEl.parentElement); }
      else xpEl.textContent = state.xp || 0;
    }
    _lastXp = state.xp || 0;
  }
  function renderPath() {
    renderStatLives();
    renderTopStats();
    const next = nextLessonId();
    renderCareerHero();
    renderWorldMap();
    const greetHost = $('#pathGreet');
    if (greetHost && window.MASCOT) {
      const done = state.done.length;
      const line = done === 0
        ? 'I’m Hélène. I ran a metals desk for eleven years. Let’s start with what a trade actually is.'
        : done < allLessons.length
          ? `${done} lesson${done === 1 ? '' : 's'} down. The next one builds on the last, so keep going.`
          : 'Trading House Academy complete. The Trading Floor stays open forever — run generated desk challenges, Flash Trading and Boss Deals.';
      greetHost.innerHTML = `<div class="greet">
        <div class="greet-face">${window.MASCOT.svg('teach', 78)}</div>
        <div class="greet-copy"><strong>${esc(window.MASCOT.name)}</strong><p>${esc(line)}</p></div>
      </div>`;
    }
    const rev = $('#reviewHost');
    if (rev) {
      const due = dueCount();
      if (state.done.length < 2) rev.innerHTML = '';
      else rev.innerHTML = `<button id="reviewButton" class="review-card${due ? ' due' : ''}">
        <span class="review-icon" aria-hidden="true">↻</span>
        <span class="review-copy"><strong>Practice</strong>
          <small>${due ? `${due} thing${due === 1 ? '' : 's'} to go back over` : 'Keep the earlier units warm'}</small></span>
        ${due ? `<span class="review-badge">${due > 99 ? '99+' : due}</span>` : ''}
      </button>`;
      const rb = $('#reviewButton');
      if (rb) rb.addEventListener('click', startReview);
    }

    const bar = $('#pathProgress');
    if (bar) {
      const total = allLessons.length;
      const doneN = state.done.filter(id => allLessons.some(l => l.id === id)).length;
      const pct = total ? Math.round(doneN / total * 100) : 0;
      bar.hidden = false;
      $('#courseLabel').textContent = `Trading House Academy · ${doneN} of ${total} levels`;
      $('#coursePct').textContent = `${pct}%`;
      $('#courseFill').style.width = pct + '%';
      const track = $('#courseTrack');
      if (track) {
        track.setAttribute('aria-valuenow', String(pct));
        track.setAttribute('aria-valuetext', `${doneN} of ${total} Career levels complete`);
      }
    }

    $('#pathBody').innerHTML = UNITS.map((u, ui) => {
      const nodes = u.lessons.map((l, li) => {
        const done = isDone(l.id);
        const isNext = l.id === next;
        // apertura di unità: accessibile, ma non è il passo del percorso
        const assaggio = !done && !isNext && li === 0;
        const locked = !done && !isNext && !assaggio;
        const cls = done ? 'done' : isNext ? 'next' : assaggio ? 'taster' : 'locked';
        const medal = done ? '✓' : locked ? '🔒' : String(li + 1);
        const acc = state.best[l.id];
        const weak = l.exercises.reduce((n, _, i) => n + (state.misses[exKey(l.id, i)] > 0 ? 1 : 0), 0);
        return `${li ? '<div class="connector"></div>' : ''}
          <button class="node ${cls}${done && weak ? ' weak' : ''}" data-lesson="${esc(l.id)}" ${locked ? 'disabled aria-disabled="true"' : ''}>
            ${isNext ? '<span class="tag">Start</span>' : assaggio ? '<span class="tag taste">Open</span>' : ''}
            <span class="medal" aria-hidden="true">${medal}</span>
            <span><strong>${esc(l.title)}</strong>
              <small>${done
                ? (weak ? `${weak} to review` : `Completed · ${acc != null ? acc + '% accuracy' : 'done'}`)
                : locked ? 'Locked' : assaggio ? `Try this unit · ${l.exercises.length} questions`
                : `${l.exercises.length} questions`}</small></span>
          </button>`;
      }).join('');
      const badge = state.badges[u.id];
      const ready = unitDone(u);
      const meta = GAME.unitMeta[u.id] || {};
      const phase = meta.phase || meta.chapter || 'Merchant Foundations';
      const prevMeta = ui > 0 ? (GAME.unitMeta[UNITS[ui-1].id] || {}) : {};
      const prevPhase = prevMeta.phase || prevMeta.chapter || 'Merchant Foundations';
      const phaseHead = ui === 0 || phase !== prevPhase ? `<div class="phase-divider"><span>${esc(phase)}</span><i></i></div>` : '';
      return `${phaseHead}<section class="unit" id="unit-${esc(u.id)}">
        <div class="unit-head">
          <span class="n">Desk ${ui + 1} · ${esc(meta.division || 'Foundations')}</span>
          ${badge ? `<span class="unit-badge" title="Checkpoint passed">★ ${badge}%</span>` : ''}
          <h2>${esc(u.title)}</h2>
          <p>${esc(u.subtitle)}</p>
        </div>
        <div class="nodes">${nodes}</div>
        ${ready ? `<button class="checkpoint" data-check="${esc(u.id)}">
          ${badge ? 'Retake the checkpoint' : 'Take the checkpoint'}
          <small>${CHECK_SIZE} questions across the unit · needs ${CHECK_MIN_LIVES} lifebuoys · ${CHECK_PASS}% to pass</small>
        </button>` : ''}
      </section>`;
    }).join('');
    $$('[data-lesson]').forEach(b => b.addEventListener('click', () => {
      if (!b.disabled) startLesson(b.dataset.lesson);
    }));
    $$('[data-check]').forEach(b => b.addEventListener('click', () => startCheckpoint(b.dataset.check)));

    // con molte lezioni il percorso è lungo: portiamo l'utente al punto giusto
    if (state.done.length) {
      const target = $('#pathBody .node.next');
      if (target && target.scrollIntoView) {
        try { target.scrollIntoView({ block: 'center', behavior: motionOK() ? 'smooth' : 'auto' }); }
        catch (e) { target.scrollIntoView(); }
      }
    }
  }

  /* ── esecuzione della lezione ────────────────────────────────────── */
  let run = null;

  // un unico motore per lezione, ripasso e checkpoint
  function startRun(cfg) {
    if (!cfg.items || !cfg.items.length) return;
    // il ripasso è sempre aperto: è la via per riguadagnare salvagenti
    if (cfg.mode !== 'review' && livesNow() <= 0) { avvisoSenzaVite(); return; }
    /* Un checkpoint con una sola vita morirebbe prima di produrre un punteggio,
       e un punteggio è tutto il suo senso: serve un minimo per cominciarlo. */
    if (cfg.mode === 'checkpoint' && livesNow() < CHECK_MIN_LIVES) { avvisoCheckpoint(); return; }
    run = {
      mode: cfg.mode,                 // 'lesson' | 'review' | 'checkpoint'
      lesson: cfg.lesson || null,
      unit: cfg.unit || null,
      banner: cfg.banner || '',
      queue: cfg.items.map(it => ({ ...it })),
      total: cfg.items.length,
      answered: 0,
      correct: 0,
      firstTry: 0,
      // le vite non sono del run: sono il fondo dell'utente. Il ripasso è
      // l'unica modalità che non ne consuma, così non ci si blocca mai.
      gratis: cfg.mode === 'review',
      hearts: cfg.mode === 'review' ? MAX_LIVES : livesNow(),
      maxHearts: MAX_LIVES,
      current: null,
      state: 'answering',
    };
    const b = $('#runBanner');
    if (b) { b.textContent = run.banner; b.hidden = !run.banner; }
    show('lessonScreen');
    renderStreak(false);
    nextExercise();
  }

  /* La lezione d'apertura di ogni unità è sempre accessibile: chi vuole
     vedere il desk metalli o l'unità sul carbonio ci arriva subito, mentre
     il resto di quell'unità resta in ordine. Senza questo, per guardare
     l'ultima unità bisognava attraversare tutte le precedenti. */
  const primeLezioni = () => UNITS.map(u => u.lessons[0] && u.lessons[0].id).filter(Boolean);
  const isApertura = id => primeLezioni().includes(id);
  const isUnlocked = id => isDone(id) || id === nextLessonId() || isApertura(id);

  function startLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    // il controllo sta qui e non nel chiamante: un link diretto, la console
    // o un futuro pulsante non devono poter scavalcare la progressione
    if (!isUnlocked(lessonId)) return;
    startRun({
      mode: 'lesson', lesson,
      items: lesson.exercises.map((e, i) => ({ ex: e, i, lessonId: lesson.id })),
    });
  }

  function startReview() {
    const items = reviewItems();
    if (!items.length) return;
    startRun({ mode: 'review', items, banner: 'Practice · things you have already seen' });
  }

  function unlockedMasteryWorlds() {
    const doneN = state.done.filter(id => allLessons.some(l => l.id === id)).length;
    if (doneN < 31) return 0;
    return Math.max(1, Math.min((CONTENT.worldCatalog || []).length || 1, 1 + Math.floor(Math.max(0, doneN - 31) / 6)));
  }

  function startFrontier() {
    if (!CONTENT.makeMasterySet) return;
    const worlds = unlockedMasteryWorlds();
    if (!worlds) return;
    const seed = `${Date.now()}:${state.frontier?.plays || 0}:${state.xp || 0}`;
    const items = CONTENT.makeMasterySet(seed, 10, worlds);
    startRun({ mode:'frontier', items, hearts:5,
      banner:`Trading Floor Run · 10 decisions · ${worlds} specialist desk${worlds === 1 ? '' : 's'} in rotation` });
  }

  function startCheckpoint(unitId) {
    const unit = UNITS.find(u => u.id === unitId);
    if (!unit || !unitDone(unit)) return;
    const items = checkpointItems(unit);
    if (!items.length) return;
    startRun({ mode: 'checkpoint', unit, items, hearts: CHECK_HEARTS,
      banner: `Checkpoint · ${unit.title} · ${CHECK_PASS}% to pass` });
  }

  function nextExercise() {
    if (!run) return;
    if (!run.queue.length) return finishRun();
    run.current = run.queue.shift();
    run.state = 'answering';
    run.picked = null;
    renderHearts();
    renderProgress();
    $('#feedback').hidden = true;
    const btn = $('#checkButton');
    btn.className = 'btn primary';
    btn.textContent = 'Check';
    btn.disabled = true;
    renderRivela();
    renderExercise(run.current.ex);
  }

  function renderStreak(appenaGiusta) {
    const chip = $('#streakChip');
    if (!chip) return;
    const n = state.streakNow || 0;
    // sotto 3 non vale la pena occupare spazio sullo schermo
    chip.hidden = n < 3;
    if (n >= 3) {
      $('#streakNum').textContent = n;
      chip.classList.toggle('record', n > 0 && n === state.streakBest);
      if (appenaGiusta) { chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop'); }
    }
    if (appenaGiusta && SOGLIE.includes(n) && n % STREAK_PER_LIFE !== 0) festeggia(n);
  }

  function festeggia(n) {
    const t = $('#streakToast');
    if (!t) return;
    const M = window.MASCOT;
    t.innerHTML = `<span class="st-face">${M ? M.svg('happy', 44) : ''}</span>
      <span class="st-copy"><strong>${n} in a row</strong>
        <small>${n === state.streakBest ? 'A new personal best.' : 'Keep it going.'}</small></span>`;
    t.hidden = false;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(festeggia._t);
    festeggia._t = setTimeout(() => { t.hidden = true; }, 2600);
    confetti(Math.min(70, 24 + n * 2));
  }

  function renderProgress() {
    const pct = run.total ? (run.answered / run.total) * 100 : 0;
    const v = Math.min(100, Math.round(pct));
    $('#lessonProgress').style.width = `${v}%`;
    const bar = $('#lessonProgressBar');
    if (bar) {
      bar.setAttribute('aria-valuenow', String(v));
      bar.setAttribute('aria-valuetext', `${run.answered} of ${run.total} answered`);
    }
  }
  /* Una vita è un salvagente: il solo simbolo che vuol dire salvare una vita
     ed è al tempo stesso inconfondibilmente marittimo. Disegnato come cerchio
     unico con tratteggio, così i quattro settori restano regolari a ogni misura. */
  const SALVAGENTE = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="#fdf6e8" stroke-width="6.2"/>
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="6.2"
              stroke-dasharray="6.6 6.6" stroke-dashoffset="3.3"/>
      <circle cx="12" cy="12" r="5.3" fill="none" stroke="rgba(6,18,44,.5)" stroke-width="1"/>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(6,18,44,.45)" stroke-width="1"/>
    </svg>`;

  const limitaVite = n => Math.max(0, Math.min(MAX_LIVES, Number(n) || 0));

  /* Matura un salvagente ogni LIFE_REGEN_MS, anche mentre l'app è chiusa.
     Il resto del tempo non si butta: l'orologio avanza di un blocco alla
     volta, così chi rientra dopo 35 minuti trova un salvagente e 15 minuti
     già maturati verso il successivo. Un orologio spostato indietro non
     regala nulla, perché in quel caso si riparte da adesso. */
  function maturaVite(ora = Date.now()) {
    const attuali = limitaVite(state.lives ?? START_LIVES);
    if (attuali >= MAX_LIVES) { state.livesAt = 0; state.lives = MAX_LIVES; return MAX_LIVES; }
    if (!state.livesAt || state.livesAt > ora) { state.livesAt = ora; return attuali; }
    const maturati = Math.floor((ora - state.livesAt) / LIFE_REGEN_MS);
    if (maturati <= 0) return attuali;
    const dopo = limitaVite(attuali + maturati);
    state.lives = dopo;
    state.livesAt = dopo >= MAX_LIVES ? 0 : state.livesAt + maturati * LIFE_REGEN_MS;
    return dopo;
  }

  const livesNow = () => maturaVite();

  /* Millisecondi al prossimo salvagente, o 0 se il fondo è pieno. */
  function attesaVita(ora = Date.now()) {
    if (livesNow() >= MAX_LIVES || !state.livesAt) return 0;
    return Math.max(0, state.livesAt + LIFE_REGEN_MS - ora);
  }

  /* Toglie un salvagente dal fondo e allinea il run. Il ripasso non paga. */
  function spendiVita() {
    if (run && run.gratis) { run.hearts = Math.max(0, run.hearts - 1); return; }
    const prima = livesNow();
    state.lives = Math.max(0, prima - 1);
    // il conto alla rovescia parte quando si scende dal massimo, non prima
    if (prima >= MAX_LIVES) state.livesAt = Date.now();
    if (run) run.hearts = state.lives;
    save();
    renderStatLives();
    avviaOrologioVite();
  }

  /* Una serie abbastanza lunga ne restituisce uno, fino al massimo. */
  function forseGuadagnaVita() {
    const n = state.streakNow || 0;
    if (!n || n % STREAK_PER_LIFE !== 0) return false;
    if (livesNow() >= MAX_LIVES) return false;
    state.lives = livesNow() + 1;
    if (state.lives >= MAX_LIVES) state.livesAt = 0;
    state.livesEarned = (state.livesEarned || 0) + 1;
    if (run && !run.gratis) run.hearts = state.lives;
    save();
    renderStatLives();
    avviaOrologioVite();
    annunciaVita(n);
    return true;
  }

  function annunciaVita(n) {
    const t = $('#streakToast');
    if (!t) return;
    t.innerHTML = `<span class="st-face">${SALVAGENTE}</span>
      <span class="st-copy"><strong>Lifebuoy earned</strong>
        <small>${n} in a row · ${livesNow()} of ${MAX_LIVES}</small></span>`;
    t.hidden = false;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(annunciaVita._t);
    annunciaVita._t = setTimeout(() => { t.hidden = true; }, 2800);
    confetti(30);
  }

  function avvisoCheckpoint() {
    const el = $('#lockedHint');
    if (!el) return;
    el.hidden = false;
    el.textContent = `A checkpoint needs at least ${CHECK_MIN_LIVES} lifebuoys — with fewer it would end before giving you a score. You have ${livesNow()}.`;
    try { el.scrollIntoView({ block: 'center', behavior: motionOK() ? 'smooth' : 'auto' }); } catch (e) {}
  }

  function avvisoSenzaVite() {
    const el = $('#lockedHint');
    if (!el) return;
    el.hidden = false;
    const fra = attesaVita();
    el.textContent = `No lifebuoys left. One comes back in ${testoAttesa(fra || LIFE_REGEN_MS)}`
      + ` — or right away with ${STREAK_PER_LIFE} correct answers in a row. Practice never costs one.`;
    try { el.scrollIntoView({ block: 'center', behavior: motionOK() ? 'smooth' : 'auto' }); } catch (e) {}
  }

  function renderStatLives() {
    const n = livesNow();
    const b = $('#statLives');
    if (b) b.textContent = n;
    const host = $('#statLivesHost');
    if (host) {
      host.classList.toggle('empty', n === 0);
      host.title = n >= MAX_LIVES ? 'Lifebuoys — full'
        : `Lifebuoys — next one in ${testoAttesa(attesaVita())}`;
    }
    const timer = $('#statLivesTimer');
    if (timer) {
      const ms = attesaVita();
      timer.hidden = !ms;
      if (ms) timer.textContent = testoAttesa(ms);
    }
  }

  /* "14m" o "45s": sotto il minuto i secondi rassicurano, sopra distraggono. */
  function testoAttesa(ms) {
    if (ms <= 0) return '0s';
    const sec = Math.ceil(ms / 1000);
    return sec >= 60 ? Math.ceil(sec / 60) + 'm' : sec + 's';
  }

  /* Il fondo matura anche mentre la pagina è aperta e ferma, quindi il
     contatore va ridisegnato da solo. Ogni dieci secondi basta: il testo
     mostra i minuti, e sotto il minuto i secondi restano leggibili. */
  let _orologioVite = null;
  function fermaOrologioVite() {
    if (_orologioVite) { clearTimeout(_orologioVite); _orologioVite = null; }
  }
  function avviaOrologioVite() {
    fermaOrologioVite();
    const ms = attesaVita();
    if (!ms) return;                     // fondo pieno: niente da contare
    // si riprogramma da solo invece di girare a vuoto: sopra il minuto basta
    // ridisegnare ogni trenta secondi, sotto il minuto si contano i secondi
    const passo = ms > 60000 ? Math.min(30000, ms - 60000) : Math.min(1000, ms);
    _orologioVite = setTimeout(() => {
      _orologioVite = null;
      const prima = limitaVite(state.lives);
      if (livesNow() !== prima) { save(); renderPath(); }
      renderStatLives();
      avviaOrologioVite();
    }, Math.max(250, passo));
  }

  function renderHearts() {
    const max = run.maxHearts || HEARTS;
    const host = $('#hearts');
    host.setAttribute('aria-label', `${run.hearts} of ${max} lifebuoys left`);
    host.innerHTML = Array.from({ length: max }, (_, i) =>
      `<span class="h ${i < run.hearts ? '' : 'gone'}" aria-hidden="true">${SALVAGENTE}</span>`).join('');
  }

  /* ── i cinque tipi di esercizio ──────────────────────────────────── */
  const KICKER = { choice:'Choose the answer', numeric:'Work it out', order:'Put them in order',
                   pairs:'Match the pairs', build:'Complete the sentence' };

  function renderExercise(ex) {
    const area = $('#exerciseArea');
    area.innerHTML = `<span class="q-kicker">${KICKER[ex.type] || 'Question'}</span>
      <div class="q-prompt">${esc(ex.prompt)}</div><div id="exBody"></div>`;
    ({ choice: renderChoice, numeric: renderNumeric, order: renderOrder,
       pairs: renderPairs, build: renderBuild }[ex.type] || renderChoice)(ex, $('#exBody'));
  }

  function renderChoice(ex, host) {
    host.innerHTML = `<div class="opts">${ex.options.map((o, i) =>
      `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    $$('.opt', host).forEach(b => b.addEventListener('click', () => {
      if (run.state !== 'answering') return;
      $$('.opt', host).forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      run.picked = Number(b.dataset.i);
      $('#checkButton').disabled = false;
    }));
  }

  function renderNumeric(ex, host) {
    host.innerHTML = `<div class="numwrap"><span>${esc(ex.unit || '')}</span>
      <input type="text" inputmode="numeric" id="numInput" autocomplete="off" placeholder="0" /></div>
      <p class="hint">Digits only. Commas are fine.</p>`;
    const input = $('#numInput', host);
    input.addEventListener('input', () => {
      run.picked = input.value.replace(/[^0-9.-]/g, '');
      $('#checkButton').disabled = run.picked === '';
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !$('#checkButton').disabled) { e.preventDefault(); onCheck(); }
    });
    setTimeout(() => input.focus(), 60);
  }

  function renderOrder(ex, host) {
    // parte mescolato in modo deterministico ma diverso dall'ordine corretto
    const items = ex.items.map((t, i) => ({ t, i }));
    let order = items.slice().reverse();
    if (order.length > 2) { const a = order[0]; order[0] = order[1]; order[1] = a; }
    run.order = order;
    const draw = () => {
      host.innerHTML = `<div class="orderlist">${run.order.map((it, pos) =>
        `<div class="orderitem"><b>${pos + 1}</b><span>${esc(it.t)}</span>
          <span class="arrows">
            <button data-mv="up" data-pos="${pos}" aria-label="Move up" ${pos === 0 ? 'disabled' : ''}>▲</button>
            <button data-mv="down" data-pos="${pos}" aria-label="Move down" ${pos === run.order.length - 1 ? 'disabled' : ''}>▼</button>
          </span></div>`).join('')}</div>`;
      $$('[data-mv]', host).forEach(b => b.addEventListener('click', () => {
        if (run.state !== 'answering') return;
        const p = Number(b.dataset.pos);
        const q = b.dataset.mv === 'up' ? p - 1 : p + 1;
        if (q < 0 || q >= run.order.length) return;
        [run.order[p], run.order[q]] = [run.order[q], run.order[p]];
        draw();
        $('#checkButton').disabled = false;
      }));
    };
    draw();
    $('#checkButton').disabled = false;
  }

  function renderPairs(ex, host) {
    const lefts = ex.pairs.map((p, i) => ({ t: p[0], i }));
    const rights = ex.pairs.map((p, i) => ({ t: p[1], i }));
    // colonna destra ruotata, cosi' non e' mai già allineata
    const rot = rights.slice(1).concat(rights.slice(0, 1));
    run.pairState = { matched: [], selLeft: null, wrong: 0 };
    host.innerHTML = `<div class="pairs">
      <div class="col">${lefts.map(l => `<button class="pair-btn" data-side="l" data-i="${l.i}">${esc(l.t)}</button>`).join('')}</div>
      <div class="col">${rot.map(r => `<button class="pair-btn" data-side="r" data-i="${r.i}">${esc(r.t)}</button>`).join('')}</div>
    </div>`;
    const check = () => {
      if (run.pairState.matched.length === ex.pairs.length) {
        run.picked = run.pairState.wrong === 0 ? 'ok' : 'partial';
        $('#checkButton').disabled = false;
      }
    };
    $$('.pair-btn', host).forEach(b => b.addEventListener('click', () => {
      if (run.state !== 'answering' || b.classList.contains('matched')) return;
      const side = b.dataset.side, idx = Number(b.dataset.i);
      if (side === 'l') {
        $$('[data-side="l"]', host).forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        run.pairState.selLeft = idx;
        return;
      }
      if (run.pairState.selLeft === null) return;
      const left = $(`[data-side="l"][data-i="${run.pairState.selLeft}"]`, host);
      // confronto sul testo: due voci di destra possono essere identiche
      // (es. "Buyer" per freight e insurance) e vanno accettate entrambe
      const wanted = ex.pairs[run.pairState.selLeft][1];
      if (rights[idx].t === wanted) {
        left.classList.remove('sel'); left.classList.add('matched'); b.classList.add('matched');
        run.pairState.matched.push(run.pairState.selLeft);
      } else {
        run.pairState.wrong++;
        b.classList.add('no'); left.classList.remove('sel');
        setTimeout(() => b.classList.remove('no'), 420);
      }
      run.pairState.selLeft = null;
      check();
    }));
  }

  function renderBuild(ex, host) {
    // le tessere sono identificate dall'indice, non dal testo:
    // così una frase può ripetere la stessa parola più volte
    const bank = ex.sentence.slice(1).concat(ex.distractors || [])
      .map((t, i) => ({ t, id: i }));
    // mescolamento deterministico
    bank.sort((a, b) => (a.t.length % 7) - (b.t.length % 7) || a.t.localeCompare(b.t) || a.id - b.id);
    run.built = [{ t: ex.sentence[0], id: -1 }];
    const draw = () => {
      const used = new Set(run.built.map(b => b.id));
      host.innerHTML = `<div class="tiles" id="builtZone">${run.built.map((b, i) =>
        `<button class="tile" data-rm="${i}" ${i === 0 ? 'disabled' : ''}>${esc(b.t)}</button>`).join('')}</div>
        <div class="bank">${bank.filter(b => !used.has(b.id)).map(b =>
        `<button class="tile" data-add="${b.id}" data-word="${esc(b.t)}">${esc(b.t)}</button>`).join('')}</div>`;
      $$('[data-add]', host).forEach(b => b.addEventListener('click', () => {
        if (run.state !== 'answering') return;
        const id = Number(b.dataset.add);
        const tile = bank.find(x => x.id === id);
        if (!tile) return;
        run.built.push(tile); draw();
        $('#checkButton').disabled = run.built.length < 2;
      }));
      $$('[data-rm]', host).forEach(b => b.addEventListener('click', () => {
        if (run.state !== 'answering' || b.disabled) return;
        run.built.splice(Number(b.dataset.rm), 1); draw();
        $('#checkButton').disabled = run.built.length < 2;
      }));
    };
    draw();
  }

  /* ── valutazione ─────────────────────────────────────────────────── */
  function evaluate(ex) {
    if (ex.type === 'choice') return run.picked === ex.answer;
    if (ex.type === 'numeric') {
      const v = parseFloat(String(run.picked).replace(/,/g, ''));
      return Number.isFinite(v) && Math.abs(v - ex.answer) <= (ex.tolerance || 0);
    }
    if (ex.type === 'order') return run.order.every((it, pos) => it.i === pos);
    if (ex.type === 'pairs') return run.picked === 'ok';
    if (ex.type === 'build') return run.built.map(b => b.t).join(' ') === ex.sentence.join(' ');
    return false;
  }

  function onCheck() {
    if (!run) return;
    if (run.state === 'feedback') { nextExercise(); return; }
    const ex = run.current.ex;
    const ok = evaluate(ex);
    run.state = 'feedback';
    run.answered++;
    const key = run.current.lessonId != null ? exKey(run.current.lessonId, run.current.i) : null;
    // la serie conta solo le risposte prese al primo colpo: un ritentativo
    // non la fa crescere, altrimenti basterebbe insistere
    let vitaGuadagnata = false;
    if (ok && !run.current.retry) {
      state.streakNow = (state.streakNow || 0) + 1;
      if (state.streakNow > (state.streakBest || 0)) state.streakBest = state.streakNow;
      vitaGuadagnata = forseGuadagnaVita();
    } else if (!ok) {
      state.streakNow = 0;
    }
    if (ok) {
      run.correct++;
      if (!run.current.retry) {
        run.firstTry++;
        const sid = run.current.skill || skillIdForLesson(run.current.lessonId);
        if (sid) state.skillXp[sid] = (Number(state.skillXp[sid]) || 0) + (run.mode === 'lesson' ? 2 : 1);
      }
      // preso al primo colpo: l'esercizio esce dalla lista dei debiti
      if (key && !run.current.retry && state.misses[key]) {
        state.misses[key]--;
        if (state.misses[key] <= 0) delete state.misses[key];
        save();
      }
    } else {
      spendiVita();
      if (key) { state.misses[key] = (state.misses[key] || 0) + 1; save(); }
      run.queue.push({ ...run.current, retry: true });   // l'errore torna
      renderHearts();
      renderRivela();
    }
    markAnswers(ex, ok);
    renderRivela();
    mostraFeedback(ex, ok ? 'ok' : 'no');
    if (!ok) { const h = $('#hearts'); h.classList.remove('lost'); void h.offsetWidth; h.classList.add('lost'); }
    renderStreak(ok);
    renderProgress();
    if (run.hearts <= 0 && !run.gratis) setTimeout(() => failRun(), 900);
  }

  /* esito: 'ok' | 'no' | 'rivelato' */
  function mostraFeedback(ex, esito) {
    const fb = $('#feedback');
    const buono = esito === 'ok';
    fb.className = `feedback ${buono ? 'good' : 'bad'}${esito === 'rivelato' ? ' shown' : ''}`;
    const M = window.MASCOT;
    const faccia = buono ? 'happy' : esito === 'rivelato' ? 'teach' : 'oops';
    const testa = buono ? (M ? M.praise() : 'Correct')
      : esito === 'rivelato' ? 'Here it is.'
      : (M ? M.miss() : 'Not quite');
    fb.innerHTML = `<div class="fb-inner">
        <div class="fb-face">${M ? M.svg(faccia, 74) : ''}</div>
        <div class="fb-copy">
          <div class="fb-head">${esc(M ? M.name : '')} <em>${esc(testa)}</em></div>
          <p>${esc(ex.why || '')}</p>
          ${esito === 'rivelato' ? '<p class="fb-note">It comes back later in this lesson — you still have to answer it yourself.</p>' : ''}
        </div>
      </div>`;
    fb.hidden = false;
    const btn = $('#checkButton');
    btn.disabled = false;
    btn.className = `btn ${buono ? 'go' : 'stop'}`;
    btn.textContent = (run.hearts <= 0 && !run.gratis) ? 'Out of lifebuoys' : (run.queue.length ? 'Continue' : 'Finish');
  }

  /* ── spendere una vita per vedere la soluzione ──────────────────────
     Regole, e il motivo di ciascuna:
     · costa una vita, altrimenti non è una scelta;
     · non è disponibile con una sola vita rimasta: perdere la partita
       premendo "mostrami la risposta" è un modo confuso di finire;
     · non è disponibile in un checkpoint, che è una verifica;
     · non conta come risposta presa al primo colpo — azzera la serie, non dà
       XP e finisce fra le cose da ripassare;
     · l'esercizio torna comunque in coda: vedere la soluzione non è averla data. */
  const puoRivelare = () => !!run && run.state === 'answering'
    && run.mode !== 'checkpoint' && run.hearts > 1;

  function renderRivela() {
    const b = $('#revealButton');
    if (!b) return;
    const disponibile = puoRivelare();
    b.hidden = !run || run.mode === 'checkpoint';
    b.disabled = !disponibile;
    b.textContent = run && run.hearts <= 1 ? 'Show the answer — needs a spare lifebuoy'
                                           : 'Show the answer · costs 1 lifebuoy';
  }

  function mostraSoluzione(ex) {
    const host = $('#exBody') || $('#exerciseArea');
    if (ex.type === 'choice') {
      run.picked = ex.answer;
      $$('.opt').forEach(b => { b.classList.remove('sel'); if (Number(b.dataset.i) === ex.answer) b.classList.add('sel'); });
    } else if (ex.type === 'numeric') {
      const i = $('#numInput');
      if (i) { i.value = String(ex.answer); run.picked = String(ex.answer); }
    } else if (ex.type === 'order') {
      run.order = ex.items.map((t, i) => ({ t, i }));
      // ridisegno la lista già ordinata, senza le frecce: è la soluzione
      if (host) host.innerHTML = `<div class="orderlist">${run.order.map((it, pos) =>
        `<div class="orderitem solved"><b>${pos + 1}</b><span>${esc(it.t)}</span></div>`).join('')}</div>`;
    } else if (ex.type === 'pairs') {
      run.pairState = { matched: ex.pairs.map((_, i) => i), selLeft: null, wrong: 0 };
      run.picked = 'ok';
      if (host) host.innerHTML = `<div class="pairs solved">
        <div class="col">${ex.pairs.map(p => `<span class="pair-btn matched">${esc(p[0])}</span>`).join('')}</div>
        <div class="col">${ex.pairs.map(p => `<span class="pair-btn matched">${esc(p[1])}</span>`).join('')}</div>
      </div>`;
    } else if (ex.type === 'build') {
      run.built = ex.sentence.map((t, i) => ({ t, id: i - 1 }));
      if (host) host.innerHTML = `<div class="tiles solved">${ex.sentence.map(t =>
        `<span class="tile">${esc(t)}</span>`).join('')}</div>`;
    }
  }

  function rivela() {
    if (!puoRivelare()) return;
    const ex = run.current.ex;
    spendiVita();
    run.rivelati = (run.rivelati || 0) + 1;
    run.state = 'feedback';
    run.answered++;
    state.streakNow = 0;                       // non l'hai presa, l'hai vista
    const key = run.current.lessonId != null ? exKey(run.current.lessonId, run.current.i) : null;
    if (key) { state.misses[key] = (state.misses[key] || 0) + 1; save(); }
    run.queue.push({ ...run.current, retry: true });
    mostraSoluzione(ex);
    if (ex.type === 'choice' || ex.type === 'numeric') markAnswers(ex, true);
    renderHearts();
    renderRivela();
    const h = $('#hearts');
    if (h) { h.classList.remove('lost'); void h.offsetWidth; h.classList.add('lost'); }
    mostraFeedback(ex, 'rivelato');
    renderStreak(false);
    renderProgress();
  }

  function markAnswers(ex, ok) {
    if (ex.type === 'choice') {
      $$('.opt').forEach(b => {
        b.disabled = true;
        const i = Number(b.dataset.i);
        if (i === ex.answer) b.classList.add('ok');
        else if (i === run.picked && !ok) b.classList.add('no');
      });
    }
    if (ex.type === 'numeric') { const el = $('#numInput'); if (el) el.disabled = true; }
  }

  function failRun() {
    if (run?.mode === 'frontier') {
      state.frontier.plays = (state.frontier.plays || 0) + 1;
      state.frontier.correct = (state.frontier.correct || 0) + (run.firstTry || 0);
      state.frontier.total = (state.frontier.total || 0) + (run.total || 0);
      touchStreak(); save();
      run = null; show('playScreen'); return;
    }
    run = null;
    show('pathScreen');
    renderPath();
  }

  function finishRun() {
    const acc = run.total ? Math.round((run.firstTry / run.total) * 100) : 0;
    const mode = run.mode;
    const crest = $('.done-crest');
    let gained = 0, title = '', goal = '';

    if (mode === 'lesson') {
      const lesson = run.lesson;
      gained = XP_PER + Math.round(XP_PER * (acc / 100));
      if (!isDone(lesson.id)) state.done.push(lesson.id);
      state.best[lesson.id] = Math.max(state.best[lesson.id] || 0, acc);
      state.doneAt[lesson.id] = Date.now();
      title = lesson.title;
      goal = lesson.goal || '';
    } else if (mode === 'review') {
      // il ripasso paga meno di una lezione nuova, ma paga
      gained = Math.max(1, Math.round(XP_PER * (acc / 100)));
      state.reviews = (state.reviews || 0) + 1;
      title = 'Practice done';
      goal = 'Anything you missed here will come back again until it sticks.';
    } else if (mode === 'frontier') {
      gained = Math.max(5, Math.round(8 + acc * .18));
      state.frontier.plays = (state.frontier.plays || 0) + 1;
      state.frontier.correct = (state.frontier.correct || 0) + run.firstTry;
      state.frontier.total = (state.frontier.total || 0) + run.total;
      state.frontier.best = Math.max(Number(state.frontier.best)||0, acc);
      if (acc >= 70) state.frontier.cleared = (state.frontier.cleared || 0) + 1;
      title = acc >= 70 ? 'Trading Floor Run cleared' : 'Trading Floor Run complete';
      goal = acc >= 70
        ? 'Fresh questions are generated every run. Keep rotating through the desks and push the score higher.'
        : 'The floor stays open. Build the weak skills and run another book when you are ready.';
    } else {
      const unit = run.unit;
      const passed = acc >= CHECK_PASS;
      const prev = state.badges[unit.id] || 0;
      if (passed) state.badges[unit.id] = Math.max(prev, acc);
      gained = passed ? XP_PER * 3 : XP_PER;
      title = passed ? `${unit.title} — passed` : `${unit.title} — not yet`;
      goal = passed
        ? 'Badge earned. Come back to it later and see if it holds.'
        : `You need ${CHECK_PASS}% first time round. Practice the weak spots and try again.`;
    }

    state.xp = (state.xp || 0) + gained;
    if (mode === 'lesson' || mode === 'review' || mode === 'frontier') { ensureDaily(); state.daily.trainingRuns = (state.daily.trainingRuns || 0) + 1; }
    touchStreak();
    save();
    $('#doneTitle').textContent = title;
    $('#doneGoal').textContent = goal;
    if (crest && window.MASCOT) {
      const good = mode !== 'checkpoint' || acc >= CHECK_PASS;
      crest.innerHTML = window.MASCOT.svg(good ? 'happy' : 'oops', 128);
    }
    countUp($('#doneXp'), gained, '+');
    countUp($('#doneAcc'), acc, '', '%');
    if (mode !== 'checkpoint' || acc >= CHECK_PASS) confetti(acc === 100 ? 60 : 40);
    doneReturnScreen = mode === 'frontier' ? 'playScreen' : 'pathScreen';
    run = null;
    show('doneScreen');
  }


  let doneReturnScreen = 'pathScreen';

  /* ── carriera, skill e hub ───────────────────────────────────────── */
  function careerLevel() { return 1 + Math.floor((Number(state.xp) || 0) / 50); }

  function careerRank() {
    const doneN = state.done.filter(id => allLessons.some(l => l.id === id)).length;
    const xp = Number(state.xp) || 0;
    const ranks = GAME.ranks || [];
    let i = 0;
    ranks.forEach((r, n) => { if (xp >= r.xp && doneN >= r.lessons) i = n; });
    return { current: ranks[i] || { name:'Intern', xp:0, lessons:0 }, next: ranks[i + 1] || null, index:i };
  }

  function skillScore(skillId) {
    const units = UNITS.filter(u => GAME.unitMeta[u.id]?.skill === skillId);
    if (!units.length) return 0;
    const lessons = units.flatMap(u => u.lessons);
    const doneN = lessons.filter(l => isDone(l.id)).length;
    const base = lessons.length ? (doneN / lessons.length) * 70 : 0;
    const badges = units.map(u => Number(state.badges[u.id]) || 0);
    const badge = badges.length ? (badges.reduce((a,b) => a+b,0) / badges.length) * .15 : 0;
    const practice = Math.min(15, (Number(state.skillXp[skillId]) || 0) * .45);
    return Math.min(100, Math.round(base + badge + practice));
  }

  function careerWorldGroups() {
    const foundations = UNITS.filter(u => String(u.id).startsWith('u'));
    const advanced = UNITS.filter(u => !String(u.id).startsWith('u'));
    const groups = [];
    if (foundations.length) groups.push({ id:'foundations', title:'Merchant Foundations', subtitle:'Core mechanics every desk must know.', icon:'MF', units:foundations });
    advanced.forEach(u => {
      const meta = GAME.unitMeta[u.id] || {};
      groups.push({ id:u.id, title:u.title, subtitle:u.subtitle, icon:meta.icon || '◆', units:[u], phase:meta.phase || meta.chapter || 'Desk Academy' });
    });
    return groups;
  }

  function renderWorldMap() {
    const host = $('#worldMapHost'); if (!host) return;
    const next = nextLessonId();
    const groups = careerWorldGroups();
    host.innerHTML = groups.map(g => {
      const lessons = g.units.flatMap(u => u.lessons);
      const doneN = lessons.filter(l => isDone(l.id)).length;
      const total = lessons.length;
      const active = lessons.some(l => l.id === next);
      const complete = total > 0 && doneN === total;
      const unlocked = complete || active || doneN > 0;
      const pct = total ? Math.round(doneN/total*100) : 0;
      const target = g.units[0]?.id;
      return `<button class="world-card${complete?' complete':active?' active':unlocked?' unlocked':' locked'}" data-world-target="${esc(target)}" ${unlocked ? '' : 'disabled'}>
        <span class="world-icon">${complete ? '✓' : esc(g.icon)}</span><span class="world-copy"><small>${esc(g.phase || (g.id === 'foundations' ? 'CORE' : 'SPECIALIST DESK'))}</small><strong>${esc(g.title)}</strong><em>${doneN}/${total} levels · ${pct}%</em></span>
        <i class="world-mini-track"><b style="width:${pct}%"></b></i>
      </button>`;
    }).join('');
    $$('[data-world-target]', host).forEach(b => b.addEventListener('click', () => {
      const el = document.getElementById(`unit-${b.dataset.worldTarget}`);
      if (el) el.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block:'start' });
    }));
    const count = $('#careerCount'); if (count) count.textContent = `${allLessons.length} levels · ${UNITS.length} desks`;
  }

  function renderCareerHero() {
    const host = $('#careerHero'); if (!host) return;
    const { current, next } = careerRank();
    const xp = Number(state.xp) || 0;
    const doneN = state.done.filter(id => allLessons.some(l => l.id === id)).length;
    let pct = 100, copy = 'Top rank reached';
    if (next) {
      const xpPct = next.xp ? Math.min(1, xp / next.xp) : 1;
      const lessonPct = next.lessons ? Math.min(1, doneN / next.lessons) : 1;
      pct = Math.round(Math.min(xpPct, lessonPct) * 100);
      const needs = [];
      if (xp < next.xp) needs.push(`${next.xp - xp} XP`);
      if (doneN < next.lessons) needs.push(`${next.lessons - doneN} level${next.lessons - doneN === 1 ? '' : 's'}`);
      copy = needs.length ? `${needs.join(' + ')} to ${next.name}` : `Ready for ${next.name}`;
    }
    host.innerHTML = `<section class="career-hero">
      <div class="career-badge"><span>LEVEL</span><b>${careerLevel()}</b></div>
      <div class="career-copy"><span class="career-label">CURRENT ROLE</span><h2>${esc(current.name)}</h2>
        <p>${esc(copy)}</p><div class="career-track" role="progressbar" aria-label="Career promotion progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div></div>
    </section>`;
  }

  function bossUnlocked(meta) {
    const doneN = state.done.filter(id => allLessons.some(l => l.id === id)).length;
    const u = meta?.unlock || {};
    return (Number(state.xp) || 0) >= (Number(u.xp) || 0) && doneN >= (Number(u.lessons) || 0);
  }

  function renderBossHub() {
    const host = $('#bossHub'); if (!host) return;
    const catalog = GAME.bossCatalog || [];
    const doneN = state.done.filter(id => allLessons.some(l => l.id === id)).length;
    host.innerHTML = catalog.map(meta => {
      const unlocked = bossUnlocked(meta);
      const best = Number(state.boss.completed?.[meta.id]) || 0;
      const u = meta.unlock || {};
      const needs = [];
      if ((state.xp || 0) < (u.xp || 0)) needs.push(`${u.xp - (state.xp || 0)} XP`);
      if (doneN < (u.lessons || 0)) needs.push(`${u.lessons - doneN} foundation level${u.lessons - doneN === 1 ? '' : 's'}`);
      return `<article class="boss-card${unlocked ? '' : ' boss-locked'}">
        <div class="boss-card-icon">${esc(meta.icon || 'B')}</div>
        <div class="boss-card-copy"><span>${esc(meta.desk)} desk · difficulty ${meta.difficulty || 1}</span><h3>${esc(meta.title)}</h3>
          <p>${best ? `Best result · ${best}%` : (unlocked ? 'A multi-step commercial simulation.' : `Unlock with ${needs.join(' + ')}`)}</p></div>
        <button class="boss-start" data-boss-id="${esc(meta.id)}" ${unlocked ? '' : 'disabled'}>${best ? 'Run again' : (unlocked ? 'Start deal' : 'Locked')}</button>
      </article>`;
    }).join('');
    $$('[data-boss-id]', host).forEach(b => b.addEventListener('click', () => startBoss(b.dataset.bossId)));
    const rec = $('#bossRecord'); if (rec) rec.textContent = `${state.boss.cleared || 0} cleared`;
  }

  function renderDailyHub() {
    ensureDaily();
    const meta = GAME.dailyMeta ? GAME.dailyMeta(state.daily.day) : null;
    const copy = $('#dailyCardCopy');
    const start = $('#dailyStart');
    if (copy) copy.textContent = meta ? `${meta.desk} desk · ${meta.steps} decisions · ${state.daily.dealDone ? `best ${state.daily.dealBest}%` : 'new today'}` : 'One complete trade scenario, refreshed every day.';
    if (start) start.textContent = state.daily.dealDone ? 'Run today’s deal again' : 'Open today’s deal';

    const host = $('#dailyQuestHub');
    if (host) {
      const qs = dailyQuests();
      host.innerHTML = qs.map(q => {
        const claimed = !!state.daily.claimed[q.id];
        const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
        return `<article class="quest-row${q.done ? ' done' : ''}${claimed ? ' claimed' : ''}">
          <div class="quest-icon">${esc(q.icon)}</div><div class="quest-copy"><h3>${esc(q.title)}</h3><p>${esc(q.copy)}</p>
          <div class="quest-progress"><i style="width:${pct}%"></i></div><small>${q.progress} / ${q.target}</small></div>
          <button class="quest-claim" data-quest-claim="${esc(q.id)}" ${q.done && !claimed ? '' : 'disabled'}>${claimed ? 'Claimed' : `+${q.reward} XP`}</button>
        </article>`;
      }).join('');
      $$('[data-quest-claim]', host).forEach(b => b.addEventListener('click', () => claimDailyQuest(b.dataset.questClaim)));
      const claimedN = qs.filter(q => state.daily.claimed[q.id]).length;
      const rec = $('#dailyQuestRecord'); if (rec) rec.textContent = `${claimedN} / ${qs.length} claimed`;
      const bonus = $('#dailyBonus');
      if (bonus) bonus.innerHTML = state.daily.bonusClaimed
        ? `<span>✓</span><div><b>Desk bonus collected</b><small>All daily objectives complete · +25 XP</small></div>`
        : `<span>★</span><div><b>Complete all 3 quests</b><small>Collect every quest reward for a +25 XP desk bonus.</small></div>`;
    }
  }

  function renderPlayHub() {
    const xp = $('#playXp'); if (xp) xp.textContent = state.xp || 0;
    const best = $('#flashBest'); if (best) best.textContent = state.flash.best || 0;
    const runs = $('#flashRuns'); if (runs) runs.textContent = state.flash.plays || 0;
    const fBest = $('#frontierBest'); if (fBest) fBest.textContent = `${state.frontier.best || 0}%`;
    const fRuns = $('#frontierRuns'); if (fRuns) fRuns.textContent = state.frontier.plays || 0;
    const frontierWorlds = unlockedMasteryWorlds();
    const frontierBtn = $('#frontierStart'); if (frontierBtn) { frontierBtn.disabled = !frontierWorlds; frontierBtn.textContent = frontierWorlds ? 'Start desk run' : 'Complete Foundations'; }
    const frontierCopy = $('#frontierCopy'); if (frontierCopy) frontierCopy.textContent = frontierWorlds
      ? `10 fresh questions across ${frontierWorlds} specialist desk${frontierWorlds === 1 ? '' : 's'}. Every run is regenerated.`
      : 'Complete all 31 Merchant Foundations levels to unlock the endless specialist rotation.';
    renderDailyHub();
    renderBossHub();
  }

  function renderPracticeHub() {
    const host = $('#practiceHub'); if (!host) return;
    const due = dueCount();
    const available = state.done.length > 0;
    host.innerHTML = `<section class="practice-card">
      <div class="practice-orb">↻</div><span class="eyebrow">Personalised queue</span>
      <h2>${available ? (due ? `${due} item${due === 1 ? '' : 's'} need attention` : 'Keep your earlier skills warm') : 'Complete your first level to unlock Practice'}</h2>
      <p>${available ? 'World of Trade weights mistakes and older material more heavily, so weak concepts return before strong ones.' : 'Practice is built from questions you have already encountered.'}</p>
      <button id="practiceStart" class="btn primary wide" ${available ? '' : 'disabled'}>${due ? 'Train weak skills' : 'Start practice'}</button>
    </section>`;
    $('#practiceStart')?.addEventListener('click', startReview);
  }

  function renderProfile() {
    const host = $('#profileBody'); if (!host) return;
    const { current, next } = careerRank();
    const rows = Object.entries(GAME.skills || {}).map(([id, sk]) => {
      const score = skillScore(id);
      return `<div class="skill-row"><div class="skill-top"><span><i>${esc(sk.icon)}</i>${esc(sk.short)}</span><b>${score}</b></div>
        <div class="skill-track" role="progressbar" aria-label="${esc(sk.name)} mastery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${score}"><i style="width:${score}%"></i></div></div>`;
    }).join('');
    const accuracy = state.flash.total ? Math.round(state.flash.correct / state.flash.total * 100) : 0;
    host.innerHTML = `<section class="profile-rank"><span class="eyebrow">Current role</span><h2>${esc(current.name)}</h2>
      <div class="profile-numbers"><div><b>${careerLevel()}</b><span>Level</span></div><div><b>${state.xp || 0}</b><span>XP</span></div><div><b>${state.streak || 0}</b><span>Day streak</span></div></div>
      ${next ? `<p>Next promotion: <strong>${esc(next.name)}</strong> · ${next.xp} XP and ${next.lessons} foundation levels.</p>` : '<p>You reached the top career rank.</p>'}
    </section>
    <section class="skill-card"><div class="card-title"><div><span class="eyebrow">Desk capability</span><h2>Your skills</h2></div><small>0–100</small></div>${rows}</section>
    <section class="flash-record"><span class="eyebrow">Flash Trading record</span><div class="profile-numbers"><div><b>${state.flash.best || 0}</b><span>Best score</span></div><div><b>${state.flash.plays || 0}</b><span>Runs</span></div><div><b>${accuracy}%</b><span>Accuracy</span></div></div></section>
    <section class="flash-record"><span class="eyebrow">Trading Floor Run</span><div class="profile-numbers"><div><b>${state.frontier.best || 0}%</b><span>Best result</span></div><div><b>${state.frontier.plays || 0}</b><span>Runs</span></div><div><b>${state.frontier.cleared || 0}</b><span>Cleared</span></div></div></section>
    <section class="flash-record"><span class="eyebrow">Boss Deal record</span><div class="profile-numbers"><div><b>${state.boss.best || 0}%</b><span>Best result</span></div><div><b>${state.boss.cleared || 0}</b><span>Deals cleared</span></div><div><b>${state.boss.plays || 0}</b><span>Runs</span></div></div></section>
    <section class="flash-record"><span class="eyebrow">Daily desk record</span><div class="profile-numbers"><div><b>${dailyDealCount()}</b><span>Daily deals</span></div><div><b>${perfectDayCount()}</b><span>Perfect days</span></div><div><b>${dailyQuests().filter(q => state.daily.claimed[q.id]).length}/3</b><span>Today</span></div></div></section>`;
  }

  function renderMetaScreens() { renderTopStats(); renderPlayHub(); renderPracticeHub(); renderProfile(); if ($('#leagueScreen')?.classList.contains('active')) renderLeagueHub(); }

  /* ── Boss Deals ──────────────────────────────────────────────────── */
  let boss = null;

  const money = n => {
    const v = Math.round(Number(n) || 0);
    return `${v < 0 ? '−' : v > 0 ? '+' : ''}$${Math.abs(v).toLocaleString('en-US')}`;
  };

  function launchDeal(deal, kind = 'boss') {
    if (!deal) return;
    boss = { deal, kind, index:-1, pnl:Number(deal.basePnl)||0, answers:[], locked:false };
    $('#bossDesk').textContent = kind === 'daily' ? `${deal.desk.toUpperCase()} DESK · DEAL OF THE DAY` : `${deal.desk.toUpperCase()} DESK · BOSS DEAL`;
    $('#bossTitle').textContent = deal.title;
    $('#bossStepText').textContent = 'Briefing';
    $('#bossProgressFill').style.width = '0%';
    $('.boss-progress')?.setAttribute('aria-valuenow','0');
    $('#bossFeedback').className = 'boss-feedback'; $('#bossFeedback').innerHTML = '';
    show('bossScreen');
    renderBossBrief();
  }

  function startBoss(id) {
    const meta = (GAME.bossCatalog || []).find(x => x.id === id);
    if (!meta || !bossUnlocked(meta) || !GAME.makeBossDeal) return;
    launchDeal(GAME.makeBossDeal(id), 'boss');
  }

  function startDaily() {
    ensureDaily();
    if (!GAME.makeDailyDeal) return;
    launchDeal(GAME.makeDailyDeal(state.daily.day), 'daily');
  }

  function renderBossBrief() {
    if (!boss) return;
    const d = boss.deal;
    $('#bossBody').innerHTML = `<section class="deal-brief">
      <div class="deal-stamp"><span>${esc(d.icon || 'B')}</span><small>${esc(d.accent || d.desk)}</small></div>
      <span class="eyebrow">${boss.kind === 'daily' ? 'Today’s assignment' : 'Incoming opportunity'}</span><h1>${esc(d.title)}</h1><p>${esc(d.brief)}</p>
      <div class="deal-facts">${(d.facts || []).map(f => `<span>${esc(f)}</span>`).join('')}</div>
      <div class="deal-economics"><span>Theoretical gross P&amp;L</span><b>${money(d.basePnl)}</b><small>Your decisions can protect or destroy it.</small></div>
      <button id="bossBegin" class="btn primary wide">Enter dealing room</button>
    </section>`;
    $('#bossBegin').addEventListener('click', () => { if (!boss) return; boss.index = 0; renderBossStep(); });
  }

  function renderBossStep() {
    if (!boss) return;
    const d = boss.deal, step = d.steps[boss.index];
    if (!step) return finishBoss();
    boss.locked = false;
    const pct = Math.round((boss.index / d.steps.length) * 100);
    $('#bossStepText').textContent = `Decision ${boss.index + 1} of ${d.steps.length}`;
    $('#bossProgressFill').style.width = `${pct}%`;
    $('.boss-progress')?.setAttribute('aria-valuenow',String(pct));
    $('#bossFeedback').className = 'boss-feedback'; $('#bossFeedback').innerHTML = '';
    const skill = GAME.skills[step.skill]?.short || step.skill || 'Decision';
    if (step.type === 'choice') {
      $('#bossBody').innerHTML = `<article class="boss-question">
        <div class="boss-q-meta"><span>${esc(step.label || 'DECISION')}</span><i>${esc(skill)}</i></div>
        <h2>${esc(step.prompt)}</h2>
        <div class="boss-options">${step.options.map((o,i) => `<button class="boss-option" data-boss-choice="${i}"><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div>
        <div class="live-pnl"><span>Desk P&amp;L</span><b>${money(boss.pnl)}</b></div>
      </article>`;
      $$('[data-boss-choice]', $('#bossBody')).forEach(b => b.addEventListener('click', () => answerBoss(Number(b.dataset.bossChoice))));
    } else {
      $('#bossBody').innerHTML = `<article class="boss-question">
        <div class="boss-q-meta"><span>${esc(step.label || 'CALCULATE')}</span><i>${esc(skill)}</i></div>
        <h2>${esc(step.prompt)}</h2>
        <div class="boss-number"><input id="bossInput" type="number" step="any" inputmode="decimal" autocomplete="off" placeholder="Your answer" aria-label="Your answer"><span>${esc(step.unit || '')}</span></div>
        <button id="bossSubmit" class="btn primary wide">Commit answer</button>
        <div class="live-pnl"><span>Desk P&amp;L</span><b>${money(boss.pnl)}</b></div>
      </article>`;
      $('#bossSubmit').addEventListener('click', () => answerBoss($('#bossInput').value));
      $('#bossInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); answerBoss(e.currentTarget.value); } });
      setTimeout(() => $('#bossInput')?.focus(),0);
    }
  }

  function answerBoss(value) {
    if (!boss || boss.locked) return;
    const step = boss.deal.steps[boss.index];
    if (step.type === 'numeric' && String(value).trim() === '') return;
    const ok = step.type === 'choice'
      ? Number(value) === Number(step.answer)
      : Number.isFinite(Number(value)) && Math.abs(Number(value) - Number(step.answer)) <= (Number(step.tolerance) || 0);
    boss.locked = true;
    const impact = Number(ok ? step.pnl?.correct : step.pnl?.wrong) || 0;
    boss.pnl += impact;
    boss.answers.push({ index:boss.index, skill:step.skill, label:step.label || `Decision ${boss.index+1}`, ok, impact });
    if (ok && step.skill) state.skillXp[step.skill] = (Number(state.skillXp[step.skill]) || 0) + (boss.kind === 'daily' ? 2 : 3);

    if (step.type === 'choice') {
      $$('[data-boss-choice]', $('#bossBody')).forEach(b => {
        b.disabled = true;
        const i = Number(b.dataset.bossChoice);
        if (i === Number(step.answer)) b.classList.add('ok');
        else if (i === Number(value) && !ok) b.classList.add('no');
      });
    } else {
      const inp = $('#bossInput'); if (inp) inp.disabled = true;
      const sub = $('#bossSubmit'); if (sub) sub.disabled = true;
    }
    const impactCopy = impact === 0 ? 'No direct P&L change' : `P&L impact ${money(impact)}`;
    $('#bossFeedback').className = `boss-feedback ${ok ? 'good' : 'bad'}`;
    $('#bossFeedback').innerHTML = `<div><strong>${ok ? 'Decision accepted' : 'Desk warning'}</strong><p>${esc(step.why || '')}</p><small>${esc(impactCopy)}</small></div>
      <button id="bossNext" class="btn ${ok ? 'go' : 'stop'}">${boss.index + 1 >= boss.deal.steps.length ? 'Close the deal' : 'Next decision'}</button>`;
    $('#bossNext').addEventListener('click', () => {
      if (!boss) return;
      boss.index++;
      if (boss.index >= boss.deal.steps.length) finishBoss(); else renderBossStep();
    });
  }

  function finishBoss() {
    if (!boss) return;
    const result = boss, d = result.deal, isDaily = result.kind === 'daily';
    const correct = result.answers.filter(a => a.ok).length;
    const total = d.steps.length;
    const acc = total ? Math.round(correct / total * 100) : 0;
    const cleared = acc >= 60;
    const stars = Math.max(1, Math.min(5, Math.ceil(acc / 20)));
    let gained = 0, firstDaily = false;

    if (isDaily) {
      ensureDaily();
      firstDaily = !state.daily.dealDone;
      gained = firstDaily ? 20 + Math.round(acc * .15) : 0;
      state.daily.dealPlays = (state.daily.dealPlays || 0) + 1;
      state.daily.dealBest = Math.max(Number(state.daily.dealBest)||0, acc);
      state.daily.dealDone = true;
      state.dailyHistory.deals[state.daily.day] = Math.max(Number(state.dailyHistory.deals[state.daily.day])||0, acc);
      if (firstDaily) state.dailyStats.deals = (state.dailyStats.deals || 0) + 1;
    } else {
      const prior = Number(state.boss.completed?.[d.id]) || 0;
      gained = cleared ? 30 + Math.round(acc * .4) : 12 + Math.round(acc * .15);
      state.boss.plays = (state.boss.plays || 0) + 1;
      if (cleared && prior < 60) state.boss.cleared = (state.boss.cleared || 0) + 1;
      state.boss.completed[d.id] = Math.max(prior, acc);
      state.boss.best = Math.max(Number(state.boss.best)||0, acc);
      ensureDaily(); state.daily.bossRuns = (state.daily.bossRuns || 0) + 1;
    }
    state.xp = (state.xp || 0) + gained;
    touchStreak(); save();

    const bySkill = {};
    result.answers.forEach(a => {
      bySkill[a.skill] ||= { correct:0,total:0 };
      bySkill[a.skill].total++;
      if (a.ok) bySkill[a.skill].correct++;
    });
    const skillRows = Object.entries(bySkill).map(([id,x]) => {
      const sc = Math.round(x.correct/x.total*100);
      return `<div class="boss-skill"><span>${esc(GAME.skills[id]?.short || id)}</span><b>${sc}</b><i><em style="width:${sc}%"></em></i></div>`;
    }).join('');
    const decisionRows = result.answers.map(a => `<div class="deal-log-row"><span>${a.ok ? '✓' : '×'} ${esc(a.label)}</span><b>${a.impact ? money(a.impact) : '—'}</b></div>`).join('');
    const starLine = Array.from({length:5},(_,i)=>`<span class="${i<stars?'lit':''}">★</span>`).join('');
    $('#bossStepText').textContent = 'Deal closed';
    $('#bossProgressFill').style.width = '100%';
    $('.boss-progress')?.setAttribute('aria-valuenow','100');
    $('#bossFeedback').className = 'boss-feedback'; $('#bossFeedback').innerHTML = '';
    const label = isDaily ? 'Daily deal complete' : (cleared ? 'Boss cleared' : 'Deal review');
    const rewardCopy = gained ? `+${gained}` : '—';
    const replayNote = isDaily && !firstDaily ? '<p class="boss-note">Daily completion XP is awarded once per day. Replays still train your desk skills and can improve today’s score.</p>' : '';
    $('#bossBody').innerHTML = `<section class="boss-result">
      <span class="eyebrow">${label}</span><h1>${esc(d.title)}</h1>
      <div class="boss-stars" aria-label="${stars} out of 5 stars">${starLine}</div>
      <div class="boss-result-pnl"><span>Simulated desk P&amp;L</span><b class="${result.pnl >= 0 ? 'positive' : 'negative'}">${money(result.pnl)}</b><small>Started at ${money(d.basePnl)} theoretical gross P&amp;L</small></div>
      <div class="boss-summary-grid"><div><b>${acc}%</b><span>Decision score</span></div><div><b>${correct}/${total}</b><span>Correct</span></div><div><b>${rewardCopy}</b><span>XP</span></div></div>
      <section class="boss-breakdown"><h3>Desk capability</h3>${skillRows}</section>
      <section class="deal-log"><div class="deal-log-row head"><span>Decision log</span><b>P&amp;L impact</b></div>${decisionRows}</section>
      <p class="boss-note">The P&amp;L is a training simulation: it shows how the decisions in this scenario affect the economics, not a market forecast.</p>${replayNote}
      <button id="bossAgain" class="btn primary wide">${isDaily ? 'Run today’s deal again' : 'Run a fresh version'}</button><button id="bossBack" class="link-btn">Back to Trading Floor</button>
    </section>`;
    const id = d.id;
    boss = null;
    $('#bossAgain').addEventListener('click', () => isDaily ? startDaily() : startBoss(id));
    $('#bossBack').addEventListener('click', () => show('playScreen'));
    if ((isDaily && firstDaily) || (!isDaily && cleared)) confetti(stars === 5 ? 70 : 45);
  }

  function quitBoss() { boss = null; show('playScreen'); }

  /* ── Flash Trading ───────────────────────────────────────────────── */
  let flash = null;
  function startFlash() {
    if (!GAME.randomFlash) return;
    clearInterval(flash?.timer);
    flash = { started:Date.now(), seconds:60, score:0, combo:0, correct:0, total:0, question:null, locked:false, timer:null };
    $('#flashTime').textContent = '60'; $('#flashScore').textContent = '0'; $('#flashCombo').textContent = '×0';
    $('#flashFeedback').textContent = '';
    show('flashScreen');
    nextFlashQuestion();
    flash.timer = setInterval(() => {
      if (!flash) return;
      const left = Math.max(0, 60 - Math.floor((Date.now() - flash.started) / 1000));
      flash.seconds = left; $('#flashTime').textContent = String(left);
      $('#flashTime').parentElement?.classList.toggle('danger', left <= 10);
      if (left <= 0) finishFlash(true);
    }, 250);
  }

  function nextFlashQuestion() {
    if (!flash) return;
    flash.question = GAME.randomFlash(); flash.locked = false;
    const q = flash.question, host = $('#flashBody');
    const tag = GAME.skills[q.skill]?.short || 'Trading';
    if (q.type === 'choice') {
      host.innerHTML = `<article class="flash-question"><span class="q-kicker">${esc(tag)} · quick decision</span><h2>${esc(q.prompt)}</h2>
        <div class="flash-options">${q.options.map((o,i) => `<button class="flash-opt" data-flash-choice="${i}">${esc(o)}</button>`).join('')}</div></article>`;
      $$('[data-flash-choice]', host).forEach(b => b.addEventListener('click', () => answerFlash(Number(b.dataset.flashChoice))));
    } else {
      host.innerHTML = `<article class="flash-question"><span class="q-kicker">${esc(tag)} · mental maths</span><h2>${esc(q.prompt)}</h2>
        <div class="flash-input"><input id="flashInput" type="number" inputmode="decimal" autocomplete="off" aria-label="Your answer" placeholder="Answer"/><span>${esc(q.unit || '')}</span></div>
        <button id="flashSubmit" class="btn primary wide">Submit</button></article>`;
      $('#flashSubmit').addEventListener('click', () => answerFlash($('#flashInput').value));
      $('#flashInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); answerFlash(e.currentTarget.value); } });
      setTimeout(() => $('#flashInput')?.focus(), 0);
    }
  }

  function answerFlash(value) {
    if (!flash || flash.locked) return;
    const q = flash.question;
    if (q.type === 'numeric' && String(value).trim() === '') return;
    flash.locked = true; flash.total++;
    const ok = q.type === 'choice'
      ? Number(value) === q.answer
      : Number.isFinite(Number(value)) && Math.abs(Number(value) - q.answer) <= (q.tolerance || 0);
    const fb = $('#flashFeedback');
    if (ok) {
      flash.correct++; flash.combo++;
      const points = 10 + Math.min(20, Math.max(0, flash.combo - 1) * 2);
      flash.score += points;
      const sid = q.skill; if (sid) state.skillXp[sid] = (Number(state.skillXp[sid]) || 0) + 1;
      fb.className = 'flash-feedback good'; fb.textContent = `Correct · +${points}`;
    } else {
      flash.combo = 0;
      fb.className = 'flash-feedback bad'; fb.textContent = `Not quite · ${q.why}`;
    }
    $('#flashScore').textContent = flash.score; $('#flashCombo').textContent = `×${flash.combo}`;
    setTimeout(() => { if (flash) { fb.textContent = ''; fb.className = 'flash-feedback'; nextFlashQuestion(); } }, ok ? 320 : 850);
  }

  function finishFlash(completed) {
    if (!flash) return;
    clearInterval(flash.timer);
    const result = { ...flash }; flash = null;
    const gained = completed ? Math.max(5, Math.round(result.score / 10)) : 0;
    if (completed) {
      state.flash.plays = (state.flash.plays || 0) + 1;
      state.flash.correct = (state.flash.correct || 0) + result.correct;
      state.flash.total = (state.flash.total || 0) + result.total;
      state.flash.best = Math.max(state.flash.best || 0, result.score);
      state.xp = (state.xp || 0) + gained;
      ensureDaily();
      state.daily.flashBest = Math.max(Number(state.daily.flashBest)||0, result.score);
      state.daily.flashCorrect = (Number(state.daily.flashCorrect)||0) + result.correct;
      touchStreak(); save();
    }
    if (!completed) { show('playScreen'); return; }
    const acc = result.total ? Math.round(result.correct / result.total * 100) : 0;
    $('#flashBody').innerHTML = `<section class="flash-result"><div class="flash-trophy">⚡</div><span class="eyebrow">Run complete</span><h1>${result.score}</h1><p>points</p>
      <div class="profile-numbers"><div><b>${result.correct}/${result.total}</b><span>Correct</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>+${gained}</b><span>XP</span></div></div>
      <button id="flashAgain" class="btn primary wide">Play again</button><button id="flashBack" class="link-btn">Back to Play</button></section>`;
    $('#flashFeedback').textContent = '';
    $('#flashAgain').addEventListener('click', startFlash);
    $('#flashBack').addEventListener('click', () => show('playScreen'));
    if (result.score >= (state.flash.best || 0)) confetti(50);
  }

  /* ── agganci ─────────────────────────────────────────────────────── */
  $('#checkButton').addEventListener('click', onCheck);
  $('#revealButton')?.addEventListener('click', rivela);
  $('#flashStart')?.addEventListener('click', startFlash);
  $('#frontierStart')?.addEventListener('click', startFrontier);
  $('#dailyStart')?.addEventListener('click', startDaily);
  $('#flashQuit')?.addEventListener('click', () => finishFlash(false));
  $('#bossQuit')?.addEventListener('click', quitBoss);
  $('#bossBrowse')?.addEventListener('click', () => $('#bossShelf')?.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block:'start' }));
  $$('.nav-item').forEach(b => b.addEventListener('click', () => show(b.dataset.screen)));
  $('#continueButton').addEventListener('click', () => { show(doneReturnScreen); if (doneReturnScreen === 'pathScreen') renderPath(); });
  $('#quitButton').addEventListener('click', () => { const target = run?.mode === 'frontier' ? 'playScreen' : 'pathScreen'; run = null; show(target); if (target === 'pathScreen') renderPath(); });
  $('#resetButton').addEventListener('click', () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    state = defaultState(); save(); renderPath();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && $('#lessonScreen').classList.contains('active') && !$('#checkButton').disabled) {
      if (document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); onCheck(); }
    }
  });

  renderPath();
  avviaOrologioVite();

  // se la scheda è rimasta in secondo piano per ore, al rientro il fondo
  // va ricalcolato subito: l'intervallo può essere stato messo in pausa
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const prima = limitaVite(state.lives);
    if (livesNow() !== prima) { save(); renderPath(); }
    renderStatLives();
  });

  // arrivo dal glossario: ?lesson=u4l3 apre quella lezione se è sbloccata,
  // altrimenti evidenzia il nodo sul percorso senza forzare niente
  (function daLink() {
    let id = null;
    try { id = new URLSearchParams(location.search).get('lesson'); } catch (e) {}
    if (!id || !allLessons.some(l => l.id === id)) return;
    if (isUnlocked(id)) { startLesson(id); return; }
    const nodo = $(`[data-lesson="${id}"]`);
    if (nodo) {
      nodo.classList.add('flagged');
      nodo.setAttribute('aria-describedby', 'lockedHint');
      try { nodo.scrollIntoView({ block: 'center', behavior: motionOK() ? 'smooth' : 'auto' }); } catch (e) {}
      const hint = $('#lockedHint');
      if (hint) { hint.hidden = false; hint.textContent = 'That lesson is still locked — it comes after the ones above.'; }
    }
  })();

  window.__LEARN__ = { get state(){return state;}, get run(){return run;}, startLesson, onCheck, renderPath,
    startReview, startCheckpoint, reviewItems, checkpointItems, dueCount, exKey, unitDone,
    allLessons, UNITS, CHECK_PASS, REVIEW_SIZE, CHECK_SIZE, HEARTS, CHECK_HEARTS,
    rivela, puoRivelare, renderRivela, livesNow, spendiVita, forseGuadagnaVita,
    maturaVite, attesaVita, testoAttesa, renderStatLives, avviaOrologioVite, fermaOrologioVite,
    MAX_LIVES, STREAK_PER_LIFE, CHECK_MIN_LIVES, LIFE_REGEN_MS,
    replaceState, defaultState, STORAGE_KEY: KEY, SOGLIE, renderStreak, isUnlocked, isApertura, SANDBOX,
    careerRank, careerLevel, skillScore, startFlash, finishFlash, get flash(){return flash;}, startFrontier, unlockedMasteryWorlds,
    startBoss, startDaily, finishBoss, quitBoss, get boss(){return boss;}, ensureDaily, dailyQuests, claimDailyQuest, localDayKey,
    ensureCompetitive, leagueScore, leagueEntry, renderLeagueHub, unlockedAchievements, save, GAME, COMP };
})();
