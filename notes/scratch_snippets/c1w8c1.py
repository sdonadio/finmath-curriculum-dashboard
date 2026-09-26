import numpy as np
np.seterr(all="ignore")

muni_yield = 0.032
tax_rates = np.array([0.24, 0.32, 0.37])
tey = muni_yield / (1 - tax_rates)          # taxable-equivalent yield

for t, y in zip(tax_rates, tey):
    print(f"marginal tax rate={t:.0%}:  taxable-equivalent yield = {y:.4%}")

taxable_yield = 0.045
breakeven_tax = 1 - muni_yield / taxable_yield
print(f"\nbreakeven tax rate vs a {taxable_yield:.2%} taxable bond = {breakeven_tax:.2%}")
print("above the breakeven tax rate, the tax-exempt muni wins even though its quoted yield is lower")
