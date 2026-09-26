import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# A synthetic vendor endpoint: 23 records, page size 5, two pagination styles.
RECORDS = [{"id": i, "sym": ["AAA", "BBB", "CCC"][i % 3], "px": 100.0 + i} for i in range(23)]


def page_by_cursor(store, cursor, limit=5):
    """Keyset pagination: 'rows whose id is greater than this cursor'."""
    rows = [r for r in store if r["id"] > cursor][:limit]
    return rows, (rows[-1]["id"] if len(rows) == limit else None)


def page_by_offset(store, offset, limit=5):
    """Offset pagination: 'rows offset..offset+limit of the current result set'."""
    return store[offset:offset + limit]


got, cur, calls = [], -1, 0
while True:
    rows, cur = page_by_cursor(RECORDS, cur)
    calls += 1
    got += rows
    if cur is None:
        break
print(f"cursor pull : {calls} calls, {len(got)} rows, distinct {len(set(r['id'] for r in got))}")


def offset_drain(mutate_at, mutation):
    live, seen = list(RECORDS), []
    for off in (0, 5, 10, 15, 20):
        if off == mutate_at:
            mutation(live)
        seen += page_by_offset(live, off)
    ids = [r["id"] for r in seen]
    dup = sorted(i for i in set(ids) if ids.count(i) > 1)
    missing = sorted(set(r["id"] for r in RECORDS) - set(ids))
    return len(ids), dup, missing


n, dup, miss = offset_drain(10, lambda lv: lv.insert(0, {"id": 99, "sym": "NEW", "px": 1.0}))
print(f"offset pull, insert at top : {n} rows, duplicated {dup}, missing {miss}")
n, dup, miss = offset_drain(10, lambda lv: lv.pop(0))
print(f"offset pull, delete at top : {n} rows, duplicated {dup}, missing {miss}")
print("a cursor is a fact about the data; an offset is a fact about a result set that moved")
