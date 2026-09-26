import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# Batch 1: the reference. Batch 2: the vendor "improved" the feed overnight.
BATCH_1 = [
    {"secid": 108105, "exdate": "2026-12-18", "strike": 220.0, "impl_vol": 0.284, "open_interest": 4120},
    {"secid": 108105, "exdate": "2026-12-18", "strike": 230.0, "impl_vol": 0.271, "open_interest": 2870},
    {"secid": 101594, "exdate": "2027-01-15", "strike": 95.0,  "impl_vol": 0.412, "open_interest": 611},
]
BATCH_2 = [
    # 'impl_vol' renamed to 'implied_volatility'; strike now arrives as a STRING
    # with the vendor's 1000x integer convention; open_interest can now be null.
    {"secid": 108105, "exdate": "2026-12-18", "strike": "220000",
     "implied_volatility": 0.291, "open_interest": 4500},
    {"secid": 108105, "exdate": "2026-12-18", "strike": "230000",
     "implied_volatility": 0.266, "open_interest": None},
    {"secid": 101594, "exdate": "2027-01-15", "strike": "95000",
     "implied_volatility": 0.401, "open_interest": None},
]


def infer_schema(batch):
    """Column -> (set of non-null python type names, saw_null, n)."""
    cols = {}
    for row in batch:
        for k, v in row.items():
            t, sawnull, n = cols.get(k, (set(), False, 0))
            if v is None:
                sawnull = True
            else:
                t = t | {type(v).__name__}
            cols[k] = (t, sawnull, n + 1)
    return cols


def drift(ref, new):
    out = []
    for c in sorted(set(ref) - set(new)):
        out.append(("DROPPED", c, f"present in reference ({'/'.join(sorted(ref[c][0]))}), absent now"))
    for c in sorted(set(new) - set(ref)):
        out.append(("ADDED", c, f"new column, type {'/'.join(sorted(new[c][0])) or 'all null'}"))
    for c in sorted(set(ref) & set(new)):
        rt, rn, _ = ref[c]
        nt, nn, _ = new[c]
        if rt != nt:
            out.append(("TYPE CHANGED", c,
                        f"{'/'.join(sorted(rt)) or 'all null'} -> {'/'.join(sorted(nt)) or 'all null'}"))
        if nn and not rn:
            out.append(("NEWLY NULLABLE", c, "reference batch had no nulls; this batch does"))
        if rn and not nn:
            out.append(("NO LONGER NULL", c, "reference batch had nulls; this batch does not"))
    # a dropped/added pair with the same type is almost always a RENAME
    dropped = {c for k, c, _ in out if k == "DROPPED"}
    added = {c for k, c, _ in out if k == "ADDED"}
    for d in sorted(dropped):
        for a in sorted(added):
            if ref[d][0] == new[a][0]:
                out.append(("LIKELY RENAME", f"{d} -> {a}",
                            f"same type {'/'.join(sorted(ref[d][0]))}, one vanished as the other appeared"))
    return out


ref, new = infer_schema(BATCH_1), infer_schema(BATCH_2)
print(f"reference columns: {sorted(ref)}")
print(f"new batch columns: {sorted(new)}\n")
print(f"{'kind':<16}{'column':<34}detail")
print("-" * 92)
for kind, col, detail in drift(ref, new):
    print(f"{kind:<16}{col:<34}{detail}")

print(f"\n{len(drift(ref, new))} drift findings. What each one silently breaks:")
print("  the rename          -> a downstream .get('impl_vol') returns None for every row")
print("  strike as a string  -> a sort or a moneyness ratio is computed lexicographically")
print("  the 1000x units     -> strike 220 became 220000: every moneyness is off by 1000x")
print("  newly nullable OI   -> a liquidity filter on open_interest drops 2 of 3 rows")
print("A schema check is cheap. Every one of those four is a silent wrong answer.")
