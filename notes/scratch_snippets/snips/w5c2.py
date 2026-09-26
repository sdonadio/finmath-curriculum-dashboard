import numpy as np
np.seterr(all="ignore")

class FlakyThenOK:
    def __init__(self, fail_times):
        self.fail_times = fail_times
        self.calls = 0

    def fetch(self):
        self.calls += 1
        if self.calls <= self.fail_times:
            raise ConnectionError(f"attempt {self.calls} failed")
        return {"status": "ok", "attempt": self.calls}

def fetch_with_retry(client, max_attempts):
    last_exc = None
    for attempt in range(1, max_attempts + 1):
        try:
            return client.fetch(), attempt
        except ConnectionError as exc:
            last_exc = exc
    raise last_exc

client = FlakyThenOK(fail_times=2)
result, attempts = fetch_with_retry(client, max_attempts=5)
print("recovered after", attempts, "attempts:", result)

client2 = FlakyThenOK(fail_times=10)
try:
    fetch_with_retry(client2, max_attempts=3)
except ConnectionError as exc:
    print("\nexhausted retries (max_attempts=3) with a client that fails 10 times:", exc)

print("\nno real socket was ever opened; the double's behaviour is a plain counter,",
      "so the test is 100% deterministic across runs")
