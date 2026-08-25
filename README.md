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

Prototype with **2 units, 8 lessons, 34 exercises**.

| Unit | Lessons |
|---|---|
| 1 · What a physical trade is | Two sides and a cargo · Where the margin goes · The cargo has to move · Getting paid |
| 2 · Incoterms | FOB · CFR and CIF · EXW and DDP · Risk, cost and title |

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
