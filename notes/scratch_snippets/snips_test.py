#!/usr/bin/env python3
"""Test harness: run each candidate FINM 34700 snippet in a subprocess exactly
like tools/run_snippets.py does (capture stdout/stderr, fail on any stderr),
report timing, and print stdout so prose can be written to match it."""
import subprocess
import sys
import tempfile
import time
import os

SNIPPETS = {}

def snip(name):
    def deco(fn):
        SNIPPETS[name] = fn.__doc__
        return fn
    return deco

# ---------------------------------------------------------------- week 1 ----
SNIPPETS["w1c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34700)
p, n = 4, 2000
true_corr = np.array([
    [1.00, 0.70, 0.20, -0.10],
    [0.70, 1.00, 0.10, -0.05],
    [0.20, 0.10, 1.00, 0.60],
    [-0.10, -0.05, 0.60, 1.00],
])
sd = np.array([1.0, 1.5, 0.8, 2.0])
true_cov = true_corr * np.outer(sd, sd)
L = np.linalg.cholesky(true_cov)
X = rng.normal(size=(n, p)) @ L.T + np.array([0.0, 1.0, -0.5, 2.0])

mean_hat = X.mean(axis=0)
cov_hat = np.cov(X, rowvar=False)
sd_hat = np.sqrt(np.diag(cov_hat))
corr_hat = cov_hat / np.outer(sd_hat, sd_hat)

print(f"n = {n} observations, p = {p} variables\n")
print("sample mean:      ", np.round(mean_hat, 3))
print("true mean:         [ 0.    1.   -0.5   2.  ]\n")
print("sample correlation matrix:")
print(np.round(corr_hat, 2))
print("\nmax abs error vs true correlation:", round(float(np.max(np.abs(corr_hat - true_corr))), 3))
'''

SNIPPETS["w1c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34701)
p = 5
A = rng.normal(size=(p, p))
Sigma = A @ A.T / p

eigvals = np.linalg.eigvalsh(Sigma)
print("eigenvalues of Sigma (ascending):", np.round(eigvals, 4))
print("all eigenvalues >= 0:", bool(np.all(eigvals > -1e-10)))

w = rng.normal(size=p)
w = w / np.linalg.norm(w)
quad = w @ Sigma @ w
mc = rng.normal(size=(200000, p)) @ np.linalg.cholesky(Sigma).T
sample_var = np.var(mc @ w)
print(f"\nquadratic form w'Sigma w:      {quad:.5f}")
print(f"Monte Carlo variance of w'X:   {sample_var:.5f}")
'''

SNIPPETS["w1c3"] = r'''
import numpy as np
np.seterr(all="ignore")

mu = np.array([0.0, 0.0])
Sigma = np.array([[1.0, 0.9], [0.9, 1.0]])
Sigma_inv = np.linalg.inv(Sigma)

points = np.array([
    [2.0, 2.0],
    [2.0, -2.0],
    [0.0, 0.0],
])
labels = ["along the ridge (2,2)", "against the ridge (2,-2)", "at the mean (0,0)"]

for lbl, x in zip(labels, points):
    d = x - mu
    euclid = np.sqrt(d @ d)
    maha = np.sqrt(d @ Sigma_inv @ d)
    print(f"{lbl:28s}  Euclidean = {euclid:5.2f}   Mahalanobis = {maha:5.2f}")
'''

SNIPPETS["w1c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34703)
n = 60
results = []
for p in (5, 20, 40, 55):
    X = rng.normal(size=(n, p))
    S = np.cov(X, rowvar=False)
    eig = np.linalg.eigvalsh(S)
    results.append((p, eig.min(), eig.max(), np.linalg.cond(S)))

print(f"{'p':>4} {'n':>4} {'min eig':>10} {'max eig':>10} {'cond number':>14}")
for p, lo, hi, cond in results:
    print(f"{p:4d} {n:4d} {lo:10.3f} {hi:10.3f} {cond:14.1f}")
print("\ntrue covariance is the identity: every eigenvalue should be 1.0")
'''

# ---------------------------------------------------------------- week 2 ----
SNIPPETS["w2c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34710)
n, p = 3000, 6
loadings = np.array([1.0, 0.9, 0.8, -0.2, 0.1, 0.0])
factor = rng.normal(size=n)
noise = rng.normal(size=(n, p)) * 0.3
X = np.outer(factor, loadings) + noise
X = X - X.mean(axis=0)

S = np.cov(X, rowvar=False)
eigval, eigvec = np.linalg.eigh(S)
order = np.argsort(eigval)[::-1]
eigval, eigvec = eigval[order], eigvec[:, order]

var_explained = eigval / eigval.sum()
cos_sim = float(np.dot(eigvec[:, 0], loadings / np.linalg.norm(loadings)))
print("eigenvalues (largest first):", np.round(eigval, 3))
print("variance explained by PC1:  ", f"{var_explained[0]:.1%}")
print("\ncosine similarity between PC1 and the true factor direction:", round(abs(cos_sim), 3))
'''

SNIPPETS["w2c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34711)
n, p = 2000, 10
loadmat = np.array([[3.0,0,0,0.5,0.5,0,0,0,0,0],
                     [0,2.0,0.4,0,0,0.6,0,0,0,0],
                     [0,0,1.0,0,0,0,0.3,0.3,0,0]])
factors = rng.normal(size=(n, 3)) @ loadmat
noise = rng.normal(size=(n, p)) * 0.5
X = factors + noise
X = X - X.mean(axis=0)

S = np.cov(X, rowvar=False)
eigval = np.linalg.eigvalsh(S)[::-1]
cum = np.cumsum(eigval) / eigval.sum()

print(f"{'k':>3} {'eigenvalue':>12} {'cum. var. explained':>20}")
for k in range(1, p + 1):
    print(f"{k:3d} {eigval[k-1]:12.3f} {cum[k-1]:19.1%}")
'''

SNIPPETS["w2c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34712)
maturities = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30])
n = 2500

level = rng.normal(0, 1.0, n)
slope = rng.normal(0, 0.5, n)
curve = rng.normal(0, 0.3, n)

level_load = np.ones_like(maturities)
slope_load = (maturities - maturities.mean()) / maturities.std()
curve_load = slope_load**2 - np.mean(slope_load**2)

Y = (np.outer(level, level_load) + np.outer(slope, slope_load) + np.outer(curve, curve_load)
     + rng.normal(scale=0.05, size=(n, len(maturities))))
Y = Y - Y.mean(axis=0)

S = np.cov(Y, rowvar=False)
eigval, eigvec = np.linalg.eigh(S)
order = np.argsort(eigval)[::-1]
eigval, eigvec = eigval[order], eigvec[:, order]
var_explained = eigval / eigval.sum()

print("variance explained by the first three PCs:", np.round(var_explained[:3], 3))
print("\nPC1 loadings across maturities (should be roughly flat -- 'level'):")
print(np.round(eigvec[:, 0], 2))
print("\nPC2 loadings across maturities (should change sign once -- 'slope'):")
print(np.round(eigvec[:, 1], 2))
'''

SNIPPETS["w2c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34713)
n, p = 1500, 8
true_rank = 3
U = rng.normal(size=(n, true_rank))
V = rng.normal(size=(true_rank, p))
signal = U @ V
noise = rng.normal(size=(n, p)) * 0.4
X = signal + noise
X = X - X.mean(axis=0)

S = np.cov(X, rowvar=False)
eigval, eigvec = np.linalg.eigh(S)
order = np.argsort(eigval)[::-1]
eigval, eigvec = eigval[order], eigvec[:, order]

total_var = np.sum(X**2)
print(f"{'k':>3} {'reconstruction SSE':>20} {'fraction of variance kept':>28}")
for k in range(1, p + 1):
    Vk = eigvec[:, :k]
    scores = X @ Vk
    recon = scores @ Vk.T
    sse = np.sum((X - recon)**2)
    print(f"{k:3d} {sse:20.1f} {1 - sse/total_var:27.1%}")
'''

# ---------------------------------------------------------------- week 3 ----
SNIPPETS["w3c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34720)
n, p = 4000, 6
B_true = np.array([1.2, 0.9, 0.7, -0.4, 0.3, 0.0])
F = rng.normal(size=n)
idio_sd = np.array([0.3, 0.4, 0.5, 0.6, 0.8, 1.0])
E = rng.normal(size=(n, p)) * idio_sd
X = np.outer(F, B_true) + E

Fc = F - F.mean()
Xc = X - X.mean(axis=0)
B_hat = (Fc @ Xc) / (Fc @ Fc)
resid = Xc - np.outer(Fc, B_hat)
var_x = X.var(axis=0)
var_explained_by_factor = B_hat**2 * F.var()
communality = var_explained_by_factor / var_x
uniqueness = resid.var(axis=0) / var_x

print(f"{'asset':>6} {'B_true':>8} {'B_hat':>8} {'communality':>12} {'uniqueness':>11}")
for j in range(p):
    print(f"{j:6d} {B_true[j]:8.2f} {B_hat[j]:8.2f} {communality[j]:12.2f} {uniqueness[j]:11.2f}")
print("\ncommunality + uniqueness sums to 1 up to rounding, by construction of the decomposition.")
'''

SNIPPETS["w3c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34721)
n, p = 3000, 8
B_true = rng.uniform(0.5, 1.5, p)
F_true = rng.normal(size=n)
E = rng.normal(size=(n, p)) * rng.uniform(0.3, 0.7, p)
X = np.outer(F_true, B_true) + E
X = X - X.mean(axis=0)

S = np.cov(X, rowvar=False)
eigval, eigvec = np.linalg.eigh(S)
order = np.argsort(eigval)[::-1]
eigval, eigvec = eigval[order], eigvec[:, order]
F_stat = X @ eigvec[:, 0]

corr = np.corrcoef(F_stat, F_true)[0, 1]
print(f"variance explained by the first statistical factor: {eigval[0]/eigval.sum():.1%}")
print(f"correlation between the statistical factor and the true (unobserved) factor: {abs(corr):.3f}")

B_stat = eigvec[:, 0] / np.linalg.norm(eigvec[:, 0])
print("\nstatistical loadings (direction only):", np.round(B_stat, 3))
print("true loadings (direction only):        ", np.round(B_true / np.linalg.norm(B_true), 3))
'''

SNIPPETS["w3c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34722)
T, N = 240, 50
size = rng.normal(size=N)
value = rng.normal(size=N)
char = np.column_stack([np.ones(N), size, value])

true_factor_ret = np.array([0.0, 0.004, 0.002])
factor_returns = np.zeros((T, 3))
for t in range(T):
    shock = rng.normal(scale=[1e-6, 0.01, 0.01])
    idio = rng.normal(scale=0.05, size=N)
    r_t = char @ (true_factor_ret + shock) + idio
    coef, *_ = np.linalg.lstsq(char, r_t, rcond=None)
    factor_returns[t] = coef

mean_f = factor_returns.mean(axis=0)
se_f = factor_returns.std(axis=0, ddof=1) / np.sqrt(T)
tstat = mean_f / se_f

names = ["intercept", "size", "value"]
print(f"{'factor':>10} {'mean return/mo':>16} {'std err':>10} {'t-stat':>8}")
for nm, m, s, t in zip(names, mean_f, se_f, tstat):
    print(f"{nm:>10} {m:16.4f} {s:10.4f} {t:8.2f}")
'''

SNIPPETS["w3c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34723)
n, k, p = 2000, 2, 5
B = rng.normal(size=(p, k))
F = rng.normal(size=(n, k))
E = rng.normal(size=(n, p)) * 0.3
X = F @ B.T + E
X = X - X.mean(axis=0)

theta = np.pi / 5
R = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])
B_rot = B @ R
F_rot = F @ R

recon_orig = F @ B.T
recon_rot = F_rot @ B_rot.T
print("max abs difference between original and rotated reconstruction:",
      f"{np.max(np.abs(recon_orig - recon_rot)):.2e}")

cov_from_B = B @ B.T
cov_from_Brot = B_rot @ B_rot.T
print("max abs difference between B B' and (B R)(B R)':",
      f"{np.max(np.abs(cov_from_B - cov_from_Brot)):.2e}")
'''

# ---------------------------------------------------------------- week 4 ----
SNIPPETS["w4c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34730)
n = 3000
z1 = rng.normal(size=n)
z2 = rng.normal(size=n)

X = np.column_stack([z1 + 0.3*rng.normal(size=n), 0.5*z1 + z2 + 0.3*rng.normal(size=n), rng.normal(size=n)])
Y = np.column_stack([z1 + 0.3*rng.normal(size=n), z2 - 0.4*z1 + 0.3*rng.normal(size=n)])

X = X - X.mean(axis=0)
Y = Y - Y.mean(axis=0)

def sym_inv_sqrt(S):
    val, vec = np.linalg.eigh(S)
    val = np.clip(val, 1e-8, None)
    return vec @ np.diag(val**-0.5) @ vec.T

Sxx = (X.T @ X) / n
Syy = (Y.T @ Y) / n
Sxy = (X.T @ Y) / n

Ax = sym_inv_sqrt(Sxx)
Ay = sym_inv_sqrt(Syy)
M = Ax @ Sxy @ Ay
U, s, Vt = np.linalg.svd(M)

print("canonical correlations:", np.round(s, 3))
a1 = Ax @ U[:, 0]
b1 = Ay @ Vt[0, :]
u1 = X @ a1
v1 = Y @ b1
print("check: corr(first canonical variates) =", round(float(np.corrcoef(u1, v1)[0, 1]), 3))
'''

SNIPPETS["w4c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34731)
n = 3000
z = rng.normal(size=n)
X = np.column_stack([0.6*z + rng.normal(size=n), 0.6*z + rng.normal(size=n), rng.normal(size=n)])
Y = np.column_stack([0.6*z + rng.normal(size=n), 0.6*z + rng.normal(size=n)])
X = X - X.mean(axis=0)
Y = Y - Y.mean(axis=0)

best_simple = 0.0
for i in range(X.shape[1]):
    for j in range(Y.shape[1]):
        c = abs(float(np.corrcoef(X[:, i], Y[:, j])[0, 1]))
        best_simple = max(best_simple, c)

def sym_inv_sqrt(S):
    val, vec = np.linalg.eigh(S)
    val = np.clip(val, 1e-8, None)
    return vec @ np.diag(val**-0.5) @ vec.T

Sxx = (X.T @ X) / n
Syy = (Y.T @ Y) / n
Sxy = (X.T @ Y) / n
M = sym_inv_sqrt(Sxx) @ Sxy @ sym_inv_sqrt(Syy)
s = np.linalg.svd(M, compute_uv=False)

print(f"best single-variable-pair |correlation|: {best_simple:.3f}")
print(f"first canonical correlation:              {s[0]:.3f}")
print(f"gain from combining variables:             {s[0]-best_simple:+.3f}")
'''

SNIPPETS["w4c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34732)
n = 400
z = rng.normal(size=n)
X = np.column_stack([0.5*z + rng.normal(size=n), rng.normal(size=n), rng.normal(size=n)])
Y = np.column_stack([0.5*z + rng.normal(size=n), rng.normal(size=n), rng.normal(size=n)])
X = X - X.mean(axis=0)
Y = Y - Y.mean(axis=0)

def canon_corrs(X, Y):
    n_ = X.shape[0]
    def sym_inv_sqrt(S):
        val, vec = np.linalg.eigh(S)
        val = np.clip(val, 1e-8, None)
        return vec @ np.diag(val**-0.5) @ vec.T
    Sxx = (X.T @ X) / n_
    Syy = (Y.T @ Y) / n_
    Sxy = (X.T @ Y) / n_
    M = sym_inv_sqrt(Sxx) @ Sxy @ sym_inv_sqrt(Syy)
    return np.linalg.svd(M, compute_uv=False)

obs = canon_corrs(X, Y)
n_perm = 500
null_max = np.zeros(n_perm)
for i in range(n_perm):
    perm = rng.permutation(n)
    null_max[i] = canon_corrs(X, Y[perm])[0]

pvals = [float(np.mean(null_max >= obs[k])) for k in range(len(obs))]
print("observed canonical correlations:", np.round(obs, 3))
print("permutation p-value for each (null: no association):", np.round(pvals, 3))
'''

SNIPPETS["w4c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34733)

def canon_corrs(X, Y):
    n_ = X.shape[0]
    def sym_inv_sqrt(S):
        val, vec = np.linalg.eigh(S)
        val = np.clip(val, 1e-8, None)
        return vec @ np.diag(val**-0.5) @ vec.T
    Sxx = (X.T @ X) / n_
    Syy = (Y.T @ Y) / n_
    Sxy = (X.T @ Y) / n_
    M = sym_inv_sqrt(Sxx) @ Sxy @ sym_inv_sqrt(Syy)
    return np.linalg.svd(M, compute_uv=False)

n = 60
print(f"{'p (each block)':>16} {'n':>4} {'largest spurious canonical corr.':>34}")
for p in (2, 5, 10, 20):
    X = rng.normal(size=(n, p))
    Y = rng.normal(size=(n, p))
    X = X - X.mean(axis=0)
    Y = Y - Y.mean(axis=0)
    s = canon_corrs(X, Y)
    print(f"{p:16d} {n:4d} {s[0]:34.3f}")
print("\nX and Y are independent by construction -- every correlation above is pure overfitting.")
'''

# ---------------------------------------------------------------- week 5 ----
SNIPPETS["w5c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34740)
n, p = 60, 5
z = rng.normal(size=n)
X = np.column_stack([z + 0.02*rng.normal(size=n), z + 0.02*rng.normal(size=n), rng.normal(size=(n, 3))])
beta_true = np.array([1.0, 1.0, 0.5, -0.5, 0.0])
y = X @ beta_true + rng.normal(scale=0.5, size=n)
X = X - X.mean(axis=0)
y = y - y.mean()

def ridge(X, y, lam):
    p_ = X.shape[1]
    return np.linalg.solve(X.T @ X + lam*np.eye(p_), X.T @ y)

beta_ols = ridge(X, y, 0.0)
beta_ridge = ridge(X, y, 5.0)

print("condition number of X'X:", f"{np.linalg.cond(X.T@X):.1e}")
print(f"{'coef':>6} {'true':>7} {'OLS':>9} {'ridge(5)':>9}")
for j in range(p):
    print(f"{j:6d} {beta_true[j]:7.2f} {beta_ols[j]:9.2f} {beta_ridge[j]:9.2f}")
'''

SNIPPETS["w5c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34741)
n, p, trials = 40, 10, 300
beta_true = rng.normal(scale=0.5, size=p)
X0 = rng.normal(size=(n, p))
lambdas = [0.0, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0]

def ridge(X, y, lam):
    return np.linalg.solve(X.T @ X + lam*np.eye(X.shape[1]), X.T @ y)

mse = {lam: [] for lam in lambdas}
for _ in range(trials):
    y = X0 @ beta_true + rng.normal(scale=1.0, size=n)
    for lam in lambdas:
        b = ridge(X0, y, lam)
        mse[lam].append(np.sum((b - beta_true)**2))

print(f"{'lambda':>8} {'mean squared error of beta_hat':>32}")
for lam in lambdas:
    print(f"{lam:8.1f} {np.mean(mse[lam]):32.4f}")
'''

SNIPPETS["w5c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34742)
n, p = 200, 6
X = rng.normal(size=(n, p)) @ np.diag([3.0, 2.0, 1.0, 0.3, 0.1, 0.05])
X = X - X.mean(axis=0)
_, svals, _ = np.linalg.svd(X, full_matrices=False)
d2 = svals**2

for lam in (0.0, 1.0, 10.0, 100.0):
    shrink = d2 / (d2 + lam)
    df = shrink.sum()
    print(f"lambda = {lam:7.1f}   per-direction shrinkage: {np.round(shrink,3)}   effective df = {df:5.2f}")
'''

SNIPPETS["w5c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34743)
n, p = 120, 8
beta_true = np.array([1.0, -1.0, 0.5, 0, 0, 0, 0, 0])
X = rng.normal(size=(n, p))
y = X @ beta_true + rng.normal(scale=1.5, size=n)

def ridge(X, y, lam):
    return np.linalg.solve(X.T @ X + lam*np.eye(X.shape[1]), X.T @ y)

K = 5
folds = np.array_split(rng.permutation(n), K)
lambdas = [0.0, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0]
cv_mse = []
for lam in lambdas:
    errs = []
    for k in range(K):
        test = folds[k]
        train = np.hstack([folds[j] for j in range(K) if j != k])
        Xtr, ytr = X[train] - X[train].mean(0), y[train] - y[train].mean()
        Xte, yte = X[test] - X[train].mean(0), y[test] - y[train].mean()
        b = ridge(Xtr, ytr, lam)
        pred = Xte @ b
        errs.append(np.mean((yte - pred)**2))
    cv_mse.append(np.mean(errs))

best = lambdas[int(np.argmin(cv_mse))]
print(f"{'lambda':>8} {'5-fold CV MSE':>14}")
for lam, m in zip(lambdas, cv_mse):
    print(f"{lam:8.1f} {m:14.4f}")
print(f"\nselected lambda (min CV error): {best}")
'''

# ---------------------------------------------------------------- week 6 ----
SNIPPETS["w6c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34750)
n, p = 200, 12
beta_true = np.array([2.0, -1.5, 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0])
X = rng.normal(size=(n, p))
X = X - X.mean(axis=0)
X = X / X.std(axis=0)
y = X @ beta_true + rng.normal(scale=1.0, size=n)
y = y - y.mean()

def soft_threshold(z, t):
    return np.sign(z) * np.maximum(np.abs(z) - t, 0.0)

def lasso_cd(X, y, lam, n_iter=200):
    n_, p_ = X.shape
    beta = np.zeros(p_)
    col_ss = (X**2).sum(axis=0)
    for _ in range(n_iter):
        for j in range(p_):
            r_j = y - X @ beta + X[:, j] * beta[j]
            rho = X[:, j] @ r_j
            beta[j] = soft_threshold(rho, lam * n_) / col_ss[j] if col_ss[j] > 0 else 0.0
    return beta

beta_hat = lasso_cd(X, y, lam=0.05)
print(f"{'coef':>6} {'true':>7} {'lasso':>8}")
for j in range(p):
    print(f"{j:6d} {beta_true[j]:7.2f} {beta_hat[j]:8.2f}")
print("\nnumber of coefficients lasso set exactly to zero:", int(np.sum(np.abs(beta_hat) < 1e-8)))
'''

SNIPPETS["w6c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34751)
n, p = 200, 8
beta_true = np.array([2.0, -1.5, 1.0, 0, 0, 0, 0, 0])
X = rng.normal(size=(n, p))
X = X - X.mean(0)
X = X / X.std(0)
y = X @ beta_true + rng.normal(scale=1.0, size=n)
y = y - y.mean()

def soft_threshold(z, t):
    return np.sign(z) * np.maximum(np.abs(z) - t, 0.0)

def lasso_cd(X, y, lam, n_iter=150):
    n_, p_ = X.shape
    beta = np.zeros(p_)
    col_ss = (X**2).sum(axis=0)
    for _ in range(n_iter):
        for j in range(p_):
            r_j = y - X @ beta + X[:, j]*beta[j]
            rho = X[:, j] @ r_j
            beta[j] = soft_threshold(rho, lam*n_)/col_ss[j] if col_ss[j] > 0 else 0.0
    return beta

lambdas = np.array([0.5, 0.3, 0.2, 0.12, 0.08, 0.04, 0.02, 0.005])
print(f"{'lambda':>8} {'# nonzero':>10}   coefficients")
for lam in lambdas:
    b = lasso_cd(X, y, lam)
    nz = int(np.sum(np.abs(b) > 1e-6))
    print(f"{lam:8.3f} {nz:10d}   {np.round(b, 2)}")
'''

SNIPPETS["w6c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34752)
n, p = 150, 8
beta_true = np.array([1.5, -1.0, 0, 0, 0.8, 0, 0, 0])
X = rng.normal(size=(n, p))
X = X - X.mean(0)
X = X / X.std(0)
y = X @ beta_true + rng.normal(scale=1.0, size=n)
y = y - y.mean()

def soft_threshold(z, t):
    return np.sign(z) * np.maximum(np.abs(z) - t, 0.0)

def lasso_cd(X, y, lam, n_iter=150):
    n_, p_ = X.shape
    beta = np.zeros(p_)
    col_ss = (X**2).sum(axis=0)
    for _ in range(n_iter):
        for j in range(p_):
            r_j = y - X @ beta + X[:, j]*beta[j]
            rho = X[:, j] @ r_j
            beta[j] = soft_threshold(rho, lam*n_)/col_ss[j] if col_ss[j] > 0 else 0.0
    return beta

n_boot = 200
selected = np.zeros(p)
for _ in range(n_boot):
    idx = rng.integers(0, n, n)
    b = lasso_cd(X[idx], y[idx], lam=0.08)
    selected += (np.abs(b) > 1e-6)

freq = selected / n_boot
print(f"{'coef':>6} {'true':>7} {'selection frequency':>20}")
for j in range(p):
    print(f"{j:6d} {beta_true[j]:7.2f} {freq[j]:20.2f}")
'''

SNIPPETS["w6c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34753)
n = 150
z = rng.normal(size=n)
x1 = z + 0.05*rng.normal(size=n)
x2 = z + 0.05*rng.normal(size=n)
x3 = rng.normal(size=n)
X = np.column_stack([x1, x2, x3])
X = X - X.mean(0)
X = X / X.std(0)
y = 2.0*z + rng.normal(scale=0.5, size=n)
y = y - y.mean()

def soft_threshold(z_, t):
    return np.sign(z_) * np.maximum(np.abs(z_) - t, 0.0)

def penalized_cd(X, y, lam, alpha, n_iter=200):
    n_, p_ = X.shape
    beta = np.zeros(p_)
    col_ss = (X**2).sum(axis=0)
    for _ in range(n_iter):
        for j in range(p_):
            r_j = y - X @ beta + X[:, j]*beta[j]
            rho = X[:, j] @ r_j
            num = soft_threshold(rho, lam*alpha*n_)
            beta[j] = num / (col_ss[j] + lam*(1-alpha)*n_)
    return beta

beta_lasso = penalized_cd(X, y, lam=0.15, alpha=1.0)
beta_enet = penalized_cd(X, y, lam=0.15, alpha=0.5)

print("coefficients on (x1, x2, x3); x1 and x2 are near-duplicates of the same variable:\n")
print("pure lasso (alpha=1):     ", np.round(beta_lasso, 3))
print("elastic net (alpha=0.5):  ", np.round(beta_enet, 3))
'''

# ---------------------------------------------------------------- week 7 ----
SNIPPETS["w7c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34760)
n = 300
print(f"{'p':>5} {'p/n':>6} {'min eig':>9} {'max eig':>9} {'MP upper bound':>16}")
for p in (30, 100, 200, 290):
    X = rng.normal(size=(n, p))
    S = np.cov(X, rowvar=False)
    eig = np.linalg.eigvalsh(S)
    ratio = p/n
    mp_hi = (1 + np.sqrt(ratio))**2
    print(f"{p:5d} {ratio:6.2f} {eig.min():9.3f} {eig.max():9.3f} {mp_hi:16.3f}")
'''

SNIPPETS["w7c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34761)
p, n = 40, 60
A = rng.normal(size=(p, p))
Sigma_true = A @ A.T / p + np.eye(p) * 0.3

def shrink(S, alpha):
    target = np.eye(p) * np.trace(S)/p
    return alpha*target + (1-alpha)*S

trials = 200
errs_sample, errs_oracle_shrink = [], []
alphas = np.linspace(0, 1, 21)
for _ in range(trials):
    X = rng.multivariate_normal(np.zeros(p), Sigma_true, size=n)
    S = np.cov(X, rowvar=False)
    errs_sample.append(np.linalg.norm(S - Sigma_true, 'fro')**2)
    losses = [np.linalg.norm(shrink(S, a) - Sigma_true, 'fro')**2 for a in alphas]
    errs_oracle_shrink.append(min(losses))

print(f"average Frobenius^2 loss, raw sample covariance:            {np.mean(errs_sample):.1f}")
print(f"average Frobenius^2 loss, oracle-best-alpha shrinkage:       {np.mean(errs_oracle_shrink):.1f}")
print(f"\n(alpha grid searched: {alphas[0]:.2f} to {alphas[-1]:.2f})")
'''

SNIPPETS["w7c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34762)
p, n = 30, 36
A = rng.normal(size=(p, p))
Sigma_true = A @ A.T / p + np.eye(p)*0.2

def shrink(S, alpha=0.4):
    target = np.eye(p) * np.trace(S)/p
    return alpha*target + (1-alpha)*S

def min_var_weights(S):
    ones = np.ones(p)
    w = np.linalg.solve(S, ones)
    return w / w.sum()

trials = 100
true_vars_raw, true_vars_shrunk = [], []
for _ in range(trials):
    X = rng.multivariate_normal(np.zeros(p), Sigma_true, size=n)
    S = np.cov(X, rowvar=False)
    w_raw = min_var_weights(S)
    w_shr = min_var_weights(shrink(S))
    true_vars_raw.append(w_raw @ Sigma_true @ w_raw)
    true_vars_shrunk.append(w_shr @ Sigma_true @ w_shr)

X_ex = rng.multivariate_normal(np.zeros(p), Sigma_true, size=n)
S_example = np.cov(X_ex, rowvar=False)
print(f"condition number, raw sample covariance:    {np.linalg.cond(S_example):10.1f}")
print(f"condition number, shrunk covariance:         {np.linalg.cond(shrink(S_example)):10.1f}")
print(f"\ntrue variance of the min-variance portfolio, raw covariance:    {np.mean(true_vars_raw):.4f}")
print(f"true variance of the min-variance portfolio, shrunk covariance: {np.mean(true_vars_shrunk):.4f}")
'''

SNIPPETS["w7c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34763)
p = 6
Prec = np.zeros((p, p))
for j in range(p):
    Prec[j, j] = 2.0
for j in range(p-1):
    Prec[j, j+1] = Prec[j+1, j] = -0.8

Sigma = np.linalg.inv(Prec)
print("true precision matrix (inverse covariance), a chain graph:")
print(np.round(Prec, 2))
print("\nimplied covariance matrix (dense -- every pair is marginally correlated):")
print(np.round(Sigma, 2))

n = 4000
X = rng.multivariate_normal(np.zeros(p), Sigma, size=n)
S = np.cov(X, rowvar=False)
Prec_hat = np.linalg.inv(S)
print("\nestimated precision matrix from n =", n, "samples (small entries are noise, not structure):")
print(np.round(Prec_hat, 2))
'''

# ---------------------------------------------------------------- week 8 ----
SNIPPETS["w8c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34770)
n_per, p = 100, 2
centers_true = np.array([[0,0],[5,5],[5,-5]])
X = np.vstack([c + rng.normal(scale=1.0, size=(n_per, p)) for c in centers_true])
labels_true = np.repeat(np.arange(3), n_per)

def kmeans(X, k, n_iter=20, seed=0):
    rng_ = np.random.default_rng(seed)
    idx = rng_.choice(len(X), k, replace=False)
    centers = X[idx].copy()
    it = 0
    for it in range(n_iter):
        d = ((X[:, None, :] - centers[None, :, :])**2).sum(axis=2)
        assign = d.argmin(axis=1)
        inertia = d[np.arange(len(X)), assign].sum()
        new_centers = np.array([X[assign == j].mean(axis=0) if np.any(assign == j) else centers[j] for j in range(k)])
        if np.allclose(new_centers, centers):
            centers = new_centers
            break
        centers = new_centers
    return assign, centers, inertia, it+1

assign, centers, inertia, n_it = kmeans(X, 3, seed=34770)
print(f"converged after {n_it} iterations, final inertia = {inertia:.1f}")

acc_map = {}
for j in range(3):
    vals, counts = np.unique(labels_true[assign == j], return_counts=True)
    acc_map[j] = vals[np.argmax(counts)]
pred_mapped = np.array([acc_map[a] for a in assign])
accuracy = np.mean(pred_mapped == labels_true)
print(f"clustering accuracy against the true group labels: {accuracy:.1%}")
'''

SNIPPETS["w8c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34771)
n = 8
X = rng.normal(size=(n, 2)) * 1.0
X[4:] += 6.0

def pairwise_dist(pts):
    return np.sqrt(((pts[:, None, :] - pts[None, :, :])**2).sum(axis=2))

def agglomerative(X, linkage="average"):
    n_ = X.shape[0]
    clusters = {i: [i] for i in range(n_)}
    active = list(range(n_))
    D = pairwise_dist(X)
    merges = []
    next_id = n_
    while len(active) > 1:
        best = (np.inf, None, None)
        for ii in range(len(active)):
            for jj in range(ii+1, len(active)):
                a, b = active[ii], active[jj]
                pts_a, pts_b = clusters[a], clusters[b]
                dists = [D[x, y] for x in pts_a for y in pts_b]
                if linkage == "average":
                    d = float(np.mean(dists))
                elif linkage == "complete":
                    d = float(np.max(dists))
                else:
                    d = float(np.min(dists))
                if d < best[0]:
                    best = (d, a, b)
        d, a, b = best
        merges.append((a, b, round(d, 3)))
        clusters[next_id] = clusters[a] + clusters[b]
        active.remove(a)
        active.remove(b)
        active.append(next_id)
        next_id += 1
    return merges

merges = agglomerative(X, "average")
print("merge order (cluster id, cluster id, linkage distance):")
for m in merges:
    print(" ", m)
'''

SNIPPETS["w8c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34772)
n = 2000
true_mu = [-2.0, 3.0]
true_sd = [1.0, 1.5]
true_pi = [0.4, 0.6]
z = rng.random(n) < true_pi[0]
x = np.where(z, rng.normal(true_mu[0], true_sd[0], n), rng.normal(true_mu[1], true_sd[1], n))

def gauss_pdf(x, mu, sd):
    return np.exp(-0.5*((x-mu)/sd)**2) / (sd*np.sqrt(2*np.pi))

mu = np.array([-1.0, 1.0])
sd = np.array([1.0, 1.0])
pi = np.array([0.5, 0.5])
loglik_hist = []
for it in range(50):
    resp0 = pi[0]*gauss_pdf(x, mu[0], sd[0])
    resp1 = pi[1]*gauss_pdf(x, mu[1], sd[1])
    total = resp0 + resp1
    r0, r1 = resp0/total, resp1/total
    loglik = float(np.sum(np.log(total)))
    loglik_hist.append(loglik)
    for k, r in enumerate((r0, r1)):
        Nk = r.sum()
        mu[k] = (r*x).sum() / Nk
        sd[k] = np.sqrt((r*(x-mu[k])**2).sum() / Nk)
        pi[k] = Nk / n

order = np.argsort(mu)
print("log-likelihood every 10 iterations:", np.round(loglik_hist[::10], 1))
print(f"\nrecovered means: {np.round(mu[order], 2)}   true means: {sorted(true_mu)}")
print(f"recovered sds:   {np.round(sd[order], 2)}   true sds:   {[true_sd[0], true_sd[1]]}")
'''

SNIPPETS["w8c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34773)
centers_true = np.array([[0,0],[6,0],[3,5]])
X = np.vstack([c + rng.normal(scale=1.0, size=(80,2)) for c in centers_true])
n, p = X.shape

def kmeans_inertia(X, k, seed, n_iter=30):
    rng_ = np.random.default_rng(seed)
    idx = rng_.choice(len(X), k, replace=False)
    centers = X[idx].copy()
    d = None
    assign = None
    for _ in range(n_iter):
        d = ((X[:, None, :] - centers[None, :, :])**2).sum(axis=2)
        assign = d.argmin(axis=1)
        new_centers = np.array([X[assign == j].mean(axis=0) if np.any(assign == j) else centers[j] for j in range(k)])
        if np.allclose(new_centers, centers):
            break
        centers = new_centers
    return d[np.arange(len(X)), assign].sum()

print(f"{'k':>3} {'inertia':>10} {'BIC-like':>12}")
for k in range(1, 7):
    inertia = kmeans_inertia(X, k, seed=34773+k)
    bic = n*np.log(inertia/n) + k*p*np.log(n)
    print(f"{k:3d} {inertia:10.1f} {bic:12.1f}")
'''

# ---------------------------------------------------------------- week 9 ----
SNIPPETS["w9c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34780)
n = 300
x1 = rng.uniform(-3, 3, n)
x2 = rng.uniform(-3, 3, n)
y_true = np.where(x1 > 0, np.where(x2 > 1, 5.0, 2.0), np.where(x2 > -1, -1.0, -4.0))
y = y_true + rng.normal(scale=0.3, size=n)
X = np.column_stack([x1, x2])

def cand_thresh(x, k=20):
    return np.unique(np.quantile(x, np.linspace(0.05, 0.95, k)))

def best_split(X, y):
    best = (np.inf, None, None)
    n_, p_ = X.shape
    for j in range(p_):
        for thr in cand_thresh(X[:, j]):
            left = X[:, j] <= thr
            if left.sum() < 5 or (~left).sum() < 5:
                continue
            sse = np.sum((y[left]-y[left].mean())**2) + np.sum((y[~left]-y[~left].mean())**2)
            if sse < best[0]:
                best = (sse, j, thr)
    return best

def grow(X, y, depth):
    sse0, j, thr = best_split(X, y)
    if j is None or depth == 0:
        return {"leaf": y.mean(), "n": len(y)}
    left = X[:, j] <= thr
    return {"split": (j, thr),
            "left": grow(X[left], y[left], depth-1),
            "right": grow(X[~left], y[~left], depth-1)}

tree = grow(X, y, depth=2)

def show(node, indent=""):
    if "leaf" in node:
        print(f"{indent}leaf: predict {node['leaf']:.2f}  (n={node['n']})")
    else:
        j, thr = node["split"]
        print(f"{indent}split on x{j+1} <= {thr:.2f}")
        show(node["left"], indent+"  ")
        show(node["right"], indent+"  ")

show(tree)
'''

SNIPPETS["w9c2"] = r'''
import numpy as np
np.seterr(all="ignore")

def true_f(x):
    return np.sin(x)

def gen(n, seed):
    r = np.random.default_rng(seed)
    x = r.uniform(-3, 3, n)
    y = true_f(x) + r.normal(scale=0.4, size=n)
    return x, y

def cand_thresh(x, k=20):
    return np.unique(np.quantile(x, np.linspace(0.05, 0.95, k)))

def stump(x, y):
    best = (np.inf, None, None, None)
    for thr in cand_thresh(x):
        left = x <= thr
        if left.sum() < 3 or (~left).sum() < 3:
            continue
        lm, rm = y[left].mean(), y[~left].mean()
        sse = np.sum((y[left]-lm)**2) + np.sum((y[~left]-rm)**2)
        if sse < best[0]:
            best = (sse, thr, lm, rm)
    return best[1], best[2], best[3]

def predict_stump(thr, lm, rm, x):
    return np.where(x <= thr, lm, rm)

n_train, n_test = 40, 500
x_test, _ = gen(n_test, 999)
y_test_true = true_f(x_test)

n_reps, B = 40, 25
single_preds = np.zeros((n_reps, n_test))
bagged_preds = np.zeros((n_reps, n_test))
for rep in range(n_reps):
    x_tr, y_tr = gen(n_train, seed=rep)
    thr, lm, rm = stump(x_tr, y_tr)
    single_preds[rep] = predict_stump(thr, lm, rm, x_test)

    bag_pred = np.zeros(n_test)
    r = np.random.default_rng(rep + 10000)
    for b in range(B):
        idx = r.integers(0, n_train, n_train)
        thr_b, lm_b, rm_b = stump(x_tr[idx], y_tr[idx])
        bag_pred += predict_stump(thr_b, lm_b, rm_b, x_test)
    bagged_preds[rep] = bag_pred / B

single_var = np.mean(np.var(single_preds, axis=0))
bagged_var = np.mean(np.var(bagged_preds, axis=0))
single_mse = np.mean(np.mean((single_preds - y_test_true)**2, axis=0))
bagged_mse = np.mean(np.mean((bagged_preds - y_test_true)**2, axis=0))

print(f"average prediction variance, single stump:  {single_var:.4f}")
print(f"average prediction variance, bagged ({B}):    {bagged_var:.4f}")
print(f"\naverage test MSE, single stump: {single_mse:.4f}")
print(f"average test MSE, bagged:       {bagged_mse:.4f}")
'''

SNIPPETS["w9c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34782)
n, p = 200, 5
z = rng.normal(size=n)
X = np.column_stack([
    z + 0.3*rng.normal(size=n),
    z + 0.3*rng.normal(size=n),
    rng.normal(size=n),
    rng.normal(size=n),
    rng.normal(size=n),
])
y = 3.0*z + rng.normal(scale=0.5, size=n)

def cand_thresh(x, k=20):
    return np.unique(np.quantile(x, np.linspace(0.05, 0.95, k)))

def best_stump(X, y, features):
    best = (np.inf, None, None, None, None)
    for j in features:
        for thr in cand_thresh(X[:, j]):
            left = X[:, j] <= thr
            if left.sum() < 5 or (~left).sum() < 5:
                continue
            lm, rm = y[left].mean(), y[~left].mean()
            sse = np.sum((y[left]-lm)**2) + np.sum((y[~left]-rm)**2)
            if sse < best[0]:
                best = (sse, j, thr, lm, rm)
    return best

def fit_predict(X, y, features, seed):
    r = np.random.default_rng(seed)
    idx = r.integers(0, len(X), len(X))
    _, j, thr, lm, rm = best_stump(X[idx], y[idx], features)
    return np.where(X[:, j] <= thr, lm, rm), j

B = 60
preds_bag = np.zeros((B, n))
feats_bag = []
preds_rf = np.zeros((B, n))
feats_rf = []
for b in range(B):
    p_bag, j_bag = fit_predict(X, y, features=list(range(p)), seed=b)
    preds_bag[b] = p_bag
    feats_bag.append(j_bag)
    r = np.random.default_rng(b+500)
    m_features = list(r.choice(p, size=2, replace=False))
    p_rf, j_rf = fit_predict(X, y, features=m_features, seed=b+1000)
    preds_rf[b] = p_rf
    feats_rf.append(j_rf)

corr_bag = float(np.mean([np.corrcoef(preds_bag[i], preds_bag[j])[0,1]
                           for i in range(B) for j in range(i+1, B)]))
corr_rf = float(np.mean([np.corrcoef(preds_rf[i], preds_rf[j])[0,1]
                          for i in range(B) for j in range(i+1, B)]))

feats_bag_arr = np.array(feats_bag)
feats_rf_arr = np.array(feats_rf)
print(f"bagging: fraction of trees splitting on feature 0: {np.mean(feats_bag_arr == 0):.2f}")
print(f"bagging: fraction of trees splitting on feature 1: {np.mean(feats_bag_arr == 1):.2f}")
print("random-forest-style: split feature counts:", {j: int(np.sum(feats_rf_arr == j)) for j in range(p)})
print(f"\naverage pairwise correlation between tree predictions, bagging:       {corr_bag:.3f}")
print(f"average pairwise correlation between tree predictions, random-forest: {corr_rf:.3f}")
'''

SNIPPETS["w9c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34783)

def cand_thresh(x, k=15):
    return np.unique(np.quantile(x, np.linspace(0.05, 0.95, k)))

def fit_stump_ensemble(X, y, B, seed):
    r = np.random.default_rng(seed)
    stumps = []
    for b in range(B):
        idx = r.integers(0, len(X), len(X))
        Xb, yb = X[idx], y[idx]
        best = (np.inf, None, None, None, None)
        for j in range(X.shape[1]):
            for thr in cand_thresh(Xb[:, j]):
                left = Xb[:, j] <= thr
                if left.sum() < 10 or (~left).sum() < 10:
                    continue
                lm, rm = yb[left].mean(), yb[~left].mean()
                sse = np.sum((yb[left]-lm)**2) + np.sum((yb[~left]-rm)**2)
                if sse < best[0]:
                    best = (sse, j, thr, lm, rm)
        stumps.append(best[1:])
    return stumps

def predict(stumps, X):
    preds = np.zeros((len(stumps), len(X)))
    for b, (j, thr, lm, rm) in enumerate(stumps):
        preds[b] = np.where(X[:, j] <= thr, lm, rm)
    return preds.mean(axis=0)

def importances(X, y, B, seed):
    stumps = fit_stump_ensemble(X, y, B, seed)
    base = float(np.mean((predict(stumps, X) - y)**2))
    imp = []
    for j in range(X.shape[1]):
        r = np.random.default_rng(1000 + j)
        Xp = X.copy()
        Xp[:, j] = r.permutation(Xp[:, j])
        mse_p = float(np.mean((predict(stumps, Xp) - y)**2))
        imp.append(mse_p - base)
    return base, imp

n = 400
z = rng.normal(size=n)
noise = rng.normal(size=(n, 2))
y = 2.0*z + rng.normal(scale=0.5, size=n)

X_single = np.column_stack([z, noise[:, 0], noise[:, 1]])
base_s, imp_s = importances(X_single, y, B=40, seed=1)

X_dup = np.column_stack([z + 0.2*rng.normal(size=n), z + 0.2*rng.normal(size=n), noise[:, 0], noise[:, 1]])
base_d, imp_d = importances(X_dup, y, B=40, seed=1)

print("scenario A -- one informative feature, no duplicate:")
print("  permutation importance per feature:", np.round(imp_s, 3))
print(f"  baseline MSE: {base_s:.4f}")
print("\nscenario B -- the same signal duplicated across two correlated features:")
print("  permutation importance per feature:", np.round(imp_d, 3))
print(f"  baseline MSE: {base_d:.4f}")
print("\nthe lone informative feature in A carries far more importance than either half of the duplicated pair in B.")
'''

# --------------------------------------------------------------- week 10 ----
SNIPPETS["w10c1"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34790)
n, p = 100, 15
beta_true = np.zeros(p)
beta_true[:4] = [2.0, -1.5, 1.0, -0.8]
Z = rng.normal(size=(n, 3))
loadings = rng.normal(size=(3, p))
X = Z @ loadings + rng.normal(scale=0.3, size=(n, p))
y = X @ beta_true + rng.normal(scale=1.0, size=n)

def ridge(Xtr, ytr, lam):
    return np.linalg.solve(Xtr.T@Xtr + lam*np.eye(Xtr.shape[1]), Xtr.T@ytr)

def pcr(Xtr, ytr, Xte, k):
    S = np.cov(Xtr, rowvar=False)
    val, vec = np.linalg.eigh(S)
    order = np.argsort(val)[::-1]
    V = vec[:, order[:k]]
    Ztr = Xtr @ V
    b = np.linalg.lstsq(Ztr, ytr, rcond=None)[0]
    return (Xte @ V) @ b

def soft_threshold(z, t):
    return np.sign(z)*np.maximum(np.abs(z)-t, 0.0)

def lasso_cd(Xtr, ytr, lam, n_iter=100):
    beta = np.zeros(Xtr.shape[1])
    col_ss = (Xtr**2).sum(axis=0)
    for _ in range(n_iter):
        for j in range(Xtr.shape[1]):
            r_j = ytr - Xtr@beta + Xtr[:, j]*beta[j]
            rho = Xtr[:, j]@r_j
            beta[j] = soft_threshold(rho, lam*Xtr.shape[0])/col_ss[j] if col_ss[j] > 0 else 0.0
    return beta

K = 5
folds = np.array_split(rng.permutation(n), K)
mse = {"OLS": [], "ridge(5)": [], "PCR(k=3)": [], "lasso(0.05)": []}
for k in range(K):
    test = folds[k]
    train = np.hstack([folds[j] for j in range(K) if j != k])
    Xtr, ytr = X[train]-X[train].mean(0), y[train]-y[train].mean()
    Xte, yte = X[test]-X[train].mean(0), y[test]-y[train].mean()

    b_ols = np.linalg.lstsq(Xtr, ytr, rcond=None)[0]
    mse["OLS"].append(np.mean((yte - Xte@b_ols)**2))

    b_r = ridge(Xtr, ytr, 5.0)
    mse["ridge(5)"].append(np.mean((yte - Xte@b_r)**2))

    pred_pcr = pcr(Xtr, ytr, Xte, k=3)
    mse["PCR(k=3)"].append(np.mean((yte - pred_pcr)**2))

    b_l = lasso_cd(Xtr, ytr, 0.05)
    mse["lasso(0.05)"].append(np.mean((yte - Xte@b_l)**2))

print(f"{'method':>14} {'5-fold CV MSE':>16}")
for name, vals in mse.items():
    print(f"{name:>14} {np.mean(vals):16.4f}")
'''

SNIPPETS["w10c2"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34791)
n = 500

def dist_matrix(X):
    sq = np.sum(X**2, axis=1)
    d2 = sq[:, None] + sq[None, :] - 2*X@X.T
    d2 = np.maximum(d2, 0)
    return np.sqrt(d2)

print(f"{'p':>5} {'mean nearest dist':>18} {'mean farthest dist':>20} {'ratio (near/far)':>18}")
for p in (2, 5, 20, 100, 500):
    X = rng.uniform(0, 1, size=(n, p))
    d = dist_matrix(X)
    np.fill_diagonal(d, np.nan)
    near = np.nanmin(d, axis=1)
    far = np.nanmax(d, axis=1)
    print(f"{p:5d} {np.mean(near):18.3f} {np.mean(far):20.3f} {np.mean(near/far):18.3f}")
'''

SNIPPETS["w10c3"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34792)
n, p = 80, 200
X = rng.normal(size=(n, p))
y = rng.normal(size=n)

def top_k_by_correlation(Xpool, ypool, k):
    corr = np.array([np.corrcoef(Xpool[:, j], ypool)[0, 1] for j in range(Xpool.shape[1])])
    return np.argsort(-np.abs(corr))[:k]

K = 5
folds = np.array_split(rng.permutation(n), K)
r2_leaky, r2_correct = [], []
for k in range(K):
    test = folds[k]
    train = np.hstack([folds[j] for j in range(K) if j != k])

    sel_leak = top_k_by_correlation(X, y, 5)
    b = np.linalg.lstsq(X[train][:, sel_leak], y[train], rcond=None)[0]
    pred = X[test][:, sel_leak] @ b
    r2_leaky.append(1 - np.sum((y[test]-pred)**2)/np.sum((y[test]-y[train].mean())**2))

    sel_ok = top_k_by_correlation(X[train], y[train], 5)
    b2 = np.linalg.lstsq(X[train][:, sel_ok], y[train], rcond=None)[0]
    pred2 = X[test][:, sel_ok] @ b2
    r2_correct.append(1 - np.sum((y[test]-pred2)**2)/np.sum((y[test]-y[train].mean())**2))

print(f"mean out-of-sample R^2, features selected using ALL data (leaky):    {np.mean(r2_leaky):+.3f}")
print(f"mean out-of-sample R^2, features selected using TRAINING fold only:  {np.mean(r2_correct):+.3f}")
print("\ny is pure noise, unrelated to X: the true R^2 is exactly 0.")
'''

SNIPPETS["w10c4"] = r'''
import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34793)
p, n_est, n_eval = 25, 36, 500
A = rng.normal(size=(p, p))
Sigma_true = A @ A.T / p + np.eye(p)*0.15
mu_true = rng.uniform(0.02, 0.10, p)

def shrink(S, alpha=0.35):
    target = np.eye(p) * np.trace(S)/p
    return alpha*target + (1-alpha)*S

def tangency_weights(mu, S, rf=0.0):
    excess = mu - rf
    w = np.linalg.solve(S, excess)
    return w / w.sum()

X_est = rng.multivariate_normal(mu_true/12, Sigma_true/12, size=n_est)
mu_hat = X_est.mean(axis=0)*12
S_hat = np.cov(X_est, rowvar=False)*12

w_raw = tangency_weights(mu_hat, S_hat)
w_shrunk = tangency_weights(mu_hat, shrink(S_hat))

X_eval = rng.multivariate_normal(mu_true/12, Sigma_true/12, size=n_eval)
ret_raw = X_eval @ w_raw * 12
ret_shrunk = X_eval @ w_shrunk * 12

print("in-sample tangency weights built from the raw sample covariance:")
print(f"  out-of-sample Sharpe:  {ret_raw.mean()/ret_raw.std():.3f}   gross leverage: {np.abs(w_raw).sum():.1f}x")
print(f"\nin-sample tangency weights built from the shrunk covariance:")
print(f"  out-of-sample Sharpe:  {ret_shrunk.mean()/ret_shrunk.std():.3f}   gross leverage: {np.abs(w_shrunk).sum():.1f}x")
'''


def run_all():
    ok, bad = 0, 0
    for name, src in SNIPPETS.items():
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "snip.py")
            with open(path, "w") as fh:
                fh.write(src)
            t0 = time.time()
            try:
                p = subprocess.run([sys.executable, path], cwd=tmp,
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                    timeout=20)
            except subprocess.TimeoutExpired:
                print(f"=== {name} : TIMEOUT ===")
                bad += 1
                continue
            dt = time.time() - t0
            out = p.stdout.decode()
            err = p.stderr.decode()
            status = "OK" if (p.returncode == 0 and not err) else "FAIL"
            if status == "OK":
                ok += 1
            else:
                bad += 1
            print(f"=== {name} : {status}  ({dt:.2f}s) ===")
            print(out)
            if err:
                print("--- stderr ---")
                print(err[:2000])
            print()
    print(f"TOTAL: {ok} ok, {bad} bad")


if __name__ == "__main__":
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    if only:
        SNIPPETS_SUB = {k: v for k, v in SNIPPETS.items() if k in only}
        SNIPPETS.clear()
        SNIPPETS.update(SNIPPETS_SUB)
    run_all()
