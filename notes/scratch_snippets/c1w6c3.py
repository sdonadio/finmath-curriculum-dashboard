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
trials = 60_000


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


print(f"{'rho':>5} {'equity EL [0,3%]':>18} {'senior EL [7,15%]':>18}")
for rho in (0.0, 0.1, 0.2, 0.3, 0.5, 0.7):
    eq = expected_tranche_loss(rho, 0.0, 0.03)
    sr = expected_tranche_loss(rho, 0.07, 0.15)
    print(f"{rho:5.1f} {eq:18.4%} {sr:18.4%}")

print("\nthe senior tranche's price is far MORE sensitive, in relative terms, to the correlation assumption")
print("than the equity tranche's -- a small mis-specification of rho does the most damage where it is least expected")
