/* World of Trade — Learn
   A comprehensive physical commodity trading curriculum organised as an in-game
   career path. Each desk covers a professional topic through short exercises.
   The `scene` field selects the visual background for that desk.
   Types: choice · numeric · order · pairs · build
*/
window.CURRICULUM = [

  /* ── Core Trading Path · Part I ─────────────────────────── */
  {
    id: "u1",
    title: "International Economics and Trade",
    subtitle: "Why the flow exists, and what politics does to it",
    scene: "trade",
    lessons: [
      {
        id: "u1l1",
        title: "Two sides and a cargo",
        goal: "A physical trader buys from a producer and sells to a consumer, and owns the goods in between.",
        exercises: [
          { type:"choice",
            prompt:"A physical commodity trader makes money mainly by…",
            options:[
            "Betting on the price going up",
            "Buying a cargo somewhere and selling it somewhere it is worth more",
            "Lending money to mines",
            "Storing goods until they expire"
          ],
            answer:1,
            why:"Physical trading is about moving goods from where they are worth less to where they are worth more — in place, in time, or in form. Price direction is a risk to manage, not the business." },
          { type:"choice",
            prompt:"You buy 500 t of copper from a mine in Chile and sell it to a cable factory in Italy. Between the two, who owns the copper?",
            options:["The mine, until the factory pays","You","The shipping line","Nobody — it is in transit"],
            answer:1,
            why:"That is the whole point. You take ownership, and with it the price risk, the financing cost and the operational risk. That is why you get paid a margin." },
          { type:"pairs",
            prompt:"Match each party to what it wants",
            pairs:[["Producer","A reliable buyer for steady volume"],["Consumer","Material delivered on time, on spec"],["Trader","The margin between the two, net of costs"]],
            why:"A trade exists because the producer and the consumer want different things. The trader bridges the gap and is paid for it." },
          { type:"choice",
            prompt:"Which of these is NOT part of a physical trader’s job?",
            options:["Arranging the freight","Financing the cargo while it moves","Operating the mine","Managing the price risk"],
            answer:2,
            why:"Traders do not produce. They source, finance, move, manage risk and deliver. Owning production is a separate, later choice called vertical integration." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["A trader is paid for","moving goods","from where they are worth less","to where they are worth more"],
            distractors:["for predicting prices","by the exchange"],
            why:"Keep this sentence: it is the whole business in one line. Everything that follows in this path — incoterms, pricing, hedging, finance, documents — is a detail of how that movement is arranged and paid for." }
        ]
      },
      {
        id: "u1l2",
        title: "Where the margin goes",
        goal: "Gross margin is not profit. Freight, finance and operations eat into it.",
        exercises: [
          { type:"choice",
            prompt:"You buy a cargo for $1,000,000 and sell it for $1,050,000. Your profit is…",
            options:["$50,000","Less than $50,000","More than $50,000","Exactly zero"],
            answer:1,
            why:"The $50,000 is gross margin. Freight, insurance, financing interest, inspection and any claims come out of it. What is left is profit." },
          { type:"numeric",
            prompt:"Gross margin $50,000. Freight $18,000, financing $9,000, inspection $4,000. What is the net result?",
            answer:19000,
            unit:"$",
            tolerance:0,
            why:"50,000 − 18,000 − 9,000 − 4,000 = 19,000. A 5% headline margin became under 2% of the cargo value." },
          { type:"order",
            prompt:"Put the costs in the order they normally hit you",
            items:["Pay the supplier","Pay freight and insurance","Accrue financing interest","Get paid by the buyer"],
            why:"You pay first and get paid last. The gap between the two is the working capital you have to fund — the heart of the business." },
          { type:"choice",
            prompt:"A cargo takes 30 days to sail and the buyer pays 30 days after delivery. How long is your money tied up?",
            options:["30 days","About 60 days","Until the price moves","No time — the bank pays"],
            answer:1,
            why:"Roughly 60 days, and every one of them is financed. This is why a shorter voyage with a thinner margin often beats a longer one with a fatter margin." },
          { type:"choice",
            prompt:"Which single number tells you least about whether a trade is good?",
            options:["The working capital days","The gross margin","The freight cost","The return on the capital employed"],
            answer:1,
            why:"Gross margin alone is the most misleading number in physical trading. It is the starting point, not the answer." }
        ]
      },
      {
        id: "u1l3",
        title: "Why the flow exists",
        goal: "A cargo moves only when the delivered cost from a distant origin beats the local alternative.",
        exercises: [
          { type:"choice",
            prompt:"A soybean cargo sails from Brazil to China. The economic reason is…",
            options:[
            "China cannot grow soybeans at all",
            "The delivered cost from Brazil is below the next-best alternative for that buyer",
            "Freight from Brazil is cheap",
            "Brazil runs a trade surplus"
          ],
            answer:1,
            why:"Trade is not driven by who can and cannot produce, but by delivered cost. A buyer compares every origin landed at their plant and takes the cheapest that meets the spec, which is why an origin can lose a market on freight alone." },
          { type:"choice",
            prompt:"Comparative advantage says a country should export the goods…",
            options:[
            "It produces most cheaply in absolute terms",
            "It gives up the least of something else to produce",
            "It has the largest reserves of",
            "Its government chooses to subsidise"
          ],
            answer:1,
            why:"The comparison is against the country’s own alternative uses of land, labour and capital, not against other countries’ costs. It is why a high-cost producer can still be a rational exporter, and why cheap production alone does not create a flow." },
          { type:"numeric",
            prompt:"Soybeans are worth $560/t FOB Santos and $625/t delivered Qingdao. Freight and associated costs are $42/t. What is the arbitrage per tonne?",
            answer:23,
            unit:"$/t",
            tolerance:0,
            why:"Take the destination value, subtract the origin cost and subtract the cost of getting there: 625 − 560 − 42 = 23 $/t. That $23 is what the whole trade is competing for, and it is what freight or duty changes can erase overnight." },
          { type:"order",
            prompt:"Put the life of an arbitrage in order",
            items:[
            "A price gap opens between two markets",
            "Someone checks whether freight, duty and finance fit inside the gap",
            "Cargoes are bought and shipped against it",
            "More sellers follow and the gap narrows",
            "The flow becomes routine and the margin becomes a fee"
          ],
            why:"Arbitrages are self-destroying: the act of exploiting one closes it. That is why mature routes pay thin, predictable margins and why the money in this business is made early in a flow, not late." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["A commodity moves","when the delivered cost from a distant origin","is lower than","the local alternative"],
            distractors:["when freight rates fall","because of a trade agreement"],
            why:"This is the whole of trade economics in one line. Everything a trader does afterwards — freight, finance, hedging, documents — is an attempt to keep that inequality true until the cargo is discharged." }
        ]
      },
      {
        id: "u1l4",
        title: "Tariffs, quotas and export bans",
        goal: "Policy does not change what a commodity is worth. It changes who can reach which market, and at what cost.",
        exercises: [
          { type:"choice",
            prompt:"A 6.5% import duty on a cargo is legally paid by…",
            options:[
            "The exporter, out of the sale price",
            "The importer of record, on the declared customs value",
            "The shipowner, on arrival",
            "Nobody, if the sale is CIF"
          ],
            answer:1,
            why:"Duty is a liability of the importer of record and is assessed on customs value, not on the invoice alone. Who ultimately bears it is a commercial question settled by the incoterm and the price, but the obligation to pay it never moves." },
          { type:"numeric",
            prompt:"Customs value is $600/t and the import duty is 6.5%. What is the duty per tonne?",
            answer:39,
            unit:"$/t",
            tolerance:0,
            why:"Duty of 600 × 6.5% = 39 $/t. On a $600 cargo that is a bigger number than most trading margins, which is why tariff classification is a commercial decision and not a formality left to the broker." },
          { type:"choice",
            prompt:"A producing country bans exports of a commodity. In the short run…",
            options:["The domestic price falls and the world price rises","Both prices rise","The domestic price rises and the world price falls","Neither price moves"],
            answer:0,
            why:"Supply that cannot leave stays home, so it is cheap where it is trapped and scarce everywhere else. Export bans are the fastest way to split one world price into two, and they are why origin diversification is worth paying for." },
          { type:"pairs",
            prompt:"Match each instrument to what it actually does",
            pairs:[["Import tariff","Raises the delivered cost inside the importing country"],["Export quota","Caps the volume allowed to leave the producing country"],["Tariff-rate quota","Lets a set volume in cheaply and taxes the rest heavily"]],
            why:"Each instrument bites at a different point in the chain, so each one needs a different commercial answer: reprice, re-origin, or race for the low-duty allocation before it is used up." },
          { type:"choice",
            prompt:"Why does a trader read the tariff schedule before quoting, not after?",
            options:[
            "Because the classification changes the landed cost and therefore the price you can offer",
            "Because customs requires the quote in advance",
            "Because duty is refundable if declared early",
            "Because tariffs apply only to quoted business"
          ],
            answer:0,
            why:"A cargo quoted on the wrong tariff line is quoted at the wrong price, and the difference comes out of the margin. Classification, origin rules and preferential agreements are part of pricing, not paperwork." }
        ]
      },
      {
        id: "u1l5",
        title: "Currency and the delivered cost",
        goal: "Commodities are priced in dollars, but produced and consumed in other currencies.",
        exercises: [
          { type:"choice",
            prompt:"A Brazilian producer sells in dollars while paying costs in reais. If the real weakens, the producer…",
            options:["Earns more reais per tonne sold","Earns less per tonne","Is unaffected, because the price is in dollars","Must renegotiate the contract"],
            answer:0,
            why:"The same dollar price converts into more local currency, so a weaker producer currency lifts local margins and usually lifts exportable supply with it. This is why currency moves show up in physical flows, not only in accounts." },
          { type:"numeric",
            prompt:"A producer receives $520/t. The rate moves from 5.00 to 5.40 BRL per USD. How much more does the producer receive per tonne in reais?",
            answer:208,
            unit:"BRL/t",
            tolerance:0,
            why:"At 5.40 the tonne is worth 2,808 reais against 2,600 at 5.00, so the gain is 208 BRL/t. Nothing changed in the commodity market: the whole difference is currency, and it is large enough to change planting and selling decisions." },
          { type:"choice",
            prompt:"You buy a cargo in dollars and have already sold it in euros. Your remaining exposure is…",
            options:["Only the commodity price","Only the currency","Both the commodity price and the currency","Neither, the trade is closed"],
            answer:1,
            why:"The commodity leg is matched because both prices are fixed, but the cash legs are in different currencies, so the margin moves with EUR/USD until both settle. Currency is the exposure traders most often forget to book." },
          { type:"order",
            prompt:"Build a landed cost from origin to plant, in order",
            items:["FOB price at the load port","Ocean freight","Marine insurance","Import duty","Inland haulage to the plant"],
            why:"Every step is a separate price in a separate market, and several are in a different currency from the sale. A landed cost is therefore an assembly of exposures, not a single number." },
          { type:"choice",
            prompt:"Why is a dollar-denominated commodity still a currency trade for most of the chain?",
            options:[
            "Because costs, taxes and end demand sit in local currencies on both sides of the dollar price",
            "Because exchanges quote in several currencies",
            "Because dollars are volatile",
            "Because banks charge for conversion"
          ],
            answer:0,
            why:"The dollar is the accounting language, not the economics. Producers pay wages and diesel locally, buyers sell finished goods locally, and the exchange rate decides how the dollar price feels at both ends." }
        ]
      },
      {
        id: "u1l6",
        title: "The commodity cycle",
        goal: "Supply takes years to respond to price, and that lag is the cycle.",
        exercises: [
          { type:"choice",
            prompt:"Why does high price not fix a shortage quickly?",
            options:[
            "Because demand is fixed",
            "Because new mines, fields and plantations take years to build",
            "Because producers collude",
            "Because inventories are always empty"
          ],
            answer:1,
            why:"Capital projects in commodities have lead times measured in years, so the supply that a high price calls forth arrives long after the price signal. The delay is what turns a shortage into a boom and a boom into a glut." },
          { type:"order",
            prompt:"Put one turn of the cycle in order",
            items:[
            "Demand outgrows supply and inventories fall",
            "Prices rise and the curve moves into backwardation",
            "Producers commit capital to new capacity",
            "New supply arrives and inventories rebuild",
            "Prices fall below the cost of the marginal producer"
          ],
            why:"Each phase is caused by the previous one, which is why the cycle repeats rather than settling. Knowing which phase you are in tells you whether to be long inventory or long flexibility." },
          { type:"numeric",
            prompt:"Demand is 2,400 kt and grows 1% a year. A new mine adds 90 kt of annual supply. How large is the resulting annual surplus, in kt?",
            answer:66,
            unit:"kt",
            tolerance:0,
            why:"Demand growth absorbs 2,400 × 1% = 24 kt, so 90 − 24 leaves a surplus of 66 kt. A single project can therefore oversupply a market for several years, which is why announcements matter more than production." },
          { type:"pairs",
            prompt:"Match the market state to the signal you would see",
            pairs:[["Tight market","Low visible stocks and a backwardated curve"],["Balanced market","Stocks near normal and a flat curve"],["Oversupplied market","Rising stocks and a contango wide enough to pay storage"]],
            why:"The curve and the inventory level are the two things the market cannot fake for long. Reading them together tells you which phase you are in more reliably than any forecast of the price itself." },
          { type:"choice",
            prompt:"What ends a downcycle, in practice?",
            options:["Demand suddenly doubling","Supply leaving the market as prices fall below cash costs","Governments buying the surplus","A change in the benchmark"],
            answer:1,
            why:"Prices below cash cost force the highest-cost tonnes to stop, and that closure — not a demand miracle — is what rebalances the market. It is slow, painful and the reason cost curves are studied so closely." }
        ]
      }
    ]
  },
  {
    id: "u2",
    title: "Quantitative Methods",
    subtitle: "Measuring the exposure before defending it",
    scene: "quant",
    lessons: [
      {
        id: "u2l1",
        title: "Returns, volatility and the distribution",
        goal: "Volatility is a measurement, not an opinion, and it scales with the square root of time.",
        exercises: [
          { type:"choice",
            prompt:"Volatility of a price series measures…",
            options:["The direction of the price","The dispersion of its returns around the average","The highest price reached","The volume traded"],
            answer:1,
            why:"Volatility says how widely returns scatter, and says nothing at all about which way they scatter. A market can be extremely volatile and go nowhere, which is exactly the environment that kills a badly funded hedge." },
          { type:"numeric",
            prompt:"Daily returns have a standard deviation of 1.5%. Using 252 trading days, what is the annualised volatility?",
            answer:23.81,
            unit:"%",
            tolerance:0.5,
            why:"Volatility scales with the square root of time: 1.5 × √252 ≈ 23.8%. The square root, not the number of days, is why a market that moves 1.5% a day is not a market that moves 378% a year." },
          { type:"choice",
            prompt:"Assuming roughly normal returns, about how often should a two-standard-deviation day occur?",
            options:["About one day in twenty","About one day in three","About one day in five hundred","Never"],
            answer:0,
            why:"Roughly 95% of a normal distribution sits inside two standard deviations, so about one day in twenty falls outside it. If your book cannot survive a monthly event, it is not a tail risk you are carrying but a routine one." },
          { type:"choice",
            prompt:"Commodity returns have fat tails. The practical consequence is…",
            options:[
            "Volatility cannot be measured",
            "Extreme moves happen far more often than a normal distribution predicts",
            "Averages are meaningless",
            "Hedging is pointless"
          ],
            answer:1,
            why:"Supply shocks, freight dislocations and squeezes produce moves that a bell curve treats as impossible. Any risk number built on normality — including a naive VaR — therefore understates precisely the day you need it for." },
          { type:"numeric",
            prompt:"A price series has 40 observations with a mean daily move of 0% and a standard deviation of 2%. How many observations would you expect beyond ±2 standard deviations under normality?",
            answer:2,
            unit:"days",
            tolerance:0,
            why:"About 5% of observations fall outside two standard deviations, and 40 × 5% = 2 days. Counting how many you actually observe is the cheapest test of whether normality is a safe assumption for that market." }
        ]
      },
      {
        id: "u2l2",
        title: "Correlation, regression and the hedge ratio",
        goal: "A hedge ratio is a regression coefficient, and it decays the moment the relationship changes.",
        exercises: [
          { type:"choice",
            prompt:"A correlation of 0.8 between your physical price and a futures contract means…",
            options:[
            "They move together 80% of the time",
            "80% of your exposure is hedged automatically",
            "Their returns move together strongly but not identically",
            "The futures price is 80% of the physical"
          ],
            answer:2,
            why:"Correlation measures how tightly two return series move together, on a scale from −1 to +1. It is not a percentage of days and not a percentage of exposure covered, and confusing it with either is how a desk believes it is hedged when it is not." },
          { type:"numeric",
            prompt:"A regression of your physical price on the futures gives a slope of 0.85. You hold 20,000 t of physical. How many tonnes should you hedge?",
            answer:17000,
            unit:"t",
            tolerance:0,
            why:"The minimum-variance hedge is exposure times the slope: 20,000 × 0.85 = 17,000 t. Hedging the full 20,000 would over-hedge a physical that historically moves less than the futures, turning a hedge into a new position." },
          { type:"choice",
            prompt:"The R² of that regression tells you…",
            options:[
            "How much of the physical price variation the futures explains",
            "Whether the hedge is profitable",
            "The size of the basis",
            "The correct number of lots"
          ],
            answer:0,
            why:"R² is the share of variance explained, so a low R² means most of what moves your cargo is not in the hedge instrument at all. That unexplained part is basis risk, and it does not disappear because the hedge ratio was calculated precisely." },
          { type:"pairs",
            prompt:"Match each statistic to the question it answers",
            pairs:[["Correlation","Do these two prices move together?"],["Regression slope","How many tonnes of futures per tonne of physical?"],["R²","How much of my price risk does this instrument explain?"]],
            why:"Three numbers, three different jobs. Most hedging arguments on a desk are really disagreements about which of these three questions is being asked." },
          { type:"choice",
            prompt:"Why is a hedge ratio estimated on two calm years dangerous?",
            options:[
            "Because the sample is too small",
            "Because relationships that hold in calm markets often break in the stressed ones you are hedging against",
            "Because regressions cannot use old data",
            "Because volatility is unmeasurable"
          ],
            answer:1,
            why:"Correlations tend towards one in a crisis for financial assets and towards chaos for physical basis, so the parameter you fitted is estimated on exactly the days that do not matter. Estimating over a period that includes a dislocation is the minimum defence." }
        ]
      },
      {
        id: "u2l3",
        title: "The net position",
        goal: "Your exposure is the physical book and the paper book added together, not either one alone.",
        exercises: [
          { type:"choice",
            prompt:"You own 40,000 t of physical cargo and are short 30,000 t of futures. Your flat price position is…",
            options:["Long 70,000 t","Long 10,000 t","Flat","Short 30,000 t"],
            answer:1,
            why:"Physical long minus paper short: 40,000 − 30,000 = 10,000 t long. Only the net moves with the outright price. This is the single number a risk manager asks for first." },
          { type:"numeric",
            prompt:"You are long 25,000 t physical and short 25,000 t futures. The flat price falls $30/t. What is the net flat price loss?",
            answer:0,
            unit:"$",
            tolerance:0,
            why:"The net flat-price loss is 0. The cargo loses $750,000 and the short futures gain $750,000, so the two cancel. What you still carry is basis, freight, quality and credit — the hedge removed one risk, not all of them." },
          { type:"choice",
            prompt:"So what does a fully hedged book still leave you exposed to?",
            options:["Nothing at all","Basis, timing, quality, freight and counterparty risk","Only inflation","Only interest rates"],
            answer:1,
            why:"Flat price is the easy risk to remove and the least interesting to a physical desk. The money — and the damage — sits in everything the futures contract does not describe." },
          { type:"pairs",
            prompt:"Match each risk to what causes it",
            pairs:[["Flat price risk","An unhedged outright position"],["Basis risk","The hedge and the cargo not moving together"],["Liquidity risk","Cash out today against value later"],["Credit risk","A counterparty not performing"]],
            why:"Four different risks, four different controls. Conflating them is how a desk convinces itself it is safe." }
        ]
      },
      {
        id: "u2l4",
        title: "Concentration and limits",
        goal: "The same total exposure is far more dangerous when it sits in one place.",
        exercises: [
          { type:"choice",
            prompt:"Two desks each carry $50m of exposure. Desk A is spread over ten buyers, desk B is all with one. Which is riskier?",
            options:["They are identical","Desk A","Desk B","Neither carries risk"],
            answer:2,
            why:"Same number, different survival odds. One default wipes out desk B and costs desk A a tenth of the book. Total exposure without concentration tells you almost nothing." },
          { type:"choice",
            prompt:"Position limits are normally set by…",
            options:["The trader who runs the book","Risk management, independently of the desk","The exchange only","The customer"],
            answer:1,
            why:"A limit that the risk-taker can raise is not a limit. Independence is the whole control — the person who benefits from the position does not get to size it." },
          { type:"choice",
            prompt:"Which of these is a concentration you might miss?",
            options:["Ten cargoes, ten buyers, ten grades","Ten cargoes from ten buyers all loading at the same port","Ten unrelated hedges","Ten separate credit lines"],
            answer:1,
            why:"Different counterparties, one chokepoint. A strike, a storm or a sanction at that port hits all ten at once. Concentration hides in geography, grade, credit and financing, not only in names." },
          { type:"numeric",
            prompt:"Your limit is 60,000 t net long. You are long 90,000 t physical and short 20,000 t futures. How many tonnes must you still hedge to get inside the limit?",
            answer:10000,
            unit:"t",
            tolerance:0,
            why:"Net is 90,000 − 20,000 = 70,000 t long, which is 10,000 t over the 60,000 t limit. Selling 10,000 t of futures brings you to the line. Limits are checked on net, which is why the answer is not 30,000." }
        ]
      },
      {
        id: "u2l5",
        title: "VaR and stress tests",
        goal: "One number tells you about normal days. Another tells you about the day that matters.",
        exercises: [
          { type:"choice",
            prompt:"Your 95% one-day VaR is $2m. What does that mean?",
            options:[
            "You cannot lose more than $2m",
            "On about one day in twenty you would expect to lose more than $2m",
            "You will lose $2m tomorrow",
            "Your maximum loss is $2m per year"
          ],
            answer:1,
            why:"VaR is a threshold, not a ceiling. It says nothing about how bad the bad day is — and the bad day is what closes desks. Treating VaR as a worst case is the most common misreading of it." },
          { type:"numeric",
            prompt:"You are long 50,000 t. Daily price volatility is $6/t. Using a 95% factor of 1.645, what is the one-day VaR?",
            answer:493500,
            unit:"$",
            tolerance:500,
            why:"50,000 × 6 × 1.645 = $493,500. Notice the whole result rests on that volatility estimate — feed it a calm month and the number flatters you." },
          { type:"choice",
            prompt:"What is a stress test for, given you already have VaR?",
            options:["To replace VaR","To ask what a specific severe scenario would cost, without assigning it a probability","To reduce margin","To value the cargo"],
            answer:1,
            why:"VaR is statistical and backward-looking. A stress test is a question: what if the strait closes, the spread inverts, the buyer defaults on the same day? No probability, just the size of the hole." },
          { type:"choice",
            prompt:"Which risk does VaR handle worst?",
            options:["Ordinary daily price moves","A market where you suddenly cannot exit at any price","Interest on working capital","Freight cost"],
            answer:1,
            why:"VaR assumes you can liquidate. In a real crisis the exit closes, correlations that held for years break together, and the position you modelled as marketable becomes something you simply own." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["VaR","measures","normal","days","stress","tests","measure","bad","ones"],
            distractors:["profit","freight","always"],
            why:"You need both. A desk that reports only VaR is describing the weather and ignoring the storm." }
        ]
      },
      {
        id: "u2l6",
        title: "How a desk actually dies",
        goal: "Almost never from being wrong on price — usually from cash, concentration, or a document.",
        exercises: [
          { type:"choice",
            prompt:"A desk is perfectly hedged on flat price, heavily concentrated with one buyer, and running thin cash. What kills it first?",
            options:["A price move","That buyer defaulting","A change in freight rates","Nothing — it is hedged"],
            answer:1,
            why:"The hedge protects against the risk it was built for and nothing else. Concentration plus thin liquidity means one default becomes a funding failure, and a funding failure is terminal regardless of the position." },
          { type:"choice",
            prompt:"In 1993 an oil subsidiary of a large German group sold long-dated fixed-price supply commitments and hedged them by buying short-dated futures it rolled forward. Prices fell, the market shifted into contango, and it lost over a billion dollars. What was the actual failure?",
            options:[
            "It had no hedge",
            "The hedge was sound but the rolling cost and margin calls could not be funded",
            "The cargoes were never delivered",
            "It mispriced the product"
          ],
            answer:1,
            why:"This is the Metallgesellschaft case, taught because the position was arguably defensible while the funding was not. The price fall triggered margin calls on the long futures, and the shift into contango made every monthly roll cost money — both in cash, while the offsetting gain on the customer contracts was years away. Whether the hedge was sound is still argued; that it was unfundable is not." },
          { type:"order",
            prompt:"Order the sequence that turns a market move into a failure",
            items:[
            "The market moves against the paper leg",
            "Variation margin is called in cash",
            "Credit lines are drawn to pay it",
            "Lenders reduce or pull the lines",
            "Positions are liquidated at the worst possible moment"
          ],
            why:"Every step is about cash, not price. By the time you reach liquidation the original view may still be right — and it no longer matters." },
          { type:"pairs",
            prompt:"Match each control to the failure it is meant to prevent",
            pairs:[["Position limits","A single view becoming fatal"],["Counterparty limits","One default taking the book"],["Liquidity buffer","Being right but unable to pay margin"],["Document checks","A perfect cargo that cannot be paid for"]],
            why:"None of these makes money. All of them are the reason the desk is still there next year to make some." },
          { type:"choice",
            prompt:"Since 2020 the largest losses in physical trading have come less from price than from…",
            options:[
            "Fraud and sanctions exposure — cargoes that were not there, and counterparties you should not have faced",
            "Freight volatility",
            "Weak hedging models",
            "Slow port operations"
          ],
            answer:0,
            why:"Hidden losses and forged documents took down a major Asian oil trader in 2020, and containers documented as nickel turned out to hold rubble in 2023. Neither was a market call. A desk that only measures price risk is measuring the wrong thing." },
          { type:"choice",
            prompt:"What is the honest summary of this whole topic?",
            options:[
            "Predict prices better than others",
            "Understand the mechanics well enough that the surprises are priced, funded and documented",
            "Always hedge everything",
            "Avoid physical cargo"
          ],
            answer:1,
            why:"Physical trading rewards operational competence more than forecasting. The margin is small, the moving parts are many, and the trader who knows where the money leaks keeps more of it." }
        ]
      }
    ]
  },
  {
    id: "u3",
    title: "Financial Statements Analysis",
    subtitle: "Reading the accounts, and where the margin is booked",
    scene: "accounts",
    lessons: [
      {
        id: "u3l1",
        title: "The three statements of a trading house",
        goal: "Revenue tells you almost nothing about a trader. The balance sheet and the cash flow tell you nearly everything.",
        exercises: [
          { type:"pairs",
            prompt:"Match each statement to the question it answers",
            pairs:[["Income statement","Did we make a margin over the period?"],["Balance sheet","What do we own and owe on one particular day?"],["Cash flow statement","Where did the money actually go?"]],
            why:"A trading house can show a profit while running out of cash, because margin is earned on paper long before the receivable is collected. Reading the three together is the only way to see that gap." },
          { type:"numeric",
            prompt:"A trading house reports revenue of $92,000m and cost of goods sold of $90,160m. What is the gross margin as a percentage of revenue?",
            answer:2,
            unit:"%",
            tolerance:0.05,
            why:"The margin is 1,840 on 92,000, which is 2% of revenue. Trading houses run single-digit percentage margins on enormous turnover, so revenue growth on its own says nothing about whether the business got better." },
          { type:"choice",
            prompt:"Why is revenue a poor measure of the size of a trading business?",
            options:[
            "Because it is reported inconsistently",
            "Because it reflects commodity prices and volumes, not the value the desk adds",
            "Because it excludes hedging",
            "Because it is always audited last"
          ],
            answer:1,
            why:"Double the oil price and revenue doubles with no change in skill, volume or profit. Gross margin, tonnes handled and return on capital employed describe the business; revenue mostly describes the market." },
          { type:"choice",
            prompt:"On a trader’s balance sheet, the largest assets are usually…",
            options:["Property and vessels","Inventories and trade receivables","Goodwill","Cash"],
            answer:1,
            why:"A trading house is mostly working capital: goods in transit and money owed by buyers. That is why its accounts move with prices and why its lenders look at what those assets are worth today, not at last year’s profit." },
          { type:"choice",
            prompt:"A house reports a large accounting loss on inventory and an offsetting gain on derivatives. What has most likely happened?",
            options:["A hedged position is being shown one leg at a time","The hedge failed","Revenue was overstated","The auditors made an adjustment"],
            answer:0,
            why:"Physical and paper legs are often recognised in different places and sometimes in different periods, so a hedged book can look violent line by line and calm in total. Reading only one line is how people misdiagnose a trading result." }
        ]
      },
      {
        id: "u3l2",
        title: "Inventory and mark-to-market",
        goal: "A trader’s stock is revalued constantly, and that revaluation lands in the accounts before the cargo is sold.",
        exercises: [
          { type:"choice",
            prompt:"Commodity inventory held by a trader is typically carried at…",
            options:["Historic cost only","Fair value, revalued as prices move","The contract price of the eventual sale","Whatever the bank agrees"],
            answer:1,
            why:"Because the inventory is held for trading rather than for use, it is marked to market and the movement runs through the result. It is why a trader’s profit can move on a day when nothing was bought or sold." },
          { type:"numeric",
            prompt:"You hold 60,000 t bought at $500/t. The market is now $470/t. What is the write-down on the position, in dollars?",
            answer:1800000,
            unit:"$",
            tolerance:0,
            why:"The loss is 30 × 60,000 = $1,800,000 and it appears in the accounts immediately, whether or not the cargo has moved. If the position is hedged, an offsetting gain should sit on the derivative line." },
          { type:"choice",
            prompt:"Why does mark-to-market accounting make a hedged trader look volatile?",
            options:[
            "Because hedges are not recognised",
            "Because physical and paper legs can be recognised at different times or in different lines",
            "Because auditors revalue only losses",
            "Because inventory is valued yearly"
          ],
            answer:1,
            why:"Timing and presentation differences split one economic position into two accounting halves. The economics are flat, the reported numbers are not, and explaining that gap is a large part of a trading house’s investor relations." },
          { type:"choice",
            prompt:"\"Readily marketable inventory\" matters to a lender because…",
            options:[
            "It can be sold or hedged quickly, so debt funding it is treated differently",
            "It is exempt from duty",
            "It cannot be written down",
            "It is always insured"
          ],
            answer:0,
            why:"Debt funding liquid, hedged stock is closer to a secured advance than to structural borrowing, so analysts strip it out before judging leverage. The distinction is the single most important adjustment in a trader’s accounts." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["A trader’s reported profit moves","when prices move","because the inventory is revalued","before it is sold"],
            distractors:["only when a cargo is delivered","because auditors adjust it"],
            why:"This one mechanism explains most of the surprises in a trading house’s quarterly numbers, and it is the reason cash flow is read before profit." }
        ]
      },
      {
        id: "u3l3",
        title: "Adjusted debt, leverage and covenants",
        goal: "Not all of a trader’s debt is leverage. Separating the two is how the business is actually judged.",
        exercises: [
          { type:"choice",
            prompt:"Analysts adjust a trading house’s debt by…",
            options:[
            "Adding expected future borrowings",
            "Deducting debt that funds readily marketable, hedged inventory",
            "Ignoring short-term facilities",
            "Adding lease liabilities twice"
          ],
            answer:1,
            why:"Borrowing that is matched by liquid, hedged stock is self-liquidating: the goods sell and the debt repays. Leaving it in the leverage ratio would make every well-financed trader look reckless." },
          { type:"numeric",
            prompt:"Total debt is $9,000m, of which $6,500m funds readily marketable inventories. What is adjusted debt, in $m?",
            answer:2500,
            unit:"$m",
            tolerance:0,
            why:"Adjusted debt is 9,000 − 6,500 = 2,500. The headline debt figure and the number the rating agencies care about differ by a factor of more than three, which is why the unadjusted figure is nearly meaningless here." },
          { type:"numeric",
            prompt:"Adjusted debt is $2,500m and equity is $5,000m. What is adjusted debt to equity, as a multiple?",
            answer:0.5,
            unit:"×",
            tolerance:0.01,
            why:"2,500 divided by 5,000 gives 0.5×. Traders target conservative adjusted leverage precisely because their gross balance sheet is enormous and their access to short-term bank lines is the thing they cannot afford to lose." },
          { type:"choice",
            prompt:"The practical danger of breaching a financial covenant is…",
            options:[
            "A fine from the regulator",
            "Facilities can be withdrawn, and a trader without credit lines cannot trade",
            "The auditors resign",
            "Inventory must be sold at cost"
          ],
            answer:1,
            why:"Trading is funded day to day by bank lines, so losing them stops the business regardless of how profitable it was. Covenant headroom is therefore managed as an operating constraint, not as a financing detail." },
          { type:"pairs",
            prompt:"Match each ratio to what it is testing",
            pairs:[["Adjusted debt to equity","How much structural leverage sits behind the trading book"],["Current ratio","Whether short-term assets cover short-term obligations"],["Return on capital employed","Whether the margin justifies the capital tied up"]],
            why:"Each ratio answers a different lender or shareholder question, and a trading house can pass one while failing another. Reading them as a set is what stops a single flattering number from carrying the argument." }
        ]
      },
      {
        id: "u3l4",
        title: "Why houses sit where they sit",
        goal: "A trading house is a chain of entities. Which one signs the contract decides where the profit lands.",
        exercises: [
          { type:"choice",
            prompt:"Why does a physical trading group typically use more than one company?",
            options:[
            "Different activities carry different risk, funding and tax treatment, so they sit in separate entities",
            "To make itself harder for counterparties to follow",
            "Because regulators require one company per commodity",
            "To avoid having to keep consolidated accounts"
          ],
            answer:0,
            why:"A trading entity, a shipping entity and an asset-holding entity have different balance sheets, different lenders and different risk profiles. Separating them lets each be financed and insured on its own terms — and it is also what turns \"where is this margin booked\" into a real question." },
          { type:"pairs",
            prompt:"Match each entity to what it does",
            pairs:[["Trading entity","Signs the purchase and the sale, and carries the price risk"],["Shipping entity","Owns or charters the vessels and earns the freight"],["Asset entity","Holds terminals, tanks or stakes in production"]],
            why:"Three different businesses under one roof. A single cargo can generate income in all three, and the split between them is not arbitrary: it has to reflect what each one actually did." },
          { type:"choice",
            prompt:"Geneva, Singapore and Dubai host large trading operations mainly because…",
            options:[
            "They combine access to banks, shipping and experienced people with a predictable tax regime",
            "Their own consumption of commodities is the largest",
            "They are the ports closest to production",
            "Trading is restricted almost everywhere else"
          ],
            answer:0,
            why:"Tax is one reason among several and rarely the first. Trade finance banks, ship brokers, inspectors, lawyers and people who have done the job before cluster in the same few cities, and that concentration is worth more to a business built on execution than a few points of tax rate." },
          { type:"choice",
            prompt:"Singapore’s Global Trader Programme offers concessionary rates on qualifying trading income against a headline rate of 17%. What does it require in return?",
            options:[
            "Real activity in Singapore: people, business spending and qualifying transactions genuinely booked there",
            "Only a registered address and a local director",
            "A minimum number of vessels on the register",
            "An exclusive banking relationship with a local bank"
          ],
            answer:0,
            why:"Incentives of this kind are bought with substance. Headcount, spending and real decision-making have to sit in the jurisdiction, which is why these structures come with staffed trading floors rather than a nameplate on a door." },
          { type:"choice",
            prompt:"What is the practical consequence of all this for a junior trader?",
            options:[
            "The entity a trade is booked in is a commercial decision with consequences, not a formality",
            "Nothing — booking is purely an accounting matter",
            "You pick the entity that flatters your own book",
            "Every trade is booked centrally by law"
          ],
            answer:0,
            why:"Booking into the wrong entity misstates where risk and profit sit and creates work for a great many people downstream. It is one of the things a new trader is expected to get right early, precisely because it looks like paperwork and is not." }
        ]
      },
      {
        id: "u3l5",
        title: "Transfer pricing",
        goal: "When two companies in the same group trade with each other, the price must be the one unrelated parties would have agreed.",
        exercises: [
          { type:"choice",
            prompt:"What is the arm’s length principle?",
            options:[
            "Related companies must price transactions between them as independent parties would have done",
            "Group companies may set whatever internal price they find convenient",
            "Transactions inside a group are outside the tax net",
            "Internal prices must be set at cost"
          ],
            answer:0,
            why:"It is the foundation of the whole subject. Without it a group could move profit anywhere simply by choosing an internal number, so tax authorities test that number against what the market would have produced." },
          { type:"choice",
            prompt:"For a commodity sold between group companies, which method does the OECD generally favour?",
            options:[
            "The comparable uncontrolled price method, anchored to a quoted price",
            "A formulary share of the group’s total profit",
            "Cost plus a fixed percentage margin",
            "Whichever method the local tax office proposes"
          ],
            answer:0,
            why:"Commodities have observable quotations, so a comparable price usually exists — which is why the method works here and often fails for something like a brand. The argument then shifts from \"what price\" to \"which quotation, on what date, with what adjustments\"." },
          { type:"choice",
            prompt:"Under the sixth method used in several Latin American countries, what is the presumed pricing date for a commodity export?",
            options:[
            "The shipment date, unless the taxpayer holds contemporaneous registered evidence of an earlier agreed fixing",
            "The date the invoice is issued",
            "The date payment is received",
            "The last day of the tax year"
          ],
            answer:0,
            why:"The presumption exists because a group could otherwise choose, after the event, whichever date suited it. This is where the quotational period stops being a commercial detail and becomes a documentary obligation: register the fix when you make it, or the authority will price the cargo on the day it sailed." },
          { type:"numeric",
            prompt:"A cargo of 25,000 t is sold to a group affiliate at $605/t while the quoted market on the pricing date is $628/t. How much margin has been shifted out of the selling company?",
            answer:575000,
            unit:"$",
            tolerance:0,
            why:"628 − 605 = 23 per tonne understated, so 25,000 × 23 = 575,000 of margin lands in the affiliate rather than in the seller. Whether or not anyone intended it, that is exactly the adjustment a tax authority computes." },
          { type:"choice",
            prompt:"Why does the documentation matter as much as the price itself?",
            options:[
            "The burden of proof normally sits with the taxpayer, so a decision that was not recorded is treated as if it never happened",
            "It does not — only the final price is tested",
            "Documentation is required only of audited companies",
            "The signed contract is always sufficient on its own"
          ],
            answer:0,
            why:"The working rule across this area is that if it was not written down at the time, it did not happen. A commercially sound reason for a price, produced two years later in a meeting room, carries very little weight." }
        ]
      },
      {
        id: "u3l6",
        title: "Substance and presence",
        goal: "A company is taxed where it really operates, not where its letterhead says it sits.",
        exercises: [
          { type:"choice",
            prompt:"What is a permanent establishment?",
            options:[
            "A taxable presence created in a country by a fixed place of business, or by an agent who habitually concludes contracts there",
            "Any office with more than ten employees",
            "A formally registered branch",
            "A warehouse of any kind"
          ],
            answer:0,
            why:"The concept exists to stop a business trading substantially inside a country while being taxed entirely somewhere else. What triggers it is activity and authority, so a person who habitually closes deals can create one without anybody intending to." },
          { type:"choice",
            prompt:"A trader employed in Geneva spends most of the year working from a group office abroad, negotiating and closing there. What is the risk?",
            options:[
            "That the activity creates a taxable presence in that country for the Geneva company",
            "None, because the contracts are signed in Geneva",
            "Only a payroll and social security issue",
            "That the trades themselves become unenforceable"
          ],
            answer:0,
            why:"Where a contract is signed matters far less than where the work was done. This is a live problem for travelling traders and for remote working, and it is managed by tracking days and decision-making rather than by the address printed on the contract." },
          { type:"choice",
            prompt:"What does \"substance\" mean in this context?",
            options:[
            "People, premises, decision-making and risk genuinely located where the profit is booked",
            "The volume of goods the entity trades",
            "The size of the balance sheet",
            "The reputation of the group behind it"
          ],
            answer:0,
            why:"Substance is what turns a structure from a description into a fact. An entity booking a large margin with two administrators and no traders is the classic pattern authorities look for, which is why real trading offices are expensive and properly staffed." },
          { type:"choice",
            prompt:"A group books freight profit in a shipping company that owns no vessels, employs nobody and bears no risk. What is the likely challenge?",
            options:[
            "That the profit belongs where the vessels, the people and the risk actually are",
            "That the internal freight rate was too high",
            "That the vessels were inadequately insured",
            "None — freight income is exempt everywhere"
          ],
            answer:0,
            why:"The question asked is functional: who did what, who decided what, and who bore the risk. An entity that did none of the three has a weak claim on the income, whatever the intra-group contracts say." },
          { type:"order",
            prompt:"Put the questions a tax authority asks in order",
            items:[
            "What functions did each company actually perform?",
            "Which assets did each company use?",
            "Which risks did each company genuinely bear?",
            "Given all that, what would independent parties have paid?",
            "Does the booked result match that price?"
          ],
            why:"Functions, assets, risks — and only then price. The order matters: the price is the conclusion of the analysis rather than its starting point, and a defence that opens with the price tends to lose." }
        ]
      },
      {
        id: "u3l7",
        title: "The global minimum tax",
        goal: "A 15% floor changes what a low rate is worth, and therefore what a structure is for.",
        exercises: [
          { type:"choice",
            prompt:"What does the OECD Pillar Two global minimum tax do?",
            options:[
            "It sets a minimum effective rate of 15% for large groups, with a top-up collected where the rate falls short",
            "It raises every country’s corporate tax rate to 15%",
            "It abolishes tax incentives outright",
            "It applies to companies of every size"
          ],
            answer:0,
            why:"The mechanism is the point: it does not stop a country offering a low rate, it collects the difference somewhere else. So the benefit of being taxed below 15% is no longer kept by the group — it is simply paid to a different treasury." },
          { type:"choice",
            prompt:"Which groups fall within the rules?",
            options:[
            "Those with annual consolidated revenue of at least €750 million",
            "Any company with a foreign subsidiary",
            "Listed companies only",
            "Banks and insurers only"
          ],
            answer:0,
            why:"The threshold puts virtually every significant trading house inside the rules while leaving smaller independents outside. It is also why the same structure can be sensible for one firm and pointless for another." },
          { type:"numeric",
            prompt:"A group entity reports $40,000,000 of qualifying profit taxed at an effective rate of 9%. What top-up is needed to reach the 15% floor?",
            answer:2400000,
            unit:"$",
            tolerance:0,
            why:"The shortfall is six percentage points, and 6% of 40,000,000 is 2,400,000. The arithmetic is trivial; the consequence is not, because it converts what used to be a tax advantage into a transfer between two governments." },
          { type:"choice",
            prompt:"Switzerland introduced a qualified domestic minimum top-up tax from 2024. Why would a country do that?",
            options:[
            "So the shortfall is collected at home rather than by another jurisdiction",
            "To lift its headline rate above 15%",
            "To exempt locally headquartered groups",
            "Because the OECD can compel it to"
          ],
            answer:0,
            why:"If the difference is going to be collected by someone, a country would rather collect it itself. That is why domestic top-up taxes appeared so quickly, and it is the clearest sign that competition between jurisdictions has moved away from the headline rate." },
          { type:"choice",
            prompt:"Singapore added a 15% tier to incentives that previously offered 5% or 10%. What does that tell you?",
            options:[
            "Below the floor most of the benefit is recovered anyway, so a rate at the floor is worth more than one beneath it",
            "That the incentives have been withdrawn",
            "That the headline rate has risen",
            "That trading companies are no longer welcome"
          ],
            answer:0,
            why:"It is the logic of Pillar Two showing up directly in policy. Once a top-up recovers the difference, a 5% rate delivers little that a 15% rate does not, so competition shifts to grants, credits and the quality of the place as somewhere to do business." }
        ]
      },
      {
        id: "u3l8",
        title: "The tax that stops cargoes",
        goal: "The tax that most often disrupts a physical trade is not the one on profit.",
        exercises: [
          { type:"choice",
            prompt:"Why does indirect tax cause more day-to-day trouble than corporate tax?",
            options:[
            "It attaches to individual movements of goods, so an error stops a cargo or blocks a refund",
            "Because the rates are higher",
            "Because it applies only to imports",
            "Because it falls due all at once"
          ],
            answer:0,
            why:"Corporate tax is settled once a year by people whose job that is. VAT, duty and excise attach to every movement in real time, and a mistake shows up as goods that will not clear or cash that will not come back." },
          { type:"choice",
            prompt:"Goods are moved between two warehouses in different countries with no sale involved. What is the risk?",
            options:[
            "A movement alone can create a registration or reporting obligation, even without a sale",
            "None — with no sale there is nothing to report",
            "Only the insurance position changes",
            "Duties apply only to finished goods"
          ],
            answer:0,
            why:"Tax follows the goods as well as the invoice. Traders who think in contracts get caught here, because the obligation is triggered by the physical movement and by where the cargo comes to rest." },
          { type:"numeric",
            prompt:"You pay $340,000 of recoverable VAT on a purchase and recover it 90 days later. At a funding cost of 8% a year, what has the delay cost?",
            answer:6707,
            unit:"$",
            tolerance:20,
            why:"340,000 at 8% for 90 days works out at roughly 6,707 of financing. Recoverable does not mean free: every day between paying it and getting it back is funded exactly like any other working capital." },
          { type:"choice",
            prompt:"What is the commercial lesson of a slow VAT refund?",
            options:[
            "It is working capital tied up, so it belongs in the return calculation for the trade",
            "It is an accounting entry with no cash effect",
            "It reduces the margin permanently",
            "It is the buyer’s problem, not yours"
          ],
            answer:0,
            why:"A refund that takes a year in a difficult jurisdiction is a year of financing nobody priced. On thin margins that alone can decide whether a route is worth trading at all." },
          { type:"choice",
            prompt:"Before entering a new market, which indirect tax question comes first?",
            options:[
            "Where will the goods physically be, and what does that trigger?",
            "What is the corporate tax rate?",
            "Which bank will we use locally?",
            "Who audits the local accounts?"
          ],
            answer:0,
            why:"Follow the goods. Almost every indirect tax obligation in a physical trade flows from where the cargo is and where it moves, and that is a question operations can answer before a tax adviser is even called." }
        ]
      },
      {
        id: "u3l9",
        title: "Reading a structure",
        goal: "You do not need to design the structure. You need to know what it implies for your trade.",
        exercises: [
          { type:"pairs",
            prompt:"Match each idea to what it means",
            pairs:[["Arm’s length principle","Internal prices must match what the market would produce"],["Permanent establishment","Activity in a country can create a taxable presence there"],["Global minimum tax","A rate below 15% is topped up somewhere else"]],
            why:"Three ideas that between them explain most of what a structure is doing. Nearly everything else is detail that belongs to specialists." },
          { type:"choice",
            prompt:"You are asked to book a trade in an entity that had nothing to do with it. What should you do?",
            options:[
            "Raise it — the booking should follow the functions, assets and risks that were actually involved",
            "Book it, since it is a tax matter and not yours",
            "Refuse to do the trade at all",
            "Book it into your own entity instead"
          ],
            answer:0,
            why:"Resolving it is not your job, but noticing is. Bookings that do not match reality are the raw material of every transfer pricing dispute, and the trader is usually the only person who knows what actually happened." },
          { type:"choice",
            prompt:"What did Pillar Two change about where groups choose to sit?",
            options:[
            "Below the floor the advantage is largely recovered, so location now competes on people, banks, infrastructure and stability",
            "Nothing of substance",
            "It made low-tax jurisdictions unlawful",
            "It removed the need for transfer pricing"
          ],
            answer:0,
            why:"Arguably this is good news for a genuine trading hub. When the tax differential narrows, the things that actually make a place good at trading — the banks, the brokers, the courts, the people — count for relatively more." },
          { type:"numeric",
            prompt:"A group books $12,000,000 of profit in a jurisdiction taxed at 11% and $12,000,000 in one taxed at 21%. What is the blended effective rate on the $24,000,000?",
            answer:16,
            unit:"%",
            tolerance:0.1,
            why:"Tax paid is 1,320,000 plus 2,520,000, so 3,840,000 on 24,000,000, which is 16%. The blend is worth knowing and also worth distrusting: the minimum tax is computed jurisdiction by jurisdiction, so the 11% entity still faces a top-up even though the average clears the floor." },
          { type:"choice",
            prompt:"What is the honest summary of tax for a physical trader?",
            options:[
            "Recognise the questions and raise them early; the answers belong to specialists",
            "Learn to compute the group’s tax position yourself",
            "Tax is irrelevant to trading decisions",
            "Tax considerations decide every trade"
          ],
            answer:0,
            why:"Nobody expects a trader to be a tax adviser. They do expect you to notice when a booking, a pricing date or a pattern of travel raises a question, and to ask it while it can still be answered cheaply." }
        ]
      }
    ]
  },
  {
    id: "u4",
    title: "Legal Aspects & Regulations",
    subtitle: "The terms that decide who pays when a trade fails",
    scene: "legal",
    lessons: [
      {
        id: "u4l1",
        title: "FOB — the benchmark",
        goal: "Free On Board: you deliver on board at the load port, the buyer takes it from there.",
        exercises: [
          { type:"choice",
            prompt:"Under FOB, who arranges and pays the ocean freight?",
            options:["The seller","The buyer","The bank","It is shared"],
            answer:1,
            why:"FOB means your job ends once the goods are on board at the load port. The buyer books and pays the ship." },
          { type:"choice",
            prompt:"Under FOB, when does the risk pass from seller to buyer?",
            options:["When the contract is signed","When the goods are on board at the load port","On arrival at destination","When the buyer pays"],
            answer:1,
            why:"On board at the load port. After that, if the cargo is damaged at sea, it is the buyer’s problem — and the buyer’s insurance." },
          { type:"choice",
            prompt:"You sell FOB instead of CIF. What happens to the price you can charge?",
            options:["It goes up","It goes down","It stays the same","It doubles"],
            answer:1,
            why:"You are delivering less, so you are paid less. FOB nets you a lower price but ties up less capital and carries less execution risk." },
          { type:"pairs",
            prompt:"Under FOB, who pays for what?",
            pairs:[["Loading at origin","Seller"],["Ocean freight","Buyer"],["Marine insurance","Buyer"],["Import duty","Buyer"]],
            why:"FOB is the physical-trade benchmark precisely because the split is clean and well understood." }
        ]
      },
      {
        id: "u4l2",
        title: "CFR and CIF — you pay the freight",
        goal: "Selling delivered-to-port: more price, more capital, more execution risk.",
        exercises: [
          { type:"choice",
            prompt:"What does the extra \"I\" in CIF add compared to CFR?",
            options:["Inspection","Insurance","Import duty","Interest"],
            answer:1,
            why:"CFR is Cost and Freight: you pay the freight. CIF adds Insurance: you also pay the marine cover to destination." },
          { type:"choice",
            prompt:"You switch from FOB to CIF. What happens to your working capital need?",
            options:["It falls","It rises","Unchanged","It disappears"],
            answer:1,
            why:"You are now funding the freight and the insurance as well as the cargo, for longer. More price, more capital." },
          { type:"order",
            prompt:"Order these incoterms from least to most seller obligation",
            items:["EXW","FOB","CFR","CIF","DDP"],
            why:"This ladder is worth knowing by heart. Every step right means the seller does more, charges more and carries more." },
          { type:"choice",
            prompt:"Under CIF, who must buy the marine insurance, and who normally claims on it?",
            options:[
            "The seller buys it; the buyer claims on it",
            "The seller buys it and claims on it",
            "The buyer buys it; the seller claims on it",
            "Neither — the carrier insures the cargo"
          ],
            answer:0,
            why:"The seller pays for cover on goods that are already at the buyer’s risk, and assigns the policy. Worth knowing: under Incoterms 2020 the CIF minimum is only Institute Cargo Clauses (C), a named-perils cover — not all risks. A buyer who wants ICC (A) has to write it into the contract." }
        ]
      },
      {
        id: "u4l3",
        title: "EXW and DDP — the extremes",
        goal: "The two ends of the ladder, and why you would ever pick them.",
        exercises: [
          { type:"choice",
            prompt:"Under EXW (Ex Works), what does the seller actually do?",
            options:["Delivers to the buyer’s door","Makes the goods available at their own premises","Pays the freight","Clears customs"],
            answer:1,
            why:"EXW is the minimum: the goods are available at the seller’s gate and the buyer does everything else, including loading and export clearance." },
          { type:"choice",
            prompt:"Under DDP, who pays the import duty?",
            options:["The buyer","The seller","The carrier","Split evenly"],
            answer:1,
            why:"DDP is Delivered Duty Paid: the seller delivers cleared and duty-paid at the destination. It is the heaviest obligation on the ladder." },
          { type:"choice",
            prompt:"Why would a trader sell DDP despite the cost and risk?",
            options:["It is simpler","The buyer pays a premium and accepts more easily","It avoids tax","Banks require it"],
            answer:1,
            why:"You are selling convenience. A buyer who wants goods at their door without touching logistics will pay for it — if you can execute." },
          { type:"numeric",
            prompt:"FOB nets you $38,000. Selling CIF instead adds $18,000 of price but $6,000 of freight and insurance you must fund. What is the CIF margin?",
            answer:50000,
            unit:"$",
            tolerance:0,
            why:"38,000 + 18,000 − 6,000 = 50,000. More margin, but you have carried more risk and more capital to earn it." }
        ]
      },
      {
        id: "u4l4",
        title: "Risk, cost, and title",
        goal: "The distinction that separates people who have read about incoterms from people who use them.",
        exercises: [
          { type:"choice",
            prompt:"Do incoterms determine who legally owns the goods?",
            options:["Yes, always","No — they allocate cost and risk, not title","Only for FOB","Only with a letter of credit"],
            answer:1,
            why:"This is the point most people get wrong. Incoterms allocate costs, responsibilities and the transfer of risk. Title passes according to the sales contract and the documents — typically the bill of lading." },
          { type:"choice",
            prompt:"Which document normally controls the right to take delivery of a seaborne cargo?",
            options:["The commercial invoice","The bill of lading","The incoterm","The insurance certificate"],
            answer:1,
            why:"An original negotiable bill of lading is a document of title: whoever holds it properly endorsed can demand the goods. Note that this is possession, not ownership — property passes when the contract says it does, which is why a bank can hold the bill as security without owning the cargo." },
          { type:"pairs",
            prompt:"Match each thing to what decides it",
            pairs:[["Who pays the freight","The incoterm"],["When risk passes","The incoterm"],["Who owns the goods","The contract and the bill of lading"]],
            why:"Cost and risk: incoterms. Title: the contract and the documents. Keep them separate in your head." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["Incoterms allocate","cost and risk","but they do not","decide legal title"],
            distractors:["set the price","choose the vessel"],
            why:"Say this in an interview and you will sound like someone who has used incoterms, not read about them." }
        ]
      },
      {
        id: "u4l5",
        title: "Standard forms",
        goal: "GAFTA and FOSFA contracts are the trade’s shared language. Amending them casually is how you lose the protection.",
        exercises: [
          { type:"choice",
            prompt:"What is a GAFTA or FOSFA contract?",
            options:[
            "A standard form used across the grain and oils trade, with settled wording for quality, delivery, default and arbitration",
            "A licence required to trade agricultural goods",
            "A published price index",
            "A customs declaration form"
          ],
            answer:0,
            why:"They exist so two counterparties who have never met can agree terms in a few lines, because everything else is already written and already tested in arbitration. The value is the shared meaning: write \"GAFTA 49\" and both sides know what happens if the cargo is late." },
          { type:"choice",
            prompt:"You paste a bespoke clause into a standard form without checking how it interacts with the rest. What is the risk?",
            options:[
            "The new wording can contradict or disapply a standard clause, and the outcome may be nothing like either side intended",
            "None — bespoke clauses always take priority cleanly",
            "The whole contract becomes void",
            "Arbitration is no longer available"
          ],
            answer:0,
            why:"Standard forms are internally consistent, and a special condition dropped into the middle can knock out a default remedy or a time bar somewhere else entirely. Special conditions usually prevail over the printed terms, so one unconsidered sentence does more damage than it looks capable of." },
          { type:"pairs",
            prompt:"Match each clause to the question it answers",
            pairs:[["Quality clause","What the goods must be, and the tolerance around it"],["Default clause","What happens, and at what price, when one side fails"],["Arbitration clause","Who decides a dispute, and under which rules"]],
            why:"The default clause is the one traders read last and need most. It converts a broken trade into a number, and without it you are negotiating from nothing at the worst possible moment." },
          { type:"choice",
            prompt:"Why do these contracts specify how the price for damages is established on default?",
            options:[
            "So the loss becomes a mechanical calculation against the market rather than an argument",
            "To cap damages at a low figure",
            "Because tribunals cannot award damages otherwise",
            "To avoid having to arbitrate at all"
          ],
            answer:0,
            why:"The default price is normally the market price on the day of default. That turns a dispute about how much you lost into arithmetic, which is faster and far cheaper than proving your onward sales — and it is why evidence of the market on that day is worth keeping." },
          { type:"choice",
            prompt:"Which law and which forum govern the contract?",
            options:[
            "Whatever the contract says — and if it says nothing you may spend more arguing about that than about the goods",
            "Always the law of the seller’s country",
            "Always English law",
            "The law of the port of discharge"
          ],
            answer:0,
            why:"A contract with no governing law and no forum has a second dispute built into it. Physical trade gravitates to English law and arbitration in London for exactly this reason: the answers are predictable and the arbitrators know the commodity." }
        ]
      },
      {
        id: "u4l6",
        title: "Arbitration",
        goal: "Trade disputes are decided by arbitrators who know the commodity, not by a general court.",
        exercises: [
          { type:"choice",
            prompt:"Why does the physical trade prefer arbitration to litigation?",
            options:[
            "The tribunal understands the trade, proceedings are private, and awards are enforceable across borders",
            "It is always cheaper",
            "Arbitrators tend to favour the seller",
            "Awards can never be challenged on any ground"
          ],
            answer:0,
            why:"Enforceability is the strongest reason and the least appreciated. Under the New York Convention an arbitral award can be enforced in most countries, while a foreign court judgment often cannot. When your counterparty’s assets sit somewhere else, that is the difference between winning and being paid." },
          { type:"choice",
            prompt:"Trade arbitration rules set a time limit for starting a claim. What happens if you miss it?",
            options:[
            "The claim can be time-barred and lost, however strong it was",
            "The limit is only a guideline",
            "The tribunal will extend it on request",
            "The limit applies to quality claims only"
          ],
            answer:0,
            why:"These time bars are short — often weeks or months from a defined event rather than years. More good claims die of the calendar than of the merits, which is why the first thing to diarise on a problem cargo is the deadline, before anyone starts negotiating." },
          { type:"order",
            prompt:"Put a typical trade arbitration in order",
            items:[
            "A dispute arises and notice of arbitration is served in time",
            "Each side appoints its arbitrator",
            "Submissions and documents are exchanged",
            "The tribunal issues a written award",
            "The award is enforced, through the courts if necessary"
          ],
            why:"Notice comes first and is where claims are most often lost. Everything after it is procedure that can be corrected; the deadline is the only step that cannot be recovered." },
          { type:"choice",
            prompt:"The other side loses the arbitration and does not pay. Where does that leave you?",
            options:[
            "You take the award to a court where they hold assets and seek enforcement",
            "The award is unenforceable and you start again",
            "You must relitigate the dispute in court",
            "The arbitrators collect the money on your behalf"
          ],
            answer:0,
            why:"An award is a decision, not cash. Enforcement is a separate exercise and it only works where there are assets to reach — so knowing where a counterparty actually keeps its money belongs in the credit assessment, not in the post-mortem." },
          { type:"choice",
            prompt:"What does the confidentiality of arbitration cost the market?",
            options:[
            "Awards are largely unpublished, so precedent builds slowly and privately",
            "Nothing at all",
            "It makes contracts unenforceable",
            "Regulators lose the ability to supervise trade"
          ],
            answer:0,
            why:"A real trade-off. Privacy protects commercial relationships and keeps disputes out of the press, but the reasoning stays with the parties, so the trade as a whole learns more slowly than it would from published judgments." }
        ]
      },
      {
        id: "u4l7",
        title: "Force majeure",
        goal: "Force majeure is a creature of the contract. It excuses only what the clause says, and the burden sits with whoever claims it.",
        exercises: [
          { type:"choice",
            prompt:"What does a force majeure clause actually do?",
            options:[
            "It suspends or excuses performance on defined events, on the terms the clause sets out",
            "It cancels the contract automatically whenever something goes wrong",
            "It transfers the loss to the insurer",
            "It is implied into every contract by law"
          ],
            answer:0,
            why:"There is no general doctrine of force majeure in English law: it exists only because the parties wrote it down. Two contracts covering the same cargo can therefore give opposite answers to the same event, depending entirely on the words each one used." },
          { type:"choice",
            prompt:"Your supplier declares force majeure because its production cost rose sharply. Is that likely to succeed?",
            options:[
            "No — a price move that makes performance unprofitable is usually not force majeure",
            "Yes, any material change qualifies",
            "Yes, once the rise passes 20%",
            "Only under FOSFA forms"
          ],
            answer:0,
            why:"The test is normally impossibility or legal prevention, not hardship. A trade becoming expensive is the risk you took by fixing a price. Notices that arrive suspiciously soon after the market moved against someone deserve a very close reading of the clause." },
          { type:"order",
            prompt:"Put the steps of a force majeure claim in order",
            items:[
            "The event occurs and prevents performance",
            "Notice is given within the period the clause requires",
            "Evidence of the event and its effect is supplied",
            "Performance is suspended for the permitted period",
            "The contract is cancelled if the event runs beyond that period"
          ],
            why:"Notice within the stated period is a condition, not a courtesy. A genuine event, badly notified, can leave the claiming party in default anyway — the most avoidable loss in this whole area." },
          { type:"choice",
            prompt:"What should you check first when a force majeure notice arrives?",
            options:[
            "Whether the event is listed in the clause, whether notice was timely, and what evidence came with it",
            "Whether the counterparty seems sincere about it",
            "Where the market is trading today",
            "Whether the goods have already shipped"
          ],
            answer:0,
            why:"Three mechanical questions before any commercial conversation. Accepting a notice that does not meet the clause weakens your position on this cargo and on every future one with the same counterparty, because you have shown how you respond." },
          { type:"numeric",
            prompt:"You are short 6,000 t against a sale at $410/t. Your supplier fails and the replacement market is $448/t. What does covering the position cost you?",
            answer:228000,
            unit:"$",
            tolerance:0,
            why:"The replacement costs 448 − 410 = 38 more than your sale price, so 6,000 × 38 = 228,000. This is precisely what a default clause exists to quantify: your loss is the cost of buying in, not an argument about lost profit." }
        ]
      },
      {
        id: "u4l8",
        title: "Washout and circles",
        goal: "Not every contract ends in a cargo. Sometimes the cleanest close is cash.",
        exercises: [
          { type:"choice",
            prompt:"What is a washout?",
            options:[
            "Two parties agree to cancel offsetting contracts and settle the price difference in cash",
            "A cargo rejected for water damage",
            "Cleaning a vessel’s tanks between grades",
            "A letter of credit that failed to open"
          ],
            answer:0,
            why:"When you have bought from the same party you have sold to, moving the cargo achieves nothing but cost. A washout settles the difference and closes both contracts, saving the freight, the finance and the operational risk of a voyage with no purpose." },
          { type:"choice",
            prompt:"What is a circle?",
            options:[
            "A chain of sales that comes back round to an earlier seller, so the same cargo is contracted in a loop",
            "A group of traders agreeing prices between themselves",
            "A revolving letter of credit",
            "A voyage that returns to the load port"
          ],
            answer:0,
            why:"Circles form naturally in liquid markets where the same parcel is traded many times. They are settled by netting the differences around the ring rather than delivering, and the trade has rules for doing it — the point is to close the loop cleanly, not to pretend it never formed." },
          { type:"numeric",
            prompt:"You bought 5,000 t at $392/t and sold 5,000 t to the same counterparty at $407/t, then agree a washout. What is settled?",
            answer:75000,
            unit:"$",
            tolerance:0,
            why:"407 − 392 = 15 per tonne, so 5,000 × 15 = 75,000 payable to you. The cargo never moves, the margin is realised anyway, and both sides avoid shipping goods to their own supplier." },
          { type:"choice",
            prompt:"A counterparty proposes a washout at a price well away from the market. What should you weigh?",
            options:[
            "That the settlement price is the entire negotiation, and it should reference something observable",
            "That washouts are by convention always fair",
            "That refusing would damage the relationship",
            "That the price hardly matters because no cargo moves"
          ],
            answer:0,
            why:"A washout is a price negotiation with the cargo taken out. Without a reference to an observable market it becomes a test of who needs the deal more, and the party under pressure to close its book pays for the privilege." },
          { type:"choice",
            prompt:"Why does a washout reduce risk beyond simply saving money?",
            options:[
            "It removes the operational, credit and documentary risk of a shipment that served no commercial purpose",
            "It converts the trade into a hedge",
            "It moves the risk onto the insurer",
            "It guarantees the counterparty will pay"
          ],
            answer:0,
            why:"Every cargo that moves can be damaged, delayed, rejected or financed badly. A shipment that exists only because two contracts failed to meet in the middle is pure exposure with nothing earned for it. The cheapest cargo is the one you never load." }
        ]
      },
      {
        id: "u4l9",
        title: "Protecting the receivable",
        goal: "A letter of credit is not the only answer. Credit insurance and guarantees cover different failures at different costs.",
        exercises: [
          { type:"pairs",
            prompt:"Match each instrument to how it works",
            pairs:[["Letter of credit","A bank pays against compliant documents"],["Trade credit insurance","An insurer indemnifies you after the buyer fails to pay"],["Demand guarantee","A bank pays on demand, independently of the dispute"]],
            why:"Three different mechanics. The credit substitutes bank risk for buyer risk before shipment, insurance leaves you exposed and reimburses you afterwards, and a demand guarantee pays first and argues later." },
          { type:"choice",
            prompt:"What does trade credit insurance actually cover?",
            options:[
            "Non-payment by the buyer, subject to a co-insured share and a credit limit per buyer",
            "Physical damage to the goods",
            "Adverse currency movements",
            "Late delivery by your supplier"
          ],
            answer:0,
            why:"Credit risk, not cargo risk. Two limitations decide whether it is useful: a co-insured percentage you always carry, and a per-buyer limit the insurer can cut or withdraw — sometimes exactly when that buyer starts to look shaky." },
          { type:"numeric",
            prompt:"A $2,000,000 receivable is credit insured with 10% co-insurance. The buyer defaults in full. What do you recover from the insurer?",
            answer:1800000,
            unit:"$",
            tolerance:0,
            why:"Co-insurance leaves a tenth with you, so 2,000,000 − 200,000 = 1,800,000. The retained share is deliberate: an insurer paying the whole amount would be underwriting your credit judgement rather than sharing it with you." },
          { type:"choice",
            prompt:"Why is a demand guarantee harder for a buyer to resist than a letter of credit?",
            options:[
            "It pays against a compliant demand without the underlying dispute being resolved first",
            "It is always issued by a stronger bank",
            "It never expires",
            "It also covers physical damage"
          ],
            answer:0,
            why:"Autonomy is the whole point: the bank pays on the demand, and any argument about performance happens afterwards between the parties. That is powerful — and it is why buyers resist giving one, and why an abusive call on a guarantee is a real risk running the other way." },
          { type:"choice",
            prompt:"Your credit insurer withdraws the limit on a buyer you have already contracted with. What is your position?",
            options:[
            "New shipments to that buyer are uninsured, so the exposure must be managed commercially or the trade restructured",
            "The existing contract becomes void",
            "The insurer must hold the limit until the contract ends",
            "The buyer is obliged to provide a letter of credit instead"
          ],
            answer:0,
            why:"Limits are usually withdrawable for future shipments, and the withdrawal is itself information: the insurer has seen something you have not. The right response is to treat it as a credit warning and change the payment terms, not to argue with the underwriter." }
        ]
      },
      {
        id: "u4l10",
        title: "Putting it together",
        goal: "The contract is where every earlier lesson is either protected or quietly given away.",
        exercises: [
          { type:"choice",
            prompt:"A trade goes wrong. Where do you look first?",
            options:[
            "The contract: the clause covering the event, the notice periods, and the remedy it gives",
            "The insurance policy",
            "The bill of lading",
            "The counterparty’s reputation in the market"
          ],
            answer:0,
            why:"The contract decides which of the other documents matter. It tells you whether this is a quality claim, a default, a force majeure or a credit event — and each of those goes somewhere different, with its own deadline." },
          { type:"choice",
            prompt:"Which of these is a credit failure rather than a performance failure?",
            options:[
            "The goods arrive on spec and the buyer does not pay",
            "The goods arrive off spec",
            "The vessel arrives after the laycan",
            "The supplier is unable to load"
          ],
            answer:0,
            why:"Sorting a failure into the right category is the first move, because each has its own remedy. A quality claim runs to the contract tolerance and arbitration; a credit failure runs to the letter of credit, the insurer or the guarantee." },
          { type:"pairs",
            prompt:"Match each failure to where the remedy lives",
            pairs:[["Cargo arrives off spec","The quality clause and its tolerance"],["Buyer will not pay","Credit protection or the letter of credit"],["Port closed by government order","Force majeure, if the clause lists it"]],
            why:"Three failures, three routes. Sending a claim down the wrong route usually burns the time bar on the right one, and that is not recoverable." },
          { type:"numeric",
            prompt:"A default clause values your loss at the market price on the day of default. You sold 10,000 t at $530/t and the market on that day is $562/t. What are your damages?",
            answer:320000,
            unit:"$",
            tolerance:0,
            why:"562 − 530 = 32 per tonne, so 10,000 × 32 = 320,000. The formula ignores what you actually did afterwards, which cuts both ways: it spares you from proving your onward sales, and it gives you no credit for having covered the position well." },
          { type:"choice",
            prompt:"What protects a desk most when a counterparty fails?",
            options:[
            "Having negotiated the default, notice and arbitration clauses before the relationship came under strain",
            "Insisting on the widest possible force majeure clause",
            "Always trading on your own standard form",
            "Choosing the courts over arbitration"
          ],
            answer:0,
            why:"Those clauses are cheap to agree while everyone is friendly and impossible to agree afterwards. They are also the ones skipped in a rush, because they describe a future that nobody signing the contract expects to arrive." }
        ]
      }
    ]
  },
  {
    id: "u5",
    title: "Shipping",
    subtitle: "Chartering, laytime, documents and the protection of the goods",
    scene: "shipping",
    lessons: [
      {
        id: "u5l1",
        title: "The cargo has to move",
        goal: "Freight, transit time and the vessel that fits the parcel.",
        exercises: [
          { type:"choice",
            prompt:"Why does transit time matter to your P&L, beyond patience?",
            options:["It does not","Every extra day is financed and adds price exposure","Ships charge by the day always","Longer voyages get better prices"],
            answer:1,
            why:"Time is money twice over: interest on the funding, and more days for the price to move against you." },
          { type:"pairs",
            prompt:"Match the parcel to a sensible vessel",
            pairs:[["175 t of copper","Truck or rail"],["25,000 t of soybeans","Handysize bulk carrier"],["170,000 t of iron ore","Capesize bulk carrier"]],
            why:"Matching the parcel to the vessel is basic credibility. Book a Capesize for 25,000 t and you are paying for a ship you will fill to a seventh of its capacity." },
          { type:"choice",
            prompt:"Your buyer needs the cargo in 20 days. The voyage takes 28. What is the honest answer?",
            options:["Promise 20 and hope","Offer a realistic date, or a different origin","Send it faster","Split the cargo"],
            answer:1,
            why:"Late delivery costs reputation and can trigger claims. In a business built on repeat counterparties, a realistic date beats a lost one." },
          { type:"numeric",
            prompt:"Freight is $28/t. You are shipping 25,000 t. What is the freight cost?",
            answer:700000,
            unit:"$",
            tolerance:0,
            why:"25,000 × 28 = $700,000. On a cargo worth about $6 million, freight alone is over 11% — which is why freight is a trading decision, not an afterthought." }
        ]
      },
      {
        id: "u5l2",
        title: "Voyage or time charter",
        goal: "Two ways to take a ship, and they put the risk of delay in opposite places.",
        exercises: [
          { type:"choice",
            prompt:"Under a voyage charter, who pays for the bunkers and the vessel’s own port dues?",
            options:["The charterer","The shipowner","The terminal","Nobody — they are in the freight"],
            answer:1,
            why:"The owner absorbs those voyage costs and quotes you one freight number that has to cover them. Cargo handling is a separate question: under FIO terms, common in bulk, loading, stowing and trimming are the charterer’s. That is why an owner cares intensely about how fast your berth works — the delay is on their fuel and their days." },
          { type:"choice",
            prompt:"Under a time charter, what does the charterer pay?",
            options:["A freight rate per tonne","Hire per day, plus bunkers and port costs","Only demurrage","A lumpsum on completion"],
            answer:1,
            why:"You are renting the ship and crew by the day and running it yourself. The owner stops caring about speed, because the clock is yours the moment the ship is delivered." },
          { type:"choice",
            prompt:"A vessel on time charter sits idle at anchorage for four days. Who pays?",
            options:["The owner","The charterer, through hire that keeps running","Nobody","The port"],
            answer:1,
            why:"There is no demurrage claim on a time charter because there is nothing to claim — hire simply accrues. Delay is not a dispute here, it is an invoice." },
          { type:"pairs",
            prompt:"Match each cost to who normally bears it",
            pairs:[["Bunkers on a voyage charter","The owner"],["Bunkers on a time charter","The charterer"],["Delay beyond laytime on a voyage charter","The charterer, as demurrage"],["Delay on a time charter","The charterer, as hire"]],
            why:"Read the pattern: on a time charter almost everything operational moves to the charterer. You buy flexibility and you buy the risk with it." },
          { type:"choice",
            prompt:"You have one cargo, one voyage, and no shipping desk. Which do you take?",
            options:["A time charter","A voyage charter","A bareboat charter","Neither"],
            answer:1,
            why:"A voyage charter hands the operational risk to someone who does this for a living, at a known price. Time charters make sense when you have a programme of cargoes and the expertise to run a ship." }
        ]
      },
      {
        id: "u5l3",
        title: "How freight is quoted",
        goal: "Per tonne, lumpsum, or as a percentage of an index — and each one shifts a different risk.",
        exercises: [
          { type:"choice",
            prompt:"Freight is quoted as a lumpsum of $1,200,000. You load less cargo than planned. What happens to your freight cost per tonne?",
            options:["It falls","It rises","It is unchanged","The owner refunds the difference"],
            answer:1,
            why:"A lumpsum is the same money for less cargo, so the cost per tonne goes up. Per-tonne freight scales with what you load; lumpsum puts the quantity risk on you." },
          { type:"choice",
            prompt:"You contracted for a minimum 30,000 t but only 28,000 t is available. What does the owner charge for the gap?",
            options:["Demurrage","Deadfreight","Despatch","Nothing"],
            answer:1,
            why:"Deadfreight is freight on cargo you promised and did not load. The ship reserved space it cannot now sell, so you pay for the empty tonnes." },
          { type:"choice",
            prompt:"In tanker chartering, what does Worldscale 100 mean?",
            options:["$100 per tonne","The published flat rate for that specific route","A 100-day voyage","A 100,000 t cargo"],
            answer:1,
            why:"Worldscale publishes a nominal flat rate in dollars per tonne for each route each year. Quotes are then a percentage of it, so WS100 is the flat rate and WS175 is 75% above it. It lets the market quote one number across hundreds of routes." },
          { type:"numeric",
            prompt:"The Worldscale flat rate for the route is $20.00/t and the market is WS175. What is the freight in dollars per tonne?",
            answer:35,
            unit:"$/t",
            tolerance:0,
            why:"20 × 175 ÷ 100 = $35/t. Worldscale points are a percentage, not a price — which is why a flat rate revision in January can move your freight cost without the market moving at all." },
          { type:"numeric",
            prompt:"Same route at $35/t. You are shipping 80,000 t. What is the total freight?",
            answer:2800000,
            unit:"$",
            tolerance:0,
            why:"35 × 80,000 = $2,800,000. On a cargo worth perhaps $50m that is over 5% — freight is not a rounding error in a physical trade, it is often the difference between a profit and a loss." },
          { type:"order",
            prompt:"Order how an owner builds up a freight quote",
            items:[
            "Days to reposition the ship to the load port",
            "Days on the laden voyage",
            "Bunkers burned on both legs",
            "Port and canal charges",
            "Carbon compliance cost on regulated legs",
            "Brokerage and address commission",
            "The daily return the owner needs",
            "The freight rate offered to you"
          ],
            why:"Notice the first line: you are paying for the ballast leg to come and get you. Note also the two lines people forget — emissions compliance on regulated voyages is now an explicit line in a quote rather than a detail, and brokerage sits in every fixture." }
        ]
      },
      {
        id: "u5l4",
        title: "TCE and bunkers",
        goal: "The owner compares every cargo on one number, and knowing it tells you whether your offer will be taken.",
        exercises: [
          { type:"choice",
            prompt:"What is the time charter equivalent, or TCE?",
            options:[
            "The freight rate per tonne",
            "Voyage revenue minus voyage costs, divided by the days the voyage takes",
            "The daily hire on a time charter",
            "The bunker price"
          ],
            answer:1,
            why:"It converts a voyage charter into dollars per day, so an owner can hold your cargo up against a time charter and against every other cargo on offer. It is the number your business competes on, whether you see it or not." },
          { type:"numeric",
            prompt:"Freight revenue $2,400,000. Bunkers and port costs $800,000. The round voyage takes 32 days. What is the TCE per day?",
            answer:50000,
            unit:"$/day",
            tolerance:0,
            why:"(2,400,000 − 800,000) ÷ 32 = $50,000/day. If the time charter market is paying $60,000/day, your cargo does not get a ship at that freight, no matter how much the owner likes you." },
          { type:"numeric",
            prompt:"The vessel burns 25 t of fuel a day for 20 days at $600/t. What is the bunker cost?",
            answer:300000,
            unit:"$",
            tolerance:0,
            why:"25 × 20 × 600 = $300,000. Bunkers are usually the largest single voyage cost and the most volatile, which is why a fuel move can reprice freight before any cargo trades." },
          { type:"choice",
            prompt:"The bunker price doubles overnight. On a voyage charter agreed last week, who absorbs it?",
            options:["You, the charterer","The owner","It is split","The refinery"],
            answer:1,
            why:"The owner quoted a freight rate that already assumed a fuel price, and they are stuck with it. That is precisely why owners will not hold a freight quote open for long, and why a stale indication is not a price." },
          { type:"choice",
            prompt:"Why does a slower voyage cost the owner more than just the extra days of fuel?",
            options:["It does not","Because the ship cannot earn on the next cargo","Because the crew is paid overtime","Because port charges rise"],
            answer:1,
            why:"The real cost is the voyage they could not take. Every idle or slow day is a day of TCE lost forever, and that opportunity cost is what shows up in the next quote you receive." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["An","owner","compares","cargoes","on","dollars","per","day","not","on","dollars","per","tonne"],
            distractors:["month","freight","cargo"],
            why:"Learn to translate your freight offer into their TCE and you stop being surprised when a good-looking rate is refused." }
        ]
      },
      {
        id: "u5l5",
        title: "Position, ballast and freight risk",
        goal: "Freight is a market with its own price, its own volatility, and its own hedge.",
        exercises: [
          { type:"choice",
            prompt:"What is a ballast leg?",
            options:["The loaded part of the voyage","The voyage the ship makes empty to reach the load port","Time spent at anchorage","The return of the cargo"],
            answer:1,
            why:"An empty ship earns nothing but still burns fuel and time, so the ballast leg is paid for inside your freight rate. Cargoes that let a ship load near where it discharged are structurally cheaper to move." },
          { type:"choice",
            prompt:"Two identical cargoes. One suits a ship already discharging nearby, one needs a ship from the other side of the world. What differs?",
            options:["Nothing","The freight rate","The cargo quality","The incoterm"],
            answer:1,
            why:"This is why traders watch vessel positions, not just the freight index. Knowing which ships are open where is a genuine edge, and it is a physical edge that no screen price gives you." },
          { type:"choice",
            prompt:"You sold CFR and freight rates rise 30% before you fix a ship. What has happened to your margin?",
            options:["Nothing, freight is the buyer’s cost","It has shrunk or gone","It has improved","Only the insurance changed"],
            answer:1,
            why:"Selling CFR or CIF means you promised to deliver freight-inclusive, so an unfixed freight exposure sits in your margin exactly like an unhedged price position. Sell CFR, fix the ship — or accept that you are trading freight too." },
          { type:"choice",
            prompt:"How can that freight exposure be hedged on paper?",
            options:["It cannot be","With a forward freight agreement","With a letter of credit","With marine insurance"],
            answer:1,
            why:"Forward freight agreements settle against a published route index, so they hedge the market but not your specific ship or route. Same logic as any hedge: you remove the market move and keep the basis." },
          { type:"pairs",
            prompt:"Match each freight exposure to its control",
            pairs:[["Sold CFR, ship not yet fixed","Fix the vessel, or hedge with an FFA"],["Bunker price moving before fixing","Take the quote quickly, or agree a bunker adjustment"],["Slow berth on a voyage charter","Budget demurrage into the margin"],["No ships open near the load port","Widen the laycan, or reprice the cargo"]],
            why:"None of these is exotic. Freight is simply the part of the trade most often quoted from memory and then discovered to have moved." },
          { type:"choice",
            prompt:"What is the honest place of freight in a physical trade?",
            options:[
            "A minor logistics cost",
            "A traded market inside your margin that has to be priced and often hedged",
            "The shipowner’s problem",
            "Fixed by the incoterm"
          ],
            answer:1,
            why:"Margins on physical cargoes are thin and freight is a large, volatile share of them. Desks that treat freight as an afterthought discover the cargo was profitable and the voyage was not." }
        ]
      },
      {
        id: "u5l6",
        title: "Nomination and laycan",
        goal: "A cargo needs a ship, and the ship has to arrive inside an agreed window.",
        exercises: [
          { type:"choice",
            prompt:"Under an FOB sale, who normally nominates the vessel?",
            options:["The seller","The buyer","The inspector","The bank"],
            answer:1,
            why:"FOB means the buyer takes delivery once the goods are on board — the old \"ship’s rail\" wording was dropped in 2010 — so the buyer charters and nominates. The seller’s job is to have the cargo ready at the load port for that ship." },
          { type:"choice",
            prompt:"A laycan of 10–15 March means the vessel must…",
            options:["Discharge by 15 March","Be ready to load between 10 and 15 March","Be built before March","Sail on 15 March exactly"],
            answer:1,
            why:"Laycan is laydays and cancelling: the earliest the ship can be presented and the last date the other side must accept it. Arrive after the cancelling date and the counterparty can walk away." },
          { type:"choice",
            prompt:"The seller cannot get the cargo ready until 20 March and laycan closes on the 15th. What has just been created?",
            options:["A pricing gain","Demurrage, and a breach of the sale contract","A quality claim","A credit line"],
            answer:1,
            why:"The ship arrives, tenders notice, laytime runs and demurrage accrues — the buyer pays the owner and recharges you. Note what does not happen: the cancelling date protects the charterer against a late vessel, not against late cargo, so it is no help to you here." },
          { type:"order",
            prompt:"Order the steps from fixture to loading",
            items:[
            "Charterer fixes the vessel",
            "Vessel is nominated to the counterparty",
            "Nomination is accepted",
            "Vessel arrives within laycan",
            "Notice of Readiness is tendered",
            "Loading begins"
          ],
            why:"Each step is a place a trade can break. Most execution disputes are about whether one of these happened on time, and in writing." },
          { type:"pairs",
            prompt:"Match the term to what it fixes",
            pairs:[["Laycan","The arrival window"],["Laytime","The free time allowed to load or discharge"],["Demurrage","The price of exceeding that free time"],["Despatch","The reward for finishing early"]],
            why:"Laycan is about when the ship comes. Laytime, demurrage and despatch are about how long it stays. Note that despatch is only payable if the charterparty provides for it — normal in dry bulk, rare on tankers — while demurrage is almost always there." }
        ]
      },
      {
        id: "u5l7",
        title: "NOR and demurrage",
        goal: "Time at the berth is money, and the clock has precise rules for starting.",
        exercises: [
          { type:"choice",
            prompt:"What is a Notice of Readiness?",
            options:[
            "Formal notice from the vessel that it has arrived and is ready to work cargo",
            "The buyer’s payment instruction",
            "The insurance certificate",
            "A customs form"
          ],
            answer:0,
            why:"A valid NOR is what starts the laytime clock, usually after an agreed number of hours. If the NOR is invalid — wrong place, not actually ready — the clock may never have started. Not always, though: if the charterer starts working cargo without rejecting the notice, English law treats that as a waiver and laytime runs from commencement." },
          { type:"choice",
            prompt:"Laytime is the free time allowed. Demurrage is…",
            options:["A bonus for the charterer","Agreed damages paid for time used beyond laytime","A port tax","The freight rate"],
            answer:1,
            why:"Demurrage is liquidated damages, agreed in advance as a daily rate. Because it is pre-agreed, nobody has to prove actual loss — which is exactly why it gets claimed so aggressively." },
          { type:"numeric",
            prompt:"Laytime allowed is 72 hours. The vessel took 96 hours. Demurrage is $24,000 per day. What is owed?",
            answer:24000,
            unit:"$",
            tolerance:0,
            why:"96 − 72 = 24 hours over, which is one day. 1 × $24,000 = $24,000. Demurrage is pro-rated by the hour, so half a day over costs half the rate." },
          { type:"numeric",
            prompt:"Same berth, but the vessel took 108 hours against 72 allowed, at $24,000 per day. What is owed?",
            answer:36000,
            unit:"$",
            tolerance:0,
            why:"36 hours over is 1.5 days. 1.5 × $24,000 = $36,000. Twelve extra hours of a slow shore pump just ate a large slice of the cargo margin." },
          { type:"choice",
            prompt:"“Once on demurrage, always on demurrage” means…",
            options:["Demurrage doubles every day","Exceptions that would have paused laytime usually no longer apply","The vessel cannot leave","Freight is refunded"],
            answer:1,
            why:"Rain, holidays or a shift change may stop the laytime clock. Once you are into demurrage, those exceptions typically stop protecting you unless the charterparty says otherwise. Delay gets more expensive the longer it runs." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["Demurrage","is","a","cost","of","time","not","a","cost","of","cargo"],
            distractors:["price","freight","quality"],
            why:"It scales with hours, not tonnes. A small parcel on a slow berth can carry more demurrage than a large one loaded fast." }
        ]
      },
      {
        id: "u5l8",
        title: "The bill of lading",
        goal: "One piece of paper is the receipt, the contract of carriage, and the ownership of the cargo.",
        exercises: [
          { type:"choice",
            prompt:"Why is a negotiable bill of lading called a document of title?",
            options:["It proves the freight was paid","Whoever holds it properly endorsed can claim the cargo","It sets the price","It is issued by the bank"],
            answer:1,
            why:"The cargo can be sold at sea by endorsing and passing the document. That is what makes physical trading of floating cargoes possible at all — and what makes a lost original a serious problem." },
          { type:"choice",
            prompt:"A clean bill of lading means…",
            options:["The cargo was washed","No adverse remark was made about the apparent condition on loading","The cargo is insured","Payment was received"],
            answer:1,
            why:"The vessel’s representative notes only apparent condition — what could be seen. A claused, or “dirty”, bill of lading records damage, and under a letter of credit it is a discrepancy that stops payment." },
          { type:"choice",
            prompt:"The vessel arrives before the original bills of lading do. What is normally used to discharge?",
            options:["A second bill of lading","A letter of indemnity","A new sales contract","Nothing — the ship waits"],
            answer:1,
            why:"A letter of indemnity lets the owner discharge without the originals, against a promise to cover the consequences. Here is why it is taken seriously: delivering without bills voids the owner’s P&I cover, so your indemnity is the only protection there is — unlimited in time and amount, and worth exactly the credit of whoever signed it. That is why a bank countersignature gets asked for, and rarely given." },
          { type:"pairs",
            prompt:"Match each document to what it proves",
            pairs:[["Bill of lading","The cargo was shipped, and who owns it"],["Certificate of quality","What was loaded, and to what specification"],["Certificate of origin","Where the goods came from"],["Commercial invoice","What is owed, and on what basis"]],
            why:"Under a letter of credit the bank pays against documents, not against cargo. A perfect cargo with an imperfect document set does not get paid." },
          { type:"order",
            prompt:"Order the document flow on a CIF sale paid by letter of credit",
            items:[
            "Cargo is loaded and the bill of lading is issued",
            "Seller assembles the document set",
            "Documents are presented to the bank",
            "Bank checks the documents against the credit",
            "Bank pays the seller",
            "Documents are released to the buyer to collect the cargo"
          ],
            why:"Notice the seller is paid before the buyer sees the goods. That is the point of the instrument: the bank’s credit stands in for trust between the two parties." }
        ]
      },
      {
        id: "u5l9",
        title: "Quantity, quality and claims",
        goal: "What arrives is never exactly what left, and the contract decides who absorbs the difference.",
        exercises: [
          { type:"choice",
            prompt:"Who normally determines the loaded quantity and quality?",
            options:["The seller alone","The buyer alone","An independent inspector appointed under the contract","The shipowner"],
            answer:2,
            why:"An independent surveyor draft-surveys the vessel or gauges the tanks and takes samples. Neither side would accept the other’s number, so both accept a third party’s — and the contract says whose certificate is final." },
          { type:"choice",
            prompt:"The contract says the load-port certificate is “final and binding”. The cargo arrives 90 tonnes short. Who bears it?",
            options:["The seller","The buyer","The inspector","The bank"],
            answer:1,
            why:"Final at load means the seller delivered what the certificate says — though the clause almost always reads \"final and binding save for fraud or manifest error\", which is your only way back in. Transit loss is then the buyer’s problem, to pursue against the carrier or insurer — not against the seller. One phrase in the contract moved the entire risk." },
          { type:"numeric",
            prompt:"Bill of lading quantity 30,000 t, outturn 29,880 t. What is the transit loss in tonnes?",
            answer:120,
            unit:"t",
            tolerance:0,
            why:"30,000 − 29,880 = 120 t. On a $600/t cargo that is $72,000 — which is why the franchise clause below matters so much." },
          { type:"choice",
            prompt:"That loss is 0.40%. The contract has a 0.50% franchise. What can be claimed?",
            options:["The full 120 tonnes","Nothing","Half the loss","Only the freight"],
            answer:1,
            why:"A franchise is a threshold, not a deductible. Below it there is no claim at all — but once a loss goes past it you recover the whole loss, not the excess. At 0.60% against a 0.50% franchise you claim the full 0.60%, where a deductible would pay you 0.10%. Small losses are budgeted; a loss just over the line is worth far more than one just under." },
          { type:"choice",
            prompt:"Why do claim clauses carry a time bar?",
            options:["To reduce paperwork","To force claims to be raised while evidence still exists","To increase the freight","To protect the inspector"],
            answer:1,
            why:"Samples degrade, crews change, the ship loads another cargo. Miss the deadline — often 30 to 90 days with full supporting documents — and a valid claim becomes worth nothing." }
        ]
      },
      {
        id: "u5l10",
        title: "Who insures what",
        goal: "Cargo insurance protects your goods. The owner’s P&I protects the owner against third parties. They are not substitutes.",
        exercises: [
          { type:"choice",
            prompt:"Under CIF, who buys the cargo insurance?",
            options:["The seller, for the buyer’s benefit","The buyer, on arrival","The carrier","Nobody — it is included in the freight"],
            answer:0,
            why:"CIF is the common term where you buy insurance covering someone else’s risk. Risk passes once the goods are on board, so the cargo travels at the buyer’s risk while the policy you paid for has to respond to the buyer’s loss. Name the assured correctly or the claim goes nowhere." },
          { type:"choice",
            prompt:"What does the shipowner’s P&I cover protect?",
            options:[
            "The owner’s liabilities to third parties, cargo claims among them",
            "The value of your cargo, paid directly to you",
            "The vessel’s hull and machinery",
            "Your loss of profit on the trade"
          ],
            answer:0,
            why:"P&I is liability cover belonging to the owner, not property cover belonging to you. If your cargo is damaged you may have a claim against the owner and the owner may be covered by its club — but that is a chain of two links, and either can break. Your own cargo policy pays you directly." },
          { type:"pairs",
            prompt:"Match each policy to whose loss it pays",
            pairs:[["Cargo insurance","The cargo owner, for physical loss or damage"],["Hull and machinery","The shipowner, for damage to the vessel"],["P&I","The shipowner, for liabilities to others"]],
            why:"Three policies, three different insureds. Most arguments about who is covered dissolve the moment you say out loud whose loss each policy is designed to pay." },
          { type:"choice",
            prompt:"Under FOB, when does the buyer’s insurable interest normally begin?",
            options:["When the goods are on board and risk passes","When the contract is signed","When the goods arrive at destination","When payment is made"],
            answer:0,
            why:"Insurable interest follows risk. Paying for cover over a period when you did not carry the risk merely wastes premium; leaving a gap at the moment risk passes is far worse, and that hand-over is exactly where FOB cargoes get caught." },
          { type:"choice",
            prompt:"The policy is in the seller’s name and the goods are damaged after risk passed to you. What is the problem?",
            options:[
            "You have the loss but perhaps not the right to claim, unless the policy was assigned or you were named",
            "No problem — insurers pay whoever presents the claim",
            "The carrier pays instead",
            "The loss is shared automatically between seller and buyer"
          ],
            answer:0,
            why:"A policy pays its assured. Under CIF the seller is expected to assign the policy or issue a certificate in transferable form, and when that step is skipped the loss and the money end up with two different parties. An administrative failure with a cargo-sized price tag." }
        ]
      },
      {
        id: "u5l11",
        title: "Institute Cargo Clauses",
        goal: "A, B and C are three widths of cover. Knowing what C leaves out is worth more than knowing what A includes.",
        exercises: [
          { type:"choice",
            prompt:"What is the practical difference between Institute Cargo Clauses A and C?",
            options:[
            "A covers all risks subject to exclusions; C covers only a listed set of named perils",
            "A is the cheaper of the two",
            "C covers war risk and A does not",
            "They differ only in the size of the deductible"
          ],
            answer:0,
            why:"A works by exclusion — everything is covered unless it is written out. C works by inclusion — nothing is covered unless it is written in. That reversal decides who has to prove what when a claim is argued, which usually matters more than the premium difference." },
          { type:"choice",
            prompt:"Under Clauses C, cargo is damaged by sea water entering through a hatch in heavy weather. Is it likely to be covered?",
            options:[
            "Usually not — C does not extend to water damage of that kind",
            "Yes, all water damage is covered",
            "Yes, but only on winter voyages",
            "Only if the vessel was also holed"
          ],
            answer:0,
            why:"C is a short list: stranding, sinking, fire, collision, general average sacrifice and a few others. Sea water through a working hatch in bad weather is the classic gap. Moving a hygroscopic bulk cargo on C cover is a false economy that shows up once." },
          { type:"choice",
            prompt:"Which of these is excluded even under the widest Clauses A cover?",
            options:["Inherent vice, ordinary leakage and insufficient packing","Fire on board","Collision","Theft in transit"],
            answer:0,
            why:"No policy insures goods against being what they are. Inherent vice, natural loss in weight and inadequate packing sit outside cover on every set of clauses — which is why inspection at load and a proper packing specification are risk management rather than paperwork." },
          { type:"choice",
            prompt:"Why is war risk normally a separate cover?",
            options:[
            "It is excluded from the standard clauses and bought back separately, often cancellable at short notice",
            "It is inside A but outside C",
            "Insuring it is unlawful",
            "It is bundled into the freight rate"
          ],
            answer:0,
            why:"War and strikes risks are carved out and bought back, and the war cover can be cancelled at very short notice or re-rated when a region deteriorates. So the cost of routing through a tense area can change between fixing the vessel and sailing — a real exposure, not a theoretical one." },
          { type:"numeric",
            prompt:"A cargo is insured for $2,400,000 with a 1% franchise. A claim of $31,000 is presented. What does the insurer pay?",
            answer:31000,
            unit:"$",
            tolerance:0,
            why:"The franchise is 1% of 2,400,000, so 24,000. The claim clears that threshold, so the insurer pays 31,000 in full rather than the difference. A franchise is a threshold; a deductible is a subtraction. Confusing the two misprices every claim you try to forecast." }
        ]
      },
      {
        id: "u5l12",
        title: "General average",
        goal: "When part of the venture is sacrificed to save the rest, everyone contributes — including the owner of undamaged cargo.",
        exercises: [
          { type:"choice",
            prompt:"What is general average?",
            options:[
            "A deliberate sacrifice or extraordinary expense made to save the common venture, shared by all interests in proportion to value",
            "Damage split equally between shipowner and charterer",
            "The average of freight rates over a period",
            "A customary discount on damaged cargo"
          ],
            answer:0,
            why:"It is a rule older than marine insurance itself: if jettisoning your cargo saves the ship and everyone else’s goods, it would be unjust for you alone to bear the loss. The cost is spread across ship, cargo and freight by value, and it applies even when nobody was at fault." },
          { type:"choice",
            prompt:"Which of these is a general average act?",
            options:[
            "Jettisoning part of the cargo to refloat a grounded vessel",
            "Cargo wetted by rain during loading",
            "A parcel stolen at the terminal",
            "Slow steaming to save bunkers"
          ],
            answer:0,
            why:"The test is deliberate sacrifice for the common safety. Rain is accidental, theft is a peril, slow steaming is a commercial choice. Only the jettison is a decision to lose something on purpose so that the rest survives." },
          { type:"numeric",
            prompt:"General average is declared. The vessel is valued at $40,000,000 and the cargo at $10,000,000. The total allowance is $2,500,000. What do cargo interests contribute?",
            answer:500000,
            unit:"$",
            tolerance:0,
            why:"Cargo is 10,000,000 of a 50,000,000 venture, so it carries a fifth of the bill: 2,500,000 / 5 = 500,000. Contribution follows the value saved rather than fault, which is how a high-value cargo on a modest ship ends up paying most of it." },
          { type:"choice",
            prompt:"Before your cargo is released after a general average declaration, what is normally demanded?",
            options:[
            "A general average bond from you and a guarantee from your cargo underwriter",
            "Immediate cash payment of the final contribution",
            "Nothing — release is automatic once the vessel is safe",
            "A freshly issued bill of lading"
          ],
            answer:0,
            why:"The adjustment takes months and sometimes years, so security is taken up front. Properly insured, the underwriter provides the guarantee and the process is routine. Uninsured or under-insured, you post cash and your working capital sits in someone else’s account until the adjuster finishes." },
          { type:"choice",
            prompt:"Why does general average matter commercially even when your cargo is undamaged?",
            options:[
            "You contribute in proportion to value anyway, and the goods are held until security is given",
            "It does not — undamaged cargo is exempt",
            "Only the shipowner contributes",
            "Underwriters routinely refuse these claims"
          ],
            answer:0,
            why:"This is the surprise for anyone meeting it for the first time. Your cargo arrived in perfect condition, and you are still asked for money and for security before you can have it. The delay, rather than the contribution, is usually what kills the onward sale." }
        ]
      },
      {
        id: "u5l13",
        title: "Making a claim",
        goal: "A claim is won at the load port and at outturn, with documents — not on the day you write to underwriters.",
        exercises: [
          { type:"order",
            prompt:"Put the steps of a cargo claim in order",
            items:[
            "Note the damage and protect the goods from further loss",
            "Give notice to the carrier within the contractual time limit",
            "Appoint a surveyor to establish cause and extent",
            "Assemble the documents: B/L, invoice, survey report, packing list",
            "Submit the claim to underwriters"
          ],
            why:"The first two steps decide the outcome. Minimising the loss is a duty under most policies, and a late notice to the carrier can extinguish the recovery from the party who actually caused the damage." },
          { type:"choice",
            prompt:"Why does the survey matter so much?",
            options:[
            "It establishes cause and extent while the evidence still exists",
            "It sets the value of the goods",
            "It replaces the bill of lading",
            "Customs will not clear the cargo without it"
          ],
            answer:0,
            why:"Cause decides who pays, and whether the peril was covered at all. Once a cargo is discharged, blended or sold on, the evidence is gone and the claim becomes an argument between two accounts of events — which the party holding the money tends to win." },
          { type:"numeric",
            prompt:"A cargo insured for $1,500,000 arrives with 8% of the quantity damaged beyond use. The policy carries a 0.5% deductible on the insured value. What is the recovery?",
            answer:112500,
            unit:"$",
            tolerance:0,
            why:"The loss is 8% of 1,500,000, so 120,000, and the deductible is 7,500. That leaves 120,000 − 7,500 = 112,500. Unlike a franchise, a deductible bites on every claim, so a policy with many small claims quietly becomes worse value than it looks." },
          { type:"choice",
            prompt:"Carrier liability under the Hague-Visby Rules is limited by package or by weight. What does that mean for a bulk cargo claim?",
            options:[
            "Your recovery from the carrier may fall far below the actual loss, which is precisely why cargo insurance exists",
            "The carrier always pays the full invoice value",
            "Limits apply only to containerised cargo",
            "You have no claim against the carrier at all"
          ],
            answer:0,
            why:"The limit is per package or per kilo, whichever gives the higher figure, and for a valuable cargo it usually falls well short. Insurance is not a duplicate of the carrier’s liability — it is the layer that covers the gap the limitation leaves behind." },
          { type:"choice",
            prompt:"What is subrogation?",
            options:[
            "Having paid you, the insurer takes over your rights to recover from whoever caused the loss",
            "A discount on next year’s premium after a clean record",
            "Splitting one claim between two insurers",
            "The insurer’s right to cancel cover after a claim"
          ],
            answer:0,
            why:"It explains why underwriters care about your time bars and protective letters even after they have paid. Prejudice the recovery — by settling with the carrier, or by letting a notice period lapse — and the insurer can reduce its payment by the amount you destroyed." }
        ]
      },
      {
        id: "u5l14",
        title: "Insuring the right value",
        goal: "The sum insured is a commercial decision. Set it too low and you have self-insured by accident.",
        exercises: [
          { type:"choice",
            prompt:"Cargo is conventionally insured at CIF value plus 10%. Why the extra 10%?",
            options:[
            "A customary allowance for the buyer’s expected profit and incidental costs",
            "It covers the insurance premium itself",
            "It is a regulatory minimum",
            "It is the deductible in disguise"
          ],
            answer:0,
            why:"The convention is old and pragmatic: a total loss costs the buyer more than the invoice, because the trade also loses its margin and the costs already committed. The figure is a habit rather than a calculation, so on a high-margin trade it may well be too little." },
          { type:"numeric",
            prompt:"A cargo has a CIF value of $3,200,000 and is insured at CIF plus 10%. What is the sum insured?",
            answer:3520000,
            unit:"$",
            tolerance:0,
            why:"3,200,000 × 1.1 = 3,520,000. The extra 320,000 is not padding: it stands for the margin and the committed costs that disappear along with the goods." },
          { type:"choice",
            prompt:"You insure a cargo for 80% of its value to save premium. It suffers a partial loss of $100,000. What is likely to happen?",
            options:[
            "Average applies: you recover only the insured proportion, so you carry part of every loss",
            "You recover the full 100,000",
            "The cover is void from inception",
            "The shortfall is recovered automatically from the carrier"
          ],
            answer:0,
            why:"Under-insurance makes you a co-insurer for the missing share on every claim, not only on a total loss. Saving a fifth of the premium in order to carry a fifth of every loss is a poor trade unless you have priced it deliberately." },
          { type:"choice",
            prompt:"Which risk is NOT transferred by a cargo policy?",
            options:["A counterparty refusing to pay for goods that arrived in good order","Fire on board","Jettison in heavy weather","Theft in transit"],
            answer:0,
            why:"Cargo insurance is property cover. A buyer who will not pay is a credit event, and it needs credit insurance or a letter of credit instead. Traders occasionally discover this distinction at the worst possible moment." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["Cargo insurance pays","for damage to the goods","credit protection pays","when the buyer does not"],
            distractors:["for a fall in the price","when the vessel is late"],
            why:"Two different failures and two different products. Neither one covers the other, and a working desk needs both." }
        ]
      },
      {
        id: "u5l15",
        title: "When cover fails",
        goal: "Most uninsured losses were never uninsurable. They fell through a gap somebody could have closed.",
        exercises: [
          { type:"choice",
            prompt:"A cargo is delayed three weeks by a machinery breakdown and the buyer rejects it as late. Is that a cargo insurance loss?",
            options:["No — delay and loss of market are standard exclusions","Yes, delay is always covered","Yes, once the delay passes two weeks","Only under Clauses C"],
            answer:0,
            why:"Delay is excluded even when it was caused by a peril the policy covers. The commercial answer lives in the sale contract — a laycan, a cancellation clause, a price adjustment — not in the policy. Traders reach for the policy because it feels like the safety net, and it is the wrong net." },
          { type:"choice",
            prompt:"The vessel’s classification lapses mid-voyage. What is the risk to your cover?",
            options:[
            "A classification clause can suspend cover, because you warranted the vessel met a standard",
            "None — that is the owner’s problem",
            "Only the freight is affected",
            "The policy silently drops to Clauses C"
          ],
            answer:0,
            why:"This is why vetting the vessel is a cargo-side job and not only the owner’s. A cheap fixture on a substandard ship saves a few thousand in freight and can leave a multi-million dollar cargo effectively uninsured." },
          { type:"choice",
            prompt:"Why should a trader read the transit clause carefully?",
            options:[
            "It defines when cover starts and ends, and storage outside those limits may be uninsured",
            "It sets the premium rate",
            "It lists the permitted ports of call",
            "It names the appointed surveyor"
          ],
            answer:0,
            why:"Cover typically runs warehouse to warehouse, but it ends after a fixed period at destination, or when the goods go into storage for reasons other than the ordinary course of transit. A cargo sitting in a terminal while you look for a buyer has often stepped quietly outside the policy." },
          { type:"numeric",
            prompt:"You insure a shipment worth $4,000,000 at a rate of 0.045%. What is the premium?",
            answer:1800,
            unit:"$",
            tolerance:0,
            why:"A rate of 0.045% applied to 4,000,000 gives 1,800. Set that against the deductible you were tempted to raise and the under-insurance you were tempted to accept: cargo cover is among the cheapest lines in the whole trade, and a strange place to economise." },
          { type:"choice",
            prompt:"What single habit prevents most insurance disputes?",
            options:[
            "Checking that the assured, the transit limits and the sum insured match the actual trade before the cargo moves",
            "Always buying the widest cover available",
            "Using the same broker every time",
            "Placing the cover after loading, when the details are known"
          ],
            answer:0,
            why:"Almost every uncovered loss traces back to one of those three fields being wrong: the wrong name, the wrong period, the wrong amount. They take ten minutes to check, and they are checked far less often than they should be." }
        ]
      }
    ]
  },
  {
    id: "u6",
    title: "Sustainability, Business Ethics & Human Rights",
    subtitle: "The licence to operate, priced into the cargo",
    scene: "sustainability",
    lessons: [
      {
        id: "u6l1",
        title: "Carbon became a cost line",
        goal: "An emissions allowance is a cost like freight. Someone in the chain buys it, and the contract decides who.",
        exercises: [
          { type:"choice",
            prompt:"What is an EU ETS allowance?",
            options:[
            "A permit to emit one tonne of CO₂ equivalent, surrendered against verified emissions",
            "A subsidy paid to clean producers",
            "A tax invoiced by the port",
            "A certificate proving a cargo is carbon neutral"
          ],
            answer:0,
            why:"One allowance, one tonne. The system caps how many exist and lets the price find its own level, so emitting is not forbidden — it is priced. For a desk that turns carbon into a cost line to be estimated, hedged and passed on, exactly like freight." },
          { type:"numeric",
            prompt:"A voyage between two EU ports emits 8,000 t CO₂e. From 2026 the EU ETS covers 100% of emissions on intra-EU voyages. Allowances trade at €75. What is the allowance cost?",
            answer:600000,
            unit:"€",
            tolerance:0,
            why:"8,000 × 75 = 600,000. The phase-in is over: 40% in 2024, 70% in 2025, full coverage from 2026. There is no discount left to soften the number." },
          { type:"numeric",
            prompt:"A voyage from an EU port to a non-EU port emits 12,000 t CO₂e. The EU ETS covers half the emissions on voyages with one leg outside the EU. Allowances are €70. What is the allowance cost?",
            answer:420000,
            unit:"€",
            tolerance:0,
            why:"Only half the tonnage is covered, so 6,000 × 70 = 420,000. This is why the same cargo can carry a very different carbon bill depending on where the other end of the voyage sits, and why routing is now a commercial decision and not only an operational one." },
          { type:"pairs",
            prompt:"Match the voyage to its EU ETS coverage",
            pairs:[["EU port to EU port","All of the emissions"],["EU port to non-EU port","Half of the emissions"],["Lying at berth in an EU port","All of the emissions"]],
            why:"The geography of the voyage sets the bill. Note that time at berth counts in full: a vessel waiting on demurrage is burning allowances as well as your money." },
          { type:"choice",
            prompt:"Who has the legal obligation to surrender allowances for a voyage?",
            options:[
            "The shipping company, though the charter usually decides who ultimately pays",
            "The charterer, always",
            "The cargo owner, always",
            "The port authority"
          ],
            answer:0,
            why:"The regulated entity is the shipping company, but a time charter passes the cost on through an ETS clause. Read the clause before assuming: it is one of the newer places where a trade quietly loses money." }
        ]
      },
      {
        id: "u6l2",
        title: "CBAM",
        goal: "CBAM prices the carbon embedded in imported goods, so an EU producer paying for emissions is not undercut.",
        exercises: [
          { type:"choice",
            prompt:"What does CBAM put a price on?",
            options:[
            "The emissions embedded in producing imported goods such as steel, aluminium, cement and fertiliser",
            "The fuel burned by the vessel that carried them",
            "The profit made on the import",
            "The packaging and handling"
          ],
            answer:0,
            why:"CBAM looks through the product to the factory. It asks what was emitted in making the goods, wherever that happened, and charges the importer the gap against what an EU producer would have paid. Freight emissions are a separate regime with separate arithmetic." },
          { type:"numeric",
            prompt:"You import 1,000 t of steel with embedded emissions of 1.8 t CO₂e per tonne. A CBAM certificate costs €80. Ignoring free allocation, what is the CBAM cost?",
            answer:144000,
            unit:"€",
            tolerance:0,
            why:"The tonnage is not the emissions. 1,000 × 1.8 = 1,800 t of embedded CO₂e, and 1,800 × 80 = 144,000. At €144 on every tonne of steel this stopped being a rounding error in the landed cost." },
          { type:"choice",
            prompt:"Over a year you import 40 t of CBAM-covered goods in total. What does the de minimis threshold mean for you?",
            options:[
            "You fall under the annual 50 t threshold and are exempt",
            "You pay half the certificate cost",
            "The threshold is per shipment, so it does not help",
            "Thresholds apply only to electricity"
          ],
            answer:0,
            why:"The 2025 simplification replaced the old value test with a single mass threshold of 50 tonnes a year, added across all CBAM goods. It exempts roughly nine importers in ten while still capturing about 99% of the embedded emissions, because the tonnage sits with a few large buyers. Hydrogen and electricity stay outside the exemption." },
          { type:"choice",
            prompt:"The CBAM definitive period began on 1 January 2026. When does the sale of CBAM certificates start?",
            options:["1 February 2027","1 January 2026, at the same time","It started in 2023 with the reporting phase","Never — CBAM is a reporting obligation only"],
            answer:0,
            why:"Obligation and payment were deliberately separated. The definitive regime runs from 2026 but certificate sales were postponed to February 2027, so the first cash leaves in 2027 for goods imported in 2026. Accrue the liability in the year it arises, not the year it is paid, or a good 2026 will be followed by a puzzling 2027." },
          { type:"order",
            prompt:"Put the CBAM steps in the order they happen",
            items:[
            "Obtain authorised CBAM declarant status",
            "Collect verified embedded emissions data from the producer",
            "Import the goods",
            "File the annual CBAM declaration",
            "Surrender certificates for the declared emissions"
          ],
            why:"The second step is the one a trader controls least, and it decides the cost. A producer who cannot document its emissions makes its own goods dearer to import, because the fallback default values are set high on purpose." }
        ]
      },
      {
        id: "u6l3",
        title: "Carbon in the freight",
        goal: "Shipping carries its own emissions cost, and the charter party decides who absorbs it.",
        exercises: [
          { type:"choice",
            prompt:"What does FuelEU Maritime regulate?",
            options:[
            "The greenhouse gas intensity of the energy used on board, measured well-to-wake",
            "The total CO₂ a ship may emit in a year",
            "The sulphur content of the fuel",
            "The service speed of the vessel"
          ],
            answer:0,
            why:"Intensity, not volume: grams of CO₂ equivalent per megajoule of energy used. It counts the emissions from producing the fuel as well as burning it, which is why a fuel that looks clean at the funnel can still fail the test." },
          { type:"numeric",
            prompt:"FuelEU takes the 2020 fleet average of 91.16 gCO₂e/MJ as its baseline and required a 2% reduction from 2025. What is the 2025 target intensity?",
            answer:89.34,
            unit:"gCO₂e/MJ",
            tolerance:0.02,
            why:"Cutting 2% from 91.16 leaves 89.34. The first step is deliberately small; the schedule tightens to 6% by 2030 and 80% by 2050. The point of the early years is to build the measurement discipline before the numbers start to hurt." },
          { type:"choice",
            prompt:"Outside emission control areas, what is the global sulphur limit for marine fuel?",
            options:["0.50% m/m","3.50% m/m","0.10% m/m","There is no global limit"],
            answer:0,
            why:"0.50% outside the control areas and 0.10% inside them. The cap is about air quality rather than climate, but it reshaped the fuel market: it created the spread between compliant and high-sulphur fuel, and that spread is the whole scrubber business case." },
          { type:"numeric",
            prompt:"A vessel burns 30 t/day for 12 days. Compliant fuel is $620/t and high-sulphur fuel is $480/t. How much more does the voyage cost on compliant fuel?",
            answer:50400,
            unit:"$",
            tolerance:0,
            why:"360 t are burned over the voyage, at a spread of 620 − 480 = 140, so 360 × 140 = 50,400. That figure is the scrubber case in one line: the investment pays only if the spread holds long enough to cover the capital and the cargo space given up." },
          { type:"choice",
            prompt:"The IMO Net-Zero Framework would price shipping emissions globally. What happened to its adoption?",
            options:[
            "Adoption was adjourned in October 2025 for a year, with talks due to resume in late 2026",
            "It entered into force during 2025",
            "It was rejected permanently",
            "It applies only to EU-flagged vessels"
          ],
            answer:0,
            why:"Delegates voted 57 to 49 to adjourn rather than adopt. The lesson for a trader is not the politics but the planning: a global carbon price on shipping is a live possibility with an uncertain date, so a long charter signed today should already say who carries the cost if it arrives." }
        ]
      },
      {
        id: "u6l4",
        title: "Certified fuels",
        goal: "A biofuel is worth its premium only if the paperwork behind it survives an audit.",
        exercises: [
          { type:"choice",
            prompt:"What does a certification scheme such as ISCC EU actually prove about a biofuel?",
            options:[
            "That it meets the sustainability and emissions-saving criteria of the EU renewable energy rules, along an audited chain of custody",
            "That it burns more cleanly in the engine",
            "That it was produced inside the EU",
            "That its price is regulated"
          ],
            answer:0,
            why:"The molecule is often indistinguishable from a conventional one. What creates the value is the certificate and the unbroken chain of custody behind it. In this market the documents are the commodity." },
          { type:"choice",
            prompt:"Under a mass balance system, what must be true when you withdraw certified material from a mixed tank?",
            options:[
            "The certified quantity taken out cannot exceed the certified quantity put in",
            "The tank must hold only certified material",
            "Every molecule must be traceable to a single farm",
            "Certification spreads to the whole tank once certified material enters"
          ],
            answer:0,
            why:"Mass balance is an accounting rule, not a physical one. It accepts that liquids mix and controls the books instead — which is exactly why the bookkeeping is audited so hard, and why a break in it destroys the premium on volume you have already sold." },
          { type:"numeric",
            prompt:"You buy 5,000 t of certified biodiesel at a $95/t premium over the conventional grade. An audit later invalidates the certification on 1,200 t. What premium do you lose?",
            answer:114000,
            unit:"$",
            tolerance:0,
            why:"1,200 × 95 = 114,000. The volume is still sellable as conventional product, so what is lost is the premium rather than the cargo — but the premium was the entire reason for doing the trade." },
          { type:"choice",
            prompt:"RED III had a transposition deadline of 21 May 2025. Why does a transposition date matter commercially?",
            options:[
            "A directive bites through national law, so obligations can differ by member state until every country has transposed it",
            "It fixes the price of biofuels",
            "It is the date certificates expire",
            "It applies only to electricity"
          ],
            answer:0,
            why:"A directive is not directly applicable: each member state writes it into its own law. Several had not transposed well into 2026 and a few were expected only in 2027, so the same cargo can meet different obligations depending on where it lands. That gap is a trading opportunity and a compliance trap at once." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["In certified biofuels","the premium is paid","for the chain of custody","not for the molecule"],
            distractors:["for the calorific value","by the refinery"],
            why:"Hold on to this one. It explains why an audit failure is a financial event rather than a technical one, and why counterparties in this market are chosen for the quality of their paperwork." }
        ]
      },
      {
        id: "u6l5",
        title: "Deforestation and traceability",
        goal: "EUDR pushes the burden of proof onto the buyer: no geolocation, no import.",
        exercises: [
          { type:"choice",
            prompt:"EUDR covers soy, palm oil, cocoa, coffee, cattle, rubber and wood. What must an operator show before placing them on the EU market?",
            options:[
            "That the goods are deforestation-free and legally produced, with a due diligence statement carrying plot geolocation",
            "Only that the supplier holds a certificate",
            "Only the country of origin",
            "Only that the goods shipped after 2020"
          ],
            answer:0,
            why:"Three conditions, all of them required. Geolocation is the demanding one: plot coordinates, not a country name. It pushes traceability all the way back to the farm and quietly reshapes who you are able to buy from." },
          { type:"choice",
            prompt:"When does EUDR start applying to large and medium operators?",
            options:["30 December 2026","30 December 2024, as originally written","30 June 2027","It already applies to everyone"],
            answer:0,
            why:"Twice postponed. Large and medium operators face 30 December 2026, small and micro operators get until 30 June 2027. The delays were about readiness and IT systems rather than a change of direction: supply chains that cannot produce coordinates are being rebuilt now, not later." },
          { type:"pairs",
            prompt:"Match each EUDR requirement to what it demands",
            pairs:[["Deforestation-free","No forest converted on that plot after the cut-off date"],["Legality","Compliance with the producing country’s own laws"],["Due diligence statement","A filed declaration with plot coordinates, carrying liability"]],
            why:"The third is the one that changes behaviour. Filing the statement makes the operator accountable for the accuracy of what the supplier claimed, so supplier due diligence stops being a formality." },
          { type:"choice",
            prompt:"A long-standing cocoa supplier cannot provide plot-level coordinates. What is the realistic consequence?",
            options:[
            "That volume cannot be placed on the EU market, so it must be redirected or the supplier replaced",
            "A fine, after which trade continues as before",
            "Nothing, as long as the supplier is certified",
            "You can self-declare on the supplier’s behalf"
          ],
            answer:0,
            why:"This is the part that gets underestimated. EUDR does not fine you into compliance, it closes a market to the volume. The risk is not a penalty but a cargo you cannot sell where you meant to, and a relationship you may have to end." },
          { type:"numeric",
            prompt:"You have contracted 8,000 t of cocoa for the EU. 2,500 t comes from smallholders with no plot data. Redirecting that volume to a non-EU buyer costs $210/t in lost value. What does the traceability gap cost?",
            answer:525000,
            unit:"$",
            tolerance:0,
            why:"2,500 × 210 = 525,000. Notice what is being priced: not a fine, but the discount you accept to sell material into a market that wants it less. Traceability work done a year early is cheap next to this." }
        ]
      },
      {
        id: "u6l6",
        title: "Putting carbon in the price",
        goal: "Carbon costs belong in the landed cost before you quote, not in the post-mortem afterwards.",
        exercises: [
          { type:"numeric",
            prompt:"A cargo shows a gross margin of $180,000. The freight carries an EU ETS cost of $95,000 and the goods carry a CBAM cost of $64,000. What is the margin after carbon?",
            answer:21000,
            unit:"$",
            tolerance:0,
            why:"180,000 − 95,000 − 64,000 = 21,000. Two carbon lines removed almost 90% of the margin. Neither was optional, and neither appears anywhere in the quoted price of the commodity itself." },
          { type:"choice",
            prompt:"When should a carbon cost be estimated?",
            options:[
            "Before quoting, as part of the landed cost",
            "After the voyage, when the invoice arrives",
            "At year-end, with the accounts",
            "Only if the counterparty raises it"
          ],
            answer:0,
            why:"An allowance price moves like any other market. Quoting first and discovering the carbon bill later is the same mistake as quoting before checking the freight — and it is being made regularly, because the cost is new enough that nobody has the habit yet." },
          { type:"choice",
            prompt:"Your buyer refuses a carbon cost clause in the contract. What does that actually mean?",
            options:[
            "You keep the risk that allowance prices rise between pricing and delivery",
            "The cost goes away",
            "The regulator will invoice the buyer directly",
            "Nothing, because carbon costs are fixed"
          ],
            answer:0,
            why:"Someone always holds the exposure. Refusing the clause does not remove the cost, it decides that you carry the movement in it. That is a position, and it should be sized and hedged rather than taken by accident." },
          { type:"pairs",
            prompt:"Match each regime to what it charges for",
            pairs:[["EU ETS","Emissions from the voyage"],["CBAM","Emissions embedded in producing the goods"],["FuelEU Maritime","The intensity of the energy used on board"]],
            why:"Three regimes, three different questions, and all three can apply to one cargo at the same time. Confusing them is the quickest route to double-counting a cost or missing one entirely." },
          { type:"choice",
            prompt:"What has changed most for a physical trader because of the carbon regimes?",
            options:[
            "Compliance data from suppliers and vessels is now a commercial input, not paperwork filed afterwards",
            "Regulators now set commodity prices",
            "Physical trading is no longer profitable",
            "Only EU-registered companies are affected"
          ],
            answer:0,
            why:"The emissions figure of a plant, the fuel intensity of a vessel, the coordinates of a farm: these now decide what you can buy, what it lands at, and who will take it from you. A desk that gathers this data early chooses its counterparties. One that does not takes whatever is left." }
        ]
      },
      {
        id: "u6l7",
        title: "Human rights in the supply chain",
        goal: "Due diligence is a process you can evidence, not a certificate you can buy.",
        exercises: [
          { type:"order",
            prompt:"Put the steps of supply-chain due diligence in order",
            items:[
            "Map the chain and identify where the risk sits",
            "Assess the severity and likelihood of harm",
            "Act to prevent or mitigate it",
            "Track whether the action worked",
            "Report, and remediate where harm occurred"
          ],
            why:"The sequence matters because each step depends on the one before it: you cannot mitigate a risk you have not located, and you cannot claim to have mitigated it without tracking the result. Buyers are increasingly asked to evidence all five." },
          { type:"choice",
            prompt:"A supplier audit that finds nothing proves…",
            options:[
            "That the supply chain is clean",
            "That nothing was found on that site, on that day, in what the auditor could see",
            "That no further work is needed",
            "That the buyer has no liability"
          ],
            answer:1,
            why:"Announced audits of first-tier sites miss the places where the worst harm usually sits: labour brokers, subcontracted transport and informal production upstream. Treating a clean report as an answer is the most common failure in this area." },
          { type:"pairs",
            prompt:"Match each risk to a control that actually addresses it",
            pairs:[["Forced labour via recruitment fees","Employer-pays verification down to the labour broker"],["Child labour in smallholder production","Household-level monitoring and school-attendance data"],["Unsafe artisanal mining in the chain","Traceability to mine site, plus a formalisation programme"]],
            why:"Generic codes of conduct do not touch these risks; each needs a control aimed at the mechanism that creates it. Matching control to mechanism is what separates real due diligence from paperwork." },
          { type:"choice",
            prompt:"Why is walking away from a high-risk supplier not automatically the ethical choice?",
            options:[
            "Because it costs margin",
            "Because disengaging can remove the leverage to fix the harm and can worsen conditions for the workers",
            "Because contracts forbid it",
            "Because auditors advise against it"
          ],
            answer:1,
            why:"Responsible exit is sometimes right, but the guidance is to use leverage to improve conditions first and to disengage in a way that does not simply move the harm out of sight. The decision has to be documented either way." },
          { type:"choice",
            prompt:"Where does human-rights due diligence show up in the cost of a trade?",
            options:[
            "It does not; it is a compliance overhead",
            "In sourcing choices, verification costs and the premium paid for chains that can be evidenced",
            "Only in insurance",
            "Only in the annual report"
          ],
            answer:1,
            why:"Chains that can be documented cost more to build and command a premium to sell, exactly like a certified fuel or a traceable bean. Treating it as an overhead rather than as part of the landed cost is how it gets cut first and litigated later." }
        ]
      },
      {
        id: "u6l8",
        title: "Sanctions",
        goal: "Sanctions are a gate you pass before the commercial conversation, not a form you file after it.",
        exercises: [
          { type:"choice",
            prompt:"A counterparty offers a cargo at a price clearly better than the market. What is the correct first step?",
            options:[
            "Screen the counterparty, the vessel and the cargo origin before discussing terms",
            "Agree the price, then check",
            "Ask for a bank guarantee",
            "Check the freight"
          ],
            answer:0,
            why:"An unusually good price usually has an unusually good reason, and the most expensive reasons are the ones screening finds. Compliance is a gate before the deal, not a formality after it." },
          { type:"choice",
            prompt:"An entity is not on any sanctions list, but is 60% owned by someone who is. Can you trade with it?",
            options:[
            "No — ownership by a designated person generally makes the entity blocked too",
            "Yes, only the named entity is blocked",
            "Yes, if the cargo is not sanctioned",
            "Yes, with a disclaimer"
          ],
            answer:0,
            why:"US rules treat an entity 50% or more owned by blocked persons as blocked itself, whether or not it is named. The EU applies an ownership-or-control test. Screening the name on the contract is not enough — you have to look through it." },
          { type:"choice",
            prompt:"You are a European trader dealing in US dollars with a party subject to US sanctions. Why does US law reach you?",
            options:[
            "Dollar payments clear through the US financial system, which creates a US nexus",
            "It does not reach non-US companies",
            "Only if the cargo touches a US port",
            "Only if you have a US office"
          ],
            answer:0,
            why:"This is the one that catches European desks. The currency of settlement can pull a trade between two non-US parties into US jurisdiction. It is also why some counterparties suddenly ask to be paid in euros." },
          { type:"choice",
            prompt:"Which of these is a vessel-level red flag rather than a counterparty one?",
            options:[
            "A gap in AIS transmission around a known transfer area",
            "A newly incorporated buyer",
            "A price above the market",
            "A request for longer payment terms"
          ],
            answer:0,
            why:"Sanctions compliance now covers the ship as much as the seller: AIS gaps, ship-to-ship transfers in certain waters, repeated flag and name changes, and opaque ownership are all screened before a vessel is accepted." },
          { type:"choice",
            prompt:"You screened the counterparty at contract signature. The cargo is now at sea. What still has to happen?",
            options:[
            "Re-screening, because designations can be added while the cargo is in transit",
            "Nothing, the check is done",
            "Only a quality inspection",
            "Only a credit review"
          ],
            answer:0,
            why:"A designation mid-voyage turns a legitimate cargo into a problem you already own. Screening is a repeated control, not a one-off at the start." }
        ]
      },
      {
        id: "u6l9",
        title: "Know your counterparty",
        goal: "The name on the contract is rarely the whole answer to who you are dealing with.",
        exercises: [
          { type:"choice",
            prompt:"What does \"beneficial ownership\" mean?",
            options:[
            "The natural person who ultimately owns or controls the entity, behind any chain of companies",
            "The company named in the contract",
            "The bank financing the trade",
            "The registered office"
          ],
            answer:0,
            why:"Both sanctions and credit follow control, not the name on the letterhead. A clean-looking entity can be controlled by someone you may not trade with, or by someone with nothing behind them." },
          { type:"choice",
            prompt:"Your counterparty is a two-year-old company with minimal capital, part of a large group. What do you ask for?",
            options:[
            "A parent company guarantee, so your claim reaches a balance sheet that can pay",
            "Nothing, the group name is enough",
            "A larger cargo",
            "A shorter voyage"
          ],
            answer:0,
            why:"Many trading counterparties are deliberately thin entities. Who stands behind them is the real credit question, and it has to be documented before the trade, not argued after a default." },
          { type:"choice",
            prompt:"Payment for your cargo arrives from a company that is not your buyer. What is the concern?",
            options:[
            "Third-party payment obscures the source of funds and can break your sanctions and money-laundering controls",
            "Nothing, the money arrived",
            "Only the bank charges",
            "Only the exchange rate"
          ],
            answer:0,
            why:"Being paid is not the same as being paid properly. Accepting funds from an unexplained third party can make you the point where dirty money enters a legitimate chain." },
          { type:"pairs",
            prompt:"Match each check to what it is trying to establish",
            pairs:[["Sanctions screening","Whether you are allowed to deal with them at all"],["Beneficial ownership","Who actually controls the entity"],["Credit assessment","Whether they can pay"],["Parent guarantee","Who pays if they cannot"]],
            why:"Four different questions, often confused into one. Passing a sanctions check says nothing about whether the counterparty is solvent, and a strong balance sheet says nothing about whether you may trade with them." },
          { type:"choice",
            prompt:"When should the compliance check happen relative to the commercial negotiation?",
            options:["Before it — a deal you cannot execute is worse than no deal","After the price is agreed","Only at payment","Only if the counterparty is new"],
            answer:0,
            why:"Screening after agreement means either walking away from a signed deal or executing something you should not. Doing it first costs an hour; doing it last can cost the company." }
        ]
      },
      {
        id: "u6l10",
        title: "Documentary fraud",
        goal: "In physical trading the documents are the cargo — so the documents are what gets faked.",
        exercises: [
          { type:"choice",
            prompt:"The same cargo is pledged as security to two different banks. Why is this possible at all?",
            options:[
            "Because lenders finance against documents, and a document can be duplicated or forged",
            "Because cargoes are never inspected",
            "Because banks do not take security",
            "Because freight is unregulated"
          ],
            answer:0,
            why:"Double financing has been behind some of the largest collapses in the business. Lending against paper works only if the paper is verified independently of the person presenting it." },
          { type:"choice",
            prompt:"You hold a warehouse receipt for metal you have financed. What is the control that actually protects you?",
            options:[
            "Verifying the stock directly with the warehouse, independently of your counterparty",
            "Trusting the receipt, since it is an original",
            "Asking the counterparty to confirm",
            "Insuring the price"
          ],
            answer:0,
            why:"Warehouse receipt fraud works because everyone checks the paper and nobody checks the shed. Verification has to come from a party with no interest in the answer." },
          { type:"choice",
            prompt:"In 2023 a major trader took a loss of about $577 million on containers that were documented as high-grade nickel and turned out to hold rubble and low-value metal. What failed?",
            options:["Verification of what was actually in the containers, not the price view","The hedge","The freight market","The letter of credit rate"],
            answer:0,
            why:"The Trafigura case is worth knowing precisely because nothing about the market went wrong. The cargo was not the cargo, and the documents said it was. Independent inspection at the right point is the only defence." },
          { type:"order",
            prompt:"Order the checks that make a cargo hard to fake",
            items:[
            "Screen and verify who the counterparty actually is",
            "Appoint an inspector you chose, not one they proposed",
            "Verify quantity and quality at loading",
            "Confirm the goods independently with the warehouse or carrier",
            "Match the documents against what was verified"
          ],
            why:"Notice that every step is verification by someone with no stake in the outcome. Fraud survives wherever one party supplies both the goods and the proof of the goods." },
          { type:"choice",
            prompt:"Your counterparty insists on appointing the inspector and resists a second opinion. How should you read that?",
            options:[
            "As a red flag serious enough to stop, whatever the price",
            "As normal cost-saving",
            "As a quality guarantee",
            "As irrelevant if the certificate is final"
          ],
            answer:0,
            why:"Control of the inspection is control of the evidence. A counterparty who will not let you verify is telling you something about what verification would find." }
        ]
      },
      {
        id: "u6l11",
        title: "Red flags and when to stop",
        goal: "Most compliance failures are not sophisticated. They are signals that somebody decided not to slow down.",
        exercises: [
          { type:"pairs",
            prompt:"Match each signal to what it usually means",
            pairs:[["Price far off the market","Something is wrong with the cargo, the title or the seller"],["Pressure to sign before checks finish","You are the one being screened out"],["Routing that makes no commercial sense","The cargo is being disguised, not delivered"],["Payment from an unrelated third party","The source of funds is being hidden"]],
            why:"None of these is subtle. They fail as controls only because someone under pressure decides to interpret them charitably." },
          { type:"choice",
            prompt:"A long-standing counterparty asks you to change the discharge port at short notice to a place with no obvious buyer. What do you do?",
            options:[
            "Stop and re-screen the trade, including the new destination",
            "Agree, since they are a long-standing client",
            "Charge a fee and proceed",
            "Ask the shipowner to decide"
          ],
            answer:0,
            why:"A good history is not a control. Diversion is one of the standard ways a legitimate trade is turned into a sanctioned one, and the relationship is exactly what is being used." },
          { type:"choice",
            prompt:"Compliance says a trade cannot proceed. The margin is the best of the quarter. What is the correct action?",
            options:["The trade does not happen","Escalate until someone approves it","Restructure it so the checks do not apply","Proceed and document the concern"],
            answer:0,
            why:"This is the whole point of an independent control. A gate that opens when the number is large enough is not a gate, and \"restructuring so the checks do not apply\" is the description of an offence." },
          { type:"choice",
            prompt:"Why is sanctions exposure different in kind from a bad trade?",
            options:[
            "It can end the company and reach individuals personally, and it cannot be priced or hedged",
            "It is only a fine",
            "It is covered by insurance",
            "It affects only the buyer"
          ],
            answer:0,
            why:"A trading loss is a number. A sanctions breach can cost banking relationships, licences and liberty. It is the one exposure on a desk that has no hedge and no acceptable size." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["Compliance","is","a","gate","before","the","trade","not","a","file","after","it"],
            distractors:["margin","freight","optional"],
            why:"If you remember one line from this unit, this is the one. Everything else follows from doing the checks in the right order." }
        ]
      }
    ]
  },
  {
    id: "u7",
    title: "Information Technologies and Innovations",
    subtitle: "The systems the trade actually runs on",
    scene: "tech",
    lessons: [
      {
        id: "u7l1",
        title: "The trade lifecycle in software",
        goal: "A CTRM system is the desk’s single record of what it owns, owes and is exposed to.",
        exercises: [
          { type:"order",
            prompt:"Put the trade lifecycle as a system records it in order",
            items:[
            "Capture the deal",
            "Confirm it with the counterparty",
            "Schedule the cargo and the vessel",
            "Value the position and report the risk",
            "Invoice, settle and close"
          ],
            why:"Every later step reads what the earlier one wrote, so a deal captured wrongly is mis-scheduled, mis-valued and mis-invoiced in turn. This is why capture discipline matters more than any reporting feature." },
          { type:"choice",
            prompt:"What is the main purpose of a CTRM or ETRM system?",
            options:[
            "To predict prices",
            "To hold one authoritative record of positions, logistics and exposure across the desk",
            "To replace the back office",
            "To connect to exchanges"
          ],
            answer:1,
            why:"Traders, operators, risk and finance all need to be looking at the same book. Without one authoritative record each function builds its own spreadsheet, and the differences between them are discovered during a crisis." },
          { type:"choice",
            prompt:"A desk runs its position in spreadsheets. The characteristic failure is…",
            options:["Slow calculation","No single version of the truth, and no audit trail of who changed what","Inability to hedge","Missing market data"],
            answer:1,
            why:"Spreadsheets are excellent for thinking and dangerous as systems of record: they fork silently, and the version used to report risk is rarely the one used to trade. Most published trading losses involve one somewhere in the chain." },
          { type:"pairs",
            prompt:"Match each function to what it needs from the system",
            pairs:[["Trading","A live net position by grade and month"],["Operations","Vessel, laycan and document status per cargo"],["Finance","Accruals, invoices and the cash it can expect"]],
            why:"One dataset, three very different views. Systems fail commercially when they serve one of these audiences well and force the other two back into their own files." },
          { type:"choice",
            prompt:"Why is straight-through processing worth paying for?",
            options:[
            "It reduces re-keying, and re-keying is where quantities, dates and counterparties get corrupted",
            "It makes trades cheaper to execute",
            "It removes the need for confirmations",
            "It replaces the risk function"
          ],
            answer:0,
            why:"Every manual re-entry between systems is a chance to change a tonnage or a laycan by accident, and those errors surface as claims and demurrage weeks later. Automation here pays back in operational losses avoided, not in headcount." }
        ]
      },
      {
        id: "u7l2",
        title: "Market data and the curve",
        goal: "A position is only as good as the prices used to value it, and those prices come from somewhere.",
        exercises: [
          { type:"choice",
            prompt:"To value a physical position you need…",
            options:["A single spot price","A forward curve, because different tonnes price against different months","Yesterday’s settlement","The purchase price"],
            answer:1,
            why:"Cargoes price against different quotational periods, so valuing a book means applying a curve, not a number. Using spot for everything systematically misstates the value of anything not pricing today." },
          { type:"pairs",
            prompt:"Match each price source to what it is",
            pairs:[["Exchange settlement","A cleared, published closing price for a listed contract"],["Price reporting agency assessment","A published judgement of the physical market from surveyed deals"],["Broker indication","One intermediary’s view of where business could be done"]],
            why:"These three carry very different weight in a contract and in an audit. Writing \"market price\" without saying which of them you mean is how pricing disputes begin." },
          { type:"choice",
            prompt:"Why does a desk keep a record of the exact prices used to value the book each day?",
            options:[
            "For the auditors only",
            "Because the valuation must be reproducible: a result that cannot be re-derived cannot be defended",
            "To speed up reporting",
            "Because prices are copyrighted"
          ],
            answer:1,
            why:"Independent price verification exists so that the marks in the accounts are not the trader’s own opinion. If the source and the timestamp are not stored, the P&L is an assertion rather than a measurement." },
          { type:"choice",
            prompt:"An illiquid forward month has no published price. The honest approach is…",
            options:[
            "Use the nearest liquid month unadjusted",
            "Interpolate or extrapolate with a stated, consistent method and disclose it",
            "Leave the position unvalued",
            "Use the trade price"
          ],
            answer:1,
            why:"Every book has corners where no price exists, and the danger is not the estimate but the freedom to change the estimate when it is convenient. A documented, unchanging method is what makes the mark credible." },
          { type:"choice",
            prompt:"What is the operational risk of one bad price in a data feed?",
            options:[
            "A single wrong report",
            "It propagates into valuation, risk limits, margin calls and possibly a hedging decision",
            "Nothing, feeds are checked",
            "Only the archive is affected"
          ],
            answer:1,
            why:"Prices are inputs to everything downstream, so a single corrupted value can trigger a limit breach or a hedge that should never have been placed. Feed validation is a trading control, not an IT chore." }
        ]
      },
      {
        id: "u7l3",
        title: "The electronic bill of lading",
        goal: "Digitising the document of title requires law, not just software.",
        exercises: [
          { type:"choice",
            prompt:"What makes an electronic bill of lading legally difficult?",
            options:[
            "File formats vary",
            "Title has to pass by transferring a unique thing, and a digital record can be copied",
            "Ships have no internet",
            "Banks refuse email"
          ],
            answer:1,
            why:"A paper bill works because there is one original and possession means something. An electronic system has to reproduce exclusive control by law and by platform rules, which is why legislation such as the MLETR framework matters more than the technology." },
          { type:"choice",
            prompt:"The commercial prize from an electronic bill of lading is…",
            options:["Lower printing costs","Removing the delay of couriering documents, which shortens the financed period","Better cargo tracking","Fewer inspections"],
            answer:1,
            why:"On short voyages the paperwork can arrive after the ship, forcing letters of indemnity and delaying payment. Instant transfer removes days of financing and a whole class of operational risk." },
          { type:"choice",
            prompt:"A letter of indemnity is issued when…",
            options:["The cargo is damaged","The original bill of lading is not available at discharge","The vessel is late","The buyer disputes quality"],
            answer:1,
            why:"It asks the carrier to release the cargo without the document, against a promise to cover the consequences. It is routine and it is also an uninsured exposure, which is precisely what digital title is meant to eliminate." },
          { type:"order",
            prompt:"Put the transfer of an electronic bill in order",
            items:[
            "Carrier issues the record to the shipper on the platform",
            "Shipper endorses it to the trader",
            "Trader endorses it to the buyer’s bank",
            "Bank releases it to the buyer",
            "Buyer presents it to take delivery"
          ],
            why:"The chain mirrors the paper one exactly, which is the point: the legal effect has to be identical or the banks and P&I clubs will not accept it. Understanding the chain is what lets you spot where a platform breaks it." },
          { type:"choice",
            prompt:"Why has adoption been slower than the benefit suggests?",
            options:[
            "The technology is immature",
            "Every party in the chain — carrier, banks, insurers, ports, customs — has to accept the same system and the same law",
            "It is more expensive",
            "Regulators forbid it"
          ],
            answer:1,
            why:"A document of title is only useful if everyone downstream will honour it, so the constraint is network adoption and legal recognition in each jurisdiction on the route, not software quality." }
        ]
      },
      {
        id: "u7l4",
        title: "Distributed ledgers and tokenised trade",
        goal: "Judge a digitisation project by which reconciliation it removes, not by its architecture.",
        exercises: [
          { type:"choice",
            prompt:"What problem does a shared ledger genuinely solve in trade?",
            options:["Price forecasting","Multiple parties keeping separate records of the same cargo and reconciling them by email","Freight cost","Quality disputes"],
            answer:1,
            why:"The expensive part of trade documentation is that six organisations each hold their own version of the truth. A shared record removes the reconciliation, which is a real saving and a much narrower claim than most pitches make." },
          { type:"choice",
            prompt:"A platform records a cargo on a ledger but the parties still exchange paper for payment. The saving is…",
            options:["Large, because the data is now shared","Small, because the constraint was the legal document, not the data","Zero","Unmeasurable"],
            answer:1,
            why:"Digitising information alongside an unchanged paper process adds a system rather than replacing one. The test of any such project is whether a document, a signature or a reconciliation actually disappeared." },
          { type:"choice",
            prompt:"Tokenising a receivable means…",
            options:[
            "Insuring it",
            "Representing it as a transferable digital instrument so it can be funded or sold in parts",
            "Converting it to a letter of credit",
            "Hedging it"
          ],
            answer:1,
            why:"The aim is to widen the pool of funders for short-term trade assets beyond the relationship banks. The commercial questions are the same as ever: who checks the underlying trade, and who takes the loss if it was never real." },
          { type:"choice",
            prompt:"The most common failure of a consortium platform in this industry is…",
            options:[
            "Technical scalability",
            "Not enough of the industry joins, so participants keep the old process in parallel",
            "Regulatory prohibition",
            "Cost of computation"
          ],
            answer:1,
            why:"These networks are worth using only when nearly everyone in a route is on them, and several well-funded ventures have closed for exactly this reason. Adoption, not code, is the risk to underwrite." },
          { type:"pairs",
            prompt:"Match each claim to the question that tests it",
            pairs:[["\"It removes fraud\"","Who verifies that what was written to the ledger was true?"],["\"It is instant\"","Which legal step still has to happen off-platform?"],["\"It cuts cost\"","Which reconciliation or document has actually disappeared?"]],
            why:"Each of these questions has sunk a real project. Asking them early is the cheapest form of due diligence available on a digitisation proposal." }
        ]
      },
      {
        id: "u7l5",
        title: "Automation, models and cyber risk",
        goal: "Automation moves risk rather than removing it, and the desk is a payments target.",
        exercises: [
          { type:"choice",
            prompt:"The most common cyber loss in commodity trading is…",
            options:["Encryption of the trading system","Payment fraud: an instruction to pay a changed bank account","Theft of price data","Cargo tracking outages"],
            answer:1,
            why:"Invoice and mandate fraud needs no technical breach, only a convincing email at the moment a large payment is due. It is why bank details are verified by a call-back to a known number and never changed on the strength of a message." },
          { type:"choice",
            prompt:"An automated model sizes hedges from a live position feed. The new risk created is…",
            options:["Slower execution","A wrong input or a stale feed now produces trades, not just wrong reports","Higher brokerage","Loss of audit trail"],
            answer:1,
            why:"Once a model can act, a data error becomes a position. This is why automated hedging carries hard limits, sanity checks on inputs and a manual kill switch, none of which are optional extras." },
          { type:"choice",
            prompt:"When a model output disagrees strongly with the trader’s judgement, the right response is…",
            options:[
            "Follow the model, it is objective",
            "Follow the trader, models are approximations",
            "Stop and find which input explains the gap before acting",
            "Average the two"
          ],
            answer:2,
            why:"A large disagreement is information: usually one of the two is working from something wrong. Resolving the input rather than choosing a side is how model risk is actually managed on a desk." },
          { type:"choice",
            prompt:"Why is a signed record of who changed a limit or a price source a trading control?",
            options:[
            "For regulatory filing",
            "Because unlogged changes let a loss be reclassified after the fact",
            "It speeds up reporting",
            "It is required by auditors only"
          ],
            answer:1,
            why:"Almost every large rogue-trading loss involved altering a mark, a limit or a confirmation without a trace. Immutable logs are the cheapest defence, and they protect the honest desk as much as they catch the dishonest one." },
          { type:"order",
            prompt:"Put the response to a suspected fraudulent payment instruction in order",
            items:[
            "Stop the payment",
            "Verify the details by call-back on a previously known number",
            "Tell treasury and compliance",
            "Check whether other pending payments were touched",
            "Report and preserve the evidence"
          ],
            why:"Speed matters because a payment can sometimes be recalled within hours and almost never after days. Having the order agreed in advance is what makes that speed possible." }
        ]
      }
    ]
  },

  /* ── Core Trading Path · Part II ────────────────────────── */
  {
    id: "u8",
    title: "Commodity Price Mechanisms",
    subtitle: "How a cargo actually gets a price",
    scene: "pricing",
    lessons: [
      {
        id: "u8l1",
        title: "Benchmark and premium",
        goal: "Physical prices are quoted against a benchmark, plus or minus a differential.",
        exercises: [
          { type:"choice",
            prompt:"A physical copper cargo is usually priced as…",
            options:["A number agreed from scratch","The exchange price plus or minus a differential","Whatever the buyer offers","Cost of production plus a margin"],
            answer:1,
            why:"Almost nothing in physical is priced from scratch. You agree a benchmark — LME, CBOT, Platts, Brent — then negotiate the differential around it." },
          { type:"choice",
            prompt:"The exchange price is $9,500/t. You agree \"LME cash + $120\". What do you get per tonne?",
            options:["$120","$9,380","$9,620","$9,500"],
            answer:2,
            why:"9,500 + 120 = $9,620. The premium pays for location, form, quality and the service of delivering where the buyer needs it." },
          { type:"choice",
            prompt:"What does a physical premium mostly compensate you for?",
            options:["Guessing the market right","Getting the metal to that place, in that shape, at that time","The exchange fee","Buyer credit risk"],
            answer:1,
            why:"The premium is the price of place, form and time. It is the part a trader can influence — the flat price belongs to the market." },
          { type:"pairs",
            prompt:"Match each term to what it is",
            pairs:[["Benchmark","The reference price everyone quotes against"],["Differential","The plus or minus you negotiate"],["Basis","The gap between local physical and benchmark"]],
            why:"Traders live on the differential. The benchmark moves for everyone; the differential is where skill shows." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["A physical price is","a benchmark","plus or minus","a differential"],
            distractors:["a forecast","a fixed number"],
            why:"Once you read every quote as a benchmark plus a differential, physical pricing stops being mysterious: the benchmark is the market’s number and the differential is the only part you negotiate." }
        ]
      },
      {
        id: "u8l2",
        title: "Who sets the benchmark",
        goal: "Most physical benchmarks are assessments published by an agency, not prices traded on an exchange.",
        exercises: [
          { type:"choice",
            prompt:"A price reporting agency assessment is…",
            options:[
            "An exchange settlement",
            "A published judgement of the physical market, built from reported deals, bids and offers",
            "An average of futures",
            "A government statistic"
          ],
            answer:1,
            why:"Assessors observe the market inside a defined window and publish where they judge business was doable. Contracts worth billions reference those numbers, which is why the methodology document is a commercial document." },
          { type:"choice",
            prompt:"Why does the assessment window matter to a trader?",
            options:[
            "It sets the deadline for reporting deals",
            "Business done inside the window influences the published number your cargo prices against",
            "It decides settlement date",
            "It sets the tolerance"
          ],
            answer:1,
            why:"If your cargo prices off a window, then trades executed inside that window move your own invoice. This is the whole reason window activity is watched, regulated and occasionally litigated." },
          { type:"pairs",
            prompt:"Match each benchmark type to how it is formed",
            pairs:[["Exchange contract","Continuous trading on a central order book, cleared"],["Agency assessment","Judgement from surveyed deals within a published window"],["Formula price","A published index plus a contractual differential"]],
            why:"The three carry different transparency, different disputes and different manipulation risks. Knowing which one you have written into a contract tells you what evidence you would need if the number is challenged." },
          { type:"choice",
            prompt:"Your contract references an index that stops being published. What protects you?",
            options:["Nothing, the contract fails","A fallback pricing clause naming a substitute or a mechanism to agree one","Force majeure","The exchange"],
            answer:1,
            why:"Indices are discontinued and methodologies change, and a contract with no fallback leaves two parties with a live cargo and no price. A fallback clause is one line that prevents an arbitration." },
          { type:"choice",
            prompt:"Why do physical markets rely on assessments rather than exchanges?",
            options:[
            "Assessments are cheaper",
            "Most physical grades and locations are too illiquid to support a continuously traded contract",
            "Exchanges are closed to traders",
            "Assessments are more accurate"
          ],
            answer:1,
            why:"A specific grade delivered at a specific port may see a few cargoes a month, which cannot sustain an order book. The assessment exists to give illiquid physical business a reference it could not generate on its own." }
        ]
      },
      {
        id: "u8l3",
        title: "The quotational period",
        goal: "The QP decides which days set your price — and it is worth money.",
        exercises: [
          { type:"choice",
            prompt:"What is a quotational period (QP)?",
            options:["How long the buyer has to pay","The window whose prices set the cargo price","The life of the contract","Time the ship is at berth"],
            answer:1,
            why:"The QP is the pricing window: an average of a month, the month of arrival, or a single date declared inside a range." },
          { type:"choice",
            prompt:"You sell on \"month of arrival average\" QP and the cargo arrives in March. Which prices set your sale?",
            options:["The price the day you signed","The average of March","The price on arrival day","The February average"],
            answer:1,
            why:"All of March averages out. This is one common convention — quotational periods run anywhere from M-1 to M+4 depending on the trade — and it is why hedging an averaged QP with one futures date leaves a mismatch." },
          { type:"choice",
            prompt:"Your buyer chooses the pricing date inside the QP. Who holds the valuable option?",
            options:["You","The buyer","The bank","Nobody"],
            answer:1,
            why:"The buyer will pick the date that suits them, not you. You are short an option — charge for it or you have given away money." },
          { type:"numeric",
            prompt:"A cargo prices on the March average of $9,600/t. You bought at $9,400/t. On 500 t, what is the gross margin?",
            answer:100000,
            unit:"$",
            tolerance:0,
            why:"(9,600 − 9,400) × 500 = $100,000. You chose neither price: the QP did. That is why a QP is negotiated, not accepted." },
          { type:"choice",
            prompt:"Why do traders care so much which QP is agreed?",
            options:["It is a formality","It moves the price and the risk, and one side always gains","It sets the freight","Banks require one"],
            answer:1,
            why:"A QP is a distribution of outcomes, not a detail. Agreeing one without pricing it is a common way juniors lose money." }
        ]
      },
      {
        id: "u8l4",
        title: "Basis: the trader edge",
        goal: "Basis is the gap between local physical and the benchmark — and it moves.",
        exercises: [
          { type:"choice",
            prompt:"Basis is the difference between…",
            options:["Two futures months","The local physical price and the benchmark","Bid and offer","Cost and sale price"],
            answer:1,
            why:"Rotterdam aluminium does not trade at exactly the LME price. That gap — location, quality, availability — is the basis." },
          { type:"choice",
            prompt:"Shanghai copper trades $30/t below the benchmark. That basis is…",
            options:["Positive","Negative","Zero","Impossible"],
            answer:1,
            why:"A discount to the benchmark is a negative basis: locally there is more metal than buyers want, right now." },
          { type:"choice",
            prompt:"You are perfectly hedged on flat price. Can basis still hurt you?",
            options:["No, a hedge covers everything","Yes — the hedge tracks the benchmark, not your local price","Only in contango","Only in agriculture"],
            answer:1,
            why:"This is the most important idea in this desk. The hedge follows the benchmark; your cargo is priced locally. When they diverge you lose money on a hedged trade." },
          { type:"pairs",
            prompt:"What makes a local basis move?",
            pairs:[["Local shortage","Basis strengthens"],["Congestion at origin","Basis strengthens at destination"],["A flood of imports arriving","Basis weakens"]],
            why:"Basis is supply and demand you can see: ships, warehouses, plants. That is why physical traders travel." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["A hedge removes","flat price risk","but it leaves","basis risk"],
            distractors:["all risk","credit risk"],
            why:"Say this in an interview and you are already ahead of most candidates, because it separates the shape of the curve from the decision it implies: carry is worth holding only when the market pays more than storage and finance cost." }
        ]
      },
      {
        id: "u8l5",
        title: "Contango and backwardation",
        goal: "The shape of the curve tells you whether to hold inventory.",
        exercises: [
          { type:"choice",
            prompt:"Forward prices are higher than spot. This market is in…",
            options:["Backwardation","Contango","Equilibrium","Default"],
            answer:1,
            why:"Contango: the future is worth more than today. The market is paying you to hold the goods and deliver later." },
          { type:"choice",
            prompt:"Forward prices are below spot. What is the market telling you?",
            options:["There is plenty of material","Material is tight right now","Freight is expensive","Nothing useful"],
            answer:1,
            why:"Backwardation means people want it now and will pay a premium for prompt delivery. Holding inventory costs you." },
          { type:"numeric",
            prompt:"Spot $9,500/t, six months forward $9,700/t. Storage, insurance and finance cost $150/t. Profit per tonne on the carry?",
            answer:50,
            unit:"$",
            tolerance:0,
            why:"(9,700 − 9,500) − 150 = $50/t. Contango only pays if it is wider than your cost of carry. That comparison is the whole trade." },
          { type:"choice",
            prompt:"Contango is $80/t and your cost of carry is $150/t. What should you do?",
            options:["Store it anyway","Do not store it — you would lose $70/t","Buy more","Sell the futures"],
            answer:1,
            why:"Storing destroys value here. Knowing your own carry cost is what lets you answer instantly." },
          { type:"order",
            prompt:"Order these from tightest market to most oversupplied",
            items:["Steep backwardation","Mild backwardation","Flat curve","Steep contango"],
            why:"The curve is a live read on physical tightness. Learn to glance at it before anything else." }
        ]
      },
      {
        id: "u8l6",
        title: "Netbacks and the delivered-cost ladder",
        goal: "A netback works backwards from the value at destination to what you can afford to pay at origin.",
        exercises: [
          { type:"choice",
            prompt:"A netback price is…",
            options:[
            "The price at the destination",
            "The destination value minus every cost of getting there, giving the maximum payable at origin",
            "The origin price plus freight",
            "An average of both ends"
          ],
            answer:1,
            why:"It reverses the usual arithmetic: start from what the buyer will pay, strip out freight, insurance, duty and finance, and what remains is your ceiling at the load port. Bidding above it is buying a loss." },
          { type:"numeric",
            prompt:"Delivered value is $625/t. Freight is $38/t, insurance $2/t, duty $12/t and finance $5/t. What is the netback at the load port?",
            answer:568,
            unit:"$/t",
            tolerance:0,
            why:"Strip the costs from the destination value: 625 − 38 − 2 − 12 − 5 = 568 $/t. Any purchase price above 568 loses money before the desk has taken a single view on the market." },
          { type:"numeric",
            prompt:"A second origin can be bought at $551/t but freight from there is $58/t, with the same $2/t insurance, $12/t duty and $5/t finance. What is its landed cost per tonne?",
            answer:628,
            unit:"$/t",
            tolerance:0,
            why:"Landed cost is 551 + 58 + 2 + 12 + 5 = 628 $/t, above the 625 the destination pays. The cheaper cargo is the worse trade, which is the single most useful thing a netback tells you." },
          { type:"order",
            prompt:"Order the steps of building a netback",
            items:[
            "Establish the delivered value at the destination",
            "Deduct freight for the vessel that fits the parcel",
            "Deduct insurance, duty and inspection",
            "Deduct the financing cost of the voyage and the credit period",
            "Compare the result with the price actually offered at origin"
          ],
            why:"Doing it in this order stops you anchoring on the origin offer, which is the mistake the sequence exists to prevent. The offer is the last thing you look at, not the first." },
          { type:"choice",
            prompt:"Two origins show the same netback. What decides between them?",
            options:[
            "Whichever is closer",
            "Risk and optionality: transit time, quality reliability, counterparty and how easily the cargo can be re-directed",
            "The larger parcel",
            "The older relationship"
          ],
            answer:1,
            why:"When the arithmetic ties, the trade is decided by what can go wrong and by how much freedom you keep. A shorter voyage with a redirectable cargo is worth real money that never appears in the netback line." }
        ]
      }
    ]
  },
  {
    id: "u9",
    title: "Hedging Tools & Techniques",
    subtitle: "Protecting the margin without sinking the desk",
    scene: "hedging",
    lessons: [
      {
        id: "u9l1",
        title: "Futures, clearing and margin",
        goal: "A futures contract is a standardised promise, and the clearing house makes it safe by taking cash daily.",
        exercises: [
          { type:"choice",
            prompt:"What does a clearing house do in a futures trade?",
            options:["Finds the counterparty","Steps between the two sides so neither carries the other’s credit risk","Sets the price","Delivers the commodity"],
            answer:1,
            why:"Novation replaces your counterparty with the clearing house, which is why you can trade with an unknown name on screen. The price of that safety is margin, posted in cash, every day." },
          { type:"pairs",
            prompt:"Match each element of a futures contract to what it fixes",
            pairs:[["Contract size","How many tonnes or barrels one lot represents"],["Delivery month","When the obligation matures"],["Deliverable grade and point","What and where would satisfy delivery"]],
            why:"Standardisation is what creates liquidity, and it is also the source of basis risk: your cargo is never exactly the contract. Knowing which of the three does not match your physical tells you what the hedge leaves uncovered." },
          { type:"numeric",
            prompt:"One contract is 1,000 barrels. You need to hedge 47,000 barrels. How many lots do you sell?",
            answer:47,
            unit:"lots",
            tolerance:0,
            why:"47,000 divided by 1,000 gives 47 lots exactly. When the division is not clean you have to choose to over-hedge or under-hedge by up to one lot, and that residue is a position someone must own deliberately." },
          { type:"choice",
            prompt:"Initial margin and variation margin differ in that…",
            options:[
            "Initial margin is a deposit against future moves; variation margin settles today’s move in cash",
            "They are the same thing",
            "Only initial margin is returned",
            "Variation margin is charged annually"
          ],
            answer:0,
            why:"The deposit sizes the risk of the position; the daily settlement pays for what already happened. Confusing the two is how a desk budgets for the first and is destroyed by the second." },
          { type:"choice",
            prompt:"Why can a hedge that is right still require cash you do not have?",
            options:[
            "Because brokerage is charged upfront",
            "Because the paper leg settles daily while the physical leg pays at delivery",
            "Because margins are unpredictable",
            "Because clearing houses charge interest"
          ],
            answer:1,
            why:"The two legs offset economically but not in time: losses on the hedge are due now and the compensating gain on the cargo arrives later. Liquidity for that gap is part of the hedging decision, not an afterthought." }
        ]
      },
      {
        id: "u9l2",
        title: "Why hedge at all",
        goal: "A trader locks the margin instead of betting on direction.",
        exercises: [
          { type:"choice",
            prompt:"You buy a cargo today and sell it in six weeks. What are you exposed to?",
            options:["Nothing","The price falling before you sell","The price rising","Only freight"],
            answer:1,
            why:"You are long physical. If the price falls before your sale is priced, your margin evaporates even though you did nothing wrong commercially." },
          { type:"choice",
            prompt:"To hedge a long physical position you…",
            options:["Buy futures","Sell futures","Buy more cargo","Do nothing"],
            answer:1,
            why:"You are long the goods, so you go short paper. If the price falls, the physical loses and the futures gain. The margin survives." },
          { type:"choice",
            prompt:"What is a trader actually selling, once hedged?",
            options:["A view on price","The service of sourcing, moving and delivering","Storage","Insurance"],
            answer:1,
            why:"Hedging strips out the price bet and leaves the business: sourcing, logistics, financing, execution. That is what a merchant is paid for." },
          { type:"numeric",
            prompt:"Copper falls $200/t. You hold 500 t hedged 100%. Roughly what is the net flat-price impact?",
            answer:0,
            unit:"$",
            tolerance:0,
            why:"The net impact is about 0. The cargo loses $100,000 and the short futures gain about $100,000, so they offset. That is the point of a hedge: it removes the direction of the price from the result and leaves you the margin you built." }
        ]
      },
      {
        id: "u9l3",
        title: "Hedge ratio",
        goal: "How much to hedge, and what you keep when you hedge less.",
        exercises: [
          { type:"choice",
            prompt:"A 60% hedge ratio means…",
            options:["You are 60% likely to profit","60% of the tonnage is protected, 40% is exposed","You hedge for 60 days","You pay 60% margin"],
            answer:1,
            why:"The unhedged 40% is a position on price. It might be a view — or an accident, which is worse." },
          { type:"numeric",
            prompt:"You hold 500 t hedged at 80%. The price falls $200/t. What is your net loss?",
            answer:20000,
            unit:"$",
            tolerance:0,
            why:"The unhedged 20% is 100 t. 100 × 200 = $20,000. Every point of hedge you skip is a position you are choosing to hold." },
          { type:"choice",
            prompt:"When is running an unhedged position defensible?",
            options:["Never","When it is a deliberate, sized, approved view","When you are short of cash","When the market is calm"],
            answer:1,
            why:"The problem is not risk, it is unintended risk. A desk that knows exactly what it is long, and why, is doing its job." },
          { type:"choice",
            prompt:"You cannot afford the margin for a full hedge. What is the honest reading?",
            options:["Hedge less and hope","The cargo is too big for your balance sheet","Borrow more, always","Ignore the hedge"],
            answer:1,
            why:"If you can only fund the trade by carrying price risk you did not intend, the trade is too large for you. Size is a risk decision." }
        ]
      },
      {
        id: "u9l4",
        title: "Variation margin — the trap",
        goal: "A perfect hedge can still bankrupt you.",
        exercises: [
          { type:"choice",
            prompt:"You are short futures as a hedge. The price rises sharply. What happens?",
            options:["You profit immediately","You must post cash on the futures loss","Nothing until delivery","The exchange waits"],
            answer:1,
            why:"Variation margin settles daily. Your paper leg loses and you pay cash today, while the physical gain only arrives at settlement." },
          { type:"choice",
            prompt:"Your cargo is worth more, your hedge is losing, and you have no cash. What is this?",
            options:["A pricing problem","A liquidity problem","A credit problem","Not a problem"],
            answer:1,
            why:"This is how well-hedged companies fail. The trade is profitable on paper and dead in cash. Liquidity and price risk are different risks." },
          { type:"order",
            prompt:"Order what happens when the market moves against your hedge",
            items:["Price rises","Futures position loses value","Exchange calls for variation margin","You post cash the same day"],
            why:"Notice the physical gain is not on this list — it arrives at the end. That timing gap is the whole danger." },
          { type:"numeric",
            prompt:"You are short 500 t of futures. The price rises $300/t. How much variation margin must you find?",
            answer:150000,
            unit:"$",
            tolerance:0,
            why:"500 × 300 = $150,000, payable now. Your cargo is worth $150,000 more, but nobody pays you for that until it settles." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["A hedge protects","the margin","but it does not protect","the cash position"],
            distractors:["the reputation","the freight rate"],
            why:"Keep this one. It separates people who have hedged from people who have read about hedging." }
        ]
      },
      {
        id: "u9l5",
        title: "When the hedge does not fit",
        goal: "Timing mismatches, wrong benchmarks and imperfect proxies.",
        exercises: [
          { type:"choice",
            prompt:"You hedge a March-average QP by selling futures on one day in February. What have you created?",
            options:["A perfect hedge","A timing mismatch — basis risk","A freight position","Nothing unusual"],
            answer:1,
            why:"Your sale prices across all of March; your hedge priced on a single February day. The difference is yours to keep or lose." },
          { type:"choice",
            prompt:"There is no futures contract for your exact grade. What do you do?",
            options:["Do not hedge","Hedge with the closest liquid contract and accept the residual","Wait for one to be listed","Hedge with the currency"],
            answer:1,
            why:"That is a proxy hedge. It removes most of the risk and leaves the difference between your grade and the benchmark — smaller, and known." },
          { type:"pairs",
            prompt:"Match the mismatch to what it leaves behind",
            pairs:[["Different pricing dates","Timing basis"],["Different location","Location basis"],["Different grade","Quality basis"]],
            why:"Every hedge is imperfect somewhere. A good trader knows exactly which residual they are holding." },
          { type:"choice",
            prompt:"Your cargo is priced in dollars but sold in euros. What else needs hedging?",
            options:["Nothing","The currency","The freight","The insurance"],
            answer:1,
            why:"Unhedged FX turns a commodity trade into a currency bet. Same principle: hedge what you are not paid to take." }
        ]
      },
      {
        id: "u9l6",
        title: "Swaps, EFPs and what stays over the counter",
        goal: "Not every hedge is a listed future, and the choice changes credit, cash and flexibility.",
        exercises: [
          { type:"choice",
            prompt:"A commodity swap lets you…",
            options:["Take delivery of a cargo","Exchange a floating index price for a fixed price over a period, in cash","Borrow against inventory","Insure a cargo"],
            answer:1,
            why:"A swap fixes an average price without any delivery obligation, which is why it fits a physical contract priced off a monthly index far better than a single futures month does." },
          { type:"pairs",
            prompt:"Match each instrument to the job it does best",
            pairs:[["Exchange-traded future","Liquid, cleared cover for a benchmark grade"],["Swap on a published index","Fixing an average against a formula-priced cargo"],["Exchange of futures for physical","Turning a futures hedge into the physical cargo with an agreed differential"]],
            why:"Choosing the wrong instrument is a quiet, permanent tax on the hedge: you pay in basis risk, in margin, or in bilateral credit. Matching the instrument to the pricing of the physical is most of the skill." },
          { type:"choice",
            prompt:"The main disadvantage of an over-the-counter hedge versus a cleared one is…",
            options:[
            "It cannot be customised",
            "You carry the bank’s credit risk and it carries yours, and the position is harder to exit",
            "It settles more slowly",
            "It has no price"
          ],
            answer:1,
            why:"Bilateral trades can be shaped exactly to the cargo, which is their value, but the exit is a negotiation with the same counterparty rather than a click. Credit lines and unwind cost are the price of that tailoring." },
          { type:"choice",
            prompt:"An exchange of futures for physical is used when…",
            options:[
            "You want to close a futures position and price a cargo against the same market at once",
            "Margin is too high",
            "The contract is illiquid",
            "Delivery has failed"
          ],
            answer:0,
            why:"It converts a paper hedge into a physical trade at an agreed differential, so the hedge is lifted and the cargo priced in one step rather than two exposures in sequence. It is a routine tool wherever a liquid contract sits behind the physical." },
          { type:"choice",
            prompt:"Why does the choice of hedging instrument affect the desk’s cash planning?",
            options:[
            "It does not; hedges are cash-neutral",
            "Cleared instruments demand daily variation margin, while many bilateral ones settle only at maturity",
            "Because brokers require prepayment",
            "Because banks charge for confirmations"
          ],
            answer:1,
            why:"The same economic hedge can be free of daily cash or ruinously demanding of it, depending on where it is booked. Treasury has to be in the conversation before the instrument is chosen, not after the first margin call." }
        ]
      }
    ]
  },
  {
    id: "u10",
    title: "Options",
    subtitle: "Paying for the right to change your mind",
    scene: "options",
    lessons: [
      {
        id: "u10l1",
        title: "Calls and puts",
        goal: "An option is a right without an obligation, and someone has to be paid to grant it.",
        exercises: [
          { type:"choice",
            prompt:"Buying a put option gives you…",
            options:["An obligation to sell at the strike","The right, not the obligation, to sell at the strike","A guaranteed profit","The right to buy at the strike"],
            answer:1,
            why:"The buyer chooses whether to use it, which is what makes it an insurance policy rather than a position. That choice is exactly what the premium pays for, and it is why a put cannot lose more than the premium." },
          { type:"pairs",
            prompt:"Match each party to what they hold",
            pairs:[["Buyer of a call","The right to buy at a fixed price, for a premium paid"],["Seller of a call","An obligation to sell if exercised, for a premium received"],["Buyer of a put","The right to sell at a fixed price, for a premium paid"]],
            why:"Rights are bought and obligations are sold, and only one side of each pair has a choice. Every structure later in this unit is built by combining these three positions." },
          { type:"numeric",
            prompt:"You hold a put with a strike of $620/t. At expiry the market is $585/t. What is the payoff of the option per tonne, before premium?",
            answer:35,
            unit:"$/t",
            tolerance:0,
            why:"The right to sell at 620 in a market at 585 is worth 620 − 585 = 35 $/t. If the market had been above 620 the option would simply be abandoned, and the loss would be limited to the premium already paid." },
          { type:"choice",
            prompt:"A producer who buys a put has bought…",
            options:["A floor under the selling price, keeping the upside","A fixed price","A ceiling on the price","An obligation to deliver"],
            answer:0,
            why:"That asymmetry is the reason producers pay for options rather than selling forward: the floor protects the budget while the upside stays with the mine or the farm. A future would have given away both." },
          { type:"choice",
            prompt:"Why does an option seller demand a premium?",
            options:[
            "To cover brokerage",
            "Because they take unlimited or large risk in exchange for a fixed payment",
            "Because exchanges require it",
            "Because the buyer is unknown"
          ],
            answer:1,
            why:"The seller has granted someone else the choice and kept none, so their best case is the premium and their worst case can be very large. Selling options for income is a business of collecting small sums in front of an occasional very bad day." }
        ]
      },
      {
        id: "u10l2",
        title: "Premium, intrinsic and time value",
        goal: "A premium splits into what the option is worth now and what it is worth because time remains.",
        exercises: [
          { type:"choice",
            prompt:"Intrinsic value is…",
            options:["The premium paid","What the option would pay if exercised right now","The time remaining","The volatility"],
            answer:1,
            why:"It is the immediate exercise value and nothing else, so an option can carry a substantial premium and zero intrinsic value. Confusing the two is the standard way of misjudging whether an option is expensive." },
          { type:"numeric",
            prompt:"A call has a strike of $80/bbl. The market is $87/bbl and the premium is $9/bbl. What is the time value per barrel?",
            answer:2,
            unit:"$/bbl",
            tolerance:0,
            why:"Intrinsic value is 87 − 80 = 7, so the time value is 9 − 7 = 2 $/bbl. That $2 is what you are paying for the chance of a further move, and it decays to nothing by expiry whatever the market does." },
          { type:"choice",
            prompt:"All else equal, more time to expiry makes an option…",
            options:["Cheaper","More expensive, because there is more opportunity for a favourable move","Unchanged","Impossible to price"],
            answer:1,
            why:"Optionality is the value of possible outcomes, and more time means more possible outcomes. It is also why buying protection early is dearer, and why waiting is not free either." },
          { type:"choice",
            prompt:"Higher implied volatility raises the premium because…",
            options:["Trading costs rise","A wider distribution of outcomes makes a large favourable move more likely","Interest rates rise","Liquidity falls"],
            answer:1,
            why:"The buyer profits from the tail and is protected from the other side, so wider dispersion is worth more to them. This is why hedges are most expensive at exactly the moment everyone wants them." },
          { type:"choice",
            prompt:"An out-of-the-money option approaching expiry loses value quickly. This is…",
            options:["A pricing error","Time decay: the remaining chance of finishing in the money is shrinking","A liquidity effect","A margin adjustment"],
            answer:1,
            why:"Time value is the price of possibility, and possibility runs out. A hedger should size the tenor to the exposure rather than roll short options repeatedly and pay the decay again each time." }
        ]
      },
      {
        id: "u10l3",
        title: "Delta and vega without the maths",
        goal: "Two numbers tell a physical desk most of what it needs: how much of a position the option is, and how exposed it is to volatility.",
        exercises: [
          { type:"choice",
            prompt:"Delta tells you…",
            options:[
            "How much the premium changes when volatility changes",
            "How much the option value changes for a small move in the underlying",
            "The time remaining",
            "The probability of profit"
          ],
            answer:1,
            why:"Delta converts an option into an equivalent number of tonnes or barrels, which is the only way to add it to a physical book. Without that conversion the desk cannot state a net position at all." },
          { type:"numeric",
            prompt:"You hold calls on 100,000 bbl with a delta of 0.45. What is the delta-equivalent long position, in barrels?",
            answer:45000,
            unit:"bbl",
            tolerance:0,
            why:"The position behaves like 100,000 × 0.45 = 45,000 bbl of length for small moves. Note it is only true for small moves: delta itself changes as the market goes, which is why an options book has to be re-measured constantly." },
          { type:"choice",
            prompt:"Vega measures sensitivity to…",
            options:["Time","Implied volatility","The interest rate","The strike"],
            answer:1,
            why:"A long option position gains when implied volatility rises even if the price does not move, and loses when it falls. A desk that bought protection in a panic and watched volatility subside has felt vega without naming it." },
          { type:"pairs",
            prompt:"Match each measure to the question it answers",
            pairs:[["Delta","How many tonnes is this option, right now?"],["Vega","What happens to me if implied volatility moves?"],["Time decay","What does this position cost me if nothing happens?"]],
            why:"A physical desk rarely needs more than these three to manage a simple hedging book. They answer, in order: what is my position, what is my exposure to fear, and what is my rent." },
          { type:"choice",
            prompt:"Why does a deep in-the-money option behave almost like a future?",
            options:[
            "Because its premium is small",
            "Because its delta approaches one, so it moves nearly tonne for tonne",
            "Because it has no time value",
            "Because it is always exercised"
          ],
            answer:1,
            why:"As exercise becomes near-certain the optionality is largely spent, and the instrument tracks the underlying. If you are paying for optionality you no longer have, a future would be the cheaper way to carry the same risk." }
        ]
      },
      {
        id: "u10l4",
        title: "Collars and zero-cost structures",
        goal: "You can pay for protection with the upside instead of with cash, and the trade-off is explicit.",
        exercises: [
          { type:"choice",
            prompt:"A producer’s collar is built by…",
            options:["Buying a put and selling a call","Buying a call and selling a put","Buying both a put and a call","Selling both"],
            answer:0,
            why:"The purchased put sets the floor and the sold call funds it by giving away the upside above the higher strike. The result is a price range rather than a fixed price, which is often exactly what a budget needs." },
          { type:"numeric",
            prompt:"A producer buys a $70/bbl put for $3/bbl and sells an $88/bbl call for $3/bbl. How wide is the resulting price range, in dollars per barrel?",
            answer:18,
            unit:"$/bbl",
            tolerance:0,
            why:"The range runs from the 70 floor to the 88 ceiling, so it is 88 − 70 = 18 $/bbl wide. The premiums offset, which is why this is called a zero-cost collar even though it is not cost-free: the cost is the upside above 88." },
          { type:"choice",
            prompt:"What has a zero-cost collar actually cost the producer?",
            options:["Nothing","Every dollar of price above the call strike","The put premium","A margin deposit"],
            answer:1,
            why:"The structure is free in cash and expensive in a strong market, which is precisely when the loss is most painful to explain. Calling it zero-cost is accurate accounting and misleading commercial language." },
          { type:"choice",
            prompt:"A consumer wanting a ceiling on its input price would build a collar by…",
            options:["Buying a call and selling a put","Buying a put and selling a call","Buying two calls","Selling a call only"],
            answer:0,
            why:"The consumer’s risk is upward, so it buys the cap and finances it by giving up the benefit of very low prices. Every collar is the same shape read from the other side of the trade." },
          { type:"choice",
            prompt:"What is the hidden risk of selling the call leg to fund the put?",
            options:[
            "The premium may be withdrawn",
            "If the market rallies hard, the sold call demands margin and caps the physical upside at once",
            "The put expires early",
            "The exchange may reject it"
          ],
            answer:1,
            why:"A rally turns the funding leg into a cash drain at the same time as the physical business would have been thriving. The structure is sound only if the desk has planned the liquidity for that scenario." }
        ]
      },
      {
        id: "u10l5",
        title: "When an option beats a future",
        goal: "Choose the instrument from the shape of the uncertainty, not from the view on price.",
        exercises: [
          { type:"pairs",
            prompt:"Match each situation to the better instrument",
            pairs:[["A cargo already bought and already sold","A future or swap, to lock the known volume"],["A tender you may or may not win","An option, because the exposure is conditional"],["A budget floor a producer must defend for a year","A put, keeping the upside for the shareholder"]],
            why:"A future is cheaper and simpler whenever the volume is certain; an option earns its premium whenever the volume, the timing or the need itself is uncertain. Matching the instrument to that shape is the whole decision." },
          { type:"choice",
            prompt:"Why is hedging a contingent volume with a future dangerous?",
            options:[
            "Futures are illiquid",
            "If the underlying business does not happen, the hedge becomes an outright position",
            "Margin is higher",
            "Futures cannot be closed"
          ],
            answer:1,
            why:"A hedge only hedges if there is something to hedge. Lose the tender and the sold futures are a naked short in a market you had no view on, which is how a prudent action becomes a speculative one." },
          { type:"choice",
            prompt:"The honest argument against options in a physical desk is…",
            options:[
            "They are unavailable",
            "The premium is a real, visible cost paid every period, and most periods do not need it",
            "They cannot be cleared",
            "They are unregulated"
          ],
            answer:1,
            why:"Insurance usually expires unused, and paying for it repeatedly is politically hard inside a business measured quarterly. That is a budgeting problem rather than a pricing one, and it is best settled before the volatility arrives." },
          { type:"choice",
            prompt:"A desk wants protection but cannot fund the premium. The most defensible answers are…",
            options:[
            "Trade unhedged and hope",
            "Buy less protection, choose a further strike, or fund it with a collar and accept the capped upside",
            "Sell options for income",
            "Use more leverage"
          ],
            answer:1,
            why:"All three are honest trades between cover, cost and upside, and each can be explained to a board. Selling options to pay for protection quietly converts a hedging programme into a volatility business." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["Use a future","when the volume is certain","and an option","when the exposure itself is uncertain"],
            distractors:["when you expect prices to rise","when margin is unavailable"],
            why:"This single rule settles most instrument arguments on a physical desk, and it keeps the choice about risk rather than about a market view." }
        ]
      }
    ]
  },
  {
    id: "u11",
    title: "Energy I (Oil & Gas)",
    subtitle: "The barrel, the crack and the molecule",
    scene: "oil",
    lessons: [
      {
        id: "u11l1",
        title: "The barrel and the crude grades",
        goal: "Crude is not one commodity: density and sulphur decide what a barrel is worth and to whom.",
        exercises: [
          { type:"pairs",
            prompt:"Match each crude characteristic to its commercial meaning",
            pairs:[["High API gravity","Lighter crude, yielding more of the valuable light products"],["High sulphur content","Sour crude, needing more processing and refineries able to take it"],["Low API, high sulphur","Heavy sour, typically the cheapest barrel on the curve"]],
            why:"Every crude is priced as a differential to a benchmark based on what a refinery can make from it. Quality is therefore not a technical detail but the price itself." },
          { type:"choice",
            prompt:"Why do heavy sour crudes trade at a discount to light sweet?",
            options:["They are harder to ship","They yield less high-value product and require more complex refining","They are less abundant","They are taxed more"],
            answer:1,
            why:"A simple refinery can only make low-value output from a heavy sour barrel, so only complex refineries bid competitively for it. The discount is the market paying for the processing capability the barrel demands." },
          { type:"numeric",
            prompt:"Light sweet crude is $84/bbl and a heavy sour grade trades at a discount of $7/bbl. What is the heavy sour price per barrel?",
            answer:77,
            unit:"$/bbl",
            tolerance:0,
            why:"Subtract the differential from the benchmark: 84 − 7 = 77 $/bbl. That differential is itself a traded market and it widens when complex refining capacity is scarce relative to heavy supply." },
          { type:"choice",
            prompt:"A benchmark such as a dated physical crude assessment matters because…",
            options:["It is the cheapest crude","Most other grades are priced as a differential to it","It is produced in the largest volume","Exchanges require it"],
            answer:1,
            why:"The benchmark is the reference point on which the whole differential structure hangs, so its liquidity and integrity are a systemic concern. When the underlying stream declines, the benchmark has to be redefined or it stops being usable." },
          { type:"choice",
            prompt:"Two cargoes of the same crude at the same price but different load dates are…",
            options:["The same trade","Different trades, because the time value and the freight opportunity differ","Interchangeable","Priced identically by definition"],
            answer:1,
            why:"Date is part of the specification in oil: a cargo loading in ten days and one loading in forty carry different financing, different curve exposure and different destination options. Traders quote the date as carefully as the grade." }
        ]
      },
      {
        id: "u11l2",
        title: "Refining margins and cracks",
        goal: "A refinery buys crude and sells products, so its margin is a spread you can trade.",
        exercises: [
          { type:"choice",
            prompt:"A crack spread is…",
            options:[
            "The cost of refining",
            "The difference between the value of the products and the cost of the crude",
            "A freight differential",
            "A tax on refined output"
          ],
            answer:1,
            why:"It is the refinery’s gross margin expressed as a tradable spread, which lets a refiner lock the margin without fixing either leg alone. Trading the spread rather than the outright is how the industry hedges what it actually earns." },
          { type:"numeric",
            prompt:"Using a 3-2-1 ratio: gasoline is $96/bbl, diesel $108/bbl and crude $84/bbl. What is the crack spread per barrel of crude?",
            answer:16,
            unit:"$/bbl",
            tolerance:0,
            why:"Product value is 2 × 96 + 1 × 108 = 300 against crude cost of 3 × 84 = 252, and the 48 difference over 3 barrels is 16 $/bbl. The 3-2-1 shape is a convention that roughly matches a simple refinery’s yield." },
          { type:"choice",
            prompt:"A refiner hedges by…",
            options:["Selling crude futures only","Buying crude and selling product futures, locking the spread","Buying product futures only","Selling the crack"],
            answer:1,
            why:"Hedging one leg alone leaves the refiner exposed to the spread, which is the only thing it truly earns. Locking both legs in the right ratio is what converts a volatile business into a plannable one." },
          { type:"choice",
            prompt:"A negative crack spread tells you…",
            options:["Data is wrong","Products are worth less than the crude, so running the refinery destroys value","Demand is strong","Crude is scarce"],
            answer:1,
            why:"When the spread goes negative refineries cut runs or shut down, which tightens product supply and eventually repairs the spread. Watching cracks is therefore how you anticipate product availability, not just refinery profits." },
          { type:"choice",
            prompt:"Why do crack spreads differ so much between regions?",
            options:[
            "Different accounting rules",
            "Different product demand mixes, specifications and refinery configurations",
            "Different crude densities only",
            "Exchange fees"
          ],
            answer:1,
            why:"A region that drives petrol cars and one that runs diesel trucks value the same barrel differently, and its refineries were built for that mix. The regional spread is what pulls cargoes across the world." }
        ]
      },
      {
        id: "u11l3",
        title: "Products, blending and specifications",
        goal: "A product is a specification, and blending is the business of meeting it as cheaply as possible.",
        exercises: [
          { type:"choice",
            prompt:"A product specification is…",
            options:[
            "A quality target you should aim for",
            "A set of limits the delivered product must meet to be that product at all",
            "A marketing description",
            "A customs classification"
          ],
            answer:1,
            why:"Off-spec product is not slightly worse product; it is a different, usually far cheaper commodity, and it may be undeliverable under the contract. The whole value of a blend sits on the right side of those limits." },
          { type:"pairs",
            prompt:"Match each product parameter to why it is controlled",
            pairs:[["Sulphur","Emissions rules and engine or equipment damage"],["Vapour pressure","Safety and seasonal driveability of gasoline"],["Cold flow properties","Diesel must still flow at winter temperatures"]],
            why:"Each limit exists for a physical or a regulatory reason, and several are seasonal. A blend that is legal in July can be unsaleable in January, which is why the calendar is part of a products trader’s job." },
          { type:"numeric",
            prompt:"You blend 30,000 t at 0.10% sulphur with 10,000 t at 0.50% sulphur. What is the sulphur content of the blend, as a percentage?",
            answer:0.2,
            unit:"%",
            tolerance:0.005,
            why:"Weight the components: (30,000 × 0.10 + 10,000 × 0.50) ÷ 40,000 = 0.2%. Blending arithmetic is linear for most parameters and emphatically not for a few, which is why the lab, not the spreadsheet, has the last word." },
          { type:"choice",
            prompt:"The commercial value of blending comes from…",
            options:["Increasing volume","Turning cheaper components into a product that meets a valuable specification","Reducing freight","Avoiding duty"],
            answer:1,
            why:"You are paid for the specification, so any component that gets you there for less is margin. It is also why blend components have their own markets and their own pricing logic." },
          { type:"choice",
            prompt:"You discover a delivered cargo is marginally off-spec on one parameter. The first commercial question is…",
            options:[
            "Whether to reject it",
            "Whether the contract allows a price adjustment, and what the cargo is worth in its next-best use",
            "Who is to blame",
            "Whether to insure it"
          ],
            answer:1,
            why:"Rejection is expensive for both sides, so most off-spec cargoes are settled by an agreed allowance based on the value of the alternative outlet. Knowing that alternative before you negotiate is what decides who wins the conversation." }
        ]
      },
      {
        id: "u11l4",
        title: "Natural gas, hubs and pipelines",
        goal: "Gas prices are local because gas is hard to move, and the pipeline is the market.",
        exercises: [
          { type:"choice",
            prompt:"Why can gas prices differ sharply between two hubs a few hundred kilometres apart?",
            options:[
            "Different quality",
            "Because transport capacity between them is limited, so the price gap can exceed the cost of moving it",
            "Different contracts",
            "Different currencies"
          ],
            answer:1,
            why:"Where pipeline capacity is full, no amount of price difference brings more gas, so the two hubs decouple. Congestion, not distance, is what creates gas basis." },
          { type:"numeric",
            prompt:"Hub A is $9.20/MMBtu and hub B is $11.60/MMBtu. Firm transport between them costs $1.60/MMBtu. What is the margin per MMBtu on moving gas from A to B?",
            answer:0.8,
            unit:"$/MMBtu",
            tolerance:0.01,
            why:"The spread is 11.60 − 9.20 = 2.40 and transport takes 1.60, leaving 0.80 $/MMBtu. When the spread is narrower than the tariff, capacity holders simply do not ship, which is why flows can stop while a price gap remains." },
          { type:"pairs",
            prompt:"Match each element of a gas market to its role",
            pairs:[["Hub","A location where gas is bought, sold and priced"],["Firm transport capacity","The right to move a volume between two points"],["Storage","The ability to move gas between seasons rather than places"]],
            why:"Gas trading is arbitrage in three dimensions — place, time and form — and each dimension has its own contract. A gas desk is largely a portfolio of these rights." },
          { type:"choice",
            prompt:"Why is gas demand strongly seasonal in temperate markets?",
            options:["Industrial shutdowns","Heating load in winter, which storage exists to smooth","Pipeline maintenance","Tax cycles"],
            answer:1,
            why:"Winter heating can multiply demand, and since production is comparatively steady, the difference is met from storage filled in summer. The summer-winter spread is therefore the fundamental gas trade." },
          { type:"choice",
            prompt:"Holding unused firm transport capacity is…",
            options:["A wasted cost","An option on the spread between two hubs","Prohibited","Risk-free"],
            answer:1,
            why:"You pay the tariff whether you ship or not, and in exchange you can capture the spread whenever it exceeds that tariff. Valuing capacity as an option rather than as a cost is the standard framework in gas and power." }
        ]
      },
      {
        id: "u11l5",
        title: "LNG and destination flexibility",
        goal: "Liquefaction turns a piped, local molecule into a shippable cargo, and the freedom to choose the buyer is the value.",
        exercises: [
          { type:"order",
            prompt:"Put the LNG chain in order",
            items:[
            "Gas production and treatment",
            "Liquefaction at the export terminal",
            "Loading onto an LNG carrier",
            "Regasification at the import terminal",
            "Delivery into the destination grid"
          ],
            why:"Each stage is a separate capital-intensive asset with its own contracts and its own bottleneck. Understanding where the chain is tight tells you which link captures the margin in a given year." },
          { type:"choice",
            prompt:"A destination-flexible LNG cargo is worth more than a fixed-destination one because…",
            options:["It ships faster","It can be sent to whichever market is paying most, so it carries an option","It has lower boil-off","It is easier to finance"],
            answer:1,
            why:"Flexibility is optionality with a price, and it is why destination clauses have been fought over commercially and legally for decades. Rigid contracts sell the option away, usually cheaply." },
          { type:"numeric",
            prompt:"A European benchmark is $11/MMBtu and an Asian benchmark is $14/MMBtu. Sending the cargo to Asia costs $2/MMBtu more in freight. What is the net advantage of Asia per MMBtu?",
            answer:1,
            unit:"$/MMBtu",
            tolerance:0,
            why:"The spread is 14 − 11 = 3 and the extra freight is 2, leaving a net 1 $/MMBtu in favour of Asia. Freight is what decides which regional price actually pulls the cargo, and it can reverse a $3 headline gap on its own." },
          { type:"choice",
            prompt:"Long-term LNG contracts have historically been oil-linked because…",
            options:["Gas has no price","Buyers and lenders wanted a liquid, published reference before gas hubs existed","Regulators required it","Oil is cheaper"],
            answer:1,
            why:"A twenty-year project needs a bankable price formula, and for decades only oil offered one. As gas hubs deepened, hub-indexed contracts became viable, and the mix of the two now defines the market’s pricing." },
          { type:"choice",
            prompt:"Why is boil-off a commercial and not just a technical matter?",
            options:["It changes cargo quality","It reduces the delivered volume, so the voyage length is part of the netback","It voids insurance","It affects duty"],
            answer:1,
            why:"A cargo loses cargo continuously in transit, and some of it fuels the vessel, so a longer voyage delivers fewer MMBtu from the same load. Netbacks in LNG have to be run on delivered volume, not loaded volume." }
        ]
      }
    ]
  },
  {
    id: "u12",
    title: "Energy II (Renewable)",
    subtitle: "Trading electrons and the certificates behind them",
    scene: "renewable",
    lessons: [
      {
        id: "u12l1",
        title: "Power markets and intermittency",
        goal: "Electricity cannot be stored cheaply, so its price is set hour by hour and can go below zero.",
        exercises: [
          { type:"choice",
            prompt:"Why is electricity priced by the hour or half-hour rather than as a single daily number?",
            options:["Regulatory tradition","Because supply and demand must balance instantly and storage is limited","Because meters read hourly","To simplify billing"],
            answer:1,
            why:"A megawatt-hour at 8am and one at 2am are different commodities because they cannot be swapped without storage. Time granularity is not administrative detail; it is what electricity is." },
          { type:"choice",
            prompt:"Negative power prices occur when…",
            options:[
            "Demand collapses to zero",
            "Inflexible or subsidised generation would rather pay to keep running than shut down",
            "The grid fails",
            "A market is manipulated"
          ],
            answer:1,
            why:"Plants with start-up costs or subsidies tied to output will accept a negative price briefly rather than stop, so the market pays consumers to absorb the surplus. It is a rational outcome of inflexibility, not a malfunction." },
          { type:"choice",
            prompt:"The capture price of a wind farm is usually below the average market price because…",
            options:[
            "Wind output is unreliable in quality",
            "Wind produces most when other wind farms also produce, and prices are then low",
            "Grid fees are deducted",
            "Wind is sold forward"
          ],
            answer:1,
            why:"Output is correlated across a whole region, so a windy hour is a cheap hour. This cannibalisation effect is why capacity growth lowers the revenue per megawatt-hour even when total demand is unchanged." },
          { type:"numeric",
            prompt:"A wind farm produces 50,000 MWh in a month. The average market price is €60/MWh but its output-weighted capture price is €52/MWh. What is the revenue shortfall against the average price, in euros?",
            answer:400000,
            unit:"€",
            tolerance:0,
            why:"The gap is 8 €/MWh across 50,000 MWh, which is €400,000 in a single month. This is the number a renewable developer’s business case lives or dies on, and it is invisible if you model revenue at the average price." },
          { type:"pairs",
            prompt:"Match each source of flexibility to what it provides",
            pairs:[["Battery storage","Shifting energy across hours within a day"],["Interconnector","Moving energy between regions with different conditions"],["Demand response","Paying consumers to move or reduce load at peak"]],
            why:"Intermittent generation creates a market for flexibility, and each of these products sells a different dimension of it. Renewable trading is largely the business of valuing them." }
        ]
      },
      {
        id: "u12l2",
        title: "Power purchase agreements",
        goal: "A PPA moves price risk from the generator to the buyer, and the shape of the volume decides who really carries it.",
        exercises: [
          { type:"choice",
            prompt:"The primary purpose of a corporate PPA for the generator is…",
            options:[
            "A higher price than the market",
            "A long-term, bankable revenue stream that lets the project be financed",
            "Avoiding grid fees",
            "Access to certificates"
          ],
            answer:1,
            why:"Lenders fund construction against contracted revenue, so a signed PPA is often what turns a project from a plan into an asset. The price matters less than its certainty and its duration." },
          { type:"choice",
            prompt:"A pay-as-produced PPA leaves the buyer with…",
            options:["No exposure at all","Volume that arrives when the wind blows, not when the buyer needs it","A fixed hourly profile","Only credit risk"],
            answer:1,
            why:"The buyer receives the generator’s shape and must fill the gaps from the market at whatever price prevails. That shape risk is the substance of a renewable PPA negotiation, and it is frequently underpriced." },
          { type:"numeric",
            prompt:"A generator has sold 30,000 MWh under a PPA at €48/MWh. The market settles at €62/MWh. How much revenue does the generator forgo, in euros?",
            answer:420000,
            unit:"€",
            tolerance:0,
            why:"The difference is 14 €/MWh over 30,000 MWh, or €420,000 given up in that period. That is the price of certainty, and it looks very different to a board after a high-price year than before one." },
          { type:"pairs",
            prompt:"Match each PPA structure to what it does",
            pairs:[["Physical PPA","Power is delivered to the buyer’s account in the same market"],["Virtual or financial PPA","Cash settles against a reference price with no physical delivery"],["Baseload-shaped PPA","The generator promises a flat profile and buys the shortfall itself"]],
            why:"The three allocate shape, basis and credit risk in different places. Choosing the wrong one gives a buyer an accounting instrument when it wanted electrons, or the reverse." },
          { type:"choice",
            prompt:"Why does a long PPA still leave the generator with market risk?",
            options:[
            "Prices are unpredictable",
            "Because production shortfalls must be covered at market prices, and the counterparty may not last the term",
            "Because indices change",
            "Because grids are unreliable"
          ],
            answer:1,
            why:"A twenty-year promise is only as good as the buyer’s credit and the plant’s output, and both can fail. A PPA transforms price risk into volume and counterparty risk rather than removing risk from the project." }
        ]
      },
      {
        id: "u12l3",
        title: "Guarantees of origin and certificates",
        goal: "The green attribute of a megawatt-hour is a separate, tradable commodity from the energy itself.",
        exercises: [
          { type:"choice",
            prompt:"A guarantee of origin certifies…",
            options:[
            "That electricity was physically delivered from a named plant",
            "That one megawatt-hour was generated from a specified source, as a tradable attribute",
            "The carbon price paid",
            "The grid fee"
          ],
            answer:1,
            why:"Electrons are indistinguishable once on the grid, so the environmental claim is carried by a certificate that can be sold separately. This is what makes a renewable claim auditable and also what makes it easy to overstate." },
          { type:"numeric",
            prompt:"A buyer needs certificates for 50,000 MWh and they trade at €2.50/MWh. What is the cost, in euros?",
            answer:125000,
            unit:"€",
            tolerance:0,
            why:"The cost is 50,000 × 2.50 = €125,000, a small fraction of the energy bill. That low price is precisely why unbundled certificates are criticised as a weak signal for new construction." },
          { type:"choice",
            prompt:"Buying unbundled certificates rather than a PPA is criticised because…",
            options:[
            "They are unregulated",
            "They rarely change what gets built, since existing plants can sell them cheaply",
            "They cannot be audited",
            "They are double-counted by design"
          ],
            answer:1,
            why:"A certificate from a decades-old hydro plant makes a claim true on paper without adding any generation. Additionality — whether the purchase caused new capacity — is the whole argument between the two approaches." },
          { type:"choice",
            prompt:"Hourly matching of consumption and certificates is stricter than annual matching because…",
            options:["It is easier to audit","It requires clean generation at the same time as the demand, not just the same year","It costs less","It excludes hydro"],
            answer:1,
            why:"Annual matching lets summer solar offset winter night-time consumption, which the physical grid never did. Hourly matching forces the buyer to procure or store flexibility, which is a far more expensive and far more honest claim." },
          { type:"pairs",
            prompt:"Match each instrument to what it proves",
            pairs:[["Guarantee of origin","How a megawatt-hour was generated"],["Emissions allowance","That a tonne of emitted carbon dioxide has been paid for"],["Proof of sustainability for a biofuel","That a physical batch met a defined feedstock and lifecycle standard"]],
            why:"They look alike and are not interchangeable: one describes generation, one prices emissions, one certifies a physical batch. Contracts that confuse them fail audit, and the premium is repaid." }
        ]
      },
      {
        id: "u12l4",
        title: "Biofuels, HVO and SAF",
        goal: "A renewable fuel is worth its premium only for as long as the mandate and the paperwork behind it hold.",
        exercises: [
          { type:"choice",
            prompt:"Demand for road biofuels is mostly created by…",
            options:["Consumer preference","Blending mandates that oblige suppliers to place a share of renewable energy","Lower production cost","Freight advantages"],
            answer:1,
            why:"Obligated parties buy because the law requires a share, so the premium tracks the mandate and its compliance mechanism rather than any physical scarcity. When a mandate changes, the whole price basis changes with it." },
          { type:"numeric",
            prompt:"Fossil gasoil is €820/t and HVO is €1,450/t. You blend 5% HVO by weight. What is the cost per tonne of the blend, in euros?",
            answer:851.5,
            unit:"€/t",
            tolerance:0.05,
            why:"Weight the two components: 0.95 × 820 + 0.05 × 1,450 = 851.5 €/t. A 5% blend adds over €31 per tonne, which is why the mandate percentage is watched as closely as the flat price." },
          { type:"pairs",
            prompt:"Match each renewable fuel to its main market",
            pairs:[["Ethanol","Blended into gasoline for light vehicles"],["HVO","A drop-in diesel substitute for road and off-road use"],["SAF","Aviation, where no alternative to liquid fuel is close"]],
            why:"Each has different feedstocks, different specifications and a different regulatory driver, so they are separate markets that happen to share a narrative. Trading them as one commodity is how a desk gets the basis wrong." },
          { type:"choice",
            prompt:"Why does feedstock origin matter so much to the value of a renewable fuel?",
            options:[
            "It changes the energy content",
            "Because the lifecycle emissions saving, and therefore the compliance value, depends on it",
            "Because of freight",
            "Because refiners prefer certain crops"
          ],
            answer:1,
            why:"Waste-based feedstocks earn a bigger saving and often count double under some schemes, so the same litre can be worth very different amounts. This also makes feedstock fraud unusually profitable and unusually well policed." },
          { type:"choice",
            prompt:"The largest commercial risk in a certified renewable fuel trade is…",
            options:["Freight cost","That the sustainability documentation is rejected, leaving you with an ordinary fuel and a premium to refund","Storage","Currency"],
            answer:1,
            why:"Strip the certification and what remains is a normal hydrocarbon worth hundreds of euros less per tonne. The paper is the value, so the documentary due diligence is the trade rather than a formality after it." }
        ]
      }
    ]
  },
  {
    id: "u13",
    title: "Metals, Ores & Minerals",
    subtitle: "From concentrate to warrant",
    scene: "metals",
    lessons: [
      {
        id: "u13l1",
        title: "The exchange, warrants and warehousing",
        goal: "A metal exchange price refers to a specific brand, in a specific warehouse, on a specific date.",
        exercises: [
          { type:"choice",
            prompt:"An exchange warrant is…",
            options:[
            "A permit to import metal",
            "A document of title to a specific lot of approved metal in an approved warehouse",
            "A futures contract",
            "A quality certificate"
          ],
            answer:1,
            why:"The warrant is what makes the futures contract physically real: it names the brand, the shape and the shed. It is also why the exchange price and the price of metal where you need it can differ substantially." },
          { type:"choice",
            prompt:"The physical premium a consumer pays over the exchange price covers…",
            options:[
            "Exchange fees",
            "Delivery to the plant, the brand and shape they need, and the credit they receive",
            "Insurance only",
            "Nothing, it is a market convention"
          ],
            answer:1,
            why:"The exchange price is metal on a warrant in a warehouse; a consumer needs a particular brand at their gate on agreed terms. The premium is the price of that transformation and it is a market in its own right." },
          { type:"numeric",
            prompt:"Cash metal is $9,200/t and the three-month price is $9,290/t. Financing, insurance and storage for three months cost $70/t. What is the profit per tonne on buying cash and selling three-month?",
            answer:20,
            unit:"$/t",
            tolerance:0,
            why:"The contango is 9,290 − 9,200 = 90 $/t and carrying costs are 70, leaving 20 $/t. This cash-and-carry trade is the arbitrage that keeps a contango from widening beyond the real cost of storage." },
          { type:"choice",
            prompt:"A backwardation in a metal usually signals…",
            options:["Excess supply","Tightness now: the market pays more for metal today than for metal later","High storage costs","Low interest rates"],
            answer:1,
            why:"Nobody pays a premium for immediate delivery unless immediate delivery is scarce, so backwardation is the market’s way of bidding stock out of storage. It also makes holding inventory expensive rather than profitable." },
          { type:"pairs",
            prompt:"Match each element of a metal quotation to what it specifies",
            pairs:[["Brand","Which producer’s metal is acceptable"],["Shape","Whether it is cathode, ingot, billet or granule"],["Warehouse location","Where the metal sits, which sets the delivery premium"]],
            why:"Two cargoes at the same exchange price can be worth very different amounts once these three are read. Traders quote them together because each one moves the value." }
        ]
      },
      {
        id: "u13l2",
        title: "Concentrates, treatment charges and payables",
        goal: "A mine sells rock. What it is paid for is the metal inside, minus the cost of getting it out.",
        exercises: [
          { type:"choice",
            prompt:"A copper concentrate sale is priced on…",
            options:[
            "The weight of the concentrate",
            "The payable metal contained, less treatment and refining charges",
            "The exchange price alone",
            "The mine’s cost of production"
          ],
            answer:1,
            why:"The buyer is a smelter, and it pays for the metal it can recover rather than for the tonnage delivered. Every term in the contract exists to divide the metal value between the two parties." },
          { type:"numeric",
            prompt:"A concentrate grades 28% copper and payable copper is 96.5% of contained metal. For 10,000 t of concentrate, how many tonnes of copper are payable?",
            answer:2702,
            unit:"t",
            tolerance:0,
            why:"Contained copper is 10,000 × 28% = 2,800 t and payable copper is 2,800 × 96.5% = 2,702 t. The 98 tonnes not paid for are the smelter’s recovery allowance, and negotiating that percentage is worth real money." },
          { type:"pairs",
            prompt:"Match each charge to what it pays for",
            pairs:[["Treatment charge","Smelting the concentrate into blister or anode"],["Refining charge","Refining the metal to deliverable purity"],["Penalty element","Impurities such as arsenic that cost the smelter to handle"]],
            why:"Together these decide how much of the metal price reaches the mine, and they move with smelter capacity rather than with the metal. In a tight concentrate market they can go to zero or even negative." },
          { type:"choice",
            prompt:"Treatment charges fall when…",
            options:["Metal prices rise","Concentrate is scarce relative to smelting capacity","Freight rises","Energy costs rise"],
            answer:1,
            why:"Smelters compete for feed when there is not enough of it, and they compete by charging less. The treatment charge is therefore a barometer of the concentrate balance and not of the metal price at all." },
          { type:"choice",
            prompt:"Why do concentrate contracts specify a quotational period so carefully?",
            options:[
            "To set the shipping date",
            "Because the metal is priced over a defined future window, so the QP allocates price risk between mine and smelter",
            "To fix the treatment charge",
            "For customs purposes"
          ],
            answer:1,
            why:"Weeks pass between loading and refining, and whoever bears the price movement in that window is decided by the QP. It is the single most valuable clause to get right in a concentrate contract." }
        ]
      },
      {
        id: "u13l3",
        title: "Iron ore, coking coal and the steel chain",
        goal: "Steel raw materials are priced on the quality that reaches the furnace, and the chain has its own margin.",
        exercises: [
          { type:"choice",
            prompt:"Iron ore is priced principally on…",
            options:["Cargo size","Iron content and impurities such as silica, alumina and phosphorus","Freight distance","Mine ownership"],
            answer:1,
            why:"The furnace cares about how much iron arrives and what else comes with it, so grade differentials are the market. A 62% and a 58% ore are different commodities with their own indices and their own spreads." },
          { type:"numeric",
            prompt:"A 62% Fe ore is $124/t. Priced pro rata on iron content alone, what would a 58% Fe ore be worth per tonne?",
            answer:116,
            unit:"$/t",
            tolerance:0,
            why:"Per point of iron the price is 124 ÷ 62 = 2 $/t, so 58 points is worth 116 $/t. Real discounts are usually wider than pro rata because low-grade ore also brings more impurities and more processing cost." },
          { type:"order",
            prompt:"Put the integrated steel chain in order",
            items:[
            "Iron ore and coking coal are mined",
            "Coal is turned into coke",
            "Ore and coke are charged to the blast furnace",
            "Hot metal is refined into steel",
            "Steel is rolled into finished product"
          ],
            why:"Every link has its own market and its own bottleneck, so a squeeze in coke can matter more than a move in ore. Traders follow the chain because margin migrates along it." },
          { type:"choice",
            prompt:"Why does an electric arc furnace change the raw material picture?",
            options:[
            "It uses no raw materials",
            "It runs mainly on scrap and power rather than ore and coke",
            "It requires higher-grade ore",
            "It cannot make flat products"
          ],
            answer:1,
            why:"Where a market shifts towards electric furnaces, demand moves from ore and coking coal towards scrap and electricity. That substitution is the main structural story in steel raw materials." },
          { type:"choice",
            prompt:"A steel mill’s margin is best described as…",
            options:["The steel price","The spread between the steel price and the cost of ore, coke, scrap and power","Its production volume","The freight it pays"],
            answer:1,
            why:"Mills earn a conversion spread, so they can be crushed in a rising steel market if raw materials rise faster. Anyone trading into a mill needs to know where that spread is before discussing price." }
        ]
      },
      {
        id: "u13l4",
        title: "Battery metals and young benchmarks",
        goal: "New markets have real demand and immature price discovery, and both facts matter commercially.",
        exercises: [
          { type:"choice",
            prompt:"The characteristic risk of trading a young battery-metal market is…",
            options:["No demand","Thin liquidity and immature benchmarks, so prices gap and hedges barely exist","Excessive regulation","Uniform quality"],
            answer:1,
            why:"Demand can be growing fast while the market remains too illiquid to hedge or even to price reliably. Positions therefore have to be sized for the exit, not for the conviction." },
          { type:"numeric",
            prompt:"Roughly 8 t of spodumene concentrate are needed per tonne of lithium carbonate. At $900/t of concentrate, what is the raw-material cost per tonne of carbonate, in dollars?",
            answer:7200,
            unit:"$/t",
            tolerance:0,
            why:"The cost is 8 × 900 = $7,200 per tonne of carbonate before conversion, energy and reagents. Conversion ratios like this are how you sanity-check whether a chemical price and a concentrate price are consistent." },
          { type:"pairs",
            prompt:"Match each battery material to what it is bought as",
            pairs:[["Lithium","A chemical: carbonate or hydroxide, to a specified purity"],["Cobalt","Metal or a chemical intermediate such as hydroxide"],["Nickel","Either class one metal for batteries or class two for stainless steel"]],
            why:"The product form decides which market you are actually in, and the forms do not price alike. A nickel price headline can be irrelevant to a battery buyer who needs class one units." },
          { type:"choice",
            prompt:"Why do buyers of battery materials sign long-term offtakes rather than buying spot?",
            options:[
            "Spot markets are illegal",
            "To secure volume and quality for a plant that cannot stop, and to help the mine get financed",
            "To avoid taxes",
            "Because prices never move"
          ],
            answer:1,
            why:"A cathode plant is a continuous process with qualified suppliers, and new mines need contracted revenue to be built. The offtake solves both problems at once, which is why it is the normal shape of these deals." },
          { type:"choice",
            prompt:"Purity specifications matter more here than in base metals because…",
            options:[
            "Freight is expensive",
            "Trace impurities can make material unusable in a cell, so off-spec has almost no fallback outlet",
            "Customs requires it",
            "Buyers are fewer"
          ],
            answer:1,
            why:"Battery-grade material that misses spec cannot simply be sold to the next buyer at a small discount; it may have to be reprocessed or sold into an entirely different industry. That cliff edge is what makes qualification so slow." }
        ]
      },
      {
        id: "u13l5",
        title: "Scrap and the recycling flow",
        goal: "Scrap is a commodity gathered rather than mined, and that changes how supply responds to price.",
        exercises: [
          { type:"choice",
            prompt:"Scrap supply differs from mined supply because…",
            options:["It is unlimited","It depends on collection economics and on what was consumed decades ago","It cannot be traded","It has no quality variation"],
            answer:1,
            why:"The available stock is whatever society built in the past and whatever price makes it worth collecting now, so supply responds quickly to price but is capped by history. It is why scrap tightens fast and then stops responding." },
          { type:"numeric",
            prompt:"Scrap costs $380/t and yields 92% into liquid steel. What is the scrap cost per tonne of liquid steel, in dollars?",
            answer:413.04,
            unit:"$/t",
            tolerance:0.05,
            why:"Divide by the yield: 380 ÷ 0.92 ≈ 413.04 $/t. Yield loss is the reason a clean, high-yielding grade can be the cheaper input even at a higher headline price per tonne." },
          { type:"pairs",
            prompt:"Match each scrap characteristic to why a mill cares",
            pairs:[["Yield","How much liquid metal a tonne of scrap actually produces"],["Residual elements","Copper or tin that cannot be removed and limit what can be made"],["Density and size","Whether it can be charged efficiently into the furnace"]],
            why:"Scrap is graded on these rather than on a single purity number, and mills pay very different prices for grades that look similar. Understanding the grade sheet is most of scrap trading." },
          { type:"choice",
            prompt:"Export restrictions on scrap are increasingly common because…",
            options:[
            "Scrap is dangerous to ship",
            "Governments want the material kept for domestic low-carbon steelmaking",
            "Freight is scarce",
            "Quality cannot be verified"
          ],
            answer:1,
            why:"Scrap has become a strategic input for decarbonising steel, so exporting it is politically contentious. Trade policy is now one of the main drivers of regional scrap price differentials." },
          { type:"choice",
            prompt:"Why is recycled metal not automatically interchangeable with primary metal?",
            options:[
            "It is always contaminated",
            "Residual elements and inconsistent composition limit which products it can be used for",
            "It cannot be hedged",
            "It has lower density"
          ],
            answer:1,
            why:"Some applications tolerate residuals and some cannot, so recycled and primary units serve overlapping but different markets. Assuming perfect substitution is how a recycled-content commitment turns out to be unbuyable." }
        ]
      }
    ]
  },
  {
    id: "u14",
    title: "Soft Commodities",
    subtitle: "Crops, crush and the weather that prices them",
    scene: "softs",
    lessons: [
      {
        id: "u14l1",
        title: "The grain and oilseed complex",
        goal: "Grains are traded in bushels and cents on exchanges, and in tonnes and dollars on cargoes.",
        exercises: [
          { type:"choice",
            prompt:"A grain cargo is normally priced as…",
            options:[
            "A flat price agreed in advance",
            "A futures month plus a basis for the origin, port and delivery period",
            "The exchange settlement alone",
            "A government reference price"
          ],
            answer:1,
            why:"The futures leg carries the world price and the basis carries everything local: freight to port, local supply, vessel line-ups and quality. Splitting the price this way is what lets the two risks be managed separately." },
          { type:"numeric",
            prompt:"Corn futures are 470 cents per bushel and one tonne is 39.37 bushels. What is the flat price per tonne, in dollars?",
            answer:185.04,
            unit:"$/t",
            tolerance:0.05,
            why:"Convert cents to dollars and multiply: 4.70 × 39.37 ≈ 185.04 $/t. Getting this conversion wrong by a factor is a classic error, and it is why desks keep the conversion in the template rather than in someone’s head." },
          { type:"pairs",
            prompt:"Match each crop to what it is mainly used for",
            pairs:[["Corn","Animal feed, starch and ethanol"],["Wheat","Milling for human food, with feed grades below spec"],["Soybeans","Crushing into meal for feed and oil for food and fuel"]],
            why:"End use decides which substitutes matter and therefore which price relationships hold. A feed buyer switching between corn and wheat is what links two apparently separate markets." },
          { type:"choice",
            prompt:"Northern and southern hemisphere harvests matter to a trader because…",
            options:[
            "They set freight rates",
            "They alternate, so the origin with fresh crop changes through the year",
            "They use different contracts",
            "They have different quality standards"
          ],
            answer:1,
            why:"Supply arrives from opposite ends of the world six months apart, so origin competitiveness rotates seasonally. Knowing whose harvest is fresh tells you where the cargoes will come from before any price is quoted." },
          { type:"choice",
            prompt:"Why is the basis often more important than the futures price to an origination desk?",
            options:[
            "Because futures are illiquid",
            "Because the futures leg is hedged, so what remains is the basis you bought or sold",
            "Because basis is fixed",
            "Because futures are unavailable in emerging markets"
          ],
            answer:1,
            why:"Once the flat price is hedged, the entire result of the trade lives in the basis. Origination is therefore a basis business dressed up as a grain business." }
        ]
      },
      {
        id: "u14l2",
        title: "The crush and the board margin",
        goal: "A crusher buys beans and sells meal and oil, so its margin is a spread the market quotes directly.",
        exercises: [
          { type:"choice",
            prompt:"The soybean crush spread is…",
            options:["The cost of crushing","The combined value of meal and oil minus the cost of the beans","The freight on beans","A tax on oilseed processing"],
            answer:1,
            why:"It is the processor’s gross margin, and because all three legs are exchange-traded it can be locked as a single position. Crushers therefore hedge the spread rather than the beans." },
          { type:"numeric",
            prompt:"Crushing one tonne of soybeans yields 0.79 t of meal and 0.185 t of oil. Meal is $400/t and oil is $1,000/t. What is the gross product value per tonne of beans, in dollars?",
            answer:501,
            unit:"$/t",
            tolerance:0,
            why:"Meal contributes 0.79 × 400 = 316 and oil 0.185 × 1,000 = 185, giving 501 $/t of product value. Yields are fixed by the bean, so this arithmetic is the crusher’s revenue line." },
          { type:"numeric",
            prompt:"Beans cost $460/t and the gross product value is $501/t. What is the crush margin per tonne, in dollars?",
            answer:41,
            unit:"$/t",
            tolerance:0,
            why:"The margin is 501 − 460 = 41 $/t before energy, labour and depreciation. When the spread falls below cash processing cost, crushers slow down, which tightens meal and loosens beans." },
          { type:"choice",
            prompt:"A wide crush margin usually leads to…",
            options:[
            "Crushers reducing runs",
            "Crushers running hard, increasing demand for beans and supply of meal and oil",
            "Higher meal prices",
            "Lower bean prices immediately"
          ],
            answer:1,
            why:"Processors respond to their own margin, so the spread is the mechanism that turns a strong meal market into demand for beans. Following the crush is how you anticipate the flows rather than react to them." },
          { type:"choice",
            prompt:"Why can oil and meal pull the crush in opposite directions?",
            options:[
            "They are the same product",
            "They serve different markets — food and fuel versus animal feed — with independent drivers",
            "They are priced on the same index",
            "Only one is traded"
          ],
            answer:1,
            why:"A biofuel mandate can lift oil while a livestock cycle depresses meal, and the crusher must sell both from the same bean. This joint-product problem is the defining feature of oilseed processing." }
        ]
      },
      {
        id: "u14l3",
        title: "Coffee, cocoa and sugar",
        goal: "Tropical softs are concentrated in few origins, quality-graded, and increasingly priced on traceability.",
        exercises: [
          { type:"choice",
            prompt:"Why are coffee and cocoa prices so sensitive to weather in a single country?",
            options:[
            "Contracts are written there",
            "Production is concentrated in a few origins, so one bad season moves the world balance",
            "Freight is limited",
            "They cannot be stored"
          ],
            answer:1,
            why:"When a handful of countries supply most of the world crop, local rainfall becomes a global price event. Diversification of origin is limited by climate, which is why these markets are structurally volatile." },
          { type:"numeric",
            prompt:"The benchmark is 180 cents per pound and a certified washed arabica trades at a differential of 25 cents per pound. What is the price per pound, in cents?",
            answer:205,
            unit:"cents/lb",
            tolerance:0,
            why:"Add the differential to the benchmark: 180 + 25 = 205 cents/lb. The differential rather than the benchmark is where origin quality, certification and availability are actually expressed." },
          { type:"pairs",
            prompt:"Match each soft commodity to a defining market feature",
            pairs:[["Coffee","Two distinct species and contracts, arabica and robusta"],["Cocoa","Origin concentration in West Africa with regulated farmgate pricing"],["Sugar","A raw and a white market linked by refining, plus large policy intervention"]],
            why:"Each of these features drives a specific trade: the arabica-robusta spread, the West African differential, and the white premium. Knowing the feature is knowing where the money is made." },
          { type:"choice",
            prompt:"The white sugar premium is best understood as…",
            options:["A quality bonus","The refining margin between raw and white sugar","A freight differential","A tax"],
            answer:1,
            why:"It pays for turning raws into whites, so it widens when refining capacity is scarce and narrows when it is idle. It is the sugar market’s equivalent of a crack spread." },
          { type:"choice",
            prompt:"Why has traceability become a price factor in cocoa and coffee?",
            options:[
            "Buyers prefer stories",
            "Because deforestation and labour rules require the buyer to evidence the plot of origin, and evidenced lots are scarcer",
            "Freight requires it",
            "Exchanges mandate it"
          ],
            answer:1,
            why:"Regulation has moved the burden of proof onto the importer, so a lot with geolocation and a documented chain is worth more than an identical bean without it. Scarcity of paperwork has become scarcity of product." }
        ]
      },
      {
        id: "u14l4",
        title: "Weather, seasonality and the balance sheet",
        goal: "Agricultural trading is the continuous updating of a supply and demand balance around a growing season.",
        exercises: [
          { type:"choice",
            prompt:"A supply and demand balance sheet for a crop is used to…",
            options:[
            "Report to the exchange",
            "Track expected production, use and ending stocks, which is what the price responds to",
            "Value inventory",
            "Calculate freight"
          ],
            answer:1,
            why:"The price reacts to the change in expected ending stocks far more than to today’s weather, so every forecast is translated into that balance. Traders argue about the balance sheet, not about the rainfall." },
          { type:"numeric",
            prompt:"Yield falls from 3.5 t/ha to 3.0 t/ha across 20 million hectares. How much production is lost, in million tonnes?",
            answer:10,
            unit:"million t",
            tolerance:0,
            why:"The loss is 0.5 × 20 = 10 million tonnes, which is enough to change a comfortable balance into a tight one for a major crop. Small yield changes across large areas dominate agricultural price moves." },
          { type:"order",
            prompt:"Put the season in the order a trader watches it",
            items:[
            "Planting intentions and area",
            "Emergence and early crop condition",
            "The weather-sensitive yield-setting weeks",
            "Harvest and actual yields",
            "Ending stocks and the carry into next season"
          ],
            why:"Uncertainty is highest, and options are dearest, in the yield-setting window. Knowing where you are in this sequence tells you how much of the crop is still an opinion." },
          { type:"choice",
            prompt:"Why does the same rainfall matter enormously one week and not at all a month later?",
            options:[
            "Measurement changes",
            "Because yield is set during a short reproductive window and rain outside it does far less",
            "Because markets forget",
            "Because forecasts improve"
          ],
            answer:1,
            why:"Crops have a defined period when moisture and heat determine how much grain is produced, and the market prices that calendar explicitly. Weather trading is really calendar trading." },
          { type:"choice",
            prompt:"A large ending-stocks figure implies…",
            options:["Prices will rise","A cushion against next season’s shocks, so the market prices risk more cheaply","Lower planting","Higher freight"],
            answer:1,
            why:"Stocks are the buffer that absorbs a bad year, so a comfortable carry-out suppresses both the price and the volatility. It is why the same drought forecast produces a rally in one year and a shrug in another." }
        ]
      },
      {
        id: "u14l5",
        title: "Quality, certification and phytosanitary rules",
        goal: "In agriculture the specification and the plant-health paperwork both have to arrive with the cargo.",
        exercises: [
          { type:"choice",
            prompt:"A phytosanitary certificate confirms…",
            options:[
            "The commercial quality of the cargo",
            "That the consignment meets the importing country’s plant-health requirements",
            "That duty has been paid",
            "That the cargo is insured"
          ],
            answer:1,
            why:"It is a plant-health document, not a quality document, and without it a cargo can be refused entry however good the grain is. Losing it turns a sound trade into a distressed cargo at a foreign port." },
          { type:"numeric",
            prompt:"A contract allows 14% moisture with a 1% weight deduction for each excess percentage point. A 25,000 t cargo arrives at 16% moisture. What weight is invoiced, in tonnes?",
            answer:24500,
            unit:"t",
            tolerance:0,
            why:"Two excess points mean a 2% deduction, so 25,000 × 0.98 = 24,500 t is invoiced. Moisture is water you paid for as grain, which is why it is measured and deducted rather than tolerated." },
          { type:"pairs",
            prompt:"Match each contractual quality term to what it controls",
            pairs:[["Moisture","Water content, which is weight without value and a storage risk"],["Foreign material","Non-grain content that the buyer must remove or discount"],["Damaged and broken kernels","Grain that cannot be milled or fed to the intended standard"]],
            why:"Each has its own allowance and its own deduction scale, and together they decide the final invoice. Reading the grade table is how you know what your cargo will actually be paid." },
          { type:"choice",
            prompt:"Why is the certifying body named in the contract, not just the standard?",
            options:[
            "For marketing",
            "Because the buyer must accept whose certificate proves compliance, or the claim is unenforceable",
            "Because standards change",
            "For customs"
          ],
            answer:1,
            why:"A specification with no named inspector or scheme is a dispute waiting to happen, since each side will produce its own favourable report. Naming the body and the sampling method is what makes quality terms operative." },
          { type:"choice",
            prompt:"Genetically modified content matters commercially because…",
            options:[
            "It changes the yield",
            "Some importing markets restrict it, so identity-preserved non-GM lots carry a premium and need segregation",
            "It affects moisture",
            "It is untraceable"
          ],
            answer:1,
            why:"The value comes from keeping the lot separate through the whole chain, which costs money at every transfer. Any commingling destroys the premium instantly, which is why segregation is audited rather than promised." }
        ]
      }
    ]
  },
  {
    id: "u15",
    title: "Trade Finance Banking Instruments",
    subtitle: "Funding the gap, and getting paid",
    scene: "tradefinance",
    lessons: [
      {
        id: "u15l1",
        title: "The working capital gap",
        goal: "Trading is the business of funding time.",
        exercises: [
          { type:"choice",
            prompt:"Why does a trading house need so much financing?",
            options:["To pay salaries","Because it pays for cargo long before it is paid for it","To buy ships","For the futures exchange only"],
            answer:1,
            why:"Cargo, freight and insurance are paid up front. Payment arrives after delivery, sometimes 30 days later. Someone must fund that gap." },
          { type:"numeric",
            prompt:"You pay the supplier on day 0. Transit is 32 days and payment terms are 30 days after delivery. How many days of funding?",
            answer:62,
            unit:"days",
            tolerance:0,
            why:"62 days on the full cargo value. At 7% a year on $5 million that is roughly $60,000 of interest — straight out of your margin." },
          { type:"choice",
            prompt:"Which change improves returns the most, all else equal?",
            options:["A slightly better price","Getting paid 20 days earlier","A nicer vessel","A longer QP"],
            answer:1,
            why:"Cutting funding days lifts return on capital without touching the negotiated margin. Cash cycle beats headline price more often than people expect." },
          { type:"choice",
            prompt:"Return on capital depends on…",
            options:["Margin only","Margin and how long capital is tied up","The commodity","The vessel size"],
            answer:1,
            why:"A 2% margin turned over six times a year beats a 5% margin turned over once. Speed is a strategy." }
        ]
      },
      {
        id: "u15l2",
        title: "Getting paid",
        goal: "Payment terms decide when cash comes back, and whether it comes back at all.",
        exercises: [
          { type:"choice",
            prompt:"Selling on 30-day payment terms is, in effect…",
            options:["A discount","A loan you make to your buyer","Free","A hedge"],
            answer:1,
            why:"You deliver the goods and wait for the money. That is credit you extend — cheap when the buyer is good, expensive when they are not." },
          { type:"choice",
            prompt:"Which payment term is best for YOUR cash position?",
            options:["30 days after delivery","Payment at delivery","20% advance, balance at delivery","They are the same"],
            answer:2,
            why:"An advance funds part of the cargo for you. It is the best for your cash and the hardest to get — buyers dislike it, so it costs you elsewhere." },
          { type:"order",
            prompt:"Order these from lowest to highest risk of not being paid",
            items:["Advance payment","Letter of credit","Payment at delivery","Open account, 30 days"],
            why:"Payment risk and commercial attractiveness pull in opposite directions. Choosing between them is a real decision on every trade." },
          { type:"build",
            prompt:"Complete the sentence",
            sentence:["Physical trading is the business","of funding the gap","between paying the supplier","and being paid by the buyer"],
            distractors:["of predicting the market","of owning ships"],
            why:"If you remember one sentence from this topic, make it this one: the trader is paid to carry the time between paying a supplier and being paid by a buyer, and everything in trade finance exists to shorten or secure that gap." }
        ]
      },
      {
        id: "u15l3",
        title: "The payment ladder",
        goal: "Every payment method is a trade between commercial appeal and the risk of not being paid.",
        exercises: [
          { type:"pairs",
            prompt:"Match each payment method to what it means in practice",
            pairs:[["Open account","You ship and invoice, and rely on the buyer to pay when due"],["Documentary collection","The bank releases documents against payment or acceptance, without guaranteeing it"],["Confirmed letter of credit","A bank you accept undertakes to pay you against compliant documents"]],
            why:"The three sit at very different points on the risk ladder and cost accordingly. Choosing between them is a credit decision disguised as an administrative one." },
          { type:"choice",
            prompt:"A documentary collection differs from a letter of credit because…",
            options:["It is faster","No bank promises to pay; the bank only controls the documents","It costs more","It requires an inspection"],
            answer:1,
            why:"If the buyer refuses to pay, you have a cargo at a foreign port and no bank obligation to fall back on. Collections give control of the documents, not a payment undertaking, and the difference is the whole risk." },
          { type:"choice",
            prompt:"Why would a seller accept open account terms with a weaker buyer?",
            options:[
            "Because it is cheaper for the seller",
            "To win the business, usually offset by credit insurance or a higher price",
            "Because banks require it",
            "Because it removes tax"
          ],
            answer:1,
            why:"Payment terms are part of the price. A seller who gives credit is lending, and the rational answers are to charge for it, insure it, or decline the business — not to hope." },
          { type:"order",
            prompt:"Order these from lowest to highest risk for the seller",
            items:[
            "Cash in advance",
            "Confirmed letter of credit",
            "Documentary collection against payment",
            "Open account with credit insurance",
            "Open account, unsecured"
          ],
            why:"Notice that the safest terms are the hardest to sell and the easiest to lose an order on. The ladder is a menu of trade-offs, and every rung costs something in competitiveness or in cash." },
          { type:"choice",
            prompt:"What does a bank guarantee or standby letter of credit add to open account trading?",
            options:[
            "It replaces the invoice",
            "A bank undertaking that pays if the buyer does not, without controlling the documents",
            "Faster shipping",
            "A price guarantee"
          ],
            answer:1,
            why:"It keeps the commercial simplicity of open account while moving the payment risk to a bank, which is why it is common with repeat buyers. You still ship on trust; you are simply paid by someone else when trust fails." }
        ]
      },
      {
        id: "u15l4",
        title: "Letters of credit",
        goal: "A bank pays against documents, not against the cargo.",
        exercises: [
          { type:"choice",
            prompt:"Under a documentary letter of credit, what does the issuing bank pay against?",
            options:["The cargo arriving safely","Documents that comply with the credit terms","The buyer approval","The trader reputation"],
            answer:1,
            why:"Documents. Not goods, not performance, not fairness. The bank never sees the cargo — it checks paper against the terms it was given." },
          { type:"choice",
            prompt:"Your cargo is perfect but one document has the wrong date. What can happen?",
            options:["Nothing, the goods are fine","The bank can refuse to pay on a discrepancy","The bank pays anyway","The buyer must pay cash"],
            answer:1,
            why:"A discrepant presentation can be rejected even with flawless cargo. Documentation discipline is not bureaucracy — it is getting paid." },
          { type:"choice",
            prompt:"What does an LC really replace?",
            options:["Insurance","Buyer risk with bank risk","The bill of lading","The hedge"],
            answer:1,
            why:"You stop worrying about whether the buyer will pay and start worrying about whether the bank will — usually a much better risk." },
          { type:"pairs",
            prompt:"Match each funding route to its main feature",
            pairs:[["Revolving facility","Flexible, uses credit capacity"],["LC-backed finance","Lower equity, payment risk reduced"],["Borrowing base","Secured on cargo and receivables"],["Own balance sheet","No bank, heavy on equity"]],
            why:"Each structure trades cost against equity against dependence. Choosing well is part of the trade, not an afterthought." }
        ]
      },
      {
        id: "u15l5",
        title: "Discrepancies under UCP 600",
        goal: "A letter of credit pays against documents that comply exactly, and most first presentations do not.",
        exercises: [
          { type:"choice",
            prompt:"Under a letter of credit, the bank examines…",
            options:["The cargo","The documents, against the terms of the credit and the applicable rules","The vessel","The contract of sale"],
            answer:1,
            why:"The bank has no view on whether the goods were good; it checks paper. That independence is what makes the instrument bankable and what makes a comma in a description capable of stopping payment." },
          { type:"choice",
            prompt:"A discrepancy in the presented documents means…",
            options:[
            "The cargo is rejected",
            "The bank may refuse to pay until the discrepancy is waived or corrected",
            "The credit is cancelled automatically",
            "The buyer must pay anyway"
          ],
            answer:1,
            why:"The undertaking is conditional on compliance, so a discrepancy hands the decision back to the buyer, whose waiver you now need. That is exactly the position the letter of credit was bought to avoid." },
          { type:"pairs",
            prompt:"Match each common discrepancy to what causes it",
            pairs:[["Late presentation","Documents sent after the presentation period in the credit"],["Inconsistent goods description","Invoice wording that does not match the credit"],["Bill of lading not as required","Wrong consignee, missing endorsement or an unclean notation"]],
            why:"These few causes account for the large majority of rejected presentations, and every one of them is preventable at the drafting stage. Checking the credit against your own documents before shipment is the cheapest control in trade finance." },
          { type:"numeric",
            prompt:"A credit allows presentation within 21 days of the bill of lading date. The bill is dated the 3rd and documents are presented on the 27th. By how many days is the presentation late?",
            answer:3,
            unit:"days",
            tolerance:0,
            why:"The deadline falls on the 24th, so presenting on the 27th is 3 days late. A deadline missed by three days converts a bank obligation into a request for a favour from the buyer." },
          { type:"choice",
            prompt:"The best defence against discrepancies is…",
            options:[
            "Presenting early",
            "Reviewing the draft credit against your documentary capability before it is issued",
            "Using a larger bank",
            "Insuring the shipment"
          ],
            answer:1,
            why:"Once the credit is issued, its terms bind you, and amendments need the buyer’s agreement. Reading the draft and refusing conditions you cannot satisfy is what keeps the instrument worth its cost." }
        ]
      },
      {
        id: "u15l6",
        title: "Counterparty credit",
        goal: "The risk that the other side does not perform.",
        exercises: [
          { type:"choice",
            prompt:"What is counterparty credit exposure?",
            options:["The price falling","What you lose if the other side fails to perform","The cost of the LC","Your bank borrowing"],
            answer:1,
            why:"Unpaid receivables, lost prepayments, and the cost of replacing the contract at a worse market. A real, sizeable number." },
          { type:"choice",
            prompt:"Why do desks set a limit per counterparty?",
            options:["Regulation","Because concentration, not volatility, is what usually kills a desk","To slow traders down","For tax"],
            answer:1,
            why:"Surviving a bad market is normal. Surviving one large counterparty defaulting is a matter of whether you sized the exposure." },
          { type:"choice",
            prompt:"A new buyer wants 30-day terms on a large first cargo. The sensible answer is…",
            options:["Agree — growth matters","Start smaller, or secure the payment","Refuse all business","Ask double the price"],
            answer:1,
            why:"Credit is earned. Start small, or take an LC or credit insurance. Relationships are built on cargoes that settled cleanly." },
          { type:"numeric",
            prompt:"A buyer owes you $1,200,000 for a cargo already delivered, and on the same day repudiates a second cargo which you resell at a $180,000 loss. What is your total exposure to that buyer?",
            answer:1380000,
            unit:"$",
            tolerance:0,
            why:"1,200,000 + 180,000 = $1,380,000. Two separate losses: an unpaid receivable on goods you no longer have, and the replacement loss on goods you still had. Had you kept the cargo in both cases, the loss would only be the resale difference — which is why exposure is measured per contract, not guessed." }
        ]
      }
    ]
  },
  {
    id: "u16",
    title: "Types of Financing for Commodity Companies",
    subtitle: "Lending against the flow, not the balance sheet",
    scene: "financing",
    lessons: [
      {
        id: "u16l1",
        title: "The capital stack of a trading house",
        goal: "A trader funds itself in layers, and each layer has a different lender with a different fear.",
        exercises: [
          { type:"pairs",
            prompt:"Match each layer of funding to what it pays for",
            pairs:[["Uncommitted bilateral lines","Day-to-day transactional cargo finance"],["Committed revolving credit facility","Standby liquidity that cannot be pulled at short notice"],["Bonds and equity","Assets, acquisitions and the cushion that survives a bad year"]],
            why:"Cheap money is also the money that disappears fastest under stress, so the layers are held together deliberately. A house funded only on uncommitted lines is efficient right up to the week it is not." },
          { type:"choice",
            prompt:"Why does a trading house pay for a committed facility it hopes never to draw?",
            options:[
            "To improve its accounts",
            "Because in a stressed market uncommitted lines can be withdrawn exactly when they are needed",
            "Because regulators require it",
            "To reduce interest cost"
          ],
            answer:1,
            why:"The commitment fee buys certainty of access, and certainty is the scarce commodity in a liquidity event. Every trading failure of the last thirty years has a chapter where the cheap lines were pulled." },
          { type:"choice",
            prompt:"Transactional trade finance is considered lower risk by banks because…",
            options:[
            "It is guaranteed by the state",
            "It is short, self-liquidating and secured on identified goods and receivables",
            "It is always insured",
            "It is priced higher"
          ],
            answer:1,
            why:"The loan is repaid by the cargo it financed, within weeks, against documents the bank controls. That structure — not the borrower’s size — is what makes the pricing thin and the appetite large." },
          { type:"numeric",
            prompt:"A house has $9,000m of uncommitted lines and $3,000m of committed facilities. What share of its funding is committed, as a percentage?",
            answer:25,
            unit:"%",
            tolerance:0.1,
            why:"Committed funding is 3,000 out of 12,000 total, which is 25%. Rating agencies look hard at this ratio because it measures how much of the balance sheet survives a market that stops lending." },
          { type:"choice",
            prompt:"What ultimately limits how much a trading house can trade?",
            options:["Its equity","Its access to credit lines, and the risk appetite of the banks behind them","The size of the market","Its warehouse capacity"],
            answer:1,
            why:"Volume is funded, not owned, so the constraint is bank appetite rather than capital in most conditions. Managing the bank group is therefore a commercial activity of the same rank as trading itself." }
        ]
      },
      {
        id: "u16l2",
        title: "Prepayment",
        goal: "A prepayment is finance shaped like a purchase: you pay now and are repaid in tonnes.",
        exercises: [
          { type:"choice",
            prompt:"What is a prepayment in commodity trading?",
            options:[
            "Cash advanced to a producer, repaid through future deliveries of the commodity rather than in money",
            "A deposit held against future demurrage",
            "Payment made on the day of loading",
            "An advance against the freight invoice"
          ],
            answer:0,
            why:"It solves two problems at once: the producer needs capital and cannot easily borrow, while the trader wants secured access to volume. Repayment is physical, which is why the deal has to be analysed as a supply arrangement and a loan at the same time." },
          { type:"choice",
            prompt:"What secures a prepayment in practice?",
            options:[
            "The flow of future cargoes, usually with assignment of receivables and control of the offtake",
            "A mortgage over the producer’s shares",
            "Nothing — it is unsecured by nature",
            "A guarantee from the producing country’s government"
          ],
            answer:0,
            why:"The security is the ability to keep receiving the goods and to be paid directly by the end buyers. That is why control of the sales channel matters far more here than the producer’s balance sheet." },
          { type:"numeric",
            prompt:"You prepay $30,000,000, repaid through 20 monthly cargoes of 5,000 t. The contracted value of those cargoes totals $33,000,000. What implied discount per tonne is the advance earning?",
            answer:30,
            unit:"$/t",
            tolerance:0,
            why:"The cargoes are worth 33,000,000 against 30,000,000 advanced, so the difference of 3,000,000 spread over 100,000 t is 30 per tonne. That is the return expressed the way a trader can compare it — as a discount on the goods rather than as an interest rate." },
          { type:"choice",
            prompt:"What is the main risk of a prepayment?",
            options:[
            "Performance risk: the producer may not deliver, and you have already paid",
            "Price risk, and nothing else",
            "That the cargoes arrive earlier than planned",
            "Currency risk, and nothing else"
          ],
            answer:0,
            why:"You have converted a credit exposure into an operational one. A producer that stops producing — for technical, political or financial reasons — leaves you holding a claim instead of a cargo, which is why these deals are done only with counterparties whose operations you understand." },
          { type:"choice",
            prompt:"Why do prepayments concentrate in certain countries and commodities?",
            options:[
            "They are used where producers have volume but limited access to conventional bank finance",
            "Because the goods themselves are cheaper there",
            "Because local regulation requires the structure",
            "Because the voyages are shorter"
          ],
            answer:0,
            why:"Which is also why they carry political and sanctions risk in proportion. A structure that exists because ordinary lending is unavailable should always prompt the question of why it is unavailable." }
        ]
      },
      {
        id: "u16l3",
        title: "Offtake and tolling",
        goal: "Offtake buys the output. Tolling buys the processing. Different risks, different capital.",
        exercises: [
          { type:"choice",
            prompt:"What is an offtake agreement?",
            options:[
            "A commitment to buy a defined share of a producer’s output over time, usually at a formula price",
            "A single spot purchase agreed in advance",
            "An agreement to charter a vessel for a period",
            "A licence to operate a mine or plant"
          ],
            answer:0,
            why:"For the producer it turns uncertain sales into bankable revenue, which is often what allows the project to be financed at all. For the trader it secures volume and a place in the flow, which is worth more than the margin on any one cargo." },
          { type:"choice",
            prompt:"In a tolling arrangement, who owns the raw material during processing?",
            options:[
            "The trader, who pays a fee for the conversion",
            "The processor, who buys it and sells the product back",
            "Nobody — title is suspended during conversion",
            "The final buyer of the product"
          ],
            answer:0,
            why:"You keep title and pay for a service. So you carry the price risk on both the input and the output while the processor carries the operational risk of converting it. Getting that boundary wrong is how tolling deals turn sour." },
          { type:"numeric",
            prompt:"You toll 10,000 t of raw material worth $480/t into a product selling at $610/t. The tolling fee is $85/t of input and conversion loses 4% of the volume. What is the result on the batch?",
            answer:206000,
            unit:"$",
            tolerance:0,
            why:"Conversion leaves 9,600 t worth 5,856,000. Against an input cost of 4,800,000 and a fee of 850,000 the result is 206,000. Notice how much of that sits in the 4% loss: at these margins the yield assumption matters as much as either price." },
          { type:"choice",
            prompt:"What is the crucial number in a tolling contract?",
            options:[
            "The guaranteed yield or recovery, and what happens when it is missed",
            "The length of the contract",
            "The reputation of the processor",
            "The currency the fee is paid in"
          ],
            answer:0,
            why:"The fee is visible and gets negotiated hard; the yield is where the money quietly sits. A recovery one percentage point below expectation can be worth more than the entire processing fee, so the contract has to say who bears it." },
          { type:"pairs",
            prompt:"Match each structure to where the risk sits",
            pairs:[["Offtake","You buy the output; the producer keeps operating risk"],["Tolling","You keep the material and pay for its conversion"],["Prepayment","You advance cash and are repaid in goods"]],
            why:"Three ways of tying yourself to a physical flow, with the risk in a different place in each. Naming which one you are actually in is the first step to pricing it properly." }
        ]
      },
      {
        id: "u16l4",
        title: "Borrowing base",
        goal: "A trading house borrows against what it owns and what it is owed, revalued constantly.",
        exercises: [
          { type:"choice",
            prompt:"What is a borrowing base facility?",
            options:[
            "A revolving credit limit set by the value of eligible inventory and receivables, recalculated regularly",
            "A fixed-term loan secured on the company’s equity",
            "A bond issued to institutional investors",
            "An unsecured overdraft"
          ],
            answer:0,
            why:"The lender is comfortable because the collateral is liquid, priced daily and saleable. That is also why the limit moves with the market: a fall in prices cuts what you can borrow at precisely the moment you need it most." },
          { type:"numeric",
            prompt:"Eligible inventory is $60,000,000 at an advance rate of 85%, and eligible receivables are $25,000,000 at 90%. What is the borrowing base?",
            answer:73500000,
            unit:"$",
            tolerance:0,
            why:"Inventory contributes 51,000,000 and receivables 22,500,000, giving 73,500,000. The haircuts are the lender’s protection against price moves and non-payment, and they are the first thing tightened when a market turns." },
          { type:"choice",
            prompt:"Why is the advance rate lower on inventory than on receivables from strong buyers?",
            options:[
            "Inventory still has to be sold and its price can move; a receivable from a good name is nearly cash",
            "Inventory is harder to insure",
            "Receivables carry a government guarantee",
            "Inventory cannot legally be pledged"
          ],
            answer:0,
            why:"The haircut measures how far the collateral sits from cash, and how far its value could fall on the way there. It is a compact statement of everything a lender fears about your business." },
          { type:"choice",
            prompt:"Prices fall 20% across your book. What happens to the facility?",
            options:[
            "The base shrinks, so available credit falls even though the physical position has not changed",
            "Nothing until the facility matures",
            "The limit rises to compensate for the loss",
            "Only the interest rate is affected"
          ],
            answer:0,
            why:"This is the reflexive trap in commodity finance. A price fall cuts collateral value and borrowing capacity at the same moment it triggers margin calls on the hedges, so liquidity tightens from both sides at once." },
          { type:"choice",
            prompt:"What is a collateral management agreement for?",
            options:[
            "A third party controls the stock, so the lender knows the pledged goods exist and stay pledged",
            "It insures the goods against damage",
            "It arranges the freight for the stock",
            "It fixes the price at which stock is valued"
          ],
            answer:0,
            why:"It exists because the industry has repeatedly discovered the same warehouse receipts pledged to several banks at once. Independent physical control is the answer, and it is worth what it costs." }
        ]
      },
      {
        id: "u16l5",
        title: "Streams and royalties",
        goal: "Some capital buys a share of future production rather than a share of the company.",
        exercises: [
          { type:"choice",
            prompt:"What is a streaming agreement?",
            options:[
            "An upfront payment in exchange for the right to buy a share of future production at a fixed low price",
            "A loan repaid in cash with interest",
            "An equity stake in the mine",
            "A hedge against the metal price"
          ],
            answer:0,
            why:"It is finance shaped like an offtake. The producer raises capital without issuing equity or debt, and the financier gets long exposure to the metal at a price fixed today. Whether it is a good deal depends almost entirely on how long the mine lasts." },
          { type:"choice",
            prompt:"How does a royalty differ from a stream?",
            options:[
            "A royalty pays a percentage of revenue or profit; a stream delivers metal at an agreed price",
            "A royalty is always the larger of the two",
            "A royalty is repaid and a stream is not",
            "There is no meaningful difference"
          ],
            answer:0,
            why:"A royalty holder never touches the metal and never pays again. A stream holder keeps paying the fixed price and receives physical units, so a stream carries operating exposure that a royalty does not." },
          { type:"numeric",
            prompt:"A stream entitles you to 8,000 oz a year at $420/oz while the market is $2,350/oz. What is the annual benefit at that price?",
            answer:15440000,
            unit:"$",
            tolerance:0,
            why:"2,350 − 420 = 1,930 per ounce, so 8,000 × 1,930 = 15,440,000 a year. The entire value of a stream sits in that spread, which is why it is priced on a long view of the metal and of the mine’s life rather than on today’s quote." },
          { type:"choice",
            prompt:"What is the main risk to the holder of a stream?",
            options:[
            "The mine produces less than expected, or stops producing altogether",
            "That the metal price rises",
            "That the producer repays early",
            "Currency risk, and nothing else"
          ],
            answer:0,
            why:"A stream has no repayment obligation to enforce: if the ore is not there, there is nothing to deliver and nothing to claim. Which is why the geology and the operator matter more than any credit rating." },
          { type:"choice",
            prompt:"Why do traders as well as specialist financiers do these deals?",
            options:[
            "They secure long-term physical volume and a relationship with the producer, which is the trader’s core interest",
            "Because the returns are effectively guaranteed",
            "To take operational control of the mine",
            "Because banks refuse to lend to producers"
          ],
            answer:0,
            why:"For a trader the metal itself is the point. Capital deployed this way buys years of flow through the book, and flow is what a trading business is ultimately built out of." }
        ]
      },
      {
        id: "u16l6",
        title: "Terminals and throughput",
        goal: "Owning or contracting storage buys optionality, and pays for it in fixed cost.",
        exercises: [
          { type:"choice",
            prompt:"What is a throughput agreement?",
            options:[
            "A contract for the right to move a volume through a terminal over a period, usually with a minimum commitment",
            "An agreement to purchase the terminal itself",
            "A charter of a vessel for a fixed period",
            "An insurance policy covering stored goods"
          ],
            answer:0,
            why:"It buys access without buying the asset. The minimum commitment is the catch: it converts a variable cost into a fixed one, so it pays only if you genuinely have the flow to fill it." },
          { type:"numeric",
            prompt:"A tank lease costs $340,000 a month for 60,000 t of capacity, and the contango is $9/t a month. What does the storage earn or lose each month?",
            answer:200000,
            unit:"$",
            tolerance:0,
            why:"The carry earns 60,000 × 9 = 540,000 against a cost of 340,000, so 200,000 a month. It pays while the contango holds — and the lease does not shorten when the curve flattens, which is the risk you have actually taken on." },
          { type:"choice",
            prompt:"What does storage really buy a trader?",
            options:[
            "Optionality: the ability to hold, blend and time sales instead of selling into whatever the market offers today",
            "A guaranteed margin on stored volume",
            "Lower freight rates",
            "Exemption from price risk"
          ],
            answer:0,
            why:"Optionality has a price, and here you pay it in fixed cost. The question is never whether storage is good but whether the option it creates is worth more than the rent across a whole cycle." },
          { type:"choice",
            prompt:"Why is a terminal in the right location worth more than a cheaper one elsewhere?",
            options:[
            "Location decides which arbitrages you can actually execute",
            "Because rents are higher in better locations",
            "Because it is easier to insure",
            "Because inspectors are closer to hand"
          ],
            answer:0,
            why:"An asset in the wrong place is a fixed cost with no option attached to it. The value of infrastructure in this business is entirely about which flows it lets you touch." },
          { type:"choice",
            prompt:"What is the danger of building a trading book around owned assets?",
            options:[
            "The asset has to be fed, so the desk starts doing trades that suit the asset rather than the market",
            "That assets always fall in value",
            "It removes all flexibility on freight",
            "Owned assets cannot be hedged"
          ],
            answer:0,
            why:"It is the commonest way an asset-backed strategy goes wrong. Fixed cost creates pressure for volume, and volume pursued for its own sake is how a desk ends up buying badly just to keep a terminal busy." }
        ]
      },
      {
        id: "u16l7",
        title: "Judging a structured deal",
        goal: "Every structured deal is a trade, a loan and a bet on an operator, priced together.",
        exercises: [
          { type:"order",
            prompt:"Put the questions in the order they should be asked",
            items:[
            "What is the physical flow, and is it real?",
            "Who operates it, and can they keep operating?",
            "What secures us if they cannot?",
            "What return does the structure pay for that risk?",
            "How do we exit, and what is it worth then?"
          ],
            why:"The flow comes first because everything else depends on it. A structure that starts from the return and works backwards to justify it is the standard shape of a bad deal." },
          { type:"choice",
            prompt:"Why is the operator often more important than the credit rating?",
            options:[
            "Repayment comes out of production, so an operator who stops producing defaults whatever their balance sheet says",
            "Because ratings are generally unreliable",
            "Because operators guarantee the debt personally",
            "Because producers have no credit ratings"
          ],
            answer:0,
            why:"You are lending against a flow, so the ability to keep that flow running is the credit. It is why teams doing these deals visit the site and read the technical reports rather than only the accounts." },
          { type:"numeric",
            prompt:"A structured deal advances $18,000,000 and returns $21,600,000 over two years. What is the simple annualised return on the advance?",
            answer:10,
            unit:"%",
            tolerance:0.1,
            why:"21,600,000 − 18,000,000 = 3,600,000, which is 20% of the advance over two years, so about 10% a year simple. Compare that against the return on ordinary trading before deciding the complexity and the tied-up capital are worth it." },
          { type:"choice",
            prompt:"What does a structured deal cost a desk beyond the capital?",
            options:[
            "Flexibility: capital and attention are committed for years, and the position cannot be closed like a cargo",
            "Nothing further, once it is signed",
            "Only the legal and advisory fees",
            "Its entire bank credit line"
          ],
            answer:0,
            why:"A cargo can be sold tomorrow. A five-year prepayment cannot, and it consumes credit lines, management time and risk appetite the whole way through. That opportunity cost is the part most often missing from the pitch." },
          { type:"choice",
            prompt:"What is the single best test of a structured deal?",
            options:[
            "Whether it still makes sense if the price falls and the operator underperforms",
            "Whether the projected return looks attractive",
            "Whether the counterparty is a well-known name",
            "Whether a bank is willing to fund it"
          ],
            answer:0,
            why:"Structures are built for the good case and revealed by the bad one. If the deal only works when everything goes right, what you have bought is not a return but a position you cannot get out of." }
        ]
      }
    ]
  }
];
