import numpy as np
np.seterr(all="ignore")

tenors = np.array([1, 3, 5, 7, 10])
market_spreads = np.array([0.0080, 0.0110, 0.0140, 0.0160, 0.0180])   # market par CDS spreads
rf = 0.03
recovery = 0.40


def survival_curve(hazards, t):
    dt = np.diff(np.concatenate(([0], t)))
    return np.exp(-np.cumsum(hazards * dt))


def leg_gap(hazards, upto_idx, spread):
    t = tenors[:upto_idx + 1]
    dt = np.diff(np.concatenate(([0], t)))
    surv = survival_curve(hazards[:upto_idx + 1], t)
    surv_prev = np.concatenate(([1.0], surv[:-1]))
    DF = np.exp(-rf * t)
    premium_leg = spread * np.sum(dt * surv * DF)
    protection_leg = (1 - recovery) * np.sum((surv_prev - surv) * DF)
    return premium_leg - protection_leg      # decreasing in hazard: higher hazard raises protection, lowers premium


hazards = np.zeros(len(tenors))
for i in range(len(tenors)):
    lo, hi = 0.0001, 0.5
    for _ in range(60):
        mid = (lo + hi) / 2.0
        trial = hazards.copy()
        trial[i] = mid
        gap = leg_gap(trial, i, market_spreads[i])
        if gap > 0:      # premium leg too big relative to protection: need a bigger hazard rate
            lo = mid
        else:
            hi = mid
    hazards[i] = (lo + hi) / 2.0

for t, h in zip(tenors, hazards):
    print(f"tenor {t:2d}y:  bootstrapped forward hazard rate = {h:.4%}")

surv_final = survival_curve(hazards, tenors)
print(f"\nsurvival probabilities at each tenor: {[round(float(s), 4) for s in surv_final]}")
