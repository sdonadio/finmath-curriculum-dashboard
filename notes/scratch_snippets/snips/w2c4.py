import numpy as np
np.seterr(all="ignore")

def diff_lines(base, other):
    changes = {}
    for i in range(max(len(base), len(other))):
        b = base[i] if i < len(base) else None
        o = other[i] if i < len(other) else None
        if b != o:
            changes[i] = o
    return changes

def three_way_merge(base, ours, theirs):
    ours_changes = diff_lines(base, ours)
    theirs_changes = diff_lines(base, theirs)
    n = max(len(base), len(ours), len(theirs))
    merged = []
    conflicts = []
    for i in range(n):
        in_ours = i in ours_changes
        in_theirs = i in theirs_changes
        if in_ours and in_theirs and ours_changes[i] != theirs_changes[i]:
            conflicts.append(i)
            merged.append(f"<<<<<<< ours\n{ours_changes[i]}\n=======\n{theirs_changes[i]}\n>>>>>>> theirs")
        elif in_ours:
            merged.append(ours_changes[i])
        elif in_theirs:
            merged.append(theirs_changes[i])
        else:
            merged.append(base[i])
    return merged, conflicts

base = ["def total(items):", "    return sum(items)", "", "print(total([1,2,3]))"]
ours = ["def total(items):", "    return sum(items) + 0", "# entry point", "print(total([1,2,3]))"]
theirs_ok = ["def total(items):", "    return sum(items) + 0", "", "print(total([1,2,3]))"]
theirs_conflict = ["def total(items):", "    return sum(items) * 1.0", "", "print(total([1,2,3]))"]

merged_clean, conflicts_clean = three_way_merge(base, ours, theirs_ok)
print("ours and theirs make the SAME edit to line 1 -> conflicts:", conflicts_clean)
print("clean merge result:")
for line in merged_clean:
    print("  ", line)

merged_conf, conflicts_conf = three_way_merge(base, ours, theirs_conflict)
print("\nours and theirs make DIFFERENT edits to line 1 -> conflicts:", conflicts_conf)
print("merge output for the conflicting line:")
print(" ", merged_conf[1])
