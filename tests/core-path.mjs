/* The first sixteen units are the core trading path. This suite keeps their
   order, scenes, skills and exercise quality stable without tying the game to
   an external study programme. */
import { boot, suite } from './harness.mjs';
const t = suite('Core trading path');
const { w } = await boot();
const L = w.__LEARN__;
const G = w.WOT_GAME;
const core = L.UNITS.filter(u => /^u\d+$/.test(u.id));
const IDS = Array.from({length:16},(_,i)=>`u${i+1}`);
t('sixteen core units', core.length===16, String(core.length));
t('core ids remain ordered', IDS.every((id,i)=>core[i]?.id===id), core.map(u=>u.id).join(' '));
t('no academic term/code metadata', core.every(u=>!u.course), core.filter(u=>u.course).map(u=>u.id).join(' ')||'clean');
t('every core unit has scene', core.every(u=>u.scene), core.filter(u=>!u.scene).map(u=>u.id).join(' ')||'all');
t('every core unit has skill and division', IDS.every(id=>G.unitMeta[id]?.skill&&G.unitMeta[id]?.division), 'metadata');
t('all referenced skills exist', IDS.every(id=>G.skills[G.unitMeta[id]?.skill]), 'skills');
const all=core.flatMap(u=>u.lessons.flatMap(l=>l.exercises));
t('core exercises have explanations', all.every(e=>e.why&&e.why.length>=40), String(all.length));
