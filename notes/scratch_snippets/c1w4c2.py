import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
days = 60
calm_days = 45
stress_days = days - calm_days

calm_prem = rng.normal(0.0, 0.15, size=calm_days)          # calm market: ETF trades close to NAV
stress_prem = rng.normal(-1.8, 0.9, size=stress_days)       # stress: bonds are hard to trade, ETF cheapens vs NAV

prem_pct = np.concatenate([calm_prem, stress_prem])

print(f"calm-period premium/discount:    mean = {calm_prem.mean():+.3f}%   std = {calm_prem.std():.3f}%")
print(f"stress-period premium/discount:  mean = {stress_prem.mean():+.3f}%   std = {stress_prem.std():.3f}%")
print(f"worst discount observed during stress = {prem_pct.min():+.3f}%")
print("\nthe ETF trades continuously; the underlying bonds do not -- in a stress episode the ETF price")
print("becomes the more CURRENT, and more pessimistic, read on credit, while NAV (marked to stale bond prices) lags")
