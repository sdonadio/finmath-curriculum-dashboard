import numpy as np
np.seterr(all="ignore")

FIRST_BAD = 37
N_COMMITS = 60

def is_bad(commit_id):
    return commit_id >= FIRST_BAD

def git_bisect(n_commits, is_bad):
    lo, hi = 0, n_commits - 1
    checks = 0
    while lo < hi:
        mid = (lo + hi) // 2
        checks += 1
        if is_bad(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo, checks

first_bad_found, checks = git_bisect(N_COMMITS, is_bad)
linear_checks = FIRST_BAD + 1

print("commits in range:", N_COMMITS)
print("bisect found the first bad commit:", first_bad_found, "in", checks, "checks")
print("a linear scan from commit 0 would have needed:", linear_checks, "checks")
print("bisect matches ceil(log2(N)):", checks, "vs", int(np.ceil(np.log2(N_COMMITS))))
