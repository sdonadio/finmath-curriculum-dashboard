import numpy as np
np.seterr(all="ignore")

pool_balance = 100_000_000.0
wac = 0.055
n_months = 360
r_m = wac / 12.0
payment = pool_balance * r_m / (1 - (1 + r_m) ** -n_months)


def weighted_average_life(cpr_annual):
    smm = 1 - (1 - cpr_annual) ** (1.0 / 12.0)     # single monthly mortality implied by an annual CPR
    balance = pool_balance
    wal_num = 0.0
    for m in range(1, n_months + 1):
        if balance <= 0:
            break
        interest = balance * r_m
        sched_principal = payment - interest
        remaining_after_sched = balance - sched_principal
        prepay = remaining_after_sched * smm
        total_principal_m = sched_principal + prepay
        wal_num += m * total_principal_m
        balance = remaining_after_sched - prepay
    return wal_num / pool_balance / 12.0    # years


print(f"{'CPR':>6} {'weighted average life (years)':>32}")
for cpr in (0.0, 0.06, 0.12, 0.25):
    wal = weighted_average_life(cpr)
    print(f"{cpr:6.0%} {wal:32.2f}")

print("\nfaster prepayment shortens the pool's life sharply and non-linearly -- this is the source of an MBS's negative convexity")
