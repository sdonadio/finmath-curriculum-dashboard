import numpy as np
np.seterr(all="ignore")

n_names = 125
notional_per_name = 80_000
index_notional = n_names * notional_per_name

recovery = 0.35                          # one constituent defaults with this recovery
loss_on_default = notional_per_name * (1 - recovery)
remaining_names = n_names - 1
new_index_notional = remaining_names * notional_per_name

print(f"index notional before the credit event = ${index_notional:,.0f}   ({n_names} names)")
print(f"credit-event settlement (protection payout on the defaulted name) = ${loss_on_default:,.0f}")
print(f"index notional after the defaulted name is removed = ${new_index_notional:,.0f}   ({remaining_names} names)")
print(f"protection buyers on the FULL index receive the ${loss_on_default:,.0f} settlement and keep")
print(f"protection running on the remaining {remaining_names} names at the same contractual spread")
