import numpy as np
np.seterr(all="ignore")
import math

def bs_greeks(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    npdf = lambda x: math.exp(-0.5*x*x)/math.sqrt(2*math.pi)
    delta = Ncdf(d1)
    gamma = npdf(d1) / (S*sigma*math.sqrt(T))
    return delta, gamma

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

def cn_grid_call(S0, K, r, sigma, T, M, N, x_width=4.0):
    x0 = math.log(S0)
    dx = 2*x_width*sigma*math.sqrt(T) / N
    xs = x0 + dx*(np.arange(N+1) - N/2.0)
    dt = T / M
    alpha = 0.5*sigma*sigma*dt/(dx*dx); nu = r - 0.5*sigma*sigma; beta = nu*dt/(2*dx)
    theta = 0.5
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
    i_mid = N // 2   # xs[i_mid] == x0 by construction (N even)
    return xs, V, i_mid, dx

S0, K, r, sigma, T, N, M = 100.0, 100.0, 0.05, 0.2, 1.0, 400, 1000
xs, V, i, dx = cn_grid_call(S0, K, r, sigma, T, M, N)
dV_dx  = (V[i+1] - V[i-1]) / (2*dx)
d2V_dx2 = (V[i+1] - 2*V[i] + V[i-1]) / (dx*dx)
delta_grid = dV_dx / S0
gamma_grid = (d2V_dx2 - dV_dx) / (S0*S0)

delta_bs, gamma_bs = bs_greeks(S0, K, r, sigma, T)
print(f"grid delta = {delta_grid:.6f}   BS delta = {delta_bs:.6f}")
print(f"grid gamma = {gamma_grid:.6f}   BS gamma = {gamma_bs:.6f}")
print("Greeks fall out of the same grid used for the price -- no separate formula needed")
