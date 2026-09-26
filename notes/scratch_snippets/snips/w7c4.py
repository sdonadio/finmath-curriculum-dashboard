import numpy as np
np.seterr(all="ignore")
import logging, logging.handlers, os, tempfile

with tempfile.TemporaryDirectory() as d:
    path = os.path.join(d, "arena.log")
    logger = logging.getLogger("week7.rotation")
    logger.setLevel(logging.INFO)
    logger.propagate = False
    for h in list(logger.handlers):
        logger.removeHandler(h)
    handler = logging.handlers.RotatingFileHandler(path, maxBytes=500, backupCount=3)
    logger.addHandler(handler)

    line = "tick symbol=AAPL bid=190.10 ask=190.12 size=400"
    for i in range(120):
        logger.info("%s seq=%d", line, i)
    handler.close()

    files = sorted(f for f in os.listdir(d) if f.startswith("arena.log"))
    sizes = {f: os.path.getsize(os.path.join(d, f)) for f in files}
    print("rotated log files on disk:", files)
    for f in files:
        print(f"  {f}: {sizes[f]} bytes")
    print("\nbackupCount=3 caps history at 3 old files plus the live one:", len(files) <= 4)
