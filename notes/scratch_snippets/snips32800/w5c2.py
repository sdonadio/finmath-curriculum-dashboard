import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# Event time vs processing time. A TRACE-shaped tape: bonds report late, so a
# handful of prints arrive days after the trade actually happened.
EVENTS = [(1, 1, 10), (1, 1, 20), (2, 2, 30), (2, 2, 15),
          (2, 4, 25),                                   # 2 days late
          (3, 3, 40), (3, 3, 10), (3, 6, 50),           # 3 days late, and it is the big one
          (4, 4, 60), (5, 5, 70), (5, 5, 5)]            # (event_day, arrival_day, notional)
TRUTH = {}
for d, _, n in EVENTS:
    TRUTH[d] = TRUTH.get(d, 0) + n
LAST_DAY = max(a for _, a, _ in EVENTS)


def watermark_run(allowed_lateness):
    """Close event-day D once the watermark (max arrival seen) passes
    D + allowed_lateness. Anything arriving after that is dropped for good."""
    closed, totals, dropped = {}, {}, []
    wm = 0
    for d, a, n in sorted(EVENTS, key=lambda e: e[1]):
        wm = max(wm, a)
        for day in list(totals):
            if day not in closed and wm > day + allowed_lateness:
                closed[day] = totals[day]
        if d in closed:
            dropped.append((d, a, n))
            continue
        totals[d] = totals.get(d, 0) + n
    for day, v in totals.items():
        closed.setdefault(day, v)
    return closed, dropped


def reprocess_run(k):
    """Keep the last k event-days OPEN and recompute them from scratch every
    processing day. A day's reported value freezes when it leaves the window."""
    frozen = {}
    for pday in range(1, LAST_DAY + 1):
        for d in [x for x in range(max(1, pday - k + 1), pday + 1) if x in TRUTH]:
            frozen[d] = sum(n for dd, a, n in EVENTS if dd == d and a <= pday)
    return frozen


print(f"true totals by event day: {dict(sorted(TRUTH.items()))}   (335 units in all)")
print(f"\n{'lateness':>8}  {'reported totals':<40}{'dropped':>8}{'lost':>6}{'worst day':>11}")
for L in (0, 1, 2, 3):
    got, drop = watermark_run(L)
    err = max(abs(TRUTH[d] - got.get(d, 0)) / TRUTH[d] for d in TRUTH)
    print(f"{L:>8}  {str(dict(sorted(got.items()))):<40}"
          f"{len(drop):>8}{sum(n for _, _, n in drop):>6}{err:>10.0%}")

print(f"\n{'window k':>8}  {'reported totals':<40}{'exact':>8}{'lost':>6}")
for k in (1, 2, 4):
    got = reprocess_run(k)
    lost = sum(TRUTH[d] - got.get(d, 0) for d in TRUTH)
    print(f"{k:>8}  {str(dict(sorted(got.items()))):<40}"
          f"{str(all(got[d] == TRUTH[d] for d in TRUTH)):>8}{lost:>6}")

print("\nallowed lateness is a business decision about how wrong you are willing")
print("to be, stated in days. A one-day watermark lost 75 of 335 units and")
print("understated day 3 by half; the report itself never said so.")
