import numpy as np
np.seterr(all="ignore")

# Network delay lets two miners find a valid block at nearly the same time,
# each building on the same parent: a temporary FORK. Every node picks one
# rule to resolve it -- Bitcoin's is "the chain with the most cumulative
# proof-of-work wins" (longest chain, assuming equal difficulty per block,
# which is what "longest" really means). A node re-orgs onto the heavier
# chain the moment it becomes heavier, discarding the blocks that lose.

class Block:
    def __init__(self, id_, parent, difficulty=1):
        self.id = id_
        self.parent = parent
        self.difficulty = difficulty

def chain_work(blocks_by_id, tip_id):
    work = 0
    node = tip_id
    while node is not None:
        b = blocks_by_id[node]
        work += b.difficulty
        node = b.parent
    return work

def chain_ids(blocks_by_id, tip_id):
    ids = []
    node = tip_id
    while node is not None:
        ids.append(node)
        node = blocks_by_id[node].parent
    return list(reversed(ids))

blocks = {"genesis": Block("genesis", None)}
chain = ["genesis"]
for h in range(1, 6):
    bid = "b%d" % h
    blocks[bid] = Block(bid, chain[-1])
    chain.append(bid)
print("shared history before the fork: %s\n" % chain)

# Two miners both build on b5 at nearly the same time: A finds one block,
# B finds a competing block, then B's side extends TWO further blocks before
# A's side finds its second -- B's branch pulls ahead.
blocks["a1"] = Block("a1", "b5")
blocks["f1"] = Block("f1", "b5")
blocks["f2"] = Block("f2", "f1")
blocks["f3"] = Block("f3", "f2")
blocks["a2"] = Block("a2", "a1")

tip_a, tip_b = "a2", "f3"
work_a = chain_work(blocks, tip_a)
work_b = chain_work(blocks, tip_b)
print("branch A tip=%s  cumulative work=%d  chain=%s" % (tip_a, work_a, chain_ids(blocks, tip_a)))
print("branch B tip=%s  cumulative work=%d  chain=%s" % (tip_b, work_b, chain_ids(blocks, tip_b)))

winner = tip_a if work_a > work_b else tip_b if work_b > work_a else None
print("\nfork-choice rule selects: %s (%s)"
      % (winner, "more cumulative work" if winner else "tie -- wait for the next block"))

orphaned = set(chain_ids(blocks, tip_a)) - set(chain_ids(blocks, tip_b)) if winner == tip_b else \
           set(chain_ids(blocks, tip_b)) - set(chain_ids(blocks, tip_a))
print("blocks ORPHANED by the re-org (valid blocks, now discarded): %s" % sorted(orphaned))

# A transaction that only appeared in the orphaned branch is no longer
# confirmed at all once the node re-orgs -- exactly the risk waiting for
# confirmations is meant to make vanishingly small.
print("\nany transaction that appeared ONLY in %s is no longer confirmed after the"
      % sorted(orphaned))
print("re-org: it returns to the mempool (or is simply lost if it conflicted with a")
print("transaction now confirmed on the winning branch) -- this is precisely why")
print("more confirmations mean a smaller and smaller chance of exactly this event")

# Monte Carlo: with EQUAL mining power on both branches after the split, how
# often does a 1-block lead survive to be permanent (never gets overtaken by
# the other branch within the next `horizon` blocks)? A symmetric random
# walk (p=q=0.5, no drift) never truly settles -- the "advantage" shrinks
# only in probability, over many more confirmations than the asymmetric
# attacker case in the previous concept.
rng = np.random.default_rng(31200 + 5)
n_races, horizon = 50_000, 40
lead = np.ones(n_races, dtype=np.int64)              # branch A starts 1 block ahead
for _ in range(horizon):
    delta = np.where(rng.random(n_races) < 0.5, 1, -1)
    lead = lead + delta
still_ahead = (lead > 0).mean()
print("\nstarting 1 block ahead with EQUAL hash power on both sides, after %d more"
      % horizon)
print("blocks the originally-ahead branch is still ahead only %.1f%% of the time --"
      % (100 * still_ahead))
print("with no attacker and no drift, a 1-block lead is only a mild, decaying edge")
