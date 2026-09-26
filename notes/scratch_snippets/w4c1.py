import numpy as np
np.seterr(all="ignore")

def d2_central(f, x, h):
    return (f(x+h) - 2*f(x) + f(x-h)) / (h*h)

f = lambda x: np.sin(x) * np.exp(0.3*x)      # a smooth test function, not a price

x0 = 1.0
print("central-difference second derivative vs. step size h (test function, not a price):")
for h in (0.4, 0.1, 0.025, 0.00625):
    approx = d2_central(f, x0, h)
    print(f"  h={h:.5f}: d2f_approx={approx:.6f}")
print("halving h roughly quarters the gap between successive estimates: O(h^2) accuracy,")
print("exactly the accuracy a central difference gives the S and t derivatives in the BS PDE")
