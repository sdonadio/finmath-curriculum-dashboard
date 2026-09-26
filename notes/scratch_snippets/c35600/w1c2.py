import numpy as np
np.seterr(all="ignore")

# A market-making desk is a capital allocation decision before it is a
# quoting strategy: margin posted to the venue is CAPITAL, capital has a
# cost (what it could earn elsewhere), and the desk's return on that
# capital -- not just its gross spread revenue -- is the number that
# decides whether the seat is worth running. ROC = annualised net revenue
# divided by capital actually locked up, and it is what a break-even
# spread calculation ultimately has to clear.

def desk_economics(daily_volume, avg_spread_capture_bp, fee_rebate_bp,
                    margin_required, adverse_selection_bp, cost_of_capital,
                    trading_days=252):
    gross_spread_income = daily_volume * (avg_spread_capture_bp / 10_000) * trading_days
    rebate_income = daily_volume * (fee_rebate_bp / 10_000) * trading_days
    adverse_selection_cost = daily_volume * (adverse_selection_bp / 10_000) * trading_days
    net_income = gross_spread_income + rebate_income - adverse_selection_cost
    capital_cost = margin_required * cost_of_capital
    net_of_capital = net_income - capital_cost
    roc = net_income / margin_required
    return dict(gross=gross_spread_income, rebate=rebate_income, adverse=adverse_selection_cost,
                net_income=net_income, capital_cost=capital_cost, net_of_capital=net_of_capital, roc=roc)

daily_volume = 25_000_000.0             # $25mm/day traded through this desk's quotes
margin_required = 4_000_000.0           # capital the venue requires posted
cost_of_capital = 0.14                  # the desk's hurdle rate

print("desk trading $%.0fmm/day, posting $%.0fmm margin, hurdle rate %.0f%%\n"
      % (daily_volume / 1e6, margin_required / 1e6, cost_of_capital * 100))
print(" spread capture(bp)  rebate(bp)  adverse selection(bp)   net income    ROC")
for spread_bp, rebate_bp, adverse_bp in ((3.0, 0.5, 1.0), (2.0, 0.5, 1.5), (1.0, 0.5, 2.0)):
    r = desk_economics(daily_volume, spread_bp, rebate_bp, margin_required, adverse_bp, cost_of_capital)
    print("       %4.1f              %4.1f            %4.1f              $%11.0f   %6.1f%%"
          % (spread_bp, rebate_bp, adverse_bp, r["net_income"], 100 * r["roc"]))

# Break-even: the minimum spread capture (bp) needed so ROC exactly equals
# the cost of capital -- below this, running the desk destroys value
# relative to just earning the hurdle rate on the same capital elsewhere.
rebate_bp, adverse_bp = 0.5, 1.5
target_roc = cost_of_capital
required_net_income = target_roc * margin_required
required_daily_bp_income = required_net_income / trading_days_local = 252
def solve_breakeven():
    # net_income = daily_volume*(spread_bp+rebate_bp-adverse_bp)/1e4*252 = target
    per_bp_annual = daily_volume / 1e4 * 252
    net_target = target_roc * margin_required
    spread_bp_needed = net_target / per_bp_annual - rebate_bp + adverse_bp
    return spread_bp_needed

breakeven_spread_bp = solve_breakeven()
print("\nbreak-even spread capture (ROC == %.0f%% hurdle rate) : %.3f bp"
      % (cost_of_capital * 100, breakeven_spread_bp))
r_check = desk_economics(daily_volume, breakeven_spread_bp, rebate_bp, margin_required, adverse_bp, cost_of_capital)
print("check: at that spread, ROC = %.4f%% (should equal the hurdle rate %.4f%%)"
      % (100 * r_check["roc"], 100 * cost_of_capital))

print("\nthis is the number a program manager should compare against a proposed")
print("designated-market-maker fee schedule BEFORE evaluating anything about the")
print("token incentives layered on top in week 4 -- if the venue's own fee/rebate")
print("schedule alone cannot clear the hurdle, no incentive design fixes that")
