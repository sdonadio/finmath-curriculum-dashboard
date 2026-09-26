import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A commit graph: each commit points at its one parent (linear history only,
# for clarity). A branch is nothing but a name pointing at one commit hash.
PARENT = {}   # commit -> parent commit (None for the root)


def commit_after(parent, label):
    PARENT[label] = parent
    return label


c0 = commit_after(None, "c0_initial")
c1 = commit_after(c0, "c1_add_signal")
c2 = commit_after(c1, "c2_add_risk_check")

branches = {"main": c2, "feature": c2}   # feature branches off main at c2
print(f"main    -> {branches['main']}")
print(f"feature -> {branches['feature']}")
print(f"both branches point at the SAME commit: "
      f"{branches['main'] == branches['feature']}\n")


def ancestors(commit):
    out = []
    while commit is not None:
        out.append(commit)
        commit = PARENT[commit]
    return out


def is_ancestor(a, b):
    return a in ancestors(b)


# Case 1: only 'feature' moves forward. main never adds a new commit.
c3 = commit_after(c2, "c3_feature_tweak")
branches["feature"] = c3
print("case 1: feature adds one commit, main stays put")
print(f"  main -> {branches['main']}, feature -> {branches['feature']}")
ff_possible = is_ancestor(branches["main"], branches["feature"])
print(f"  is main an ancestor of feature? {ff_possible}")
if ff_possible:
    branches["main"] = branches["feature"]   # fast-forward: just move the pointer
    print(f"  FAST-FORWARD merge: main now -> {branches['main']} "
          f"(no new commit created, main's pointer simply moved)")

# Case 2: main ALSO advances after the fork point, so the two branches diverge.
branches2 = {"main": c2, "feature": c2}
m1 = commit_after(c2, "m1_main_fix")
f1 = commit_after(c2, "f1_feature_fix")
branches2["main"], branches2["feature"] = m1, f1
print(f"\ncase 2: BOTH branches add a commit after the same fork point {c2}")
print(f"  main -> {branches2['main']}, feature -> {branches2['feature']}")
ff_possible2 = is_ancestor(branches2["main"], branches2["feature"]) or \
    is_ancestor(branches2["feature"], branches2["main"])
print(f"  is either branch an ancestor of the other? {ff_possible2}")
if not ff_possible2:
    merge_commit = commit_after(branches2["main"], "merge_m1_f1")
    # a real merge commit has TWO parents; recorded separately here for clarity
    PARENT[merge_commit] = branches2["main"]
    SECOND_PARENT = {merge_commit: branches2["feature"]}
    print(f"  NOT a fast-forward: history diverged, so merging needs a new "
          f"merge commit ({merge_commit}) with two parents:")
    print(f"    parent 1 (main):    {branches2['main']}")
    print(f"    parent 2 (feature): {SECOND_PARENT[merge_commit]}")

print("\na fast-forward merge is free precisely because one branch's history")
print("is a strict prefix of the other's; a merge commit exists specifically")
print("to give a point in the graph with two parents, for the case where")
print("neither branch's history contains the other's.")
