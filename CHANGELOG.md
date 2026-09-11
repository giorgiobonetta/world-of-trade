# Changelog

## v0.8.0 — One Site

### It is a website now, not a page that happens to link to a game
- A sticky top bar on every public page: crest, the four sections, and **Start trading** always in
  reach. On a phone it collapses behind one button, and the button is the only thing that can hide
  the links — without JavaScript they stay where they are rather than disappearing behind a control
  that does nothing.
- A real footer: Play, Learn, About, the educational-use notice and the copyright, identical on
  every page.
- **Compete** and **Glossary** sections on the landing page. The league board shows the six
  divisions with their real promotion thresholds and the six trading houses, and the standings rows
  carry the same `preview` marker the game itself uses — a leaderboard that looks real and isn't
  is a promise the product does not keep.
- A branded **404**, `robots.txt` and `sitemap.xml`.
- `vercel.json` went from twenty per-file cache entries to six patterns, so a new file is covered
  the day it is added instead of the day someone remembers it. Security headers came with it.
  `/play` is now an alias for the game.

### Sound
- Answers, level clears and rewards have sound. Nothing is downloaded: every effect is two
  oscillators and a volume envelope, so the first one plays instantly and offline, and the shell
  does not grow by a byte.
- It starts **off**. The audio context is created on the first real tap, never at load, and a
  browser that refuses to play cannot break an answer.
- **Sound and feel** now sits in Profile, reachable by a guest. Haptics moved there too: it used to
  live in the account sheet, which is exactly the place someone without an account cannot open.

### Fixes
- The glossary search field was cut off on a phone. A text input inside a grid keeps its own
  minimum width unless told otherwise, so the column never shrank.
- The glossary and the privacy page opened with an empty 64px band: they were reserving room for
  the game's fixed header, which those pages do not have.
- An anchor on the landing page landed thousands of pixels short. The browser jumps as soon as it
  sees the id, and the crest, the fonts and twenty-seven curriculum rows then take their space and
  move the target; the jump is now redone once the layout is real. Sections also keep clear of the
  sticky bar.
- Content that becomes visible only when an animation runs is content that sometimes stays
  invisible. The reveal effect now declares its end state and animates on top of it.
- The crest inside the game went to `index.html`, the native shell's splash, which bounces
  straight back to the game. On the web it now goes to the site.
- Three pages still said an account was required before playing, including the privacy page.

### Tests
- `sito.mjs`: every public page carries the bar, the footer and the skip link; the game does not
  carry a second bar; every anchor the chrome names exists; the sitemap only lists addresses that
  resolve; no page promises an account before the first level. 50 assertions.
- `suono.mjs`: no audio files ship, the engine starts silent, the context is not created at load,
  and calling it where there is no audio at all does not throw. 20 assertions.
- Cache-header assertions across four suites matched literal source strings and broke the moment
  the config moved to patterns. They now ask the question that matters — "can this file sit still
  in a CDN?" — through one shared helper.
- 900 assertions across 47 suites.
- PWA cache bumped to v61.

## v0.7.0 — Open Door & the Trail

### You can actually play it
- The registration wall is gone. **Start trading** opens the game immediately; the career lives on the
  device and is merged into the account the moment you create one.
- With no Supabase configuration the game is fully playable. Before, a fresh checkout showed a login
  screen with two disabled buttons and no way past it.
- Installation instructions (`supabase-config.example.js`, `SUPABASE-SETUP.md`) go to the console,
  where the person installing looks; the player is told the one thing that concerns them — the career
  is saved on this device.
- The first-run introduction no longer opens on top of the entrance.

### The Career Path is a route now, not a list
- Levels are circular tokens on a winding trail, with a **START** bubble on the current one.
- Each desk ends with a trophy: the Desk Challenge.
- The trail ends on the next desk, locked and named, instead of empty space.
- The course progress bar is back. The engine had been filling `#courseLabel`, `#coursePct` and
  `#courseFill` for several releases; the markup had been deleted, so nobody saw it.
- A locked level no longer repeats "Clear the level above first" under every lock.

### Practice is a screen, not a dead end
- **Targeted drills**: your skills, weakest first, each with its own free drill drawn only from
  material you have already answered.
- For a player with no cleared level the card no longer shows a disabled button — it takes them to
  their first level.

### The daily goal
- 50 XP a day, drawn as a ring around the streak flame and visible from every screen.
- Every XP award now passes through one function, so the day counter cannot miss one, and the
  counter survives a sync between devices. The streak still comes from playing, as before — the goal
  is the target for the day, not a second gate on it.

### Fixes
- **The League screen never drew.** `renderLeagueHub` threw on `#leagueXp`, an element removed from
  the page in an earlier revision, and took the emblem, the trading houses, the achievements and the
  standings down with it.
- The Trading Floor mode buttons (Deal of the Day, Boss Deals, Trading Floor Run) were dark ink on a
  near-transparent background and read as disabled: a later rule overrode their colour with
  `!important`.
- Bottom-bar counters were only computed when changing tab, so a fresh launch never showed the
  practice queue waiting.
- The Check button, while waiting for an answer, was a dimmed gold that rendered as brown.
- Questions were read over the decorative nautical chart; in immersive runs the backdrop is now hidden.
- The desk briefing promised "XP on clear" without the number.
- `learn.html` — the page where the time is actually spent — carried no educational-use disclaimer,
  though the landing page and the glossary did.
- On phones Hélène's button sat at the height of the tab bar.

### Lesson screen
- The question is centred instead of pinned to the top with half a screen empty below it.
- "Show the answer" is a quiet link under Check, not a full-width bar above it.
- Number keys 1–9 choose an option, and the number is printed on each option with a mouse present.
- One label for the answer button: the page said Check, the engine overwrote it with Submit.

### Removed
- The sticky desk band: no markup since an earlier revision, its two functions reduced to `return`,
  a scroll listener calling them on every frame, and three variables computed and thrown away.
- The "01 / 02 / 03" section chips, whose label was set in 7px and whose number stood next to a
  heading that already said the name.
- Hélène's greeting and the review card, both built into `hidden` containers on every path redraw —
  and `dueCount()` walks every exercise of every cleared lesson to do it.
- `?v=061` on seven tags. The service-worker version does the cache busting, and the precached URLs
  now match the ones the page requests.

### Animation cost
- The answer glow and the first-level callout animated `box-shadow` — a full repaint per frame, one
  of them the size of the screen. Both animate opacity and transform now.

### Tests
- **The suite could not open a single page on Windows.** `new URL('.', import.meta.url).pathname`
  is `/C:/...`, which `fs` will not open: 31 of 46 suites aborted before their first assertion.
- The harness also ignored the `?v=` suffix, declared `app.js` and `cloud.js` "missing", and then
  ran the suites against a page whose engine had never loaded.
- The desk briefing is skipped by default; `boot({ brief: true })` for a suite that wants it.
- Cache-version assertions pinned to `v47`, `v49`, `v51`, `v52` and `v53` became "at least",
  so they stop failing on the release after the one that wrote them.
- 145 assertions running → 840, across 45 suites.
- PWA cache bumped to v54.

## v0.6.1 — Tab Stability
- Main tabs now redraw only the destination screen instead of rebuilding every hidden hub on each tap.
- Tapping the already active tab is a no-op, preventing unnecessary DOM destruction/recreation.
- Per-tab scroll is restored synchronously before paint and clamped to the destination height.
- Main mobile hubs use one consistent full-viewport/safe-area canvas and bottom-bar reserve.
- Mobile hub entrance/reveal animations are disabled so content cannot appear late, clipped or partially invisible after a tab switch.
- Fixed header and bottom navigation are promoted to stable compositor layers to reduce WebView/PWA flicker.
- Account/Profile shell is installed synchronously before paint; async account data updates it in place.
- League / Friends / Challenges no longer inherit unsafe deep scroll positions from one another.
- Mutation observers are coalesced to one animation-frame pass instead of rescanning the app for every small DOM insertion.
- Account/trader sheets now participate in the global scroll lock so the page cannot move underneath an open sheet.
- PWA cache bumped to v53 and application assets cache-busted to v061.

## v0.6.0 — Account & Social
- Added Account & Settings from Profile with email verification state, password change, sign out, haptic preference and delete-account flow.
- Added unique searchable `@TraderID` backed by `social_profiles.trader_tag`.
- Reorganized League into League / Friends / Challenges.
- Added trader search, real friend requests, request badges, friend profiles, Friends League and challenge history with W/L/D record.
- Existing referral friendships and deterministic desk duels are preserved.
- Added Supabase v0.6 migration SQL for trader IDs, friend requests and self-service account deletion.
- PWA cache bumped to v52.

## v0.5.5 — Reward & Progression Pass
- Current Career assignment is highlighted more clearly and labelled CURRENT.
- Level completion now shows promotion progress from the current role to the next role.
- Newly unlocked achievements surface immediately on the completion screen.
- New desks receive a full-screen milestone celebration with a direct Enter Desk action.
- Career-rank promotions receive their own milestone celebration.
- Reward overlays queue safely instead of stacking when several milestones unlock together.
- Existing editable Profile and Practice-canvas fixes from v0.5.4 are preserved.
- PWA cache bumped to v51 and core assets cache-busted to v0.5.5.

## v0.5.1 — Lifebuoy Economy
- Lifebuoys no longer regenerate instantly after being spent.
- Automatic regeneration is 1 lifebuoy every 6 minutes, up to 5.
- Reaching 0/5 restarts the refill clock, guaranteeing 30 full minutes to return to 5/5.
- Correct-answer streaks no longer grant an instant lifebuoy; streaks remain a skill/XP reward.
- The refill timestamp persists while the app is closed and is restored on reopen.
- Cloud merge now preserves the newest lifebuoy balance and refill timestamp instead of accidentally resetting the pool to 5/5.
- PWA cache bumped to v47.

## v0.5.0 — Core Experience
- First-run onboarding reduced to two fast, gameplay-first screens.
- Hélène gives a concise desk briefing only when entering a desk for the first time.
- Career runs show Desk / Level context and an explicit decision counter.
- Progress now advances only when a decision is actually resolved, so wrong-answer retries cannot falsely fill the bar.
- Career language uses decisions, clears and Desk Challenges rather than school/test language.
- End-of-level reward screen now shows XP, first-try rate, lifebuoys, rank context and the next assignment.
- New-desk unlock has a stronger visual reward and direct Enter Desk CTA.
- Each new decision returns to a clean top position in immersive gameplay.
- No new modes or curriculum content were added in this pass.

# v0.4.6 — Game Experience Pass

- Immediate visual + optional haptic feedback on answers.
- Subtle question-to-question transition without moving the page.
- End-of-level screen now shows career level progress and XP to the next level.
- Perfect runs and newly unlocked desks get an explicit reward card.
- Career completion CTA goes directly to the next level / next desk instead of forcing a return to Path.
- Practice completion correctly returns to Practice; Trading Floor runs return to Trading Floor.
- Added lightweight streak/lifebuoy floating feedback; no new currency or farming loop.
- PWA cache bumped to v45.

# World of Trade — current changes

## v0.4.5 — Fixed HUD, stable tabs, standalone curriculum
- Player reward header stays fixed during scroll on web and installed PWA.
- Header height is measured dynamically so content never sits underneath it.
- Main tabs remember their own scroll position; Practice no longer jumps upward.
- Practice entrance animation is disabled on portrait mobile.
- Product and curriculum copy are framed entirely around professional commodity-trading topics.
- Career contains 34 units, 219 levels and 1,086 exercises.
- Partner and Trading House Graduate require all 219 Career levels.
- Highest competitive division is displayed as Elite.

## v0.4.4 — Mobile scroll fixes
- Restored natural vertical scrolling across all five main sections.
- Protected immersive question screens from the device notch/status bar.
- Simplified section titles and removed the Career Path progress banner.

## v0.4.3 — Mobile navigation cleanup
- Bottom navigation uses icon-only active states and per-tab notification badges.
- Career Path was reduced to the level progression itself.
