import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A tiny package universe with version ranges. Resolving "install A and B"
# means finding one version of every package that satisfies every constraint
# every OTHER package imposes on it -- a constraint satisfaction problem.
VERSIONS = {"shared": ["1.0", "1.5", "2.0", "2.5", "3.0"]}


def in_range(v, lo, hi):
    vt, lot = tuple(map(int, v.split("."))), tuple(map(int, lo.split(".")))
    hit = tuple(map(int, hi.split("."))) if hi else None
    ok = vt >= lot
    if hit is not None:
        ok = ok and vt < hit
    return ok


def solve(constraints):
    """constraints: list of (lo, hi) ranges on the SAME package. A solution is
    any version satisfying every range at once; report all that do."""
    ok = [v for v in VERSIONS["shared"]
          if all(in_range(v, lo, hi) for lo, hi in constraints)]
    return ok


CASE_A = {
    "requester_x": ("1.0", "2.5"),   # x needs shared in [1.0, 2.5)
    "requester_y": ("1.5", None),    # y needs shared >= 1.5
}
CASE_B = {
    "requester_x": ("1.0", "2.0"),   # x needs shared < 2.0
    "requester_y": ("2.0", None),    # y needs shared >= 2.0
}

for label, case in (("compatible constraints", CASE_A), ("conflicting constraints", CASE_B)):
    print(f"{label}:")
    for who, (lo, hi) in case.items():
        rng = f"[{lo}, {hi})" if hi else f">= {lo}"
        print(f"  {who} requires shared {rng}")
    feasible = solve(list(case.values()))
    if feasible:
        print(f"  SOLVABLE: versions satisfying every constraint at once: {feasible}")
        print(f"  resolver picks the newest: {feasible[-1]}")
    else:
        print("  NO SOLUTION: no single version of 'shared' satisfies both requesters")
    print()

print("the second case is not a bug in the resolver -- there genuinely is no")
print("version of 'shared' both requesters can use at the same time. The only")
print("fixes are upgrading one requester's own constraint or installing two")
print("isolated environments, one per requester.")
