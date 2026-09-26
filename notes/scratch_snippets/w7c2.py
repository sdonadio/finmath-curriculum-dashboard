import numpy as np
np.seterr(all="ignore")
import math

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    Ncdf = lambda x: 0.5*(1.0+math.erf(x/math.sqrt(2.0)))
    return S*Ncdf(d1) - K*math.exp(-r*T)*Ncdf(d2)

rng = np.random.default_rng(32000)
S0, K, r, sigma, T = 100.0, 100.0, 0.05, 0.2, 1.0
bs_price = bs_call(S0, K, r, sigma, T)
n = 50_000

Z = rng.standard_normal(n)
ST = S0 * np.exp((r - 0.5*sigma*sigma)*T + sigma*math.sqrt(T)*Z)
payoff = math.exp(-r*T) * np.maximum(ST - K, 0.0)
control = math.exp(-r*T) * ST                  # a traded asset: known discounted mean = S0
control_mean = S0

b = np.cov(payoff, control, ddof=1)[0, 1] / np.var(control, ddof=1)   # optimal coefficient
cv_estimate = payoff - b*(control - control_mean)

print(f"Black-Scholes price: {bs_price:.6f}")
print(f"plain MC   : price={payoff.mean():.6f}  stderr={payoff.std(ddof=1)/math.sqrt(n):.6f}")
print(f"control-variate MC (b={b:.4f}): price={cv_estimate.mean():.6f}  stderr={cv_estimate.std(ddof=1)/math.sqrt(n):.6f}")
var_reduction = 1 - (cv_estimate.std(ddof=1)**2)/(payoff.std(ddof=1)**2)
print(f"variance reduced by {100*var_reduction:.1f}% using the discounted stock itself as the control")
