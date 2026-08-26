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
  const numeric = (prompt, answer, unit, why, tolerance=0) => ({ type:'numeric', prompt, answer, unit, tolerance, why: why.length > 40 ? why : `${why} This is the direct desk calculation from the values in the prompt.` });
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
        R => { const stocks=r(R,12,36), use=r(R,2,6); const days=round(stocks/use,1); return numeric(`Stocks are ${stocks} Mt and consumption is ${use} Mt/day. Approximate days of cover?`,days,'days',`${stocks} ÷ ${use} = ${days} days of cover.`,.05); },
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
        R => { const value=r(R,2,10)*1000000, days=r(R,30,120,15), rate=one(R,[5,6,7,8]); const interest=round(value*(rate/100)*(days/360)); return numeric(`Fund ${(value/1e6)}m for ${days} days at ${rate}% p.a. on a 360-day basis. Interest?`,interest,'$',`${money(value)} × ${rate}% × ${days}/360 ≈ ${money(interest)}.`,2); },
        R => choice('A documentary letter of credit primarily helps the seller by…',['Substituting bank documentary payment risk for pure buyer open-account risk','Fixing commodity price','Guaranteeing cargo quality','Fixing freight'],0,'A compliant LC can materially improve payment security, but only if documents meet its conditions.'),
        R => { const limit=r(R,5,15)*1000000, used=r(R,2,10)*1000000; const avail=Math.max(0,limit-used); return numeric(`Counterparty limit ${money(limit)}, current exposure ${money(used)}. Remaining headroom?`,avail,'$',`${money(limit)} − ${money(used)} = ${money(avail)}.`); },
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
        R => { const product=r(R,85,125), crude=r(R,65,95), cost=r(R,4,10); return numeric(`Product value $${product}/bbl, crude $${crude}/bbl, variable refining cost $${cost}/bbl. Simple margin?`,product-crude-cost,'$/bbl',`${product} − ${crude} − ${cost} = $${product-crude-cost}/bbl.`); },
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
    }
  ];

  // Five concept slots per lesson, curated so generated questions stay on the lesson's
  // actual learning objective instead of sampling the whole desk indiscriminately.
  const lessonConceptMap = {
    a1:[[0,1,2,8,9],[2,0,1,4,9],[3,4,8,1,2],[5,6,3,4,8],[7,5,6,8,9],[8,9,0,3,6]],
    a2:[[0,3,6,7,9],[1,7,9,0,8],[1,2,7,9,6],[4,0,3,7,8],[5,8,2,3,9],[8,9,7,4,5]],
    a3:[[0,4,5,7,9],[1,3,6,9,0],[2,3,8,1,9],[4,0,6,7,9],[6,0,4,7,5],[5,7,9,6,0]],
    a4:[[0,3,6,7,9],[1,8,3,9,0],[2,5,9,3,7],[3,6,0,7,9],[4,0,5,7,9],[9,2,3,5,7]],
    a5:[[0,7,8,9,3],[1,2,9,0,3],[2,5,6,8,9],[3,0,9,2,7],[4,5,8,9,2],[7,8,9,5,0]],
    a6:[[0,1,2,7,9],[2,7,9,0,1],[3,8,9,2,7],[4,5,6,7,9],[6,4,5,7,9],[7,9,0,3,8]],
    a7:[[0,1,5,6,9],[1,6,7,0,9],[2,7,6,1,9],[3,4,9,5,8],[5,6,8,0,9],[9,8,5,6,1]],
    a8:[[0,3,4,9,5],[1,2,8,9,0],[2,8,9,3,4],[5,3,4,9,0],[6,1,9,3,7],[9,4,5,7,8]],
    a9:[[0,7,8,9,1],[1,4,8,9,2],[1,4,6,8,9],[2,3,9,1,8],[5,7,8,0,9],[9,8,3,4,2]],
    a10:[[0,9,1,3,5],[1,9,4,7,0],[2,6,9,3,0],[3,8,9,4,1],[4,5,7,9,3],[9,4,5,7,8]],
    a11:[[0,8,9,1,4],[1,6,9,0,4],[2,1,6,8,9],[3,5,9,4,6],[4,7,9,3,5],[9,1,3,5,7]],
    a12:[[0,5,9,1,7],[1,5,6,9,0],[2,7,9,0,1],[3,7,8,9,2],[4,7,8,9,3],[9,0,1,3,8]],
  };

  // A deterministic level is assembled from five concepts. Numeric factories produce
  // fresh values per level, while the seed guarantees repeatability for a given ID.
  const buildLesson = (world, i) => {
    const id = `${world.id}l${i+1}`;
    const R = rng(hash(`career:${id}:v1`));
    const mapped = lessonConceptMap[world.id]?.[i];
    const picks = mapped
      ? mapped.map(index => world.concepts[index])
      : Array.from({length:5},(_,k) => world.concepts[(i*3+k*2) % world.concepts.length]);
    return {
      id,
      title:world.lessons[i],
      goal:world.goals[i],
      generated:true,
      difficulty:Math.min(10, 3 + Math.floor((worlds.indexOf(world)*6+i)/10)),
      exercises:picks.map((fn,k) => { const Q=rng(hash(`${id}:q${k}:v1`)); return shuffleChoice(fn(Q), Q); })
    };
  };

  const validateExercise = ex => {
    if (!ex || typeof ex.prompt !== 'string' || typeof ex.why !== 'string') return false;
    if (ex.type === 'choice') return Array.isArray(ex.options) && ex.options.length >= 2 && Number.isInteger(ex.answer) && ex.answer >= 0 && ex.answer < ex.options.length;
    if (ex.type === 'numeric') return Number.isFinite(Number(ex.answer)) && Number.isFinite(Number(ex.tolerance ?? 0));
    return false;
  };
  const validateLesson = lesson => Array.isArray(lesson.exercises) && lesson.exercises.length >= 5 && lesson.exercises.every(validateExercise);

  const advancedUnits = worlds.map(w => ({
    id:w.id, title:w.title, subtitle:w.subtitle, colour:'gold', phase:w.phase,
    lessons:w.lessons.map((_,i) => buildLesson(w,i))
  }));

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
      const concept = w.concepts[Math.floor(R()*w.concepts.length)];
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
    generatedLevels:advancedUnits.reduce((n,u) => n + u.lessons.length,0),
    generatedExercises:advancedUnits.reduce((n,u) => n + u.lessons.reduce((m,l) => m+l.exercises.length,0),0),
    unitMeta:Object.fromEntries(worlds.map(w => [w.id,{division:w.division,skill:w.skill,chapter:w.phase,phase:w.phase,icon:w.icon,advanced:true}])),
    validateExercise,
    validateLesson,
    buildLesson, makeMasterySet, validateExternalPack,
    worldCatalog:worlds.map(w => ({id:w.id,title:w.title,subtitle:w.subtitle,division:w.division,skill:w.skill,phase:w.phase,icon:w.icon,levels:w.lessons.length})),
  };
})();
