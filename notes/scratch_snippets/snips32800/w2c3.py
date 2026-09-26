import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import os
import tempfile

import pyarrow as pa
import pyarrow.csv as pacsv
import pyarrow.parquet as pq

# One synthetic order-book-shaped dataset. Deterministic; no vendor data.
rng = np.random.default_rng(32800)
N = 200_000
sym = np.array(["ESZ6", "NQZ6", "CLX6", "GCZ6"])[rng.integers(0, 4, N)]   # low cardinality
side = np.array(["B", "S"])[rng.integers(0, 2, N)]
tbl = pa.table({
    "ts_ns": np.arange(N, dtype="int64") * 1_000_000 + 1_600_000_000_000_000_000,
    "sym": pa.array(sym).dictionary_encode(),
    "side": pa.array(side).dictionary_encode(),
    "px": np.round(4500.0 + np.cumsum(rng.normal(0, 0.25, N)), 2),
    "qty": rng.integers(1, 50, N).astype("int32"),
    "level": rng.integers(0, 10, N).astype("int8"),
})

with tempfile.TemporaryDirectory() as d:
    csv_path = os.path.join(d, "book.csv")
    pq_snappy = os.path.join(d, "book.snappy.parquet")
    pq_zstd = os.path.join(d, "book.zstd.parquet")
    pq_none = os.path.join(d, "book.raw.parquet")

    pacsv.write_csv(tbl, csv_path)
    pq.write_table(tbl, pq_snappy, compression="snappy")
    pq.write_table(tbl, pq_zstd, compression="zstd")
    pq.write_table(tbl, pq_none, compression="none")

    sizes = {name: os.path.getsize(p) for name, p in
             (("csv", csv_path), ("parquet, uncompressed", pq_none),
              ("parquet, snappy", pq_snappy), ("parquet, zstd", pq_zstd))}
    base = sizes["csv"]
    print(f"{N:,} rows x {tbl.num_columns} columns")
    print(f"{'format':<24}{'bytes':>12}{'bytes/row':>11}{'vs CSV':>9}")
    for name, b in sizes.items():
        print(f"{name:<24}{b:>12,}{b / N:>11.2f}{base / b:>8.1f}x")

    def bucket(r):
        for lo, hi in ((1, 2), (2, 4), (4, 8), (8, 16)):
            if lo <= r < hi:
                return f"the {lo}-{hi}x smaller bucket"
        return "over 16x smaller" if r >= 16 else "no smaller"

    r = base / sizes["parquet, zstd"]
    print(f"\nzstd parquet lands in {bucket(r)} (ratio {r:.1f}x)")

    # And the part that matters more than the file size: what a query must read.
    pf = pq.ParquetFile(pq_zstd)
    md = pf.metadata
    per_col = {}
    for rg in range(md.num_row_groups):
        for c in range(md.num_columns):
            cc = md.row_group(rg).column(c)
            per_col[cc.path_in_schema] = per_col.get(cc.path_in_schema, 0) + cc.total_compressed_size
    total = sum(per_col.values())
    print(f"\ncolumn projection: reading only px+qty touches "
          f"{(per_col['px'] + per_col['qty']) / total:.1%} of the stored bytes; "
          f"a CSV reader must parse 100%")
