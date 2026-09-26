import numpy as np
np.seterr(all="ignore")

recovery = 0.40
rf = 0.03
T = 1.0

print(f"{'hazard':>8} {'exact spread':>14} {'triangle approx h*(1-R)':>24} {'difference':>12}")
for h in (0.01, 0.02, 0.05, 0.10):
    survival = np.exp(-h * T)
    DF_rf = np.exp(-rf * T)
    price_risky = DF_rf * (survival + (1 - survival) * recovery)
    exact_yield = -np.log(price_risky) / T
    exact_spread = exact_yield - rf
    approx = h * (1 - recovery)
    print(f"{h:8.2%} {exact_spread:14.4%} {approx:24.4%} {exact_spread - approx:+12.4%}")

print("\nthe 'credit triangle' spread ~= hazard * (1 - recovery) is a good approximation for small hazard rates,")
print("and drifts as the hazard rate grows -- it ignores the (1-Q) recovery correction inside the exact formula")
