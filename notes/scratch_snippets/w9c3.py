import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def cos_call(S0, K, r, sigma, T, N_terms=128, L=10.0):
    x0 = math.log(S0 / K)                 # work in log-moneyness, as the COS method does
    mu = (r - 0.5*sigma*sigma)*T
    var = sigma*sigma*T
    c1, c2 = mu, var                        # first two cumulants of log(S_T/K)
    a = c1 - L*math.sqrt(c2 + math.sqrt(c2*c2))
    b = c1 + L*math.sqrt(c2 + math.sqrt(c2*c2))

    def phi(u):
        return np.exp(1j*u*mu - 0.5*var*u*u)

    k = np.arange(N_terms)
    u = k*math.pi/(b - a)

    # Fourier-cosine coefficients of the (undiscounted) call payoff on [a,b], Fang-Oosterlee 2008
    def chi(c, d):
        t1 = (np.cos(u*(d-a)) * np.exp(d) - np.cos(u*(c-a)) * np.exp(c))
        t2 = u * (np.sin(u*(d-a)) * np.exp(d) - np.sin(u*(c-a)) * np.exp(c))
        return (t1 + t2) / (1.0 + u*u)

    def psi(c, d):
        out = np.where(k == 0, d - c, (np.sin(u*(d-a)) - np.sin(u*(c-a))) / np.where(u == 0, 1.0, u))
        return out

    Vk = 2.0/(b-a) * K * (chi(0.0, b) - psi(0.0, b))
    weight = np.where(k == 0, 0.5, 1.0)
    terms = weight * np.real(phi(u) * np.exp(-1j*u*a)) * Vk
    return math.exp(-r*T) * terms.sum()

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
print(f"closed-form Black-Scholes price: {bs_price:.6f}")
for N_terms in (8, 16, 32, 64):
    price = cos_call(S0, K, r, sigma, T, N_terms=N_terms)
    print(f"COS method, {N_terms:3d} cosine terms: price={price:.6f}  error={price-bs_price:+.2e}")
