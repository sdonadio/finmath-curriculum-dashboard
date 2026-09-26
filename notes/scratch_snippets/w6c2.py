import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

rng = np.random.default_rng(32000)
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)

n = 200_000
Z = rng.standard_normal(n)
ST = S0 * np.exp((r - 0.5*sigma*sigma)*T + sigma*math.sqrt(T)*Z)
payoff = np.maximum(ST - K, 0.0)
disc_payoff = math.exp(-r*T) * payoff

price = disc_payoff.mean()
stderr = disc_payoff.std(ddof=1) / math.sqrt(n)
print(f"Black-Scholes price: {bs_price:.6f}")
print(f"Monte Carlo price (n={n}): {price:.6f}  +/- {1.96*stderr:.6f} (95% CI)  stderr={stderr:.6f}")
print(f"MC error vs BS: {price-bs_price:+.6f}  ({abs(price-bs_price)/stderr:.2f} standard errors away)")
