/* La cornice del sito: barra in alto, piede, ancore e file di servizio.
   Quello che rompe un sito di tre pagine, in ordine di frequenza: un
   collegamento che punta a una sezione che non esiste più, una pagina che
   perde la barra e diventa un vicolo cieco, e una sitemap che elenca
   indirizzi che rispondono 404. Qui si controllano esattamente quelle tre. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leggi = f => fs.readFileSync(path.join(root, f), 'utf8');
const esiste = f => fs.existsSync(path.join(root, f));

let ok = 0, ko = 0;
const t = (nome, buono, extra = '') => {
  if (buono) { ok++; console.log('  ✓ ' + nome + (extra ? ' — ' + extra : '')); }
  else { ko++; console.log('  ✗ ' + nome + (extra ? ' — ' + extra : '')); }
};

/* Le pagine che compongono il sito, distinte dal gioco. */
const PAGINE = ['landing.html', 'glossary.html', 'privacy.html', '404.html'];

for (const f of PAGINE) {
  t(`${f} esiste`, esiste(f));
  if (!esiste(f)) continue;
  const s = leggi(f);
  t(`${f}: carica la cornice`, /site\.css/.test(s) && /site\.js/.test(s));
  t(`${f}: ha la barra del sito`, /class="site-nav"/.test(s));
  t(`${f}: il marchio torna alla presentazione`,
    /class="site-brand" href="\/"/.test(s));
  t(`${f}: l'invito a giocare è sempre in vista`,
    /class="site-cta" href="learn\.html"/.test(s));
  t(`${f}: ha il piede del sito`, /class="site-footer"/.test(s));
  t(`${f}: si può saltare la navigazione`, /class="skip-link" href="#main"/.test(s));
  t(`${f}: esiste il bersaglio del salto`, /id="main"/.test(s));
}

/* Il gioco NON deve avere la barra del sito: là la navigazione è quella
   dell'app, e una seconda barra ruberebbe schermo al percorso. */
{
  const learn = leggi('learn.html');
  t('il gioco non monta una seconda barra', !/class="site-nav"/.test(learn));
  t('ma il suo crest riporta al sito', /class="brand-link" href="\/"/.test(learn));
}

/* Ogni ancora citata dalla cornice deve esistere nella pagina che la ospita. */
{
  const landing = leggi('landing.html');
  const ancore = [...landing.matchAll(/href="(?:landing\.html)?#([a-z0-9-]+)"/g)].map(m => m[1]);
  const mancanti = [...new Set(ancore)]
    .filter(id => id !== 'main' && !new RegExp(`id="${id}"`).test(landing));
  t('ogni ancora della presentazione esiste', mancanti.length === 0, mancanti.join(','));
  t('e ce ne sono, non è un elenco vuoto', ancore.length >= 3, ancore.length + ' ancore');
}

/* Nessuna pagina può continuare a promettere che serve un account: si gioca
   subito, ed è la prima cosa che un visitatore verifica. */
for (const f of PAGINE.filter(esiste)) {
  const s = leggi(f);
  t(`${f}: non chiede un account per giocare`,
    !/secure account is required|account is required to enter/i.test(s));
}

/* File di servizio. */
{
  t('esiste robots.txt', esiste('robots.txt'));
  t('esiste sitemap.xml', esiste('sitemap.xml'));
  if (esiste('robots.txt') && esiste('sitemap.xml')) {
    const robots = leggi('robots.txt');
    t('robots.txt indica la sitemap', /Sitemap:\s*https?:\/\/\S+sitemap\.xml/.test(robots));
    t('e tiene l\'autodiagnosi fuori dall\'indice', /Disallow:\s*\/selftest/.test(robots));

    const sitemap = leggi('sitemap.xml');
    const loc = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    t('la sitemap elenca la home e il gioco',
      loc.some(u => /\/$/.test(u)) && loc.some(u => /\/learn$/.test(u)), loc.length + ' indirizzi');
    // cleanUrls: /glossary corrisponde a glossary.html sul disco
    const vercel = JSON.parse(leggi('vercel.json'));
    const riscritture = (vercel.rewrites || []).map(r => r.source);
    const mancanti = loc.map(u => new URL(u).pathname)
      .filter(p => p !== '/' && !riscritture.includes(p) && !esiste(p.replace(/^\//, '') + '.html'));
    t('ogni indirizzo della sitemap corrisponde a una pagina', mancanti.length === 0, mancanti.join(','));
    t('la sitemap non elenca l\'autodiagnosi', !loc.some(u => /selftest/.test(u)));
  }
}

/* La shell offline deve contenere la cornice, o le pagine si aprono nude. */
{
  const sw = leggi('sw.js');
  for (const f of ['site.css', 'site.js', '404.html'])
    t(`${f} è nella shell offline`, sw.includes(`'${f}'`));
}

console.log(`\nCornice del sito: ${ok} passati, ${ko} falliti`);
process.exitCode = ko ? 1 : 0;
