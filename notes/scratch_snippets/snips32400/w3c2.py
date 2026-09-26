import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import ast

# Three small lint rules, each a plain walk over the AST looking for a
# specific, mechanically-detectable pattern -- not a general understanding
# of what the code does.
SAMPLES = {
    "append_fills": '''
def append_fills(fill, seen=[]):
    seen.append(fill)
    return seen
''',
    "safe_default": '''
def append_fills(fill, seen=None):
    seen = seen if seen is not None else []
    seen.append(fill)
    return seen
''',
    "swallow_all": '''
def load(path):
    try:
        return open(path).read()
    except:
        return None
''',
    "compare_none": '''
def is_missing(x):
    if x == None:
        return True
    return False
''',
    "legit_use_of_equals": '''
def within_band(x, lo, hi):
    if x == None or x < lo or x > hi:
        return False
    return True
''',
}


def rule_mutable_default(tree):
    hits = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            for default in node.args.defaults:
                if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                    hits.append(f"{node.name}: mutable default argument "
                                f"(shared across every call that omits it)")
    return hits


def rule_bare_except(tree):
    hits = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler) and node.type is None:
            hits.append("bare 'except:' catches every exception, including "
                        "KeyboardInterrupt and SystemExit")
    return hits


def rule_compare_none_with_eq(tree):
    hits = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Compare):
            for op, comparator in zip(node.ops, node.comparators):
                is_none = isinstance(comparator, ast.Constant) and comparator.value is None
                if is_none and isinstance(op, ast.Eq):
                    hits.append("'== None' should be 'is None' (identity, not "
                                "equality, is what None comparison means)")
    return hits


RULES = [("mutable-default", rule_mutable_default),
         ("bare-except", rule_bare_except),
         ("compare-none-eq", rule_compare_none_with_eq)]

total = 0
for name, source in SAMPLES.items():
    tree = ast.parse(source)
    findings = []
    for rule_name, rule_fn in RULES:
        for hit in rule_fn(tree):
            findings.append((rule_name, hit))
    total += len(findings)
    print(f"{name}:")
    if findings:
        for rule_name, hit in findings:
            print(f"  [{rule_name}] {hit}")
    else:
        print("  clean")
    print()

print(f"total findings across {len(SAMPLES)} samples: {total}")
print("\nnote 'legit_use_of_equals': it also writes 'x == None', and the")
print("compare-none-eq rule flags it exactly the same way it flagged")
print("'compare_none' -- the rule cannot tell that this particular use is")
print("harmless (None is not a value < or > anything, so short-circuiting on")
print("== here never misbehaves the way 'is' vs '==' can for custom objects).")
print("A linter trades a few flagged-but-harmless lines like this one for")
print("catching every genuinely broken one; the false positive is the cost")
print("of the rule being simple enough to run on every file, every commit.")
