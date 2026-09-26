import numpy as np
np.seterr(all="ignore")

# A contract that needs an off-chain price (to value collateral, trigger a
# liquidation, settle a bet) must read it from an ORACLE, and an oracle
# reading a single, manipulable on-chain source (a thinly traded pool's
# SPOT price) can be moved within the very same transaction that exploits
# it. Reading a TIME-WEIGHTED AVERAGE PRICE (TWAP) instead makes
# manipulation cost scale with how long you can hold the distortion, not
# with a single trade's size.

def pool_spot_after_buy(x, y, dy_in, fee=0.003):
    """Constant-product pool holding x units of the risky asset and y units
    of the quote asset. Paying dy_in of the QUOTE asset buys the risky
    asset and pushes its price UP."""
    dy_eff = dy_in * (1 - fee)
    dx_out = x * dy_eff / (y + dy_eff)
    x_new, y_new = x - dx_out, y + dy_in
    return y_new / x_new                      # new spot price (quote per risky unit)

x0, y0 = 5_000.0, 500_000.0                    # thin pool: spot price 100
spot0 = y0 / x0

# A lending protocol lets you borrow against collateral valued at the
# oracle price. Manipulate the spot up, borrow against inflated collateral,
# then (if the oracle is naive spot) walk away.
manipulation_usd = 200_000.0
spot_after = pool_spot_after_buy(x0, y0, manipulation_usd)
inflate_pct = 100 * (spot_after / spot0 - 1)
print("pool before manipulation: spot = %.2f" % spot0)
print("attacker buys $%.0f of the risky asset in this thin pool" % manipulation_usd)
print("pool after manipulation : spot = %.2f  (%.1f%% higher, in ONE transaction)\n"
      % (spot_after, inflate_pct))

collateral_units = 50.0
naive_oracle_value = collateral_units * spot_after
honest_value = collateral_units * spot0
over_borrow = naive_oracle_value - honest_value
print("borrowing against %.0f units of collateral:" % collateral_units)
print("  valued at the manipulated spot price (naive oracle) : $%.0f" % naive_oracle_value)
print("  true (pre-manipulation) value                        : $%.0f" % honest_value)
print("  amount over-borrowed against inflated collateral      : $%.0f\n" % over_borrow)

# A TWAP over N blocks needs the manipulated price to be sustained for the
# WHOLE window, each block re-arbitraged back toward fair value by anyone
# who notices, which multiplies the manipulator's cost by roughly N.
window_blocks = 30
cost_one_block = manipulation_usd * 0.003              # the fee paid on the manipulating trade
cost_twap = cost_one_block * window_blocks             # rough: re-establish the distortion each block
print("manipulating a single-block spot read costs about the trade's own fee : $%.0f" % cost_one_block)
print("sustaining that distortion across a %d-block TWAP costs roughly       : $%.0f"
      % (window_blocks, cost_twap))
print("(this is why TWAP oracles, not spot reads, are the standard defence")
print(" for anything that gates real borrowing or liquidation)")
