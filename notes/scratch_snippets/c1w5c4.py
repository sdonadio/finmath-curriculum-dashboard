import numpy as np
np.seterr(all="ignore")

expected_losses = {"equity": 0.5747, "mezz": 0.0190, "senior": 0.000002, "super-senior": 0.0}
duration = 4.0
risk_premium = 1.5   # a multiplicative premium over expected loss, compensating for loss UNCERTAINTY, not just its mean

for name, el in expected_losses.items():
    naive_spread = el / duration * risk_premium
    print(f"{name:12s}  expected loss = {el:.4%}   naive spread ~ EL/duration*premium = {naive_spread:.4%}")

print("\nthe SAME credit-triangle logic from week 1 (spread ~ hazard*(1-recovery)) reappears here as")
print("spread ~ expected tranche loss / duration -- tranching just changes WHICH expected loss feeds the formula")
