# World of Trade — Learn

Learn physical commodity trading step by step. Short lessons, immediate feedback,
from the very basics upward.

## Run it

Any static server. Locally:

```
python -m http.server 8000
```

then open `http://localhost:8000`. Deploys to Vercel as-is — no build step.

## What's here

**5 units, 19 lessons, 83 exercises.**

| Unit | Lessons |
|---|---|
| 1 · What a physical trade is | Two sides and a cargo · Where the margin goes · The cargo has to move · Getting paid |
| 2 · Incoterms | FOB · CFR and CIF · EXW and DDP · Risk, cost and title |
| 3 · Pricing | Benchmark and premium · The quotational period · Basis · Contango and backwardation |
| 4 · Hedging | Why hedge at all · Hedge ratio · Variation margin · When the hedge does not fit |
| 5 · Trade finance | The working capital gap · Letters of credit · Counterparty credit |

The arc is deliberate. Unit 1 is the shape of the business, unit 2 the first real
professional vocabulary. Unit 3 is where pricing stops being a number and becomes
a negotiated structure. Unit 4 is the intellectual centre — a hedge protects the
margin but not the cash position, and that distinction is what separates people
who have hedged from people who have read about hedging. Unit 5 is why the
business needs banks at all.

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
