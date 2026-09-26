import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)

def doubling_strategy(rounds, bankroll, trials):
    total_gain = np.zeros(trials)
    for t in range(trials):
        wealth = 0.0
        bet = 1.0
        stopped = False
        for _ in range(rounds):
            if stopped or bet > bankroll + wealth:
                stopped = True     # can no longer afford the next double: stop betting
                continue
            outcome = int(rng.choice((-1, 1)))
            wealth += outcome * bet
            bet = 1.0 if outcome == 1 else bet * 2
        total_gain[t] = wealth
    return total_gain

gain = doubling_strategy(rounds=15, bankroll=50, trials=100_000)
print(f"mean total gain under the doubling strategy = {gain.mean():.4f}  (a predictable strategy on a fair game: still ~0)")
print(f"worst outcome across {len(gain):,} paths = {gain.min():.1f}   best outcome = {gain.max():.1f}")
print(f"P(gain <= -20) = {np.mean(gain <= -20):.3%}   P(gain > 0) = {np.mean(gain > 0):.3%}")
print(f"std of total gain = {gain.std():.3f}  -- the risk is concentrated in the tail even though the mean is not")
