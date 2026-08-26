/* World of Trade — competitive layer
   Weekly leagues, Trading Houses and achievement metadata.
   The UI works locally; real standings are provided by cloud.js when Supabase
   has the optional league_scores table configured.
*/
(() => {
  'use strict';

  const divisions = [
    { id:'bronze', name:'Bronze', icon:'III', promote:200, demote:0 },
    { id:'silver', name:'Silver', icon:'II', promote:300, demote:80 },
    { id:'gold', name:'Gold', icon:'I', promote:450, demote:120 },
    { id:'platinum', name:'Platinum', icon:'P', promote:650, demote:180 },
    { id:'diamond', name:'Diamond', icon:'D', promote:900, demote:250 },
    { id:'master', name:'Master', icon:'M', promote:Infinity, demote:350 },
  ];

  const houses = [
    { id:'atlas', name:'Atlas Merchant House', icon:'A', motto:'Move the world, one deal at a time.' },
    { id:'helios', name:'Helios Commodities', icon:'H', motto:'See the flow before the market does.' },
    { id:'northstar', name:'Northstar Trading', icon:'N', motto:'Discipline first. Opportunity second.' },
    { id:'meridian', name:'Meridian Resources', icon:'M', motto:'Price, route, finance, execute.' },
    { id:'blueharbor', name:'BlueHarbor Merchants', icon:'B', motto:'Own the route. Protect the margin.' },
    { id:'argonaut', name:'Argonaut Trading House', icon:'R', motto:'Across markets, across oceans.' },
  ];

  const achievements = [
    { id:'first-ticket', icon:'01', title:'First Ticket', copy:'Complete your first Career level.', test:c => c.done >= 1 },
    { id:'foundation', icon:'MF', title:'Merchant Foundations', copy:'Complete all 31 foundation levels.', test:c => c.done >= 31 },
    { id:'academy', icon:'103', title:'Trading House Graduate', copy:'Complete all 103 Career levels.', test:c => c.done >= 103 },
    { id:'flash-100', icon:'⚡', title:'Fast Hands', copy:'Score 100 in Flash Trading.', test:c => c.flashBest >= 100 },
    { id:'flash-500', icon:'⚡', title:'Lightning Book', copy:'Score 500 in Flash Trading.', test:c => c.flashBest >= 500 },
    { id:'floor-clear', icon:'∞', title:'On the Floor', copy:'Clear your first Trading Floor Run.', test:c => c.frontierCleared >= 1 },
    { id:'floor-90', icon:'90', title:'Desk Sharp', copy:'Score at least 90% in a Trading Floor Run.', test:c => c.frontierBest >= 90 },
    { id:'boss-clear', icon:'♜', title:'Deal Closer', copy:'Clear your first Boss Deal.', test:c => c.bossCleared >= 1 },
    { id:'boss-90', icon:'★', title:'Five-Star Merchant', copy:'Score at least 90% in a Boss Deal.', test:c => c.bossBest >= 90 },
    { id:'daily-7', icon:'7D', title:'Desk Regular', copy:'Complete 7 Deals of the Day.', test:c => c.dailyDeals >= 7 },
    { id:'perfect-3', icon:'3×', title:'Perfect Week Start', copy:'Record 3 Perfect Days.', test:c => c.perfectDays >= 3 },
    { id:'streak-7', icon:'🔥', title:'One Week Hot', copy:'Reach a 7-day streak.', test:c => c.streak >= 7 },
    { id:'streak-30', icon:'🔥', title:'Market Habit', copy:'Reach a 30-day streak.', test:c => c.streak >= 30 },
    { id:'xp-1000', icon:'1K', title:'Four Figures', copy:'Earn 1,000 career XP.', test:c => c.xp >= 1000 },
    { id:'xp-5000', icon:'5K', title:'Desk Veteran', copy:'Earn 5,000 career XP.', test:c => c.xp >= 5000 },
    { id:'specialist', icon:'80', title:'Desk Specialist', copy:'Reach 80 mastery in any skill.', test:c => c.skillValues.some(v => v >= 80) },
    { id:'allrounder', icon:'60', title:'Merchant All-Rounder', copy:'Reach 60 mastery in every skill.', test:c => c.skillValues.length > 0 && c.skillValues.every(v => v >= 60) },
    { id:'partner', icon:'P', title:'Partner', copy:'Reach Partner career rank.', test:c => c.rank === 'Partner' },
  ];

  function weekKey(date = new Date()) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = (d.getDay() + 6) % 7; // Monday=0
    d.setDate(d.getDate() - day);
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), n = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${n}`;
  }

  function weekRange(key) {
    const [y,m,d] = String(key).split('-').map(Number);
    const start = new Date(y, (m||1)-1, d||1);
    const end = new Date(start); end.setDate(start.getDate()+6);
    const fmt = x => x.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
    return `${fmt(start)} – ${fmt(end)}`;
  }

  function division(id) { return divisions.find(x => x.id === id) || divisions[0]; }
  function moveTier(id, delta) {
    const i = Math.max(0, divisions.findIndex(x => x.id === id));
    return divisions[Math.max(0, Math.min(divisions.length-1, i + delta))].id;
  }

  function seasonMove(tier, points, placement) {
    const d = division(tier);
    if (Number.isFinite(Number(placement)) && Number(placement) > 0) {
      if (Number(placement) <= 5) return moveTier(tier, +1);
      if (Number(placement) >= 21) return moveTier(tier, -1);
      return tier;
    }
    if (points >= d.promote) return moveTier(tier, +1);
    if (points < d.demote) return moveTier(tier, -1);
    return tier;
  }

  function localOpponents(week, tier, playerScore = 0) {
    const names = ['Copper Fox','Baltic Owl','Orion Desk','Alpine Bid','Red Crane','Delta Cargo','Iron Gull','Polar Basis','Cobalt Ship','Amber Curve','Nomad Hedge','Seaway Risk','Maple Barrel','Sable Freight','Grain Hawk','Quartz Book','Tidewater','Blue Delta','Portside','Atlas Echo','North Cape','Gamma Cargo','Silver Keel','Harbor Nine'];
    let h = 2166136261 >>> 0;
    for (const ch of `${week}:${tier}`) { h ^= ch.charCodeAt(0); h = Math.imul(h,16777619); }
    const rnd = () => { h += 0x6D2B79F5; let t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; };
    const base = Math.max(35, playerScore * .75 + 70);
    return names.slice(0,24).map((alias,i) => ({
      user_id:`preview-${i}`, alias, house:houses[i % houses.length].id, tier,
      score:Math.max(5, Math.round(base * (.45 + rnd()*1.25))), preview:true,
    })).sort((a,b)=>b.score-a.score);
  }

  window.WOT_COMP = { divisions, houses, achievements, weekKey, weekRange, division, moveTier, seasonMove, localOpponents };
})();
