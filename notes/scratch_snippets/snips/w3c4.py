import numpy as np
np.seterr(all="ignore")
import ast

SOURCE_GOOD = '''
def price(qty: int, px: float) -> float:
    return qty * px
'''

SOURCE_BAD = '''
def price(qty, px):
    try:
        return qty * px
    except:
        pass
'''

def lint_bare_except(source):
    tree = ast.parse(source)
    issues = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler) and node.type is None:
            issues.append(f"line {node.lineno}: bare except -- catches SystemExit/KeyboardInterrupt too")
    return issues

def check_annotations(source):
    tree = ast.parse(source)
    issues = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            missing_ret = node.returns is None
            missing_args = [a.arg for a in node.args.args if a.annotation is None]
            if missing_ret or missing_args:
                issues.append(f"line {node.lineno}: {node.name} missing annotations "
                              f"(return={missing_ret}, args={missing_args})")
    return issues

for label, src in (("good.py", SOURCE_GOOD), ("bad.py", SOURCE_BAD)):
    print(f"--- {label} ---")
    ruff_issues = lint_bare_except(src)
    mypy_issues = check_annotations(src)
    for i in ruff_issues:
        print("  ruff:", i)
    for i in mypy_issues:
        print("  mypy:", i)
    gate = "BLOCKED" if (ruff_issues or mypy_issues) else "PASS"
    print("  pre-merge gate:", gate)
