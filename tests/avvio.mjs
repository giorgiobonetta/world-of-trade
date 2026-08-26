import { boot, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Avvio dei moduli');

/* Il bug: `let avviato` dichiarata DOPO la chiamata immediata la mette nella
   temporal dead zone. Se readyState non è 'loading' quando lo script parte,
   la prima invocazione lancia ReferenceError e l'interfaccia non viene mai
   disegnata — senza che nulla lo faccia capire. */
{
  const sorgenti = ['cloud.js','share.js','pwa.js'].map(f => [f, fs.readFileSync(DIR+'/'+f,'utf8')]);
  for (const [f, s] of sorgenti) {
    const iDich = s.indexOf('let avviato');
    if (iDich < 0) { t(`${f}: non usa lo schema a bandiera`, true, 'niente da controllare'); continue; }
    const chiamate = [...s.matchAll(/^\s*(?:else )?avvia\(\);/gm)].map(m => m.index);
    t(`${f}: la bandiera è dichiarata prima di ogni chiamata`,
      chiamate.every(i => i > iDich),
      chiamate.filter(i => i < iDich).length + ' chiamate prima della dichiarazione');
    t(`${f}: il listener è registrato solo se serve davvero`,
      /readyState === 'loading'/.test(s));
    t(`${f}: e con { once: true }`, !/addEventListener\('DOMContentLoaded', avvia\);/.test(s));
  }
}

/* la prova che conta: l'interfaccia si disegna in entrambi gli stati del documento */
for (const stato of ['loading', 'complete']) {
  const { w, errors } = await boot({ cloud: true, readyState: stato });
  await pausa(120);
  t(`readyState "${stato}": nessun errore all'avvio`, errors.length === 0,
    errors.slice(0,1).join('') );
  t(`readyState "${stato}": il pulsante di accesso è disegnato`,
    !!w.document.querySelector('#cloudOpen'),
    w.document.querySelector('#cloudHost')?.innerHTML.slice(0,40) || 'vuoto');
}

/* e con una serie da condividere, anche quello */
for (const stato of ['loading', 'complete']) {
  const { w } = await boot({ readyState: stato,
    seed: { done:['u1l1'], xp:20, best:{}, badges:{}, misses:{}, doneAt:{}, streakBest: 14, updatedAt:1 } });
  await pausa(80);
  t(`readyState "${stato}": il pulsante di condivisione è disegnato`,
    !!w.document.querySelector('.share-cta'));
}
t.fine();
