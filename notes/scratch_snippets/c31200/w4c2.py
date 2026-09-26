import numpy as np
np.seterr(all="ignore")

# A constant-product LP position is a claim on WHATEVER split of the two
# reserves the price ratio has moved to by the time you withdraw, and that
# split is always worth LESS than simply holding your original deposit
# unswapped, for any price move in either direction -- "impermanent" loss
# is a bad name (it is realized the moment you withdraw at the new price;
# it just isn't LOCKED IN if the price later returns). The closed form for
# a price ratio change of factor r is IL(r) = 2*sqrt(r)/(1+r) - 1, always
# <= 0.

def lp_value_after_price_move(x0, y0, price_ratio_change):
    # constant product: pool rebalances via arbitrage so that y/x = new price
    k = x0 * y0
    p0 = y0 / x0
    p1 = p0 * price_ratio_change
    x1 = np.sqrt(k / p1)
    y1 = np.sqrt(k * p1)
    return x1, y1

def impermanent_loss(price_ratio_change):
    r = price_ratio_change
    return 2 * np.sqrt(r) / (1 + r) - 1

x0, y0 = 1000.0, 2000.0                   # deposit: 1000 TOKEN + 2000 USDC, p0 = 2.0

print("initial LP deposit: %.0f TOKEN + %.0f USDC (price 2.0 USDC/TOKEN)\n" % (x0, y0))
print(" price change   LP value (USDC)   HODL value (USDC)   impermanent loss")
for r in (0.25, 0.5, 0.8, 1.0, 1.25, 2.0, 4.0):
    x1, y1 = lp_value_after_price_move(x0, y0, r)
    p1 = (y0 / x0) * r
    lp_val = x1 * p1 + y1
    hodl_val = x0 * p1 + y0
    il_closed_form = impermanent_loss(r)
    il_measured = lp_val / hodl_val - 1
    print("    %5.2fx        %10.2f          %10.2f          %7.3f%%  (closed form %.3f%%)"
          % (r, lp_val, hodl_val, 100 * il_measured, 100 * il_closed_form))

print("\nIL is a function of the price ratio ALONE, and it is symmetric in log terms:")
print("a 2x price move and a 0.5x price move produce the exact same %.4f%% loss"
      % (100 * impermanent_loss(2.0)))
print("versus holding, %.4f%% == %.4f%%" % (100 * impermanent_loss(2.0), 100 * impermanent_loss(0.5)))

# Break-even: fee income needed to offset IL at a few realistic price moves,
# expressed as a fraction of the DEPOSIT that trading fees alone must
# recover before the position beats simply holding.
print("\nfee income needed (as % of deposit) just to break even vs holding:")
for r in (1.1, 1.5, 2.0, 3.0):
    il = -impermanent_loss(r)
    print("  price moves %.1fx : need %.3f%% of deposit value in accumulated fees" % (r, 100 * il))
