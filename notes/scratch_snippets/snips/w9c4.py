import numpy as np
np.seterr(all="ignore")

class TokenBucket:
    def __init__(self, capacity):
        self.capacity = capacity
        self.tokens = capacity

    def try_take(self):
        if self.tokens > 0:
            self.tokens -= 1
            return True
        return False

    def refill(self, n):
        self.tokens = min(self.capacity, self.tokens + n)

def handle_request(bucket, retry_after_seconds):
    if bucket.try_take():
        return 200, {"ok": True}, None
    return 429, {"error": "rate limited"}, retry_after_seconds

bucket = TokenBucket(capacity=3)
for i in range(5):
    status, body, retry_after = handle_request(bucket, retry_after_seconds=2)
    print(f"request {i}: {status} {body}" + (f"  Retry-After: {retry_after}s" if retry_after else ""))

def client_with_backoff(bucket, max_requests):
    attempts, waited = 0, 0
    for _ in range(max_requests):
        status, body, retry_after = handle_request(bucket, retry_after_seconds=2)
        attempts += 1
        if status == 200:
            return attempts, waited
        waited += retry_after
        bucket.refill(1)
    return attempts, waited

bucket2 = TokenBucket(capacity=1)
handle_request(bucket2, 2)
attempts, waited = client_with_backoff(bucket2, max_requests=4)
print(f"\nclient exhausted the bucket, then honored Retry-After and succeeded after "
      f"{attempts} attempt(s), total wait {waited}s")
