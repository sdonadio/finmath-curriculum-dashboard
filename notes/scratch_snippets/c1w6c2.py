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


n_names = 100
pd = 0.03
recovery = 0.4
trials = 40_000


def expected_tranche_loss(rho, A, D, seed=35700):
    rng = np.random.default_rng(seed)
    c = norm_ppf(pd)
    M = rng.standard_normal(trials)
    eps = rng.standard_normal((trials, n_names))
    X = np.sqrt(rho) * M[:, None] + np.sqrt(1 - rho) * eps
    defaults = X < c
    loss_frac = defaults.sum(axis=1) / n_names * (1 - recovery)
    tl = np.clip(loss_frac - A, 0.0, D - A) / (D - A)
    return tl.mean()


targets = {"mezz (3-7%)": (0.03, 0.07, 0.09), "senior (7-15%)": (0.07, 0.15, 0.015)}
for name, (A, D, target) in targets.items():
    lo, hi = 0.001, 0.95
    for _ in range(25):
        mid = (lo + hi) / 2.0
        val = expected_tranche_loss(mid, A, D)
        if val > target:      # expected tranche loss increases with correlation for mezz/senior
            hi = mid
        else:
            lo = mid
    print(f"{name}:  target expected loss={target:.3%}   implied ('base') correlation ~= {(lo+hi)/2:.3f}")

print("\ndifferent tranches of the SAME capital structure imply different correlation parameters --")
print("this is the market's base-correlation skew: one Gaussian copula rho does not price every tranche at once")
