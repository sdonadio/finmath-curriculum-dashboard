import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import math

# A column contract, declared once, checked at the boundary on every batch.
CONTRACT = {
    "permno":   {"type": int,   "nullable": False},
    "date":     {"type": str,   "nullable": False, "regex": 10},        # length check
    "ret":      {"type": float, "nullable": True,  "range": (-0.95, 5.0)},
    "prc":      {"type": float, "nullable": False, "range": (0.0001, 1e6)},
    "shrout":   {"type": int,   "nullable": False, "range": (1, 5e10)},
}
BATCH = [
    {"permno": 10145, "date": "2026-06-30", "ret": 0.0134, "prc": 214.5, "shrout": 1_204_000},
    {"permno": 93436, "date": "2026-06-30", "ret": None,    "prc": 331.2, "shrout": 3_180_000},
    {"permno": 14593, "date": "2026-6-30",  "ret": -1.40,   "prc": -12.0, "shrout": 15_000_000},
    {"permno": None,  "date": "2026-06-30", "ret": 0.008,   "prc": 44.0,  "shrout": 900_000},
    {"permno": 22111, "date": "2026-06-30", "ret": 0.02,    "prc": None,  "shrout": 0},
]


def validate(batch, contract):
    viol = {}

    def flag(col, kind, i):
        viol.setdefault((col, kind), []).append(i)

    for i, row in enumerate(batch):
        for col, spec in contract.items():
            if col not in row:
                flag(col, "missing column", i)
                continue
            v = row[col]
            if v is None:
                if not spec["nullable"]:
                    flag(col, "null in NOT NULL column", i)
                continue
            if not isinstance(v, spec["type"]) or (isinstance(v, float) and math.isnan(v)):
                flag(col, f"type is {type(v).__name__}, want {spec['type'].__name__}", i)
                continue
            if "regex" in spec and len(v) != spec["regex"]:
                flag(col, f"length {len(v)}, want {spec['regex']}", i)
            if "range" in spec:
                lo, hi = spec["range"]
                if not lo <= v <= hi:
                    flag(col, f"outside [{lo}, {hi}]", i)
    return viol


viol = validate(BATCH, CONTRACT)
print(f"batch of {len(BATCH)} rows, {len(CONTRACT)} columns under contract")
print(f"{'column':<9}{'violation':<40}{'rows':>6}  examples")
for (col, kind), rows in sorted(viol.items()):
    print(f"{col:<9}{kind:<40}{len(rows):>6}  {rows}")
bad_rows = sorted({i for rows in viol.values() for i in rows})
print(f"\nrows with at least one violation : {len(bad_rows)}/{len(BATCH)} {bad_rows}")
print(f"rows fit to pass downstream      : {len(BATCH) - len(bad_rows)}")

print("\nnote row 2: ret = -1.40 is not merely unusual, it is IMPOSSIBLE for a")
print("simple return -- you cannot lose 140% of a long equity position. A range")
print("check catches a sign or units bug that no type check ever will.")
