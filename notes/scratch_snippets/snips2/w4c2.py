import numpy as np
np.seterr(all="ignore")

# Liquidation must be triggered off a price that is HARD TO MANIPULATE
# within a single transaction, which is exactly why exchanges liquidate
# against a MARK price (an index built from several venues, smoothed) and
# not the exchange's OWN last-traded price -- a thin order book's last
# trade can be moved by one attacker's order, but moving a multi-venue
# index requires moving the price on every contributing venue at once.

rng = np.random.default_rng(31200 + 3)
index_venues_price = np.array([59_950.0, 60_010.0, 60_040.0, 59_990.0])   # 4 independent venues
mark_price = index_venues_price.mean()

position_entry = 60_000.0
position_size_btc = 2.0
maintenance_margin_pct = 0.03           # liquidated if equity falls to 3% of notional
margin_posted = position_entry * position_size_btc * 0.05     # 5% initial margin (20x leverage)

def liq_price_long(entry, margin, size, mm_pct):
    # equity = margin - size*(entry - price); liquidate when equity = mm_pct*price*size
    # solve: margin - size*entry + size*price = mm_pct*price*size
    return (size * entry - margin) / (size * (1 - mm_pct))

liq_px = liq_price_long(position_entry, margin_posted, position_size_btc, maintenance_margin_pct)
print("position: long %.1f BTC at %.0f, margin posted %.0f -> liquidation price = %.2f\n"
      % (position_size_btc, position_entry, margin_posted, liq_px))

# An attacker wants to trigger liquidation by moving price down to liq_px.
# On a THIN single exchange (this exchange's own last-trade price), a large
# enough sell order can do it directly.
def single_venue_push(price, sell_usd, depth_usd=2_000_000.0):
    """Toy linear order book: price impact proportional to sell size / depth."""
    return price * (1 - sell_usd / depth_usd)

depth_usd = 2_000_000.0
# solve single_venue_push(mark_price, sell) == liq_px for sell, in closed form
sell_needed = depth_usd * (1 - liq_px / mark_price)
print("to push a SINGLE thin venue's last price down to the liquidation trigger,")
print("an attacker needs to sell about $%s of size on that one $%s-deep book"
      % (format(sell_needed, ",.0f"), format(depth_usd, ",.0f")))

# On a mark price averaging N independent venues, the SAME dollar attack
# only moves the composite by 1/N as much, since only one venue's price
# actually changed.
n_venues = len(index_venues_price)
mark_after_attack = (single_venue_push(index_venues_price[0], sell_needed) + index_venues_price[1:].sum()) / n_venues
print("\nthe SAME attack, aimed at one of %d venues feeding the mark price, moves" % n_venues)
print("the mark price only from %.2f to %.2f -- nowhere near the %.2f liquidation trigger"
      % (mark_price, mark_after_attack, liq_px))
print("an attacker would need to simultaneously push ALL %d venues to succeed," % n_venues)
print("multiplying the required capital by roughly %d times" % n_venues)
