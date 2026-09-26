import numpy as np
np.seterr(all="ignore")

# A central limit order book (CLOB) ranks resting orders by price, then by
# time at that price -- the quoted BID/ASK spread is only the TOP of book;
# a market maker's real capacity to absorb size lives in the DEPTH behind
# it. Posting two-sided quotes at multiple price levels earns the spread
# on every fill, but each level away from the touch trades less often and
# is more likely to be picked off right before an adverse price move.

def build_book(mid, tick, n_levels, base_size, size_growth):
    bids = [(round(mid - tick * (i + 0.5), 4), base_size * (size_growth ** i)) for i in range(n_levels)]
    asks = [(round(mid + tick * (i + 0.5), 4), base_size * (size_growth ** i)) for i in range(n_levels)]
    return bids, asks

mid, tick = 50_000.0, 5.0                     # a BTC perp around $50,000, $5 ticks
bids, asks = build_book(mid, tick, n_levels=5, base_size=2.0, size_growth=1.6)

print("order book around mid = $%.0f (tick = $%.1f)\n" % (mid, tick))
print("  bid size    bid price      ask price   ask size")
for i in range(4, -1, -1):
    print("   %6.2f     %10.2f      %10.2f   %6.2f" % (bids[i][1], bids[i][0], asks[i][0], asks[i][1]))

quoted_spread = asks[0][0] - bids[0][0]
print("\nquoted (top-of-book) spread : $%.2f  (%.2f bp of mid)" % (quoted_spread, 10_000 * quoted_spread / mid))

# Effective spread for a market order that must WALK the book: the size-
# weighted average price paid, compared with the arrival mid.
def walk_book(levels, size_needed):
    filled, notional = 0.0, 0.0
    for price, size in levels:
        take = min(size, size_needed - filled)
        notional += take * price
        filled += take
        if filled >= size_needed:
            break
    return notional / filled, filled

for order_size in (1.0, 3.0, 8.0, 20.0):
    avg_ask_price, filled = walk_book(asks, order_size)
    effective_spread = 2 * (avg_ask_price - mid)
    print("buy %5.1f BTC: fills %5.1f, avg price $%10.2f, effective spread $%.2f (%.2f bp)"
          % (order_size, filled, avg_ask_price, effective_spread, 10_000 * effective_spread / mid))

total_ask_depth = sum(s for _, s in asks)
print("\ntotal displayed ask-side depth across %d levels: %.2f BTC" % (len(asks), total_ask_depth))
print("a market maker quoting only the touch (top level, %.2f BTC) captures the FULL"
      % asks[0][1])
print("quoted spread on small flow, but an order for %.1f BTC walks straight through"
      % (asks[0][1] + 1))
print("that level and starts paying the WIDER effective spread the deeper levels imply")
