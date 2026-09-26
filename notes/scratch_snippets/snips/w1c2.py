import numpy as np
np.seterr(all="ignore")
import re

FILES = {
    "src/orders.py": "def place_order():\n    pass\n# TODO: validate\n",
    "src/utils.py": "def helper():\n    return 1\n",
    "tests/test_orders.py": "def test_place_order():\n    assert True\n",
    "README.md": "# Project\nTODO: write docs\n",
    "notes.txt": "scratch\n",
}

def grep(pattern, files):
    rx = re.compile(pattern)
    hits = []
    for path, content in files.items():
        for lineno, line in enumerate(content.splitlines(), start=1):
            if rx.search(line):
                hits.append((path, lineno, line))
    return hits

def find(files, suffix):
    return sorted(p for p in files if p.endswith(suffix))

def xargs_batches(paths, batch_size):
    return [paths[i:i + batch_size] for i in range(0, len(paths), batch_size)]

py_files = find(FILES, ".py")
print("find . -name '*.py' ->", py_files)

todos = grep(r"TODO", FILES)
print("\ngrep -rn TODO . :")
for path, lineno, line in todos:
    print(f"  {path}:{lineno}: {line.strip()}")

batches = xargs_batches(py_files, 2)
print("\nfind . -name '*.py' | xargs -n2 wc -l, batched as:", batches)
total_lines = 0
for batch in batches:
    batch_lines = sum(len(FILES[p].splitlines()) for p in batch)
    print(f"  wc -l {' '.join(batch)} -> {batch_lines}")
    total_lines += batch_lines
print("total lines across all .py files:", total_lines)
