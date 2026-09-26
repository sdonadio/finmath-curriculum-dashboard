#!/usr/bin/env python3
"""Generator for courses/finm-37301.js -- FINM 37301, Foreign Exchange:
Markets, Products & Pricing (Anthony Capozzoli).

    python3 tools/gen_finm_37301.py
    python3 tools/run_snippets.py courses/finm-37301.js
    python3 tools/validate.py courses/finm-37301.js

Provenance: the only readable source was the public course page
(data/raw/pages/finm-37301.txt). The syllabus is a Box link behind a
university login and returned no text; everything past the description is
this dashboard's own reconstruction of a standard treatment of the topics
the public page lists (spot/forward/deposit/swap/NDF pricing, FX options,
exotics and hybrids, market practice and monetary systems).

Every snippet below was run locally before the surrounding prose was
written. `output` is emitted empty and filled by tools/run_snippets.py.
"""
import json
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "courses", "finm-37301.js")

# ─────────────────────────────────────────────────────────────────────────
# Week 1 — spot, forwards, covered interest parity
# ─────────────────────────────────────────────────────────────────────────

W1C1_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Direct quotes against USD (USD is the quote currency for EURUSD/GBPUSD,
# the base currency for USDJPY) -- market bid/ask, mid computed for clarity.
quotes = {
    "EURUSD": (1.08452, 1.08468),   # 1 EUR = x USD
    "GBPUSD": (1.26810, 1.26834),   # 1 GBP = x USD
    "USDJPY": (149.820, 149.860),   # 1 USD = x JPY
}

def mid(pair):
    b, a = quotes[pair]
    return 0.5 * (b + a)

# Cross rate EURGBP implied by the two USD legs: EUR/GBP = (EUR/USD) / (GBP/USD)
eurusd_mid = mid("EURUSD")
gbpusd_mid = mid("GBPUSD")
eurgbp_implied = eurusd_mid / gbpusd_mid
print("EURUSD mid  : %.5f" % eurusd_mid)
print("GBPUSD mid  : %.5f" % gbpusd_mid)
print("EURGBP implied cross (mid/mid): %.5f" % eurgbp_implied)

# A market-maker quotes EURGBP directly too. Build its bid/ask from the two
# legs' bid/ask so the cross itself carries a spread, then compare to a
# quoted market price to look for triangular arbitrage.
eur_b, eur_a = quotes["EURUSD"]
gbp_b, gbp_a = quotes["GBPUSD"]
cross_bid = eur_b / gbp_a     # sell EUR for USD at bid, buy GBP with USD at ask
cross_ask = eur_a / gbp_b     # buy EUR with USD at ask, sell GBP for USD at bid
print("EURGBP synthetic bid/ask from the two legs: %.5f / %.5f" % (cross_bid, cross_ask))

quoted_eurgbp = (0.85440, 0.85465)
print("EURGBP quoted directly              : %.5f / %.5f" % quoted_eurgbp)

def round_trip_profit(notional_eur=1_000_000.0):
    # EUR -> USD -> GBP -> EUR via the two USD legs, then compare with going
    # EUR -> GBP directly at the quoted cross.
    usd = notional_eur * eur_b                    # sell EUR at bid
    gbp = usd / gbp_a                              # buy GBP at ask
    direct_gbp = notional_eur * quoted_eurgbp[0]   # sell EUR for GBP at quoted bid
    return gbp - direct_gbp

profit = round_trip_profit()
print("\ntriangulating EUR->USD->GBP vs selling EUR->GBP directly, on EUR 1,000,000:")
print("  GBP received via triangulation : %.2f" % (1_000_000.0 * eur_b / gbp_a))
print("  GBP received via direct cross  : %.2f" % (1_000_000.0 * quoted_eurgbp[0]))
print("  arbitrage profit in GBP        : %.2f  (%s)" %
      (profit, "an opportunity" if profit > 0 else "no opportunity after crossing the spread"))
'''

W1C2_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Covered interest parity: F = S * (1 + r_d * t) / (1 + r_f * t)  (simple money-
# market compounding, act/360, the market convention for short-dated deposits).
S = 1.08460          # EURUSD spot
r_usd = 0.0525       # USD deposit rate (domestic = USD, the quote currency)
r_eur = 0.0335       # EUR deposit rate (foreign = EUR, the base currency)

tenors_days = [30, 90, 180, 270, 360]
print("EURUSD spot = %.5f   r_usd = %.3f%%   r_eur = %.3f%%\n" % (S, r_usd * 100, r_eur * 100))
print(" tenor(d)     forward       fwd pts (pips)   % of spot")
for d in tenors_days:
    t = d / 360.0
    F = S * (1 + r_usd * t) / (1 + r_eur * t)
    pts = (F - S) * 10000          # EURUSD pips are the 4th decimal = 1e-4
    print("  %5d      %.5f        %8.2f          %7.4f%%" % (d, F, pts, 100 * (F / S - 1)))

# Sanity check: the sign of the forward points must match the rate
# differential -- USD rate above EUR rate means EUR trades forward at a
# premium against USD (F > S), because holding the lower-yielding currency
# is compensated by appreciation.
d = 360
t = d / 360.0
F1y = S * (1 + r_usd * t) / (1 + r_eur * t)
print("\n1y forward %.5f is %s spot (%.5f), consistent with r_usd > r_eur"
      % (F1y, "above" if F1y > S else "below", S))

# What if the rate differential flips?
F1y_flip = S * (1 + r_eur * t) / (1 + r_usd * t)
print("if the differential flipped (r_eur > r_usd), the 1y forward would be %.5f, below spot"
      % F1y_flip)
'''

W1C3_SRC = r'''import numpy as np
np.seterr(all="ignore")

# The replication that FORCES covered interest parity to hold. Suppose a
# market maker quotes a EURUSD forward F_quoted for tenor t that disagrees
# with the money-market-implied fair forward F_fair. Sell EUR forward at
# F_quoted (deliver EUR notional, receive USD notional*F_quoted at t), and
# manufacture the EUR you must deliver with a pure money-market trade:
# borrow USD today, buy EUR spot, invest the EUR at r_eur so it grows to
# exactly `notional` EUR at time t.

S = 1.08460
r_usd, r_eur = 0.0525, 0.0335
t = 0.5
notional_eur = 10_000_000.0
F_fair = S * (1 + r_usd * t) / (1 + r_eur * t)

def carry_trade_profit(F_quoted):
    eur_needed_at_t = notional_eur                       # what the forward obliges you to deliver
    eur_to_buy_today = eur_needed_at_t / (1 + r_eur * t)  # invest at r_eur to reach it
    usd_borrowed_today = eur_to_buy_today * S             # cost, funded by borrowing USD
    usd_repaid_at_t = usd_borrowed_today * (1 + r_usd * t)
    usd_received_from_forward = notional_eur * F_quoted
    return usd_received_from_forward - usd_repaid_at_t

for F_quoted, label in ((F_fair, "fair (CIP-consistent)"),
                        (F_fair + 0.0050, "quoted rich vs fair (sell it)"),
                        (F_fair - 0.0050, "quoted cheap vs fair (buy it, mirror trade)")):
    profit = carry_trade_profit(F_quoted)
    print("F_quoted = %.5f (%-30s)  ->  riskless USD P&L at t = %+10.2f"
          % (F_quoted, label, profit))

print("\nfair forward from the money-market formula : %.5f" % F_fair)
print("profit as a function of the mispricing       : notional * (F_quoted - F_fair)")
print("  check at +50 pip mispricing: %.2f == %.2f"
      % (carry_trade_profit(F_fair + 0.0050), notional_eur * 0.0050))
print("P&L at the fair forward is exactly zero to machine precision: %.2e"
      % abs(carry_trade_profit(F_fair)))
'''

W1C4_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Interbank FX forwards are quoted as SWAP POINTS (the difference from spot,
# in pips), not as an outright price. A trader adds the points to spot to
# get the outright, and the points carry their own bid/ask -- generally
# wider than spot's, and widening further with tenor as rate uncertainty
# and funding cost compound.

spot_bid, spot_ask = 1.08452, 1.08468       # spot bid/ask, 1.6 pip spread

# swap points quoted directly by the market (bid, ask), in pips; tenor in days
points_bid_ask = {
    "1M":  (16.2, 18.0),
    "3M":  (49.5, 53.0),
    "6M":  (98.0, 104.5),
    "9M":  (146.0, 156.0),
    "1Y":  (192.0, 207.0),
}

def to_price(pips):
    return pips / 10000.0

print("spot            : %.5f / %.5f   (spread %.1f pips)\n"
      % (spot_bid, spot_ask, (spot_ask - spot_bid) * 10000))
print(" tenor   points(bid/ask)      outright bid/ask       outright spread(pips)  pts-spread/spot-spread")
spot_spread = (spot_ask - spot_bid) * 10000
for tenor, (pb, pa) in points_bid_ask.items():
    out_bid = spot_bid + to_price(pb)
    out_ask = spot_ask + to_price(pa)
    out_spread = (out_ask - out_bid) * 10000
    pts_spread = pa - pb
    print("  %-4s   %6.1f / %6.1f        %.5f / %.5f         %6.2f              %6.2fx"
          % (tenor, pb, pa, out_bid, out_ask, out_spread, out_spread / spot_spread))

# The forward's bid/ask spread grows roughly linearly with tenor because it
# is dominated by the swap-point spread, not the (roughly fixed) spot spread.
tenors_m = np.array([1, 3, 6, 9, 12])
spreads = np.array([(pa - pb) for pb, pa in points_bid_ask.values()])
slope, intercept = np.polyfit(tenors_m, spreads, 1)
print("\nswap-point spread vs tenor (months): slope %.3f pips/month, intercept %.3f"
      % (slope, intercept))
print("a 1M forward's spread is already %.1fx spot's; a 1Y forward's is %.1fx"
      % (spreads[0] / spot_spread, spreads[-1] / spot_spread))
'''

# ─────────────────────────────────────────────────────────────────────────
# Week 2 — cross-currency basis, swaps, NDFs, multi-curve discounting
# ─────────────────────────────────────────────────────────────────────────

W2C1_SRC = r'''import numpy as np
np.seterr(all="ignore")

# The cross-currency basis: the spread that must be added to the FOREIGN
# leg's rate before covered interest parity reproduces the market's quoted
# forward. If CIP held exactly, basis = 0. In practice it is persistently
# non-zero because arranging the trade uses bank balance sheet, and that
# balance sheet has a cost and a regulatory capital charge that differs by
# currency and by which side of the trade a bank is on.

S = 1.08460
r_usd = 0.0525
r_eur_ois = 0.0335          # the "clean" OIS-style EUR rate CIP assumes
t = 1.0
target_basis_bp = -35.0      # a realistic post-2015 EURUSD cross-currency basis

# The forward the market actually trades at, given that basis (solved
# algebraically rather than guessed, so the example is exact).
r_eur_implied_target = r_eur_ois + target_basis_bp / 10000.0
F_market = S * (1 + r_usd * t) / (1 + r_eur_implied_target * t)
F_textbook = S * (1 + r_usd * t) / (1 + r_eur_ois * t)

print("textbook (basis = 0) 1y forward : %.5f" % F_textbook)
print("market-quoted 1y forward        : %.5f" % F_market)

r_eur_implied = (S * (1 + r_usd * t) / F_market - 1) / t
basis_bp = (r_eur_implied - r_eur_ois) * 10000
print("EUR rate implied by the market forward : %.4f%%" % (r_eur_implied * 100))
print("cross-currency basis (implied - OIS)    : %+.1f bp" % basis_bp)

print("\nreading the sign: a NEGATIVE EUR basis means it costs EUR-based banks")
print("extra to borrow USD via an FX swap versus borrowing USD directly --")
print("USD funding is scarce/expensive for non-US banks relative to their")
print("home-currency rate, so they pay up in the swap market to get it.\n")

# The basis widens under funding stress. Show the extra annual USD funding
# cost on a $500mm programme at a few stress levels.
notional_usd_equiv = 500_000_000.0
print("stress scenario   extra annual USD funding cost on $500mm")
for basis_bp_scn in (-20, -50, -100, -180):
    extra_cost = notional_usd_equiv * (-basis_bp_scn / 10000.0) * t
    print("  basis = %+5.0f bp        $%s" % (basis_bp_scn, format(extra_cost, ",.0f")))
'''

W2C2_SRC = r'''import numpy as np
np.seterr(all="ignore")

# A cross-currency basis swap exchanges principal at trade date (EUR for
# USD at spot), pays a floating reference rate on each leg for the trade's
# life, and re-exchanges the SAME principal amounts at maturity. The one
# free parameter that clears the market at inception is a running spread
# added to one leg -- the swap-market's way of quoting the basis from the
# previous concept as an annuity instead of a single forward-point number.

S = 1.08460
notional_eur = 100_000_000.0
notional_usd = notional_eur * S
years = np.arange(1, 6)
r_usd_ois = 0.0480                          # USD OIS discount rate, discounts the USD leg
df_usd = 1.0 / (1 + r_usd_ois) ** years
annuity_usd = df_usd.sum()

true_basis_bp = -35.0                       # the market-clearing basis from the previous concept
true_spread = -true_basis_bp / 10000.0      # spread ADDED to the USD leg, market sign convention

def pv_of_running_spread(spread, notional=notional_usd, annuity=annuity_usd):
    return spread * notional * annuity      # PV of a running spread paid annually for the life

pv_true = pv_of_running_spread(true_spread)
print("market-clearing USD spread          : %+.1f bp   PV of that spread leg : %.0f USD"
      % (true_spread * 10000, pv_true))

# Mark a trade struck at the true spread, but VALUE it as if the basis were
# zero -- a "textbook CIP" desk that ignores the basis entirely.
pv_at_zero_assumption = pv_of_running_spread(0.0)
mtm_error = pv_true - pv_at_zero_assumption
print("valued assuming zero basis (wrong)  : %.0f USD" % pv_at_zero_assumption)
print("mark-to-market error from ignoring the basis on $%.0fmm notional : %.0f USD"
      % (notional_usd / 1e6, mtm_error))

print("\nsame error at other tenors (longer annuity, larger error):")
for yrs in (1, 2, 3, 5, 10):
    yy = np.arange(1, yrs + 1)
    ann = (1.0 / (1 + r_usd_ois) ** yy).sum()
    err = true_spread * notional_usd * ann
    print("  %2dy annuity %.3f  ->  basis-blindness error %.0f USD" % (yrs, ann, err))
'''

W2C3_SRC = r'''import numpy as np
np.seterr(all="ignore")

# A non-deliverable forward (NDF) settles in cash, in a hard currency
# (almost always USD), based on the DIFFERENCE between a contracted forward
# rate and an official fixing published on the fixing date -- used when the
# other currency is not freely convertible (capital controls) or its
# onshore market is inaccessible offshore. No principal ever changes hands
# in the restricted currency.

K = 5.0250          # contracted NDF rate, local-currency units per USD*1000 (illustrative units)
notional_usd = 20_000_000.0     # NDF notional, expressed in USD

def ndf_settlement(fixing, K=K, notional_usd=notional_usd):
    """Cash settlement to the party who is LONG the local currency (short USD),
    i.e. who benefits if the local currency weakens LESS than the forward
    priced in (fixing < K in this quoting convention: local units per USD*1000
    falling numerically means the local currency is STRONGER -- keep the
    convention fixed and let the numbers carry the intuition)."""
    return notional_usd * (K - fixing) / fixing

fixings = [4.9000, 5.0000, 5.0250, 5.1500, 5.4000, 6.0000]
print("contracted NDF rate K = %.4f, USD notional = %.0f\n" % (K, notional_usd))
print("  fixing     settlement to the long-local-currency side (USD)")
for f in fixings:
    s = ndf_settlement(f)
    print("  %.4f     %+14.0f" % (f, s))

# Compare against what a DELIVERABLE forward would have required: full
# exchange of principal at the contracted rate, which needs the restricted
# currency to actually be deliverable offshore -- the thing an NDF avoids.
print("\na deliverable forward at the same K would need to physically deliver")
print("local-currency notional = USD %.0f * %.4f = %.0f units of local currency"
      % (notional_usd, K, notional_usd * K))
print("offshore -- which is precisely what capital controls prevent, and why")
print("the NDF settles the ECONOMIC difference in USD instead.\n")

# The fixing basis: onshore forwards (deliverable, restricted to local banks)
# and NDF-implied forwards can trade at different levels because they draw
# on different, only partially connected pools of liquidity and hedging
# capacity. Show the gap that WOULD be arbitrage if both were freely
# accessible, and why it is not free to exploit in practice.
onshore_fwd = 5.0100
ndf_implied_fwd = K
gap = ndf_implied_fwd - onshore_fwd
print("onshore deliverable forward    : %.4f" % onshore_fwd)
print("offshore NDF-implied forward   : %.4f" % ndf_implied_fwd)
print("gap (the 'onshore-offshore basis')   : %+.4f" % gap)
print("arbitrable only by someone who can access BOTH pools -- exactly what")
print("capital controls restrict")
'''

W2C4_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Multi-curve discounting: once basis is non-zero, a EUR cashflow COLLATERALISED
# in USD is not discounted on the plain EUR OIS curve -- it needs a EUR-under-
# USD-CSA curve that embeds the basis. Bootstrap that curve, one tenor at a
# time, from quoted basis-swap spreads, the same way a rates desk bootstraps
# a LIBOR/SOFR curve from swap quotes: solve each tenor's discount factor so
# the instrument that matures there reprices to zero, given the shorter
# tenors already solved.

r_eur_ois = 0.0290                              # plain EUR OIS annual rate (flat, illustrative)
basis_bp = {1: -28.0, 2: -32.0, 3: -35.0, 5: -38.0, 7: -40.0, 10: -42.0}   # market quotes

df_eur_ois = {t: 1.0 / (1 + r_eur_ois) ** t for t in basis_bp}

# The EUR-under-USD-CSA curve applies the OIS rate PLUS the (negative) basis
# at each tenor -- a simplified bootstrap that is exact for a flat-basis
# term structure and a good first approximation otherwise.
df_eur_csa = {}
for t, b in basis_bp.items():
    r_adj = r_eur_ois + b / 10000.0
    df_eur_csa[t] = 1.0 / (1 + r_adj) ** t

print(" tenor   basis(bp)   DF plain-OIS   DF EUR-under-USD-CSA   DF gap (bp of notional)")
for t in sorted(basis_bp):
    gap_bp = (df_eur_ois[t] - df_eur_csa[t]) * 10000
    print("  %2dy      %+5.1f       %.5f          %.5f              %+7.1f"
          % (t, basis_bp[t], df_eur_ois[t], df_eur_csa[t], gap_bp))

# Discounting a EUR 200mm receipt at the 5y point the wrong way (plain OIS
# instead of the CSA-adjusted curve) misprices it by:
notional = 200_000_000.0
t5 = 5
pv_right = notional * df_eur_csa[t5]
pv_wrong = notional * df_eur_ois[t5]
print("\nEUR %.0f due in %dy" % (notional, t5))
print("  PV on the correct EUR-under-USD-CSA curve : %.0f" % pv_right)
print("  PV on the plain EUR OIS curve (wrong)      : %.0f" % pv_wrong)
print("  mispricing                                  : %.0f EUR" % (pv_right - pv_wrong))
'''

# ─────────────────────────────────────────────────────────────────────────
# Week 3 — FX options: Garman-Kohlhagen, delta conventions, the smile
# ─────────────────────────────────────────────────────────────────────────

W3C1_SRC = r'''import numpy as np
from scipy.stats import norm
np.seterr(all="ignore")

# Garman-Kohlhagen: Black-Scholes with TWO risk-free rates, because an FX
# option's underlying (a unit of foreign currency) itself earns interest at
# the foreign rate r_f, exactly the way a dividend-paying stock earns a
# dividend yield. Replace Black-Scholes's q with r_f and everything else is
# identical: the option is priced off the FORWARD, not the spot, once you
# account for the cost of carry.

def gk_price(S, K, r_d, r_f, sigma, t, kind="call"):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    d2 = d1 - sigma * np.sqrt(t)
    disc_d = np.exp(-r_d * t)
    if kind == "call":
        return disc_d * (F * norm.cdf(d1) - K * norm.cdf(d2))
    return disc_d * (K * norm.cdf(-d2) - F * norm.cdf(-d1))

S = 1.08460
K = 1.10000
r_d, r_f = 0.0525, 0.0335        # USD domestic, EUR foreign (EURUSD, USD per EUR)
sigma = 0.082
t = 0.5

call = gk_price(S, K, r_d, r_f, sigma, t, "call")
put = gk_price(S, K, r_d, r_f, sigma, t, "put")
print("EURUSD S=%.5f K=%.5f sigma=%.1f%% t=%.2fy  r_usd=%.2f%% r_eur=%.2f%%"
      % (S, K, sigma * 100, t, r_d * 100, r_f * 100))
print("call = %.5f USD per EUR   put = %.5f USD per EUR" % (call, put))

# Put-call parity for FX options: call - put = discounted forward minus strike.
F = S * np.exp((r_d - r_f) * t)
parity_lhs = call - put
parity_rhs = np.exp(-r_d * t) * (F - K)
print("\nput-call parity check: call - put = %.6f, disc*(F-K) = %.6f, diff = %.2e"
      % (parity_lhs, parity_rhs, abs(parity_lhs - parity_rhs)))

# The FX symmetry: a EUR call struck at K, priced in USD, is worth S*K times
# a USD put on EUR struck at 1/K, priced in EUR with the two rates swapped --
# the same contract, quoted from either currency's side.
usd_put_on_eur = gk_price(1 / S, 1 / K, r_f, r_d, sigma, t, "put")
symmetric_value = S * K * usd_put_on_eur
print("\nFX symmetry: EUR call, USD terms          = %.6f" % call)
print("             S * K * (mirrored USD-put-on-EUR) = %.6f" % symmetric_value)
print("             difference: %.2e (same contract, priced from either currency's side)"
      % abs(call - symmetric_value))
'''

W3C2_SRC = r'''import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq
np.seterr(all="ignore")

# FX options are quoted BY DELTA, not by strike: a trader asks for "the
# 25-delta call", and the strike is whatever number currently produces that
# delta. Three deltas matter and they are NOT the same number:
#   spot delta      = e^{-r_f t} N(d1)            (Black-Scholes delta)
#   forward delta    = N(d1)                        (delta w.r.t. the forward)
#   premium-adjusted = spot delta - premium/S        (used when the premium
#                       is paid in the FOREIGN currency, common for e.g.
#                       USD/EM pairs where the premium is paid in USD)

def gk_price(S, K, r_d, r_f, sigma, t, kind="call"):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    d2 = d1 - sigma * np.sqrt(t)
    disc_d = np.exp(-r_d * t)
    if kind == "call":
        return disc_d * (F * norm.cdf(d1) - K * norm.cdf(d2))
    return disc_d * (K * norm.cdf(-d2) - F * norm.cdf(-d1))

def spot_delta(S, K, r_d, r_f, sigma, t, kind="call"):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    if kind == "call":
        return np.exp(-r_f * t) * norm.cdf(d1)
    return -np.exp(-r_f * t) * norm.cdf(-d1)

S, r_d, r_f, sigma, t = 1.08460, 0.0525, 0.0335, 0.082, 0.5

# Solve for the strike that gives a target spot delta, for calls and puts.
def strike_for_delta(target_delta, kind, S=S, r_d=r_d, r_f=r_f, sigma=sigma, t=t):
    f = lambda K: spot_delta(S, K, r_d, r_f, sigma, t, kind) - target_delta
    lo, hi = S * 0.5, S * 2.0
    return brentq(f, lo, hi)

print("EURUSD S=%.5f  sigma=%.1f%%  t=%.2fy\n" % (S, sigma * 100, t))
print("target delta   kind   strike       premium(USD/EUR)   spot delta at that strike")
for target, kind in ((0.50, "call"), (0.25, "call"), (0.10, "call"),
                     (-0.25, "put"), (-0.10, "put")):
    K = strike_for_delta(target, kind)
    prem = gk_price(S, K, r_d, r_f, sigma, t, kind)
    chk = spot_delta(S, K, r_d, r_f, sigma, t, kind)
    print("   %+.2f       %-5s  %.5f      %.5f              %+.4f"
          % (target, kind, K, prem, chk))

# The 50-delta strike is close to, but not exactly, the at-the-money-forward
# strike (K = F); the gap comes from both the sigma^2 t/2 term in d1 and the
# e^{-r_f t} prefactor on delta.
F = S * np.exp((r_d - r_f) * t)
K50 = strike_for_delta(0.50, "call")
print("\nATM forward F = %.5f;  50-delta call strike = %.5f;  gap = %.5f"
      % (F, K50, K50 - F))
print("(the gap comes from BOTH the sigma^2 t/2 term in d1 and the e^{-r_f t}")
print(" prefactor on delta -- the '50-delta' strike is not exactly the ATMF strike)")
'''

W3C3_SRC = r'''import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq
np.seterr(all="ignore")

# The FX vol market quotes three numbers per tenor, not a strike-by-strike
# curve: ATM vol, the 25-delta risk reversal (RR = vol(25c) - vol(25p), the
# skew), and the 25-delta butterfly (BF = 0.5*(vol(25c)+vol(25p)) - vol(ATM),
# the convexity). From those three numbers you can back out the two
# individual wing vols, then invert delta to get the strikes they sit at --
# which is the whole smile, quoted as three numbers instead of a curve.

S, r_d, r_f, t = 1.08460, 0.0525, 0.0335, 0.5
vol_atm = 0.082
rr_25 = -0.0110          # 25d RR negative: OTM puts trade richer than OTM calls (downside skew)
bf_25 = 0.0035           # 25d BF positive: wings trade above the ATM/RR-implied straight line

vol_25c = vol_atm + 0.5 * rr_25 + bf_25
vol_25p = vol_atm - 0.5 * rr_25 + bf_25
print("ATM vol = %.2f%%   25d RR = %+.2f%%   25d BF = %+.2f%%" % (vol_atm * 100, rr_25 * 100, bf_25 * 100))
print("-> 25-delta call vol = %.2f%%     25-delta put vol = %.2f%%" % (vol_25c * 100, vol_25p * 100))

def spot_delta(S, K, r_d, r_f, sigma, t, kind):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    return np.exp(-r_f * t) * norm.cdf(d1) if kind == "call" else -np.exp(-r_f * t) * norm.cdf(-d1)

def strike_for_delta(target, kind, sigma, S=S, r_d=r_d, r_f=r_f, t=t):
    f = lambda K: spot_delta(S, K, r_d, r_f, sigma, t, kind) - target
    return brentq(f, S * 0.4, S * 2.5)

K_atm = S * np.exp((r_d - r_f) * t)                        # ATMF strike, this desk's convention
K_25c = strike_for_delta(0.25, "call", vol_25c)
K_25p = strike_for_delta(-0.25, "put", vol_25p)

print("\nsmile as (strike, vol) points:")
for label, K, v in (("25d put", K_25p, vol_25p), ("ATM(F)", K_atm, vol_atm), ("25d call", K_25c, vol_25c)):
    print("  %-8s  K=%.5f   vol=%.2f%%" % (label, K, v * 100))

# Interpolate a full smile (quadratic in strike, the crudest sensible curve
# through three points) and read off the vol a risk system would use for a
# strike the desk did not directly quote.
Ks = np.array([K_25p, K_atm, K_25c])
vs = np.array([vol_25p, vol_atm, vol_25c])
coeffs = np.polyfit(Ks, vs, 2)
K_query = 1.1150
vol_query = np.polyval(coeffs, K_query)
print("\ninterpolated vol at K=%.4f (between ATM and the 25d call): %.3f%%" % (K_query, vol_query * 100))
'''

W3C4_SRC = r'''import numpy as np
from scipy.stats import norm
np.seterr(all="ignore")

# Pricing an OTM option off a single flat (ATM) vol instead of the smile is
# a common, quantifiable mistake: the option's own vol is what belongs in
# Garman-Kohlhagen, not the ATM number, and the two diverge most exactly
# where OTM risk lives.

def gk_price(S, K, r_d, r_f, sigma, t, kind="call"):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    d2 = d1 - sigma * np.sqrt(t)
    disc_d = np.exp(-r_d * t)
    if kind == "call":
        return disc_d * (F * norm.cdf(d1) - K * norm.cdf(d2))
    return disc_d * (K * norm.cdf(-d2) - F * norm.cdf(-d1))

def gk_vega(S, K, r_d, r_f, sigma, t):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    return np.exp(-r_d * t) * F * norm.pdf(d1) * np.sqrt(t)

S, r_d, r_f, t = 1.08460, 0.0525, 0.0335, 0.5
vol_atm, vol_25p, K_25p = 0.082, 0.091, 1.05151      # from the previous concept's smile
notional_eur = 25_000_000.0

price_smile = gk_price(S, K_25p, r_d, r_f, vol_25p, t, "put")
price_flat = gk_price(S, K_25p, r_d, r_f, vol_atm, t, "put")
vega = gk_vega(S, K_25p, r_d, r_f, vol_25p, t)

print("25-delta put, K=%.5f, true smile vol %.2f%%, ATM vol %.2f%%\n" % (K_25p, vol_25p * 100, vol_atm * 100))
print("premium at the option's own (smile) vol : %.5f USD per EUR" % price_smile)
print("premium if you (wrongly) used flat ATM vol: %.5f USD per EUR" % price_flat)
print("mispricing per EUR notional               : %.5f" % (price_smile - price_flat))
print("mispricing on EUR %.0fmm notional           : %.0f USD"
      % (notional_eur / 1e6, (price_smile - price_flat) * notional_eur))
print("\nvega at this strike : %.6f USD per EUR per 1.00 vol point"
      % (vega / 100))
print("a 0.9-vol-point misread priced through vega alone would be off by %.5f -- close to,"
      % (vega / 100 * 0.9))
print("but not exactly, the full reprice above, because vega is a LOCAL slope and the")
print("true mispricing also reflects gamma/vanna curvature over a 0.9-point vol move")
'''

# ─────────────────────────────────────────────────────────────────────────
# Week 4 — exotics and hybrids
# ─────────────────────────────────────────────────────────────────────────

W4C1_SRC = r'''import numpy as np
np.seterr(all="ignore")

# A down-and-out call: an ordinary call that is knocked out (worth zero for
# the rest of its life) the first time spot trades at or below a barrier B.
# Priced under GBM by Monte Carlo, simulating the whole path (not just the
# endpoint) because the barrier can be breached before expiry -- exactly
# the running-maximum problem the reflection principle solves in closed
# form for a simple random walk.

rng = np.random.default_rng(37301)
S0, K, B = 1.08460, 1.10000, 1.04000
r_d, r_f, sigma, t = 0.0525, 0.0335, 0.082, 0.5
n_paths, n_steps = 200_000, 126           # ~ a step every trading day for 6 months

dt = t / n_steps
drift = (r_d - r_f - 0.5 * sigma ** 2) * dt
vol_step = sigma * np.sqrt(dt)
Z = rng.standard_normal((n_paths, n_steps))
log_paths = np.cumsum(drift + vol_step * Z, axis=1)
S_paths = S0 * np.exp(log_paths)
S_paths = np.concatenate([np.full((n_paths, 1), S0), S_paths], axis=1)

ever_breached = (S_paths <= B).any(axis=1)
terminal = S_paths[:, -1]
vanilla_payoff = np.maximum(terminal - K, 0.0)
do_payoff = np.where(ever_breached, 0.0, vanilla_payoff)

disc = np.exp(-r_d * t)
vanilla_price = disc * vanilla_payoff.mean()
do_price = disc * do_payoff.mean()
do_se = disc * do_payoff.std() / np.sqrt(n_paths)

print("vanilla call (no barrier)         : %.5f  (MC)" % vanilla_price)
print("down-and-out call, B=%.5f         : %.5f +/- %.5f (MC std err)" % (B, do_price, do_se))
print("fraction of paths that ever breach the barrier : %.3f" % ever_breached.mean())

# In-out parity: down-and-out + down-and-in = vanilla, for the SAME barrier
# and strike, always -- a model-free identity worth checking every time.
di_payoff = np.where(ever_breached, vanilla_payoff, 0.0)
di_price = disc * di_payoff.mean()
print("down-and-in call (complement)     : %.5f  (MC)" % di_price)
print("do + di vs vanilla                : %.5f + %.5f = %.5f   (vanilla was %.5f, diff %.2e)"
      % (do_price, di_price, do_price + di_price, vanilla_price, abs(do_price + di_price - vanilla_price)))

print("\n%.1f%% of paths breach the barrier at some point over the 6 months, yet the"
      % (100 * ever_breached.mean()))
print("down-and-out still trades at %.1f%% of the vanilla premium: most breaching"
      % (100 * do_price / vanilla_price))
print("paths were headed to a worthless expiry anyway (S far below K), so the barrier")
print("mainly kills value that the vanilla payoff would barely have paid out")
'''

W4C2_SRC = r'''import numpy as np
from scipy.stats import norm
np.seterr(all="ignore")

# A digital (binary) call pays a fixed amount if S_T > K, zero otherwise --
# a payoff no static position in vanillas can match EXACTLY, but a tight
# call spread approximates arbitrarily well: long a call struck at K - e/2,
# short one at K + e/2, scaled by 1/e, converges to the digital as e -> 0.
# This "static replication" is also how a desk actually HEDGES a digital
# it has sold: with a call spread, not with the theoretical delta alone,
# because the digital's true delta blows up near expiry at the strike.

def gk_price(S, K, r_d, r_f, sigma, t, kind="call"):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    d2 = d1 - sigma * np.sqrt(t)
    disc_d = np.exp(-r_d * t)
    if kind == "call":
        return disc_d * (F * norm.cdf(d1) - K * norm.cdf(d2))
    return disc_d * (K * norm.cdf(-d2) - F * norm.cdf(-d1))

S, K, r_d, r_f, sigma, t = 1.08460, 1.10000, 0.0525, 0.0335, 0.082, 0.5
payout = 1_000_000.0                              # USD paid if EURUSD > K at expiry

# The exact digital value under Garman-Kohlhagen: disc_d * N(d2) * payout.
F = S * np.exp((r_d - r_f) * t)
d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
d2 = d1 - sigma * np.sqrt(t)
digital_exact = np.exp(-r_d * t) * norm.cdf(d2) * payout
print("exact digital value (closed form) : %.2f USD\n" % digital_exact)

print(" spread width(pips)   replicated value (USD)   error vs exact")
for eps_pips in (500, 100, 20, 5, 1):
    eps = eps_pips / 10000.0
    Klo, Khi = K - eps / 2, K + eps / 2
    call_lo = gk_price(S, Klo, r_d, r_f, sigma, t, "call")
    call_hi = gk_price(S, Khi, r_d, r_f, sigma, t, "call")
    replicated = (call_lo - call_hi) / eps * payout
    print("   %5d              %14.2f            %+10.2f"
          % (eps_pips, replicated, replicated - digital_exact))

print("\nas the spread narrows the replication converges to the exact value, but a")
print("REAL call spread also has a minimum tradeable width set by the market's")
print("strike granularity and bid/ask, which is exactly why traded digitals carry")
print("a persistent bid/ask premium over their Garman-Kohlhagen fair value")
'''

W4C3_SRC = r'''import numpy as np
np.seterr(all="ignore")

# A quanto pays a foreign-asset payoff but SETTLES in domestic currency at a
# FIXED exchange rate (typically 1), so the FX exposure that would normally
# come with a cross-border payoff is stripped out by contract design.
# Removing that exposure changes the asset's effective drift under the
# domestic risk-neutral measure by a correlation term -- the quanto
# adjustment -- even though no FX rate ever appears in the payoff.

rng = np.random.default_rng(37301 + 1)
n_paths, n_steps = 400_000, 60
t = 60 / 252
r_d = 0.0525                    # domestic (USD) risk-free rate
sigma_asset = 0.24              # volatility of the foreign asset (e.g. a Nikkei future)
sigma_fx = 0.082                # volatility of the FX rate
rho = -0.35                     # correlation between the asset's returns and the FX rate
S0_asset = 30000.0
K = 30500.0

dt = t / n_steps
L = np.array([[1.0, 0.0], [rho, np.sqrt(1 - rho ** 2)]])   # Cholesky for correlated shocks

def simulate(drift_adjustment):
    Z = rng.standard_normal((n_paths, n_steps, 2))
    correlated = Z @ L.T
    asset_incr = (r_d + drift_adjustment - 0.5 * sigma_asset ** 2) * dt + sigma_asset * np.sqrt(dt) * correlated[:, :, 0]
    log_asset = np.cumsum(asset_incr, axis=1)[:, -1]
    return S0_asset * np.exp(log_asset)

# Naive (WRONG): price the quanto as if it were a plain domestic asset,
# using the asset's own risk-neutral drift with no adjustment.
terminal_naive = simulate(drift_adjustment=0.0)
payoff_naive = np.maximum(terminal_naive - K, 0.0)
price_naive = np.exp(-r_d * t) * payoff_naive.mean()

# Correct: the quanto drift adjustment is -rho * sigma_asset * sigma_fx
# (for a payoff quantoed by fixing the FX rate, standard sign convention
# when the asset and the FX rate are quoted so that FX up means the
# domestic currency weakens against the asset's currency).
quanto_adj = -rho * sigma_asset * sigma_fx
terminal_quanto = simulate(drift_adjustment=quanto_adj)
payoff_quanto = np.maximum(terminal_quanto - K, 0.0)
price_quanto = np.exp(-r_d * t) * payoff_quanto.mean()

print("correlation(asset, FX) = %+.2f    quanto drift adjustment = %+.4f (annualised)\n" % (rho, quanto_adj))
print("price with NO quanto adjustment (wrong)  : %.2f" % price_naive)
print("price WITH quanto adjustment (correct)   : %.2f" % price_quanto)
print("mispricing from ignoring the correlation  : %.2f  (%.1f%% of the correct price)"
      % (price_quanto - price_naive, 100 * (price_quanto - price_naive) / price_quanto))

print("\nsign check: rho < 0 here means the asset tends to rise when the domestic")
print("currency STRENGTHENS against the asset's currency; stripping that FX link")
print("out via the quanto %s the asset's effective drift"
      % ("raises" if quanto_adj > 0 else "lowers"))
'''

W4C4_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Uncovered interest parity (UIP) says the expected spot return should equal
# the interest rate differential: E[Delta ln S] = r_d - r_f. Testing that is
# the classic Fama regression: Delta ln S_{t->t+1} = alpha + beta*(f_t - s_t)
# + eps, where the forward premium (f_t - s_t) equals the rate differential
# under covered interest parity. UIP predicts alpha=0, beta=1. The famous
# empirical "forward premium puzzle" finds beta reliably NEGATIVE instead:
# high-yield currencies tend to APPRECIATE further, not depreciate as UIP
# requires, rewarding the carry trade on average -- at the cost of crash
# risk, since the reward is funded by a small chance of a large devaluation.

rng = np.random.default_rng(37301 + 2)
n = 480                                   # 40 years of monthly data
rate_diff = rng.normal(0.0, 0.02, n)      # forward premium each period (annualised, simplified)

# Build the carry payoff FIRST, with the stylised facts baked in: mostly
# small gains, a positive mean, and a rare large loss (negative skew) --
# then derive the FX return so the regression reproduces beta < 0.
k = 1.9                                    # how much the payoff co-moves with the rate gap
crash = rng.random(n) < 0.05
idio = rng.normal(0.028, 0.05, n) - crash * rng.exponential(0.32, n)
carry_payoff = k * rate_diff + idio
spot_return = rate_diff - carry_payoff     # rate gain minus the realised FX move

X = np.column_stack([np.ones(n), rate_diff])
beta_hat, *_ = np.linalg.lstsq(X, spot_return, rcond=None)
resid = spot_return - X @ beta_hat
se = np.sqrt(np.diag(np.linalg.inv(X.T @ X) * (resid @ resid) / (n - 2)))

print("Fama regression: Delta ln S = alpha + beta * (forward premium) + eps\n")
print("alpha_hat = %+.4f (se %.4f)" % (beta_hat[0], se[0]))
print("beta_hat  = %+.4f (se %.4f)   [UIP predicts beta = 1]" % (beta_hat[1], se[1]))
print("t-stat on beta = 1 : %.2f" % ((beta_hat[1] - 1) / se[1]))

print("\naverage carry payoff (rate gain - realised FX move) : %.4f per period" % carry_payoff.mean())
print("Sharpe-like ratio of the carry payoff                : %.3f"
      % (carry_payoff.mean() / carry_payoff.std()))
skew = ((carry_payoff - carry_payoff.mean()) ** 3).mean() / carry_payoff.std() ** 3
print("skewness of the carry payoff                          : %.3f  (negative = crash risk)" % skew)
print("worst monthly carry payoff in the sample              : %.4f  (%.0f such crashes occurred)"
      % (carry_payoff.min(), crash.sum()))
'''

# ─────────────────────────────────────────────────────────────────────────
# Week 5 — risk, carry, hedging, monetary systems
# ─────────────────────────────────────────────────────────────────────────

W5C1_SRC = r'''import numpy as np
np.seterr(all="ignore")

# The carry trade -- borrow the low-yield currency, hold the high-yield one
# -- earns the rate differential MOST months and loses a multiple of it in
# the rare month the funding currency snaps back (a de-peg, a risk-off
# unwind, a central bank surprise). The Sharpe ratio, built on the first two
# moments only, is blind to exactly the risk the position is short.

rng = np.random.default_rng(37310)
n_months = 600                                   # 50 years
annual_carry = 0.055                              # the rate differential harvested when nothing happens
monthly_carry = annual_carry / 12
normal_vol = 0.022                                # ordinary month-to-month FX noise
crash_prob = 1 / 60                               # roughly once per 5 years
crash_size_mean = 0.15                             # a 15%-average devaluation against the position

is_crash = rng.random(n_months) < crash_prob
normal_moves = rng.normal(monthly_carry, normal_vol, n_months)
crash_moves = -rng.exponential(crash_size_mean, n_months)
carry_return = np.where(is_crash, crash_moves, normal_moves)

mean_r, sd_r = carry_return.mean(), carry_return.std()
sharpe_monthly = mean_r / sd_r
skew = ((carry_return - mean_r) ** 3).mean() / sd_r ** 3
kurt = ((carry_return - mean_r) ** 4).mean() / sd_r ** 4

print("months simulated: %d   crashes realised: %d\n" % (n_months, is_crash.sum()))
print("mean monthly return   : %+.4f  (annualised %+.2f%%)" % (mean_r, mean_r * 12 * 100))
print("std dev monthly       : %.4f" % sd_r)
print("monthly Sharpe        : %.3f   annualised Sharpe : %.3f" % (sharpe_monthly, sharpe_monthly * np.sqrt(12)))
print("skewness               : %+.2f" % skew)
print("excess kurtosis        : %+.2f" % (kurt - 3))
print("win rate               : %.1f%%   average win %.4f   average loss %.4f"
      % (100 * (carry_return > 0).mean(), carry_return[carry_return > 0].mean(), carry_return[carry_return < 0].mean()))

# Compare with a fair coin flip of the SAME Sharpe engineered without any
# crash, to show the Sharpe alone cannot tell these two risk profiles apart.
matched = rng.normal(mean_r, sd_r, n_months)
print("\na Gaussian series matched to the same mean & std has Sharpe %.3f too, but"
      % (matched.mean() / matched.std()))
print("skewness %+.2f -- indistinguishable on Sharpe, very different in the tail"
      % (((matched - matched.mean()) ** 3).mean() / matched.std() ** 3))
'''

W5C2_SRC = r'''import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq
np.seterr(all="ignore")

# A USD-based firm expects EUR 10mm in 6 months (a foreign receivable) and
# must decide how to manage the FX risk: leave it unhedged, sell the EUR
# forward (locks in a rate, gives up upside), or buy a collar (sell a call
# to fund a put, bounding the outcome between two strikes while keeping
# some participation). Compare the distribution of USD proceeds under each.

def gk_price(S, K, r_d, r_f, sigma, t, kind="call"):
    F = S * np.exp((r_d - r_f) * t)
    d1 = (np.log(F / K) + 0.5 * sigma ** 2 * t) / (sigma * np.sqrt(t))
    d2 = d1 - sigma * np.sqrt(t)
    disc_d = np.exp(-r_d * t)
    if kind == "call":
        return disc_d * (F * norm.cdf(d1) - K * norm.cdf(d2))
    return disc_d * (K * norm.cdf(-d2) - F * norm.cdf(-d1))

rng = np.random.default_rng(37301 + 4)
S0, r_d, r_f, sigma, t = 1.08460, 0.0525, 0.0335, 0.082, 0.5
notional_eur = 10_000_000.0
n = 300_000

F = S0 * np.exp((r_d - r_f) * t)                      # the forward rate available today
Z = rng.standard_normal(n)
S_T = S0 * np.exp((r_d - r_f - 0.5 * sigma ** 2) * t + sigma * np.sqrt(t) * Z)

# Collar: buy a put at K_put (floor) funded by selling a call at K_call
# (cap), sized so the net premium is close to zero.
K_put = 1.06000
def call_premium(K):
    return gk_price(S0, K, r_d, r_f, sigma, t, "call")
def put_premium(K):
    return gk_price(S0, K, r_d, r_f, sigma, t, "put")

target_put_prem = put_premium(K_put)
K_call = brentq(lambda K: call_premium(K) - target_put_prem, S0, S0 * 1.5)
print("zero-cost collar: buy %.5f put, sell %.5f call (put premium %.5f, call premium %.5f)\n"
      % (K_put, K_call, target_put_prem, call_premium(K_call)))

usd_unhedged = notional_eur * S_T
usd_forward = notional_eur * F * np.ones(n)
usd_collar = notional_eur * np.clip(S_T, K_put, K_call)

for name, proceeds in (("unhedged", usd_unhedged), ("forward-hedged", usd_forward), ("collared", usd_collar)):
    print("%-15s  mean %14.0f   std %13.0f   5th pct %14.0f   95th pct %14.0f"
          % (name, proceeds.mean(), proceeds.std(), np.percentile(proceeds, 5), np.percentile(proceeds, 95)))

print("\nthe forward eliminates variance entirely but also all upside; the collar")
print("keeps variance between the two strikes' worth of participation; unhedged")
print("keeps 100% of both the upside and the downside")
'''

W5C3_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Parametric (variance-covariance) VaR for a multi-currency book: each
# exposure's dollar P&L variance is exposure^2 * sigma^2, and cross terms
# bring in the correlation matrix between the currency pairs -- exactly
# Markowitz portfolio variance, with FX exposures standing in for asset
# weights.

pairs = ["EURUSD", "GBPUSD", "JPYUSD", "MXNUSD"]
exposure_usd = np.array([25_000_000.0, -15_000_000.0, 10_000_000.0, 8_000_000.0])   # + = long, - = short
ann_vol = np.array([0.082, 0.095, 0.090, 0.130])
corr = np.array([
    [1.00, 0.55, 0.15, 0.20],
    [0.55, 1.00, 0.10, 0.15],
    [0.15, 0.10, 1.00, 0.05],
    [0.20, 0.15, 0.05, 1.00],
])
cov_ann = np.outer(ann_vol, ann_vol) * corr

t_days = 10                                     # a 10-day VaR horizon
cov_10d = cov_ann * (t_days / 252.0)
portfolio_var = exposure_usd @ cov_10d @ exposure_usd
portfolio_sd = np.sqrt(portfolio_var)

z_99 = 2.3263                                    # one-sided 99% normal quantile
var_99 = z_99 * portfolio_sd

standalone_var = z_99 * np.abs(exposure_usd) * ann_vol * np.sqrt(t_days / 252.0)
print("exposure (USD)      1-pair 10d 99% VaR")
for p, e, v in zip(pairs, exposure_usd, standalone_var):
    print("  %-8s %+14.0f      %12.0f" % (p, e, v))

print("\nsum of standalone VaRs (no diversification credit) : %12.0f" % standalone_var.sum())
print("portfolio 10-day 99%% VaR (with correlations)        : %12.0f" % var_99)
print("diversification benefit                              : %12.0f  (%.1f%% of the sum)"
      % (standalone_var.sum() - var_99, 100 * (1 - var_99 / standalone_var.sum())))

# The single biggest driver: the EUR/GBP correlation of 0.55 sitting on top
# of a long EUR / short GBP position that is ALREADY a partial hedge --
# zero out that one correlation and see how much VaR the book was really
# saving from it.
corr_no_eg = corr.copy()
corr_no_eg[0, 1] = corr_no_eg[1, 0] = 0.0
cov_10d_no_eg = (np.outer(ann_vol, ann_vol) * corr_no_eg) * (t_days / 252.0)
var_99_no_eg = z_99 * np.sqrt(exposure_usd @ cov_10d_no_eg @ exposure_usd)
print("\nVaR if EUR/GBP correlation were (wrongly) assumed zero : %12.0f" % var_99_no_eg)
print("understates the true diversification credit by         : %12.0f"
      % (var_99_no_eg - var_99))
'''

W5C4_SRC = r'''import numpy as np
np.seterr(all="ignore")

# Defending a currency peg means the central bank sells FX reserves to buy
# its own currency whenever there is net capital outflow, one-for-one, to
# hold the rate. The "impossible trinity" (Mundell-Fleming trilemma) says a
# country cannot simultaneously have a fixed exchange rate, free capital
# flows and an independent monetary policy: defending the peg against a
# sustained outflow is a race between the outflow rate and the reserve
# stock, and raising domestic rates to slow the outflow is the only lever
# available -- at the cost of the "independent monetary policy" corner.

reserves0 = 80.0                        # billion USD
monthly_outflow_base = 3.0              # billion USD/month at the current policy rate
sensitivity = 0.015                      # billion USD/month outflow reduced per bp of hike

def simulate(rate_hike_bp, months=36):
    reserves = reserves0
    path = [reserves]
    outflow = max(0.2, monthly_outflow_base - sensitivity * rate_hike_bp)
    for m in range(1, months + 1):
        reserves -= outflow
        path.append(max(reserves, 0.0))
        if reserves <= 0:
            break
    return path

for hike in (0, 100, 180, 400):
    path = simulate(hike)
    exhausted_at = len(path) - 1
    outflow = max(0.2, monthly_outflow_base - sensitivity * hike)
    status = ("exhausted at month %2d" % exhausted_at) if path[-1] <= 0 else \
             ("survives the full 36mo window, %.1fbn left" % path[-1])
    print("policy: +%4d bp hike  ->  monthly outflow %.2fbn  ->  %s"
          % (hike, outflow, status))

print("\nreserve path under NO hike (bn USD, every 6 months):")
p0 = simulate(0)
for m in range(0, len(p0), 6):
    print("  month %2d : %.1f" % (m, p0[m]))

print("\nreserve path under a 400bp defence:")
p600 = simulate(400)
for m in range(0, min(len(p600), 37), 6):
    print("  month %2d : %.1f" % (m, p600[m]))

print("\nthe trilemma in one line: the 400bp hike buys reserve life at the cost of")
print("whatever a 400bp-higher policy rate does to domestic growth and credit --")
print("free capital flows plus a fixed rate leaves no OTHER lever to pull")
'''

def code(src, lang="python"):
    return {"lang": lang, "src": src, "output": ""}


COURSE = {
    "code": "FINM 37301",
    "slug": "finm-37301",
    "title": "Foreign Exchange: Markets, Products & Pricing",
    "instructor": "Anthony Capozzoli",
    "quarter": "Spring",
    "units": 50,
    "block": "electives",
    "concentrations": ["rates-credit"],
    "source": {
        "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/rates-and-credit/finm-37301/",
        "syllabus_url": "https://uchicago.box.com/s/dh8d92xob4yhzygawyernjzn280wqhif",
        "fetched": "2026-09-26",
        "note": "The only source consulted is the public course page, which gives an official "
                "description of the course, its instructor, its quarter(s) and its units. The "
                "linked syllabus is a Box shared link gated behind a university login and could "
                "not be read. Everything on this page beyond the description block -- the "
                "five-week arc, the concepts, the code, the questions, the pitfalls and the "
                "glossary -- is the dashboard's own reconstruction of a standard treatment of the "
                "topics the public page lists (spot/forward/deposit pricing, cross-currency swaps "
                "and NDFs, FX options and delta conventions, exotics and hybrids, and FX market "
                "practice and monetary systems). It is not the instructor's outline, it was not "
                "reviewed by the instructor, and no claim is made about grading, assignments, "
                "exam format or which textbook is actually assigned. The public page lists this "
                "course under Spring for the in-person program and Winter 2026 for the online "
                "program; program.js's course index carries the in-person quarter."
    },
    "tier": "B",
    "description": (
        "This course examines international currency markets, financial products, and "
        "applications of quantitative models, with an emphasis on the quantitative methods and "
        "derivative products in common use today. Topics include pricing for FX products in "
        "theory and in practice -- spot, forward, futures, deposits, cross-currency swaps, "
        "non-deliverable contracts and FX options; FX markets in practice -- exchange rate "
        "regimes, international monetary systems, and FX modelling and forecasting; and "
        "practical market applications of FX options, exotic options and hybrid products."
    ),
    "prerequisites": [
        "FINM 33000 (Options) or equivalent exposure to Black-Scholes and risk-neutral pricing -- "
        "Garman-Kohlhagen is presented as a two-rate variant of it from week 3 onward.",
        "Comfort with present value and discounting well enough to read a term structure of "
        "discount factors without translation.",
        "Enough Python and NumPy to read a vectorised Monte Carlo loop and a small root-solve; "
        "every snippet in this course is short and needs nothing beyond NumPy and SciPy.",
        "Basic probability and regression, for the empirical work in week 4 and week 5."
    ],
    "textbooks": [
        {"title": "FX Options and Structured Products", "author": "Uwe Wystup",
         "note": "The standard trading-desk reference for this course's core: Garman-Kohlhagen, "
                 "delta and premium conventions, risk-reversal/butterfly smile construction, and "
                 "the exotics and hybrids of week 4."},
        {"title": "Foreign Exchange Option Pricing: A Practitioner's Guide", "author": "Iain J. Clark",
         "note": "A complementary quant-desk treatment of vol surfaces, smile-consistent pricing "
                 "and exotic FX structures, with more of the numerical-methods detail."},
        {"title": "Options, Futures, and Other Derivatives", "author": "John C. Hull",
         "note": "General derivatives background: Black-Scholes, the Greeks, and Monte Carlo "
                 "pricing, all of which this course specialises to two currencies."},
        {"title": "Fixed Income Securities", "author": "Bruce Tuckman and Angel Serrat",
         "note": "Curve-building and discounting conventions behind the multi-curve, "
                 "cross-currency discounting in week 2."},
        {"title": "International Money and Finance", "author": "Michael Melvin and Stefan Norrbin",
         "note": "Market-structure and macro background for week 5: exchange rate regimes, the "
                 "impossible trinity, and the empirics of uncovered interest parity."},
    ],
    "skills_built": [
        "fx-markets", "cost-of-carry", "volatility-smile", "greeks",
        "monte-carlo-pricing", "carry-trade", "hedging",
    ],
    "skills_assumed": [
        "black-scholes-pde", "risk-neutral-pricing", "yield-curve", "numpy",
    ],
    "brushup": [
        {"topic": "Black-Scholes and risk-neutral pricing",
         "why": "Garman-Kohlhagen is introduced from week 3 as Black-Scholes with a second rate "
                "standing in for a dividend yield; if that substitution feels unfamiliar, the "
                "whole week reads as new notation instead of one small change.",
         "resource": "Hull, Options, Futures, and Other Derivatives, chapters 13-15 and 19"},
        {"topic": "Present value, discount factors and simple compounding conventions",
         "why": "Every forward and swap price in weeks 1-2 is a ratio or difference of discount "
                "factors under act/360 money-market compounding, not continuous compounding.",
         "resource": "Tuckman and Serrat, Fixed Income Securities, chapter 1"},
        {"topic": "The standard normal CDF and Black-Scholes' Greeks",
         "why": "Delta, vega and the d1/d2 machinery reappear constantly from week 3 on, in a "
                "two-rate form; fluency with the one-rate version makes the extension mechanical.",
         "resource": "Hull, chapter 19"},
        {"topic": "Vectorised Monte Carlo simulation in NumPy",
         "why": "Weeks 4 and 5 price a barrier option and simulate carry-trade and hedging "
                "outcomes by drawing hundreds of thousands of paths at once; a loop-per-path "
                "habit will not finish in time and will not read like the code here.",
         "resource": "The NumPy user guide, 'Broadcasting', plus any GBM-simulation tutorial"},
        {"topic": "Ordinary least squares and reading a regression table",
         "why": "The forward-premium-puzzle regression in week 4 and its interpretation is the "
                "one piece of applied econometrics in the course.",
         "resource": "Any introductory econometrics text's OLS chapter"},
        {"topic": "Basic open-economy macro: balance of payments and interest rate parity intuition",
         "why": "Week 5's exchange-rate-regime material assumes you already know why a country "
                "with a fixed rate and open capital account cares about its reserves.",
         "resource": "Melvin and Norrbin, International Money and Finance, chapter 2"},
    ],
    "weeks": [
        {
            "n": 1,
            "title": "Spot, forwards and covered interest parity",
            "topics": ["quoting conventions and cross rates", "triangular arbitrage",
                       "covered interest rate parity", "the replication argument",
                       "forward points and swap-point quoting"],
            "concepts": [
                {
                    "name": "Quoting conventions, cross rates and triangular arbitrage",
                    "explain": (
                        "<p>Every FX quote names a base and a quote currency: EURUSD 1.0846 means "
                        "one EUR buys 1.0846 USD, and the market moves in pips (the fourth decimal "
                        "for most pairs) with a bid/ask spread on top. A cross rate between two "
                        "currencies that are each quoted against a common third currency -- USD, "
                        "almost always -- is not independently set; it is implied by the two USD "
                        "legs, and a market maker who quotes it directly must keep it consistent "
                        "with that implication or hand an arbitrage to anyone who notices.</p>"
                        "<p>The snippet builds EURGBP two ways: as the mid/mid ratio of EURUSD and "
                        "GBPUSD (1.08460/1.26822 = 0.85521), and as a proper bid/ask synthetic cross "
                        "built from the two legs' own bid/ask (0.85507/0.85536), which is the number "
                        "a desk actually trades on. Comparing that synthetic cross to a directly "
                        "quoted EURGBP of 0.85440/0.85465 finds a real gap: triangulating EUR to USD "
                        "to GBP nets GBP 670.41 more than selling EUR for GBP directly, on a EUR "
                        "1,000,000 notional, even after crossing every spread involved.</p>"
                        "<p>A trading desk cares because this is the mechanical check that keeps "
                        "every quoted cross honest, and because in practice these gaps close in "
                        "seconds -- the exercise is really about the size of the tolerance a "
                        "quoting engine should use, not about a standing profit opportunity.</p>"
                    ),
                    "code": code(W1C1_SRC),
                },
                {
                    "name": "Covered interest rate parity and forward points",
                    "explain": (
                        "<p>A forward exchange rate is not a forecast; it is a pure arbitrage "
                        "price pinned down by the two currencies' money-market rates through "
                        "covered interest rate parity, F = S(1+r_d t)/(1+r_f t). The rate on the "
                        "higher-yielding currency shows up as a forward premium on the "
                        "lower-yielding one: hold the currency that pays less interest and the "
                        "forward compensates you by pricing it to appreciate, so that no riskless "
                        "trade beats any other.</p>"
                        "<p>The code prices the EURUSD forward at five tenors given r_usd = 5.25% "
                        "and r_eur = 3.35%. Forward points -- the difference from spot, quoted in "
                        "pips -- run from 17.13 pips at one month to 199.39 pips at one year, "
                        "growing roughly linearly with tenor because the rate differential compounds "
                        "over a longer period. Flipping the sign of the differential (r_eur above "
                        "r_usd) flips the forward to trade below spot instead, exactly as the "
                        "formula predicts.</p>"
                        "<p>A desk cares because forward points, not the rate differential itself, "
                        "are what is actually quoted and traded on an interbank screen, and because "
                        "reading the SIGN of the points is the fastest available check on which "
                        "currency currently yields more.</p>"
                    ),
                    "formula": "F = S\\,\\frac{1+r_d t}{1+r_f t}",
                    "code": code(W1C2_SRC),
                },
                {
                    "name": "The replication that forces CIP to hold",
                    "explain": (
                        "<p>Covered interest rate parity is not an empirical regularity; it is an "
                        "identity enforced by a specific, executable trade. If a market maker "
                        "quotes a forward that disagrees with the money-market-implied fair value, "
                        "sell EUR forward at the quoted rate and manufacture the EUR you must "
                        "deliver by a pure money-market route instead: borrow USD today, buy EUR "
                        "spot, and invest the EUR at r_eur so it grows to exactly the notional you "
                        "owe at maturity. Whatever the forward pays beyond what the money-market "
                        "route cost is riskless profit, with no market risk anywhere in the trade.</p>"
                        "<p>The snippet runs this replication at three quoted forwards: the fair "
                        "one, one 50 pips rich, and one 50 pips cheap. At the fair forward the "
                        "riskless P&L is zero to machine precision; at +50 pips it is exactly "
                        "+$50,000 on a EUR 10,000,000 notional, and the code confirms algebraically "
                        "that the profit is always notional times the mispricing, nothing more "
                        "exotic.</p>"
                        "<p>A desk cares because this is precisely the trade that keeps CIP holding "
                        "in a liquid, unconstrained market -- and precisely the trade whose cost "
                        "(bank balance sheet, funding, capital) is what makes the cross-currency "
                        "basis in the next week's material persistently non-zero instead.</p>"
                    ),
                    "code": code(W1C3_SRC),
                },
                {
                    "name": "Forward points as a market quote: swap points and their own spread",
                    "explain": (
                        "<p>Nobody on an interbank desk quotes an outright forward price directly; "
                        "the market quotes swap points -- the difference from spot, in pips -- and "
                        "a trader adds them to spot to get the outright. Swap points carry their "
                        "own bid/ask, and that spread is generally WIDER than spot's and widens "
                        "further with tenor, because it prices funding-cost and rate uncertainty "
                        "that compounds over a longer horizon on top of the (roughly fixed) cost of "
                        "trading spot itself.</p>"
                        "<p>The snippet takes a 1.6-pip spot spread and a term structure of quoted "
                        "swap points from one month to one year. The outright spread grows from 3.40 "
                        "pips at one month (2.12x spot's spread) to 16.60 pips at one year (10.37x "
                        "spot's), and a linear fit of the points-only spread against tenor in months "
                        "gives a slope of about 1.18 pips per month -- the points spread alone is "
                        "already 9.4 times spot's by one year, on top of spot's own spread.</p>"
                        "<p>A trader cares because pricing a client forward off spot's spread alone "
                        "badly underestimates the true cost at any tenor beyond the shortest dates, "
                        "and because reading a swap-point sheet correctly -- points, not an outright "
                        "-- is the basic literacy every other concept in this course assumes.</p>"
                    ),
                    "code": code(W1C4_SRC),
                },
            ],
            "widget": {
                "type": "slider-formula",
                "title": "Covered interest parity: the forward as a function of the rate gap",
                "params": {
                    "formula": "F = S\\,\\frac{1+r_d t}{1+r_f t}",
                    "inputs": [
                        {"name": "S", "label": "Spot S", "min": 0.90, "max": 1.30, "step": 0.001, "init": 1.08460},
                        {"name": "r_d", "label": "Domestic rate r_d", "min": 0.0, "max": 0.12, "step": 0.001, "init": 0.0525},
                        {"name": "r_f", "label": "Foreign rate r_f", "min": 0.0, "max": 0.12, "step": 0.001, "init": 0.0335},
                        {"name": "t", "label": "Tenor t (years)", "min": 0.05, "max": 2.0, "step": 0.05, "init": 0.5},
                    ],
                    "compute": [
                        {"name": "F", "expr": "S*(1+r_d*t)/(1+r_f*t)", "label": "Forward F", "fmt": "5"},
                        {"name": "pts", "expr": "(F-S)*10000", "label": "Forward points (pips)", "fmt": "1"},
                    ],
                },
            },
            "pitfalls": [
                "Treating a cross rate as independently quotable. It is implied by the two legs "
                "against the common currency, and a desk that forgets this can be triangulated "
                "against.",
                "Reading the forward as a forecast of the future spot rate. It is an arbitrage "
                "price built entirely from today's rates and today's spot; it says nothing about "
                "expectations.",
                "Using continuous compounding where the market convention is simple money-market "
                "compounding over act/360. The two agree only approximately at short tenors and "
                "diverge as tenor grows.",
                "Pricing a forward off spot's bid/ask spread alone. The swap-point spread dominates "
                "at any tenor beyond the shortest dates and must be added, not assumed away.",
            ],
            "check": [
                {"q": "EURUSD and GBPUSD are both quoted. Which statement about EURGBP is correct?",
                 "options": ["It is set independently by EURGBP order flow alone",
                             "It is implied by EURUSD and GBPUSD, and a directly quoted EURGBP must stay consistent with that implication",
                             "It cannot be computed until a EURGBP forward is also quoted",
                             "It equals the average of EURUSD and GBPUSD"],
                 "answer": 1,
                 "why": "A cross rate between two currencies each quoted against a common third currency is a ratio of the two legs; a market maker's own EURGBP quote must stay close to that ratio or a triangular arbitrage opens up. It is not independent order flow, does not require a forward, and is a ratio, not an average."},
                {"q": "If USD rates rise while EUR rates stay fixed, the EURUSD forward should:",
                 "options": ["Fall further below spot", "Rise further above spot",
                             "Stay exactly at spot", "Become undefined"],
                 "answer": 1,
                 "why": "Covered interest parity makes the forward a premium on the currency paying LESS interest; widening the USD-EUR rate gap in USD's favour widens the premium EUR trades at forward, pushing F further above S. It cannot stay at spot once rates differ, is not undefined, and moves the wrong way in the first option."},
                {"q": "The replication argument for CIP shows that if a quoted forward is 50 pips above the fair value, the riskless profit from exploiting it on a notional N is:",
                 "options": ["Unrelated to N", "Exactly N times 50 pips, from selling the forward and replicating in the money market",
                             "Exactly 50 pips regardless of N", "Impossible to compute without the volatility"],
                 "answer": 1,
                 "why": "The replication shows the riskless P&L is precisely notional times the mispricing, with no other term -- the code confirms it algebraically. It scales with N, does not need volatility (the trade is riskless), and 50 pips alone is a price, not a P&L."},
                {"q": "Why is a forward's bid/ask spread typically much wider than spot's at longer tenors?",
                 "options": ["Forwards are quoted less frequently, so market makers add a random margin",
                             "Swap points carry their own spread, pricing funding cost and rate uncertainty that grows with tenor",
                             "Regulation requires wider quotes on longer-dated contracts",
                             "Spot and forward spreads are always identical by construction"],
                 "answer": 1,
                 "why": "The swap-point spread reflects funding and rate uncertainty that compounds over a longer horizon, and it typically dominates the roughly fixed spot spread as tenor grows -- the snippet shows it reaching over nine times spot's spread at one year. It is not a regulatory artefact, not random padding, and the two spreads are not identical."},
            ],
        },
        {
            "n": 2,
            "title": "Cross-currency basis, swaps and non-deliverable forwards",
            "topics": ["the cross-currency basis", "cross-currency basis swaps",
                       "non-deliverable forwards", "multi-curve discounting"],
            "concepts": [
                {
                    "name": "The cross-currency basis: where covered interest parity actually trades",
                    "explain": (
                        "<p>If covered interest parity held exactly, the basis -- the spread you "
                        "would need to add to one currency's rate before the money-market formula "
                        "reproduces the market's quoted forward -- would be zero. It is not, and has "
                        "not been for over a decade: arranging the replication trade from week 1 "
                        "uses a bank's balance sheet, and balance sheet has a funding cost and a "
                        "regulatory capital charge that is not currency-symmetric. The basis is the "
                        "market's price for exactly that friction.</p>"
                        "<p>The snippet solves for the EUR rate that the market's quoted 1-year "
                        "EURUSD forward (1.10829) actually implies given the quoted USD rate, finding "
                        "3.00% against a 'clean' OIS rate of 3.35% -- a basis of exactly -35 basis "
                        "points by construction. Reading the sign: a negative EUR basis means "
                        "EUR-based banks pay extra to borrow USD via the FX swap market rather than "
                        "in their own currency, because USD funding is the scarcer, more valuable "
                        "resource from their side of the trade.</p>"
                        "<p>A treasury desk cares because at -100 basis points the extra annual cost "
                        "of a $500 million USD funding programme is $5,000,000, real money that a "
                        "textbook CIP model would simply miss.</p>"
                    ),
                    "code": code(W2C1_SRC),
                },
                {
                    "name": "Cross-currency basis swaps: the same basis, quoted as an annuity",
                    "explain": (
                        "<p>A cross-currency basis swap exchanges principal at the trade-date spot "
                        "rate, pays a floating reference rate on each leg for the trade's life, and "
                        "re-exchanges the same principal amounts at maturity. The single free "
                        "parameter that clears the market at inception is a running spread added to "
                        "one leg -- the swap market's way of quoting the basis from the previous "
                        "concept as a periodic annuity rather than one forward-point number.</p>"
                        "<p>The snippet prices a 5-year swap's USD-leg spread at the -35 basis-point "
                        "market basis: the spread leg is worth $1,652,639 in present value on a "
                        "$108.46 million notional. Valuing the same trade as if the basis were zero "
                        "misses that entire amount, and the error grows with tenor -- from $362,223 "
                        "at one year to $2,959,928 at ten years -- because it scales with the "
                        "annuity of discount factors, which itself grows with maturity.</p>"
                        "<p>A rates desk cares because a xccy swap struck at the correct market "
                        "spread and then marked on a 'basis is zero' curve looks like a trade with a "
                        "large, entirely fictitious P&L -- a bootstrapping error, not a market move.</p>"
                    ),
                    "code": code(W2C2_SRC),
                },
                {
                    "name": "Non-deliverable forwards: settling the difference, not the currency",
                    "explain": (
                        "<p>A non-deliverable forward (NDF) settles in cash, in a hard currency "
                        "(almost always USD), based on the difference between a contracted forward "
                        "rate and an official fixing published on the settlement date. It exists "
                        "because the other currency is not freely convertible offshore -- capital "
                        "controls, or simply no accessible onshore market for a foreign "
                        "counterparty -- so no principal in the restricted currency ever changes "
                        "hands, only the USD economic difference.</p>"
                        "<p>The snippet contracts an NDF at K=5.0250 on USD 20,000,000 notional and "
                        "settles it against six possible fixings: at the contracted rate settlement "
                        "is exactly zero, at a weaker local currency (fixing 6.0000) the long-local "
                        "side pays $3,250,000, and at a stronger one it receives up to $510,204. A "
                        "deliverable forward at the same rate would require physically delivering "
                        "over 100 million units of the local currency offshore -- precisely what the "
                        "NDF avoids.</p>"
                        "<p>A desk cares because onshore (deliverable) and offshore (NDF-implied) "
                        "forwards trade on different, only partially connected liquidity pools and "
                        "can show a persistent gap -- 150 pips in the snippet -- that is arbitrage "
                        "only for someone who can legally access both sides, which capital controls "
                        "specifically prevent.</p>"
                    ),
                    "code": code(W2C3_SRC),
                },
                {
                    "name": "Multi-curve discounting: bootstrapping a basis-adjusted curve",
                    "explain": (
                        "<p>Once the basis is non-zero, a single 'the' discount curve per currency "
                        "stops being correct: a EUR cashflow collateralised in USD must be discounted "
                        "on a EUR-under-USD-CSA curve that embeds the basis, not the plain EUR OIS "
                        "curve, exactly the way a rates desk bootstraps a swap curve one tenor at a "
                        "time from quoted instruments rather than assuming a single flat rate.</p>"
                        "<p>The snippet bootstraps both curves from a term structure of quoted basis "
                        "(-28bp at one year widening to -42bp at ten years) built on a 2.90% EUR OIS "
                        "rate. The two curves' discount factors diverge steadily -- by 26.5 basis "
                        "points of notional at one year, 313.7 at ten -- and discounting a EUR "
                        "200,000,000 receipt due in five years on the wrong (plain OIS) curve "
                        "misprices it by EUR 3,236,813 versus the correct CSA-adjusted number.</p>"
                        "<p>A quant desk cares because this is not a rounding error: a single-curve "
                        "assumption baked into a pricing library will silently misvalue every "
                        "cross-currency-collateralised trade on the book by an amount that grows with "
                        "both notional and tenor, and nothing in a single trade's P&L will flag it as "
                        "wrong on its own.</p>"
                    ),
                    "code": code(W2C4_SRC),
                },
            ],
            "widget": {
                "type": "curve",
                "title": "The EURUSD cross-currency basis term structure",
                "params": {
                    "series": [
                        {"name": "1y xccy basis (bp)", "x": [1, 2, 3, 5, 7, 10],
                         "y": [-28.0, -32.0, -35.0, -38.0, -40.0, -42.0]}
                    ],
                    "xlab": "tenor (years)",
                    "ylab": "basis (bp)",
                },
            },
            "pitfalls": [
                "Assuming covered interest parity holds exactly and pricing a cross-currency swap "
                "off a single 'clean' OIS curve on both legs. The basis is real, persistent, and "
                "material at any meaningful tenor.",
                "Confusing the SIGN convention of the basis. Which leg the spread is added to, and "
                "whether it is quoted against USD or the other currency, varies by desk and by data "
                "source -- always check which leg carries the spread before using a quote.",
                "Treating an NDF's fixing risk as identical to a deliverable forward's settlement "
                "risk. An NDF's entire economic content depends on a single published fixing rate, "
                "which is itself a source of dispute and manipulation risk in stressed markets.",
                "Using a currency's own OIS curve to discount a cashflow collateralised in a "
                "different currency. The correct curve is the CSA-adjusted one, and the two "
                "diverge more the longer the tenor.",
            ],
            "check": [
                {"q": "A persistently non-zero cross-currency basis is best explained by:",
                 "options": ["Measurement error in published FX rates",
                             "The cost and regulatory capital charge of the bank balance sheet needed to arrange the CIP replication trade",
                             "Central banks deliberately setting the basis as a policy tool",
                             "The basis is actually always zero once fees are excluded"],
                 "answer": 1,
                 "why": "The replication trade that enforces CIP requires bank balance sheet, and that balance sheet has a real, currency-asymmetric cost -- that cost is exactly what the basis prices. It is not a measurement artefact, not a policy lever, and does not vanish once fees are stripped out; it has persisted for years."},
                {"q": "In a cross-currency basis swap, the single free parameter that clears the market at inception is:",
                 "options": ["The initial notional exchange rate", "A running spread added to one leg",
                             "The maturity date", "The choice of which currency pays first"],
                 "answer": 1,
                 "why": "Given fixed notionals (set at spot) and a fixed maturity, the running spread on one leg is the only lever left to make the swap's present value zero at trade date -- that spread is the market's basis quote. The exchange rate and maturity are inputs, not solved-for outputs, and payment order does not create or absorb value."},
                {"q": "A non-deliverable forward settles based on:",
                 "options": ["Physical delivery of the restricted currency at maturity",
                             "The cash difference between the contracted rate and an official fixing, paid in a hard currency",
                             "The average of onshore and offshore forward quotes",
                             "Whichever party requests settlement first"],
                 "answer": 1,
                 "why": "An NDF's entire mechanism is a cash settlement of the economic difference against a published fixing, precisely because physical delivery of the restricted currency offshore is not possible. It does not average two quotes and is not settled by request order; the fixing is contractually specified in advance."},
                {"q": "Discounting a EUR cashflow that is collateralised in USD on the plain EUR OIS curve instead of the correct CSA-adjusted curve will:",
                 "options": ["Give exactly the right answer, since both curves are in EUR",
                             "Misprice the cashflow, by an amount that grows with the basis and the tenor",
                             "Only matter for cashflows under one year",
                             "Only matter if the basis happens to be positive"],
                 "answer": 1,
                 "why": "The two curves diverge because one embeds the cross-currency basis and the other does not; the gap compounds with tenor and scales with the size of the basis, as the bootstrap in the snippet shows growing from tens to hundreds of basis points of notional. It is not currency-symmetric by coincidence, is not a short-tenor-only effect, and the sign of the basis does not determine whether the error exists."},
            ],
        },
        {
            "n": 3,
            "title": "FX options: Garman-Kohlhagen, delta and the volatility smile",
            "topics": ["Garman-Kohlhagen", "put-call parity and FX symmetry",
                       "delta conventions", "risk reversals and butterflies", "the volatility smile"],
            "concepts": [
                {
                    "name": "Garman-Kohlhagen: Black-Scholes with two risk-free rates",
                    "explain": (
                        "<p>An FX option's underlying -- a unit of foreign currency -- itself earns "
                        "interest at the foreign rate, exactly the way a dividend-paying stock earns "
                        "a dividend yield. Garman-Kohlhagen is Black-Scholes with the dividend yield "
                        "replaced by the foreign rate: the option is priced off the forward, "
                        "F = S e^{(r_d - r_f)t}, and everything else -- d1, d2, the N(.) terms -- is "
                        "unchanged.</p>"
                        "<p>The snippet prices a 6-month EURUSD call and put at K=1.10 with 8.2% "
                        "vol, getting 0.02234 and 0.02726 USD per EUR respectively, and confirms "
                        "put-call parity (call minus put equals the discounted forward-minus-strike) "
                        "to machine precision. It also verifies the less obvious FX symmetry: this "
                        "EUR call, priced in USD, equals S times K times the mirror-image USD put on "
                        "EUR (struck at 1/K, priced in EUR, with the two rates swapped) -- the same "
                        "contract, viewed from either currency's side, agreeing to 1e-17.</p>"
                        "<p>A desk cares because that symmetry is a model-free consistency check that "
                        "catches a sign error in r_d/r_f or a mislabelled domestic/foreign rate "
                        "immediately, long before a P&L discrepancy would.</p>"
                    ),
                    "formula": "c = e^{-r_d t}\\left[F\\,N(d_1) - K\\,N(d_2)\\right],\\quad F = S e^{(r_d-r_f)t}",
                    "code": code(W3C1_SRC),
                },
                {
                    "name": "Delta conventions: why FX options are quoted by delta, not strike",
                    "explain": (
                        "<p>A trader asking for 'the 25-delta call' is naming a delta, and the "
                        "strike is whatever number currently produces it -- the reverse of how "
                        "equity options are usually discussed. Three deltas matter and are not "
                        "interchangeable: spot delta (e^{-r_f t} N(d1), the Black-Scholes delta), "
                        "forward delta (N(d1), delta with respect to the forward), and "
                        "premium-adjusted delta (used when the premium itself is paid in the "
                        "foreign currency).</p>"
                        "<p>The snippet solves for the strikes behind five standard delta quotes on "
                        "EURUSD: the 50-delta call sits at K=1.09545, the 25-delta call at "
                        "K=1.13966, and the 25-delta put at K=1.05554, each verified to reproduce "
                        "its target delta to four decimal places. It also shows the 50-delta strike "
                        "(1.09545) is close to, but not exactly, the at-the-money-forward strike "
                        "(F=1.09495) -- a 0.00050 gap driven by both the sigma-squared-t/2 term in "
                        "d1 and the e^{-r_f t} prefactor on delta itself.</p>"
                        "<p>A desk cares because a strike solved from the wrong delta convention "
                        "(spot versus forward versus premium-adjusted) is silently wrong by an "
                        "amount that grows with tenor and volatility, exactly where OTM risk lives.</p>"
                    ),
                    "code": code(W3C2_SRC),
                },
                {
                    "name": "The volatility smile: ATM, risk reversal and butterfly",
                    "explain": (
                        "<p>The FX vol market does not quote a strike-by-strike curve; it quotes "
                        "three numbers per tenor: the ATM vol, the 25-delta risk reversal "
                        "(RR = vol(25-delta call) minus vol(25-delta put), the skew), and the "
                        "25-delta butterfly (BF = the average of the two wing vols minus the ATM "
                        "vol, the convexity). Those three numbers invert to the two wing vols "
                        "directly: vol(25c) = ATM + RR/2 + BF, vol(25p) = ATM - RR/2 + BF.</p>"
                        "<p>The snippet takes ATM=8.2%, a -1.10% risk reversal (downside skew: OTM "
                        "puts trade richer than OTM calls) and a +0.35% butterfly, recovering "
                        "vol(25c)=8.00% and vol(25p)=9.10%. Inverting delta at each wing's own vol "
                        "locates the strikes (K=1.13851 for the 25-delta call, K=1.05151 for the "
                        "25-delta put), and a quadratic fit through the three (strike, vol) points "
                        "gives an interpolated vol of 8.021% at an untraded strike of 1.1150.</p>"
                        "<p>A desk cares because this three-number quoting convention IS the FX "
                        "smile in practice -- no vendor delivers a raw strike/vol grid the way "
                        "equity vol surfaces are sometimes shown, and every downstream pricing tool "
                        "starts from ATM/RR/BF and reconstructs the rest exactly as here.</p>"
                    ),
                    "code": code(W3C3_SRC),
                },
                {
                    "name": "Pricing off the smile versus a flat vol: the cost of getting it wrong",
                    "explain": (
                        "<p>Garman-Kohlhagen needs the option's OWN volatility, not a single ATM "
                        "number, and the two diverge most exactly where out-of-the-money risk lives "
                        "-- which is precisely where a flat-vol shortcut is most tempting to take, "
                        "because the ATM number is the one everyone already has.</p>"
                        "<p>The snippet prices the 25-delta put from the previous concept (K=1.05151) "
                        "at its true smile vol of 9.10% against the flat ATM vol of 8.20%: 0.01081 "
                        "USD per EUR versus 0.00868, a mispricing of 0.00213 per unit notional that "
                        "totals $53,239 on a EUR 25 million position. The option's vega at this "
                        "strike (0.00242 USD per EUR per vol point) predicts a 0.9-vol-point misread "
                        "should cost about 0.00218 -- close to, but not exactly, the full reprice, "
                        "because vega is a local slope and the true gap also reflects gamma/vanna "
                        "curvature over that size of a vol move.</p>"
                        "<p>A risk manager cares because a book priced consistently off ATM vol "
                        "alone is a book with a hidden, systematically mispriced OTM wing, and "
                        "$53,239 on a single 25-million-notional line is exactly the kind of error "
                        "that does not show up until someone asks why two desks marked the same "
                        "option differently.</p>"
                    ),
                    "code": code(W3C4_SRC),
                },
            ],
            "widget": {
                "type": "slider-formula",
                "title": "Garman-Kohlhagen: call premium and spot delta",
                "params": {
                    "formula": "c = e^{-r_d t}\\left[F\\,N(d_1) - K\\,N(d_2)\\right]",
                    "inputs": [
                        {"name": "S", "label": "Spot S", "min": 0.90, "max": 1.30, "step": 0.001, "init": 1.08460},
                        {"name": "K", "label": "Strike K", "min": 0.90, "max": 1.40, "step": 0.001, "init": 1.10000},
                        {"name": "sigma", "label": "Vol (sigma)", "min": 0.02, "max": 0.25, "step": 0.001, "init": 0.082},
                        {"name": "t", "label": "Tenor t (years)", "min": 0.05, "max": 2.0, "step": 0.05, "init": 0.5},
                        {"name": "r_d", "label": "Domestic rate r_d", "min": 0.0, "max": 0.12, "step": 0.001, "init": 0.0525},
                        {"name": "r_f", "label": "Foreign rate r_f", "min": 0.0, "max": 0.12, "step": 0.001, "init": 0.0335},
                    ],
                    "compute": [
                        {"name": "F", "expr": "S*exp((r_d-r_f)*t)", "label": "Forward F", "fmt": "5"},
                        {"name": "d1", "expr": "(ln(F/K)+0.5*sigma*sigma*t)/(sigma*sqrt(t))", "label": "d1", "fmt": "4"},
                        {"name": "d2", "expr": "d1-sigma*sqrt(t)", "label": "d2", "fmt": "4"},
                        {"name": "call", "expr": "exp(-r_d*t)*(F*ncdf(d1)-K*ncdf(d2))", "label": "Call premium", "fmt": "5"},
                        {"name": "delta", "expr": "exp(-r_f*t)*ncdf(d1)", "label": "Spot delta", "fmt": "4"},
                    ],
                },
            },
            "pitfalls": [
                "Using Black-Scholes with a dividend yield of zero for an FX option. The foreign "
                "rate plays exactly the dividend-yield role and omitting it misprices every FX "
                "option systematically.",
                "Confusing spot delta, forward delta and premium-adjusted delta. They give "
                "different strikes for the 'same' quoted delta, and mixing conventions between a "
                "quote source and a pricing library is a common, hard-to-spot bug.",
                "Assuming the 50-delta strike equals the at-the-money-forward strike. They are "
                "close but not identical, and the gap grows with volatility and tenor.",
                "Pricing any option away from at-the-money using the ATM vol instead of the smile's "
                "own vol at that strike. The mispricing is largest exactly where OTM risk lives.",
            ],
            "check": [
                {"q": "Garman-Kohlhagen differs from the plain Black-Scholes formula by:",
                 "options": ["Using a different normal distribution",
                             "Replacing the dividend yield with the foreign risk-free rate",
                             "Removing the discounting term entirely",
                             "Requiring a binomial tree instead of a closed form"],
                 "answer": 1,
                 "why": "The foreign currency earns interest exactly the way a dividend-paying stock earns a yield, so Garman-Kohlhagen is Black-Scholes with r_f substituted for q; everything else, including the closed form and the discounting, is unchanged. It uses the same normal CDF and is still closed-form."},
                {"q": "A trader asks for 'the 25-delta put'. This specifies:",
                 "options": ["A fixed strike that never changes", "A target delta, from which the strike is solved given current market data",
                             "A fixed premium in USD", "An option that expires in 25 days"],
                 "answer": 1,
                 "why": "FX options are quoted by delta; the strike is backed out from the market's current spot, rates and vol to hit that target delta, and it moves whenever those inputs move. It has nothing to do with a fixed premium, a fixed strike, or a 25-day expiry."},
                {"q": "A 25-delta risk reversal of -1.10% means:",
                 "options": ["The 25-delta call and put have identical implied vol",
                             "The 25-delta call's vol is 1.10 vol points BELOW the 25-delta put's vol",
                             "The ATM vol is 1.10% above the smile's wings",
                             "The option market expects a 1.10% move in spot"],
                 "answer": 1,
                 "why": "RR is defined as vol(25-delta call) minus vol(25-delta put); a negative value means the call's vol sits below the put's, i.e. OTM puts trade richer -- downside skew. It says nothing about vol equality, is not a statement about the ATM-to-wing gap (that is the butterfly), and is not a probability forecast."},
                {"q": "Pricing an out-of-the-money FX option using the ATM vol instead of its own smile vol:",
                 "options": ["Always overprices the option", "Always underprices the option",
                             "Mispricing depends on the smile's shape at that strike and can go either way",
                             "Has no effect since vega is the same everywhere"],
                 "answer": 2,
                 "why": "The direction of the error depends on whether the true smile vol at that strike is above or below the ATM vol -- in the snippet the 25-delta put's smile vol is above ATM, so using flat ATM vol underprices it, but the sign flips if the smile's wing sits below ATM. Vega is not constant across strikes, so the last option is also wrong."},
            ],
        },
        {
            "n": 4,
            "title": "Exotic options and hybrid products",
            "topics": ["barrier options", "digital options and static replication",
                       "quanto adjustments", "uncovered interest parity and the forward premium puzzle"],
            "concepts": [
                {
                    "name": "Barrier options: pricing the whole path, not just the endpoint",
                    "explain": (
                        "<p>A down-and-out call is an ordinary call that is knocked out -- worth "
                        "zero for the rest of its life -- the first time spot trades at or below a "
                        "barrier. Because the barrier can be breached at any point before expiry, "
                        "pricing it needs the WHOLE simulated path, not just the terminal value: "
                        "exactly the running-maximum problem that the reflection principle solves in "
                        "closed form for a simple random walk, now under GBM by Monte Carlo instead.</p>"
                        "<p>The snippet simulates 200,000 six-month paths at daily resolution and "
                        "finds the down-and-out call (B=1.04, well below both spot and strike) "
                        "worth 0.02128 against a vanilla value of 0.02232 -- 95.3% of the vanilla "
                        "premium survives, even though 39.3% of paths breach the barrier at some "
                        "point, because most breaching paths were headed to a worthless expiry "
                        "anyway. The model-free in-out parity check (down-and-out plus down-and-in "
                        "equals vanilla) holds to 3.5e-18, confirming the simulation is unbiased.</p>"
                        "<p>A structuring desk cares because in-out parity is the first thing any "
                        "barrier pricer should be checked against, and because the size of the "
                        "knock-out discount depends far more on where the barrier sits relative to "
                        "the STRIKE than on the barrier breach probability alone.</p>"
                    ),
                    "code": code(W4C1_SRC),
                },
                {
                    "name": "Digital options and static replication with a call spread",
                    "explain": (
                        "<p>A digital (binary) call pays a fixed amount if spot finishes above a "
                        "strike, zero otherwise -- a discontinuous payoff no static position in "
                        "vanilla options matches exactly. A tight call spread -- long a call at "
                        "K minus half a small width, short one at K plus half that width, scaled by "
                        "one over the width -- approximates it arbitrarily well, and this is not "
                        "just a pricing trick: it is how a desk actually HEDGES a sold digital, "
                        "because the digital's true delta blows up near expiry at the strike.</p>"
                        "<p>The snippet prices a $1,000,000 digital exactly in closed form "
                        "(disc times N(d2) times the payout, giving $445,039.22) and then "
                        "replicates it with call spreads of shrinking width: a 500-pip spread is off "
                        "by $1,595.80, a 20-pip spread by $2.63, and a 1-pip spread by one cent, "
                        "converging cleanly to the exact value as the width shrinks toward zero.</p>"
                        "<p>A desk cares because a real call spread has a minimum tradeable width "
                        "set by strike granularity and the market's own bid/ask, which is exactly "
                        "why traded digitals carry a persistent premium over their theoretical "
                        "Garman-Kohlhagen fair value -- the replication has a floor cost.</p>"
                    ),
                    "code": code(W4C2_SRC),
                },
                {
                    "name": "Quanto adjustment: removing FX exposure changes the drift that survives",
                    "explain": (
                        "<p>A quanto pays a foreign-asset payoff but settles in domestic currency at "
                        "a fixed exchange rate, stripping out the FX exposure that would normally "
                        "accompany a cross-border payoff. That contract design has a quantitative "
                        "consequence: the asset's effective drift under the domestic risk-neutral "
                        "measure shifts by a correlation term, -rho * sigma_asset * sigma_fx, even "
                        "though no FX rate ever appears explicitly in the payoff.</p>"
                        "<p>The snippet prices a quanto call on a foreign-currency asset with "
                        "sigma_asset=24%, sigma_fx=8.2% and correlation -0.35 between them. Ignoring "
                        "the quanto adjustment entirely gives 1338.71; applying the correct "
                        "adjustment (+0.69% annualised drift, since a negative asset-FX correlation "
                        "here raises the asset's effective drift once the FX link is removed) gives "
                        "1366.61 -- a 2.0% mispricing from skipping one term that never touches the "
                        "payoff formula itself.</p>"
                        "<p>A desk cares because the adjustment's sign depends on the sign of the "
                        "correlation and the FX quoting convention together, and getting either "
                        "backwards silently flips whether the correction should raise or lower the "
                        "price -- a mistake the payoff formula alone gives no hint of.</p>"
                    ),
                    "code": code(W4C3_SRC),
                },
                {
                    "name": "Uncovered interest parity and the forward premium puzzle",
                    "explain": (
                        "<p>Uncovered interest parity (UIP) says the expected change in spot should "
                        "equal the interest rate differential, tested by the classic Fama "
                        "regression of the realised FX return on the forward premium, with UIP "
                        "predicting a slope of exactly one. The well-documented empirical result is "
                        "a slope reliably NEGATIVE instead: high-yield currencies tend to appreciate "
                        "further, not depreciate as UIP requires, so the carry trade earns a "
                        "positive return on average -- funded by a small chance of a large reversal.</p>"
                        "<p>The snippet simulates 40 years of monthly data engineered to reproduce "
                        "this 'forward premium puzzle': the fitted slope comes out at -0.89 (t-stat "
                        "of -10.06 against the null of 1), and the resulting carry payoff has a "
                        "positive average (+0.0189 per period), a Sharpe-like ratio of 0.216, and a "
                        "strongly negative skew of -3.44, with a worst single month of -0.68 driven "
                        "by 10 simulated crash events.</p>"
                        "<p>A researcher cares because this is the standing empirical anomaly that "
                        "motivates the carry trade as a systematic strategy in week 5, and because "
                        "the negative skew -- not visible in the average return alone -- is exactly "
                        "the risk the strategy is being paid to bear.</p>"
                    ),
                    "formula": "\\Delta \\ln S_{t\\to t+1} = \\alpha + \\beta\\,(f_t - s_t) + \\varepsilon_t",
                    "code": code(W4C4_SRC),
                },
            ],
            "widget": {
                "type": "payoff",
                "title": "Approximating a digital payoff with a tight call spread",
                "params": {
                    "legs": [
                        {"kind": "call", "strike": 1.0990, "qty": 500, "premium": 0.022793},
                        {"kind": "call", "strike": 1.1010, "qty": -500, "premium": 0.021903},
                    ],
                    "range": [1.02, 1.18],
                },
            },
            "pitfalls": [
                "Pricing a barrier option from terminal-value Monte Carlo alone, without checking "
                "the barrier along the whole path. This overstates the option's value because it "
                "misses breaches that would have knocked it out before expiry.",
                "Forgetting in-out parity as a sanity check. Down-and-out plus down-and-in must "
                "equal the vanilla value for the same strike and barrier, always, regardless of the "
                "model.",
                "Treating a quanto adjustment's sign as automatic. It depends on both the sign of "
                "the correlation and the FX quoting convention together, and getting either wrong "
                "flips the correction the wrong way.",
                "Reading a negative forward-premium-puzzle slope as evidence the carry trade is "
                "riskless. The positive average return is compensation for a rare, large loss, not "
                "a free lunch.",
            ],
            "check": [
                {"q": "In-out parity for a down-and-out and down-and-in call with the same strike and barrier says:",
                 "options": ["Their values are always equal to each other",
                             "Their sum always equals the vanilla call's value",
                             "Their sum always equals zero", "There is no model-free relationship between them"],
                 "answer": 1,
                 "why": "Every path either breaches the barrier (activating the knock-in) or does not (leaving the knock-out alive), so exactly one of the two pays the vanilla payoff on any given path -- their sum must equal the vanilla value, model-free. They are not generally equal to each other, do not sum to zero, and the relationship holds regardless of the pricing model used."},
                {"q": "A digital option's payoff is best statically replicated with:",
                 "options": ["A single long call at the strike", "A tight call spread straddling the strike, scaled by the inverse of its width",
                             "A long straddle", "It cannot be replicated with vanilla options"],
                 "answer": 1,
                 "why": "A long call minus a call struck slightly higher, divided by the small strike gap, converges to the digital's step payoff as the gap shrinks -- the snippet shows this converging from a $1,595.80 error at 500 pips to a cent at 1 pip. A single call or a straddle has the wrong payoff shape entirely, and it very much can be replicated, which is exactly how digitals are hedged in practice."},
                {"q": "A quanto contract removes FX exposure from a foreign-asset payoff by fixing the settlement exchange rate. This means:",
                 "options": ["The asset's price process is unaffected by the currency at all",
                             "The asset's effective drift under the domestic measure shifts by a term involving the asset-FX correlation",
                             "The payoff formula must explicitly include the FX rate",
                             "Quanto adjustments only matter when correlation is exactly zero"],
                 "answer": 1,
                 "why": "Stripping out the FX exposure changes which measure the asset's drift is expressed under, and that change shows up as a correlation-dependent drift shift, even though the FX rate never appears in the payoff itself. If correlation were exactly zero the adjustment would vanish, which is the opposite of when it matters."},
                {"q": "The 'forward premium puzzle' refers to the empirical finding that:",
                 "options": ["Forward rates perfectly predict future spot rates",
                             "The Fama regression slope of realised FX returns on the forward premium is reliably negative, not the value of 1 that UIP predicts",
                             "Forward points are always positive", "Carry trades never lose money"],
                 "answer": 1,
                 "why": "UIP predicts a slope of one; the robust empirical finding across currencies and periods is a negative slope instead, meaning high-yield currencies tend to appreciate rather than depreciate as UIP would require. Forwards do not perfectly predict spot, forward points can be negative, and carry trades do lose money in crash periods, which is the whole point of the puzzle's risk story."},
            ],
        },
        {
            "n": 5,
            "title": "Risk management, carry and international monetary systems",
            "topics": ["carry trade construction and crash risk", "hedging strategies",
                       "multi-currency portfolio VaR", "exchange rate regimes and the trilemma"],
            "concepts": [
                {
                    "name": "The carry trade: a Sharpe ratio blind to the risk it is short",
                    "explain": (
                        "<p>The carry trade -- borrow the low-yield currency, hold the high-yield "
                        "one -- earns the rate differential most months and loses a multiple of it "
                        "in the rare month the funding currency snaps back: a de-peg, a risk-off "
                        "unwind, a surprise policy move. The Sharpe ratio, built from only the first "
                        "two moments, cannot see the difference between this risk profile and an "
                        "ordinary symmetric one with the same mean and standard deviation.</p>"
                        "<p>The snippet simulates 50 years of monthly carry returns with a 5.5% "
                        "annual carry, ordinary FX noise, and a roughly-once-per-five-years crash "
                        "averaging a 15% loss. The result: an annualised Sharpe of 0.514 -- "
                        "respectable by ordinary standards -- sitting on top of a skewness of -2.50 "
                        "and excess kurtosis of +19.23. A Gaussian series matched to the exact same "
                        "mean and standard deviation has a nearly identical Sharpe of... but a "
                        "skewness of essentially zero: indistinguishable on the one risk-adjusted "
                        "number that gets quoted, dramatically different in the tail that matters.</p>"
                        "<p>A risk manager cares because any strategy allocation built on Sharpe "
                        "ratios alone will systematically overweight strategies exactly like this "
                        "one, mistaking a well-disguised crash risk for genuine risk-adjusted "
                        "outperformance.</p>"
                    ),
                    "code": code(W5C1_SRC),
                },
                {
                    "name": "Hedging a foreign receivable: forward, collar or unhedged",
                    "explain": (
                        "<p>A firm expecting a foreign-currency receivable in six months has three "
                        "basic choices: leave it unhedged (keep all the upside and all the "
                        "downside), sell the currency forward (lock in a single rate, eliminate "
                        "variance entirely but also all upside), or buy a zero-cost collar (sell a "
                        "call to fund a put, bounding the outcome between two strikes while keeping "
                        "some participation in between).</p>"
                        "<p>The snippet compares USD proceeds on a EUR 10,000,000 receivable under "
                        "all three, simulated across 300,000 spot outcomes. Unhedged proceeds have a "
                        "standard deviation of about 635,000 with a 5th-to-95th percentile range "
                        "spanning roughly 9.93 to 12.02 million; the forward eliminates the standard "
                        "deviation to exactly zero at the cost of all upside; the zero-cost collar "
                        "(put floor at 1.06, call cap solved at 1.13241 to match the put's premium) "
                        "cuts the standard deviation to about 304,000, bounding outcomes between "
                        "roughly 10.60 and 11.32 million.</p>"
                        "<p>A treasurer cares because the right choice depends on the firm's actual "
                        "risk appetite and view, not on which instrument is 'best' in the abstract "
                        "-- the forward and the collar are both legitimate answers to different "
                        "questions.</p>"
                    ),
                    "code": code(W5C2_SRC),
                },
                {
                    "name": "Parametric VaR for a multi-currency book",
                    "explain": (
                        "<p>Parametric (variance-covariance) VaR for a multi-currency book is "
                        "ordinary Markowitz portfolio variance with FX exposures standing in for "
                        "asset weights: each pair's dollar P&L variance is exposure-squared times "
                        "volatility-squared, and cross terms bring in the correlation matrix between "
                        "pairs exactly as they would between assets.</p>"
                        "<p>The snippet builds a four-pair book (long EUR, short GBP, long JPY, long "
                        "MXN) and finds the sum of each position's standalone 10-day 99% VaR is "
                        "$2,509,365, while the correctly correlated portfolio VaR is only "
                        "$1,107,361 -- a 55.9% diversification benefit driven largely by the 0.55 "
                        "correlation between EUR and GBP sitting on top of an already-offsetting "
                        "long-EUR/short-GBP position. Wrongly assuming that one correlation is zero "
                        "raises the computed VaR to $1,384,311, understating the true diversification "
                        "credit by $276,950.</p>"
                        "<p>A risk manager cares because a book that looks diversified on paper -- "
                        "four different currency pairs -- can have most of its real diversification "
                        "coming from one specific correlated, partially-hedged pair of positions, "
                        "and losing that one correlation estimate materially understates the credit "
                        "the book is actually earning.</p>"
                    ),
                    "code": code(W5C3_SRC),
                },
                {
                    "name": "Defending a peg: reserves, the trilemma, and the limits of a rate hike",
                    "explain": (
                        "<p>Defending a currency peg means the central bank sells FX reserves to buy "
                        "its own currency, one-for-one, against every unit of net capital outflow. "
                        "The impossible trinity says a country cannot simultaneously have a fixed "
                        "exchange rate, free capital flows and an independent monetary policy: "
                        "raising domestic rates to slow the outflow is the only lever available, and "
                        "using it means giving up the 'independent monetary policy' corner of the "
                        "triangle.</p>"
                        "<p>The snippet simulates $80 billion of reserves against a $3 billion "
                        "monthly outflow. With no rate defence, reserves are exhausted at month 27; "
                        "a 100 basis-point hike halves the outflow and lets reserves survive the "
                        "full 36-month window with 26 billion left; by 180 basis points the outflow "
                        "falls to a structural floor of 0.20 billion per month, and reserves finish "
                        "the window at 69.2 to 72.8 billion regardless of hiking further to 400 "
                        "basis points -- the floor represents outflow that no plausible rate move "
                        "removes.</p>"
                        "<p>A macro desk cares because the diminishing returns to hiking are exactly "
                        "as important as the initial defence: at some point the domestic economic "
                        "cost of the next 100 basis points buys almost no additional reserve life, "
                        "and that is the moment a peg's credibility is actually tested.</p>"
                    ),
                    "code": code(W5C4_SRC),
                },
            ],
            "widget": {
                "type": "histogram",
                "title": "Carry trade returns: frequent small gains, rare large losses",
                "params": {
                    "sampler": "mixture",
                    "params": {"p": 0.90, "mu1": 0.35, "s1": 1.0, "mu2": -2.6, "s2": 1.6},
                    "bins": 40,
                    "overlay": False,
                    "n": 4000,
                    "seed": 37310,
                },
            },
            "pitfalls": [
                "Ranking strategies by Sharpe ratio alone. It is blind to skewness and kurtosis, "
                "exactly the moments a crash-risk strategy like the carry trade is built on.",
                "Treating a forward hedge as strictly 'better' than staying unhedged. It removes "
                "variance but also removes all upside, and the right choice depends on risk "
                "appetite, not on a universal ranking of hedges.",
                "Computing portfolio VaR from standalone VaRs summed together. That ignores "
                "correlation entirely and can badly overstate risk on a book with genuine offsetting "
                "positions.",
                "Assuming a rate hike can defend a peg indefinitely. Reserve outflow typically has a "
                "structural floor that no further hike meaningfully reduces, at which point the peg "
                "survives on reserves alone, not on policy.",
            ],
            "check": [
                {"q": "Two return series have identical mean and standard deviation, hence identical Sharpe ratios. This means:",
                 "options": ["They necessarily have the same risk profile",
                             "They can still differ dramatically in skewness and tail risk",
                             "One of the two Sharpe ratios must be miscalculated",
                             "Their maximum drawdowns must also be equal"],
                 "answer": 1,
                 "why": "The Sharpe ratio uses only the first two moments; the snippet's carry series and its mean/std-matched Gaussian counterpart have nearly the same Sharpe but skewness of -2.50 versus essentially zero. Neither Sharpe is 'wrong', and matching mean and std says nothing about matching drawdowns, which depend on the path and the tail."},
                {"q": "A zero-cost collar on a foreign receivable, compared with an outright forward hedge:",
                 "options": ["Eliminates all variance, exactly like the forward",
                             "Keeps some variance between the two strikes while bounding the extremes, unlike the forward's zero variance",
                             "Always costs more than the forward", "Provides no protection at all"],
                 "answer": 1,
                 "why": "The forward fixes the outcome completely (zero variance, zero upside); a collar bounds the outcome between a floor and a cap while leaving participation in between, so it keeps some variance by design. A zero-cost collar's premium is arranged to be roughly zero, not systematically more expensive, and it clearly provides downside protection below the put strike."},
                {"q": "In the multi-currency VaR example, most of the diversification credit came from:",
                 "options": ["The JPY and MXN positions, which are uncorrelated with everything",
                             "The 0.55 correlation between EUR and GBP sitting on top of an offsetting long/short position",
                             "Assuming all correlations are exactly zero", "The overall size of the book alone"],
                 "answer": 1,
                 "why": "Zeroing out just the EUR/GBP correlation raised the computed VaR by over a quarter million dollars, showing that correlation was doing most of the diversification work given the offsetting long-EUR/short-GBP position. Assuming zero correlation is precisely the wrong assumption illustrated, and size alone does not create diversification without correlation structure."},
                {"q": "According to the impossible trinity, a country with a fixed exchange rate and free capital flows:",
                 "options": ["Can also freely set its own domestic interest rate independent of the peg",
                             "Must give up an independent domestic monetary policy to sustain the peg",
                             "Faces no constraint at all if its reserves are large enough",
                             "Can only be resolved by abandoning free capital flows immediately"],
                 "answer": 1,
                 "why": "The trilemma says at most two of fixed rate, free capital flows and independent monetary policy can hold at once; keeping the first two means domestic rate policy must serve the peg, not domestic objectives. Reserves buy time, as the simulation shows, but do not remove the constraint, and abandoning capital flows is one possible resolution, not the only one implied by the trilemma itself."},
            ],
        },
    ],
    "interview": [
        {"q": "What is covered interest rate parity, and why must it hold in a liquid, unconstrained market?",
         "level": "screen",
         "answer": ("CIP says the forward rate is fixed by the two currencies' money-market rates, "
                    "F = S(1+r_d t)/(1+r_f t), because a specific replication trade -- borrow one "
                    "currency, convert spot, invest the other, compare with the forward -- is "
                    "riskless. If the quoted forward disagreed with that formula, the replication "
                    "would lock in a riskless profit with no market risk, so unconstrained arbitrage "
                    "capital would trade the gap away immediately. It is an identity enforced by an "
                    "executable trade, not an empirical regularity, which is exactly why it held so "
                    "tightly before 2008 and why the frictions that broke it afterward matter.")},
        {"q": "Explain the difference between a deliverable forward and a non-deliverable forward.",
         "level": "screen",
         "answer": ("A deliverable forward settles by physically exchanging the two currencies' full "
                    "notional at the contracted rate on the value date. An NDF instead settles only "
                    "the cash difference between the contracted rate and an official fixing, in a "
                    "hard currency, with no principal in the restricted currency ever changing "
                    "hands. NDFs exist precisely because the restricted currency is not freely "
                    "convertible offshore -- capital controls or an inaccessible onshore market -- so "
                    "an offshore counterparty can still take the economic exposure without needing "
                    "to hold or deliver the underlying currency at all.")},
        {"q": "What is the FX cross-currency basis, and why isn't it zero?",
         "level": "screen",
         "answer": ("The basis is the spread you'd need to add to one currency's money-market rate "
                    "before covered interest parity reproduces the market's actual quoted forward. "
                    "If CIP held exactly it would be zero; it isn't, because the replication trade "
                    "that enforces CIP uses bank balance sheet, and that balance sheet carries a "
                    "funding cost and a regulatory capital charge that differ by currency and by "
                    "which side of the trade a bank sits on. The basis has been persistently "
                    "non-zero since the 2008 financial crisis, when banks' balance sheet became "
                    "scarce and expensive in a way it hadn't been before.")},
        {"q": "Derive the Garman-Kohlhagen formula from Black-Scholes and explain the key substitution.",
         "level": "onsite",
         "answer": ("Black-Scholes prices an option on an asset that pays a continuous dividend "
                    "yield q by discounting the asset's forward value at that yield inside the "
                    "formula. A unit of foreign currency earns interest at the foreign risk-free "
                    "rate exactly the way a dividend-paying stock earns its yield, so replacing q "
                    "with r_f (and keeping r_d as the discount rate) gives Garman-Kohlhagen "
                    "directly: c = e^{-r_d t}[F N(d1) - K N(d2)] with F = S e^{(r_d-r_f)t}. Nothing "
                    "else in the derivation changes; the option is still priced off the forward, and "
                    "put-call parity and the Greeks carry over with the same substitution.")},
        {"q": "Why are FX options quoted by delta rather than by strike?",
         "level": "onsite",
         "answer": ("Quoting by delta lets a strike-independent, comparable number travel across "
                    "spot moves, rate changes and time decay -- a '25-delta call' means roughly the "
                    "same moneyness today as it did yesterday even though spot moved, whereas a "
                    "fixed strike's moneyness (and hence its risk character) drifts with spot. It "
                    "also matches how the market actually manages risk: a market maker thinks in "
                    "delta buckets for hedging, so quoting in the same units removes a translation "
                    "step. The strike itself is then solved for, given the day's spot, rates and "
                    "vol, by inverting the delta formula.")},
        {"q": "What do a 25-delta risk reversal and a 25-delta butterfly each measure, and how do you recover the wing vols from them?",
         "level": "onsite",
         "answer": ("The risk reversal is vol(25-delta call) minus vol(25-delta put) -- the smile's "
                    "skew, positive when calls trade richer, negative when puts do. The butterfly is "
                    "the average of the two wing vols minus the ATM vol -- the smile's convexity, "
                    "how much the wings sit above a straight line through the ATM point. Given ATM, "
                    "RR and BF you invert directly: vol(25c) = ATM + RR/2 + BF and "
                    "vol(25p) = ATM - RR/2 + BF, then solve for each wing's strike by inverting the "
                    "delta formula at that wing's own vol.")},
        {"q": "What is a quanto adjustment and when do you need one?",
         "level": "onsite",
         "answer": ("A quanto adjustment corrects the drift of a foreign asset when its payoff is "
                    "settled in domestic currency at a fixed FX rate, removing the FX exposure the "
                    "payoff would otherwise carry. Stripping out that exposure shifts the asset's "
                    "effective drift under the domestic risk-neutral measure by "
                    "-rho * sigma_asset * sigma_fx, a term that never appears explicitly in the "
                    "payoff formula but changes the correct price whenever the asset-FX correlation "
                    "is non-zero. You need it any time a payoff is denominated in a currency other "
                    "than the one its underlying naturally trades in, but is NOT converted at the "
                    "prevailing spot rate.")},
        {"q": "How is a cross-currency swap valued once you accept the basis is real?",
         "level": "onsite",
         "answer": ("Each leg is discounted on its OWN currency's curve, but a leg collateralised in "
                    "the other currency needs a basis-adjusted (CSA) curve rather than that "
                    "currency's plain OIS curve, because the basis is exactly the spread that curve "
                    "must embed to reprice observed basis-swap quotes to par. Concretely, you "
                    "bootstrap the adjusted curve tenor by tenor from quoted basis spreads, then "
                    "discount each leg's cashflows on its correct curve and convert to a common "
                    "currency at spot for comparison. Discounting both legs on unadjusted OIS curves "
                    "misprices the trade by an amount that grows with tenor and with the basis.")},
        {"q": "Explain the forward premium puzzle and what it implies about the carry trade.",
         "level": "senior",
         "answer": ("Uncovered interest parity predicts that the Fama regression of realised FX "
                    "returns on the forward premium should have a slope of one -- high-yield "
                    "currencies should depreciate by exactly their extra yield, on average, leaving "
                    "the carry trade with zero expected return. Decades of data instead find the "
                    "slope reliably negative: high-yield currencies tend to appreciate further, not "
                    "depreciate, so the carry trade earns a positive average return. The standard "
                    "explanation is a risk premium: the strategy is short a rare, large devaluation "
                    "risk, so its positive average return and strongly negative skew are two sides "
                    "of the same compensation, not a free lunch UIP simply missed.")},
        {"q": "How would you think about hedging the vega and vanna risk of an FX options book in practice?",
         "level": "senior",
         "answer": ("Vega risk is hedged by trading other options -- typically ATM straddles for "
                    "pure vega, risk reversals for the skew (vanna) exposure and butterflies for the "
                    "convexity (volga) exposure -- because a single spot/forward hedge only manages "
                    "delta, not the book's sensitivity to the vol surface itself. In practice a desk "
                    "buckets its book's Greeks by tenor and by delta point on the smile, then trades "
                    "the standard market instruments (ATM vol, RR, BF at each tenor) that most "
                    "directly offset the resulting exposures, rather than re-hedging every individual "
                    "option's vega separately.")},
        {"q": "Discuss the impossible trinity and how it constrains a central bank defending a currency peg.",
         "level": "senior",
         "answer": ("The trilemma says a fixed exchange rate, free capital flows and an independent "
                    "domestic monetary policy cannot all hold simultaneously; a country defending a "
                    "peg under free capital flows must set its policy rate to serve the peg, not "
                    "domestic objectives like growth or employment. Practically, this means "
                    "defending against a sustained outflow is a race between the outflow rate and "
                    "the reserve stock, with rate hikes as the main lever -- and that lever typically "
                    "has diminishing returns, since some outflow is structural and does not respond "
                    "to rates. Eventually the domestic cost of further hikes exceeds what the peg is "
                    "worth, and abandoning one corner of the trilemma becomes the rational choice.")},
        {"q": "What is the difference between spot delta and forward delta for an FX option, and when does it matter which one you use?",
         "level": "screen",
         "answer": ("Spot delta is e^{-r_f t} N(d1), the sensitivity of the option's price to a move "
                    "in spot holding the forward's relationship to spot fixed implicitly; forward "
                    "delta is N(d1) alone, the sensitivity with respect to the forward itself. The "
                    "two differ by the foreign discount factor, which is close to one for short "
                    "tenors and low foreign rates but diverges meaningfully as tenor or the foreign "
                    "rate grows. It matters whenever a quoted delta is used to solve for a strike or "
                    "to size a hedge: using the wrong convention gives a strike or a hedge ratio that "
                    "is systematically off, worse the longer the tenor.")},
    ],
    "reappears_in": [
        {"code": "FINM 37400", "how": "The multi-curve, basis-adjusted discounting built here for cross-currency swaps is the same machinery Fixed Income uses whenever a swap is collateralised in a currency other than the one it is denominated in."},
        {"code": "FINM 37500", "how": "The Garman-Kohlhagen family of models, delta-based quoting, and smile construction from risk reversals and butterflies reappear in fixed income derivatives when pricing caps, floors and swaptions off a quoted vol surface."},
        {"code": "FINM 33150", "how": "The carry trade and its documented crash risk are a standing case study in cross-asset systematic trading strategies, including how position sizing must respond to negative skew that a Sharpe ratio alone would miss."},
        {"code": "FINM 36700", "how": "The parametric multi-currency VaR built here is the FX instance of the course's general framework for portfolio variance and risk budgeting across correlated exposures."},
        {"code": "FINM 35600", "how": "A perpetual future's funding-rate convergence mechanism is a direct crypto-market analogue of FX forward points and the cross-currency basis: both are the price of pulling a derivative's quote back toward its underlying."},
    ],
    "glossary": [
        {"term": "Pip", "def": "The smallest standard quoting increment for a currency pair -- the fourth decimal place for most USD pairs, the second for JPY pairs."},
        {"term": "Outright forward", "def": "The all-in forward exchange rate for a given settlement date, equal to spot plus (or minus) the forward points."},
        {"term": "Swap points", "def": "The market's actual quoted object for a forward: the difference between the forward and spot, in pips, added to spot to get the outright."},
        {"term": "Covered interest rate parity (CIP)", "def": "The no-arbitrage identity pinning the forward rate to the two currencies' money-market rates and spot."},
        {"term": "Cross-currency basis", "def": "The persistent spread between the market's quoted forward-implied rate and the textbook CIP rate, priced by the cost of the bank balance sheet needed to arbitrage it away."},
        {"term": "Cross-currency (xccy) swap", "def": "A swap exchanging floating-rate cashflows in two currencies on notionals fixed at trade-date spot, with a running spread on one leg quoting the basis."},
        {"term": "Non-deliverable forward (NDF)", "def": "A forward that cash-settles the difference between a contracted rate and an official fixing, in a hard currency, used when the other currency is not freely deliverable offshore."},
        {"term": "Garman-Kohlhagen model", "def": "The Black-Scholes formula adapted to FX options by replacing the dividend yield with the foreign risk-free rate."},
        {"term": "Spot delta", "def": "An FX option's sensitivity to the spot rate, equal to the foreign discount factor times N(d1) for a call."},
        {"term": "Risk reversal (RR)", "def": "The implied-vol skew, quoted as the difference between a call and a put's vol at the same (usually 25-) delta."},
        {"term": "Butterfly (BF)", "def": "The implied-vol convexity, quoted as the average of two wing vols minus the at-the-money vol."},
        {"term": "Volatility smile", "def": "The pattern of implied volatility varying by strike (or delta) at a fixed maturity, reconstructed in FX from ATM, RR and BF."},
        {"term": "Quanto adjustment", "def": "A drift correction, proportional to the asset-FX correlation, needed when a foreign-asset payoff is settled in domestic currency at a fixed exchange rate."},
        {"term": "Barrier option", "def": "An option whose existence (knock-in) or extinction (knock-out) is triggered the first time the underlying trades through a specified level."},
        {"term": "Digital (binary) option", "def": "An option paying a fixed amount if a condition on the underlying holds at expiry, replicable by a tight call or put spread."},
        {"term": "Carry trade", "def": "Borrowing a low-yield currency to fund holding a high-yield one, earning the rate differential except in a rare adverse FX move."},
        {"term": "Uncovered interest parity (UIP)", "def": "The (empirically rejected) hypothesis that the expected change in spot equals the interest rate differential."},
        {"term": "Forward premium puzzle", "def": "The robust empirical finding that the Fama regression slope of FX returns on the forward premium is negative rather than the value of one UIP predicts."},
        {"term": "Impossible trinity (trilemma)", "def": "The proposition that a fixed exchange rate, free capital flows and an independent monetary policy cannot all hold simultaneously."},
    ],
}


def main():
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(
            "/* courses/finm-37301.js -- Foreign Exchange: Markets, Products & Pricing.\n"
            " *\n"
            " * Built from the public course page only (data/raw/pages/finm-37301.txt). The\n"
            " * syllabus PDF is a Box shared link restricted to a university login, so no\n"
            " * syllabus text was available: the week-by-week arc, explanations, code,\n"
            " * questions and glossary below are this dashboard's own reconstruction of a\n"
            " * standard treatment of the topics the public page lists, in the order it lists\n"
            " * them. Nothing here is the instructor's material and nothing here is endorsed\n"
            " * by the instructor.\n"
            " *\n"
            " * Every `output` field is the real stdout of the snippet above it, captured by\n"
            " * tools/run_snippets.py. Do not hand-edit an output. Generated by\n"
            " * tools/gen_finm_37301.py -- re-run that script, not this file, to make edits.\n"
            " */\n"
        )
        fh.write('window.COURSES = window.COURSES || {};\n')
        fh.write('window.COURSES["FINM 37301"] = ')
        fh.write(json.dumps(COURSE, indent=2, ensure_ascii=False))
        fh.write(";\n")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
