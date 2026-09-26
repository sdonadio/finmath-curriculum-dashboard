import numpy as np
np.seterr(all="ignore")

_cache = {}

def get_price_buggy(symbol, fetch_fn):
    if symbol not in _cache:
        _cache[symbol] = fetch_fn(symbol)
    return _cache[symbol]

def fetch_v1(symbol):
    return 100.0

def fetch_v2(symbol):
    return 999.0

def test_order_A_then_B_buggy():
    r1 = get_price_buggy("AAPL", fetch_v1)
    r2 = get_price_buggy("AAPL", fetch_v2)
    return r1, r2

_cache.clear()
order1 = test_order_A_then_B_buggy()

_cache.clear()
r_b_first = get_price_buggy("AAPL", fetch_v2)
r_a_second = get_price_buggy("AAPL", fetch_v1)
order2 = (r_a_second, r_b_first)

print("buggy version, order A-then-B:", order1)
print("buggy version, order B-then-A:", order2)
print("same two calls, different order, different results -- test-order dependence:",
      order1 != order2)

def get_price_fixed(symbol, fetch_fn, cache):
    if symbol not in cache:
        cache[symbol] = fetch_fn(symbol)
    return cache[symbol]

def test_fixed(order):
    results = []
    for fetch_fn in order:
        cache = {}
        results.append(get_price_fixed("AAPL", fetch_fn, cache))
    return tuple(results)

fixed1 = test_fixed([fetch_v1, fetch_v2])
fixed2 = test_fixed([fetch_v2, fetch_v1])
print("\nfixed version, order A-then-B:", fixed1)
print("fixed version, order B-then-A:", tuple(reversed(fixed2)))
print("results now independent of test order")
