# Attivare il salvataggio della carriera

Serve un progetto Supabase gratuito. Dieci minuti, una volta sola.
Finché non lo fai, l'app funziona esattamente come prima: nessun login, progressi
salvati solo sul dispositivo. Non si rompe niente.

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

**Project Settings** → **API**:

- **Project URL** → qualcosa tipo `https://abcdefgh.supabase.co`
- **anon public** → una stringa lunga che inizia con `eyJ…`

Aprile `supabase-config.js` e incollale:

```js
window.WOT_CLOUD = {
  url: 'https://abcdefgh.supabase.co',
  anonKey: 'eyJhbGciOi…',
};
```

La chiave `anon` è **pubblica per definizione**: sta nel codice di ogni sito che usa
Supabase e non è un segreto. Quello che protegge i dati sono le policy del punto 2.
La chiave **`service_role`** invece è un segreto assoluto: non deve finire mai nel
codice del sito, in nessuna circostanza.

## 4 · Conferma via email

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

## 5 · Pubblica

Carica tutto e apri il sito. Sotto il percorso comparirà
**"Save your progress to an account"**.

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
