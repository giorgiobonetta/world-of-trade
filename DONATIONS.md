# World of Trade — donations

The landing page includes a voluntary one-off **$4.99 USD** PayPal donation.
The donation does **not** unlock content, XP, levels, account features or any other benefit inside the game.

## PayPal recipient

`donations.js` currently builds the hosted PayPal donation URL from the public contact email already present in `privacy.html`:

`giorgio.bonnybonetta@gmail.com`

Before deploying, verify that this is the email connected to the PayPal account that should receive donations.
If PayPal uses another email, replace `CONTACT_EMAIL` in `donations.js`.
If you create an official PayPal.Me / hosted donation URL, replace the `PAYPAL_URL` value with that URL instead.

## Contributor list

The public list is deliberately static. This avoids accepting unverified names from anonymous visitors.

After a donation, the contributor enters a display name or trader alias and clicks **Request listing**. That opens an email addressed to the project contact. After you verify the donation, add the public name to `supporters.js`:

```js
window.WOT_SUPPORTERS = [
  "Copper Fox",
  "Giorgio B.",
];
```

Do not add email addresses, transaction IDs or other payment data to the public list.
