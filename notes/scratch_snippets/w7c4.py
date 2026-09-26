import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
T, n = 1.0, 400
dt = T / n
paths = 500_000
theta = 0.4

dW = rng.normal(0.0, np.sqrt(dt), size=(paths, n))
W = np.concatenate([np.zeros((paths, 1)), np.cumsum(dW, axis=1)], axis=1)
t_grid = np.linspace(0.0, T, n + 1)

for idx in (0, n // 4, n // 2, 3 * n // 4, n):
    t = t_grid[idx]
    Z_t = np.exp(theta * W[:, idx] - 0.5 * theta ** 2 * t)
    print(f"t={t:.2f}   E[Z_t] = {Z_t.mean():.5f}   (Z_t is itself a P-martingale: E[Z_t]=1 at every t, not just t=T)")
