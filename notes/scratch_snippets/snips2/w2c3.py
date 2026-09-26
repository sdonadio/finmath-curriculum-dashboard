import numpy as np
np.seterr(all="ignore")

# Composability: a single transaction can call through several contracts in
# sequence, and the WHOLE chain is one atomic unit -- either every step
# succeeds and the final state commits, or ANY step failing reverts every
# step before it, with no partial execution ever observable on-chain. This
# is what makes multi-step, no-capital-of-your-own arbitrage possible: you
# can borrow, trade, trade again and repay, all-or-nothing, in one block.

def try_flash_arb(borrow_amount, pool_a_rate, pool_b_rate, fee_a, fee_b, flash_fee_bps):
    """Borrow `borrow_amount`, swap on pool A, swap back on pool B, repay
    the flash loan plus its fee. Returns (profit, steps) -- reverts (profit
    < 0) if the sequence cannot repay the loan."""
    steps = []
    step1 = borrow_amount
    steps.append(("flash-borrow", step1))

    step2 = step1 * pool_a_rate * (1 - fee_a)
    steps.append(("swap on pool A", step2))

    step3 = step2 * pool_b_rate * (1 - fee_b)
    steps.append(("swap on pool B", step3))

    repay = borrow_amount * (1 + flash_fee_bps / 10000.0)
    profit = step3 - repay
    steps.append(("repay flash loan + fee", repay))
    steps.append(("net profit", profit))
    return profit, steps

scenarios = [
    ("a genuine mispricing between the two pools", 100_000.0, 1.0090, 1.0060, 0.003, 0.003, 9),
    ("pools already arbitraged to consistency", 100_000.0, 1.0004, 1.0002, 0.003, 0.003, 9),
]

for label, amt, ra, rb, fa, fb, flash_bps in scenarios:
    profit, steps = try_flash_arb(amt, ra, rb, fa, fb, flash_bps)
    print("%s:" % label)
    for name, val in steps:
        print("   %-24s %14.2f" % (name, val))
    print("   -> %s\n" % ("PROFITABLE, transaction commits" if profit > 0
                          else "UNPROFITABLE -- the repay step fails, so the WHOLE transaction reverts, including the borrow and both swaps"))

print("nothing above ever leaves state half-changed: a real flash loan enforces")
print("this atomicity at the protocol level by checking the pool's balance is")
print("whole again in the SAME transaction, or reverting everything")
