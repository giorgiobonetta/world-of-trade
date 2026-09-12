# Quality checks — v0.8.2

The production gate for this release is deliberately small, deterministic and green.
It is the gate used by `.github/workflows/quality.yml` before browser testing starts.

```bash
npm test
node tests/aritmetica.mjs
node tests/coerenza.mjs
node tests/content-engine.mjs
node tests/competitive.mjs
node tests/unicita.mjs
```

`npm test` runs `tests/release-v082.mjs`, which checks the current account-first architecture,
public/legal copy, unified auth and recovery, session refresh, profile/avatar behavior, League and
social hardening, PWA/cache rules, redirects, release assets and JavaScript syntax.

The five deterministic content suites independently protect the educational engine: numeric
arithmetic, answer/explanation consistency, generated lesson validity, competitive helpers and
content uniqueness. The release currently contains 34 units, 219 Career levels and 1,086 exercises.

## Real-browser/mobile gate

GitHub Actions then installs Chromium and runs:

```bash
npx playwright test
```

`browser-smoke.spec.mjs` checks 320, 360, 390 and 430 px viewports, the public curriculum, unified
access screen, the hidden `?sandbox=1` developer shell, all five primary app tabs, horizontal
overflow and serious/critical axe-core accessibility violations. Screenshots/traces are uploaded as
CI artifacts on the run.

## Hidden self-check

`/selftest.html` remains available for development, but is intentionally not linked from the public
footer and is blocked in `robots.txt`. It opens the game with `?sandbox=1`, so it does not read or
write a real user's account.

## Legacy suites

The other `.mjs` files are retained as historical regression tests from earlier releases. Some of
them intentionally describe retired behavior such as guest mode, the old login/register pages or
the former LinkedIn authentication experiment. They are useful references when touching those
subsystems, but **they are not the v0.8.2 release gate** and should not be used as a production
"all green" signal without first updating their old expectations.
