#!/usr/bin/env python3
"""Generator for courses/finm-33500.js -- FINM 33500, Systematic Trading
Technologies (Sebastien Donadio, Autumn, 100 units, Computing block).

TIER A. Unlike the tier-B pages, this one is built from the instructor's own
course material, with his permission: the syllabus week table and outcomes,
the nine in-class labs (labs/week01.md ... week09.md), the per-session speaker
guides, the deck outlines (build_week1.py ... build_week9.py) and the published
per-session focus list of the Systematic Trading skills dashboard. The ten
weeks of the schema are the ten sessions 0-9 of the syllabus.

Why a generator instead of a hand-edited JS literal: the course file is a
large object with ~45 embedded Python snippets, and hand-editing one is how a
quote or a brace goes missing. This script builds the whole thing as a Python
dict and emits it with json.dumps(indent=2).

    python3 tools/gen_finm_33500.py                       # writes courses/finm-33500.js
    python3 tools/run_snippets.py courses/finm-33500.js    # fills every `output`
    python3 tools/run_snippets.py --check courses/finm-33500.js
    python3 tools/validate.py courses/finm-33500.js        # must be 0 errors
    node --check courses/finm-33500.js

Every snippet mirrors a step of that week's lab, is self-contained (numpy,
pandas and the standard library only -- no import from the course repo), is
deterministic (seeded with 33500 + week, and it never prints a wall-clock
timing: where the lab times something, the snippet counts operations or prints
a threshold verdict instead, so tools/run_snippets.py --check stays stable),
and was executed before the prose around it was written. `output` is emitted
EMPTY here and filled from real stdout by tools/run_snippets.py.

Skill tags: only tags that already resolve (data/skills_seed.js) go into the
course. The six genuinely new tags this course needs are proposed in
data/new_tags/finm-33500.json; EXTRA_TAGS below adds each one to skills_built
automatically as soon as it appears in data/skills_seed.js, so re-running this
generator after the tags are merged is all it takes.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "courses", "finm-33500.js")

ARENA = "https://sdonadio.github.io/systematic-trading-arena/"
SKILLS_SITE = "https://sdonadio.github.io/systematic-trading-skills-dashboard/"
HFT_ARENA = "https://sdonadio.github.io/low-latency-trading-arena/"
TEMPLATE = "https://github.com/sdonadio/algoarena-team-template"

# ─────────────────────────────────────────────────────────────────────────
# Python snippet sources, keyed "w<week>c<concept>" (week = session + 1).
# ─────────────────────────────────────────────────────────────────────────
SRC = {}

# ═══ Week 1 · Session 0 — setup, the order book, fees, the smoke test ═══

SRC["w1c1"] = r'''import numpy as np
np.seterr(all="ignore")
import heapq
from itertools import count

class Book:
    """A price-time CLOB: two heaps of (key, seq, id) plus one dict of live orders."""
    def __init__(self):
        self.bids, self.asks, self.live, self.trades = [], [], {}, []
        self.seq = count()                      # a counter, not a clock: ties are exact

    def place(self, oid, side, price, qty, kind="limit"):
        opp = self.asks if side == "buy" else self.bids
        while qty > 0 and opp:
            _, _, rid = opp[0]
            rest = self.live[rid]
            crosses = kind == "market" or (price >= rest["px"] if side == "buy" else price <= rest["px"])
            if not crosses:
                break
            fill = min(qty, rest["qty"])
            self.trades.append((oid, rid, rest["px"], fill))    # RESTING order's price
            qty -= fill
            rest["qty"] -= fill
            if rest["qty"] == 0:
                heapq.heappop(opp)
                del self.live[rid]
        if qty and kind == "limit":             # a limit remainder rests
            self.live[oid] = {"side": side, "px": price, "qty": qty}
            key = -price if side == "buy" else price
            heapq.heappush(self.bids if side == "buy" else self.asks, (key, next(self.seq), oid))
            return f"{qty} rests"
        return f"{qty} cancelled" if qty else "filled"   # a market remainder never rests

b = Book()
b.place("A1", "sell", 100.02, 300)      # oldest, but a worse price
b.place("A2", "sell", 100.01, 200)      # better price, earlier
b.place("A3", "sell", 100.01, 100)      # same price, later
print("buy 450 @ 100.02 ->", b.place("T1", "buy", 100.02, 450))
for taker, maker, px, q in b.trades:
    print(f"  {taker} lifts {maker}: {q:>3} @ {px:.2f}")
print("price beats time: A2, A3 (100.01) fill before the older A1 (100.02)")
print("time breaks ties: A2 before A3 at 100.01")
avg = sum(px * q for _, _, px, q in b.trades) / 450
print(f"buyer was willing to pay 100.02, average paid {avg:.4f}")

b.place("B1", "buy", 100.00, 250)
print("market sell 1000 ->", b.place("T2", "sell", 0.0, 1000, kind="market"))
b.place("B2", "buy", 100.00, 300)      # a fresh resting bid
print("limit sell 300 @ 99.00 ->", b.place("T3", "sell", 99.00, 300))
print("last print:", b.trades[-1][2], "(the resting bid's price, not the seller's 99.00)")
'''

SRC["w1c2"] = r'''import numpy as np
np.seterr(all="ignore")

def top_of_book(bid, bid_sz, ask, ask_sz):
    mid = (bid + ask) / 2
    spread = ask - bid
    # microprice weights each side's price by the OTHER side's size:
    # a heavy ask pulls the fair value DOWN toward the bid
    micro = (bid * ask_sz + ask * bid_sz) / (bid_sz + ask_sz)
    obi = (bid_sz - ask_sz) / (bid_sz + ask_sz)
    return mid, spread, micro, obi

# the AAPL ladder from the session-0 deck
bid, bid_sz, ask, ask_sz = 185.48, 400, 185.50, 680
mid, spread, micro, obi = top_of_book(bid, bid_sz, ask, ask_sz)
print(f"mid {mid:.4f}   spread {spread:.2f} = {spread / mid * 1e4:.2f} bps")
print(f"microprice {micro:.4f}   imbalance {obi:+.3f}")
print(f"microprice - mid = {micro - mid:+.4f}  (sell pressure: fair value sits below mid)")

# someone lifts 600 of the 680 offered: the book flips
mid2, _, micro2, obi2 = top_of_book(bid, bid_sz, ask, ask_sz - 600)
print(f"after 600 lifted: microprice {micro2:.4f}  imbalance {obi2:+.3f}  mid unchanged {mid2:.4f}")

# depth imbalance over 5 levels uses more of the book than the touch
bids = np.array([[185.48, 400], [185.47, 900], [185.46, 1200], [185.45, 800], [185.44, 1500]])
asks = np.array([[185.50, 680], [185.51, 500], [185.52, 450], [185.53, 700], [185.54, 600]])
d = (bids[:, 1].sum() - asks[:, 1].sum()) / (bids[:, 1].sum() + asks[:, 1].sum())
print(f"5-level depth imbalance {d:+.3f}  (touch says sell, depth says buy)")
'''

SRC["w1c3"] = r'''import numpy as np
np.seterr(all="ignore")

TAKER, MAKER_REBATE, FLAT = 0.0015, 0.0010, 0.001   # arena defaults (maker/taker on)
qty, bid, ask = 100, 99.99, 100.01
notional = qty * 100.00

print(f"notional ${notional:,.0f}   spread on {qty} shares = ${(ask - bid) * qty:.2f}")
print(f"cross the spread (taker): pay  ${TAKER * notional:6.2f}")
print(f"post and get hit (maker): earn ${MAKER_REBATE * notional:6.2f}")
print(f"fee / spread = {TAKER * notional / ((ask - bid) * qty):.1f}x")

def round_trip(buy_px, sell_px, buy_fee_rate, sell_fee_rate):
    gross = (sell_px - buy_px) * qty
    fees = (buy_fee_rate * buy_px + sell_fee_rate * sell_px) * qty
    return gross, gross - fees

for name, bpx, spx, bf, sf in [
    ("taker in, taker out", ask, bid, TAKER, TAKER),
    ("maker in, maker out", bid, ask, -MAKER_REBATE, -MAKER_REBATE),
    ("maker in, taker out", bid, bid, -MAKER_REBATE, TAKER),
]:
    g, n = round_trip(bpx, spx, bf, sf)
    print(f"{name:<22} gross {g:+7.2f}   net {n:+7.2f}")

breakeven_bps = (2 * TAKER * 1e4) + (ask - bid) / 100.0 * 1e4
print(f"a taker round trip needs a {breakeven_bps:.0f} bps move just to break even")
print(f"venue keeps {(TAKER - MAKER_REBATE) * 1e4:.0f} bps per maker/taker trade;"
      f" legacy flat fee {FLAT * 1e4:.0f} bps split 50/50")
'''

SRC["w1c4"] = r'''import numpy as np
np.seterr(all="ignore")
import sys

def resolve_exchange(shell_env, dotenv):
    """Shell beats .env beats default -- the escape hatch for the .env trap."""
    host = shell_env.get("EXCHANGE_HOST") or dotenv.get("EXCHANGE_HOST") or "localhost"
    port = int(shell_env.get("EXCHANGE_PORT") or dotenv.get("EXCHANGE_PORT") or 8765)
    src = "shell" if "EXCHANGE_HOST" in shell_env else (".env" if "EXCHANGE_HOST" in dotenv else "default")
    return f"ws://{host}:{port}", src

def engine_check():
    # check 5 in miniature: a sell crossing a resting 100.0 bid must print at 100.0
    resting_bid, incoming_sell = 100.0, 99.0
    return "pass" if max(resting_bid, incoming_sell) == 100.0 else "fail"

def run_checks(env):
    checks = [
        ("python >= 3.11", lambda: "pass" if sys.version_info[:2] >= (3, 11) else "fail"),
        ("arena SDK imports", lambda: "pass"),
        ("LLM key configured", lambda: "pass" if env.get("ANTHROPIC_API_KEY") else "skip"),
        ("market data reachable", lambda: "pass" if env.get("NETWORK") else "skip"),
        ("engine + offline sim", engine_check),
        ("arena reachable", lambda: "pass" if env.get("ARENA_UP") else "skip"),
    ]
    res = [(name, fn()) for name, fn in checks]          # cheapest first
    for i, (name, r) in enumerate(res, 1):
        print(f"  check {i}  {name:<22} {r.upper()}")
    n = {k: sum(r == k for _, r in res) for k in ("pass", "skip", "fail")}
    green = n["pass"] == len(res)
    print(f"  {n['pass']} passed, {n['skip']} skipped, {n['fail']} failed -> "
          f"{'GREEN' if green else 'NOT green: a skip is not a pass'}")

print("laptop, wifi off, no key:")
run_checks({})
print("fully configured:")
run_checks({"ANTHROPIC_API_KEY": "sk-...", "NETWORK": 1, "ARENA_UP": 1})

dotenv = {"EXCHANGE_HOST": "arena.example.org"}      # written by `make register`
print(resolve_exchange({}, dotenv), "<- local bot dials the hosted venue")
print(resolve_exchange({"EXCHANGE_HOST": "localhost"}, dotenv), "<- the fix")
'''

SRC["w1c5"] = r'''import numpy as np
np.seterr(all="ignore")

best_bid, best_ask = 99.99, 100.01
ask_depth = [(100.01, 50), (100.02, 80), (100.05, 200)]

def market_buy(qty):
    got, cost = 0, 0.0
    for px, sz in ask_depth:                      # walk the book: price NOT guaranteed
        take = min(qty - got, sz)
        got += take
        cost += take * px
        if got == qty:
            break
    return got, cost / got

def limit_buy(px, qty):
    if px >= best_ask:
        return "crosses: fills now as a TAKER"
    return f"rests at {px:.2f}: price guaranteed, fill NOT guaranteed"

def post_only_buy(px):
    return "REJECTED (would cross)" if px >= best_ask else f"accepted at {px:.2f}: maker, earns the rebate"

def ioc_buy(px, qty):
    filled = sum(min(sz, qty) for p, sz in ask_depth[:1] if p <= px)
    return f"filled {filled}, {qty - filled} cancelled immediately"

for q in (40, 100, 250):
    got, avg = market_buy(q)
    print(f"market buy {q:>3}: filled {got:>3} avg {avg:.4f}  slippage {(avg - best_ask) * 1e4 / 100:.2f} bps")
print("limit buy 100.00  :", limit_buy(100.00, 100))
print("limit buy 100.01  :", limit_buy(100.01, 100))
print("post-only 100.00  :", post_only_buy(100.00))
print("post-only 100.01  :", post_only_buy(100.01))
print("IOC buy 100 @100.01:", ioc_buy(100.01, 100))
'''


# ─────────────────────────────────────────────────────────────────────────
# Weeks. Each entry is appended below; prose was written after the snippet
# outputs were seen.
# ─────────────────────────────────────────────────────────────────────────
WEEKS = []

def code(key):
    """A concept's code block; output is filled by tools/run_snippets.py."""
    return {"lang": "python", "src": SRC[key], "output": ""}


# ═══ Week 1 · Session 0 ═══
WEEKS.append({
    "n": 1,
    "title": "Session 0 · Setup and orientation: the order book, the fee bill and a green smoke test",
    "topics": [
        "what systematic trading is: signal, strategy, execution, risk, portfolio",
        "the central limit order book and price-time priority",
        "mid, spread, microprice and imbalance",
        "maker/taker fees against the spread",
        "order types as trade-offs between price and fill",
        "toolchain, repository and the six-check smoke test",
        "capability you leave with: toolchain, repository, your first order and fill on the arena",
    ],
    "concepts": [
        {
            "name": "The central limit order book: price beats time, and a trade prints at the resting price",
            "explain": (
                "<p>Every venue in this course, and every real equity exchange, matches orders with the same four rules, applied in this order: a better price goes first; among equal prices the earlier order goes first; a trade executes at the <em>resting</em> order's price; an unfilled limit remainder rests in the book while an unfilled market remainder is cancelled. The snippet is a complete matcher for those rules in thirty lines: two heaps keyed on price and a sequence counter, plus one dictionary of live orders. The counter matters: floats tie and clocks collide, a monotonic counter never does, so time priority is exact.</p>"
                "<p>Read the output as the four rules in action. A buy for 450 at 100.02 fills A2 and A3 at 100.01 before the older A1 at 100.02 (price beats time), A2 before A3 (time breaks ties), and the buyer, willing to pay 100.02, pays an average of 100.0133 because each fill prints at the resting price. A market sell for 1,000 against 250 of bids fills 250 and cancels 750; a limit sell at 99.00 into a 100.00 bid prints at 100.00.</p>"
                "<p>In the lab you meet this as check 5 of <code>tests/test_smoke.py</code>, which places a crossing order and asserts the trade printed at 100.0, the resting price (the smoke-test one-pager, step 5). In the arena this is the exchange team's matching engine, the one file held at 100% test coverage, and the same engine fills your bot live and in the offline simulator.</p>"
            ),
            "formula": "\\text{priority} = (\\text{price}\\downarrow_{\\text{bids}}\\;/\\;\\uparrow_{\\text{asks}},\\ \\text{seq}\\uparrow), \\qquad p_{\\text{trade}} = p_{\\text{resting}}",
            "code": code("w1c1"),
        },
        {
            "name": "Mid, spread, microprice and imbalance: four numbers read off the touch",
            "explain": (
                "<p>A book snapshot hands your bot two ladders of (price, size). Four numbers summarise the top of it. The <strong>mid</strong> is the average of best bid and best ask; it is a marking price, not a price anyone will trade with you at, and confusing the two is the most common beginner error in this course. The <strong>spread</strong> is the cost of immediacy. The <strong>microprice</strong> weights each side's price by the <em>opposite</em> side's size, so a heavy offer pulls fair value toward the bid. The <strong>order-book imbalance</strong> is the signed share of resting size on the bid.</p>"
                "<p>On the session-0 AAPL ladder (185.48 x 400 against 185.50 x 680) the mid is 185.4900, the spread two cents or 1.08 bps, the microprice 185.4874 and the imbalance -0.259: more size wants to sell than to buy, and the microprice sits 0.26 cents below mid. Lift 600 of the offer and the imbalance flips to +0.667 and the microprice jumps to 185.4967 while the mid has not moved at all. Five levels deep, the same book shows +0.242: the touch says sell, the depth says buy, and depth is an option its posters can pull.</p>"
                "<p>In the lab you print these from a live <code>BookSnapshot</code> in week 3 (step 6 prints mid and obi for every symbol), and <code>MarketData</code> exposes <code>mid_price</code>, <code>spread</code> and <code>order_book_imbalance</code> to your <code>on_tick</code> from week 1. In the arena the dashboard's MARKET tab shows exactly this ladder.</p>"
            ),
            "formula": "m = \\tfrac{b+a}{2},\\quad \\mu = \\frac{b\\,Q_a + a\\,Q_b}{Q_a+Q_b},\\quad \\text{OBI} = \\frac{Q_b - Q_a}{Q_b + Q_a}",
            "code": code("w1c2"),
        },
        {
            "name": "The fee bill: on this venue the fee is bigger than the spread",
            "explain": (
                "<p>The arena's default fee model is maker/taker: an order that takes liquidity pays 0.0015 of notional (15 bps), an order that rested and was hit earns a rebate of 0.0010 (10 bps), and the venue keeps the 5 bps between them. The instructor inflated these on purpose so that execution economics show up inside a forty-minute session rather than over a quarter; real US equity fees are a fraction of a cent a share.</p>"
                "<p>Do it on the board as the snippet does: 100 shares at $100 is $10,000 of notional. Cross the spread and you pay $15; post and get filled and you earn $10; the two-cent spread you were chasing is worth $2 on the whole order, so the fee is 7.5 times the spread. A taker round trip loses $32 net on a $2 gross spread, a maker round trip makes $22, and the mixed trip, maker in and taker out at the same price, still loses $5. A taker needs a 32 bps move just to break even.</p>"
                "<p>This is the number of the night in session 0 and the reason the week-1 lab's race (step 7, <em>Race them offline</em>) ends with the momentum bot paying $113.57 in fees across 66 crossings and handing the broker exactly the P&amp;L it lost. In the arena it is why broker teams quote with post-only orders, why exchange teams can set taker fees between 5 and 30 bps but must always net at least 2, and why MAKER % and NET FEES are the two most diagnostic columns on the STATS tab.</p>"
            ),
            "formula": "\\text{net P\\&L} = \\text{edge} - f_{\\text{taker}}\\,N_{\\text{taken}} + r_{\\text{maker}}\\,N_{\\text{made}},\\qquad f_{\\text{taker}} = 15\\,\\text{bps},\\ r_{\\text{maker}} = 10\\,\\text{bps}",
            "code": code("w1c3"),
        },
        {
            "name": "Order types are one trade-off: certainty of price against certainty of fill",
            "explain": (
                "<p>A market order guarantees the fill and not the price; a limit order guarantees the price and not the fill. There is no third option, only refinements. Post-only is a limit order the venue rejects if it would cross, which guarantees maker status and therefore the rebate: it is the broker's order type. Immediate-or-cancel takes what is available at your limit now and cancels the rest, so it never leaves a stale order behind.</p>"
                "<p>The snippet walks a three-level ask ladder. A market buy of 40 fills entirely at the touch; 100 shares walk into the second level and average 100.0150, half a basis point of slippage; 250 shares reach the third level and pay 2.24 bps over the touch. The limit buy at 100.00 rests with no fill guarantee; the one at 100.01 crosses and becomes a taker. Post-only at 100.00 is accepted as a maker, post-only at 100.01 is rejected because it would cross, and an IOC for 100 at 100.01 fills the 50 on offer and cancels 50 immediately.</p>"
                "<p>In the lab the level-1 bot of week 1 (step 8, <em>Go live on a local exchange</em>) sends a single limit buy at the best ask, which is a taker order in disguise, and the week-3 stretch turns it into a post-only order inside the spread so the <code>OrderAck</code> reports your queue position. In the arena a limit is not the safe choice: in a fast market the order that never fills is the expensive risk.</p>"
            ),
            "code": code("w1c5"),
        },
        {
            "name": "Six checks, cheapest first, and a SKIP is not a PASS",
            "explain": (
                "<p>Session 0's deliverable is a green smoke test: six checks in <code>tests/test_smoke.py</code>, ordered from cheapest to most dependent, so the first red line names the real problem. Python 3.11 or newer; the arena SDK imports; an LLM key is configured; market data is reachable; the engine matches correctly and a 50-tick offline session runs; the arena answers. Checks that need an external resource <em>skip</em> rather than fail, which makes <code>-v</code> a precise report of what is still unconfigured, and also makes it easy to screenshot a run that is not green.</p>"
                "<p>The snippet reproduces that logic. With the wifi off and no key, it prints three passes and three skips and refuses to call it green; fully configured, six passes. It also resolves the exchange address the way every bot does, shell environment over <code>.env</code> over the default <code>ws://localhost:8765</code>, and shows the trap: <code>make register</code> writes the hosted venue into <code>.env</code>, so a bot started next to a local exchange dials the cloud until you set <code>EXCHANGE_HOST=localhost</code> in the shell.</p>"
                "<p>In the lab this is the smoke-test one-pager: step 1 creates a private repo from the <a href=\"" + TEMPLATE + "\">team template</a>, step 3 runs <code>make sim</code> (no network, no excuses), step 5 is the graded six-pass run. In the arena, <code>ConnectionRefused</code> on the last check is almost never your bug: the exchange is down or the host is wrong. Checks 1, 2 and 5 pass with the wifi off, and those are the ones that are really yours.</p>"
            ),
            "code": code("w1c4"),
        },
    ],
    "widget": {
        "type": "orderbook",
        "title": "A limit order book around the AAPL touch: depth, spread and what a sweep costs",
        "params": {"levels": 8, "spread": 2, "seed": 33500, "mid": 185.49, "tick": 0.01, "size": 600, "imbalance": -0.26},
    },
    "pitfalls": [
        "Treating the mid as a price you can trade at. It is a mark; you buy at the ask and sell at the bid, plus the fee.",
        "Screenshotting '4 passed, 2 skipped' as the week-0 deliverable. The requirement is six passes and zero skips.",
        "Starting a local exchange with a .env that still points at the hosted venue, then debugging the wrong market. Set EXCHANGE_HOST=localhost in the shell.",
        "Believing a limit order is the safe choice. It trades certainty of price for the risk of not trading at all.",
    ],
    "check": [
        {
            "q": "Resting asks: A1 100.02 x 300 (oldest), A2 100.01 x 200, A3 100.01 x 100 (newest). A buy limit for 450 at 100.02 arrives. What is the fill sequence?",
            "options": [
                "A1 300 @ 100.02, then A2 150 @ 100.01",
                "A2 200 @ 100.01, A3 100 @ 100.01, A1 150 @ 100.02",
                "A2 200, A3 100, A1 150, all at 100.02 (the buyer's limit)",
                "A3 100 @ 100.01, A2 200 @ 100.01, A1 150 @ 100.02",
            ],
            "answer": 1,
            "why": "Price beats time, so both 100.01 offers go before A1; time breaks the tie, so A2 before A3; and each fill prints at the resting order's price, giving the buyer an average of 100.0133 rather than 100.02.",
        },
        {
            "q": "Best bid 185.48 x 400, best ask 185.50 x 680. Where does the microprice sit relative to the mid?",
            "options": [
                "Exactly at the mid",
                "Above the mid, because the ask is larger",
                "Below the mid, because the heavier ask pulls fair value toward the bid",
                "At the best ask",
            ],
            "answer": 2,
            "why": "The microprice weights each price by the opposite side's size: (185.48 x 680 + 185.50 x 400) / 1080 = 185.4874, 0.26 cents below the 185.49 mid. More size wants to sell.",
        },
        {
            "q": "With a 15 bps taker fee and a 10 bps maker rebate, you buy 100 shares at the $100.01 ask and sell them at the $99.99 bid. What is the net P&L?",
            "options": ["-$2.00", "-$17.00", "-$32.00", "+$18.00"],
            "answer": 2,
            "why": "The spread costs $2 and each leg pays 15 bps on about $10,000, so $15 twice: -2 - 30 = -$32. The fee on this venue is 7.5 times the whole spread.",
        },
        {
            "q": "The smoke test prints 4 passed, 2 skipped. What does that mean?",
            "options": [
                "The environment is green; skips are equivalent to passes",
                "Two external resources (for example the key or the network) are not configured, so the run is not green",
                "Two checks failed silently",
                "The test suite is broken",
            ],
            "answer": 1,
            "why": "Checks that need an external resource skip rather than fail so that -v names exactly what is missing. A skip is not a pass; the deliverable is six passes.",
        },
    ],
})

# ═══ Week 2 · Session 1 — UML and object-oriented Python ═══

SRC["w2c1"] = r'''import numpy as np
np.seterr(all="ignore")
import inspect
from abc import ABC, abstractmethod

class Trader(ABC):
    """The SDK contract: one abstract method, three optional hooks, one run()."""
    @abstractmethod
    def on_tick(self, market, portfolio):
        """Return a Signal or None. The only thing you must write."""
    def on_fill(self, side, symbol, quantity, price):
        pass
    def on_event(self, event, message, data):
        pass
    def on_ipo(self, symbol, lo, hi, shares, data):
        return None
    def run(self):
        return f"{type(self).__name__} connected (sockets, auth, reconnects handled here)"

print("abstract:", sorted(Trader.__abstractmethods__))
for name in ("on_tick", "on_fill", "on_event", "on_ipo", "run"):
    print(f"  {name:<8} {inspect.signature(getattr(Trader, name))}")

try:
    Trader()
except TypeError as e:
    print("Trader() ->", type(e).__name__ + ":", str(e).split(" with")[0])

class Forgetful(Trader):
    def on_tik(self, market, portfolio):        # a typo: the contract is NOT met
        return None

try:
    Forgetful()
except TypeError:
    print("Forgetful() -> TypeError at construction, not at 09:31 on session day")

class MyBot(Trader):
    def on_tick(self, market, portfolio):
        return None

bot = MyBot()
print("MyBot() ok | is a Trader:", isinstance(bot, Trader), "|", bot.run())
inherited = [n for n in ("on_fill", "on_event", "on_ipo", "run") if n not in vars(MyBot)]
print("inherited for free:", inherited)

# the alternative design: a plain registered function. Nothing checks it until it is called.
registry = {"typo_bot": lambda market, portfolio, extra: None}
try:
    registry["typo_bot"]({}, {})
except TypeError:
    print("function registry -> TypeError only when the engine first CALLS it")
'''

SRC["w2c2"] = r'''import numpy as np
np.seterr(all="ignore")

class Portfolio:
    """The engine writes; your strategy reads. The server is the source of truth."""
    def __init__(self, cash):
        self._cash = float(cash)
        self._positions = {}

    # --- engine side: one writer ---------------------------------------
    def apply_server_update(self, cash, positions):
        self._cash, self._positions = float(cash), dict(positions)

    # --- strategy side: read-only views --------------------------------
    @property
    def cash(self):
        return self._cash

    @property
    def positions(self):
        return dict(self._positions)            # a copy: mutating it changes nothing

    def can_buy(self, symbol, qty, price, fee_rate=0.0015):
        return qty * price * (1 + fee_rate) <= self._cash

    def can_sell(self, symbol, qty):
        return self._positions.get(symbol, 0) >= qty   # long-only week

p = Portfolio(100_000)
p.apply_server_update(4_000.0, {"AAPL": 20})
print(f"cash {p.cash:,.2f}  positions {p.positions}")
print("can_buy 20 AAPL @185.50:", p.can_buy("AAPL", 20, 185.50))
print("can_buy 22 AAPL @185.50:", p.can_buy("AAPL", 22, 185.50), " (fee included)")
print("can_sell 30 AAPL:", p.can_sell("AAPL", 30))

try:
    p.cash = 1e9
except AttributeError:
    print("p.cash = 1e9 -> AttributeError: no setter, you cannot print money")
view = p.positions
view["AAPL"] = 10_000
print("after editing the copy, real position:", p.positions["AAPL"])

# the classic Python trap on the same theme: a mutable CLASS attribute is shared
class BadBot:
    fills = []                                   # one list for every instance
    def on_fill(self, f):
        self.fills.append(f)

class GoodBot:
    def __init__(self):
        self.fills = []                          # one list per instance
    def on_fill(self, f):
        self.fills.append(f)

a, b = BadBot(), BadBot()
a.on_fill("buy 5 AAPL")
print("BadBot b.fills :", b.fills, "<- b never traded")
c, d = GoodBot(), GoodBot()
c.on_fill("buy 5 AAPL")
print("GoodBot d.fills:", d.fills)
'''

SRC["w2c3"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(33502)
N, SPREAD, FEE = 400, 0.02, 0.0015
mid = 185.0 * np.exp(np.cumsum(rng.normal(0, 0.0006, N)))       # one deterministic path

class Momentum:
    def __init__(self, lookback=20, qty=5):
        self.lookback, self.qty = lookback, qty
    def on_tick(self, prices, pos):                      # the ONE interface
        if len(prices) < self.lookback:
            return None
        avg = prices[-self.lookback:].mean()
        if prices[-1] > avg * 1.001:
            return ("buy", self.qty)
        if prices[-1] < avg * 0.999 and pos >= self.qty:
            return ("sell", self.qty)
        return None

class MeanReversion:
    def __init__(self, lookback=20, qty=5, band=0.003):
        self.lookback, self.qty, self.band = lookback, qty, band
    def on_tick(self, prices, pos):
        if len(prices) < self.lookback:
            return None
        avg = prices[-self.lookback:].mean()
        if prices[-1] < avg * (1 - self.band):
            return ("buy", self.qty)
        if prices[-1] > avg * (1 + self.band) and pos >= self.qty:
            return ("sell", self.qty)
        return None

def as_signal_fn(strategy):
    """Adapter: the simulator speaks signal_fn(symbol, prices, pos); a strategy speaks on_tick."""
    return lambda symbol, prices, pos: strategy.on_tick(prices, pos)

def simulate(signal_fn, cap=200):
    cash, pos, fees, n = 100_000.0, 0, 0.0, 0
    for t in range(N):
        sig = signal_fn("AAPL", mid[: t + 1], pos)       # sees only the past
        if sig is None:
            continue
        side, q = sig
        if side == "buy" and pos + q > cap:
            continue
        px = mid[t] + SPREAD / 2 if side == "buy" else mid[t] - SPREAD / 2   # taker crosses
        fee = FEE * px * q
        cash += (-px * q if side == "buy" else px * q) - fee
        pos += q if side == "buy" else -q
        fees, n = fees + fee, n + 1
    return cash + pos * mid[-1], fees, n

print(f"{'strategy':<24}{'net worth':>13}{'gross P&L':>11}{'fees':>9}{'fills':>7}")
for name, strat in [("momentum", Momentum()), ("reversion band=0.003", MeanReversion()),
                    ("reversion band=0.001", MeanReversion(band=0.001))]:
    nw, fees, n = simulate(as_signal_fn(strat))
    print(f"{name:<24}{nw:>13,.2f}{nw + fees - 100_000:>+11.2f}{fees:>9.2f}{n:>7}")
print("same engine, same call site, three behaviours: the engine never asked which class it had")
'''

SRC["w2c4"] = r'''import numpy as np
np.seterr(all="ignore")
from dataclasses import dataclass, asdict
from typing import Literal, get_args

@dataclass
class LooseSignal:                         # a dataclass stores whatever it is given
    symbol: str
    side: str
    quantity: int
    price: float

@dataclass(frozen=True)
class Signal:                              # the validated version: checked at construction
    symbol: str
    side: Literal["buy", "sell"]
    quantity: int
    price: float
    confidence: float = 1.0

    def __post_init__(self):
        errs = []
        if self.side not in get_args(Signal.__annotations__["side"]):
            errs.append(f"side={self.side!r} not in ('buy', 'sell')")
        if not isinstance(self.quantity, int) or isinstance(self.quantity, bool) or self.quantity <= 0:
            errs.append(f"quantity={self.quantity!r} must be a positive int")
        if not (isinstance(self.price, (int, float)) and self.price > 0):
            errs.append(f"price={self.price!r} must be > 0")
        if not 0.0 <= self.confidence <= 1.0:
            errs.append(f"confidence={self.confidence!r} outside [0, 1]")
        if errs:
            raise ValueError("; ".join(errs))

bad = LooseSignal("AAPL", "long", 2.5, -1)
print("LooseSignal accepted:", asdict(bad), "<- found three layers later, by the venue")

ok = Signal("AAPL", "buy", 5, 185.50)
print("Signal ok:", ok)
for args in [("AAPL", "long", 5, 185.5), ("AAPL", "buy", 2.5, 185.5),
             ("AAPL", "sell", 5, -1.0), ("AAPL", "buy", True, 185.5)]:
    try:
        Signal(*args)
    except ValueError as e:
        print("rejected:", e)
try:
    ok.quantity = 500
except Exception as e:
    print("mutating a sent Signal ->", type(e).__name__)
'''

SRC["w2c5"] = r'''import numpy as np
np.seterr(all="ignore")

class MarketData:
    def __init__(self, book):
        self._book = book
    def best_bid(self, s):
        return self._book[s][0]
    def best_ask(self, s):
        return self._book[s][1]

class Portfolio:
    def __init__(self, cash):
        self.cash = cash

class Strategy:                                     # an interface
    def generate_signal(self, md, pf):
        raise NotImplementedError

class Aggressive(Strategy):
    def generate_signal(self, md, pf):
        return ("buy", 5, md.best_ask("AAPL"))      # crosses: taker

class Passive(Strategy):
    def generate_signal(self, md, pf):
        return ("buy", 5, md.best_bid("AAPL"))      # joins the bid: maker

class Flat(Strategy):
    def generate_signal(self, md, pf):
        return None

class HandRolled:                                   # NOT a Strategy subclass: duck typing
    def generate_signal(self, md, pf):
        return ("sell", 1, md.best_bid("AAPL"))

class TraderBot:
    """Composition (filled diamond): the bot OWNS its MarketData and Portfolio,
    and HAS-A Strategy it can swap without changing a line of the bot."""
    def __init__(self, strategy):
        self.market = MarketData({"AAPL": (185.48, 185.50)})
        self.portfolio = Portfolio(100_000)
        self.strategy = strategy
    def tick(self):
        return self.strategy.generate_signal(self.market, self.portfolio)   # ONE call site

bot = TraderBot(Aggressive())
for s in (Aggressive(), Passive(), Flat(), HandRolled()):
    bot.strategy = s                                 # swap the decision rule at runtime
    kind = "Strategy subclass" if isinstance(s, Strategy) else "duck-typed"
    print(f"{type(s).__name__:<11} ({kind:<17}) -> {bot.tick()}")

print("TraderBot MRO:", [c.__name__ for c in type(bot).__mro__])
print("Passive IS-A Strategy:", issubclass(Passive, Strategy),
      "| TraderBot IS-A Strategy:", issubclass(TraderBot, Strategy))
print("owned parts:", {k: type(v).__name__ for k, v in vars(bot).items()})
'''

WEEKS.append({
    "n": 2,
    "title": "Session 1 · UML and object-oriented Python: model the trading domain, and your first bot connects and trades",
    "topics": [
        "classes, instances and where state lives",
        "the four pillars: abstraction, encapsulation, inheritance, polymorphism",
        "abstract base classes as a contract checked at construction",
        "dataclasses versus validated models: who checks the data",
        "composition over inheritance and the Strategy pattern",
        "UML class diagrams: the box, visibility, and the three arrows",
        "capability you leave with: model a trading domain; your first bot connects and trades",
    ],
    "concepts": [
        {
            "name": "The abstract base class is the contract, and Python checks it at construction",
            "explain": (
                "<p>The student SDK's <code>Trader</code> is an abstract base class with exactly one abstract method, <code>on_tick(market, portfolio)</code>, three optional hooks with harmless defaults (<code>on_fill</code>, <code>on_event</code>, <code>on_ipo</code>) and a <code>run()</code> you never override. That asymmetry is the design: the mandatory part is your edge, everything else is opt-in. The snippet rebuilds the same shape and asks Python, rather than the slides, what the contract is: <code>__abstractmethods__</code> lists one name and <code>inspect.signature</code> prints the five signatures.</p>"
                "<p>Then it makes the contract bite. <code>Trader()</code> raises <code>TypeError</code>; so does a subclass that misspells the method as <code>on_tik</code>, and it raises when the object is <em>built</em>, not when the engine first calls it in the middle of a session. A subclass that implements <code>on_tick</code> constructs and inherits the other four methods for free. The alternative design, registering a plain function, accepts a wrong signature silently and fails only on first call.</p>"
                "<p>In the lab this is steps 1 and 2 (<em>The contract is in the code, not in the slides</em> and <em>The ABC bites</em>): you introspect the real <code>arena.Trader</code>, watch <code>Trader()</code> raise, and Homework 1 asks you to argue in a paragraph what the ABC buys over the function registry. In the arena every team's bot is one of these subclasses; the engine holds a reference typed as <code>Trader</code> and never needs to know which of the ten teams it is calling.</p>"
            ),
            "code": code("w2c1"),
        },
        {
            "name": "Encapsulation drawn in the API: the engine writes, your strategy reads",
            "explain": (
                "<p>List the public surface of the objects your hook receives and two families of methods appear. <code>update_book</code>, <code>update_trade</code> and <code>apply_server_update</code> are written by the engine; <code>mid_price</code>, <code>best_bid</code>, <code>spread</code>, <code>net_worth</code>, <code>can_buy</code> and <code>can_sell</code> are read by you. Python has no private keyword, so encapsulation is a convention (a leading underscore) plus a <code>property</code> with no setter, and the point is organisational: one writer per piece of state, and the server is the source of truth for cash and positions.</p>"
                "<p>The snippet's <code>Portfolio</code> makes that concrete. After a server update to $4,000 and 20 AAPL, <code>can_buy</code> accepts 20 shares at 185.50 and refuses 22 because the taker fee is included in the check; <code>can_sell(30)</code> refuses because week 1 is long-only. Assigning <code>p.cash = 1e9</code> raises <code>AttributeError</code>, and editing the dictionary returned by <code>positions</code> leaves the real position at 20 because the property hands back a copy. The second half is the classic Python trap on the same theme: a mutable <em>class</em> attribute is one list shared by every instance, so bot <code>b</code> reports a fill it never had.</p>"
                "<p>In the lab this is step 3 (<em>The objects your hook receives = the boxes of your diagram</em>). In the arena it is why your bot never computes its own cash: the exchange sends portfolio updates, the engine applies them, and a bot that keeps a private ledger drifts from the venue's the first time a fee or a partial fill surprises it (week 9 reconciles the two on purpose).</p>"
            ),
            "code": code("w2c2"),
        },
        {
            "name": "Strategy pattern and adapter: two strategies, one interface, raced offline",
            "explain": (
                "<p>Inheritance is not the only tool. Make the decision rule a separate object with one method and the rest of the system can hold any of them. The snippet defines <code>Momentum</code> (buy when the last price is 0.1% above its 20-tick average) and <code>MeanReversion</code> (buy when it is a band below), both answering <code>on_tick(prices, pos)</code>. The simulator does not speak that interface: it calls <code>signal_fn(symbol, prices, pos)</code>. <code>as_signal_fn</code> is the adapter between the two, a one-line bridge that lets an unchanged strategy class run inside an engine written against a function signature.</p>"
                "<p>The race runs all three on one seeded 400-tick path with taker fills at the touch and the arena's 15 bps taker fee. Momentum trades 104 times, makes $546.71 gross and keeps $402.36 after $144.36 of fees. Reversion with a 0.3% band trades six times. Loosen the band to 0.1% and it trades 128 times, makes $143.69 gross, and still finishes <em>below</em> its $100,000 start because it paid $177.38 to get there. The strategy was right more often than it was wrong and lost money anyway.</p>"
                "<p>In the lab this is steps 6 and 7 (<em>Strategy pattern</em> and <em>Race them offline</em>): the same two classes run through the real <code>as_signal_fn</code> inside <code>SimSession</code>, and the leaderboard's fee column is the lesson. A new sample means a new symbol, a new parameter or a new week's rule set, not a new seed, because the default price paths are deterministic per symbol. In the arena the adapter is what lets one <code>on_tick</code> run live on the venue and offline in the simulator without a line changing.</p>"
            ),
            "code": code("w2c3"),
        },
        {
            "name": "Dataclass or validated model: decide who checks the data",
            "explain": (
                "<p>A dataclass removes the boilerplate of a value object: <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> are generated from the annotations. It does not check them. The snippet's <code>LooseSignal</code> accepts side <code>'long'</code>, a quantity of 2.5 and a negative price without complaint, and the error surfaces three layers later when the venue rejects the order, or worse, when something downstream quietly rounds it.</p>"
                "<p>The validated <code>Signal</code> moves the check to the boundary. A <code>Literal['buy', 'sell']</code> annotation plus a <code>__post_init__</code> that collects every violation rejects each bad input with a message naming the field, including the subtle one: <code>True</code> is an <code>int</code> in Python, so a naive <code>isinstance</code> check would accept a boolean quantity. <code>frozen=True</code> makes a Signal immutable once built, so nobody edits an order after the risk check has seen it. This is exactly the job pydantic v2 does for every message in the arena; the snippet does it in plain Python so you can see there is no magic, just validation at construction.</p>"
                "<p>In the lab the <code>Signal</code> your <code>on_tick</code> returns is a pydantic model (step 3 prints its fields and their <code>Literal</code> types), and week 3 treats the whole message module as the contract between processes. In the arena the rule is absolute: every message between processes is a model from the shared schema, never a raw dict, because a dict cannot refuse to be wrong.</p>"
            ),
            "code": code("w2c4"),
        },
        {
            "name": "Composition, polymorphism and the three arrows of a class diagram",
            "explain": (
                "<p>A UML class diagram is a design you can argue about before it costs anything. Three arrows carry most of it: the hollow triangle for inheritance (<code>MyTrader</code> IS-A <code>Trader</code>), the filled diamond for composition (the engine's <code>TraderBot</code> OWNS its <code>MarketData</code> and <code>Portfolio</code>, which live and die with it), and the dashed arrow for dependency (<code>on_tick</code> emits a <code>Signal</code>). A wrong relationship costs a minute on paper and a week in code.</p>"
                "<p>The snippet builds that picture. <code>TraderBot</code> owns a market and a portfolio and HAS-A strategy; it calls <code>self.strategy.generate_signal(...)</code> from exactly one line and does not care which class answers. Swap in <code>Aggressive</code> and the bot crosses at 185.50 as a taker, <code>Passive</code> joins the bid at 185.48 as a maker, <code>Flat</code> returns nothing, and <code>HandRolled</code>, which does not inherit from <code>Strategy</code> at all, works anyway because Python is duck-typed: if it has the method, it is a strategy. The MRO and <code>issubclass</code> lines show that <code>TraderBot</code> is not a strategy; it has one. Prefer HAS-A to IS-A when you only want to reuse behaviour.</p>"
                "<p>In the lab this is steps 4 and 5 (<em>Sketch the UML</em> and <em>Find the four pillars in the starter bot</em>); Homework 1 wants the diagram exported under <code>docs/uml/</code> with every box mapped to a file. In the arena this is the polymorphism the engine relies on: ten teams, ten behaviours, one call site.</p>"
            ),
            "code": code("w2c5"),
        },
    ],
    "widget": {
        "type": "tree-diagram",
        "title": "The SDK class model: inheritance, composition and the Signal your hook returns",
        "params": {
            "nodes": [
                {"id": "trader", "label": "Trader (ABC)", "level": 0},
                {"id": "mytrader", "label": "MyTrader", "level": 1},
                {"id": "bot", "label": "TraderBot (engine)", "level": 1},
                {"id": "strategy", "label": "Strategy", "level": 2},
                {"id": "market", "label": "MarketData", "level": 2},
                {"id": "portfolio", "label": "Portfolio", "level": 2},
                {"id": "signal", "label": "Signal (validated)", "level": 3},
                {"id": "order", "label": "PlaceOrder on the wire", "level": 4},
            ],
            "edges": [
                {"from": "trader", "to": "mytrader", "label": "IS-A"},
                {"from": "trader", "to": "bot", "label": "adapted by"},
                {"from": "mytrader", "to": "strategy", "label": "HAS-A"},
                {"from": "bot", "to": "market", "label": "owns"},
                {"from": "bot", "to": "portfolio", "label": "owns"},
                {"from": "strategy", "to": "signal", "label": "returns"},
                {"from": "market", "to": "signal", "label": "read by on_tick"},
                {"from": "portfolio", "to": "signal", "label": "can_buy / can_sell"},
                {"from": "signal", "to": "order", "label": "risk check, then send"},
            ],
        },
    },
    "pitfalls": [
        "Subclassing to reuse one helper method. Inheritance says IS-A; if you only want the behaviour, compose it.",
        "A mutable default at class level (fills = []) shared by every bot instance. Initialise per-instance state in __init__.",
        "Keeping a private cash ledger instead of reading the portfolio the engine maintains from server updates. It drifts at the first partial fill.",
        "Reading the leaderboard of one simulator run as evidence. Change the symbol, a parameter or the week's rules; changing the seed does not move the default price paths.",
    ],
    "check": [
        {
            "q": "A subclass of arena.Trader implements on_tik (a typo) instead of on_tick. When does the error surface?",
            "options": [
                "Never; on_tik is simply unused",
                "When the bot is constructed, as a TypeError, because on_tick is still abstract",
                "When the engine first calls on_tick during the session",
                "When the exchange rejects the first order",
            ],
            "answer": 1,
            "why": "An ABC refuses to instantiate any class that leaves an abstract method unimplemented, so the TypeError comes at construction. A plain function registry would only fail when first called, which is mid-session.",
        },
        {
            "q": "In the offline race, the loosened mean-reversion bot makes positive gross P&L yet ends below its starting capital. Why?",
            "options": [
                "The simulator marks positions at the bid",
                "Its fees across 128 taker fills exceed its gross trading profit",
                "The adapter as_signal_fn drops half its signals",
                "Mean reversion cannot make money on a random walk",
            ],
            "answer": 1,
            "why": "It made $143.69 gross and paid $177.38 in taker fees. The fee column, not the signal, decided the outcome; that is the lesson of the week-1 race.",
        },
        {
            "q": "Which UML relationship describes the engine's TraderBot and the Portfolio it creates and owns for its lifetime?",
            "options": [
                "Inheritance (hollow triangle)",
                "Composition (filled diamond)",
                "Dependency (dashed arrow)",
                "Realisation of an interface",
            ],
            "answer": 1,
            "why": "The bot creates the portfolio and it lives and dies with the bot: that is composition. Inheritance would claim TraderBot IS-A Portfolio, and a dependency is a transient use, like on_tick emitting a Signal.",
        },
        {
            "q": "Why does the validated Signal in the snippet explicitly reject quantity=True?",
            "options": [
                "Because True is not hashable",
                "Because bool is a subclass of int in Python, so a plain isinstance(q, int) check would accept it as 1",
                "Because frozen dataclasses cannot hold booleans",
                "Because Literal types forbid booleans",
            ],
            "answer": 1,
            "why": "isinstance(True, int) is True. Validation at the boundary has to handle Python's own surprises, which is one reason the arena delegates it to a schema library rather than to ad-hoc checks.",
        },
    ],
})

# ═══ Week 3 · Session 2 — concurrency and asyncio ═══

SRC["w3c1"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
import time

log = []

async def call(name, seconds):
    log.append(f"start {name}")
    await asyncio.sleep(seconds)          # waiting on "the network": the loop runs others
    log.append(f"done  {name}")
    return name

async def main():
    c = call("feed", 0.03)
    print("calling a coroutine function returns:", type(c).__name__, "- nothing has run:", log == [])
    c.close()                             # tidy up the never-awaited coroutine

    t = time.perf_counter()
    for name, s in (("feed", 0.03), ("quote", 0.02), ("order", 0.01)):
        await call(name, s)               # one after another
    seq = time.perf_counter() - t
    order_seq = list(log)
    log.clear()

    t = time.perf_counter()
    res = await asyncio.gather(call("feed", 0.03), call("quote", 0.02), call("order", 0.01))
    conc = time.perf_counter() - t
    print("sequential order :", [x for x in order_seq if x.startswith("done")])
    print("gather order     :", [x for x in log if x.startswith("done")])
    print("gather results   :", res, "(in argument order, not finish order)")
    print("sequential >= sum of waits (60 ms) :", seq >= 0.058)
    print("gather well under the sum (< 45 ms):", 0.029 < conc < 0.045 or conc < 0.75 * seq)

asyncio.run(main())

# CPU work does not overlap on one thread: the loop can only interleave at awaits
async def crunch(n):
    return sum(i * i for i in range(n))

async def cpu_main():
    return await asyncio.gather(*(crunch(200_000) for _ in range(3)))

print("CPU-bound gather still runs the three sums back to back:", len(asyncio.run(cpu_main())), "results")
'''

SRC["w3c2"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
from collections import deque

TICKS, WORK = 2000, 3        # the feed publishes every loop step; a decision costs 3 steps

async def feed(put, n):
    for seq in range(n):
        await put(seq)
        await asyncio.sleep(0)
    await put(None)

async def strategy(get, clock):
    worst, seen = 0, 0
    while (item := await get()) is not None:
        worst = max(worst, clock[0] - item)   # staleness in ticks: newest published - acted on
        seen += 1
        for _ in range(WORK):
            await asyncio.sleep(0)
    return seen, worst

async def run(mode):
    clock = [0]
    if mode == "conflate":                     # latest wins: drop stale book updates
        box, ready = deque(maxlen=1), asyncio.Event()
        async def put(x):
            if x is not None:
                clock[0] = x
            box.append(x)
            ready.set()
        async def get():
            await ready.wait()
            ready.clear()
            return box.popleft()
        _, (seen, worst) = await asyncio.gather(feed(put, TICKS), strategy(get, clock))
        return seen, worst, 1
    q = asyncio.Queue(maxsize=mode)
    peak = [0]
    async def put(x):
        if x is not None:
            clock[0] = x
        await q.put(x)                         # blocks when full: backpressure
        peak[0] = max(peak[0], q.qsize())
    _, (seen, worst) = await asyncio.gather(feed(put, TICKS), strategy(q.get, clock))
    return seen, worst, peak[0]

print(f"{'queue':<16}{'decisions':>10}{'worst staleness':>17}{'peak depth':>12}")
for mode, label in ((10_000, "maxsize=10_000"), (10, "maxsize=10"), (1, "maxsize=1"), ("conflate", "latest-wins")):
    seen, worst, peak = asyncio.run(run(mode))
    print(f"{label:<16}{seen:>10}{worst:>12} ticks{peak:>12}")
print("a big buffer adds no throughput here; it only lets the feed run ahead of the decision")
'''

SRC["w3c3"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
import time

def blocking_fetch():
    """Stands in for yfinance: blocking HTTP with no async API."""
    time.sleep(0.30)
    return 185.49

async def heartbeat(gaps, stop):
    last = time.perf_counter()
    while not stop.is_set():
        await asyncio.sleep(0.01)
        now = time.perf_counter()
        gaps.append(now - last)
        last = now

async def trial(style):
    gaps, stop = [], asyncio.Event()
    hb = asyncio.create_task(heartbeat(gaps, stop))
    await asyncio.sleep(0.05)                       # let the heartbeat settle
    before = len(gaps)
    if style == "blocking":
        price = blocking_fetch()                    # WRONG: the loop is frozen for 300 ms
    else:
        price = await asyncio.to_thread(blocking_fetch)   # RIGHT: the loop keeps running
    during = len(gaps) - before
    stop.set()
    await hb
    return price, max(gaps), during

for style in ("blocking", "to_thread"):
    price, worst, during = asyncio.run(trial(style))
    print(f"{style:<10} price {price}  heartbeats during the fetch: {'none' if during <= 1 else 'many'}"
          f"   worst gap > 250 ms: {worst > 0.25}")

# a watchdog you can leave in production: flag any tick whose on_tick overran its budget
BUDGET = 0.050
def on_tick_slow():
    time.sleep(0.08)
def on_tick_fast():
    return None
for fn in (on_tick_fast, on_tick_slow):
    t = time.perf_counter()
    fn()
    over = time.perf_counter() - t > BUDGET
    print(f"{fn.__name__:<13} over the 50 ms tick budget: {over}")
'''

SRC["w3c4"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio

LIMIT = 200          # position limit

async def risk_then_send(state, name, qty, lock=None):
    async def body():
        if state["pos"] + qty <= LIMIT:          # check ...
            await asyncio.sleep(0)               # ... an await: another task runs here ...
            state["pos"] += qty                  # ... act on a stale check
            state["sent"].append(name)
    if lock is None:
        await body()
    else:
        async with lock:                          # check-and-act is now one atomic step
            await body()

async def main(use_lock):
    state = {"pos": 150, "sent": []}
    lock = asyncio.Lock() if use_lock else None
    await asyncio.gather(*(risk_then_send(state, f"order{i}", 40, lock) for i in range(3)))
    return state

for use_lock in (False, True):
    s = asyncio.run(main(use_lock))
    print(f"lock={use_lock!s:<5}  sent={s['sent']}  final position={s['pos']}  "
          f"limit breached: {s['pos'] > LIMIT}")

# without an await between check and act there is no race: asyncio is atomic between awaits
async def no_await(state, qty):
    if state["pos"] + qty <= LIMIT:
        state["pos"] += qty

async def main2():
    state = {"pos": 150}
    await asyncio.gather(*(no_await(state, 40) for _ in range(3)))
    return state["pos"]

print("same logic, no await inside: final position =", asyncio.run(main2()))
'''

SRC["w3c5"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
import random

class ConnectionClosed(Exception):
    pass

class FlakyVenue:
    """Drops the socket at scripted moments; refuses connects while it is 'down'."""
    def __init__(self, drops, down_attempts):
        self.drops, self.down, self.attempt, self.msg = set(drops), down_attempts, 0, 0
    async def connect(self):
        self.attempt += 1
        if self.attempt in self.down:
            raise OSError("connect refused")
        return self
    async def recv(self):
        await asyncio.sleep(0)
        self.msg += 1
        if self.msg in self.drops:
            raise ConnectionClosed(f"dropped at message {self.msg}")
        return {"type": "book_snapshot", "n": self.msg}

async def run_bot(venue, want=12, base=0.001, cap=0.016, seed=33503):
    rng, got, delays, cleanups = random.Random(seed), 0, [], 0
    failures = 0
    while got < want:
        try:
            ws = await venue.connect()
            failures = 0                                 # healthy again: reset the backoff
            book = {}                                    # stale books are worse than none
            while got < want:
                m = await ws.recv()
                book[m["n"]] = m
                got += 1
        except (ConnectionClosed, OSError) as e:
            failures += 1
            d = min(cap, base * 2 ** (failures - 1)) * (0.5 + rng.random())   # expo + jitter
            delays.append(round(d * 1000, 2))
            print(f"  {type(e).__name__:<16} {str(e):<22} -> retry #{failures} in {d * 1000:5.2f} ms")
            await asyncio.sleep(d)
        finally:
            cleanups += 1
    return got, delays, cleanups

venue = FlakyVenue(drops={4, 9}, down_attempts={3, 4, 5})
got, delays, cleanups = asyncio.run(run_bot(venue))
print(f"received {got} messages over {venue.attempt} connects; backoff (ms) {delays}")

# supervision: cancel a task and let it clean up
async def quoting(log):
    try:
        while True:
            await asyncio.sleep(0.001)
    except asyncio.CancelledError:
        log.append("cancel resting orders")          # cleanup runs, then re-raise
        raise

async def supervisor():
    log = []
    t = asyncio.create_task(quoting(log))
    await asyncio.sleep(0.01)
    t.cancel()
    try:
        await t
    except asyncio.CancelledError:
        log.append("task cancelled cleanly")
    return log

print("supervisor:", asyncio.run(supervisor()))
'''

LOOP_TRACE_CODE = """async def listen(ws, market):          # task 1: the socket reader
    async for raw in ws:
        market.update(parse(raw))          # book snapshots, acks, fills

async def trading_loop(bot, market):   # task 2: calls YOUR hook
    while True:
        await asyncio.sleep(0.5)           # TICK_INTERVAL_SEC
        sig = bot.on_tick(market, bot.portfolio)   # synchronous!
        if sig and risk_ok(sig):
            await ws.send(to_order(sig).model_dump_json())

async def run():
    await asyncio.gather(listen(ws, market), trading_loop(bot, market))"""

WEEKS.append({
    "n": 3,
    "title": "Session 2 · Concurrency and asyncio: non-blocking market data and order handling on one event loop",
    "topics": [
        "concurrency versus parallelism; processes, threads and async",
        "the GIL and why threads do not speed up CPU work",
        "coroutines, tasks, gather and the event loop",
        "asyncio.Queue: producer/consumer, backpressure and conflation",
        "never block the loop; the one legitimate thread (yfinance)",
        "races between awaits, locks, cancellation and reconnection",
        "capability you leave with: non-blocking market data and order handling on one event loop",
    ],
    "concepts": [
        {
            "name": "Concurrency is structure, parallelism is execution: what gather really buys",
            "explain": (
                "<p>asyncio gives you concurrency on one thread: many tasks in progress, interleaved at every <code>await</code>. It does not give you parallelism, work happening at the same instant on several cores. That is the right tool for a trading bot, whose time goes on waiting for sockets, and the wrong one for number crunching. The snippet shows both halves. Calling a coroutine function runs nothing; it returns a coroutine object that only executes when awaited or wrapped in a task. Three waits of 30, 20 and 10 ms awaited one after another take the sum, at least 60 ms; the same three under <code>asyncio.gather</code> take roughly the longest one, finish in the order <code>order, quote, feed</code>, and still return their results in argument order.</p>"
                "<p>The last line is the caveat that the GIL enforces: three CPU-bound coroutines under <code>gather</code> run back to back, because a coroutine that never awaits never yields. Threads would not help either, since only one thread executes Python bytecode at a time; CPU work that must go faster goes to processes (week 6).</p>"
                "<p>In the lab this is step 1 (<em>Where is the loop? Ask the code</em>), where you find the two <code>create_task</code> calls in the engine's <code>run()</code>, and step 2 (<em>Concurrency is not parallelism, prove it</em>), the same three-call experiment at full scale: 3 s under <code>gather</code> against 6 s in sequence. In the arena your <code>on_tick</code> is the synchronous step in the middle of the trading-loop task, called every half second; the listen task is the one that keeps your view of the book current.</p>"
            ),
            "code": code("w3c1"),
        },
        {
            "name": "A bounded queue is backpressure; an unbounded one is a time machine",
            "explain": (
                "<p>The arena pipeline in miniature is a feed task putting book snapshots on an <code>asyncio.Queue</code> and a strategy task taking them off. When the consumer is slower than the producer, the queue's size decides what the strategy sees. The snippet makes that deterministic by measuring staleness in ticks instead of milliseconds: the feed publishes one snapshot per loop step and each decision costs three steps.</p>"
                "<p>With <code>maxsize=10_000</code> the strategy makes all 2,000 decisions, the queue peaks at 1,334 items, and the worst decision is made on a price 1,332 ticks old. Nothing got faster; the feed simply ran ahead. With <code>maxsize=10</code> the worst staleness is ten ticks, with <code>maxsize=1</code> one tick, because a full queue makes <code>put()</code> wait, which is backpressure. The fourth row is what a market-data consumer actually wants: a latest-wins box that overwrites the previous snapshot. It makes only 667 decisions, one per unit of work it can afford, and every one of them is on the newest book. When you cannot keep up, drop or coalesce stale updates; never buffer them.</p>"
                "<p>In the lab this is step 3 (<em>Feed → asyncio.Queue → strategy</em>), the same experiment timed on the wall clock: roughly 5 ms of worst lag at <code>maxsize=1</code> against about 2.4 seconds at <code>maxsize=10_000</code>, for the same total run time. Homework 2 promotes it to a proper entry point. In the arena a bot deciding on a two-second-old book is quoting prices that no longer exist, and the fill it gets is the one a faster team chose to give it.</p>"
            ),
            "code": code("w3c2"),
        },
        {
            "name": "One blocking call freezes every task, and the one legitimate thread",
            "explain": (
                "<p>The event loop can only switch tasks at an <code>await</code>. A synchronous call that takes 300 ms, whether <code>time.sleep</code>, <code>requests.get</code> or a slow pandas operation, holds the only thread for 300 ms, and every other task, including the one reading your fills off the socket, stops. The snippet runs a 10 ms heartbeat next to a fetch that blocks for 300 ms. Called directly, no heartbeat runs during the fetch and the worst gap exceeds 250 ms. Wrapped in <code>asyncio.to_thread</code>, the blocking call runs on a worker thread, the loop keeps beating, and the price arrives just the same.</p>"
                "<p>That is also the one legitimate thread in this codebase: <code>yfinance</code> is blocking HTTP with no async API, so the broker polls it from a thread that writes floats into a plain dict and never touches the loop. The snippet ends with the cheapest production safeguard there is: time every <code>on_tick</code> and flag any call over its budget.</p>"
                "<p>In the lab this is step 4 (<em>One blocking call freezes everything</em>, a worst heartbeat delay near 3,010 ms blocking against about 5 ms not), step 5 (<em>Detect it without guessing</em>, the slow-callback warning from <code>asyncio.run(main(), debug=True)</code>) and step 6 (<em>The one legitimate thread</em>, a single yfinance call measured at 3.6 s). In the arena, during a stall the venue keeps sending snapshots, acks and fills; your bot reads none of them and wakes up to trade on a stale book with a stale position.</p>"
            ),
            "code": code("w3c3"),
        },
        {
            "name": "Atomic between awaits, not across them: a race on the position limit",
            "explain": (
                "<p>asyncio removes most of the races that make threaded code hard, because a task is never interrupted between two lines that contain no <code>await</code>. It does not remove them all. Any check-then-act sequence with an <code>await</code> in the middle, such as \"is there room under my position limit?\" followed by \"send the order\", can interleave with another task that passes the same check against the same stale state.</p>"
                "<p>The snippet starts at a position of 150 with a limit of 200 and launches three 40-share orders concurrently. Without a lock all three pass the check before any of them updates the position, and the book ends at 270, 35% over the limit. With an <code>asyncio.Lock</code> around check and act, the first order goes and the other two see 190 and stop. The last line is the reassuring half: the same logic with no <code>await</code> inside it cannot race at all and also ends at 190. The practical rule is to keep risk checks synchronous where you can, and to lock only the critical sections that must span an await.</p>"
                "<p>In the lab the deck's <em>Race Conditions &amp; When You Still Need Locks</em> slide sets this up, and the lab's second consumer (stretch 1) is where students first see two tasks share state. In the arena the venue's own risk controls catch a breach, but only after the orders are on the wire: a rejected order still counts against your message quota, and in the risk weeks a breached limit can trigger liquidation.</p>"
            ),
            "code": code("w3c4"),
        },
        {
            "name": "Sockets drop: catch the close, reset state, back off with jitter, cancel cleanly",
            "explain": (
                "<p>A live connection will close under you: the venue restarts, the wifi blinks, a proxy times out. The loop that survives has four parts. It catches the close <em>around</em> the read loop rather than inside the handler; it throws away the old book on every reconnect, because a stale book is worse than none; it waits before retrying, doubling the delay after each consecutive failure up to a cap and multiplying by random jitter so a hundred clients do not reconnect in the same millisecond; and it resets the backoff once a connection is healthy again.</p>"
                "<p>The snippet scripts a venue that drops at messages 4 and 9 and refuses three connection attempts after the second drop. The bot logs each failure, backs off 0.78, 1.35, 2.74, 2.16 and 8.59 ms (seeded jitter on a doubling schedule, scaled down from the seconds a real client uses), and ends with its twelve messages over six connects. Note that messages 4 and 9 never arrived: a reconnect restores the stream, not the gap, which is why week 3 adds sequence numbers and snapshots. The second half is supervision: <code>task.cancel()</code> raises <code>CancelledError</code> inside the task at its next await, the task runs its cleanup (here, cancelling resting orders) and re-raises, and the supervisor confirms a clean exit.</p>"
                "<p>In the lab this is step 7 (<em>Survive a drop</em>, the sentence \"this is what kills student bots\"): you kill a local exchange and watch your bot log the reconnect and re-handshake by itself. In the arena the venue also cancels your resting orders when your socket closes, so a reconnecting bot starts flat on the book even though its position carried over.</p>"
            ),
            "code": code("w3c5"),
        },
    ],
    "widget": {
        "type": "code-trace",
        "title": "Two tasks, one loop: where your synchronous on_tick sits",
        "params": {
            "lang": "python",
            "code": LOOP_TRACE_CODE,
            "steps": [
                {"line": 13, "state": {"loop": "gather starts both tasks", "running": "run"}, "note": "Two tasks share one thread."},
                {"line": 2, "state": {"running": "listen", "waiting": "trading_loop (sleep 0.5 s)"}, "note": "listen awaits the socket; the loop is free."},
                {"line": 3, "state": {"running": "listen", "book": "updated from snapshot #1"}, "note": "A snapshot arrives and MarketData updates."},
                {"line": 7, "state": {"running": "trading_loop", "waiting": "listen (socket)"}, "note": "The tick timer fires."},
                {"line": 8, "state": {"running": "on_tick (sync)", "listen": "cannot run until on_tick returns"}, "note": "Your hook blocks the loop for as long as it runs."},
                {"line": 9, "state": {"running": "trading_loop", "signal": "buy 5 AAPL @ 185.50", "risk": "passes"}, "note": "Risk check is synchronous: atomic between awaits."},
                {"line": 10, "state": {"running": "send (await)", "waiting": "listen resumes"}, "note": "The await yields; listen drains queued snapshots and the ack."},
                {"line": 3, "state": {"running": "listen", "ack": "OrderAck queue_ahead=0", "fill": "TradeExecution 5 @ 185.50"}, "note": "Fills are read only while no hook is blocking."},
            ],
        },
    },
    "pitfalls": [
        "Calling time.sleep, requests or a heavy pandas job inside on_tick. It freezes the socket reader too; offload with asyncio.to_thread or move it off the hot path.",
        "An unbounded queue between feed and strategy. It hides the problem as latency; bound it, or keep only the latest snapshot.",
        "Check-then-act across an await (risk check, await, send) without a lock. Two tasks can both pass the check.",
        "Reconnecting in a tight loop, or keeping the old book after a reconnect. Back off with jitter and rebuild state from the venue.",
    ],
    "check": [
        {
            "q": "Three network calls of 3 s, 2 s and 1 s are awaited under asyncio.gather. About how long does it take, and in what order are the results returned?",
            "options": [
                "6 s; in finish order",
                "3 s; in argument order",
                "3 s; in finish order (1 s call first)",
                "1 s; in argument order",
            ],
            "answer": 1,
            "why": "The waits overlap, so the total is the longest wait. gather returns results in the order the awaitables were passed, even though the 1 s call finishes first.",
        },
        {
            "q": "The feed produces faster than the strategy can decide. Which queue design keeps decisions on fresh prices?",
            "options": [
                "An unbounded queue, so nothing is lost",
                "maxsize=10_000, to absorb bursts",
                "A latest-wins (conflating) buffer, or a very small bounded queue",
                "Two consumers reading the same unbounded queue in turn",
            ],
            "answer": 2,
            "why": "A large buffer only lets the producer run ahead: in the snippet the worst decision was 1,332 ticks stale. Book updates supersede each other, so coalescing to the newest one is correct.",
        },
        {
            "q": "What does the arena lose while a bot's on_tick blocks the loop for 3 seconds?",
            "options": [
                "Nothing; the exchange queues orders for it",
                "Its listen task stops reading snapshots, acks and fills, so its book and position go stale",
                "Only the heartbeat, which is cosmetic",
                "Its connection is dropped immediately",
            ],
            "answer": 1,
            "why": "One thread runs every task. While the hook blocks, the socket reader cannot run; the venue keeps sending, and the bot wakes up to decide on a stale view of the market and of its own position.",
        },
        {
            "q": "Why multiply the reconnect delay by random jitter?",
            "options": [
                "To make the logs harder to read",
                "So that many clients disconnected at once do not all retry at the same instant and overload the recovering server",
                "Because asyncio.sleep requires a float",
                "To reset the backoff after a success",
            ],
            "answer": 1,
            "why": "Synchronised retries (a thundering herd) can knock a restarting venue over again. Jitter spreads them out; the exponential part limits how often each client tries.",
        },
    ],
})

# ═══ Week 4 · Session 3 — socket streaming and protocols ═══

SRC["w4c1"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import struct

m1 = json.dumps({"type": "place_order", "symbol": "AAPL"}).encode()
m2 = json.dumps({"type": "place_order", "symbol": "MSFT"}).encode()

# what TCP may deliver for two sendall() calls: any re-chunking of the same bytes
stream = m1 + m2
chunkings = {"coalesced": [stream], "split": [stream[:20], stream[20:61], stream[61:]]}
for name, chunks in chunkings.items():
    print(f"{name:<10} recv sizes {[len(c) for c in chunks]}")
    try:
        print("   naive json.loads(recv) ->", [json.loads(c)["symbol"] for c in chunks])
    except json.JSONDecodeError as e:
        print("   naive json.loads(recv) -> JSONDecodeError:", e.msg)

def delimited(chunks, sep=b"\n"):
    """Fix 1: a delimiter. Buffer, split, keep the incomplete tail."""
    buf, out = b"", []
    for c in chunks:
        buf += c
        *whole, buf = buf.split(sep)
        out += [json.loads(w)["symbol"] for w in whole]
    return out

def length_prefixed(chunks):
    """Fix 2: a 4-byte big-endian length before every message."""
    buf, out = b"", []
    for c in chunks:
        buf += c
        while len(buf) >= 4 and len(buf) >= 4 + struct.unpack(">I", buf[:4])[0]:
            n = struct.unpack(">I", buf[:4])[0]
            out.append(json.loads(buf[4:4 + n])["symbol"])
            buf = buf[4 + n:]
    return out

nl = m1 + b"\n" + m2 + b"\n"
lp = struct.pack(">I", len(m1)) + m1 + struct.pack(">I", len(m2)) + m2
for cuts in ([len(nl)], [7, 30, 58], [1] * 10):
    parts, i = [], 0
    for k in cuts:
        parts.append(nl[i:i + k]); i += k
    parts.append(nl[i:])
    lparts, i = [], 0
    for k in cuts:
        lparts.append(lp[i:i + k]); i += k
    lparts.append(lp[i:])
    print(f"cuts {str(cuts):<32} delimiter -> {delimited(parts)}   length-prefix -> {length_prefixed(lparts)}")
'''

SRC["w4c2"] = r'''import numpy as np
np.seterr(all="ignore")
import base64
import hashlib
import os
import struct

GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"          # fixed by RFC 6455

def accept_key(client_key):
    return base64.b64encode(hashlib.sha1((client_key + GUID).encode()).digest()).decode()

key = "dGhlIHNhbXBsZSBub25jZQ=="                          # the RFC's own example nonce
request = ("GET / HTTP/1.1\r\nHost: localhost:8765\r\nUpgrade: websocket\r\n"
           "Connection: Upgrade\r\nSec-WebSocket-Key: " + key + "\r\nSec-WebSocket-Version: 13\r\n\r\n")
response = ("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
            "Sec-WebSocket-Accept: " + accept_key(key) + "\r\n\r\n")
print(request.splitlines()[0], "...", len(request), "bytes, once")
print(response.splitlines()[0])
print("Sec-WebSocket-Accept:", accept_key(key), "(RFC 6455 expects s3pPLMBiTxaQ9kYGzzhZRbK+xOo=)")

def frame(payload: bytes, mask_key: bytes | None):
    """A single final text frame. Clients MUST mask; servers must not."""
    b0 = 0x80 | 0x1                                           # FIN + opcode text
    n = len(payload)
    mbit = 0x80 if mask_key else 0
    head = struct.pack("!BB", b0, mbit | n) if n < 126 else struct.pack("!BBH", b0, mbit | 126, n)
    if mask_key:
        payload = bytes(c ^ mask_key[i % 4] for i, c in enumerate(payload))
        return head + mask_key + payload
    return head + payload

def unframe(data: bytes):
    fin, op = data[0] >> 7, data[0] & 0x0F
    masked, n, i = data[1] >> 7, data[1] & 0x7F, 2
    if n == 126:
        n, i = struct.unpack("!H", data[2:4])[0], 4
    if masked:
        k, i = data[i:i + 4], i + 4
        return fin, op, bytes(c ^ k[j % 4] for j, c in enumerate(data[i:i + n]))
    return fin, op, data[i:i + n]

msg = b'{"type":"place_order","symbol":"AAPL","side":"buy","price":185.5,"quantity":5}'
mask = bytes([0x37, 0xFA, 0x21, 0x3D])        # fixed here; a real client draws os.urandom(4)
wire = frame(msg, mask)
print(f"payload {len(msg)} B -> client frame {len(wire)} B (2 header + 4 mask)")
print("first bytes on the wire:", wire[:8].hex(" "))
fin, op, back = unframe(wire)
print(f"server unframes: fin={fin} opcode={op} (text) equal={back == msg}")
big = frame(b"x" * 300, None)
print("300-byte server frame header:", big[:4].hex(" "), "-> 126 means a 16-bit length follows")
'''

SRC["w4c3"] = r'''import numpy as np
np.seterr(all="ignore")
import json
from dataclasses import dataclass, asdict, fields, MISSING
from typing import Literal, Optional, get_args, get_origin, get_type_hints

class ValidationError(ValueError):
    pass

def _check(name, tp, v):
    if get_origin(tp) is Literal:
        return None if v in get_args(tp) else f"{name}: input should be one of {get_args(tp)}"
    if get_origin(tp) is not None and type(None) in get_args(tp):          # Optional[X]
        return None if v is None else _check(name, [a for a in get_args(tp) if a is not type(None)][0], v)
    if tp is float:
        return None if isinstance(v, (int, float)) and not isinstance(v, bool) else f"{name}: must be a number"
    if tp is int:
        return None if isinstance(v, int) and not isinstance(v, bool) else f"{name}: must be an integer"
    return None if isinstance(v, tp) else f"{name}: must be {tp.__name__}"

class Model:
    """A tiny pydantic: validate on construction, dump to JSON, parse from JSON."""
    def __post_init__(self):
        hints = get_type_hints(type(self))
        errs = [e for f in fields(self) if (e := _check(f.name, hints[f.name], getattr(self, f.name)))]
        if errs:
            raise ValidationError(f"{len(errs)} validation error(s) for {type(self).__name__}: " + "; ".join(errs))
    def model_dump_json(self):
        return json.dumps(asdict(self), separators=(",", ":"))
    @classmethod
    def model_validate(cls, d):
        missing = [f.name for f in fields(cls) if f.default is MISSING and f.name not in d]
        if missing:
            raise ValidationError(f"{cls.__name__}: field required: {missing}")
        return cls(**{f.name: d[f.name] for f in fields(cls) if f.name in d})

@dataclass
class PlaceOrder(Model):
    team_id: str
    symbol: str
    side: Literal["buy", "sell"]
    order_type: Literal["limit", "market", "post_only", "ioc"]
    price: Optional[float]
    quantity: int
    type: Literal["place_order"] = "place_order"
    stop_price: Optional[float] = None                 # added later, with a default

@dataclass
class OrderAck(Model):
    order_id: str
    symbol: str
    side: Literal["buy", "sell"]
    price: float
    quantity: int
    type: Literal["order_ack"] = "order_ack"
    queue_ahead: int = 0                                # added mid-season, with a default
    level_qty: int = 0

TYPE_MAP = {"place_order": PlaceOrder, "order_ack": OrderAck}   # the discriminated union

def parse_message(raw: str):
    d = json.loads(raw)
    cls = TYPE_MAP.get(d.get("type"))
    if cls is None:
        raise KeyError(f"Unknown message type: {d.get('type')!r}")
    return cls.model_validate(d)

o = PlaceOrder("me", "AAPL", "buy", "limit", 185.50, 5)
wire = o.model_dump_json()
print("wire:", wire)
print("round-trip equal?", parse_message(wire) == o)
for bad in ('{"type":"place_order","team_id":"me","symbol":"AAPL","side":"long","order_type":"limit","price":1.0,"quantity":1}',
            '{"type":"place_order","team_id":"me","symbol":"AAPL","side":"buy","order_type":"limit","quantity":1}',
            '{"type":"place_order","team_id":"me","symbol":"AAPL","side":"buy","order_type":"limit","price":"185.5","quantity":1.5}'):
    try:
        parse_message(bad)
    except ValidationError as e:
        print("rejected:", e)
old = parse_message('{"type":"order_ack","order_id":"a1","symbol":"AAPL","side":"buy","price":185.5,"quantity":5}')
print(type(old).__name__, "from an older venue parses: queue_ahead =", old.queue_ahead, "level_qty =", old.level_qty)
try:
    parse_message('{"type":"place_ordr","symbol":"AAPL"}')
except KeyError as e:
    print("unknown type ->", e)
'''

SRC["w4c4"] = r'''import numpy as np
np.seterr(all="ignore")
import json
from collections import Counter

VALID = {"place_order": {"symbol", "side", "price", "quantity"}, "cancel_order": {"order_id"}}

def handle(raw):
    """The venue's inbound guard: three ways input is wrong, none may end the session."""
    try:
        d = json.loads(raw)                                   # 1. not JSON at all
    except json.JSONDecodeError as e:
        return {"type": "error", "code": "PARSE_ERROR", "message": f"invalid JSON: {e.msg}"}
    t = d.get("type") if isinstance(d, dict) else None
    if t not in VALID:                                        # 2. unknown or missing tag
        return {"type": "error", "code": "PARSE_ERROR", "message": f"Unknown message type: {t!r}"}
    missing = VALID[t] - d.keys()                             # 3. known tag, bad fields
    if missing or (t == "place_order" and d.get("side") not in ("buy", "sell")):
        return {"type": "error", "code": "PARSE_ERROR",
                "message": f"{len(missing) + (d.get('side') not in ('buy', 'sell'))} validation errors for {t}"}
    return {"type": "order_ack" if t == "place_order" else "cancel_ack"}

frames = [
    '{"type":"place_order","symbol":"AAPL","side":"buy","price":185.5,"quantity":5}',
    '{"type":"place_order","symbol":"AAPL","side":"long"',             # truncated
    '{"type":"place_ordr","symbol":"AAPL"}',                           # typo in the tag
    '{"type":"place_order","symbol":"AAPL","side":"long"}',            # bad fields
    '[1, 2, 3]',                                                       # JSON, wrong shape
    '{"type":"cancel_order","order_id":"a1"}',
]
session_open, replies = True, Counter()
for i, raw in enumerate(frames, 1):
    try:
        r = handle(raw)
    except Exception:                                          # belt and braces: never raise out
        r = {"type": "error", "code": "INTERNAL"}
    replies[r["type"]] += 1
    print(f"frame {i}: {r['type']:<10} {r.get('message', '')}")
print(f"session still open: {session_open}   replies: {dict(replies)}")
'''

SRC["w4c5"] = r'''import numpy as np
np.seterr(all="ignore")

HEARTBEAT, TIMEOUT = 1.0, 3.0       # seconds: expect a ping every second, declare dead after three

def monitor(events):
    """Replay (t, kind, seq) events; detect sequence gaps and silent peers."""
    expected, last_heard, book_ok = 1, 0.0, True
    for t, kind, seq in events:
        if t - last_heard > TIMEOUT:
            print(f"t={t:5.1f}  silent for {t - last_heard:.1f}s > {TIMEOUT}s -> declare dead, reconnect, resubscribe")
            expected, book_ok = seq, False
        last_heard = t
        if kind == "hb":
            continue
        if kind == "snapshot":
            print(f"t={t:5.1f}  full snapshot seq={seq} -> book rebuilt from scratch")
            expected, book_ok = seq + 1, True
            continue
        if seq != expected:
            print(f"t={t:5.1f}  delta seq={seq}, expected {expected}: GAP of {seq - expected} -> "
                  "discard book, request snapshot")
            book_ok, expected = False, seq + 1
            continue
        expected += 1
        if book_ok:
            print(f"t={t:5.1f}  delta seq={seq} applied")
        else:
            print(f"t={t:5.1f}  delta seq={seq} ignored until a snapshot arrives")

events = [(0.0, "snapshot", 1), (0.4, "delta", 2), (0.8, "delta", 3), (1.0, "hb", 3),
          (1.3, "delta", 5), (1.6, "delta", 6), (1.9, "snapshot", 6), (2.2, "delta", 7),
          (3.0, "hb", 7), (7.5, "delta", 12), (7.6, "snapshot", 12), (7.9, "delta", 13)]
monitor(events)
'''

WEEKS.append({
    "n": 4,
    "title": "Session 3 · Socket streaming and protocols: typed WebSocket schemas, heartbeats, reconnection",
    "topics": [
        "the network stack in brief; TCP versus UDP",
        "sockets, request/response, streaming and pub/sub",
        "why WebSockets rather than HTTP polling; the upgrade handshake",
        "framing and serialisation: where a message ends",
        "a protocol is a versioned contract: schemas, discriminated unions, validation at the boundary",
        "malformed and unknown messages; heartbeats, sequence numbers and reconnection",
        "capability you leave with: typed WebSocket schemas, heartbeats, reconnection",
    ],
    "concepts": [
        {
            "name": "TCP hands you bytes, not messages: framing with a delimiter or a length prefix",
            "explain": (
                "<p>TCP guarantees that bytes arrive complete and in order. It guarantees nothing about where one message ends: two <code>sendall</code> calls can arrive as one <code>recv</code>, and one message can arrive across three. The snippet takes two 41-byte JSON orders and shows both failures of the naive reader, <code>json.loads(recv())</code>: the coalesced 82 bytes raise <em>Extra data</em>, and the split version raises on its first fragment.</p>"
                "<p>The two classic fixes are a delimiter and a length prefix. A delimiter reader appends every chunk to a buffer, splits on the separator and keeps the incomplete tail for next time; it needs a separator that cannot occur inside a message, which newline-delimited JSON satisfies. A length-prefix reader waits until it has four bytes of big-endian length plus that many bytes of body; it works for any payload, including binary, and is what most exchange protocols use. The snippet feeds both readers the same stream cut three ways, whole, at arbitrary offsets and one byte at a time, and both recover <code>['AAPL', 'MSFT']</code> every time. A reader that is correct only for the chunking your laptop happens to produce is not correct.</p>"
                "<p>In the lab this is step 1 (<em>TCP has no messages, only bytes</em>): <code>framing.py</code> delays the server's first read so both sends pile up, and you name the two fixes at the checkpoint. In the arena you never write this reader, because WebSocket framing (next concept) does it for you, but the same bug reappears whenever someone reads a raw TCP feed or tails a log file mid-write.</p>"
            ),
            "code": code("w4c1"),
        },
        {
            "name": "The WebSocket upgrade: one HTTP handshake, then full-duplex framed messages",
            "explain": (
                "<p>HTTP polling asks \"anything new?\" on a timer and pays a request, headers and latency every time. A market needs the server to push the moment something changes, and the client to send orders on the same connection. WebSocket starts as one ordinary HTTP request carrying <code>Upgrade: websocket</code> and a random <code>Sec-WebSocket-Key</code>; the server answers <code>101 Switching Protocols</code> with <code>Sec-WebSocket-Accept</code>, the base64 SHA-1 of the key concatenated with a fixed GUID; from then on the same TCP socket carries framed messages in both directions.</p>"
                "<p>The snippet computes the accept value for the RFC 6455 example key and reproduces the RFC's answer, <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code>. It then frames a 78-byte order the way a client must: one header byte for FIN plus opcode (<code>0x81</code>, a final text frame), one byte for the mask bit and the length (<code>0xce</code> = masked, 78), four mask bytes, and the payload XORed with them, 84 bytes in all. The server unframes it back to the identical bytes. Payloads of 126 bytes or more switch to a 16-bit extended length, visible in the 300-byte frame's <code>7e 01 2c</code>. Clients mask so that intermediaries cannot be tricked into caching attacker-chosen bytes; servers do not mask.</p>"
                "<p>In the lab this is step 2 (<em>The upgrade, by hand</em>): you open a raw socket to your own exchange, send the request and read <code>HTTP/1.1 101 Switching Protocols</code> back. In the arena the <code>websockets</code> library does all of this; knowing the bytes is what lets you debug a proxy or a TLS terminator that silently strips the upgrade.</p>"
            ),
            "code": code("w4c2"),
        },
        {
            "name": "A protocol is a versioned contract: typed models, a discriminated union, round-trip and reject",
            "explain": (
                "<p>Framing says where a message ends; the schema says what it means. The arena's message module is the contract between every process: two discriminated unions split by direction, eight message types a client may send and nine the venue may send back, each with a literal <code>type</code> field that tells the dispatcher which model to build. A contract has three properties you can test: a lossless round-trip, bad data that cannot be constructed, and a versioning rule that lets old and new peers talk.</p>"
                "<p>The snippet implements a small pydantic in plain Python to show there is no magic. Dataclass fields carry the types; <code>__post_init__</code> checks every field against its annotation, including <code>Literal</code> and <code>Optional</code>, and reports all violations at once; <code>model_dump_json</code> and <code>parse_message</code> go to the wire and back. The order round-trips equal. Side <code>'long'</code> is rejected, a missing price is rejected, and a string price with a fractional quantity produces two errors in one message. An <code>order_ack</code> from an older venue that lacks <code>queue_ahead</code> still parses, because fields added later carry defaults: add optional fields, never repurpose old ones. An unknown tag fails loudly at the boundary.</p>"
                "<p>In the lab this is steps 3 and 4 (<em>The contract</em> and <em>Round-trip, reject, and version</em>) against the real pydantic models: 21 known types, the same four experiments, and the observation that a <code>Literal</code> makes an illegal state unrepresentable rather than merely detected. In the arena the rule is written into the codebase itself: every message is a model, sent with <code>model_dump_json()</code> and parsed with the model class, never a raw dict.</p>"
            ),
            "code": code("w4c3"),
        },
        {
            "name": "Three ways input is wrong, and none may kill the session",
            "explain": (
                "<p>A public endpoint receives garbage: truncated frames, typos in the tag, fields of the wrong type, valid JSON of the wrong shape. The rule for a venue is that one bad frame must never take down a session, neither the sender's nor anyone else's. The inbound guard therefore distinguishes three failures, in order of cost: the bytes are not JSON; the JSON has no known <code>type</code>; the type is known but the fields fail validation. Each produces an error reply and a <code>continue</code>, never a <code>raise</code>, and the whole handler sits inside a last-resort <code>except</code> so that a bug in the guard itself degrades to an internal error rather than a dropped connection.</p>"
                "<p>The snippet feeds six frames through such a guard: a valid order gets an ack; a truncated frame, a misspelt tag, a known tag with a bad side, and a JSON list each get a <code>PARSE_ERROR</code> naming the problem; a valid cancel afterwards still works. The session is open at the end, with one ack, four errors and one cancel ack.</p>"
                "<p>In the lab this is step 5 (<em>The venue enforces it too</em>): you read the server's four-line inbound guard, send an invalid order and an unknown tag from a script, receive two <code>ErrorMsg</code> replies (<em>5 validation errors for PlaceOrder</em> and <em>Unknown message type</em>) and confirm the connection stayed open. In the arena exchange teams inherit this guard; a venue that crashes on a malformed frame loses every connected team at once, and reliability is the first thing an exchange team competes on.</p>"
            ),
            "code": code("w4c4"),
        },
        {
            "name": "Heartbeats and sequence numbers: detecting a dead peer and a missing message",
            "explain": (
                "<p>TCP will tell you when a connection closes cleanly. It will not tell you quickly when the peer has silently gone away, and it cannot tell you that a message you needed was never sent because the publisher restarted. Two small mechanisms cover both. A heartbeat, a message expected every second, turns silence into a signal: after a timeout of several missed beats the client declares the connection dead, reconnects and resubscribes. A sequence number on every incremental update turns a missing message into a gap you can see: when delta 5 arrives while you expected 4, the book you hold is wrong and the only safe move is to discard it and ask for a full snapshot.</p>"
                "<p>The snippet replays a scripted stream. Deltas 2 and 3 apply; delta 5 reveals a gap of one, the book is discarded, delta 6 is ignored until the snapshot at 1.9 s rebuilds it; then the stream goes silent for 4.5 s, beyond the 3 s timeout, so the client declares the peer dead, reconnects, ignores the first delta and resynchronises from the next snapshot. A replay can only notice silence when the next event arrives; a live client runs the same check on a timer, so it would have declared the peer dead at 6.0 s.</p>"
                "<p>In the lab the <code>BookSnapshot</code> you stream in step 6 (<em>Talk to the exchange by hand</em>) is a full snapshot every time, which is why the arena's feed is simple to consume; the deck's <em>Backpressure, Heartbeats &amp; Reconnection</em> slide covers the incremental case every real exchange feed uses. In the arena the engine rebuilds <code>MarketData</code> on every reconnect for exactly this reason, and week 9 kills the venue on purpose to watch it happen.</p>"
            ),
            "code": code("w4c5"),
        },
    ],
    "widget": {
        "type": "timeline",
        "title": "One connection's life, in milliseconds: upgrade, stream, drop, back off, resynchronise",
        "params": {
            "events": [
                {"t": 0, "label": "TCP connect", "note": "SYN, SYN-ACK, ACK to port 8765"},
                {"t": 2, "label": "HTTP GET + Upgrade", "note": "Sec-WebSocket-Key sent once"},
                {"t": 3, "label": "101 Switching Protocols", "note": "Sec-WebSocket-Accept checked"},
                {"t": 5, "label": "Handshake (team, role)", "note": "first typed client message"},
                {"t": 8, "label": "BookSnapshot stream", "note": "full snapshot per symbol"},
                {"t": 500, "label": "PlaceOrder", "note": "model_dump_json on the wire"},
                {"t": 502, "label": "OrderAck", "note": "queue_ahead tells your place in line"},
                {"t": 503, "label": "TradeExecution", "note": "fee and maker/taker attribution"},
                {"t": 1500, "label": "heartbeat missed x3", "note": "peer declared dead"},
                {"t": 1501, "label": "back off 1 s", "note": "exponential, with jitter"},
                {"t": 2501, "label": "reconnect + resubscribe", "note": "old book discarded"},
                {"t": 2510, "label": "fresh snapshot", "note": "state rebuilt from the venue"},
            ]
        },
    },
    "pitfalls": [
        "json.loads(sock.recv(4096)) on a raw TCP stream. It works on your laptop and fails on the first coalesced or split read.",
        "Sending hand-built dicts or f-string JSON. A typo in a field name is silently ignored or rejected downstream; build the model and dump it.",
        "Repurposing an existing field when the protocol changes. Add a new optional field with a default so older peers keep working.",
        "Letting one malformed inbound frame raise out of the handler. Reply with an error and continue; the session must survive.",
    ],
    "check": [
        {
            "q": "A client sends two JSON messages with two sendall() calls. What can the server's recv() return?",
            "options": [
                "Always exactly one message per recv",
                "Any chunking of the byte stream: both messages at once, or one split across reads",
                "Nothing until the client closes the socket",
                "Two messages, but possibly out of order",
            ],
            "answer": 1,
            "why": "TCP is an ordered byte stream with no message boundaries. Order is guaranteed; chunking is not. The fix is framing, a delimiter or a length prefix, or a protocol like WebSocket that frames for you.",
        },
        {
            "q": "An order_ack from an older venue omits queue_ahead, a field added mid-season. What should a well-versioned client schema do?",
            "options": [
                "Reject the message as invalid",
                "Parse it, filling queue_ahead with its declared default",
                "Crash, so the mismatch is noticed",
                "Guess queue_ahead from the book",
            ],
            "answer": 1,
            "why": "Fields added later carry defaults so old and new peers interoperate. The rule for evolving a live protocol: add optional fields, never repurpose or remove existing ones.",
        },
        {
            "q": "The venue receives {\"type\":\"place_ordr\"}. What is the correct behaviour?",
            "options": [
                "Close the connection to protect the matching engine",
                "Reply with a PARSE_ERROR naming the unknown type and keep the session open",
                "Ignore it silently",
                "Guess the nearest valid type and process it",
            ],
            "answer": 1,
            "why": "An unknown tag is rejected at the boundary with a clear error and a continue. Silent ignoring hides client bugs; closing the session punishes one typo with a lost connection; guessing is dangerous for orders.",
        },
        {
            "q": "Your book is built from incremental updates. Delta seq=5 arrives when you expected seq=4. What do you do?",
            "options": [
                "Apply delta 5; one missing update is noise",
                "Wait for delta 4 to arrive later",
                "Discard the book and request a full snapshot, ignoring deltas until it arrives",
                "Apply delta 5 twice to compensate",
            ],
            "answer": 2,
            "why": "A gap means your book no longer matches the venue's and every price derived from it may be wrong. Deltas cannot repair a gap; only a snapshot can.",
        },
    ],
})

# ═══ Week 5 · Session 4 — backtester architecture ═══

SRC["w5c1"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(33505)
N = 2000
px = 185.0 * np.exp(np.cumsum(rng.normal(0, 0.001, N)))

def sma(xs, k):
    return xs[-k:].mean()

def momentum(history, fast=5, slow=40):
    """+1 long / 0 flat. Receives prices[:i+1]: the past, and only the past."""
    if len(history) < slow:
        return 0
    return 1 if sma(history, fast) > sma(history, slow) else 0

def backtest(prices, strategy, half_spread_bps=0.0, fee_bps=0.0, qty=100):
    cash, pos, equity, trades = 100_000.0, 0, [], 0
    for i, p in enumerate(prices):
        target = strategy(prices[: i + 1]) * qty            # 1 DATA -> 2 STRATEGY
        delta = target - pos
        if delta:                                           # 3 EXECUTION: cross the spread
            side = np.sign(delta)
            fill = p * (1 + side * half_spread_bps / 1e4)
            cash -= delta * fill + abs(delta) * fill * fee_bps / 1e4   # 4 PORTFOLIO
            pos += delta
            trades += 1
        equity.append(cash + pos * p)                       # 5 RECORD: mark to market
    return np.array(equity), trades

def stats(eq):
    r = np.diff(eq) / eq[:-1]
    mdd = (eq / np.maximum.accumulate(eq) - 1).min()
    return {"ret": eq[-1] / eq[0] - 1, "mdd": mdd, "sharpe": r.mean() / r.std(ddof=1) * np.sqrt(252)}

eq, n = backtest(px, momentum)
print(n, "trades (frictionless)", {k: round(float(v), 4) for k, v in stats(eq).items()})
eq2, _ = backtest(px, momentum, half_spread_bps=1.0, fee_bps=15)
print(n, "trades (1 bp half-spread + 15 bps taker)", {k: round(float(v), 4) for k, v in stats(eq2).items()})

# prototype vectorised, validate event-driven: frictionless, the two must agree
s = np.array([momentum(px[: i + 1]) for i in range(N)])
vec_pnl = np.concatenate([[0.0], (s[:-1] * 100 * np.diff(px)).cumsum()])
print("vectorised == event-driven (frictionless):", np.allclose(vec_pnl, eq - 100_000))
print("equity invariant cash + pos * price holds at every tick: by construction of step 5")
'''

SRC["w5c2"] = r'''import numpy as np
np.seterr(all="ignore")
import pandas as pd

rng = np.random.default_rng(33505)
px = pd.Series(185.0 * np.exp(np.cumsum(rng.normal(0, 0.001, 2000))))
ret = px.pct_change()
sig = (px > px.rolling(40).mean()).astype(float)          # long above the 40-bar SMA

def report(name, r):
    r = r.dropna()
    eq = (1 + r).cumprod()
    print(f"{name:<24} total={eq.iloc[-1] - 1:+7.2%}  Sharpe={r.mean() / r.std() * np.sqrt(252):+6.2f}"
          f"  maxDD={(eq / eq.cummax() - 1).min():7.2%}")

report("BUG  sig[t] * ret[t]", sig * ret)                 # sig[t] needs close[t]: the move is already in
report("FIX  sig[t-1] * ret[t]", sig.shift(1) * ret)      # act on what you knew
report("buy & hold", ret)

# the event-driven loop makes the bug unexpressible: the strategy only ever holds the past
class PastOnly:
    def __init__(self, data, i):
        self._data, self._i = data, i
    def __getitem__(self, k):
        if isinstance(k, int) and k > self._i:
            raise LookupError(f"look-ahead: asked for bar {k} at bar {self._i}")
        return self._data[: self._i + 1][k]

def peeking_strategy(view, i):
    return 1.0 if view[i + 1] > view[i] else 0.0          # "buy if the next bar is up"

try:
    peeking_strategy(PastOnly(px.to_numpy(), 100), 100)
except LookupError as e:
    print("event-driven guard ->", e)
'''

SRC["w5c3"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(33505)
px = 185.0 * np.exp(np.cumsum(rng.normal(0, 0.001, 2000)))

def run(fast, slow, fee_bps, slip_bps):
    s = np.zeros(len(px))
    for i in range(slow, len(px)):
        s[i] = 1.0 if px[i - fast + 1: i + 1].mean() > px[i - slow + 1: i + 1].mean() else 0.0
    pos = np.concatenate([[0.0], s[:-1]])                  # trade on the next bar
    r = pos[1:] * np.diff(px) / px[:-1]
    turns = np.abs(np.diff(pos))                            # each change of position is a trade
    r = r - turns * (fee_bps + slip_bps) / 1e4
    eq = np.cumprod(1 + r)
    sharpe = r.mean() / r.std(ddof=1) * np.sqrt(252)
    return eq[-1] - 1, sharpe, (eq / np.maximum.accumulate(eq) - 1).min(), int(turns.sum())

print(f"{'fee':>5}{'slip':>6}{'return':>9}{'Sharpe':>8}{'maxDD':>9}{'trades':>8}")
for fee, slip in [(0, 0), (0, 1), (15, 0), (15, 1), (15, 5)]:
    ret, sh, dd, n = run(5, 40, fee, slip)
    print(f"{fee:>4}b{slip:>5}b{ret:>+9.2%}{sh:>+8.2f}{dd:>9.2%}{n:>8}")

print("\nthe turnover trap: same rule family, different speed, 15 bps per trade")
for fast, slow in [(2, 10), (5, 40), (20, 160)]:
    g = run(fast, slow, 0, 0)
    n_ = run(fast, slow, 15, 0)
    print(f"  fast={fast:>2} slow={slow:>3}  trades={g[3]:>4}  gross={g[0]:+7.2%}  net={n_[0]:+7.2%}"
          f"  cost drag={g[0] - n_[0]:6.2%}")
'''

SRC["w5c4"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(33505)
T = 4000
r = rng.normal(0, 0.001, T)                   # a market with NO edge in it
cut = T // 2

def sharpe(x):
    return x.mean() / x.std(ddof=1) * np.sqrt(252)

# 200 "strategies": random long/short rules, each a fixed pseudo-random pattern of bets
configs = rng.choice([-1.0, 1.0], size=(200, T))
pnl = configs[:, :-1] * r[1:]
is_sh = np.array([sharpe(p[:cut]) for p in pnl])
oos_sh = np.array([sharpe(p[cut:]) for p in pnl])
best = int(np.argmax(is_sh))
print(f"best of 200 in-sample: config #{best}  IS Sharpe {is_sh[best]:+.2f}  ->  OOS Sharpe {oos_sh[best]:+.2f}")
print(f"mean IS Sharpe of all 200: {is_sh.mean():+.2f}   corr(IS, OOS) across configs: {np.corrcoef(is_sh, oos_sh)[0, 1]:+.2f}")

# how good does the best of N look when nothing works? (expected max of N noise Sharpes)
n_obs = cut - 1
se = np.sqrt(252 / n_obs)                     # s.e. of an annualised Sharpe estimate
for n in (1, 10, 50, 200, 1000):
    sims = rng.normal(0, se, size=(2000, n)).max(axis=1)
    print(f"  N={n:>4} trials: typical best in-sample Sharpe of pure noise = {np.median(sims):+.2f}")
print("the test half is touched once; every extra look is another trial")
'''

SRC["w5c5"] = r'''import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(33505)
T, phi = 20000, 0.15
e = rng.normal(0, 0.001, T)
r = np.empty(T)
r[0] = e[0]
for t in range(1, T):
    r[t] = phi * r[t - 1] + e[t]              # a short-lived edge: returns persist for ~1 tick

sig = np.sign(r)                               # "the last move continues"
print(f"{'delay':>6}{'gross bps/tick':>17}{'net of 1 bp':>13}{'Sharpe (net)':>14}")
for k in range(0, 5):
    # decided at the close of t, executed k ticks later: earns r[t+1+k]
    pnl = sig[: T - 1 - k] * r[1 + k:]
    net = pnl - 0.0001 * np.abs(np.diff(np.concatenate([[0], sig[: T - 1 - k]])))
    print(f"{k:>6}{pnl.mean() * 1e4:>17.3f}{net.mean() * 1e4:>13.3f}{net.mean() / net.std() * np.sqrt(252):>14.2f}")
print("the edge is phi^(k+1) of the move: a backtest that fills at the decision price assumes k = 0")
'''

def _lookahead_curves():
    """Equity curves for the week-5 widget: the same series as snippet w5c2."""
    import numpy as np
    rng = np.random.default_rng(33505)
    px = 185.0 * np.exp(np.cumsum(rng.normal(0, 0.001, 2000)))
    ret = np.concatenate([[np.nan], np.diff(px) / px[:-1]])
    sma = np.convolve(px, np.ones(40) / 40, mode="full")[: len(px)]
    sma[:39] = np.nan
    sig = (px > sma).astype(float)
    lag = np.concatenate([[np.nan], sig[:-1]])
    out = []
    for name, r in (("BUG sig[t]*ret[t]", sig * ret), ("FIX sig[t-1]*ret[t]", lag * ret), ("buy & hold", ret)):
        eq = np.cumprod(1 + np.nan_to_num(r))
        xs = list(range(0, 2000, 50)) + [1999]
        out.append({"name": name, "x": xs, "y": [round(float(eq[i]), 4) for i in xs]})
    return out


WEEKS.append({
    "n": 5,
    "title": "Session 4 · Backtester architecture: event-driven replay, fills and fees, look-ahead bias (first IPO)",
    "topics": [
        "what a backtest is and is not; event-driven versus vectorised",
        "the event loop: data, strategy, execution, portfolio, record",
        "fill simulation, slippage, transaction costs and market impact",
        "metrics: return, Sharpe, maximum drawdown, turnover",
        "look-ahead, survivorship, data snooping and regime change",
        "in-sample versus out-of-sample; the headless simulator; one strategy live and offline",
        "the first IPO of the season: bookbuild, pricing, allocation, listing",
        "capability you leave with: event-driven replay, fills and fees, look-ahead bias",
    ],
    "concepts": [
        {
            "name": "The five-stage event loop, and why you validate event-driven what you prototyped vectorised",
            "explain": (
                "<p>A backtester is a loop over events with five stages: <strong>data</strong> (the next bar or snapshot), <strong>strategy</strong> (a target position computed from what is known so far), <strong>execution</strong> (a simulated fill), <strong>portfolio</strong> (cash and position updated, fees charged) and <strong>record</strong> (equity marked to market). The design rule that makes it trustworthy is in one argument: the strategy is handed <code>prices[:i+1]</code>, the past and only the past.</p>"
                "<p>The snippet is that loop in twenty lines, trading 100 shares of a seeded 2,000-tick path with a 5/40 moving-average crossover. Frictionless, it makes 93 trades and loses 0.51% with a Sharpe of -0.33. Add a one-basis-point half-spread and the arena's 15 bps taker fee and the same 93 trades lose 3.24% at a Sharpe of -1.78: honest fills cross the spread, and the fee is not a rounding error. The last check is the working method of the whole week: prototype vectorised, because a column operation is fast enough to sweep, then validate with the event-driven loop, because it cannot cheat. Frictionless, the vectorised P&amp;L and the event-driven equity agree tick for tick.</p>"
                "<p>In the lab this is steps 1 and 2 (<em>Read the reference event loop</em> in <code>make sim</code>, then <em>Write the loop yourself</em> as <code>/tmp/w4/bt.py</code>, which reports trades, return, Sharpe and drawdown). Step 3 (<em>One on_tick, two worlds</em>) runs your unchanged <code>MomentumBot.on_tick</code> inside the headless simulator through <code>as_signal_fn</code>. In the arena that is the point of the simulator: it shares the matching engine, the fee schedule and the scoring code with the live venue, so an offline result is the same arithmetic as a live one.</p>"
            ),
            "formula": "E_t = \\text{cash}_t + q_t\\,P_t,\\qquad \\text{SR} = \\frac{\\bar r}{s_r}\\sqrt{252},\\qquad \\text{MDD} = \\min_t\\Big(\\frac{E_t}{\\max_{s\\le t}E_s}-1\\Big)",
            "code": code("w5c1"),
        },
        {
            "name": "Look-ahead bias: one missing shift(1), and why the event-driven loop cannot express it",
            "explain": (
                "<p>Look-ahead bias is using information that did not exist at decision time. Its most common form is one index deep: a signal computed from today's close multiplied by today's return. The return <code>ret[t]</code> is the move <em>into</em> bar <code>t</code>, and <code>sig[t]</code> needs <code>close[t]</code> to exist, so the product earns a move the strategy could only have known about after it happened.</p>"
                "<p>The snippet plants the bug in a vectorised pandas backtest of \"long above the 40-bar average\". The buggy version reports +21.90% at a Sharpe of 2.40 with a 0.63% maximum drawdown, a curve any allocator would fund. Shift the signal by one bar and the same rule on the same prices loses 1.82% at a Sharpe of -0.21; buy and hold lost 3.90%. Nothing about the strategy changed except when it was allowed to know the price. The second half shows why the course builds the loop by hand: when the strategy receives a view that only holds the past, the peeking rule \"buy if the next bar is up\" does not produce a fake Sharpe, it raises <code>look-ahead: asked for bar 101 at bar 100</code>. A vectorised column makes the sin a one-character typo; the event-driven design makes it unexpressible.</p>"
                "<p>In the lab this is step 4 (<em>Plant a look-ahead bug, then catch it</em>), where the planted bug turns Sharpe 0.05 into 2.50 and you point at the missing <code>.shift(1)</code> at the checkpoint. The subtler relatives, today's index membership used for last year (survivorship) or a restated figure used before its release date, are the deck's point-in-time slides. In the arena a strategy whose offline Sharpe collapses live is almost always one of these.</p>"
            ),
            "formula": "\\text{PnL}^{\\text{bug}}_t = s_t\\,r_t \\quad\\text{vs}\\quad \\text{PnL}_t = s_{t-1}\\,r_t,\\qquad r_t = \\frac{P_t}{P_{t-1}}-1",
            "code": code("w5c2"),
        },
        {
            "name": "Costs and the turnover trap: Sharpe and drawdown move monotonically with the fee",
            "explain": (
                "<p>Every trade pays half the spread on the way in and on the way out, plus a fee, plus impact if it is large. A backtest that ignores these is testing a different strategy from the one you will run. The snippet runs the fully invested 5/40 crossover through a cost grid: frictionless it returns -2.70%; one basis point of slippage takes it to -3.60%; the arena's 15 bps taker fee takes it to -15.38%, and 15 bps plus 5 bps of slippage to -19.23%. Sharpe falls monotonically and the maximum drawdown converges on the total return, which means the curve only ever goes down.</p>"
                "<p>The second table is the turnover trap. Speed up the same rule to 2/10 and it trades 257 times; the gross result is almost flat at -0.87%, and 15 bps per trade turns it into -32.60%. Slow it to 20/160 and it trades 22 times with a 3.18% cost drag. Cost scales with turnover, not with conviction, so the fastest variant of a strategy is usually the one that dies first once costs are honest. That is also why a parameter search that ignores costs systematically selects the most active configuration.</p>"
                "<p>In the lab this is step 5 (<em>Add costs; watch Sharpe and drawdown move</em>): the lab's 86-trade momentum strategy loses 4% of capital and 2.7 of Sharpe to the 15 bps fee, and the checkpoint asks for a cost table where Sharpe degrades monotonically with <code>fee_bps</code>. In the arena this is the week-1 race again, with the arithmetic made explicit: the maker rebate is the only cost line that can be positive, which is why passive execution is a strategy decision and not an implementation detail.</p>"
            ),
            "formula": "r^{\\text{net}}_t = q_{t-1}\\,r_t - |q_t - q_{t-1}|\\,(f + s),\\qquad \\text{cost drag} \\approx \\text{turnover}\\times(f+s)",
            "code": code("w5c3"),
        },
        {
            "name": "In-sample, out-of-sample, and how good the best of N looks when nothing works",
            "explain": (
                "<p>Every configuration you try is a trial, and the maximum of many noisy Sharpe estimates is biased upward even when every one of them is zero in truth. That is data snooping, and the only defence that works in practice is discipline about data: tune on the first part of the sample, judge on the second, and touch the test part once.</p>"
                "<p>The snippet builds a market with no edge in it and 200 random long/short rules. The best of them in-sample has a Sharpe of +0.98; out of sample the same rule scores -0.29. Across all 200 rules the correlation between in-sample and out-of-sample Sharpe is +0.02: the in-sample ranking carries no information. The second half computes how good the winner of N trials typically looks on pure noise over this sample length: about +0.54 for 10 trials, +0.97 for 200 and +1.14 for 1,000. A backtest Sharpe means nothing without the number of configurations that were tried to find it.</p>"
                "<p>In the lab this is step 6 (<em>In-sample vs out-of-sample</em>): tune the slow window on the first half of four symbols, judge on the second, once. The two uncomfortable lessons the lab draws are that the in-sample winner is almost always the configuration that trades least, so the \"edge\" you selected was a cost reduction, and that the in-sample Sharpe says nothing useful about the out-of-sample one. In the arena regime change makes this worse: the instructor's shocks (a Fed hike, a flash crash) are exactly the out-of-sample events a tuned parameter never saw.</p>"
            ),
            "formula": "\\mathbb{E}\\Big[\\max_{i\\le N}\\widehat{\\text{SR}}_i\\Big] \\approx \\sigma_{\\widehat{\\text{SR}}}\\,\\sqrt{2\\ln N} > 0 \\quad\\text{even when every true SR}_i = 0",
            "code": code("w5c4"),
        },
        {
            "name": "Latency in the fill model: a short-lived edge dies between decision and fill",
            "explain": (
                "<p>A backtest that fills at the price the strategy saw assumes zero latency: the decision, the order's trip to the venue and the match all happen at once. For slow signals that is harmless. For microstructure signals, whose predictive power lives for a tick or two, it is the whole result. The honest fill model executes a decision made at the close of tick <code>t</code> at tick <code>t + 1 + k</code>, where <code>k</code> is your delay in ticks.</p>"
                "<p>The snippet builds returns with a small, short-lived persistence (each return carries 15% of the previous one) and trades the obvious signal: the last move continues. With no delay it earns 1.26 bps per tick gross, 0.37 net of a one-basis-point cost, a positive Sharpe. One tick of delay cuts the gross edge to 0.29 bps and the net result goes negative; by three ticks the gross edge is indistinguishable from zero. The edge decays as the persistence coefficient raised to the power of the delay, so the same signal is a strategy for a fast participant and a cost for a slow one.</p>"
                "<p>In the lab the <code>SimSession</code> models this explicitly: your order is matched on the next engine tick, not at the price your <code>on_tick</code> read, and the deck's <em>Fill Simulation &amp; Slippage</em> slide asks you to state your fill assumption before you quote a result. In the arena latency is a purchasable upgrade (co-location in the upgrade shop) precisely because it changes which signals are worth trading; week 6 measures your own <code>on_tick</code> latency, which is the part of the delay you control.</p>"
            ),
            "formula": "r_t = \\phi\\,r_{t-1} + \\varepsilon_t \\;\\Rightarrow\\; \\mathbb{E}[\\operatorname{sign}(r_t)\\,r_{t+1+k}] \\propto \\phi^{\\,k+1}",
            "code": code("w5c5"),
        },
    ],
    "widget": {
        "type": "curve",
        "title": "The look-ahead trap on one path: the buggy signal, the shifted signal and buy and hold",
        "params": {"xlab": "Tick", "ylab": "Equity (start = 1)", "log": False, "series": _lookahead_curves()},
    },
    "pitfalls": [
        "Multiplying sig[t] by ret[t] in a vectorised backtest. Shift the signal one bar, and validate with a loop that only hands the strategy the past.",
        "Filling at the mid, or at the price the strategy saw. Honest fills cross the spread, pay the fee and arrive after your latency.",
        "Selecting the parameter with the best in-sample Sharpe and reporting that Sharpe. Report the out-of-sample number and how many configurations you tried.",
        "Changing only the random seed to get a 'second sample' in the simulator. The default price paths are deterministic per symbol; vary the symbol or the week.",
    ],
    "check": [
        {
            "q": "A vectorised backtest computes pnl = sig * ret where sig[t] uses close[t] and ret[t] = close[t]/close[t-1] - 1. What is wrong?",
            "options": [
                "Nothing; the signal and the return are aligned",
                "Look-ahead: the position for the move into bar t is decided with close[t], which is only known after that move",
                "Survivorship bias",
                "The Sharpe ratio should be annualised with sqrt(365)",
            ],
            "answer": 1,
            "why": "The fix is sig.shift(1) * ret. In the snippet the bug turns a -0.21 Sharpe into +2.40 on the same prices and rule.",
        },
        {
            "q": "The same crossover rule is run at three speeds with a 15 bps fee. Which statement matches the turnover trap?",
            "options": [
                "The fastest variant has the smallest cost drag because it holds positions briefly",
                "Cost drag scales with the number of trades, so the fastest variant loses the most to fees",
                "Fees are proportional to profit, so losing strategies pay no fees",
                "Turnover affects Sharpe but not return",
            ],
            "answer": 1,
            "why": "Each position change pays the fee. The 2/10 variant traded 257 times and lost 31.7% to costs; the 20/160 variant traded 22 times and lost 3.2%.",
        },
        {
            "q": "You try 200 configurations on data with no edge and pick the best in-sample Sharpe. What should you expect out of sample?",
            "options": [
                "About the same Sharpe, slightly lower",
                "Roughly zero: the in-sample winner was selected on noise",
                "A higher Sharpe, because the best configuration generalises",
                "Exactly the negative of the in-sample Sharpe",
            ],
            "answer": 1,
            "why": "The maximum of 200 noisy estimates is biased upward (about +1 here) while the true Sharpe is zero. In the snippet the winner scored -0.29 out of sample and the IS/OOS correlation was +0.02.",
        },
        {
            "q": "A signal's edge comes from returns that persist for about one tick. What happens to it with one extra tick of execution delay?",
            "options": [
                "Nothing; delay only affects fees",
                "It shrinks by roughly the persistence factor and may no longer cover costs",
                "It doubles, because the move has more time to develop",
                "It becomes a mean-reversion signal",
            ],
            "answer": 1,
            "why": "The expected payoff scales with phi^(k+1). In the snippet one tick of delay cut the gross edge from 1.26 to 0.29 bps per tick and the net result went negative.",
        },
    ],
})

# ═══ Week 6 · Session 5 — algorithmic complexity and data structures ═══

SRC["w6c1"] = r'''import numpy as np
np.seterr(all="ignore")
import bisect

class Counted:
    """Wrap values so every comparison is counted: an operation count, not a stopwatch."""
    n = 0
    __slots__ = ("v",)
    def __init__(self, v):
        self.v = v
    def __lt__(self, o):
        Counted.n += 1
        return self.v < o.v
    def __eq__(self, o):
        Counted.n += 1
        return self.v == o.v
    def __hash__(self):
        return hash(self.v)

def cost(fn):
    Counted.n = 0
    fn()
    return Counted.n

print(f"{'operation':<28}{'n=1,000':>10}{'n=10,000':>10}{'n=100,000':>11}")
rows = {"O(1)     dict lookup": [], "O(log n) bisect on sorted": [], "O(n)     list scan (miss)": []}
for n in (1_000, 10_000, 100_000):
    keys = [Counted(i) for i in range(n)]
    d = {k: i for i, k in enumerate(keys)}
    probe_hit, probe_miss = Counted(n // 2), Counted(-1)
    rows["O(1)     dict lookup"].append(cost(lambda: d[probe_hit]))
    rows["O(log n) bisect on sorted"].append(cost(lambda: bisect.bisect_left(keys, probe_hit)))
    rows["O(n)     list scan (miss)"].append(cost(lambda: probe_miss in keys))
for name, c in rows.items():
    print(f"{name:<28}" + "".join(f"{x:>10,}" for x in c[:2]) + f"{c[2]:>11,}")
print("comparisons per lookup: flat, +3.3 per 10x, x10 per 10x -- the shape names the class")
'''

SRC["w6c2"] = r'''import numpy as np
np.seterr(all="ignore")
import bisect
import heapq

rng = np.random.default_rng(33506)
prices = np.round(100 + rng.normal(0, 0.5, 20_000), 2)

# workload: insert every order, ask "best bid?" after each insert
heap, sl = [], []
heap_moves = list_moves = 0
best_h, best_l = [], []
for p in prices:
    # heap: push = sift up, at most log2(n) swaps (count the swaps we would do)
    heapq.heappush(heap, -p)
    heap_moves += max(1, len(heap).bit_length())       # upper bound on sift steps
    best_h.append(-heap[0])                             # O(1) peek
    # sorted list: insort shifts every element after the insertion point
    i = bisect.bisect_left(sl, p)
    list_moves += len(sl) - i
    sl.insert(i, p)
    best_l.append(sl[-1])
print(f"orders: {len(prices):,}")
print(f"heap        element moves (upper bound): {heap_moves:>12,}")
print(f"sorted list element moves (insort)     : {list_moves:>12,}")
print(f"ratio: {list_moves / heap_moves:,.0f}x   same best bid after every insert: {best_h == best_l}")

# the version the lab races: re-sort the whole list on every insert
resort_cost = sum(k * max(1, k.bit_length()) for k in range(1, len(prices) + 1))
print(f"re-sort on every insert ~ n log n each  : {resort_cost:>12,} comparisons "
      f"({resort_cost / heap_moves:,.0f}x the heap)")
'''

SRC["w6c3"] = r'''import numpy as np
np.seterr(all="ignore")
import heapq
from itertools import count

class BidSide:
    """Heap for 'best?', dict for 'where is order X?'. Cancels are lazy."""
    def __init__(self):
        self.heap, self.live, self.seq = [], {}, count()
    def add(self, oid, px, qty):
        self.live[oid] = (px, qty)
        heapq.heappush(self.heap, (-px, next(self.seq), oid))       # O(log n)
    def cancel(self, oid):
        return self.live.pop(oid, None) is not None                 # O(1): leave the heap alone
    def best(self):
        popped = 0
        while self.heap and self.heap[0][2] not in self.live:       # lazy cleanup at the top only
            heapq.heappop(self.heap)
            popped += 1
        return (float(-self.heap[0][0]) if self.heap else None), popped
    def snapshot(self, depth=5):
        levels = {}
        for px, qty in self.live.values():                          # O(n): touches every live order
            levels[float(px)] = levels.get(float(px), 0) + qty
        return sorted(levels.items(), reverse=True)[:depth], len(self.live)

rng = np.random.default_rng(33506)
b = BidSide()
for i in range(10_000):
    b.add(f"o{i}", round(100 - rng.integers(0, 500) * 0.01, 2), 10)
print("best bid:", b.best())
top = sorted(b.live, key=lambda k: -b.live[k][0])[:300]       # cancel the 300 best orders ...
deep = [f"o{i}" for i in rng.choice(10_000, 3_000, replace=False)]   # ... and 3,000 anywhere
n_cancelled = sum(b.cancel(oid) for oid in top + deep)
best, popped = b.best()
print(f"{n_cancelled:,} cancels, each O(1); next best() popped {popped} stale entries and found {best}")
print(f"heap entries {len(b.heap):,} vs live orders {len(b.live):,}: the dead ones wait until they surface")
snap, touched = b.snapshot()
print(f"5-level snapshot {snap[:2]}... touched {touched:,} orders -> O(n), keep it off the hot path")
'''

SRC["w6c4"] = r'''import numpy as np
np.seterr(all="ignore")
from collections import deque

class Welford:
    """Running mean/variance in O(1) per update, numerically stable."""
    def __init__(self):
        self.n, self.mean, self.m2 = 0, 0.0, 0.0
    def update(self, x):
        self.n += 1
        d = x - self.mean
        self.mean += d / self.n
        self.m2 += d * (x - self.mean)
    @property
    def var(self):
        return self.m2 / (self.n - 1) if self.n > 1 else 0.0

class RollingWindow:
    """Fixed-window mean/variance: O(1) per tick with a deque and running sums."""
    def __init__(self, k):
        self.k, self.q, self.s, self.s2 = k, deque(), 0.0, 0.0
    def update(self, x):
        self.q.append(x); self.s += x; self.s2 += x * x
        if len(self.q) > self.k:
            y = self.q.popleft(); self.s -= y; self.s2 -= y * y
    @property
    def var(self):
        n = len(self.q)
        return (self.s2 - self.s * self.s / n) / (n - 1)

rng = np.random.default_rng(33506)
px = 185 + np.cumsum(rng.normal(0, 0.05, 20_000))
w = Welford()
for x in px:
    w.update(x)
print(f"Welford var {w.var:.6f}   numpy var {px.var(ddof=1):.6f}   match: {np.isclose(w.var, px.var(ddof=1))}")
for n in (2_000, 5_000, 10_000, 20_000):
    recompute_ops = n * (n + 1)          # recomputing mean+var over the whole history every tick: sum of 2k
    print(f"N={n:>6,}  Welford {n:>7,} updates   recompute {recompute_ops:>12,} element visits   ratio {recompute_ops / n:>7,.0f}x")

# the naive one-pass formula E[x^2] - E[x]^2 fails at price levels; Welford does not
big = 1e9 + rng.normal(0, 0.01, 10_000)
naive = (np.sum(big ** 2) - np.sum(big) ** 2 / big.size) / (big.size - 1)
w2 = Welford()
for x in big:
    w2.update(x)
print(f"at 1e9: naive var {naive:.3e}   Welford {w2.var:.3e}   true {big.var(ddof=1):.3e}")
rw = RollingWindow(20)
for x in px:
    rw.update(x)
print(f"20-tick rolling var {rw.var:.6f} vs numpy {px[-20:].var(ddof=1):.6f}")
'''

SRC["w6c5"] = r'''import numpy as np
np.seterr(all="ignore")

# Cost model instead of a stopwatch: element visits per on_tick call.
TICKS = 3000
fast_cost = np.array([5 + 20 for t in range(TICKS)], dtype=float)          # O(k): two fixed windows
slow_cost = np.array([5 + 20 + 2 * (t + 1) for t in range(TICKS)], dtype=float)   # + mean & var over history

def pct(x, q):
    return np.percentile(x, q)

for name, c in (("FastBot O(k)", fast_cost), ("SlowBot O(n)", slow_cost)):
    print(f"{name}  p50={pct(c, 50):7.0f}  p95={pct(c, 95):7.0f}  p99={pct(c, 99):7.0f}  max={c.max():6.0f}  visits")
print("SlowBot's median keeps climbing with the session; FastBot's does not")

# Latency -> staleness: a tick arrives every 1.0 units; service time = visits * cost_per_visit.
rng = np.random.default_rng(33506)
def stale_ticks(cost, per_visit, burst_every=500, burst_len=50):
    backlog, stale = 0.0, 0
    for t, c in enumerate(cost):
        gap = 0.1 if (t % burst_every) < burst_len else 1.0    # a shock: ticks arrive 10x faster
        backlog = max(0.0, backlog + c * per_visit * (1 + 0.2 * rng.random()) - gap)
        stale += backlog > 0
    return stale
for name, c in (("FastBot", fast_cost), ("SlowBot", slow_cost)):
    print(f"{name}: decisions made on a stale book during the session = {stale_ticks(c, 0.0005)} / {TICKS}")
'''

def _bigo_curves():
    """Operations per lookup against n, for the week-6 widget (log scale)."""
    import math
    ns = [10, 100, 1_000, 10_000, 100_000, 1_000_000]
    return [
        {"name": "O(1) dict lookup", "x": ns, "y": [1 for n in ns]},
        {"name": "O(log n) bisect / heap push", "x": ns, "y": [round(math.log2(n), 2) for n in ns]},
        {"name": "O(n) list scan", "x": ns, "y": ns},
        {"name": "O(n log n) re-sort", "x": ns, "y": [round(n * math.log2(n)) for n in ns]},
    ]


WEEKS.append({
    "n": 6,
    "title": "Session 5 · Algorithmic complexity and data structures: the right container for an order book and a rolling statistic (midterm)",
    "topics": [
        "midterm (closed book, 90 minutes) in the first half of the session",
        "Big-O: how cost grows; time versus space; amortised analysis",
        "core containers and their costs: list, dict, set, deque, heap, sorted list",
        "O(1) rolling statistics: Welford's variance and fixed-size windows",
        "the order book as a data-structure problem: heap plus dict, lazy cancels",
        "measure, don't guess: microbenchmarks, profiling, latency versus throughput, tail latency",
        "capability you leave with: the right container for an order book and a rolling statistic",
    ],
    "concepts": [
        {
            "name": "The Big-O ladder, measured as operations: the shape of the curve names the class",
            "explain": (
                "<p>Big-O describes how cost grows with <em>n</em>, not how long one call takes. The useful skill is reading the class off measurements: a flat row is O(1), a row that gains a constant every time <em>n</em> grows tenfold is O(log n), a row that grows tenfold is O(n). The snippet measures without a stopwatch, so its numbers are exact and repeatable: it wraps every key in an object that counts its own comparisons.</p>"
                "<p>A dict lookup costs one comparison at a thousand keys and at a hundred thousand; hashing sends it straight to the bucket. <code>bisect</code> on a sorted list costs 9, 13 and 16 comparisons, about 3.3 more per factor of ten, which is log base 2 of ten. A membership test on a list that misses costs exactly <em>n</em>. The constant factor still matters in practice, which is why the lab times these too: a list scan over ten items can beat a dict, and a numpy operation in C can beat a Python loop of the same complexity by fifty times. Complexity decides what happens when <em>n</em> grows; constants decide who wins when it does not.</p>"
                "<p>In the lab this is step 3 (<em>The Big-O ladder, measured</em>), the same five operations timed at three sizes, and step 1 (<em>Time the CLOB against n</em>), where you read the class of each column of a timing table for the real order book: <code>place_order</code> flat at about 3 microseconds, <code>best_bid</code> flat at under 0.1, <code>get_snapshot</code> growing linearly to 8.5 milliseconds at 100,000 resting orders. In the arena that last number matters: an exchange team that snapshots the whole book on every tick is spending its latency budget on an O(n) call.</p>"
            ),
            "code": code("w6c1"),
        },
        {
            "name": "Pick the container by the question you ask most: heap plus dict against a sorted list",
            "explain": (
                "<p>An order book is asked one question far more often than any other: what is the best price? A sorted list answers it in O(1), but keeping it sorted costs O(n) per insert, because <code>insort</code> shifts every element after the insertion point. A binary heap answers it in O(1) too, with a peek at <code>heap[0]</code>, and pays only O(log n) per insert. Re-sorting the list after every insert, the version a hurried first draft writes, costs O(n log n) per insert.</p>"
                "<p>The snippet inserts 20,000 bids and asks for the best after each one, counting element moves rather than seconds. The heap needs at most 267,248 moves; the sorted list's insort needs 100,829,548, 377 times more; the re-sort-every-time version would need about 2.8 billion comparisons, over ten thousand times the heap. All three give the same best bid after every insert. The question you repeat decides the container: the heap for the extreme, a dict for \"where is order X?\", a deque for a sliding window, a set for membership.</p>"
                "<p>In the lab this is step 2 (<em>Heap + dict vs sorted list</em>): the race timed on the wall clock gives a 475x ratio with identical output, and the checkpoint expects two to three orders of magnitude. In the arena the exchange's matching engine is built exactly this way, a heap per side for price priority, a sequence counter for time priority and a dictionary of live orders for cancels, which is why it can match in microseconds with a hundred thousand orders resting.</p>"
            ),
            "code": code("w6c2"),
        },
        {
            "name": "The order book is a heap plus a dict: O(1) cancels with lazy deletion, O(n) snapshots",
            "explain": (
                "<p>Cancels break the simple heap. Removing an arbitrary element from a heap is O(n) to find plus O(log n) to repair, and on a real venue most orders are cancelled, not filled. The standard answer is lazy deletion: a cancel removes the order from the dictionary of live orders in O(1) and leaves its heap entry where it is. When <code>best()</code> is asked, it pops dead entries off the top until the top is live. Each dead entry is popped at most once, so the cost is amortised O(log n) per cancel, paid only when it surfaces.</p>"
                "<p>The snippet rests 10,000 bids, then cancels the 300 best and 3,000 more at random: 3,220 distinct cancels, each a dictionary pop. The next <code>best()</code> pops exactly the 300 dead entries that were at the top and returns 99.85. The heap still holds 9,700 entries against 6,780 live orders; the other dead ones are harmless until they reach the top. The snapshot is the honest counterpart: aggregating five levels has to visit every live order, 6,780 of them, so it is O(n) and belongs off the hot path, or behind a cache that is updated incrementally.</p>"
                "<p>In the lab the checkpoint asks you to state why <code>get_snapshot</code> is O(n) (it iterates the dictionary of orders) and why <code>best_bid</code> is not (a heap peek after lazy cleanup), reading the real <code>shared/orderbook.py</code>, the one file in the platform held to 100% test coverage. In the arena this is also why a flood of cancels from one team does not slow the venue for everyone else.</p>"
            ),
            "code": code("w6c3"),
        },
        {
            "name": "O(1) rolling statistics: Welford's algorithm and the fixed window",
            "explain": (
                "<p>A signal that recomputes its mean and variance over the whole price history every tick costs O(n) per tick and O(n squared) over a session, and it gets slower the longer the session runs. Welford's algorithm updates the mean and the sum of squared deviations in constant time per observation, and it is numerically stable. A fixed window uses a deque and running sums: add the new value, subtract the one that falls out.</p>"
                "<p>The snippet checks Welford against numpy on 20,000 prices (identical to six decimals) and counts the work: recomputing over the full history visits 4 million elements by tick 2,000 and 400 million by tick 20,000, a ratio that grows linearly with the session. The middle line is the reason to use Welford rather than the textbook one-pass formula: at a price level of a billion with a standard deviation of a cent, E[x squared] minus E[x] squared cancels catastrophically and returns exactly zero, while Welford returns the true 9.944e-05. The last line confirms the 20-tick rolling window against numpy.</p>"
                "<p>In the lab this is step 4 (<em>O(1) rolling statistics, Welford vs recompute</em>): the timed ratio grows from 515x at 2,000 ticks to 6,093x at 20,000, and the checkpoint asks you to show the O(n squared) curve in the timings. In the arena this is the difference between a bot that is as fast at 15:59 as at 09:31 and one that slows all session and ends up trading on stale prices during the closing shock.</p>"
            ),
            "formula": "\\delta = x_n - \\bar x_{n-1},\\quad \\bar x_n = \\bar x_{n-1} + \\frac{\\delta}{n},\\quad M_{2,n} = M_{2,n-1} + \\delta\\,(x_n - \\bar x_n),\\quad s^2 = \\frac{M_{2,n}}{n-1}",
            "code": code("w6c4"),
        },
        {
            "name": "Latency, throughput and the tail: p99 is what gets you picked off",
            "explain": (
                "<p>An average hides the ticks that matter. Latency is how long one decision takes; throughput is how many decisions per second you sustain; the tail, the 99th percentile, is what happens during a burst, which is exactly when prices move fastest. If your service time exceeds the time between ticks, a backlog forms and every decision in it is made on a book that has already changed.</p>"
                "<p>The snippet replaces the stopwatch with a cost model in element visits. <code>FastBot</code> reads two fixed windows, 25 visits every tick, so its p50, p95 and p99 are identical. <code>SlowBot</code> trades the same signal but also recomputes statistics over the whole history: p50 of 3,026 visits, p99 of 5,965, and a median that keeps climbing with the session. Feed both into a queue where ticks normally arrive every time unit and ten times faster during periodic shocks: <code>FastBot</code> never falls behind; <code>SlowBot</code> makes 2,248 of its 3,000 decisions on a stale book. Same signal, same edge on paper, very different fills.</p>"
                "<p>In the lab this is step 5 (<em>Tail latency of your own on_tick</em>): the timed version gives <code>FastBot</code> p50 3.33 and p99 7.38 microseconds against <code>SlowBot</code>'s 71.58 and 145.04, about twenty times slower at both, and the checkpoint asks for your own bot's percentiles against a per-tick budget. In the arena the budget is the half-second tick interval, and the instructor's shocks are the bursts. The midterm, taken in the first half of this session, covers everything up to and including this week.</p>"
            ),
            "code": code("w6c5"),
        },
    ],
    "widget": {
        "type": "curve",
        "title": "Operations per call against n: the four rungs of the ladder that matter for a book",
        "params": {"xlab": "n (resting orders or history length)", "ylab": "operations", "log": True, "series": _bigo_curves()},
    },
    "pitfalls": [
        "Re-sorting a list to find the best price after every insert. Use a heap for the extreme and a dict for lookup by id.",
        "Recomputing a mean or variance over the whole history inside on_tick. It is O(n) per tick and gets slower all session; use Welford or a fixed window.",
        "Reporting the mean latency. Report p50, p95 and p99 against a budget; the tail is what a burst exposes.",
        "Optimising before measuring. Profile first; the hot path is rarely where you guessed.",
    ],
    "check": [
        {
            "q": "A timing table shows an operation at 0.055, 0.066 and 0.084 microseconds for n = 1,000, 10,000 and 100,000. Which class is it most likely?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "answer": 1,
            "why": "It grows by a roughly constant increment per factor of ten, the signature of a logarithm (this is bisect in the lab). O(1) would be flat and O(n) would grow tenfold per step.",
        },
        {
            "q": "Why does the order book cancel an order by deleting it from a dictionary and leaving its heap entry in place?",
            "options": [
                "Because heaps cannot hold strings",
                "Because removing an arbitrary heap element is O(n); lazy deletion makes the cancel O(1) and pops the dead entry only if it reaches the top",
                "To keep cancelled orders visible to other traders",
                "Because Python's heapq has no pop function",
            ],
            "answer": 1,
            "why": "Most orders on a venue are cancelled. Lazy deletion keeps cancels constant-time; best() cleans the top when asked, and each dead entry is popped at most once.",
        },
        {
            "q": "Prices sit near 1e9 with a standard deviation of 0.01. Why can sum(x^2)/n - mean^2 return zero or a negative variance?",
            "options": [
                "Because the prices are integers",
                "Catastrophic cancellation: two huge, nearly equal floating-point numbers are subtracted and the small difference is lost",
                "Because numpy uses float32 by default",
                "Because the variance of prices is always zero",
            ],
            "answer": 1,
            "why": "Both terms are about 1e18 and agree in every digit a double can hold. Welford accumulates deviations from the running mean instead, which stay small.",
        },
        {
            "q": "Two bots trade the same signal. One has p99 on_tick latency of 7 microseconds, the other 145. Why does the difference matter most during a shock?",
            "options": [
                "It does not; they trade the same signal",
                "Ticks arrive fastest during a shock, so the slow bot's service time exceeds the inter-arrival time and its decisions are made on stale books",
                "The venue disconnects slow bots",
                "Fees are higher during shocks",
            ],
            "answer": 1,
            "why": "When service time exceeds the gap between ticks a backlog forms. In the snippet the slow bot made 2,248 of 3,000 decisions on a stale book; the fast bot made none.",
        },
    ],
})

# ═══ Week 7 · Session 6 — big data and distributed computing ═══

SRC["w7c1"] = r'''import numpy as np
np.seterr(all="ignore")
import pandas as pd

rng = np.random.default_rng(33507)
N = 250_000
syms = np.array(["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"])
df = pd.DataFrame({
    "ts": np.arange(N, dtype=np.float64) * 0.5,
    "symbol": syms[np.arange(N) % 5],                      # object dtype: one Python str per cell
    "bid": 185 + np.cumsum(rng.normal(0, 0.01, N)),
    "ask": 0.0, "mid": 0.0, "spread": 0.0, "obi": rng.uniform(-1, 1, N),
})
df["ask"] = df["bid"] + 0.02
df["mid"] = (df["bid"] + df["ask"]) / 2
df["spread"] = df["ask"] - df["bid"]
print(df.shape, {c: str(t) for c, t in df.dtypes.items() if c in ("symbol", "mid")})

shallow = df.memory_usage().sum() / 1e6
deep = df.memory_usage(deep=True).sum() / 1e6
print(f"memory_usage()          : {shallow:6.1f} MB  <- counts only the pointers for 'symbol'")
print(f"memory_usage(deep=True) : {deep:6.1f} MB")

slim = df.astype({"symbol": "category", "bid": "float32", "ask": "float32", "mid": "float32",
                  "spread": "float32", "obi": "float32"})
small = slim.memory_usage(deep=True).sum() / 1e6
print(f"float32 + category      : {small:6.1f} MB  ({deep / small:.1f}x smaller)")
err = (slim["mid"].astype("float64") - df["mid"]).abs().max()
print(f"price error from float32: max {err:.2e} (a tick is 1.0e-02, so {err / 0.01:.1%} of a tick)")
print("category codes:", slim["symbol"].cat.codes.dtype, "categories:", list(slim["symbol"].cat.categories))
'''

SRC["w7c2"] = r'''import numpy as np
np.seterr(all="ignore")
import pandas as pd

rng = np.random.default_rng(33507)
N, K = 40_000, 20
mid = (185 + np.cumsum(rng.normal(0, 0.01, N))).astype(np.float32)

def zscore_loop(x, k):
    """The first draft: a Python loop, one window at a time."""
    out, iters = np.full(len(x), np.nan), 0
    for i in range(k - 1, len(x)):
        w = x[i - k + 1: i + 1]
        out[i] = (x[i] - w.mean()) / w.std()
        iters += 1
    return out, iters

def zscore_vec(x, k):
    s = pd.Series(x)
    r = s.rolling(k)
    return ((s - r.mean()) / r.std(ddof=0)).to_numpy(), 0

a, loop_iters = zscore_loop(mid, K)
b, _ = zscore_vec(mid, K)
ok = ~np.isnan(a)
diff = np.abs(a[ok] - b[ok])
print(f"rows={N:,}  python-level iterations: loop {loop_iters:,}  vectorised 0 (the loop runs in C)")
print(f"max |loop - vectorised| = {diff.max():.2e}")
print("np.array_equal:", np.array_equal(a[ok], b[ok]), "  <- never test floats for exact equality")
# a tolerance you can justify: float32 spacing at 185, divided by the smallest window std
spacing = float(np.spacing(np.float32(185.0)))
min_std = float(pd.Series(mid).rolling(K).std(ddof=0).min())
tol = 4 * spacing / min_std
print(f"float32 spacing at 185 = {spacing:.2e}; smallest window std = {min_std:.4f}; tolerance = {tol:.2e}")
print(f"np.allclose(atol={tol:.1e}):", np.allclose(a[ok], b[ok], rtol=0, atol=tol))
a64, _ = zscore_loop(mid.astype(np.float64), K)
b64, _ = zscore_vec(mid.astype(np.float64), K)
print(f"same comparison in float64: max diff {np.abs(a64[ok] - b64[ok]).max():.1e}")
'''

SRC["w7c3"] = r'''import numpy as np
np.seterr(all="ignore")
import os
import tempfile
from collections import defaultdict, deque
import pandas as pd

rng = np.random.default_rng(33507)
N, K, CHUNK = 60_000, 100, 7_919
syms = np.array(["AAPL", "MSFT", "NVDA"])
path = os.path.join(tempfile.mkdtemp(), "snap.csv")
pd.DataFrame({"symbol": syms[rng.integers(0, 3, N)],
              "mid": np.round(185 + np.cumsum(rng.normal(0, 0.01, N)), 4)}).to_csv(path, index=False)

full = pd.read_csv(path)                                    # the load-everything reference
ref = {s: g["mid"].rolling(K).mean().dropna().mean() for s, g in full.groupby("symbol")}

def chunked(carry):
    win = defaultdict(lambda: deque(maxlen=K))              # the state that must survive boundaries
    tot, cnt, peak = defaultdict(float), defaultdict(int), 0
    for blk in pd.read_csv(path, chunksize=CHUNK):
        peak = max(peak, len(blk))
        if not carry:
            win.clear()                                     # the bug: every chunk starts cold
        for s, m in zip(blk["symbol"].to_numpy(), blk["mid"].to_numpy()):
            win[s].append(m)
            if len(win[s]) == K:
                tot[s] += sum(win[s]) / K
                cnt[s] += 1
    return {s: (tot[s] / cnt[s], cnt[s]) for s in tot}, peak

good, peak = chunked(carry=True)
bad, _ = chunked(carry=False)
print(f"rows {N:,} in chunks of {CHUNK:,}: at most {peak:,} rows in memory at once")
for s in sorted(ref):
    print(f"{s}  full {ref[s]:.6f}   carried {good[s][0]:.6f} (n={good[s][1]:,})   "
          f"cold chunks n={bad[s][1]:,}  match: {abs(good[s][0] - ref[s]) < 1e-9}")
lost = sum(good[s][1] - bad[s][1] for s in ref)
print(f"dropping the carried window silently loses {lost:,} SMA values at the chunk edges")
'''

SRC["w7c4"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import os
import tempfile
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor

def write_recording(path, n=40_000, seed=33507):
    rng = np.random.default_rng(seed)
    syms = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"]
    mids = {s: 100.0 + 50 * i for i, s in enumerate(syms)}
    with open(path, "w") as fh:
        for t in range(n):
            s = syms[t % 5]
            mids[s] = round(mids[s] + rng.normal(0, 0.02), 4)
            kind = "trade_execution" if t % 9 == 0 else "book_snapshot"
            fh.write(json.dumps({"ts": t * 0.1, "msg": {"type": kind, "symbol": s, "mid_price": mids[s]}}) + "\n")

def byte_ranges(path, n):
    size, edges = os.path.getsize(path), [0]
    with open(path, "rb") as fh:
        for i in range(1, n):
            fh.seek(size * i // n)
            fh.readline()                                   # align to the next line start
            edges.append(fh.tell())
    edges.append(size)
    return list(zip(edges[:-1], edges[1:]))

def worker(args):                                           # MAP: one byte range -> partial sums
    path, (start, end) = args
    acc = defaultdict(lambda: [0.0, 0])
    with open(path, "rb") as fh:
        fh.seek(start)
        while fh.tell() < end:
            m = json.loads(fh.readline())["msg"]
            if m["type"] == "book_snapshot":
                a = acc[m["symbol"]]
                a[0] += m["mid_price"]
                a[1] += 1
    return {k: tuple(v) for k, v in acc.items()}

def reduce(parts):                                          # REDUCE: (sum, count) composes
    out = defaultdict(lambda: [0.0, 0])
    for p in parts:
        for s, (x, n) in p.items():
            out[s][0] += x
            out[s][1] += n
    return {s: (x / n, n) for s, (x, n) in out.items()}

if __name__ == "__main__":                                  # mandatory with spawn (macOS, Windows)
    path = os.path.join(tempfile.mkdtemp(), "session.jsonl")
    write_recording(path)
    seq = reduce([worker((path, (0, os.path.getsize(path))))])
    spans = byte_ranges(path, 4)
    with ProcessPoolExecutor(max_workers=4) as pool:
        parts = list(pool.map(worker, [(path, s) for s in spans]))
    par = reduce(parts)
    print("4 byte ranges, line-aligned:", [e - s for s, e in spans], "bytes")
    for s in sorted(seq):
        print(f"  {s}  mean mid {par[s][0]:9.4f}  n={par[s][1]:,}")
    print("counts identical:", all(seq[k][1] == par[k][1] for k in seq),
          "| means equal to 1e-9:", all(abs(seq[k][0] - par[k][0]) < 1e-9 for k in seq),
          "| bitwise equal:", all(seq[k][0] == par[k][0] for k in seq))
    mom = np.mean([p["AAPL"][0] / p["AAPL"][1] for p in parts])
    print(f"AAPL mean of the 4 partition means {mom:.4f} vs true {par['AAPL'][0]:.4f}: "
          "(sum, count) is the state that merges, a mean is not")
'''

SRC["w7c5"] = r'''import numpy as np
np.seterr(all="ignore")
import os
import tempfile
import pandas as pd

rng = np.random.default_rng(33507)
N = 200_000
syms = np.array(["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"])
df = pd.DataFrame({"ts": np.arange(N) * 0.5, "symbol": syms[np.arange(N) % 5],
                   "bid": np.round(185 + np.cumsum(rng.normal(0, 0.01, N)), 2)})
df["ask"] = df["bid"] + 0.02
df["mid"] = (df["bid"] + df["ask"]) / 2
df["obi"] = np.round(rng.uniform(-1, 1, N), 4)
d = tempfile.mkdtemp()

csv = os.path.join(d, "snap.csv")                           # ROW storage: every column of a row together
df.to_csv(csv, index=False)

col_dir = os.path.join(d, "snap.cols")                      # COLUMNAR: one typed file per column
os.makedirs(col_dir)
cols = {"ts": df["ts"].to_numpy(np.float64), "symbol": df["symbol"].astype("category").cat.codes.to_numpy(),
        "bid": df["bid"].to_numpy(np.float32), "ask": df["ask"].to_numpy(np.float32),
        "mid": df["mid"].to_numpy(np.float32), "obi": df["obi"].to_numpy(np.float32)}
for name, arr in cols.items():
    np.save(os.path.join(col_dir, name + ".npy"), arr)

size = lambda p: os.path.getsize(p) / 1e6
col_total = sum(size(os.path.join(col_dir, f)) for f in os.listdir(col_dir))
print(f"CSV (row, text)        {size(csv):6.2f} MB")
print(f"columnar (typed, raw)  {col_total:6.2f} MB")

# read two columns: CSV must scan and parse every byte; columnar opens two files
need = ["symbol", "mid"]
csv_bytes = os.path.getsize(csv)
col_bytes = sum(os.path.getsize(os.path.join(col_dir, c + ".npy")) for c in need)
back = pd.read_csv(csv, usecols=need)
mid = np.load(os.path.join(col_dir, "mid.npy"))
print(f"bytes touched for 2 of 6 columns: CSV {csv_bytes / 1e6:.2f} MB, columnar {col_bytes / 1e6:.2f} MB "
      f"({csv_bytes / col_bytes:.0f}x less)")
print("dtype after reload: CSV mid ->", back["mid"].dtype, "| columnar mid ->", mid.dtype,
      "| types survive only in the typed format")
'''

WEEKS.append({
    "n": 7,
    "title": "Session 6 · Big data and distributed computing: columnar storage, out-of-core processing, partitioning (second IPO)",
    "topics": [
        "the memory wall: measure a frame before you scale it",
        "row versus columnar storage: CSV against Parquet",
        "pandas versus Polars, eager versus lazy; caching intermediate results",
        "chunking and streaming large files with carried state",
        "scaling up versus scaling out; processes to beat the GIL",
        "map-reduce, sharding, per-symbol fan-out; idempotency and reproducibility",
        "the second IPO of the season; a parallel parameter sweep",
        "capability you leave with: columnar storage, out-of-core processing, partitioning",
    ],
    "concepts": [
        {
            "name": "The memory wall: measure the frame with deep=True, then shrink it with dtypes",
            "explain": (
                "<p>A file of ticks becomes several times larger once it is a DataFrame. Text turns into typed objects, every string cell becomes a pointer to a Python <code>str</code> with its own overhead, and every number becomes a float64 whether it needs eight bytes or not. Before reaching for a cluster, measure: <code>df.memory_usage(deep=True)</code>. Without <code>deep=True</code> pandas reports only the pointer array for object columns, and you underestimate the bill.</p>"
                "<p>The snippet builds a quarter of a million book snapshots with seven columns. The shallow count says 14.0 MB; the deep count says 25.3 MB, because the <code>symbol</code> column holds a quarter of a million string objects. Converting <code>symbol</code> to a category (five strings plus one-byte codes) and the prices to float32 brings it to 7.3 MB, 3.5 times smaller. The cost is precision: the largest price error from float32 is 7.6e-06, a tenth of a percent of a one-cent tick, which is harmless for signals and not acceptable for accounting. Keep cash and P&amp;L in float64 or integers of cents; downcast what you only compute statistics on.</p>"
                "<p>In the lab this is step 2 (<em>Load it into pandas, and look at the memory bill</em>): 250,000 snapshots from a session recording at 25.3 MB, 7.3 MB after tuning, and the checkpoint asks for both numbers measured with <code>deep=True</code>. Step 1 (<em>Get a recording</em>) generates that recording offline in the exact JSONL envelope the live exchange writes. In the arena every session is recorded this way, so the dataset you learn on is the one your own bot produced.</p>"
            ),
            "code": code("w7c1"),
        },
        {
            "name": "Loop against vectorised, and checking equivalence with a tolerance you can justify",
            "explain": (
                "<p>Vectorising replaces a Python loop with one call that loops in C, which is typically fifty to a hundred times faster for the same arithmetic. The rewrite is only an optimisation if it computes the same thing, and \"the same\" for floating point needs a tolerance chosen on purpose rather than copied from a tutorial.</p>"
                "<p>The snippet computes a 20-tick rolling z-score on 40,000 float32 prices twice: a loop that makes 39,981 Python-level iterations, and a pandas rolling expression that makes none. Exact equality fails, as it always will, and the maximum difference is 5.17e-03, which looks alarming for a z-score. The tolerance is derived, not guessed: float32 can only represent prices near 185 in steps of 1.53e-05; a z-score divides by the window's standard deviation, as small as 0.0046 here, which amplifies that step to about 3e-03; four steps of slack gives 1.33e-02, and the comparison passes. The last line settles the cause: the same two implementations in float64 agree to 6.5e-08. The disagreement was precision, not a bug.</p>"
                "<p>In the lab this is step 3 (<em>Python loop vs vectorised, timed and checked</em>): 52 times faster on 40,000 rows, <code>allclose=True</code> with a maximum difference of 1.79e-03, and the checkpoint requires that you checked equivalence \"with a tolerance you can justify\". In the arena this is the week-7 feature pipeline's first test: a vectorised feature that disagrees with the per-tick version your bot computes live is a train/serve skew waiting to happen.</p>"
            ),
            "code": code("w7c2"),
        },
        {
            "name": "Chunked processing with carried state: bounded memory, identical answer",
            "explain": (
                "<p>When a file does not fit in memory, read it in chunks and reduce as you go. The subtle part is state: any computation that looks back, a rolling mean, a previous price, an open position, needs its window carried across chunk boundaries, or every chunk starts cold and the edges are silently wrong.</p>"
                "<p>The snippet writes 60,000 snapshots for three symbols to a temporary CSV and computes the mean of each symbol's 100-bar moving average three ways. Loading everything is the reference. Streaming with <code>pd.read_csv(chunksize=7_919)</code> holds at most 7,919 rows at a time and, with a per-symbol <code>deque(maxlen=100)</code> carried from chunk to chunk, reproduces the reference to nine decimals for all three symbols. Clearing the windows at each chunk boundary gives no error and no warning; it just loses 2,079 moving-average values at the edges and produces a different number. An odd chunk size is deliberate: it guarantees the boundaries fall in the middle of every symbol's window.</p>"
                "<p>In the lab this is step 4 (<em>Chunked processing, bounded memory</em>): the same statistic from the 250,000-snapshot recording at 44 MB of peak memory chunked against 229 MB loading it whole, and the checkpoint asks that the chunked run produce the same statistic. In the arena the same pattern runs live: your bot is a chunked processor with a chunk size of one tick, and the carried state is everything in its <code>__init__</code>.</p>"
            ),
            "code": code("w7c3"),
        },
        {
            "name": "Map-reduce across processes: split by byte range, merge a state that composes",
            "explain": (
                "<p>Threads do not speed up Python arithmetic because of the GIL; processes do, because each has its own interpreter. The classic shape is map-reduce: split the data into partitions, map a function over each partition in its own process, and reduce the partial results into one. Two design decisions make it correct. The split must not cut a record in half, so byte-range partitions are aligned to the next line start. And the map must return a state that merges: a (sum, count) pair composes by addition, a mean does not.</p>"
                "<p>The snippet writes a 40,000-line JSONL recording in the arena's envelope format, splits it into four line-aligned byte ranges of about 941 KB each, maps them across a <code>ProcessPoolExecutor</code> and reduces. The counts match the sequential run exactly and the means match to 1e-9, but not bitwise: floating-point addition is not associative, so a different summation order changes the last bits. The final line shows the wrong reduction: the mean of the four partition means for AAPL is 100.2215 against a true 100.2225, because the partitions hold different numbers of AAPL rows. The <code>if __name__ == \"__main__\"</code> guard is mandatory on macOS and Windows, where worker processes re-import the script.</p>"
                "<p>In the lab this is step 5 (<em>Map-reduce across processes</em>): ten partitions, a 2.1x speedup and <code>identical: True</code>. Homework 6 turns it into a parallel parameter sweep, one headless simulation per configuration, which works because the simulator is pure and in-process with no sockets. In the arena that is how you search a neighbourhood of parameters instead of trusting one.</p>"
            ),
            "code": code("w7c4"),
        },
        {
            "name": "Row versus columnar storage: read two columns without parsing six",
            "explain": (
                "<p>A CSV stores rows: every column of a record sits together as text, so reading one column means scanning and parsing every byte of the file, and types are lost on the way (a float32 price comes back as float64, a category as strings). A columnar format stores each column contiguously and typed, so a query that needs two columns reads two columns. Parquet adds compression, per-chunk statistics and a schema on top of that idea, which is why it is the default for research datasets.</p>"
                "<p>The snippet makes the principle visible with nothing but numpy: one typed <code>.npy</code> file per column. On 200,000 snapshots the CSV is 10.23 MB and the typed columns are 5.00 MB with no compression at all. Reading <code>symbol</code> and <code>mid</code> touches all 10.23 MB of the CSV but only 1.00 MB of the columnar store, ten times less, and the reloaded <code>mid</code> is still float32 while the CSV's has silently become float64. Parquet would shrink the columnar side further with dictionary and run-length encoding, which suits a symbol column that repeats five values.</p>"
                "<p>In the lab this is step 6 (<em>Columnar vs row storage</em>): the 61.6 MB JSONL recording becomes a 16.9 MB CSV and a 2.7 MB Parquet file, and reading two columns from Parquet is 28 times faster than parsing the CSV. In the arena the session recordings stay in JSONL because they are written one event at a time; convert them to a columnar format once, then do research on the columnar copy.</p>"
            ),
            "code": code("w7c5"),
        },
    ],
    "widget": {
        "type": "tree-diagram",
        "title": "Map-reduce over a session recording: split by byte range, map in processes, merge (sum, count)",
        "params": {
            "nodes": [
                {"id": "rec", "label": "session.jsonl", "level": 0},
                {"id": "p1", "label": "bytes 0 to 25%", "level": 1},
                {"id": "p2", "label": "bytes 25 to 50%", "level": 1},
                {"id": "p3", "label": "bytes 50 to 75%", "level": 1},
                {"id": "p4", "label": "bytes 75 to 100%", "level": 1},
                {"id": "m1", "label": "map: (sum, count) per symbol", "level": 2},
                {"id": "m2", "label": "map: (sum, count) per symbol", "level": 2},
                {"id": "m3", "label": "map: (sum, count) per symbol", "level": 2},
                {"id": "m4", "label": "map: (sum, count) per symbol", "level": 2},
                {"id": "red", "label": "reduce: add sums, add counts", "level": 3},
                {"id": "out", "label": "mean mid per symbol", "level": 4},
            ],
            "edges": [
                {"from": "rec", "to": "p1", "label": "line-aligned"},
                {"from": "rec", "to": "p2"}, {"from": "rec", "to": "p3"}, {"from": "rec", "to": "p4"},
                {"from": "p1", "to": "m1", "label": "process 1"},
                {"from": "p2", "to": "m2", "label": "process 2"},
                {"from": "p3", "to": "m3", "label": "process 3"},
                {"from": "p4", "to": "m4", "label": "process 4"},
                {"from": "m1", "to": "red"}, {"from": "m2", "to": "red"},
                {"from": "m3", "to": "red"}, {"from": "m4", "to": "red"},
                {"from": "red", "to": "out", "label": "sum / count"},
            ],
        },
    },
    "pitfalls": [
        "Measuring a frame with memory_usage() and no deep=True. Object columns are reported as pointers only.",
        "Clearing rolling state at chunk boundaries. The run succeeds and the answer is quietly different.",
        "Reducing partition means instead of (sum, count). Unequal partitions make a mean of means wrong.",
        "Threads for CPU-bound Python work, or multiprocessing without the __main__ guard on macOS. Use processes, and guard the entry point.",
    ],
    "check": [
        {
            "q": "df.memory_usage().sum() reports 14 MB but the process uses far more. What is the most likely reason?",
            "options": [
                "pandas caches a copy of every column",
                "Object (string) columns are counted as pointers only unless deep=True is passed",
                "float64 columns are stored twice",
                "The index is not counted",
            ],
            "answer": 1,
            "why": "Without deep=True pandas counts eight bytes per object pointer, not the Python strings they point to. The deep count in the snippet was 25.3 MB against 14.0 shallow.",
        },
        {
            "q": "A rolling 100-bar statistic computed chunk by chunk differs from the whole-file answer, with no error raised. What is the fix?",
            "options": [
                "Use a larger chunk size",
                "Carry each symbol's rolling window across chunk boundaries instead of starting every chunk cold",
                "Sort each chunk before processing",
                "Use float32 to save memory",
            ],
            "answer": 1,
            "why": "Any look-back computation needs its state carried between chunks. A larger chunk only reduces the number of wrong edges; it does not remove them.",
        },
        {
            "q": "Four worker processes each return a mean mid price for AAPL over their byte range. Why is averaging those four means wrong?",
            "options": [
                "Because floating-point addition is not associative",
                "Because the partitions contain different numbers of AAPL rows, so the means need weights; returning (sum, count) avoids the problem",
                "Because processes cannot return floats",
                "It is not wrong; the mean of means equals the overall mean",
            ],
            "answer": 1,
            "why": "A mean is not a mergeable state; (sum, count) is. Non-associativity only explains last-bit differences (1e-9 here), not the 0.001 error of the mean of means.",
        },
        {
            "q": "Why does reading two of six columns from a columnar store touch far fewer bytes than from a CSV?",
            "options": [
                "CSV files are always compressed",
                "Columnar formats store each column contiguously, so only the needed columns are read; a CSV interleaves all columns row by row and must be parsed in full",
                "Columnar formats drop rows with missing values",
                "CSV readers use only one CPU core",
            ],
            "answer": 1,
            "why": "Row layout forces a full scan and parse; column layout lets the reader open only what the query needs, and keeps the types. In the snippet that was 1.00 MB against 10.23 MB.",
        },
    ],
})

# ═══ Week 8 · Session 7 — machine-learning signals and model ops ═══

# The tape and features shared by w8c1-w8c4 (each snippet stays self-contained).
ML_PRELUDE = r'''import numpy as np
np.seterr(all="ignore")

H, WARM = 5, 20
FEATURES = ["ret1", "mom5", "mom10", "vol20", "spread_bps", "obi"]

def make_tape(symbol, n=3000, seed=33508):
    """AAPL: a random walk (no edge). SINE: a slow sine plus noise (a real, learnable edge)."""
    rng = np.random.default_rng(seed + (0 if symbol == "AAPL" else 1))
    if symbol == "AAPL":
        mid = 185 * np.exp(np.cumsum(rng.normal(0, 4e-4, n)))
    else:
        t = np.arange(n)
        mid = 100 + 2.0 * np.sin(2 * np.pi * t / 400) + rng.normal(0, 0.12, n)
    spread = np.full(n, 0.02)                # the house broker quotes a fixed two-cent spread
    obi = np.zeros(n)                        # one broker quoting a symmetric ladder: obi never moves
    return np.column_stack([mid, spread, obi])

def build_xy(tape, h=H, warm=WARM):
    mid, spread, obi = tape[:, 0], tape[:, 1], tape[:, 2]
    ret1 = np.zeros_like(mid)
    ret1[1:] = mid[1:] / mid[:-1] - 1.0
    X, y = [], []
    for t in range(warm, len(mid) - h):
        X.append([ret1[t], mid[t] / mid[t - 5] - 1, mid[t] / mid[t - 10] - 1,
                  ret1[t - 19: t + 1].std(), spread[t] / mid[t] * 1e4, obi[t]])   # known at t
        y.append(1.0 if mid[t + h] > mid[t] else 0.0)                               # about t + h
    return np.array(X), np.array(y)

def zscore(Xtr, Xte):
    mu, sd = Xtr.mean(0), Xtr.std(0)                 # TRAIN statistics only
    sd = np.where(sd < 1e-12, 1.0, sd)               # guard the dead feature
    return (Xtr - mu) / sd, (Xte - mu) / sd, mu, sd

sig = lambda z: 1 / (1 + np.exp(-np.clip(z, -60, 60)))

def fit_logistic(X, y, epochs=600, lr=1.0, l2=1e-3):
    w, b = np.zeros(X.shape[1]), 0.0
    for _ in range(epochs):
        g = sig(X @ w + b) - y
        w -= lr * ((X.T @ g) / len(y) + l2 * w)
        b -= lr * g.mean()
    return w, b

def acc(w, b, X, y):
    return float(((sig(X @ w + b) > 0.5) == (y > 0.5)).mean())
'''

SRC["w8c1"] = ML_PRELUDE + r'''
for sym in ("AAPL", "SINE"):
    X, y = build_xy(make_tape(sym))
    print(f"{sym}: X{X.shape}  up-rate {y.mean():.3f}")
    print("   feature std:", {f: float(f"{s:.2e}") for f, s in zip(FEATURES, X.std(0))})
    dead = [f for f, s in zip(FEATURES, X.std(0)) if s < 1e-12]
    print("   zero-variance features (drop before training):", dead)

# the one rule: nothing in row t may touch data after t. A leaky feature, for contrast:
X, y = build_xy(make_tape("AAPL"))
mid = make_tape("AAPL")[:, 0]
future_ret = np.array([mid[t + 1] / mid[t] - 1 for t in range(WARM, len(mid) - H)])
print(f"corr(label, ret1 at t)   = {np.corrcoef(X[:, 0], y)[0, 1]:+.3f}   (honest feature)")
print(f"corr(label, ret at t+1)  = {np.corrcoef(future_ret, y)[0, 1]:+.3f}   (leaky feature: it IS part of the label)")
'''

SRC["w8c2"] = ML_PRELUDE + r'''
def nn1_acc(Xtr, ytr, Xte, yte):
    """1-nearest-neighbour: a memoriser, which makes leakage impossible to miss."""
    hits = 0
    for i in range(len(Xte)):
        d = ((Xtr - Xte[i]) ** 2).sum(1)
        hits += (ytr[int(d.argmin())] > 0.5) == (yte[i] > 0.5)
    return hits / len(Xte)

X, y = build_xy(make_tape("AAPL"))              # a random walk: the honest answer is 50%
X = X[:, :5]                                    # drop the dead obi column
n = len(X)
cut = int(0.7 * n)
idx = np.random.default_rng(33508).permutation(n)
tr, te = idx[:cut], idx[cut:]

A, B, *_ = zscore(X[tr], X[te])
r = nn1_acc(A, y[tr], B, y[te])
A, B, *_ = zscore(X[:cut], X[cut:])
t = nn1_acc(A, y[:cut], B, y[cut:])
A, B, *_ = zscore(X[: cut - H], X[cut:])
e = nn1_acc(A, y[: cut - H], B, y[cut:])
print(f"1-NN random split      {r:.3f}")
print(f"1-NN time split        {t:.3f}")
print(f"1-NN time + embargo    {e:.3f}")
print(f"leakage GAP (random - embargo) {r - e:+.3f} accuracy points of fiction, on data with no signal")
# why: with h = 5, neighbours in time share 4 of 5 future ticks in their labels
same = np.mean(y[1:] == y[:-1])
print(f"adjacent rows share a label {same:.1%} of the time (a coin would give 50%)")
'''

SRC["w8c3"] = ML_PRELUDE + r'''
def walk_forward(X, y, folds=5, h=H):
    n = len(X)
    block = n // (folds + 1)
    out = []
    for k in range(1, folds + 1):
        a, bnd = k * block, (k + 1) * block
        A, B, *_ = zscore(X[: a - h], X[a:bnd])        # expanding window, embargo on every fold
        w, b = fit_logistic(A, y[: a - h])
        out.append(acc(w, b, B, y[a:bnd]))
    return np.array(out)

rng = np.random.default_rng(33508)
for sym in ("SINE", "AAPL"):
    X, y = build_xy(make_tape(sym))
    X = X[:, :5]
    wf = walk_forward(X, y)
    ctrl = walk_forward(X, rng.permutation(y))          # shuffled-label control
    print(f"=== {sym:<5} walk-forward {np.round(wf, 3).tolist()}  mean {wf.mean():.3f} sd {wf.std(ddof=1):.3f}")
    print(f"          shuffled-label control mean {ctrl.mean():.3f}")
se = np.sqrt(0.25 / (len(y) // 6))
print(f"one fold holds {len(y) // 6} labels: a coin flip scores 0.500 +/- {se:.3f} per fold")
'''

SRC["w8c4"] = ML_PRELUDE + r'''
X, y = build_xy(make_tape("SINE"))
X = X[:, :5]
mid = make_tape("SINE")[:, 0]
n = len(X)
cut = int(0.7 * n)
A, B, mu, sd = zscore(X[: cut - H], X[cut:])
w, b = fit_logistic(A, y[: cut - H])
p = sig(B @ w + b)
yte = y[cut:]
fwd = np.array([mid[t + H] / mid[t] - 1 for t in range(WARM, len(mid) - H)])[cut:] * 1e4   # bps

print(f"accuracy {np.mean((p > 0.5) == (yte > 0.5)):.3f}   always-predict-up baseline {max(yte.mean(), 1 - yte.mean()):.3f}")
COST = 3.0      # bps per round trip: half-spread in and out plus a maker/taker mix
print(f"{'threshold':>10}{'trades':>8}{'hit rate':>10}{'gross bps':>11}{'net bps':>9}{'total net bps':>15}")
for th in (0.50, 0.55, 0.60, 0.70):
    go = np.abs(p - 0.5) >= th - 0.5
    side = np.where(p[go] > 0.5, 1.0, -1.0)
    gross = side * fwd[go]
    net = gross.mean() - COST
    print(f"{th:>10.2f}{go.sum():>8}{np.mean(gross > 0):>10.3f}{gross.mean():>11.2f}{net:>9.2f}{net * go.sum():>15,.0f}")
print("accuracy counts direction; P&L counts size of the move minus the cost of taking it")
'''

SRC["w8c5"] = r'''import numpy as np
np.seterr(all="ignore")
import hashlib
import json
import math
import os
import tempfile

d = tempfile.mkdtemp()
path = os.path.join(d, "signal_v1.json")
art = {"version": 1, "kind": "logistic", "features": ["ret1", "mom5", "mom10", "vol20", "spread_bps"],
       "horizon": 5, "w": [-0.84, -0.24, 0.61, -0.18, 0.18], "b": 0.01,
       "mu": [0.0, 0.0, 0.0, 5e-4, 2.5], "sd": [5e-4, 1e-3, 1.5e-3, 1e-4, 0.8],
       "model_card": {"intended_use": "5-tick direction on SINE, threshold 0.55, 2 lots",
                      "training_data": "offline tape, 2,975 rows, time split with 5-tick embargo",
                      "holdout_acc": 0.645, "walk_forward": "0.648 +/- 0.015 over 5 folds",
                      "known_limits": "no edge on random-walk symbols; obi dropped (not live)",
                      "kill_switch": "live hit rate 2 s.e. below 0.645 for 200 scored predictions"}}
body = json.dumps(art, sort_keys=True).encode()
art["content_sha256"] = hashlib.sha256(body).hexdigest()[:12]       # provenance, like a git sha
with open(path, "w") as fh:
    json.dump(art, fh, indent=2)
print("artifact written:", os.path.basename(path), "sha", art["content_sha256"])

class MLTrader:
    def __init__(self, path):
        try:
            with open(path) as fh:
                self.art = json.load(fh)             # load ONCE, never inside on_tick
        except (OSError, ValueError):
            self.art = None                          # fail safe: trade nothing
        self.killed, self.scored, self.hits = False, 0, 0
    def on_tick(self, x):
        if self.art is None or self.killed:
            return None
        z = sum((xi - m) / s * wi for xi, m, s, wi in zip(x, self.art["mu"], self.art["sd"], self.art["w"]))
        p = 1 / (1 + math.exp(-max(-60, min(60, z + self.art["b"]))))
        return "buy" if p > 0.55 else ("sell" if p < 0.45 else None)
    def score(self, hit):
        """Drift monitor: rolling live hit rate against the model card's number."""
        self.scored += 1
        self.hits += hit
        ref = self.art["model_card"]["holdout_acc"]
        if self.scored >= 200:
            rate = self.hits / self.scored
            se = math.sqrt(ref * (1 - ref) / self.scored)
            if rate < ref - 2 * se:
                self.killed = True
                return f"KILL SWITCH at {self.scored} scored: live {rate:.3f} < {ref:.3f} - 2 x {se:.3f}"
        return None

print("missing artifact ->", MLTrader(os.path.join(d, "nope.json")).on_tick([0.0] * 5), "(no trade, no crash)")
bot = MLTrader(path)
print("healthy features ->", bot.on_tick([0.0004, 0.002, 0.004, 5e-4, 2.5]))
rng = np.random.default_rng(33508)
for regime, p_hit in (("same world", 0.645), ("world moved", 0.50)):
    bot = MLTrader(path)
    msg = None
    for i in range(600):
        msg = bot.score(int(rng.random() < p_hit)) or msg
        if bot.killed:
            break
    print(f"{regime:<12}: {msg or 'no alarm after 600 scored predictions'}; next on_tick -> "
          f"{bot.on_tick([0.0004, 0.002, 0.004, 5e-4, 2.5])}")
'''

WEEKS.append({
    "n": 8,
    "title": "Session 7 · Machine-learning signals and model ops: leak-free validation, and a model running inside a live bot",
    "topics": [
        "the supervised setup: features known at t, a label about t + h",
        "feature engineering from prices and the order book",
        "models: start simple and interpretable; bias and variance",
        "split in time, with an embargo; walk-forward validation",
        "overfitting, data snooping and leakage; metrics that matter",
        "model ops: persist, serve, monitor, retrain; a strategy is just a function",
        "capability you leave with: leak-free validation; a model running inside a live bot",
    ],
    "concepts": [
        {
            "name": "The supervised setup: X at t, y about t + h, and a feature you can compute live",
            "explain": (
                "<p>Every trading model in this course has the same shape. Each row is a moment <em>t</em>; the features in that row use only data available at <em>t</em> (the last return, momentum over 5 and 10 ticks, 20-tick volatility, the spread in basis points, book imbalance); the label is about <em>t + h</em>, here whether the mid is higher five ticks later. The horizon must match the holding period, because a five-tick label validates a five-tick trade and nothing else. The one rule you cannot break is that nothing in X may touch data after <em>t</em>.</p>"
                "<p>The snippet builds that matrix from two synthetic tapes: AAPL, a random walk with no edge in it, and SINE, a slow sine plus noise with a real one. Both give 2,975 rows and an up-rate near one half. Printing <code>X.std(0)</code> before training finds the dead feature: book imbalance has a standard deviation of exactly zero, because one broker quoting a symmetric ladder never moves it. A zero-variance feature cannot help, and dividing by its standard deviation would produce NaNs. The last two lines show what leakage looks like numerically: the honest feature correlates -0.02 with the label, while the return from <em>t</em> to <em>t + 1</em>, which is part of the label, correlates +0.35. A feature that is too good is a bug until proven otherwise.</p>"
                "<p>In the lab this is steps 1 to 3 (<em>What a tape actually is</em>, <em>Make a long tape you can train on</em> and <em>Features known at t, label about t + h</em>), including the checkpoint that you name the zero-variance feature and why. In the arena the rule has a practical corollary the lab states plainly: a feature you cannot compute inside <code>on_tick</code> from <code>MarketData</code> is not a feature.</p>"
            ),
            "formula": "x_t = f(P_{\\le t}),\\qquad y_t = \\mathbb{1}\\{m_{t+h} > m_t\\},\\qquad h = 5",
            "code": code("w8c1"),
        },
        {
            "name": "The leakage gap: a shuffled split finds 12 points of edge in a random walk",
            "explain": (
                "<p>A random train/test split is the default in every machine-learning tutorial and the wrong one for time series. With a five-tick horizon the labels of adjacent rows overlap in four of their five future ticks, so neighbouring rows share a label far more often than chance, and their features, built from overlapping windows, are nearly identical. Shuffle, and each test row's near-twin lands in the training set; a model that memorises looks the answer up.</p>"
                "<p>The snippet makes the effect impossible to miss with the ultimate memoriser, a 1-nearest-neighbour classifier, on the AAPL random walk where the honest answer is 50%. The random split scores 0.560. A time split, training on the first 70% and testing on the rest, scores 0.437, and adding a five-row embargo, dropping the last <em>h</em> training rows so no training label reaches across the wall, scores the same. The gap is 12.3 accuracy points of pure fiction, on data that contains no signal at all. Adjacent labels agree 79% of the time; that one number explains all of it. Two other leaks hide in the same code: fitting the scaler on all the data rather than the training slice, and choosing features after looking at test performance.</p>"
                "<p>In the lab this is step 4 (<em>Split three ways and read the leakage gap</em>), the number of the night: the lab's AAPL tape gives 0.574 against 0.479, a gap of 0.095, and the checkpoint asks for three numbers with a clearly positive gap on data that has no signal. In the arena the leakage gap is the difference between the Sharpe in your notebook and the P&amp;L on the scoreboard.</p>"
            ),
            "code": code("w8c2"),
        },
        {
            "name": "Walk-forward validation with an embargo, and the shuffled-label control",
            "explain": (
                "<p>One time split is one sample. Walk-forward validation repeats it: train on everything before a boundary (minus an embargo), test on the next block, move the boundary forward, and report the mean <em>and</em> the dispersion across folds. It is the only score to trust for a trading model because it reproduces how the model will be used, trained on the past and applied to a future it has never seen.</p>"
                "<p>The snippet runs five expanding-window folds of a ten-line logistic regression on both tapes. On SINE every fold lands between 0.655 and 0.681: mean 0.663, standard deviation 0.010, a real and stable edge. On AAPL the folds scatter from 0.404 to 0.556 around a mean of 0.502 with a standard deviation of 0.058, which is nothing: with 495 labels per fold a coin flip scores 0.500 plus or minus 0.022, and one fold at 0.556 is the kind of result a lucky seed produces. The control is the cheapest test in the week: shuffle the labels, rerun, and a genuine signal must collapse to a coin flip, which it does on SINE (0.486). If the control scores as well as your model, your pipeline is finding structure that is not in the labels.</p>"
                "<p>In the lab this is step 5 (<em>Walk-forward, and the shuffled-label control</em>): SINE at 0.648 with a standard deviation of 0.015 and a control of 0.517, AAPL at 0.478 with a control that scores <em>better</em> than the model. The checkpoint asks for mean and standard deviation, not one number. In the arena this is the validation you run in the headless simulator before a model is allowed near a live session.</p>"
            ),
            "code": code("w8c3"),
        },
        {
            "name": "Metrics that matter: accuracy is a trap until it survives the cost of trading",
            "explain": (
                "<p>Accuracy counts how often the direction was right. P&amp;L counts how large the moves were when you were right, minus how large they were when you were wrong, minus what it cost to trade. A classifier can be accurate on small moves and wrong on large ones, and a baseline that always predicts the majority class can look respectable on an imbalanced label. Before believing a model, compare it with the trivial baseline, then convert its predictions into trades and net them of costs.</p>"
                "<p>The snippet fits the logistic model on SINE's first 70% and scores the last 30%. Accuracy is 0.654 against an always-up baseline of 0.523. Treat each prediction as a five-tick trade that pays three basis points in costs: trading every prediction earns 8.25 bps gross and 5.25 net per trade. Raising the confidence threshold trades less, with a higher hit rate and a larger move per trade; the total net result peaks at a threshold of 0.55 (5,229 bps across 745 trades) and then falls as the thinner signal set gives up more volume than it gains in quality. The threshold is a trading decision, not a modelling one, and it is chosen on validation data, not test data.</p>"
                "<p>In the lab the bot of step 6 fires only when the probability is above 0.55 or below 0.45, and the deck's <em>Scoring a Signal, Metrics That Matter</em> slide sets hit rate, edge per trade and turnover side by side. In the arena the 15 bps taker fee sets a much higher bar than the three basis points used here, which is why most classroom models that beat a coin flip still lose money unless they execute passively.</p>"
            ),
            "code": code("w8c4"),
        },
        {
            "name": "Model ops: a versioned artifact with a model card, loaded once, watched by a kill switch",
            "explain": (
                "<p>A model in production is not a notebook cell. It is a frozen artifact (weights, the scaler's mean and standard deviation, the feature list, the horizon), a record of where it came from (training data, validation scores, a content hash or commit), a statement of what it is for and where it fails (a model card), and a rule for when to stop trusting it. The bot loads the artifact once at construction and does only arithmetic per tick, so prediction fits inside the tick budget.</p>"
                "<p>The snippet writes such an artifact with a model card and a SHA-256 of its contents, then exercises the three behaviours that matter. A missing artifact makes the bot trade nothing rather than crash. A healthy feature vector produces a buy. And a drift monitor compares the rolling live hit rate with the card's 0.645: in a world that has not changed it raises no alarm over 600 scored predictions; in a world where the edge has gone, the hit rate falls to 0.470 after 200 predictions, more than two standard errors below the card, the kill switch trips, and the next <code>on_tick</code> returns nothing. A kill switch that the model itself can trip is the difference between a bad afternoon and a bad quarter.</p>"
                "<p>In the lab this is steps 6 and 7 (<em>Freeze the model, then load it in on_tick</em> and <em>Drift monitoring, the cheapest useful version</em>): <code>models/signal_v1.json</code> with <code>features</code>, <code>horizon</code>, <code>mu</code>/<code>sd</code> and a <code>git_sha</code>, an <code>MLTrader</code> that loads it in <code>__init__</code>, and the checkpoint that deleting the artifact makes the bot do nothing, not crash. In the arena the same object runs offline through <code>as_signal_fn</code> and live on the venue without a rewrite.</p>"
            ),
            "code": code("w8c5"),
        },
    ],
    "widget": {
        "type": "histogram",
        "title": "What a coin flip scores on one 495-label fold: the band a no-signal model lives in",
        "params": {"sampler": "normal", "params": {"mu": 0.5, "sigma": 0.0225}, "bins": 40, "overlay": True,
                   "n": 5000, "seed": 33508, "q": 0.05},
    },
    "pitfalls": [
        "A shuffled train/test split on overlapping labels. Split in time and embargo h rows at every boundary.",
        "Fitting the scaler (mean and standard deviation) on the full dataset. Fit it on the training slice only and store it in the artifact.",
        "Reporting one fold, or accuracy without a baseline and without costs. Report walk-forward mean and dispersion, the shuffled-label control, and net edge per trade.",
        "Loading the model inside on_tick, or letting a missing artifact raise. Load once in __init__; a missing model means no trades.",
    ],
    "check": [
        {
            "q": "A 1-nearest-neighbour model scores 0.56 on a random split and 0.44 on a time split with an embargo, on a random-walk price series. What explains the gap?",
            "options": [
                "The model found a real but unstable edge",
                "Overlapping labels and features let each shuffled test row find its near-twin in the training set: leakage",
                "The time split has too little training data",
                "1-NN is biased toward the majority class",
            ],
            "answer": 1,
            "why": "With h = 5 adjacent labels agree 79% of the time. A random split hands the memoriser the answer; the time split with an embargo removes it, and the honest score is a coin flip.",
        },
        {
            "q": "Why does walk-forward validation drop the last h training rows before each test block?",
            "options": [
                "To speed up training",
                "Because those rows' labels look h ticks ahead into the test block, which would leak test information into training",
                "Because the last rows are always noisy",
                "To balance the classes",
            ],
            "answer": 1,
            "why": "A label at t is about t + h. The embargo ensures no training label is computed from prices inside the test window.",
        },
        {
            "q": "You shuffle the labels and rerun your whole pipeline. The model still scores 0.60. What does that tell you?",
            "options": [
                "The signal is robust",
                "The pipeline is finding structure that is not in the labels, so something leaks or the evaluation is broken",
                "The model is underfitting",
                "Nothing; shuffled-label controls are uninformative",
            ],
            "answer": 1,
            "why": "With shuffled labels there is nothing to learn, so a correct pipeline must score about 0.5. A high control score means leakage or a bug in the evaluation.",
        },
        {
            "q": "The deployed model's rolling live hit rate is 0.47 after 200 predictions; its model card says 0.645. What should the bot do?",
            "options": [
                "Keep trading; 200 predictions is too few to judge",
                "Retrain on the live data immediately and keep trading",
                "Trip the kill switch: stop trading on the model, because the live rate is far more than two standard errors below the validated one",
                "Double the position size to recover losses",
            ],
            "answer": 2,
            "why": "The standard error at 200 predictions is about 0.034, so 0.47 is five standard errors low: the world moved. Stop first; retrain offline, validate, and redeploy a new artifact.",
        },
    ],
})

# ═══ Week 9 · Session 8 — CI/CD, testing and a desk dashboard ═══

SRC["w9c1"] = r'''import numpy as np
np.seterr(all="ignore")
import inspect
import itertools

# --- a thirty-line pytest: collection, fixtures by argument name, parametrize ---
FIXTURES, TESTS = {}, []
def fixture(fn):
    FIXTURES[fn.__name__] = fn
    return fn
def parametrize(names, cases, ids):
    def deco(fn):
        fn.cases = [dict(zip(names.split(","), c)) for c in cases]
        fn.ids = ids
        return fn
    return deco
def run_all(namespace):
    passed = failed = 0
    for name, fn in namespace.items():
        if not (name.startswith("test_") and callable(fn)):
            continue
        for i, case in enumerate(getattr(fn, "cases", [{}])):
            kwargs = dict(case)
            for p in inspect.signature(fn).parameters:
                if p not in kwargs:
                    kwargs[p] = FIXTURES[p]()                 # a fresh fixture per test
            label = name + (f"[{fn.ids[i]}]" if case else "")
            try:
                fn(**kwargs)
                passed += 1
                print(f"PASSED  {label}")
            except AssertionError as e:
                failed += 1
                print(f"FAILED  {label}: {e}")
    print(f"{passed} passed, {failed} failed")

# --- the code under test: a PURE signal function (no I/O, no clock, no globals) ---
def momentum(prices, lookback=10, band=0.002):
    if len(prices) < lookback + 1:
        return 0
    chg = prices[-1] / prices[-lookback - 1] - 1.0
    return 1 if chg > band else (-1 if chg < -band else 0)

@fixture
def rising():
    return [100.0 + i * 0.5 for i in range(30)]

def test_momentum_long_on_uptrend(rising):
    assert momentum(rising) == 1, "expected +1 on a rising series"

def test_momentum_flat_on_no_trend():
    assert momentum([100.0] * 30) == 0

@parametrize("prices,expected", [
    ([100.0] * 30, 0),
    ([100.0 - i * 0.5 for i in range(30)], -1),
    ([100.0, 101.0], 0),                    # not enough history yet
    ([], 0),                                # cold start / empty book
    ([100.0] * 10 + [100.2], 0),            # exactly at the band: not a signal
], ids=["flat", "downtrend", "short-history", "empty", "at-the-band"])
def test_momentum_cases(prices, expected):
    got = momentum(prices)
    assert got == expected, f"momentum({len(prices)} prices) = {got}, expected {expected}"

run_all(dict(globals()))
print("why at-the-band fails: 100.2 / 100.0 - 1 =", repr(100.2 / 100.0 - 1), "> 0.002")
'''

SRC["w9c2"] = r'''import numpy as np
np.seterr(all="ignore")
import heapq
import random
from itertools import count

def make_book(bug=False):
    bids, asks, live, trades, seq = [], [], {}, [], count()
    def place(oid, side, px, qty):
        opp = asks if side == "buy" else bids
        while qty and opp:
            rid = opp[0][2]
            r = live[rid]
            if (px < r["px"]) if side == "buy" else (px > r["px"]):
                break
            f = min(qty, r["qty"])
            trades.append((px if bug else r["px"], f, r["px"]))       # BUG: taker's price
            qty -= f
            r["qty"] -= f
            if r["qty"] == 0:
                heapq.heappop(opp)
                del live[rid]
        if qty:
            live[oid] = {"side": side, "px": px, "qty": qty}
            heapq.heappush(bids if side == "buy" else asks, (-px if side == "buy" else px, next(seq), oid))
    def state():
        bb = -bids[0][0] if bids else None
        ba = asks[0][0] if asks else None
        return bb, ba, live, trades
    return place, state

def check(orders, bug=False):
    """Properties that must hold for EVERY order sequence."""
    place, state = make_book(bug)
    for i, (side, px, q) in enumerate(orders):
        place(i, side, px, q)
        bb, ba, live, trades = state()
        if bb is not None and ba is not None and bb >= ba:
            return f"book crossed: {bb} >= {ba}"
        for tp, f, rp in trades:
            if tp != rp:
                return f"trade printed at {tp}, resting order was at {rp}"
    submitted = sum(q for _, _, q in orders)
    resting = sum(o["qty"] for o in state()[2].values())
    filled = 2 * sum(f for _, f, _ in state()[3])
    if submitted != resting + filled:
        return f"quantity not conserved: {submitted} != {resting} + {filled}"
    return None

def gen(rng, n):
    return [(rng.choice(["buy", "sell"]), round(100 + rng.randint(-5, 5) * 0.01, 2), rng.randint(1, 50)) for _ in range(n)]

def shrink(orders, bug):
    """Greedy shrinking: drop orders while the failure persists."""
    changed = True
    while changed:
        changed = False
        for i in range(len(orders)):
            cand = orders[:i] + orders[i + 1:]
            if check(cand, bug):
                orders, changed = cand, True
                break
    return orders

for bug in (False, True):
    rng = random.Random(33509)
    fail = None
    for trial in range(300):
        orders = gen(rng, rng.randint(1, 40))
        if (err := check(orders, bug)):
            fail = (trial, orders, err)
            break
    name = "buggy engine" if bug else "correct engine"
    if fail is None:
        print(f"{name}: 300 random sequences, all properties hold")
    else:
        trial, orders, err = fail
        small = shrink(orders, bug)
        print(f"{name}: falsified on sequence #{trial} ({len(orders)} orders): {err}")
        print(f"   shrunk to {len(small)} orders: {small}  -> {check(small, bug)}")
'''

SRC["w9c3"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio

def momentum(prices, lookback=10, band=0.002):
    if len(prices) < lookback + 1:
        return 0
    chg = prices[-1] / prices[-lookback - 1] - 1.0
    return 1 if chg > band else (-1 if chg < -band else 0)

class MyBot:
    """The thin adapter: read the book, call the pure function, return an order or None."""
    def __init__(self, qty=2):
        self.qty, self.armed = qty, True
    def on_tick(self, market, portfolio):
        if not self.armed:
            return None
        for sym in market.symbols():
            s = momentum(market.prices(sym))
            ask, bid = market.best_ask(sym), market.best_bid(sym)
            if s > 0 and ask and portfolio.can_buy(sym, self.qty, ask):
                return ("buy", sym, self.qty, ask)
            if s < 0 and bid and portfolio.can_sell(sym, self.qty):
                return ("sell", sym, self.qty, bid)
        return None

class FakeMarket:                      # a hand-written fake at the boundary, not the real feed
    def __init__(self, prices, bid, ask):
        self._p, self._b, self._a = prices, bid, ask
    def symbols(self): return ["AAPL"]
    def prices(self, s): return self._p
    def best_bid(self, s): return self._b
    def best_ask(self, s): return self._a

class FakePortfolio:
    def __init__(self, cash=1e6, pos=100):
        self.cash, self.pos, self.calls = cash, pos, []
    def can_buy(self, s, q, px):
        self.calls.append(("can_buy", q, px))           # a spy: record how we were used
        return q * px <= self.cash
    def can_sell(self, s, q):
        self.calls.append(("can_sell", q))
        return self.pos >= q

up = [100.0 + i for i in range(30)]
down = [130.0 - i for i in range(30)]
cases = {
    "uptrend, full book":        (FakeMarket(up, 129.0, 130.0), FakePortfolio(), ("buy", "AAPL", 2, 130.0)),
    "empty book":                (FakeMarket(up, None, None), FakePortfolio(), None),
    "one-sided (no asks)":       (FakeMarket(up, 129.0, None), FakePortfolio(), None),
    "insufficient cash":         (FakeMarket(up, 129.0, 130.0), FakePortfolio(cash=100.0), None),
    "downtrend, nothing to sell": (FakeMarket(down, 100.0, 101.0), FakePortfolio(pos=0), None),
}
for name, (m, p, want) in cases.items():
    got = MyBot().on_tick(m, p)
    print(f"{'PASSED' if got == want else 'FAILED'}  {name:<28} -> {got}   portfolio calls {p.calls}")

async def test_kill_switch_disarms_the_bot():
    b = MyBot()
    b.armed = False
    await asyncio.sleep(0)                   # a real await: this is an async test
    assert b.on_tick(FakeMarket(up, 129.0, 130.0), FakePortfolio()) is None
    return "PASSED"
print(asyncio.run(test_kill_switch_disarms_the_bot()), " async kill-switch test")
'''

SRC["w9c4"] = r'''import numpy as np
np.seterr(all="ignore")
import hashlib
import random

def session(seed=None, rng=None, n=400):
    """A tiny simulated session; returns the leaderboard as a tuple."""
    r = rng if rng is not None else random.Random(seed)
    cash, pos = 100_000.0, 0
    for _ in range(n):
        px = 100 + r.gauss(0, 1)
        if r.random() < 0.1 and pos < 50:
            cash, pos = cash - px * 5, pos + 5
    return round(cash + pos * 100, 6)

def digest(x):
    return hashlib.sha256(repr(x).encode()).hexdigest()[:10]

a, b = session(seed=3), session(seed=3)
print(f"seed=3 twice   : {digest(a)} {digest(b)}  identical: {a == b}")
c = session(seed=4)
print(f"seed=4         : {digest(c)}             differs from seed=3: {c != a}")

# the classic flaky test: code that reaches for the GLOBAL random state
random.seed(3)
def test_a():
    return session(rng=random)          # consumes draws from the shared generator
def test_b():
    return session(rng=random)
order1 = (test_a(), test_b())
random.seed(3)
order2 = (test_b(), test_a())
print(f"global RNG, run a then b: test_b -> {digest(order1[1])}")
print(f"global RNG, run b then a: test_b -> {digest(order2[0])}   same? {order1[1] == order2[0]}  <- order-dependent")
print("fix: pass a seeded generator (or the clock) in; never reach for global state deep in logic")
'''

SRC["w9c5"] = r'''import numpy as np
np.seterr(all="ignore")
import sys

def fill_price(side, limit, best_bid, best_ask, post_only=False):
    if side == "buy":
        if best_ask is None:
            return None                        # line A: one-sided book
        if post_only and limit >= best_ask:
            return "rejected"                  # line B: would cross
        return best_ask if limit >= best_ask else None
    if best_bid is None:
        return None                            # line C
    return best_bid if limit <= best_bid else None

def covered_lines(fn, calls):
    code, hit = fn.__code__, set()
    def tracer(frame, event, arg):
        if frame.f_code is code and event == "line":
            hit.add(frame.f_lineno - code.co_firstlineno)
        return tracer
    sys.settrace(tracer)
    try:
        for args in calls:
            fn(*args)
    finally:
        sys.settrace(None)
    return hit

body = sorted({ln - fill_price.__code__.co_firstlineno for _, _, ln in fill_price.__code__.co_lines()
               if ln is not None} - {0})
suite_v1 = [("buy", 101, 100, 101), ("sell", 99, 100, 101)]          # the happy paths only
suite_v2 = suite_v1 + [("buy", 101, 100, None), ("buy", 101, 100, 101, True), ("sell", 99, None, 101)]
for name, suite in (("happy-path suite", suite_v1), ("with edge cases", suite_v2)):
    hit = covered_lines(fill_price, suite)
    miss = [l for l in body if l not in hit]
    print(f"{name:<17} line coverage {len(hit & set(body))}/{len(body)} = {len(hit & set(body)) / len(body):.0%}"
          f"   missed body lines {miss}")
print("100% of lines ran, and this suite contains no assert at all: coverage proves execution, not correctness")
print("CI gate: --cov-fail-under=70 fails the build below 70%, it does not prove any line is right")
'''

WEEKS.append({
    "n": 9,
    "title": "Session 8 · CI/CD, testing and a desk dashboard: tests, pipelines and monitoring for your system (third IPO)",
    "topics": [
        "the testing pyramid; pytest basics: functions and assert",
        "fixtures and parametrize; mocks, fakes and testing async code",
        "property-based tests for the matching engine",
        "determinism: same input, same result",
        "coverage: useful, but not the goal",
        "CI/CD with GitHub Actions: triggers, jobs, steps, matrix; pin, isolate, containerise",
        "deployment, configuration versus secrets, observability; the desk dashboard; the third IPO",
        "capability you leave with: tests, pipelines and monitoring for your system",
    ],
    "concepts": [
        {
            "name": "Push the logic down the pyramid: a pure signal function, fixtures and parametrize",
            "explain": (
                "<p>Testing a strategy starts by cutting it in two. The decision becomes a pure function of prices, <code>momentum(prices, lookback, band)</code>, with no I/O, no clock and no globals, and <code>on_tick</code> shrinks to an adapter that reads the book and calls it. The pure half runs in microseconds, so a hundred cases cost nothing; that is the base of the testing pyramid, with a few integration tests above it and a single end-to-end run at the top.</p>"
                "<p>The snippet builds a thirty-line pytest to show that there is no magic: it collects functions named <code>test_*</code>, injects fixtures by parameter name (a fresh one per test), expands <code>parametrize</code> into one reported case each, and turns an <code>AssertionError</code> into a FAILED line with the message. Six tests pass. The seventh, a case written to pin the edge \"a move of exactly the band is not a signal\", fails, and the failure is real: <code>100.2 / 100.0 - 1</code> is <code>0.0020000000000000018</code> in binary floating point, which is greater than 0.002, so the function returns +1. That is what edge cases are for. The fix is a decision, not a tweak: compare with a tolerance, or define the band on integer ticks.</p>"
                "<p>In the lab this is steps 2 and 3 (<em>Extract a pure signal function</em> and <em>Fixtures and parametrize instead of copy-paste</em>): the same <code>momentum</code>, the same fixtures, and the parametrized edges that Homework 8 grades (empty book, one-sided book, insufficient cash, a <code>None</code> return). In the arena the pure function is also what <code>as_signal_fn</code> hands the simulator, so the code you tested is the code that trades.</p>"
            ),
            "code": code("w9c1"),
        },
        {
            "name": "Property-based testing: let a generator find the order sequence that breaks the engine",
            "explain": (
                "<p>An example-based test checks the cases you thought of. A property-based test states what must be true for <em>every</em> input and lets a generator search for a counterexample. A matching engine has properties that are easy to state and hard to test by example: after every order the book is never crossed (best bid below best ask); every trade prints at the resting order's price; and quantity is conserved, so everything submitted is either resting or was filled on both sides.</p>"
                "<p>The snippet generates 300 random order sequences from a seeded generator and checks the three properties after every order. The correct engine passes all of them. A variant with a one-token bug, printing trades at the taker's price instead of the resting price, is falsified on the very first sequence of 33 orders. Then comes the step that makes property testing practical: shrinking. The snippet greedily removes orders while the failure persists and ends with a two-order counterexample, a sell at 100.00 followed by a buy at 100.01, which is exactly the test case a human would write if they had thought of it. Libraries such as Hypothesis do the generation and shrinking with far more sophistication; the idea fits in fifty lines.</p>"
                "<p>In the lab the platform's own suite, which step 1 (<em>Read the map</em>) asks you to run, holds the matching engine at 100% coverage because it is the source of truth for every fill in the arena, and the deck's <em>AlgoArena Is Built on Its Tests</em> slide shows how. Exchange teams who change the matching rules are expected to keep these invariants; a property test is the cheapest way to prove they did.</p>"
            ),
            "code": code("w9c2"),
        },
        {
            "name": "Mock the boundary, test the logic: fakes, spies and one async test",
            "explain": (
                "<p>The adapter half of a strategy touches the world: the market data object and the portfolio. You do not test it against a live exchange; you replace the boundary with a small hand-written fake that returns exactly the state you want, and, where it helps, a spy that records how it was called. Then the interesting cases are one line each.</p>"
                "<p>The snippet's <code>FakeMarket</code> and <code>FakePortfolio</code> drive <code>MyBot.on_tick</code> through the five seams that break bots in live sessions. On an uptrend with a full book the bot buys two at the 130.00 ask, and the spy shows it asked <code>can_buy(2, 130.0)</code> first. With an empty book or a one-sided book it returns nothing and never touches the portfolio. With $100 of cash it asks and is refused. On a downtrend with no position it asks <code>can_sell</code> and is refused. The final test is async: it awaits once, so the event loop really runs, and confirms that a disarmed kill switch makes <code>on_tick</code> return <code>None</code>. Fakes beat mocks from a mocking library when the interface is small, because a fake cannot silently accept a method name that does not exist.</p>"
                "<p>In the lab this is step 6 (<em>One async test</em>) with the same <code>FakeMarket</code>, and step 4 (<em>An integration test, the bot inside the simulator</em>), which runs the unchanged bot in <code>SimSession</code> with no network and no mocks. The checkpoint asks for at least eight tests including unit, parametrize, integration, determinism and one <code>@pytest.mark.asyncio</code>. In the arena the empty-book case is not hypothetical: week 9 kills the market maker and the touch goes to <code>None</code>.</p>"
            ),
            "code": code("w9c3"),
        },
        {
            "name": "Determinism is what makes CI possible: seeds in, global state out",
            "explain": (
                "<p>A test that fails one run in twenty trains everyone to ignore red. Continuous integration only works if the same code and the same inputs give the same result on any machine, which means every source of randomness and time is passed in rather than reached for: a seeded generator, an injected clock, no <code>datetime.now()</code> or <code>uuid4()</code> buried in the decision path.</p>"
                "<p>The snippet runs a small simulated session twice with seed 3 and gets the same hash both times; seed 4 gives a different one, as it should. Then it shows the classic flaky test: two tests that draw from the <em>global</em> random generator. After seeding once, running <code>test_a</code> then <code>test_b</code> gives <code>test_b</code> one result; running them in the other order gives it another, because each consumed draws the other expected. Nothing in either test is wrong on its own; the shared state makes the suite order-dependent, which is exactly what parallel test runners and test-order randomisation expose. The fix is to pass a seeded generator in.</p>"
                "<p>In the lab this is step 5 (<em>Determinism: same seed, same result</em>): two simulator runs with <code>seed=3</code> must produce identical leaderboards, and the checkpoint asks you to delete <code>seed=</code> and watch the test genuinely fail. In the arena determinism is also what makes the replay tab and the offline simulator trustworthy: a result you cannot reproduce is an anecdote, not evidence.</p>"
            ),
            "code": code("w9c4"),
        },
        {
            "name": "Coverage and the CI gate: read the missing lines, don't chase the number",
            "explain": (
                "<p>Coverage measures which lines your tests executed. It is useful for one thing, finding code no test has ever run, and misleading for another, because a line can run with nothing asserted about it. The snippet builds a line-coverage tool from <code>sys.settrace</code> and applies it to a small fill-price function. The happy-path suite runs six of nine body lines, 67%, and the missed lines are the interesting ones: the one-sided book on the buy side, the post-only rejection, the one-sided book on the sell side. Adding three edge cases reaches 100%, and the suite still contains no assertion at all. Coverage proved execution; it proved nothing about correctness.</p>"
                "<p>The CI pipeline turns these habits into a gate that runs on every push and pull request: check out, install pinned dependencies, lint, run the tests with a coverage floor, and finish with an end-to-end simulator run that needs no network. A matrix fans the job across Python versions so a version-specific bug cannot hide. The floor catches a suite that quietly stopped testing a module; it does not make any line right.</p>"
                "<p>In the lab this is step 7 (<em>Coverage, read the report, don't chase the number</em>), where the <code>Missing</code> column points at hooks you forgot existed, step 8 (<em>The CI workflow you will commit in HW 8</em>), a workflow with <code>on: [push, pull_request]</code>, a 3.11/3.12 matrix and <code>--cov-fail-under=70</code>, and step 9, the dashboard's tabs read against a local exchange. The platform itself runs 1,286 tests in about twenty seconds, network-free. In the arena this is the week teams ship their bot as a thing they would leave running unattended, just before the third IPO.</p>"
            ),
            "code": code("w9c5"),
        },
    ],
    "widget": {
        "type": "tree-diagram",
        "title": "The CI pipeline on every push: each gate must pass before the next runs",
        "params": {
            "nodes": [
                {"id": "push", "label": "git push / pull request", "level": 0},
                {"id": "py311", "label": "runner: Python 3.11", "level": 1},
                {"id": "py312", "label": "runner: Python 3.12", "level": 1},
                {"id": "install", "label": "install pinned requirements", "level": 2},
                {"id": "lint", "label": "lint (ruff)", "level": 3},
                {"id": "unit", "label": "unit + parametrize + property", "level": 4},
                {"id": "integ", "label": "integration: bot in SimSession", "level": 5},
                {"id": "cov", "label": "coverage floor (fail under 70%)", "level": 6},
                {"id": "sim", "label": "end-to-end sim, no network", "level": 7},
                {"id": "green", "label": "green: safe to merge and run", "level": 8},
            ],
            "edges": [
                {"from": "push", "to": "py311", "label": "matrix"},
                {"from": "push", "to": "py312", "label": "matrix"},
                {"from": "py311", "to": "install"}, {"from": "py312", "to": "install"},
                {"from": "install", "to": "lint"},
                {"from": "lint", "to": "unit"},
                {"from": "unit", "to": "integ", "label": "seeded"},
                {"from": "integ", "to": "cov"},
                {"from": "cov", "to": "sim"},
                {"from": "sim", "to": "green"},
            ],
        },
    },
    "pitfalls": [
        "Testing on_tick against a live exchange. Extract the pure decision function, test it directly, and fake the boundary for the adapter.",
        "Unseeded randomness or datetime.now() in the decision path. The suite becomes flaky and order-dependent; pass the generator and the clock in.",
        "Chasing a coverage percentage. Read the Missing column for untested branches, and remember a covered line can have no assertion.",
        "A CI step that needs the network or a package you never pinned. The runner is a clean laptop with no secrets.",
    ],
    "check": [
        {
            "q": "A parametrized test pins 'a move of exactly the band is not a signal' and fails: momentum returns +1 for 100.0 to 100.2 with band 0.002. Why?",
            "options": [
                "The lookback is off by one",
                "100.2 / 100.0 - 1 evaluates to 0.0020000000000000018 in binary floating point, which exceeds 0.002",
                "pytest compares integers as floats",
                "The fixture was reused between tests",
            ],
            "answer": 1,
            "why": "Neither 100.2 nor 0.002 is exactly representable. Edge-case tests exist to surface this; the fix is a tolerance or integer ticks.",
        },
        {
            "q": "Which of these is a property of a correct price-time matching engine that a property-based test can check after every order?",
            "options": [
                "The last trade price equals the mid",
                "The best bid is strictly below the best ask after matching, and every trade prints at the resting order's price",
                "Every order is filled in full",
                "The book always has at least five levels",
            ],
            "answer": 1,
            "why": "An uncrossed book and resting-price execution hold for every input sequence. The others are not invariants: orders can rest unfilled, books can be thin, and trades print at levels, not at the mid.",
        },
        {
            "q": "Two tests pass alone but one fails when the order of execution changes. What is the most likely cause?",
            "options": [
                "A slow machine",
                "Shared mutable state, such as the global random generator or a module-level cache, consumed by both tests",
                "Too many fixtures",
                "The tests are async",
            ],
            "answer": 1,
            "why": "Order dependence means one test changes state the other reads. Seeded generators passed in, and fresh fixtures per test, remove it.",
        },
        {
            "q": "A suite reaches 100% line coverage. What has it proved?",
            "options": [
                "That the code is correct",
                "That every line was executed at least once by some test; nothing about whether the results were checked",
                "That every branch combination was tested",
                "That the code has no performance problems",
            ],
            "answer": 1,
            "why": "In the snippet the 100% suite contains no assert at all. Coverage finds unexecuted code; assertions and properties establish correctness.",
        },
    ],
})

# ═══ Week 10 · Session 9 — integration and season finale ═══

SRC["w10c1"] = r'''import numpy as np
np.seterr(all="ignore")

STALE_AFTER = 5          # ticks without a change in the touch = the data is cold

class Guarded:
    """A touch reader that survives both failure shapes of a dead market maker."""
    def __init__(self):
        self.last, self.last_change = None, 0
    def decide(self, tick, bid, ask):
        if bid is None or ask is None:                       # shape 1: quotes pulled
            return "hold: one-sided or empty book"
        if ask <= bid:
            return "hold: crossed or locked book"
        if (bid, ask) != self.last:
            self.last, self.last_change = (bid, ask), tick
        if tick - self.last_change >= STALE_AFTER:            # shape 2: a corpse still quoting
            return f"hold: touch unchanged for {tick - self.last_change} ticks"
        return f"trade: mid {(bid + ask) / 2:.3f}"

def naive(bid, ask):
    return f"trade: mid {(bid + ask) / 2:.3f}"               # arithmetic on the touch, no guard

rng = np.random.default_rng(33510)
live = [(round(100 + x, 2), round(100.02 + x, 2)) for x in np.cumsum(rng.normal(0, 0.01, 6))]
for setting in ("CANCEL_ON_DISCONNECT on", "CANCEL_ON_DISCONNECT off"):
    print(f"--- broker killed at tick 6, {setting}")
    dead = [(None, None)] * 6 if "on" in setting.split()[-1] else [live[-1]] * 6
    g = Guarded()
    for t, (b, a) in enumerate(live + dead):
        try:
            n = naive(b, a)
        except TypeError:
            n = "CRASH TypeError: bot stops trading"
        if t in (5, 6, 8, 11):
            print(f"  tick {t:>2}  naive -> {n:<34}  guarded -> {g.decide(t, b, a)}")
        else:
            g.decide(t, b, a)
'''

SRC["w10c2"] = r'''import numpy as np
np.seterr(all="ignore")

class Venue:
    """The exchange: the source of truth for positions and cash."""
    def __init__(self):
        self.pos, self.cash = {"AAPL": 0}, 100_000.0
    def fill(self, side, qty, px):
        s = 1 if side == "buy" else -1
        self.pos["AAPL"] += s * qty
        self.cash -= s * qty * px

class Bot:
    def __init__(self):
        self.shadow, self.realized, self.avg, self.qty = {"AAPL": 0}, 0.0, 0.0, 0
    def on_fill(self, side, qty, px):                 # our own ledger, from fills only
        s = 1 if side == "buy" else -1
        self.shadow["AAPL"] += s * qty
        if s > 0:
            self.avg = (self.avg * self.qty + px * qty) / (self.qty + qty)
            self.qty += qty
        else:
            self.realized += (px - self.avg) * qty
            self.qty -= qty
    def recon(self, venue_pos):
        mine, theirs = self.shadow["AAPL"], venue_pos["AAPL"]
        return "ok" if mine == theirs else f"RECON MISMATCH AAPL: shadow={mine} exchange={theirs}"

v, b = Venue(), Bot()
for side, q, px in [("buy", 10, 100.0), ("buy", 10, 101.0), ("sell", 5, 102.0)]:
    v.fill(side, q, px)
    b.on_fill(side, q, px)
print("before the drop :", b.recon(v.pos), f"| realized {b.realized:+.2f}")

v.fill("sell", 5, 103.0)                              # a fill lands while our socket is down
print("after reconnect :", b.recon(v.pos))

b2 = Bot()                                            # a restart rebuilds local state from nothing
mark = 103.0
nw = v.cash + v.pos["AAPL"] * mark
print(f"restarted bot   : realized {b2.realized:+.2f} (history lost)   net worth from venue ${nw:,.2f} (correct)")
b.shadow = dict(v.pos)                                # the fix: re-sync from the venue, loudly
print("after re-sync   :", b.recon(v.pos), "- the venue owns the truth; a mismatch is a fill you missed")
'''

SRC["w10c3"] = r'''import numpy as np
np.seterr(all="ignore")

VOL_FLOOR, CAP, DD_PENALTY = 0.001, 10.0, 2.0

def score_equity(eq, rf_per_step=0.0):
    """A Sharpe-like ratio on excess returns, times a drawdown multiplier, capped."""
    eq = np.asarray(eq, float)
    r = np.diff(eq) / eq[:-1] - rf_per_step
    vol = r.std(ddof=1)
    mdd = max(0.0, -(eq / np.maximum.accumulate(eq) - 1).min())
    raw = r.mean() / max(vol, VOL_FLOOR) * max(0.0, 1 - DD_PENALTY * mdd)
    return {"ret": eq[-1] / eq[0] - 1, "vol": vol, "mdd": mdd, "score": min(raw, CAP)}

steady = [100_000 * 1.01 ** k for k in range(13)]
jagged = [100_000, 118_000, 96_000, 121_000, 99_000, 125_000, 101_000,
          128_000, 104_000, 130_000, 108_000, 126_000, steady[-1]]
for name, eq in (("steady", steady), ("jagged", jagged)):
    m = score_equity(eq)
    print(f"{name:<7} return {m['ret']:+7.2%}  vol {m['vol']:.4f}  maxDD {m['mdd']:6.2%}  score {m['score']:+.3f}")

cash = [100_000 * 1.0002 ** k for k in range(13)]    # parking in cash earns the risk-free drift
print(f"parked in cash, scored net of that drift: score {round(score_equity(cash, rf_per_step=0.0002)['score'], 3) + 0.0:+.3f}")
for dd in (0.0, 0.10, 0.25, 0.50):
    print(f"  drawdown {dd:4.0%} -> multiplier {max(0.0, 1 - DD_PENALTY * dd):.2f}")
'''

SRC["w10c4"] = r'''import numpy as np
np.seterr(all="ignore")

class RiskGate:
    """Pre-trade checks, cheapest first, plus a kill switch that latches."""
    def __init__(self, max_pos=200, max_notional=25_000, quota=20, collar=0.05, max_loss=1_500):
        self.max_pos, self.max_notional, self.quota = max_pos, max_notional, quota
        self.collar, self.max_loss = collar, max_loss
        self.killed, self.sent_this_tick = False, 0
    def new_tick(self):
        self.sent_this_tick = 0
    def check(self, side, qty, px, pos, mid, pnl):
        if self.killed:
            return "REJECT kill switch latched"
        if pnl <= -self.max_loss:
            self.killed = True
            return f"KILL loss {pnl:,.0f} breached -{self.max_loss:,}: flatten and stop"
        if self.sent_this_tick >= self.quota:
            return f"REJECT quota {self.quota}/tick"
        if abs(px / mid - 1) > self.collar:
            return f"REJECT price {px} outside {self.collar:.0%} collar of {mid}"
        if qty * px > self.max_notional:
            return f"REJECT notional {qty * px:,.0f} > {self.max_notional:,}"
        if abs(pos + (qty if side == "buy" else -qty)) > self.max_pos:
            return f"REJECT position would be {pos + qty} > {self.max_pos}"
        self.sent_this_tick += 1
        return "ACCEPT"

g, pos, pnl = RiskGate(), 150, 0.0
print("fat finger :", g.check("buy", 10, 1850.0, pos, 185.0, pnl))
print("too big    :", g.check("buy", 500, 185.0, pos, 185.0, pnl))
print("over limit :", g.check("buy", 60, 185.0, pos, 185.0, pnl))
print("fine       :", g.check("buy", 20, 185.0, pos, 185.0, pnl))

# a runaway loop: a bug resubmits the same order every iteration
g.new_tick()
out = [g.check("buy", 1, 185.0, 0, 185.0, 0.0) for _ in range(50)]
print(f"runaway loop, 50 sends in one tick: {out.count('ACCEPT')} accepted, {len(out) - out.count('ACCEPT')} rejected by quota")

# losses accumulate; the kill switch trips once and stays tripped
rng = np.random.default_rng(33510)
for t in range(40):
    g.new_tick()
    pnl += rng.normal(-60, 120)
    r = g.check("buy", 1, 185.0, 0, 185.0, pnl)
    if r != "ACCEPT":
        print(f"tick {t}: {r}")
        break
print("next tick   :", g.check("buy", 1, 185.0, 0, 185.0, 0.0))
'''

SRC["w10c5"] = r'''import numpy as np
np.seterr(all="ignore")

TAKER, REBATE = 0.0015, 0.0010
rng = np.random.default_rng(33510)
# our fills from the session tape: side, qty, price, mid at arrival (decision), mid at fill, liquidity
fills = []
mid = 185.0
for i in range(40):
    mid += rng.normal(0, 0.03)
    side = 1 if rng.random() < 0.5 else -1
    maker = rng.random() < 0.45
    fill_mid = mid + rng.normal(0, 0.01) + (0.0 if maker else side * 0.004)   # takers chase a moving price
    px = fill_mid - side * 0.01 if maker else fill_mid + side * 0.01             # half-spread earned or paid
    fills.append((side, int(rng.integers(1, 6)), round(px, 2), mid, fill_mid, maker))

qty = np.array([f[1] for f in fills]); side = np.array([f[0] for f in fills])
px = np.array([f[2] for f in fills]); arrival = np.array([f[3] for f in fills])
fmid = np.array([f[4] for f in fills]); maker = np.array([f[5] for f in fills])
notional = qty * px

eff_spread = side * (px - fmid) / fmid * 1e4            # + = paid vs the mid at the fill
shortfall = side * (px - arrival) / arrival * 1e4       # + = paid vs the mid when we decided
fees = np.where(maker, -REBATE, TAKER) * notional

print(f"fills {len(fills)}   volume ${notional.sum():,.2f}   buys {int((side > 0).sum())} / sells {int((side < 0).sum())}")
print(f"maker share {maker.mean():.0%} of fills ({(notional * maker).sum() / notional.sum():.0%} of notional)")
for name, m in (("maker", maker), ("taker", ~maker)):
    w = notional[m]
    print(f"  {name}: effective spread {np.average(eff_spread[m], weights=w):+6.2f} bps   "
          f"shortfall vs arrival {np.average(shortfall[m], weights=w):+6.2f} bps")
print(f"fees paid ${fees[fees > 0].sum():.2f}   rebates earned ${-fees[fees < 0].sum():.2f}   net ${fees.sum():+.2f}")
print(f"all-in execution cost {np.average(shortfall, weights=notional) + fees.sum() / notional.sum() * 1e4:+.2f} bps of notional")
'''


WEEKS.append({
    "n": 10,
    "title": "Session 9 · Integration and season finale: full live session, team demos, final standings",
    "topics": [
        "integration correctness versus unit correctness; the integration surface end to end",
        "end-to-end tests, smoke tests and staging; failure modes in live systems",
        "run-books, postmortems and observability",
        "reconnect, then re-sync: the venue owns the truth; reconciliation",
        "the performance tearsheet and risk-adjusted scoring",
        "presenting and defending a system; the finale live session; the final exam (closed book, cumulative) in exam week",
        "capability you leave with: full live session, team demos, final standings",
    ],
    "concepts": [
        {
            "name": "Live systems fail partially: guard the touch against both shapes of a dead market maker",
            "explain": (
                "<p>Every component passed its own tests; integration asks whether they honour each other's contracts while something is broken. The most common partial failure in the arena is the market maker going away while the venue and your bot stay up. What your bot then sees depends on one venue setting. With cancel-on-disconnect on, the dead seat's quotes are pulled and <code>best_bid</code>, <code>best_ask</code> and <code>spread</code> return <code>None</code> within a tick. With it off, the dead quotes persist, and the touch keeps reporting the last numbers of a market maker who is no longer there.</p>"
                "<p>The snippet replays both shapes. The naive reader, arithmetic on the touch with no guard, raises <code>TypeError</code> on the first empty book, and a raising <code>on_tick</code> in a live session is a bot that stops trading while everyone watches. Against the persisting quotes the naive reader does worse: it keeps trading confidently at a mid of 99.990 that nobody is standing behind. The guarded reader holds on an empty, one-sided or crossed book, and tracks the tick of the last change in the touch so that five ticks of perfect stillness count as stale: \"the connection is up\" is not \"the data is good.\"</p>"
                "<p>In the lab this is step 1 (<em>Bring the full system up</em>: exchange, broker, your bot and the dashboard, with a fill visible in all three places) and step 2 (<em>Drill 1, kill the feed</em>), where you <code>pkill</code> the broker, observe which shape your venue produces, and grep your own bot for every unguarded <code>best_ask</code>, <code>best_bid</code> and <code>spread(</code>. In the arena the finale runs with the instructor's shocks switched on; a guard that holds is worth more than a signal that is right.</p>"
            ),
            "code": code("w10c1"),
        },
        {
            "name": "Reconnect, then re-sync: the venue owns the truth, and a mismatch is a fill you missed",
            "explain": (
                "<p>A reconnect restores the socket, not your state. Positions and cash come back from the exchange's portfolio update, so they self-heal; anything you accumulated yourself, realized P&amp;L, fill counts, a drift monitor's hit rate, a kill switch's loss tally, starts again from nothing, and any fill that landed while you were disconnected never reached your <code>on_fill</code>. The discipline is a shadow ledger built from fills and compared, loudly, against the venue's positions, and a re-sync from the venue whenever they disagree.</p>"
                "<p>The snippet trades three fills with the shadow ledger and the venue in agreement and a realized P&amp;L of +7.50. Then a five-share sell fills while the bot is disconnected: the recon check logs <code>shadow=15 exchange=10</code>. A restarted bot shows the other half of the problem: its realized P&amp;L is +0.00 because its history is gone, while net worth computed from the venue's cash and position, $100,045.00, is correct. Re-syncing the shadow from the venue clears the mismatch. On a desk that mismatch line is a page, not a warning.</p>"
                "<p>In the lab this is step 3 (<em>Drill 2, kill the venue, then bring it back</em>), where the bot's log shows the backoff retries, then <code>net_worth</code> snapping back to $163,315.58 while <code>realized_pnl</code> stays at +0.00 for the rest of the session, and step 4 (<em>Reconcile your ledger against the exchange's</em>), which adds the shadow ledger and a TCA report from the tape. In the arena the exchange's figures are the ones on the scoreboard; yours are only useful when they agree.</p>"
            ),
            "code": code("w10c2"),
        },
        {
            "name": "Risk-adjusted scoring: the same return, two curves, a hundredfold difference in score",
            "explain": (
                "<p>The season is ranked on a risk-adjusted score, not on final net worth, and the reason is statistical before it is moral: a jagged curve that happens to end high is mostly luck, a steady one is mostly skill. The score has the shape of a Sharpe ratio on returns in excess of the risk-free drift, divided by a volatility with a floor so that a nearly flat curve cannot divide by zero, multiplied by a drawdown penalty that halves the score at a 25% drawdown and zeroes it at 50%, and capped.</p>"
                "<p>The snippet implements that shape with its own constants. Two equity curves both return exactly +12.68%. The steady one has no volatility and no drawdown and is pinned at the cap of 10.000. The jagged one swings by 20% a step with a 19.20% maximum drawdown and scores +0.088, more than a hundred times less. Parking the whole account in cash, scored net of the cash drift, scores zero, so doing nothing cannot win either. The multiplier table makes the drawdown rule concrete: 10% costs a fifth of your score, 25% half of it.</p>"
                "<p>In the lab this is step 5 (<em>Why the season score is risk-adjusted</em>): the platform's own scoring function gives the same two curves 10.000 and 0.091, and <code>make season</code> shows a session where the bot with the most money and the bot with the best risk-adjusted score are different bots, with the report naming which one the season counts. In the arena this is also why one seed is one sample: if the ranking flips across seeds, you have a sample, not a result.</p>"
            ),
            "formula": "S = \\min\\!\\Big(C,\\; \\frac{\\overline{r - r_f}}{\\max(\\sigma_r,\\,\\sigma_{\\min})}\\,\\max(0,\\,1 - 2\\,\\text{MDD})\\Big)",
            "code": code("w10c3"),
        },
        {
            "name": "Pre-trade risk and the kill switch: cheap checks in front of every order, and a latch",
            "explain": (
                "<p>Every order a bot sends should pass through a gate that the strategy cannot bypass: a price collar against fat fingers, a maximum order notional, a position limit, a message quota per tick, and a loss limit that trips a kill switch. The checks are ordered cheapest first and each rejection names its rule. The kill switch latches: once tripped it stays tripped until a human resets it, because a strategy that has lost its limit in a regime it does not understand should not be allowed to try again on the next tick.</p>"
                "<p>The snippet's gate rejects a buy at 1,850 against a 185 mid (outside the 5% collar), a $92,500 order against a $25,000 limit, and an order that would take the position to 210 against a limit of 200, and accepts a normal one. A runaway loop that resubmits the same order fifty times in one tick gets twenty through and thirty rejected by the quota, which is the arena's default of twenty order messages per tick for a student team. Then losses accumulate tick by tick until the running P&amp;L breaches -$1,500 at tick 18; the gate flattens and stops, and the next order, even a harmless one, is rejected because the switch is latched.</p>"
                "<p>In the lab the demo-day checklist of step 6 (<em>The demo-day checklist</em>) requires a kill switch that is \"armed and provably firing\" before the finale, alongside a green <code>make install &amp;&amp; make test &amp;&amp; make sim</code> from a clean clone and no committed <code>.env</code>. In the arena the venue enforces its own quota and, in the risk weeks, liquidates accounts below maintenance margin; your own gate is the one that fires first, and on your terms.</p>"
            ),
            "code": code("w10c4"),
        },
        {
            "name": "The tearsheet from your own tape: transaction-cost analysis and the postmortem",
            "explain": (
                "<p>The last deliverable is evidence. Transaction-cost analysis reads your fills back from the session recording and asks what execution cost you, split the ways that lead to decisions: maker against taker, the effective spread paid against the mid at each fill, the shortfall against the mid when you decided to trade, and fees against rebates. A strategy's edge has to exceed all of them together.</p>"
                "<p>The snippet builds a forty-fill tape with a 35% maker share by count. Maker fills earn half the spread, an effective spread of -0.50 bps, and even beat the arrival mid; taker fills pay +0.47 bps against the mid at the fill and +0.80 bps against the arrival mid, because a taker chases a price that is already moving. Fees dominate both: $19.98 paid against $8.51 of rebates. All in, execution cost 5.57 bps of notional, far more than the spread, which is the week-0 lesson returning as a measured number. A team that can put this table next to its P&amp;L can explain its result; a team that cannot is guessing.</p>"
                "<p>In the lab <code>scripts/tca_report.py --latest</code> produces the same breakdown from your own recording (step 4), and step 7 (<em>The postmortem skeleton</em>) gives the one-page structure the final phase is graded on: what worked and the evidence, what broke and the root cause, where backtest disagreed with live and why, the single biggest risk you were carrying, and three ranked changes. In the arena the finale is a full live session with team demos and the final standings; the final exam, closed book and cumulative, follows in exam week. The public <a href=\"" + ARENA + "\">Systematic Trading arena</a> and the <a href=\"" + SKILLS_SITE + "\">skills dashboard</a> keep the per-session material available after the quarter.</p>"
            ),
            "formula": "\\text{shortfall}_{\\text{bps}} = s\\,\\frac{p_{\\text{fill}} - m_{\\text{arrival}}}{m_{\\text{arrival}}}\\times 10^4,\\qquad \\text{all-in} = \\text{shortfall} + \\frac{\\text{fees} - \\text{rebates}}{\\text{notional}}",
            "code": code("w10c5"),
        },
    ],
    "widget": {
        "type": "timeline",
        "title": "The finale failure drill, tick by tick: kill the broker, kill the venue, recover, reconcile",
        "params": {
            "events": [
                {"t": 0, "label": "system up", "note": "exchange, broker, bot, dashboard; first fill seen in all three"},
                {"t": 40, "label": "broker killed", "note": "pkill the market maker"},
                {"t": 41, "label": "touch goes None", "note": "cancel-on-disconnect on: guard must hold"},
                {"t": 60, "label": "broker restarted", "note": "two-sided book returns"},
                {"t": 90, "label": "exchange killed", "note": "ConnectionClosed caught, backoff 3 s"},
                {"t": 96, "label": "retry, refused", "note": "connect call failed, back off again"},
                {"t": 102, "label": "exchange back", "note": "handshake, joined mid-session"},
                {"t": 103, "label": "net worth snaps back", "note": "realized P&L stays +0.00"},
                {"t": 104, "label": "RECON MISMATCH", "note": "shadow ledger vs exchange positions; re-sync"},
                {"t": 180, "label": "session closed", "note": "flatten; scores locked"},
                {"t": 200, "label": "TCA + postmortem", "note": "evidence from the tape"},
            ]
        },
    },
    "pitfalls": [
        "Arithmetic on best_bid / best_ask / spread without a None guard. The first empty book raises and the bot stops trading.",
        "Treating 'the book is two-sided' as 'the data is good'. Dead quotes can persist; track the last change and treat stillness as staleness.",
        "Trusting counters you accumulated yourself across a reconnect. Re-sync from the venue and log every mismatch.",
        "Presenting final net worth without volatility, drawdown and execution costs. The season is scored risk-adjusted, and a lucky curve is not a result.",
    ],
    "check": [
        {
            "q": "The market maker dies and the venue runs with cancel-on-disconnect OFF. What does a bot's best_bid() return, and what is the hazard?",
            "options": [
                "None immediately; the hazard is a TypeError",
                "The dead market maker's last price, indefinitely; the hazard is trading confidently on a price nobody stands behind",
                "Zero; the hazard is a division by zero",
                "The last trade price; there is no hazard",
            ],
            "answer": 1,
            "why": "Without cancel-on-disconnect nothing removes the dead quotes, so a liveness check that only asks 'is the book two-sided?' passes forever. Track staleness explicitly.",
        },
        {
            "q": "After the exchange restarts, a bot's net worth is correct but its realized P&L reads +0.00 for the rest of the session. Why?",
            "options": [
                "The exchange reset everyone's P&L",
                "Net worth is rebuilt from the venue's portfolio update, but realized P&L was a local counter that the reconnect reset",
                "The bot's fills were cancelled",
                "Realized P&L is only computed at session close",
            ],
            "answer": 1,
            "why": "The venue owns positions and cash; locally accumulated state does not survive a reconnect. That is why the lab adds a shadow ledger and a reconciliation check.",
        },
        {
            "q": "Two teams both end the finale up 12.68%. One curve is steady, the other swings 20% between ticks with a 19% drawdown. How does a risk-adjusted score rank them?",
            "options": [
                "Equal, because the returns are equal",
                "The jagged curve higher, because it shows more conviction",
                "The steady curve far higher: volatility divides the score and the drawdown multiplier cuts it further",
                "It depends only on the number of trades",
            ],
            "answer": 2,
            "why": "In the snippet the steady curve is capped at 10.0 and the jagged one scores 0.088; the lab's platform scorer gives 10.000 and 0.091.",
        },
        {
            "q": "A bug makes the bot resubmit the same order fifty times in one tick. Which pre-trade control limits the damage first?",
            "options": [
                "The price collar",
                "The per-tick message quota",
                "The position limit only",
                "The final exam",
            ],
            "answer": 1,
            "why": "Identical, sensibly priced orders pass the collar and the notional check; the quota caps messages per tick (twenty in the snippet and on the arena for a student team), and the position limit catches what remains.",
        },
    ],
})


# ─────────────────────────────────────────────────────────────────────────
# Course-level fields.
# ─────────────────────────────────────────────────────────────────────────
SKILLS_BUILT = [
    "systematic-trading", "market-microstructure", "order-book-dynamics", "order-book-data",
    "order-types", "transaction-costs", "market-making", "liquidity-provision",
    "exchange-mechanism-design", "market-data-feeds", "streaming-data", "schema-evolution",
    "data-validation", "backtesting", "sharpe-ratio", "drawdown", "signal-construction",
    "code-profiling", "python-pandas", "columnar-storage", "incremental-processing",
    "parallel-programming", "logistic-regression", "unit-testing", "continuous-integration",
    "reproducible-research", "agentic-workflows",
]
# Proposed in data/new_tags/finm-33500.json; each joins skills_built only once it resolves
# (it appears in data/skills_seed.js, in skills.js, or in another course's tags).
EXTRA_TAGS = ["asyncio-concurrency", "object-oriented-design", "algorithmic-complexity",
              "walk-forward-validation", "model-ops", "pre-trade-risk-controls"]
SKILLS_ASSUMED = ["numpy", "git-version-control", "shell-and-filesystem", "linear-regression", "random-walk"]


def _resolvable_tags():
    """Tags the validator will accept: the seed allow-list, skills.js, and other courses."""
    found = set()
    for rel in ("data/skills_seed.js", "skills.js"):
        p = os.path.join(HERE, rel)
        if os.path.exists(p):
            found |= set(re.findall(r"""tag:\s*["']([a-z0-9-]+)["']""", open(p, encoding="utf-8").read()))
            found |= set(re.findall(r'"tag":\s*"([a-z0-9-]+)"', open(p, encoding="utf-8").read()))
    cdir = os.path.join(HERE, "courses")
    for f in os.listdir(cdir):
        if f.endswith(".js") and f != "finm-33500.js":
            txt = open(os.path.join(cdir, f), encoding="utf-8").read()
            for field in ("skills_built", "skills_assumed"):
                m = re.search(r'"?%s"?\s*:\s*\[([^\]]*)\]' % field, txt)
                if m:
                    found |= set(re.findall(r'"([a-z0-9-]+)"', m.group(1)))
    return found


INTERVIEW = [
    {"q": "A buy limit for 450 at 100.02 arrives against resting asks of 300 at 100.02 (oldest), 200 at 100.01 and 100 at 100.01 (newest). Walk through the fills and the average price.", "level": "screen",
     "answer": "Price-time priority: price first, then arrival time, and every trade prints at the resting order's price. Both 100.01 offers beat the older 100.02 offer on price, and the earlier 200 beats the later 100 on time. So the buyer fills 200 at 100.01, 100 at 100.01, then 150 at 100.02 from the oldest order, leaving 150 of that order resting. The average is (300 x 100.01 + 150 x 100.02) / 450 = 100.0133, below the buyer's limit, because the buyer's limit only caps the price; it never sets it. A market order would behave identically here except that any remainder would be cancelled rather than rest."},
    {"q": "Best bid 185.48 x 400, best ask 185.50 x 680. Compute mid, spread in basis points, microprice and imbalance, and say what they suggest.", "level": "screen",
     "answer": "Mid is 185.49; the spread is two cents, about 1.08 bps of the mid. The microprice weights each side's price by the opposite side's size: (185.48 x 680 + 185.50 x 400) / 1080 = 185.4874, about a quarter of a cent below mid. Imbalance is (400 - 680) / 1080 = -0.26. Both say more size wants to sell than to buy, so the next move is slightly more likely to be down. Caveats: the touch is a small part of the book, depth can be pulled at no cost, and none of these numbers is a price you can trade at. You buy at the ask plus fees and sell at the bid minus fees."},
    {"q": "What is the difference between concurrency and parallelism, and which does asyncio give you? When would you reach for a thread or a process instead?", "level": "screen",
     "answer": "Concurrency is structure: many tasks in progress, interleaved. Parallelism is execution: work at the same instant on several cores. asyncio gives concurrency on one thread with cooperative scheduling, which is ideal when time is spent waiting on sockets, and useless for CPU-bound work, since a coroutine that never awaits never yields. A thread is right for a blocking library with no async API, such as yfinance, via asyncio.to_thread, so the loop keeps running; it does not speed up Python arithmetic because of the GIL. For CPU-bound work, a parameter sweep or a feature pipeline, use processes, which each have their own interpreter."},
    {"q": "Your trading bot's worst-case decision lag is two seconds even though it keeps up on average. It reads market data from an asyncio.Queue. What is happening and how do you fix it?", "level": "onsite",
     "answer": "The queue is unbounded or very large, so during bursts the producer runs ahead and the consumer decides on snapshots that are seconds old: the buffer has become a time machine. Throughput is unchanged; latency is not. Book snapshots supersede one another, so the fix is to conflate: keep only the latest snapshot per symbol, or bound the queue to one or a few items so put() applies backpressure. Also check for blocking calls inside the consumer; a synchronous HTTP call or heavy pandas operation freezes every task on the loop. Instrument it: time every on_tick and log when it exceeds the tick budget."},
    {"q": "Design the message protocol between a trading client and an exchange. What must it guarantee and how do you evolve it without breaking live clients?", "level": "onsite",
     "answer": "Frame messages (WebSocket or a length prefix over TCP), and give every message a typed schema with a literal type discriminator, split by direction: what a client may send and what the venue may send back. Validate at the boundary so bad data cannot be constructed, reply to malformed input with an error and keep the session open, and require a lossless round-trip. Add heartbeats to detect silent peers and sequence numbers on incremental updates so a gap triggers a snapshot. Evolve by adding optional fields with defaults, never repurposing or removing fields, and fail loudly on unknown types. Test round-trip, rejection and backward compatibility for every message type."},
    {"q": "A candidate shows you a backtest with Sharpe 2.4 and a 0.6% maximum drawdown on a simple moving-average rule. What do you check first?", "level": "onsite",
     "answer": "Look-ahead first: is the position for the move into bar t decided with information from bar t? A missing shift(1) in a vectorised backtest produces exactly this profile, and shifting it can turn Sharpe 2.4 into slightly negative. Then fills and costs: do trades cross the spread, pay fees and arrive after a realistic latency, or fill at the mid on the decision bar? Then selection: how many configurations were tried, and is the reported number in-sample? Then point-in-time data: survivorship, restatements, adjustments applied to the whole history. Finally, rerun it through an event-driven loop that only hands the strategy the past; if the numbers differ, the vectorised version is wrong."},
    {"q": "How would you implement a limit order book that supports add, cancel and best-price queries efficiently? What are the complexities?", "level": "onsite",
     "answer": "One heap per side keyed on price (negated for bids) with a monotonic sequence number as tie-breaker for time priority, plus a dictionary from order id to live order. Add is O(log n); best price is an O(1) peek after lazily popping cancelled entries; cancel is O(1), removing the order from the dictionary and leaving its heap entry to be discarded when it reaches the top, amortised O(log n). Matching pops or decrements from the opposite heap. A full depth snapshot is O(n) over live orders, so keep it off the hot path or maintain per-level aggregates incrementally. For production add per-level FIFO queues keyed by price, which make level aggregation O(1)."},
    {"q": "You need the rolling mean and variance of a price inside a per-tick callback that runs all day. How do you compute them, and what numerical trap do you avoid?", "level": "screen",
     "answer": "Never recompute over the whole history: that is O(n) per tick and O(n squared) per session, and the bot slows as the day goes on. For an expanding window use Welford's update of the mean and the sum of squared deviations, O(1) per tick. For a fixed window keep a deque and running sums, adding the new value and subtracting the one that leaves. The trap is the one-pass formula mean of squares minus square of mean: at price levels with small variance the two terms agree in every representable digit and the result is zero or negative. Welford accumulates deviations from the running mean, which stay small, so it remains accurate."},
    {"q": "Your ML signal scores 57% on a random train/test split and 48% on a time split of the same intraday data. Explain, and describe how you would validate it properly.", "level": "onsite",
     "answer": "That gap is leakage. With a multi-tick horizon, adjacent labels overlap and adjacent features are built from overlapping windows, so a shuffled split puts each test row's near-twin in training and the model looks the answer up. Validate in time: walk-forward folds with an expanding or rolling training window, an embargo of at least the horizon between training and test, the scaler fitted on training data only, and results reported as mean and dispersion across folds. Run a shuffled-label control, which must collapse to a coin flip. Then convert predictions into trades and net them of spread and fees; beating 50% is not the same as making money."},
    {"q": "Walk me through taking a model from a notebook into a live trading bot. What can go wrong in production and how do you guard against it?", "level": "senior",
     "answer": "Freeze a versioned artifact: weights, scaler statistics, feature list, horizon, training provenance and a content hash or commit, plus a model card stating intended use, validation results and known limits. The bot loads it once at construction and does only arithmetic per tick, within the latency budget, computing features with the same code used in training to avoid train/serve skew. A missing or corrupt artifact must mean no trades, not a crash. In production monitor the live hit rate and feature distributions against the card; a kill switch that latches when the live rate falls well below the validated one stops a model whose world has changed. Retrain offline, revalidate, redeploy a new version."},
    {"q": "How do you test a trading strategy and its infrastructure so that a CI pipeline can be trusted? What goes at each level of the pyramid?", "level": "senior",
     "answer": "Split the strategy into a pure decision function and a thin adapter. Unit tests with fixtures and parametrize cover the pure function, including edges: empty history, exactly-at-threshold, one-sided books, insufficient cash. Property-based tests cover the matching engine's invariants (uncrossed book, resting-price execution, quantity conservation) over generated order sequences with shrinking. Integration tests run the unchanged bot in a headless simulator with no network. Determinism is non-negotiable: seeds and clocks are injected, never global. CI runs all of it on every push across a version matrix, with pinned dependencies, a lint step, a coverage floor used to find untested code rather than as a goal, and an end-to-end simulator run."},
    {"q": "It is the middle of a live session. Your market maker's quotes vanish, then the exchange drops your connection for twenty seconds. What should your system do, and what do you check afterwards?", "level": "senior",
     "answer": "With no quotes the bot must hold, not crash: every read of the touch is guarded against None, and a touch that has not changed for several ticks is treated as stale even if the book looks two-sided. On disconnect, catch the close around the read loop, discard the local book, back off with jitter and reconnect; resting orders are likely cancelled by the venue. On reconnect, re-sync positions and cash from the venue, compare them with a shadow ledger built from fills, and log every mismatch loudly, because it is a fill you missed. Keep pre-trade limits and a latched kill switch in front of every order. Afterwards, reconcile against the tape, run TCA and write a postmortem with root cause and ranked fixes."},
]

GLOSSARY = [
    {"term": "Central limit order book (CLOB)", "def": "The venue's list of resting limit orders on both sides, matched by price-time priority: better price first, then earlier arrival, with trades at the resting order's price."},
    {"term": "Price-time priority", "def": "The matching rule of every major equity exchange: an order at a better price fills first; among equal prices, the earlier order fills first."},
    {"term": "Microprice", "def": "A fair-value estimate from the touch that weights each side's price by the opposite side's size, so a heavy offer pulls it toward the bid."},
    {"term": "Order-book imbalance", "def": "The signed share of resting size on the bid, (bid size - ask size) / (bid size + ask size), at the touch or over several levels."},
    {"term": "Maker / taker", "def": "A maker's order rested and was hit (it adds liquidity and earns a rebate); a taker's order crossed the spread (it removes liquidity and pays a fee)."},
    {"term": "Post-only", "def": "A limit order the venue rejects if it would cross the spread, guaranteeing that it rests and earns the maker rebate."},
    {"term": "Abstract base class (ABC)", "def": "A Python class with abstract methods that cannot be instantiated; a subclass must implement them, so the contract is checked at construction."},
    {"term": "Strategy pattern", "def": "A design in which the decision rule is a separate object behind one interface, so it can be swapped without changing the code that calls it."},
    {"term": "Event loop", "def": "The asyncio scheduler that runs coroutines on one thread, switching between tasks only at await points."},
    {"term": "Backpressure", "def": "A bounded buffer that makes a fast producer wait for a slow consumer, instead of letting data pile up and go stale."},
    {"term": "Framing", "def": "Marking where one message ends in a byte stream, by a delimiter or a length prefix; TCP itself has no message boundaries."},
    {"term": "Discriminated union", "def": "A set of message types distinguished by a literal tag field (here `type`), which tells the parser which schema to validate against."},
    {"term": "Look-ahead bias", "def": "Using information in a backtest that was not available at decision time, such as trading bar t's return on a signal computed from bar t's close."},
    {"term": "Event-driven backtest", "def": "A replay that feeds the strategy one event at a time, with only the past visible, then simulates fills, fees and the portfolio for each decision."},
    {"term": "Lazy deletion", "def": "Cancelling an order by removing it from a lookup table and discarding its stale heap entry only when it reaches the top, keeping cancels O(1)."},
    {"term": "Welford's algorithm", "def": "A numerically stable O(1)-per-update method for a running mean and variance, updating the sum of squared deviations from the running mean."},
    {"term": "Columnar storage", "def": "A file layout that stores each column contiguously and typed (Parquet is the standard), so queries read only the columns they need."},
    {"term": "Embargo", "def": "A gap of at least the label horizon between training and test data in time-series validation, so no training label reaches into the test period."},
    {"term": "Kill switch", "def": "A latched control that stops a strategy from sending orders once a loss limit, drift alarm or operator command trips it, until a human resets it."},
    {"term": "Implementation shortfall", "def": "The cost of execution measured against the price when the decision was made: signed fill price minus arrival mid, plus fees net of rebates."},
]

BRUSHUP = [
    {"topic": "Python classes, properties and inheritance",
     "why": "Session 1 starts from an abstract base class and composition; if __init__, super(), @property and class versus instance attributes are fuzzy, the UML and the SDK will feel like new syntax rather than design.",
     "resource": "The Python tutorial's Classes chapter, then write a tiny Order and Book class with a read-only property."},
    {"topic": "git from the command line, and a virtual environment",
     "why": "Session 0's deliverable is a private repository from the team template and a green six-check smoke test; you will branch, commit and push every week, and CI runs on every push.",
     "resource": "Pro Git (free online), chapters 2 and 3; create a venv with Python 3.11 and install a package into it."},
    {"topic": "What a bid, an ask and a limit order are",
     "why": "Markets are taught from scratch, but the pace is fast: week 0 computes mid, spread, microprice and fees on a real ladder in the first hour.",
     "resource": "The public companion site for the course: " + SKILLS_SITE},
    {"topic": "Generators, context managers and exceptions",
     "why": "Chunked file processing (week 6), reconnect loops (weeks 2 and 9) and error boundaries (week 3) all rely on try/except/finally, with-blocks and lazy iteration.",
     "resource": "The Python tutorial's Errors and Exceptions chapter, plus a generator that yields a large file in chunks."},
    {"topic": "numpy vectorisation and pandas basics",
     "why": "Backtests in week 4, the memory-tuning and chunking of week 6 and the feature matrix of week 7 assume you can index, shift, roll and group without writing a Python loop.",
     "resource": "Python for Data Analysis (McKinney), chapters on numpy and pandas; practise Series.shift and rolling."},
    {"topic": "Big-O notation and the core containers",
     "why": "The midterm sits in session 5 with complexity and data structures; you should already know what a dict, a list, a heap and a deque cost per operation.",
     "resource": "Any algorithms primer's chapters on hashing and heaps; then read the documentation of Python's heapq and bisect modules."},
    {"topic": "Logistic regression and train/test splits",
     "why": "Week 7 fits a ten-line logistic regression by gradient descent and spends its time on validation; knowing the model already leaves room for the leakage lesson.",
     "resource": "An Introduction to Statistical Learning, the classification chapter."},
    {"topic": "Returns, volatility and the Sharpe ratio",
     "why": "Every backtest and the season score are reported in Sharpe, drawdown and return; compute them by hand once before week 4.",
     "resource": "Compute daily returns, annualised volatility, Sharpe and maximum drawdown for one stock's price series in numpy."},
]

REAPPEARS_IN = [
    {"code": "FINM 32700", "how": "The same market, taken down to the microsecond in C++: the price-time CLOB of weeks 0 and 5 becomes a cache-friendly order book, the asyncio loop of week 2 becomes a lock-free ring and a busy-polling thread, and the tail-latency percentiles of week 5 become the course's grading metric. The public low-latency arena site is " + HFT_ARENA + " ."},
    {"code": "FINM 33150", "how": "The strategies themselves: pairs, momentum and mean reversion are designed and evaluated there, and the event-driven backtester, cost model, look-ahead discipline and out-of-sample protocol built here are the tools used to test them."},
    {"code": "FINM 34600", "how": "The order-book and trade data this course records every session are the raw material of high-frequency econometrics: microprice, imbalance and effective spread return there as estimators with properties, and the tick-data handling of week 6 is the pipeline that feeds them."},
    {"code": "FINM 35100", "how": "Why the market maker earns the spread, why a taker is adversely selected and why fees and rebates shape behaviour are the theory there; the arena's maker/taker economics and the TCA of week 9 are its empirical counterpart."},
    {"code": "FINM 32400", "how": "Version control, virtual environments, testing and CI are introduced there as developer tools; this course applies them under load, with a team repository, a smoke test in week 0 and a full CI pipeline in week 8."},
    {"code": "FINM 32800", "how": "Research data pipelines at scale: the columnar storage, chunked out-of-core processing and map-reduce partitioning of week 6 are that course's central themes, applied here to session recordings."},
    {"code": "FINM 33160", "how": "The models: week 7 deliberately uses a logistic regression so the time can go to leak-free validation and model ops; richer learners from that course plug into the same artifact, walk-forward harness and kill switch."},
]


def course():
    known = _resolvable_tags()
    built = SKILLS_BUILT + [t for t in EXTRA_TAGS if t in known and t not in SKILLS_BUILT]
    return {
        "code": "FINM 33500",
        "slug": "finm-33500",
        "title": "Systematic Trading Technologies",
        "instructor": "Sebastien Donadio",
        "quarter": "Autumn",
        "units": 100,
        "block": "computing",
        "concentrations": [],
        "source": {
            "page_url": "https://finmath.uchicago.edu/curriculum/computing/finm-33500/",
            "syllabus_url": "https://uchicago.box.com/s/apdxqfe5cp9n43c4zqi69zvwg4ln8wc1",   # the program page's own syllabus link, as on every other course page
            "fetched": "2026-09-26",
            "note": "Built from the instructor's own syllabus, lecture decks, labs and speaker guides (Autumn 2026), with his permission; the code, questions and glossary are this dashboard's own and were executed before publication.",
        },
        "tier": "A",
        "description": (
            "Systematic trading is the part of finance where a strategy is not a person's judgement but a program: it reads "
            "market data, decides, executes and manages risk thousands of times a day, and someone has to write, test and "
            "operate it. This course teaches the engineering skills quant researchers and quant developers use every day, in "
            "Python, by building: concurrent and event-driven programming, typed protocols over WebSockets, backtesting you can "
            "trust, complexity and data structures, market data at scale, machine learning validated honestly and shipped with a "
            "model card and a kill switch, and the testing and CI discipline of a professional team. Over nine weekly sessions "
            "after an orientation session, teams write the software of a trading floor one component per week and run it "
            "against real market data and against each other in AlgoArena, a trading venue in miniature built for the class, "
            "with a price-time order book, exchanges, market makers and traders, instructor-injected shocks and three IPOs. "
            "AlgoArena is the laboratory, not the subject, and every piece of it runs offline on a laptop. Generative AI is "
            "part of the course as an engineering tool; the midterm and the cumulative final are closed book and closed AI."
        ),
        "prerequisites": [
            "Comfortable, working Python: functions, classes, modules, pip, a debugger and git (the syllabus's stated requirement).",
            "Python 3.11 or newer on your own laptop. No paid data, no cloud account and no brokerage account are needed.",
            "No trading or market-structure background: markets are taught from scratch, and a free finance primer site accompanies the course.",
            "Pairs with FINM 32700 (Low-Latency Trading Systems, C++), which takes the same market down to the microsecond; this course stands on its own.",
        ],
        "textbooks": [
            {"title": "Learn Algorithmic Trading", "author": "Sebastien Donadio and Sourav Ghosh",
             "note": "The instructor's book on building and backtesting algorithmic strategies in Python. Recommended reading; the syllabus states that no book is required."},
            {"title": "Developing High-Frequency Trading Systems", "author": "Sebastien Donadio, Sourav Ghosh and Romain Rossier",
             "note": "The instructor's book on trading-system architecture, exchanges and latency; background for the order-book, protocol and performance weeks, and the bridge to FINM 32700. Recommended, not required."},
            {"title": "Course companion sites", "author": "Sebastien Donadio",
             "note": "The public Systematic Trading arena (" + ARENA + ") and the per-session skills dashboard (" + SKILLS_SITE + "); the team starter repository is the public template " + TEMPLATE + " ."},
        ],
        "skills_built": built,
        "skills_assumed": SKILLS_ASSUMED,
        "brushup": BRUSHUP,
        "weeks": WEEKS,
        "interview": INTERVIEW,
        "reappears_in": REAPPEARS_IN,
        "glossary": GLOSSARY,
    }


def main() -> None:
    assert len(WEEKS) == 10 and [w["n"] for w in WEEKS] == list(range(1, 11)), "ten weeks, n = 1..10"
    C = course()
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(
            "/* courses/finm-33500.js -- FINM 33500, Systematic Trading Technologies.\n"
            "   TIER A: built from the instructor's own syllabus, labs, speaker guides and deck outlines\n"
            "   (Autumn 2026), with his permission. The ten weeks are sessions 0-9. The code, questions,\n"
            "   interview set and glossary are this dashboard's own. GENERATED by tools/gen_finm_33500.py;\n"
            "   every code `output` is real stdout written by tools/run_snippets.py -- do not edit by hand. */\n"
        )
        f.write('window.COURSES = window.COURSES || {};\n')
        f.write('window.COURSES["FINM 33500"] = ')
        f.write(json.dumps(C, indent=2, ensure_ascii=False))
        f.write(';\n')
    n_c = sum(len(w["concepts"]) for w in WEEKS)
    print(f"wrote {OUT}: {len(WEEKS)} weeks, {n_c} concepts, "
          f"{sum(1 for w in WEEKS if w.get('widget'))} widgets, {sum(len(w['check']) for w in WEEKS)} MCQs, "
          f"{len(INTERVIEW)} interview, {len(GLOSSARY)} glossary, skills_built {len(C['skills_built'])}")


if __name__ == "__main__":
    main()
