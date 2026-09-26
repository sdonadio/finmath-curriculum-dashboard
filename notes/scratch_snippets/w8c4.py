import numpy as np
np.seterr(all="ignore")
import math

_erf = np.vectorize(math.erf)


def norm_cdf(x):
    return 0.5 * (1.0 + _erf(x / np.sqrt(2.0)))


def bs_call_delta(S, K, r, sigma, tau):
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * tau) / (sigma * np.sqrt(tau))
    return norm_cdf(d1)


def bs_call_price(S, K, r, sigma, tau):
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * tau) / (sigma * np.sqrt(tau))
    d2 = d1 - sigma * np.sqrt(tau)
    return S * norm_cdf(d1) - K * np.exp(-r * tau) * norm_cdf(d2)


S0, K, r, sigma, T = 100.0, 100.0, 0.04, 0.25, 1.0
premium = float(bs_call_price(np.array([S0]), K, r, sigma, T)[0])
paths = 8_000

print(f"{'rehedges':>10} {'mean hedge P&L':>16} {'std hedge P&L':>15}")
for n in (10, 40, 160, 640):
    dt = T / n
    rng = np.random.default_rng(34500)
    S = np.full(paths, S0)
    shares = bs_call_delta(S, K, r, sigma, T)
    cash = premium - shares * S
    for i in range(n):
        tau = max(T - (i + 1) * dt, 1e-6)
        dW = rng.normal(0.0, np.sqrt(dt), size=paths)
        S = S * np.exp((r - 0.5 * sigma ** 2) * dt + sigma * dW)
        cash = cash * np.exp(r * dt)
        new_shares = bs_call_delta(S, K, r, sigma, tau) if tau > 1e-5 else (S > K).astype(float)
        cash -= (new_shares - shares) * S
        shares = new_shares
    payoff = np.maximum(S - K, 0.0)
    pnl = cash + shares * S - payoff
    print(f"{n:10d} {pnl.mean():+16.4f} {pnl.std():15.4f}")

print("\nhedging error shrinks toward 0 as the rehedge grid is refined -- the same sqrt(dt) pattern")
print("as the Euler-Maruyama error in week 5. This course stops at the replication argument itself;")
print("Greeks, exotic payoffs and numerical PDE/tree methods belong to the Options and Numerical Methods courses.")
