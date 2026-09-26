import numpy as np
np.seterr(all="ignore")

def stage_lint(artifact):
    return ("lint", True, "0 issues")

def stage_test(artifact):
    ok = artifact.get("tests_pass", True)
    return ("test", ok, "42/42 passed" if ok else "3/42 failed")

def stage_build(artifact):
    return ("build", True, "built wheel algoarena_tools-0.3.0")

def stage_deploy(artifact):
    return ("deploy", True, "deployed to staging")

PIPELINE = [stage_lint, stage_test, stage_build, stage_deploy]

def run_pipeline(artifact):
    results = []
    for stage in PIPELINE:
        name, ok, detail = stage(artifact)
        results.append((name, ok, detail))
        if not ok:
            results.append(("PIPELINE", False, f"stopped after '{name}' failed -- later stages skipped"))
            break
    return results

print("green build:")
for name, ok, detail in run_pipeline({"tests_pass": True}):
    print(f"  {name}: {'PASS' if ok else 'FAIL'} -- {detail}")

print("\nred build (a test regresses):")
for name, ok, detail in run_pipeline({"tests_pass": False}):
    print(f"  {name}: {'PASS' if ok else 'FAIL'} -- {detail}")
