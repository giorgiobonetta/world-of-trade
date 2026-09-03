/* World of Trade — scene di sezione
   Ogni desk del percorso ha uno sfondo suo, disegnato a mano in SVG: nessun
   file esterno da scaricare, nessuna immagine da ridimensionare, e il colore
   arriva dal foglio di stile tramite le classi `a` (fondo), `b` (mezzo) e
   `c` (primo piano). Le scene sono decorative: sono marcate aria-hidden e
   non contengono testo.
   La palette di ogni scena sta in styles.css, su [data-scene="…"]. */
(() => {
  'use strict';

  // Un wrapper unico: la scena riempie la testata e viene tagliata in basso,
  // così su schermi stretti resta la parte che si riconosce.
  const S = (body) => '<svg class="scene-art" viewBox="0 0 320 120" ' +
    'preserveAspectRatio="xMaxYMax meet" focusable="false" aria-hidden="true">' + body + '</svg>';

  const SCENES = {

    /* Autunno ─────────────────────────────────────────────────────── */

    // rotte fra due continenti stilizzati
    trade: S(`
      <circle class="a" cx="160" cy="86" r="70"/>
      <path class="b" d="M96 62c14-10 30-6 40 2s26 10 40 2 30-6 44 4"/>
      <path class="b" d="M92 92c18-8 34-2 48 6s28 8 44-2 28-10 44-2"/>
      <path class="c" d="M104 74q56-44 116 0" fill="none" stroke-dasharray="7 6"/>
      <circle class="c" cx="104" cy="74" r="6"/>
      <circle class="c" cx="220" cy="74" r="6"/>
      <rect class="b" x="18" y="70" width="10" height="46"/>
      <rect class="b" x="34" y="82" width="10" height="34"/>
      <rect class="c" x="50" y="60" width="10" height="56"/>`),

    // dispersione e curva di distribuzione
    quant: S(`
      <path class="a" d="M20 116h280M20 92h280M20 68h280M20 44h280" fill="none"/>
      <path class="b" d="M24 116c34 0 42-64 76-64s42 64 76 64 42-52 76-52 34 52 44 52z"/>
      <rect class="c" x="44" y="80" width="14" height="36"/>
      <rect class="c" x="70" y="62" width="14" height="54"/>
      <rect class="c" x="96" y="72" width="14" height="44"/>
      <rect class="c" x="122" y="48" width="14" height="68"/>
      <circle class="c" cx="212" cy="52" r="5"/>
      <circle class="c" cx="240" cy="66" r="5"/>
      <circle class="c" cx="268" cy="44" r="5"/>`),

    // fogli di bilancio e colonne di cifre
    accounts: S(`
      <rect class="a" x="26" y="24" width="120" height="100" rx="6"/>
      <rect class="b" x="44" y="36" width="120" height="100" rx="6"/>
      <rect class="c" x="62" y="48" width="120" height="100" rx="6"/>
      <path class="a" d="M74 66h96M74 80h96M74 94h64M74 108h80" fill="none"/>
      <rect class="b" x="206" y="84" width="18" height="40"/>
      <rect class="b" x="230" y="64" width="18" height="60"/>
      <rect class="c" x="254" y="44" width="18" height="80"/>`),

    // bilancia e colonnato
    legal: S(`
      <rect class="a" x="16" y="30" width="288" height="10" rx="4"/>
      <rect class="b" x="34" y="46" width="14" height="78"/>
      <rect class="b" x="66" y="46" width="14" height="78"/>
      <rect class="b" x="240" y="46" width="14" height="78"/>
      <rect class="b" x="272" y="46" width="14" height="78"/>
      <rect class="c" x="158" y="40" width="6" height="72"/>
      <path class="c" d="M118 58h86" fill="none"/>
      <path class="c" d="M104 58l14 22h-28z"/>
      <path class="c" d="M218 58l14 22h-28z"/>
      <rect class="c" x="132" y="110" width="58" height="8" rx="4"/>`),

    // banchina, gru e nave portacontainer
    shipping: S(`
      <path class="a" d="M0 100h320v20H0z"/>
      <path class="b" d="M0 106q26-8 52 0t52 0 52 0 52 0 52 0 60 0v14H0z"/>
      <rect class="b" x="36" y="30" width="8" height="66"/>
      <path class="b" d="M20 30h84v8H20z"/>
      <rect class="b" x="96" y="38" width="6" height="22"/>
      <path class="c" d="M150 96h132l-12 18H162z"/>
      <rect class="c" x="176" y="76" width="22" height="20"/>
      <rect class="c" x="202" y="76" width="22" height="20"/>
      <rect class="c" x="228" y="76" width="22" height="20"/>
      <rect class="c" x="189" y="56" width="22" height="20"/>
      <rect class="c" x="256" y="66" width="18" height="30"/>`),

    // germoglio, foglie e turbina: la licenza a operare
    sustainability: S(`
      <circle class="a" cx="256" cy="40" r="34"/>
      <path class="b" d="M60 120c0-40 18-62 46-70-6 30-20 48-46 70z"/>
      <path class="b" d="M60 120c0-34-14-54-38-62 4 26 16 42 38 62z"/>
      <rect class="c" x="57" y="62" width="6" height="58" rx="3"/>
      <rect class="c" x="196" y="52" width="5" height="68"/>
      <path class="c" d="M198 52l26-16-6 22zM198 52l-26-16 6 22zM198 52l4 30-14-6z"/>
      <path class="a" d="M112 120c12-18 30-26 52-26v26z"/>`),

    // rack, nodi e collegamenti
    tech: S(`
      <rect class="a" x="30" y="34" width="72" height="86" rx="6"/>
      <path class="b" d="M42 50h48M42 64h48M42 78h48M42 92h48" fill="none"/>
      <path class="b" d="M118 60h40v-18h44M118 88h40v22h44M202 42v68" fill="none"/>
      <circle class="c" cx="202" cy="42" r="7"/>
      <circle class="c" cx="202" cy="110" r="7"/>
      <circle class="c" cx="252" cy="76" r="9"/>
      <path class="c" d="M211 42h32l9 26M211 110h32l9-26" fill="none"/>
      <circle class="b" cx="286" cy="52" r="5"/>
      <circle class="b" cx="286" cy="100" r="5"/>`),

    // candele e differenziale
    pricing: S(`
      <path class="a" d="M18 118h284" fill="none"/>
      <rect class="b" x="40" y="70" width="12" height="34"/><path class="b" d="M46 60v58" fill="none"/>
      <rect class="c" x="68" y="54" width="12" height="40"/><path class="c" d="M74 44v60" fill="none"/>
      <rect class="b" x="96" y="76" width="12" height="28"/><path class="b" d="M102 66v50" fill="none"/>
      <rect class="c" x="124" y="46" width="12" height="46"/><path class="c" d="M130 36v66" fill="none"/>
      <rect class="b" x="152" y="62" width="12" height="36"/><path class="b" d="M158 52v56" fill="none"/>
      <path class="c" d="M186 96q40-52 96-64" fill="none" stroke-dasharray="6 5"/>
      <path class="c" d="M282 24l16 6-12 12z"/>`),

    /* Primavera ───────────────────────────────────────────────────── */

    // due esposizioni opposte, e lo scudo che resta
    hedging: S(`
      <path class="a" d="M160 18l58 22v40c0 30-26 46-58 56-32-10-58-26-58-56V40z"/>
      <path class="b" d="M34 58h72l-14-14h22l24 24-24 24h-22l14-14H34z"/>
      <path class="c" d="M286 100h-72l14 14h-22l-24-24 24-24h22l-14 14h72z"/>
      <path class="c" d="M132 78l20 20 38-40" fill="none"/>`),

    // il bivio: due esiti, un premio
    options: S(`
      <path class="a" d="M40 78h60" fill="none"/>
      <path class="b" d="M100 78q40 0 60-38t60-14" fill="none"/>
      <path class="c" d="M100 78q40 0 60 30h60" fill="none"/>
      <circle class="c" cx="100" cy="78" r="9"/>
      <path class="b" d="M220 26l18 8-18 10z"/>
      <path class="c" d="M220 108l18-8-18-10z"/>
      <rect class="b" x="34" y="94" width="42" height="22" rx="6"/>
      <path class="a" d="M254 40h44v56h-44z"/>`),

    // torri, serbatoi e fiaccola
    oil: S(`
      <path class="a" d="M0 108h320v12H0z"/>
      <rect class="b" x="30" y="46" width="16" height="62"/>
      <rect class="b" x="54" y="62" width="12" height="46"/>
      <path class="b" d="M24 46h28v-8H24zM48 62h24v-6H48z"/>
      <rect class="c" x="92" y="34" width="20" height="74"/>
      <path class="c" d="M86 34h32l-6-10h-20z"/>
      <path class="c" d="M102 24c6-10 2-16-2-22 12 6 16 14 10 22z"/>
      <rect class="b" x="140" y="76" width="52" height="32" rx="4"/>
      <rect class="c" x="206" y="66" width="60" height="42" rx="6"/>
      <path class="a" d="M206 78h60M206 92h60" fill="none"/>`),

    // pale, pannelli e sole
    renewable: S(`
      <circle class="a" cx="60" cy="36" r="26"/>
      <path class="a" d="M0 108h320v12H0z"/>
      <rect class="c" x="126" y="40" width="5" height="68"/>
      <path class="c" d="M128 40l30-14-4 20zM128 40l-30-14 4 20zM128 40l6 32-16-6z"/>
      <rect class="b" x="206" y="56" width="4" height="52"/>
      <path class="b" d="M208 56l22-10-3 15zM208 56l-22-10 3 15zM208 56l4 24-12-5z"/>
      <path class="c" d="M18 108l14-28h48l-6 28z"/>
      <path class="a" d="M28 100h44M34 88h40" fill="none"/>
      <path class="b" d="M248 108l10-20h42l-4 20z"/>`),

    // castelletto, lingotti e cumulo
    metals: S(`
      <path class="a" d="M0 108h320v12H0z"/>
      <path class="b" d="M40 108V44l26-18 26 18v64z"/>
      <path class="b" d="M40 44l52 34M92 44l-52 34" fill="none"/>
      <path class="a" d="M126 108l30-34h40l30 34z"/>
      <path class="c" d="M212 96h38l6 12h-50zM224 82h38l6 12h-50zM236 68h38l6 12h-50z"/>
      <circle class="c" cx="66" cy="30" r="6"/>`),

    // silo, filari e sole basso
    softs: S(`
      <circle class="a" cx="270" cy="38" r="28"/>
      <path class="a" d="M0 104h320v16H0z"/>
      <rect class="c" x="38" y="42" width="34" height="62" rx="4"/>
      <path class="c" d="M34 42q21-20 42 0z"/>
      <rect class="b" x="80" y="62" width="26" height="42" rx="3"/>
      <path class="b" d="M76 62q17-14 34 0z"/>
      <path class="b" d="M0 112q40-14 80 0t80 0 80 0 80 0" fill="none"/>
      <path class="c" d="M140 104V72M140 74l10-8M140 84l-10-8M170 104V78M170 80l10-8M200 104V70M200 72l-10-8" fill="none"/>`),

    // sportello, documento e timbro
    tradefinance: S(`
      <path class="a" d="M28 46h132l-66-24z"/>
      <rect class="a" x="28" y="46" width="132" height="8"/>
      <rect class="b" x="42" y="54" width="12" height="54"/>
      <rect class="b" x="70" y="54" width="12" height="54"/>
      <rect class="b" x="98" y="54" width="12" height="54"/>
      <rect class="b" x="126" y="54" width="12" height="54"/>
      <rect class="a" x="28" y="108" width="132" height="10"/>
      <rect class="c" x="188" y="38" width="92" height="70" rx="5"/>
      <path class="a" d="M202 56h64M202 70h64M202 84h40" fill="none"/>
      <circle class="c" cx="264" cy="92" r="14"/>`),

    // la pila del capitale: compatta e appoggiata a destra, così non finisce
    // dietro al titolo del corso, che è lungo
    financing: S(`
      <rect class="a" x="196" y="30" width="76" height="16" rx="5"/>
      <rect class="b" x="184" y="52" width="100" height="16" rx="5"/>
      <rect class="b" x="172" y="74" width="124" height="16" rx="5"/>
      <rect class="c" x="160" y="96" width="148" height="16" rx="5"/>
      <path class="c" d="M234 30V10M234 12l8 8M234 12l-8 8" fill="none"/>
      <circle class="c" cx="150" cy="38" r="8"/>
      <circle class="c" cx="132" cy="60" r="6"/>`),
  };

  window.WOT_SCENES = SCENES;
  // il fallback vale anche come elenco delle scene disponibili
  window.WOT_SCENE_IDS = Object.keys(SCENES);
})();
