import numpy as np
np.seterr(all="ignore")

pool_balance = 100_000_000.0
wac = 0.055        # weighted average coupon on the mortgage pool
n_months = 360
r_m = wac / 12.0

payment = pool_balance * r_m / (1 - (1 + r_m) ** -n_months)     # level-payment amortization

balance = pool_balance
total_interest = 0.0
total_principal = 0.0
for m in range(1, 13):
    interest = balance * r_m
    principal = payment - interest
    balance -= principal
    total_interest += interest
    total_principal += principal
    print(f"month {m:2d}: interest={interest:10,.2f}   principal={principal:10,.2f}   balance={balance:14,.2f}")

print(f"\nlevel monthly pass-through payment = {payment:,.2f}")
print(f"year-1 totals: interest = {total_interest:,.2f}   scheduled principal = {total_principal:,.2f}")
