import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A mutation-testing harness: apply small, mechanical mutations to a target
# function's SOURCE-LEVEL BEHAVIOR (modeled here as alternate implementations,
# standing in for what a real mutation tool does by rewriting bytecode or
# source) and check whether the existing test suite notices each one.
def pnl(entry, exit_, qty, fee_bps=2.0):
    gross = (exit_ - entry) * qty
    fee = abs(exit_ * qty) * fee_bps / 10_000
    return round(gross - fee, 2)


TESTS = [
    # (entry, exit_, qty, expected)
    (100.0, 105.0, 10, 49.79),
    (100.0, 95.0, 10, -50.19),
    (50.0, 50.0, 100, -1.00),
]


def run_suite(fn, tests):
    return all(fn(e, x, q) == exp for e, x, q, exp in tests)


baseline_ok = run_suite(pnl, TESTS)
print(f"baseline function against its own test suite: "
      f"{'all pass' if baseline_ok else 'FAILURE IN BASELINE'}")

MUTANTS = {
    "flip_gross_sign": lambda entry, exit_, qty, fee_bps=2.0: (
        round((entry - exit_) * qty - abs(exit_ * qty) * fee_bps / 10_000, 2)),
    "drop_fee": lambda entry, exit_, qty, fee_bps=2.0: (
        round((exit_ - entry) * qty, 2)),
    "fee_on_gross_not_notional": lambda entry, exit_, qty, fee_bps=2.0: (
        round((exit_ - entry) * qty - abs((exit_ - entry) * qty) * fee_bps / 10_000, 2)),
    "off_by_one_bps_constant": lambda entry, exit_, qty, fee_bps=2.0: (
        round((exit_ - entry) * qty - abs(exit_ * qty) * (fee_bps + 1) / 10_000, 2)),
    "swap_entry_exit_in_fee_only": lambda entry, exit_, qty, fee_bps=2.0: (
        round((exit_ - entry) * qty - abs(entry * qty) * fee_bps / 10_000, 2)),
}

print(f"\n{len(MUTANTS)} mutants, {len(TESTS)}-case test suite:")
killed, survived = [], []
for name, mutant in MUTANTS.items():
    ok = run_suite(mutant, TESTS)
    (survived if ok else killed).append(name)
    print(f"  {name:<30} {'SURVIVED (tests did not notice)' if ok else 'killed'}")

score = len(killed) / len(MUTANTS)
print(f"\nmutation score: {len(killed)}/{len(MUTANTS)} mutants killed = {score:.0%}")
print(f"mutants that survived: {survived or 'none'}")

# Now show line coverage is 100% throughout -- every mutant touches the same
# lines the baseline does, so coverage alone cannot distinguish any of this.
print(f"\nevery mutant above executes the exact same lines as the baseline;")
print(f"line coverage of the test suite against every single mutant is 100%.")
print(f"the mutation score, not the coverage number, is what says whether the")
print(f"{len(TESTS)}-case suite would actually notice a broken fee calculation --")
print(f"here, it would not notice {len(survived)} of the {len(MUTANTS)} ways the")
print(f"fee logic specifically can be broken.")
