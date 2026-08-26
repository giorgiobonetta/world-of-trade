import { suite, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Contrasto');
const css = fs.readFileSync(DIR + '/styles.css', 'utf8');

const L = h => { h = h.replace('#',''); const v = [0,2,4].map(i => parseInt(h.slice(i,i+2),16)/255)
  .map(c => c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4);
  return 0.2126*v[0] + 0.7152*v[1] + 0.0722*v[2]; };
const R = (a,b) => { const x = Math.max(L(a),L(b)), y = Math.min(L(a),L(b)); return (x+0.05)/(y+0.05); };

/* le coppie testo/fondo che esistono davvero nell'app, col fondo PEGGIORE
   fra quelli su cui l'elemento può capitare */
const coppie = [
  ['testo su card (royal-mid)', '#ffffff', '#2660c9'],
  ['percorso: sottotitolo del nodo', '#dceaff', '#2660c9'],
  ['--muted sui fondi dove è usato davvero', '#bdd2f5', '#173d80'],
  ['--muted-2 sul punto più chiaro del fondo', '#c4d6f7', '#1b3f7e'],
  ['glossario: definizione', '#ffffff', '#2660c9'],
  ['glossario: perché conta', '#d6e5ff', '#2660c9'],
  ['glossario: link alla lezione', '#ffe6a3', '#2660c9'],
  ['glossario: termine', '#fff8e6', '#2660c9'],
  ['glossario: badge unità', '#08183f', '#f5a623'],
  ['serie: numero su oro', '#08183f', '#f5a623'],
  ['LinkedIn: bianco su #0a66c2', '#ffffff', '#0a66c2'],
  ['pannello: etichetta campo', '#fff0b8', '#123a7c'],
  ['pannello: errore', '#ffd7de', '#5c1526'],
  ['checkpoint: sottotitolo su oro', '#3d2a04', '#f5a623'],
];
let sotto = 0;
for (const [nome, fg, bg] of coppie) {
  const r = R(fg, bg);
  if (r < 4.5) sotto++;
  t(`${nome} ≥ 4.5:1`, r >= 4.5, r.toFixed(2) + ':1');
}
t('nessuna coppia sotto la soglia AA', sotto === 0, sotto + ' sotto');

/* i colori dichiarati nel CSS del glossario devono essere quelli verificati */
t('il link del glossario usa il colore corretto', /\.gl-link\{[^}]*color:#ffe6a3/.test(css));
t('non usa più --gold, che non passava su card chiara', !/\.gl-link\{[^}]*var\(--gold\)/.test(css));
t('--muted-2 è il valore corretto', /--muted-2:\s*#c4d6f7/.test(css));
t('il sottotitolo del nodo non usa --muted (3.81:1 su royal-mid)',
  /\.node small\{[^}]*color:#dceaff/.test(css));
// nessun testo piccolo deve usare --muted sopra un fondo royal-mid
const suRoyalMid = ['.node small','.gl-why','.gl-def','.gl-item dt'];
for (const sel of suRoyalMid) {
  const m = new RegExp(sel.replace(/[.]/g,'\\.') + '\\{([^}]*)\\}').exec(css);
  t(`${sel} non usa var(--muted) su fondo chiaro`, !m || !/var\(--muted\)/.test(m[1]),
    m ? (m[1].match(/color:[^;]*/) || [''])[0] : 'regola assente');
}
t.fine();
