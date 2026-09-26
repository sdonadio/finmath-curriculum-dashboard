import numpy as np
import hashlib
np.seterr(all="ignore")

# A Merkle tree lets a block header commit to thousands of transactions with
# a SINGLE 32-byte root: pair up transaction hashes, hash each pair, repeat
# until one hash remains. Anyone can then prove a single transaction is in
# the block with a proof whose size grows only with log2(n), not n -- they
# never need the other transactions themselves.

def h(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def merkle_root(leaves):
    level = list(leaves)
    if len(level) == 1:
        return level[0]
    while len(level) > 1:
        if len(level) % 2 == 1:
            level.append(level[-1])            # duplicate the odd one out
        level = [h(level[i] + level[i + 1]) for i in range(0, len(level), 2)]
    return level[0]

def merkle_proof(leaves, index):
    """Sibling hashes from the leaf up to the root, plus which side each is on."""
    level = list(leaves)
    proof = []
    idx = index
    while len(level) > 1:
        if len(level) % 2 == 1:
            level.append(level[-1])
        sibling_idx = idx ^ 1                          # pair partner
        proof.append((level[sibling_idx], "right" if sibling_idx > idx else "left"))
        level = [h(level[i] + level[i + 1]) for i in range(0, len(level), 2)]
        idx //= 2
    return proof

def verify_proof(leaf, proof, root):
    node = leaf
    for sibling, side in proof:
        node = h(sibling + node) if side == "left" else h(node + sibling)
    return node == root

rng = np.random.default_rng(31200 + 1)
n_tx = 11                                          # deliberately odd, to exercise the duplicate rule
tx_leaves = [h(rng.bytes(48)) for _ in range(n_tx)]
root = merkle_root(tx_leaves)
print("transactions in the block : %d" % n_tx)
print("merkle root                : %s\n" % root.hex())

# Prove transaction #7 is in the block without revealing any of the others.
target_index = 7
proof = merkle_proof(tx_leaves, target_index)
ok = verify_proof(tx_leaves[target_index], proof, root)
print("proving tx #%d is in the block:" % target_index)
print("  proof length (sibling hashes needed) : %d  (log2(%d) rounds up to %d)"
      % (len(proof), n_tx, int(np.ceil(np.log2(n_tx)))))
print("  proof verifies against the root       : %s" % ok)

# Tamper with the leaf being proved: the same proof must now fail.
tampered_leaf = h(b"a different transaction entirely")
ok_tampered = verify_proof(tampered_leaf, proof, root)
print("  same proof, a different (tampered) leaf: %s" % ok_tampered)

# Tamper with ONE transaction deep in the tree and show the root changes,
# even though only 1 of 11 leaves moved.
tx_leaves_tampered = list(tx_leaves)
tx_leaves_tampered[3] = h(b"a maliciously rewritten transaction")
root_tampered = merkle_root(tx_leaves_tampered)
print("\nchanging just 1 of %d transactions (#3):" % n_tx)
print("  original root : %s" % root.hex())
print("  new root      : %s" % root_tampered.hex())
print("  roots match   : %s  (a single-byte change anywhere invalidates the whole commitment)"
      % (root == root_tampered))
