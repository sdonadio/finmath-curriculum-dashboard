import numpy as np
np.seterr(all="ignore")

# Two families of token emission schedule. A HALVING schedule (Bitcoin) pays
# a fixed reward per block that is cut in half every fixed number of
# blocks, producing a hard, disinflationary cap on total supply -- the sum
# of a geometric series. A CONTINUOUS-INFLATION schedule (many proof-of-
# stake chains) instead issues a fixed PERCENTAGE of current supply per
# period, forever, so supply grows without bound but its growth RATE falls
# toward zero, never actually reaching it.

# -- Halving schedule --
blocks_per_epoch = 210_000
initial_reward = 50.0
n_epochs = 8
epoch_blocks = np.arange(n_epochs) * blocks_per_epoch
rewards = initial_reward / (2.0 ** np.arange(n_epochs))
supply_per_epoch = rewards * blocks_per_epoch
cumulative_supply = np.cumsum(supply_per_epoch)
hard_cap = initial_reward * blocks_per_epoch * 2      # sum of the full geometric series

print("HALVING SCHEDULE (reward halves every %d blocks, starting at %.0f)\n"
      % (blocks_per_epoch, initial_reward))
print(" epoch   reward/block   supply minted this epoch   cumulative supply")
for i in range(n_epochs):
    print("   %d       %8.4f          %12.0f              %12.0f"
          % (i, rewards[i], supply_per_epoch[i], cumulative_supply[i]))
print("\nsupply after %d epochs : %.0f" % (n_epochs, cumulative_supply[-1]))
print("theoretical hard cap (infinite epochs) : %.0f  (%.2f%% already minted)"
      % (hard_cap, 100 * cumulative_supply[-1] / hard_cap))

# -- Continuous inflation schedule --
initial_supply = 100_000_000.0
annual_inflation = 0.045
n_years = 20
years = np.arange(n_years + 1)
supply_inflation = initial_supply * (1 + annual_inflation) ** years
print("\n\nCONTINUOUS INFLATION SCHEDULE (%.1f%% of current supply, per year, forever)\n"
      % (annual_inflation * 100))
print(" year   supply            growth this year   growth as % of supply")
for y in (0, 1, 5, 10, 20):
    growth = supply_inflation[y] - (supply_inflation[y - 1] if y > 0 else initial_supply)
    pct = growth / supply_inflation[y] * 100 if y > 0 else 0.0
    print("  %3d   %14.0f       %12.0f            %6.2f%%" % (y, supply_inflation[y], growth, pct))

print("\nafter %d years the halving chain's supply growth is already capped near its" % n_epochs)
print("asymptote (%.2f%% minted), while the inflationary chain has grown %.1fx and is"
      % (100 * cumulative_supply[-1] / hard_cap, supply_inflation[n_years] / initial_supply))
print("STILL growing every year -- the rate falls but never reaches zero, so 'total")
print("supply' is not a fixed number the way it is for the halving schedule")
