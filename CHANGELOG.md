# Changelog

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
