import numpy as np
np.seterr(all="ignore")

DIFF = """
diff --git a/pricing.py b/pricing.py
+def price(qty, px):
+    print("DEBUG", qty, px)
+    try:
+        return qty * px
+    except:
+        pass
+    # TODO: handle negative qty
"""

CHANGED_FILES = ["pricing.py"]

def check_left_in_debug_prints(diff):
    return [ln.strip() for ln in diff.splitlines()
            if ln.startswith("+") and "print(" in ln and "DEBUG" in ln]

def check_bare_except(diff):
    return [ln.strip() for ln in diff.splitlines() if ln.strip() == "+    except:"]

def check_unaddressed_todo(diff):
    return [ln.strip() for ln in diff.splitlines() if ln.startswith("+") and "TODO" in ln]

def check_missing_tests(changed_files):
    src_files = [f for f in changed_files if f.endswith(".py") and not f.startswith("test_")]
    test_files = [f for f in changed_files if f.startswith("test_") or "/test_" in f]
    return [] if test_files else src_files

findings = {
    "debug prints left in": check_left_in_debug_prints(DIFF),
    "bare except clauses": check_bare_except(DIFF),
    "unresolved TODOs": check_unaddressed_todo(DIFF),
    "source changed with no test file in the same diff": check_missing_tests(CHANGED_FILES),
}

print("mechanical pre-review pass on pricing.py's diff:")
total = 0
for label, hits in findings.items():
    print(f"  {label}: {len(hits)}")
    for h in hits:
        print(f"    {h}")
    total += len(hits)

print(f"\n{total} finding(s) -- a human reviewer should look BEFORE approving,",
      "but none of these needed a human to notice them")
