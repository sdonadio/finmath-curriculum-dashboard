import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import bisect

# TAQ-shaped: a quote tape and a trade tape, microseconds since the open.
QUOTES = [(1_000, 100.00, 100.02), (1_500, 100.01, 100.03), (2_400, 100.02, 100.04),
          (3_100, 100.05, 100.07), (3_900, 100.04, 100.06), (5_000, 100.06, 100.08)]
TRADES = [(1_400, 100.02), (2_400, 100.04), (3_050, 100.03), (3_899, 100.07), (4_800, 100.08)]

qt = [q[0] for q in QUOTES]


def asof_backward(t):
    """Last quote at or before t. The only join a trade classifier may use."""
    i = bisect.bisect_right(qt, t) - 1
    return None if i < 0 else QUOTES[i]


def nearest(t):
    """Nearest quote in either direction -- looks like a reasonable default. It isn't."""
    i = bisect.bisect_left(qt, t)
    cands = [j for j in (i - 1, i) if 0 <= j < len(QUOTES)]
    return QUOTES[min(cands, key=lambda j: abs(qt[j] - t))]


def classify(px, bid, ask):
    mid = 0.5 * (bid + ask)
    return "BUY " if px > mid else ("SELL" if px < mid else "MID ")


print("  trade_us    px |  as-of (backward)        | nearest (peeks forward)")
print("-" * 76)
flips = 0
for t, px in TRADES:
    b = asof_backward(t)
    n = nearest(t)
    cb, cn = classify(px, b[1], b[2]), classify(px, n[1], n[2])
    flips += cb != cn
    print(f"{t:>10} {px:6.2f} | q@{b[0]:<6} {b[1]:.2f}/{b[2]:.2f} {cb} | "
          f"q@{n[0]:<6} {n[1]:.2f}/{n[2]:.2f} {cn}"
          + ("   <-- used a quote from the FUTURE" if n[0] > t else ""))

print(f"\nsign flips caused by the nearest-quote join: {flips} of {len(TRADES)} trades")
print("a trade 1 microsecond before a quote update is classified by that update,")
print("which is the one quote the trader provably could not have seen.")

# The other half of the contract: no quote at all before the first trade.
print("\nedge case, a trade before the first quote:", asof_backward(500))
print("an as-of join must return NULL there, not the first quote it can find.")
