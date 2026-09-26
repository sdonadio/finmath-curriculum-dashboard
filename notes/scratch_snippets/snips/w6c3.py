import numpy as np
np.seterr(all="ignore")
import cProfile, pstats

def concat_naive(n):
    s = ""
    for i in range(n):
        s += str(i)
    return s

def concat_join(n):
    return "".join(str(i) for i in range(n))

def call_count(fn, n):
    profiler = cProfile.Profile()
    profiler.enable()
    fn(n)
    profiler.disable()
    stats = pstats.Stats(profiler)
    for (_filename, _lineno, func_name), (_cc, nc, _tt, _ct, _callers) in stats.stats.items():
        if func_name == fn.__name__:
            return nc
    return None

calls_naive = call_count(concat_naive, 500)
calls_join = call_count(concat_join, 500)
print("concat_naive(500) primitive call count:", calls_naive,
      "-- one call, its real cost is hidden INSIDE the loop")
print("concat_join(500) primitive call count:", calls_join)
print("call counts are a property of the code path, not the clock --",
      "reproducible across machines, unlike wall-clock time")

def chars_copied_naive(n):
    total = 0
    s = ""
    for i in range(n):
        s += str(i)
        total += len(s)
    return total

def chars_copied_join(n):
    parts = [str(i) for i in range(n)]
    return sum(len(p) for p in parts)

copied_naive = chars_copied_naive(500)
copied_join = chars_copied_join(500)
print("\ncharacters copied by string += in a loop (n=500):", copied_naive)
print("characters copied by ''.join (n=500):           ", copied_join)
print("naive grows quadratically; join grows linearly:", copied_naive > 5 * copied_join)
