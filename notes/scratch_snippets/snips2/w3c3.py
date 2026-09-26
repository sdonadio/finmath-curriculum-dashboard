import numpy as np
np.seterr(all="ignore")

# Token allocations to a team, investors and a treasury are almost always
# subject to a VESTING schedule: a CLIFF (nothing unlocks for a fixed
# period), then a LINEAR unlock over the remaining schedule. The gap
# between CIRCULATING supply (tradeable now) and TOTAL/max supply is
# exactly the still-locked allocation, and every unlock date is a scheduled
# increase in sellable supply that the market can see coming.

total_supply = 1_000_000_000.0
allocations = {
    "public sale":  {"pct": 0.15, "cliff_months": 0,  "vest_months": 0},    # unlocked at launch
    "team":         {"pct": 0.20, "cliff_months": 12, "vest_months": 36},
    "investors":    {"pct": 0.25, "cliff_months": 6,  "vest_months": 24},
    "treasury":     {"pct": 0.25, "cliff_months": 0,  "vest_months": 48},
    "ecosystem":    {"pct": 0.15, "cliff_months": 3,  "vest_months": 30},
}
assert abs(sum(a["pct"] for a in allocations.values()) - 1.0) < 1e-9

def unlocked_fraction(alloc, month):
    if month < alloc["cliff_months"]:
        return 0.0
    if alloc["vest_months"] == 0:
        return 1.0
    vested_months = min(month - alloc["cliff_months"], alloc["vest_months"])
    return vested_months / alloc["vest_months"]

print("month   circulating supply   % of total   newly unlocked this month")
prev_circ = 0.0
for month in (0, 3, 6, 12, 13, 24, 36, 48, 60):
    circ = sum(total_supply * a["pct"] * unlocked_fraction(a, month) for a in allocations.values())
    print("  %3d       %14.0f        %6.2f%%           %14.0f"
          % (month, circ, 100 * circ / total_supply, circ - prev_circ if month > 0 else circ))
    prev_circ = circ

print("\nthe month-12 to month-13 jump is the team's cliff ending: 20% of total")
print("supply starts unlocking all at once after 12 months of ZERO team supply")
print("being sellable, then unlocks linearly over the following 36 months")

circ_at_12 = sum(total_supply * a["pct"] * unlocked_fraction(a, 12) for a in allocations.values())
circ_at_13 = sum(total_supply * a["pct"] * unlocked_fraction(a, 13) for a in allocations.values())
print("month 12 -> 13 circulating supply jump : %.0f tokens (%.2f%% of total supply, in one month)"
      % (circ_at_13 - circ_at_12, 100 * (circ_at_13 - circ_at_12) / total_supply))
