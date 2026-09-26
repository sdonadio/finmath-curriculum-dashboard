import numpy as np
np.seterr(all="ignore")
import sys, traceback

def load_config(d, key):
    return d[key]

def get_timeout(config):
    return load_config(config, "timeout") * 1.0

def start_session(config):
    return get_timeout(config)

try:
    start_session({"retries": 3})
except KeyError:
    frames = traceback.extract_tb(sys.exc_info()[2])
    print("call stack, OUTERMOST (where it was called) first:")
    for f in frames:
        print(f"  {f.filename.split('/')[-1]}:{f.lineno} in {f.name}()  ->  {f.line}")
    print("\nthe ACTUAL fault -- KeyError: 'timeout' -- is in the LAST frame,")
    print("even though the bug report will usually mention start_session() first")
