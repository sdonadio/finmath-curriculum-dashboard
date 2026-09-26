import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import ast

# A "reachability" checker that flags a branch as dead code only when it can
# prove the branch's condition statically -- e.g. a literal constant. That is
# exactly where static analysis has to stop: a condition whose value depends
# on runtime input is not something the checker can evaluate without running
# the program on every possible input, which in general it cannot do.
SOURCE = '''
def a(x):
    if True:
        return 1
    else:
        return 2            # dead: the checker CAN prove this (else of a
                             # literal True condition can never run)

def b(x):
    if x > 0:
        return 1
    return 2               # NOT dead: reachable whenever x <= 0

def c(feature_flag_enabled):
    if feature_flag_enabled:
        return "new_path"
    return "old_path"      # NOT dead, but every call in this build passes
                            # feature_flag_enabled=False, so it is dead IN
                            # PRACTICE -- a fact no static read of this
                            # function alone can know
'''


def literal_bool(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, bool):
        return node.value
    return None


def find_provably_dead_branches(tree):
    findings = []
    for node in ast.walk(tree):
        if isinstance(node, ast.If):
            val = literal_bool(node.test)
            if val is True and node.orelse:
                findings.append((node.lineno, "else branch: condition is "
                                              "the literal True"))
            elif val is False and node.body:
                findings.append((node.lineno, "if branch: condition is "
                                              "the literal False"))
            elif val is None:
                pass  # cannot decide statically -- correctly stays silent
    return findings


tree = ast.parse(SOURCE)
dead = find_provably_dead_branches(tree)
print(f"functions defined: a, b, c")
print(f"branches the checker can PROVE are dead just by reading the source: "
      f"{len(dead)}")
for lineno, why in dead:
    print(f"  line {lineno}: {why}")

print("\nfunction b's second branch is reachable or not depending on x, a")
print("value the checker does not have and cannot compute in general --")
print("determining it would mean solving, for every possible input, whether")
print("some arbitrary earlier computation makes x positive, which is exactly")
print("the class of question undecidability results say has no general")
print("algorithm. The checker correctly says nothing about it rather than")
print("guessing.")

# Empirically confirm b's "dead-looking" branch really does run, for a real input.
env = {}
exec(compile(SOURCE, "<sig>", "exec"), env)
result_negative = env["b"](-3)
print(f"\nb(-3) actually returns {result_negative!r} -- the branch a naive "
      f"read might assume is the 'unlikely' one is exactly the one that ran.")

print("\nfunction c is the sharper version of the same limit: every call site")
print("in this build happens to pass False, so the 'new_path' branch is dead")
print("in practice, but that is a fact about how the function is CALLED")
print("across the whole codebase, not about the function's own text -- no")
print("amount of staring at c's source alone can prove or disprove it.")
