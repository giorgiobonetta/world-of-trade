# World of Trade v0.6 — Account & Social

## Before testing
1. Upload the files in this build to the repository root.
2. Keep your real `supabase-config.js` already on GitHub.
3. In Supabase → SQL Editor run `SUPABASE-V060-ACCOUNT-SOCIAL.sql` once.
4. Wait for the Vercel deployment to be Ready, then fully close and reopen the installed PWA.

## What changed
- Profile → Account & Settings
- email verification state, password change, sign out, haptic preference, delete-account flow
- unique searchable `@TraderID`
- League → League / Friends / Challenges
- trader search by name or Trader ID
- real friend requests with Accept / Decline
- Friends League uses existing weekly XP
- trader profile preview and Challenge button
- challenge history with W/L/D record
- existing referrals and deterministic desk duels remain supported

## Backend additions
The v0.6 SQL adds:
- `social_profiles.trader_tag`
- `friend_requests`
- `send_wot_friend_request(uuid)`
- `respond_wot_friend_request(uuid, boolean)`
- `delete_wot_account()`
