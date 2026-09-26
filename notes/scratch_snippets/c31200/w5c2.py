import numpy as np
np.seterr(all="ignore")

# A seigniorage-style algorithmic stablecoin keeps its peg with NO
# collateral at all: below peg, the protocol lets holders BURN 1 stablecoin
# to MINT $1 worth of a volatile "share" token, shrinking stablecoin supply
# to push the price back up. This works as long as the market keeps
# believing the share token is worth something. If a large redemption wave
# dilutes the share supply faster than the market's confidence in it can
# absorb, the mechanism REVERSES into a reflexive "death spiral": minting
# shares to defend the peg crashes the share price, which destroys the very
# confidence the peg defense depends on, which forces MORE minting.

def simulate_spiral(stable_supply0, share_mcap0, share_price0, shock_size,
                     redemption_fraction, n_rounds, confidence_decay):
    # The stablecoin's market price each round is modelled as tracking the
    # share token's remaining confidence (its market cap as a fraction of
    # where it started) -- a fully reflexive design where nothing but the
    # share token's own health backs the peg, unlike week 5's collateralized
    # vault.
    stable_price = 1.0 - shock_size
    stable_supply = stable_supply0
    share_supply = share_mcap0 / share_price0
    share_mcap = share_mcap0
    share_price = share_price0
    history = [(stable_supply, stable_price, share_price, share_mcap)]
    for _ in range(n_rounds):
        redeemed = stable_supply * redemption_fraction * max(0.0, 1.0 - stable_price)
        stable_supply -= redeemed
        new_shares = redeemed / share_price               # $1 of new shares minted per stablecoin burned
        share_supply += new_shares
        dilution_frac = new_shares / share_supply
        share_mcap *= max(0.0, 1.0 - confidence_decay * dilution_frac)
        share_price = share_mcap / share_supply
        stable_price = np.clip(share_mcap / share_mcap0, 0.0, 1.0)
        history.append((stable_supply, stable_price, share_price, share_mcap))
    return history

print("MILD shock (5% de-peg), confidence holds up well (low decay):\n")
hist_mild = simulate_spiral(1_000_000_000.0, 500_000_000.0, 10.0, shock_size=0.05,
                             redemption_fraction=0.20, n_rounds=6, confidence_decay=0.6)
print(" round   stablecoin supply     stablecoin price   share price   share market cap")
for i, (supply, price, sp, mcap) in enumerate(hist_mild):
    print("   %d      %14.0f          $%.4f          $%7.4f      %14.0f" % (i, supply, price, sp, mcap))

print("\nSEVERE shock (40% de-peg), confidence is fragile (high decay):\n")
hist_severe = simulate_spiral(1_000_000_000.0, 500_000_000.0, 10.0, shock_size=0.40,
                               redemption_fraction=0.20, n_rounds=6, confidence_decay=3.0)
print(" round   stablecoin supply     stablecoin price   share price   share market cap")
for i, (supply, price, sp, mcap) in enumerate(hist_severe):
    print("   %d      %14.0f          $%.4f          $%7.4f      %14.0f" % (i, supply, price, sp, mcap))

print("\nmild case: peg recovers to $%.4f by round %d, and share price only fell to $%.2f"
      % (hist_mild[-1][1], len(hist_mild) - 1, hist_mild[-1][2]))
print("severe case: the peg is down to $%.4f after %d rounds, and share price collapsed"
      % (hist_severe[-1][1], len(hist_severe) - 1))
print("from $10.00 to $%.4f (%.2f%% of its starting market cap remains) -- the SAME"
      % (hist_severe[-1][2], 100 * hist_severe[-1][3] / 500_000_000.0))
print("minting mechanism that restores the peg in the mild case is exactly what")
print("destroys both tokens' value once confidence decays faster than it can absorb")
