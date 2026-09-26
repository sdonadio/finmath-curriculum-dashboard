/* ════════════════════════════════════════════════════════════════════════
   tools/demo_course.js — "FINM 00000 · Demo Course"

   THE SHELL'S OWN TEST FIXTURE. It is not a real course and must never be
   published: it lives under tools/, not under courses/.

   It exists so the three checks can run against something before (and after)
   the 29 real course files exist:
       python3 tools/validate.py                 → must PASS
       python3 tools/run_snippets.py             → must run every snippet
       python3 tools/stubs.py --install && python3 tools/sweep.py
                                                 → must report 0 errors

   It therefore exercises EVERY field in SCHEMA.md and EVERY one of the 13
   widget types, once each. Five weeks (the schema's half-quarter shape) keeps
   the fixture small; the 13 widgets are spread across them, which is why some
   weeks carry an ARRAY of widgets — see the note in README.md under
   "Ambiguities resolved". A real course uses the single-object form.

   The prose is deliberately generic quantitative finance: it has to read like
   a course page so the CSS and the print stylesheet get an honest test, but
   nothing in it is attributed to any institution's syllabus.
   ════════════════════════════════════════════════════════════════════════ */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 00000"] = {
  code: "FINM 00000",
  slug: "finm-00000",
  title: "Demo Course",
  instructor: "The dashboard",
  quarter: "Autumn",
  units: 50,
  block: "electives",
  concentrations: ["options-derivatives", "financial-computing"],
  source: {
    page_url: "https://example.edu/courses/finm-00000",
    syllabus_url: "https://example.edu/courses/finm-00000/syllabus.pdf",
    fetched: "2026-09-26"
  },
  tier: "B",
  description: "A fixture course, not a real one. It walks the same ground every quantitative " +
    "finance sequence walks — a payoff, a discounted expectation, a simulated path, a fitted line, " +
    "a portfolio and an order book — purely so that every field of the course schema and every " +
    "widget in the widget menu is rendered at least once on a real page. If you are a student and " +
    "you have landed here, you want the programme map instead.",

  prerequisites: [
    "Multivariable calculus and linear algebra at the level of a first undergraduate sequence.",
    "Probability through conditional expectation; FINM 33000 assumes the same.",
    "Comfort writing and debugging a hundred lines of Python without an IDE holding your hand."
  ],
  textbooks: [
    { title: "Options, Futures, and Other Derivatives", author: "John C. Hull",
      note: "Reference for the payoff and binomial chapters; any recent edition." },
    { title: "Statistics and Data Analysis for Financial Engineering", author: "David Ruppert and David Matteson",
      note: "The regression and tail-risk material." },
    { title: "Numerical Recipes", author: "Press, Teukolsky, Vetterling and Flannery",
      note: "Consulted, never copied: read it for what can go wrong numerically." }
  ],

  /* Every tag below is one data/skills_seed.js already defines. That is the
     rule SCHEMA.md states and tools/build_skills.py enforces: prefer an
     existing tag over a new one, and a tag only one course uses has to be
     seeded on purpose. */
  skills_built: ["risk-neutral-pricing", "binomial-model", "monte-carlo-pricing",
                 "linear-regression", "mean-variance", "efficient-frontier",
                 "market-microstructure", "transaction-costs", "reproducible-research"],
  skills_assumed: ["measure-theoretic-probability", "conditional-expectation",
                   "linear-algebra", "numpy"],

  brushup: [
    { topic: "Conditional expectation as a projection",
      why: "Every pricing argument in weeks 1 and 2 is a conditional expectation under a measure you chose on purpose. If the tower property is not automatic, the algebra will look like magic.",
      resource: "Williams, Probability with Martingales, chapter 9" },
    { topic: "Solving a small linear system by hand",
      why: "The regression and portfolio weeks both reduce to solving A x = b for a 2x2 or 3x3 A. Doing one by hand once makes the numerical failures legible later.",
      resource: "Strang, Introduction to Linear Algebra, chapter 2" },
    { topic: "NumPy broadcasting rules",
      why: "Half the bugs in a first Monte Carlo are a (1000,) array silently broadcasting against a (1000,1) one and producing a 1000x1000 answer.",
      resource: "The NumPy user guide, 'Broadcasting'" },
    { topic: "Floating point is not the reals",
      why: "Week 3's variance calculation and week 4's covariance inverse both go wrong in ways that only make sense once you accept that subtraction loses digits.",
      resource: "Goldberg, 'What Every Computer Scientist Should Know About Floating-Point Arithmetic'" },
    { topic: "Reading a payoff diagram",
      why: "Week 1 opens with one and never draws it again; the rest of the quarter assumes you can sketch a spread from its legs.",
      resource: "Hull, chapter 12" }
  ],

  weeks: [
    /* ══════════ WEEK 1 ══════════ */
    { n: 1,
      title: "Payoffs, replication and the first tree",
      topics: ["payoff diagrams", "put-call parity", "one-period replication", "risk-neutral probability"],
      concepts: [
        { name: "A derivative is a function of a future price",
          explain: "<p>Everything in the quarter starts from one sentence: a European derivative is a " +
            "deterministic function of the underlying's price at a single future date. Call it " +
            "<code>f(S_T)</code>. A call is <code>max(S_T - K, 0)</code>, a put is " +
            "<code>max(K - S_T, 0)</code>, a forward is <code>S_T - K</code>, and a zero-coupon bond " +
            "is the constant function. Every structured product you will meet is a linear combination " +
            "of these four shapes, which is why the payoff diagram is worth drawing before any " +
            "algebra happens.</p><p>The reason this framing is useful is that linearity survives " +
            "pricing. If a portfolio's payoff is a sum of payoffs, its price is the same sum of " +
            "prices — otherwise you could buy the cheap side, sell the dear side, and hold a position " +
            "that cannot lose. That single no-arbitrage step is doing all the work in put-call " +
            "parity, and it is doing all the work again when we price by replication next week.</p>",
          formula: "C(K) - P(K) = S_0 - K e^{-rT}",
          code: { lang: "python", src:
            "def call(S, K): return max(S - K, 0.0)\n" +
            "def put(S, K):  return max(K - S, 0.0)\n" +
            "\n" +
            "K = 100.0\n" +
            "for S in (80.0, 100.0, 120.0):\n" +
            "    lhs = call(S, K) - put(S, K)\n" +
            "    print(f\"S_T={S:6.1f}  C-P={lhs:+7.2f}  S_T-K={S-K:+7.2f}\")\n",
            output: "S_T=  80.0  C-P= -20.00  S_T-K= -20.00\nS_T= 100.0  C-P=  +0.00  S_T-K=  +0.00\nS_T= 120.0  C-P= +20.00  S_T-K= +20.00" } },
        { name: "One period, two states, one price",
          explain: "<p>Collapse the world to a single period and two possible prices, <code>S_0 u</code> " +
            "and <code>S_0 d</code>. Any payoff is then two numbers, and any portfolio of the stock " +
            "and a bond is two numbers too. Two equations, two unknowns: there is exactly one holding " +
            "of stock and bond that reproduces the derivative in both states, and no-arbitrage forces " +
            "the derivative's price to equal the cost of that holding.</p><p>Rearranged, that price " +
            "is a discounted expectation under a probability <code>p* = (e^{rT} - d) / (u - d)</code> " +
            "that has nothing to do with what you believe. It is not a forecast; it is the number " +
            "that makes the discounted stock a martingale. Students lose weeks to the idea that " +
            "<code>p*</code> is someone's opinion about the future. It is an artefact of the " +
            "replication algebra, and treating it as anything else will mislead you in week 2. " +
            "Notice also what the two equations did not need: no distribution, no volatility parameter, no utility function. Two states and two tradable instruments are enough, and that minimalism is why the argument survives into continuous time essentially unchanged.</p>",
          formula: "V_0 = e^{-rT}\\left[p^* V_u + (1-p^*) V_d\\right], \\quad p^* = \\frac{e^{rT}-d}{u-d}",
          code: { lang: "python", src:
            "import math\n" +
            "S0, u, d, r, T, K = 100.0, 1.2, 0.8, 0.05, 1.0, 100.0\n" +
            "Vu, Vd = max(S0*u - K, 0), max(S0*d - K, 0)\n" +
            "delta = (Vu - Vd) / (S0*u - S0*d)\n" +
            "bond  = math.exp(-r*T) * (Vu - delta*S0*u)\n" +
            "pstar = (math.exp(r*T) - d) / (u - d)\n" +
            "print(f\"delta   = {delta:.4f}\")\n" +
            "print(f\"bond    = {bond:.4f}\")\n" +
            "print(f\"replic. = {delta*S0 + bond:.4f}\")\n" +
            "print(f\"p*      = {pstar:.4f}\")\n" +
            "print(f\"E-price = {math.exp(-r*T)*(pstar*Vu + (1-pstar)*Vd):.4f}\")\n",
            output: "delta   = 0.5000\nbond    = -38.0492\nreplic. = 11.9508\np*      = 0.6282\nE-price = 11.9508" } },
        { name: "Stacking periods into a lattice",
          explain: "<p>Nothing about the one-period argument used the fact that there was one period. " +
            "Stack n of them with the same u and d and the tree recombines: an up-then-down move " +
            "lands exactly where a down-then-up move does, so after n steps there are n+1 nodes " +
            "rather than 2^n. That is the whole reason the binomial model is computable.</p>" +
            "<p>Price it backwards. Fill the terminal layer with the payoff, then walk left, " +
            "replacing each node by the discounted risk-neutral average of its two children. The " +
            "delta at the root falls out of the first step for free, which is the practical reason " +
            "desks kept using lattices long after closed forms existed: you get the hedge and the " +
            "price from the same sweep, and early exercise is one extra <code>max</code>. " +
            "Convergence is the one wrinkle. The binomial price oscillates around the continuous limit as n grows, because the strike sits between two terminal nodes in a position that shifts with every step count. Doubling n does not halve the error monotonically, which is why production code averages adjacent step counts or pins a node to the strike.</p>",
          code: { lang: "python", src:
            "import math\n" +
            "def binom(S0, K, r, T, sigma, n, kind='call', american=False):\n" +
            "    dt = T / n\n" +
            "    u = math.exp(sigma * math.sqrt(dt)); d = 1 / u\n" +
            "    p = (math.exp(r * dt) - d) / (u - d); disc = math.exp(-r * dt)\n" +
            "    S = [S0 * u**j * d**(n - j) for j in range(n + 1)]\n" +
            "    V = [max(s - K, 0) if kind == 'call' else max(K - s, 0) for s in S]\n" +
            "    for i in range(n - 1, -1, -1):\n" +
            "        for j in range(i + 1):\n" +
            "            V[j] = disc * (p * V[j + 1] + (1 - p) * V[j])\n" +
            "            if american:\n" +
            "                s = S0 * u**j * d**(i - j)\n" +
            "                V[j] = max(V[j], (s - K) if kind == 'call' else (K - s))\n" +
            "    return V[0]\n" +
            "\n" +
            "for n in (1, 2, 8, 64, 512):\n" +
            "    print(f\"n={n:4d}  euro put = {binom(100,100,.05,1,.2,n,'put'):.5f}\"\n" +
            "          f\"   amer put = {binom(100,100,.05,1,.2,n,'put',True):.5f}\")\n",
            output: "n=   1  euro put = 7.28523   amer put = 7.28523\nn=   2  euro put = 4.66344   amer put = 5.73765\nn=   8  euro put = 5.32804   amer put = 5.97350\nn=  64  euro put = 5.54234   amer put = 6.07753\nn= 512  euro put = 5.56962   amer put = 6.08885" } }
      ],
      widget: [
        { type: "payoff", title: "A collar, leg by leg",
          params: { legs: [{ kind: "stock", qty: 1, strike: 0, premium: 100 },
                           { kind: "put", qty: 1, strike: 90, premium: 3.2 },
                           { kind: "call", qty: -1, strike: 115, premium: 2.1 }],
                    range: [60, 150] } },
        { type: "binomial-tree", title: "The lattice, and what changes when you add steps",
          params: { S0: 100, u: 1.15, d: 0.87, r: 0.05, steps: 4, K: 100, kind: "call" } },
        { type: "curve", title: "Intrinsic value against time value",
          params: { xlab: "Spot", ylab: "Value",
                    series: [{ name: "Intrinsic", x: [60, 80, 100, 120, 140], y: [0, 0, 0, 20, 40] },
                             { name: "3 months", x: [60, 80, 100, 120, 140], y: [0.1, 1.4, 8.4, 22.6, 41.2] },
                             { name: "1 year", x: [60, 80, 100, 120, 140], y: [1.2, 5.6, 16.7, 32.4, 50.1] }],
                    log: false } }
      ],
      pitfalls: [
        "Reading p* as a forecast. It is the probability that makes the discounted stock a martingale, and it moves when the interest rate moves even though nobody's view of the stock changed.",
        "Forgetting that put-call parity is an identity between prices, not an approximation: if it fails in your data, your data has a dividend, a borrow cost or a stale quote in it, not an arbitrage.",
        "Setting d different from 1/u and then being surprised the tree stops recombining cleanly at the parameters you chose."
      ],
      check: [
        { q: "In the one-period model, the risk-neutral probability p* rises. Which of these could have caused it?",
          options: ["The interest rate rose", "Investors became more optimistic about the stock",
                    "The option's strike fell", "Realised volatility over the last month rose"],
          answer: 0,
          why: "p* = (e^{rT} - d)/(u - d) contains r, u and d and nothing else. A higher r raises the numerator and so raises p*. Optimism does not appear in the formula at all — that is the whole point of the construction. The strike belongs to the payoff, not to the measure, and last month's realised volatility is not u or d unless you chose to calibrate them to it." },
        { q: "You price a European put on a 512-step tree and get 5.57; the American put on the same tree gives 6.09. What is the 0.52 difference?",
          options: ["Numerical error that vanishes as n grows", "The value of being able to exercise early",
                    "The dividend yield", "The bid-ask spread"],
          answer: 1,
          why: "Both numbers come from the same lattice with the same discretisation, so the difference is not numerical — it is the extra max() applied at every node, which is exactly the early-exercise premium. For an American put on a non-dividend-paying stock that premium is strictly positive, because deep in the money the interest earned on the strike received today beats waiting." },
        { q: "Put-call parity holds exactly in your model but fails by 40 cents in market quotes. The most likely explanation is:",
          options: ["An arbitrage you should trade immediately", "One of the two quotes is stale or you are mixing bid with ask",
                    "The Black-Scholes model is wrong", "Interest rates are stochastic"],
          answer: 1,
          why: "Parity is model-free: it follows from replication, not from Black-Scholes, so 'the model is wrong' cannot break it. Before believing you have found an arbitrage in a quoted market, check that both legs are the same timestamp and the same side of the spread. Stochastic rates matter for the discount factor but not at the 40-cent scale on a short-dated option." }
      ]
    },

    /* ══════════ WEEK 2 ══════════ */
    { n: 2,
      title: "Continuous time, simulation and the shape of the answer",
      topics: ["geometric Brownian motion", "Euler discretisation", "Monte Carlo standard error", "sensitivity by sliders"],
      concepts: [
        { name: "Geometric Brownian motion in one line",
          explain: "<p>The continuous-time limit of the lattice is geometric Brownian motion: " +
            "<code>dS = mu S dt + sigma S dW</code>. What matters computationally is that the " +
            "solution is known in closed form, so you never need to discretise the SDE to simulate " +
            "the terminal price — you sample the exact lognormal. Discretising anyway is the most " +
            "common unforced error in a first Monte Carlo.</p><p>The <code>-sigma^2/2</code> in the " +
            "exponent is not a correction factor bolted on; it is Ito's lemma telling you that the " +
            "log of a process with drift mu drifts at mu minus half the variance. Drop it and your " +
            "simulated stock has the wrong mean by a factor that grows with horizon, which will show " +
            "up as a pricing bias you will spend an afternoon chasing. " +
            "The same closed form is what lets you check the simulator: the mean of the simulated terminal price must match the forward to within a few standard errors, and if it does not, the bug is in the exponent before it is anywhere else. Discretise only when the payoff genuinely depends on the path, and then worry separately about the discretisation bias you have just introduced.</p>",
          formula: "S_T = S_0 \\exp\\!\\left[(\\mu - \\tfrac{1}{2}\\sigma^2)T + \\sigma\\sqrt{T}\\,Z\\right]",
          code: { lang: "python", src:
            "import math, random\n" +
            "random.seed(7)\n" +
            "S0, mu, sigma, T, n = 100.0, 0.07, 0.2, 1.0, 200000\n" +
            "draws = [S0 * math.exp((mu - 0.5*sigma**2)*T + sigma*math.sqrt(T)*random.gauss(0,1))\n" +
            "         for _ in range(n)]\n" +
            "mean = sum(draws)/n\n" +
            "print(f\"simulated E[S_T] = {mean:.4f}\")\n" +
            "print(f\"theory    E[S_T] = {S0*math.exp(mu*T):.4f}\")\n" +
            "print(f\"relative error   = {mean/(S0*math.exp(mu*T)) - 1:+.5f}\")\n",
            output: "simulated E[S_T] = 107.3180\ntheory    E[S_T] = 107.2508\nrelative error   = +0.00063" } },
        { name: "The error shrinks like one over root n",
          explain: "<p>A Monte Carlo price is a sample mean, so its standard error is the sample " +
            "standard deviation over the square root of the number of paths. That is the single most " +
            "important fact about the method and the reason it is both indispensable and " +
            "frustrating: to halve the error you must quadruple the work, and no amount of cleverness " +
            "in the random number generator changes the exponent.</p><p>Report the standard error " +
            "next to every simulated number you ever publish. A price of 10.4501 quoted to four " +
            "decimals with a standard error of 0.03 is a lie told in good faith, and a grader — or " +
            "a risk manager — will treat it as one. The antithetic trick below is the cheapest " +
            "variance reduction that exists: it costs one line and typically buys a factor of two " +
            "to four on a smooth payoff. " +
            "It is not free of conditions, though: the payoff has to be reasonably monotone in the driving normal for the pairing to induce the negative correlation the trick depends on, which is why it helps a call far more than it helps a deep out-of-the-money digital.</p>",
          formula: "\\mathrm{se} = \\frac{\\hat\\sigma}{\\sqrt{n}}, \\qquad \\text{halving it costs } 4\\times \\text{ the paths}",
          code: { lang: "python", src:
            "import math, random\n" +
            "def mc_call(n, anti=False, seed=11):\n" +
            "    rng = random.Random(seed)\n" +
            "    S0, K, r, sig, T = 100., 100., .05, .2, 1.\n" +
            "    vals = []\n" +
            "    for _ in range(n // (2 if anti else 1)):\n" +
            "        z = rng.gauss(0, 1)\n" +
            "        zs = (z, -z) if anti else (z,)\n" +
            "        for zz in zs:\n" +
            "            S = S0*math.exp((r-.5*sig*sig)*T + sig*math.sqrt(T)*zz)\n" +
            "            vals.append(math.exp(-r*T)*max(S-K, 0))\n" +
            "    m = sum(vals)/len(vals)\n" +
            "    v = sum((x-m)**2 for x in vals)/(len(vals)-1)\n" +
            "    return m, math.sqrt(v/len(vals))\n" +
            "\n" +
            "for n in (1000, 10000, 100000):\n" +
            "    m, se = mc_call(n)\n" +
            "    ma, sea = mc_call(n, anti=True)\n" +
            "    print(f\"n={n:7d}  plain {m:7.4f} +/- {se:.4f}   antithetic {ma:7.4f} +/- {sea:.4f}\")\n",
            output: "n=   1000  plain 10.8397 +/- 0.5001   antithetic 10.5940 +/- 0.4777\nn=  10000  plain 10.6564 +/- 0.1486   antithetic 10.4437 +/- 0.1472\nn= 100000  plain 10.4890 +/- 0.0463   antithetic 10.4277 +/- 0.0464" } },
        { name: "Mean reversion is a different animal",
          explain: "<p>Not everything is a random walk. A spread, a yield, a log-volatility and an " +
            "inventory all pull back toward a level, and the Ornstein-Uhlenbeck process is the " +
            "simplest thing that does: <code>dX = theta(m - X)dt + sigma dW</code>. Its stationary " +
            "distribution is normal with variance <code>sigma^2/(2 theta)</code>, and its " +
            "half-life of a shock is <code>ln 2 / theta</code>, which is the number a trading desk " +
            "actually cares about.</p><p>The practical warning: fitting theta from a short sample " +
            "is badly biased toward finding mean reversion that is not there. A pure random walk " +
            "of 250 daily observations will produce an apparently significant negative " +
            "autocorrelation often enough that you must test it, not eyeball it. Week 3's " +
            "regression machinery is what you will use to do so. " +
            "The finite-sample bias in the estimator means the ordinary t-distribution is the wrong reference here. Sampling more finely helps less than you expect, too: observations far closer together than the half-life are nearly perfectly correlated, so a million ticks of a two-day process carry little more information about theta than a few hundred daily closes do.</p>",
          code: { lang: "python", src:
            "import math, random\n" +
            "random.seed(3)\n" +
            "theta, m, sigma, dt, n = 2.0, 0.0, 0.30, 1/252, 252*20\n" +
            "x, xs = 1.0, []\n" +
            "for _ in range(n):\n" +
            "    x += theta*(m - x)*dt + sigma*math.sqrt(dt)*random.gauss(0, 1)\n" +
            "    xs.append(x)\n" +
            "mu_hat = sum(xs)/len(xs)\n" +
            "var_hat = sum((v-mu_hat)**2 for v in xs)/(len(xs)-1)\n" +
            "print(f\"half-life of a shock = {math.log(2)/theta*252:.1f} trading days\")\n" +
            "print(f\"stationary sd  theory = {sigma/math.sqrt(2*theta):.4f}\")\n" +
            "print(f\"stationary sd  sample = {math.sqrt(var_hat):.4f}\")\n",
            output: "half-life of a shock = 87.3 trading days\nstationary sd  theory = 0.1500\nstationary sd  sample = 0.1632" } }
      ],
      widget: [
        { type: "simulate-paths", title: "Twenty paths, one terminal distribution",
          params: { model: "gbm", params: { s0: 100, mu: 0.07, sigma: 0.2 },
                    n_paths: 20, seed: 4242, horizon: 252 } },
        { type: "histogram", title: "Where the tail risk actually lives",
          params: { sampler: "t", params: { df: 4 }, bins: 40, overlay: true, seed: 991 } },
        { type: "slider-formula", title: "Black-Scholes, one slider at a time",
          params: { formula: "C = S_0 N(d_1) - K e^{-rT} N(d_2)",
                    inputs: [{ name: "S", label: "Spot", min: 50, max: 150, step: 1, init: 100 },
                             { name: "K", label: "Strike", min: 50, max: 150, step: 1, init: 100 },
                             { name: "sigma", label: "Volatility", min: 0.05, max: 0.8, step: 0.01, init: 0.2 },
                             { name: "T", label: "Years", min: 0.05, max: 3, step: 0.05, init: 1 },
                             { name: "r", label: "Rate", min: 0, max: 0.1, step: 0.005, init: 0.05 }],
                    compute: [
                      { name: "d1", label: "d1", expr: "(ln(S/K) + (r + sigma^2/2)*T) / (sigma*sqrt(T))", fmt: "4" },
                      { name: "d2", label: "d2", expr: "d1 - sigma*sqrt(T)", fmt: "4" },
                      { name: "price", label: "Call price", expr: "S*ncdf(d1) - K*exp(-r*T)*ncdf(d2)", fmt: "4" }] } }
      ],
      pitfalls: [
        "Discretising the SDE to get a terminal price when the exact lognormal draw is available; you introduce a bias you did not need and then blame the payoff.",
        "Quoting a simulated price to more decimals than the standard error supports.",
        "Reusing the same seed for the base case and the bumped case when computing a Greek by finite difference — or, worse, NOT reusing it, which makes the difference pure noise."
      ],
      check: [
        { q: "Your Monte Carlo call price has a standard error of 0.04 with 10,000 paths. Roughly how many paths do you need for a standard error of 0.01?",
          options: ["40,000", "160,000", "20,000", "1,000,000"],
          answer: 1,
          why: "Standard error falls like 1/sqrt(n), so cutting it by a factor of four needs sixteen times the paths: 10,000 x 16 = 160,000. The temptation is to answer 40,000 by scaling linearly, which is exactly the intuition the square root is there to break." },
        { q: "You drop the -sigma^2/2 term from the exponent when simulating S_T. What happens to the simulated mean of S_T?",
          options: ["Nothing, it is a second-order term", "It is too low by exp(-sigma^2 T/2)",
                    "It is too high by exp(sigma^2 T/2)", "It becomes infinite"],
          answer: 2,
          why: "E[exp(sigma sqrt(T) Z)] = exp(sigma^2 T / 2), not 1. The -sigma^2/2 drift adjustment exists precisely to cancel that, so removing it multiplies the mean by exp(sigma^2 T / 2). At sigma = 0.2 and T = 1 that is a 2% bias — small enough to miss and large enough to ruin a price." },
        { q: "Antithetic variates halve your standard error on a European call but barely help on a deep out-of-the-money digital. Why?",
          options: ["Digitals need more paths by definition", "The payoff is nearly flat, so the negative correlation antithetics induce is destroyed by the indicator function",
                    "The random number generator is biased", "Antithetics only work under the physical measure"],
          answer: 1,
          why: "Antithetic variates work by inducing negative correlation between paired payoffs. That requires the payoff to be monotone and reasonably smooth in the driving normal. A deep OTM digital is zero for almost every pair and one for almost none, so the pairing contributes almost nothing and the variance reduction collapses." },
        { q: "Fitting an OU process to 250 daily observations of a true random walk, you find theta = 1.8 with a t-statistic of 2.4. The right conclusion is:",
          options: ["The series mean-reverts with a half-life of about 95 days", "Small-sample bias pushes theta away from zero, so this t-statistic is not evidence at face value",
                    "The sample is too short to estimate anything", "theta is significant, so trade it"],
          answer: 1,
          why: "The OLS estimator of a mean-reversion coefficient is biased in finite samples in exactly this direction — the same Dickey-Fuller problem that makes unit-root testing its own literature. The conventional t-distribution is the wrong reference distribution here, so a t of 2.4 does not mean what it would in a well-behaved regression." }
      ]
    },

    /* ══════════ WEEK 3 ══════════ */
    { n: 3,
      title: "Fitting a line, and the market that quotes it",
      topics: ["ordinary least squares", "R-squared and its abuses", "covariance surfaces", "the limit order book"],
      concepts: [
        { name: "OLS is a projection, not an algorithm",
          explain: "<p>Least squares chooses the coefficient vector whose fitted values are the " +
            "orthogonal projection of y onto the column space of X. Everything else about OLS — the " +
            "normal equations, the residuals summing to zero when there is an intercept, the " +
            "decomposition of variance — is a restatement of that geometry.</p><p>Once you see it " +
            "as a projection, the failure modes stop being surprising. Collinear columns mean the " +
            "space you are projecting onto is nearly degenerate, so the coefficients swing wildly " +
            "while the fitted values barely move. An outlier with high leverage tilts the plane " +
            "because the projection minimises squared distance and a squared distance of ten is a " +
            "hundred times a squared distance of one. Neither is a bug; both are the objective " +
            "doing exactly what you asked. " +
            "The geometry also tells you what the standard error means. It is the length of the residual vector shared out among the directions of the regressor space, so a regressor with little variation of its own gets a large standard error however long the sample is: more rows do not help if the new rows all look like the old ones.</p>",
          formula: "\\hat\\beta = (X^\\top X)^{-1} X^\\top y, \\qquad \\mathrm{Var}(\\hat\\beta) = \\sigma^2 (X^\\top X)^{-1}",
          code: { lang: "python", src:
            "import math, random\n" +
            "rng = random.Random(21)\n" +
            "n, beta_true, noise = 200, 1.4, 2.0\n" +
            "xs = [rng.gauss(0, 1) for _ in range(n)]\n" +
            "ys = [beta_true*x + rng.gauss(0, noise) for x in xs]\n" +
            "mx, my = sum(xs)/n, sum(ys)/n\n" +
            "sxy = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n" +
            "sxx = sum((x-mx)**2 for x in xs)\n" +
            "b = sxy/sxx; a = my - b*mx\n" +
            "resid = [y - (a + b*x) for x, y in zip(xs, ys)]\n" +
            "s2 = sum(e*e for e in resid)/(n-2)\n" +
            "se = math.sqrt(s2/sxx)\n" +
            "sst = sum((y-my)**2 for y in ys)\n" +
            "print(f\"beta_hat = {b:.4f}  (true {beta_true})\")\n" +
            "print(f\"se       = {se:.4f}   t = {b/se:.2f}\")\n" +
            "print(f\"R^2      = {1 - sum(e*e for e in resid)/sst:.4f}\")\n",
            output: "beta_hat = 1.3479  (true 1.4)\nse       = 0.1367   t = 9.86\nR^2      = 0.3294" } },
        { name: "A covariance matrix is a surface you can look at",
          explain: "<p>With more than three assets, the covariance matrix stops being readable as " +
            "numbers and starts being readable as a picture. A heatmap of correlations shows block " +
            "structure — sectors, regions, duration buckets — immediately, and shows the two things " +
            "that break portfolio optimisation: a near-unit correlation pair, and a matrix estimated " +
            "from fewer observations than it has assets.</p><p>The second is not a subtlety. A " +
            "sample covariance matrix built from T observations of N assets has rank at most T, so " +
            "with N greater than T it is singular and its inverse — which is what the optimiser " +
            "wants — does not exist. Even when T exceeds N modestly, the smallest eigenvalues are " +
            "estimated so poorly that the inverse amplifies noise. Shrinkage exists for this reason " +
            "and week 4 will use it. " +
            "There is a cheap diagnostic worth running on any covariance matrix before you trust it. Compute its condition number, the ratio of the largest eigenvalue to the smallest: a value in the thousands says the inverse will amplify whatever error is in the data by roughly that factor, and nothing downstream can recover what the estimate never contained.</p>",
          code: { lang: "python", src:
            "import random\n" +
            "rng = random.Random(5)\n" +
            "names = ['EQ', 'CR', 'RT', 'FX', 'CM']\n" +
            "loads = [[.9,.1], [.7,.4], [-.3,.8], [.1,.5], [.2,-.6]]\n" +
            "T = 600\n" +
            "f = [(rng.gauss(0,1), rng.gauss(0,1)) for _ in range(T)]\n" +
            "R = [[l[0]*a + l[1]*b + .5*rng.gauss(0,1) for l in loads] for a, b in f]\n" +
            "mu = [sum(r[j] for r in R)/T for j in range(5)]\n" +
            "def cov(i, j): return sum((r[i]-mu[i])*(r[j]-mu[j]) for r in R)/(T-1)\n" +
            "sd = [cov(i, i)**.5 for i in range(5)]\n" +
            "print('      ' + '  '.join(f'{n:>5}' for n in names))\n" +
            "for i in range(5):\n" +
            "    row = '  '.join(f'{cov(i,j)/(sd[i]*sd[j]):+5.2f}' for j in range(5))\n" +
            "    print(f'{names[i]:>5} {row}')\n",
            output: "         EQ     CR     RT     FX     CM\n   EQ +1.00  +0.69  -0.17  +0.18  +0.15\n   CR +0.69  +1.00  +0.10  +0.36  -0.07\n   RT -0.17  +0.10  +1.00  +0.53  -0.66\n   FX +0.18  +0.36  +0.53  +1.00  -0.50\n   CM +0.15  -0.07  -0.66  -0.50  +1.00" } },
        { name: "What a book costs you, in C++",
          explain: "<p>Every price you have used so far was a single number. In a real market it is " +
            "a queue: resting orders at each price level on two sides, and a trade printing at the " +
            "resting order's price, not the incoming one. Sweeping more size than sits at the touch " +
            "walks you up the book, and the average price you get is worse than the quote you saw.</p>" +
            "<p>The arithmetic is trivial and the consequence is not: a strategy whose edge is five " +
            "basis points and whose sweeps cost eight is a losing strategy that backtests " +
            "beautifully against mid. This snippet is in C++ rather than Python for one reason — " +
            "the programme's computing block expects you to be able to read this loop, and the " +
            "toolchain check is part of the point. " +
            "Read the loop carefully. It stops as soon as the order is filled, so a request larger than the visible depth leaves a remainder that either rests in the book or is cancelled, depending on the order type. A backtest that silently fills the whole size at the touch is assuming liquidity that was never there.</p>",
          code: { lang: "cpp", src:
            "#include <cstdio>\n" +
            "#include <algorithm>\n" +
            "struct Lvl { double px; int qty; };\n" +
            "int main() {\n" +
            "    Lvl asks[] = {{100.02, 200}, {100.03, 500}, {100.05, 900}};\n" +
            "    for (int want : {100, 300, 900, 2000}) {\n" +
            "        int left = want; double cost = 0.0;\n" +
            "        for (const auto& l : asks) {\n" +
            "            int take = std::min(left, l.qty);\n" +
            "            cost += take * l.px; left -= take;\n" +
            "            if (!left) break;\n" +
            "        }\n" +
            "        int filled = want - left;\n" +
            "        double vwap = filled ? cost / filled : 0.0;\n" +
            "        std::printf(\"want=%4d filled=%4d vwap=%8.4f slip_bps=%6.2f unfilled=%4d\\n\",\n" +
            "                    want, filled, vwap, filled ? (vwap / 100.015 - 1) * 1e4 : 0.0, left);\n" +
            "    }\n" +
            "    return 0;\n" +
            "}\n",
            output: "want= 100 filled= 100 vwap=100.0200 slip_bps=  0.50 unfilled=   0\nwant= 300 filled= 300 vwap=100.0233 slip_bps=  0.83 unfilled=   0\nwant= 900 filled= 900 vwap=100.0322 slip_bps=  1.72 unfilled=   0\nwant=2000 filled=1600 vwap=100.0400 slip_bps=  2.50 unfilled= 400" } }
      ],
      widget: [
        { type: "orderbook", title: "Walking the book",
          params: { levels: 8, spread: 2, seed: 8811 } },
        { type: "heatmap", title: "A correlation matrix with block structure",
          params: { cmap: "div",
                    xlabels: ["EQ", "CR", "RT", "FX", "CM"],
                    ylabels: ["EQ", "CR", "RT", "FX", "CM"],
                    matrix: [[1.00, 0.62, -0.18, 0.31, 0.05],
                             [0.62, 1.00, 0.12, 0.28, -0.09],
                             [-0.18, 0.12, 1.00, 0.21, -0.34],
                             [0.31, 0.28, 0.21, 1.00, 0.02],
                             [0.05, -0.09, -0.34, 0.02, 1.00]] } },
        { type: "regression", title: "One outlier, one very different line",
          params: { n: 120, beta: 1.4, noise: 2.0, seed: 2121, show_resid: true } }
      ],
      pitfalls: [
        "Quoting R-squared as a measure of whether a signal is tradable. A daily return signal with an R-squared of 0.005 can be extremely profitable; one with 0.4 is almost certainly leaking future information.",
        "Inverting a sample covariance matrix estimated from fewer observations than assets, and not noticing because the linear algebra library returned something rather than an error.",
        "Backtesting against the mid price and then being surprised by live slippage."
      ],
      check: [
        { q: "Two regressors have a sample correlation of 0.995. What do you expect to see?",
          options: ["Both coefficients precisely estimated with small standard errors", "Large, unstable coefficients with big standard errors but a fitted line that is fine",
                    "R-squared near zero", "The intercept becomes biased"],
          answer: 1,
          why: "Collinearity makes the column space nearly degenerate: many coefficient pairs produce almost the same fitted values, so the projection is well determined while the coordinates of it are not. Standard errors blow up, signs can flip between samples, and R-squared is unaffected. Nothing about the intercept is biased." },
        { q: "You sweep 900 shares into a book with 200 at 100.02, 500 at 100.03 and 900 at 100.05. Your average fill is:",
          options: ["100.02", "about 100.036", "100.05", "the mid, 100.015"],
          answer: 1,
          why: "You take all 200 at 100.02, all 500 at 100.03, then 200 at 100.05. That is (200*100.02 + 500*100.03 + 200*100.05)/900 = 100.0356. Trades print at the resting order's price, so your own limit never determines what you paid; the queue you consumed does." },
        { q: "A factor model's residual covariance is assumed diagonal, but two names in the same sector still co-move strongly in the residuals. The consequence for a mean-variance optimiser is:",
          options: ["Nothing, residual structure is second order", "It underestimates the risk of a portfolio that is long one and short the other",
                    "It overestimates all portfolio risks equally", "The optimiser will refuse to solve"],
          answer: 1,
          why: "A diagonal residual assumption says those two residuals are independent, so a long-short pair in the same sector looks like a diversified bet when it is really one bet. The optimiser will happily load into it because the model has told it the risk is small. This is the classic way a 'market-neutral' book turns out to be a concentrated sector bet." }
      ]
    },

    /* ══════════ WEEK 4 ══════════ */
    { n: 4,
      title: "Portfolios, and the pipeline that builds them",
      topics: ["mean-variance optimisation", "the tangency portfolio", "estimation error", "research pipelines"],
      concepts: [
        { name: "The frontier is a parabola in variance",
          explain: "<p>With expected returns mu and covariance Sigma, the set of minimum-variance " +
            "portfolios for each target return traces a parabola in (variance, return) space and a " +
            "hyperbola in (standard deviation, return) space. Add a risk-free asset and the " +
            "efficient set collapses to a straight line from the risk-free rate through one " +
            "portfolio — the tangency portfolio — whose weights are proportional to " +
            "<code>Sigma^{-1}(mu - r_f 1)</code>.</p><p>That formula is beautiful and dangerous. " +
            "The inverse covariance multiplies estimation error in mu, and mu is the hardest thing " +
            "in finance to estimate: you need decades of data to pin an equity risk premium to " +
            "within a percentage point. This is why unconstrained mean-variance portfolios are " +
            "famously extreme, and why every practical implementation adds constraints, shrinkage, " +
            "or both. " +
            "The Sharpe ratio of the tangency portfolio has a tidy closed form too, and it is worth computing next to the weights. If the optimiser is promising a Sharpe of three from five liquid asset classes, the promise is coming from the estimate rather than from the market, and the weights that deliver it are the ones to trust least.</p>",
          formula: "w^{tan} \\propto \\Sigma^{-1}(\\mu - r_f \\mathbf{1}), \\qquad \\mathrm{SR} = \\frac{\\mu_p - r_f}{\\sigma_p}",
          code: { lang: "python", src:
            "mu = [0.08, 0.05, 0.11]\n" +
            "sd = [0.18, 0.10, 0.28]\n" +
            "rho = 0.25; rf = 0.02\n" +
            "S = [[sd[i]*sd[j]*(1 if i == j else rho) for j in range(3)] for i in range(3)]\n" +
            "def inv3(m):\n" +
            "    a,b,c = m[0]; d,e,f = m[1]; g,h,i = m[2]\n" +
            "    det = a*(e*i-f*h) - b*(d*i-f*g) + c*(d*h-e*g)\n" +
            "    adj = [[(e*i-f*h), -(b*i-c*h), (b*f-c*e)],\n" +
            "           [-(d*i-f*g), (a*i-c*g), -(a*f-c*d)],\n" +
            "           [(d*h-e*g), -(a*h-b*g), (a*e-b*d)]]\n" +
            "    return [[adj[r][k]/det for k in range(3)] for r in range(3)]\n" +
            "Si = inv3(S)\n" +
            "ex = [mu[i]-rf for i in range(3)]\n" +
            "raw = [sum(Si[i][j]*ex[j] for j in range(3)) for i in range(3)]\n" +
            "tot = sum(raw); w = [x/tot for x in raw]\n" +
            "rp = sum(w[i]*mu[i] for i in range(3))\n" +
            "vp = sum(w[i]*w[j]*S[i][j] for i in range(3) for j in range(3))\n" +
            "print('weights  ' + '  '.join(f'{x:+.4f}' for x in w))\n" +
            "print(f'return   {rp:.4f}')\n" +
            "print(f'vol      {vp**.5:.4f}')\n" +
            "print(f'Sharpe   {(rp-rf)/vp**.5:.4f}')\n",
            output: "weights  +0.3274  +0.4765  +0.1961\nreturn   0.0716\nvol      0.1144\nSharpe   0.4509" } },
        { name: "Estimation error dominates everything",
          explain: "<p>Run the optimiser on the true mu and Sigma and it does the right thing. Run " +
            "it on a sample estimate from five years of monthly data and it produces something " +
            "unrecognisable: enormous long and short positions in whichever assets happened to " +
            "look best, and an out-of-sample Sharpe ratio often below that of equal weights.</p>" +
            "<p>The reason is that the optimiser is a maximiser, and a maximiser applied to noisy " +
            "inputs systematically selects the noise. Assets whose returns were over-estimated by " +
            "chance get the biggest weights, which is exactly backwards. The standard defences are " +
            "shrinking mu toward a common mean, shrinking Sigma toward a structured target, " +
            "constraining weights, or all three. Equal weighting is not a joke benchmark; it is a " +
            "hard one to beat. " +
            "The reason is simply that it estimates nothing at all and so carries no estimation error. The honest test is always out of sample: fit on one window, hold the weights fixed, and measure on a window the optimiser never saw. An in-sample comparison between an optimised portfolio and equal weights is not a comparison, it is a tautology.</p>",
          code: { lang: "python", src:
            "import math, random\n" +
            "rng = random.Random(99)\n" +
            "N, T = 8, 60\n" +
            "true_mu = [0.006]*N\n" +
            "true_sd = 0.05\n" +
            "def sample():\n" +
            "    return [[true_mu[j] + true_sd*rng.gauss(0,1) for j in range(N)] for _ in range(T)]\n" +
            "wins_eq = 0; trials = 400\n" +
            "for _ in range(trials):\n" +
            "    R = sample()\n" +
            "    m = [sum(r[j] for r in R)/T for j in range(N)]\n" +
            "    best = max(range(N), key=lambda j: m[j])\n" +
            "    fut = [true_mu[j] + true_sd*rng.gauss(0,1) for j in range(N)]\n" +
            "    if sum(fut)/N >= fut[best]: wins_eq += 1\n" +
            "print(f'assets={N} months={T} trials={trials}')\n" +
            "print(f'equal weight beat pick-the-winner {wins_eq/trials:.1%} of the time')\n" +
            "print('true expected returns are identical, so any selection is pure noise')\n",
            output: "assets=8 months=60 trials=400\nequal weight beat pick-the-winner 54.2% of the time\ntrue expected returns are identical, so any selection is pure noise" } },
        { name: "A research pipeline is a directed graph",
          explain: "<p>By the end of a quarter your code is not a script, it is a graph: raw data " +
            "into cleaning, cleaning into features, features into a signal, the signal and a risk " +
            "model into weights, weights and prices into a P&amp;L, and the P&amp;L into a report. " +
            "Drawing that graph is not decoration. It is how you answer the only question that " +
            "matters when a number looks wrong, which is 'what fed this?'.</p><p>It is also how " +
            "you find look-ahead. Every edge carries a timestamp discipline: the node downstream " +
            "may only see information available at or before its own stamp. Look-ahead bugs are " +
            "almost always an edge that skipped a stage — a feature computed from a full-sample " +
            "mean, a universe defined by today's index membership — and they are far easier to see " +
            "in a picture than in a call stack. " +
            "Draw it once, early, and keep it beside the code: the graph is also the list of things you must be able to rerun independently when a number moves overnight and nobody can say why.</p>",
          code: { lang: "python", src:
            "edges = [('raw','clean'), ('clean','features'), ('features','signal'),\n" +
            "         ('clean','riskmodel'), ('signal','weights'), ('riskmodel','weights'),\n" +
            "         ('weights','pnl'), ('clean','pnl'), ('pnl','report')]\n" +
            "nodes = sorted({n for e in edges for n in e})\n" +
            "indeg = {n: 0 for n in nodes}\n" +
            "for a, b in edges: indeg[b] += 1\n" +
            "order, ready = [], sorted(n for n in nodes if indeg[n] == 0)\n" +
            "while ready:\n" +
            "    n = ready.pop(0); order.append(n)\n" +
            "    for a, b in edges:\n" +
            "        if a == n:\n" +
            "            indeg[b] -= 1\n" +
            "            if indeg[b] == 0: ready.append(b)\n" +
            "    ready.sort()\n" +
            "print('topological order:', ' -> '.join(order))\n" +
            "print('stages:', len(order), ' edges:', len(edges))\n" +
            "print('cycle-free:', len(order) == len(nodes))\n",
            output: "topological order: raw -> clean -> features -> riskmodel -> signal -> weights -> pnl -> report\nstages: 8  edges: 9\ncycle-free: True" } }
      ],
      widget: [
        { type: "efficient-frontier", title: "Three assets, one tangency portfolio",
          params: { mu: [0.08, 0.05, 0.11], sigma: [0.18, 0.10, 0.28], rho: 0.25, rf: 0.02 } },
        { type: "tree-diagram", title: "The research pipeline, as a graph",
          params: { nodes: [{ id: "raw", label: "Raw data" }, { id: "clean", label: "Cleaning" },
                            { id: "features", label: "Features" }, { id: "riskmodel", label: "Risk model" },
                            { id: "signal", label: "Signal" }, { id: "weights", label: "Weights" },
                            { id: "pnl", label: "P&L" }, { id: "report", label: "Report" }],
                    edges: [{ from: "raw", to: "clean" }, { from: "clean", to: "features" },
                            { from: "clean", to: "riskmodel" }, { from: "features", to: "signal" },
                            { from: "signal", to: "weights" }, { from: "riskmodel", to: "weights" },
                            { from: "weights", to: "pnl" }, { from: "clean", to: "pnl", label: "prices" },
                            { from: "pnl", to: "report" }] } }
      ],
      pitfalls: [
        "Feeding raw sample means into an unconstrained optimiser and presenting the 400% long / 300% short answer as a recommendation.",
        "Comparing an optimised in-sample Sharpe against equal weights in-sample. The comparison is only informative out of sample.",
        "Letting a feature see the full-sample mean of its own column — the single most common look-ahead bug there is, and invisible unless you drew the graph."
      ],
      check: [
        { q: "An unconstrained mean-variance optimiser on eight assets with five years of monthly data gives you a 380% long / 280% short portfolio. The first thing to suspect is:",
          options: ["A coding bug in the matrix inverse", "Estimation error in mu being amplified by Sigma inverse",
                    "That the assets really are that attractive", "Too few assets"],
          answer: 1,
          why: "Sixty monthly observations barely pin down eight means at all, and Sigma inverse amplifies whatever error is there. Extreme weights are the expected, textbook behaviour of the unconstrained solution on sample inputs — not a bug. The fix is shrinkage or constraints, not more decimal places." },
        { q: "You shrink your estimated mu 50% toward its cross-sectional mean. Out-of-sample Sharpe usually:",
          options: ["Falls, because you discarded information", "Rises, because you discarded more noise than information",
                    "Is unchanged", "Becomes undefined"],
          answer: 1,
          why: "Shrinkage trades a little bias for a large variance reduction, and when the signal-to-noise ratio in estimated means is as low as it is for asset returns, that trade is almost always worth making. This is the same James-Stein logic that makes shrinkage estimators beat the sample mean in dimension three and above." },
        { q: "Your pipeline graph has an edge from 'full-sample z-score' into 'features'. This is:",
          options: ["Fine, z-scoring is a standard transform", "A look-ahead bug: the mean and sd used at time t include data after t",
                    "Only a problem for high-frequency data", "Only a problem if the series is non-stationary"],
          answer: 1,
          why: "A full-sample z-score subtracts a mean computed from the entire history including the future. Every observation then carries a little information about every other one, and the backtest inherits it. The fix is an expanding or rolling window whose window ends at t. It matters at every frequency, stationary or not." },
        { q: "Equal weighting beats your optimised portfolio out of sample. The most useful response is:",
          options: ["Add more assets", "Treat equal weight as the benchmark to beat and add shrinkage or constraints",
                    "Re-optimise over a longer in-sample window", "Conclude that mean-variance theory is wrong"],
          answer: 1,
          why: "The theory is not wrong; it is being fed inputs it cannot survive. Equal weighting wins because it makes no estimate of mu at all, so it carries no estimation error. The productive move is to keep the optimiser and reduce what it has to estimate — shrinkage, factor structure, position limits — rather than to abandon it or feed it more of the same noise." }
      ]
    },

    /* ══════════ WEEK 5 ══════════ */
    { n: 5,
      title: "The quarter as a whole, and how to trace a bug",
      topics: ["the arc of the course", "debugging numerically", "reproducibility", "what comes next"],
      concepts: [
        { name: "The through-line",
          explain: "<p>Four weeks, one idea, repeated: write down the thing you want as a function " +
            "of an uncertain quantity, choose a measure or an estimator, and then worry — properly, " +
            "with numbers — about how wrong the answer can be. Week 1 chose a measure. Week 2 " +
            "estimated an expectation and reported its standard error. Week 3 fitted a coefficient " +
            "and reported its standard error. Week 4 discovered that the standard error was the " +
            "whole story.</p><p>That is not a coincidence in the curriculum; it is the curriculum. " +
            "Every later course — derivatives, fixed income, machine learning, risk — is the same " +
            "loop at a higher resolution. What changes is the difficulty of the estimation, not " +
            "the shape of the argument. " +
            "That is worth holding onto when a later course opens with three weeks of machinery you have not seen. Ask which of the four steps the machinery is serving and it stops being a wall. Almost always it is the third: the estimator got harder because the thing being estimated stopped being a scalar, or stopped being observable, or started moving while you measured it.</p>",
          code: { lang: "python", src:
            "arc = [('1', 'choose a measure',   'p* from replication'),\n" +
            "       ('2', 'estimate an expectation', 'Monte Carlo + standard error'),\n" +
            "       ('3', 'estimate a coefficient',  'OLS + standard error'),\n" +
            "       ('4', 'act on the estimates',    'and discover the error dominates'),\n" +
            "       ('5', 'make it reproducible',    'so someone else can check you')]\n" +
            "w = max(len(b) for _, b, _ in arc)\n" +
            "for n, what, how in arc:\n" +
            "    print(f'week {n}  {what:<{w}}  |  {how}')\n",
            output: "week 1  choose a measure         |  p* from replication\nweek 2  estimate an expectation  |  Monte Carlo + standard error\nweek 3  estimate a coefficient   |  OLS + standard error\nweek 4  act on the estimates     |  and discover the error dominates\nweek 5  make it reproducible     |  so someone else can check you" } },
        { name: "Bisect the number, not the code",
          explain: "<p>A numerical bug rarely announces itself with a traceback. The price is 10.7 " +
            "and it should be 10.4, and every line looks right. The productive technique is not to " +
            "reread the code; it is to bisect the number. Reduce the problem until the answer is " +
            "one you can compute by hand: one path, one step, zero volatility, zero rate. At each " +
            "reduction the discrepancy either survives or vanishes, and the step where it vanishes " +
            "is where the bug lives.</p><p>Zero volatility is the single most useful probe in this " +
            "subject. With sigma = 0 every model becomes deterministic and every price becomes a " +
            "discounted intrinsic value you can check on paper. A Monte Carlo that does not pass " +
            "the sigma = 0 test has a bug in the drift, the discounting or the payoff, and you have " +
            "just eliminated everything else. " +
            "The other reductions worth keeping in the kit are one path with a fixed seed, which makes the whole computation checkable by hand; one time step, which removes any discretisation error; and a zero interest rate, which removes the discount factor. Each either keeps the discrepancy or kills it, and four well-chosen reductions localise almost any numerical bug faster than reading the function will.</p>",
          formula: "\\sigma \\to 0 \\implies C \\to e^{-rT}\\max(S_0 e^{rT} - K,\\, 0)",
          code: { lang: "python", src:
            "import math\n" +
            "def mc_call(S0, K, r, sig, T, n=20000, seed=1):\n" +
            "    import random\n" +
            "    rng = random.Random(seed); tot = 0.0\n" +
            "    for _ in range(n):\n" +
            "        z = rng.gauss(0, 1)\n" +
            "        S = S0*math.exp((r-.5*sig*sig)*T + sig*math.sqrt(T)*z)\n" +
            "        tot += max(S-K, 0)\n" +
            "    return math.exp(-r*T)*tot/n\n" +
            "\n" +
            "S0, K, r, T = 100., 95., .05, 1.\n" +
            "print('sigma   mc price   deterministic check')\n" +
            "for sig in (0.0, 0.01, 0.05, 0.20):\n" +
            "    det = math.exp(-r*T)*max(S0*math.exp(r*T) - K, 0)\n" +
            "    print(f'{sig:5.2f}   {mc_call(S0,K,r,sig,T):8.4f}   {det:8.4f}')\n",
            output: "sigma   mc price   deterministic check\n 0.00     9.6332     9.6332\n 0.01     9.6294     9.6332\n 0.05     9.6519     9.6332\n 0.20    13.2736     9.6332" } },
        { name: "A result you cannot reproduce is an anecdote",
          explain: "<p>Seed every generator. Record the seed. Record the versions. Print the inputs " +
            "next to the outputs. None of this is bureaucracy — it is the difference between a " +
            "number someone can check and a number someone has to trust.</p><p>The dashboard you " +
            "are reading enforces the same rule on itself: every code block on every course page " +
            "is executed by <code>tools/run_snippets.py</code> and its real stdout is stored in " +
            "the page, so a claim and its evidence cannot drift apart. If a snippet stops producing " +
            "the output shown, the build fails. Adopt the same discipline in your own work and the " +
            "class of bug where a stale number survives three revisions of the code simply stops " +
            "happening. " +
            "The habit generalises beyond code. A figure in a slide deck, a number in an email and a row in a risk report are all claims, and each should be traceable to a command someone else can run. If it is not, you are asking to be believed rather than checked, and in this field being checked is much the more valuable of the two.</p>",
          code: { lang: "python", src:
            "import hashlib, platform, sys\n" +
            "params = {'S0': 100.0, 'K': 95.0, 'r': 0.05, 'sigma': 0.2, 'T': 1.0, 'paths': 20000, 'seed': 1}\n" +
            "blob = repr(sorted(params.items())).encode()\n" +
            "print('python     :', sys.version.split()[0])\n" +
            "print('platform   :', platform.system())\n" +
            "print('params     :', ', '.join(f'{k}={v}' for k, v in sorted(params.items())))\n" +
            "print('params_hash:', hashlib.sha256(blob).hexdigest()[:16])\n" +
            "print('a run without these five lines is an anecdote, not a result')\n",
            output: "python     : 3.13.5\nplatform   : Darwin\nparams     : K=95.0, S0=100.0, T=1.0, paths=20000, r=0.05, seed=1, sigma=0.2\nparams_hash: 7bc3ad870224a9e8\na run without these five lines is an anecdote, not a result" } }
      ],
      widget: [
        { type: "timeline", title: "The arc of the quarter",
          params: { events: [{ t: 1, label: "Payoffs and the tree", note: "Replication fixes the measure." },
                             { t: 2, label: "Simulation", note: "Standard error appears and never leaves." },
                             { t: 3, label: "Regression and the book", note: "Estimates and their costs." },
                             { t: 4, label: "Portfolios", note: "Estimation error dominates the answer." },
                             { t: 5, label: "Reproducibility", note: "Make the result checkable." }] } },
        { type: "code-trace", title: "Bisecting a Monte Carlo bug",
          params: { lang: "python",
                    code: "tot = 0.0\nfor i in range(n):\n    z = rng.gauss(0, 1)\n    S = S0 * exp((r - 0.5*sig*sig)*T + sig*sqrt(T)*z)\n    tot += max(S - K, 0)\nprice = exp(-r*T) * tot / n",
                    steps: [{ line: 1, state: { tot: "0.0", i: "-", S: "-" }, note: "Accumulator starts at zero." },
                            { line: 3, state: { tot: "0.0", i: "0", z: "+0.418" }, note: "First normal draw." },
                            { line: 4, state: { tot: "0.0", i: "0", z: "+0.418", S: "108.05" }, note: "Exact lognormal step, no discretisation." },
                            { line: 5, state: { tot: "13.05", i: "0", S: "108.05" }, note: "Payoff added undiscounted." },
                            { line: 3, state: { tot: "13.05", i: "1", z: "-1.220" }, note: "Second draw." },
                            { line: 4, state: { tot: "13.05", i: "1", z: "-1.220", S: "80.12" }, note: "Below the strike." },
                            { line: 5, state: { tot: "13.05", i: "1", S: "80.12" }, note: "max() contributes nothing." },
                            { line: 6, state: { tot: "13.05", price: "6.21" }, note: "Discounting happens once, at the end." }] } }
      ],
      pitfalls: [
        "Rereading the code instead of shrinking the problem. Set sigma to zero and one path before you set a breakpoint.",
        "Leaving a generator unseeded in a report, so the number in the text can never be reproduced by the person checking it.",
        "Believing a number because it looks plausible. Plausible is what a bug that is off by exp(sigma^2 T / 2) looks like."
      ],
      check: [
        { q: "Your Monte Carlo call price is right at sigma = 0.2 but wrong at sigma = 0. The bug is most likely in:",
          options: ["The random number generator", "The drift or the discounting",
                    "The payoff function", "The number of paths"],
          answer: 1,
          why: "At sigma = 0 the randomness disappears entirely, so the generator and the path count cannot be responsible. What remains is the deterministic skeleton: the drift term that moves S0 to its forward and the discount factor applied at the end. The payoff is also deterministic there, but a wrong payoff would break the sigma = 0.2 case too." },
        { q: "The most useful single line to add to a report containing a simulated number is:",
          options: ["The wall-clock runtime", "The seed and the standard error",
                    "The name of the machine", "The number of CPU cores used"],
          answer: 1,
          why: "The seed makes the number reproducible and the standard error makes it interpretable. Everything else is context that is nice to have and useless without those two: knowing a number took four minutes on a 16-core machine tells a reader nothing about whether to believe it." },
        { q: "run_snippets.py stores the real stdout of every code block back into the course file. The point of that is:",
          options: ["To make the pages load faster", "To stop a page claiming an output its code no longer produces",
                    "To avoid running code in the browser", "To compress the files"],
          answer: 1,
          why: "It is a drift guard. A page that hard-codes an output by hand will eventually disagree with its own code — someone edits the snippet and forgets the number underneath. Regenerating the output from an actual execution makes that class of error impossible to commit without the build noticing." }
      ]
    }
  ],

  interview: [
    { q: "Explain the risk-neutral measure to someone who has just told you it is 'the market's probability'.",
      level: "screen",
      answer: "It is not anybody's probability. It is the measure under which the discounted price process is a martingale, and it exists because you can replicate the payoff with the stock and a bond. In the one-period model, solve the two-equation replication problem and the price rearranges into a discounted expectation with weight p* = (e^{rT} - d)/(u - d). Notice that p* contains the interest rate and the two possible prices and nothing about anybody's view. If the real-world probability of an up move doubled but u, d and r were unchanged, p* would not move at all — and neither would the option's price, because the hedge that replicates it has not changed." },
    { q: "How would you check whether a Monte Carlo pricer is correct?",
      level: "screen",
      answer: "Three tests, in order. First, sigma to zero: the price must collapse to the discounted intrinsic value of the forward, which I can compute on paper. Second, a case with a closed form — a plain European call against Black-Scholes — and check the difference is within two or three standard errors, not just 'close'. Third, convergence: quadruple the paths and confirm the standard error roughly halves. If the third test fails while the first two pass, I have a correlation or a seeding problem rather than a formula problem." },
    { q: "Why does an unconstrained mean-variance optimiser produce such extreme weights?",
      level: "onsite",
      answer: "Because the tangency weights are proportional to Sigma inverse times excess returns, and both inputs are estimated. Expected returns are estimated terribly — with sixty monthly observations the standard error on a mean is around the same size as the mean — and Sigma inverse amplifies whatever error is in them, especially along the directions with small eigenvalues, which are exactly the directions estimated worst. The optimiser is a maximiser, so it systematically selects the assets whose returns were over-estimated by luck. The standard defences are shrinking mu toward a common mean, shrinking Sigma toward a structured target such as a single-factor model, and imposing position limits." },
    { q: "A backtest shows a Sharpe ratio of 4 on daily data. Walk me through your scepticism.",
      level: "onsite",
      answer: "A Sharpe of 4 on daily data is roughly a 90% hit rate of positive weeks, which essentially no public strategy sustains, so my prior is that something is leaking. I would check, in order: whether any feature uses information stamped after the decision time, including full-sample normalisations; whether the universe is defined by today's index membership; whether fills are at mid rather than at a realistic sweep price; whether the position is correlated with the contemporaneous return, which makes P&L behave like a function of absolute return and looks suspiciously smooth; and whether the parameters were chosen by looking at the same data. Only after all five would I consider it real, and then I would want an out-of-sample period that was never touched." },
    { q: "What does R-squared tell you about whether a signal is tradable?",
      level: "onsite",
      answer: "Almost nothing on its own. A daily return predictor with an R-squared of half a percent can be extremely profitable once leverage and breadth are applied, because the relevant quantity is the information ratio, which scales with the square root of the number of independent bets. Conversely a high R-squared on daily returns is a red flag: it usually means a contemporaneous variable has crept into the regressors. What I want instead is the t-statistic on the coefficient, the out-of-sample hit rate, and an estimate of turnover and transaction cost, because a signal that predicts well and trades expensively is not a strategy." },
    { q: "Derive put-call parity and say precisely which assumptions it needs.",
      level: "screen",
      answer: "Hold a long call and a short put at the same strike and maturity. At expiry the payoff is max(S-K,0) - max(K-S,0) = S - K for every S. A portfolio that is long the stock and short K zero-coupon bonds maturing at T has the same payoff. Two portfolios with identical payoffs in every state must have identical prices today, so C - P = S_0 - K e^{-rT}. The assumptions are: European exercise, no dividends over the life (otherwise subtract their present value from S_0), a single deterministic discount rate, and no frictions preventing the two portfolios from being held. Notably it needs no model of how S moves." },
    { q: "Your colleague inverts a 500-asset sample covariance matrix built from 250 daily returns. What do you say?",
      level: "onsite",
      answer: "That matrix has rank at most 250, so it is singular and has no inverse; whatever the library returned is a pseudo-inverse or numerical noise. Even at 500 observations for 500 assets the smallest eigenvalues would be estimated so poorly that the inverse would be dominated by noise. The fixes are to reduce the dimension with a factor model, to shrink toward a structured target such as constant correlation or the identity, or to regularise by adding a ridge term. I would also ask what the inverse is for, because sometimes the problem can be reformulated to avoid inverting at all." },
    { q: "Explain the difference between a European and an American put in a binomial tree, in implementation terms.",
      level: "screen",
      answer: "One extra line. In both cases you fill the terminal layer with the payoff and roll backwards, replacing each node with the discounted risk-neutral average of its children. For the American put you additionally take the maximum of that continuation value and the immediate exercise value K - S at that node. That single max is the early-exercise premium. It is always non-negative, so the American price can never be below the European price, and for a put on a non-dividend-paying stock it is strictly positive because exercising early lets you earn interest on the strike you receive." },
    { q: "What is the half-life of an Ornstein-Uhlenbeck process and why does a trader care?",
      level: "onsite",
      answer: "It is ln 2 divided by the mean-reversion speed theta, the time for a shock to decay to half its size. A trader cares because it sets the holding period: if the half-life is two days, a position held for a month is mostly carrying noise and paying financing for the privilege, and if the half-life is six months, a strategy that re-trades daily is paying transaction costs many times over for one idea. It also sets the right sampling frequency for estimating the process — sampling far more finely than the half-life adds observations that are nearly perfectly correlated and inflates apparent significance." },
    { q: "How do you decide between a lattice, a PDE solver and Monte Carlo for a given product?",
      level: "senior",
      answer: "Dimension and exercise style. In one or two state variables with early exercise, a lattice or a finite-difference PDE solver is natural because both handle the free boundary by comparing continuation and exercise value at every node. Above three or four state variables the grid cost explodes and Monte Carlo becomes the only option, at the cost of making early exercise hard — you need Longstaff-Schwartz or a similar regression method, and its bias is a real concern. Path dependence pushes toward Monte Carlo even in low dimension. I would also weigh what I need besides the price: a lattice hands you delta for free, whereas Monte Carlo Greeks need pathwise derivatives, likelihood ratios or common random numbers to be usable." },
    { q: "Your production risk number moved 8% overnight with no position or market move. How do you find out why?",
      level: "senior",
      answer: "Bisect the pipeline, not the code. Freeze yesterday's inputs and run today's code: if the number moves, it is a code or configuration change, and the version control history over the last day is a short list. If it does not move, run yesterday's code on today's inputs and bisect the inputs by stage — raw data, cleaned data, the covariance estimate, the position file. The covariance estimate is the usual culprit, because a rolling window dropping one extreme day can shift an eigenvalue materially, and that is a real move that nobody noticed rather than a bug. I would want the answer stated as 'this input changed by X and the sensitivity is Y', not as a story." },
    { q: "What would you put in a research report so that a sceptical reader can check it?",
      level: "senior",
      answer: "The seed and the exact parameters next to every simulated number; the standard error next to every estimate; the date range and, crucially, the point-in-time universe definition; the transaction cost assumption stated in basis points with the source of that number; the out-of-sample period and confirmation that it was only looked at once; and a dependency graph or at minimum an ordered list of the pipeline stages, so a reader can see what fed what. I would also state what would falsify the result — what I would expect to see if the effect were not real — because a claim with no failure condition is not a research result." }
  ],

  reappears_in: [
    { code: "FINM 33000", how: "The binomial tree of week 1 becomes the discrete approximation used to motivate Black-Scholes, and p* becomes the equivalent martingale measure." },
    { code: "FINM 33150", how: "Week 3's OLS and week 4's estimation-error argument are the backbone of signal evaluation; the order-book sweep becomes the transaction cost model." },
    { code: "FINM 32600", how: "The C++ book-walk of week 3 is the starting point for the implementation work, with the same struct and the same loop written properly." },
    { code: "FINM 36700", how: "The efficient frontier and the tangency portfolio are rebuilt with shrinkage and constraints, and week 2's tail histogram becomes VaR and expected shortfall." },
    { code: "FINM 37601", how: "The order book of week 3 stops being a worked example and becomes the object of study, with an optimal-execution objective on top of it." }
  ],

  glossary: [
    { term: "Risk-neutral measure", def: "The probability measure under which discounted asset prices are martingales. It is a consequence of replication, not a forecast of anything." },
    { term: "Replication", def: "Building a portfolio of traded instruments whose payoff matches a derivative's in every state. Its cost is the derivative's price, by no-arbitrage." },
    { term: "Put-call parity", def: "C - P = S_0 - K e^{-rT} for European options on a non-dividend-paying asset. Model-free: it follows from replication alone." },
    { term: "Recombining tree", def: "A lattice where up-then-down lands on the same node as down-then-up, so n steps produce n+1 terminal nodes instead of 2^n." },
    { term: "Standard error", def: "The standard deviation of an estimator. For a Monte Carlo mean it is the sample standard deviation divided by the square root of the number of paths." },
    { term: "Antithetic variates", def: "Pairing each random draw Z with -Z to induce negative correlation between payoffs and reduce the variance of the estimate. Works on smooth, monotone payoffs." },
    { term: "Ornstein-Uhlenbeck process", def: "A mean-reverting diffusion dX = theta(m - X)dt + sigma dW. Its stationary variance is sigma^2/(2 theta) and its shock half-life is ln 2 / theta." },
    { term: "Leverage (statistics)", def: "How far a regressor observation sits from the centre of the regressor cloud. A high-leverage point can move the fitted line a long way by itself." },
    { term: "Collinearity", def: "Near-linear dependence among regressors. Coefficients become unstable and their standard errors large, while the fitted values stay well determined." },
    { term: "Microprice", def: "A size-weighted touch price, (ask x bid_size + bid x ask_size)/(bid_size + ask_size). It leans toward the side that is about to win." },
    { term: "Slippage", def: "The difference between the price you assumed and the price you got. Sweeping more than the size at the touch guarantees it." },
    { term: "Tangency portfolio", def: "The portfolio with the highest Sharpe ratio, with weights proportional to Sigma inverse times excess returns. Extremely sensitive to estimation error in the returns." },
    { term: "Shrinkage", def: "Pulling an estimate toward a structured target to trade a little bias for a large reduction in variance. Standard practice for both means and covariances." },
    { term: "Look-ahead bias", def: "Any use of information that was not available at the decision time. Full-sample normalisations and today's index membership are the two commonest sources." },
    { term: "Point-in-time data", def: "Data as it stood on a given date, including the values that were later revised. The only kind a backtest may use." }
  ]
};
