import numpy as np
np.seterr(all="ignore")
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        symbol TEXT NOT NULL,
        qty INTEGER NOT NULL CHECK (qty > 0),
        side TEXT NOT NULL CHECK (side IN ('buy', 'sell'))
    )
""")

good_rows = [("AAPL", 100, "buy"), ("MSFT", 50, "sell")]
conn.executemany("INSERT INTO orders (symbol, qty, side) VALUES (?, ?, ?)", good_rows)
conn.commit()
print("inserted", conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0], "valid rows")

bad_rows = [
    ("AAPL", -10, "buy"),
    ("AAPL", 10, "short"),
    (None, 10, "buy"),
]
for row in bad_rows:
    try:
        conn.execute("INSERT INTO orders (symbol, qty, side) VALUES (?, ?, ?)", row)
        conn.commit()
        print("unexpectedly inserted:", row)
    except sqlite3.IntegrityError as exc:
        print(f"rejected {row}: {exc}")

print("\nfinal row count (bad rows never landed):",
      conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0])
conn.close()
