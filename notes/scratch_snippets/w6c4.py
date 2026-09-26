import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(34500)
theta, mu, sigma = 1.2, 0.05, 0.02
X0, T = 0.03, 1.0
paths = 60_000
n = 800
dt = T / n

dW = rng.normal(0.0, np.sqrt(dt), size=(paths, n))
X = np.full(paths, X0)
for i in range(n):
    X = X + theta * (mu - X) * dt + sigma * dW[:, i]

mc = X.mean()
exact = mu + (X0 - mu) * np.exp(-theta * T)
print(f"E[X_T | X_0={X0}]  Monte Carlo = {mc:.5f}    Feynman-Kac exact  mu+(x-mu)e^(-theta T) = {exact:.5f}")
print("u(t,x)=E[X_T|X_t=x] solves du/dt + theta(mu-x)du/dx + 0.5 sigma^2 d2u/dx2 = 0 with u(T,x)=x")
print("this is the SAME theorem as the plain heat-equation case, with a drift term added for the mean reversion")
