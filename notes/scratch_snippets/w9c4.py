import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
T, n = 1.0, 3000
dt = T / n
paths = 6000
sigma = 0.2
lam = 3.0
jump_std = 0.1

dB = rng.normal(0.0, np.sqrt(dt), size=(paths, n))
jump_occurs = rng.random(size=(paths, n)) < lam * dt
jump_sizes = np.where(jump_occurs, rng.normal(0.0, jump_std, size=(paths, n)), 0.0)
dX = sigma * dB + jump_sizes                 # a jump-diffusion increment: continuous part + jumps

X = np.concatenate([np.zeros((paths, 1)), np.cumsum(dX, axis=1)], axis=1)

lhs = X[:, -1] ** 2 - X[:, 0] ** 2
rhs = 2 * np.sum(X[:, :-1] * dX, axis=1) + np.sum(dX ** 2, axis=1)  # 2 int X_(t-) dX + realized quadratic variation

print(f"E[X_T^2 - X_0^2]                     = {lhs.mean():.5f}")
print(f"E[2 int X_(t-) dX + realized QV]      = {rhs.mean():.5f}")
print("Ito's formula still holds with jumps once the quadratic variation counts the sum of squared jumps too --")
print("exactly the week-3 quadratic-variation idea, now with a jump contribution added to the continuous part")
