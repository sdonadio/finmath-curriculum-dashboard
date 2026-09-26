import numpy as np
np.seterr(all="ignore")
import logging, io

buffer = io.StringIO()
logger = logging.getLogger("week7.levels")
logger.setLevel(logging.DEBUG)
logger.propagate = False
for h in list(logger.handlers):
    logger.removeHandler(h)
handler = logging.StreamHandler(buffer)
handler.setFormatter(logging.Formatter("%(levelname)s:%(message)s"))
logger.addHandler(handler)

logger.setLevel(logging.INFO)
logger.debug("connecting to feed")
logger.info("feed connected")
logger.warning("feed lag 4s")
logger.error("feed disconnected")

captured_at_info = buffer.getvalue().splitlines()
print("logger level = INFO, emitted lines:")
for line in captured_at_info:
    print(" ", line)

buffer.truncate(0); buffer.seek(0)
logger.setLevel(logging.DEBUG)
logger.debug("connecting to feed")
logger.info("feed connected")

captured_at_debug = buffer.getvalue().splitlines()
print("\nlogger level = DEBUG, same two calls, emitted lines:")
for line in captured_at_debug:
    print(" ", line)

print("\nraising the level to INFO silently dropped the DEBUG line:",
      len(captured_at_info) == 3 and len(captured_at_debug) == 2)
