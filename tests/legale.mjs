/* Il sito raccoglie email e password con account obbligatorio. Prima di mandarlo
   a un'azienda con un ufficio compliance devono esserci: informativa, disclaimer
   dove l'utente passa il tempo, e nessun segnaposto lasciato da riempire. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leggi = f => fs.readFileSync(path.join(root, f), 'utf8');
let ok = 0, ko = 0;
const t = (n, c, i = '') => { c ? (ok++, console.log('  ✓ ' + n + (i ? ' — ' + i : '')))
                                : (ko++, console.log('  ✗ ' + n + (i ? ' — ' + i : ''))); };

const priv = leggi('privacy.html');
t('esiste una pagina di informativa', priv.length > 1500);

/* le pagine dove si passa il tempo devono avere il disclaimer, non solo la landing */
for (const f of ['index.html', 'learn.html', 'glossary.html']) {
  const s = leggi(f);
  t(`${f}: disclaimer presente`, /Not trading, investment, legal or tax advice/i.test(s));
  t(`${f}: dice che i numeri sono didattici`, /illustrative and simplified/i.test(s));
  t(`${f}: rimanda all'informativa`, /href="privacy\.html"/.test(s));
}

/* il link deve esserci nel momento in cui si crea l'account */
t('il gate di accesso rimanda all\'informativa',
  /auth-gate-legal[\s\S]{0,220}href="privacy\.html"/.test(leggi('learn.html')));
t('e dice cosa viene raccolto', /store your email and your progress/.test(leggi('learn.html')));

/* contenuto dell'informativa: deve dire le cose vere e verificabili nel codice */
for (const [nome, re] of [
  ['nomina Supabase come responsabile', /Supabase/],
  ['nomina Vercel', /Vercel/],
  ['dice che la password non è visibile all\'app', /never visible to this app/i],
  ['elenca cosa contiene il progresso', /experience\s*points|accuracy per lesson/i],
  ['dichiara che non c\'è tracciamento', /No analytics|no tracking/i],
  ['spiega come farsi cancellare', /delet/i],
  ['dice che si può usare senza account', /without creating an account|not creating an account/i],
  ['dichiara che Hélène è un personaggio', /fictional character/i],
  ['dice che i dati non vengono venduti', /never sold/i],
]) t('informativa: ' + nome, re.test(priv));

/* nessun segnaposto deve arrivare online */
{
  const segnaposto = [...priv.matchAll(/\[([A-ZÀ-Ù][^\]]{3,})\]/g)].map(m => m[0]);
  t('nessun segnaposto lasciato da riempire nell\'informativa', segnaposto.length === 0,
    segnaposto.length ? segnaposto.join(' · ') + '  ← da compilare prima di pubblicare' : '');
}

/* la privacy va servita e messa in cache come le altre pagine */
{
  const sw = leggi('sw.js');
  t('privacy.html è nella shell offline', /'privacy\.html'/.test(sw));
  const vc = JSON.parse(leggi('vercel.json'));
  const noCache = vc.headers.filter(h => h.headers.some(k => /max-age=0/.test(k.value))).map(h => h.source);
  t('e non viene cachata a lungo', noCache.includes('/privacy.html'));
}

console.log(`\nPrivacy e disclaimer: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
