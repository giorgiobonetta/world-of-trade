/* World of Trade — introduzione al primo avvio.
   Tre schermate, saltabili, mostrate una volta sola. Esistono perché chi
   apre l'app la prima volta non ha modo di sapere cosa sono i salvagenti,
   perché Practice è gratis, o che sotto al percorso ci sono altre quattro
   modalità. Chi valuta l'app la apre una volta: se non capisce in venti
   secondi cosa ha davanti, non lo capirà mai. */
(function () {
  'use strict';

  const CHIAVE = 'wot_intro_v1';

  const PASSI = [
    {
      titolo: 'Physical commodity trading, one level at a time',
      copia: 'Not theory for its own sake: the mechanics a desk actually uses — buying a cargo, moving it, financing it, and keeping the margin once costs and risk have taken their share.',
      punti: ['32 units, 173 levels', 'Every answer comes with the reasoning behind it', 'Start anywhere: the first level of each unit is open'],
      faccia: 'teach',
    },
    {
      titolo: 'Lifebuoys are the cost of a wrong answer',
      copia: 'You hold five. A wrong answer costs one, and revealing an answer costs one too. They come back on their own — one every twenty minutes, even with the app closed — or immediately with ten correct answers in a row.',
      punti: ['Five lifebuoys', 'One back every 20 minutes', 'Practice never costs one'],
      faccia: 'oops',
    },
    {
      titolo: 'The career path is not the whole app',
      copia: 'Path is the course. Play holds four shorter formats, Practice returns the questions you got wrong, and League puts your week against everyone else’s.',
      punti: ['Play · Flash, Deal of the Day, Boss Deals, Floor Run', 'Practice · weighted towards your mistakes', 'League · six divisions, weekly'],
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
    $('#introList').innerHTML = p.punti
      .map(x => '<li>' + x.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) + '</li>')
      .join('');
    const art = $('#introArt');
    if (art) art.innerHTML = window.MASCOT ? window.MASCOT.svg(p.faccia, 84) : '';
    document.querySelectorAll('.intro-dots i').forEach((d, k) => d.classList.toggle('on', k === i));
    $('#introNext').textContent = i === PASSI.length - 1 ? 'Start' : 'Next';
    $('#introSkip').hidden = i === PASSI.length - 1;
  }

  function avanti() {
    if (i < PASSI.length - 1) { i += 1; disegna(); $('#introNext').focus(); return; }
    chiudi();
  }

  function chiudi() {
    segnaVisto();
    const d = dlg();
    if (d) d.hidden = true;
    document.removeEventListener('keydown', tasti, true);
    // il focus torna dove stava, altrimenti chi naviga da tastiera si perde
    try { (ultimoFocus || document.querySelector('.node.next') || document.body).focus(); } catch (e) {}
  }

  function tasti(e) {
    const d = dlg();
    if (!d || d.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); chiudi(); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      if (document.activeElement === $('#introSkip')) return;
      e.preventDefault(); avanti(); return;
    }
    // il fuoco non deve poter uscire dalla finestra
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
    $('#introSkip').addEventListener('click', chiudi);
    // il fondo scuro chiude: è quello che ci si aspetta da una finestra così
    d.addEventListener('click', e => { if (e.target === d) chiudi(); });
    const replay = $('#introReplay');
    if (replay) replay.addEventListener('click', () => apri(true));
    // l'app è già visibile dietro: si apre solo se non è mai stata vista
    apri(false);
  }

  // esposta per il Profilo ("rivedi l'introduzione") e per i test
  window.INTRO = { apri: () => apri(true), chiudi, visto, CHIAVE, passi: () => PASSI.length,
                   get indice() { return i; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', collega);
  else collega();
})();
