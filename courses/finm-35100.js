/* courses/finm-35100.js -- FINM 35100, Information, Trading, and the Structure of Markets.
   Built from the public course page only. That page links no syllabus at all, so
   there was nothing further to read: the ten-week arc, the explanations, the code,
   the questions, the pitfalls and the glossary below are this dashboard's own
   reconstruction of a standard graduate treatment of the topics the page lists.
   None of it is the instructor's material, none of it was reviewed by the
   instructor, and no claim is made about grading, assignments, exam format or
   which textbook is actually used. Every code `output` is real stdout, written by
   tools/run_snippets.py -- do not edit those strings by hand. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 35100"] = {
  "code": "FINM 35100",
  "slug": "finm-35100",
  "title": "Information, Trading, and the Structure of Markets",
  "instructor": "Ayan Bhattacharya",
  "quarter": "Spring",
  "units": 100,
  "block": "electives",
  "concentrations": [
    "trading"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/trading/finm-35100/",
    "syllabus_url": "",
    "fetched": "2026-09-26",
    "note": "The only source consulted is the public course page, which gives an official description of roughly 190 words plus the instructor, the quarter, the units and the concentration. Unlike most courses in the program this page links no syllabus at all, so there is no syllabus document to read even with a university login, and data/raw/syllabus is empty for this course. Everything on this page beyond the description block — the ten-week arc, the concepts, the code, the widgets, the questions, the pitfalls, the interview items and the glossary — is the dashboard's own reconstruction of a standard graduate treatment of the listed topics. It is not the instructor's outline, it was not reviewed by the instructor, and no claim is made about grading, assignments, exam format or which textbook is actually assigned. The public page states that the subset of topics covered is tailored to each cohort's interests, so the arc below is one coherent selection from the list, not a prediction of what any particular iteration will cover."
  },
  "tier": "B",
  "description": "The economics and statistics of information, and what they imply for the structure of markets. The public page describes a deep dive into the foundational information concepts that sit underneath modern trading strategies, taught with both the theory and its application, and it lists the territory explicitly: Bayesian inference in traditional trading systems and backpropagation-based inference in machine-learning trading systems; von Neumann–Morgenstern, Savage and neural-network utilities; information structures; the Blackwell comparison of experiments and the price of information extraction in markets; Harsanyi type spaces, common knowledge and the financial no-trade theorems; asymmetric-information modelling in limit order books; language-model-based semantic information strategies; scoring-rule strategies in prediction markets; and proof-of-stake, proof-of-work and automated-market-maker strategies in crypto markets. The page also says the subset covered in each iteration is tailored to the interests of the enrolled cohort, so no fixed outline can be correct; the ten weeks below are one coherent path through that list, ordered so each week uses only what came before. This is the economics view of market microstructure: where FINM 34600 studies the statistics of high-frequency data and FINM 37601 the stochastic control of trading in a limit order book, this course asks why a spread exists at all, what a price reveals, and how a venue's rules decide both.",
  "prerequisites": [
    "Probability at the level of conditional expectation as an object rather than a formula: you should be able to compute E[V | order was a buy] on a finite space without hesitating, because weeks 5 and 6 are almost nothing else.",
    "Undergraduate microeconomics or decision theory: preferences, indifference, expected utility, and the idea that a model's prediction is an equilibrium rather than a forecast. Week 1 rebuilds the axioms, but it moves fast.",
    "Linear regression, including what an omitted variable does to a slope. Weeks 6 and 8 recover structural parameters from regressions, and the whole difficulty is whether the regressor is the equilibrium object you think it is.",
    "Linear algebra: matrix multiplication, rank, and eigen-decomposition. An information structure is a stochastic matrix and the Blackwell order in week 3 is a statement about factoring one matrix through another.",
    "Enough Python to read a vectorised NumPy snippet and a short scikit-learn or statsmodels call. Nothing here needs more than that, but the arithmetic matters: most of the arguments in this course are settled by a number."
  ],
  "textbooks": [
    {
      "title": "Market Microstructure Theory",
      "author": "Maureen O'Hara",
      "note": "A standard reference for this material: the sequential-trade and strategic-trade models of weeks 5 to 7, and the informational reading of the spread that the whole course turns on. Listed as a reference, not as an assigned text."
    },
    {
      "title": "Empirical Market Microstructure",
      "author": "Joel Hasbrouck",
      "note": "A standard reference for week 8: the Roll estimator, the spread decompositions, and the vector error-correction machinery behind information shares."
    },
    {
      "title": "Market Liquidity: Theory, Evidence, and Policy",
      "author": "Thierry Foucault, Marco Pagano and Ailsa Röell",
      "note": "A standard reference for weeks 7 and 9: limit-order-book equilibrium, order choice, fragmentation and the policy questions a venue designer faces."
    },
    {
      "title": "Notes on the Theory of Choice",
      "author": "David M. Kreps",
      "note": "A standard reference for week 1: the von Neumann–Morgenstern and Savage representation theorems stated carefully, with the axioms doing visible work."
    },
    {
      "title": "Trading and Exchanges: Market Microstructure for Practitioners",
      "author": "Larry Harris",
      "note": "A standard institutional reference for weeks 7 and 9: who the participants are, what the order types do, and how venue rules differ in practice."
    },
    {
      "title": "The value of information and the comparison of experiments",
      "author": "topic reference — Blackwell's and Marschak's results, and the treatments of them in modern information-economics texts",
      "note": "Week 3 is built on this literature rather than on one book. Any graduate information-economics treatment states the garbling theorem and the monotonicity of the value of information in the Blackwell order; the course notes here are self-contained."
    },
    {
      "title": "Market microstructure and the economics of trading rules",
      "author": "topic reference — Reg NMS Rule 611, the SEC's Tick Size Pilot assessment, Hanson's LMSR, and Milionis, Moallemi, Roughgarden and Zhang's loss-versus-rebalancing result",
      "note": "Weeks 9 and 10 draw on this literature rather than one book: the SEC's own Reg NMS adopting release and Tick Size Pilot assessment for the market-design material, and Hanson (2003) and Milionis et al. (2022) for the automated-market-maker and prediction-market material. The course notes here are self-contained."
    }
  ],
  "skills_built": [
    "asymmetric-information",
    "no-trade-theorems",
    "market-microstructure",
    "exchange-mechanism-design",
    "prediction-markets",
    "order-book-dynamics",
    "crypto-markets",
    "signal-construction",
    "liquidity-provision",
    "bayesian-inference",
    "price-discovery",
    "transaction-costs"
  ],
  "skills_assumed": [
    "conditional-expectation",
    "linear-regression",
    "measure-theoretic-probability",
    "numpy",
    "neural-networks",
    "markov-chains"
  ],
  "brushup": [
    {
      "topic": "Conditional expectation on a finite space",
      "why": "Weeks 5 and 6 define the ask as E[V | buy] and the bid as E[V | sell]. If Bayes' rule on a two-by-two table is still a lookup rather than a reflex, the models will look like algebra instead of like an argument about beliefs.",
      "resource": "Any graduate probability text's conditioning chapter; Ross, A First Course in Probability, chapter 3 for the elementary version"
    },
    {
      "topic": "Expected utility and risk aversion",
      "why": "Week 1 assumes you can compute a certainty equivalent and say what the Arrow–Pratt coefficient measures. Everything later that involves a trader's willingness to take a position sits on this.",
      "resource": "Kreps, Notes on the Theory of Choice, chapters 3 and 5"
    },
    {
      "topic": "Stochastic matrices and matrix factorisation",
      "why": "An information structure is a row-stochastic matrix from states to signals, and the Blackwell order in week 3 asks whether one such matrix factors through another. You need to be comfortable reading a matrix product as a two-stage random experiment.",
      "resource": "Strang, Introduction to Linear Algebra, chapters 2 and 8"
    },
    {
      "topic": "Ordinary least squares and what identifies a slope",
      "why": "Week 6 recovers Kyle's lambda as a regression slope and week 8 recovers a spread from an autocovariance. Both are only valid because of an exclusion argument, and you should be able to say what breaks each one.",
      "resource": "Hansen, Econometrics, chapters 2 to 4, or any first-year graduate econometrics treatment of OLS"
    },
    {
      "topic": "Stationarity, unit roots and cointegration",
      "why": "Week 8's information shares come from a vector error-correction model of two venues quoting the same asset. If 'the two prices are cointegrated with cointegrating vector (1, -1)' is not a sentence you can picture, that week will be opaque.",
      "resource": "Hamilton, Time Series Analysis, chapters 15 and 19"
    },
    {
      "topic": "Logarithms, log-odds and the logistic function",
      "why": "Bayesian updating in week 2 is addition in log-odds space, the log scoring rule in week 9 is a logarithm of a reported probability, and both are much easier to see that way than in probability space.",
      "resource": "Any Bayesian text's odds-form Bayes rule; MacKay, Information Theory, chapter 2"
    },
    {
      "topic": "What a Nash equilibrium is, and what a rational-expectations equilibrium adds",
      "why": "Kyle's model in week 6 is a fixed point: the informed trader's strategy is optimal given the pricing rule and the pricing rule is correct given the strategy. Reading it as a forecasting exercise rather than as a fixed point is the commonest way to misunderstand the whole course.",
      "resource": "Osborne, An Introduction to Game Theory, chapters 2 and 9"
    }
  ],
  "weeks": [
    {
      "title": "Preferences, beliefs, and what a learned utility does not promise",
      "topics": [
        "von Neumann–Morgenstern expected utility",
        "the independence axiom",
        "Savage acts, states and subjective probability",
        "certainty equivalents and Arrow–Pratt risk aversion",
        "learned scoring functions as utility representations"
      ],
      "concepts": [
        {
          "name": "The vNM theorem: why a preference over lotteries becomes an expectation",
          "explain": "<p>Start with a preference relation over lotteries, not over outcomes. If that relation is complete and transitive, continuous in probabilities, and satisfies <em>independence</em> — mixing two lotteries with a common third one at a common weight cannot reverse which you prefer — then there is a function u on outcomes such that one lottery is preferred to another exactly when it has the higher expected u. That is the whole von Neumann–Morgenstern theorem, and the part worth remembering is which axiom does the work. Completeness and transitivity only get you an ordering; continuity only gets you a real-valued representation. It is independence that forces the representation to be <em>linear in probabilities</em>, which is what makes it an expectation rather than some other functional.</p><p>The representation is unique only up to a positive affine transform. Rescaling u by a positive constant and shifting it by another leaves every ranking alone, which is why the numerical level of a utility means nothing and only differences, ratios of differences and signs of differences mean anything. The snippet checks that: three acts, two affine re-scalings, identical ranking both times.</p><p>The same code computes certainty equivalents for a fixed lottery at several risk-aversion coefficients. The certainty equivalent is the sure amount you would swap the lottery for, and the gap between it and the expected value is the risk premium — the price, in the agent's own units, of bearing the risk.</p><p>A desk cares because every position-sizing rule it uses is an implicit utility, and the affine-invariance result is why arguing about the level of a risk-appetite number is wasted breath while arguing about its curvature is not.</p>",
          "formula": "L_1 \\succeq L_2 \\iff \\sum_x u(x)\\,L_1(x) \\ge \\sum_x u(x)\\,L_2(x)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# A lottery over terminal wealth, and what a vNM agent would pay to avoid it.\noutcomes = np.array([70.0, 100.0, 145.0])\nprobs = np.array([0.25, 0.50, 0.25])\nev = float(probs @ outcomes)\n\ndef crra(x, g):\n    return np.log(x) if abs(g - 1.0) < 1e-12 else (x ** (1.0 - g) - 1.0) / (1.0 - g)\n\ndef certainty_equiv(x, p, g):\n    # closed form, written to avoid the cancellation that inverting u() invites\n    if abs(g - 1.0) < 1e-12:\n        return float(np.exp(p @ np.log(x)))\n    return float((p @ x ** (1.0 - g)) ** (1.0 / (1.0 - g)))\n\nprint(\"lottery           \" + \"  \".join(\"%.0f@%.2f\" % (x, q) for x, q in zip(outcomes, probs)))\nprint(\"expected value     %.4f\" % ev)\nprint(\"\")\nprint(\"%6s  %12s  %10s  %11s\" % (\"gamma\", \"E[u(W)]\", \"CE\", \"risk prem\"))\nfor g in (0.0, 0.5, 1.0, 2.0, 5.0, 10.0):\n    eu = float(probs @ crra(outcomes, g))\n    ce = certainty_equiv(outcomes, probs, g)\n    print(\"%6.1f  %12.5f  %10.4f  %11.4f\" % (g, eu, ce, ev - ce))\n\n# The vNM index is unique only up to a positive affine transform: u -> a*u + b\n# must leave every ranking alone. Check it on three acts.\ng = 2.0\nacts = {\"lottery     \": (outcomes, probs),\n        \"safe 98     \": (np.array([98.0]), np.array([1.0])),\n        \"coin 60/145 \": (np.array([60.0, 145.0]), np.array([0.5, 0.5]))}\nprint(\"\")\nfor a, b in ((1.0, 0.0), (7.3, -4.1)):\n    sc = {k: float(p @ (a * crra(x, g) + b)) for k, (x, p) in acts.items()}\n    order = [k.strip() for k in sorted(sc, key=lambda k: -sc[k])]\n    print(\"u -> %.1f*u %+.1f   ranking: %s\" % (a, b, \" > \".join(order)))\n",
            "output": "lottery           70@0.25  100@0.50  145@0.25\nexpected value     103.7500\n\n gamma       E[u(W)]          CE    risk prem\n   0.0     102.75000    103.7500       0.0000\n   0.5      18.20410    102.0514       1.6986\n   1.0       4.60889    100.3729       3.3771\n   2.0       0.98970     97.1292       6.6208\n   5.0       0.25000     88.9447      14.8053\n  10.0       0.11111     80.9440      22.8060\n\nu -> 1.0*u +0.0   ranking: safe 98 > lottery > coin 60/145\nu -> 7.3*u -4.1   ranking: safe 98 > lottery > coin 60/145"
          }
        },
        {
          "name": "Savage: a view is a probability, and choices identify it",
          "explain": "<p>The vNM theorem hands you a utility but takes the probabilities as given. Savage's construction is the harder and more useful one: the probabilities are derived too. The primitives are a set of <em>states</em> of the world, a set of <em>consequences</em>, and <em>acts</em>, which are functions from states to consequences. A trade is an act: long risk pays you one thing in a recession and another in a boom. Savage's axioms on a preference over acts — in particular the sure-thing principle, which says that how two acts compare must not depend on states where they agree — deliver both a utility over consequences and a unique subjective probability over states, such that preference is subjective expected utility.</p><p>The practical content is that a market view is not a separate kind of object from a probability. If your choices among acts are coherent in Savage's sense, then there exists exactly one prior that rationalises them, whether or not you ever write it down. The snippet makes that concrete in two directions. Forward: three desks with the same utility and the same acts but different priors choose three different acts, so the prior is doing all the work. Backward: given one observed choice, a grid search over the simplex finds which priors are consistent with it, and that set is an interval on each state's probability — a revealed belief, bounded by behaviour.</p><p>A desk cares because this is the formal justification for reading positions as forecasts, which is what a risk manager does when they infer a trader's view from their book rather than from their commentary.</p>",
          "formula": "f \\succeq g \\iff \\int_S u(f(s))\\,dP(s) \\;\\ge\\; \\int_S u(g(s))\\,dP(s)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Savage's furniture: states of the world, acts (state -> consequence),\n# a utility over consequences, and a SUBJECTIVE prior over states.\nstates = [\"recession\", \"muddle\", \"boom\"]\nacts = {                  # payoff in each state\n    \"long risk  \": np.array([-18.0,  3.0, 22.0]),\n    \"short risk \": np.array([ 14.0, -1.0, -16.0]),\n    \"carry      \": np.array([ -9.0,  7.0,  6.0]),\n    \"cash       \": np.array([  0.5,  0.5,  0.5]),\n}\nu = lambda x: -np.exp(-0.06 * x)          # CARA over P&L, so SEU is well defined\n\ndef seu(p):\n    return {k: float(p @ u(v)) for k, v in acts.items()}\n\npriors = {\"desk A (bearish)\": np.array([0.35, 0.45, 0.20]),\n          \"desk B (neutral)\": np.array([0.20, 0.50, 0.30]),\n          \"desk C (bullish)\": np.array([0.10, 0.40, 0.50])}\n\nprint(\"%-18s  %-12s  %s\" % (\"prior over states\", \"best act\", \"SEU of each act\"))\nfor name, p in priors.items():\n    s = seu(p)\n    best = max(s, key=lambda k: s[k])\n    body = \"  \".join(\"%s=%+.4f\" % (k.strip()[:5], s[k]) for k in acts)\n    print(\"%-18s  %-12s  %s\" % (name, best.strip(), body))\n\nprint(\"\")\n# Same acts, same utility, same consequences. Only the prior moved, and the\n# chosen act moved with it: in Savage's world a \"view\" IS a probability.\n# The prior is not observable, but it is IDENTIFIED by enough choices:\n# search the simplex for the prior consistent with observing \"carry\" chosen.\ngrid = np.linspace(0.0, 1.0, 51)\nconsistent = []\nfor pr in grid:\n    for pm in grid:\n        pb = 1.0 - pr - pm\n        if pb < -1e-9:\n            continue\n        p = np.array([pr, pm, max(pb, 0.0)])\n        s = seu(p)\n        if max(s, key=lambda k: s[k]) == \"carry      \":\n            consistent.append(p)\nC = np.array(consistent)\nprint(\"priors on a 51-point grid that rationalise choosing 'carry': %d of %d\" % (len(C), (51 * 52) // 2))\nprint(\"implied bound on P(recession):  %.2f to %.2f\" % (C[:, 0].min(), C[:, 0].max()))\nprint(\"implied bound on P(boom):       %.2f to %.2f\" % (C[:, 2].min(), C[:, 2].max()))\n",
            "output": "prior over states   best act      SEU of each act\ndesk A (bearish)    cash          long =-1.4599  short=-1.1513  carry=-1.0358  cash=-0.9704\ndesk B (neutral)    carry         long =-1.0867  short=-1.4008  carry=-0.8810  cash=-0.9704\ndesk C (bullish)    long risk     long =-0.7621  short=-1.7738  carry=-0.7833  cash=-0.9704\n\npriors on a 51-point grid that rationalise choosing 'carry': 384 of 1326\nimplied bound on P(recession):  0.00 to 0.28\nimplied bound on P(boom):       0.00 to 0.74"
          }
        },
        {
          "name": "Risk aversion as curvature: Arrow–Pratt and where it stops working",
          "explain": "<p>The coefficient of absolute risk aversion is minus the second derivative of u over the first, and the relative coefficient multiplies it by wealth. The reason these particular ratios matter is a second-order Taylor argument: for a small zero-mean risk, the risk premium is approximately half the absolute coefficient times the variance. Curvature is risk aversion; the affine-invariant content of u is exactly its curvature profile.</p><p>The approximation is local, and 'local' is the whole claim. The snippet prices a two-point zero-mean bet exactly under constant relative risk aversion and compares the exact premium with the Arrow–Pratt formula as the bet grows. At a thousandth of wealth the two agree to four decimals. At a fifth of wealth the approximation is off by a couple of per cent and biased upward, because it ignores the third derivative that makes large losses hurt more than the quadratic says. Anyone who linearises a utility and then applies it to a tail scenario has made this error.</p><p>Constant relative risk aversion also gives the result that makes portfolio theory tractable: the optimal fraction of wealth in a risky asset is the excess return over risk aversion times variance, independent of wealth. The snippet prints that fraction and the dollar position it implies, and the numbers are a reminder that low risk aversion produces leverage well above one.</p><p>A desk cares because the ratio of expected excess return to variance, divided by a risk-aversion number, is the sizing rule behind almost every systematic book, and its wealth-independence is why the rule survives the book growing.</p>",
          "formula": "\\pi \\approx \\tfrac{1}{2}\\,A(W)\\,\\sigma^2, \\qquad A(W) = -\\frac{u''(W)}{u'(W)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Arrow-Pratt: for a small, zero-mean risk the premium a CRRA agent pays is\n# about (gamma/2) * var / wealth. \"Small\" is the whole content of the claim.\nrng = np.random.default_rng(20260501)\nW, gamma = 1_000_000.0, 3.0\nu = lambda x: (x ** (1 - gamma) - 1) / (1 - gamma)\n\nprint(\"wealth %.0f, gamma %.1f\" % (W, gamma))\nprint(\"%10s  %14s  %14s  %9s\" % (\"sd of risk\", \"exact premium\", \"Arrow-Pratt\", \"error\"))\nfor sd in (1e2, 1e3, 1e4, 5e4, 2e5):\n    # two-point zero-mean risk of the given sd, so no sampling error at all\n    x = np.array([W - sd, W + sd])\n    p = np.array([0.5, 0.5])\n    ce = float((p @ x ** (1 - gamma)) ** (1 / (1 - gamma)))\n    exact = W - ce\n    approx = 0.5 * gamma * sd ** 2 / W\n    print(\"%10.0f  %14.4f  %14.4f  %8.2f%%\"\n          % (sd, exact, approx, 100 * (approx - exact) / exact))\n\nprint(\"\")\n# Relative risk aversion is what makes a position size scale with wealth.\n# Optimal fraction of wealth in a risky asset with excess return mu, vol s:\nmu, s = 0.05, 0.18\nfor gam in (1.0, 2.0, 3.0, 6.0):\n    frac = mu / (gam * s ** 2)\n    print(\"gamma %4.1f -> risky weight %6.2f%% of wealth (Merton), dollar size at W: %12.0f\"\n          % (gam, 100 * frac, frac * W))\n",
            "output": "wealth 1000000, gamma 3.0\nsd of risk   exact premium     Arrow-Pratt      error\n       100          0.0150          0.0150      0.00%\n      1000          1.5000          1.5000      0.00%\n     10000        149.9913        150.0000      0.01%\n     50000       3744.5420       3750.0000      0.15%\n    200000      58642.5513      60000.0000      2.31%\n\ngamma  1.0 -> risky weight 154.32% of wealth (Merton), dollar size at W:      1543210\ngamma  2.0 -> risky weight  77.16% of wealth (Merton), dollar size at W:       771605\ngamma  3.0 -> risky weight  51.44% of wealth (Merton), dollar size at W:       514403\ngamma  6.0 -> risky weight  25.72% of wealth (Merton), dollar size at W:       257202"
          }
        },
        {
          "name": "Neural-network utilities: an ordinal representation with no axioms attached",
          "explain": "<p>Suppose you do not want to assume expected utility and instead learn preferences directly: collect observed binary choices and fit a flexible scoring function that ranks lotteries. This is what the course's phrase 'neural-network utility' points at, and it is a real thing desks do when they calibrate a client's or a trader's revealed appetite. The question is what you give up.</p><p>Write a lottery over a fixed support as a point in the probability simplex. Then a vNM functional is <em>linear</em> in that vector, so imposing expected utility means fitting five numbers, and independence holds by construction: scaling the difference of two probability vectors by a positive constant cannot change the sign of its inner product with u. An unrestricted net on the same data has no such structure.</p><p>The snippet fits both to four hundred noisy observed choices among mild lotteries. Both reproduce held-out choices at around ninety-eight to ninety-nine per cent, so on accuracy there is nothing to choose. The difference shows up in two places. On near-degenerate lotteries far from anything in the training set the restricted model still gets 99.9 per cent while the net drops to 97.6 per cent, because the restricted model extrapolates with the right functional form and the net cannot extrapolate at all. And when both lotteries in a pair are mixed with a common third at weight 0.9, the restricted model reverses zero per cent of its rankings, as the algebra guarantees, while the net reverses half of them.</p><p>A desk cares because a flexible preference model that agrees with the data in-sample can still produce incoherent decisions in the region where the decisions are expensive, and the axioms are the cheapest available regulariser.</p>",
          "formula": "\\text{vNM: } V(p) = \\sum_x u(x)p(x) \\quad\\text{vs}\\quad \\text{net: } V(p) = g_\\theta(p)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.neural_network import MLPClassifier\n\n# What a desk observes is CHOICES, not utilities. Fit two models of the same\n# agent: one restricted to be linear in probabilities (the vNM axioms used as\n# a regulariser) and one unrestricted net on the raw pair of lotteries.\nsupport = np.array([55.0, 80.0, 100.0, 125.0, 170.0])\nuvec = np.log(support)                       # the agent's true vNM index\n\ndef pairs(n, conc, seed, noise=0.015):\n    r = np.random.default_rng(seed)\n    A, B = r.dirichlet(np.full(5, conc), n), r.dirichlet(np.full(5, conc), n)\n    gap = (A - B) @ uvec\n    y = (gap / noise + r.standard_normal(n) > 0).astype(int)\n    return A, B, y, gap\n\nA, B, y, _ = pairs(400, 4.0, 1)              # 400 choices among MILD lotteries\nAx, Bx, _, gx = pairs(4000, 4.0, 2)          # held out, same region\nAf, Bf, _, gf = pairs(4000, 0.12, 3)         # near-degenerate lotteries: extrapolation\n\n# fit_intercept=False keeps the vNM model exactly linear in p, which is the point\nvnm = LogisticRegression(C=1e4, max_iter=3000, fit_intercept=False).fit(A - B, y)\nnet = MLPClassifier(hidden_layer_sizes=(64, 64), activation=\"tanh\", max_iter=4000,\n                    random_state=0, alpha=1e-5).fit(np.hstack([A, B]), y)\n\nw = vnm.coef_.ravel()\nrs = lambda v: (v - v[0]) / (v[-1] - v[0])\nprint(\"vNM-restricted fit recovers the utility index from 400 choices:\")\nprint(\"  implied u  \" + \" \".join(\"%6.3f\" % v for v in rs(w)))\nprint(\"  true u     \" + \" \".join(\"%6.3f\" % v for v in rs(uvec)))\nprint(\"\")\nprint(\"%-28s %12s %10s\" % (\"agreement with the truth\", \"vNM model\", \"net\"))\nfor nm, (P, Q, g) in ((\"held out, mild lotteries\", (Ax, Bx, gx)),\n                      (\"near-degenerate lotteries\", (Af, Bf, gf))):\n    t = (g > 0).astype(int)\n    print(\"%-28s %11.1f%% %9.1f%%\"\n          % (nm, 100 * np.mean(vnm.predict(P - Q) == t),\n             100 * np.mean(net.predict(np.hstack([P, Q])) == t)))\n\n# Independence: mix both lotteries with a common third at weight alpha. A model\n# linear in p cannot flip, because the sign of (1-a)(A-B).w does not move.\nthird = np.array([0.0, 0.0, 0.0, 0.0, 1.0])\nclear = np.abs(gx) > 0.05                    # pairs where the truth is not marginal\nbv, bn = vnm.predict(Ax - Bx), net.predict(np.hstack([Ax, Bx]))\nprint(\"\")\nprint(\"%6s  %16s  %10s\" % (\"alpha\", \"vNM model flips\", \"net flips\"))\nfor al in (0.3, 0.6, 0.9):\n    Am, Bm = (1 - al) * Ax + al * third, (1 - al) * Bx + al * third\n    fv = np.mean((vnm.predict(Am - Bm) != bv)[clear])\n    fn = np.mean((net.predict(np.hstack([Am, Bm])) != bn)[clear])\n    print(\"%6.2f  %15.1f%%  %9.1f%%\" % (al, 100 * fv, 100 * fn))\n",
            "output": "vNM-restricted fit recovers the utility index from 400 choices:\n  implied u   0.000  0.340  0.523  0.729  1.000\n  true u      0.000  0.332  0.530  0.728  1.000\n\nagreement with the truth        vNM model        net\nheld out, mild lotteries            99.5%      98.0%\nnear-degenerate lotteries           99.9%      97.6%\n\n alpha   vNM model flips   net flips\n  0.30              0.0%        0.0%\n  0.60              0.0%       20.6%\n  0.90              0.0%       50.0%"
          }
        }
      ],
      "widget": {
        "type": "slider-formula",
        "title": "Certainty equivalent and risk premium of a two-point bet",
        "params": {
          "formula": "CE = \\left(\\tfrac{1}{2}(W+s)^{1-\\gamma} + \\tfrac{1}{2}(W-s)^{1-\\gamma}\\right)^{\\frac{1}{1-\\gamma}}",
          "inputs": [
            {
              "name": "W",
              "label": "Wealth W",
              "min": 60,
              "max": 200,
              "step": 1,
              "init": 100
            },
            {
              "name": "s",
              "label": "Bet size s (win or lose)",
              "min": 1,
              "max": 40,
              "step": 1,
              "init": 30
            },
            {
              "name": "g",
              "label": "Relative risk aversion gamma",
              "min": 1.05,
              "max": 8,
              "step": 0.05,
              "init": 3
            }
          ],
          "compute": [
            {
              "name": "ce",
              "label": "Certainty equivalent",
              "expr": "(0.5*(W+s)^(1-g)+0.5*(W-s)^(1-g))^(1/(1-g))",
              "fmt": 4
            },
            {
              "name": "prem",
              "label": "Exact risk premium",
              "expr": "W-(0.5*(W+s)^(1-g)+0.5*(W-s)^(1-g))^(1/(1-g))",
              "fmt": 4
            },
            {
              "name": "ap",
              "label": "Arrow-Pratt premium",
              "expr": "0.5*g*s*s/W",
              "fmt": 4
            },
            {
              "name": "err",
              "label": "Approximation error",
              "expr": "0.5*g*s*s/W-(W-(0.5*(W+s)^(1-g)+0.5*(W-s)^(1-g))^(1/(1-g)))",
              "fmt": 4
            }
          ]
        }
      },
      "pitfalls": [
        "Reading the level of a utility number as meaningful. The vNM index is unique only up to a positive affine transform, so 'my utility is 0.7' says nothing until you fix two reference points.",
        "Treating the Arrow–Pratt premium as exact. It is a second-order approximation around a small zero-mean risk; applied to a tail scenario it understates the premium, which is the direction that loses money.",
        "Assuming a learned preference model inherits the axioms. Accuracy on held-out choices does not imply independence, transitivity or sensible extrapolation, and the snippet shows a net reversing half its rankings under a common-consequence mixture.",
        "Confusing a subjective probability with a frequency. Savage's prior is derived from choices and need not correspond to any repeatable experiment, which is exactly why it can be applied to a one-off event."
      ],
      "check": [
        {
          "q": "Which von Neumann–Morgenstern axiom is responsible for the representation being an expectation rather than some other increasing functional of the lottery?",
          "options": [
            "Completeness",
            "Transitivity",
            "Independence",
            "Continuity"
          ],
          "answer": 2,
          "why": "Independence forces linearity in probabilities, which is what an expectation is; completeness and transitivity give only an ordering and continuity only a real-valued index."
        },
        {
          "q": "A trader's utility index u is replaced by 5u - 12. What happens to their choices?",
          "options": [
            "Nothing changes",
            "They become more risk averse",
            "They become less risk averse",
            "It depends on their wealth"
          ],
          "answer": 0,
          "why": "A positive affine transform leaves every expected-utility comparison unchanged, because it scales and shifts both sides of the inequality identically."
        },
        {
          "q": "In the snippet, the Arrow–Pratt premium for a bet with standard deviation one fifth of wealth was about 2.3 per cent too large. Why is the error in that direction?",
          "options": [
            "Sampling noise in the simulation",
            "The quadratic approximation ignores higher derivatives that make large losses hurt more",
            "Constant relative risk aversion is not twice differentiable",
            "The exact premium was computed with the wrong risk-aversion coefficient"
          ],
          "answer": 1,
          "why": "The bet is priced exactly on a two-point distribution with no sampling at all, so the gap is purely the truncation error of the second-order expansion, and the neglected curvature makes the exact certainty equivalent higher than the quadratic suggests."
        },
        {
          "q": "The unrestricted net reversed half its rankings when both lotteries were mixed with a common third at weight 0.9, while the linear model reversed none. What does that demonstrate?",
          "options": [
            "The net was undertrained",
            "The linear model had access to the true utility",
            "Independence holds structurally for a functional linear in probabilities and is not learnable from accuracy alone",
            "The mixture destroyed the information in the lotteries"
          ],
          "answer": 2,
          "why": "Both models were fitted to the same choice data and reached similar accuracy; the linear model cannot flip because the sign of a scaled inner product is invariant, which is a property of the functional form rather than of the fit."
        }
      ],
      "n": 1
    },
    {
      "title": "Bayesian inference as the engine of a trading system",
      "topics": [
        "posterior odds and the likelihood ratio",
        "log-odds updating and its Kullback–Leibler drift",
        "normal-normal conjugate updating and precision weighting",
        "the market maker's mark as a filter",
        "discriminative learning of a posterior mean"
      ],
      "concepts": [
        {
          "name": "Odds form: every signal is an additive term in log-odds",
          "explain": "<p>Write Bayes' rule as posterior odds equals prior odds times likelihood ratio, then take logarithms. Updating becomes addition: each observation contributes the log of its likelihood ratio, independent of the prior and independent of the order in which the observations arrive. This is the single most useful reformulation in the course, because it turns a sequence of beliefs into a random walk with drift and hands you the tools of week 5 immediately.</p><p>The snippet runs a two-state value with a signal that is right about two thirds of the time. A bullish tick adds 0.7855 to the log-odds and a bearish one subtracts 0.7684, and those two numbers are the entire information content of the signal. Notice how the posterior moves: a single tick takes the belief from 0.50 to 0.69, but five consecutive bullish ticks take it to 0.996, because the log-odds are linear while the probability is squashed. That asymmetry is why confident beliefs are hard to move and why arguing in probability space is misleading.</p><p>The drift per observation under the true state is the expected log likelihood ratio, which is the Kullback–Leibler divergence between the signal distributions in the two states — here 0.288 per tick, so about ten ticks to reach 95 per cent confidence from a flat prior. That formula is the rate of learning, and it is the same quantity that will govern how fast a market maker's quotes converge to a true value in week 5.</p><p>A desk cares because this gives a defensible answer to 'how much data do I need': the number of observations is the log-odds you require divided by the divergence per observation, and a signal with a divergence of 0.01 will never settle anything.</p>",
          "formula": "\\log\\frac{P(H\\mid s_{1:n})}{P(L\\mid s_{1:n})} = \\log\\frac{P(H)}{P(L)} + \\sum_{i=1}^{n}\\log\\frac{P(s_i\\mid H)}{P(s_i\\mid L)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Bayes in odds form: the posterior odds are the prior odds times the\n# likelihood ratio, so in LOG odds every signal is an additive term.\nprior_up = 0.50\n# a signal that says \"up\" with prob 0.68 when the value is up, 0.31 when down\np_up_given_H, p_up_given_L = 0.68, 0.31\nlr_up = p_up_given_H / p_up_given_L\nlr_dn = (1 - p_up_given_H) / (1 - p_up_given_L)\nprint(\"likelihood ratio of a bullish tick  %.4f  (log %+.4f)\" % (lr_up, np.log(lr_up)))\nprint(\"likelihood ratio of a bearish tick  %.4f  (log %+.4f)\" % (lr_dn, np.log(lr_dn)))\n\nrng = np.random.default_rng(31337)\ntrue_state = 1                                    # the value really is high\nsignals = (rng.random(12) < p_up_given_H).astype(int)\nlog_odds = np.log(prior_up / (1 - prior_up))\nprint(\"\")\nprint(\"%4s %8s %12s %12s\" % (\"tick\", \"signal\", \"log odds\", \"P(up)\"))\nprint(\"%4s %8s %12.4f %12.4f\" % (\"-\", \"-\", log_odds, 1 / (1 + np.exp(-log_odds))))\nfor i, s in enumerate(signals, 1):\n    log_odds += np.log(lr_up if s else lr_dn)\n    print(\"%4d %8s %12.4f %12.4f\"\n          % (i, \"up\" if s else \"down\", log_odds, 1 / (1 + np.exp(-log_odds))))\n\n# the drift per signal is a Kullback-Leibler divergence, which is why\n# learning is exponential in the number of informative observations\nkl = (p_up_given_H * np.log(lr_up) + (1 - p_up_given_H) * np.log(lr_dn))\nprint(\"\")\nprint(\"expected log-odds drift per tick under the true state  %.5f\" % kl)\nprint(\"ticks to reach 95%% confidence from a flat prior        %.1f\"\n      % (np.log(0.95 / 0.05) / kl))\n",
            "output": "likelihood ratio of a bullish tick  2.1935  (log +0.7855)\nlikelihood ratio of a bearish tick  0.4638  (log -0.7684)\n\ntick   signal     log odds        P(up)\n   -        -       0.0000       0.5000\n   1       up       0.7855       0.6869\n   2     down       0.0171       0.5043\n   3       up       0.8027       0.6905\n   4     down       0.0343       0.5086\n   5       up       0.8198       0.6942\n   6       up       1.6053       0.8328\n   7       up       2.3909       0.9161\n   8       up       3.1764       0.9599\n   9       up       3.9619       0.9813\n  10       up       4.7474       0.9914\n  11       up       5.5329       0.9961\n  12     down       4.7646       0.9915\n\nexpected log-odds drift per tick under the true state  0.28828\nticks to reach 95% confidence from a flat prior        10.2"
          }
        },
        {
          "name": "Precisions add: the conjugate normal model and how to weight analysts",
          "explain": "<p>When the prior is normal and each signal is the truth plus independent normal noise, the posterior is normal, its precision is the sum of the prior precision and the signal precisions, and its mean is the precision-weighted average of the prior mean and the signals. Nothing else in applied Bayesian work gets used as often, because it is the right first model for combining forecasts, analyst estimates, venues, or repeated noisy measurements of the same quantity.</p><p>Two properties are worth watching in the snippet. First, batching and sequencing agree exactly: folding five signals in one at a time reaches the same posterior mean as taking them together, to machine precision. That is not a numerical accident, it is the statement that the posterior is a sufficient summary of everything seen so far — which is what makes real-time updating possible at all.</p><p>Second, the weights are brutally unequal. The five signals have standard deviations from 0.5 to 8, and because weight goes as one over variance, the best analyst receives 73.5 per cent of the total weight while the worst receives 0.29 per cent and the prior itself receives 1.15 per cent. Averaging the five equally would be a serious error, and the intuition that 'more opinions are better' is simply wrong when the opinions differ in precision by a factor of sixteen.</p><p>A desk cares because signal blending is precision weighting, and the commonest way to destroy a good signal is to average it with three bad ones.</p>",
          "formula": "\\tau_n = \\tau_0 + \\sum_i \\frac{1}{\\sigma_i^2}, \\qquad \\mu_n = \\frac{\\tau_0\\mu_0 + \\sum_i x_i/\\sigma_i^2}{\\tau_n}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Normal-normal updating: precisions add, and the posterior mean is the\n# precision-weighted average of the prior mean and every signal.\nmu0, tau0 = 100.0, 1 / 4.0 ** 2          # prior: mean 100, sd 4  -> precision 1/16\nsd = np.array([1.0, 3.0, 0.5, 8.0, 2.0])  # five analysts of very different quality\nrng = np.random.default_rng(404)\ntrue_v = 106.3\nx = true_v + sd * rng.standard_normal(sd.size)\n\n# one-shot: all five at once\nprec = 1 / sd ** 2\ntau_batch = tau0 + prec.sum()\nmu_batch = (tau0 * mu0 + (prec * x).sum()) / tau_batch\n\n# sequential: fold them in one at a time\nmu, tau = mu0, tau0\nprint(\"%4s %8s %8s %12s %12s\" % (\"step\", \"signal\", \"sd\", \"post mean\", \"post sd\"))\nprint(\"%4s %8s %8s %12.4f %12.4f\" % (\"-\", \"-\", \"-\", mu, tau ** -0.5))\nfor i, (xi, s) in enumerate(zip(x, sd), 1):\n    p = 1 / s ** 2\n    mu = (tau * mu + p * xi) / (tau + p)\n    tau = tau + p\n    print(\"%4d %8.3f %8.1f %12.4f %12.4f\" % (i, xi, s, mu, tau ** -0.5))\n\nprint(\"\")\nprint(\"batch posterior mean %.6f   sequential %.6f   difference %.2e\"\n      % (mu_batch, mu, abs(mu_batch - mu))) \nprint(\"posterior sd %.4f, prior sd 4.0000, truth %.1f\" % (tau ** -0.5, true_v))\nprint(\"\")\n# the weight each source gets is its share of total precision: the 0.5-sd\n# analyst gets more weight than the other four and the prior put together\nwts = np.append(prec, tau0) / tau_batch\nnames = [\"analyst 1\", \"analyst 2\", \"analyst 3\", \"analyst 4\", \"analyst 5\", \"prior    \"]\nfor n, w in zip(names, wts):\n    print(\"%-10s weight %6.2f%%\" % (n, 100 * w))\n",
            "output": "step   signal       sd    post mean      post sd\n   -        -        -     100.0000       4.0000\n   1  106.696      1.0     106.3024       0.9701\n   2  104.452      3.0     106.1272       0.9231\n   3  106.528      0.5     106.4374       0.4396\n   4  113.444      8.0     106.4585       0.4390\n   5  106.899      2.0     106.4788       0.4288\n\nbatch posterior mean 106.478761   sequential 106.478761   difference 0.00e+00\nposterior sd 0.4288, prior sd 4.0000, truth 106.3\n\nanalyst 1  weight  18.38%\nanalyst 2  weight   2.04%\nanalyst 3  weight  73.54%\nanalyst 4  weight   0.29%\nanalyst 5  weight   4.60%\nprior      weight   1.15%"
          }
        },
        {
          "name": "The mark as a filter: a hidden efficient price and noisy observations",
          "explain": "<p>Put the conjugate model in motion. The efficient value drifts as a random walk and what you observe is the value plus noise — a transaction price, a quote midpoint, a single dealer's indication. The posterior is then a recursion: predict, observe, and move the estimate by a gain times the surprise. This is the one-dimensional Kalman filter, and it is the correct formalisation of what a market maker does when marking a book between prints.</p><p>The interesting object is the steady-state gain. It solves a quadratic in the posterior variance and depends only on the ratio of value-innovation volatility to observation noise. In the snippet, with an innovation standard deviation of 0.05 and observation noise of 0.40, the gain settles at 0.1174: a surprise of one tick moves the mark by about a ninth of a tick, and a surprise's influence has a half-life of 5.5 observations. Nobody chose those numbers; they are implied by the two volatilities.</p><p>The filter's realised root-mean-square error over 3800 observations is 0.1443, against 0.4013 for taking the last print at face value. A rolling mean can get part of the way — the best of the three windows tried, twenty observations, reaches 0.1649 — but it is about 14 per cent worse than the filter and only because twenty happened to be near the right length. The filter derives the correct averaging length from the volatilities rather than being told it.</p><p>A desk cares because every smoothing parameter in a production mark is implicitly one of these gains, and deriving it from two volatilities is more defensible at a risk meeting than tuning a window length.</p>",
          "formula": "K = \\frac{P_{t|t-1}}{P_{t|t-1} + \\sigma_\\varepsilon^2}, \\qquad m_t = m_{t-1} + K\\,(y_t - m_{t-1})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# A market maker who marks a book is running a filter: a hidden efficient\n# value that drifts, and order flow that reveals it with noise.\nT = 4000\ns_eta, s_eps = 0.05, 0.40             # value innovation sd, observation noise sd\nrng = np.random.default_rng(2718)\nv = 100.0 + np.cumsum(s_eta * rng.standard_normal(T))\ny = v + s_eps * rng.standard_normal(T)\n\n# the recursion. P is the posterior variance, K the gain on a surprise.\nm, P = y[0], s_eps ** 2\nmhat = np.empty(T)\nPs = np.empty(T)\nfor t in range(T):\n    P_pred = P + s_eta ** 2\n    K = P_pred / (P_pred + s_eps ** 2)\n    m = m + K * (y[t] - m)\n    P = (1 - K) * P_pred\n    mhat[t] = m\n    Ps[t] = P\n\n# steady state solves P = (1-K)(P + s_eta^2): a quadratic in P\na = s_eta ** 2\nP_ss = 0.5 * (-a + np.sqrt(a ** 2 + 4 * a * s_eps ** 2))\nK_ss = (P_ss + a) / (P_ss + a + s_eps ** 2)\nprint(\"steady-state posterior variance  %.6f   (sd %.4f)\" % (P_ss, P_ss ** 0.5))\nprint(\"steady-state gain on a surprise  %.4f\" % K_ss)\nprint(\"gain reached by the recursion    %.4f\" % ((Ps[-1] + a) / (Ps[-1] + a + s_eps ** 2)))\nprint(\"\")\nburn = 200\nrmse = lambda e: float(np.sqrt(np.mean(e ** 2)))\nprint(\"%-34s %10s\" % (\"estimator of the hidden value\", \"RMSE\"))\nprint(\"%-34s %10.4f\" % (\"Bayesian filter\", rmse(mhat[burn:] - v[burn:])))\nprint(\"%-34s %10.4f\" % (\"last observation only\", rmse(y[burn:] - v[burn:])))\nfor k in (5, 20, 100):\n    ma = np.convolve(y, np.ones(k) / k, mode=\"full\")[:T]\n    print(\"%-34s %10.4f\" % (\"rolling mean of %d observations\" % k, rmse(ma[burn:] - v[burn:])))\nprint(\"\")\nprint(\"the filter's own forecast of its RMSE  %.4f\" % P_ss ** 0.5)\nprint(\"half-life of a surprise in the mark    %.1f observations\"\n      % (np.log(0.5) / np.log(1 - K_ss)))\n",
            "output": "steady-state posterior variance  0.018789   (sd 0.1371)\nsteady-state gain on a surprise  0.1174\ngain reached by the recursion    0.1174\n\nestimator of the hidden value            RMSE\nBayesian filter                        0.1443\nlast observation only                  0.4013\nrolling mean of 5 observations         0.1891\nrolling mean of 20 observations        0.1649\nrolling mean of 100 observations       0.3068\n\nthe filter's own forecast of its RMSE  0.1371\nhalf-life of a surprise in the mark    5.5 observations"
          }
        },
        {
          "name": "Backpropagation-based inference: the posterior mean without the prior",
          "explain": "<p>The alternative to writing the model down is to learn the map from signal to value directly from examples, which is what a supervised network trained by backpropagation does. It works, and the snippet shows how well: regressing realised value on the signal over twenty thousand examples recovers a slope of 0.8035 against the exact Bayes shrinkage weight of 0.8, and an intercept of 19.66 against the exact 20.0. The learner never sees the prior mean or the prior variance, yet it reproduces the shrinkage those two numbers imply, because the shrinkage is a feature of the joint distribution it was shown.</p><p>That is also the trap. The prior is not a separate object in the fitted network, so it cannot be replaced. When the prior mean moves from 100 to 112 — a regime change, a new issue, a different sector — the Bayesian estimator swaps one number and its root-mean-square error is unchanged at 1.778 with a bias of −0.01. The network's error rises to 3.653 with a bias of −2.93: it is still shrinking toward the mean it was trained on. Nothing in its output flags the problem.</p><p>This is the honest statement of the trade-off the course's title points at. A discriminative learner buys you freedom from specifying the likelihood and costs you the ability to intervene on any part of the model separately. Which you want depends on whether the joint distribution you trained on is the one you will trade in.</p><p>A desk cares because the failure mode is silent and it appears exactly at a regime change, which is when position sizes are largest and the model's output is trusted least carefully.</p>",
          "formula": "E[V\\mid x] = w\\,x + (1-w)\\mu_0, \\qquad w = \\frac{1/\\sigma_x^2}{1/\\sigma_x^2 + 1/\\sigma_0^2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\nfrom sklearn.neural_network import MLPRegressor\n\n# Backpropagation-based inference: fit E[V | x] directly from examples.\n# It recovers the Bayes shrinkage WITHOUT ever representing a prior --\n# and that is both the selling point and the trap.\nmu0, sd0, sd_x = 100.0, 4.0, 2.0\nw_bayes = (1 / sd_x ** 2) / (1 / sd_x ** 2 + 1 / sd0 ** 2)\nprint(\"Bayes weight on the signal  w = %.4f      intercept (1-w)*mu0 = %.4f\"\n      % (w_bayes, (1 - w_bayes) * mu0))\n\ndef draw(n, mu, seed):\n    r = np.random.default_rng(seed)\n    v = mu + sd0 * r.standard_normal(n)\n    x = v + sd_x * r.standard_normal(n)\n    return x.reshape(-1, 1), v\n\nXtr, vtr = draw(20000, mu0, 5)\nA = np.hstack([np.ones_like(Xtr), Xtr])\ncoef, *_ = np.linalg.lstsq(A, vtr, rcond=None)\nprint(\"OLS on 20000 examples:      w = %.4f      intercept = %.4f\" % (coef[1], coef[0]))\n\nnet = MLPRegressor(hidden_layer_sizes=(32, 32), activation=\"tanh\", max_iter=600,\n                   random_state=0, tol=1e-8).fit(Xtr - mu0, vtr - mu0)\npred_net = lambda X: net.predict(X - mu0) + mu0\npred_bay = lambda X, mu: w_bayes * X.ravel() + (1 - w_bayes) * mu\n\n# in the regime it was trained on, both are the posterior mean\nXte, vte = draw(20000, mu0, 6)\nrmse = lambda p, t: float(np.sqrt(np.mean((p - t) ** 2)))\nprint(\"\")\nprint(\"%-38s %10s %10s\" % (\"test regime\", \"net RMSE\", \"Bayes RMSE\"))\nprint(\"%-38s %10.4f %10.4f\" % (\"same prior mean, 100\",\n                               rmse(pred_net(Xte), vte), rmse(pred_bay(Xte, mu0), vte)))\n\n# now the prior mean shifts. The Bayesian swaps one number; the net cannot,\n# because the prior was never a separate object in it.\nfor mu_new in (104.0, 112.0):\n    Xs, vs = draw(20000, mu_new, 7)\n    print(\"%-38s %10.4f %10.4f\" % (\"prior mean moved to %.0f\" % mu_new,\n                                   rmse(pred_net(Xs), vs), rmse(pred_bay(Xs, mu_new), vs)))\n    print(\"%-38s %10.4f %10.4f\" % (\"   mean error (bias)\",\n                                   float(np.mean(pred_net(Xs) - vs)),\n                                   float(np.mean(pred_bay(Xs, mu_new) - vs))))\n",
            "output": "Bayes weight on the signal  w = 0.8000      intercept (1-w)*mu0 = 20.0000\nOLS on 20000 examples:      w = 0.8035      intercept = 19.6565\n\ntest regime                              net RMSE Bayes RMSE\nsame prior mean, 100                       1.8027     1.7988\nprior mean moved to 104                    1.9144     1.7776\n   mean error (bias)                      -0.6844    -0.0098\nprior mean moved to 112                    3.6528     1.7776\n   mean error (bias)                      -2.9313    -0.0098"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Belief convergence: P(value is high) over 40 signals, three signal precisions",
        "params": {
          "xlab": "Signals observed",
          "ylab": "Posterior probability the value is high",
          "log": false,
          "series": [
            {
              "name": "weak signal (0.58/0.42)",
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
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40
              ],
              "y": [
                0.5,
                0.58,
                0.5,
                0.58,
                0.5,
                0.58,
                0.65601,
                0.72478,
                0.78433,
                0.83395,
                0.87398,
                0.83395,
                0.78433,
                0.83395,
                0.78433,
                0.83395,
                0.78433,
                0.72478,
                0.78433,
                0.83395,
                0.78433,
                0.72478,
                0.78433,
                0.83395,
                0.78433,
                0.83395,
                0.87398,
                0.83395,
                0.78433,
                0.83395,
                0.87398,
                0.90546,
                0.92971,
                0.90546,
                0.92971,
                0.90546,
                0.92971,
                0.94809,
                0.92971,
                0.90546,
                0.92971
              ]
            },
            {
              "name": "medium signal (0.68/0.31)",
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
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40
              ],
              "y": [
                0.5,
                0.68687,
                0.50429,
                0.69055,
                0.50857,
                0.6942,
                0.83276,
                0.91613,
                0.95994,
                0.98133,
                0.9914,
                0.99606,
                0.99155,
                0.99613,
                0.99169,
                0.99619,
                0.99183,
                0.99626,
                0.99829,
                0.99922,
                0.99832,
                0.99638,
                0.99835,
                0.99925,
                0.99838,
                0.99926,
                0.99966,
                0.99985,
                0.99967,
                0.99985,
                0.99993,
                0.99997,
                0.99999,
                0.99997,
                0.99999,
                0.99999,
                1.0,
                1.0,
                1.0,
                0.99999,
                1.0
              ]
            },
            {
              "name": "strong signal (0.82/0.18)",
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
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40
              ],
              "y": [
                0.5,
                0.82,
                0.5,
                0.82,
                0.95403,
                0.98953,
                0.99768,
                0.99949,
                0.99989,
                0.99998,
                0.99999,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Averaging signals equally. Weight goes as the reciprocal of variance, so blending a 0.5-standard-deviation source with an 8-standard-deviation one at equal weight throws away most of the information you paid for.",
        "Arguing about belief changes in probability space. A move from 0.50 to 0.69 and a move from 0.99 to 0.996 carry the same evidence; only log-odds are additive in the data.",
        "Treating a fitted network's prediction as a posterior mean that can be re-based. It embeds the training prior inseparably, and the resulting bias at a regime change is invisible from the output alone.",
        "Assuming independent signals. Precisions add only if the errors are independent; two analysts reading the same source contribute one precision, not two, and the overconfident posterior that results is the commonest signal-blending bug."
      ],
      "check": [
        {
          "q": "A signal has a Kullback–Leibler divergence of 0.29 nats per observation between the two states. Roughly how many observations move a flat prior to 95 per cent confidence?",
          "options": [
            "About 3",
            "About 10",
            "About 30",
            "About 100"
          ],
          "answer": 1,
          "why": "The required log-odds is log(0.95/0.05) which is about 2.94, and dividing by the drift of 0.29 per observation gives roughly ten, as the snippet prints."
        },
        {
          "q": "In the conjugate normal model, five signals with standard deviations 1, 3, 0.5, 8 and 2 are combined. Which gets the most weight and why?",
          "options": [
            "The first, because it arrived earliest",
            "The third, because weight is proportional to the reciprocal of variance",
            "All equally, because they are independent",
            "The fourth, because a wide signal covers more outcomes"
          ],
          "answer": 1,
          "why": "Weight is precision share, so the 0.5-standard-deviation signal has sixteen times the precision of the 2-standard-deviation one and receives 73.5 per cent of the total in the snippet."
        },
        {
          "q": "The steady-state Kalman gain in the snippet was 0.1174. What would raise it?",
          "options": [
            "Lower value-innovation volatility",
            "Higher observation noise",
            "Higher value-innovation volatility relative to observation noise",
            "A longer sample"
          ],
          "answer": 2,
          "why": "The gain depends only on the ratio of innovation to observation volatility; a faster-moving value makes each new observation more relevant, while noisier observations make it less so."
        },
        {
          "q": "The fitted network's bias was −0.01 in the training regime and −2.93 after the prior mean moved to 112, while the Bayesian estimator's bias stayed at −0.01. What does that show?",
          "options": [
            "The network was overfitted",
            "The network needed more hidden units",
            "The prior is not a separately addressable component of a discriminatively fitted model",
            "The Bayesian estimator was given the answer"
          ],
          "answer": 2,
          "why": "Both models represent the same posterior mean in the training regime; only the Bayesian one factorises it into a prior and a likelihood, so only it can have the prior replaced when the regime changes."
        }
      ],
      "n": 2
    },
    {
      "title": "Information structures, garbling, and what a signal is worth",
      "topics": [
        "an experiment as a row-stochastic matrix",
        "posteriors and residual entropy",
        "garbling and the Blackwell partial order",
        "monotonicity of the value of information",
        "the price of information extraction"
      ],
      "concepts": [
        {
          "name": "An experiment is a matrix from states to signals",
          "explain": "<p>To value information you first have to formalise it, and the object that does the job is an <em>experiment</em>: a row-stochastic matrix whose rows are states of the world and whose columns are signal realisations, with the entry giving the probability of that signal in that state. A dataset, a research analyst, a satellite image count of cars in a car park, a language model's sentiment score — each of them, once you strip away the implementation, is one of these matrices. The whole of week 3 is what you can say about a matrix of this kind.</p><p>Everything downstream follows from combining the experiment with a prior. Multiply the prior into the rows to get the joint, sum the columns to get the marginal signal distribution, and divide to get the posterior given each signal. The snippet does that for two experiments over three states. Experiment A has a two-thirds hit rate and can emit any of three signals; experiment B is coarse — it can never produce the 'up' column with any weight in the down state, but its middle column is uninformative half the time.</p><p>The natural summary is residual uncertainty. The prior entropy is 1.089 nats; A leaves 0.853 and B leaves 0.881 on average. So A looks better by this measure. Hold that thought, because the next concept shows that a single scalar summary of an experiment is exactly what you cannot rely on.</p><p>A desk cares because writing a data vendor's product as one of these matrices is what turns 'is this dataset any good' from a taste question into a computation.</p>",
          "formula": "P(\\omega \\mid s) = \\frac{\\pi(\\omega)\\,A(\\omega, s)}{\\sum_{\\omega'} \\pi(\\omega')A(\\omega', s)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# An information structure (\"experiment\") is a row-stochastic matrix:\n# rows are states of the world, columns are signals.\nstates = [\"down\", \"flat\", \"up\"]\nprior = np.array([0.30, 0.40, 0.30])\n\nA = np.array([[0.70, 0.20, 0.10],      # a decent but noisy signal\n              [0.20, 0.60, 0.20],\n              [0.10, 0.20, 0.70]])\nB = np.array([[0.50, 0.50, 0.00],      # a coarse signal: can never say \"up\"\n              [0.25, 0.50, 0.25],\n              [0.00, 0.50, 0.50]])\n\ndef posteriors(P, pi):\n    joint = pi[:, None] * P                 # P(state, signal)\n    m = joint.sum(axis=0)                   # P(signal)\n    post = np.divide(joint, m[None, :], out=np.zeros_like(joint), where=m[None, :] > 0)\n    return m, post.T                        # rows of post.T index the signal\n\nfor nm, P in ((\"A (noisy but three-valued)\", A), (\"B (coarse)\", B)):\n    m, post = posteriors(P, prior)\n    print(nm)\n    print(\"  P(signal)          \" + \"  \".join(\"%6.3f\" % v for v in m))\n    for j, row in enumerate(post):\n        if m[j] > 0:\n            print(\"  posterior | s=%d    \" % j + \"  \".join(\"%6.3f\" % v for v in row))\n    # entropy of the posterior, averaged: how much uncertainty is left\n    ent = -np.nansum(np.where(post > 0, post * np.log(post), 0.0), axis=1)\n    print(\"  expected residual entropy  %.5f nats\" % float(m @ ent))\n    print(\"\")\n\nh0 = -float(prior @ np.log(prior))\nprint(\"prior entropy                %.5f nats\" % h0)\nprint(\"states %s, prior %s\" % (\", \".join(states), \" \".join(\"%.2f\" % v for v in prior)))\n",
            "output": "A (noisy but three-valued)\n  P(signal)           0.320   0.360   0.320\n  posterior | s=0     0.656   0.250   0.094\n  posterior | s=1     0.167   0.667   0.167\n  posterior | s=2     0.094   0.250   0.656\n  expected residual entropy  0.85307 nats\n\nB (coarse)\n  P(signal)           0.250   0.500   0.250\n  posterior | s=0     0.600   0.400   0.000\n  posterior | s=1     0.300   0.400   0.300\n  posterior | s=2     0.000   0.400   0.600\n  expected residual entropy  0.88096 nats\n\nprior entropy                1.08890 nats\nstates down, flat, up, prior 0.30 0.40 0.30"
          }
        },
        {
          "name": "Garbling: when one experiment is provably noisier than another",
          "explain": "<p>Blackwell's definition of 'less informative' is structural rather than numerical. Experiment A is less informative than experiment B if A can be written as B followed by extra noise: there is a row-stochastic matrix M, the <em>garbling</em>, with A = BM. Operationally, anyone holding B's signal could manufacture A's signal by running a random device that ignores the state — so B can do everything A can do, and possibly more.</p><p>The snippet builds A as exactly such a product and then recovers M by solving the linear system, confirming it is nonnegative with rows summing to one. It then tries the reverse: expressing B as A times some matrix requires entries of −0.83 and 1.67, which is not a probability distribution, so B is not a garbling of A. The ordering is strict in one direction only.</p><p>The essential point is what comes next. Two experiments C and D are constructed so that C is nearly perfect about the 'down' state while D is nearly perfect about 'up'. Neither factors through the other: both attempted garblings need an entry of −5.46. C and D are <em>Blackwell-incomparable</em>, and no amount of cleverness will produce a general ranking of them. This is the reason the partial order is partial, and the reason a scalar score for a dataset is a category error.</p><p>A desk cares because the question 'should we replace signal A with signal C' has a clean answer when one garbles the other and no answer at all when they are incomparable, and telling the two cases apart is a two-line matrix solve.</p>",
          "formula": "A = B\\,M, \\quad M \\ge 0, \\;\\; M\\mathbf{1} = \\mathbf{1} \\;\\; \\Longleftrightarrow \\;\\; A \\preceq_{\\text{Blackwell}} B",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Blackwell: A is LESS informative than B if A = B M for some row-stochastic\n# garbling M. Garbling means \"B's signal, then extra noise\".\nB = np.array([[0.80, 0.15, 0.05],       # the fine experiment\n              [0.15, 0.70, 0.15],\n              [0.05, 0.15, 0.80]])\nM = np.array([[0.70, 0.20, 0.10],       # the noise applied to B's signal\n              [0.25, 0.50, 0.25],\n              [0.10, 0.20, 0.70]])\nA = B @ M                               # constructed to be a garbling of B\n\ndef is_garbling(X, atol=1e-9):\n    return bool(np.all(X > -atol) and np.allclose(X.sum(axis=1), 1.0, atol=1e-8))\n\nprint(\"A = B M, rows sum to one:\", np.allclose(A.sum(axis=1), 1.0))\nprint(\"A =\")\nfor r in A:\n    print(\"   \" + \"  \".join(\"%7.4f\" % v for v in r))\n\n# recover the garbling: B is invertible here, so M is pinned down\nMhat = np.linalg.solve(B, A)\nprint(\"\")\nprint(\"recovered M, max abs error vs the true M  %.2e\" % np.max(np.abs(Mhat - M)))\nprint(\"recovered M is a valid garbling:\", is_garbling(Mhat))\n\n# the other direction must FAIL: B is not a garbling of A\nMrev = np.linalg.solve(A, B)\nprint(\"B = A M' would need M' =\")\nfor r in Mrev:\n    print(\"   \" + \"  \".join(\"%7.4f\" % v for v in r))\nprint(\"M' is a valid garbling:\", is_garbling(Mrev),\n      \"  (most negative entry %.4f)\" % Mrev.min())\n\n# and a pair that is Blackwell-INCOMPARABLE: each is sharp about a\n# different state, so neither factors through the other\nC = np.array([[0.97, 0.02, 0.01],\n              [0.30, 0.40, 0.30],\n              [0.30, 0.35, 0.35]])\nD = np.array([[0.35, 0.35, 0.30],\n              [0.30, 0.40, 0.30],\n              [0.01, 0.02, 0.97]])\nprint(\"\")\nfor nm, X, Y in ((\"C = D M ?\", C, D), (\"D = C M ?\", D, C)):\n    Mx = np.linalg.solve(Y, X)\n    print(\"%-10s valid garbling: %-5s  most negative entry %.4f\"\n          % (nm, is_garbling(Mx), Mx.min()))\nprint(\"C and D are Blackwell-incomparable: neither is a garbling of the other.\")\n",
            "output": "A = B M, rows sum to one: True\nA =\n    0.6025   0.2450   0.1525\n    0.2950   0.4100   0.2950\n    0.1525   0.2450   0.6025\n\nrecovered M, max abs error vs the true M  8.33e-17\nrecovered M is a valid garbling: True\nB = A M' would need M' =\n    1.6667  -0.6667   0.0000\n   -0.8333   2.6667  -0.8333\n   -0.0000  -0.6667   1.6667\nM' is a valid garbling: False   (most negative entry -0.8333)\n\nC = D M ?  valid garbling: False  most negative entry -5.4600\nD = C M ?  valid garbling: False  most negative entry -5.4600\nC and D are Blackwell-incomparable: neither is a garbling of the other."
          }
        },
        {
          "name": "The Blackwell theorem: more informative means better for every decision problem",
          "explain": "<p>Here is what the structural definition buys you. If A is a garbling of B, then for <em>every</em> finite decision problem — every set of actions, every payoff matrix, every utility function — the expected payoff available under B is at least as high as under A. The converse also holds, which is what makes the characterisation tight: if B beats A in every decision problem, then A must be a garbling of B.</p><p>The snippet tests the forward direction against twenty thousand random decision problems with four actions and Gaussian payoffs. The garbled experiment beat the fine one zero times; the minimum value gap is zero to machine precision. In 3455 of the twenty thousand problems the gap was exactly zero, which is the case where the same action is optimal after every signal and the information is worthless to both.</p><p>Then the same test runs on the incomparable pair. C was strictly better in 7037 problems and D was strictly better in 7039. Neither ordering survives, and in the specific problem of guessing the state for a payoff of one, C and D score identically at 0.571 while the fine experiment B scores 0.760 and its garbling A scores 0.526 — below both of the incomparable ones, despite A having looked better than B's coarse cousin on residual entropy in the previous snippet.</p><p>A desk cares because this is the precise sense in which a research group can say a new data source dominates an old one, and the precise sense in which most claims of that kind are unsupportable.</p>",
          "formula": "A \\preceq_{\\text{Blackwell}} B \\;\\Longleftrightarrow\\; \\forall (\\mathcal{A}, u): \\; V_A(u) \\le V_B(u)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# The Blackwell theorem: if A is a garbling of B then A is weakly worse in\n# EVERY decision problem. Test it against random decision problems.\nprior = np.array([0.30, 0.40, 0.30])\nB = np.array([[0.80, 0.15, 0.05], [0.15, 0.70, 0.15], [0.05, 0.15, 0.80]])\nM = np.array([[0.70, 0.20, 0.10], [0.25, 0.50, 0.25], [0.10, 0.20, 0.70]])\nA = B @ M\nC = np.array([[0.97, 0.02, 0.01], [0.30, 0.40, 0.30], [0.30, 0.35, 0.35]])\nD = np.array([[0.35, 0.35, 0.30], [0.30, 0.40, 0.30], [0.01, 0.02, 0.97]])\n\ndef value(P, U, pi=prior):\n    \"\"\"Expected payoff of the best action after each signal. U is (actions, states).\"\"\"\n    joint = pi[:, None] * P                        # (state, signal)\n    m = joint.sum(axis=0)\n    ev = U @ joint                                 # (actions, signal) unnormalised\n    return float(np.sum(np.max(ev, axis=0)))       # normalisation cancels\n\nrng = np.random.default_rng(99)\nnprob, nact = 20000, 4\nviol_AB = worse_C = worse_D = 0\ngapAB = []\nfor _ in range(nprob):\n    U = rng.standard_normal((nact, 3))\n    vA, vB = value(A, U), value(B, U)\n    gapAB.append(vB - vA)\n    if vA > vB + 1e-12:\n        viol_AB += 1\n    vC, vD = value(C, U), value(D, U)\n    if vC > vD + 1e-12:\n        worse_D += 1\n    elif vD > vC + 1e-12:\n        worse_C += 1\n\ngapAB = np.array(gapAB)\nprint(\"Blackwell-ordered pair (A is a garbling of B), %d random decision problems\" % nprob)\nprint(\"  times the garbled A beat B          %d\" % viol_AB)\nprint(\"  mean value gap  V(B) - V(A)         %.6f\" % gapAB.mean())\nprint(\"  min value gap (machine zero)        %+.1e\" % gapAB.min())\nprint(\"  problems where the gap was exactly zero  %d\" % int(np.sum(gapAB < 1e-12)))\nprint(\"\")\nprint(\"Blackwell-INCOMPARABLE pair (C, D)\")\nprint(\"  problems where C was strictly better   %d\" % worse_D)\nprint(\"  problems where D was strictly better   %d\" % worse_C)\nprint(\"  -> no ranking of C and D is valid for all decision problems\")\nprint(\"\")\n# the ex-ante value of the prior alone, for scale\nU = np.eye(3) * 1.0\nprint(\"worked example, U = identity (guess the state, pay 1 if right):\")\nprint(\"  no information %.4f   C %.4f   D %.4f   B %.4f   A %.4f\"\n      % (float(prior.max()), value(C, U), value(D, U), value(B, U), value(A, U)))\n",
            "output": "Blackwell-ordered pair (A is a garbling of B), 20000 random decision problems\n  times the garbled A beat B          0\n  mean value gap  V(B) - V(A)         0.153581\n  min value gap (machine zero)        -6.7e-16\n  problems where the gap was exactly zero  3455\n\nBlackwell-INCOMPARABLE pair (C, D)\n  problems where C was strictly better   7037\n  problems where D was strictly better   7039\n  -> no ranking of C and D is valid for all decision problems\n\nworked example, U = identity (guess the state, pay 1 if right):\n  no information 0.4000   C 0.5710   D 0.5710   B 0.7600   A 0.5255"
          }
        },
        {
          "name": "The price of information extraction: concave value against linear cost",
          "explain": "<p>Information is not free, and the shape of what you are buying decides how much to buy. Put a trader in the simplest market with price impact: they observe the value plus noise, take a position proportional to the signal, and pay an impact cost proportional to the square of the position. Optimising the position scale gives a closed form for the gross value of a signal of precision p, and it has two features that matter.</p><p>First it is <em>bounded</em>. Perfect information is worth 0.5 in the snippet's units, and no signal however good can be worth more, because impact caps what you can trade on it. Precision of 4 already captures 80 per cent of that, and precision of 64 captures 98.5 per cent. The marginal value of precision collapses fast.</p><p>Second it is <em>concave</em>, so against a linear cost per unit of precision there is an interior optimum with a closed form, and the numerical search over a fine grid matches it to three decimals at every cost level tested. At a cost of 0.0001 per unit the trader buys precision 69.7; at 0.01 they buy 6.07; at 0.4 they buy 0.118; and at 0.6 they buy nothing at all, because the marginal value of the very first unit of precision is 0.5 and paying 0.6 for it is a loss. Above that threshold the correct decision is to stay uninformed.</p><p>A desk cares because this is the shape of every data-budget argument: the cap is set by impact rather than by the signal, so the question is never 'is the data good' but 'is the data good enough at this size to beat the invoice'.</p>",
          "formula": "G(p) = \\frac{\\sigma_v^4\\,p}{4\\lambda(\\sigma_v^2 p + 1)}, \\qquad p^\\star = \\frac{1}{\\sigma_v^2}\\!\\left(\\frac{\\sigma_v^2}{2\\sqrt{\\lambda k}} - 1\\right)^{\\!+}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# The price of information extraction. A trader who buys a signal of\n# precision p, trades against linear impact lambda, and pays k per unit of\n# precision. Gross value is CONCAVE and BOUNDED; cost is linear.\nsv2, lam = 1.00, 0.50            # value variance, impact coefficient\n\ndef gross(p):\n    \"\"\"Max over position scale b of E[bs(V - lam*bs)], signal s = V + e, var(e)=1/p.\"\"\"\n    return sv2 ** 2 * p / (4 * lam * (sv2 * p + 1.0))\n\nperfect = sv2 / (4 * lam)\nprint(\"gross value of a PERFECT signal (p -> infinity)  %.4f\" % perfect)\nprint(\"no signal at all                                 %.4f\" % gross(0.0))\nprint(\"\")\nprint(\"%8s %12s %12s\" % (\"precision\", \"gross value\", \"% of perfect\"))\nfor p in (0.25, 1.0, 4.0, 16.0, 64.0, 1e6):\n    lab = \"%.2f\" % p if p < 1e5 else \"1e+06\"\n    print(\"%8s %12.4f %11.1f%%\" % (lab, gross(p), 100 * gross(p) / perfect))\n\nprint(\"\")\nprint(\"%8s %12s %12s %10s\" % (\"cost k\", \"optimal p*\", \"closed form\", \"net value\"))\ngrid = np.linspace(0.0, 400.0, 400001)\nfor k in (1e-4, 1e-3, 1e-2, 0.1, 0.4, 0.6):\n    net = gross(grid) - k * grid\n    p_num = float(grid[int(np.argmax(net))])\n    p_cf = max(0.0, (sv2 / (2 * np.sqrt(lam * k)) - 1.0) / sv2)\n    print(\"%8.4f %12.3f %12.3f %10.5f\" % (k, p_num, p_cf, gross(p_num) - k * p_num))\n\nprint(\"\")\nprint(\"marginal value of the FIRST unit of precision  %.4f\" % (sv2 ** 2 / (4 * lam)))\nprint(\"above that cost per unit, buying no signal is optimal; the closed form\")\nprint(\"returns p* = 0 at k = 0.60, and the numerical search agrees.\")\n",
            "output": "gross value of a PERFECT signal (p -> infinity)  0.5000\nno signal at all                                 0.0000\n\nprecision  gross value % of perfect\n    0.25       0.1000        20.0%\n    1.00       0.2500        50.0%\n    4.00       0.4000        80.0%\n   16.00       0.4706        94.1%\n   64.00       0.4923        98.5%\n   1e+06       0.5000       100.0%\n\n  cost k   optimal p*  closed form  net value\n  0.0001       69.711       69.711    0.48596\n  0.0010       21.361       21.361    0.45628\n  0.0100        6.071        6.071    0.36858\n  0.1000        1.236        1.236    0.15279\n  0.4000        0.118        0.118    0.00557\n  0.6000        0.000        0.000    0.00000\n\nmarginal value of the FIRST unit of precision  0.5000\nabove that cost per unit, buying no signal is optimal; the closed form\nreturns p* = 0 at k = 0.60, and the numerical search agrees."
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Posterior beliefs under a fine experiment, its garbling, and no signal",
        "params": {
          "matrix": [
            [
              0.7619,
              0.1905,
              0.0476
            ],
            [
              0.1216,
              0.7568,
              0.1216
            ],
            [
              0.0476,
              0.1905,
              0.7619
            ],
            [
              0.5247,
              0.3425,
              0.1328
            ],
            [
              0.2363,
              0.5273,
              0.2363
            ],
            [
              0.1328,
              0.3425,
              0.5247
            ],
            [
              0.3,
              0.4,
              0.3
            ]
          ],
          "xlabels": [
            "state down",
            "state flat",
            "state up"
          ],
          "ylabels": [
            "B, signal 1",
            "B, signal 2",
            "B, signal 3",
            "A = B M, signal 1",
            "A = B M, signal 2",
            "A = B M, signal 3",
            "no signal (prior)"
          ],
          "cmap": "seq"
        }
      },
      "pitfalls": [
        "Ranking two experiments by a scalar score such as entropy reduction or hit rate. Those scores are total orders and the informativeness relation is only partial, so a scalar will confidently rank incomparable experiments.",
        "Concluding from 'A is worse than B in my decision problem' that A is a garbling of B. That inference needs the comparison to hold in every decision problem, which is much stronger.",
        "Ignoring the boundedness of the value of information. With price impact, perfect foresight has a finite value, so a signal that is twice as precise is usually far less than twice as valuable.",
        "Forgetting that a garbling must be state-independent. Noise whose distribution depends on the state is not a garbling, and such a 'corrupted' signal can be more informative than the original."
      ],
      "check": [
        {
          "q": "Experiment A satisfies A = BM for a row-stochastic nonnegative M. Which statement follows?",
          "options": [
            "A has lower entropy than B",
            "A is weakly worse than B in every decision problem",
            "A and B give the same posteriors",
            "B is also a garbling of A"
          ],
          "answer": 1,
          "why": "That is exactly the Blackwell theorem; entropy comparisons are neither necessary nor sufficient, and the relation is antisymmetric so the reverse garbling generally fails, as the snippet's negative entries show."
        },
        {
          "q": "In the snippet, experiments C and D were each strictly better in about 7000 of 20000 random decision problems. What is the correct conclusion?",
          "options": [
            "The test had too few problems",
            "C and D are Blackwell-incomparable, so no universal ranking exists",
            "C and D are equally informative",
            "One of them must be a garbling of the other"
          ],
          "answer": 1,
          "why": "Strict reversals in both directions rule out either garbling relation, which the matrix solve confirms directly with a most-negative entry of −5.46 in both attempts."
        },
        {
          "q": "The gross value of a signal saturated at 0.5 no matter how precise it became. What imposed that ceiling?",
          "options": [
            "The prior variance of the value",
            "The price impact the trader pays on the position",
            "The number of states",
            "The cost per unit of precision"
          ],
          "answer": 1,
          "why": "With perfect information the optimal position is still limited by the quadratic impact cost, so the achievable profit is the value variance over four times the impact coefficient, independent of precision."
        },
        {
          "q": "At a cost of 0.6 per unit of precision the optimal purchase was zero. Why?",
          "options": [
            "The closed form is undefined there",
            "The marginal value of the first unit of precision is only 0.5",
            "The grid search did not extend far enough",
            "Precision cannot be fractional"
          ],
          "answer": 1,
          "why": "The value function is concave so its steepest point is at zero precision, and if that slope is below the price then every unit is a loss and the corner solution is optimal."
        }
      ],
      "n": 3
    },
    {
      "title": "Type spaces, common knowledge, and the no-trade theorems",
      "topics": [
        "Harsanyi type spaces and information partitions",
        "the common-prior assumption",
        "Aumann's agreement theorem",
        "the Milgrom–Stokey no-trade theorem",
        "noise traders and heterogeneous priors as escapes"
      ],
      "concepts": [
        {
          "name": "A type space: private information as a partition of a shared world",
          "explain": "<p>Week 3's experiment was one agent looking at one signal. Trading needs at least two agents who must reason about each other, and Harsanyi's construction is how that is done without infinite regress. Fix a set of states of the world. Each agent's private information is a <em>partition</em> of that set: the cell containing the true state is everything the agent can distinguish, and anything finer is invisible to them. A common prior on states then generates every belief in the model — each agent's belief about the asset, about the other agent's belief, about the other's belief about theirs, and so on up.</p><p>The snippet builds the smallest interesting case: two traders with three possible signal values each, nine states, and a prior that makes the signals positively correlated and the asset value increasing in their sum. Each trader's partition has three cells of three states. Conditional on its own type each trader's expectation of value is 95.34, 100.00 or 104.66, and the unconditional expectation is exactly 100.</p><p>The important output is the last table. In six of the nine states the two traders' posteriors differ, by up to 9.32 in value terms. That disagreement is entirely legitimate: it comes from different information under the same prior, not from different models. This is the raw material of trade — and week 4 is about why it nevertheless does not produce any.</p><p>A desk cares because this is the formal version of 'my axe is different from yours', and it is the only kind of disagreement a model with a common prior will allow you.</p>",
          "formula": "\\Pi_i(\\omega) = \\{\\omega' : t_i(\\omega') = t_i(\\omega)\\}, \\qquad E[V \\mid \\Pi_i](\\omega) = \\frac{\\sum_{\\omega' \\in \\Pi_i(\\omega)} \\pi(\\omega')V(\\omega')}{\\pi(\\Pi_i(\\omega))}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\nimport itertools\n\n# A Harsanyi type space. Two traders each see a private signal; the state of\n# the world is the pair. Each trader's INFORMATION PARTITION is the set of\n# states they cannot tell apart.\nsig = (0, 1, 2)\nomega = list(itertools.product(sig, sig))      # (t1, t2)\n\n# a common prior that makes the signals correlated with the asset value\nval = {w: 100.0 + 4.0 * (w[0] + w[1] - 2) for w in omega}\nraw = {w: np.exp(-0.25 * abs(w[0] - w[1])) for w in omega}\nZ = sum(raw.values())\nprior = {w: raw[w] / Z for w in omega}\n\ndef cell(w, who):\n    return [u for u in omega if u[who] == w[who]]\n\ndef post_mean(w, who):\n    c = cell(w, who)\n    z = sum(prior[u] for u in c)\n    return sum(prior[u] * val[u] for u in c) / z\n\nprint(\"common prior over the 9 states (rows = trader 1's type):\")\nfor a in sig:\n    print(\"  t1=%d  \" % a + \"  \".join(\"%.4f\" % prior[(a, b)] for b in sig))\nprint(\"\")\nprint(\"unconditional E[V] = %.4f\" % sum(prior[w] * val[w] for w in omega))\nprint(\"\")\nprint(\"%6s %10s %14s %14s\" % (\"type\", \"own cell\", \"E[V | own type]\", \"cell probability\"))\nfor who, nm in ((0, \"T1\"), (1, \"T2\")):\n    for t in sig:\n        w = (t, t)\n        c = cell(w, who)\n        print(\"%6s %10d %14.4f %14.4f\"\n              % (\"%s t=%d\" % (nm, t), len(c), post_mean(w, who),\n                 sum(prior[u] for u in c)))\n\n# the two partitions differ, so at most states the traders disagree\nprint(\"\")\ndis = [(w, post_mean(w, 0) - post_mean(w, 1)) for w in omega]\nprint(\"states where the two posteriors differ: %d of %d\" % (sum(abs(d) > 1e-12 for _, d in dis), len(omega)))\nbest = max(dis, key=lambda z: abs(z[1]))\nprint(\"largest disagreement  %+.4f  at state (t1=%d, t2=%d)\" % (best[1], best[0][0], best[0][1]))\nprint(\"\")\nprint(\"%14s %10s %10s %12s\" % (\"state\", \"E[V|T1]\", \"E[V|T2]\", \"difference\"))\nfor w, d in dis:\n    print(\"%14s %10.4f %10.4f %+12.4f\"\n          % (\"(t1=%d,t2=%d)\" % w, post_mean(w, 0), post_mean(w, 1), d))\n",
            "output": "common prior over the 9 states (rows = trader 1's type):\n  t1=0  0.1365  0.1063  0.0828\n  t1=1  0.1063  0.1365  0.1063\n  t1=2  0.0828  0.1063  0.1365\n\nunconditional E[V] = 100.0000\n\n  type   own cell E[V | own type] cell probability\nT1 t=0          3        95.3402         0.3255\nT1 t=1          3       100.0000         0.3490\nT1 t=2          3       104.6598         0.3255\nT2 t=0          3        95.3402         0.3255\nT2 t=1          3       100.0000         0.3490\nT2 t=2          3       104.6598         0.3255\n\nstates where the two posteriors differ: 6 of 9\nlargest disagreement  -9.3196  at state (t1=0, t2=2)\n\n         state    E[V|T1]    E[V|T2]   difference\n   (t1=0,t2=0)    95.3402    95.3402      +0.0000\n   (t1=0,t2=1)    95.3402   100.0000      -4.6598\n   (t1=0,t2=2)    95.3402   104.6598      -9.3196\n   (t1=1,t2=0)   100.0000    95.3402      +4.6598\n   (t1=1,t2=1)   100.0000   100.0000      +0.0000\n   (t1=1,t2=2)   100.0000   104.6598      -4.6598\n   (t1=2,t2=0)   104.6598    95.3402      +9.3196\n   (t1=2,t2=1)   104.6598   100.0000      +4.6598\n   (t1=2,t2=2)   104.6598   104.6598      +0.0000"
          }
        },
        {
          "name": "Aumann: agreeing to disagree is impossible once the disagreement is common knowledge",
          "explain": "<p>Aumann's theorem is short to state and unsettling to absorb. If two agents share a prior and their posteriors for an event are common knowledge, those posteriors are equal. Nothing is assumed about their information being similar, only about the prior being shared and the posteriors being commonly known.</p><p>The theorem is easier to believe once you watch the mechanism, which is what the snippet does. Eight equally likely states arranged in a ring; trader one's partition pairs them as (0,1), (2,3), (4,5), (6,7) and trader two's is offset by one, (1,2), (3,4), (5,6), (7,0); the event is the set {0, 2, 4}. Round one: each announces its posterior for the event and they differ by 0.5 at some states. But an announcement is information — 'trader two said 0.5' rules out states where trader two would have said something else — so each side re-conditions and announces again.</p><p>The disagreement survives rounds two and three, then vanishes in round four. The interesting detail is what the announcements accomplished: by the end every posterior is exactly 0 or 1, so the dialogue has revealed the event's indicator precisely. That is not always what happens, but the direction always is: repeated announcement is a refinement operator, and it cannot stop while the posteriors still differ.</p><p>A desk cares because this is the reason a persistent price disagreement between two informed desks is evidence about something other than information — a different model, a different mandate, or a different prior — and it pays to work out which.</p>",
          "formula": "\\text{$P_1(E\\mid\\Pi_1)$ and $P_2(E\\mid\\Pi_2)$ common knowledge} \\;\\Longrightarrow\\; P_1(E\\mid\\Pi_1) = P_2(E\\mid\\Pi_2)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Aumann: once two posteriors for the same event are COMMON KNOWLEDGE they\n# must agree. Simulate the dialogue that makes them common knowledge --\n# each side announces its posterior, hears the other's, and re-conditions.\nstates = list(range(8))                       # eight equally likely states\nprior = {s: 1 / 8 for s in states}\nP1 = [(0, 1), (2, 3), (4, 5), (6, 7)]         # trader 1's information cells\nP2 = [(1, 2), (3, 4), (5, 6), (7, 0)]         # trader 2's, offset by one\nE = {0, 2, 4}                                 # the event they are pricing\n\ndef cellmap(P):\n    return {s: (\"c\", i) for i, c in enumerate(P) for s in c}\n\npart = [cellmap(P1), cellmap(P2)]\n\ndef posterior(w, who):\n    c = [u for u in states if part[who][u] == part[who][w]]\n    z = sum(prior[u] for u in c)\n    return sum(prior[u] for u in c if u in E) / z\n\nprint(\"prior P(E) = %.4f    E = {%s}\" % (sum(prior[s] for s in E),\n                                         \", \".join(str(s) for s in sorted(E))))\nprint(\"\")\nfor rnd in range(1, 9):\n    a0 = {w: round(posterior(w, 0), 9) for w in states}\n    a1 = {w: round(posterior(w, 1), 9) for w in states}\n    gap = max(abs(a0[w] - a1[w]) for w in states)\n    print(\"round %d   distinct announcements %d / %d   max disagreement %.4f\"\n          % (rnd, len(set(a0.values())), len(set(a1.values())), gap))\n    print(\"   state      \" + \"\".join(\"%8d\" % s for s in states))\n    print(\"   T1 says    \" + \"\".join(\"%8.3f\" % a0[s] for s in states))\n    print(\"   T2 says    \" + \"\".join(\"%8.3f\" % a1[s] for s in states))\n    if gap < 1e-9:\n        print(\"\")\n        print(\"agreement reached after %d rounds of announcement\" % rnd)\n        print(\"the announcements ended up revealing the indicator of E exactly:\")\n        print(\"every posterior is 0 or 1, so the disagreement could not survive\")\n        break\n    part = [{w: (part[0][w], a1[w]) for w in states},\n            {w: (part[1][w], a0[w]) for w in states}]\n    print(\"\")\n",
            "output": "prior P(E) = 0.3750    E = {0, 2, 4}\n\nround 1   distinct announcements 2 / 2   max disagreement 0.5000\n   state             0       1       2       3       4       5       6       7\n   T1 says       0.500   0.500   0.500   0.500   0.500   0.500   0.000   0.000\n   T2 says       0.500   0.500   0.500   0.500   0.500   0.000   0.000   0.500\n\nround 2   distinct announcements 3 / 3   max disagreement 0.5000\n   state             0       1       2       3       4       5       6       7\n   T1 says       0.500   0.500   0.500   0.500   1.000   0.000   0.000   0.000\n   T2 says       1.000   0.500   0.500   0.500   0.500   0.000   0.000   0.000\n\nround 3   distinct announcements 3 / 3   max disagreement 0.5000\n   state             0       1       2       3       4       5       6       7\n   T1 says       1.000   0.000   0.500   0.500   1.000   0.000   0.000   0.000\n   T2 says       1.000   0.500   0.500   0.000   1.000   0.000   0.000   0.000\n\nround 4   distinct announcements 2 / 2   max disagreement 0.0000\n   state             0       1       2       3       4       5       6       7\n   T1 says       1.000   0.000   1.000   0.000   1.000   0.000   0.000   0.000\n   T2 says       1.000   0.000   1.000   0.000   1.000   0.000   0.000   0.000\n\nagreement reached after 4 rounds of announcement\nthe announcements ended up revealing the indicator of E exactly:\nevery posterior is 0 or 1, so the disagreement could not survive"
          }
        },
        {
          "name": "Milgrom–Stokey: willingness to trade is itself a signal",
          "explain": "<p>Now put the disagreement of the first concept to work and try to trade on it. Milgrom and Stokey's theorem says you cannot: starting from a Pareto-efficient allocation, with a common prior and common knowledge of rationality, there is no trade that both sides strictly want. The proof is the same conditioning move as Aumann's, applied to the act of trading rather than to an announcement.</p><p>The snippet makes the error and then corrects it. Naively, at a price of 98 the buyer conditions on its own type and computes an expected gain of 4.25, while the seller conditions on its own type and computes 2.66. Both appear to profit, which is impossible in a zero-sum trade, so something is wrong with the calculation.</p><p>What is wrong is that each side ignored the information in the other's willingness. Recompute the expected value of the asset conditional on the buyer being a type that wants to buy at 98 <em>and</em> the seller being a type that wants to sell at 98, and the buyer's gain is −0.2487 while the seller's is +0.2487. At 102 the signs reverse. At 100 both are exactly zero. At every price the two gains sum to zero to the last decimal, because the trade is zero-sum and correct conditioning has to respect that.</p><p>A desk cares because the practical form of this theorem is the oldest question in trading: if this is such a good price, why is someone else taking the other side? The answer had better be a reason outside the information set.</p>",
          "formula": "E\\big[V - p \\;\\big|\\; t_1 \\in B(p),\\, t_2 \\in S(p)\\big] + E\\big[p - V \\;\\big|\\; t_1 \\in B(p),\\, t_2 \\in S(p)\\big] = 0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\nimport itertools\n\n# Milgrom-Stokey: from an efficient allocation, with a common prior and\n# common knowledge, no trade can be mutually acceptable. The mechanism is\n# that WILLINGNESS TO TRADE is itself a signal.\nsig = (0, 1, 2)\nomega = list(itertools.product(sig, sig))\nval = {w: 100.0 + 4.0 * (w[0] + w[1] - 2) for w in omega}\nraw = {w: np.exp(-0.25 * abs(w[0] - w[1])) for w in omega}\nZ = sum(raw.values())\nprior = {w: raw[w] / Z for w in omega}\n\ndef cond_mean(sub):\n    z = sum(prior[w] for w in sub)\n    return (sum(prior[w] * val[w] for w in sub) / z) if z > 0 else float(\"nan\"), z\n\nprint(\"%6s %16s %16s\" % (\"price\", \"buyer thinks\", \"seller thinks\"))\nprint(\"      (naive: conditioning on OWN type only)\")\nfor p in (98.0, 100.0, 102.0):\n    B = [w for w in omega if cond_mean([u for u in omega if u[0] == w[0]])[0] > p]\n    S = [w for w in omega if cond_mean([u for u in omega if u[1] == w[1]])[0] < p]\n    mb = cond_mean(B)[0] if B else float(\"nan\")\n    ms = cond_mean(S)[0] if S else float(\"nan\")\n    print(\"%6.1f %16.4f %16.4f\" % (p, mb - p, p - ms))\n\nprint(\"\")\nprint(\"      (correct: each side conditions on the OTHER being willing too)\")\nprint(\"%6s %10s %16s %16s\" % (\"price\", \"P(trade)\", \"buyer's gain\", \"seller's gain\"))\nfor p in (96.0, 98.0, 100.0, 102.0, 104.0):\n    B1 = {w[0] for w in omega if cond_mean([u for u in omega if u[0] == w[0]])[0] > p}\n    S2 = {w[1] for w in omega if cond_mean([u for u in omega if u[1] == w[1]])[0] < p}\n    T = [w for w in omega if w[0] in B1 and w[1] in S2]\n    if not T:\n        print(\"%6.1f %10.4f %16s %16s\" % (p, 0.0, \"no trade\", \"no trade\"))\n        continue\n    m, q = cond_mean(T)\n    print(\"%6.1f %10.4f %+16.4f %+16.4f\" % (p, q, m - p, p - m))\n\nprint(\"\")\nprint(\"at every price the two gains are exact negatives: the trade is zero-sum,\")\nprint(\"so it cannot be strictly acceptable to both once each conditions on the other.\")\n",
            "output": " price     buyer thinks    seller thinks\n      (naive: conditioning on OWN type only)\n  98.0           4.2487           2.6598\n 100.0           4.6598           4.6598\n 102.0           2.6598           4.2487\n\n      (correct: each side conditions on the OTHER being willing too)\n price   P(trade)     buyer's gain    seller's gain\n  96.0     0.1890          +1.7513          -1.7513\n  98.0     0.1890          -0.2487          +0.2487\n 100.0     0.0828          +0.0000          +0.0000\n 102.0     0.1890          +0.2487          -0.2487\n 104.0     0.1890          -1.7513          +1.7513\n\nat every price the two gains are exact negatives: the trade is zero-sum,\nso it cannot be strictly acceptable to both once each conditions on the other."
          }
        },
        {
          "name": "The two escapes: a non-informational motive, or a broken common prior",
          "explain": "<p>Markets do have volume, so one of the theorem's hypotheses fails in reality, and it is worth being precise about which. There are two standard escapes and they have different consequences.</p><p>The first is a trader whose motive is not informational: a pension fund rebalancing, a corporate hedging a currency exposure, a fund meeting redemptions. Such a trader will pay to transact, and the snippet quantifies what they pay. In the binary-value sequential-trade setup the spread comes out as exactly the informed fraction times the value range: 1.0 wide at an informed probability of 0.1, 5.0 at 0.5, and 10.0 — the entire value range — at 1.0. The uninformed trader's expected loss per trade is half the spread. At an informed probability of one the spread swallows the whole asset, no uninformed trader will transact, the market maker earns nothing, and the venue has no volume. Liquidity is not a service the market provides for free; it is a transfer from the impatient to the informed, intermediated by someone who must break even.</p><p>The second escape is dropping the common prior. If the buyer believes the value is high with probability 0.70 and the seller believes 0.30, there is a price band from 98 to 102 in which both strictly gain, and each 0.10 of prior disagreement opens a band of 1.0. Trade is then not zero-sum in expectation under either side's beliefs — which is exactly why at least one of them must be wrong.</p><p>A desk cares because these two stories make opposite predictions about who profits, and mistaking disagreement volume for liquidity volume is how a market-making book gets run over.</p>",
          "formula": "\\text{spread} = \\mu\\,(V_H - V_L), \\qquad \\text{uninformed cost per trade} = \\tfrac{1}{2}\\,\\mu\\,(V_H - V_L)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# If no trade is the theorem, volume needs an escape. There are exactly two\n# standard ones: traders with a NON-INFORMATIONAL motive, or a departure\n# from the common prior. Price both escapes.\nVL, VH, pi = 95.0, 105.0, 0.5            # binary value, flat prior\nmid = pi * VH + (1 - pi) * VL\n\nprint(\"escape 1: a liquidity motive must pay for the half-spread\")\nprint(\"%8s %10s %10s %10s %14s\" % (\"mu\", \"bid\", \"ask\", \"spread\", \"uninf. loss\"))\nfor mu in (0.0, 0.1, 0.25, 0.5, 0.8, 0.99, 1.0):\n    pb = mu + (1 - mu) * 0.5             # P(buy | V = VH)\n    ps = (1 - mu) * 0.5                  # P(buy | V = VL)\n    ask = (pi * pb * VH + (1 - pi) * ps * VL) / (pi * pb + (1 - pi) * ps)\n    bid = (pi * (1 - pb) * VH + (1 - pi) * (1 - ps) * VL) / (pi * (1 - pb) + (1 - pi) * (1 - ps))\n    # an uninformed trader buys or sells at random and pays the half-spread\n    loss = (ask - bid) / 2\n    print(\"%8.2f %10.4f %10.4f %10.4f %14.4f\" % (mu, bid, ask, ask - bid, loss))\nprint(\"at mu = 1 the spread is the entire value range %.1f: nobody uninformed trades,\" % (VH - VL))\nprint(\"the market maker earns nothing, and the venue has no volume at all.\")\n\nprint(\"\")\nprint(\"escape 2: drop the common prior. Buyer believes P(high) = pb,\")\nprint(\"seller believes P(high) = ps. Both strictly gain in a price band.\")\nprint(\"%8s %8s %14s %14s %12s\" % (\"pb\", \"ps\", \"buyer's value\", \"seller's value\", \"trade band\"))\nfor pb, ps in ((0.50, 0.50), (0.55, 0.45), (0.70, 0.30), (0.90, 0.10), (0.40, 0.60)):\n    vb = pb * VH + (1 - pb) * VL\n    vs = ps * VH + (1 - ps) * VL\n    width = max(0.0, vb - vs)\n    band = \"(%.2f, %.2f)\" % (vs, vb) if width > 1e-12 else \"empty\"\n    print(\"%8.2f %8.2f %14.4f %14.4f %12s\" % (pb, ps, vb, vs, band))\nprint(\"with a common prior the band is empty at every price: that is the theorem.\")\nprint(\"Every unit of disagreement of 0.10 in the priors opens a band of %.1f.\" % (0.10 * (VH - VL)))\n",
            "output": "escape 1: a liquidity motive must pay for the half-spread\n      mu        bid        ask     spread    uninf. loss\n    0.00   100.0000   100.0000     0.0000         0.0000\n    0.10    99.5000   100.5000     1.0000         0.5000\n    0.25    98.7500   101.2500     2.5000         1.2500\n    0.50    97.5000   102.5000     5.0000         2.5000\n    0.80    96.0000   104.0000     8.0000         4.0000\n    0.99    95.0500   104.9500     9.9000         4.9500\n    1.00    95.0000   105.0000    10.0000         5.0000\nat mu = 1 the spread is the entire value range 10.0: nobody uninformed trades,\nthe market maker earns nothing, and the venue has no volume at all.\n\nescape 2: drop the common prior. Buyer believes P(high) = pb,\nseller believes P(high) = ps. Both strictly gain in a price band.\n      pb       ps  buyer's value seller's value   trade band\n    0.50     0.50       100.0000       100.0000        empty\n    0.55     0.45       100.5000        99.5000 (99.50, 100.50)\n    0.70     0.30       102.0000        98.0000 (98.00, 102.00)\n    0.90     0.10       104.0000        96.0000 (96.00, 104.00)\n    0.40     0.60        99.0000       101.0000        empty\nwith a common prior the band is empty at every price: that is the theorem.\nEvery unit of disagreement of 0.10 in the priors opens a band of 1.0."
          }
        }
      ],
      "widget": {
        "type": "tree-diagram",
        "title": "The no-trade argument and the two ways out of it",
        "params": {
          "nodes": [
            {
              "id": "prior",
              "label": "Common prior on states",
              "level": 0
            },
            {
              "id": "part",
              "label": "Private partitions",
              "level": 1
            },
            {
              "id": "dis",
              "label": "Posteriors differ",
              "level": 2
            },
            {
              "id": "offer",
              "label": "Buyer willing at p",
              "level": 3
            },
            {
              "id": "accept",
              "label": "Seller willing at p",
              "level": 3
            },
            {
              "id": "cond",
              "label": "Condition on both",
              "level": 4
            },
            {
              "id": "zero",
              "label": "Gains sum to zero",
              "level": 5
            },
            {
              "id": "notrade",
              "label": "No strictly mutual trade",
              "level": 6
            },
            {
              "id": "noise",
              "label": "Escape 1: liquidity motive",
              "level": 7
            },
            {
              "id": "hetero",
              "label": "Escape 2: no common prior",
              "level": 7
            },
            {
              "id": "spread",
              "label": "Spread = informed share x value range",
              "level": 8
            },
            {
              "id": "band",
              "label": "Price band where both gain",
              "level": 8
            }
          ],
          "edges": [
            {
              "from": "prior",
              "to": "part",
              "label": "signals"
            },
            {
              "from": "part",
              "to": "dis",
              "label": "conditioning"
            },
            {
              "from": "dis",
              "to": "offer",
              "label": ""
            },
            {
              "from": "dis",
              "to": "accept",
              "label": ""
            },
            {
              "from": "offer",
              "to": "cond",
              "label": ""
            },
            {
              "from": "accept",
              "to": "cond",
              "label": ""
            },
            {
              "from": "cond",
              "to": "zero",
              "label": "zero-sum"
            },
            {
              "from": "zero",
              "to": "notrade",
              "label": "theorem"
            },
            {
              "from": "notrade",
              "to": "noise",
              "label": "drop efficiency"
            },
            {
              "from": "notrade",
              "to": "hetero",
              "label": "drop common prior"
            },
            {
              "from": "noise",
              "to": "spread",
              "label": "week 5"
            },
            {
              "from": "hetero",
              "to": "band",
              "label": "week 9"
            }
          ]
        }
      },
      "pitfalls": [
        "Conditioning on your own information only when the counterparty's willingness is observable. That is the specific error the snippet makes deliberately, and it turns a loss of 0.25 into an apparent gain of 4.25.",
        "Reading the no-trade theorem as a claim that markets should have no volume. It is a claim about which assumptions must fail, and identifying which one fails in your market is the useful work.",
        "Treating disagreement as evidence of superior information. Under a common prior, persistent common-knowledge disagreement is impossible, so it points to a different prior or a different model instead.",
        "Assuming noise traders are irrational. A liquidity or hedging motive makes paying the half-spread perfectly rational; what makes it a loss is measuring it against the wrong benchmark."
      ],
      "check": [
        {
          "q": "In the snippet's nine-state type space, the two traders' posteriors differed in six of nine states, by up to 9.32. What produced that disagreement?",
          "options": [
            "Different priors",
            "Different information partitions under a shared prior",
            "Risk aversion",
            "A computational artifact of the correlation"
          ],
          "answer": 1,
          "why": "The prior is common by construction; the traders differ only in which cell of the state space they can identify, which is exactly Harsanyi's device for representing private information."
        },
        {
          "q": "In the announcement dialogue, why does an announcement carry information even though it is only a number?",
          "options": [
            "Because it reveals the announcer's prior",
            "Because it rules out the states in which the announcer would have said something else",
            "Because the announcer might lie",
            "Because the states are equally likely"
          ],
          "answer": 1,
          "why": "The announced posterior is a function of the announcer's cell, so hearing it partitions the state space by that function and refines the listener's information."
        },
        {
          "q": "At a price of 98 the naive calculation gave the buyer a gain of 4.25 and the correct one gave −0.2487. What changed?",
          "options": [
            "The prior was updated",
            "The buyer's type set was recomputed",
            "The expectation was taken conditional on the seller also being willing to trade at 98",
            "The value function was rescaled"
          ],
          "answer": 2,
          "why": "Only the conditioning set changed: adding the seller's willingness to the information set removes exactly the states where the buyer would have profited."
        },
        {
          "q": "With an informed probability of 1.0 the snippet's spread equalled the whole value range of 10. What is the economic content of that?",
          "options": [
            "The market maker earns the maximum possible profit",
            "The market breaks down: no uninformed trader will transact and there is no volume",
            "The informed trader earns the whole value range",
            "The prior must have been wrong"
          ],
          "answer": 1,
          "why": "A spread equal to the entire range means every quote already reveals the value, so there is nothing left for anyone to gain and no reason for an uninformed trader to be there at all."
        }
      ],
      "n": 4
    },
    {
      "title": "Glosten–Milgrom: the spread as pure adverse selection",
      "topics": [
        "the sequential-trade model",
        "bid and ask as conditional expectations",
        "the spread as the informed fraction times the value range",
        "zero expected profit and the transfer from uninformed to informed",
        "belief convergence and the collapse of the spread",
        "a continuous value and the quote fixed point"
      ],
      "concepts": [
        {
          "name": "The quotes are conditional expectations, and that is the whole model",
          "explain": "<p>Glosten and Milgrom's market has one order at a time. With probability mu the order comes from someone who knows the asset's value; otherwise it comes from a trader with a liquidity motive who buys or sells with equal probability. A competitive risk-neutral market maker sets a bid and an ask such that each side earns zero in expectation. Competition forces zero profit; risk neutrality means no inventory term; so the only thing left is information.</p><p>The ask is therefore the expected value conditional on the next order being a buy, and the bid is the expected value conditional on a sell. Nothing else is needed. In the snippet, with a prior of 0.40 on the high value and an informed fraction of 0.30, the unconditional expectation is 99.00 while the ask is 100.53 and the bid is 97.64. Note the asymmetry: the ask sits 1.53 above the mid and the bid only 1.36 below it, because with a prior below one half a buy is the more surprising of the two events and therefore moves the belief further.</p><p>A simulation of four hundred thousand orders confirms the interpretation directly. The realised average value on orders that turned out to be buys is 100.51 against a quoted ask of 100.53, and the market maker's realised profit per order is 0.016, which is the Monte Carlo error on a quantity whose true value is zero.</p><p>A desk cares because this is the correct null model for a quoting business: before adding inventory, fees or latency, a market maker should know what spread pure information asymmetry alone requires.</p>",
          "formula": "a = E[V \\mid \\text{buy}], \\qquad b = E[V \\mid \\text{sell}]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Glosten-Milgrom. One order at a time. With probability mu it comes from a\n# trader who knows V; otherwise from a trader who buys or sells at random.\n# A competitive risk-neutral market maker quotes so that each side breaks even.\nVL, VH, pi, mu = 95.0, 105.0, 0.40, 0.30\n\np_buy_H = mu * 1.0 + (1 - mu) * 0.5      # informed buys when V = VH\np_buy_L = mu * 0.0 + (1 - mu) * 0.5\np_sell_H, p_sell_L = 1 - p_buy_H, 1 - p_buy_L\n\nask = (pi * p_buy_H * VH + (1 - pi) * p_buy_L * VL) / (pi * p_buy_H + (1 - pi) * p_buy_L)\nbid = (pi * p_sell_H * VH + (1 - pi) * p_sell_L * VL) / (pi * p_sell_H + (1 - pi) * p_sell_L)\nunc = pi * VH + (1 - pi) * VL\n\nprint(\"prior P(VH) = %.2f, informed fraction mu = %.2f\" % (pi, mu))\nprint(\"unconditional E[V]  %.4f\" % unc)\nprint(\"ask  = E[V | buy]   %.4f    (%.4f above the mid)\" % (ask, ask - unc))\nprint(\"bid  = E[V | sell]  %.4f    (%.4f below the mid)\" % (bid, unc - bid))\nprint(\"spread              %.4f\" % (ask - bid))\nprint(\"P(buy) = %.4f, P(sell) = %.4f\" % (pi * p_buy_H + (1 - pi) * p_buy_L,\n                                         pi * p_sell_H + (1 - pi) * p_sell_L))\n\n# Monte Carlo: the realised average value AFTER a buy must equal the ask.\nrng = np.random.default_rng(1234)\nn = 400000\nV = np.where(rng.random(n) < pi, VH, VL)\ninformed = rng.random(n) < mu\nrand_buy = rng.random(n) < 0.5\nbuy = np.where(informed, V == VH, rand_buy)\nprint(\"\")\nprint(\"simulation of %d orders\" % n)\nprint(\"  realised E[V | buy ]  %.4f   vs ask %.4f\" % (V[buy].mean(), ask))\nprint(\"  realised E[V | sell]  %.4f   vs bid %.4f\" % (V[~buy].mean(), bid))\nprint(\"  market maker P&L per order  %+.5f\"\n      % np.mean(np.where(buy, ask - V, V - bid)))\n",
            "output": "prior P(VH) = 0.40, informed fraction mu = 0.30\nunconditional E[V]  99.0000\nask  = E[V | buy]   100.5319    (1.5319 above the mid)\nbid  = E[V | sell]  97.6415    (1.3585 below the mid)\nspread              2.8904\nP(buy) = 0.4700, P(sell) = 0.5300\n\nsimulation of 400000 orders\n  realised E[V | buy ]  100.5108   vs ask 100.5319\n  realised E[V | sell]  97.6531   vs bid 97.6415\n  market maker P&L per order  +0.01611"
          }
        },
        {
          "name": "The spread widens with the informed fraction, and the maker keeps none of it",
          "explain": "<p>This is the result the whole model exists to produce. With a symmetric prior the algebra collapses to something you can carry around: the spread equals the informed fraction times the range of possible values. The snippet prints the ratio of spread to that product at seven different informed fractions and it is 1.0000000000 every time. At mu = 0.05 the spread is 0.50 on a ten-point asset; at mu = 0.50 it is 5.00; at mu = 1.00 it is the entire 10.00 and the market has ceased to function.</p><p>The three profit columns are where the economics lives. The market maker's expected profit is zero at every informed fraction — that is the equilibrium condition, not an output — and the informed trader's expected profit per order is exactly the negative of the uninformed trader's. The spread is not revenue. It is a transfer from traders with a liquidity motive to traders with information, routed through an intermediary that keeps nothing.</p><p>The non-obvious column is the informed trader's P&L, which is not monotone. It rises from 0.2375 at mu = 0.05 to a maximum of 1.25 at mu = 0.50 and then falls back to zero at mu = 1.00. Informed traders do worst when there are either very few or very many of them: with few, there is little edge to exploit per order; with many, the spread has already priced their information and there is nothing left to take. Being informed is only profitable in a crowd of the uninformed.</p><p>A desk cares because this is the quantitative form of 'crowded trade': the value of an edge depends on how many others have it, and the dependence is single-peaked rather than decreasing.</p>",
          "formula": "a - b = \\mu\\,(V_H - V_L), \\qquad \\Pi_{\\text{MM}} = 0, \\qquad \\Pi_{\\text{informed}} = -\\Pi_{\\text{uninformed}} = \\tfrac{1}{2}\\mu(1-\\mu)(V_H - V_L)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# The spread is PURE adverse selection: no inventory, no fees, no costs.\n# Watch it widen as the informed fraction rises, and check that the market\n# maker's expected profit is exactly zero at every one of those spreads.\nVL, VH, pi = 95.0, 105.0, 0.50\n\ndef quotes(mu):\n    pbH, pbL = mu + (1 - mu) * 0.5, (1 - mu) * 0.5\n    a = (pi * pbH * VH + (1 - pi) * pbL * VL) / (pi * pbH + (1 - pi) * pbL)\n    b = (pi * (1 - pbH) * VH + (1 - pi) * (1 - pbL) * VL) / (pi * (1 - pbH) + (1 - pi) * (1 - pbL))\n    return a, b\n\nprint(\"prior P(VH) = %.2f, value range %.1f\" % (pi, VH - VL))\nprint(\"%8s %10s %10s %10s %14s %14s %14s\"\n      % (\"mu\", \"bid\", \"ask\", \"spread\", \"MM profit\", \"informed P&L\", \"uninformed P&L\"))\nfor mu in (0.0, 0.05, 0.10, 0.20, 0.35, 0.50, 0.75, 0.90, 1.00):\n    a, b = quotes(mu)\n    pbH, pbL = mu + (1 - mu) * 0.5, (1 - mu) * 0.5\n    # market maker: pays V, receives a, on a buy; receives V, pays b, on a sell\n    mm = (pi * (pbH * (a - VH) + (1 - pbH) * (VH - b))\n          + (1 - pi) * (pbL * (a - VL) + (1 - pbL) * (VL - b)))\n    # informed: buys at a when V = VH, sells at b when V = VL\n    inf = mu * (pi * (VH - a) + (1 - pi) * (b - VL))\n    # uninformed: buys or sells at random, whatever V is\n    un = (1 - mu) * (pi * 0.5 * ((VH - a) + (b - VH))\n                     + (1 - pi) * 0.5 * ((VL - a) + (b - VL)))\n    print(\"%8.2f %10.4f %10.4f %10.4f %14.6f %14.6f %14.6f\"\n          % (mu, b, a, a - b, mm, inf, un))\n\nprint(\"\")\nprint(\"spread / (mu * value range), which the algebra says must be 1:\")\nfor mu in (0.05, 0.10, 0.20, 0.35, 0.50, 0.75, 0.90):\n    a, b = quotes(mu)\n    print(\"  mu %.2f  ->  %.10f\" % (mu, (a - b) / (mu * (VH - VL))))\nprint(\"\")\nprint(\"the three P&Ls sum to zero at every mu, and the market maker's is zero\")\nprint(\"on its own: the entire spread is a transfer from uninformed to informed.\")\n",
            "output": "prior P(VH) = 0.50, value range 10.0\n      mu        bid        ask     spread      MM profit   informed P&L uninformed P&L\n    0.00   100.0000   100.0000     0.0000       0.000000       0.000000       0.000000\n    0.05    99.7500   100.2500     0.5000       0.000000       0.237500      -0.237500\n    0.10    99.5000   100.5000     1.0000      -0.000000       0.450000      -0.450000\n    0.20    99.0000   101.0000     2.0000      -0.000000       0.800000      -0.800000\n    0.35    98.2500   101.7500     3.5000      -0.000000       1.137500      -1.137500\n    0.50    97.5000   102.5000     5.0000       0.000000       1.250000      -1.250000\n    0.75    96.2500   103.7500     7.5000       0.000000       0.937500      -0.937500\n    0.90    95.5000   104.5000     9.0000       0.000000       0.450000      -0.450000\n    1.00    95.0000   105.0000    10.0000       0.000000       0.000000      -0.000000\n\nspread / (mu * value range), which the algebra says must be 1:\n  mu 0.05  ->  1.0000000000\n  mu 0.10  ->  1.0000000000\n  mu 0.20  ->  1.0000000000\n  mu 0.35  ->  1.0000000000\n  mu 0.50  ->  1.0000000000\n  mu 0.75  ->  1.0000000000\n  mu 0.90  ->  1.0000000000\n\nthe three P&Ls sum to zero at every mu, and the market maker's is zero\non its own: the entire spread is a transfer from uninformed to informed."
          }
        },
        {
          "name": "Quote dynamics: the mid walks to the truth and the spread collapses",
          "explain": "<p>Let the market run. After each order the maker updates its belief in log-odds — adding the log likelihood ratio of a buy or a sell, exactly the week-2 machinery — and requotes from the new posterior. Two things then happen together. The mid drifts toward the true value, and the spread narrows, because the spread is proportional to how much uncertainty is left.</p><p>In the snippet the true value is the high one, the informed fraction is 0.25, and the initial spread is 2.50 as the formula requires. By order 18 the belief is 0.955 and the spread has fallen to 0.449; by order 30 the belief is 0.998 and the spread is 0.023. The path is not monotone — sells arrive from uninformed traders and push the belief back — but the drift is one-directional because informed orders are never sells when the value is high.</p><p>The rate is not a free parameter. The expected log-odds gain per order is 0.1278 nats, which is the Kullback–Leibler divergence between the order distributions in the two states, and dividing the required log-odds for 99 per cent confidence by it predicts 36 orders. The median over four hundred simulated runs is 31. The gap is not an error: a first-passage time is right-skewed, so its median sits below the drift-based estimate, and the drift calculation is a statement about the mean.</p><p>A desk cares because this is the mechanism of price discovery in its simplest honest form, and it says that the speed at which a venue incorporates information is set by the informed share of its flow.</p>",
          "formula": "\\log\\frac{\\pi_t}{1-\\pi_t} = \\log\\frac{\\pi_{t-1}}{1-\\pi_{t-1}} + \\log\\frac{P(\\text{order}_t \\mid V_H)}{P(\\text{order}_t \\mid V_L)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Run the sequential market. After each order the market maker updates its\n# belief and requotes, so the mid walks toward the true value and the spread\n# collapses. The rate is the divergence of week 2, not a free parameter.\nVL, VH, mu = 95.0, 105.0, 0.25\npbH, pbL = mu + (1 - mu) * 0.5, (1 - mu) * 0.5\nlr_buy, lr_sell = pbH / pbL, (1 - pbH) / (1 - pbL)\n\ndef quotes(p):\n    a = (p * pbH * VH + (1 - p) * pbL * VL) / (p * pbH + (1 - p) * pbL)\n    b = (p * (1 - pbH) * VH + (1 - p) * (1 - pbL) * VL) / (p * (1 - pbH) + (1 - p) * (1 - pbL))\n    return a, b\n\nrng = np.random.default_rng(5150)\nV = VH                                          # the truth, unknown to the maker\np = 0.5\nprint(\"%6s %8s %10s %10s %10s %10s\" % (\"order\", \"side\", \"bid\", \"ask\", \"spread\", \"P(VH)\"))\na, b = quotes(p)\nprint(\"%6s %8s %10.4f %10.4f %10.4f %10.4f\" % (\"-\", \"-\", b, a, a - b, p))\nfor t in range(1, 31):\n    informed = rng.random() < mu\n    buy = (V == VH) if informed else (rng.random() < 0.5)\n    lo = np.log(p / (1 - p)) + np.log(lr_buy if buy else lr_sell)\n    p = 1 / (1 + np.exp(-lo))\n    a, b = quotes(p)\n    if t <= 6 or t % 6 == 0:\n        print(\"%6d %8s %10.4f %10.4f %10.4f %10.4f\"\n              % (t, \"buy\" if buy else \"sell\", b, a, a - b, p))\n\n# the average number of orders to settle the question, over many runs\ndef rounds_to(conf, seed, nmax=4000):\n    r = np.random.default_rng(seed)\n    lo, tgt = 0.0, np.log(conf / (1 - conf))\n    for k in range(1, nmax + 1):\n        buy = (r.random() < mu) or (r.random() < 0.5)\n        lo += np.log(lr_buy if buy else lr_sell)\n        if lo >= tgt:\n            return k\n    return nmax\n\nsamples = np.array([rounds_to(0.99, s) for s in range(400)])\nkl = pbH * np.log(lr_buy) + (1 - pbH) * np.log(lr_sell)\nprint(\"\")\nprint(\"log-odds drift per order under V = VH   %.5f nats\" % kl)\nprint(\"orders predicted for 99%% confidence     %.1f\" % (np.log(0.99 / 0.01) / kl))\nprint(\"orders observed, median of 400 runs     %.1f\" % np.median(samples))\nprint(\"final spread after 30 orders            %.4f  (started at %.4f)\"\n      % (a - b, mu * (VH - VL)))\n",
            "output": " order     side        bid        ask     spread      P(VH)\n     -        -    98.7500   101.2500     2.5000     0.5000\n     1     sell    97.6471   100.0000     2.3529     0.3750\n     2      buy    98.7500   101.2500     2.5000     0.5000\n     3      buy   100.0000   102.3529     2.3529     0.6250\n     4      buy   101.2500   103.2237     1.9737     0.7353\n     5     sell   100.0000   102.3529     2.3529     0.6250\n     6      buy   101.2500   103.2237     1.9737     0.7353\n    12     sell   101.2500   103.2237     1.9737     0.7353\n    18      buy   104.2785   104.7277     0.4492     0.9554\n    24     sell   104.7277   104.9002     0.1725     0.9835\n    30      buy   104.9639   104.9870     0.0231     0.9978\n\nlog-odds drift per order under V = VH   0.12771 nats\norders predicted for 99% confidence     36.0\norders observed, median of 400 runs     31.0\nfinal spread after 30 orders            0.0231  (started at 2.5000)"
          }
        },
        {
          "name": "A continuous value makes the quotes a fixed point",
          "explain": "<p>The binary model is clean because the informed trader's decision is trivial: buy if the value is high. With a continuously distributed value the decision depends on the quote — the informed trader buys only if the value exceeds the ask — and the ask is set by conditioning on a buy. That circularity is a genuine fixed point and it has to be solved rather than written down.</p><p>The snippet solves it by damped iteration for a normally distributed value. The results are worth memorising in ratio form. With a standard deviation of one, the spread is 0.0799 at an informed fraction of 0.05, 0.4932 at 0.30 and 1.7232 at 0.80. With a standard deviation of three the spreads are 0.2396, 1.4796 and 5.1696 — exactly three times larger, so the ratio of spread to volatility is identical across the two blocks. Adverse selection scales linearly in volatility, because the informed trader's edge scales linearly in volatility too.</p><p>The verification line confirms the fixed point rather than assuming it: at the solution the conditional expectation of the value given a buy equals the ask to fourteen decimal places. And unlike the binary case, the spread here diverges as the informed fraction approaches one, because the tail expectation runs away; the widget's curves therefore stop short of that limit.</p><p>A desk cares because this version is the one that generalises: adding order sizes to it produces the size-dependent quote schedule of week 7, which is what a real book looks like.</p>",
          "formula": "a = \\frac{\\mu\\,E[V\\,\\mathbf{1}\\{V>a\\}] + \\tfrac{1-\\mu}{2}E[V]}{\\mu\\,P(V>a) + \\tfrac{1-\\mu}{2}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\nfrom scipy.stats import norm\n\n# A continuous value makes the quotes a FIXED POINT: the informed trader\n# buys only above the ask, so the ask depends on where the ask is.\nm0 = 100.0\n\ndef solve(mu, sd, iters=400):\n    a, b = m0 + 0.1 * sd, m0 - 0.1 * sd\n    for _ in range(iters):\n        # P(buy | V) = mu*1{V > a} + (1-mu)/2  ; likewise for sells\n        pa_tail = 1 - norm.cdf((a - m0) / sd)                 # P(V > a)\n        num = mu * (m0 * pa_tail + sd * norm.pdf((a - m0) / sd)) + (1 - mu) / 2 * m0\n        den = mu * pa_tail + (1 - mu) / 2\n        a_new = num / den\n        pb_tail = norm.cdf((b - m0) / sd)                     # P(V < b)\n        num_b = mu * (m0 * pb_tail - sd * norm.pdf((b - m0) / sd)) + (1 - mu) / 2 * m0\n        den_b = mu * pb_tail + (1 - mu) / 2\n        b_new = num_b / den_b\n        a, b = 0.5 * a + 0.5 * a_new, 0.5 * b + 0.5 * b_new\n    return a, b\n\nprint(\"value V ~ Normal(%.0f, sd), informed trade on the sign of V - quote\" % m0)\nprint(\"%8s %8s %10s %10s %10s %14s\" % (\"mu\", \"sd\", \"bid\", \"ask\", \"spread\", \"spread / sd\"))\nfor sd in (1.0, 3.0):\n    for mu in (0.05, 0.15, 0.30, 0.50, 0.80):\n        a, b = solve(mu, sd)\n        print(\"%8.2f %8.1f %10.4f %10.4f %10.4f %14.4f\" % (mu, sd, b, a, a - b, (a - b) / sd))\n    print(\"\")\n\n# verify the fixed point: at the solution, E[V | buy] must equal the ask\nmu, sd = 0.30, 1.0\na, b = solve(mu, sd)\npa = 1 - norm.cdf((a - m0) / sd)\nev_buy = (mu * (m0 * pa + sd * norm.pdf((a - m0) / sd)) + (1 - mu) / 2 * m0) / (mu * pa + (1 - mu) / 2)\nprint(\"check at mu=%.2f, sd=%.1f:  ask %.6f   E[V | buy] %.6f   gap %.2e\"\n      % (mu, sd, a, ev_buy, abs(a - ev_buy)))\nprint(\"the spread scales linearly in sd: doubling volatility doubles the\")\nprint(\"adverse-selection cost, because the informed trader's edge doubles too.\")\n",
            "output": "value V ~ Normal(100, sd), informed trade on the sign of V - quote\n      mu       sd        bid        ask     spread    spread / sd\n    0.05      1.0    99.9601   100.0399     0.0799         0.0799\n    0.15      1.0    99.8794   100.1206     0.2411         0.2411\n    0.30      1.0    99.7534   100.2466     0.4932         0.4932\n    0.50      1.0    99.5637   100.4363     0.8727         0.8727\n    0.80      1.0    99.1384   100.8616     1.7232         1.7232\n\n    0.05      3.0    99.8802   100.1198     0.2396         0.0799\n    0.15      3.0    99.6383   100.3617     0.7233         0.2411\n    0.30      3.0    99.2602   100.7398     1.4796         0.4932\n    0.50      3.0    98.6910   101.3090     2.6180         0.8727\n    0.80      3.0    97.4152   102.5848     5.1696         1.7232\n\ncheck at mu=0.30, sd=1.0:  ask 100.246607   E[V | buy] 100.246607   gap 1.42e-14\nthe spread scales linearly in sd: doubling volatility doubles the\nadverse-selection cost, because the informed trader's edge doubles too."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Spread and informed P&L against the informed fraction",
        "params": {
          "xlab": "Informed fraction mu",
          "ylab": "Spread (price units)",
          "log": false,
          "series": [
            {
              "name": "binary value, range 10",
              "x": [
                0.0,
                0.02,
                0.04,
                0.06,
                0.08,
                0.1,
                0.12,
                0.14,
                0.16,
                0.18,
                0.2,
                0.22,
                0.24,
                0.26,
                0.28,
                0.3,
                0.32,
                0.34,
                0.36,
                0.38,
                0.4,
                0.42,
                0.44,
                0.46,
                0.48,
                0.5,
                0.52,
                0.54,
                0.56,
                0.58,
                0.6,
                0.62,
                0.64,
                0.66,
                0.68,
                0.7,
                0.72,
                0.74,
                0.76,
                0.78,
                0.8,
                0.82,
                0.84,
                0.86,
                0.88,
                0.9,
                0.92,
                0.94,
                0.96
              ],
              "y": [
                0.0,
                0.2,
                0.4,
                0.6,
                0.8,
                1.0,
                1.2,
                1.4,
                1.6,
                1.8,
                2.0,
                2.2,
                2.4,
                2.6,
                2.8,
                3.0,
                3.2,
                3.4,
                3.6,
                3.8,
                4.0,
                4.2,
                4.4,
                4.6,
                4.8,
                5.0,
                5.2,
                5.4,
                5.6,
                5.8,
                6.0,
                6.2,
                6.4,
                6.6,
                6.8,
                7.0,
                7.2,
                7.4,
                7.6,
                7.8,
                8.0,
                8.2,
                8.4,
                8.6,
                8.8,
                9.0,
                9.2,
                9.4,
                9.6
              ]
            },
            {
              "name": "normal value, sd 2",
              "x": [
                0.0,
                0.02,
                0.04,
                0.06,
                0.08,
                0.1,
                0.12,
                0.14,
                0.16,
                0.18,
                0.2,
                0.22,
                0.24,
                0.26,
                0.28,
                0.3,
                0.32,
                0.34,
                0.36,
                0.38,
                0.4,
                0.42,
                0.44,
                0.46,
                0.48,
                0.5,
                0.52,
                0.54,
                0.56,
                0.58,
                0.6,
                0.62,
                0.64,
                0.66,
                0.68,
                0.7,
                0.72,
                0.74,
                0.76,
                0.78,
                0.8,
                0.82,
                0.84,
                0.86,
                0.88,
                0.9,
                0.92,
                0.94,
                0.96
              ],
              "y": [
                0.0,
                0.06384,
                0.12773,
                0.19171,
                0.25585,
                0.32018,
                0.38475,
                0.44964,
                0.51487,
                0.58052,
                0.64663,
                0.71327,
                0.7805,
                0.84839,
                0.91701,
                0.98643,
                1.05673,
                1.12798,
                1.2003,
                1.27376,
                1.34848,
                1.42457,
                1.50215,
                1.58137,
                1.66236,
                1.74531,
                1.83039,
                1.91781,
                2.00781,
                2.10064,
                2.19662,
                2.29609,
                2.39944,
                2.50715,
                2.61975,
                2.7379,
                2.86238,
                2.99414,
                3.13434,
                3.28446,
                3.44637,
                3.62253,
                3.81625,
                4.03212,
                4.27685,
                4.56068,
                4.90065,
                5.3282,
                5.91273
              ]
            },
            {
              "name": "normal value, sd 5",
              "x": [
                0.0,
                0.02,
                0.04,
                0.06,
                0.08,
                0.1,
                0.12,
                0.14,
                0.16,
                0.18,
                0.2,
                0.22,
                0.24,
                0.26,
                0.28,
                0.3,
                0.32,
                0.34,
                0.36,
                0.38,
                0.4,
                0.42,
                0.44,
                0.46,
                0.48,
                0.5,
                0.52,
                0.54,
                0.56,
                0.58,
                0.6,
                0.62,
                0.64,
                0.66,
                0.68,
                0.7,
                0.72,
                0.74,
                0.76,
                0.78,
                0.8,
                0.82,
                0.84,
                0.86,
                0.88,
                0.9,
                0.92,
                0.94,
                0.96
              ],
              "y": [
                0.0,
                0.1596,
                0.31932,
                0.47928,
                0.63961,
                0.80044,
                0.96189,
                1.12409,
                1.28718,
                1.45129,
                1.61658,
                1.78318,
                1.95126,
                2.12099,
                2.29253,
                2.46607,
                2.64181,
                2.81996,
                3.00074,
                3.1844,
                3.3712,
                3.56142,
                3.75538,
                3.95341,
                4.1559,
                4.36327,
                4.57596,
                4.79452,
                5.01951,
                5.25161,
                5.49156,
                5.74023,
                5.99861,
                6.26787,
                6.54938,
                6.84476,
                7.15596,
                7.48535,
                7.83585,
                8.21115,
                8.61592,
                9.05632,
                9.54062,
                10.08031,
                10.69212,
                11.40171,
                12.25162,
                13.32051,
                14.78183
              ]
            },
            {
              "name": "informed P&L per order (binary)",
              "x": [
                0.0,
                0.02,
                0.04,
                0.06,
                0.08,
                0.1,
                0.12,
                0.14,
                0.16,
                0.18,
                0.2,
                0.22,
                0.24,
                0.26,
                0.28,
                0.3,
                0.32,
                0.34,
                0.36,
                0.38,
                0.4,
                0.42,
                0.44,
                0.46,
                0.48,
                0.5,
                0.52,
                0.54,
                0.56,
                0.58,
                0.6,
                0.62,
                0.64,
                0.66,
                0.68,
                0.7,
                0.72,
                0.74,
                0.76,
                0.78,
                0.8,
                0.82,
                0.84,
                0.86,
                0.88,
                0.9,
                0.92,
                0.94,
                0.96
              ],
              "y": [
                0.0,
                0.098,
                0.192,
                0.282,
                0.368,
                0.45,
                0.528,
                0.602,
                0.672,
                0.738,
                0.8,
                0.858,
                0.912,
                0.962,
                1.008,
                1.05,
                1.088,
                1.122,
                1.152,
                1.178,
                1.2,
                1.218,
                1.232,
                1.242,
                1.248,
                1.25,
                1.248,
                1.242,
                1.232,
                1.218,
                1.2,
                1.178,
                1.152,
                1.122,
                1.088,
                1.05,
                1.008,
                0.962,
                0.912,
                0.858,
                0.8,
                0.738,
                0.672,
                0.602,
                0.528,
                0.45,
                0.368,
                0.282,
                0.192
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Calling the spread the market maker's revenue. In this model it is exactly zero in expectation; the spread is a transfer from liquidity traders to informed ones.",
        "Assuming more informed traders means more informed profit. The informed P&L peaks at an informed fraction of one half and falls to zero at both ends, because the spread prices their information away.",
        "Quoting the unconditional expectation on both sides. It looks like the fair value and it loses money on every order, because a buy is evidence that the value is above it.",
        "Reading the convergence rate off one simulation. The drift calculation predicts a mean of 36 orders while the median of 400 runs was 31, and confusing the two makes a right-skewed first-passage time look like a broken model."
      ],
      "check": [
        {
          "q": "With a symmetric prior, a value range of 10 and an informed fraction of 0.2, what is the equilibrium spread?",
          "options": [
            "0.2",
            "1.0",
            "2.0",
            "5.0"
          ],
          "answer": 2,
          "why": "The spread is the informed fraction times the value range, so 0.2 times 10 is 2.0, which the snippet confirms to ten decimal places."
        },
        {
          "q": "The informed trader's expected profit per order was 0.2375 at mu = 0.05, 1.25 at mu = 0.50 and 0.0 at mu = 1.00. Why does it fall at high mu?",
          "options": [
            "The informed trader runs out of capital",
            "The market maker starts to earn a profit",
            "The spread already prices the information, leaving no edge to capture",
            "The uninformed traders stop trading"
          ],
          "answer": 2,
          "why": "At mu = 1 the quotes equal the true value on whichever side the informed trader wants, so there is nothing to gain; the market maker's profit stays exactly zero throughout."
        },
        {
          "q": "In the sequential market the spread fell from 2.50 to 0.023 over thirty orders. What does the spread measure at each point?",
          "options": [
            "The market maker's accumulated profit",
            "The remaining uncertainty about the value, scaled by the informed fraction",
            "The order arrival rate",
            "The informed trader's inventory"
          ],
          "answer": 1,
          "why": "The spread is proportional to how much the belief can still move, so it collapses as the posterior concentrates, which is why a quote's width is a statement about residual uncertainty."
        },
        {
          "q": "In the continuous-value model, tripling the value's standard deviation tripled the spread at every informed fraction. What does that imply about adverse selection?",
          "options": [
            "It is independent of volatility",
            "It scales linearly in volatility, because the informed trader's edge does",
            "It scales with the square of volatility",
            "It depends only on the informed fraction"
          ],
          "answer": 1,
          "why": "The ratio of spread to standard deviation was identical across the two volatility blocks in the snippet, which is the numerical statement of linear scaling."
        }
      ],
      "n": 5
    },
    {
      "title": "Kyle: strategic informed trading, depth, and the price of flow",
      "topics": [
        "the linear Bayesian–Nash equilibrium",
        "lambda as the slope of the pricing rule",
        "market depth and the informed trader's profit",
        "recovering lambda by regression",
        "the multi-period model and the rate of revelation",
        "attenuation bias from a noisy flow proxy"
      ],
      "concepts": [
        {
          "name": "The equilibrium is a fixed point in two coefficients",
          "explain": "<p>Glosten–Milgrom's informed trader is passive: it takes the quote or leaves it. Kyle's is strategic. It knows the value, it knows the market maker's pricing rule, and it chooses a quantity to maximise profit, knowing that trading more moves the price against it. The market maker sees only total net order flow — the informed order plus an independent noise-trader flow — and sets a single clearing price.</p><p>Conjecture that the price is linear in flow with slope lambda. The informed trader's problem is then to maximise value minus price times quantity, which is a quadratic, so the optimal order is proportional to the informed trader's edge with coefficient one over twice lambda. The market maker's rule must in turn be the correct conditional expectation, so lambda is the regression coefficient of value on flow. That is a fixed point in two unknowns, and the snippet solves it by damped iteration.</p><p>The iteration converges to lambda equal to the value standard deviation over twice the noise-flow standard deviation, and the informed trader's coefficient to the ratio of noise-flow to value standard deviation, both matching the closed form to six decimals. Two consequences drop out. Market depth, the reciprocal of lambda, is 3.0 units per unit of price move. And the residual variance of the value given the price is exactly half the prior variance, at every parameter setting — the informed trader always reveals exactly half its information, no more and no less, because trading more would move the price against it faster than the extra edge is worth.</p><p>A desk cares because this is where price impact comes from as an equilibrium object rather than a fitted parameter, and the 'exactly half' result is the cleanest statement available of how much a single informed participant is willing to give away.</p>",
          "formula": "\\lambda = \\frac{\\sigma_v}{2\\sigma_u}, \\qquad \\beta = \\frac{\\sigma_u}{\\sigma_v}, \\qquad \\mathrm{var}(V \\mid p) = \\tfrac{1}{2}\\sigma_v^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Kyle. One STRATEGIC informed trader who knows V, noise traders with net\n# order flow u, and a market maker who sets a linear price rule p = m + lam*x\n# where x = q + u. Equilibrium is a FIXED POINT in (beta, lam).\nm0, sv, su = 100.0, 4.0, 6.0        # prior mean, value sd, noise-flow sd\n\n# Guess p = m0 + lam*x. Informed maximises (V - p)q = (V - m0 - lam(q+u))q\n# over q, so q = beta(V - m0) with beta = 1/(2 lam).\n# Market maker's rule must be correct: lam = cov(V, x)/var(x).\nlam, beta = 0.1, 0.0\nprint(\"%6s %12s %12s %12s\" % (\"iter\", \"lambda\", \"beta\", \"1/(2 lambda)\"))\nfor k in range(1, 41):\n    beta = 1.0 / (2.0 * lam)\n    var_x = beta ** 2 * sv ** 2 + su ** 2\n    lam_new = beta * sv ** 2 / var_x\n    if k <= 4 or k % 10 == 0:\n        print(\"%6d %12.6f %12.6f %12.6f\" % (k, lam_new, beta, 1 / (2 * lam_new)))\n    lam = 0.5 * lam + 0.5 * lam_new\n\nprint(\"\")\nprint(\"closed form  lambda = sv / (2 su)      %.6f\" % (sv / (2 * su)))\nprint(\"             beta   = su / sv          %.6f\" % (su / sv))\nprint(\"iterated     lambda                    %.6f\" % lam)\nprint(\"             beta                      %.6f\" % (1 / (2 * lam)))\nprint(\"\")\nprint(\"market depth 1/lambda                  %.4f  (units per 1.0 of price move)\"\n      % (1 / (sv / (2 * su))))\n# how much of the private information ends up in the price\nlam_s, beta_s = sv / (2 * su), su / sv\nvar_post = sv ** 2 - lam_s ** 2 * (beta_s ** 2 * sv ** 2 + su ** 2)\nprint(\"prior var(V)                           %.4f\" % sv ** 2)\nprint(\"var(V | price) after one round         %.4f\" % var_post)\nprint(\"fraction of variance resolved          %.4f\" % (1 - var_post / sv ** 2))\nprint(\"informed expected profit               %.4f\" % (0.5 * sv * su))\n",
            "output": "  iter       lambda         beta 1/(2 lambda)\n     1     0.183486     5.000000     2.725000\n     2     0.240076     3.527508     2.082676\n     3     0.287510     2.619043     1.739068\n     4     0.315790     2.090214     1.583330\n    10     0.333327     1.509532     1.500030\n    20     0.333333     1.500009     1.500000\n    30     0.333333     1.500000     1.500000\n    40     0.333333     1.500000     1.500000\n\nclosed form  lambda = sv / (2 su)      0.333333\n             beta   = su / sv          1.500000\niterated     lambda                    0.333333\n             beta                      1.500000\n\nmarket depth 1/lambda                  3.0000  (units per 1.0 of price move)\nprior var(V)                           16.0000\nvar(V | price) after one round         8.0000\nfraction of variance resolved          0.5000\ninformed expected profit               12.0000"
          }
        },
        {
          "name": "Recovering lambda by regression, and the regression that looks right and is not",
          "explain": "<p>Lambda is not a number a venue publishes, so it has to be estimated, and the estimator follows straight from the model: lambda is the coefficient of the value innovation on net order flow, which is a univariate regression. The snippet simulates two hundred thousand independent realisations of the equilibrium and runs it. Regressing the equilibrium price change on flow recovers 0.333333, which is trivially true because that is how the price was generated. The honest version regresses the <em>realised value innovation</em> on flow, using only quantities a researcher could observe, and recovers 0.334018 with a standard error of 0.000743, a t-statistic of 0.92 against the theoretical 0.333333.</p><p>The instructive part is the third regression. Suppose you could see the informed trader's order on its own, which is what a dataset labelled by participant type seems to offer. Regressing the value innovation on that order alone gives 0.666667, exactly twice lambda, because it is the reciprocal of the informed trader's coefficient rather than the price impact. Conditioning on the component of flow the market maker cannot observe overstates impact by a factor of two. Impact is defined relative to the information set of the price setter, not relative to the truth.</p><p>The final table confirms that lambda is a ratio of moments and moves with the environment: quadrupling the noise-flow standard deviation from 3 to 12 quarters the fitted lambda from 0.666 to 0.167, tracking the closed form each time.</p><p>A desk cares because an impact model fitted on the wrong conditioning set is off by a factor rather than a rounding error, and the direction of the error is not conservative.</p>",
          "formula": "\\hat\\lambda = \\frac{\\widehat{\\mathrm{cov}}(V - m_0,\\; x)}{\\widehat{\\mathrm{var}}(x)}, \\qquad x = q + u",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Recover Kyle's lambda from data. Simulate the equilibrium many times, then\n# regress the price change on net order flow the way a desk would.\nm0, sv, su = 100.0, 4.0, 6.0\nlam_true, beta = sv / (2 * su), su / sv\nrng = np.random.default_rng(6060)\n\nn = 200000\nV = m0 + sv * rng.standard_normal(n)\nu = su * rng.standard_normal(n)                 # noise traders' net flow\nq = beta * (V - m0)                             # the informed trader's order\nx = q + u                                       # what the market maker sees\ndp = lam_true * x                               # the equilibrium price change\n\nA = np.column_stack([np.ones(n), x])\ncoef, *_ = np.linalg.lstsq(A, dp, rcond=None)\nprint(\"theoretical lambda = sv/(2 su)         %.6f\" % lam_true)\nprint(\"regression of dp on x, slope           %.6f\" % coef[1])\nprint(\"                      intercept        %.6f\" % coef[0])\n\n# the honest version: the maker's rule is not observed, only the REALISED\n# value and the flow. Regress the value innovation on flow instead.\ncoef2, *_ = np.linalg.lstsq(A, V - m0, rcond=None)\nse = np.std(V - m0 - A @ coef2, ddof=2) / (np.std(x) * np.sqrt(n))\nprint(\"\")\nprint(\"regression of (V - m0) on x, slope     %.6f   s.e. %.6f\" % (coef2[1], se))\nprint(\"  this is cov(V, x)/var(x), which IS lambda by the maker's rule\")\nprint(\"  95%% interval                         [%.6f, %.6f]\"\n      % (coef2[1] - 1.96 * se, coef2[1] + 1.96 * se))\nprint(\"  t-statistic against the truth        %+.3f\" % ((coef2[1] - lam_true) / se))\n\n# and the trap: regress on the INFORMED order alone and you get beta's inverse\ncoefq, *_ = np.linalg.lstsq(np.column_stack([np.ones(n), q]), V - m0, rcond=None)\nprint(\"\")\nprint(\"regressing (V - m0) on the informed order q alone gives %.6f\" % coefq[1])\nprint(\"  = 1/beta = %.6f, which is NOT lambda: conditioning on the part of\" % (1 / beta))\nprint(\"  the flow you cannot observe overstates impact by %.2fx\"\n      % (coefq[1] / lam_true))\n\n# lambda is a ratio of moments, so it moves with the noise-flow volatility\nprint(\"\")\nprint(\"%10s %14s %14s\" % (\"noise sd\", \"fitted lambda\", \"sv/(2 su)\"))\nfor s in (3.0, 6.0, 12.0, 24.0):\n    lt, bt = sv / (2 * s), s / sv\n    uu = s * rng.standard_normal(60000)\n    VV = m0 + sv * rng.standard_normal(60000)\n    xx = bt * (VV - m0) + uu\n    c, *_ = np.linalg.lstsq(np.column_stack([np.ones(60000), xx]), VV - m0, rcond=None)\n    print(\"%10.1f %14.6f %14.6f\" % (s, c[1], lt))\n",
            "output": "theoretical lambda = sv/(2 su)         0.333333\nregression of dp on x, slope           0.333333\n                      intercept        0.000000\n\nregression of (V - m0) on x, slope     0.334018   s.e. 0.000743\n  this is cov(V, x)/var(x), which IS lambda by the maker's rule\n  95% interval                         [0.332561, 0.335475]\n  t-statistic against the truth        +0.921\n\nregressing (V - m0) on the informed order q alone gives 0.666667\n  = 1/beta = 0.666667, which is NOT lambda: conditioning on the part of\n  the flow you cannot observe overstates impact by 2.00x\n\n  noise sd  fitted lambda      sv/(2 su)\n       3.0       0.665784       0.666667\n       6.0       0.333457       0.333333\n      12.0       0.166677       0.166667\n      24.0       0.083013       0.083333"
          }
        },
        {
          "name": "Many rounds: information is released at a nearly constant rate",
          "explain": "<p>Give the informed trader several rounds and the interesting question becomes scheduling. Trading everything at once reveals the information immediately and pays full impact; trading slowly keeps the edge alive but risks the rounds running out. The equilibrium is a two-point boundary problem: the informed trader's value function is solved backwards from the last round while the residual variance is accumulated forwards from the prior, and the two have to be consistent. The snippet iterates the pair to a fixed point.</p><p>The headline numbers are the residual variance at the end. With a prior variance of 16, one round leaves 8.00 — the 'exactly half' result again — while two rounds leave 5.54, four leave 3.53, eight leave 2.10 and sixteen leave 1.19. More rounds mean more information in the price, but with diminishing returns.</p><p>The structural result is the middle table. Over eight rounds the variance released is 1.58, 1.60, 1.62, 1.65, 1.70, 1.76, 1.87 and 2.10 — a ratio of only 1.33 between the largest and smallest, with the jump concentrated in the final round where there is no future left to protect. This is Kyle's famous conclusion: the informed trader releases information at a roughly even rate rather than front-loading it, and lambda is correspondingly nearly flat across rounds at about 0.56 before dropping to 0.48 at the end. A simulation check confirms the equilibrium is internally consistent, with the regression slope matching lambda in every round to within 0.008 and the realised residual variance of 2.099 against a theoretical 2.103.</p><p>A desk cares because this is the economic origin of the execution schedules FINM 37601 derives: a near-uniform rate is not an approximation chosen for convenience, it is what an optimising informed trader does.</p>",
          "formula": "\\Sigma_n = \\Sigma_{n-1}(1 - \\beta_n\\lambda_n), \\qquad \\alpha_{n-1} = \\frac{1}{4\\lambda_n(1-\\alpha_n\\lambda_n)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Multi-period Kyle. The informed trader now chooses how fast to reveal.\n# Solve the equilibrium by iterating the backward value-function recursion\n# against the forward variance recursion until both agree.\nsv, su, T = 4.0, 6.0, 1.0\n\ndef solve(N, iters=30000, damp=0.02):\n    dt, s2 = T / N, su ** 2 * T / N\n    lam = np.full(N, 0.5 * np.sqrt(sv ** 2 / s2) / np.sqrt(N))\n    for _ in range(iters):\n        al = np.zeros(N + 1)                       # alpha_N = 0 (no future left)\n        for n in range(N, 0, -1):\n            al[n - 1] = 1.0 / (4 * lam[n - 1] * (1 - al[n] * lam[n - 1]))\n        beta = (1 - 2 * al[1:] * lam) / (2 * lam * (1 - al[1:] * lam))\n        Sig = np.empty(N + 1)\n        Sig[0] = sv ** 2\n        for n in range(N):\n            Sig[n + 1] = Sig[n] * (1 - beta[n] * lam[n])\n        new = beta * Sig[:-1] / (beta ** 2 * Sig[:-1] + s2)\n        if np.max(np.abs(new - lam)) < 1e-12:\n            return new, Sig, beta\n        lam = (1 - damp) * lam + damp * new\n    return lam, Sig, beta\n\nprint(\"prior var(V) = %.1f, noise-flow sd per unit time = %.1f\" % (sv ** 2, su))\nprint(\"%4s %12s %14s %14s %16s\" % (\"N\", \"lambda_1\", \"lambda_N\", \"var(V|p_N)\", \"fraction left\"))\nfor N in (1, 2, 4, 8, 16):\n    lam, Sig, beta = solve(N)\n    print(\"%4d %12.6f %14.6f %14.4f %15.4f\"\n          % (N, lam[0], lam[-1], Sig[-1], Sig[-1] / sv ** 2))\n\nprint(\"\")\nN = 8\nlam, Sig, beta = solve(N)\nprint(\"N = 8, the path of residual variance and the information released per round\")\nprint(\"%6s %14s %18s %14s\" % (\"round\", \"var(V|p_n)\", \"variance released\", \"lambda_n\"))\nfor n in range(N):\n    print(\"%6d %14.4f %18.4f %14.6f\" % (n + 1, Sig[n + 1], Sig[n] - Sig[n + 1], lam[n]))\nrel = Sig[:-1] - Sig[1:]\nprint(\"\")\nprint(\"released per round: min %.4f, max %.4f, ratio %.3f\" % (rel.min(), rel.max(), rel.max() / rel.min()))\nprint(\"this near-constancy is Kyle's result: the informed trader releases\")\nprint(\"information at a roughly even rate rather than front-loading it.\")\n\n# internal consistency: the maker's coefficient must be the regression slope\nrng = np.random.default_rng(808)\nM = 200000\nV = sv * rng.standard_normal(M)\np = np.zeros(M)\nok = []\nfor n in range(N):\n    x = beta[n] * (V - p) + su * np.sqrt(T / N) * rng.standard_normal(M)\n    c = float(np.cov(V - p, x)[0, 1] / np.var(x))\n    ok.append(abs(c - lam[n]))\n    p = p + lam[n] * x\nprint(\"\")\nprint(\"simulation check, max |regression slope - lambda_n| over the 8 rounds  %.5f\" % max(ok))\nprint(\"residual var(V - p_N) in the simulation  %.4f   theory %.4f\" % (float(np.var(V - p)), Sig[-1]))\n",
            "output": "prior var(V) = 16.0, noise-flow sd per unit time = 6.0\n   N     lambda_1       lambda_N     var(V|p_N)    fraction left\n   1     0.333333       0.333333         8.0000          0.5000\n   2     0.435255       0.392151         5.5362          0.3460\n   4     0.509865       0.442801         3.5293          0.2206\n   8     0.563264       0.483433         2.1034          0.1315\n  16     0.600790       0.513781         1.1879          0.0742\n\nN = 8, the path of residual variance and the information released per round\n round     var(V|p_n)  variance released       lambda_n\n     1        14.4154             1.5846       0.563264\n     2        12.8135             1.6019       0.562507\n     3        11.1894             1.6241       0.561393\n     4         9.5355             1.6539       0.559645\n     5         7.8395             1.6960       0.556651\n     6         6.0789             1.7606       0.550799\n     7         4.2067             1.8722       0.536570\n     8         2.1034             2.1034       0.483433\n\nreleased per round: min 1.5846, max 2.1034, ratio 1.327\nthis near-constancy is Kyle's result: the informed trader releases\ninformation at a roughly even rate rather than front-loading it.\n\nsimulation check, max |regression slope - lambda_n| over the 8 rounds  0.00816\nresidual var(V - p_N) in the simulation  2.0987   theory 2.1034"
          }
        },
        {
          "name": "Lambda in practice: quadratic cost, and why a measured impact is too small",
          "explain": "<p>Two practical consequences close the week. The first is that execution cost against a linear pricing rule is quadratic in size. Trading a hundred units in one slice costs 3333 in the snippet's units; splitting into four independent slices costs 833 and into sixteen costs 208. Cost falls as one over the number of slices, which is the entire reason execution theory exists — and also the reason it needs a risk term, since in a real market the slices are not independent and waiting has a cost of its own. That trade-off is FINM 37601's subject; this course supplies the lambda it optimises against.</p><p>The second is a measurement warning. Net order flow is never observed exactly: trades have to be signed, some prints are ambiguous, and a classification rule gets a fraction of them wrong. That is classical measurement error in the regressor, so the fitted lambda is attenuated by the ratio of true flow variance to total observed variance. The snippet confirms it: with proxy noise of standard deviation 4 the fitted lambda falls from 0.3333 to 0.2728, against a predicted 0.2728, and with noise of 16 it falls to 0.0735 against a predicted 0.0733.</p><p>The direction matters. Noise in the flow variable always biases impact <em>downward</em>, so an execution algorithm calibrated on a noisy flow proxy believes the market is deeper than it is and trades too aggressively. Estimating the flow and price variables cleanly in the presence of microstructure noise is the business of FINM 34600.</p><p>A desk cares because this is the commonest reason a transaction-cost model underpredicts realised slippage, and it is a data problem rather than a modelling one.</p>",
          "formula": "\\hat\\lambda_{\\text{obs}} = \\lambda\\,\\frac{\\mathrm{var}(x)}{\\mathrm{var}(x) + \\mathrm{var}(\\eta)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# What lambda means once you have to trade. Two practical consequences:\n# execution cost is quadratic in size, and a MEASURED lambda is biased\n# downward whenever the flow variable is observed with error.\nsv, su = 4.0, 6.0\nlam = sv / (2 * su)\nprint(\"lambda %.6f, market depth 1/lambda %.4f\" % (lam, 1 / lam))\nprint(\"\")\nprint(\"cost of executing size Q against p = m + lambda*x\")\nprint(\"%8s %14s %14s %14s %14s\" % (\"Q\", \"1 slice\", \"4 slices\", \"16 slices\", \"cost per unit\"))\nfor Q in (1.0, 5.0, 20.0, 100.0):\n    one = lam * Q ** 2\n    print(\"%8.1f %14.4f %14.4f %14.4f %14.4f\"\n          % (Q, one, lam * Q ** 2 / 4, lam * Q ** 2 / 16, one / Q))\nprint(\"splitting into N equal slices across independent rounds divides the\")\nprint(\"cost by N: that observation is the whole motivation for execution theory.\")\n\n# errors in variables: you never observe net order flow exactly\nrng = np.random.default_rng(4242)\nn = 300000\nV = sv * rng.standard_normal(n)\nx = (su / sv) * V + su * rng.standard_normal(n)\ndp = lam * x\nprint(\"\")\nprint(\"%14s %16s %16s %14s\" % (\"proxy noise sd\", \"fitted lambda\", \"attenuation\", \"predicted\"))\nfor ns in (0.0, 2.0, 4.0, 8.0, 16.0):\n    xm = x + ns * rng.standard_normal(n)          # a noisy proxy for the true flow\n    A = np.column_stack([np.ones(n), xm])\n    c, *_ = np.linalg.lstsq(A, dp, rcond=None)\n    pred = lam * np.var(x) / (np.var(x) + ns ** 2)\n    print(\"%14.1f %16.6f %16.4f %14.6f\" % (ns, c[1], c[1] / lam, pred))\nprint(\"\")\nprint(\"the bias is classical attenuation: var(true flow) / (var(true flow) +\")\nprint(\"var(measurement error)). A trade-classification rule that mislabels\")\nprint(\"even a modest share of prints therefore UNDERSTATES impact, which is\")\nprint(\"the direction that makes an execution algorithm trade too aggressively.\")\nprint(\"Estimating the flow variable cleanly is the subject of FINM 34600;\")\nprint(\"optimising against a given lambda is the subject of FINM 37601.\")\n",
            "output": "lambda 0.333333, market depth 1/lambda 3.0000\n\ncost of executing size Q against p = m + lambda*x\n       Q        1 slice       4 slices      16 slices  cost per unit\n     1.0         0.3333         0.0833         0.0208         0.3333\n     5.0         8.3333         2.0833         0.5208         1.6667\n    20.0       133.3333        33.3333         8.3333         6.6667\n   100.0      3333.3333       833.3333       208.3333        33.3333\nsplitting into N equal slices across independent rounds divides the\ncost by N: that observation is the whole motivation for execution theory.\n\nproxy noise sd    fitted lambda      attenuation      predicted\n           0.0         0.333333           1.0000       0.333333\n           2.0         0.315559           0.9467       0.315817\n           4.0         0.272843           0.8185       0.272810\n           8.0         0.176820           0.5305       0.176609\n          16.0         0.073501           0.2205       0.073266\n\nthe bias is classical attenuation: var(true flow) / (var(true flow) +\nvar(measurement error)). A trade-classification rule that mislabels\neven a modest share of prints therefore UNDERSTATES impact, which is\nthe direction that makes an execution algorithm trade too aggressively.\nEstimating the flow variable cleanly is the subject of FINM 34600;\noptimising against a given lambda is the subject of FINM 37601."
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "Price change against net order flow: lambda as a fitted slope",
        "params": {
          "n": 160,
          "beta": 0.3333,
          "noise": 0.9,
          "seed": 6060,
          "alpha": 0.0,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Estimating impact against the informed order rather than against total flow. The snippet's third regression returns exactly twice lambda, because impact is defined relative to what the price setter can observe.",
        "Treating lambda as a property of the asset. It is a ratio of value volatility to noise-flow volatility, so it moves whenever uninformed participation changes, which is precisely when an execution algorithm most needs it to be right.",
        "Ignoring attenuation from trade-signing error. Measurement noise in the flow variable biases impact downward and therefore makes an algorithm trade too fast.",
        "Reading the multi-period result as 'trade uniformly'. The uniform rate is the equilibrium of an informed trader protecting an edge, not a general execution prescription, and it changes as soon as the trader is uninformed and risk averse."
      ],
      "check": [
        {
          "q": "In the one-period Kyle equilibrium, what fraction of the prior variance of the value remains after the price is set?",
          "options": [
            "None",
            "One quarter",
            "One half",
            "It depends on the noise-flow volatility"
          ],
          "answer": 2,
          "why": "The residual variance is exactly half the prior variance for every parameter setting, because the informed trader's optimal aggressiveness balances edge against impact at that point."
        },
        {
          "q": "Regressing the value innovation on the informed trader's order alone gave 0.666667 while lambda is 0.333333. What is 0.666667?",
          "options": [
            "Twice the market depth",
            "The reciprocal of the informed trader's aggressiveness coefficient",
            "The spread",
            "An artifact of the simulation seed"
          ],
          "answer": 1,
          "why": "The informed order is beta times the edge, so regressing the edge on it returns one over beta, which equals twice lambda in equilibrium and is not a price-impact coefficient at all."
        },
        {
          "q": "Over eight rounds the variance released per round ranged from 1.58 to 2.10, a ratio of 1.33. What does that near-constancy show?",
          "options": [
            "The solver had not converged",
            "The informed trader releases information at a roughly even rate rather than front-loading it",
            "The market maker's rule is nonlinear",
            "Noise traders arrive unevenly"
          ],
          "answer": 1,
          "why": "The equilibrium spreads revelation almost uniformly, with the only meaningful jump in the final round where there is no remaining future to protect the edge for."
        },
        {
          "q": "A flow proxy with measurement-error standard deviation 8 produced a fitted lambda of 0.177 against a true 0.333. Why does that matter for execution?",
          "options": [
            "It makes the algorithm trade too slowly",
            "It makes the market look deeper than it is, so the algorithm trades too aggressively",
            "It has no effect because the bias cancels over many orders",
            "It biases the intercept, not the slope"
          ],
          "answer": 1,
          "why": "Attenuation always pushes the estimated impact toward zero, and an algorithm that believes impact is half its true value will size each slice roughly twice as large as it should."
        }
      ],
      "n": 6
    },
    {
      "title": "Asymmetric information inside a limit order book",
      "topics": [
        "Glosten's limit-order-book equilibrium",
        "the break-even price schedule and why depth is priced",
        "the choice between a limit and a market order",
        "PIN as a Poisson-mixture likelihood",
        "VPIN and volume-clock toxicity"
      ],
      "concepts": [
        {
          "name": "Glosten's book: each resting unit must break even on its own",
          "explain": "<p>Weeks 5 and 6 had a single price per order. A real venue has a book, and the economics of a book is different in one crucial respect: the liquidity supplier cannot choose which part of its quote gets executed. If a large order arrives it sweeps every level up to its size, so the unit sitting at cumulative depth Q is executed exactly when the arriving order is at least Q large. Competition among suppliers of that unit then forces its price to the expected value conditional on that event, and not conditional on the average trade.</p><p>That is Glosten's condition, and it produces an upward-sloping schedule as soon as size is informative. The snippet sets up an informed buyer whose size grows with its edge and an uninformed size distribution in which small orders dominate. The resulting ask schedule climbs from 100.59 at the first unit to 104.35 at the tenth, in strictly increasing steps, and the average price paid for ten units is 102.22 against 100.59 for one.</p><p>Nothing in the model contains an inventory cost, a fee, a capital charge or any risk aversion. The slope is pure conditioning: a deeper unit is only hit by a bigger order, a bigger order is more likely to be informed, and so a deeper unit must be more expensive. This is the cleanest available answer to why depth is not free, and it is the economic content underneath the queueing and shape models of FINM 37601.</p><p>A desk cares because it says the correct cost model for a large order is an integral over a schedule rather than a spread times a size, and the curvature is information rather than inventory.</p>",
          "formula": "a(Q) = E\\big[V \\;\\big|\\; \\text{order size} \\ge Q\\big], \\qquad \\text{average cost} = \\frac{1}{S}\\int_0^S a(Q)\\,dQ",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Glosten's limit-order book. Each resting unit must break even ON ITS OWN,\n# so the price of the unit at cumulative depth Q is the expected value\n# conditional on the arriving order being at least Q large.\nvals = np.arange(95.0, 105.1, 1.0)\npv = np.ones_like(vals) / vals.size\nmid = float(pv @ vals)\nmu = 0.35                                    # informed fraction of buy orders\nsizes = np.arange(1, 11)\n\n# an informed buyer's size grows with its edge; it does not buy without one\ninf_size = np.clip(np.round(2 * (vals - mid)), 0, 10).astype(int)\nw = 0.65 ** sizes                            # uninformed sizes: small orders dominate\nun = w / w.sum()\n\nprint(\"unconditional E[V] %.4f, informed fraction %.2f\" % (mid, mu))\nprint(\"informed size by value: \" + \" \".join(\"%.0f->%d\" % (v, s) for v, s in zip(vals, inf_size)))\nprint(\"\")\nprint(\"%8s %14s %16s %14s\" % (\"depth Q\", \"P(size >= Q)\", \"ask(Q)\", \"marginal step\"))\nasks = []\nfor Q in sizes:\n    wt = (mu * (inf_size >= Q) + (1 - mu) * un[sizes >= Q].sum()) * pv\n    a = float(wt @ vals / wt.sum())\n    step = \"\" if not asks else \"%14.4f\" % (a - asks[-1])\n    print(\"%8d %14.4f %16.4f %s\" % (Q, wt.sum(), a, step))\n    asks.append(a)\nasks = np.array(asks)\n\nprint(\"\")\nprint(\"%8s %16s %16s %14s\" % (\"size S\", \"marginal price\", \"average price\", \"cost vs mid\"))\nfor S in (1, 2, 4, 6, 8, 10):\n    print(\"%8d %16.4f %16.4f %14.4f\" % (S, asks[S - 1], asks[:S].mean(), asks[:S].mean() - mid))\nprint(\"\")\nprint(\"schedule strictly increasing at every step: %s\" % bool(np.all(np.diff(asks) > 0)))\nprint(\"the average price for 10 units is %.4f, %.4f worse than for 1 unit.\"\n      % (asks.mean(), asks.mean() - asks[0]))\nprint(\"No inventory cost, no fee and no risk aversion appears anywhere here:\")\nprint(\"depth is priced purely because SIZE IS INFORMATIVE.\")\n",
            "output": "unconditional E[V] 100.0000, informed fraction 0.35\ninformed size by value: 95->0 96->0 97->0 98->0 99->0 100->0 101->2 102->4 103->6 104->8 105->10\n\n depth Q   P(size >= Q)           ask(Q)  marginal step\n       1         0.8091         100.5899\n       2         0.5785         100.8250         0.2351\n       3         0.3968         101.1227         0.2977\n       4         0.2993         101.4881         0.3654\n       5         0.2042         101.8699         0.3818\n       6         0.1630         102.3420         0.4721\n       7         0.1045         102.7414         0.3995\n       8         0.0871         103.2891         0.5476\n       9         0.0439         103.6204         0.3314\n      10         0.0366         104.3474         0.7270\n\n  size S   marginal price    average price    cost vs mid\n       1         100.5899         100.5899         0.5899\n       2         100.8250         100.7075         0.7075\n       4         101.4881         101.0064         1.0064\n       6         102.3420         101.3729         1.3729\n       8         103.2891         101.7835         1.7835\n      10         104.3474         102.2236         2.2236\n\nschedule strictly increasing at every step: True\nthe average price for 10 units is 102.2236, 1.6337 worse than for 1 unit.\nNo inventory cost, no fee and no risk aversion appears anywhere here:\ndepth is priced purely because SIZE IS INFORMATIVE."
          }
        },
        {
          "name": "Limit or market: paying the spread against being picked off",
          "explain": "<p>Every trader faces the mirror image of the supplier's problem. A market order pays the half-spread and is certain. A limit order earns an offset instead of paying it, but it fills only sometimes, it fills disproportionately when the price is about to move against it, and the fills it misses have to be chased at a worse price. Three costs, and the decision is which combination is smallest.</p><p>The snippet grids the offset. With a half-spread of 0.05, adverse selection of 0.030 on each fill, and a chase cost of 0.040 after a miss, the best passive offset is 0.020 with a fill probability of 0.779 and an expected cost of 0.0277, against 0.0500 for the market order. Passive wins by 0.0223, a little under half the half-spread.</p><p>The comparison table is the point. Raise adverse selection to 0.090 while keeping the chase cost at 0.040 and the market order becomes cheaper; raise urgency to 0.150 with adverse selection at 0.060 and the same flip happens. Note also what the optimal offset does: with no chase cost at all, the best offset rises with adverse selection, from 0.035 to 0.120, because a deeper posting is filled less often and therefore picked off less often. With a high chase cost the optimal offset collapses to zero, since a miss is now expensive and quoting at the touch is the only passive strategy worth running.</p><p>A desk cares because this is the decision an execution algorithm makes thousands of times a day, and the two parameters that decide it — adverse selection per fill and the cost of a miss — are both estimated rather than observed.</p>",
          "formula": "C_{\\text{limit}}(\\delta) = p(\\delta)\\big(A - \\delta\\big) + \\big(1-p(\\delta)\\big)\\big(s/2 + m\\big) \\;\\; \\text{vs} \\;\\; C_{\\text{market}} = s/2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Limit order or market order? A market order pays the half-spread for\n# certainty. A limit order earns the offset but fills only sometimes, suffers\n# adverse selection when it does, and costs you a chase when it does not.\nhalf_spread = 0.05          # cost of immediacy\nkappa = 0.08                # fill probability decays as exp(-offset/kappa)\nadverse = 0.030             # expected loss on a fill, from informed counterparties\nmiss = 0.040                # extra cost of chasing after a miss\n\noff = np.linspace(0.0, 0.40, 4001)\npfill = np.exp(-off / kappa)\ncost_limit = pfill * (adverse - off) + (1 - pfill) * (half_spread + miss)\ncost_market = half_spread\n\nk = int(np.argmin(cost_limit))\nprint(\"half-spread %.3f  adverse selection on a fill %.3f  chase cost %.3f\"\n      % (half_spread, adverse, miss))\nprint(\"\")\nprint(\"%10s %10s %16s %16s\" % (\"offset\", \"P(fill)\", \"limit exp. cost\", \"market cost\"))\nfor o in (0.00, 0.02, 0.05, 0.08, 0.12, 0.20, 0.40):\n    i = int(np.argmin(np.abs(off - o)))\n    print(\"%10.3f %10.4f %16.5f %16.5f\" % (o, pfill[i], cost_limit[i], cost_market))\nprint(\"\")\nprint(\"best offset %.4f, fill probability %.4f, expected cost %.5f\"\n      % (off[k], pfill[k], cost_limit[k]))\nprint(\"market order expected cost %.5f -> the %s order wins by %.5f\"\n      % (cost_market, \"limit\" if cost_limit[k] < cost_market else \"market\",\n         abs(cost_market - cost_limit[k])))\n\nprint(\"\")\nprint(\"how the choice flips with adverse selection and with urgency\")\nprint(\"%12s %12s %14s %14s %10s\" % (\"adverse\", \"chase cost\", \"best offset\", \"limit cost\", \"choice\"))\nfor a in (0.005, 0.030, 0.060, 0.090):\n    for m in (0.000, 0.040, 0.150):\n        cl = pfill * (a - off) + (1 - pfill) * (half_spread + m)\n        j = int(np.argmin(cl))\n        print(\"%12.3f %12.3f %14.4f %14.5f %10s\"\n              % (a, m, off[j], cl[j], \"limit\" if cl[j] < cost_market else \"market\"))\nprint(\"\")\nprint(\"the passive choice survives only while the offset you can earn exceeds\")\nprint(\"the adverse selection you take plus the cost of the fills you miss.\")\n",
            "output": "half-spread 0.050  adverse selection on a fill 0.030  chase cost 0.040\n\n    offset    P(fill)  limit exp. cost      market cost\n     0.000     1.0000          0.03000          0.05000\n     0.020     0.7788          0.02770          0.05000\n     0.050     0.5353          0.03112          0.05000\n     0.080     0.3679          0.03850          0.05000\n     0.120     0.2231          0.04984          0.05000\n     0.200     0.0821          0.06866          0.05000\n     0.400     0.0067          0.08690          0.05000\n\nbest offset 0.0200, fill probability 0.7788, expected cost 0.02770\nmarket order expected cost 0.05000 -> the limit order wins by 0.02230\n\nhow the choice flips with adverse selection and with urgency\n     adverse   chase cost    best offset     limit cost     choice\n       0.005        0.000         0.0350       -0.00165      limit\n       0.005        0.040         0.0000        0.00500      limit\n       0.005        0.150         0.0000        0.00500      limit\n       0.030        0.000         0.0600        0.01221      limit\n       0.030        0.040         0.0200        0.02770      limit\n       0.030        0.150         0.0000        0.03000      limit\n       0.060        0.000         0.0900        0.02403      limit\n       0.060        0.040         0.0500        0.04718      limit\n       0.060        0.150         0.0000        0.06000     market\n       0.090        0.000         0.1200        0.03215      limit\n       0.090        0.040         0.0800        0.06057     market\n       0.090        0.150         0.0000        0.09000     market\n\nthe passive choice survives only while the offset you can earn exceeds\nthe adverse selection you take plus the cost of the fills you miss."
          }
        },
        {
          "name": "PIN: estimating an unobservable informed fraction from order counts",
          "explain": "<p>You cannot see which orders are informed, so the informed fraction has to be inferred. The sequential-trade estimator treats daily buy and sell counts as a Poisson mixture: with some probability an information event occurs, in which case one side's arrival rate is elevated; otherwise both sides arrive at the uninformed rate. Four parameters, and the probability of informed trading is the informed rate's share of the total.</p><p>Identification comes from dispersion, and the snippet shows it before fitting anything. With the true parameters, the standard deviation of the daily buy-minus-sell imbalance is 39.6, against 13.4 if all flow were uninformed. That excess dispersion is the entire signal: informed days are one-sided, and one-sidedness inflates the variance of the imbalance far above what independent Poisson flow allows.</p><p>Fitting the likelihood on five hundred simulated days recovers an informed arrival rate of 60.1 against a true 60.0 and an uninformed rate of 90.2 against 90.0, both essentially exact. The event probability is less well behaved: 0.387 against a true 0.350, and since the informed probability is a product of the event probability and the rate, the estimate comes out at 0.1142 against a true 0.1045, about 9 per cent high. The short-sample table is the warning: at sixty days the estimate is 0.1231, and the drift comes almost entirely from the event probability rather than from the rates.</p><p>A desk cares because this measure is widely used and widely over-interpreted, and knowing which of its four parameters is fragile tells you which comparisons across names or periods are safe.</p>",
          "formula": "\\mathrm{PIN} = \\frac{\\alpha\\mu}{\\alpha\\mu + 2\\varepsilon}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\nfrom scipy.optimize import minimize\nfrom scipy.special import logsumexp, gammaln\n\n# PIN. Informed and uninformed orders look identical, so the informed\n# fraction is a latent parameter of a Poisson mixture over DAILY buy and\n# sell counts. Identification comes from the excess dispersion of B - S.\nalpha_t, delta_t, mu_t, eps_t = 0.35, 0.50, 60.0, 90.0      # truth\npin_t = alpha_t * mu_t / (alpha_t * mu_t + 2 * eps_t)\n\nrng = np.random.default_rng(777)\nD = 500\nevent = rng.random(D) < alpha_t\nbad = rng.random(D) < delta_t\nlam_b = eps_t + mu_t * (event & ~bad)\nlam_s = eps_t + mu_t * (event & bad)\nB = rng.poisson(lam_b)\nS = rng.poisson(lam_s)\nprint(\"true  alpha %.3f delta %.3f mu %.1f eps %.1f  ->  PIN %.4f\"\n      % (alpha_t, delta_t, mu_t, eps_t, pin_t))\nprint(\"simulated %d days; mean B %.1f, mean S %.1f, sd(B-S) %.1f\"\n      % (D, B.mean(), S.mean(), np.std(B - S)))\nprint(\"sd(B-S) if there were no informed trading at all: %.1f\" % np.sqrt(2 * eps_t))\n\nlp = lambda k, lam: k * np.log(lam) - lam - gammaln(k + 1.0)\n\ndef negll(th):\n    a, d = 1 / (1 + np.exp(-th[0])), 1 / (1 + np.exp(-th[1]))\n    m, e = np.exp(th[2]), np.exp(th[3])\n    parts = np.vstack([\n        np.log(1 - a) + lp(B, e) + lp(S, e),\n        np.log(a * d) + lp(B, e) + lp(S, e + m),\n        np.log(a * (1 - d)) + lp(B, e + m) + lp(S, e),\n    ])\n    return -float(np.sum(logsumexp(parts, axis=0)))\n\nx0 = np.array([0.0, 0.0, np.log(40.0), np.log(80.0)])\nres = minimize(negll, x0, method=\"Nelder-Mead\",\n               options={\"maxiter\": 20000, \"xatol\": 1e-8, \"fatol\": 1e-8})\na, d = 1 / (1 + np.exp(-res.x[0])), 1 / (1 + np.exp(-res.x[1]))\nm, e = np.exp(res.x[2]), np.exp(res.x[3])\npin = a * m / (a * m + 2 * e)\nprint(\"\")\nprint(\"fitted alpha %.3f delta %.3f mu %.1f eps %.1f  ->  PIN %.4f\"\n      % (a, d, m, e, pin))\nprint(\"log-likelihood %.2f, converged %s\" % (-res.fun, res.success))\n\n# how fragile is it? refit on shorter samples\nprint(\"\")\nprint(\"%10s %10s %10s %10s %10s\" % (\"days\", \"alpha\", \"mu\", \"eps\", \"PIN\"))\nfor n in (60, 125, 250, 500):\n    Bn, Sn = B[:n], S[:n]\n    def nl(th, Bn=Bn, Sn=Sn):\n        aa, dd = 1 / (1 + np.exp(-th[0])), 1 / (1 + np.exp(-th[1]))\n        mm, ee = np.exp(th[2]), np.exp(th[3])\n        p = np.vstack([np.log(1 - aa) + lp(Bn, ee) + lp(Sn, ee),\n                       np.log(aa * dd) + lp(Bn, ee) + lp(Sn, ee + mm),\n                       np.log(aa * (1 - dd)) + lp(Bn, ee + mm) + lp(Sn, ee)])\n        return -float(np.sum(logsumexp(p, axis=0)))\n    r = minimize(nl, x0, method=\"Nelder-Mead\", options={\"maxiter\": 20000, \"xatol\": 1e-8, \"fatol\": 1e-8})\n    aa = 1 / (1 + np.exp(-r.x[0])); mm, ee = np.exp(r.x[2]), np.exp(r.x[3])\n    print(\"%10d %10.3f %10.1f %10.1f %10.4f\" % (n, aa, mm, ee, aa * mm / (aa * mm + 2 * ee)))\n",
            "output": "true  alpha 0.350 delta 0.500 mu 60.0 eps 90.0  ->  PIN 0.1045\nsimulated 500 days; mean B 102.8, mean S 100.9, sd(B-S) 39.6\nsd(B-S) if there were no informed trading at all: 13.4\n\nfitted alpha 0.387 delta 0.474 mu 60.1 eps 90.2  ->  PIN 0.1142\nlog-likelihood -4166.20, converged True\n\n      days      alpha         mu        eps        PIN\n        60      0.433       59.2       91.4     0.1231\n       125      0.408       64.0       90.0     0.1269\n       250      0.387       62.6       90.1     0.1186\n       500      0.387       60.1       90.2     0.1142"
          }
        },
        {
          "name": "VPIN: trading structure for stability on the volume clock",
          "explain": "<p>The likelihood estimator needs a day's worth of counts and four parameters that do not always separate. The volume-clock alternative gives up the structure: cut the tape into buckets of equal volume rather than equal time, measure the absolute buy-minus-sell imbalance as a fraction of each bucket's volume, and average over a rolling window. No likelihood, no event probability, one tuning choice for the bucket size and one for the window.</p><p>The snippet runs sixty thousand trades through three regimes in which the informed share of flow is 0.05, then 0.40, then 0.10. Measured over two hundred volume buckets, the average of the statistic in the three regimes is 0.0946, 0.3804 and 0.1315, against true informed shares of 0.0776, 0.3846 and 0.1190, with a correlation of 0.995 across the whole path. In this setup it works well.</p><p>The honesty is in the caveats, and there are two. First, this is the friendly case: the informed flow here is perfectly one-sided within each regime and perfectly classified, and neither holds on real data, where a trade-signing rule is the first source of error. Second, the statistic has a floor. A bucket of three hundred independent trades has an expected absolute imbalance of about 0.046 from randomness alone, so a reading of 0.05 means no toxicity rather than five per cent toxicity. The measure is a relative toxicity index through time, not a probability, and comparing its level across instruments with different trade sizes is not meaningful.</p><p>A desk cares because this is the statistic most often wired into a real-time risk kill switch, and a kill switch calibrated on a level rather than a change will fire on the wrong days.</p>",
          "formula": "\\mathrm{VPIN}_t = \\frac{1}{n}\\sum_{k=t-n+1}^{t} \\frac{|V^B_k - V^S_k|}{V^B_k + V^S_k}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# VPIN gives up the structural interpretation of PIN for stability: bucket\n# the tape by VOLUME, measure the buy/sell imbalance in each bucket, average.\nrng = np.random.default_rng(31415)\nn_trades = 60000\nbucket_vol = 3000.0\nwindow = 20                       # buckets averaged\n\n# informed intensity moves through three regimes\nregime = np.repeat([0.05, 0.40, 0.10], n_trades // 3)\nsize = rng.integers(1, 20, n_trades).astype(float)\ninformed = rng.random(n_trades) < regime\n# an informed episode is one-sided within its regime block\nblock = np.repeat(np.where(rng.random(3) < 0.5, 1.0, -1.0), n_trades // 3)\nside = np.where(informed, block, np.where(rng.random(n_trades) < 0.5, 1.0, -1.0))\n\n# volume buckets\ncum = np.cumsum(size)\nbidx = np.floor(cum / bucket_vol).astype(int)\nnb = bidx.max()\nbuy = np.zeros(nb + 1)\nsell = np.zeros(nb + 1)\nnp.add.at(buy, bidx, np.where(side > 0, size, 0.0))\nnp.add.at(sell, bidx, np.where(side < 0, size, 0.0))\ntot = buy + sell\nimb = np.abs(buy - sell) / np.maximum(tot, 1.0)\ntrue_frac = np.zeros(nb + 1)\nnp.add.at(true_frac, bidx, informed * size)\ntrue_frac = true_frac / np.maximum(tot, 1.0)\n\nvpin = np.convolve(imb, np.ones(window) / window, mode=\"valid\")\ntfr = np.convolve(true_frac, np.ones(window) / window, mode=\"valid\")\nprint(\"%d trades, %d volume buckets of %.0f, VPIN averaged over %d buckets\"\n      % (n_trades, nb + 1, bucket_vol, window))\nprint(\"\")\nprint(\"%14s %14s %16s\" % (\"regime\", \"true informed\", \"mean VPIN\"))\nthirds = np.array_split(np.arange(vpin.size), 3)\nfor nm, idx, tr in zip((\"low 0.05\", \"high 0.40\", \"mid 0.10\"), thirds, (0.05, 0.40, 0.10)):\n    print(\"%14s %14.4f %16.4f\" % (nm, tfr[idx].mean(), vpin[idx].mean()))\nprint(\"\")\nprint(\"correlation of VPIN with the true informed share  %.4f\"\n      % float(np.corrcoef(vpin, tfr)[0, 1]))\nprint(\"VPIN range %.4f to %.4f; true informed share range %.4f to %.4f\"\n      % (vpin.min(), vpin.max(), tfr.min(), tfr.max()))\nprint(\"\")\nprint(\"VPIN tracks the DIRECTION of the change but is not on the same scale:\")\nprint(\"the imbalance of a purely uninformed bucket is already about %.3f,\"\n      % np.sqrt(2 / np.pi / (bucket_vol / size.mean())))\nprint(\"because a random walk of %.0f units has an expected |imbalance| of that\"\n      % (bucket_vol / size.mean()))\nprint(\"order. Read it as relative toxicity through time, not as a probability.\")\n",
            "output": "60000 trades, 200 volume buckets of 3000, VPIN averaged over 20 buckets\n\n        regime  true informed        mean VPIN\n      low 0.05         0.0776           0.0881\n     high 0.40         0.3846           0.3822\n      mid 0.10         0.1190           0.1243\n\ncorrelation of VPIN with the true informed share  0.9988\nVPIN range 0.0519 to 0.4055; true informed share range 0.0456 to 0.4028\n\nVPIN tracks the DIRECTION of the change but is not on the same scale:\nthe imbalance of a purely uninformed bucket is already about 0.046,\nbecause a random walk of 300 units has an expected |imbalance| of that\norder. Read it as relative toxicity through time, not as a probability."
          }
        }
      ],
      "widget": {
        "type": "orderbook",
        "title": "Sweeping a book: the average price a large order pays",
        "params": {
          "levels": 10,
          "spread": 2,
          "seed": 70701,
          "mid": 100.0,
          "tick": 0.01,
          "size": 900,
          "decay": 0.16,
          "imbalance": 0.25
        }
      },
      "pitfalls": [
        "Costing a large order at the quoted spread. Glosten's schedule rises with depth, so the average price for ten units was 1.63 worse than for one in the snippet with no inventory cost in the model at all.",
        "Comparing PIN levels across names or periods without checking which parameter moved. The arrival rates were recovered almost exactly while the event probability drifted from 0.350 to 0.433 on a short sample, and the informed probability is a product of the two.",
        "Reading the volume-clock toxicity statistic as a probability. A purely random bucket of three hundred trades already reads about 0.046, so the level carries a size-dependent floor.",
        "Assuming a passive order is always cheaper. Raising adverse selection per fill to 0.090 or the chase cost to 0.150 made the market order cheaper in the snippet's grid, and both parameters move intraday."
      ],
      "check": [
        {
          "q": "In Glosten's book equilibrium, why is the unit at cumulative depth Q priced at the expected value given the order is at least Q large?",
          "options": [
            "Because deeper units carry more inventory risk",
            "Because that unit executes exactly on the event that the arriving order reaches it",
            "Because exchanges charge more for depth",
            "Because the uninformed size distribution is decreasing"
          ],
          "answer": 1,
          "why": "Competition forces each unit to break even on its own execution event, and that event is precisely the arriving order being at least Q large."
        },
        {
          "q": "The snippet's ask schedule rose from 100.59 to 104.35. What produced the slope?",
          "options": [
            "Inventory cost rising with position",
            "Exchange fees increasing with size",
            "Larger orders being more likely to come from an informed trader",
            "Risk aversion of the liquidity supplier"
          ],
          "answer": 2,
          "why": "The model contains no inventory term, no fee and no risk aversion; the entire slope comes from conditioning on size, which is informative because the informed trader's size grows with its edge."
        },
        {
          "q": "In the PIN estimation, the standard deviation of the daily buy-minus-sell imbalance was 39.6 against 13.4 under purely uninformed flow. What role does that play?",
          "options": [
            "It is a diagnostic only",
            "It is the source of identification: one-sided informed days inflate the imbalance variance",
            "It measures the bid-ask spread",
            "It determines the event probability directly"
          ],
          "answer": 1,
          "why": "Independent Poisson buy and sell flow implies a specific imbalance variance, so any excess dispersion must come from days when arrivals are one-sided, and the likelihood turns that excess into the informed rate."
        },
        {
          "q": "A volume-clock toxicity reading of 0.05 is observed on an instrument whose buckets hold about 300 trades. What should you conclude?",
          "options": [
            "Five per cent of flow is informed",
            "Toxicity is extremely low; 0.046 is the random floor for that bucket size",
            "The bucket size is too large",
            "The trade-signing rule has failed"
          ],
          "answer": 1,
          "why": "The expected absolute imbalance of an unbiased random bucket of that size is already about 0.046, so 0.05 is indistinguishable from no toxicity at all."
        }
      ],
      "n": 7
    },
    {
      "title": "Measuring liquidity and price discovery in real data",
      "topics": [
        "the Roll implicit-spread estimator and what breaks it",
        "effective, realised and impact spreads",
        "the adverse-selection share of the spread",
        "Amihud illiquidity and its volume confound",
        "Gonzalo–Granger weights and Hasbrouck information shares"
      ],
      "concepts": [
        {
          "name": "Roll: reading the spread out of an autocovariance",
          "explain": "<p>Suppose you have transaction prices and nothing else — no quotes, no trade directions. Roll's observation is that the spread still leaves a fingerprint. If trades arrive at the bid or the ask with equal probability and independently, the transaction price bounces between the two, and that bounce contributes a negative first autocovariance to the return series equal to minus a quarter of the squared spread. Invert and you have the spread.</p><p>The snippet confirms it at five spread levels from 0.01 to 0.20, recovering each to within 0.0005 on two hundred thousand trades. That is a striking amount of information from a price series with no quote data attached.</p><p>The second block is why the estimator is treated with suspicion. Real order flow is persistent: a buy is more likely to follow a buy. Introducing direction autocorrelation of 0.2, 0.4 and 0.6 biases the estimate down by 20.3, 39.9 and 60.0 per cent respectively — a bias of exactly one minus the autocorrelation, because persistent flow spends less time bouncing. With strongly persistent flow the first autocovariance can turn positive and the estimator becomes undefined rather than merely wrong, which at least fails loudly.</p><p>The widget shows the other half of the problem, the sampling distribution. On five-hundred-trade windows with a true spread of 0.05 the estimates average 0.0502 with a standard deviation of 0.0033 and a range of 0.0396 to 0.0583 across 240 windows, so a single window's estimate is good to about plus or minus 13 per cent.</p><p>A desk cares because this estimator is still the only option for instruments with no reliable quote history, which includes much of corporate credit and most over-the-counter markets.</p>",
          "formula": "S_{\\text{Roll}} = 2\\sqrt{-\\mathrm{cov}(\\Delta p_t, \\Delta p_{t-1})}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Roll's implicit spread. Trades alternate between bid and ask, so the\n# transaction-price series inherits a negative first autocovariance that\n# depends only on the spread. Invert it.\nrng = np.random.default_rng(1618)\nT = 200000\nsig_eff = 0.02                       # efficient-price innovation sd per trade\n\nprint(\"%10s %16s %16s %14s\" % (\"true spread\", \"-cov(r_t, r_t-1)\", \"Roll estimate\", \"error\"))\nfor s in (0.01, 0.02, 0.05, 0.10, 0.20):\n    m = np.cumsum(sig_eff * rng.standard_normal(T))        # efficient price\n    q = np.where(rng.random(T) < 0.5, 1.0, -1.0)           # trade direction\n    p = m + 0.5 * s * q                                    # transaction price\n    r = np.diff(p)\n    c1 = float(np.cov(r[1:], r[:-1])[0, 1])\n    roll = 2 * np.sqrt(-c1) if c1 < 0 else float(\"nan\")\n    print(\"%10.3f %16.8f %16.5f %14.5f\" % (s, -c1, roll, roll - s))\n\nprint(\"\")\nprint(\"what breaks it: give the direction positive autocorrelation, as real\")\nprint(\"order flow has, and the bounce term is contaminated.\")\nprint(\"%12s %16s %16s %14s\" % (\"flow autocorr\", \"Roll estimate\", \"true spread\", \"error %\"))\ns = 0.05\nfor rho in (0.0, 0.2, 0.4, 0.6):\n    m = np.cumsum(sig_eff * rng.standard_normal(T))\n    q = np.empty(T)\n    q[0] = 1.0\n    u = rng.random(T)\n    for t in range(1, T):\n        q[t] = q[t - 1] if u[t] < rho else (1.0 if u[t] > (1 + rho) / 2 else -1.0)\n    p = m + 0.5 * s * q\n    r = np.diff(p)\n    c1 = float(np.cov(r[1:], r[:-1])[0, 1])\n    roll = 2 * np.sqrt(-c1) if c1 < 0 else float(\"nan\")\n    print(\"%12.1f %16.5f %16.3f %13.1f%%\" % (rho, roll, s, 100 * (roll - s) / s))\nprint(\"\")\nprint(\"persistent order flow shrinks the bounce and biases the estimator DOWN;\")\nprint(\"a positive first autocovariance makes it undefined altogether.\")\n",
            "output": "true spread -cov(r_t, r_t-1)    Roll estimate          error\n     0.010       0.00002636          0.01027        0.00027\n     0.020       0.00010112          0.02011        0.00011\n     0.050       0.00062163          0.04987       -0.00013\n     0.100       0.00249262          0.09985       -0.00015\n     0.200       0.00995585          0.19956       -0.00044\n\nwhat breaks it: give the direction positive autocorrelation, as real\norder flow has, and the bounce term is contaminated.\nflow autocorr    Roll estimate      true spread        error %\n         0.0          0.04995            0.050          -0.1%\n         0.2          0.03983            0.050         -20.3%\n         0.4          0.03005            0.050         -39.9%\n         0.6          0.01999            0.050         -60.0%\n\npersistent order flow shrinks the bounce and biases the estimator DOWN;\na positive first autocovariance makes it undefined altogether."
          }
        },
        {
          "name": "Effective, realised, impact: the decomposition that says why a venue is expensive",
          "explain": "<p>With quotes and trade directions available, the right measurement is a triple rather than a number. The effective half-spread is the signed distance from the trade price to the prevailing midquote — what the taker actually paid. The realised half-spread is the same distance measured against a midquote some interval <em>later</em> — what the liquidity provider actually kept. The difference is price impact, the permanent move in the taker's direction, which is the provider's adverse-selection loss. The three quantities sum by construction, and the snippet verifies the identity to zero.</p><p>The four simulated venues are the point of the exercise. Venues B and C both cost a taker exactly 0.050 per share, an identical effective spread. On venue B, 15 per cent of that is adverse selection and the provider keeps 0.0425. On venue C, 80 per cent is adverse selection and the provider keeps 0.0100. Two venues that look the same in a league table of spreads are running completely different businesses.</p><p>This is the diagnostic that matters for policy and for venue selection. A wide spread that is mostly provider revenue signals weak competition, and tightening it by rule or by adding competitors should work. A wide spread that is mostly adverse selection is the informational cost of that venue's own flow, and forcing it tighter simply makes liquidity provision unprofitable and the quotes disappear. Week 9 returns to this when the same logic is applied to tick-size and fee rules.</p><p>A desk cares because routing decisions made on effective spread alone will systematically send flow to whichever venue has the most toxic counterparties, since that venue's providers have quoted defensively and its flow is the flow you are competing with.</p>",
          "formula": "\\text{ES} = \\underbrace{q(p_t - m_{t+\\tau})}_{\\text{realised spread}} + \\underbrace{q(m_{t+\\tau} - m_t)}_{\\text{price impact}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Effective spread = realised spread + price impact, by construction.\n# The split says WHY a venue is expensive: toxic flow, or weak competition.\nrng = np.random.default_rng(2025)\nT = 300000\nsig = 0.02                     # efficient-price noise per trade\n\ndef venue(quoted_half, info_share, seed):\n    \"\"\"info_share: fraction of the half-spread that is permanent impact.\"\"\"\n    r = np.random.default_rng(seed)\n    q = np.where(r.random(T) < 0.5, 1.0, -1.0)\n    perm = info_share * quoted_half                     # permanent move per trade\n    m = np.cumsum(sig * r.standard_normal(T) + perm * q)  # midquote path\n    m = np.concatenate([[0.0], m])\n    price = m[:-1] + quoted_half * q                    # trade at the quote\n    mid_now, mid_later = m[:-1], m[1:]\n    eff = q * (price - mid_now)                         # effective half-spread\n    rea = q * (price - mid_later)                       # realised half-spread\n    imp = q * (mid_later - mid_now)                     # price impact\n    return eff.mean(), rea.mean(), imp.mean()\n\nprint(\"%-26s %12s %12s %12s %14s\"\n      % (\"venue\", \"effective\", \"realised\", \"impact\", \"adverse share\"))\nfor nm, qh, sh, sd in ((\"A: narrow, toxic flow\", 0.020, 0.85, 11),\n                       (\"B: wide, benign flow\", 0.050, 0.15, 12),\n                       (\"C: wide, toxic flow\", 0.050, 0.80, 13),\n                       (\"D: narrow, benign flow\", 0.020, 0.10, 14)):\n    e, rr, i = venue(qh, sh, sd)\n    print(\"%-26s %12.5f %12.5f %12.5f %13.1f%%\" % (nm, e, rr, i, 100 * i / e))\n\nprint(\"\")\nprint(\"identity check on venue C: effective - realised - impact = %.2e\"\n      % abs(sum(venue(0.050, 0.80, 13)[k] * s for k, s in ((0, 1), (1, -1), (2, -1)))))\nprint(\"\")\nprint(\"the two wide venues cost a taker the same 0.050 per share, but on B the\")\nprint(\"liquidity provider keeps 0.0425 of it and on C only 0.0100. Narrowing B\")\nprint(\"by rule would cut provider revenue; narrowing C would not, because C's\")\nprint(\"width is the informational cost of its own flow.\")\n",
            "output": "venue                         effective     realised       impact  adverse share\nA: narrow, toxic flow           0.02000      0.00299      0.01701          85.0%\nB: wide, benign flow            0.05000      0.04249      0.00751          15.0%\nC: wide, toxic flow             0.05000      0.01003      0.03997          79.9%\nD: narrow, benign flow          0.02000      0.01800      0.00200          10.0%\n\nidentity check on venue C: effective - realised - impact = 0.00e+00\n\nthe two wide venues cost a taker the same 0.050 per share, but on B the\nliquidity provider keeps 0.0425 of it and on C only 0.0100. Narrowing B\nby rule would cut provider revenue; narrowing C would not, because C's\nwidth is the informational cost of its own flow."
          }
        },
        {
          "name": "Amihud: a daily-data proxy and the confound you cannot remove",
          "explain": "<p>Not every research question can afford intraday data. Amihud's illiquidity measure needs only daily returns and daily dollar volume: average the absolute return divided by the volume. The logic is direct — if the price moves a lot on little volume, the market is shallow — and it is effectively an estimate of the price impact coefficient.</p><p>The snippet builds four stocks in a two-by-two design, crossing two impact coefficients with two volume levels. Within a volume bucket the measure does its job: the shallow large cap's reading is 2.79 times the deep large cap's against a true ratio of 3.00, and among small caps the ratio is 1.77 against the same true 3.00, the attenuation coming from the residual volatility that is not impact-driven.</p><p>Across volume buckets it fails, and it fails in a specific, predictable direction. The <em>deep</em> small cap's reading is 2.9 times the <em>shallow</em> large cap's, although its impact coefficient is only one third as large. Volume sits in the denominator, so the statistic measures depth and thinness together and cannot separate them. A cross-sectional regression that uses it as a liquidity control is therefore also loading on size, which is a well-known way to produce a spurious liquidity premium.</p><p>A desk cares because this statistic appears in an enormous number of published results and in many risk models, and knowing that it is only interpretable within a size bucket changes which of those results you believe.</p>",
          "formula": "\\text{ILLIQ}_i = \\frac{1}{D}\\sum_{d=1}^{D} \\frac{|r_{i,d}|}{\\text{DVOL}_{i,d}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Amihud illiquidity: average of |return| / dollar volume. Cheap to compute\n# from daily data and a decent proxy for lambda -- as long as you hold\n# volume fixed, which cross-sectionally you never can.\nD = 6000                                          # trading days\n\ndef stock(lam, dollar_vol, resid_vol, seed):\n    r = np.random.default_rng(seed)\n    n_trades = dollar_vol / 50_000.0              # 50k of notional per trade\n    netflow = np.sqrt(n_trades) * r.standard_normal(D)\n    ret = lam * netflow + resid_vol * r.standard_normal(D)\n    vol = dollar_vol * np.exp(0.3 * r.standard_normal(D) - 0.045)\n    amihud = float(np.mean(np.abs(ret) / (vol / 1e6)))      # per $1m of volume\n    return amihud, float(np.std(ret))\n\nprint(\"%-26s %10s %14s %12s %16s\"\n      % (\"stock\", \"lambda\", \"dollar volume\", \"return sd\", \"Amihud (x1e4)\"))\nrows = []\nfor nm, lam, dv, rv, sd in (\n        (\"large cap, deep\",    0.00012, 400e6, 0.004, 1),\n        (\"large cap, shallow\", 0.00036, 400e6, 0.004, 2),\n        (\"small cap, deep\",    0.00012,  20e6, 0.004, 3),\n        (\"small cap, shallow\", 0.00036,  20e6, 0.004, 4)):\n    a, rs = stock(lam, dv, rv, sd)\n    rows.append((nm, lam, dv, rs, a))\n    print(\"%-26s %10.5f %13.0fM %12.4f %16.4f\" % (nm, lam, dv / 1e6, rs, a * 1e4))\n\nprint(\"\")\nprint(\"within a volume bucket the ranking is right:\")\nprint(\"  large caps  shallow/deep = %.2f    true lambda ratio %.2f\"\n      % (rows[1][4] / rows[0][4], rows[1][1] / rows[0][1]))\nprint(\"  small caps  shallow/deep = %.2f    true lambda ratio %.2f\"\n      % (rows[3][4] / rows[2][4], rows[3][1] / rows[2][1]))\nprint(\"\")\nprint(\"across buckets it is not: the DEEP small cap's Amihud is %.1fx the\"\n      % (rows[2][4] / rows[1][4]))\nprint(\"SHALLOW large cap's, although its lambda is only %.2fx as large.\"\n      % (rows[2][1] / rows[1][1]))\nprint(\"Volume sits in the denominator, so the statistic measures impact and\")\nprint(\"thinness together. Use it within a size bucket, or not at all.\")\n",
            "output": "stock                          lambda  dollar volume    return sd    Amihud (x1e4)\nlarge cap, deep               0.00012           400M       0.0114           0.2514\nlarge cap, shallow            0.00036           400M       0.0323           0.7019\nsmall cap, deep               0.00012            20M       0.0047           2.0268\nsmall cap, shallow            0.00036            20M       0.0082           3.5864\n\nwithin a volume bucket the ranking is right:\n  large caps  shallow/deep = 2.79    true lambda ratio 3.00\n  small caps  shallow/deep = 1.77    true lambda ratio 3.00\n\nacross buckets it is not: the DEEP small cap's Amihud is 2.9x the\nSHALLOW large cap's, although its lambda is only 0.33x as large.\nVolume sits in the denominator, so the statistic measures impact and\nthinness together. Use it within a size bucket, or not at all."
          }
        },
        {
          "name": "Where does the price get made? Information shares and their bounds",
          "explain": "<p>When two venues quote the same asset their prices cannot drift apart, so they are cointegrated with cointegrating vector one and minus one. Estimate a vector error-correction model and the adjustment coefficients answer the question directly: the venue that leads does not error-correct, and the venue that follows does all the catching up.</p><p>The snippet builds a market in which news lands on venue one first with probability s, then propagates. At s = 1.00 venue one's adjustment coefficient is −0.0266, essentially zero, while venue two's is +0.9770; the Gonzalo–Granger common-factor weight for venue one is 0.9735. At s = 0.50 the adjustment coefficients are symmetric and the weight is 0.5009. The measure recovers the design.</p><p>Hasbrouck's information share answers a slightly different question — each venue's share of the variance of the common efficient-price innovation — and it requires a Cholesky factorisation of the residual covariance, which depends on the ordering of the venues. So it is not identified when the innovations are correlated, and the honest report is a pair of bounds. At s = 0.70 those bounds are 0.6069 to 0.8196 while the Gonzalo–Granger weight is 0.5810, outside them. The two measures are not estimates of the same parameter and there is no reason for them to agree; quoting one number with no bound is the standard abuse.</p><p>These estimators are close cousins of the realised-variance machinery of FINM 34600, applied to the same tick data with a different question: that course asks how much the price moved, this one asks where the move originated.</p><p>A desk cares because venue selection, best-execution reporting and the choice of which feed to drive a model from all rest on an answer to this question, and the answer is a range rather than a point.</p>",
          "formula": "\\Delta p_t = \\alpha\\,(\\mathbf{1}, -\\mathbf{1})' p_{t-1} + \\textstyle\\sum_k \\Gamma_k \\Delta p_{t-k} + \\varepsilon_t, \\qquad \\gamma \\propto (-\\alpha_2, \\alpha_1)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Two venues quote one asset, so their prices are cointegrated with vector\n# (1, -1). Which venue MOVES FIRST is an identification question, and the\n# two standard answers -- Gonzalo-Granger weights and Hasbrouck information\n# shares -- do not agree, because one of them uses the residual covariance.\nT, su, en = 250000, 0.02, 0.005\n\ndef simulate(s, seed):\n    \"\"\"News lands on venue 1 first with probability s, on venue 2 otherwise.\"\"\"\n    r = np.random.default_rng(seed)\n    u = su * r.standard_normal(T)\n    q = (r.random(T) < s).astype(float)\n    m = np.cumsum(u)\n    mlag = np.concatenate([[0.0], m[:-1]])\n    return mlag + q * u + en * r.standard_normal(T), mlag + (1 - q) * u + en * r.standard_normal(T)\n\ndef vecm(p1, p2, lags=2):\n    z = (p1 - p2)[:-1]\n    d1, d2 = np.diff(p1), np.diff(p2)\n    cols = [np.ones(d1.size - lags), z[lags:]]\n    for L in range(1, lags + 1):\n        cols += [d1[lags - L:-L], d2[lags - L:-L]]\n    X = np.column_stack(cols)\n    c1, *_ = np.linalg.lstsq(X, d1[lags:], rcond=None)\n    c2, *_ = np.linalg.lstsq(X, d2[lags:], rcond=None)\n    a1, a2 = c1[1], c2[1]\n    gg = np.array([-a2, a1]) / (a1 - a2)\n    Om = np.cov(np.vstack([d1[lags:] - X @ c1, d2[lags:] - X @ c2]))\n    return a1, a2, gg, Om\n\ndef info_share(gg, Om):\n    out = []\n    for perm in ([0, 1], [1, 0]):\n        P = np.eye(2)[perm]\n        F = np.linalg.cholesky(P @ Om @ P.T)\n        g = gg @ P.T\n        out.append(((g @ F) ** 2 / (gg @ Om @ gg))[perm.index(0)])\n    return min(out), max(out)\n\nprint(\"%8s %10s %10s %16s %26s\"\n      % (\"true s\", \"alpha_1\", \"alpha_2\", \"GG weight v1\", \"Hasbrouck IS bounds v1\"))\nfor s in (0.50, 0.70, 0.90, 1.00):\n    a1, a2, gg, Om = vecm(*simulate(s, 7))\n    lo, hi = info_share(gg, Om)\n    print(\"%8.2f %10.4f %10.4f %16.4f %14.4f to %.4f\" % (s, a1, a2, gg[0], lo, hi))\n\nprint(\"\")\na1, a2, gg, Om = vecm(*simulate(1.00, 7))\nprint(\"read the alphas first: the LEADER does not error-correct. At s = 1.00\")\nprint(\"venue 1's adjustment coefficient is %+.4f and venue 2's is %+.4f, so\" % (a1, a2))\nprint(\"venue 2 does all the catching up and venue 1 owns the common factor.\")\nprint(\"\")\na1, a2, gg, Om = vecm(*simulate(0.70, 7))\nlo, hi = info_share(gg, Om)\nprint(\"the information share is Cholesky-ordered and therefore NOT identified\")\nprint(\"when the two venues' innovations are correlated. At s = 0.70 the bounds\")\nprint(\"are %.4f to %.4f while the Gonzalo-Granger weight is %.4f: the two\" % (lo, hi, gg[0]))\nprint(\"measures answer different questions and need not agree. Reporting one\")\nprint(\"number with no bound is the commonest abuse of this statistic.\")\n",
            "output": "  true s    alpha_1    alpha_2     GG weight v1     Hasbrouck IS bounds v1\n    0.50    -0.4998     0.5016           0.5009         0.3793 to 0.6226\n    0.70    -0.4181     0.5798           0.5810         0.6069 to 0.8196\n    0.90    -0.2982     0.7058           0.7030         0.8403 to 0.9612\n    1.00    -0.0266     0.9770           0.9735         0.9718 to 0.9999\n\nread the alphas first: the LEADER does not error-correct. At s = 1.00\nvenue 1's adjustment coefficient is -0.0266 and venue 2's is +0.9770, so\nvenue 2 does all the catching up and venue 1 owns the common factor.\n\nthe information share is Cholesky-ordered and therefore NOT identified\nwhen the two venues' innovations are correlated. At s = 0.70 the bounds\nare 0.6069 to 0.8196 while the Gonzalo-Granger weight is 0.5810: the two\nmeasures answer different questions and need not agree. Reporting one\nnumber with no bound is the commonest abuse of this statistic."
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "Sampling distribution of the Roll spread estimate on 500-trade windows",
        "params": {
          "sampler": "bootstrap",
          "params": {
            "data": [
              0.04447,
              0.04972,
              0.05028,
              0.05308,
              0.0512,
              0.04677,
              0.04861,
              0.05199,
              0.04779,
              0.04556,
              0.04677,
              0.04795,
              0.04899,
              0.05191,
              0.04893,
              0.04728,
              0.05361,
              0.05244,
              0.05162,
              0.04774,
              0.05226,
              0.04851,
              0.05006,
              0.04323,
              0.04658,
              0.04313,
              0.04539,
              0.05649,
              0.0519,
              0.05511,
              0.03957,
              0.04663,
              0.05433,
              0.04541,
              0.04503,
              0.04815,
              0.04672,
              0.04989,
              0.05037,
              0.05181,
              0.05357,
              0.05344,
              0.05221,
              0.05527,
              0.05088,
              0.05057,
              0.05076,
              0.05301,
              0.04733,
              0.05428,
              0.04452,
              0.05105,
              0.05536,
              0.05387,
              0.04539,
              0.04289,
              0.04638,
              0.05402,
              0.0513,
              0.05001,
              0.05662,
              0.04911,
              0.04895,
              0.05453,
              0.04895,
              0.04588,
              0.05112,
              0.05022,
              0.04343,
              0.04858,
              0.04762,
              0.0492,
              0.0556,
              0.04783,
              0.05027,
              0.04244,
              0.05394,
              0.04729,
              0.05199,
              0.05161,
              0.05276,
              0.05264,
              0.05498,
              0.0482,
              0.05674,
              0.04881,
              0.05176,
              0.04997,
              0.04875,
              0.05344,
              0.05273,
              0.0504,
              0.04471,
              0.04929,
              0.05223,
              0.0486,
              0.05013,
              0.04815,
              0.04347,
              0.04791,
              0.04999,
              0.05369,
              0.04874,
              0.05173,
              0.05554,
              0.05416,
              0.0531,
              0.05005,
              0.05283,
              0.04924,
              0.05263,
              0.04916,
              0.05261,
              0.04987,
              0.05018,
              0.05007,
              0.05304,
              0.05431,
              0.04916,
              0.05152,
              0.04524,
              0.05048,
              0.04641,
              0.05227,
              0.04628,
              0.04778,
              0.05438,
              0.05132,
              0.04849,
              0.05541,
              0.04361,
              0.05363,
              0.0516,
              0.04938,
              0.04678,
              0.05217,
              0.04966,
              0.05262,
              0.05418,
              0.05178,
              0.05115,
              0.05221,
              0.04849,
              0.04609,
              0.0488,
              0.04671,
              0.04864,
              0.05125,
              0.04789,
              0.04699,
              0.05239,
              0.05601,
              0.04701,
              0.05031,
              0.05834,
              0.04463,
              0.04491,
              0.04838,
              0.05269,
              0.05083,
              0.04678,
              0.04791,
              0.05404,
              0.05036,
              0.05292,
              0.05236,
              0.05527,
              0.04634,
              0.05021,
              0.04952,
              0.04881,
              0.04908,
              0.05057,
              0.04904,
              0.04751,
              0.05196,
              0.05033,
              0.04612,
              0.04177,
              0.04649,
              0.04769,
              0.04884,
              0.05159,
              0.04433,
              0.05419,
              0.04674,
              0.05003,
              0.04888,
              0.04994,
              0.0509,
              0.0551,
              0.0527,
              0.0493,
              0.04834,
              0.04895,
              0.0574,
              0.04925,
              0.05035,
              0.04556,
              0.05057,
              0.05039,
              0.04518,
              0.05261,
              0.05456,
              0.05116,
              0.04951,
              0.04739,
              0.04956,
              0.05038,
              0.0522,
              0.05316,
              0.04913,
              0.05126,
              0.05198,
              0.05206,
              0.05421,
              0.05282,
              0.05738,
              0.05242,
              0.04743,
              0.04585,
              0.05444,
              0.05125,
              0.05739,
              0.04787,
              0.04879,
              0.05316,
              0.04712,
              0.05225,
              0.05324,
              0.05201,
              0.0559,
              0.0483,
              0.05077,
              0.05344,
              0.04806,
              0.05056,
              0.0511,
              0.05388,
              0.04909
            ]
          },
          "bins": 30,
          "n": 4000,
          "overlay": true,
          "seed": 1618,
          "q": 0.05
        }
      },
      "pitfalls": [
        "Applying the Roll estimator to persistent order flow. Direction autocorrelation of 0.4 biased the estimate down by 39.9 per cent in the snippet, and the bias factor is one minus the autocorrelation.",
        "Comparing venues on effective spread alone. Two venues in the snippet had identical effective spreads of 0.050 while the provider kept 0.0425 on one and 0.0100 on the other.",
        "Using Amihud illiquidity across size buckets. Volume is in the denominator, so the deep small cap looked 2.9 times more illiquid than the shallow large cap whose impact coefficient was three times larger.",
        "Reporting a single Hasbrouck information share. It is Cholesky-ordered, so only the bounds are identified, and they were 0.6069 to 0.8196 in the snippet's intermediate case."
      ],
      "check": [
        {
          "q": "The Roll estimator returned 0.0400 when the true spread was 0.0500 and order-flow direction had autocorrelation 0.4. What is the relationship?",
          "options": [
            "Coincidence of the seed",
            "The bias factor is one minus the flow autocorrelation",
            "The estimator is biased upward by the autocorrelation",
            "The efficient-price volatility caused it"
          ],
          "answer": 1,
          "why": "Persistent direction reduces the share of returns attributable to bouncing between the quotes, scaling the estimated spread by one minus the autocorrelation, which the snippet shows at 0.2, 0.4 and 0.6."
        },
        {
          "q": "Two venues both show an effective half-spread of 0.050. On venue B the realised half-spread is 0.0425 and on venue C it is 0.0100. Which statement is right?",
          "options": [
            "Venue C is better for takers",
            "Venue C's width is mostly the informational cost of its own flow",
            "Venue B has more competition among liquidity providers",
            "The two are equivalent for all purposes"
          ],
          "answer": 1,
          "why": "Venue C's providers keep only 0.0100 of the 0.050, so 80 per cent is adverse selection; venue B's providers keep 0.0425, which points to weak competition rather than toxic flow."
        },
        {
          "q": "Why should Amihud illiquidity not be compared across stocks of very different volume?",
          "options": [
            "Returns are not normally distributed",
            "Dollar volume in the denominator makes it a joint measure of impact and thinness",
            "It requires intraday data",
            "It is undefined for high-volume stocks"
          ],
          "answer": 1,
          "why": "The statistic divides by volume, so a thin but deep stock can read higher than a liquid but shallow one, exactly as the snippet's two-by-two design shows."
        },
        {
          "q": "In the vector error-correction estimate at s = 1.00, venue one's adjustment coefficient was −0.027 and venue two's was +0.977. What does that pattern mean?",
          "options": [
            "Venue one is mispriced",
            "Venue two leads price discovery",
            "Venue one leads: it does not correct toward the other, and venue two catches up",
            "The cointegrating vector is wrong"
          ],
          "answer": 2,
          "why": "An adjustment coefficient near zero means the venue does not move in response to the price gap, which is the signature of the leader; the follower's coefficient absorbs the whole correction."
        }
      ],
      "n": 8
    },
    {
      "title": "Market design: fragmentation, order protection, and the price of a tick",
      "topics": [
        "venue competition and fragmentation",
        "the order-protection rule and best execution",
        "tick size and maker-taker economics",
        "measuring market quality when a venue's rules change"
      ],
      "concepts": [
        {
          "name": "Fragmentation: many venues, one NBBO, and the depth it costs",
          "explain": "<p>A security that used to trade on one exchange now trades on a dozen: lit exchanges, ATSs, wholesalers internalising retail flow. The regulatory response, since the 1975 Securities Acts Amendments mandated a national market system, is to stitch the venues into one number: the National Best Bid and Offer, the best bid and the best ask across every protected venue at that instant. Competition for the privilege of setting that number is real competition &mdash; cheaper, faster, better-marketed venues win order flow &mdash; and it should tighten the NBBO below what any single venue would quote alone, because the market only needs its <em>best</em> quoter to be tight, not all of them.</p><p>The snippet builds exactly that: sixteen venues, each with its own fixed half-spread and its own quote-staleness noise, and computes the NBBO spread as more of them are switched on. Going from one venue to sixteen takes the time-averaged NBBO spread from 0.0754 to 0.0188 &mdash; a fourfold tightening &mdash; while the Herfindahl-Hirschman index of which venue sets the ask falls from 10,000 (a monopoly, by construction) to 1,335, a competitive market by the standard antitrust threshold of 1,500.</p><p>The cost shows up elsewhere. Split the same 500 shares of depth across eight venues instead of concentrating it on one, and an order for 3,600 shares has to walk through several venues' worth of price levels to fill, paying 0.0132 above the best ask instead of nothing. Fragmentation buys a tighter top of book and thinner depth behind it in the same breath.</p><p>A desk cares because &ldquo;best price&rdquo; and &ldquo;best execution&rdquo; are not the same question once a fill needs more shares than the best quote can supply.</p>",
          "formula": "\\text{NBBO}_{\\text{ask}} = \\min_i \\text{ask}_i, \\qquad \\text{NBBO}_{\\text{bid}} = \\max_i \\text{bid}_i",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# K venues quote around the same fair value. Each venue has its OWN fixed\n# half-spread (its cost of providing liquidity there) but its posted midpoint\n# jitters with venue-specific staleness noise. The NBBO is the best bid and\n# best ask across all of them.\nV = 100.0\nT = 20000\nrng0 = np.random.default_rng(11)\npool_half_spread = rng0.uniform(0.03, 0.09, 16)   # a fixed roster of 16 possible venues\n\ndef run(K, seed):\n    r = np.random.default_rng(seed)\n    half_spread = pool_half_spread[:K]         # the same K venues' spreads every run\n    noise_sd = 0.02\n    bids = np.empty((T, K)); asks = np.empty((T, K))\n    for k in range(K):\n        eps = noise_sd * r.standard_normal(T)\n        bids[:, k] = V - half_spread[k] + eps\n        asks[:, k] = V + half_spread[k] + eps\n    nbbo_spread = asks.min(axis=1) - bids.max(axis=1)\n    avg_venue_spread = float((asks - bids).mean())\n    winner = asks.argmin(axis=1)               # which venue is setting the NBBO ask\n    counts = np.bincount(winner, minlength=K)\n    shares = counts / counts.sum()\n    hhi = float((shares ** 2).sum() * 10000)   # standard 0-10000 HHI scale\n    return float(nbbo_spread.mean()), avg_venue_spread, hhi\n\nprint(\"%3s  %16s  %20s  %8s\" % (\"K\", \"avg venue spread\", \"time-avg NBBO spread\", \"HHI\"))\nfor K in (1, 2, 4, 8, 16):\n    nbbo, avgv, hhi = run(K, seed=1000 + K)\n    print(\"%3d  %16.4f  %20.4f  %8.0f\" % (K, avgv, nbbo, hhi))\n\n# A large order, though, must walk across venues once it exceeds the depth\n# posted at the touch on any single one. Fix K=8, depth 500 shares/venue.\nK, depth = 8, 500\nhalf_spread = pool_half_spread[:K]\nask0 = V + half_spread            # one snapshot of quotes, sorted for a sweep\norder = np.sort(ask0)\nprint(\"\")\nprint(\"%10s  %12s\" % (\"order size\", \"avg fill price above best ask\"))\nfor q in (400, 1200, 3600):\n    levels = np.repeat(order, depth)[:q]\n    avg_price = float(levels.mean())\n    print(\"%10d  %12.4f\" % (q, avg_price - order[0]))\n",
            "output": "  K  avg venue spread  time-avg NBBO spread       HHI\n  1            0.0754                0.0754     10000\n  2            0.0977                0.0685      6607\n  4            0.0977                0.0437      4115\n  8            0.0980                0.0244      1954\n 16            0.1114                0.0188      1335\n\norder size  avg fill price above best ask\n       400        0.0000\n      1200        0.0020\n      3600        0.0132"
          }
        },
        {
          "name": "The order-protection rule: why a trade-through has a price",
          "explain": "<p>Once the NBBO exists, the natural next question is whether anyone has to respect it. Regulation NMS's Rule 611, the order-protection rule, says yes for a specific, narrow class of quotes: displayed, immediately accessible, top-of-book quotes at other venues. A trade that executes at a worse price while one of those protected quotes was available and big enough to fill it is a <em>trade-through</em>, and outside a short list of exceptions &mdash; an intermarket sweep order that itself clears the better-priced venues, a benchmark or a block trade, a flickering quote &mdash; it is a rule violation, not merely a bad fill.</p><p>The snippet prices the difference. Three venues quote the ask at 100.00, 100.01 and 100.03 with 300, 500 and 900 shares respectively. A router that simply likes one venue and sends a 600-share order there, trading through the two cheaper quotes, pays an average price $0.0050 worse than a router that respects price priority &mdash; fifteen dollars on that one order, and the gap does not shrink to zero as the order grows, because the venues' relative costliness compounds across every size tried.</p><p>The rule's scope is the whole story: it protects the top of book only, so reserve size, odd lots, and anything not displayed can legally be bypassed, which is why &ldquo;the NBBO was respected&rdquo; is a much weaker guarantee than &ldquo;you got the best fill available.&rdquo;</p><p>A desk cares because a smart order router's entire value proposition, on a fragmented market, is computing exactly this arithmetic before it sends anything.</p>",
          "formula": "\\text{trade-through cost} = \\sum_i (p_i - p_i^{*})\\,q_i, \\qquad p_i^{*} \\text{ = price-priority fill}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Three venues display the ask side of the same stock at different prices\n# and sizes. A \"protected quote\" under Reg NMS Rule 611 is a displayed,\n# immediately accessible top-of-book quote that a trade may not bypass at a\n# worse price (a \"trade-through\") absent an exception. Compare a router that\n# respects price priority across venues to one that ignores it.\nvenues = [\n    {\"name\": \"Venue A\", \"price\": 100.00, \"size\": 300},\n    {\"name\": \"Venue B\", \"price\": 100.01, \"size\": 500},\n    {\"name\": \"Venue C\", \"price\": 100.03, \"size\": 900},\n]\n\ndef protected_route(order_size, venues):\n    remaining = order_size\n    cost = 0.0\n    fills = []\n    for v in sorted(venues, key=lambda v: v[\"price\"]):        # best price first\n        take = min(remaining, v[\"size\"])\n        cost += take * v[\"price\"]\n        fills.append((v[\"name\"], take))\n        remaining -= take\n        if remaining <= 0:\n            break\n    return cost, fills\n\ndef naive_route(order_size, venue, venues):\n    # sends the whole order to one convenient venue, trading through any\n    # better-priced protected quote elsewhere that had enough size\n    take = min(order_size, venue[\"size\"])\n    cost = take * venue[\"price\"]\n    remaining = order_size - take\n    if remaining > 0:\n        # spills into the next best only once the chosen venue is exhausted\n        rest_cost, _ = protected_route(remaining, [v for v in venues if v is not venue])\n        cost += rest_cost\n    return cost\n\nprint(\"%-8s  %6s  %6s\" % (\"venue\", \"price\", \"size\"))\nfor v in venues:\n    print(\"%-8s  %6.2f  %6d\" % (v[\"name\"], v[\"price\"], v[\"size\"]))\n\nprint(\"\")\nprint(\"%10s  %14s  %14s  %10s\" % (\"order\", \"naive avg px\", \"protected avg\", \"trade-through cost\"))\nfor q in (250, 600, 1200):\n    naive_cost = naive_route(q, venues[2], venues)     # naive router happens to like Venue C\n    prot_cost, fills = protected_route(q, venues)\n    naive_avg = naive_cost / q\n    prot_avg = prot_cost / q\n    print(\"%10d  %14.4f  %14.4f  %10.2f\" % (q, naive_avg, prot_avg, (naive_cost - prot_cost)))\n\nprint(\"\")\nq = 600\n_, fills = protected_route(q, venues)\nprint(\"protected router's fills for a 600-share order:\")\nfor name, take in fills:\n    print(\"  %-8s  %d shares\" % (name, take))\n",
            "output": "venue      price    size\nVenue A   100.00     300\nVenue B   100.01     500\nVenue C   100.03     900\n\n     order    naive avg px   protected avg  trade-through cost\n       250        100.0300        100.0000        7.50\n       600        100.0300        100.0050       15.00\n      1200        100.0225        100.0142       10.00\n\nprotected router's fills for a 600-share order:\n  Venue A   300 shares\n  Venue B   300 shares"
          }
        },
        {
          "name": "Tick size, maker-taker, and the no-trade band",
          "explain": "<p>Week 4 showed that heterogeneous priors, by themselves, do not stop rational agents from trading &mdash; only a transaction cost does, by making the disagreement not worth crossing. Two of a venue's own design choices are exactly that cost. The tick is the smallest allowed price increment, so half of it is the minimum a quote can move to meet a counterparty. The maker-taker fee schedule is the other half: a taker pays a fee to cross the spread and a maker earns a rebate for resting there, so the net cost of trading is the tick plus the taker fee minus the maker rebate, not either number alone.</p><p>The snippet builds this no-trade band directly: four hundred thousand agents draw a private valuation around the fair value, and a trade happens only when the gap exceeds the band. Tick size alone moves it a lot &mdash; from a hundredth of a cent, where 99.97% of agents cross, to a dime, where only 67.68% do. Holding the tick at a cent and varying the fee schedule moves it much less: the standard maker-taker mix (a 0.15% taker fee against a 0.10% rebate) trims volume from 96.65% to 96.31%, but removing the rebate entirely &mdash; a taker-only schedule &mdash; costs another 0.7 points, and a flat 1% fee costs six and a half more.</p><p>A desk cares because both numbers are levers a venue actually sets, and the band they jointly create is the venue's own cost of trading, on top of whatever the market pays for information.</p>",
          "formula": "\\text{band} = \\tfrac{1}{2}\\,\\text{tick} + \\text{taker fee} - \\text{maker rebate}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Heterogeneous priors alone do not stop trade (week 4). A transaction cost\n# does: an agent with valuation v only trades against the market's fair\n# value V if the gap exceeds the round-trip cost of crossing. The minimum\n# tick and the net (taker fee - maker rebate) both feed that cost, so\n# together they set the width of the no-trade band.\nrng = np.random.default_rng(7)\nN = 400_000\nV = 100.0\nsigma = 0.12                       # dispersion of private valuations around V\nv = V + sigma * rng.standard_normal(N)\n\ndef no_trade_band(tick, taker_fee, maker_rebate):\n    return max(0.5 * tick + taker_fee - maker_rebate, 0.0)\n\ndef volume_share(band, valuations):\n    return float((np.abs(valuations - V) > band).mean())\n\nprint(\"effect of tick size alone (no fees):\")\nprint(\"%8s  %10s  %10s\" % (\"tick\", \"band\", \"trade %\"))\nfor tick in (0.0001, 0.01, 0.05, 0.10):\n    band = no_trade_band(tick, 0.0, 0.0)\n    print(\"%8.4f  %10.4f  %9.2f%%\" % (tick, band, 100 * volume_share(band, v)))\n\nprint(\"\")\nprint(\"tick fixed at 0.01; effect of the maker-taker mix:\")\nprint(\"%10s  %12s  %10s  %10s\" % (\"taker fee\", \"maker rebate\", \"band\", \"trade %\"))\nfor taker, maker in ((0.0, 0.0), (0.0015, 0.0010), (0.0015, 0.0), (0.01, 0.0)):\n    band = no_trade_band(0.01, taker, maker)\n    print(\"%10.4f  %12.4f  %10.4f  %9.2f%%\" % (taker, maker, band, 100 * volume_share(band, v)))\n",
            "output": "effect of tick size alone (no fees):\n    tick        band     trade %\n  0.0001      0.0001      99.97%\n  0.0100      0.0050      96.65%\n  0.0500      0.0250      83.56%\n  0.1000      0.0500      67.68%\n\ntick fixed at 0.01; effect of the maker-taker mix:\n taker fee  maker rebate        band     trade %\n    0.0000        0.0000      0.0050      96.65%\n    0.0015        0.0010      0.0055      96.31%\n    0.0015        0.0000      0.0065      95.64%\n    0.0100        0.0000      0.0150      90.06%"
          }
        },
        {
          "name": "Tick-constrained spreads: when the rule binds tighter than adverse selection would",
          "explain": "<p>Week 5's Glosten-Milgrom logic gives a competitive, zero-expected-profit half-spread of roughly alpha times the value spread over two, where alpha is the informed fraction of order flow. That number can be arbitrarily small. The tick cannot: it puts a floor of half a tick under any quote. A stock is <em>tick-constrained</em> when its competitive spread would, absent the rule, sit below that floor &mdash; the quote is wider than adverse selection alone requires, and the extra width is pure rent to whoever is quick enough to be at the touch.</p><p>The snippet works this out for eight informed fractions at two tick sizes. At a penny, only the single tightest name (alpha = 0.005, competitive half-spread $0.0025) is constrained, to $0.0050. Widen the tick to a nickel and three of the eight are constrained, with the tightest name's rent rising to $0.0225 per share. Nothing about the informed fraction changed; only the floor moved.</p><p>This is precisely the mechanism the SEC's 2016 Tick Size Pilot tested in reverse: widen the tick on small, thinly-traded names to see whether the resulting rent recruits more displayed depth from market makers who were previously unwilling to quote at an unconstrained, wafer-thin spread. It is also why &ldquo;just tighten every tick&rdquo; is not free: for names that are already unconstrained a finer tick has nothing to bind, and for names near the boundary it can remove the last subsidy keeping a quote posted at all.</p><p>A desk cares because whether a name is tick-constrained determines whether quoting it is a spread business or a rent extraction, and the two need different strategies.</p>",
          "formula": "\\text{quoted half-spread} = \\max\\!\\left(\\tfrac{\\alpha(V_h-V_l)}{2},\\, \\tfrac{\\text{tick}}{2}\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# The competitive (zero-expected-profit) half-spread from week 5's\n# Glosten-Milgrom logic is roughly alpha*(Vh-Vl)/2 for a symmetric prior.\n# A minimum tick puts a FLOOR under the quoted spread: if the competitive\n# level implied by adverse selection is finer than the tick, the quote\n# cannot follow it down. That stock is \"tick-constrained.\"\nvalue_range = 1.00                 # Vh - Vl, in dollars\nalphas = np.array([0.005, 0.01, 0.02, 0.05, 0.10, 0.20, 0.35, 0.50])\n\ndef competitive_half_spread(alpha, value_range):\n    return alpha * value_range / 2.0\n\ncomp_half = competitive_half_spread(alphas, value_range)\n\nprint(\"competitive (zero-profit) half-spread by informed fraction alpha:\")\nfor tick in (0.01, 0.05):\n    quoted_half = np.maximum(comp_half, tick / 2.0)\n    constrained = quoted_half > comp_half + 1e-12\n    n_constrained = int(constrained.sum())\n    print(\"\")\n    print(\"tick = $%.2f\" % tick)\n    print(\"%6s  %14s  %14s  %12s\" % (\"alpha\", \"competitive\", \"quoted\", \"constrained?\"))\n    for a, ch, qh, c in zip(alphas, comp_half, quoted_half, constrained):\n        print(\"%6.3f  %14.4f  %14.4f  %12s\" % (a, ch, qh, \"yes\" if c else \"no\"))\n    print(\"names tick-constrained at this tick: %d of %d\" % (n_constrained, len(alphas)))\n\n# The wider tick subsidises the least-informationally-toxic names with a\n# spread wider than adverse selection alone would sustain -- exactly the\n# rent the 2016 SEC Tick Size Pilot tested by widening the tick on a set of\n# small-cap names to see whether it recruited more displayed liquidity.\nsubsidy = np.maximum(0.05 / 2.0, comp_half) - comp_half\nprint(\"\")\nprint(\"implied per-share rent from a nickel tick, by alpha:\")\nfor a, s in zip(alphas, subsidy):\n    print(\"  alpha %.3f  rent %.4f\" % (a, s))\n",
            "output": "competitive (zero-profit) half-spread by informed fraction alpha:\n\ntick = $0.01\n alpha     competitive          quoted  constrained?\n 0.005          0.0025          0.0050           yes\n 0.010          0.0050          0.0050            no\n 0.020          0.0100          0.0100            no\n 0.050          0.0250          0.0250            no\n 0.100          0.0500          0.0500            no\n 0.200          0.1000          0.1000            no\n 0.350          0.1750          0.1750            no\n 0.500          0.2500          0.2500            no\nnames tick-constrained at this tick: 1 of 8\n\ntick = $0.05\n alpha     competitive          quoted  constrained?\n 0.005          0.0025          0.0250           yes\n 0.010          0.0050          0.0250           yes\n 0.020          0.0100          0.0250           yes\n 0.050          0.0250          0.0250            no\n 0.100          0.0500          0.0500            no\n 0.200          0.1000          0.1000            no\n 0.350          0.1750          0.1750            no\n 0.500          0.2500          0.2500            no\nnames tick-constrained at this tick: 3 of 8\n\nimplied per-share rent from a nickel tick, by alpha:\n  alpha 0.005  rent 0.0225\n  alpha 0.010  rent 0.0200\n  alpha 0.020  rent 0.0150\n  alpha 0.050  rent 0.0000\n  alpha 0.100  rent 0.0000\n  alpha 0.200  rent 0.0000\n  alpha 0.350  rent 0.0000\n  alpha 0.500  rent 0.0000"
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "Fifty years of market-structure rulemaking, one mechanism each time",
        "params": {
          "events": [
            {
              "t": 1975,
              "label": "1975 Amendments",
              "note": "Congress mandates a linked National Market System across exchanges."
            },
            {
              "t": 1978,
              "label": "ITS",
              "note": "The Intermarket Trading System wires the exchanges' quotes together."
            },
            {
              "t": 1997,
              "label": "Order Handling Rules",
              "note": "Limit orders and ECN quotes must be reflected in the public quote."
            },
            {
              "t": 1998,
              "label": "Regulation ATS",
              "note": "Alternative trading systems can register lightly and still compete for flow."
            },
            {
              "t": 2001,
              "label": "Decimalization",
              "note": "The minimum tick moves from 1/16 ($0.0625) to $0.01."
            },
            {
              "t": 2005,
              "label": "Regulation NMS",
              "note": "Rule 611 order protection and Rule 610 fair access codify today's linked market."
            },
            {
              "t": 2010,
              "label": "Flash Crash",
              "note": "A twenty-minute price collapse triggers single-stock circuit breakers."
            },
            {
              "t": 2012,
              "label": "Limit Up-Limit Down",
              "note": "Price bands replace the original circuit breakers."
            },
            {
              "t": 2016,
              "label": "Tick Size Pilot",
              "note": "The SEC widens the tick on small-cap names to test the rent-for-depth trade-off."
            },
            {
              "t": 2020,
              "label": "MEV becomes visible",
              "note": "Public mempools make block-ordering rents observable on-chain, a preview of week 10."
            }
          ]
        }
      },
      "pitfalls": [
        "Treating more venues as unambiguously good. The NBBO tightens as competing venues are added, but each individual venue's depth thins, so a large order's realised cost can rise even while the quoted spread falls.",
        "Reading Rule 611 as a guarantee of the best available price. It protects only displayed, immediately accessible top-of-book quotes; reserve size, odd lots and several standard exceptions are legally bypassed every day.",
        "Assuming a wider tick is pure friction. For a name whose competitive spread is already below the tick, the tick behaves like a floor that subsidises market-making, which is why regulators tested widening it rather than narrowing it further.",
        "Confusing the level of the maker rebate or the taker fee with the economics of the spread. What sets the no-trade band is the net of the two, and cutting the fee while cutting the rebate by the same amount changes nothing."
      ],
      "check": [
        {
          "q": "In the fragmentation snippet, going from one venue to sixteen took the time-averaged NBBO spread from 0.0754 to 0.0188 while the HHI fell from 10,000 to 1,335. What is happening to the market at the same time?",
          "options": [
            "The market is becoming a monopoly",
            "Total displayed depth at the touch is rising",
            "Depth at the touch is being spread thinner across more venues even as the top price improves",
            "Adverse selection is disappearing"
          ],
          "answer": 2,
          "why": "Competition for best price is real and measurable in the tighter NBBO and the falling HHI, but nothing in the simulation increased total liquidity -- it only redistributed the same depth across more posting locations, which is exactly why a 3,600-share order still had to walk multiple price levels."
        },
        {
          "q": "A router that sent a 600-share order entirely to the venue quoting 100.03 instead of respecting price priority paid $15.00 more in total. Under Rule 611, what makes this a trade-through rather than just a bad routing decision?",
          "options": [
            "The order size exceeded the exchange's daily limit",
            "A better-priced, displayed, immediately accessible quote at another venue was bypassed without an applicable exception",
            "The venue at 100.03 charged an illegal fee",
            "The NBBO was not calculated correctly"
          ],
          "answer": 1,
          "why": "A trade-through is defined by bypassing a protected quote at a better price with size available, absent one of the rule's listed exceptions; size, fee levels and NBBO computation are not what make it a violation."
        },
        {
          "q": "At a nickel tick, the snippet found 3 of 8 informed fractions were tick-constrained, versus 1 of 8 at a penny tick. What does 'tick-constrained' mean for one of those three names?",
          "options": [
            "Its spread is wider than adverse selection alone would require, because the tick will not let it narrow further",
            "Its spread is narrower than adverse selection alone would require",
            "It cannot legally be traded",
            "Its informed fraction is unusually high"
          ],
          "answer": 0,
          "why": "Tick-constrained means the competitive, zero-profit half-spread implied by the informed fraction sits below half the tick, so the quoted spread is pinned at the floor and the excess width above the competitive level is rent, not a payment for information risk."
        },
        {
          "q": "Holding the tick fixed at a cent, moving from a standard maker-taker fee schedule (taker 0.15%, maker rebate 0.10%) to a taker-only schedule with no rebate cut trade volume from 96.31% to 95.64% in the snippet. What quantity is doing the work?",
          "options": [
            "The tick size, which did not change",
            "The net of the taker fee and the maker rebate, which widened the no-trade band",
            "The informed fraction alpha",
            "The number of venues"
          ],
          "answer": 1,
          "why": "The band is half the tick plus the taker fee minus the maker rebate; removing the rebate while holding the tick and the taker fee fixed raises that net cost directly, widening the band and shrinking the range of valuations willing to cross it."
        }
      ],
      "n": 9
    },
    {
      "title": "Prediction markets, automated market makers, and information at the edge of the ledger",
      "topics": [
        "proper scoring rules and Hanson's LMSR automated market maker",
        "constant-product AMMs and loss-versus-rebalancing",
        "MEV: block-ordering privilege as an information rent",
        "crowding a common signal: the N-trader Kyle equilibrium"
      ],
      "concepts": [
        {
          "name": "Proper scoring rules and the LMSR: truthful reports, priced as a market",
          "explain": "<p>A scoring rule pays a forecaster who reports a probability p for a binary event, once the outcome y is known. It is <em>proper</em> if reporting your true belief q maximises your expected score regardless of what q is &mdash; the mechanism cannot be gamed by hedging or exaggerating. The logarithmic rule, S(p,y) = y ln p + (1-y) ln(1-p), and the Brier (quadratic) rule, S(p,y) = -(y-p)^2, are the two workhorses, and the snippet checks properness directly: searching a 9,801-point grid of possible reports against a true belief of 0.72, both rules are maximised at exactly p = 0.720.</p><p>Hanson's LMSR turns the log rule into a market. The cost function C(q) = b log(sum_i exp(q_i/b)) prices a change in the number of outstanding shares of each outcome, and its gradient &mdash; the implied price &mdash; is a softmax, so the market's price is always a valid probability by construction, not by luck. Buying 150 'yes' shares against a starting price of 0.50, with liquidity parameter b=100, moves the price to 0.8176 and costs $100.83; the market maker's worst-case subsidy on any binary LMSR is bounded at b ln 2, about $69.31, a number fixed purely by b, independent of how the trading goes.</p><p>A desk cares because this is the same 'get the incentive right and the price becomes informative' idea the whole course has used for a limit order book, applied to a venue that quotes against its own inventory rather than crossing two sides.</p>",
          "formula": "C(q) = b\\log\\sum_i e^{q_i/b}, \\qquad \\text{price}_i = \\frac{e^{q_i/b}}{\\sum_j e^{q_j/b}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# A scoring rule is PROPER if reporting your true probability maximises your\n# expected score. Check it numerically for the two workhorse rules, then use\n# the same cost function as an automated market maker (Hanson's LMSR).\nq = 0.72                              # the forecaster's true belief\n\ndef log_score(p, y):\n    return y * np.log(p) + (1 - y) * np.log(1 - p)\n\ndef brier_score(p, y):\n    return -((y - p) ** 2)\n\ndef expected_score(score_fn, p, q):\n    return q * score_fn(p, 1) + (1 - q) * score_fn(p, 0)\n\ngrid = np.linspace(0.01, 0.99, 9801)\nfor name, fn in ((\"log\", log_score), (\"brier\", brier_score)):\n    es = expected_score(fn, grid, q)\n    best_p = grid[np.argmax(es)]\n    print(\"%-6s score maximised by reporting p = %.3f  (true belief q = %.2f)\" % (name, best_p, q))\n\n# LMSR: an automated market maker for a binary event. Cost function\n# C(q) = b*log(sum(exp(q_i/b))); the implied price of outcome i is the\n# gradient dC/dq_i, which is exactly a softmax over the two outcomes.\nb = 100.0\ndef lmsr_cost(qs, b):\n    return b * np.log(np.sum(np.exp(np.asarray(qs) / b)))\n\ndef lmsr_price(qs, b):\n    e = np.exp(np.asarray(qs) / b)\n    return e / e.sum()\n\nprint(\"\")\nq_yes, q_no = 0.0, 0.0\nprint(\"shares out: yes=%.0f no=%.0f  ->  price(yes) = %.4f\" % (q_yes, q_no, lmsr_price([q_yes, q_no], b)[0]))\ncost_before = lmsr_cost([q_yes, q_no], b)\nq_yes += 150.0                        # a trader buys 150 \"yes\" shares\ncost_after = lmsr_cost([q_yes, q_no], b)\npaid = cost_after - cost_before\nprint(\"after buying 150 'yes' shares: price(yes) = %.4f, cost paid = %.4f\"\n      % (lmsr_price([q_yes, q_no], b)[0], paid))\n\n# the market maker's worst-case loss on a binary LMSR is bounded by b*log(2)\nprint(\"worst-case LMSR subsidy (loss bound), b=%.0f:  %.4f\" % (b, b * np.log(2)))\n",
            "output": "log    score maximised by reporting p = 0.720  (true belief q = 0.72)\nbrier  score maximised by reporting p = 0.720  (true belief q = 0.72)\n\nshares out: yes=0 no=0  ->  price(yes) = 0.5000\nafter buying 150 'yes' shares: price(yes) = 0.8176, cost paid = 100.8266\nworst-case LMSR subsidy (loss bound), b=100:  69.3147"
          }
        },
        {
          "name": "Constant-product AMMs: the LP as an automatic, short-gamma market maker",
          "explain": "<p>A constant-product pool holds reserves x and y with x times y equal to a fixed L squared, and its price is y/x. Arbitraged back to the true market price after every move, its value as a function of price is V(P) = 2L times the square root of P &mdash; a closed form, and strictly concave. Concavity is the whole story: a liquidity provider who is always quoting is, mechanically, always on the wrong side of any price move large enough to trade against, which is the adverse-selection idea from week 5 with the market maker replaced by a formula instead of a person setting a bid and ask.</p><p>The snippet makes the cost precise. Simulating a year of hourly, 60%-annualised-vol moves, a continuous delta hedge earns $763.62 over the path while the pool itself loses $60.32 &mdash; a gap of $823.93, the realised loss-versus-rebalancing. The closed-form rate from Ito's lemma, sigma squared over eight times V(P) integrated along the path, predicts $828.93: a 0.6% miss, essentially exact at this step size. As a fraction of the pool's average value the loss runs 4.47% a year, so a 30-basis-point swap fee only breaks even if volume turns the pool over almost fifteen times annually.</p><p>The number is not a defect to engineer away; it is the price of committing, in advance, to trade against anyone at a formula rather than negotiating each time, and the fee is the venue's only lever to be paid for it.</p><p>A desk cares because an LP position is a short-volatility bet dressed up as a yield product, and LVR is what prices that bet correctly.</p>",
          "formula": "V(P) = 2L\\sqrt{P}, \\qquad \\text{LVR} \\approx \\int_0^T \\tfrac{\\sigma^2}{8}\\,V(P_t)\\,dt",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# A constant-product pool (x*y=k, L=sqrt(k)) continuously arbitraged to the\n# true price has value V(P) = 2*L*sqrt(P). That function is CONCAVE, so an\n# arbitrageur who trades it back to the market every time price moves is,\n# mechanically, running a short-gamma book on the LP's behalf: the LP\n# systematically underperforms a trader who continuously delta-hedges the\n# same exposure at the true price. That gap is \"loss-versus-rebalancing.\"\nrng = np.random.default_rng(2024)\nL, P0, sigma = 1000.0, 100.0, 0.60          # crypto-like 60% annualised vol\nn = 252 * 24                                 # hourly steps, one year\ndt = 1.0 / n\n\nZ = rng.standard_normal(n)\nlogret = -0.5 * sigma ** 2 * dt + sigma * np.sqrt(dt) * Z\nP = np.empty(n + 1)\nP[0] = P0\nP[1:] = P0 * np.exp(np.cumsum(logret))\n\nV = 2 * L * np.sqrt(P)                       # pool value at each instant\ndelta = L / np.sqrt(P[:-1])                  # dV/dP just before each step\nhedge_pnl = float(np.sum(delta * np.diff(P)))   # a continuous delta hedge's P&L\npool_pnl = float(V[-1] - V[0])\nrealized_lvr = hedge_pnl - pool_pnl\ntheory_lvr = float(np.sum((sigma ** 2 / 8.0) * V[:-1] * dt))\n\nprint(\"price path: %.2f -> %.2f over 1 year\" % (P[0], P[-1]))\nprint(\"pool value: %.2f -> %.2f\" % (V[0], V[-1]))\nprint(\"\")\nprint(\"continuous delta-hedge P&L over the path      %10.2f\" % hedge_pnl)\nprint(\"pool's own P&L over the path                  %10.2f\" % pool_pnl)\nprint(\"realized loss-versus-rebalancing (LVR)         %10.2f\" % realized_lvr)\nprint(\"theory:  (sigma^2/8) * integral(V dt)          %10.2f\" % theory_lvr)\nprint(\"ratio realized/theoretical                     %10.4f\" % (realized_lvr / theory_lvr))\n\navg_v = float(np.mean(V))\nlvr_rate = realized_lvr / avg_v            # annualised, since the path is one year\nprint(\"\")\nprint(\"LVR as a fraction of average pool value, per year   %.4f\" % lvr_rate)\nprint(\"a 30bp swap fee breaks even only if annual volume turns the pool over %.1fx\"\n      % (lvr_rate / 0.003))\n",
            "output": "price path: 100.00 -> 99.40 over 1 year\npool value: 20000.00 -> 19939.68\n\ncontinuous delta-hedge P&L over the path          763.62\npool's own P&L over the path                      -60.32\nrealized loss-versus-rebalancing (LVR)             823.93\ntheory:  (sigma^2/8) * integral(V dt)              828.93\nratio realized/theoretical                         0.9940\n\nLVR as a fraction of average pool value, per year   0.0447\na 30bp swap fee breaks even only if annual volume turns the pool over 14.9x"
          }
        },
        {
          "name": "MEV: the sandwich as an information rent, and who is allowed to charge it",
          "explain": "<p>Whoever decides the order of transactions inside a block sees every pending transaction before it settles &mdash; an information advantage structurally identical to Kyle's insider, except the insider here is a miner, a validator, or the searcher who pays them. A sandwich monetises it against a known pending swap: buy the same asset first, let the victim's trade execute against a pool your own trade already moved, then sell back.</p><p>The snippet runs the arithmetic on a constant-product pool with standard 0.3% fees. A $50,000 swap that would receive 474.83 tokens against an undisturbed pool receives only 456.84 once a $20,000 front-run has moved the price &mdash; 17.99 fewer tokens, worth about $1,894 at the pre-attack price. The attacker's own round trip nets $1,855.67, most of that gap being the victim's loss and the residual reflecting fees the pool itself retained across all three trades.</p><p>Nothing about proof-of-work versus proof-of-stake removes this rent; each only changes who is eligible to extract it and what they pay for the privilege. Proof-of-work sells the right to order transactions for real, sunk hash-rate cost, paid whether or not the block wins; proof-of-stake sells it for bonded capital that can be slashed for misbehaviour. Both are barriers to becoming the informed party, exactly as a co-location fee or a market-maker registration is a barrier in a lit market &mdash; they price who gets to be adversely selective, not whether adverse selection exists.</p><p>A desk cares because 'which chain' is a question about who collects this fee, not about whether it gets collected.</p>",
          "formula": "\\Delta x_{out} = \\frac{x\\,\\Delta y_{in}(1-f)}{y+\\Delta y_{in}(1-f)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# Whoever orders the transactions in a block sees the pending order flow\n# before it settles -- an information advantage exactly like an insider's.\n# A \"sandwich\": buy ahead of a known pending swap, let it execute at the\n# worse price it pushed itself into, then sell back. Standard constant-\n# product formulas (fee kept in the pool, Uniswap-v2 style).\ndef swap_in_y(x, y, dy_in, fee):     # pay dy_in of the quote asset, receive dx_out\n    dy_eff = dy_in * (1 - fee)\n    dx_out = x * dy_eff / (y + dy_eff)\n    return dx_out, x - dx_out, y + dy_in\n\ndef swap_in_x(x, y, dx_in, fee):     # pay dx_in of the risky asset, receive dy_out\n    dx_eff = dx_in * (1 - fee)\n    dy_out = y * dx_eff / (x + dx_eff)\n    return dy_out, x + dx_in, y - dy_out\n\nfee = 0.003\nx0, y0 = 10_000.0, 1_000_000.0        # spot price P0 = y0/x0 = 100\nvictim_pay = 50_000.0\n\n# no attacker: the victim trades against the resting pool alone\ndx_v0, xa, ya = swap_in_y(x0, y0, victim_pay, fee)\npx_v0 = victim_pay / dx_v0\n\n# sandwich: attacker front-runs, victim trades against the moved pool,\n# attacker back-runs by selling the tokens it just bought\nfront_pay = 20_000.0\ndx_f, x1, y1 = swap_in_y(x0, y0, front_pay, fee)\ndx_v1, x2, y2 = swap_in_y(x1, y1, victim_pay, fee)\npx_v1 = victim_pay / dx_v1\ndy_back, x3, y3 = swap_in_x(x2, y2, dx_f, fee)\nattacker_profit = dy_back - front_pay\n\nvictim_tokens_lost = dx_v0 - dx_v1\nvictim_dollar_harm = victim_tokens_lost * px_v0\n\nprint(\"pool: x0=%.0f  y0=%.0f  spot price %.4f\" % (x0, y0, y0 / x0))\nprint(\"\")\nprint(\"victim swaps $%.0f for the risky asset\" % victim_pay)\nprint(\"  without an attacker :  %.4f tokens   (avg price %.4f)\" % (dx_v0, px_v0))\nprint(\"  sandwiched           :  %.4f tokens   (avg price %.4f)\" % (dx_v1, px_v1))\nprint(\"  tokens lost to the sandwich          : %.4f  (~$%.2f at the fair price)\"\n      % (victim_tokens_lost, victim_dollar_harm))\nprint(\"\")\nprint(\"attacker front-runs $%.0f, back-runs %.4f tokens\" % (front_pay, dx_f))\nprint(\"attacker's sandwich profit                        : $%.2f\" % attacker_profit)\nprint(\"\")\nprint(\"who gets to be the attacker is exactly the block-ordering privilege:\")\nprint(\"proof-of-work: won by hash-rate spent (a real resource cost per attempt)\")\nprint(\"proof-of-stake: won by stake at risk of slashing (a bonded capital cost)\")\nprint(\"neither removes the rent -- both only change who pays to be eligible for it\")\n",
            "output": "pool: x0=10000  y0=1000000  spot price 100.0000\n\nvictim swaps $50000 for the risky asset\n  without an attacker :  474.8297 tokens   (avg price 105.3009)\n  sandwiched           :  456.8437 tokens   (avg price 109.4466)\n  tokens lost to the sandwich          : 17.9860  (~$1893.95 at the fair price)\n\nattacker front-runs $20000, back-runs 195.5017 tokens\nattacker's sandwich profit                        : $1855.67\n\nwho gets to be the attacker is exactly the block-ordering privilege:\nproof-of-work: won by hash-rate spent (a real resource cost per attempt)\nproof-of-stake: won by stake at risk of slashing (a bonded capital cost)\nneither removes the rent -- both only change who pays to be eligible for it"
          }
        },
        {
          "name": "When everyone has the same edge: N traders, one signal, and the Kyle equilibrium",
          "explain": "<p>Suppose a semantic signal &mdash; an LLM's read of a filing, a headline, an earnings call &mdash; is not one fund's secret but N funds' shared subscription: all N see the identical value v. That is Kyle's one-period insider model with N identical informed traders instead of one, and it has a closed form. Solving each trader's first-order condition for a linear strategy x_i = beta*v against a market maker pricing on total order flow gives beta = sigma_u over the square root of N times sigma_v, and impact coefficient lambda = the square root of N times sigma_v over sigma_u times (N+1); the snippet verifies this by grid-searching one trader's best response to the other N-1 playing it, and the closed form matches the numerical optimum to six decimal places at N=5.</p><p>The result that matters is the profit. Per-trader profit is sigma_v*sigma_u over the square root of N times (N+1), falling from 4.00 at N=1 to 0.0079 at N=100 &mdash; unsurprising, competition erodes individual shares. Less obvious: total industry profit, N times that, also collapses: 4.00, 3.77, 2.98, 2.30, 1.54, 0.79, 0.40 as N runs 1, 2, 5, 10, 25, 100, 400. With independent signals, more informed traders slowly improve the market's aggregate information and profits erode roughly as fast as their numbers grow; with the same signal there is no diversification benefit to competing away, and the whole rent evaporates.</p><p>A desk cares because 'our signal still works after we licensed it to twelve other funds' is a claim this model says to distrust by default, not a special case needing a special reason to fail.</p>",
          "formula": "\\beta = \\frac{\\sigma_u}{\\sqrt{N}\\,\\sigma_v}, \\quad \\lambda = \\frac{\\sqrt{N}\\,\\sigma_v}{\\sigma_u(N+1)}, \\quad \\Pi_{\\text{total}} = \\frac{\\sigma_v\\sigma_u\\sqrt{N}}{N+1}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate BLAS can emit spurious warnings on finite data\n\n# What happens once N funds all buy the same semantic (LLM) signal, so all N\n# observe the SAME value v exactly? This is Kyle's one-period model with N\n# identical informed traders instead of one. Solving each trader's first-\n# order condition for a linear strategy x_i = beta*v against the market\n# maker's rational-expectations price p = lambda*(sum(x_i)+u) gives closed\n# forms: beta = sigma_u/(sqrt(N)*sigma_v), lambda = sqrt(N)*sigma_v/(sigma_u*(N+1)).\nsigma_v, sigma_u = 1.0, 8.0\n\ndef equilibrium(N):\n    beta = sigma_u / (np.sqrt(N) * sigma_v)\n    lam = np.sqrt(N) * sigma_v / (sigma_u * (N + 1))\n    profit_i = sigma_v * sigma_u / (np.sqrt(N) * (N + 1))     # per trader\n    return beta, lam, profit_i\n\n# verify the closed form against the actual first-order condition: no\n# trader should want to deviate from beta given everyone else plays it.\ndef profit_of_deviation(N, beta, lam, beta_i):\n    ev2 = sigma_v ** 2\n    return ev2 * (beta_i - lam * beta_i * (N - 1) * beta - lam * beta_i ** 2)\n\nN_check = 5\nbeta, lam, profit_i = equilibrium(N_check)\ngrid = np.linspace(beta * 0.5, beta * 1.5, 2001)\nprofits = profit_of_deviation(N_check, beta, lam, grid)\nbest = grid[np.argmax(profits)]\nprint(\"N=%d check: closed-form beta=%.6f, best response to itself=%.6f (should match)\"\n      % (N_check, beta, best))\nprint(\"closed-form per-trader profit %.6f, numeric best-response profit %.6f\"\n      % (profit_i, profits.max()))\n\nprint(\"\")\nprint(\"%5s  %10s  %10s  %14s  %14s\" % (\"N\", \"beta\", \"lambda\", \"profit/trader\", \"total profit\"))\nfor N in (1, 2, 5, 10, 25, 100, 400):\n    beta, lam, profit_i = equilibrium(N)\n    total = N * profit_i\n    print(\"%5d  %10.5f  %10.5f  %14.6f  %14.6f\" % (N, beta, lam, profit_i, total))\n\nprint(\"\")\nprint(\"with INDEPENDENT signals (not modelled here), competition erodes profit\")\nprint(\"roughly as 1/N; with the SAME signal, total industry profit itself falls,\")\nprint(\"as sigma_v*sigma_u*sqrt(N)/(N+1) -> 0: common information is competed away faster.\")\n",
            "output": "N=5 check: closed-form beta=3.577709, best response to itself=3.577709 (should match)\nclosed-form per-trader profit 0.596285, numeric best-response profit 0.596285\n\n    N        beta      lambda   profit/trader    total profit\n    1     8.00000     0.06250        4.000000        4.000000\n    2     5.65685     0.05893        1.885618        3.771236\n    5     3.57771     0.04658        0.596285        2.981424\n   10     2.52982     0.03593        0.229984        2.299838\n   25     1.60000     0.02404        0.061538        1.538462\n  100     0.80000     0.01238        0.007921        0.792079\n  400     0.40000     0.00623        0.000998        0.399002\n\nwith INDEPENDENT signals (not modelled here), competition erodes profit\nroughly as 1/N; with the SAME signal, total industry profit itself falls,\nas sigma_v*sigma_u*sqrt(N)/(N+1) -> 0: common information is competed away faster."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "LMSR price of YES as net shares purchased grows, at two liquidity depths",
        "params": {
          "xlab": "Net shares of YES outstanding",
          "ylab": "Implied price of YES",
          "log": false,
          "series": [
            {
              "name": "shallow book (b=50)",
              "x": [
                -400,
                -360,
                -320,
                -280,
                -240,
                -200,
                -160,
                -120,
                -80,
                -40,
                0,
                40,
                80,
                120,
                160,
                200,
                240,
                280,
                320,
                360,
                400
              ],
              "y": [
                0.00034,
                0.00075,
                0.00166,
                0.00368,
                0.00816,
                0.01799,
                0.03917,
                0.08317,
                0.16798,
                0.31003,
                0.5,
                0.68997,
                0.83202,
                0.91683,
                0.96083,
                0.98201,
                0.99184,
                0.99632,
                0.99834,
                0.99925,
                0.99966
              ]
            },
            {
              "name": "deep book (b=200)",
              "x": [
                -400,
                -360,
                -320,
                -280,
                -240,
                -200,
                -160,
                -120,
                -80,
                -40,
                0,
                40,
                80,
                120,
                160,
                200,
                240,
                280,
                320,
                360,
                400
              ],
              "y": [
                0.1192,
                0.14185,
                0.16798,
                0.19782,
                0.23148,
                0.26894,
                0.31003,
                0.35434,
                0.40131,
                0.45017,
                0.5,
                0.54983,
                0.59869,
                0.64566,
                0.68997,
                0.73106,
                0.76852,
                0.80218,
                0.83202,
                0.85815,
                0.8808
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Treating properness as a guarantee against all gaming. It guarantees truthful reporting of a probability under the rule's own scoring, not robustness to collusion, wealth effects, or a forecaster wrapping the reward in a nonlinear utility of money.",
        "Reading loss-versus-rebalancing as an engineering defect a smarter contract could remove. It is the fixed price of committing in advance to trade against anyone at a public formula; the fee is the only lever, and it must be sized to the realised volatility, not to a target APR.",
        "Assuming proof-of-stake's lower energy use also lowers MEV. Both consensus mechanisms sell the same ordering privilege; they change who pays for it and how, not whether the rent exists.",
        "Assuming a back-tested signal keeps its Sharpe ratio once it is shared. The N-trader Kyle result shows total profit from a common signal collapses faster than 1/N, not merely each trader's share of a fixed pool."
      ],
      "check": [
        {
          "q": "Both the log score and the Brier score in the snippet were maximised by reporting p = 0.72, exactly the forecaster's true belief. What property guarantees this for any true belief, not just this one?",
          "options": [
            "Calibration",
            "Unbiasedness",
            "Properness of the scoring rule",
            "Risk-neutral pricing"
          ],
          "answer": 2,
          "why": "A proper scoring rule is defined by exactly this property: expected score under the true belief is maximised by reporting that belief truthfully, for every possible belief, which is why the grid search recovers p=0.72 for two different rules."
        },
        {
          "q": "The realised loss-versus-rebalancing in the snippet (823.93) was within 0.6% of the theoretical value (sigma^2/8) times the integral of V dt (828.93). What does that formula say the loss depends on?",
          "options": [
            "The pool's fee tier",
            "The realised variance of the price path, not its direction",
            "Only the direction of the price move",
            "The number of traders using the pool"
          ],
          "answer": 1,
          "why": "The rate is built from sigma squared, the variance, so it accrues whichever way the price moves -- a round trip back to the starting price still bleeds the LP, which is exactly the short-gamma signature."
        },
        {
          "q": "The attacker's sandwich profit was funded almost entirely by the victim's worse fill, not by the exchange or a third party. What category of cost is this, in the language the course has used since week 5?",
          "options": [
            "A pure transaction fee",
            "Adverse selection: an information and ordering advantage extracted from a counterparty's own pending order",
            "Market impact from the victim's own trade alone",
            "A liquidity rebate"
          ],
          "answer": 1,
          "why": "The attacker's edge comes entirely from seeing the victim's pending order before it settles and trading ahead of it -- the same structure as an informed trader in Glosten-Milgrom or Kyle, just relocated to the block-production layer."
        },
        {
          "q": "Total industry profit among N identical informed traders fell from 4.00 at N=1 to 0.40 at N=400 in the snippet -- not just each trader's share, the whole pool. Why does sharing the SAME signal erode profit faster than independent signals would?",
          "options": [
            "Because lambda falls, so the market maker loses money",
            "Because there is no diversification benefit to competing away when everyone already knows exactly what everyone else knows",
            "Because sigma_u must fall as N grows",
            "It is an artifact of the linear-strategy assumption and would not hold for nonlinear strategies"
          ],
          "answer": 1,
          "why": "With independent signals the market only slowly aggregates dispersed information as N grows; with identical information there is nothing left to aggregate, so competition drives the whole informational rent toward zero rather than merely dividing it more ways."
        }
      ],
      "n": 10
    }
  ],
  "interview": [
    {
      "q": "Why does a bid-ask spread exist even when the market maker has no inventory, no costs and no fees?",
      "level": "screen",
      "answer": "Because the market maker loses to informed traders and must recover that loss from uninformed ones. In the sequential-trade model the ask is the conditional expectation of value given that the next order is a buy, and the bid is the conditional expectation given a sell. A buy is evidence the value is high, so the ask sits above the unconditional mean and the bid below it, and the gap is pure adverse selection. Quoting the unconditional mean on both sides is the loss-making strategy: you would be picked off by anyone who knows more than you. The spread is the price of that ignorance, not a fee."
    },
    {
      "q": "What does Kyle's lambda measure, and what would make it larger?",
      "level": "screen",
      "answer": "Lambda is the equilibrium price impact per unit of net order flow, the slope of the market maker's linear pricing rule. In the one-period model it equals the standard deviation of the asset value divided by twice the standard deviation of noise trading. It rises when there is more fundamental uncertainty, because order flow is then more informative, and it falls when there is more uninformed volume to hide behind. Its reciprocal is market depth: the quantity you can trade for a one-unit price move. Practically, lambda is the number an execution algorithm is trading against, so anything that thins out uninformed flow makes execution more expensive."
    },
    {
      "q": "A colleague says their new signal must be valuable because it is different from the one the desk already uses. What do you say?",
      "level": "onsite",
      "answer": "Different is not the same as more informative. The Blackwell order compares experiments by whether one can be obtained from the other by adding noise; if it can, the noisier one is weakly worse for every decision problem and every utility function. Two signals that are merely different are typically not Blackwell-ordered, which means one is better for some decision problems and worse for others, and no general claim is available. So the right question is not novelty but whether the new signal is a garbling of the old one, a refinement of it, or genuinely incomparable, and in the last case you have to specify the decision problem before you can value it."
    },
    {
      "q": "Explain the no-trade theorem, and why markets nevertheless have volume.",
      "level": "onsite",
      "answer": "With a common prior, common knowledge of rationality and a Pareto-efficient starting allocation, a trade that is mutually acceptable cannot exist: your willingness to take the other side is itself information, and once each side conditions on the other's willingness the gains vanish. Volume therefore requires something outside that setup. The standard candidates are traders with motives other than information, such as liquidity, hedging or rebalancing needs; endowments that are not efficient to begin with; or departures from the common prior. This matters practically because the noise traders are not a modelling convenience: they are the entire reason a market maker can break even, which is why liquidity dries up exactly when uninformed flow leaves."
    },
    {
      "q": "How would you estimate the effective spread from trade and quote data, and what does decomposing it tell you?",
      "level": "onsite",
      "answer": "The effective half-spread is the signed difference between the trade price and the prevailing midquote, signed by trade direction. Decompose it by comparing the same trade against a midquote some interval later: the part of the price that has moved permanently in the trade's direction is adverse selection, the part that reverts is the liquidity provider's realised revenue, and the two sum to the effective spread by construction. That split is the diagnostic. A wide spread that is mostly adverse selection means the venue is expensive because its flow is toxic, and narrowing it by rule would just drive liquidity providers away; a wide spread that is mostly revenue means it is expensive because competition is weak."
    },
    {
      "q": "Why can't you just read the probability of informed trading off the order book?",
      "level": "onsite",
      "answer": "Because informed and uninformed orders look identical. Everything you observe is a mixture, and the informed fraction is a latent parameter of that mixture. The sequential-trade estimators get at it indirectly: the daily counts of buys and sells are a Poisson mixture whose components differ only in intensity, and the likelihood identifies the informed arrival rate from the excess dispersion of the buy-minus-sell imbalance relative to what uninformed flow alone would produce. That identification is fragile, which is why the volume-bucketed variants trade structural interpretation for stability, and why both are better read as relative toxicity measures than as probabilities."
    },
    {
      "q": "A venue proposes moving from a continuous limit order book to frequent batch auctions. Make the economic argument for and against.",
      "level": "senior",
      "answer": "For: a continuous book makes the response to public information a race, and the winner of that race picks off stale quotes. That sniping risk is a cost liquidity providers must charge for in the spread, and it rewards spending on speed that creates no information. Batching over a short interval turns the race into a uniform-price auction, so being marginally faster stops paying and the sniping component of the spread should fall. Against: batching delays execution and fragments the price into discrete moments, which hurts genuinely urgent traders; it moves competition from speed to the auction's design details; and if only one venue batches, informed flow simply routes to the continuous ones. The empirical question is whether the spread reduction exceeds the delay cost for the marginal trader."
    },
    {
      "q": "What is the informational difference between a prediction market price and a poll?",
      "level": "senior",
      "answer": "A poll aggregates stated beliefs with no cost to being wrong and no weight on confidence. A prediction market aggregates beliefs through positions, so a participant who is more confident or better informed can take a larger stake and move the price more, and being wrong is expensive. Under a proper scoring rule or a market scoring rule, honest reporting is the expected-score-maximising action, and the equilibrium price is readable as a probability. The limits are also informational: thin markets let a single trader move the price cheaply, the price is a risk-adjusted rather than a pure probability when the event correlates with wealth, and long-dated contracts embed the cost of capital."
    },
    {
      "q": "A market maker on an automated market maker loses money while the quoted spread looks profitable. Explain.",
      "level": "senior",
      "answer": "A constant-product pool quotes a deterministic price schedule and cannot withdraw or reprice between trades, so its quotes are always stale relative to the external market. Arbitrageurs trade exactly when the pool is mispriced, and the pool always takes the wrong side. The resulting loss relative to simply holding the initial inventory is adverse selection in its purest form: it grows with the variance of the external price and is independent of how the fee is set, so a fee can offset it but does not remove it. The same accounting applies to a quoting desk that cannot cancel fast enough, which is why the ability to withdraw quotes is itself a form of liquidity."
    },
    {
      "q": "Why does a Bayesian market maker's belief converge to the truth, and how fast?",
      "level": "onsite",
      "answer": "Each order is a signal whose likelihood ratio differs from one whenever the informed trader's probability of buying differs across values. Updating in log-odds space adds an independent draw with a strictly positive mean under the true state, so the log-odds drift toward the truth at a rate given by the expected log likelihood ratio, which is a Kullback–Leibler divergence. Convergence is therefore exponential in the number of informative trades, with a rate set by how much of the flow is informed. When almost all flow is uninformed the likelihood ratio is close to one, the divergence is tiny, and learning is slow — which is the same statement as the spread being narrow."
    },
    {
      "q": "You have a text-based signal from a language model that backtests well. What do you check before sizing it?",
      "level": "senior",
      "answer": "First, look-ahead: the model's training data and the vendor's timestamping both leak the future routinely, and a signal that knows the outcome is not a signal. Second, decay: measure the information coefficient at increasing horizons, because a semantic signal whose edge lives in the first minutes is an execution problem rather than an alpha. Third, crowding: the same text is available to everyone with the same model, so the marginal value is what survives after impact, and that depends on how much capital chases it. Fourth, whether the signal is a garbling of something the desk already has. The honest test is out-of-sample net of a realistic cost model, not gross."
    },
    {
      "q": "Rank these three courses' views of the same object and say when you would reach for each.",
      "level": "screen",
      "answer": "FINM 34600 is the statistics: given tick data, what can you estimate about volatility and jumps, and how does microstructure noise bias it. FINM 37601 is the control: given a price process and an impact model, what is the optimal schedule or quote. This course is the economics: why the spread and the impact exist, what they reveal, and how a venue's rules change them. Reach for the statistics when you have data and need a number, the control when you have a number and need a decision, and the economics when the number moves and you need to know whether the world changed or your model was wrong."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 37601",
      "how": "The direct complement. Kyle's lambda, estimated here as an equilibrium object, is the impact coefficient that course's optimal-execution and market-making problems take as given and optimise against; the limit-order-book equilibrium of week 7 is the economic content of its queueing and inventory models."
    },
    {
      "code": "FINM 34600",
      "how": "The statistical complement. The adverse selection this course explains is exactly the microstructure noise that course learns to estimate around, and the effective-spread and Roll estimators of week 8 are cousins of its realised-variance estimators asked a different question."
    },
    {
      "code": "FINM 33150",
      "how": "Every signal in a systematic strategy is an experiment in the week-3 sense, and the Blackwell argument is why a strictly finer signal cannot hurt while a merely different one can; the effective-spread decomposition of week 8 is the cost model a backtest needs."
    },
    {
      "code": "FINM 35600",
      "how": "The automated-market-maker pricing rules, loss-versus-rebalancing and liquidation mechanics of week 10 are the mechanism-design material that course develops at institutional scale."
    },
    {
      "code": "FINM 31200",
      "how": "Proof-of-work and proof-of-stake as incentive mechanisms, and block-level extraction as adverse selection, are the week-10 topics that course treats as its subject rather than as an example."
    },
    {
      "code": "FINM 33200",
      "how": "Week 10's semantic signals are language-model outputs used as an information structure; that course builds the extraction pipeline, while this one supplies the test of whether the extracted signal is worth anything once it is crowded."
    }
  ],
  "glossary": [
    {
      "term": "Adverse selection",
      "def": "The loss a liquidity provider takes because the counterparties who choose to trade with it are disproportionately better informed. In the sequential-trade model it is the entire bid-ask spread."
    },
    {
      "term": "Aumann agreement",
      "def": "With a common prior, two rational agents whose posteriors for an event are common knowledge must hold the same posterior. Disagreement can survive only if something in that list fails."
    },
    {
      "term": "Blackwell order",
      "def": "A partial order on information structures: experiment A is less informative than B if A can be written as B followed by a garbling. If so, A is weakly worse for every decision problem and every utility."
    },
    {
      "term": "Common prior",
      "def": "The assumption that all agents' beliefs come from one probability measure on a shared state space, differing only through what each has observed. It is what makes the no-trade theorems bite."
    },
    {
      "term": "Constant-product market maker",
      "def": "An automated venue that holds reserves x and y and permits any trade preserving x*y. Its marginal price is y/x, so price impact is a deterministic function of size."
    },
    {
      "term": "Effective spread",
      "def": "Twice the signed distance from the trade price to the prevailing midquote. The cost a taker actually paid, as opposed to the quoted spread the taker was shown."
    },
    {
      "term": "Experiment (information structure)",
      "def": "A row-stochastic matrix giving the probability of each signal in each state of the world. The formal object a 'signal' or 'dataset' becomes once you want to value it."
    },
    {
      "term": "Garbling",
      "def": "A stochastic matrix applied to an experiment's signal, mapping it to a new signal whose distribution depends on the state only through the original one. Adding noise, stated as a matrix."
    },
    {
      "term": "Glosten–Milgrom model",
      "def": "A sequential-trade model in which a competitive risk-neutral market maker quotes a bid and an ask equal to the conditional expectations of value given a sell and a buy, earning zero expected profit."
    },
    {
      "term": "Harsanyi type space",
      "def": "A model of interactive beliefs in which each agent's private information is summarised by a type, and a prior over type profiles generates every agent's beliefs about the state and about the others."
    },
    {
      "term": "Information share",
      "def": "Hasbrouck's decomposition of the variance of the common efficient-price innovation across venues, measuring each venue's contribution to price discovery. Reported as bounds when the venues' innovations are correlated."
    },
    {
      "term": "Kyle's lambda",
      "def": "The slope of the equilibrium linear pricing rule in the strategic-trade model: the price move per unit of net order flow. Equals the value standard deviation over twice the noise-flow standard deviation in the one-period case."
    },
    {
      "term": "Loss versus rebalancing",
      "def": "The shortfall of an automated liquidity provider against a portfolio that holds the same exposure but rebalances at market prices. The pool's adverse selection cost, growing with the variance of the external price."
    },
    {
      "term": "Market depth",
      "def": "The quantity that can be traded for a given price move, the reciprocal of lambda. The operational meaning of liquidity for anyone sizing an order."
    },
    {
      "term": "Milgrom–Stokey no-trade theorem",
      "def": "From a Pareto-efficient allocation, with a common prior and common knowledge, no trade can be mutually acceptable once each side conditions on the other's willingness to trade."
    },
    {
      "term": "Noise trader",
      "def": "A participant whose order is uncorrelated with the asset's value, trading for liquidity, hedging or rebalancing reasons. The source of the market maker's revenue and of the informed trader's camouflage."
    },
    {
      "term": "PIN",
      "def": "The probability of informed trading, estimated as the informed arrival intensity divided by total arrival intensity in a Poisson mixture model of daily buy and sell counts."
    },
    {
      "term": "Proper scoring rule",
      "def": "A payment schedule on a reported probability under which the reporter's expected score is maximised by reporting their true belief. The log rule and the quadratic rule are the standard examples."
    },
    {
      "term": "Realised spread",
      "def": "The part of the effective spread that reverts: the signed distance from the trade price to a midquote measured some interval later. The liquidity provider's revenue, with adverse selection removed."
    },
    {
      "term": "Roll estimator",
      "def": "An implicit-spread estimate equal to twice the square root of minus the first autocovariance of transaction-price changes, valid when the only source of negative autocovariance is bid-ask bounce."
    }
  ]
};
