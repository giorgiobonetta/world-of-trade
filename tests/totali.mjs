/* Le cifre sulla landing devono corrispondere al contenuto reale.
   Sono la prima cosa che un lettore può verificare, e l'ultima che ci si
   ricorda di aggiornare quando il contenuto cresce. */
import { boot, suite, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Totali dichiarati');
const { w } = await boot();
const L = w.__LEARN__;
// la landing ha cambiato nome fra le versioni: si cerca il file che
// dichiara le statistiche, invece di fidarsi del nome
const LANDING = ['landing.html', 'index.html']
  .find(f => fs.existsSync(DIR + '/' + f) &&
        /data-to="\d+"[\s\S]{0,80}Career levels/.test(fs.readFileSync(DIR + '/' + f, 'utf8')));
const land = LANDING ? fs.readFileSync(DIR + '/' + LANDING, 'utf8') : '';
t('la landing con le statistiche è stata trovata', !!LANDING, LANDING || 'nessun file la dichiara');

const reale = {
  unità: L.UNITS.length,
  livelli: L.allLessons.length,
  esercizi: L.allLessons.reduce((a, l) => a + l.exercises.length, 0),
};
const dichiarato = Object.fromEntries(
  [...land.matchAll(/data-to="(\d+)">\d+<\/b><span>([^<]+)</g)].map(m => [m[2].trim(), +m[1]]));

t('la landing dichiara le unità', dichiarato['Units'] === reale.unità,
  `dichiarate ${dichiarato['Units']}, reali ${reale.unità}`);
t('e i livelli', dichiarato['Career levels'] === reale.livelli,
  `dichiarati ${dichiarato['Career levels']}, reali ${reale.livelli}`);
t('e gli esercizi', dichiarato['Career exercises'] === reale.esercizi,
  `dichiarati ${dichiarato['Career exercises']}, reali ${reale.esercizi}`);

/* il numero mostrato deve coincidere con quello animato */
{
  const disallineati = [...land.matchAll(/data-to="(\d+)">(\d+)</g)]
    .filter(m => m[1] !== m[2]).map(m => `${m[1]} vs ${m[2]}`);
  t('il valore animato e quello statico coincidono', disallineati.length === 0, disallineati.join(', '));
}

/* le unità di base citate nel testo */
{
  const base = L.UNITS.filter(u => /^u\d+$/.test(u.id)).length;
  const m = /The (\w+) foundation units/.exec(land);
  const parole = { eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16 };
  t('il testo cita il numero giusto di unità di base', m && parole[m[1]] === base,
    m ? `dice "${m[1]}", sono ${base}` : 'frase non trovata');
}

/* il glossario copre le unità di base */
{
  const g = {}; new Function('window', fs.readFileSync(DIR + '/glossary.js', 'utf8'))(g);
  const lezioniBase = new Set(L.UNITS.filter(u => /^u\d+$/.test(u.id))
    .flatMap(u => u.lessons.map(l => l.id)));
  const coperte = new Set(g.GLOSSARY.filter(v => lezioniBase.has(v.lesson))
    .map(v => v.lesson.slice(0, v.lesson.indexOf('l', 1))));
  const base = L.UNITS.filter(u => /^u\d+$/.test(u.id)).map(u => u.id);
  const scoperte = base.filter(id => !coperte.has(id));
  t('ogni unità di base ha almeno un termine nel glossario', scoperte.length === 0, scoperte.join(','));
}
t.fine();
