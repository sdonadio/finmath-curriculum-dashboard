import numpy as np
np.seterr(all="ignore")
import sys

def classify(x):
    if x < 0:
        return "negative"
    elif x == 0:
        return "zero"
    else:
        return "positive"

hit_lines = set()

def tracer(frame, event, arg):
    if event == "line" and frame.f_code.co_name == "classify":
        hit_lines.add(frame.f_lineno)
    return tracer

def run_with_coverage(fn, args_list):
    sys.settrace(tracer)
    try:
        for a in args_list:
            fn(a)
    finally:
        sys.settrace(None)

run_with_coverage(classify, [5])
one_case_lines = set(hit_lines)
hit_lines.clear()

run_with_coverage(classify, [5, -3, 0])
three_case_lines = set(hit_lines)

print("body lines executed by ONE test case (x=5):", sorted(one_case_lines))
print("body lines executed by THREE cases (5, -3, 0):", sorted(three_case_lines))
print("extra lines only the negative/zero cases reach:",
      sorted(three_case_lines - one_case_lines))
print("\n100% line coverage needs a case that visits every branch,",
      "not just a lot of unrelated calls to the same branch")
