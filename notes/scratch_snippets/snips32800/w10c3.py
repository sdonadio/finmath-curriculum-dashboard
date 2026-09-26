import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json
import os
import platform
import sys
import tempfile

# A reproducibility manifest pins the three things a rerun needs: the CODE, the
# DATA, and the ENVIRONMENT. Its hash is the claim "this result is checkable".
CODE = {"fetch.py": "print('fetch')\n", "clean.py": "print('clean')\n",
        "signal.py": "Z = 60\n"}
PARAMS = {"zwin": 60, "tc_bps": 5, "winsor": 0.01, "asof": True}


def sha(b):
    return hashlib.sha256(b if isinstance(b, bytes) else b.encode()).hexdigest()


def build_manifest(code, params, data_dir):
    data = {}
    for f in sorted(os.listdir(data_dir)):
        with open(os.path.join(data_dir, f), "rb") as fh:
            data[f] = sha(fh.read())[:16]
    return {
        "code": {f: sha(src)[:16] for f, src in sorted(code.items())},
        "data": data,
        "params": params,
        "env": {"python": ".".join(map(str, sys.version_info[:3])),
                "platform": platform.system(),
                "numpy": np.__version__},
    }


def manifest_hash(m):
    return sha(json.dumps(m, sort_keys=True, separators=(",", ":")))[:16]


with tempfile.TemporaryDirectory() as d:
    for name, blob in (("crsp.csv", b"permno,ret\n10145,0.011\n"),
                       ("funda.csv", b"gvkey,be\nAAA,1080\n")):
        with open(os.path.join(d, name), "wb") as fh:
            fh.write(blob)

    m1 = build_manifest(CODE, PARAMS, d)
    print("manifest:")
    print(json.dumps(m1, indent=2, sort_keys=True))
    h1 = manifest_hash(m1)
    print(f"\nmanifest hash, run 1 : {h1}")
    print(f"manifest hash, run 2 : {manifest_hash(build_manifest(CODE, PARAMS, d))}"
          f"  identical {manifest_hash(build_manifest(CODE, PARAMS, d)) == h1}")

    print("\nnow perturb exactly one thing at a time:")
    cases = [
        ("one parameter (zwin 60 -> 120)", CODE, dict(PARAMS, zwin=120), None),
        ("one line of code (signal.py)", dict(CODE, **{"signal.py": "Z = 120\n"}), PARAMS, None),
        ("one input byte (crsp.csv)", CODE, PARAMS, b"permno,ret\n10145,0.012\n"),
    ]
    for label, code, params, newdata in cases:
        if newdata is not None:
            with open(os.path.join(d, "crsp.csv"), "wb") as fh:
                fh.write(newdata)
        h = manifest_hash(build_manifest(code, params, d))
        print(f"  {label:<34} -> {h}  changed {h != h1}")
        if newdata is not None:
            with open(os.path.join(d, "crsp.csv"), "wb") as fh:
                fh.write(b"permno,ret\n10145,0.011\n")

print("\nOne command rebuilds; one hash says whether the rebuild is the same run.")
print("A result reported without this hash cannot be checked by anyone, including")
print("you in six months, which is the person who will actually need to.")
