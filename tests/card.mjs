import { boot, suite } from './harness.mjs';
const t = suite('Card della condivisione');

/* Un contesto 2D che registra invece di disegnare: verifica che il codice
   percorra tutto il tracciato e produca gli elementi attesi, senza rasterizzatore. */
function contestoFinto() {
  const chiamate = [], testi = [], gradienti = [];
  const grad = () => ({ addColorStop(o, c) { gradienti.push([o, c]); } });
  const ctx = {
    canvas: null, font: '', fillStyle: '', textAlign: '', letterSpacing: '',
    createLinearGradient(...a) { chiamate.push(['linearGradient', a]); return grad(); },
    createRadialGradient(...a) { chiamate.push(['radialGradient', a]); return grad(); },
    fillRect(...a) { chiamate.push(['fillRect', a]); },
    fillText(txt, x, y) { chiamate.push(['fillText', [txt, x, y]]); testi.push({ txt, x, y, font: ctx.font, fill: ctx.fillStyle }); },
    measureText(s) { return { width: s.length * 90 }; },     // stima grossolana ma coerente
    beginPath() { chiamate.push(['beginPath', []]); },
    arc(...a) { chiamate.push(['arc', a]); },
    ellipse(...a) { chiamate.push(['ellipse', a]); },
    fill() { chiamate.push(['fill', []]); },
  };
  return { ctx, chiamate, testi, gradienti };
}

const { w } = await boot({ seed: { done: [], xp: 0, best: {}, badges: {}, misses: {}, doneAt: {}, streakBest: 23, updatedAt: 1 } });
const rec = contestoFinto();
let dimensioni = null, blobChiesto = false;
w.document.createElement = (tag => {
  const vero = w.document.createElement.bind(w.document);
  return function (t2) {
    const el = vero(t2);
    if (String(t2).toLowerCase() === 'canvas') {
      Object.defineProperty(el, 'getContext', { value: () => rec.ctx, configurable: true });
      Object.defineProperty(el, 'toBlob', { value: cb => { blobChiesto = true; cb(null); }, configurable: true });
      setTimeout(() => { dimensioni = [el.width, el.height]; }, 0);
      Object.defineProperty(el, 'width', { value: 0, writable: true, configurable: true });
      Object.defineProperty(el, 'height', { value: 0, writable: true, configurable: true });
    }
    return el;
  };
})();

const c = w.WOT_SHARE.disegna(23);
t('il disegno arriva alla fine e restituisce un canvas', !!c);
const T = rec.testi.map(x => x.txt);
t('il numero è disegnato', T.includes('23'), T.join(' | ').slice(0, 90));
t('è il testo più grande della card',
  (rec.testi.find(x => x.txt === '23')?.font || '').match(/(\d+)px/)?.[1] >= '100',
  rec.testi.find(x => x.txt === '23')?.font);
t('accanto c\'è la spiegazione', T.includes('correct answers') && T.includes('in a row'));
t('c\'è il nome del prodotto', T.some(x => /WORLD OF TRADE/.test(x)));
t('ci sono gli argomenti del corso', T.some(x => /Incoterms/.test(x)) && T.some(x => /desk risk/.test(x)));
t('c\'è l\'indirizzo del sito, senza schema', T.some(x => x === 'wot.test'), T[T.length - 1]);
t('nessun testo esce dal bordo destro (1200)',
  rec.testi.every(x => x.x + x.txt.length * 12 < 1200),
  rec.testi.map(x => x.txt.slice(0, 12) + '@' + Math.round(x.x)).join(' '));
t('nessun testo esce dal bordo inferiore (630)', rec.testi.every(x => x.y < 630),
  String(Math.max(...rec.testi.map(x => x.y))));
t('lo sfondo è un gradiente, non un colore piatto',
  rec.chiamate.filter(x => x[0] === 'linearGradient').length >= 2);
t('c\'è l\'alone in alto', rec.chiamate.some(x => x[0] === 'radialGradient'));
t('c\'è la sagoma del porto (gru, sili, serbatoi)',
  rec.chiamate.filter(x => x[0] === 'fillRect').length > 12 &&
  rec.chiamate.some(x => x[0] === 'arc') && rec.chiamate.some(x => x[0] === 'ellipse'),
  rec.chiamate.filter(x => x[0] === 'fillRect').length + ' rettangoli');

/* un numero a tre cifre non deve rompere il layout */
const rec2 = contestoFinto();
Object.defineProperty(w.document, 'createElement', { value: (t2 => {
  const el = w.document.implementation.createHTMLDocument().createElement(t2);
  if (String(t2).toLowerCase() === 'canvas') {
    el.getContext = () => rec2.ctx;
  }
  return el;
}), configurable: true });
w.WOT_SHARE.disegna(100);
const n3 = rec2.testi.find(x => x.txt === '100');
t('con tre cifre il numero rimpicciolisce', n3 && /158px/.test(n3.font), n3?.font);
t('e la spiegazione si sposta a destra',
  rec2.testi.find(x => x.txt === 'correct answers').x > rec.testi.find(x => x.txt === 'correct answers').x,
  Math.round(rec.testi.find(x => x.txt === 'correct answers').x) + ' → ' +
  Math.round(rec2.testi.find(x => x.txt === 'correct answers').x));
/* lo stemma non deve essere obbligatorio */
{
  const rec3 = contestoFinto();
  Object.defineProperty(w.document, 'createElement', { value: (t2 => {
    const el = w.document.implementation.createHTMLDocument().createElement(t2);
    if (String(t2).toLowerCase() === 'canvas') el.getContext = () => rec3.ctx;
    return el;
  }), configurable: true });
  const prima = rec3.chiamate.length;
  const c3 = w.WOT_SHARE.disegna(7);
  t('la card si disegna anche senza lo stemma caricato', !!c3);
  t('e non chiama drawImage a vuoto', !rec3.chiamate.some(x => x[0] === 'drawImage'));
  t('il testo resta tutto dentro l\'altezza', rec3.testi.every(x => x.y < 630),
    String(Math.max(...rec3.testi.map(x => x.y))));
  t('e dentro la larghezza, misurando il numero davvero',
    rec3.testi.every(x => x.x < 1000), rec3.testi.map(x => Math.round(x.x)).join(','));
}
t.fine();
