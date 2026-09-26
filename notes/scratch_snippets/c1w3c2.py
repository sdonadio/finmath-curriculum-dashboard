import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
on_the_run = rng.normal(0.25, 0.05, size=500)
off_the_run_1 = rng.normal(0.6, 0.15, size=500)
off_the_run_2 = rng.normal(1.1, 0.3, size=500)

for name, data in [("on-the-run (current series)", on_the_run),
                    ("1 series off-the-run", off_the_run_1),
                    ("2 series off-the-run", off_the_run_2)]:
    print(f"{name:32s} mean bid-ask = {data.mean():.3f} bp   std = {data.std():.3f} bp")

print("\nliquidity concentrates in the current (on-the-run) series; a semiannual roll to a new series")
print("migrates trading volume within days, leaving the prior series wider and thinner")
