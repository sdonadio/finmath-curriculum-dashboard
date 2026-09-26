import numpy as np
np.seterr(all="ignore")
import math

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0

for n in (1, 4, 16):
    dt = T / n
    u = math.exp(sigma * math.sqrt(dt))
    d = 1.0 / u
    R = math.exp(r * dt)
    q = (R - d) / (u - d)
    print(f"n={n:3d}  dt={dt:.4f}  u={u:.4f}  d={d:.4f}  R={R:.4f}  q={q:.4f}")

print("as n grows, dt shrinks and u,d squeeze toward 1: the tree's one-step jump")
print("shrinks exactly at the rate a diffusion's increment does")
