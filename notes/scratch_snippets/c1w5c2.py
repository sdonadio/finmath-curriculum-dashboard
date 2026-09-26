import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
n_names = 100
pd = 0.03
recovery = 0.4
trials = 300_000

defaults = rng.random(size=(trials, n_names)) < pd     # independent defaults for now (correlation comes in week 6)
loss_frac = defaults.sum(axis=1) / n_names * (1 - recovery)

tranches = [("equity", 0.0, 0.03), ("mezz", 0.03, 0.07), ("senior", 0.07, 0.15), ("super-senior", 0.15, 1.0)]
for name, A, D in tranches:
    tl = np.clip(loss_frac - A, 0.0, D - A) / (D - A)
    print(f"{name:12s} [{A:.0%},{D:.0%}]  expected tranche loss = {tl.mean():.4%}")

print(f"\nportfolio expected loss = {loss_frac.mean():.4%}  (n_names*pd*(1-recovery) = {n_names*pd*(1-recovery)/n_names:.4%})")
