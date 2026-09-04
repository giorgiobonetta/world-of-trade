import fs from 'fs';
import path from 'path';
const DIR=path.resolve(new URL('.',import.meta.url).pathname,'..');
const cloud=fs.readFileSync(DIR+'/cloud.js','utf8');
const app=fs.readFileSync(DIR+'/app.js','utf8');
const checks=[
 ['cloud merge includes lifebuoy balance',/lives:\s*mergedLives/.test(cloud)],
 ['cloud merge includes refill timestamp',/livesAt:\s*mergedLivesAt/.test(cloud)],
 ['resource selection uses updatedAt',/Number\(a\.updatedAt\)/.test(cloud)&&/Number\(b\.updatedAt\)/.test(cloud)],
 ['old cloud rows cannot overwrite local resource',/!hasLives\(a\)\s*&&\s*hasLives\(b\)/.test(cloud)],
 ['six-minute increments',/LIFE_REGEN_MS\s*=\s*6\s*\*\s*60\s*\*\s*1000/.test(app)],
 ['thirty-minute full refill constant',/FULL_REFILL_MS\s*=\s*MAX_LIVES\s*\*\s*LIFE_REGEN_MS/.test(app)],
 ['streak instant refill disabled',/function forseGuadagnaVita\(\)\s*\{\s*return false;\s*\}/.test(app)],
 ['zero balance resets refill clock',/state\.lives === 0\) state\.livesAt = adesso/.test(app)]
];
let bad=0;for(const [n,ok] of checks){console.log(`${ok?'✓':'✗'} ${n}`);if(!ok)bad++}process.exit(bad?1:0);
