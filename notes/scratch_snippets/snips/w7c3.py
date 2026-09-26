import numpy as np
np.seterr(all="ignore")
import logging, io

buffer = io.StringIO()
logger = logging.getLogger("week7.correlation")
logger.setLevel(logging.INFO)
logger.propagate = False
for h in list(logger.handlers):
    logger.removeHandler(h)
handler = logging.StreamHandler(buffer)
handler.setFormatter(logging.Formatter("[%(request_id)s] %(message)s"))
logger.addHandler(handler)

_counter = {"n": 0}
def next_request_id():
    _counter["n"] += 1
    return f"req-{_counter['n']:04d}"

def handle_order(order_id, request_id):
    logger.info("received order %s", order_id, extra={"request_id": request_id})
    logger.info("risk check passed", extra={"request_id": request_id})
    logger.info("routed to exchange", extra={"request_id": request_id})

handle_order("AAPL-1", next_request_id())
handle_order("MSFT-1", next_request_id())

lines = buffer.getvalue().splitlines()
print("interleaved log lines from two consecutive orders:")
for ln in lines:
    print(" ", ln)

by_request = {}
for ln in lines:
    rid = ln.split("]")[0].lstrip("[")
    by_request.setdefault(rid, []).append(ln)

print("\ngrouped back into one story per request id:")
for rid, group in sorted(by_request.items()):
    print(f"  {rid}: {len(group)} line(s)")
