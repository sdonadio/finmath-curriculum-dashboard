import numpy as np
np.seterr(all="ignore")
import hashlib

def hash_object(kind, data: bytes) -> str:
    header = f"{kind} {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()

store = {}

def put(kind, data: bytes) -> str:
    oid = hash_object(kind, data)
    store[oid] = (kind, data)
    return oid

blob_a = put("blob", b"print('hello')\n")
blob_b = put("blob", b"print('hello')\n")
blob_c = put("blob", b"print('hello world')\n")

print("identical content hashes identically:", blob_a == blob_b)
print("different content hashes differently:", blob_a != blob_c)
print("object store only holds ONE copy of the duplicate:", len(store) == 2)

tree_oid = put("tree", f"100644 blob {blob_a} main.py\n".encode())
commit1 = f"tree {tree_oid}\nauthor a 0\n\nfirst commit\n".encode()
commit_oid = put("commit", commit1)
print("\ncommit id is a hash of tree + metadata:", commit_oid[:12])

commit_oid_again = hash_object("commit", commit1)
print("re-hashing identical commit content reproduces the same id:", commit_oid == commit_oid_again)
