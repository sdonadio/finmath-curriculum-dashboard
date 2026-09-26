import numpy as np
np.seterr(all="ignore")
import hashlib

def h(*parts):
    return hashlib.sha1("|".join(parts).encode()).hexdigest()[:10]

def make_commit(parents, files):
    key = h(",".join(sorted(parents)), repr(sorted(files.items())))
    return {"id": key, "parents": parents, "files": dict(files)}

base = make_commit([], {"a.py": "1"})
main1 = make_commit([base["id"]], {"a.py": "1", "b.py": "1"})
feat1 = make_commit([base["id"]], {"a.py": "1", "c.py": "1"})

def merge_files(base_files, a_files, b_files):
    merged = dict(base_files)
    merged.update(a_files)
    merged.update(b_files)
    return merged

merged_files = merge_files(base["files"], main1["files"], feat1["files"])
merge_commit = make_commit([main1["id"], feat1["id"]], merged_files)
print("merge commit has two parents:", merge_commit["parents"] == [main1["id"], feat1["id"]])
print("merged tree:", sorted(merge_commit["files"].items()))

feat_diff = {k: v for k, v in feat1["files"].items() if base["files"].get(k) != v}
rebased_files = dict(main1["files"])
rebased_files.update(feat_diff)
rebased_commit = make_commit([main1["id"]], rebased_files)
print("\nrebased commit has one parent:", rebased_commit["parents"] == [main1["id"]])
print("rebased tree:", sorted(rebased_commit["files"].items()))

print("\nsame final file set, different history shape:",
      sorted(merge_commit["files"].items()) == sorted(rebased_commit["files"].items()))
print("merge_commit id != rebased_commit id:", merge_commit["id"] != rebased_commit["id"])
