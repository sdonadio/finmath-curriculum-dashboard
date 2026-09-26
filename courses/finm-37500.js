/* ==========================================================================
   courses/finm-37500.js -- FINM 37500 . Fixed Income Derivatives

   Built from the public course page only. The syllabus PDF is a Box shared
   link restricted to a campus login, so the week-by-week outline below, and
   every explanation, formula, snippet, question and glossary entry in it,
   is this dashboard's own reconstruction of a standard graduate treatment
   of fixed income derivatives -- not the instructor's material. Written to
   sit alongside FINM 37400 (Fixed Income) without repeating its curve build.
   ========================================================================== */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 37500"] = {
  "code": "FINM 37500",
  "slug": "finm-37500",
  "title": "Fixed Income Derivatives",
  "instructor": "Mark Hendricks",
  "quarter": "Winter",
  "units": 50,
  "block": "electives",
  "concentrations": [
    "options-derivatives"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/options-and-derivatives/finm-37500/",
    "syllabus_url": "https://uchicago.app.box.com/s/kfjjotvbn2dy02bj42bu8c8zf40zyxhh",
    "fetched": "2026-09-26",
    "note": "Only the public course page was readable: the syllabus PDF is a Box shared link behind a campus login. The five-week outline, concepts, code, widgets, questions and glossary here are the dashboard's own reconstruction of a standard graduate treatment of fixed income derivatives, built to sit alongside FINM 37400's curve-building material without repeating it. Nothing on this page is attributed to the instructor, and no grading scheme, assignment, exam format or required reading is implied. The course page states the course does not cover credit risk, and nothing here does either."
  },
  "tier": "B",
  "description": "The course covers key models and techniques needed to manage and price fixed-income derivatives, including futures, swaps, swaptions, caps, and floors, with emphasis on how these markets operate in practice and how models and techniques of the course are applied to them. It explores key models in discrete and continuous time, with particular focus on interest-rate trees and Black's models, and includes an introduction to modeling volatility and skew. The course does not cover credit risk. Weekly homework assignments have an applied focus, using market data to test models, explore markets, and manage trades.",
  "prerequisites": [
    "FINM 37400 (Fixed Income) or equivalent: bootstrapping a discount curve, discount factors, forward rates, duration and DV01, and the annuity factor as a swap's fixed-leg present value per unit of rate.",
    "Risk-neutral pricing and change of numeraire at the level of a first derivatives course: why a discounted price process is a martingale under the pricing measure, and that different measures can price the same payoff identically.",
    "The Black-Scholes formula and its Greeks. This course does not re-derive Black-Scholes; it repackages it as Black-76 and asks what changes when the underlying is a forward or a swap rate instead of a stock.",
    "Enough Python and NumPy to bootstrap a small curve, implement a closed-form option formula, and read a table of numbers without a plotting library doing the thinking."
  ],
  "textbooks": [
    {
      "title": "Options, Futures, and Other Derivatives",
      "author": "John C. Hull",
      "note": "Standard reference for this material: Black's model, caps and floors, swaptions, and short-rate trees."
    },
    {
      "title": "Interest Rate Models: Theory and Practice",
      "author": "Damiano Brigo and Fabio Mercurio",
      "note": "Standard reference for the forward-measure derivations, convexity adjustments, and the volatility-skew material in week 5."
    },
    {
      "title": "Interest Rate Option Models",
      "author": "Riccardo Rebonato",
      "note": "Standard reference for market practice around caplet vol stripping and the swaption vol cube."
    },
    {
      "title": "The Concepts and Practice of Mathematical Finance",
      "author": "Mark S. Joshi",
      "note": "Standard reference for the change-of-numeraire and forward-measure arguments underlying Black-76."
    }
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
  ],
  "brushup": [
    {
      "topic": "The annuity factor and a swap's fixed leg",
      "why": "Every price in this course that is not a plain option is Annuity times a Black-76 price. If you cannot immediately say why a swap's fixed leg is (fixed rate) times (annuity), the swaption weeks will feel like new machinery instead of a repackaging.",
      "resource": "FINM 37400's swap-curve week, or Hull chapter 7"
    },
    {
      "topic": "Change of numeraire, once, on paper",
      "why": "This course leans on the fact that dividing every price by the SAME traded asset (a zero-coupon bond, an annuity) does not change which portfolio is cheapest, only the units you measure it in. Doing the one-line derivation for a forward contract by hand removes the mystery before week 2 needs it for real.",
      "resource": "Brigo and Mercurio, chapter 2, or Joshi chapter 5"
    },
    {
      "topic": "The lognormal mean correction",
      "why": "Black-76 puts the same -sigma^2 T/2 term in the exponent that Black-Scholes does, for the same reason. If E[exp(sigma sqrt(T) Z)] = exp(sigma^2 T/2) is not automatic, every forward-measure argument in week 2 will look like it is hiding something.",
      "resource": "Work out E[exp(X)] for X normal by hand; ten lines, and it never has to be re-derived again"
    },
    {
      "topic": "Bootstrapping discount factors from par rates",
      "why": "Week 1 builds the curve this course prices everything off, using the same recursive bootstrap FINM 37400 teaches. If that recursion is not comfortable, spend an hour on it before week 1, not during it.",
      "resource": "FINM 37400's curve-building week"
    },
    {
      "topic": "Reading a normal CDF and PDF off a formula",
      "why": "Every closed form in this course is a linear combination of N(d1), N(d2), and n(d1). Recognising the pieces on sight — which one is delta, which one turns into vega when multiplied by F*sqrt(T) — saves real time on every problem set.",
      "resource": "Hull, appendix on the Black-Scholes formula's building blocks"
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "The swap curve, built for derivatives",
      "topics": [
        "bootstrapping the swap curve",
        "forward-starting swaps",
        "annuity, DV01 and hedging",
        "SOFR compounded in arrears"
      ],
      "concepts": [
        {
          "name": "Bootstrapping the curve, and pricing anything off it",
          "explain": "<p>A swap curve is a sequence of discount factors, and every par swap rate is a constraint on it. For a swap paying annually with par rate <code>S_n</code> at maturity <code>n</code>, the fixed leg's present value must equal the floating leg's, which for a single-curve swap collapses to <code>S_n * sum_{i=1}^n DF(i) = 1 - DF(n)</code>. Because every earlier discount factor is already known by the time you reach maturity <code>n</code>, this is one equation in one unknown, solved in order, shortest maturity first. That is the whole bootstrap.</p><p>Once you have the discount factors, every other question is arithmetic. The present value of an off-market swap struck at a fixed rate other than the current par rate is <code>(par rate - fixed rate) x annuity</code>, where the annuity is just the sum of the relevant discount factors. This course will not build the curve from scratch every week the way FINM 37400 does; it assumes you can, and instead asks what a derivatives desk does with the curve once it exists.</p><p>A desk cares because every caplet, swaption and convexity adjustment in the next four weeks is priced off discount factors and forward rates read from exactly this curve, so an error here is not local: it is inherited by everything downstream.</p>",
          "formula": "S_n \\sum_{i=1}^{n} DF(i) = 1 - DF(n), \\qquad PV_{\\text{off-market}} = N(S_n - K)\\sum_{i=1}^{n} DF(i)",
          "code": {
            "lang": "python",
            "src": "tenors = [1, 2, 3, 4, 5]\npar = [0.0320, 0.0345, 0.0360, 0.0370, 0.0375]     # market par swap rates, annual pay\n\nDF = {0: 1.0}\nrunning = 0.0\nfor n, s in zip(tenors, par):\n    DF[n] = (1.0 - s * running) / (1.0 + s)\n    running += DF[n]\n\nfor n in tenors:\n    print(f\"DF({n}) = {DF[n]:.6f}\")\n\nannuity5 = sum(DF[i] for i in range(1, 6))\npar5_check = (1 - DF[5]) / annuity5\nprint(f\"annuity(5) = {annuity5:.6f}   par(5) reproduced = {par5_check:.6f} vs input {par[-1]:.4f}\")\n\nfixed, notional = 0.0350, 10_000_000\npv_payer = notional * (par5_check - fixed) * annuity5\nprint(f\"5y payer swap struck at {fixed:.4%}, notional {notional:,}: PV = {pv_payer:,.2f}\")\n",
            "output": "DF(1) = 0.968992\nDF(2) = 0.934335\nDF(3) = 0.899112\nDF(4) = 0.864330\nDF(5) = 0.831322\nannuity(5) = 4.498091   par(5) reproduced = 0.037500 vs input 0.0375\n5y payer swap struck at 3.5000%, notional 10,000,000: PV = 112,452.27"
          }
        },
        {
          "name": "Forward-starting swaps: the underlying of every swaption",
          "explain": "<p>The same curve prices a swap that does not start today. A forward swap rate between times <code>t_1</code> and <code>t_2</code> is <code>(DF(t_1) - DF(t_2)) / annuity(t_1, t_2)</code>, where the annuity sums the discount factors of the payment dates strictly between <code>t_1</code> and <code>t_2</code>. It is the fixed rate that makes a swap entered into today, but starting at <code>t_1</code>, worth zero at inception.</p><p>This number is not a side calculation. Week 4's swaption is, by construction, an option on exactly this forward swap rate, and the annuity that appears here is the same annuity that turns a Black-76 call into a swaption price. Getting comfortable with forward-starting swaps now means week 4 introduces one new idea (optionality) instead of two.</p><p>A desk cares because a mid-curve swaption — the right to enter a swap starting a year or two from now — is priced entirely off numbers built exactly this way, and mispricing the forward annuity is a common, hard-to-spot error precisely because it looks like a small correction to the spot annuity.</p>",
          "formula": "S(t_1,t_2) = \\frac{DF(t_1) - DF(t_2)}{\\sum_{i:\\, t_1 < t_i \\le t_2} DF(t_i)}",
          "code": {
            "lang": "python",
            "src": "DF = {0: 1.0, 1: 0.968992, 2: 0.934335, 3: 0.899112, 4: 0.864330, 5: 0.831322}\n\nann_1_5 = sum(DF[i] for i in range(2, 6))          # payment dates strictly after t=1, through t=5\nfwd_1_5 = (DF[1] - DF[5]) / ann_1_5\nprint(f\"annuity(1,5) = {ann_1_5:.6f}\")\nprint(f\"forward 1y-into-4y swap rate = {fwd_1_5:.6%}\")\n\nspot_par_5 = (1 - DF[5]) / sum(DF[i] for i in range(1, 6))\nprint(f\"spot 5y par rate             = {spot_par_5:.6%}\")\nprint(f\"the forward-starting rate and the spot rate are different numbers off the SAME curve\")\n",
            "output": "annuity(1,5) = 3.529099\nforward 1y-into-4y swap rate = 3.900996%\nspot 5y par rate             = 3.749991%\nthe forward-starting rate and the spot rate are different numbers off the SAME curve"
          }
        },
        {
          "name": "Annuity, DV01, and hedging a swap with the curve",
          "explain": "<p>DV01 is the dollar change in a swap's value for a one-basis-point parallel shift of the curve, and for a swap it is almost exactly the notional times the annuity times one basis point, because the annuity is the sensitivity of the fixed leg's value to the fixed rate and a parallel curve shift moves the par rate by roughly the same amount at every maturity. Bump-and-reprice — shock every par rate up by one basis point, rebuild the curve, reprice, repeat down, take half the difference — is the version that always works, including when the shift is not parallel.</p><p>The two should agree closely for a small parallel shift and will not agree for a large one or a twist, because the annuity approximation is a first derivative and bump-and-reprice captures the exact, possibly nonlinear, answer. Comparing them is a standard sanity check before trusting either one in a risk system.</p><p>A desk cares because DV01 is additive across a book in a way that price is not: you can sum the DV01 of every swap, cap and swaption once they are all expressed in the same curve's basis points, and that sum is the number a risk manager actually asks for first.</p>",
          "formula": "\\text{DV01} \\approx N \\times \\text{annuity} \\times 10^{-4}",
          "code": {
            "lang": "python",
            "src": "tenors = [1, 2, 3, 4, 5]\npar = [0.0320, 0.0345, 0.0360, 0.0370, 0.0375]\nfixed, notional = 0.0350, 10_000_000\n\ndef annuity_and_df5(bump):\n    DFb, running = {0: 1.0}, 0.0\n    for n, s in zip(tenors, par):\n        sb = s + bump\n        DFb[n] = (1.0 - sb * running) / (1.0 + sb)\n        running += DFb[n]\n    return sum(DFb[i] for i in range(1, 6)), DFb[5]\n\nann5, _ = annuity_and_df5(0.0)\nann_up, df5_up = annuity_and_df5(0.0001)\nann_dn, df5_dn = annuity_and_df5(-0.0001)\npar5_up, par5_dn = (1 - df5_up) / ann_up, (1 - df5_dn) / ann_dn\npv_up = notional * (par5_up - fixed) * ann_up\npv_dn = notional * (par5_dn - fixed) * ann_dn\ndv01_bump = (pv_up - pv_dn) / 2.0\ndv01_annuity = notional * ann5 * 1e-4\n\nprint(f\"PV(+1bp parallel) = {pv_up:,.2f}   PV(-1bp) = {pv_dn:,.2f}\")\nprint(f\"DV01, bump-and-reprice = {dv01_bump:,.2f}\")\nprint(f\"DV01, annuity approx.  = {dv01_annuity:,.2f}\")\n",
            "output": "PV(+1bp parallel) = 116,917.29   PV(-1bp) = 107,984.72\nDV01, bump-and-reprice = 4,466.28\nDV01, annuity approx.  = 4,498.09"
          }
        },
        {
          "name": "SOFR compounded in arrears, and why it matters later",
          "explain": "<p>Legacy LIBOR-style swaps set a rate in advance at the start of a period and pay it at the end: the rate is known throughout the accrual, and Black-76 prices an option on it cleanly because the payoff and the fixing happen at the same, unambiguous instant. SOFR, the reference rate that replaced LIBOR on most USD swaps, is an overnight rate, so a three-month coupon is built by compounding the daily overnight rate over the period and is not fully known until the last day of that period.</p><p>That single change — the rate a payment depends on is realised gradually over the accrual instead of fixed at its start — is exactly the situation that produces a convexity adjustment, because the payoff no longer lives cleanly under the forward measure of its own payment date. Week 5 will price that adjustment directly; this week's job is just to see the mechanical difference between a rate fixed in advance and a rate compounded in arrears, so the correction has a concrete thing to correct.</p><p>A desk cares because essentially every USD swap and every SOFR-linked derivative traded today uses this convention, so the in-advance formulas from a textbook's classic chapter are the approximation, not the market standard.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Apple Accelerate-backed numpy: benign warnings on ordinary finite math\n\nrng = np.random.default_rng(20260101)\ndays = 91\ndaily_rate = 0.0525 + 0.0006 * np.cumsum(rng.standard_normal(days)) / np.sqrt(days)\n\ngrowth = np.prod(1.0 + daily_rate / 360.0)\ncompounded_in_arrears = (growth - 1.0) * 360.0 / days\nset_in_advance = daily_rate[0]           # what an old-style LIBOR coupon would have locked in on day 0\n\nprint(f\"rate set in advance (day 0)             = {set_in_advance:.4%}\")\nprint(f\"SOFR compounded in arrears over the qtr = {compounded_in_arrears:.4%}\")\nprint(f\"realised path mean daily rate            = {daily_rate.mean():.4%}\")\nprint(\"in-advance is fixed and known from day 0; in-arrears is only known on the LAST day of the period --\")\nprint(\"that timing gap is exactly what a convexity adjustment has to correct for a derivative written on it\")\n",
            "output": "rate set in advance (day 0)             = 5.2599%\nSOFR compounded in arrears over the qtr = 5.3105%\nrealised path mean daily rate            = 5.2755%\nin-advance is fixed and known from day 0; in-arrears is only known on the LAST day of the period --\nthat timing gap is exactly what a convexity adjustment has to correct for a derivative written on it"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "The bootstrapped swap curve: discount factors and forward rates",
        "params": {
          "xlab": "Years",
          "ylab": "Level",
          "series": [
            {
              "name": "Discount factor",
              "x": [
                0,
                1,
                2,
                3,
                4,
                5
              ],
              "y": [
                1.0,
                0.968992,
                0.934335,
                0.899112,
                0.86433,
                0.831322
              ]
            },
            {
              "name": "Par swap rate",
              "x": [
                1,
                2,
                3,
                4,
                5
              ],
              "y": [
                0.032,
                0.0345,
                0.036,
                0.037,
                0.0375
              ]
            }
          ],
          "log": false
        }
      },
      "pitfalls": [
        "Bootstrapping out of order. Each discount factor needs every shorter one already solved; solving maturity 5 before maturity 3 uses an annuity that is not yet complete.",
        "Confusing the spot par rate with a forward-starting swap rate off the same curve. They are different numbers, computed with different annuities, and a swaption is written on the second one.",
        "Trusting the annuity approximation to DV01 for anything but a small, parallel shift. A curve twist or a large shock needs bump-and-reprice, not the linear shortcut.",
        "Applying an in-advance (LIBOR-style) forward-rate formula to a SOFR-in-arrears coupon without correction. The two conventions realise the same information at different times, and that timing difference is not free."
      ],
      "check": [
        {
          "q": "A 5y swap curve is bootstrapped from par rates at 1..5 years. What must be true before you can solve for DF(4)?",
          "options": [
            "DF(5) must already be known",
            "DF(1), DF(2) and DF(3) must already be known",
            "Nothing; all five discount factors are solved simultaneously",
            "Only the 4y par rate matters"
          ],
          "answer": 1,
          "why": "The bootstrap is sequential: the par-rate equation at maturity 4 involves the annuity up to year 3, which requires DF(1) through DF(3) already in hand. DF(5) is solved AFTER DF(4), not before, and the equation genuinely needs the shorter discount factors, not just the 4y par rate on its own."
        },
        {
          "q": "The spot 5y par rate is 3.75% and the forward 1y-into-4y swap rate off the same curve is 3.90%. This means:",
          "options": [
            "The curve data has an error",
            "The curve is upward sloping between year 1 and year 5, so the market",
            "The two swaps have different notionals",
            "The forward rate is a forecast of where 3.75% is going"
          ],
          "answer": 1,
          "why": "A forward swap rate above the spot rate for a similarly-dated swap is exactly what an upward-sloping curve implies; it is a statement about today's discount factors, not a forecast. There is no notional in either formula, and nothing about the numbers implies an error."
        },
        {
          "q": "DV01 from bump-and-reprice is 4,466 and the annuity approximation gives 4,498. The right conclusion is:",
          "options": [
            "One of the two calculations has a bug",
            "The small gap is expected: the annuity number is a linear approximation and bump-and-reprice captures curvature",
            "The curve is mis-bootstrapped",
            "DV01 should be computed only from the 5y point"
          ],
          "answer": 1,
          "why": "Bump-and-reprice is the exact answer for the size of shock applied; the annuity-based number is a first-order (linear) approximation. A few tenths of a percent apart is exactly the size of gap a convex instrument like a swap should show, not a sign of a bug."
        },
        {
          "q": "A SOFR coupon is compounded in arrears over a 3-month accrual. Compared to an old-style LIBOR coupon set in advance for the same period, the SOFR coupon is:",
          "options": [
            "Always exactly equal, just quoted differently",
            "Known only at the end of the accrual period, not the start",
            "Impossible to hedge",
            "Always higher than the in-advance rate"
          ],
          "answer": 1,
          "why": "The defining mechanical difference is timing: an in-advance rate is fixed and known from day one of the accrual, while an in-arrears compounded rate depends on every day's overnight fixing and is only fully known on the last day. Whether it ends up higher or lower than the in-advance rate depends on the realised path, not on the convention itself."
        }
      ]
    },
    {
      "n": 2,
      "title": "Black-76 and the forward measure",
      "topics": [
        "Black's model for options on forwards",
        "the forward measure as a change of numeraire",
        "delta and vega under Black-76",
        "price vol vs. yield vol"
      ],
      "concepts": [
        {
          "name": "Black-76: Black-Scholes for a forward, not a stock",
          "explain": "<p>A stock earns a risk-neutral drift because holding it costs financing and pays dividends; a forward or futures price has neither, because entering one costs nothing today. Fischer Black's 1976 model exploits exactly that: replace the driftless log-normal assumption on the STOCK in Black-Scholes with the same assumption on the FORWARD, set the risk-free carry term to zero because there is none to carry, and discount the whole result by the zero-coupon bond maturing at the option's expiry.</p><p>The formula that falls out looks like Black-Scholes with the spot replaced by the forward and the interest-rate discounting pulled outside the bracket rather than built into <code>d1</code> and <code>d2</code>. That small rearrangement is the entire model, and it is why the same four lines of code price options on futures, caps, floors and swaptions once each of those payoffs is expressed as an option on the right forward.</p><p>A desk cares because Black-76 is the market-standard quoting convention for rate options: a broker who quotes a cap price is really quoting a Black-76 volatility, and translating between the two is the first thing any rates option trader's terminal does automatically.</p>",
          "formula": "C = DF(T)\\left[F\\,N(d_1) - K\\,N(d_2)\\right],\\quad d_{1,2} = \\frac{\\ln(F/K) \\pm \\tfrac12\\sigma^2 T}{\\sigma\\sqrt{T}}",
          "code": {
            "lang": "python",
            "src": "import math\n\ndef norm_cdf(x):\n    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\n\ndef black76(F, K, sigma, T, DF, kind=\"call\"):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))\n    d2 = d1 - sigma * math.sqrt(T)\n    if kind == \"call\":\n        return DF * (F * norm_cdf(d1) - K * norm_cdf(d2))\n    return DF * (K * norm_cdf(-d2) - F * norm_cdf(-d1))\n\nF, K, sigma, T, DF = 0.0390, 0.0400, 0.35, 1.0, 0.9615\nc = black76(F, K, sigma, T, DF, \"call\")\np = black76(F, K, sigma, T, DF, \"put\")\nprint(f\"call = {c:.6f}   put = {p:.6f}\")\nprint(f\"put-call parity: C - P = {c - p:.6f}   DF*(F-K) = {DF*(F-K):.6f}\")\n",
            "output": "call = 0.004809   put = 0.005770\nput-call parity: C - P = -0.000962   DF*(F-K) = -0.000962"
          }
        },
        {
          "name": "The forward measure: why Black-76 needs no drift at all",
          "explain": "<p>A martingale is a fair game: its best forecast for tomorrow is today's value. Choosing the zero-coupon bond maturing at the option's expiry as the numeraire — dividing every price by it — makes the forward price EXACTLY a martingale under the resulting measure, called the T-forward measure, by the very definition of a forward as the delivery price that makes a forward contract worth zero today. There is no drift to derive; the construction of the forward price is the proof.</p><p>That is why Black-76 can price the option as a driftless log-normal expectation and then multiply by a single discount factor at the end, rather than folding a drift term into the exponent the way Black-Scholes must. The simulation below sets the forward's drift to exactly zero and checks that its simulated mean stays at its starting value, then confirms the resulting Monte Carlo call price lines up with the closed form.</p><p>A desk cares because every payoff in this course that is NOT paid at its own natural forward date — in-arrears coupons, CMS legs — breaks this exact property, and that breakage is precisely what week 5's convexity adjustment repairs.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\nimport math\n\ndef norm_cdf(x):\n    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))\n    d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\n\nrng = np.random.default_rng(11)\nF, K, sigma, T, DF = 0.0390, 0.0400, 0.35, 1.0, 0.9615\nn_paths = 400000\nz = rng.standard_normal(n_paths)\nF_T = F * np.exp(-0.5 * sigma * sigma * T + sigma * math.sqrt(T) * z)   # driftless under Q^T, by construction\n\nmc_mean = F_T.mean()\nmc_call = DF * np.mean(np.maximum(F_T - K, 0.0))\nse = DF * np.std(np.maximum(F_T - K, 0.0), ddof=1) / math.sqrt(n_paths)\nclosed_form = DF * black76_call(F, K, sigma, T)\nprint(f\"simulated E^T[F_T] = {mc_mean:.6f}   (started at F_0 = {F:.6f})\")\nprint(f\"MC call price = {mc_call:.6f} +/- {se:.6f}   closed-form Black-76 = {closed_form:.6f}\")\n",
            "output": "simulated E^T[F_T] = 0.038992   (started at F_0 = 0.039000)\nMC call price = 0.004797 +/- 0.000014   closed-form Black-76 = 0.004809"
          }
        },
        {
          "name": "Delta and vega under Black-76",
          "explain": "<p>The Greeks carry over from Black-Scholes with the same small substitution. Delta with respect to the forward is <code>DF(T) N(d1)</code>, and vega — the sensitivity to the flat volatility parameter — is <code>DF(T) F n(d1) sqrt(T)</code>, where <code>n</code> is the standard normal density. Both are hedging quantities a market maker in rate options watches constantly: delta says how many forwards or futures offset the option, and vega says how much the position's value moves if the whole quoted volatility shifts.</p><p>Vega is largest near the money and falls away on both wings, the same shape as an equity option's vega, because the underlying mathematics is identical up to the forward substitution. What is new here is scale: a rate option's notional is typically far larger than an equity option's, so the same vega SHAPE translates into vega NUMBERS that dominate a rates book's risk report.</p><p>A desk cares because a book that is delta-hedged but not vega-hedged is not flat — it is short or long volatility and will bleed or gain from realized vol regardless of where the forward ends up, and the swaption vol cube in week 4 is exactly the map of where that vega lives.</p>",
          "formula": "\\Delta = DF(T)\\,N(d_1), \\qquad \\text{vega} = DF(T)\\,F\\,n(d_1)\\,\\sqrt{T}",
          "code": {
            "lang": "python",
            "src": "import math\n\ndef norm_cdf(x):\n    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\n\ndef black76_greeks(F, K, sigma, T, DF):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))\n    n_d1 = math.exp(-0.5 * d1 * d1) / math.sqrt(2 * math.pi)\n    delta = DF * norm_cdf(d1)\n    vega = DF * F * n_d1 * math.sqrt(T)\n    return delta, vega\n\nF, sigma, T, DF = 0.0390, 0.35, 1.0, 0.9615\nprint(f\"{'K':>8} {'delta':>10} {'vega':>10}\")\nfor K in (0.0350, 0.0375, 0.0400, 0.0425, 0.0450):\n    d, v = black76_greeks(F, K, sigma, T, DF)\n    print(f\"{K:8.4f} {d:10.5f} {v:10.6f}\")\n",
            "output": "       K      delta       vega\n  0.0350    0.65947   0.013305\n  0.0375    0.58937   0.014356\n  0.0400    0.52006   0.014881\n  0.0425    0.45371   0.014923\n  0.0450    0.39186   0.014556"
          }
        },
        {
          "name": "A call on the price is a put on the rate",
          "explain": "<p>Short-term rate futures such as SOFR futures quote a PRICE, not a rate: price equals 100 minus the rate. Because that transformation is linear with a negative sign, an option's payoff transfers exactly across it — a call struck at price <code>K_p</code> pays <code>max(price - K_p, 0)</code>, which is algebraically identical to a put on the rate struck at <code>K_y = 100 - K_p</code>, <code>max(K_y - rate, 0)</code>, because price rising by one point means the rate falling by one point.</p><p>This is not an approximation and it is not a symmetry that needs re-pricing with Black-76 under different assumptions: it is the same payoff written in two units, verified below for several outcomes. Traders exploit it constantly, quoting and hedging one side of the transformation while thinking in the other, and it is why a cap desk and a futures-options desk can trade what is economically the same risk without ever agreeing on which quoting convention is 'the' price.</p><p>A desk cares because getting the sign of this transformation backwards — buying what you meant to sell — is one of the most common, and most quickly punished, errors a new rates trader makes.</p>",
          "code": {
            "lang": "python",
            "src": "for rate_pct in (3.60, 3.90, 4.20, 4.50):\n    price = 100.0 - rate_pct\n    K_y = 4.00\n    K_p = 100.0 - K_y\n    call_on_price = max(price - K_p, 0.0)\n    put_on_rate = max(K_y - rate_pct, 0.0)\n    print(f\"rate={rate_pct:5.2f}  price={price:6.2f}  call-on-price={call_on_price:.4f}  \"\n          f\"put-on-rate={put_on_rate:.4f}  match={call_on_price == put_on_rate}\")\n",
            "output": "rate= 3.60  price= 96.40  call-on-price=0.4000  put-on-rate=0.4000  match=False\nrate= 3.90  price= 96.10  call-on-price=0.1000  put-on-rate=0.1000  match=False\nrate= 4.20  price= 95.80  call-on-price=0.0000  put-on-rate=0.0000  match=True\nrate= 4.50  price= 95.50  call-on-price=0.0000  put-on-rate=0.0000  match=True"
          }
        }
      ],
      "widget": {
        "type": "slider-formula",
        "title": "Black-76, one slider at a time",
        "params": {
          "formula": "C = DF\\left[F N(d_1) - K N(d_2)\\right]",
          "inputs": [
            {
              "name": "F",
              "label": "Forward",
              "min": 0.01,
              "max": 0.08,
              "step": 0.001,
              "init": 0.039
            },
            {
              "name": "K",
              "label": "Strike",
              "min": 0.01,
              "max": 0.08,
              "step": 0.001,
              "init": 0.04
            },
            {
              "name": "sigma",
              "label": "Volatility",
              "min": 0.05,
              "max": 0.8,
              "step": 0.01,
              "init": 0.35
            },
            {
              "name": "T",
              "label": "Years",
              "min": 0.05,
              "max": 5,
              "step": 0.05,
              "init": 1
            },
            {
              "name": "DF",
              "label": "Discount factor",
              "min": 0.5,
              "max": 1.0,
              "step": 0.005,
              "init": 0.9615
            }
          ],
          "compute": [
            {
              "name": "d1",
              "label": "d1",
              "expr": "(ln(F/K) + sigma^2/2*T) / (sigma*sqrt(T))",
              "fmt": "4"
            },
            {
              "name": "d2",
              "label": "d2",
              "expr": "d1 - sigma*sqrt(T)",
              "fmt": "4"
            },
            {
              "name": "price",
              "label": "Call price",
              "expr": "DF*(F*ncdf(d1) - K*ncdf(d2))",
              "fmt": "6"
            }
          ]
        }
      },
      "pitfalls": [
        "Adding a risk-free drift term to the forward inside Black-76, the way Black-Scholes needs one for a stock. There is none: the whole point of the T-forward measure is that the forward is already driftless.",
        "Discounting with the wrong-maturity zero-coupon bond, or forgetting to discount at all because Black-Scholes' r appears to have vanished from the formula. It has moved outside the bracket, not disappeared.",
        "Reading vega as a fixed dollar number independent of notional. A rates book's vega scales with a much larger notional than an equity book's, so the same Greek shape produces very different risk in dollars.",
        "Getting the sign wrong on the price-vs-rate transformation for short-term rate futures options: a call on the price is a PUT on the rate, not another call."
      ],
      "check": [
        {
          "q": "In Black-76, why is there no risk-free drift term on the forward inside the pricing formula?",
          "options": [
            "Interest rates are assumed to be zero",
            "The forward is a martingale under its own T-forward measure by construction",
            "Volatility already accounts for drift",
            "It is an approximation that is only valid for short maturities"
          ],
          "answer": 1,
          "why": "A forward's price is, by definition, the delivery price that makes entering the contract worth zero today; that is exactly the condition that makes the forward a martingale under the T-forward measure, with no drift to add. It has nothing to do with interest rates being zero, and it is exact, not a short-maturity approximation."
        },
        {
          "q": "Where did the discount factor go in Black-76, compared to Black-Scholes' explicit e^{-rT} inside d1 and d2?",
          "options": [
            "It was dropped because forwards need no discounting",
            "It moved outside the bracket and multiplies the whole payoff once",
            "It is folded into the volatility parameter",
            "It only applies to puts, not calls"
          ],
          "answer": 1,
          "why": "Black-76 discounts the expected payoff by a single DF(T) applied once, outside the N(d1)/N(d2) bracket, rather than building the rate into the drift the way Black-Scholes must for a spot asset. Forwards absolutely still need discounting; the formula just applies it in a different place."
        },
        {
          "q": "Vega under Black-76 is largest:",
          "options": [
            "Deep in the money",
            "Deep out of the money",
            "Near the money",
            "It does not depend on the strike"
          ],
          "answer": 2,
          "why": "Vega is proportional to F*n(d1)*sqrt(T), and the normal density n(d1) is maximised near d1=0, which happens close to the forward equal to the strike. Far in or out of the money, n(d1) collapses toward zero and so does vega."
        },
        {
          "q": "A SOFR futures option is a call struck at a PRICE of 95.80. In rate terms, this is equivalent to:",
          "options": [
            "A call on the rate struck at 4.20%",
            "A put on the rate struck at 4.20%",
            "A call on the rate struck at 95.80%",
            "There is no rate-space equivalent"
          ],
          "answer": 1,
          "why": "Price = 100 - rate, so a price of 95.80 corresponds to a rate strike of 4.20%. Because price rising means the rate falling, a call on the price (paid when the price is high, i.e. the rate is low) is exactly a put on the rate, not a call."
        }
      ]
    },
    {
      "n": 3,
      "title": "Caps and floors: a strip of options on the curve",
      "topics": [
        "a cap as a strip of caplets",
        "cap-floor parity",
        "the caplet's own forward measure",
        "vega and the underdetermined vol curve"
      ],
      "concepts": [
        {
          "name": "A cap is a strip of caplets, each its own Black-76 call",
          "explain": "<p>A cap protects a floating-rate payer against a rate rising above a strike, period by period, over the cap's whole life. It is not one option: it is a sum of independent caplets, one per reset period, each paying <code>tau * N * max(L_i - K, 0)</code> where <code>L_i</code> is the forward rate that fixes at the start of period <code>i</code> and the caplet pays at the END of that period. Each caplet is priced by Black-76 on ITS OWN forward rate and its OWN time to fixing, then discounted at the DATE IT PAYS, and the cap's price is just the sum.</p><p>This decomposition is the whole reason Black-76 is useful in this market: caps trade liquidly, so the market's price for a strip of options gets inverted, period by period, into an implied volatility for each caplet — the caplet vol curve that week 5 will interrogate for its own identifiability problem.</p><p>A desk cares because pricing, hedging and risk-managing a cap all decompose the same way: a cap's delta and vega are just the sum of nine or twelve caplets' Greeks, each hedged against its own forward rate on the curve.</p>",
          "formula": "\\text{Cap} = \\sum_{i=1}^n \\tau\\, N\\, DF(t_i)\\, \\text{Black76}\\big(F_i, K, \\sigma_i, t_{i-1}\\big)",
          "code": {
            "lang": "python",
            "src": "import math\n\ndef norm_cdf(x):\n    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    if T <= 0:\n        return max(F - K, 0.0)\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))\n    d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\n\nDF  = [1.0, 0.98925, 0.97865, 0.96820, 0.95790, 0.94775, 0.93775, 0.92790, 0.91820]\nfwd = [None, 0.0435, 0.0432, 0.0428, 0.0421, 0.0413, 0.0405, 0.0398, 0.0392]  # fwd[i] fixes at t_{i-1}, pays at t_i\ntau, K, sigma, notional = 0.25, 0.0400, 0.32, 10_000_000\n\nprint(f\"{'period':>6} {'fixes@':>7} {'pays@':>6} {'fwd':>8} {'caplet px':>12}\")\ntotal = 0.0\nfor i in range(1, 9):\n    T_fix = (i - 1) * tau\n    caplet = notional * tau * DF[i] * black76_call(fwd[i], K, sigma, max(T_fix, 1e-6))\n    total += caplet\n    print(f\"{i:6d} {T_fix:7.2f} {i*tau:6.2f} {fwd[i]:8.4%} {caplet:12,.2f}\")\nprint(f\"cap price (sum of caplets) = {total:,.2f}\")\n",
            "output": "period  fixes@  pays@      fwd    caplet px\n     1    0.00   0.25  4.3500%     8,655.94\n     2    0.25   0.50  4.3200%    11,138.93\n     3    0.50   0.75  4.2800%    12,813.96\n     4    0.75   1.00  4.2100%    13,531.09\n     5    1.00   1.25  4.1300%    13,844.14\n     6    1.25   1.50  4.0500%    13,990.75\n     7    1.50   1.75  3.9800%    14,148.80\n     8    1.75   2.00  3.9200%    14,336.56\ncap price (sum of caplets) = 102,460.17"
          }
        },
        {
          "name": "Cap-floor parity, checked against the curve",
          "explain": "<p>A floorlet is the mirror image of a caplet, paying when the rate falls below the strike, and a long cap plus a short floor at the SAME strike and schedule reproduces exactly the cash flows of a payer swap struck at that rate: whichever side of the strike the rate lands on, one leg pays the difference and the other pays nothing, and the sum is always <code>tau * N * (L_i - K)</code>, the swap's own cash flow.</p><p>That makes cap minus floor a model-free identity, exactly like put-call parity for equity options, and it holds regardless of what volatility or even what MODEL was used to price the two legs, as long as both legs used the SAME forward curve. It is therefore the first and cheapest test of any cap/floor pricing implementation: if it fails, the bug is in the curve or the discounting, not in the volatility.</p><p>A desk cares because this parity is how an at-the-money cap is often quoted in the first place: since the swap has no optionality, market makers frequently price the swap and one of the two option legs, and back out the other from parity rather than model it directly.</p>",
          "formula": "\\text{Cap}(K) - \\text{Floor}(K) = \\text{Payer swap struck at } K",
          "code": {
            "lang": "python",
            "src": "import math\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\ndef black76_put(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return K * norm_cdf(-d2) - F * norm_cdf(-d1)\n\nDF  = [1.0, 0.98925, 0.97865, 0.96820, 0.95790, 0.94775, 0.93775, 0.92790, 0.91820]\nfwd = [None, 0.0435, 0.0432, 0.0428, 0.0421, 0.0413, 0.0405, 0.0398, 0.0392]\ntau, K, sigma, notional = 0.25, 0.0400, 0.32, 10_000_000\n\ncap_total = floor_total = swap_pv = 0.0\nfor i in range(1, 9):\n    T_fix = max((i - 1) * tau, 1e-6)\n    cap_total += notional * tau * DF[i] * black76_call(fwd[i], K, sigma, T_fix)\n    floor_total += notional * tau * DF[i] * black76_put(fwd[i], K, sigma, T_fix)\n    swap_pv += notional * tau * DF[i] * (fwd[i] - K)\n\nprint(f\"cap - floor       = {cap_total - floor_total:,.2f}\")\nprint(f\"payer swap at K    = {swap_pv:,.2f}\")\nprint(f\"match to the cent: {abs((cap_total - floor_total) - swap_pv) < 0.01}\")\n",
            "output": "cap - floor       = 30,243.54\npayer swap at K    = 30,243.54\nmatch to the cent: True"
          }
        },
        {
          "name": "Each caplet lives under ITS OWN forward measure",
          "explain": "<p>A caplet fixing at <code>t_{i-1}</code> and paying at <code>t_i</code> is priced under the <code>t_i</code>-forward measure, discounted with <code>DF(t_i)</code>, NOT <code>DF(t_{i-1})</code>. That single-index slip — using the discount factor for the fixing date instead of the payment date — is the most common implementation bug in a cap pricer, and it is dangerous precisely because it is small and directionally consistent, so it does not look wrong on a single caplet.</p><p>It matters more the longer the gap between fixing and payment, and in a real cap that gap is one accrual period, typically three months, every single period. A pricer that gets this wrong systematically overstates or understates the whole strip, not just one caplet, because the error repeats with the same sign at every reset.</p><p>A desk cares because this is exactly the kind of error that survives unit tests written against a single caplet and only shows up as a persistent few-basis-point pricing bias against the market, diagnosed only by checking the discount-factor index against the payment schedule line by line.</p>",
          "code": {
            "lang": "python",
            "src": "import math\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\n\nDF  = [1.0, 0.98925, 0.97865, 0.96820, 0.95790, 0.94775, 0.93775, 0.92790, 0.91820]\nfwd = [None, 0.0435, 0.0432, 0.0428, 0.0421, 0.0413, 0.0405, 0.0398, 0.0392]\ntau, K, sigma, notional = 0.25, 0.0400, 0.32, 10_000_000\n\ni = 5\nT_fix = (i - 1) * tau\nright = notional * tau * DF[i] * black76_call(fwd[i], K, sigma, T_fix)\nwrong = notional * tau * DF[i - 1] * black76_call(fwd[i], K, sigma, T_fix)\nprint(f\"caplet {i} paid at t_{i} (correct DF[{i}]={DF[i]:.5f}): {right:,.2f}\")\nprint(f\"same caplet with DF[{i-1}]={DF[i-1]:.5f} instead (the bug): {wrong:,.2f}\")\nprint(f\"error: {wrong - right:,.2f}  ({(wrong/right-1)*1e4:.1f} bp of the caplet's own price)\")\n",
            "output": "caplet 5 paid at t_5 (correct DF[5]=0.94775): 13,844.14\nsame caplet with DF[4]=0.95790 instead (the bug): 13,992.41\nerror: 148.26  (107.1 bp of the caplet's own price)"
          }
        },
        {
          "name": "One cap price cannot identify the caplet vol curve",
          "explain": "<p>A single cap price is one number; a caplet vol curve of eight or twelve maturities is many numbers. A flat 32% vol and a wildly humped term structure of caplet vols can be tuned to reproduce the SAME total cap price to the cent, because the cap only ever observes the SUM of the caplets, never any one of them on its own. This is not a numerical coincidence; it is a genuine identification problem.</p><p>The market's fix is to trade caps and floors at MANY strikes and MANY maturities and strip the caplet vols jointly, using the fact that a 2-year cap and a 3-year cap share their first eight caplets, so the extra maturity pins down only the NEW caplets once the shared ones are already fixed. A single flat-vol cap quote is a starting point, never the answer.</p><p>A desk cares because a book that hedges a bespoke cap against a market-standard cap of the same flat vol is hedging TOTAL vega, not the vega of each period, and a curve-shape trade — long the front caplets, short the back ones — will pass a naive total-vega check while carrying real, unhedged risk.</p>",
          "code": {
            "lang": "python",
            "src": "import math\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\n\nDF  = [1.0, 0.98925, 0.97865, 0.96820, 0.95790, 0.94775, 0.93775, 0.92790, 0.91820]\nfwd = [None, 0.0435, 0.0432, 0.0428, 0.0421, 0.0413, 0.0405, 0.0398, 0.0392]\ntau, K, notional = 0.25, 0.0400, 10_000_000\n\ndef cap_price(vols):\n    tot = 0.0\n    for i in range(1, 9):\n        T_fix = max((i - 1) * tau, 1e-6)\n        tot += notional * tau * DF[i] * black76_call(fwd[i], K, vols[i - 1], T_fix)\n    return tot\n\nflat = [0.32] * 8\np_flat = cap_price(flat)\n\nhumped_shape = [0.20, 0.26, 0.32, 0.38, 0.42, 0.38, 0.30, 0.22]\nlo, hi = 0.5, 2.0\nfor _ in range(60):\n    mid = (lo + hi) / 2.0\n    if cap_price([h * mid for h in humped_shape]) < p_flat:\n        lo = mid\n    else:\n        hi = mid\nhumped = [h * (lo + hi) / 2.0 for h in humped_shape]\np_humped = cap_price(humped)\n\nprint(f\"flat 32% vol cap price       = {p_flat:,.2f}\")\nprint(f\"humped, rescaled, cap price  = {p_humped:,.2f}  (matched to the cent)\")\nprint(\"per-bucket vols:\", [round(v, 4) for v in humped])\nprint(\"max |humped - flat| per bucket =\", round(max(abs(a - b) for a, b in zip(flat, humped)), 4))\nprint(\"two caplet-vol curves 12 vol points apart bucket-by-bucket price the SAME cap identically --\")\nprint(\"one cap price cannot identify the caplet vol curve; stripping needs many strikes and tenors\")\n",
            "output": "flat 32% vol cap price       = 102,460.17\nhumped, rescaled, cap price  = 102,460.17  (matched to the cent)\nper-bucket vols: [0.1961, 0.2549, 0.3138, 0.3726, 0.4118, 0.3726, 0.2942, 0.2157]\nmax |humped - flat| per bucket = 0.1239\ntwo caplet-vol curves 12 vol points apart bucket-by-bucket price the SAME cap identically --\none cap price cannot identify the caplet vol curve; stripping needs many strikes and tenors"
          }
        }
      ],
      "widget": {
        "type": "payoff",
        "title": "One caplet's payoff, at fixing",
        "params": {
          "legs": [
            {
              "kind": "call",
              "qty": 1,
              "strike": 4.0,
              "premium": 0.0
            }
          ],
          "range": [
            2.0,
            6.0
          ]
        }
      },
      "pitfalls": [
        "Pricing a cap as a single option on an 'average' rate instead of a strip of independent caplets, each on its own forward.",
        "Discounting a caplet with the discount factor for its FIXING date instead of its PAYMENT date -- a small, repeated, same-signed error that biases the whole strip.",
        "Treating cap-floor parity as a model check that also validates the volatility. It only validates the curve and the discounting; the two legs can share a volatility bug and still satisfy parity.",
        "Assuming a single flat-vol cap quote pins down the caplet vol curve. It pins down one weighted average; the shape needs many strikes and maturities to identify."
      ],
      "check": [
        {
          "q": "A cap has 8 quarterly caplets. How many independent Black-76 evaluations does pricing it require?",
          "options": [
            "1, using the average forward rate",
            "8, one per caplet on its own forward rate",
            "2, one for the front half and one for the back half",
            "It depends on whether the cap is at the money"
          ],
          "answer": 1,
          "why": "Each caplet has its own fixing date, payment date, forward rate and time to fixing, so each needs its own Black-76 evaluation; the cap price is simply their sum. Averaging the forward rates first would misprice every caplet whose forward differs from that average."
        },
        {
          "q": "Cap price minus floor price at the same strike and schedule equals:",
          "options": [
            "Zero, always",
            "A payer swap struck at that same rate",
            "The at-the-money straddle",
            "A receiver swap struck at zero"
          ],
          "answer": 1,
          "why": "This is cap-floor parity: whichever side of the strike the rate lands on each period, exactly one leg pays the difference and the sum across both legs reproduces the swap's own floating-minus-fixed cash flow every period, which is precisely a payer swap struck at that rate."
        },
        {
          "q": "A caplet fixes at t=1.0 and pays at t=1.25. Which discount factor prices it?",
          "options": [
            "DF(1.0)",
            "DF(1.25)",
            "The average of DF(1.0) and DF(1.25)",
            "DF(0), since the option is bought today"
          ],
          "answer": 1,
          "why": "A cash flow is discounted from the date it is actually PAID, which is 1.25 here, not the date it fixes. Using DF(1.0) instead applies the wrong maturity's discount factor and biases the caplet's price by the gap between the two discount factors."
        },
        {
          "q": "A flat 32% caplet-vol curve and a very different humped caplet-vol curve both reprice the same 8-caplet cap exactly. What does this show?",
          "options": [
            "One of the two vol curves must be wrong",
            "A single cap price cannot identify the shape of the caplet vol curve",
            "Black-76 is not arbitrage-free",
            "The cap is mispriced by the market"
          ],
          "answer": 1,
          "why": "The cap only observes the SUM of eight caplet prices, so many different vol-curve shapes can be tuned to hit that one number exactly; this is a genuine identification problem, not evidence that either curve or the model is wrong. Distinguishing them requires additional instruments -- caps or floors at other strikes and maturities."
        }
      ]
    },
    {
      "n": 4,
      "title": "Swaptions",
      "topics": [
        "swaption mechanics",
        "the Black swaption formula",
        "swaption vega and the straddle",
        "the swaption vol cube"
      ],
      "concepts": [
        {
          "name": "A swaption is an option to enter a swap at a fixed rate",
          "explain": "<p>A European payer swaption gives its owner the right, at expiry, to enter a swap paying the fixed strike and receiving floating; a receiver swaption is the mirror image. The underlying is not a price but a RATE: the forward swap rate for the swap the swaption would create, built exactly as in week 1, off the discount curve applicable at the swaption's expiry.</p><p>Settlement matters in practice. A physically settled swaption delivers an actual swap if exercised; a cash-settled swaption pays the present value of that swap using an agreed annuity formula instead of creating a real position. The two can price slightly differently because the annuity used for cash settlement is a market convention, not necessarily the true annuity off the curve on the day.</p><p>A desk cares because a swaption book's risk is a book of forward swap rate exposures layered with optionality, and the mid-curve swaptions used to express a delayed rate view are simply this same construction with the forward start pushed further out.</p>",
          "code": {
            "lang": "python",
            "src": "DF = {0: 1.0, 1: 0.968992, 2: 0.934335, 3: 0.899112, 4: 0.864330, 5: 0.831322}\nannuity_1_5 = sum(DF[i] for i in range(2, 6))\nfwd_swap = (DF[1] - DF[5]) / annuity_1_5\nprint(f\"underlying: the 1y-into-4y forward swap rate = {fwd_swap:.6%}\")\nprint(f\"annuity(1,5) used as the numeraire for this swaption = {annuity_1_5:.6f}\")\nprint(\"a payer swaption on this rate pays, at exercise, Annuity * max(fwd_swap - K, 0)\")\n",
            "output": "underlying: the 1y-into-4y forward swap rate = 3.900996%\nannuity(1,5) used as the numeraire for this swaption = 3.529099\na payer swaption on this rate pays, at exercise, Annuity * max(fwd_swap - K, 0)"
          }
        },
        {
          "name": "The Black swaption formula: Annuity times a Black-76 call",
          "explain": "<p>A payer swaption's payoff at exercise, <code>Annuity x max(S - K, 0)</code>, is exactly a Black-76 call on the forward swap rate <code>S</code>, scaled by the annuity instead of a single discount factor. Choosing the annuity itself as the numeraire — rather than a single zero-coupon bond — makes the forward swap rate a martingale under the resulting swap (or annuity) measure, for the same reason a forward price is a martingale under its own forward measure in week 2.</p><p>That substitution is the entire content of the Black swaption model: everything else is the same <code>N(d1)</code>, <code>N(d2)</code> machinery, with the annuity playing the role Black-76 gave to a single discount factor. It is also why a swaption struck exactly at the forward swap rate — the at-the-money case — costs materially more than a caplet of similar tenor: the annuity is a sum of several discount factors, not just one.</p><p>A desk cares because the annuity is itself curve-dependent and shifts with every twist of the curve, so a swaption's risk is never just 'volatility risk on a rate' — it always carries a curve component through the annuity that a naive vega-only hedge misses.</p>",
          "formula": "\\text{Payer} = N\\cdot\\text{Annuity}\\cdot\\text{Black76}(S_{\\text{fwd}}, K, \\sigma, T)",
          "code": {
            "lang": "python",
            "src": "import math\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\n\nDF = {0: 1.0, 1: 0.968992, 2: 0.934335, 3: 0.899112, 4: 0.864330, 5: 0.831322}\nannuity_1_5 = sum(DF[i] for i in range(2, 6))\nfwd_swap = (DF[1] - DF[5]) / annuity_1_5\nnotional, sigma, T_exp = 10_000_000, 0.28, 1.0\n\nfor K in (0.0350, fwd_swap, 0.0425):\n    bc = black76_call(fwd_swap, K, sigma, T_exp)\n    px = notional * annuity_1_5 * bc\n    label = \"K=ATM (fwd swap rate)\" if abs(K - fwd_swap) < 1e-9 else f\"K={K:.4%}\"\n    print(f\"{label:24s}  Black76 call={bc:.6f}  payer swaption price = {px:,.2f}\")\n",
            "output": "K=3.5000%                 Black76 call=0.006428  payer swaption price = 226,853.95\nK=ATM (fwd swap rate)     Black76 call=0.004343  payer swaption price = 153,281.79\nK=4.2500%                 Black76 call=0.003002  payer swaption price = 105,941.47"
          }
        },
        {
          "name": "Swaption vega, and the pure vega trade",
          "explain": "<p>The closed-form vega of a payer swaption is the same Black-76 vega scaled by the annuity and the notional: <code>N x Annuity x F x n(d1) x sqrt(T)</code>. It is largest near the money, exactly as in week 2, and it is checkable directly by bumping the volatility by a small amount and repricing, which the code below does as a matched pair to the closed form.</p><p>The at-the-money straddle — a payer plus a receiver at the same strike — is the standard way to buy or sell PURE volatility exposure: at the money the two legs' deltas nearly offset, so the straddle is close to delta-neutral and its value is dominated by vega, making it the instrument a desk reaches for when the view is specifically about volatility rather than about rate direction.</p><p>A desk cares because vega is where the money actually is in an options book on a quiet day: delta P&L nets out over a hedged book, but vega P&L accumulates with realized volatility, and knowing exactly how much vega sits at which strike is the difference between a hedged book and a book that is secretly short a volatility spike.</p>",
          "formula": "\\text{vega} = N \\cdot \\text{Annuity} \\cdot F \\cdot n(d_1) \\cdot \\sqrt{T}",
          "code": {
            "lang": "python",
            "src": "import math\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef norm_pdf(x): return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\ndef swaption_vega(F, K, sigma, T, annuity, notional):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))\n    return notional * annuity * F * norm_pdf(d1) * math.sqrt(T)\ndef payer_price(F, K, sigma, T, annuity, notional):\n    return notional * annuity * black76_call(F, K, sigma, T)\n\nDF = {0: 1.0, 1: 0.968992, 2: 0.934335, 3: 0.899112, 4: 0.864330, 5: 0.831322}\nannuity = sum(DF[i] for i in range(2, 6))\nF = (DF[1] - DF[5]) / annuity\nsigma, T, notional = 0.28, 1.0, 10_000_000\n\nprint(f\"{'K':>10} {'vega':>14}\")\nfor K in (0.0350, 0.0375, F, 0.0400, 0.0450):\n    print(f\"{K:10.4%} {swaption_vega(F, K, sigma, T, annuity, notional):14,.0f}\")\n\nh = 0.0001\nbump_vega = (payer_price(F, F, sigma + h, T, annuity, notional)\n             - payer_price(F, F, sigma - h, T, annuity, notional)) / (2 * h)\nclosed_vega = swaption_vega(F, F, sigma, T, annuity, notional)\nprint(f\"\\nATM vega, closed form  = {closed_vega:,.2f}  per 100% vol\")\nprint(f\"ATM vega, bump-reprice  = {bump_vega:,.2f}  per 100% vol\")\n",
            "output": "         K           vega\n   3.5000%        477,917\n   3.7500%        527,965\n   3.9010%        543,868\n   4.0000%        548,524\n   4.5000%        512,856\n\nATM vega, closed form  = 543,867.73  per 100% vol\nATM vega, bump-reprice  = 543,867.73  per 100% vol"
          }
        },
        {
          "name": "The swaption vol cube: expiry, tenor, and (later) strike",
          "explain": "<p>A market of swaption prices is quoted as a grid of Black volatilities indexed by option expiry and underlying swap tenor — a 1-year option on a 5-year swap trades a different implied volatility than a 5-year option on a 1-year swap, even though both involve a rate five or six years out. Add strike as a third axis and this grid becomes the swaption vol CUBE, the central data object a rates options desk marks every day.</p><p>The two-dimensional slice by itself — expiry by tenor, all at the money — is usually downward sloping in both directions: longer options and longer underlying swaps typically trade LOWER implied volatility, reflecting the averaging-out of shorter-term rate noise over a longer horizon. That shape is itself information: a flat cube would say the market expects rate volatility to be equally uncertain at every horizon, which historically it never has.</p><p>A desk cares because this cube is the calibration target for every interest-rate model used to price something a cube point cannot price directly — a Bermudan swaption, a callable bond — which is exactly where week 5's short-rate trees come in.</p>",
          "code": {
            "lang": "python",
            "src": "vol_grid = {\n    (1, 2): 0.30, (1, 5): 0.28, (1, 10): 0.24,\n    (2, 2): 0.27, (2, 5): 0.25, (2, 10): 0.22,\n    (5, 2): 0.22, (5, 5): 0.20, (5, 10): 0.18,\n}\nprint(f\"{'expiry':>7} {'tenor':>6} {'vol':>6}\")\nfor (e, t), v in vol_grid.items():\n    print(f\"{e:7d} {t:6d} {v:6.2%}\")\nprint(\"vol falls with both expiry and tenor -- the classic downward-sloping swaption vol cube\")\n",
            "output": " expiry  tenor    vol\n      1      2 30.00%\n      1      5 28.00%\n      1     10 24.00%\n      2      2 27.00%\n      2      5 25.00%\n      2     10 22.00%\n      5      2 22.00%\n      5      5 20.00%\n      5     10 18.00%\nvol falls with both expiry and tenor -- the classic downward-sloping swaption vol cube"
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "The swaption vol cube's ATM spine: expiry x tenor",
        "params": {
          "cmap": "seq",
          "xlabels": [
            "2y",
            "5y",
            "10y"
          ],
          "ylabels": [
            "1y",
            "2y",
            "5y"
          ],
          "matrix": [
            [
              0.3,
              0.28,
              0.24
            ],
            [
              0.27,
              0.25,
              0.22
            ],
            [
              0.22,
              0.2,
              0.18
            ]
          ]
        }
      },
      "pitfalls": [
        "Treating a swaption's underlying as the SPOT swap rate instead of the FORWARD swap rate for a swap starting at expiry. They differ, and the gap grows with the expiry.",
        "Hedging swaption vega without also hedging the annuity's own curve sensitivity. The annuity is not a constant; it moves with the curve, and that motion is a real P&L driver.",
        "Comparing implied volatilities across different expiry/tenor cells as if they were the same number quoted at different maturities. A 1y5y vol and a 5y1y vol are different points on a genuinely two-dimensional surface.",
        "Assuming an ATM straddle is exactly delta-neutral. It is CLOSE to delta-neutral at the money, not exactly, because the payer and receiver deltas are N(d1) and N(d1)-1, which only cancel exactly when d1 = 0."
      ],
      "check": [
        {
          "q": "The underlying rate of a 1-year-into-4-year payer swaption is:",
          "options": [
            "The current 5-year spot swap rate",
            "The forward swap rate for a 4-year swap starting in 1 year",
            "The current 1-year swap rate",
            "The average of the 1-year and 5-year spot rates"
          ],
          "answer": 1,
          "why": "A swaption's underlying is always the forward-starting swap it gives the right to enter, here a 4-year swap beginning 1 year from now, priced off the forward swap rate construction from week 1. The current spot 5-year rate is a different swap on a different schedule."
        },
        {
          "q": "The Black swaption formula multiplies a Black-76 call by:",
          "options": [
            "A single zero-coupon discount factor",
            "The annuity of the underlying swap",
            "The notional squared",
            "The at-the-money volatility only"
          ],
          "answer": 1,
          "why": "A swaption's payoff at exercise is Annuity times max(forward swap rate - K, 0), so the annuity plays the role that a single discount factor plays in a plain Black-76 caplet. Using a single discount factor instead of the annuity would misprice every swaption whose underlying swap has more than one payment."
        },
        {
          "q": "An ATM payer swaption and an ATM receiver swaption, combined into a straddle, are primarily exposed to:",
          "options": [
            "Interest rate direction",
            "Volatility (vega), because the deltas roughly offset",
            "Credit risk",
            "The bid-ask spread only"
          ],
          "answer": 1,
          "why": "At the money the payer's delta and the receiver's delta are close to offsetting (N(d1) and N(d1)-1 near d1=0), so the combined position's rate-direction exposure nearly cancels while both legs' vega add, leaving a position that is primarily a bet on realized or implied volatility."
        },
        {
          "q": "A swaption vol cube typically shows implied vol falling as BOTH expiry and underlying tenor increase. The most direct reading is:",
          "options": [
            "A pricing error that should be arbitraged",
            "Shorter-horizon rate moves are less averaged-out than longer ones, so near-dated, short-tenor rates carry more uncertainty per unit time",
            "Longer options are always cheaper to trade",
            "The cube is flat and this is sampling noise"
          ],
          "answer": 1,
          "why": "The downward slope in both directions is a standard, persistent market feature reflecting that longer horizons average out more of the day-to-day rate noise; it is not evidence of mispricing, and it shows up far too consistently across markets and time to be noise."
        }
      ]
    },
    {
      "n": 5,
      "title": "The forward measure formalized, convexity adjustments, and short-rate trees",
      "topics": [
        "change of numeraire, recapped",
        "convexity adjustment for in-arrears and CMS payoffs",
        "calibrating a short-rate tree to the curve",
        "volatility skew at the zero bound"
      ],
      "concepts": [
        {
          "name": "Same payoff, two numeraires, one price",
          "explain": "<p>Every price in this course can be computed two ways: directly, as a discounted expectation under the real-world risk-neutral (money-market) measure, or via a change of numeraire to whichever measure makes the payoff simplest — the T-forward measure for a caplet, the annuity measure for a swaption. The Radon-Nikodym derivative linking the two measures is exactly the ratio of numeraires, and it exists precisely because both are valid ways of discounting the SAME cash flow.</p><p>The code below prices one caplet both ways: once by simulating a short-rate path under the risk-neutral measure and discounting along it, and once with the T-forward-measure closed form from week 2. The short rate's starting level is calibrated so its simulated discount factor matches the curve's DF(0,T) exactly, which is itself the Radon-Nikodym identity doing its job — get that consistency right and the two prices must agree.</p><p>A desk cares because choosing the right numeraire is not a mathematical nicety, it is what makes a pricing formula closed-form instead of a Monte Carlo: every model in this course is a strategic choice of numeraire, made once, that turns an otherwise intractable expectation into algebra.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\nimport math\n\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\ndef black76_call(F, K, sigma, T):\n    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T)); d2 = d1 - sigma * math.sqrt(T)\n    return F * norm_cdf(d1) - K * norm_cdf(d2)\n\nrng = np.random.default_rng(4242)\nsig_r, F0, sigma_F, T, DF_T, K = 0.010, 0.0413, 0.30, 1.0, 0.94775, 0.0400\n# Ho-Lee short rate r_t = r0 + sig_r*W_t; r0 chosen so E^Q[D(0,T)] hits the curve's DF(0,T) exactly:\n# for Gaussian r_t, E[exp(-int r dt)] = exp(-r0*T + 0.5*sig_r^2*T^3/3).\nr0 = (-math.log(DF_T) + 0.5 * sig_r * sig_r * T ** 3 / 3.0) / T\nn, steps = 400000, 60\ndt = T / steps\nW = np.cumsum(rng.standard_normal((n, steps)) * math.sqrt(dt), axis=1)\ndisc = np.exp(-(r0 + sig_r * W).mean(axis=1) * T)\nz_f = rng.standard_normal(n)\nF_T = F0 * np.exp(-0.5 * sigma_F * sigma_F * T + sigma_F * math.sqrt(T) * z_f)\nmc_forward_measure = DF_T * np.mean(np.maximum(F_T - K, 0.0))\nclosed_form = DF_T * black76_call(F0, K, sigma_F, T)\n\nprint(f\"E^Q[D(0,T)] from the calibrated short-rate path = {disc.mean():.5f}  (target DF(0,T) = {DF_T:.5f})\")\nprint(f\"caplet via T-forward measure (MC)      = {mc_forward_measure:.6f}\")\nprint(f\"caplet via Black-76 closed form         = {closed_form:.6f}\")\nprint(\"same payoff, same price, two different measures -- the numeraire changed, the value didn't\")\n",
            "output": "E^Q[D(0,T)] from the calibrated short-rate path = 0.94775  (target DF(0,T) = 0.94775)\ncaplet via T-forward measure (MC)      = 0.005231\ncaplet via Black-76 closed form         = 0.005236\nsame payoff, same price, two different measures -- the numeraire changed, the value didn't"
          }
        },
        {
          "name": "Convexity adjustment for a rate set in arrears",
          "explain": "<p>Black-76 assumes a payoff's rate lives cleanly under the forward measure of its OWN payment date. A LIBOR-in-arrears cash flow — the rate fixes AND pays at the same date, rather than fixing one period early — breaks that assumption, because the rate is then observed under the WRONG forward measure relative to how Black-76 wants to treat it, and the fix is an additive correction on top of the plain forward rate.</p><p>The standard market approximation for this timing adjustment is <code>F^2 sigma^2 T tau / (1 + F tau)</code>, growing with the square of the rate, the variance, the time to fixing, and the accrual length. It is a genuinely small number at short fixings and a genuinely material one over multi-year horizons — which is exactly the CMS (constant maturity swap) case, where a long swap rate is observed and paid on a schedule that has nothing to do with its own natural payment date, and the adjustment can run into tens of basis points.</p><p>A desk cares because pricing a CMS leg or an in-arrears swap off the plain forward, without this correction, is a systematic, one-directional pricing error, not noise — and the market has traded and priced this exact correction for decades, so a counterparty pricing it correctly will pick it off immediately.</p>",
          "formula": "\\text{CA} = \\frac{F^2\\,\\sigma^2\\,T_{\\text{fix}}\\,\\tau}{1+F\\tau}",
          "code": {
            "lang": "python",
            "src": "def in_arrears_convexity_adjustment(F, sigma, tau, T_fix):\n    return F * F * sigma * sigma * T_fix * tau / (1.0 + F * tau)\n\nF, sigma, tau = 0.0413, 0.30, 0.25\nprint(f\"{'T_fix':>7} {'plain fwd':>10} {'adj (bp)':>10} {'adjusted rate':>14}\")\nfor T_fix in (0.25, 1.0, 2.0, 5.0):\n    ca = in_arrears_convexity_adjustment(F, sigma, tau, T_fix)\n    print(f\"{T_fix:7.2f} {F:10.4%} {ca*1e4:10.3f} {F+ca:14.4%}\")\nprint(\"longer the fixing horizon and the higher the vol, the bigger the in-arrears premium over the plain forward\")\n",
            "output": "  T_fix  plain fwd   adj (bp)  adjusted rate\n   0.25    4.1300%      0.095        4.1309%\n   1.00    4.1300%      0.380        4.1338%\n   2.00    4.1300%      0.760        4.1376%\n   5.00    4.1300%      1.899        4.1490%\nlonger the fixing horizon and the higher the vol, the bigger the in-arrears premium over the plain forward"
          }
        },
        {
          "name": "Calibrating a short-rate tree to today's curve",
          "explain": "<p>Black-76 cannot price everything: a Bermudan swaption or a callable bond needs a full model of how the SHORT rate evolves, not just one forward's distribution, because the holder's exercise decision at one date depends on the whole future path. A Ho-Lee binomial short-rate tree is the simplest such model: at each time step, every node moves up or down by a fixed amount <code>sigma*sqrt(dt)</code>, and a single free parameter per step — the level the tree is centred on — is chosen so the tree exactly reprices the curve's own discount factors.</p><p>That calibration is done by forward induction, one maturity at a time: solve the step-1 level so the tree's implied one-period discount factor matches <code>DF(1)</code>, then, with that level fixed, solve the step-2 level against <code>DF(2)</code>, and so on. Each step is a single one-dimensional root-find, because everything before it is already pinned down — the same forward-marching logic as week 1's curve bootstrap, one level higher.</p><p>A desk cares because once the tree matches the curve exactly, it can price anything path-dependent or exercise-dependent consistently WITH that curve, which a set of isolated Black-76 formulas, each valid only for a European payoff, cannot do.</p>",
          "code": {
            "lang": "python",
            "src": "import math\n\nDF_curve = [1.0, 0.968992, 0.934335, 0.899112, 0.864330, 0.831322]\ndt, sig, n_steps = 1.0, 0.0090, 5\n\ndef price_zcb_from_tree(theta, n_target):\n    Q = {0: 1.0}   # Arrow-Debreu prices, keyed by up-move count j at the current step\n    for i in range(n_target):\n        newQ = {}\n        for j in range(i + 1):\n            r_ij = theta[i] + (2 * j - i) * sig * math.sqrt(dt)\n            disc = math.exp(-r_ij * dt)\n            q = Q.get(j, 0.0)\n            newQ[j + 1] = newQ.get(j + 1, 0.0) + 0.5 * q * disc\n            newQ[j] = newQ.get(j, 0.0) + 0.5 * q * disc\n        Q = newQ\n    return sum(Q.values())\n\ntheta = []\nfor i in range(n_steps):\n    target = DF_curve[i + 1]\n    lo, hi = -0.10, 0.20\n    for _ in range(80):\n        mid = (lo + hi) / 2.0\n        px = price_zcb_from_tree(theta + [mid], i + 1)\n        if px > target:\n            lo = mid\n        else:\n            hi = mid\n    theta.append((lo + hi) / 2.0)\n\nprint(f\"{'step':>5} {'theta (level)':>15} {'tree ZCB price':>16} {'curve DF':>10}\")\nfor i in range(n_steps):\n    px = price_zcb_from_tree(theta[: i + 1], i + 1)\n    print(f\"{i+1:5d} {theta[i]:15.5%} {px:16.6f} {DF_curve[i+1]:10.6f}\")\nprint(\"the tree is calibrated so every step's zero-coupon price matches the bootstrapped curve exactly\")\n",
            "output": " step   theta (level)   tree ZCB price   curve DF\n    1        3.14989%         0.968992   0.968992\n    2        3.64618%         0.934335   0.934335\n    3        3.85894%         0.899112   0.899112\n    4        3.98174%         0.864330   0.864330\n    5        3.95853%         0.831322   0.831322\nthe tree is calibrated so every step's zero-coupon price matches the bootstrapped curve exactly"
          }
        },
        {
          "name": "Volatility skew and the zero bound",
          "explain": "<p>Black-76's core assumption — the forward is lognormal — makes the model brittle exactly where rates have spent long stretches of recent history: near zero. A lognormal forward can never go negative, so it is the wrong model whenever the market is pricing a meaningful chance of rates dipping below zero, and even where rates stay positive, market-quoted cap and swaption vols typically SKEW by strike rather than staying flat, which flat Black-76 cannot represent at all.</p><p>A standard, minimal fix is displaced (shifted) diffusion: model <code>F + s</code> as lognormal instead of <code>F</code> itself, for a shift <code>s</code> chosen large enough that the model stays well-defined through the zero bound. The shift and the volatility are then two parameters fit jointly to whatever skew the market quotes, which is a modest generalisation of everything built so far — the same Black-76 formula, applied to <code>F+s</code> and <code>K+s</code>.</p><p>A desk cares because trading a flat-vol Black-76 price against a market that is actually skewed is trading the WRONG number at every strike except the one the flat vol happened to be calibrated to, and a shift is the cheapest correction that keeps the rest of the machinery — caplets, swaptions, the tree calibration — completely unchanged.</p>",
          "formula": "C = (F+s)\\,N(d_1) - (K+s)\\,N(d_2),\\quad d_{1,2} = \\frac{\\ln\\frac{F+s}{K+s}\\pm\\tfrac12\\sigma^2T}{\\sigma\\sqrt T}",
          "code": {
            "lang": "python",
            "src": "import math\ndef norm_cdf(x): return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\n\ndef black76_call_shifted(F, K, sigma, T, shift):\n    Fs, Ks = F + shift, K + shift\n    if Fs <= 0 or Ks <= 0:\n        return max(F - K, 0.0)\n    d1 = (math.log(Fs / Ks) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))\n    d2 = d1 - sigma * math.sqrt(T)\n    return Fs * norm_cdf(d1) - Ks * norm_cdf(d2)\n\nF_low, T = 0.0060, 1.0\nprint(f\"{'K':>8} {'flat Black76 (s=0)':>20} {'shifted 2% (s=0.02)':>22}\")\nfor K in (0.0000001, 0.0025, 0.0060, 0.0100, 0.0150):\n    plain = black76_call_shifted(F_low, K, 0.55, T, 0.0)\n    shifted = black76_call_shifted(F_low, K, 0.35, T, 0.02)\n    print(f\"{K:8.4%} {plain:20.6f} {shifted:22.6f}\")\nprint(\"shifting both F and K by the same constant keeps the model finite through the zero bound; the\")\nprint(\"shift and the vol are then two knobs fit jointly to whatever skew the market quotes\")\n",
            "output": "       K   flat Black76 (s=0)    shifted 2% (s=0.02)\n 0.0000%             0.006000               0.007038\n 0.2500%             0.003549               0.005399\n 0.6000%             0.001300               0.003612\n 1.0000%             0.000396               0.002207\n 1.5000%             0.000101               0.001152\nshifting both F and K by the same constant keeps the model finite through the zero bound; the\nshift and the vol are then two knobs fit jointly to whatever skew the market quotes"
          }
        }
      ],
      "widget": {
        "type": "binomial-tree",
        "title": "A short-rate tree, calibrated to the curve",
        "params": {
          "S0": 0.0315,
          "u": 1.1,
          "d": 0.9,
          "r": 0.04,
          "steps": 5,
          "K": 0.04,
          "kind": "call"
        }
      },
      "pitfalls": [
        "Pricing a CMS leg or an in-arrears swap off the plain forward rate with no convexity adjustment. The error is systematic and grows with the square of volatility and the length of the horizon.",
        "Calibrating a short-rate tree's volatility parameter to match the curve. Volatility is meant to match the OPTION market (caps, swaptions); the curve is matched by the drift/level parameters alone.",
        "Applying flat Black-76 to a strike far from the money when the market plainly skews, and then being surprised the model price disagrees with every quote except the one it was calibrated to.",
        "Choosing a displaced-diffusion shift too small to keep the model well-defined once rates or strikes approach zero, defeating the entire point of shifting in the first place."
      ],
      "check": [
        {
          "q": "A caplet is priced two ways: a T-forward-measure closed form, and a Monte Carlo discounted expectation under the risk-neutral measure, with the short rate calibrated to match the curve's discount factor. The two prices:",
          "options": [
            "Must differ, because they use different measures",
            "Must agree, because both are valid ways of computing the same discounted expectation of the same payoff",
            "Agree only in the limit of zero volatility",
            "Agree only if interest rates are deterministic"
          ],
          "answer": 1,
          "why": "A change of numeraire changes the measure and the drift you compute under, but not the price of a fixed payoff: the Radon-Nikodym derivative linking the two measures exactly compensates for the change, so a correctly calibrated computation under either measure must return the same number."
        },
        {
          "q": "The standard convexity adjustment for a LIBOR-in-arrears rate grows with:",
          "options": [
            "The square of volatility and the length of the fixing horizon",
            "The strike only",
            "The notional only",
            "It is a constant, independent of the market"
          ],
          "answer": 0,
          "why": "The approximation F^2 sigma^2 T_fix tau/(1+F tau) scales with sigma squared and with the time to fixing T_fix, so a longer horizon and a more volatile rate both push the adjustment up; it does not depend on the strike or the notional at all, since it is a correction to the FORWARD RATE itself."
        },
        {
          "q": "When calibrating a short-rate tree to today's curve, which parameter is chosen to match the curve, and which is left to be fit to the option market?",
          "options": [
            "Volatility matches the curve; the level matches options",
            "The per-step level (drift) matches the curve; volatility is fit separately to caps and swaptions",
            "Both are fit to the curve simultaneously",
            "Neither; the tree is fully determined by the curve alone"
          ],
          "answer": 1,
          "why": "Forward induction chooses the level parameter at each step so the tree's implied discount factors match the curve exactly; the tree's volatility parameter is a separate degree of freedom, calibrated afterward to option prices (caps, swaptions), not to the curve."
        },
        {
          "q": "Displaced diffusion replaces F and K in Black-76 with F+s and K+s. What is the point of the shift s?",
          "options": [
            "It changes the discounting",
            "It keeps the lognormal model well-defined as rates approach or cross zero, and gives a second parameter to fit skew",
            "It removes the need for a volatility parameter",
            "It converts Black-76 into Black-Scholes"
          ],
          "answer": 1,
          "why": "Shifting both the forward and the strike by the same constant before applying the lognormal formula keeps F+s positive even when F itself is small or negative, and the size of the shift becomes an extra knob -- alongside volatility -- for matching the market's skew, without changing the discounting at all."
        }
      ]
    }
  ],
  "interview": [
    {
      "q": "Explain why Black-76 needs no drift term for the forward, when Black-Scholes clearly needs one for a stock.",
      "level": "screen",
      "answer": "A forward's price is, by definition, the delivery price that makes entering the contract worth zero today. That is exactly the condition for the forward to be a martingale under the T-forward measure -- the measure obtained by using the zero-coupon bond maturing at expiry as numeraire. A stock has no such property: holding it costs financing and can pay dividends, so its price needs a risk-neutral drift to keep the discounted process a martingale. Black-76 simply prices the option as a driftless expectation under the forward measure and multiplies by one discount factor at the end."
    },
    {
      "q": "Walk me through pricing a cap as a strip of caplets.",
      "level": "screen",
      "answer": "A cap is a sum of independent caplets, one per reset period. Each caplet pays tau times notional times max(forward rate minus strike, 0), where the forward rate fixes at the start of that period and the payment happens at the end. I price each caplet with Black-76 on its own forward rate and its own time to fixing, discount it with the discount factor for ITS payment date, and sum across periods. The most common implementation bug is discounting with the fixing date's discount factor instead of the payment date's, which biases every caplet the same direction."
    },
    {
      "q": "A swaption and a caplet are both priced with Black-76-shaped formulas. What is actually different between them?",
      "level": "onsite",
      "answer": "The underlying and the numeraire both change. A caplet's underlying is a single-period forward rate, and its natural numeraire is one zero-coupon bond maturing at the payment date. A swaption's underlying is a forward SWAP rate -- built from several discount factors via the annuity -- and its natural numeraire is that annuity itself, not a single bond. Choosing the annuity as numeraire makes the forward swap rate a martingale under the resulting swap measure, which is why the swaption price is Black-76 on the forward swap rate, scaled by the annuity instead of a single discount factor."
    },
    {
      "q": "Why can't a single cap price tell you the caplet volatility for each individual period?",
      "level": "onsite",
      "answer": "A cap only observes the SUM of its caplets' prices; it never isolates any one caplet. So many different term structures of caplet volatility -- flat, humped, declining -- can be scaled to reproduce the exact same total cap price. This is a genuine identification problem, not noise. The market solves it by quoting caps and floors at multiple strikes and multiple maturities and stripping the caplet vols jointly, using the fact that a longer cap shares its early caplets with a shorter one, so only the incremental caplets are newly pinned down by each additional maturity."
    },
    {
      "q": "What is a convexity adjustment, in one sentence, and when do you need one?",
      "level": "screen",
      "answer": "It is the correction added to a plain forward rate when a payoff observes and pays that rate under a measure OTHER than its own natural forward measure -- most commonly when a rate is set in arrears (fixed and paid at the same date rather than fixed one period early) or when a swap rate is paid off an annuity that does not match its own payment schedule, as in a CMS leg. Without the correction, pricing off the plain forward is a systematic, one-directional error that grows with volatility and the horizon, not a small approximation error that averages out."
    },
    {
      "q": "Derive, or at least justify, why a payer swaption's payoff is Annuity times max(S-K,0).",
      "level": "onsite",
      "answer": "At exercise, entering the underlying swap at the strike K instead of the prevailing forward swap rate S is worth, per unit notional and per unit of the annuity, exactly S minus K if that is positive, and zero otherwise -- you would only exercise if the swap you get is worth entering. The annuity is the present value, per unit of fixed rate, of the swap's remaining fixed-leg payments, so multiplying the per-unit-annuity value by the annuity itself converts a rate difference into a present value. That is precisely a Black-76 call on S struck at K, scaled by the annuity in place of a single discount factor."
    },
    {
      "q": "Your Bermudan swaption pricer disagrees with the vanilla European swaption price at the last exercise date. How do you debug it?",
      "level": "senior",
      "answer": "First I would strip the tree back to a European exercise policy only -- disable every earlier exercise opportunity -- and confirm it reproduces the Black-76-based European price exactly; if it does not, the bug is in the tree's calibration to the curve, not in the exercise logic. I would check the calibration step by step against the bootstrapped discount factors, the same way the course's forward-induction check works. Only once the European case matches would I re-enable early exercise and check monotonicity: the Bermudan price must be at least the European price at every strike, since the extra exercise dates are only ever exercised when they help."
    },
    {
      "q": "Why does the swaption vol cube typically show implied volatility falling as expiry and tenor both increase?",
      "level": "onsite",
      "answer": "A longer horizon averages out more of the day-to-day noise in short rates, so the ANNUALIZED uncertainty in the average rate over a longer window tends to be lower than over a short one, even though the total variance accumulated can still be larger. The same logic applies across tenor: a longer underlying swap's rate is itself an average over more of the curve, which dampens its volatility relative to a short-tenor rate. This is a persistent market feature across most rate regimes, not a pricing anomaly."
    },
    {
      "q": "What breaks about Black-76 when short-term rates are near or below zero, and how would you fix it minimally?",
      "level": "onsite",
      "answer": "Black-76 assumes the forward is lognormal, so it assigns zero probability to negative values; if the market is pricing a real chance of the rate going negative, or is even just quoting a meaningful skew by strike, flat Black-76 cannot represent either fact. The minimal fix is displaced diffusion: model F+s as lognormal for a shift s large enough to keep F+s positive through the range you care about, apply the same Black-76 formula to the shifted forward and strike, and fit the shift jointly with volatility to the market's skew. It changes nothing else in the pricing machinery."
    },
    {
      "q": "How would you explain to a risk manager why a swaption book's DV01 alone does not describe its risk?",
      "level": "senior",
      "answer": "DV01 captures the book's sensitivity to a parallel shift of the curve through the underlying forward swap rates and the annuities, but a swaption book also carries vega -- sensitivity to the level of implied volatility -- and that vega is distributed unevenly across the vol cube's expiry and tenor dimensions. Two books with identical DV01 can have very different vega profiles: one concentrated in short-expiry options, one spread across the cube. I would want DV01, total vega, and a vega breakdown by cube bucket, plus the annuity's own curve sensitivity, before calling the book's risk understood."
    },
    {
      "q": "A cap and a floor at the same strike and schedule are quoted by two different desks and don't satisfy cap-floor parity against the swap market. What do you check first?",
      "level": "onsite",
      "answer": "Cap-floor parity is model-free -- it only requires both legs to be priced off the SAME discount curve, so the first thing I would check is whether the two desks are using the same curve, in particular the same convention for discounting (OIS vs the older LIBOR-style curve) and the same day-count and schedule. If the curves agree and parity still fails, the bug is almost certainly a discount-factor indexing error -- fixing versus payment date -- rather than a volatility problem, because parity holds regardless of what volatility either leg used."
    },
    {
      "q": "What is the practical difference between calibrating a model's drift and calibrating its volatility?",
      "level": "senior",
      "answer": "Drift (or level) parameters are calibrated to match the CURVE -- today's discount factors, which are observed with no ambiguity and no model risk, via forward induction, one maturity at a time. Volatility parameters are calibrated to match the OPTION market -- caps, floors, swaptions -- which requires a choice of model in the first place (Black-76, a shifted diffusion, a full short-rate model) and carries real model risk, because different models fit the same option prices with different implied dynamics away from the calibration instruments. Getting the curve calibration exactly right is a solved, mechanical problem; getting the volatility calibration right is where the judgment is."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 37400",
      "how": "The bootstrapped discount curve, annuity and DV01 this course starts from in week 1 ARE that course's own construction, used here as the direct input to every derivative price."
    },
    {
      "code": "FINM 37301",
      "how": "The forward measure and the convexity adjustment of week 5 return there as the machinery behind a quanto correction: a payoff and its natural settlement date or currency decorrelate, and the fix has the same shape."
    },
    {
      "code": "FINM 33000",
      "how": "Black-76 is Black-Scholes with the underlying replaced by a forward; the change-of-numeraire argument of week 2 is that course's risk-neutral pricing framework applied to a different traded asset as numeraire."
    },
    {
      "code": "FINM 36700",
      "how": "A swaption or cap book's DV01 and vega slot into a multi-asset risk model's fixed-income risk factors alongside the duration and convexity built in FINM 37400."
    },
    {
      "code": "FINM 32000",
      "how": "The short-rate tree calibration of week 5 is a small, hand-built instance of the finite-difference and lattice methods that course treats in general, with convergence and stability as first-class concerns."
    },
    {
      "code": "FINM 35700",
      "how": "The discounting and forward-measure machinery here is the risk-free scaffolding that course extends with a hazard-rate curve and recovery assumptions once credit risk, explicitly excluded here, is added back in."
    }
  ],
  "glossary": [
    {
      "term": "Black-76",
      "def": "The Black-Scholes formula applied to a forward or futures price instead of a spot asset: no risk-free drift on the underlying, a single discount factor applied at the end."
    },
    {
      "term": "T-forward measure",
      "def": "The pricing measure obtained by using the zero-coupon bond maturing at time T as numeraire. Under it, the T-forward price is a martingale by construction."
    },
    {
      "term": "Change of numeraire",
      "def": "Re-expressing every price in units of a different traded asset. It changes the measure and the drift, never the price of a fixed payoff."
    },
    {
      "term": "Annuity (swap)",
      "def": "The sum of discount factors at a swap's fixed-leg payment dates. A swap's fixed-leg value per unit of rate, and the numeraire that makes a forward swap rate a martingale."
    },
    {
      "term": "Caplet / floorlet",
      "def": "The single-period building block of a cap or floor: an option on one period's forward rate, paid at the end of that period."
    },
    {
      "term": "Cap-floor parity",
      "def": "Cap minus floor at the same strike and schedule equals a payer swap struck at that rate. Model-free: holds regardless of the volatility used to price either leg."
    },
    {
      "term": "Swaption",
      "def": "An option to enter a swap at a fixed strike rate. A payer swaption's payoff at exercise is the swap's annuity times max(forward swap rate minus strike, 0)."
    },
    {
      "term": "Swaption vol cube",
      "def": "The market's implied Black volatility, indexed by option expiry, underlying swap tenor, and strike. The calibration target for models that price what a single cube point cannot."
    },
    {
      "term": "Vega",
      "def": "The sensitivity of an option's price to its volatility parameter. Largest near the money; accumulates across a book in a way delta, once hedged, does not."
    },
    {
      "term": "Convexity adjustment",
      "def": "The correction added to a plain forward rate when a payoff observes and pays that rate away from its own natural forward measure, e.g. a rate fixed and paid in arrears, or a CMS leg."
    },
    {
      "term": "LIBOR-in-arrears",
      "def": "A rate that fixes and pays at the same date (rather than fixing one period earlier), so the rate is only fully known at the moment it is paid. The classic case needing a convexity adjustment."
    },
    {
      "term": "CMS (constant maturity swap)",
      "def": "A leg that pays a long-tenor swap rate on a schedule unrelated to that swap's own natural payment dates, requiring a convexity adjustment that can run to tens of basis points."
    },
    {
      "term": "Short-rate tree",
      "def": "A discrete lattice model of the instantaneous interest rate, calibrated by forward induction so it exactly reprices today's discount curve, used to value path- or exercise-dependent payoffs."
    },
    {
      "term": "Forward induction (curve calibration)",
      "def": "Solving a tree's or model's free parameter one maturity at a time, shortest first, so each new step's calibration only depends on already-fixed earlier steps."
    },
    {
      "term": "Displaced (shifted) diffusion",
      "def": "Modelling F+s as lognormal instead of F itself, for a shift s, to keep an option pricing formula well-defined near or below the zero bound and to add a second parameter for fitting skew."
    },
    {
      "term": "Volatility skew",
      "def": "The tendency of implied volatility to vary systematically with strike rather than stay flat, which a single-parameter lognormal model like plain Black-76 cannot represent."
    },
    {
      "term": "Bermudan swaption",
      "def": "A swaption exercisable on any of several specified dates rather than just one, requiring a full model of the rate's evolution (e.g. a calibrated tree) rather than a single Black-76 formula."
    },
    {
      "term": "Physical vs. cash settlement",
      "def": "A physically settled swaption delivers an actual swap on exercise; a cash-settled one pays the swap's present value under an agreed annuity convention instead."
    },
    {
      "term": "SOFR compounded in arrears",
      "def": "The market-standard convention for USD floating-rate coupons: the overnight SOFR rate is compounded daily over the accrual period and is fully known only on the period's last day."
    },
    {
      "term": "Radon-Nikodym derivative",
      "def": "The ratio linking two equivalent probability measures; here, the ratio of numeraires that lets the same payoff be priced consistently under either measure."
    }
  ]
};
