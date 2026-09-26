import numpy as np
np.seterr(all="ignore")

# two simplified rate scenarios, each with its own rate-consistent prepayment speed
scenarios = [
    {"prob": 0.5, "rate": 0.030, "cpr": 0.30, "wal": 2.0},    # rates fall: refi wave, fast prepay, short WAL
    {"prob": 0.5, "rate": 0.060, "cpr": 0.04, "wal": 12.0},   # rates rise: prepay dries up, slow prepay, long WAL
]
face = 100.0

for s in scenarios:
    price = face * np.exp(-s["rate"] * s["wal"])
    print(f"rate={s['rate']:.1%}  cpr={s['cpr']:.0%}  WAL~{s['wal']:.0f}y  scenario price = {price:.2f}")

model_price = sum(s["prob"] * face * np.exp(-s["rate"] * s["wal"]) for s in scenarios)
static_price = face * np.exp(-0.045 * 7.0)     # naive: average rate, average WAL, ignores the prepay/rate link

print(f"\noption-adjusted (scenario-averaged) price = {model_price:.2f}")
print(f"static single-scenario price (ignores the rate/prepay link) = {static_price:.2f}")
print(f"the gap is the 'option cost' a nominal-spread calculation misses -- exactly what OAS is built to correct for")
