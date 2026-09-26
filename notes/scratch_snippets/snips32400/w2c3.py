import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A minimal three-way merge over line-based text: find lines that changed
# on branch A relative to the common ancestor, and lines that changed on
# branch B relative to the same ancestor. Non-overlapping changes merge
# automatically; changes to the SAME line are a conflict.
ANCESTOR = [
    "def size(signal, capital):",
    "    target = signal * capital",
    "    return target",
]
BRANCH_A = [                       # adds a cap on line 2, untouched elsewhere
    "def size(signal, capital):",
    "    target = min(signal * capital, capital * 0.1)",
    "    return target",
]
BRANCH_B = [                       # renames the function, untouched elsewhere
    "def position_size(signal, capital):",
    "    target = signal * capital",
    "    return target",
]
BRANCH_CONFLICT = [                # ALSO edits line 2, but differently than A
    "def size(signal, capital):",
    "    target = signal * capital * 0.5",
    "    return target",
]


def changed_lines(ancestor, branch):
    return {i for i, (a, b) in enumerate(zip(ancestor, branch)) if a != b}


def three_way_merge(ancestor, a, b):
    changed_a, changed_b = changed_lines(ancestor, a), changed_lines(ancestor, b)
    overlap = changed_a & changed_b
    if overlap:
        return None, overlap
    merged = list(ancestor)
    for i in changed_a:
        merged[i] = a[i]
    for i in changed_b:
        merged[i] = b[i]
    return merged, overlap


print("merging branch A (adds a cap) with branch B (renames the function):")
merged, conflict = three_way_merge(ANCESTOR, BRANCH_A, BRANCH_B)
print(f"  lines changed by A: {changed_lines(ANCESTOR, BRANCH_A)}")
print(f"  lines changed by B: {changed_lines(ANCESTOR, BRANCH_B)}")
print(f"  overlapping lines: {conflict or 'none'}")
if merged:
    print("  MERGED AUTOMATICALLY:")
    for line in merged:
        print(f"    {line}")

print("\nmerging branch A with a conflicting branch that ALSO edits line 2:")
merged2, conflict2 = three_way_merge(ANCESTOR, BRANCH_A, BRANCH_CONFLICT)
print(f"  lines changed by A:        {changed_lines(ANCESTOR, BRANCH_A)}")
print(f"  lines changed by conflict: {changed_lines(ANCESTOR, BRANCH_CONFLICT)}")
print(f"  overlapping lines: {conflict2}")
if merged2 is None:
    print("  CONFLICT: both branches edited the same line differently, and a")
    print("  three-way merge algorithm has no basis for picking one over the")
    print("  other -- this is exactly the case that needs a human decision.")

print("\na merge conflict is not 'git is confused'; it is a precise, mechanical")
print("finding: two branches changed the exact same line relative to their")
print("common ancestor, in two different ways, and nothing about the diff")
print("itself says which version -- or what combination -- is correct.")
