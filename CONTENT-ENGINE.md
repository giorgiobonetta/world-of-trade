# World of Trade Content Engine v1

`content-engine.js` is the boundary between the game engine and scalable content.
It appends deterministic, validated specialist levels to the hand-curated Merchant
Foundations before `app.js` builds the path.

## Current output

- 18 specialist worlds
- 108 generated Career levels
- 540 generated Career exercises
- Combined app: 27 units / 143 levels / 706 exercises
- Endless Trading Floor Runs: 10 regenerated questions per run

## Uniqueness is a property of the layout, not of luck

Each desk holds a pool of concepts and each level draws five of them. With ten
concepts spread over thirty slots, every static multiple-choice question reappeared
in all six levels of its unit, identical except for the order of the options: 360
generated exercises contained 177 distinct questions.

Two rules now hold, enforced by `tests/unicita.mjs`:

- **A multiple-choice concept is used once per desk.** Its text is fixed, so repeating
  it is padding, and a learner notices immediately.
- **A numeric concept may recur with fresh values, up to three times per desk, never
  in adjacent levels.** A drill with different numbers is a different exercise.

`distribuisci()` allocates concepts across a whole desk rather than per level, always
choosing the least-used numeric first — a plain round-robin left some concepts at four
uses and others at two. If a seed happens to draw the same values twice, the exercise
is regenerated with a different seed rather than shipped as a duplicate.

The pool had to grow to make this possible: a desk needs `choice + 3 × numeric ≥ 30`.
It went from 123 concepts to 244, and `EXTRA` holds the additions so the original
hand-written arrays stay untouched and reviewable on their own.

## Every generated number is recomputed by an oracle

`tests/aritmetica.mjs` does not trust the generator's formula. It reads only the numbers
that appear in the question text and tries the combinations a desk would use, then checks
whether any of them reaches the stated answer. If none does, either the formula is wrong
or **the question does not contain the data needed to answer it** — and the second is just
as much a defect.

It found three: a boil-off question that gave cubic metres and asked for thousands of
cubic metres, a regas cost that wrote "2 million MMBtu" instead of the figure, and a
credit headroom question that answered `0` when the exposure exceeded the limit, where
a learner would reasonably answer the negative difference.

## Why deterministic rule-based generation first

The content engine deliberately does **not** trust free-form AI output yet. Every current
numeric exercise is produced from a formula in code and every multiple-choice answer is
explicitly keyed. This gives us a reliable baseline and a test oracle.

The next AI layer should produce the same exercise schema, then pass validation before any
question is shown. `validateExternalPack(pack)` is the first gate for that pipeline.

## Exercise contract

Supported generated exercises currently use the two formats that are easiest to verify:

```js
{
  type: 'choice',
  prompt: '...',
  options: ['...', '...', '...'],
  answer: 1,
  why: '...'
}
```

or

```js
{
  type: 'numeric',
  prompt: '...',
  answer: 125000,
  unit: '$',
  tolerance: 0,
  why: '...'
}
```

A future AI service should also return provenance fields (knowledge-base concept id,
source version, generator/model version and verification result), but those should stay
metadata: the learner-facing engine should only accept a question after validation.

## Suggested AI pipeline

1. Select desk, concept, difficulty and exercise type.
2. Retrieve only approved World of Trade knowledge-base facts/formulas.
3. Ask the model for a candidate exercise in strict JSON.
4. Validate schema and allowed concepts.
5. For numeric questions, recompute the answer independently from structured variables.
6. For choices, run ambiguity checks and require exactly one accepted answer.
7. Store the verified candidate in a moderation queue / approved pool.
8. Serve approved variants to Career, Daily, Flash or Trading Floor Run.

The important design rule is that the LLM proposes content; it does not get final authority
over what World of Trade teaches.
