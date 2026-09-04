/* World of Trade — first-run onboarding.
   v0.5 deliberately teaches only what the player needs to make the first
   decision. The rest of the product is discovered by playing. */
(function () {
  'use strict';

  const CHIAVE = 'wot_intro_v1';

  const PASSI = [
    {
      titolo: 'Welcome to the trading floor',
      copia: 'I’m Hélène. Your first assignment starts on Desk 1. Each level is a short set of real trading decisions; make the call, see the desk logic, then move straight on.',
      punti: ['Start at Desk 1', 'Short levels built around real trade mechanics', 'Every answer explains why the desk would make that call'],
      faccia: 'teach',
    },
    {
      titolo: 'Protect the book. Keep moving.',
      copia: 'A wrong answer costs one lifebuoy. Good runs build your streak and XP. Clear every level in the desk and the next desk opens automatically.',
      punti: ['5 lifebuoys', 'Correct streaks can earn one back', 'Clear the desk to unlock your next assignment'],
      faccia: 'happy',
    },
  ];

  let i = 0;
  let ultimoFocus = null;

  const $ = s => document.querySelector(s);
  const dlg = () => $('#introDialog');

  function visto() {
    try { return localStorage.getItem(CHIAVE) === '1'; } catch (e) { return true; }
  }
  function segnaVisto() {
    try { localStorage.setItem(CHIAVE, '1'); } catch (e) {}
  }

  function disegna() {
    const p = PASSI[i];
    if (!p) return;
    $('#introTitle').textContent = p.titolo;
    $('#introCopy').textContent = p.copia;
    $('#introStepNow').textContent = String(i + 1);
    const total = document.querySelector('#introDialog .intro-step');
    if (total) total.lastChild.textContent = ` of ${PASSI.length}`;
    $('#introList').innerHTML = p.punti
      .map(x => '<li>' + x.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) + '</li>')
      .join('');
    const art = $('#introArt');
    if (art) art.innerHTML = window.MASCOT ? window.MASCOT.svg(p.faccia, 84) : '';
    document.querySelectorAll('.intro-dots i').forEach((d, k) => {
      d.hidden = k >= PASSI.length;
      d.classList.toggle('on', k === i);
    });
    $('#introNext').textContent = i === PASSI.length - 1 ? 'Go to Desk 1' : 'Next';
    $('#introSkip').hidden = i === PASSI.length - 1;
  }

  function avanti() {
    if (i < PASSI.length - 1) { i += 1; disegna(); $('#introNext').focus(); return; }
    chiudi(true);
  }

  function chiudi(portaAlPrimoLivello = false) {
    segnaVisto();
    const d = dlg();
    if (d) d.hidden = true;
    document.removeEventListener('keydown', tasti, true);
    const first = document.querySelector('.node.next');
    if (portaAlPrimoLivello && first) {
      try { first.scrollIntoView({ block:'center', behavior:'smooth' }); } catch (e) {}
      first.classList.remove('first-callout');
      void first.offsetWidth;
      first.classList.add('first-callout');
      setTimeout(() => first.classList.remove('first-callout'), 1800);
      try { first.focus(); } catch (e) {}
      return;
    }
    try { (ultimoFocus || first || document.body).focus(); } catch (e) {}
  }

  function tasti(e) {
    const d = dlg();
    if (!d || d.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); chiudi(false); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      if (document.activeElement === $('#introSkip')) return;
      e.preventDefault(); avanti(); return;
    }
    if (e.key !== 'Tab') return;
    const dentro = [...d.querySelectorAll('button')].filter(b => !b.hidden && !b.disabled);
    if (!dentro.length) return;
    const primo = dentro[0], ultimo = dentro[dentro.length - 1];
    if (e.shiftKey && document.activeElement === primo) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primo.focus(); }
  }

  function apri(forzata) {
    const d = dlg();
    if (!d) return false;
    if (!forzata && visto()) return false;
    ultimoFocus = document.activeElement;
    i = 0;
    disegna();
    d.hidden = false;
    document.addEventListener('keydown', tasti, true);
    setTimeout(() => { try { $('#introNext').focus(); } catch (e) {} }, 30);
    return true;
  }

  function collega() {
    const d = dlg();
    if (!d) return;
    $('#introNext').addEventListener('click', avanti);
    $('#introSkip').addEventListener('click', () => chiudi(false));
    d.addEventListener('click', e => { if (e.target === d) chiudi(false); });
    const replay = $('#introReplay');
    if (replay) replay.addEventListener('click', () => apri(true));
    apri(false);
  }

  window.INTRO = { apri: () => apri(true), chiudi: () => chiudi(false), visto, CHIAVE, passi: () => PASSI.length,
                   get indice() { return i; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', collega);
  else collega();
})();
