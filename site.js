/* World of Trade — comportamento della cornice del sito.
   Due sole cose: aprire il menu sugli schermi stretti, e dire in quale
   sezione ci si trova.

   La visibilità del menu la decide il CSS, non questo file. Farla decidere a
   una media query letta una volta sola all'avvio significa affidarsi al
   momento esatto in cui lo script parte: se in quell'istante la finestra è
   ancora larga, il menu resta aperto e ci vuole un ridimensionamento per
   accorgersene. Qui si aggiunge solo la classe .js — che dice al CSS "c'è
   qualcuno che può riaprirlo" — e si alza o abbassa .open. Senza questo
   file i collegamenti restano semplicemente visibili. */
(function () {
  'use strict';
  var nav = document.querySelector('.site-nav');
  var toggle = document.getElementById('siteNavToggle');
  var links = document.getElementById('siteLinks');

  if (nav && toggle && links) {
    nav.classList.add('js');
    toggle.setAttribute('aria-expanded', 'false');

    var apri = function (v) {
      nav.classList.toggle('open', v);
      toggle.setAttribute('aria-expanded', String(v));
    };
    toggle.addEventListener('click', function () { apri(!nav.classList.contains('open')); });
    // toccato un link, il menu si richiude: restare aperto sopra la sezione
    // appena raggiunta significa non vederla
    links.addEventListener('click', function (e) { if (e.target.closest('a')) apri(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { apri(false); toggle.focus(); }
    });
  }

  /* Un'ancora su una pagina lunga arriva nel posto sbagliato: il browser
     salta appena vede l'id, e subito dopo il crest, i caratteri e le sezioni
     prendono il loro spazio spostando il bersaglio di migliaia di pixel.
     A caricamento finito si rifà il salto, una volta, sul layout vero. */
  if (location.hash.length > 1) {
    var mira = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (mira) window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        // behavior 'auto' scavalca lo scroll morbido: qui non è un movimento
        // da guardare, è il punto da cui si comincia a leggere
        mira.scrollIntoView({ block: 'start', behavior: 'auto' });
      });
    });
  }

  /* Quale voce è quella corrente. Su una pagina con le ancore lo dice la
     sezione visibile; sulle altre, il nome del file. */
  var voci = links ? [].slice.call(links.querySelectorAll('a')) : [];
  if (!voci.length) return;

  var qui = location.pathname.replace(/\/$/, '/index').split('/').pop().replace(/\.html$/, '');
  voci.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') return;
    var file = href.split('#')[0].replace(/\.html$/, '');
    if (file && (file === qui || (qui === 'index' && file === 'landing'))) a.classList.add('is-current');
  });

  var ancore = voci.map(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('#') < 0) return null;
    // l'ancora vale solo se la sezione è in QUESTA pagina
    var id = href.split('#')[1];
    var sez = id && document.getElementById(id);
    return sez ? { a: a, sez: sez } : null;
  }).filter(Boolean);
  if (!ancore.length || !('IntersectionObserver' in window)) return;

  // Una sezione conta come "quella corrente" quando attraversa la fascia
  // appena sotto la barra: è lì che si guarda mentre si scorre.
  var visibili = [];
  var osserva = new IntersectionObserver(function (righe) {
    righe.forEach(function (r) {
      var i = visibili.indexOf(r.target);
      if (r.isIntersecting && i < 0) visibili.push(r.target);
      else if (!r.isIntersecting && i >= 0) visibili.splice(i, 1);
    });
    var prima = null;
    ancore.forEach(function (x) { if (!prima && visibili.indexOf(x.sez) >= 0) prima = x; });
    ancore.forEach(function (x) { x.a.classList.toggle('is-current', x === prima); });
  }, { rootMargin: '-72px 0px -55% 0px', threshold: 0 });
  ancore.forEach(function (x) { osserva.observe(x.sez); });
})();
