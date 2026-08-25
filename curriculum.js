/* World of Trade — Learn
   Il programma. Ogni lezione è una sequenza di esercizi brevi.
   Tipi: choice · numeric · order · pairs · build
*/
window.CURRICULUM = [
  {
    id: 'u1',
    title: 'What a physical trade is',
    subtitle: 'The shape of the business',
    colour: 'gold',
    lessons: [
      {
        id: 'u1l1',
        title: 'Two sides and a cargo',
        goal: 'A physical trader buys from a producer and sells to a consumer, and owns the goods in between.',
        exercises: [
          { type:'choice', prompt:'A physical commodity trader makes money mainly by…',
            options:['Betting on the price going up','Buying a cargo somewhere and selling it somewhere it is worth more','Lending money to mines','Storing goods until they expire'],
            answer:1,
            why:'Physical trading is about moving goods from where they are worth less to where they are worth more — in place, in time, or in form. Price direction is a risk to manage, not the business.' },
          { type:'choice', prompt:'You buy 500 t of copper from a mine in Chile and sell it to a cable factory in Italy. Between the two, who owns the copper?',
            options:['The mine, until the factory pays','You','The shipping line','Nobody — it is in transit'],
            answer:1,
            why:'That is the whole point. You take ownership, and with it the price risk, the financing cost and the operational risk. That is why you get paid a margin.' },
          { type:'pairs', prompt:'Match each party to what it wants',
            pairs:[['Producer','A reliable buyer for steady volume'],['Consumer','Material delivered on time, on spec'],['Trader','The margin between the two, net of costs']],
            why:'A trade exists because the producer and the consumer want different things. The trader bridges the gap and is paid for it.' },
          { type:'choice', prompt:'Which of these is NOT part of a physical trader’s job?',
            options:['Arranging the freight','Financing the cargo while it moves','Operating the mine','Managing the price risk'],
            answer:2,
            why:'Traders do not produce. They source, finance, move, manage risk and deliver. Owning production is a separate, later choice called vertical integration.' },
          { type:'build', prompt:'Complete the sentence',
            sentence:['A trader is paid for','moving goods','from where they are worth less','to where they are worth more'],
            distractors:['for predicting prices','by the exchange'],
            why:'Keep this sentence. Everything else in the course is a detail of how.' }
        ]
      },
      {
        id: 'u1l2',
        title: 'Where the margin goes',
        goal: 'Gross margin is not profit. Freight, finance and operations eat into it.',
        exercises: [
          { type:'choice', prompt:'You buy a cargo for $1,000,000 and sell it for $1,050,000. Your profit is…',
            options:['$50,000','Less than $50,000','More than $50,000','Exactly zero'],
            answer:1,
            why:'The $50,000 is gross margin. Freight, insurance, financing interest, inspection and any claims come out of it. What is left is profit.' },
          { type:'numeric', prompt:'Gross margin $50,000. Freight $18,000, financing $9,000, inspection $4,000. What is the net result?',
            answer:19000, unit:'$', tolerance:0,
            why:'50,000 − 18,000 − 9,000 − 4,000 = 19,000. A 5% headline margin became under 2% of the cargo value.' },
          { type:'order', prompt:'Put the costs in the order they normally hit you',
            items:['Pay the supplier','Pay freight and insurance','Accrue financing interest','Get paid by the buyer'],
            why:'You pay first and get paid last. The gap between the two is the working capital you have to fund — the heart of the business.' },
          { type:'choice', prompt:'A cargo takes 30 days to sail and the buyer pays 30 days after delivery. How long is your money tied up?',
            options:['30 days','About 60 days','Until the price moves','No time — the bank pays'],
            answer:1,
            why:'Roughly 60 days, and every one of them is financed. This is why a shorter voyage with a thinner margin often beats a longer one with a fatter margin.' },
          { type:'choice', prompt:'Which single number tells you least about whether a trade is good?',
            options:['The working capital days','The gross margin','The freight cost','The financing rate'],
            answer:1,
            why:'Gross margin alone is the most misleading number in physical trading. It is the starting point, not the answer.' }
        ]
      },
      {
        id: 'u1l3',
        title: 'The cargo has to move',
        goal: 'Freight, transit time and the vessel that fits the parcel.',
        exercises: [
          { type:'choice', prompt:'Why does transit time matter to your P&L, beyond patience?',
            options:['It does not','Every extra day is financed and adds price exposure','Ships charge by the day always','Longer voyages get better prices'],
            answer:1,
            why:'Time is money twice over: interest on the funding, and more days for the price to move against you.' },
          { type:'pairs', prompt:'Match the parcel to a sensible vessel',
            pairs:[['175 t of copper','Truck or rail'],['25,000 t of soybeans','Handysize bulk carrier'],['170,000 t of iron ore','Capesize bulk carrier']],
            why:'Matching the parcel to the vessel is basic credibility. A 1,600 t parcel on a Supramax is a half-empty ship you are paying for.' },
          { type:'choice', prompt:'Your buyer needs the cargo in 20 days. The voyage takes 28. What is the honest answer?',
            options:['Promise 20 and hope','Offer a realistic date, or a different origin','Send it faster','Split the cargo'],
            answer:1,
            why:'Late delivery costs reputation and can trigger claims. In a business built on repeat counterparties, a realistic date beats a lost one.' },
          { type:'numeric', prompt:'Freight is $28/t. You are shipping 25,000 t. What is the freight cost?',
            answer:700000, unit:'$', tolerance:0,
            why:'25,000 × 28 = $700,000. On a cargo worth about $6 million, freight alone is over 11% — which is why freight is a trading decision, not an afterthought.' }
        ]
      },
      {
        id: 'u1l4',
        title: 'Getting paid',
        goal: 'Payment terms decide when cash comes back, and whether it comes back at all.',
        exercises: [
          { type:'choice', prompt:'Selling on 30-day payment terms is, in effect…',
            options:['A discount','A loan you make to your buyer','Free','A hedge'],
            answer:1,
            why:'You deliver the goods and wait for the money. That is credit you extend — cheap when the buyer is good, expensive when they are not.' },
          { type:'choice', prompt:'Which payment term is best for YOUR cash position?',
            options:['30 days after delivery','Payment at delivery','20% advance','They are the same'],
            answer:2,
            why:'An advance funds part of the cargo for you. It is the best for your cash and the hardest to get — buyers dislike it, so it costs you elsewhere.' },
          { type:'order', prompt:'Order these from lowest to highest risk of not being paid',
            items:['Advance payment','Letter of credit','Payment at delivery','Open account, 30 days'],
            why:'Payment risk and commercial attractiveness pull in opposite directions. Choosing between them is a real decision on every trade.' },
          { type:'build', prompt:'Complete the sentence',
            sentence:['Physical trading is the business','of funding the gap','between paying the supplier','and being paid by the buyer'],
            distractors:['of predicting the market','of owning ships'],
            why:'If you remember one sentence from this unit, make it this one.' }
        ]
      }
    ]
  },
  {
    id: 'u2',
    title: 'Incoterms',
    subtitle: 'Who does what, and who carries the risk',
    colour: 'blue',
    lessons: [
      {
        id: 'u2l1',
        title: 'FOB — the benchmark',
        goal: 'Free On Board: you deliver on board at the load port, the buyer takes it from there.',
        exercises: [
          { type:'choice', prompt:'Under FOB, who arranges and pays the ocean freight?',
            options:['The seller','The buyer','The bank','It is shared'],
            answer:1,
            why:'FOB means your job ends once the goods are on board at the load port. The buyer books and pays the ship.' },
          { type:'choice', prompt:'Under FOB, when does the risk pass from seller to buyer?',
            options:['When the contract is signed','When the goods are on board at the load port','On arrival at destination','When the buyer pays'],
            answer:1,
            why:'On board at the load port. After that, if the cargo is damaged at sea, it is the buyer’s problem — and the buyer’s insurance.' },
          { type:'choice', prompt:'You sell FOB instead of CIF. What happens to the price you can charge?',
            options:['It goes up','It goes down','It stays the same','It doubles'],
            answer:1,
            why:'You are delivering less, so you are paid less. FOB nets you a lower price but ties up less capital and carries less execution risk.' },
          { type:'pairs', prompt:'Under FOB, who pays for what?',
            pairs:[['Loading at origin','Seller'],['Ocean freight','Buyer'],['Marine insurance','Buyer'],['Import duty','Buyer']],
            why:'FOB is the physical-trade benchmark precisely because the split is clean and well understood.' }
        ]
      },
      {
        id: 'u2l2',
        title: 'CFR and CIF — you pay the freight',
        goal: 'Selling delivered-to-port: more price, more capital, more execution risk.',
        exercises: [
          { type:'choice', prompt:'What does the extra "I" in CIF add compared to CFR?',
            options:['Inspection','Insurance','Import duty','Interest'],
            answer:1,
            why:'CFR is Cost and Freight: you pay the freight. CIF adds Insurance: you also pay the marine cover to destination.' },
          { type:'choice', prompt:'You switch from FOB to CIF. What happens to your working capital need?',
            options:['It falls','It rises','Unchanged','It disappears'],
            answer:1,
            why:'You are now funding the freight and the insurance as well as the cargo, for longer. More price, more capital.' },
          { type:'order', prompt:'Order these incoterms from least to most seller obligation',
            items:['EXW','FOB','CFR','CIF','DDP'],
            why:'This ladder is worth knowing by heart. Every step right means the seller does more, charges more and carries more.' },
          { type:'choice', prompt:'Under CIF, the cargo is damaged mid-voyage. Whose insurance responds?',
            options:['The seller’s — the seller bought it','The buyer’s','The shipping line’s','Nobody’s'],
            answer:0,
            why:'Under CIF the seller buys the insurance, but note the subtlety: risk passes on shipment, so the buyer usually claims on a policy the seller paid for and assigned.' }
        ]
      },
      {
        id: 'u2l3',
        title: 'EXW and DDP — the extremes',
        goal: 'The two ends of the ladder, and why you would ever pick them.',
        exercises: [
          { type:'choice', prompt:'Under EXW (Ex Works), what does the seller actually do?',
            options:['Delivers to the buyer’s door','Makes the goods available at their own premises','Pays the freight','Clears customs'],
            answer:1,
            why:'EXW is the minimum: the goods are available at the seller’s gate and the buyer does everything else, including loading and export clearance.' },
          { type:'choice', prompt:'Under DDP, who pays the import duty?',
            options:['The buyer','The seller','The carrier','Split evenly'],
            answer:1,
            why:'DDP is Delivered Duty Paid: the seller delivers cleared and duty-paid at the destination. It is the heaviest obligation on the ladder.' },
          { type:'choice', prompt:'Why would a trader sell DDP despite the cost and risk?',
            options:['It is simpler','The buyer pays a premium and accepts more easily','It avoids tax','Banks require it'],
            answer:1,
            why:'You are selling convenience. A buyer who wants goods at their door without touching logistics will pay for it — if you can execute.' },
          { type:'numeric', prompt:'FOB nets you $38,000. Selling CIF instead adds $18,000 of price but $6,000 of freight and insurance you must fund. What is the CIF margin?',
            answer:50000, unit:'$', tolerance:0,
            why:'38,000 + 18,000 − 6,000 = 50,000. More margin, but you have carried more risk and more capital to earn it.' }
        ]
      },
      {
        id: 'u2l4',
        title: 'Risk, cost, and title',
        goal: 'The distinction that separates people who have read about incoterms from people who use them.',
        exercises: [
          { type:'choice', prompt:'Do incoterms determine who legally owns the goods?',
            options:['Yes, always','No — they allocate cost and risk, not title','Only for FOB','Only with a letter of credit'],
            answer:1,
            why:'This is the point most people get wrong. Incoterms allocate costs, responsibilities and the transfer of risk. Title passes according to the sales contract and the documents — typically the bill of lading.' },
          { type:'choice', prompt:'Which document normally controls ownership of a seaborne cargo?',
            options:['The commercial invoice','The bill of lading','The incoterm','The insurance certificate'],
            answer:1,
            why:'An original negotiable bill of lading is a document of title. Whoever holds it controls the goods — which is exactly why banks take it as security.' },
          { type:'pairs', prompt:'Match each thing to what decides it',
            pairs:[['Who pays the freight','The incoterm'],['When risk passes','The incoterm'],['Who owns the goods','The contract and the bill of lading']],
            why:'Cost and risk: incoterms. Title: the contract and the documents. Keep them separate in your head.' },
          { type:'build', prompt:'Complete the sentence',
            sentence:['Incoterms allocate','cost and risk','but they do not','decide legal title'],
            distractors:['set the price','choose the vessel'],
            why:'Say this in an interview and you will sound like someone who has used incoterms, not read about them.' }
        ]
      }
    ]
  }

  ,{
    id: 'u3', title: 'Pricing', subtitle: 'How a cargo actually gets a price',
    lessons: [
      { id:'u3l1', title:'Benchmark and premium',
        goal:'Physical prices are quoted against a benchmark, plus or minus a differential.',
        exercises:[
          { type:'choice', prompt:'A physical copper cargo is usually priced as…',
            options:['A number agreed from scratch','The exchange price plus or minus a differential','Whatever the buyer offers','Cost of production plus a margin'],
            answer:1, why:'Almost nothing in physical is priced from scratch. You agree a benchmark — LME, CBOT, Platts, Brent — then negotiate the differential around it.' },
          { type:'choice', prompt:'The exchange price is $9,500/t. You agree "LME cash + $120". What do you get per tonne?',
            options:['$120','$9,380','$9,620','$9,500'], answer:2,
            why:'9,500 + 120 = $9,620. The premium pays for location, form, quality and the service of delivering where the buyer needs it.' },
          { type:'choice', prompt:'What does a physical premium mostly compensate you for?',
            options:['Guessing the market right','Getting the metal to that place, in that shape, at that time','The exchange fee','Buyer credit risk'],
            answer:1, why:'The premium is the price of place, form and time. It is the part a trader can influence — the flat price belongs to the market.' },
          { type:'pairs', prompt:'Match each term to what it is',
            pairs:[['Benchmark','The reference price everyone quotes against'],['Differential','The plus or minus you negotiate'],['Basis','The gap between local physical and benchmark']],
            why:'Traders live on the differential. The benchmark moves for everyone; the differential is where skill shows.' },
          { type:'build', prompt:'Complete the sentence',
            sentence:['A physical price is','a benchmark','plus or minus','a differential'],
            distractors:['a forecast','a fixed number'],
            why:'Once you read every quote this way, physical pricing stops being mysterious.' }
        ] },
      { id:'u3l2', title:'The quotational period',
        goal:'The QP decides which days set your price — and it is worth money.',
        exercises:[
          { type:'choice', prompt:'What is a quotational period (QP)?',
            options:['How long the buyer has to pay','The window whose prices set the cargo price','The life of the contract','Time the ship is at berth'],
            answer:1, why:'The QP is the pricing window: an average of a month, the month of arrival, or a single date declared inside a range.' },
          { type:'choice', prompt:'You sell on "month of arrival average" QP and the cargo arrives in March. Which prices set your sale?',
            options:['The price the day you signed','The average of March','The price on arrival day','The February average'],
            answer:1, why:'All of March averages out. This is the metals standard, and why hedging a QP with one futures date leaves a mismatch.' },
          { type:'choice', prompt:'Your buyer chooses the pricing date inside the QP. Who holds the valuable option?',
            options:['You','The buyer','The bank','Nobody'], answer:1,
            why:'The buyer will pick the date that suits them, not you. You are short an option — charge for it or you have given away money.' },
          { type:'numeric', prompt:'A cargo prices on the March average of $9,600/t. You bought at $9,400/t. On 500 t, what is the gross margin?',
            answer:100000, unit:'$', tolerance:0,
            why:'(9,600 − 9,400) × 500 = $100,000. You chose neither price: the QP did. That is why a QP is negotiated, not accepted.' },
          { type:'choice', prompt:'Why do traders care so much which QP is agreed?',
            options:['It is a formality','It moves the price and the risk, and one side always gains','It sets the freight','Banks require one'],
            answer:1, why:'A QP is a distribution of outcomes, not a detail. Agreeing one without pricing it is a common way juniors lose money.' }
        ] }
    
      ,{ id:'u3l3', title:'Basis: the trader edge',
        goal:'Basis is the gap between local physical and the benchmark — and it moves.',
        exercises:[
          { type:'choice', prompt:'Basis is the difference between…',
            options:['Two futures months','The local physical price and the benchmark','Bid and offer','Cost and sale price'],
            answer:1, why:'Rotterdam aluminium does not trade at exactly the LME price. That gap — location, quality, availability — is the basis.' },
          { type:'choice', prompt:'Shanghai copper trades $30/t below the benchmark. That basis is…',
            options:['Positive','Negative','Zero','Impossible'], answer:1,
            why:'A discount to the benchmark is a negative basis: locally there is more metal than buyers want, right now.' },
          { type:'choice', prompt:'You are perfectly hedged on flat price. Can basis still hurt you?',
            options:['No, a hedge covers everything','Yes — the hedge tracks the benchmark, not your local price','Only in contango','Only in agriculture'],
            answer:1, why:'This is the most important idea in the course. The hedge follows the benchmark; your cargo is priced locally. When they diverge you lose money on a hedged trade.' },
          { type:'pairs', prompt:'What makes a local basis move?',
            pairs:[['Local shortage','Basis strengthens'],['Congestion at origin','Basis strengthens at destination'],['A flood of imports arriving','Basis weakens']],
            why:'Basis is supply and demand you can see: ships, warehouses, plants. That is why physical traders travel.' },
          { type:'build', prompt:'Complete the sentence',
            sentence:['A hedge removes','flat price risk','but it leaves','basis risk'],
            distractors:['all risk','credit risk'],
            why:'Say this in an interview and you are already ahead of most candidates.' }
        ] },
      { id:'u3l4', title:'Contango and backwardation',
        goal:'The shape of the curve tells you whether to hold inventory.',
        exercises:[
          { type:'choice', prompt:'Forward prices are higher than spot. This market is in…',
            options:['Backwardation','Contango','Equilibrium','Default'], answer:1,
            why:'Contango: the future is worth more than today. The market is paying you to hold the goods and deliver later.' },
          { type:'choice', prompt:'Forward prices are below spot. What is the market telling you?',
            options:['There is plenty of material','Material is tight right now','Freight is expensive','Nothing useful'],
            answer:1, why:'Backwardation means people want it now and will pay a premium for prompt delivery. Holding inventory costs you.' },
          { type:'numeric', prompt:'Spot $9,500/t, six months forward $9,700/t. Storage, insurance and finance cost $150/t. Profit per tonne on the carry?',
            answer:50, unit:'$', tolerance:0,
            why:'(9,700 − 9,500) − 150 = $50/t. Contango only pays if it is wider than your cost of carry. That comparison is the whole trade.' },
          { type:'choice', prompt:'Contango is $80/t and your cost of carry is $150/t. What should you do?',
            options:['Store it anyway','Do not store it — you would lose $70/t','Buy more','Sell the futures'],
            answer:1, why:'Storing destroys value here. Knowing your own carry cost is what lets you answer instantly.' },
          { type:'order', prompt:'Order these from tightest market to most oversupplied',
            items:['Steep backwardation','Mild backwardation','Flat curve','Steep contango'],
            why:'The curve is a live read on physical tightness. Learn to glance at it before anything else.' }
        ] }
    ] }

  ,{
    id: 'u4', title: 'Hedging', subtitle: 'Protecting the margin without sinking the desk',
    lessons: [
      { id:'u4l1', title:'Why hedge at all',
        goal:'A trader locks the margin instead of betting on direction.',
        exercises:[
          { type:'choice', prompt:'You buy a cargo today and sell it in six weeks. What are you exposed to?',
            options:['Nothing','The price falling before you sell','The price rising','Only freight'],
            answer:1, why:'You are long physical. If the price falls before your sale is priced, your margin evaporates even though you did nothing wrong commercially.' },
          { type:'choice', prompt:'To hedge a long physical position you…',
            options:['Buy futures','Sell futures','Buy more cargo','Do nothing'], answer:1,
            why:'You are long the goods, so you go short paper. If the price falls, the physical loses and the futures gain. The margin survives.' },
          { type:'choice', prompt:'What is a trader actually selling, once hedged?',
            options:['A view on price','The service of sourcing, moving and delivering','Storage','Insurance'],
            answer:1, why:'Hedging strips out the price bet and leaves the business: sourcing, logistics, financing, execution. That is what a merchant is paid for.' },
          { type:'numeric', prompt:'Copper falls $200/t. You hold 500 t hedged 100%. Roughly what is the net flat-price impact?',
            answer:0, unit:'$', tolerance:0,
            why:'Around zero. The cargo loses $100,000 and the short futures gain about $100,000. That is the point of a hedge.' }
        ] },
      { id:'u4l2', title:'Hedge ratio',
        goal:'How much to hedge, and what you keep when you hedge less.',
        exercises:[
          { type:'choice', prompt:'A 60% hedge ratio means…',
            options:['You are 60% likely to profit','60% of the tonnage is protected, 40% is exposed','You hedge for 60 days','You pay 60% margin'],
            answer:1, why:'The unhedged 40% is a position on price. It might be a view — or an accident, which is worse.' },
          { type:'numeric', prompt:'You hold 500 t hedged at 80%. The price falls $200/t. What is your net loss?',
            answer:20000, unit:'$', tolerance:0,
            why:'The unhedged 20% is 100 t. 100 × 200 = $20,000. Every point of hedge you skip is a position you are choosing to hold.' },
          { type:'choice', prompt:'When is running an unhedged position defensible?',
            options:['Never','When it is a deliberate, sized, approved view','When you are short of cash','When the market is calm'],
            answer:1, why:'The problem is not risk, it is unintended risk. A desk that knows exactly what it is long, and why, is doing its job.' },
          { type:'choice', prompt:'You cannot afford the margin for a full hedge. What is the honest reading?',
            options:['Hedge less and hope','The cargo is too big for your balance sheet','Borrow more, always','Ignore the hedge'],
            answer:1, why:'If you can only fund the trade by carrying price risk you did not intend, the trade is too large for you. Size is a risk decision.' }
        ] }
    
      ,{ id:'u4l3', title:'Variation margin — the trap',
        goal:'A perfect hedge can still bankrupt you.',
        exercises:[
          { type:'choice', prompt:'You are short futures as a hedge. The price rises sharply. What happens?',
            options:['You profit immediately','You must post cash on the futures loss','Nothing until delivery','The exchange waits'],
            answer:1, why:'Variation margin settles daily. Your paper leg loses and you pay cash today, while the physical gain only arrives at settlement.' },
          { type:'choice', prompt:'Your cargo is worth more, your hedge is losing, and you have no cash. What is this?',
            options:['A pricing problem','A liquidity problem','A credit problem','Not a problem'],
            answer:1, why:'This is how well-hedged companies fail. The trade is profitable on paper and dead in cash. Liquidity and price risk are different risks.' },
          { type:'order', prompt:'Order what happens when the market moves against your hedge',
            items:['Price rises','Futures position loses value','Exchange calls for variation margin','You post cash the same day'],
            why:'Notice the physical gain is not on this list — it arrives at the end. That timing gap is the whole danger.' },
          { type:'numeric', prompt:'You are short 500 t of futures. The price rises $300/t. How much variation margin must you find?',
            answer:150000, unit:'$', tolerance:0,
            why:'500 × 300 = $150,000, payable now. Your cargo is worth $150,000 more, but nobody pays you for that until it settles.' },
          { type:'build', prompt:'Complete the sentence',
            sentence:['A hedge protects','the margin','but it does not protect','the cash position'],
            distractors:['the reputation','the freight rate'],
            why:'Keep this one. It separates people who have hedged from people who have read about hedging.' }
        ] },
      { id:'u4l4', title:'When the hedge does not fit',
        goal:'Timing mismatches, wrong benchmarks and imperfect proxies.',
        exercises:[
          { type:'choice', prompt:'You hedge a March-average QP by selling futures on one day in February. What have you created?',
            options:['A perfect hedge','A timing mismatch — basis risk','A freight position','Nothing unusual'],
            answer:1, why:'Your sale prices across all of March; your hedge priced on a single February day. The difference is yours to keep or lose.' },
          { type:'choice', prompt:'There is no futures contract for your exact grade. What do you do?',
            options:['Do not hedge','Hedge with the closest liquid contract and accept the residual','Wait for one to be listed','Hedge with the currency'],
            answer:1, why:'That is a proxy hedge. It removes most of the risk and leaves the difference between your grade and the benchmark — smaller, and known.' },
          { type:'pairs', prompt:'Match the mismatch to what it leaves behind',
            pairs:[['Different pricing dates','Timing basis'],['Different location','Location basis'],['Different grade','Quality basis']],
            why:'Every hedge is imperfect somewhere. A good trader knows exactly which residual they are holding.' },
          { type:'choice', prompt:'Your cargo is priced in dollars but sold in euros. What else needs hedging?',
            options:['Nothing','The currency','The freight','The insurance'], answer:1,
            why:'Unhedged FX turns a commodity trade into a currency bet. Same principle: hedge what you are not paid to take.' }
        ] }
    ] }

  ,{
    id: 'u5', title: 'Trade finance', subtitle: 'Funding the gap, and getting paid',
    lessons: [
      { id:'u5l1', title:'The working capital gap',
        goal:'Trading is the business of funding time.',
        exercises:[
          { type:'choice', prompt:'Why does a trading house need so much financing?',
            options:['To pay salaries','Because it pays for cargo long before it is paid for it','To buy ships','For the futures exchange only'],
            answer:1, why:'Cargo, freight and insurance are paid up front. Payment arrives after delivery, sometimes 30 days later. Someone must fund that gap.' },
          { type:'numeric', prompt:'You pay the supplier on day 0. Transit is 32 days and payment terms are 30 days after delivery. How many days of funding?',
            answer:62, unit:'days', tolerance:0,
            why:'62 days on the full cargo value. At 7% a year on $5 million that is roughly $60,000 of interest — straight out of your margin.' },
          { type:'choice', prompt:'Which change improves returns the most, all else equal?',
            options:['A slightly better price','Getting paid 20 days earlier','A nicer vessel','A longer QP'],
            answer:1, why:'Cutting funding days lifts return on capital without touching the negotiated margin. Cash cycle beats headline price more often than people expect.' },
          { type:'choice', prompt:'Return on capital depends on…',
            options:['Margin only','Margin and how long capital is tied up','The commodity','The vessel size'],
            answer:1, why:'A 2% margin turned over six times a year beats a 5% margin turned over once. Speed is a strategy.' }
        ] },
      { id:'u5l2', title:'Letters of credit',
        goal:'A bank pays against documents, not against the cargo.',
        exercises:[
          { type:'choice', prompt:'Under a documentary letter of credit, what does the issuing bank pay against?',
            options:['The cargo arriving safely','Documents that comply with the credit terms','The buyer approval','The trader reputation'],
            answer:1, why:'Documents. Not goods, not performance, not fairness. The bank never sees the cargo — it checks paper against the terms it was given.' },
          { type:'choice', prompt:'Your cargo is perfect but one document has the wrong date. What can happen?',
            options:['Nothing, the goods are fine','The bank can refuse to pay on a discrepancy','The bank pays anyway','The buyer must pay cash'],
            answer:1, why:'A discrepant presentation can be rejected even with flawless cargo. Documentation discipline is not bureaucracy — it is getting paid.' },
          { type:'choice', prompt:'What does an LC really replace?',
            options:['Insurance','Buyer risk with bank risk','The bill of lading','The hedge'], answer:1,
            why:'You stop worrying about whether the buyer will pay and start worrying about whether the bank will — usually a much better risk.' },
          { type:'pairs', prompt:'Match each funding route to its main feature',
            pairs:[['Revolving facility','Flexible, uses credit capacity'],['LC-backed finance','Lower equity, payment risk reduced'],['Borrowing base','Secured on cargo and receivables'],['Own balance sheet','No bank, heavy on equity']],
            why:'Each structure trades cost against equity against dependence. Choosing well is part of the trade, not an afterthought.' }
        ] },
      { id:'u5l3', title:'Counterparty credit',
        goal:'The risk that the other side does not perform.',
        exercises:[
          { type:'choice', prompt:'What is counterparty credit exposure?',
            options:['The price falling','What you lose if the other side fails to perform','The cost of the LC','Your bank borrowing'],
            answer:1, why:'Unpaid receivables, lost prepayments, and the cost of replacing the contract at a worse market. A real, sizeable number.' },
          { type:'choice', prompt:'Why do desks set a limit per counterparty?',
            options:['Regulation','Because concentration, not volatility, is what usually kills a desk','To slow traders down','For tax'],
            answer:1, why:'Surviving a bad market is normal. Surviving one large counterparty defaulting is a matter of whether you sized the exposure.' },
          { type:'choice', prompt:'A new buyer wants 30-day terms on a large first cargo. The sensible answer is…',
            options:['Agree — growth matters','Start smaller, or secure the payment','Refuse all business','Ask double the price'],
            answer:1, why:'Credit is earned. Start small, or take an LC or credit insurance. Relationships are built on cargoes that settled cleanly.' },
          { type:'numeric', prompt:'A buyer owes you $1,200,000 and defaults. You resell the cargo at a $180,000 loss. What is the total credit loss?',
            answer:1380000, unit:'$', tolerance:0,
            why:'1,200,000 + 180,000 = $1,380,000. Default costs both the receivable and the replacement — which is why exposure is measured, not guessed.' }
        ] }
    ] }
];
