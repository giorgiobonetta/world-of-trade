/* World of Trade — shared modal keyboard/focus behaviour. */
(() => {
  'use strict';
  let lastTrigger = null;
  const selector = '[role="dialog"][aria-modal="true"]';
  const focusable = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const visible = el => !!el && !el.hidden && el.getClientRects().length > 0;
  const activeDialog = () => [...document.querySelectorAll(selector)].reverse().find(visible) || null;
  document.addEventListener('click', e => {
    if (!activeDialog() && e.target instanceof Element) lastTrigger = e.target.closest('button,a,input,[tabindex]') || document.activeElement;
  }, true);
  document.addEventListener('keydown', e => {
    const dlg = activeDialog(); if (!dlg) return;
    if (e.key === 'Escape') {
      const close = dlg.querySelector('[aria-label="Close"], [data-close], [id*="Close"], .cloud-x, .dialog-close');
      if (close instanceof HTMLElement) { e.preventDefault(); close.click(); }
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...dlg.querySelectorAll(focusable)].filter(visible);
    if (!items.length) { e.preventDefault(); if (!dlg.hasAttribute('tabindex')) dlg.setAttribute('tabindex','-1'); dlg.focus(); return; }
    const first=items[0], last=items[items.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const observer = new MutationObserver(records => {
    for (const r of records) {
      const dlg = r.target instanceof Element && r.target.matches(selector) ? r.target : null;
      if (!dlg) continue;
      if (visible(dlg)) {
        requestAnimationFrame(() => {
          const f=dlg.querySelector('[autofocus],button:not([disabled]),input:not([disabled]),[href],[tabindex]:not([tabindex="-1"])');
          if (f instanceof HTMLElement && !dlg.contains(document.activeElement)) f.focus();
        });
      } else if (lastTrigger instanceof HTMLElement && document.contains(lastTrigger)) {
        requestAnimationFrame(() => lastTrigger?.focus());
      }
    }
  });
  observer.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['hidden','class','style']});
})();
