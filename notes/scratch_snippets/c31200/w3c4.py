import numpy as np
np.seterr(all="ignore")

# EIP-1559-style fee markets replace a first-price auction for block space
# with an ALGORITHMIC base fee: every block has a target size, and the base
# fee for the NEXT block moves up if this block was more than half full,
# down if less, by up to 1/8 (12.5%) per block. Users then add a small
# "priority fee" tip on top to get included; the base fee itself is burned,
# not paid to any miner, so it is a pure congestion price, not revenue.

def next_base_fee(base_fee, gas_used, gas_target, max_change=0.125):
    if gas_used == gas_target:
        return base_fee
    delta = (gas_used - gas_target) / gas_target
    delta = np.clip(delta, -1.0, 1.0)
    return base_fee * (1 + max_change * delta)

gas_target = 15_000_000
base_fee = 30.0                                    # gwei
rng = np.random.default_rng(31200 + 6)

# Sustained demand ABOVE target: every block is 100% full (double target).
print("SUSTAINED CONGESTION: every block uses 2x the target gas\n")
fee = base_fee
print(" block   base fee (gwei)")
for block in range(10):
    print("   %2d       %7.3f" % (block, fee))
    fee = next_base_fee(fee, gas_target * 2, gas_target)
print("   %2d       %7.3f  (still rising, 12.5%% per block, converging toward whatever" % (10, fee))
print("            fee finally pushes ENOUGH users out to bring usage back to target)")

# Demand drops to exactly the target: fee should stop moving immediately.
print("\ndemand drops to EXACTLY the target for 3 blocks:")
for _ in range(3):
    print("   base fee = %7.3f  (gas_used == gas_target -> no change)" % fee)
    fee = next_base_fee(fee, gas_target, gas_target)

# Realistic fluctuating demand: simulate 200 blocks of gas usage as a noisy
# process around a demand level that itself drifts, and track how base fee
# tracks it -- this is the mechanism's actual job, done continuously.
n_blocks = 200
demand_level = gas_target * (1.0 + 0.15 * np.sin(np.arange(n_blocks) / 20.0))
gas_used = np.clip(demand_level + rng.normal(0, gas_target * 0.08, n_blocks), 0, gas_target * 2)

fee = base_fee
fees = [fee]
for i in range(n_blocks):
    fee = next_base_fee(fee, gas_used[i], gas_target)
    fees.append(fee)
fees = np.array(fees)

print("\n200-block simulation with demand oscillating +/-15%% around target, plus noise:")
print("  base fee: min=%.3f  max=%.3f  mean=%.3f  (started at %.3f)"
      % (fees.min(), fees.max(), fees.mean(), base_fee))

# The base fee INTEGRATES the congestion signal (each block nudges it by up
# to 12.5%) rather than mirroring it instantly, so it is closer to a running
# sum of demand than to demand itself -- find the lag at which the fee's
# correlation with PAST demand peaks, to show concretely how far behind it
# runs.
best_lag, best_corr = 0, -1.0
for lag in range(0, 40):
    c = np.corrcoef(gas_used[:n_blocks - lag], fees[1 + lag:])[0, 1]
    if c > best_corr:
        best_lag, best_corr = lag, c
same_block_corr = np.corrcoef(gas_used, fees[1:])[0, 1]
print("  correlation(gas used, SAME-block-ahead base fee)      : %.3f" % same_block_corr)
print("  correlation peaks at a %d-block lag instead, at        : %.3f" % (best_lag, best_corr))
print("  the mechanism is a slow integrator of congestion, not a live price: it")
print("  reflects demand from many blocks ago more strongly than demand right now")
