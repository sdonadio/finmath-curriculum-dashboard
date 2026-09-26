import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import os
import tempfile

import pyarrow as pa
import pyarrow.dataset as ds
import pyarrow.parquet as pq

# 20 days x 5 symbols of synthetic tape, written as a hive-partitioned dataset.
rng = np.random.default_rng(32800)
DAYS = [f"2026-09-{d:02d}" for d in range(1, 21)]
SYMS = ["ESZ6", "NQZ6", "CLX6", "GCZ6", "ZNZ6"]
PER = 2_000
rows = {"date": [], "sym": [], "px": [], "qty": []}
for d in DAYS:
    for s in SYMS:
        rows["date"] += [d] * PER
        rows["sym"] += [s] * PER
        rows["px"] += list(np.round(100 + rng.normal(0, 1, PER), 3))
        rows["qty"] += list(rng.integers(1, 20, PER))
tbl = pa.table(rows)

with tempfile.TemporaryDirectory() as root:
    part = os.path.join(root, "partitioned")
    flat = os.path.join(root, "flat.parquet")
    pq.write_to_dataset(tbl, part, partition_cols=["date", "sym"])
    pq.write_table(tbl, flat)

    dset = ds.dataset(part, format="parquet", partitioning="hive")
    nfrag = len(list(dset.get_fragments()))
    print(f"dataset: {tbl.num_rows:,} rows, {nfrag} partition files "
          f"({len(DAYS)} dates x {len(SYMS)} symbols)")

    def scanned(dataset, flt):
        frags = list(dataset.get_fragments(filter=flt)) if flt is not None \
            else list(dataset.get_fragments())
        return len(frags), sum(f.count_rows() for f in frags)

    print(f"\n{'query':<42}{'files':>7}{'rows scanned':>14}{'rows kept':>11}{'waste':>8}")
    queries = [
        ("everything", None),
        ("date = 2026-09-07", ds.field("date") == "2026-09-07"),
        ("sym = CLX6", ds.field("sym") == "CLX6"),
        ("date = 2026-09-07 AND sym = CLX6",
         (ds.field("date") == "2026-09-07") & (ds.field("sym") == "CLX6")),
        ("px > 103  (NOT a partition column)", ds.field("px") > 103.0),
    ]
    for label, flt in queries:
        nf, ns = scanned(dset, flt)
        kept = dset.count_rows(filter=flt) if flt is not None else tbl.num_rows
        print(f"{label:<42}{nf:>7}{ns:>14,}{kept:>11,}{ns / max(kept, 1):>7.1f}x")

    nf, ns = scanned(ds.dataset(flat, format="parquet"),
                     (ds.field("date") == "2026-09-07") & (ds.field("sym") == "CLX6"))
    print(f"{'same query on the UNpartitioned file':<42}{nf:>7}{ns:>14,}"
          f"{PER:>11,}{ns / PER:>7.1f}x")

print("\npartitioning is not compression; it is a way of making the FILE PATH carry")
print("a predicate, so a filter on it eliminates whole files without opening them.")
print("Filter on a non-partition column and you are back to reading everything --")
print("which is why the partition key must be the column your queries actually use.")
