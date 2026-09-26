import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
paths = 200_000
T = 1.0

B_T = rng.normal(0.0, np.sqrt(T), size=paths)

c = 4.0
B_cT = rng.normal(0.0, np.sqrt(c * T), size=paths)
scaled = B_cT / np.sqrt(c)

print(f"B_T:              mean={B_T.mean():+.4f}  var={B_T.var():.4f}")
print(f"B_(cT)/sqrt(c):   mean={scaled.mean():+.4f}  var={scaled.var():.4f}   (c={c})")
print(f"both target N(0,{T}) -- this is Brownian scaling / self-similarity")

n_grid = 250
dt = T / n_grid
sample_paths = np.cumsum(rng.normal(0.0, np.sqrt(dt), size=(5, n_grid)), axis=1)
print(f"\n5 sample path endpoints at T={T}: {np.round(sample_paths[:, -1], 3).tolist()}")
