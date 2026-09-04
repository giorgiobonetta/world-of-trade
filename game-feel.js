/* World of Trade — Game Feel + Reward Progression v0.5.5
   Presentation layer only: haptics, answer feedback, promotion/desk unlock
   celebrations and clearer current-level state. No scoring rules are changed. */
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function haptic(kind='tap') {
    try {
      if (!navigator.vibrate) return;
      try { const cfg=JSON.parse(localStorage.getItem('wot-settings-v1')||'{}'); if (cfg.haptics === false) return; } catch(e) {}
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

  function installRewardStyles() {
    if ($('#rewardStyles055')) return;
    const style = document.createElement('style');
    style.id = 'rewardStyles055';
    style.textContent = `
      /* Current assignment: visible at a glance, but still inside the existing Path. */
      .node.next{position:relative;overflow:visible!important;transform:translateZ(0)}
      .node.next::before{content:"";position:absolute;inset:-5px;border:2px solid rgba(255,212,92,.30);border-radius:calc(var(--r-md,20px) + 5px);pointer-events:none;opacity:.8}
      .node.next .tag{background:#ffd45c!important;color:#08183f!important;box-shadow:0 3px 0 #a35f04!important;letter-spacing:.08em!important}
      .node.done .medal{box-shadow:0 3px 0 #135f3b,0 0 0 3px rgba(79,224,138,.12)!important}
      @media (prefers-reduced-motion:no-preference){
        .node.next::before{animation:wotCurrentPulse 1.9s ease-in-out infinite}
        @keyframes wotCurrentPulse{0%,100%{opacity:.30;transform:scale(.995)}50%{opacity:.9;transform:scale(1.012)}}
      }

      /* Extra reward information added to the existing completion screen. */
      .reward-rank055{margin:12px 0 0;padding:12px 13px;border-radius:15px;background:rgba(5,20,50,.52);border:1px solid rgba(255,212,92,.16)}
      .reward-rank055-top{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px;color:#bfd0ea}
      .reward-rank055-top strong{color:#fff0b8;font-size:12px}
      .reward-rank055-track{height:7px;margin-top:8px;border-radius:99px;overflow:hidden;background:rgba(1,8,25,.58);box-shadow:inset 0 1px 3px rgba(0,0,0,.45)}
      .reward-rank055-track i{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#f5a623,#ffd45c,#fff0b8);transition:width .8s cubic-bezier(.2,.8,.2,1)}
      .reward-achievement055{display:grid;grid-template-columns:42px minmax(0,1fr);gap:10px;align-items:center;margin:12px 0 0;padding:11px 12px;border-radius:15px;background:linear-gradient(145deg,rgba(90,61,13,.58),rgba(12,40,84,.80));border:1px solid rgba(255,212,92,.34)}
      .reward-achievement055>i{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(145deg,#fff0b8,#f5a623);color:#08183f;font-style:normal;font-weight:900;box-shadow:0 3px 0 #a35f04}
      .reward-achievement055 small,.reward-achievement055 strong{display:block}.reward-achievement055 small{font-size:9px;color:#ffd45c;font-weight:900;letter-spacing:.11em}.reward-achievement055 strong{font-size:14px;color:#fff;margin-top:1px}

      /* Full-screen milestone celebration. It only appears for meaningful events. */
      .reward-layer055{position:fixed;inset:0;z-index:10020;display:grid;place-items:center;padding:calc(22px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom));background:radial-gradient(75% 50% at 50% 27%,rgba(255,212,92,.18),transparent 68%),rgba(2,8,22,.91);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;transition:opacity .24s ease}
      .reward-layer055.show{opacity:1}.reward-layer055[hidden]{display:none!important}
      .reward-card055{width:min(100%,430px);position:relative;overflow:hidden;text-align:center;padding:27px 19px 20px;border-radius:30px;background:linear-gradient(160deg,#173f82 0%,#092556 62%,#3a2b0d 100%);border:2px solid rgba(255,212,92,.58);box-shadow:0 25px 70px rgba(0,0,0,.55),inset 0 2px 0 rgba(255,255,255,.14);transform:translateY(20px) scale(.96);transition:transform .36s cubic-bezier(.2,.9,.25,1.25)}
      .reward-layer055.show .reward-card055{transform:none}.reward-card055::before{content:"";position:absolute;inset:-30% -70%;background:linear-gradient(105deg,transparent 43%,rgba(255,255,255,.19) 49%,transparent 55%);transform:translateX(-45%)}
      @media(prefers-reduced-motion:no-preference){.reward-layer055.show .reward-card055::before{animation:wotRewardShine 1.1s .18s ease both}@keyframes wotRewardShine{to{transform:translateX(48%)}}}
      .reward-mascot055{height:112px;display:grid;place-items:center;margin:-4px auto 3px;position:relative;z-index:1}.reward-mascot055 svg{max-height:112px;width:auto;filter:drop-shadow(0 9px 14px rgba(0,0,0,.30))}
      .reward-kicker055{position:relative;z-index:1;margin:4px 0 0;color:#ffd45c;font-size:10px;font-weight:900;letter-spacing:.18em}
      .reward-title055{position:relative;z-index:1;margin:5px auto 0;color:#fff8da;font-size:clamp(29px,8vw,38px);line-height:1.04;letter-spacing:-.035em;max-width:360px}
      .reward-copy055{position:relative;z-index:1;margin:10px auto 0;max-width:330px;color:#d0dff5;font-size:13px;line-height:1.45}
      .reward-meta055{position:relative;z-index:1;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:15px 0}.reward-meta055 span{padding:7px 10px;border-radius:999px;background:rgba(4,17,45,.55);border:1px solid rgba(255,255,255,.12);color:#e8f1ff;font-size:10px;font-weight:800}.reward-meta055 b{color:#ffd45c}
      .reward-action055{position:relative;z-index:1;width:100%;min-height:53px;border-radius:16px;background:linear-gradient(180deg,#fff0b8,#f5a623);color:#08183f;font-weight:900;font-size:15px;box-shadow:0 5px 0 #9b5d07;cursor:pointer}.reward-action055:active{transform:translateY(3px);box-shadow:0 2px 0 #9b5d07}
      .reward-dismiss055{position:relative;z-index:1;margin-top:12px;color:#b9cce7;font-size:11px;font-weight:700;cursor:pointer}
      @media(max-width:430px){.reward-card055{padding:23px 16px 18px;border-radius:26px}.reward-mascot055{height:96px}.reward-mascot055 svg{max-height:96px}.reward-copy055{font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  function currentRankSnapshot() {
    const api = window.__LEARN__;
    if (!api?.careerRank) return { name:'Intern', index:0, next:null };
    const r = api.careerRank();
    return { name:r.current?.name || 'Intern', index:Number(r.index)||0, next:r.next || null };
  }

  function achievementSet() {
    const api = window.__LEARN__;
    try { return new Map((api?.unlockedAchievements?.() || []).map(a => [a.id,a])); }
    catch (e) { return new Map(); }
  }

  let lastRank = null;
  let seenAchievements = null;
  function primeRewardState() {
    lastRank = currentRankSnapshot();
    seenAchievements = achievementSet();
  }

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  const rewardQueue = [];
  let rewardOpen = false;

  function rewardMascot(expression='happy') {
    try { return window.MASCOT?.svg?.(expression,112) || '<div style="font-size:64px">★</div>'; }
    catch (e) { return '<div style="font-size:64px">★</div>'; }
  }

  function enqueueReward(item) {
    if (!item) return;
    rewardQueue.push(item);
    if (!rewardOpen) setTimeout(showNextReward, 180);
  }

  function showNextReward() {
    if (rewardOpen || !rewardQueue.length) return;
    rewardOpen = true;
    const item = rewardQueue.shift();
    const layer = document.createElement('div');
    layer.className = 'reward-layer055';
    layer.setAttribute('role','dialog'); layer.setAttribute('aria-modal','true');
    layer.innerHTML = `<div class="reward-card055">
      <div class="reward-mascot055">${rewardMascot(item.expression || 'happy')}</div>
      <p class="reward-kicker055">${esc(item.kicker || 'MILESTONE')}</p>
      <h2 class="reward-title055">${esc(item.title || 'Well done')}</h2>
      <p class="reward-copy055">${esc(item.copy || '')}</p>
      ${item.meta?.length ? `<div class="reward-meta055">${item.meta.map(x=>`<span>${x.label ? `${esc(x.label)} `:''}<b>${esc(x.value)}</b></span>`).join('')}</div>` : ''}
      <button class="reward-action055" type="button">${esc(item.action || 'Continue')}</button>
      <button class="reward-dismiss055" type="button">Back to results</button>
    </div>`;
    document.body.appendChild(layer);
    const close = (takeAction=false) => {
      layer.classList.remove('show');
      setTimeout(() => {
        layer.remove(); rewardOpen = false;
        if (takeAction) {
          try { item.onAction?.(); } catch (e) {}
        }
        setTimeout(showNextReward, 80);
      },190);
    };
    $('.reward-action055',layer)?.addEventListener('click',()=>close(true));
    $('.reward-dismiss055',layer)?.addEventListener('click',()=>close(false));
    layer.addEventListener('click',e=>{ if(e.target===layer) close(false); });
    const escClose = e => { if(e.key==='Escape'){ document.removeEventListener('keydown',escClose); close(false); } };
    document.addEventListener('keydown',escClose);
    requestAnimationFrame(()=>requestAnimationFrame(()=>layer.classList.add('show')));
    haptic('reward');
  }

  function rankProgress() {
    const api = window.__LEARN__, s = api?.state, r = api?.careerRank?.();
    if (!s || !r?.current) return null;
    if (!r.next) return { current:r.current.name, next:null, pct:100 };
    const doneN = (s.done || []).filter(id => api.allLessons?.some?.(l=>l.id===id)).length;
    const xp = Number(s.xp)||0;
    const prevXp = Number(r.current.xp)||0, nextXp = Number(r.next.xp)||0;
    const prevLessons = Number(r.current.lessons)||0, nextLessons = Number(r.next.lessons)||0;
    const xpPct = nextXp > prevXp ? (xp-prevXp)/(nextXp-prevXp) : 1;
    const lessonPct = nextLessons > prevLessons ? (doneN-prevLessons)/(nextLessons-prevLessons) : 1;
    return { current:r.current.name, next:r.next.name, pct:Math.max(0,Math.min(100,Math.round(Math.min(xpPct,lessonPct)*100))) };
  }

  function decorateDoneScreen(newAchievements=[]) {
    const host = $('#doneCareerLevel')?.closest?.('.done-career-progress');
    if (!host) return;
    $('#rewardRank055')?.remove(); $('#rewardAchievement055')?.remove();
    const p = rankProgress();
    if (p) {
      const box = document.createElement('div'); box.id='rewardRank055'; box.className='reward-rank055';
      box.innerHTML = `<div class="reward-rank055-top"><span>${esc(p.current)}</span><strong>${p.next ? `${p.pct}% to ${esc(p.next)}` : 'Top rank'}</strong></div><div class="reward-rank055-track"><i></i></div>`;
      host.insertAdjacentElement('afterend',box);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ const fill=$('i',box); if(fill) fill.style.width=`${p.pct}%`; }));
    }
    if (newAchievements.length) {
      const a = newAchievements[0];
      const box = document.createElement('div'); box.id='rewardAchievement055'; box.className='reward-achievement055';
      box.innerHTML = `<i>${esc(a.icon || '★')}</i><span><small>ACHIEVEMENT UNLOCKED</small><strong>${esc(a.title || 'New achievement')}</strong></span>`;
      ($('#rewardRank055') || host).insertAdjacentElement('afterend',box);
    }
  }

  function currentDeskForNext(nextId) {
    const api = window.__LEARN__;
    const lesson = api?.allLessons?.find?.(l=>l.id===nextId);
    const unit = lesson ? api.UNITS?.find?.(u=>u.id===lesson.unitId) : null;
    return { lesson, unit, desk:unit ? api.UNITS.indexOf(unit)+1 : null };
  }

  function normalizeCurrentTag() {
    $$('.node.next .tag').forEach(tag => { if (tag.textContent !== 'CURRENT') tag.textContent = 'CURRENT'; });
  }

  document.addEventListener('pointerup', e => {
    const t = e.target.closest?.('.opt,.pair-btn,.tile,[data-mv],.tab-item,.node,.btn,.reward-action055');
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

    const currentAchievements = achievementSet();
    const newlyUnlocked = [];
    if (seenAchievements) currentAchievements.forEach((a,id)=>{ if(!seenAchievements.has(id)) newlyUnlocked.push(a); });
    seenAchievements = currentAchievements;

    const nowRank = currentRankSnapshot();
    const promoted = lastRank && nowRank.index > lastRank.index;
    const previousRank = lastRank;
    lastRank = nowRank;

    setTimeout(() => decorateDoneScreen(newlyUnlocked), 80);

    if (d.newDeskUnlocked && d.nextId) {
      const next = currentDeskForNext(d.nextId);
      if (next.unit) {
        const meta = [{label:'Desk',value:String(next.desk || '')},{label:'Next',value:next.lesson?.title || 'Assignment'}];
        if (promoted) meta.push({label:'Promotion',value:nowRank.name});
        enqueueReward({
          kicker:'NEW DESK UNLOCKED',
          title:next.unit.title,
          copy:promoted
            ? `New desk, new role. You have also been promoted to ${nowRank.name}.`
            : 'Your next assignment is live. New decisions and a new desk are waiting.',
          meta,
          action:`Enter Desk ${next.desk || ''}`,
          onAction:()=>$('#continueButton')?.click(), expression:'happy'
        });
      }
    } else if (promoted) {
      // Promotions deserve a milestone screen, but never stack one immediately
      // after a new-desk celebration. If both happen together they are merged.
      enqueueReward({
        kicker:'CAREER PROMOTION',
        title:nowRank.name,
        copy:`You have moved up from ${previousRank?.name || 'your previous role'}. More responsibility, harder decisions.`,
        meta:[{label:'Role',value:nowRank.name},{label:'Level',value:`LV ${window.__LEARN__?.careerLevel?.() || d.level || ''}`}],
        action:'Continue', expression:'teach'
      });
    }
    // Achievements are surfaced on the result card instead of creating another
    // blocking overlay. One level completion therefore produces at most one modal.
  });

  window.addEventListener('wot:screen', e => {
    if (e.detail?.id === 'pathScreen') setTimeout(normalizeCurrentTag,30);
  });
  const mo = new MutationObserver(()=>{ if(document.body.dataset.activeScreen==='pathScreen') normalizeCurrentTag(); });

  function init() {
    installRewardStyles();
    primeRewardState();
    normalizeCurrentTag();
    const path=$('#pathBody'); if(path) mo.observe(path,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
