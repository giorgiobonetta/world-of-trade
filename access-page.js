/* World of Trade — unified account access, recovery and verified redirect. */
(() => {
  'use strict';
  const CFG = window.WOT_CLOUD || {};
  const KEY = CFG.publishableKey || CFG.anonKey || '';
  const SESSION_KEY = 'wot-cloud-session';
  const $ = s => document.querySelector(s);
  const configReady = !!(CFG.url && KEY) && !/^sb_secret_/.test(KEY);

  function safeNext(raw) {
    const fallback = 'learn.html';
    if (!raw) return fallback;
    try {
      const u = new URL(raw, location.href);
      if (u.origin !== location.origin) return fallback;
      const p = u.pathname.replace(/^\//,'') + u.search + u.hash;
      return p || fallback;
    } catch (e) { return fallback; }
  }
  const params = new URLSearchParams(location.search);
  const next = safeNext(params.get('next'));
  const mode = params.get('mode') === 'login' ? 'login' : 'register';

  function savedSession(){ try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch(e){return null} }
  function saveSession(s){ try{s?localStorage.setItem(SESSION_KEY,JSON.stringify(s)):localStorage.removeItem(SESSION_KEY)}catch(e){} }
  function setStatus(sel,text,type=''){const el=$(sel);if(!el)return;el.textContent=text||'';el.className='auth-status'+(type?` ${type}`:'');el.hidden=!text;}
  function message(status,d){
    const raw=(d&&(d.msg||d.message||d.error_description||d.error||d.hint))||''; const t=String(raw).toLowerCase();
    if(t.includes('invalid login credentials')) return 'Wrong email or password.';
    if(t.includes('already registered')||t.includes('already been registered')) return 'That email already has an account. Try logging in.';
    if(t.includes('email not confirmed')) return 'Check your inbox and confirm your email first.';
    if(t.includes('password should be')||t.includes('at least')) return 'Use a password of at least 8 characters.';
    if(t.includes('unable to validate email')||t.includes('invalid format')) return 'Enter a valid email address.';
    if(t.includes('rate limit')||status===429) return 'Too many attempts. Try again in a moment.';
    if(t.includes('jwt')||t.includes('token')) return 'Your session expired. Log in again.';
    return raw?String(raw):'Something went wrong. Please try again.';
  }
  async function call(path,{method='POST',body,token}={}){
    if(!configReady) throw new Error('Account access is temporarily unavailable.');
    const headers={apikey:KEY,'Content-Type':'application/json'}; if(token) headers.Authorization=`Bearer ${token}`;
    const res=await fetch(CFG.url.replace(/\/$/,'')+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
    const text=await res.text(); let data=null; try{data=text?JSON.parse(text):null}catch(e){data={raw:text}};
    if(!res.ok){const e=new Error(message(res.status,data));e.status=res.status;e.data=data;throw e;} return data;
  }
  async function refresh(s){
    if(!s?.refresh_token) throw new Error('Your session expired. Log in again.');
    const fresh=await call('/auth/v1/token?grant_type=refresh_token',{body:{refresh_token:s.refresh_token}}); saveSession(fresh); return fresh;
  }
  async function verify(s){
    if(!s?.access_token) return null;
    try { const user=await call('/auth/v1/user',{method:'GET',token:s.access_token}); const out={...s,user}; saveSession(out); return out; }
    catch(e){ if(e.status!==401||!s.refresh_token) return null; try{const fresh=await refresh(s);const user=await call('/auth/v1/user',{method:'GET',token:fresh.access_token});const out={...fresh,user};saveSession(out);return out;}catch(_){return null;} }
  }
  function goGame(){ location.replace(next); }

  function selectTab(which){
    const reg=which!=='login';
    $('#tabRegister')?.classList.toggle('active',reg); $('#tabLogin')?.classList.toggle('active',!reg);
    $('#tabRegister')?.setAttribute('aria-selected',String(reg)); $('#tabLogin')?.setAttribute('aria-selected',String(!reg));
    $('#tabRegister')?.setAttribute('tabindex',reg?'0':'-1'); $('#tabLogin')?.setAttribute('tabindex',reg?'-1':'0');
    if($('#registerPanel')) $('#registerPanel').hidden=!reg; if($('#loginPanel')) $('#loginPanel').hidden=reg;
    if($('#resetPanel')) $('#resetPanel').hidden=true;
  }
  function showReset(){
    if($('#registerPanel')) $('#registerPanel').hidden=true; if($('#loginPanel')) $('#loginPanel').hidden=true; if($('#resetPanel')) $('#resetPanel').hidden=false;
    document.querySelector('.auth-tabs')?.setAttribute('hidden','');
    $('#resetPassword')?.focus();
  }
  function validForm(form){ if(!form) return false; if(!form.checkValidity()){form.reportValidity();return false;} return true; }

  async function parseHash(){
    const raw=(location.hash||'').replace(/^#/,''); if(!raw) return null;
    const p=new URLSearchParams(raw); const err=p.get('error_description')||p.get('error');
    const at=p.get('access_token'),rt=p.get('refresh_token'),type=p.get('type');
    try{history.replaceState(null,'',location.pathname+location.search)}catch(e){location.hash=''}
    if(err) return {error:decodeURIComponent(String(err).replace(/\+/g,' '))};
    if(!at) return null;
    const s={access_token:at,refresh_token:rt||null,token_type:p.get('token_type')||'bearer'}; saveSession(s);
    return {session:s,recovery:type==='recovery'};
  }

  document.querySelectorAll('[data-password-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=document.getElementById(btn.dataset.passwordToggle); if(!input)return; const show=input.type==='password'; input.type=show?'text':'password'; btn.textContent=show?'Hide':'Show'; btn.setAttribute('aria-label',show?'Hide password':'Show password');
  }));
  $('#tabRegister')?.addEventListener('click',()=>selectTab('register')); $('#tabLogin')?.addEventListener('click',()=>selectTab('login'));
  document.querySelector('.auth-tabs')?.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const target=(e.key==='ArrowLeft'||e.key==='Home')?'register':'login';selectTab(target);document.querySelector(target==='register'?'#tabRegister':'#tabLogin')?.focus();});

  $('#loginForm')?.addEventListener('submit',async e=>{
    e.preventDefault(); const form=e.currentTarget;if(!validForm(form))return;
    const email=$('#loginEmail').value.trim(),password=$('#loginPassword').value; if(password.length<8)return setStatus('#loginStatus','Use a password of at least 8 characters.','error');
    const btn=$('#loginSubmit');btn.disabled=true;setStatus('#loginStatus','Logging in…');
    try{const s=await call('/auth/v1/token?grant_type=password',{body:{email,password}});const ok=await verify(s);if(!ok)throw new Error('Could not verify your session.');goGame();}catch(err){setStatus('#loginStatus',err.message,'error');btn.disabled=false;}
  });
  $('#registerForm')?.addEventListener('submit',async e=>{
    e.preventDefault(); const form=e.currentTarget;if(!validForm(form))return;
    const email=$('#registerEmail').value.trim(),password=$('#registerPassword').value,confirm=$('#registerConfirm').value;
    if(password.length<8)return setStatus('#registerStatus','Use a password of at least 8 characters.','error');
    if(password!==confirm)return setStatus('#registerStatus','The passwords do not match.','error');
    if(!$('#registerTerms').checked)return setStatus('#registerStatus','Accept the Privacy & Terms to create the account.','error');
    const btn=$('#registerSubmit');btn.disabled=true;setStatus('#registerStatus','Creating your account…');
    try{const redirect=new URL('access.html?mode=login&next='+encodeURIComponent(next),location.href).href;const r=await call('/auth/v1/signup?redirect_to='+encodeURIComponent(redirect),{body:{email,password}});if(r?.access_token){const ok=await verify(r);if(ok)return goGame();}setStatus('#registerStatus','Account created. Confirm the email in your inbox, then log in.','ok');selectTab('login');$('#loginEmail').value=email;}catch(err){setStatus('#registerStatus',err.message,'error');}finally{btn.disabled=false;}
  });
  $('#forgotPassword')?.addEventListener('click',async()=>{
    const email=$('#loginEmail').value.trim(); if(!email||!$('#loginEmail').checkValidity()){setStatus('#loginStatus','Enter your email address first.','error');$('#loginEmail').focus();return;}
    try{const redirect=new URL('access.html?mode=reset&next='+encodeURIComponent(next),location.href).href;await call('/auth/v1/recover?redirect_to='+encodeURIComponent(redirect),{body:{email}});setStatus('#loginStatus','Password reset email sent. Open the link in that email to choose a new password.','ok');}catch(err){setStatus('#loginStatus',err.message,'error');}
  });
  $('#resendConfirmation')?.addEventListener('click',async()=>{
    const email=$('#loginEmail').value.trim(); if(!email||!$('#loginEmail').checkValidity()){setStatus('#loginStatus','Enter your email address first.','error');$('#loginEmail').focus();return;}
    try{const redirect=new URL('access.html?mode=login&next='+encodeURIComponent(next),location.href).href;await call('/auth/v1/resend?redirect_to='+encodeURIComponent(redirect),{body:{type:'signup',email}});setStatus('#loginStatus','Confirmation email sent again.','ok');}catch(err){setStatus('#loginStatus',err.message,'error');}
  });
  $('#resetForm')?.addEventListener('submit',async e=>{
    e.preventDefault();const form=e.currentTarget;if(!validForm(form))return;const a=$('#resetPassword').value,b=$('#resetConfirm').value;
    if(a.length<8)return setStatus('#resetStatus','Use a password of at least 8 characters.','error');if(a!==b)return setStatus('#resetStatus','The passwords do not match.','error');
    const s=savedSession();if(!s?.access_token)return setStatus('#resetStatus','The recovery link has expired. Request a new password reset email.','error');
    const btn=$('#resetSubmit');btn.disabled=true;setStatus('#resetStatus','Updating password…');
    try{await call('/auth/v1/user',{method:'PUT',token:s.access_token,body:{password:a}});setStatus('#resetStatus','Password updated. Opening World of Trade…','ok');setTimeout(goGame,350);}catch(err){setStatus('#resetStatus',err.message,'error');btn.disabled=false;}
  });

  (async()=>{
    if(!configReady){selectTab(mode);setStatus(mode==='login'?'#loginStatus':'#registerStatus','Account access is temporarily unavailable because Supabase is not configured.','error');return;}
    const hash=await parseHash();if(hash?.error){selectTab('login');setStatus('#loginStatus',hash.error,'error');return;}if(hash?.recovery){showReset();return;}
    const existing=await verify(savedSession());
    if(existing){const box=$('#existingSession');if(box){box.hidden=false;box.innerHTML=`<span>You are already signed in as <strong>${String(existing.user?.email||'your account').replace(/[&<>"']/g,'')}</strong>.</span><button id="continueSession" type="button">Continue</button><button id="useDifferent" type="button">Use a different account</button>`;$('#continueSession')?.addEventListener('click',goGame);$('#useDifferent')?.addEventListener('click',()=>{saveSession(null);box.hidden=true;selectTab('login');});}}
    if(params.get('reason')==='session-expired')setStatus('#loginStatus','Your session expired. Log in again to continue.','error');
    selectTab(params.get('mode')==='reset'?'login':mode);
  })();
})();
