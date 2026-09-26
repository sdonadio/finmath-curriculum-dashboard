import numpy as np
np.seterr(all="ignore")
import json

CATALOG_TODAY = {
    "requests": ["2.30.0", "2.31.0", "2.32.3"],
    "urllib3":  ["1.26.18", "2.0.7", "2.2.2"],
}
CATALOG_LATER = {
    "requests": ["2.30.0", "2.31.0", "2.32.3", "2.32.4"],
    "urllib3":  ["1.26.18", "2.0.7", "2.2.2", "2.2.3"],
}

REQUIRES = {"requests": [(2, 30, 0, 3, 0, 0)]}
DEPENDS_ON = {"requests": {"urllib3": (2, 0, 0, 3, 0, 0)}}

def parts(v):
    return tuple(int(x) for x in v.split("."))

def satisfies(version, bounds):
    lo = bounds[:3]
    hi = bounds[3:]
    return lo <= parts(version) < hi

def resolve(catalog):
    chosen = {}
    for pkg, specs in REQUIRES.items():
        candidates = [v for v in catalog[pkg] if all(satisfies(v, s) for s in specs)]
        chosen[pkg] = max(candidates, key=parts)
        for dep, dspec in DEPENDS_ON.get(pkg, {}).items():
            dcands = [v for v in catalog[dep] if satisfies(v, dspec)]
            chosen[dep] = max(dcands, key=parts)
    return chosen

resolution_today = resolve(CATALOG_TODAY)
resolution_later = resolve(CATALOG_LATER)

print("resolved today from a floating spec:", resolution_today)
print("resolved a week later from the SAME floating spec:", resolution_later)
print("same input spec, different result over time:", resolution_today != resolution_later)

lockfile = json.dumps(resolution_today, indent=2, sort_keys=True)
print("\nlockfile.json pins exact versions:")
print(lockfile)
relocked = json.loads(lockfile)
print("\ninstalling from the lockfile a week later still gives:", relocked)
print("matches the ORIGINAL resolution regardless of catalog drift:", relocked == resolution_today)
