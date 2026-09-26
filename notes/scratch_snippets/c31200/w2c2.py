import numpy as np
np.seterr(all="ignore")

# Proof-of-stake replaces "one hash try, one vote" with "one staked coin,
# one lottery ticket": each slot, a validator is chosen with probability
# proportional to its stake, so security against a majority attack now
# scales with the VALUE staked rather than energy spent. The mechanism is a
# weighted random draw -- exactly a biased die with as many faces as
# validators, biased by stake share.

def weighted_validator_draw(stakes, n_slots, rng):
    weights = stakes / stakes.sum()
    return rng.choice(len(stakes), size=n_slots, p=weights)

rng = np.random.default_rng(31200 + 4)
validator_names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta"]
stakes = np.array([420_000.0, 310_000.0, 180_000.0, 95_000.0, 45_000.0, 15_000.0])
total_stake = stakes.sum()

n_slots = 200_000
draws = weighted_validator_draw(stakes, n_slots, rng)
counts = np.bincount(draws, minlength=len(stakes))
observed_share = counts / n_slots
target_share = stakes / total_stake

print("validator     stake        stake share   slots won (of %d)   observed share" % n_slots)
for i, name in enumerate(validator_names):
    print("  %-8s  %9.0f     %6.2f%%          %8d              %6.2f%%"
          % (name, stakes[i], 100 * target_share[i], counts[i], 100 * observed_share[i]))

max_dev = np.abs(observed_share - target_share).max()
print("\nmax deviation between observed and target share : %.4f percentage points" % (100 * max_dev))

# Security threshold: a coalition needs > 1/3 of stake to stall finality in a
# BFT-style PoS protocol (a >1/3 coalition can withhold votes and block a
# supermajority), and > 2/3 to finalize blocks the honest validators
# disagree with. Compute how much MORE stake the three smallest validators
# would need to buy, together, to cross the 1/3 safety threshold -- letting
# x be the new stake bought (added to both their stake and the total):
#   (coalition + x) / (total_stake + x) = 1/3   =>   x = (total_stake - 3*coalition) / 2
small_coalition = stakes[3] + stakes[4] + stakes[5]   # Delta + Epsilon + Zeta
coalition_share = small_coalition / total_stake
x_needed = (total_stake - 3 * small_coalition) / 2
new_share = (small_coalition + x_needed) / (total_stake + x_needed)
print("\nDelta+Epsilon+Zeta coalition currently controls %.2f%% of stake" % (100 * coalition_share))
print("additional stake they would need to BUY to cross the 1/3 safety threshold : %.0f"
      % x_needed)
print("check: (%.0f + %.0f) / (%.0f + %.0f) = %.4f (should be 1/3 = %.4f)"
      % (small_coalition, x_needed, total_stake, x_needed, new_share, 1 / 3))

# Contrast with proof-of-work: acquiring 1/3 of STAKE means buying it on the
# open market at a price that rises as you buy (you are bidding against
# yourself), whereas 1/3 of HASH POWER can in principle be rented by the
# hour -- a structurally different attack cost, not just a different number.
print("\nthe key structural difference from proof-of-work: this stake must be BOUGHT")
print("and locked (and is often subject to a slashing penalty if misused), while")
print("hash power can be rented hourly with no lasting stake in the network at all")
