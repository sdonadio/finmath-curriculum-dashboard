import numpy as np
np.seterr(all="ignore")

build_calls = {"function": 0, "module": 0}

def function_scoped_fixture():
    build_calls["function"] += 1
    return {"conn": f"connection#{build_calls['function']}"}

_module_cache = {}
def module_scoped_fixture():
    if "conn" not in _module_cache:
        build_calls["module"] += 1
        _module_cache["conn"] = f"connection#{build_calls['module']}"
    return _module_cache

def test_a_uses_function_fixture():
    fx = function_scoped_fixture()
    assert fx["conn"] == "connection#" + str(build_calls["function"])

def test_b_uses_function_fixture():
    fx = function_scoped_fixture()
    assert fx["conn"] == "connection#" + str(build_calls["function"])

def test_a_uses_module_fixture():
    fx = module_scoped_fixture()
    assert fx["conn"] == "connection#1"

def test_b_uses_module_fixture():
    fx = module_scoped_fixture()
    assert fx["conn"] == "connection#1"

for test in (test_a_uses_function_fixture, test_b_uses_function_fixture,
             test_a_uses_module_fixture, test_b_uses_module_fixture):
    test()

print("function-scoped fixture rebuilt once per test:", build_calls["function"], "times for 2 tests")
print("module-scoped fixture built once and reused:", build_calls["module"], "time(s) for 2 tests")
