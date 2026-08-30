# World of Trade — Experience v7

This build adds the experience/retention layer on top of the v6 content-overhaul build:

- redesigned top navigation for Path / Play / Practice / League / Profile;
- first-class mobile layout with safe-area support, touch-sized controls and horizontal game navigation;
- motion layer with reduced-motion accessibility support;
- animated Hélène coach with contextual explanation for every main section and a recall button;
- Opening Bell / Daily Briefing surfaced on Path, reusing the existing Daily Deal + Desk Quest economy;
- LinkedIn invite card with referral-tagged links and copyable invite text;
- referral capture scaffold (`wot_referrer_pending`) for the future friends graph/backend;
- PWA shell bumped to v26 and `experience.js` precached.

**LinkedIn friends leaderboard:** not faked in this build. LinkedIn's Connections API is restricted to approved developers. The recommended production fallback is an in-app Friends League built from accepted World of Trade referrals; if LinkedIn grants `r_1st_connections`, that layer can be reconciled with consenting 1st-degree connections.

---

# World of Trade — Learn

## v5.1 — Mandatory Access + Top Navigation

- Registration/sign-in is required before the game shell becomes accessible.
- Signing out or losing the session returns the player to the access gate.
- Path, Play, Practice, League and Profile now live in the sticky top header beside streak, career level and XP.
- Landing-page CTAs now lead to Sign in / Create account.
- Supabase remains the authentication backend; with an empty config the game intentionally stays locked.


Learn physical commodity trading step by step. Short lessons, immediate feedback,
from the very basics upward.

## Run it

Any static server. Locally:

```
python -m http.server 8000
```

then open `http://localhost:8000`. Deploys to Vercel as-is — no build step.

## Two pages

| File | URL | What it is |
|---|---|---|
| `index.html` | `/` | Landing page — pitch, curriculum, a live sample exercise, CTA |
| `learn.html` | `/learn` | The app itself (the path, the lessons, progress) |
| `sw.js`, `pwa.js`, `manifest.webmanifest` | — | Installability and offline |
| `cloud.js`, `supabase-config.js` | — | Mandatory authentication and cloud career save |
| `share.js` | — | Streak card and LinkedIn sharing |
| `glossary.html` | `/glossary` | 70 terms, searchable, linked to the lessons |
| `selftest.html` | `/selftest` | In-browser diagnostics; `noindex`, not linked from the UI |
| `tests/` | — | Test suite, excluded from deploy by `.vercelignore` |

`vercel.json` uses `cleanUrls` and **no rewrites**, so `/` serves the landing and
`/learn` serves the app. Do not reuse the old simulator's `vercel.json` — its
rewrites pointed at files that no longer exist and returned a 404.

The landing page is fully self-contained: its CSS, its two Hélène SVGs and its
scroll animations are all inline, so it renders even if `styles.css` fails. The
only external request is the Fredoka webfont, and there is a system fallback.
Every text/background pair on it clears WCAG AA (lowest measured 4.59:1).

## What's here

**27 units, 143 Career levels, 706 Career exercises — plus regenerated Trading Floor runs.**

### Competitive layer v5

The app now includes a fifth main tab, **League**. Competitive XP is seasonal: a week starts on Monday and only XP earned during that week counts. Six divisions are available — Bronze, Silver, Gold, Platinum, Diamond and Master — with promotion/relegation evaluated at rollover. The screen also contains six original Trading Houses and 18 achievements spanning Career, Flash, Trading Floor, Boss, Daily, streak, XP and skill mastery.

The League works immediately as a clearly-labelled **local preview**. If Supabase is configured and the optional `league_scores` table from `SUPABASE-SETUP.md` is installed, authenticated users are published to a real shared weekly leaderboard using only a public trader alias, house id, tier and score. Email is never written to the public standings. Missing league infrastructure never blocks normal cloud progress sync.


### Career game layer

### Trading House Academy v5

After Merchant Foundations, the Career Path now continues through three layers:

- **Desk Academy I** — Market Analysis & Fundamentals, Commercial Trading, Freight & Chartering.
- **Desk Academy II** — Trade Finance & Credit, Risk Management, Derivatives & Options.
- **Commodity Desks** — Metals, Oil & Products, Gas & LNG, Power, Agriculture, Origination & Contracts.

Each specialist world contains 6 levels. The Trading House Map at the top of the Path shows
which desks are complete, active or locked and jumps directly to an unlocked desk. Career
ranks are calibrated for the 143-level path: the original 31 Foundations now correspond
to the Junior Trader milestone; Trader, Senior Trader, Desk Head and Head of Trading require
progress through the specialist desks as well as XP. Partner remains an XP-heavy endgame rank.

**Trading Floor Run** is the endless layer. It unlocks after all 31 Merchant Foundations levels,
then generates a fresh 10-question run from the specialist content engine. More specialist desks
enter the rotation as the learner advances. Runs have 5 lives, a 70% clear threshold, XP rewards
and persistent best/clear statistics. There is no final Trading Floor Run level.

`CONTENT-ENGINE.md` documents the AI-ready content contract. The current generator is deliberately
rule-based so answers are mechanically verifiable; future AI-generated packs must pass the same
validation boundary before they can enter the game.


The original 31-lesson curriculum remains **Merchant Foundations**, but it is now the first stage of a much larger Trading House Academy. `content-engine.js` adds 18 specialist worlds / 108 levels through deterministic, validated content templates, bringing the Career Path to 143 levels. `career.js` sits above the curriculum and defines eight desk skills, nine career ranks, 24 rule-based Flash Trading generators and the Boss Deal catalogue. Existing lesson ids and
localStorage keys are unchanged, so old progress remains valid.

**Flash Trading** is a repeatable 60-second mode with fresh arithmetic/commercial variants,
combo scoring and skill XP. **Boss Deals** are multi-step simulations: a theoretical gross P&L
is established at briefing, then hedging, finance, freight, credit, quality and execution decisions
can preserve or erode it. Boss v1 ships with Metals, Oil and Agriculture cases. The latter two
unlock progressively with XP/foundation levels; every case is generated from a factory so repeat
runs change the numbers while keeping the answer mechanically verifiable.

**Deal of the Day** now reuses the same simulation engine with deterministic daily seeding: every user opening the app on the same calendar day gets the same desk and internally consistent numbers on that device, while tomorrow generates a new case. The first completion pays XP; replays improve the score without turning the daily into an XP farm. **Desk Quests** add three objectives per day, selected deterministically from Deal, Flash, Career/Practice and Boss activity. Quest rewards are claimed individually and clearing all three adds a desk bonus. Daily history is stored by date so cloud merges can union completed days instead of losing them to a max-only counter.

Boss state is saved under `state.boss` (`plays`, `cleared`, `best`, `completed`) and included in
the Supabase merge. `completed` stores the best decision score per deal; unique clears are derived
from that map so clearing different deals on two devices cannot be lost during merge.

| Unit | Lessons |
|---|---|
| 1 · What a physical trade is | Two sides and a cargo · Where the margin goes · The cargo has to move · Getting paid |
| 2 · Incoterms | FOB · CFR and CIF · EXW and DDP · Risk, cost and title |
| 3 · Pricing | Benchmark and premium · The quotational period · Basis · Contango and backwardation |
| 4 · Hedging | Why hedge at all · Hedge ratio · Variation margin · When the hedge does not fit |
| 5 · Trade finance | The working capital gap · Letters of credit · Counterparty credit |
| 6 · Execution and documents | Nomination and laycan · NOR and demurrage · The bill of lading · Quantity, quality and claims |
| 7 · Freight and chartering | Voyage or time charter · How freight is quoted · TCE and bunkers · Position, ballast and freight risk |
| 8 · Desk risk | The net position · Concentration and limits · VaR and stress tests · How a desk actually dies |

The arc is deliberate. Unit 1 is the shape of the business, unit 2 the first real
professional vocabulary. Unit 3 is where pricing stops being a number and becomes
a negotiated structure. Unit 4 is the intellectual centre — a hedge protects the
margin but not the cash position, and that distinction is what separates people
who have hedged from people who have read about hedging. Unit 5 is why the
business needs banks at all. Unit 6 is execution — the place where a good trade is
quietly lost to a clock or a document. Unit 7 closes the loop: the risks that
actually end desks are cash, concentration and paperwork, not being wrong on price.
Unit 7 sits between them because freight is the largest variable cost in the margin
and has its own market, its own volatility and its own hedge.

Note for maintainers: unit 7 in the path carries the internal id `u8` and unit 8
carries `u7`. Freight was written last and inserted before Desk risk, which has to
close the course. The ids were left alone on purpose — they are the keys saved
progress is stored under, and renaming them would wipe every existing learner's
history. Unit numbers in the UI are positional, so the display is correct.

## Review and checkpoints

Finishing the 31 lessons once is not learning them, so there are two ways back in.

**Practice** builds an 8-exercise session out of what you are weakest on. Every wrong
answer is recorded under a stable key (`u4l3#2`) and weighted four times heavier than
a fresh one; lesson age adds a smaller weight, so units you cleared last week resurface
before ones you cleared this morning. The selection then rotates on `state.reviews`, so
two sessions in a row are never identical. Taking an exercise first time in Practice
decrements its debt; missing it again increments it. XP is capped at half a new lesson —
enough to be worth doing, not enough to farm.

**Checkpoints** unlock when every lesson in a unit is done: 8 questions drawn round-robin
across the unit's lessons so none is skipped, 5 lives rather than 3, and 75% first-try to
earn the badge. Five lives is deliberate — with 3 the run dies before it can report a
score, which tells the learner nothing.

Lessons with outstanding mistakes are marked on the path, and a lesson older than
3 days counts as due. Neither Practice nor a checkpoint can change which lessons are
completed; they only move XP, badges and the mistake list.

## Installing and offline

`manifest.webmanifest` and `sw.js` make it a real installable app. On Android and
desktop Chrome an "Install as an app" button appears on the path screen once the
browser decides it qualifies; on iOS it is Share → Add to Home Screen. Once installed
it opens standalone, with no browser chrome, and runs with no signal.

The service worker splits its strategy on purpose:

- **HTML is network-first.** A new deploy is picked up on the next load. Cache-first
  HTML is how a PWA gets stuck showing a version from three weeks ago, and it is very
  hard to talk a user out of afterwards.
- **Everything else is cache-first**, revalidated in the background. That is what makes
  it start instantly and work offline.
- The cache name carries a version (`wot-learn-v16` in this build). Bump `VERSION` in `sw.js` on any
  release that changes the shell — `activate` deletes every cache that is not the
  current one, which is the mechanism that evicts a stale client.
- Precache adds files one at a time rather than with `addAll`, so one missing file
  cannot silently void the entire install step.

`start_url` is `learn.html`, not `/` — the root is the landing page, and an installed
app should open the app, not the pitch. `scope` is `./` so it still works if the site
is ever served from a subfolder. `vercel.json` keeps `sw.js`, `pwa.js` and the manifest
on `max-age=0`; a long-cached service worker cannot update itself.

If none of this is supported, `pwa.js` does nothing and the app behaves exactly as
before. It is additive, never required.

## The background

Both pages carry an inline SVG scene behind the content: a nautical grid and compass,
a dashed trade route with an origin and a destination, the carry curve, and a port on
the horizon — two ship-to-shore cranes, grain silos, storage tanks, a container stack —
with a bulk carrier on the water. The ship drifts and the route dashes travel, both
stopped under `prefers-reduced-motion`.

It is inline rather than a background image so it inherits the palette and can be
animated, and it is `aria-hidden` with `focusable="false"` so it is invisible to
assistive technology and to the tab order. The gradient ids are prefixed per page
(`a…` in the app, `l…` on the landing) because two copies of the same ids on one
document would collide.

Nothing in it exceeds 0.35 opacity, and that ceiling is enforced by a test. Contrast
was measured rather than eyeballed: the scene is rendered over a reconstruction of the
real page gradient, box-blurred by roughly the width of a glyph stem — a single bright
pixel cannot obscure a letter, a bright *region* can — and the worst-case luminance in
the text band is compared against every text colour. The port adds nothing to the worst
case; it is identical to the background without it.

That measurement did surface a pre-existing defect: `--muted-2` was `#9fb6e0`, which
gave 3.40:1 over the brightest part of the radial glow at the top of the page. It is
now `#c4d6f7` (4.75:1). This was wrong before the background existed.

## The logo

The source artwork is a crest on a black field with a warm radial glow baked in. On a
navy page that reads as a black square with a brown halo, so it is cut out to
transparency instead.

The cutout is not a colour-key. The background is separated with three signals
combined: it is never blue-dominant, it is smooth where the crest is full of detail
(local standard deviation over a 9px window — the glow sits near 3, the silos and the
anchor near 32), and it connects to the image border. Holes are then filled only if
they are smaller than 2500px, so shadows inside the crest stay opaque while leftover
patches of glow do not. A grey plume above the anchor survived the first two passes and
needed the smoothness test extended to neutral, unsaturated, mid-dark regions.

Sizes: `logo-crest-500` for the hero (displayed at 212px, so it holds up on a
high-density screen), `logo-crest-220` for the app's top bar. WebP with a PNG fallback,
both with alpha, and explicit `width`/`height` so nothing jumps while loading.
`og:image` points at the 512px icon rather than the crest, because a transparent logo
renders badly on whatever background a social card gives it.

**Why the filenames carry their size.** The first cut-out kept the original filenames,
and the result was that the top bar updated while the hero did not — the top bar had a
new filename, the hero did not, and `vercel.json` was serving every `.png` and `.webp`
with `max-age=31536000, immutable`. The browser was entitled to keep the old bytes for
a year and did. Two changes came out of that:

- Logos are named for their content (`logo-crest-500.webp`). Change the image, change
  the name — that is the only reliable cache bust.
- The catch-all image rule is no longer `immutable`. It is now
  `max-age=604800, stale-while-revalidate=2592000`, so a file that is overwritten
  despite the rule above still corrects itself within a week instead of a year.

Both are asserted in `logo.mjs`. `pixels.mjs` goes further and reads the actual alpha
channel: a logo must have a transparent border and at least a quarter of its area cut
away, while the app icons must stay fully opaque because a launcher icon needs its
background. Checking that a file exists says nothing about whether the black square
is gone.

## Saving a career to an account

Authentication is now required before entering the game. `supabase-config.js` ships empty for security; while it is empty the mandatory access gate stays locked and explains that Supabase must be configured. Once configured, users must sign in or create an account before the game shell is revealed; career progress then syncs to that authenticated account. Setup instructions are in
`SUPABASE-SETUP.md`.

**No SDK.** Supabase is reached over its plain REST endpoints with `fetch` — signup,
password grant, refresh grant, logout, and a PostgREST upsert. That is about 120 lines
against a 120KB dependency, it keeps the no-build-step property, and it means the
service worker still has a complete shell to cache for offline use.

**Merging, not overwriting.** Signing in on a second device is the dangerous moment: a
naive implementation picks a winner and silently destroys the other career. Here the
two states are merged field by field — union of completed lessons, maximum of XP,
per-lesson best accuracy, highest badge, highest outstanding mistake count, longest
streak. XP takes the maximum rather than the sum, because summing would double-count
the lessons both sides already had. The merge is commutative and idempotent, and
`sync.mjs` asserts both.

**Failure is expected, not exceptional.** The network can be gone, the token can expire,
the session can die. Each has a defined behaviour: work locally and retry when `online`
fires; refresh the token once and retry; sign out cleanly with "nothing was lost". The
raw Supabase errors are translated — a user should never be shown the string
`JWT expired`. `resilienza.mjs` covers all three.

Two bugs came out of writing those tests. `Object.assign` copies the *value* of a
getter rather than the getter itself, so the `dirty` flag was frozen at `false`
forever and nothing would ever have retried. And a failed refresh surfaced
`JWT expired` to the user instead of signing them out.

## Streaks and sharing

A run of correct answers is counted across lessons, not inside one: `streakNow` grows
only on answers taken **first try** — a re-queued mistake taken correctly the second
time does not count, or insisting would be enough — and resets to zero on any wrong
answer. `streakBest` is the record, and it is what gets shared. The chip appears at 3
(below that it is not worth the screen space) and milestones at 5, 10, 15, 20, 30, 50,
75 and 100 get a toast and confetti.

On merge, `streakBest` takes the maximum but `streakNow` does **not** transfer: an
in-progress run belongs to the device you are sitting at, not to the career.

**What LinkedIn actually allows.** The share link (`sharing/share-offsite`) carries
only the URL. Post text, headline and thumbnail cannot be pre-filled — the API that
allowed it was deprecated in 2018, and everything shown in the composer comes from the
page's Open Graph tags. Posting *on the user's behalf* needs the `w_member_social`
permission, which requires LinkedIn app review and is not realistic here.

So the share panel does the three things the user cannot do for themselves: it draws a
1200×630 card on a canvas with their number on it, puts the post text on the clipboard,
and opens the composer. They paste and attach. An image also travels further on
LinkedIn than a bare link, so this is not merely a workaround.

The card degrades: `getContext` throws rather than returning null when canvas is
unavailable, so it is wrapped, and the panel then offers text and link with no image
instead of failing. `card.mjs` verifies the drawing with a recording 2D context —
every fill, every string, and that nothing lands outside 1200×630.

## Self-check — closing the gap a browser leaves

`selftest.html`, opened on the deployed site, runs the app in an offscreen iframe and
checks what Node cannot see. It exists because of a specific failure: a CSS rule
cancelled the `hidden` attribute, the sign-in panel covered the whole app, and every
test was green. The suite asserted `el.hidden === true`, which was true. The property
was right and the rendering was wrong.

What it checks that jsdom cannot:

- **Real computed visibility** — every `[hidden]` element must actually resolve to
  `display:none`, and `elementFromPoint` at the centre of the screen must return the
  course rather than a dialog.
- **Real contrast** — the foreground and background are read from the live computed
  styles, the effective background is resolved by walking up ancestors and compositing
  translucent layers, and the threshold moves to 3:1 for large or bold text as WCAG
  allows. Every text node on the path, in a lesson and in the feedback.
- **Layout at 390px** — horizontal overflow, elements past the right edge, text clipped
  inside its own box, and every control at least 44px tall.
- **Things that simply do not exist in Node** — whether the webfont loaded, whether
  canvas can produce a PNG, whether a service worker is registered and how many cache
  versions are lying around, whether `localStorage` is writable at all (private mode
  throws), whether the logo image really decoded.
- **A real lesson, played** — pick an answer, press Check, and confirm the explanation
  is on screen rather than below the fold, and that the Continue button is reachable
  without scrolling.

It runs against `learn.html?sandbox=1`, which switches the storage key to
`wot-learn-selftest` and disables the cloud entirely. Running the diagnostics must not
cost the user their career or push junk to their account. The scratch key is deleted at
the end, and `sandbox.mjs` proves the real key is byte-identical before and after a
full lesson is played.

The report is copyable, which is the point: it is how a browser I cannot run reports
back to me.

## Contrast is computed, not judged

`contrasto.mjs` holds every text-on-background pair the app actually produces, against
the **worst** background that element can land on — a card is a gradient, so a colour
that passes at the bottom can fail at the top. Two failures came out of it that no
amount of looking had caught:

- `.gl-link` in gold on a card top: 4.12:1.
- `.node small` — the "5 questions" line under every lesson on the main screen — using
  `--muted` on `royal-mid`: **3.81:1**. Pre-existing, on the most-viewed screen in the app.

Both fixed, and the suite now also refuses `var(--muted)` on any selector known to sit
on a light card, so the same mistake cannot come back by copy-paste.

## A silent failure worth remembering

```js
document.addEventListener('DOMContentLoaded', avvia);
if (document.readyState !== 'loading') avvia();
let avviato = false;                 // ← declared after the call
async function avvia() {
  if (avviato) return;               // ← ReferenceError, in the temporal dead zone
```

If the document was already parsed when the script ran, `avvia()` was called before
`avviato` existed. Two things then conspired to hide it:

- `avvia` is **`async`**, so a synchronous throw inside it does not throw at the call
  site — it becomes a rejected promise. No red error, nothing in the way.
- The sign-in UI is drawn *inside* `avvia`, so it simply never appeared. Everything
  else worked. `WOT_CLOUD_API` existed, `enabled` was `true`, `#cloudHost` was in the
  DOM — and the panel was empty.

The user found it, not the tests, and the tests could not have found it: the harness
dispatched `DOMContentLoaded` itself after evaluating the scripts, handing them a
second chance a real browser would never give. Two fixes to the harness, both of which
make it able to fail:

- an unhandled promise rejection now counts as an error, because an `async` function
  that fails is otherwise completely silent;
- when a test asks for an already-loaded document, the scripts are evaluated **after**
  jsdom has fired `DOMContentLoaded`, not before.

With the bug restored, `avvio.mjs` now reports exactly the symptom that was reported
to me: *"the sign-in button is drawn — empty"*.

## One CSS rule that matters

```css
[hidden]{display:none!important}
```

The browser's own rule is `[hidden]{display:none}`, and it belongs to a weaker origin
than anything you write. So `.cloud-dialog{display:grid}` silently cancels the
attribute — the sign-in panel sat open over the app, and because the cloud was not
configured `cloud.js` had returned early before wiring the close button, so nothing
could dismiss it. Four elements were affected: both dialogs and both streak indicators.

The tests had asserted `el.hidden === true`, which was correct. The property was right
and the rendering was wrong. `visibilita.mjs` now checks the CSS text instead: it finds
every element that can be hidden, finds every author rule that gives it a `display`,
and requires the guard rule to exist and come first. Removing the guard makes it fail —
which is the only reason to trust it.

The close handlers are also attached now regardless of configuration. A modal that
cannot be closed takes the whole app with it, so it should not depend on a feature
being switched on.

## Glossary

`glossary.html` — 70 terms, each with what it means, why it matters on a desk, and a
link to the lesson that teaches it. Every `lesson` field is checked against the
curriculum by the tests: a reference to a lesson that does not exist fails the suite,
so the glossary cannot drift away from the course.

With no query the terms are grouped by unit in course order, because that is where
someone studying will look for them. **With a query the grouping is dropped for a flat
list ranked by relevance** — typing "basis" has to put *Basis* above *Basis risk* and
above the entries that merely mention basis in their explanation. Grouping and ranking
are in conflict, so one of them has to give when you search.

The lesson links go through `learn.html?lesson=u4l3`, and the lock check lives in
`startLesson` rather than in the caller. A direct link, the console or some future
button must not be able to skip the progression, and the only way to guarantee that is
to put the check where the lesson actually starts. A locked target highlights the node
on the path and explains itself instead of silently doing nothing.

## The five exercise types

- **choice** — multiple choice, the workhorse
- **numeric** — work out a real number (freight cost, net margin, margin to post)
- **order** — sequence the steps of a trade or a cost chain
- **pairs** — match term to meaning, or party to what it wants
- **build** — assemble a sentence from tiles, for the ideas worth memorising

Every exercise carries a `why`: the explanation shown after answering, right or
wrong. That is where the teaching happens — not in the question.

## How the loop works

Path → lesson → exercise → feedback → progress.

- **3 lives** per lesson. A wrong answer costs one and **puts the exercise back in
  the queue**, so you meet it again before finishing.
- **XP** scales with first-try accuracy: 10 base, up to 20 for a clean run.
- **Streak** counts consecutive days.
- Lessons unlock in sequence; progress is saved in `localStorage`.

## Adding content

Everything lives in `curriculum.js`. A lesson is an object with `title`, `goal`
and an `exercises` array. No build step, no dependencies — add a unit and it
appears on the path.

```js
{ type:'choice', prompt:'…', options:['…','…'], answer:1, why:'…' }
{ type:'numeric', prompt:'…', answer:19000, unit:'$', tolerance:0, why:'…' }
{ type:'order', prompt:'…', items:['first','second','third'], why:'…' }
{ type:'pairs', prompt:'…', pairs:[['left','right']], why:'…' }
{ type:'build', prompt:'…', sentence:['A','B','C'], distractors:['D'], why:'…' }
```

For `order`, list `items` in the **correct** order — the app shuffles them.

## Verified

- All 8 lessons played end to end in a headless browser: 8/8 completed, all five
  exercise types exercised, no runtime errors.
- Wrong answers correctly cost a life and re-queue the exercise.
- Ten text/background pairs checked for contrast: all above 4.5:1 (WCAG AA).
- Mobile-first, keyboard operable, respects `prefers-reduced-motion`.

## Visual language

Built to feel like a mobile game, not a form.

- **Chunky, tactile controls** — every button and option has a solid bottom edge
  that compresses on press, so taps feel physical.
- **Spring easing everywhere** (`cubic-bezier(.34,1.56,.64,1)`) — things overshoot
  slightly and settle, instead of sliding linearly.
- **Ten keyframe animations**: screen entry, pop on correct, shake on wrong, heart
  loss, pulsing ring on the next lesson, bobbing "Start" tag, feedback slide-up,
  crest entry, confetti, stat bump.
- **Bigger type** — body 18px, questions up to 27px, answers 18px. Nothing under 12.5px.
- **The Check button changes colour with the outcome** — gold while answering,
  green when right, red when wrong.
- **Numbers count up** rather than appearing, and confetti fires on a completed lesson.

Everything above is disabled under `prefers-reduced-motion`.

Twelve text/background pairs verified for contrast, all above 4.5:1 (WCAG AA),
eight of them above 7:1.

## Hélène

The course has a teacher. She appears three ways:

- **On the path**, with a line that changes as you progress — a greeting at the
  start, encouragement in the middle, a nudge toward what's next at the end.
- **In every feedback panel**, next to the explanation, with an expression that
  matches the outcome and a short reaction that rotates so it never reads canned.
- **On the lesson-complete screen**, celebrating.

Three expressions, drawn as inline SVG in `mascot.js` — no image files, scales to
any size, one file to edit. `teach` explains, `happy` is a correct answer, `oops`
is concerned rather than disapproving: getting it wrong should feel survivable.

Swapping her look means editing one file. The reactions are two arrays at the
bottom of it.

## Notes on accuracy

All 20 `numeric` exercises are checked against independently written formulas in the
test suite, not against itself. Content that is charterparty- or contract-dependent
(laytime commencement, despatch, time bars, whose certificate is final) is worded as
"usually" or "unless the contract says otherwise" rather than as a rule, because on a
real desk that is exactly how it works. The Metallgesellschaft exercise names both
causes — the price fall that triggered the margin calls and the contango that made
the roll expensive — since attributing it to contango alone is the common textbook
oversimplification.

Save files from before the review layer existed are covered by `review.mjs`: a state
object with no `misses`, `doneAt` or `badges` must load, keep its XP and streak, and be
treated as due for review rather than crashing. Wrong types (`done` as a string, `best`
as a number) are normalised rather than trusted.

Two engine bugs were found while writing these units and are covered by
`edge.mjs` regression tests: a `build` sentence could not repeat a word (the tile
bank filtered by text, so placing "a" removed every "a"), and a `pairs` exercise
with two identical right-hand labels rejected a correct match on the second one —
which had been silently marking correct answers wrong in Unit 2.


## Career layer (v13)

The learning app now treats the original 31 lessons as **Chapter 1 — Merchant Foundations** rather than the end of the game. The new game layer adds:

- Career ranks from Intern to Partner, with XP + foundation-level requirements.
- Eight desk skills: Physical Trading, Operations & Incoterms, Pricing, Hedging & Derivatives, Trade Finance, Execution & Documents, Freight & Chartering, and Desk Risk.
- A persistent Profile screen with 0–100 skill mastery.
- A Play hub and **Flash Trading**, a repeatable 60-second mode with rule-generated, mechanically verifiable questions, score combos, XP and skill progression.
- A dedicated Practice hub using the existing weighted mistake/recency engine.
- Bottom navigation for Path / Play / Practice / Profile.
- Backward-compatible local saves and cloud merge support for the new `skillXp` and `flash` fields.

`career.js` contains game metadata, rank thresholds, skill definitions and Flash Trading generators. `curriculum.js` remains the curated source of truth for the main learning path. AI-generated content is intentionally not enabled yet: the architecture leaves it as a later layer behind a controlled knowledge base and validation step.
## v7.1 — Friends & Social

La v7.1 aggiunge un social layer reale senza fingere accesso alle connessioni LinkedIn:

- codice referral personale stabile;
- invito condivisibile via LinkedIn o link diretto;
- Trading Circle costruito dagli inviti realmente accettati;
- Friends League settimanale basata sugli stessi XP della League globale;
- sfide 1-vs-1 deterministiche: stesso desk, stesso seed, stesse 10 domande;
- un solo risultato per giocatore e nessun XP carriera dai duelli;
- milestone social cosmetiche a 1 / 3 / 5 amici;
- flusso referral conservato anche passando da landing page, registrazione e conferma email.

Per attivarlo, eseguire il blocco SQL **Friends League, referral e sfide 1-vs-1** in
`SUPABASE-SETUP.md`. Se le tabelle social non sono presenti, il resto del gioco continua
a funzionare normalmente.
