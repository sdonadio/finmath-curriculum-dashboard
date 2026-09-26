import numpy as np
np.seterr(all="ignore")

# An overcollateralized stablecoin (MakerDAO's CDP/vault design) mints
# stablecoin against LOCKED volatile collateral at a ratio well above 100%,
# with a liquidation threshold below which anyone can trigger a forced sale
# of the collateral to repay the debt (plus a penalty) before the position
# goes underwater. The collateralization ratio is purely mechanical:
# collateral_value / debt_value, recomputed every time the collateral's
# market price moves.

def collateral_ratio(collateral_units, collateral_price, debt_stablecoin):
    return (collateral_units * collateral_price) / debt_stablecoin

collateral_units = 100.0                    # ETH locked
debt = 120_000.0                            # DAI-like stablecoin minted against it
liquidation_ratio = 1.50                    # must stay above 150%
liquidation_penalty = 0.13                  # 13% penalty on liquidation

entry_price = 2400.0
ratio0 = collateral_ratio(collateral_units, entry_price, debt)
print("vault opened: %.0f ETH collateral, %.0f DAI debt, entry price $%.0f/ETH"
      % (collateral_units, debt, entry_price))
print("initial collateralization ratio : %.1f%%  (liquidation threshold: %.0f%%)\n"
      % (ratio0 * 100, liquidation_ratio * 100))

eth_prices = np.array([2400, 2200, 2000, 1900, 1850, 1810, 1800, 1750])
print(" ETH price   collateral value   collateralization ratio   status")
liquidation_price = None
for p in eth_prices:
    ratio = collateral_ratio(collateral_units, p, debt)
    status = "LIQUIDATABLE" if ratio < liquidation_ratio else "safe"
    if status == "LIQUIDATABLE" and liquidation_price is None:
        liquidation_price = p
    print("   $%5.0f       $%9.0f           %7.1f%%             %s"
          % (p, collateral_units * p, ratio * 100, status))

exact_liq_price = liquidation_ratio * debt / collateral_units
print("\nexact liquidation price (ratio hits %.0f%% precisely) : $%.2f/ETH"
      % (liquidation_ratio * 100, exact_liq_price))

# What the vault owner LOSES to a liquidation, versus what they would have
# kept by closing the vault themselves one tick earlier.
liq_debt_repaid = debt
liq_penalty_amount = debt * liquidation_penalty
collateral_sold_value = liq_debt_repaid + liq_penalty_amount
collateral_sold_units = collateral_sold_value / exact_liq_price
collateral_returned_units = collateral_units - collateral_sold_units
print("\nat liquidation: %.0f DAI debt + %.1f%% penalty (%.0f DAI) must be covered by"
      % (liq_debt_repaid, liquidation_penalty * 100, liq_penalty_amount))
print("selling collateral -> %.3f of the %.0f ETH is sold, %.3f ETH returned to the owner"
      % (collateral_sold_units, collateral_units, collateral_returned_units))
print("versus self-closing one tick earlier (repay %.0f DAI, keep all %.0f ETH):"
      % (debt, collateral_units))
print("the %.1f%% penalty is the entire cost of waiting one tick too long" % (liquidation_penalty * 100))
