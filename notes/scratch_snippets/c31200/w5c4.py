import numpy as np
np.seterr(all="ignore")

# Custody of institutional crypto holdings almost never rests on a single
# private key: an m-of-n multisig (or an MPC threshold-signature scheme
# with the same math) requires m of n independently-held key shares to
# authorize a transaction. If each individual key has some annual
# probability of being compromised (phishing, an insider, a device
# exploit), the probability that an ATTACKER can forge a valid signature
# is the probability of compromising at least m of the n keys -- a
# binomial tail, not a simple sum.

def prob_at_least_m_compromised(n, m, p_compromise):
    ks = np.arange(m, n + 1)
    # binomial pmf via the log-gamma form of the binomial coefficient, to
    # stay stable for larger n without importing scipy.
    log_choose = (np.array([np.sum(np.log(np.arange(1, n + 1)))
                             - np.sum(np.log(np.arange(1, k + 1)))
                             - np.sum(np.log(np.arange(1, n - k + 1))) for k in ks]))
    pmf = np.exp(log_choose) * p_compromise ** ks * (1 - p_compromise) ** (n - ks)
    return pmf.sum()

p_key = 0.02                       # 2% annual chance any single key is compromised
print("annual probability a single custody key is independently compromised: %.1f%%\n"
      % (p_key * 100))
print(" scheme        P(attacker can forge a signature this year)")
for n, m in ((1, 1), (2, 2), (3, 2), (5, 3), (7, 4), (9, 5)):
    prob = prob_at_least_m_compromised(n, m, p_key)
    print("  %d-of-%d keys        %.6f  (%.4f%%)" % (m, n, prob, prob * 100))

# A single key is n=1 all-or-nothing; every OTHER scheme above is strictly
# safer for the SAME per-key compromise rate, but requiring MORE signers
# (larger m relative to n) is not automatically safer if it also raises
# each key's own compromise rate (e.g. more people who can be phished).
# Show the crossover: at what per-key compromise rate does a naive 5-of-5
# scheme (every key needed -- no redundancy for a lost key, but also no
# redundancy for an attacker) become RISKIER than a 3-of-5 scheme?
print("\ncomparing 3-of-5 (some redundancy) against 5-of-5 (unanimous) as the")
print("per-key compromise rate rises -- but a 5-of-5 scheme actually needs")
print("ALL 5 keys compromised, so it should look SAFER, not riskier, from the")
print("attacker's side; the real-world tradeoff it loses on is OPERATIONAL:\n")
for p in (0.01, 0.02, 0.05, 0.10, 0.20):
    p_3of5 = prob_at_least_m_compromised(5, 3, p)
    p_5of5 = prob_at_least_m_compromised(5, 5, p)
    print("  p=%.2f   attacker forges 3-of-5: %.6f   attacker forges 5-of-5: %.6f"
          % (p, p_3of5, p_5of5))

print("\n5-of-5 is always harder to ATTACK (needs every key), but it is also always")
print("harder to OPERATE: losing even ONE key (device failure, a departed employee)")
print("permanently locks the funds, with no quorum left to authorize recovery --")
print("multisig design trades attack-resistance against exactly this availability risk")
