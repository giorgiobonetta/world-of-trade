/* Il suono. Tre cose lo rendono un problema invece di un piacere: partire
   senza che nessuno l'abbia chiesto, scaricare file per dire "bip", e far
   fallire una risposta giusta quando il browser rifiuta di suonare. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { boot } from './harness.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leggi = f => fs.readFileSync(path.join(root, f), 'utf8');

let ok = 0, ko = 0;
const t = (nome, buono, extra = '') => {
  if (buono) { ok++; console.log('  ✓ ' + nome + (extra ? ' — ' + extra : '')); }
  else { ko++; console.log('  ✗ ' + nome + (extra ? ' — ' + extra : '')); }
};

const suono = leggi('sound.js');
const app = leggi('app.js');
const html = leggi('learn.html');
const sw = leggi('sw.js');

t('il gioco carica il motore del suono', /<script defer src="sound\.js"><\/script>/.test(html));
t('ed è nella shell offline', sw.includes("'sound.js'"));

/* niente da scaricare */
t('nessun file audio nel pacchetto',
  !fs.readdirSync(root).some(f => /\.(mp3|ogg|wav|m4a|aac)$/i.test(f)),
  fs.readdirSync(root).filter(f => /\.(mp3|ogg|wav|m4a|aac)$/i.test(f)).join(','));
t('i suoni sono sintetizzati', /createOscillator/.test(suono) && /createGain/.test(suono));

/* non parte da solo */
t('parte spento: è una scelta esplicita', /cfg\.sound === true/.test(suono));
t('il contesto audio non nasce al caricamento',
  !/^\s*(var|const|let)\s+ctx\s*=\s*new\s/m.test(suono) && /ctx = null/.test(suono));
t('e si sveglia su un gesto vero',
  /pointerdown/.test(suono) && /resume\(\)/.test(suono));

/* non rompe niente */
t('ogni effetto è protetto da un try', /try \{[\s\S]*?\} catch \(e\) \{[\s\S]*?\}/.test(suono));
t('senza AudioContext non lancia', /window\.AudioContext \|\| window\.webkitAudioContext/.test(suono)
  && /if \(!AC\) return null/.test(suono));

/* attaccato agli eventi che il motore emette già, non a chiamate sparse */
t('ascolta la risposta', /addEventListener\('wot:answer'/.test(suono));
t('e la fine della partita', /addEventListener\('wot:runcomplete'/.test(suono));
t('il motore emette davvero quei due eventi',
  /CustomEvent\('wot:answer'/.test(app) && /CustomEvent\('wot:runcomplete'/.test(app));

/* l'interruttore deve esistere e stare dove lo trova anche un ospite */
t('la preferenza vive con le altre del dispositivo', /wot-settings-v1/.test(suono));
t('il Profilo ha l\'interruttore', /id="setSound"/.test(app) && /id="setHaptics"/.test(app));
t('e non è dietro l\'accesso',
  /function bindDeviceSettings/.test(app) && !/auth-locked[\s\S]{0,120}setSound/.test(app));

/* e nel browser vero non deve piantare l'avvio */
{
  const { w, errors } = await boot({ sessione: { access_token: 'x', user: { id: 'u' } } });
  t('l\'app si avvia con il suono caricato', !!w.__LEARN__);
  t('il motore del suono si presenta', !!w.WOT_SOUND, typeof w.WOT_SOUND);
  t('spento di default non suona nulla', w.WOT_SOUND && w.WOT_SOUND.acceso === false);
  // jsdom non implementa AudioContext: chiamarlo non deve lanciare
  let esploso = null;
  try { w.WOT_SOUND?.suona?.('good'); } catch (e) { esploso = e.message; }
  t('e una chiamata senza audio disponibile non lancia', !esploso, esploso || '');
  t('nessun errore in console', errors.length === 0, errors.slice(0, 2).join(' | '));
}

console.log(`\nSuono: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
