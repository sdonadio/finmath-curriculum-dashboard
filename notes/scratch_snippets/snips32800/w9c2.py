import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Synthetic trade/quote-shaped rows: three symbols, six prints each.
rng = np.random.default_rng(32800)
rows, tid = [], 0
for sym, p0 in (("AAA", 100.0), ("BBB", 50.0), ("CCC", 20.0)):
    px = p0
    for k in range(6):
        px = round(px + rng.normal(0, 0.05), 4)
        tid += 1
        rows.append((tid, sym, 1000 + 10 * k, px,
                     int(rng.integers(1, 6)) * 100, "B" if k % 2 == 0 else "S"))

cx = sqlite3.connect(":memory:")
cx.execute("CREATE TABLE tape(tid INT PRIMARY KEY, sym TEXT, ts INT, px REAL,"
           " qty INT, side TEXT)")
cx.executemany("INSERT INTO tape VALUES (?,?,?,?,?,?)", rows)
cx.commit()

Q = """
SELECT sym, ts, px, qty, side,
       SUM(CASE side WHEN 'B' THEN qty ELSE -qty END)
           OVER (PARTITION BY sym ORDER BY ts)                  AS signed_cum,
       LAG(px)  OVER (PARTITION BY sym ORDER BY ts)             AS prev_px,
       LEAD(ts) OVER (PARTITION BY sym ORDER BY ts)             AS next_ts,
       AVG(px)  OVER (PARTITION BY sym ORDER BY ts
                      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS ma3,
       RANK()   OVER (PARTITION BY sym ORDER BY qty DESC)       AS qty_rank
FROM tape ORDER BY sym, ts"""

print(f"{'sym':<5}{'ts':>6}{'px':>9}{'qty':>5}{'sd':>4}{'cum':>7}"
      f"{'ret_bps':>9}{'gap':>5}{'ma3':>9}{'rank':>5}")
for r in cx.execute(Q):
    sym, ts, px, qty, side, cum, prev, nxt, ma3, rk = r
    ret = "" if prev is None else f"{1e4 * (px / prev - 1):+.1f}"
    gap = "" if nxt is None else str(nxt - ts)
    print(f"{sym:<5}{ts:>6}{px:>9.4f}{qty:>5}{side:>4}{cum:>7}"
          f"{ret:>9}{gap:>5}{ma3:>9.4f}{rk:>5}")

print("\nthe same three questions without window functions would be three")
print("self-joins or a pandas round trip. Note what PARTITION BY buys you:")
firsts = cx.execute("""SELECT sym, COUNT(*) FROM (
    SELECT sym, LAG(px) OVER (PARTITION BY sym ORDER BY ts) AS p FROM tape)
    WHERE p IS NULL GROUP BY sym""").fetchall()
print(f"  rows with a NULL lag (one per symbol, not one in total): {firsts}")
bad = cx.execute("""SELECT COUNT(*) FROM (
    SELECT LAG(px) OVER (ORDER BY ts) AS p FROM tape) WHERE p IS NULL""").fetchone()[0]
print(f"  drop PARTITION BY and only {bad} row has a NULL lag: every symbol's")
print("  first print now takes its 'previous price' from a DIFFERENT symbol,")
print("  which is a return of thousands of basis points out of thin air.")
