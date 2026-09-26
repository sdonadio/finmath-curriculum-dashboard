import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def thomas_solve(lower, diag, upper, rhs):
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

def theta_fd_call(S0, K, r, sigma, T, M, N, theta, x_width=4.0):
    """theta=0 -> explicit, theta=1 -> fully implicit, theta=0.5 -> Crank-Nicolson."""
    x0 = math.log(S0)
    dx = 2*x_width*sigma*math.sqrt(T) / N
    xs = x0 + dx*(np.arange(N+1) - N/2.0)
    dt = T / M
    alpha = 0.5*sigma*sigma*dt/(dx*dx)
    nu = r - 0.5*sigma*sigma
    beta = nu*dt/(2*dx)
    n_int = N - 1
    lower = np.full(n_int, -theta*(alpha - beta))
    diag  = np.full(n_int, 1 + 2*theta*alpha + theta*r*dt)
    upper = np.full(n_int, -theta*(alpha + beta))
    V = np.maximum(np.exp(xs) - K, 0.0)
    for _ in range(M):
        Vn = V.copy()
        explicit_part = ((1-theta)*(alpha - beta) * Vn[0:N-1]
                          + (1 - (1-theta)*2*alpha - (1-theta)*r*dt) * Vn[1:N]
                          + (1-theta)*(alpha + beta) * Vn[2:N+1])
        rhs = explicit_part.copy()
        rhs[-1] += theta*(alpha + beta) * (math.exp(xs[-1]) - K*math.exp(-r*T))
        V[1:N] = thomas_solve(lower, diag, upper, rhs)
        V[0] = 0.0
        V[-1] = math.exp(xs[-1]) - K*math.exp(-r*T)
    return float(np.interp(x0, xs, V))

S0, K, r, sigma, T, N = 100.0, 100.0, 0.05, 0.2, 1.0, 200
bs_price = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes price: {bs_price:.6f}")
M = 500
for theta, name in ((0.0, "explicit"), (1.0, "fully implicit"), (0.5, "Crank-Nicolson")):
    price = theta_fd_call(S0, K, r, sigma, T, M, N, theta)
    print(f"M={M} steps, {name:14s}: price={price:.6e}  error={price-bs_price:+.6e}")
