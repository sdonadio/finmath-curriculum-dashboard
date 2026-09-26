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
trials = 200_000


def prob_extreme_loss(rho, threshold, seed=35700):
    rng = np.random.default_rng(seed)
    c = norm_ppf(pd)
    M = rng.standard_normal(trials)
    eps = rng.standard_normal((trials, n_names))
    X = np.sqrt(rho) * M[:, None] + np.sqrt(1 - rho) * eps
    defaults = X < c
    loss_frac = defaults.sum(axis=1) / n_names * (1 - recovery)
    return np.mean(loss_frac > threshold)


threshold = 0.10
print(f"tail probability P(portfolio loss > {threshold:.0%}), pool expected loss held fixed at pd={pd:.0%}:")
for rho in (0.0, 0.1, 0.3, 0.5, 0.7):
    p = prob_extreme_loss(rho, threshold)
    print(f"  rho={rho:.1f}   P(loss > {threshold:.0%}) = {p:.4%}")

print("\nthe pool's EXPECTED loss barely moves with rho -- it is the shape of the tail that correlation controls,")
print("concentrating probability into 'everyone defaults together' or 'almost no one does', and starving the middle")
