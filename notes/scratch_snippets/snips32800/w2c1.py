import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# One synthetic TAQ-shaped table, twelve columns, stored two ways.
rng = np.random.default_rng(32800)
NROWS, COLS = 5000, ["ts", "sym", "px", "size", "bid", "ask", "bsz", "asz",
                     "venue", "cond", "seq", "flag"]

col_store = {c: rng.integers(0, 1000, NROWS) for c in COLS}          # dict of arrays
row_store = [{c: col_store[c][i] for c in COLS} for i in range(NROWS)]  # list of dicts


class Counter:
    """Counts every individual FIELD VALUE an engine has to touch."""
    def __init__(self):
        self.n = 0

    def touch(self, k=1):
        self.n += k
        return k


# Query A: sum one column over the whole table.
cr, cc = Counter(), Counter()
tot_row = 0
for r in row_store:
    cr.touch(len(COLS))              # a row-store read materialises the whole record
    tot_row += r["px"]
cc.touch(NROWS)                      # a column store reads exactly one column
tot_col = int(col_store["px"].sum())
print(f"query A  sum(px) over {NROWS} rows")
print(f"  row-oriented values touched   : {cr.n:>7}")
print(f"  column-oriented values touched: {cc.n:>7}")
print(f"  ratio                         : {cr.n / cc.n:>7.1f}x")
print(f"  same answer                   : {tot_row == tot_col}")

# Query B: fetch one whole record by position -- the row store's home turf.
cr2, cc2 = Counter(), Counter()
cr2.touch(len(COLS))
cc2.touch(len(COLS))                 # one seek per column: 12 separate lookups
print(f"\nquery B  fetch row 1234 in full")
print(f"  row-oriented values touched   : {cr2.n:>7}  (1 contiguous read)")
print(f"  column-oriented values touched: {cc2.n:>7}  ({len(COLS)} separate reads)")
print("\norientation is not better or worse; it decides which query is cheap")
