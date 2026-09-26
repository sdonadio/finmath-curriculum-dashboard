import numpy as np
np.seterr(all="ignore")

# Both consensus families sell the SAME thing -- the right to decide the
# next block's contents -- for a different currency. Proof-of-work sells it
# for a REAL, sunk resource cost (hashpower and electricity, spent whether
# or not your block wins); proof-of-stake sells it for BONDED CAPITAL that
# can be slashed for misbehaviour. Neither is free; the question is what
# attacking the network actually costs under each.

rng = np.random.default_rng(31200)

# PoW: block-winning probability is proportional to hashrate share; the
# expected cost to control 51% of blocks for `n` blocks is n * (your share
# of the network's total power cost per block).
network_hashrate_ths = 500_000.0        # terahashes/sec, illustrative
cost_per_ths_per_day = 0.02             # USD/day per TH/s (hardware+power, illustrative)
attacker_share = 0.51
n_blocks_attack = 144                    # roughly one day of 10-minute blocks

attacker_hashrate = attacker_share * network_hashrate_ths / (1 - attacker_share)
daily_cost = attacker_hashrate * cost_per_ths_per_day
print("PoW 51% attack (illustrative costs):")
print("  network hashrate            : %.0f TH/s" % network_hashrate_ths)
print("  hashrate an attacker needs  : %.0f TH/s (%.0f%% of a %.0f TH/s network)"
      % (attacker_hashrate, attacker_share * 100, network_hashrate_ths + attacker_hashrate))
print("  cost to sustain it for 1 day: $%s" % format(daily_cost, ",.0f"))

# PoS: block-proposal probability is proportional to STAKE share; controlling
# 51% of consensus power means BONDING 51% of the total stake, at the
# prevailing token price -- capital that is then AT RISK of slashing if
# the attack is detected, not spent regardless of outcome like PoW hardware.
total_stake_tokens = 30_000_000.0
token_price = 40.0
attacker_stake_needed = attacker_share * total_stake_tokens / (1 - attacker_share)
capital_at_risk = attacker_stake_needed * token_price
slashing_rate = 0.30                     # fraction of bonded stake burned if an attack is detected
expected_loss_if_caught = capital_at_risk * slashing_rate

print("\nPoS 51% attack (illustrative costs):")
print("  total staked tokens          : %.0f" % total_stake_tokens)
print("  stake an attacker needs       : %.0f tokens (%.0f%% of a %.0f-token total)"
      % (attacker_stake_needed, attacker_share * 100, total_stake_tokens + attacker_stake_needed))
print("  capital bonded, at that price : $%s" % format(capital_at_risk, ",.0f"))
print("  if caught, slashing burns     : $%s (%.0f%% of the bonded capital)"
      % (format(expected_loss_if_caught, ",.0f"), slashing_rate * 100))

print("\nthe structural difference: PoW's daily cost is SUNK whether the attack")
print("succeeds or not; PoS's capital is only LOST if the attack is caught and")
print("slashed -- an unsuccessful, undetected PoS attack keeps its capital, while")
print("an unsuccessful PoW attack has still burned the electricity")
