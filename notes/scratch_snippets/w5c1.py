import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def thomas_solve(lower, diag, upper, rhs):
    """Solve a tridiagonal system Ax=rhs given the three diagonals (Thomas algorithm)."""
    n = len(diag)
    c = upper.copy(); d = diag.copy(); b = rhs.copy()
    for i in range(1, n):
        w = lower[i] / d[i-1]
        d[i] -= w * c[i-1]
        b[i] -= w * b[i-1]
    x = np.empty(n)
    x[-1] = b[-1] / d[-1]
    for i in range(n-2, -1, -1):
        x[i] = (b[i] - c[i]*x[i+1]) / d[i]
    return x

def implicit_fd_call(S0, K, r, sigma, T, M, N, x_width=4.0):
    x0 = math.log(S0)
    dx = 2*x_width*sigma*math.sqrt(T) / N
    xs = x0 + dx*(np.arange(N+1) - N/2.0)
    dt = T / M
    alpha = 0.5*sigma*sigma*dt/(dx*dx)
    nu = r - 0.5*sigma*sigma
    beta = nu*dt/(2*dx)
    n_int = N - 1
    lower = np.full(n_int, -(alpha - beta))
    diag  = np.full(n_int, 1 + 2*alpha + r*dt)
    upper = np.full(n_int, -(alpha + beta))
    V = np.maximum(np.exp(xs) - K, 0.0)
    for _ in range(M):
        rhs = V[1:N].copy()
        rhs[0]  += (alpha - beta) * 0.0
        rhs[-1] += (alpha + beta) * (math.exp(xs[-1]) - K*math.exp(-r*T))
        V[1:N] = thomas_solve(lower, diag, upper, rhs)
        V[0] = 0.0
        V[-1] = math.exp(xs[-1]) - K*math.exp(-r*T)
    return float(np.interp(x0, xs, V)), alpha

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes price: {bs_price:.6f}")
for M in (2000, 40):
    price, alpha = implicit_fd_call(S0, K, r, sigma, T, M, N=200)
    print(f"M={M:5d} steps, alpha={alpha:.4f} (implicit is unconditionally stable regardless of alpha): "
          f"price={price:.6f}  error={price-bs_price:+.6f}")
