import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
T = 1.0
paths = 500_000
sigma = 0.3

B_T = rng.normal(0.0, np.sqrt(T), size=paths)
naive = np.exp(sigma * B_T)                  # what ordinary calculus intuition (no 2nd-order term) expects to average to 1
correct_mean_theory = np.exp(0.5 * sigma ** 2 * T)

print(f"E[e^(sigma B_T)]    (simulated)        = {naive.mean():.5f}")
print(f"exp(sigma^2 T / 2)  (Ito's correction)  = {correct_mean_theory:.5f}")
print("a first-order argument that ignored Ito's second-order term would predict this stays at 1;")
print("it does not -- E[e^(sigma B_T)] grows with sigma^2 T, exactly the correction Ito's formula supplies.")
