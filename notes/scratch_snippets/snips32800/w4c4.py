import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

DAG = {"pull_crsp": [], "pull_compustat": [], "pull_taq": [],
       "clean_crsp": ["pull_crsp"], "clean_funda": ["pull_compustat"],
       "funda_join": ["clean_crsp", "clean_funda"],
       "trades": ["pull_taq"], "quotes": ["pull_taq"], "tca": ["trades", "quotes"],
       "signal": ["funda_join"], "backtest": ["signal", "tca"], "report": ["backtest"]}
# relative cost of each task, in "units of work" -- not seconds
COST = {"pull_crsp": 8, "pull_compustat": 5, "pull_taq": 40, "clean_crsp": 3,
        "clean_funda": 2, "funda_join": 4, "trades": 12, "quotes": 15,
        "tca": 9, "signal": 2, "backtest": 6, "report": 1}


def levels(dag):
    """Longest-path layering: level(t) = 1 + max(level(parents)). Every task in
    a level can run concurrently, because no edge joins two tasks in one level."""
    lv = {}

    def f(t):
        if t not in lv:
            lv[t] = 1 + max([f(u) for u in dag[t]] + [0])
        return lv[t]

    for t in dag:
        f(t)
    return lv


lv = levels(DAG)
total = sum(COST.values())
print(f"{'level':<7}{'tasks':<44}{'width':>6}{'work':>7}")
crit_by_level = []
for k in sorted(set(lv.values())):
    ts = sorted(t for t in DAG if lv[t] == k)
    w = sum(COST[t] for t in ts)
    crit_by_level.append(max(COST[t] for t in ts))
    print(f"{k:<7}{', '.join(ts):<44}{len(ts):>6}{w:>7}")

depth = max(lv.values())
width = max(sum(1 for t in DAG if lv[t] == k) for k in set(lv.values()))
print(f"\ntotal work {total} units, graph depth {depth} levels, max width {width} tasks")
print(f"serial schedule                  : {total} units")
print(f"unbounded workers, level by level: {sum(crit_by_level)} units "
      f"(speed-up {total / sum(crit_by_level):.2f}x)")

# The true lower bound is the critical path, not the level sum.
def critical(dag, cost):
    memo = {}

    def f(t):
        if t not in memo:
            memo[t] = cost[t] + max([f(u) for u in dag[t]] + [0])
        return memo[t]

    end = max(dag, key=f)
    return f(end), end


cp, tail = critical(DAG, COST)
print(f"critical path                    : {cp} units, ending at {tail!r} "
      f"(theoretical best speed-up {total / cp:.2f}x)")
print(f"\npull_taq alone is {COST['pull_taq'] / total:.0%} of the work and sits on the")
print("critical path: no amount of parallelism helps until that task gets faster.")
