import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Batches 1 and 2 OVERLAP on fill_id 4 and 5 -- exactly what a retry after an
# ambiguous timeout looks like. Batch 2 also carries a CORRECTION to fill 4.
# rev = the vendor's monotone revision counter for that fill.
BATCH_1 = [(1, 1, "AAA", "B", 100, 10.00), (2, 1, "AAA", "B", 200, 10.02),
           (3, 1, "BBB", "S", 150, 7.50), (4, 1, "AAA", "S", 100, 10.05),
           (5, 1, "BBB", "B", 50, 7.45)]
BATCH_2 = [(4, 2, "AAA", "S", 100, 10.06),      # corrected price, revision 2
           (5, 1, "BBB", "B", 50, 7.45),        # identical replay
           (6, 1, "AAA", "B", 300, 10.01), (7, 1, "BBB", "S", 100, 7.55)]

DDL = ("CREATE TABLE fills(fill_id INTEGER PRIMARY KEY, rev INTEGER, sym TEXT,"
       " side TEXT, qty INTEGER, px REAL)")
UPSERT = ("INSERT INTO fills VALUES (?,?,?,?,?,?) ON CONFLICT(fill_id) DO UPDATE SET"
          " rev=excluded.rev, sym=excluded.sym, side=excluded.side,"
          " qty=excluded.qty, px=excluded.px")
GUARDED = UPSERT + " WHERE excluded.rev > fills.rev"     # monotone: replay-order proof


def store(ddl=DDL):
    cx = sqlite3.connect(":memory:")
    cx.execute(ddl)
    return cx


def state(cx):
    rows = cx.execute("SELECT * FROM fills ORDER BY fill_id").fetchall()
    pos = dict(cx.execute("SELECT sym, SUM(CASE side WHEN 'B' THEN qty ELSE -qty END)"
                          " FROM fills GROUP BY sym").fetchall())
    return rows, pos, round(cx.execute("SELECT SUM(qty*px) FROM fills").fetchone()[0], 2)


def play(sql, batches):
    cx = store()
    for b in batches:
        cx.executemany(sql, b)
    cx.commit()
    return state(cx)


once = play(UPSERT, [BATCH_1, BATCH_2])
twice = play(UPSERT, [BATCH_1, BATCH_2, BATCH_2, BATCH_2])
print(f"once   : {len(once[0])} rows  positions {once[1]}  notional {once[2]}")
print(f"x3 retry: {len(twice[0])} rows  positions {twice[1]}  notional {twice[2]}")
print(f"IDENTICAL STATE: {once == twice}  <- this is what idempotent means")

# Now replay OUT OF ORDER: yesterday's batch lands again after the correction.
ooo = play(UPSERT, [BATCH_1, BATCH_2, BATCH_1])
print(f"\nout-of-order replay, plain upsert : fill 4 px {ooo[0][3][5]}, "
      f"notional {ooo[2]}  identical {ooo == once}")
ooo_g = play(GUARDED, [BATCH_1, BATCH_2, BATCH_1])
print(f"out-of-order replay, rev-guarded  : fill 4 px {ooo_g[0][3][5]}, "
      f"notional {ooo_g[2]}  identical {ooo_g == play(GUARDED, [BATCH_1, BATCH_2])}")

# And the same replays with no key at all.
cx = store("CREATE TABLE fills(fill_id INTEGER, rev INTEGER, sym TEXT, side TEXT,"
           " qty INTEGER, px REAL)")
for b in (BATCH_1, BATCH_2, BATCH_2, BATCH_2):
    cx.executemany("INSERT INTO fills VALUES (?,?,?,?,?,?)", b)
cx.commit()
s = state(cx)
print(f"\nno key, same replays: {len(s[0])} rows, positions {s[1]}")
print(f"AAA overstated by {s[1]['AAA'] - once[1]['AAA']} shares -- phantom inventory")
print("a risk system will hedge and a trader will not have.")
