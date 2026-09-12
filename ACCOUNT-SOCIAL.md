# World of Trade v0.8.2 — Account & Social

## Deployment

1. Upload the v0.8.2 release files to the repository root.
2. Keep the existing real `supabase-config.js`; release ZIPs intentionally do not contain it.
3. Run `SUPABASE-V080-HARDENING.sql` once in **Supabase → SQL Editor** after the base setup.
4. Deploy, then fully close/reopen any installed PWA so the new service-worker cache is activated.

## Current account/social behavior

- Account-first access with verification, recovery, reset and session refresh.
- Private Display Name is separate from the public League alias / Trader ID.
- Avatar images are reduced to 128×128 WebP and stored in Supabase Storage.
- Account deletion requires typing `DELETE` and re-entering the current password.
- League → League / Friends / Challenges.
- Trader search by name or `@TraderID`.
- **Search results never expose Supabase `user_id` UUIDs.** Discovery returns only alias, house, Trader ID and relationship state.
- Add-friend and block actions from search resolve the Trader ID server-side.
- UUID-based profile lookup is allowed only for an existing private relationship (friend request, friendship or challenge).
- Declined friend requests have a 24-hour resend cooldown.
- Blocked traders cannot send requests and are excluded from discovery.
- League XP and Challenge scores are verified through server-side RPCs rather than trusted client totals.

## Migration history

`SUPABASE-V060-ACCOUNT-SOCIAL.sql` remains in the repository only for historical/upgrade reference. New deployments should follow `SUPABASE-SETUP.md` and then execute `SUPABASE-V080-HARDENING.sql`.
