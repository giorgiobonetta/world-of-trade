# World of Trade — voluntary support

The landing offers a one-off **$4.99 USD** voluntary contribution to help fund development.

This is **not** configured as a PayPal charity donation. `donations.js` uses a standard PayPal payment flow and can be switched to an official hosted PayPal Payment Link later.

## Recommended final setup
Create a PayPal hosted Payment Link for **$4.99 USD** and set it in your private
`supabase-config.js` (which is intentionally not shipped in the release ZIP):

```js
window.WOT_PAYPAL_PAYMENT_LINK = 'https://…';
```

Until then, the code falls back to PayPal's standard `_xclick` payment flow for the public contact account.

Supporting the project does not unlock levels, XP, game content or account features.

## Contributors
Signed-in supporters can submit the public name they want listed. v0.8.2 stores the request in
`supporter_requests`; only rows you mark `approved` are exposed through `public_supporters`.
`supporters.js` remains only a static fallback. Never publish email addresses or payment details.
