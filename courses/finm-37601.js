/* courses/finm-37601.js -- FINM 37601, Mathematical Market Microstructure:
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
window.COURSES = window.COURSES || {};
window.COURSES["FINM 37601"] = {
  "code": "FINM 37601",
  "slug": "finm-37601",
  "title": "Mathematical Market Microstructure: An Optimized Approach",
  "instructor": "Hongsong Chou",
  "quarter": "Autumn",
  "units": 100,
  "block": "electives",
  "concentrations": [
    "trading"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/trading/finm-37601/",
    "syllabus_url": "https://uchicago.box.com/s/fbe2eznu7sidmtrd7g3ve7sdfk6ba7oh",
    "fetched": "2026-09-26",
    "note": "The only source consulted is the public course page, which carries an official description of the course plus its instructor, quarter, units and concentration. The syllabus the page links is a Box shared link restricted to a university login and could not be read, so the syllabus corpus for this course is empty. Everything on this page beyond the description block — the ten-week arc, the concepts, the formulas, the code, the widgets, the questions, the pitfalls and the glossary — is the dashboard's own reconstruction of a standard graduate treatment of the topics the description names. It is not the instructor's outline, it was not reviewed by the instructor, and no claim is made about grading, assignments, exam format or which textbook is actually assigned."
  },
  "tier": "B",
  "description": "Market microstructure is the sub-field of finance concerned with price formation at short time scales and with the behaviour of the market participants who are both the cause and the consequence of that price dynamics. The public description frames the course as deliberately balanced: rigorous mathematical treatment of the central problems on one side, and practical discussion of secondary-market trading and risk management on the other, with roughly half the content on theory and academic results and half on industry practice across global and local markets. It also notes that advances in communication, computational power and, recently, artificial intelligence have been reshaping both the research and the practice of the subject, and that the course has absorbed those developments over more than a decade of iterations. The arc reconstructed here reads the subject as an optimisation and stochastic-control problem: what the limit order book is as a stochastic object, how price forms inside it, how much your own trading costs you, and what the optimal schedule or quote looks like once impact, inventory and adverse selection are all priced in.",
  "prerequisites": [
    "Stochastic calculus at the level of Itō integration, the Itō formula and a linear stochastic differential equation. Weeks 6 to 8 write and solve Hamilton–Jacobi–Bellman equations, and the algebra only reads as algebra if the calculus behind it is familiar.",
    "Dynamic programming and the discrete Bellman recursion. Almost every control problem here is first solved backwards on a grid and only then in closed form.",
    "Linear regression, including the interpretation of a slope as a conditional expectation and of a t-statistic as evidence. Order-flow-imbalance and impact calibration are regressions with market-specific pathologies.",
    "Poisson processes and continuous-time Markov chains: intensities, competing exponential clocks, and first-passage probabilities. The order book in week 2 is a birth–death chain and nothing more.",
    "Enough Python to vectorise a simulation with NumPy and reshape a table with pandas. Every snippet here is short, seeded and library-light."
  ],
  "textbooks": [
    {
      "title": "Algorithmic and High-Frequency Trading",
      "author": "Álvaro Cartea, Sebastian Jaimungal and José Penalva",
      "note": "A standard reference for this material and the closest single book to the arc below: order-book models, optimal execution, market making with inventory, and the stochastic control that ties them together. Listed as a reference, not as an assigned text."
    },
    {
      "title": "Trades, Quotes and Prices: Financial Markets Under the Microscope",
      "author": "Jean-Philippe Bouchaud, Julius Bonart, Jonathan Donier and Martin Gould",
      "note": "A standard reference for the empirical side of weeks 2, 3 and 5: stylised facts, order-flow autocorrelation, the square-root impact law and propagator models."
    },
    {
      "title": "Empirical Market Microstructure",
      "author": "Joel Hasbrouck",
      "note": "A standard reference for the econometrics of price formation used in week 3: trade signing, the Roll model, vector autoregressions on trades and quotes."
    },
    {
      "title": "Market Microstructure Theory",
      "author": "Maureen O'Hara",
      "note": "A standard reference for the economic models that sit underneath the control problems here — inventory and information paradigms in their original form. The equilibrium versions of those models are the subject of FINM 35100."
    },
    {
      "title": "The Financial Mathematics of Market Liquidity: From Optimal Execution to Market Making",
      "author": "Olivier Guéant",
      "note": "A standard reference for weeks 6 to 8, and the most careful treatment of the Avellaneda–Stoikov family of market-making problems and their asymptotic closed forms."
    }
  ],
  "skills_built": [
    "market-microstructure",
    "order-book-dynamics",
    "optimal-execution",
    "market-impact",
    "market-making",
    "liquidity-provision",
    "transaction-costs",
    "order-types",
    "exchange-mechanism-design",
    "order-book-data",
    "stochastic-control"
  ],
  "skills_assumed": [
    "ito-calculus",
    "stochastic-differential-equations",
    "conditional-expectation",
    "linear-regression",
    "numpy",
    "python-pandas"
  ],
  "brushup": [
    {
      "topic": "Competing exponential clocks",
      "why": "The order book in week 2 is a set of Poisson clocks racing each other: the first to ring decides what happens next. If you cannot immediately say that the minimum of independent exponentials is exponential with the summed rate, and that the winner is chosen with probability proportional to its rate, the whole chapter looks like magic.",
      "resource": "Any first course in stochastic processes; Ross, Introduction to Probability Models, chapter 5"
    },
    {
      "topic": "Backward induction on a finite horizon",
      "why": "Weeks 6 and 7 solve execution by filling a value-function table from the last period backwards. The closed forms come second and are only sanity checks on the recursion.",
      "resource": "Bertsekas, Dynamic Programming and Optimal Control, volume I, chapter 1"
    },
    {
      "topic": "The Itō formula and a quadratic-in-inventory ansatz",
      "why": "Every Hamilton–Jacobi–Bellman equation in weeks 6 to 8 is solved by guessing that the value function is quadratic in inventory with time-dependent coefficients, then matching terms. That step is mechanical if the calculus is fresh and impossible if it is not.",
      "resource": "Øksendal, Stochastic Differential Equations, chapters 4 and 11"
    },
    {
      "topic": "Solving a second-order linear recursion",
      "why": "The Almgren–Chriss trajectory is the solution of a three-term recursion whose characteristic roots produce the sinh form. Recognising a recursion by its characteristic equation saves an hour in week 6.",
      "resource": "Any discrete-mathematics text's chapter on linear recurrences"
    },
    {
      "topic": "Variance of a sum with known weights",
      "why": "The risk term in every execution objective is the variance of a weighted sum of independent price increments. The efficient frontier is a two-moment picture and the second moment is that sum.",
      "resource": "Any probability text; the same algebra as portfolio variance in FINM 36700"
    },
    {
      "topic": "Regression when the regressor is measured with error",
      "why": "Order-flow imbalance, signed volume and realised spread are all noisy proxies. Attenuation bias means a true impact coefficient looks smaller than it is, which matters when the coefficient is an input to a control problem.",
      "resource": "Any econometrics text's errors-in-variables section; Hasbrouck chapter 3"
    },
    {
      "topic": "NumPy broadcasting and cumulative sums",
      "why": "Every simulation below runs thousands of paths at once as a single array expression. A shape-(n,) array silently broadcasting against a shape-(n,1) one is the commonest bug in an execution backtest and it returns a plausible wrong number rather than an error.",
      "resource": "The NumPy user guide, 'Broadcasting'"
    }
  ],
  "weeks": [
    {
      "title": "The mechanism: continuous double auctions, ticks and fees",
      "topics": [
        "continuous double auction",
        "price-time priority",
        "order types and cancel-replace",
        "tick size and price discreteness",
        "maker-taker fee schedules",
        "message-level data",
        "what a model of the book has to reproduce"
      ],
      "concepts": [
        {
          "name": "Price-time priority makes a queue slot an asset",
          "explain": "<p>Almost every modern equity and futures venue runs a continuous double auction. Resting limit orders sit in queues at discrete prices; an incoming aggressive order walks the opposite side from the best price outward and executes against whatever it meets. Two rules decide who trades. Price priority says a better-priced order executes first. Time priority says that, within a price level, the earlier arrival executes first — first in, first out. A few venues replace the second rule with pro-rata allocation, which changes the strategic problem completely, but FIFO is the default assumption in this course.</p><p>Two consequences follow immediately and neither is obvious from a textbook supply-and-demand picture. First, a trade executes at the <em>resting</em> order's price, not the incoming order's limit. The aggressor pays the spread; the passive side is paid it. Second, because allocation inside a level is by arrival time, a queue slot is a real, valuable, non-transferable asset: the same order at the same price is worth more when there is less volume ahead of it. Everything in weeks 4 and 8 is a valuation of that asset.</p><p>The snippet implements the rule in about forty lines, which is worth doing once. A market buy for 600 shares consumes two resting orders at the same ask and pays both of them 100.02; the same 600 shares posted passively at 100.01 fills nothing and joins a queue with 400 shares ahead of it.</p><p>A desk cares because the difference between those two outcomes — paying the spread now versus queueing for it — is the single decision an execution algorithm makes thousands of times a day.</p>",
          "formula": "\\text{fill price} = p_{\\text{resting}}, \\qquad \\text{priority} = (\\text{price},\\, t_{\\text{arrival}})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# A continuous double auction with price-time priority, in one function.\n# Book: dict price -> list of (order_id, qty) in arrival order.\nBID, ASK = \"B\", \"A\"\n\n\ndef new_book():\n    return {BID: {}, ASK: {}}\n\n\ndef rest(book, side, px, oid, qty):\n    book[side].setdefault(px, []).append([oid, qty])\n\n\ndef best(book, side):\n    lv = [p for p, q in book[side].items() if sum(o[1] for o in q) > 0]\n    if not lv:\n        return None\n    return max(lv) if side == BID else min(lv)\n\n\ndef cross(book, side, px):\n    \"\"\"Is an incoming order on `side` at limit px executable?\"\"\"\n    opp = ASK if side == BID else BID\n    b = best(book, opp)\n    if b is None:\n        return False\n    return (b <= px) if side == BID else (b >= px)\n\n\ndef submit(book, side, px, oid, qty, kind=\"limit\"):\n    \"\"\"Aggress while crossing, then rest the remainder if a limit order.\"\"\"\n    opp = ASK if side == BID else BID\n    fills = []\n    while qty > 0 and (kind == \"market\" or cross(book, side, px)):\n        b = best(book, opp)\n        if b is None:\n            break\n        queue = book[opp][b]\n        for o in queue:                      # time priority inside the level\n            if qty == 0 or o[1] == 0:\n                continue\n            traded = min(qty, o[1])\n            o[1] -= traded\n            qty -= traded\n            fills.append((traded, b, o[0]))  # price is the RESTING order's\n        book[opp][b] = [o for o in queue if o[1] > 0]\n        if not book[opp][b]:\n            del book[opp][b]\n    if qty > 0 and kind == \"limit\":\n        rest(book, side, px, oid, qty)\n    return fills, qty\n\n\nbk = new_book()\n# two makers queue at the same ask price; M1 arrived first\nfor oid, side, px, q in [(\"M1\", ASK, 100.02, 300), (\"M2\", ASK, 100.02, 500),\n                         (\"M3\", ASK, 100.03, 900), (\"B1\", BID, 100.01, 400),\n                         (\"B2\", BID, 100.00, 800)]:\n    rest(bk, side, px, oid, q)\n\nprint(\"touch before      bid %.2f / ask %.2f\" % (best(bk, BID), best(bk, ASK)))\n\nfills, left = submit(bk, BID, 0.0, \"T1\", 600, kind=\"market\")\nprint(\"\\nmarket buy 600 shares -> fills at the RESTING price, in arrival order\")\nfor q, px, cp in fills:\n    print(\"   %3d @ %.2f  against %s\" % (q, px, cp))\nvwap = sum(q * px for q, px, _ in fills) / sum(q for q, _, _ in fills)\nprint(\"   vwap %.4f   unfilled %d\" % (vwap, left))\nprint(\"touch after       bid %.2f / ask %.2f\" % (best(bk, BID), best(bk, ASK)))\n\n# the same 600 shares as a limit order priced at the touch: no fill, it queues\nbk2 = new_book()\nfor oid, side, px, q in [(\"M1\", ASK, 100.02, 300), (\"M2\", ASK, 100.02, 500),\n                         (\"B1\", BID, 100.01, 400)]:\n    rest(bk2, side, px, oid, q)\nf2, left2 = submit(bk2, BID, 100.01, \"P1\", 600, kind=\"limit\")\nahead = sum(o[1] for o in bk2[BID][100.01] if o[0] != \"P1\")\nprint(\"\\npassive buy 600 @ 100.01 -> filled %d, resting %d, volume ahead %d\"\n      % (sum(q for q, _, _ in f2), left2, ahead))\n",
            "output": "touch before      bid 100.01 / ask 100.02\n\nmarket buy 600 shares -> fills at the RESTING price, in arrival order\n   300 @ 100.02  against M1\n   300 @ 100.02  against M2\n   vwap 100.0200   unfilled 0\ntouch after       bid 100.01 / ask 100.02\n\npassive buy 600 @ 100.01 -> filled 0, resting 600, volume ahead 400"
          }
        },
        {
          "name": "The tick is a constraint, and a binding tick creates a rent",
          "explain": "<p>Prices live on a grid. A venue's tick size sets the minimum increment, so the quoted spread cannot be anything a competitive maker might want — it has to be a positive integer number of ticks. When the tick is small relative to the spread a maker would otherwise quote, this is a rounding detail. When the tick is large relative to that spread, it binds: the spread is pinned at one tick and price competition simply stops, because there is no price between the bid and the ask to improve to.</p><p>What happens to the competition that used to happen on price? It moves to time. A pinned spread leaves a per-share rent on the table for whoever is at the front of the queue, and free entry competes that rent away by lengthening the queue rather than by narrowing the spread. That is why tick-constrained names have deep, slow-moving touches and why queue position dominates their economics. It is also why tick-size policy is never neutral: the same one-cent tick is a 25 basis point constraint on a four-dollar stock and less than half a basis point on a two-hundred-and-fifty-dollar one.</p><p>In the snippet a latent competitive spread with a median just under one cent is forced onto three grids. On the penny grid the spread is pinned at one tick 82.4% of the time, the average quoted spread inflates from 1.047 to 1.216 cents, and the residual maker rent is about 0.29 basis points of price.</p><p>A desk cares because whether a name is tick-constrained decides whether its execution problem is about paying the spread or about winning the queue.</p>",
          "formula": "s_{\\text{quoted}} = \\Delta \\cdot \\max\\!\\left(1,\\ \\operatorname{round}\\!\\left(\\frac{s^{*}}{\\Delta}\\right)\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\nrng = np.random.default_rng(37601)\nn = 200_000\npx = 40.00\n\n# Latent competitive spread: what a maker would quote on a continuous grid.\n# Lognormal around 0.9 cents, so the median sits just below one US penny.\nlatent = np.exp(rng.normal(np.log(0.009), 0.55, n))\n\nprint(\"latent spread (continuous grid), $%.2f stock\" % px)\nprint(\"   mean %.4f c   median %.4f c\" % (100 * latent.mean(), 100 * np.median(latent)))\nprint(\"\")\nprint(\"tick     mean quoted   at 1 tick   maker rent/share   rent (bp of price)\")\nfor tick in (0.0001, 0.001, 0.01, 0.05):\n    ticks = np.maximum(1, np.round(latent / tick))\n    quoted = ticks * tick\n    at_one = np.mean(ticks == 1)\n    rent = np.maximum(0.0, quoted - latent) / 2.0     # per share, per side\n    print(\"%7.4f   %8.4f c   %7.1f%%   %14.5f   %10.2f\" %\n          (tick, 100 * quoted.mean(), 100 * at_one, rent.mean(),\n           1e4 * rent.mean() / px))\n\n# The same absolute penny is a wildly different constraint across prices.\nprint(\"\\none-cent tick as a fraction of price, and a 5 bp latent spread:\")\nprint(\"price      tick (bp)   latent 5bp spread (c)   tick-constrained?\")\nfor p in (4.0, 15.0, 60.0, 250.0):\n    tick_bp = 1e4 * 0.01 / p\n    lat_c = 100 * 5e-4 * p\n    print(\"%7.2f   %9.2f   %21.3f   %s\"\n          % (p, tick_bp, lat_c, \"YES\" if lat_c < 1.0 else \"no\"))\n",
            "output": "latent spread (continuous grid), $40.00 stock\n   mean 1.0466 c   median 0.9005 c\n\ntick     mean quoted   at 1 tick   maker rent/share   rent (bp of price)\n 0.0001     1.0466 c       0.0%          0.00001         0.00\n 0.0010     1.0467 c       0.1%          0.00006         0.02\n 0.0100     1.2162 c      82.4%          0.00117         0.29\n 0.0500     5.0004 c     100.0%          0.01977         4.94\n\none-cent tick as a fraction of price, and a 5 bp latent spread:\nprice      tick (bp)   latent 5bp spread (c)   tick-constrained?\n   4.00       25.00                   0.200   YES\n  15.00        6.67                   0.750   YES\n  60.00        1.67                   3.000   no\n 250.00        0.40                  12.500   no"
          }
        },
        {
          "name": "Maker-taker fees move a large part of the spread into the fee column",
          "explain": "<p>Most US equity venues do not charge both sides of a trade symmetrically. They charge the aggressor an access fee and pay the passive side a rebate, keeping the difference. A typical schedule charges the taker thirty mils per share and pays the maker twenty. Inverted venues do the opposite: they pay takers and charge makers, buying order flow with the fee schedule.</p><p>The arithmetic matters more than it looks. On a one-cent spread, the half-spread is half a cent per share and the taker fee is thirty hundredths of a cent, so the fee is 60% of the half-spread and the taker's all-in cost is 1.6 times the quoted half-spread. On the maker's side, 29% of the gross capture on a one-cent-spread trade is the rebate rather than the spread. That is why quoted spreads are not comparable across venues with different schedules, and why a rebate-chasing strategy is a fee strategy wearing a trading strategy's clothes.</p><p>The break-even column is the one to internalise: a maker quoting a one-cent spread on a forty-dollar stock is only profitable if the average post-trade drift against the fill is less than 1.75 basis points. That number is small, and it is what the adverse-selection models of weeks 3 and 8 are trying to predict.</p><p>A desk cares because transaction-cost analysis that ignores the fee schedule systematically flatters passive strategies and penalises aggressive ones by amounts comparable to the spread itself.</p>",
          "formula": "c_{\\text{taker}} = \\tfrac{1}{2}s + f_{t}, \\qquad \\pi_{\\text{maker}} = \\tfrac{1}{2}s + r_{m} - \\mathbb{E}[\\text{adverse selection}]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\nprice = 40.00\nTAKE, REBATE = 0.0030, 0.0020          # dollars per share, a typical US equity schedule\n\nprint(\"$%.2f stock, taker fee %.4f/share, maker rebate %.4f/share\" % (price, TAKE, REBATE))\nprint(\"\")\nhdr = (\"spread(c)  half($)   taker all-in   fee/half   maker gross   \"\n       \"break-even adv sel (bp)\")\nprint(hdr)\nfor sp_c in (1.0, 2.0, 5.0, 10.0):\n    half = sp_c / 100.0 / 2.0\n    taker = half + TAKE\n    maker = half + REBATE\n    print(\"%8.1f  %7.5f   %12.5f   %7.0f%%   %11.5f   %20.2f\"\n          % (sp_c, half, taker, 100 * TAKE / half, maker, 1e4 * maker / price))\n\n# Same one-cent spread, three fee models. The maker's gross capture is the\n# half-spread plus whatever the venue pays (or minus what it charges).\nprint(\"\\none-cent quoted spread, three fee models (signs: + charged, - paid to you)\")\nprint(\"venue                  taker fee   maker fee   taker all-in   maker gross\")\nhalf = 0.005\nfor name, tk, mk in ((\"maker-taker (+30/-20)\", 0.0030, -0.0020),\n                     (\"flat        (  0/  0)\", 0.0000, 0.0000),\n                     (\"inverted    (-15/+18)\", -0.0015, 0.0018)):\n    print(\"%-21s %11.4f %11.4f   %12.5f   %11.5f\"\n          % (name, tk, mk, half + tk, half - mk))\n\nprint(\"\\nshare of a maker's one-cent-spread revenue that is the rebate, not the spread: \"\n      \"%.0f%%\" % (100 * REBATE / (half + REBATE)))\nprint(\"share of a taker's one-cent-spread cost that is the fee, not the spread:      \"\n      \"%.0f%%\" % (100 * TAKE / (half + TAKE)))\n",
            "output": "$40.00 stock, taker fee 0.0030/share, maker rebate 0.0020/share\n\nspread(c)  half($)   taker all-in   fee/half   maker gross   break-even adv sel (bp)\n     1.0  0.00500        0.00800        60%       0.00700                   1.75\n     2.0  0.01000        0.01300        30%       0.01200                   3.00\n     5.0  0.02500        0.02800        12%       0.02700                   6.75\n    10.0  0.05000        0.05300         6%       0.05200                  13.00\n\none-cent quoted spread, three fee models (signs: + charged, - paid to you)\nvenue                  taker fee   maker fee   taker all-in   maker gross\nmaker-taker (+30/-20)      0.0030     -0.0020        0.00800       0.00700\nflat        (  0/  0)      0.0000      0.0000        0.00500       0.00500\ninverted    (-15/+18)     -0.0015      0.0018        0.00350       0.00320\n\nshare of a maker's one-cent-spread revenue that is the rebate, not the spread: 29%\nshare of a taker's one-cent-spread cost that is the fee, not the spread:      38%"
          }
        },
        {
          "name": "The tape is mostly cancellations, and a trades-only model misses it",
          "explain": "<p>What a venue actually publishes is a message stream: order additions, modifications, cancellations and executions, each time-stamped and sequenced. Trades are a small minority of it. The standard intuition from daily data — that a price series is a sequence of trades — is quantitatively wrong at this resolution, and a model built on trades alone is modelling a few percent of the observable process.</p><p>The snippet does not assume the mix; it derives it. A single price level is run as three competing Poisson clocks: limit orders arrive at thirty per second, each resting order is cancelled at rate three per second, and market orders arrive at one and a half per second. Over an hour of simulated tape the model produces 39.8 messages per trade, with trades making up 2.51% of all messages, and a mean depth at the touch of 9.50 orders that matches the analytic prediction that depth settles where the add rate equals the death rate.</p><p>Those three numbers are the stylised facts every model in this course has to respect. Depth at the touch is an equilibrium between arrival and cancellation, not a fixed quantity. Most information in the book arrives as a cancellation, which is exactly the event that carries no print and therefore no trade record. And the touch depletes rarely — twenty-three times an hour here — so price changes are the tail of the queue process, not its typical behaviour.</p><p>A desk cares because feed-handler capacity, storage cost and the entire signal set for short-horizon prediction are sized by the message rate, not the trade rate.</p>",
          "formula": "\\bar{Q} = \\frac{\\lambda - \\mu}{\\theta}, \\qquad \\frac{\\text{messages}}{\\text{trades}} = \\frac{\\lambda + \\theta\\bar{Q} + \\mu}{\\mu}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# A single price level as three competing Poisson clocks. Nothing about the\n# message mix is assumed: adds, cancels and trades are all EMERGENT counts.\nrng = np.random.default_rng(7)\nlam, theta, mu = 30.0, 3.0, 1.5      # add/s, cancel/s per resting order, market order/s\nT = 3600.0\n\nt, Q = 0.0, 10\nadds = cancels = trades = depletions = 0\narea = 0.0                            # time-weighted depth, for the mean\n\nwhile t < T:\n    rate_c = theta * Q\n    total = lam + rate_c + mu\n    dt = rng.exponential(1.0 / total)\n    area += Q * min(dt, T - t)\n    t += dt\n    if t >= T:\n        break\n    u = rng.random() * total\n    if u < lam:\n        Q += 1\n        adds += 1\n    elif u < lam + rate_c:\n        Q -= 1\n        cancels += 1\n    else:\n        trades += 1\n        if Q > 0:\n            Q -= 1\n        else:\n            depletions += 1           # nothing left: the touch has to move\n    if Q == 0:\n        depletions += 1\n        Q = 1                         # a new best quote appears at the touch\n\nmsgs = adds + cancels + trades\nprint(\"one price level, %.0f s of simulated tape\" % T)\nprint(\"   adds      %7d  (%5.1f/s)\" % (adds, adds / T))\nprint(\"   cancels   %7d  (%5.1f/s)\" % (cancels, cancels / T))\nprint(\"   trades    %7d  (%5.2f/s)\" % (trades, trades / T))\nprint(\"   messages  %7d\" % msgs)\nprint(\"\")\nprint(\"messages per trade            %6.1f\" % (msgs / trades))\nprint(\"cancel-to-add ratio           %6.2f\" % (cancels / adds))\nprint(\"share of messages that trade  %6.2f%%\" % (100.0 * trades / msgs))\nprint(\"mean depth at the touch       %6.2f orders\" % (area / T))\nprint(\"queue depletions per hour     %6d\" % depletions)\nprint(\"\")\nprint(\"balance check: adds - cancels - trades = %d, net depth change = %d\"\n      % (adds - cancels - trades, Q - 10 - depletions))\n",
            "output": "one price level, 3600 s of simulated tape\n   adds       107807  ( 29.9/s)\n   cancels    102417  ( 28.4/s)\n   trades       5413  ( 1.50/s)\n   messages   215637\n\nmessages per trade              39.8\ncancel-to-add ratio             0.95\nshare of messages that trade    2.51%\nmean depth at the touch         9.50 orders\nqueue depletions per hour         23\n\nbalance check: adds - cancels - trades = -23, net depth change = -23"
          }
        }
      ],
      "widget": {
        "type": "orderbook",
        "title": "A penny-tick book: depth, imbalance and what a sweep costs",
        "params": {
          "levels": 8,
          "spread": 1,
          "seed": 37601,
          "mid": 40.005,
          "tick": 0.01,
          "size": 900,
          "decay": 0.18,
          "imbalance": 0.0
        }
      },
      "pitfalls": [
        "Assuming the aggressor's limit price is the fill price. It is not: execution happens at the resting order's price, which is why a crossing limit order can fill better than its own limit.",
        "Comparing quoted spreads across venues with different fee schedules. A one-cent spread on a maker-taker venue and a one-cent spread on an inverted venue are different all-in prices for both sides.",
        "Treating depth at the touch as a fixed number. It is the stationary point of an arrival-cancellation balance, so it moves with the cancellation rate even when nothing about liquidity demand has changed.",
        "Building a signal library from trades only. Cancellations are the majority of the tape and they carry the information that the print does not."
      ],
      "check": [
        {
          "q": "A market buy for 600 shares hits an ask level holding two orders, 300 shares posted first and 500 posted later, both at 100.02. Under price-time priority, what fills?",
          "options": [
            "300 from the first order and 300 from the second, both at 100.02",
            "600 from the larger order, since it can fill the whole thing",
            "300 and 300, pro-rata across the two orders",
            "600 from the first order, which is filled beyond its size"
          ],
          "answer": 0,
          "why": "Time priority fills the earlier order completely before touching the later one, and both print at the resting price; pro-rata is a different allocation rule used by some futures venues, not FIFO."
        },
        {
          "q": "A one-cent tick binds on a stock whose latent competitive spread is about 0.4 cents. What does competition do instead of narrowing the spread?",
          "options": [
            "It lengthens the queue at the touch until the marginal slot is worth nothing",
            "It narrows the spread to sub-penny increments off-exchange only",
            "It raises the cancellation rate until depth falls to zero",
            "Nothing — a binding tick removes competition from the market"
          ],
          "answer": 0,
          "why": "A pinned spread leaves a rent per share, and with FIFO allocation free entry dissipates that rent in time priority, which is why tick-constrained names have deep, slow touches."
        },
        {
          "q": "On a one-cent spread with a thirty-mil taker fee, the taker's all-in cost per share is roughly what multiple of the quoted half-spread?",
          "options": [
            "1.0",
            "1.2",
            "1.6",
            "3.0"
          ],
          "answer": 2,
          "why": "The half-spread is 0.5 cents and the fee is 0.3 cents, so all-in is 0.8 cents, or 1.6 times the half-spread; the fee alone is 60% of it."
        },
        {
          "q": "In the single-level Poisson model with add rate 30/s, per-order cancel rate 3/s and market-order rate 1.5/s, mean depth at the touch is about 9.5 orders. Doubling the cancellation rate to 6/s does what?",
          "options": [
            "Roughly halves mean depth, to about 4.75 orders",
            "Leaves depth unchanged, because arrivals are unchanged",
            "Doubles depth, since more turnover means more orders",
            "Drives depth to zero, because cancellation now dominates"
          ],
          "answer": 0,
          "why": "Depth settles where the add rate equals the death rate, so it is (lambda minus mu) over theta and is inversely proportional to the cancellation rate."
        }
      ],
      "n": 1
    },
    {
      "title": "The book as a stochastic process: birth-death queues and first passage",
      "topics": [
        "zero-intelligence order flow",
        "the Cont-Stoikov-Talreja model",
        "stationary depth by detailed balance",
        "the hump-shaped depth profile",
        "first-passage probabilities at the touch",
        "queue imbalance as a directional signal",
        "what zero intelligence cannot reproduce"
      ],
      "concepts": [
        {
          "name": "One price level is a birth-death queue with a closed-form stationary law",
          "explain": "<p>Strip the book down to a single price level and it becomes the simplest interesting stochastic process in the subject. Limit orders arrive at rate lambda. Each resting order is cancelled at rate theta, so the total cancellation rate is theta times the current depth. Market orders arrive at rate mu and consume one unit from the touch. Depth is therefore a birth-death chain with a constant birth rate and a death rate that is affine in the state.</p><p>Because the chain is a birth-death chain, detailed balance gives the stationary distribution in closed form as a product of ratios, with no simulation required. Two things are worth noticing in the result. The mean depth is not the naive lambda over theta that you would get by ignoring market orders — that answer is 12.000 here against a true 6.156. Nor is it exactly the fluid approximation that sets the birth rate equal to the death rate, which gives 6.000; the true mean is slightly higher because the death rate is convex in nothing but the state is bounded below at zero, and that reflection pushes the mean up.</p><p>The quantity that actually matters for trading is the last one in the first block: the probability that the level is empty, 2.60% here. That is the probability the touch is about to move, and it is the state in which a resting order either gets filled or gets run over. The simulated occupancy matches the exact law to within 0.0019 across all states, which is the check that the algebra is right.</p><p>A desk cares because this distribution, not a single average depth number, is what determines how often a quote at the touch is exposed and how long a queue takes to clear.</p>",
          "formula": "\\pi(q) \\propto \\prod_{j=1}^{q} \\frac{\\lambda}{\\theta j + \\mu}, \\qquad q = 0, 1, 2, \\dots",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# One price level, exactly. Birth rate lam (limit orders arrive), death rate\n# theta*q + mu (each resting order can cancel, plus market orders eat the\n# touch). Detailed balance gives the stationary law in closed form:\n#     pi(q) proportional to prod_{j=1..q} lam / (theta*j + mu)\nLAM, THETA, MU, QMAX = 6.0, 0.5, 3.0, 60\n\nw = np.ones(QMAX + 1)\nfor q in range(1, QMAX + 1):\n    w[q] = w[q - 1] * LAM / (THETA * q + MU)\npi = w / w.sum()\nq = np.arange(QMAX + 1)\nmean = float((pi * q).sum())\nsd = float(np.sqrt((pi * (q - mean) ** 2).sum()))\n\nprint(\"lam=%.1f  theta=%.1f  mu=%.1f\" % (LAM, THETA, MU))\nprint(\"exact stationary depth:  mean %.3f   sd %.3f   P(level empty) %.4f\"\n      % (mean, sd, pi[0]))\nprint(\"naive guess (lam-mu)/theta = %.3f   ignoring mu, lam/theta = %.3f\"\n      % ((LAM - MU) / THETA, LAM / THETA))\nprint(\"\")\nprint(\" q   pi(q)     cumulative\")\nfor k in range(0, 16):\n    print(\"%2d   %.4f    %.4f  %s\" % (k, pi[k], pi[:k + 1].sum(),\n                                      \"#\" * int(round(pi[k] * 200))))\n\n# Simulation check: time-weighted occupancy of the same level.\nrng = np.random.default_rng(2)\nT, t, qq = 20000.0, 0.0, 6\nocc = np.zeros(QMAX + 1)\nwhile t < T:\n    rate = LAM + THETA * qq + MU\n    dt = rng.exponential(1.0 / rate)\n    occ[qq] += min(dt, T - t)\n    t += dt\n    qq = qq + 1 if rng.random() * rate < LAM else max(0, qq - 1)\nocc /= occ.sum()\nprint(\"\\nsimulated vs exact, first six states:\")\nprint(\"   q      \" + \"\".join(\"%8d\" % k for k in range(6)))\nprint(\"   exact  \" + \"\".join(\"%8.4f\" % pi[k] for k in range(6)))\nprint(\"   sim    \" + \"\".join(\"%8.4f\" % occ[k] for k in range(6)))\nprint(\"   max absolute difference over all states: %.4f\" % np.abs(occ - pi).max())\n\n# Where limit orders are PLACED: the power-law rate profile k/i**alpha.\nK, ALPHA, DMAX = 12.0, 0.9, 12\nlam_i = K / np.arange(1, DMAX + 1) ** ALPHA\nprint(\"\\nplacement intensity k/i^alpha (k=%.1f, alpha=%.1f):\" % (K, ALPHA))\nprint(\"   distance  \" + \"\".join(\"%7d\" % i for i in range(1, 7)))\nprint(\"   rate      \" + \"\".join(\"%7.2f\" % r for r in lam_i[:6]))\nprint(\"   share of all limit orders inside 3 ticks: %.1f%%\"\n      % (100 * lam_i[:3].sum() / lam_i.sum()))\n",
            "output": "lam=6.0  theta=0.5  mu=3.0\nexact stationary depth:  mean 6.156   sd 3.323   P(level empty) 0.0260\nnaive guess (lam-mu)/theta = 6.000   ignoring mu, lam/theta = 12.000\n\n q   pi(q)     cumulative\n 0   0.0260    0.0260  #####\n 1   0.0446    0.0706  #########\n 2   0.0669    0.1375  #############\n 3   0.0892    0.2267  ##################\n 4   0.1070    0.3337  #####################\n 5   0.1167    0.4504  #######################\n 6   0.1167    0.5672  #######################\n 7   0.1078    0.6749  ######################\n 8   0.0924    0.7673  ##################\n 9   0.0739    0.8412  ###############\n10   0.0554    0.8966  ###########\n11   0.0391    0.9357  ########\n12   0.0261    0.9618  #####\n13   0.0165    0.9783  ###\n14   0.0099    0.9882  ##\n15   0.0056    0.9938  #\n\nsimulated vs exact, first six states:\n   q             0       1       2       3       4       5\n   exact    0.0260  0.0446  0.0669  0.0892  0.1070  0.1167\n   sim      0.0246  0.0431  0.0658  0.0894  0.1089  0.1182\n   max absolute difference over all states: 0.0019\n\nplacement intensity k/i^alpha (k=12.0, alpha=0.9):\n   distance        1      2      3      4      5      6\n   rate        12.00   6.43   4.46   3.45   2.82   2.39\n   share of all limit orders inside 3 ticks: 55.4%"
          }
        },
        {
          "name": "Zero-intelligence flow already produces a hump-shaped depth profile",
          "explain": "<p>The Cont-Stoikov-Talreja model extends the single level to the whole grid and adds one empirical ingredient: limit orders are placed at a distance from the opposite best quote with an intensity that decays as a power of that distance. Nobody in the model forecasts anything, nobody responds to anyone else, and there is no notion of information. It is deliberately a straw man — and it reproduces more than it has any right to.</p><p>The average depth profile is the headline. Depth does not decline monotonically away from the touch; it rises, peaks a couple of ticks in, and only then decays. In the run below it peaks two ticks behind the touch at 17.29 orders against 12.21 at the touch itself. The mechanism is pure survivorship: the touch is the only place market orders eat, so orders there die faster, while orders deeper in are protected but still accumulate. The same run spends 98.9% of its time at a one-tick spread, which is roughly what a liquid penny-tick name does.</p><p>The model also gives you the language for everything that follows: a state, a set of intensities, and observable functionals of the state. When week 7 writes a Hamilton-Jacobi-Bellman equation, this is the controlled process the equation is written against.</p><p>A research team cares because the hump is a free falsification test: any book model that predicts maximum depth exactly at the touch is contradicted by data that a straw-man model already gets right.</p>",
          "formula": "\\lambda(i) = \\frac{k}{i^{\\alpha}}, \\qquad i = 1, \\dots, D \\ \\text{ticks from the opposite best}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# Cont-Stoikov-Talreja zero-intelligence book. Signed depth on a tick grid:\n# X[p] > 0 asks, X[p] < 0 bids. Limit orders arrive at distance i from the\n# OPPOSITE best with rate k/i**alpha; cancels at theta per resting order;\n# market orders at mu eat the touch. Nobody in this model knows anything.\nrng = np.random.default_rng(37601)\n\nL, DMAX = 140, 12\nK, ALPHA, THETA, MU = 12.0, 0.9, 0.35, 8.0\nlam = K / np.arange(1, DMAX + 1) ** ALPHA\nclam = np.cumsum(lam)\nLAM = lam.sum()\n\nX = np.zeros(L, dtype=np.int64)\nX[L // 2 - DMAX:L // 2] = -4\nX[L // 2:L // 2 + DMAX] = 4\npb, pa = L // 2 - 1, L // 2\nnord = int(np.abs(X).sum())\n\nprof = np.zeros(DMAX)\nwsum = 0.0\nsp_time = np.zeros(8)                      # time spent at spread 1..8 ticks\nn_events = 150_000\nU = rng.random(n_events)                   # one draw for the event type\nV = rng.random(n_events)                   # one draw for the placement/target\n\nfor step in range(n_events):\n    if pb < DMAX + 2 or pa > L - DMAX - 3 or pa <= pb:\n        break\n    total = 2 * LAM + THETA * nord + 2 * MU\n    dt = 1.0 / total\n    # profile by distance from own best, both sides, vectorised\n    prof += dt * (np.maximum(0, -X[pb - DMAX + 1:pb + 1][::-1])\n                  + np.maximum(0, X[pa:pa + DMAX])) / 2.0\n    wsum += dt\n    sp_time[min(pa - pb, 8) - 1] += dt\n\n    u = U[step] * total\n    if u < LAM:                                        # limit BUY at pa - i\n        i = 1 + int(np.searchsorted(clam, V[step] * LAM))\n        p = pa - min(i, DMAX)\n        if X[p] <= 0:\n            X[p] -= 1\n            nord += 1\n            if p > pb:\n                pb = p\n    elif u < 2 * LAM:                                  # limit SELL at pb + i\n        i = 1 + int(np.searchsorted(clam, V[step] * LAM))\n        p = pb + min(i, DMAX)\n        if X[p] >= 0:\n            X[p] += 1\n            nord += 1\n            if p < pa:\n                pa = p\n    elif u < 2 * LAM + THETA * nord:                   # cancel a uniform order\n        lo, hi = pb - DMAX - 1, pa + DMAX + 2\n        w = np.abs(X[lo:hi])\n        p = lo + int(np.searchsorted(np.cumsum(w), V[step] * w.sum()))\n        if X[p] != 0:\n            X[p] -= 1 if X[p] > 0 else -1\n            nord -= 1\n            while X[pb] >= 0 and pb > 1:\n                pb -= 1\n            while X[pa] <= 0 and pa < L - 2:\n                pa += 1\n    elif u < 2 * LAM + THETA * nord + MU:              # market BUY eats the ask\n        X[pa] -= 1\n        nord -= 1\n        while X[pa] <= 0 and pa < L - 2:\n            pa += 1\n    else:                                              # market SELL eats the bid\n        X[pb] += 1\n        nord -= 1\n        while X[pb] >= 0 and pb > 1:\n            pb -= 1\n\nprof /= wsum\nprint(\"zero-intelligence book: %d events, k=%.1f alpha=%.1f theta=%.2f mu=%.1f\"\n      % (step + 1, K, ALPHA, THETA, MU))\nprint(\"\")\nprint(\"distance from own best (ticks)   mean depth (orders)\")\nfor i, d in enumerate(prof, start=1):\n    print(\"%23d          %8.2f  %s\" % (i, d, \"#\" * int(round(d * 3))))\npeak = int(np.argmax(prof)) + 1\nprint(\"\")\nprint(\"depth peaks %d tick(s) behind the touch, not at it: %.2f vs %.2f at the touch\"\n      % (peak, prof[peak - 1], prof[0]))\nsp_time /= sp_time.sum()\nprint(\"share of time at a 1-tick spread %.1f%%, at 2 ticks %.1f%%\"\n      % (100 * sp_time[0], 100 * sp_time[1]))\n",
            "output": "zero-intelligence book: 150000 events, k=12.0 alpha=0.9 theta=0.35 mu=8.0\n\ndistance from own best (ticks)   mean depth (orders)\n                      1             12.21  #####################################\n                      2             17.29  ####################################################\n                      3             12.78  ######################################\n                      4              9.91  ##############################\n                      5              8.43  #########################\n                      6              6.92  #####################\n                      7              5.88  ##################\n                      8              5.35  ################\n                      9              4.68  ##############\n                     10              4.36  #############\n                     11              3.93  ############\n                     12              3.49  ##########\n\ndepth peaks 2 tick(s) behind the touch, not at it: 17.29 vs 12.21 at the touch\nshare of time at a 1-tick spread 98.9%, at 2 ticks 1.1%"
          }
        },
        {
          "name": "First passage: which queue empties first is the imbalance signal",
          "explain": "<p>Now ask the question a passive trader actually cares about. The bid holds b units and the ask holds a units. Both queues gain and lose. Which one reaches zero first? If the ask empties first the mid ticks up; if the bid empties first it ticks down. This is a first-passage problem for a two-dimensional birth-death chain, and on a truncated grid it is a linear system you can solve exactly.</p><p>The answer is the theoretical ancestor of every order-book-imbalance signal in production. With a stationary depth of six per side, a bid of nine against an ask of three — an imbalance of plus one half — gives a 64.8% probability that the next tick is up. Push it to eleven against one and the probability reaches 82.6%. Regressing the exact probability on queue imbalance while holding total depth fixed gives a slope of 0.3113 with an R-squared of 0.9947, so the relationship is very nearly linear near balance. That is why a linear imbalance feature works as well as it does in practice despite having no obvious right to.</p><p>Two checks keep the computation honest. Symmetry forces the probability to be exactly 0.5 on the diagonal, and it is, to four decimals. An independent simulation from the nine-against-three state returns 0.6489 against the exact 0.6482, with every trial confirmed absorbed rather than truncated.</p><p>A desk cares because this is the cheapest defensible answer to 'should I lift the offer now or wait', and because the same solve prices the queue slot in week 4.</p>",
          "formula": "u(b,a) = \\frac{\\lambda\\, u(b{+}1,a) + (\\theta b {+} \\mu)\\, u(b{-}1,a) + \\lambda\\, u(b,a{+}1) + (\\theta a {+} \\mu)\\, u(b,a{-}1)}{2\\lambda + \\theta(a{+}b) + 2\\mu}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# Which side of the touch empties first? Two birth-death queues race. Bid depth\n# b and ask depth a each gain at rate lam and lose at rate theta*q + mu.\n# Absorption at a=0 means the mid ticks UP, at b=0 it ticks DOWN. The function\n# u(b,a) = P(ask empties first) solves a linear system EXACTLY -- no simulation.\nLAM, THETA, MU, N = 6.0, 0.5, 3.0, 20\n\n\ndef idx(b, a):\n    return (b - 1) * N + (a - 1)\n\n\nA = np.zeros((N * N, N * N))\nrhs = np.zeros(N * N)\nfor b in range(1, N + 1):\n    for a in range(1, N + 1):\n        r_ba, r_bd = (LAM if b < N else 0.0), THETA * b + MU\n        r_aa, r_ad = (LAM if a < N else 0.0), THETA * a + MU\n        k = idx(b, a)\n        A[k, k] = r_ba + r_bd + r_aa + r_ad\n        if b < N:\n            A[k, idx(b + 1, a)] -= r_ba\n        if b > 1:\n            A[k, idx(b - 1, a)] -= r_bd       # b-1 = 0 -> u = 0, term vanishes\n        if a < N:\n            A[k, idx(b, a + 1)] -= r_aa\n        if a > 1:\n            A[k, idx(b, a - 1)] -= r_ad\n        else:\n            rhs[k] += r_ad * 1.0               # a-1 = 0 -> u = 1\n\nu = np.linalg.solve(A, rhs).reshape(N, N)\nP = lambda b, a: u[b - 1, a - 1]               # noqa: E731\n\nprint(\"lam=%.1f theta=%.1f mu=%.1f  stationary depth (lam-mu)/theta = %.1f\"\n      % (LAM, THETA, MU, (LAM - MU) / THETA))\nprint(\"\")\nprint(\"  bid  ask   imbalance   P(mid ticks UP first)\")\nfor b, a in [(11, 1), (10, 2), (9, 3), (8, 4), (7, 5), (6, 6),\n             (5, 7), (4, 8), (3, 9), (2, 10), (1, 11)]:\n    print(\"%5d %4d   %+9.2f   %20.4f\" % (b, a, (b - a) / (b + a), P(b, a)))\n\nprint(\"\\nsymmetry check, u(q,q) must be exactly 0.5:\")\nprint(\"   \" + \"  \".join(\"u(%d,%d)=%.4f\" % (q, q, P(q, q)) for q in (2, 6, 12, 19)))\n\n# Near balance the probability is close to linear in queue imbalance: this is\n# the theoretical shape of the order-book-imbalance signal used in week 3.\nimb, prob = [], []\nfor b in range(2, 11):\n    a = 12 - b\n    imb.append((b - a) / (b + a))\n    prob.append(P(b, a))\nimb, prob = np.array(imb), np.array(prob)\nslope, icept = np.polyfit(imb, prob, 1)\nfit = slope * imb + icept\nrsq = 1 - np.sum((prob - fit) ** 2) / np.sum((prob - prob.mean()) ** 2)\nprint(\"\\nlinear fit of P(up) on imbalance, total depth held at 12:\")\nprint(\"   slope %.4f   intercept %.4f   R^2 %.4f\" % (slope, icept, rsq))\n\n# Independent check: simulate every trial in parallel and report how many\n# actually absorbed, so a truncated run cannot masquerade as an answer.\nrng = np.random.default_rng(11)\nb0, a0, trials = 9, 3, 60000\nbq = np.full(trials, b0, dtype=np.int64)\naq = np.full(trials, a0, dtype=np.int64)\nlive = np.ones(trials, dtype=bool)\nup = np.zeros(trials, dtype=bool)\nfor _ in range(20000):\n    if not live.any():\n        break\n    bb, aa = bq[live], aq[live]\n    r0 = np.where(bb < N, LAM, 0.0)\n    r1 = THETA * bb + MU\n    r2 = np.where(aa < N, LAM, 0.0)\n    r3 = THETA * aa + MU\n    x = rng.random(bb.size) * (r0 + r1 + r2 + r3)\n    bq[live] = bb + np.where(x < r0, 1, np.where(x < r0 + r1, -1, 0))\n    aq[live] = aa + np.where(x < r0 + r1, 0, np.where(x < r0 + r1 + r2, 1, -1))\n    hit_up = live & (aq == 0)\n    up |= hit_up\n    live &= ~(hit_up | (bq == 0))\nprint(\"\\nsimulation from (b,a)=(%d,%d): %.4f  vs exact %.4f   (%.2f%% absorbed)\"\n      % (b0, a0, up.mean(), P(b0, a0), 100 * (1 - live.mean())))\n",
            "output": "lam=6.0 theta=0.5 mu=3.0  stationary depth (lam-mu)/theta = 6.0\n\n  bid  ask   imbalance   P(mid ticks UP first)\n   11    1       +0.83                 0.8262\n   10    2       +0.67                 0.7209\n    9    3       +0.50                 0.6482\n    8    4       +0.33                 0.5920\n    7    5       +0.17                 0.5442\n    6    6       +0.00                 0.5000\n    5    7       -0.17                 0.4558\n    4    8       -0.33                 0.4080\n    3    9       -0.50                 0.3518\n    2   10       -0.67                 0.2791\n    1   11       -0.83                 0.1738\n\nsymmetry check, u(q,q) must be exactly 0.5:\n   u(2,2)=0.5000  u(6,6)=0.5000  u(12,12)=0.5000  u(19,19)=0.5000\n\nlinear fit of P(up) on imbalance, total depth held at 12:\n   slope 0.3113   intercept 0.5000   R^2 0.9947\n\nsimulation from (b,a)=(9,3): 0.6489  vs exact 0.6482   (100.00% absorbed)"
          }
        },
        {
          "name": "Where zero intelligence fails: order flow is long-memory and prices are not",
          "explain": "<p>Every model this week assumes market-order signs are independent. That assumption is not approximately true; it is spectacularly false, and understanding why is the bridge to the rest of the course. Large parent orders are split into many same-sign children, and parent sizes are heavy-tailed, so the sign series inherits a slowly decaying positive autocorrelation. In the comparison below, independent signs have an autocorrelation indistinguishable from zero at every lag, while a split-flow series built from Pareto-tailed parent sizes still has autocorrelation 0.178 at lag 200.</p><p>That creates a genuine puzzle, usually called the diffusivity puzzle. Cumulative signed flow is enormously trending: its variance ratio at a 200-trade horizon is 60.21 rather than 1. If price impact were permanent and linear, price would be a constant times cumulative flow, so price would inherit that variance ratio. Real equity prices have variance ratios close to one — they are nearly martingales.</p><p>Something therefore has to give, and the resolution is not that order flow is actually unpredictable. It is that impact decays: the price response to a trade fades, so predictable flow does not produce predictable price. That is the propagator model of week 5, and this snippet is the measurement that forces it.</p><p>A research team cares because any short-horizon alpha built on signed flow has to explain why the predictability of the flow does not translate into predictability of the price, and the answer determines whether the signal is tradeable or already paid for.</p>",
          "formula": "\\mathrm{VR}(k) = \\frac{\\operatorname{Var}\\!\\left(\\sum_{i=1}^{k}\\epsilon_i\\right)}{k\\operatorname{Var}(\\epsilon)} \\;=\\; 1 + 2\\sum_{L=1}^{k-1}\\left(1 - \\tfrac{L}{k}\\right)\\rho_{\\epsilon}(L)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# What zero intelligence gets WRONG. In the model of this week the sign of each\n# market order is independent. In real tapes it is not: metaorders are split\n# into many same-sign children, so trade signs are positively autocorrelated\n# for hundreds of lags. Compare the two flows on identical machinery.\nrng = np.random.default_rng(37601)\nn = 400_000\n\n\ndef acf(x, lags):\n    x = x - x.mean()\n    d = np.dot(x, x)\n    return [float(np.dot(x[:n - L], x[L:]) / d) for L in lags]\n\n\nzi = rng.choice(np.array([-1.0, 1.0]), size=n)          # zero intelligence\n\n# Metaorder splitting: Pareto-tailed parent sizes, each one sign.\nsizes = (1 + rng.pareto(1.2, size=n)).astype(np.int64)\nsgn = rng.choice(np.array([-1.0, 1.0]), size=n)\nsplit = np.repeat(sgn, np.minimum(sizes, 4000))[:n]\n\nlags = [1, 2, 5, 10, 20, 50, 100, 200]\na_zi, a_sp = acf(zi, lags), acf(split, lags)\nprint(\"autocorrelation of the trade-sign series\")\nprint(\"   lag        \" + \"\".join(\"%8d\" % L for L in lags))\nprint(\"   zero-intel \" + \"\".join(\"%8.4f\" % v for v in a_zi))\nprint(\"   split flow \" + \"\".join(\"%8.4f\" % v for v in a_sp))\nprint(\"\")\nprint(\"mean metaorder length %.2f trades, longest %d\"\n      % (np.minimum(sizes, 4000).mean(), np.minimum(sizes, 4000).max()))\n\n\ndef var_ratio(x, k):\n    m = (len(x) // k) * k\n    blocks = x[:m].reshape(-1, k).sum(axis=1)\n    return float(blocks.var() / (k * x[:m].var()))\n\n\nprint(\"\\nvariance ratio of CUMULATIVE signed flow (1.0 = uncorrelated)\")\nprint(\"   block size  \" + \"\".join(\"%9d\" % k for k in (10, 50, 200, 1000)))\nprint(\"   zero-intel  \" + \"\".join(\"%9.2f\" % var_ratio(zi, k) for k in (10, 50, 200, 1000)))\nprint(\"   split flow  \" + \"\".join(\"%9.2f\" % var_ratio(split, k) for k in (10, 50, 200, 1000)))\n\nprint(\"\\nIf impact were PERMANENT and linear, price = lambda * cumulative flow,\")\nprint(\"so the price variance ratio would equal the flow variance ratio: %.2f at\"\n      % var_ratio(split, 200))\nprint(\"a 200-trade horizon. Measured equity price variance ratios sit near 1.0,\")\nprint(\"so impact cannot be permanent and linear. Week 5 fixes this.\")\n",
            "output": "autocorrelation of the trade-sign series\n   lag               1       2       5      10      20      50     100     200\n   zero-intel   0.0032 -0.0003 -0.0010 -0.0017 -0.0011 -0.0032 -0.0012  0.0012\n   split flow   0.7790  0.6823  0.5520  0.4542  0.3722  0.2846  0.2213  0.1776\n\nmean metaorder length 4.53 trades, longest 4000\n\nvariance ratio of CUMULATIVE signed flow (1.0 = uncorrelated)\n   block size         10       50      200     1000\n   zero-intel       1.01     1.01     0.95     0.94\n   split flow       6.63    22.52    60.21   170.28\n\nIf impact were PERMANENT and linear, price = lambda * cumulative flow,\nso the price variance ratio would equal the flow variance ratio: 60.21 at\na 200-trade horizon. Measured equity price variance ratios sit near 1.0,\nso impact cannot be permanent and linear. Week 5 fixes this."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Stationary depth law and the zero-intelligence depth profile",
        "params": {
          "xlab": "Depth in orders (series 1) / ticks from own best (series 2)",
          "ylab": "Probability or mean depth",
          "log": false,
          "series": [
            {
              "name": "stationary law pi(q)",
              "x": [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
              ],
              "y": [
                0.026,
                0.0446,
                0.0669,
                0.0892,
                0.107,
                0.1167,
                0.1167,
                0.1078,
                0.0924,
                0.0739,
                0.0554,
                0.0391,
                0.0261,
                0.0165,
                0.0099,
                0.0056
              ]
            },
            {
              "name": "mean depth profile / 100",
              "x": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12
              ],
              "y": [
                0.1221,
                0.1729,
                0.1278,
                0.0991,
                0.0843,
                0.0692,
                0.0588,
                0.0535,
                0.0468,
                0.0436,
                0.0393,
                0.0349
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Estimating mean depth as the arrival rate over the cancellation rate. That ignores market orders entirely and overstates depth by a factor of two in the calibration used here.",
        "Reading the hump in the depth profile as evidence of strategic placement. A model in which nobody is strategic produces it, purely because the touch is the only place trades consume depth.",
        "Reporting a simulated first-passage probability without reporting the share of paths that actually absorbed. A truncated run silently assigns every unfinished path to one outcome, which is how a 0.65 probability turns into 0.21.",
        "Carrying the independent-order-flow assumption into anything empirical. Signed flow has autocorrelation out to hundreds of lags, so standard errors computed as if trades were independent are far too small."
      ],
      "check": [
        {
          "q": "In the single-level birth-death model with arrival rate lambda, per-order cancel rate theta and market-order rate mu, the stationary probability of depth q is proportional to which product?",
          "options": [
            "The product over j of lambda divided by (theta j plus mu)",
            "The product over j of lambda divided by theta j",
            "A Poisson weight with mean lambda over theta",
            "A geometric weight with ratio mu over lambda"
          ],
          "answer": 0,
          "why": "Detailed balance for a birth-death chain divides the birth rate by the state-dependent death rate at each step, and here the death rate includes both cancellation and market orders."
        },
        {
          "q": "The zero-intelligence simulation puts maximum average depth two ticks behind the touch rather than at it. Why?",
          "options": [
            "Market orders only consume depth at the touch, so orders there have the shortest lifetime",
            "Limit orders are placed most often two ticks away from the opposite best",
            "Cancellation rates are assumed to fall with distance from the touch",
            "The tick grid forces depth away from the best quote"
          ],
          "answer": 0,
          "why": "The placement intensity is strictly decreasing in distance and cancellation is state-independent per order, so the only asymmetry left is that the touch is the only level exposed to market orders."
        },
        {
          "q": "With stationary depth of six per side, the exact probability that the mid ticks up before it ticks down when the bid holds nine and the ask holds three is about 0.65. Regressed on queue imbalance at fixed total depth, the relationship has an R-squared of about",
          "options": [
            "0.42",
            "0.75",
            "0.99",
            "0.12"
          ],
          "answer": 2,
          "why": "The fit gives 0.9947, which is why a linear imbalance feature captures nearly all of the model-implied signal near balance."
        },
        {
          "q": "Cumulative signed order flow has a variance ratio of about 60 at a 200-trade horizon, while equity prices have variance ratios near 1. What does that rule out?",
          "options": [
            "Permanent linear price impact of individual trades",
            "Any positive autocorrelation in trade signs",
            "The existence of metaorder splitting",
            "The use of variance ratios on tick data"
          ],
          "answer": 0,
          "why": "Under permanent linear impact price would be proportional to cumulative flow and would inherit its variance ratio, so impact must decay for both facts to hold at once."
        }
      ],
      "n": 2
    },
    {
      "title": "Price formation: the efficient price, the microprice and lambda",
      "topics": [
        "efficient price plus microstructure noise",
        "the Roll effective-spread estimator",
        "the microprice and its gain",
        "order-flow imbalance regressions",
        "the impact coefficient lambda",
        "trade signing and the Lee-Ready rules",
        "attenuation from measurement error"
      ],
      "concepts": [
        {
          "name": "The Roll model: the spread is visible in the autocovariance of returns",
          "explain": "<p>The organising decomposition of the whole subject is that an observed transaction price is an unobserved efficient price plus a contamination that comes from the mechanism. In the Roll model the contamination is exactly the bid-ask bounce: the aggressor pays the far side, so the observed price sits a half-spread above or below the efficient price depending on which way the trade went. Because the bounce alternates while the efficient price does not, the first autocovariance of transaction returns is minus the square of the half-spread, and the effective spread becomes recoverable from a tape with no quote data in it at all.</p><p>The snippet confirms the identity to within half a percent on half a million trades. It then does the more useful thing and breaks it. Roll's derivation needs trade signs to be serially uncorrelated, and week 2 showed they are not. As sign autocorrelation rises from 0.17 to 0.78, the estimated half-spread falls from 85% of its true value to 35%. The bounce no longer alternates, so less of it shows up in the autocovariance, and the estimator degrades into a lower bound.</p><p>The general lesson is the one this course keeps returning to. Microstructure noise is not a nuisance to be averaged away; it has structure, and its structure is informative about the mechanism. Estimating the properties of that noise carefully — and estimating volatility in spite of it — is the subject of FINM 34600, which treats exactly this observed-equals-efficient-plus-noise decomposition as a statistical problem rather than as a trading one.</p><p>A desk cares because the effective spread estimated off the tape is the number that appears in every transaction-cost report, and it is biased low in precisely the names that trade in long directional runs.</p>",
          "formula": "p_t = m_t + c\\,q_t, \\quad \\operatorname{Cov}(\\Delta p_t, \\Delta p_{t-1}) = -c^{2} \\ \\ \\text{when } q_t \\text{ is i.i.d.}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# The Roll model. Observed price = efficient price + half-spread * trade sign.\n#   dp_t = u_t + c (q_t - q_{t-1})   =>   Cov(dp_t, dp_{t-1}) = -c^2\n# so the effective half-spread is recoverable from the tape alone, with no\n# quote data at all -- PROVIDED trade signs are serially uncorrelated.\nrng = np.random.default_rng(303)\nn = 500_000\nc_true = 0.0050          # half a cent, i.e. a one-cent effective spread\nsig_u = 0.0040           # efficient-price innovation per trade\n\n\ndef roll(sig, q):\n    u = rng.normal(0.0, sig, len(q))\n    m = np.cumsum(u)\n    p = m + c_true * q\n    dp = np.diff(p)\n    cov1 = np.cov(dp[1:], dp[:-1])[0, 1]\n    return cov1, (np.sqrt(-cov1) if cov1 < 0 else float(\"nan\")), dp\n\n\nq_iid = rng.choice(np.array([-1.0, 1.0]), size=n)\ncov1, c_hat, dp = roll(sig_u, q_iid)\nprint(\"Roll model, independent trade signs\")\nprint(\"   true half-spread      %.5f\" % c_true)\nprint(\"   first autocovariance  %.3e   (theory -c^2 = %.3e)\" % (cov1, -c_true ** 2))\nprint(\"   estimated half-spread %.5f   error %+.2f%%\"\n      % (c_hat, 100 * (c_hat / c_true - 1)))\nprint(\"   return autocorrelation lag 1  %+.4f\" % (cov1 / dp.var()))\n\n# Now the same estimator on AUTOCORRELATED signs, as real metaorder splitting\n# produces. The bounce partly cancels and the estimator collapses.\nprint(\"\\nsame estimator, signs autocorrelated by metaorder splitting\")\nprint(\"   rho(1) of signs   implied Cov      c_hat     c_hat / c_true\")\nfor par in (3.0, 1.6, 1.2):\n    sizes = np.minimum((1 + rng.pareto(par, size=n)).astype(np.int64), 2000)\n    sgn = rng.choice(np.array([-1.0, 1.0]), size=n)\n    q = np.repeat(sgn, sizes)[:n]\n    if len(q) < n:\n        q = np.resize(q, n)\n    r1 = float(np.corrcoef(q[1:], q[:-1])[0, 1])\n    cov1b, c_hb, _ = roll(sig_u, q)\n    print(\"   %+13.4f   %11.3e   %8.5f   %12.2f\"\n          % (r1, cov1b, c_hb, c_hb / c_true))\nprint(\"\\nRoll UNDERSTATES the spread whenever order flow has memory, because the\")\nprint(\"bounce term no longer alternates: it is a lower bound, not an estimate.\")\n",
            "output": "Roll model, independent trade signs\n   true half-spread      0.00500\n   first autocovariance  -2.527e-05   (theory -c^2 = -2.500e-05)\n   estimated half-spread 0.00503   error +0.53%\n   return autocorrelation lag 1  -0.3821\n\nsame estimator, signs autocorrelated by metaorder splitting\n   rho(1) of signs   implied Cov      c_hat     c_hat / c_true\n         +0.1651    -1.824e-05    0.00427           0.85\n         +0.5595    -7.404e-06    0.00272           0.54\n         +0.7828    -3.075e-06    0.00175           0.35\n\nRoll UNDERSTATES the spread whenever order flow has memory, because the\nbounce term no longer alternates: it is a lower bound, not an estimate."
          }
        },
        {
          "name": "The microprice has the right shape and the wrong gain",
          "explain": "<p>The arithmetic mid throws away the sizes. If the bid holds ten thousand shares and the ask holds two hundred, the next move is far more likely to be up than down, and a mid that ignores that is leaving information on the table. The standard fix is the microprice, which weights each quote by the size on the <em>opposite</em> side so that the price leans toward the thin book. It costs nothing to compute and it is a genuine improvement.</p><p>Whether the size weighting is the <em>right</em> weighting is a separate question, and here the week-2 queue race answers it exactly. Sampling book states from the stationary depth law and comparing the naive microprice offset against the exact expected next move gives a correlation of 0.9812 — so the shape is close to perfect — but a regression slope of 0.6630. The naive microprice overstates the predictable component of the next move by about 51%. Trading on it as if it were an unbiased forecast means systematically overpaying for immediacy.</p><p>Refitting the gain fixes it. Root-mean-square error against the true expected move falls from 0.0669 ticks for the naive microprice to 0.0242 ticks with a fitted gain, a factor of 2.8, and both beat the mid's 0.1251. This is why production microprices are estimated, usually as a function of imbalance and total depth, rather than taken from the textbook formula.</p><p>A desk cares because the microprice is the mark used for inventory valuation and for the reservation price in week 8, and a 51% overstated tilt turns into a systematic mispricing of the book.</p>",
          "formula": "p_{\\text{micro}} = \\frac{Q^{a} p^{b} + Q^{b} p^{a}}{Q^{a} + Q^{b}} = m + \\frac{s}{2}\\cdot\\frac{Q^{b} - Q^{a}}{Q^{b} + Q^{a}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# The microprice weights the two quotes by the OPPOSITE side's size, so it\n# leans toward the thin side. Question: is the size weighting the right gain?\n# Ground truth comes from the week-2 queue race, solved exactly.\nLAM, THETA, MU, N = 6.0, 0.5, 3.0, 20\n\n\ndef race_solve():\n    def idx(b, a):\n        return (b - 1) * N + (a - 1)\n    A = np.zeros((N * N, N * N))\n    rhs = np.zeros(N * N)\n    for b in range(1, N + 1):\n        for a in range(1, N + 1):\n            r_ba, r_bd = (LAM if b < N else 0.0), THETA * b + MU\n            r_aa, r_ad = (LAM if a < N else 0.0), THETA * a + MU\n            k = idx(b, a)\n            A[k, k] = r_ba + r_bd + r_aa + r_ad\n            if b < N:\n                A[k, idx(b + 1, a)] -= r_ba\n            if b > 1:\n                A[k, idx(b - 1, a)] -= r_bd\n            if a < N:\n                A[k, idx(b, a + 1)] -= r_aa\n            if a > 1:\n                A[k, idx(b, a - 1)] -= r_ad\n            else:\n                rhs[k] += r_ad\n    return np.linalg.solve(A, rhs).reshape(N, N)\n\n\nU = race_solve()\n\n# stationary depth law for one side, same detailed-balance product as week 2\nw = np.ones(N + 1)\nfor q in range(1, N + 1):\n    w[q] = w[q - 1] * LAM / (THETA * q + MU)\npi = w[1:] / w[1:].sum()                      # condition on a non-empty level\n\nrng = np.random.default_rng(31)\nn = 400_000\nb = rng.choice(np.arange(1, N + 1), size=n, p=pi)\na = rng.choice(np.arange(1, N + 1), size=n, p=pi)\n\nimb = (b - a) / (b + a)                        # queue imbalance\nmp_off = 0.5 * imb                             # microprice offset, in TICKS\ntruth = 2.0 * U[b - 1, a - 1] - 1.0            # E[next mid move] in half-ticks\ntruth_ticks = 0.5 * truth                      # ... in ticks\n\nprint(\"spread = 1 tick, mid at 0. microprice offset = (spread/2) * imbalance.\")\nprint(\"ground truth = exact E[next mid move] from the queue race.\")\nprint(\"\")\nprint(\"  bid  ask   imbalance   microprice offset   true E[move]   ratio\")\nfor bb, aa in [(7, 5), (8, 4), (9, 3), (10, 2), (11, 1)]:\n    i_ = (bb - aa) / (bb + aa)\n    off = 0.5 * i_\n    tr = 0.5 * (2.0 * U[bb - 1, aa - 1] - 1.0)\n    print(\"%5d %4d   %+9.3f   %17.4f   %12.4f   %5.2f\"\n          % (bb, aa, i_, off, tr, tr / off))\n\nsl, ic = np.polyfit(mp_off, truth_ticks, 1)\ncorr = float(np.corrcoef(mp_off, truth_ticks)[0, 1])\nprint(\"\\nregression of true E[move] on the microprice offset\")\nprint(\"   slope %.4f   intercept %+.5f   correlation %.4f\" % (sl, ic, corr))\nprint(\"   the naive size weighting OVERSTATES the predictable move by %.0f%%\"\n      % (100 * (1.0 / sl - 1.0)))\n\nrmse_mid = float(np.sqrt(np.mean(truth_ticks ** 2)))\nrmse_mp = float(np.sqrt(np.mean((truth_ticks - mp_off) ** 2)))\nrmse_fit = float(np.sqrt(np.mean((truth_ticks - (sl * mp_off + ic)) ** 2)))\nprint(\"\\nRMSE against the true expected move, in ticks\")\nprint(\"   mid (predict 0)            %.5f\" % rmse_mid)\nprint(\"   naive microprice           %.5f\" % rmse_mp)\nprint(\"   microprice with fitted gain %.5f\" % rmse_fit)\nprint(\"   fitted gain beats the naive microprice by %.1fx\"\n      % (rmse_mp / rmse_fit))\n",
            "output": "spread = 1 tick, mid at 0. microprice offset = (spread/2) * imbalance.\nground truth = exact E[next mid move] from the queue race.\n\n  bid  ask   imbalance   microprice offset   true E[move]   ratio\n    7    5      +0.167              0.0833         0.0442    0.53\n    8    4      +0.333              0.1667         0.0920    0.55\n    9    3      +0.500              0.2500         0.1482    0.59\n   10    2      +0.667              0.3333         0.2209    0.66\n   11    1      +0.833              0.4167         0.3262    0.78\n\nregression of true E[move] on the microprice offset\n   slope 0.6630   intercept +0.00003   correlation 0.9812\n   the naive size weighting OVERSTATES the predictable move by 51%\n\nRMSE against the true expected move, in ticks\n   mid (predict 0)            0.12514\n   naive microprice           0.06693\n   microprice with fitted gain 0.02416\n   fitted gain beats the naive microprice by 2.8x"
          }
        },
        {
          "name": "Order-flow imbalance, not signed volume, is what moves the mid",
          "explain": "<p>The single most reliable linear relationship at short horizons is between the change in the mid and the order-flow imbalance at the touch. Imbalance counts every signed change in depth at the best quotes: trades, new limit orders and cancellations alike. Signed trade volume counts only the trades, which week 1 showed to be about two and a half percent of the message traffic.</p><p>The snippet separates two things people routinely conflate. Using signed trade volume instead of full imbalance does <em>not</em> bias the slope — trade flow is a component of imbalance, not a noisy measurement of it, so the omitted quote flow lands in the residual and the estimated coefficient stays at 1.03 times the truth. What collapses is explanatory power: the R-squared falls from 0.5751 to 0.0608, a factor of 9.5. You recover the same coefficient with a ninth of the precision and none of the intraday timing.</p><p>Measurement error is the different and more dangerous problem. When imbalance itself is observed with noise — hidden liquidity, dropped messages, an incomplete venue set — the slope attenuates by the classical signal-to-total variance ratio, and the snippet reproduces that prediction to three decimals: noise equal to the signal halves the estimated coefficient.</p><p>This coefficient is the empirical face of Kyle's lambda. Here it is a regression slope and an input to a control problem. Why a market has any depth at all, and what determines its equilibrium level, is a question about strategic informed trading, and that is the subject of FINM 35100.</p>",
          "formula": "\\Delta m_t = \\lambda \\cdot \\mathrm{OFI}_t + \\varepsilon_t, \\qquad \\hat{\\lambda}_{\\text{noisy}} \\to \\lambda \\cdot \\frac{\\sigma^{2}_{\\mathrm{OFI}}}{\\sigma^{2}_{\\mathrm{OFI}} + \\sigma^{2}_{\\eta}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# Order-flow imbalance vs signed trade volume as the driver of price change.\n# OFI counts EVERY signed change in depth at the touch: trades, arrivals and\n# cancellations. Signed volume sees only the trades, which are a minority of\n# the tape (week 1: about 2.5% of messages).\nrng = np.random.default_rng(37)\nT = 60_000                       # one-second buckets\n\n# per bucket: signed trade flow, and signed non-trade depth change\ntrade = rng.normal(0.0, 1.0, T) * 300.0\nquote = rng.normal(0.0, 1.0, T) * 900.0          # adds minus cancels, signed\nofi = trade + quote\n\nLAM = 2.2e-6                     # dollars of mid move per share of imbalance\nnoise = rng.normal(0.0, 0.0018, T)\ndmid = LAM * ofi + noise         # the mid responds to the FULL imbalance\n\n\ndef ols(y, x):\n    X = np.column_stack([np.ones(len(x)), x])\n    beta, *_ = np.linalg.lstsq(X, y, rcond=None)\n    resid = y - X @ beta\n    s2 = resid @ resid / (len(y) - 2)\n    se = np.sqrt(s2 * np.linalg.inv(X.T @ X)[1, 1])\n    r2 = 1 - (resid @ resid) / ((y - y.mean()) @ (y - y.mean()))\n    return beta[1], se, r2\n\n\nprint(\"true lambda = %.3e  dollars per share of order-flow imbalance\" % LAM)\nprint(\"\")\nprint(\"regressor              slope        t-stat     R^2     slope/true\")\nfor name, x in ((\"order-flow imbalance\", ofi),\n                (\"signed trade volume \", trade),\n                (\"trade sign only     \", np.sign(trade))):\n    b, se, r2 = ols(dmid, x)\n    scale = b / LAM if name.strip() != \"trade sign only\" else float(\"nan\")\n    print(\"%s %12.4e  %10.1f  %6.4f   %s\"\n          % (name, b, b / se, r2,\n             (\"%10.3f\" % scale) if np.isfinite(scale) else \"         -\"))\n\nprint(\"\\nBoth slopes are unbiased for lambda -- signed volume is a PART of the\")\nprint(\"imbalance, not a noisy measurement of it -- but the R^2 collapses from\")\nb1, _, r1 = ols(dmid, ofi)\nb2, _, r2b = ols(dmid, trade)\nprint(\"%.4f to %.4f, a factor of %.1f, because the quote flow is now residual.\"\n      % (r1, r2b, r1 / r2b))\n\n# What a 10% under-reported queue REALLY does: a noisy measurement attenuates.\nprint(\"\\nnow measure the imbalance with error (hidden liquidity, dropped messages)\")\nprint(\"noise/signal   slope     slope/true   predicted attenuation\")\nvar_o = ofi.var()\nfor k in (0.0, 0.25, 0.5, 1.0):\n    obs = ofi + rng.normal(0.0, k * np.sqrt(var_o), T)\n    b, _, _ = ols(dmid, obs)\n    pred = var_o / (var_o + k * k * var_o)\n    print(\"%12.2f   %.4e   %10.3f   %21.3f\" % (k, b, b / LAM, pred))\n",
            "output": "true lambda = 2.200e-06  dollars per share of order-flow imbalance\n\nregressor              slope        t-stat     R^2     slope/true\norder-flow imbalance   2.2003e-06       285.0  0.5751        1.000\nsigned trade volume    2.2674e-06        62.3  0.0608        1.031\ntrade sign only        5.4295e-04        49.1  0.0387            -\n\nBoth slopes are unbiased for lambda -- signed volume is a PART of the\nimbalance, not a noisy measurement of it -- but the R^2 collapses from\n0.5751 to 0.0608, a factor of 9.5, because the quote flow is now residual.\n\nnow measure the imbalance with error (hidden liquidity, dropped messages)\nnoise/signal   slope     slope/true   predicted attenuation\n        0.00   2.2003e-06        1.000                   1.000\n        0.25   2.0733e-06        0.942                   0.941\n        0.50   1.7617e-06        0.801                   0.800\n        1.00   1.0972e-06        0.499                   0.500"
          }
        },
        {
          "name": "Mis-signing trades costs you twice the error rate",
          "explain": "<p>Much historical and consolidated data prints a price and a size but not the aggressor's side, so the side has to be inferred. The quote rule compares the trade price to the prevailing mid and calls anything above it a buy. The tick rule compares the trade price to the previous trade and breaks the ties the quote rule cannot. Together they are the Lee-Ready procedure, and they are the standard.</p><p>Their accuracy depends entirely on how stale the quote you are comparing against is. With a perfectly synchronised quote the rule is exact. As the observed mid ages by three, eight and twenty trade intervals, accuracy falls to 96.5%, 86.6% and 75.6%. That degradation is not benign, and the arithmetic of how it propagates is the point of the snippet. The expected product of the inferred and true signs is one minus twice the error rate, so any coefficient estimated on inferred signs is attenuated by that factor, not by the error rate. Mis-signing a quarter of trades costs you half of lambda. The measured attenuations — 0.932, 0.732, 0.510 — track the theoretical prediction almost exactly.</p><p>The practical consequence is that impact coefficients estimated from consolidated tapes with imperfect timestamp alignment are biased low, often badly, and that the bias is worst in fast names where the quote goes stale in milliseconds.</p><p>A desk cares because an impact coefficient that is too small by a third makes every order look cheaper to trade than it is, which is exactly the error that destroys capacity estimates.</p>",
          "formula": "\\mathbb{E}[\\hat{q}\\,q] = 1 - 2p, \\qquad \\hat{\\lambda} \\approx (1-2p)\\,\\lambda",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# Trade signing. A public tape often prints price and size but not the\n# aggressor's side, so the side is INFERRED. The quote rule compares the trade\n# price to the prevailing mid; the tick rule breaks ties off the previous\n# trade. Both fail when the quote you are comparing against is stale.\nrng = np.random.default_rng(1207)\nn = 300_000\nc = 0.0050                       # half-spread, one cent wide\nsig = 0.0016                     # mid innovation per trade interval\n\nq = rng.choice(np.array([-1.0, 1.0]), size=n)\nvol = rng.integers(100, 1000, size=n).astype(float)\ndm = sig * rng.normal(size=n)\nmid = np.cumsum(dm)\nprice = mid + q * c              # aggressor pays the far side\n\nprint(\"half-spread %.4f, mid innovation per trade %.4f\" % (c, sig))\nprint(\"\")\nprint(\"staleness (mid moves)   signing accuracy   E[q_obs*q_true]   lambda_hat/lambda\")\n\nLAM = 1.5e-6\ntarget = LAM * q * vol + 0.0012 * rng.normal(size=n)   # next mid move\n\nfor lag in (0, 1, 3, 8, 20):\n    if lag == 0:\n        mid_obs = mid\n    else:\n        # the observed mid is the mid as of `lag` trades ago\n        mid_obs = np.concatenate([np.zeros(lag), mid[:-lag]])\n    diff = price - mid_obs\n    q_obs = np.sign(diff)\n    tie = q_obs == 0\n    if tie.any():                                       # tick-rule fallback\n        prev = np.concatenate([[price[0]], price[:-1]])\n        q_obs[tie] = np.where(price[tie] >= prev[tie], 1.0, -1.0)\n    acc = float(np.mean(q_obs == q))\n    agree = float(np.mean(q_obs * q))\n    X = np.column_stack([np.ones(n), q_obs * vol])\n    beta, *_ = np.linalg.lstsq(X, target, rcond=None)\n    print(\"%21d   %16.4f   %15.4f   %17.3f\"\n          % (lag, acc, agree, beta[1] / LAM))\n\nprint(\"\")\nprint(\"E[q_obs*q_true] = 1 - 2p for an error rate p, and the estimated impact\")\nprint(\"coefficient is attenuated by exactly that factor: mis-signing 20% of\")\nprint(\"trades costs you 40% of lambda, not 20%.\")\n",
            "output": "half-spread 0.0050, mid innovation per trade 0.0016\n\nstaleness (mid moves)   signing accuracy   E[q_obs*q_true]   lambda_hat/lambda\n                    0             1.0000            1.0000               1.003\n                    1             0.9991            0.9982               1.001\n                    3             0.9649            0.9297               0.932\n                    8             0.8656            0.7312               0.732\n                   20             0.7561            0.5123               0.510\n\nE[q_obs*q_true] = 1 - 2p for an error rate p, and the estimated impact\ncoefficient is attenuated by exactly that factor: mis-signing 20% of\ntrades costs you 40% of lambda, not 20%."
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "Mid change against order-flow imbalance, with the residuals",
        "params": {
          "n": 200,
          "beta": 0.75,
          "noise": 0.65,
          "alpha": 0.0,
          "seed": 3031,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Quoting a Roll effective spread without checking the sign autocorrelation. In a name that trades in long directional runs the estimator can return a third of the true spread.",
        "Trading the textbook microprice as an unbiased forecast. Its shape is right but its gain is too large by roughly a half in the calibration here, so it overstates how far the mid is about to move.",
        "Blaming a low R-squared on a biased coefficient. Dropping quote flow from an imbalance regression leaves the slope alone and destroys the fit; measurement error in the regressor does the opposite.",
        "Estimating lambda off an inferred trade sign and not correcting for the signing error rate. The attenuation is twice the error rate, and it always points the same way: impact looks cheaper than it is."
      ],
      "check": [
        {
          "q": "The Roll estimator recovers the half-spread from the first autocovariance of transaction returns. What breaks it?",
          "options": [
            "Serially correlated trade signs, which make the bounce stop alternating",
            "A non-zero drift in the efficient price",
            "Heteroskedasticity in the efficient-price innovations",
            "A spread that is wider than one tick"
          ],
          "answer": 0,
          "why": "The identity needs independent signs; with autocorrelation 0.78 the estimate falls to about 35% of the true half-spread, while drift and heteroskedasticity leave the first autocovariance of the bounce term alone."
        },
        {
          "q": "Sampling book states from the stationary depth law, the true expected next mid move regressed on the naive microprice offset has a slope of about 0.66. What does that mean in practice?",
          "options": [
            "The microprice overstates the predictable move by roughly a half",
            "The microprice has the wrong sign a third of the time",
            "The microprice is uncorrelated with the next move",
            "The microprice should be replaced by the arithmetic mid"
          ],
          "answer": 0,
          "why": "Correlation is 0.98 so the shape is right, but the gain is too large by about 51%; refitting the gain cuts the error by a factor of 2.8 while the mid is worse than both."
        },
        {
          "q": "Replacing full order-flow imbalance with signed trade volume in a mid-change regression does what to the estimated lambda and to the R-squared?",
          "options": [
            "Leaves lambda roughly unbiased and cuts the R-squared by about an order of magnitude",
            "Halves lambda and leaves the R-squared unchanged",
            "Doubles lambda and raises the R-squared",
            "Biases lambda upward and leaves the R-squared unchanged"
          ],
          "answer": 0,
          "why": "Trade flow is a component of imbalance rather than a noisy proxy, so the omitted quote flow goes to the residual: the slope stays near the truth while R-squared falls from 0.575 to 0.061."
        },
        {
          "q": "A signing procedure classifies 85% of trades correctly. By roughly what factor is an impact coefficient estimated on those signs attenuated?",
          "options": [
            "0.85",
            "0.70",
            "0.98",
            "0.15"
          ],
          "answer": 1,
          "why": "The attenuation is one minus twice the error rate, so a 15% error rate costs about 30% of the coefficient rather than 15%."
        }
      ],
      "n": 3
    },
    {
      "title": "Queueing at the touch: fill probability and the value of a slot",
      "topics": [
        "queue position as a state variable",
        "fill probability by first passage",
        "cancellation hazard ahead of you",
        "adverse selection conditional on a fill",
        "the break-even queue depth",
        "price improvement versus time priority",
        "markout curves"
      ],
      "concepts": [
        {
          "name": "Fill probability by queue position, solved exactly",
          "explain": "<p>This is the central calculation of passive trading, and it has a closed-form answer on a truncated grid. You are resting at the bid with q units ahead of you. Four things can happen. A market sell arrives and consumes one unit from the front of the queue, moving you up. Someone ahead of you cancels, which also moves you up and costs nobody anything. A limit order joins the ask, or the ask loses a unit. When your position reaches zero and the next market sell arrives, you are filled. When the ask depletes entirely the mid ticks up and the market has left without you.</p><p>So the fill event is a race between your queue draining and the opposite side vanishing, and the state is the pair of queue lengths. The result is the fill-probability surface. At the front of the queue you fill with probability 0.9940; sixty units back you still fill with probability 0.7239, because the ask queue is mean-reverting and rarely empties.</p><p>The three comparative statics are worth memorising, and two of them run in directions people get wrong. Cancellations <em>ahead</em> of you are pure gift: raising that rate from zero to two lifts fill probability at q equal to twenty from 0.6338 to 0.9293. Churn on the <em>opposite</em> side is the opposite: raising it from 0.25 to 2.0 collapses the same probability from 0.9381 to 0.1030, because the mid leaves sooner. Note that a single cancellation parameter driving both sides would net these two effects out and hide both.</p><p>A desk cares because this surface, not a rule of thumb, is what decides whether to queue, improve or cross, and it is the input to every quote-placement policy in weeks 8 and 9.</p>",
          "formula": "f(q,a) = \\frac{\\mu\\,\\mathbf{1}\\{q=0\\} + (\\mu + \\theta_{o} q) f(q{-}1,a) + \\lambda f(q,a{+}1) + (\\theta_{p} a + \\mu) f(q,a{-}1)}{\\mu + \\theta_{o} q + \\lambda + \\theta_{p} a + \\mu}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# FILL PROBABILITY BY QUEUE POSITION, solved exactly.\n# You are resting at the bid with q units ahead of you. State = (q, a):\n#   market SELL   rate mu            -> q-1, or FILL if q == 0\n#   cancel ahead  rate th_own * q    -> q-1  (someone ahead gives up)\n#   ask arrival   rate lam           -> a+1\n#   ask departure rate th_opp*a + mu -> a-1; a == 0 means the mid ticked UP and\n#                                       the market left without you: NO FILL.\n# Orders joining behind you never matter, which is the whole point of FIFO.\n# th_own and th_opp are kept SEPARATE so each comparative static is clean.\nLAM, N, QMAX = 6.0, 20, 60\n\n\ndef fill_grid(th_own, th_opp, mu):\n    ns = (QMAX + 1) * N\n\n    def idx(q, a):\n        return q * N + (a - 1)\n\n    A = np.zeros((ns, ns))\n    rhs = np.zeros(ns)\n    for q in range(0, QMAX + 1):\n        for a in range(1, N + 1):\n            r_sell, r_canc = mu, th_own * q\n            r_aa = LAM if a < N else 0.0\n            r_ad = th_opp * a + mu\n            k = idx(q, a)\n            A[k, k] = r_sell + r_canc + r_aa + r_ad\n            if q == 0:\n                rhs[k] += r_sell * 1.0                 # a market sell fills YOU\n            else:\n                A[k, idx(q - 1, a)] -= r_sell + r_canc\n            if a < N:\n                A[k, idx(q, a + 1)] -= r_aa\n            if a > 1:\n                A[k, idx(q, a - 1)] -= r_ad            # a-1 == 0 -> f = 0\n    return np.linalg.solve(A, rhs).reshape(QMAX + 1, N)\n\n\nA0, TH_OWN, TH_OPP, MU = 6, 0.5, 0.5, 3.0\nbase = fill_grid(TH_OWN, TH_OPP, MU)\nprint(\"lam=%.1f  th_own=%.1f  th_opp=%.1f  mu=%.1f  ask depth on arrival=%d\"\n      % (LAM, TH_OWN, TH_OPP, MU, A0))\nprint(\"\")\nprint(\"P(filled before the mid ticks up), by queue position ahead of you\")\nprint(\"  q ahead    P(fill)\")\nfor q in (0, 1, 2, 4, 8, 12, 20, 30, 45, 60):\n    print(\"%9d   %8.4f  %s\" % (q, base[q, A0 - 1],\n                               \"#\" * int(round(base[q, A0 - 1] * 40))))\n\ncol = base[:, A0 - 1]\nbelow = np.nonzero(col < 0.5)[0]\nprint(\"\\nP(fill) at the front %.4f, at q=60 %.4f; it %s within q<=%d\"\n      % (col[0], col[QMAX],\n         (\"first drops below 0.5 at q=%d\" % below[0]) if below.size\n         else \"never drops below 0.5\", QMAX))\n\n# Comparative static 1: cancellations AHEAD of you, opposite side held fixed.\nprint(\"\\ncancellations ahead of you advance your position for free\")\nprint(\"   th_own   P(fill) at q=20\")\nfor t in (0.0, 0.25, 0.5, 1.0, 2.0):\n    print(\"%9.2f   %16.4f\" % (t, fill_grid(t, TH_OPP, MU)[20, A0 - 1]))\n\n# Comparative static 2: churn on the OPPOSITE side, your queue held fixed.\nprint(\"\\nchurn on the opposite side makes the mid leave sooner\")\nprint(\"   th_opp   P(fill) at q=20\")\nfor t in (0.25, 0.5, 1.0, 2.0):\n    print(\"%9.2f   %16.4f\" % (t, fill_grid(TH_OWN, t, MU)[20, A0 - 1]))\n\n# Comparative static 3: how much opposite-side depth is worth.\nprint(\"\\ndeeper opposite-side depth buys you time\")\nprint(\"   ask depth   P(fill) at q=20\")\nfor aa in (2, 4, 6, 10, 16):\n    print(\"%12d   %16.4f\" % (aa, base[20, aa - 1]))\n",
            "output": "lam=6.0  th_own=0.5  th_opp=0.5  mu=3.0  ask depth on arrival=6\n\nP(filled before the mid ticks up), by queue position ahead of you\n  q ahead    P(fill)\n        0     0.9940  ########################################\n        1     0.9835  #######################################\n        2     0.9709  #######################################\n        4     0.9450  ######################################\n        8     0.9015  ####################################\n       12     0.8691  ###################################\n       20     0.8242  #################################\n       30     0.7871  ###############################\n       45     0.7500  ##############################\n       60     0.7239  #############################\n\nP(fill) at the front 0.9940, at q=60 0.7239; it never drops below 0.5 within q<=60\n\ncancellations ahead of you advance your position for free\n   th_own   P(fill) at q=20\n     0.00             0.6338\n     0.25             0.7674\n     0.50             0.8242\n     1.00             0.8811\n     2.00             0.9293\n\nchurn on the opposite side makes the mid leave sooner\n   th_opp   P(fill) at q=20\n     0.25             0.9381\n     0.50             0.8242\n     1.00             0.4936\n     2.00             0.1030\n\ndeeper opposite-side depth buys you time\n   ask depth   P(fill) at q=20\n           2             0.5264\n           4             0.7257\n           6             0.8242\n          10             0.9159\n          16             0.9663"
          }
        },
        {
          "name": "Depth in the queue is punished twice",
          "explain": "<p>Fill probability is only half the story, and the other half runs the same way. Market orders do not arrive one share at a time; they arrive in batches with a heavy-tailed size distribution. An order resting q lots back is only reached when a batch bigger than q arrives. Bigger batches are exactly the ones that move the price most — that is the square-root law of week 5 — so the flow that reaches a deep slot is systematically the flow you least want to trade against.</p><p>The two effects compound. Moving from the front of the queue to thirty-two lots back multiplies fill probability by 0.028 and multiplies expected adverse selection conditional on a fill by 4.53. Expected value per slot therefore falls by a factor of about sixty-five, far faster than either effect alone would suggest.</p><p>Push it further and the sign changes. Net revenue per fill — the half-spread plus the rebate minus expected adverse selection — crosses zero at about a hundred and eighty-three lots on this calibration. Past that point a fill is not a small profit, it is a loss: the only orders that reach you are the ones that run you over. That is the formal version of the trading-floor instruction not to leave stale size deep in the book.</p><p>The mixture over batch sizes, rather than any single average trade, is what makes this work, and it is why a market maker's P&L is so much more sensitive to the tail of the size distribution than to its mean.</p><p>A desk cares because this is the argument for actively cancelling deep resting size rather than treating it as free option value.</p>",
          "formula": "V(q) = \\Pr(S > q)\\Big(\\tfrac{s}{2} + r_m - \\mathbb{E}\\big[\\kappa\\sqrt{S}\\ \\big|\\ S > q\\big]\\Big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# The value of a queue slot, and why depth in the queue is punished TWICE.\n# Market sells arrive as batches of random size S (lots). An order resting at\n# position q is filled only if S > q. Bigger batches move the price more --\n# take the square-root form of week 5 -- so a deep slot is reached only by the\n# flow that hurts most: P(fill) falls in q AND adverse selection rises in q.\nrng = np.random.default_rng(404)\nM = 400_000\nLOT = 100.0\n\nS = np.maximum(1.0, np.ceil(rng.pareto(1.35, size=M) * 2.4))  # batch size, lots\nS = np.minimum(S, 400.0)\nKAPPA = 0.00040                                           # $ per sqrt(lot)\nadverse = KAPPA * np.sqrt(S)                              # post-fill mid drift\n\nHALF, REBATE = 0.0050, 0.0020                             # 1c spread, +20 mils\nREV = HALF + REBATE\n\nprint(\"batch size: mean %.1f lots, median %.0f, 95th pct %.0f, max %.0f\"\n      % (S.mean(), np.median(S), np.percentile(S, 95), S.max()))\nprint(\"revenue per filled share: half-spread %.4f + rebate %.4f = %.4f\"\n      % (HALF, REBATE, REV))\nprint(\"\")\nprint(\"  q (lots)  P(fill)   E[adverse|fill]   net per fill   expected value\")\nrows = []\nfor q in (0, 1, 2, 4, 8, 16, 32, 64, 128):\n    hit = S > q\n    p = float(hit.mean())\n    adv = float(adverse[hit].mean()) if hit.any() else float(\"nan\")\n    net = REV - adv\n    ev = p * net\n    rows.append((q, p, adv, net, ev))\n    print(\"%10d  %7.4f   %15.5f   %12.6f   %14.6f\" % (q, p, adv, net, ev))\n\nneg = [r for r in rows if r[3] < 0]\nprint(\"\")\nif neg:\n    print(\"net per fill turns NEGATIVE at q = %d lots: past that point every fill\"\n          % neg[0][0])\n    print(\"you get is one you did not want.\")\nelse:\n    print(\"net per fill stays positive across the grid tested.\")\n\n# Find the break-even queue depth on a fine grid.\nqs = np.arange(0, 300)\nnets = np.array([REV - (adverse[S > q].mean() if (S > q).any() else np.nan)\n                 for q in qs])\nbad = np.nonzero(nets < 0)[0]\nprint(\"break-even queue depth (fine grid): q* = %s lots\"\n      % (str(int(qs[bad[0]])) if bad.size else \"not reached below 300\"))\n\n# Decompose the two penalties between the front of the queue and q = 32.\nf, d = rows[0], [r for r in rows if r[0] == 32][0]\nprint(\"\\nfrom the front of the queue to q=32 lots:\")\nprint(\"   P(fill)          %.4f -> %.4f   (x%.3f)\" % (f[1], d[1], d[1] / f[1]))\nprint(\"   E[adverse|fill]  %.5f -> %.5f   (x%.2f)\" % (f[2], d[2], d[2] / f[2]))\nprint(\"   expected value   %.6f -> %.6f   (x%.3f)\" % (f[4], d[4], d[4] / f[4]))\n",
            "output": "batch size: mean 6.3 lots, median 2, 95th pct 20, max 400\nrevenue per filled share: half-spread 0.0050 + rebate 0.0020 = 0.0070\n\n  q (lots)  P(fill)   E[adverse|fill]   net per fill   expected value\n         0   1.0000           0.00078       0.006224         0.006224\n         1   0.6230           0.00100       0.005997         0.003736\n         2   0.4409           0.00118       0.005816         0.002564\n         4   0.2674           0.00147       0.005525         0.001477\n         8   0.1388           0.00193       0.005074         0.000704\n        16   0.0640           0.00259       0.004410         0.000282\n        32   0.0276           0.00352       0.003484         0.000096\n        64   0.0115           0.00472       0.002280         0.000026\n       128   0.0046           0.00620       0.000802         0.000004\n\nnet per fill stays positive across the grid tested.\nbreak-even queue depth (fine grid): q* = 183 lots\n\nfrom the front of the queue to q=32 lots:\n   P(fill)          1.0000 -> 0.0276   (x0.028)\n   E[adverse|fill]  0.00078 -> 0.00352   (x4.53)\n   expected value   0.006224 -> 0.000096   (x0.015)"
          }
        },
        {
          "name": "What one tick of price improvement is worth in queue units",
          "explain": "<p>A passive trader faces a recurring binary choice. Join the queue at the current best price and wait behind whatever is already there, or improve the price by a tick, become the new best quote, and stand at the front of an empty queue. The first keeps the full half-spread and risks never trading. The second trades much more often and captures one tick less.</p><p>With the fill-probability surface in hand this is arithmetic. On a five-tick spread, joining is worth the fill probability times twenty-seven mils; improving is worth the front-of-queue probability times seventeen mils. The two are equal at twelve units of queue. Fewer than twelve ahead of you, join; more than twelve, improve. That number is the honest, model-based version of the intuition that queue priority has a price.</p><p>The fee schedule then moves the boundary in a direction worth thinking about. Raising the maker rebate from zero to thirty mils lowers the break-even from fourteen units to eleven — a bigger rebate makes you <em>more</em> willing to improve the price. The reason is that the rebate is earned on any fill regardless of price, so it dilutes the relative value of the spread you give up while leaving the fill-probability gain intact. Rebate-rich venues therefore see more aggressive price improvement and tighter quoted spreads, which is the mechanism behind the week-1 observation that quoted spreads are not comparable across fee models.</p><p>A desk cares because this single threshold, recomputed per name, is most of what a quote-placement policy does.</p>",
          "formula": "\\Pr(\\text{fill}\\mid q)\\left(\\tfrac{s}{2} + r_m\\right) \\;=\\; \\Pr(\\text{fill}\\mid 0)\\left(\\tfrac{s}{2} - \\Delta + r_m\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# What is time priority WORTH? Two ways to buy on a two-tick spread:\n#   (a) JOIN the bid queue behind q units and capture the full half-spread;\n#   (b) IMPROVE by one tick, becoming the best bid at the front of an empty\n#       queue, and capture one tick less.\n# Exact fill probabilities come from the same (q, a) solve as before.\nLAM, N, QMAX = 6.0, 20, 60\nTH_OWN, TH_OPP, MU = 0.5, 1.0, 3.0\nTICK, HALF, REBATE, A0 = 0.01, 0.025, 0.0020, 6\n\n\ndef fill_grid(th_own, th_opp, mu):\n    ns = (QMAX + 1) * N\n\n    def idx(q, a):\n        return q * N + (a - 1)\n\n    A = np.zeros((ns, ns))\n    rhs = np.zeros(ns)\n    for q in range(0, QMAX + 1):\n        for a in range(1, N + 1):\n            r_sell, r_canc = mu, th_own * q\n            r_aa = LAM if a < N else 0.0\n            r_ad = th_opp * a + mu\n            k = idx(q, a)\n            A[k, k] = r_sell + r_canc + r_aa + r_ad\n            if q == 0:\n                rhs[k] += r_sell\n            else:\n                A[k, idx(q - 1, a)] -= r_sell + r_canc\n            if a < N:\n                A[k, idx(q, a + 1)] -= r_aa\n            if a > 1:\n                A[k, idx(q, a - 1)] -= r_ad\n    return np.linalg.solve(A, rhs).reshape(QMAX + 1, N)\n\n\nP = fill_grid(TH_OWN, TH_OPP, MU)[:, A0 - 1]\nrev_join = HALF + REBATE\nrev_improve = HALF - TICK + REBATE\nv_improve = P[0] * rev_improve\n\nprint(\"five-tick spread. join-the-queue revenue %.4f/share, price-improved %.4f\"\n      % (rev_join, rev_improve))\nprint(\"P(fill) at the front of the queue %.4f, so improving is worth %.6f\"\n      % (P[0], v_improve))\nprint(\"\")\nprint(\"  q ahead   P(fill)   value of joining   better than improving?\")\nfor q in (0, 2, 5, 10, 15, 20, 30, 45, 60):\n    v = P[q] * rev_join\n    print(\"%9d   %7.4f   %16.6f   %s\"\n          % (q, P[q], v, \"yes\" if v > v_improve else \"NO\"))\n\nvals = P * rev_join\nworse = np.nonzero(vals < v_improve)[0]\nprint(\"\")\nif worse.size:\n    q_star = int(worse[0])\n    print(\"break-even queue depth q* = %d units: join if fewer than that are\" % q_star)\n    print(\"ahead of you, improve the price if more are.\")\n    print(\"equivalently, front-of-queue priority is worth up to %d units of\" % q_star)\n    print(\"queue, or one tick of price on a five-tick spread.\")\nelse:\n    print(\"joining always beats improving on this calibration.\")\n\n# How the answer moves with the rebate: a bigger rebate makes queueing better.\nprint(\"\\nthe fee schedule changes the answer\")\nprint(\"   maker rebate   q* (units)\")\nfor r in (0.0000, 0.0010, 0.0020, 0.0030):\n    vj = P * (HALF + r)\n    vi = P[0] * (HALF - TICK + r)\n    w = np.nonzero(vj < vi)[0]\n    print(\"%15.4f   %10s\" % (r, str(int(w[0])) if w.size else \">%d\" % QMAX))\n",
            "output": "five-tick spread. join-the-queue revenue 0.0270/share, price-improved 0.0170\nP(fill) at the front of the queue 0.9793, so improving is worth 0.016648\n\n  q ahead   P(fill)   value of joining   better than improving?\n        0    0.9793           0.026442   yes\n        2    0.9039           0.024404   yes\n        5    0.7875           0.021262   yes\n       10    0.6483           0.017503   yes\n       15    0.5574           0.015050   NO\n       20    0.4936           0.013328   NO\n       30    0.4090           0.011044   NO\n       45    0.3337           0.009009   NO\n       60    0.2867           0.007741   NO\n\nbreak-even queue depth q* = 12 units: join if fewer than that are\nahead of you, improve the price if more are.\nequivalently, front-of-queue priority is worth up to 12 units of\nqueue, or one tick of price on a five-tick spread.\n\nthe fee schedule changes the answer\n   maker rebate   q* (units)\n         0.0000           14\n         0.0010           13\n         0.0020           12\n         0.0030           11"
          }
        },
        {
          "name": "Markouts: the spread is booked instantly, the loss arrives over minutes",
          "explain": "<p>A passive fill looks profitable at the moment it happens, because the trade prints at a better price than the mid. Whether it <em>was</em> profitable depends on where the mid goes next, and the standard diagnostic is the markout curve: value every fill against the mid a fixed interval later, and plot the result against the interval.</p><p>The shape is always the same. Here a maker books seven mils per share at the fill. That is still ninety-nine percent intact one second later, eighty-six percent at fifteen seconds, and sixty-seven percent at forty-five seconds; it settles at forty-eight percent, about three and a half mils, after a few minutes. The steady state matches the theoretical prediction that long-run adverse selection equals the informed share times the permanent move — 0.00360 predicted against 0.003371 measured.</p><p>The split by counterparty shows where it all comes from. Fills against uninformed flow keep essentially the entire spread. Fills against informed flow lose about twenty-three mils each — more than three times the gross revenue — and twelve percent of the volume is enough to halve the strategy's earnings. A maker who books the spread at the fill and never marks out will report 106% more revenue than the book actually earns.</p><p>This is also the right place to be precise about what is and is not being modelled. Adverse selection is taken here as a parameter: an informed share and a jump size. Why informed traders exist, how much they trade, and what determines the equilibrium spread that compensates for them are questions answered by FINM 35100, which derives these quantities rather than assuming them.</p>",
          "formula": "\\mathrm{MO}(h) = \\tfrac{s}{2} + r_m + \\mathbb{E}\\big[m_{t+h} - m_t \\mid \\text{passive buy at } t\\big] \\;\\xrightarrow[h\\to\\infty]{}\\; \\tfrac{s}{2} + r_m - \\pi J",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# MARKOUTS: the desk's standard diagnostic for a passive book. Value each fill\n# against the mid h seconds LATER, not against the mid at the time of the fill.\n# Spread capture is booked instantly; adverse selection arrives over minutes.\nrng = np.random.default_rng(4040)\nn = 200_000\nH = 600                                   # seconds of markout horizon tracked\nHALF, REBATE = 0.0050, 0.0020             # one-cent spread, +20 mils rebate\nSIG = 0.0009                              # mid diffusion per second\nPI, JUMP, TAU = 0.12, 0.030, 45.0         # informed share, jump size, decay\n\ninformed = rng.random(n) < PI\n# The permanent component arrives with an exponential profile, not instantly.\nprofile = 1.0 - np.exp(-np.arange(H + 1) / TAU)\n\n# You BUY passively at the bid. An informed seller means the mid falls.\nwalk = SIG * rng.normal(size=(n, 8))      # 8 coarse blocks, cheap and enough\nblocks = np.array([0, 1, 5, 15, 45, 120, 300, 600])\ncum = np.zeros((n, len(blocks)))\nfor j in range(1, len(blocks)):\n    dt = blocks[j] - blocks[j - 1]\n    cum[:, j] = cum[:, j - 1] + np.sqrt(dt) * walk[:, j]\n\nperm = np.where(informed, -JUMP, 0.0)[:, None] * profile[blocks][None, :]\ndmid = cum + perm                          # mid change from fill time\n\nprint(\"passive BUY at the bid. revenue booked at the fill: %.4f/share\"\n      % (HALF + REBATE))\nprint(\"informed counterparty share %.0f%%, permanent move %.3f, decay %.0f s\"\n      % (100 * PI, JUMP, TAU))\nprint(\"\")\nprint(\"horizon(s)   E[mid move]   markout P&L   share of gross kept\")\ngross = HALF + REBATE\nfor j, h in enumerate(blocks):\n    mv = float(dmid[:, j].mean())\n    pnl = gross + mv                       # long the stock: mid down hurts\n    print(\"%10d   %11.5f   %11.6f   %18.0f%%\" % (h, mv, pnl, 100 * pnl / gross))\n\nprint(\"\")\nprint(\"split by counterparty at the 600 s markout\")\nfor lab, m in ((\"uninformed\", ~informed), (\"informed  \", informed)):\n    print(\"   %s  E[mid move] %+.5f   markout %+.6f\"\n          % (lab, dmid[m, -1].mean(), gross + dmid[m, -1].mean()))\n\nprint(\"\")\nprint(\"theory: long-run adverse selection = pi * jump = %.5f, so the steady-state\"\n      % (PI * JUMP))\nprint(\"markout is %.4f + (-%.5f) = %.6f per share; measured %.6f.\"\n      % (gross, PI * JUMP, gross - PI * JUMP, gross + dmid[:, -1].mean()))\nprint(\"A maker who books the spread at the fill and never marks out will report\")\nprint(\"%.0f%% more revenue than the strategy actually earns.\"\n      % (100 * (gross / (gross - PI * JUMP) - 1)))\n",
            "output": "passive BUY at the bid. revenue booked at the fill: 0.0070/share\ninformed counterparty share 12%, permanent move 0.030, decay 45 s\n\nhorizon(s)   E[mid move]   markout P&L   share of gross kept\n         0       0.00000      0.007000                  100%\n         1      -0.00008      0.006920                   99%\n         5      -0.00038      0.006618                   95%\n        15      -0.00101      0.005990                   86%\n        45      -0.00228      0.004724                   67%\n       120      -0.00336      0.003643                   52%\n       300      -0.00366      0.003337                   48%\n       600      -0.00363      0.003371                   48%\n\nsplit by counterparty at the 600 s markout\n   uninformed  E[mid move] -0.00004   markout +0.006956\n   informed    E[mid move] -0.02985   markout -0.022846\n\ntheory: long-run adverse selection = pi * jump = 0.00360, so the steady-state\nmarkout is 0.0070 + (-0.00360) = 0.003400 per share; measured 0.003371.\nA maker who books the spread at the fill and never marks out will report\n106% more revenue than the strategy actually earns."
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Fill probability by queue position (rows) and opposite-side depth (columns)",
        "params": {
          "cmap": "seq",
          "xlabels": [
            "2",
            "4",
            "6",
            "8",
            "12",
            "16",
            "20"
          ],
          "ylabels": [
            "0",
            "2",
            "4",
            "8",
            "12",
            "20",
            "30",
            "45",
            "60"
          ],
          "matrix": [
            [
              0.8695,
              0.9755,
              0.994,
              0.9982,
              0.9997,
              0.9999,
              1.0
            ],
            [
              0.7252,
              0.9158,
              0.9709,
              0.9887,
              0.9978,
              0.9994,
              0.9998
            ],
            [
              0.66,
              0.8694,
              0.945,
              0.9749,
              0.9936,
              0.998,
              0.9992
            ],
            [
              0.5975,
              0.8095,
              0.9015,
              0.9458,
              0.9812,
              0.9925,
              0.9963
            ],
            [
              0.5645,
              0.7723,
              0.8691,
              0.9203,
              0.9669,
              0.9846,
              0.9915
            ],
            [
              0.5264,
              0.7257,
              0.8242,
              0.8807,
              0.9392,
              0.9663,
              0.9786
            ],
            [
              0.4987,
              0.6898,
              0.7871,
              0.8453,
              0.9102,
              0.9438,
              0.9606
            ],
            [
              0.4726,
              0.6553,
              0.75,
              0.8081,
              0.8763,
              0.9147,
              0.9353
            ],
            [
              0.4551,
              0.6316,
              0.7239,
              0.7814,
              0.8505,
              0.8909,
              0.9135
            ]
          ]
        }
      },
      "pitfalls": [
        "Using one cancellation rate for your own queue and for the opposite side. The two effects on fill probability have opposite signs and roughly comparable size, so a single parameter nets them out and hides both.",
        "Treating a deep resting order as free option value. Fill probability falls and conditional adverse selection rises together, and past a break-even queue depth every fill you get is one you did not want.",
        "Booking the half-spread as revenue at the moment of the fill. On the calibration here that overstates a passive book's earnings by about a factor of two; only the markout curve tells you what was kept.",
        "Assuming a bigger maker rebate always makes queueing more attractive. It lowers the break-even queue depth, because the rebate is earned on any fill and therefore dilutes the spread you give up by improving the price."
      ],
      "check": [
        {
          "q": "In the exact fill-probability solve, raising the cancellation rate of the orders AHEAD of you while holding the opposite side fixed does what?",
          "options": [
            "Raises your fill probability substantially, because you advance for free",
            "Lowers it, because the queue is less stable",
            "Leaves it unchanged, since only trades move you up the queue",
            "Raises it only if you are at the front already"
          ],
          "answer": 0,
          "why": "Cancellations ahead advance your position without consuming a market order, lifting fill probability at twenty units ahead from 0.63 to 0.93 as the rate goes from zero to two."
        },
        {
          "q": "Moving from the front of the queue to thirty-two lots back multiplies fill probability by about 0.03 and conditional adverse selection by about 4.5. Why does adverse selection rise?",
          "options": [
            "Only large batches reach a deep slot, and large batches move the price more",
            "Deep orders are filled later, so more time passes and volatility accumulates",
            "The rebate is smaller on deep orders",
            "Cancellation rates are higher deep in the book"
          ],
          "answer": 0,
          "why": "Reaching position q requires a batch larger than q, and batch size and price impact move together, so the deep slot is selected against on size."
        },
        {
          "q": "On a five-tick spread the break-even between joining the queue and improving the price by one tick sits at about twelve units of queue. Raising the maker rebate moves that threshold which way?",
          "options": [
            "Down, making price improvement relatively more attractive",
            "Up, making queueing relatively more attractive",
            "It does not move, since the rebate applies to both choices",
            "Down, but only if the spread is one tick"
          ],
          "answer": 0,
          "why": "The rebate is earned on any fill, so it dilutes the value of the spread given up by improving while leaving the fill-probability gain intact; the threshold falls from fourteen to eleven units."
        },
        {
          "q": "A markout curve settles at 48% of the gross spread captured at the fill. What does that imply about reported revenue if the desk books the spread at fill time?",
          "options": [
            "Reported revenue is roughly double what the strategy actually earns",
            "Reported revenue is roughly half of what it earns",
            "Reported revenue is correct, since the spread was genuinely received",
            "Reported revenue is understated by 48%"
          ],
          "answer": 0,
          "why": "Keeping 48% of gross means the fill-time booking overstates the true economics by about 106%, which is the classic way a passive book looks profitable while losing money."
        }
      ],
      "n": 4
    },
    {
      "title": "Market impact: the square-root law, decay and the propagator",
      "topics": [
        "the square-root law of metaorder impact",
        "peak, average and permanent impact",
        "relaxation after the last child order",
        "transient impact and the propagator",
        "the diffusivity condition",
        "cost curves and strategy capacity"
      ],
      "concepts": [
        {
          "name": "The square-root law, and what a linear model does to it",
          "explain": "<p>The most robust empirical regularity in execution is that the price impact of a metaorder scales with the square root of its size relative to daily volume, multiplied by daily volatility, with a prefactor of order one half and — remarkably — almost no dependence on how long the order took to execute. It holds across equities, futures and currencies, across decades, and across very different institutions' data.</p><p>The snippet generates four thousand metaorders from that law with realistic lognormal noise, then recovers it. A log-log regression returns an exponent of 0.501 against a true 0.500 and a prefactor of 0.556 against 0.550, and the exponent's standard error rejects the value one by a hundred and thirty-three standard errors. The exponent is not a soft empirical impression; on this much data it is sharply identified.</p><p>The second half is the part people get wrong in practice. Fitting a <em>linear</em> impact model to the same data by least squares produces a model that is calibrated on average and wrong everywhere. It underprices an order worth three basis points of daily volume by a factor of twenty-one, and overprices one worth twenty percent of daily volume by a factor of 1.22. Because least squares is dominated by the large orders, the fitted line is anchored at the top end and collapses toward zero exactly where most orders live.</p><p>A desk cares because the exponent, not the prefactor, determines whether slicing an order into smaller pieces helps: under a square root it does, under linearity it does not, and getting that backwards is the difference between an algorithm and a liability.</p>",
          "formula": "\\mathcal{I}(Q) \\;\\approx\\; Y\\,\\sigma_{\\text{daily}}\\sqrt{\\frac{Q}{V_{\\text{daily}}}}, \\qquad Y = O(1/2)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# THE SQUARE-ROOT LAW. Metaorder impact scales like daily volatility times the\n# square root of participation in daily volume, with NO dependence on the time\n# taken. Generate data from it, then recover the exponent -- and see what a\n# linear impact model does to the two ends of the size distribution.\nrng = np.random.default_rng(505)\nn = 4000\nY_TRUE, D_TRUE, SIG = 0.55, 0.50, 0.020        # prefactor, exponent, daily vol\n\npart = np.exp(rng.uniform(np.log(1e-4), np.log(0.30), n))     # Q / V\ntrue_imp = Y_TRUE * SIG * part ** D_TRUE\nobs = true_imp * np.exp(rng.normal(0.0, 0.55, n))             # lognormal noise\n\n# log-log regression recovers the exponent and the prefactor\nX = np.column_stack([np.ones(n), np.log(part)])\nbeta, *_ = np.linalg.lstsq(X, np.log(obs), rcond=None)\nd_hat = beta[1]\ny_hat = np.exp(beta[0]) / SIG\nres = np.log(obs) - X @ beta\nr2 = 1 - res @ res / np.var(np.log(obs)) / n\n\nprint(\"true  exponent %.3f   prefactor %.3f\" % (D_TRUE, Y_TRUE))\nprint(\"fitted exponent %.3f   prefactor %.3f   R^2 %.3f\" % (d_hat, y_hat, r2))\nse = np.sqrt((res @ res / (n - 2)) * np.linalg.inv(X.T @ X)[1, 1])\nprint(\"exponent standard error %.4f, so 1.0 is rejected by %.0f standard errors\"\n      % (se, (1.0 - d_hat) / se))\nprint(\"\")\n\n# Now fit a LINEAR impact model by least squares on the levels and compare.\nA = np.column_stack([part])\nlin, *_ = np.linalg.lstsq(A, obs, rcond=None)\nprint(\"linear model fitted by least squares: impact = %.4f * participation\" % lin[0])\nprint(\"\")\nprint(\"participation   true impact(bp)   sqrt fit(bp)   linear fit(bp)   linear/true\")\nfor p in (0.0003, 0.001, 0.01, 0.05, 0.20):\n    t = 1e4 * Y_TRUE * SIG * p ** D_TRUE\n    s = 1e4 * y_hat * SIG * p ** d_hat\n    lf = 1e4 * lin[0] * p\n    print(\"%13.4f   %15.2f   %12.2f   %14.2f   %11.2f\" % (p, t, s, lf, lf / t))\n\nprint(\"\")\nsmall = (lin[0] * 0.0003) / (Y_TRUE * SIG * 0.0003 ** 0.5)\nbig = (lin[0] * 0.20) / (Y_TRUE * SIG * 0.20 ** 0.5)\nprint(\"A linear model fitted to the same data underprices an order worth 3 bp of\")\nprint(\"daily volume by a factor of %.0f, and overprices one worth 20%% of daily\" % (1 / small))\nprint(\"volume by a factor of %.2f. The exponent is not a detail: it is the whole\" % big)\nprint(\"shape of the cost curve, and it decides capacity.\")\n",
            "output": "true  exponent 0.500   prefactor 0.550\nfitted exponent 0.501   prefactor 0.556   R^2 0.815\nexponent standard error 0.0038, so 1.0 is rejected by 133 standard errors\n\nlinear model fitted by least squares: impact = 0.0300 * participation\n\nparticipation   true impact(bp)   sqrt fit(bp)   linear fit(bp)   linear/true\n       0.0003              1.91           1.92             0.09          0.05\n       0.0010              3.48           3.50             0.30          0.09\n       0.0100             11.00          11.08             3.00          0.27\n       0.0500             24.60          24.81            14.98          0.61\n       0.2000             49.19          49.66            59.92          1.22\n\nA linear model fitted to the same data underprices an order worth 3 bp of\ndaily volume by a factor of 21, and overprices one worth 20% of daily\nvolume by a factor of 1.22. The exponent is not a detail: it is the whole\nshape of the cost curve, and it decides capacity."
          }
        },
        {
          "name": "Peak, average and permanent impact are three different numbers",
          "explain": "<p>Impact is a path, not a scalar, and confusing points on that path is the most common error in transaction-cost work. During execution the price walks away from you, concavely in time. At the last child order it reaches its peak. Then it relaxes, partly but not fully, toward a permanent level that reflects whatever information the trade revealed.</p><p>Three numbers matter and they differ by large factors. The peak here is forty mils; the permanent level is about fourteen, or thirty-six percent of the peak; and the <em>average</em> price you actually paid over the execution is twenty-seven mils, sixty-seven percent of the peak. Reporting peak impact as the cost of the trade overstates it by forty-nine percent, because you did not pay the peak on every share — you paid it only on the last one.</p><p>The estimation lesson is worth as much as the decomposition. Pinning the permanent level from the tail of the path and then regressing the log excess on time returns a relaxation time of 48.8 minutes against a true seventy, a twenty-three percent error, because the permanent level and the decay rate are strongly confounded. Fitting all three parameters jointly recovers the permanent level exactly and the relaxation time to 63.4 minutes. Staging the fit is not a simplification; it is a bias.</p><p>A desk cares because the permanent share decides whether a round trip is cheap or expensive, and the relaxation time decides how long to wait before trading the same name again.</p>",
          "formula": "\\mathcal{I}(t) = \\mathcal{I}_{\\infty} + \\big(\\mathcal{I}_{\\text{peak}} - \\mathcal{I}_{\\infty}\\big)e^{-t/\\tau}, \\qquad t > T_{\\text{exec}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# PERMANENT vs TEMPORARY. During a metaorder the price walks away from you;\n# after the last child order it RELAXES back part of the way. Only the part\n# that does not come back is permanent, and only the peak is what you paid.\nrng = np.random.default_rng(515)\nT_exec, T_post, paths = 120, 360, 4000     # minutes\nPEAK, PERM_FRAC, TAU = 0.0040, 0.35, 70.0  # peak impact, permanent share, decay\nSIG = 0.00035                              # per-minute noise\n\nt_in = np.arange(1, T_exec + 1)\nshape_in = PEAK * np.sqrt(t_in / T_exec)   # concave build-up, sqrt of time\nt_out = np.arange(1, T_post + 1)\nperm = PEAK * PERM_FRAC\nshape_out = perm + (PEAK - perm) * np.exp(-t_out / TAU)\n\npath = np.concatenate([shape_in, shape_out])\nobs = path[None, :] + SIG * np.cumsum(rng.normal(size=(paths, len(path))), axis=1)\nmean_path = obs.mean(axis=0)\n\nprint(\"peak impact %.4f, true permanent share %.2f, relaxation time %.0f min\"\n      % (PEAK, PERM_FRAC, TAU))\nprint(\"\")\nprint(\"minutes from start   mean impact   as % of peak\")\nfor k in (30, 60, 90, 120, 150, 180, 240, 300, 420, 480):\n    print(\"%18d   %11.5f   %12.1f%%\"\n          % (k, mean_path[k - 1], 100 * mean_path[k - 1] / mean_path[T_exec - 1]))\n\npeak_hat = mean_path[T_exec - 1]\nperm_hat = mean_path[-60:].mean()\nprint(\"\")\nprint(\"estimated peak      %.5f   (true %.5f)\" % (peak_hat, PEAK))\nprint(\"estimated permanent %.5f   (true %.5f)\" % (perm_hat, perm))\nprint(\"estimated permanent share %.3f   (true %.3f)\"\n      % (perm_hat / peak_hat, PERM_FRAC))\n\n# Two-stage fit: pin the permanent level from the tail, then regress the\n# log excess on time. The two parameters are badly confounded and it shows.\ny = mean_path[T_exec:] - perm_hat\nok = y > 0\nxx = np.arange(1, T_post + 1)[ok]\nA = np.column_stack([np.ones(ok.sum()), xx])\nb, *_ = np.linalg.lstsq(A, np.log(y[ok]), rcond=None)\nprint(\"two-stage relaxation time %.1f min   (true %.1f)  <- biased\"\n      % (-1 / b[1], TAU))\n\n# Joint nonlinear fit of (permanent, gap, tau) on the whole post-trade path.\nfrom scipy.optimize import curve_fit\ntt = np.arange(1, T_post + 1)\n\n\ndef relax(t, p_inf, gap, tau):\n    return p_inf + gap * np.exp(-t / tau)\n\n\npar, _ = curve_fit(relax, tt, mean_path[T_exec:],\n                   p0=[perm_hat, peak_hat - perm_hat, 50.0], maxfev=20000)\nprint(\"joint fit: permanent %.5f (true %.5f), tau %.1f min (true %.1f)\"\n      % (par[0], perm, par[2], TAU))\nprint(\"Fitting the level and the decay TOGETHER is not optional: staging them\")\nprint(\"moves the estimated relaxation time by %.0f%%.\"\n      % (100 * abs((-1 / b[1]) / par[2] - 1)))\n\nprint(\"\")\nprint(\"Implementation shortfall is paid at the AVERAGE price over the execution,\")\navg_paid = shape_in.mean()\nprint(\"which is %.5f here -- %.0f%% of the peak, not the peak itself.\" %\n      (avg_paid, 100 * avg_paid / PEAK))\nprint(\"Reporting peak impact as the cost overstates it by %.0f%%.\"\n      % (100 * (PEAK / avg_paid - 1)))\n",
            "output": "peak impact 0.0040, true permanent share 0.35, relaxation time 70 min\n\nminutes from start   mean impact   as % of peak\n                30       0.00203           50.9%\n                60       0.00285           71.5%\n                90       0.00342           85.8%\n               120       0.00398          100.0%\n               150       0.00304           76.3%\n               180       0.00243           60.9%\n               240       0.00180           45.1%\n               300       0.00152           38.3%\n               420       0.00144           36.1%\n               480       0.00145           36.4%\n\nestimated peak      0.00398   (true 0.00400)\nestimated permanent 0.00144   (true 0.00140)\nestimated permanent share 0.361   (true 0.350)\ntwo-stage relaxation time 48.8 min   (true 70.0)  <- biased\njoint fit: permanent 0.00140 (true 0.00140), tau 63.4 min (true 70.0)\nFitting the level and the decay TOGETHER is not optional: staging them\nmoves the estimated relaxation time by 23%.\n\nImplementation shortfall is paid at the AVERAGE price over the execution,\nwhich is 0.00268 here -- 67% of the peak, not the peak itself.\nReporting peak impact as the cost overstates it by 49%."
          }
        },
        {
          "name": "The propagator: decay is what no-arbitrage demands",
          "explain": "<p>Week 2 left a contradiction on the table. Signed order flow has long memory — autocorrelation still measurably positive hundreds of trades out, and a variance ratio of tens rather than one. If impact were permanent and linear, the price would be a constant times cumulative flow and would inherit all of that trending. Real prices do not trend that way.</p><p>The propagator model resolves it by writing the price as a convolution of past signed flow with a decaying kernel. Each trade still moves the price, but its effect fades, and the fading can cancel the memory in the flow. The snippet scans the decay exponent and shows exactly that: a flat kernel gives a variance ratio of 68.4 at a two-hundred-trade horizon, and a kernel decaying as the inverse 0.708 power brings it to precisely 1.0. Push the decay further and the price over-corrects into mean reversion.</p><p>So price diffusivity is not an assumption bolted on to the model — it is a constraint that ties the impact kernel to the statistics of order flow. Predictable flow and unpredictable prices can coexist, and the reason is the kernel.</p><p>One caveat the snippet makes explicit rather than hiding: the textbook asymptotic relation between the kernel exponent and the flow-memory exponent predicts 0.320 here, not 0.708. A truncated kernel and a finite sample move it, so the decay has to be calibrated rather than assumed. That gap is itself the lesson about how far an asymptotic result travels.</p><p>A research team cares because a short-horizon signal built on order flow is only tradeable to the extent the kernel has <em>not</em> already discounted it.</p>",
          "formula": "p_t = \\sum_{l \\geq 0} G(l)\\,\\epsilon_{t-l} + \\text{noise}, \\qquad G(l) = \\frac{G_0}{(1+l)^{\\beta}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom scipy.signal import fftconvolve\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# THE PROPAGATOR, and the resolution of week 2's puzzle. Price is a decaying\n# convolution of past signed flow:  p_t = sum_l G(l) eps_{t-l},  G(l)=(1+l)^-b.\n# Flow has long memory. A FLAT kernel (permanent linear impact) makes the price\n# inherit that memory and trend absurdly. Enough decay cancels it. The question\n# is whether a decay rate exists that leaves the price diffusive -- and it does.\nrng = np.random.default_rng(525)\nn, KLEN = 200_000, 4000\n\nsizes = np.minimum((1 + rng.pareto(1.1, size=n)).astype(np.int64), 20_000)\nsgn = rng.choice(np.array([-1.0, 1.0]), size=n)\neps = np.resize(np.repeat(sgn, sizes), n)\n\n\ndef acf(x, lags):\n    z = x - x.mean()\n    d = z @ z\n    return np.array([float(z[:n - L] @ z[L:] / d) for L in lags])\n\n\nlags = np.arange(1, 400)\nrho = acf(eps, lags)\npos = rho > 0\nA = np.column_stack([np.ones(pos.sum()), np.log(lags[pos])])\ncf, *_ = np.linalg.lstsq(A, np.log(rho[pos]), rcond=None)\ngamma = -cf[1]\nprint(\"flow long memory: ACF(1) %.3f  ACF(100) %.3f  fitted exponent %.3f\"\n      % (rho[0], rho[99], gamma))\nprint(\"\")\n\n\ndef var_ratio(x, k):\n    m = (len(x) // k) * k\n    return float(x[:m].reshape(-1, k).sum(axis=1).var() / (k * x[:m].var()))\n\n\ndef vr_at(beta, ks=(10, 50, 200, 1000)):\n    G = (1.0 + np.arange(KLEN)) ** (-beta)\n    dp = np.diff(fftconvolve(eps, G, mode=\"full\")[:n])\n    return [var_ratio(dp, k) for k in ks]\n\n\nprint(\"kernel decay beta      price variance ratio at horizon (trades)\")\nprint(\"                        10        50       200      1000\")\nfor beta in (0.0, 0.32, 0.50, 0.70, 1.00):\n    v = vr_at(beta)\n    print(\"   %-18.2f\" % beta + \"\".join(\"%9.2f\" % x for x in v))\n\n# Solve for the decay that makes the price diffusive at a 200-trade horizon.\nlo, hi = 0.3, 1.4\nfor _ in range(30):\n    mid = 0.5 * (lo + hi)\n    if vr_at(mid, (200,))[0] > 1.0:\n        lo = mid\n    else:\n        hi = mid\nb_star = 0.5 * (lo + hi)\nprint(\"\")\nprint(\"beta that sets VR(200) = 1 exactly: %.3f   (VR = %.3f)\"\n      % (b_star, vr_at(b_star, (200,))[0]))\nprint(\"the asymptotic relation beta = (1 - gamma)/2 would predict %.3f\"\n      % ((1 - gamma) / 2))\nprint(\"\")\nprint(\"Impact is real, flow is strongly predictable, and the price is still\")\nprint(\"almost a martingale: a %.2f kernel takes VR(200) from %.1f down to 1.0.\"\n      % (b_star, vr_at(0.0, (200,))[0]))\nprint(\"Decay is not a modelling convenience -- it is what no-arbitrage requires\")\nprint(\"given long-memory order flow. NOTE the asymptotic exponent relation is\")\nprint(\"NOT recovered here: a truncated kernel and a finite sample shift it, so\")\nprint(\"the decay must be CALIBRATED rather than assumed.\")\n",
            "output": "flow long memory: ACF(1) 0.835  ACF(100) 0.298  fitted exponent 0.360\n\nkernel decay beta      price variance ratio at horizon (trades)\n                        10        50       200      1000\n   0.00                   7.14    25.35    68.39   171.31\n   0.32                   3.34     6.26     9.90    12.60\n   0.50                   2.24     2.81     3.04     2.30\n   0.70                   1.58     1.37     1.04     0.49\n   1.00                   1.05     0.61     0.32     0.10\n\nbeta that sets VR(200) = 1 exactly: 0.708   (VR = 1.000)\nthe asymptotic relation beta = (1 - gamma)/2 would predict 0.320\n\nImpact is real, flow is strongly predictable, and the price is still\nalmost a martingale: a 0.71 kernel takes VR(200) from 68.4 down to 1.0.\nDecay is not a modelling convenience -- it is what no-arbitrage requires\ngiven long-memory order flow. NOTE the asymptotic exponent relation is\nNOT recovered here: a truncated kernel and a finite sample shift it, so\nthe decay must be CALIBRATED rather than assumed."
          }
        },
        {
          "name": "An impact curve is a capacity constraint in disguise",
          "explain": "<p>Once the impact curve is calibrated, capacity follows mechanically, and this is where microstructure stops being a specialist topic and starts setting the size of a business. Cost per share grows like the square root of size, so <em>total</em> cost grows like size to the power one and a half. Doubling an order multiplies the total cost by 2.83, and the snippet measures 2.75 on the calibrated curve.</p><p>Capacity is then the size at which the expected cost eats the whole signal. On an eight-million-share name with two percent daily volatility, a five basis point alpha supports about nine thousand shares; a twenty basis point alpha supports two hundred and thirty thousand; a forty basis point alpha supports nearly a million. The scaling is quadratic in the signal: a signal twice as strong carries four times the size, because the cost curve has to be inverted.</p><p>The last block does the optimisation properly rather than at the break-even point, because trading right up to break-even earns nothing. Maximising net profit rather than net margin gives a closed-form optimal participation of the squared ratio of net alpha to one and a half times the impact coefficient, which is 1.29% of daily volume for a twenty basis point signal — matching the grid search to the decimal.</p><p>A desk cares because this is the calculation that answers 'how much can this strategy run', and it is answered by an impact exponent, not by a risk limit.</p>",
          "formula": "\\rho^{*} = \\left(\\frac{\\alpha - h}{1.5\\,k}\\right)^{2}, \\qquad k = 10^{4}\\,Y\\,\\sigma_{\\text{daily}}, \\quad \\text{cost}(\\rho) = h + k\\sqrt{\\rho}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # Accelerate BLAS emits spurious warnings on finite data\n\n# FROM AN IMPACT CURVE TO A CAPACITY NUMBER. Under the square-root law the\n# cost PER SHARE grows like sqrt(size), so TOTAL cost grows like size^1.5.\n# That single exponent is what caps every strategy's assets under management.\nY, SIG, ADV, PX = 0.55, 0.020, 8.0e6, 40.0     # prefactor, daily vol, shares, price\nHALF_SPREAD_BP = 1.25\n\n\ndef cost_bp(shares):\n    part = shares / ADV\n    return HALF_SPREAD_BP + 1e4 * Y * SIG * np.sqrt(part)\n\n\nprint(\"name: %.1fm shares/day at $%.0f, daily vol %.1f%%, Y=%.2f\"\n      % (ADV / 1e6, PX, 100 * SIG, Y))\nprint(\"\")\nprint(\"    shares    % of ADV   cost(bp)   total cost($)   cost per 2x size\")\nprev = None\nfor sh in (8e3, 8e4, 4e5, 8e5, 2.4e6):\n    c = cost_bp(sh)\n    tot = sh * PX * c / 1e4\n    ratio = \"\" if prev is None else \"%.2fx per share\" % (c / prev)\n    print(\"%10.0f   %8.2f%%   %8.2f   %13.0f   %s\"\n          % (sh, 100 * sh / ADV, c, tot, ratio))\n    prev = c\n\nprint(\"\")\nprint(\"doubling the order multiplies TOTAL cost by 2^1.5 = %.2f, not by 2\" % 2 ** 1.5)\nfor sh in (1e5, 2e5):\n    print(\"   %6.0f shares -> $%8.0f\" % (sh, sh * PX * cost_bp(sh) / 1e4))\nprint(\"   measured ratio %.3f\"\n      % ((2e5 * cost_bp(2e5)) / (1e5 * cost_bp(1e5))))\n\n# Capacity: the size at which impact eats the whole signal.\nprint(\"\")\nprint(\"CAPACITY: the size at which expected cost equals the alpha\")\nprint(\"  alpha(bp)   break-even shares    % of ADV   notional($m)\")\nfor alpha in (5.0, 10.0, 20.0, 40.0):\n    if alpha <= HALF_SPREAD_BP:\n        continue\n    part = ((alpha - HALF_SPREAD_BP) / (1e4 * Y * SIG)) ** 2\n    sh = part * ADV\n    print(\"%11.1f   %17.0f   %8.2f%%   %12.1f\"\n          % (alpha, sh, 100 * part, sh * PX / 1e6))\n\nprint(\"\")\nprint(\"Capacity scales with the SQUARE of the alpha: a signal twice as strong\")\nprint(\"carries four times the size. That is why impact research is not a cost\")\nprint(\"accounting exercise -- it is the binding constraint on strategy size.\")\n\n# Optimal fraction of alpha to give away: maximise (alpha - cost) * size.\nprint(\"\")\nprint(\"net P&L per unit ADV traded, 20 bp signal\")\nprint(\"    % of ADV   cost(bp)   net(bp)   net P&L($)\")\nALPHA = 20.0\nbest = None\nfor part in (0.001, 0.005, 0.0129, 0.02, 0.05, 0.10, 0.20):\n    c = cost_bp(part * ADV)\n    net = ALPHA - c\n    val = net * part * ADV * PX / 1e4\n    if best is None or val > best[1]:\n        best = (part, val)\n    print(\"%11.2f%%   %8.2f   %7.2f   %10.0f\" % (100 * part, c, net, val))\nk_bp = 1e4 * Y * SIG\nrho_star = ((ALPHA - HALF_SPREAD_BP) / (1.5 * k_bp)) ** 2\nprint(\"   best on this grid   %.2f%% of ADV, $%.0f\" % (100 * best[0], best[1]))\nprint(\"   closed form rho* = ((alpha - h)/(1.5 k))^2 = %.2f%% of ADV\"\n      % (100 * rho_star))\n",
            "output": "name: 8.0m shares/day at $40, daily vol 2.0%, Y=0.55\n\n    shares    % of ADV   cost(bp)   total cost($)   cost per 2x size\n      8000       0.10%       4.73             151\n     80000       1.00%      12.25            3920   2.59x per share\n    400000       5.00%      25.85           41355   2.11x per share\n    800000      10.00%      36.04          115312   1.39x per share\n   2400000      30.00%      61.50          590395   1.71x per share\n\ndoubling the order multiplies TOTAL cost by 2^1.5 = 2.83, not by 2\n   100000 shares -> $    5419\n   200000 shares -> $   14914\n   measured ratio 2.752\n\nCAPACITY: the size at which expected cost equals the alpha\n  alpha(bp)   break-even shares    % of ADV   notional($m)\n        5.0                9298       0.12%            0.4\n       10.0               50620       0.63%            2.0\n       20.0              232438       2.91%            9.3\n       40.0              992769      12.41%           39.7\n\nCapacity scales with the SQUARE of the alpha: a signal twice as strong\ncarries four times the size. That is why impact research is not a cost\naccounting exercise -- it is the binding constraint on strategy size.\n\nnet P&L per unit ADV traded, 20 bp signal\n    % of ADV   cost(bp)   net(bp)   net P&L($)\n       0.10%       4.73     15.27          489\n       0.50%       9.03     10.97         1755\n       1.29%      13.74      6.26         2583\n       2.00%      16.81      3.19         2044\n       5.00%      25.85     -5.85        -9355\n      10.00%      36.04    -16.04       -51312\n      20.00%      50.44    -30.44      -194838\n   best on this grid   1.29% of ADV, $2583\n   closed form rho* = ((alpha - h)/(1.5 k))^2 = 1.29% of ADV"
          }
        }
      ],
      "widget": {
        "type": "slider-formula",
        "title": "Square-root impact: cost in basis points and in dollars",
        "params": {
          "formula": "\\mathcal{I} = Y\\,\\sigma\\sqrt{Q/V} \\quad\\text{(bp)}, \\qquad \\text{cost} = \\mathcal{I}\\cdot Q \\cdot P",
          "inputs": [
            {
              "name": "Y",
              "label": "Prefactor Y",
              "min": 0.1,
              "max": 1.5,
              "step": 0.05,
              "init": 0.55
            },
            {
              "name": "sig",
              "label": "Daily vol",
              "min": 0.005,
              "max": 0.06,
              "step": 0.0025,
              "init": 0.02
            },
            {
              "name": "part",
              "label": "Participation Q/V",
              "min": 0.0002,
              "max": 0.3,
              "step": 0.0002,
              "init": 0.0129
            },
            {
              "name": "adv",
              "label": "ADV (m shares)",
              "min": 0.2,
              "max": 50.0,
              "step": 0.2,
              "init": 8.0
            },
            {
              "name": "px",
              "label": "Price ($)",
              "min": 2.0,
              "max": 400.0,
              "step": 1.0,
              "init": 40.0
            }
          ],
          "compute": [
            {
              "name": "bp",
              "expr": "10000 * Y * sig * sqrt(part)",
              "label": "Impact (bp)",
              "fmt": 2
            },
            {
              "name": "shares",
              "expr": "part * adv * 1000000",
              "label": "Order (shares)",
              "fmt": "int"
            },
            {
              "name": "cost",
              "expr": "bp * shares * px / 10000",
              "label": "Impact cost ($)",
              "fmt": 0
            }
          ]
        }
      },
      "pitfalls": [
        "Fitting a linear impact model by least squares on a wide size range. The fit is dominated by the largest orders and collapses toward zero exactly where most of the order flow lives.",
        "Quoting peak impact as the cost of a trade. You paid the average over the execution, which is about two thirds of the peak on a concave build-up.",
        "Estimating the permanent level and the relaxation time in two stages. They are strongly confounded, and staging the fit moved the decay constant by 23% here.",
        "Treating the theoretical kernel-exponent relation as a calibration. The asymptotic value and the value that actually makes the simulated price diffusive differ by more than a factor of two in finite samples."
      ],
      "check": [
        {
          "q": "Under the square-root law, doubling the size of a metaorder multiplies its TOTAL expected impact cost by roughly what?",
          "options": [
            "1.41",
            "2.00",
            "2.83",
            "4.00"
          ],
          "answer": 2,
          "why": "Cost per share scales as the square root of size so total cost scales as size to the power 1.5, giving two to the power 1.5, about 2.83."
        },
        {
          "q": "A metaorder's impact builds concavely to a peak and then relaxes to 36% of it. Which number is the implementation shortfall you actually paid?",
          "options": [
            "The average impact over the execution, about two thirds of the peak",
            "The peak impact",
            "The permanent impact",
            "The difference between peak and permanent"
          ],
          "answer": 0,
          "why": "Shortfall is the average execution price against the arrival mid, so it is the time average of the impact path during execution, measured here at 67% of the peak."
        },
        {
          "q": "Order flow has long memory but prices are close to martingales. Which mechanism reconciles the two?",
          "options": [
            "The impact of each trade decays, so predictable flow does not make prices predictable",
            "Trade signs are actually independent once you correct for signing error",
            "Market makers cancel their quotes before informed flow arrives",
            "Impact is linear but the coefficient is small"
          ],
          "answer": 0,
          "why": "A flat kernel makes the price inherit the flow's variance ratio of tens; a kernel decaying as the inverse 0.708 power brings the two-hundred-trade variance ratio to exactly one."
        },
        {
          "q": "A signal's expected alpha doubles from 20 to 40 basis points. Under a square-root cost curve, break-even capacity changes by about what factor?",
          "options": [
            "2",
            "1.4",
            "4",
            "8"
          ],
          "answer": 2,
          "why": "Break-even size inverts the square root, so capacity scales with the square of net alpha: roughly four times the size, which the table shows going from 232 thousand shares to 993 thousand."
        }
      ],
      "n": 5
    }
  ],
  "interview": [
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
  ],
  "reappears_in": [
    {
      "code": "FINM 34600",
      "how": "The mirror image of this course: every volatility, noise and impact coefficient a control problem here takes as given is an estimand there, and that course's microstructure-noise bias is exactly why a naively estimated sigma is wrong at the frequencies this course trades at."
    },
    {
      "code": "FINM 35100",
      "how": "Supplies the equilibrium economics this course optimises inside: Kyle's lambda as a rational-expectations object rather than a regression slope, Glosten–Milgrom adverse selection as the reason a spread exists at all, and venue design as a mechanism problem."
    },
    {
      "code": "FINM 33150",
      "how": "Execution scheduling and the transaction-cost model of weeks 5 to 7 are what turn a paper signal into a realised P&L there; the impact curve is the gate every capacity estimate passes through."
    },
    {
      "code": "FINM 32700",
      "how": "Week 10's latency and queueing discussion is the business case for that course's engineering: queue position is a function of round-trip time, so microseconds convert into fill probability through the week-4 model."
    },
    {
      "code": "FINM 33500",
      "how": "The quoting, order-management and routing logic of weeks 8 to 10 is what a systematic trading stack has to implement, including the order types and cancel-replace discipline discussed in week 1."
    },
    {
      "code": "FINM 33165",
      "how": "Week 9 hands the execution problem to reinforcement learning; that course supplies the policy-gradient and value-approximation machinery, and week 7's dynamic program is the exact benchmark an agent has to beat."
    }
  ],
  "glossary": [
    {
      "term": "Adverse selection",
      "def": "The loss a passive quote takes because the counterparties most eager to trade against it are the ones who know more about the next price move. It is the cost a market maker charges the spread to cover, and it is derived as an equilibrium outcome in FINM 35100."
    },
    {
      "term": "Almgren–Chriss",
      "def": "The benchmark execution model: linear temporary and permanent impact, arithmetic Brownian price risk, and a mean–variance objective whose solution is a deterministic sinh-shaped trajectory indexed by risk aversion."
    },
    {
      "term": "Avellaneda–Stoikov",
      "def": "The benchmark market-making control problem. The quoting agent maximises exponential utility of terminal wealth; the solution is a reservation price shifted by inventory and a half-spread set by risk aversion and order-arrival intensity."
    },
    {
      "term": "Book resilience",
      "def": "The rate at which depth consumed by a trade is replenished. In the Obizhaeva–Wang model it is the exponential decay rate of the temporary impact state, and it is what makes splitting an order worthwhile."
    },
    {
      "term": "Continuous double auction",
      "def": "The matching rule of most modern equity and futures venues: resting buy and sell limit orders queue at discrete prices, and an incoming aggressive order is matched against the best available price, usually first-in-first-out within a price level."
    },
    {
      "term": "Effective spread",
      "def": "Twice the signed distance from the trade price to the prevailing mid. The standard per-trade measure of what immediacy cost the taker and earned the maker, before the post-trade drift is subtracted out."
    },
    {
      "term": "Implementation shortfall",
      "def": "The difference between the average price actually achieved on a parent order and the mid at the moment the decision was taken, times size. The objective function of every execution algorithm in weeks 6 and 7."
    },
    {
      "term": "Kyle's lambda",
      "def": "The price-impact coefficient: the slope of price change on signed order flow. In this course it is a regression estimate used as a control-problem input; in FINM 35100 it is the equilibrium depth of a strategic-trading model."
    },
    {
      "term": "Limit order book",
      "def": "The set of resting unexecuted limit orders at every price level on both sides, with a queue at each level. The state variable of essentially every model in this course."
    },
    {
      "term": "Maker–taker fees",
      "def": "A fee schedule that rebates the passive side of a trade and charges the aggressive side. It subsidises quoting, compresses the quoted spread and moves part of the real spread into the fee column."
    },
    {
      "term": "Metaorder",
      "def": "A large parent order executed over minutes to days through many child orders. The unit of observation for the square-root impact law."
    },
    {
      "term": "Microprice",
      "def": "A size-weighted refinement of the mid that leans toward the thin side of the book, so it predicts the next mid better than the arithmetic mid does."
    },
    {
      "term": "Order-flow imbalance",
      "def": "Net signed change in depth at the touch over an interval, counting arrivals, cancellations and trades. Empirically the strongest single linear predictor of the contemporaneous price change."
    },
    {
      "term": "Participation rate",
      "def": "Child-order volume divided by total market volume over the same interval. The argument of the square-root impact law and the usual risk limit on an execution algorithm."
    },
    {
      "term": "Price-time priority",
      "def": "The queue rule under which better prices execute first and, within a price, earlier arrivals execute first. It is what makes queue position an asset."
    },
    {
      "term": "Propagator model",
      "def": "A linear representation of price as a convolution of past signed order flow with a decaying kernel. It reconciles strongly autocorrelated order flow with a nearly unpredictable price."
    },
    {
      "term": "Queue position",
      "def": "How much volume rests ahead of your order at its price level. It determines fill probability and therefore the option value of a passive quote."
    },
    {
      "term": "Square-root law",
      "def": "The empirical regularity that the impact of a metaorder scales roughly with the square root of its size as a fraction of daily volume, times daily volatility."
    },
    {
      "term": "Smart order router",
      "def": "The component that splits a child order across venues subject to the national best bid and offer, fee schedules, expected fill rates and latency."
    },
    {
      "term": "Transaction-cost analysis",
      "def": "The post-trade attribution of implementation shortfall into spread, impact, timing and opportunity cost, benchmarked against arrival, interval VWAP and close."
    }
  ]
};
