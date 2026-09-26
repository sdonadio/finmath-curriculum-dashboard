import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# The same fill stream three ways. Events carry (fill_id, rev, sym, qty_signed).
STREAM = [(1, 1, "AAA", 100), (2, 1, "AAA", 200), (3, 1, "BBB", -150),
          (4, 1, "AAA", -100), (4, 2, "AAA", -120)]      # fill 4 amended downward
REPLAY = STREAM + STREAM[2:]                              # a partial replay of the tail

cx = sqlite3.connect(":memory:")
cx.executescript("""
CREATE TABLE ledger(seq INTEGER PRIMARY KEY AUTOINCREMENT, fill_id INT, rev INT,
                    sym TEXT, qty INT);
CREATE TABLE snap(fill_id INT PRIMARY KEY, rev INT, sym TEXT, qty INT);
""")

# APPEND-ONLY: never update, never delete. Duplicates are expected; the READ
# deduplicates by (fill_id, max rev) and by keeping only the first arrival.
cx.executemany("INSERT INTO ledger(fill_id, rev, sym, qty) VALUES (?,?,?,?)", REPLAY)
# UPSERT SNAPSHOT: one row per fill, latest revision wins.
cx.executemany("INSERT INTO snap VALUES (?,?,?,?) ON CONFLICT(fill_id) DO UPDATE"
               " SET rev=excluded.rev, sym=excluded.sym, qty=excluded.qty"
               " WHERE excluded.rev > snap.rev", REPLAY)
cx.commit()

naive = dict(cx.execute("SELECT sym, SUM(qty) FROM ledger GROUP BY sym").fetchall())
deduped = dict(cx.execute("""
    SELECT sym, SUM(qty) FROM (
      SELECT fill_id, sym, qty, rev,
             ROW_NUMBER() OVER (PARTITION BY fill_id ORDER BY rev DESC, seq DESC) AS rn
      FROM ledger)
    WHERE rn = 1 GROUP BY sym""").fetchall())
snapshot = dict(cx.execute("SELECT sym, SUM(qty) FROM snap GROUP BY sym").fetchall())
truth = {"AAA": 100 + 200 - 120, "BBB": -150}

print(f"ledger rows written (with the replay) : "
      f"{cx.execute('SELECT COUNT(*) FROM ledger').fetchone()[0]}")
print(f"snapshot rows                         : "
      f"{cx.execute('SELECT COUNT(*) FROM snap').fetchone()[0]}")
print(f"\n{'read path':<34}{'AAA':>7}{'BBB':>7}   correct")
for name, got in (("append-only, SUM(qty) raw", naive),
                  ("append-only, dedup on read", deduped),
                  ("upsert snapshot", snapshot)):
    print(f"{name:<34}{got.get('AAA', 0):>7}{got.get('BBB', 0):>7}   {got == truth}")
print(f"{'ground truth':<34}{truth['AAA']:>7}{truth['BBB']:>7}")

print("\nappend-only keeps the amendment history: you can still answer 'what did")
print("we think on Tuesday'. Query:")
for r in cx.execute("SELECT fill_id, rev, qty FROM ledger WHERE fill_id=4 ORDER BY seq"):
    print(f"  fill 4 revision {r[1]} -> qty {r[2]}")
print("the snapshot cannot answer that at all -- it overwrote revision 1.")
print("Append-only costs storage and a window function; it buys you an audit trail.")
