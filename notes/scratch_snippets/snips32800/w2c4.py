import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import os
import tempfile

import pyarrow as pa
import pyarrow.parquet as pq

# 120,000 rows of a Globex-shaped tape, written in row groups of 10,000.
rng = np.random.default_rng(7)
N, RG = 120_000, 10_000
ts = np.arange(N, dtype="int64")                       # monotone: sorted on the filter key
tbl = pa.table({"ts": ts,
                "px": np.round(4500 + np.cumsum(rng.normal(0, 0.2, N)), 2),
                "qty": rng.integers(1, 40, N).astype("int32")})

# The same data with the filter key shuffled: same bytes, useless statistics.
perm = rng.permutation(N)
shuffled = tbl.take(perm)

with tempfile.TemporaryDirectory() as d:
    for name, t in (("sorted", tbl), ("shuffled", shuffled)):
        path = os.path.join(d, f"{name}.parquet")
        pq.write_table(t, path, row_group_size=RG, compression="zstd")
        pf = pq.ParquetFile(path)
        md = pf.metadata
        lo, hi = 45_000, 46_000                        # a 1,000-row window, 0.83% of the table
        hit = 0
        for rg in range(md.num_row_groups):
            st = md.row_group(rg).column(0).statistics   # ts is column 0
            if st.max >= lo and st.min <= hi:
                hit += 1
        rows_scanned = hit * RG
        kept = len(t.filter((pa.compute.field("ts") >= lo) & (pa.compute.field("ts") <= hi)))
        print(f"{name:<9} row groups {md.num_row_groups:>3}  "
              f"groups that can hold ts in [{lo},{hi}]: {hit:>3}  "
              f"rows scanned {rows_scanned:>7,}  rows kept {kept:>5,}  "
              f"wasted-read factor {rows_scanned / max(kept, 1):>6.1f}x")

print("\nparquet statistics are min/max per row group; they only prune when the")
print("data is CLUSTERED on the column you filter. Sorting on ingest is the whole trick.")
