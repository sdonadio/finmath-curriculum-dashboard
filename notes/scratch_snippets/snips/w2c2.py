import numpy as np
np.seterr(all="ignore")
import hashlib

def h(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()[:10]

commits = {}
def commit(parent, message, snapshot):
    data = f"parent={parent} msg={message} snap={snapshot}".encode()
    oid = h(data)
    commits[oid] = {"parent": parent, "message": message, "snapshot": snapshot}
    return oid

refs = {}

c1 = commit(None, "init", "v1")
refs["main"] = c1

refs["feature"] = refs["main"]
print("new branch points at the same commit as main:", refs["feature"] == refs["main"])
print("creating it copied zero snapshot bytes (same object store size):", len(commits))

c2 = commit(refs["feature"], "add widget", "v2")
refs["feature"] = c2

print("\nafter a commit on feature, main is untouched:", refs["main"] == c1)
print("feature now points to a new commit:", refs["feature"] == c2)
print("the object store grew by exactly one commit:", len(commits) == 2)

del refs["feature"]
print("deleting the branch removes the pointer only; commit object still exists:", c2 in commits)
