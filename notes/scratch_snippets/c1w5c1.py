import numpy as np
np.seterr(all="ignore")

A, D = 0.03, 0.07     # a mezzanine tranche: attaches at 3%, detaches at 7% of the portfolio's notional
losses = np.array([0.0, 0.02, 0.03, 0.05, 0.07, 0.10, 0.20])


def tranche_loss(L, A, D):
    return np.clip(L - A, 0.0, D - A) / (D - A)


for L in losses:
    tl = tranche_loss(L, A, D)
    print(f"portfolio loss = {L:.2%}   tranche [{A:.0%},{D:.0%}] loss = {tl:.2%}")

print("\nthis is exactly a call-spread payoff on the portfolio loss variable: long a call struck at A, short one at D")
