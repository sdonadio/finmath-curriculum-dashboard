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
course. The four genuinely new tags this course needs are proposed in
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

# @@WEEKS@@


# ─────────────────────────────────────────────────────────────────────────
# Course-level fields and the emitter.
# ─────────────────────────────────────────────────────────────────────────
def main() -> None:
    raise SystemExit("course-level block not written yet")


if __name__ == "__main__":
    main()
