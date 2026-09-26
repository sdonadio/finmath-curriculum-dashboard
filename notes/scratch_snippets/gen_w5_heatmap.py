import numpy as np
np.seterr(all="ignore")
import math

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

def cn_grid_snapshots(S0, K, r, sigma, T, M, N, snapshot_layers, x_width=4.0):
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
    snaps = {}
    if M in snapshot_layers:
        snaps[M] = V.copy()
    for step in range(M, 0, -1):
        Vn = V.copy()
        explicit_part = ((1-theta)*(alpha - beta) * Vn[0:N-1]
                          + (1 - (1-theta)*2*alpha - (1-theta)*r*dt) * Vn[1:N]
                          + (1-theta)*(alpha + beta) * Vn[2:N+1])
        rhs = explicit_part.copy()
        rhs[-1] += theta*(alpha + beta) * (math.exp(xs[-1]) - K*math.exp(-r*T))
        V[1:N] = thomas_solve(lower, diag, upper, rhs)
        V[0] = 0.0
        V[-1] = math.exp(xs[-1]) - K*math.exp(-r*T)
        layer = step - 1
        if layer in snapshot_layers:
            snaps[layer] = V.copy()
    return xs, snaps

S0, K, r, sigma, T, N, M = 100.0, 100.0, 0.05, 0.2, 1.0, 400, 800
snapshot_layers = {0, 200, 400, 600, 800}
xs, snaps = cn_grid_snapshots(S0, K, r, sigma, T, M, N, snapshot_layers)
S_targets = [70.0, 85.0, 100.0, 115.0, 130.0]
matrix = []
for layer in sorted(snapshot_layers):
    row = [round(float(np.interp(math.log(S), xs, snaps[layer])), 4) for S in S_targets]
    matrix.append(row)
t_labels = [round(layer/M*T, 3) for layer in sorted(snapshot_layers)]
print("S_targets=", S_targets)
print("t_labels=", t_labels)
for t, row in zip(t_labels, matrix):
    print(t, row)
