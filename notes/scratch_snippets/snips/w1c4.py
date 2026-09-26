import numpy as np
np.seterr(all="ignore")
import os, tempfile, fnmatch

LAYOUT = {
    "data/prices.csv": b"a,b\n1,2\n",
    "data/2026/prices_q1.csv": b"a,b\n1,2\n3,4\n",
    "data/.cache/tmp.csv": b"junk\n",
    "data/readme.md": b"# data\n",
    "src/main.py": b"print(1)\n",
}

def glob_walk(root, pattern):
    matches = []
    for dirpath, dirnames, filenames in os.walk(root):
        for name in filenames:
            rel = os.path.relpath(os.path.join(dirpath, name), root)
            if fnmatch.fnmatch(name, pattern) and not any(part.startswith(".") for part in rel.split(os.sep)):
                matches.append(rel.replace(os.sep, "/"))
    return sorted(matches)

with tempfile.TemporaryDirectory() as root:
    for relpath, content in LAYOUT.items():
        full = os.path.join(root, relpath)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "wb") as f:
            f.write(content)

    csvs = glob_walk(root, "*.csv")
    print("glob **/*.csv (dotfiles excluded):", csvs)

    total = sum(os.path.getsize(os.path.join(root, p)) for p in csvs)
    print("total bytes across matched files:", total)

    all_csvs_including_dot = []
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            if fnmatch.fnmatch(name, "*.csv"):
                all_csvs_including_dot.append(
                    os.path.relpath(os.path.join(dirpath, name), root).replace(os.sep, "/"))
    print("a naive walk that does NOT skip dotdirs also finds:", sorted(all_csvs_including_dot))
