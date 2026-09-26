import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# Tasks declare what they READ and what they WRITE. The graph is then INFERRED
# from those declarations rather than hand-maintained, which is the only way
# the graph and the code can be kept honest.
TASKS = {
    "clean_crsp":  {"reads": ["raw/crsp.parquet"],                 "writes": ["cur/crsp.parquet"]},
    "clean_funda": {"reads": ["raw/compustat.parquet"],            "writes": ["cur/funda.parquet"]},
    "join":        {"reads": ["cur/crsp.parquet", "cur/funda.parquet"],
                    "writes": ["cur/panel.parquet"]},
    # declares one input but actually reads a second file nobody produces
    "signal":      {"reads": ["cur/panel.parquet", "cur/sector_map.csv"],
                    "writes": ["cur/signal.parquet"]},
    # two tasks writing the same artefact: last one to run wins, nondeterministically
    "signal_v2":   {"reads": ["cur/panel.parquet"],                "writes": ["cur/signal.parquet"]},
    # computed every night, read by nobody since the risk model was retired
    "vol_est":     {"reads": ["cur/crsp.parquet"],                 "writes": ["cur/vol.parquet"]},
    "backtest":    {"reads": ["cur/signal.parquet"],               "writes": ["out/pnl.parquet"]},
}
EXTERNAL = {"raw/crsp.parquet", "raw/compustat.parquet"}   # the landing zone


def audit(tasks, external):
    producer = {}
    dupes = []
    for t, spec in tasks.items():
        for a in spec["writes"]:
            if a in producer:
                dupes.append((a, producer[a], t))
            producer[a] = t
    orphan_inputs, edges = [], []
    for t, spec in tasks.items():
        for a in spec["reads"]:
            if a in producer:
                edges.append((producer[a], t))
            elif a not in external:
                orphan_inputs.append((t, a))
    consumed = {a for s in tasks.values() for a in s["reads"]}
    dead = [a for a in producer if a not in consumed and not a.startswith("out/")]
    return edges, orphan_inputs, dupes, dead


edges, orphans, dupes, dead = audit(TASKS, EXTERNAL)
print(f"inferred edges ({len(edges)}):")
for u, v in sorted(edges):
    print(f"  {u} -> {v}")
print(f"\nundeclared inputs   : {orphans or 'none'}")
print(f"double-written paths: {[(a, p, q) for a, p, q in dupes] or 'none'}")
print(f"dead intermediates  : {dead or 'none'}")

print("\nwhy each of these is a production incident, not a style nit:")
print("  undeclared input    -> the scheduler cannot know when to re-run you;")
print("                         the file is whatever the last human left there")
print("  double-written path -> the result depends on task ORDER, and the order")
print("                         is only constrained up to a topological sort")
print("  dead intermediate   -> you are paying to compute something nobody reads")
