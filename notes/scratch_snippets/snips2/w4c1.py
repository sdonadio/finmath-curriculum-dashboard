import numpy as np
np.seterr(all="ignore")

# A perpetual future has no expiry, so nothing forces its price back to the
# underlying's spot price the way delivery does for a dated future. Instead
# a FUNDING RATE is paid periodically between the two sides: when the perp
# trades ABOVE the index (longs are more eager), longs pay shorts, making
# staying long more expensive and pulling the perp price back down; when it
# trades below, the payment flips. Funding is a repeated economic nudge
# toward convergence, not a hard constraint like delivery.

rng = np.random.default_rng(31200 + 2)
index_price = 60_000.0
perp_price = 60_900.0                     # perp starts at a 1.5% premium to index
notional = 100_000.0                       # a position size, to make funding payments concrete
decay = 0.32                                # fraction of the premium funding erodes each period

print("index = %.0f (fixed), perp starts at %.0f (%.2f%% premium)\n"
      % (index_price, perp_price, 100 * (perp_price / index_price - 1)))
print("period   perp price   premium     funding rate   long pays short on $100k")
p = perp_price
for period in range(10):
    premium = (p - index_price) / index_price
    funding_rate = premium                              # simplified: funding = the premium itself
    payment = funding_rate * notional
    p = index_price + (p - index_price) * (1 - decay) + rng.normal(0, 8.0)   # small realistic noise
    print("  %2d      %9.1f    %+6.3f%%      %+7.4f%%       %+10.2f"
          % (period, p, 100 * premium, 100 * funding_rate, payment))

final_premium = 100 * (p / index_price - 1)
print("\nfunding pulled the premium from +1.50%% toward %+.3f%% over 10 periods (%.1f days),"
      % (final_premium, 10 * 8 / 24))
print("purely through the repeated cost of staying on the expensive side --")
print("nobody was forced to close a position, unlike a dated future's delivery")
