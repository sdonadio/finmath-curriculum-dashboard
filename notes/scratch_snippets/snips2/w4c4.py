import numpy as np
np.seterr(all="ignore")

# A synthetic stable asset (or a wrapped one) backed by OVER-collateralized
# crypto -- lock $150 of ETH to mint $100 of the synthetic -- is solvent
# only as long as collateral value stays above a liquidation threshold. A
# sharp enough price drop pushes many positions below threshold AT ONCE,
# and the forced selling used to close them out pushes the collateral
# asset's price down FURTHER, which can push the NEXT band of positions
# underwater too -- a liquidation cascade, not an independent-failure model.

rng = np.random.default_rng(31200 + 5)
n_positions = 2000
collateral_ratio = rng.normal(1.55, 0.18, n_positions).clip(1.15, 2.20)   # each vault's own C-ratio
debt_usd = rng.uniform(1_000, 50_000, n_positions)
collateral_eth = debt_usd * collateral_ratio / 3_000.0                     # ETH at $3,000 initially

liquidation_threshold = 1.30       # below this C-ratio, a vault is liquidatable

def system_state(eth_price):
    c_ratio_now = (collateral_eth * eth_price) / debt_usd
    liquidatable = c_ratio_now < liquidation_threshold
    return liquidatable

def cascade(initial_drop_pct, price_impact_per_eth_sold=2.5e-7):
    price = 3_000.0 * (1 - initial_drop_pct)
    total_liquidated_usd = 0.0
    rounds = 0
    already_liquidated = np.zeros(n_positions, dtype=bool)
    while True:
        liquidatable = system_state(price) & ~already_liquidated
        n_new = int(liquidatable.sum())
        if n_new == 0:
            break
        eth_sold = collateral_eth[liquidatable].sum()
        total_liquidated_usd += debt_usd[liquidatable].sum()
        already_liquidated |= liquidatable
        price = price * (1 - price_impact_per_eth_sold * eth_sold)   # forced selling pushes price down further
        rounds += 1
    return price, rounds, already_liquidated.sum(), total_liquidated_usd

print("system: %d vaults, ETH starts at $3,000, liquidation threshold C-ratio = %.2f\n"
      % (n_positions, liquidation_threshold))
print("initial ETH drop   final ETH price   rounds   vaults liquidated   total debt liquidated")
for drop in (0.05, 0.10, 0.15, 0.20, 0.25, 0.30):
    final_price, rounds, n_liq, debt_liq = cascade(drop)
    print("      %5.0f%%          %9.0f       %4d          %6d               $%s"
          % (drop * 100, final_price, rounds, n_liq, format(debt_liq, ",.0f")))

n_at_20 = cascade(0.20)[2]
n_at_25 = cascade(0.25)[2]
print("\ngoing from a 20% to a 25% initial shock -- a modest 5-point difference --")
print("raises vaults liquidated from %d to %d, a %.0f%% jump, because each round's"
      % (n_at_20, n_at_25, 100 * (n_at_25 / n_at_20 - 1)))
print("forced selling deepens the price move that triggers the next round")
