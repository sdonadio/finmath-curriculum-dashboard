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
    u = math.exp(sigma*math.sqrt(dt)); d = 1.0/u
    R = math.exp(r*dt); q = (R-d)/(u-d); disc = math.exp(-r*dt)
    j = np.arange(n+1)
    ST = S0*(u**j)*(d**(n-j))
    values = np.maximum(ST-K, 0.0)
    for step in range(n, 0, -1):
        values = disc*(q*values[1:step+1] + (1-q)*values[0:step])
    return values[0]

def jr_call(S0, K, r, sigma, T, n):
    dt = T/n
    nu = r - 0.5*sigma*sigma
    u = math.exp(nu*dt + sigma*math.sqrt(dt))
    d = math.exp(nu*dt - sigma*math.sqrt(dt))
    R = math.exp(r*dt); disc = math.exp(-r*dt)
    q = 0.5  # equal risk-neutral probability by construction
    j = np.arange(n+1)
    ST = S0*(u**j)*(d**(n-j))
    values = np.maximum(ST-K, 0.0)
    for step in range(n, 0, -1):
        values = disc*(q*values[1:step+1] + (1-q)*values[0:step])
    return values[0]

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes price: {bs_price:.6f}")
for n in (10, 50, 200):
    c_crr, c_jr = crr_call(S0,K,r,sigma,T,n), jr_call(S0,K,r,sigma,T,n)
    print(f"n={n:4d}: CRR={c_crr:.6f} (err={c_crr-bs_price:+.6f})   JR={c_jr:.6f} (err={c_jr-bs_price:+.6f})")
