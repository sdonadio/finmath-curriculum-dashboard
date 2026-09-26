import numpy as np
np.seterr(all="ignore")
import math


def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def norm_ppf(p, lo=-8.0, hi=8.0):
    for _ in range(80):
        mid = (lo + hi) / 2.0
        if norm_cdf(mid) < p:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2.0


rng = np.random.default_rng(35700)
n_names = 150
pd = 0.025
recovery = 0.4
rho = 0.15
trials = 150_000
notional_per_name = 1_000_000

c = norm_ppf(pd)
M = rng.standard_normal(trials)
eps = rng.standard_normal((trials, n_names))
X = np.sqrt(rho) * M[:, None] + np.sqrt(1 - rho) * eps
defaults = X < c
loss = defaults.sum(axis=1) * notional_per_name * (1 - recovery)

EL = loss.mean()
VaR99 = np.percentile(loss, 99)
UL = VaR99 - EL

print(f"expected loss (EL)          = ${EL:,.0f}")
print(f"99% credit VaR               = ${VaR99:,.0f}")
print(f"unexpected loss (UL = VaR-EL) = ${UL:,.0f}")
print(f"UL / EL ratio                 = {UL/EL:.2f}x")
