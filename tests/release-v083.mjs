import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
let pass=0,fail=0;
function t(name,ok,detail=''){if(ok){pass++;console.log('  ✓',name);}else{fail++;console.error('  ✗',name,detail||'');}}
function has(file,rx){return rx.test(read(file));}

console.log('World of Trade v0.8.3 release gate');

// Core curriculum is the source of truth for public stats.
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read('curriculum.js'),ctx);vm.runInContext(read('content-engine.js'),ctx);
const units=ctx.window.CURRICULUM||[];
const levels=units.reduce((n,u)=>n+(u.lessons?.length||0),0);
const exercises=units.reduce((n,u)=>n+(u.lessons||[]).reduce((m,l)=>m+(l.exercises?.length||0),0),0);
t('curriculum remains 34 units',units.length===34,String(units.length));
t('curriculum remains 219 levels',levels===219,String(levels));
t('curriculum remains 1,086 exercises',exercises===1086,String(exercises));
t('landing renders curriculum from the same CURRICULUM dataset',has('index.html',/id="curriculumUnits"/)&&has('landing-curriculum.js',/window\.CURRICULUM/));
t('specialist units 28–34 are present in source curriculum',units.slice(27).length===7&&units[33]?.title==='Assets, Infrastructure & Structured Deals');

// Public consistency / legal / SEO.
const index=read('index.html'), privacy=read('privacy.html'), glossary=read('glossary.html');
t('public site no longer advertises guest play',!/(play immediately|add an account whenever|No account is required|guest mode)/i.test(index+privacy+glossary));
t('privacy states account requirement',/account is required/i.test(privacy));
t('privacy describes Support\/Contributors',/Support|Contributors/.test(privacy)&&/PayPal/i.test(privacy));
t('privacy date is current release date',/12 September 2026/.test(privacy));
t('glossary says sixteen foundation units',/sixteen foundation units/i.test(glossary));
t('self-check is not linked publicly',!/(href=["'][^"']*selftest|>Self-check<)/i.test(index+privacy+glossary));
t('homepage has Software/EducationalApplication JSON-LD',/SoftwareApplication/.test(index)&&/EducationalApplication/.test(index));
t('large social preview is referenced',/social-preview-1200x630\.png/.test(index)&&/1200/.test(index)&&/630/.test(index));
const png=fs.readFileSync(path.join(root,'social-preview-1200x630.png')); const w=png.readUInt32BE(16),h=png.readUInt32BE(20);
t('social preview really is 1200×630',w===1200&&h===630,`${w}x${h}`);
t('requested landing copy uses full-row treatment',(['Most material on this business','111 foundation levels','This is a real question from the hedging desk path','Every XP you earn in a week','The glossary is not an appendix','World of Trade is free to play'].every(x=>index.includes('sub sub-wide')&&index.includes(x)))&&/site-footer-disclaimer/.test(index));

// Auth reliability.
const access=read('access.html'),accessJs=read('access-page.js'),learn=read('learn.html'),cloud=read('cloud.js');
t('auth forms use 8-char minimum',!/minlength="6"/.test(access)&&/minlength="8"/.test(access));
t('native form validation remains enabled',!/novalidate/i.test(access));
t('forgot password exists',/forgotPassword/.test(access)&&/\/auth\/v1\/recover\?redirect_to=/.test(accessJs));
t('resend confirmation exists',/resendConfirmation/.test(access)&&/\/auth\/v1\/resend\?redirect_to=/.test(accessJs));
t('existing-session card lives inside Login panel',/id="loginPanel"[\s\S]*id="existingSession"/.test(access)&&/auth-session-head/.test(accessJs));
t('credential loading is rendered in form cells, not a loading status box',/setBusy\(form,btn,true,'Logging in…'\)/.test(accessJs)&&!/setStatus\('#loginStatus','Logging in…'\)/.test(accessJs)&&/auth-form\.is-loading \.auth-input/.test(read('auth.css')));
t('password recovery panel exists',/resetPanel/.test(access)&&/type==='recovery'/.test(accessJs));
t('signup redirect uses GoTrue redirect_to query parameter',/\/auth\/v1\/signup\?redirect_to=/.test(accessJs));
t('deep-link is same-origin sanitized and preserved',/u\.origin !== location\.origin/.test(accessJs)&&/next/.test(accessJs)&&/goGame/.test(accessJs));
t('game entrance requires account tokens',/access_token/.test(learn)&&/refresh_token/.test(learn)&&/access\.html\?/.test(learn));
t('hidden sandbox can still run self-check without a real account',/URLSearchParams\(location\.search\)\.has\('sandbox'\)/.test(learn)&&/if \(SANDBOX\) \{ disegna\(\); return; \}/.test(cloud));
t('LinkedIn is not offered as an authentication provider',!/linkedin_oidc|Continue with LinkedIn|cloudLinkedin/.test(cloud+accessJs));
t('cloud refreshes a 401 once with refresh token',/grant_type=refresh_token/.test(cloud)&&/withFreshToken/.test(cloud));
t('cloud verifies the user before opening the app',/await chiUtente\(\)/.test(cloud)&&/session-expired/.test(cloud));
t('legacy login/register/landing implementations removed',!fs.existsSync(path.join(root,'login.html'))&&!fs.existsSync(path.join(root,'register.html'))&&!fs.existsSync(path.join(root,'landing.html'))&&!fs.existsSync(path.join(root,'auth-page.js')));

// Profile, deletion and avatars.
const account=read('account-social.js'),app=read('app.js'),social=read('social.js');
t('display name and public alias are separate inputs',/profileNameInput/.test(app)&&/profileAliasInput/.test(app));
t('social alias does not derive from personal display name',/competitive\?\.alias \|\| existing\?\.alias/.test(social)&&!/profile\?\.name \|\| L\.state\?\.competitive\?\.alias/.test(social));
t('avatar is reduced to 128×128 WebP before upload',/canvas\.width=128;canvas\.height=128/.test(app)&&/image\/webp/.test(app));
t('avatar is stored in Supabase Storage when signed in',/uploadAvatar/.test(app)&&/storage\/v1\/object\/avatars/.test(cloud));
t('account deletion requires DELETE and current password',/deleteConfirm060/.test(account)&&/deletePassword060/.test(account)&&/reauthenticate/.test(account));
t('reauthentication verifies current email/password before deletion',/async function reauthenticate/.test(cloud)&&/signIn\(current\.email, value\)/.test(cloud));

// Learning UX.
t('locked next desk names the exact unfinished level',/Complete \$\{current\.title\} — \$\{first\.title\}/.test(app));
t('Practice explains weak-skill or memory-refresh rationale',/Weak skill/.test(app)&&/Memory refresh/.test(app));
t('lesson completion contains learning summary',/doneLearningSummary/.test(learn)&&/NEEDS PRACTICE/.test(app)&&/STRONG/.test(app));
t('lifebuoy model is still five with six-minute regeneration',/MAX_LIVES\s*=\s*5/.test(app)&&/6\s*\*\s*60\s*\*\s*1000/.test(app));

// Social integrity / backend migration.
const sql=read('SUPABASE-V080-HARDENING.sql');
t('League score direct client writes are removed',/revoke insert, update, delete on public\.league_scores/.test(sql)&&/sync_wot_league_score/.test(cloud));
t('League RPC derives XP from saved career state',/total_xp - start_xp/.test(sql)&&/League score does not match saved career state/.test(sql));
t('challenge scores go through server RPC and are immutable',/submit_wot_challenge_score/.test(sql)&&/revoke insert,update,delete on public\.friend_challenge_scores/.test(sql)&&/submit_wot_challenge_score/.test(cloud));
t('social base table global read policy is removed',/drop policy if exists "social profiles leggibili"/.test(sql)&&/revoke select on public\.social_profiles/.test(sql));
const publicView=(sql.match(/create view public\.public_social_profiles[\s\S]*?revoke all on public\.public_social_profiles/)||[''])[0];
t('safe social view omits UUID and referral code',/select alias, house, trader_tag/.test(publicView)&&!/user_id|referral_code/.test(publicView));
t('trader discovery uses UUID-free RPC',/search_wot_traders/.test(sql)&&/returns table\(alias text, house text, trader_tag text, relation_status text\)/.test(sql)&&/rpc\/search_wot_traders/.test(cloud)&&!/PUBLIC_SOCIAL_VIEW\}\?select=user_id/.test(cloud));
t('search actions use Trader ID server RPCs',/send_wot_friend_request_by_tag/.test(sql)&&/block_wot_trader_by_tag/.test(sql)&&/sendFriendRequestByTag/.test(cloud)&&/blockTraderByTag/.test(cloud)&&/data-add-friend-tag/.test(account));
t('friends get 24-hour declined-request cooldown',/interval '24 hours'/.test(sql));
t('block-user backend and UI exist',/block_wot_user/.test(sql)&&/data-block-trader/.test(account));
t('supporter requests are database-backed',/supporter_requests/.test(sql)&&/submitSupporterRequest/.test(read('donations.js')));
t('public supporters expose approved names only',/where status='approved'/.test(sql)&&/public_supporters/.test(read('donations.js')));

// PWA / cache / versioning.
const sw=read('sw.js'),version=read('version.js'),pkg=JSON.parse(read('package.json'));
t('browser release version is 0.8.3',/0\.8\.3/.test(version)&&pkg.version==='0.8.3');
t('service worker derives cache version from central version',/importScripts\('\.\/version\.js'\)/.test(sw)&&/WOT_VERSION/.test(sw));
t('service worker uses network-first for app code',/networkFirst/.test(sw)&&/HTML|javascript|text\/css/.test(sw));
t('access flow is precached',/access\.html/.test(sw)&&/access-page\.js/.test(sw));
t('Supabase config is explicitly excluded from cache',/supabase-config\.js/.test(sw)&&/cache:'no-store'/.test(sw));
t('modal keyboard focus helper is installed',/dialog-a11y\.js/.test(learn)&&/e\.key !== 'Tab'/.test(read('dialog-a11y.js')));

// Assets, redirects and developer hygiene.
const founder=fs.statSync(path.join(root,'founder-giorgio-bonetta-220.webp')).size;
t('Founder web image is under 30 KB',founder<30000,`${founder} bytes`);
t('full Founder source is excluded from Vercel deploy',has('.vercelignore',/founder-giorgio-bonetta\.png/));
const vercel=read('vercel.json');
t('/landing redirects to /',/"source": "\/landing"[\s\S]{0,100}"destination": "\/"/.test(vercel));
t('/login and /register redirect to unified access page',/access\.html\?mode=login/.test(vercel)&&/access\.html\?mode=register/.test(vercel));
t('hardening SQL ships with the release',fs.existsSync(path.join(root,'SUPABASE-V080-HARDENING.sql')));

// Every top-level browser JS must parse.
for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.js'))){
  const r=spawnSync(process.execPath,['--check',path.join(root,f)],{encoding:'utf8'});
  t(`syntax: ${f}`,r.status===0,(r.stderr||r.stdout||'').trim());
}

console.log(`\nRelease gate: ${pass} passed, ${fail} failed`);
if(fail) process.exit(1);
