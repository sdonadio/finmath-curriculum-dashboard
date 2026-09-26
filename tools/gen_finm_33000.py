#!/usr/bin/env python3
"""Generator for courses/finm-33000.js -- FINM 33000, Options (Mathematical
Foundations of Option Pricing).

Why a generator instead of a hand-edited JS literal: the course file is a
large JSON-ish object with ~36 embedded Python snippets; hand-editing one is
how a quote or a brace goes missing. This script builds the whole thing as a
Python dict and emits it with json.dumps(indent=2), so the file is always
well formed.

    python3 tools/gen_finm_33000.py                       # writes courses/finm-33000.js
    python3 tools/run_snippets.py courses/finm-33000.js    # fills every `output`
    python3 tools/run_snippets.py --check courses/finm-33000.js
    python3 tools/validate.py courses/finm-33000.js        # must PASS

Every snippet was run locally before the surrounding prose was written (see
the session's scratch testing); `output` is emitted EMPTY here on purpose and
is filled in from real stdout by tools/run_snippets.py, so a claim in the
prose can never drift from what the code actually prints.

Provenance: the only readable source for this course was the public course
page (data/raw/pages/finm-33000.txt). The syllabus is a Box shared link
behind a university login and returned no text, so everything past the
public description is this dashboard's own reconstruction. See source.note.
"""
import json
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "courses", "finm-33000.js")


def code(src, lang="python"):
    return {"lang": lang, "src": src, "output": ""}


WEEKS = [
    {
        "n": 1,
        "title": "No-arbitrage and static replication",
        "topics": [
            "the law of one price",
            "put-call parity",
            "arbitrage bounds on option prices",
            "forward pricing by cost of carry",
        ],
        "concepts": [
            {
                "name": "The law of one price and static replication",
                "explain": """<p>An arbitrage is a trading strategy that requires no net investment today, cannot lose money in any future state, and has a strictly positive chance of profit. Its absence is the single working assumption behind every formula in this course: if two portfolios deliver IDENTICAL payoffs in every possible future state, they must have identical prices today, because otherwise buying the cheap one and selling the expensive one locks in a riskless profit with no capital at risk.</p><p>A "static replication" is the simplest version of this idea: assemble a combination of traded instruments ONCE, today, that exactly matches a target payoff at a single future date. The classic example is a forward contract: being long one share and short one zero-coupon bond struck at the delivery price reproduces a forward's payoff exactly, in every state, with no rebalancing ever required.</p><p>Nothing here has used a probability, a volatility, or a model of how the stock moves. That is the point: static replication arguments are the most model-free tool in the course, and every later chapter -- binomial trees, Black-Scholes, change of numeraire -- is a DYNAMIC generalization of exactly this idea, replicating a payoff by rebalancing a portfolio period by period or instant by instant instead of assembling it once.</p>""",
                "code": code(
                    """scenarios = [80, 95, 100, 105, 120]  # possible S_T outcomes
K = 100

def forward_payoff(S):
    return S - K

def combo_payoff(S):   # long call struck at K, short put struck at K
    call = max(S - K, 0.0)
    put = max(K - S, 0.0)
    return call - put

for S in scenarios:
    fwd, combo = forward_payoff(S), combo_payoff(S)
    print(f"S_T={S:6.1f}  forward={fwd:7.2f}  call-put={combo:7.2f}  match={fwd == combo}")

print("identical payoff in every scenario -> the law of one price forces identical price today")
"""
                ),
            },
            {
                "name": "Put-call parity, model-free",
                "explain": """<p>Put-call parity, <code>C - P = S0 - K e^{-rT}</code>, is the algebraic statement of last concept's replication: a long call plus a short put at the same strike and maturity reproduces a forward's payoff exactly, so the combination must cost exactly what the forward costs. Crucially, nothing about volatility, the stock's distribution, or which pricing model was used to value C and P separately appears anywhere in this identity.</p><p>That is why parity is called model-free: two market makers who disagree violently about volatility, and therefore quote very different individual call and put prices, must STILL agree on C minus P, or one of them is handing the other a riskless arbitrage. The code below prices a call and a put at two wildly different volatilities under Black-Scholes and checks that the individual prices move a great deal while C - P stays pinned to S0 - K e^{-rT} exactly.</p><p>This is also the cheapest sanity check available on any options pricing implementation: if a call and a put priced by the SAME model with the SAME inputs fail parity, the bug is in the code, not in the market. Parity failing is not a modeling disagreement; it is an error.</p>""",
                "formula": r"C - P = S_0 - K e^{-rT}",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

def bs_put(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return K * math.exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1)

S, K, r, T = 100.0, 95.0, 0.03, 1.0
for sigma in (0.15, 0.45):
    c, p = bs_call(S, K, r, sigma, T), bs_put(S, K, r, sigma, T)
    print(f"sigma={sigma:.2f}  call={c:.4f}  put={p:.4f}  C-P={c - p:.6f}")

target = S - K * math.exp(-r * T)
print(f"S0 - K*e^(-rT) = {target:.6f}   (identical for both sigmas, even though C and P are not)")
"""
                ),
            },
            {
                "name": "Arbitrage bounds on a call price",
                "explain": """<p>Static replication also produces BOUNDS, not just equalities. A call can never be worth more than the stock itself (owning the stock outright dominates any claim contingent on it), and it can never be worth less than <code>max(S0 - K e^{-rT}, 0)</code>, because a portfolio of one share financed partly by borrowing <code>K e^{-rT}</code> has a payoff at T of exactly <code>S_T - K</code>, which the call's payoff <code>max(S_T - K, 0)</code> always dominates.</p><p>These bounds are model-free arbitrage restrictions, not pricing formulas: there is a whole interval of prices between them consistent with no arbitrage, and picking a single number inside that interval is exactly the job the rest of this course exists to do. But if a quoted price falls OUTSIDE the interval, no model is needed to exploit it.</p><p>The code below takes a call quoted below its lower bound and constructs the exact trade -- buy the call, short the stock, lend the present value of the strike -- and checks that the position banks a positive amount today while its payoff at maturity is never negative. That combination, money for free today and no way to lose later, is the purest form of arbitrage.</p>""",
                "formula": r"\max(S_0 - Ke^{-rT},\, 0) \;\le\; C_0 \;\le\; S_0",
                "code": code(
                    """import math

S0, K, r, T = 100.0, 90.0, 0.04, 0.5
C_quote = 8.00  # a quoted call price

lower_bound = max(S0 - K * math.exp(-r * T), 0.0)
print(f"lower no-arbitrage bound = {lower_bound:.4f}, quoted call = {C_quote:.4f}")

if C_quote < lower_bound:
    cash_today = S0 - K * math.exp(-r * T) - C_quote  # short stock + lend PV(K) - buy call
    print(f"buy the call, short the stock, lend K*e^(-rT): cash banked today = {cash_today:.4f}")
    for S_T in (70.0, 90.0, 130.0):
        call_payoff = max(S_T - K, 0.0)
        net_at_T = call_payoff - S_T + K
        print(f"  S_T={S_T:6.1f}: call pays {call_payoff:6.2f}, cover short costs {S_T:6.2f}, "
              f"bond repays {K:6.2f} -> net at T = {net_at_T:6.2f}")
    print("net payoff at T is never negative (zero once S_T>=K, positive below it), on top of the")
    print("positive cash already banked today: arbitrage either way")
"""
                ),
            },
            {
                "name": "Forward pricing by cost of carry",
                "explain": """<p>A forward's fair price follows the same replication logic applied to the underlying itself rather than to an option on it. Buying the stock today and financing the purchase by borrowing costs <code>r</code> and earns any dividend yield <code>q</code> along the way, so the no-arbitrage forward price is <code>F0 = S0 e^{(r-q)T}</code>: the "cost of carry" is financing minus dividends, and the forward price is simply the spot grown at that net rate.</p><p>This is not a forecast. <code>F0</code> is the delivery price that makes entering the forward contract worth exactly zero today; it says nothing about where anyone expects the stock to actually be at T. If a quoted forward price deviates from the cost-of-carry value, a cash-and-carry trade (borrow, buy the stock, sell the forward) or its reverse locks in a riskless profit regardless of what the stock eventually does.</p><p>Every later chapter's "risk-neutral drift" is a restatement of exactly this cost-of-carry relation: the risk-neutral measure is defined precisely so that a stock's DISCOUNTED price grows, on average, at this same carry rate and no faster.</p>""",
                "formula": r"F_0 = S_0\, e^{(r-q)T}",
                "code": code(
                    """import math

S0, r, q, T = 100.0, 0.05, 0.02, 1.0
F_fair = S0 * math.exp((r - q) * T)
print(f"fair forward (continuous dividend yield q): F0 = {F_fair:.4f}")

F_quote = 106.50
if F_quote > F_fair:
    profit = F_quote - F_fair
    print(f"quoted forward {F_quote:.2f} is rich by {profit:.4f}: a cash-and-carry arbitrage")
    print("  borrow S0, buy the stock, sell the forward at the quote;")
    print("  at T, deliver the stock into the forward and repay the loan (dividends offset financing)")
    print(f"  riskless profit at T, per unit notional: {profit:.4f}")
"""
                ),
            },
        ],
        "widget": {
            "type": "payoff",
            "title": "Put-call parity as a static replication of the forward",
            "params": {
                "legs": [
                    {"kind": "call", "strike": 100, "qty": 1, "premium": 0},
                    {"kind": "put", "strike": 100, "qty": -1, "premium": 0},
                ],
                "range": [60, 140],
            },
        },
        "pitfalls": [
            "Treating put-call parity as evidence about volatility or model choice; it holds for any model that discounts consistently, so it never tells you which of two prices is 'right'.",
            "Using the arbitrage bounds C<=S0 and C>=max(S0-Ke^{-rT},0) as if they were pricing formulas rather than a no-arbitrage RANGE; there is a whole interval of arbitrage-free prices between them.",
            "Mixing up the spot S with the forward F, or forgetting to discount K, anywhere in a parity or cost-of-carry relation -- either breaks a model-free identity that must hold exactly.",
            "Assuming the forward price is a forecast of the future spot price. It is a no-arbitrage cost-of-carry relation, true regardless of anyone's expectations.",
        ],
        "check": [
            {
                "q": "If two portfolios have identical payoffs in every future state, no-arbitrage implies:",
                "options": [
                    "They must have the same price today",
                    "Their prices may differ if the models used to value them differ",
                    "Only the payoff at maturity matters, not today's price",
                    "This holds only under Black-Scholes",
                ],
                "answer": 0,
                "why": "The law of one price is a model-free consequence of no-arbitrage: if the payoffs coincide in every state and the prices did not, buying the cheaper and selling the dearer locks in a riskless profit. No model enters the argument.",
            },
            {
                "q": "Put-call parity, C - P = S0 - K e^{-rT}, is best described as:",
                "options": [
                    "A restriction implied by a specific volatility model",
                    "A model-free identity that follows from static replication of the forward",
                    "An empirical regularity that occasionally fails in real markets",
                    "An inequality, not an equality",
                ],
                "answer": 1,
                "why": "Parity follows purely from the fact that long call plus short put reproduces the forward's payoff exactly; it holds for any consistent pricing model, which is exactly what makes it model-free and exactly why it is an equality.",
            },
            {
                "q": "A quoted call trades strictly below max(S0-Ke^{-rT}, 0). This implies:",
                "options": [
                    "The option is simply cheap and should be bought without further analysis",
                    "An arbitrage: buy the call and short the replicating portfolio for a riskless profit",
                    "Nothing; options can trade below intrinsic value in any market",
                    "The volatility used to price it must be negative",
                ],
                "answer": 1,
                "why": "The lower bound is a no-arbitrage restriction, not a suggestion. A quote below it means the replicating portfolio (long stock, short PV(K)) is more expensive than a claim its payoff always dominates, which is a textbook arbitrage.",
            },
            {
                "q": "The forward price F0 = S0 e^{(r-q)T} is:",
                "options": [
                    "A forecast of the expected future spot price",
                    "The delivery price that makes entering the forward worth zero today, given no-arbitrage",
                    "Always equal to the current spot price",
                    "Only valid under a risk-neutral measure, not under any measure",
                ],
                "answer": 1,
                "why": "The forward price is defined by the cost-of-carry replication argument, which uses no probability measure at all; it is a static no-arbitrage relation, true under any measure, and it is not a prediction of where the spot will end up.",
            },
        ],
    },
    {
        "n": 2,
        "title": "The Fundamental Theorems of Asset Pricing",
        "topics": [
            "state prices in a one-period economy",
            "FTAP I: no arbitrage and the risk-neutral measure",
            "FTAP II: completeness and uniqueness",
            "risk-neutral vs. physical probabilities",
        ],
        "concepts": [
            {
                "name": "State prices in a one-period economy",
                "explain": """<p>Consider the simplest possible model: one period, a finite number of future states, and a handful of traded assets with known state-by-state payoffs. A "state price" <code>psi_s</code> is a number attached to each state such that every traded asset's price today equals the sum, over states, of its payoff in that state times <code>psi_s</code>. If such a vector exists with every <code>psi_s</code> STRICTLY POSITIVE, the prices are internally consistent with no arbitrage.</p><p>State prices are found by solving a linear system: one equation per traded asset, one unknown per state. With as many independent assets as states, the system has a unique solution; with fewer, it has a whole family of solutions (next concept's completeness question). The code below solves a two-state, two-asset (bond and stock) system and checks positivity.</p><p>Once a state-price vector is in hand, ANY payoff defined on the same states -- including a derivative nobody has agreed a price for yet -- can be priced by the identical formula: multiply each state's payoff by its state price and sum. This is the entire content of no-arbitrage pricing, before any mention of "risk-neutral probability" at all.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

# two states next period; two traded assets: a risk-free bond and a stock
payoffs = np.array([[1.0, 1.0],       # bond pays 1 in both states
                     [130.0, 90.0]])  # stock pays 130 in "up", 90 in "down"
prices = np.array([1 / 1.03, 100.0])  # bond price = discount factor, stock price = 100

psi = np.linalg.solve(payoffs, prices)   # payoffs @ psi = prices
print("state prices (up, down):", np.round(psi, 6))
print("all positive ->", bool(np.all(psi > 0)), ": consistent with no arbitrage")

# reprice a call struck at 100 using the SAME state prices
call_payoffs = np.array([max(130 - 100, 0), max(90 - 100, 0)])
call_price = psi @ call_payoffs
print(f"call price implied by these state prices = {call_price:.6f}")
"""
                ),
            },
            {
                "name": "FTAP I: no arbitrage iff a risk-neutral measure exists",
                "explain": """<p>The first Fundamental Theorem of Asset Pricing says: a market admits no arbitrage if and only if there exists an equivalent martingale measure (EMM) <code>Q</code> under which every traded asset's DISCOUNTED price is a <code>Q</code>-martingale. An EMM is nothing more than the state prices from the previous concept, normalized by the discount factor into genuine probabilities: <code>Q_s = psi_s / DF</code> where <code>DF = sum(psi)</code> is the bond's price.</p><p>Because <code>psi_s > 0</code> for every state (no arbitrage) and they sum, after dividing by <code>DF</code>, to exactly 1, <code>Q</code> is a bona fide probability distribution. Every traded asset's price is then <code>DF * E^Q[\\text{payoff}]</code> -- a discounted expectation, which is the formula every later chapter of this course specializes.</p><p>The code checks that <code>Q</code> sums to one and that the discounted expected stock price under <code>Q</code> reproduces today's stock price exactly: that IS the martingale property, verified directly rather than asserted.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

payoffs = np.array([[1.0, 1.0], [130.0, 90.0]])
prices = np.array([1 / 1.03, 100.0])
psi = np.linalg.solve(payoffs, prices)

DF = psi.sum()                    # = bond price = 1/(1+r)
Q = psi / DF
print(f"discount factor DF = {DF:.6f}  (bond price)")
print(f"risk-neutral probabilities Q = {np.round(Q, 6)}   sum = {Q.sum():.6f}")

S_up, S_down, S0 = 130.0, 90.0, 100.0
E_Q_S = Q @ np.array([S_up, S_down])
print(f"E^Q[S_1] = {E_Q_S:.6f}   DF * E^Q[S_1] = {DF * E_Q_S:.6f}   vs S0 = {S0}")
print("no arbitrage <=> a Q exists with every probability strictly positive and prices equal DF*E^Q[payoff]")
"""
                ),
            },
            {
                "name": "FTAP II: completeness pins down a UNIQUE pricing measure",
                "explain": """<p>The market is COMPLETE if every conceivable payoff on the state space can be replicated by a portfolio of traded assets. The second Fundamental Theorem says: in a no-arbitrage market, completeness holds if and only if the equivalent martingale measure is UNIQUE. With as many independent traded assets as states, completeness (and hence uniqueness) is automatic; with fewer assets than states, the market is incomplete and many different <code>Q</code>'s are consistent with the SAME traded prices.</p><p>The code below builds a three-state economy with only two traded assets (a bond and a stock). A whole one-parameter family of valid risk-neutral measures reprices the bond and the stock identically to the cent, yet a NEW claim -- an option struck between the up and down states -- gets a different price for every choice of the free parameter. There is no single "the" arbitrage-free price for that option here; there is a RANGE, and picking one point in it requires either an additional traded instrument or a modeling assumption beyond no-arbitrage.</p><p>This is the precise sense in which options in real markets are not fully pinned down by static replication alone: the whole apparatus of dynamic replication in continuous time (binomial trees, then Black-Scholes) exists to manufacture completeness where static replication cannot.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

# THREE states, but only two traded assets (bond, stock) -> an incomplete market
S_states = np.array([140.0, 100.0, 70.0])
stock_price, R = 100.0, 1.03
K = 90.0
call_payoffs = np.maximum(S_states - K, 0.0)

def valid_Q(q_mid):
    # one free parameter: probability mass on the middle state; the other two
    # probabilities are pinned by "sums to 1" and "reprices the stock" exactly
    A = np.array([[1.0, 1.0], [140.0, 70.0]])
    b = np.array([1.0 - q_mid, stock_price * R - 100.0 * q_mid])
    Q_up, Q_down = np.linalg.solve(A, b)
    return np.array([Q_up, q_mid, Q_down])

for w in (0.10, 0.25, 0.40):
    Q = valid_Q(w)
    ok = bool(np.all(Q > 0)) and abs(Q.sum() - 1.0) < 1e-9
    call_price = (Q @ call_payoffs) / R
    print(f"middle-state prob w={w:.2f}: Q={np.round(Q, 4)}  valid={ok}  call(K=90) price={call_price:.4f}")

print("every Q above reprices the bond and the stock exactly, yet the call price still moves with w:")
print("bond + stock in 3 states is an incomplete market, so the EMM -- and the call price -- is not unique")
"""
                ),
            },
            {
                "name": "Risk-neutral vs. physical: why P never appears in the price",
                "explain": """<p>Physical probabilities -- an agent's genuine beliefs, or historical frequencies -- do not enter a no-arbitrage price at all. Only the state prices (equivalently, <code>Q</code>) matter, and those are derived from TODAY'S traded prices, not from anyone's forecast. Two traders with wildly different views on how likely an "up" move is will still agree on a derivative's no-arbitrage price in a complete market, because replication pins the price down without any reference to physical probability.</p><p>The code makes this concrete: it replicates a call with a stock-and-bond portfolio, computes the replication cost, and then separately computes what the option's expected payoff WOULD be under three very different physical beliefs about the probability of the up move. The replication cost never moves; the naively discounted physical expectations do, and none of them equals the actual price except by coincidence.</p><p>This is the most common conceptual error a new student makes: reading "probability" in a formula and assuming it means someone's forecast. <code>Q</code> is a pricing device manufactured from prices; <code>P</code> is a belief. They coincide only in the degenerate case of a risk-neutral investor with an already-correct forecast, which is not an assumption this course ever needs to make.</p>""",
                "code": code(
                    """S0, Su, Sd, R, K = 100.0, 130.0, 90.0, 1.03, 100.0
Cu, Cd = max(Su - K, 0.0), max(Sd - K, 0.0)

# replicate the call with Delta shares of stock and B in the risk-free bond
Delta = (Cu - Cd) / (Su - Sd)
B = (Cu - Delta * Su) / R
replication_cost = Delta * S0 + B
print(f"Delta = {Delta:.6f}   B (bond position) = {B:.6f}")
print(f"replication cost today = {replication_cost:.6f}")

for p_belief in (0.10, 0.50, 0.90):
    naive = (p_belief * Cu + (1 - p_belief) * Cd) / R
    print(f"physical belief p(up)={p_belief:.2f}: naive discounted E_p[payoff] = {naive:.4f}  -- NOT the option price")

print(f"the actual no-arbitrage price is the replication cost, {replication_cost:.6f}, for every value of p")
"""
                ),
            },
        ],
        "widget": None,
        "pitfalls": [
            "Confusing the risk-neutral probability Q with a real-world probability or forecast; Q is a pricing device derived from traded prices, not a belief.",
            "Assuming an equivalent martingale measure always exists; it exists if and only if the inputs admit no arbitrage. Mis-specified or stale prices can make the state-price system infeasible.",
            "Treating an incomplete market's 'a' risk-neutral price for an untraded claim as 'the' price; with multiple valid measures, the no-arbitrage price is a RANGE until something beyond no-arbitrage pins one measure down.",
            "Skipping the positivity check on solved state prices; a negative or zero entry signals an arbitrage in the inputs, not a usable pricing measure.",
        ],
        "check": [
            {
                "q": "A one-period market has no arbitrage. The first Fundamental Theorem says this is equivalent to:",
                "options": [
                    "Every asset earns the risk-free rate in expectation under the physical measure",
                    "There exists an equivalent martingale measure making every discounted traded price a martingale",
                    "The market must also be complete",
                    "Physical probabilities must be uniform across states",
                ],
                "answer": 1,
                "why": "FTAP I is precisely the equivalence between no-arbitrage and the existence of an EMM. It says nothing about completeness (that is FTAP II) and nothing about physical probabilities being uniform or otherwise.",
            },
            {
                "q": "In the three-state, two-asset example, varying the free parameter w:",
                "options": [
                    "Changes the bond and stock prices",
                    "Leaves the bond and stock prices exactly fixed but changes the price of an untraded call",
                    "Is only possible if an arbitrage already exists",
                    "Has no effect on any price",
                ],
                "answer": 1,
                "why": "Every choice of w in the example reprices the bond and stock to the cent by construction; the market's incompleteness shows up only once you ask for the price of a claim (the call) that neither traded asset can replicate.",
            },
            {
                "q": "Solving a state-price system from traded payoffs and prices returns a vector with a negative entry. This means:",
                "options": [
                    "Nothing unusual; state prices can be negative",
                    "The physical probabilities were misspecified",
                    "The inputs admit an arbitrage; no valid risk-neutral measure exists",
                    "The market is simply incomplete",
                ],
                "answer": 2,
                "why": "A negative state price cannot be normalized into a probability, which is exactly the failure mode FTAP I predicts when arbitrage is present in the inputs. It is unrelated to physical beliefs, and incompleteness alone would not produce a negative solution to a square, well-posed system.",
            },
            {
                "q": "Two traders disagree sharply about the probability of an 'up' move but agree on all currently traded prices. In a COMPLETE market, the no-arbitrage price of a new derivative:",
                "options": [
                    "Will differ between them, reflecting their beliefs",
                    "Is identical for both, because replication pins down the price without reference to physical probability",
                    "Cannot be determined without knowing whose belief is correct",
                    "Requires averaging their two beliefs",
                ],
                "answer": 1,
                "why": "Completeness means the new payoff can be replicated by traded assets whose prices both traders already agree on; the replication cost is the price, and physical beliefs never enter that calculation.",
            },
        ],
    },
    {
        "n": 3,
        "title": "Binomial trees: replication and risk-neutral pricing",
        "topics": [
            "one-period binomial replication",
            "the risk-neutral probability q",
            "multi-period backward induction",
            "the discounted stock price as a Q-martingale, node by node",
        ],
        "concepts": [
            {
                "name": "One-period binomial replication, in general u, d, R",
                "explain": """<p>The binomial model is the FTAP machinery of last week specialized to exactly two states per period. A stock at <code>S0</code> moves to <code>S0*u</code> ("up") or <code>S0*d</code> ("down") one period later, and a riskless bond grows by a factor <code>R</code>. A derivative paying <code>Cu</code> or <code>Cd</code> in the two states is replicated by <code>Delta</code> shares of stock plus <code>B</code> in the bond, and because there are exactly two assets spanning exactly two states, the replicating portfolio is unique -- the market is complete, one period at a time.</p><p>No-arbitrage requires <code>d < R < u</code>: otherwise the bond or the stock dominates the other in BOTH states, which is exactly last week's "positive state prices" condition specialized to two states. When that holds, the risk-neutral probability <code>q = (R-d)/(u-d)</code> lies strictly between 0 and 1, and the replication cost equals the discounted risk-neutral expectation -- the same object, computed two different ways.</p><p>The code verifies both routes agree to machine precision for a generic set of parameters, which is the entire content of one-period binomial pricing before any mention of a "tree" with more than one period.</p>""",
                "formula": r"\Delta=\frac{C_u-C_d}{S_0(u-d)},\qquad q=\frac{R-d}{u-d}",
                "code": code(
                    """def replicate(S0, u, d, R, Cu, Cd):
    Su, Sd = S0 * u, S0 * d
    Delta = (Cu - Cd) / (Su - Sd)
    B = (Cu - Delta * Su) / R
    return Delta, B, Delta * S0 + B

S0, u, d, R, K = 100.0, 1.2, 0.85, 1.02, 100.0
Cu, Cd = max(S0 * u - K, 0.0), max(S0 * d - K, 0.0)
print(f"no-arbitrage requires d < R < u: {d} < {R} < {u} -> {d < R < u}")

Delta, B, price = replicate(S0, u, d, R, Cu, Cd)
print(f"Delta={Delta:.6f}  B={B:.6f}  replication cost={price:.6f}")

q = (R - d) / (u - d)
risk_neutral_price = (q * Cu + (1 - q) * Cd) / R
print(f"risk-neutral probability q={q:.6f}")
print(f"E^Q[payoff]/R = {risk_neutral_price:.6f}  (matches the replication cost)")
"""
                ),
            },
            {
                "name": "Multi-period backward induction",
                "explain": """<p>A multi-period recombining tree is built by applying the SAME one-period step over and over: compute terminal payoffs at every leaf, then roll backward one period at a time using <code>V = (q*V_up + (1-q)*V_down) / R</code> at every node, with <code>q</code> constant because <code>u</code>, <code>d</code> and <code>R</code> are the same every period. This is "backward induction," and it is valid because each single step is exactly last concept's one-period replication argument, applied locally.</p><p>What is easy to miss: the replicating portfolio (<code>Delta</code>, <code>B</code>) is NOT fixed for the whole tree. It is recomputed, and REBALANCED, at every single node, using that node's own local <code>Cu</code>, <code>Cd</code> and <code>S</code>. Backward induction is silently doing this rebalancing for you; it never needs to be programmed explicitly because the recursion already encodes it.</p><p>The code prices a European call and put in the same 4-step tree and checks that put-call parity holds EXACTLY, not approximately, because both prices are linear expectations under the same <code>Q</code> and parity is a linear identity about that expectation.</p>""",
                "formula": r"V_i^{(t)} = \frac{1}{R}\Big(q\,V_{i+1}^{(t+1)} + (1-q)\,V_i^{(t+1)}\Big)",
                "code": code(
                    """def binomial_price(S0, K, u, d, R, n, kind="call"):
    q = (R - d) / (u - d)
    ST = [S0 * (u ** j) * (d ** (n - j)) for j in range(n + 1)]
    if kind == "call":
        V = [max(s - K, 0.0) for s in ST]
    else:
        V = [max(K - s, 0.0) for s in ST]
    for step in range(n, 0, -1):
        V = [(q * V[j + 1] + (1 - q) * V[j]) / R for j in range(step)]
    return V[0], q

S0, K, u, d, R, n = 100.0, 100.0, 1.08, 0.94, 1.01, 4
price, q = binomial_price(S0, K, u, d, R, n, "call")
print(f"risk-neutral q = {q:.6f}")
print(f"{n}-step binomial call price = {price:.6f}")

put_price, _ = binomial_price(S0, K, u, d, R, n, "put")
print(f"{n}-step binomial put price  = {put_price:.6f}")
print(f"put-call parity check: C-P={price - put_price:.6f}  vs  S0-K/R^n={S0 - K / R ** n:.6f}")
"""
                ),
            },
            {
                "name": "The discounted stock price is a Q-martingale, node by node",
                "explain": """<p>The defining property of the risk-neutral probability <code>q</code> is that it makes the discounted stock price a <code>Q</code>-martingale: <code>E^Q[S_{t+1}] / R = S_t</code> at EVERY node, not just from the root looking all the way to the end. This is exactly what makes backward induction valid one step at a time -- the martingale property, plus the tower property of conditional expectation, is what lets rolling the tree back a single period repeatedly reproduce the full multi-period discounted expectation.</p><p>The code below builds a small 3-step tree of stock prices and checks the martingale identity at every single node, not just the root, to make the "stepwise" nature of the claim concrete rather than asserted.</p>""",
                "code": code(
                    """S0, u, d, R = 100.0, 1.08, 0.94, 1.01
q = (R - d) / (u - d)
n = 3
S = [[S0 * (u ** j) * (d ** (i - j)) for j in range(i + 1)] for i in range(n + 1)]

print("checking E^Q[S_(t+1)]/R = S_t at every node of the tree:")
for t in range(n):
    for j in range(t + 1):
        Snext = q * S[t + 1][j + 1] + (1 - q) * S[t + 1][j]
        match = abs(S[t][j] - Snext / R) < 1e-9
        print(f"  t={t} node={j}: S={S[t][j]:8.4f}   E^Q[S_next]/R={Snext / R:8.4f}   match={match}")

print("every node passes: the discounted stock is a Q-martingale STEP BY STEP, which is exactly")
print("what makes rolling the tree back one period at a time (backward induction) valid")
"""
                ),
            },
            {
                "name": "No-arbitrage requires d < R < u",
                "explain": """<p>If <code>R >= u</code>, the bond beats the stock in BOTH states: short the stock, buy the bond, and win regardless of the outcome. If <code>R <= d</code>, the reverse holds and the stock dominates the bond everywhere. Either way, <code>q = (R-d)/(u-d)</code> falls outside <code>(0,1)</code> exactly when this happens -- a negative or an over-unity "probability" is the tree's way of reporting that the inputs are not arbitrage-free, the same diagnostic as a negative state price last week, specialized to two states.</p><p>This is not a corner case to special-case away in code: it is the tree's own consistency check, and any pricing tool built on a binomial tree should verify <code>d < R < u</code> before trusting a single output number.</p>""",
                "code": code(
                    """def q_of(u, d, R):
    return (R - d) / (u - d)

for u, d, R in [(1.10, 0.90, 1.02), (1.10, 0.90, 1.15), (1.10, 0.90, 0.85)]:
    q = q_of(u, d, R)
    print(f"u={u:.2f} d={d:.2f} R={R:.2f}  -> q={q:.4f}  valid probability={0.0 < q < 1.0}")

u, d, R, S0 = 1.10, 0.90, 1.15, 100.0
print()
print("R=1.15 > u=1.10: the bond beats the stock in BOTH states -- short the stock, buy the bond")
for state, mult in (("up", u), ("down", d)):
    stock_val, bond_val = S0 * mult, S0 * R
    print(f"  {state}: stock -> {stock_val:.2f}, bond -> {bond_val:.2f}, bond wins by {bond_val - stock_val:.2f}")
"""
                ),
            },
        ],
        "widget": {
            "type": "binomial-tree",
            "title": "A recombining binomial lattice, priced by backward induction",
            "params": {
                "S0": 100,
                "u": 1.08,
                "d": 0.94,
                "r": 0.01,
                "steps": 4,
                "K": 100,
                "kind": "call",
                "style": "european",
            },
        },
        "pitfalls": [
            "Picking u, d, R with R outside (d,u); the resulting q is not a probability and signals the inputs admit an arbitrage, not a usable pricing tree.",
            "Rebuilding Delta and B only once for a multi-period tree; the replicating portfolio must be REBALANCED at every node, which is exactly what backward induction is silently doing.",
            "Believing q equals the real-world probability of an up move; it is whatever number makes the discounted stock a Q-martingale, and it generally has nothing to do with anyone's forecast.",
            "Applying a plain European backward-induction formula to an American payoff without the early-exercise comparison at each node -- next week's topic.",
        ],
        "check": [
            {
                "q": "In a one-period binomial model, the number of shares Delta needed to replicate a derivative is:",
                "options": [
                    "(Cu - Cd) / (u - d)",
                    "(Cu - Cd) / (S0*(u - d))",
                    "(Cu + Cd) / (2*S0)",
                    "q*Cu + (1-q)*Cd",
                ],
                "answer": 1,
                "why": "Delta is the change in the derivative's value divided by the change in the STOCK's value across the two states, i.e. (Cu-Cd)/(Su-Sd) = (Cu-Cd)/(S0*(u-d)); the other options omit the S0 scaling or compute something else entirely.",
            },
            {
                "q": "Backward induction in a multi-period binomial tree is valid because:",
                "options": [
                    "The stock price is deterministic",
                    "The discounted stock price is a Q-martingale at every node, so the one-period formula can be applied repeatedly",
                    "q is always equal to 0.5",
                    "American and European options are priced identically in a tree",
                ],
                "answer": 1,
                "why": "The martingale property holds locally at every node, which combined with the tower property of conditional expectation is exactly what licenses rolling the tree back one period at a time and getting the correct multi-period answer.",
            },
            {
                "q": "If R >= u in a one-period binomial model:",
                "options": [
                    "q is still a valid probability between 0 and 1",
                    "The riskless bond dominates the stock in every state, which is an arbitrage",
                    "The stock is always the better investment",
                    "Nothing changes; u and d don't affect q's validity",
                ],
                "answer": 1,
                "why": "R>=u means the bond grows at least as fast as the stock even in the stock's BEST state, so shorting the stock and buying the bond wins in every state -- an arbitrage, and q=(R-d)/(u-d) is >= 1, not a valid probability.",
            },
            {
                "q": "Put-call parity in an n-step binomial tree, with the same u, d, R used for both the call and the put, holds:",
                "options": [
                    "Only approximately, because trees are discrete",
                    "Exactly, because it follows from E^Q[S_T]/R^n = S0",
                    "Only in the limit of infinitely many steps",
                    "Only if the tree happens to be recombining",
                ],
                "answer": 1,
                "why": "C - P = E^Q[(S_T-K)^+ - (K-S_T)^+]/R^n = E^Q[S_T-K]/R^n = S0 - K/R^n exactly, because the discounted stock is an exact Q-martingale in the tree, with no approximation involved.",
            },
        ],
    },
    {
        "n": 4,
        "title": "From binomial to Black-Scholes, and American options",
        "topics": [
            "CRR parameterization and convergence",
            "American early exercise in the tree",
            "never exercise an American call early without dividends",
            "dividends and the incentive to exercise early",
        ],
        "concepts": [
            {
                "name": "CRR parameterization and convergence to Black-Scholes",
                "explain": """<p>Cox, Ross and Rubinstein chose <code>u = e^{sigma*sqrt(dt)}</code>, <code>d = 1/u</code>, and <code>R = e^{r*dt}</code> specifically so that, as the number of steps grows and <code>dt = T/n</code> shrinks, the tree's mean and variance per unit time converge to those of the lognormal diffusion that underlies Black-Scholes: this is a discrete Central Limit Theorem argument, not a coincidence of convenient numbers.</p><p>As <code>n -> infinity</code>, the CRR binomial price of a European option converges to the Black-Scholes closed form. The convergence is NOT monotonic: the binomial price oscillates around the continuous-time value, with the size of the oscillation shrinking as <code>n</code> grows, which is why practitioners sometimes average consecutive-<code>n</code> binomial prices to accelerate convergence.</p><p>The code prices the same call at increasing step counts and shows the error shrinking (with sign flips) toward the closed-form Black-Scholes benchmark computed independently.</p>""",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

def crr_call(S0, K, r, sigma, T, n):
    dt = T / n
    u = math.exp(sigma * math.sqrt(dt))
    d = 1.0 / u
    R = math.exp(r * dt)
    q = (R - d) / (u - d)
    ST = [S0 * (u ** j) * (d ** (n - j)) for j in range(n + 1)]
    V = [max(s - K, 0.0) for s in ST]
    for step in range(n, 0, -1):
        V = [(q * V[j + 1] + (1 - q) * V[j]) / R for j in range(step)]
    return V[0]

S0, K, r, sigma, T = 100.0, 100.0, 0.03, 0.25, 1.0
bs = bs_call(S0, K, r, sigma, T)
print(f"Black-Scholes closed form = {bs:.6f}")
for n in (10, 50, 200, 1000):
    px = crr_call(S0, K, r, sigma, T, n)
    print(f"n={n:5d}: CRR price = {px:.6f}   error = {px - bs:+.6f}")
"""
                ),
            },
            {
                "name": "American early exercise: compare against intrinsic value at every node",
                "explain": """<p>Pricing an American option in a tree adds exactly one comparison to the European backward-induction recursion: at every node, after computing the discounted continuation value, compare it against the immediate exercise (intrinsic) value and take the MAXIMUM. The set of nodes where intrinsic value wins is the option's early-exercise boundary.</p><p>Because American exercise is an extra OPTION the holder has (exercise now, or don't), an American option's value can never fall below its European counterpart's -- the early-exercise premium is, by construction, non-negative. The code prices both an American and a European put in the same tree and confirms the American price sits at or above the European one.</p>""",
                "code": code(
                    """def binomial_price(S0, K, u, d, R, n, kind="call", american=False):
    q = (R - d) / (u - d)
    intrinsic = (lambda s: max(s - K, 0.0)) if kind == "call" else (lambda s: max(K - s, 0.0))
    ST = [S0 * (u ** j) * (d ** (n - j)) for j in range(n + 1)]
    V = [intrinsic(s) for s in ST]
    for step in range(n, 0, -1):
        newV = []
        for j in range(step):
            cont = (q * V[j + 1] + (1 - q) * V[j]) / R
            if american:
                Sij = S0 * (u ** j) * (d ** (step - 1 - j))
                cont = max(cont, intrinsic(Sij))
            newV.append(cont)
        V = newV
    return V[0]

S0, K, u, d, R, n = 100.0, 100.0, 1.08, 0.94, 1.01, 6
euro_put = binomial_price(S0, K, u, d, R, n, "put", american=False)
amer_put = binomial_price(S0, K, u, d, R, n, "put", american=True)
print(f"European put = {euro_put:.6f}")
print(f"American put = {amer_put:.6f}")
print(f"early-exercise premium = {amer_put - euro_put:.6f}  (must be >= 0)")
"""
                ),
            },
            {
                "name": "Never exercise an American call early on a non-dividend stock",
                "explain": """<p>Without dividends, holding a call is always at least as good as exercising it: the call's value is bounded below by <code>S - K*DF</code> (week 1's bound), which STRICTLY exceeds the exercise value <code>S - K</code> whenever <code>r > 0</code>, because <code>K*DF < K</code>. Exercising early throws away both the remaining optionality (protection if the stock falls) and the time value of deferring payment of the strike -- there is no scenario where that trade is worth making.</p><p>The code confirms this by pricing American and European calls in the SAME tree with the same, positive interest rate and no dividends: the two prices come out identical, up to floating-point noise, because the early-exercise comparison never actually changes the recursion's answer at any node.</p>""",
                "code": code(
                    """def binomial_price(S0, K, u, d, R, n, kind="call", american=False):
    q = (R - d) / (u - d)
    intrinsic = (lambda s: max(s - K, 0.0)) if kind == "call" else (lambda s: max(K - s, 0.0))
    ST = [S0 * (u ** j) * (d ** (n - j)) for j in range(n + 1)]
    V = [intrinsic(s) for s in ST]
    for step in range(n, 0, -1):
        newV = []
        for j in range(step):
            cont = (q * V[j + 1] + (1 - q) * V[j]) / R
            if american:
                Sij = S0 * (u ** j) * (d ** (step - 1 - j))
                cont = max(cont, intrinsic(Sij))
            newV.append(cont)
        V = newV
    return V[0]

S0, K, u, d, R, n = 100.0, 100.0, 1.08, 0.94, 1.01, 6
euro_call = binomial_price(S0, K, u, d, R, n, "call", american=False)
amer_call = binomial_price(S0, K, u, d, R, n, "call", american=True)
print(f"European call = {euro_call:.6f}")
print(f"American call = {amer_call:.6f}")
print(f"difference = {amer_call - euro_call:.2e}  (zero up to floating point, no dividends, r>0)")
"""
                ),
            },
            {
                "name": "Dividends change the early-exercise calculus for calls",
                "explain": """<p>A discrete dividend paid during the option's life drops the stock price by (approximately) the dividend amount on the ex-dividend date. Right BEFORE that drop, exercising a call captures the pre-drop intrinsic value; holding through the drop means the option's remaining value reflects the LOWER, post-dividend stock price. That timing gap is exactly what can make early exercise of an American call optimal -- something the no-dividend case above proved could never happen.</p><p>The code below builds a simplified escrowed-dividend tree (a flat drop of <code>D</code> applied at and after a chosen step, for illustration; production systems handle the shift more carefully to preserve exact recombination, but the mechanism is the same) and shows that once the dividend is added, the American call's value rises strictly above the European call's -- an early-exercise premium appears exactly where it was zero before.</p>""",
                "code": code(
                    """def binomial_call_with_dividend(S0, K, u, d, R, n, div_step, D, american=True):
    q = (R - d) / (u - d)

    def raw_S(i, j):
        return S0 * (u ** j) * (d ** (i - j))

    def S_at(i, j):
        s = raw_S(i, j)
        return s - D if i >= div_step else s

    V = [max(S_at(n, j) - K, 0.0) for j in range(n + 1)]
    for step in range(n, 0, -1):
        newV = []
        for j in range(step):
            cont = (q * V[j + 1] + (1 - q) * V[j]) / R
            if american:
                cont = max(cont, S_at(step - 1, j) - K)
            newV.append(cont)
        V = newV
    return V[0]

S0, K, u, d, R, n = 100.0, 100.0, 1.05, 0.96, 1.005, 6
div_step, D = 3, 4.0
no_div_euro = binomial_call_with_dividend(S0, K, u, d, R, n, div_step=n + 1, D=0.0, american=False)
with_div_euro = binomial_call_with_dividend(S0, K, u, d, R, n, div_step, D, american=False)
with_div_amer = binomial_call_with_dividend(S0, K, u, d, R, n, div_step, D, american=True)

print(f"European call, no dividend               = {no_div_euro:.6f}")
print(f"European call, ${D:.2f} dividend at step {div_step}     = {with_div_euro:.6f}")
print(f"American call, same dividend              = {with_div_amer:.6f}")
print(f"early-exercise premium introduced by the dividend = {with_div_amer - with_div_euro:.6f}")
"""
                ),
            },
        ],
        "widget": {
            "type": "binomial-tree",
            "title": "American vs. European exercise, side by side",
            "params": {
                "S0": 100,
                "u": 1.08,
                "d": 0.94,
                "r": 0.01,
                "steps": 6,
                "K": 100,
                "kind": "put",
                "style": "american",
            },
        },
        "pitfalls": [
            "Assuming CRR convergence is monotonic; the binomial price oscillates around the Black-Scholes value as n grows, and only the ENVELOPE of the oscillation shrinks.",
            "Applying the European backward-induction recursion to an American payoff and forgetting the max-with-intrinsic comparison at every node, silently pricing early exercise as worthless.",
            "Exercising an American call early on a non-dividend-paying stock; the strike's time value always exceeds what early exercise captures, so it is never optimal.",
            "Modeling a discrete dividend as a drop applied to the FINAL payoff instead of at the node where it is actually paid; the timing of the drop relative to the exercise decision is the entire point.",
        ],
        "check": [
            {
                "q": "As the number of CRR steps n increases, the binomial price of a European call:",
                "options": [
                    "Increases monotonically to the Black-Scholes price",
                    "Decreases monotonically to the Black-Scholes price",
                    "Oscillates around the Black-Scholes price with a shrinking envelope",
                    "Stays constant regardless of n",
                ],
                "answer": 2,
                "why": "CRR convergence is a discrete-CLT phenomenon and is known to be non-monotonic: the price oscillates above and below the continuous-time limit as n grows, with the amplitude of the oscillation shrinking.",
            },
            {
                "q": "Pricing an American option in a binomial tree requires, at every node:",
                "options": [
                    "Only the discounted risk-neutral expectation of the two children",
                    "The discounted risk-neutral expectation, replaced by intrinsic value whenever intrinsic value is larger",
                    "Simulating many random paths through that node",
                    "Solving a partial differential equation at that node",
                ],
                "answer": 1,
                "why": "American pricing adds exactly one comparison to the European recursion: max(continuation value, intrinsic value). No simulation and no PDE solve are needed in the discrete tree.",
            },
            {
                "q": "On a non-dividend-paying stock, early exercise of an American call:",
                "options": [
                    "Is sometimes optimal when deep in the money",
                    "Is never optimal, so its price equals the European call's",
                    "Is always optimal just before expiry",
                    "Depends only on whether the risk-free rate is negative",
                ],
                "answer": 1,
                "why": "Without dividends, the call's value is always bounded below by S-K*DF, which strictly exceeds the exercise value S-K whenever r>0, so exercising early is never optimal and the American and European prices coincide.",
            },
            {
                "q": "A discrete dividend paid during an American call's life:",
                "options": [
                    "Never affects the exercise decision",
                    "Can make early exercise optimal, typically right before the ex-dividend date",
                    "Makes the American call worth LESS than the European call",
                    "Only matters for puts, not calls",
                ],
                "answer": 1,
                "why": "A dividend drops the stock price on the ex-date; exercising just before captures the pre-drop intrinsic value, which can exceed the continuation value once the drop is priced in -- exactly the incentive dividends create for calls.",
            },
        ],
    },
    {
        "n": 5,
        "title": "Brownian motion and the Ito calculus toolkit",
        "topics": [
            "Brownian motion and quadratic variation",
            "Ito's formula: the chain rule with a correction term",
            "geometric Brownian motion",
            "realized variance as quadratic variation in practice",
        ],
        "concepts": [
            {
                "name": "Brownian motion and quadratic variation",
                "explain": """<p>Brownian motion has continuous paths and independent, normally distributed increments, but its paths are nowhere differentiable. The object that measures this roughness is quadratic variation: the sum of squared increments over a partition of <code>[0,T]</code>. For a SMOOTH deterministic function, that sum vanishes as the partition is refined, which is why ordinary calculus never needs a second-order correction term. For Brownian motion, it converges to <code>T</code> itself -- a strictly positive number, not zero.</p><p>This single fact is the entire reason Ito's formula (next concept) needs an extra term beyond the ordinary chain rule. The code simulates a fine partition of Brownian motion and a smooth deterministic path over the same grid, and computes the sum of squared increments for each: one converges to <code>T</code>, the other to (numerically) zero.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(33000)
T, n = 1.0, 200000
dt = T / n
dW = rng.normal(0.0, np.sqrt(dt), n)
W = np.concatenate([[0.0], np.cumsum(dW)])

quad_var_BM = np.sum(np.diff(W) ** 2)
print(f"Brownian motion: sum of squared increments over [0,{T}], n={n} steps = {quad_var_BM:.6f}  (target T={T})")

t = np.linspace(0, T, n + 1)
f = np.sin(2 * np.pi * t)  # a smooth, deterministic path over the same partition
quad_var_smooth = np.sum(np.diff(f) ** 2)
print(f"a smooth deterministic path, same partition: sum of squared increments = {quad_var_smooth:.8f}")
print("BM's squared increments accumulate to a positive number (T); a smooth path's vanish as n grows")
"""
                ),
            },
            {
                "name": "Ito's formula: the chain rule with a correction term",
                "explain": """<p>For <code>f(W_t) = W_t^2</code>, Ito's formula gives <code>d(W_t^2) = 2*W_t*dW_t + dt</code> -- the ordinary chain rule's <code>2*W_t*dW_t</code> PLUS a correction term <code>dt</code> that has no analogue in ordinary calculus. That correction is a direct consequence of the previous concept: Brownian motion's quadratic variation is <code>t</code>, not zero, and Ito's formula is precisely the chain rule adjusted to account for that.</p><p>The code verifies the identity numerically at the level of a single simulated path: it computes <code>W_T^2</code> directly, and separately accumulates the discretized Ito integral <code>sum(W_t * dW_t)</code>, then checks that <code>2 * (\\text{that sum}) + T</code> reproduces <code>W_T^2</code>.</p>""",
                "formula": r"d(W_t^2) = 2 W_t\, dW_t + dt",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(330002)
T, n = 1.0, 200000
dt = T / n
dW = rng.normal(0.0, np.sqrt(dt), n)
W = np.concatenate([[0.0], np.cumsum(dW)])

lhs = W[-1] ** 2                       # f(W_T) = W_T^2
ito_integral = np.sum(W[:-1] * dW)     # discretized integral of W_t dW_t
rhs = 2 * ito_integral + T             # Ito's formula: W_T^2 = 2*integral(W dW) + T

print(f"W_T^2                               = {lhs:.6f}")
print(f"2 * (discretized Ito integral) + T  = {rhs:.6f}")
print(f"Ito integral alone = {ito_integral:.6f}   vs (W_T^2 - T)/2 = {(lhs - T) / 2:.6f}")
print("the 'extra' +T term is exactly the second-order correction the ordinary chain rule lacks")
"""
                ),
            },
            {
                "name": "Geometric Brownian motion, the SDE Black-Scholes assumes",
                "explain": """<p>Solving <code>dS = mu*S*dt + sigma*S*dW</code> via Ito's formula applied to <code>log(S)</code> gives <code>S_T = S0 * exp((mu - 0.5*sigma^2)*T + sigma*W_T)</code>: a LOGNORMAL terminal distribution, with a <code>-0.5*sigma^2*T</code> drift correction that exists purely to keep <code>E[S_T] = S0*e^{mu T}</code> exact despite the convexity of the exponential function -- Jensen's inequality would otherwise inflate the naive expectation.</p><p>The code simulates GBM via its exact closed-form solution (no discretization needed, since the SDE solves explicitly) and checks that the empirical mean and variance of <code>log(S_T)</code>, and the empirical mean of <code>S_T</code> itself, match the theoretical formulas.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(330003)
S0, mu, sigma, T, n_paths = 100.0, 0.08, 0.30, 1.0, 200000
Z = rng.standard_normal(n_paths)
logS = np.log(S0) + (mu - 0.5 * sigma * sigma) * T + sigma * np.sqrt(T) * Z
ST = np.exp(logS)

theory_mean_log = np.log(S0) + (mu - 0.5 * sigma * sigma) * T
print(f"empirical mean of log(S_T) = {logS.mean():.6f}   theory = {theory_mean_log:.6f}")
print(f"empirical var of log(S_T)  = {logS.var():.6f}   theory sigma^2*T = {sigma * sigma * T:.6f}")
print(f"empirical mean of S_T      = {ST.mean():.4f}   theory S0*e^(mu*T) = {S0 * np.exp(mu * T):.4f}")
"""
                ),
            },
            {
                "name": "Quadratic variation in practice: realized variance",
                "explain": """<p>For a GBM-like log-price, the quadratic variation of <code>log(S)</code> over <code>[0,T]</code> is exactly <code>sigma^2*T</code>. Summing the squares of high-frequency log-returns -- "realized variance" -- is a consistent ESTIMATOR of that quadratic variation, and it converges to the true <code>sigma^2*T</code> as sampling frequency increases, PROVIDED the underlying process really is a clean diffusion with no market-microstructure noise contaminating the highest-frequency observations.</p><p>This connects the abstract object from the first concept of this week to something a trading desk computes every single day from tick data: quadratic variation is not only a theoretical device, it is the mathematical object realized-vol estimators are estimators OF.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(330004)
S0, sigma, T = 100.0, 0.28, 1.0

def realized_variance(n):
    dt = T / n
    dW = rng.normal(0.0, np.sqrt(dt), n)
    logS = np.log(S0) + np.cumsum((-0.5 * sigma * sigma) * dt + sigma * dW)
    log_returns = np.diff(np.concatenate([[np.log(S0)], logS]))
    return np.sum(log_returns ** 2)

for n in (20, 200, 2000, 20000):
    rv = realized_variance(n)
    print(f"n={n:6d} samples: realized variance = {rv:.6f}   target sigma^2*T = {sigma * sigma * T:.6f}")
"""
                ),
            },
        ],
        "widget": {
            "type": "simulate-paths",
            "title": "Geometric Brownian motion: sample paths and the cross-sectional mean",
            "params": {
                "model": "gbm",
                "params": {"s0": 100, "mu": 0.08, "sigma": 0.3},
                "n_paths": 30,
                "seed": 33005,
                "horizon": 1,
            },
        },
        "pitfalls": [
            "Treating quadratic variation like ordinary calculus's 'sum of squared increments equals zero'; for Brownian motion it equals T, not zero, and that single fact generates Ito's correction term.",
            "Applying the ordinary chain rule to a function of Brownian motion and dropping the second-order 0.5*f''(W)*dt correction.",
            "Forgetting the -0.5*sigma^2*T drift correction and writing S_T = S0*e^{mu*T + sigma*W_T} instead of the correct e^{(mu-0.5*sigma^2)*T + sigma*W_T}; the first overstates E[S_T].",
            "Estimating realized variance from very high-frequency data without worrying about microstructure noise; the clean convergence shown here assumes a pure diffusion, and tick data is not one.",
        ],
        "check": [
            {
                "q": "The quadratic variation of Brownian motion over [0,T] is:",
                "options": [
                    "0, the same as for any continuous function",
                    "T",
                    "Infinite",
                    "Equal to the process's mean",
                ],
                "answer": 1,
                "why": "Quadratic variation of Brownian motion converges (almost surely) to T as the partition is refined -- a positive number, not zero, which is exactly what distinguishes it from a smooth deterministic path.",
            },
            {
                "q": "Ito's formula for f(W_t) includes a term ordinary calculus's chain rule does not, because:",
                "options": [
                    "Brownian motion is not continuous",
                    "Brownian motion has nonzero quadratic variation, unlike a smooth path",
                    "f is assumed non-differentiable",
                    "The correction term is purely a notational convention",
                ],
                "answer": 1,
                "why": "The correction term is a direct, derivable consequence of Brownian motion's nonzero quadratic variation; it is not a convention, and Brownian motion IS continuous (just nowhere differentiable).",
            },
            {
                "q": "The -0.5*sigma^2*T term in log(S_T) for a GBM exists so that:",
                "options": [
                    "S_T has zero variance",
                    "E[S_T] equals S0*e^{mu*T} exactly, correcting for the convexity of exp(.)",
                    "The process becomes a martingale under the physical measure",
                    "sigma can be estimated without any data",
                ],
                "answer": 1,
                "why": "Because exp(.) is convex, a naive drift would overstate E[S_T]; the -0.5*sigma^2*T correction is exactly what is needed to make E[S_T]=S0*e^{mu*T} hold precisely, a Jensen's-inequality fix, not a martingale statement about S itself under the physical measure.",
            },
            {
                "q": "Realized variance computed from high-frequency log-returns is:",
                "options": [
                    "Always exactly equal to sigma^2*T for any sample size",
                    "A consistent estimator of quadratic variation, improving as sampling frequency increases (absent microstructure noise)",
                    "Unrelated to quadratic variation",
                    "Only meaningful under the risk-neutral measure",
                ],
                "answer": 1,
                "why": "Realized variance is a sample estimator of the true quadratic variation sigma^2*T, and it converges to that target as the sampling frequency increases, as long as the data is a clean diffusion rather than contaminated by microstructure noise.",
            },
        ],
    },
    {
        "n": 6,
        "title": "The Black-Scholes PDE: replication in continuous time",
        "topics": [
            "delta hedging and continuous-time replication",
            "the Black-Scholes PDE",
            "Feynman-Kac: the PDE solution as an expectation",
            "the discounted price process as a Q-martingale, continuously",
        ],
        "concepts": [
            {
                "name": "Delta-hedging in continuous time: how the replication error vanishes",
                "explain": """<p>The Black-Scholes PDE is derived from a hedging argument: hold <code>Delta = dC/dS</code> shares against a short option position, fund the rest in cash, and rebalance continuously. Applying Ito's formula to the hedged portfolio makes its random (<code>dW</code>) term vanish exactly, because <code>Delta</code> is chosen to cancel it; what remains grows at the risk-free rate, which is the PDE's content.</p><p>In practice, rebalancing happens at discrete intervals, not continuously, and the code below simulates exactly that: sell a call, delta-hedge it by rebalancing <code>m</code> times over the option's life, and measure the resulting hedging P&L's standard deviation across many simulated paths. As <code>m</code> grows, the hedging error's standard deviation shrinks toward zero -- the discrete practice converging to the continuous-time theory the PDE describes.</p>""",
                "code": code(
                    """import numpy as np
import math
np.seterr(all="ignore")

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call_delta(S, K, r, sigma, tau):
    if tau <= 0:
        return 1.0 if S > K else 0.0
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * tau) / (sigma * math.sqrt(tau))
    return norm_cdf(d1)

def bs_call_price(S, K, r, sigma, tau):
    if tau <= 0:
        return max(S - K, 0.0)
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * tau) / (sigma * math.sqrt(tau))
    d2 = d1 - sigma * math.sqrt(tau)
    return S * norm_cdf(d1) - K * math.exp(-r * tau) * norm_cdf(d2)

def hedge_pnl(rebalances, seed):
    rng = np.random.default_rng(seed)
    S0, K, r, sigma, T = 100.0, 100.0, 0.02, 0.25, 0.5
    m, dt = rebalances, 0.5 / rebalances
    S = S0
    cash = bs_call_price(S0, K, r, sigma, T)   # sell the call, receive premium
    shares = bs_call_delta(S0, K, r, sigma, T)
    cash -= shares * S0                        # buy Delta shares
    for k in range(1, m + 1):
        z = rng.standard_normal()
        S = S * math.exp((r - 0.5 * sigma * sigma) * dt + sigma * math.sqrt(dt) * z)
        cash *= math.exp(r * dt)
        tau = T - k * dt
        new_shares = bs_call_delta(S, K, r, sigma, tau) if tau > 1e-9 else (1.0 if S > K else 0.0)
        cash -= (new_shares - shares) * S
        shares = new_shares
    payoff = max(S - K, 0.0)
    return cash + shares * S - payoff

for m in (5, 20, 80, 320):
    pnls = np.array([hedge_pnl(m, seed=s) for s in range(200)])
    print(f"rebalances={m:4d}: mean hedging P&L={pnls.mean():8.4f}   std={pnls.std():8.4f}")
"""
                ),
            },
            {
                "name": "The Black-Scholes PDE, verified against the closed form",
                "explain": """<p>The PDE the hedging argument produces is <code>dC/dt + r*S*dC/dS + 0.5*sigma^2*S^2*d^2C/dS^2 = r*C</code>, with the boundary condition <code>C(S,T) = max(S-K,0)</code>. This week keeps the PDE itself as the object of study rather than building a numerical solver for it -- that is the express subject of a whole later course (Numerical Methods) -- and instead verifies that the KNOWN closed-form Black-Scholes price actually satisfies the PDE, by estimating its partial derivatives with simple finite differences and checking the identity holds.</p><p>The code computes <code>Delta</code>, <code>Gamma</code> and <code>Theta</code> for the closed-form price via small bumps in <code>S</code> and <code>tau</code>, then checks that <code>theta + r*S*delta + 0.5*sigma^2*S^2*gamma</code> matches <code>r*C</code> to the finite-difference approximation's own precision.</p>""",
                "formula": r"\frac{\partial C}{\partial t} + rS\frac{\partial C}{\partial S} + \tfrac12\sigma^2 S^2 \frac{\partial^2 C}{\partial S^2} = rC",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call(S, K, r, sigma, tau):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * tau) / (sigma * math.sqrt(tau))
    d2 = d1 - sigma * math.sqrt(tau)
    return S * norm_cdf(d1) - K * math.exp(-r * tau) * norm_cdf(d2)

S, K, r, sigma, tau = 100.0, 95.0, 0.03, 0.22, 0.75
h_S, h_t = 0.01, 1e-5

C = bs_call(S, K, r, sigma, tau)
dC_dS = (bs_call(S + h_S, K, r, sigma, tau) - bs_call(S - h_S, K, r, sigma, tau)) / (2 * h_S)
d2C_dS2 = (bs_call(S + h_S, K, r, sigma, tau) - 2 * C + bs_call(S - h_S, K, r, sigma, tau)) / (h_S ** 2)
dC_dtau = (bs_call(S, K, r, sigma, tau + h_t) - bs_call(S, K, r, sigma, tau - h_t)) / (2 * h_t)
# tau = T - t counts DOWN as calendar time goes up, so dC/dt = -dC/dtau

pde_lhs = -dC_dtau + r * S * dC_dS + 0.5 * sigma * sigma * S * S * d2C_dS2
pde_rhs = r * C
print(f"Delta={dC_dS:.6f}  Gamma={d2C_dS2:.6f}  Theta(dC/dt)={-dC_dtau:.6f}")
print(f"PDE left side  (theta + rS*delta + 0.5*sigma^2*S^2*gamma) = {pde_lhs:.6f}")
print(f"PDE right side (r*C)                                      = {pde_rhs:.6f}")
print(f"residual = {pde_lhs - pde_rhs:.8f}  (zero, up to finite-difference error)")
"""
                ),
            },
            {
                "name": "Feynman-Kac: the PDE solution as a risk-neutral expectation",
                "explain": """<p>The Feynman-Kac theorem is the exact statement that the PDE's solution and the discounted risk-neutral expectation <code>C0 = e^{-rT} E^Q[max(S_T-K,0)]</code> are the SAME object: one differential, one probabilistic, describing one number. This is not two competing methods that happen to agree; it is one theorem with two equivalent descriptions.</p><p>The code estimates the option price by Monte Carlo simulation under <code>Q</code> (GBM with drift exactly <code>r</code>) and checks the result against the closed-form Black-Scholes price, within Monte Carlo standard error.</p>""",
                "code": code(
                    """import numpy as np
import math
np.seterr(all="ignore")

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

S0, K, r, sigma, T = 100.0, 100.0, 0.03, 0.22, 1.0
rng = np.random.default_rng(6)
n = 2_000_000
Z = rng.standard_normal(n)
ST = S0 * np.exp((r - 0.5 * sigma * sigma) * T + sigma * math.sqrt(T) * Z)
payoff = np.maximum(ST - K, 0.0)
mc_price = math.exp(-r * T) * payoff.mean()
se = math.exp(-r * T) * payoff.std(ddof=1) / math.sqrt(n)
closed_form = bs_call(S0, K, r, sigma, T)

print(f"Monte Carlo (Q-measure GBM, drift=r) = {mc_price:.6f} +/- {se:.6f}")
print(f"closed-form Black-Scholes            = {closed_form:.6f}")
print("the PDE solution and the risk-neutral expectation are the SAME object -- Feynman-Kac's content")
"""
                ),
            },
            {
                "name": "The discounted price process is a Q-martingale, continuously",
                "explain": """<p>Under <code>Q</code>, the stock's drift is replaced by <code>r</code>: <code>dS = r*S*dt + sigma*S*dW^Q</code>. That makes the discounted price <code>e^{-rt}*S_t</code> driftless -- a <code>Q</code>-martingale -- which is the exact continuous-time analogue of week 3's node-by-node discrete martingale check. The risk-neutral MEASURE is, by definition, the one under which every traded discounted price loses its drift.</p><p>The code simulates <code>S_t</code> at several horizons under this <code>Q</code>-dynamics and checks that <code>E[e^{-rt}*S_t}]</code> stays pinned at <code>S0</code> for every <code>t</code>, not just at maturity.</p>""",
                "code": code(
                    """import numpy as np
import math
np.seterr(all="ignore")

rng = np.random.default_rng(606)
S0, r, sigma = 100.0, 0.04, 0.30
n_paths = 500000

for t in (0.25, 0.5, 1.0, 2.0):
    Z = rng.standard_normal(n_paths)
    St = S0 * np.exp((r - 0.5 * sigma * sigma) * t + sigma * math.sqrt(t) * Z)
    disc = math.exp(-r * t) * St
    print(f"t={t:4.2f}: E[e^(-rt) S_t] = {disc.mean():8.4f}   (S0 = {S0})")
"""
                ),
            },
        ],
        "widget": {
            "type": "curve",
            "title": "Discrete delta-hedging error shrinks as rebalancing frequency grows",
            "params": {
                "xlab": "Rebalances over the option's life",
                "ylab": "Hedging P&L, standard deviation",
                "series": [
                    {"name": "P&L std", "x": [5, 20, 80, 320], "y": [2.45, 1.37, 0.71, 0.35]}
                ],
                "log": True,
            },
        },
        "pitfalls": [
            "Thinking Delta-hedging works with a single trade at t=0; it requires continuous (or frequent) REBALANCING, and the replication error only vanishes in the continuous-rehedging limit.",
            "Confusing tau=T-t (time to maturity) with calendar time t when computing Theta; dC/dt = -dC/dtau, and the sign flips if this is missed.",
            "Treating the Black-Scholes PDE and the risk-neutral expectation formula as two different models that happen to agree; Feynman-Kac says they are the SAME object, one differential and one probabilistic.",
            "Forgetting that Q, not P, is the measure that makes the discounted price driftless; simulating under the physical drift mu and expecting the same martingale property is a category error.",
        ],
        "check": [
            {
                "q": "As the delta-hedge rebalancing frequency increases, the hedging P&L's standard deviation:",
                "options": [
                    "Increases without bound",
                    "Stays constant",
                    "Shrinks toward zero",
                    "Becomes negative",
                ],
                "answer": 2,
                "why": "More frequent rebalancing tracks the continuously-rebalanced replicating portfolio more closely, so the discrepancy between the discrete hedge and the theoretical continuous hedge -- and hence its standard deviation -- shrinks toward zero.",
            },
            {
                "q": "The Black-Scholes PDE is derived by:",
                "options": [
                    "Assuming the option price is deterministic",
                    "Setting the drift of a Delta-hedged, self-financing portfolio equal to the risk-free rate, after Ito's formula eliminates the random term",
                    "Averaging many Monte Carlo simulations",
                    "Fitting a linear regression to option prices",
                ],
                "answer": 1,
                "why": "Choosing Delta to cancel the dW term in the hedged portfolio's Ito expansion leaves a purely deterministic drift, which no-arbitrage forces to equal the risk-free rate on the hedged (riskless) position -- that equation IS the PDE.",
            },
            {
                "q": "The Feynman-Kac theorem connects:",
                "options": [
                    "Two unrelated pricing methods that happen to agree numerically",
                    "A parabolic PDE's solution to a risk-neutral expectation over the same diffusion",
                    "The physical measure to historical volatility",
                    "American and European option prices",
                ],
                "answer": 1,
                "why": "Feynman-Kac is an exact mathematical identity between a class of PDEs and expectations of a corresponding diffusion; it is one theorem describing one object two ways, not an empirical coincidence.",
            },
            {
                "q": "Under the risk-neutral measure Q, the discounted stock price e^{-rt}*S_t is:",
                "options": [
                    "A supermartingale, always decreasing in expectation",
                    "A Q-martingale, by the very construction of Q",
                    "A martingale only if sigma=0",
                    "A martingale only under the physical measure P",
                ],
                "answer": 1,
                "why": "Q is defined precisely so that every traded discounted price is driftless under it; this is the continuous-time restatement of the discrete tree's node-by-node martingale property, and it holds for any sigma > 0.",
            },
        ],
    },
    {
        "n": 7,
        "title": "The Black-Scholes formula and the Greeks",
        "topics": [
            "the Black-Scholes formula",
            "the Greeks and the PDE identity",
            "implied volatility and Newton's method",
            "dividends via a continuous yield",
        ],
        "concepts": [
            {
                "name": "The Black-Scholes formula",
                "explain": """<p>Solving the PDE from last week with the terminal condition <code>max(S_T-K,0)</code> gives the closed-form Black-Scholes call formula <code>C = S*N(d1) - K*e^{-rT}*N(d2)</code>, with <code>d1</code> and <code>d2</code> the now-familiar combinations of moneyness, volatility and time. The put formula follows either by the same derivation with the opposite terminal condition, or directly from put-call parity applied to the call.</p><p>The code implements both formulas and checks that C-P exactly reproduces the parity relation from week 1, tying the whole course's arc -- static arbitrage bounds, discrete replication, continuous PDEs -- back to a single, checkable number.</p>""",
                "formula": r"C = S\,N(d_1) - K e^{-rT} N(d_2), \qquad d_{1,2} = \frac{\ln(S/K) + \left(r \pm \tfrac12\sigma^2\right)T}{\sigma\sqrt{T}}",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_price(S, K, r, sigma, T, kind="call"):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    if kind == "call":
        return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)
    return K * math.exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1)

S, K, r, sigma, T = 100.0, 105.0, 0.03, 0.20, 0.5
c = bs_price(S, K, r, sigma, T, "call")
p = bs_price(S, K, r, sigma, T, "put")
print(f"call = {c:.6f}   put = {p:.6f}")
print(f"C-P = {c - p:.6f}   S-K*e^(-rT) = {S - K * math.exp(-r * T):.6f}")
"""
                ),
            },
            {
                "name": "The Greeks, and the PDE identity they must satisfy",
                "explain": """<p>Delta, Gamma, Vega, Theta and Rho are the closed-form partial derivatives of the Black-Scholes formula with respect to <code>S</code>, <code>S</code> twice, <code>sigma</code>, <code>t</code> and <code>r</code>. They are not independent quantities to be memorized in isolation: because the price satisfies the Black-Scholes PDE exactly, the Greeks are LINKED by <code>Theta + 0.5*sigma^2*S^2*Gamma + r*S*Delta = r*C</code> at every instant, for every option, by construction.</p><p>The code computes all five Greeks from their closed forms and checks this PDE identity numerically, which doubles as the cleanest sanity check available on any from-scratch Greeks implementation: if the identity fails, the bug is in the Greeks formulas, not in the market.</p>""",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def norm_pdf(x):
    return math.exp(-0.5 * x * x) / math.sqrt(2 * math.pi)

def bs_greeks(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    delta = norm_cdf(d1)
    gamma = norm_pdf(d1) / (S * sigma * math.sqrt(T))
    vega = S * norm_pdf(d1) * math.sqrt(T)
    theta = -S * norm_pdf(d1) * sigma / (2 * math.sqrt(T)) - r * K * math.exp(-r * T) * norm_cdf(d2)
    rho = K * T * math.exp(-r * T) * norm_cdf(d2)
    C = S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)
    return C, delta, gamma, vega, theta, rho

S, K, r, sigma, T = 100.0, 100.0, 0.03, 0.25, 1.0
C, delta, gamma, vega, theta, rho = bs_greeks(S, K, r, sigma, T)
print(f"price={C:.6f} delta={delta:.6f} gamma={gamma:.6f} vega={vega:.6f} theta={theta:.6f} rho={rho:.6f}")

pde_check = theta + 0.5 * sigma * sigma * S * S * gamma + r * S * delta - r * C
print(f"theta + 0.5*sigma^2*S^2*gamma + r*S*delta - r*C = {pde_check:.10f}  (must be ~0)")
"""
                ),
            },
            {
                "name": "Implied volatility and Newton's method",
                "explain": """<p>Implied volatility is the single value of <code>sigma</code> that reprices a GIVEN market quote exactly in the Black-Scholes formula. Because the formula is monotonic and smooth in <code>sigma</code>, Newton-Raphson -- using Vega as the derivative of price with respect to volatility -- converges to it in only a handful of iterations from almost any reasonable starting guess.</p><p>Implied volatility is the market's own internal quoting convention for a price, not a forecast of future realized volatility, even though the two are related in practice. The code manufactures a market price at a known "true" volatility and recovers that volatility purely from the price via Newton-Raphson, to show the mechanism working end to end.</p>""",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def norm_pdf(x):
    return math.exp(-0.5 * x * x) / math.sqrt(2 * math.pi)

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

def vega(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    return S * norm_pdf(d1) * math.sqrt(T)

def implied_vol(price, S, K, r, T, guess=0.3, tol=1e-8, maxit=100):
    sigma = guess
    for i in range(maxit):
        diff = bs_call(S, K, r, sigma, T) - price
        if abs(diff) < tol:
            return sigma, i
        sigma -= diff / vega(S, K, r, sigma, T)
    return sigma, maxit

S, K, r, T = 100.0, 100.0, 0.03, 0.5
true_sigma = 0.27
market_price = bs_call(S, K, r, true_sigma, T)
recovered, iters = implied_vol(market_price, S, K, r, T)
print(f"market price at true sigma={true_sigma:.4f} is {market_price:.6f}")
print(f"Newton-Raphson recovers sigma = {recovered:.8f} in {iters} iterations")
"""
                ),
            },
            {
                "name": "Dividends via a continuous yield",
                "explain": """<p>With a continuous dividend yield <code>q</code>, holding the stock earns <code>q</code> in dividends but the risk-neutral drift must still net to <code>r</code>, so <code>S</code> is replaced by <code>S*e^{-qT}</code> inside <code>N(d1)</code> AND the <code>r</code> inside <code>d1</code>/<code>d2</code> is replaced by <code>r-q</code>: both changes are needed together, not just one. The resulting formula is exactly the Garman-Kohlhagen / dividend-adjusted Black-Scholes used throughout the rest of this course whenever an asset "leaks" value continuously to someone other than the option holder.</p><p>The code implements the dividend-adjusted formula and checks that put-call parity still holds, now with <code>S*e^{-qT}</code> in place of <code>S</code>.</p>""",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_price_q(S, K, r, q, sigma, T, kind="call"):
    d1 = (math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    if kind == "call":
        return S * math.exp(-q * T) * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)
    return K * math.exp(-r * T) * norm_cdf(-d2) - S * math.exp(-q * T) * norm_cdf(-d1)

S, K, r, q, sigma, T = 100.0, 100.0, 0.04, 0.02, 0.22, 1.0
c = bs_price_q(S, K, r, q, sigma, T, "call")
p = bs_price_q(S, K, r, q, sigma, T, "put")
print(f"call={c:.6f}  put={p:.6f}")
print(f"C-P = {c - p:.6f}")
print(f"S*e^(-qT) - K*e^(-rT) = {S * math.exp(-q * T) - K * math.exp(-r * T):.6f}  (parity with a dividend yield)")
"""
                ),
            },
        ],
        "widget": {
            "type": "slider-formula",
            "title": "Black-Scholes, one slider at a time",
            "params": {
                "formula": "C = S N(d_1) - K e^{-rT} N(d_2)",
                "inputs": [
                    {"name": "S", "label": "Spot", "min": 50, "max": 150, "step": 1, "init": 100},
                    {"name": "K", "label": "Strike", "min": 50, "max": 150, "step": 1, "init": 100},
                    {"name": "sigma", "label": "Volatility", "min": 0.05, "max": 0.8, "step": 0.01, "init": 0.25},
                    {"name": "T", "label": "Years", "min": 0.05, "max": 3, "step": 0.05, "init": 1},
                    {"name": "r", "label": "Rate", "min": -0.02, "max": 0.10, "step": 0.005, "init": 0.03},
                ],
                "compute": [
                    {"name": "d1", "label": "d1", "expr": "(ln(S/K) + (r+sigma^2/2)*T) / (sigma*sqrt(T))", "fmt": "4"},
                    {"name": "d2", "label": "d2", "expr": "d1 - sigma*sqrt(T)", "fmt": "4"},
                    {"name": "price", "label": "Call price", "expr": "S*ncdf(d1) - K*exp(-r*T)*ncdf(d2)", "fmt": "4"},
                ],
            },
        },
        "pitfalls": [
            "Quoting Delta, Theta, etc. without specifying whether time is measured as T (maturity date) or tau (time-to-maturity); Theta's sign flips between the two conventions.",
            "Using a poor initial guess for Newton-Raphson, or ignoring near-zero-Vega regions (deep ITM/OTM, near expiry), where implied-vol iteration can fail to converge or diverge.",
            "Forgetting the dividend yield q in BOTH places it belongs: inside d1/d2's drift term AND in front of S as e^{-qT}. Only one of the two changes is not enough.",
            "Treating implied volatility as a forecast of future realized volatility rather than the market's own internal quoting convention for a price.",
        ],
        "check": [
            {
                "q": "The identity theta + 0.5*sigma^2*S^2*gamma + r*S*delta = r*C:",
                "options": [
                    "Is an empirical regularity that sometimes fails",
                    "Holds by construction for the closed-form price, because it solves exactly this PDE",
                    "Only holds approximately, never exactly",
                    "Requires American-style exercise",
                ],
                "answer": 1,
                "why": "The Black-Scholes closed-form price is the exact solution of the Black-Scholes PDE, so this identity among its own Greeks holds exactly, by construction, for any valid set of inputs -- it is not empirical and does not require American exercise.",
            },
            {
                "q": "Newton-Raphson for implied volatility uses:",
                "options": [
                    "The option's Rho as the update step",
                    "The option's Vega, the derivative of price with respect to volatility",
                    "A random search over sigma",
                    "The risk-free rate as the step size",
                ],
                "answer": 1,
                "why": "Newton-Raphson updates sigma by dividing the pricing error by the LOCAL derivative of price with respect to sigma, which is exactly Vega; Rho and the risk-free rate play no role in this particular root-find.",
            },
            {
                "q": "With a continuous dividend yield q, the Black-Scholes call formula:",
                "options": [
                    "Leaves S unchanged everywhere in the formula",
                    "Replaces S with S*e^{-qT} in front of N(d1) AND replaces r with r-q inside d1/d2",
                    "Only changes r to r-q, leaving S as is",
                    "Only multiplies the final price by e^{-qT}, leaving d1/d2 unchanged",
                ],
                "answer": 1,
                "why": "Both changes are required together: the drift term inside d1/d2 becomes r-q, and S in front of N(d1) becomes S*e^{-qT}; making only one of the two changes gives a formula that no longer satisfies put-call parity with dividends.",
            },
            {
                "q": "Implied volatility is best understood as:",
                "options": [
                    "A forecast of future realized volatility",
                    "The single sigma value that reprices a given market quote in the Black-Scholes formula",
                    "Always equal to historical volatility",
                    "A proxy for the risk-free rate",
                ],
                "answer": 1,
                "why": "Implied volatility is defined purely as the input that makes the Black-Scholes formula match an observed price; it is a quoting convention, not a statistical forecast, even though traders often use it as one input among several to a forecast.",
            },
        ],
    },
    {
        "n": 8,
        "title": "Change of numeraire and the forward measure",
        "topics": [
            "change of numeraire mechanics",
            "the forward measure and Black-76 revisited",
            "Garman-Kohlhagen for FX options",
            "discrete dividends and the numeraire's limits",
        ],
        "concepts": [
            {
                "name": "Change of numeraire mechanics",
                "explain": """<p>A "numeraire" is any strictly positive traded asset used as the unit prices are measured in. Dividing every price by the SAME numeraire does not change which portfolio is cheapest -- prices in different units are still comparable, just rescaled -- so a change of numeraire is exactly matched by a corresponding change of PROBABILITY MEASURE, with a Radon-Nikodym derivative equal to the ratio of the new numeraire's growth to the old one's, that makes pricing come out identically either way.</p><p>The code reuses the two-state economy from week 2 and prices a call TWO ways: once under the bond numeraire with the usual risk-neutral <code>Q</code>, and once under the STOCK as numeraire with a correspondingly reweighted measure <code>Q^S</code>. Both routes produce the identical price, converted back to common units -- the central fact that makes numeraire choice a computational convenience rather than a modeling decision.</p>""",
                "code": code(
                    """S0, Su, Sd, R, K = 100.0, 130.0, 90.0, 1.03, 100.0
Cu, Cd = max(Su - K, 0.0), max(Sd - K, 0.0)

# risk-neutral measure Q under the BOND numeraire
u, d = Su / S0, Sd / S0
q = (R - d) / (u - d)
price_bond_numeraire = (q * Cu + (1 - q) * Cd) / R
print(f"Q (bond numeraire): q_up={q:.6f}")
print(f"price via bond numeraire, E^Q[payoff]/R = {price_bond_numeraire:.6f}")

# change numeraire to the STOCK: dQ^S/dQ = (S_T/S0)/R
qS_up = q * (Su / S0) / R
qS_down = (1 - q) * (Sd / S0) / R
print(f"Q^S (stock numeraire): qS_up={qS_up:.6f}  qS_down={qS_down:.6f}  sum={qS_up + qS_down:.6f}")

price_in_stock_units = qS_up * (Cu / Su) + qS_down * (Cd / Sd)
price_stock_numeraire = price_in_stock_units * S0
print(f"price via stock numeraire, S0 * E^Q^S[payoff/S_T] = {price_stock_numeraire:.6f}")
print("both numeraires price the SAME claim identically: a change of numeraire changes the")
print("measure and the units, never the price of a fixed payoff")
"""
                ),
            },
            {
                "name": "The forward measure: Black-76 revisited",
                "explain": """<p>Choosing the zero-coupon bond maturing at the option's expiry as numeraire defines the <code>T</code>-forward measure, under which the forward price <code>F_t = S_t / P(t,T)</code> is a martingale by construction. Pricing under this measure removes the drift term from the pricing formula entirely, replacing "spot plus a risk-neutral drift" with "forward, driftless" -- the same style of simplification used throughout fixed-income derivatives (Black-76), now derived from first principles as a change of numeraire rather than presented as a separate model.</p><p>The code prices the same call two ways -- the ordinary spot-measure Black-Scholes formula, and a forward-measure route using <code>F0=S0*e^{rT}</code> and a single discount factor applied at the end -- and confirms they produce the identical number, because they are algebraically the same formula written in different variables.</p>""",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call_spot(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

def call_forward_measure(S, K, r, sigma, T):
    F0 = S * math.exp(r * T)
    DF = math.exp(-r * T)
    d1 = (math.log(F0 / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return DF * (F0 * norm_cdf(d1) - K * norm_cdf(d2))

S, K, r, sigma, T = 100.0, 95.0, 0.03, 0.24, 0.75
print(f"spot-measure Black-Scholes price       = {bs_call_spot(S, K, r, sigma, T):.8f}")
print(f"forward-measure (Black-76 style) price = {call_forward_measure(S, K, r, sigma, T):.8f}")
print("choosing the zero-coupon bond as numeraire removes the drift term; it does not change the answer")
"""
                ),
            },
            {
                "name": "Garman-Kohlhagen: FX options as a dividend-yield problem",
                "explain": """<p>An FX rate is the price of one currency in units of another. Holding the FOREIGN currency earns the foreign risk-free rate <code>r_f</code>, which plays exactly the role a continuous dividend yield played two concepts ago: the domestic rate <code>r_d</code> discounts, and <code>r_f</code> reduces the effective drift, giving the Garman-Kohlhagen formula -- Black-Scholes with <code>q</code> relabeled <code>r_f</code>.</p><p>The code implements Garman-Kohlhagen directly and rederives the identical price via the forward-measure route, using the covered-interest-parity forward <code>F0 = S0*e^{(r_d-r_f)T}</code>, tying FX options back to the SAME numeraire-change machinery just used for equities.</p>""",
                "formula": r"C = S e^{-r_f T} N(d_1) - K e^{-r_d T} N(d_2)",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def garman_kohlhagen_call(S, K, r_d, r_f, sigma, T):
    d1 = (math.log(S / K) + (r_d - r_f + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * math.exp(-r_f * T) * norm_cdf(d1) - K * math.exp(-r_d * T) * norm_cdf(d2)

S, K, r_d, r_f, sigma, T = 1.10, 1.08, 0.045, 0.02, 0.11, 0.5   # e.g. a EUR/USD-style pair
c_gk = garman_kohlhagen_call(S, K, r_d, r_f, sigma, T)

F0 = S * math.exp((r_d - r_f) * T)
d1f = (math.log(F0 / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))
d2f = d1f - sigma * math.sqrt(T)
c_forward = math.exp(-r_d * T) * (F0 * norm_cdf(d1f) - K * norm_cdf(d2f))

print(f"Garman-Kohlhagen (spot form)           = {c_gk:.8f}")
print(f"forward-measure form, via F0={F0:.6f}  = {c_forward:.8f}")
print("the foreign rate plays exactly the role of a continuous dividend yield in Black-Scholes")
"""
                ),
            },
            {
                "name": "Discrete dividends: where the numeraire trick needs a fix",
                "explain": """<p>A change of numeraire requires the asset used as numeraire to be a genuinely TRADED, self-financing instrument with no cash leaking out of it. A stock that pays a discrete cash dividend fails this exactly on the ex-dividend date: its value drops by an amount not explained by its own diffusion. The standard fix is to price off the "prepaid forward" <code>S0 - PV(\\text{dividends})</code>, which behaves like a clean asset with no leakage, and apply the ordinary formula to THAT adjusted spot instead of the raw one.</p><p>The code compares the naive Black-Scholes price (raw <code>S0</code>, ignoring the dividend) against the corrected price (<code>S0 - PV(\\text{div})</code>) and shows the naive version systematically overstates a call, because it double-counts cash that is scheduled to leave the stock before expiry.</p>""",
                "code": code(
                    """import math

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

S0, K, r, sigma, T = 100.0, 95.0, 0.035, 0.24, 1.0
div_amount, div_time = 3.0, 0.4

pv_div = div_amount * math.exp(-r * div_time)
S_adjusted = S0 - pv_div

naive_price = bs_call(S0, K, r, sigma, T)
correct_price = bs_call(S_adjusted, K, r, sigma, T)
print(f"PV of the dividend               = {pv_div:.6f}")
print(f"naive call (ignores the dividend) = {naive_price:.6f}")
print(f"correct call (S0 - PV(div) used)  = {correct_price:.6f}")
print(f"naive overstates the option by {naive_price - correct_price:.6f}, exactly because it treats")
print("a cash-leaking asset as if it were a clean numeraire candidate")
"""
                ),
            },
        ],
        "widget": {
            "type": "slider-formula",
            "title": "Garman-Kohlhagen: FX options, one slider at a time",
            "params": {
                "formula": "C = S e^{-r_f T} N(d_1) - K e^{-r_d T} N(d_2)",
                "inputs": [
                    {"name": "S", "label": "Spot FX rate", "min": 0.8, "max": 1.4, "step": 0.005, "init": 1.10},
                    {"name": "K", "label": "Strike", "min": 0.8, "max": 1.4, "step": 0.005, "init": 1.08},
                    {"name": "sigma", "label": "Volatility", "min": 0.03, "max": 0.5, "step": 0.005, "init": 0.11},
                    {"name": "T", "label": "Years", "min": 0.05, "max": 2, "step": 0.05, "init": 0.5},
                    {"name": "r_d", "label": "Domestic rate", "min": -0.02, "max": 0.08, "step": 0.0025, "init": 0.045},
                    {"name": "r_f", "label": "Foreign rate", "min": -0.02, "max": 0.08, "step": 0.0025, "init": 0.02},
                ],
                "compute": [
                    {"name": "d1", "label": "d1", "expr": "(ln(S/K) + (r_d-r_f+sigma^2/2)*T) / (sigma*sqrt(T))", "fmt": "4"},
                    {"name": "d2", "label": "d2", "expr": "d1 - sigma*sqrt(T)", "fmt": "4"},
                    {"name": "price", "label": "Call price", "expr": "S*exp(-r_f*T)*ncdf(d1) - K*exp(-r_d*T)*ncdf(d2)", "fmt": "5"},
                ],
            },
        },
        "pitfalls": [
            "Believing a change of numeraire changes the price of a claim; it only changes the MEASURE and the units the payoff is expressed in. Converted back to a common numeraire, the price is identical.",
            "Applying r_d - r_f in the wrong direction in Garman-Kohlhagen, silently swapping which currency 'is the stock' and which 'pays the dividend'.",
            "Discounting a discrete dividend at the wrong rate, or forgetting to subtract its present value from the spot before pricing.",
            "Treating the raw stock price as always a valid numeraire candidate; across an ex-dividend date it leaks cash and needs a prepaid-forward adjustment first.",
        ],
        "check": [
            {
                "q": "A change of numeraire changes:",
                "options": [
                    "The price of a fixed claim",
                    "The pricing measure and the units a payoff is expressed in, never the price itself",
                    "Only prices for American options",
                    "Nothing at all",
                ],
                "answer": 1,
                "why": "A claim's price, converted back to a common numeraire, is identical regardless of which valid numeraire was used to compute it; only the intermediate measure and units change.",
            },
            {
                "q": "In Garman-Kohlhagen, the foreign risk-free rate r_f plays the same role as:",
                "options": [
                    "The strike price",
                    "A continuous dividend yield on the 'stock' (the foreign currency)",
                    "The domestic discount rate",
                    "Volatility",
                ],
                "answer": 1,
                "why": "Holding the foreign currency earns r_f the way holding a dividend-paying stock earns q; both reduce the effective drift the same way, which is exactly the substitution Garman-Kohlhagen makes.",
            },
            {
                "q": "Pricing options on a discrete-dividend-paying stock with plain Black-Scholes and the RAW spot price:",
                "options": [
                    "Is exact",
                    "Overstates the call price, because the raw spot double-counts cash that will leak out as a dividend",
                    "Understates the call price",
                    "Only matters for puts, not calls",
                ],
                "answer": 1,
                "why": "The raw spot includes value that is scheduled to leave the stock via the dividend; using it directly inflates the effective forward and hence overstates the call, which the prepaid-forward correction S0-PV(div) fixes.",
            },
            {
                "q": "The forward-measure derivation of a call price (discounting a driftless forward) and the spot-measure Black-Scholes formula:",
                "options": [
                    "Are two competing models that occasionally disagree",
                    "Give the identical price; the choice of numeraire is a computational convenience, not a modeling choice",
                    "Only agree at T=0",
                    "Require different volatilities",
                ],
                "answer": 1,
                "why": "Both routes are algebraically the same closed-form formula written in different variables; they agree exactly, for any T and any single consistent volatility, because a numeraire change never alters the price of a fixed claim.",
            },
        ],
    },
    {
        "n": 9,
        "title": "Multidimensional models",
        "topics": [
            "correlated GBMs and multidimensional Ito",
            "Margrabe's exchange-option formula",
            "basket options and the lognormal-sum problem",
            "the quanto correlation adjustment",
        ],
        "concepts": [
            {
                "name": "Correlated GBMs and the multidimensional Ito cross term",
                "explain": """<p>Two assets each following a GBM, driven by correlated Brownian motions with correlation <code>rho</code>, are simulated by drawing independent standard normals and mixing them through a Cholesky decomposition of the correlation matrix. The multidimensional version of Ito's formula applied to a function of BOTH assets picks up not only each asset's own second-derivative term, but a CROSS term <code>rho*sigma1*sigma2*S1*S2*dt</code> that has no one-dimensional analogue -- and that cross term is exactly what drives every multi-asset formula in the rest of this week.</p><p>The code simulates correlated terminal log-returns via Cholesky and confirms the empirical correlation of both the driving normals and the resulting log-returns matches the target <code>rho</code>.</p>""",
                "code": code(
                    """import numpy as np
np.seterr(all="ignore")

rng = np.random.default_rng(9001)
sigma1, sigma2, rho, T = 0.25, 0.30, 0.6, 1.0
L = np.linalg.cholesky(np.array([[1.0, rho], [rho, 1.0]]))

n_paths = 200000
Z = rng.standard_normal((n_paths, 2))
corrZ = Z @ L.T
r1 = (-0.5 * sigma1 * sigma1) * T + sigma1 * np.sqrt(T) * corrZ[:, 0]
r2 = (-0.5 * sigma2 * sigma2) * T + sigma2 * np.sqrt(T) * corrZ[:, 1]

print(f"target correlation rho = {rho}")
print(f"empirical correlation of the driving normals         = {np.corrcoef(corrZ[:, 0], corrZ[:, 1])[0, 1]:.4f}")
print(f"empirical correlation of the two assets' log-returns = {np.corrcoef(r1, r2)[0, 1]:.4f}")
print("both match rho: the cross term rho*sigma1*sigma2*S1*S2 in the multidimensional Ito formula")
print("comes directly from the correlation between the two driving Brownian motions")
"""
                ),
            },
            {
                "name": "Margrabe's formula: pricing an exchange option",
                "explain": """<p>An exchange option, paying <code>max(S1_T - S2_T, 0)</code>, prices in closed form via Margrabe's formula: Black-Scholes with <code>S1</code> playing "spot", <code>S2</code> playing "strike" (using <code>S2</code> as NUMERAIRE, directly building on week 8), and volatility replaced by the RELATIVE volatility <code>sigma = sqrt(sigma1^2+sigma2^2-2*rho*sigma1*sigma2)</code>. Strikingly, no interest rate appears anywhere in the formula: because both legs are traded assets growing at the same rate under <code>Q</code>, the rate cancels exactly between the drift and the discounting.</p><p>The code implements the closed form and checks it by Monte Carlo at THREE different interest rates, confirming the price is identical across all three -- the r-independence is not a coincidence of one parameter choice, it is the theorem.</p>""",
                "formula": r"V = S_1 N(d_1) - S_2 N(d_2), \qquad \sigma = \sqrt{\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2}",
                "code": code(
                    """import numpy as np
import math
np.seterr(all="ignore")

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def margrabe(S1, S2, sigma1, sigma2, rho, T):
    sigma = math.sqrt(sigma1 ** 2 + sigma2 ** 2 - 2 * rho * sigma1 * sigma2)
    d1 = (math.log(S1 / S2) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S1 * norm_cdf(d1) - S2 * norm_cdf(d2)

S1, S2, sigma1, sigma2, rho, T = 105.0, 100.0, 0.25, 0.30, 0.4, 1.0
closed_form = margrabe(S1, S2, sigma1, sigma2, rho, T)
print(f"Margrabe closed form (note: no r appears) = {closed_form:.6f}")

rng = np.random.default_rng(9002)
n = 2_000_000
L = np.linalg.cholesky(np.array([[1.0, rho], [rho, 1.0]]))
for r in (0.0, 0.03, 0.10):
    Z = rng.standard_normal((n, 2)) @ L.T
    S1T = S1 * np.exp((r - 0.5 * sigma1 * sigma1) * T + sigma1 * math.sqrt(T) * Z[:, 0])
    S2T = S2 * np.exp((r - 0.5 * sigma2 * sigma2) * T + sigma2 * math.sqrt(T) * Z[:, 1])
    payoff = np.maximum(S1T - S2T, 0.0)
    mc_price = math.exp(-r * T) * payoff.mean()
    se = math.exp(-r * T) * payoff.std(ddof=1) / math.sqrt(n)
    print(f"r={r:.2f}: Monte Carlo = {mc_price:.6f} +/- {se:.6f}")
"""
                ),
            },
            {
                "name": "Basket options and the lognormal-sum problem",
                "explain": """<p>A basket option's payoff depends on a WEIGHTED SUM of lognormal assets, and a sum of lognormals is not itself lognormal -- there is no exact Black-Scholes-style closed form for a basket call with a nonzero strike, or for three or more assets. Margrabe's formula is the special case that escapes this: its zero-strike, two-asset exchange payoff is homogeneous of degree one, which is exactly what lets one asset serve as numeraire and collapse the problem to a single effective volatility. A nonzero strike destroys that trick.</p><p>Common practice approximates the basket by a single lognormal matching its first two moments (mean and variance) -- "moment matching" -- and benchmarks the approximation against Monte Carlo, which is the code below: a two-asset basket call priced by moment matching against a Monte Carlo "truth," with the resulting (typically small, but real) approximation error printed explicitly rather than hidden.</p>""",
                "code": code(
                    """import numpy as np
import math
np.seterr(all="ignore")

def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def bs_call(S, K, r, sigma, T):
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)

S1, S2, sigma1, sigma2, rho, r, T, K = 100.0, 100.0, 0.22, 0.28, 0.5, 0.03, 1.0, 105.0
w1, w2 = 0.5, 0.5

EB = w1 * S1 * math.exp(r * T) + w2 * S2 * math.exp(r * T)
varB = (w1 * S1 * math.exp(r * T)) ** 2 * (math.exp(sigma1 * sigma1 * T) - 1) \\
     + (w2 * S2 * math.exp(r * T)) ** 2 * (math.exp(sigma2 * sigma2 * T) - 1) \\
     + 2 * w1 * w2 * S1 * S2 * math.exp(2 * r * T) * (math.exp(rho * sigma1 * sigma2 * T) - 1)
sigma_eff = math.sqrt(math.log(1 + varB / EB ** 2) / T)
S_eff = EB * math.exp(-r * T)
approx_price = bs_call(S_eff, K, r, sigma_eff, T)

rng = np.random.default_rng(9003)
n = 2_000_000
L = np.linalg.cholesky(np.array([[1.0, rho], [rho, 1.0]]))
Z = rng.standard_normal((n, 2)) @ L.T
S1T = S1 * np.exp((r - 0.5 * sigma1 * sigma1) * T + sigma1 * math.sqrt(T) * Z[:, 0])
S2T = S2 * np.exp((r - 0.5 * sigma2 * sigma2) * T + sigma2 * math.sqrt(T) * Z[:, 1])
payoff = np.maximum(w1 * S1T + w2 * S2T - K, 0.0)
mc_price = math.exp(-r * T) * payoff.mean()
se = math.exp(-r * T) * payoff.std(ddof=1) / math.sqrt(n)

print(f"moment-matched lognormal approximation = {approx_price:.6f}")
print(f"Monte Carlo 'truth'                    = {mc_price:.6f} +/- {se:.6f}")
print(f"approximation error                    = {approx_price - mc_price:.6f}")
print("a weighted sum of lognormals is not itself lognormal, so this approximation carries a real,")
print("if usually small, bias -- unlike Margrabe's EXACT formula for the zero-strike two-asset case")
"""
                ),
            },
            {
                "name": "The quanto correlation adjustment",
                "explain": """<p>A quanto pays a FOREIGN-currency-denominated payoff but settles in the DOMESTIC currency at a fixed, pre-agreed exchange rate. Because the domestic investor's payoff depends on the JOINT behavior of the foreign asset and the FX rate, pricing correctly under the domestic risk-neutral measure requires shifting the foreign asset's drift by <code>-rho*sigma_S*sigma_fx</code> relative to its own, foreign risk-neutral drift -- a direct application of the Girsanov-type measure change behind every numeraire switch this week, specialized to the case of switching CURRENCIES rather than switching between two traded assets in the same currency.</p><p>The code simulates the foreign asset's terminal distribution under its own risk-neutral drift and under the quanto-adjusted drift, and checks that each empirical mean matches its own theoretical target -- making the size and sign of the correction concrete rather than asserted.</p>""",
                "formula": r"\mu_{\text{quanto}} = r_f - \rho\,\sigma_S\,\sigma_{fx}",
                "code": code(
                    """import numpy as np
import math
np.seterr(all="ignore")

rng = np.random.default_rng(9004)
S0, sigma_S, r_f, sigma_fx, rho, T = 100.0, 0.24, 0.02, 0.12, -0.35, 1.0
n = 3_000_000
Z = rng.standard_normal(n)

# foreign risk-neutral drift, as if pricing purely in the foreign currency
ST_foreign_Q = S0 * np.exp((r_f - 0.5 * sigma_S * sigma_S) * T + sigma_S * math.sqrt(T) * Z)

# quanto (domestic-measure) drift: subtract the covariance correction
quanto_drift = r_f - rho * sigma_S * sigma_fx
ST_quanto = S0 * np.exp((quanto_drift - 0.5 * sigma_S * sigma_S) * T + sigma_S * math.sqrt(T) * Z)

print(f"E[S_T] under the foreign risk-neutral measure     = {ST_foreign_Q.mean():.4f}  (theory {S0 * math.exp(r_f * T):.4f})")
print(f"E[S_T] under the quanto-adjusted domestic measure = {ST_quanto.mean():.4f}  (theory {S0 * math.exp(quanto_drift * T):.4f})")
print(f"quanto adjustment to the drift = -rho*sigma_S*sigma_fx = {-rho * sigma_S * sigma_fx:.6f}")
print("a domestic desk pricing a quanto payoff off the foreign asset must apply exactly this shift,")
print("or it is silently using the wrong pricing measure")
"""
                ),
            },
        ],
        "widget": {
            "type": "curve",
            "title": "Margrabe price vs. correlation between the two assets",
            "params": {
                "xlab": "Correlation rho",
                "ylab": "Exchange option price",
                "series": [
                    {"name": "Margrabe price", "x": [-0.8, -0.4, 0.0, 0.4, 0.8], "y": [23.6961, 21.2872, 18.4899, 15.0467, 10.1291]}
                ],
                "log": False,
            },
        },
        "pitfalls": [
            "Assuming Margrabe's formula for max(S1-S2,0) needs a risk-free rate input; r cancels exactly because both legs are traded assets growing at the same rate under Q.",
            "Treating a basket or spread option (nonzero strike, or three or more assets) as if it had Margrabe's clean closed form; the exact result relies on a homogeneous-degree-one payoff, which a nonzero strike destroys.",
            "Simulating multiple correlated assets by drawing INDEPENDENT normals instead of Cholesky-correlating them; this silently misprices every basket, spread and quanto payoff that follows.",
            "Pricing a quanto payoff using the foreign asset's OWN risk-neutral drift instead of applying the -rho*sigma_S*sigma_fx correction; the omission is a systematic, not a random, pricing error.",
        ],
        "check": [
            {
                "q": "In Margrabe's formula for an exchange option, the risk-free rate r:",
                "options": [
                    "Must be estimated with high precision",
                    "Does not appear at all, because both assets grow at the same rate under Q and it cancels",
                    "Only matters for American-style exercise",
                    "Determines the correlation between the assets",
                ],
                "answer": 1,
                "why": "Both legs are traded assets that grow at r under the risk-neutral measure and are then discounted at r; the two effects cancel exactly, which is why the closed form has no r in it at all.",
            },
            {
                "q": "A basket option with a nonzero strike lacks Margrabe's exact closed form because:",
                "options": [
                    "Baskets are always American-style",
                    "A weighted sum of lognormal random variables is not itself lognormal",
                    "There is no risk-neutral measure for baskets",
                    "Correlation cannot be estimated for more than two assets",
                ],
                "answer": 1,
                "why": "The basket's terminal value is a sum of lognormals, which has no simple closed-form distribution; Margrabe's formula escapes this only because its zero-strike payoff is homogeneous of degree one, a property a nonzero strike removes.",
            },
            {
                "q": "Simulating two correlated assets by drawing two INDEPENDENT standard normals (skipping the Cholesky step) will:",
                "options": [
                    "Have no effect, since means are unaffected",
                    "Silently misprice every payoff that depends on the joint distribution of the two assets",
                    "Only matter for American options",
                    "Only matter if rho equals exactly 1",
                ],
                "answer": 1,
                "why": "Any payoff that depends on the JOINT outcome of both assets (exchange options, baskets, spreads) is sensitive to their correlation; simulating them as independent silently sets rho=0 regardless of the intended value.",
            },
            {
                "q": "The quanto drift adjustment -rho*sigma_S*sigma_fx exists because:",
                "options": [
                    "FX rates always have zero drift",
                    "Pricing a foreign asset's payoff under the DOMESTIC measure requires a Girsanov-type shift equal to its covariance with the FX rate",
                    "It corrects for a coding error in the simulation",
                    "Correlation never affects derivative pricing",
                ],
                "answer": 1,
                "why": "Switching from the foreign to the domestic pricing measure is itself a change of numeraire/measure, and the resulting drift shift is exactly the covariance term between the asset and the FX rate -- not an error correction, but the theorem's content.",
            },
        ],
    },
]

COURSE = {
    "code": "FINM 33000",
    "slug": "finm-33000",
    "title": "Options",
    "instructor": "Roger Lee",
    "quarter": "Autumn",
    "units": 100,
    "block": "core",
    "concentrations": [],
    "source": {
        "page_url": "https://finmath.uchicago.edu/curriculum/required-courses/finm-33000-mathematical-foundations-of-option-pricing/",
        "syllabus_url": "https://uchicago.box.com/s/hv4c127ev75jg2y93o2kjl9fdifle8cs",
        "fetched": "2026-09-26",
        "note": "The only readable source for this course was the public course page: an official description naming arbitrage, the Fundamental Theorems of Asset Pricing, binomial and other discrete models, Black-Scholes and other continuous-time Gaussian models in one- and multi-dimensional settings, PDE and martingale methods, and change of numeraire. The syllabus PDF is a Box shared link restricted to a university login, so data/raw/syllabus/ is empty for this course and no syllabus text exists in this corpus. The nine-week arc below follows the public description's own topic ordering closely, but the week boundaries, the explanations, the code and its output, the pitfalls, the questions, the interview set and the glossary are this dashboard's own reconstruction of a standard graduate treatment of those topics. None of it comes from the instructor, none of it was reviewed by the instructor, and nothing about grading, assignments, required readings, exam format or scheduling should be inferred from it.",
    },
    "tier": "B",
    "description": "Introduction to the theory of arbitrage-free pricing and hedging of financial derivatives. Topics include: arbitrage; fundamental theorems of asset pricing; binomial and other discrete models; Black-Scholes and other continuous-time Gaussian models in one-dimensional and multidimensional settings; PDE and martingale methods; change of numeraire.",
    "prerequisites": [
        "Calculus-based probability at the level of moment generating functions, joint densities and conditional expectation; this course does not build measure theory from scratch, but leans on conditional expectation constantly.",
        "Linear algebra: solving small systems of linear equations by hand or with numpy, and basic matrix-vector manipulation, for the state-price and change-of-numeraire calculations in weeks 2 and 8.",
        "Enough real analysis to be unsurprised that a limit of a discrete sum can equal an integral, and that a sequence can converge non-monotonically; both show up directly when the binomial model becomes Black-Scholes.",
        "Python and NumPy sufficient to implement a backward-induction loop and a Monte Carlo estimator without a library doing the arithmetic for you.",
    ],
    "textbooks": [
        {
            "title": "Stochastic Calculus for Finance I: The Binomial Asset Pricing Model",
            "author": "Steven Shreve",
            "note": "Standard reference for the binomial model, the Fundamental Theorems of Asset Pricing, and the discrete-time martingale arguments of weeks 1-4.",
        },
        {
            "title": "Stochastic Calculus for Finance II: Continuous-Time Models",
            "author": "Steven Shreve",
            "note": "Standard reference for Brownian motion, Ito calculus, the Black-Scholes PDE, Feynman-Kac, and change of numeraire, at about the depth and in about the order this course covers them.",
        },
        {
            "title": "Options, Futures, and Other Derivatives",
            "author": "John C. Hull",
            "note": "Standard applied reference for the Black-Scholes formula, the Greeks, implied volatility and dividend adjustments.",
        },
        {
            "title": "The Concepts and Practice of Mathematical Finance",
            "author": "Mark S. Joshi",
            "note": "Standard reference for the change-of-numeraire arguments and multi-asset models (Margrabe, quanto adjustments) of weeks 8 and 9.",
        },
    ],
    "skills_built": [
        "risk-neutral-pricing",
        "change-of-numeraire",
        "binomial-model",
        "fundamental-theorems-asset-pricing",
        "black-scholes-pde",
        "greeks",
        "implied-volatility",
        "american-options",
        "cost-of-carry",
        "black-76",
        "brownian-motion",
        "martingales",
        "girsanov",
        "monte-carlo-pricing",
    ],
    "skills_assumed": [
        "conditional-expectation",
        "linear-algebra",
        "numpy",
        "random-walk",
    ],
    "brushup": [
        {
            "topic": "Reading a normal CDF/PDF off a formula",
            "why": "Every closed form from week 4 onward is built from N(d1), N(d2) and n(d1). Recognising the pieces on sight -- which one is Delta, which one turns into Vega when multiplied by S*sqrt(T) -- saves real time on every derivation and every problem set.",
            "resource": "Hull's appendix on the Black-Scholes formula's building blocks, or any first course's normal-distribution tables",
        },
        {
            "topic": "Solving a small linear system by hand",
            "why": "Weeks 2 and 8 both reduce to solving a 2x2 or 3x3 linear system for state prices or for a change-of-numeraire probability. If Gaussian elimination on a small system is not automatic, those weeks will feel like new machinery instead of a repackaging of algebra you already know.",
            "resource": "Any linear algebra refresher covering solving Ax=b by hand for small n",
        },
        {
            "topic": "The Taylor expansion of e^x to second order",
            "why": "Both the CRR tree's parameter matching (week 4) and Ito's formula's correction term (week 5) lean on e^x = 1 + x + x^2/2 + ... to second order. Doing this expansion once by hand removes the mystery from both.",
            "resource": "Work out e^x's Taylor series to second order with pencil and paper; ten minutes, never needed again",
        },
        {
            "topic": "What a martingale is, in one sentence",
            "why": "A martingale is a fair game: today's value is the best forecast of tomorrow's, given everything known today. Every 'discounted price is a Q-martingale' claim in this course -- discrete in week 3, continuous in week 6 -- is a direct application of this one idea to a specific process.",
            "resource": "Any introductory stochastic processes text's definition of a martingale, or FINM 34000's martingale week",
        },
        {
            "topic": "Lognormal random variables and Jensen's inequality",
            "why": "Week 5's -0.5*sigma^2*T drift correction, and the reason E[e^X] is not e^{E[X]} for a normal X, is Jensen's inequality applied to the convex function exp(.). Working out E[e^X] by hand for X ~ N(mu, sigma^2) once makes every lognormal formula in this course self-explanatory instead of memorized.",
            "resource": "Derive E[e^X] = e^{mu + sigma^2/2} from the normal moment generating function by hand",
        },
        {
            "topic": "Cost of carry and forward pricing",
            "why": "Week 1's forward-pricing relation, and every later 'the drift under Q is r (or r-q, or r_d-r_f)' statement, is a restatement of the same cost-of-carry idea. Being comfortable with F0 = S0*e^{(r-q)T} from a first derivatives course means week 1 is review, not new material.",
            "resource": "Any introductory derivatives text's chapter on forward and futures pricing, e.g. Hull chapter 5",
        },
    ],
    "weeks": WEEKS,
    "interview": [
        {
            "q": "What is arbitrage, and why does its absence pin down relative prices even without a model of how the stock moves?",
            "level": "screen",
            "answer": "Arbitrage is a trading strategy requiring no net investment today, that cannot lose money in any future state, and that has a positive chance of profit. If two portfolios have identical payoffs in every state, no-arbitrage forces identical prices today, because otherwise buying the cheap one and selling the dear one banks a riskless profit. This argument uses no probability distribution and no model of the stock's dynamics at all -- it is purely about comparing payoffs state by state, which is why static replication results like put-call parity and forward pricing hold across every model in this course simultaneously.",
        },
        {
            "q": "State put-call parity and explain why it is called 'model-free'.",
            "level": "screen",
            "answer": "Put-call parity is C - P = S0 - K*e^{-rT}. It is model-free because it follows purely from static replication: a long call plus a short put at the same strike and maturity reproduces a forward contract's payoff exactly, in every state, so the two portfolios must cost the same today. No volatility, distribution, or pricing model appears in the derivation, which is why it holds identically whether the underlying is priced with Black-Scholes, a jump-diffusion model, or anything else consistent with the same discounting -- two models that disagree wildly on C and P individually must still agree on C minus P.",
        },
        {
            "q": "In a one-period binomial model, how do you compute the replicating portfolio for a call option?",
            "level": "screen",
            "answer": "With the stock moving from S0 to S0*u or S0*d and the option paying Cu or Cd in those two states, the replicating portfolio holds Delta = (Cu-Cd)/(S0*(u-d)) shares of stock and B = (Cu - Delta*S0*u)/R in the risk-free bond, where R is the bond's one-period growth factor. Because there are exactly two traded assets spanning exactly two states, this system has a unique solution, and the replicating portfolio's cost, Delta*S0 + B, equals the option's no-arbitrage price -- which also equals the discounted risk-neutral expectation q*Cu + (1-q)*Cd, computed by an entirely separate route.",
        },
        {
            "q": "Explain the two Fundamental Theorems of Asset Pricing in your own words.",
            "level": "onsite",
            "answer": "The first theorem says a market has no arbitrage if and only if there exists an equivalent martingale measure Q under which every discounted traded price is a martingale; equivalently, positive state prices exist that reprice every traded asset. The second theorem says that, given no arbitrage, the market is complete -- every payoff can be replicated by traded assets -- if and only if that measure Q is UNIQUE. With fewer independent traded assets than states, many valid Q's price the traded assets identically but disagree on an untraded claim's price, so the arbitrage-free price of that claim is a range, not a single number, until something beyond no-arbitrage (another traded instrument, or a modeling assumption) is added.",
        },
        {
            "q": "Why does the Black-Scholes formula not depend on the real-world probability of the stock going up?",
            "level": "onsite",
            "answer": "Because the price is derived by REPLICATION, not by taking an expectation under anyone's beliefs: a continuously rebalanced position of Delta shares plus a bond position matches the option's payoff exactly regardless of what actually happens, and no-arbitrage says the option must cost what replicating it costs. The physical probability of an up move never enters that construction. The risk-neutral probability that DOES appear in the resulting expectation formula is a derived pricing device, manufactured from today's traded prices via replication, and it generally has no relationship to anyone's actual forecast of the stock's direction.",
        },
        {
            "q": "At a high level, why does d(W_t^2) = 2*W_t*dW_t + dt, rather than just 2*W_t*dW_t as ordinary calculus would suggest?",
            "level": "onsite",
            "answer": "Ordinary calculus's chain rule implicitly assumes the increments being squared vanish faster than the increments themselves as a partition is refined, which is true for any smooth path. Brownian motion violates this: its quadratic variation over any interval converges to the length of the interval, not to zero. Ito's formula is the chain rule corrected for that fact, and the extra dt term is precisely the accumulated effect of that nonzero quadratic variation. The same correction is why geometric Brownian motion's terminal distribution needs a -0.5*sigma^2*T drift adjustment to keep its mean correct.",
        },
        {
            "q": "Is it ever optimal to exercise an American call early on a non-dividend-paying stock? What changes with dividends?",
            "level": "onsite",
            "answer": "No: without dividends, a call's value is always bounded below by S - K*DF, which strictly exceeds the exercise value S-K whenever r>0, so holding dominates exercising in every state and the American and European call prices coincide exactly. A discrete dividend changes this because the stock drops by roughly the dividend amount on the ex-date; exercising just before that drop captures the higher pre-drop intrinsic value, while holding through it means the option's remaining value reflects the lower post-dividend price. That timing gap is exactly what can make early exercise optimal, typically right around the ex-dividend date and nowhere else.",
        },
        {
            "q": "Explain change of numeraire, and why the price of a claim does not depend on which numeraire you use to compute it.",
            "level": "senior",
            "answer": "A numeraire is any strictly positive traded asset used as the unit prices are measured in. Dividing every price by the same numeraire rescales units but does not change which portfolio is cheapest, so it must be matched by a corresponding change of probability measure -- with Radon-Nikodym derivative equal to the ratio of the new numeraire's growth to the old one's -- for pricing to remain self-consistent. The price of a fixed claim, converted back to a common numeraire, is therefore identical no matter which numeraire and measure pair was used along the way; the choice is a computational convenience that can make a driftless martingale appear where there was a drift before (the forward measure is the standard example), never a modeling choice that changes the answer.",
        },
        {
            "q": "Why does Margrabe's formula for an exchange option not require an interest rate, while a plain vanilla Black-Scholes call does?",
            "level": "senior",
            "answer": "A vanilla call's payoff, max(S-K,0), mixes a traded asset (S) with a fixed cash amount (K), and the interest rate enters because K must be discounted while S grows at the risk-neutral rate -- the two do not cancel. An exchange option's payoff, max(S1-S2,0), involves only two traded assets, both of which grow at the SAME risk-neutral rate r and get discounted by the same factor at the end; the r's cancel exactly between the drift and the discounting. This is really a change-of-numeraire fact: using S2 as numeraire turns the problem into pricing a claim on S1/S2 with S2's own volatility contribution absorbed into a single relative volatility, and no interest rate ever appears because a numeraire-relative price needs none.",
        },
        {
            "q": "A colleague argues that risk-neutral probabilities ARE the market's real-world probabilities, just correctly measured. How do you respond?",
            "level": "senior",
            "answer": "That conflates two genuinely different objects. Risk-neutral probabilities are a pricing DEVICE, derived purely from today's traded prices via replication (or, in an incomplete market, chosen from a family of such devices); the Fundamental Theorems of Asset Pricing establish their existence and, when the market is complete, their uniqueness, entirely from no-arbitrage, without any reference to beliefs. Physical probabilities describe actual likelihoods of outcomes, which no-arbitrage pricing never needs and a replication argument never uses. The two measures coincide only in a knife-edge special case, a risk-neutral investor whose beliefs happen to already be correct; treating them as the same thing in general is precisely the mistake week 2's example is built to correct.",
        },
    ],
    "reappears_in": [
        {
            "code": "FINM 32000",
            "how": "Numerical Methods takes the binomial trees, PDE and change-of-numeraire theory built here and asks how to actually COMPUTE with it at scale: convergence-rate tree design, finite-difference solvers for the same PDE, and Monte Carlo and Fourier methods for the same risk-neutral expectations.",
        },
        {
            "code": "FINM 34500",
            "how": "Stochastic Calculus gives the rigorous measure-theoretic treatment of the Brownian motion, Ito calculus and Girsanov machinery this course uses at a working, simulation-checked level in weeks 5-9.",
        },
        {
            "code": "FINM 37500",
            "how": "Fixed Income Derivatives specializes the forward-measure and change-of-numeraire arguments of week 8 to interest-rate products: Black-76, swaptions and convexity adjustments are this course's numeraire toolkit applied to the curve.",
        },
        {
            "code": "FINM 37301",
            "how": "Foreign Exchange: Markets, Products and Pricing extends week 8's Garman-Kohlhagen treatment with the full FX product set -- forwards, swaps and a volatility surface -- built on the same domestic/foreign numeraire-change foundation.",
        },
    ],
    "glossary": [
        {"term": "Arbitrage", "def": "A trading strategy requiring no net investment today, that cannot lose money in any future state, and has a positive chance of profit. Its absence forces portfolios with identical payoffs to share identical prices today."},
        {"term": "Put-call parity", "def": "C - P = S0 - K*e^{-rT}: a model-free identity from statically replicating a forward with a long call and a short put."},
        {"term": "State price", "def": "A positive weight attached to a future state such that every traded asset's price equals the sum of its state-by-state payoffs times the state prices."},
        {"term": "Equivalent martingale measure (EMM)", "def": "A probability measure, equivalent to the physical one, under which every discounted traded price is a martingale. Normalized state prices."},
        {"term": "FTAP I", "def": "The first Fundamental Theorem of Asset Pricing: a market has no arbitrage if and only if an equivalent martingale measure exists."},
        {"term": "FTAP II", "def": "The second Fundamental Theorem: given no arbitrage, the market is complete -- every payoff replicable by traded assets -- if and only if the equivalent martingale measure is unique."},
        {"term": "Risk-neutral probability (q)", "def": "The probability, in a one-period binomial model, that makes the discounted stock price a martingale: q=(R-d)/(u-d)."},
        {"term": "CRR binomial model", "def": "Cox-Ross-Rubinstein's choice of u, d and R matching the lognormal diffusion's mean and variance per step, so the tree converges to Black-Scholes as steps increase."},
        {"term": "Early exercise", "def": "Exercising an American option before maturity; optimal exactly when intrinsic value exceeds the continuation (held) value."},
        {"term": "Brownian motion", "def": "A continuous-path process with independent, normally distributed increments; nowhere differentiable, with quadratic variation equal to elapsed time rather than zero."},
        {"term": "Ito's formula", "def": "The stochastic chain rule: applying a smooth function to a diffusion picks up a second-order correction term absent from ordinary calculus."},
        {"term": "Geometric Brownian motion (GBM)", "def": "The diffusion dS=mu*S*dt+sigma*S*dW; its solution is lognormal, with a -0.5*sigma^2*T drift correction keeping E[S_T] exact."},
        {"term": "Black-Scholes PDE", "def": "The parabolic PDE a delta-hedged, self-financing derivative price must satisfy: dC/dt + rS*dC/dS + 0.5*sigma^2*S^2*d^2C/dS^2 = rC."},
        {"term": "Feynman-Kac theorem", "def": "The identity linking a parabolic PDE's solution to a discounted risk-neutral expectation over the corresponding diffusion; one object, two descriptions."},
        {"term": "Greeks", "def": "Sensitivities of an option price: Delta, Gamma, Vega, Theta and Rho, linked by the Black-Scholes PDE identity at every instant."},
        {"term": "Implied volatility", "def": "The single sigma value that reprices a given market quote exactly in the Black-Scholes formula; a quoting convention, not a forecast."},
        {"term": "Change of numeraire", "def": "Re-expressing every price in units of a different traded asset; changes the pricing measure and units, never the price of a fixed claim. The forward measure (the zero-coupon bond as numeraire) is the standard example."},
        {"term": "Garman-Kohlhagen formula", "def": "Black-Scholes for FX options, with the foreign risk-free rate playing the role of a continuous dividend yield on the foreign currency."},
        {"term": "Margrabe's formula", "def": "The closed-form price of an exchange option max(S1-S2,0); Black-Scholes with S2 as numeraire and volatility replaced by the two assets' relative volatility."},
        {"term": "Quanto adjustment", "def": "The drift correction -rho*sigma_S*sigma_fx applied when pricing a foreign-currency payoff, settled domestically at a fixed rate, under the domestic measure."},
    ],
}


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    header = (
        "/* ==========================================================================\n"
        "   courses/finm-33000.js -- FINM 33000 . Options\n"
        "\n"
        "   Built from the public course page only. The syllabus PDF is a Box shared\n"
        "   link restricted to a campus login, so the nine-week outline below, and\n"
        "   every explanation, formula, snippet, question and glossary entry in it,\n"
        "   is this dashboard's own reconstruction of a standard graduate treatment\n"
        "   of arbitrage-free option pricing -- not the instructor's material.\n"
        "   Generated by tools/gen_finm_33000.py; do not hand-edit.\n"
        "   ========================================================================== */\n"
    )
    body = json.dumps(COURSE, indent=2, ensure_ascii=False)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header)
        f.write('window.COURSES = window.COURSES || {};\n')
        f.write('window.COURSES["FINM 33000"] = ')
        f.write(body)
        f.write(";\n")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
