/* World of Trade — career layer
   Metadata and repeatable Flash Trading generators. Kept separate from the
   curated curriculum so the course can grow without coupling game rules to content.
*/
(() => {
  'use strict';
  let RNG = Math.random;
  const r = (a, b, step = 1) => {
    const n = Math.floor(RNG() * (Math.floor((b - a) / step) + 1));
    return a + n * step;
  };
  const one = a => a[Math.floor(RNG() * a.length)];
  const hash = str => {
    let h = 2166136261 >>> 0;
    for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const seeded = seed => {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  const withRng = (rng, fn) => { const prev = RNG; RNG = rng; try { return fn(); } finally { RNG = prev; } };
  const round = (n, d = 0) => Number(n.toFixed(d));

  const skills = {
    trading:   { name:'Physical Trading', short:'Trading', icon:'↔', description:'Structure trades, margins and commercial decisions.' },
    operations:{ name:'Operations & Incoterms', short:'Operations', icon:'⚓', description:'Move cargoes and know exactly where cost and risk transfer.' },
    pricing:   { name:'Pricing', short:'Pricing', icon:'$', description:'Translate benchmarks, premiums, discounts and basis into executable prices.' },
    hedging:   { name:'Hedging & Derivatives', short:'Hedging', icon:'⇄', description:'Neutralise flat-price risk and understand what remains.' },
    finance:   { name:'Trade Finance', short:'Finance', icon:'▣', description:'Fund working capital and control payment and counterparty risk.' },
    execution: { name:'Execution & Documents', short:'Execution', icon:'✓', description:'Get the cargo, documents and cash to the right place at the right time.' },
    freight:   { name:'Freight & Chartering', short:'Freight', icon:'▰', description:'Price transport, vessel economics and shipping exposure.' },
    risk:      { name:'Desk Risk', short:'Risk', icon:'△', description:'Control exposure, concentration, liquidity and tail scenarios.' },
  };

  const foundationUnitMeta = {
    u1:{ division:'Physical Trading', skill:'trading', chapter:'Merchant Foundations' },
    u2:{ division:'Operations', skill:'operations', chapter:'Merchant Foundations' },
    u3:{ division:'Pricing', skill:'pricing', chapter:'Merchant Foundations' },
    u4:{ division:'Derivatives', skill:'hedging', chapter:'Merchant Foundations' },
    u5:{ division:'Trade Finance', skill:'finance', chapter:'Merchant Foundations' },
    u6:{ division:'Execution', skill:'execution', chapter:'Merchant Foundations' },
    u8:{ division:'Chartering', skill:'freight', chapter:'Merchant Foundations' },
    u7:{ division:'Risk', skill:'risk', chapter:'Merchant Foundations' },
  };

  const unitMeta = { ...foundationUnitMeta, ...(window.WOT_CONTENT?.unitMeta || {}) };

  const ranks = [
    { id:'intern', name:'Intern', xp:0, lessons:0 },
    { id:'graduate-analyst', name:'Graduate Analyst', xp:120, lessons:6 },
    { id:'analyst', name:'Analyst', xp:300, lessons:15 },
    { id:'junior-trader', name:'Junior Trader', xp:650, lessons:31 },
    { id:'trader', name:'Trader', xp:1200, lessons:45 },
    { id:'senior-trader', name:'Senior Trader', xp:2200, lessons:65 },
    { id:'desk-head', name:'Desk Head', xp:3500, lessons:85 },
    { id:'head-trading', name:'Head of Trading', xp:5000, lessons:103 },
    { id:'partner', name:'Partner', xp:8000, lessons:103 },
  ];

  // Every template returns a fresh, mechanically verifiable question.
  // These are deliberately rule-based; AI-generated content comes later, behind validation.
  const flashTemplates = [
    () => { const buy=r(380,760,5), spread=r(15,70,5); return { skill:'trading', type:'numeric',
      prompt:`You buy at $${buy}/t and sell at $${buy+spread}/t. Gross margin per tonne?`, answer:spread, unit:'$/t', tolerance:0,
      why:`Sale minus purchase: ${buy+spread} − ${buy} = $${spread}/t.` }; },
    () => { const gross=r(40,100,5), freight=r(10,30), finance=r(3,12), ops=r(1,8); const a=gross-freight-finance-ops; return { skill:'trading', type:'numeric',
      prompt:`Gross margin $${gross}/t. Freight $${freight}, finance $${finance}, operations $${ops}. Net margin?`, answer:a, unit:'$/t', tolerance:0,
      why:`${gross} − ${freight} − ${finance} − ${ops} = $${a}/t.` }; },
    () => ({ skill:'trading', type:'choice', prompt:'What is the best description of physical commodity trading?',
      options:['Predicting price direction','Moving goods across place, time or form for a margin','Operating mines and refineries','Providing unsecured loans'], answer:1,
      why:'A merchant bridges mismatches in place, time, quality and form, while managing the risks created by that bridge.' }),

    () => ({ skill:'operations', type:'choice', prompt:'Under FOB, who normally arranges the main ocean freight?',
      options:['Seller','Buyer','Inspection company','Port authority'], answer:1,
      why:'Under FOB the seller delivers on board at the load port; the buyer arranges the main carriage.' }),
    () => ({ skill:'operations', type:'choice', prompt:'Under CIF, who contracts and pays the main carriage to the named destination port?',
      options:['Seller','Buyer','Bank','Terminal only'], answer:0,
      why:'CIF requires the seller to contract carriage and insurance to the named port, even though risk transfers earlier.' }),
    () => ({ skill:'operations', type:'choice', prompt:'A buyer needs delivery in 20 days but the realistic voyage is 28. Best commercial response?',
      options:['Promise 20 and hope','Offer a realistic date or another origin','Ignore transit time','Ship without documents'], answer:1,
      why:'Execution credibility beats an impossible promise; late delivery can trigger claims and damage the relationship.' }),

    () => { const benchmark=r(650,950,10), prem=r(12,55); return { skill:'pricing', type:'numeric',
      prompt:`Benchmark is $${benchmark}/t and your contract is benchmark + $${prem}/t. Invoice price?`, answer:benchmark+prem, unit:'$/t', tolerance:0,
      why:`${benchmark} + ${prem} = $${benchmark+prem}/t.` }; },
    () => { const cfr=r(500,900,10), freight=r(20,55); return { skill:'pricing', type:'numeric',
      prompt:`CFR value is $${cfr}/t and freight is $${freight}/t. Implied FOB value?`, answer:cfr-freight, unit:'$/t', tolerance:0,
      why:`FOB ≈ CFR − freight = ${cfr} − ${freight} = $${cfr-freight}/t.` }; },
    () => ({ skill:'pricing', type:'choice', prompt:'If your physical differential improves while the benchmark is unchanged, what happened?',
      options:['Your basis strengthened','Flat price disappeared','Freight became zero','Credit risk vanished'], answer:0,
      why:'The differential to the benchmark is the basis. A stronger physical differential means stronger basis.' }),

    () => ({ skill:'hedging', type:'choice', prompt:'You own unpriced physical inventory and want to neutralise a price fall. Basic futures hedge?',
      options:['Buy futures','Sell futures','Buy more physical','Do nothing'], answer:1,
      why:'Long physical carries downside price risk; a short futures position offsets that flat-price exposure.' }),
    () => { const qty=r(10,60,5)*1000, move=r(4,18); return { skill:'hedging', type:'numeric',
      prompt:`You are short futures on ${qty.toLocaleString('en-US')} t. Futures fall $${move}/t. Hedge P&L?`, answer:qty*move, unit:'$', tolerance:0,
      why:`A short gains when futures fall: ${qty.toLocaleString('en-US')} × ${move} = $${(qty*move).toLocaleString('en-US')}.` }; },
    () => ({ skill:'hedging', type:'choice', prompt:'A fully flat-price-hedged cargo can still lose money because of…',
      options:['Basis, freight, timing and credit risk','Nothing','Only inflation','Only exchange fees'], answer:0,
      why:'Futures remove the risk they match. Physical basis, timing, quality, freight, liquidity and counterparty risks remain.' }),

    () => { const value=r(1,8)*1000000, rate=r(4,10), days=r(20,90,10); const a=round(value*(rate/100)*(days/360),0); return { skill:'finance', type:'numeric',
      prompt:`Fund $${(value/1e6).toFixed(0)}m for ${days} days at ${rate}% p.a. (360-day basis). Interest cost?`, answer:a, unit:'$', tolerance:1,
      why:`${value.toLocaleString('en-US')} × ${(rate/100).toFixed(2)} × ${days}/360 = about $${a.toLocaleString('en-US')}.` }; },
    () => ({ skill:'finance', type:'choice', prompt:'Selling on open account 30 days after delivery means you are effectively…',
      options:['Borrowing from the buyer','Extending credit to the buyer','Eliminating working capital','Hedging FX'], answer:1,
      why:'You deliver before collecting cash, so you are financing the buyer for that period.' }),
    () => ({ skill:'finance', type:'choice', prompt:'Which term is normally safest for the seller against buyer non-payment?',
      options:['Open account 60 days','Cash in advance','Documents after arrival','Verbal promise'], answer:1,
      why:'Cash in advance removes most buyer-payment exposure, though it is commercially harder to obtain.' }),

    () => ({ skill:'execution', type:'choice', prompt:'A document has the wrong consignee and the bank refuses it. What kind of problem is this?',
      options:['Only a market view','An execution/documentary risk that can block payment','A futures pricing error','A vessel speed bonus'], answer:1,
      why:'A profitable cargo can still become a cash problem if documents do not comply with the payment mechanism.' }),
    () => ({ skill:'execution', type:'choice', prompt:'Why is a bill of lading commercially critical?',
      options:['It forecasts prices','It evidences shipment and can control delivery/title mechanics','It fixes interest rates','It replaces insurance'], answer:1,
      why:'The bill of lading is central to shipment evidence and delivery/document flows; errors can stop cargo or cash.' }),
    () => ({ skill:'execution', type:'choice', prompt:'Quality at discharge is outside contract specification. The immediate desk issue is…',
      options:['A quality claim and possible value adjustment','Guaranteed extra profit','No issue if futures were hedged','Automatic freight refund'], answer:0,
      why:'Hedging flat price does not protect contractual quality. Off-spec cargo can trigger claims, rejection or discounts.' }),

    () => { const qty=r(10,60,5)*1000, f=r(18,55); return { skill:'freight', type:'numeric',
      prompt:`Freight is $${f}/t on ${qty.toLocaleString('en-US')} t. Total freight bill?`, answer:qty*f, unit:'$', tolerance:0,
      why:`${qty.toLocaleString('en-US')} × ${f} = $${(qty*f).toLocaleString('en-US')}.` }; },
    () => ({ skill:'freight', type:'choice', prompt:'Laycan is best described as…',
      options:['The permitted vessel arrival/loading window','A futures expiry','The buyer credit limit','A quality certificate'], answer:0,
      why:'Laycan defines the contractual window in which the vessel must present for loading.' }),
    () => ({ skill:'freight', type:'choice', prompt:'If freight rises after you sold CIF at a fixed delivered price and you have not fixed the vessel, your margin generally…',
      options:['Improves','Falls','Is unchanged by definition','Doubles'], answer:1,
      why:'You sold the delivered price but still carry the transport cost. Higher freight eats the merchant margin.' }),

    () => { const phys=r(50,120,10)*1000, fut=r(10,60,10)*1000, limit=r(30,80,10)*1000; const net=phys-fut; const need=Math.max(0,net-limit); return { skill:'risk', type:'numeric',
      prompt:`Long ${phys.toLocaleString('en-US')} t physical, short ${fut.toLocaleString('en-US')} t futures. Net-long limit ${limit.toLocaleString('en-US')} t. Extra tonnes to hedge?`, answer:need, unit:'t', tolerance:0,
      why:`Net long is ${(net).toLocaleString('en-US')} t; excess over the limit is ${need.toLocaleString('en-US')} t.` }; },
    () => ({ skill:'risk', type:'choice', prompt:'A 95% one-day VaR of $2m means…',
      options:['You can never lose more than $2m','Roughly 5% of days may lose more than $2m under the model','You will lose exactly $2m tomorrow','It is annual maximum loss'], answer:1,
      why:'VaR is a percentile threshold, not a maximum-loss guarantee.' }),
    () => ({ skill:'risk', type:'choice', prompt:'Ten buyers all load through the same port. What risk may be hidden?',
      options:['Geographic concentration','No concentration because names differ','Only FX risk','Only accounting risk'], answer:0,
      why:'Different counterparties can still share one chokepoint. Concentration can be geographic, operational or financial.' }),
  ];

  // Boss Deals are factories so each run starts with fresh but internally consistent numbers.
  // A step may add a simulated P&L impact based on the player's decision. That turns the
  // exercise into a deal simulation instead of a long quiz.
  const bossDealFactories = [
    () => {
      const qty = 5000;
      const benchmark = r(2200, 2500, 25);
      const buyPrem = r(130, 170, 5);
      const freight = r(36, 48, 2);
      const spread = r(78, 104, 2);
      const sellPrem = buyPrem + freight + spread;
      const gross = sellPrem - buyPrem - freight;
      const rate = one([6, 6.5, 7, 7.5]);
      const days = 60;
      const financed = benchmark + buyPrem;
      const financePt = round(financed * (rate / 100) * days / 360, 1);
      const freightShock = r(8, 14, 2);
      const rescue = r(2, 5);
      const claim = r(10, 16, 2);
      const basePnl = round(gross * qty, 0);
      return {
        id:'boss-metals-01', desk:'Metals', title:'The Shanghai–Genoa Cargo', difficulty:2,
        unlock:{ xp:0, lessons:0 }, icon:'AL', accent:'Aluminium',
        brief:`You are on the aluminium desk. You can buy ${qty.toLocaleString('en-US')} t FOB Shanghai at LME + $${buyPrem}/t and sell the same tonnage CIF Genoa at LME + $${sellPrem}/t. Freight indication is $${freight}/t. The customer pays 60 days after delivery.`,
        facts:[`Quantity · ${qty.toLocaleString('en-US')} t`,`Buy · LME + $${buyPrem}/t FOB Shanghai`,`Sell · LME + $${sellPrem}/t CIF Genoa`,`Freight · $${freight}/t`,`Reference LME · $${benchmark}/t`],
        basePnl,
        steps:[
          { skill:'trading', type:'numeric', label:'QUOTE', prompt:'Before finance and execution costs, what is the gross merchant margin per tonne?', answer:gross, unit:'$/t', tolerance:.05,
            why:`Delivered differential minus FOB premium and freight: ${sellPrem} − ${buyPrem} − ${freight} = $${gross}/t.`, pnl:{correct:0, wrong:0} },
          { skill:'hedging', type:'choice', label:'HEDGE', prompt:'The cargo is now bought at a fixed all-in price and remains unsold for a few days. Aluminium then falls $12/t. Which hedge would have offset most of that physical loss?',
            options:['Buy LME futures','Sell LME futures','Buy more physical aluminium','Leave the position open because the premium is known'], answer:1,
            why:'Long fixed-price physical inventory carries downside flat-price risk. A short futures position is the basic offset.', pnl:{correct:0, wrong:-qty*12} },
          { skill:'finance', type:'numeric', label:'FUNDING', prompt:`Assume the bank funds $${financed.toLocaleString('en-US')}/t for ${days} days at ${rate}% p.a. on a 360-day basis. Approximate financing cost per tonne.`,
            answer:financePt, unit:'$/t', tolerance:.15, why:`${financed.toLocaleString('en-US')} × ${rate}% × ${days}/360 ≈ $${financePt}/t.`, pnl:{correct:-round(financePt*qty,0), wrong:-round(financePt*qty,0)} },
          { skill:'freight', type:'choice', label:'FREIGHT', prompt:`You have sold CIF but have not fixed the vessel. A broker warns freight could jump by $${freightShock}/t. What protects the quoted margin best?`,
            options:['Fix the freight exposure now','Wait because CIF transfers freight risk to the buyer','Buy LME futures','Increase the cargo quantity'], answer:0,
            why:'On a fixed CIF sale the seller still carries the main carriage cost. Fixing freight removes that open cost exposure.', pnl:{correct:0, wrong:-qty*freightShock} },
          { skill:'execution', type:'choice', label:'EXECUTION', prompt:`The booked vessel may miss the agreed shipment window. An alternative vessel costs $${rescue}/t extra; the late-shipment claim is estimated at $${claim}/t. Best desk decision?`,
            options:[`Take the alternative vessel and protect the shipment window`,`Accept the delay and hope the buyer waives the claim`,`Cancel the hedge only`,`Ignore it because the cargo is insured`], answer:0,
            why:'When the rescue cost is materially lower than the expected contractual/relationship cost, protecting execution preserves more value.', pnl:{correct:-qty*rescue, wrong:-qty*claim} },
        ],
      };
    },

    () => {
      const qty = 30000;
      const buy = r(78, 86, 1);
      const freight = one([2.8,3.0,3.2,3.4]);
      const sell = round(buy + freight + one([2.2,2.6,3.0,3.4]),1);
      const gross = round(sell - buy - freight,1);
      const hedgeMove = r(4,8,1);
      const creditLimit = r(1800,2400,100)*1000;
      const cargoValue = round(sell*qty,0);
      const demurrageDays = r(2,5);
      const demurrageDay = r(18000,26000,2000);
      const basePnl = round(gross*qty,0);
      return {
        id:'boss-oil-01', desk:'Oil', title:'West Africa Distillate Run', difficulty:3,
        unlock:{ xp:150, lessons:6 }, icon:'GO', accent:'Gasoil',
        brief:`A refinery offers ${qty.toLocaleString('en-US')} bbl of gasoil FOB at $${buy.toFixed(1)}/bbl. A buyer bids $${sell.toFixed(1)}/bbl CIF West Africa. Freight is $${freight.toFixed(1)}/bbl. You must manage the open price, credit and port exposure.`,
        facts:[`Quantity · ${qty.toLocaleString('en-US')} bbl`,`Buy · $${buy.toFixed(1)}/bbl FOB`,`Sell · $${sell.toFixed(1)}/bbl CIF`,`Freight · $${freight.toFixed(1)}/bbl`,`Buyer credit limit · $${(creditLimit/1e6).toFixed(1)}m`],
        basePnl,
        steps:[
          { skill:'trading', type:'numeric', label:'MARGIN', prompt:'What is the initial gross margin per barrel before finance, credit and port costs?', answer:gross, unit:'$/bbl', tolerance:.05,
            why:`${sell.toFixed(1)} − ${buy.toFixed(1)} − ${freight.toFixed(1)} = $${gross.toFixed(1)}/bbl.`, pnl:{correct:0,wrong:0} },
          { skill:'hedging', type:'choice', label:'MARKET', prompt:`You own the cargo at a fixed price and the customer has not fixed its purchase yet. The futures market falls $${hedgeMove}/bbl. Which position would have offset most of the physical loss?`,
            options:['Short futures','Long futures','Long another physical cargo','No hedge can offset flat-price exposure'], answer:0,
            why:'Long physical loses when the market falls; a short futures hedge gains in the same direction as the required offset.', pnl:{correct:0,wrong:-qty*hedgeMove} },
          { skill:'risk', type:'choice', label:'CREDIT', prompt:`The sale value is about $${(cargoValue/1e6).toFixed(2)}m, above the buyer's $${(creditLimit/1e6).toFixed(1)}m credit limit. What is the strongest response before loading?`,
            options:['Obtain additional security / LC or reduce the exposure','Load anyway because the gross margin is positive','Increase payment tenor','Remove the futures hedge'], answer:0,
            why:'A positive trade margin does not compensate for an unapproved counterparty exposure. Security, prepayment or a smaller exposure restores control.', pnl:{correct:0,wrong:-round((cargoValue-creditLimit)*.08,0)} },
          { skill:'operations', type:'choice', label:'PORT', prompt:`Congestion is likely to create ${demurrageDays} demurrage days at $${demurrageDay.toLocaleString('en-US')}/day. You can secure a berth window now for $${round(demurrageDays*demurrageDay*.35,0).toLocaleString('en-US')}. What is economically preferable?`,
            options:['Secure the berth window','Accept the expected demurrage','Cancel the physical sale','Buy more futures'], answer:0,
            why:'The berth reservation costs materially less than the expected demurrage and reduces execution uncertainty.', pnl:{correct:-round(demurrageDays*demurrageDay*.35,0),wrong:-demurrageDays*demurrageDay} },
          { skill:'pricing', type:'choice', label:'BASIS', prompt:'Your futures hedge is flat, but local delivered prices weaken relative to the benchmark. What risk is hurting the deal?',
            options:['Basis risk','Only flat-price risk','No market risk remains','Only interest-rate duration'], answer:0,
            why:'A futures hedge can neutralise benchmark price moves while the local physical differential still changes.', pnl:{correct:0,wrong:-qty*0.5} },
        ],
      };
    },

    () => {
      const qty = 20000;
      const fob = r(390,450,10);
      const freight = r(28,40,2);
      const sell = fob + freight + r(18,34,2);
      const gross = sell-fob-freight;
      const discount = r(8,16,2);
      const storage = r(3,7);
      const basePnl = gross*qty;
      return {
        id:'boss-agri-01', desk:'Agriculture', title:'Black Sea Grain Execution', difficulty:4,
        unlock:{ xp:300, lessons:12 }, icon:'GR', accent:'Grain',
        brief:`You buy ${qty.toLocaleString('en-US')} t of milling wheat FOB at $${fob}/t and sell CFR at $${sell}/t. Freight is $${freight}/t. The deal looks attractive, but documentary, quality and timing decisions will determine the final result.`,
        facts:[`Quantity · ${qty.toLocaleString('en-US')} t`,`Buy · $${fob}/t FOB`,`Sell · $${sell}/t CFR`,`Freight · $${freight}/t`,`Initial spread · $${gross}/t`],
        basePnl,
        steps:[
          { skill:'pricing', type:'numeric', label:'ECONOMICS', prompt:'Calculate the initial gross merchant margin per tonne.', answer:gross, unit:'$/t', tolerance:.05,
            why:`${sell} − ${fob} − ${freight} = $${gross}/t.`, pnl:{correct:0,wrong:0} },
          { skill:'execution', type:'choice', label:'DOCUMENTS', prompt:'The letter of credit requires an original inspection certificate, but the supplier can only provide a scan before the vessel sails. Best action?',
            options:['Resolve the documentary requirement before relying on payment','Load and assume the bank will waive it','Replace the bill of lading with the scan','Ignore the LC because title already transferred'], answer:0,
            why:'Documentary discrepancies can block payment even when the physical cargo is sound. Resolve the requirement before creating an avoidable cash risk.', pnl:{correct:0,wrong:-qty*6} },
          { skill:'operations', type:'choice', label:'QUALITY', prompt:`Pre-loading tests show a parameter near the contractual limit. Independent re-testing costs $1/t; an off-spec outcome could mean a $${discount}/t discount. What should the desk do?`,
            options:['Re-test before loading','Load immediately to save the test cost','Remove the quality clause','Hedge more futures'], answer:0,
            why:'When a low-cost check can prevent a much larger quality claim, verification has positive expected value.', pnl:{correct:-qty*1,wrong:-qty*discount} },
          { skill:'freight', type:'choice', label:'LAYCAN', prompt:`The supplier requests a five-day loading delay. Keeping the vessel waiting would cost about $${storage}/t equivalent. A replacement slot costs $2/t. Best economic choice?`,
            options:['Use the replacement slot','Keep the original vessel waiting','Cancel the customer contract immediately','Ignore the vessel cost because the sale is CFR'], answer:0,
            why:'CFR leaves the seller responsible for arranging main carriage. The lower-cost operational alternative protects the trade margin.', pnl:{correct:-qty*2,wrong:-qty*storage} },
          { skill:'risk', type:'choice', label:'CONCENTRATION', prompt:'Three different buyers on your book all depend on the same discharge terminal. What risk should the desk recognise?',
            options:['Operational/geographic concentration','No concentration because counterparties differ','Only flat-price risk','Only FX translation risk'], answer:0,
            why:'Different counterparties can share one physical chokepoint. A terminal disruption can hit all three exposures at once.', pnl:{correct:0,wrong:-qty*1} },
        ],
      };
    },
  ];

  const bossCatalog = bossDealFactories.map(make => {
    const d = make();
    return { id:d.id, desk:d.desk, title:d.title, difficulty:d.difficulty, unlock:d.unlock, icon:d.icon, accent:d.accent };
  });
  const makeBossDeal = id => {
    const i = bossCatalog.findIndex(x => x.id === id);
    return i >= 0 ? bossDealFactories[i]() : null;
  };

  // Daily Deal: one deterministic, internally consistent scenario per calendar day.
  // The content changes tomorrow, but reopening today recreates exactly the same numbers.
  const makeDailyDeal = dayKey => {
    const seed = hash(`daily:${dayKey}`);
    const i = seed % bossDealFactories.length;
    return withRng(seeded(seed), () => {
      const base = bossDealFactories[i]();
      const steps = base.steps.slice(0, 4);
      return { ...base,
        id:`daily-${dayKey}`,
        sourceBossId:base.id,
        daily:true,
        title:`${base.desk} Desk — ${base.title}`,
        brief:`Today's desk brief. ${base.brief}`,
        steps,
      };
    });
  };
  const dailyMeta = dayKey => {
    const d = makeDailyDeal(dayKey);
    return d ? { id:d.id, desk:d.desk, title:d.title, difficulty:d.difficulty, icon:d.icon, accent:d.accent, steps:d.steps.length } : null;
  };

  window.WOT_GAME = {
    skills, unitMeta, ranks, flashTemplates, randomFlash: () => one(flashTemplates)(),
    bossCatalog, makeBossDeal, makeDailyDeal, dailyMeta,
  };
})();
