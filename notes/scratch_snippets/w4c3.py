import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def explicit_fd_call(S0, K, r, sigma, T, N, x_width, alpha_target=0.4):
    x0 = math.log(S0)
    dx = 2*x_width*sigma*math.sqrt(T) / N
    xs = x0 + dx*(np.arange(N+1) - N/2.0)
    # pick M so alpha stays fixed (comfortably stable) regardless of grid width
    M = max(1, int(math.ceil(0.5*sigma*sigma*T / (alpha_target*dx*dx))))
    dt = T / M
    alpha = 0.5*sigma*sigma*dt/(dx*dx)
    nu = r - 0.5*sigma*sigma
    beta = nu*dt/(2*dx)
    V = np.maximum(np.exp(xs) - K, 0.0)
    for _ in range(M):
        Vn = V.copy()
        V[1:N] = (Vn[1:N] * (1 - 2*alpha - r*dt)
                  + Vn[2:N+1] * (alpha + beta)
                  + Vn[0:N-1] * (alpha - beta))
        V[0] = 0.0
        V[-1] = math.exp(xs[-1]) - K*math.exp(-r*T)
    return float(np.interp(x0, xs, V)), M

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes price: {bs_price:.6f}")
for x_width, label in ((1.0, "narrow: boundary too close, truncation error dominates"),
                       (4.0, "wide: boundary far enough to be nearly exact"),
                       (8.0, "very wide: no further gain, just wasted grid points")):
    price, M = explicit_fd_call(S0, K, r, sigma, T, N=200, x_width=x_width)
    print(f"x_width={x_width:.1f} (M={M:4d} steps, {label}): price={price:.6f}  error={price-bs_price:+.6f}")
