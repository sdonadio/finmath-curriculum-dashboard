import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import functools

CALLS = {"raw": 0, "memo": 0}


def realised_vol(sym, day, window):
    """Stands in for an expensive windowed aggregation over a tick table."""
    CALLS["raw"] += 1
    rng = np.random.default_rng(sum(map(ord, sym)) * 997 + day)
    return float(np.std(rng.normal(0, 0.01, window), ddof=1) * np.sqrt(252))


@functools.lru_cache(maxsize=128)
def realised_vol_memo(sym, day, window):
    CALLS["memo"] += 1
    rng = np.random.default_rng(sum(map(ord, sym)) * 997 + day)
    return float(np.std(rng.normal(0, 0.01, window), ddof=1) * np.sqrt(252))


# A realistic access pattern: a 3-name x 4-day grid, visited by three different
# report sections that overlap heavily.
REQUESTS = ([("AAA", d, 500) for d in range(4)] +
            [("BBB", d, 500) for d in range(4)] +
            [("AAA", d, 500) for d in range(4)] +           # the risk section again
            [("CCC", d, 500) for d in range(2)] +
            [("AAA", 0, 500), ("BBB", 1, 500), ("AAA", 0, 500)])

raw_out = [realised_vol(*r) for r in REQUESTS]
memo_out = [realised_vol_memo(*r) for r in REQUESTS]

info = realised_vol_memo.cache_info()
print(f"requests issued            : {len(REQUESTS)}")
print(f"distinct (sym, day, window): {len(set(REQUESTS))}")
print(f"uncached function calls    : {CALLS['raw']}")
print(f"memoised function calls    : {CALLS['memo']}")
print(f"cache hits {info.hits}, misses {info.misses}, "
      f"hit rate {info.hits / (info.hits + info.misses):.1%}")
print(f"work avoided               : {1 - CALLS['memo'] / CALLS['raw']:.1%} of the calls")
print(f"ANSWERS IDENTICAL          : {raw_out == memo_out}")
print(f"max abs difference         : {max(abs(a - b) for a, b in zip(raw_out, memo_out)):.1e}")

# The correctness precondition, stated out loud.
print("\nmemoisation is only sound for a PURE function of its arguments.")
counter = {"n": 0}


@functools.lru_cache(maxsize=None)
def impure(day):
    counter["n"] += 1
    return counter["n"]          # depends on call history, not on `day`


print(f"  impure(1) first call {impure(1)}, second call {impure(1)}, "
      f"underlying invocations {counter['n']}")
print("  the second call returned a stale answer that happened to be right;")
print("  with a mutable default, a clock, or a file read in there, it would not be.")
