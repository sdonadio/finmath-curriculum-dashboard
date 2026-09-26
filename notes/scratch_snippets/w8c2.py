import numpy as np
np.seterr(all="ignore")
import math

def crr_american_put(S0, K, r, sigma, T, n):
    dt = T/n
    u = math.exp(sigma*math.sqrt(dt)); d = 1.0/u
    R = math.exp(r*dt); q = (R-d)/(u-d); disc = math.exp(-r*dt)
    j = np.arange(n+1)
    ST = S0*(u**j)*(d**(n-j))
    values = np.maximum(K - ST, 0.0)
    for step in range(n, 0, -1):
        jj = np.arange(step)
        S_here = S0*(u**jj)*(d**(step-1-jj))
        cont = disc*(q*values[1:step+1] + (1-q)*values[0:step])
        values = np.maximum(cont, K - S_here)
    return values[0]

rng = np.random.default_rng(32000)
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
n_steps, n_paths = 50, 100_000
dt = T / n_steps

Z = rng.standard_normal((n_paths, n_steps))
increments = (r - 0.5*sigma*sigma)*dt + sigma*math.sqrt(dt)*Z
log_paths = np.log(S0) + np.cumsum(increments, axis=1)
paths = np.column_stack([np.full(n_paths, S0), np.exp(log_paths)])  # shape (n_paths, n_steps+1)

cashflow = np.maximum(K - paths[:, -1], 0.0)
exercise_time = np.full(n_paths, n_steps)

for t in range(n_steps - 1, 0, -1):
    St = paths[:, t]
    intrinsic = np.maximum(K - St, 0.0)
    itm = intrinsic > 0
    if itm.sum() < 5:
        continue
    disc_future = np.exp(-r*dt*(exercise_time[itm] - t))
    Y = cashflow[itm] * disc_future
    X = St[itm]
    basis = np.column_stack([np.ones_like(X), X, X*X])
    coeffs, *_ = np.linalg.lstsq(basis, Y, rcond=None)
    continuation_est = basis @ coeffs
    exercise_now = intrinsic[itm] > continuation_est
    idx = np.flatnonzero(itm)[exercise_now]
    cashflow[idx] = intrinsic[itm][exercise_now]
    exercise_time[idx] = t

lsm_disc = cashflow * np.exp(-r*dt*exercise_time)
lsm_price = lsm_disc.mean()
lsm_stderr = lsm_disc.std(ddof=1) / math.sqrt(n_paths)

tree_price = crr_american_put(S0, K, r, sigma, T, 400)
print(f"CRR tree American put (400 steps, benchmark): {tree_price:.6f}")
print(f"Longstaff-Schwartz LSM American put ({n_paths} paths, {n_steps} steps): "
      f"{lsm_price:.6f}  +/- {1.96*lsm_stderr:.6f}")
print(f"LSM vs tree gap: {lsm_price-tree_price:+.6f} (LSM's regression-based exercise rule is suboptimal, "
      f"so it is a biased-low estimator of the true American price)")
