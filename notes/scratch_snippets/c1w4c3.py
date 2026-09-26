import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(35700)
n = 1000
true_factor = rng.normal(0.0, 1.0, size=n)
etf_ret = 0.8 * true_factor + rng.normal(0.0, 0.3, size=n)               # the ETF reacts immediately
bond_ret = np.roll(0.8 * true_factor, 1) + rng.normal(0.0, 0.3, size=n)  # the bond index reacts a day late
bond_ret[0] = rng.normal(0.0, 0.3)

for lag in (-2, -1, 0, 1, 2):
    if lag >= 0:
        c = np.corrcoef(etf_ret[:n - lag], bond_ret[lag:])[0, 1] if lag > 0 else np.corrcoef(etf_ret, bond_ret)[0, 1]
    else:
        c = np.corrcoef(etf_ret[-lag:], bond_ret[:n + lag])[0, 1]
    print(f"corr(ETF_t, bond_(t+{lag}))  = {c:+.3f}")

print("\nthe ETF's return today correlates most strongly with the bond index's return the NEXT day --")
print("the ETF is pricing new credit information before it shows up in stale bond marks")
