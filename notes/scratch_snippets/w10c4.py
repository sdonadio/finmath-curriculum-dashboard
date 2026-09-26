import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
T = 1.0
sigma = 0.2
lam = 4.0
jump_std = 0.12

print(f"{'n steps':>8} {'QV(path)':>10} {'sigma^2*T':>10} {'sum(jump^2)':>12} {'# jumps':>8}")
for n in (200, 2000, 20000, 200000):
    dt = T / n
    dB = rng.normal(0.0, np.sqrt(dt), size=n)
    jump_occurs = rng.random(size=n) < lam * dt
    J = np.where(jump_occurs, rng.normal(0.0, jump_std, size=n), 0.0)
    dX = sigma * dB + J
    qv = np.sum(dX ** 2)
    realized_jump_ss = np.sum(J ** 2)
    print(f"{n:8d} {qv:10.5f} {sigma**2*T:10.5f} {realized_jump_ss:12.5f} {int(jump_occurs.sum()):8d}")

print("\nas the partition refines, QV splits cleanly into a deterministic continuous part (-> sigma^2 T)")
print("and a jump part that stays the sum of each REALIZED jump's own square -- the number of jumps in")
print("[0,T] is set by the Poisson clock, not by how finely the grid is cut")
