import numpy as np
np.seterr(all="ignore")
import json

DB = {}
_next_id = {"n": 1}

def route(method, path, body=None):
    parts = path.strip("/").split("/")
    if parts[0] != "orders":
        return 404, {"error": "not found"}
    if method == "GET" and len(parts) == 1:
        return 200, list(DB.values())
    if method == "GET" and len(parts) == 2:
        oid = int(parts[1])
        if oid not in DB:
            return 404, {"error": f"order {oid} not found"}
        return 200, DB[oid]
    if method == "POST" and len(parts) == 1:
        if not body or "symbol" not in body or "qty" not in body:
            return 400, {"error": "symbol and qty are required"}
        oid = _next_id["n"]; _next_id["n"] += 1
        DB[oid] = {"id": oid, "symbol": body["symbol"], "qty": body["qty"]}
        return 201, DB[oid]
    if method == "DELETE" and len(parts) == 2:
        oid = int(parts[1])
        if oid not in DB:
            return 404, {"error": f"order {oid} not found"}
        del DB[oid]
        return 204, None
    return 405, {"error": "method not allowed"}

calls = [
    ("POST", "/orders", {"symbol": "AAPL", "qty": 100}),
    ("POST", "/orders", {"symbol": "MSFT"}),
    ("GET", "/orders", None),
    ("GET", "/orders/1", None),
    ("GET", "/orders/99", None),
    ("DELETE", "/orders/1", None),
    ("GET", "/orders/1", None),
]
for method, path, body in calls:
    status, payload = route(method, path, body)
    print(f"{method} {path} {json.dumps(body) if body else ''} -> {status} {json.dumps(payload)}")
