import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib
import json

# A slow join-and-aggregate, cached two ways. The upstream table then gets a
# corrected row -- the everyday event that separates the two schemes.
POS = [("AAA", 1000), ("BBB", -400), ("CCC", 250)]
PRC = {"AAA": 100.0, "BBB": 50.0, "CCC": 20.0}
WORK = {"n": 0}


def gross_exposure(pos, prc):
    WORK["n"] += 1
    return round(sum(abs(q) * prc[s] for s, q in pos), 2)


def digest(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:12]


name_cache, content_cache = {}, {}


def by_name(pos, prc, label):
    """Key = a human-chosen label. Naming problem #1."""
    if label in name_cache:
        return name_cache[label], "HIT"
    v = gross_exposure(pos, prc)
    name_cache[label] = v
    return v, "MISS"


def by_content(pos, prc):
    """Key = a digest of the actual inputs. Invalidation becomes automatic."""
    k = digest([sorted(pos), sorted(prc.items())])
    if k in content_cache:
        return content_cache[k], "HIT", k
    v = gross_exposure(pos, prc)
    content_cache[k] = v
    return v, "MISS", k


truth0 = gross_exposure(POS, PRC)
print(f"truth with the original prices : {truth0}")
a, sa = by_name(POS, PRC, "gross_eod")
b, sb, kb = by_content(POS, PRC)
print(f"named cache   {a:>10.2f} {sa}      content cache {b:>10.2f} {sb} key {kb}")

PRC = dict(PRC, BBB=61.0)          # upstream correction: BBB was mismarked
truth1 = gross_exposure(POS, PRC)
a, sa = by_name(POS, PRC, "gross_eod")
b, sb, kb = by_content(POS, PRC)
print(f"\nafter the BBB price correction, truth = {truth1}")
print(f"named cache   {a:>10.2f} {sa}   <- STALE, wrong by {truth1 - a:.2f} "
      f"({abs(truth1 - a) / truth1:.1%})")
print(f"content cache {b:>10.2f} {sb} key {kb}  <- key moved because the input moved")

print(f"\nunderlying computations performed: {WORK['n']}")
print(f"named-cache answer equals truth   : {a == truth1}")
print(f"content-cache answer equals truth : {b == truth1}")

# Prove the cached path agrees with the uncached path on a repeat, doing no work.
before = WORK["n"]
again, s_again, _ = by_content(POS, PRC)
print(f"\nrepeat query: {again} {s_again}, extra computations "
      f"{WORK['n'] - before}, matches uncached answer {again == truth1}")
print("\nthe two hard cache problems are naming and invalidation. Content addressing")
print("dissolves both: the name IS the content, so a stale entry is unreachable.")
