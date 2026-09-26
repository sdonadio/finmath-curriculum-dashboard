import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Ten trading days of a partitioned table. A backfill re-derives days 4..8
# because the cleaning rule changed; the new rule keeps one extra print a day.
DAYS = list(range(1, 11))
ORIGINAL = {d: [(d, i, 10 * d + i) for i in range(3)] for d in DAYS}
REDERIVED = {d: [(d, i, 10 * d + i) for i in range(4)] for d in range(4, 9)}

cx = sqlite3.connect(":memory:")
cx.execute("CREATE TABLE t(day INT, item INT, val INT)")
for d in DAYS:
    cx.executemany("INSERT INTO t VALUES (?,?,?)", ORIGINAL[d])
cx.commit()


def totals(c):
    rows = c.execute("SELECT day, COUNT(*), SUM(val) FROM t GROUP BY day ORDER BY day").fetchall()
    return {r[0]: (r[1], r[2]) for r in rows}


base = totals(cx)
print(f"before backfill: {sum(v[0] for v in base.values())} rows, "
      f"total {sum(v[1] for v in base.values())}")

# --- WRONG: blind append of the re-derived partitions
blind = sqlite3.connect(":memory:")
blind.execute("CREATE TABLE t(day INT, item INT, val INT)")
for d in DAYS:
    blind.executemany("INSERT INTO t VALUES (?,?,?)", ORIGINAL[d])
for d, rows in REDERIVED.items():
    blind.executemany("INSERT INTO t VALUES (?,?,?)", rows)
blind.commit()
b = totals(blind)

# --- RIGHT: delete-then-insert, one whole partition at a time, in a transaction
part = sqlite3.connect(":memory:", isolation_level=None)
part.execute("CREATE TABLE t(day INT, item INT, val INT)")
for d in DAYS:
    part.executemany("INSERT INTO t VALUES (?,?,?)", ORIGINAL[d])
for d, rows in REDERIVED.items():
    part.execute("BEGIN")
    part.execute("DELETE FROM t WHERE day=?", (d,))
    part.executemany("INSERT INTO t VALUES (?,?,?)", rows)
    part.execute("COMMIT")
p = totals(part)

# Run the partition backfill AGAIN -- it must not change anything.
for d, rows in REDERIVED.items():
    part.execute("BEGIN")
    part.execute("DELETE FROM t WHERE day=?", (d,))
    part.executemany("INSERT INTO t VALUES (?,?,?)", rows)
    part.execute("COMMIT")
p2 = totals(part)

print(f"\n{'day':>4}{'orig (n,sum)':>16}{'blind append':>16}{'partition swap':>17}")
for d in DAYS:
    mark = "  <- backfilled" if d in REDERIVED else ""
    print(f"{d:>4}{str(base[d]):>16}{str(b[d]):>16}{str(p[d]):>17}{mark}")
print(f"\nblind append   : {sum(v[0] for v in b.values())} rows, "
      f"total {sum(v[1] for v in b.values())}  (days 4-8 double-counted)")
print(f"partition swap : {sum(v[0] for v in p.values())} rows, "
      f"total {sum(v[1] for v in p.values())}")
print(f"run the partition swap twice more: identical = {p == p2}")
print("\nthe unit of an idempotent backfill is a PARTITION, replaced whole.")
print("Appending into a partition is how a backfill silently doubles a P&L series.")
