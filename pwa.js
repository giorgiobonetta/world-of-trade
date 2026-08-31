/* Registrazione del service worker, pulsante di installazione, stato offline.
   Tutto opzionale: se il browser non supporta niente di questo, l'app funziona uguale. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  // ── service worker ────────────────────────────────────────────────
  if (!window.WOT_NATIVE && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        // se arriva una versione nuova mentre la pagina è aperta, la applico
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (sw) sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              sw.postMessage('skip-waiting');
            }
          });
        });
      }).catch(() => {});
    });
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      location.reload();
    });
  }

  // ── pulsante di installazione ─────────────────────────────────────
  let prompt = null;
  if (!window.WOT_NATIVE) window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    prompt = e;
    const host = $('#installHost');
    if (!host) return;
    host.innerHTML = `<button id="installButton" class="install-btn">
      <span aria-hidden="true">↓</span> Install as an app</button>`;
    $('#installButton').addEventListener('click', async () => {
      if (!prompt) return;
      prompt.prompt();
      try { await prompt.userChoice; } catch (e) {}
      prompt = null;
      host.innerHTML = '';
    });
  });
  window.addEventListener('appinstalled', () => {
    prompt = null;
    const host = $('#installHost');
    if (host) host.innerHTML = '';
  });

  // ── stato offline ─────────────────────────────────────────────────
  function paintNet() {
    const el = $('#offlineFlag');
    if (!el) return;
    const off = navigator.onLine === false;
    el.hidden = !off;
    el.textContent = off ? 'Offline · your progress is saved on this device' : '';
  }
  window.addEventListener('online', paintNet);
  window.addEventListener('offline', paintNet);
  paintNet();

  // ── scorciatoia di sistema: apri direttamente il ripasso ──────────
  window.addEventListener('load', () => {
    try {
      const go = new URLSearchParams(location.search).get('go');
      if (go === 'practice' && window.__LEARN__ && window.__LEARN__.reviewItems().length) {
        window.__LEARN__.startReview();
      }
    } catch (e) {}
  });
})();
