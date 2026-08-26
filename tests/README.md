# Test

Non fanno parte del sito: `.vercelignore` esclude questa cartella dal deploy.

```
cd tests
npm install
npm test
```

`harness.mjs` carica `learn.html` in jsdom **eseguendo gli script che la pagina
dichiara**, nel suo ordine, invece di un elenco scritto a mano. Quella scelta non è
stilistica: una volta `mascot.js` era stato dimenticato nell'HTML e i test passavano
comunque, perché li caricavano da una lista propria. Hélène non appariva da nessuna
parte nell'app e nessuna suite se ne accorgeva.

| Suite | Cosa protegge |
|---|---|
| `regressioni.mjs` | cablaggio degli script, totali del curriculum, Hélène nei tre punti, ripasso e checkpoint, compatibilità dei salvataggi, i due bug storici dell'engine, accessibilità, PWA e cache, ritaglio dei loghi |
| `streak.mjs` | la serie di risposte: cresce solo al primo colpo, si azzera sull'errore, attraversa le lezioni, si fonde col cloud |
| `linkedin.mjs` | reindirizzamento OIDC, ritorno con i token nel frammento, pulizia dell'indirizzo, rifiuto dell'utente, id ricavato dal token |
| `condivisione.mjs` | soglia del pulsante, testo del post, link a LinkedIn, pannello accessibile, degradazione senza canvas |
| `visibilita.mjs` | che l'attributo `hidden` non venga annullato da una regola CSS con `display` |
| `glossario.mjs` | coerenza col curriculum, ricerca, filtri, ordinamento per pertinenza |
| `linkdiretto.mjs` | `?lesson=` apre solo ciò che è sbloccato, e non si rompe con parametri assurdi |
| `contrasto.mjs` | ogni coppia testo/fondo contro il fondo peggiore su cui può capitare |
| `sandbox.mjs` | che `?sandbox=1` non tocchi la carriera vera né il cloud, e che la pagina di autodiagnosi controlli davvero ciò che serve |
| `card.mjs` | il disegno della card, verificato con un contesto 2D che registra le chiamate invece di rasterizzare |

## Cose che i test hanno trovato, non confermato

- `mascot.js` non era caricato: Hélène non compariva mai nell'app.
- Un esercizio `build` non poteva ripetere una parola (il banco filtrava per testo).
- Un `pairs` con due etichette destre identiche **segnava come sbagliate risposte
  giuste** nell'Unità 2.
- `Object.assign` copia il *valore* di un getter, non il getter: il flag `dirty` della
  sincronizzazione era congelato a `false` e nessun tentativo sarebbe mai stato ripetuto.
- Un checkpoint da 8 domande con 3 vite moriva prima di dare un punteggio.
- `--muted-2` non raggiungeva 4.5:1 sul punto più luminoso dello sfondo.
- `.node small` usava `--muted` su `royal-mid`: **3.81:1**, sulla schermata più vista
  dell'app, da sempre.
- `canvas.getContext` **lancia** quando il canvas non c'è, non restituisce `null`.
- Una regola d'autore `display:grid` annullava l'attributo `hidden`: il pannello di
  accesso restava aperto sopra l'app e, col cloud non configurato, nemmeno la X era
  agganciata. **Questo l'ha trovato l'utente, non i test** — guardavano `el.hidden`,
  che era `true`: la proprietà era giusta, il rendering no.

## Il limite di questa suite

Gira in Node: vede la logica e il DOM, non il rendering. Il bug del pannello che
copriva l'app è passato di qui indisturbato. Per quello c'è `selftest.html`, che si
apre nel browser vero e verifica visibilità calcolata, contrasto sui colori reali,
dimensione dei tocchi, font, canvas e service worker. Le due cose sono complementari:
questa suite gira a ogni modifica, quella si apre dopo ogni rilascio.

## Una trappola da ricordare

`getComputedStyle` in jsdom non è una prova. Senza iniettare il CSS non c'è cascata
da valutare, e anche iniettandolo jsdom non implementa `!important`. Un'asserzione su
`getComputedStyle` può passare qualunque cosa faccia il codice: è peggio di nessuna
asserzione, perché dà fiducia. `visibilita.mjs` verifica il testo del CSS, e sa
fallire — l'ho provato togliendo la correzione.
