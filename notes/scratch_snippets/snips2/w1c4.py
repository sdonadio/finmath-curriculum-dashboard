import numpy as np
np.seterr(all="ignore")

# Two ledger data models process the SAME transactions to the SAME final
# balances, but structure double-spend prevention differently. The account
# model (Ethereum-style) keeps one running balance per address and checks
# sender_balance >= amount. The UTXO model (Bitcoin-style) has no
# balances at all: every transaction consumes specific prior outputs
# entirely and creates new ones, and "your balance" is just the sum of
# unspent outputs you can point to.

txs = [
    ("Alice", "Bob",   10),
    ("Bob",   "Carol",  4),
    ("Carol", "Dave",   1),
    ("Alice", "Eve",    3),
    ("Eve",   "Bob",    1),
]
genesis = {"Alice": 20, "Bob": 5, "Carol": 0, "Dave": 0, "Eve": 0}

def run_account_model(genesis, txs):
    bal = dict(genesis)
    log = []
    for sender, receiver, amt in txs:
        ok = bal.get(sender, 0) >= amt
        if ok:
            bal[sender] -= amt
            bal[receiver] = bal.get(receiver, 0) + amt
        log.append((sender, receiver, amt, ok))
    return bal, log

def run_utxo_model(genesis, txs):
    utxos = {}                                   # utxo_id -> (owner, amount)
    next_id = 0
    for owner, amt in genesis.items():
        if amt > 0:
            utxos[next_id] = (owner, amt)
            next_id += 1
    log = []
    for sender, receiver, amt in txs:
        owned = [uid for uid, (o, a) in utxos.items() if o == sender]
        total = sum(utxos[uid][1] for uid in owned)
        ok = total >= amt
        if ok:
            for uid in owned:                    # consume ALL of the sender's UTXOs (simplified)
                del utxos[uid]
            utxos[next_id] = (receiver, amt); next_id += 1
            change = total - amt
            if change > 0:
                utxos[next_id] = (sender, change); next_id += 1
        log.append((sender, receiver, amt, ok))
    return utxos, log

acct_bal, acct_log = run_account_model(genesis, txs)
utxo_set, utxo_log = run_utxo_model(genesis, txs)

utxo_bal = {}
for owner, amt in utxo_set.values():
    utxo_bal[owner] = utxo_bal.get(owner, 0) + amt

print("account-model final balances : %s" % {k: acct_bal.get(k, 0) for k in genesis})
print("UTXO-model final balances    : %s" % {k: utxo_bal.get(k, 0) for k in genesis})
print("the two models agree         : %s\n"
      % (all(acct_bal.get(k, 0) == utxo_bal.get(k, 0) for k in genesis)))

# The double-spend check itself looks different: try to make Alice spend
# more than she has, twice in a row, and watch each model reject it its own way.
double_spend = [("Alice", "Mallory", 100), ("Alice", "Mallory", 100)]
_, acct_log2 = run_account_model(acct_bal, double_spend)
_, utxo_log2 = run_utxo_model({o: a for o, a in utxo_bal.items()}, double_spend)
print("account model on an overdraft attempt : %s" % acct_log2)
print("UTXO model on an overdraft attempt    : %s" % utxo_log2)
print("\nboth reject it, but the account model checks a STORED NUMBER while the")
print("UTXO model checks whether specific, named prior outputs exist and are unspent")
