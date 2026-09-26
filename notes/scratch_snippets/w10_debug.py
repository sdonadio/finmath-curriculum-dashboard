import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

S0, r, sigma, T = 100.0, 0.05, 0.2, 1.0
x0 = math.log(S0)
mu = x0 + (r - 0.5*sigma*sigma)*T
var = sigma*sigma*T

def phi(u):
    return np.exp(1j*u*mu - 0.5*var*u*u)

alpha = 1.5
def psi(v):
    return np.exp(-r*T)*phi(v-(alpha+1)*1j) / (alpha*alpha+alpha-v*v+1j*(2*alpha+1)*v)

K = 100.0
k = math.log(K)
v = np.linspace(1e-6, 400.0, 400000)
dv = v[1]-v[0]
integrand = np.real(np.exp(-1j*v*k)*psi(v))
integral = dv*(integrand.sum() - 0.5*(integrand[0]+integrand[-1]))
price = math.exp(-alpha*k)/math.pi * integral
print("direct (undiscretized) Carr-Madan integral price:", price)
print("BS price:", bs_call(S0,K,r,sigma,T))
