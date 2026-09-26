import numpy as np
np.seterr(all="ignore")

bond_zspread = 0.021     # z-spread implied by the bond's market price (week 1's calculation)
cds_spread = 0.019       # market CDS spread, same credit and roughly the same maturity
basis = cds_spread - bond_zspread

print(f"bond z-spread   = {bond_zspread:.4%}")
print(f"CDS spread      = {cds_spread:.4%}")
print(f"CDS-bond basis  = {basis:+.4%}   ({'negative basis: CDS is cheaper than the bond' if basis < 0 else 'positive basis: CDS is richer than the bond'})")

notional = 10_000_000
carry_per_year = -basis * notional     # a negative-basis package (long bond + long protection) earns |basis| while it holds
print(f"\napproximate annual carry on a ${notional:,.0f} negative-basis package = ${carry_per_year:,.0f}")
