import numpy as np
np.seterr(all="ignore")

# A smart contract executes as a deterministic state machine: every
# operation costs GAS, the sender pre-pays a gas limit, and if execution
# runs out of gas mid-way the ENTIRE transaction reverts -- every state
# change it made is undone, as if it never happened -- even though the gas
# already spent is NOT refunded. Atomicity is the whole point: a contract
# can never be left half-updated.

GAS_COST = {"sload": 2100, "sstore": 20000, "call": 2600, "add": 3, "compare": 3}

def run_tx(ops, gas_limit, state):
    """Execute ops against a COPY of state; return (committed_state, gas_used, status)."""
    working = dict(state)          # changes happen here, committed only on success
    gas_used = 0
    for op, args in ops:
        cost = GAS_COST[op]
        if gas_used + cost > gas_limit:
            return state, gas_used, "OUT_OF_GAS (reverted, no state change, gas NOT refunded)"
        gas_used += cost
        if op == "sload":
            pass
        elif op == "sstore":
            key, val = args
            working[key] = val
        elif op == "call":
            pass
    return working, gas_used, "SUCCESS"

state0 = {"alice_balance": 100, "bob_balance": 50}

# A transfer: read both balances, compare, write both new balances.
transfer_ops = [
    ("sload", None), ("sload", None), ("compare", None),
    ("sstore", ("alice_balance", 70)), ("sstore", ("bob_balance", 80)),
]
cost_estimate = sum(GAS_COST[op] for op, _ in transfer_ops)
print("a transfer costs %d gas exactly (2 sloads + 1 compare + 2 sstores)\n" % cost_estimate)

for gas_limit, label in ((cost_estimate + 5000, "ample gas"),
                         (cost_estimate, "exactly enough gas"),
                         (cost_estimate - 1, "one gas short")):
    new_state, used, status = run_tx(transfer_ops, gas_limit, state0)
    print("gas_limit=%6d (%-20s) -> gas_used=%6d  status=%s  state=%s"
          % (gas_limit, label, used, status, new_state))

print("\nnotice the 'one gas short' case: gas_used stops SHORT of the limit (the failing")
print("sstore is never attempted), the caller still pays for gas actually consumed, and")
print("BOTH balance writes are rolled back -- Bob never sees his 80 even though Alice's")
print("first sstore would have succeeded on its own")
