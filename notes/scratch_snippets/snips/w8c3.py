import numpy as np
np.seterr(all="ignore")
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE quotes (id INTEGER PRIMARY KEY, symbol TEXT, ts INTEGER, bid REAL)")
symbols = ["AAPL", "MSFT", "TSLA", "XOM"]
rows = [(symbols[i % 4], i, float(100 + i % 50)) for i in range(5000)]
conn.executemany("INSERT INTO quotes (symbol, ts, bid) VALUES (?, ?, ?)", rows)
conn.commit()

def plan_for(query):
    return conn.execute("EXPLAIN QUERY PLAN " + query).fetchall()

query = "SELECT * FROM quotes WHERE symbol = 'TSLA' AND ts > 4000"
before = plan_for(query)
print("query plan with NO index:")
for row in before:
    print(" ", row[-1])

conn.execute("CREATE INDEX ix_quotes_symbol ON quotes (symbol)")
after = plan_for(query)
print("\nquery plan WITH an index on symbol:")
for row in after:
    print(" ", row[-1])

before_text = " ".join(r[-1] for r in before)
after_text = " ".join(r[-1] for r in after)
print("\nplan changed from a full SCAN to an index SEARCH:",
      "SCAN" in before_text and "SEARCH" in after_text)
conn.close()
