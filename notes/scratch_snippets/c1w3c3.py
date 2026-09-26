import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
n_names = 125
notional_per_name = 80_000
single_name_spreads = np.clip(rng.normal(0.008, 0.004, size=n_names), 0.0015, None)
index_spread = 0.0072
risky_annuity = 4.3

cost_single_names = np.sum(single_name_spreads * notional_per_name * risky_annuity)
index_notional = n_names * notional_per_name
cost_index = index_spread * index_notional * risky_annuity

print(f"total annualized cost, hedging via {n_names} single names   = ${cost_single_names:,.0f}")
print(f"total annualized cost, hedging the same notional via the index = ${cost_index:,.0f}")
print(f"saving from using the index instead = ${cost_single_names - cost_index:,.0f}  "
      f"({(cost_single_names - cost_index) / cost_single_names:.2%} of the single-name cost)")
