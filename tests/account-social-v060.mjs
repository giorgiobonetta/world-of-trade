import fs from 'node:fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const html=read('learn.html'),cloud=read('cloud.js'),social=read('social.js'),acct=read('account-social.js'),css=read('styles.css'),sql=read('SUPABASE-SETUP.md'),sw=read('sw.js');
const tests=[
 ['account social loaded',html.includes('account-social.js?v=060')],
 ['account settings UI',acct.includes('Account & Settings')&&acct.includes('changePassword060')&&acct.includes('deleteAccount060')],
 ['trader id',acct.includes('Trader ID')&&cloud.includes('trader_tag')&&social.includes('defaultTraderTag')],
 ['league tabs',acct.includes('data-league-tab="league"')&&acct.includes('data-league-tab="friends"')&&acct.includes('data-league-tab="challenges"')],
 ['friend search',cloud.includes('searchSocialProfiles')&&acct.includes('traderSearchForm060')],
 ['friend requests',cloud.includes('sendFriendRequest')&&cloud.includes('respondFriendRequest')&&sql.includes('friend_requests')],
 ['challenge reuse',acct.includes('openChallengeCreator')&&acct.includes('startChallenge')&&social.includes('openChallengeCreator,startChallenge')],
 ['delete account rpc',cloud.includes('delete_wot_account')&&sql.includes('delete from auth.users')],
 ['haptics setting',acct.includes('wot-settings-v1')],
 ['social styles',css.includes('v0.6 — ACCOUNT & SOCIAL')&&css.includes('.league-subnav060')],
 ['cache bumped',sw.includes("const VERSION = 'v52'")&&sw.includes("'account-social.js'")]
];
let bad=0;for(const [n,ok] of tests){console.log(ok?'✓':'✗',n);if(!ok)bad++;}if(bad)process.exit(1);
