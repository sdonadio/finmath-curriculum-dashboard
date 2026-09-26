import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# Two sources, two identifier systems. Equity prices key on a permanent id;
# the options file keys on the vendor's own secid; a ticker is the only thing
# they share -- and tickers get REUSED.
cx = sqlite3.connect(":memory:")
cx.executescript("""
CREATE TABLE eq(permno INT, dt TEXT, px REAL);
CREATE TABLE opt(secid INT, dt TEXT, ticker TEXT, iv REAL);
CREATE TABLE xmap(permno INT, secid INT, ticker TEXT, start TEXT, stop TEXT);
""")
cx.executemany("INSERT INTO eq VALUES (?,?,?)",
               [(10145, "2026-03-31", 210.0), (10145, "2026-09-30", 224.0),
                (77777, "2026-03-31",  12.0), (77777, "2026-09-30",  14.0)])
cx.executemany("INSERT INTO opt VALUES (?,?,?,?)",
               [(108105, "2026-03-31", "OLD", 0.28), (108105, "2026-09-30", "NEW", 0.31),
                (999999, "2026-09-30", "OLD", 0.55)])      # ticker OLD was REASSIGNED
cx.executemany("INSERT INTO xmap VALUES (?,?,?,?,?)",
               [(10145, 108105, "OLD", "2000-01-01", "2026-06-30"),
                (10145, 108105, "NEW", "2026-07-01", "9999-12-31"),
                (77777, 999999, "OLD", "2026-07-01", "9999-12-31")])

naive = cx.execute("""
  SELECT o.dt, o.ticker, o.secid, e.permno, e.px, o.iv
  FROM opt o JOIN xmap m ON m.ticker = o.ticker          -- ticker only
             JOIN eq e ON e.permno = m.permno AND e.dt = o.dt
  ORDER BY o.dt, o.ticker""").fetchall()

correct = cx.execute("""
  SELECT o.dt, o.ticker, o.secid, e.permno, e.px, o.iv
  FROM opt o JOIN xmap m ON m.secid = o.secid            -- the stable id
             AND o.dt BETWEEN m.start AND m.stop         -- and the validity window
             JOIN eq e ON e.permno = m.permno AND e.dt = o.dt
  ORDER BY o.dt, o.ticker""").fetchall()

print(f"{'join':<10}{'rows':>6}   (dt, ticker, secid, permno, px, iv)")
for name, rs in (("naive", naive), ("correct", correct)):
    print(f"{name:<10}{len(rs):>6}")
    for r in rs:
        print(f"            {r}")

nk = {(r[0], r[2], r[3]) for r in naive}
ck = {(r[0], r[2], r[3]) for r in correct}
print(f"\n(dt, secid, permno) triples the naive join invented : {sorted(nk - ck)}")
print(f"triples it missed                                 : {sorted(ck - nk) or 'none'}")
print(f"rows out: naive {len(naive)} vs correct {len(correct)} -- a fan-out from"
      " a non-unique key")
print("\nthe rule: join on the most stable identifier you have, and if the mapping")
print("itself changes over time, the mapping table needs a validity window and the")
print("join needs a BETWEEN. A ticker is a display label, not a primary key.")
