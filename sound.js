/* World of Trade — suono.
   Niente file audio: ogni effetto è costruito con due oscillatori e una
   busta di volume. Tre motivi, in ordine: non c'è nulla da scaricare, quindi
   il primo suono arriva subito anche offline; non c'è nulla da tenere in
   cache, quindi la shell resta leggera; e l'altezza delle note si sceglie
   dove serve, senza rifare un campione.

   Regole a cui tutto il resto obbedisce:
   · il contesto audio nasce al primo tocco. I browser rifiutano di suonare
     prima di un gesto dell'utente, e crearlo prima lo lascerebbe sospeso.
   · si rispetta la preferenza salvata in wot-settings-v1 insieme alle
     vibrazioni, e si tace se il sistema chiede meno animazioni: chi lo ha
     impostato di solito non vuole nemmeno rumore a sorpresa.
   · un suono che non riesce a partire non deve rompere una risposta giusta:
     ogni chiamata è dentro un try. */
(function () {
  'use strict';

  var KEY = 'wot-settings-v1';
  var ctx = null;

  function acceso() {
    try {
      var cfg = JSON.parse(localStorage.getItem(KEY) || '{}');
      // il suono è una scelta esplicita: parte spento, e chi lo vuole lo accende
      return cfg.sound === true;
    } catch (e) { return false; }
  }

  function contesto() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    return ctx;
  }

  /* Una nota: onda, frequenza (eventualmente in scivolata), durata, volume.
     L'attacco e il rilascio sono rampe, non gradini: un gradino su un'onda
     produce un clic, e il clic è il suono che fa sembrare rotto tutto. */
  function nota(o) {
    var c = contesto();
    if (!c) return;
    var t0 = c.currentTime + (o.quando || 0);
    var osc = c.createOscillator();
    var vol = c.createGain();
    osc.type = o.onda || 'sine';
    osc.frequency.setValueAtTime(o.da, t0);
    if (o.a && o.a !== o.da) osc.frequency.exponentialRampToValueAtTime(o.a, t0 + o.durata);
    var picco = (o.volume || .22);
    vol.gain.setValueAtTime(.0001, t0);
    vol.gain.exponentialRampToValueAtTime(picco, t0 + .012);
    vol.gain.exponentialRampToValueAtTime(.0001, t0 + o.durata);
    osc.connect(vol); vol.connect(c.destination);
    osc.start(t0); osc.stop(t0 + o.durata + .02);
  }

  var EFFETTI = {
    // due note che salgono: la risposta è giusta e si va avanti
    good:   function () { nota({ da: 660, a: 880, durata: .11, onda: 'triangle', volume: .18 });
                          nota({ da: 990, durata: .13, onda: 'sine', volume: .13, quando: .085 }); },
    // una nota che scende, corta: è un "no", non una punizione
    bad:    function () { nota({ da: 300, a: 150, durata: .2, onda: 'sawtooth', volume: .1 }); },
    // arpeggio breve: livello finito
    clear:  function () { [523, 659, 784, 1047].forEach(function (f, i) {
                            nota({ da: f, durata: .22, onda: 'triangle', volume: .16, quando: i * .085 }); }); },
    // più alto e più lungo: un desk nuovo, o una promozione
    reward: function () { [659, 880, 1319].forEach(function (f, i) {
                            nota({ da: f, durata: .3, onda: 'sine', volume: .17, quando: i * .1 }); }); },
    // il battito della serie: una sola nota, sempre più alta
    streak: function (n) { nota({ da: 700 + Math.min(8, n) * 60, durata: .09, onda: 'sine', volume: .12 }); },
  };

  function suona(nome, arg) {
    if (!acceso()) return;
    try {
      var c = contesto();
      if (!c) return;
      // il contesto può nascere sospeso: si riprende al primo gesto utile
      if (c.state === 'suspended') c.resume();
      (EFFETTI[nome] || function () {})(arg);
    } catch (e) { /* un effetto mancato non deve far fallire una risposta */ }
  }

  /* Il contesto si crea al primo tocco reale, non al caricamento. */
  function sveglia() {
    if (!acceso()) return;
    var c = contesto();
    if (c && c.state === 'suspended') { try { c.resume(); } catch (e) {} }
  }
  document.addEventListener('pointerdown', sveglia, { passive: true });
  document.addEventListener('keydown', sveglia);

  window.addEventListener('wot:answer', function (e) {
    var d = e.detail || {};
    if (!d.ok) return suona('bad');
    if (!d.retry && Number(d.streak) >= 3) suona('streak', Number(d.streak));
    else suona('good');
  });
  window.addEventListener('wot:runcomplete', function (e) {
    var d = e.detail || {};
    suona(d.newDeskUnlocked || d.acc === 100 ? 'reward' : 'clear');
  });

  window.WOT_SOUND = { suona, get acceso() { return acceso(); } };
})();
