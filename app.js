/* World of Trade — Learn · motore
   Percorso → lezione → esercizio → feedback → progresso.
   Nessun framework, tutto lato client, salvataggio in localStorage.
*/
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const KEY = 'wot-learn-v1';
  const HEARTS = 3;
  const CHECK_HEARTS = 5;
  const SOGLIE = [5, 10, 15, 20, 30, 50, 75, 100];   // dove la serie si festeggia
  const XP_PER = 10;

  const UNITS = window.CURRICULUM || [];
  const allLessons = UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id })));

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
  });
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      const obj = v => (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
      // i salvataggi piu' vecchi non hanno questi campi: vanno ricostruiti, non assunti
      return { ...defaultState(), ...s,
        done: Array.isArray(s.done) ? s.done : [],
        best: obj(s.best), misses: obj(s.misses), doneAt: obj(s.doneAt), badges: obj(s.badges),
        reviews: Number(s.reviews) || 0, updatedAt: Number(s.updatedAt) || 0,
        streakNow: Number(s.streakNow) || 0, streakBest: Number(s.streakBest) || 0 };
    } catch (e) { return defaultState(); }
  }
  function save() {
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    // chi sincronizza col cloud ascolta questo, senza che il motore lo sappia
    try { window.dispatchEvent(new CustomEvent('wot:saved', { detail: { state } })); } catch (e) {}
  }

  // usata dal livello di sincronizzazione dopo aver fuso locale e remoto
  function replaceState(next) {
    if (!next || typeof next !== 'object') return false;
    state = { ...defaultState(), ...next,
      done: Array.isArray(next.done) ? next.done.filter(id => allLessons.some(l => l.id === id)) : [] };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    _lastXp = null;
    renderPath();
    return true;
  }

  function touchStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastDay === today) return;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    state.streak = state.lastDay === yesterday ? (state.streak || 0) + 1 : 1;
    state.lastDay = today;
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

  /* ── navigazione fra schermate ───────────────────────────────────── */
  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    window.scrollTo(0, 0);
  }

  /* ── schermata percorso ──────────────────────────────────────────── */
  let _lastXp = null;
  function renderPath() {
    const xpEl = $('#statXp'), stEl = $('#statStreak');
    stEl.textContent = state.streak || 0;
    if (_lastXp !== null && state.xp > _lastXp) { countUp(xpEl, state.xp); bump(xpEl.parentElement); }
    else xpEl.textContent = state.xp || 0;
    _lastXp = state.xp || 0;
    const next = nextLessonId();
    const greetHost = $('#pathGreet');
    if (greetHost && window.MASCOT) {
      const done = state.done.length;
      const line = done === 0
        ? 'I’m Hélène. I ran a metals desk for eleven years. Let’s start with what a trade actually is.'
        : done < allLessons.length
          ? `${done} lesson${done === 1 ? '' : 's'} down. The next one builds on the last, so keep going.`
          : 'You’ve finished the course. Come back to the ones you rushed — the numbers stick better the second time.';
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
      $('#courseLabel').textContent = `${doneN} of ${total} lessons`;
      $('#coursePct').textContent = `${pct}%`;
      $('#courseFill').style.width = pct + '%';
      const track = $('#courseTrack');
      if (track) {
        track.setAttribute('aria-valuenow', String(pct));
        track.setAttribute('aria-valuetext', `${doneN} of ${total} lessons complete`);
      }
    }

    $('#pathBody').innerHTML = UNITS.map((u, ui) => {
      const nodes = u.lessons.map((l, li) => {
        const done = isDone(l.id);
        const isNext = l.id === next;
        const locked = !done && !isNext;
        const cls = done ? 'done' : isNext ? 'next' : 'locked';
        const medal = done ? '✓' : locked ? '🔒' : String(li + 1);
        const acc = state.best[l.id];
        const weak = l.exercises.reduce((n, _, i) => n + (state.misses[exKey(l.id, i)] > 0 ? 1 : 0), 0);
        return `${li ? '<div class="connector"></div>' : ''}
          <button class="node ${cls}${done && weak ? ' weak' : ''}" data-lesson="${esc(l.id)}" ${locked ? 'disabled aria-disabled="true"' : ''}>
            ${isNext ? '<span class="tag">Start</span>' : ''}
            <span class="medal" aria-hidden="true">${medal}</span>
            <span><strong>${esc(l.title)}</strong>
              <small>${done
                ? (weak ? `${weak} to review` : `Completed · ${acc != null ? acc + '% accuracy' : 'done'}`)
                : locked ? 'Locked' : `${l.exercises.length} questions`}</small></span>
          </button>`;
      }).join('');
      const badge = state.badges[u.id];
      const ready = unitDone(u);
      return `<section class="unit">
        <div class="unit-head">
          <span class="n">Unit ${ui + 1}</span>
          ${badge ? `<span class="unit-badge" title="Checkpoint passed">★ ${badge}%</span>` : ''}
          <h2>${esc(u.title)}</h2>
          <p>${esc(u.subtitle)}</p>
        </div>
        <div class="nodes">${nodes}</div>
        ${ready ? `<button class="checkpoint" data-check="${esc(u.id)}">
          ${badge ? 'Retake the checkpoint' : 'Take the checkpoint'}
          <small>${CHECK_SIZE} questions across the unit · ${CHECK_HEARTS} lives · ${CHECK_PASS}% to pass</small>
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
      hearts: cfg.hearts || HEARTS,
      maxHearts: cfg.hearts || HEARTS,
      current: null,
      state: 'answering',
    };
    const b = $('#runBanner');
    if (b) { b.textContent = run.banner; b.hidden = !run.banner; }
    show('lessonScreen');
    renderStreak(false);
    nextExercise();
  }

  function startLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;
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
    if (appenaGiusta && SOGLIE.includes(n)) festeggia(n);
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
  function renderHearts() {
    const max = run.maxHearts || HEARTS;
    const host = $('#hearts');
    host.setAttribute('aria-label', `${run.hearts} of ${max} lives left`);
    host.innerHTML = Array.from({ length: max }, (_, i) =>
      `<span class="h ${i < run.hearts ? '' : 'gone'}" aria-hidden="true">●</span>`).join('');
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
    if (ok && !run.current.retry) {
      state.streakNow = (state.streakNow || 0) + 1;
      if (state.streakNow > (state.streakBest || 0)) state.streakBest = state.streakNow;
    } else if (!ok) {
      state.streakNow = 0;
    }
    if (ok) {
      run.correct++;
      if (!run.current.retry) run.firstTry++;
      // preso al primo colpo: l'esercizio esce dalla lista dei debiti
      if (key && !run.current.retry && state.misses[key]) {
        state.misses[key]--;
        if (state.misses[key] <= 0) delete state.misses[key];
        save();
      }
    } else {
      run.hearts--;
      if (key) { state.misses[key] = (state.misses[key] || 0) + 1; save(); }
      run.queue.push({ ...run.current, retry: true });   // l'errore torna
      renderHearts();
    }
    markAnswers(ex, ok);
    const fb = $('#feedback');
    fb.className = `feedback ${ok ? 'good' : 'bad'}`;
    const M = window.MASCOT;
    fb.innerHTML = `<div class="fb-inner">
        <div class="fb-face">${M ? M.svg(ok ? 'happy' : 'oops', 74) : ''}</div>
        <div class="fb-copy">
          <div class="fb-head">${esc(M ? M.name : '')} <em>${esc(M ? (ok ? M.praise() : M.miss()) : (ok ? 'Correct' : 'Not quite'))}</em></div>
          <p>${esc(ex.why || '')}</p>
        </div>
      </div>`;
    fb.hidden = false;
    const btn = $('#checkButton');
    btn.disabled = false;
    btn.className = `btn ${ok ? 'go' : 'stop'}`;
    btn.textContent = run.hearts <= 0 ? 'Out of lives' : (run.queue.length ? 'Continue' : 'Finish');
    if (!ok) { const h = $('#hearts'); h.classList.remove('lost'); void h.offsetWidth; h.classList.add('lost'); }
    renderStreak(ok);
    renderProgress();
    if (run.hearts <= 0) setTimeout(() => failRun(), 900);
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
    run = null;
    show('doneScreen');
  }

  /* ── agganci ─────────────────────────────────────────────────────── */
  $('#checkButton').addEventListener('click', onCheck);
  $('#continueButton').addEventListener('click', () => { show('pathScreen'); renderPath(); });
  $('#quitButton').addEventListener('click', () => { run = null; show('pathScreen'); renderPath(); });
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
  window.__LEARN__ = { get state(){return state;}, get run(){return run;}, startLesson, onCheck, renderPath,
    startReview, startCheckpoint, reviewItems, checkpointItems, dueCount, exKey, unitDone,
    allLessons, UNITS, CHECK_PASS, REVIEW_SIZE, CHECK_SIZE, HEARTS, CHECK_HEARTS,
    replaceState, defaultState, STORAGE_KEY: KEY, SOGLIE, renderStreak };
})();
