# World of Trade — v0.8.3 Stabilization

World of Trade is a game-based learning product for **physical commodity trading**. The current release is focused on product consistency, account reliability, PWA freshness, social integrity and regression prevention rather than adding new game modes.

## Current product

- **34 units · 219 Career levels · 1,086 exercises**
- Career Path, Practice, Deal of the Day, Flash Trading, Boss Deals and Trading Floor runs
- League, Trading Houses, Friends and Desk Challenges
- Public 171-term commodity glossary
- Account-first access with email confirmation, password recovery and session refresh
- PWA + Capacitor mobile shell
- Plain HTML/CSS/JavaScript; no production build step

## Important deployment rule

`supabase-config.js` is intentionally **not** included in release ZIPs. Keep the existing configured file in the repository, or create it from `supabase-config.example.js`. Because an account is required to enter the game, a missing Supabase URL/publishable key intentionally blocks access.

After uploading this release, run **`SUPABASE-V080-HARDENING.sql` once in Supabase → SQL Editor**. It hardens League and Desk Challenge writes, reduces social profile exposure, adds friend-request cooldown/blocking, creates the avatar bucket and enables database-backed contributor requests.

The official hosted PayPal Payment Link can be placed in:

```js
window.WOT_PAYPAL_PAYMENT_LINK = 'https://...';
```

If it is left empty, the current standard PayPal `$4.99 USD` fallback remains active. Never invent or commit a secret/service-role Supabase key.

## Run locally

Serve the repository from a static web server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. The public root is `index.html`; `Start trading` opens the unified `access.html` flow. `/login`, `/register` and `/landing` are redirects only and no longer have duplicate HTML implementations.

For the hidden developer self-check, open `/selftest.html`. It launches the game with `?sandbox=1`, which never reads or writes a real account.

## Main structure

```text
index.html                     public landing page
access.html / access-page.js   create account, login, recovery and reset
learn.html / app.js            game shell and main controllers
curriculum.js                  16 hand-written foundation units
content-engine.js              specialist desks; expands Career to 34 units
landing-curriculum.js          renders the public curriculum from the same runtime dataset
glossary.html                  public glossary page
cloud.js                       session refresh, sync and server-side RPC client
social.js / account-social.js  Friends, Challenges, Profile and account settings
SUPABASE-V080-HARDENING.sql    required v0.8.x database migration
sw.js / version.js             PWA cache + centralized browser release version
tests/release-v083.mjs         production release gate
```

## Quality gate

From the repository root:

```bash
npm test
node tests/aritmetica.mjs
node tests/coerenza.mjs
node tests/content-engine.mjs
node tests/competitive.mjs
node tests/unicita.mjs
```

The v0.8.2 release gate checks public/legal consistency, auth recovery and deep links, session refresh, avatar storage, account reauthentication before deletion, Practice/Career changes, social hardening, PWA/cache behavior, redirects, release assets and JavaScript syntax. Core curriculum tests independently verify numeric correctness, answer/explanation consistency, generated content validity and uniqueness.

GitHub Actions runs the production gate on every push/pull request. The browser job is intended to run Chromium at 320, 360, 390 and 430 px so mobile overflow/navigation regressions are caught before production.

## Supabase

Start with `SUPABASE-SETUP.md`, keep your configured `supabase-config.js`, and then run `SUPABASE-V080-HARDENING.sql`.

The browser may contain only a Supabase **publishable/anon** key. A `service_role` or `sb_secret_...` key must never be placed in a public file. Row Level Security and the v0.8 RPCs are what protect user data.

## Release notes

See `CHANGELOG.md` for older milestones. v0.8.3 is the stabilization release: account-first consistency, unified auth, reliable password recovery, safer session gating, server-mediated competitive writes, profile alias separation, Storage avatars, PWA cache freshness, legal/SEO consistency, accessibility focus handling and a new production test gate.
