import numpy as np
np.seterr(all="ignore")

tenors = np.array([2, 5, 10, 20, 30])
treasury_yield = np.array([0.038, 0.040, 0.042, 0.044, 0.045])
muni_yield = np.array([0.026, 0.029, 0.033, 0.038, 0.041])
ratio = muni_yield / treasury_yield

for t, tr, mu, r in zip(tenors, treasury_yield, muni_yield, ratio):
    print(f"{t:2d}y:  Treasury={tr:.2%}  Muni={mu:.2%}  muni/Treasury ratio={r:.1%}")

print("\na ratio above its historical range (often roughly 80-90% at the long end) flags munis as cheap;")
print("a ratio below that range flags them as rich -- the raw yield alone does not tell you which")
