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
    R => choice('A vessel is delayed by port congestion under a voyage charter. Who bears it?',
      ['The charterer, once laytime is exhausted, as demurrage','The owner, always','The port','Nobody'],0,
      'That is the point of laytime: it allocates a fixed allowance, and congestion beyond it has a price.'),
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
    R => choice('A buyer offers a discount for prepayment. What have you become?',
      ['An unsecured lender to that buyer, on top of being their supplier','Only a supplier','Fully secured','Hedged'],0,
      'Prepayment converts trading exposure into credit exposure, and it should be priced and limited like lending.'),
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
    R => { const pos=r(R,20,80,5)*1000, vol=r(R,4,18); const z=1.645; const v=round(pos*vol*z);
      return numeric(`You are long ${pos.toLocaleString('en-US')} t and daily volatility is $${vol}/t. Using a 95% factor of 1.645, what is the one-day VaR?`,v,'$',
        `${pos.toLocaleString('en-US')} × ${vol} × 1.645 = ${money(v)}. The whole number rests on that volatility estimate.`,Math.max(1,Math.round(pos*vol*z*0.001))); },
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
        `(${lme} + ${prem}) × ${t.toLocaleString('en-US')} = ${money(val)}. Only the LME part is hedgeable on the exchange.`); },
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
    R => { const t=r(R,5,40,5)*1000, mo=one(R,[1.5,2.0,2.5,3.0]); const perso=round(t*mo/100);
      return numeric(`You buy ${t.toLocaleString('en-US')} t at ${mo}% above the contract moisture. Approximate tonnes of water you are paying for?`,perso,'t',
        `${t.toLocaleString('en-US')} × ${mo}% = ${perso.toLocaleString('en-US')} t. Excess moisture is weight you buy and cannot sell.`,2); }
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
  const layoutCache = {};
  const buildLesson = (world, i, visti) => {
    const id = `${world.id}l${i+1}`;
    const R = rng(hash(`career:${id}:v1`));
    const pool = poolOf(world);
    const layout = layoutCache[world.id] || (layoutCache[world.id] = distribuisci(world, world.lessons.length, 5));
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
