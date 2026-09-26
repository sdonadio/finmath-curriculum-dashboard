import numpy as np
np.seterr(all="ignore")

# Two "market cap" numbers get quoted for a token, and confusing them is a
# classic mistake: circulating market cap = price * tokens currently
# tradeable; fully-diluted valuation (FDV) = price * max/total supply,
# INCLUDING everything still locked under vesting. A low circulating cap
# with a much higher FDV is a warning that today's price is being set by a
# small tradeable float, with a large, mechanically scheduled overhang of
# future sell pressure baked into the token's own contract.

token_price = 2.40
max_supply = 1_000_000_000.0

scenarios = [
    ("early-stage, mostly locked", 0.15),
    ("mid-vesting", 0.45),
    ("fully unlocked", 1.00),
]

print("price = $%.2f, max supply = %.0f\n" % (token_price, max_supply))
print(" stage                          circulating %   circ. mkt cap        FDV        FDV/circ ratio")
fdv = token_price * max_supply
for label, circ_pct in scenarios:
    circ_supply = max_supply * circ_pct
    circ_cap = token_price * circ_supply
    ratio = fdv / circ_cap
    print(" %-28s      %5.1f%%     $%14s   $%12s        %.2fx"
          % (label, circ_pct * 100, format(circ_cap, ",.0f"), format(fdv, ",.0f"), ratio))

# The FDV/circulating ratio tells you roughly how much the tradeable float
# would need to ABSORB, at the current price, if every locked token were
# sold the moment it unlocked and nobody else showed up to buy.
print("\nat 15% circulating, the FDV/circ ratio of 6.67x means the eventual")
print("unlock schedule could add nearly SEVEN TIMES today's tradeable supply")
print("worth of tokens to the market, at the current price, over the vesting period")

# Compare with a token that starts closer to fully circulating.
low_fdv_ratio = fdv / (token_price * max_supply * 0.85)
print("\na token starting at 85%% circulating has an FDV/circ ratio of only %.2fx --"
      % low_fdv_ratio)
print("far less mechanical overhang left to absorb, all else equal")
