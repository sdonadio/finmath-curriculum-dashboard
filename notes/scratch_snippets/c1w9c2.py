import numpy as np
np.seterr(all="ignore")
import math


def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


V0, sigma_V, D, r, T = 100.0, 0.25, 70.0, 0.03, 1.0    # firm asset value, asset vol, debt face, risk-free, horizon

d2 = (math.log(V0 / D) + (r - 0.5 * sigma_V ** 2) * T) / (sigma_V * math.sqrt(T))
pd_merton = norm_cdf(-d2)
print(f"Merton structural model: firm value={V0}, debt face={D}, asset vol={sigma_V:.0%}")
print(f"implied default probability (T={T}y) = {pd_merton:.4%}\n")

print("as asset volatility rises (the credit market's read on 'riskiness' widens), the structural PD moves too:")
for sigma_shock in (0.20, 0.25, 0.30, 0.40):
    d2s = (math.log(V0 / D) + (r - 0.5 * sigma_shock ** 2) * T) / (sigma_shock * math.sqrt(T))
    pd_s = norm_cdf(-d2s)
    print(f"  asset vol={sigma_shock:.0%}:  implied default probability = {pd_s:.4%}")

print("\nthis is the structural-model bridge from equity/asset volatility to a default probability --")
print("a capital-structure-arb desk compares THIS to the reduced-form CDS-implied hazard rate from week 2")
