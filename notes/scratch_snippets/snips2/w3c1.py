import numpy as np
np.seterr(all="ignore")

# A fixed-supply issuance schedule (Bitcoin-style) pays a block reward that
# HALVES on a fixed schedule, so total supply is a geometric series that
# converges to a hard cap -- the protocol's "monetary policy" is entirely
# mechanical and known in advance, in contrast to a discretionary issuer.

blocks_per_halving = 210_000
initial_reward = 50.0
halvings_to_show = 8

reward = initial_reward
cumulative = 0.0
print("halving   blocks/period    reward/block   supply issued this period   cumulative supply")
for h in range(halvings_to_show):
    issued_this_period = reward * blocks_per_halving
    cumulative += issued_this_period
    print("  %2d        %8d         %8.4f          %14.1f              %14.1f"
          % (h, blocks_per_halving, reward, issued_this_period, cumulative))
    reward /= 2

# The asymptotic cap in closed form: sum of a geometric series.
asymptotic_cap = initial_reward * blocks_per_halving * 2   # sum_{h=0}^inf r0/2^h = 2*r0
print("\nasymptotic supply cap (closed form, infinite halvings): %.1f" % asymptotic_cap)
print("supply issued after %d halvings already reaches %.4f%% of the cap"
      % (halvings_to_show, 100 * cumulative / asymptotic_cap))

# Contrast: an issuer who instead pays a CONSTANT reward forever has no cap
# at all -- supply grows linearly, without bound.
years_per_halving = blocks_per_halving / (144 * 365)     # ~10-minute blocks
print("\nat roughly %.1f years per halving period, halving %d lands around year %.0f"
      % (years_per_halving, halvings_to_show, years_per_halving * halvings_to_show))
print("a constant-reward schedule paying %.4f/block forever would issue %.1f more"
      % (initial_reward, initial_reward * blocks_per_halving * halvings_to_show - cumulative))
print("units over the SAME number of blocks, with no asymptote at all")
