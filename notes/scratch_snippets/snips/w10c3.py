import numpy as np
np.seterr(all="ignore")
import doctest, io, contextlib

def vwap(fills):
    """Volume-weighted average price of a list of (qty, price) fills.

    >>> vwap([(100, 10.0), (100, 12.0)])
    11.0
    >>> vwap([(1, 5.0)])
    5.0
    """
    total_qty = sum(q for q, _ in fills)
    return sum(q * p for q, p in fills) / total_qty

results = doctest.testmod(verbose=False)
print("doctest run on the CORRECT docstring: attempted", results.attempted, "failed", results.failed)

def vwap_buggy(fills):
    """Volume-weighted average price of a list of (qty, price) fills.

    >>> vwap_buggy([(100, 10.0), (100, 12.0)])
    11.0
    """
    total_qty = sum(q for q, _ in fills)
    return sum(p for _, p in fills) / total_qty  # bug: forgot to weight by qty

discard = io.StringIO()
with contextlib.redirect_stdout(discard):
    finder = doctest.DocTestFinder()
    runner = doctest.DocTestRunner(verbose=False)
    for test in finder.find(vwap_buggy, "vwap_buggy", globs={"vwap_buggy": vwap_buggy}):
        runner.run(test)
    failed, attempted = runner.summarize(verbose=False)

print("\ndoctest run on the BUGGY version: attempted", attempted, "failed", failed)
print("the documented example itself caught the regression, with no separate test file")
