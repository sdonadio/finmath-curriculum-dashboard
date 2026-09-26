import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
n_true = 2000       # the true underlying bond universe
n_sample = 150       # the ETF holds a representative sample instead of full replication

true_weights = rng.dirichlet(np.full(n_true, 1.5))
sample_idx = rng.choice(n_true, size=n_sample, replace=False)
sample_weights = true_weights[sample_idx]
sample_weights = sample_weights / sample_weights.sum()      # renormalize the sampled sleeve to 100%

days = 2000
te = np.zeros(days)
for d in range(days):
    r = rng.normal(0.0002, 0.004, size=n_true)
    index_ret = np.sum(true_weights * r)
    etf_ret = np.sum(sample_weights * r[sample_idx])
    te[d] = (etf_ret - index_ret) * 1e4

print(f"sampling {n_sample} of {n_true} names to replicate the index")
print(f"mean daily tracking error  = {te.mean():+.3f} bp")
print(f"std of daily tracking error = {te.std():.3f} bp")
print(f"worst single-day tracking error observed = {te.min():+.2f} bp / {te.max():+.2f} bp")
