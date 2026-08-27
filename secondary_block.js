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
