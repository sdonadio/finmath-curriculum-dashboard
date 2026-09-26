import numpy as np
np.seterr(all="ignore")

tenors = np.array([0.5, 1.0, 1.5, 2.0, 2.5, 3.0])   # semiannual premium dates, 3y CDS
hazard = 0.025
rf = 0.03
recovery = 0.40
dt = np.diff(np.concatenate(([0], tenors)))
survival = np.exp(-hazard * tenors)
survival_prev = np.concatenate(([1.0], survival[:-1]))
DF = np.exp(-rf * tenors)


def cds_legs(spread, notional=1.0):
    premium_leg = spread * notional * np.sum(dt * survival * DF)               # ignoring accrued-on-default, for simplicity
    protection_leg = notional * (1 - recovery) * np.sum((survival_prev - survival) * DF)
    return premium_leg, protection_leg


_, protection_leg = cds_legs(0.0)
premium_leg_per_unit_spread, _ = cds_legs(1.0)
par_spread = protection_leg / premium_leg_per_unit_spread

print(f"protection leg PV (per unit notional)         = {protection_leg:.5f}")
print(f"premium leg PV per unit of running spread     = {premium_leg_per_unit_spread:.5f}")
print(f"par CDS spread (solves premium leg = protection leg) = {par_spread:.4%}")
