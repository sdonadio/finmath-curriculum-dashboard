import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# The checklist a reviewer actually works through on a pipeline pull request.
# Each item is a QUESTION WITH EVIDENCE, not an opinion.
CHECKLIST = [
    ("reruns_clean", "Does it run twice from a clean state and give the same output?", 3),
    ("inputs_pinned", "Are input dataset versions / digests pinned in the change?", 3),
    ("output_diff_explained", "Is the diff of the OUTPUT explained by the diff of the INPUT?", 3),
    ("schema_declared", "Is the output schema declared and checked at the boundary?", 2),
    ("idempotent_write", "Is the write an upsert / partition swap, not a blind append?", 2),
    ("no_lookahead", "Does every time-series join use an as-of predicate?", 3),
    ("tests_added", "Is there a test that fails without this change?", 2),
    ("cost_stated", "Is the change's cost stated in rows/bytes read?", 1),
    ("lineage_emitted", "Does the run emit the code version, params and input digests?", 2),
]

PRS = {
    "PR 412  add TRACE loader": {
        "reruns_clean": True, "inputs_pinned": True, "output_diff_explained": True,
        "schema_declared": True, "idempotent_write": True, "no_lookahead": True,
        "tests_added": True, "cost_stated": False, "lineage_emitted": True},
    "PR 418  'small fix' to the signal": {
        "reruns_clean": True, "inputs_pinned": False, "output_diff_explained": False,
        "schema_declared": True, "idempotent_write": True, "no_lookahead": True,
        "tests_added": False, "cost_stated": False, "lineage_emitted": True},
    "PR 421  speed up the funda join": {
        "reruns_clean": False, "inputs_pinned": True, "output_diff_explained": True,
        "schema_declared": False, "idempotent_write": False, "no_lookahead": True,
        "tests_added": True, "cost_stated": True, "lineage_emitted": False},
}
BLOCKERS = {"reruns_clean", "output_diff_explained", "no_lookahead", "inputs_pinned"}


def review(answers):
    got = sum(w for k, _, w in CHECKLIST if answers.get(k))
    tot = sum(w for _, _, w in CHECKLIST)
    fails = [k for k, _, _ in CHECKLIST if not answers.get(k)]
    blocking = sorted(set(fails) & BLOCKERS)
    return got, tot, fails, blocking


for name, answers in PRS.items():
    got, tot, fails, blocking = review(answers)
    verdict = "REQUEST CHANGES" if blocking else ("APPROVE" if not fails else "APPROVE with nits")
    print(f"{name}")
    print(f"  weighted score {got}/{tot}   verdict: {verdict}")
    if blocking:
        for k in blocking:
            q = next(q for kk, q, _ in CHECKLIST if kk == k)
            print(f"    BLOCKING  {k:<22} {q}")
    nits = [k for k in fails if k not in blocking]
    if nits:
        print(f"    nits      {', '.join(nits)}")
    print()

print("the four blocking items are the ones a reviewer cannot verify later:")
print("  reruns_clean          -- otherwise the result is an anecdote")
print("  output_diff_explained -- an unexplained output change IS the bug report")
print("  no_lookahead          -- invisible in the diff, fatal in the backtest")
print("  inputs_pinned         -- without it, 'it worked yesterday' is unfalsifiable")
