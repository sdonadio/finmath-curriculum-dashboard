import numpy as np
np.seterr(all="ignore")
import logging, io, json

class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            "level": record.levelname,
            "msg": record.getMessage(),
            "symbol": getattr(record, "symbol", None),
            "qty": getattr(record, "qty", None),
        })

buffer = io.StringIO()
logger = logging.getLogger("week7.structured")
logger.setLevel(logging.INFO)
logger.propagate = False
for h in list(logger.handlers):
    logger.removeHandler(h)
handler = logging.StreamHandler(buffer)
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)

logger.info("order filled", extra={"symbol": "AAPL", "qty": 100})
logger.info("order filled", extra={"symbol": "MSFT", "qty": 50})
logger.warning("order rejected", extra={"symbol": "AAPL", "qty": 25})

lines = buffer.getvalue().splitlines()
print("raw JSON log lines:")
for ln in lines:
    print(" ", ln)

parsed = [json.loads(ln) for ln in lines]
aapl_qty = sum(r["qty"] for r in parsed if r["symbol"] == "AAPL" and r["level"] == "INFO")
print("\nqueried back as data -- total AAPL qty from INFO lines:", aapl_qty)
print("a sentence-shaped log line ('order filled for AAPL qty=100') would need a",
      "regex to answer the same question; the JSON line just needs json.loads")
