import fs from 'node:fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const app=read('app.js'),html=read('learn.html'),cloud=read('cloud.js'),social=read('social.js'),acct=read('account-social.js'),css=read('styles.css'),sql=read('SUPABASE-SETUP.md'),sw=read('sw.js');
/* La versione della cache del service worker sale a ogni rilascio: fissarla
   a un numero preciso fa fallire per sempre la suite di una funzionalita'
   vecchia. Conta che non sia RETROCEDUTA sotto la versione di quel rilascio. */
const cacheAlmeno = n => Number((sw.match(/const VERSION = 'v(\d+)'/) || [])[1] || 0) >= n;
const tests=[
 ['account social loaded',html.includes('<script defer src="account-social.js"></script>')],
 ['account settings UI',acct.includes('Account & Settings')&&acct.includes('changePassword060')&&acct.includes('deleteAccount060')],
 ['trader id',acct.includes('Trader ID')&&cloud.includes('trader_tag')&&social.includes('defaultTraderTag')],
 ['league tabs',acct.includes('data-league-tab="league"')&&acct.includes('data-league-tab="friends"')&&acct.includes('data-league-tab="challenges"')],
 ['friend search',cloud.includes('searchSocialProfiles')&&acct.includes('traderSearchForm060')],
 ['friend requests',cloud.includes('sendFriendRequest')&&cloud.includes('respondFriendRequest')&&sql.includes('friend_requests')],
 ['challenge reuse',acct.includes('openChallengeCreator')&&acct.includes('startChallenge')&&social.includes('openChallengeCreator,startChallenge')],
 ['delete account rpc',cloud.includes('delete_wot_account')&&sql.includes('delete from auth.users')],
 // suono e vibrazione sono impostazioni del dispositivo: stanno nel Profilo,
 // raggiungibili anche da chi gioca senza account
 ['device settings live in the profile',
   app.includes("SETTINGS_KEY = 'wot-settings-v1'") && app.includes('bindDeviceSettings')
   && app.includes('setSound') && app.includes('setHaptics')],
 ['social styles',css.includes('v0.6 — ACCOUNT & SOCIAL')&&css.includes('.league-subnav060')],
 ['cache bumped',cacheAlmeno(52)&&sw.includes("'account-social.js'")]
];
let bad=0;for(const [n,ok] of tests){console.log(ok?'✓':'✗',n);if(!ok)bad++;}if(bad)process.exit(1);
