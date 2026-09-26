import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import hashlib

# A minimal model of git's object store: everything is content-addressed.
# A blob is a file's raw content; a tree maps names to blob/tree hashes; a
# commit points at a tree plus a parent commit (or None for the first one).
OBJECTS = {}


def h(kind, payload):
    digest = hashlib.sha1(f"{kind} {payload}".encode()).hexdigest()[:10]
    OBJECTS[digest] = (kind, payload)
    return digest


def blob(content):
    return h("blob", content)


def tree(entries):
    # entries: dict of name -> hash, stored in a canonical (sorted) order
    payload = ",".join(f"{n}:{entries[n]}" for n in sorted(entries))
    return h("tree", payload)


def commit(tree_hash, parent, message):
    payload = f"tree={tree_hash} parent={parent} msg={message}"
    return h("commit", payload)


# Commit 1: strategy.py and README.md, both new.
b_strategy_v1 = blob("def signal(px): return px.mean()\n")
b_readme = blob("# arb desk strategies\n")
t1 = tree({"strategy.py": b_strategy_v1, "README.md": b_readme})
c1 = commit(t1, None, "initial strategy")

# Commit 2: only README.md changes; strategy.py's content is untouched.
b_readme_v2 = blob("# arb desk strategies\nSee strategy.py.\n")
t2 = tree({"strategy.py": b_strategy_v1, "README.md": b_readme_v2})
c2 = commit(t2, c1, "expand README")

print(f"objects created so far: {len(OBJECTS)}")
print(f"commit 1 tree hash: {t1}")
print(f"commit 2 tree hash: {t2}  (different tree, since README changed)")
print(f"strategy.py's blob hash in both commits: {b_strategy_v1}  (identical)")
print(f"-> unchanged file content is never stored twice, across any number "
      f"of commits\n")

# Commit 3: one character changes inside strategy.py.
b_strategy_v2 = blob("def signal(px): return px.mean() * 1\n")
t3 = tree({"strategy.py": b_strategy_v2, "README.md": b_readme_v2})
c3 = commit(t3, c2, "no-op edit to strategy.py")

print(f"commit 3 changes one character inside strategy.py:")
print(f"  old blob {b_strategy_v1}  vs  new blob {b_strategy_v2}")
print(f"  -> a new tree hash ({t3}) and a new commit hash ({c3}), even though")
print(f"     README.md's own blob ({b_readme_v2}) is completely unchanged and")
print(f"     is simply re-referenced, not re-hashed or re-stored.")

print(f"\ncommit chain: {c1} <- {c2} <- {c3}")
print(f"total distinct objects stored: {len(OBJECTS)} "
      f"(2 blobs of strategy.py, 2 of README.md, 3 trees, 3 commits)")
print("\na commit's hash is a hash of a hash of a hash: change one byte in one")
print("file and every tree and commit hash downstream of it changes, while")
print("every object that never touched that byte keeps its old hash and is")
print("simply pointed to again.")
