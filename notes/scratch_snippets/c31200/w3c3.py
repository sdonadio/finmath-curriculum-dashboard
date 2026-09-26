import numpy as np
np.seterr(all="ignore")

# A vesting schedule with a cliff is how token grants to founders, team and
# early investors are actually locked up: NOTHING vests before the cliff
# date (a hard step at t = cliff), then the grant vests LINEARLY from the
# cliff to the end of the full vesting period. This matters for anyone
# pricing or trading the token, because supply that is legally allocated is
# not the same as supply that can actually be sold -- the vesting curve is
# the schedule of when locked supply becomes sellable float.

# The common team-grant convention: vested(t) is linear in TOTAL elapsed
# time from the grant date once past the cliff, not linear from the cliff
# itself -- i.e. vested(t) = t / total_months for t >= cliff, a straight
# line from the grant date that is simply gated off (returns zero) before
# the cliff.
def vested_fraction_simple(t_months, cliff_months, total_months):
    if t_months < cliff_months:
        return 0.0
    return min(1.0, t_months / total_months)

grant_tokens = 4_000_000.0
cliff_months, total_months = 12, 48

months = np.arange(0, 49, 3)
vested = np.array([vested_fraction_simple(t, cliff_months, total_months) for t in months])
vested_tokens = vested * grant_tokens

print("grant = %.0f tokens, %d-month cliff, %d-month total vest\n" % (grant_tokens, cliff_months, total_months))
print(" month   vested fraction   vested tokens   newly unlocked at this checkpoint")
prev = 0.0
for m, v, vt in zip(months, vested, vested_tokens):
    newly = vt - prev
    print("   %2d       %6.2f%%          %10.0f              %10.0f" % (m, v * 100, vt, newly))
    prev = vt

print("\nat month 11 (one month before the cliff)  : %.0f tokens vested"
      % (vested_fraction_simple(11, cliff_months, total_months) * grant_tokens))
print("at month 12 (the cliff)                     : %.0f tokens vested"
      % (vested_fraction_simple(12, cliff_months, total_months) * grant_tokens))
print("that single month unlocks %.0f%% of the ENTIRE grant at once -- the cliff is a"
      % (100 * vested_fraction_simple(12, cliff_months, total_months)))
print("discrete jump, not a continuation of the (zero) vesting rate before it")

# The float-supply consequence: total tokens outstanding vs SELLABLE tokens
# outstanding can differ by a lot in the first year of a token's life.
circulating_supply = 50_000_000.0
print("\nif this grant is %.1f%% of total circulating supply, at month 6 the true"
      % (100 * grant_tokens / circulating_supply))
print("sellable float understates allocated supply by %.0f tokens (%.2f%% of circulating)"
      % (grant_tokens, 100 * grant_tokens / circulating_supply))
