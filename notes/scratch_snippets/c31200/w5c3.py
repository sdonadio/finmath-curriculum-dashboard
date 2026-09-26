import numpy as np
np.seterr(all="ignore")

# A fiat-backed stablecoin (or any tokenized fund) that holds part of its
# reserve in less-liquid assets faces a classic BANK RUN problem: if every
# holder can redeem instantly and in full, a rumor alone can make running
# first the DOMINANT strategy, because the assets backing later redeemers
# are worth less once the liquid portion is gone. A redemption GATE (a cap
# on redemptions per period, or a queue) breaks that race by removing the
# first-mover advantage, at the cost of making redemption slower for
# everyone.

def simulate_run(total_reserve, liquid_fraction, illiquid_haircut,
                  redemption_demand, gate_fraction_per_period=None, n_periods=6):
    liquid = total_reserve * liquid_fraction
    illiquid = total_reserve * (1 - liquid_fraction)
    remaining_holders_claim = total_reserve
    history = []
    for t in range(n_periods):
        demand_this_period = redemption_demand[t] if t < len(redemption_demand) else 0.0
        cap = (gate_fraction_per_period * remaining_holders_claim
               if gate_fraction_per_period is not None else float("inf"))
        paid = min(demand_this_period, cap, liquid + illiquid)
        # pay from liquid reserve first; if liquid runs out, force-sell illiquid
        # assets at a haircut, destroying value for EVERYONE still waiting.
        from_liquid = min(paid, liquid)
        shortfall = paid - from_liquid
        liquid -= from_liquid
        if shortfall > 0:
            illiquid_face_needed = shortfall / (1 - illiquid_haircut)
            illiquid = max(0.0, illiquid - illiquid_face_needed)
        remaining_holders_claim -= paid
        nav_per_claim = (liquid + illiquid) / max(remaining_holders_claim, 1e-9)
        history.append((paid, liquid, illiquid, remaining_holders_claim, nav_per_claim))
    return history

reserve = 1_000_000_000.0
print("UNGATED: a 30% liquid / 70% illiquid reserve, panic redemption demand,")
print("illiquid assets fire-sold at a 25% haircut when the liquid buffer runs dry:\n")
panic_demand = [400_000_000, 350_000_000, 300_000_000, 250_000_000, 200_000_000, 150_000_000]
hist_ungated = simulate_run(reserve, 0.30, 0.25, panic_demand, gate_fraction_per_period=None)
print(" period   paid out       liquid left     illiquid left   remaining claims   NAV/claim")
for t, (paid, liq, illiq, claim, nav) in enumerate(hist_ungated):
    print("   %d   %11.0f    %11.0f     %11.0f      %11.0f       %.4f"
          % (t, paid, liq, illiq, claim, nav))

print("\nGATED: the SAME panic demand, but redemptions capped at 15% of remaining")
print("claims per period:\n")
hist_gated = simulate_run(reserve, 0.30, 0.25, panic_demand, gate_fraction_per_period=0.15)
print(" period   paid out       liquid left     illiquid left   remaining claims   NAV/claim")
for t, (paid, liq, illiq, claim, nav) in enumerate(hist_gated):
    print("   %d   %11.0f    %11.0f     %11.0f      %11.0f       %.4f"
          % (t, paid, liq, illiq, claim, nav))

print("\nby period 5, an ungated fund has paid EARLY redeemers at full face value while")
print("LATE redeemers are left holding a claim worth only %.4f per dollar (NAV/claim);"
      % hist_ungated[-1][4])
print("the gated fund's late redeemers instead hold a claim worth %.4f per dollar --"
      % hist_gated[-1][4])
print("the gate does not create value, it just stops early movers from extracting")
print("more than their pro-rata share of the fire-sale losses everyone must share")
