import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
n_bonds = 40
bond_prices = rng.normal(98.0, 4.0, size=n_bonds)              # price per 100 face
weights = rng.dirichlet(np.full(n_bonds, 4.0))                  # each bond's target weight in the basket

shares_created = 50_000
target_nav = 108.32                                              # a typical investment-grade bond ETF's NAV
basket_value = target_nav * shares_created                       # the basket is SIZED to deliver this NAV
basket_par = weights * basket_value / (bond_prices / 100.0)      # par amount of each bond that supplies its weight

nav_per_share = np.sum(bond_prices / 100.0 * basket_par) / shares_created

etf_market_price = 107.95
premium_discount = (etf_market_price - nav_per_share) / nav_per_share

print(f"creation basket market value = ${basket_value:,.0f}")
print(f"NAV per ETF share created     = ${nav_per_share:.4f}")
print(f"ETF market price               = ${etf_market_price:.4f}")
print(f"premium/discount to NAV        = {premium_discount:+.3%}")
