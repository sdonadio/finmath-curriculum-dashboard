import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import math

# 500 commits, numbered in order. A bug was introduced at some unknown commit
# and every commit from there on is "bad"; everything before it is "good".
N = 500
BUG_INTRODUCED_AT = 337
CALLS = {"n": 0}


def is_bad(commit_index):
    CALLS["n"] += 1
    return commit_index >= BUG_INTRODUCED_AT


def linear_scan():
    CALLS["n"] = 0
    for i in range(N):
        if is_bad(i):
            return i, CALLS["n"]
    return None, CALLS["n"]


def bisect(lo, hi):
    """lo is known good, hi is known bad. Finds the first bad commit."""
    CALLS["n"] = 0
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if is_bad(mid):
            hi = mid
        else:
            lo = mid
    return hi, CALLS["n"]


found_linear, calls_linear = linear_scan()
found_bisect, calls_bisect = bisect(0, N - 1)

print(f"{N} commits, bug introduced at commit {BUG_INTRODUCED_AT}")
print(f"\nlinear scan  : found it at commit {found_linear} after {calls_linear} tests")
print(f"bisect       : found it at commit {found_bisect} after {calls_bisect} tests")
print(f"both agree on the culprit: {found_linear == found_bisect}")
print(f"\nlog2({N}) = {math.log2(N):.2f}, ceil = {math.ceil(math.log2(N))}")
print(f"bisect's test count ({calls_bisect}) matches the log2 bound, not "
      f"a fraction of the linear scan's {calls_linear}")

print(f"\n{'true bug commit':>16}{'linear tests':>14}{'bisect tests':>14}")
for bug_at in (10, 250, 490):
    BUG_INTRODUCED_AT = bug_at
    _, cl = linear_scan()
    _, cb = bisect(0, N - 1)
    print(f"{bug_at:>16}{cl:>14}{cb:>14}")

print("\na linear scan's cost depends entirely on WHERE the bug is; bisect's")
print("cost is essentially constant, because each test discards half of")
print("whatever range is left, regardless of which half the bug turns out")
print("to be in. That is the entire reason a wide blame window over hundreds")
print("of commits collapses to under ten actual test runs.")
