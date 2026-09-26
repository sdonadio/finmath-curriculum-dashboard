import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# Back of the envelope, done once, in writing, before anyone writes a read_csv.
SCHEMA = [("ts_ns", "int64"), ("sym_id", "int32"), ("px", "float64"),
          ("size", "int32"), ("bid", "float64"), ("ask", "float64"),
          ("bid_sz", "int32"), ("ask_sz", "int32"), ("venue", "int8"),
          ("cond", "int8")]
width = sum(np.dtype(t).itemsize for _, t in SCHEMA)
print(f"{len(SCHEMA)} typed columns, {width} bytes per row")

# Calibrate the arithmetic against a real allocation, so it is not hand-waving.
arr = np.zeros(10_000, dtype=np.dtype(SCHEMA))
print(f"10,000 rows really allocated: {arr.nbytes:,} bytes = {arr.nbytes / 10_000:.0f} B/row"
      f"  (predicted {width})\n")

RAM_GB = 16.0
USABLE = 0.4                      # what you actually get to use: copies, index, engine
print(f"{'rows':>15}{'raw GB':>10}{'x3 working set':>16}"
      f"   fits in {RAM_GB:.0f}GB x {USABLE:.0%}?")
for rows in (1e6, 1e7, 1e8, 1e9, 1e10):
    gb = rows * width / 1024 ** 3
    print(f"{int(rows):>15,}{gb:>10.2f}{gb * 3:>16.2f}    "
          f"{'yes' if gb * 3 < RAM_GB * USABLE else 'NO'}")

print(f"\nthe same table as 'everything is a string' CSV, ~44 B/row and a python")
print("object per field, is roughly 10x the in-memory footprint of the typed form.")
obj = np.array([("x",) * len(SCHEMA)] * 10_000, dtype=object)
print(f"  10,000 rows as python objects: {obj.nbytes + 10_000 * len(SCHEMA) * 49:,} bytes "
      f"(array + ~49B per small str)")

# One day of a liquid future, and one year of it.
day_rows = 40e6
print(f"\none day of a liquid future at {int(day_rows):,} messages: "
      f"{day_rows * width / 1024 ** 3:.1f} GB")
print(f"one year of trading days (252)              : "
      f"{252 * day_rows * width / 1024 ** 4:.1f} TB")
print(f"the subset you usually need (2 columns, 1 hour): "
      f"{day_rows / 6.5 * 16 / 1024 ** 3:.2f} GB")
print("\nThat last line is the whole of week 8: the question is never 'how big is")
print("the dataset', it is 'how big is the part of it this query has to read'.")
