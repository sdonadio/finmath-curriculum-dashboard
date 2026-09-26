import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import difflib
import re

# Two developers start from the same function and each make ONE real logic
# change, but they also format the code in their own personal style along
# the way -- different quote characters, different spacing, trailing commas.
BASE = """def size(signal, capital, cap=0.1):
    target = signal * capital
    return min(target, capital * cap)
"""

# Dev A's actual logic change: the cap becomes 0.15. But dev A also
# reformats every line's spacing on the way.
DEV_A = """def size( signal,capital,cap = 0.15 ):
    target=signal*capital
    return min( target,capital*cap )
"""

# Dev B's actual logic change: clip the result at zero too. Dev B keeps the
# original formatting untouched.
DEV_B = """def size(signal, capital, cap=0.1):
    target = signal * capital
    return max(0, min(target, capital * cap))
"""


def changed_line_count(a, b):
    diff = list(difflib.unified_diff(a.splitlines(), b.splitlines(), lineterm=""))
    body = [l for l in diff if (l.startswith("+") or l.startswith("-"))
            and not l.startswith("+++") and not l.startswith("---")]
    return body


def normalize(src):
    """A minimal, deterministic formatter: collapse whitespace, drop spaces
    just inside parentheses, use one spacing convention around operators."""
    src = re.sub(r"[ \t]+", " ", src)
    src = re.sub(r"\(\s+", "(", src)
    src = re.sub(r"\s+\)", ")", src)
    src = re.sub(r"\s*=\s*", "=", src)
    src = re.sub(r"\s*\*\s*", "*", src)
    src = re.sub(r",\s*", ", ", src)
    return src


diff_a_raw = changed_line_count(BASE, DEV_A)
diff_b_raw = changed_line_count(BASE, DEV_B)
print(f"raw diff, base -> dev A's version: {len(diff_a_raw)} changed lines")
for line in diff_a_raw:
    print("  " + line)
print(f"\nraw diff, base -> dev B's version: {len(diff_b_raw)} changed lines")
for line in diff_b_raw:
    print("  " + line)

norm_base, norm_a = normalize(BASE), normalize(DEV_A)
diff_a_norm = changed_line_count(norm_base, norm_a)
print(f"\nsame comparison, base and dev A's version BOTH run through the "
      f"identical formatter first: {len(diff_a_norm)} changed line(s)")
for line in diff_a_norm:
    print("  " + line)

print(f"\ndev A's raw diff touched all {len(diff_a_raw)} lines of the "
      f"function for what is, underneath the reformatting, a one-parameter "
      f"change (0.1 -> 0.15). Dev B, who never reformatted anything, "
      f"produced a diff of {len(diff_b_raw)} lines for a comparably small "
      f"logic change.")
print(f"normalizing formatting before diffing shrinks dev A's diff to "
      f"{len(diff_a_norm)} changed line(s) -- exactly the actual logic "
      f"change, nothing else.")
print("\na code reviewer reading the raw diff has to separately notice which")
print("of those changed lines is real and which is just dev A's editor")
print("re-wrapping whitespace. Consistent, automated formatting removes that")
print("noise before a human ever has to tell the two apart.")
