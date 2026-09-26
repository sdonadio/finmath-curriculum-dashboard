import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import csv
import io

# A CRSP-shaped row with the four things CSV cannot carry: a leading-zero
# identifier, a genuine missing value, a boolean, and a big integer.
rows = [
    {"permno": "010145", "date": "2026-06-30", "ret": 0.0134, "vol": 9, "delisted": False},
    {"permno": "093436", "date": "2026-06-30", "ret": None, "vol": 100, "delisted": False},
    {"permno": "014593", "date": "2026-06-30", "ret": -0.0072, "vol": 1000, "delisted": True},
]

buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=list(rows[0]))
w.writeheader()
for r in rows:
    w.writerow(r)
text = buf.getvalue()
print("the CSV as written:")
print("  " + "\n  ".join(text.strip().split("\n")))

back = list(csv.DictReader(io.StringIO(text)))
print("\nwhat comes back, and what type it is:")
for k in rows[0]:
    got = back[1][k]
    print(f"  {k:<9} {got!r:<14} {type(got).__name__}")

print("\nfour concrete breakages:")
# 1. numeric-looking identifier
print(f"  1 int(permno)            -> {int(back[0]['permno'])}  (the leading zero is gone forever)")
# 2. sorting strings that look like numbers
vols = [r["vol"] for r in back]
print(f"  2 sorted as text         -> {sorted(vols)}")
print(f"    sorted as numbers      -> {sorted(int(v) for v in vols)}")
# 3. missing vs empty
print(f"  3 ret for permno 093436  -> {back[1]['ret']!r}  is it NULL, or zero, or 'not reported'?")
# 4. bool('False')
print(f"  4 bool('False')          -> {bool(back[0]['delisted'])}  every row now reads as delisted")

typed = [{"permno": r["permno"],
          "ret": float(r["ret"]) if r["ret"] != "" else None,
          "vol": int(r["vol"]),
          "delisted": r["delisted"] == "True"} for r in back]
print(f"\nwith an explicit schema at the boundary: delisted flags = "
      f"{[t['delisted'] for t in typed]}, mean ret over non-null = "
      f"{np.mean([t['ret'] for t in typed if t['ret'] is not None]):.4f}")
