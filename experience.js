/* World of Trade — Experience Layer v7
   Visual coach, daily briefing, referral invite and section-aware guidance.
   Keeps the core learning engine deterministic: this module changes experience,
   not answers or progression rules. */
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const SITE = () => (window.WOT_CLOUD?.siteUrl || location.origin).replace(/\/$/, '');
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GUIDE = {
    pathScreen: {
      kicker: 'Career Path', title: 'Build the desk fundamentals',
      copy: 'This is your structured route through the trading house. Clear levels in order, then use the Trading Floor to keep sharpening the same skills under pressure.',
      action: 'Show my next level'
    },
    playScreen: {
      kicker: 'Trading Floor', title: 'Turn knowledge into decisions',
      copy: 'Use Flash for speed, the Daily Deal for one complete scenario, Boss Deals for multi-step judgement, and Endless Runs when you want fresh desk pressure.',
      action: 'Show today’s priorities'
    },
    practiceScreen: {
      kicker: 'Practice', title: 'Repair weak spots',
      copy: 'Practice is adaptive. I bring back concepts you missed or have not seen for a while, so your score reflects what you can still recall—not what you once completed.',
      action: 'Find a weak skill'
    },
    leagueScreen: {
      kicker: 'League', title: 'Compete without pay-to-win shortcuts',
      copy: 'Weekly XP resets the race. Your career XP stays yours, while the League measures what you do this week. Invite other commodity people and compare progress.',
      action: 'Open invite tools'
    },
    profileScreen: {
      kicker: 'Profile', title: 'Read your desk identity',
      copy: 'Your rank, skills, trophies and desk map live here. Treat it like a trading CV: it should show where you are strong and what desk you should train next.',
      action: 'Review my skills'
    }
  };

  let currentScreen = 'pathScreen';
  let coachOpen = false;

  function dayKey(d=new Date()) {
    const p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  }

  function ensureShell() {
    if ($('#heleneCoach')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <aside id="heleneCoach" class="helene-coach" aria-live="polite" aria-label="Hélène, trading mentor" hidden>
        <button class="helene-close" type="button" aria-label="Close Hélène">×</button>
        <div class="helene-avatar" id="heleneAvatar"></div>
        <div class="helene-dialogue">
          <span class="eyebrow" id="heleneKicker">Trading mentor</span>
          <h2 id="heleneTitle">Hélène</h2>
          <p id="heleneCopy"></p>
          <button id="heleneAction" class="helene-action" type="button"
                  aria-label="Coach suggestion"></button>
        </div>
      </aside>
      <button id="heleneCall" class="helene-call" type="button" aria-label="Ask Hélène about this section"><span>H</span><b>Ask Hélène</b></button>
      <div id="dailyBriefing" class="daily-briefing-layer" hidden></div>
    `);
    $('#heleneCall')?.addEventListener('click', () => showCoach(currentScreen, true));
    $('.helene-close')?.addEventListener('click', closeCoach);
    $('#heleneAction')?.addEventListener('click', coachAction);
    $('#dailyBriefing')?.addEventListener('click', e => { if (e.target.id === 'dailyBriefing') closeBriefing(); });
  }

  function showCoach(screen=currentScreen, force=false) {
    if (!GUIDE[screen] || !window.MASCOT || document.body.classList.contains('auth-locked')) return;
    currentScreen = screen;
    const seenKey = `wot_helene_seen_v2_${screen}`;
    if (!force && localStorage.getItem(seenKey)) return;
    localStorage.setItem(seenKey, '1');
    const g = GUIDE[screen], host = $('#heleneCoach');
    if (!host) return;
    $('#heleneAvatar').innerHTML = window.MASCOT.svg('teach', 104);
    $('#heleneKicker').textContent = g.kicker;
    $('#heleneTitle').textContent = g.title;
    $('#heleneCopy').textContent = g.copy;
    const az = $('#heleneAction');
    az.textContent = g.action;
    // il testo del pulsante cambia: l'etichetta accessibile deve seguirlo
    az.setAttribute('aria-label', g.action || 'Coach suggestion');
    host.hidden = false; coachOpen = true;
    if (motionOK()) { host.classList.remove('coach-enter'); void host.offsetWidth; host.classList.add('coach-enter'); }
  }
  function closeCoach() { const h=$('#heleneCoach'); if (h) h.hidden=true; coachOpen=false; }

  function coachAction() {
    closeCoach();
    if (currentScreen === 'pathScreen') {
      const node = $('.node.next:not(.locked), .node:not(.done):not(.locked)');
      node?.scrollIntoView({behavior:motionOK()?'smooth':'auto',block:'center'});
    } else if (currentScreen === 'playScreen') {
      $('#dailyQuestShelf')?.scrollIntoView({behavior:motionOK()?'smooth':'auto',block:'start'});
    } else if (currentScreen === 'practiceScreen') {
      $('#practiceHub')?.scrollIntoView({behavior:motionOK()?'smooth':'auto',block:'start'});
    } else if (currentScreen === 'leagueScreen') {
      $('#inviteTraders')?.scrollIntoView({behavior:motionOK()?'smooth':'auto',block:'center'});
    } else if (currentScreen === 'profileScreen') {
      $('#profileBody')?.scrollIntoView({behavior:motionOK()?'smooth':'auto',block:'start'});
    }
  }

  function dailySnapshot() {
    const L = window.__LEARN__;
    if (!L) return { quests:[], claimed:0, dealDone:false };
    const quests = L.dailyQuests ? L.dailyQuests() : [];
    return {
      quests,
      claimed: quests.filter(q => L.state?.daily?.claimed?.[q.id]).length,
      dealDone: !!L.state?.daily?.dealDone,
      flashCorrect: Number(L.state?.daily?.flashCorrect)||0,
      trainingRuns: Number(L.state?.daily?.trainingRuns)||0
    };
  }

  function renderDailyPulse() {
    const host = $('#pathGreet');
    if (!host || !window.__LEARN__) return;
    let pulse = $('#dailyPulse');
    if (!pulse) {
      host.insertAdjacentHTML('afterend','<section id="dailyPulse" class="daily-pulse"></section>');
      pulse = $('#dailyPulse');
    }
    const d = dailySnapshot();
    const total = Math.max(1,d.quests.length || 3);
    const pct = Math.round((d.claimed/total)*100);
    pulse.innerHTML = `
      <div class="daily-pulse-head">
        <div><span class="eyebrow">Opening Bell · ${esc(dayKey())}</span><h2>Your desk is live</h2></div>
        <div class="daily-ring" style="--daily:${pct * 3.6}deg"><b>${d.claimed}/${total}</b><small>claimed</small></div>
      </div>
      <p>Do one focused session today. Complete the Daily Deal, train a weak area or hit the Trading Floor, then collect your Desk Quest rewards.</p>
      <div class="daily-pulse-actions">
        <button type="button" data-daily-jump="playScreen">Open today’s desk</button>
        <button type="button" data-daily-brief>See briefing</button>
      </div>`;
    $$('[data-daily-jump]', pulse).forEach(b=>b.addEventListener('click',()=>jumpScreen(b.dataset.dailyJump)));
    $('[data-daily-brief]', pulse)?.addEventListener('click',()=>showBriefing(true));
  }

  function showBriefing(force=false) {
    if (document.body.classList.contains('auth-locked') || !window.__LEARN__ || !window.MASCOT) return;
    const key='wot_daily_briefing_'+dayKey();
    if (!force && localStorage.getItem(key)) return;
    localStorage.setItem(key,'1');
    const layer=$('#dailyBriefing'); if(!layer) return;
    const d=dailySnapshot();
    const qhtml=(d.quests||[]).slice(0,3).map((q,i)=>{
      const done=!!q.done, claimed=!!window.__LEARN__.state?.daily?.claimed?.[q.id];
      return `<article class="brief-mission ${done?'done':''}"><i>${claimed?'✓':i+1}</i><div><b>${esc(q.title||q.label||'Desk mission')}</b><small>${esc(q.copy||q.description||'Complete today’s objective')}</small></div></article>`;
    }).join('') || '<article class="brief-mission"><i>1</i><div><b>Open the desk</b><small>Your daily objectives are loading.</small></div></article>';
    layer.innerHTML=`<section class="daily-briefing" role="dialog" aria-modal="true" aria-labelledby="briefTitle">
      <button class="brief-close" type="button" aria-label="Close daily briefing">×</button>
      <div class="brief-helene">${window.MASCOT.svg('teach',116)}</div>
      <span class="eyebrow">Daily desk briefing</span><h2 id="briefTitle">Market open. Three moves, then you’re done.</h2>
      <p>You do not need a long study session. Clear a few purposeful activities and keep your trading routine alive.</p>
      <div class="brief-missions">${qhtml}</div>
      <button id="briefGo" class="btn primary wide" type="button">Go to today’s activities</button>
      <small class="brief-note">Daily quests already award XP. This briefing adds focus, not a second farming reward.</small>
    </section>`;
    layer.hidden=false;
    $('.brief-close',layer)?.addEventListener('click',closeBriefing);
    $('#briefGo')?.addEventListener('click',()=>{closeBriefing();jumpScreen('playScreen');setTimeout(()=>$('#dailyQuestShelf')?.scrollIntoView({behavior:motionOK()?'smooth':'auto'}),120);});
  }
  function closeBriefing(){const l=$('#dailyBriefing');if(l)l.hidden=true;}

  function jumpScreen(id) {
    const b=$(`.nav-item[data-screen="${id}"]`);
    if (b) b.click();
  }

  function referralUrl() {
    // v7.1: when the social layer is available, use its stable personal code
    // instead of the mutable/non-unique public trader alias.
    if (window.WOT_SOCIAL?.referralUrl) return window.WOT_SOCIAL.referralUrl();
    const u=new URL(SITE()+'/', location.href);
    u.searchParams.set('utm_source','linkedin');u.searchParams.set('utm_medium','invite');u.searchParams.set('utm_campaign','trader_invite');
    return u.toString();
  }
  function linkedInShareUrl(){ return 'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(referralUrl()); }
  async function copyInvite() {
    const url=referralUrl();
    const text=`I’m using World of Trade to train physical commodity trading through daily deals, desk simulations and competitive leagues. Join me: ${url}`;
    try{await navigator.clipboard.writeText(text);return true;}catch(e){return false;}
  }
  function captureReferral(){
    try{const ref=new URL(location.href).searchParams.get('ref');if(ref)localStorage.setItem('wot_referrer_pending',ref.slice(0,40));}catch(e){}
  }
  function renderInvite() {
    const parent=$('#leagueScreen .tab-wrap'); if(!parent || $('#inviteTraders'))return;
    parent.insertAdjacentHTML('beforeend',`<section id="inviteTraders" class="league-panel invite-panel">
      <div class="invite-icon">in</div><div class="invite-copy"><span class="eyebrow">Grow your desk circle</span><h2>Invite traders on LinkedIn</h2>
      <p>Share your World of Trade invite link with your professional network. Referral tags are attached automatically.</p>
      <div class="invite-actions"><a id="inviteLinkedIn" class="linkedin-invite" target="_blank" rel="noopener noreferrer">Invite on LinkedIn</a><button id="inviteCopy" type="button">Copy invite</button></div>
      <small id="inviteStatus">Friend ranking via LinkedIn connections needs restricted LinkedIn API approval; we do not fake connection data.</small></div>
    </section>`);
    $('#inviteLinkedIn').href=linkedInShareUrl();
    $('#inviteCopy').addEventListener('click',async()=>{$('#inviteStatus').textContent=(await copyInvite())?'Invite text copied. Paste it into a LinkedIn message or post.':'Could not access the clipboard; use Invite on LinkedIn instead.';});
  }

  function decorateSections() {
    const data={pathScreen:['01','Career'],playScreen:['02','Floor'],practiceScreen:['03','Practice'],leagueScreen:['04','League'],profileScreen:['05','Profile']};
    Object.entries(data).forEach(([id,[n,name]])=>{const top=$(`#${id} .section-top`);if(top&&!$('.section-number',top))top.insertAdjacentHTML('afterbegin',`<div class="section-number"><b>${n}</b><span>${name}</span></div>`);});
  }

  function onScreen(id) {
    if (!GUIDE[id]) return;
    // Never carry an open coach overlay between tabs: on mobile that can lock
    // body scrolling and visibly shift the Adaptive Training screen.
    closeCoach();
    currentScreen=id;
    document.body.dataset.section=id.replace('Screen','').toLowerCase();
    // Career Path is levels-only and Adaptive Training must remain viewport-stable.
    // Hélène is still available manually through the floating H button.
    if(id!=='practiceScreen' && id!=='pathScreen') setTimeout(()=>showCoach(id,false),260);
    if(id==='leagueScreen')renderInvite();
  }

  function readyAfterAuth() {
    if(document.body.classList.contains('auth-locked'))return;
    renderInvite(); decorateSections();
    const active=$('.screen.active')?.id||'pathScreen'; onScreen(active);
  }

  function init(){
    ensureShell(); captureReferral(); decorateSections(); renderInvite();
    window.addEventListener('wot:screen',e=>onScreen(e.detail?.id));
    window.addEventListener('wot:saved',()=>{});
    window.addEventListener('wot:auth',e=>{if(e.detail?.signedIn)setTimeout(readyAfterAuth,250);else{closeCoach();closeBriefing();}});
    // Existing sessions may have been loaded before this module executes.
    let tries=0;const t=setInterval(()=>{tries++;if(!document.body.classList.contains('auth-locked')){clearInterval(t);readyAfterAuth();}else if(tries>40)clearInterval(t);},150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  window.WOT_EXPERIENCE={showCoach,showBriefing,referralUrl,linkedInShareUrl,renderDailyPulse};
})();
