import numpy as np
np.seterr(all="ignore")

# A token "smart contract" is, underneath the Solidity syntax, just a state
# machine: a dict of balances plus a total-supply counter, and a small set
# of transitions (mint, transfer, burn) that must each preserve one
# invariant -- sum(balances) always equals total_supply. Every bug class a
# real ERC-20 exploit exploits (integer overflow, a missing balance check,
# a mint the owner forgot to gate) is really a violation of that one
# invariant, made visible here by checking it after every transition.

class TokenContract:
    def __init__(self, owner):
        self.owner = owner
        self.balances = {}
        self.total_supply = 0

    def _invariant_ok(self):
        return sum(self.balances.values()) == self.total_supply

    def mint(self, to, amount, caller):
        if caller != self.owner:
            return False, "reverted: only owner can mint"
        self.balances[to] = self.balances.get(to, 0) + amount
        self.total_supply += amount
        assert self._invariant_ok(), "invariant broken after mint"
        return True, "minted %d to %s" % (amount, to)

    def transfer(self, frm, to, amount):
        if self.balances.get(frm, 0) < amount:
            return False, "reverted: insufficient balance"
        self.balances[frm] -= amount
        self.balances[to] = self.balances.get(to, 0) + amount
        assert self._invariant_ok(), "invariant broken after transfer"
        return True, "transferred %d from %s to %s" % (amount, frm, to)

    def burn(self, frm, amount):
        if self.balances.get(frm, 0) < amount:
            return False, "reverted: insufficient balance to burn"
        self.balances[frm] -= amount
        self.total_supply -= amount
        assert self._invariant_ok(), "invariant broken after burn"
        return True, "burned %d from %s" % (amount, frm)

token = TokenContract(owner="deployer")
steps = [
    ("mint", ("alice", 1_000_000, "deployer")),
    ("mint", ("alice", 500_000, "attacker")),      # not the owner -- must revert
    ("transfer", ("alice", "bob", 250_000)),
    ("transfer", ("bob", "carol", 999_999)),        # bob does not have this much
    ("burn", ("bob", 50_000)),
]
print("state machine trace (contract call -> effect on the ledger):\n")
for call, args in steps:
    ok, msg = getattr(token, call)(*args)
    print("  %-9s%-40s -> %-5s  %s" % (call, str(args), ok, msg))
    print("    balances=%s  total_supply=%d  invariant holds: %s"
          % (token.balances, token.total_supply, sum(token.balances.values()) == token.total_supply))

print("\nfinal state: %s" % token.balances)
print("sum(balances) = %d, total_supply = %d -- the invariant this whole contract"
      % (sum(token.balances.values()), token.total_supply))
print("exists to protect held through every successful AND every reverted call")
