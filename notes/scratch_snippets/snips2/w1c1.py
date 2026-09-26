import numpy as np
import hashlib
np.seterr(all="ignore")

# A blockchain's tamper-evidence comes from hash CHAINING: each block's hash
# is computed over its own contents PLUS the previous block's hash, so
# changing anything in block k changes block k's hash, which changes every
# hash computed from block k+1 onward. There is no need to re-check the
# whole history to detect tampering -- only the tip's hash needs comparing.

def sha(data):
    return hashlib.sha256(data.encode()).hexdigest()

def build_chain(payloads):
    chain = []
    prev_hash = "0" * 64          # genesis links to nothing
    for i, payload in enumerate(payloads):
        h = sha(prev_hash + payload)
        chain.append({"index": i, "payload": payload, "prev_hash": prev_hash, "hash": h})
        prev_hash = h
    return chain

def verify(chain):
    prev_hash = "0" * 64
    for block in chain:
        if block["prev_hash"] != prev_hash:
            return False, block["index"]
        if sha(block["prev_hash"] + block["payload"]) != block["hash"]:
            return False, block["index"]
        prev_hash = block["hash"]
    return True, None

payloads = ["genesis", "Alice pays Bob 10", "Bob pays Carol 4", "Carol pays Dave 1", "Dave pays Alice 2"]
chain = build_chain(payloads)

print("chain of %d blocks, each hash a function of its payload AND the previous hash:\n" % len(chain))
for b in chain:
    print("  block %d  hash=%s...  payload=%r" % (b["index"], b["hash"][:12], b["payload"]))

ok, bad = verify(chain)
print("\nchain verifies cleanly: %s" % ok)

# Tamper with block 2's payload without recomputing anything downstream --
# exactly what an attacker who only edits the ledger, not the whole chain,
# would try.
tampered = [dict(b) for b in chain]
tampered[2]["payload"] = "Bob pays Carol 400"     # the attack: inflate one transfer
ok2, bad2 = verify(tampered)
print("after silently editing block 2's payload, chain verifies: %s (first bad block: %s)"
      % (ok2, bad2))

# To make the tamper undetectable, the attacker must recompute EVERY hash
# from the edited block to the tip -- redoing the chain's whole tail.
fixed = [dict(b) for b in tampered]
prev = fixed[1]["hash"]
for i in range(2, len(fixed)):
    fixed[i]["prev_hash"] = prev
    fixed[i]["hash"] = sha(prev + fixed[i]["payload"])
    prev = fixed[i]["hash"]
ok3, bad3 = verify(fixed)
print("after recomputing blocks 2..%d to hide the edit, chain verifies: %s" % (len(fixed) - 1, ok3))
print("(recomputing the tail is exactly the work proof-of-work makes expensive per block)")
