import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A two-table panel plus a security master. The batch has one duplicate key,
# two orphan ids, and a null rate that has quietly tripled.
MASTER = {10145, 93436, 14593, 22111}
PANEL = [(10145, "2026-06-30", 0.011), (93436, "2026-06-30", -0.004),
         (14593, "2026-06-30", 0.007), (14593, "2026-06-30", 0.009),   # duplicate PK
         (55555, "2026-06-30", 0.021), (66666, "2026-06-30", None),    # orphans
         (22111, "2026-06-30", None)]

# --- 1. primary-key uniqueness
seen = {}
for pid, d, _ in PANEL:
    seen[(pid, d)] = seen.get((pid, d), 0) + 1
dupes = {k: v for k, v in seen.items() if v > 1}
print(f"uniqueness   : {len(seen)} distinct keys for {len(PANEL)} rows; "
      f"duplicated {list(dupes)}")

# --- 2. referential integrity against the security master
orphans = sorted({pid for pid, _, _ in PANEL if pid not in MASTER})
print(f"referential  : {len(orphans)} ids not in the master: {orphans} "
      f"({len(orphans) / len(MASTER | set(orphans)):.0%} of the union)")

# --- 3. distributional sanity: null rate against a historical baseline
HIST_NULL_RATE, HIST_N = 0.05, 4000
nulls = sum(1 for _, _, r in PANEL if r is None)
n, p_hat = len(PANEL), nulls / len(PANEL)
se = np.sqrt(HIST_NULL_RATE * (1 - HIST_NULL_RATE) / n)
z = (p_hat - HIST_NULL_RATE) / se
print(f"null rate    : {p_hat:.1%} this batch vs {HIST_NULL_RATE:.0%} baseline, "
      f"z = {z:+.2f}  {'ALERT' if abs(z) > 3 else 'no alert'}")
z_big = (p_hat - HIST_NULL_RATE) / np.sqrt(HIST_NULL_RATE * (1 - HIST_NULL_RATE) / HIST_N)
print(f"               the SAME 5.7x jump on a {HIST_N}-row batch: z = {z_big:+.1f}  ALERT")
print("               a distributional check on 7 rows has no power at all; batch")
print("               size, not the threshold, is what decides whether it can fire")

# --- 4. and the arithmetic that decides whether anyone will trust the alerts
print("\nthe multiple-testing arithmetic of a data-quality suite:")
print(f"{'checks k':>9}{'alpha':>8}{'P(>=1 false alarm)':>21}{'clean days per alarm':>22}")
for k in (5, 20, 100, 400):
    for alpha in (0.01,):
        p = 1 - (1 - alpha) ** k
        print(f"{k:>9}{alpha:>8.2f}{p:>20.1%}{1 / p:>22.1f}")
print("\nWith 400 checks at a 1% per-check false-positive rate you get an alert on")
print("98% of perfectly good days. A suite nobody believes is worse than no suite:")
print("size the thresholds so the aggregate false-alarm rate is what you can staff.")
