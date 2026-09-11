## Version 0.7.4 — support restored

The public landing keeps Login/Create account and restores the $4.99 PayPal support section and public contributor wall.

# World of Trade

An interactive game for **physical commodity trading**, built around short desk lessons in the
Duolingo mould: bite-sized levels, immediate feedback, a written explanation behind every
answer.

- **34 units · 219 levels · 1,086 exercises**
- **171-term glossary** covering incoterms, quotational periods, basis, carry, chartering, insurance,
  documentary credits, hedging and compliance
- Runs as a website, installs as a PWA, and ships as a native iOS/Android shell via Capacitor
- No framework, no build step — plain HTML, CSS and JavaScript

## Run it

Any static server, from the repository root:

```bash
python -m http.server 8000
```

```bash
npx --yes serve -l 8000 .
```

Then open `http://localhost:8000/`. The root page is the public landing page and deploys to Vercel as-is — no build step.

No configuration is required to play: **Start trading** on the entrance screen opens the game
straight away and the career is saved in the browser. Supabase is only needed for accounts,
cross-device sync and the social features; see *Configuration* below.

While developing, remember the service worker: it serves `app.js`, `styles.css` and the rest from
its own cache, so a hard reload can still show you the previous build. Either bump `VERSION` in
`sw.js` or unregister the worker and clear the cache from the browser's application panel.

## Structure

```
index.html             the public home / landing page
landing.html           legacy landing alias with the same public content
site.css / site.js     the bar and footer shared by every public page
404.html               branded not-found page
learn.html             the game shell
native-index.html      preserved native-shell launcher (redirects to learn.html)
curriculum.js          16 core trading units, hand-written: 111 levels, 546 exercises
scenes.js              the sixteen SVG scenes used as section backgrounds
content-engine.js      deterministic generator for the specialist desks
glossary.js            171 terms, also used in-lesson by the coach
intro.js               the two-screen first-run introduction
cloud.js               accounts, guest mode and Supabase sync
sound.js               synthesised sound effects — no audio files
sw.js                  service worker (offline support, and the cache version)
tests/                 47 verification suites
capacitor.config.ts    native shell configuration
MOBILE-APP-SETUP.md    building the iOS/Android apps
```

## Content

The career path starts with **sixteen core trading units** covering economics, quantitative methods, financial analysis, law, shipping, sustainability, technology, pricing, derivatives, energy, metals, agriculture and finance. Each unit
is one section of the path, with its own background scene and colour palette:

The sixteen foundation units are:

1. International Economics and Trade
2. Quantitative Methods
3. Financial Statements Analysis
4. Legal Aspects & Regulations
5. Shipping
6. Sustainability, Business Ethics & Human Rights
7. Information Technologies and Innovations
8. Commodity Price Mechanisms
9. Hedging Tools & Techniques
10. Options
11. Energy I (Oil & Gas)
12. Energy II (Renewable)
13. Metals, Ores & Minerals
14. Soft Commodities
15. Trade Finance Banking Instruments
16. Types of Financing for Commodity Companies


All 111 foundation levels are written by hand. Beyond them the content engine generates
exercises deterministically from a seed, so the same specialist level always produces the same
questions. Every numeric exercise is checked by the test
suite against an independent arithmetic oracle, and every exercise carries an explanation
that states the reasoning, not just the sum.

## Tests

```bash
cd tests
npm install     # jsdom
node run.mjs
```

The suites load the real pages in jsdom and execute exactly the scripts the HTML declares, so
a script that is never loaded fails the suite rather than failing silently in the browser.
They cover: arithmetic correctness of generated exercises, consistency between the accepted
answer and its explanation, uniqueness, WCAG contrast measured numerically, startup with no
console errors or unhandled rejections, the lives/reveal economy, streaks, sharing, and the
protection of the Supabase configuration.

`legale.mjs` fails on purpose until the placeholders in `privacy.html` are filled in — see below.

## Configuration

`supabase-config.js` holds the project URL and the **publishable** key. Both are meant to be
public: the browser has to send them on every request, so they are visible to anyone who opens
the site, and committing them here changes nothing. What protects the data is Row Level
Security on the Supabase side, not the secrecy of this key.

A `service_role` / `sb_secret_...` key is the opposite: it bypasses every policy. It must never
appear in this repository or in any file the browser can load. The app checks for one at
startup, disables cloud sync and shows a warning if it finds it. Start from
`supabase-config.example.js`; with no config at all the app runs locally and simply does not
sync.

## Licence

All rights reserved.


## Core Experience v0.5
This build focuses on the first ten minutes: fast onboarding, desk-entry briefing, decision-by-decision progress, stronger level rewards, direct next-level flow and a more game-like Desk Challenge vocabulary.

## Lifebuoy economy
- Maximum: 5.
- Career / Trading Floor mistakes spend lifebuoys; Practice is free.
- Regeneration: 1 every 6 minutes.
- From 0/5, a full refill to 5/5 always takes 30 minutes.
- Streaks do not regenerate lifebuoys instantly.
- Refill progress persists across app closes and cloud sync.



## Reward & Progression v0.5.5
This pass strengthens the core Career loop without adding new game modes: clearer current assignments, animated promotion progress, visible new achievements, full-screen desk unlocks and career-promotion milestones.


## v0.6 Account & Social
Profile now contains Account & Settings. League is split into League, Friends and Challenges, with searchable Trader IDs, real friend requests and the existing deterministic desk-duel engine. Run the v0.6 SQL block in `SUPABASE-SETUP.md` before enabling trader search/friend requests/delete account.

## v0.6.1 — Mobile stability
The five main tabs now behave like stable native app canvases. Only the destination hub is refreshed, scroll restoration happens before paint, mobile reveal animations cannot leave content temporarily invisible, and every hub shares the same header/bottom-bar safe-area geometry. League sub-tabs and Account sheets also use stable scroll handling.

## v0.8.0 — One Site
The public pages became one site: a sticky bar with the sections and a permanent **Start trading**,
a shared footer, a Compete section built on the game's real divisions and trading houses, a glossary
section, a branded 404, `robots.txt` and `sitemap.xml`. Deploy configuration moved from twenty
per-file cache rules to six patterns, plus security headers.

The game gained sound — synthesised, nothing downloaded, off until you turn it on — and **Sound and
feel** in Profile, where a player without an account can actually reach it.

## v0.7.0 — Open Door & the Trail
The game no longer asks who you are before it lets you play: **Start trading** opens the Career Path
immediately, the career is kept on the device, and creating an account later merges it rather than
replacing it. The Career Path is drawn as a winding trail of level tokens with a START bubble on the
current one and a trophy at the end of each desk. Practice gained per-skill drills, weakest skill
first. A 50 XP daily goal is drawn as a ring around the streak flame.

The League screen had not been drawing at all — a removed element threw inside its render function
and took the emblem, the trading houses, the achievements and the standings with it. The verification
suite could not open a page on Windows, so 31 of its 46 files aborted before their first assertion;
both are fixed, and the suite runs 840 assertions. See `CHANGELOG.md` for the full list.

### Public landing and accounts

The public domain (`/`) is always the presentation landing page. Account access lives on
`/login` and `/register`; after successful authentication the user is sent to the game.
The game page is intentionally `noindex` so search engines surface the landing instead.

`login.html` and `register.html` use the same `supabase-config.js` as `learn.html`. Keep the
existing deployment-specific file in the repository: it is intentionally not included in
release archives because its correct public project values belong to the deployment.
