import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json

# Every run emits a lineage record: what it produced, from what, with which
# code and which parameters. That record is the pipeline's audit trail.
RUNS = [
    {"out": "raw/crsp@v1", "ins": [], "code": "fetch.py@a1b2c3", "params": {"vendor_asof": "2026-09-26"}},
    {"out": "raw/funda@v1", "ins": [], "code": "fetch.py@a1b2c3", "params": {"vendor_asof": "2026-09-26"}},
    {"out": "cur/crsp@v4", "ins": ["raw/crsp@v1"], "code": "clean.py@d4e5f6", "params": {"winsor": 0.01}},
    {"out": "cur/funda@v2", "ins": ["raw/funda@v1"], "code": "clean.py@d4e5f6", "params": {"units": "thousands"}},
    {"out": "cur/panel@v7", "ins": ["cur/crsp@v4", "cur/funda@v2"], "code": "join.py@778899",
     "params": {"asof": True, "lag_days": 0}},
    {"out": "out/signal@v3", "ins": ["cur/panel@v7"], "code": "signal.py@aabbcc", "params": {"zwin": 60}},
    {"out": "out/pnl@v3", "ins": ["out/signal@v3"], "code": "bt.py@ddeeff", "params": {"tc_bps": 5}},
]
BY_OUT = {r["out"]: r for r in RUNS}


def fingerprint(artifact):
    r = BY_OUT.get(artifact)
    if r is None:
        return "EXTERNAL:" + artifact
    payload = {"code": r["code"], "params": r["params"],
               "ins": sorted(fingerprint(i) for i in r["ins"])}
    return hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()[:12]


def ancestry(artifact, depth=0, seen=None):
    seen = seen if seen is not None else []
    r = BY_OUT.get(artifact)
    seen.append((depth, artifact, r["code"] if r else "-", r["params"] if r else {}))
    for i in (r["ins"] if r else []):
        ancestry(i, depth + 1, seen)
    return seen


print("the number on the desk's report is out/pnl@v3. Where did it come from?\n")
for depth, art, code, params in ancestry("out/pnl@v3"):
    print(f"{'  ' * depth}{'└─ ' if depth else ''}{art:<16} "
          f"code {code:<20} params {params}")

print(f"\nfingerprint of out/pnl@v3 : {fingerprint('out/pnl@v3')}")

# The inverse query -- the one you need during an incident.
def descendants(artifact):
    out = []
    for r in RUNS:
        if artifact in r["ins"]:
            out.append(r["out"])
            out += descendants(r["out"])
    return out


for bad in ("raw/funda@v1", "cur/crsp@v4"):
    print(f"\nif {bad} turns out to be wrong, these must be rebuilt and")
    print(f"these reports must be recalled: {descendants(bad)}")

# And the change-detection query: one parameter moved, what moved with it.
base = {r["out"]: fingerprint(r["out"]) for r in RUNS}
BY_OUT["out/signal@v3"] = dict(BY_OUT["out/signal@v3"], params={"zwin": 120})
new = {r["out"]: fingerprint(r["out"]) for r in RUNS}
print(f"\nchanging signal's zwin from 60 to 120 moves "
      f"{sum(base[k] != new[k] for k in base)}/{len(base)} fingerprints: "
      f"{[k for k in base if base[k] != new[k]]}")
print("Lineage is what turns 'the number changed' into a one-line answer.")
