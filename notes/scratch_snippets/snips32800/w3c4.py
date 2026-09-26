import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sqlite3

# A bitemporal fact table. THREE dates, and confusing any two is a bug:
#   period_end     what the number is ABOUT      (event time)
#   known_from     when we could first see it    (knowledge / valid time)
#   known_to       when a newer vintage replaced it ('9999-12-31' = current)
ROWS = [
    ("AAA", "2026-06-30", "2026-07-29", "9999-12-31", 1080.0),
    ("AAA", "2026-09-30", "2026-10-28", "2027-01-20",  1120.0),
    ("AAA", "2026-09-30", "2027-01-20", "9999-12-31",   930.0),
    ("BBB", "2026-09-30", "2026-11-04", "9999-12-31",  2210.0),
]
cx = sqlite3.connect(":memory:")
cx.execute("CREATE TABLE fact(id TEXT, period_end TEXT, known_from TEXT,"
           " known_to TEXT, be REAL)")
cx.executemany("INSERT INTO fact VALUES (?,?,?,?,?)", ROWS)

Q = """SELECT id, period_end, known_from, be FROM fact
       WHERE period_end <= :period AND known_from <= :asof AND known_to > :asof
       ORDER BY id, period_end"""


def snapshot(asof, period="9999-12-31"):
    return cx.execute(Q, {"asof": asof, "period": period}).fetchall()


for asof in ("2026-08-01", "2026-11-15", "2027-02-01"):
    rows = snapshot(asof)
    txt = "  ".join(f"{r[0]}/{r[1][5:]}={r[3]:.0f}" for r in rows)
    print(f"world as known on {asof}: {txt}")

print("\nthe same physical table answers a reporting question too --")
print("'what do we NOW believe about Q3', which is a different query:")
now = cx.execute("""SELECT id, period_end, be FROM fact
                    WHERE period_end='2026-09-30' AND known_to='9999-12-31'
                    ORDER BY id""").fetchall()
print("  ", now)

print("\nand the classic bug: filtering on period_end but not on knowledge time")
bug = cx.execute("""SELECT id, period_end, known_from, be FROM fact
                    WHERE period_end <= '2026-09-30' ORDER BY id, known_from""").fetchall()
print(f"   rows returned: {len(bug)} (one fact appears twice; one is not yet public)")
for r in bug:
    print(f"     {r[0]} {r[1]} known_from {r[2]} be {r[3]:.0f}"
          + ("   <-- from the future" if r[2] > "2026-11-15" else ""))
print("\nan as-of predicate is two inequalities, not one. Drop either and you get")
print("duplicated rows or a lookahead, and both look like a plausible result.")
