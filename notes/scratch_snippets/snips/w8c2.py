import numpy as np
np.seterr(all="ignore")
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE instruments (symbol TEXT PRIMARY KEY, sector TEXT);
    CREATE TABLE fills (id INTEGER PRIMARY KEY, symbol TEXT, qty INTEGER, price REAL);
""")
conn.executemany("INSERT INTO instruments VALUES (?, ?)", [
    ("AAPL", "tech"), ("MSFT", "tech"), ("XOM", "energy"),
])
conn.executemany("INSERT INTO fills (symbol, qty, price) VALUES (?, ?, ?)", [
    ("AAPL", 100, 190.0), ("AAPL", 50, 191.0),
    ("MSFT", 30, 420.0), ("XOM", 200, 110.0),
    ("TSLA", 20, 250.0),   # a fill for a symbol never added to instruments
])
conn.commit()

rows = conn.execute("""
    SELECT i.sector, SUM(f.qty) AS total_qty, ROUND(SUM(f.qty * f.price) / SUM(f.qty), 2) AS vwap
    FROM fills f
    JOIN instruments i ON i.symbol = f.symbol
    GROUP BY i.sector
    ORDER BY total_qty DESC
""").fetchall()

print("an INNER JOIN silently drops any fill with no matching instrument row:")
for sector, qty, vwap in rows:
    print(f"  {sector}: qty={qty}  vwap={vwap}")

orphan = conn.execute("""
    SELECT f.symbol FROM fills f LEFT JOIN instruments i ON i.symbol = f.symbol
    WHERE i.symbol IS NULL
""").fetchall()
print("\na LEFT JOIN surfaces the fill the INNER JOIN silently dropped:", orphan)
conn.close()
