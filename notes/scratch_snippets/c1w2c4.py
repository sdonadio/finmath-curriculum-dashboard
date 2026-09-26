import numpy as np
np.seterr(all="ignore")

par_spread = 0.045       # the market's fair running spread for this name and tenor
standard_coupon = 0.05   # standardized coupon (the 500bp convention, for higher-risk names)
risky_annuity = 4.2       # PV01 of the premium leg (risky duration), e.g. from week 2's bootstrap

upfront_pct = (par_spread - standard_coupon) * risky_annuity
notional = 10_000_000
upfront_cash = upfront_pct * notional

print(f"par spread = {par_spread:.2%}   standardized coupon = {standard_coupon:.2%}   risky annuity = {risky_annuity}")
print(f"upfront payment (running-spread convention) = {upfront_pct:+.4%} of notional")
print(f"upfront cash on ${notional:,.0f} notional = ${upfront_cash:,.0f}   "
      f"({'protection buyer receives it' if upfront_cash < 0 else 'protection buyer pays it'})")
