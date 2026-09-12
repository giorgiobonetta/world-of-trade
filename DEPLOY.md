# Mettere online World of Trade

Il frontend è statico e non richiede una fase di build, ma dalla v0.8.2
**Supabase è parte necessaria del prodotto**: l'accesso è obbligatorio e progressi,
League, Friends, Challenges, avatar e Contributors usano il backend configurato.

**Costo dell'hosting: zero.** L'unica spesa possibile è un dominio tuo,
10–12 € l'anno. Il sottodominio gratuito `.vercel.app` include HTTPS, che
serve al service worker per farsi installare come app.

---

## 1 · Deploy su Vercel

`vercel.json` è già scritto per questa piattaforma: redirect legacy (`/landing` → `/`,
`/login` e `/register` → accesso unificato), URL puliti (`/glossary` invece di `/glossary.html`),
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

Vercel restituisce l'indirizzo vero. Gli indirizzi assoluti di homepage/social preview, sitemap e robots devono puntare
al dominio pubblico definitivo. Lo script di dominio aggiorna i riferimenti previsti,
altrimenti l'anteprima sui social e la sitemap puntano a pagine che non
esistono.

```bash
node set-domain.mjs https://il-tuo-indirizzo-vero
```

Poi di nuovo `npx vercel --prod`. Lo script legge il dominio attuale dalla
sitemap invece di averlo scritto dentro, quindi funziona anche alla seconda
migrazione, quando passerai al dominio definitivo.

## 3 · Prima di considerarlo finito

Esegui il gate di release:

```bash
npm test
node tests/aritmetica.mjs
node tests/coerenza.mjs
node tests/content-engine.mjs
node tests/competitive.mjs
node tests/unicita.mjs
```

La GitHub Action `.github/workflows/quality.yml` esegue gli stessi controlli e, solo dopo,
avvia Playwright/Chromium alle larghezze 320, 360, 390 e 430 px con smoke test e axe-core.
Il self-check resta disponibile a `/selftest.html`, ma è intenzionalmente nascosto dal footer pubblico.

---

## Il piano gratuito di Vercel, detto chiaramente

**Hobby è per uso non commerciale.** Finché è un progetto personale o una
vetrina, va bene. Se prevedi di monetizzarlo, il loro piano Pro costa 20 $ al
mese: a quel punto conviene **Cloudflare Pages**, gratuito anche per uso
commerciale e con banda illimitata. Costa una conversione — `vercel.json`
diventa due file, `_headers` e `_redirects`.

## Supabase obbligatorio

Le istruzioni complete sono in `SUPABASE-SETUP.md`. Prima del deploy conserva il tuo
`supabase-config.js` reale: il file non è incluso nel pacchetto per evitare di sovrascrivere
le chiavi pubbliche già configurate. Dopo il setup base, esegui una volta
`SUPABASE-V080-HARDENING.sql` nel SQL Editor di Supabase.

Non inserire mai `service_role` o secret key nel frontend.
