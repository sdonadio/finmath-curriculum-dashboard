import numpy as np
from scipy.stats import norm
np.seterr(all="ignore")

# A DeFi "options vault" (a covered-call strategy, automated) deposits an
# asset, sells an out-of-the-money call against it every week, and pays
# depositors the premium as yield -- the asset itself is the collateral,
# priced by an ordinary Black-Scholes call, and the "yield" is compensation
# for giving up upside above the strike, exactly like a traditional
# covered-call ETF, just running on-chain and unwound weekly.

def bs_call(S, K, r, sigma, t):
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * t) / (sigma * np.sqrt(t))
    d2 = d1 - sigma * np.sqrt(t)
    return S * norm.cdf(d1) - K * np.exp(-r * t) * norm.cdf(d2)

S0 = 3_000.0                # e.g. ETH price
r = 0.00                    # no native yield assumed on the collateral itself
sigma = 0.65                 # crypto vol is high
t = 7 / 365                  # weekly tenor
otm_pct = 0.10                # strike 10% above spot

K = S0 * (1 + otm_pct)
premium = bs_call(S0, K, r, sigma, t)
weekly_yield = premium / S0
annualised_yield = (1 + weekly_yield) ** 52 - 1

print("weekly covered call: S0=%.0f, K=%.0f (+%.0f%% OTM), sigma=%.0f%%, t=1 week"
      % (S0, K, otm_pct * 100, sigma * 100))
print("call premium received       : %.2f (%.3f%% of the deposited asset's value)"
      % (premium, weekly_yield * 100))
print("naive annualised yield (compounded weekly, vol/price held fixed) : %.1f%%\n"
      % (annualised_yield * 100))

# The yield is not free: simulate 52 weekly outcomes and track separately
# the premium collected and the upside given away whenever the call finishes
# in the money and caps that week's gain at the strike.
rng = np.random.default_rng(31200 + 4)
n_weeks = 52
weekly_vol = sigma * np.sqrt(t)

price = S0
vault_value, buyhold_value = S0, S0
total_premium, total_foregone, weeks_capped = 0.0, 0.0, 0

for wk in range(n_weeks):
    move = rng.normal(-0.5 * weekly_vol ** 2, weekly_vol)
    new_price = price * np.exp(move)
    strike = price * (1 + otm_pct)
    prem = bs_call(price, strike, r, sigma, t)
    total_premium += prem
    if new_price > strike:
        weeks_capped += 1
        total_foregone += new_price - strike
        vault_gain = strike - price
    else:
        vault_gain = new_price - price
    vault_value += vault_gain + prem
    buyhold_value += new_price - price
    price = new_price

print("simulated 52 weeks: the call finished in-the-money (upside capped) in %d of 52 weeks"
      % weeks_capped)
print("total premium collected over the year        : %.0f" % total_premium)
print("total upside foregone in the capped weeks     : %.0f" % total_foregone)
print("vault (covered call + premium) ending value   : %.0f" % vault_value)
print("buy-and-hold ending value                      : %.0f" % buyhold_value)
print("vault outperformed buy-and-hold by             : %+.0f\n" % (vault_value - buyhold_value))
print("net: covered calls trade capped upside for steady premium income --")
print("'yield' here is a risk premium, not something created from nothing, and it")
print("would have UNDERPERFORMED buy-and-hold in any year with a large sustained rally")
