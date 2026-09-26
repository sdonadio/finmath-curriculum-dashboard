#!/usr/bin/env python3
"""Generator for courses/finm-34700.js -- FINM 34700, Multivariate Statistical
Analysis: Applications and Techniques (Jingshu Wang, Spring, 100 units).

Why a generator instead of a hand-edited JS literal: the course file is a
large JSON-ish object with forty embedded Python snippets, and hand-editing
one is how a quote or a brace goes missing. This script builds the whole
thing as a Python dict and emits it with json.dumps(indent=2).

    python3 tools/gen_finm_34700.py                       # writes courses/finm-34700.js
    python3 tools/run_snippets.py courses/finm-34700.js    # fills every `output`
    python3 tools/run_snippets.py --check courses/finm-34700.js
    python3 tools/validate.py courses/finm-34700.js        # must be 0 errors
    node --check courses/finm-34700.js

Every snippet below was executed locally (see the scratch test harness used
while authoring this file) before the surrounding prose was written; `output`
is emitted EMPTY here on purpose and is filled in from real stdout by
tools/run_snippets.py, so a claim in the prose can never drift from what the
code actually prints.

Provenance: the only readable source for this course was the public course
page (data/raw/pages/finm-34700.txt). The syllabus is a Box shared link
behind a university login and returned no text, so everything past the
public description is this dashboard's own reconstruction. See source.note.
"""
import json
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "courses", "finm-34700.js")

# ─────────────────────────────────────────────────────────────────────────
# Python snippet sources, keyed "w<week>c<concept>". Every one prints real,
# labelled numbers; np.seterr(all="ignore") + no warnings-module output keeps
# tools/run_snippets.py's "wrote to stderr" check clean.
# ─────────────────────────────────────────────────────────────────────────
SRC = {}

SRC["w1c1"] = r'''import numpy as np
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

SRC["w1c2"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34701)
p = 5
A = rng.normal(size=(p, p))
Sigma = A @ A.T / p          # guaranteed PSD by construction

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

SRC["w1c3"] = r'''import numpy as np
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

SRC["w1c4"] = r'''import numpy as np
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

SRC["w2c1"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34710)
n, p = 3000, 6
loadings = np.array([1.0, 0.9, 0.8, -0.2, 0.1, 0.0])   # one dominant factor
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

SRC["w2c2"] = r'''import numpy as np
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

SRC["w2c3"] = r'''import numpy as np
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

SRC["w2c4"] = r'''import numpy as np
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

SRC["w3c1"] = r'''import numpy as np
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

SRC["w3c2"] = r'''import numpy as np
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

SRC["w3c3"] = r'''import numpy as np
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

SRC["w3c4"] = r'''import numpy as np
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

SRC["w4c1"] = r'''import numpy as np
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

SRC["w4c2"] = r'''import numpy as np
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

SRC["w4c3"] = r'''import numpy as np
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

SRC["w4c4"] = r'''import numpy as np
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

SRC["w5c1"] = r'''import numpy as np
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

SRC["w5c2"] = r'''import numpy as np
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

SRC["w5c3"] = r'''import numpy as np
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

SRC["w5c4"] = r'''import numpy as np
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

SRC["w6c1"] = r'''import numpy as np
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

SRC["w6c2"] = r'''import numpy as np
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

SRC["w6c3"] = r'''import numpy as np
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

SRC["w6c4"] = r'''import numpy as np
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

SRC["w7c1"] = r'''import numpy as np
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

SRC["w7c2"] = r'''import numpy as np
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

SRC["w7c3"] = r'''import numpy as np
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

SRC["w7c4"] = r'''import numpy as np
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

SRC["w8c1"] = r'''import numpy as np
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

SRC["w8c2"] = r'''import numpy as np
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

SRC["w8c3"] = r'''import numpy as np
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

SRC["w8c4"] = r'''import numpy as np
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

SRC["w9c1"] = r'''import numpy as np
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

SRC["w9c2"] = r'''import numpy as np
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

SRC["w9c3"] = r'''import numpy as np
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

SRC["w9c4"] = r'''import numpy as np
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

SRC["w10c1"] = r'''import numpy as np
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

SRC["w10c2"] = r'''import numpy as np
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

SRC["w10c3"] = r'''import numpy as np
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

SRC["w10c4"] = r'''import numpy as np
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

def C(name, explain, formula, key):
    return {"name": name, "explain": explain, "formula": formula,
            "code": {"lang": "python", "src": SRC[key], "output": ""}}

WEEK1 = {
    "n": 1,
    "title": "Multivariate data: mean vectors, covariance, and the geometry of dependence",
    "topics": ["mean vectors and covariance matrices", "positive semi-definiteness and quadratic forms",
               "Mahalanobis distance", "why the sample covariance struggles when p is close to n"],
    "concepts": [
        C("The covariance matrix is the sufficient summary of linear dependence",
          "<p>Almost every method in this course starts from the same two objects: a mean vector "
          "and a covariance matrix. The mean vector collects the average level of each variable; "
          "the covariance matrix collects, for every pair of variables, how much they move together. "
          "Nothing about the shape of the joint distribution beyond these two moments is used by PCA, "
          "factor models, ridge, lasso or canonical correlation -- they are all, in one way or another, "
          "linear algebra performed on the covariance matrix.</p> "
          "<p>The snippet below draws two thousand observations of four correlated variables from a known "
          "covariance structure and recovers the sample mean and sample correlation matrix from the data "
          "alone. The recovered correlation matrix matches the structure used to generate the data closely "
          "-- the largest entrywise error is a few hundredths -- which is the ordinary story of the law of "
          "large numbers applied to second moments rather than first ones. What should stick from this "
          "concept is not the numerical agreement itself but the habit: before fitting anything, look at "
          "the covariance or correlation matrix and ask which pairs of variables are actually carrying "
          "the same information. Every later method is a more disciplined way of answering that question.</p>",
          "\\hat\\mu = \\frac{1}{n}\\sum_{i=1}^n x_i, \\qquad "
          "\\hat\\Sigma = \\frac{1}{n-1}\\sum_{i=1}^n (x_i-\\hat\\mu)(x_i-\\hat\\mu)'",
          "w1c1"),
        C("Positive semi-definiteness is not a technicality -- it is what makes a variance a variance",
          "<p>A covariance matrix built from real data is always symmetric positive semi-definite: every "
          "eigenvalue is non-negative, and the quadratic form w'&Sigma;w equals the variance of the linear "
          "combination w'X, which cannot be negative. This is the fact that licenses almost every later "
          "manipulation -- inverting &Sigma; for Mahalanobis distance and ridge, taking its square root for "
          "whitening in canonical correlation, diagonalising it for PCA -- because a symmetric PSD matrix "
          "always has an orthogonal eigenbasis with non-negative eigenvalues.</p> "
          "<p>The snippet constructs a genuine covariance matrix as A A' / p for a random matrix A, which "
          "is PSD by construction, confirms every eigenvalue is non-negative, and then checks the identity "
          "directly: it computes the quadratic form w'&Sigma;w for a random unit direction w and compares "
          "it to the variance of w'X estimated from two hundred thousand Monte Carlo draws. The two numbers "
          "agree to four decimal places. When a matrix that is supposed to be a covariance matrix comes back "
          "with a negative eigenvalue -- which happens constantly with mismatched or asynchronous data, or "
          "with more variables than observations and a shrinkage step skipped -- that is not a rounding "
          "error to ignore; it means the matrix is no longer describing a coherent set of variances.</p>",
          "\\mathrm{Var}(w'X) = w'\\Sigma w \\ge 0 \\ \\ \\forall w \\quad\\Longleftrightarrow\\quad \\Sigma \\succeq 0",
          "w1c2"),
        C("Mahalanobis distance: the metric that respects correlation",
          "<p>Ordinary Euclidean distance treats every direction in variable space as equally likely, which "
          "is wrong the moment two variables are correlated. Mahalanobis distance rescales distance by the "
          "inverse covariance matrix, so that moving along the direction the data naturally varies in (the "
          "long axis of the correlation ellipse) counts for less than moving against it.</p> "
          "<p>The snippet fixes a covariance matrix with correlation 0.9 and compares two points that are "
          "the same Euclidean distance from the origin: one sits along the ridge of high joint density (2, 2) "
          "and the other sits across it (2, -2). Both are 2.83 units away in ordinary distance. Mahalanobis "
          "distance tells a completely different story: 2.05 for the point along the ridge, which is "
          "unremarkable given how correlated these variables are, against 8.94 for the point across the "
          "ridge, which is a genuine outlier relative to the joint distribution. This is exactly the "
          "calculation behind multivariate outlier detection, the density contours of the multivariate "
          "normal, and quadratic discriminant analysis -- and it is the reason a point can look ordinary on "
          "every single variable's histogram and still be extreme once the variables are considered jointly.</p>",
          "D_M(x,\\mu) = \\sqrt{(x-\\mu)'\\,\\Sigma^{-1}\\,(x-\\mu)}",
          "w1c3"),
        C("Why the sample covariance matrix struggles as p approaches n",
          "<p>The sample covariance matrix is an unbiased estimator of &Sigma; entrywise, but that says "
          "nothing about how well-behaved it is as a matrix. As the number of variables p grows toward the "
          "number of observations n, the sample covariance's eigenvalues spread out even when the truth is "
          "as simple as the identity matrix: the smallest eigenvalues are pushed toward zero and the largest "
          "are pushed up, purely from estimation noise, and the condition number explodes.</p> "
          "<p>The snippet draws data with a genuinely spherical (identity) true covariance at four values of "
          "p with n fixed at 60. At p = 5 the estimated eigenvalues range from about 0.47 to 1.55 and the "
          "condition number is a tame 3.3. By p = 55 -- five observations of headroom left -- the range has "
          "stretched to roughly 0.003 to 3.9 and the condition number has exploded past 1,400, even though "
          "every eigenvalue of the true covariance is exactly 1. This single experiment is the reason weeks "
          "2 through 9 exist: PCA, factor models, ridge, lasso and covariance shrinkage are all, from "
          "different angles, techniques for not trusting the raw sample covariance matrix once p gets large "
          "relative to n, and week 7 returns to this exact calculation with the Marchenko-Pastur law that "
          "predicts the spreading precisely.</p>",
          "\\mathrm{cond}(\\hat\\Sigma) = \\lambda_{\\max}(\\hat\\Sigma) \\,/\\, \\lambda_{\\min}(\\hat\\Sigma)",
          "w1c4"),
    ],
    "widget": {
        "type": "heatmap",
        "title": "Four correlated variables: the correlation matrix a multivariate method actually sees",
        "params": {
            "cmap": "div",
            "xlabels": ["V1", "V2", "V3", "V4"],
            "ylabels": ["V1", "V2", "V3", "V4"],
            "matrix": [
                [1.00, 0.70, 0.20, -0.10],
                [0.70, 1.00, 0.10, -0.05],
                [0.20, 0.10, 1.00, 0.60],
                [-0.10, -0.05, 0.60, 1.00],
            ],
        },
    },
    "pitfalls": [
        "Reading a correlation matrix column by column instead of asking which variables form blocks -- the block structure, not any single entry, is what PCA and factor models exploit.",
        "Forgetting that a covariance matrix estimated with more variables than clean observations (after dropping missing rows) is guaranteed to be singular, not just noisy.",
        "Using Euclidean distance to flag outliers in a data set with correlated features, which misses points that are extreme only in the direction the data does not usually vary in.",
        "Treating a small negative eigenvalue from floating-point roundoff as evidence of a modelling error, versus a genuinely rank-deficient covariance matrix from p > n -- the fix (symmetrize and clip) differs by cause.",
    ],
    "check": [
        {"q": "A covariance matrix has an eigenvalue of -0.02. What does this most likely indicate?",
         "options": ["The variables are perfectly correlated", "It was estimated with p close to or exceeding n, or built inconsistently (e.g. pairwise-complete correlations)",
                     "The mean vector was computed incorrectly", "Nothing -- covariance matrices routinely have small negative eigenvalues"],
         "answer": 1,
         "why": "A true population covariance matrix cannot have a negative eigenvalue; a small negative one signals either p at or beyond n, or an inconsistent estimation procedure (like pairwise-complete correlations that don't come from one common data matrix), not routine noise."},
        {"q": "Two points are the same Euclidean distance from the mean of a correlated bivariate distribution. Point A lies along the direction of highest joint density; point B lies across it. Which has the larger Mahalanobis distance?",
         "options": ["Point A", "Point B", "They are always equal", "It depends only on the mean, not the covariance"],
         "answer": 1,
         "why": "Mahalanobis distance divides by the inverse covariance, so directions of low natural variance (across the correlation ridge) are penalised more -- point B is the more unusual observation even though the raw Euclidean distances match."},
        {"q": "As p grows toward n with a genuinely spherical true covariance (every true eigenvalue equal to 1), what happens to the sample covariance's eigenvalues?",
         "options": ["They all converge to 1, just more slowly", "They spread out: the smallest shrink toward 0 and the largest grow, even though the truth is flat",
                     "They become negative", "Nothing changes -- eigenvalue estimation is unaffected by p/n"],
         "answer": 1,
         "why": "This is the eigenvalue-spreading phenomenon behind the Marchenko-Pastur law (week 7): pure estimation noise stretches the spectrum of the sample covariance as p/n grows, independent of any real structure."},
        {"q": "Why do PCA, ridge regression and canonical correlation all require manipulating the covariance matrix as a whole (eigendecomposition, inversion, square roots) rather than working entry by entry?",
         "options": ["Because software libraries are optimised for matrix operations", "Because these methods are defined by what a covariance matrix does to a direction in variable space (its quadratic form and eigenstructure), not by any single pairwise correlation",
                     "Because entrywise operations are always numerically unstable", "There is no real reason; it is a stylistic convention"],
         "answer": 1,
         "why": "PCA finds directions of maximal quadratic-form variance, ridge shrinks along the covariance's own eigendirections, and CCA whitens by the inverse square root of two covariance matrices -- all of these are properties of the matrix as an operator on vectors, not of any individual entry."},
    ],
}

WEEK2 = {
    "n": 2,
    "title": "Principal component analysis: eigendecomposition as dimension reduction",
    "topics": ["PCA as eigendecomposition of the covariance matrix", "how many components: variance explained and the elbow",
               "interpreting loadings: level, slope and curvature", "reconstruction error and PCA as compression"],
    "concepts": [
        C("PCA is the eigendecomposition of the covariance matrix, nothing more exotic",
          "<p>Principal component analysis finds the direction in variable space along which the data "
          "varies the most, then the next direction orthogonal to it with the most remaining variance, "
          "and so on. That description is exactly the eigendecomposition of the covariance matrix: the "
          "eigenvector with the largest eigenvalue is the first principal component, and the eigenvalue "
          "itself is the variance captured along that direction. There is no separate 'PCA algorithm' to "
          "learn beyond np.linalg.eigh applied to a covariance matrix and a sort by eigenvalue.</p> "
          "<p>The snippet builds six variables driven by one dominant common factor plus idiosyncratic "
          "noise, so there is a known right answer for what the first principal component should look "
          "like. The first eigenvalue captures about 85% of total variance -- far more than any of the "
          "other five directions -- and the cosine similarity between the first eigenvector and the true "
          "factor-loading direction comes out at 1.00 once sign ambiguity is accounted for (PCA can flip "
          "the sign of a component; only the direction is identified). When a data set genuinely has one "
          "strong common driver, PCA recovers it automatically, with no labels and no supervision.</p>",
          "\\Sigma v_k = \\lambda_k v_k, \\qquad \\lambda_1 \\ge \\lambda_2 \\ge \\cdots \\ge \\lambda_p \\ge 0",
          "w2c1"),
        C("How many components to keep: variance explained and the elbow",
          "<p>Every eigenvalue of the covariance matrix is the variance along one principal direction, and "
          "the eigenvalues always sum to the total variance of the data. Dividing the cumulative sum of the "
          "top k eigenvalues by the total gives the fraction of variance explained by the first k "
          "components -- a single increasing curve that is the standard tool for deciding how many "
          "components to keep. The 'elbow' is the point where adding another component stops buying much.</p>"
          "<p>The snippet builds ten variables driven by three real, unequally strong latent factors plus "
          "noise, and prints the cumulative variance-explained curve component by component. The first "
          "three components alone capture about 90% of total variance; the remaining seven components -- "
          "which are mostly idiosyncratic noise -- add only about ten percentage points combined, spread "
          "almost evenly across them. That flat tail after component three is the elbow: a visible kink from "
          "steep early gains to a nearly flat noise floor. In practice this table (or its plot) is read "
          "before any other multivariate technique is applied to the same data, because it tells you how "
          "many genuine dimensions the data actually has.</p>",
          "\\text{fraction explained by first }k = \\dfrac{\\sum_{i=1}^k \\lambda_i}{\\sum_{i=1}^p \\lambda_i}",
          "w2c2"),
        C("Reading loadings: the classic level, slope and curvature decomposition",
          "<p>A principal component is only useful once its loadings -- the entries of its eigenvector -- "
          "are interpreted. The textbook example is a panel of interest rates across maturities: the first "
          "component almost always has loadings that are roughly equal and same-signed across every "
          "maturity (a parallel shift, called 'level'), the second component's loadings change sign once as "
          "maturity increases (a steepening or flattening, called 'slope'), and the third changes sign "
          "twice ('curvature'). This pattern is not particular to interest rates; it shows up whenever the "
          "underlying variables are ordered along some axis (maturity, moneyness, time) with smoothly "
          "decaying correlation between neighbours.</p> "
          "<p>The snippet simulates ten maturities driven by exactly this level/slope/curvature structure "
          "plus small pricing noise, and PCA recovers it: the first two components alone explain about "
          "68% and 30% of variance, the first component's loadings are close to flat and same-signed "
          "across every maturity, and the second component's loadings change sign exactly once, from "
          "positive at the short end to negative at the long end. This is why 'the first few principal "
          "components of the yield curve' is standard vocabulary well beyond this course -- the same "
          "decomposition reappears anywhere a curve, not a point, is the object of interest.</p>",
          "z_k = v_k'(x-\\bar x), \\qquad x \\approx \\bar x + \\sum_{k} z_k v_k",
          "w2c3"),
        C("PCA as lossy compression: reconstruction error versus the number of components kept",
          "<p>Keeping only the top k principal components and discarding the rest is a form of lossy "
          "compression: each observation is approximated by projecting it onto the k-dimensional subspace "
          "spanned by the top eigenvectors and reading off its coordinates there. The reconstruction error "
          "-- the sum of squared differences between the original data and its k-component approximation -- "
          "is exactly the sum of the eigenvalues that were dropped, scaled by the sample size.</p> "
          "<p>The snippet builds data with an exact rank-3 signal (eight variables, three genuine underlying "
          "dimensions) plus noise, and tracks reconstruction error as k goes from 1 to 8. Reconstruction "
          "error falls sharply through k = 3 -- capturing about 97% of variance kept -- and then keeps "
          "falling only slowly for k = 4 through 7, before dropping to exactly zero at k = 8 (keeping every "
          "component reconstructs the data exactly, since PCA is an orthogonal change of basis with no "
          "information loss when nothing is dropped). This is the same elbow logic as variance explained, "
          "phrased as a compression trade-off: it is the argument for using PCA to reduce forty correlated "
          "predictors to three or four scores before feeding them into a regression, discussed further in "
          "week 3's statistical factor models and revisited in week 10's model comparison.</p>",
          "\\hat X_k = X V_k V_k', \\qquad \\|X-\\hat X_k\\|_F^2 = n\\!\\sum_{i=k+1}^{p} \\lambda_i",
          "w2c4"),
    ],
    "widget": {
        "type": "heatmap",
        "title": "Loadings of eight variables on the first three principal components",
        "params": {
            "cmap": "div",
            "xlabels": ["PC1", "PC2", "PC3"],
            "ylabels": ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"],
            "matrix": [
                [0.55, 0.10, 0.05],
                [0.50, 0.08, -0.10],
                [0.48, -0.30, 0.05],
                [0.05, 0.55, 0.10],
                [0.02, 0.50, -0.05],
                [0.10, 0.45, 0.15],
                [0.03, 0.05, 0.60],
                [0.01, -0.05, 0.55],
            ],
        },
    },
    "pitfalls": [
        "Reporting a principal component's sign as if it were meaningful -- PCA identifies a direction, not an orientation, so 'high PC1' is only meaningful relative to how you defined the sign.",
        "Running PCA on raw variables with very different scales (e.g. a return in percent next to a level in dollars) without standardising first, which makes the highest-variance variable dominate every component regardless of its actual informativeness.",
        "Treating the top few components as 'the' factors without checking whether their loadings are stable across sub-samples -- statistical factors extracted from a short or noisy window can be an artifact of that window.",
        "Using variance explained alone to choose k when the actual downstream goal is prediction -- the components that explain the most variance in X are not guaranteed to be the ones correlated with y (see week 10's PCR versus supervised alternatives).",
    ],
    "check": [
        {"q": "PCA is applied twice to the same data set with two different random number generator seeds. The first principal component's loadings come back with every sign flipped between the two runs. What happened?",
         "options": ["A bug in the implementation", "Nothing wrong -- eigenvectors are only identified up to sign, and both are equally valid",
                     "The data must not be centred", "PCA is not deterministic"],
         "answer": 1,
         "why": "An eigenvector v and -v satisfy the same eigenvalue equation and explain identical variance; PCA (and the standard eigensolvers used to compute it) identifies the axis, not a direction along it."},
        {"q": "A cumulative variance-explained curve rises steeply to 90% by the third component and then rises only to 97% by the tenth. What does this pattern usually indicate?",
         "options": ["The data has exactly ten independent sources of variation", "The data is well approximated by about three real underlying dimensions, with the rest mostly noise",
                     "PCA has failed and should be re-run with standardised variables", "There is no information at all in components 4 through 10"],
         "answer": 1,
         "why": "The 'elbow' where the variance-explained curve flattens is the standard signal that the effective dimensionality of the data is around the number of components before the elbow, with the remaining components mostly capturing idiosyncratic noise."},
        {"q": "In the classic level/slope/curvature decomposition of a yield curve's principal components, what does it mean for the second component's loadings to change sign exactly once across maturities?",
         "options": ["It is a numerical artifact to be ignored", "The component represents a steepening or flattening of the curve -- short and long maturities move in opposite directions",
                     "It means the model is misspecified", "It means the second component explains more variance than the first"],
         "answer": 1,
         "why": "A loading pattern that is positive at short maturities and negative at long maturities (or vice versa) moves the short and long end of the curve in opposite directions -- exactly what a change in slope looks like."},
        {"q": "Keeping k = p (all) principal components and reconstructing the data gives exactly zero reconstruction error. Why?",
         "options": ["Because PCA always overfits", "Because the eigenvectors form a complete orthogonal basis, so keeping all of them is just an orthogonal change of coordinates with no information discarded",
                     "Because the data was noiseless to begin with", "This is only true if the data is Gaussian"],
         "answer": 1,
         "why": "PCA is a rotation of coordinates; discarding components is what causes information loss. With none discarded, the transform and its inverse are exact, regardless of the data's distribution."},
    ],
}

WEEK3 = {
    "n": 3,
    "title": "Factor models: statistical and fundamental decompositions of covariance",
    "topics": ["the factor model X = BF + e and identification", "PCA-based statistical factor estimation",
               "fundamental factor models and cross-sectional regression", "factor rotation and non-uniqueness"],
    "concepts": [
        C("The factor model X = BF + e, and the communality/uniqueness split it produces",
          "<p>A factor model writes each variable as a loading times a common factor plus an idiosyncratic "
          "term: x_i = b_i f + e_i. If the factor f were observed, estimating b_i is one regression per "
          "variable, and the resulting variance decomposition splits each variable's variance into a "
          "'communality' (the part explained by the common factor, b_i^2 Var(f)) and a 'uniqueness' (the "
          "idiosyncratic residual variance). This is the same X = BF + e structure that underlies CAPM-style "
          "single-factor models, arbitrage pricing theory, and every fundamental risk model used in "
          "portfolio construction.</p> "
          "<p>The snippet simulates six variables with a known single factor and known loadings ranging "
          "from 1.2 down to 0.0, estimates the loadings by regressing each variable on the (here, known) "
          "factor, and reports communality and uniqueness for each. Loadings are recovered almost exactly. "
          "Communality tracks loading size as expected: the variable with the largest true loading (1.2) "
          "has communality around 0.94 (94% of its variance is explained by the common factor), while the "
          "variable with zero true loading has communality near 0 -- its variance is pure idiosyncratic "
          "noise. Communality and uniqueness sum to 1 for each variable by construction of the "
          "decomposition, which is a useful arithmetic check whenever you compute one from data.</p>",
          "x_{it} = b_i f_t + e_{it}, \\qquad \\mathrm{Var}(x_i) = \\underbrace{b_i^2\\,\\mathrm{Var}(f)}_{\\text{communality}} + \\underbrace{\\mathrm{Var}(e_i)}_{\\text{uniqueness}}",
          "w3c1"),
        C("Statistical factors: when the factor itself is not observed, PCA estimates it",
          "<p>Week 2's PCA and week 3's factor model are the same mathematics applied to different "
          "questions. A statistical (PCA-based) factor model treats the unobserved factor as whatever "
          "linear combination of the variables captures the most common variance -- which is exactly the "
          "first principal component. This works well when there really is one dominant driver, and it "
          "requires no economic theory about what the factor 'is': the data tells you.</p> "
          "<p>The snippet simulates eight variables driven by a single hidden factor that is never revealed "
          "to the estimation procedure, extracts the first principal component as a candidate statistical "
          "factor, and checks how well it recovers the truth. The statistical factor explains about 81% of "
          "total variance and correlates with the true, unobserved factor at 0.983 -- a near-perfect "
          "recovery -- and the estimated loading direction lines up closely with the true loading "
          "direction, entry by entry. This is precisely the machinery FINM 36700 leans on when it uses "
          "PCA-derived statistical factors for risk attribution: the factor doesn't need a name to be "
          "useful, only a demonstrated ability to explain common variance out of sample.</p>",
          "\\hat f_t = v_1'(x_t - \\bar x), \\qquad v_1 = \\text{first eigenvector of }\\hat\\Sigma",
          "w3c2"),
        C("Fundamental factor models: cross-sectional regression at every date",
          "<p>A fundamental factor model goes the other direction from a statistical one: instead of "
          "extracting factors from the covariance matrix, it starts with observable characteristics "
          "(size, value, industry, momentum) and, at every date, regresses that date's cross-section of "
          "returns on the characteristics. The regression coefficients at each date are that period's "
          "'factor returns' -- the return to a one-unit exposure on each characteristic -- and averaging "
          "them across many dates, with a standard error, tests whether a characteristic carries a "
          "genuine risk premium. This is the Fama-MacBeth procedure, and it is the standard way index "
          "providers and risk-model vendors build style factors like size and value.</p> "
          "<p>The snippet simulates 240 months of cross-sectional returns for 50 assets, where size and "
          "value characteristics carry small but genuine monthly premia (0.4% and 0.2%) buried in "
          "substantial idiosyncratic noise, runs the cross-sectional regression every month, and reports "
          "the time-series average of each month's factor return with its t-statistic. Both premia come "
          "back with t-statistics comfortably above 3 -- size and value are correctly identified as priced "
          "-- while the intercept, which has no true premium, shows a t-statistic under 1. The key "
          "structural point is that this method needs no factor extraction at all: each month's regression "
          "stands alone, and it is only the averaging across months that produces a stable estimate.</p>",
          "r_{it} = \\gamma_{0t} + \\gamma_{1t}\\,\\text{size}_i + \\gamma_{2t}\\,\\text{value}_i + \\epsilon_{it}",
          "w3c3"),
        C("Factor rotation: why 'the' factors are not uniquely defined",
          "<p>A factor model's fitted covariance depends on the loadings only through B B' (in the "
          "single-factor case) or, more generally, through B F' summed appropriately -- and that product "
          "is unchanged if B and F are both rotated by the same orthogonal matrix R, since R R' = I. This "
          "means factor models are identified only up to rotation: 'the' two factors extracted from a "
          "given covariance structure are not unique, and a different but equally valid rotation can "
          "produce loadings that look completely different while implying the exact same covariance "
          "matrix and the exact same fitted values.</p> "
          "<p>The snippet builds a genuine two-factor model, then rotates both the loadings and the "
          "factors by a fixed orthogonal rotation matrix and checks two things: whether the reconstructed "
          "data F B' changes (it does not, to machine precision) and whether the implied covariance B B' "
          "changes (it does not either). This non-uniqueness is not a flaw to be fixed; it is why "
          "fundamental factor models are often preferred in practice despite being messier statistically "
          "-- the characteristics fix the rotation by construction (there is no ambiguity about which "
          "factor is 'size') -- while purely statistical factor models require an extra choice of rotation "
          "(such as varimax) before the factors can be given any economic interpretation at all.</p>",
          "BF' = (BR)(FR)' \\quad \\text{for any orthogonal } R \\text{ (} RR'=I \\text{)}",
          "w3c4"),
    ],
    "widget": {
        "type": "regression",
        "title": "A single-factor regression: one asset's returns against the common factor",
        "params": {"n": 50, "beta": 0.9, "noise": 1.1, "seed": 34703, "show_resid": True},
    },
    "pitfalls": [
        "Interpreting a statistical (PCA-derived) factor's sign or scale as economically meaningful without checking loadings -- the factor is identified only up to a sign flip and a scale, and the loadings are what carry meaning.",
        "Running a fundamental factor regression with characteristics that are themselves highly correlated (e.g. size and low-price) and reading each coefficient as if the others were held perfectly fixed.",
        "Forgetting that communality and uniqueness are model-relative: a variable's uniqueness under a one-factor model can become communality once a second factor is added.",
        "Comparing 'the loadings' from two different statistical factor extractions (different samples, different software) without first checking whether a rotation reconciles them -- an apparent disagreement can be pure rotation, not a real difference.",
    ],
    "check": [
        {"q": "In a one-factor model, a variable has communality 0.85. What does this mean?",
         "options": ["85% of the variable's observations are missing", "85% of the variable's variance is explained by the common factor; the remaining 15% is idiosyncratic",
                     "The variable's correlation with every other variable is 0.85", "The factor loading equals 0.85"],
         "answer": 1,
         "why": "Communality is the fraction of a variable's total variance attributable to the common factor(s); the complement is uniqueness (idiosyncratic variance)."},
        {"q": "A statistical (PCA-based) factor model and a fundamental (characteristic-based) factor model are fit to the same return panel. Why might their 'factor returns' look completely different even if both fit the data well?",
         "options": ["One of the two models must be wrong", "Statistical factors are identified only up to an arbitrary rotation, while fundamental factors are pinned down by the choice of characteristics -- the two are not directly comparable without care",
                     "Fundamental models never fit as well as statistical ones", "Statistical factor models cannot be estimated from returns data"],
         "answer": 1,
         "why": "The rotational non-uniqueness of statistical factor models means there is no single 'the' PCA factor to compare against a named characteristic like size or value; only the span of several rotated factors, or an explicit rotation to match, is comparable."},
        {"q": "In a Fama-MacBeth style fundamental factor model, why is the cross-sectional regression run separately at every date rather than pooled across all dates at once?",
         "options": ["Pooled regression is computationally infeasible", "Running it separately produces one factor-return observation per date, whose time-series average and standard error are what test whether the characteristic is priced",
                     "It is purely a historical convention with no statistical purpose", "Pooling would violate the linear regression assumptions"],
         "answer": 1,
         "why": "The date-by-date factor returns form a time series that can be averaged and tested with a standard error, which is exactly what lets the method distinguish a genuine risk premium from noise -- a single pooled regression would not deliver that time-series of estimates."},
        {"q": "Two factor loadings matrices B and B_rot = B R (R orthogonal) produce identical fitted covariances. What is the correct conclusion?",
         "options": ["One of the two must contain an error", "Factor models identify the space spanned by the factors, not a unique set of loadings, so both are equally valid representations",
                     "R must be the identity matrix", "The covariance matrix itself must be singular"],
         "answer": 1,
         "why": "Because R R' = I for an orthogonal R, B R (F R)' = B F' exactly -- the model is rotation-invariant, so multiple loading matrices can represent the identical fitted structure."},
    ],
}

WEEK4 = {
    "n": 4,
    "title": "Canonical correlation analysis: the sharpest linear relationship between two blocks",
    "topics": ["CCA as a generalised eigenproblem", "canonical variates versus simple correlation and PCA",
               "testing how many canonical pairs are real", "where CCA overfits in small samples"],
    "concepts": [
        C("CCA finds the linear combination of each block that correlates most with the other",
          "<p>Given two blocks of variables X and Y measured on the same observations, canonical "
          "correlation analysis asks: what linear combination a'X of the first block correlates most "
          "strongly with some linear combination b'Y of the second? The answer is found by whitening "
          "each block by its own inverse square-root covariance and taking the singular value "
          "decomposition of the resulting cross-covariance; the singular values are the canonical "
          "correlations, and the singular vectors, transformed back, give the canonical directions a "
          "and b. It is PCA's eigenproblem generalised from one block to the relationship between two.</p> "
          "<p>The snippet builds two three-variable blocks driven by two shared latent drivers with some "
          "cross-loading, computes both canonical correlations, and directly verifies the construction by "
          "computing the correlation between the resulting canonical variates u = Xa and v = Yb. The first "
          "canonical correlation comes out around 0.92, and the direct correlation check matches it to "
          "three decimal places -- confirming the SVD machinery is doing exactly what it claims: finding "
          "the single best-correlated pair of directions, one per block, rather than any raw pairwise "
          "correlation between individual variables.</p>",
          "\\max_{a,\\,b}\\ \\mathrm{corr}(a'X,\\,b'Y) \\ \\Longleftrightarrow\\ \\text{SVD of }\\ \\Sigma_{XX}^{-1/2}\\Sigma_{XY}\\Sigma_{YY}^{-1/2}",
          "w4c1"),
        C("CCA versus the best single-variable pair: what combining variables buys you",
          "<p>A natural question before reaching for canonical correlation is: why not just find the "
          "single pair of variables (one from each block) with the highest simple correlation? The answer "
          "is that CCA can do strictly better, because it is allowed to combine information across every "
          "variable in each block rather than picking just one.</p> "
          "<p>The snippet builds a three-variable X block and a two-variable Y block that share a common "
          "underlying driver spread across two variables in each block (rather than concentrated in one), "
          "computes the best simple pairwise correlation across every combination of one X variable and "
          "one Y variable, and compares it to the first canonical correlation. The best single pair "
          "achieves about 0.29; the first canonical correlation reaches about 0.43 -- a meaningful gain of "
          "roughly 0.13 from being allowed to pool information across variables within each block rather "
          "than relying on any one of them alone. This is the practical case for CCA over a correlation "
          "matrix scan: whenever the true relationship between two groups of variables is diffuse rather "
          "than concentrated in one pair, CCA finds structure that a pairwise search misses entirely.</p>",
          None,
          "w4c2"),
        C("How many canonical pairs are real: a permutation test for significance",
          "<p>CCA with p1 variables in X and p2 in Y always returns min(p1, p2) canonical correlations, "
          "and every one of them is non-negative by construction of the SVD -- so a non-zero canonical "
          "correlation is not, by itself, evidence of a genuine relationship. A permutation test supplies "
          "the missing null distribution directly: randomly shuffle the rows of Y relative to X (which "
          "destroys any true association while preserving each block's own covariance structure), "
          "recompute the canonical correlations many times, and compare the observed value to that null.</p> "
          "<p>The snippet builds two three-variable blocks that share exactly one genuine common driver, "
          "so only the first of the three canonical correlations should be real. Five hundred permutations "
          "of Y's rows produce a null distribution for the largest canonical correlation achievable by "
          "chance alone. The observed first canonical correlation gets a permutation p-value around 0.02 "
          "-- genuinely significant -- while the second and third canonical correlations, which have no "
          "true counterpart, get p-values of roughly 0.8 and 1.0: indistinguishable from what pure chance "
          "produces. This is the correct way to decide how many of the min(p1, p2) canonical pairs to "
          "actually interpret, rather than reporting all of them as if each were equally meaningful.</p>",
          "p\\text{-value} = \\Pr_{\\text{permutation}}\\!\\big(\\rho_1^{\\text{perm}} \\ge \\rho_1^{\\text{obs}}\\big)",
          "w4c3"),
        C("CCA overfits badly in small samples once p is not tiny relative to n",
          "<p>Canonical correlation analysis inherits the same small-sample fragility that plagues every "
          "other method built on inverting a covariance matrix: with p variables in each block and only "
          "n observations, CCA has p^2-ish degrees of freedom to find a spuriously strong linear "
          "combination, even when the two blocks are genuinely independent. The overfitting gets worse "
          "quickly as p grows relative to n, exactly mirroring week 1's covariance-estimation warning and "
          "foreshadowing week 7's treatment of high-dimensional covariance estimation.</p> "
          "<p>The snippet generates two completely independent blocks of p variables each (by construction, "
          "the true canonical correlations are all exactly zero) with n fixed at 60, and computes the "
          "largest canonical correlation CCA finds anyway as p increases. At p = 2 the spurious canonical "
          "correlation is already a non-trivial 0.25; by p = 20 -- a third of the sample size, per block "
          "-- it has climbed to 0.91, which looks like an almost perfect relationship despite there being "
          "none at all. Every one of these numbers is pure overfitting, since X and Y were built with no "
          "relationship whatsoever. The takeaway is blunt: CCA between two blocks of even moderate "
          "dimension needs either a large sample, a permutation test as in the previous concept, or "
          "regularisation (a ridge-like penalty added to each within-block covariance) before its "
          "canonical correlations can be trusted at face value.</p>",
          None,
          "w4c4"),
    ],
    "widget": {
        "type": "heatmap",
        "title": "Cross-covariance between two blocks of variables -- the raw material CCA whitens",
        "params": {
            "cmap": "div",
            "xlabels": ["Y1", "Y2"],
            "ylabels": ["X1", "X2", "X3"],
            "matrix": [[0.42, 0.18], [0.35, 0.44], [0.05, -0.10]],
        },
    },
    "pitfalls": [
        "Reporting the first canonical correlation as evidence of a real relationship without a permutation or other significance test -- CCA always returns min(p1,p2) non-negative numbers whether or not any true relationship exists.",
        "Running CCA with p1 or p2 not small relative to n and trusting the result at face value, when the canonical correlations of two genuinely independent blocks can already look large from overfitting alone.",
        "Interpreting canonical loadings (a and b) the way you would interpret regression coefficients on the original variables, without accounting for the scale and correlation structure the whitening step already absorbed.",
        "Forgetting that CCA is symmetric in X and Y -- unlike a regression of Y on X, there is no natural 'dependent' block, so the canonical variates should not be read as predictions.",
    ],
    "check": [
        {"q": "CCA is run on a 4-variable block and a 6-variable block. How many canonical correlations does it return, and can any of them be negative?",
         "options": ["6, and yes they can be negative", "4 (min of the two block sizes), and no -- singular values are always non-negative",
                     "10 (the sum), and no", "24 (the product), and yes"],
         "answer": 1,
         "why": "CCA returns min(p1, p2) canonical correlations because that is the rank of the whitened cross-covariance matrix, and they are singular values of that matrix, which are always non-negative by definition."},
        {"q": "Why can CCA find a stronger relationship between two blocks than the best single pairwise correlation between one variable from each block?",
         "options": ["It cannot; CCA is always weaker than the best simple correlation", "CCA is free to combine information across every variable within each block, capturing a relationship that is spread out rather than concentrated in one variable pair",
                     "CCA uses a different, laxer definition of correlation", "It only appears stronger due to a scaling artifact"],
         "answer": 1,
         "why": "The canonical variates are optimised linear combinations across all variables in each block, so when the true shared signal is spread across several variables, CCA captures more of it than any single-variable comparison can."},
        {"q": "Two blocks of 20 independent (unrelated) variables each are measured on 60 observations. CCA reports a first canonical correlation of 0.91. What is the correct interpretation?",
         "options": ["A very strong genuine relationship has been found", "This is very likely overfitting: with p this large relative to n, even independent blocks produce spuriously high canonical correlations",
                     "The result proves the two blocks share a hidden factor", "CCA cannot be run on independent data, so this indicates a coding error"],
         "answer": 1,
         "why": "With p a substantial fraction of n, CCA has enough free parameters to find a spuriously strong combination even between truly independent blocks -- exactly what the permutation-test and small-sample concepts in this week demonstrate directly."},
        {"q": "A permutation test for CCA shuffles the rows of Y relative to X before recomputing canonical correlations many times. What does this destroy, and what does it preserve?",
         "options": ["It destroys each block's own covariance structure but preserves the cross-relationship", "It destroys any true relationship between X and Y while preserving each block's own within-block covariance structure",
                     "It destroys nothing; permutation has no effect on CCA", "It preserves the exact original canonical correlations"],
         "answer": 1,
         "why": "Shuffling which Y row goes with which X row breaks any true X-Y association while leaving each block's internal covariance (and hence its own eigenstructure) intact, which is exactly the right null for testing cross-block association."},
    ],
}

WEEK5 = {
    "n": 5,
    "title": "Regularized regression I: ridge and the bias-variance trade",
    "topics": ["ridge as penalized least squares with a closed form", "the bias-variance trade-off across lambda",
               "ridge's connection to PCA: shrinking small-variance directions", "choosing lambda by cross-validation"],
    "concepts": [
        C("Ridge regression: a closed form that tames multicollinearity",
          "<p>Ridge regression adds an L2 penalty &lambda;&Vert;&beta;&Vert;_2^2 to the ordinary least "
          "squares objective, which changes the normal equations from X'X&beta; = X'y to (X'X + "
          "&lambda;I)&beta; = X'y. Adding &lambda;I to X'X before inverting is the entire algorithm: it "
          "makes the matrix being inverted better conditioned (every eigenvalue is pushed up by exactly "
          "&lambda;), which is precisely the fix multicollinear regressors need, since multicollinearity "
          "is a near-zero eigenvalue of X'X causing wild, unstable coefficients.</p> "
          "<p>The snippet builds five predictors where the first two are nearly identical (differing only "
          "by tiny noise), so X'X is badly conditioned -- the condition number comes out around 5,100. "
          "Ordinary least squares splits credit between the two collinear predictors almost arbitrarily "
          "(0.94 and 0.96, versus true values of 1.0 and 1.0, not a large distortion here but one that "
          "grows quickly with more collinearity), while a modest ridge penalty of &lambda; = 5 pulls both "
          "toward more moderate, more stable values without changing the sign or rough size of any "
          "coefficient. This is the mechanical story of ridge: it does not decide which of two collinear "
          "predictors matters more, it just refuses to let the fit blow up chasing an answer to that "
          "question that the data cannot actually supply.</p>",
          "\\hat\\beta_{\\text{ridge}} = (X'X + \\lambda I)^{-1} X'y",
          "w5c1"),
        C("The bias-variance trade-off, made numeric",
          "<p>Ridge trades bias for variance: as &lambda; grows, coefficient estimates are pulled toward "
          "zero (introducing bias, since the true coefficients are rarely exactly zero), but the "
          "estimator's variance falls, because it is less sensitive to the particular noise realised in "
          "any one sample. The mean squared error of the coefficient estimate is the sum of squared bias "
          "and variance, and for a well-chosen &lambda; the variance reduction more than pays for the "
          "bias introduced -- producing a U-shaped MSE curve with an interior minimum.</p> "
          "<p>The snippet runs three hundred independent simulated data sets (ten predictors, forty "
          "observations -- deliberately data-starved) at eight values of &lambda; and averages the "
          "squared error between estimated and true coefficients at each. The MSE falls steadily from "
          "0.318 at &lambda; = 0 (plain OLS) down to a minimum of about 0.217 around &lambda; = 10, then "
          "rises again to 0.437 by &lambda; = 50 as the bias from over-shrinking starts to dominate. That "
          "U-shape, traced out numerically rather than asserted, is the entire justification for tuning "
          "&lambda; rather than either ignoring regularisation or maximising it.</p>",
          "\\mathrm{MSE}(\\hat\\beta) = \\mathrm{Bias}(\\hat\\beta)^2 + \\mathrm{Var}(\\hat\\beta)",
          "w5c2"),
        C("Ridge and PCA are the same idea: shrink the low-variance directions hardest",
          "<p>Ridge regression's effect on a fitted model can be described entirely in the coordinate "
          "system of X's own principal components: writing X's singular values as d_1 &ge; ... &ge; d_p, "
          "ridge shrinks the coefficient along the k-th principal direction by a factor d_k^2 / (d_k^2 + "
          "&lambda;). Directions with large singular values (high-variance, well-estimated directions) are "
          "barely shrunk; directions with small singular values (low-variance, poorly-estimated, exactly "
          "the directions multicollinearity creates) are shrunk almost to zero. Summing these shrinkage "
          "factors gives the model's 'effective degrees of freedom' -- a single number between 0 and p "
          "that measures how much flexibility the fit is actually using.</p> "
          "<p>The snippet builds six predictors with singular values ranging from 3.0 down to 0.05 (a "
          "sharply decaying spectrum, much like real financial data) and reports the per-direction "
          "shrinkage factor at four values of &lambda;. At &lambda; = 10, the two strongest directions "
          "keep shrinkage factors above 0.95, while the weakest direction is shrunk to 0.038 -- almost "
          "entirely suppressed -- and effective degrees of freedom drops from 6.0 (no shrinkage) to 3.79. "
          "This is the exact mechanism connecting ridge to week 2's PCA and to week 7's covariance "
          "shrinkage: all three methods distrust the same thing, a covariance or design matrix's smallest "
          "eigenvalues, for the same reason.</p>",
          "\\mathrm{df}(\\lambda) = \\sum_{j=1}^p \\frac{d_j^2}{d_j^2+\\lambda}",
          "w5c3"),
        C("Choosing lambda without knowing the truth: cross-validation",
          "<p>Every diagnostic in this week so far compared an estimate to a known truth, which is exactly "
          "what is never available with real data. Cross-validation solves the practical version of the "
          "problem: split the data into K folds, fit ridge on K-1 of them at each candidate &lambda;, "
          "measure prediction error on the held-out fold, and average across all K choices of which fold "
          "is held out. The &lambda; with the lowest average out-of-sample error is the one actually used.</p> "
          "<p>The snippet builds a sparse eight-predictor model (only three of eight true coefficients are "
          "non-zero) with substantial noise, and runs five-fold cross-validation across seven candidate "
          "&lambda; values. CV error falls from 2.583 at &lambda; = 0 to a minimum of 2.571 at &lambda; = "
          "5.0, then rises again to 2.599 by &lambda; = 20 -- the same U-shape as the previous concept, "
          "but built entirely from held-out prediction error rather than from knowledge of the true "
          "coefficients, which is the only version of this procedure available outside a simulation. This "
          "cross-validation loop, or a close variant of it, is what selects the tuning parameter for every "
          "regularised method in this course, including lasso in the next week.</p>",
          "\\widehat{\\mathrm{CV}}(\\lambda) = \\frac{1}{K}\\sum_{k=1}^K \\frac{1}{|F_k|}\\sum_{i \\in F_k} (y_i - \\hat y_i^{(-k)})^2",
          "w5c4"),
    ],
    "widget": {
        "type": "regression",
        "title": "Least squares under near-collinearity: the fit that ridge regularises",
        "params": {"n": 60, "beta": 1.0, "noise": 1.0, "seed": 34740, "show_resid": True},
    },
    "pitfalls": [
        "Standardising predictors after (rather than before) choosing lambda -- the penalty lambda*||beta||^2 is only comparable across coefficients when the predictors are on a common scale.",
        "Reading a ridge coefficient's shrinkage toward zero as evidence that a predictor 'doesn't matter' -- ridge shrinks every coefficient, including genuinely important ones on strong predictors, just by less.",
        "Choosing lambda by looking at which value makes the coefficients 'look reasonable' rather than by cross-validated prediction error -- the two criteria can disagree.",
        "Forgetting that ridge never sets a coefficient to exactly zero -- if the goal is variable selection rather than just stabilising a fit, lasso (next week) is the right tool, not ridge.",
    ],
    "check": [
        {"q": "Two predictors in a regression are nearly perfectly correlated with each other. What is the effect on ordinary least squares, and what does ridge change?",
         "options": ["OLS is unaffected; ridge introduces the instability", "OLS coefficients on the two predictors become unstable and can take extreme, arbitrary-looking values; ridge stabilises them by adding lambda to every eigenvalue of X'X before inverting",
                     "Both OLS and ridge are equally unstable in this case", "Collinearity only affects the intercept, not the slopes"],
         "answer": 1,
         "why": "Near-collinearity means X'X has a near-zero eigenvalue, which OLS's inversion amplifies into huge coefficient variance; adding lambda*I raises every eigenvalue by lambda, directly fixing the near-singularity."},
        {"q": "As lambda increases from 0, what happens to the bias and variance of the ridge coefficient estimate?",
         "options": ["Both increase", "Both decrease", "Bias increases, variance decreases", "Bias decreases, variance increases"],
         "answer": 2,
         "why": "Shrinking coefficients toward zero when the truth is generally non-zero introduces bias, but it also makes the estimate less sensitive to the particular noise in the sample, which is exactly what lowers variance."},
        {"q": "Ridge shrinks a coefficient's contribution along a given principal direction of X by a factor d^2/(d^2+lambda). Which directions are shrunk the most?",
         "options": ["Directions with the largest singular value d", "Directions with the smallest singular value d -- the ones estimated least precisely to begin with",
                     "All directions equally, regardless of d", "Only directions orthogonal to the response y"],
         "answer": 1,
         "why": "When d is small, d^2/(d^2+lambda) is close to 0 (heavy shrinkage); when d is large, the ratio is close to 1 (little shrinkage) -- ridge protects the well-estimated, high-variance directions and suppresses the poorly-estimated, low-variance ones."},
        {"q": "Why is lambda chosen by cross-validated prediction error rather than by comparing estimated coefficients to some target?",
         "options": ["Because computing coefficients is too slow", "Because with real data the true coefficients are unknown, so held-out prediction error is the only available proxy for how well a given lambda will generalise",
                     "Cross-validation always selects lambda = 0", "Coefficient-based tuning is illegal under SCHEMA.md"],
         "answer": 1,
         "why": "In simulation you can compare to a known truth, but that comparison is not available with real data -- cross-validation substitutes out-of-sample prediction accuracy, which can always be measured, for a ground truth that cannot."},
    ],
}

WEEK6 = {
    "n": 6,
    "title": "Sparse methods: lasso, coordinate descent, and variable selection",
    "topics": ["lasso as L1-penalized least squares", "the lasso path as lambda shrinks", "selection stability via the bootstrap",
               "elastic net and the grouping effect for correlated predictors"],
    "concepts": [
        C("Lasso: the L1 penalty that sets coefficients exactly to zero",
          "<p>Lasso replaces ridge's L2 penalty with an L1 penalty, &lambda;&Vert;&beta;&Vert;_1. The "
          "difference sounds small but is not: because the L1 ball has corners at the axes, the "
          "optimum of the penalized objective lands exactly on a corner for a wide range of &lambda;, "
          "which means some coefficients are driven to exactly zero rather than merely shrunk toward it. "
          "The optimisation itself is usually done by coordinate descent: cycle through each coefficient, "
          "holding the others fixed, and apply a closed-form soft-thresholding update at each step.</p> "
          "<p>The snippet implements coordinate descent from scratch on twelve standardised predictors, "
          "of which only three have a genuinely non-zero true coefficient, and runs it to convergence at "
          "a fixed &lambda;. The three true signals (2.0, -1.5, 1.0) are recovered closely (1.87, -1.50, "
          "0.93), and six of the nine true-zero coefficients come back exactly zero; the remaining three "
          "are small but not quite zero, a realistic reminder that lasso's sparsity is not a guarantee "
          "of perfect recovery, only a strong bias toward it. Getting the soft-thresholding update right "
          "by hand once is worth more than treating lasso as a black box, because the same update reappears "
          "inside every coordinate-descent solver used in practice.</p>",
          "\\min_\\beta\\ \\frac{1}{2n}\\Vert y-X\\beta\\Vert_2^2 + \\lambda\\Vert\\beta\\Vert_1",
          "w6c1"),
        C("The lasso path: watching variables enter as lambda shrinks",
          "<p>Solving lasso across a decreasing grid of &lambda; traces out a 'path': at large &lambda; "
          "every coefficient is zero, and as &lambda; falls, coefficients enter the model (become "
          "non-zero) one at a time, roughly in order of how strongly correlated each predictor is with "
          "the response given what has already entered. This path is lasso's built-in variable-ranking "
          "mechanism, and it is what a lasso solver actually computes internally even when only a single "
          "final &lambda; is reported.</p> "
          "<p>The snippet solves the same eight-predictor problem (three genuine signals of sizes 2.0, "
          "-1.5 and 1.0) at eight decreasing values of &lambda; and reports how many coefficients are "
          "non-zero at each. The three genuine predictors enter first, exactly as hoped, and are the "
          "only non-zero coefficients down to &lambda; = 0.2. Below that, a fourth, spurious coefficient "
          "enters at &lambda; = 0.12 before eventually seven of eight are declared non-zero by &lambda; = "
          "0.02 -- a reminder that as &lambda; keeps shrinking, lasso eventually admits noise along with "
          "signal, and the path itself, not any single point on it, is what should inform the choice of "
          "&lambda; together with cross-validation from the previous week.</p>",
          "\\hat\\beta_j(\\lambda) = \\frac{S(\\rho_j,\\, n\\lambda)}{\\Vert x_j\\Vert^2}, \\qquad S(z,t)=\\mathrm{sign}(z)\\max(|z|-t,0)",
          "w6c2"),
        C("Selection stability: does lasso pick the same variables every time?",
          "<p>A single lasso fit reports which coefficients are non-zero, but says nothing about how "
          "sensitive that particular selection is to the particular sample drawn. Bootstrap stability "
          "selection answers this directly: resample the data with replacement many times, refit lasso "
          "at a fixed &lambda; on each resample, and record how often each coefficient is selected. A "
          "variable selected in nearly every bootstrap replicate is a robust finding; one selected only "
          "sometimes is a coin flip dressed up as a discovery.</p> "
          "<p>The snippet runs two hundred bootstrap resamples of an eight-predictor problem with three "
          "genuine signals, refitting lasso on each. The three true predictors are selected in 100% of "
          "resamples every time -- rock solid -- while the five null predictors are selected at "
          "frequencies ranging from about 0.30 to 0.55, nowhere near 100% but also not negligible. This "
          "pattern is exactly what motivated the stability-selection literature: a single lasso run would "
          "have reported some subset of those noise variables as 'selected' with no way to distinguish "
          "them from the genuine three, while the bootstrap frequency makes the distinction immediately "
          "visible.</p>",
          "\\hat\\pi_j = \\frac{1}{B}\\sum_{b=1}^{B} \\mathbb{1}\\{\\hat\\beta_j^{(b)} \\neq 0\\}",
          "w6c3"),
        C("Elastic net: fixing lasso's arbitrary choice among correlated predictors",
          "<p>When two predictors are nearly identical, lasso's L1 penalty has no reason to split credit "
          "between them evenly -- the optimisation problem is nearly indifferent between putting all the "
          "weight on either one, so which one 'wins' depends on tiny differences that coordinate descent "
          "happens to encounter first. Elastic net mixes the L1 penalty with a bit of ridge's L2 penalty; "
          "the L2 term is strictly convex and prefers spreading weight evenly across correlated "
          "predictors, which restores a 'grouping effect' that pure lasso lacks.</p> "
          "<p>The snippet builds two predictors that are near-duplicates of the same underlying signal "
          "plus one pure noise predictor, and compares pure lasso to an elastic net with equal L1/L2 "
          "weight. Lasso splits the true combined signal unevenly, 1.18 versus 0.40 between the two "
          "duplicates; elastic net splits it far more evenly, 0.80 versus 0.79. Both correctly zero out "
          "the noise predictor. The practical implication is that when a research data set has clusters "
          "of correlated candidate predictors -- which is the normal case for financial characteristics, "
          "not the exception -- elastic net's more even split is often easier to interpret and more "
          "stable across resamples than lasso's arbitrary pick.</p>",
          "\\min_\\beta\\ \\frac{1}{2n}\\Vert y-X\\beta\\Vert_2^2 + \\lambda\\Big(\\alpha\\Vert\\beta\\Vert_1 + \\tfrac{1-\\alpha}{2}\\Vert\\beta\\Vert_2^2\\Big)",
          "w6c4"),
    ],
    "widget": {
        "type": "histogram",
        "title": "The bootstrap distribution of a lasso coefficient that is sometimes selected, sometimes zeroed",
        "params": {"sampler": "mixture", "params": {"p": 0.45, "mu1": 0.0, "s1": 0.04, "mu2": 0.85, "s2": 0.25},
                   "bins": 40, "overlay": True, "seed": 34752},
    },
    "pitfalls": [
        "Reporting a lasso model's non-zero coefficients as 'the important variables' from a single fit, without a bootstrap or stability check -- selection can be unstable even when prediction accuracy is fine.",
        "Comparing lasso coefficient magnitudes across predictors that were not standardised first -- the L1 penalty treats a unit of any predictor's scale identically, so an unstandardised large-scale predictor is penalised unfairly relative to a small-scale one.",
        "Assuming a coefficient set exactly to zero by lasso means the corresponding variable has no true relationship with the outcome -- correlated predictors can cause lasso to zero out a genuinely relevant variable in favor of a correlated stand-in.",
        "Using plain lasso on a data set with clusters of highly correlated candidate predictors and being surprised that the selected variable changes with small data perturbations -- elastic net or explicit grouping is the fix, not more data alone.",
    ],
    "check": [
        {"q": "Why does lasso's L1 penalty set some coefficients to exactly zero, while ridge's L2 penalty never does?",
         "options": ["Lasso and ridge use different optimisation algorithms", "The L1 penalty's constraint region has corners at the axes, and the unpenalised optimum frequently lands exactly on one, while the L2 penalty's smooth, round constraint region almost never intersects an axis exactly",
                     "Lasso always uses a larger lambda than ridge", "Ridge is only defined for positive coefficients"],
         "answer": 1,
         "why": "This is the standard geometric explanation: the L1 ball's corners make an exact-zero solution likely for many predictors, while the L2 ball's smooth boundary makes an exact zero a measure-zero event."},
        {"q": "As lambda decreases along the lasso path, in what order do variables typically enter the model?",
         "options": ["Randomly", "Roughly in order of how strongly each remaining predictor is associated with the response, conditional on what has already entered",
                     "Alphabetically by variable name", "All at once, only at lambda = 0"],
         "answer": 1,
         "why": "The lasso path enters variables one at a time as the penalty relaxes, and the entry order reflects each variable's marginal contribution to reducing the penalized objective given the variables already in the model."},
        {"q": "A bootstrap stability-selection analysis shows one variable selected in 100% of resamples and another selected in 35% of resamples at the same lambda. What should you conclude?",
         "options": ["Both are equally reliable findings", "The first variable's selection is robust; the second's is closer to what chance alone could produce and should not be reported with the same confidence",
                     "The second variable must be more economically important", "Bootstrap frequency has no bearing on reliability"],
         "answer": 1,
         "why": "A selection frequency near 100% across resamples indicates the finding is not an artifact of the particular sample drawn, while a frequency well below 100% indicates real sensitivity to resampling -- exactly the distinction stability selection is designed to expose."},
        {"q": "Two nearly identical predictors carry the same true signal. Plain lasso assigns them very uneven coefficients (e.g. 1.18 and 0.40); elastic net assigns them nearly equal coefficients (e.g. 0.80 and 0.79). Why?",
         "options": ["Elastic net always ignores collinearity", "The added L2 term in elastic net is strictly convex and prefers spreading weight evenly across correlated predictors, restoring a grouping effect that pure L1 lacks",
                     "Lasso is simply implemented incorrectly", "Elastic net uses a smaller effective lambda"],
         "answer": 1,
         "why": "Pure L1 is close to indifferent among ways of splitting credit between near-duplicate predictors, so tiny numerical differences decide the split; the L2 component breaks that indifference in favour of an even split."},
    ],
}

WEEK7 = {
    "n": 7,
    "title": "Covariance estimation in high dimensions: shrinkage, conditioning, and sparsity",
    "topics": ["eigenvalue spreading and the Marchenko-Pastur law", "linear shrinkage toward a structured target",
               "condition number and portfolio stability", "sparse precision matrices and conditional independence"],
    "concepts": [
        C("The Marchenko-Pastur law: why sample eigenvalues spread out even under a trivial truth",
          "<p>Week 1 showed empirically that the sample covariance's eigenvalues spread out as p "
          "approaches n, even when the true covariance is the identity. Random matrix theory makes this "
          "precise: for iid data with p/n = c, the largest sample eigenvalue converges to "
          "&sigma;^2(1+&radic;c)^2 and the smallest to &sigma;^2(1-&radic;c)^2 -- the Marchenko-Pastur "
          "bounds -- purely as a consequence of estimating a p by p matrix from a finite sample, with no "
          "real structure involved at all.</p> "
          "<p>The snippet draws data with a genuinely identity true covariance at four ratios of p to n "
          "from 0.1 to 0.97 (n fixed at 300), and compares the empirical maximum eigenvalue to the "
          "Marchenko-Pastur upper bound at each ratio. The two track each other closely across the whole "
          "range: at p/n = 0.10 the observed maximum is 1.634 against a predicted bound of 1.732, and at "
          "p/n = 0.97 the observed maximum is 3.906 against a predicted 3.933. This is not a coincidence "
          "to admire; it is a diagnostic. Any time a sample covariance's largest eigenvalue is close to "
          "this purely-noise prediction, that eigenvalue is telling you nothing about real structure in "
          "the data -- it is exactly what estimation noise alone would produce.</p>",
          "\\lambda_{\\max} \\ \\xrightarrow{p/n \\to c}\\ \\sigma^2(1+\\sqrt{c})^2 \\quad\\text{(Marchenko-Pastur)}",
          "w7c1"),
        C("Linear shrinkage: blending the sample covariance toward a structured target",
          "<p>If the raw sample covariance is unreliable in high dimensions but a simple structured "
          "target (like a scaled identity matrix) is stable but wrong, the practical fix is to blend "
          "them: &Sigma;_shrink = &alpha; F + (1-&alpha;) S, where F is the structured target and S is "
          "the sample covariance. This is the Ledoit-Wolf idea in miniature -- trade a controlled amount "
          "of bias (from the target, which is wrong) for a large reduction in variance (from averaging "
          "away the sample covariance's estimation noise), and there usually exists some &alpha; strictly "
          "between 0 and 1 that beats both endpoints.</p> "
          "<p>The snippet estimates a 40-dimensional covariance matrix from just 60 observations, two "
          "hundred times, and for each sample searches over a grid of shrinkage weights &alpha; for "
          "whichever blend is closest (in squared Frobenius norm) to the known truth -- an oracle "
          "comparison that isolates how much shrinkage could help, setting aside how to estimate &alpha; "
          "itself. The raw sample covariance's average loss is 45.1; the oracle-best shrinkage blend's "
          "average loss is 20.0, less than half. That gap is the entire economic case for covariance "
          "shrinkage in any application -- portfolio construction, risk models, graphical models -- where "
          "p is not tiny relative to n.</p>",
          "\\hat\\Sigma_{\\text{shrink}} = \\alpha F + (1-\\alpha) S, \\qquad F = \\frac{\\mathrm{tr}(S)}{p}\\,I",
          "w7c2"),
        C("Condition number and the stability of a minimum-variance portfolio",
          "<p>A poorly conditioned covariance matrix does not just have unreliable individual entries; it "
          "produces wildly unstable downstream decisions, because inverting it (as every mean-variance or "
          "minimum-variance calculation requires) divides by its smallest eigenvalues. Shrinking the "
          "covariance toward a well-conditioned target fixes both problems simultaneously: it lowers the "
          "condition number directly, and it makes the resulting portfolio weights -- and their true, "
          "out-of-sample variance -- far more stable.</p> "
          "<p>The snippet estimates a 30-asset covariance from 36 monthly observations (a genuinely "
          "difficult, p-close-to-n case) and computes minimum-variance portfolio weights from both the "
          "raw sample covariance and a shrunk version. The raw covariance's condition number is over "
          "1,250; shrinkage brings it down to about 7.6. The payoff is not just numerical tidiness: the "
          "true variance of the minimum-variance portfolio built from the raw covariance is 0.139, while "
          "the portfolio built from the shrunk covariance has a true variance of only 0.032 -- more than "
          "four times lower. This is the mechanism, not just the conclusion, behind week 10's closing "
          "exercise and behind FINM 36700's treatment of why the plug-in mean-variance optimiser fails.</p>",
          "w_{\\min\\text{-var}} = \\frac{\\Sigma^{-1}\\mathbf 1}{\\mathbf 1'\\Sigma^{-1}\\mathbf 1}",
          "w7c3"),
        C("Sparse precision matrices: conditional independence hides inside the inverse covariance",
          "<p>A covariance matrix and its inverse, the precision matrix, carry different information. The "
          "covariance matrix's zero entries mean marginal independence (two variables are simply "
          "uncorrelated); the precision matrix's zero entries mean conditional independence given every "
          "other variable. A chain of variables where each depends directly only on its immediate "
          "neighbours has a sparse, tridiagonal precision matrix -- but its covariance matrix, obtained by "
          "inverting that sparse matrix, is completely dense, because correlation propagates along the "
          "chain even between variables with no direct link.</p> "
          "<p>The snippet builds exactly this six-variable chain, with a precision matrix that is zero "
          "everywhere except the diagonal and the immediate off-diagonals, inverts it to get the implied "
          "(dense) covariance matrix, and then goes the other direction: draws four thousand samples from "
          "that covariance and inverts the sample covariance to recover an estimated precision matrix. "
          "The estimated precision matrix correctly shows large values on the diagonal and immediate "
          "off-diagonals, matching the truth closely, but the entries that should be exactly zero come "
          "back as small non-zero noise (on the order of 0.01 to 0.04) rather than true zeros -- which is "
          "exactly the gap that graphical lasso (an L1 penalty applied to the precision matrix, the "
          "natural extension of week 6's lasso to this setting) is built to close, by forcing genuinely "
          "small entries to exactly zero and recovering the true conditional-independence structure.</p>",
          "X_i \\perp X_j \\mid X_{-ij} \\quad\\Longleftrightarrow\\quad (\\Sigma^{-1})_{ij} = 0",
          "w7c4"),
    ],
    "widget": {
        "type": "heatmap",
        "title": "A shrinkage estimator blends the sample covariance toward a structured target",
        "params": {
            "cmap": "div",
            "xlabels": ["V1", "V2", "V3", "V4"],
            "ylabels": ["V1", "V2", "V3", "V4"],
            "matrix": [
                [1.00, 0.28, 0.12, 0.05],
                [0.28, 1.00, 0.20, 0.08],
                [0.12, 0.20, 1.00, 0.15],
                [0.05, 0.08, 0.15, 1.00],
            ],
        },
    },
    "pitfalls": [
        "Treating every large sample eigenvalue as evidence of a real common factor without first checking whether it exceeds the Marchenko-Pastur noise bound for the data's p/n ratio.",
        "Shrinking a covariance matrix toward an arbitrary target (e.g. always the identity) without checking whether a more sensible structured target (a factor model, an industry-block structure) would introduce less bias for the same variance reduction.",
        "Reading a small but non-zero entry in an estimated precision matrix as evidence of a weak direct dependency, when it may simply be estimation noise that graphical lasso-style regularisation would zero out.",
        "Optimising a portfolio, or any other decision, directly on a raw, ill-conditioned sample covariance matrix and being surprised that the resulting weights are unstable across small changes in the estimation window.",
    ],
    "check": [
        {"q": "A sample covariance matrix's largest eigenvalue closely matches the Marchenko-Pastur upper bound for the data's p/n ratio, under a null of no real structure. What should you conclude?",
         "options": ["The data has a strong common factor", "That eigenvalue is consistent with pure estimation noise and should not be interpreted as a real common factor without further evidence",
                     "The covariance matrix must be miscalculated", "p/n has no bearing on eigenvalues"],
         "answer": 1,
         "why": "The Marchenko-Pastur bound describes exactly what eigenvalue spreading pure sampling noise produces; an observed eigenvalue near that bound gives no evidence of structure beyond what randomness alone explains."},
        {"q": "Linear shrinkage blends the sample covariance S with a structured target F. Why does this typically reduce total estimation error even though F is a deliberately oversimplified target?",
         "options": ["Because F is always closer to the truth than S", "Because the reduction in variance from blending toward a stable target outweighs the bias introduced by that target being wrong, for a well-chosen blending weight",
                     "Because averaging any two matrices always reduces error", "It only works if F happens to equal the true covariance exactly"],
         "answer": 1,
         "why": "This is the standard bias-variance argument: S is unbiased but has high variance in high dimensions, F is biased but has zero variance (it's fixed), and an interior blend typically has lower total error than either extreme."},
        {"q": "A minimum-variance portfolio built from a covariance matrix with condition number 1,250 versus one built from a shrunk covariance with condition number 7.6 -- which is more likely to have unstable, extreme weights?",
         "options": ["The shrunk one, because shrinkage distorts weights", "The ill-conditioned one (condition number 1,250), because minimum-variance weights are proportional to the inverse covariance times a vector, and inverting an ill-conditioned matrix amplifies estimation noise",
                     "Neither -- condition number has no effect on portfolio weights", "They are equally unstable"],
         "answer": 1,
         "why": "Inverting a matrix with a large condition number massively amplifies any estimation error in its smallest-eigenvalue directions, which shows up directly as extreme, unstable weights in Sigma^{-1} applied to a vector."},
        {"q": "A precision matrix (inverse covariance) has a zero entry at position (i,j). What does this imply?",
         "options": ["Variables i and j are marginally uncorrelated", "Variables i and j are conditionally independent given every other variable in the model",
                     "Variable i has zero variance", "The covariance matrix must be diagonal"],
         "answer": 1,
         "why": "Zero entries in the precision matrix correspond to conditional independence given all other variables -- a different and generally stronger statement than the marginal independence implied by a zero in the covariance matrix itself."},
    ],
}

WEEK8 = {
    "n": 8,
    "title": "Clustering and mixture models: grouping observations without labels",
    "topics": ["k-means as alternating minimization", "hierarchical clustering and linkage",
               "Gaussian mixture models and the EM algorithm", "choosing the number of clusters"],
    "concepts": [
        C("K-means: alternating between assignment and re-centering until nothing moves",
          "<p>K-means minimises total within-cluster squared distance to each cluster's own mean by "
          "alternating two simple steps: assign every point to its nearest current centre, then move "
          "each centre to the mean of the points now assigned to it. Each step can only decrease (or "
          "leave unchanged) the total objective, so the algorithm is guaranteed to converge, though not "
          "necessarily to the global optimum -- different random starting centres can land in different "
          "local minima, which is why k-means is normally run from several random starts and the best "
          "result kept.</p> "
          "<p>The snippet generates three hundred points from three well-separated Gaussian blobs and "
          "runs k-means from a single random start. It converges after six iterations, and the resulting "
          "cluster assignments match the true generating group for 100% of points once each cluster is "
          "matched to its majority-vote true label. Perfect recovery here is a feature of how cleanly "
          "separated the three blobs are; the algorithm's mechanics -- assign, re-center, repeat until "
          "nothing changes -- would run identically, and converge just as fast, on far messier data where "
          "the recovered clusters would not line up with any true grouping nearly this well.</p>",
          "\\min_{\\{C_k\\},\\{\\mu_k\\}} \\ \\sum_{k=1}^K \\sum_{i \\in C_k} \\Vert x_i - \\mu_k\\Vert^2",
          "w8c1"),
        C("Hierarchical clustering: building a dendrogram one merge at a time",
          "<p>Hierarchical (agglomerative) clustering starts with every point as its own cluster and "
          "repeatedly merges the two closest clusters, where 'closest' depends on the chosen linkage rule "
          "-- average linkage uses the mean distance between every pair of points across the two "
          "clusters, complete linkage uses the maximum, single linkage uses the minimum. The sequence of "
          "merges and the distance at which each one happened is the dendrogram; unlike k-means, no number "
          "of clusters needs to be chosen in advance -- that choice is made afterward, by deciding where "
          "to cut the tree.</p> "
          "<p>The snippet builds eight points forming two obvious well-separated groups of four, and runs "
          "average-linkage agglomerative clustering by hand, printing every merge in order along with its "
          "linkage distance. The first six merges happen at distances between about 0.47 and 1.95 -- "
          "points and small sub-clusters joining within their own group -- and then the seventh and final "
          "merge, joining the two groups together, happens at a distance of 9.01, dramatically larger than "
          "any of the within-group merges. That sharp jump in merge distance is exactly what you look for "
          "in a real dendrogram to decide how many clusters the data actually supports: cut the tree just "
          "below the largest jump.</p>",
          "d(A,B) = \\frac{1}{|A||B|}\\sum_{i \\in A,\\, j \\in B} d(x_i, x_j) \\quad \\text{(average linkage)}",
          "w8c2"),
        C("Gaussian mixture models: soft clustering by the EM algorithm",
          "<p>A Gaussian mixture model assumes the data comes from a small number of Gaussian components "
          "mixed together, each with its own mean, variance and mixing weight, and it estimates all of "
          "them by the EM algorithm: the E-step computes each point's probability of belonging to each "
          "component (a soft assignment, unlike k-means's hard one) given the current parameters, and the "
          "M-step updates the means, variances and weights as weighted averages using those "
          "probabilities. Repeating E and M steps provably increases the data's log-likelihood at every "
          "iteration, never decreasing it.</p> "
          "<p>The snippet fits a two-component 1-D Gaussian mixture by hand to two thousand points drawn "
          "from a genuine two-component mixture (means -2.0 and 3.0), starting from a deliberately poor "
          "initial guess. The log-likelihood rises monotonically from about -7,853 after the first "
          "iteration to about -4,556.5, where it stays flat -- convergence -- by the tenth iteration, and "
          "never decreases at any step, exactly as the theory guarantees. The recovered means (-2.03 and "
          "3.09) and standard deviations (0.99 and 1.51) are both close to the truth. The soft, "
          "probabilistic assignment is what separates a mixture model from k-means: a point near the "
          "boundary between two components gets a genuinely uncertain (say, 60/40) assignment rather than "
          "being forced into exactly one cluster.</p>",
          "\\ell(\\theta) = \\sum_i \\log \\sum_k \\pi_k\\, \\mathcal N(x_i; \\mu_k, \\sigma_k^2)",
          "w8c3"),
        C("Choosing the number of clusters: the elbow and a BIC-like penalty",
          "<p>K-means's within-cluster inertia can only decrease as k increases -- with k equal to the "
          "number of points, inertia is exactly zero -- so inertia alone cannot select k; it always "
          "prefers more clusters. A BIC-like criterion fixes this by adding a penalty proportional to the "
          "number of parameters used (roughly k times the dimension, times log n), trading off fit "
          "against complexity the same way BIC does for any other model class.</p> "
          "<p>The snippet generates data from exactly three well-separated Gaussian blobs and computes "
          "both inertia and a BIC-like score for k from 1 to 6. Inertia drops sharply from 3,094 at k = 1 "
          "to 444 at k = 3 -- capturing almost all of the real structure -- and then only slowly to 311 "
          "by k = 6. The BIC-like score shows the identical pattern: a steep drop from 625 to 180 through "
          "k = 3, and only a slow decline afterward, from 180 down to 128 by k = 6. Both curves say the "
          "same thing in the same way: the big, structural improvements are exhausted by k = 3, and "
          "everything after that is diminishing returns from carving the same three real groups into "
          "finer and finer pieces -- exactly the 'elbow' logic from week 2's PCA, applied here to cluster "
          "count instead of component count.</p>",
          "\\mathrm{BIC}_{\\text{approx}} \\approx n\\log(\\mathrm{SSE}/n) + k \\cdot p \\cdot \\log n",
          "w8c4"),
    ],
    "widget": {
        "type": "heatmap",
        "title": "Pairwise distances feed every clustering algorithm in this week",
        "params": {
            "cmap": "seq",
            "xlabels": ["P1", "P2", "P3", "P4", "P5", "P6"],
            "ylabels": ["P1", "P2", "P3", "P4", "P5", "P6"],
            "matrix": [
                [0.0, 0.9, 1.6, 6.1, 6.8, 7.3],
                [0.9, 0.0, 1.1, 6.5, 7.0, 7.6],
                [1.6, 1.1, 0.0, 6.9, 7.4, 7.9],
                [6.1, 6.5, 6.9, 0.0, 0.8, 1.3],
                [6.8, 7.0, 7.4, 0.8, 0.0, 1.0],
                [7.3, 7.6, 7.9, 1.3, 1.0, 0.0],
            ],
        },
    },
    "pitfalls": [
        "Running k-means from a single random initialisation and treating the result as the answer, when different starting centres can converge to different local minima on messier data than the well-separated toy examples here.",
        "Choosing a linkage rule (single, average, complete) without considering what it implies -- single linkage can chain together long, straggly clusters through a series of close intermediate points ('chaining'), which average and complete linkage resist.",
        "Using k-means's hard cluster assignments when the underlying question is really about uncertainty near a boundary -- a Gaussian mixture's soft assignments answer a different, often more honest, question.",
        "Picking k purely by eyeballing an elbow plot without a numeric criterion (BIC-like score, gap statistic, or a domain-specific reason for a particular k) -- eyeballed elbows are easy to see differently depending on the scale of the axes.",
    ],
    "check": [
        {"q": "Why is k-means normally run from several random initialisations rather than just once?",
         "options": ["To make the algorithm run faster", "Because it only ever decreases (or holds) the within-cluster objective at each step, so it can converge to different local minima depending on the starting centres",
                     "Because a single run always fails to converge", "Random initialisation is required by the mathematics of the algorithm, not a practical safeguard"],
         "answer": 1,
         "why": "K-means provably converges, but only to a local optimum of a generally non-convex objective; different starting centres can lead to different local optima, so multiple restarts (keeping the best) reduce the chance of reporting a poor one."},
        {"q": "In a hierarchical clustering dendrogram, six early merges happen at distances under 2, and a final merge joining two large groups happens at a distance of 9. What does the large gap suggest?",
         "options": ["An error in the distance calculation", "The data likely has a natural two-cluster structure, since within-group points merge much sooner than the two apparent groups merge with each other",
                     "The data has no cluster structure at all", "Average linkage always produces this pattern regardless of the data"],
         "answer": 1,
         "why": "A large jump in merge distance relative to the merges before it is the standard visual signal in a dendrogram for where a natural cluster boundary lies -- cutting the tree just below the jump recovers that structure."},
        {"q": "What is the key difference between a Gaussian mixture model's cluster assignments and k-means's cluster assignments?",
         "options": ["There is no difference -- they are the same algorithm", "Gaussian mixtures assign each point a probability of belonging to each cluster (soft assignment); k-means assigns each point to exactly one cluster (hard assignment)",
                     "K-means requires more clusters than a Gaussian mixture", "Gaussian mixtures cannot handle more than two clusters"],
         "answer": 1,
         "why": "The E-step of EM computes a responsibility (a probability) for each point and each component, rather than a single hard label, which lets points near a boundary between components be genuinely, quantifiably ambiguous."},
        {"q": "Why can't k-means's within-cluster inertia, by itself, be used to choose the number of clusters k?",
         "options": ["Inertia is undefined for k > 2", "Inertia can only decrease (or stay the same) as k increases, so it always favours the largest k tried, with zero inertia once k equals the number of points",
                     "Inertia always increases with k", "Inertia is only meaningful for hierarchical clustering"],
         "answer": 1,
         "why": "Adding more clusters can only help fit the training data better in a within-cluster-distance sense, so a pure fit criterion like inertia needs a complexity penalty (as in a BIC-like score) before it can meaningfully trade off fit against parsimony."},
    ],
}

WEEK9 = {
    "n": 9,
    "title": "Tree-based methods: CART, bagging, and random forests",
    "topics": ["recursive partitioning by impurity reduction", "bagging and variance reduction",
               "random forests: decorrelating trees with random feature subsets", "permutation importance and correlated features"],
    "concepts": [
        C("CART: growing a tree by the single best split, recursively",
          "<p>A regression tree is built by recursive partitioning: at every node, search over every "
          "feature and every candidate split point for the split that most reduces the sum of squared "
          "error between each resulting child's observations and that child's own mean, then repeat "
          "inside each child. There is no global objective being solved -- it is a greedy, one-split-at-a-"
          "time search -- which is both the method's main weakness (a locally good split can foreclose a "
          "globally better tree) and its main strength (it scales to any number of features with no "
          "matrix inversion at all).</p> "
          "<p>The snippet builds a synthetic surface with a genuine four-region structure defined by "
          "thresholds on two features (near x1 = 0 and x2 = -1 or x2 = 1) and grows a depth-2 tree by "
          "exhaustive best-split search. The tree recovers the structure almost exactly: it splits first "
          "on x1 &le; 0.11 (the true boundary is 0), then within each half splits on x2 at -0.89 or 1.06 "
          "(the true boundaries are -1 and 1), producing four leaves whose predicted values (-3.71, -0.78, "
          "2.04, 5.07) track the four true region values (-4, -1, 2, 5) closely. A single tree can recover "
          "genuinely nonlinear, non-additive structure like this that no linear model in this course -- "
          "ridge, lasso, PCA regression -- could represent at all.</p>",
          "\\min_{j,\\,s}\\ \\Big[\\sum_{x_i \\le s} (y_i-\\bar y_L)^2 \\ +\\ \\sum_{x_i > s} (y_i-\\bar y_R)^2\\Big]",
          "w9c1"),
        C("Bagging: averaging decorrelated trees to cut variance, not bias",
          "<p>A single tree fit on a small, noisy sample is unstable: a slightly different training set "
          "can produce a noticeably different tree. Bagging (bootstrap aggregating) fits many trees, each "
          "on a bootstrap resample of the training data, and averages their predictions. Averaging "
          "reduces variance in proportion to how correlated the individual predictors are -- if trees were "
          "completely uncorrelated, averaging B of them would divide variance by B; because bootstrap "
          "trees trained on overlapping data are correlated, the reduction is smaller but still "
          "substantial, and it comes at essentially no cost to bias.</p> "
          "<p>The snippet fits a single depth-1 tree (a 'stump') and a bootstrap-aggregated ensemble of 25 "
          "stumps to forty noisy training points from a smooth true function, repeated across forty "
          "independent training sets to measure prediction variance directly. The single stump's average "
          "prediction variance is 0.057; the bagged ensemble's is 0.026 -- less than half. That variance "
          "reduction shows up directly in accuracy: average test MSE falls from 0.107 for a single stump "
          "to 0.073 for the bagged version, a substantial improvement bought entirely by averaging, with "
          "no new information added to any individual fit.</p>",
          "\\mathrm{Var}(\\bar f) = \\rho\\sigma^2 + \\frac{1-\\rho}{B}\\sigma^2",
          "w9c2"),
        C("Random forests: decorrelating trees further by restricting each split to a random feature subset",
          "<p>Bagging alone still lets every tree consider every feature at every split, so if one "
          "feature is clearly the best predictor, nearly every bootstrap tree will split on it, keeping "
          "the trees highly correlated with each other and limiting how much averaging can help (the "
          "&rho;&sigma;^2 term in bagging's variance formula does not shrink with more trees). Random "
          "forests add a second source of randomness: at every split, only a random subset of features is "
          "even considered, which forces different trees to rely on different, otherwise-overshadowed "
          "predictors, lowering the correlation between trees and unlocking more of bagging's promised "
          "variance reduction.</p> "
          "<p>The snippet builds five features where two (feature 0 and 1) are both correlated with the "
          "same true signal and three are pure noise, then fits sixty trees each under plain bagging "
          "(every feature available) versus a random-forest-style restriction (only two random features "
          "per tree). Under bagging, trees split almost evenly between features 0 and 1 (48% and 52% of "
          "the time) because those two are simply the best predictors available -- and the resulting "
          "trees' predictions correlate at 0.725. Under the random-forest restriction, splits spread "
          "across all five features, including the noise features when neither good predictor is in the "
          "sampled subset, and the pairwise correlation between trees falls to 0.427 -- a real "
          "decorrelation, not just a cosmetic change in which feature gets used.</p>",
          "\\rho = \\mathrm{corr}\\big(\\hat f_b(x),\\, \\hat f_{b'}(x)\\big)",
          "w9c3"),
        C("Permutation importance, and how it dilutes across correlated predictors",
          "<p>Permutation importance measures how much a fitted model's error increases when one "
          "feature's values are randomly shuffled (destroying that feature's relationship with the "
          "outcome while leaving everything else, including the feature's own marginal distribution, "
          "intact) -- the rise in error is that feature's importance. It is model-agnostic and easy to "
          "compute, but it has a well-known blind spot: if two features carry the same signal, permuting "
          "either one alone leaves the model free to lean on the other, so both can look far less "
          "important than the signal they jointly carry actually is.</p> "
          "<p>The snippet fits a small stump ensemble in two scenarios: one with a single informative "
          "feature and two noise features, and another where the exact same informative signal is split "
          "across two correlated duplicate features (plus the same two noise features). In the first "
          "scenario, the lone informative feature's permutation importance is 5.24 -- large, and the two "
          "noise features register exactly zero. In the second scenario, the identical signal, now "
          "duplicated, registers importances of only 0.98 and 1.97 on the two correlated copies -- a "
          "fraction of what the single feature carried alone, even though the combined predictive content "
          "is unchanged. This dilution is the single most important caveat to attach to any permutation-"
          "importance ranking on real, correlated financial data.</p>",
          "\\mathrm{VI}_j = \\mathrm{MSE}\\big(\\hat f, y \\mid X_j \\text{ permuted}\\big) - \\mathrm{MSE}(\\hat f, y)",
          "w9c4"),
    ],
    "widget": {
        "type": "histogram",
        "title": "A single tree's prediction error has fatter tails than averaging leaves you expecting",
        "params": {"sampler": "t", "params": {"df": 3}, "bins": 40, "overlay": True, "seed": 34780},
    },
    "pitfalls": [
        "Growing a single deep tree on a small data set and treating its predictions as reliable -- individual trees are exactly the high-variance estimator that bagging and random forests exist to fix.",
        "Assuming random forests always outperform bagging by the same margin regardless of the data -- the decorrelation benefit is largest when a small number of features would otherwise dominate every split, and smaller when features are already roughly equally informative.",
        "Reading a low permutation importance for a feature as proof it is economically irrelevant, without checking whether a correlated feature is available for the model to substitute in its place.",
        "Comparing permutation importances computed on the training set to permutation importances computed on a held-out set as if they answered the same question -- training-set importance can reward overfitting.",
    ],
    "check": [
        {"q": "A regression tree splits greedily, choosing the single best split at each node without looking ahead. What is the main risk of this approach?",
         "options": ["It cannot handle more than two features", "A split that looks best right now can foreclose a different split that would have led to a better overall tree -- the search is locally, not globally, optimal",
                     "It always overfits regardless of tree depth", "It requires inverting a matrix at every node"],
         "answer": 1,
         "why": "Greedy recursive partitioning commits to each split immediately based on local improvement, with no mechanism to reconsider it later even if a different early split would have enabled a better tree overall."},
        {"q": "Bagging reduces the variance of an ensemble average according to rho*sigma^2 + (1-rho)/B*sigma^2, where rho is the correlation between trees. What happens as B grows large if rho stays fixed and positive?",
         "options": ["Variance goes to exactly zero", "Variance converges to rho*sigma^2, not zero -- more trees cannot remove the shared, correlated component of the error",
                     "Variance increases without bound", "The formula only applies when rho = 0"],
         "answer": 1,
         "why": "As B goes to infinity the second term vanishes, leaving rho*sigma^2 as an irreducible floor -- which is exactly why random forests attack rho directly by decorrelating the trees, rather than simply growing B further."},
        {"q": "Why does restricting each split to a random subset of features (as in a random forest) typically lower the correlation between trees compared to plain bagging?",
         "options": ["It reduces the amount of training data each tree sees", "It prevents every tree from defaulting to the same dominant feature at every split, forcing different trees to rely on different predictors",
                     "It has no effect on correlation, only on bias", "It only matters when there is exactly one informative feature"],
         "answer": 1,
         "why": "When every feature is available, bootstrap trees tend to converge on splitting on whichever feature is simply the best predictor, keeping trees similar to each other; restricting the candidate features per split breaks that convergence."},
        {"q": "The same true signal is carried by one feature in scenario A and split across two correlated duplicate features in scenario B. Permutation importance in scenario A is far higher for the single feature than either duplicate's importance in scenario B. Why?",
         "options": ["The model in scenario B is poorly fit", "In scenario B, permuting only one of the two correlated features still leaves the model free to lean on the other, understating how much the pair jointly matters",
                     "Permutation importance is not defined when features are correlated", "The two scenarios must differ in sample size"],
         "answer": 1,
         "why": "Permutation importance measures the effect of removing one feature's information while everything else, including a correlated substitute, remains available -- so shared signal gets diluted across however many correlated carriers there are."},
    ],
}

WEEK10 = {
    "n": 10,
    "title": "Synthesis: model comparison, dimensionality, leakage, and a pipeline that closes the loop",
    "topics": ["cross-validated comparison across model families", "the curse of dimensionality",
               "data leakage in a multivariate pipeline", "from a covariance estimate to a portfolio"],
    "concepts": [
        C("Comparing model families honestly: the same cross-validation loop, different fitted objects",
          "<p>Every method in this course -- OLS, ridge, principal component regression (regress on the "
          "top k PCA scores instead of the raw predictors), lasso -- can be dropped into the identical "
          "K-fold cross-validation loop from week 5, changing only which fitting function is called inside "
          "each fold. This is the practical payoff of having built ridge, lasso and PCA from scratch: "
          "comparing them fairly is a matter of reusing one evaluation harness, not writing four different "
          "ones.</p> "
          "<p>The snippet builds fifteen correlated predictors driven by three latent factors, with only "
          "four of the fifteen true coefficients non-zero, and runs five-fold cross-validation for OLS, "
          "ridge, principal component regression with three components, and lasso, all on the identical "
          "folds. Every regularised method beats plain OLS: OLS's CV error is 1.540, ridge and PCR both "
          "land around 1.34-1.37, and lasso comes out lowest at 1.242. The ranking is specific to this "
          "data (lasso's sparsity assumption happens to fit a genuinely sparse truth well here), not a "
          "general law that lasso always wins -- but the exercise of forcing all four methods through the "
          "same CV harness, rather than comparing methods evaluated different ways, is the general lesson.</p>",
          None,
          "w10c1"),
        C("The curse of dimensionality: distances stop discriminating as p grows",
          "<p>Nearest-neighbour methods, clustering, and any method that relies on 'similar points are "
          "close together' quietly assume that distance is informative -- that some points are "
          "meaningfully closer than others. In high dimensions with independent coordinates, this stops "
          "being true: as p grows, the ratio of the nearest neighbour's distance to the farthest "
          "neighbour's distance converges toward 1, meaning every point ends up looking roughly "
          "equidistant from every other point.</p> "
          "<p>The snippet draws 500 points uniformly in a p-dimensional cube for p ranging from 2 to 500, "
          "and computes the ratio of each point's nearest to farthest neighbour distance, averaged across "
          "all points. At p = 2 the ratio is a tiny 0.023 -- distances are highly informative, the nearest "
          "point is dramatically closer than the farthest. By p = 100 the ratio has risen to 0.711, and by "
          "p = 500 it reaches 0.862 -- nearest and farthest neighbours are barely distinguishable. This is "
          "not a quirk of any one algorithm; it is a geometric fact about high-dimensional space that "
          "explains why k-means, k-nearest-neighbours and kernel methods all degrade as raw dimensionality "
          "grows, and it is the strongest possible argument for the dimension reduction techniques -- PCA, "
          "factor models, regularisation -- that fill the rest of this course.</p>",
          "\\frac{d_{\\min}}{d_{\\max}} \\ \\longrightarrow\\ 1 \\quad \\text{as } p \\to \\infty \\ \\text{(fixed } n\\text{, i.i.d. coordinates)}",
          "w10c2"),
        C("Data leakage: when a preprocessing step sees the test set before it should",
          "<p>Any step of a pipeline that uses information from the full data set -- including the "
          "portion that will later be used to evaluate the model -- before the train/test split has "
          "happened can leak information from the label into the reported performance, producing an "
          "optimistic bias that will not survive contact with genuinely new data. Selecting which "
          "features to use based on their correlation with the outcome, computed across the entire "
          "sample including the test fold, is one of the most common and most damaging versions of this "
          "mistake.</p> "
          "<p>The snippet generates 200 candidate features and a response that is pure noise, "
          "genuinely unrelated to any of them, so the true out-of-sample R^2 of any honest procedure is "
          "exactly zero. Selecting the five features most correlated with the outcome using the entire "
          "sample (including each fold's test rows) before cross-validating produces a mean out-of-sample "
          "R^2 of +0.230 -- an entirely spurious, illusory 23% of variance 'explained'. Selecting those "
          "same five features using only each fold's training rows, as a correct pipeline must, produces "
          "a mean R^2 of -0.188 -- appropriately poor, since there is nothing real to find and 200 "
          "candidates give ample room to overfit even honestly. The gap between +0.230 and -0.188 is not a "
          "rounding difference; it is the entire difference between a result that will replicate and one "
          "that will not.</p>",
          "\\mathbb E[\\hat R^2_{\\text{leaky}}] \\;>\\; \\mathbb E[\\hat R^2_{\\text{correct}}] \\quad \\text{whenever selection uses } y_{\\text{test}}",
          "w10c3"),
        C("Closing the loop: a shrunk covariance estimate makes a better portfolio",
          "<p>This course opened with the sample covariance matrix as the basic object every multivariate "
          "method manipulates, and it closes by putting week 7's covariance shrinkage to direct use in "
          "exactly the application that motivated all of it: building a portfolio. A tangency (maximum "
          "Sharpe ratio) portfolio's weights are proportional to the inverse covariance matrix applied to "
          "the vector of expected excess returns -- so an ill-conditioned, noisy covariance estimate "
          "produces extreme, unstable weights in exactly the way week 7 demonstrated, with real "
          "consequences for out-of-sample performance.</p> "
          "<p>The snippet estimates the covariance and expected-return inputs to a tangency portfolio "
          "from just 36 months of data on 25 assets -- deliberately data-starved, matching week 7's "
          "hardest case -- builds tangency weights from both the raw sample covariance and a shrunk "
          "version, and evaluates both on 500 months of genuinely new, out-of-sample data. The portfolio "
          "built on the raw covariance achieves an out-of-sample Sharpe ratio of 0.033 with 2.6x gross "
          "leverage; the portfolio built on the shrunk covariance achieves a Sharpe of 0.052 -- roughly "
          "60% higher -- while using less leverage, 1.5x. Nothing about the expected-return inputs "
          "changed between the two; the entire improvement comes from trusting the covariance matrix a "
          "little less, which is this course's central lesson applied one last time.</p>",
          "w_{\\text{tan}} = \\frac{\\hat\\Sigma^{-1}(\\hat\\mu - r_f \\mathbf 1)}{\\mathbf 1'\\hat\\Sigma^{-1}(\\hat\\mu - r_f \\mathbf 1)}",
          "w10c4"),
    ],
    "widget": {
        "type": "efficient-frontier",
        "title": "From a covariance estimate to a portfolio: the frontier this course's machinery ultimately serves",
        "params": {"mu": [0.05, 0.08, 0.11], "sigma": [0.12, 0.18, 0.25], "rho": 0.3, "rf": 0.02},
    },
    "pitfalls": [
        "Declaring one method 'the winner' from a single train/test split rather than a cross-validated comparison, when the ranking between close competitors can flip with a different split.",
        "Standardising, imputing missing values, or selecting features using statistics computed on the full data set before splitting into train and test -- any of these can leak information just as feature selection does in this week's example.",
        "Reaching for a nonlinear or high-dimensional method by default without first checking, as the curse-of-dimensionality concept shows, whether the effective dimensionality of the problem (after PCA or a factor model) is actually large.",
        "Treating this week's tangency-portfolio result as evidence that shrinkage always improves realised Sharpe ratio by a fixed amount -- the size of the benefit depends on p, n, and how badly conditioned the raw covariance was to begin with.",
    ],
    "check": [
        {"q": "OLS, ridge, principal component regression and lasso are compared on the same data using five-fold cross-validation, all sharing identical folds. Why is sharing the folds across methods important?",
         "options": ["It is not important; folds can differ across methods", "It ensures each method is evaluated on the exact same train/test splits, so differences in reported CV error reflect the methods, not which observations happened to land in which fold",
                     "It only matters when the sample size is very large", "Shared folds are required by the scikit-learn API, not by statistical logic"],
         "answer": 1,
         "why": "If different methods were evaluated on different random folds, some of the observed difference in CV error would be attributable to which particular data ended up as training versus test for each method, confounding the comparison."},
        {"q": "As the number of independent dimensions p grows with sample size fixed, the ratio of nearest-neighbour to farthest-neighbour distance approaches 1. What does this imply for a k-nearest-neighbours-style method?",
         "options": ["The method becomes more accurate as p grows", "The notion of a 'nearby' point becomes less meaningful, since every point becomes roughly equidistant from every other point",
                     "The method is unaffected by p", "This only affects clustering, not nearest-neighbour prediction"],
         "answer": 1,
         "why": "If nearest and farthest neighbours are nearly the same distance away, the ranking of 'closeness' that nearest-neighbour methods rely on carries very little information, degrading their performance in high dimensions."},
        {"q": "A researcher selects the features most correlated with the response using the entire data set (train and test combined), then reports cross-validated R^2 using only those pre-selected features. What is wrong with this?",
         "options": ["Nothing -- feature selection can always be done once, upfront", "The feature selection step already used the test fold's outcomes, so the reported CV error is optimistically biased and will not replicate on genuinely new data",
                     "The problem only arises with more than 1000 candidate features", "This is only a problem for lasso, not for other feature-selection methods"],
         "answer": 1,
         "why": "Because the selection step touched the test rows' outcome values before the split was 'honoured', information from the test set leaked into which features the model gets to use, inflating the apparent performance."},
        {"q": "A tangency portfolio built from a shrunk covariance matrix achieves a higher out-of-sample Sharpe ratio and lower gross leverage than one built from the raw sample covariance, using the identical expected-return estimates. What explains the improvement?",
         "options": ["Shrinkage changed the expected returns used", "Shrinkage produced a better-conditioned covariance matrix, so the portfolio weights (which depend on the covariance's inverse) are less distorted by estimation noise",
                     "The shrunk covariance is always closer to the raw sample covariance in every entry", "There is no real mechanism; the result is due to random chance alone"],
         "answer": 1,
         "why": "Tangency weights are Sigma^{-1} times the excess-return vector; an ill-conditioned Sigma amplifies estimation noise through that inversion, and shrinkage directly reduces the condition number, stabilising the resulting weights and their realised performance."},
    ],
}

WEEKS = [WEEK1, WEEK2, WEEK3, WEEK4, WEEK5, WEEK6, WEEK7, WEEK8, WEEK9, WEEK10]

# ─────────────────────────────────────────────────────────────────────────
# Course-level metadata
# ─────────────────────────────────────────────────────────────────────────
COURSE = {
    "code": "FINM 34700",
    "slug": "finm-34700",
    "title": "Multivariate Statistical Analysis: Applications and Techniques",
    "instructor": "Jingshu Wang",
    "quarter": "Spring",
    "units": 100,
    "block": "electives",
    "concentrations": ["machine-learning-ai"],
    "source": {
        "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/machine-learning-and-ai/finm-34700/",
        "syllabus_url": "https://uchicago.box.com/s/qklh5fxhdeqfxcqemxahypfd8pdsy6a8",
        "fetched": "2026-09-26",
        "note": "The only readable source for this course was the public course page: an official "
                "description of about ninety words plus the instructor, the quarter and the units. The "
                "syllabus PDF is a Box shared link restricted to a university login, so data/raw/syllabus/ "
                "is empty for this course and no syllabus text exists in this corpus. Everything below the "
                "description -- the ten-week arc, the concepts, the formulas, the code and its output, the "
                "pitfalls, the questions, the interview set and the glossary -- is this dashboard's own "
                "reconstruction of a standard graduate treatment of the topics the description names. None "
                "of it comes from the instructor, none of it was reviewed by the instructor, and nothing "
                "about grading, assignments, required readings, exam format or scheduling should be "
                "inferred from it.",
    },
    "tier": "B",
    "description": "An elective in the Machine Learning and AI concentration. It introduces statistical "
                    "methods for analyzing, modeling, and interpreting multivariate and high-dimensional "
                    "data, with an emphasis on dependence structure, dimensionality reduction, latent "
                    "pattern discovery, and predictive modeling. The public description lists principal "
                    "component analysis, factor models, canonical correlation analysis, clustering and "
                    "mixture models, regularized regression (ridge and lasso), sparse methods, covariance "
                    "estimation, and tree-based methods including random forests, taught with an emphasis "
                    "on geometric intuition and computational implementation over classical distribution "
                    "theory, and applied throughout to real data sets comparing linear and nonlinear "
                    "approaches.",
    "prerequisites": [
        "Linear algebra you can compute with: eigenvalues and eigenvectors of a symmetric matrix, "
        "quadratic forms, positive semi-definiteness, and matrix inversion. Every method in this course "
        "is, underneath, an operation on the eigenstructure of a covariance matrix.",
        "Probability and statistics through the multivariate normal distribution, moments, and basic "
        "estimation: what a mean vector and covariance matrix estimate, and why an estimate has sampling "
        "variability.",
        "Ordinary least squares in matrix form. Ridge, lasso, PCA regression and factor models are all "
        "variations on a linear model fit by minimising a penalised or transformed sum of squares.",
        "Python with numpy at the level of solving a linear system, computing an eigendecomposition or a "
        "Cholesky factor, and writing a simulation loop. pandas for basic data handling.",
        "Comfort reading and writing code that manipulates matrices directly, since several weeks "
        "implement a method (coordinate descent, a regression tree, k-means) from its update rule rather "
        "than calling a single library function.",
    ],
    "textbooks": [
        {
            "title": "An Introduction to Statistical Learning",
            "author": "Gareth James, Daniela Witten, Trevor Hastie, and Robert Tibshirani",
            "note": "The standard reference for ridge, lasso, PCA, clustering and tree-based methods "
                    "(weeks 2, 5, 6, 8 and 9) at the level of intuition and application this course "
                    "targets, before the more technical treatment below.",
        },
        {
            "title": "The Elements of Statistical Learning",
            "author": "Trevor Hastie, Robert Tibshirani, and Jerome Friedman",
            "note": "The technical companion: the derivations behind coordinate descent for lasso, "
                    "the bias-variance decomposition of ridge and PCA regression, and the statistical "
                    "theory of bagging and random forests.",
        },
        {
            "title": "Applied Multivariate Statistical Analysis",
            "author": "Richard A. Johnson and Dean W. Wichern",
            "note": "A classical multivariate-statistics treatment of covariance structure, principal "
                    "components, and canonical correlation analysis (weeks 1 to 4), with the distribution "
                    "theory this course deliberately de-emphasises in favour of geometry and computation.",
        },
    ],
    "skills_built": [
        "pca",
        "factor-models",
        "canonical-correlation",
        "covariance-estimation",
        "ridge-regression",
        "lasso",
        "clustering",
        "decision-trees",
        "random-forests",
    ],
    "skills_assumed": [
        "linear-algebra",
        "linear-regression",
        "numpy",
        "python-pandas",
        "conditional-expectation",
    ],
    "brushup": [
        {
            "topic": "Eigenvalues and eigenvectors of a symmetric matrix",
            "why": "PCA is nothing but sorting the eigenvectors of a covariance matrix by eigenvalue. If "
                   "'the eigenvector with the largest eigenvalue is the direction of maximum variance' "
                   "is not already intuitive, week 2 will feel like a list of numpy calls rather than one "
                   "idea applied four different ways.",
            "resource": "Strang, Introduction to Linear Algebra, the chapters on symmetric matrices and "
                        "the spectral theorem; then diagonalise a 3x3 covariance matrix by hand.",
        },
        {
            "topic": "Positive semi-definiteness and quadratic forms",
            "why": "Every covariance matrix is symmetric PSD, and w'Sigma w is the variance of w'X. "
                   "Mahalanobis distance, ridge's penalty term, and the min-variance portfolio all use "
                   "this identity in week 1 and again in week 10.",
            "resource": "Any linear algebra text's chapter on definiteness; then verify that A'A is PSD "
                        "for an arbitrary matrix A.",
        },
        {
            "topic": "OLS in matrix form, including the normal equations",
            "why": "Ridge (week 5), lasso (week 6) and principal component regression (weeks 2 and 10) "
                   "are all OLS with either a penalty added to the normal equations or the design matrix "
                   "replaced by a rotated, truncated version of itself.",
            "resource": "Any econometrics text on the multiple regression model in matrix form; then "
                        "derive the ridge normal equations (X'X + lambda*I) beta = X'y from the penalised "
                        "objective.",
        },
        {
            "topic": "The sample covariance matrix and the effect of n relative to p",
            "why": "Weeks 1 and 7 both hinge on the fact that the sample covariance matrix's eigenvalues "
                   "spread out as p approaches n, even under a simple true covariance -- the single fact "
                   "that motivates shrinkage, PCA and regularisation throughout the course.",
            "resource": "Any multivariate statistics text's chapter on the Wishart distribution and "
                        "sample covariance properties; then simulate the eigenvalue spread at a few "
                        "values of p/n.",
        },
        {
            "topic": "numpy: eigendecomposition, Cholesky factors, and simulating correlated data",
            "why": "Every snippet in this course starts by simulating data with a known covariance "
                   "structure and then estimating that structure back. np.linalg.eigh, np.linalg.cholesky "
                   "and broadcasting are used in nearly every week.",
            "resource": "The numpy linalg documentation; then generate two thousand draws from a "
                        "four-variable distribution with a specified correlation matrix in three lines.",
        },
        {
            "topic": "Basic algorithmic thinking: loops, recursion, and greedy search",
            "why": "Weeks 6, 8 and 9 implement coordinate descent, k-means, and recursive tree-growing "
                   "from their update rules rather than calling a single library function -- you need to "
                   "be comfortable writing and tracing a loop that updates a state until it stops changing.",
            "resource": "Any introductory algorithms text's chapter on iterative and greedy methods; then "
                        "implement gradient descent on a quadratic function from scratch.",
        },
    ],
    "interview": [
        {
            "q": "Why is a covariance matrix always positive semi-definite, and what does it mean when a "
                 "matrix that is supposed to be one comes back with a negative eigenvalue?",
            "level": "screen",
            "answer": "A covariance matrix's quadratic form w'Sigma w equals the variance of the linear "
                      "combination w'X, which cannot be negative for any w, so every eigenvalue must be "
                      "non-negative. A small negative eigenvalue in an estimated matrix usually means p is "
                      "close to or exceeds n, or the matrix was built inconsistently, for example from "
                      "pairwise-complete correlations that do not come from one common data matrix -- not "
                      "routine floating-point noise, which is the wrong diagnosis to reach for first.",
        },
        {
            "q": "Walk me through what PCA actually computes, without using the phrase 'dimensionality "
                 "reduction'.",
            "level": "screen",
            "answer": "PCA eigendecomposes the covariance matrix. The eigenvector with the largest "
                      "eigenvalue is the direction in variable space along which the data has the most "
                      "variance; the eigenvalue itself is that variance. The next component is the "
                      "eigenvector, orthogonal to the first, with the next-largest eigenvalue, and so on. "
                      "There is no separate algorithm beyond np.linalg.eigh and a sort -- everything else, "
                      "loadings, scores, variance explained, is reading off properties of that "
                      "eigendecomposition.",
        },
        {
            "q": "When would you reach for canonical correlation analysis instead of running PCA on each "
                 "block of variables separately?",
            "level": "screen",
            "answer": "When the question is specifically how two blocks of variables co-move, not how "
                      "either block varies internally. PCA on each block separately finds the directions "
                      "of maximum variance within a block, which may have nothing to do with the other "
                      "block. CCA whitens both blocks by their own inverse square-root covariance and then "
                      "finds the pair of directions, one from each block, with maximal correlation -- it is "
                      "the cross-block analogue of PCA's within-block analogue.",
        },
        {
            "q": "A colleague standardises all two hundred candidate features and selects the twenty most "
                 "correlated with the outcome before running five-fold cross-validation on those twenty. "
                 "What is wrong?",
            "level": "onsite",
            "answer": "The feature-selection step used the entire data set, including the rows that will "
                      "later serve as each fold's test set, so the reported cross-validated error is "
                      "optimistically biased. In a simulation with a response that is pure noise, selecting "
                      "the five most-correlated features using the full sample produced a mean "
                      "out-of-sample R-squared of +0.23; doing the identical selection using only each "
                      "fold's training rows produced the honest answer of about -0.19. The fix is to put "
                      "feature selection inside the cross-validation loop, refitting it on each fold's "
                      "training data alone.",
        },
        {
            "q": "How would you decide, in practice, how many principal components to keep?",
            "level": "onsite",
            "answer": "Plot cumulative variance explained against the number of components and look for "
                      "the elbow, the point where the curve goes from steep to nearly flat, since the "
                      "eigenvalues always sum to total variance. I would cross-check that against "
                      "reconstruction error, which is exactly the sum of the dropped eigenvalues, and "
                      "against whether the retained loadings have an interpretable pattern, such as the "
                      "level/slope/curvature structure that shows up whenever variables are ordered along "
                      "an axis like maturity or moneyness. A component that explains variance but has no "
                      "interpretable loading pattern is worth treating with suspicion.",
        },
        {
            "q": "Explain what coordinate descent is doing when it fits a lasso, and why the update "
                 "involves a soft-threshold rather than a plain least-squares step.",
            "level": "onsite",
            "answer": "Coordinate descent fixes every coefficient except one, solves for that one "
                      "coefficient's optimal value holding the rest fixed, and cycles through coefficients "
                      "until nothing changes. Because the L1 penalty is not differentiable at zero, the "
                      "per-coordinate optimum is a soft-threshold of the ordinary least-squares update: it "
                      "shrinks the coefficient toward zero by the penalty amount and sets it to exactly "
                      "zero if the shrinkage would flip its sign. That thresholding step is the entire "
                      "mechanism behind lasso's variable selection -- ridge's L2 penalty has a smooth "
                      "derivative everywhere and never zeroes a coefficient exactly.",
        },
        {
            "q": "Why does shrinking a sample covariance matrix improve a tangency portfolio's realised "
                 "Sharpe ratio, when the shrinkage target has nothing to do with the true covariance?",
            "level": "onsite",
            "answer": "Tangency weights are proportional to the inverse covariance matrix applied to "
                      "expected excess returns, and inversion divides by the smallest eigenvalues, which "
                      "are the noisiest, most estimation-error-dominated directions in a data-starved "
                      "sample. Shrinking toward a structured target such as a scaled identity improves the "
                      "matrix's conditioning even though the target is not the truth, which stabilises the "
                      "inverse. In a thirty-six-month, twenty-five-asset simulation this raised the "
                      "out-of-sample Sharpe ratio from 0.033 to 0.052 while cutting gross leverage from "
                      "2.6x to 1.5x, with the expected-return inputs held identical.",
        },
        {
            "q": "Why can permutation importance badly understate the importance of a signal that is "
                 "carried by two correlated features instead of one?",
            "level": "onsite",
            "answer": "Permutation importance measures the rise in error from shuffling one feature while "
                      "leaving everything else, including a correlated substitute, intact. If two features "
                      "carry the same signal, the model can lean on whichever one was not shuffled, so "
                      "permuting either alone understates how much the pair jointly matters. In a small "
                      "simulation a single informative feature registered an importance of 5.24; the "
                      "identical signal split across two correlated duplicates registered only 0.98 and "
                      "1.97 on the two copies, even though the combined predictive content was unchanged.",
        },
        {
            "q": "A random forest and a bagging ensemble are trained on the same data, one dominant "
                 "predictive feature and several weaker or noise features. Which one decorrelates the "
                 "trees more, and why does that matter for the variance of the ensemble average?",
            "level": "senior",
            "answer": "The random forest, because restricting each split to a random subset of features "
                      "prevents every tree from defaulting to the same dominant predictor, forcing "
                      "different trees to rely on different features. The variance of an ensemble average "
                      "is rho*sigma^2 + (1-rho)/B*sigma^2, where rho is the correlation between trees; as B "
                      "grows large the second term vanishes but rho*sigma^2 remains a floor that plain "
                      "bagging cannot remove by adding more trees. In a simulation, bagged trees correlated "
                      "at 0.725 while random-forest-restricted trees correlated at 0.427, which is why "
                      "random forests typically beat bagging by more than adding trees alone would explain.",
        },
        {
            "q": "You are handed a covariance matrix estimated from 40 assets and 36 months of returns and "
                 "asked to build a minimum-variance portfolio. What do you check before inverting it?",
            "level": "senior",
            "answer": "The condition number, because p at 40 against n at 36 is exactly the regime where "
                      "sample-covariance eigenvalues spread out purely from estimation noise: the smallest "
                      "eigenvalues get pushed toward zero and the largest get pushed up even under a "
                      "genuinely simple true covariance. I would not invert the raw sample covariance in "
                      "this regime; I would shrink it toward a structured target first, since shrinkage "
                      "improves the behaviour of the inverse far more than it improves the matrix itself "
                      "in any entrywise sense, and then check that the resulting minimum-variance weights "
                      "are not dominated by a handful of extreme, unstable positions.",
        },
        {
            "q": "The curse of dimensionality is often described loosely as 'high-dimensional data is "
                 "sparse.' Make that precise, and explain why it undermines a nearest-neighbour method "
                 "specifically.",
            "level": "senior",
            "answer": "Precisely: for points drawn with independent coordinates in a p-dimensional space, "
                      "the ratio of the nearest neighbour's distance to the farthest neighbour's distance "
                      "converges to 1 as p grows, with sample size fixed. In a simulation with 500 points "
                      "the ratio was 0.023 at p equals 2 and 0.862 at p equals 500. A nearest-neighbour "
                      "method's entire mechanism depends on some points being meaningfully closer than "
                      "others; once every point is nearly equidistant from every other point, 'nearest' "
                      "carries almost no information, which is the strongest argument for a dimension-"
                      "reduction step, PCA, factor models or regularisation, before applying such a method.",
        },
        {
            "q": "How would you fairly compare OLS, ridge, principal component regression, and lasso on "
                 "the same data set, and what would make the comparison unfair?",
            "level": "senior",
            "answer": "Run all four inside the identical K-fold cross-validation loop, changing only which "
                      "fitting function is called inside each fold and holding the fold assignments fixed "
                      "across methods, so any difference in reported error reflects the methods rather than "
                      "which observations happened to land in which fold. It would be unfair to tune each "
                      "method's hyperparameter on a different split, to let any method see test-fold "
                      "outcomes during a preprocessing or feature-selection step, or to declare a winner "
                      "from a single train/test split when the ranking between close competitors can flip "
                      "with a different split -- the ranking is also specific to how well each method's "
                      "assumption, such as lasso's sparsity, matches the particular data's true structure.",
        },
    ],
    "reappears_in": [
        {
            "code": "FINM 36700",
            "how": "Portfolio and Risk Management consumes this course's estimation machinery directly: "
                   "covariance shrinkage and conditioning feed its plug-in-optimiser and minimum-variance "
                   "weeks, and PCA is the standard tool for reducing a large asset universe to a handful "
                   "of factors before optimising.",
        },
        {
            "code": "FINM 33150",
            "how": "Quantitative Trading Strategies builds signals from factor exposures and regularised "
                   "regressions much like weeks 3, 5 and 6 here, and its portfolio-construction step "
                   "inherits the same covariance-conditioning concerns as week 7.",
        },
        {
            "code": "FINM 33160",
            "how": "Machine Learning for Finance applies ridge, lasso, and tree-based methods (weeks 5, 6 "
                   "and 9 here) to return-forecasting problems, where this course's cross-validation and "
                   "leakage discipline from week 10 is the difference between a result that replicates and "
                   "one that does not.",
        },
        {
            "code": "FINM 34600",
            "how": "The Analysis of High Frequency Data estimates covariance matrices from noisy, "
                   "asynchronously sampled returns, which is the same high-dimensional covariance-"
                   "estimation problem week 7 introduces, under an additional microstructure-noise "
                   "complication.",
        },
        {
            "code": "FINM 33100",
            "how": "Foundations of Applied Machine Learning covers the same regression-tree and clustering "
                   "building blocks introduced in weeks 8 and 9 here, at an earlier point in the program "
                   "and with less emphasis on the multivariate, covariance-driven framing.",
        },
    ],
    "glossary": [
        {"term": "Covariance matrix", "def": "A symmetric matrix collecting the variance of each variable "
                                              "on its diagonal and the covariance of every pair off it; "
                                              "always positive semi-definite when built consistently from "
                                              "one common data matrix."},
        {"term": "Mahalanobis distance", "def": "A distance that rescales by the inverse covariance "
                                                  "matrix, so movement along a correlated data set's "
                                                  "natural axis of variation counts for less than movement "
                                                  "across it."},
        {"term": "Principal component", "def": "An eigenvector of a covariance matrix, ordered by "
                                                 "eigenvalue; the direction of maximal remaining variance "
                                                 "orthogonal to every earlier component."},
        {"term": "Variance explained", "def": "The fraction of total variance (the sum of all eigenvalues) "
                                                "captured by a chosen number of top principal components."},
        {"term": "Factor model", "def": "A model that decomposes each variable's variance into a component "
                                          "shared with common factors and an idiosyncratic component "
                                          "specific to that variable."},
        {"term": "Canonical correlation analysis", "def": "A method that finds the pair of linear "
                                                            "combinations, one from each of two blocks of "
                                                            "variables, with maximal correlation, after "
                                                            "whitening each block by its own covariance."},
        {"term": "Ridge regression", "def": "Least squares with an added L2 penalty on the coefficient "
                                              "vector, which shrinks coefficients and improves the "
                                              "conditioning of the normal equations."},
        {"term": "Lasso", "def": "Least squares with an added L1 penalty, fit by coordinate descent with a "
                                   "soft-threshold update, which performs variable selection by shrinking "
                                   "some coefficients to exactly zero."},
        {"term": "Shrinkage estimator", "def": "An estimated covariance matrix blended toward a structured "
                                                 "target (such as a scaled identity) at an intensity chosen "
                                                 "to trade a small bias for a large reduction in variance."},
        {"term": "Condition number", "def": "The ratio of a matrix's largest to smallest eigenvalue; large "
                                              "values signal a matrix that amplifies estimation noise when "
                                              "inverted."},
        {"term": "Marchenko-Pastur law", "def": "The limiting distribution of sample-covariance eigenvalues "
                                                  "under a true identity covariance, as p and n grow "
                                                  "together at a fixed ratio; the theoretical explanation "
                                                  "for eigenvalue spreading."},
        {"term": "k-means", "def": "A clustering algorithm that alternates assigning each point to its "
                                     "nearest cluster centre and recomputing each centre as the mean of its "
                                     "assigned points, until assignments stop changing."},
        {"term": "Gaussian mixture model", "def": "A clustering model that assigns each point a probability "
                                                     "of belonging to each of several Gaussian components, "
                                                     "fit by the EM algorithm, rather than a single hard "
                                                     "cluster label."},
        {"term": "Hierarchical clustering", "def": "A clustering method that builds a nested sequence of "
                                                      "clusters by repeatedly merging (or splitting) groups "
                                                      "according to a linkage rule, with no need to fix the "
                                                      "number of clusters in advance."},
        {"term": "CART", "def": "Classification and regression trees: a model built by recursively "
                                  "partitioning feature space, at each step choosing the single split that "
                                  "most reduces prediction error within each resulting region."},
        {"term": "Bagging", "def": "Bootstrap aggregating: fitting many models on bootstrap resamples of "
                                     "the training data and averaging their predictions to reduce variance."},
        {"term": "Random forest", "def": "Bagged trees with an added restriction that only a random subset "
                                           "of features is considered at each split, which decorrelates the "
                                           "trees and unlocks more of bagging's variance reduction."},
        {"term": "Permutation importance", "def": "A feature's importance measured as the rise in a fitted "
                                                     "model's error when that feature's values are randomly "
                                                     "shuffled; dilutes across correlated features that "
                                                     "carry the same signal."},
        {"term": "Curse of dimensionality", "def": "The tendency of distances between points to become "
                                                      "nearly equal as the number of independent dimensions "
                                                      "grows, undermining any method that relies on "
                                                      "'nearby' being meaningful."},
        {"term": "Data leakage", "def": "Any pipeline step that uses information from data that will later "
                                          "be used for evaluation, such as selecting features by their "
                                          "correlation with the outcome across the full sample before "
                                          "splitting into train and test."},
    ],
    "weeks": WEEKS,
}


def main() -> None:
    with open(OUT, "w") as f:
        f.write(
            "/* courses/finm-34700.js -- FINM 34700, Multivariate Statistical Analysis: Applications "
            "and Techniques.\n"
            "   Built from the public course page only. The syllabus is a Box shared link behind a\n"
            "   university login and was not readable, so the ten-week arc, the explanations, the\n"
            "   code, the questions, the interview set and the glossary are this dashboard's own\n"
            "   reconstruction of a standard graduate treatment of the topics the public\n"
            "   description names -- not the instructor's material, and not endorsed by anyone.\n"
            "   Every code `output` is real stdout written by tools/run_snippets.py; do not edit\n"
            "   those strings by hand. */\n"
        )
        f.write('window.COURSES = window.COURSES || {};\n')
        f.write('window.COURSES["FINM 34700"] = ')
        f.write(json.dumps(COURSE, indent=2))
        f.write(';\n')
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
