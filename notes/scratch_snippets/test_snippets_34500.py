import numpy as np

SNIPPETS = {}

SNIPPETS["w1c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34500)
n_paths, n_flips = 200_000, 20
steps = rng.choice([-1, 1], size=(n_paths, n_flips))
paths = np.cumsum(steps, axis=1)
s8 = paths[:, 7]
s20 = paths[:, 19]
for v in [-4, 0, 4]:
    mask = s8 == v
    print(f"E[S20 | S8={v:+d}] = {s20[mask].mean():+.3f}   (n={mask.sum()})")
print(f"\ncheck: E[S20|S8=v] should equal v -- max abs gap over these three:",
      round(float(max(abs(s20[s8==v].mean()-v) for v in [-4,0,4])), 3))
'''

SNIPPETS["w1c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34501)
n_paths, n_steps = 100_000, 50
for p, label in [(0.5, "fair (p=0.5): martingale"), (0.55, "biased up (p=0.55): submartingale"), (0.45, "biased down (p=0.45): supermartingale")]:
    steps = np.where(rng.random((n_paths, n_steps)) < p, 1, -1)
    paths = np.cumsum(steps, axis=1)
    s10, s11 = paths[:, 9], paths[:, 10]
    print(f"{label:38s}  E[S11-S10] = {(s11-s10).mean():+.4f}")
'''

SNIPPETS["w1c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34502)
a, b = 4, 6
n_trials = 300_000
theoretical = a / (a + b)
hit_upper = 0
max_steps = 5000
pos = np.zeros(n_trials, dtype=np.int64)
alive = np.ones(n_trials, dtype=bool)
ruin_up = np.zeros(n_trials, dtype=bool)
for _ in range(max_steps):
    if not alive.any():
        break
    step = np.where(rng.random(n_trials) < 0.5, 1, -1)
    pos[alive] += step[alive]
    newly_up = alive & (pos >= b)
    newly_dn = alive & (pos <= -a)
    ruin_up[newly_up] = True
    alive[newly_up | newly_dn] = False
sim = ruin_up.mean()
print(f"gambler's ruin: start at 0, absorbing at +{b} and -{a}")
print(f"martingale (optional stopping) formula  P(hit +{b} first) = a/(a+b) = {theoretical:.4f}")
print(f"simulated P(hit +{b} first) over {n_trials} trials      = {sim:.4f}")
print(f"still undecided after {max_steps} steps: {alive.sum()}")
'''

SNIPPETS["w1c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34503)
n_paths, n_flips = 100_000, 15
bets = rng.choice([-1, 1], size=(n_paths, n_flips))
wealth = np.zeros(n_paths)
stake = np.ones(n_paths)
losing_streak = np.zeros(n_paths, dtype=int)
for t in range(n_flips):
    outcome = bets[:, t]
    wealth += stake * outcome
    lost = outcome < 0
    stake = np.where(lost, stake * 2, 1.0)
print(f"martingale-transform (double-after-loss) strategy over {n_flips} fair coin flips, {n_paths} paths")
print(f"mean final wealth:  {wealth.mean():+.4f}   (fair game: should be ~0)")
print(f"std of final wealth: {wealth.std():.3f}")
print(f"max final wealth observed: {wealth.max():.1f}   min: {wealth.min():.1f}")
'''

SNIPPETS["w2c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34510)
T = 1.0
for n in [10, 100, 1000, 10000]:
    dt = T / n
    n_paths = 20000
    steps = rng.choice([-1.0, 1.0], size=(n_paths, n)) * np.sqrt(dt)
    B1 = steps.sum(axis=1)
    print(f"n={n:6d} steps  Var(B_1) = {B1.var():.4f}   (target: 1.0000)")
'''

SNIPPETS["w2c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34511)
n_paths, n, T = 50000, 1000, 1.0
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
inc1 = dB[:, 100:300].sum(axis=1)
inc2 = dB[:, 300:600].sum(axis=1)
inc3 = dB[:, 600:900].sum(axis=1)
corr12 = np.corrcoef(inc1, inc2)[0, 1]
corr23 = np.corrcoef(inc2, inc3)[0, 1]
print(f"corr(increment over [0.10,0.30], increment over [0.30,0.60]) = {corr12:+.4f}")
print(f"corr(increment over [0.30,0.60], increment over [0.60,0.90]) = {corr23:+.4f}")
print("both should be ~0: disjoint Brownian increments are independent")
'''

SNIPPETS["w2c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34512)
T = 2.0
n_paths = 5000
for n in [50, 500, 5000, 50000]:
    dt = T / n
    dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
    qv = (dB ** 2).sum(axis=1)
    print(f"n={n:6d} partition points  mean quadratic variation = {qv.mean():.4f}  (target: T={T})  std across paths = {qv.std():.4f}")
'''

SNIPPETS["w2c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34513)
n_paths = 20000
T = 1.0
for h in [0.1, 0.01, 0.001, 0.0001]:
    dB = rng.normal(scale=np.sqrt(h), size=n_paths)
    ratio = dB / h
    print(f"h={h:<8g}  typical |B(t+h)-B(t)|/h = {np.abs(ratio).mean():10.3f}   (1/sqrt(h) = {1/np.sqrt(h):10.3f})")
'''

SNIPPETS["w3c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34520)
n_paths, n, T = 40000, 4000, 1.0
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
B = np.concatenate([np.zeros((n_paths, 1)), np.cumsum(dB, axis=1)], axis=1)
left_sum = (B[:, :-1] * dB).sum(axis=1)
B_T = B[:, -1]
ito_formula_value = 0.5 * (B_T ** 2 - T)
print("Ito integral of B dB via left-endpoint Riemann sums, n=%d steps" % n)
print(f"mean of left-endpoint sum:            {left_sum.mean():+.5f}")
print(f"mean of (B_T^2 - T)/2 [Ito's answer]: {ito_formula_value.mean():+.5f}")
print(f"mean |sum - (B_T^2-T)/2| (should -> 0 as n grows): {np.abs(left_sum - ito_formula_value).mean():.5f}")
'''

SNIPPETS["w3c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34521)
n_paths, n, T = 40000, 2000, 1.0
dt = T / n
t_grid = np.linspace(0, T, n, endpoint=False)
f = t_grid  # integrand f(t) = t
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
I = (f[None, :] * dB).sum(axis=1)
theory_var = float((f ** 2).sum() * dt)  # integral of f(t)^2 dt = T^3/3
print(f"Ito integral of f(t)=t against dB_t, T={T}")
print(f"simulated Var(I) = {I.var():.5f}")
print(f"Ito isometry E[I^2] = integral f^2 dt = {theory_var:.5f}  (closed form T^3/3 = {T**3/3:.5f})")
print(f"simulated E[I] = {I.mean():+.5f}  (should be ~0)")
'''

SNIPPETS["w3c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34522)
n_paths, n, T = 30000, 1000, 1.0
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
B = np.concatenate([np.zeros((n_paths, 1)), np.cumsum(dB, axis=1)], axis=1)
running_ito = np.cumsum(B[:, :-1] * dB, axis=1)  # I_t at each grid time
s_idx, t_idx = n // 4, n // 2
I_s = running_ito[:, s_idx]
I_t = running_ito[:, t_idx]
print(f"running Ito integral I_t = int_0^t B dB, checked at s=t/2 (index {s_idx}) and t (index {t_idx})")
print(f"E[I_s] = {I_s.mean():+.5f}   E[I_t] = {I_t.mean():+.5f}   (martingale: both should be ~0)")
bucket = np.digitize(I_s, np.quantile(I_s, [0.2, 0.4, 0.6, 0.8]))
for b in range(5):
    m = bucket == b
    print(f"  bucket by I_s (n={m.sum():5d}): E[I_s|bucket]={I_s[m].mean():+.3f}  E[I_t|bucket]={I_t[m].mean():+.3f}")
'''

SNIPPETS["w3c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34523)
n_paths, n, T = 40000, 4000, 1.0
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
B = np.concatenate([np.zeros((n_paths, 1)), np.cumsum(dB, axis=1)], axis=1)
left_sum = (B[:, :-1] * dB).sum(axis=1)
right_sum = (B[:, 1:] * dB).sum(axis=1)
mid_sum = (0.5 * (B[:, :-1] + B[:, 1:]) * dB).sum(axis=1)
B_T = B[:, -1]
print("three Riemann-sum conventions for the SAME stochastic integral of B dB (n=%d steps):" % n)
print(f"  left-endpoint  mean = {left_sum.mean():+.4f}   (Ito's answer:        (B_T^2-T)/2 = {(B_T**2-T).mean()/2:+.4f})")
print(f"  right-endpoint mean = {right_sum.mean():+.4f}   (should be near        (B_T^2+T)/2 = {(B_T**2+T).mean()/2:+.4f})")
print(f"  midpoint       mean = {mid_sum.mean():+.4f}   (Stratonovich's answer: B_T^2/2      = {(B_T**2).mean()/2:+.4f})")
'''

SNIPPETS["w4c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34530)
n_paths, n, T = 40000, 4000, 1.0
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
B = np.concatenate([np.zeros((n_paths, 1)), np.cumsum(dB, axis=1)], axis=1)
lhs = B[:, -1] ** 2
ito_integral = 2 * (B[:, :-1] * dB).sum(axis=1)
rhs = ito_integral + T
print("Ito's formula check on f(x)=x^2: B_T^2  vs  2*int_0^T B dB + T")
print(f"mean B_T^2                    = {lhs.mean():.5f}")
print(f"mean [2*int B dB + T]         = {rhs.mean():.5f}")
print(f"mean |difference| across paths = {np.abs(lhs-rhs).mean():.5f}")
'''

SNIPPETS["w4c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34531)
S0, mu, sigma, T, n = 100.0, 0.08, 0.25, 1.0, 2000
n_paths = 60000
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
S_euler = np.full(n_paths, S0)
for i in range(n):
    S_euler = S_euler + mu * S_euler * dt + sigma * S_euler * dB[:, i]
B_T = dB.sum(axis=1)
S_closed = S0 * np.exp((mu - 0.5 * sigma ** 2) * T + sigma * B_T)
print(f"GBM at T={T}: Euler-discretized SDE vs Ito's-formula closed form, {n_paths} paths, n={n} steps")
print(f"  Euler   mean={S_euler.mean():8.3f}  std={S_euler.std():7.3f}")
print(f"  closed  mean={S_closed.mean():8.3f}  std={S_closed.std():7.3f}")
theory_mean = S0 * np.exp(mu * T)
print(f"  theory E[S_T] = S0*exp(mu*T) = {theory_mean:.3f}")
'''

SNIPPETS["w4c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34532)
n_paths, n, T, rho = 50000, 2000, 1.0, 0.4
dt = T / n
z1 = rng.normal(size=(n_paths, n))
z2 = rng.normal(size=(n_paths, n))
dB1 = z1 * np.sqrt(dt)
dB2 = (rho * z1 + np.sqrt(1 - rho ** 2) * z2) * np.sqrt(dt)
B1_T = dB1.sum(axis=1)
B2_T = dB2.sum(axis=1)
covariation = (dB1 * dB2).sum(axis=1)
print(f"two correlated Brownian motions, target correlation rho={rho}, T={T}")
print(f"E[B1_T * B2_T]                 = {(B1_T*B2_T).mean():+.4f}   (product-rule prediction rho*T = {rho*T:+.4f})")
print(f"quadratic covariation <B1,B2>_T = {covariation.mean():+.4f}   (should match rho*T)")
'''

SNIPPETS["w4c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34533)
n_paths, n = 50000, 2000
dt_grid_T = [(2000, 1.0), (2000, 3.0)]
for n, T in dt_grid_T:
    dt = T / n
    dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
    B_t = np.concatenate([np.zeros((n_paths,1)), np.cumsum(dB, axis=1)], axis=1)
    t_grid = np.linspace(0, T, n+1)
    M = np.exp(B_t - 0.5 * t_grid[None, :])
    print(f"exponential martingale M_t = exp(B_t - t/2), T={T}: E[M_T] = {M[:, -1].mean():.4f}  (should be 1.0000)")
    checkpoints = [n//4, n//2, 3*n//4, n]
    print("  E[M_t] at t =", [round(float(t_grid[c]),2) for c in checkpoints], "->",
          [round(float(M[:, c].mean()),4) for c in checkpoints])
'''

SNIPPETS["w5c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34540)
theta, mu, sigma, T, n = 2.0, 0.5, 0.6, 5.0, 5000
n_paths = 40000
dt = T / n
X = np.zeros(n_paths)
burn = int(0.5 * n)
for i in range(n):
    dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
    X = X + theta * (mu - X) * dt + sigma * dB
stationary_var = sigma ** 2 / (2 * theta)
print(f"OU process dX = theta(mu-X)dt + sigma dB, theta={theta}, mu={mu}, sigma={sigma}, T={T}")
print(f"simulated E[X_T]  = {X.mean():.4f}   (target mu = {mu})")
print(f"simulated Var[X_T] = {X.var():.4f}   (target sigma^2/(2 theta) = {stationary_var:.4f})")
'''

SNIPPETS["w5c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34541)
T, n = 2.0, 2000
n_paths = 8000
dt = T / n
eps = 1e-6
X_lip = np.full(n_paths, 1.0)
X_lip_pert = np.full(n_paths, 1.0 + eps)
X_nonlip = np.full(n_paths, 0.001)
X_nonlip_pert = np.full(n_paths, 0.001 + eps)
for i in range(n):
    dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
    X_lip = X_lip + 0.3*X_lip*dt + 0.4*X_lip*dB
    X_lip_pert = X_lip_pert + 0.3*X_lip_pert*dt + 0.4*X_lip_pert*dB
    X_nonlip = X_nonlip + np.sign(X_nonlip) * np.abs(X_nonlip)**(1/3) * dB
    X_nonlip_pert = X_nonlip_pert + np.sign(X_nonlip_pert) * np.abs(X_nonlip_pert)**(1/3) * dB
gap_lip = np.abs(X_lip - X_lip_pert).mean()
gap_nonlip = np.abs(X_nonlip - X_nonlip_pert).mean()
print(f"sensitivity to a {eps:g} perturbation in X_0, same Brownian path, over T={T}:")
print(f"  Lipschitz coefficients (dX=0.3 X dt + 0.4 X dB):        mean |gap at T| = {gap_lip:.6f}")
print(f"  non-Lipschitz coefficients (dX = X^(1/3) dB near 0):    mean |gap at T| = {gap_nonlip:.6f}")
print(f"  ratio (non-Lipschitz / Lipschitz): {gap_nonlip/gap_lip:.2f}x")
'''

SNIPPETS["w5c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34542)
S0, mu, sigma, T = 100.0, 0.05, 0.3, 1.0
n_paths = 20000
n_fine = 8000
dt_fine = T / n_fine
dB_fine = rng.normal(scale=np.sqrt(dt_fine), size=(n_paths, n_fine))
B_T = dB_fine.sum(axis=1)
S_exact = S0 * np.exp((mu - 0.5*sigma**2)*T + sigma*B_T)
for coarse_steps in [8000, 800, 200, 50]:
    group = n_fine // coarse_steps
    dB_coarse = dB_fine.reshape(n_paths, coarse_steps, group).sum(axis=2)
    dt_coarse = T / coarse_steps
    S = np.full(n_paths, S0)
    for i in range(coarse_steps):
        S = S + mu*S*dt_coarse + sigma*S*dB_coarse[:, i]
    err = np.abs(S - S_exact).mean()
    print(f"n={coarse_steps:5d} Euler steps (dt={dt_coarse:.5f})  mean |S_euler-S_exact| = {err:7.4f}   err/sqrt(dt) = {err/np.sqrt(dt_coarse):7.4f}")
'''

SNIPPETS["w5c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34543)
n_paths, n, T, rho = 30000, 1500, 1.0, -0.5
dt = T / n
S0_1, S0_2, mu1, mu2, sig1, sig2 = 100.0, 50.0, 0.06, 0.04, 0.25, 0.35
z1 = rng.normal(size=(n_paths, n))
z2 = rng.normal(size=(n_paths, n))
dB1 = z1 * np.sqrt(dt)
dB2 = (rho*z1 + np.sqrt(1-rho**2)*z2) * np.sqrt(dt)
S1, S2 = np.full(n_paths, S0_1), np.full(n_paths, S0_2)
for i in range(n):
    S1 = S1 + mu1*S1*dt + sig1*S1*dB1[:, i]
    S2 = S2 + mu2*S2*dt + sig2*S2*dB2[:, i]
r1 = np.log(S1/S0_1)
r2 = np.log(S2/S0_2)
realized_corr = np.corrcoef(r1, r2)[0, 1]
print(f"two correlated GBMs simulated jointly via Cholesky mixing, target log-return correlation rho={rho}")
print(f"realized correlation of log(S1_T/S0_1), log(S2_T/S0_2) over {n_paths} paths: {realized_corr:+.4f}")
'''

SNIPPETS["w6c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34550)
T = 0.5
x0 = 1.0
def f(x):
    return x ** 2
n_paths = 200000
BT = rng.normal(scale=np.sqrt(T), size=n_paths)
mc_u = f(x0 + BT).mean()
closed_form_u = x0 ** 2 + T  # E[(x0+B_T)^2] = x0^2 + T
print(f"Feynman-Kac / heat equation: u(0,x0)=E[f(x0+B_T)] for f(x)=x^2, x0={x0}, T={T}")
print(f"Monte Carlo estimate: {mc_u:.4f}")
print(f"closed form x0^2 + T: {closed_form_u:.4f}")
'''

SNIPPETS["w6c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34551)
S0, r, sigma, T, K = 100.0, 0.04, 0.25, 1.0, 105.0
n_paths = 400000
BT = rng.normal(scale=np.sqrt(T), size=n_paths)
S_T = S0 * np.exp((r - 0.5*sigma**2)*T + sigma*BT)
payoff = np.maximum(S_T - K, 0.0)
mc_price = np.exp(-r*T) * payoff.mean()
mc_se = np.exp(-r*T) * payoff.std() / np.sqrt(n_paths)

from math import log, sqrt, exp
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))
d1 = (log(S0/K) + (r+0.5*sigma**2)*T) / (sigma*sqrt(T))
d2 = d1 - sigma*sqrt(T)
bs_price = S0*norm_cdf(d1) - K*exp(-r*T)*norm_cdf(d2)
print(f"Feynman-Kac Monte Carlo price of a European call: {mc_price:.4f}  (s.e. {mc_se:.4f})")
print(f"Black-Scholes closed form:                        {bs_price:.4f}")
print(f"gap in standard errors: {abs(mc_price-bs_price)/mc_se:.2f}")
'''

SNIPPETS["w6c3"] = r'''
import numpy as np
np.seterr(all="ignore")
T, x0, sigma, r = 1.0, 1.0, 0.4, 0.05
L, n_x = 5.0, 101
dx = 2*L / (n_x - 1)
x_grid = np.linspace(-L, L, n_x)
dtau = 0.4 * dx**2 / sigma**2   # explicit stability: dtau*0.5*sigma^2/dx^2 <= 0.5
n_steps = int(round(T / dtau))
dtau = T / n_steps
u = x_grid ** 2          # u(x, tau=0) = f(x) = x^2, tau = T - t
for step in range(n_steps):
    tau_new = (step + 1) * dtau
    lap = np.empty_like(u)
    lap[1:-1] = (u[2:] - 2*u[1:-1] + u[:-2]) / dx**2
    u_new = u + dtau * (0.5 * sigma**2 * lap - r * u)
    u_new[0] = np.exp(-r*tau_new) * ((-L)**2 + sigma**2*tau_new)   # exact solution as Dirichlet boundary
    u_new[-1] = np.exp(-r*tau_new) * (L**2 + sigma**2*tau_new)
    u = u_new
idx = np.argmin(np.abs(x_grid - x0))
fd_value = u[idx]

rng = np.random.default_rng(34552)
n_paths = 300000
BT = rng.normal(scale=np.sqrt(T), size=n_paths)
mc_value = np.exp(-r*T) * ((x0 + sigma*BT) ** 2).mean()
closed_form = np.exp(-r*T) * (x0 ** 2 + sigma**2 * T)
print(f"Feynman-Kac with a discount (killing) rate: u_tau = 0.5 sigma^2 u_xx - r u, u(x,0)=x^2")
print(f"evaluated at x0={x0}, tau=T={T}, sigma={sigma}, r={r} (n_steps={n_steps}, dx={dx:.3f})")
print(f"finite-difference PDE grid value:  {fd_value:.4f}")
print(f"Monte Carlo e^(-rT) E[(x0+sigma B_T)^2]: {mc_value:.4f}")
print(f"closed form e^(-rT)(x0^2 + sigma^2 T):    {closed_form:.4f}")
'''

SNIPPETS["w6c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34553)
S0, r, sigma, T, K = 100.0, 0.03, 0.25, 1.0, 100.0
from math import log, sqrt, exp
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))
d1 = (log(S0/K) + (r+0.5*sigma**2)*T) / (sigma*sqrt(T))
d2 = d1 - sigma*sqrt(T)
bs_price = S0*norm_cdf(d1) - K*exp(-r*T)*norm_cdf(d2)
for n_paths in [1000, 10000, 100000, 1000000]:
    BT = rng.normal(scale=np.sqrt(T), size=n_paths)
    S_T = S0*np.exp((r-0.5*sigma**2)*T + sigma*BT)
    payoff = np.maximum(S_T-K, 0.0)
    mc = np.exp(-r*T)*payoff.mean()
    se = np.exp(-r*T)*payoff.std()/np.sqrt(n_paths)
    print(f"n_paths={n_paths:8d}  MC price={mc:7.4f}  s.e.={se:.4f}   |MC-BS|={abs(mc-bs_price):.4f}  ({abs(mc-bs_price)/se:.2f} s.e.)")
print(f"Black-Scholes closed form: {bs_price:.4f}")
'''

SNIPPETS["w7c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34560)
T, theta = 1.0, 0.6
n_paths = 300000
BT = rng.normal(scale=np.sqrt(T), size=n_paths)
def indicator(x):
    return (x > 0.5).astype(float)
direct_Q_mean = None
BT_shift = rng.normal(loc=theta*T, scale=np.sqrt(T), size=n_paths)
direct_Q = indicator(BT_shift).mean()
RN = np.exp(theta*BT - 0.5*theta**2*T)
reweighted = (indicator(BT) * RN).mean()
print(f"E^Q[1(B_T>0.5)] two ways, Q defined by Radon-Nikodym derivative exp(theta B_T - theta^2 T/2), theta={theta}")
print(f"direct simulation under Q (B_T ~ N(theta*T, T)):     {direct_Q:.4f}")
print(f"reweighting a P-simulation by the RN derivative:      {reweighted:.4f}")
'''

SNIPPETS["w7c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34561)
T, theta, n = 1.0, 0.6, 500
n_paths = 200000
dt = T / n
dB = rng.normal(scale=np.sqrt(dt), size=(n_paths, n))
B = np.cumsum(dB, axis=1)
RN_T = np.exp(theta*B[:, -1] - 0.5*theta**2*T)
W_shift = B[:, -1] - theta*T  # candidate Q-Brownian motion at T
w = RN_T / RN_T.mean()
Q_mean = (W_shift * w).mean()
Q_var = ((W_shift - Q_mean)**2 * w).mean()
print(f"Girsanov: is W_t = B_t - theta*t a Q-Brownian motion? checking W_T under the RN-reweighted measure")
print(f"E^Q[W_T]   = {Q_mean:+.4f}   (should be ~0)")
print(f"Var^Q[W_T] = {Q_var:.4f}    (should be ~T={T})")
'''

SNIPPETS["w7c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34562)
T = 1.0
n_paths = 200000
for theta in [0.5, 2.0, 5.0, 8.0]:
    BT = rng.normal(scale=np.sqrt(T), size=n_paths)
    RN = np.exp(theta*BT - 0.5*theta**2*T)
    novikov = np.exp(0.5*theta**2*T)  # E[exp(.5 theta^2 T)] closed form under P
    ess = (RN.sum())**2 / (RN**2).sum()  # effective sample size
    print(f"theta={theta:4.1f}  E[exp(.5 theta^2 T)]={novikov:12.2f}   weight std/mean={RN.std()/RN.mean():8.2f}   effective sample size={ess:9.1f} / {n_paths}")
'''

SNIPPETS["w7c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34563)
S0, mu, r, sigma, T = 100.0, 0.12, 0.03, 0.25, 1.0
theta = (mu - r) / sigma
n_paths = 300000
BT_P = rng.normal(scale=np.sqrt(T), size=n_paths)
S_T = S0*np.exp((mu-0.5*sigma**2)*T + sigma*BT_P)
RN = np.exp(-theta*BT_P - 0.5*theta**2*T)  # dQ/dP so that B^Q_t = B_t + theta t
disc_ST = np.exp(-r*T) * S_T
print(f"real-world drift mu={mu}, risk-free r={r}, market price of risk theta=(mu-r)/sigma={theta:.4f}")
print(f"E^P[discounted S_T]            = {disc_ST.mean():.4f}   (not a martingale under P: != S0={S0})")
print(f"E^Q[discounted S_T] (reweighted) = {(disc_ST*RN).mean():.4f}   (should be ~S0={S0}: risk-neutral martingale)")
'''

SNIPPETS["w8c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34570)
S0, r, sigma, T, K = 100.0, 0.03, 0.25, 1.0, 100.0
from math import log, sqrt, exp
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))
def bs_call(S, t_remaining):
    if t_remaining <= 1e-8:
        return np.maximum(S-K, 0.0), (S > K).astype(float)
    d1 = (np.log(S/K) + (r+0.5*sigma**2)*t_remaining) / (sigma*np.sqrt(t_remaining))
    d2 = d1 - sigma*np.sqrt(t_remaining)
    price = S*norm_cdf(d1) - K*exp(-r*t_remaining)*norm_cdf(d2)
    delta = norm_cdf(d1)
    return price, delta

n_paths = 20000
for n_rebal in [12, 52, 252]:
    dt = T / n_rebal
    S = np.full(n_paths, S0)
    price0, delta0 = bs_call(S, T)
    cash = price0 - delta0*S
    delta = delta0
    for i in range(n_rebal):
        t_left = T - (i+1)*dt
        dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
        S = S + r*S*dt + sigma*S*dB
        cash = cash*np.exp(r*dt)
        if i < n_rebal - 1:
            _, new_delta = bs_call(S, t_left)
        else:
            new_delta = (S > K).astype(float)
        cash -= (new_delta - delta)*S
        delta = new_delta
    payoff = np.maximum(S - K, 0.0)
    hedge_value = cash + delta*S
    hedge_error = hedge_value - payoff
    print(f"rebalance {n_rebal:4d}x over T={T}: mean hedge error={hedge_error.mean():+.4f}  std hedge error={hedge_error.std():.4f}")
'''

SNIPPETS["w8c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34571)
S0, r, sigma, T, K = 100.0, 0.03, 0.25, 1.0, 100.0
from math import log, sqrt, exp
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))
d1 = (log(S0/K)+(r+0.5*sigma**2)*T)/(sigma*sqrt(T)); d2 = d1-sigma*sqrt(T)
bs = S0*norm_cdf(d1) - K*exp(-r*T)*norm_cdf(d2)
ns = [10**3, 10**4, 10**5, 10**6]
prev_se = None
for n in ns:
    BT = rng.normal(scale=np.sqrt(T), size=n)
    S_T = S0*np.exp((r-0.5*sigma**2)*T + sigma*BT)
    payoff = np.exp(-r*T)*np.maximum(S_T-K, 0.0)
    se = payoff.std()/np.sqrt(n)
    ratio = "" if prev_se is None else f"  (ratio to previous s.e.: {prev_se/se:.2f}, sqrt(10)={np.sqrt(10):.2f})"
    print(f"n={n:8d}  price={payoff.mean():.4f}  s.e.={se:.5f}{ratio}")
    prev_se = se
print(f"Black-Scholes closed form: {bs:.4f}")
'''

SNIPPETS["w8c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34572)
S0, r, sigma, T, K = 100.0, 0.03, 0.25, 1.0, 100.0
from math import log, sqrt
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))
n, n_paths = 500, 100000
dt = T/n
S = np.full(n_paths, S0)
disc_V = None
d1 = (log(S0/K)+(r+0.5*sigma**2)*T)/(sigma*sqrt(T))
V0 = S0*norm_cdf(d1) - K*np.exp(-r*T)*norm_cdf(d1-sigma*sqrt(T))
V_path = np.full(n_paths, V0)
half = n // 2
for i in range(n):
    t_left = T - i*dt
    if t_left > 1e-6:
        d1t = (np.log(S/K)+(r+0.5*sigma**2)*t_left)/(sigma*np.sqrt(t_left))
        delta_t = norm_cdf(d1t)
    else:
        delta_t = (S > K).astype(float)
    if i == half:
        S_before, V_before, delta_before = S.copy(), None, delta_t.copy()
        V_before_val = (S*norm_cdf(d1t) - K*np.exp(-r*t_left)*norm_cdf(d1t-sigma*np.sqrt(t_left))) if t_left>1e-6 else np.maximum(S-K,0)
    dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
    S_new = S + r*S*dt + sigma*S*dB
    if i == half:
        t_left_new = T - (i+1)*dt
        if t_left_new > 1e-6:
            d1n = (np.log(S_new/K)+(r+0.5*sigma**2)*t_left_new)/(sigma*np.sqrt(t_left_new))
            V_after_val = S_new*norm_cdf(d1n) - K*np.exp(-r*t_left_new)*norm_cdf(d1n-sigma*np.sqrt(t_left_new))
        else:
            V_after_val = np.maximum(S_new-K, 0.0)
        dV = V_after_val - V_before_val
        dS_disc = np.exp(-r*t_left_new)*S_new - np.exp(-r*t_left)*S_before
    S = S_new

slope = np.polyfit(dS_disc, dV, 1)[0]
print("martingale representation check at the midpoint of a hedged option's life:")
print(f"regression slope of dV on d(discounted S) over one step: {slope:.4f}")
print(f"Black-Scholes delta at that instant (average across paths): {delta_before.mean():.4f}")
'''

SNIPPETS["w8c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34573)
S0, r, sigma, T, K = 100.0, 0.03, 0.25, 1.0, 100.0
from math import log, sqrt
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))
d1 = (log(S0/K)+(r+0.5*sigma**2)*T)/(sigma*sqrt(T))
bs_delta = norm_cdf(d1)

n_paths = 200000
h = 0.5
BT = rng.normal(scale=np.sqrt(T), size=n_paths)
def price(S0_):
    S_T = S0_*np.exp((r-0.5*sigma**2)*T + sigma*BT)
    return np.exp(-r*T)*np.maximum(S_T-K, 0.0)
bump = (price(S0+h) - price(S0-h)) / (2*h)
S_T = S0*np.exp((r-0.5*sigma**2)*T + sigma*BT)
pathwise = np.exp(-r*T) * (S_T/S0) * (S_T > K).astype(float)
print(f"Black-Scholes closed-form delta: {bs_delta:.4f}")
print(f"bump-and-reprice (finite difference) estimator: mean={bump.mean():.4f}  std={bump.std():.4f}")
print(f"pathwise-derivative estimator:                   mean={pathwise.mean():.4f}  std={pathwise.std():.4f}")
print(f"pathwise/bump std ratio: {pathwise.std()/bump.std():.3f}")
'''

SNIPPETS["w9c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34580)
lam, T = 3.0, 4.0
n_trials = 100000
counts = np.zeros(n_trials, dtype=int)
for i in range(n_trials):
    t = 0.0
    c = 0
    while True:
        t += rng.exponential(1/lam)
        if t > T:
            break
        c += 1
    counts[i] = c
print(f"Poisson process, rate lambda={lam}, horizon T={T}: N_T built from i.i.d. Exp(lambda) gaps")
print(f"simulated mean N_T = {counts.mean():.4f}   (target lambda*T = {lam*T})")
print(f"simulated var N_T  = {counts.var():.4f}   (target lambda*T = {lam*T})")
'''

SNIPPETS["w9c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34581)
lam, T = 5.0, 2.0
jump_mean, jump_sd = 0.02, 0.05
n_paths = 200000
N_T = rng.poisson(lam*T, size=n_paths)
max_n = N_T.max()
jumps = rng.normal(jump_mean, jump_sd, size=(n_paths, max_n))
mask = np.arange(max_n)[None, :] < N_T[:, None]
Y_T = (jumps * mask).sum(axis=1)
theory_mean = lam*T*jump_mean
theory_var = lam*T*(jump_sd**2 + jump_mean**2)
print(f"compound Poisson process Y_T = sum of N_T jumps, lambda={lam}, T={T}, jump~N({jump_mean},{jump_sd}^2)")
print(f"simulated mean Y_T = {Y_T.mean():.5f}   (theory lambda*T*E[J] = {theory_mean:.5f})")
print(f"simulated var  Y_T = {Y_T.var():.5f}   (theory lambda*T*E[J^2] = {theory_var:.5f})")
'''

SNIPPETS["w9c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34582)
S0, r, sigma, T, n = 100.0, 0.03, 0.2, 1.0, 1000
lam, jm, jsd = 1.0, -0.05, 0.1
n_paths = 100000
dt = T/n
kappa = np.exp(jm + 0.5*jsd**2) - 1  # E[e^J - 1]
comp_drift = r - lam*kappa  # compensated drift so that E[S_T] = S0*exp(r*T)
S = np.full(n_paths, S0)
logS = np.log(S)
for i in range(n):
    dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
    dN = rng.poisson(lam*dt, size=n_paths)
    J = np.where(dN > 0, rng.normal(jm, jsd, size=n_paths), 0.0)
    logS = logS + (comp_drift - 0.5*sigma**2)*dt + sigma*dB + J
S_T = np.exp(logS)
print(f"Merton jump-diffusion, compensated so drift = r - lambda*E[e^J-1], r={r}, lambda={lam}")
print(f"simulated E[S_T]        = {S_T.mean():.3f}")
print(f"theory S0*exp(r*T)      = {S0*np.exp(r*T):.3f}   (should match: compensation removes the jump bias)")
'''

SNIPPETS["w9c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34583)
T, n, sigma, lam, jsd, jm = 1.0, 2000, 0.3, 4.0, 0.08, 0.0
n_paths = 20000
dt = T/n
qv_diffusive = np.zeros(n_paths)
qv_jump = np.zeros(n_paths)
for i in range(n):
    dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
    qv_diffusive += (sigma*dB)**2
    dN = rng.poisson(lam*dt, size=n_paths)
    J = np.where(dN > 0, rng.normal(jm, jsd, size=n_paths), 0.0)
    qv_jump += J**2
total_qv = qv_diffusive + qv_jump
print(f"quadratic variation of a jump-diffusion, decomposed into its two sources, T={T}")
print(f"continuous part  mean = {qv_diffusive.mean():.5f}   (theory sigma^2*T = {sigma**2*T:.5f})")
print(f"jump part        mean = {qv_jump.mean():.5f}   (theory lambda*T*E[J^2] = {lam*T*(jsd**2+jm**2):.5f})")
print(f"total  [X,X]_T   mean = {total_qv.mean():.5f}")
'''

SNIPPETS["w10c1"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34590)
T, sigma, lam, jm, jsd = 1.0, 0.2, 2.0, -0.03, 0.1
n_paths = 300000
BT = rng.normal(scale=np.sqrt(T), size=n_paths)
N_T = rng.poisson(lam*T, size=n_paths)
maxn = N_T.max()
jumps = rng.normal(jm, jsd, size=(n_paths, maxn))
mask = np.arange(maxn)[None, :] < N_T[:, None]
Y_T = sigma*BT + (jumps*mask).sum(axis=1)
def levy_khintchine_logcf(u):
    diffusion = -0.5*sigma**2*u**2*T
    jump = lam*T*(np.exp(1j*u*jm - 0.5*jsd**2*u**2) - 1)
    return diffusion + jump
for u in [0.5, 1.0, 2.0]:
    emp_cf = np.mean(np.exp(1j*u*Y_T))
    theory_cf = np.exp(levy_khintchine_logcf(u))
    print(f"u={u:.1f}  empirical char. fn. = {emp_cf.real:+.4f}{emp_cf.imag:+.4f}j   Levy-Khintchine = {theory_cf.real:+.4f}{theory_cf.imag:+.4f}j")
'''

SNIPPETS["w10c2"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34591)
T, sigma = 1.0, 0.2
lam, jm, jsd = 1.0, -0.05, 0.15
n_paths = 500000
gauss = rng.normal(scale=sigma*np.sqrt(T), size=n_paths)
N_T = rng.poisson(lam*T, size=n_paths)
maxn = max(N_T.max(), 1)
jumps = rng.normal(jm, jsd, size=(n_paths, maxn))
mask = np.arange(maxn)[None, :] < N_T[:, None]
jump_part = (jumps*mask).sum(axis=1)
jd = sigma*rng.normal(scale=np.sqrt(T), size=n_paths) + jump_part
for thresh in [0.3, 0.5, 0.8]:
    p_gauss = (np.abs(gauss) > thresh).mean()
    p_jd = (np.abs(jd) > thresh).mean()
    print(f"P(|log-return| > {thresh}):  pure diffusion = {p_gauss:.5f}   jump-diffusion = {p_jd:.5f}   ratio = {p_jd/max(p_gauss,1e-9):.2f}x")
'''

SNIPPETS["w10c3"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34592)
S0, r, T, K = 100.0, 0.03, 1.0, 100.0
sigma_full = 0.2
lam, jm, jsd = 1.0, -0.05, 0.15
sigma_diffusion_only = np.sqrt(sigma_full**2 + lam*(jsd**2+jm**2))  # variance-matched pure-diffusion vol
n_paths = 400000

from math import log, sqrt, exp
def norm_cdf(x):
    from scipy.special import erf
    return 0.5*(1+erf(np.asarray(x)/np.sqrt(2)))

def bs_price(sigma):
    d1 = (log(S0/K)+(r+0.5*sigma**2)*T)/(sigma*sqrt(T)); d2 = d1-sigma*sqrt(T)
    return S0*norm_cdf(d1) - K*exp(-r*T)*norm_cdf(d2)

BT = rng.normal(scale=np.sqrt(T), size=n_paths)
N_T = rng.poisson(lam*T, size=n_paths)
maxn = max(N_T.max(), 1)
jumps = rng.normal(jm, jsd, size=(n_paths, maxn))
mask = np.arange(maxn)[None, :] < N_T[:, None]
kappa = np.exp(jm+0.5*jsd**2) - 1
comp = r - lam*kappa
logS = np.log(S0) + (comp - 0.5*sigma_full**2)*T + sigma_full*BT + (jumps*mask).sum(axis=1)
S_T_jd = np.exp(logS)
jd_price = np.exp(-r*T)*np.maximum(S_T_jd-K, 0.0).mean()

correct_bs = bs_price(sigma_full)
mismatched_bs = bs_price(sigma_diffusion_only)
print(f"same option (K={K}, T={T}) priced three ways:")
print(f"  Black-Scholes at the diffusion-only vol {sigma_full}:            {correct_bs:.4f}  (wrong model for jump risk)")
print(f"  Merton jump-diffusion Monte Carlo:                        {jd_price:.4f}  (right model)")
print(f"  Black-Scholes at variance-matched vol {sigma_diffusion_only:.4f}:    {mismatched_bs:.4f}  (matches variance, not shape)")
'''

SNIPPETS["w10c4"] = r'''
import numpy as np
np.seterr(all="ignore")
rng = np.random.default_rng(34593)
T, n, sigma, lam, jsd, jm = 1.0, 1000, 0.25, 3.0, 0.09, 0.0
n_paths = 20000
dt = T/n
qv_bm_only = np.zeros(n_paths)
qv_jd = np.zeros(n_paths)
for i in range(n):
    dB = rng.normal(scale=np.sqrt(dt), size=n_paths)
    qv_bm_only += (sigma*dB)**2
    dN = rng.poisson(lam*dt, size=n_paths)
    J = np.where(dN > 0, rng.normal(jm, jsd, size=n_paths), 0.0)
    qv_jd += (sigma*dB)**2 + J**2
print("closing the loop: quadratic variation is the single object this course kept coming back to.")
print(f"pure Brownian motion [B,B]_T (scaled by sigma^2): mean = {qv_bm_only.mean():.5f}  (theory sigma^2*T = {sigma**2*T:.5f})")
print(f"same diffusion plus jumps  [X,X]_T:               mean = {qv_jd.mean():.5f}")
print(f"jump contribution alone (difference):             mean = {(qv_jd-qv_bm_only).mean():.5f}  (theory lambda*T*E[J^2] = {lam*T*(jsd**2+jm**2):.5f})")
'''

for k, src in SNIPPETS.items():
    print("="*20, k, "="*20)
    ns = {}
    try:
        exec(src, ns)
    except Exception as e:
        print("ERROR:", type(e).__name__, e)
