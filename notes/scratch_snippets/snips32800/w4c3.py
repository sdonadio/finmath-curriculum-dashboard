import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib

DAG = {"pull_crsp": [], "pull_compustat": [], "pull_taq": [],
       "clean_crsp": ["pull_crsp"], "clean_funda": ["pull_compustat"],
       "funda_join": ["clean_crsp", "clean_funda"],
       "trades": ["pull_taq"], "quotes": ["pull_taq"], "tca": ["trades", "quotes"],
       "signal": ["funda_join"], "backtest": ["signal", "tca"], "report": ["backtest"]}
CODE = {t: f"v1::{t}" for t in DAG}                     # the code each task runs
INPUT = {"pull_crsp": "crsp-2026-09-26", "pull_compustat": "cs-2026-09-26",
         "pull_taq": "taq-2026-09-26"}                  # external inputs only


def fingerprints(dag, code, ext):
    """A task's fingerprint = hash(its code + its parents' fingerprints [+ its
    external input]). This is the entire idea behind make, bazel and every
    modern orchestrator's staleness check."""
    fp, order = {}, []

    def walk(t):
        if t in fp:
            return fp[t]
        parts = [code[t], ext.get(t, "")] + [walk(u) for u in dag[t]]
        fp[t] = hashlib.sha256("|".join(parts).encode()).hexdigest()[:10]
        order.append(t)
        return fp[t]

    for t in dag:
        walk(t)
    return fp


def descendants(dag, changed):
    kids = {t: [] for t in dag}
    for t, ups in dag.items():
        for u in ups:
            kids[u].append(t)
    seen, stack = set(), list(changed)
    while stack:
        t = stack.pop()
        for c in kids[t]:
            if c not in seen:
                seen.add(c)
                stack.append(c)
    return seen


base = fingerprints(DAG, CODE, INPUT)
print(f"{len(DAG)} tasks fingerprinted; report = {base['report']}")

for label, mutate in (
        ("new TAQ day lands (pull_taq input changes)", lambda c, e: e.update(pull_taq="taq-2026-09-27")),
        ("signal code edited (one line in signal.py)", lambda c, e: c.update(signal="v2::signal")),
        ("report cosmetics only (report.py edited)", lambda c, e: c.update(report="v2::report"))):
    code, ext = dict(CODE), dict(INPUT)
    mutate(code, ext)
    new = fingerprints(DAG, code, ext)
    dirty = sorted(t for t in DAG if new[t] != base[t])
    changed_root = [t for t in DAG if code[t] != CODE[t] or ext.get(t) != INPUT.get(t)]
    print(f"\n{label}")
    print(f"  changed node(s)      : {changed_root}")
    print(f"  descendants of it    : {sorted(descendants(DAG, changed_root))}")
    print(f"  fingerprints changed : {len(dirty)}/{len(DAG)}  {dirty}")
    print(f"  tasks safely SKIPPED : {len(DAG) - len(dirty)}")
print("\nthe dirty set is always the changed node plus its descendants, never more.")
print("An orchestrator that re-runs the whole graph is not wrong, just expensive;")
print("one that re-runs less than this is wrong, and quietly.")
