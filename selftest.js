/* World of Trade — autodiagnosi nel browser reale.
   Esiste perché la suite in Node non vede il rendering: una volta una regola CSS
   ha annullato l'attributo `hidden` e il pannello di accesso copriva l'app,
   con tutti i test verdi. Qui si controlla ciò che solo un browser sa. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esiti = [];
  let gruppo = '';

  const G = n => { gruppo = n; };
  const ok = (nome, dettaglio = '') => esiti.push({ gruppo, nome, stato: 'ok', dettaglio });
  const ko = (nome, dettaglio = '') => esiti.push({ gruppo, nome, stato: 'ko', dettaglio });
  const t  = (nome, cond, dettaglio = '') => (cond ? ok : ko)(nome, dettaglio);
  const skip = (nome, perche) => esiti.push({ gruppo, nome, stato: 'skip', dettaglio: perche });

  /* ── contrasto: risale gli antenati finché trova uno sfondo opaco ── */
  function rgb(s) {
    const m = /rgba?\(([^)]+)\)/.exec(s || '');
    if (!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const mix = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
  });
  function sfondoEffettivo(el, win) {
    let n = el, acc = null;
    while (n && n.nodeType === 1) {
      const c = rgb(win.getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? mix(acc, c) : c;
        if (acc.a >= 1 || c.a >= 1) return acc;
      }
      n = n.parentElement;
    }
    return acc || { r: 7, g: 22, b: 52, a: 1 };
  }
  function rapporto(el, win) {
    const st = win.getComputedStyle(el);
    const fg = rgb(st.color);
    if (!fg) return null;
    const bg = sfondoEffettivo(el, win);
    const f = fg.a < 1 ? mix(fg, bg) : fg;
    const l1 = Math.max(lum(f), lum(bg)), l2 = Math.min(lum(f), lum(bg));
    return { r: (l1 + 0.05) / (l2 + 0.05), size: parseFloat(st.fontSize), weight: st.fontWeight };
  }
  // WCAG: 3:1 basta per testo grande (24px, o 18.66px in grassetto)
  const soglia = (size, weight) =>
    (size >= 24 || (size >= 18.66 && (weight === 'bold' || +weight >= 700))) ? 3 : 4.5;

  /* ── utilità ── */
  const visibile = (el, win) => {
    const st = win.getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const testo = el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48);
  const attendi = ms => new Promise(r => setTimeout(r, ms));

  /* ── i controlli ─────────────────────────────────────────────────── */
  async function esegui() {
    esiti.length = 0;

    /* 1 · ambiente */
    G('Environment');
    t('the page is served over http(s), not opened from a file',
      location.protocol.startsWith('http'),
      location.protocol + ' — service worker and iframes need a server');
    try {
      localStorage.setItem('__st', '1'); localStorage.removeItem('__st');
      ok('localStorage is writable');
    } catch (e) { ko('localStorage is writable', 'private mode? progress cannot be saved: ' + e.message); }

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
      const ha = document.fonts.check('700 20px Fredoka');
      t('the Fredoka webfont loaded', ha, ha ? '' : 'falling back to a system font — the app will look different');
    } else skip('the Fredoka webfont loaded', 'this browser does not expose document.fonts');

    try {
      const c = document.createElement('canvas');
      c.width = c.height = 8;
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, 8, 8);
      const dati = c.toDataURL('image/png');
      t('canvas works, so the share card can be built',
        typeof dati === 'string' && dati.startsWith('data:image/png') && dati.length > 100);
    } catch (e) { ko('canvas works, so the share card can be built', e.message); }

    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations().catch(() => []);
      t('a service worker is registered', regs.length > 0,
        regs.length ? '' : 'open the app once first, then come back here');
      if (window.caches) {
        const chiavi = await caches.keys().catch(() => []);
        const nostre = chiavi.filter(k => k.startsWith('wot-learn-'));
        t('exactly one cache version is present', nostre.length <= 1,
          nostre.join(', ') || 'none yet');
      }
    } else skip('a service worker is registered', 'not supported in this browser');

    /* 2 · l'app dentro un iframe, con salvataggio separato */
    G('The app');
    const frame = $('#stFrame');
    const pronta = new Promise(res => { frame.onload = () => res(true); setTimeout(() => res(false), 12000); });
    frame.src = 'learn.html?sandbox=1&t=' + Date.now();
    const caricata = await pronta;
    t('the app loads', caricata);
    if (!caricata) return;
    const w = frame.contentWindow, d = w.document;
    await attendi(500);

    const L = w.__LEARN__;
    t('the engine started', !!L, L ? '' : 'app.js did not run — check the console');
    if (!L) return;
    t('it is using the scratch save, not yours', L.STORAGE_KEY === 'wot-learn-selftest', L.STORAGE_KEY);
    t('the curriculum loaded', L.allLessons.length === 173, L.allLessons.length + ' lessons');
    t('the path drew every lesson', d.querySelectorAll('.node').length === 103,
      d.querySelectorAll('.node').length + ' nodes');
    t('Hélène is on the path', !!d.querySelector('#pathGreet svg'));
    t('five main game tabs are present', d.querySelectorAll('.nav-item').length === 5,
      d.querySelectorAll('.nav-item').length + ' tabs');
    const lb = d.querySelector('[data-screen="leagueScreen"]');
    if (lb) {
      lb.click(); await attendi(80);
      t('League screen opens', d.querySelector('#leagueScreen')?.classList.contains('active'));
      t('League renders 6 Trading Houses', d.querySelectorAll('.house-choice').length === 6,
        d.querySelectorAll('.house-choice').length + ' houses');
      t('League renders 18 achievements', d.querySelectorAll('.achievement').length === 18,
        d.querySelectorAll('.achievement').length + ' achievements');
      d.querySelector('[data-screen="pathScreen"]')?.click(); await attendi(40);
    }
    const marchio = d.querySelector('.brand');
    t('the logo actually loaded', !!marchio && marchio.complete && marchio.naturalWidth > 0,
      marchio ? `${marchio.naturalWidth}×${marchio.naturalHeight}` : 'missing');

    /* 3 · niente deve coprire l'app — il bug di oggi */
    G('Nothing is covering the app');
    const nascosti = [...d.querySelectorAll('[hidden]')];
    const visibiliPerSbaglio = nascosti.filter(el => w.getComputedStyle(el).display !== 'none');
    t('every element marked hidden really is hidden', visibiliPerSbaglio.length === 0,
      visibiliPerSbaglio.map(el => (el.id || el.className) + ' → display:' +
        w.getComputedStyle(el).display).join(' · '));
    for (const id of ['cloudDialog', 'shareDialog']) {
      const el = d.getElementById(id);
      if (!el) continue;
      t(`the ${id === 'cloudDialog' ? 'sign-in' : 'share'} panel is not on screen`,
        !visibile(el, w), visibile(el, w) ? 'it is covering the app' : '');
    }
    const cx = Math.round(w.innerWidth / 2), cy = Math.round(w.innerHeight / 2);
    const sopra = d.elementFromPoint(cx, cy);
    t('the middle of the screen is the course, not an overlay',
      !!sopra && !sopra.closest('.cloud-dialog'),
      sopra ? (sopra.closest('.cloud-dialog') ? 'a dialog is on top' : (sopra.tagName + '.' + (sopra.className || '')).slice(0, 60)) : 'nothing there');

    /* 4 · layout su schermo stretto */
    G('Layout at 390px wide (a phone)');
    t('the page does not scroll sideways',
      d.documentElement.scrollWidth <= w.innerWidth + 1,
      `${d.documentElement.scrollWidth}px of content in ${w.innerWidth}px`);
    const troppoLarghi = [...d.querySelectorAll('.wrap *')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.right > w.innerWidth + 1;
    });
    t('nothing sticks out past the right edge', troppoLarghi.length === 0,
      troppoLarghi.slice(0, 3).map(el => (el.tagName + '.' + el.className).slice(0, 40)).join(' · '));
    const tagliati = [...d.querySelectorAll('.node strong, .node small, .unit-head h2, h1')]
      .filter(el => el.scrollWidth > el.clientWidth + 2);
    t('no text is clipped inside its box', tagliati.length === 0,
      tagliati.slice(0, 3).map(el => testo(el)).join(' · '));

    /* 5 · si può toccare */
    G('Tap targets');
    const cliccabili = [...d.querySelectorAll('button, a[href], input, select')]
      .filter(el => visibile(el, w));
    const piccoli = cliccabili.filter(el => {
      const r = el.getBoundingClientRect();
      return r.height < 44 || r.width < 24;
    });
    t('every control is at least 44px tall', piccoli.length === 0,
      piccoli.slice(0, 4).map(el => {
        const r = el.getBoundingClientRect();
        return `${testo(el) || el.id || el.className} ${Math.round(r.width)}×${Math.round(r.height)}`;
      }).join(' · '));

    /* 6 · contrasto, calcolato sui colori veri */
    G('Contrast, measured on real colours');
    function controllaContrasto(radice, etichetta) {
      const elementi = [...radice.querySelectorAll('*')].filter(el =>
        visibile(el, w) &&
        [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
      const bassi = [];
      for (const el of elementi) {
        const r = rapporto(el, w);
        if (!r) continue;
        const s = soglia(r.size, r.weight);
        if (r.r < s) bassi.push(`${testo(el) || el.tagName} ${r.r.toFixed(2)}:1 (serve ${s})`);
      }
      t(`${etichetta}: every piece of text is readable`, bassi.length === 0,
        bassi.slice(0, 5).join(' · ') + (bassi.length > 5 ? ` · +${bassi.length - 5}` : ''));
      return bassi.length;
    }
    controllaContrasto(d.querySelector('#pathScreen'), 'The path');

    /* 7 · una lezione vera, giocata davvero */
    G('Playing a lesson');
    const primo = d.querySelector('.node.next');
    t('there is a lesson to start', !!primo);
    if (primo) {
      primo.click();
      await attendi(320);
      t('the lesson screen opens', d.querySelector('#lessonScreen').classList.contains('active'));
      const ex = L.run && L.run.current && L.run.current.ex;
      t('an exercise is showing', !!ex && !!d.querySelector('#exerciseArea').textContent.trim());
      controllaContrasto(d.querySelector('#lessonScreen'), 'A lesson');

      if (ex && ex.type === 'choice') {
        const opt = d.querySelectorAll('.opt');
        t('the answers are on screen', opt.length >= 3, opt.length + ' options');
        opt[ex.answer]?.click();
        await attendi(60);
        const check = d.querySelector('#checkButton');
        t('the Check button becomes usable once you pick', !check.disabled);
        check.click();
        await attendi(320);
        const fb = d.querySelector('#feedback');
        t('the explanation appears', !fb.hidden && visibile(fb, w) && fb.textContent.trim().length > 30,
          testo(fb));
        t('Hélène reacts', !!fb.querySelector('svg'));
        const fbr = fb.getBoundingClientRect();
        t('the explanation is inside the screen, not off the bottom',
          fbr.top < w.innerHeight && fbr.bottom > 0,
          `top ${Math.round(fbr.top)} · viewport ${w.innerHeight}`);
        controllaContrasto(fb, 'The feedback');
        const bottone = d.querySelector('#checkButton').getBoundingClientRect();
        t('the Continue button is reachable without scrolling',
          bottone.bottom <= w.innerHeight + 1,
          `bottom ${Math.round(bottone.bottom)} · viewport ${w.innerHeight}`);
      } else skip('answering an exercise', 'the first exercise is not multiple choice');
    }

    /* 8 · lo sfondo non deve intercettare i clic */
    G('The background');
    const bg = d.querySelector('svg.backdrop');
    t('the port scene is there', !!bg);
    if (bg) {
      t('it is invisible to screen readers', bg.getAttribute('aria-hidden') === 'true');
      t('it does not swallow clicks', w.getComputedStyle(bg).pointerEvents === 'none',
        w.getComputedStyle(bg).pointerEvents);
      t('it sits behind the content', +w.getComputedStyle(bg).zIndex < 0,
        w.getComputedStyle(bg).zIndex);
    }

    /* 9 · pulizia */
    G('Cleanup');
    try {
      localStorage.removeItem('wot-learn-selftest');
      ok('the scratch save was removed', 'your real progress was never touched');
    } catch (e) { ko('the scratch save was removed', e.message); }
  }

  /* ── resa a schermo ──────────────────────────────────────────────── */
  function disegna(inCorso) {
    const gruppi = [];
    esiti.forEach(e => {
      let g = gruppi.find(x => x.nome === e.gruppo);
      if (!g) gruppi.push(g = { nome: e.gruppo, righe: [] });
      g.righe.push(e);
    });
    const esc = v => String(v ?? '').replace(/[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    $('#stBody').innerHTML = gruppi.map(g => `<section class="st-group">
      <h2>${esc(g.nome)}</h2>
      ${g.righe.map(r => `<div class="st-row ${r.stato}">
        <span class="st-ico" aria-hidden="true">${r.stato === 'ok' ? '✓' : r.stato === 'ko' ? '✗' : '–'}</span>
        <span class="st-name">${esc(r.nome)}
          ${r.dettaglio ? `<span class="st-detail">${esc(r.dettaglio)}</span>` : ''}</span>
      </div>`).join('')}
    </section>`).join('');

    const ko = esiti.filter(e => e.stato === 'ko').length;
    const okn = esiti.filter(e => e.stato === 'ok').length;
    const sk = esiti.filter(e => e.stato === 'skip').length;
    const sum = $('#stSum');
    sum.className = 'st-sum ' + (inCorso ? 'run' : ko ? 'ko' : 'ok');
    sum.textContent = inCorso ? 'Running…'
      : ko ? `${ko} problem${ko === 1 ? '' : 's'} found — ${okn} checks passed`
           : `All ${okn} checks passed${sk ? ` · ${sk} skipped` : ''}`;
  }

  function rapportoTesto() {
    const righe = [`World of Trade — self-check`,
      new Date().toISOString(),
      navigator.userAgent,
      `viewport ${window.innerWidth}×${window.innerHeight} · dpr ${window.devicePixelRatio}`,
      ''];
    let g = '';
    esiti.forEach(e => {
      if (e.gruppo !== g) { g = e.gruppo; righe.push('## ' + g); }
      righe.push(`${e.stato === 'ok' ? '[ok]  ' : e.stato === 'ko' ? '[FAIL]' : '[skip]'} ${e.nome}` +
        (e.dettaglio ? `\n        ${e.dettaglio}` : ''));
    });
    const ko = esiti.filter(e => e.stato === 'ko').length;
    righe.push('', ko ? `${ko} failed` : 'all passed');
    return righe.join('\n');
  }

  $('#stRun').addEventListener('click', async () => {
    const b = $('#stRun');
    b.disabled = true; b.textContent = 'Running…';
    disegna(true);
    try { await esegui(); }
    catch (e) { ko('the self-check itself crashed', (e && e.message) || String(e)); }
    disegna(false);
    b.disabled = false; b.textContent = 'Run again';
    const r = $('#stReport'), c = $('#stCopy');
    r.value = rapportoTesto(); r.hidden = false; c.hidden = false;
  });

  $('#stCopy').addEventListener('click', async () => {
    const c = $('#stCopy');
    try { await navigator.clipboard.writeText($('#stReport').value); c.textContent = 'Copied'; }
    catch (e) { $('#stReport').select(); c.textContent = 'Selected — press Ctrl+C'; }
    setTimeout(() => { c.textContent = 'Copy the report'; }, 2600);
  });
})();
