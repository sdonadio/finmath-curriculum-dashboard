import numpy as np
np.seterr(all="ignore")

IDEMPOTENCY_STORE = {}
ORDERS = {}
_next_id = {"n": 1}

def create_order(idempotency_key, symbol, qty):
    if idempotency_key in IDEMPOTENCY_STORE:
        return 200, IDEMPOTENCY_STORE[idempotency_key]
    oid = _next_id["n"]; _next_id["n"] += 1
    order = {"id": oid, "symbol": symbol, "qty": qty}
    ORDERS[oid] = order
    IDEMPOTENCY_STORE[idempotency_key] = order
    return 201, order

key = "client-generated-uuid-abc123"
r1 = create_order(key, "AAPL", 100)
r2 = create_order(key, "AAPL", 100)
r3 = create_order("a-different-key", "AAPL", 100)

print("first attempt:", r1)
print("retry with the SAME idempotency key:", r2)
print("a different key creates a NEW order:", r3)
print("\ntotal orders actually created:", len(ORDERS))
print("(2 requests shared one key and produced exactly one order; a naive",
      "'just retry the POST' client without idempotency keys would have created two)")
