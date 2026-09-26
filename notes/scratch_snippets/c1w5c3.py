import numpy as np
np.seterr(all="ignore")

pd = 0.05
recovery = 0.4
loss_none, loss_one, loss_both = 0.0, 0.5 * (1 - recovery), 1.0 * (1 - recovery)
A, D = 0.0, 0.5 * (1 - recovery)     # an equity tranche sized to absorb exactly one name's loss


def tl(L, A, D):
    return np.clip(L - A, 0.0, D - A) / (D - A)


p_no_default = (1 - pd) ** 2
p_one_default = 2 * pd * (1 - pd)
p_both_default = pd ** 2
eq_indep = (p_no_default * tl(loss_none, A, D) + p_one_default * tl(loss_one, A, D)
            + p_both_default * tl(loss_both, A, D))
print(f"independent defaults:  P(0)={p_no_default:.3f}  P(1)={p_one_default:.3f}  P(2)={p_both_default:.3f}")
print(f"equity tranche expected loss (independent)          = {eq_indep:.4%}")

p_none_corr = 1 - pd
p_both_corr = pd            # perfectly correlated: the two names default together or not at all
eq_corr = p_none_corr * tl(loss_none, A, D) + p_both_corr * tl(loss_both, A, D)
print(f"perfectly correlated defaults:  P(0)={p_none_corr:.3f}  P(2)={p_both_corr:.3f}")
print(f"equity tranche expected loss (perfect correlation)   = {eq_corr:.4%}")
print("\nsame marginal default probability, same expected PORTFOLIO loss, but a different equity-tranche loss --")
print("correlation redistributes risk across the capital structure without changing the portfolio's total expected loss")
