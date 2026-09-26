import numpy as np
np.seterr(all="ignore")
import math

def lsm_american_put(rng, S0, K, r, sigma, T, n_steps, n_paths):
    dt = T / n_steps
    Z = rng.standard_normal((n_paths, n_steps))
    increments = (r - 0.5*sigma*sigma)*dt + sigma*math.sqrt(dt)*Z
    log_paths = np.log(S0) + np.cumsum(increments, axis=1)
    paths = np.column_stack([np.full(n_paths, S0), np.exp(log_paths)])
    cashflow = np.maximum(K - paths[:, -1], 0.0)
    exercise_time = np.full(n_paths, n_steps)
    for t in range(n_steps - 1, 0, -1):
        St = paths[:, t]
        intrinsic = np.maximum(K - St, 0.0)
        itm = intrinsic > 0
        if itm.sum() < 5:
            continue
        Y = cashflow[itm] * np.exp(-r*dt*(exercise_time[itm] - t))
        X = St[itm]
        basis = np.column_stack([np.ones_like(X), X, X*X])
        coeffs, *_ = np.linalg.lstsq(basis, Y, rcond=None)
        continuation_est = basis @ coeffs
        exercise_now = intrinsic[itm] > continuation_est
        idx = np.flatnonzero(itm)[exercise_now]
        cashflow[idx] = intrinsic[itm][exercise_now]
        exercise_time[idx] = t
    disc = cashflow * np.exp(-r*dt*exercise_time)
    return disc.mean(), disc.std(ddof=1) / math.sqrt(n_paths)

rng = np.random.default_rng(32000)
S0, K, r, sigma, T, n_steps = 100.0, 100.0, 0.05, 0.2, 1.0, 50
print("n_paths     price      stderr    95% CI half-width")
for n_paths in (2_000, 20_000, 200_000):
    price, se = lsm_american_put(rng, S0, K, r, sigma, T, n_steps, n_paths)
    print(f"{n_paths:8d}  {price:.6f}  {se:.6f}   {1.96*se:.6f}")
print("the half-width shrinks by roughly 1/sqrt(10) each time n_paths grows tenfold: the same")
print("sqrt(N) rate as any other Monte Carlo estimator, on top of the LSM regression's own bias")
