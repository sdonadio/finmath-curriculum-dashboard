import numpy as np
import hashlib
np.seterr(all="ignore")

# Two ways to represent "who owns what". The ACCOUNT model (Ethereum) keeps
# a single running balance per address and a nonce that orders that
# address's transactions. The UTXO model (Bitcoin) has no balances at all:
# coins exist only as discrete, unspent transaction outputs, each spendable
# exactly once and in full -- a payment consumes whole UTXOs as inputs and
# creates new ones as outputs (including a "change" output back to the
# sender), and double-spending is caught by simply refusing to let any
# UTXO be referenced as an input twice.

def txid(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:12]

# --- Account model: balance + nonce, transactions must be signed in nonce order.
account_balances = {"alice": 100.0, "bob": 20.0, "carol": 0.0}
account_nonces = {"alice": 0, "bob": 0, "carol": 0}

def account_transfer(sender, recipient, amount, nonce):
    if nonce != account_nonces[sender]:
        return False, "wrong nonce (replay or out-of-order)"
    if account_balances[sender] < amount:
        return False, "insufficient balance"
    account_balances[sender] -= amount
    account_balances[recipient] = account_balances.get(recipient, 0.0) + amount
    account_nonces[sender] += 1
    return True, "ok"

print("ACCOUNT MODEL")
for sender, recipient, amount, nonce in (("alice", "bob", 30.0, 0), ("alice", "carol", 25.0, 1),
                                          ("alice", "bob", 999.0, 2), ("alice", "bob", 5.0, 5)):
    ok, reason = account_transfer(sender, recipient, amount, nonce)
    print("  %-6s -> %-6s  %6.1f  nonce=%d : %-5s (%s)" % (sender, recipient, amount, nonce, ok, reason))
print("  final balances: %s\n" % {k: round(v, 1) for k, v in account_balances.items()})

# --- UTXO model: a set of unspent outputs, each (owner, amount); a transaction
# consumes specific UTXOs as inputs and produces new ones as outputs, and the
# ledger REJECTS any transaction that references an already-spent input.
utxos = {
    "utxo_001": ("alice", 60.0),
    "utxo_002": ("alice", 40.0),
    "utxo_003": ("bob", 20.0),
}
spent = set()

def utxo_spend(inputs, outputs):
    """inputs: list of utxo ids. outputs: list of (owner, amount)."""
    for uid in inputs:
        if uid in spent or uid not in utxos:
            return False, "input %s already spent or does not exist -- rejected" % uid
    in_total = sum(utxos[uid][1] for uid in inputs)
    out_total = sum(amt for _, amt in outputs)
    if abs(in_total - out_total) > 1e-9:
        return False, "inputs (%.1f) do not equal outputs (%.1f)" % (in_total, out_total)
    for uid in inputs:
        spent.add(uid)
    new_ids = []
    for i, (owner, amt) in enumerate(outputs):
        new_id = "utxo_%s" % txid(("%s%s%d" % (owner, amt, i)).encode())
        utxos[new_id] = (owner, amt)
        new_ids.append(new_id)
    return True, "created %s" % new_ids

print("UTXO MODEL")
# Alice pays Bob 35, spending utxo_001 (60) and getting 25 back as change.
ok, reason = utxo_spend(["utxo_001"], [("bob", 35.0), ("alice", 25.0)])
print("  spend utxo_001 (60) -> pay bob 35, change 25 to alice : %-5s (%s)" % (ok, reason))

# Double-spend attempt: try to spend utxo_001 AGAIN in a second transaction.
ok, reason = utxo_spend(["utxo_001"], [("carol", 60.0)])
print("  re-spend utxo_001 (already spent above)               : %-5s (%s)" % (ok, reason))

# Combine two remaining UTXOs into a single payment (a real transaction can
# have many inputs), and check inputs must equal outputs exactly.
ok, reason = utxo_spend(["utxo_002", "utxo_003"], [("carol", 60.0)])
print("  spend utxo_002 (40) + utxo_003 (20) -> pay carol 60    : %-5s (%s)" % (ok, reason))

ok, reason = utxo_spend(["utxo_002"], [("carol", 999.0)])
print("  (already-spent utxo_002 again, wrong amount too)      : %-5s (%s)" % (ok, reason))

print("\nunspent UTXO set now: %s" % {k: v for k, v in utxos.items() if k not in spent})
print("\nthe account model needs a NONCE to stop the exact same signed transaction")
print("being replayed twice; the UTXO model needs no such bookkeeping because a")
print("spent output simply cannot be referenced again, ever -- the check is local")
print("to the transaction, not a running count the ledger must remember per address")
