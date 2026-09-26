import numpy as np
np.seterr(all="ignore")
import sys

def make_leaky_handler():
    big = list(range(200_000))
    def handler(event):
        return event in big[:1]
    return handler

def make_lean_handler():
    big = list(range(200_000))
    first = big[0]
    def handler(event):
        return event == first
    return handler

leaky = make_leaky_handler()
lean = make_lean_handler()

leaky_captured = leaky.__closure__[0].cell_contents
lean_captured = lean.__closure__[0].cell_contents

print("leaky handler's closure cell holds a", type(leaky_captured).__name__,
      "of length", len(leaky_captured))
print("lean handler's closure cell holds a", type(lean_captured).__name__, ":", lean_captured)

print("\napproximate bytes pinned alive by each handler's closure:")
print("  leaky:", sys.getsizeof(leaky_captured), "bytes (just the list container, not its ints)")
print("  lean: ", sys.getsizeof(lean_captured), "bytes")

del leaky
print("\nonce `leaky` itself is deleted, its 200k-element list becomes eligible for collection too")
