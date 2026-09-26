import numpy as np
np.seterr(all="ignore")

notional = 10_000_000
recovery = 0.4
risky_annuity = 4.3

cs01 = notional * risky_annuity * 0.0001    # PV change per 1bp of CDS spread
print(f"CS01 (PV change per 1bp of CDS spread) = ${cs01:,.0f}")

jtd_loss = notional * (1 - recovery)         # loss if the name defaults right now
print(f"jump-to-default exposure (if the name defaults today) = ${jtd_loss:,.0f}")
print(f"\nJTD / CS01 ratio = {jtd_loss/cs01:.0f}x -- CS01 hedges the day-to-day spread wiggle,")
print("but a position sized only to be CS01-neutral can still carry enormous, un-hedged jump-to-default risk")

spread_widen_bp = 50
spread_pnl = -cs01 * spread_widen_bp
print(f"\nscenario: spread widens {spread_widen_bp}bp        -> mark-to-market P&L = ${spread_pnl:,.0f}")
print(f"scenario: issuer defaults tomorrow      -> realized loss        = ${-jtd_loss:,.0f}")
