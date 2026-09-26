import numpy as np
np.seterr(all="ignore")

tenors = np.array([1, 2, 3, 4, 5])
hazard = np.array([0.010, 0.012, 0.015, 0.018, 0.020])   # piecewise-constant forward hazard rates
dt = np.diff(np.concatenate(([0], tenors)))
cum_hazard = np.cumsum(hazard * dt)
survival = np.exp(-cum_hazard)                            # Q(tau > t) = exp(-int_0^t hazard)

rf_rate = 0.03
DF_rf = np.exp(-rf_rate * tenors)
recovery = 0.40

zcb_risky = DF_rf * (survival + (1 - survival) * recovery)   # face=1, paid at t if survived, R if defaulted
for t, s, p in zip(tenors, survival, zcb_risky):
    print(f"t={t}:  survival Q(tau>{t}) = {s:.4f}   risky zero-coupon bond price (face=1) = {p:.4f}")

print(f"\ncumulative default probability by year 5 = {1 - survival[-1]:.4%}")
