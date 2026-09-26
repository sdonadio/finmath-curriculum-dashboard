/* ════════════════════════════════════════════════════════════════════════
   skills.js — GENERATED. Do not edit by hand.

   Written by tools/build_skills.py from courses/*.js and data/skills_seed.js.
   Regenerate it after adding or editing any course:

       python3 tools/build_skills.py

   It carries two things:
     tags[]    the shared vocabulary — every skill tag, its category, and the
               courses that BUILD it and that ASSUME it. skills.html is this
               table; a chip on a course page links into it by #<tag>.
     courses[] a compact index — counts and tag lists only, no week content —
               so index.html can filter by skill and show progress without
               loading 29 deep course files.
   ════════════════════════════════════════════════════════════════════════ */
"use strict";
window.SKILLS = {
  "generated": "2026-09-26",
  "categories": [
    {
      "id": "math",
      "name": "Mathematics",
      "color": "#155f83"
    },
    {
      "id": "stats-ml",
      "name": "Statistics & ML",
      "color": "#642822"
    },
    {
      "id": "markets",
      "name": "Markets & institutions",
      "color": "#58593f"
    },
    {
      "id": "pricing",
      "name": "Pricing & valuation",
      "color": "#800000"
    },
    {
      "id": "programming",
      "name": "Programming & systems",
      "color": "#b45f20"
    },
    {
      "id": "data",
      "name": "Data & infrastructure",
      "color": "#357d96"
    },
    {
      "id": "risk",
      "name": "Risk",
      "color": "#8f3931"
    },
    {
      "id": "trading",
      "name": "Trading & execution",
      "color": "#91ab5a"
    }
  ],
  "tags": [
    {
      "tag": "alpha-research",
      "name": "Alpha research",
      "category": "trading",
      "blurb": "The research loop: hypothesis, test, validate, and discard most ideas",
      "built_in": [
        "FINM 33150"
      ],
      "assumed_in": []
    },
    {
      "tag": "american-options",
      "name": "American options",
      "category": "pricing",
      "blurb": "Early exercise, the optimal stopping problem, and numerical exercise boundaries",
      "built_in": [
        "FINM 33000"
      ],
      "assumed_in": []
    },
    {
      "tag": "asymmetric-information",
      "name": "Asymmetric information",
      "category": "markets",
      "blurb": "Trading against a better-informed counterparty; adverse selection",
      "built_in": [
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "backtesting",
      "name": "Backtesting",
      "category": "trading",
      "blurb": "Simulating a strategy on history without lying to yourself",
      "built_in": [
        "FINM 33150"
      ],
      "assumed_in": []
    },
    {
      "tag": "bayesian-inference",
      "name": "Bayesian inference",
      "category": "stats-ml",
      "blurb": "Prior, likelihood and posterior as a working tool: odds-form updating, conjugate models and sequential learning",
      "built_in": [
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "binomial-model",
      "name": "Binomial model",
      "category": "pricing",
      "blurb": "One-period-at-a-time replication on a recombining up/down tree",
      "built_in": [
        "FINM 33000"
      ],
      "assumed_in": []
    },
    {
      "tag": "black-76",
      "name": "Black 76",
      "category": "pricing",
      "blurb": "The lognormal-forward model for options on futures, caps and swaptions",
      "built_in": [
        "FINM 33000",
        "FINM 37000",
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "black-scholes-pde",
      "name": "Black scholes pde",
      "category": "pricing",
      "blurb": "The parabolic PDE a delta-hedged derivative price must satisfy",
      "built_in": [
        "FINM 33000"
      ],
      "assumed_in": [
        "FINM 37301",
        "FINM 37500"
      ]
    },
    {
      "tag": "brownian-motion",
      "name": "Brownian motion",
      "category": "math",
      "blurb": "Continuous-path Gaussian process; quadratic variation and nowhere differentiability",
      "built_in": [
        "FINM 33000",
        "FINM 34000"
      ],
      "assumed_in": [
        "FINM 34600",
        "FINM 37000"
      ]
    },
    {
      "tag": "canonical-correlation",
      "name": "Canonical correlation",
      "category": "stats-ml",
      "blurb": "Finding paired linear combinations of two blocks of variables that co-move",
      "built_in": [
        "FINM 34700"
      ],
      "assumed_in": []
    },
    {
      "tag": "carry-trade",
      "name": "Carry trade",
      "category": "trading",
      "blurb": "Earning a yield or roll differential and the risk it compensates",
      "built_in": [
        "FINM 33150",
        "FINM 36700",
        "FINM 37000",
        "FINM 37301",
        "FINM 37400"
      ],
      "assumed_in": []
    },
    {
      "tag": "change-of-numeraire",
      "name": "Change of numeraire",
      "category": "pricing",
      "blurb": "Re-expressing prices in another asset's units to simplify a valuation",
      "built_in": [
        "FINM 33000",
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "clustering",
      "name": "Clustering",
      "category": "stats-ml",
      "blurb": "Grouping observations without labels: k-means, hierarchical and model-based methods",
      "built_in": [
        "FINM 34700"
      ],
      "assumed_in": []
    },
    {
      "tag": "code-review",
      "name": "Code review",
      "category": "programming",
      "blurb": "Reading someone else's diff for defects, clarity and reproducibility",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "columnar-storage",
      "name": "Columnar storage",
      "category": "data",
      "blurb": "Typed column-oriented formats such as parquet: projection, compression and pushdown",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "conditional-expectation",
      "name": "Conditional expectation",
      "category": "math",
      "blurb": "Expectation given a sigma-algebra, tower property, projection interpretation",
      "built_in": [
        "FINM 34000"
      ],
      "assumed_in": [
        "FINM 33000",
        "FINM 33165",
        "FINM 34600",
        "FINM 34700",
        "FINM 35100",
        "FINM 36700",
        "FINM 37400",
        "FINM 37500",
        "FINM 37601"
      ]
    },
    {
      "tag": "constrained-optimization",
      "name": "Constrained optimization",
      "category": "math",
      "blurb": "Projection, penalty, barrier, augmented Lagrangian and interior-point methods for constrained programs",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "convex-optimization",
      "name": "Convex optimization",
      "category": "math",
      "blurb": "Convex sets and functions, and the named families (LP, QP, SOCP, SDP) a solver handles globally",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "convexity-adjustment",
      "name": "Convexity adjustment",
      "category": "pricing",
      "blurb": "The correction required when a futures, forward or measure mismatch biases a naive expectation",
      "built_in": [
        "FINM 37000",
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "cost-of-carry",
      "name": "Cost of carry",
      "category": "pricing",
      "blurb": "Financing, storage and convenience yield linking a spot price to its forward",
      "built_in": [
        "FINM 33000",
        "FINM 37000",
        "FINM 37301"
      ],
      "assumed_in": []
    },
    {
      "tag": "covariance-estimation",
      "name": "Covariance estimation",
      "category": "stats-ml",
      "blurb": "Estimating and conditioning a covariance matrix when n is close to p",
      "built_in": [
        "FINM 34600",
        "FINM 34700",
        "FINM 36700"
      ],
      "assumed_in": [
        "FINM 34800"
      ]
    },
    {
      "tag": "crsp-compustat",
      "name": "Crsp compustat",
      "category": "data",
      "blurb": "Standard US equity pricing and fundamentals research datasets",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "crypto-markets",
      "name": "Crypto markets",
      "category": "markets",
      "blurb": "Cryptotokens, centralised venues, perpetuals and the institutional plumbing",
      "built_in": [
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "data-lineage",
      "name": "Data lineage",
      "category": "data",
      "blurb": "Tracing an output number back to the inputs, code and environment that produced it",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "data-validation",
      "name": "Data validation",
      "category": "data",
      "blurb": "Automated data-quality checks that fail loudly before a model sees the data",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "decision-trees",
      "name": "Decision trees",
      "category": "stats-ml",
      "blurb": "Recursive partitioning of feature space into axis-aligned regions",
      "built_in": [
        "FINM 34700"
      ],
      "assumed_in": []
    },
    {
      "tag": "drawdown",
      "name": "Drawdown",
      "category": "risk",
      "blurb": "Peak-to-trough loss as the risk measure investors actually feel",
      "built_in": [
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "duality-and-kkt",
      "name": "Duality and kkt",
      "category": "math",
      "blurb": "Lagrangian duality, weak and strong duality, KKT conditions and multipliers as shadow prices",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "duration-convexity",
      "name": "Duration convexity",
      "category": "risk",
      "blurb": "First- and second-order sensitivity of a bond price to yield",
      "built_in": [
        "FINM 37400"
      ],
      "assumed_in": [
        "FINM 37500"
      ]
    },
    {
      "tag": "efficient-frontier",
      "name": "Efficient frontier",
      "category": "risk",
      "blurb": "The set of portfolios with no better risk-return alternative",
      "built_in": [
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "etl-pipelines",
      "name": "Etl pipelines",
      "category": "data",
      "blurb": "Extract, transform and load as a reproducible, automated pipeline",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "exchange-mechanism-design",
      "name": "Exchange mechanism design",
      "category": "markets",
      "blurb": "Auction and matching rules, fee schedules and listing design",
      "built_in": [
        "FINM 35100",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "factor-models",
      "name": "Factor models",
      "category": "risk",
      "blurb": "Explaining returns through common factors; attribution and residual risk",
      "built_in": [
        "FINM 34700",
        "FINM 36700",
        "FINM 37400"
      ],
      "assumed_in": []
    },
    {
      "tag": "fundamental-theorems-asset-pricing",
      "name": "Fundamental theorems asset pricing",
      "category": "pricing",
      "blurb": "No arbitrage as existence, and completeness as uniqueness, of a pricing measure",
      "built_in": [
        "FINM 33000"
      ],
      "assumed_in": []
    },
    {
      "tag": "futures-markets",
      "name": "Futures markets",
      "category": "markets",
      "blurb": "Contract specs, delivery, basis and the roll across futures markets",
      "built_in": [
        "FINM 37000"
      ],
      "assumed_in": [
        "FINM 33150"
      ]
    },
    {
      "tag": "fx-markets",
      "name": "Fx markets",
      "category": "markets",
      "blurb": "Spot, forward and swap conventions; exchange-rate regimes and monetary systems",
      "built_in": [
        "FINM 37301"
      ],
      "assumed_in": []
    },
    {
      "tag": "girsanov",
      "name": "Girsanov",
      "category": "math",
      "blurb": "Change of measure that re-drifts a Brownian motion; Radon-Nikodym densities",
      "built_in": [
        "FINM 33000"
      ],
      "assumed_in": []
    },
    {
      "tag": "git-version-control",
      "name": "Git version control",
      "category": "programming",
      "blurb": "Branching, review through pull requests, and a readable history",
      "built_in": [],
      "assumed_in": [
        "FINM 32800"
      ]
    },
    {
      "tag": "greeks",
      "name": "Greeks",
      "category": "pricing",
      "blurb": "Sensitivities of a derivative price: delta, gamma, vega, theta and rho",
      "built_in": [
        "FINM 33000",
        "FINM 37000",
        "FINM 37301",
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "hedging",
      "name": "Hedging",
      "category": "risk",
      "blurb": "Offsetting an unwanted exposure and the basis risk left behind",
      "built_in": [
        "FINM 33165",
        "FINM 36700",
        "FINM 37000",
        "FINM 37301",
        "FINM 37400"
      ],
      "assumed_in": []
    },
    {
      "tag": "high-frequency-data",
      "name": "High frequency data",
      "category": "markets",
      "blurb": "Tick data, irregular sampling and microstructure noise",
      "built_in": [
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "implied-volatility",
      "name": "Implied volatility",
      "category": "pricing",
      "blurb": "The volatility that reprices a quoted option; quoting in vol space",
      "built_in": [
        "FINM 33000",
        "FINM 37000",
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "incremental-processing",
      "name": "Incremental processing",
      "category": "data",
      "blurb": "Idempotent, restartable jobs: watermarks, upserts, late data and backfills",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "interest-rate-risk",
      "name": "Interest rate risk",
      "category": "risk",
      "blurb": "Exposure to curve level, slope and curvature moves",
      "built_in": [
        "FINM 37400"
      ],
      "assumed_in": []
    },
    {
      "tag": "interest-rate-trees",
      "name": "Interest rate trees",
      "category": "pricing",
      "blurb": "Discrete short-rate lattices calibrated to the curve",
      "built_in": [
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "ito-calculus",
      "name": "Ito calculus",
      "category": "math",
      "blurb": "The Ito integral against a semimartingale and the rules of stochastic calculus",
      "built_in": [],
      "assumed_in": [
        "FINM 34600",
        "FINM 37601"
      ]
    },
    {
      "tag": "jump-detection",
      "name": "Jump detection",
      "category": "stats-ml",
      "blurb": "Separating jumps from diffusive moves: truncation, bipower ratios and extreme-value jump tests",
      "built_in": [
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "kelly-criterion",
      "name": "Kelly criterion",
      "category": "trading",
      "blurb": "Growth-optimal position sizing and the cost of overbetting",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "lasso",
      "name": "Lasso",
      "category": "stats-ml",
      "blurb": "L1-penalised regression that performs variable selection by zeroing coefficients",
      "built_in": [
        "FINM 34700",
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "levy-processes",
      "name": "Levy processes",
      "category": "math",
      "blurb": "Jump processes with stationary independent increments and their integration theory",
      "built_in": [
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "linear-algebra",
      "name": "Linear algebra",
      "category": "math",
      "blurb": "Vector spaces, rank, projections, and the matrix algebra quant work runs on",
      "built_in": [],
      "assumed_in": [
        "FINM 33000",
        "FINM 33150",
        "FINM 33165",
        "FINM 34000",
        "FINM 34700",
        "FINM 34800",
        "FINM 36700",
        "FINM 37000",
        "FINM 37400",
        "FINM 37500"
      ]
    },
    {
      "tag": "linear-regression",
      "name": "Linear regression",
      "category": "stats-ml",
      "blurb": "Least squares in univariate and multivariate form; the geometry of the fit",
      "built_in": [
        "FINM 33150",
        "FINM 37400"
      ],
      "assumed_in": [
        "FINM 33165",
        "FINM 34000",
        "FINM 34600",
        "FINM 34700",
        "FINM 34800",
        "FINM 35100",
        "FINM 36700",
        "FINM 37000",
        "FINM 37601"
      ]
    },
    {
      "tag": "liquidity-provision",
      "name": "Liquidity provision",
      "category": "markets",
      "blurb": "Supplying two-sided quotes and being paid for immediacy and risk",
      "built_in": [
        "FINM 35100",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "logistic-regression",
      "name": "Logistic regression",
      "category": "stats-ml",
      "blurb": "Modelling a binary outcome through the log-odds link",
      "built_in": [],
      "assumed_in": [
        "FINM 34800"
      ]
    },
    {
      "tag": "margin-and-leverage",
      "name": "Margin and leverage",
      "category": "risk",
      "blurb": "Initial and maintenance margin, funding and forced liquidation",
      "built_in": [
        "FINM 37000"
      ],
      "assumed_in": []
    },
    {
      "tag": "market-impact",
      "name": "How your own trading moves the price against you",
      "category": "trading",
      "blurb": "",
      "built_in": [
        "FINM 33165",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "market-making",
      "name": "Market making",
      "category": "markets",
      "blurb": "Running a quoting book: spread capture, inventory and adverse selection",
      "built_in": [
        "FINM 33150",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "market-microstructure",
      "name": "Market microstructure",
      "category": "markets",
      "blurb": "Price formation at short horizons and the behaviour of market participants",
      "built_in": [
        "FINM 34600",
        "FINM 35100",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "markov-chains",
      "name": "Markov chains",
      "category": "math",
      "blurb": "State transitions with no memory; stationary distributions and hitting times",
      "built_in": [
        "FINM 33165",
        "FINM 34000"
      ],
      "assumed_in": [
        "FINM 35100"
      ]
    },
    {
      "tag": "markowitz-optimization",
      "name": "Markowitz optimization",
      "category": "risk",
      "blurb": "Solving for optimal weights, with and without constraints",
      "built_in": [
        "FINM 34800",
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "martingales",
      "name": "Martingales",
      "category": "math",
      "blurb": "Fair-game processes in discrete and continuous time, optional stopping",
      "built_in": [
        "FINM 33000",
        "FINM 34000"
      ],
      "assumed_in": [
        "FINM 34600"
      ]
    },
    {
      "tag": "mean-reversion",
      "name": "Mean reversion",
      "category": "trading",
      "blurb": "Trading the pull of a spread or price back toward a level",
      "built_in": [
        "FINM 33150"
      ],
      "assumed_in": []
    },
    {
      "tag": "mean-variance",
      "name": "Mean variance",
      "category": "risk",
      "blurb": "Trading expected return against variance; the two-moment framework",
      "built_in": [
        "FINM 36700"
      ],
      "assumed_in": [
        "FINM 34800"
      ]
    },
    {
      "tag": "measure-theoretic-probability",
      "name": "Measure theoretic probability",
      "category": "math",
      "blurb": "Probability on measure spaces: sigma-algebras, measurability, expectation as an integral",
      "built_in": [
        "FINM 34000"
      ],
      "assumed_in": [
        "FINM 33165",
        "FINM 35100"
      ]
    },
    {
      "tag": "model-calibration",
      "name": "Model calibration",
      "category": "pricing",
      "blurb": "Fitting model parameters to observed market quotes as a nonlinear least-squares problem, and its identifiability",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "monte-carlo-pricing",
      "name": "Monte carlo pricing",
      "category": "pricing",
      "blurb": "Valuing by simulation, with variance reduction and error control",
      "built_in": [
        "FINM 33000",
        "FINM 37000",
        "FINM 37301"
      ],
      "assumed_in": []
    },
    {
      "tag": "neural-networks",
      "name": "Neural networks",
      "category": "stats-ml",
      "blurb": "Layered nonlinear function approximators and how they are trained",
      "built_in": [
        "FINM 33165"
      ],
      "assumed_in": [
        "FINM 35100"
      ]
    },
    {
      "tag": "no-trade-theorems",
      "name": "No trade theorems",
      "category": "markets",
      "blurb": "Common knowledge results that say rational agents should not trade on beliefs alone",
      "built_in": [
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "numpy",
      "name": "Numpy",
      "category": "programming",
      "blurb": "Array programming, broadcasting and vectorised numerics",
      "built_in": [],
      "assumed_in": [
        "FINM 32800",
        "FINM 33000",
        "FINM 33150",
        "FINM 33165",
        "FINM 34000",
        "FINM 34600",
        "FINM 34700",
        "FINM 34800",
        "FINM 35100",
        "FINM 36700",
        "FINM 37000",
        "FINM 37301",
        "FINM 37400",
        "FINM 37500",
        "FINM 37601"
      ]
    },
    {
      "tag": "optimal-execution",
      "name": "Optimal execution",
      "category": "trading",
      "blurb": "Scheduling a parent order to trade off impact against timing risk",
      "built_in": [
        "FINM 33165",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "optionmetrics",
      "name": "Optionmetrics",
      "category": "data",
      "blurb": "Historical option prices, implied vols and surfaces",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "order-book-data",
      "name": "Order book data",
      "category": "data",
      "blurb": "Depth-of-book and message-level exchange data, e.g. CME Globex",
      "built_in": [
        "FINM 34600",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "order-book-dynamics",
      "name": "Order book dynamics",
      "category": "markets",
      "blurb": "How a limit order book fills, queues, refreshes and reveals information",
      "built_in": [
        "FINM 35100",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "order-types",
      "name": "Order types",
      "category": "trading",
      "blurb": "Limit, market, stop and conditional orders, and when each is right",
      "built_in": [
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "pca",
      "name": "Pca",
      "category": "stats-ml",
      "blurb": "Principal component analysis: orthogonal directions of maximal variance",
      "built_in": [
        "FINM 34700",
        "FINM 37000",
        "FINM 37400"
      ],
      "assumed_in": []
    },
    {
      "tag": "poisson-process",
      "name": "Poisson process",
      "category": "math",
      "blurb": "Counting process with exponential inter-arrivals; compensators and intensity",
      "built_in": [
        "FINM 34000"
      ],
      "assumed_in": []
    },
    {
      "tag": "portfolio-construction",
      "name": "Portfolio construction",
      "category": "risk",
      "blurb": "Turning signals into positions under real constraints and costs",
      "built_in": [
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "prediction-markets",
      "name": "Prediction markets",
      "category": "markets",
      "blurb": "Contracts on events, scoring rules, and price-as-probability",
      "built_in": [
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "price-discovery",
      "name": "Price discovery",
      "category": "markets",
      "blurb": "How and where a security's efficient price is formed: information shares, common factors and the speed of revelation",
      "built_in": [
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "proximal-methods",
      "name": "Proximal methods",
      "category": "math",
      "blurb": "Subgradients, proximal operators, soft-thresholding, ISTA/FISTA and ADMM splitting for nonsmooth objectives",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "python-pandas",
      "name": "Python pandas",
      "category": "programming",
      "blurb": "DataFrames: joins, groupby, resampling and time-series indexing",
      "built_in": [],
      "assumed_in": [
        "FINM 32800",
        "FINM 33150",
        "FINM 34700",
        "FINM 36700",
        "FINM 37000",
        "FINM 37601"
      ]
    },
    {
      "tag": "random-forests",
      "name": "Random forests",
      "category": "stats-ml",
      "blurb": "Bagged, decorrelated trees; out-of-bag error and variable importance",
      "built_in": [
        "FINM 34700"
      ],
      "assumed_in": []
    },
    {
      "tag": "random-walk",
      "name": "Random walk",
      "category": "math",
      "blurb": "Simple random walk: recurrence, reflection, scaling to Brownian motion",
      "built_in": [
        "FINM 34000"
      ],
      "assumed_in": [
        "FINM 33000"
      ]
    },
    {
      "tag": "realised-volatility",
      "name": "Realised volatility",
      "category": "stats-ml",
      "blurb": "Realised measures of volatility: realised variance, bipower and kernel estimators, and their limit theory",
      "built_in": [
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "reinforcement-learning",
      "name": "Reinforcement learning",
      "category": "stats-ml",
      "blurb": "Learning a policy from reward through interaction with an environment",
      "built_in": [
        "FINM 33165"
      ],
      "assumed_in": []
    },
    {
      "tag": "reproducible-research",
      "name": "Reproducible research",
      "category": "data",
      "blurb": "Build automation and dependency pinning so a result can be regenerated",
      "built_in": [
        "FINM 32800",
        "FINM 33165"
      ],
      "assumed_in": []
    },
    {
      "tag": "ridge-regression",
      "name": "Ridge regression",
      "category": "stats-ml",
      "blurb": "L2-penalised regression; shrinkage and conditioning of the normal equations",
      "built_in": [
        "FINM 33165",
        "FINM 34700"
      ],
      "assumed_in": []
    },
    {
      "tag": "risk-neutral-pricing",
      "name": "Risk neutral pricing",
      "category": "pricing",
      "blurb": "Valuation as a discounted expectation under an equivalent martingale measure",
      "built_in": [
        "FINM 33000"
      ],
      "assumed_in": [
        "FINM 37000",
        "FINM 37301",
        "FINM 37400",
        "FINM 37500"
      ]
    },
    {
      "tag": "robust-optimization",
      "name": "Robust optimization",
      "category": "risk",
      "blurb": "Worst-case optimisation over an uncertainty set, robust counterparts, and the equivalence with regularisation",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "schema-evolution",
      "name": "Schema evolution",
      "category": "data",
      "blurb": "Registered schemas, drift detection and compatible change to a dataset's shape",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "sharpe-ratio",
      "name": "Sharpe ratio",
      "category": "risk",
      "blurb": "Risk-adjusted return, its estimation error and its abuse",
      "built_in": [
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "signal-construction",
      "name": "Signal construction",
      "category": "trading",
      "blurb": "Turning raw data into a predictive, tradeable signal",
      "built_in": [
        "FINM 33150",
        "FINM 33165",
        "FINM 35100"
      ],
      "assumed_in": []
    },
    {
      "tag": "spread-trades",
      "name": "Spread trades",
      "category": "trading",
      "blurb": "Relative-value trades between two related instruments",
      "built_in": [
        "FINM 33150",
        "FINM 37000",
        "FINM 37400"
      ],
      "assumed_in": []
    },
    {
      "tag": "sql",
      "name": "Sql",
      "category": "data",
      "blurb": "Relational querying, joins and aggregation against a research database",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "statistical-arbitrage",
      "name": "Statistical arbitrage",
      "category": "trading",
      "blurb": "Many small, weakly predictive bets diversified into a portfolio",
      "built_in": [
        "FINM 33150"
      ],
      "assumed_in": []
    },
    {
      "tag": "stochastic-control",
      "name": "Stochastic control",
      "category": "math",
      "blurb": "Continuous-time optimisation of a controlled process: Hamilton-Jacobi-Bellman equations, verification and the discrete dynamic program behind them",
      "built_in": [
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "stochastic-differential-equations",
      "name": "Stochastic differential equations",
      "category": "math",
      "blurb": "SDEs: existence, uniqueness, and the diffusions they generate",
      "built_in": [],
      "assumed_in": [
        "FINM 37601"
      ]
    },
    {
      "tag": "swaptions",
      "name": "Swaptions",
      "category": "pricing",
      "blurb": "Options to enter a swap, and the vol surface they trade on",
      "built_in": [
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "tail-risk",
      "name": "Tail risk",
      "category": "risk",
      "blurb": "Fat tails, extreme quantiles and why Gaussian intuition fails there",
      "built_in": [
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "taq-trades-quotes",
      "name": "Taq trades quotes",
      "category": "data",
      "blurb": "Intraday trade and quote data and its cleaning conventions",
      "built_in": [
        "FINM 32800",
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "time-series-alignment",
      "name": "Time series alignment",
      "category": "data",
      "blurb": "Point-in-time joins, as-of merges and avoiding lookahead",
      "built_in": [
        "FINM 32800",
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "transaction-costs",
      "name": "Transaction costs",
      "category": "trading",
      "blurb": "Spread, fees, slippage and their effect on realised P&L",
      "built_in": [
        "FINM 35100",
        "FINM 37601"
      ],
      "assumed_in": []
    },
    {
      "tag": "unconstrained-optimization",
      "name": "Unconstrained optimization",
      "category": "math",
      "blurb": "Line searches, steepest descent, Newton, quasi-Newton, Gauss-Newton and root finding in one variable",
      "built_in": [
        "FINM 34800"
      ],
      "assumed_in": []
    },
    {
      "tag": "var-es",
      "name": "Var es",
      "category": "risk",
      "blurb": "Value-at-Risk and expected shortfall: definition, estimation and backtesting",
      "built_in": [
        "FINM 34800",
        "FINM 36700"
      ],
      "assumed_in": []
    },
    {
      "tag": "volatility-clustering",
      "name": "Volatility clustering",
      "category": "markets",
      "blurb": "The empirical tendency of large moves to follow large moves",
      "built_in": [
        "FINM 34600"
      ],
      "assumed_in": []
    },
    {
      "tag": "volatility-smile",
      "name": "Volatility smile",
      "category": "pricing",
      "blurb": "The strike and maturity structure of implied volatility, and what breaks flat-vol models",
      "built_in": [
        "FINM 37301",
        "FINM 37500"
      ],
      "assumed_in": []
    },
    {
      "tag": "weighted-least-squares",
      "name": "Weighted least squares",
      "category": "stats-ml",
      "blurb": "Regression with per-observation weights or non-constant error variance",
      "built_in": [
        "FINM 33150"
      ],
      "assumed_in": []
    },
    {
      "tag": "workflow-orchestration",
      "name": "Workflow orchestration",
      "category": "data",
      "blurb": "Dependency graphs, staleness, scheduling and failure semantics for batch jobs",
      "built_in": [
        "FINM 32800"
      ],
      "assumed_in": []
    },
    {
      "tag": "yield-curve",
      "name": "Yield curve",
      "category": "pricing",
      "blurb": "Bootstrapping, interpolation, and the discount factors a curve implies",
      "built_in": [
        "FINM 37400",
        "FINM 37500"
      ],
      "assumed_in": [
        "FINM 37301"
      ]
    }
  ],
  "courses": [
    {
      "code": "FINM 32800",
      "slug": "finm-32800",
      "title": "Data Pipelines for Quantitative Research",
      "instructor": "Jeremy Bejarano",
      "quarter": "Autumn",
      "units": 100,
      "block": "computing",
      "tier": "B",
      "concentrations": [],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 39,
      "widgets": 8,
      "prerequisites": [
        "Python and the PyData stack -- pandas, numpy -- at an intermediate level: comfortable writing a merge, a groupby, and a small script without hand-holding. The course spends no time teaching Python itself and assumes this fluency from the first exercise.",
        "Enough SQL to read a SELECT with a WHERE and a JOIN. Week 9 builds window functions, indexes and query plans on top of that vocabulary; it does not introduce joins from scratch.",
        "A command-line environment at the level of navigating directories, redirecting output, and reading a nonzero exit code. Every exercise in this course is run and debugged from a terminal, not a notebook, starting in week 1.",
        "What a financial time series is, and why it needs a well-defined index and trading calendar. The course does not re-derive this; it exploits it every week, especially in week 3's point-in-time joins.",
        "Basic descriptive statistics -- a mean, a standard deviation, a z-score -- at the level week 6's data-quality checks assume without re-deriving them."
      ],
      "skills_built": [
        "etl-pipelines",
        "time-series-alignment",
        "workflow-orchestration",
        "incremental-processing",
        "data-validation",
        "schema-evolution",
        "columnar-storage",
        "sql",
        "crsp-compustat",
        "taq-trades-quotes",
        "optionmetrics",
        "data-lineage",
        "reproducible-research",
        "code-review"
      ],
      "skills_assumed": [
        "python-pandas",
        "numpy",
        "git-version-control"
      ]
    },
    {
      "code": "FINM 33000",
      "slug": "finm-33000",
      "title": "Options",
      "instructor": "Roger Lee",
      "quarter": "Autumn",
      "units": 100,
      "block": "core",
      "tier": "B",
      "concentrations": [],
      "weeks": 9,
      "concepts": 36,
      "mcqs": 36,
      "widgets": 8,
      "prerequisites": [
        "Calculus-based probability at the level of moment generating functions, joint densities and conditional expectation; this course does not build measure theory from scratch, but leans on conditional expectation constantly.",
        "Linear algebra: solving small systems of linear equations by hand or with numpy, and basic matrix-vector manipulation, for the state-price and change-of-numeraire calculations in weeks 2 and 8.",
        "Enough real analysis to be unsurprised that a limit of a discrete sum can equal an integral, and that a sequence can converge non-monotonically; both show up directly when the binomial model becomes Black-Scholes.",
        "Python and NumPy sufficient to implement a backward-induction loop and a Monte Carlo estimator without a library doing the arithmetic for you."
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
        "monte-carlo-pricing"
      ],
      "skills_assumed": [
        "conditional-expectation",
        "linear-algebra",
        "numpy",
        "random-walk"
      ]
    },
    {
      "code": "FINM 33150",
      "slug": "finm-33150",
      "title": "Quantitative Trading Strategies",
      "instructor": "Brian Boonstra",
      "quarter": "Winter",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "trading"
      ],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 35,
      "widgets": 10,
      "prerequisites": [
        "Ordinary least squares in matrix form -- normal equations, standard errors, R-squared -- at the level of writing it from scratch with numpy, not just calling a library. Every strategy family in this course is presented as a regression, and week 1 assumes that lens is already comfortable.",
        "Enough finance vocabulary about futures, credit and FX to follow terms like cost of carry, basis, roll yield and interest-rate differential without a glossary lookup mid-lecture.",
        "The sampling distribution of a mean and of a Sharpe ratio: standard errors, and why a short backtest is weak evidence. FINM 36700 covers this in depth and this course leans on it from week 1 onward.",
        "Python with numpy and pandas at the level of writing a small backtest loop and aligning two time series without introducing a look-ahead bug.",
        "Basic probability: stationarity, autocorrelation, and what it means for a process to mean-revert. Weeks 2 and 5 are built entirely on this vocabulary."
      ],
      "skills_built": [
        "signal-construction",
        "spread-trades",
        "carry-trade",
        "mean-reversion",
        "statistical-arbitrage",
        "backtesting",
        "market-making",
        "alpha-research",
        "linear-regression",
        "weighted-least-squares"
      ],
      "skills_assumed": [
        "numpy",
        "python-pandas",
        "linear-algebra",
        "futures-markets"
      ]
    },
    {
      "code": "FINM 33165",
      "slug": "finm-33165",
      "title": "Reinforcement Learning and Deep Learning",
      "instructor": "Niels Nygaard",
      "quarter": "Autumn",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "machine-learning-ai"
      ],
      "weeks": 10,
      "concepts": 41,
      "mcqs": 40,
      "widgets": 10,
      "prerequisites": [
        "Linear algebra: eigenvalues, the singular value decomposition, and what a projection is.",
        "Multivariable calculus: the chain rule in vector form, gradients and Jacobians.",
        "Probability at the level of the program's probability and stochastic processes course: conditional expectation, Markov chains, laws of large numbers.",
        "Python with numpy at a level that lets you write a vectorised loop and debug a shape error without an IDE.",
        "Comfort with ordinary least squares, including its variance and its failure modes."
      ],
      "skills_built": [
        "neural-networks",
        "reinforcement-learning",
        "markov-chains",
        "ridge-regression",
        "optimal-execution",
        "market-impact",
        "hedging",
        "signal-construction",
        "reproducible-research"
      ],
      "skills_assumed": [
        "linear-algebra",
        "conditional-expectation",
        "linear-regression",
        "numpy",
        "measure-theoretic-probability"
      ]
    },
    {
      "code": "FINM 34000",
      "slug": "finm-34000",
      "title": "Probability and Stochastic Processes",
      "instructor": "Greg Lawler",
      "quarter": "September Launch",
      "units": 50,
      "block": "core",
      "tier": "B",
      "concentrations": [],
      "weeks": 5,
      "concepts": 20,
      "mcqs": 20,
      "widgets": 6,
      "prerequisites": [
        "An undergraduate, post-calculus course in probability and/or statistics — this is the prerequisite the public course page states.",
        "Calculus through multivariable integration, and enough linear algebra to multiply matrices, solve a small linear system and read an eigenvector.",
        "Series and limits: geometric sums, comparison tests, and Stirling's approximation are used without ceremony from week 2 onward.",
        "Enough Python to write a loop, index a NumPy array and read a printed table. Every snippet here is short and vectorised; none of them needs a library beyond NumPy and SciPy."
      ],
      "skills_built": [
        "measure-theoretic-probability",
        "conditional-expectation",
        "martingales",
        "markov-chains",
        "random-walk",
        "poisson-process",
        "brownian-motion"
      ],
      "skills_assumed": [
        "linear-algebra",
        "numpy",
        "linear-regression"
      ]
    },
    {
      "code": "FINM 34600",
      "slug": "finm-34600",
      "title": "The Analysis of High Frequency Data",
      "instructor": "Per A. Mykland",
      "quarter": "Winter",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "machine-learning-ai"
      ],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 40,
      "widgets": 10,
      "prerequisites": [
        "FINM 34500, Stochastic Calculus — the public course page states that students are encouraged to take it prior to or concurrently with this course. Ito integrals, quadratic variation and the semimartingale vocabulary are used from week 1 without re-derivation.",
        "A graduate first course in probability: conditional expectation, martingales, characteristic functions, and modes of convergence. Nearly every result in the course is a stable-convergence statement, so 'converges in distribution' has to be a precise idea rather than a slogan.",
        "Mathematical statistics at the level of consistency, bias-variance decomposition, asymptotic normality, delta method and the construction of a confidence interval from an estimated asymptotic variance.",
        "Linear regression in matrix form, including heteroskedasticity-robust standard errors. Weeks 8 and 9 are regressions whose regressors are themselves estimated.",
        "Enough Python to vectorise a simulation over a NumPy array and read a printed table. Every snippet here is short, seeded and uses nothing beyond NumPy, SciPy and pandas."
      ],
      "skills_built": [
        "high-frequency-data",
        "realised-volatility",
        "volatility-clustering",
        "jump-detection",
        "market-microstructure",
        "taq-trades-quotes",
        "covariance-estimation",
        "time-series-alignment",
        "levy-processes",
        "order-book-data"
      ],
      "skills_assumed": [
        "ito-calculus",
        "brownian-motion",
        "martingales",
        "linear-regression",
        "numpy",
        "conditional-expectation"
      ]
    },
    {
      "code": "FINM 34700",
      "slug": "finm-34700",
      "title": "Multivariate Statistical Analysis: Applications and Techniques",
      "instructor": "Jingshu Wang",
      "quarter": "Spring",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "machine-learning-ai"
      ],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 40,
      "widgets": 10,
      "prerequisites": [
        "Linear algebra you can compute with: eigenvalues and eigenvectors of a symmetric matrix, quadratic forms, positive semi-definiteness, and matrix inversion. Every method in this course is, underneath, an operation on the eigenstructure of a covariance matrix.",
        "Probability and statistics through the multivariate normal distribution, moments, and basic estimation: what a mean vector and covariance matrix estimate, and why an estimate has sampling variability.",
        "Ordinary least squares in matrix form. Ridge, lasso, PCA regression and factor models are all variations on a linear model fit by minimising a penalised or transformed sum of squares.",
        "Python with numpy at the level of solving a linear system, computing an eigendecomposition or a Cholesky factor, and writing a simulation loop. pandas for basic data handling.",
        "Comfort reading and writing code that manipulates matrices directly, since several weeks implement a method (coordinate descent, a regression tree, k-means) from its update rule rather than calling a single library function."
      ],
      "skills_built": [
        "pca",
        "factor-models",
        "canonical-correlation",
        "covariance-estimation",
        "ridge-regression",
        "lasso",
        "clustering",
        "decision-trees",
        "random-forests"
      ],
      "skills_assumed": [
        "linear-algebra",
        "linear-regression",
        "numpy",
        "python-pandas",
        "conditional-expectation"
      ]
    },
    {
      "code": "FINM 34800",
      "slug": "finm-34800",
      "title": "Modern Applied Optimization",
      "instructor": "Lek-Heng Lim",
      "quarter": "Autumn",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "machine-learning-ai"
      ],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 40,
      "widgets": 10,
      "prerequisites": [
        "Multivariable calculus: gradients, Jacobians, the chain rule in vector form, and what a Taylor expansion of a scalar function of many variables looks like.",
        "Linear algebra: eigenvalues and eigenvectors, positive definiteness, solving a linear system, and the condition number of a matrix.",
        "Enough probability to read an expectation and a quantile, at the level of the program's probability and stochastic processes course.",
        "Python with numpy: writing a vectorised loop, indexing a matrix, and reading a shape error without an IDE. No prior optimisation background is assumed.",
        "Familiarity with least squares as a fitting procedure is helpful but not required; it is re-derived here as an optimisation problem."
      ],
      "skills_built": [
        "convex-optimization",
        "duality-and-kkt",
        "unconstrained-optimization",
        "constrained-optimization",
        "proximal-methods",
        "robust-optimization",
        "model-calibration",
        "markowitz-optimization",
        "kelly-criterion",
        "lasso",
        "var-es"
      ],
      "skills_assumed": [
        "linear-algebra",
        "numpy",
        "linear-regression",
        "logistic-regression",
        "mean-variance",
        "covariance-estimation"
      ]
    },
    {
      "code": "FINM 35100",
      "slug": "finm-35100",
      "title": "Information, Trading, and the Structure of Markets",
      "instructor": "Ayan Bhattacharya",
      "quarter": "Spring",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "trading"
      ],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 40,
      "widgets": 10,
      "prerequisites": [
        "Probability at the level of conditional expectation as an object rather than a formula: you should be able to compute E[V | order was a buy] on a finite space without hesitating, because weeks 5 and 6 are almost nothing else.",
        "Undergraduate microeconomics or decision theory: preferences, indifference, expected utility, and the idea that a model's prediction is an equilibrium rather than a forecast. Week 1 rebuilds the axioms, but it moves fast.",
        "Linear regression, including what an omitted variable does to a slope. Weeks 6 and 8 recover structural parameters from regressions, and the whole difficulty is whether the regressor is the equilibrium object you think it is.",
        "Linear algebra: matrix multiplication, rank, and eigen-decomposition. An information structure is a stochastic matrix and the Blackwell order in week 3 is a statement about factoring one matrix through another.",
        "Enough Python to read a vectorised NumPy snippet and a short scikit-learn or statsmodels call. Nothing here needs more than that, but the arithmetic matters: most of the arguments in this course are settled by a number."
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
      ]
    },
    {
      "code": "FINM 36700",
      "slug": "finm-36700",
      "title": "Portfolio and Risk Management",
      "instructor": "Mark Hendricks",
      "quarter": "Autumn",
      "units": 100,
      "block": "core",
      "tier": "B",
      "concentrations": [],
      "weeks": 10,
      "concepts": 40,
      "mcqs": 40,
      "widgets": 10,
      "prerequisites": [
        "Linear algebra you can compute with: quadratic forms, inverses, eigenvalues of a symmetric matrix, and what a projection is. Almost every result in the course is a statement about a quadratic form in a covariance matrix.",
        "Probability through conditional expectation, plus the sampling distributions of a mean and a variance. Estimation error is the subject of weeks 3, 4 and 7, not a caveat at the end of them.",
        "Ordinary least squares in matrix form, including standard errors and what an intercept means. The CAPM, factor attribution, hedging and return forecasting are all one regression each.",
        "Python with numpy at the level of solving a linear system, taking a Cholesky factor and running a simulation loop without an IDE. pandas for aligning and resampling real return series.",
        "Basic finance vocabulary: excess return, risk-free rate, long and short, notional, leverage."
      ],
      "skills_built": [
        "mean-variance",
        "efficient-frontier",
        "markowitz-optimization",
        "portfolio-construction",
        "sharpe-ratio",
        "factor-models",
        "covariance-estimation",
        "var-es",
        "tail-risk",
        "drawdown",
        "hedging",
        "carry-trade"
      ],
      "skills_assumed": [
        "linear-algebra",
        "linear-regression",
        "numpy",
        "python-pandas",
        "conditional-expectation"
      ]
    },
    {
      "code": "FINM 37000",
      "slug": "finm-37000",
      "title": "Futures and Related Derivatives",
      "instructor": "Eric Patterson",
      "quarter": "Autumn",
      "units": 50,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "options-derivatives"
      ],
      "weeks": 5,
      "concepts": 20,
      "mcqs": 20,
      "widgets": 5,
      "prerequisites": [
        "Probability through conditional expectation and the basics of Brownian motion; the material in the program's probability and stochastic processes course is assumed.",
        "Linear algebra to the level of eigen-decomposition and least squares, because the curve work in week 5 is principal components and the hedging work in week 3 is a regression.",
        "Enough Python to load a panel of prices into NumPy or pandas, write a loop over contracts, and read a traceback without help.",
        "Familiarity with the Black–Scholes formula. The course rebuilds it in futures form, but it does not re-derive it from scratch."
      ],
      "skills_built": [
        "futures-markets",
        "cost-of-carry",
        "hedging",
        "margin-and-leverage",
        "carry-trade",
        "spread-trades",
        "black-76",
        "greeks",
        "implied-volatility",
        "monte-carlo-pricing",
        "pca",
        "convexity-adjustment"
      ],
      "skills_assumed": [
        "risk-neutral-pricing",
        "brownian-motion",
        "linear-algebra",
        "linear-regression",
        "numpy",
        "python-pandas"
      ]
    },
    {
      "code": "FINM 37301",
      "slug": "finm-37301",
      "title": "Foreign Exchange: Markets, Products & Pricing",
      "instructor": "Anthony Capozzoli",
      "quarter": "Spring",
      "units": 50,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "rates-credit"
      ],
      "weeks": 5,
      "concepts": 20,
      "mcqs": 20,
      "widgets": 5,
      "prerequisites": [
        "FINM 33000 (Options) or equivalent exposure to Black-Scholes and risk-neutral pricing -- Garman-Kohlhagen is presented as a two-rate variant of it from week 3 onward.",
        "Comfort with present value and discounting well enough to read a term structure of discount factors without translation.",
        "Enough Python and NumPy to read a vectorised Monte Carlo loop and a small root-solve; every snippet in this course is short and needs nothing beyond NumPy and SciPy.",
        "Basic probability and regression, for the empirical work in week 4 and week 5."
      ],
      "skills_built": [
        "fx-markets",
        "cost-of-carry",
        "volatility-smile",
        "greeks",
        "monte-carlo-pricing",
        "carry-trade",
        "hedging"
      ],
      "skills_assumed": [
        "black-scholes-pde",
        "risk-neutral-pricing",
        "yield-curve",
        "numpy"
      ]
    },
    {
      "code": "FINM 37400",
      "slug": "finm-37400",
      "title": "Fixed Income",
      "instructor": "Mark Hendricks",
      "quarter": "Winter",
      "units": 50,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "rates-credit"
      ],
      "weeks": 5,
      "concepts": 20,
      "mcqs": 19,
      "widgets": 6,
      "prerequisites": [
        "Calculus and linear algebra: you will differentiate a discounted cash flow sum by hand and solve small linear systems for hedge ratios.",
        "Probability through conditional expectation and the idea of a martingale; the Expectations Hypothesis week is an argument about conditional expectations.",
        "Comfort with least squares, including reading a regression coefficient and its standard error.",
        "Python with numpy: every idea in the course is three lines of array arithmetic once you know which array you want."
      ],
      "skills_built": [
        "yield-curve",
        "duration-convexity",
        "interest-rate-risk",
        "hedging",
        "carry-trade",
        "pca",
        "spread-trades",
        "factor-models",
        "linear-regression"
      ],
      "skills_assumed": [
        "linear-algebra",
        "numpy",
        "conditional-expectation",
        "risk-neutral-pricing"
      ]
    },
    {
      "code": "FINM 37500",
      "slug": "finm-37500",
      "title": "Fixed Income Derivatives",
      "instructor": "Mark Hendricks",
      "quarter": "Winter",
      "units": 50,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "options-derivatives"
      ],
      "weeks": 5,
      "concepts": 20,
      "mcqs": 20,
      "widgets": 5,
      "prerequisites": [
        "FINM 37400 (Fixed Income) or equivalent: bootstrapping a discount curve, discount factors, forward rates, duration and DV01, and the annuity factor as a swap's fixed-leg present value per unit of rate.",
        "Risk-neutral pricing and change of numeraire at the level of a first derivatives course: why a discounted price process is a martingale under the pricing measure, and that different measures can price the same payoff identically.",
        "The Black-Scholes formula and its Greeks. This course does not re-derive Black-Scholes; it repackages it as Black-76 and asks what changes when the underlying is a forward or a swap rate instead of a stock.",
        "Enough Python and NumPy to bootstrap a small curve, implement a closed-form option formula, and read a table of numbers without a plotting library doing the thinking."
      ],
      "skills_built": [
        "black-76",
        "swaptions",
        "convexity-adjustment",
        "interest-rate-trees",
        "change-of-numeraire",
        "yield-curve",
        "greeks",
        "implied-volatility",
        "volatility-smile"
      ],
      "skills_assumed": [
        "risk-neutral-pricing",
        "duration-convexity",
        "conditional-expectation",
        "black-scholes-pde",
        "numpy",
        "linear-algebra"
      ]
    },
    {
      "code": "FINM 37601",
      "slug": "finm-37601",
      "title": "Mathematical Market Microstructure: An Optimized Approach",
      "instructor": "Hongsong Chou",
      "quarter": "Autumn",
      "units": 100,
      "block": "electives",
      "tier": "B",
      "concentrations": [
        "trading"
      ],
      "weeks": 5,
      "concepts": 20,
      "mcqs": 20,
      "widgets": 5,
      "prerequisites": [
        "Stochastic calculus at the level of Itō integration, the Itō formula and a linear stochastic differential equation. Weeks 6 to 8 write and solve Hamilton–Jacobi–Bellman equations, and the algebra only reads as algebra if the calculus behind it is familiar.",
        "Dynamic programming and the discrete Bellman recursion. Almost every control problem here is first solved backwards on a grid and only then in closed form.",
        "Linear regression, including the interpretation of a slope as a conditional expectation and of a t-statistic as evidence. Order-flow-imbalance and impact calibration are regressions with market-specific pathologies.",
        "Poisson processes and continuous-time Markov chains: intensities, competing exponential clocks, and first-passage probabilities. The order book in week 2 is a birth–death chain and nothing more.",
        "Enough Python to vectorise a simulation with NumPy and reshape a table with pandas. Every snippet here is short, seeded and library-light."
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
      ]
    }
  ]
};
