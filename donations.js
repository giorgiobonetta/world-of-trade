/* World of Trade — voluntary support.
   The project remains fully free: contributing never unlocks anything.

   IMPORTANT: This uses PayPal's standard payment flow (_xclick), not the
   charity/donation product. If you later create an official PayPal Payment
   Link, paste it into WOT_PAYPAL_PAYMENT_LINK below and it will take priority.
*/
(function () {
  'use strict';

  var CONTACT_EMAIL = 'giorgio.bonnybonetta@gmail.com';
  var WOT_PAYPAL_PAYMENT_LINK = ''; // Optional: paste your official hosted PayPal Payment Link here.
  var FALLBACK_PAYMENT_URL = 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=' +
    encodeURIComponent(CONTACT_EMAIL) +
    '&item_name=' + encodeURIComponent('Support World of Trade development') +
    '&amount=4.99&currency_code=USD&no_shipping=1&no_note=1';
  var PAYPAL_URL = WOT_PAYPAL_PAYMENT_LINK || FALLBACK_PAYMENT_URL;

  var donate = document.getElementById('paypalDonateBtn');
  if (donate) donate.href = PAYPAL_URL;

  var names = Array.isArray(window.WOT_SUPPORTERS) ? window.WOT_SUPPORTERS : [];
  names = names.map(function (x) { return String(x || '').trim(); }).filter(Boolean);

  var list = document.getElementById('supportersList');
  var count = document.getElementById('supporterCount');
  if (count) count.textContent = names.length + (names.length === 1 ? ' name' : ' names');
  if (list) {
    list.textContent = '';
    if (!names.length) {
      var empty = document.createElement('div');
      empty.className = 'supporters-empty';
      empty.textContent = 'Be the first contributor listed here.';
      list.appendChild(empty);
    } else {
      names.forEach(function (name) {
        var chip = document.createElement('span');
        chip.className = 'supporter-chip';
        chip.textContent = name;
        list.appendChild(chip);
      });
    }
  }

  var input = document.getElementById('supporterName');
  var request = document.getElementById('supporterRequestBtn');
  var status = document.getElementById('supporterStatus');
  if (input && request) {
    request.addEventListener('click', function () {
      var name = String(input.value || '').trim().replace(/\s+/g, ' ').slice(0, 36);
      if (!name) {
        if (status) status.textContent = 'Enter the name or trader alias you want displayed.';
        input.focus();
        return;
      }
      var subject = 'World of Trade contributor listing — ' + name;
      var body = [
        'Hi,',
        '',
        'I supported World of Trade with the $4.99 PayPal contribution and would like to appear in the public contributor list as:',
        '',
        name,
        '',
        'I am sending this request from the email address you can use to match the PayPal payment.',
        '',
        'Thanks.'
      ].join('\n');
      if (status) status.textContent = 'Opening your email app. Send the message and the name can be added after verification.';
      location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
