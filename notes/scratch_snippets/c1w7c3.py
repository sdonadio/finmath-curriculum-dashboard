import numpy as np
np.seterr(all="ignore")

pool_balance = 100_000_000.0
wac = 0.055
n_months = 360
r_m = wac / 12.0
payment = pool_balance * r_m / (1 - (1 + r_m) ** -n_months)


def psa_cpr(month, multiplier=1.0):
    base = min(0.06, 0.002 * month)     # 100% PSA: CPR ramps 0.2%/month, seasoning to 6% by month 30, then flat
    return min(base * multiplier, 1.0 - 1e-9)


def wal_under_psa(multiplier):
    balance = pool_balance
    wal_num = 0.0
    for m in range(1, n_months + 1):
        if balance <= 0:
            break
        cpr = psa_cpr(m, multiplier)
        smm = 1 - (1 - cpr) ** (1.0 / 12.0)
        interest = balance * r_m
        sched_principal = payment - interest
        remaining_after_sched = balance - sched_principal
        prepay = remaining_after_sched * smm
        total_principal_m = sched_principal + prepay
        wal_num += m * total_principal_m
        balance = remaining_after_sched - prepay
    return wal_num / pool_balance / 12.0


print(f"CPR at month 1 (100% PSA)  = {psa_cpr(1):.3%}")
print(f"CPR at month 30 (100% PSA) = {psa_cpr(30):.3%}   (seasoning complete, flat thereafter)\n")
for mult in (0.5, 1.0, 2.0, 3.0):
    wal = wal_under_psa(mult)
    print(f"{mult*100:.0f}% PSA:  weighted average life = {wal:.2f} years")
