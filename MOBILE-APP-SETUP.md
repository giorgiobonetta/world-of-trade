# World of Trade — Mobile App v0.3

This beta build contains a first UI/graphics cleanup for iOS and Android.

## What changed in v0.2

- fixed iPhone/Android top safe-area handling;
- all 5 primary sections now stay visible in the top navigation on phones;
- stable SVG navigation icons instead of device-dependent font glyphs;
- improved mobile touch targets and text readability;
- Hélène coach and social toasts no longer overlap the home indicator / each other;
- login, briefing and social dialogs remain scrollable when the mobile keyboard is open;
- reduced WebView background jank;
- native crest returns to Path instead of reloading the app;
- Supabase League/Friends reads now match authenticated RLS and support the current `division` / `weekly_xp` schema.

Questa cartella trasforma la v7.1 in una app nativa iOS + Android tramite Capacitor.

## Prima di compilare

1. Copia `www/supabase-config.example.js` in `www/supabase-config.js`.
2. Inserisci SOLO:
   - Project URL Supabase
   - publishable/anon public key
   - `siteUrl`: URL pubblico della landing page World of Trade (serve per referral/LinkedIn).
3. Non inserire mai `service_role`, `sb_secret_...` o altre secret key nel frontend.

## Android (Windows/macOS/Linux)

Prerequisiti: Node.js, Android Studio + Android SDK.

### Windows

Apri PowerShell nella cartella e lancia:

```powershell
./setup-android.ps1
```

Oppure manualmente:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio seleziona un emulatore/telefono e premi Run.
Per generare un APK di test: Build > Build APK(s).

## iPhone / iPad

Per compilare iOS serve macOS con Xcode.

```bash
npm install
npx cap add ios
npx cap sync ios
npx cap open ios
```

Poi seleziona un simulatore/iPhone in Xcode e premi Run.

## Struttura

- `www/` = gioco completo v7.1
- `www/index.html` = launcher nativo, apre direttamente login/gioco
- `www/landing.html` = copia della landing web (non è la schermata iniziale dell'app)
- `mobile-native.css` = adattamenti solo nativi
- `native-runtime.js` = marker runtime app
- `resources/` = icona e splash

## Aggiornare l'app dopo una modifica al gioco

Sostituisci/aggiorna i file dentro `www/`, mantenendo `index.html`, `native-runtime.js` e `mobile-native.css`, poi esegui:

```bash
npx cap sync
```

## Supabase Auth

La prima build usa email/password esattamente come il sito. Se la conferma email è attiva, il link può aprire temporaneamente il browser; al rientro nell'app l'utente effettua il login.

Per la release pubblica conviene aggiungere Universal Links / App Links così conferme e referral aprono direttamente World of Trade. Questo sarà il prossimo step prima della pubblicazione sugli store.

## Non ancora attivo in v0.1

- push notifications remote;
- App/Universal Links production;
- Sign in with Apple / Google;
- acquisti in-app;
- store signing/release metadata.

Il core del gioco, Supabase, League, Friends, referral, duelli e progressi sono già riusati dalla web app.

## v0.3 UI polish
This beta includes the second mobile UI pass: native-feeling bottom sheets, consistent card hierarchy, stronger Career/Play states, improved focus/tap feedback, overlay scroll locking, reduced-motion support, and a fix for Hélène's “Show my next level” action.
