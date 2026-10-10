"""Week 2 and week 3 extensions of FINM 33500, imported by tools/gen_finm_33500.py.

Added 2026-10-09, the day session 1 was taught: the class covered threading and
multiprocessing, which the dashboard's week 2 lacked, and session 2 (2026-10-16)
is networking and trading protocols. Everything here is appended to the weeks
built by the generator; apply() is called just before the course is emitted.

    week 2  +6 concepts (GIL, Thread/Lock race, Queue/Event, thread vs process
            pools, start methods and pickling, which model per component),
            +1 widget (concurrency-timeline), 2 new pitfalls, 4 new MCQs
    course  2 interview items and 8 glossary terms (see apply() for what they replace),
            the week-3 terms among them

Week 3 itself (networking and trading protocols) was first written here too, then rebuilt
the same day to the instructor's required order in tools/gen_finm_33500_w3.py.

Unlike the rest of the generator's snippets, SEVERAL OF THESE PRINT REAL WALL-CLOCK
TIMINGS on purpose (w2c6, w2c9, w2c10, w2c11): the point of the week is
the measured difference between threads and processes. Their stored output is the
run on the machine that built the page; `run_snippets.py --check` will report those
four as stale on any other run. Fill them with `--jobs 1`, so that no other snippet
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
            "<p>Four rules keep you out of trouble. Protect every invariant with one lock held across the whole check-then-act. Keep critical sections short, and never do I/O inside one. When you need several locks, always take them in the same order, or two threads will deadlock. Best of all, share nothing and hand data between threads through a queue. The same race on a position limit comes back under asyncio in week 4, where the danger point is an <code>await</code> rather than any line.</p>"
        ),
        "code": _code("w2c7"),
    },
    {
        "name": "Queue and Event: handing ticks from a feed thread to a strategy thread",
        "explain": (
            "<p>The safest way for threads to cooperate is to share nothing but a queue. <code>queue.Queue</code> is a thread-safe FIFO with its own lock and condition variables: <code>put</code> and <code>get</code> block when the queue is full or empty, so the producer cannot get more than <code>maxsize</code> items ahead of the consumer, and nobody busy-waits. <code>threading.Event</code> is the other primitive: a flag that one thread sets and any number of threads wait on. That is how you tell everybody at once \"logged in\", \"stop\" or \"kill switch tripped\".</p>"
            "<p>The snippet wires a feed thread to a strategy thread through <code>Queue(maxsize=4)</code>. The feed starts first and blocks on the <code>connected</code> event until the main thread sets it (the logon ack), so no tick is consumed before login. Then the strategy, deliberately slower at 2 ms per decision, receives all 40 ticks in sequence order. The producer found the queue full and had to wait: that is backpressure, and the bound caps both memory and staleness. A sentinel object marks the end of the stream so the consumer exits, and both threads are dead after <code>join</code>. In the second run the strategy trips the kill switch after 10 ticks. The feed calls <code>put(..., timeout=0.05)</code> and checks the event between attempts, so it notices and exits instead of blocking forever on a full queue.</p>"
            "<p>This is the threaded twin of the asyncio queue in week 4 and of the multiprocessing queues below: a bounded handoff, a sentinel for the end, an event for shutdown, and a timeout on every blocking call so that shutdown cannot hang. Daemon threads that nobody joins are how bots die at the close with orders half sent.</p>"
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

RETIRED = {"week2_check": [], "week2_pitfalls": [], "interview": [], "glossary": []}


def apply(WEEKS, INTERVIEW, GLOSSARY):
    """Extend week 2 in place, and swap in the course-level interview and glossary items for weeks
    2-3. SCHEMA.md caps MCQs (4), pitfalls (4), interview items (12) and glossary entries (20) per
    course, and this course already sat at every cap, so the new material REPLACES some items;
    whatever it replaces is kept in RETIRED for the record."""
    w2 = WEEKS[1]
    assert w2["n"] == 2

    w2["title"] = ("Session 1 · UML, object-oriented Python, threads and processes: model the trading domain, "
                   "run work concurrently, and your first bot connects and trades")
    w2["topics"] = w2["topics"][:-1] + W2_TOPICS + w2["topics"][-1:]
    w2["concepts"] = w2["concepts"] + W2_CONCEPTS
    w2["widget"] = [w2["widget"], W2_WIDGET]
    RETIRED["week2_pitfalls"] = w2["pitfalls"][2:]
    w2["pitfalls"] = w2["pitfalls"][:2] + W2_PITFALLS_NEW
    RETIRED["week2_check"] = w2["check"]
    w2["check"] = W2_CHECK

    # week 3 is rebuilt as a whole by tools/gen_finm_33500_w3.py, which also moves the asyncio
    # material that used to be week 3 to week 4

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
