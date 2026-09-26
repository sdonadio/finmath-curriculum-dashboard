import numpy as np
np.seterr(all="ignore")

tenors = np.array([1, 2, 3, 4, 5])
rf_rates = np.array([0.030, 0.032, 0.034, 0.035, 0.036])   # risk-free zero curve

coupon = 0.055
face = 100.0
market_price = 96.50                                         # observed corporate bond price


def price_with_spread(z):
    DF = np.exp(-(rf_rates + z) * tenors)
    cfs = np.full(len(tenors), coupon * face)
    cfs[-1] += face
    return np.sum(cfs * DF)


lo, hi = 0.0, 0.20
for _ in range(60):
    mid = (lo + hi) / 2.0
    if price_with_spread(mid) > market_price:
        lo = mid
    else:
        hi = mid
z_spread = (lo + hi) / 2.0

print(f"risk-free price (z-spread = 0)  = {price_with_spread(0.0):.4f}")
print(f"observed market price           = {market_price:.4f}")
print(f"implied z-spread                = {z_spread:.4%}")
print("the z-spread is the flat add-on to every risk-free zero rate that reprices the bond exactly -- ")
print("it is the market's compensation for default risk, packaged as a single number")
