import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# The function under test: a position sizer with a hard cap.
def size(signal, capital, cap=0.1):
    target = signal * capital
    capped = max(-capital * cap, min(target, capital * cap))
    return round(capped, 2)


# A pytest.mark.parametrize-style table: one test BODY, many CASES.
CASES = [
    # (signal, capital, cap, expected)
    (0.02, 100_000, 0.1, 2000.00),      # inside the cap, uncapped
    (0.5, 100_000, 0.1, 10000.00),      # signal alone would exceed the cap
    (-0.5, 100_000, 0.1, -10000.00),    # symmetric cap on the short side
    (0.0, 100_000, 0.1, 0.00),          # zero signal
    (0.02, 100_000, 0.5, 2000.00),      # inside a wider cap
    (0.0234567, 100_000, 0.1, 2345.67), # exercises the second decimal place
]


def run_parametrized(cases):
    results = []
    for signal, capital, cap, expected in cases:
        got = size(signal, capital, cap)
        results.append((signal, capital, cap, expected, got, got == expected))
    return results


results = run_parametrized(CASES)
print(f"{'signal':>7}{'capital':>10}{'cap':>6}{'expected':>10}{'got':>10}  result")
for signal, capital, cap, expected, got, ok in results:
    print(f"{signal:>7}{capital:>10}{cap:>6}{expected:>10.2f}{got:>10.2f}  "
          f"{'PASS' if ok else 'FAIL'}")

passed = sum(1 for r in results if r[5])
print(f"\n{passed}/{len(results)} cases passed, from ONE test function and a "
      f"table of {len(CASES)} rows.")

# Contrast: the copy-pasted version -- one hand-written function per case.
COPY_PASTE_LINES = 0
for signal, capital, cap, expected in CASES:
    COPY_PASTE_LINES += 3   # def test_...(): / assert / blank line, per case
PARAMETRIZED_LINES = 3 + 1  # one def/loop body plus the table's own line count
print(f"\napproximate lines of test code: copy-pasted style ~{COPY_PASTE_LINES}, "
      f"parametrized style ~{PARAMETRIZED_LINES + len(CASES)}")

# Now break the function on purpose and show the SAME table catches it
# without a single line of new test code.
def size_buggy(signal, capital, cap=0.1):
    target = signal * capital
    capped = max(-capital * cap, min(target, capital * cap))
    return round(capped, 1)   # bug: rounds to 1 decimal instead of 2


def run_against(fn, cases):
    return [(fn(s, c, cp) == exp) for s, c, cp, exp in cases]


print(f"\nrunning the identical table against a buggy rounding change:")
outcomes = run_against(size_buggy, CASES)
print(f"  cases still passing: {sum(outcomes)}/{len(outcomes)}")
print(f"  cases newly failing: {[i for i, ok in enumerate(outcomes) if not ok]}")
print("\nthe table did not need to change at all to catch the regression --")
print("that is the whole value of writing the test once, parametrized, "
      "rather than as one bespoke function per case.")
