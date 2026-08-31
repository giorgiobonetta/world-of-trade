/* World of Trade — Mobile UI polish v0.3
   Visual/accessibility behavior only. No scoring, content or progression rules. */
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncNav(screenId) {
    $$('.nav-item[data-screen]').forEach(btn => {
      const active = btn.dataset.screen === screenId;
      btn.toggleAttribute('aria-current', active);
      if (active) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
  }

  function currentScreen() {
    return $('.screen.active')?.id || 'pathScreen';
  }

  function updateSection(id=currentScreen()) {
    const simple = String(id).replace(/Screen$/, '').toLowerCase();
    if (['path','play','practice','league','profile'].includes(simple)) {
      document.body.dataset.section = simple;
      syncNav(id);
    }
  }

  function updateHeaderScroll() {
    $('#appHeader')?.classList.toggle('scrolled', window.scrollY > 8);
  }

  function visibleOverlay() {
    return $$('.cloud-dialog,.social-dialog,.daily-briefing-layer,.helene-coach')
      .some(el => !el.hidden && getComputedStyle(el).display !== 'none');
  }

  function syncOverlayLock() {
    document.body.classList.toggle('overlay-open', visibleOverlay());
  }

  let observer;
  function prepareReveal(root=document) {
    const targets = $$('.mode-card,.mode-hero,.practice-card,.league-panel,.world-map-shell,.daily-quests,.unit,.profile-rank,.skill-card,.flash-record,.daily-pulse', root)
      .filter(el => !el.classList.contains('ui-reveal'));
    targets.forEach(el => {
      el.classList.add('ui-reveal');
      if (reduceMotion() || !observer) el.classList.add('is-visible');
      else observer.observe(el);
    });
  }

  function initReveal() {
    if (!('IntersectionObserver' in window) || reduceMotion()) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .06, rootMargin: '40px 0px -10px' });
  }

  function improveDialogSemantics() {
    $$('.cloud-dialog,.social-dialog,.daily-briefing-layer').forEach(el => {
      if (!el.hasAttribute('role')) el.setAttribute('role','presentation');
    });
  }

  function mutationHandler(mutations) {
    let shouldReveal = false, shouldLock = false;
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length) shouldReveal = true;
      if (m.type === 'attributes' && m.attributeName === 'hidden') shouldLock = true;
    }
    if (shouldReveal) requestAnimationFrame(() => prepareReveal());
    if (shouldLock) requestAnimationFrame(syncOverlayLock);
  }

  function init() {
    initReveal();
    updateSection();
    prepareReveal();
    improveDialogSemantics();
    updateHeaderScroll();
    syncOverlayLock();

    window.addEventListener('scroll', updateHeaderScroll, { passive:true });
    window.addEventListener('wot:screen', e => {
      updateSection(e.detail?.id || currentScreen());
      requestAnimationFrame(() => prepareReveal());
    });
    window.addEventListener('wot:saved', () => requestAnimationFrame(() => prepareReveal()));
    window.addEventListener('wot:auth', () => requestAnimationFrame(syncOverlayLock));

    const mo = new MutationObserver(mutationHandler);
    mo.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['hidden'] });

    // Escape consistently dismisses the visual coach/briefing before anything else.
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const brief = $('#dailyBriefing');
      const coach = $('#heleneCoach');
      if (brief && !brief.hidden) brief.querySelector('.brief-close')?.click();
      else if (coach && !coach.hidden) coach.querySelector('.helene-close')?.click();
      requestAnimationFrame(syncOverlayLock);
    });

    document.body.classList.add('ui-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
