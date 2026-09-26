import numpy as np
np.seterr(all="ignore")
from collections import Counter

def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    out = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out

def is_sorted(xs):
    return all(xs[i] <= xs[i + 1] for i in range(len(xs) - 1))

def is_permutation(a, b):
    return Counter(a) == Counter(b)

rng = np.random.default_rng(32400)
failures = []
n_cases = 200
for _ in range(n_cases):
    size = int(rng.integers(0, 12))
    sample = [int(v) for v in rng.integers(-20, 20, size=size)]
    result = merge_sort(sample)
    if not (is_sorted(result) and is_permutation(result, sample)):
        failures.append(sample)

print(f"checked the invariant 'output is sorted AND a permutation of the input' on {n_cases} random lists")
print("failures:", len(failures))

def merge_sort_buggy(items):
    result = merge_sort(items)
    return result[:-1] if result else result

sample = [3, 1, 2]
buggy_result = merge_sort_buggy(sample)
print("\nbuggy version on", sample, "->", buggy_result)
print("still sorted?", is_sorted(buggy_result), "  still a permutation?", is_permutation(buggy_result, sample))
