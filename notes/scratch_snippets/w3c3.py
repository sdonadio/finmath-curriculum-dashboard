import numpy as np
np.seterr(all="ignore")
import math

def crr_prices(S0, K, r, q_div, sigma, T, n, kind="put", american=False):
    dt = T/n
    u = math.exp(sigma*math.sqrt(dt)); d = 1.0/u
    R = math.exp((r - q_div)*dt); disc = math.exp(-r*dt)
    qprob = (R - d) / (u - d)
    j = np.arange(n+1)
    ST = S0*(u**j)*(d**(n-j))
    values = np.maximum(K - ST, 0.0) if kind == "put" else np.maximum(ST - K, 0.0)
    for step in range(n, 0, -1):
        jj = np.arange(step)
        S_here = S0*(u**jj)*(d**(step-1-jj))
        cont = disc*(qprob*values[1:step+1] + (1-qprob)*values[0:step])
        if american:
            intrinsic = np.maximum(K - S_here, 0.0) if kind == "put" else np.maximum(S_here - K, 0.0)
            values = np.maximum(cont, intrinsic)
        else:
            values = cont
    return values[0]

S0, K, r, sigma, T, n = 100.0, 100.0, 0.05, 0.25, 1.0, 200
for q_div, label in ((0.0, "no dividends"), (0.06, "6% continuous dividend yield")):
    ec = crr_prices(S0, K, r, q_div, sigma, T, n, "call", american=False)
    ac = crr_prices(S0, K, r, q_div, sigma, T, n, "call", american=True)
    ep = crr_prices(S0, K, r, q_div, sigma, T, n, "put", american=False)
    ap = crr_prices(S0, K, r, q_div, sigma, T, n, "put", american=True)
    print(f"{label}:")
    print(f"  call premium (American-European) = {ac-ec:.6f}")
    print(f"  put  premium (American-European) = {ap-ep:.6f}")
