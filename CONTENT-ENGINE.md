# World of Trade Content Engine v1

`content-engine.js` is the boundary between the game engine and scalable content.
It appends deterministic, validated specialist levels to the hand-curated Merchant
Foundations before `app.js` builds the path.

## Current output

- 12 specialist worlds
- 72 generated Career levels
- 360 generated Career exercises
- Combined app: 20 units / 103 levels / 505 exercises
- Endless Trading Floor Runs: 10 regenerated questions per run

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
