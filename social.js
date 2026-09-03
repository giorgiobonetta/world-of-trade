/* World of Trade — Friends & Social v7.1
   Real referral graph, Friends League and deterministic desk duels.
   No LinkedIn connection data is fabricated: a friend is a World of Trade
   user who accepted a referral link.
*/
(() => {
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const api = () => window.WOT_CLOUD_API || {};
  const learn = () => window.__LEARN__ || null;
  const comp = () => window.WOT_COMP || {};
  const content = () => window.WOT_CONTENT || {};
  const motionOK = () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  let profile = null;
  let friends = [];
  let friendProfiles = new Map();
  let challenges = [];
  let challengeScores = [];
  let refreshToken = 0;
  let duel = null;

  function uid() { return api().idUtente?.() || null; }
  function week() { return comp().weekKey?.(new Date()) || new Date().toISOString().slice(0,10); }
  function cleanAlias(v) { return String(v||'Trader').trim().replace(/\s+/g,' ').slice(0,24) || 'Trader'; }
  function randomCode() {
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out='WOT-';
    const bytes = new Uint8Array(9);
    try { crypto.getRandomValues(bytes); } catch(e) { for(let i=0;i<bytes.length;i++) bytes[i]=Math.floor(Math.random()*256); }
    for(let i=0;i<9;i++) out += alphabet[bytes[i] % alphabet.length];
    return out;
  }
  function siteRoot() {
    const configured = String(window.WOT_CLOUD?.siteUrl || '').trim();
    if (configured) return configured.replace(/\/$/,'');
    return location.origin + location.pathname.replace(/\/learn(?:\.html)?$/,'').replace(/\/$/,'');
  }
  function referralUrl() {
    const u = new URL(siteRoot() + '/', location.href);
    if (profile?.referral_code) u.searchParams.set('ref', profile.referral_code);
    u.searchParams.set('utm_source','linkedin');
    u.searchParams.set('utm_medium','invite');
    u.searchParams.set('utm_campaign','friends_league');
    return u.toString();
  }

  function friendIds() {
    const me = uid();
    return friends.map(r => r.user_a === me ? r.user_b : r.user_a).filter(Boolean);
  }


  function stringHash(v) {
    let h=2166136261>>>0; for(const ch of String(v||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);} return h>>>0;
  }
  function weeklyRivalId() {
    const ids=friendIds().slice().sort(); if(!ids.length)return null;
    return ids[stringHash(week()) % ids.length];
  }
  function pendingIncomingCount() {
    const me=uid();
    return challenges.filter(c=>c.opponent_id===me && !scoreFor(c.id,me)).length;
  }
  function renderNavBadge() {
    const n=pendingIncomingCount();
    document.querySelectorAll('.tab-badge[data-tab-badge="leagueScreen"]').forEach(b=>{
      b.hidden=!n; b.textContent=n>99?'99+':String(n||'');
      b.setAttribute('aria-label', n===1?'1 notification':`${n} notifications`);
    });
    // Keep compatibility with any desktop/social badge already present.
    const nav=document.querySelector('#gameNav .nav-item[data-screen="leagueScreen"]');
    if(nav){
      let b=nav.querySelector('.social-nav-badge');
      if(!n){b?.remove();}
      else{if(!b){b=document.createElement('span');b.className='social-nav-badge';nav.appendChild(b);} b.textContent=n>9?'9+':String(n);}
    }
  }

  async function ensureProfile() {
    const A=api(), me=uid(), L=learn();
    if (!A.enabled || !me || !L) return null;
    let existing = null;
    try { existing = await A.socialProfileByUser?.(me); } catch(e) { return null; }
    const alias = cleanAlias(L.state?.competitive?.alias || existing?.alias || 'Trader');
    const house = L.state?.competitive?.house || existing?.house || null;
    const code = existing?.referral_code || randomCode();
    try {
      profile = await A.upsertSocialProfile?.({ alias, house, referral_code:code }) || {user_id:me,alias,house,referral_code:code};
    } catch(e) { profile = existing; }
    return profile;
  }

  async function acceptPendingReferral() {
    const code = String(localStorage.getItem('wot_referrer_pending') || '').trim();
    if (!code || !uid() || !api().acceptReferral) return null;
    try {
      const result = await api().acceptReferral(code);
      if (result?.ok || ['self','not-found'].includes(result?.reason)) localStorage.removeItem('wot_referrer_pending');
      if (result?.ok) {
        localStorage.setItem('wot_friend_welcome', JSON.stringify({alias:result.inviter?.alias || 'a trader', at:Date.now()}));
      }
      return result;
    } catch(e) { return null; }
  }

  async function loadSocial() {
    const A=api(), me=uid();
    if (!A.enabled || !me) return {online:false};
    await ensureProfile();
    await acceptPendingReferral();
    try {
      friends = await A.friendRows?.() || [];
      const ids=friendIds();
      const ps = await A.socialProfiles?.(ids) || [];
      friendProfiles = new Map(ps.map(p=>[p.user_id,p]));
      challenges = await A.friendChallenges?.() || [];
      challengeScores = await A.friendChallengeScores?.(challenges.map(c=>c.id)) || [];
      renderNavBadge();
      return {online:true};
    } catch(e) { return {online:false,error:e}; }
  }

  function ownLeagueEntry() {
    return learn()?.leagueEntry?.() || {week:week(),alias:profile?.alias||'Trader',house:profile?.house||null,tier:'bronze',score:0};
  }

  async function friendStandings() {
    const A=api(), me=uid(), ids=[me,...friendIds()].filter(Boolean);
    if (!ids.length) return [];
    let rows=[];
    try { rows=await A.friendLeagueRows?.(week(),ids) || []; } catch(e) {}
    const by=new Map(rows.map(r=>[r.user_id,r]));
    const own=ownLeagueEntry();
    by.set(me,{user_id:me,...own,me:true});
    for(const id of friendIds()) {
      if(!by.has(id)) {
        const p=friendProfiles.get(id)||{};
        by.set(id,{user_id:id,week:week(),alias:p.alias||'Trader',house:p.house||null,tier:'bronze',score:0});
      }
    }
    return [...by.values()].sort((a,b)=>Number(b.score||0)-Number(a.score||0));
  }

  function rewards(friendCount) {
    return [
      {n:1,title:'First Connection',copy:'Add your first real trader to the circle.',unlocked:friendCount>=1,icon:'01'},
      {n:3,title:'Desk Circle Frame',copy:'Unlock the social profile frame at 3 friends.',unlocked:friendCount>=3,icon:'03'},
      {n:5,title:'Hélène Social Salute',copy:'Unlock a special Hélène celebration at 5 friends.',unlocked:friendCount>=5,icon:'05'},
    ];
  }

  function applySocialCosmetics() {
    document.body.classList.toggle('friend-frame-unlocked', friendIds().length >= 3);
  }

  async function renderPanel() {
    const parent=$('#leagueScreen .tab-wrap'); if(!parent) return;
    let host=$('#socialCircle');
    if(!host) {
      const invite=$('#inviteTraders');
      const html='<section id="socialCircle" class="league-panel social-circle"></section>';
      if(invite) invite.insertAdjacentHTML('beforebegin',html); else parent.insertAdjacentHTML('beforeend',html);
      host=$('#socialCircle');
    }
    const t=++refreshToken;
    host.innerHTML='<div class="social-loading"><span></span><b>Loading your trading circle…</b></div>';
    const status=await loadSocial();
    if(t!==refreshToken) return;
    applySocialCosmetics();
    if(!status.online) {
      host.innerHTML=`<div class="card-title"><div><span class="eyebrow">Friends & duels</span><h2>Trading Circle</h2></div><small>Backend setup required</small></div>
        <div class="social-empty"><b>Friends League is ready in the app, but the social Supabase tables are not configured yet.</b><p>Run the v7.1 SQL in SUPABASE-SETUP.md. Global League and career progress remain unaffected.</p></div>`;
      return;
    }
    const standings=await friendStandings();
    const friendCount=friendIds().length;
    const myIndex=standings.findIndex(r=>r.user_id===uid());
    const challengeHtml=renderChallenges();
    host.innerHTML=`
      <div class="card-title social-title"><div><span class="eyebrow">Friends & duels</span><h2>Trading Circle</h2></div><small>${friendCount} friend${friendCount===1?'':'s'} · ${myIndex>=0?`rank #${myIndex+1}`:'unranked'}</small></div>
      <div class="social-grid">
        <div class="friends-league-card">
          <div class="social-subhead"><div><b>Friends League</b><small>Weekly XP among people who joined through World of Trade invites.</small></div><span>${esc(comp().weekRange?.(week())||week())}</span></div>
          ${friendCount ? `<div class="friends-board"><div class="friends-head"><span>#</span><span>Trader</span><span>House</span><span>XP</span><span></span></div>${standings.map((r,i)=>friendRow(r,i)).join('')}</div>` : `<div class="social-empty compact"><b>Your circle is empty.</b><p>Invite one trader and this becomes a real private leaderboard — no simulated friends.</p><button type="button" data-social-invite>Invite first friend</button></div>`}
        </div>
        <div class="referral-card">
          <span class="eyebrow">Your invite code</span><strong>${esc(profile?.referral_code||'—')}</strong>
          <p>Anyone who joins with this link is added to your Trading Circle after signing in.</p>
          <div class="referral-actions"><a data-social-linkedin target="_blank" rel="noopener noreferrer">Share on LinkedIn</a><button type="button" data-social-copy>Copy link</button></div>
          <small data-social-status>Referral relationships are stored in World of Trade, not inferred from LinkedIn contacts.</small>
        </div>
      </div>
      ${renderWeeklyRival()}
      <div class="duel-zone">
        <div class="social-subhead"><div><b>Head-to-head desk challenges</b><small>Same desk, same seed, same 10 questions. Career XP is not awarded.</small></div><span>${challenges.length} challenge${challenges.length===1?'':'s'}</span></div>
        <div class="challenge-list">${challengeHtml}</div>
      </div>
      <div class="social-rewards"><div class="social-subhead"><div><b>Invite milestones</b><small>Cosmetic rewards only — no pay-to-win XP.</small></div></div><div class="social-reward-grid">${rewards(friendCount).map(r=>`<article class="social-reward ${r.unlocked?'unlocked':''}"><i>${r.unlocked?'✓':r.icon}</i><div><b>${esc(r.title)}</b><small>${esc(r.copy)}</small></div><em>${r.unlocked?'UNLOCKED':`${friendCount}/${r.n}`}</em></article>`).join('')}</div></div>`;
    bindPanel();
    showWelcomeIfNeeded();
  }

  function friendRow(r,i) {
    const me=r.user_id===uid(), p=friendProfiles.get(r.user_id)||r;
    const house=(comp().houses||[]).find(h=>h.id===(r.house||p.house));
    return `<div class="friends-row ${me?'me':''}"><b>${i+1}</b><span>${esc(r.alias||p.alias||'Trader')}${me?'<small>You</small>':''}</span><i>${esc(house?.icon||'—')}</i><strong>${Number(r.score)||0}</strong>${me?'<span></span>':`<button type="button" data-challenge="${esc(r.user_id)}">Challenge</button>`}</div>`;
  }

  function renderWeeklyRival() {
    const rid=weeklyRivalId(); if(!rid)return '';
    const p=friendProfiles.get(rid)||{};
    const current=challenges.find(c=>c.week===week() && ((c.challenger_id===uid()&&c.opponent_id===rid)||(c.opponent_id===uid()&&c.challenger_id===rid)));
    const my=current?scoreFor(current.id,uid()):null, their=current?scoreFor(current.id,rid):null;
    let copy='No duel played yet. Put one desk on the line this week.';
    if(my&&their)copy=my.score===their.score?'The weekly duel ended level. Run another desk challenge if you want a rematch.':my.score>their.score?'You lead this week’s rivalry.':'Your rival leads this week — a new desk duel can even the score.';
    else if(my)copy=`Your score is locked at ${my.score}. Waiting for ${esc(p.alias||'your rival')}.`;
    else if(their)copy=`${esc(p.alias||'Your rival')} has posted ${their.score}. Your turn.`;
    const waiting=!!(current && my && !their);
    return `<section class="weekly-rival"><div class="weekly-rival-mark">R</div><div><span class="eyebrow">Weekly Rival</span><h3>${esc(p.alias||'Trader')}</h3><p>${copy}</p></div><button type="button" ${waiting?'disabled':`data-weekly-rival="${esc(rid)}"`}>${waiting?'Waiting':current&&!my?'Play duel':current?'Rematch':'Challenge'}</button></section>`;
  }

  function scoreFor(challengeId,userId) { return challengeScores.find(s=>s.challenge_id===challengeId && s.user_id===userId) || null; }
  function profileName(id) { return id===uid() ? (profile?.alias||'You') : (friendProfiles.get(id)?.alias||'Trader'); }
  function renderChallenges() {
    if(!challenges.length) return '<div class="social-empty compact"><b>No duels yet.</b><p>Challenge a friend from the Friends League above.</p></div>';
    return challenges.slice(0,12).map(c=>{
      const me=uid(), other=c.challenger_id===me?c.opponent_id:c.challenger_id;
      const my=scoreFor(c.id,me), theirs=scoreFor(c.id,other);
      const desk=content().worldCatalog?.find(w=>w.id===c.desk);
      let status='Waiting';
      if(my && theirs) status=my.score===theirs.score?'Draw':my.score>theirs.score?'Won':'Lost';
      else if(my) status='Waiting for rival';
      else if(theirs) status='Your turn';
      else status=c.challenger_id===me?'Challenge sent':'New challenge';
      const canPlay=!my;
      return `<article class="challenge-card ${my&&theirs?'finished':''}"><div class="challenge-icon">⚔</div><div class="challenge-copy"><span>${esc(desk?.title||c.desk||'Desk challenge')}</span><b>${esc(profileName(c.challenger_id))} vs ${esc(profileName(c.opponent_id))}</b><small>${my?`You ${my.correct}/${my.total}`:'You —'} · ${theirs?`${esc(profileName(other))} ${theirs.correct}/${theirs.total}`:`${esc(profileName(other))} —`}</small></div><em>${esc(status)}</em>${canPlay?`<button type="button" data-play-challenge="${esc(c.id)}">Play</button>`:'<button type="button" disabled>Played</button>'}</article>`;
    }).join('');
  }

  function bindPanel() {
    $('[data-social-linkedin]')?.setAttribute('href','https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(referralUrl()));
    $('[data-social-copy]')?.addEventListener('click',async()=>{
      let ok=false; try{await navigator.clipboard.writeText(referralUrl());ok=true;}catch(e){}
      const s=$('[data-social-status]'); if(s)s.textContent=ok?'Invite link copied. Send it in a LinkedIn DM or anywhere else.':'Clipboard unavailable — use Share on LinkedIn.';
    });
    $('[data-social-invite]')?.addEventListener('click',()=>$('#inviteTraders')?.scrollIntoView({behavior:motionOK()?'smooth':'auto',block:'center'}));
    $$('[data-challenge]').forEach(b=>b.addEventListener('click',()=>openChallengeCreator(b.dataset.challenge)));
    $('[data-weekly-rival]')?.addEventListener('click',e=>{
      const rid=e.currentTarget.dataset.weeklyRival;
      const current=challenges.find(c=>c.week===week() && ((c.challenger_id===uid()&&c.opponent_id===rid)||(c.opponent_id===uid()&&c.challenger_id===rid)) && !scoreFor(c.id,uid()));
      if(current) startChallenge(current.id); else openChallengeCreator(rid);
    });
    $$('[data-play-challenge]').forEach(b=>b.addEventListener('click',()=>startChallenge(b.dataset.playChallenge)));
  }

  function unlockedWorlds() {
    const done=Number(learn()?.state?.done?.length)||0;
    const worlds=content().worldCatalog||[];
    if(done<31) return [];
    const count=Math.max(1,Math.min(worlds.length,1+Math.floor((done-31)/6)));
    return worlds.slice(0,count);
  }

  function ensureDialog() {
    if($('#socialDialog')) return;
    document.body.insertAdjacentHTML('beforeend','<div id="socialDialog" class="social-dialog" hidden></div><main id="socialDuel" class="social-duel" hidden></main>');
    $('#socialDialog')?.addEventListener('click',e=>{if(e.target.id==='socialDialog')closeDialog();});
  }
  function closeDialog(){const d=$('#socialDialog');if(d)d.hidden=true;}

  function openChallengeCreator(opponentId) {
    ensureDialog();
    const worlds=unlockedWorlds(), p=friendProfiles.get(opponentId);
    const d=$('#socialDialog'); if(!d)return;
    if(!worlds.length) {
      d.innerHTML='<section class="social-modal"><button class="social-x" type="button">×</button><span class="eyebrow">Desk duel</span><h2>Finish the core desks first</h2><p>Head-to-head desk challenges unlock after level 31 so both the professional context and the exercises make sense.</p></section>';
      d.hidden=false; $('.social-x',d)?.addEventListener('click',closeDialog); return;
    }
    d.innerHTML=`<section class="social-modal"><button class="social-x" type="button">×</button><span class="eyebrow">Challenge ${esc(p?.alias||'Trader')}</span><h2>Choose the desk</h2><p>Both players receive the exact same 10 deterministic questions. No career XP is awarded.</p><label>Desk<select id="duelDesk">${worlds.map(w=>`<option value="${esc(w.id)}">${esc(w.title)}</option>`).join('')}</select></label><button id="sendChallenge" class="btn primary wide" type="button">Send challenge</button><small id="sendChallengeStatus"></small></section>`;
    d.hidden=false;
    $('.social-x',d)?.addEventListener('click',closeDialog);
    $('#sendChallenge')?.addEventListener('click',async()=>{
      const btn=$('#sendChallenge'), st=$('#sendChallengeStatus'); btn.disabled=true; if(st)st.textContent='Sending…';
      try{
        const seed=Math.floor(Date.now()%2000000000)+Math.floor(Math.random()*100000);
        await api().createFriendChallenge?.({opponent_id:opponentId,desk:$('#duelDesk')?.value,seed,week:week()});
        if(st)st.textContent='Challenge sent.'; setTimeout(()=>{closeDialog();renderPanel();},450);
      }catch(e){if(st)st.textContent=e.message||'Could not send the challenge.';btn.disabled=false;}
    });
  }

  function startChallenge(challengeId) {
    ensureDialog();
    const c=challenges.find(x=>x.id===challengeId); if(!c)return;
    const maker=content().makeDeskSet; if(typeof maker!=='function')return;
    const items=maker(Number(c.seed),10,c.desk); if(!items.length)return;
    duel={challenge:c,items,index:0,correct:0,answered:false};
    document.body.classList.add('duel-active');
    $('#socialDuel').hidden=false;
    renderDuelQuestion();
  }

  function renderDuelQuestion() {
    const host=$('#socialDuel'); if(!host||!duel)return;
    if(duel.index>=duel.items.length) return finishDuel();
    const item=duel.items[duel.index], ex=item.ex, world=content().worldCatalog?.find(w=>w.id===duel.challenge.desk);
    const input=ex.type==='choice'
      ? `<div class="duel-options">${ex.options.map((o,i)=>`<button type="button" data-duel-choice="${i}"><i>${String.fromCharCode(65+i)}</i><span>${esc(o)}</span></button>`).join('')}</div>`
      : `<div class="duel-numeric"><input id="duelNumber" type="number" inputmode="decimal" step="any" placeholder="Your answer"><span>${esc(ex.unit||'')}</span></div>`;
    host.innerHTML=`<header class="duel-top"><button id="duelQuit" type="button">×</button><div><span>${esc(world?.title||'Desk Duel')}</span><b>${duel.index+1}/10</b></div><div class="duel-score"><small>SCORE</small><strong>${duel.correct*100}</strong></div></header><div class="duel-progress"><i style="width:${duel.index*10}%"></i></div><section class="duel-body"><span class="eyebrow">Head-to-head · same seed</span><h2>${esc(ex.prompt)}</h2>${input}<div id="duelFeedback" class="duel-feedback" hidden></div><button id="duelCheck" class="btn primary wide" type="button" ${ex.type==='choice'?'disabled':''}>Check answer</button></section>`;
    let chosen=null;
    $$('[data-duel-choice]',host).forEach(b=>b.addEventListener('click',()=>{chosen=Number(b.dataset.duelChoice);$$('[data-duel-choice]',host).forEach(x=>x.classList.toggle('selected',x===b));$('#duelCheck').disabled=false;}));
    $('#duelNumber',host)?.addEventListener('input',e=>{$('#duelCheck').disabled=String(e.target.value).trim()==='';});
    $('#duelQuit',host)?.addEventListener('click',quitDuel);
    $('#duelCheck',host)?.addEventListener('click',()=>{
      if(duel.answered){duel.index++;duel.answered=false;renderDuelQuestion();return;}
      let ok=false;
      if(ex.type==='choice') ok=chosen===Number(ex.answer);
      else {
        const v=Number($('#duelNumber',host)?.value), tol=Math.abs(Number(ex.tolerance)||0);
        ok=Number.isFinite(v) && Math.abs(v-Number(ex.answer))<=tol;
      }
      if(ok)duel.correct++;
      duel.answered=true;
      const fb=$('#duelFeedback',host); if(fb){fb.hidden=false;fb.className='duel-feedback '+(ok?'ok':'bad');fb.innerHTML=`<b>${ok?'Correct':'Not quite'}</b><p>${esc(ex.why||'')}</p>`;}
      $$('[data-duel-choice]',host).forEach((b,i)=>{b.disabled=true;if(i===Number(ex.answer))b.classList.add('correct');else if(i===chosen&&!ok)b.classList.add('wrong');});
      $('#duelNumber',host)?.setAttribute('disabled','');
      const check=$('#duelCheck',host);check.textContent=duel.index===9?'See result':'Next question';check.disabled=false;
      const score=$('.duel-score strong',host);if(score)score.textContent=duel.correct*100;
    });
  }

  async function finishDuel() {
    const host=$('#socialDuel'); if(!host||!duel)return;
    const result={score:duel.correct*100,correct:duel.correct,total:duel.items.length};
    let saved=false; try{saved=await api().submitFriendChallengeScore?.(duel.challenge.id,result);}catch(e){}
    const other=duel.challenge.challenger_id===uid()?duel.challenge.opponent_id:duel.challenge.challenger_id;
    host.innerHTML=`<section class="duel-result"><div class="duel-result-mark">${duel.correct>=8?'★':duel.correct>=6?'✓':'↻'}</div><span class="eyebrow">Desk duel complete</span><h1>${result.score} points</h1><p>${duel.correct}/10 correct against ${esc(profileName(other))}. ${saved?'Your result is locked to your account.':'The score could not be synced yet.'}</p><div class="duel-result-stats"><div><b>${duel.correct}</b><small>correct</small></div><div><b>${10-duel.correct}</b><small>missed</small></div><div><b>0</b><small>career XP</small></div></div><button id="duelDone" class="btn primary wide" type="button">Back to Trading Circle</button></section>`;
    $('#duelDone',host)?.addEventListener('click',async()=>{quitDuel();await renderPanel();});
  }
  function quitDuel(){const h=$('#socialDuel');if(h)h.hidden=true;document.body.classList.remove('duel-active');duel=null;}

  function showSocialToast(title, copy) {
    document.querySelector('.social-toast')?.remove();
    const mood=window.MASCOT?.svg ? window.MASCOT.svg('happy',70) : '<b>H</b>';
    const el=document.createElement('div');el.className='social-toast';
    el.innerHTML=`<div>${mood}</div><span><small>HÉLÈNE · SOCIAL DESK</small><b>${esc(title)}</b><p>${esc(copy)}</p></span>`;
    document.body.appendChild(el);
    setTimeout(()=>el.classList.add('show'),20);setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),350);},5200);
  }

  function showWelcomeIfNeeded() {
    try {
      const raw=localStorage.getItem('wot_friend_welcome');
      if(raw){
        const w=JSON.parse(raw);
        localStorage.removeItem('wot_friend_welcome');
        if(w?.at && Date.now()-w.at<=864e5) showSocialToast('New trader in your circle', `${w.alias||'A trader'} is now connected to your Friends League.`);
      }
      if(friendIds().length>=5 && !localStorage.getItem('wot_social_salute_5')){
        localStorage.setItem('wot_social_salute_5','1');
        setTimeout(()=>showSocialToast('Five-trader desk circle', 'Your network is becoming a real desk. Hélène has unlocked the Social Salute milestone.'),700);
      }
    }catch(e){}
  }

  function syncInvitePanel() {
    const li=$('#inviteLinkedIn'); if(li && profile?.referral_code) li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(referralUrl());
  }

  async function refreshIfLeague() {
    if(!$('#leagueScreen')?.classList.contains('active') || document.body.classList.contains('auth-locked'))return;
    await renderPanel(); syncInvitePanel();
  }

  function init() {
    ensureDialog();
    window.addEventListener('wot:screen',e=>{if(e.detail?.id==='leagueScreen')setTimeout(refreshIfLeague,80);});
    window.addEventListener('wot:auth',e=>{if(e.detail?.signedIn)setTimeout(refreshIfLeague,250);else{profile=null;friends=[];friendProfiles.clear();challenges=[];challengeScores=[];renderNavBadge();}});
    window.addEventListener('wot:saved',()=>{if($('#leagueScreen')?.classList.contains('active'))setTimeout(refreshIfLeague,180);});
    let tries=0;const t=setInterval(()=>{tries++;if(!document.body.classList.contains('auth-locked')){clearInterval(t);refreshIfLeague();}else if(tries>40)clearInterval(t);},150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  window.WOT_SOCIAL={get profile(){return profile;},get friends(){return friends;},referralUrl,renderPanel,refresh:refreshIfLeague,pendingIncomingCount};
})();
