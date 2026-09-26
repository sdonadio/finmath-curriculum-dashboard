import numpy as np
np.seterr(all="ignore")
import math

def crr_prices(S0, K, r, sigma, T, n, kind="put", american=False):
    dt = T/n
    u = math.exp(sigma*math.sqrt(dt)); d = 1.0/u
    R = math.exp(r*dt); q = (R-d)/(u-d); disc = math.exp(-r*dt)
    j = np.arange(n+1)
    ST = S0*(u**j)*(d**(n-j))
    if kind == "put":
        values = np.maximum(K - ST, 0.0)
    else:
        values = np.maximum(ST - K, 0.0)
    for step in range(n, 0, -1):
        j = np.arange(step)
        S_here = S0*(u**j)*(d**(step-1-j))
        cont = disc*(q*values[1:step+1] + (1-q)*values[0:step])
        if american:
            intrinsic = np.maximum(K - S_here, 0.0) if kind == "put" else np.maximum(S_here - K, 0.0)
            values = np.maximum(cont, intrinsic)
        else:
            values = cont
    return values[0]

S0, K, r, sigma, T, n = 100.0, 100.0, 0.05, 0.25, 1.0, 200
euro_put = crr_prices(S0, K, r, sigma, T, n, "put", american=False)
amer_put = crr_prices(S0, K, r, sigma, T, n, "put", american=True)
euro_call = crr_prices(S0, K, r, sigma, T, n, "call", american=False)
amer_call = crr_prices(S0, K, r, sigma, T, n, "call", american=True)
print(f"European put:  {euro_put:.6f}")
print(f"American put:  {amer_put:.6f}   early-exercise premium = {amer_put-euro_put:.6f}")
print(f"European call: {euro_call:.6f}")
print(f"American call: {amer_call:.6f}   early-exercise premium = {amer_call-euro_call:.6f}")
