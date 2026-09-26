import numpy as np
np.seterr(all="ignore")

# Nakamoto's double-spend race: an attacker with hash-power fraction q mines
# in secret, trying to catch up to an honest chain that already leads by z
# blocks (the number of confirmations a merchant waited for). Each new block
# goes to the attacker with probability q, to the honest chain with
# probability p = 1-q -- a simple random walk on the LEAD. If q < p the walk
# is negatively drifted and the closed-form probability the attacker ever
# catches up is exactly (q/p)^z, the same ruin probability as a gambler
# repeatedly betting against a house edge.

def catch_up_probability_closed_form(q, z):
    p = 1.0 - q
    if q >= p:
        return 1.0
    return (q / p) ** z

def simulate_race(q, z, n_races, rng, max_steps=4000):
    # Vectorised random walk on the LEAD, run for every race at once: each
    # step, a block goes to the attacker (lead -1) with probability q, to
    # the honest chain (lead +1) otherwise. Races that already caught up
    # (lead <= 0) are frozen so extra steps cannot un-catch them.
    lead = np.full(n_races, z, dtype=np.int64)
    for _ in range(max_steps):
        active = lead > 0
        if not active.any():
            break
        delta = np.where(rng.random(n_races) < q, -1, 1)
        lead = np.where(active, lead + delta, lead)
    return (lead <= 0).mean()

rng = np.random.default_rng(31200 + 3)
print("attacker hash-power fraction q = 0.35, honest chain leads by z confirmations\n")
print(" confirmations(z)   closed form (q/p)^z   Monte Carlo (20,000 races)")
q = 0.35
for z in (1, 2, 3, 6):
    closed = catch_up_probability_closed_form(q, z)
    mc = simulate_race(q, z, 20_000, rng)
    print("       %d                %.5f              %.5f" % (z, closed, mc))

print("\nsame z=6 confirmations, varying the attacker's hash-power share:")
print(" q (attacker share)   P(catch up from 6 blocks behind)")
for q in (0.10, 0.25, 0.35, 0.45):
    print("      %.2f                    %.6f" % (q, catch_up_probability_closed_form(q, 6)))

print("\na merchant who waits for 6 confirmations against a 10%% attacker faces a")
print("%.4f%% chance of a successful double-spend; against a 45%% attacker (nearly" % (100 * catch_up_probability_closed_form(0.10, 6)))
print("half the network's hash power) that risk is %.1f%% -- 6 confirmations is a"
      % (100 * catch_up_probability_closed_form(0.45, 6)))
print("policy choice trading settlement speed against exactly this residual risk")
