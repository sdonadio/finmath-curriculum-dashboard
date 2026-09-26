import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Two tables, joined on sym. No indexes to start with.
rng = np.random.default_rng(32800)
NT, NM = 20_000, 2_000
syms = [f"S{i:04d}" for i in range(NM)]
cx = sqlite3.connect(":memory:")
cx.executescript("CREATE TABLE tape(tid INT, sym TEXT, px REAL);"
                 "CREATE TABLE master(sym TEXT, sector TEXT);")
cx.executemany("INSERT INTO tape VALUES (?,?,?)",
               [(i, syms[int(rng.integers(0, NM))], 100.0) for i in range(NT)])
cx.executemany("INSERT INTO master VALUES (?,?)",
               [(s, "tech" if i % 3 == 0 else "other") for i, s in enumerate(syms)])
cx.commit()

SQL = ("SELECT COUNT(*) FROM tape t JOIN master m ON t.sym = m.sym "
       "WHERE m.sector = 'tech'")


def plan(c, sql):
    return [r[-1] for r in c.execute("EXPLAIN QUERY PLAN " + sql)]


print("no index:")
for line in plan(cx, SQL):
    print("   ", line)
n0 = cx.execute(SQL).fetchone()[0]
# nested-loop cost, counted by hand: for each tape row, scan the whole master
manual_scan_no_idx = NT * NM
print(f"    result {n0:,} rows; nested-loop comparisons if scanned: "
      f"{NT:,} x {NM:,} = {manual_scan_no_idx:,}")

cx.execute("CREATE INDEX ix_master_sym ON master(sym)")
cx.execute("ANALYZE")
print("\nwith an index on master(sym):")
for line in plan(cx, SQL):
    print("   ", line)
n1 = cx.execute(SQL).fetchone()[0]
manual_idx = NT * int(np.ceil(np.log2(NM)))
print(f"    result {n1:,} rows (identical: {n0 == n1}); B-tree probes: "
       f"{NT:,} x ceil(log2 {NM:,}) = {manual_idx:,}")
print(f"    work ratio: {manual_scan_no_idx / manual_idx:,.0f}x fewer comparisons")

cx.execute("CREATE INDEX ix_master_sector_sym ON master(sector, sym)")
cx.execute("ANALYZE")
print("\nwith a covering index on master(sector, sym):")
for line in plan(cx, SQL):
    print("   ", line)
print(f"    result {cx.execute(SQL).fetchone()[0]:,} rows")

print("\nnote the first plan: with no index available sqlite BUILT one on the fly")
print("(AUTOMATIC COVERING INDEX) -- it paid the build cost inside the query,")
print("every time you run it, instead of once at schema time.")
print("\nread the plan, not the clock. SCAN means every row; SEARCH ... USING INDEX")
print("means a B-tree probe per outer row. The asymptotics are n*m versus n*log m,")
print("and that gap is why an unindexed research join dies as the panel grows.")
