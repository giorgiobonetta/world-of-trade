/* World of Trade — Account & Social v0.6
   Product layer for account settings, trader discovery, friend requests and
   a cleaner League / Friends / Challenges navigation. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const api=()=>window.WOT_CLOUD_API||{};
  const social=()=>window.WOT_SOCIAL||{};
  const learn=()=>window.__LEARN__||{};
  const comp=()=>window.WOT_COMP||{};
  const SETTINGS_KEY='wot-settings-v1';
  let accountUser=null, requests=[], activeLeagueTab='league', renderToken=0, refreshTimer=0, mutationFrame=0;

  function settings(){try{return {...{haptics:true},...(JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{})};}catch(e){return {haptics:true};}}
  function saveSettings(next){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify({...settings(),...next}));}catch(e){}}
  function me(){return api().idUtente?.()||null;}
  function houseName(id){return (comp().houses||[]).find(h=>h.id===id)?.name||'Independent';}
  function profileName(p){return String(p?.alias||'Trader').trim()||'Trader';}
  function profileTag(p){return p?.trader_tag?`@${p.trader_tag}`:'Trader ID pending';}
  function ownProfile(){return social().profile||null;}

  async function loadAccount(){
    if(!api().enabled||!me())return null;
    try{accountUser=await api().chiUtente?.()||accountUser;}catch(e){}
    return accountUser;
  }
  async function loadRequests(){
    if(!api().enabled||!me()||!api().friendRequestRows){requests=[];return requests;}
    try{requests=await api().friendRequestRows()||[];}catch(e){requests=[];}
    updateLeagueBadge(); return requests;
  }
  function incomingRequests(){const id=me();return requests.filter(r=>r.addressee_id===id&&r.status==='pending');}
  function outgoingRequests(){const id=me();return requests.filter(r=>r.requester_id===id&&r.status==='pending');}
  function requestFor(userId){return requests.find(r=>r.status==='pending'&&((r.requester_id===me()&&r.addressee_id===userId)||(r.addressee_id===me()&&r.requester_id===userId)))||null;}
  function friendSet(){return new Set((social().friendIds?.()||[]));}
  function updateLeagueBadge(){
    const n=incomingRequests().length+(social().pendingIncomingCount?.()||0);
    document.querySelectorAll('.tab-badge[data-tab-badge="leagueScreen"]').forEach(b=>{b.hidden=!n;b.textContent=n>99?'99+':String(n||'');b.setAttribute('aria-label',`${n} social notification${n===1?'':'s'}`);});
  }

  function installProfileAccountCard(){
    const body=$('#profileBody'); if(!body)return;
    let card=$('#accountCard060');
    if(!card){
      card=document.createElement('section');card.id='accountCard060';card.className='account-card060';
      const editor=body.querySelector('.profile-editor');
      if(editor)editor.insertAdjacentElement('afterend',card); else body.prepend(card);
    }
    const p=ownProfile();
    const email=accountUser?.email||api().session?.user?.email||'Account';
    card.innerHTML=`<button type="button" id="openAccount060" class="account-card-button060"><span class="account-icon060">⚙</span><span><small>ACCOUNT & SETTINGS</small><b>${esc(profileTag(p))}</b><em>${esc(email)}</em></span><i>›</i></button>`;
    $('#openAccount060')?.addEventListener('click',openAccount);
  }

  function ensureAccountDialog(){
    if($('#accountDialog060'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="accountDialog060" class="account-dialog060" role="dialog" aria-modal="true" aria-labelledby="accountTitle060" hidden><section class="account-sheet060"><header><button id="accountClose060" type="button" aria-label="Close">×</button><div><small>WORLD OF TRADE</small><h2 id="accountTitle060">Account & Settings</h2></div></header><div id="accountBody060"></div></section></div>`);
    $('#accountClose060')?.addEventListener('click',closeAccount);
    $('#accountDialog060')?.addEventListener('click',e=>{if(e.target.id==='accountDialog060')closeAccount();});
  }
  function closeAccount(){const d=$('#accountDialog060');if(d)d.hidden=true;document.body.classList.remove('account-open060');}
  async function openAccount(){
    ensureAccountDialog();const d=$('#accountDialog060');if(!d)return;d.hidden=false;document.body.classList.add('account-open060');
    $('#accountBody060').innerHTML='<div class="account-loading060">Loading account…</div>';
    await Promise.all([loadAccount(),social().loadSocial?.(),loadRequests()]);
    renderAccount();
  }
  function renderAccount(){
    const host=$('#accountBody060');if(!host)return;
    const p=ownProfile()||{};const user=accountUser||{};const cfg=settings();
    const email=user.email||api().session?.user?.email||'—';
    const verified=!!(user.email_confirmed_at||user.confirmed_at||user.user_metadata?.email_verified);
    host.innerHTML=`
      <section class="account-section060 account-identity060"><div class="account-section-title060"><span>IDENTITY</span><small>Public inside World of Trade</small></div><div class="account-identity-main060"><div class="account-mini-avatar060">${esc((profileName(p)[0]||'T').toUpperCase())}</div><div><b>${esc(profileName(p))}</b><small>${esc(profileTag(p))}</small></div></div><label>Trader ID<div class="trader-id-input060"><span>@</span><input id="traderTag060" maxlength="20" value="${esc(p.trader_tag||'')}" autocomplete="off" autocapitalize="none"><button id="saveTraderTag060" type="button">Save</button></div><small>3–20 characters: letters, numbers and underscores. Other traders can find you with this ID.</small></label><p id="traderTagStatus060" class="account-status060" hidden></p></section>
      <section class="account-section060"><div class="account-section-title060"><span>ACCOUNT</span><small>Private</small></div><div class="account-row060"><span><b>Email</b><small>${esc(email)}</small></span><em class="${verified?'verified':''}">${verified?'✓ Verified':'Not verified'}</em></div><div class="account-row060 action"><span><b>Password</b><small>Change the password used to sign in.</small></span><button id="changePassword060" type="button">Change</button></div><div id="passwordBox060" class="password-box060" hidden><input id="newPassword060" type="password" minlength="8" autocomplete="new-password" placeholder="New password · 8+ characters"><button id="savePassword060" type="button">Update password</button><small id="passwordStatus060"></small></div></section>
      <section class="account-section060"><div class="account-section-title060"><span>APP</span><small>On this device</small></div><label class="setting-toggle060"><span><b>Haptic feedback</b><small>Vibration on answers, rewards and key actions.</small></span><input id="haptics060" type="checkbox" ${cfg.haptics!==false?'checked':''}><i></i></label></section>
      <section class="account-section060"><div class="account-section-title060"><span>PRIVACY & DATA</span><small>Your account</small></div><a class="account-link060" href="privacy.html">Privacy Policy <i>›</i></a><button id="signOut060" class="account-danger-light060" type="button">Sign out</button><button id="deleteAccount060" class="account-danger060" type="button">Delete account</button><div id="deleteBox060" class="delete-box060" hidden><b>Delete World of Trade account?</b><p>This permanently deletes your account, career progress, social profile, friendships and challenge history. This cannot be undone.</p><label>Type <strong>DELETE</strong> to confirm<input id="deleteConfirm060" autocomplete="off"></label><button id="deleteForever060" type="button" disabled>Delete forever</button><small id="deleteStatus060"></small></div></section>`;
    bindAccount();
  }
  function status(id,text,bad=false){const el=$(id);if(!el)return;el.hidden=!text;el.textContent=text||'';el.classList.toggle('bad',!!bad);}
  function bindAccount(){
    $('#saveTraderTag060')?.addEventListener('click',async()=>{
      const input=$('#traderTag060');let tag=String(input?.value||'').trim().replace(/^@/,'').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20);if(input)input.value=tag;
      if(tag.length<3){status('#traderTagStatus060','Use at least 3 characters.',true);return;}
      const btn=$('#saveTraderTag060');btn.disabled=true;status('#traderTagStatus060','Checking availability…');
      try{const old=ownProfile()||await api().socialProfileByUser?.(me());const next=await api().upsertSocialProfile?.({alias:old?.alias||learn().state?.profile?.name||'Trader',house:old?.house||learn().state?.competitive?.house||null,referral_code:old?.referral_code,trader_tag:tag});if(window.WOT_SOCIAL&&next)Object.defineProperty(window.WOT_SOCIAL,'_lastTag',{value:next.trader_tag||tag,configurable:true});await social().loadSocial?.();status('#traderTagStatus060',`@${tag} is now your Trader ID.`);installProfileAccountCard();setTimeout(renderAccount,120);}catch(e){status('#traderTagStatus060',e?.status===409?'That Trader ID is already taken.':(e?.message||'Could not save Trader ID.'),true);}finally{btn.disabled=false;}
    });
    $('#changePassword060')?.addEventListener('click',()=>{const box=$('#passwordBox060');if(box){box.hidden=!box.hidden;if(!box.hidden)$('#newPassword060')?.focus();}});
    $('#savePassword060')?.addEventListener('click',async()=>{const btn=$('#savePassword060'),pw=$('#newPassword060')?.value||'';if(pw.length<8){$('#passwordStatus060').textContent='Use at least 8 characters.';return;}btn.disabled=true;$('#passwordStatus060').textContent='Updating…';try{await api().updatePassword?.(pw);$('#newPassword060').value='';$('#passwordStatus060').textContent='Password updated.';}catch(e){$('#passwordStatus060').textContent=e?.message||'Could not update password.';}finally{btn.disabled=false;}});
    $('#haptics060')?.addEventListener('change',e=>saveSettings({haptics:!!e.target.checked}));
    $('#signOut060')?.addEventListener('click',async()=>{closeAccount();await api().esci?.();});
    $('#deleteAccount060')?.addEventListener('click',()=>{const box=$('#deleteBox060');if(box){box.hidden=!box.hidden;if(!box.hidden)$('#deleteConfirm060')?.focus();}});
    $('#deleteConfirm060')?.addEventListener('input',e=>{const b=$('#deleteForever060');if(b)b.disabled=String(e.target.value||'').trim()!=='DELETE';});
    $('#deleteForever060')?.addEventListener('click',async()=>{const btn=$('#deleteForever060');btn.disabled=true;$('#deleteStatus060').textContent='Deleting account…';try{await api().deleteMyAccount?.();try{localStorage.removeItem('wot-learn-v1');localStorage.removeItem('wot-profile-v1');}catch(e){}location.href='index.html';}catch(e){$('#deleteStatus060').textContent=(e?.status===404?'Run the v0.6 Account & Social SQL in Supabase first.':(e?.message||'Could not delete the account.'));btn.disabled=false;}});
  }

  function installLeagueTabs(){
    const wrap=$('#leagueScreen .tab-wrap');if(!wrap||$('#leagueSubnav060'))return;
    const sub=document.createElement('nav');sub.id='leagueSubnav060';sub.className='league-subnav060';sub.setAttribute('aria-label','League sections');sub.innerHTML=`<button type="button" data-league-tab="league" class="active">League</button><button type="button" data-league-tab="friends">Friends<span id="friendsBadge060" hidden></span></button><button type="button" data-league-tab="challenges">Challenges<span id="challengesBadge060" hidden></span></button>`;
    wrap.prepend(sub);
    const native=document.createElement('div');native.id='leaguePageLeague060';native.className='league-page060 active';
    [...wrap.children].filter(x=>x!==sub&&x.id!=='socialCircle'&&x.id!=='inviteTraders').forEach(x=>native.appendChild(x));
    wrap.appendChild(native);
    const friends=document.createElement('div');friends.id='leaguePageFriends060';friends.className='league-page060';wrap.appendChild(friends);
    const challenges=document.createElement('div');challenges.id='leaguePageChallenges060';challenges.className='league-page060';wrap.appendChild(challenges);
    $$('[data-league-tab]',sub).forEach(b=>b.addEventListener('click',()=>selectLeagueTab(b.dataset.leagueTab)));
    selectLeagueTab(activeLeagueTab);
  }
  function selectLeagueTab(tab){
    const next=['league','friends','challenges'].includes(tab)?tab:'league';
    const changed=next!==activeLeagueTab;
    activeLeagueTab=next;
    $$('[data-league-tab]').forEach(b=>b.classList.toggle('active',b.dataset.leagueTab===activeLeagueTab));
    $$('.league-page060').forEach(p=>p.classList.toggle('active',p.id===`leaguePage${activeLeagueTab[0].toUpperCase()+activeLeagueTab.slice(1)}060`));
    // A short Friends/Challenges page must never inherit a deep scroll offset
    // from League; that looked like a blank/broken screen on mobile.
    if(changed) window.scrollTo(0,0);
    if(activeLeagueTab==='friends')renderFriends();
    if(activeLeagueTab==='challenges')renderChallenges();
  }
  function requestProfileIds(){return [...new Set(requests.flatMap(r=>[r.requester_id,r.addressee_id]).filter(id=>id&&id!==me()))];}
  async function profileMapFor(ids){const map=new Map();const cached=social().friendProfiles;if(cached?.forEach)cached.forEach((v,k)=>map.set(k,v));const missing=ids.filter(id=>!map.has(id));if(missing.length){try{for(const p of await api().socialProfiles?.(missing)||[])map.set(p.user_id,p);}catch(e){}}return map;}
  function relationButton(p,map){
    const id=p.user_id;if(friendSet().has(id))return `<button class="friend-action060 challenge" data-challenge-user="${id}">Challenge</button>`;
    const req=requestFor(id);if(req){if(req.addressee_id===me())return `<div class="friend-request-actions060"><button data-request-accept="${req.id}">Accept</button><button class="ghost" data-request-decline="${req.id}">Decline</button></div>`;return `<button class="friend-action060" disabled>Request sent</button>`;}
    return `<button class="friend-action060" data-add-friend="${id}">Add friend</button>`;
  }
  async function renderFriends(){
    const host=$('#leaguePageFriends060');if(!host)return;const token=++renderToken;
    host.innerHTML='<div class="social-page-loading060">Loading your Trading Circle…</div>';
    await Promise.all([social().loadSocial?.(),loadRequests()]);if(token!==renderToken)return;
    const p=ownProfile()||{};const ids=[...(social().friendIds?.()||[]),...requestProfileIds()];const profiles=await profileMapFor([...new Set(ids)]);const standings=await social().friendStandings?.()||[];const scoreMap=new Map(standings.map(r=>[r.user_id,r.score||0]));const incoming=incomingRequests();const friends=social().friendIds?.()||[];
    host.innerHTML=`<section class="social-hero060"><div><span>TRADING CIRCLE</span><h2>${friends.length} connected trader${friends.length===1?'':'s'}</h2><p>Find people by Trader ID, build a private league and challenge them on the same desk.</p></div><div class="social-own-id060"><small>YOUR TRADER ID</small><b>${esc(profileTag(p))}</b><button id="copyTraderId060" type="button">Copy</button></div></section>
      <section class="social-panel060"><div class="social-panel-title060"><div><span>FIND TRADERS</span><h3>Search World of Trade</h3></div></div><form id="traderSearchForm060" class="trader-search060"><span>@</span><input id="traderSearch060" placeholder="Trader ID or name" autocomplete="off"><button>Search</button></form><div id="traderSearchResults060"></div></section>
      ${incoming.length?`<section class="social-panel060"><div class="social-panel-title060"><div><span>REQUESTS</span><h3>Friend requests</h3></div><b>${incoming.length}</b></div><div class="social-list060">${incoming.map(r=>{const x=profiles.get(r.requester_id)||{};return traderRow(x,scoreMap,profiles);}).join('')}</div></section>`:''}
      <section class="social-panel060"><div class="social-panel-title060"><div><span>FRIENDS LEAGUE</span><h3>Your traders</h3></div><small>Weekly XP</small></div>${friends.length?`<div class="social-list060">${friends.map(id=>traderRow(profiles.get(id)||{user_id:id,alias:'Trader'},scoreMap,profiles)).join('')}</div>`:`<div class="social-empty060"><b>Your Trading Circle is empty.</b><p>Search for a Trader ID or invite someone to World of Trade.</p></div>`}</section>
      <section class="social-panel060 invite060"><div><span>INVITE</span><h3>Bring a trader to the floor</h3><p>The referral link connects you automatically after they create an account.</p></div><button id="copyInvite060" type="button">Copy invite link</button></section>`;
    bindFriends(profiles,scoreMap);updateSocialTabBadges();
  }
  function traderRow(p,scoreMap){const id=p.user_id||'';const house=houseName(p.house);return `<article class="trader-row060"><div class="trader-avatar060">${esc((profileName(p)[0]||'T').toUpperCase())}</div><div class="trader-copy060"><b>${esc(profileName(p))}</b><small>${esc(profileTag(p))} · ${esc(house)}</small></div><strong>${Number(scoreMap.get(id)||0)} XP</strong><button class="view-trader060" type="button" data-view-trader="${id}" aria-label="View ${esc(profileName(p))}">›</button><div class="trader-actions060">${relationButton(p)}</div></article>`;}
  function bindFriends(profiles,scoreMap){
    $('#copyTraderId060')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(profileTag(ownProfile()));$('#copyTraderId060').textContent='Copied';}catch(e){}});
    $('#copyInvite060')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(social().referralUrl?.()||location.href);$('#copyInvite060').textContent='Copied';}catch(e){}});
    $('#traderSearchForm060')?.addEventListener('submit',async e=>{e.preventDefault();const q=$('#traderSearch060')?.value||'',out=$('#traderSearchResults060');if(String(q).trim().length<2){out.innerHTML='<p class="search-hint060">Type at least 2 characters.</p>';return;}out.innerHTML='<p class="search-hint060">Searching…</p>';try{const rows=await api().searchSocialProfiles?.(q)||[];const ids=rows.map(r=>r.user_id);const extra=await profileMapFor(ids);rows.forEach(r=>extra.set(r.user_id,r));out.innerHTML=rows.length?`<div class="social-list060 search-results060">${rows.map(r=>traderRow(r,scoreMap)).join('')}</div>`:'<p class="search-hint060">No traders found.</p>';bindDynamicSocial(extra,scoreMap);}catch(err){out.innerHTML='<p class="search-hint060 bad">Search needs the v0.6 social SQL in Supabase.</p>';}});
    bindDynamicSocial(profiles,scoreMap);
  }
  function bindDynamicSocial(profiles,scoreMap){
    $$('[data-add-friend]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',async()=>{b.disabled=true;b.textContent='Sending…';try{await api().sendFriendRequest?.(b.dataset.addFriend);await loadRequests();b.textContent='Request sent';updateSocialTabBadges();}catch(e){b.textContent=e?.message||'Try again';b.disabled=false;}});});
    $$('[data-request-accept]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',async()=>{b.disabled=true;await api().respondFriendRequest?.(b.dataset.requestAccept,true);await social().loadSocial?.();await loadRequests();renderFriends();});});
    $$('[data-request-decline]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',async()=>{b.disabled=true;await api().respondFriendRequest?.(b.dataset.requestDecline,false);await loadRequests();renderFriends();});});
    $$('[data-challenge-user]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>social().openChallengeCreator?.(b.dataset.challengeUser));});
    $$('[data-view-trader]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>openTraderProfile(profiles.get(b.dataset.viewTrader)||{user_id:b.dataset.viewTrader,alias:'Trader'},scoreMap.get(b.dataset.viewTrader)||0));});
  }
  function ensureTraderDialog(){if($('#traderDialog060'))return;document.body.insertAdjacentHTML('beforeend','<div id="traderDialog060" class="account-dialog060" role="dialog" aria-modal="true" hidden><section class="trader-sheet060"><button id="traderClose060" type="button">×</button><div id="traderBody060"></div></section></div>');$('#traderClose060')?.addEventListener('click',()=>$('#traderDialog060').hidden=true);$('#traderDialog060')?.addEventListener('click',e=>{if(e.target.id==='traderDialog060')e.currentTarget.hidden=true;});}
  function openTraderProfile(p,weeklyXp){ensureTraderDialog();const d=$('#traderDialog060');const h=$('#traderBody060');d.hidden=false;h.innerHTML=`<div class="trader-profile-head060"><div class="trader-avatar060 big">${esc((profileName(p)[0]||'T').toUpperCase())}</div><span>TRADER PROFILE</span><h2>${esc(profileName(p))}</h2><p>${esc(profileTag(p))}</p></div><div class="trader-profile-stats060"><div><b>${Number(weeklyXp)||0}</b><small>Weekly XP</small></div><div><b>${esc(houseName(p.house))}</b><small>Trading House</small></div></div><div class="trader-profile-actions060">${relationButton(p)}</div>`;bindDynamicSocial(new Map([[p.user_id,p]]),new Map([[p.user_id,weeklyXp]]));}

  async function renderChallenges(){
    const host=$('#leaguePageChallenges060');if(!host)return;const token=++renderToken;host.innerHTML='<div class="social-page-loading060">Loading challenges…</div>';await Promise.all([social().loadSocial?.(),loadRequests()]);if(token!==renderToken)return;
    const challenges=social().challenges||[],scores=social().challengeScores||[],id=me();let wins=0,losses=0,draws=0;for(const c of challenges){const other=c.challenger_id===id?c.opponent_id:c.challenger_id;const mine=scores.find(s=>s.challenge_id===c.id&&s.user_id===id),theirs=scores.find(s=>s.challenge_id===c.id&&s.user_id===other);if(mine&&theirs){if(mine.score>theirs.score)wins++;else if(mine.score<theirs.score)losses++;else draws++;}}
    const profiles=await profileMapFor(challenges.flatMap(c=>[c.challenger_id,c.opponent_id]));
    host.innerHTML=`<section class="challenge-hero060"><div><span>HEAD-TO-HEAD</span><h2>Desk Challenges</h2><p>Same desk. Same seed. Same ten decisions. No career XP.</p></div><div class="duel-record060"><div><b>${wins}</b><small>W</small></div><div><b>${losses}</b><small>L</small></div><div><b>${draws}</b><small>D</small></div></div></section><section class="social-panel060"><div class="social-panel-title060"><div><span>CHALLENGES</span><h3>Your duels</h3></div><small>${challenges.length} total</small></div>${challenges.length?`<div class="challenge-list060">${challenges.map(c=>challengeRow(c,profiles,scores)).join('')}</div>`:`<div class="social-empty060"><b>No desk challenges yet.</b><p>Open Friends and challenge someone from your Trading Circle.</p><button type="button" id="goFriends060">Find a rival</button></div>`}</section>`;
    $('#goFriends060')?.addEventListener('click',()=>selectLeagueTab('friends'));$$('[data-play-challenge060]').forEach(b=>b.addEventListener('click',()=>social().startChallenge?.(b.dataset.playChallenge060)));updateSocialTabBadges();
  }
  function challengeRow(c,profiles,scores){const id=me(),other=c.challenger_id===id?c.opponent_id:c.challenger_id,p=profiles.get(other)||{alias:'Trader'},mine=scores.find(s=>s.challenge_id===c.id&&s.user_id===id),theirs=scores.find(s=>s.challenge_id===c.id&&s.user_id===other);let state='Waiting',klass='',action='';if(mine&&theirs){if(mine.score>theirs.score){state='WON';klass='won';}else if(mine.score<theirs.score){state='LOST';klass='lost';}else{state='DRAW';klass='draw';}}else if(!mine&&c.opponent_id===id){state='YOUR TURN';action=`<button data-play-challenge060="${c.id}">Play duel</button>`;}else if(mine&&!theirs)state='Waiting for rival';else if(!mine&&c.challenger_id===id)state='Challenge sent';const score=`${mine?mine.score:'—'} : ${theirs?theirs.score:'—'}`;return `<article class="challenge-row060 ${klass}"><div class="challenge-cross060">⚔</div><div><small>${esc(c.desk||'Desk duel')}</small><b>${esc(profileName(p))}</b><span>${score}</span></div><em>${state}</em>${action}</article>`;}
  function updateSocialTabBadges(){const req=incomingRequests().length,duels=social().pendingIncomingCount?.()||0;const fb=$('#friendsBadge060'),cb=$('#challengesBadge060');if(fb){fb.hidden=!req;fb.textContent=String(req);}if(cb){cb.hidden=!duels;cb.textContent=String(duels);}updateLeagueBadge();}

  async function refresh(){
    if(document.body.classList.contains('auth-locked'))return;
    await Promise.all([loadAccount(),social().loadSocial?.(),loadRequests()]);
    installProfileAccountCard();installLeagueTabs();updateSocialTabBadges();
    if(activeLeagueTab==='friends')renderFriends();else if(activeLeagueTab==='challenges')renderChallenges();
  }
  function scheduleRefresh(delay=80){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>{refreshTimer=0;refresh();},delay);
  }
  function maintainShell(){
    if($('#profileBody')&&!$('#accountCard060'))installProfileAccountCard();
    if($('#leagueScreen .tab-wrap')&&!$('#leagueSubnav060'))installLeagueTabs();
    const old=$('#socialCircle');if(old)old.classList.add('legacy-social-hidden060');
    const invite=$('#inviteTraders');if(invite)invite.classList.add('legacy-social-hidden060');
  }
  function init(){
    ensureAccountDialog();
    maintainShell();
    scheduleRefresh(220);
    window.addEventListener('wot:screen',e=>{
      const id=e.detail?.id;
      // Install synchronous shell pieces before the next paint. Async account
      // data can update them later without making the tab visibly reflow.
      if(id==='profileScreen'){installProfileAccountCard();loadAccount().then(installProfileAccountCard);}
      if(id==='leagueScreen'){installLeagueTabs();scheduleRefresh(70);}
    });
    window.addEventListener('wot:auth',()=>scheduleRefresh(160));
    window.addEventListener('wot:saved',()=>{if($('#profileScreen')?.classList.contains('active'))installProfileAccountCard();});
    const mo=new MutationObserver(()=>{
      if(mutationFrame)return;
      mutationFrame=requestAnimationFrame(()=>{mutationFrame=0;maintainShell();});
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.WOT_ACCOUNT_SOCIAL={refresh,selectLeagueTab,openAccount,renderFriends,renderChallenges};
})();
