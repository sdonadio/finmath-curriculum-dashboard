import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A tiny property-based tester: instead of hand-picking a few example inputs,
# draw many random inputs from a seeded RNG and check that a general LAW
# holds for every one of them, stopping at the first counterexample.
rng = np.random.default_rng(32400)


def round_trip_encode(price):
    """Encode a price as ticks of 0.01, for wire transmission."""
    return round(price * 100)


def round_trip_decode(ticks):
    return ticks / 100


def property_round_trip(price):
    ticks = round_trip_encode(price)
    back = round_trip_decode(ticks)
    return abs(back - price) < 1e-9


EXAMPLE_TESTS = [100.00, 54.32, 0.01, 999.99]
print("example-based tests, hand-picked by a human:")
for p in EXAMPLE_TESTS:
    print(f"  price={p:<10} round-trips: {property_round_trip(p)}")
print(f"  all example tests pass: {all(property_round_trip(p) for p in EXAMPLE_TESTS)}")


def find_counterexample(property_fn, n_trials, sampler):
    for i in range(n_trials):
        candidate = sampler()
        if not property_fn(candidate):
            return i, candidate
    return None, None


# realistic prices are already quoted to the cent; sampling anything finer
# would make even a CORRECT encoder fail to round-trip, since encoding to
# ticks of 0.01 is lossy below that precision by design
sampler = lambda: round(float(rng.uniform(0, 10_000)), 2)
trial_at, bad_price = find_counterexample(property_round_trip, 2000, sampler)
print(f"\nproperty test: 'encode then decode returns the original price', "
      f"checked over 2000 random prices")
if bad_price is not None:
    print(f"  counterexample found on trial {trial_at}: price={bad_price!r}")
    ticks = round_trip_encode(bad_price)
    back = round_trip_decode(ticks)
    print(f"  encode({bad_price!r}) = {ticks}, decode({ticks}) = {back!r}")
    print(f"  difference from the original: {abs(back - bad_price):.2e}")
else:
    print("  no counterexample found in 2000 trials")

# A second, deliberately broken encoder: truncates instead of rounding.
def round_trip_encode_buggy(price):
    return int(price * 100)   # truncation, not rounding -- biased downward


def property_round_trip_buggy(price):
    ticks = round_trip_encode_buggy(price)
    back = round_trip_decode(ticks)
    return abs(back - price) < 1e-9


trial_at2, bad_price2 = find_counterexample(property_round_trip_buggy, 2000, sampler)
print(f"\nsame property, against a truncating (buggy) encoder:")
if bad_price2 is not None:
    print(f"  counterexample found on trial {trial_at2}: price={bad_price2!r}")
    print(f"  none of the 4 hand-picked example prices above happen to expose "
          f"this, since {sum(1 for p in EXAMPLE_TESTS if not property_round_trip_buggy(p))} "
          f"of them fail against the buggy encoder too -- the bug needed to be "
          f"looked for, not stumbled into")

print("\na property-based test does not need to guess which specific input")
print("breaks the code; it only needs a law that should hold for ALL inputs,")
print("and enough random draws to make 'no counterexample in n trials' mean")
print("something. The four hand-picked examples above all happened to round")
print("cleanly and told a human nothing was wrong.")
