/* World of Trade — Content Engine v1
   Deterministic, validated career content generated from desk knowledge templates.
   This file expands the curated Merchant Foundations without coupling content volume
   to the app engine. Later, an AI service can populate the same validated schema.
*/
(() => {
  'use strict';
  const hash = str => {
    let h = 2166136261 >>> 0;
    for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const rng = seed => {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  const r = (R,a,b,step=1) => a + Math.floor(R() * (Math.floor((b-a)/step)+1))*step;
  const one = (R,a) => a[Math.floor(R()*a.length)];
  const round = (n,d=0) => Number(n.toFixed(d));
  const money = n => `$${Number(n).toLocaleString('en-US')}`;
  const choice = (prompt, options, answer, why) => ({ type:'choice', prompt, options, answer, why });
  const numeric = (prompt, answer, unit, why, tolerance=0) => ({ type:'numeric', prompt, answer, unit, tolerance, why });
  const shuffleChoice = (ex, R) => {
    if (ex?.type !== 'choice') return ex;
    const tagged = ex.options.map((text,i) => ({ text, correct:i === ex.answer }));
    for (let i=tagged.length-1;i>0;i--) { const j=Math.floor(R()*(i+1)); [tagged[i],tagged[j]]=[tagged[j],tagged[i]]; }
    return { ...ex, options:tagged.map(x=>x.text), answer:tagged.findIndex(x=>x.correct) };
  };

  const worlds = [
    {
      id:'a1', title:'Market Analysis & Fundamentals', subtitle:'Read balances, flows, inventories and spreads before the market moves.',
      division:'Market Analysis', skill:'pricing', phase:'Desk Academy I', icon:'◎',
      lessons:['Supply–demand balance','Inventories and days of cover','Term structure signals','Regional arbitrage','Refinery & processing economics','Build a market view'],
      goals:['Translate a balance into price pressure.','Use stocks relative to consumption, not in isolation.','Read contango and backwardation as commercial signals.','Compare netbacks across regions.','Reason from input/output margins.','Combine evidence without confusing view and exposure.'],
      concepts:[
        R => { const demand=r(R,90,130), supply=demand+r(R,-8,8); const bal=supply-demand; return numeric(`Demand is ${demand} Mt and supply is ${supply} Mt. What is the market balance (supply − demand)?`,bal,'Mt',`${supply} − ${demand} = ${bal} Mt. Positive is surplus; negative is deficit.`); },
        R => choice('All else equal, a persistent supply deficit tends to…',['Pressure inventories lower and support price','Guarantee lower prices','Eliminate freight','Remove basis risk'],0,'A deficit must be met from inventories or demand destruction, which usually tightens the market.'),
        R => { const stocks=r(R,24,60,4), annual=r(R,180,420,20); const daily=annual/365, days=round(stocks/daily,1); return numeric(`Stocks are ${stocks} Mt and annual demand is ${annual} Mt. Approximate days of cover?`,days,'days',`${stocks} ÷ (${annual} ÷ 365) = ${days} days of cover.`,.1); },
        R => choice('Nearby futures above deferred futures is called…',['Backwardation','Contango','Par value','Open account'],0,'Backwardation is an inverted curve: nearby value exceeds deferred value.'),
        R => choice('A steep contango can economically reward…',['Storage, if carry costs are below the spread','Immediate disposal at any price','Ignoring financing','Buying freight futures only'],0,'If the deferred premium exceeds storage, finance and losses, storing and carrying inventory can be attractive.'),
        R => { const dest=r(R,680,860,10), freight=r(R,25,55,5), handling=r(R,4,12); const nb=dest-freight-handling; return numeric(`Destination value is $${dest}/t. Freight $${freight}/t and handling $${handling}/t. What is the implied origin netback?`,nb,'$/t',`${dest} − ${freight} − ${handling} = $${nb}/t.`); },
        R => choice('Two markets show the same benchmark price, but one has much higher freight to reach your buyer. Which matters for the physical decision?',['Delivered economics / netback','Only the screen benchmark','Only the currency symbol','Nothing; freight is operational only'],0,'Physical arbitrage is decided by all-in delivered economics, not the headline benchmark alone.'),
        R => { const product=r(R,700,900,10), feed=r(R,600,760,10), cost=r(R,25,55,5); const margin=product-feed-cost; return numeric(`Product value $${product}/t, feedstock $${feed}/t, processing cost $${cost}/t. Simple processing margin?`,margin,'$/t',`${product} − ${feed} − ${cost} = $${margin}/t.`); },
        R => choice('A bullish market view and a long physical exposure are…',['Different: one is an opinion, one is a risk position','Always identical','Both accounting terms','Only relevant after settlement'],0,'A view is a belief. Exposure is what your P&L actually does when the market moves.'),
        R => choice('A strong analysis note should separate facts, assumptions and conclusions because…',['It makes the reasoning auditable and easier to update','It guarantees the forecast','It removes uncertainty','It avoids using data'],0,'Separating evidence from assumptions makes a market view testable instead of narrative-only.')
      ]
    },
    {
      id:'a2', title:'Commercial Trading', subtitle:'Structure optionality, calculate true margins and protect the economics of the deal.',
      division:'Physical Trading', skill:'trading', phase:'Desk Academy I', icon:'↔',
      lessons:['All-in margin','Optionality has value','Timing and QP risk','Location arbitrage','Portfolio thinking','Trader judgement'],
      goals:['Move from headline spread to true contribution.','Recognise free options hidden in contracts.','Understand quotation periods and timing mismatch.','Compare routes on delivered economics.','Manage several deals as one book.','Choose risk-adjusted margin over cosmetic volume.'],
      concepts:[
        R => { const sell=r(R,720,980,10), buy=sell-r(R,45,95,5), freight=r(R,15,35,5), finance=r(R,4,14); const m=sell-buy-freight-finance; return numeric(`Sell $${sell}/t, buy $${buy}/t, freight $${freight}/t, finance $${finance}/t. Net trading margin?`,m,'$/t',`${sell} − ${buy} − ${freight} − ${finance} = $${m}/t.`); },
        R => choice('A buyer may choose the pricing month after shipment, while your purchase month is fixed. That clause gives the buyer…',['Pricing optionality that creates risk for you','Free freight only','Title to your hedge account','No economic value'],0,'The buyer controls timing of price fixation while you carry the mismatch; that option has economic value.'),
        R => choice('Which trade is usually better, all else equal?',['$18/t margin for 20 days of capital use','$20/t margin for 120 days of capital use','Whichever has the bigger invoice','Whichever has more counterparties'],0,'Return on capital and time matter. A slightly smaller margin can be far better if capital turns much faster.'),
        R => { const margin=r(R,12,28), qty=r(R,20,80,10)*1000; return numeric(`Margin is $${margin}/t on ${qty.toLocaleString('en-US')} t. Gross contribution?`,margin*qty,'$',`${margin} × ${qty.toLocaleString('en-US')} = ${money(margin*qty)}.`); },
        R => choice('You can buy FOB A or FOB B. What should decide the origin choice for a fixed CIF sale?',['Highest net margin after freight, quality, finance and execution costs','Lowest FOB price only','Shortest supplier name','Highest benchmark'],0,'A lower FOB price can be worse if freight, quality or execution costs more than offset it.'),
        R => choice('Why can “more volume” reduce desk quality?',['It may consume limits and working capital for poor risk-adjusted return','Volume always increases margin','It eliminates concentration','It reduces operational workload'],0,'Scarce capital, limits and operational capacity should be allocated to the best risk-adjusted opportunities.'),
        R => { const gross=r(R,30,65,5), claim=r(R,4,16,2), dem=r(R,2,10,2), fx=r(R,-5,5); const net=gross-claim-dem+fx; return numeric(`Gross margin $${gross}/t, quality claim $${claim}/t, demurrage $${dem}/t, FX impact ${fx>=0?'+':''}$${fx}/t. Final margin?`,net,'$/t',`${gross} − ${claim} − ${dem} ${fx>=0?'+':'−'} ${Math.abs(fx)} = $${net}/t.`); },
        R => choice('A good trader should treat an unpriced operational risk as…',['A potential cost to be understood before quoting','Free upside','Someone else’s problem','A reason to ignore the trade'],0,'Commercial pricing should reflect risks you actually retain, even if the final amount is uncertain.'),
        R => choice('If two deals have equal expected profit, prefer the one with…',['Lower downside and lower capital/limit usage','Higher notional value','More complex documentation','Longer settlement'],0,'Expected profit alone is incomplete; downside, liquidity and capital efficiency matter.'),
        R => choice('The core question before accepting a physical trade is…',['What risks remain after I lock the headline spread?','Will the benchmark rise?','Can I make the invoice larger?','Can I avoid operations entirely?'],0,'The merchant margin only survives if the residual risks are identified and priced.')
      ]
    },
    {
      id:'a3', title:'Freight & Chartering', subtitle:'Turn vessel quotes, laytime and route choices into commercial decisions.',
      division:'Chartering', skill:'freight', phase:'Desk Academy I', icon:'▰',
      lessons:['Voyage economics','Laycan & readiness','Laytime and demurrage','Time charter thinking','Route optimisation','Freight risk management'],
      goals:['Calculate freight per tonne.','Understand arrival windows.','Price delay in port.','Translate hire into voyage economics.','Compare routes and vessel choices.','Recognise freight as a market risk.'],
      concepts:[
        R => { const lump=r(R,450,1200,50)*1000, qty=r(R,20,60,5)*1000; const pt=round(lump/qty,2); return numeric(`Voyage freight is ${money(lump)} for ${qty.toLocaleString('en-US')} t. Freight per tonne?`,pt,'$/t',`${money(lump)} ÷ ${qty.toLocaleString('en-US')} = $${pt}/t.`,.02); },
        R => choice('Laycan is…',['The contractual arrival/loading window for the vessel','The maximum credit line','The futures delivery month','A quality tolerance'],0,'Laycan defines when the vessel must be ready to load under the charter.'),
        R => { const excess=r(R,1,5), rate=r(R,12,30,2)*1000; return numeric(`${excess} days exceed allowed laytime. Demurrage is ${money(rate)}/day. Cost?`,excess*rate,'$',`${excess} × ${money(rate)} = ${money(excess*rate)}.`); },
        R => choice('A vessel arrives before laycan. Must the charterer automatically start laytime?',['Not necessarily; contractual terms and valid NOR matter','Always','Never','Only if futures are hedged'],0,'Arrival alone is not enough; laytime depends on the charter wording and valid notice/readiness conditions.'),
        R => { const hire=r(R,14,28,2)*1000, days=r(R,20,45,5), bunkers=r(R,250,650,50)*1000; const cost=hire*days+bunkers; return numeric(`Time-charter hire ${money(hire)}/day for ${days} days plus bunkers ${money(bunkers)}. Approximate voyage vessel cost?`,cost,'$',`${money(hire)} × ${days} + ${money(bunkers)} = ${money(cost)}.`); },
        R => choice('For a fixed CIF sale, an unfixed freight rate is economically…',['A short freight-margin exposure: higher freight hurts you','Risk-free','A long commodity futures hedge','Only the buyer’s risk'],0,'You fixed the delivered sale price but not the transport cost, so rising freight erodes your margin.'),
        R => choice('Why might a larger vessel be worse despite a lower $/t headline rate?',['Port restrictions or deadfreight can destroy the saving','Large vessels have no fuel cost','They remove laycan','They eliminate credit risk'],0,'The vessel must fit the parcel, ports, draft and timing; headline freight is not the only constraint.'),
        R => { const qty=r(R,25,55,5)*1000, old=r(R,28,42,2), shock=r(R,4,12,2); return numeric(`You sold CIF on ${qty.toLocaleString('en-US')} t with freight budget $${old}/t. Market freight rises by $${shock}/t before fixing. P&L impact?`,-qty*shock,'$',`The extra freight cost is ${qty.toLocaleString('en-US')} × $${shock} = ${money(qty*shock)} loss.`); },
        R => choice('Deadfreight is typically associated with…',['Cargo quantity shortfall versus charter commitment','Late buyer payment','Futures margin calls','Quality premiums'],0,'If the charterer supplies less cargo than contracted, the owner may claim freight on the unused capacity.'),
        R => choice('The freight decision belongs at quotation time because…',['Transport can determine whether the trade has any margin at all','Shipping is always fixed later at zero risk','Freight never changes','Only operations sees freight'],0,'Delivered commodity economics and shipping economics are inseparable on a physical trade.')
      ]
    },
    {
      id:'a4', title:'Trade Finance & Credit', subtitle:'Control working capital, payment security, limits and counterparty exposure.',
      division:'Trade Finance', skill:'finance', phase:'Desk Academy II', icon:'▣',
      lessons:['Working capital','Letters of credit','Counterparty limits','Payment timing','Borrowing base logic','Credit-adjusted trading'],
      goals:['Calculate funding cost.','Understand documentary payment security.','Use limits as scarce capacity.','Price payment terms.','Think in collateral and advance rates.','Compare margin after credit cost.'],
      concepts:[
        R => { const value=r(R,2,10)*1000000, days=r(R,30,120,15), rate=one(R,[5,6,7,8]); const interest=round(value*(rate/100)*(days/360)); return numeric(`You fund ${money(value)} of cargo for ${days} days at ${rate}% a year, on a 360-day basis. What is the interest cost?`,interest,'$',`${money(value)} × ${rate}% × ${days}/360 ≈ ${money(interest)}.`,2); },
        R => choice('A documentary letter of credit primarily helps the seller by…',['Substituting bank documentary payment risk for pure buyer open-account risk','Fixing commodity price','Guaranteeing cargo quality','Fixing freight'],0,'A compliant LC can materially improve payment security, but only if documents meet its conditions.'),
        R => { const limit=r(R,6,15)*1000000, used=r(R,1,5)*1000000; const avail=limit-used; return numeric(`Counterparty limit ${money(limit)}, current exposure ${money(used)}. Remaining headroom?`,avail,'$',`${money(limit)} − ${money(used)} = ${money(avail)}. Headroom is what you can still trade with them before the limit stops you.`); },
        R => choice('Selling 60 days open account instead of cash against documents should normally…',['Have a price/credit cost because you finance and expose yourself longer','Be economically identical','Reduce exposure to zero','Eliminate working capital'],0,'Longer unsecured terms use capital and increase default exposure.'),
        R => { const inv=r(R,4,12)*1000000, advance=one(R,[70,75,80,85,90]); const loan=inv*advance/100; return numeric(`Eligible inventory is ${money(inv)} and borrowing-base advance rate is ${advance}%. Maximum borrowing against it?`,loan,'$',`${money(inv)} × ${advance}% = ${money(loan)}.`); },
        R => choice('A credit limit is best thought of as…',['Scarce risk capacity, not a sales target','Guaranteed profit','A recommendation to use all exposure','A futures position'],0,'Limits cap acceptable exposure. Using them consumes scarce capacity that should earn enough return.'),
        R => { const margin=r(R,20,50,5), value=r(R,700,900,20), extra=r(R,30,90,15), rate=one(R,[6,7,8]); const cost=round(value*(rate/100)*(extra/360),2); return numeric(`A sale earns $${margin}/t but adds ${extra} days of financing on $${value}/t at ${rate}% p.a. Incremental finance cost per tonne?`,cost,'$/t',`${value} × ${rate}% × ${extra}/360 ≈ $${cost}/t.`,.02); },
        R => choice('Which event can create a margin call even when your physical trade is economically hedged?',['Futures move against the hedge before physical cash is received','A perfectly matched cash settlement at the same instant','A signed invoice','A quality certificate'],0,'Hedges can create liquidity needs before offsetting physical cash arrives. Economic hedge does not mean zero funding risk.'),
        R => choice('Documents under an LC are discrepant. The key risk is…',['The bank may refuse or delay payment','The commodity benchmark becomes invalid','The vessel becomes larger','Interest rates become zero'],0,'Documentary compliance is central to LC payment.'),
        R => choice('Best credit-adjusted trade is usually…',['The one with strong margin relative to expected loss, capital and limit use','The one with the longest payment terms','The largest notional','The buyer with no financial information'],0,'Commercial return must be assessed after credit and capital costs, not before them.')
      ]
    },
    {
      id:'a5', title:'Risk Management', subtitle:'Measure exposures, stress the book and stop concentration from becoming catastrophe.',
      division:'Risk', skill:'risk', phase:'Desk Academy II', icon:'△',
      lessons:['Position and exposure','VaR correctly used','Stress testing','Basis & correlation risk','Liquidity risk','Limits and escalation'],
      goals:['Net physical and paper positions.','Interpret VaR as a percentile.','Look beyond historical volatility.','Identify imperfect hedges.','See cash as a risk constraint.','Know when to stop or escalate.'],
      concepts:[
        R => { const phys=r(R,60,140,10)*1000, short=r(R,20,100,10)*1000; return numeric(`Long physical ${phys.toLocaleString('en-US')} t and short futures ${short.toLocaleString('en-US')} t. Net flat-price exposure?`,phys-short,'t',`${phys.toLocaleString('en-US')} − ${short.toLocaleString('en-US')} = ${(phys-short).toLocaleString('en-US')} t net long.`); },
        R => choice('A one-day 99% VaR of $3m means…',['Under the model, losses exceed $3m on roughly 1% of days','Maximum possible loss is $3m','You lose $3m every 100 days exactly','Annual profit is $3m'],0,'VaR is a percentile threshold under modelling assumptions, not a maximum-loss bound.'),
        R => choice('Why run stress tests if you already have VaR?',['To examine severe scenarios and risks not well represented by normal history','Because VaR is an accounting rule only','To guarantee profit','To remove basis'],0,'Stress tests explore tail moves, broken correlations and specific operational/market shocks.'),
        R => choice('You hedge a physical grade with a related but different futures contract. The residual is mainly…',['Basis/correlation risk','No risk','Only invoice risk','Only vessel risk'],0,'An imperfect proxy hedge leaves risk that physical and futures values diverge.'),
        R => { const cash=r(R,10,30)*1000000, call=r(R,4,12)*1000000, other=r(R,3,10)*1000000; return numeric(`Available liquidity ${money(cash)}. Margin call ${money(call)} and other near-term cash needs ${money(other)}. Liquidity headroom?`,cash-call-other,'$',`${money(cash)} − ${money(call)} − ${money(other)} = ${money(cash-call-other)}.`); },
        R => choice('A profitable book can still fail because of…',['Liquidity: cash may be needed before profits are realised','Profit automatically creates cash instantly','Hedging removes all timing','Accounting profit is legal tender'],0,'Timing matters. Margin calls and supplier payments can arrive before customer receipts.'),
        R => choice('Ten exposures with different customer names but the same terminal create…',['Operational/geographic concentration','Perfect diversification','No common risk','Only currency risk'],0,'Shared chokepoints create correlated losses despite different legal counterparties.'),
        R => { const limit=r(R,50,100,10)*1000, exposure=limit+r(R,10,40,10)*1000; return numeric(`Desk net-long limit ${limit.toLocaleString('en-US')} t; current net-long ${exposure.toLocaleString('en-US')} t. Minimum reduction needed?`,exposure-limit,'t',`${exposure.toLocaleString('en-US')} − ${limit.toLocaleString('en-US')} = ${(exposure-limit).toLocaleString('en-US')} t.`); },
        R => choice('When a hard risk limit is breached, the correct first principle is…',['Escalate and reduce/authorise exposure according to governance','Hide the position until market recovers','Double down','Change the spreadsheet limit'],0,'Limits only work when breaches trigger transparent governance and action.'),
        R => choice('A good hedge should be assessed on…',['What risk it removes and what residual risks it creates','Whether it made money alone','Whether futures rose','The broker logo'],0,'Hedge P&L in isolation is misleading; the combined physical-plus-hedge position is what matters.')
      ]
    },
    {
      id:'a6', title:'Derivatives & Options', subtitle:'Use futures, swaps and options as tools for commercial risk—not casino bets.',
      division:'Derivatives', skill:'hedging', phase:'Desk Academy II', icon:'⇄',
      lessons:['Futures hedge mechanics','Basis after hedging','Swaps and fixed pricing','Options as insurance','Greeks intuition','Hedge design'],
      goals:['Match hedge direction to physical exposure.','Know what flat-price hedge leaves behind.','Translate fixed/floating obligations.','Understand asymmetric protection.','Read delta as sensitivity.','Design the hedge around the contract.'],
      concepts:[
        R => choice('Long physical inventory exposed to a price fall is commonly hedged by…',['Selling futures','Buying futures','Selling the cargo twice','Buying freight only'],0,'Short futures offset the downside of long physical flat-price exposure.'),
        R => { const qty=r(R,10,50,5)*1000, move=r(R,5,20); return numeric(`You are short futures on ${qty.toLocaleString('en-US')} t and futures rise $${move}/t. Futures P&L?`,-qty*move,'$',`A short loses when price rises: ${qty.toLocaleString('en-US')} × $${move} = ${money(qty*move)} loss.`); },
        R => choice('After a good futures hedge, which risk may remain?',['Physical basis and timing mismatch','No risk of any kind','Only tax','Only logo risk'],0,'Futures hedge the benchmark exposure they match; physical differential and timing can still move.'),
        R => choice('A fixed-price purchase plus a floating-price sale leaves you primarily…',['Long flat price until the sale is fixed','Short flat price','Perfectly flat by definition','Only exposed to freight'],0,'You have locked the cost but not the revenue benchmark, so falling prices can hurt.'),
        R => choice('Buying a put option gives you…',['Downside protection with upside retained, in exchange for premium','A mandatory short futures position','Guaranteed profit','Free insurance'],0,'A put creates a floor-like payoff but the option premium is the cost of that asymmetry.'),
        R => { const qty=r(R,10,40,5)*1000, premium=r(R,3,12), returnVal=qty*premium; return numeric(`Put premium is $${premium}/t on ${qty.toLocaleString('en-US')} t. Upfront option premium cost?`,returnVal,'$',`${qty.toLocaleString('en-US')} × $${premium} = ${money(returnVal)}.`); },
        R => choice('An option delta of +0.40 means, approximately…',['Option value changes about $0.40 for a $1 underlying move, locally','40% probability of profit exactly','40 days to expiry','Premium is 40%'],0,'Delta is a local price sensitivity, not an exact probability or time measure.'),
        R => choice('Why can hedge ratios be less than 100%?',['Quantity, quality, timing or correlation may not match perfectly','Because futures cannot be sold','Because hedging is illegal','To guarantee speculation'],0,'The economically appropriate hedge depends on the exposure actually being offset.'),
        R => choice('A swap is useful when you want to…',['Exchange floating price exposure for fixed (or vice versa)','Move the physical cargo','Issue a bill of lading','Inspect quality'],0,'Commodity swaps commonly transform price index exposure without moving physical goods.'),
        R => choice('Best hedge design starts from…',['The commercial contract and its exact pricing exposure','A favourite technical indicator','Maximum derivative notional','The exchange with most colours'],0,'You hedge the risk created by the physical contract—not an abstract market view.')
      ]
    },
    {
      id:'a7', title:'Metals Desk', subtitle:'Trade LME-linked material, premiums, warehouse economics and concentrates.',
      division:'Metals', skill:'trading', phase:'Commodity Desks', icon:'Cu',
      lessons:['LME + premium','Regional premiums','Warehouse economics','Concentrates & TC/RC','Hedging metal units','Metals desk case'],
      goals:['Separate exchange price from physical premium.','Read location premium moves.','Understand carry and warrants.','Translate treatment charges.','Match metal units to hedges.','Combine pricing, freight and credit.'],
      concepts:[
        R => { const lme=r(R,8000,10000,100), prem=r(R,100,350,25); return numeric(`Copper LME is $${lme}/t and physical premium is $${prem}/t. All-in metal price?`,lme+prem,'$/t',`${lme} + ${prem} = $${lme+prem}/t.`); },
        R => choice('If LME is unchanged but the regional physical premium rises, the local market has…',['Tightened relative to the benchmark','Become risk-free','Lost all basis','Automatically entered contango'],0,'Physical premiums capture local availability, logistics and demand beyond the exchange benchmark.'),
        R => choice('An exchange warehouse warrant represents…',['Title/control rights to exchange-approved metal in a registered warehouse','A freight invoice','A bank loan','A mine permit'],0,'Warrants are central to exchange warehouse delivery mechanics.'),
        R => { const tonnes=r(R,5,20)*1000, tc=r(R,40,100,10); return numeric(`A concentrate contract has a treatment charge of $${tc}/dry metric tonne on ${tonnes.toLocaleString('en-US')} dmt. Gross TC amount?`,tonnes*tc,'$',`${tonnes.toLocaleString('en-US')} × $${tc} = ${money(tonnes*tc)}.`); },
        R => choice('Higher TC/RC, all else equal, is generally more favourable to…',['The smelter/refiner','The mine selling concentrate','The shipowner only','The futures exchange'],0,'Treatment/refining charges are deductions paid to the processor for converting concentrate into refined metal.'),
        R => { const qty=r(R,2,10)*1000, premBuy=r(R,80,160,10), premSell=premBuy+r(R,40,100,10), freight=r(R,15,35,5); return numeric(`Buy LME + $${premBuy}/t, sell LME + $${premSell}/t, freight $${freight}/t. Premium margin?`,premSell-premBuy-freight,'$/t',`${premSell} − ${premBuy} − ${freight} = $${premSell-premBuy-freight}/t.`); },
        R => choice('A trader long physical copper priced off LME but hedged short LME can still lose if…',['The physical premium collapses','LME moves while hedge matches perfectly','The contract exists','The warehouse is approved'],0,'The exchange hedge can offset LME flat price but not the physical premium/basis.'),
        R => choice('Why do location and warehouse queues matter in metals?',['They affect when/where metal is economically available and therefore premiums','They change atomic weight','They eliminate finance costs','They fix FX'],0,'Physical availability and exit costs can make the same benchmark metal worth different amounts by location.'),
        R => choice('A quotation period (QP) mismatch between purchase and sale creates…',['Pricing timing exposure','No exposure if tonnage matches','Only vessel risk','Only quality risk'],0,'The benchmark can average over different windows, creating residual price risk even on matched tonnes.'),
        R => choice('The metals desk should quote a premium only after considering…',['Freight, finance, warehouse, QP and credit economics','LME alone','Mine name alone','Only nominal tonnage'],0,'Physical premium is the residual economics around the exchange benchmark.')
      ]
    },
    {
      id:'a8', title:'Oil & Products Desk', subtitle:'Read crude/product differentials, cracks, inventories and cargo timing.',
      division:'Oil & Products', skill:'pricing', phase:'Commodity Desks', icon:'BR',
      lessons:['Crude differentials','Crack spreads','Prompt structure','Cargo pricing windows','Blending economics','Products desk case'],
      goals:['Price crude around benchmarks.','Use simple crack intuition.','Read prompt tightness.','Understand pricing-window mismatch.','Value components in blending.','Combine margin and timing.'],
      concepts:[
        R => { const brent=r(R,65,95), diff=r(R,-8,5); return numeric(`Brent is $${brent}/bbl and a crude trades Brent ${diff>=0?'+':''}$${diff}/bbl. Crude price?`,brent+diff,'$/bbl',`${brent} ${diff>=0?'+':'−'} ${Math.abs(diff)} = $${brent+diff}/bbl.`); },
        R => { const crude=r(R,65,95), cost=r(R,4,10), margin=r(R,5,18); const product=crude+cost+margin; return numeric(`Product value $${product}/bbl, crude $${crude}/bbl, variable refining cost $${cost}/bbl. Simple gross product-minus-feed margin?`,margin,'$/bbl',`${product} − ${crude} − ${cost} = $${margin}/bbl.`); },
        R => choice('Strong backwardation in crude often signals…',['Prompt barrels are relatively valuable/tight','Storage is always free money','No inventory value','Deferred demand is certain'],0,'Backwardation reflects a premium on prompt availability relative to later delivery.'),
        R => choice('A physical crude differential can move even if Brent is unchanged because…',['Quality, location and prompt supply-demand change','Benchmark fixes every physical price','Only FX can move','Differentials are legally fixed'],0,'Physical grades trade at changing differentials to benchmarks.'),
        R => { const qty=r(R,300,800,50)*1000, diffMove=r(R,1,4); return numeric(`You own ${qty.toLocaleString('en-US')} bbl of a grade whose differential weakens by $${diffMove}/bbl versus the benchmark. Approximate basis P&L?`,-qty*diffMove,'$',`${qty.toLocaleString('en-US')} × $${diffMove} = ${money(qty*diffMove)} loss.`); },
        R => choice('Why does a pricing-window mismatch matter in oil cargoes?',['Purchase and sale benchmark averages can diverge over different days','Oil cannot be hedged','Freight becomes zero','Quality ceases to matter'],0,'Different pricing windows create temporal basis risk.'),
        R => choice('Blending is economically attractive when…',['The value of the resulting specification exceeds component and processing/logistics costs','Components are always more expensive','No specs exist','It increases volume regardless of quality'],0,'Blending monetises quality differences only if the finished product’s value covers all inputs and constraints.'),
        R => { const cargo=r(R,400,800,50)*1000, freight=r(R,1,4); return numeric(`Ocean freight changes by $${freight}/bbl on a ${cargo.toLocaleString('en-US')} bbl cargo. P&L impact?`,-cargo*freight,'$',`Higher freight costs ${cargo.toLocaleString('en-US')} × $${freight} = ${money(cargo*freight)}.`); },
        R => choice('A refinery outage near your destination can affect…',['Local product cracks, inventories and physical premiums','Only accounting','Only vessel paint','Nothing until annual reports'],0,'Operational outages change regional supply-demand quickly.'),
        R => choice('Oil desk profitability should be decomposed into…',['Benchmark, differential/basis, freight, timing, finance and execution','Benchmark direction only','Volume only','Invoice currency only'],0,'Physical P&L is multi-factor; decomposition reveals where value was made or lost.')
      ]
    },
    {
      id:'a9', title:'Gas & LNG Desk', subtitle:'Connect hubs, liquefaction, shipping, regas and destination optionality.',
      division:'Gas & LNG', skill:'pricing', phase:'Commodity Desks', icon:'LNG',
      lessons:['Hub pricing','LNG netbacks','Shipping economics','Destination optionality','Storage & seasonality','LNG desk case'],
      goals:['Translate hub prices.','Calculate delivered LNG netbacks.','See freight as part of arbitrage.','Value the right to redirect cargo.','Understand seasonal carry.','Combine hub, freight and terminal constraints.'],
      concepts:[
        R => { const ttf=r(R,25,55), basis=r(R,-6,8); return numeric(`TTF is €${ttf}/MWh and a contract is TTF ${basis>=0?'+':''}€${basis}/MWh. Contract price?`,ttf+basis,'€/MWh',`${ttf} ${basis>=0?'+':'−'} ${Math.abs(basis)} = €${ttf+basis}/MWh.`); },
        R => { const dest=r(R,12,22), shipping=r(R,1,4), regas=r(R,0.5,1.5,.5); const nb=round(dest-shipping-regas,1); return numeric(`Destination LNG value $${dest}/MMBtu, shipping $${shipping}/MMBtu, regas $${regas}/MMBtu. Netback before source cost?`,nb,'$/MMBtu',`${dest} − ${shipping} − ${regas} = $${nb}/MMBtu.`,.05); },
        R => choice('Destination optionality in LNG is valuable because…',['The cargo can be redirected toward the best netback, subject to contract/logistics','It eliminates boil-off','It guarantees higher gas prices','It removes credit risk'],0,'The right to redirect lets the trader respond to regional price spreads.'),
        R => choice('An LNG arbitrage can close even if destination gas price is unchanged when…',['Shipping or terminal costs rise enough','The ship changes name','Benchmark unit changes','Storage becomes physical'],0,'Delivered arbitrage depends on the full logistics chain, not destination price alone.'),
        R => { const qty=r(R,2,4)*1000000, spread=r(R,1,4); return numeric(`A ${qty.toLocaleString('en-US')} MMBtu cargo has a destination spread of $${spread}/MMBtu before incremental logistics. Gross spread value?`,qty*spread,'$',`${qty.toLocaleString('en-US')} × $${spread} = ${money(qty*spread)}.`); },
        R => choice('Gas seasonality makes storage valuable when…',['The forward seasonal spread covers storage, losses and funding','Summer price is always above winter','Storage has no cost','Hubs cannot be hedged'],0,'Storage monetises time spreads only after carry costs.'),
        R => choice('Boil-off is economically relevant because…',['Some LNG volume is consumed/lost during transport','It fixes benchmark basis','It creates free cargo','It eliminates freight'],0,'Voyage losses affect delivered quantity and economics.'),
        R => choice('Pipeline capacity constraints primarily create…',['Locational basis between connected hubs','Zero volatility','Guaranteed convergence at all times','Only credit risk'],0,'When transport is constrained, regional prices can separate sharply.'),
        R => choice('A hub hedge may not fully hedge an LNG cargo because…',['Cargo value also depends on location, timing, freight and terminal economics','Gas has no benchmark','Futures cannot move','LNG is not physical'],0,'The hub benchmark is only one component of delivered LNG value.'),
        R => choice('Before diverting an LNG cargo, the desk should compare…',['Incremental destination netbacks after shipping, terminal and contractual costs','Only headline hub prices','Only voyage distance','Only buyer size'],0,'Diversion decisions are marginal netback calculations under operational constraints.')
      ]
    },
    {
      id:'a10', title:'Power Desk', subtitle:'Trade shape, location, balancing and generation economics in a non-storable market.',
      division:'Power', skill:'risk', phase:'Commodity Desks', icon:'MW',
      lessons:['Baseload & peakload','Shape risk','Spark spreads','Location & congestion','Balancing exposure','Power desk case'],
      goals:['Convert MW blocks to MWh.','See why hourly shape matters.','Link fuel and power economics.','Understand congestion basis.','Control imbalance.','Trade a portfolio, not just an average price.'],
      concepts:[
        R => { const mw=r(R,10,100,10), hours=r(R,12,48,12); return numeric(`${mw} MW delivered flat for ${hours} hours equals how many MWh?`,mw*hours,'MWh',`${mw} × ${hours} = ${mw*hours} MWh.`); },
        R => choice('A monthly baseload hedge can leave risk for an hourly-shaped retail load because…',['The customer consumes different volumes by hour while the hedge is flat','Electricity can be stored freely','Baseload has no price','Retail demand never changes'],0,'Shape mismatch creates residual exposure even if monthly average volume matches.'),
        R => { const power=r(R,80,140,10), gas=r(R,25,55,5), heat=2, carbon=r(R,5,20,5); return numeric(`Power €${power}/MWh, gas €${gas}/MWh(th), heat rate ${heat} MWh(th)/MWh(e), carbon/other €${carbon}/MWh. Simple spark margin?`,power-gas*heat-carbon,'€/MWh',`${power} − ${gas}×${heat} − ${carbon} = €${power-gas*heat-carbon}/MWh.`); },
        R => choice('Congestion between two power zones can create…',['Persistent locational basis','Guaranteed identical prices','Only credit differences','No trading relevance'],0,'Transmission constraints can separate zonal prices.'),
        R => choice('Balancing risk arises when…',['Actual generation/consumption differs from the nominated or hedged position','Monthly price is fixed','The invoice is paid','A vessel is late'],0,'Power systems must balance in real time; deviations are settled at imbalance prices.'),
        R => { const dev=r(R,5,25), hours=r(R,2,8), price=r(R,100,250,25); return numeric(`You are short ${dev} MW for ${hours} hours and imbalance power costs €${price}/MWh. Gross imbalance cost?`,dev*hours*price,'€',`${dev} × ${hours} × €${price} = €${(dev*hours*price).toLocaleString('en-US')} cost.`); },
        R => choice('Why is optional generation capacity valuable in power?',['It can respond to high-price hours if variable cost is below market price','It guarantees zero fuel cost','It removes grid constraints','It fixes demand'],0,'Dispatch optionality monetises volatile hourly spreads.'),
        R => choice('A renewable portfolio has volume risk because…',['Wind/solar output is uncertain and can differ from hedge volumes','Renewables have fixed output','Power prices never go negative','Forecast errors settle at zero'],0,'Forecast error creates imbalance and replacement exposure.'),
        R => choice('A negative power price can occur when…',['Inflexible supply and constraints meet low demand/high renewable output','All generation costs are negative','Demand is infinite','Power is easily stored at zero cost'],0,'Non-storability, constraints and inflexibility can force prices below zero.'),
        R => choice('For power, “same monthly MWh” does not guarantee an economic hedge because…',['The hours in which MWh occur can have very different prices','Every hour has one fixed price','Location never matters','Fuel is irrelevant'],0,'Shape and timing are central to power value.')
      ]
    },
    {
      id:'a11', title:'Agriculture Desk', subtitle:'Trade crops through seasonality, quality, storage, freight and basis.',
      division:'Agriculture', skill:'operations', phase:'Commodity Desks', icon:'AG',
      lessons:['Crop balances','Basis & seasonality','Storage carry','Quality & inspection','Freight and laycan','Agri desk case'],
      goals:['Read crop supply-demand.','Separate futures from local basis.','Calculate carry economics.','Protect specifications.','Manage seasonal logistics.','Combine basis, quality and freight.'],
      concepts:[
        R => choice('A bumper crop, all else equal, tends to…',['Increase available supply and pressure local basis/price','Guarantee backwardation','Eliminate storage','Raise freight to infinity'],0,'More supply relative to demand usually loosens the market, though logistics can modify local effects.'),
        R => { const fut=r(R,220,320,10), basis=r(R,-25,25,5); return numeric(`Futures are $${fut}/t and local basis is ${basis>=0?'+':''}$${basis}/t. Physical cash price?`,fut+basis,'$/t',`${fut} ${basis>=0?'+':'−'} ${Math.abs(basis)} = $${fut+basis}/t.`); },
        R => { const spread=r(R,8,25), storage=r(R,3,10), finance=r(R,2,8); return numeric(`Deferred premium $${spread}/t, storage $${storage}/t, finance $${finance}/t. Net carry before losses?`,spread-storage-finance,'$/t',`${spread} − ${storage} − ${finance} = $${spread-storage-finance}/t.`); },
        R => choice('Why is pre-shipment quality inspection valuable in grains?',['Off-spec cargo can trigger rejection, discount or claims','Futures guarantee protein','Quality never changes value','Inspection fixes freight'],0,'Physical specifications directly affect acceptance and value.'),
        R => choice('Harvest season can create simultaneous pressure on…',['Storage, inland logistics and export terminal capacity','Only derivatives margin','Only bank capital','Nothing operational'],0,'Large seasonal flows stress the physical chain and can move local basis.'),
        R => { const qty=r(R,20,60,5)*1000, discount=r(R,5,20); return numeric(`${qty.toLocaleString('en-US')} t is accepted with a $${discount}/t quality discount. P&L impact?`,-qty*discount,'$',`${qty.toLocaleString('en-US')} × $${discount} = ${money(qty*discount)} loss.`); },
        R => choice('A futures hedge on wheat can leave local elevator basis risk because…',['Local cash conditions can diverge from the exchange contract','Futures set every local price exactly','Basis is fixed by law','Freight is included in futures'],0,'Local supply, transport and quality can move basis independently.'),
        R => choice('If a vessel misses a seasonal export window, the desk may face…',['Demurrage, storage, contract delay and basis changes','Only a cosmetic issue','Automatic futures profit','No cash effect'],0,'Timing disruptions can hit several parts of the physical P&L at once.'),
        R => choice('A crop forecast is most useful when paired with…',['Demand, stocks, logistics and uncertainty ranges','One price target only','A single social-media post','No historical context'],0,'Production alone does not determine balance or price.'),
        R => choice('The best origin for a grain sale is the one with…',['Best risk-adjusted delivered margin after basis, quality, freight and execution','Lowest farm price only','Largest harvest only','Shortest contract'],0,'Delivered economics and execution reliability determine the trade.')
      ]
    },
    {
      id:'a12', title:'Origination & Contracts', subtitle:'Win supply, negotiate terms and understand the clauses that create hidden optionality.',
      division:'Origination', skill:'execution', phase:'Commodity Desks', icon:'✦',
      lessons:['Supplier economics','Offtake structures','Incoterm negotiation','Pricing clauses','Claims & force majeure','Origination case'],
      goals:['Offer terms suppliers can actually perform.','Understand long-term offtake trade-offs.','Negotiate cost and risk transfer.','Price contractual optionality.','Use clauses without confusing legal and commercial risk.','Turn relationships into repeatable margin.'],
      concepts:[
        R => choice('Good origination starts by understanding…',['The supplier’s economics, constraints and alternatives','Only your own target margin','Only exchange price','How to make the contract longest'],0,'Repeatable supply comes from solving a real supplier problem while protecting your economics.'),
        R => choice('A long-term offtake can be valuable because it…',['Secures flow and can create optionality, but also commits credit/capital/market capacity','Eliminates all market risk','Needs no contract','Guarantees margin forever'],0,'Offtakes exchange commitment for supply access and optionality; both sides create risk.'),
        R => choice('Changing FOB to CIF in a negotiation primarily changes…',['Who arranges/pays main carriage and the associated commercial exposures','The atomic composition','The futures exchange','The supplier legal name'],0,'Incoterms materially alter logistics responsibility and cost allocation.'),
        R => choice('A buyer-controlled quotation period should be treated as…',['An option whose value/risk belongs in the price','A free administrative detail','A guarantee of profit','Only a legal formatting issue'],0,'Control over pricing timing has economic value.'),
        R => choice('Force majeure generally aims to address…',['Defined extraordinary impediments to contractual performance, subject to the clause','Any trade that loses money','Normal price volatility','A buyer asking for a discount'],0,'Force majeure is clause-specific and does not simply excuse an uneconomic trade.'),
        R => { const annual=r(R,50,200,25)*1000, margin=r(R,5,20); return numeric(`An offtake supplies ${annual.toLocaleString('en-US')} t/year and expected contribution is $${margin}/t. Annual gross contribution?`,annual*margin,'$',`${annual.toLocaleString('en-US')} × $${margin} = ${money(annual*margin)}.`); },
        R => choice('Why can a “take-or-pay” commitment be risky for the buyer?',['You may owe value even if downstream demand disappears, depending on the clause','It guarantees free supply','It removes volume obligation','It fixes freight at zero'],0,'Volume commitments create downside if resale demand or capacity changes.'),
        R => choice('A commercially strong contract is one that…',['Makes price, quantity, quality, timing, delivery and remedies operationally clear','Leaves all key terms ambiguous','Maximises pages','Avoids specifying payment'],0,'Clarity reduces disputes and makes the intended economics executable.'),
        R => choice('When a counterparty asks for a clause change, the trader should ask first…',['What economic option or risk transfer does this create?','How many words changed?','Can legal decide alone?','Will the benchmark rise?'],0,'Contract wording often embeds optionality, timing rights or liability shifts that change value.'),
        R => choice('The strongest origination relationships are usually built on…',['Repeat performance, transparency and solving logistics/finance/market problems','One-off aggressive pricing only','Hidden terms','Avoiding operations teams'],0,'Physical trading relationships compound when both execution and economics are credible.')
      ]
    },
    {
      id:'a13', title:'Operations & Logistics', subtitle:'Execute the contract: schedule product, control documents, reconcile inventory and close exceptions.',
      division:'Operations', skill:'operations', phase:'Trading House Functions', icon:'OPS',
      lessons:['Trade handover & scheduling','Nominations and physical flow','Documents, title & quantity','Inventory reconciliation','Exceptions and claims','Operations desk case'],
      goals:['Turn a recap into an executable plan.','Schedule volumes against real capacity and deadlines.','Control the document chain and quantity evidence.','Reconcile book stock to physical stock.','Quantify and escalate operational exceptions.','Protect trading margin through disciplined execution.'],
      concepts:[
        R => choice('The best trader-to-operator handover contains…',['Agreed economics plus quantity, quality, timing, Incoterm, pricing, payment, documents and known exceptions','Only the headline price','Only the counterparty name','A verbal promise that details will follow'],0,'Operations can execute only what is explicit. Missing commercial terms become operational risk.'),
        R => choice('After a trade recap is agreed, the operator should first…',['Translate contractual obligations into dates, nominations, documents and dependencies','Wait for the vessel to arrive','Change the pricing formula','Assume every tolerance will be used'],0,'Execution starts by converting contract terms into a controlled operating plan.'),
        R => choice('A quantity tolerance of seller option is commercially important because…',['The seller controls the final quantity within the stated range and the downstream hedge/logistics must allow for it','It fixes quality','It transfers title automatically','It removes credit risk'],0,'Quantity optionality changes how much product may have to be financed, moved and hedged.'),
        R => { const base=r(R,20,80,10)*1000, tol=one(R,[5,10]); const max=base*(1+tol/100); return numeric(`Contract quantity is ${base.toLocaleString('en-US')} t with ${tol}% seller option. Maximum contractual quantity?`,max,'t',`${base.toLocaleString('en-US')} × (1 + ${tol}%) = ${max.toLocaleString('en-US')} t.`); },
        R => { const total=r(R,30,90,10)*1000, done=r(R,10,total/1000-10,10)*1000; return numeric(`A programme requires ${total.toLocaleString('en-US')} t this month. ${done.toLocaleString('en-US')} t has already loaded. Remaining scheduled volume?`,total-done,'t',`${total.toLocaleString('en-US')} − ${done.toLocaleString('en-US')} = ${(total-done).toLocaleString('en-US')} t.`); },

        R => choice('A nomination is operationally valuable because it…',['Communicates the volume/timing request into a constrained physical system','Changes the benchmark price','Creates an LC automatically','Eliminates inventory risk'],0,'Pipelines, terminals and transport systems need scheduled quantities before physical flow can occur.'),
        R => choice('A terminal nomination exceeds available tank space. The strongest response is…',['Reschedule or secure capacity before confirming the movement','Nominate anyway and solve it after arrival','Increase the futures hedge','Ignore tank heel and linefill'],0,'Physical capacity is a hard constraint. A paper schedule cannot override a full tank.'),
        R => choice('Why is a cut-off time economically relevant to an operator?',['Missing it can push movement into another slot/day and create storage, delay or contractual cost','It changes commodity quality','It guarantees demurrage','It fixes FX'],0,'Operational deadlines can change both timing and cost of the trade.'),
        R => { const qty=r(R,20,70,10)*1000, rate=r(R,4,10)*1000; const hours=round(qty/rate,1); return numeric(`Terminal loading rate is ${rate.toLocaleString('en-US')} t/hour for a ${qty.toLocaleString('en-US')} t parcel. Approximate loading hours?`,hours,'hours',`${qty.toLocaleString('en-US')} ÷ ${rate.toLocaleString('en-US')} = ${hours} hours.`,.1); },
        R => { const nominated=r(R,40,90,10)*1000, accepted=nominated-r(R,5,20,5)*1000; return numeric(`You nominate ${nominated.toLocaleString('en-US')} t but the system confirms only ${accepted.toLocaleString('en-US')} t. Unscheduled shortfall?`,nominated-accepted,'t',`${nominated.toLocaleString('en-US')} − ${accepted.toLocaleString('en-US')} = ${(nominated-accepted).toLocaleString('en-US')} t.`); },

        R => choice('The bill of lading is operationally important because it commonly evidences…',['Receipt/shipment details and, depending on form and law, can function in the title/document chain','The futures closing price','The trader bonus','The credit rating'],0,'Operators must control shipping evidence and the document chain without assuming every document has the same legal effect.'),
        R => choice('Documents show 29,800 t but the invoice was prepared for 30,500 t. What should happen first?',['Reconcile the quantity evidence before final invoicing/payment','Send both and let the bank decide','Change the bill of lading internally','Ignore the difference if price is hedged'],0,'Quantity discrepancies affect invoicing, inventory and sometimes documentary payment.'),
        R => choice('Why should title/risk transfer be checked separately from physical custody?',['A company can physically hold cargo while economic/legal rights and risks transfer under different contractual rules','They are always identical','Custody alone fixes payment','Futures determine title'],0,'Physical location, contractual risk and title are related but not interchangeable concepts.'),
        R => { const doc=r(R,20,80,5)*1000, actual=doc-r(R,100,900,100); return numeric(`Shipping documents show ${doc.toLocaleString('en-US')} t while independently confirmed loaded quantity is ${actual.toLocaleString('en-US')} t. Quantity difference?`,doc-actual,'t',`${doc.toLocaleString('en-US')} − ${actual.toLocaleString('en-US')} = ${(doc-actual).toLocaleString('en-US')} t.`); },
        R => { const qty=r(R,10,50,5)*1000, price=r(R,500,950,25); return numeric(`Final invoiced quantity is ${qty.toLocaleString('en-US')} t at $${price}/t. Invoice value before taxes/adjustments?`,qty*price,'$',`${qty.toLocaleString('en-US')} × $${price} = ${money(qty*price)}.`); },

        R => choice('Book inventory and terminal inventory disagree. The correct first control is…',['Reconcile movements, measurement basis, timing cut-offs and documented losses before booking an unexplained adjustment','Force the terminal number into the system','Force the book number onto the terminal','Add a hedge until they match'],0,'Inventory breaks need an audit trail; otherwise P&L and exposure can both be wrong.'),
        R => choice('Normal operational loss should be…',['Defined, measured and compared with contractual/technical tolerance rather than treated as invisible','Always zero','Automatically charged to the customer','Ignored if the desk is profitable'],0,'Shrink, linefill and measurement differences can be real economics and need controlled treatment.'),
        R => choice('Why reconcile inventory by location and grade rather than total tonnes only?',['Equal total tonnes can hide a shortage in one deliverable grade/location and an excess somewhere unusable','Because totals are illegal','Only accounting needs grade','It changes FX'],0,'Fungibility has limits; the wrong product in the wrong place may not satisfy the obligation.'),
        R => { const book=r(R,20,80,5)*1000, variance=r(R,50,500,50); const phys=book-variance; return numeric(`Book inventory is ${book.toLocaleString('en-US')} t; physical measurement is ${phys.toLocaleString('en-US')} t. Reconciliation shortage?`,book-phys,'t',`${book.toLocaleString('en-US')} − ${phys.toLocaleString('en-US')} = ${book-phys} t.`); },
        R => { const opening=r(R,20,60,5)*1000, receipts=r(R,10,40,5)*1000, deliveries=r(R,10,40,5)*1000; const close=opening+receipts-deliveries; return numeric(`Opening stock ${opening.toLocaleString('en-US')} t, receipts ${receipts.toLocaleString('en-US')} t, deliveries ${deliveries.toLocaleString('en-US')} t. Expected closing stock?`,close,'t',`${opening.toLocaleString('en-US')} + ${receipts.toLocaleString('en-US')} − ${deliveries.toLocaleString('en-US')} = ${close.toLocaleString('en-US')} t.`); },

        R => choice('A quality exception appears before discharge. Operations should…',['Preserve evidence, notify the right parties on time and coordinate commercial/legal response before waiving rights','Delete the lab result','Immediately accept any buyer deduction','Change the futures hedge only'],0,'Claims are won or lost through evidence, notice and contract procedure as much as through negotiation.'),
        R => choice('Why does an operator maintain a chronology of an exception?',['Because notices, causation, responsibility and recoverable cost depend on what happened when','To predict futures prices','To replace the contract','To avoid talking to the trader'],0,'A contemporaneous timeline turns an operational story into defensible evidence.'),
        R => choice('An operational cost is recoverable from a counterparty under the contract. Should the desk ignore it in current P&L until cash arrives?',['No; record the exposure/claim appropriately while keeping recovery uncertainty visible','Yes, claims never affect economics','Book guaranteed income immediately','Net it against unrelated trades'],0,'Economic reporting should distinguish incurred cost, claim receivable and uncertainty of recovery.'),
        R => { const qty=r(R,15,60,5)*1000, short=one(R,[0.2,0.4,0.6,0.8]); const tonnes=round(qty*short/100,1); return numeric(`A ${qty.toLocaleString('en-US')} t cargo has a confirmed ${short}% quantity shortage versus contract. Short tonnes?`,tonnes,'t',`${qty.toLocaleString('en-US')} × ${short}% = ${tonnes} t.`,.1); },
        R => { const affected=r(R,5,30,5)*1000, discount=r(R,4,18,2); return numeric(`${affected.toLocaleString('en-US')} t is accepted subject to a $${discount}/t quality allowance. Gross claim value?`,affected*discount,'$',`${affected.toLocaleString('en-US')} × $${discount} = ${money(affected*discount)}.`); },

        R => choice('A strong operator is commercially valuable because…',['Execution quality protects optionality, cash timing, customer trust and the margin the trader originally quoted','Operations has no P&L impact','Only traders can create value','The job ends when a recap is signed'],0,'In physical commodities, execution is part of the product and part of the P&L.'),
        R => choice('A vessel, tank and payment deadline all conflict. What is the correct decision framework?',['Identify contractual must-do items, quantify alternatives and escalate the least-cost executable plan','Optimise freight only','Optimise payment only','Wait until one deadline passes'],0,'Operations decisions are multi-constraint optimisation under contract, capacity and cost.'),
        R => choice('When should an operator escalate to the trader/risk/legal teams?',['Early enough that there are still choices, especially when economics, liability or compliance may change','Only after loss is final','Never; operations owns every decision','Only when the benchmark moves'],0,'Early escalation preserves options; late escalation merely reports damage.'),
        R => { const storage=r(R,20000,70000,5000), extraFreight=r(R,30000,100000,10000), docs=r(R,5000,20000,5000); const total=storage+extraFreight+docs; return numeric(`Exception costs: storage ${money(storage)}, extra freight ${money(extraFreight)}, document/courier charges ${money(docs)}. Total operational cost?`,total,'$',`${money(storage)} + ${money(extraFreight)} + ${money(docs)} = ${money(total)}.`); },
        R => { const value=r(R,3,12)*1000000, delay=r(R,5,25,5), rate=one(R,[5,6,7,8]); const cost=round(value*rate/100*delay/360); return numeric(`A document delay postpones collection of ${money(value)} for ${delay} days. At ${rate}% annual funding cost on a 360-day basis, incremental funding cost?`,cost,'$',`${money(value)} × ${rate}% × ${delay}/360 ≈ ${money(cost)}.`,2); }
      ]
    },
    {
      id:'a14', title:'Deals Desk & Middle Office', subtitle:'Independently reconcile positions, marks and P&L so the trading book is trusted every day.',
      division:'Deals Desk', skill:'risk', phase:'Trading House Functions', icon:'MO',
      lessons:['Daily P&L and mark-to-market','Position & exposure reconciliation','Trade amendments and lifecycle','Curves, marks & valuation controls','Breaks and control discipline','Deals desk case'],
      goals:['Explain daily P&L by economic driver.','Reconcile physical and paper exposure independently.','Control changes to booked economics.','Challenge marks and valuation inputs.','Resolve breaks with evidence and ownership.','Produce a defensible close for the desk.'],
      concepts:[
        R => choice('Daily mark-to-market P&L is primarily…',['The change in economic value of open positions using current approved marks, plus realised components under the firm methodology','Cash received that day only','Invoice value only','A trader estimate that needs no reconciliation'],0,'Deals Desk separates economic valuation from cash timing and applies controlled marks consistently.'),
        R => choice('Why should P&L be explained by driver?',['A total number can be right for the wrong reasons; attribution reveals price, basis, freight, FX, volume and new-trade effects','It makes the total larger','It removes market risk','It replaces trade capture'],0,'P&L attribution is a control: unexplained movement can reveal missing trades, bad curves or position errors.'),
        R => choice('Realised and unrealised P&L differ mainly because…',['Realised economics have crystallised under the accounting/valuation policy while open positions still depend on current marks','Unrealised P&L is always fake','Realised P&L has no cash effect','Only derivatives can be realised'],0,'The exact policy varies, but the control principle is to distinguish closed/crystallised economics from open valuation.'),
        R => { const qty=r(R,10,80,10)*1000, trade=r(R,500,900,25), mark=trade+r(R,-40,40,10); const pnl=(mark-trade)*qty; return numeric(`Long position ${qty.toLocaleString('en-US')} t entered at $${trade}/t is marked at $${mark}/t. Simple mark-to-market P&L?`,pnl,'$',`($${mark} − $${trade}) × ${qty.toLocaleString('en-US')} = ${money(pnl)}.`); },
        R => { const price=r(R,-3,8)*100000, freight=r(R,-2,5)*100000, fx=r(R,-2,3)*100000; const total=price+freight+fx; return numeric(`Daily attribution: price ${money(price)}, freight ${money(freight)}, FX ${money(fx)}. Explained P&L?`,total,'$',`${money(price)} + ${money(freight)} + ${money(fx)} = ${money(total)}.`); },

        R => choice('Why independently reconcile position rather than copy the trader spreadsheet?',['Control requires a second view from booked trades, settlements and approved data','Trader spreadsheets are legally binding','Independence slows the close only','Position cannot be wrong if P&L is positive'],0,'Independent reconstruction is how missing, duplicated or misclassified exposure is found.'),
        R => choice('A physical purchase and paper sale have equal tonnes but different pricing months. The book is…',['Flat in volume but exposed to the calendar spread between pricing months','Completely flat','Long freight only','Credit neutral'],0,'Position must be bucketed by pricing period, basis and location, not just net tonnes.'),
        R => choice('A position break should be resolved by…',['Tracing the difference to trades, amendments, settlements or mappings and documenting the fix','Forcing both reports to the trader number','Deleting the smaller report','Changing market data'],0,'A reconciliation is an investigation, not an averaging exercise.'),
        R => { const phys=r(R,40,120,10)*1000, paper=r(R,20,100,10)*1000; return numeric(`Long physical ${phys.toLocaleString('en-US')} t and short paper ${paper.toLocaleString('en-US')} t in the same pricing bucket. Net exposure?`,phys-paper,'t',`${phys.toLocaleString('en-US')} − ${paper.toLocaleString('en-US')} = ${(phys-paper).toLocaleString('en-US')} t.`); },
        R => { const jan=r(R,20,60,10)*1000, feb=r(R,10,50,10)*1000; return numeric(`Purchase pricing exposure: ${jan.toLocaleString('en-US')} t January and ${feb.toLocaleString('en-US')} t February. Total volume is useful, but how many tonnes are specifically January exposure?`,jan,'t',`The January bucket is ${jan.toLocaleString('en-US')} t; aggregation must not erase pricing-time exposure.`); },

        R => choice('A trader amends quantity after the trade was booked. What is the control requirement?',['Authorised amendment with audit trail, economic impact and downstream position/P&L updates','Overwrite history silently','Tell Operations only','Wait until month-end'],0,'Lifecycle changes can alter risk, cash and P&L; the system must preserve who changed what and why.'),
        R => choice('Back-dating a trade amendment is dangerous because it can…',['Alter historical P&L/exposure and obscure when information was actually known','Improve audit quality','Remove credit risk','Fix freight automatically'],0,'Controls need event time and effective time to remain visible.'),
        R => choice('A cancelled trade remains in the position report. This is primarily…',['A lifecycle/control break that overstates exposure','A market view','A credit enhancement','A normal basis move'],0,'Trade status is part of position. Cancellation must flow through all dependent systems.'),
        R => { const old=r(R,20,80,10)*1000, change=r(R,5,20,5)*1000; return numeric(`Booked purchase quantity is ${old.toLocaleString('en-US')} t and an authorised amendment increases it by ${change.toLocaleString('en-US')} t. New booked quantity?`,old+change,'t',`${old.toLocaleString('en-US')} + ${change.toLocaleString('en-US')} = ${(old+change).toLocaleString('en-US')} t.`); },
        R => { const qty=r(R,10,50,5)*1000, old=r(R,600,900,25), amend=old+r(R,-20,30,10); const impact=(amend-old)*qty; return numeric(`A fixed-price term on ${qty.toLocaleString('en-US')} t is amended from $${old}/t to $${amend}/t. Seller-side gross value change?`,impact,'$',`($${amend} − $${old}) × ${qty.toLocaleString('en-US')} = ${money(impact)}.`); },

        R => choice('Independent price verification asks…',['Whether marks used for valuation are observable/reasonable and independent of the risk-taker where required','Whether the trader likes the mark','Whether the market moved in your favour','Whether invoices have been paid'],0,'Valuation controls reduce the risk of optimistic or stale marks entering P&L.'),
        R => choice('A thinly traded location premium has no fresh quote. The safest control is…',['Use an approved valuation hierarchy/model with documented inputs and valuation uncertainty, not an invented point','Carry the last quote forever with no review','Ask the trader for the highest number','Set premium to zero'],0,'Illiquidity is a valuation problem that should be visible through methodology and reserves/uncertainty.'),
        R => choice('Why can a curve mapping error create large false P&L?',['The right volume valued on the wrong tenor/location can move against an unrelated market','Curves only affect charts','Mapping changes cash immediately','Only options use curves'],0,'Commodity books are multidimensional; mapping is part of valuation.'),
        R => { const m1=r(R,70,100,5), m3=m1+r(R,-10,15,5); const mid=round((m1+m3)/2,1); return numeric(`Approved marks are $${m1}/t for month 1 and $${m3}/t for month 3. Under simple linear interpolation, approximate month-2 mark?`,mid,'$/t',`($${m1} + $${m3}) ÷ 2 = $${mid}/t.`,.1); },
        R => { const qty=r(R,10,60,10)*1000, desk=r(R,600,900,25), independent=desk-r(R,2,12,2); const diff=(desk-independent)*qty; return numeric(`Desk mark is $${desk}/t; independent control mark is $${independent}/t on ${qty.toLocaleString('en-US')} t. Valuation difference?`,diff,'$',`($${desk} − $${independent}) × ${qty.toLocaleString('en-US')} = ${money(diff)}.`); },

        R => choice('An unexplained P&L break is small today. Why still investigate repeated breaks?',['Repeated small breaks can reveal a systematic control failure that becomes material with volume or volatility','Small breaks can never matter','Only auditors care','They improve diversification'],0,'Control quality is about root cause and recurrence, not only today’s dollar amount.'),
        R => choice('Which is the strongest close discipline?',['Defined ownership, materiality thresholds, evidence, sign-off and tracked ageing of unresolved breaks','Delete all breaks at day-end','Let each desk choose whether to reconcile','Carry every break forever'],0,'A good close makes unresolved risk visible and assigns action.'),
        R => choice('A trader challenges the control mark. The correct process is…',['Review evidence and methodology through governance; do not change it solely because the P&L is unpopular','Automatically accept the trader mark','Freeze all trading','Use yesterday’s number'],0,'Valuation disputes should be evidence-based and governed independently.'),
        R => { const report=r(R,2,10)*1000000, system=report-r(R,1,8)*10000; return numeric(`Desk report shows ${money(report)} P&L; controlled system shows ${money(system)}. Absolute break?`,Math.abs(report-system),'$',`|${money(report)} − ${money(system)}| = ${money(Math.abs(report-system))}.`); },
        R => { const breaks=r(R,2,8), each=r(R,10,50,5)*1000; return numeric(`${breaks} unresolved valuation breaks average ${money(each)} each in absolute value. Gross break inventory?`,breaks*each,'$',`${breaks} × ${money(each)} = ${money(breaks*each)}.`); },

        R => choice('The Deals Desk creates value even though it is independent from trading because…',['Trusted positions and P&L let management allocate risk and capital on facts','It chooses the directional view','It replaces Operations','It guarantees profit'],0,'Control functions enable commercial risk-taking by making the book measurable and credible.'),
        R => choice('A desk has positive P&L but large unexplained exposure and stale marks. The correct conclusion is…',['The close is not reliable until the control issues are resolved or explicitly reserved/escalated','Profit proves the book is correct','Ignore exposure because P&L is positive','Publish the result without comment'],0,'P&L quality matters as much as P&L quantity.'),
        R => choice('Best end-of-day sequence is closest to…',['Complete trade capture → reconcile position → validate marks → explain P&L → resolve/escalate breaks → sign off','Sign off → capture trades later','Mark first → invent position','Pay invoices → estimate P&L'],0,'The close should build from complete transactions to controlled exposures and valuation.'),
        R => { const price=r(R,-4,8)*100000, basis=r(R,-3,5)*100000, freight=r(R,-2,4)*100000, newTrades=r(R,0,4)*100000; const explained=price+basis+freight+newTrades; return numeric(`P&L drivers: flat price ${money(price)}, basis ${money(basis)}, freight ${money(freight)}, new trades ${money(newTrades)}. Explained desk P&L?`,explained,'$',`${money(price)} + ${money(basis)} + ${money(freight)} + ${money(newTrades)} = ${money(explained)}.`); },
        R => { const reported=r(R,2,10)*1000000, explained=reported-r(R,50,400,50)*1000; return numeric(`Reported daily P&L is ${money(reported)} and explained P&L is ${money(explained)}. Unexplained residual?`,reported-explained,'$',`${money(reported)} − ${money(explained)} = ${money(reported-explained)}.`); }
      ]
    },
    {
      id:'a15', title:'Treasury & Liquidity', subtitle:'Fund the physical cycle, survive margin calls and manage cash, FX and facility capacity.',
      division:'Treasury', skill:'finance', phase:'Trading House Functions', icon:'TR',
      lessons:['Cash conversion cycle','Margining & collateral','FX and interest exposure','Facilities & funding capacity','Liquidity stress testing','Treasury desk case'],
      goals:['Measure how long cash is tied up.','Separate economic hedge from cash collateral needs.','Recognise treasury market risks.','Treat funding lines as finite capacity.','Stress sources and uses of cash.','Keep profitable trading books financeable through volatility.'],
      concepts:[
        R => choice('A commodity trader can be profitable and still consume large cash because…',['Suppliers, inventory and margin calls can require payment before customers pay','Profit always arrives as cash immediately','Only loss-making trades use working capital','Hedging removes settlement timing'],0,'Physical trading converts accounting/economic margin into cash on a different timetable.'),
        R => choice('The cash conversion cycle is mainly driven by…',['Timing of inventory, supplier payments and customer collections','The trader job title','Only futures expiry','Only tax'],0,'Funding need comes from how long money is tied up across the operating cycle.'),
        R => choice('Improving payment terms with a supplier can create value by…',['Reducing the number of days the firm must fund the cargo, if commercial price/credit trade-offs are acceptable','Increasing commodity volatility','Removing quality risk','Changing Incoterms automatically'],0,'Working-capital terms have a measurable funding value.'),
        R => { const supplier=r(R,0,30,10), inventory=r(R,20,70,10), customer=r(R,20,90,10); const cycle=inventory+customer-supplier; return numeric(`Supplier credit ${supplier} days, inventory/transport ${inventory} days, customer collection ${customer} days after sale. Approximate cash conversion cycle?`,cycle,'days',`${inventory} + ${customer} − ${supplier} = ${cycle} days.`); },
        R => { const value=r(R,3,15)*1000000, days=r(R,30,120,15), rate=one(R,[5,6,7,8]); const cost=round(value*rate/100*days/360); return numeric(`${money(value)} is tied up for ${days} days at ${rate}% annual funding cost on a 360-day basis. Funding cost?`,cost,'$',`${money(value)} × ${rate}% × ${days}/360 ≈ ${money(cost)}.`,2); },

        R => choice('Why can a short futures hedge create cash stress when physical inventory gains value?',['Variation margin may be payable immediately while the offsetting physical gain is unrealised','The hedge is economically wrong by definition','Physical inventory never changes value','Clearing houses finance inventory'],0,'Economic offset and cash timing are different dimensions of risk.'),
        R => choice('Initial margin is best understood as…',['Collateral required to support potential future exposure under the clearing/margin framework','A realised trading loss','A supplier deposit','A freight rebate'],0,'Margin protects the clearing/credit system; it is a liquidity use, not automatically a P&L expense.'),
        R => choice('When volatility rises, treasury should expect…',['Potentially higher and more volatile margin/collateral requirements','Guaranteed lower funding need','No impact on derivatives cash flows','Automatic customer prepayment'],0,'Volatility can turn a well-hedged book into a large short-term liquidity consumer.'),
        R => { const cash=r(R,10,40)*1000000, initial=r(R,2,8)*1000000, variation=r(R,3,12)*1000000; return numeric(`Available cash ${money(cash)}; new initial margin ${money(initial)} and variation margin ${money(variation)}. Remaining cash after both?`,cash-initial-variation,'$',`${money(cash)} − ${money(initial)} − ${money(variation)} = ${money(cash-initial-variation)}.`); },
        R => { const lots=r(R,20,100,10), size=one(R,[25,50,100]), move=r(R,10,60,10); return numeric(`A short futures position has ${lots} lots of ${size} t. Price rises $${move}/t. Approximate variation-margin cash outflow before other effects?`,lots*size*move,'$',`${lots} × ${size} × $${move} = ${money(lots*size*move)}.`); },

        R => choice('A USD purchase and EUR sale create…',['FX exposure unless the currency conversion is fixed/hedged consistently with the cash flows','No risk because both are commodities','Only freight risk','Only credit risk'],0,'Commodity margin can be lost through currency if purchase and sale cash flows differ.'),
        R => choice('Floating-rate borrowing creates treasury exposure to…',['Changes in the reference interest rate and funding spread','Only commodity basis','Only storage loss','Only quality claims'],0,'Funding cost is itself a market input to merchant economics.'),
        R => choice('Why should FX hedges match expected cash-flow timing?',['A hedge in the wrong date can leave forward-point and timing exposure even if the currency amount matches','Dates never matter in FX','Spot FX fixes future cash flows automatically','Only accounting cares about settlement date'],0,'Amount, currency and date are all parts of an FX hedge.'),
        R => { const usd=r(R,2,10)*1000000, eurusd=one(R,[1.05,1.08,1.10,1.12]); const eur=round(usd/eurusd,2); return numeric(`A USD payable is ${money(usd)} and EUR/USD is ${eurusd} USD per EUR. Approximate EUR needed to buy the USD?`,eur,'EUR',`${money(usd)} ÷ ${eurusd} ≈ €${Number(eur).toLocaleString('en-US')}.`,2); },
        R => { const debt=r(R,5,25)*1000000, delta=one(R,[0.5,1.0,1.5,2.0]), days=90; const extra=round(debt*(delta/100)*days/360); return numeric(`Floating-rate debt ${money(debt)} reprices ${delta} percentage points higher for ${days} days. Approximate incremental interest?`,extra,'$',`${money(debt)} × ${delta}% × ${days}/360 ≈ ${money(extra)}.`,2); },

        R => choice('An undrawn credit line is valuable because…',['It is liquidity capacity that can absorb timing shocks, subject to its terms and availability','It is free profit','It eliminates counterparty risk','It fixes commodity prices'],0,'Trading capacity depends on available funding, not only accounting equity.'),
        R => choice('Why diversify funding sources?',['Different markets/facilities can tighten at different times, reducing dependence on one source','More lenders always lower commodity volatility','It removes documentation','It eliminates covenants'],0,'Funding resilience improves when liquidity is not concentrated in a single channel.'),
        R => choice('A facility covenant is commercially relevant to traders because…',['A breach can restrict access to funding exactly when the trading book needs cash','It changes cargo quality','It determines laycan','It settles futures'],0,'Commercial teams consume funding capacity and should understand constraints around it.'),
        R => { const committed=r(R,100,500,50)*1000000, drawn=r(R,40,350,50)*1000000; const avail=Math.max(0,committed-drawn); return numeric(`Committed facility ${money(committed)}, drawn amount ${money(drawn)}. Undrawn contractual capacity before other restrictions?`,avail,'$',`${money(committed)} − ${money(drawn)} = ${money(avail)}.`); },
        R => { const limit=r(R,50,250,25)*1000000, loans=r(R,20,150,10)*1000000, lcs=r(R,5,80,5)*1000000; return numeric(`Facility limit ${money(limit)}; loans use ${money(loans)} and issued LCs use ${money(lcs)}. Remaining nominal headroom?`,limit-loans-lcs,'$',`${money(limit)} − ${money(loans)} − ${money(lcs)} = ${money(limit-loans-lcs)}.`); },

        R => choice('A liquidity stress test should focus on…',['Cash sources and uses under severe but plausible market, margin, collection and funding shocks','Only annual profit','Only VaR','Only invoice dates that are already paid'],0,'Liquidity fails through timing and access to cash; stress should model both.'),
        R => choice('Which is a dangerous assumption in a liquidity stress?',['That every credit line remains fully available and every customer pays exactly on time during market stress','That margin calls can occur','That inventory needs funding','That cash has a currency'],0,'Stress tests should challenge availability and timing assumptions rather than preserve the base case.'),
        R => choice('Liquidity survival horizon asks…',['How long available liquidity can meet stressed cash outflows before additional action/funding is required','How long a vessel survives','How long a futures contract exists','How long the trader has worked'],0,'The horizon converts a liquidity stock into a time-to-action measure.'),
        R => { const sources=r(R,20,70)*1000000, margin=r(R,5,20)*1000000, suppliers=r(R,10,35)*1000000, other=r(R,2,10)*1000000; return numeric(`Stressed liquid sources ${money(sources)}; margin ${money(margin)}, supplier payments ${money(suppliers)}, other uses ${money(other)}. Net stressed liquidity?`,sources-margin-suppliers-other,'$',`${money(sources)} − ${money(margin)} − ${money(suppliers)} − ${money(other)} = ${money(sources-margin-suppliers-other)}.`); },
        R => { const liquidity=r(R,15,60)*1000000, daily=r(R,1,5)*1000000; const days=round(liquidity/daily,1); return numeric(`Usable liquidity ${money(liquidity)} and stressed net cash burn ${money(daily)}/day. Simple survival horizon?`,days,'days',`${money(liquidity)} ÷ ${money(daily)} = ${days} days.`,.1); },

        R => choice('Treasury should be involved in a large trade before execution when…',['The deal materially uses funding, FX, collateral or facility capacity','Only after invoices are overdue','Never; treasury is post-trade only','Only if futures are profitable'],0,'Funding is an input to trade capacity and pricing, not merely a back-office consequence.'),
        R => choice('The strongest trading-house liquidity model links…',['Trade cash flows, inventory, customer/supplier terms, derivatives margin and facility availability by date and currency','Annual revenue only','VaR only','Cargo tonnes only'],0,'Liquidity is a dated, multi-currency network of operating and financial cash flows.'),
        R => choice('A trade earns a strong accounting margin but consumes scarce liquidity for months. The commercial response should be…',['Price the funding/capacity use and compare return on scarce liquidity with alternatives','Ignore liquidity because margin is positive','Always reject long trades','Finance it with customer credit'],0,'Liquidity and capital efficiency are part of risk-adjusted return.'),
        R => { const supplier=r(R,8,20)*1000000, margin=r(R,3,12)*1000000, operating=r(R,2,8)*1000000, customer=r(R,4,15)*1000000; const peak=supplier+margin+operating-customer; return numeric(`Near-term cash uses: suppliers ${money(supplier)}, margin ${money(margin)}, operations ${money(operating)}; customer receipts ${money(customer)}. Net funding need?`,peak,'$',`${money(supplier)} + ${money(margin)} + ${money(operating)} − ${money(customer)} = ${money(peak)}.`); },
        R => { const need=r(R,20,60)*1000000, cash=r(R,5,20)*1000000, undrawn=r(R,10,50)*1000000; return numeric(`Stressed funding need ${money(need)}, cash ${money(cash)}, undrawn usable facilities ${money(undrawn)}. Surplus/shortfall?`,cash+undrawn-need,'$',`${money(cash)} + ${money(undrawn)} − ${money(need)} = ${money(cash+undrawn-need)}. Negative means a funding gap.`); }
      ]
    },
    {
      id:'a16', title:'Systems, Data & ETRM', subtitle:'Make trade capture, market data, positions and valuation reproducible rather than spreadsheet folklore.',
      division:'Trading Technology', skill:'pricing', phase:'Trading House Functions', icon:'ETRM',
      lessons:['Trade capture & static data','Market data quality','Position engines & mappings','Curves and valuation data','Reconciliation & controls','Automation desk case'],
      goals:['Capture economic terms once and correctly.','Detect stale, missing and inconsistent market data.','Understand how systems build exposure.','Use controlled curves and valuation inputs.','Reconcile systems without hiding breaks.','Automate safely with checks, logs and fallback.'],
      concepts:[
        R => choice('The ETRM system should be the controlled record of…',['Trade economics, lifecycle events, positions and related settlement/risk data under the firm architecture','Only trader notes','Only invoices','Only exchange prices'],0,'A trading system becomes useful when the same booked economics drive operations, risk, P&L and settlement.'),
        R => choice('Why are units of measure and conversion factors critical static data?',['A wrong conversion can multiply position, invoice and P&L errors across the entire trade lifecycle','They affect charts only','Units are obvious from context','Only Operations uses units'],0,'Commodity systems routinely cross tonnes, barrels, MWh, MMBtu and currencies; unit errors are control failures.'),
        R => choice('A mandatory pricing field is blank at trade capture. Best system behaviour is…',['Block or explicitly flag the incomplete trade according to governance rather than silently assume a default','Insert zero price and close the day','Copy the previous trade','Let valuation guess forever'],0,'Silent defaults create invisible economic assumptions.'),
        R => { const qty=r(R,10,80,10)*1000, price=r(R,400,1000,25); return numeric(`ETRM captures ${qty.toLocaleString('en-US')} t at $${price}/t. Gross trade notional?`,qty*price,'$',`${qty.toLocaleString('en-US')} × $${price} = ${money(qty*price)}.`); },
        R => { const barrels=r(R,100,900,100)*1000, bblPerT=one(R,[7.2,7.4,7.6]); const tonnes=round(barrels/bblPerT,1); return numeric(`A product mapping uses ${bblPerT} barrels per tonne. ${barrels.toLocaleString('en-US')} bbl corresponds to approximately how many tonnes?`,tonnes,'t',`${barrels.toLocaleString('en-US')} ÷ ${bblPerT} ≈ ${tonnes.toLocaleString('en-US')} t.`,.1); },

        R => choice('A market-data point is unchanged for five sessions while neighbouring contracts move sharply. First suspicion?',['Stale or failed data feed, to be checked before treating the mark as real','Perfect market efficiency','Guaranteed arbitrage','A credit event'],0,'Staleness checks compare timestamps and market context, not just numeric validity.'),
        R => choice('Two approved vendors publish different prices. The control should…',['Apply the documented source hierarchy/tolerance and investigate material differences','Always choose the higher mark','Average everything automatically','Delete both prices'],0,'Market data needs source governance, not outcome-driven selection.'),
        R => choice('Why retain raw source timestamps with market data?',['So users can distinguish current observations from stale values and reproduce the valuation state','To increase file size','Only for tax','Timestamps have no valuation meaning'],0,'Freshness is part of the data, especially in fast commodity markets.'),
        R => { const old=r(R,70,120,5), fresh=old+r(R,-10,15,5); return numeric(`Stored mark is $${old}/t and fresh approved mark is $${fresh}/t. Absolute price difference?`,Math.abs(fresh-old),'$/t',`|$${fresh} − $${old}| = $${Math.abs(fresh-old)}/t.`); },
        R => { const px1=r(R,70,110,5), px2=px1+r(R,-4,6,2), qty=r(R,10,60,10)*1000; return numeric(`Vendor A marks $${px1}/t and Vendor B $${px2}/t on ${qty.toLocaleString('en-US')} t. Gross valuation difference between sources?`,Math.abs(px1-px2)*qty,'$',`|$${px1} − $${px2}| × ${qty.toLocaleString('en-US')} = ${money(Math.abs(px1-px2)*qty)}.`); },

        R => choice('A position engine can be wrong even if every individual trade is correct because…',['Mappings, lifecycle states, aggregation buckets or duplicate interfaces can transform correct trades into wrong exposure','Correct trades guarantee correct aggregation','Only market data affects position','Position is entered manually only'],0,'Systems risk often appears between trade capture and aggregation.'),
        R => choice('A physical cargo priced on June average should be mapped to…',['The pricing exposure dictated by its actual quotation rule, not merely its delivery month','Whichever month gives lowest VaR','The invoice month only','The vessel arrival month always'],0,'Delivery time and pricing time are separate dimensions.'),
        R => choice('A trade arrives twice through an interface. The most dangerous consequence is…',['Double-counted position, P&L and possibly settlement unless duplicate controls catch it','No impact because IDs look similar','Lower credit exposure','Automatic hedge correction'],0,'Idempotency and unique identifiers are fundamental controls in trade interfaces.'),
        R => { const booked=r(R,20,100,10)*1000, duplicate=r(R,5,30,5)*1000; return numeric(`True exposure is ${booked.toLocaleString('en-US')} t but a duplicate interface adds ${duplicate.toLocaleString('en-US')} t. Reported exposure becomes?`,booked+duplicate,'t',`${booked.toLocaleString('en-US')} + ${duplicate.toLocaleString('en-US')} = ${(booked+duplicate).toLocaleString('en-US')} t.`); },
        R => { const phys=r(R,40,100,10)*1000, fut=r(R,20,80,10)*1000, swap=r(R,-20,20,10)*1000; const net=phys-fut+swap; return numeric(`Position engine sees long physical ${phys.toLocaleString('en-US')} t, short futures ${fut.toLocaleString('en-US')} t and swap-equivalent ${swap>=0?'+':''}${swap.toLocaleString('en-US')} t. Net equivalent exposure?`,net,'t',`${phys.toLocaleString('en-US')} − ${fut.toLocaleString('en-US')} + (${swap.toLocaleString('en-US')}) = ${net.toLocaleString('en-US')} t.`); },

        R => choice('A forward curve is not just a chart; in valuation it is…',['A structured set of market inputs by tenor/location/product used to value dated exposures consistently','A trader forecast only','A settlement invoice','A legal term'],0,'Curve construction determines how open exposures are marked between observable points.'),
        R => choice('Why version valuation curves?',['So P&L and risk can be reproduced using the exact data/method state used at the close','To make files harder to read','Because prices never change','Only regulators need versions'],0,'Reproducibility is essential when explaining a historical P&L or control break.'),
        R => choice('An illiquid tenor requires interpolation/model input. What should the system retain?',['Method, source points, parameters and any valuation-quality flag/reserve required by policy','Only the final number','Only the trader name','Nothing after close'],0,'Modelled data needs more provenance than directly observed data, not less.'),
        R => { const p1=r(R,60,100,5), p3=p1+r(R,-12,18,6); const p2=round((p1+p3)/2,1); return numeric(`Month-1 curve point $${p1}/t and month-3 point $${p3}/t. Simple linear month-2 interpolation?`,p2,'$/t',`($${p1} + $${p3}) ÷ 2 = $${p2}/t.`,.1); },
        R => { const days=one(R,[20,21,22]), sum=r(R,1400,2200,20); const avg=round(sum/days,2); return numeric(`The sum of ${days} daily settlement prices is ${sum}. Monthly average settlement price?`,avg,'$/unit',`${sum} ÷ ${days} = ${avg}.`,.02); },

        R => choice('Two systems disagree on position. The best reconciliation key is…',['Traceable trade/lifecycle identifiers and economic fields, not just matching total P&L','Trader memory','File size','Alphabetical counterparty order'],0,'Granular reconciliation locates the actual missing/extra/mis-mapped event.'),
        R => choice('Why monitor automated interface failures even if manual repair exists?',['Manual fallback prevents immediate loss but recurring failures create control, timing and scale risk','Automation never fails twice','Manual repair is always cheaper','Interfaces are not part of trading'],0,'Operational resilience includes detecting, containing and eliminating repeatable system failures.'),
        R => choice('A reconciliation tolerance should be…',['Defined by risk/materiality and unit precision, with exceptions visible rather than silently netted away','Infinite','Chosen after seeing the result','Zero for every field regardless of measurement reality'],0,'Good controls distinguish acceptable precision from real breaks.'),
        R => { const source=r(R,50,120,10)*1000, target=source-r(R,50,500,50); return numeric(`Source system position ${source.toLocaleString('en-US')} t; target system ${target.toLocaleString('en-US')} t. Interface break?`,source-target,'t',`${source.toLocaleString('en-US')} − ${target.toLocaleString('en-US')} = ${source-target} t.`); },
        R => { const total=r(R,500,2000,100), failed=r(R,2,20); const rate=round(failed/total*100,2); return numeric(`${failed} of ${total} trade-interface messages failed and required repair. Failure rate?`,rate,'%',`${failed} ÷ ${total} × 100 = ${rate}%.`,.02); },

        R => choice('Safe automation in trading requires…',['Validation, access control, logs, monitoring, deterministic fallback and human escalation for exceptions','No logs so it runs faster','Direct production changes by any user','Assuming input data is always valid'],0,'Automation scales both good logic and bad logic; controls must scale with it.'),
        R => choice('A model generates a price outside the approved market-data range. Best behaviour?',['Flag/quarantine the exception and require the defined review path rather than silently publishing it','Publish it because models are objective','Delete the audit log','Move the range'],0,'Automated outputs remain subject to controls and model/data governance.'),
        R => choice('The most useful trading-data platform connects…',['Trades, positions, market data, logistics, cash and risk with consistent identifiers and lineage','Only charts','Only email','Only historical prices'],0,'Physical commodity decisions span systems; shared lineage prevents each function from inventing its own truth.'),
        R => { const manual=r(R,20,80), automated=r(R,2,15), runs=r(R,20,100); const saved=(manual-automated)*runs; return numeric(`A control took ${manual} minutes manually and ${automated} minutes after automation, run ${runs} times per month. Monthly minutes saved?`,saved,'minutes',`(${manual} − ${automated}) × ${runs} = ${saved.toLocaleString('en-US')} minutes.`); },
        R => { const rows=r(R,1000,10000,1000), bad=r(R,5,50,5); const clean=rows-bad; return numeric(`A market-data load contains ${rows.toLocaleString('en-US')} records; ${bad} fail validation. Records eligible to continue after quarantine?`,clean,'records',`${rows.toLocaleString('en-US')} − ${bad} = ${clean.toLocaleString('en-US')} records.`); }
      ]
    },
    {
      id:'a17', title:'Compliance, KYC & Sanctions', subtitle:'Know when a profitable-looking trade must stop for counterparty, conduct or sanctions risk.',
      division:'Compliance', skill:'compliance', phase:'Trading House Functions', icon:'KYC',
      lessons:['KYC & beneficial ownership','Sanctions screening','Maritime & trade red flags','AML and anti-bribery controls','Escalation & audit trail','Compliance case'],
      goals:['Understand who you are actually dealing with.','Screen the full transaction chain, not only the company name.','Recognise shipping and trade-evasion indicators.','Spot suspicious payment and intermediary structures.','Stop, document and escalate rather than improvise.','Integrate compliance into commercial decision-making.'],
      concepts:[
        R => choice('The commercial purpose of KYC is to understand…',['Who the counterparty is, who controls/benefits from it, its business rationale and relevant risk profile before relying on the relationship','Only its marketing name','Only its commodity price view','Only whether it owns a vessel'],0,'Legal entity identity alone may not reveal ownership, control or transaction purpose.'),
        R => choice('Why does beneficial ownership matter?',['Risk can sit behind the contracting entity through ownership/control relationships and must be assessed under applicable policy/law','It sets freight','It determines product quality','It replaces credit analysis'],0,'Screening the front company alone can miss the person or entity that ultimately owns or controls it.'),
        R => choice('A newly formed counterparty has no clear business history and opaque owners. What is the right response?',['Increase due diligence and do not proceed until required information/approvals are complete','Assume low risk because it is new','Accept a higher price instead','Use a different invoice description'],0,'Opacity is a reason for more evidence, not a premium that can simply be priced.'),
        R => { const direct=one(R,[20,30,40]), indirect=one(R,[15,25,35]); return numeric(`A person has ${direct}% direct economic ownership plus ${indirect}% indirect economic ownership through another vehicle. Simple combined economic ownership for this exercise?`,direct+indirect,'%',`${direct}% + ${indirect}% = ${direct+indirect}%. Actual control/legal tests depend on the applicable regime and facts.`); },
        R => { const entities=r(R,4,12), missing=r(R,1,3); return numeric(`A KYC file requires screening for ${entities} relevant entities/people and ${missing} remain unresolved. How many are currently cleared in this simplified workflow?`,entities-missing,'parties',`${entities} − ${missing} = ${entities-missing} parties.`); },

        R => choice('Sanctions screening for a physical trade should normally consider…',['Relevant counterparties, owners/controllers, banks, vessels, ports/routes and other transaction parties under applicable rules/policy','Only the seller name','Only the commodity ticker','Only the final invoice amount'],0,'Sanctions exposure can arise through different participants and transaction touchpoints.'),
        R => choice('A screening tool returns a possible name match. The correct response is…',['Pause the relevant workflow and resolve whether it is a true match under the firm escalation process','Ignore all automated alerts','Treat every fuzzy match as confirmed sanctions','Change the spelling and resubmit'],0,'Screening alerts require resolution; neither blind approval nor blind rejection is sound control.'),
        R => choice('Can an attractive margin compensate for a prohibited transaction?',['No; prohibited or unauthorised activity cannot be made acceptable by pricing a larger margin','Yes if margin exceeds expected fine','Only if payment is in another currency','Only if cargo is insured'],0,'Compliance constraints are hard constraints when the applicable rule prohibits the activity.'),
        R => { const checks=r(R,8,20), alerts=r(R,1,5); return numeric(`A transaction produces ${checks} screening checks and ${alerts} unresolved alerts. Checks with no unresolved alert?`,checks-alerts,'checks',`${checks} − ${alerts} = ${checks-alerts}.`); },
        R => { const value=r(R,2,10)*1000000, held=one(R,[25,50,75]); return numeric(`A payment of ${money(value)} is placed on hold pending sanctions review. What amount remains unavailable while the hold is in place?`,value,'$',`The full ${money(value)} remains unavailable until the hold is resolved; ${held}% is not a permissible assumption unless the bank/control process says so.`); },

        R => choice('Which maritime pattern can justify enhanced sanctions due diligence?',['Unexplained AIS gaps, unusual ship-to-ship activity, repeated identity/flag/ownership changes or route inconsistencies','A normal port call documented as scheduled','A vessel having a crew','A fixed bunker price'],0,'No single indicator proves evasion, but combinations of deceptive-shipping indicators require review.'),
        R => choice('Why screen vessels as well as commodity counterparties?',['A vessel/owner/operator or voyage can itself create sanctions and reputational exposure under applicable rules','Vessels set the futures price','Only charterers are screened','Ship identity never changes'],0,'The transport chain is part of the transaction risk.'),
        R => choice('Trade documents describe an origin that conflicts with vessel history and inspection evidence. Best action?',['Stop and investigate the inconsistency through compliance/operations before relying on the documents','Edit the history','Ignore physical evidence','Pay faster'],0,'Inconsistent origin/route evidence can be a serious trade-compliance red flag.'),
        R => { const voyage=r(R,20,60), gap=r(R,1,6); const pct=round(gap/voyage*100,1); return numeric(`A ${voyage}-day voyage has ${gap} days of unexplained AIS absence. What percentage of voyage time is the gap?`,pct,'%',`${gap} ÷ ${voyage} × 100 = ${pct}%. This is a screening indicator, not proof of wrongdoing.`,.1); },
        R => { const cargos=r(R,10,40), enhanced=r(R,2,8); const share=round(enhanced/cargos*100,1); return numeric(`${enhanced} of ${cargos} reviewed cargos require enhanced maritime due diligence. Share of reviewed cargos?`,share,'%',`${enhanced} ÷ ${cargos} × 100 = ${share}%.`,.1); },

        R => choice('A third-party agent requests an unusually high success fee to an offshore account unrelated to the transaction. This is…',['A red flag requiring due diligence and approval/escalation, not merely a higher cost line','Automatically legitimate if invoiced','Only FX risk','A quality issue'],0,'Unusual intermediaries, fees and payment destinations are classic conduct/financial-crime risk indicators.'),
        R => choice('Why do anti-bribery controls matter commercially in commodities?',['High-value cross-border flows, permits, state-linked entities and intermediaries can create corruption exposure that cannot be priced away','They only apply to banks','They improve futures liquidity','They replace sanctions screening'],0,'Commercial urgency does not override conduct obligations.'),
        R => choice('A customer asks you to route payment through an unrelated third party with no clear rationale. First response?',['Do not change the payment path until the business purpose and compliance requirements are satisfactorily resolved','Do it if settlement is faster','Split the invoice to avoid review','Change the counterparty name'],0,'Third-party payments can be legitimate, but unexplained changes are a material AML/KYC red flag.'),
        R => { const contract=r(R,5,30)*1000000, fee=one(R,[1,2,3,4]); return numeric(`An intermediary fee is ${fee}% of a ${money(contract)} contract. Fee amount to be reviewed?`,contract*fee/100,'$',`${money(contract)} × ${fee}% = ${money(contract*fee/100)}.`); },
        R => { const invoice=r(R,2,10)*1000000, request=r(R,1,5)*1000000; return numeric(`Invoice value is ${money(invoice)} and an unrelated third party is asked to receive ${money(request)} of the proceeds. Amount requiring separate explanation/review in this scenario?`,request,'$',`The ${money(request)} redirected amount is the specific exception requiring explanation and approval.`); },

        R => choice('When a compliance red flag cannot be resolved promptly, the commercial team should…',['Pause/limit the relevant activity and escalate according to policy rather than find a workaround','Rename the counterparty','Move the trade to a personal account','Proceed because opportunity may disappear'],0,'Escalation protects the firm and the employee; bypassing controls creates a second problem.'),
        R => choice('Why document the rationale for clearing a red flag?',['Future reviewers need evidence of facts checked, sources, decision and approval—not just a status of “cleared”','To make emails longer','Because all alerts are true positives','Only auditors can read it'],0,'An audit trail demonstrates how the decision was reached and supports consistent future review.'),
        R => choice('A trader pressures an analyst to suppress an alert. The correct response is…',['Preserve the alert and use the independent escalation/speak-up route defined by the firm','Delete it if the trade is profitable','Change the screening threshold privately','Ask the counterparty to self-clear'],0,'Control independence matters most when commercial pressure is highest.'),
        R => { const alerts=r(R,5,20), cleared=r(R,1,alerts-1); return numeric(`A review queue starts with ${alerts} alerts and ${cleared} are documented as resolved. Alerts still open?`,alerts-cleared,'alerts',`${alerts} − ${cleared} = ${alerts-cleared}.`); },
        R => { const cases=r(R,20,80,10), overdue=r(R,1,10); const pct=round(overdue/cases*100,1); return numeric(`${overdue} of ${cases} due-diligence cases exceed the internal review target. Overdue share?`,pct,'%',`${overdue} ÷ ${cases} × 100 = ${pct}%.`,.1); },

        R => choice('Strong compliance is integrated into deal design by…',['Checking parties, route, payment structure and purpose early enough to change or stop the transaction before commitments are made','Screening only after delivery','Leaving all decisions to Operations','Treating compliance as an invoice step'],0,'Early review preserves lawful commercial options and avoids stranded commitments.'),
        R => choice('A trade has strong margin, opaque ownership, unusual payment routing and unexplained vessel-history gaps. Best decision?',['Do not proceed until the combined red flags are satisfactorily investigated and approvals are obtained','Average the risks into a higher margin','Proceed because no single red flag proves a violation','Remove the vessel name from the recap'],0,'Risk-based compliance considers the transaction holistically; multiple unresolved indicators increase concern.'),
        R => choice('A risk-based compliance programme means…',['Controls and due diligence intensity are tailored to relevant customers, products, geographies and transaction risks while mandatory rules still apply','High-margin trades get lighter screening','Every transaction receives no screening','Only sanctioned parties are reviewed'],0,'Risk-based does not mean optional; it means resources and controls reflect risk while hard legal constraints remain hard.'),
        R => { const total=r(R,20,60)*1000000, blocked=r(R,2,12)*1000000, cleared=r(R,1,8)*1000000; return numeric(`A transaction programme totals ${money(total)}. ${money(blocked)} remains on compliance hold while ${money(cleared)} of earlier holds has been released. What amount is still currently held if ${money(blocked)} is the present outstanding hold?`,blocked,'$',`The present outstanding hold is ${money(blocked)}; released historical holds are not added back into the current hold.`); },
        R => { const expected=r(R,30,100)*1000000, paused=r(R,5,25)*1000000; return numeric(`A programme expected ${money(expected)} of turnover, but ${money(paused)} is paused pending review. Turnover still eligible to proceed before other constraints?`,expected-paused,'$',`${money(expected)} − ${money(paused)} = ${money(expected-paused)}.`); }
      ]
    },
    {
      id:'a18', title:'Assets, Infrastructure & Structured Deals', subtitle:'Value storage, processing and logistics assets as optionality—and know when infrastructure improves the merchant book.',
      division:'Assets & Investments', skill:'trading', phase:'Assets & Infrastructure', icon:'AST',
      lessons:['Storage optionality','Processing & tolling','Infrastructure capacity','Prepayments & structured supply','Investment economics','Asset-backed trading case'],
      goals:['Value physical carry and release optionality.','Translate conversion rights into commodity spreads.','Price reserved logistics capacity.','Understand how financing and supply rights interact.','Use simple NPV/payback logic before strategic claims.','Combine asset cash flow with trading optionality without double counting.'],
      concepts:[
        R => choice('A storage asset is more than warehouse rent because it gives the owner…',['The option to shift commodity availability through time, subject to capacity, losses and injection/withdrawal constraints','A guaranteed contango','No working-capital need','A fixed futures profit'],0,'Storage monetises time spreads and operational optionality only when the spread exceeds all relevant costs and constraints.'),
        R => choice('Why can fast withdrawal capability be valuable even with the same tank capacity?',['It lets the trader respond to short-lived prompt tightness that slow infrastructure cannot capture','It increases tank volume','It eliminates basis risk','It fixes inventory price'],0,'Asset value depends on deliverability and flexibility, not just nameplate capacity.'),
        R => choice('Storage economics should include…',['Spread value less rent/opex, finance, losses and execution constraints','Only the forward spread','Only rent','Only commodity price direction'],0,'A positive curve spread is not automatically a profitable physical carry.'),
        R => { const spread=r(R,8,28,2), storage=r(R,2,8), finance=r(R,2,7), loss=r(R,1,4); return numeric(`Deferred premium $${spread}/t; storage/handling $${storage}/t, finance $${finance}/t and expected loss $${loss}/t. Net carry value?`,spread-storage-finance-loss,'$/t',`${spread} − ${storage} − ${finance} − ${loss} = $${spread-storage-finance-loss}/t.`); },
        R => { const cap=r(R,20,100,10)*1000, used=r(R,10,90,10); const volume=cap*used/100; return numeric(`Storage capacity ${cap.toLocaleString('en-US')} t is ${used}% utilised. Inventory in tank?`,volume,'t',`${cap.toLocaleString('en-US')} × ${used}% = ${volume.toLocaleString('en-US')} t.`); },

        R => choice('A tolling agreement gives a trader primarily…',['The right to convert feedstock into products under defined fees/yields without necessarily owning the plant','Guaranteed product prices','Free feedstock','A credit rating'],0,'Tolling separates asset ownership from conversion optionality.'),
        R => choice('The economic trigger to run a flexible processor is…',['Expected product value minus feed, variable conversion, carbon/energy and other incremental costs, subject to constraints','Highest headline product price','Maximum throughput every day','Lowest futures volume'],0,'A processor should run when incremental economics justify it and the asset can physically perform.'),
        R => choice('Why must yield assumptions be stress-tested?',['Small yield changes on large throughput can materially alter product output and margin','Yield is fixed by contract forever','Only accountants use yield','Yield affects volume but never P&L'],0,'Conversion economics are highly sensitive to how much saleable output is actually recovered.'),
        R => { const feed=r(R,600,900,25), yieldPct=one(R,[90,92,94,96]), product=r(R,680,1050,25), variable=r(R,20,60,5); const margin=round(product*yieldPct/100-feed-variable,1); return numeric(`Feed costs $${feed}/t. Saleable yield ${yieldPct}%, product value $${product}/t of product and variable conversion cost $${variable}/t feed. Approximate margin per tonne of feed?`,margin,'$/t feed',`$${product} × ${yieldPct}% − $${feed} − $${variable} = $${margin}/t feed.`,.1); },
        R => { const throughput=r(R,100,500,50)*1000, margin=r(R,5,30,5); return numeric(`A tolling right processes ${throughput.toLocaleString('en-US')} t/year at expected incremental margin $${margin}/t. Annual contribution before fixed fees?`,throughput*margin,'$',`${throughput.toLocaleString('en-US')} × $${margin} = ${money(throughput*margin)}.`); },

        R => choice('Reserved terminal or pipeline capacity creates value when…',['Access would otherwise be scarce/expensive and the merchant can earn more from flows than the capacity cost','Capacity is always free','It removes commodity risk','It guarantees customers'],0,'Infrastructure can create an access advantage, but unused fixed capacity is a cost.'),
        R => choice('A take-or-pay capacity contract creates downside because…',['You may owe the capacity fee even when you do not have profitable volumes to move','You pay only when used','It eliminates volume risk','It fixes commodity prices'],0,'Fixed infrastructure commitments convert optional cost into fixed operating leverage.'),
        R => choice('When comparing two terminals, headline tariff is insufficient because…',['Location, draft, throughput rate, reliability, losses, blending and connectivity can change total economics','All terminals are operationally identical','Only tariff matters','Only tax matters'],0,'Infrastructure quality affects both cost and optionality.'),
        R => { const cap=r(R,50,300,50)*1000, fee=r(R,3,12), used=r(R,40,90,10); const eff=round(fee/(used/100),2); return numeric(`Reserved capacity ${cap.toLocaleString('en-US')} t/year costs $${fee}/t of reserved capacity and utilisation is ${used}%. Approximate fixed capacity cost per actually used tonne?`,eff,'$/used t',`$${fee} ÷ ${used}% = $${eff} per used tonne.`,.02); },
        R => { const qty=r(R,20,80,10)*1000, rate=r(R,2,8), alternative=rate+r(R,2,8); const save=(alternative-rate)*qty; return numeric(`Owned/reserved terminal route costs $${rate}/t versus $${alternative}/t spot alternative on ${qty.toLocaleString('en-US')} t. Gross logistics saving?`,save,'$',`($${alternative} − $${rate}) × ${qty.toLocaleString('en-US')} = ${money(save)}.`); },

        R => choice('A prepayment can be commercially attractive because it…',['Provides producer funding in exchange for supply/economic rights, while creating real credit/performance exposure','Eliminates counterparty risk','Is equivalent to cash-on-delivery','Guarantees commodity prices'],0,'Structured supply combines financing and trading; both legs must be underwritten.'),
        R => choice('Why link prepayment drawdown to collateral/delivery milestones?',['To reduce unsecured exposure as value is funded and product is produced/delivered','To make the contract longer','To increase price risk','To replace KYC'],0,'Structure can reduce risk, but it does not make performance risk disappear.'),
        R => choice('A structured deal should not book trading optionality twice because…',['The same economic benefit cannot be counted once in asset NPV and again as separate merchant profit without a clear incremental basis','Double counting is conservative','Optionality is always infinite','Accounting requires double counting'],0,'Investment decisions need a single consistent economic boundary.'),
        R => { const advance=r(R,5,25)*1000000, delivered=one(R,[20,30,40,50,60]); const remaining=advance*(1-delivered/100); return numeric(`Prepayment advance ${money(advance)}; ${delivered}% of the financed delivery obligation has been performed pro rata. Simplified remaining exposure before collateral/recoveries?`,remaining,'$',`${money(advance)} × (1 − ${delivered}%) = ${money(remaining)}.`); },
        R => { const cargo=r(R,10,50)*1000000, advance=one(R,[60,70,80]); const loan=cargo*advance/100; return numeric(`Eligible financed commodity value ${money(cargo)} with a ${advance}% advance rate. Simplified maximum funded amount?`,loan,'$',`${money(cargo)} × ${advance}% = ${money(loan)}.`); },

        R => choice('NPV differs from simple payback because NPV…',['Discounts the timing of future cash flows and includes value after the payback point','Ignores time value of money','Uses only accounting revenue','Is always positive'],0,'Payback is intuitive but incomplete; discounted cash flow compares value across time.'),
        R => choice('An asset investment justified mainly by trading synergies should…',['Specify which incremental flows/options are genuinely created and stress whether they persist','Assume every current trade will continue forever','Ignore fixed costs','Use gross revenue as profit'],0,'Strategic optionality is real only when the firm can identify and capture it.'),
        R => choice('A high-capex asset with volatile merchant earnings should be tested for…',['Downside cases, utilisation, margin compression, funding and exit/residual-value assumptions','Only the best historical year','Only engineering throughput','Only current benchmark price'],0,'Long-lived assets convert uncertain spreads into fixed capital commitments.'),
        R => { const capex=r(R,20,100,10)*1000000, annual=r(R,5,25,5)*1000000; const payback=round(capex/annual,1); return numeric(`Project capex ${money(capex)} and expected annual cash contribution ${money(annual)}. Simple undiscounted payback period?`,payback,'years',`${money(capex)} ÷ ${money(annual)} = ${payback} years.`,.1); },
        R => { const invest=r(R,10,50)*1000000, cash1=r(R,4,15)*1000000, cash2=r(R,4,15)*1000000, rate=10; const npv=round(-invest+cash1/1.1+cash2/(1.1*1.1)); return numeric(`Two-year simplified project: invest ${money(invest)} now, receive ${money(cash1)} in year 1 and ${money(cash2)} in year 2. At a 10% discount rate, approximate NPV?`,npv,'$',`−${money(invest)} + ${money(cash1)}/1.10 + ${money(cash2)}/1.10² ≈ ${money(npv)}.`,Math.max(2,Math.round(Math.abs(npv)*.001))); },

        R => choice('The best reason for a trading house to own infrastructure is…',['Durable access, information or optionality that improves risk-adjusted merchant economics enough to justify fixed capital and operating risk','Prestige','To eliminate competition','Because every trader should own assets'],0,'Assets should strengthen the merchant system, not become an unrelated capital burden.'),
        R => choice('Asset utilisation falls but spot trading margins rise. What should management ask?',['Whether the asset still creates incremental access/options or is merely a fixed cost while trading succeeds elsewhere','Only whether revenue rose','Whether futures volume increased','Whether the building is fully depreciated'],0,'Asset and trading P&L should be separated before assessing synergy.'),
        R => choice('A pipeline, storage tank and long-term offtake together can create…',['A portfolio of linked physical optionality, but also correlated concentration and fixed commitments','Risk-free arbitrage','No credit exposure','Automatic monopoly'],0,'Integrated assets increase control of the chain while concentrating operational, credit and capital risk.'),
        R => { const trading=r(R,3,15)*1000000, asset=r(R,2,10)*1000000, fixed=r(R,1,6)*1000000; return numeric(`Annual merchant contribution ${money(trading)}, asset service contribution ${money(asset)}, fixed asset costs ${money(fixed)}. Combined contribution before financing/tax?`,trading+asset-fixed,'$',`${money(trading)} + ${money(asset)} − ${money(fixed)} = ${money(trading+asset-fixed)}.`); },
        R => { const capex=r(R,20,80)*1000000, trading=r(R,2,10)*1000000, infra=r(R,2,8)*1000000; const simple=round((trading+infra)/capex*100,1); return numeric(`Asset capex ${money(capex)}, annual incremental trading benefit ${money(trading)} and infrastructure contribution ${money(infra)}. Simple annual contribution/capex ratio?`,simple,'%',`(${money(trading)} + ${money(infra)}) ÷ ${money(capex)} × 100 = ${simple}%. This is not an IRR; it is a simple screening ratio.`,.1); }
      ]
    }
  ];

  // Five concept slots per lesson, curated so generated questions stay on the lesson's
  // actual learning objective instead of sampling the whole desk indiscriminately.
  /* Concetti aggiuntivi, tenuti fuori dagli array originali di `worlds` così
     il contenuto già scritto resta intatto e revisionabile a parte.
     Servono per riempire 30 slot per desk senza ripetere una domanda a scelta:
     con 10 concetti su 30 slot ogni domanda a scelta ricompariva identica
     fino a sei volte, una per lezione. */
  const EXTRA = {};
  /* @EXTRA-INIZIO */
  EXTRA.a1 = [
    R => choice('Days of cover fall from 45 to 22 while the balance stays in deficit. What does that tell you?',
      ['The market has less buffer left, so price becomes more sensitive to any disruption','That prices must fall','That freight will drop','That the deficit has been resolved'],0,
      'Cover measures how long the market can absorb a shock. Low cover plus a deficit is the setup for a violent move on small news.'),
    R => choice('A balance shows a surplus but prices keep rising. What is the most likely explanation?',
      ['The surplus is in the wrong place or the wrong grade to reach the buyers who need it','The balance is always wrong','Prices ignore fundamentals','Freight has no effect'],0,
      'A global balance hides location and quality. Material stranded behind a bottleneck does not relieve a tight consuming region.'),
    R => choice('Why is a netback more useful than a headline benchmark when choosing where to sell?',
      ['It nets freight, handling and quality back to your loading point, so two destinations become comparable','It is easier to remember','It removes credit risk','It fixes the freight market'],0,
      'Two destinations can show the same benchmark and pay you very differently once the route is paid for.'),
    R => choice('Processing margins collapse to near zero across an industry. What usually follows?',
      ['Run cuts, which reduce demand for feedstock and supply of product','An immediate price cap','Higher processing rates','No change in flows'],0,
      'Negative margins are self-correcting: plants cut runs, and the feedstock and product balances both shift.'),
    R => choice('You have a strong bearish view but the curve is in steep backwardation. What does the curve tell you?',
      ['The physical market is tight now, whatever happens later','That your view is correct','That storage is profitable','Nothing about the present'],0,
      'Backwardation is the market paying for immediacy. It can coexist with a weak forward view, and it makes being short the front expensive.'),
    R => choice('Which evidence would most change a supply–demand view?',
      ['A confirmed change in operating capacity or an unexpected inventory draw','A single day of price movement','A headline without numbers','Another analyst agreeing'],0,
      'Views should move on quantities, not on price action that may simply be positioning.'),
    R => choice('Why do desks track floating storage separately from onshore stocks?',
      ['Cargoes at sea are already committed to a route and reach the market on a different timetable','It looks better in a report','It is the same as onshore stock','Ships cannot store cargo'],0,
      'Where inventory sits changes when and where it can be delivered, which is what the physical market prices.'),
    R => choice('A producing region loses export capacity for two months. What is the first-order effect?',
      ['A regional surplus at origin and a deficit at destination, widening the spread between them','A uniform global price fall','No change, since total supply is unchanged','Freight becomes irrelevant'],0,
      'Supply that cannot move is not supply. Logistics failures show up as spreads before they show up in the balance.'),
    R => choice('What is the honest limit of a supply–demand balance?',
      ['It is an estimate built on reported data with revisions and gaps, not a measurement','It is exact once published','It predicts price levels directly','It replaces judgement'],0,
      'Balances are directional tools. Treating them as precise is how people become confidently wrong.'),
    R => { const cap=r(R,80,140), util=one(R,[72,78,85,91]); const out=round(cap*util/100,1);
      return numeric(`Capacity is ${cap} Mt a year and utilisation is ${util}%. Approximate output?`,out,'Mt',
        `${cap} × ${util}% = ${out} Mt. Utilisation is where a supply forecast usually goes wrong.`,.06); },
    R => { const base=r(R,60,120), growth=one(R,[2,3,4,5]); const next=round(base*(1+growth/100),1);
      return numeric(`Demand is ${base} Mt and grows ${growth}% next year. Demand next year?`,next,'Mt',
        `${base} × (1 + ${growth}%) = ${next} Mt. A few points of demand growth on a large base can absorb an entire new plant.`,.06); },
  ];

  EXTRA.a2 = [
    R => choice('A buyer asks for a ±10% quantity option at their choice. What have you given away?',
      ['A free option: they will take more when the market suits them and less when it does not','Nothing, since the price is fixed','A credit improvement','A freight saving'],0,
      'Operational tolerances are options. If you do not price them, the counterparty exercises them against you.'),
    R => choice('Your purchase prices on the month of loading and your sale on the month of discharge. What have you created?',
      ['A timing exposure between two different quotation periods','A perfect back-to-back','A freight hedge','A credit enhancement'],0,
      'Matching volumes is not matching risk. Different pricing windows leave you long or short the spread between them.'),
    R => choice('Which deal would a disciplined desk prefer?',
      ['Smaller margin with a known counterparty and clean logistics','Largest headline margin regardless of terms','The one with the biggest volume','The one that closes fastest'],0,
      'Margin that cannot be collected or executed is not margin. Volume is a vanity metric on a physical desk.'),
    R => choice('You can nominate one of three discharge ports. What is that worth?',
      ['It is optionality you can value and monetise by choosing the best netback at the time','Nothing until discharge','Only a freight saving','A quality upgrade'],0,
      'Destination flexibility is one of the most valuable and most under-priced features in a physical contract.'),
    R => choice('Why do desks look at the book rather than each trade alone?',
      ['Positions offset, and the real exposure is the net across deals','To simplify reporting','Because single trades never matter','To avoid hedging'],0,
      'Two trades that look risky alone can be flat together, and two that look safe can compound.'),
    R => choice('A counterparty offers a price well above the market for prompt delivery. What should you check first?',
      ['Why they need it, and whether they can pay and perform','Nothing, take it','Only the freight','Only the currency'],0,
      'An unusually good price usually carries an unusually good reason. Often it is distress, and distress carries credit risk.'),
    R => choice('What does "washout" mean in a physical contract?',
      ['Cancelling the physical delivery and settling the price difference in cash','Cleaning the cargo tanks','Refusing to pay','Switching the vessel'],0,
      'A washout closes a contract financially when delivery no longer makes sense for either side.'),
    R => choice('Your margin depends on a quality premium the buyer disputes on arrival. What was the mistake?',
      ['Not agreeing the specification, sampling method and binding certificate before shipment','Shipping too early','Using an incoterm','Hedging the flat price'],0,
      'Quality disputes are decided by the words agreed beforehand, not by who is more certain afterwards.'),
    R => choice('Why is a signed recap not the same as a concluded contract?',
      ['Open items and conflicting standard terms can still change the economics materially','It always is the same','Recaps are not binding at all','Contracts are optional'],0,
      'Most commercial arguments live in the gap between the recap and the full contract.'),
    R => { const t=r(R,20,60,5)*1000, sp=r(R,8,30); const tot=t*sp;
      return numeric(`You improve the netback by $${sp}/t on ${t.toLocaleString('en-US')} t. Total contribution?`,tot,'$',
        `${t.toLocaleString('en-US')} × ${sp} = ${money(tot)}. Small per-tonne gains matter because tonnage is large.`); },
  ];

  EXTRA.a3 = [
    R => choice('An owner refuses your cargo despite a freight rate above the last done. Why might that be rational?',
      ['Their time charter equivalent is lower than an alternative voyage they can take instead','Owners refuse cargoes at random','They dislike the commodity','Freight rates do not matter to owners'],0,
      'Owners compare in dollars per day. A high rate on a slow, badly positioned voyage can still lose to a lower rate on a fast one.'),
    R => choice('Why does a laycan that is too narrow cost you money even if the ship arrives?',
      ['Owners price the risk of missing the window into the rate, and you lose bargaining power','Narrow laycans are always free','It only affects the seller','It removes demurrage'],0,
      'Flexibility is worth money to the person who has it. Giving it up is a real cost even when nothing goes wrong.'),
    R => choice('You are quoted the same rate for two routes of equal distance. What still differs?',
      ['Port time, canal dues, bunker prices at the load port and where the ship ends up','Nothing, distance decides','Only the flag','Only the cargo'],0,
      'Distance is one input. Days are the currency, and port and canal time consume days without earning them.'),
    R => choice('Why is demurrage often a negotiation rather than an arithmetic result?',
      ['Whether the NOR was valid and which delays counted are matters of interpretation','Because the rate is unclear','Because nobody records time','Because owners always waive it'],0,
      'The daily rate is agreed; what is contested is how many hours qualify.'),
    R => choice('Valid NOR has been tendered, laytime has started, the allowed laytime is exhausted and no charterparty exception applies. Port congestion continues. What normally follows?',
      ['Time runs on demurrage for the charterer at the agreed rate','The owner automatically bears all delay','Laytime resets to zero','The port pays the charterer'],0,
      'Once valid laytime is exhausted, qualifying time normally runs on demurrage unless the charterparty provides an applicable exception.'),
    R => choice('Bunker prices rise sharply between your indication and the fixture. What happens?',
      ['The owner rebuilds the quote, because bunkers are a voyage cost they cannot recover later','The old quote stands','Only the charterer is affected','Nothing changes'],0,
      'A freight indication assumes a fuel price. Once fuel moves, a stale indication is not a price.'),
    R => choice('Why do desks watch the ballast position of the fleet, not just the freight index?',
      ['The index is an average; what you pay depends on which ships can actually reach you','Indices are wrong','Ballast legs are free','Positions are secret'],0,
      'Freight is priced by the marginal available ship, and availability is local.'),
    R => choice('What does a sub-let of a time-chartered vessel expose you to?',
      ['You remain liable to the head owner while depending on the performance of your sub-charterer','Nothing at all','Only a freight gain','A credit improvement'],0,
      'Chartering in and out builds a chain, and you sit in the middle of it holding both obligations.'),
    R => { const t=r(R,25,70,5)*1000, rate=r(R,18,48); const f=t*rate;
      return numeric(`Freight is $${rate}/t on ${t.toLocaleString('en-US')} t. Total freight?`,f,'$',
        `${t.toLocaleString('en-US')} × ${rate} = ${money(f)}. On a cargo worth tens of millions this is often several percent of the value.`); },
    R => { const days=r(R,18,42), hire=r(R,12,40)*1000, port=r(R,60,220)*1000; const tot=days*hire+port;
      return numeric(`Hire is ${money(hire)}/day for ${days} days, plus ${money(port)} of port costs. Total cost before bunkers?`,tot,'$',
        `${days} × ${money(hire)} + ${money(port)} = ${money(tot)}. Bunkers come on top, and they are usually the largest and most volatile piece.`); },
  ];
  EXTRA.a4 = [
    R => choice('A bank lends against your inventory at an 80% advance rate. What happens if the price falls 30%?',
      ['The borrowing base shrinks and you may have to repay or post more collateral, exactly when cash is tight','Nothing, the facility is fixed','The advance rate rises','Interest stops accruing'],0,
      'Asset-based lending is procyclical: the collateral and the credit available fall together, which is why a price crash becomes a funding crisis.'),
    R => choice('Why does a seller ask for a letter of credit to be confirmed?',
      ['It adds a second bank’s undertaking, covering the risk of the issuing bank or its country','It speeds up shipment','It removes quality disputes','It reduces the freight'],0,
      'An LC is only as good as the bank behind it. Confirmation moves that risk to a bank the seller is willing to face.'),
    R => choice('What is the practical difference between a documentary LC and a standby LC?',
      ['A documentary LC is the intended payment route; a standby is a guarantee drawn only if the buyer defaults','They are identical','A standby is cheaper always','Only the currency differs'],0,
      'One is how you expect to be paid; the other is what you fall back on when you are not.'),
    R => choice('Your documents are refused for a discrepancy. What are your realistic options?',
      ['Correct and re-present if time allows, ask the buyer to waive, or fall back on open account risk','Sue the bank immediately','Ignore it, payment is automatic','Cancel the shipment'],0,
      'Banks are entitled to refuse on strict compliance. Most discrepancies are resolved commercially, which hands leverage to the buyer.'),
    R => choice('Why does a desk measure days sales outstanding?',
      ['It shows how long cash stays with customers, which sets how much funding the volume needs','It measures profit','It is a tax figure','It replaces credit limits'],0,
      'Every extra day of receivable is financed. On thin margins, collection speed can matter as much as price.'),
    R => choice('A supplier offers you a discount if you prepay before delivery. What have you become economically?',
      ['An unsecured or partly secured creditor to the supplier until delivery','A shipowner','A clearing house','A warehouse'],0,
      'Prepayment moves cash before performance. Until cargo is delivered or collateral is realised, you carry supplier credit/performance exposure.'),
    R => choice('What does assignment of receivables give a lender?',
      ['A direct claim on the money your buyer owes you, improving their security','Ownership of the cargo','A quality guarantee','A freight discount'],0,
      'Structured trade finance works by attaching the lender to specific cash flows rather than to your balance sheet alone.'),
    R => choice('Credit insurance covers your buyer. Why is it not the same as being paid?',
      ['Cover has exclusions, deductibles, waiting periods and its own claim risk','It is exactly the same','It pays before default','It removes all documentation'],0,
      'Insurance changes who you are exposed to and when you get paid, not whether the exposure exists.'),
    R => choice('Why do desks net exposures with a counterparty across contracts?',
      ['A single netting agreement lets offsetting positions reduce the amount actually at risk','To simplify invoices','Because regulators forbid gross','It increases exposure'],0,
      'Without enforceable netting, you are exposed gross even when the economics offset.'),
    R => { const price=r(R,600,900,10), days=r(R,30,90,15), rate=one(R,[5,6,7,8]); const cost=round(price*(rate/100)*(days/360),2);
      return numeric(`Financing ${money(price)}/t of cargo for ${days} days at ${rate}% a year on a 360-day basis. Finance cost per tonne?`,cost,'$/t',
        `${price} × ${rate}% × ${days}/360 = $${cost}/t. Compare this with the margin before agreeing longer payment terms.`,.02); },
  ];

  EXTRA.a5 = [
    R => choice('Your VaR is comfortably inside the limit and the desk still loses more than VaR in a day. What went wrong?',
      ['Nothing necessarily: VaR is a threshold that is expected to be breached occasionally, not a maximum','The model is broken','The limit was wrong','The loss must be an error'],0,
      'A 95% VaR is expected to be exceeded about one day in twenty. Being surprised by that means it was being read as a ceiling.'),
    R => choice('Why can a desk be within every price limit and still fail?',
      ['Limits on price risk say nothing about funding, concentration or the ability to perform','Because limits are decorative','Because prices always move','It cannot fail'],0,
      'The risks that end desks are usually cash and counterparties, and neither appears in a price limit.'),
    R => choice('What is the purpose of an independent risk function?',
      ['To measure and constrain exposure without the incentive of the person taking it','To approve trades faster','To forecast prices','To find counterparties'],0,
      'The control only works because the person applying it does not benefit from the position.'),
    R => choice('A correlation that has held for five years breaks in a week. Why is that predictable?',
      ['Correlations tend to break exactly when markets are stressed, which is when the hedge was needed','It is never predictable','Correlations are constant','It only affects equities'],0,
      'Statistical relationships are calm-market artefacts. Stress tests exist because of this.'),
    R => choice('What does a stop-loss discipline actually protect against?',
      ['The tendency to hold a losing position hoping to be proved right','Market volatility itself','Credit default','Freight risk'],0,
      'It is a control on behaviour more than on the market. Its value is that it is decided before the loss.'),
    R => choice('Why report position and exposure separately?',
      ['Position is what you hold; exposure is what your P&L does when something moves','They are the same','Exposure is an accounting term','Position includes cash'],0,
      'A large position can carry small exposure if it is hedged, and a small one can carry large exposure if it is not.'),
    R => choice('A single grade, single port, single buyer trade is 40% of the book. Which limit catches this?',
      ['A concentration limit, since price limits would show the total as acceptable','A VaR limit','A stop-loss','No limit needed'],0,
      'Concentration hides inside an acceptable total. It needs its own constraint.'),
    R => choice('What is model risk on a commodity desk?',
      ['The risk that the assumptions inside your valuation or hedge model do not hold in the market you are in','The risk of a computer failure','The risk of a wrong price feed only','A regulatory category with no effect'],0,
      'A model is a set of assumptions with numbers attached. When the assumptions fail, the numbers stay confident.'),
    R => choice('Why does an operational error belong in the risk report?',
      ['A missed nomination or a wrong document can cost more than a price move','It does not belong there','Only price risk counts','Operations cannot lose money'],0,
      'On physical desks, execution failures are a routine and material source of loss.'),
    R => { const pos=r(R,20,80,5)*1000, price=r(R,6500,10500,250), vol=one(R,[1.2,1.4,1.6,1.8,2.0]); const z=1.645; const v=round(pos*price*(vol/100)*z);
      return numeric(`You are long ${pos.toLocaleString('en-US')} t at $${price}/t. Estimated one-day price volatility is ${vol}%. Using a 95% factor of 1.645, what is the one-day parametric VaR?`,v,'$',
        `${pos.toLocaleString('en-US')} × $${price} × ${vol}% × 1.645 ≈ ${money(v)}. VaR is a model estimate, not a maximum-loss bound.`,Math.max(2,Math.round(v*0.001))); },
  ];

  EXTRA.a6 = [
    R => choice('Why do commodity desks often use Asian (average price) options rather than plain vanilla?',
      ['Physical contracts usually price off an average over a quotation period, so the hedge should too','They are cheaper only','They never expire','They remove credit risk'],0,
      'A hedge should match how the cargo is priced. Hedging an averaged exposure with a single-date option leaves a timing mismatch.'),
    R => choice('You buy a put to protect a long inventory. What is the worst case?',
      ['You lose the premium, and keep the upside on the physical','Unlimited loss','You must deliver the cargo','The premium is refunded'],0,
      'A bought option has known, limited cost. That is what you pay for compared with a futures hedge.'),
    R => choice('What is a zero-cost collar?',
      ['Buying protection and selling away some upside so the premiums offset','An option with no risk','A freight contract','A credit instrument'],0,
      'It is not free: you paid with the upside you gave away, which is a real cost if the market rallies.'),
    R => choice('Why does a swap suit a refiner with steady monthly volumes?',
      ['It fixes an average price over a period without daily margining on a futures position','It removes all price risk forever','It guarantees supply','It replaces the physical contract'],0,
      'Swaps settle against an average and are usually bilateral, which fits a regular physical programme.'),
    R => choice('Implied volatility rises sharply while the price is unchanged. What has happened?',
      ['The market is pricing more uncertainty ahead, so options become more expensive','Nothing meaningful','The price must fall','Options become cheaper'],0,
      'Volatility is a traded quantity of its own. Hedging costs can rise without the underlying moving at all.'),
    R => choice('What does delta tell a hedger?',
      ['Roughly how much of the underlying the option currently behaves like','The expiry date','The premium paid','The credit exposure'],0,
      'Delta is how much of a futures position the option is equivalent to right now, and it changes as the market moves.'),
    R => choice('Why is selling options to earn premium dangerous for a physical desk?',
      ['The premium is small and known while the loss is large and uncertain, and margin is called in cash','It is not dangerous','Premium income is guaranteed','Sold options cannot be exercised'],0,
      'Writing options converts a trading business into an insurance business, usually without the capital to match.'),
    R => choice('What is a basis swap used for?',
      ['Hedging the difference between two related prices rather than the outright level','Fixing the freight','Buying physical cargo','Removing credit risk'],0,
      'It targets exactly the risk a plain futures hedge leaves behind.'),
    R => choice('A spread option pays on the difference between two prices. Where does that fit?',
      ['Processing or location economics, where the margin is itself a spread','Only for speculation','Nowhere in physical trading','Only for freight'],0,
      'Refining and arbitrage margins are spreads, so the natural hedge is an instrument on the spread.'),
    R => { const t=r(R,10,40,5)*1000, delta=one(R,[0.3,0.45,0.6,0.75]); const eq=Math.round(t*delta);
      return numeric(`You hold options on ${t.toLocaleString('en-US')} t with a delta of ${delta}. How many tonnes of futures do they currently behave like?`,eq,'t',
        `${t.toLocaleString('en-US')} × ${delta} = ${eq.toLocaleString('en-US')} t. Delta changes as the market moves, so the hedge has to be revisited.`,1); },
  ];
  EXTRA.a7 = [
    R => choice('What does an LME warrant represent?',
      ['Title to a specific lot of metal in an approved warehouse','A futures contract','A shipping document','A credit line'],0,
      'Warrants are how metal ownership transfers without the metal moving, which is what makes LME delivery work.'),
    R => choice('Warehouse rent and load-out queues lengthen at a major location. What happens to the regional premium?',
      ['It tends to rise, because getting metal out costs more time and money','It falls to zero','It is unaffected','Only freight changes'],0,
      'Physical premiums price the cost and delay of getting usable metal, not just the exchange price.'),
    R => choice('Why is an exchange price alone not the price a consumer pays?',
      ['They pay the exchange price plus a physical premium for location, form, brand and timing','Consumers pay less','Premiums are illegal','The exchange price includes everything'],0,
      'The premium is where the physical desk earns, and it moves for reasons the screen does not show.'),
    R => choice('What is a tolling arrangement on a metals desk?',
      ['You supply raw material and pay a plant to convert it, keeping ownership of the metal','Buying finished metal outright','A freight contract','A credit facility'],0,
      'Tolling separates the processing service from the ownership of the material, and the risk stays with you.'),
    R => choice('Treatment and refining charges rise sharply. Who is under pressure?',
      ['Mines, since more of the metal value is retained by the smelter','Smelters only','Consumers only','Nobody'],0,
      'TC/RCs are the smelter’s margin and the miner’s cost. They move with concentrate availability.'),
    R => choice('Why does metal form matter commercially?',
      ['Cathode, ingot, billet and scrap are not interchangeable for a given consumer’s process','Form never matters','Only weight matters','It only affects freight'],0,
      'A cargo that does not fit the buyer’s process is worth less to them regardless of purity.'),
    R => choice('You hedge a copper cargo on the exchange and still lose money. What is the likely cause?',
      ['The physical premium or the timing moved against you: the hedge covered the exchange price only','The hedge failed','The exchange defaulted','Copper is unhedgeable'],0,
      'The hedge removes the flat price. Premium and QP mismatch are exactly what it leaves you holding.'),
    R => choice('What risk does financing metal in a warehouse carry beyond price?',
      ['That the warrant, the warehouse or the title itself proves defective','No additional risk','Only rent','Only insurance'],0,
      'Metal financing scandals have generally been title and documentation failures, not price failures.'),
    R => choice('Why do consumers sign annual premium contracts rather than buying spot?',
      ['They need guaranteed availability and a budgetable cost, and will pay for that certainty','Spot is unavailable','Premiums are fixed by law','To speculate'],0,
      'Selling that certainty is a legitimate product, and pricing it wrongly is how a desk gets hurt for a whole year.'),
    R => { const lme=r(R,7800,9600,100), prem=r(R,90,260,5), t=r(R,500,3000,100); const val=(lme+prem)*t;
      return numeric(`LME is ${money(lme)}/t and the premium is $${prem}/t on ${t.toLocaleString('en-US')} t. Total cargo value?`,val,'$',
        `(${lme} + ${prem}) × ${t.toLocaleString('en-US')} = ${money(val)}. The base-metal benchmark and the physical premium are separate exposures; premium hedgeability depends on the metal, region and available exchange or OTC instruments.`); },
  ];

  EXTRA.a8 = [
    R => choice('Why are crude grades quoted as a differential to a benchmark?',
      ['Quality and location differ, so the market prices the difference rather than each grade outright','To hide the price','Because benchmarks are wrong','Only for tax'],0,
      'The benchmark carries the flat price; the differential carries everything specific about the barrel.'),
    R => choice('A refinery’s crack spread widens sharply. What is the likely commercial response?',
      ['Higher runs, pulling more crude and pushing more product into the market','Immediate shutdown','No response','Lower product output'],0,
      'Refining margins are the signal that moves crude demand and product supply at the same time.'),
    R => choice('Why does a heavy sour crude usually trade below a light sweet one?',
      ['It yields less high-value product and needs more processing to meet specification','It weighs more','It is older','Freight is higher'],0,
      'Crude is priced on what it can be turned into, not on the barrel itself.'),
    R => choice('You buy a cargo pricing on the month of loading and sell pricing on the month of arrival. What is the exposure?',
      ['The spread between two months, which can move even if the flat price does not','None, it is matched','Only freight','Only credit'],0,
      'This is the classic QP mismatch, and it is why the calendar spread is a position you did not intend to take.'),
    R => choice('What does contango do to a floating-storage trade in products?',
      ['It can pay for the freight, financing and losses if the spread is wider than the carry','It always makes it profitable','It is irrelevant','It reduces freight'],0,
      'Storage economics are a comparison of the forward spread with the full cost of carry, freight included.'),
    R => choice('A products cargo fails the flash point specification on arrival. What is the commercial reality?',
      ['It becomes a discounted or reblended cargo, and who pays depends on which certificate is binding','The buyer must accept it','It is worthless','The ship pays'],0,
      'Off-spec product usually finds a home at a price. The argument is about the contract, not the chemistry.'),
    R => choice('Why do desks watch refinery maintenance schedules?',
      ['Planned outages change crude demand and product supply on known dates','They do not','Only for safety','Only for freight'],0,
      'Maintenance is one of the few genuinely forecastable shifts in a balance.'),
    R => choice('Blending two components to meet a specification is attractive when…',
      ['The blended product is worth more than the weighted cost of the components','It is always attractive','Never','Only in contango'],0,
      'Blending is a margin business with a hard constraint: the result has to actually meet every spec, not just the one you optimised.'),
    R => choice('What does a "prompt" cargo premium usually indicate?',
      ['Immediate physical tightness at that location, whatever the forward curve says','A long-term shortage','A freight problem only','A credit issue'],0,
      'Prompt premiums are the clearest physical signal a desk gets, and they are local.'),
    R => { const bbl=r(R,300,900,50)*1000, diff=r(R,1,6); const pnl=bbl*diff;
      return numeric(`A differential strengthens by $${diff}/bbl on ${bbl.toLocaleString('en-US')} bbl you own. P&L impact?`,pnl,'$',
        `${bbl.toLocaleString('en-US')} × ${diff} = ${money(pnl)}. A futures hedge on the benchmark would not have captured this.`); },
  ];

  EXTRA.a9 = [
    R => choice('Why is LNG shipping capacity a commercial constraint and not just a cost?',
      ['Vessels are specialised and scarce, so without one the arbitrage cannot be executed at all','It is only a cost','Any ship can carry LNG','Shipping is unlimited'],0,
      'In LNG the ship is often the binding constraint on whether a trade exists.'),
    R => choice('What is boil-off on an LNG voyage?',
      ['Cargo that vaporises in transit, part of which is used as fuel','Cargo theft','A quality claim','A port charge'],0,
      'It is a predictable loss of volume that has to be in the contract and in the economics.'),
    R => choice('Why do destination clauses matter so much in LNG?',
      ['They restrict reselling the cargo to a better market, removing optionality','They fix the price','They cover quality','They are decorative'],0,
      'Free destination is one of the most valuable features an LNG contract can have.'),
    R => choice('A cargo can go to Asia or Europe. What decides it?',
      ['The delivered netback after freight, boil-off and regas costs, not the headline index','The higher index alone','Distance only','The charterer'],0,
      'Two indices are not comparable until the whole route is paid for.'),
    R => choice('Why is gas demand more weather-sensitive than most commodities?',
      ['Heating and cooling load moves with temperature, and storage cannot absorb every extreme','It is not','Only industry uses gas','Because of freight'],0,
      'Weather is a fundamental, not a nuisance, and it is why gas curves move on forecasts.'),
    R => choice('What does a regasification terminal slot give a trader?',
      ['The right to unload at a specific time, without which the cargo cannot reach the market','A price guarantee','A credit line','A quality certificate'],0,
      'Infrastructure access is a tradable right and a real barrier to entry.'),
    R => choice('Gas storage is full in early autumn. What does that usually imply for the winter spread?',
      ['A narrower spread, because the market has already bought the winter it needed','A wider spread','No effect','Higher freight only'],0,
      'Storage is the physical link between summer and winter prices.'),
    R => choice('Why can a hub price disconnect from an oil-indexed contract price?',
      ['They price different things: local gas supply and demand versus a formula linked to oil','They never differ','Hubs are unreliable','Oil indexation is illegal'],0,
      'Contract renegotiations in gas have historically come from exactly this gap.'),
    R => choice('What is the risk of selling a cargo before securing the ship?',
      ['Shipping may be unavailable or far more expensive, turning a margin into a loss','No risk','Only a delay','Only a credit issue'],0,
      'In LNG the freight leg is not a detail you can assume you will fill later.'),
    R => { const vol=r(R,140,175,5)*1000, rate=one(R,[0.08,0.10,0.12,0.15]), days=r(R,12,30); const perso=Math.round(vol*rate/100*days);
      return numeric(`A cargo of ${vol.toLocaleString('en-US')} m³ boils off ${rate}% a day for ${days} days. How many m³ are lost?`,perso,'m³',
        `${vol.toLocaleString('en-US')} × ${rate}% × ${days} = ${perso.toLocaleString('en-US')} m³. Boil-off is a predictable loss that belongs in the economics, not a surprise.`,3); },
  ];
  EXTRA.a10 = [
    R => choice('Why is electricity commercially different from every other commodity here?',
      ['It cannot be stored economically at scale, so supply and demand must match in real time','It is cheaper','It has no price risk','It is not traded'],0,
      'Non-storability is the source of everything unusual in power: extreme spikes, negative prices and the value of flexibility.'),
    R => choice('Power prices go negative for several hours. What does that mean?',
      ['Generators are paying to keep running rather than shut down and restart','A pricing error','Free electricity for everyone','Demand is zero'],0,
      'Start-up costs and subsidy structures can make paying to generate cheaper than stopping.'),
    R => choice('What is the spark spread?',
      ['The margin between the power price and the cost of the gas needed to generate it','A transmission fee','A weather index','A credit measure'],0,
      'It is the generation margin, and like a refining crack it is a spread you can hedge directly.'),
    R => choice('Why does a peak/off-peak split exist in power contracts?',
      ['Demand and the marginal generator differ by hour, so the two blocks are genuinely different products','It is administrative','Prices are identical','Only for billing'],0,
      'Averaging peak and off-peak hides the hours where the money is made and lost.'),
    R => choice('Transmission between two zones is constrained. What appears?',
      ['A price difference between the zones that cannot be arbitraged away physically','A single price','Lower demand','Higher storage'],0,
      'Congestion creates locational prices, and trading them requires transmission rights, not just a view.'),
    R => choice('Why is a renewables forecast a price input rather than a background detail?',
      ['Wind and solar output displaces the marginal thermal generator and moves the clearing price directly','It is background only','Renewables are too small','Prices ignore supply'],0,
      'In many markets the residual load after renewables is the single best short-term price predictor.'),
    R => choice('What does a capacity payment compensate?',
      ['Being available when needed, separately from energy actually produced','Fuel costs only','Transmission','Carbon'],0,
      'Availability and energy are two products, and confusing them misprices a generation asset.'),
    R => choice('Why do desks value optionality in a flexible power plant?',
      ['It can run only when the spread is positive, which is worth more than an average margin','Flexibility has no value','Only baseload matters','It reduces risk to zero'],0,
      'The right to run when it pays and stop when it does not is an option, and it is valued as one.'),
    R => choice('A carbon price is introduced. What changes commercially?',
      ['The cost stack reorders, changing which plant sets the price','Nothing','Only accounting','Demand only'],0,
      'Carbon changes the merit order, which is how it changes the price rather than just the cost.'),
    R => { const mwh=r(R,20,120,10)*1000, spread=r(R,4,22); const pnl=mwh*spread;
      return numeric(`You hold ${mwh.toLocaleString('en-US')} MWh and the spread moves $${spread}/MWh in your favour. P&L impact?`,pnl,'$',
        `${mwh.toLocaleString('en-US')} × ${spread} = ${money(pnl)}. Power volumes are large and the spread is where the generation margin lives.`); },
  ];

  EXTRA.a11 = [
    R => choice('Why is basis so central on an agricultural desk?',
      ['Futures price the benchmark; the local cash market is set by basis, which reflects local supply, logistics and quality','Basis is irrelevant','Futures set the cash price exactly','Basis is a tax'],0,
      'On grains the basis is often where the trading result actually comes from.'),
    R => choice('A harvest is larger than expected but the basis strengthens. What could explain it?',
      ['Local logistics are congested, so getting grain to the buyer is the constraint, not the crop','Basis cannot strengthen','A pricing error','Futures must be wrong'],0,
      'Big crops can still be locally tight if the transport and elevation capacity cannot move them.'),
    R => choice('Why do quality parameters matter so much in grain contracts?',
      ['Moisture, protein and damage change the value and can trigger discounts or rejection','They do not','Only weight matters','Only for animal feed'],0,
      'Grain is a specification product, and the discount schedule is part of the price.'),
    R => choice('What is the commercial purpose of a hedge for a grain elevator?',
      ['To lock the margin between what it pays farmers and what it sells forward, not to predict price','To speculate','To reduce freight','To improve credit'],0,
      'Elevators are basis traders: they hedge the flat price so they can trade the basis they understand.'),
    R => choice('Why does weather in one hemisphere move prices in the other?',
      ['Global supply is met from successive harvests, so a shortfall anywhere shifts the world balance','It does not','Only local weather matters','Prices are regional only'],0,
      'Agricultural balances are annual and global, which is why the market trades weather continuously.'),
    R => choice('An export ban is announced in a major origin. What is the first effect?',
      ['Prices rise elsewhere as buyers compete for the remaining origins','Prices fall','No effect','Only freight changes'],0,
      'Removing an origin does not remove demand, it redirects it, usually violently.'),
    R => choice('Why is storage capacity at origin a commercial factor at harvest?',
      ['If it is full, grain must move or be sold at a discount, weakening the basis','It is not a factor','Storage is unlimited','Only futures matter'],0,
      'Harvest pressure is a logistics phenomenon expressed as a price.'),
    R => choice('What does a "delivered" contract shift compared with a farm-gate purchase?',
      ['Freight, weight loss and timing risk move to the seller','Nothing','Only the currency','Only the quality'],0,
      'Each step you take on brings a cost and a risk you now own.'),
    R => choice('Why can a perfectly hedged elevator still lose money?',
      ['The basis can move against it, and quality or shrink can differ from what was assumed','It cannot lose','Only if futures fail','Only on credit'],0,
      'Hedging the futures leaves the basis, and the basis is the whole business.'),
    R => { const fut=r(R,230,340,5), basis=r(R,-25,25,5), t=r(R,5,40,5)*1000; const cash=fut+basis, val=cash*t;
      return numeric(`Futures are $${fut}/t, basis is ${basis>=0?'+':''}$${basis}/t, on ${t.toLocaleString('en-US')} t. Total cash value?`,val,'$',
        `(${fut} ${basis>=0?'+':'−'} ${Math.abs(basis)}) × ${t.toLocaleString('en-US')} = ${money(val)}. Hedging the futures leaves exactly the basis part unhedged.`); },
  ];

  EXTRA.a12 = [
    R => choice('What does origination actually add to a trading business?',
      ['Access to supply or demand that is not available on the open market','Faster execution','Lower freight','Better software'],0,
      'Anyone can trade the visible market. Origination creates the flow that others cannot reach.'),
    R => choice('Why is a long-term offtake contract valuable beyond its margin?',
      ['It gives predictable volume that supports financing, freight programmes and customer relationships','Only the margin matters','It removes all risk','It fixes the freight market'],0,
      'Structural flow is what turns a trading desk into a business rather than a series of bets.'),
    R => choice('A prepayment finances a producer against future deliveries. What is the core risk?',
      ['Performance: they may not deliver, and you are an unsecured creditor of a producer','Only price risk','No risk if documented','Freight risk'],0,
      'Structured prepayments are credit deals dressed as trades, and they should be underwritten as credit.'),
    R => choice('Why does a force majeure clause deserve careful reading?',
      ['It decides who bears the cost when neither party is at fault, which is when the money is largest','It is standard and identical everywhere','It never applies','Only lawyers care'],0,
      'The events listed, the notice requirements and the consequences vary enormously between contracts.'),
    R => choice('What does a change-of-law clause protect against?',
      ['A new tax, sanction or export rule making performance impossible or uneconomic','Price movements','Quality disputes','Freight increases'],0,
      'In commodities, regulatory change is a routine commercial risk, not an exotic one.'),
    R => choice('Why does governing law and arbitration seat matter commercially?',
      ['It determines how a dispute is decided, how long it takes and whether an award can be enforced','It is a formality','Only the price matters','It affects nothing'],0,
      'A right you cannot enforce against assets you can reach is not worth what it appears to be.'),
    R => choice('A counterparty in a sanctioned jurisdiction offers an attractive deal. What is the correct first step?',
      ['Compliance screening before any commercial discussion or commitment','Agree the price first','Check freight only','Sign a recap'],0,
      'Sanctions exposure can end a company, not just a trade, and it cannot be priced away.'),
    R => choice('What is the practical value of a parent company guarantee?',
      ['It extends your claim from a thin trading entity to a balance sheet that can actually pay','It is decorative','It guarantees quality','It fixes the price'],0,
      'Many trading counterparties are small entities. Who stands behind them is the real credit question.'),
    R => choice('Why do desks avoid conflicting standard terms in a contract chain?',
      ['A mismatch between your purchase and sale terms leaves a gap you have to absorb','They do not matter','Terms are always identical','Only price matters'],0,
      'Back-to-back means the terms match, not just the volumes and dates.'),
    R => { const adv=r(R,4,20)*1000000, del=r(R,4,12), done=r(R,1,3); const resto=round(adv*(1-done/del));
      return numeric(`You prepaid ${money(adv)} against ${del} equal monthly deliveries. ${done} have been delivered. How much is still at risk?`,resto,'$',
        `${money(adv)} × (1 − ${done}/${del}) = ${money(resto)} still unsecured. A prepayment is credit exposure that unwinds only as cargo arrives.`,2); },
  ];
  EXTRA.a2.push(
    R => choice('A contract lets the buyer choose the loading window inside a two-month range. Who benefits?',
      ['The buyer, who will load when the market and their logistics suit them best','The seller','Neither, it is symmetric','The shipowner only'],0,
      'Every flexibility belongs to someone. If the contract does not say it is yours, assume it is being used against you.'),
    R => { const buy=r(R,600,880,10), sell=buy+r(R,30,90,5), t=r(R,10,45,5)*1000, costs=r(R,12,38);
      const net=(sell-buy-costs)*t;
      return numeric(`Buy $${buy}/t, sell $${sell}/t, all-in costs $${costs}/t, on ${t.toLocaleString('en-US')} t. Total net contribution?`,net,'$',
        `(${sell} − ${buy} − ${costs}) × ${t.toLocaleString('en-US')} = ${money(net)}. The costs line is where headline spreads go to die.`); }
  );

  EXTRA.a5.push(
    R => choice('Why should a risk report show the worst historical drawdown alongside VaR?',
      ['It shows what has actually happened, not only what a distribution says should happen','VaR is enough','Drawdown is an accounting term','It is a regulatory requirement only'],0,
      'History is a poor forecast but an honest reminder. It anchors the conversation in events rather than in parameters.'),
    R => { const lim=r(R,40,120,10)*1000, phys=r(R,50,160,10)*1000, hedge=r(R,10,90,10)*1000;
      const net=phys-hedge, over=net-lim;
      return numeric(`Your net long limit is ${lim.toLocaleString('en-US')} t. You are long ${phys.toLocaleString('en-US')} t physical and short ${hedge.toLocaleString('en-US')} t futures. By how many tonnes are you over the limit? Use a negative number if you are inside it.`,over,'t',
        `Net is ${phys.toLocaleString('en-US')} − ${hedge.toLocaleString('en-US')} = ${net.toLocaleString('en-US')} t, against a ${lim.toLocaleString('en-US')} t limit: ${over.toLocaleString('en-US')} t. Limits are checked on the net, not the gross.`); }
  );

  EXTRA.a6.push(
    R => { const put=r(R,4,12), call=r(R,3,11), t=r(R,10,40,5)*1000; const net=(put-call)*t;
      return numeric(`You buy a put at $${put}/t and sell a call at $${call}/t on ${t.toLocaleString('en-US')} t. Net premium paid? Use a negative number if you receive it.`,net,'$',
        `(${put} − ${call}) × ${t.toLocaleString('en-US')} = ${money(net)}. A collar is only "zero cost" when the two premiums happen to match.`); },
    R => { const lots=r(R,20,120,10), size=one(R,[25,50,100]), move=r(R,5,40); const vm=lots*size*move;
      return numeric(`You are short ${lots} lots of ${size} t and the futures price rises $${move}/t. Variation margin due?`,vm,'$',
        `${lots} × ${size} × ${move} = ${money(vm)}, payable in cash now while the physical gain is still unrealised.`); }
  );

  EXTRA.a7.push(
    R => { const t=r(R,300,2000,100), rent=one(R,[0.35,0.45,0.55,0.70]), days=r(R,30,180,30); const cost=round(t*rent*days);
      return numeric(`You store ${t.toLocaleString('en-US')} t at $${rent}/t/day for ${days} days. Total warehouse rent?`,cost,'$',
        `${t.toLocaleString('en-US')} × ${rent} × ${days} = ${money(cost)}. Rent and load-out delays are what physical premiums are really pricing.`,2); }
  );

  EXTRA.a9.push(
    R => { const cap=r(R,2,8)*1000000, fee=one(R,[0.30,0.45,0.60,0.85]); const cost=round(cap*fee);
      return numeric(`Regasification costs $${fee}/MMBtu on a cargo of ${cap.toLocaleString('en-US')} MMBtu. Total regas cost?`,cost,'$',
        `${cap.toLocaleString('en-US')} × ${fee} = ${money(cost)}. Terminal access is a cost and a constraint at the same time.`,2); }
  );

  EXTRA.a10.push(
    R => { const mwh=r(R,100,600,50), hr=one(R,[1.8,2.0,2.2,2.5]); const gas=round(mwh*hr,1);
      return numeric(`You must deliver ${mwh} MWh of power from a plant with a heat rate of ${hr} MWh(th) per MWh(e). How much gas, in MWh(th)?`,gas,'MWh(th)',
        `${mwh} × ${hr} = ${gas} MWh(th). The heat rate is what converts a power sale into a gas purchase.`,.2); }
  );

  EXTRA.a11.push(
    R => { const t=r(R,5,40,5)*1000, points=one(R,[1.0,1.5,2.0,2.5]), step=.5, disc=one(R,[0.6,0.8,1.0,1.2]); const perT=round((points/step)*disc,2), loss=round(t*perT);
      return numeric(`A ${t.toLocaleString('en-US')} t grain cargo is ${points} percentage points above the contractual moisture limit. The agreed discount is $${disc}/t for each ${step} percentage-point excess. Total quality discount?`,loss,'$',
        `${points} ÷ ${step} × $${disc}/t × ${t.toLocaleString('en-US')} t = ${money(loss)}. The contract discount schedule, not a crude water-weight shortcut, determines the commercial claim.`,2); }
  );

  EXTRA.a12.push(
    R => { const min=r(R,60,200,20)*1000, actual=min-r(R,5,40,5)*1000, pen=r(R,4,16); const cost=(min-actual)*pen;
      return numeric(`A take-or-pay contract sets a minimum of ${min.toLocaleString('en-US')} t. You lift ${actual.toLocaleString('en-US')} t. At $${pen}/t, what do you owe on the shortfall?`,cost,'$',
        `(${min.toLocaleString('en-US')} − ${actual.toLocaleString('en-US')}) × ${pen} = ${money(cost)}. Take-or-pay turns an optimistic forecast into a real bill.`); },
    R => { const t=r(R,20,90,10)*1000, m=r(R,5,18), yrs=r(R,3,7); const tot=t*m*yrs;
      return numeric(`An offtake runs ${yrs} years for ${t.toLocaleString('en-US')} t a year at $${m}/t. Total contribution over the life of the contract?`,tot,'$',
        `${t.toLocaleString('en-US')} × ${m} × ${yrs} = ${money(tot)}. This is why origination is valued differently from a spot trade.`); }
  );
  /* @EXTRA-FINE */
  /* @CONTENT-OVERHAUL-V6_1
     Lesson-specific additions. These factories exist to make every specialist
     lesson teach its own desk skill instead of being filled from a desk-wide bag. */
  EXTRA.a1.push(
    R => { const start=r(R,36,64,4), draw=r(R,4,16,2), days=30; const end=start-draw; const rate=round(draw/days,2); return numeric(`Stocks fall from ${start} Mt to ${end} Mt over ${days} days. Average inventory draw per day?`,rate,'Mt/day',`${draw} ÷ ${days} = ${rate} Mt/day.`,.01); },
    R => { const near=r(R,680,840,10), spread=r(R,-35,35,5), deferred=near-spread; return numeric(`Nearby futures are $${near}/t and deferred futures are $${deferred}/t. What is nearby minus deferred? Use a negative number for contango.`,spread,'$/t',`${near} − ${deferred} = $${spread}/t.`); },
    R => { const a=r(R,700,900,10), fa=r(R,20,55,5), b=a+r(R,-30,40,10), fb=r(R,20,55,5); const nA=a-fa, nB=b-fb, diff=nA-nB; return numeric(`Destination A pays $${a}/t with $${fa}/t freight. Destination B pays $${b}/t with $${fb}/t freight. By how much does A's netback exceed B's?`,diff,'$/t',`(${a} − ${fa}) − (${b} − ${fb}) = $${diff}/t.`); },
    R => { const feed=r(R,620,780,10), yieldPct=r(R,82,94,2), product=r(R,760,940,10), cost=r(R,20,50,5); const rev=product*yieldPct/100; const margin=round(rev-feed-cost,1); return numeric(`One tonne of feed costs $${feed}. Saleable yield is ${yieldPct}% and product value is $${product}/t. Processing cost is $${cost}/t feed. Simple margin per tonne of feed?`,margin,'$/t',`${product} × ${yieldPct}% − ${feed} − ${cost} = $${margin}/t feed.`,.1); },
    R => { const demand=r(R,90,130), supply=demand+r(R,-5,5), outage=r(R,2,6), demandRev=r(R,-3,3); const newBal=(supply-outage)-(demand+demandRev); return numeric(`Initial demand is ${demand} Mt and supply ${supply} Mt. A ${outage} Mt supply outage occurs and demand is revised by ${demandRev>=0?'+':''}${demandRev} Mt. New balance (supply − demand)?`,newBal,'Mt',`(${supply} − ${outage}) − (${demand} ${demandRev>=0?'+':'−'} ${Math.abs(demandRev)}) = ${newBal} Mt.`); },
    R => choice('Why compare inventories with their normal seasonal range rather than only with last month?',['Commodity stocks often have predictable seasonal builds and draws','Seasonality removes price risk','A monthly change is always meaningless','Only annual data matter'],0,'A normal seasonal draw can look bullish in isolation. Context tells you whether inventory behaviour is actually unusual.'),
    R => { const spread=r(R,12,36,4), storage=r(R,3,10), finance=r(R,2,8); const net=spread-storage-finance; return numeric(`Deferred value is $${spread}/t above prompt. Storage costs $${storage}/t and finance $${finance}/t. Net carry before losses?`,net,'$/t',`${spread} − ${storage} − ${finance} = $${net}/t.`); },
    R => choice('When does a regional arbitrage normally close?',['When delivered netbacks converge enough that the route no longer covers its costs and risks','When benchmarks have the same name','When freight reaches zero','Only when inventories are empty'],0,'Arbitrage is an all-in delivered comparison. Once the netback advantage disappears, the trade stops paying.'),
    R => choice('Why can a small change in processing yield matter more than a small move in the headline benchmark?',['Yield changes the amount of saleable output from every tonne of feed','Yield is only an accounting convention','Benchmarks never matter','Processing costs are fixed by law'],0,'A few yield points applied to large throughput can move the processing margin materially.'),
    R => choice('A market view should include an invalidation condition because…',['You need to know which new fact would prove the thesis wrong','It guarantees the forecast','It removes model risk','It replaces position limits'],0,'A thesis without a falsifiable trigger becomes a story that can survive any evidence.')
  );

  EXTRA.a2.push(
    R => { const qty=r(R,20,60,10)*1000, opt=10, repl=r(R,6,20,2); const extra=qty*opt/100; const loss=extra*repl; return numeric(`A buyer has a +${opt}% quantity option on ${qty.toLocaleString('en-US')} t at a fixed sale price. If replacement supply is $${repl}/t more expensive when they exercise the extra volume, downside on the optional tonnes?`,loss,'$',`${qty.toLocaleString('en-US')} × ${opt}% × $${repl} = ${money(loss)}.`); },
    R => { const qty=r(R,20,70,10)*1000, move=r(R,4,18,2); return numeric(`Purchase prices in Month 1 and sale prices in Month 2 on ${qty.toLocaleString('en-US')} t. The Month-2 minus Month-1 spread moves $${move}/t against you. Approximate timing P&L?`,-qty*move,'$',`${qty.toLocaleString('en-US')} × $${move} = ${money(qty*move)} loss.`); },
    R => { const a=r(R,18,42,2), b=a+r(R,-8,8,2), qty=r(R,20,60,10)*1000; const diff=(a-b)*qty; return numeric(`Origin A gives a delivered margin of $${a}/t and Origin B $${b}/t on ${qty.toLocaleString('en-US')} t. Contribution advantage of A over B?`,diff,'$',`(${a} − ${b}) × ${qty.toLocaleString('en-US')} = ${money(diff)}.`); },
    R => { const margin=r(R,10,28,2), qty=r(R,20,60,10)*1000, capital=r(R,8,24,2)*1000000, days=r(R,30,120,15); const ret=round((margin*qty/capital)*(365/days)*100,1); return numeric(`A deal earns $${margin}/t on ${qty.toLocaleString('en-US')} t, ties up ${money(capital)} for ${days} days. Approximate annualised return on capital?`,ret,'%',`(${margin} × ${qty.toLocaleString('en-US')} ÷ ${money(capital)}) × (365 ÷ ${days}) × 100 ≈ ${ret}%.`,.1); },
    R => { const gross=r(R,18,45,3), prob=r(R,5,20,5), loss=r(R,20,60,5); const expected=round(gross-(prob/100)*loss,1); return numeric(`Gross expected margin is $${gross}/t. A ${prob}% chance of an execution problem would cost $${loss}/t. Simple expected margin after that risk?`,expected,'$/t',`${gross} − ${prob}% × ${loss} = $${expected}/t.`,.1); },
    R => choice('Why should a trader price a quantity tolerance explicitly?',['Because the party choosing the volume owns an option on the marginal tonnes','Because tolerances never get exercised','Because quantity is only an operations issue','Because exchanges require it'],0,'A tolerance changes how much you may have to source or place at future market conditions.'),
    R => { const m1=r(R,700,900,10), m2=m1+r(R,-30,30,5), qty=r(R,20,60,10)*1000; const pnl=(m2-m1)*qty; return numeric(`You are economically long the Month-2 versus Month-1 spread on ${qty.toLocaleString('en-US')} t. Month 1 settles $${m1}/t and Month 2 $${m2}/t. Spread P&L?`,pnl,'$',`(${m2} − ${m1}) × ${qty.toLocaleString('en-US')} = ${money(pnl)}.`); },
    R => choice('A location arbitrage is real only when…',['The delivered margin survives freight, quality, finance, taxes and execution constraints','The FOB quote is the cheapest','Two benchmark screens differ','The vessel is already at sea'],0,'Physical arbitrage is a chain of executable costs and rights, not a screen-price comparison.'),
    R => { const gross=r(R,25,55,5), finance=r(R,3,10), credit=r(R,1,8), ops=r(R,2,9); const net=gross-finance-credit-ops; return numeric(`Headline margin $${gross}/t, finance $${finance}/t, expected credit cost $${credit}/t and execution reserve $${ops}/t. Risk-adjusted margin?`,net,'$/t',`${gross} − ${finance} − ${credit} − ${ops} = $${net}/t.`); }
  );

  EXTRA.a3.push(
    R => { const freight=r(R,700,1400,100)*1000, bunkers=r(R,180,520,20)*1000, port=r(R,80,240,20)*1000, days=r(R,25,55,5); const tce=round((freight-bunkers-port)/days); return numeric(`Gross freight revenue ${money(freight)}, bunkers ${money(bunkers)}, port/other voyage costs ${money(port)}, total voyage ${days} days. Approximate TCE?`,tce,'$/day',`(${money(freight)} − ${money(bunkers)} − ${money(port)}) ÷ ${days} = ${money(tce)}/day.`); },
    R => { const wait=r(R,1,5), hire=r(R,16,36,2)*1000; return numeric(`A time-chartered vessel waits ${wait} days before the agreed loading window. Hire is ${money(hire)}/day. Direct waiting-hire cost?`,wait*hire,'$',`${wait} × ${money(hire)} = ${money(wait*hire)}.`); },
    R => { const eta=r(R,1,3), window=r(R,2*eta+2,12); const slack=window-2*eta; return numeric(`A laycan window spans ${window} days. Your vessel ETA uncertainty is ±${eta} days. Ignoring other delays, how many days of nominal window remain beyond the two-sided ETA uncertainty?`,slack,'days',`${window} − 2 × ${eta} = ${slack} days.`); },
    R => choice('What must be checked before treating a Notice of Readiness as valid?',['The charterparty readiness requirements, arrival status and any contractual conditions for tender','Only the vessel name','Only the freight rate','Whether the commodity price rose'],0,'Laytime consequences depend on a valid NOR under the actual charterparty wording.'),
    R => { const elapsed=r(R,72,144,12), excluded=r(R,6,30,6), allowed=r(R,48,96,12), rate=r(R,16,32,2)*1000; const excess=Math.max(0,elapsed-excluded-allowed); const cost=round(excess/24*rate); return numeric(`Statement of Facts shows ${elapsed} elapsed hours. ${excluded} hours are excluded and allowed laytime is ${allowed} hours. Demurrage is ${money(rate)}/day. Demurrage amount?`,cost,'$',`(${elapsed} − ${excluded} − ${allowed}) ÷ 24 × ${money(rate)} = ${money(cost)}.`); },
    R => choice('Under a typical time charter, which cost is normally for the charterer rather than the owner?',['Voyage bunkers used while the vessel is on hire','Crew wages','Hull insurance','Technical maintenance'],0,'Time charterers normally control commercial employment and pay voyage-related bunkers, while owners retain technical operation and crew.'),
    R => { const days=r(R,4,12), cons=r(R,20,45,5), fuel=r(R,450,750,50); const cost=days*cons*fuel; return numeric(`A vessel ballasts ${days} days, consuming ${cons} t/day of fuel at $${fuel}/t. Ballast bunker cost?`,cost,'$',`${days} × ${cons} × $${fuel} = ${money(cost)}.`); },
    R => { const laden=r(R,12,28,4), ballast=r(R,4,12,2), port=r(R,4,8); const total=laden+ballast+port; return numeric(`Route requires ${laden} laden days, ${ballast} ballast days and ${port} port days. Total voyage duration?`,total,'days',`${laden} + ${ballast} + ${port} = ${total} days.`); },
    R => choice('A charterer exposed to rising freight may use an FFA primarily to…',['Offset part of the freight-market exposure on a relevant route/index','Transfer title to the cargo','Replace the bill of lading','Guarantee vessel performance'],0,'Freight derivatives target market-rate exposure; they do not remove operational or basis risk between the actual voyage and the index.'),
    R => choice('In tanker freight, Worldscale 100 means…',['100% of the published Worldscale flat rate for that route','$100 per tonne','100 voyage days','A vessel speed of 100 knots'],0,'Worldscale points are percentage points of the route-specific published flat rate.'),
    R => { const flat=one(R,[18,22,26,30]), ws=r(R,70,160,10), qty=r(R,60,120,10)*1000; const rate=round(flat*ws/100,2), total=round(rate*qty); return numeric(`Worldscale flat rate is $${flat}/t and the fixture is WS${ws} on ${qty.toLocaleString('en-US')} t. Approximate freight?`,total,'$',`$${flat}/t × ${ws}% × ${qty.toLocaleString('en-US')} t = ${money(total)}.`); }
  );

  EXTRA.a4.push(
    R => { const face=r(R,4,20,2)*1000000, bps=r(R,40,160,20), days=r(R,30,120,30); const fee=round(face*(bps/10000)*(days/360)); return numeric(`Confirmed LC amount ${money(face)}, confirmation fee ${bps} bps p.a. for ${days} days on a 360-day basis. Approximate fee?`,fee,'$',`${money(face)} × ${bps}/10,000 × ${days}/360 = ${money(fee)}.`); },
    R => { const face=r(R,3,15,2)*1000000, disc=r(R,3,8), days=r(R,30,120,30); const cost=round(face*(disc/100)*(days/360)); return numeric(`A bank discounts a ${money(face)} deferred-payment LC at ${disc}% p.a. for ${days} days on a 360-day basis. Approximate discount cost?`,cost,'$',`${money(face)} × ${disc}% × ${days}/360 = ${money(cost)}.`); },
    R => { const qty=r(R,10,40,5)*1000, price=r(R,500,900,50), move=r(R,5,20,5); const add=qty*move; return numeric(`You sold ${qty.toLocaleString('en-US')} t open account. The mark-to-market moves $${move}/t in your favour before payment, increasing replacement exposure to the buyer. Additional exposure?`,add,'$',`${qty.toLocaleString('en-US')} × $${move} = ${money(add)}.`); },
    R => choice('Why are payment terms part of the commodity price?',['Because extra unsecured days consume funding and credit capacity','Because payment timing never affects return','Because banks set the commodity benchmark','Because Incoterms fix interest rates'],0,'A $/t margin is not comparable until you account for how long cash and credit are tied up.'),
    R => { const inv=r(R,20,60,10), rec=r(R,20,80,10), pay=r(R,10,50,10); const cycle=inv+rec-pay; return numeric(`Inventory days ${inv}, receivable days ${rec}, supplier payable days ${pay}. Approximate cash conversion cycle?`,cycle,'days',`${inv} + ${rec} − ${pay} = ${cycle} days.`); },
    R => choice('Why does a borrowing base apply advance rates or haircuts to collateral?',['To leave protection for price moves, costs and imperfect recoveries','To increase the trader’s leverage without limit','Because collateral value never changes','Only for tax reporting'],0,'The lender advances less than face value because collateral can fall in value or cost money to realise.'),
    R => { const eligible=r(R,8,24,2)*1000000, adv=one(R,[70,75,80,85]), drawn=r(R,2,10,2)*1000000; const max=eligible*adv/100; const avail=Math.max(0,max-drawn); return numeric(`Eligible collateral ${money(eligible)}, advance rate ${adv}%, existing borrowing ${money(drawn)}. Additional borrowing availability?`,avail,'$',`${money(eligible)} × ${adv}% − ${money(drawn)} = ${money(avail)}.`); },
    R => choice('Expected credit loss is useful commercially because…',['It converts probability and recovery assumptions into a cost that can be compared with margin','It predicts exactly when default occurs','It replaces credit limits','It removes legal risk'],0,'A simplified expected-loss charge helps compare two trades with different counterparty quality.'),
    R => choice('A high-margin deal that consumes nearly all remaining counterparty limit should be judged on…',['Margin relative to scarce limit and the downside if the buyer fails','Invoice size only','Whether the trader likes the buyer','Benchmark direction only'],0,'Credit limit is scarce balance-sheet capacity and should earn an adequate return.'),
    R => { const exp=r(R,2,12,2)*1000000, pd=one(R,[1,2,3,4,5]), lgd=one(R,[30,40,50,60]); const el=round(exp*(pd/100)*(lgd/100)); return numeric(`Exposure ${money(exp)}, one-year default probability ${pd}%, loss-given-default ${lgd}%. Simplified expected loss?`,el,'$',`${money(exp)} × ${pd}% × ${lgd}% = ${money(el)}.`); },
    R => { const gross=r(R,25,55,5), finance=r(R,4,12,2), el=r(R,1,8), capital=r(R,1,5); const net=gross-finance-el-capital; return numeric(`Gross margin $${gross}/t, finance $${finance}/t, expected credit cost $${el}/t and capital charge $${capital}/t. Credit-adjusted margin?`,net,'$/t',`${gross} − ${finance} − ${el} − ${capital} = $${net}/t.`); }
  );

  EXTRA.a5.push(
    R => choice('Why can gross position and net flat-price exposure tell different stories?',['Offsetting hedges can reduce flat-price sensitivity while gross operational and liquidity commitments remain large','They are always identical','Gross position is only for accountants','Net exposure measures vessel size'],0,'A desk can be flat to price and still have large settlement, basis, financing and execution obligations.'),
    R => { const phys=r(R,40,120,10)*1000, hedge=r(R,20,100,10)*1000, delta=one(R,[0.7,0.8,0.9,1.0]); const exp=round(phys-hedge*delta); return numeric(`Long physical ${phys.toLocaleString('en-US')} t. Short proxy hedge ${hedge.toLocaleString('en-US')} t with hedge delta ${delta}. Approximate residual equivalent exposure?`,exp,'t',`${phys.toLocaleString('en-US')} − ${hedge.toLocaleString('en-US')} × ${delta} = ${exp.toLocaleString('en-US')} t.`); },
    R => { const pos=r(R,20,80,10)*1000, shock=r(R,30,120,10); const loss=pos*shock; return numeric(`Stress scenario: a ${pos.toLocaleString('en-US')} t net-long position faces a $${shock}/t price fall. Flat-price stress loss?`,-loss,'$',`${pos.toLocaleString('en-US')} × $${shock} = ${money(loss)} loss.`); },
    R => { const price=r(R,2,8)*1000000, freight=r(R,1,4)*1000000, credit=r(R,1,6)*1000000; const total=price+freight+credit; return numeric(`Stress losses: price ${money(price)}, freight ${money(freight)}, counterparty ${money(credit)}. Combined scenario loss?`,-total,'$',`${money(price)} + ${money(freight)} + ${money(credit)} = ${money(total)} loss.`); },
    R => { const qty=r(R,20,80,10)*1000, basis=r(R,5,25,5); const pnl=qty*basis; return numeric(`A ${qty.toLocaleString('en-US')} t cross-hedged position suffers a $${basis}/t adverse basis move while flat price is hedged. Residual basis P&L?`,-pnl,'$',`${qty.toLocaleString('en-US')} × $${basis} = ${money(pnl)} loss.`); },
    R => { const physical=r(R,4,12)*1000000, hedge=r(R,3,11)*1000000; const net=physical-hedge; return numeric(`Physical leg gains ${money(physical)} while hedge loses ${money(hedge)}. Combined hedge result?`,net,'$',`${money(physical)} − ${money(hedge)} = ${money(net)}.`); },
    R => choice('Why can margin calls create a crisis on a profitable hedged trade?',['The paper leg settles cash now while the offsetting physical gain may arrive much later','A profitable hedge never needs cash','Margin is paid only after delivery','Banks automatically fund every call'],0,'Liquidity timing, not only final economics, determines whether a desk survives the path to settlement.'),
    R => { const cash=r(R,10,30,5)*1000000, calls=r(R,4,14,2)*1000000, supplier=r(R,2,10,2)*1000000, delay=r(R,1,6)*1000000; const head=cash-calls-supplier-delay; return numeric(`Available cash ${money(cash)}; margin calls ${money(calls)}, supplier payments ${money(supplier)}, customer delay reserve ${money(delay)}. Liquidity headroom?`,head,'$',`${money(cash)} − ${money(calls)} − ${money(supplier)} − ${money(delay)} = ${money(head)}.`); }
  );

  EXTRA.a6.push(
    R => choice('Why must hedge sizing start from contract units and lot sizes?',['Because exchange contracts are discrete and a nominal tonne exposure may not divide exactly into whole lots','Because lots determine Incoterms','Because lot size removes basis risk','Only brokers care about contract size'],0,'Execution requires translating physical exposure into actual exchange lots and accepting any rounding residual.'),
    R => choice('Variation margin belongs in hedge design because…',['A correct hedge can still create large interim cash calls','It changes the physical quality','It guarantees profit','It replaces collateral'],0,'Derivative settlement timing can be as important as terminal P&L for a physical merchant.'),
    R => { const qty=r(R,10,80,5)*1000, lot=one(R,[25,50,100]); const lots=Math.round(qty/lot); return numeric(`Exposure is ${qty.toLocaleString('en-US')} t and the hedge contract is ${lot} t per lot. Approximate whole lots required?`,lots,'lots',`${qty.toLocaleString('en-US')} ÷ ${lot} ≈ ${lots} lots.`); },
    R => choice('A cross-hedge should be monitored for…',['Basis and correlation instability between the exposure and proxy contract','Only exchange fees','Only physical title','No residual risk'],0,'A proxy can behave well in normal markets and diverge when the underlying physical market is stressed.'),
    R => { const qty=r(R,20,70,10)*1000, basis=r(R,4,18,2); const pnl=qty*basis; return numeric(`Your flat price is hedged on ${qty.toLocaleString('en-US')} t, but the physical basis weakens $${basis}/t. Basis P&L?`,-pnl,'$',`${qty.toLocaleString('en-US')} × $${basis} = ${money(pnl)} loss.`); },
    R => { const qty=r(R,20,70,10)*1000, phys=r(R,6,20,2), proxy=phys-r(R,-6,6,2); const residual=(phys-proxy)*qty; return numeric(`Physical value changes $${phys}/t and the proxy hedge offsets $${proxy}/t on ${qty.toLocaleString('en-US')} t. Residual move?`,residual,'$',`(${phys} − ${proxy}) × ${qty.toLocaleString('en-US')} = ${money(residual)}.`); },
    R => { const fixed=r(R,70,110,5), floating=fixed+r(R,-15,15,5), qty=r(R,20,80,10)*1000; const settle=(floating-fixed)*qty; return numeric(`You receive floating and pay fixed $${fixed}/t in a swap on ${qty.toLocaleString('en-US')} t. Floating settles at $${floating}/t. Swap settlement?`,settle,'$',`(${floating} − ${fixed}) × ${qty.toLocaleString('en-US')} = ${money(settle)}.`); },
    R => { const fixed=r(R,70,110,5), avg=fixed+r(R,-12,12,3), qty=r(R,20,80,10)*1000; const settle=(avg-fixed)*qty; return numeric(`Monthly-average swap: receive average, pay fixed $${fixed}/t on ${qty.toLocaleString('en-US')} t. Monthly average is $${avg}/t. Settlement?`,settle,'$',`(${avg} − ${fixed}) × ${qty.toLocaleString('en-US')} = ${money(settle)}.`); },
    R => { const qty=r(R,10,50,5)*1000, delta=one(R,[0.25,0.4,0.55,0.7]), lot=one(R,[25,50,100]); const lots=Math.round(qty*delta/lot); return numeric(`Options cover ${qty.toLocaleString('en-US')} t with delta ${delta}. Futures lot size is ${lot} t. Approximate delta-hedge lots?`,lots,'lots',`${qty.toLocaleString('en-US')} × ${delta} ÷ ${lot} ≈ ${lots} lots.`); },
    R => { const exposure=r(R,20,80,10)*1000, ratio=one(R,[0.7,0.8,0.9,1.0]); const hedge=round(exposure*ratio); return numeric(`Physical exposure is ${exposure.toLocaleString('en-US')} t and chosen hedge ratio is ${ratio}. Hedge tonnage?`,hedge,'t',`${exposure.toLocaleString('en-US')} × ${ratio} = ${hedge.toLocaleString('en-US')} t.`); },
    R => { const qty=r(R,20,70,10)*1000, spread=r(R,4,18,2); const pnl=qty*spread; return numeric(`Purchase and sale pricing windows leave ${qty.toLocaleString('en-US')} t exposed to a calendar spread. The spread moves $${spread}/t against the book. P&L?`,-pnl,'$',`${qty.toLocaleString('en-US')} × $${spread} = ${money(pnl)} loss.`); }
  );

  EXTRA.a7.push(
    R => choice('The all-in price of exchange-priced metal is best viewed as…',['Benchmark metal price plus the relevant physical premium/discount and contract adjustments','Only the exchange screen','Only warehouse rent','Only freight'],0,'Separating benchmark and physical differential is essential for pricing and hedging the two risks correctly.'),
    R => { const qty=r(R,500,3000,250), move=r(R,20,90,10); const pnl=qty*move; return numeric(`Regional premium strengthens $${move}/t on ${qty.toLocaleString('en-US')} t you are short to a customer. Premium P&L?`,-pnl,'$',`${qty.toLocaleString('en-US')} × $${move} = ${money(pnl)} loss.`); },
    R => choice('Can physical premium exposure always be assumed unhedgeable on exchange?',['No. Availability depends on metal and region; for example, dedicated aluminium premium contracts exist','Yes, all premiums are unhedgeable by definition','Every premium is hedged by base LME futures automatically','Premiums are not prices'],0,'Base-metal futures do not hedge a premium automatically, but dedicated premium products exist for some markets, so the exposure must be checked rather than assumed.'),
    R => { const qty=r(R,500,2500,250), rent=one(R,[0.35,0.45,0.55,0.7]), days=r(R,30,150,30), finance=r(R,10,35,5); const cost=round(qty*rent*days + qty*finance); return numeric(`Store ${qty.toLocaleString('en-US')} t for ${days} days at $${rent}/t/day plus $${finance}/t financing/carry. Total carry cost?`,cost,'$',`${qty.toLocaleString('en-US')} × $${rent} × ${days} + ${qty.toLocaleString('en-US')} × $${finance} = ${money(cost)}.`); },
    R => { const dmt=r(R,5,15)*1000, grade=one(R,[20,22,24,26,28]), payable=one(R,[95,96,97]); const metal=round(dmt*grade/100*payable/100,1); return numeric(`Concentrate is ${dmt.toLocaleString('en-US')} dmt at ${grade}% copper with ${payable}% payable metal. Approximate payable copper tonnes?`,metal,'t',`${dmt.toLocaleString('en-US')} × ${grade}% × ${payable}% = ${metal.toLocaleString('en-US')} t.`,.1); },
    R => { const qty=r(R,500,3000,250), lot=25; const lots=Math.round(qty/lot); return numeric(`Copper exposure is ${qty.toLocaleString('en-US')} t. Standard LME Copper lot size is ${lot} t. Approximate whole lots?`,lots,'lots',`${qty.toLocaleString('en-US')} ÷ ${lot} ≈ ${lots} lots.`); },
    R => { const qty=r(R,500,3000,250), spread=r(R,20,80,10); const pnl=qty*spread; return numeric(`Purchase and sale quotation periods leave ${qty.toLocaleString('en-US')} t exposed. The relevant LME calendar spread moves $${spread}/t against you. P&L?`,-pnl,'$',`${qty.toLocaleString('en-US')} × $${spread} = ${money(pnl)} loss.`); },
    R => { const buy=r(R,90,180,10), sell=buy+r(R,40,120,10), freight=r(R,15,45,5), finance=r(R,5,20,5); const m=sell-buy-freight-finance; return numeric(`Buy premium $${buy}/t, sell premium $${sell}/t, freight $${freight}/t, finance $${finance}/t. Net physical premium margin?`,m,'$/t',`${sell} − ${buy} − ${freight} − ${finance} = $${m}/t.`); },
    R => { const qty=r(R,500,2500,250), lmeMove=r(R,100,400,50), premMove=r(R,20,80,10); const residual=qty*premMove; return numeric(`A ${qty.toLocaleString('en-US')} t metal cargo is fully flat-price hedged against a $${lmeMove}/t LME move, but the regional premium weakens $${premMove}/t. Residual P&L?`,-residual,'$',`The LME move is hedged; ${qty.toLocaleString('en-US')} × $${premMove} = ${money(residual)} premium loss.`); },
    R => choice('Why should a metals trader distinguish on-warrant from off-warrant inventory?',['Deliverability, financing and availability to the exchange system differ','They are identical inventories','Off-warrant metal has no owner','Only tax treatment changes'],0,'Warehouse status affects how quickly metal can satisfy exchange or physical demand and therefore affects local tightness.')
  );

  EXTRA.a8.push(
    R => { const crude=r(R,65,90), gas=r(R,85,115), dist=r(R,90,120); const crack=round((2*gas+dist-3*crude)/3,1); return numeric(`Crude $${crude}/bbl, gasoline $${gas}/bbl, distillate $${dist}/bbl. Simple 3-2-1 crack per barrel of crude?`,crack,'$/bbl',`(2 × ${gas} + ${dist} − 3 × ${crude}) ÷ 3 = $${crack}/bbl.`,.1); },
    R => { const prompt=r(R,70,100), deferred=prompt+r(R,-8,8); const spread=prompt-deferred; return numeric(`Prompt crude is $${prompt}/bbl and deferred crude $${deferred}/bbl. Prompt minus deferred?`,spread,'$/bbl',`${prompt} − ${deferred} = $${spread}/bbl.`); },
    R => { const contango=r(R,2,8), storage=one(R,[0.6,0.8,1.0,1.2]), finance=one(R,[0.4,0.6,0.8,1.0]), loss=one(R,[0.1,0.2,0.3]); const net=round(contango-storage-finance-loss,1); return numeric(`Forward premium $${contango}/bbl; storage $${storage}, finance $${finance}, losses $${loss}/bbl. Net carry?`,net,'$/bbl',`${contango} − ${storage} − ${finance} − ${loss} = $${net}/bbl.`,.1); },
    R => choice('A cargo priced on one month and sold on another is economically a position in…',['The relevant calendar spread between the two pricing windows','Only flat Brent','Only freight','No market risk'],0,'Pricing-window mismatch is a calendar-spread exposure even if the physical volume is matched.'),
    R => { const qty=r(R,300,900,100)*1000, spread=r(R,1,5); const pnl=qty*spread; return numeric(`A ${qty.toLocaleString('en-US')} bbl cargo has purchase and sale pricing windows one month apart. The calendar spread moves $${spread}/bbl against you. P&L?`,-pnl,'$',`${qty.toLocaleString('en-US')} × $${spread} = ${money(pnl)} loss.`); },
    R => { const buyAvg=r(R,70,100), sellAvg=buyAvg+r(R,-4,6); const qty=r(R,300,900,100)*1000; const pnl=(sellAvg-buyAvg)*qty; return numeric(`Purchase QP averages $${buyAvg}/bbl and sale QP averages $${sellAvg}/bbl on ${qty.toLocaleString('en-US')} bbl. Pricing-window contribution?`,pnl,'$',`(${sellAvg} − ${buyAvg}) × ${qty.toLocaleString('en-US')} = ${money(pnl)}.`); },
    R => { const v1=r(R,20,60,10), s1=one(R,[0.1,0.2,0.3]), v2=r(R,20,60,10), s2=one(R,[0.8,1.0,1.2]); const sulfur=round((v1*s1+v2*s2)/(v1+v2),2); return numeric(`Blend ${v1} kbbl at ${s1}% sulfur with ${v2} kbbl at ${s2}% sulfur. Approximate blended sulfur?`,sulfur,'%',`(${v1} × ${s1} + ${v2} × ${s2}) ÷ (${v1} + ${v2}) = ${sulfur}%.`,.01); },
    R => { const high=r(R,90,120), low=r(R,70,95), vHigh=r(R,20,50,10), vLow=r(R,20,50,10), sale=r(R,86,108); const input=high*vHigh+low*vLow, revenue=sale*(vHigh+vLow), margin=round(revenue-input); return numeric(`Blend ${vHigh} kbbl costing $${high}/bbl and ${vLow} kbbl costing $${low}/bbl, then sell blend at $${sale}/bbl. Gross blend contribution before other costs, in $000?`,margin,'$000',`${sale} × ${vHigh+vLow} − (${high} × ${vHigh} + ${low} × ${vLow}) = ${margin} thousand dollars.`); },
    R => choice('A useful oil P&L attribution separates…',['Flat price, grade/location differential, timing spread, freight, blending/quality and execution','Only invoice revenue','Only benchmark price','Only demurrage'],0,'Breaking the result into drivers shows whether the desk earned merchant margin or accidentally took market risk.'),
    R => choice('For a delivered oil arbitrage, the destination benchmark is not enough because…',['Freight, losses, quality, timing and terminal costs determine the origin netback','Benchmarks include every logistics cost','Cargoes have no quality differences','Freight is fixed globally'],0,'The arbitrage survives only if the full delivered economics work.'),
    R => { const dest=r(R,90,125), freight=r(R,2,7), losses=one(R,[0.2,0.4,0.6]), terminal=one(R,[0.3,0.5,0.8]); const nb=round(dest-freight-losses-terminal,1); return numeric(`Destination value $${dest}/bbl, freight $${freight}, losses $${losses}, terminal costs $${terminal}/bbl. Origin netback?`,nb,'$/bbl',`${dest} − ${freight} − ${losses} − ${terminal} = $${nb}/bbl.`,.1); }
  );

  EXTRA.a9.push(
    R => { const brent=r(R,60,100), slope=one(R,[0.11,0.12,0.13,0.14]), constTerm=one(R,[0.2,0.5,0.8]); const price=round(brent*slope+constTerm,2); return numeric(`Oil-indexed LNG formula is ${slope} × Brent + $${constTerm}/MMBtu. Brent is $${brent}/bbl. Contract price?`,price,'$/MMBtu',`${slope} × ${brent} + ${constTerm} = $${price}/MMBtu.`,.01); },
    R => choice('A regasification slot has option value because…',['Terminal capacity can be scarce exactly when destination gas prices are strongest','It fixes the source gas price','It removes shipping risk','It guarantees demand'],0,'Infrastructure access is both a cost and a right to monetise a destination market.'),
    R => { const rate=r(R,80,180,20)*1000, days=r(R,20,40,5), energy=r(R,3,4)*1000000; const per=round(rate*days/energy,2); return numeric(`LNG vessel hire is ${money(rate)}/day for ${days} days. Cargo energy is ${energy.toLocaleString('en-US')} MMBtu. Hire cost per MMBtu before fuel?`,per,'$/MMBtu',`${money(rate)} × ${days} ÷ ${energy.toLocaleString('en-US')} = $${per}/MMBtu.`,.01); },
    R => { const asia=r(R,15,25), fa=r(R,2,5), europe=asia+r(R,-4,4), fe=r(R,1,4); const diff=round((asia-fa)-(europe-fe),1); return numeric(`Asia value $${asia}/MMBtu with $${fa} logistics. Europe value $${europe}/MMBtu with $${fe} logistics. Asia netback minus Europe netback?`,diff,'$/MMBtu',`(${asia} − ${fa}) − (${europe} − ${fe}) = $${diff}/MMBtu.`,.1); },
    R => choice('Gas storage is not only seasonal inventory; commercially it is also…',['An option to inject when cheap and withdraw when valuable, subject to capacity and rate constraints','A guaranteed arbitrage','A replacement for pipelines','A fixed-price contract'],0,'Injection and withdrawal rights create flexibility whose value changes with volatility and the forward curve.'),
    R => { const winter=r(R,12,22), summer=winter-r(R,2,8), inject=one(R,[0.3,0.5,0.7]), withdraw=one(R,[0.2,0.4,0.6]), finance=one(R,[0.2,0.4,0.6]); const net=round(winter-summer-inject-withdraw-finance,1); return numeric(`Winter gas $${winter}/MMBtu, summer $${summer}. Injection $${inject}, withdrawal $${withdraw}, finance $${finance}/MMBtu. Net seasonal carry?`,net,'$/MMBtu',`${winter} − ${summer} − ${inject} − ${withdraw} − ${finance} = $${net}/MMBtu.`,.1); },
    R => { const cap=r(R,2,6)*1000000, spread=r(R,1,5), usage=one(R,[50,60,70,80]); const value=round(cap*usage/100*spread); return numeric(`Storage working capacity ${cap.toLocaleString('en-US')} MMBtu, expected usable cycle ${usage}% and seasonal spread $${spread}/MMBtu before costs. Gross spread value?`,value,'$',`${cap.toLocaleString('en-US')} × ${usage}% × $${spread} = ${money(value)}.`); },
    R => { const dest=r(R,15,24), source=r(R,7,13), ship=r(R,2,5), regas=one(R,[0.4,0.7,1.0]), boil=one(R,[0.2,0.4,0.6]); const m=round(dest-source-ship-regas-boil,1); return numeric(`Destination $${dest}/MMBtu, source $${source}, shipping $${ship}, regas $${regas}, boil-off allowance $${boil}/MMBtu. Simplified LNG arbitrage margin?`,m,'$/MMBtu',`${dest} − ${source} − ${ship} − ${regas} − ${boil} = $${m}/MMBtu.`,.1); },
    R => { const energy=r(R,3,4)*1000000, loss=one(R,[0.5,0.8,1.0,1.2]), value=r(R,12,22); const cost=round(energy*loss/100*value); return numeric(`Cargo energy ${energy.toLocaleString('en-US')} MMBtu. Total voyage/handling loss is ${loss}% and replacement value is $${value}/MMBtu. Value of lost energy?`,cost,'$',`${energy.toLocaleString('en-US')} × ${loss}% × $${value} = ${money(cost)}.`); }
  );

  EXTRA.a10.push(
    R => { const peak=r(R,20,60,10), off=r(R,20,80,10), hp=r(R,4,8), ho=r(R,8,16,4); const mwh=peak*hp+off*ho; return numeric(`A shaped contract delivers ${peak} MW for ${hp} peak hours and ${off} MW for ${ho} off-peak hours. Total MWh?`,mwh,'MWh',`${peak} × ${hp} + ${off} × ${ho} = ${mwh} MWh.`); },
    R => { const load=r(R,80,140,10), hedge=r(R,70,130,10), hours=r(R,4,10); const residual=(load-hedge)*hours; return numeric(`Actual load averages ${load} MW for ${hours} hours while your baseload hedge is ${hedge} MW. Residual energy position?`,residual,'MWh',`(${load} − ${hedge}) × ${hours} = ${residual} MWh.`); },
    R => { const peakP=r(R,90,180,10), offP=r(R,30,90,10), peakM=r(R,20,60,10), offM=r(R,40,100,10); const avg=round((peakP*peakM+offP*offM)/(peakM+offM),1); return numeric(`Peak price €${peakP}/MWh on ${peakM} MWh; off-peak €${offP}/MWh on ${offM} MWh. Load-weighted average price?`,avg,'€/MWh',`(${peakP} × ${peakM} + ${offP} × ${offM}) ÷ (${peakM+offM}) = €${avg}/MWh.`,.1); },
    R => choice('A clean spark spread differs from a simple spark spread because it…',['Also deducts the carbon cost associated with generation emissions','Uses no gas price','Ignores plant efficiency','Is only for renewable plants'],0,'For thermal generation, carbon can materially change dispatch economics and the merit order.'),
    R => choice('What can hedge locational power basis more directly than a system-wide futures position?',['A locational spread/transmission instrument where such a market exists','More baseload volume at the same hub','A bill of lading','A bunker swap'],0,'System futures hedge flat price; congestion instruments target the price difference between locations.'),
    R => { const qty=r(R,20,100,20)*1000, spread=r(R,5,30,5); const pnl=qty*spread; return numeric(`You are long Zone A and short Zone B on ${qty.toLocaleString('en-US')} MWh. A-minus-B spread widens €${spread}/MWh in your favour. P&L?`,pnl,'€',`${qty.toLocaleString('en-US')} × €${spread} = €${pnl.toLocaleString('en-US')}.`); },
    R => { const flow=r(R,50,200,25), spread=r(R,5,30,5), hours=r(R,4,12,2); const rent=flow*spread*hours; return numeric(`A constrained interconnector carries ${flow} MW for ${hours} hours while the zonal price spread is €${spread}/MWh. Gross congestion value?`,rent,'€',`${flow} × ${hours} × €${spread} = €${rent.toLocaleString('en-US')}.`); },
    R => { const error=r(R,5,25), hours=r(R,2,8), price=r(R,100,350,25); const cost=error*hours*price; return numeric(`Renewable output is ${error} MW below forecast for ${hours} hours and replacement/imbalance energy costs €${price}/MWh. Gross shortfall cost?`,cost,'€',`${error} × ${hours} × €${price} = €${cost.toLocaleString('en-US')}.`); },
    R => { const power=r(R,80,160,10), gas=r(R,20,50,5), heat=one(R,[1.8,2.0,2.2]), carbon=one(R,[0.32,0.36,0.4]), eua=r(R,50,100,10), other=r(R,4,12,2); const margin=round(power-gas*heat-carbon*eua-other,1); return numeric(`Power €${power}/MWh, gas €${gas}/MWh(th), heat rate ${heat}, emissions ${carbon} tCO₂/MWh(e), EUA €${eua}/t and other variable cost €${other}/MWh. Clean spark margin?`,margin,'€/MWh',`${power} − ${gas} × ${heat} − ${carbon} × ${eua} − ${other} = €${margin}/MWh.`,.1); },
    R => { const margin=r(R,10,40,5), mw=r(R,50,200,25), hours=r(R,4,12,2); const value=margin*mw*hours; return numeric(`A flexible plant has positive dispatch margin €${margin}/MWh for ${mw} MW across ${hours} hours. Gross dispatch contribution?`,value,'€',`${margin} × ${mw} × ${hours} = €${value.toLocaleString('en-US')}.`); }
  );

  EXTRA.a11.push(
    R => { const begin=r(R,20,50,5), prod=r(R,80,140,10), imp=r(R,5,20,5), use=r(R,70,120,10), exp=r(R,10,30,5); const end=begin+prod+imp-use-exp; return numeric(`Beginning stocks ${begin} Mt, production ${prod}, imports ${imp}, domestic use ${use}, exports ${exp} Mt. Ending stocks?`,end,'Mt',`${begin} + ${prod} + ${imp} − ${use} − ${exp} = ${end} Mt.`); },
    R => { const stocks=r(R,18,45,3), use=r(R,90,180,15); const ratio=round(stocks/use*100,1); return numeric(`Ending stocks are ${stocks} Mt and annual use is ${use} Mt. Stocks-to-use ratio?`,ratio,'%',`${stocks} ÷ ${use} × 100 = ${ratio}%.`,.1); },
    R => choice('Why must storage economics include shrink and quality deterioration, not only rent?',['Stored grain can lose saleable quantity or value over time','Shrink is always zero','Futures reimburse quality losses','Storage rent includes all market risks'],0,'Carry is profitable only after every cost of keeping the physical commodity saleable.'),
    R => { const rent=r(R,3,9), finance=r(R,2,7), shrink=one(R,[0.5,1.0,1.5,2.0]); const req=round(rent+finance+shrink,1); return numeric(`Storage $${rent}/t, finance $${finance}/t and expected shrink/quality cost $${shrink}/t. Minimum deferred premium needed to break even?`,req,'$/t',`${rent} + ${finance} + ${shrink} = $${req}/t.`,.1); },
    R => choice('Why are independent certificates of quality/weight important in agricultural trade?',['They create agreed evidence for acceptance, pricing adjustments and claims','They guarantee futures prices','They replace the sale contract','They remove weather risk'],0,'The contract needs an agreed measurement process because quality and weight directly determine invoice value.'),
    R => { const qty=r(R,20,70,10)*1000, freight=r(R,20,50,5); const total=qty*freight; return numeric(`Ocean freight is $${freight}/t on ${qty.toLocaleString('en-US')} t of grain. Total freight?`,total,'$',`${qty.toLocaleString('en-US')} × $${freight} = ${money(total)}.`); },
    R => { const days=r(R,1,5), rate=r(R,15,30,3)*1000; const cost=days*rate; return numeric(`A grain vessel incurs ${days} days of demurrage at ${money(rate)}/day. Cost?`,cost,'$',`${days} × ${money(rate)} = ${money(cost)}.`); },
    R => { const dest=r(R,250,360,10), freight=r(R,25,55,5), inland=r(R,8,22,2), quality=r(R,0,12,2); const nb=dest-freight-inland-quality; return numeric(`Destination value $${dest}/t; ocean freight $${freight}, inland logistics $${inland}, expected quality discount $${quality}/t. Origin netback?`,nb,'$/t',`${dest} − ${freight} − ${inland} − ${quality} = $${nb}/t.`); },
    R => { const sell=r(R,280,380,10), buy=sell-r(R,25,60,5), freight=r(R,20,45,5), quality=r(R,0,10,2), finance=r(R,2,8,2); const m=sell-buy-freight-quality-finance; return numeric(`Sell $${sell}/t, buy $${buy}/t, freight $${freight}, quality allowance $${quality}, finance $${finance}/t. Net agri margin?`,m,'$/t',`${sell} − ${buy} − ${freight} − ${quality} − ${finance} = $${m}/t.`); }
  );

  EXTRA.a12.push(
    R => { const prepay=r(R,2,10)*1000000, discount=r(R,2,6), months=r(R,3,9); const benefit=round(prepay*discount/100), annual=round((benefit/prepay)*(12/months)*100,1); return numeric(`A supplier offers a ${discount}% discount on ${money(prepay)} of material if you prepay ${months} months early. Ignoring default risk, approximate annualised discount yield?`,annual,'%',`${discount}% × 12/${months} ≈ ${annual}% annualised before credit risk.`,.1); },
    R => choice('When moving from FOB to CIF in a negotiation, the commercial question is not only freight cost but also…',['Which party now controls carriage, insurance arrangements and associated execution exposure','Whether the benchmark changes name','Whether title always transfers at destination','Whether the cargo needs documents'],0,'Changing delivery terms reallocates tasks and risks as well as invoice components.'),
    R => { const fob=r(R,600,900,20), freight=r(R,20,60,5), insurance=one(R,[1,2,3,4]), cif=fob+freight+insurance; return numeric(`FOB value $${fob}/t, main freight $${freight}/t and insurance allowance $${insurance}/t. Simplified CIF equivalent?`,cif,'$/t',`${fob} + ${freight} + ${insurance} = $${cif}/t.`); },
    R => { const qty=r(R,20,70,10)*1000, freight=r(R,20,50,5), handling=r(R,3,10); const cost=qty*(freight+handling); return numeric(`A contract change makes you responsible for $${freight}/t main carriage and $${handling}/t extra handling on ${qty.toLocaleString('en-US')} t. Added cost?`,cost,'$',`${qty.toLocaleString('en-US')} × (${freight} + ${handling}) = ${money(cost)}.`); },
    R => choice('A buyer-controlled quantity or pricing clause should be treated as…',['An economic option whose exercise can move your sourcing, hedge or margin','Pure legal boilerplate','A guaranteed upside for the seller','Something operations can price after signing'],0,'Control over future price, timing or quantity has value and should be identified before the commercial price is fixed.'),
    R => { const qty=r(R,20,70,10)*1000, m1=r(R,650,900,10), better=r(R,10,40,5), m2=m1-better; const value=qty*better; return numeric(`Buyer may choose the lower of Month 1 at $${m1}/t or Month 2 at $${m2}/t on ${qty.toLocaleString('en-US')} t. In this realised scenario, value transferred to the buyer versus being forced to Month 1?`,value,'$',`${qty.toLocaleString('en-US')} × ($${m1} − $${m2}) = ${money(value)}.`); },
    R => { const base=r(R,40,100,10)*1000, option=10, repl=r(R,5,20); const extra=base*option/100; const cost=extra*repl; return numeric(`Offtake volume is ${base.toLocaleString('en-US')} t with +${option}% buyer option. Extra tonnes cost $${repl}/t above contract economics when exercised. Realised option cost?`,cost,'$',`${base.toLocaleString('en-US')} × ${option}% × $${repl} = ${money(cost)}.`); },
    R => { const qty=r(R,20,70,10)*1000, late=r(R,1,8), rate=one(R,[0.15,0.2,0.25,0.3]); const ld=round(qty*late*rate); return numeric(`Contract provides liquidated damages of $${rate}/t/day on ${qty.toLocaleString('en-US')} t. Delivery is ${late} days late. Damages?`,ld,'$',`${qty.toLocaleString('en-US')} × ${late} × $${rate} = ${money(ld)}.`); },
    R => { const claim=r(R,1,6)*1000000, cap=r(R,1,5)*1000000; const payable=Math.min(claim,cap); return numeric(`Verified contractual claim is ${money(claim)} but the applicable liability cap is ${money(cap)}. Amount within the cap?`,payable,'$',`min(${money(claim)}, ${money(cap)}) = ${money(payable)}.`); },
    R => { const annual=r(R,50,180,10)*1000, margin=r(R,6,18,2), yrs=r(R,3,7), risk=r(R,1,5); const gross=annual*margin*yrs, reserve=annual*risk*yrs, net=gross-reserve; return numeric(`Offtake ${annual.toLocaleString('en-US')} t/year for ${yrs} years at $${margin}/t gross contribution, with $${risk}/t risk reserve. Undiscounted risk-adjusted life contribution?`,net,'$',`${annual.toLocaleString('en-US')} × (${margin} − ${risk}) × ${yrs} = ${money(net)}.`); }
  );
  EXTRA.a1.push(
    R => choice('A positive processing margin does not automatically mean a plant will run harder because…',['Capacity, maintenance, feed availability, product demand and operating constraints still matter','Margins never influence run rates','Plants ignore variable economics','Only freight determines utilisation'],0,'Processing economics are a decision input, but physical operating constraints determine whether the theoretical margin can actually be captured.')
  );
  EXTRA.a2.push(
    R => choice('A purchase QP and sale QP in different months should be treated first as…',['A calendar-spread exposure that must be measured before deciding how to hedge it','A fully matched trade because tonnes are equal','Only an invoicing issue','A freight option'],0,'Matching volume does not match pricing time. The residual risk is the price relationship between the two quotation windows.')
  );
  EXTRA.a5.push(
    R => { const var1=r(R,1,5)*1000000, days=10; const scaled=round(var1*Math.sqrt(days)); return numeric(`One-day VaR is ${money(var1)}. Under the square-root-of-time approximation, what is the ${days}-day VaR?`,scaled,'$',`${money(var1)} × √${days} ≈ ${money(scaled)}. This scaling is an approximation and can break under serial correlation or changing volatility.`,Math.max(2,Math.round(scaled*.001))); },
    R => choice('Why can a proxy hedge look highly correlated in normal markets and fail during stress?',['The economic relationship and liquidity between the two instruments can change exactly when markets dislocate','Correlation is guaranteed by history','Stress always increases correlation to one','Proxy hedges settle physically together'],0,'Historical correlation is conditional, not a contractual promise. Stress testing should assume that basis relationships can widen.')
  );
  EXTRA.a9.push(
    R => choice('When comparing LNG destination netbacks, regasification should be treated as…',['Both a per-unit cost and a capacity constraint that may have scarcity value','A sunk cost that can always be ignored','A source-price hedge','A vessel operating expense only'],0,'A theoretical gas spread is not executable if the trader lacks terminal access at the relevant time.')
  );
  EXTRA.a11.push(
    R => choice('A grain carry trade is economically attractive only if…',['The deferred premium exceeds storage, finance, shrink/quality and execution costs','The forward curve is upward sloping by any amount','Harvest has started','Futures volume is high'],0,'Contango is not profit by itself; the full physical cost of carry must fit inside the spread.')
  );

  /* @CONTENT-OVERHAUL-V6_1-END */


  const poolOf = w => (w.concepts || []).concat(EXTRA[w.id] || []);

  // il tipo di un concetto si scopre generandolo una volta: deterministico
  const tipoDi = (fn, id, k) => {
    try { return fn(rng(hash(`probe:${id}:${k}`))).type; } catch (e) { return 'choice'; }
  };

  /* Distribuzione dei concetti sulle lezioni di un desk.
     Regola: una domanda a scelta compare UNA volta per desk — è testo fisso,
     ripeterla è solo riempitivo. Un esercizio numerico può ricomparire, perché
     rigenera i valori ed è un esercizio diverso, ma non in lezioni adiacenti. */
  const distribuisci = (world, nLezioni, perLezione) => {
    const pool = poolOf(world);
    const R = rng(hash(`layout:${world.id}:v2`));
    const scelta = [], numerici = [];
    pool.forEach((fn, k) => (tipoDi(fn, world.id, k) === 'numeric' ? numerici : scelta).push(k));
    const mescola = a => { const x = a.slice();
      for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
      return x; };
    const restoScelta = mescola(scelta);
    const giroNum = mescola(numerici);

    const lezioni = Array.from({ length: nLezioni }, () => []);
    const usi = {};
    let nq = 0;
    for (let i = 0; i < nLezioni; i++) {
      for (let s = 0; s < perLezione; s++) {
        if (restoScelta.length) { lezioni[i].push(restoScelta.shift()); continue; }
        // niente più domande a scelta libere: si usa un numerico, evitando
        // quelli già comparsi nella lezione precedente
        if (!giroNum.length) { lezioni[i].push(pool.length ? nq % pool.length : 0); nq++; continue; }
        /* Fra i numerici si prende sempre il meno usato finora, evitando quelli
           già presenti in questa lezione o nella precedente. Un giro puramente
           circolare sbilanciava: alcuni arrivavano a quattro usi mentre altri
           restavano a due. */
        const prima = i > 0 ? lezioni[i - 1] : [];
        const ordinati = giroNum.slice().sort((a, b) =>
          (usi[a] || 0) - (usi[b] || 0) || giroNum.indexOf(a) - giroNum.indexOf(b));
        let scelto = ordinati.find(c => !prima.includes(c) && !lezioni[i].includes(c));
        if (scelto === undefined) scelto = ordinati.find(c => !lezioni[i].includes(c));
        if (scelto === undefined) scelto = ordinati[0];
        lezioni[i].push(scelto);
        usi[scelto] = (usi[scelto] || 0) + 1;
        nq++;
      }
    }
    return lezioni;
  };

  const lessonConceptMap = {
    a1:[[1,11,17,0,25],[10,16,26,2,21],[3,4,14,22,27],[6,12,28,5,23],[13,29,31,7,24],[8,9,30,19,20]],
    a2:[[7,9,12,0,21],[1,10,20,27,22],[11,16,31,23,28],[4,13,29,19,24],[2,5,14,3,25],[8,15,18,6,30]],
    a3:[[9,10,8,0,20],[1,3,11,21,22],[13,14,23,2,24],[17,15,25,4,19],[6,12,16,26,27],[5,28,29,7,30]],
    a4:[[7,14,3,0,19],[1,8,11,20,21],[5,17,18,2,22],[12,15,23,6,24],[10,16,25,4,26],[9,27,28,29,30]],
    a5:[[15,22,9,0,23],[1,10,17,19,30],[2,20,18,24,25],[3,13,31,26,27],[5,11,28,4,29],[8,16,14,7,21]],
    a6:[[0,22,23,1,24],[2,17,25,26,27],[3,8,13,28,29],[4,11,16,5,20],[6,14,15,19,30],[7,9,10,31,32]],
    a7:[[12,15,21,0,19],[1,18,23,5,22],[2,7,30,20,24],[4,13,14,3,25],[6,8,16,26,27],[9,11,17,28,29]],
    a8:[[3,10,12,0,4],[11,16,8,1,20],[2,14,18,21,22],[5,13,23,24,25],[6,17,15,26,27],[9,28,29,7,30]],
    a9:[[7,14,17,0,21],[15,22,30,1,20],[10,11,18,19,23],[2,12,13,4,24],[5,16,25,26,27],[3,8,9,28,29]],
    a10:[[10,13,11,0,21],[1,8,9,22,23],[12,18,24,2,29],[3,14,25,26,27],[4,7,15,5,28],[6,17,16,19,30]],
    a11:[[0,8,14,21,22],[6,10,18,1,19],[16,23,30,2,24],[3,12,25,5,20],[4,7,17,26,27],[9,11,15,28,29]],
    a12:[[0,9,12,19,22],[1,6,11,5,20],[2,18,23,24,25],[3,8,26,27,28],[4,13,15,29,30],[7,10,17,21,31]],
  };

  // A deterministic level is assembled from five concepts. Numeric factories produce
  // fresh values per level, while the seed guarantees repeatability for a given ID.
  const layoutCache = {};
  const buildLesson = (world, i, visti) => {
    const id = `${world.id}l${i+1}`;
    const R = rng(hash(`career:${id}:v1`));
    const pool = poolOf(world);
    const layout = lessonConceptMap[world.id] || (layoutCache[world.id] || (layoutCache[world.id] = distribuisci(world, world.lessons.length, 5)));
    const indici = layout[i] || [];
    const picks = indici.map(index => pool[index % pool.length]);
    return {
      id,
      title:world.lessons[i],
      goal:world.goals[i],
      generated:true,
      difficulty:Math.min(10, 3 + Math.floor((worlds.indexOf(world)*6+i)/10)),
      exercises:picks.map((fn,k) => {
        /* Un numerico ripetuto va bene solo se i valori sono diversi. Il seme
           può però estrarre due volte la stessa combinazione: invece di sperare,
           si ritenta con un seme diverso finché il testo è nuovo per il desk. */
        let ex = null;
        for (let tent = 0; tent < 24; tent++) {
          const Q = rng(hash(`${id}:q${k}:c${indici[k]}:t${tent}:v3`));
          ex = shuffleChoice(fn(Q), Q);
          if (!visti || !visti.has(ex.prompt)) break;
        }
        if (visti && ex) visti.add(ex.prompt);
        return ex;
      })
    };
  };

  const validateExercise = ex => {
    if (!ex || typeof ex.prompt !== 'string' || typeof ex.why !== 'string') return false;
    if (ex.type === 'choice') return Array.isArray(ex.options) && ex.options.length >= 2 && Number.isInteger(ex.answer) && ex.answer >= 0 && ex.answer < ex.options.length;
    if (ex.type === 'numeric') return Number.isFinite(Number(ex.answer)) && Number.isFinite(Number(ex.tolerance ?? 0));
    return false;
  };
  const validateLesson = lesson => Array.isArray(lesson.exercises) && lesson.exercises.length >= 5 && lesson.exercises.every(validateExercise);

  const advancedUnits = worlds.map(w => {
    const visti = new Set();   // testi già usati in questo desk
    return {
      id:w.id, title:w.title, subtitle:w.subtitle, colour:'gold', phase:w.phase,
      lessons:w.lessons.map((_,i) => buildLesson(w,i,visti))
    };
  });

  // Contract for future AI-generated packs. AI output is never trusted merely because
  // it parses: every lesson/exercise must satisfy this same schema before it can enter
  // the game. Numeric answers can then be independently recomputed server-side later.
  const validateExternalPack = pack => {
    const errors = [];
    if (!pack || typeof pack !== 'object') return { ok:false, errors:['Pack must be an object.'] };
    if (!Array.isArray(pack.lessons) || !pack.lessons.length) errors.push('Pack must contain lessons.');
    const seen = new Set();
    for (const lesson of (pack.lessons || [])) {
      if (!lesson?.id || typeof lesson.id !== 'string') errors.push('Every lesson needs a string id.');
      else if (seen.has(lesson.id)) errors.push(`Duplicate lesson id: ${lesson.id}`);
      else seen.add(lesson.id);
      if (!lesson?.title || !lesson?.goal) errors.push(`Lesson ${lesson?.id || '?'} needs title and goal.`);
      if (!validateLesson(lesson)) errors.push(`Lesson ${lesson?.id || '?'} has invalid exercises.`);
    }
    return { ok:errors.length === 0, errors };
  };

  const invalid = advancedUnits.flatMap(u => u.lessons.filter(l => !validateLesson(l)).map(l => l.id));
  if (invalid.length) throw new Error(`WOT Content Engine produced invalid lessons: ${invalid.join(', ')}`);

  const makeMasterySet = (seed = Date.now(), count = 10, maxWorld = worlds.length) => {
    const R = rng(hash(`mastery:${seed}:v1`));
    const pool = worlds.slice(0, Math.max(1, Math.min(worlds.length, Number(maxWorld)||worlds.length)));
    const out = [];
    for (let i=0;i<count;i++) {
      const w = pool[Math.floor(R()*pool.length)];
      // nome diverso: `pool` esiste già in questa funzione e ridichiararlo
      // lo metterebbe in ombra proprio sulla riga sopra
      const concetti = poolOf(w);
      const concept = concetti[Math.floor(R()*concetti.length)];
      const Q = rng(hash(`mastery:${seed}:${i}:${w.id}`));
      const ex = shuffleChoice(concept(Q), Q);
      if (!validateExercise(ex)) throw new Error(`Invalid mastery exercise at ${i}`);
      out.push({ ex, i, lessonId:null, skill:w.skill, worldId:w.id, division:w.division });
    }
    return out;
  };

  window.CURRICULUM = [...(window.CURRICULUM || []), ...advancedUnits];
  window.WOT_CONTENT = {
    version:1,
    worlds,
    advancedUnits,
    poolOf, EXTRA,
    generatedLevels:advancedUnits.reduce((n,u) => n + u.lessons.length,0),
    generatedExercises:advancedUnits.reduce((n,u) => n + u.lessons.reduce((m,l) => m+l.exercises.length,0),0),
    unitMeta:Object.fromEntries(worlds.map(w => [w.id,{division:w.division,skill:w.skill,chapter:w.phase,phase:w.phase,icon:w.icon,advanced:true}])),
    validateExercise,
    validateLesson,
    buildLesson, makeMasterySet, validateExternalPack,
    worldCatalog:worlds.map(w => ({id:w.id,title:w.title,subtitle:w.subtitle,division:w.division,skill:w.skill,phase:w.phase,icon:w.icon,levels:w.lessons.length})),
  };
})();
