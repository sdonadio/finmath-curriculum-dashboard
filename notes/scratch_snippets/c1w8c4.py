import numpy as np
np.seterr(all="ignore")

ratings = ["AAA", "AA", "A", "BBB"]
corp_10y_default = np.array([0.0038, 0.0093, 0.0241, 0.0466])    # illustrative 10y cumulative default rates
muni_10y_default = np.array([0.0001, 0.0003, 0.0009, 0.0027])    # municipal defaults are historically far rarer

for r, c, m in zip(ratings, corp_10y_default, muni_10y_default):
    print(f"rating {r}:  10y corporate default = {c:.2%}   10y municipal default = {m:.2%}   ratio = {c/m:.1f}x")

recovery = 0.6
implied_corp_spread = -np.log(1 - corp_10y_default) / 10.0 * (1 - recovery)
implied_muni_spread = -np.log(1 - muni_10y_default) / 10.0 * (1 - recovery)
print("\ncredit-risk-only implied spread over 10 years:")
for r, cs, ms in zip(ratings, implied_corp_spread, implied_muni_spread):
    print(f"  {r}:  corporate ~ {cs:.3%}   muni ~ {ms:.3%}")

print("\nmunicipal spreads observed in the market are usually much narrower than corporate spreads at the SAME rating,")
print("but rarely as narrow as this credit-risk-only gap implies -- taxation, liquidity, and technical supply/demand fill the rest")
