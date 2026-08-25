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
  const defaultState = () => ({ done: [], xp: 0, streak: 0, lastDay: null, best: {} });
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      return { ...defaultState(), ...s, done: Array.isArray(s.done) ? s.done : [] };
    } catch (e) { return defaultState(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

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
    $('#pathBody').innerHTML = UNITS.map((u, ui) => {
      const nodes = u.lessons.map((l, li) => {
        const done = isDone(l.id);
        const isNext = l.id === next;
        const locked = !done && !isNext;
        const cls = done ? 'done' : isNext ? 'next' : 'locked';
        const medal = done ? '✓' : locked ? '🔒' : String(li + 1);
        const acc = state.best[l.id];
        return `${li ? '<div class="connector"></div>' : ''}
          <button class="node ${cls}" data-lesson="${esc(l.id)}" ${locked ? 'disabled aria-disabled="true"' : ''}>
            ${isNext ? '<span class="tag">Start</span>' : ''}
            <span class="medal" aria-hidden="true">${medal}</span>
            <span><strong>${esc(l.title)}</strong>
              <small>${done && acc != null ? `Completed · ${acc}% accuracy` : locked ? 'Locked' : `${l.exercises.length} questions`}</small></span>
          </button>`;
      }).join('');
      return `<section class="unit">
        <div class="unit-head">
          <span class="n">Unit ${ui + 1}</span>
          <h2>${esc(u.title)}</h2>
          <p>${esc(u.subtitle)}</p>
        </div>
        <div class="nodes">${nodes}</div>
      </section>`;
    }).join('');
    $$('[data-lesson]').forEach(b => b.addEventListener('click', () => {
      if (!b.disabled) startLesson(b.dataset.lesson);
    }));
  }

  /* ── esecuzione della lezione ────────────────────────────────────── */
  let run = null;

  function startLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    run = {
      lesson,
      queue: lesson.exercises.map((e, i) => ({ ex: e, i })),
      total: lesson.exercises.length,
      answered: 0,
      correct: 0,
      firstTry: 0,
      hearts: HEARTS,
      current: null,
      state: 'answering',
    };
    show('lessonScreen');
    nextExercise();
  }

  function nextExercise() {
    if (!run) return;
    if (!run.queue.length) return finishLesson();
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

  function renderProgress() {
    const pct = run.total ? (run.answered / run.total) * 100 : 0;
    $('#lessonProgress').style.width = `${Math.min(100, pct)}%`;
  }
  function renderHearts() {
    $('#hearts').innerHTML = Array.from({ length: HEARTS }, (_, i) =>
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
      if (run.pairState.selLeft === idx) {
        left.classList.remove('sel'); left.classList.add('matched'); b.classList.add('matched');
        run.pairState.matched.push(idx);
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
    const bank = ex.sentence.slice(1).concat(ex.distractors || []);
    // mescolamento deterministico
    bank.sort((a, b) => (a.length % 7) - (b.length % 7) || a.localeCompare(b));
    run.built = [ex.sentence[0]];
    const draw = () => {
      host.innerHTML = `<div class="tiles" id="builtZone">${run.built.map((t, i) =>
        `<button class="tile" data-rm="${i}" ${i === 0 ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div>
        <div class="bank">${bank.filter(t => !run.built.includes(t)).map(t =>
        `<button class="tile" data-add="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
      $$('[data-add]', host).forEach(b => b.addEventListener('click', () => {
        if (run.state !== 'answering') return;
        run.built.push(b.dataset.add); draw();
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
    if (ex.type === 'build') return run.built.join(' ') === ex.sentence.join(' ');
    return false;
  }

  function onCheck() {
    if (!run) return;
    if (run.state === 'feedback') { nextExercise(); return; }
    const ex = run.current.ex;
    const ok = evaluate(ex);
    run.state = 'feedback';
    run.answered++;
    if (ok) { run.correct++; if (!run.current.retry) run.firstTry++; }
    else {
      run.hearts--;
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
    renderProgress();
    if (run.hearts <= 0) setTimeout(() => failLesson(), 900);
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

  function failLesson() {
    run = null;
    show('pathScreen');
    renderPath();
  }

  function finishLesson() {
    const lesson = run.lesson;
    const acc = run.answered ? Math.round((run.firstTry / run.total) * 100) : 0;
    const gained = XP_PER + Math.round(XP_PER * (acc / 100));
    if (!isDone(lesson.id)) state.done.push(lesson.id);
    state.best[lesson.id] = Math.max(state.best[lesson.id] || 0, acc);
    state.xp = (state.xp || 0) + gained;
    touchStreak();
    save();
    $('#doneTitle').textContent = lesson.title;
    $('#doneGoal').textContent = lesson.goal || '';
    const crest = $('.done-crest');
    if (crest && window.MASCOT) crest.innerHTML = window.MASCOT.svg('happy', 128);
    countUp($('#doneXp'), gained, '+');
    countUp($('#doneAcc'), acc, '', '%');
    confetti(acc === 100 ? 60 : 40);
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
  window.__LEARN__ = { get state(){return state;}, get run(){return run;}, startLesson, onCheck, renderPath, allLessons, UNITS };
})();
