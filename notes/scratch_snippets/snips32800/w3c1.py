import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Synthetic, fixed, Compustat-shaped fundamentals: one original filing per
# quarter plus ONE restatement that cut Q3 book equity, published in January.
#           gvkey, period_end,   announce_date, book_equity
FUNDA = [("AAA", "2026-03-31", "2026-04-28", 1000.0),
         ("AAA", "2026-06-30", "2026-07-29", 1080.0),
         ("AAA", "2026-09-30", "2026-10-28", 1120.0),   # as first reported
         ("AAA", "2026-09-30", "2027-01-20",  930.0)]   # restated, 3 months later
PRICES = [("AAA", "2026-08-15", 4320.0),
          ("AAA", "2026-11-15", 4100.0),
          ("AAA", "2027-02-15", 3950.0)]

cx = sqlite3.connect(":memory:")
cx.executescript("CREATE TABLE funda(gvkey TEXT, period_end TEXT, announce_date TEXT, be REAL);"
                 "CREATE TABLE prices(gvkey TEXT, trade_date TEXT, mktcap REAL);")
cx.executemany("INSERT INTO funda VALUES (?,?,?,?)", FUNDA)
cx.executemany("INSERT INTO prices VALUES (?,?,?)", PRICES)

# NAIVE: join each price to "the" fundamentals row -- latest period, latest vintage,
# with no reference at all to what was public on the trade date.
NAIVE = """
SELECT p.trade_date, f.period_end, f.announce_date, f.be, f.be / p.mktcap
FROM prices p JOIN funda f ON f.gvkey = p.gvkey
WHERE f.rowid = (SELECT rowid FROM funda WHERE gvkey = p.gvkey
                 ORDER BY period_end DESC, announce_date DESC LIMIT 1)
ORDER BY p.trade_date"""

# AS-OF: restrict to vintages already announced, then take the latest PERIOD
# among them, then the latest VINTAGE of that period. Both steps are needed.
ASOF = """
SELECT p.trade_date, f.period_end, f.announce_date, f.be, f.be / p.mktcap
FROM prices p JOIN funda f ON f.gvkey = p.gvkey
WHERE f.announce_date <= p.trade_date
  AND f.rowid = (SELECT rowid FROM funda
                 WHERE gvkey = p.gvkey AND announce_date <= p.trade_date
                 ORDER BY period_end DESC, announce_date DESC LIMIT 1)
ORDER BY p.trade_date"""

naive, asof = cx.execute(NAIVE).fetchall(), cx.execute(ASOF).fetchall()
print("           NAIVE latest-value join        CORRECT as-of join")
print("trade_date period_end announce   B/M  |  period_end announce   B/M     error")
print("-" * 78)
for n, a in zip(naive, asof):
    print(f"{n[0]}  {n[1]}  {n[2][5:]}  {n[4]:.4f} |  "
          f"{a[1]}  {a[2][5:]}  {a[4]:.4f}  {n[4] - a[4]:+.4f}")

print("\nwhat the naive join actually did:")
for n, a in zip(naive, asof):
    leak = "used a number first published " + n[2] if n[2] > n[0] else "agrees"
    print(f"  {n[0]}: {leak}"
          + (f"  ({abs(n[4] - a[4]) / a[4]:.1%} signal error)" if n[2] > n[0] else ""))
print("\ntwo of the three rows are pure lookahead, and the leak is largest")
print("exactly where the restatement was largest -- i.e. where the news was.")
