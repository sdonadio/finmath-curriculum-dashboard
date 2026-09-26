import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

from collections import deque

# A research pipeline as a task DAG. Two diamonds: crsp/compustat rejoin at
# `funda_join`, and taq/quotes rejoin at `tca`.
DAG = {
    "pull_crsp":     [],
    "pull_compustat": [],
    "pull_taq":      [],
    "clean_crsp":    ["pull_crsp"],
    "clean_funda":   ["pull_compustat"],
    "funda_join":    ["clean_crsp", "clean_funda"],      # diamond 1 closes here
    "trades":        ["pull_taq"],
    "quotes":        ["pull_taq"],
    "tca":           ["trades", "quotes"],               # diamond 2 closes here
    "signal":        ["funda_join"],
    "backtest":      ["signal", "tca"],
    "report":        ["backtest"],
}


def kahn(dag):
    """Returns (order, ok). ok=False means a cycle: some nodes never reached indegree 0."""
    indeg = {n: 0 for n in dag}
    children = {n: [] for n in dag}
    for n, ups in dag.items():
        for u in ups:
            if u not in dag:
                raise KeyError(f"task {n!r} depends on undeclared task {u!r}")
            indeg[n] += 1
            children[u].append(n)
    q = deque(sorted(n for n in dag if indeg[n] == 0))    # sorted => deterministic order
    order = []
    while q:
        n = q.popleft()
        order.append(n)
        for c in sorted(children[n]):
            indeg[c] -= 1
            if indeg[c] == 0:
                q.append(c)
    return order, len(order) == len(dag)


order, ok = kahn(DAG)
print(f"tasks {len(DAG)}  edges {sum(len(v) for v in DAG.values())}  acyclic {ok}")
print("execution order:")
for i, n in enumerate(order, 1):
    print(f"  {i:>2}. {n}")

# Verify the order really respects every edge -- the only test that matters.
pos = {n: i for i, n in enumerate(order)}
bad = [(u, n) for n, ups in DAG.items() for u in ups if pos[u] > pos[n]]
print(f"edges violated by this order: {len(bad)}")

# Now break it on purpose: the report feeds back into cleaning.
CYCLIC = dict(DAG)
CYCLIC["clean_crsp"] = CYCLIC["clean_crsp"] + ["report"]
order2, ok2 = kahn(CYCLIC)
stuck = sorted(set(CYCLIC) - set(order2))
print(f"\nwith report -> clean_crsp added: acyclic {ok2}, "
      f"{len(order2)}/{len(CYCLIC)} tasks schedulable")
print(f"tasks trapped in the cycle: {stuck}")
print("Kahn's algorithm rejects by construction: a cyclic graph has no node")
print("left at indegree zero, so the queue empties before the order is complete.")
