import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A toy package index: for each package, the list of versions that existed
# AT TWO DIFFERENT POINTS IN TIME. Nothing about requirements.txt changes
# between the two resolves; only the index's contents do, because a new
# release shipped in between.
INDEX_DAY_1 = {
    "numpy": ["1.24.0", "1.24.4", "1.25.0", "1.25.2"],
    "pandas": ["2.0.0", "2.0.3", "2.1.0"],
}
INDEX_DAY_90 = {
    "numpy": ["1.24.0", "1.24.4", "1.25.0", "1.25.2", "1.26.0", "1.26.4", "2.0.0"],
    "pandas": ["2.0.0", "2.0.3", "2.1.0", "2.1.4", "2.2.0"],
}
REQUIREMENTS = {"numpy": ">=1.24", "pandas": ">=2.0"}


def ver_tuple(v):
    return tuple(int(x) for x in v.split("."))


def satisfies(v, spec):
    op, bound = spec[:2], spec[2:]
    assert op == ">="
    return ver_tuple(v) >= ver_tuple(bound)


def resolve(index, requirements):
    """The simplest possible resolver: for each package, take the newest
    version in the index that satisfies the spec."""
    picked = {}
    for pkg, spec in requirements.items():
        candidates = [v for v in index[pkg] if satisfies(v, spec)]
        picked[pkg] = max(candidates, key=ver_tuple)
    return picked


resolved_day1 = resolve(INDEX_DAY_1, REQUIREMENTS)
resolved_day90 = resolve(INDEX_DAY_90, REQUIREMENTS)

print("requirements.txt, unchanged between the two resolves:")
for pkg, spec in REQUIREMENTS.items():
    print(f"  {pkg}{spec}")

print("\nresolved on day 1  :", resolved_day1)
print("resolved on day 90 :", resolved_day90)

moved = [pkg for pkg in REQUIREMENTS if resolved_day1[pkg] != resolved_day90[pkg]]
print(f"\npackages that resolved to a DIFFERENT version 90 days later: {moved}")
for pkg in moved:
    print(f"  {pkg}: {resolved_day1[pkg]} -> {resolved_day90[pkg]}  "
          f"(both satisfy '{REQUIREMENTS[pkg]}')")

LOCK = dict(resolved_day1)
relocked = {pkg: v for pkg, v in LOCK.items() if v in INDEX_DAY_90[pkg]}
print(f"\na lockfile written on day 1 and reinstalled on day 90: {relocked}")
print("identical to the day-1 environment:", relocked == resolved_day1)
print("\nthe requirements file never changed; the index it was resolved against did.")
print("a lockfile pins the RESOLVED versions, not the spec, so day 90's install")
print("reproduces day 1's environment instead of quietly drifting forward.")
