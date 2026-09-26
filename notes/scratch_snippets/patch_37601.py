#!/usr/bin/env python3
"""Patch courses/finm-37601.js: fill the empty `interview` array (10 items),
touching nothing else. Loads the file with tools/jsload.py, edits the dict in
memory, and rewrites the file in the same header-comment + assignment format,
with the object emitted via json.dumps(indent=2)."""
import json
import os
import sys

HERE = "/Users/sdonadio/PycharmProjects/FinMathCurriculumArena"
sys.path.insert(0, os.path.join(HERE, "tools"))
from jsload import load_assignments  # noqa: E402

PATH = os.path.join(HERE, "courses", "finm-37601.js")

HEADER = """/* courses/finm-37601.js -- FINM 37601, Mathematical Market Microstructure:
   An Optimized Approach.

   Built from the public course page only. The syllabus PDF the page links is a
   Box shared link gated behind a university login and could not be read, so no
   syllabus text was available: the ten-week arc, the concepts, the code, the
   questions, the pitfalls and the glossary below are this dashboard's own
   reconstruction of a standard graduate treatment of the topics the public
   description names. Nothing here is the instructor's material, nothing here
   was reviewed by the instructor, and no claim is made about grading,
   assignments, exam format or which textbook is actually assigned.

   Every `output` field is the real stdout of the snippet above it, captured by
   tools/run_snippets.py. Do not hand-edit an output. */
"""

INTERVIEW = [
    {
        "q": "Why does price-time priority turn a resting limit order into something with option-like value?",
        "level": "screen",
        "answer": "A resting order is a free option to trade written by the passive side: it earns the spread if the market moves through it and is filled, but it is exactly the orders most likely to be picked off by informed flow that get filled fastest, because the same move that fills you signals the direction. Price-time priority also creates a rent on the queue itself — once you are at a price level, later orders at that price must wait behind you, so your position has value distinct from the price you quoted. That value decays as orders ahead of you cancel or trade and as new orders join behind you, which is why queue position, not just price, is a state variable a market maker has to track."
    },
    {
        "q": "A tick size is cut in half. What happens to displayed depth and to the value of being first in the queue?",
        "level": "screen",
        "answer": "A binding tick is a constraint that creates a rent: many participants would prefer to quote a price between the current bid and ask but cannot, so they pile into the best price instead, producing depth far in excess of what continuous pricing would show. Halving the tick lets some of that latent demand express itself at new, finer prices, so displayed depth at any one level falls and the rent shrinks. Because more price points are available, front-running a level by one tick becomes cheaper, which erodes the value of being first in the queue at the old tick and shifts competition from queue position toward price improvement."
    },
    {
        "q": "Maker-taker fees let a venue quote a locked or crossed book after fees. Why does a trades-only model of the market miss this?",
        "level": "screen",
        "answer": "Maker-taker pricing moves a large part of the effective bid-ask spread off the tape and into the fee schedule: a passive maker rebate can make the after-fee price better than the displayed price, so venues compete on net economics that a trades-only feed never records. A model built only from executed trades sees prices and sizes but not the cancellations, requotes and fee-driven order routing that determine which venue gets the flow in the first place — and on most modern order books, cancellations outnumber trades by an order of magnitude, so a trades-only view is conditioning on a small, non-representative slice of the message stream."
    },
    {
        "q": "Explain the Cont-Stoikov-Talreja zero-intelligence model and what it gets right about the limit order book.",
        "level": "onsite",
        "answer": "The model treats each price level as an independent birth-death queue: limit orders arrive as a Poisson process, market orders and cancellations remove volume, and the resulting stationary distribution of depth at each level has a closed form. Even though no agent in the model has any information or strategy, calibrating just the order-arrival, cancellation and market-order rates from data reproduces two features every real book shows: a hump-shaped average depth profile peaking a few ticks from the touch rather than at the touch itself, and first-passage probabilities for the book emptying that match observed short-horizon price-direction forecasts from queue imbalance. It is a baseline precisely because it isolates what mechanism alone explains, before adding any information-driven behavior."
    },
    {
        "q": "Why is queue imbalance predictive of the next price move even in a model with no informed traders?",
        "level": "onsite",
        "answer": "In a birth-death queue framework, whichever side of the book is thinner is closer to emptying first by pure first-passage arithmetic — a small bid queue with the same arrival and cancellation rates as a large ask queue has a higher probability of hitting zero before the ask does, and the book emptying on one side is what a price move at that level actually is. So imbalance predicts direction through queueing mechanics alone, without anyone's forecast changing anyone's behavior. This is also why imbalance signals decay fast and are heavily arbitraged: they are a mechanical, near-term feature of queue dynamics, not a fundamental view, so their edge disappears over a horizon of seconds rather than persisting into a real forecast of value."
    },
    {
        "q": "Walk through how the Roll model recovers the bid-ask spread from a series of trade prices with no order-book data.",
        "level": "onsite",
        "answer": "Roll's model assumes the efficient price follows a random walk and every observed trade price is that efficient price plus or minus half the spread, depending on whether the trade hit the ask or the bid, with the buy/sell direction alternating according to a coin flip independent of the price path. Under those assumptions the first-order autocovariance of observed price changes is exactly minus one quarter of the spread squared, and it is the only source of negative autocovariance in the model, so the spread is recovered as twice the square root of the negated first autocovariance. The identification is elegant but fragile: any other source of mean reversion in the price series — inventory effects, or genuine short-term predictability — biases the estimate, which is why the Roll spread is treated as a lower bound in practice, not a precise measurement."
    },
    {
        "q": "The microprice is a depth-weighted average of the best bid and ask. Why do practitioners say it has the 'right shape but the wrong gain'?",
        "level": "onsite",
        "answer": "The microprice weights the ask by the fraction of depth resting on the bid side and vice versa, so it moves toward whichever side is thinner — exactly the direction queue-imbalance arguments say the price should move, which is the right shape. But the actual sensitivity of the efficient price to a given imbalance reading is a market-specific coefficient that a fixed depth-weighting formula does not estimate; in a wide or illiquid book the raw microprice frequently overshoots the eventual mid-price move, and in a very liquid book it undershoots. Practitioners fit a regression of realized short-horizon price changes on the imbalance signal to estimate the correct gain and use the microprice formula only for the functional form, not the coefficient."
    },
    {
        "q": "Why do order-flow-imbalance regressions typically outperform signed-volume regressions for predicting short-horizon price moves, and what does the coefficient lambda represent?",
        "level": "onsite",
        "answer": "Signed volume only counts trades and ignores the far larger stream of order placements and cancellations that change depth without ever printing a trade; order-flow imbalance nets new limit-order arrivals, cancellations and trade-throughs on both sides, which is closer to the actual state variable driving where the price sits between bid and ask. Regressing the change in mid-price on order-flow imbalance over a short window gives a slope, usually called lambda, that measures how many basis points of price move a unit of net order flow produces — it is the empirical analogue of Kyle's lambda, an inverse liquidity measure: a market with a small lambda absorbs a given order-flow shock with little price impact, and a large lambda is a thin, easily moved market."
    },
    {
        "q": "You are quoting at the touch and get filled. Conditional on being filled, is your expected markout positive, negative, or zero, and why?",
        "level": "senior",
        "answer": "Conditional on a fill, the expected markout for a passive quote is typically negative in the seconds after the trade before turning positive later, because the population of orders that get filled fast is disproportionately the ones being adversely selected: a resting bid only trades quickly if aggressive sell flow crosses through it, and aggressive flow is more likely to be informed than average unconditional flow. The spread you earn is captured instantly at the fill, but the adverse-selection cost shows up gradually as the efficient price drifts against you over the following minutes — which is exactly why markout curves, not the instantaneous spread capture, are the right diagnostic for whether a market-making strategy is profitable net of information costs."
    },
    {
        "q": "Explain the square-root law of market impact and why a linear-in-size impact model is a bad approximation for large orders.",
        "level": "senior",
        "answer": "Empirically, the price impact of executing a metaorder scales roughly with the square root of the order's size as a fraction of average daily volume, times the asset's volatility over the execution horizon — not linearly with size. A linear model matches well for small orders but badly overstates the cost of large ones, because it implies impact per share is constant when in practice each additional child order faces a market that has already partially adjusted and is replenishing liquidity from other participants, so marginal impact falls with cumulative size. This matters directly for capacity: a strategy sized off a linear impact assumption will underestimate how much size it can actually execute, while one that ignores the square-root law's implied decay after the metaorder ends will overstate how much of the price move is genuinely permanent versus temporary."
    }
]


def main():
    d = load_assignments(PATH, "COURSES")
    c = d["FINM 37601"]
    assert c["interview"] == [], "expected the interview array to be empty before patching"
    c["interview"] = INTERVIEW

    body = json.dumps(c, indent=2, ensure_ascii=False)
    text = HEADER + "window.COURSES = window.COURSES || {};\n" \
        "window.COURSES[\"FINM 37601\"] = " + body + ";\n"
    with open(PATH, "w", encoding="utf-8") as fh:
        fh.write(text)
    print("wrote", PATH, "interview items:", len(c["interview"]))


if __name__ == "__main__":
    main()
