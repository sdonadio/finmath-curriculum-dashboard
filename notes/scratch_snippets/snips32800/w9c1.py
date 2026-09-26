import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

cx = sqlite3.connect(":memory:")
cx.executescript("""
CREATE TABLE trades(tid INT PRIMARY KEY, sym TEXT, ts INT, px REAL, qty INT);
CREATE TABLE master(sym TEXT PRIMARY KEY, sector TEXT, adv INT);
""")
TRADES = [(1, "AAA", 100, 10.00, 500), (2, "AAA", 140, 10.02, 300),
          (3, "BBB", 110,  7.50, 900), (4, "BBB", 175,  7.48, 200),
          (5, "CCC", 130, 20.10, 150), (6, "CCC", 190, 20.05, 400),
          (7, "DDD", 160,  4.25, 800)]          # DDD is NOT in the master
MASTER = [("AAA", "tech", 1_000_000), ("BBB", "energy", 400_000),
          ("CCC", "tech", 250_000), ("EEE", "financials", 90_000)]
cx.executemany("INSERT INTO trades VALUES (?,?,?,?,?)", TRADES)
cx.executemany("INSERT INTO master VALUES (?,?,?)", MASTER)
cx.commit()

q = lambda s: cx.execute(s).fetchall()
inner = q("SELECT COUNT(*), SUM(t.qty*t.px) FROM trades t JOIN master m USING(sym)")
left = q("SELECT COUNT(*), SUM(t.qty*t.px) FROM trades t LEFT JOIN master m USING(sym)")
print(f"{'join':<12}{'rows':>6}{'notional':>12}")
print(f"{'INNER':<12}{inner[0][0]:>6}{inner[0][1]:>12,.0f}")
print(f"{'LEFT':<12}{left[0][0]:>6}{left[0][1]:>12,.0f}")
print(f"the INNER join silently dropped {left[0][0] - inner[0][0]} row "
      f"({(left[0][1] - inner[0][1]) / left[0][1]:.1%} of notional)")

print("\nthe row that vanished, found by asking for it:")
for r in q("""SELECT t.sym, t.qty*t.px AS notional FROM trades t
              LEFT JOIN master m USING(sym) WHERE m.sym IS NULL"""):
    print(f"  {r[0]}  notional {r[1]:,.0f}  -- no security-master row")

print("\naggregate by sector, with the unmapped flow made VISIBLE:")
print(f"{'sector':<14}{'trades':>7}{'notional':>12}{'share':>8}")
for r in q("""SELECT COALESCE(m.sector, '<unmapped>') AS sector, COUNT(*) n,
                     SUM(t.qty*t.px) notional
              FROM trades t LEFT JOIN master m USING(sym)
              GROUP BY sector ORDER BY notional DESC"""):
    print(f"{r[0]:<14}{r[1]:>7}{r[2]:>12,.0f}{r[2] / left[0][1]:>8.1%}")

print("\nand the check that belongs in the pipeline, not in your head:")
for r in q("""SELECT (SELECT COUNT(*) FROM trades) AS trades,
                     (SELECT COUNT(*) FROM trades t JOIN master m USING(sym)) AS matched,
                     (SELECT COUNT(DISTINCT sym) FROM trades WHERE sym NOT IN
                        (SELECT sym FROM master)) AS unmapped_syms"""):
    print(f"  trades {r[0]}, matched {r[1]}, unmapped symbols {r[2]}  "
          f"-> match rate {r[1] / r[0]:.1%}")
print("Assert on the match rate. An inner join is a filter wearing a join's clothes.")
