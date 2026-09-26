import numpy as np
np.seterr(all="ignore")

# A DeFi lending pool (Compound/Aave style) sets rates ALGORITHMICALLY from
# utilization U = borrowed / supplied, not from a central bank decision.
# The standard shape is "kinked": a gentle slope below a target utilization
# (liquidity is plentiful, rates stay low to attract borrowers), then a
# STEEP slope above it (liquidity is scarce, rates spike hard to pull new
# suppliers in and push borrowers to repay before the pool runs dry).
# Supply APY is derived from borrow APY by splitting the interest borrowers
# pay among suppliers, minus the protocol's reserve factor.

def borrow_rate(utilization, base=0.0, slope1=0.04, slope2=0.75, kink=0.80):
    if utilization <= kink:
        return base + slope1 * (utilization / kink)
    excess = (utilization - kink) / (1 - kink)
    return base + slope1 + slope2 * excess

def supply_rate(utilization, reserve_factor=0.10, **kwargs):
    b = borrow_rate(utilization, **kwargs)
    return b * utilization * (1 - reserve_factor)

print("utilization   borrow APY   supply APY   spread (protocol reserve + slack)\n")
for u in (0.0, 0.20, 0.40, 0.60, 0.80, 0.85, 0.90, 0.95, 0.99):
    b = borrow_rate(u)
    s = supply_rate(u)
    print("   %5.0f%%       %6.2f%%      %6.2f%%          %6.2f pp"
          % (u * 100, b * 100, s * 100, (b - s) * 100))

# The kink's whole point: show how violently borrow APY reacts to a pool
# that suddenly gets 90% drained by a large withdrawal, versus the mild
# reaction below the kink for the same-sized utilization jump.
print("\nsame 15-percentage-point utilization jump, on either side of the %.0f%% kink:"
      % (0.80 * 100))
b_below_from, b_below_to = borrow_rate(0.50), borrow_rate(0.65)
b_above_from, b_above_to = borrow_rate(0.80), borrow_rate(0.95)
print("  below kink: 50%% -> 65%% utilization   : borrow APY %.2f%% -> %.2f%% (+%.2f pp)"
      % (b_below_from * 100, b_below_to * 100, (b_below_to - b_below_from) * 100))
print("  above kink: 80%% -> 95%% utilization   : borrow APY %.2f%% -> %.2f%% (+%.2f pp)"
      % (b_above_from * 100, b_above_to * 100, (b_above_to - b_above_from) * 100))
print("  the same-sized utilization move above the kink moves the rate %.1fx as much"
      % ((b_above_to - b_above_from) / (b_below_to - b_below_from)))

# Simulate one large borrower withdrawal event pushing utilization from 55%
# to 96%, and the immediate rate response the pool's remaining suppliers
# see -- this is the mechanism that is supposed to defend against a bank
# run on the pool's liquidity before it can be fully drained.
u_path = np.array([0.55, 0.70, 0.85, 0.92, 0.96])
b_path = np.array([borrow_rate(u) for u in u_path])
print("\nutilization spikes from a large withdrawal: %s" % [round(float(u), 2) for u in u_path])
print("borrow APY response                       : %s"
      % [round(float(x) * 100, 2) for x in b_path])
print("by 96%% utilization the borrow rate is %.1fx its level at 55%% -- exactly the"
      % (b_path[-1] / b_path[0]))
print("signal meant to make new deposits, and repayment of existing loans, urgent")
