import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
n_names = 125
constituent_spreads = np.clip(rng.normal(0.008, 0.004, size=n_names), 0.0015, None)
weights = np.full(n_names, 1.0 / n_names)

theoretical_index = np.sum(weights * constituent_spreads)
quoted_index = 0.0072        # observed market quote for the index (e.g. CDX IG)
basis = quoted_index - theoretical_index

print(f"average constituent spread (theoretical index level) = {theoretical_index:.4%}")
print(f"quoted index spread                                    = {quoted_index:.4%}")
print(f"index-vs-average-constituent basis                     = {basis:+.4%}")
