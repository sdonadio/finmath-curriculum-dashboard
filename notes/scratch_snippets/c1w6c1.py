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
n_names = 100
pd = 0.03
recovery = 0.4
rho = 0.3
trials = 100_000

c = norm_ppf(pd)                                          # the default threshold: P(X_i < c) = pd
M = rng.standard_normal(trials)
eps = rng.standard_normal((trials, n_names))
X = np.sqrt(rho) * M[:, None] + np.sqrt(1 - rho) * eps     # one-factor Gaussian copula
defaults = X < c
loss_frac = defaults.sum(axis=1) / n_names * (1 - recovery)

tranches = [("equity", 0.0, 0.03), ("mezz", 0.03, 0.07), ("senior", 0.07, 0.15)]
for name, A, D in tranches:
    tl = np.clip(loss_frac - A, 0.0, D - A) / (D - A)
    print(f"{name:8s} [{A:.0%},{D:.0%}]  expected tranche loss (rho={rho}) = {tl.mean():.4%}")

print(f"\nportfolio default rate check: sample mean default prob = {defaults.mean():.4%}   target pd = {pd:.4%}")
