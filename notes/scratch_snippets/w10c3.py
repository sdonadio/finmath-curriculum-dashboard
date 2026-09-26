import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

rng = np.random.default_rng(32000)
N_per_dim = 100        # grid points per dimension, held fixed
n_paths = 100_000       # Monte Carlo draws, held fixed regardless of dimension

print(f"{'dimension d':>12}{'PDE/tree grid size (N^d)':>28}{'Monte Carlo draws needed':>28}")
for d in (1, 2, 3, 5, 10):
    grid_size = N_per_dim ** d
    print(f"{d:>12}{grid_size:>28,d}{n_paths:>28,d}")

print("\na basket or Asian option on d underlyings needs a d-dimensional grid: cost explodes as")
print(f"{N_per_dim}^d. Monte Carlo's cost to hit a target standard error does not depend on d at")
print("all -- only on the payoff's variance and the sample size -- which is precisely why every")
print("desk pricing multi-asset or path-dependent claims reaches for simulation, not a grid, once")
print("d moves past two or three")
