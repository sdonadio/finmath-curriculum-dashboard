import numpy as np
np.seterr(all="ignore")
import hashlib, json

def compute_report(prices):
    return {
        "count": len(prices),
        "mean": round(sum(prices) / len(prices), 4),
        "max": max(prices),
        "min": min(prices),
    }

def golden_hash(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:16]

PRICES = [101.53, 99.71, 103.27, 98.03, 100.19]

GOLDEN_OUTPUT = compute_report(PRICES)
GOLDEN_HASH = golden_hash(GOLDEN_OUTPUT)

print("golden output (recorded once, committed to the repo):", GOLDEN_OUTPUT)
print("golden hash:", GOLDEN_HASH)

today = compute_report(PRICES)
print("\ntoday's output matches the golden file:", golden_hash(today) == GOLDEN_HASH)

def compute_report_v2(prices):
    r = compute_report(prices)
    r["mean"] = round(sum(prices) / len(prices), 2)   # a "harmless" precision change
    return r

changed = compute_report_v2(PRICES)
print("after a precision change to `mean` (4dp -> 2dp), golden test still passes?",
      golden_hash(changed) == GOLDEN_HASH)
print("golden test caught an UNREVIEWED output change:", changed)
