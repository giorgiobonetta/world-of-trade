# World of Trade

An interactive course in **physical commodity trading**, built as a short-lesson app in the
Duolingo mould: bite-sized levels, immediate feedback, a written explanation behind every
answer.

- **30 units · 161 levels · 796 exercises**
- **109-term glossary** covering incoterms, quotational periods, basis, carry, chartering, insurance,
  documentary credits, hedging and compliance
- Runs as a website, installs as a PWA, and ships as a native iOS/Android shell via Capacitor
- No framework, no build step — plain HTML, CSS and JavaScript

## Run it

Any static server, from the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/landing.html`. It deploys to Vercel as-is — no build step.

## Structure

```
landing.html           public landing page
learn.html             the game shell
index.html             splash used by the native shell (redirects to learn.html)
curriculum.js          12 hand-written units, 256 exercises
content-engine.js      deterministic generator for the remaining units
glossary.js            109 terms
sw.js                  service worker (offline support)
tests/                 28 verification suites
capacitor.config.ts    native shell configuration
MOBILE-APP-SETUP.md    building the iOS/Android apps
```

## Content

Units 1–12 are written by hand. They cover the fundamentals — what a physical trade is,
incoterms, quality and quantity, pricing and quotational periods, freight and chartering,
documents and payment, risk and hedging, storage and blending, compliance and financial crime —
and then three areas that decide whether a modern trade works at all: the carbon and
sustainability regimes (EU ETS, CBAM, FuelEU, EUDR, RED III), marine cargo insurance and
casualty including general average, and contracts, arbitration and credit protection.

Beyond Unit 12 the content engine generates exercises deterministically from a seed, so the
same level always produces the same questions. Every numeric exercise is checked by the test
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
