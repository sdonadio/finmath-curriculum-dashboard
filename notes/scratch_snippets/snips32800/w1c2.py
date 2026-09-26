import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import random

# A fake endpoint that returns 429 (rate limited) for the first `fails` calls,
# then 200. No sleeping: we accumulate the delay the policy WOULD have waited.
class Endpoint:
    def __init__(self, fails):
        self.fails, self.calls = fails, 0

    def get(self):
        self.calls += 1
        return 429 if self.calls <= self.fails else 200


def fetch(endpoint, policy, base=0.5, cap=8.0, max_tries=6, seed=20240917):
    rng = random.Random(seed)          # jitter must be seeded or the log is unreproducible
    waited, sched = 0.0, []
    for attempt in range(max_tries):
        if endpoint.get() == 200:
            return "ok", attempt + 1, waited, sched
        if policy == "fixed":
            d = base
        elif policy == "exponential":
            d = min(cap, base * 2 ** attempt)
        else:                                       # full jitter
            d = rng.uniform(0.0, min(cap, base * 2 ** attempt))
        sched.append(round(d, 3))
        waited += d
    return "gave up", max_tries, waited, sched


print(f"{'policy':<14}{'result':<10}{'calls':>6}{'total wait s':>14}  delays")
for policy in ("fixed", "exponential", "jittered"):
    res, calls, waited, sched = fetch(Endpoint(fails=4), policy)
    print(f"{policy:<14}{res:<10}{calls:>6}{waited:>14.3f}  {sched}")

# Ten clients hammering one quota: fixed backoff keeps them in lockstep,
# jitter spreads them out. Count how many share an identical delay schedule.
def schedules(policy, n=10):
    out = []
    for c in range(n):
        _, _, _, sched = fetch(Endpoint(fails=3), policy, seed=1000 + c)
        out.append(tuple(sched))
    return out


for policy in ("exponential", "jittered"):
    s = schedules(policy)
    print(f"{policy:<14}10 clients -> {len(set(s))} distinct retry schedule(s)")
print("closed form for the pure exponential wait: base*(2^n - 1) =", 0.5 * (2 ** 4 - 1))
