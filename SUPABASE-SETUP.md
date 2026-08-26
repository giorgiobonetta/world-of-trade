# Attivare il salvataggio della carriera

Serve un progetto Supabase. L'accesso è ora obbligatorio: finché URL e chiave pubblica non sono configurati, World of Trade mostra la schermata di accesso ma non permette di entrare nel gioco. Una volta configurato, ogni giocatore deve registrarsi o accedere prima di usare Career Path, Play, Practice e League.

---

## 1 · Crea il progetto

1. Vai su **supabase.com** e registrati.
2. **New project**. Nome a piacere, password del database a piacere (serve solo a te,
   non agli utenti). Regione: scegli **Frankfurt** o **Zurich** — i dati restano in
   Europa e sei in Svizzera.
3. Aspetta un paio di minuti che finisca di crearsi.

## 2 · Crea la tabella

Apri **SQL Editor** → **New query**, incolla tutto questo e premi **Run**:

```sql
-- una riga per utente, con dentro la carriera in JSON
create table public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- senza questa riga chiunque potrebbe leggere le carriere di tutti
alter table public.progress enable row level security;

create policy "ognuno legge solo la propria"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "ognuno crea solo la propria"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "ognuno aggiorna solo la propria"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

`enable row level security` è la riga che conta. Senza, la chiave pubblica che sta nel
codice permetterebbe a chiunque di leggere e scrivere le carriere di tutti gli altri.

## 3 · Copia le due chiavi

Nella barra a sinistra, in fondo: **Project Settings** (l'ingranaggio) → **API**.
Su alcuni progetti la voce si chiama **API Keys**, o le trovi nel pulsante
**Connect** in alto.

Ti servono **due** cose:

**a) Project URL** — in cima, qualcosa come `https://abcdefgh.supabase.co`.

**b) La chiave PUBBLICA.** Qui dipende da quanto è nuovo il progetto:

| Se vedi… | Prendi | Ha questa forma |
|---|---|---|
| `anon` `public` | quella | `eyJhbGciOiJI...` (lunghissima) |
| `Publishable key` | quella | `sb_publishable_...` |
| un pulsante **Create new API keys** | il progetto è ancora sulle chiavi vecchie: usa `anon public` | `eyJ...` |

Vanno bene entrambe. Le chiavi `anon` funzionano ancora ma Supabase le sta
dismettendo entro fine 2026, quindi se il tuo progetto ha già la `publishable`,
usa quella.

### La chiave da NON toccare

Nella stessa pagina c'è **`service_role`** (o **`sb_secret_...`**). Quella scavalca
tutte le policy di sicurezza del punto 2: chi ce l'ha può leggere, modificare e
cancellare qualunque riga di qualunque utente.

**Non deve finire nel sito, mai.** Se la incolli per sbaglio in
`supabase-config.js`, l'app se ne accorge: si spegne e mostra un avviso rosso invece
di funzionare. Ma il danno è già fatto — vai su **Project Settings → API** e
revocala (*rotate*) subito.

La chiave pubblica invece **è fatta per stare nel codice**: sta nel sorgente di ogni
sito che usa Supabase. Non è un segreto. Quello che protegge i dati sono le policy
che hai creato al punto 2, non la segretezza della chiave.

## 4 · Incolla le chiavi nel codice

Apri `supabase-config.js` e riempi due campi (tre se vuoi il link di condivisione):

```js
window.WOT_CLOUD = {
  url: 'https://abcdefgh.supabase.co',

  anonKey: 'eyJhbGciOi…',        // se hai la chiave vecchia, metti qui
  publishableKey: '',            // se hai quella nuova, metti qui invece

  siteUrl: 'https://world-of-trade.vercel.app',
};
```

Riempi **uno** dei due campi della chiave, non serve entrambi. Ricarica solo questo
file su GitHub e aspetta il redeploy.

Come capire se ha funzionato: apri `/learn`, e sotto il percorso deve comparire
**"Save your progress to an account"**. Se non compare, apri la console del browser
(F12) e guarda se c'è un errore — di solito è un URL con uno spazio o una barra di
troppo in fondo.

## 5 · Conferma via email

**Authentication** → **Providers** → **Email**.

- **Confirm email attivo** (default): dopo la registrazione l'utente riceve una mail e
  deve cliccare prima di poter entrare. L'app lo dice e lo gestisce. Più sicuro, e
  impedisce a qualcuno di registrarsi con l'email di un altro.
- **Disattivato**: si entra subito dopo la registrazione. Più comodo, meno protetto.

Consiglio di lasciarlo attivo. In **Authentication → URL Configuration** metti il
dominio del sito come **Site URL**, altrimenti il link di conferma rimanda a localhost.

Sul piano gratuito Supabase manda poche email al giorno da un mittente condiviso, e
finiscono facilmente nello spam. Se il progetto cresce, si collega un servizio SMTP
proprio in **Authentication → Emails**.

## 6 · Accesso con LinkedIn (opzionale)

Questa parte richiede un passaggio in più perché LinkedIn è più esigente di altri.

1. Vai su **linkedin.com/developers** → **Create app**.
2. **Serve una Pagina LinkedIn** (una company page) da associare all'app. Se non ne
   hai una, creane una: è gratis e ci vogliono due minuti. Senza Pagina LinkedIn non
   ti lascia creare l'app — è il punto dove si bloccano tutti.
3. Nella scheda **Products** aggiungi **Sign In with LinkedIn using OpenID Connect**.
   È self-service, si attiva subito.
4. Nella scheda **Auth**, sotto **Authorized redirect URLs**, incolla:

   ```
   https://TUO-PROGETTO.supabase.co/auth/v1/callback
   ```

   Quello è l'indirizzo di **Supabase**, non del tuo sito. Sbagliarlo è l'errore più
   comune e produce un `redirect_uri_mismatch`.
5. Copia **Client ID** e **Client Secret**.
6. In Supabase: **Authentication** → **Providers** → **LinkedIn (OIDC)**. Attivalo e
   incolla le due chiavi. Attenzione: nella lista ci sono due voci simili, `LinkedIn`
   e `LinkedIn (OIDC)`. Serve **OIDC** — l'altra usa un'API che LinkedIn ha dismesso.
7. Salva. Il pulsante **Continue with LinkedIn** funziona già: nel codice il provider
   è `linkedin_oidc`.

Da LinkedIn arriva nome ed email. Se un utente entra prima con l'email e poi con
LinkedIn, per Supabase sono due account distinti a meno che tu non attivi
**Authentication → Settings → Link identities with the same email**. Consiglio di
attivarlo, altrimenti la stessa persona si ritrova due carriere separate.

## 7 · Prova

1. Apri `/learn` e registrati con la tua email.
2. Fai una lezione.
3. In Supabase, **Table Editor** → `progress`: deve esserci una riga con il tuo
   `user_id` e il JSON della carriera dentro `state`.
4. Apri il sito in una finestra anonima, accedi con lo stesso account: deve
   ritrovare la lezione fatta.

Il punto 3 è quello che conferma che le policy funzionano. Se la riga non compare,
l'errore è quasi sempre nel blocco SQL del punto 2.

---

## Cosa succede ai dati

- Si salva **solo** l'email (serve a identificare l'account) e il JSON della carriera:
  lezioni fatte, XP, accuratezza, badge, errori da ripassare.
- Niente tracciamento, niente analytics, nessuna terza parte oltre a Supabase.
- La carriera resta **anche** sul dispositivo: uscendo dall'account non si perde nulla.
- Per cancellare un account: **Authentication → Users → Delete user**. La riga in
  `progress` sparisce da sola grazie a `on delete cascade`.

Se pubblichi il sito in Europa e raccogli email, ti serve una riga di privacy policy
che dica queste tre cose. Non è un adempimento pesante, ma va scritto.

## Come vengono unite due carriere

Se giochi sul telefono e poi entri dal portatile, i due progressi si **fondono**, non
si sovrascrivono:

| Campo | Regola |
|---|---|
| lezioni completate | unione — nessuna sparisce mai |
| XP | il valore più alto, mai la somma (altrimenti si conterebbe due volte) |
| accuratezza per lezione | la migliore |
| badge dei checkpoint | il migliore |
| errori da ripassare | il conteggio più alto, così il ripasso non dimentica |
| streak | il più lungo |

La fusione è commutativa e idempotente: l'ordine non conta e rifarla non cambia niente.
Entrambe le proprietà sono verificate dai test in `sync.mjs`.


---

## 8 · Classifica settimanale reale (opzionale, v5)

La tabella `progress` resta privata. La League usa invece una seconda tabella minimale:
non contiene email né stato della carriera, soltanto alias pubblico, Trading House,
divisione e XP della settimana.

In **SQL Editor** esegui anche questo blocco se vuoi attivare la classifica online:

```sql
create table public.league_scores (
  week       text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  alias      text not null check (char_length(alias) between 3 and 24),
  house      text,
  tier       text not null default 'bronze',
  score      integer not null default 0 check (score >= 0),
  updated_at timestamptz not null default now(),
  primary key (week, user_id)
);

alter table public.league_scores enable row level security;

-- La classifica deve poter essere letta anche da chi non ha fatto login.
-- Non contiene email: l'interfaccia mostra solo alias/house/tier/score.
create policy "league pubblica in lettura"
  on public.league_scores for select
  using (true);

-- Un utente autenticato può pubblicare soltanto la propria riga.
create policy "league inserisce solo se stesso"
  on public.league_scores for insert
  with check (auth.uid() = user_id);

create policy "league aggiorna solo se stesso"
  on public.league_scores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index league_scores_week_tier_score_idx
  on public.league_scores (week, tier, score desc);
```

### Privacy della League

La tabella pubblica contiene solamente:

- `alias` scelto dal giocatore;
- house selezionata;
- divisione competitiva;
- XP settimanali;
- identificativo tecnico `user_id` usato da Supabase per impedire che un utente
  modifichi la riga di un altro.

**Non contiene l'email.** L'app non mostra mai `user_id` nell'interfaccia.

Se non crei questa tabella, il tab League continua a funzionare come **Local preview**
e il normale salvataggio cloud della carriera resta operativo.
