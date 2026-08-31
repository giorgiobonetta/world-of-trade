/* World of Trade native shell marker.
   This file is included only in the mobile app package. */
(() => {
  'use strict';
  window.WOT_NATIVE = true;
  document.documentElement.classList.add('wot-native');

  // Prevent accidental zoom gestures inside the game shell while keeping
  // text inputs usable and accessibility settings respected.
  document.addEventListener('gesturestart', e => e.preventDefault?.(), { passive: false });

  window.addEventListener('DOMContentLoaded', () => {
    // The crest is a home control in the native app, not a page reload.
    document.querySelector('.brand-link')?.addEventListener('click', e => {
      e.preventDefault();
      const path = document.querySelector('.nav-item[data-screen="pathScreen"]');
      if (path && !document.body.classList.contains('auth-locked')) path.click();
    });

    // Native builds need a real public URL for LinkedIn/referral links.
    const site = String(window.WOT_CLOUD?.siteUrl || '').trim();
    if (!site && console?.warn) {
      console.warn('[World of Trade] Native build: set WOT_CLOUD.siteUrl to the public landing URL so referrals do not point to localhost.');
    }
  });
})();
