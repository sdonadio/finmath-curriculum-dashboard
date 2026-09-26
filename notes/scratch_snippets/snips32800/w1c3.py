import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json

# Two overlapping fetch windows of the same TRACE-shaped tape. The vendor
# stamps every payload with when WE pulled it, and re-sends one corrected price.
def payload(trade_id, px, pulled_at):
    return {"trade_id": trade_id, "cusip": "37833100AA", "px": px,
            "size": 1_000_000, "retrieved_at": pulled_at}


pull_a = [payload(i, 99.0 + i * 0.25, "2026-09-20T09:00:00Z") for i in range(1, 7)]
pull_b = [payload(i, 99.0 + i * 0.25, "2026-09-20T15:00:00Z") for i in range(4, 10)]
pull_b[0]["px"] = 100.10          # trade 4 was corrected by the vendor


def row_hash(rec):
    blob = json.dumps(rec, sort_keys=True).encode()
    return hashlib.sha256(blob).hexdigest()[:12]


def dedup(rows, key_fn):
    store = {}
    for r in rows:
        store[key_fn(r)] = r          # last write wins
    return store


all_rows = pull_a + pull_b
print(f"rows fetched across the two overlapping windows : {len(all_rows)}")

by_hash = dedup(all_rows, row_hash)
print(f"dedup by hash of the whole row                  : {len(by_hash)} rows kept")

by_key = dedup(all_rows, lambda r: r["trade_id"])
print(f"dedup by the stable natural key (trade_id)      : {len(by_key)} rows kept")
print(f"trade 4 after key dedup: px={by_key[4]['px']}  (the correction survived)")

# The stable key has to be a fact about the TRADE, not about the transport.
volatile = [k for k in pull_a[0] if k in ("retrieved_at",)]
print(f"fields that must never enter the dedup key      : {volatile}")
counts = {}
for r in all_rows:
    counts[r["trade_id"]] = counts.get(r["trade_id"], 0) + 1
print("arrivals per trade_id                           :", dict(sorted(counts.items())))
