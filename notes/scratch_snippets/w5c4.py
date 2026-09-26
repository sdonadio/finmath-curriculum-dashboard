import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
T, n = 1.0, 1000
dt = T / n
paths = 20_000


def simulate_cir(theta, mu, sigma, X0):
    X = np.full(paths, X0)
    neg_count = 0
    for _ in range(n):
        dW = rng.normal(0.0, np.sqrt(dt), size=paths)
        sqrtX = np.sqrt(np.maximum(X, 0.0))       # sqrt(|X|)-style diffusion coefficient
        X = X + theta * (mu - X) * dt + sigma * sqrtX * dW
        neg_count += int(np.sum(X < 0))
    return neg_count


ok_2tm, ok_s2 = 2 * 3.0 * 0.04, 0.05 ** 2
neg_ok = simulate_cir(theta=3.0, mu=0.04, sigma=0.05, X0=0.04)

bad_2tm, bad_s2 = 2 * 0.3 * 0.01, 0.3 ** 2
neg_bad = simulate_cir(theta=0.3, mu=0.01, sigma=0.3, X0=0.01)

print(f"Feller condition holds  (2*theta*mu={ok_2tm:.4f} >= sigma^2={ok_s2:.4f}): negative excursions over {paths} paths x {n} steps = {neg_ok}")
print(f"Feller condition fails  (2*theta*mu={bad_2tm:.4f} <  sigma^2={bad_s2:.4f}): negative excursions over {paths} paths x {n} steps = {neg_bad}")
