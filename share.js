/* World of Trade — Learn · condivisione di un risultato su LinkedIn
   LinkedIn accetta solo l'URL nel link di condivisione: testo, titolo e immagine
   del post non sono precompilabili (l'API che lo permetteva è dismessa dal 2018).
   Quindi: genero la card come immagine da allegare, copio il testo negli appunti,
   e apro il compositore. Le tre cose che l'utente non può fare da solo. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const SOGLIA = 5;                       // sotto questo non vale la pena vantarsi
  const W = 1200, H = 630;                // formato che LinkedIn non ritaglia

  const sito = () => (window.WOT_CLOUD?.siteUrl || location.origin).replace(/\/$/, '');

  function testoPost(n, lezioni) {
    return `${n} correct answers in a row on World of Trade.

It is a free app for learning physical commodity trading step by step — incoterms, quotational periods, basis, hedging, trade finance, freight and chartering, desk risk. ${lezioni} lessons, no account needed.

If you work in commodities, see how far you get: ${sito()}

#CommodityTrading #PhysicalCommodities #Shipping #TradeFinance #Hedging`;
  }

  /* ── la card ──────────────────────────────────────────────────────── */
  // lo stemma viene precaricato: se non è pronto la card si disegna senza,
  // invece di aspettare o di restare vuota
  const stemma = new Image();
  try { stemma.src = 'logo-crest-500.png'; } catch (e) {}

  function disegna(n) {
    let c, x;
    try {
      c = document.createElement('canvas');
      c.width = W; c.height = H;
      // getContext non restituisce null quando il canvas non c'è: lancia.
      // Senza immagine il resto della condivisione deve funzionare comunque.
      x = c.getContext('2d');
    } catch (e) { return null; }
    if (!x || typeof x.createLinearGradient !== 'function') return null;

    const F = (px, w = 400) => `${w} ${px}px Fredoka, "Segoe UI", system-ui, sans-serif`;

    // fondo
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0d2a5e'); g.addColorStop(.55, '#071634'); g.addColorStop(1, '#040d1f');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const alone = x.createRadialGradient(W * .5, -60, 0, W * .5, -60, W * .7);
    alone.addColorStop(0, 'rgba(42,95,191,.5)'); alone.addColorStop(1, 'rgba(42,95,191,0)');
    x.fillStyle = alone; x.fillRect(0, 0, W, H);

    // skyline del porto: bassa e confinata a destra, così non passa
    // mai sotto il testo di sinistra
    const base = H - 30;
    x.fillStyle = 'rgba(126,168,240,.15)';
    [[600, 74], [716, 62]].forEach(([px, h]) => {              // gru
      x.fillRect(px, base - h, 9, h); x.fillRect(px + 40, base - h, 9, h);
      x.fillRect(px - 46, base - h - 7, 140, 6);
      x.fillRect(px + 12, base - h - 24, 34, 18);
    });
    [[880, 44], [916, 50], [952, 44]].forEach(([px, h]) => {   // sili
      x.beginPath(); x.arc(px + 14, base - h, 14, Math.PI, 0); x.fill();
      x.fillRect(px, base - h, 28, h);
    });
    [[1020, 40, 52], [1096, 30, 40]].forEach(([px, r, h]) => { // serbatoi
      x.beginPath(); x.ellipse(px + r, base - h, r, 7, 0, 0, Math.PI * 2); x.fill();
      x.fillRect(px, base - h, r * 2, h);
    });
    x.fillStyle = 'rgba(126,168,240,.2)'; x.fillRect(0, base, W, 3);

    // lo stemma a destra, se disponibile
    let colonna = W - 96;
    if (stemma.complete && stemma.naturalWidth) {
      const h = 250, w = h * (stemma.naturalWidth / stemma.naturalHeight);
      try { x.drawImage(stemma, W - 96 - w, 132, w, h); colonna = W - 96 - w - 44; } catch (e) {}
    }

    // testata
    x.textAlign = 'left';
    x.fillStyle = '#ffd45c';
    x.font = F(18, 700);
    if ('letterSpacing' in x) x.letterSpacing = '3px';
    x.fillText('WORLD OF TRADE', 72, 92);
    if ('letterSpacing' in x) x.letterSpacing = '0px';

    // il numero, che è il motivo per cui la card esiste
    const grande = String(n).length > 2 ? 158 : 186;
    const oro = x.createLinearGradient(0, 150, 0, 300);
    oro.addColorStop(0, '#fffaf0'); oro.addColorStop(.55, '#ffd45c'); oro.addColorStop(1, '#f5a623');
    x.fillStyle = oro;
    x.font = F(grande, 700);
    x.fillText(String(n), 68, 288);
    const largo = x.measureText(String(n)).width;

    x.fillStyle = '#ffffff';
    x.font = F(46);
    x.fillText('correct answers', 68 + largo + 30, 228);
    x.fillText('in a row', 68 + largo + 30, 282);

    // cosa si impara, tagliato se lo stemma stringe la colonna
    x.fillStyle = '#cfe0ff';
    x.font = F(27);
    const righe = ['Incoterms · quotational periods · basis',
                   'hedging · trade finance · freight · desk risk'];
    righe.forEach((r, i2) => x.fillText(r, 72, 380 + i2 * 40));

    x.fillStyle = '#ffd45c';
    x.font = F(26, 600);
    x.fillText(sito().replace(/^https?:\/\//, ''), 72, H - 66);
    return c;
  }

  const nomeFile = n => `world-of-trade-${n}-in-a-row.png`;

  async function scarica(n) {
    const c = disegna(n);
    if (!c || typeof c.toBlob !== 'function') return false;
    return new Promise(res => {
      try { c.toBlob(b => {
        if (!b) return res(false);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = nomeFile(n);
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        res(true);
      }, 'image/png'); } catch (e) { res(false); }
    });
  }

  async function copia(testo) {
    try { await navigator.clipboard.writeText(testo); return true; }
    catch (e) {
      // senza permesso sugli appunti: seleziono il testo così lo copia a mano
      const ta = $('#shareText');
      if (ta) { ta.focus(); ta.select(); }
      return false;
    }
  }

  const linkLinkedIn = () =>
    'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(sito());

  /* ── pannello ─────────────────────────────────────────────────────── */
  let ultimoFocus = null;
  function apri() {
    const L = window.__LEARN__;
    const n = L ? (L.state.streakBest || 0) : 0;
    if (n < SOGLIA) return;
    const lezioni = L ? L.allLessons.length : 31;
    ultimoFocus = document.activeElement;
    const d = $('#shareDialog');
    $('#shareBody').innerHTML = `
      <h2 id="shareTitle">${n} in a row</h2>
      <p class="share-sub">LinkedIn only lets a link carry the page, not your text or
        your image — so take both from here and paste them in.</p>
      <div class="share-card" id="sharePreview"></div>
      <label class="share-label" for="shareText">Post text</label>
      <textarea id="shareText" rows="7" readonly></textarea>
      <div class="share-acts">
        <button id="shareCopy" class="btn primary wide">1 · Copy the text</button>
        <button id="shareDown" class="cloud-cta">2 · Download the image</button>
        <a id="shareGo" class="li-btn" target="_blank" rel="noopener noreferrer">3 · Open LinkedIn</a>
      </div>
      <p id="shareMsg" class="share-msg" role="status" hidden></p>`;
    $('#shareText').value = testoPost(n, lezioni);
    $('#shareGo').href = linkLinkedIn();
    const c = disegna(n);
    if (c) { c.setAttribute('role', 'img'); c.setAttribute('aria-label', `${n} correct answers in a row`); $('#sharePreview').appendChild(c); }
    else $('#sharePreview').remove();

    $('#shareCopy').addEventListener('click', async () => {
      const ok = await copia($('#shareText').value);
      msg(ok ? 'Copied. Now download the image and open LinkedIn.'
             : 'Selected the text — press Ctrl+C (or ⌘C) to copy it.');
    });
    $('#shareDown').addEventListener('click', async () => {
      msg(await scarica(n) ? 'Image saved. Attach it to the post.'
                           : 'Could not build the image here — the text alone works too.');
    });
    d.hidden = false;
    setTimeout(() => $('#shareCopy')?.focus(), 40);
    document.addEventListener('keydown', esc);
  }
  function chiudi() {
    $('#shareDialog').hidden = true;
    document.removeEventListener('keydown', esc);
    ultimoFocus?.focus?.();
  }
  const esc = e => { if (e.key === 'Escape') chiudi(); };
  function msg(testo) { const el = $('#shareMsg'); if (!el) return; el.textContent = testo; el.hidden = !testo; }

  /* ── il pulsante appare dove serve ────────────────────────────────── */
  function disegnaPulsanti() {
    const L = window.__LEARN__;
    const n = L ? (L.state.streakBest || 0) : 0;
    document.querySelectorAll('.share-host').forEach(h => {
      if (n < SOGLIA) { h.innerHTML = ''; return; }
      h.innerHTML = `<button class="share-cta" type="button">
        <span aria-hidden="true">in</span> Share your ${n}-answer streak</button>`;
      h.querySelector('.share-cta').addEventListener('click', apri);
    });
  }
  window.addEventListener('wot:saved', disegnaPulsanti);
  // la bandiera va dichiarata PRIMA di qualunque chiamata:
  // dichiararla dopo la mette nella temporal dead zone e la prima
  // invocazione lancia ReferenceError, lasciando l'interfaccia non disegnata
  let avviato = false;
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', avvia, { once: true });
  else avvia();
  function avvia() {
    if (avviato) return; avviato = true;
    $('#shareClose')?.addEventListener('click', chiudi);
    $('#shareDialog')?.addEventListener('click', e => { if (e.target.id === 'shareDialog') chiudi(); });
    disegnaPulsanti();
  }

  window.WOT_SHARE = { apri, chiudi, disegna, testoPost, linkLinkedIn, disegnaPulsanti, SOGLIA, nomeFile };
})();
