/* Il pacchetto non deve poter cancellare le chiavi di chi lo installa.
   È successo due volte: un caricamento completo sovrascriveva
   supabase-config.js con la copia vuota, e con l'autenticazione
   obbligatoria l'app si bloccava del tutto. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leggi = f => fs.readFileSync(path.join(root, f), 'utf8');
const cE = f => fs.existsSync(path.join(root, f));
let ok = 0, ko = 0;
const t = (n, c, i = '') => { c ? (ok++, console.log('  ✓ ' + n + (i ? ' — ' + i : '')))
                                : (ko++, console.log('  ✗ ' + n + (i ? ' — ' + i : ''))); };

t('esiste un file di esempio', cE('supabase-config.example.js'));
t('il file reale NON è nel pacchetto', !cE('supabase-config.js'),
  cE('supabase-config.js') ? 'sovrascriverebbe le chiavi di chi installa' : '');
t('l\'esempio dice che non è il file caricato', /non viene caricato/.test(leggi('supabase-config.example.js')));
t('e spiega cosa fare', /Copialo in `supabase-config\.js`/.test(leggi('supabase-config.example.js')));
t('l\'esempio è comunque privo di chiavi',
  !/eyJ[A-Za-z0-9_-]{20,}/.test(leggi('supabase-config.example.js')) &&
  !/sb_(publishable|secret)_[A-Za-z0-9]{6,}/.test(leggi('supabase-config.example.js')));

const html = leggi('learn.html');
t('la pagina carica il file reale, non l\'esempio',
  /<script src="supabase-config\.js"><\/script>/.test(html) && !/example\.js"><\/script>/.test(html));

const sw = leggi('sw.js');
t('il service worker non mette in cache la configurazione',
  !/'supabase-config\.js'/.test(sw), 'una copia in cache maschererebbe le chiavi nuove');
t('e nemmeno l\'esempio', !/supabase-config\.example\.js'/.test(sw));

const cloud = leggi('cloud.js');
t('il messaggio di blocco dice come rimediare',
  /supabase-config\.example\.js/.test(cloud) && /SUPABASE-SETUP\.md/.test(cloud));
t('e non si limita a constatare il problema', !/before the game can be used/.test(cloud));

const setup = leggi('SUPABASE-SETUP.md');
t('le istruzioni nominano il file di esempio', /example/i.test(setup),
  'da aggiornare se manca');

console.log(`\nConfigurazione protetta: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
