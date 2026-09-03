/* World of Trade installable app / PWA runtime. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || '');

  // ── service worker ────────────────────────────────────────────────
  if (!window.WOT_NATIVE && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (sw) sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) sw.postMessage('skip-waiting');
          });
        });
      }).catch(() => {});

      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        location.reload();
      });
    });
  }

  let prompt = null;

  function hideInstall() {
    const host = $('#installHost');
    if (host) host.innerHTML = '';
  }

  function showIOSGuide() {
    let dlg = document.getElementById('iosInstallGuide');
    if (!dlg) {
      dlg = document.createElement('div');
      dlg.id = 'iosInstallGuide';
      dlg.className = 'cloud-dialog';
      dlg.setAttribute('role', 'dialog');
      dlg.setAttribute('aria-modal', 'true');
      dlg.innerHTML = `
        <div class="cloud-panel" style="max-width:430px">
          <button class="cloud-close" id="iosInstallClose" aria-label="Close">✕</button>
          <span class="eyebrow">Install World of Trade</span>
          <h2 style="margin-top:8px">Play it like an app</h2>
          <ol style="text-align:left;line-height:1.65;padding-left:22px">
            <li>Open this page in <b>Safari</b>.</li>
            <li>Tap the <b>Share</b> button.</li>
            <li>Choose <b>Add to Home Screen</b>.</li>
            <li>Tap <b>Add</b>, then open World of Trade from the icon.</li>
          </ol>
          <p class="cloud-fine">It will open full-screen in portrait mode, without the browser bar.</p>
        </div>`;
      document.body.appendChild(dlg);
      dlg.querySelector('#iosInstallClose')?.addEventListener('click', () => dlg.hidden = true);
      dlg.addEventListener('click', e => { if (e.target === dlg) dlg.hidden = true; });
    }
    dlg.hidden = false;
  }

  function paintIOSInstall() {
    if (window.WOT_NATIVE || standalone() || !isIOS()) return;
    const host = $('#installHost');
    if (!host || host.dataset.installPainted) return;
    host.dataset.installPainted = '1';
    host.innerHTML = `<button id="iosInstallButton" class="install-btn"><span aria-hidden="true">↓</span> Install World of Trade</button>`;
    $('#iosInstallButton')?.addEventListener('click', showIOSGuide);
  }

  if (!window.WOT_NATIVE) {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      prompt = e;
      const host = $('#installHost');
      if (!host || standalone()) return;
      host.innerHTML = `<button id="installButton" class="install-btn"><span aria-hidden="true">↓</span> Install World of Trade</button>`;
      $('#installButton')?.addEventListener('click', async () => {
        if (!prompt) return;
        prompt.prompt();
        try { await prompt.userChoice; } catch (_) {}
        prompt = null;
        hideInstall();
      });
    });

    window.addEventListener('appinstalled', () => {
      prompt = null;
      hideInstall();
    });

    window.addEventListener('load', () => {
      if (standalone()) hideInstall();
      else paintIOSInstall();
    });
  }

  // ── offline status ────────────────────────────────────────────────
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

  // ── shortcut ─────────────────────────────────────────────────────
  window.addEventListener('load', () => {
    try {
      const go = new URLSearchParams(location.search).get('go');
      if (go === 'practice' && window.__LEARN__ && window.__LEARN__.reviewItems().length) window.__LEARN__.startReview();
    } catch (_) {}
  });
})();
