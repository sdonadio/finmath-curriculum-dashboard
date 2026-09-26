import numpy as np
np.seterr(all="ignore")
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE ledger (account TEXT PRIMARY KEY, balance INTEGER NOT NULL CHECK (balance >= 0))")
conn.executemany("INSERT INTO ledger VALUES (?, ?)", [("alice", 100), ("bob", 50)])
conn.commit()

def transfer(conn, frm, to, amount):
    conn.execute("BEGIN")
    try:
        conn.execute("UPDATE ledger SET balance = balance - ? WHERE account = ?", (amount, frm))
        conn.execute("UPDATE ledger SET balance = balance + ? WHERE account = ?", (amount, to))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        conn.rollback()
        return False

ok = transfer(conn, "alice", "bob", 30)
print("transfer 1 (alice->bob, 30) ok:", ok)
print("balances:", dict(conn.execute("SELECT account, balance FROM ledger").fetchall()))

ok2 = transfer(conn, "alice", "bob", 1000)
print("\ntransfer 2 (alice->bob, 1000) ok:", ok2)
print("balances after the FAILED transfer (unchanged, rolled back):",
      dict(conn.execute("SELECT account, balance FROM ledger").fetchall()))
conn.close()
