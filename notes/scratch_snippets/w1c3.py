import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def crr_call(S0, K, r, sigma, T, n):
    dt = T/n
    u = math.exp(sigma*math.sqrt(dt))
    d = 1.0/u
    R = math.exp(r*dt)
    q = (R-d)/(u-d)
    disc = math.exp(-r*dt)
    j = np.arange(n+1)
    ST = S0 * (u**j) * (d**(n-j))
    values = np.maximum(ST - K, 0.0)
    for step in range(n, 0, -1):
        values = disc * (q*values[1:step+1] + (1-q)*values[0:step])
    return values[0]

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
prev_sign = None
flips = 0
for n in range(40, 61):
    price = crr_call(S0, K, r, sigma, T, n)
    err = price - bs_price
    sign = "+" if err >= 0 else "-"
    if prev_sign is not None and sign != prev_sign:
        flips += 1
    prev_sign = sign
    print(f"n={n:3d} ({'even' if n%2==0 else 'odd '}): error={err:+.6f}")
print(f"sign flips across n=40..60: {flips} (parity-driven oscillation, not a monotone shrink)")
