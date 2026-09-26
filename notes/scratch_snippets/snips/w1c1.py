import numpy as np
np.seterr(all="ignore")

def stage_grep(lines, pattern):
    hits = [ln for ln in lines if pattern in ln]
    exit_code = 0 if hits else 1
    return hits, exit_code

def stage_wc(lines):
    return [str(len(lines))], 0

def stage_cat_missing_file():
    return [], 1

def run_pipeline(stages):
    lines = None
    codes = []
    for i, stage in enumerate(stages):
        if i == 0:
            out, code = stage()
        else:
            out, code = stage(lines)
        codes.append(code)
        lines = out
    return lines, codes

out, codes = run_pipeline([stage_cat_missing_file,
                           lambda lines: stage_grep(lines, "foo"),
                           stage_wc])
default_status = codes[-1]
pipefail_status = max(codes) if any(codes) else 0

print("stage exit codes (cat, grep, wc):", codes)
print("output of the pipeline:", out)
print("bash default $? (last stage only):", default_status)
print("with `set -o pipefail` ($? = worst stage):", pipefail_status)
print()
print("cat actually failed (missing file), but the default $? says:",
      "success" if default_status == 0 else "failure")
