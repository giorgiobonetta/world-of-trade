# World of Trade — voluntary support

The landing offers a one-off **$4.99 USD** voluntary contribution to help fund development.

This is **not** configured as a PayPal charity donation. `donations.js` uses a standard PayPal payment flow and can be switched to an official hosted PayPal Payment Link later.

## Recommended final setup
Create a PayPal hosted Payment Link for **$4.99 USD** and paste the full link into:

```js
var WOT_PAYPAL_PAYMENT_LINK = '';
```

inside `donations.js`.

Until then, the code falls back to PayPal's standard `_xclick` payment flow for the public contact account.

Supporting the project does not unlock levels, XP, game content or account features.

## Contributors
After checking a PayPal contribution, add the public name/trader alias to `supporters.js`. Do not publish email addresses or payment details.
