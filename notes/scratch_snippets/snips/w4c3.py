import numpy as np
np.seterr(all="ignore")

class FakeClock:
    def __init__(self, start=0.0):
        self.t = start
    def now(self):
        return self.t
    def advance(self, seconds):
        self.t += seconds

class StubPriceFeed:
    def __init__(self, canned):
        self.canned = canned
    def price(self, symbol):
        return self.canned[symbol]

class RecordingMock:
    def __init__(self):
        self.calls = []
    def send_alert(self, message):
        self.calls.append(message)

def check_stale_price(clock, feed, symbol, last_seen_at, max_age):
    age = clock.now() - last_seen_at
    price = feed.price(symbol)
    return price, age > max_age

clock = FakeClock(start=100.0)
feed = StubPriceFeed({"AAPL": 190.25})
alerts = RecordingMock()

price, stale = check_stale_price(clock, feed, "AAPL", last_seen_at=40.0, max_age=30)
if stale:
    alerts.send_alert(f"AAPL price is stale ({clock.now() - 40.0:.0f}s old)")

print("price from the stub:", price)
print("stale, using a fake clock we fully control:", stale)
print("mock recorded", len(alerts.calls), "call(s):", alerts.calls)

clock.advance(-70)
price2, stale2 = check_stale_price(clock, feed, "AAPL", last_seen_at=40.0, max_age=30)
print("\nafter rewinding the fake clock, stale becomes:", stale2)
