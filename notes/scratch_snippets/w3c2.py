import numpy as np
np.seterr(all="ignore")
import math

S0, K, r, sigma, T, n = 100.0, 100.0, 0.05, 0.25, 1.0, 60
dt = T/n
u = math.exp(sigma*math.sqrt(dt)); d = 1.0/u
R = math.exp(r*dt); q = (R-d)/(u-d); disc = math.exp(-r*dt)

j = np.arange(n+1)
ST = S0*(u**j)*(d**(n-j))
values = np.maximum(K - ST, 0.0)

boundary = {}
for step in range(n, 0, -1):
    jj = np.arange(step)
    S_here = S0*(u**jj)*(d**(step-1-jj))
    cont = disc*(q*values[1:step+1] + (1-q)*values[0:step])
    intrinsic = np.maximum(K - S_here, 0.0)
    exercise = intrinsic > cont
    values = np.maximum(cont, intrinsic)
    if exercise.any():
        boundary[step-1] = S_here[exercise].max()

print("time layer -> highest stock price at which early exercise is optimal (every 6th layer shown):")
for layer in sorted(boundary):
    if layer % 6 != 0:
        continue
    t = layer*dt
    print(f"  layer {layer:3d} (t={t:.3f}): boundary S* = {boundary[layer]:.4f}")
print(f"boundary rises toward K={K:.1f} as t -> T: the exercise region (0, S*(t)] shrinks with time to maturity")
