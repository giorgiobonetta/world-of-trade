/* World of Trade — Game Feel pass
   Pure presentation layer: haptics, answer pulses and reward micro-feedback. */
(() => {
  'use strict';
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function haptic(kind='tap') {
    // navigator.vibrate works on many Android devices/PWAs and simply no-ops elsewhere.
    try {
      if (!navigator.vibrate) return;
      const pattern = kind === 'good' ? 14 : kind === 'bad' ? [34,24,34] : kind === 'reward' ? [14,34,18] : 7;
      navigator.vibrate(pattern);
    } catch (e) {}
  }

  function pulse(kind) {
    const body = document.body;
    const cls = kind === 'good' ? 'answer-pulse-good' : 'answer-pulse-bad';
    body.classList.remove('answer-pulse-good','answer-pulse-bad');
    if (reduced()) return;
    void body.offsetWidth; body.classList.add(cls);
    setTimeout(() => body.classList.remove(cls), 430);
  }

  function floatReward(text, kind='good') {
    const el = document.createElement('div');
    el.className = `game-float ${kind}`;
    el.textContent = text;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => el.remove(), 1150);
  }

  // Every deliberate game tap gets a tiny physical acknowledgement.
  document.addEventListener('pointerup', e => {
    const t = e.target.closest?.('.opt,.pair-btn,.tile,[data-mv],.tab-item,.node,.btn');
    if (!t || t.disabled) return;
    haptic('tap');
  }, { passive:true });

  window.addEventListener('wot:answer', e => {
    const d = e.detail || {};
    if (d.ok) {
      haptic(d.lifeEarned ? 'reward' : 'good');
      pulse('good');
      if (d.lifeEarned) floatReward('+1 LIFEBUOY', 'reward');
      else if (!d.retry && Number(d.streak) >= 3) floatReward(`${d.streak} IN A ROW`, 'good');
    } else {
      haptic('bad');
      pulse('bad');
      floatReward(d.mode === 'review' ? 'TRY AGAIN' : '−1 LIFEBUOY', 'bad');
    }
  });

  window.addEventListener('wot:runcomplete', e => {
    const d = e.detail || {};
    haptic(d.newDeskUnlocked || d.acc === 100 ? 'reward' : 'good');
  });
})();
