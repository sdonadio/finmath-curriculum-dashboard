import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def trinomial_call(S0, K, r, sigma, T, n):
    dt = T/n
    lam = math.sqrt(3.0)
    u = math.exp(lam*sigma*math.sqrt(dt))
    d = 1.0/u
    nu = r - 0.5*sigma*sigma
    pu = 1.0/(2*lam*lam) + nu*math.sqrt(dt)/(2*lam*sigma)
    pd = 1.0/(2*lam*lam) - nu*math.sqrt(dt)/(2*lam*sigma)
    pm = 1.0 - pu - pd
    disc = math.exp(-r*dt)
    j = np.arange(2*n+1)   # 2n+1 terminal nodes, middle = S0
    ST = S0 * (u**(j - n))
    values = np.maximum(ST - K, 0.0)
    for step in range(n, 0, -1):
        width = 2*step - 1
        values = disc*(pu*values[2:2+width] + pm*values[1:1+width] + pd*values[0:width])
    return values[0], (pu, pm, pd)

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes price: {bs_price:.6f}")
for n in (5, 20, 80):
    price, (pu, pm, pd) = trinomial_call(S0, K, r, sigma, T, n)
    print(f"n={n:3d}: pu={pu:.4f} pm={pm:.4f} pd={pd:.4f} sum={pu+pm+pd:.4f}  price={price:.6f} err={price-bs_price:+.6f}")
