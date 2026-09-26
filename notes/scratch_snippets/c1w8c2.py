import numpy as np
np.seterr(all="ignore")

net_revenue = 18_500_000.0
annual_debt_service = 12_000_000.0
dscr = net_revenue / annual_debt_service
print(f"revenue bond debt-service coverage ratio (DSCR) = {dscr:.2f}x")
print("assessment: " + ("healthy (>1.5x)" if dscr > 1.5 else "thin coverage" if dscr > 1.0 else "coverage shortfall"))

assessed_value = 4_200_000_000.0
outstanding_go_debt = 85_000_000.0
population = 120_000
debt_to_av = outstanding_go_debt / assessed_value
debt_per_capita = outstanding_go_debt / population

print(f"\nGO bond debt / assessed value = {debt_to_av:.2%}")
print(f"GO bond debt per capita        = ${debt_per_capita:,.0f}")
print("\na revenue bond's credit rests on a project's own cash flow (DSCR); a GO bond's rests on the")
print("issuer's full taxing power over its tax base -- two different claims, two different ratios to watch")
