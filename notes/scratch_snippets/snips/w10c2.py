import numpy as np
np.seterr(all="ignore")
import hashlib

def layer_hash(base_hash, files):
    payload = base_hash + "|" + repr(sorted(files.items()))
    return hashlib.sha256(payload.encode()).hexdigest()[:12]

def build_image(layers):
    fs = {}
    hashes = []
    prev = "scratch"
    for diff in layers:
        fs.update(diff)
        h = layer_hash(prev, fs)
        hashes.append(h)
        prev = h
    return fs, hashes

BASE = {"/etc/os-release": "id=debian"}
DEPS = {"/usr/lib/python3.11": "stdlib"}
APP_V1 = {"/app/main.py": "print('v1')"}
APP_V2 = {"/app/main.py": "print('v2')"}

fs1, hashes1 = build_image([BASE, DEPS, APP_V1])
fs2, hashes2 = build_image([BASE, DEPS, APP_V2])

print("layer hashes, build 1 (base, deps, app v1):", hashes1)
print("layer hashes, build 2 (base, deps, app v2):", hashes2)
print("\nfirst two layers (base, deps) hash IDENTICALLY across both builds:",
      hashes1[0] == hashes2[0] and hashes1[1] == hashes2[1])
print("only the final app layer differs:", hashes1[2] != hashes2[2])
print("a real builder would pull base+deps from cache and rebuild only the app layer")
