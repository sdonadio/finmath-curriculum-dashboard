import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def fourier_call(S0, K, r, sigma, T, u_max=200.0, n=20000):
    x0 = math.log(S0)
    mu = x0 + (r - 0.5*sigma*sigma)*T
    var = sigma*sigma*T
    k = math.log(K)

    def phi(u):
        return np.exp(1j*u*mu - 0.5*var*u*u)

    u = np.linspace(1e-6, u_max, n)   # avoid the removable singularity exactly at 0
    du = u[1] - u[0]

    def trapezoid(y):   # manual trapezoidal rule; avoids any numpy version quirks
        return du * (y.sum() - 0.5*(y[0] + y[-1]))

    integrand2 = np.real(np.exp(-1j*u*k) * phi(u) / (1j*u))
    P2 = 0.5 + trapezoid(integrand2) / math.pi

    phi_neg_i = math.exp(mu + 0.5*var)   # phi(-i) = E[S_T] = S0*e^{rT}
    integrand1 = np.real(np.exp(-1j*u*k) * phi(u - 1j) / (1j*u*phi_neg_i))
    P1 = 0.5 + trapezoid(integrand1) / math.pi

    return S0*P1 - K*math.exp(-r*T)*P2

S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
fourier_price = fourier_call(S0, K, r, sigma, T)
print(f"closed-form Black-Scholes price: {bs_price:.6f}")
print(f"Fourier / characteristic-function price (same model): {fourier_price:.6f}")
print(f"difference: {fourier_price-bs_price:+.2e} -- the two routes to the same number agree to")
print("many digits, and the Fourier route needs only phi(u), which BS happens to have in closed")
print("form but Heston, Merton-jump and VG do not")
