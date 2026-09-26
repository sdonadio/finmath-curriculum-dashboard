import numpy as np
np.seterr(all="ignore")

# A proof-of-stake protocol that pays staking rewards by MINTING new tokens
# (inflationary issuance, not fee revenue) is not creating value out of
# nothing: it is transferring ownership share from everyone who does NOT
# stake to everyone who does. The quoted "staking APR" is a NOMINAL yield;
# the REAL yield -- what it does to your share of the network -- depends
# on what fraction of supply is staked and what fraction is not.

annual_inflation = 0.08                 # 8% of supply minted per year, paid to stakers
staking_participation = 0.60            # 60% of supply is staked

# If a staker earns their pro-rata share of the newly minted tokens, their
# NOMINAL yield on staked tokens is inflation / participation rate.
nominal_staker_yield = annual_inflation / staking_participation
print("annual inflation (new supply minted)     : %.1f%%" % (annual_inflation * 100))
print("fraction of supply staked                : %.1f%%" % (staking_participation * 100))
print("nominal staking APR (pro-rata of minting) : %.2f%%\n" % (nominal_staker_yield * 100))

# Track ownership SHARE (not token count) for a staker and a non-staker
# over 5 years, starting from an equal 1-token holding each.
years = 5
supply = 1.0
staker_tokens = staking_participation
nonstaker_tokens = 1 - staking_participation
staker_share_t0 = staker_tokens / supply

print("year   total supply   staker's tokens   staker's SHARE   non-staker's SHARE")
print("  0       %8.4f         %8.4f          %6.2f%%             %6.2f%%"
      % (supply, staker_tokens, 100 * staker_tokens / supply, 100 * nonstaker_tokens / supply))
for yr in range(1, years + 1):
    minted = supply * annual_inflation
    supply += minted
    staker_tokens += minted                 # stakers receive ALL new issuance, pro-rata among themselves
    print("  %d       %8.4f         %8.4f          %6.2f%%             %6.2f%%"
          % (yr, supply, staker_tokens, 100 * staker_tokens / supply, 100 * nonstaker_tokens / supply))

print("\na non-staker's TOKEN COUNT never changes, but their OWNERSHIP SHARE falls")
print("from %.2f%% to %.2f%% over %d years -- this is the real cost of not staking,"
      % (100 * (1 - staking_participation), 100 * nonstaker_tokens / supply, years))
print("even though the nominal price of each token says nothing about it directly")
