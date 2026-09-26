import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

import ast

# A tiny static type checker: read a function's declared parameter types from
# its annotations, then check each call site's literal argument types against
# them WITHOUT ever executing either the function or the call.
SOURCE = '''
def notional(qty: int, price: float) -> float:
    return qty * price

def label(symbol: str, venue: str) -> str:
    return symbol + "@" + venue
'''
CALL_SITES = [
    "notional(100, 54.20)",        # int, float -- matches
    "notional('3', 2)",            # str where int is declared -- mismatch
    "label('AAPL', 'NASDAQ')",     # str, str -- matches
    "label('AAPL', 42)",           # int where str is declared -- mismatch
]

ANNOT_TYPE = {"int": int, "float": (int, float), "str": str}


def declared_param_types(source):
    tree = ast.parse(source)
    sigs = {}
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            types = []
            for arg in node.args.args:
                ann = arg.annotation.id if isinstance(arg.annotation, ast.Name) else None
                types.append(ann)
            sigs[node.name] = types
    return sigs


def literal_type_name(node):
    if isinstance(node.value, bool):
        return "bool"
    if isinstance(node.value, int):
        return "int"
    if isinstance(node.value, float):
        return "float"
    if isinstance(node.value, str):
        return "str"
    return "unknown"


def check_call(call_src, sigs):
    call = ast.parse(call_src, mode="eval").body
    fname = call.func.id
    declared = sigs.get(fname)
    if declared is None:
        return f"unknown function {fname!r}", []
    problems = []
    for i, (arg, decl) in enumerate(zip(call.args, declared)):
        if not isinstance(arg, ast.Constant) or decl is None:
            continue
        actual = literal_type_name(arg)
        expected_py = ANNOT_TYPE.get(decl)
        if expected_py and not isinstance(arg.value, expected_py):
            problems.append(f"arg {i} is {actual}, declared {decl}")
    return None, problems


sigs = declared_param_types(SOURCE)
print("declared signatures (from annotations, never executed):")
for name, types in sigs.items():
    print(f"  {name}({', '.join(types)})")

print()
for call_src in CALL_SITES:
    err, problems = check_call(call_src, sigs)
    if err:
        print(f"{call_src:<28} -> {err}")
    elif problems:
        print(f"{call_src:<28} -> TYPE ERROR: {'; '.join(problems)}")
    else:
        print(f"{call_src:<28} -> ok")

print("\nnow actually RUN the mismatched notional('3', 2) call at runtime:")
env = {}
exec(compile(SOURCE, "<sig>", "exec"), env)
result = env["notional"]("3", 2)
print(f"  notional('3', 2) executed without raising and returned {result!r}")
print(f"  the numerically correct answer, if qty had really been an int, is "
      f"{3 * 2}")

print("\nPython never checks a parameter's declared type at call time, so the")
print("call runs to completion: '3' * 2 is valid Python -- string repetition")
print("-- and returns '33', not the number 6 a caller almost certainly meant.")
print("No crash, no warning, just a silently wrong value. The static checker")
print("flagged this exact call as wrong before either function or call site")
print("ever executed a single line.")
