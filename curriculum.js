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
];
