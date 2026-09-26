import numpy as np
np.seterr(all="ignore")

# A "staking APY" quote and a liquid-staking receipt token (e.g. an
# exchange-rate token whose redemption value grows relative to the
# underlying) are a cryptoasset analog of ordinary fixed income: APR is a
# simple annual rate, APY compounds it at some frequency, and a token whose
# value simply ACCRUES toward a known future redemption value -- rather
# than paying out periodic rewards -- behaves like a discount (zero-coupon)
# instrument priced by the same PV = FV / (1+r)^t logic.

def apr_to_apy(apr, compounds_per_year):
    return (1 + apr / compounds_per_year) ** compounds_per_year - 1

apr = 0.045
print("nominal staking APR = %.2f%%\n" % (apr * 100))
print(" compounding frequency   APY")
for label, n in (("annual (APR itself)", 1), ("monthly", 12), ("daily", 365),
                 ("every epoch (~6.4 min, ~82,000/yr)", 82_125)):
    apy = apr_to_apy(apr, n)
    print("   %-32s  %.4f%%" % (label, apy * 100))
apy_continuous = np.exp(apr) - 1
print("   %-32s  %.4f%%" % ("continuous compounding (limit)", apy_continuous * 100))

# A liquid-staking receipt token (like an exchange-rate rebasing share) is
# redeemable for underlying + accrued rewards at any time; its EXCHANGE
# RATE against the underlying grows deterministically with the staking
# APY, the same way a zero-coupon bond's price converges to par as it
# accrues toward maturity. Model 1 receipt token redeemable for exactly
# 1 underlying unit in exactly 1 year, growing at the daily-compounded APY.
apy_daily = apr_to_apy(apr, 365)
days = np.arange(0, 366, 30)
years_remaining = (365 - days) / 365.0                      # time left until the 1:1 redemption
price_now = 1.0 / (1 + apy_daily) ** years_remaining         # fair price today of 1 receipt token
accrued_value = 1.0 / price_now                              # equivalently, value already accrued per token
print("\nreceipt token redeemable for 1 underlying unit in 365 days, accruing at %.3f%% APY:"
      % (apy_daily * 100))
print(" day   years remaining   fair price today (PV of 1 token)   accrued value")
for d, yr, price, acc in zip(days, years_remaining, price_now, accrued_value):
    print("  %3d        %.4f                  %.6f                       %.6f" % (d, yr, price, acc))

print("\nthis is EXACTLY zero-coupon bond pricing: PV = FV / (1+apy)^t, with 'FV' being")
print("the eventual 1:1 underlying redemption and 't' the fraction of the year")
print("remaining -- the token's price converges to 1.0 as t -> 0, same shape as par")
print("convergence for a bond approaching maturity")
