import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# Ten names, one quarter. Each has an AS-REPORTED earnings number and, for some,
# a later revision. Deterministic: the revision pattern is fixed, not drawn.
NAMES = [f"N{i:02d}" for i in range(10)]
REPORTED = np.array([1.20, 0.85, 2.10, 0.45, 1.75, 0.95, 1.40, 0.30, 2.60, 1.05])
REVISION = np.array([0.00, -0.30, 0.05, 0.60, 0.00, -0.55, 0.00, 0.40, -0.10, 0.00])
REVISED = REPORTED + REVISION
CONSENSUS = np.array([1.10, 1.00, 1.95, 0.50, 1.80, 1.05, 1.30, 0.35, 2.50, 1.10])

surprise_rep = (REPORTED - CONSENSUS) / np.abs(CONSENSUS)
surprise_rev = (REVISED - CONSENSUS) / np.abs(CONSENSUS)


def rank(x):
    """1 = biggest surprise. argsort of argsort, descending."""
    order = np.argsort(-x, kind="stable")
    r = np.empty_like(order)
    r[order] = np.arange(1, len(x) + 1)
    return r


rk_rep, rk_rev = rank(surprise_rep), rank(surprise_rev)
print(f"{'name':<6}{'reported':>9}{'revised':>9}{'surp_rep':>10}{'surp_rev':>10}"
      f"{'rank_rep':>9}{'rank_rev':>9}{'sign flip':>10}")
flips = 0
for i, nm in enumerate(NAMES):
    f = np.sign(surprise_rep[i]) != np.sign(surprise_rev[i])
    flips += bool(f)
    print(f"{nm:<6}{REPORTED[i]:>9.2f}{REVISED[i]:>9.2f}{surprise_rep[i]:>10.3f}"
          f"{surprise_rev[i]:>10.3f}{rk_rep[i]:>9}{rk_rev[i]:>9}{'YES' if f else '':>10}")

names_rev = sum(REVISION != 0)
print(f"\nnames revised at all                : {names_rev} of {len(NAMES)}")
print(f"surprise sign flips                 : {flips}")
print(f"rank correlation of the two signals : "
      f"{np.corrcoef(rk_rep, rk_rev)[0, 1]:.3f}")
print(f"long-short spread, as reported      : "
      f"{surprise_rep[rk_rep <= 3].mean() - surprise_rep[rk_rep >= 8].mean():.3f}")
print(f"long-short spread, as revised       : "
      f"{surprise_rev[rk_rev <= 3].mean() - surprise_rev[rk_rev >= 8].mean():.3f}")
top_rep, top_rev = set(NAMES[i] for i in np.where(rk_rep <= 3)[0]), set(NAMES[i] for i in np.where(rk_rev <= 3)[0])
print(f"top-3 basket, reported {sorted(top_rep)}  revised {sorted(top_rev)}")
print(f"overlap {len(top_rep & top_rev)}/3 -- a backtest on revised data traded a portfolio")
print("that the as-reported tape would never have produced.")
