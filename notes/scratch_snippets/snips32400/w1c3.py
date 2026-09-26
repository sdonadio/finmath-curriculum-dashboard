import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# requirements.txt names two direct dependencies. Each of those pulls in its
# own dependencies, transitively -- the set a lockfile actually has to pin.
DIRECT = ["quantlib-lite", "riskkit"]
DEPENDS_ON = {
    "quantlib-lite": ["dateutils", "fastmath"],
    "riskkit": ["dateutils", "statlib"],
    "dateutils": ["tzcore"],
    "fastmath": [],
    "statlib": ["fastmath"],
    "tzcore": [],
}
# What actually gets installed at a point in time -- the newest version
# available for each package.
INSTALLED_VERSION = {
    "quantlib-lite": "3.1", "riskkit": "1.9", "dateutils": "0.8",
    "fastmath": "2.2", "statlib": "1.0", "tzcore": "1.4",
}


def transitive_closure(roots, graph):
    seen, stack = set(), list(roots)
    while stack:
        pkg = stack.pop()
        if pkg in seen:
            continue
        seen.add(pkg)
        stack.extend(graph.get(pkg, []))
    return seen


closure = transitive_closure(DIRECT, DEPENDS_ON)
print(f"requirements.txt names {len(DIRECT)} direct dependencies: {DIRECT}")
print(f"the full transitive closure a lockfile must pin is {len(closure)} packages:")
for pkg in sorted(closure):
    depth = pkg in DIRECT
    print(f"  {pkg:<14} v{INSTALLED_VERSION[pkg]}  {'(direct)' if depth else '(transitive)'}")

LOCK = dict(INSTALLED_VERSION)
print(f"\nlockfile written today pins all {len(LOCK)} of them, direct and transitive.")

# Six months later: nothing in requirements.txt changed, but fastmath -- a
# TRANSITIVE dependency nobody asked for by name -- shipped a patch that
# changed a default rounding mode.
NEW_INSTALL = dict(INSTALLED_VERSION, fastmath="2.3")


def rounding_behavior(fastmath_version):
    # stands in for a real behavior change shipped in fastmath 2.3
    return "round-half-even" if fastmath_version >= "2.3" else "round-half-up"


print(f"\nsix months later, with requirements.txt UNCHANGED, a fresh install "
      f"(no lockfile) resolves fastmath to {NEW_INSTALL['fastmath']}")
print(f"  rounding mode at fastmath {INSTALLED_VERSION['fastmath']}: "
      f"{rounding_behavior(INSTALLED_VERSION['fastmath'])}")
print(f"  rounding mode at fastmath {NEW_INSTALL['fastmath']}: "
      f"{rounding_behavior(NEW_INSTALL['fastmath'])}")
print(f"  installing FROM THE LOCKFILE instead reproduces fastmath "
      f"{LOCK['fastmath']} exactly: {LOCK['fastmath'] == INSTALLED_VERSION['fastmath']}")
print("\nquantlib-lite and riskkit never mention fastmath in their own version")
print("pins -- it arrived three hops down the dependency graph -- which is")
print("exactly why pinning only the two direct dependencies is not enough.")
