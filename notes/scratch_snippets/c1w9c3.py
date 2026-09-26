import numpy as np
np.seterr(all="ignore")

bases = {
    "CDS - bond (single name)": -0.0020,
    "CDX index - avg constituent": -0.0010,
    "credit ETF vs NAV (stress)": -0.0180,
}
notional = 10_000_000

for name, b in bases.items():
    carry = -b * notional
    print(f"{name:32s} basis={b:+.3%}   approximate annual carry on ${notional:,.0f} = ${carry:,.0f}")

total_carry = sum(-b * notional for b in bases.values())
print(f"\nstacking all three (independent notional in each) = ${total_carry:,.0f}")
print("\nevery basis trade in this course is the SAME shape: two claims on the same credit risk priced")
print("slightly apart, and a position that is long the cheap one and short the rich one, waiting for convergence")
