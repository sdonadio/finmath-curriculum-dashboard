import numpy as np
np.seterr(all="ignore")

tenors = np.array([1, 2, 3, 4, 5])
hazard = np.array([0.010, 0.012, 0.015, 0.018, 0.020])
dt = np.diff(np.concatenate(([0], tenors)))
survival = np.exp(-np.cumsum(hazard * dt))
survival_prev = np.concatenate(([1.0], survival[:-1]))

rf_rate = 0.03
DF = np.exp(-rf_rate * tenors)
coupon, face, recovery = 0.05, 100.0, 0.40

coupon_pv = np.sum(coupon * face * survival * DF)                    # coupons paid only if the issuer survives
principal_pv = face * survival[-1] * DF[-1]
default_pv = np.sum(recovery * face * (survival_prev - survival) * DF)  # recovery paid if default lands in that period
risky_price = coupon_pv + principal_pv + default_pv

riskfree_price = np.sum(coupon * face * DF) + face * DF[-1]

print(f"risk-free coupon bond price     = {riskfree_price:.4f}")
print(f"risky coupon bond price          = {risky_price:.4f}")
print(f"  coupon PV = {coupon_pv:.4f}   principal PV = {principal_pv:.4f}   recovery-on-default PV = {default_pv:.4f}")
print(f"price difference (the credit charge) = {riskfree_price - risky_price:.4f}")
