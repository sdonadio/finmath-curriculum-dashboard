import numpy as np
np.seterr(all="ignore")
import math

def bs_put(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return K*math.exp(-r*T)*Ncdf(-d2) - S*Ncdf(-d1)

rng = np.random.default_rng(32000)
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
n_steps, n_paths = 50, 100_000
dt = T / n_steps

Z = rng.standard_normal((n_paths, n_steps))
increments = (r - 0.5*sigma*sigma)*dt + sigma*math.sqrt(dt)*Z
log_paths = np.log(S0) + np.cumsum(increments, axis=1)
paths = np.column_stack([np.full(n_paths, S0), np.exp(log_paths)])

# a naive, purely path-local stopping rule: exercise the FIRST time you are in the money
euro_price = math.exp(-r*T) * np.maximum(K - paths[:, -1], 0.0).mean()

naive_cashflow = np.zeros(n_paths)
naive_time = np.full(n_paths, n_steps)
still_alive = np.ones(n_paths, dtype=bool)
for t in range(1, n_steps + 1):
    itm_now = still_alive & (paths[:, t] < K)
    naive_cashflow[itm_now] = K - paths[itm_now, t]
    naive_time[itm_now] = t
    still_alive[itm_now] = False
naive_price = (naive_cashflow * np.exp(-r*dt*naive_time)).mean()

print(f"European put (hold to maturity, closed form): {bs_put(S0,K,r,sigma,T):.6f}")
print(f"'exercise the instant you are in the money' rule: {naive_price:.6f}")
print("that naive rule uses each path's OWN future, which is not information a real trader has yet;")
print("it is a valid trading rule to backtest, but not a valid pricing algorithm, and it is not even")
print("close to optimal -- it exercises far too early, well before the true continuation value drops")
print("below intrinsic value. Getting the STOPPING RULE right, without peeking, is the entire problem")
print("American Monte Carlo has to solve; simulating the paths themselves was never the hard part.")
