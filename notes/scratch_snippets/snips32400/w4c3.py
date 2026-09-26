import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import sys

# The function under test has an off-by-one boundary bug: it should reject a
# leverage ratio of exactly the limit, but the strict inequality lets it slip
# through.
LIMIT = 3.0


def within_leverage(ratio):
    if ratio < LIMIT:          # whether the limit itself should count as
        return True            # "within" or "over" is a real business
    return False                # decision -- and it is untested either way


LINES_EXECUTED = set()


def traced_within_leverage(ratio):
    """Identical logic, instrumented to record which lines actually ran."""
    LINES_EXECUTED.add("if")
    if ratio < LIMIT:
        LINES_EXECUTED.add("return True")
        return True
    LINES_EXECUTED.add("return False")
    return False


TESTS = [
    (1.0, True),   # well under the limit
    (5.0, False),  # well over the limit
]

print("test suite:")
all_passed = True
for ratio, expected in TESTS:
    got = traced_within_leverage(ratio)
    ok = got == expected
    all_passed &= ok
    print(f"  within_leverage({ratio}) == {expected}: {'PASS' if ok else 'FAIL'}")

total_lines = 3   # "if", "return True", "return False"
print(f"\nlines executed across the whole suite: {sorted(LINES_EXECUTED)}")
print(f"line coverage: {len(LINES_EXECUTED)}/{total_lines} = "
      f"{len(LINES_EXECUTED) / total_lines:.0%}")
print(f"all tests passed: {all_passed}")

# The bug: what SHOULD happen at exactly the limit is a business decision the
# tests never state or check -- both branches already have 100% coverage.
print(f"\nwhat does within_leverage({LIMIT}) -- exactly at the limit -- return?")
boundary_result = traced_within_leverage(LIMIT)
print(f"  {boundary_result}  (never checked by either test above)")

# A mutant: flip the strict inequality to <=. Re-run the SAME test suite.
def within_leverage_mutant(ratio):
    if ratio <= LIMIT:      # mutation: < became <=
        return True
    return False


print(f"\nmutation testing: flip '<' to '<=' and re-run the exact same 2 tests")
mutant_results = [(within_leverage_mutant(r) == exp) for r, exp in TESTS]
print(f"  mutant survives (tests still pass): {all(mutant_results)}")
print(f"  but the mutant DISAGREES with the original at the boundary: "
      f"original({LIMIT})={boundary_result}, mutant({LIMIT})="
      f"{within_leverage_mutant(LIMIT)}")

print("\n100% line coverage was reached by two tests that never exercise the")
print("boundary itself, and a mutation that changes the function's actual")
print("behavior at that boundary survives both of them untouched. Coverage")
print("measures which lines RAN; it says nothing about which VALUES were")
print("tried, which is exactly the gap a boundary bug lives in.")
