"""Week 2 and week 3 extensions of FINM 33500, imported by tools/gen_finm_33500.py.

Added 2026-10-09, the day session 1 was taught: the class covered threading and
multiprocessing, which the dashboard's week 2 lacked, and session 2 (2026-10-16)
is networking and trading protocols. Everything here is appended to the weeks
built by the generator; apply() is called just before the course is emitted.

    week 2  +6 concepts (GIL, Thread/Lock race, Queue/Event, thread vs process
            pools, start methods and pickling, which model per component),
            +1 widget (concurrency-timeline), 2 new pitfalls, 4 new MCQs
    week 3  +9 concepts (OSI vs TCP/IP, joining a Wi-Fi network, IP/routing/NAT,
            TCP vs UDP and Nagle, a framed TCP server/client in two processes,
            UDP multicast with A/B arbitration, websockets, FIX, binary feeds),
            +2 widgets (packet-journey, transport-ladder), 2 new pitfalls, 4 MCQs
    course  2 interview items and 8 glossary terms (see apply() for what they replace)

Unlike the rest of the generator's snippets, SEVERAL OF THESE PRINT REAL WALL-CLOCK
TIMINGS on purpose (w2c6, w2c9, w2c10, w2c11, w3c9, w3c14): the point of the week is
the measured difference between threads and processes. Their stored output is the
run on the machine that built the page; `run_snippets.py --check` will report those
six as stale on any other run. Fill them with `--jobs 1`, so that no other snippet
competes for the cores while they are timed.
"""

SRC = {}

SRC["w2c6"] = r'''import numpy as np
np.seterr(all="ignore")
import sys
import time
from concurrent.futures import ThreadPoolExecutor

def io_task(_):
    time.sleep(0.15)              # a REST call or a socket read: the GIL is released while blocked

def cpu_task(_):
    s = 0
    for i in range(1_500_000):     # pure-Python arithmetic: the GIL is held throughout
        s += i * i
    return s

def run(fn, jobs, workers):
    wall, cpu = time.perf_counter(), time.process_time()
    with ThreadPoolExecutor(max_workers=workers) as ex:
        list(ex.map(fn, range(jobs)))
    return time.perf_counter() - wall, time.process_time() - cpu

gil = getattr(sys, "_is_gil_enabled", lambda: True)()
print(f"Python {sys.version_info.major}.{sys.version_info.minor} | GIL enabled: {gil} | "
      f"switch interval {sys.getswitchinterval() * 1000:.0f} ms")
run(cpu_task, 1, 1)                                   # warm-up, so neither timing pays for it
for name, fn in (("I/O-bound: sleep 150 ms", io_task), ("CPU-bound: 1.5M mult-adds", cpu_task)):
    (w1, c1), (w4, c4) = run(fn, 4, 1), run(fn, 4, 4)
    print(f"{name:<26} 4 jobs on 1 thread {w1 * 1000:4.0f} ms | on 4 threads {w4 * 1000:4.0f} ms "
          f"| speed-up x{w1 / w4:.1f} | CPU-seconds / wall-seconds {c4 / w4:.2f}")
print("threads overlap waiting, not computing: one interpreter lock, one bytecode stream at a time")
'''

SRC["w2c7"] = r'''import numpy as np
np.seterr(all="ignore")
import threading
import time

class Account:
    def __init__(self, balance):
        self.balance = balance
        self.lock = threading.Lock()
        self.approved = []

def withdraw_racy(acct, who, amount, both_checked):
    if acct.balance >= amount:          # CHECK ...
        both_checked.wait()             # (forces the bad interleaving: both threads pass the check first)
        acct.balance -= amount          # ... then ACT, on a balance the other thread is also spending
        acct.approved.append(who)

def withdraw_locked(acct, who, amount):
    with acct.lock:                     # check and act are one critical section
        if acct.balance >= amount:
            time.sleep(0.01)            # same pause as before, but nobody else can get in
            acct.balance -= amount
            acct.approved.append(who)

def two_desks(target, *extra):
    acct = Account(100)
    ts = [threading.Thread(target=target, args=(acct, who, 80) + extra) for who in ("desk A", "desk B")]
    for t in ts:
        t.start()
    for t in ts:
        t.join()
    return acct

a = two_desks(withdraw_racy, threading.Barrier(2))
print(f"no lock : balance 100, two withdrawals of 80 -> approved {len(a.approved)}, balance {a.balance}  <- overdrawn")
b = two_desks(withdraw_locked)
print(f"locked  : balance 100, two withdrawals of 80 -> approved {len(b.approved)}, balance {b.balance}")

# the same race without a Barrier: read-modify-write of a shared position, 4 threads x 2,000 fills
def fill_racy(book, n):
    for _ in range(n):
        pos = book["pos"]               # read
        time.sleep(0)                   # any call that lets another thread run (I/O, logging, a GIL switch)
        book["pos"] = pos + 1           # write: may overwrite someone else's update

def fill_locked(book, n, lock):
    for _ in range(n):
        with lock:
            pos = book["pos"]
            time.sleep(0)
            book["pos"] = pos + 1

for name, fn, extra in (("no lock", fill_racy, ()), ("locked ", fill_locked, (threading.Lock(),))):
    book = {"pos": 0}
    ts = [threading.Thread(target=fn, args=(book, 2000) + extra) for _ in range(4)]
    for t in ts:
        t.start()
    for t in ts:
        t.join()
    print(f"{name} : 8,000 fills booked -> position {'== 8000' if book['pos'] == 8000 else '< 8000, updates were lost'}")
'''

SRC["w2c8"] = r'''import numpy as np
np.seterr(all="ignore")
import queue
import threading
import time

TICKS = [(seq, round(185.45 + 0.01 * ((seq * 7) % 11 - 5), 2)) for seq in range(1, 41)]
DONE = object()                                   # a sentinel: "the feed is finished"

def feed(q, connected, stop, stats):
    connected.wait()                              # Event: block until the session is logged in
    for tick in TICKS:
        while not stop.is_set():
            try:
                if q.full():
                    stats["blocked"] += 1         # backpressure: the queue is bounded
                q.put(tick, timeout=0.05)         # time out so a stop request is noticed
                break
            except queue.Full:
                continue
        if stop.is_set():
            return
    q.put(DONE)

def strategy(q, stop, seen, kill_after=None):
    while True:
        item = q.get()
        if item is DONE:
            q.task_done()
            return
        seen.append(item)
        time.sleep(0.002)                         # deciding is slower than the feed produces
        q.task_done()
        if kill_after and len(seen) >= kill_after:
            stop.set()                            # Event as a broadcast: every thread can see it
            return

def session(kill_after=None):
    q, connected, stop = queue.Queue(maxsize=4), threading.Event(), threading.Event()
    seen, stats = [], {"blocked": 0}
    threads = [threading.Thread(target=feed, args=(q, connected, stop, stats), name="feed"),
               threading.Thread(target=strategy, args=(q, stop, seen, kill_after), name="strategy")]
    for t in threads:
        t.start()
    time.sleep(0.01)
    print(f"  before login: feed alive and waiting = {threads[0].is_alive()}, ticks consumed = {len(seen)}")
    connected.set()                               # the logon ack arrived
    for t in threads:
        t.join(timeout=2)
    return seen, stats, [t.is_alive() for t in threads]

print("full session:")
seen, stats, alive = session()
print(f"  consumed {len(seen)} ticks, in sequence order: {[s for s, _ in seen] == list(range(1, 41))}, "
      f"last {seen[-1]}")
print(f"  producer found the queue full: {stats['blocked'] > 0}  (maxsize=4 caps memory and staleness)")
print(f"  threads still alive after join: {alive}")
print("kill switch after 10 ticks:")
seen, stats, alive = session(kill_after=10)
print(f"  consumed {len(seen)} ticks; feed noticed stop and exited: {not alive[0]}; strategy exited: {not alive[1]}")
'''

SRC["w2c9"] = r'''import numpy as np
np.seterr(all="ignore")
import os
import pickle
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

N, CHUNKS = 4_000_000, 8

def partial_dot(bounds):
    """Pure-Python dot product of x[i] = i%7 and y[i] = i%5 - 1 over [lo, hi)."""
    lo, hi = bounds
    s = 0
    for i in range(lo, hi):
        s += (i % 7) * (i % 5 - 1)
    return s

def timed(label, fn):
    t = time.perf_counter()
    v = fn()
    ms = (time.perf_counter() - t) * 1000
    return label, v, ms

if __name__ == "__main__":                       # required: spawn re-imports this file in every worker
    step = N // CHUNKS
    parts = [(k * step, (k + 1) * step) for k in range(CHUNKS)]
    workers = min(CHUNKS, os.cpu_count() or 1)
    with ProcessPoolExecutor(max_workers=workers) as warm:   # pay the worker start-up once, outside the race
        list(warm.map(partial_dot, [(0, 1)] * workers))
        runs = [
            timed("1 thread, sequential", lambda: sum(map(partial_dot, parts))),
            timed(f"ThreadPoolExecutor({workers})", lambda: sum(ThreadPoolExecutor(workers).map(partial_dot, parts))),
            timed(f"ProcessPoolExecutor({workers})", lambda: sum(warm.map(partial_dot, parts))),
        ]
    t = time.perf_counter()
    with ProcessPoolExecutor(max_workers=workers) as cold:
        v = sum(cold.map(partial_dot, parts))
    runs.append(("  same, incl. pool start-up", v, (time.perf_counter() - t) * 1000))
    i = np.arange(N, dtype=np.int64)
    runs.append(timed("numpy (build + np.dot, C loops)", lambda: int(np.dot(i % 7, i % 5 - 1))))

    base = runs[0][2]
    print(f"dot product of two {N:,}-element vectors in {CHUNKS} chunks, {os.cpu_count()} cores")
    for label, v, ms in runs:
        print(f"  {label:<34} {ms:7.1f} ms   x{base / ms:5.1f}   result {v}")
    print("  all five results identical:", len({v for _, v, _ in runs}) == 1)
    print(f"  bytes pickled per task: bounds {len(pickle.dumps(parts[0]))} B, "
          f"the chunk itself {len(pickle.dumps(list(range(step)))):,} B")
'''

SRC["w2c10"] = r'''import numpy as np
np.seterr(all="ignore")
import multiprocessing as mp
import os
import re
import pickle
import socket
import sys
import threading
import time
from concurrent.futures import ProcessPoolExecutor

RISK_LIMIT = 100                                   # module-level config, as the file defines it

def report(q):
    q.put((os.getpid(), RISK_LIMIT))

def square(x):
    return x * x

if __name__ == "__main__":
    print(f"{sys.platform}: start methods {mp.get_all_start_methods()}, default {mp.get_start_method()!r}")
    RISK_LIMIT = 250                               # the parent changes it at run time
    for method in mp.get_all_start_methods():
        ctx = mp.get_context(method)
        q = ctx.Queue()
        t = time.perf_counter()
        p = ctx.Process(target=report, args=(q,))
        p.start()
        pid, seen = q.get()
        ms = (time.perf_counter() - t) * 1000
        p.join()
        how = {"fork": "a copy of the parent's memory, mid-run state included",
               "spawn": "a fresh interpreter that re-imported the file",
               "forkserver": "forked from a clean server process, file re-imported"}[method]
        print(f"  {method:<10} child pid differs: {pid != os.getpid()}  RISK_LIMIT={seen}  "
              f"first result {ms:3.0f} ms  {how}")

    # everything sent to a worker process is pickled: by value for data, by NAME for functions
    print("pickle square      ->", len(pickle.dumps(square)), "bytes (module + name, not code)")
    for label, obj in (("pickle a lambda   ", lambda x: x * x),
                       ("pickle a Lock     ", threading.Lock()),
                       ("pickle a socket   ", socket.socket(socket.AF_INET, socket.SOCK_DGRAM))):
        try:
            pickle.dumps(obj)
            print(label, "-> ok")
        except Exception as e:
            print(label, "->", type(e).__name__ + ":", re.sub(r" at 0x[0-9a-f]+", "", str(e))[:72])
        finally:
            if isinstance(obj, socket.socket):
                obj.close()
    with ProcessPoolExecutor(max_workers=2) as ex:
        print("pool.map(square)   ->", list(ex.map(square, range(5))))
        try:
            list(ex.map(lambda x: x * x, range(5)))
        except Exception as e:
            print("pool.map(lambda)   ->", type(e).__name__, "raised in the PARENT, before any work ran")
'''

SRC["w2c11"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
import time
from concurrent.futures import ProcessPoolExecutor

def fit_signal(n=6_000_000):
    """CPU-bound: a pure-Python rolling fit standing in for a model refresh (~0.15 s)."""
    s = 0.0
    for i in range(n):
        s += (i % 13) * 1e-6
    return round(s, 3)

async def feed(state, stop):
    """I/O-bound: a tick every 5 ms. The loop must keep reading the socket."""
    last = time.perf_counter()
    while not stop.is_set():
        await asyncio.sleep(0.005)
        now = time.perf_counter()
        state["worst_gap"] = max(state["worst_gap"], now - last)
        state["ticks"] += 1
        last = now

async def gateway(orders, sent):
    """One task owns the order socket: a single writer keeps orders in sequence."""
    while (o := await orders.get()) is not None:
        await asyncio.sleep(0.001)          # the send
        sent.append(o)

async def session(where, pool):
    state, stop, orders, sent = {"worst_gap": 0.0, "ticks": 0}, asyncio.Event(), asyncio.Queue(), []
    tasks = [asyncio.create_task(feed(state, stop)), asyncio.create_task(gateway(orders, sent))]
    await asyncio.sleep(0.03)
    state["worst_gap"], loop, t0 = 0.0, asyncio.get_running_loop(), time.perf_counter()
    if where == "inline in the loop":
        sig = fit_signal()                                        # blocks every task
    elif where == "asyncio.to_thread":
        sig = await asyncio.to_thread(fit_signal)                 # loop runs, but shares the GIL
    else:
        sig = await loop.run_in_executor(pool, fit_signal)        # another core, another GIL
    fit_ms = (time.perf_counter() - t0) * 1000
    for k in range(3):
        orders.put_nowait(("buy", 5, sig, k))
    await asyncio.sleep(0.03)
    stop.set()
    orders.put_nowait(None)
    await asyncio.gather(*tasks)
    return fit_ms, state["worst_gap"] * 1000, [o[3] for o in sent]

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=1) as pool:
        pool.submit(fit_signal, 10).result()                      # start the worker before the clock
        for where in ("inline in the loop", "asyncio.to_thread", "process pool"):
            fit, gap, seq = asyncio.run(session(where, pool))
            print(f"signal {where:<19} fit {fit:4.0f} ms | worst feed gap {gap:5.1f} ms (tick = 5 ms) "
                  f"| orders sent in order {seq}")
    print()
    for row in (("component", "its work", "use"),
                ("market-data feed", "waits on sockets, many streams", "asyncio: one loop, many tasks"),
                ("signal / model", "CPU: Python loops, model fits", "process pool, or numpy (releases the GIL)"),
                ("order gateway", "waits on one socket, order matters", "one asyncio task, single writer"),
                ("blocking SDK call", "waits, but has no async API", "asyncio.to_thread"),
                ("risk / kill switch", "cheap checks on every order", "inline, synchronous, before the send")):
        print(f"{row[0]:<19}{row[1]:<36}{row[2]}")
'''

SRC["w3c6"] = r'''import numpy as np
np.seterr(all="ignore")
import ipaddress
import json
import struct

def checksum16(data: bytes) -> int:
    """The Internet checksum (RFC 1071): one's-complement sum of 16-bit words."""
    if len(data) % 2:
        data += b"\0"
    s = sum(struct.unpack(f"!{len(data) // 2}H", data))
    while s >> 16:
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF

payload = json.dumps({"type": "place_order", "symbol": "AAPL", "side": "buy",
                      "quantity": 5, "price": 185.5}, separators=(",", ":")).encode()      # L7
src, dst = ipaddress.IPv4Address("192.168.1.23"), ipaddress.IPv4Address("203.0.113.10")
tcp = struct.pack("!HHIIBBHHH", 51514, 8765, 1_000_001, 7_000_001, 5 << 4, 0x18, 65535, 0, 0)  # L4: PSH+ACK
ip = struct.pack("!BBHHHBBH4s4s", 0x45, 0, 20 + len(tcp) + len(payload), 0x1c46, 0x4000, 64, 6, 0,
                 src.packed, dst.packed)                                                      # L3
ip = ip[:10] + struct.pack("!H", checksum16(ip)) + ip[12:]
eth = bytes.fromhex("f0b3ec112233") + bytes.fromhex("a4c3f0445566") + struct.pack("!H", 0x0800)  # L2
frame = eth + ip + tcp + payload

print("encapsulation, outermost first:")
for name, part in (("L2 Ethernet header", eth), ("L3 IPv4 header", ip), ("L4 TCP header", tcp),
                   ("L7 JSON payload", payload)):
    print(f"  {name:<20} {len(part):3d} B  {part[:12].hex(' ')}{' ...' if len(part) > 12 else ''}")
print(f"  frame on the wire    {len(frame):3d} B  (+4 B FCS, +20 B preamble and gap) -> "
      f"{len(payload) / len(frame):.0%} of it is your order")

# the receiver peels the layers off in the opposite order
ethertype = struct.unpack("!H", frame[12:14])[0]
ihl = (frame[14] & 0x0F) * 4
ttl, proto = frame[22], frame[23]
s_ip, d_ip = ipaddress.IPv4Address(frame[26:30]), ipaddress.IPv4Address(frame[30:34])
sport, dport, seq, ack, off_flags = struct.unpack("!HHIIH", frame[14 + ihl:14 + ihl + 14])
body = frame[14 + ihl + (off_flags >> 12) * 4:]
print("decapsulation:")
print(f"  L2 ethertype 0x{ethertype:04x} (IPv4) | L3 {s_ip} -> {d_ip} ttl={ttl} proto={proto} (TCP) "
      f"checksum ok={checksum16(frame[14:14 + ihl]) == 0}")
print(f"  L4 port {sport} -> {dport} seq={seq} ack={ack} flags=PSH|ACK | L7 {json.loads(body)['type']}")
mss = 1500 - 20 - 20
print(f"MTU 1500 -> MSS {mss}: up to {mss // len(payload)} such orders fit in one segment")

layers = [("7 Application", "Application", "HTTP, WebSocket, FIX, DNS"),
          ("6 Presentation", "Application", "TLS, JSON / SBE encoding"),
          ("5 Session", "Application", "FIX logon + seq numbers"),
          ("4 Transport", "Transport", "TCP, UDP (ports)"),
          ("3 Network", "Internet", "IP (addresses, routing)"),
          ("2 Data link", "Link", "Ethernet, 802.11 Wi-Fi (MAC)"),
          ("1 Physical", "Link", "copper, fibre, radio")]
print("OSI 7            TCP/IP 4      examples")
for osi, tcpip, ex in layers:
    print(f"{osi:<17}{tcpip:<14}{ex}")
'''

SRC["w3c7"] = r'''import numpy as np
np.seterr(all="ignore")
import struct

def dns_query(name, qid=0x3350, qtype=1):
    """A real DNS question (RFC 1035): header, then the name as length-prefixed labels."""
    header = struct.pack("!HHHHHH", qid, 0x0100, 1, 0, 0, 0)          # recursion desired, 1 question
    qname = b"".join(bytes([len(p)]) + p.encode() for p in name.split(".")) + b"\0"
    return header + qname + struct.pack("!HH", qtype, 1)              # type A, class IN

def dns_answer(query, ip, ttl=60):
    """What the resolver sends back: the question echoed, plus one A record."""
    header = struct.pack("!HHHHHH", struct.unpack("!H", query[:2])[0], 0x8180, 1, 1, 0, 0)
    rr = struct.pack("!HHHIH4s", 0xC00C, 1, 1, ttl, 4, bytes(int(o) for o in ip.split(".")))  # C00C: pointer to the name
    return header + query[12:] + rr

q = dns_query("arena.example.org")
r = dns_answer(q, "203.0.113.10")
print(f"DNS query  {len(q)} B over UDP/53: {q.hex(' ')}")
an = r[len(q):]
_, _, _, ttl, _, addr = struct.unpack("!HHHIH4s", an)
print(f"DNS answer {len(r)} B: id match {r[:2] == q[:2]}, A {'.'.join(map(str, addr))}, cache for {ttl} s")
print()

LAN, WAN = 3.0, 24.0                       # round-trip times in ms: to the access point, to the venue
steps = [
    ("802.11 scan, auth, associate", "L2", "radio frames to the AP",            2, LAN),
    ("WPA2/3 4-way handshake",       "L2", "derive the session keys",           2, LAN),
    ("DHCP discover/offer/req/ack",  "L7", "UDP 68->67 broadcast; sets L3: IP, gateway, DNS", 2, LAN),
    ("ARP who-has 192.168.1.1",      "L2", "gateway's MAC for the first hop",   1, LAN),
    ("DNS A arena.example.org",      "L7", "UDP/53 via the resolver DHCP gave", 1, WAN),
    ("TCP SYN, SYN-ACK, ACK",        "L4", "port 443, seq numbers agreed",      1, WAN),
    ("TLS 1.3 hello, keys, finished","L6", "certificate checked, keys derived", 1, WAN),
    ("HTTP GET Upgrade -> 101",      "L7", "Sec-WebSocket-Key / -Accept",       1, WAN),
    ("first WebSocket frame",        "L7", "subscribe -> book_snapshot",        1, WAN),
]
t = 0.0
print(f"{'step':<30}{'layer':<6}{'RTTs':>4}{'clock (ms)':>12}   what it buys")
for name, layer, what, rtts, rtt in steps:
    t += rtts * rtt
    print(f"{name:<30}{layer:<6}{rtts:>4}{t:>12.0f}   {what}")
cold = t
warm = sum(r * rtt for n, _, _, r, rtt in steps[4:])
print(f"cold start {cold:.0f} ms; already on the network {warm:.0f} ms; "
      f"connection reused: {steps[-1][3] * WAN:.0f} ms per request/response")
print("(a floor in round trips: real scans and DHCP add tens to hundreds of ms of waiting)")
'''

SRC["w3c8"] = r'''import numpy as np
np.seterr(all="ignore")
import ipaddress
import itertools

me = ipaddress.ip_interface("192.168.1.23/24")             # what DHCP handed the laptop
net = me.network
print(f"laptop {me.ip}  network {net}  mask {net.netmask}  broadcast {net.broadcast_address}  "
      f"usable hosts {net.num_addresses - 2}")
KINDS = [("10.0.0.0/8", "RFC 1918 private"), ("172.16.0.0/12", "RFC 1918 private"),
         ("192.168.0.0/16", "RFC 1918 private"), ("100.64.0.0/10", "carrier-grade NAT (RFC 6598)"),
         ("203.0.113.0/24", "documentation range, stands in for a public venue"),
         ("127.0.0.0/8", "loopback")]
for a in ("192.168.1.23", "10.8.4.2", "172.20.0.9", "100.64.1.1", "203.0.113.10", "8.8.8.8"):
    ip = ipaddress.ip_address(a)
    kind = next((k for n, k in KINDS if ip in ipaddress.ip_network(n)), "public, globally routed")
    print(f"  {a:<13} {kind}")

# the routing table: the MOST SPECIFIC matching prefix wins (longest-prefix match)
routes = [(ipaddress.ip_network("0.0.0.0/0"), "via 192.168.1.1 (default gateway)"),
          (ipaddress.ip_network("192.168.1.0/24"), "direct on en0 (ARP for the MAC)"),
          (ipaddress.ip_network("10.8.0.0/16"), "via utun3 (VPN)"),
          (ipaddress.ip_network("10.8.4.0/24"), "via utun3, colo subnet"),
          (ipaddress.ip_network("127.0.0.0/8"), "loopback lo0")]

def route(dst):
    d = ipaddress.ip_address(dst)
    best = max((n for n, _ in routes if d in n), key=lambda n: n.prefixlen)
    return best, dict(routes)[best]

print("routing decisions:")
for dst in ("192.168.1.1", "10.8.4.2", "10.8.9.9", "203.0.113.10", "127.0.0.1"):
    n, how = route(dst)
    print(f"  {dst:<13} matches /{n.prefixlen:<2} {str(n):<15} -> {how}")

# NAT on the home router: many private (ip, port) pairs share one public address
PUBLIC = ipaddress.ip_address("198.51.100.7")
ports, table, back = itertools.count(40001), {}, {}

def outbound(src, sport, dst, dport):
    key = (src, sport, dst, dport)
    if key not in table:
        table[key] = next(ports)
        back[(table[key], dst, dport)] = (src, sport)
    return f"{src}:{sport} -> {dst}:{dport}  becomes  {PUBLIC}:{table[key]} -> {dst}:{dport}"

def inbound(dst_port, src, sport):
    hit = back.get((dst_port, src, sport))
    return f"to {PUBLIC}:{dst_port} from {src}:{sport} -> " + (f"forwarded to {hit[0]}:{hit[1]}" if hit
                                                            else "DROPPED (no mapping: nobody inside asked)")

print("NAT:")
print(" ", outbound("192.168.1.23", 51514, "203.0.113.10", 443))
print(" ", outbound("192.168.1.40", 51514, "203.0.113.10", 443))    # same source port, other laptop
print(" ", inbound(40001, "203.0.113.10", 443))
print(" ", inbound(40002, "203.0.113.10", 443))
print(" ", inbound(40001, "198.18.0.66", 443))                      # unsolicited
'''

SRC["w3c9"] = r'''import numpy as np
np.seterr(all="ignore")
import socket
import statistics
import threading
import time

# --- 1. message boundaries: UDP keeps them, TCP does not ---------------------------------
rx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
rx.bind(("127.0.0.1", 0))
tx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
for m in (b"px=185.49", b"px=185.50", b"px=185.48"):
    tx.sendto(m, rx.getsockname())                    # no connection, no handshake: just send
print("UDP 3 sendto  -> 3 recvfrom:", [rx.recvfrom(2048)[0].decode() for _ in range(3)])
tx.close(); rx.close()

srv = socket.create_server(("127.0.0.1", 0))
cli = socket.create_connection(srv.getsockname())      # SYN, SYN-ACK, ACK happen inside this call
conn, peer = srv.accept()
for m in (b"px=185.49", b"px=185.50", b"px=185.48"):
    cli.sendall(m)
time.sleep(0.05)
print("TCP 3 sendall -> 1 recv     :", [conn.recv(2048).decode()], "(a byte stream: framing is your job)")
print("TCP_NODELAY default on a new socket:", cli.getsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY))
cli.close(); conn.close(); srv.close()

# --- 2. Nagle's rule, as a model: a small segment waits while earlier data is unacknowledged --
def write_write_read(rtt, nagle, delayed_ack=40.0):
    """Client writes a 16-byte header, then a 48-byte body, then waits for the reply.
    The server replies only once it has both; until then it delays its ACK (up to 40 ms on Linux)."""
    header_arrives = rtt / 2
    if nagle:                                          # body is small and the header is unacked:
        ack_back = header_arrives + delayed_ack + rtt / 2   # ... wait for the server's delayed ACK
        body_sent = ack_back
    else:
        body_sent = 0.0                                # TCP_NODELAY: the body leaves at once
    reply_back = body_sent + rtt / 2 + rtt / 2
    return reply_back

for rtt in (0.05, 0.5, 24.0):
    on, off = write_write_read(rtt, True), write_write_read(rtt, False)
    print(f"model, RTT {rtt:5.2f} ms: Nagle on {on:6.2f} ms, TCP_NODELAY {off:6.2f} ms  (x{on / off:,.0f})")

# --- 3. and measured on this machine's loopback -----------------------------------------------
def server(listener):
    c, _ = listener.accept()
    with c:
        while True:
            need, buf = 64, b""
            while len(buf) < need:
                chunk = c.recv(need - len(buf))
                if not chunk:
                    return
                buf += chunk
            c.sendall(b"ack")

def measured(nodelay, n=25):
    lst = socket.create_server(("127.0.0.1", 0))
    th = threading.Thread(target=server, args=(lst,), daemon=True)
    th.start()
    s = socket.create_connection(lst.getsockname())
    s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, int(nodelay))
    out = []
    for _ in range(n):
        t = time.perf_counter()
        s.sendall(b"H" * 16)
        s.sendall(b"B" * 48)
        s.recv(16)
        out.append((time.perf_counter() - t) * 1000)
    s.close(); th.join(1); lst.close()
    return statistics.median(out)

on, off = measured(False), measured(True)
print(f"measured here (loopback): Nagle on {on:.3f} ms, TCP_NODELAY {off:.3f} ms -> "
      f"{'a delayed-ACK stall' if on > 5 else 'no stall on this loopback'}")
print("set TCP_NODELAY on every order-entry socket anyway: the stall appears on real links")
'''

SRC["w3c10"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import multiprocessing as mp
import os
import socket
import struct
import time

HDR = struct.Struct("!I")                       # 4-byte big-endian length before every message

def recv_exact(sock, n):
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise ConnectionError("peer closed mid-message")
        buf += chunk
    return buf

def recv_msg(sock):
    (n,) = HDR.unpack(recv_exact(sock, HDR.size))
    return recv_exact(sock, n) if n else None    # length 0 = "goodbye"

def frame(obj):
    body = json.dumps(obj, separators=(",", ":")).encode()
    return HDR.pack(len(body)) + body

def echo_server(port_q):
    """Runs in its OWN process: bind, report the port, serve one client, echo with an ack."""
    with socket.create_server(("127.0.0.1", 0)) as lst:
        port_q.put((lst.getsockname()[1], os.getpid()))
        conn, _ = lst.accept()
        with conn:
            seq = 0
            while (raw := recv_msg(conn)) is not None:
                seq += 1
                msg = json.loads(raw)
                conn.sendall(frame({"type": "order_ack", "seq": seq, "echo": msg["symbol"],
                                    "bytes": len(raw)}))

if __name__ == "__main__":
    q = mp.Queue()
    server = mp.Process(target=echo_server, args=(q,))
    server.start()
    port, server_pid = q.get(timeout=10)
    print(f"server runs in another process: {server_pid != os.getpid()}; "
          f"listening on an OS-assigned ephemeral port: {port > 1023}")
    with socket.create_connection(("127.0.0.1", port)) as c:
        c.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        orders = [{"type": "place_order", "symbol": s, "side": "buy", "quantity": 5} for s in
                  ("AAPL", "MSFT", "NVDA", "AMZN")]
        c.sendall(frame(orders[0]) + frame(orders[1]) + frame(orders[2]))   # three messages, ONE write
        whole = frame(orders[3])
        for i in range(0, len(whole), 7):                                    # one message, many writes
            c.sendall(whole[i:i + 7])
            time.sleep(0.002)
        for _ in range(4):
            print("  client got", json.loads(recv_msg(c)))
        c.sendall(HDR.pack(0))                                               # orderly goodbye
    server.join(timeout=5)
    print(f"server exited cleanly: {server.exitcode == 0}")
'''

SRC["w3c11"] = r'''import numpy as np
np.seterr(all="ignore")
import socket
import struct

PKT = struct.Struct("!QH")             # MoldUDP64-style header: sequence number, message count
UPD = struct.Struct("!4sIq")           # one update: symbol, size, price in 1e-4 dollars
GROUPS = {"A": "239.1.1.1", "B": "239.1.1.2"}    # the same feed, published twice (A/B lines)

def receiver(group):
    r = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    r.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    r.bind(("", 0))
    mreq = struct.pack("4s4s", socket.inet_aton(group), socket.inet_aton("127.0.0.1"))
    r.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)   # IGMP join, in a real network
    r.settimeout(0.2)
    return r

def publisher():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    s.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF, socket.inet_aton("127.0.0.1"))
    s.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_LOOP, 1)
    s.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 0)       # never leave this host
    return s

updates = {seq: (b"AAPL", 100 * seq, 1_854_900 + 100 * (seq % 3)) for seq in range(1, 11)}
packet = {seq: PKT.pack(seq, 1) + UPD.pack(*u) for seq, u in updates.items()}
plan = {"A": [1, 2, 3, 4, 6, 8, 7, 9, 10],          # line A loses 5, and 7/8 arrive out of order
        "B": [1, 2, 3, 4, 5, 6, 8, 9, 10]}          # line B loses 7

def drain(sock):
    got = []
    while True:
        try:
            data, _ = sock.recvfrom(2048)
        except socket.timeout:
            return got
        seq, n = PKT.unpack_from(data)
        sym, size, px = UPD.unpack_from(data, PKT.size)
        got.append((seq, size, px / 1e4))

try:
    rx = {line: receiver(g) for line, g in GROUPS.items()}
    tx = publisher()
    for line, seqs in plan.items():
        for seq in seqs:
            tx.sendto(packet[seq], (GROUPS[line], rx[line].getsockname()[1]))
    arrived = {line: drain(sock) for line, sock in rx.items()}
    for sock in list(rx.values()) + [tx]:
        sock.close()
    how = "real IP multicast on the loopback interface"
except OSError as e:                                 # no multicast route on this host
    arrived = {line: [(s, updates[s][1], updates[s][2] / 1e4) for s in seqs] for line, seqs in plan.items()}
    how = f"simulated ({type(e).__name__}: multicast unavailable here)"
print("transport:", how)

for line in "AB":
    seqs, expect, gaps = [s for s, _, _ in arrived[line]], 1, []
    for s in seqs:
        if s > expect:
            gaps.append(list(range(expect, s)))
        expect = max(expect, s + 1)
    late = [g for g in gaps if all(x in seqs for x in g)]
    lost = [x for x in range(1, 11) if x not in seqs]
    print(f"line {line} arrived {seqs}  gaps opened {gaps}  filled late {late}  lost {lost}")

# arbitration: take each sequence number from whichever line delivers it first
book, src = {}, {}
for line in "AB":
    for s, size, px in arrived[line]:
        if s not in book:
            book[s], src[s] = (size, px), line
missing = [s for s in range(1, 11) if s not in book]
print("A/B arbitration ->", "".join(src[s] for s in sorted(book)), "| still missing:", missing or "none")

# if BOTH lines had lost a packet: ask the retransmission (gap-fill) server, then apply in order
lost_on_both = [5]
refill = {s: updates[s] for s in lost_on_both}
print(f"if both lines lose seq 5, ask the gap-fill server: {lost_on_both} -> {[(s, u[1], u[2] / 1e4) for s, u in refill.items()]}")
print("apply strictly in sequence; never skip a gap and keep trading on the book")
'''

SRC["w3c12"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
import base64
import hashlib
import json

try:
    import websockets
    from websockets.asyncio.client import connect
    from websockets.asyncio.server import serve
except ImportError:                                   # the dashboard's run had it; say so if yours does not
    websockets = None

GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

async def venue(ws):
    """A stub of the arena's market-data + order endpoint: JSON text frames, typed by `type`."""
    seq = 0
    async for raw in ws:
        msg = json.loads(raw)
        if msg["type"] == "subscribe":
            for px in (185.48, 185.49, 185.47):
                seq += 1
                await ws.send(json.dumps({"type": "book_snapshot", "seq": seq, "symbol": msg["symbol"],
                                          "bid": px, "ask": round(px + 0.02, 2)}))
        elif msg["type"] == "place_order":
            seq += 1
            await ws.send(json.dumps({"type": "order_ack", "seq": seq, "symbol": msg["symbol"],
                                      "status": "accepted"}))

async def bot(port):
    async with connect(f"ws://127.0.0.1:{port}") as ws:
        key = ws.request.headers["Sec-WebSocket-Key"]
        accept = ws.response.headers["Sec-WebSocket-Accept"]
        expected = base64.b64encode(hashlib.sha1((key + GUID).encode()).digest()).decode()
        print(f"HTTP {ws.response.status_code} {ws.response.reason_phrase}: Upgrade={ws.response.headers['Upgrade']}, "
              f"Sec-WebSocket-Accept verified: {accept == expected}")
        await ws.send(json.dumps({"type": "subscribe", "symbol": "AAPL"}))
        for _ in range(3):
            m = json.loads(await ws.recv())
            print(f"  <- {m['type']:<13} seq={m['seq']} bid={m['bid']} ask={m['ask']}")
        await ws.send(json.dumps({"type": "place_order", "symbol": "AAPL", "side": "buy",
                                  "quantity": 5, "price": 185.49}))
        m = json.loads(await ws.recv())
        print(f"  <- {m['type']:<13} seq={m['seq']} status={m['status']}")
        pong = await ws.ping()                       # a control frame: the keep-alive / dead-peer check
        rtt = await pong
        print(f"ping/pong round trip under 50 ms: {rtt < 0.05}")
    print(f"closed with code {ws.close_code} (1000 = normal closure)")

async def main():
    async with serve(venue, "127.0.0.1", 0) as server:
        port = server.sockets[0].getsockname()[1]
        await bot(port)

if websockets is None:
    print("websockets is not installed: pip install websockets (the handshake itself is week 4's snippet)")
else:
    print("websockets", websockets.__version__)
    asyncio.run(main())
'''

SRC["w3c13"] = r'''import numpy as np
np.seterr(all="ignore")

SOH = "\x01"

def fix(msg_type, seq, body, sender="TEAM07", target="ARENA", when="20261016-14:30:00.000"):
    """Build a FIX 4.4 message: BodyLength (9) counts the bytes after itself up to the checksum
    field; CheckSum (10) is the byte sum mod 256, three digits."""
    fields = [("35", msg_type), ("49", sender), ("56", target), ("34", str(seq)), ("52", when)] + body
    inner = "".join(f"{t}={v}{SOH}" for t, v in fields)
    head = f"8=FIX.4.4{SOH}9={len(inner)}{SOH}"
    cks = sum((head + inner).encode()) % 256
    return f"{head}{inner}10={cks:03d}{SOH}"

def parse(raw):
    pairs = [f.split("=", 1) for f in raw.split(SOH) if f]
    tags = dict(pairs)
    body_start = raw.index(f"{SOH}35=") + 1
    trailer = raw.rindex(f"{SOH}10=") + 1
    ok_len = int(tags["9"]) == len(raw[body_start:trailer].encode())
    ok_sum = int(tags["10"]) == sum(raw[:trailer].encode()) % 256
    return tags, ok_len and ok_sum

show = lambda raw: raw.replace(SOH, "|")
NAMES = {"A": "Logon", "D": "NewOrderSingle", "8": "ExecutionReport", "0": "Heartbeat",
         "1": "TestRequest", "2": "ResendRequest", "4": "SequenceReset"}

logon = fix("A", 1, [("98", "0"), ("108", "30")])                 # no encryption, 30 s heartbeat
order = fix("D", 2, [("11", "ord-0001"), ("55", "AAPL"), ("54", "1"), ("38", "5"),
                     ("40", "2"), ("44", "185.49"), ("59", "0")])  # buy 5 AAPL limit 185.49, day
for raw in (logon, order):
    tags, ok = parse(raw)
    print(f"{NAMES[tags['35']]:<15} {len(raw):3d} B  valid={ok}  {show(raw)}")
tampered = order.replace("38=5", "38=9")
print(f"{'tampered qty':<15} {len(tampered):3d} B  valid={parse(tampered)[1]}  (checksum catches it)")

# the session layer: every message carries MsgSeqNum (34); a gap triggers a ResendRequest
print("session, venue side: expecting seq 5")
expected, log = 5, []
for seq, kind in ((5, "D"), (8, "D")):                         # 6 and 7 never arrived
    if seq > expected:
        req = fix("2", 41, [("7", str(expected)), ("16", "0")], sender="ARENA", target="TEAM07")
        log.append(f"  got 34={seq}, expected {expected} -> ResendRequest 7={expected} 16=0 (BeginSeqNo, 0 = to the end)")
        log.append(f"     {show(req)}")
        break
    log.append(f"  got 34={seq} {NAMES[kind]} -> accepted")
    expected = seq + 1
print("\n".join(log))
replay = [fix("D", 6, [("43", "Y"), ("122", "20261016-14:30:00.000"), ("11", "ord-0006"), ("55", "MSFT"),
                       ("54", "2"), ("38", "3"), ("40", "1")]),
          fix("4", 7, [("43", "Y"), ("123", "Y"), ("36", "8")])]   # 7 was a heartbeat: skip it
for raw in replay:
    t, ok = parse(raw)
    extra = " PossDupFlag=Y (resent)" if t["35"] == "D" else " GapFill to NewSeqNo=8 (admin msg not resent)"
    print(f"  client resends 34={t['34']} {NAMES[t['35']]}{extra}  valid={ok}")
print("  then 34=8 is processed; the stream is whole again")

# heartbeats: silence for HeartBtInt -> TestRequest; no Heartbeat back -> the session is dead
hb = 30
for silent in (12, 31, 62):
    act = "nothing" if silent < hb else ("send TestRequest 112=TR1" if silent < 2 * hb else "disconnect, log out")
    print(f"  {silent:2d} s since last message from peer -> {act}")
'''

SRC["w3c14"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import struct
import time

# ITCH 5.0 "Add Order" (type A): fixed offsets, big-endian, 36 bytes, no field names on the wire
ITCH_ADD = struct.Struct("!cHH6sQcI8sI")
def itch_add(locate, ns, ref, side, shares, stock, px):
    return ITCH_ADD.pack(b"A", locate, 0, ns.to_bytes(6, "big"), ref, side, shares,
                         stock.ljust(8).encode(), round(px * 10_000))       # price: 4 implied decimals

msg = itch_add(locate=13, ns=34_200_000_000_123, ref=880_001, side=b"B", shares=500, stock="AAPL", px=185.49)
t, loc, _, ts, ref, side, sh, stock, px = ITCH_ADD.unpack(msg)
print(f"ITCH Add Order {len(msg)} B: {msg.hex(' ')}")
ns = int.from_bytes(ts, "big")
hms = f"{ns // 3_600_000_000_000:02d}:{ns // 60_000_000_000 % 60:02d}:{ns // 1_000_000_000 % 60:02d}.{ns % 1_000_000_000:09d}"
print(f"  decoded: type={t.decode()} ref={ref} {side.decode()} {sh} {stock.decode().strip()} @ {px / 1e4} at {hms}")

# SBE (CME MDP 3.0 style): an 8-byte header naming the template, then a fixed little-endian block
SBE_HDR, SBE_BODY = struct.Struct("<HHHH"), struct.Struct("<iqiB3x")
body = SBE_BODY.pack(4321, 185_490_000_000, 500, 1)                          # price mantissa, exponent -9
sbe = SBE_HDR.pack(SBE_BODY.size, 46, 1, 9) + body                           # blockLength, templateId, schema, version
bl, tid, sid, ver = SBE_HDR.unpack_from(sbe)
print(f"SBE message {len(sbe)} B: template {tid} v{ver}, block {bl} B -> "
      f"{SBE_BODY.unpack_from(sbe, 8)[1] / 1e9} (read in place, no parsing pass)")

# FAST: stop-bit integers (7 bits per byte, high bit ends the field) plus delta against the last value
def stop_bit(n):
    out = []
    while True:
        out.append(n & 0x7F)
        n >>= 7
        if (n == 0 and not out[-1] & 0x40) or (n == -1 and out[-1] & 0x40):
            break
    out.reverse()
    out[-1] |= 0x80
    return bytes(out)

prices = [1_854_900, 1_854_900, 1_855_000, 1_854_800, 1_854_900]
full = b"".join(stop_bit(p) for p in prices)
delta = b"".join(stop_bit(p - q) for p, q in zip(prices, [0] + prices[:-1]))
print(f"FAST 5 prices: absolute {len(full)} B, delta-coded {len(delta)} B  ({delta.hex(' ')})")

as_json = json.dumps({"type": "add_order", "ref": 880001, "side": "buy", "shares": 500,
                      "symbol": "AAPL", "price": 185.49, "ts": 34200000000123}).encode()
as_fix = ("8=FIX.4.4|9=..|35=X|268=1|279=0|269=0|55=AAPL|270=185.49|271=500|37=880001|10=...|").encode()
print(f"one add-order: ITCH {len(msg)} B | SBE {len(sbe)} B | FIX tag=value ~{len(as_fix)} B | "
      f"JSON {len(as_json)} B")

N = 200_000
blob_bin = msg * N
blob_json = [as_json] * N
t0 = time.perf_counter()
n_bin = sum(1 for _ in ITCH_ADD.iter_unpack(blob_bin))
t1 = time.perf_counter()
n_json = sum(1 for m in blob_json if json.loads(m))
t2 = time.perf_counter()
print(f"decode {N:,}: struct {(t1 - t0) * 1e3:6.1f} ms ({(t1 - t0) / N * 1e9:4.0f} ns/msg) | "
      f"json.loads {(t2 - t1) * 1e3:6.1f} ms ({(t2 - t1) / N * 1e9:4.0f} ns/msg) -> x{(t2 - t1) / (t1 - t0):.0f}")
'''



def _code(key):
    return {"lang": "python", "src": SRC[key], "output": ""}


# ═══ Week 2 additions · threads and processes ═══

W2_TOPICS = [
    "the GIL: I/O-bound versus CPU-bound work, measured",
    "threading.Thread, Lock and the check-then-act race",
    "queue.Queue and threading.Event: the producer-consumer handoff and a clean shutdown",
    "ThreadPoolExecutor versus ProcessPoolExecutor on the same job",
    "multiprocessing start methods (fork, spawn, forkserver) and pickling",
    "threads, processes or asyncio: one choice per component (feed, signal, gateway)",
]

W2_CONCEPTS = [
    {
        "name": "The GIL: four threads finish four sleeps in the time of one, but not four loops",
        "explain": (
            "<p>CPython runs bytecode under a global interpreter lock, the GIL: one mutex that a thread must hold to execute Python code. Only one thread runs Python at any instant, whatever the core count. A thread gives the lock up in two situations: when it blocks in a system call (a socket read, a file read, <code>time.sleep</code>, most C extensions doing long work), and every <em>switch interval</em> (5 ms by default, <code>sys.getswitchinterval()</code>) when another thread is waiting for it.</p>"
            "<p>So the question is never \"threads or not\" but \"where does the time go\". The snippet measures both cases on four jobs, first on one worker thread and then on four. Four 150 ms sleeps take about 620 ms on one thread and about 155 ms on four: the waits overlap because a sleeping thread holds no lock, and the process used almost no CPU. Four pure-Python loops of 1.5 million multiply-adds take about as long on four threads as on one: the speed-up stays close to 1, and CPU-seconds per wall-second stay at 1.00, which means one core was busy at a time. The threads took turns.</p>"
            "<p>The rule that falls out: an <strong>I/O-bound</strong> job (waiting on the network, the disk or a broker API) gets faster with threads or with asyncio; a <strong>CPU-bound</strong> job in pure Python does not, and needs processes, vectorised numpy (which releases the GIL inside its C loops) or compiled code. Python 3.13 introduced an optional free-threaded build without the GIL (PEP 703), officially supported since 3.14 but still a separate build: the default interpreter that ran this snippet reports <code>GIL enabled: True</code>. In a trading bot the market-data reader and the order gateway are I/O-bound; a model refit is CPU-bound.</p>"
        ),
        "code": _code("w2c6"),
    },
    {
        "name": "threading.Thread and Lock: the bank-balance race and the check-then-act bug",
        "explain": (
            "<p><code>threading.Thread(target=fn, args=...)</code> runs <code>fn</code> concurrently with the main thread; <code>start()</code> launches it and <code>join()</code> waits for it to finish. Threads share the whole heap, which makes them cheap to talk between and dangerous: any object two threads touch is shared state, and the GIL does not make your logic atomic. It guarantees that one bytecode runs at a time, not that your three lines run together.</p>"
            "<p>The snippet's account holds 100 and two desks each withdraw 80. The racy version checks <code>balance &gt;= amount</code>, then subtracts. A <code>Barrier</code> forces the interleaving that a busy machine eventually produces by itself: both threads pass the check before either acts. Both withdrawals are approved and the balance ends at -60. Wrapping check and act in <code>with acct.lock:</code> makes them one critical section: the second desk waits, sees 20 and is refused. The second half shows the lost update. Four threads book 2,000 fills each as read, yield, write, where <code>time.sleep(0)</code> stands in for anything that lets another thread run between the read and the write (a log call, an I/O call, the switch interval). Without the lock the position ends below 8,000; with it, exactly 8,000.</p>"
            "<p>Four rules keep you out of trouble. Protect every invariant with one lock held across the whole check-then-act. Keep critical sections short, and never do I/O inside one. When you need several locks, always take them in the same order, or two threads will deadlock. Best of all, share nothing and hand data between threads through a queue. The same race on a position limit comes back under asyncio in week 3, where the danger point is an <code>await</code> rather than any line.</p>"
        ),
        "code": _code("w2c7"),
    },
    {
        "name": "Queue and Event: handing ticks from a feed thread to a strategy thread",
        "explain": (
            "<p>The safest way for threads to cooperate is to share nothing but a queue. <code>queue.Queue</code> is a thread-safe FIFO with its own lock and condition variables: <code>put</code> and <code>get</code> block when the queue is full or empty, so the producer cannot get more than <code>maxsize</code> items ahead of the consumer, and nobody busy-waits. <code>threading.Event</code> is the other primitive: a flag that one thread sets and any number of threads wait on. That is how you tell everybody at once \"logged in\", \"stop\" or \"kill switch tripped\".</p>"
            "<p>The snippet wires a feed thread to a strategy thread through <code>Queue(maxsize=4)</code>. The feed starts first and blocks on the <code>connected</code> event until the main thread sets it (the logon ack), so no tick is consumed before login. Then the strategy, deliberately slower at 2 ms per decision, receives all 40 ticks in sequence order. The producer found the queue full and had to wait: that is backpressure, and the bound caps both memory and staleness. A sentinel object marks the end of the stream so the consumer exits, and both threads are dead after <code>join</code>. In the second run the strategy trips the kill switch after 10 ticks. The feed calls <code>put(..., timeout=0.05)</code> and checks the event between attempts, so it notices and exits instead of blocking forever on a full queue.</p>"
            "<p>This is the threaded twin of the asyncio queue in week 3 and of the multiprocessing queues below: a bounded handoff, a sentinel for the end, an event for shutdown, and a timeout on every blocking call so that shutdown cannot hang. Daemon threads that nobody joins are how bots die at the close with orders half sent.</p>"
        ),
        "code": _code("w2c8"),
    },
    {
        "name": "ThreadPoolExecutor against ProcessPoolExecutor: one dot product, timed",
        "explain": (
            "<p><code>concurrent.futures</code> gives threads and processes the same interface: <code>with Executor(max_workers=n) as ex</code>, then <code>ex.map(fn, items)</code>, or <code>ex.submit(fn, x)</code> for a future. That makes the comparison fair, because only the executor changes. The snippet splits the dot product of two 4-million-element vectors into eight chunks and computes each chunk in pure Python, which is CPU-bound and holds the GIL.</p>"
            "<p>The timings are real, measured on the machine that built this page. Sequentially the job takes about 145 ms, and eight threads take the same, because only one of them can run bytecode at a time. Eight worker processes, each with its own interpreter and its own GIL, finish in about a fifth of that, a four- to five-fold speed-up on ten cores. The next line is the catch. A cold pool, counting its own start-up, is no faster than one thread, because starting eight interpreters under <code>spawn</code> costs about as much as the whole job. Pools pay off when you create them once and reuse them. The last line puts both in perspective: numpy builds the two vectors and takes the dot product in C, on one core, about ten times faster than the Python loop and faster than eight processes.</p>"
            "<p>Two design rules follow. First, ship small descriptions of work, not data: each worker receives a 21-byte <code>(lo, hi)</code> tuple, while pickling the chunk itself would cost 2.4 MB per task, and every byte crosses a pipe in each direction it travels. Second, vectorise before you parallelise. A process pool divides your per-element cost by the number of cores at best; numpy removes most of it.</p>"
        ),
        "code": _code("w2c9"),
    },
    {
        "name": "multiprocessing start methods and pickling: what a child process can see",
        "explain": (
            "<p>A process pool is not threads under another name. Every worker is a separate interpreter with its own memory, and how it is born decides what it inherits. <code>fork</code> copies the parent's address space, so the child starts with every variable the parent had at that instant. <code>spawn</code> (the default on macOS and Windows) starts a fresh interpreter and re-imports your main module. That is why the <code>if __name__ == \"__main__\":</code> guard is mandatory: without it every child would start the pool again. <code>forkserver</code> forks each child from a clean server process started early. Python 3.14 made it the default on Linux, because forking a parent that already runs threads can copy a lock in its locked state and deadlock the child.</p>"
            "<p>The snippet makes the difference visible. The file sets <code>RISK_LIMIT = 100</code>, then the parent changes it to 250 at run time. Under <code>fork</code> the child reports 250 and answers within a few milliseconds. Under <code>spawn</code> and <code>forkserver</code> it reports 100, the value the module defines, and takes tens of milliseconds to start. Configuration that matters must be passed as an argument, not left in a mutated global.</p>"
            "<p>Everything that crosses the process boundary is pickled. A module-level function pickles as a 34-byte reference (module and name), and the child imports it. A lambda cannot be pickled at all, and neither can a lock or a socket, because they are handles to resources that live in this process. <code>pool.map(lambda ...)</code> therefore fails in the parent before any work runs. Pass top-level functions and plain data, and let each worker open its own connections.</p>"
        ),
        "code": _code("w2c10"),
    },
    {
        "name": "Threads, processes or asyncio: one choice per component of a trading system",
        "explain": (
            "<p>A trading system is not one kind of workload, so it does not get one concurrency model. Ask what each component spends its time on. The market-data feed waits on sockets almost all the time and must never stop reading: that is asyncio, one event loop running many cheap tasks. The order gateway also waits on a socket, but order matters, so one task owns the connection and everything else hands it orders through a queue: a single writer. The signal or model refit burns CPU in Python, so it goes to a process pool, or into numpy, which releases the GIL. A blocking SDK with no async API (yfinance in this course) runs in <code>asyncio.to_thread</code>. Pre-trade risk checks are cheap and belong in the order path: synchronous, inline, before the send.</p>"
            "<p>The snippet runs the same session three ways while a feed task ticks every 5 ms. With the model fit called inline, the worst gap between feed ticks equals the length of the fit, about 155 ms: the loop was frozen and every tick in that window was read late. Under <code>to_thread</code> the loop keeps running but competes with the CPU thread for the GIL, and its worst gap is about 20 ms, four ticks. In a process pool the fit runs on another core under another GIL, and the feed keeps its 5 ms rhythm. In all three runs the gateway sent the orders in sequence.</p>"
            "<p>This is the architecture of the arena's bots and of most production Python trading stacks: an asyncio core for I/O, processes or native code for compute, and queues rather than shared objects between them. FINM 32700 takes the same split down to C++ threads pinned to cores.</p>"
        ),
        "code": _code("w2c11"),
    },
]

W2_WIDGET = {
    "type": "concurrency-timeline",
    "title": "The same jobs four ways: threads under the GIL, one asyncio loop, processes, free-threading",
    "params": {"tasks": 4, "cpu_share": 0.6, "cores": 4, "mode": "threads", "bursts": 3,
               "quantum": 5, "spawn": 10, "seed": 33502},
}

W2_PITFALLS_NEW = [
    "Using threads to speed up pure-Python number crunching. Under the GIL they take turns; measure first, then use a process pool or numpy.",
    "Check-then-act on shared state without one lock around both steps (the overdraft race), or handing a process pool lambdas, locks or sockets: they cannot be pickled, and without the __main__ guard spawn re-runs your script in every child.",
]

W2_CHECK = [
    {
        "q": "A bot runs four pure-Python feature calculations of about 100 ms of CPU each on ThreadPoolExecutor(4), on an 8-core laptop with the standard CPython build. About how long does the batch take?",
        "options": [
            "About 25 ms: four threads on four cores",
            "About 100 ms: they run in parallel",
            "About 400 ms: only one thread executes Python bytecode at a time",
            "About 800 ms: threads double the cost",
        ],
        "answer": 2,
        "why": "CPU-bound pure Python serialises on the GIL; threads overlap only waiting. The snippet's speed-up for CPU work was about 1. Use processes or numpy.",
    },
    {
        "q": "Two threads run `if acct.balance >= 80: acct.balance -= 80` on a balance of 100. Which fix is correct?",
        "options": [
            "None needed: the GIL makes each line atomic",
            "Hold one Lock across both the check and the subtraction",
            "Put a Lock around the subtraction only",
            "Call time.sleep(0) between the two lines",
        ],
        "answer": 1,
        "why": "The invariant spans two steps. Locking only the subtraction still lets both threads pass the check; one lock around check-then-act refuses the second withdrawal.",
    },
    {
        "q": "On macOS (start method spawn), ProcessPoolExecutor().map(lambda x: 2 * x, data) fails before any work runs. Why?",
        "options": [
            "Lambdas are too slow to send to a process",
            "The function and its arguments are pickled to reach the worker, and a lambda cannot be pickled by name",
            "spawn can only start one worker at a time",
            "The GIL forbids lambdas in child processes",
        ],
        "answer": 1,
        "why": "Functions are pickled as module + name and imported by the child. A lambda has no importable name; use a module-level def.",
    },
    {
        "q": "Which assignment of concurrency models fits a Python trading bot best?",
        "options": [
            "Feed in a process pool, model refit on the event loop, several threads writing to the order socket",
            "Feed as asyncio tasks, model refit in a process pool, one task owning the order socket",
            "Everything in threads, since the GIL makes them safe",
            "Everything inline in on_tick, for determinism",
        ],
        "answer": 1,
        "why": "I/O-bound feeds suit one event loop; CPU-bound refits need another core and another GIL; a single writer keeps orders in sequence.",
    },
]


# ═══ Week 3 additions · networking and trading protocols ═══

W3_TOPICS = [
    "the OSI 7 layers and the TCP/IP 4; encapsulation, byte by byte",
    "joining a network: association, DHCP, ARP, DNS, then TCP, TLS, the HTTP upgrade and WebSocket",
    "IP addressing, longest-prefix routing and NAT",
    "TCP versus UDP: handshake, sequence and acknowledgement numbers, Nagle and TCP_NODELAY",
    "sockets in Python: a framed TCP server and client in two processes, UDP multicast",
    "WebSockets with the websockets library",
    "trading protocols: FIX sessions, ITCH/OUCH binary feeds, SBE and FAST, multicast gap fill, compared with the arena's JSON over WebSocket",
]

W3_CONCEPTS = [
    {
        "name": "OSI's seven layers and TCP/IP's four: encapsulation, byte by byte",
        "explain": (
            "<p>The OSI model splits networking into seven layers: physical, data link, network, transport, session, presentation and application. The Internet runs on a four-layer model, link, internet (IP), transport (TCP or UDP) and application, with OSI's top three folded into one. The names matter less than the principle both share: each layer puts its own header in front of the data it is handed and talks only to the same layer on the other side. That is encapsulation, and the receiver undoes it in reverse.</p>"
            "<p>The snippet builds a real frame for one arena order. The 78-byte JSON message is the application payload. TCP prepends 20 bytes (ports 51514 and 8765, sequence and acknowledgement numbers, the PSH and ACK flags). IPv4 prepends 20 more: addresses, TTL 64, protocol 6 for TCP, and a header checksum computed with the RFC 1071 algorithm. Ethernet prepends 14: two MAC addresses and the type 0x0800 for IPv4. The 132-byte frame is 59% order and 41% envelope, before the preamble and the frame check sequence. Decapsulation reads the same bytes back at fixed offsets, and the checksum verifies.</p>"
            "<p>Two numbers to keep. The MTU, the largest IP packet a link carries, is 1,500 bytes on Ethernet, so a TCP segment holds at most 1,460 bytes of payload (the MSS), or 18 of these orders. And the layers are a model, not a law: TLS sits between TCP and HTTP, WebSocket frames add 2 to 14 bytes of their own, Wi-Fi uses an 802.11 header in the air that the access point swaps for Ethernet, and FIX defines its own session layer with logons and sequence numbers. The packet-journey widget below walks one message across those hops.</p>"
        ),
        "code": _code("w3c6"),
    },
    {
        "name": "You connect to the Wi-Fi: everything that happens before your first WebSocket message",
        "explain": (
            "<p>Open the laptop at the start of class and run the bot. Before one byte of market data arrives, eight protocols run in order, each solving one problem. <strong>Association</strong>: the laptop scans, authenticates and associates with the access point at layer 2, then the WPA2 or WPA3 four-way handshake derives the keys that encrypt the radio link. <strong>DHCP</strong>: the laptop has no IP address yet, so it broadcasts a UDP Discover from port 68 to port 67; the router offers an address, the laptop requests it and the router acknowledges, handing over the address, the subnet mask, the default gateway and the DNS resolver. <strong>ARP</strong>: to send anything off the subnet the laptop needs the gateway's MAC address, so it broadcasts \"who has 192.168.1.1?\" and caches the answer. <strong>DNS</strong>: it asks the resolver for the venue's A record over UDP port 53. The snippet builds that 35-byte query by hand and parses a 51-byte answer with a 60-second TTL.</p>"
            "<p>Then the connection itself. <strong>TCP</strong>: SYN, SYN-ACK, ACK, one round trip that agrees the initial sequence numbers. <strong>TLS 1.3</strong>: one more round trip to check the server's certificate and derive session keys. <strong>HTTP</strong>: a GET carrying <code>Upgrade: websocket</code> and a <code>Sec-WebSocket-Key</code>, answered by <code>101 Switching Protocols</code>. <strong>WebSocket</strong>: from then on, framed messages in both directions over the same TCP connection.</p>"
            "<p>The snippet counts round trips: about 21 ms on the local network, then 120 ms more to a venue 24 ms away, so 141 ms at best from lid-open to the first book snapshot, and far more in practice because scanning and DHCP involve waiting. After that, each request costs one round trip. That is why bots keep connections open and reconnect deliberately, and why DNS answers are cached.</p>"
        ),
        "code": _code("w3c7"),
    },
    {
        "name": "IP addresses, routing and NAT: why the venue can answer you but cannot call you",
        "explain": (
            "<p>An IPv4 address is 32 bits, written as four bytes, and a prefix length says how many leading bits name the network. The laptop's <code>192.168.1.23/24</code> lives on network 192.168.1.0, with 254 usable hosts and broadcast address 192.168.1.255. Anything on that subnet is reached directly, after ARP finds its MAC; anything else goes to the default gateway. RFC 1918 reserves three blocks for private networks (10/8, 172.16/12 and 192.168/16), carriers use 100.64/10 for their own NAT layer, and none of them is routed on the public Internet.</p>"
            "<p>Routing is a table lookup with one rule: the longest matching prefix wins. In the snippet, 10.8.4.2 matches both the VPN's /16 and the colo subnet's /24, and the /24 wins; 203.0.113.10 matches only the /0 default route and leaves through the gateway; 127.0.0.1 never leaves the machine. Every router on the path does the same lookup in its own table and decrements the TTL, so a routing loop cannot circulate a packet forever.</p>"
            "<p>Your home router also does <strong>NAT</strong>, network address translation. Two laptops can both use source port 51514: the router rewrites each outgoing flow to its single public address with a fresh port (40001, 40002) and remembers the mapping, so the venue's replies find their way back. A packet arriving at a public port that nobody inside asked for has no mapping and is dropped. That is why your bot always dials the venue and never the reverse, why the venue keeps the connection open to push data to you, and why a NAT that silently expires an idle mapping kills a quiet connection: one more reason for the heartbeats of week 4.</p>"
        ),
        "code": _code("w3c8"),
    },
    {
        "name": "TCP against UDP: a reliable byte stream or fire-and-forget datagrams, and Nagle in between",
        "explain": (
            "<p>TCP gives an application a reliable, ordered byte stream. It opens with a handshake (SYN, SYN-ACK, ACK) that agrees initial sequence numbers. Every byte then has a sequence number, the receiver acknowledges what it has, and anything unacknowledged after a timeout is sent again. Flow control (the receive window) and congestion control stop the sender from flooding the path. The price is latency at bad moments: a lost segment holds back every byte behind it until the retransmission arrives (head-of-line blocking), and the stream has no message boundaries. UDP is the opposite: datagrams, no connection, no retransmission, no ordering, and each <code>recvfrom</code> returns exactly one whole datagram. The snippet's first lines show both: three <code>sendto</code> calls arrive as three datagrams, while three <code>sendall</code> calls on TCP come back as one 27-byte read.</p>"
            "<p>Nagle's algorithm (RFC 896) is TCP's defence against tiny packets: while earlier data is unacknowledged, small writes are held back and coalesced. Combined with the receiver's delayed ACK, a write-write-read pattern (header, body, wait for the reply) stalls until the delayed-ACK timer fires, up to 40 ms on Linux. The snippet's model prints the cost: on a 50-microsecond path the request takes 40 ms instead of 0.05. Measured on this machine's loopback the stall does not appear, because the kernel acknowledged at once; links between machines behave like the model. <code>TCP_NODELAY</code> is off on a new socket, so set it on every order-entry connection, and write each message with one call.</p>"
            "<p>Exchanges usually publish market data as UDP multicast, where speed matters more than any single packet and recovery is done with sequence numbers. Order entry runs over TCP, where every message must arrive, once and in order.</p>"
        ),
        "code": _code("w3c9"),
    },
    {
        "name": "A TCP echo server and client in two processes, with length-prefix framing",
        "explain": (
            "<p>Week 4 frames messages in memory; here the bytes cross a real socket between two operating-system processes. The server process calls <code>socket.create_server((\"127.0.0.1\", 0))</code>. Port 0 asks the OS for a free ephemeral port, which the server reports back through a <code>multiprocessing.Queue</code>, and <code>accept()</code> blocks until the client connects. The client connects, sets <code>TCP_NODELAY</code>, and the two talk a framed protocol: every message is a 4-byte big-endian length followed by that many bytes of JSON, and a length of zero means goodbye.</p>"
            "<p>The test is adversarial on purpose. The client writes three orders in a single <code>sendall</code>, so one server read may hold all three; then it writes the fourth in 7-byte pieces with pauses, so the server sees fragments. <code>recv_exact</code> is what makes this work: it loops until it has exactly <code>n</code> bytes, because <code>recv(n)</code> may return fewer, and it raises if the peer closes mid-message. With it the server decodes four complete orders in sequence and acknowledges each with its own sequence number. The client reads four framed acks and sends the goodbye, and the server process exits with status 0.</p>"
            "<p>Three habits from this snippet carry straight into the arena and into any exchange gateway. Loop on <code>recv</code> until a whole message is in hand, and never assume one read is one message. Give the protocol an explicit end (here the zero length, in the arena a close frame), so that a clean shutdown can be told apart from a crash. And put the length first: a parser that knows the size before it reads can bound its buffer and reject an absurd length, instead of scanning untrusted bytes for a delimiter.</p>"
        ),
        "code": _code("w3c10"),
    },
    {
        "name": "UDP multicast for market data: sequence numbers, A/B lines and gap fill",
        "explain": (
            "<p>An exchange that publishes one feed to hundreds of subscribers cannot afford a TCP connection to each, so it sends UDP multicast: one datagram to a group address in 224.0.0.0/4, which the network copies to every port whose host joined the group (IGMP on a real network, <code>IP_ADD_MEMBERSHIP</code> in code). Delivery is not guaranteed, so the protocol on top carries a sequence number in every packet. NASDAQ's MoldUDP64 header, mimicked here, is a session, a 64-bit sequence number and a message count.</p>"
            "<p>The snippet runs real multicast on the loopback interface: one publisher and two groups, standing for the A and B lines on which venues publish the same feed over separate network paths. Line A loses packet 5 and delivers 8 before 7; line B loses 7. A receiver that tracks the next expected number opens a gap whenever a higher one arrives. On line A the gap at 7 is filled by the late arrival a moment later; the one at 5 is not. Arbitration then takes each sequence number from whichever line delivers it first, and the merged stream is complete without any retransmission, because B's copy of 5 fills A's hole. Only when both lines lose the same packet does the receiver ask the venue's retransmission (gap-fill) server, and a receiver too far behind rebuilds from a snapshot instead.</p>"
            "<p>The non-negotiable rule is the last line: apply updates strictly in sequence. An order book with a missing add or delete is wrong in a way no later message repairs, so a feed handler that detects a gap marks the book stale and stops trading on it until the gap is filled.</p>"
        ),
        "code": _code("w3c11"),
    },
    {
        "name": "WebSockets with the websockets library: the arena's transport, end to end",
        "explain": (
            "<p>The arena speaks JSON over WebSocket, and week 4 builds the handshake and the frames by hand. In production you use a library; in Python that is <code>websockets</code>, whose asyncio API is <code>serve(handler, host, port)</code> on the server and <code>async with connect(url) as ws</code> on the client. Both sides then <code>await ws.send(text)</code> and <code>await ws.recv()</code>, or iterate <code>async for raw in ws</code>, while the library handles framing, masking, fragmentation, ping and pong, and the closing handshake.</p>"
            "<p>The snippet runs a stub of the venue and a bot in one event loop. The client checks the upgrade itself: the response is <code>101 Switching Protocols</code>, and <code>Sec-WebSocket-Accept</code> equals base64(SHA-1(key + the RFC 6455 GUID)) computed from the key the client sent, which proves the server understood the WebSocket request rather than echoing headers back. The bot subscribes and gets three <code>book_snapshot</code> messages with sequence numbers 1 to 3, places an order and receives an <code>order_ack</code> with sequence 4, measures a ping round trip (a control frame, which is how either side detects a dead peer), and leaves with close code 1000, normal closure.</p>"
            "<p>What the library does not give you is your protocol: typed messages with a <code>type</code> discriminator, validation at the boundary, sequence numbers that let a bot detect a gap across a reconnect, and a heartbeat policy. Those are week 4's subject. Note also what WebSocket inherits from TCP: reliable, ordered delivery, so a gap can only come from a reconnect and never from a dropped packet; and head-of-line blocking, so one slow frame delays every frame behind it.</p>"
        ),
        "code": _code("w3c12"),
    },
    {
        "name": "FIX: tag=value messages, sequence numbers, heartbeats and resend requests",
        "explain": (
            "<p>FIX, the Financial Information eXchange protocol, is how brokers, buy-side firms and venues have exchanged orders since the 1990s. A message is a flat list of <code>tag=value</code> fields separated by the SOH byte (0x01, printed as | here). The header starts with <code>8=FIX.4.4</code> and <code>9=</code>, the BodyLength: the byte count from the next field up to the checksum. Tag <code>35</code> is the message type (A Logon, D NewOrderSingle, 8 ExecutionReport, 0 Heartbeat, 1 TestRequest, 2 ResendRequest, 4 SequenceReset); <code>49</code> and <code>56</code> name sender and target, <code>34</code> is MsgSeqNum and <code>52</code> SendingTime. The trailer <code>10=</code> is the byte sum modulo 256, in three digits. The snippet builds a Logon with a 30-second heartbeat interval (108=30) and an order to buy 5 AAPL with a 185.49 limit (54=1 buy, 38 quantity, 40=2 limit, 44 price), validates both, and shows that changing one digit of the quantity breaks the checksum.</p>"
            "<p>FIX's real contribution is its session layer. Each side numbers every message it sends, and the receiver checks for gaps. The venue in the snippet expects 6, receives 8, and sends a ResendRequest from 6 to the end (7=6, 16=0). The client resends 6 with PossDupFlag 43=Y, so it is not mistaken for a new order, and replaces 7, a heartbeat not worth resending, with a SequenceReset in gap-fill mode (123=Y, 36=8). Then 8 is processed, in order. Silence is handled the same way: no traffic for one heartbeat interval triggers a TestRequest, and no answer to it means the session is dead.</p>"
            "<p>Against the arena: JSON over WebSocket is self-describing and easy to debug; FIX is terser, standardised for decades, and recoverable after a disconnect without losing an order, because sequence numbers survive a reconnect within the trading day.</p>"
        ),
        "code": _code("w3c13"),
    },
    {
        "name": "Binary feeds and encodings: ITCH, OUCH, SBE and FAST against JSON",
        "explain": (
            "<p>Text protocols spend bytes and CPU on what a fixed layout gets for free. NASDAQ's TotalView-ITCH is the canonical binary market-data protocol: every message has a one-byte type and fields at fixed offsets, big-endian, with no names and no delimiters. The snippet packs an ITCH 5.0 Add Order as the specification lays it out, 36 bytes: type A, stock locate, tracking number, a 6-byte timestamp in nanoseconds since midnight, the order reference, B or S, shares, the symbol padded to 8 bytes, and the price as an integer with four implied decimals. It decodes back to buy 500 AAPL at 185.49 at 09:30:00.000000123. OUCH is the matching order-entry protocol: the same style of fixed binary message, sent over a TCP session (SoupBinTCP) rather than multicast (MoldUDP64).</p>"
            "<p>SBE, Simple Binary Encoding from the FIX Trading Community, generalises the idea: an 8-byte header giving the block length, template, schema and version, then a fixed little-endian block that is read in place, with no parsing pass. CME's MDP 3.0 feed uses it. FAST, its predecessor, compresses instead: integers in stop-bit form (7 bits per byte, the high bit marking the last byte) and fields coded as deltas against the previous message, so five prices take 11 bytes instead of 20.</p>"
            "<p>The comparison line is the point. One add-order is 28 to 36 bytes in binary, about 80 as FIX tag=value and 123 as the arena's JSON, and decoding 200,000 of them with <code>struct</code> is more than ten times faster than <code>json.loads</code>, even in Python. That is why real feeds are binary and multicast. The arena uses JSON over WebSocket because its subject is software design, and self-describing messages make every bug visible.</p>"
        ),
        "code": _code("w3c14"),
    },
]

_ORDER_JSON = '{"type":"place_order","symbol":"AAPL","side":"buy",…}'
W3_WIDGETS = [
    {
        "type": "packet-journey",
        "title": "One message, hop by hop: the headers each layer adds, rewrites and strips",
        "params": {
            "view": "osi",
            "scenarios": [
                {
                    "name": "An order over WebSocket: laptop to venue",
                    "nodes": ["Bot (Python)", "Laptop kernel", "Wi-Fi access point", "Home router (NAT)", "ISP router", "Venue server"],
                    "steps": [
                        {"node": 0, "title": "ws.send()", "note": "Your code produced 78 bytes of JSON. Nothing else exists yet.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78}]},
                        {"node": 0, "title": "WebSocket frame", "note": "The library adds a 2-byte header and, because clients must mask, a 4-byte masking key.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6}]},
                        {"node": 1, "title": "TLS record", "note": "Encrypted and authenticated: nobody between you and the venue can read or alter the order.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22}]},
                        {"node": 1, "title": "TCP segment", "note": "Ports pick the connection, sequence numbers order the bytes, and the kernel retransmits if no ACK returns.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22},
                                    {"osi": 4, "proto": "TCP", "fields": "51514 → 443  seq 1000001  ack 7000001  PSH ACK", "bytes": 20}]},
                        {"node": 1, "title": "IP packet", "note": "Longest-prefix match picks the default route: next hop 192.168.1.1, whose MAC ARP found earlier.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22},
                                    {"osi": 4, "proto": "TCP", "fields": "51514 → 443  seq 1000001  ack 7000001  PSH ACK", "bytes": 20},
                                    {"osi": 3, "proto": "IPv4", "fields": "192.168.1.23 → 203.0.113.10  TTL 64  proto 6", "bytes": 20}]},
                        {"node": 1, "title": "802.11 frame, on the air", "note": "On Wi-Fi the link header is 802.11, encrypted with the keys from the WPA handshake.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22},
                                    {"osi": 4, "proto": "TCP", "fields": "51514 → 443  seq 1000001  ack 7000001  PSH ACK", "bytes": 20},
                                    {"osi": 3, "proto": "IPv4", "fields": "192.168.1.23 → 203.0.113.10  TTL 64  proto 6", "bytes": 20},
                                    {"osi": 2, "proto": "802.11", "fields": "laptop → AP → router MAC, CCMP, LLC/SNAP", "bytes": 44},
                                    {"osi": 1, "proto": "radio", "fields": "5 GHz OFDM symbols, preamble"}]},
                        {"node": 2, "title": "access point bridges", "note": "A layer-2 bridge: it swaps the Wi-Fi header for Ethernet and leaves layers 3 and up untouched.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22},
                                    {"osi": 4, "proto": "TCP", "fields": "51514 → 443  seq 1000001  ack 7000001  PSH ACK", "bytes": 20},
                                    {"osi": 3, "proto": "IPv4", "fields": "192.168.1.23 → 203.0.113.10  TTL 64  proto 6", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "laptop MAC → router MAC  type 0x0800  FCS", "bytes": 18},
                                    {"osi": 1, "proto": "copper", "fields": "1000BASE-T"}]},
                        {"node": 3, "title": "router + NAT", "note": "A router works at L3: new L2 header, TTL minus 1. NAT also rewrites the source address and port, and both checksums.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22},
                                    {"osi": 4, "proto": "TCP", "fields": "40001 → 443  seq 1000001  ack 7000001  PSH ACK", "bytes": 20},
                                    {"osi": 3, "proto": "IPv4", "fields": "198.51.100.7 → 203.0.113.10  TTL 63  proto 6", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "router WAN MAC → ISP MAC  type 0x0800  FCS", "bytes": 18},
                                    {"osi": 1, "proto": "fibre", "fields": "GPON upstream"}]},
                        {"node": 4, "title": "every router after that", "note": "Each of the dozen or so routers on the way: new link header, TTL minus 1, same IP addresses.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22},
                                    {"osi": 4, "proto": "TCP", "fields": "40001 → 443  seq 1000001  ack 7000001  PSH ACK", "bytes": 20},
                                    {"osi": 3, "proto": "IPv4", "fields": "198.51.100.7 → 203.0.113.10  TTL 62  proto 6", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "ISP router MAC → next hop MAC  FCS", "bytes": 18},
                                    {"osi": 1, "proto": "fibre", "fields": "100G backbone"}]},
                        {"node": 5, "title": "venue NIC + kernel", "note": "The server strips L1 to L4, queues the bytes on the socket in sequence order, and ACKs them.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78},
                                    {"osi": 7, "proto": "WebSocket", "fields": "FIN, opcode 1 (text), MASK, len 78", "bytes": 6},
                                    {"osi": 6, "proto": "TLS 1.3", "fields": "application_data record, AES-GCM, 16 B tag", "bytes": 22}]},
                        {"node": 5, "title": "TLS decrypts, websockets unframes", "note": "The venue's handler receives exactly the 78 bytes your bot sent, and validates them before anything else.",
                         "layers": [{"osi": 7, "proto": "JSON", "fields": _ORDER_JSON, "bytes": 78}]},
                    ],
                },
                {
                    "name": "A DNS lookup over UDP",
                    "nodes": ["Bot (Python)", "Laptop kernel", "Home router (NAT)", "DNS resolver"],
                    "steps": [
                        {"node": 0, "title": "getaddrinfo()", "note": "The question: the A record of arena.example.org, 35 bytes.",
                         "layers": [{"osi": 7, "proto": "DNS query", "fields": "id 0x3350  RD  A? arena.example.org", "bytes": 35}]},
                        {"node": 1, "title": "UDP datagram", "note": "No handshake: 8 bytes of ports, length and checksum, and it is gone.",
                         "layers": [{"osi": 7, "proto": "DNS query", "fields": "id 0x3350  RD  A? arena.example.org", "bytes": 35},
                                    {"osi": 4, "proto": "UDP", "fields": "53000 → 53  len 43", "bytes": 8}]},
                        {"node": 1, "title": "IP + Ethernet", "note": "Sent to the resolver DHCP handed out; ARP already knows the router's MAC.",
                         "layers": [{"osi": 7, "proto": "DNS query", "fields": "id 0x3350  RD  A? arena.example.org", "bytes": 35},
                                    {"osi": 4, "proto": "UDP", "fields": "53000 → 53  len 43", "bytes": 8},
                                    {"osi": 3, "proto": "IPv4", "fields": "192.168.1.23 → 198.51.100.53  TTL 64  proto 17", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "laptop MAC → router MAC  type 0x0800", "bytes": 18}]},
                        {"node": 2, "title": "NAT", "note": "Even UDP gets a mapping, kept for a short idle timeout, so the answer can come back.",
                         "layers": [{"osi": 7, "proto": "DNS query", "fields": "id 0x3350  RD  A? arena.example.org", "bytes": 35},
                                    {"osi": 4, "proto": "UDP", "fields": "40017 → 53  len 43", "bytes": 8},
                                    {"osi": 3, "proto": "IPv4", "fields": "198.51.100.7 → 198.51.100.53  TTL 63  proto 17", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "router WAN MAC → ISP MAC", "bytes": 18}]},
                        {"node": 3, "title": "the resolver answers", "note": "Same id, the question echoed, one A record with a 60 s TTL: 51 bytes.",
                         "layers": [{"osi": 7, "proto": "DNS answer", "fields": "id 0x3350  QR RD RA  A 203.0.113.10  TTL 60", "bytes": 51},
                                    {"osi": 4, "proto": "UDP", "fields": "53 → 40017  len 59", "bytes": 8},
                                    {"osi": 3, "proto": "IPv4", "fields": "198.51.100.53 → 198.51.100.7  TTL 58  proto 17", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "ISP MAC → router WAN MAC", "bytes": 18}]},
                        {"node": 2, "title": "NAT maps it back", "note": "Port 40017 is in the table, so the reply is rewritten to 192.168.1.23:53000.",
                         "layers": [{"osi": 7, "proto": "DNS answer", "fields": "id 0x3350  QR RD RA  A 203.0.113.10  TTL 60", "bytes": 51},
                                    {"osi": 4, "proto": "UDP", "fields": "53 → 53000  len 59", "bytes": 8},
                                    {"osi": 3, "proto": "IPv4", "fields": "198.51.100.53 → 192.168.1.23  TTL 57  proto 17", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "router MAC → laptop MAC", "bytes": 18}]},
                        {"node": 0, "title": "the address is cached", "note": "One round trip, no connection. If the datagram had been lost, the stub resolver would simply ask again.",
                         "layers": [{"osi": 7, "proto": "DNS answer", "fields": "id 0x3350  QR RD RA  A 203.0.113.10  TTL 60", "bytes": 51}]},
                    ],
                },
                {
                    "name": "Market data by multicast, inside a colocation centre",
                    "nodes": ["Matching engine", "Feed publisher", "Exchange switch", "Your feed handler"],
                    "steps": [
                        {"node": 0, "title": "an order rests", "note": "The engine emits one ITCH Add Order: 36 bytes at fixed offsets.",
                         "layers": [{"osi": 7, "proto": "ITCH Add Order", "fields": "A  ref 880001  B 500 AAPL @ 185.4900", "bytes": 36}]},
                        {"node": 1, "title": "MoldUDP64 packet", "note": "Session, 64-bit sequence number, message count, then a 2-byte length before each message.",
                         "layers": [{"osi": 7, "proto": "ITCH Add Order", "fields": "A  ref 880001  B 500 AAPL @ 185.4900", "bytes": 36},
                                    {"osi": 5, "proto": "MoldUDP64", "fields": "session 000000A1  seq 4,817,203  count 1", "bytes": 22}]},
                        {"node": 1, "title": "UDP to a group", "note": "One datagram to a multicast group, published again on the B line by a separate path.",
                         "layers": [{"osi": 7, "proto": "ITCH Add Order", "fields": "A  ref 880001  B 500 AAPL @ 185.4900", "bytes": 36},
                                    {"osi": 5, "proto": "MoldUDP64", "fields": "session 000000A1  seq 4,817,203  count 1", "bytes": 22},
                                    {"osi": 4, "proto": "UDP", "fields": "→ port 26477  no handshake, no ACK", "bytes": 8},
                                    {"osi": 3, "proto": "IPv4", "fields": "10.0.0.5 → 233.54.12.1 (group)  TTL 32", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "→ 01:00:5e:36:0c:01 (group MAC)", "bytes": 18}]},
                        {"node": 2, "title": "the switch replicates", "note": "IGMP snooping: the frame is copied only to ports whose hosts joined the group. Nothing is rewritten.",
                         "layers": [{"osi": 7, "proto": "ITCH Add Order", "fields": "A  ref 880001  B 500 AAPL @ 185.4900", "bytes": 36},
                                    {"osi": 5, "proto": "MoldUDP64", "fields": "session 000000A1  seq 4,817,203  count 1", "bytes": 22},
                                    {"osi": 4, "proto": "UDP", "fields": "→ port 26477  no handshake, no ACK", "bytes": 8},
                                    {"osi": 3, "proto": "IPv4", "fields": "10.0.0.5 → 233.54.12.1 (group)  TTL 32", "bytes": 20},
                                    {"osi": 2, "proto": "Ethernet", "fields": "→ 01:00:5e:36:0c:01 (group MAC)", "bytes": 18}]},
                        {"node": 3, "title": "the handler checks the sequence", "note": "Expected 4,817,203: apply it. A higher number means a gap: try the B line, then the retransmission server.",
                         "layers": [{"osi": 7, "proto": "ITCH Add Order", "fields": "A  ref 880001  B 500 AAPL @ 185.4900", "bytes": 36},
                                    {"osi": 5, "proto": "MoldUDP64", "fields": "session 000000A1  seq 4,817,203  count 1", "bytes": 22}]},
                        {"node": 3, "title": "decoded into the book", "note": "struct-style unpacking at fixed offsets: no parsing, no field names, a few tens of nanoseconds in C.",
                         "layers": [{"osi": 7, "proto": "ITCH Add Order", "fields": "A  ref 880001  B 500 AAPL @ 185.4900", "bytes": 36}]},
                    ],
                },
            ],
        },
    },
    {
        "type": "transport-ladder",
        "title": "TCP against UDP on a timeline: handshake, Nagle, a lost packet and head-of-line blocking",
        "params": {"mode": "both", "rtt": 20, "msgs": 4, "gap": 4, "nagle": False, "tls": False,
                   "loss": True, "seed": 33503},
    },
]

W3_PITFALLS_NEW = [
    "Leaving Nagle on for order entry, or writing one message in several send calls. Set TCP_NODELAY and write each message with one sendall.",
    "Treating a UDP feed as reliable. Without sequence checks, A/B arbitration and a gap-fill or snapshot path, one lost datagram leaves a wrong book that no later message repairs.",
]

W3_CHECK = [
    {
        "q": "A client sends a 16-byte header and a 48-byte body in two send() calls, then waits for the reply. Between two Linux hosts every request takes about 40 ms more than the round-trip time. Most likely cause?",
        "options": [
            "UDP packet loss on the path",
            "Nagle's algorithm holds the body until the delayed ACK of the header; set TCP_NODELAY or write once",
            "A DNS lookup before every request",
            "The MTU is too small for 64 bytes",
        ],
        "answer": 1,
        "why": "Write-write-read with Nagle on waits for the receiver's delayed ACK (up to 40 ms on Linux). TCP_NODELAY, or one write per message, removes it.",
    },
    {
        "q": "Why do exchanges publish market data as UDP multicast on two lines, A and B?",
        "options": [
            "Because UDP guarantees delivery",
            "One datagram reaches every subscriber, and two independent copies let a receiver fill most gaps by arbitration, with no retransmission request",
            "Because multicast traffic is encrypted",
            "Because TCP cannot carry binary messages",
        ],
        "answer": 1,
        "why": "Multicast scales to every subscriber at once; sequence numbers expose losses, and the second line usually holds the missing packet.",
    },
    {
        "q": "A FIX engine expecting MsgSeqNum 6 receives a message with 34=8. What should it do?",
        "options": [
            "Process 8 and ignore the gap",
            "Send a ResendRequest from 6 (7=6, 16=0), and process 8 only once 6 and 7 are resent or gap-filled",
            "Drop the session at once",
            "Reset its own expected sequence number to 8",
        ],
        "answer": 1,
        "why": "The session layer guarantees in-order, complete delivery: recover the gap (PossDup resends or a SequenceReset gap fill) before moving on.",
    },
    {
        "q": "Your laptop is 192.168.1.23 behind a home router. Why can the venue not open a connection to your bot?",
        "options": [
            "Private addresses are not routed on the Internet, and the NAT has no mapping for an unsolicited inbound packet",
            "TCP does not let servers open connections",
            "DNS cannot resolve laptops",
            "WebSockets only carry data from client to server",
        ],
        "answer": 0,
        "why": "NAT only maps flows started from inside. The bot dials out, and the venue pushes data down that same open connection.",
    },
]


# ═══ interview and glossary ═══

INTERVIEW_CONCURRENCY = {
    "q": "Your Python trading bot reads two WebSocket feeds, refits a model every minute and sends orders. Which parts go in threads, processes or asyncio, and what does the GIL have to do with it?",
    "level": "screen",
    "answer": "The GIL lets one thread execute Python bytecode at a time and is released while a thread blocks on I/O, so threads and asyncio overlap waiting, and only processes (or numpy and other C code that releases the GIL) overlap computing. The feeds are I/O-bound: one asyncio loop, a task per connection, never blocked. The refit is CPU-bound: a ProcessPoolExecutor created once and reused, with plain data in and out, since everything crossing the boundary is pickled. The gateway is one task that owns the order socket and drains a queue, so orders leave in sequence. A blocking SDK call goes to asyncio.to_thread. I avoid shared state; where some remains, one lock covers each check-then-act. Then I measure loop lag to prove the feed is never starved.",
}

INTERVIEW_TRANSPORT = {
    "q": "Design the transport for a trading venue: market data to hundreds of clients, and order entry from each of them. TCP or UDP, text or binary, and how does a client recover from a gap?",
    "level": "onsite",
    "answer": "Market data: UDP multicast, because one datagram reaches every subscriber and nobody waits for a slow reader, in binary fixed-layout messages (ITCH- or SBE-style) that are small and decode in place. Every packet carries a sequence number. The venue publishes A and B lines over separate paths; clients arbitrate between them, ask a retransmission server for what both lost, rebuild from a snapshot if they fall too far behind, and never trade on a book with a gap. Order entry: TCP, one session per client, TCP_NODELAY, length-prefixed or FIX-style messages with session sequence numbers, heartbeats with a test request, and resends flagged as possible duplicates, so a reconnect loses nothing. Schemas are versioned: add optional fields, never repurpose old ones.",
}

GLOSSARY_MERGED = [
    ("Central limit order book (CLOB)", "Price-time priority",
     {"term": "Central limit order book (CLOB) and price-time priority", "def": "The venue's list of resting limit orders on both sides, matched by price-time priority: a better price fills first, then the earlier order at that price, and trades print at the resting order's price."}),
    ("Microprice", "Order-book imbalance",
     {"term": "Microprice and order-book imbalance", "def": "Microprice weights each side's price at the touch by the opposite side's size, so a heavy offer pulls it toward the bid; imbalance is (bid size - ask size) / (bid size + ask size), at the touch or over several levels."}),
    ("Maker / taker", "Post-only",
     {"term": "Maker / taker and post-only", "def": "A maker's order rested and was hit (it adds liquidity and earns a rebate); a taker's order crossed the spread (it pays a fee). A post-only order is rejected if it would cross, so it can only be a maker."}),
    ("Abstract base class (ABC)", "Strategy pattern",
     {"term": "Abstract base class (ABC) and the Strategy pattern", "def": "An ABC has abstract methods and cannot be instantiated until a subclass implements them, so the contract is checked at construction; the Strategy pattern puts the decision rule behind such an interface so it can be swapped without touching its caller."}),
    ("Event loop", "Backpressure",
     {"term": "Event loop and backpressure", "def": "The asyncio event loop runs coroutines on one thread, switching only at await points; backpressure is the bounded queue between its tasks that makes a fast producer wait instead of letting data pile up and go stale."}),
    ("Framing", "Discriminated union",
     {"term": "Framing and discriminated unions", "def": "Framing marks where one message ends in a byte stream, by a delimiter or a length prefix, since TCP has no boundaries; a discriminated union tells the parser which schema to apply from a literal tag field such as `type`."}),
    ("Look-ahead bias", "Event-driven backtest",
     {"term": "Look-ahead bias and the event-driven backtest", "def": "Look-ahead bias uses information not available at decision time, such as trading bar t's return on bar t's close; an event-driven backtest rules it out by feeding the strategy one event at a time, with only the past visible, and simulating fills, fees and the portfolio after each decision."}),
    ("Lazy deletion", "Welford's algorithm",
     {"term": "Lazy deletion and Welford's algorithm", "def": "Two O(1) tricks: lazy deletion cancels an order by removing it from the lookup table and discarding its stale heap entry only when it reaches the top; Welford's algorithm updates a running mean and variance stably, one observation at a time."}),
]

GLOSSARY_W2 = [
    {"term": "GIL (global interpreter lock)", "def": "CPython's interpreter-wide mutex: one thread executes Python bytecode at a time, and the lock is released during blocking I/O and every switch interval (5 ms). Threads overlap waiting, not computing; the free-threaded build (3.13t and later) removes it."},
    {"term": "Race condition", "def": "A bug whose outcome depends on how threads or tasks interleave, such as two withdrawals that both pass a balance check before either subtracts. Fixed by one lock held across the whole check-then-act, or by not sharing the state."},
]

GLOSSARY_W3 = [
    {"term": "DHCP, ARP and DNS", "def": "How a laptop joins a network: DHCP leases it an IP address, subnet mask, gateway and resolver; ARP finds the MAC address behind an IP on the local subnet; DNS turns a host name into an IP address, cached for the record's TTL."},
    {"term": "MTU and MSS", "def": "The MTU is the largest IP packet a link carries (1,500 bytes on Ethernet); the MSS is the TCP payload that fits inside it (1,460 bytes after the 20-byte IP and TCP headers)."},
    {"term": "Nagle's algorithm and TCP_NODELAY", "def": "Nagle's algorithm holds small TCP writes while earlier data is unacknowledged and sends them coalesced; with delayed ACKs it can add tens of milliseconds per request. TCP_NODELAY turns it off, as every order-entry socket should."},
    {"term": "Multicast and gap fill", "def": "UDP sent to a group address that the network copies to every subscriber. Each packet carries a sequence number; a receiver that sees a gap fills it from the B line, a retransmission server or a snapshot before it trusts the book again."},
    {"term": "FIX", "def": "The Financial Information eXchange protocol: tag=value fields separated by SOH, with BodyLength (9), MsgType (35), MsgSeqNum (34) and CheckSum (10), and a session layer of logon, heartbeats, test requests, resend requests and sequence resets."},
    {"term": "ITCH, OUCH, SBE and FAST", "def": "Binary trading encodings: ITCH (market data) and OUCH (order entry) are NASDAQ's fixed-layout messages; SBE is the FIX community's fixed-offset encoding, read in place (CME MDP 3.0); FAST compresses FIX with stop-bit integers and deltas."},
]

RETIRED = {"week2_check": [], "week3_check": [], "week2_pitfalls": [], "week3_pitfalls": [],
           "interview": [], "glossary": []}


def apply(WEEKS, INTERVIEW, GLOSSARY):
    """Extend weeks 2 and 3 in place. SCHEMA.md caps MCQs (4), pitfalls (4), interview items (12)
    and glossary entries (20) per course, and this course already sat at every cap, so the new
    material REPLACES some items; whatever it replaces is kept in RETIRED for the record."""
    w2, w3 = WEEKS[1], WEEKS[2]
    assert w2["n"] == 2 and w3["n"] == 3

    w2["title"] = ("Session 1 · UML, object-oriented Python, threads and processes: model the trading domain, "
                   "run work concurrently, and your first bot connects and trades")
    w2["topics"] = w2["topics"][:-1] + W2_TOPICS + w2["topics"][-1:]
    w2["concepts"] = w2["concepts"] + W2_CONCEPTS
    w2["widget"] = [w2["widget"], W2_WIDGET]
    RETIRED["week2_pitfalls"] = w2["pitfalls"][2:]
    w2["pitfalls"] = w2["pitfalls"][:2] + W2_PITFALLS_NEW
    RETIRED["week2_check"] = w2["check"]
    w2["check"] = W2_CHECK

    w3["title"] = ("Session 2 · Concurrency, asyncio and the network: one event loop, TCP and UDP sockets, "
                   "and the trading protocols on the wire")
    w3["topics"] = w3["topics"][:-1] + W3_TOPICS + w3["topics"][-1:]
    w3["concepts"] = w3["concepts"] + W3_CONCEPTS
    w3["widget"] = [w3["widget"]] + W3_WIDGETS
    keep = [w3["pitfalls"][0], w3["pitfalls"][3]]
    RETIRED["week3_pitfalls"] = [w3["pitfalls"][1], w3["pitfalls"][2]]
    w3["pitfalls"] = keep + W3_PITFALLS_NEW
    RETIRED["week3_check"] = w3["check"]
    w3["check"] = W3_CHECK

    # interview: the concurrency screen question and the protocol-design onsite question are
    # replaced by broader versions that contain them
    for i, q in enumerate(INTERVIEW):
        if q["q"].startswith("What is the difference between concurrency and parallelism"):
            RETIRED["interview"].append(q)
            INTERVIEW[i] = INTERVIEW_CONCURRENCY
        elif q["q"].startswith("Design the message protocol between a trading client and an exchange"):
            RETIRED["interview"].append(q)
            INTERVIEW[i] = INTERVIEW_TRANSPORT

    # glossary: merge eight pairs that belong together, then add the new terms after their week
    by_term = {g["term"]: g for g in GLOSSARY}
    out = []
    for g in GLOSSARY:
        for a, b, merged in GLOSSARY_MERGED:
            if g["term"] == a:
                RETIRED["glossary"] += [by_term[a], by_term[b]]
                out.append(merged)
                if a == "Abstract base class (ABC)":
                    out += GLOSSARY_W2
                if a == "Event loop":
                    out += GLOSSARY_W3
                break
            if g["term"] == b:
                break
        else:
            out.append(g)
    GLOSSARY[:] = out
    assert len(GLOSSARY) <= 20 and len(INTERVIEW) <= 12
