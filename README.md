# World of Trade

An interactive course in **physical commodity trading**, built as a short-lesson app in the
Duolingo mould: bite-sized levels, immediate feedback, a written explanation behind every
answer.

- **27 units · 143 levels · 706 exercises**
- **88-term glossary** covering incoterms, quotational periods, basis, carry, chartering,
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
curriculum.js          9 hand-written units, 166 exercises
content-engine.js      deterministic generator for the remaining units
glossary.js            88 terms
sw.js                  service worker (offline support)
tests/                 26 verification suites, 579 assertions
capacitor.config.ts    native shell configuration
MOBILE-APP-SETUP.md    building the iOS/Android apps
```

## Content

Unit 1–9 are written by hand and cover the fundamentals: what a physical trade is, incoterms,
quality and quantity, pricing and quotational periods, freight and chartering, documents and
payment, risk and hedging, storage and blending, and compliance and financial crime.

Beyond Unit 9 the content engine generates exercises deterministically from a seed, so the
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

## Before publishing

Two things are deliberately left to you.

**1. Supabase keys.** `supabase-config.js` is not in this repository and is listed in
`.gitignore`. Create it from `supabase-config.example.js` with your project URL and your
**publishable** key. Never put a `service_role` or `sb_secret_...` key in it — that key is
readable by anyone who opens the page. The app detects a secret key, disables cloud sync and
shows a warning. With no config at all, the app runs locally and simply does not sync.

**2. Privacy notice.** `privacy.html` contains four placeholders:
`[NOME E INDIRIZZO DEL TITOLARE]`, `[INDIRIZZO EMAIL DI CONTATTO]`,
`[REGIONE DEL PROGETTO SUPABASE]`, `[DATA]`. Fill them in before the site goes public;
`tests/legale.mjs` will go green when you do.

## Licence

All rights reserved.
