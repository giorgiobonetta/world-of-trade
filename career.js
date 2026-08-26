/* World of Trade — career layer
   Metadata and repeatable Flash Trading generators. Kept separate from the
   curated curriculum so the course can grow without coupling game rules to content.
*/
(() => {
  'use strict';
  const r = (a, b, step = 1) => {
    const n = Math.floor(Math.random() * (Math.floor((b - a) / step) + 1));
    return a + n * step;
  };
  const one = a => a[Math.floor(Math.random() * a.length)];
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

  const unitMeta = {
    u1:{ division:'Physical Trading', skill:'trading', chapter:'Merchant Foundations' },
    u2:{ division:'Operations', skill:'operations', chapter:'Merchant Foundations' },
    u3:{ division:'Pricing', skill:'pricing', chapter:'Merchant Foundations' },
    u4:{ division:'Derivatives', skill:'hedging', chapter:'Merchant Foundations' },
    u5:{ division:'Trade Finance', skill:'finance', chapter:'Merchant Foundations' },
    u6:{ division:'Execution', skill:'execution', chapter:'Merchant Foundations' },
    u8:{ division:'Chartering', skill:'freight', chapter:'Merchant Foundations' },
    u7:{ division:'Risk', skill:'risk', chapter:'Merchant Foundations' },
  };

  const ranks = [
    { id:'intern', name:'Intern', xp:0, lessons:0 },
    { id:'graduate-analyst', name:'Graduate Analyst', xp:80, lessons:4 },
    { id:'analyst', name:'Analyst', xp:180, lessons:8 },
    { id:'junior-trader', name:'Junior Trader', xp:320, lessons:14 },
    { id:'trader', name:'Trader', xp:500, lessons:22 },
    { id:'senior-trader', name:'Senior Trader', xp:750, lessons:31 },
    { id:'desk-head', name:'Desk Head', xp:1200, lessons:31 },
    { id:'head-trading', name:'Head of Trading', xp:2000, lessons:31 },
    { id:'partner', name:'Partner', xp:3500, lessons:31 },
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

  window.WOT_GAME = { skills, unitMeta, ranks, flashTemplates, randomFlash: () => one(flashTemplates)() };
})();
