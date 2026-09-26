import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
T, n = 1.0, 400
dt = T / n
paths = 80_000

dB = rng.normal(0.0, np.sqrt(dt), size=(paths, n))
B = np.concatenate([np.zeros((paths, 1)), np.cumsum(dB, axis=1)], axis=1)

# running Ito integral I_t = sum_{i<k} B_{t_i} dB_i (left endpoint): a discretised int_0^t B_u dB_u
integrand_times_dB = B[:, :-1] * dB
I = np.concatenate([np.zeros((paths, 1)), np.cumsum(integrand_times_dB, axis=1)], axis=1)

s_idx, t_idx = n // 4, n // 2
Is = I[:, s_idx]
for lo, hi in [(-0.3, -0.1), (-0.05, 0.05), (0.1, 0.3)]:
    m = (Is >= lo) & (Is < hi)
    if m.sum() > 200:
        inc = I[m, t_idx] - I[m, s_idx]
        print(f"I_s in [{lo:+.2f}, {hi:+.2f})  paths={m.sum():6d}   E[I_t - I_s | I_s] = {inc.mean():+.4f}  (martingale => ~0)")
print(f"\nE[I_T] overall = {I[:, -1].mean():+.4f}  (should also be ~0)")
