import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json
import os
import tempfile

# The extraction contract: land the bytes exactly as they arrived, hash them,
# and do ALL interpretation later. Parsing is a read-time decision.
RAW = [
    b'{"sym":"AAA","asof":"2026-06-30","eps":"1.42","shares":"1,204,000"}',
    b'{"sym":"BBB","asof":"2026-06-30","eps":"-0.07","shares":"88,500"}',
    b'{"sym":"CCC","asof":"2026-06-30","eps":"","shares":"501,250"}',
]


def parse_v1(blob):
    """First parser: naive. int() on a thousands-separated string, float('') dies."""
    d = json.loads(blob)
    try:
        shares = int(d["shares"])
    except ValueError:
        shares = None
    try:
        eps = float(d["eps"])
    except ValueError:
        eps = None
    return {"sym": d["sym"], "eps": eps, "shares": shares}


def parse_v2(blob):
    """Second parser: same raw bytes, fixed reader. Nothing was re-fetched."""
    d = json.loads(blob)
    shares = int(d["shares"].replace(",", "")) if d["shares"] else None
    eps = float(d["eps"]) if d["eps"].strip() else None
    return {"sym": d["sym"], "eps": eps, "shares": shares}


with tempfile.TemporaryDirectory() as landing:
    manifest = []
    for i, blob in enumerate(RAW):
        path = os.path.join(landing, f"part-{i:03d}.json")
        with open(path, "wb") as fh:
            fh.write(blob)
        manifest.append({"file": os.path.basename(path), "bytes": len(blob),
                         "sha256": hashlib.sha256(blob).hexdigest()[:12]})
    print("landing zone manifest (immutable, write-once):")
    for m in manifest:
        print(f"  {m['file']}  {m['bytes']:>3}B  sha256={m['sha256']}")

    on_disk = sorted(os.listdir(landing))
    raw_again = [open(os.path.join(landing, f), "rb").read() for f in on_disk]
    print("re-read bytes identical to what landed          :", raw_again == RAW)

    print("\nschema-on-read, same bytes, two parser versions:")
    for name, fn in (("v1", parse_v1), ("v2", parse_v2)):
        rows = [fn(b) for b in raw_again]
        good = sum(1 for r in rows if r["shares"] is not None)
        total = sum(r["shares"] for r in rows if r["shares"] is not None)
        print(f"  {name}: {good}/3 share counts parsed, total {total:,}")
    print("\nfixing the reader required zero re-extraction; that is the whole point")
