import numpy as np
np.seterr(all="ignore")
import math

S0, r, sigma, T = 100.0, 0.05, 0.2, 1.0
x0 = math.log(S0)
mu = x0 + (r - 0.5*sigma*sigma)*T
var = sigma*sigma*T

def char_fn(u):
    """Characteristic function of ln(S_T) under the risk-neutral GBM measure."""
    return np.exp(1j*u*mu - 0.5*var*u*u)

# recover the mean and variance of ln(S_T) purely from the characteristic function,
# via its derivatives at u=0: phi'(0)=i*E[X], phi''(0)=-E[X^2]
h = 1e-4
phi0 = char_fn(0.0)
phi_p = (char_fn(h) - char_fn(-h)) / (2*h)
phi_pp = (char_fn(h) - 2*char_fn(0.0) + char_fn(-h)) / (h*h)
mean_est = (phi_p / (1j)).real
second_moment_est = (-phi_pp).real
var_est = second_moment_est - mean_est**2

print(f"true E[ln S_T] = {mu:.6f}   from phi'(0): {mean_est:.6f}")
print(f"true Var[ln S_T] = {var:.6f}   from phi derivatives: {var_est:.6f}")
print("the characteristic function is just a Fourier transform of the density: every moment,")
print("and (by inversion) the whole density and every option price, sits inside phi(u) even for")
print("models like Heston where no closed-form density or price exists at all")
