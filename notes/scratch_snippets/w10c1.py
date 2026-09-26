import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

def carr_madan_fft(S0, r, sigma, T, alpha=1.5, N=4096, eta=0.25):
    """Carr-Madan (1999) FFT pricer: one FFT call prices ALL strikes on the grid at once."""
    x0 = math.log(S0)
    mu = x0 + (r - 0.5*sigma*sigma)*T
    var = sigma*sigma*T

    def phi(u):
        return np.exp(1j*u*mu - 0.5*var*u*u)

    lam = 2*math.pi / (N*eta)
    b = N*lam/2.0
    j = np.arange(N)
    v = j*eta
    ku = -b + lam*j                     # log-strike grid the FFT lands prices on

    psi = (np.exp(-r*T) * phi(v - (alpha+1)*1j)
           / (alpha*alpha + alpha - v*v + 1j*(2*alpha+1)*v))
    simpson = (3.0 - (-1.0)**j - np.where(j == 0, 1.0, 0.0)) / 3.0
    x = np.exp(1j*b*v) * psi * eta * simpson
    y = np.fft.fft(x)
    call_prices = np.real(np.exp(-alpha*ku) / math.pi * y)
    return ku, call_prices

S0, r, sigma, T = 100.0, 0.05, 0.2, 1.0
ku, call_prices = carr_madan_fft(S0, r, sigma, T)
strikes_of_interest = (80.0, 90.0, 100.0, 110.0, 120.0)
print(f"{'K':>8} {'FFT price':>12} {'BS price':>12} {'error':>10}")
for K in strikes_of_interest:
    # the FFT lands prices on its own log-strike grid, not on our chosen strikes exactly,
    # so read the curve off with a linear interpolation between the two nearest grid points
    fft_price = np.interp(math.log(K), ku, call_prices)
    bs_price = bs_call(S0, K, r, sigma, T)
    print(f"{K:8.1f} {fft_price:12.6f} {bs_price:12.6f} {fft_price-bs_price:+10.2e}")
print("one FFT call above priced the entire grid of 4096 strikes at once; BS is evaluated per")
print("strike only to check five of them here -- that is the whole appeal of the FFT method for")
print("building a full implied-volatility surface in one shot")
