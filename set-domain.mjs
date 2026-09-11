/* Cambia il dominio pubblico in tutti i punti che lo contengono.
 *
 *   node set-domain.mjs https://mio-sito.vercel.app
 *
 * Gli indirizzi assoluti servono a tre cose che non accettano percorsi
 * relativi: l'anteprima sui social (og:url, og:image), la sitemap e la riga
 * Sitemap: di robots.txt. Sono pochi e sparsi, ed è esattamente il tipo di
 * cosa che si dimentica passando dal sottodominio di prova al dominio vero —
 * con il risultato che Google indicizza indirizzi che non esistono più.
 *
 * Il dominio attuale non è scritto qui dentro: si legge dalla sitemap. Un
 * elenco di domini "vecchi" nel codice funziona una volta sola, e alla
 * seconda migrazione lo script non riconosce più niente.
 */
import fs from 'fs';

const nuovo = (process.argv[2] || '').trim().replace(/\/+$/, '');
if (!/^https?:\/\/[^/\s]+$/.test(nuovo)) {
  console.error('Uso: node set-domain.mjs https://dominio-vero.tld');
  process.exit(1);
}

const SITEMAP = 'sitemap.xml';
if (!fs.existsSync(SITEMAP)) {
  console.error('Manca ' + SITEMAP + ': è da lì che si legge il dominio attuale.');
  process.exit(1);
}
const attuale = (fs.readFileSync(SITEMAP, 'utf8').match(/<loc>(https?:\/\/[^/<]+)/) || [])[1];
if (!attuale) {
  console.error('Nessun <loc> assoluto in ' + SITEMAP + ': impossibile dedurre il dominio attuale.');
  process.exit(1);
}
if (attuale === nuovo) {
  console.log('Il dominio è già ' + nuovo + ': niente da fare.');
  process.exit(0);
}

const cerca = new RegExp(attuale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
let totale = 0;
for (const f of ['index.html', 'landing.html', SITEMAP, 'robots.txt']) {
  if (!fs.existsSync(f)) { console.warn('saltato (non esiste): ' + f); continue; }
  const prima = fs.readFileSync(f, 'utf8');
  const n = (prima.match(cerca) || []).length;
  if (n) fs.writeFileSync(f, prima.replace(cerca, nuovo));
  totale += n;
  console.log(`${f}: ${n} indirizzi aggiornati`);
}

console.log(totale
  ? `\nFatto: ${totale} indirizzi da ${attuale} a ${nuovo}`
  : `\nNessun indirizzo trovato per ${attuale}: controlla i file a mano.`);
