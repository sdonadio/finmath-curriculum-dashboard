import numpy as np
np.seterr(all="ignore")
import math

rng = np.random.default_rng(32000)
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0

Z_full = rng.standard_normal(1_000_000)
for n in (1_000, 10_000, 100_000, 1_000_000):
    Z = Z_full[:n]
    ST = S0 * np.exp((r - 0.5*sigma*sigma)*T + sigma*math.sqrt(T)*Z)
    disc_payoff = math.exp(-r*T) * np.maximum(ST - K, 0.0)
    stderr = disc_payoff.std(ddof=1) / math.sqrt(n)
    print(f"n={n:8d}: stderr={stderr:.6f}   stderr*sqrt(n)={stderr*math.sqrt(n):.4f} (roughly constant)")
print("quadrupling n halves the standard error: accuracy improves only as 1/sqrt(n),")
print("independent of how many dimensions (assets, time steps) the simulation has")
