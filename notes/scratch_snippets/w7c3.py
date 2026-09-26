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
n_steps, n_paths = 50, 100_000
dt = T / n_steps

Z = rng.standard_normal((n_paths, n_steps))
increments = (r - 0.5*sigma*sigma)*dt + sigma*math.sqrt(dt)*Z
log_paths = np.cumsum(increments, axis=1)
paths = S0 * np.exp(log_paths)                      # excludes t=0, includes T
ST = paths[:, -1]

asian_payoff = np.maximum(paths.mean(axis=1) - K, 0.0)
asian_price = math.exp(-r*T) * asian_payoff.mean()
asian_stderr = math.exp(-r*T) * asian_payoff.std(ddof=1) / math.sqrt(n_paths)

barrier = 130.0
knocked_out = (paths.max(axis=1) >= barrier)
up_out_payoff = np.where(knocked_out, 0.0, np.maximum(ST - K, 0.0))
up_out_price = math.exp(-r*T) * up_out_payoff.mean()

vanilla_price = bs_call(S0, K, r, sigma, T)
print(f"vanilla European call (closed form):        {vanilla_price:.6f}")
print(f"arithmetic-average Asian call (MC):          {asian_price:.6f}  +/- {1.96*asian_stderr:.6f}")
print(f"up-and-out barrier call, B={barrier:.0f} (MC): {up_out_price:.6f}  "
      f"(knocked out on {100*knocked_out.mean():.1f}% of paths)")
print("both path-dependent prices sit below the vanilla call: averaging caps the Asian payoff's")
print("upside, and knock-out removes exactly the paths that would have paid the most")
