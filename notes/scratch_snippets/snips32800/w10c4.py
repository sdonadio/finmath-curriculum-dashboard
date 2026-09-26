import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json
import sqlite3
from collections import deque

# The whole course in one function. Nine stages, each one a week.
RAW_PRICES = [("AAA", "2026-09-28", 210.0), ("AAA", "2026-09-29", 212.5),
              ("BBB", "2026-09-28", 51.0), ("BBB", "2026-09-29", 50.2)]
RAW_FUNDA = [("AAA", "2026-06-30", "2026-07-29", 1080.0),
             ("AAA", "2026-06-30", "2026-11-12", 940.0),      # a future restatement
             ("BBB", "2026-06-30", "2026-08-04", 420.0)]
CONTRACT = {"sym": str, "dt": str, "px": float}
DAG = {"ingest": [], "schema": ["ingest"], "asof": ["schema"], "quality": ["asof"],
       "load": ["quality"], "query": ["load"], "manifest": ["query"]}
CACHE, WORK = {}, {"n": 0}


def sha(o):
    return hashlib.sha256(json.dumps(o, sort_keys=True, default=str).encode()).hexdigest()[:12]


def topo(dag):
    indeg = {n: len(v) for n, v in dag.items()}
    kids = {n: [] for n in dag}
    for n, ups in dag.items():
        for u in ups:
            kids[u].append(n)
    q, order = deque(sorted(n for n in dag if not indeg[n])), []
    while q:
        n = q.popleft()
        order.append(n)
        for c in sorted(kids[n]):
            indeg[c] -= 1
            if not indeg[c]:
                q.append(c)
    assert len(order) == len(dag), "cyclic DAG"
    return order


def pipeline(prices, funda, asof_date, log):
    order = topo(DAG)                                          # wk4
    log.append(f"wk4  execution order: {' -> '.join(order)}")

    landed = [dict(zip(("sym", "dt", "px"), r)) for r in prices]   # wk1
    seen, dedup = set(), []
    for r in landed:
        k = (r["sym"], r["dt"])
        if k not in seen:
            seen.add(k)
            dedup.append(r)
    log.append(f"wk1  landed {len(landed)} rows, {len(dedup)} after key dedup")

    bad = [r for r in dedup if any(not isinstance(r[c], t) for c, t in CONTRACT.items())]
    assert not bad, f"schema violations: {bad}"                    # wk2/wk6
    log.append(f"wk2  schema ok: {list(CONTRACT)} typed at the boundary")

    vintages = {}
    for sym, period, ann, be in funda:                             # wk3
        if ann <= asof_date:
            cur = vintages.get(sym)
            if cur is None or (period, ann) > (cur[0], cur[1]):
                vintages[sym] = (period, ann, be)
    leaked = [f for f in funda if f[2] > asof_date]
    log.append(f"wk3  as-of {asof_date}: kept {len(vintages)} vintages, "
               f"excluded {len(leaked)} not-yet-public row(s)")

    rows = [dict(r, be=vintages[r["sym"]][2]) for r in dedup if r["sym"] in vintages]
    assert all(r["be"] > 0 and r["px"] > 0 for r in rows)          # wk6
    log.append(f"wk6  quality gate passed on {len(rows)} joined rows")

    cx = sqlite3.connect(":memory:")                               # wk5
    cx.execute("CREATE TABLE panel(sym TEXT, dt TEXT, px REAL, be REAL,"
               " PRIMARY KEY(sym, dt))")
    cx.executemany("INSERT INTO panel VALUES (:sym,:dt,:px,:be) ON CONFLICT(sym,dt)"
                   " DO UPDATE SET px=excluded.px, be=excluded.be", rows)
    cx.commit()
    log.append(f"wk5  upserted idempotently: {cx.execute('SELECT COUNT(*) FROM panel').fetchone()[0]} rows")

    key = sha([sorted(map(tuple, (r.values() for r in rows))), asof_date])   # wk7
    if key in CACHE:
        out = CACHE[key]
        log.append(f"wk7  cache HIT on key {key}, 0 new computations")
    else:
        WORK["n"] += 1
        out = cx.execute("""SELECT sym, ROUND(be/px, 6) AS bm,
                                   RANK() OVER (ORDER BY be/px DESC) AS rk
                            FROM panel WHERE dt = (SELECT MAX(dt) FROM panel)
                            ORDER BY rk""").fetchall()             # wk9
        CACHE[key] = out
        log.append(f"wk7  cache MISS on key {key}, computed once")
    log.append(f"wk8  rows read {len(rows)}, rows out {len(out)} "
               f"(fan-out {len(out) / max(len(rows), 1):.2f}x, no cross join)")
    log.append(f"wk9  {out}")

    mani = {"code": "capstone@v1", "inputs": [sha(prices), sha(funda)],
            "params": {"asof": asof_date}, "out": sha(out)}        # wk10
    return out, sha(mani), log


out1, h1, log1 = pipeline(RAW_PRICES, RAW_FUNDA, "2026-09-30", [])
for line in log1:
    print(line)
print(f"wk10 manifest hash {h1}")

out2, h2, _ = pipeline(RAW_PRICES, RAW_FUNDA, "2026-09-30", [])
print(f"\nrerun: output identical {out1 == out2}, manifest identical {h1 == h2}, "
      f"real computations so far {WORK['n']}")
out3, h3, _ = pipeline(RAW_PRICES, RAW_FUNDA, "2026-12-31", [])
print(f"as-of moved to 2026-12-31 (the restatement is now public):")
print(f"  ranking {out3}")
print(f"  manifest {h3}, differs from the 09-30 run: {h3 != h1}")
print("\nSame code, same inputs, different as-of date -> a different, CORRECT answer,")
print("and a manifest hash that says exactly which of the two you are looking at.")
