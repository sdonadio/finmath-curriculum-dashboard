import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib

# A distributed engine is the week-4 DAG with each task split into P parallel
# partitions. The one new failure mode is SKEW: hash the key, and the biggest
# key still lands entirely on one worker.
rng = np.random.default_rng(32800)
N, P = 200_000, 16

# A realistic symbol mix: one dominant front-month contract plus a long tail.
SYMS = [f"S{i:03d}" for i in range(400)]
w = np.concatenate([[0.55, 0.12, 0.06], np.full(397, 0.27 / 397)])
keys = rng.choice(SYMS, size=N, p=w)


def part_of(k, p):
    return int(hashlib.md5(k.encode()).hexdigest(), 16) % p


def skew(counts):
    c = np.asarray(counts, dtype=float)
    return c.max() / c.mean()


counts = np.zeros(P, dtype=int)
for k in keys:
    counts[part_of(k, P)] += 1
print(f"{N:,} rows, {len(SYMS)} distinct keys, {P} partitions")
print(f"hash partitioning by key : min {counts.min():,}  mean {counts.mean():,.0f}  "
      f"max {counts.max():,}  SKEW {skew(counts):.2f}x")
print(f"a level finishes when its SLOWEST partition finishes, so the wall-clock")
print(f"cost is set by {counts.max():,} rows, not by {counts.mean():,.0f}.")

# More partitions do not fix key skew: one key cannot be split by hashing.
print(f"\n{'partitions':>11}{'max part':>11}{'mean':>10}{'skew':>8}")
for p in (4, 16, 64, 256, 1024):
    c = np.zeros(p, dtype=int)
    for k in keys:
        c[part_of(k, p)] += 1
    print(f"{p:>11}{c.max():>11,}{c.mean():>10,.0f}{skew(c):>7.2f}x")
top = (keys == "S000").sum()
print(f"floor: key S000 alone is {top:,} rows ({top / N:.0%}); no hash of the key")
print("can put it on two workers, so skew >= 0.55 * P no matter what P is.")

# The standard fix: salt the hot keys, aggregate twice.
SALTS = 8
c2 = np.zeros(P, dtype=int)
for i, k in enumerate(keys):
    salt = i % SALTS if k in ("S000", "S001") else 0
    c2[part_of(f"{k}#{salt}", P)] += 1
print(f"\nsalting the two hottest keys {SALTS} ways: max {c2.max():,}  "
      f"SKEW {skew(c2):.2f}x  (from {skew(counts):.2f}x)")
print("The cost is a second aggregation pass to re-combine the salted groups.")
print("Same DAG, same idempotency rules, same quality gates -- one more failure mode.")
