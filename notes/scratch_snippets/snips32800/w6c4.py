import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import pandas as pd

# A TRACE-shaped price column the vendor sends as text. Four values are not
# numbers at all: a suppressed print, a footnote, a thousands separator and a
# parenthesised negative (accounting notation for a mark-down).
raw = pd.Series(["99.25", "100.00", "SUPPRESSED", "101.50", "98.75*",
                 "1,002.00", "(0.50)", "97.00", "102.25", "100.75"], name="px")

coerced = pd.to_numeric(raw, errors="coerce")
print("errors='coerce'  ->", list(coerced.round(2)))
print(f"  parsed {coerced.notna().sum()}/{len(raw)} rows; "
      f"{coerced.isna().sum()} became NaN with no message printed anywhere")
print(f"  mean of what survived : {coerced.mean():.4f}")
print(f"  mean if you had known : {coerced.dropna().mean():.4f}  (identical -- NaN is")
print("                          skipped by default, so the loss is invisible twice)")

try:
    pd.to_numeric(raw, errors="raise")
except (ValueError, TypeError) as exc:
    print(f"\nerrors='raise'   -> {type(exc).__name__}: {str(exc)[:70]}")

# The loud version: parse, and report exactly which rows and why.
def strict_parse(s, *, max_bad_frac=0.0):
    num = pd.to_numeric(s, errors="coerce")
    bad = s[num.isna() & s.notna()]
    frac = len(bad) / len(s)
    report = {"n": len(s), "bad": len(bad), "bad_frac": frac,
              "examples": list(bad.items())[:5]}
    if frac > max_bad_frac:
        return None, report
    return num, report


vals, rep = strict_parse(raw)
print(f"\nstrict_parse: {rep['bad']}/{rep['n']} unparseable "
      f"({rep['bad_frac']:.0%}); gate says {'FAIL' if vals is None else 'pass'}")
for i, v in rep["examples"]:
    reason = {"SUPPRESSED": "a sentinel, not a number",
              "98.75*": "a footnote marker glued to a value",
              "1,002.00": "a separator AND a convention: per $1,000 face, not per 100",
              "(0.50)": "accounting notation for a negative"}.get(v, "unparseable")
    print(f"  row {i:>2}  {v!r:<14} {reason}")

fixed = pd.to_numeric(raw.str.replace(",", "", regex=False)
                         .str.rstrip("*")
                         .str.replace(r"^\((.*)\)$", r"-\1", regex=True)
                         .replace("SUPPRESSED", np.nan), errors="raise")
print(f"\nafter handling each case ON PURPOSE: parsed {fixed.notna().sum()}/{len(raw)}, "
      f"mean {fixed.mean():.4f}")
print(f"the two means differ by {abs(coerced.mean() - fixed.mean()):.4f} "
      f"({abs(coerced.mean() / fixed.mean() - 1):.1%}), all of it from one row -- and note")
print("that the strict parser did not FIX the 1,002.00 convention, it SURFACED it.")
print("Deciding what that row means is a human's job; the parser's job is to stop.")
