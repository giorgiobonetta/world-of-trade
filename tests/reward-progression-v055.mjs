import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const read = f => fs.readFileSync(new URL(f, root), 'utf8');
const feel = read('game-feel.js'), html = read('learn.html'), sw = read('sw.js'), app=read('app.js'), css=read('styles.css');
const checks = [
  ['desk unlock reward', feel.includes('NEW DESK UNLOCKED') && feel.includes('Enter Desk')],
  ['promotion reward', feel.includes('CAREER PROMOTION')],
  ['achievement reward', feel.includes('ACHIEVEMENT UNLOCKED')],
  ['rank progress', feel.includes('reward-rank055') && feel.includes('rankProgress')],
  ['current tag', feel.includes("tag.textContent = 'CURRENT'")],
  ['reward queue', feel.includes('rewardQueue') && feel.includes('showNextReward')],
  ['profile preserved', app.includes('profile-editor') && app.includes('profilePhotoChange') && app.includes('profileNameSave')],
  ['practice hardfix preserved', css.includes('HARD FIX: PRACTICE CANVAS') && css.includes('#practiceScreen.active')],
  ['asset bust', html.includes('game-feel.js?v=055') && html.includes('app.js?v=055') && html.includes('styles.css?v=055')],
  ['pwa bump', sw.includes("const VERSION = 'v51'")],
];
let bad=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`); if(!ok) bad++;}
if(bad) process.exit(1);
