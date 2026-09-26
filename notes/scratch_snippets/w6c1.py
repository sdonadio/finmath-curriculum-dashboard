import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(32000)

S0, r, sigma, T = 100.0, 0.05, 0.2, 1.0
n_steps, n_paths = 12, 6

dt = T / n_steps
Z = rng.standard_normal((n_paths, n_steps))
increments = (r - 0.5*sigma*sigma)*dt + sigma*np.sqrt(dt)*Z
log_paths = np.log(S0) + np.cumsum(increments, axis=1)
paths = np.column_stack([np.full(n_paths, S0), np.exp(log_paths)])

print("exact-discretization GBM paths, monthly steps, 6 sample paths:")
for p in range(n_paths):
    print(f"  path {p}: " + " ".join(f"{s:7.2f}" for s in paths[p, ::3]))
print(f"terminal mean over {n_paths} paths: {paths[:, -1].mean():.4f}   "
      f"theoretical E[S_T]=S0*e^(rT)={S0*np.exp(r*T):.4f}")
