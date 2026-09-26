import numpy as np
np.seterr(all="ignore")

SCHEMA = {
    "type": "object",
    "required": ["symbol", "qty", "side"],
    "properties": {
        "symbol": {"type": "string"},
        "qty": {"type": "number", "minimum": 1},
        "side": {"type": "string", "enum": ["buy", "sell"]},
    },
}

def validate(payload, schema):
    errors = []
    if not isinstance(payload, dict):
        return ["payload must be an object"]
    for field in schema.get("required", []):
        if field not in payload:
            errors.append(f"missing required field '{field}'")
    for field, rules in schema.get("properties", {}).items():
        if field not in payload:
            continue
        value = payload[field]
        want = rules["type"]
        pytype = {"string": str, "number": (int, float)}[want]
        if not isinstance(value, pytype):
            errors.append(f"'{field}' should be {want}, got {type(value).__name__}")
            continue
        if "minimum" in rules and value < rules["minimum"]:
            errors.append(f"'{field}' must be >= {rules['minimum']}, got {value}")
        if "enum" in rules and value not in rules["enum"]:
            errors.append(f"'{field}' must be one of {rules['enum']}, got {value!r}")
    return errors

PAYLOADS = [
    {"symbol": "AAPL", "qty": 100, "side": "buy"},
    {"symbol": "AAPL", "qty": -5, "side": "buy"},
    {"symbol": "AAPL", "qty": 100, "side": "short"},
    {"qty": 100, "side": "buy"},
]

for i, payload in enumerate(PAYLOADS):
    errors = validate(payload, SCHEMA)
    status = "202 accepted -- forwarded to the matching engine" if not errors else "400 rejected"
    print(f"payload {i}: {payload}")
    print(f"  -> {status}")
    for e in errors:
        print("    -", e)
