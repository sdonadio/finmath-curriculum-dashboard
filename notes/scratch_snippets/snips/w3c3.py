import numpy as np
np.seterr(all="ignore")

PYPROJECT = {
    "project": {"name": "algoarena-tools", "version": "0.3.0"},
    "project.scripts": {
        "arena-lint": "algoarena_tools.cli:lint_main",
        "arena-report": "algoarena_tools.cli:report_main",
    },
}

def lint_main():
    return "linted 12 files, 0 errors"

def report_main():
    return "wrote report.json"

MODULE_REGISTRY = {
    "algoarena_tools.cli:lint_main": lint_main,
    "algoarena_tools.cli:report_main": report_main,
}

def run_console_script(name):
    target = PYPROJECT["project.scripts"][name]
    fn = MODULE_REGISTRY[target]
    return fn()

for script in PYPROJECT["project.scripts"]:
    print(f"$ {script}  ->  {run_console_script(script)}")

print("\nentry point strings from pyproject.toml:")
for name, target in PYPROJECT["project.scripts"].items():
    print(f"  {name} = {target}")
