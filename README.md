# World of Trade — Learn

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

`vercel.json` uses `cleanUrls` and **no rewrites**, so `/` serves the landing and
`/learn` serves the app. Do not reuse the old simulator's `vercel.json` — its
rewrites pointed at files that no longer exist and returned a 404.

The landing page is fully self-contained: its CSS, its two Hélène SVGs and its
scroll animations are all inline, so it renders even if `styles.css` fails. The
only external request is the Fredoka webfont, and there is a system fallback.
Every text/background pair on it clears WCAG AA (lowest measured 4.59:1).

## What's here

**8 units, 31 lessons, 145 exercises.**

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
- The cache name carries a version (`wot-learn-v3`). Bump `VERSION` in `sw.js` on any
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

Optional, off by default, and irrelevant to how the app runs. `supabase-config.js`
ships empty; while it is empty there is no login UI, no network call, and the app is
byte-for-byte the experience it was before. Setup instructions are in
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
