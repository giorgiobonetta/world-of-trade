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

Then open `http://localhost:8000/landing.html`. It deploys to Vercel as-is — no build step.

## Structure

```
landing.html           public landing page
learn.html             the game shell
index.html             splash used by the native shell (redirects to learn.html)
curriculum.js          16 core trading units, hand-written: 111 levels, 546 exercises
scenes.js              the sixteen SVG scenes used as section backgrounds
content-engine.js      deterministic generator for the specialist desks
glossary.js            171 terms, also used in-lesson by the coach
intro.js               the three-screen first-run introduction
sw.js                  service worker (offline support)
tests/                 37 verification suites
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
