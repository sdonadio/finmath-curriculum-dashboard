import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Two tables you intend to join on (sym, date). The RIGHT table accidentally
# carries more than one row per key -- a vendor sent both a preliminary and a
# final record for some days, and nobody checked.
cx = sqlite3.connect(":memory:")
cx.executescript("CREATE TABLE pos(sym TEXT, dt TEXT, qty INT);"
                 "CREATE TABLE prc(sym TEXT, dt TEXT, px REAL, vintage TEXT);")
SYMS, DATES = ["AAA", "BBB", "CCC", "DDD"], [f"2026-09-{d:02d}" for d in range(1, 11)]
cx.executemany("INSERT INTO pos VALUES (?,?,?)",
               [(s, d, 100) for s in SYMS for d in DATES])
prc = [(s, d, 100.0, "final") for s in SYMS for d in DATES]
prc += [(s, d, 99.5, "prelim") for s in SYMS for d in DATES[:4]]      # the duplicates
prc += [(s, d, 99.0, "restated") for s in SYMS for d in DATES[:2]]    # and again
cx.executemany("INSERT INTO prc VALUES (?,?,?,?)", prc)
cx.commit()

n_pos = cx.execute("SELECT COUNT(*) FROM pos").fetchone()[0]
n_prc = cx.execute("SELECT COUNT(*) FROM prc").fetchone()[0]
print(f"pos {n_pos} rows, prc {n_prc} rows")

# The fan-out check you run BEFORE the join, not after the P&L looks wrong.
fan = cx.execute("SELECT MAX(c), AVG(c) FROM (SELECT COUNT(*) c FROM prc"
                 " GROUP BY sym, dt)").fetchone()
print(f"rows per (sym, dt) in prc: max {fan[0]}, mean {fan[1]:.2f}  "
      f"-> expected output rows = sum_k a_k*b_k")

joined = cx.execute("SELECT COUNT(*), SUM(qty*px) FROM pos p JOIN prc q"
                    " ON p.sym=q.sym AND p.dt=q.dt").fetchone()
dedup = cx.execute("SELECT COUNT(*), SUM(qty*px) FROM pos p JOIN prc q"
                   " ON p.sym=q.sym AND p.dt=q.dt AND q.vintage='final'").fetchone()
print(f"\n{'join':<34}{'rows out':>10}{'notional':>14}{'vs correct':>12}")
print(f"{'naive equi-join':<34}{joined[0]:>10}{joined[1]:>14,.0f}"
      f"{joined[1] / dedup[1]:>11.2f}x")
print(f"{'join to one row per key':<34}{dedup[0]:>10}{dedup[1]:>14,.0f}{1.0:>11.2f}x")

# And the cross join, which is what a forgotten ON clause actually is.
cross = cx.execute("SELECT COUNT(*) FROM pos, prc").fetchone()[0]
print(f"\ncross join pos x prc : {cross:,} rows ({n_pos} x {n_prc})")
print(f"{'m':>9} {'n':>9}{'cross rows':>14}{'at 50 B/row':>16}")
for m, n in ((1e3, 1e3), (1e4, 1e4), (1e5, 1e5), (1e6, 1e6)):
    r = m * n
    print(f"{int(m):>9,} {int(n):>9,}{r:>14.0e}{r * 50 / 1024 ** 3:>13,.1f} GB")
print("\nA cross join is the one query whose output you can size exactly before")
print("running it, and the one people run by accident. Count rows first.")
