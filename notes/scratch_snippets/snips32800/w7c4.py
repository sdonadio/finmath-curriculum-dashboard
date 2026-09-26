import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

from collections import OrderedDict

# A request stream over 200 keys with a Zipf-like popularity profile: a research
# notebook re-asks about the same few names over and over.
rng = np.random.default_rng(32800)
NKEYS, NREQ = 200, 4000
w = 1.0 / (np.arange(1, NKEYS + 1) ** 1.1)
w /= w.sum()
STREAM = rng.choice(NKEYS, size=NREQ, p=w)


class LRU:
    def __init__(self, cap):
        self.cap, self.d, self.hit, self.miss = cap, OrderedDict(), 0, 0

    def get(self, k, compute):
        if k in self.d:
            self.hit += 1
            self.d.move_to_end(k)
            return self.d[k]
        self.miss += 1
        v = compute(k)
        self.d[k] = v
        if len(self.d) > self.cap:
            self.d.popitem(last=False)
        return v


def compute(k):
    return float(k) * 1.5            # stands in for an expensive aggregation


truth = [compute(int(k)) for k in STREAM]
print(f"{'capacity':>9}{'keys':>6}{'hits':>7}{'misses':>8}{'hit rate':>10}"
      f"{'work saved':>12}{'answers correct':>17}")
for cap in (1, 5, 20, 50, 200):
    c = LRU(cap)
    out = [c.get(int(k), compute) for k in STREAM]
    print(f"{cap:>9}{NKEYS:>6}{c.hit:>7}{c.miss:>8}{c.hit / NREQ:>9.1%}"
          f"{1 - c.miss / NREQ:>11.1%}{str(out == truth):>17}")

print(f"\nthe top 20 keys are {w[:20].sum():.0%} of all requests and the top 50 "
      f"are {w[:50].sum():.0%};")
print("that skew, not the cache size, is what makes caching worth doing here.")

# Correctness and hit rate are orthogonal. A cache can be perfectly correct
# and useless, or extremely effective and wrong.
c0 = LRU(0)
out0 = [c0.get(int(k), compute) for k in STREAM]
print(f"\ncapacity 0 : hit rate {c0.hit / NREQ:.0%}, answers correct {out0 == truth}")
broken = {int(k): compute(int(k)) for k in STREAM}
broken[int(STREAM[0])] += 1.0        # one poisoned entry, never invalidated
out_b = [broken[int(k)] for k in STREAM]
wrong = sum(1 for a, b in zip(out_b, truth) if a != b)
print(f"capacity inf, one stale entry: hit rate 100%, wrong answers "
      f"{wrong}/{NREQ} ({wrong / NREQ:.1%})")
print("\nMeasure them separately. Hit rate is a cost question you may trade away;")
print("correctness is not, and a high hit rate is exactly how a stale entry hides.")
