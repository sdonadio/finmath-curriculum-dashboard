import numpy as np
import hashlib
np.seterr(all="ignore")

# A Merkle tree hashes transactions in pairs, up to a single root, so a
# block header can commit to thousands of transactions with one 32-byte
# hash. A Merkle PROOF lets you verify a single transaction is included
# without downloading the other transactions at all -- just log2(n) sibling
# hashes, recomputed up to the known root.

def sha(data):
    return hashlib.sha256(data.encode() if isinstance(data, str) else data).digest()

def merkle_root_and_layers(leaves):
    layers = [[sha(tx) for tx in leaves]]
    layer = layers[0]
    while len(layer) > 1:
        if len(layer) % 2 == 1:
            layer = layer + [layer[-1]]      # duplicate the odd one out (Bitcoin convention)
        nxt = [sha(layer[i] + layer[i + 1]) for i in range(0, len(layer), 2)]
        layers.append(nxt)
        layer = nxt
    return layer[0], layers

def merkle_proof(layers, index):
    proof = []
    idx = index
    for layer in layers[:-1]:
        pad = layer + [layer[-1]] if len(layer) % 2 else layer
        sibling_idx = idx ^ 1
        proof.append((pad[sibling_idx], "left" if sibling_idx < idx else "right"))
        idx //= 2
    return proof

def verify_proof(leaf, proof, root):
    h = sha(leaf)
    for sibling, side in proof:
        h = sha(sibling + h) if side == "left" else sha(h + sibling)
    return h == root

txs = ["tx:Alice>Bob:10", "tx:Bob>Carol:4", "tx:Carol>Dave:1", "tx:Dave>Alice:2",
       "tx:Alice>Eve:3", "tx:Eve>Bob:1", "tx:Frank>Grace:7"]        # 7 -> odd layer, exercises padding
root, layers = merkle_root_and_layers(txs)
print("Merkle tree over %d transactions, %d layers, root=%s..." % (len(txs), len(layers), root.hex()[:16]))

target_index = 4     # verify "tx:Alice>Eve:3" without the other 6 transactions
proof = merkle_proof(layers, target_index)
ok = verify_proof(txs[target_index], proof, root)
print("\nverifying tx[%d]=%r with a %d-hash proof (not all %d transactions): %s"
      % (target_index, txs[target_index], len(proof), len(txs), ok))

# A single flipped character anywhere in the transaction breaks the proof.
forged = txs[target_index].replace("3", "300")
ok_forged = verify_proof(forged, proof, root)
print("verifying a forged version %r with the SAME proof             : %s" % (forged, ok_forged))

print("\nproof size vs a linear scan, as the block grows:")
for n in (7, 100, 10_000, 1_000_000):
    print("  %8d txs  ->  proof length ~ %d hashes  vs  %d for a full scan"
          % (n, int(np.ceil(np.log2(n))), n))
