import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def crr_call(S0, K, r, sigma, T, n):
    dt = T/n
    u = math.exp(sigma*math.sqrt(dt)); d = 1.0/u
    R = math.exp(r*dt); q = (R-d)/(u-d); disc = math.exp(-r*dt)
    j = np.arange(n+1)
    ST = S0*(u**j)*(d**(n-j))
    values = np.maximum(ST-K, 0.0)
    for step in range(n, 0, -1):
        values = disc*(q*values[1:step+1] + (1-q)*values[0:step])
    return values[0]

rng = np.random.default_rng(32000)
def mc_call(S0, K, r, sigma, T, n_paths):
    Z = rng.standard_normal(n_paths)
    ST = S0*np.exp((r-0.5*sigma*sigma)*T + sigma*math.sqrt(T)*Z)
    return math.exp(-r*T)*np.maximum(ST-K, 0.0).mean()

def cos_call(S0, K, r, sigma, T, N_terms, L=10.0):
    mu = (r - 0.5*sigma*sigma)*T
    var = sigma*sigma*T
    a = mu - L*math.sqrt(var + math.sqrt(var*var))
    b = mu + L*math.sqrt(var + math.sqrt(var*var))
    kk = np.arange(N_terms)
    u = kk*math.pi/(b-a)
    def phi(uu):
        return np.exp(1j*uu*mu - 0.5*var*uu*uu)
    def chi(c, d):
        t1 = np.cos(u*(d-a))*math.exp(d) - np.cos(u*(c-a))*math.exp(c)
        t2 = u*(np.sin(u*(d-a))*math.exp(d) - np.sin(u*(c-a))*math.exp(c))
        return (t1+t2)/(1.0+u*u)
    def psi(c, d):
        return np.where(kk==0, d-c, (np.sin(u*(d-a))-np.sin(u*(c-a)))/np.where(u==0,1.0,u))
    Vk = 2.0/(b-a)*K*(chi(0.0, b) - psi(0.0, b))
    weight = np.where(kk==0, 0.5, 1.0)
    terms = weight*np.real(phi(u)*np.exp(-1j*u*a))*Vk
    return math.exp(-r*T)*terms.sum()

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes price: {bs_price:.6f}\n")
print(f"{'method':<28}{'price':>10}{'abs error':>12}{'work (ops, order of mag.)':>28}")

n_tree = 200
p = crr_call(S0, K, r, sigma, T, n_tree)
print(f"{'binomial tree, n='+str(n_tree):<28}{p:10.6f}{abs(p-bs_price):12.2e}{n_tree*n_tree//2:28d}")

n_paths = 200_000
p = mc_call(S0, K, r, sigma, T, n_paths)
print(f"{'Monte Carlo, n='+str(n_paths):<28}{p:10.6f}{abs(p-bs_price):12.2e}{n_paths:28d}")

N_terms = 64
p = cos_call(S0, K, r, sigma, T, N_terms)
print(f"{'Fourier COS, N='+str(N_terms):<28}{p:10.6f}{abs(p-bs_price):12.2e}{N_terms:28d}")

print("\nfor a single, smooth, low-dimensional payoff like this one, Fourier needs orders of")
print("magnitude fewer evaluations than tree or Monte Carlo for comparable accuracy; the tree and")
print("Monte Carlo earn their keep instead on American exercise (tree, week 3) and high-dimensional")
print("or exotic payoffs (Monte Carlo, weeks 6-8) where Fourier and PDE grids stop being practical")
