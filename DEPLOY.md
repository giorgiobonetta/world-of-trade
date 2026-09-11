# Mettere online World of Trade

Il sito è statico: nessuna compilazione, nessun server applicativo, nessun
database obbligatorio. Il gioco funziona per intero in modalità ospite, con la
carriera salvata nel browser. Un backend serve solo il giorno in cui vuoi
account veri e classifiche condivise.

**Costo dell'hosting: zero.** L'unica spesa possibile è un dominio tuo,
10–12 € l'anno. Il sottodominio gratuito `.vercel.app` include HTTPS, che
serve al service worker per farsi installare come app.

---

## 1 · Deploy su Vercel

`vercel.json` è già scritto per questa piattaforma: riscritture (`/` → landing,
`/play` → gioco), URL puliti (`/glossary` invece di `/glossary.html`),
intestazioni di cache e di sicurezza. Su un altro host quel file viene
ignorato e va tradotto: Vercel è insieme la scelta gratuita e quella a
lavoro zero.

Dalla cartella del progetto:

```bash
npx vercel login
```

```bash
npx vercel --prod
```

Alla prima esecuzione chiede scope, nome del progetto e cartella: accetta i
valori proposti e rispondi **no** a "override settings". Non serve Git —
carica la cartella così com'è.

`.vercelignore` tiene fuori `tests/node_modules`: senza, caricheresti 15 MB
di jsdom contro i 3 MB di tutto il resto.

## 2 · Allineare il dominio

Vercel restituisce l'indirizzo vero. Sette indirizzi assoluti nel progetto
— `og:url` e `og:image` in `landing.html`, i quattro `<loc>` di `sitemap.xml`
e la riga `Sitemap:` di `robots.txt` — vanno portati su quell'indirizzo,
altrimenti l'anteprima sui social e la sitemap puntano a pagine che non
esistono.

```bash
node set-domain.mjs https://il-tuo-indirizzo-vero
```

Poi di nuovo `npx vercel --prod`. Lo script legge il dominio attuale dalla
sitemap invece di averlo scritto dentro, quindi funziona anche alla seconda
migrazione, quando passerai al dominio definitivo.

## 3 · Prima di considerarlo finito

```bash
cd tests && npm install && node run.mjs
```

828 asserzioni su 45 suite. Con il sito online, apri anche `/selftest`: apre
il gioco in un iframe e ci gioca davvero, misurando contrasto, dimensioni
toccabili e sovrapposizioni nel browser vero. Sono 43 controlli, tutti verdi.
`robots.txt` la tiene fuori dagli indici.

---

## Il piano gratuito di Vercel, detto chiaramente

**Hobby è per uso non commerciale.** Finché è un progetto personale o una
vetrina, va bene. Se prevedi di monetizzarlo, il loro piano Pro costa 20 $ al
mese: a quel punto conviene **Cloudflare Pages**, gratuito anche per uso
commerciale e con banda illimitata. Costa una conversione — `vercel.json`
diventa due file, `_headers` e `_redirects`.

## Quando vorrai gli account

Le istruzioni SQL sono in `SUPABASE-SETUP.md`. Copia
`supabase-config.example.js` in `supabase-config.js` e inserisci URL e chiave
**publishable** (mai la `service_role`: l'app se ne accorge, spegne la
sincronizzazione e lo scrive a schermo).

Un avvertimento onesto: sul piano gratuito di Supabase il progetto **va in
pausa dopo circa una settimana senza traffico** e va risvegliato a mano dalla
dashboard. Per un lancio è accettabile; con utenti veri servono 25 $ al mese.

Senza configurazione non succede niente di male: il gioco resta in modalità
ospite e nessuna funzione sparisce, tranne la sincronizzazione fra dispositivi
e le funzioni sociali.
