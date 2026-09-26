import numpy as np
np.seterr(all="ignore")

def round_trip(x, decimals):
    return round(x, decimals)

CASES = [
    (1.005, 2, 1.0),
    (2.675, 2, 2.67),
    (0.1, 1, 0.1),
    (-1.5, 0, -2.0),
]

def run_parametrized(test_fn, cases):
    passed, failed = 0, []
    for i, case in enumerate(cases):
        try:
            test_fn(*case)
            passed += 1
        except AssertionError as exc:
            failed.append((i, case, str(exc)))
    return passed, failed

def test_round_trip(x, decimals, expected):
    got = round_trip(x, decimals)
    assert got == expected, f"round({x}, {decimals}) == {got}, expected {expected}"

passed, failed = run_parametrized(test_round_trip, CASES)
print(f"{passed}/{len(CASES)} parametrized cases passed")
for i, case, msg in failed:
    print(f"  case {i} {case}: {msg}")
print("\none test function covered", len(CASES), "examples instead of", len(CASES), "copy-pasted test functions")
