import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json

# A content-addressed cache: the key is a digest of (code version, parameters,
# input data digest). Not the call site, not the file name, not a timestamp.
STORE, STATS = {}, {"hit": 0, "miss": 0, "work": 0}


def digest(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True,
                                     separators=(",", ":")).encode()).hexdigest()


def cache_key(code_version, params, *input_digests):
    return digest({"code": code_version, "params": params,
                   "inputs": sorted(input_digests)})[:16]


def winsorised_mean(data, lo_q, hi_q, code_version="wm-1"):
    key = cache_key(code_version, {"lo_q": lo_q, "hi_q": hi_q}, digest(data))
    if key in STORE:
        STATS["hit"] += 1
        return STORE[key], key, "HIT"
    STATS["miss"] += 1
    STATS["work"] += 1
    a = np.asarray(data, dtype=float)
    lo, hi = np.quantile(a, [lo_q, hi_q])
    val = float(np.clip(a, lo, hi).mean())
    STORE[key] = val
    return val, key, "MISS"


rng = np.random.default_rng(32800)
returns = list(np.round(rng.normal(0, 0.02, 200), 6))

print(f"{'call site':<44}{'key':<18}{'result':>10}  state")
v1, k1, s1 = winsorised_mean(returns, 0.01, 0.99)
print(f"{'report.py: winsorised_mean(r, 0.01, 0.99)':<44}{k1:<18}{v1:>10.6f}  {s1}")
v2, k2, s2 = winsorised_mean(returns, hi_q=0.99, lo_q=0.01)      # kwargs, reordered
print(f"{'risk.py:   (hi_q=0.99, lo_q=0.01)':<44}{k2:<18}{v2:>10.6f}  {s2}")
v3, k3, s3 = winsorised_mean(list(returns), 0.01, 0.99)          # a copy of the data
print(f"{'tca.py:    same data, different object':<44}{k3:<18}{v3:>10.6f}  {s3}")
v4, k4, s4 = winsorised_mean(returns, 0.05, 0.95)                # different params
print(f"{'report.py: (0.05, 0.95) -- new params':<44}{k4:<18}{v4:>10.6f}  {s4}")
v5, k5, s5 = winsorised_mean(returns, 0.01, 0.99, code_version="wm-2")
print(f"{'after a bug fix: code_version wm-2':<44}{k5:<18}{v5:>10.6f}  {s5}")

print(f"\ncache entries {len(STORE)}, hits {STATS['hit']}, misses {STATS['miss']}, "
      f"real computations {STATS['work']}")
print(f"three different call sites, one key: {k1 == k2 == k3}")
print(f"different params  -> different key : {k1 != k4}")
print(f"different code    -> different key : {k1 != k5}")
print("\nkeying on the call site would have given five keys and five computations;")
print("keying on the file name would have given ONE key and two wrong answers.")
