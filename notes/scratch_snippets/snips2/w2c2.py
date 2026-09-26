import numpy as np
np.seterr(all="ignore")

# Block SPACE is scarce (a fixed gas limit per block) and transactions bid
# a gas price for inclusion, so the mempool behaves like a sealed-bid
# auction for a fixed number of "seats" -- the block producer simply takes
# the highest bidders until the block is full, exactly a knapsack problem
# with an implicit market-clearing price at the last-included bid.

rng = np.random.default_rng(31200 + 1)
BLOCK_GAS_LIMIT = 30_000_000

n_pending = 400
gas_used = rng.integers(21_000, 300_000, n_pending)         # each tx's own gas cost
bid_gwei = np.round(rng.lognormal(mean=np.log(25), sigma=0.6, size=n_pending), 1)  # gas price bid

order = np.argsort(-bid_gwei)               # highest bidder first
cum_gas = np.cumsum(gas_used[order])
included_mask = cum_gas <= BLOCK_GAS_LIMIT
n_included = int(included_mask.sum())
clearing_price = bid_gwei[order][n_included - 1] if n_included else 0.0
first_excluded_price = bid_gwei[order][n_included] if n_included < n_pending else None

print("pending transactions : %d, total gas requested : %d" % (n_pending, gas_used.sum()))
print("block gas limit      : %d\n" % BLOCK_GAS_LIMIT)
print("transactions included in the block : %d / %d" % (n_included, n_pending))
print("gas used in the block               : %d (%.1f%% full)"
      % (cum_gas[n_included - 1], 100 * cum_gas[n_included - 1] / BLOCK_GAS_LIMIT))
print("clearing bid (lowest included)      : %.1f gwei" % clearing_price)
if first_excluded_price is not None:
    print("highest EXCLUDED bid                 : %.1f gwei" % first_excluded_price)

# What happens to a middling bidder if network demand suddenly doubles
# (twice as many transactions competing for the same fixed block space)?
gas_used2 = np.concatenate([gas_used, rng.integers(21_000, 300_000, n_pending)])
bid2 = np.concatenate([bid_gwei, np.round(rng.lognormal(np.log(25), 0.6, n_pending), 1)])
order2 = np.argsort(-bid2)
cum2 = np.cumsum(gas_used2[order2])
included2 = cum2 <= BLOCK_GAS_LIMIT
n_inc2 = int(included2.sum())
clearing2 = bid2[order2][n_inc2 - 1]
print("\nafter demand doubles (%d pending): clearing bid rises to %.1f gwei (from %.1f)"
      % (len(bid2), clearing2, clearing_price))
print("a transaction that bid exactly %.1f gwei would have been included before," % clearing_price)
print("and is %s after demand doubled" % ("still included" if clearing_price >= clearing2 else "now EXCLUDED"))
