/* World of Trade — unified login / registration entry point */
(() => {
  'use strict';
  const CFG = window.WOT_CLOUD || {};
  const KEY = CFG.anonKey || CFG.publishableKey || '';
  const SESS = 'wot-cloud-session';
  const GUEST = 'wot-guest';
  const $ = s => document.querySelector(s);

  function secret(k){
    if(!k) return false;
    if(/^sb_secret_/.test(k)) return true;
    try{const p=JSON.parse(atob(String(k).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));return p.role==='service_role';}catch(e){return false;}
  }
  const enabled = !!(CFG.url && KEY) && !secret(KEY);
  function savedSession(){try{return JSON.parse(localStorage.getItem(SESS)||'null')}catch(e){return null}}
  function saveSession(s){try{localStorage.setItem(SESS,JSON.stringify(s));localStorage.removeItem(GUEST);}catch(e){}}
  function clearHash(){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){location.hash=''}}
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function setStatus(id,text,type=''){
    const el=$(id); if(!el)return;
    el.textContent=text||''; el.hidden=!text; el.className='auth-status'+(type?' '+type:'');
  }
  function friendly(statusCode,d){
    const raw=(d&&(d.msg||d.message||d.error_description||d.error||d.hint))||'';
    const t=String(raw).toLowerCase();
    if(t.includes('invalid login credentials')) return 'Wrong email or password.';
    if(t.includes('already registered')||t.includes('already been registered')) return 'That email already has an account. Log in instead.';
    if(t.includes('email not confirmed')) return 'Confirm your email from your inbox, then log in.';
    if(t.includes('password should be')||t.includes('at least')) return 'Use a password of at least 6 characters.';
    if(t.includes('unable to validate email')||t.includes('invalid format')) return 'Enter a valid email address.';
    if(t.includes('rate limit')||statusCode===429) return 'Too many attempts. Wait a moment and try again.';
    return raw ? String(raw) : 'Something went wrong. Please try again.';
  }
  async function call(path,{method='POST',body,token}={}){
    if(!enabled) throw new Error('Authentication is not configured on this deployment yet.');
    const headers={apikey:KEY,'Content-Type':'application/json'};
    if(token) headers.Authorization='Bearer '+token;
    const res=await fetch(CFG.url.replace(/\/$/,'')+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
    const text=await res.text(); let data=null; try{data=text?JSON.parse(text):null}catch(e){data={raw:text}};
    if(!res.ok){const err=new Error(friendly(res.status,data));err.status=res.status;throw err;}
    return data;
  }
  async function hydrateUser(s){
    if(!s?.access_token) return s;
    try{const user=await call('/auth/v1/user',{method:'GET',token:s.access_token});return {...s,user};}catch(e){return s;}
  }
  function goGame(){ location.replace('learn.html'); }
  function switchMode(mode){
    const reg=mode!=='login';
    $('#registerPanel').hidden=!reg; $('#loginPanel').hidden=reg;
    $('#tabRegister').classList.toggle('active',reg); $('#tabLogin').classList.toggle('active',!reg);
    $('#tabRegister').setAttribute('aria-selected',String(reg)); $('#tabLogin').setAttribute('aria-selected',String(!reg));
    try{history.replaceState(null,'',reg?'access.html':'access.html?mode=login')}catch(e){}
  }
  function bindEyes(){
    document.querySelectorAll('[data-password-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
      const input=document.getElementById(btn.dataset.passwordToggle); if(!input)return;
      const show=input.type==='password'; input.type=show?'text':'password'; btn.textContent=show?'Hide':'Show'; btn.setAttribute('aria-label',(show?'Hide':'Show')+' password');
    }));
  }
  function showExisting(){
    const s=savedSession(), box=$('#existingSession'); if(!box||!s?.access_token)return;
    const email=s.user?.email ? ` as <strong>${escapeHtml(s.user.email)}</strong>` : '';
    box.innerHTML=`You are already signed in${email}. <a href="learn.html">Continue to the game →</a>`; box.hidden=false;
  }
  async function processCallback(){
    const hash=(location.hash||'').replace(/^#/,''); if(!hash) return false;
    const p=new URLSearchParams(hash); const err=p.get('error_description')||p.get('error');
    if(err){clearHash();setStatus('#loginStatus',decodeURIComponent(String(err).replace(/\+/g,' ')),'error');switchMode('login');return true;}
    const at=p.get('access_token'); if(!at) return false;
    const s=await hydrateUser({access_token:at,refresh_token:p.get('refresh_token')||null,token_type:p.get('token_type')||'bearer'});
    saveSession(s); clearHash(); goGame(); return true;
  }
  async function login(e){
    e.preventDefault(); setStatus('#loginStatus','');
    const email=$('#loginEmail').value.trim(), password=$('#loginPassword').value;
    if(!email||!email.includes('@')) return setStatus('#loginStatus','Enter a valid email address.','error');
    if(password.length<6) return setStatus('#loginStatus','Use a password of at least 6 characters.','error');
    const btn=$('#loginSubmit'), label=btn.textContent; btn.disabled=true; btn.textContent='Signing in…';
    try{const r=await call('/auth/v1/token?grant_type=password',{body:{email,password}});saveSession(await hydrateUser(r));goGame();}
    catch(err){setStatus('#loginStatus',err.message||'Something went wrong.','error');}
    finally{btn.disabled=false;btn.textContent=label;}
  }
  async function register(e){
    e.preventDefault(); setStatus('#registerStatus','');
    const email=$('#registerEmail').value.trim(), password=$('#registerPassword').value, confirm=$('#registerConfirm').value;
    if(!email||!email.includes('@')) return setStatus('#registerStatus','Enter a valid email address.','error');
    if(password.length<6) return setStatus('#registerStatus','Use a password of at least 6 characters.','error');
    if(password!==confirm) return setStatus('#registerStatus','The two passwords do not match.','error');
    if(!$('#registerTerms').checked) return setStatus('#registerStatus','Please accept the Privacy & Terms notice to create an account.','error');
    const btn=$('#registerSubmit'), label=btn.textContent; btn.disabled=true; btn.textContent='Creating account…';
    try{
      const r=await call('/auth/v1/signup',{body:{email,password}});
      if(r?.access_token){saveSession(await hydrateUser(r));goGame();return;}
      setStatus('#registerStatus','Account created. Check your inbox to confirm the email, then log in.','ok');
      switchMode('login'); $('#loginEmail').value=email;
    }catch(err){setStatus('#registerStatus',err.message||'Something went wrong.','error');}
    finally{btn.disabled=false;btn.textContent=label;}
  }
  async function init(){
    bindEyes(); showExisting();
    $('#tabRegister').addEventListener('click',()=>switchMode('register'));
    $('#tabLogin').addEventListener('click',()=>switchMode('login'));
    $('#registerForm').addEventListener('submit',register);
    $('#loginForm').addEventListener('submit',login);
    switchMode(new URLSearchParams(location.search).get('mode')==='login'?'login':'register');
    if(!enabled){setStatus('#registerStatus','Authentication is not configured on this deployment yet. Add the existing Supabase public configuration to enable accounts.','error');setStatus('#loginStatus','Authentication is not configured on this deployment yet. Add the existing Supabase public configuration to enable accounts.','error');}
    await processCallback();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
