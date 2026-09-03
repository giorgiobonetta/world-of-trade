/* World of Trade native shell marker.
   Safe to include on both web and Capacitor: it activates only inside a real
   native Capacitor WebView. */
(() => {
  'use strict';

  const isNative = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  if (!isNative) return;

  window.WOT_NATIVE = true;
  document.documentElement.classList.add('wot-native');

  document.addEventListener('gesturestart', e => e.preventDefault?.(), { passive: false });

  const requestPortrait = async () => {
    try {
      if (screen?.orientation?.lock) await screen.orientation.lock('portrait');
    } catch (_) {}
  };

  window.addEventListener('DOMContentLoaded', () => {
    requestPortrait();

    document.querySelector('.brand-link')?.addEventListener('click', e => {
      e.preventDefault();
      const path = document.querySelector('.nav-item[data-screen="pathScreen"]');
      if (path && !document.body.classList.contains('auth-locked')) path.click();
    });

    const site = String(window.WOT_CLOUD?.siteUrl || '').trim();
    if (!site && console?.warn) {
      console.warn('[World of Trade] Native build: set WOT_CLOUD.siteUrl to the public landing URL so referrals do not point to localhost.');
    }
  });
})();
