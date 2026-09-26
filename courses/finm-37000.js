/* ════════════════════════════════════════════════════════════════════════
   courses/finm-37000.js — FINM 37000 · Futures and Related Derivatives

   Built from the public course page only. The syllabus PDF is a Box shared
   link restricted to a campus login, so the week-by-week outline below, and
   every explanation, formula, snippet, question and glossary entry in it,
   is this dashboard's own reconstruction of a standard graduate treatment
   of futures markets — not the instructor's material.
   ════════════════════════════════════════════════════════════════════════ */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 37000"] = {
  code: "FINM 37000",
  slug: "finm-37000",
  title: "Futures and Related Derivatives",
  instructor: "Eric Patterson",
  quarter: "Autumn",
  units: 50,
  block: "electives",
  concentrations: ["options-derivatives"],
  source: {
    page_url: "https://finmath.uchicago.edu/curriculum/degree-concentrations/options-and-derivatives/finm-37000/",
    syllabus_url: "https://uchicago.box.com/s/6h2nzmysx03a1nyxq5f0i0nej7gx29pv",
    fetched: "2026-09-26",
    note: "Only the public course page was readable: the syllabus PDF is a Box shared link " +
      "behind a campus login. The five-week outline, concepts, code, widgets, questions and " +
      "glossary here are the dashboard's own reconstruction of a standard graduate treatment " +
      "of futures markets. Nothing on this page is attributed to the instructor, and no " +
      "grading scheme, assignment, exam format or required reading is implied."
  },
  tier: "B",
  description: "A survey of the models and tools a quantitative analyst uses on futures and " +
    "related derivatives. The course covers the structure and the data of the major futures " +
    "markets, and emphasises measuring and trading volatility, including options on futures. " +
    "Because these markets generate a wide range of quantitative problems, it draws on linear " +
    "algebra, stochastic processes, Monte Carlo methods and machine learning, with the emphasis " +
    "on applying them in Python to real market data. Contract structure and market data are " +
    "illustrated with exchange-listed products.",

  prerequisites: [
    "Probability through conditional expectation and the basics of Brownian motion; the material in the program's probability and stochastic processes course is assumed.",
    "Linear algebra to the level of eigen-decomposition and least squares, because the curve work in week 5 is principal components and the hedging work in week 3 is a regression.",
    "Enough Python to load a panel of prices into NumPy or pandas, write a loop over contracts, and read a traceback without help.",
    "Familiarity with the Black–Scholes formula. The course rebuilds it in futures form, but it does not re-derive it from scratch."
  ],
  textbooks: [
    { title: "Options, Futures, and Other Derivatives", author: "John C. Hull",
      note: "Standard reference for this material: contract mechanics, the cost-of-carry relation, hedge ratios and Black's model." },
    { title: "The Concepts and Practice of Mathematical Finance", author: "Mark S. Joshi",
      note: "Standard reference for the risk-neutral and numerical-methods material the futures work rests on." },
    { title: "Trading and Pricing Financial Derivatives", author: "Patrick Boyle and Jesse McDougall",
      note: "Standard reference for the market-practice side: margining, the roll, and the mechanics of listed products." },
    { title: "Advances in Financial Machine Learning", author: "Marcos López de Prado",
      note: "Standard reference for the overlapping-sample and purged cross-validation issues in week 5." }
  ],

  skills_built: ["futures-markets", "cost-of-carry", "hedging", "margin-and-leverage",
                 "carry-trade", "spread-trades", "black-76", "greeks", "implied-volatility",
                 "monte-carlo-pricing", "pca", "convexity-adjustment"],
  skills_assumed: ["risk-neutral-pricing", "brownian-motion", "linear-algebra",
                   "linear-regression", "numpy", "python-pandas"],

  brushup: [
    { topic: "Continuous compounding and the exponential",
      why: "Every carry relation in weeks 2 and 3 is an exponential of a rate times a year fraction. If converting between a simple money-market rate, an annual rate and a continuous rate is not automatic, the basis arithmetic will feel arbitrary instead of obvious.",
      resource: "Hull, chapter 4, the section on compounding frequencies" },
    { topic: "Ordinary least squares as a projection",
      why: "The minimum-variance hedge ratio is one regression coefficient and the hedge's residual variance is the regression's residual variance. Seeing the slope as a projection makes the whole of week 3 a single picture.",
      resource: "Strang, Introduction to Linear Algebra, the chapter on projections and least squares" },
    { topic: "Eigenvalues of a symmetric matrix",
      why: "Week 5 decomposes the covariance matrix of curve returns into level, slope and curvature. You need to be comfortable that the eigenvectors of a covariance matrix are orthogonal and that the eigenvalues are the variances along them.",
      resource: "Any linear algebra text's spectral theorem section; verify it numerically with numpy.linalg.eigh" },
    { topic: "The lognormal distribution and its mean",
      why: "The gap between the mean of a lognormal and the exponential of its mean is the source of the futures-versus-forward adjustment in week 1 and the convexity corrections that follow it.",
      resource: "Work out E[exp(X)] for X normal by hand once; it takes ten lines and pays for itself all quarter" },
    { topic: "Reading a contract specification",
      why: "Multiplier, tick size, quotation unit, last trade date, delivery method. Half the errors in a futures P&L calculation are a multiplier applied to the wrong quotation unit, and the specification is where you check.",
      resource: "Any listed contract's published specification page; read three of them from different asset classes" },
    { topic: "NumPy array shapes and broadcasting",
      why: "A futures panel is contracts by dates by fields. Week 1's continuous-series construction and week 5's principal components both fail silently if a (n,) array broadcasts against an (n,1) one.",
      resource: "The NumPy user guide, 'Broadcasting'" }
  ],

  weeks: [
    /* ══════════ WEEK 1 ══════════ */
    { n: 1,
      title: "Contract mechanics, margin, and the data you actually get",
      topics: ["contract specifications and multipliers", "initial and variation margin",
               "futures versus forwards", "continuous contracts and back-adjustment"],
      concepts: [
        { name: "A futures contract is a specification, not an idea",
          explain: "<p>Before any model, learn to read the specification. Four numbers do almost all the work: the <em>quotation unit</em> (what the quoted number means), the <em>multiplier</em> (dollars per point), the <em>tick size</em> (the smallest legal price increment) and the <em>last trade date</em>. An E-mini equity index contract quoted at 5300 with a multiplier of 50 controls 265,000 dollars of index; a crude oil contract quoted at 78.40 with a multiplier of 1000 controls 78,400 dollars of oil; a ten-year note quoted at 110.50 in points of a 100,000 face controls 110,500 dollars of bonds. The same word, <q>price</q>, means three different things.</p>" +
            "<p>Tick value follows: multiplier times tick size. That number is the granularity of your P&amp;L and, with the bid-ask spread usually one tick wide, the granularity of your transaction cost too. A strategy whose average edge per trade is smaller than one tick is not a strategy. Getting the multiplier wrong is the single most common error in a first futures P&amp;L, and it is silent: the number still looks like money.</p>" +
            "<p>A desk cares because every risk report, every hedge ratio and every position limit is stated in contracts, and contracts only become dollars through the specification.</p>",
          formula: "\\text{notional} = \\text{multiplier}\\times \\text{price},\\qquad \\text{tick value} = \\text{multiplier}\\times \\text{tick size}",
          code: { lang: "python", src: `# Contract arithmetic for four liquid families. Prices are illustrative.
specs = [("ES", "equity index",  50.0, 0.25,    5300.00),
         ("CL", "crude oil",   1000.0, 0.01,      78.40),
         ("ZN", "10y note",    1000.0, 1.0/64.0, 110.50),
         ("GC", "gold",         100.0, 0.10,    2350.00)]

hdr = ("sym", "multiplier", "tick", "tick $", "notional $", "1% move, 10 lots")
print("{:>4} {:>11} {:>9} {:>8} {:>13} {:>18}".format(*hdr))
for sym, _name, mult, tick, px in specs:
    notional = mult * px
    tick_value = mult * tick
    pnl = 10 * mult * px * 0.01
    print("{:>4} {:>11.0f} {:>9.5f} {:>8.3f} {:>13,.2f} {:>18,.2f}".format(
        sym, mult, tick, tick_value, notional, pnl))

print()
print("one tick on ZN is 1/64 of a point =", round(1000.0 / 64.0, 4), "dollars")
print("ten ES lots and ten CL lots are NOT the same risk:",
      round(10 * 50.0 * 5300.0 / (10 * 1000.0 * 78.40), 2), "x the notional")
`, output: " sym  multiplier      tick   tick $    notional $   1% move, 10 lots\n  ES          50   0.25000   12.500    265,000.00          26,500.00\n  CL        1000   0.01000   10.000     78,400.00           7,840.00\n  ZN        1000   0.01562   15.625    110,500.00          11,050.00\n  GC         100   0.10000   10.000    235,000.00          23,500.00\n\none tick on ZN is 1/64 of a point = 15.625 dollars\nten ES lots and ten CL lots are NOT the same risk: 3.38 x the notional" } },

        { name: "Margin is the reason a futures P&L is a cash flow, not a claim",
          explain: "<p>A forward accrues an unrealised gain that settles once, at maturity. A futures position is marked to the settlement price every day and the difference moves in cash between the two accounts the same evening. That daily <em>variation margin</em> is why the clearing house can stand between strangers, and it is why a futures position can be solvent on a mark-to-market basis and still be closed out: the cash has to be there today.</p>" +
            "<p>The mechanics are worth doing by hand once. You post <em>initial margin</em> per contract when you open. Each evening variation margin is added to or removed from the account. If the balance falls below <em>maintenance margin</em>, a call goes out to restore the balance to the initial level — not to the maintenance level, which is the detail people get wrong. Because initial margin is a few percent of notional, the embedded leverage is large: a 2.4 percent initial margin is roughly forty-to-one, so a two percent adverse move is most of your posted capital.</p>" +
            "<p>A desk cares because financing and margin are the real constraint on a futures book long before risk limits bind, and a margin model change can force liquidation in exactly the markets where it hurts.</p>",
          formula: "\\text{VM}_t = n\\times m\\times (P_t - P_{t-1}),\\qquad \\text{call}_t = \\max\\!\\left(0,\; n\\,\\text{IM} - E_t\\right)\\ \\text{when } E_t < n\\,\\text{MM}",
          code: { lang: "python", src: `# Five days of variation margin on a long equity-index position.
n, mult = 10, 50.0
IM, MM = 12650.0, 11500.0        # per contract, illustrative
path = [5300.0, 5265.0, 5220.0, 5248.0, 5190.0, 5240.0]

equity = n * IM
print("posted at trade:", format(equity, ",.0f"), "dollars of initial margin")
print("notional      :", format(n * mult * path[0], ",.0f"),
      " leverage =", round(n * mult * path[0] / equity, 1), "x")
print()
print("{:>3} {:>9} {:>12} {:>12} {:>12}".format("day", "settle", "VM", "equity", "call"))
for t in range(1, len(path)):
    vm = n * mult * (path[t] - path[t - 1])
    equity += vm
    call = 0.0
    if equity < n * MM:
        call = n * IM - equity
        equity += call
    print("{:>3} {:>9.2f} {:>12,.0f} {:>12,.0f} {:>12,.0f}".format(t, path[t], vm, equity, call))

print()
print("a 2% adverse move costs", format(n * mult * path[0] * 0.02, ",.0f"),
      "dollars against", format(n * IM, ",.0f"), "of posted initial margin")
`, output: "posted at trade: 126,500 dollars of initial margin\nnotional      : 2,650,000  leverage = 20.9 x\n\nday    settle           VM       equity         call\n  1   5265.00      -17,500      126,500       17,500\n  2   5220.00      -22,500      126,500       22,500\n  3   5248.00       14,000      140,500            0\n  4   5190.00      -29,000      126,500       15,000\n  5   5240.00       25,000      151,500            0\n\na 2% adverse move costs 53,000 dollars against 126,500 of posted initial margin" } },

        { name: "Futures and forwards are not the same price",
          explain: "<p>Daily settlement is not cosmetic. A futures price is an expectation under the risk-neutral measure with no discounting inside it, <code>F = E[S_T]</code>, because each day's gain is paid immediately. A forward price is a ratio of discounted expectations, <code>f = E[S_T D]/E[D]</code>, because the single payment at maturity has to be discounted along the path that produced it. When the discount factor and the terminal price are correlated, the two differ.</p>" +
            "<p>The direction is intuitive once you see the cash flows. If the asset tends to rise when rates rise, the futures holder receives variation margin exactly when it can be reinvested at a high rate, and pays it when funding is cheap. That timing option is worth something, so the futures price must be higher than the forward. Negative correlation reverses the sign, which is why the adjustment matters most in short-rate and bond futures, where the correlation is large by construction.</p>" +
            "<p>A desk cares because it marks forwards off listed futures. On a two-year horizon the adjustment is tens of basis points, which is far larger than the bid-ask spread being crossed to trade it.</p>",
          formula: "F_0 = E^{Q}[S_T],\\qquad f_0 = \\frac{E^{Q}[S_T D_T]}{E^{Q}[D_T]},\\qquad \\frac{F_0}{f_0} = \\exp\\!\\big(\\mathrm{Cov}(\\ln S_T,\\textstyle\\int_0^T r_u\\,du)\\big)",
          code: { lang: "python", src: `import numpy as np
# Ho-Lee short rate r_t = r0 + sigma_r W_t, asset with risk-neutral drift r_t.
# Under those dynamics the futures/forward ratio has a closed form, so the
# Monte Carlo can be checked against it.
rng = np.random.default_rng(20260926)
S0, r0, sig_r, sig_S, T, steps, half = 100.0, 0.04, 0.015, 0.30, 2.0, 50, 25000
dt = T / steps

for rho in (0.7, 0.0, -0.7):
    z1 = rng.standard_normal((half, steps))
    z2 = rng.standard_normal((half, steps))
    z1 = np.vstack([z1, -z1]); z2 = np.vstack([z2, -z2])       # antithetic
    dWr = np.sqrt(dt) * z1
    dWs = np.sqrt(dt) * (rho * z1 + np.sqrt(1.0 - rho * rho) * z2)
    r = r0 + sig_r * np.cumsum(dWr, axis=1)
    r_prev = np.hstack([np.full((r.shape[0], 1), r0), r[:, :-1]])
    int_r = r_prev.sum(axis=1) * dt
    logS = np.log(S0) + ((r_prev - 0.5 * sig_S ** 2) * dt).sum(axis=1) + sig_S * dWs.sum(axis=1)
    ST, D = np.exp(logS), np.exp(-int_r)
    F = ST.mean()
    fwd = (ST * D).mean() / D.mean()
    theory = sig_r ** 2 * T ** 3 / 3.0 + rho * sig_S * sig_r * T ** 2 / 2.0
    print("rho = {:+.1f}   F = {:8.4f}   f = {:8.4f}   MC F/f-1 = {:+7.1f} bp"
          "   closed form = {:+7.1f} bp".format(
              rho, F, fwd, (F / fwd - 1.0) * 1e4, (np.exp(theory) - 1.0) * 1e4))
`, output: "rho = +0.7   F = 108.9156   f = 108.1873   MC F/f-1 =   +67.3 bp   closed form =   +69.2 bp\nrho = +0.0   F = 108.4180   f = 108.3445   MC F/f-1 =    +6.8 bp   closed form =    +6.0 bp\nrho = -0.7   F = 107.7131   f = 108.3136   MC F/f-1 =   -55.4 bp   closed form =   -56.8 bp" } },

        { name: "There is no such thing as 'the' futures price series",
          explain: "<p>A futures contract expires, so a history longer than one contract's life has to be stitched together, and every stitching rule is a modelling choice. The naive splice — front contract until the roll, next contract after — inserts the calendar spread into the return series as a one-day jump that no trader experienced. In a contangoed market that fake jump is positive; a momentum signal fitted on the naive series will learn it.</p>" +
            "<p>Two standard repairs exist. <em>Difference</em> (or panama) adjustment shifts all history by the spread at each roll, so differences are right and levels drift, sometimes into negative prices on long commodity histories. <em>Ratio</em> adjustment multiplies history by the price ratio, so proportional returns are right and levels stay positive, which is what you want if you are going to take logs. Neither gives you a tradeable price: the adjusted level is not a price anyone could transact at, only a return series.</p>" +
            "<p>A desk cares because the roll rule, the roll date and the adjustment convention together move a long-horizon commodity backtest by whole percentage points per year — more than most of the signals being tested.</p>",
          formula: "r^{\\text{true}}_{\\text{roll}} = \\frac{P^{\\text{next}}_{t}}{P^{\\text{next}}_{t-1}} - 1 \;\\neq\; \\frac{P^{\\text{next}}_{t}}{P^{\\text{front}}_{t-1}} - 1 = r^{\\text{naive}}_{\\text{roll}}",
          code: { lang: "python", src: `# Two adjacent contracts through a roll. The next contract trades above the
# front (contango), so a naive splice manufactures a one-day gain.
days  = [1, 2, 3, 4, 5, 6]
front = [78.40, 78.10, 77.95, 78.30, 78.05, 77.80]
nxt   = [79.60, 79.28, 79.14, 79.51, 79.27, 79.03]
vol_f = [95000, 88000, 61000, 32000, 11000,  3000]
vol_n = [21000, 33000, 58000, 74000, 96000, 102000]

roll = next(i for i in range(len(days)) if vol_n[i] > vol_f[i])
print("roll on day", days[roll], "(next-contract volume overtakes the front)")
gap = nxt[roll] - front[roll]
ratio = nxt[roll] / front[roll]
print("calendar spread at the roll = {:+.2f}  ({:.4f} x)".format(gap, ratio))
print()

naive = front[:roll + 1] + nxt[roll + 1:]
diff_adj = [p + gap for p in front[:roll + 1]] + nxt[roll + 1:]
rat_adj = [p * ratio for p in front[:roll + 1]] + nxt[roll + 1:]

print("{:>4} {:>9} {:>9} {:>9} {:>11} {:>11}".format(
    "day", "naive", "diff-adj", "ratio-adj", "naive ret", "true ret"))
for i in range(1, len(days)):
    true_ret = (nxt[i] / nxt[i - 1] - 1.0) if i > roll else (front[i] / front[i - 1] - 1.0)
    print("{:>4} {:>9.2f} {:>9.2f} {:>9.2f} {:>10.3f}% {:>10.3f}%".format(
        days[i], naive[i], diff_adj[i], rat_adj[i],
        100 * (naive[i] / naive[i - 1] - 1.0), 100 * true_ret))

print()
print("the naive series books a", round(100 * (naive[roll + 1] / naive[roll] - 1.0), 3),
      "% return on the roll day that nobody earned")
`, output: "roll on day 4 (next-contract volume overtakes the front)\ncalendar spread at the roll = +1.21  (1.0155 x)\n\n day     naive  diff-adj ratio-adj   naive ret    true ret\n   2     78.10     79.31     79.31     -0.383%     -0.383%\n   3     77.95     79.16     79.15     -0.192%     -0.192%\n   4     78.30     79.51     79.51      0.449%      0.449%\n   5     79.27     79.27     79.27      1.239%     -0.302%\n   6     79.03     79.03     79.03     -0.303%     -0.303%\n\nthe naive series books a 1.239 % return on the roll day that nobody earned" } }
      ],
      widget: { type: "timeline", title: "The life of a futures position, day by day",
        params: { events: [
          { t: 0, label: "Trade", note: "Fill at the exchange; initial margin posted to the clearing member the same day." },
          { t: 1, label: "First settlement", note: "Position marked to the official settlement price; variation margin moves in cash." },
          { t: 2, label: "Margin call", note: "Equity below maintenance: restore to the INITIAL level, not to maintenance." },
          { t: 12, label: "First notice day", note: "Physically delivered contracts can be assigned from here; most financial traders are out before it." },
          { t: 17, label: "Roll window", note: "Liquidity migrates to the next contract; the calendar spread is the price of staying long." },
          { t: 20, label: "Last trade date", note: "Cash settlement against a final index, or delivery obligations crystallise." }
        ] } },
      pitfalls: [
        "Applying the multiplier to the wrong quotation unit. A note future quoted at 110-16 is 110.5 points of a 100,000 face, not 110.5 dollars; the error is a factor of a thousand and the result still looks like a plausible P&L.",
        "Restoring an account to maintenance margin after a call instead of to initial margin. The account is then one tick from the next call, which is how a position that was right gets liquidated.",
        "Treating a back-adjusted continuous series as a price. It is a return series with an arbitrary level; any strategy that references an absolute price level on it is reading a number that never traded.",
        "Assuming the futures price equals the forward price because the correlation 'looks small'. On multi-year horizons in rate-sensitive assets the adjustment is tens of basis points, which is several bid-ask spreads."
      ],
      check: [
        { q: "A ten-year note future is quoted at 110.50 with a 1,000 multiplier and a tick of 1/64. What is one tick worth?",
          options: ["$10.00", "$15.625", "$31.25", "$110.50"],
          answer: 1,
          why: "Tick value is multiplier times tick size: 1000 x 1/64 = 15.625 dollars. The 31.25 answer is the value of 1/32, which is the tick on several other note and bond contracts, and picking it is the classic way to be wrong by a factor of two on a whole book's hedge. The 10 dollars answer confuses the tick with a decimal-quoted contract, and 110.50 is the quotation, not a cash amount." },
        { q: "The asset's price is positively correlated with the short rate. Which is true?",
          options: ["The futures price is below the forward price", "They are equal because both are arbitrage-free",
                    "The futures price is above the forward price", "The relation depends on the volatility only"],
          answer: 2,
          why: "Positive correlation means variation margin arrives when it can be reinvested at high rates and is paid out when funding is cheap, so the daily-settled contract is worth more and must be priced higher. Equality only holds when rates are deterministic or the correlation is zero, and the size of the gap depends on the covariance, not on volatility alone." },
        { q: "You back-adjust a continuous crude oil series by differences over twenty years of contango. What goes wrong?",
          options: ["Percentage returns become wrong", "The adjusted level can drift negative",
                    "The series stops being recombining", "Nothing; difference adjustment is exact"],
          answer: 1,
          why: "Difference adjustment preserves price changes exactly but shifts the level by the cumulative sum of the roll gaps, which over a long contangoed history can push the adjusted level through zero and make logs and percentage returns meaningless. Ratio adjustment preserves proportional returns and keeps the level positive, which is why it is preferred when the analysis takes logs." },
        { q: "Initial margin is 12,650 and maintenance is 11,500 per contract. Equity on ten contracts falls to 112,000. What is the call?",
          options: ["3,000", "14,500", "0", "126,500"],
          answer: 1,
          why: "Maintenance on ten contracts is 115,000, and 112,000 is below it, so a call is triggered. The call restores the account to the INITIAL requirement of 126,500, so it is 126,500 - 112,000 = 14,500. The 3,000 answer restores only to maintenance, which no clearing member accepts, and zero would be right only if equity were still above 115,000." }
      ]
    },

    /* ══════════ WEEK 2 ══════════ */
    { n: 2,
      title: "Cost of carry, basis, and the shape of the curve",
      topics: ["the carry relation", "basis and convergence", "calendar spreads and implied carry",
               "roll yield and the cost of being long"],
      concepts: [
        { name: "One equation carries every futures market",
          explain: "<p>Buy the asset today with borrowed money, pay whatever it costs to hold it, collect whatever it pays, and sell it forward. The forward price that makes this cost nothing is the fair futures price, and the exponent is just the net cost of carrying the position: financing <code>r</code>, minus income <code>q</code>, plus storage <code>u</code>, minus convenience yield <code>y</code>.</p>" +
            "<p>Every asset class is a different reading of the same four letters. For an equity index, <code>q</code> is the dividend yield and storage is zero. For gold, income is zero and <code>u</code> is vault and insurance. For crude oil, <code>y</code> is the value of having physical barrels available, which is why the relation is an inequality rather than an identity: you cannot short the convenience yield. For a currency, <code>q</code> is the foreign interest rate and the relation is covered interest parity.</p>" +
            "<p>Read backwards, the same equation is a measurement device. Quoted futures plus a spot price imply a financing rate, a dividend, or a convenience yield, and the implied number is what the market is actually charging. A desk cares because the implied repo rate off index futures is often the cheapest funding or the richest lending in the building.</p>",
          formula: "F_0 = S_0\\,e^{(r - q + u - y)T}",
          code: { lang: "python", src: `import math

def carry_future(S, T, r=0.0, q=0.0, u=0.0, y=0.0):
    return S * math.exp((r - q + u - y) * T)

print("fair value from carry")
print(" equity index  S=5300 r=5.20% q=1.30% T=0.25 ->",
      round(carry_future(5300.0, 0.25, r=0.052, q=0.013), 2))
print(" gold          S=2350 r=5.20% u=0.40% T=0.50 ->",
      round(carry_future(2350.0, 0.50, r=0.052, u=0.004), 2))
print(" crude, y=8%   S=78.40 r=5.20% u=1.50% T=0.50 ->",
      round(carry_future(78.40, 0.50, r=0.052, u=0.015, y=0.080), 2))
print()

# Read it backwards: what does a quoted future imply?
S, F, T, r = 5300.0, 5341.50, 0.25, 0.052
q_implied = r - math.log(F / S) / T
print("quoted index future {:.2f} implies a dividend yield of {:.3f}%".format(
    F, 100 * q_implied))

S_g, F_g, T_g, u_g = 2350.0, 2410.00, 0.50, 0.004
r_implied = math.log(F_g / S_g) / T_g - u_g
print("quoted gold future  {:.2f} implies an implied repo rate of {:.3f}%".format(
    F_g, 100 * r_implied))

S_c, F_c, T_c, r_c, u_c = 78.40, 76.95, 0.50, 0.052, 0.015
y_implied = r_c + u_c - math.log(F_c / S_c) / T_c
print("quoted crude future {:.2f} implies a convenience yield of {:.3f}%".format(
    F_c, 100 * y_implied))
`, output: "fair value from carry\n equity index  S=5300 r=5.20% q=1.30% T=0.25 -> 5351.93\n gold          S=2350 r=5.20% u=0.40% T=0.50 -> 2416.73\n crude, y=8%   S=78.40 r=5.20% u=1.50% T=0.50 -> 77.89\n\nquoted index future 5341.50 implies a dividend yield of 2.080%\nquoted gold future  2410.00 implies an implied repo rate of 4.642%\nquoted crude future 76.95 implies a convenience yield of 10.434%" } },

        { name: "Basis is carry, and it has to go to zero",
          explain: "<p>Basis is the spot price minus the futures price. Under the carry relation it equals <code>S(1 - e^{cT})</code> where <code>c</code> is net carry, so it is mechanically a function of time to expiry and it must converge to zero at delivery — otherwise, on the last day, you could buy the cheap one, sell the dear one and settle them against each other for free.</p>" +
            "<p>That convergence is the whole reason a hedge works, and the whole reason it does not work perfectly. If you hedge a physical exposure with a contract that expires when your exposure ends, basis risk disappears at the end. If your exposure ends between expiries, or if the underlying you own is not the deliverable grade, you carry the basis to the finish line. Empirically the basis is far more volatile than the carry relation suggests, because the convenience yield is not observable and moves with inventories.</p>" +
            "<p>A desk cares because basis, not price, is what a hedged book is long or short. A perfectly hedged crude book still has a view on the basis, and that view is the position whether anyone chose it or not.</p>",
          formula: "b_t = S_t - F_t = S_t\\left(1 - e^{c(T-t)}\\right),\\qquad b_T = 0",
          code: { lang: "python", src: `import math
S, r, q = 5300.0, 0.052, 0.013
c = r - q
print("net carry = {:.3f}% per year".format(100 * c))
print()
print("{:>6} {:>10} {:>10} {:>12}".format("days", "future", "basis", "basis (bp)"))
for days in (90, 60, 30, 10, 3, 0):
    T = days / 365.0
    F = S * math.exp(c * T)
    b = S - F
    print("{:>6} {:>10.2f} {:>10.2f} {:>12.1f}".format(days, F, b, 1e4 * b / S))

print()
# Convergence is what makes a hedge work. Short one future at F0 today against
# long spot, then let spot move anywhere: at expiry the hedged value is F0.
F0 = S * math.exp(c * 90 / 365.0)
print("sold the 90-day future at {:.2f}".format(F0))
for ST in (4800.0, 5300.0, 5800.0):
    hedged = ST + (F0 - ST)        # futures price equals spot at expiry
    print("  spot at expiry {:>8.2f} -> hedged value {:>8.2f}".format(ST, hedged))
print("the hedge locks the FUTURES price, not the spot price: that gap is the basis")
`, output: "net carry = 3.900% per year\n\n  days     future      basis   basis (bp)\n    90    5351.21     -51.21        -96.6\n    60    5334.09     -34.09        -64.3\n    30    5317.02     -17.02        -32.1\n    10    5305.67      -5.67        -10.7\n     3    5301.70      -1.70         -3.2\n     0    5300.00       0.00          0.0\n\nsold the 90-day future at 5351.21\n  spot at expiry  4800.00 -> hedged value  5351.21\n  spot at expiry  5300.00 -> hedged value  5351.21\n  spot at expiry  5800.00 -> hedged value  5351.21\nthe hedge locks the FUTURES price, not the spot price: that gap is the basis" } },

        { name: "A calendar spread is a quoted carry rate",
          explain: "<p>Two expiries on the same underlying define an implied forward carry between them: <code>c = ln(F_2/F_1)/(T_2 - T_1)</code>. That is the single most useful transformation in futures work, because it turns a dollar spread that means nothing across markets into an annualised rate that means the same thing everywhere.</p>" +
            "<p>An upward-sloping curve — contango — means positive net carry: financing and storage exceed income and convenience. A downward-sloping curve — backwardation — means the convenience yield dominates, which in commodities is the market paying you to hold paper instead of barrels because barrels are scarce. In equity index futures the implied carry is a financing rate and trades within basis points of the repo market; in commodities it swings by tens of percent with inventory.</p>" +
            "<p>Calendar spreads also trade as instruments in their own right, with their own margin offsets, and they are the cleanest expression of a view on storage, inventory or dividends with almost no outright price risk. A desk cares because the spread is where the carry view lives, and because a spread's margin is a small fraction of two outrights.</p>",
          formula: "c_{1,2} = \\frac{\\ln(F_2/F_1)}{T_2 - T_1}",
          code: { lang: "python", src: `import math

curves = {
    "crude, contango":      [(0.08, 76.95), (0.33, 77.80), (0.58, 78.45), (1.08, 79.30)],
    "crude, backwardation": [(0.08, 82.40), (0.33, 81.10), (0.58, 80.20), (1.08, 78.90)],
    "equity index":         [(0.08, 5311.0), (0.33, 5341.5), (0.58, 5372.6), (1.08, 5434.0)],
}
for name, curve in curves.items():
    print(name)
    for (T1, F1), (T2, F2) in zip(curve[:-1], curve[1:]):
        spread = F2 - F1
        c = math.log(F2 / F1) / (T2 - T1)
        print("   {:.2f}y -> {:.2f}y  spread {:+8.2f}   implied carry {:+7.2f}% per year".format(
            T1, T2, spread, 100 * c))
    print()

# The same dollar spread means completely different carry at different levels.
print("a +0.85 spread over 3 months is {:.2f}% carry on crude at 77".format(
    100 * math.log(77.80 / 76.95) / 0.25))
print("a +0.85 spread over 3 months is {:.2f}% carry on an index at 5311".format(
    100 * math.log((5311.0 + 0.85) / 5311.0) / 0.25))
`, output: "crude, contango\n   0.08y -> 0.33y  spread    +0.85   implied carry   +4.39% per year\n   0.33y -> 0.58y  spread    +0.65   implied carry   +3.33% per year\n   0.58y -> 1.08y  spread    +0.85   implied carry   +2.16% per year\n\ncrude, backwardation\n   0.08y -> 0.33y  spread    -1.30   implied carry   -6.36% per year\n   0.33y -> 0.58y  spread    -0.90   implied carry   -4.46% per year\n   0.58y -> 1.08y  spread    -1.30   implied carry   -3.27% per year\n\nequity index\n   0.08y -> 0.33y  spread   +30.50   implied carry   +2.29% per year\n   0.33y -> 0.58y  spread   +31.10   implied carry   +2.32% per year\n   0.58y -> 1.08y  spread   +61.40   implied carry   +2.27% per year\n\na +0.85 spread over 3 months is 4.39% carry on crude at 77\na +0.85 spread over 3 months is 0.06% carry on an index at 5311" } },

        { name: "Roll yield: the price of staying long a curve",
          explain: "<p>Hold a long futures position past an expiry and you must sell the expiring contract and buy the next one. In contango you sell low and buy high every time, and that loss is real even if the spot price never moves. The industry calls the effect roll yield, which is an unfortunate name because it is not a yield and it is not free money in backwardation either — it is the carry you agreed to pay or receive when you chose to own a curve rather than the physical asset.</p>" +
            "<p>The arithmetic is unforgiving. A one percent roll cost twelve times a year compounds to roughly minus eleven and a half percent against an unchanged spot. That is why first-generation commodity index products underperformed their headline spot indices for years, and why the second generation moved the roll further out the curve or optimised the roll date. Neither trick removes the carry; they relocate it to the part of the curve where it is flattest.</p>" +
            "<p>A desk cares because the decomposition of a futures return into spot return plus roll return is the first diagnostic on any commodity strategy: a signal that is really just short carry should be called that.</p>",
          formula: "R^{\\text{excess}} = \\underbrace{\\frac{S_T}{S_0}-1}_{\\text{spot}} \;+\; \\underbrace{\\sum_{k}\\left(\\frac{F^{k}_{t_k}}{F^{k+1}_{t_k}}-1\\right)}_{\\text{roll}} \;+\; \\text{interaction}",
          code: { lang: "python", src: `# Twelve monthly rolls with a flat spot price and a constant 1% one-month carry.
spot = 78.40
carry_1m = 0.010            # next contract is 1% above the front every month

units = 1.0                 # contracts held, scaled up at each roll
level = spot                # front-contract price we are marked against
value = 1.0                 # index value, starts at 1
print("{:>6} {:>10} {:>12} {:>12}".format("month", "front", "roll factor", "index"))
for m in range(1, 13):
    front_at_roll = level
    next_at_roll = level * (1.0 + carry_1m)
    factor = front_at_roll / next_at_roll          # fewer contracts after the roll
    units *= factor
    value = units                                   # flat spot: price unchanged
    print("{:>6} {:>10.2f} {:>12.6f} {:>12.6f}".format(m, level, factor, value))

print()
print("spot return over the year  = {:+.3f}%".format(0.0))
print("index (excess) return      = {:+.3f}%".format(100 * (value - 1.0)))
print("naive '12 x 1%' guess      = {:+.3f}%".format(-12.0))
print("compounding makes the drag {:.3f}% worse than the naive sum".format(
    abs(100 * (value - 1.0)) - 12.0))
`, output: " month      front  roll factor        index\n     1      78.40     0.990099     0.990099\n     2      78.40     0.990099     0.980296\n     3      78.40     0.990099     0.970590\n     4      78.40     0.990099     0.960980\n     5      78.40     0.990099     0.951466\n     6      78.40     0.990099     0.942045\n     7      78.40     0.990099     0.932718\n     8      78.40     0.990099     0.923483\n     9      78.40     0.990099     0.914340\n    10      78.40     0.990099     0.905287\n    11      78.40     0.990099     0.896324\n    12      78.40     0.990099     0.887449\n\nspot return over the year  = +0.000%\nindex (excess) return      = -11.255%\nnaive '12 x 1%' guess      = -12.000%\ncompounding makes the drag -0.745% worse than the naive sum" } }
      ],
      widget: { type: "curve", title: "Three futures curves, and the carry each of them quotes",
        params: { xlab: "Years to expiry", ylab: "Futures price",
          series: [
            { name: "Crude, contango", x: [0.08, 0.33, 0.58, 1.08, 1.58, 2.08],
              y: [76.95, 77.80, 78.45, 79.30, 79.85, 80.10] },
            { name: "Crude, backwardation", x: [0.08, 0.33, 0.58, 1.08, 1.58, 2.08],
              y: [82.40, 81.10, 80.20, 78.90, 78.20, 77.90] },
            { name: "Natural gas, seasonal", x: [0.08, 0.33, 0.58, 1.08, 1.58, 2.08],
              y: [2.61, 2.94, 3.42, 2.78, 3.06, 3.51] }],
          log: false } },
      pitfalls: [
        "Comparing dollar calendar spreads across markets. A 0.85 spread is a 4.4 percent annualised carry on crude and about six basis points on an equity index; only the annualised number is comparable.",
        "Treating the convenience yield as an observable input. It is a residual: whatever makes the carry relation hold. Quoting it as if it were measured hides the fact that it absorbs every other error in the calculation.",
        "Calling roll yield a return. In contango it is a cost you accepted by owning a curve instead of the physical; naming it a yield invites strategies that are short carry and mislabelled as alpha.",
        "Forcing the carry relation to hold as an equality in a market where the asset cannot be shorted or stored. There it is an upper bound on the futures price, not an equality."
      ],
      check: [
        { q: "A one-year index future trades below spot times exp(rT). What is the most likely reading?",
          options: ["An arbitrage", "The implied dividend yield is positive",
                    "The multiplier is wrong", "Rates are negative"],
          answer: 1,
          why: "The carry exponent is r - q for an index. A future below S exp(rT) means q > 0, which is simply the dividends the index pays over the year being subtracted from the financing cost. It is the normal state of affairs, not an arbitrage, and it has nothing to do with the multiplier, which affects notional rather than the price relation." },
        { q: "The implied carry between the front two crude contracts is minus fifteen percent annualised. This means:",
          options: ["The curve is in contango", "Storage costs are unusually high",
                    "The convenience yield exceeds financing plus storage", "The contracts are mispriced"],
          answer: 2,
          why: "Negative implied carry means the curve slopes down, which is backwardation. Since financing and storage are both positive, the only term that can push the net carry negative is the convenience yield, which rises when physical inventories are tight. High storage costs would steepen contango, the opposite sign." },
        { q: "Spot is unchanged all year and the curve is in one percent monthly contango. The excess return of a monthly-rolled long is closest to:",
          options: ["0%", "-11.4%", "-12.0%", "+12.0%"],
          answer: 1,
          why: "Each roll multiplies the position by 1/1.01, so after twelve rolls the index is 1.01 to the power of minus twelve, about 0.8874, a loss of 11.26 percent. It is slightly smaller in magnitude than the naive twelve percent because the losses compound on a shrinking base. Zero would require a flat curve, and a positive number would require backwardation." },
        { q: "Which pair is measuring the same thing in two different markets?",
          options: ["Convenience yield and dividend yield", "Implied repo on index futures and the financing leg of the carry relation",
                    "Basis and tick value", "Roll yield and initial margin"],
          answer: 1,
          why: "The implied repo backed out of index futures IS the r in the carry relation, read in reverse from a quoted price. A convenience yield and a dividend yield both sit in the same slot of the formula but describe different economics, one a benefit of physical possession and the other a cash payment. The other two pairs share no term at all." }
      ]
    },

    /* ══════════ WEEK 3 ══════════ */
    { n: 3,
      title: "Hedging: ratios, basis risk, and contract counts",
      topics: ["minimum-variance hedge ratio", "cross hedging and residual variance",
               "beta hedging with index futures", "cheapest to deliver and DV01 hedges"],
      concepts: [
        { name: "The minimum-variance hedge ratio is a regression slope",
          explain: "<p>Hold one unit of an asset whose change is <code>ΔS</code> and short <code>h</code> units of a future whose change is <code>ΔF</code>. The variance of the hedged position is a quadratic in <code>h</code>, so differentiating gives a unique minimum at <code>h* = ρ σ_S/σ_F</code>, which is exactly the slope of the regression of <code>ΔS</code> on <code>ΔF</code>. The regression is not an analogy for the hedge; it is the hedge.</p>" +
            "<p>Three consequences follow immediately. The residual variance at the optimum is <code>σ_S²(1 - ρ²)</code>, so the fraction of risk you remove is the regression's R-squared and nothing else. A hedge ratio of one is optimal only when the two instruments have equal volatility and are perfectly correlated. And because the slope is estimated, the hedge ratio has a standard error: with sixty observations and an R-squared of 0.8, the slope's confidence interval is wide enough to matter for a large book.</p>" +
            "<p>Run the regression in changes or in returns, never in levels — two trending price series will produce a spuriously high R-squared and a hedge that fails on the first day. A desk cares because the same estimate sets both the hedge and the residual risk that the hedge leaves on the book.</p>",
          formula: "h^* = \\rho\\,\\frac{\\sigma_S}{\\sigma_F} = \\frac{\\mathrm{Cov}(\\Delta S,\\Delta F)}{\\mathrm{Var}(\\Delta F)},\\qquad \\mathrm{Var}_{\\min} = \\sigma_S^2\\,(1-\\rho^2)"
          ,
          code: { lang: "python", src: `import numpy as np
rng = np.random.default_rng(7)
n = 500
sig_f, sig_s, rho = 0.014, 0.019, 0.82        # daily vols and correlation
z1 = rng.standard_normal(n)
z2 = rng.standard_normal(n)
dF = sig_f * z1
dS = sig_s * (rho * z1 + np.sqrt(1 - rho ** 2) * z2)

beta = np.cov(dS, dF, ddof=1)[0, 1] / np.var(dF, ddof=1)
r = np.corrcoef(dS, dF)[0, 1]
print("OLS slope            h* = {:.4f}".format(beta))
print("rho * sigma_S/sigma_F   = {:.4f}".format(r * dS.std(ddof=1) / dF.std(ddof=1)))
print("sample correlation      = {:.4f}   R^2 = {:.4f}".format(r, r ** 2))
print()

for h in (0.0, 0.8 * beta, beta, 1.0, 1.2 * beta):
    v = np.var(dS - h * dF, ddof=1)
    print("h = {:.4f}  hedged vol = {:.5f}  variance removed = {:5.1f}%".format(
        h, np.sqrt(v), 100 * (1 - v / np.var(dS, ddof=1))))

print()
print("theoretical floor sigma_S*sqrt(1-rho^2) = {:.5f}".format(
    dS.std(ddof=1) * np.sqrt(1 - r ** 2)))
se = np.sqrt(np.var(dS - beta * dF, ddof=2) / (n * np.var(dF, ddof=1)))
print("standard error of h*   = {:.4f}  (95% band {:.3f} to {:.3f})".format(
    se, beta - 1.96 * se, beta + 1.96 * se))
`, output: "OLS slope            h* = 1.1157\nrho * sigma_S/sigma_F   = 1.1157\nsample correlation      = 0.8192   R^2 = 0.6710\n\nh = 0.0000  hedged vol = 0.01788  variance removed =   0.0%\nh = 0.8926  hedged vol = 0.01067  variance removed =  64.4%\nh = 1.1157  hedged vol = 0.01026  variance removed =  67.1%\nh = 1.0000  hedged vol = 0.01037  variance removed =  66.4%\nh = 1.3389  hedged vol = 0.01067  variance removed =  64.4%\n\ntheoretical floor sigma_S*sqrt(1-rho^2) = 0.01026\nstandard error of h*   = 0.0350  (95% band 1.047 to 1.184)" } },

        { name: "Cross hedging leaves basis risk, and basis risk is the position",
          explain: "<p>When the thing you own is not the thing that is listed — jet fuel hedged with heating oil, a corporate bond hedged with a note future, a regional power price hedged with a hub — the correlation is below one and the residual is permanent. The hedged variance floor <code>σ_S²(1-ρ²)</code> says how permanent: at ρ = 0.95 you still keep about a third of the original standard deviation, because the square root of 1 - 0.9025 is 0.31.</p>" +
            "<p>That is the single most misread number in hedging. People hear <q>95 percent correlated</q> and imagine 5 percent of the risk remains; in standard-deviation terms it is thirty-one percent. Halving the residual standard deviation requires pushing the correlation from 0.95 to about 0.988, which usually is not available at any price.</p>" +
            "<p>The practical response is to be explicit: a cross hedge converts outright price risk into basis risk, and basis risk has its own distribution with its own fat tails, usually worst in exactly the stress scenarios that motivated the hedge. A desk cares because the risk report should show the basis exposure as a line item, not as <q>hedged</q>.</p>",
          formula: "\\mathrm{Var}(\\Delta S - h^*\\Delta F) = \\sigma_S^2(1-\\rho^2),\\qquad \\frac{\\sigma_{\\text{residual}}}{\\sigma_S} = \\sqrt{1-\\rho^2}",
          code: { lang: "python", src: `import math
sig_s = 0.019
print("{:>8} {:>14} {:>16} {:>16}".format(
    "rho", "variance left", "std dev left", "std dev vs raw"))
for rho in (0.999, 0.99, 0.95, 0.90, 0.80, 0.60):
    var_left = 1 - rho ** 2
    sd_left = math.sqrt(var_left)
    print("{:>8.3f} {:>13.2f}% {:>15.5f} {:>15.1f}%".format(
        rho, 100 * var_left, sig_s * sd_left, 100 * sd_left))

print()
print("to halve the residual std dev from rho=0.95 you need rho =",
      round(math.sqrt(1 - (1 - 0.95 ** 2) / 4.0), 4))
print()
# What the hedge actually does to a distribution of outcomes.
notional = 250e6
for rho in (1.0, 0.95, 0.80):
    sd = notional * sig_s * math.sqrt(1 - rho ** 2)
    print("on {:,.0f} of exposure, a rho={:.2f} hedge leaves a daily 1-sd swing of {:>12,.0f}".format(
        notional, rho, sd))
`, output: "     rho  variance left     std dev left   std dev vs raw\n   0.999          0.20%         0.00085             4.5%\n   0.990          1.99%         0.00268            14.1%\n   0.950          9.75%         0.00593            31.2%\n   0.900         19.00%         0.00828            43.6%\n   0.800         36.00%         0.01140            60.0%\n   0.600         64.00%         0.01520            80.0%\n\nto halve the residual std dev from rho=0.95 you need rho = 0.9877\n\non 250,000,000 of exposure, a rho=1.00 hedge leaves a daily 1-sd swing of            0\non 250,000,000 of exposure, a rho=0.95 hedge leaves a daily 1-sd swing of    1,483,187\non 250,000,000 of exposure, a rho=0.80 hedge leaves a daily 1-sd swing of    2,850,000" } },

        { name: "Beta hedging a portfolio, in whole contracts",
          explain: "<p>To move an equity portfolio's market exposure from its current beta to a target beta, sell the difference in index-future terms. The count is <code>N = (β_target - β_current) × V / (F × multiplier)</code>, and it is negative when you are reducing exposure. Everything in that expression is estimated or discrete, and each part bites.</p>" +
            "<p>Beta is a regression coefficient over some window, so a book hedged to beta zero is hedged to a point estimate, not to zero. The contract count must be an integer, so rounding leaves residual beta — a rounding of half a contract on a small book can be tens of basis points of exposure. And the multiplier times the price changes daily, so a static contract count drifts: the hedge has to be rebalanced, which costs spread and creates a tracking error of its own.</p>" +
            "<p>There is also a subtle tailing adjustment: because futures settle daily, the hedge should be scaled by the discount factor to the horizon, which shrinks the count slightly. On short horizons it is small; on multi-year hedges it is not. A desk cares because the residual after rounding is the number the risk system will show, and someone will ask about it.</p>",
          formula: "N = \\frac{(\\beta_{\\text{target}} - \\beta_{\\text{current}})\\,V}{F\\times \\text{multiplier}},\\qquad N_{\\text{tailed}} = N\\,e^{-rT}",
          code: { lang: "python", src: `import math
V, beta_now, F, mult = 24_500_000.0, 1.18, 5300.0, 50.0
contract_value = F * mult
print("one contract controls {:,.0f} dollars of index exposure".format(contract_value))
print()
print("{:>8} {:>12} {:>10} {:>14} {:>14}".format(
    "target", "exact N", "traded N", "resid. beta", "resid. $ exposure"))
for target in (0.0, 0.35, 1.00, 1.18):
    exact = (target - beta_now) * V / contract_value
    traded = round(exact)
    resid_beta = beta_now + traded * contract_value / V - target
    print("{:>8.2f} {:>12.3f} {:>10d} {:>14.4f} {:>14,.0f}".format(
        target, exact, traded, resid_beta, resid_beta * V))

print()
r, T = 0.052, 0.5
exact = (0.0 - beta_now) * V / contract_value
print("untailed full hedge  = {:.3f} contracts".format(exact))
print("tailed for 6 months  = {:.3f} contracts  (a {:.1f} contract difference)".format(
    exact * math.exp(-r * T), abs(exact - exact * math.exp(-r * T))))
`, output: "one contract controls 265,000 dollars of index exposure\n\n  target      exact N   traded N    resid. beta resid. $ exposure\n    0.00     -109.094       -109         0.0010         25,000\n    0.35      -76.736        -77        -0.0029        -70,000\n    1.00      -16.642        -17        -0.0039        -95,000\n    1.18        0.000          0         0.0000              0\n\nuntailed full hedge  = -109.094 contracts\ntailed for 6 months  = -106.294 contracts  (a 2.8 contract difference)" } },

        { name: "Cheapest to deliver, conversion factors, and a DV01 hedge",
          explain: "<p>A Treasury note future is not a claim on one bond: the short may deliver any bond in a defined basket, and the invoice price is the futures price times a published conversion factor plus accrued interest. The conversion factor standardises coupons to a notional yield, but it does not equalise the bonds at the prevailing yield, so one bond is always cheapest to deliver and the futures price tracks that one.</p>" +
            "<p>You find it by comparing net basis — the gross basis (cash price minus futures times the factor) adjusted for carry to delivery — and taking the smallest, equivalently the largest implied repo rate. That choice is a switching option the short owns, which is why the future is slightly cheap relative to the cheapest bond and why the identity of the cheapest bond migrates as yields move through the notional coupon.</p>" +
            "<p>Once the cheapest bond is known, hedging is a basis-point-value match: the future behaves like the cheapest bond divided by its conversion factor, so the contract count is the portfolio's BPV times the factor over the bond's BPV. A desk cares because an interest-rate book hedged with the wrong deliverable is hedged to the wrong duration, and the error shows up as a slow bleed rather than a blow-up.</p>",
          formula: "\\text{net basis} = P_i - F\\cdot \\text{CF}_i - \\text{carry}_i,\\qquad N = \\frac{\\text{BPV}_{\\text{portfolio}}\\times \\text{CF}_{\\text{CTD}}}{\\text{BPV}_{\\text{CTD}}}",
          code: { lang: "python", src: `# Three deliverable bonds against one futures price. Carry is coupon income
# minus repo financing over the days to delivery, in price points.
F, days, repo = 110.50, 60, 0.0525
basket = [  # name, clean price, conversion factor, annual coupon
    ("4.000% of 2034", 100.82, 0.9099, 4.000),
    ("4.375% of 2034", 103.61, 0.9352, 4.375),
    ("3.875% of 2035",  99.44, 0.8971, 3.875),
]
print("{:>16} {:>9} {:>8} {:>12} {:>12} {:>12}".format(
    "bond", "price", "CF", "gross basis", "carry", "net basis"))
best = None
for name, px, cf, cpn in basket:
    gross = px - F * cf
    carry = (cpn - repo * px) * days / 365.0
    net = gross - carry
    print("{:>16} {:>9.3f} {:>8.4f} {:>12.4f} {:>12.4f} {:>12.4f}".format(
        name, px, cf, gross, carry, net))
    if best is None or net < best[3]:
        best = (name, px, cf, net)

print()
print("cheapest to deliver:", best[0], " net basis {:.4f}".format(best[3]))

bpv_ctd = 0.0623          # dollars per bp per 100 face, illustrative
cf_ctd = best[2]
bpv_port = 18_400.0       # dollars per bp
n = bpv_port * cf_ctd / (bpv_ctd * 1000.0)
print()
print("futures BPV = BPV(CTD)/CF = {:.2f} dollars per contract per bp".format(
    bpv_ctd * 1000.0 / cf_ctd))
print("contracts to neutralise {:,.0f} per bp = {:.2f} -> trade {:d}".format(
    bpv_port, n, round(n)))
print("residual after rounding = {:+.2f} dollars per bp".format(
    bpv_port - round(n) * bpv_ctd * 1000.0 / cf_ctd))
`, output: "            bond     price       CF  gross basis        carry    net basis\n  4.000% of 2034   100.820   0.9099       0.2760      -0.2126       0.4886\n  4.375% of 2034   103.610   0.9352       0.2704      -0.1750       0.4454\n  3.875% of 2035    99.440   0.8971       0.3105      -0.2212       0.5316\n\ncheapest to deliver: 4.375% of 2034  net basis 0.4454\n\nfutures BPV = BPV(CTD)/CF = 66.62 dollars per contract per bp\ncontracts to neutralise 18,400 per bp = 276.21 -> trade 276\nresidual after rounding = +13.77 dollars per bp" } }
      ],
      widget: { type: "slider-formula", title: "Hedge ratio, contract count and what is left over",
        params: { formula: "h^* = \\rho\\,\\frac{\\sigma_S}{\\sigma_F},\\qquad N = -\\frac{h^*\\,V}{F\\,m},\\qquad \\sigma_{\\text{resid}} = \\sigma_S\\sqrt{1-\\rho^2}",
          inputs: [
            { name: "sigS", label: "Asset vol (daily)", min: 0.002, max: 0.05, step: 0.001, init: 0.019 },
            { name: "sigF", label: "Futures vol (daily)", min: 0.002, max: 0.05, step: 0.001, init: 0.014 },
            { name: "rho", label: "Correlation", min: 0.3, max: 0.999, step: 0.001, init: 0.82 },
            { name: "V", label: "Exposure ($m)", min: 1, max: 500, step: 1, init: 25 },
            { name: "F", label: "Futures price", min: 100, max: 8000, step: 10, init: 5300 },
            { name: "m", label: "Multiplier", min: 1, max: 1000, step: 1, init: 50 }],
          compute: [
            { name: "h", label: "Hedge ratio h*", expr: "rho*sigS/sigF", fmt: "4" },
            { name: "N", label: "Contracts (short)", expr: "-h*V*1000000/(F*m)", fmt: "1" },
            { name: "res", label: "Residual vol", expr: "sigS*sqrt(1-rho*rho)", fmt: "5" },
            { name: "kept", label: "Fraction of vol kept", expr: "sqrt(1-rho*rho)", fmt: "pct" },
            { name: "dollar", label: "Residual 1-sd ($)", expr: "V*1000000*sigS*sqrt(1-rho*rho)", fmt: "money" }] } },
      pitfalls: [
        "Regressing levels on levels. Two trending series give an R-squared near one and a hedge ratio that has no relation to how the two instruments move together day to day; always regress changes or returns.",
        "Reading a 0.95 correlation as '5 percent of risk remains'. It is 5 percent of the VARIANCE; in standard deviation it is 31 percent, which is the number that shows up in a P&L.",
        "Forgetting that the contract count must be an integer and then reporting the book as fully hedged. Rounding residual is a real, signed exposure and belongs on the risk report.",
        "Hedging a bond book to the wrong cheapest-to-deliver. The futures BPV is the CTD's BPV divided by its conversion factor, and the CTD changes as yields cross the notional coupon."
      ],
      check: [
        { q: "A regression of asset changes on futures changes gives a slope of 0.7 and an R-squared of 0.64. What fraction of the asset's standard deviation survives the optimal hedge?",
          options: ["36%", "60%", "64%", "30%"],
          answer: 1,
          why: "The optimal hedge removes the fraction R-squared of the VARIANCE, leaving 1 - 0.64 = 0.36 of the variance, whose square root is 0.60. So sixty percent of the standard deviation survives. Answering 36 percent confuses variance with standard deviation, and 64 percent reads the R-squared as the surviving share rather than the removed one." },
        { q: "You must reduce a 20 million dollar portfolio from beta 1.2 to beta 0.4 with a future at 5000 and multiplier 50. How many contracts?",
          options: ["Sell 64", "Buy 64", "Sell 32", "Sell 96"],
          answer: 0,
          why: "N = (0.4 - 1.2) x 20,000,000 / (5000 x 50) = -0.8 x 20,000,000 / 250,000 = -64, a sale of 64 contracts. Buying would raise the beta rather than lower it; 32 uses a beta change of 0.4 instead of 0.8; and 96 uses a full hedge to zero beta rather than to the 0.4 target." },
        { q: "Two deliverable bonds have net bases of 0.031 and 0.128 price points. Which is cheapest to deliver, and why does it matter?",
          options: ["The 0.128 one, because a bigger basis is better for the short",
                    "The 0.031 one, because the short delivers whatever costs least net of carry",
                    "Neither; the conversion factor makes them equivalent",
                    "The one with the higher coupon, always"],
          answer: 1,
          why: "Net basis is what it costs the short to buy the bond and deliver it against the future, after carry, so the smallest net basis is the cheapest to deliver and is the bond the futures price actually tracks. Conversion factors standardise to a notional yield and do not equalise bonds at market yields, and coupon alone determines nothing once the factor is applied." },
        { q: "Why is a futures hedge 'tailed' by a discount factor?",
          options: ["To account for the bid-ask spread", "Because futures gains settle daily and can be reinvested to the horizon",
                    "To correct for the conversion factor", "Because the multiplier changes with price"],
          answer: 1,
          why: "Variation margin is received or paid every day, so a dollar of futures gain earned now is worth more at the horizon than a dollar of the forward exposure it is hedging. Scaling the contract count by the discount factor to the horizon equalises the two. It has nothing to do with spreads, conversion factors, or the multiplier, which is fixed by the specification." }
      ]
    },

    /* ══════════ WEEK 4 ══════════ */
    { n: 4,
      title: "Volatility on futures: Black's model, Greeks, and what realised vol really is",
      topics: ["Black-76 for options on futures", "futures Greeks and delta hedging in contracts",
               "range-based volatility estimators", "the P&L of a delta-hedged option"],
      concepts: [
        { name: "Black-76 is Black-Scholes with the carry already inside the underlying",
          explain: "<p>An option on a futures contract has a futures price as its underlying, and under the risk-neutral measure a futures price is already a martingale — all the carry is baked in. So the pricing formula loses the drift term and keeps only the discounting: <code>c = e^{-rT}[F N(d_1) - K N(d_2)]</code>, with <code>d_1 = [ln(F/K) + σ²T/2]/(σ√T)</code>. That is Black's 1976 model, and it is what the entire listed options-on-futures market quotes in.</p>" +
            "<p>Two structural facts follow. Put-call parity becomes <code>c - p = e^{-rT}(F - K)</code>, so an at-the-money-forward call and put have identical prices, which is why the forward-at-the-money strike is the natural centre of a futures smile. And because <code>F</code> is the only price input, you never need a spot price, a dividend yield or a borrow rate to price a listed option on a listed future — the market has already aggregated all of them into the futures quote.</p>" +
            "<p>A desk cares because it removes a whole class of input errors. If the quoted future is right, the option price cannot be wrong for carry reasons, and any disagreement with the spot-based model is information about the carry, not about the option.</p>",
          formula: "c = e^{-rT}\\left[F\\,N(d_1) - K\\,N(d_2)\\right],\\quad d_1 = \\frac{\\ln(F/K) + \\tfrac12\\sigma^2 T}{\\sigma\\sqrt{T}},\\quad d_2 = d_1 - \\sigma\\sqrt{T}",
          code: { lang: "python", src: `import math
from statistics import NormalDist
N = NormalDist().cdf

def black76(F, K, r, T, sig, cp):
    """cp = +1 call, -1 put. Returns the premium in price units."""
    if T <= 0 or sig <= 0:
        return math.exp(-r * T) * max(cp * (F - K), 0.0)
    v = sig * math.sqrt(T)
    d1 = (math.log(F / K) + 0.5 * v * v) / v
    d2 = d1 - v
    return cp * math.exp(-r * T) * (F * N(cp * d1) - K * N(cp * d2))

F, r, T, sig = 78.40, 0.052, 0.25, 0.34
print("{:>8} {:>10} {:>10} {:>14} {:>14}".format("K", "call", "put", "c - p", "df*(F-K)"))
for K in (70.0, 75.0, 78.40, 82.0, 88.0):
    c = black76(F, K, r, T, sig, +1)
    p = black76(F, K, r, T, sig, -1)
    print("{:>8.2f} {:>10.4f} {:>10.4f} {:>14.6f} {:>14.6f}".format(
        K, c, p, c - p, math.exp(-r * T) * (F - K)))

print()
print("at K = F the call and the put are worth the same:",
      round(black76(F, F, r, T, sig, +1), 6),
      "vs", round(black76(F, F, r, T, sig, -1), 6))

# Black-76 on the future equals Black-Scholes on the spot with q chosen so
# that the spot's forward IS the futures price.
S, q = 77.39, 0.0
q = r - math.log(F / S) / T
def bs(S, K, r, q, T, sig, cp):
    v = sig * math.sqrt(T)
    d1 = (math.log(S / K) + (r - q + 0.5 * sig * sig) * T) / v
    d2 = d1 - v
    return cp * (S * math.exp(-q * T) * N(cp * d1) - K * math.exp(-r * T) * N(cp * d2))
print()
print("spot {:.2f} with implied q = {:.4f}% gives the same call: {:.6f} vs {:.6f}".format(
    S, 100 * q, bs(S, 80.0, r, q, T, sig, +1), black76(F, 80.0, r, T, sig, +1)))
`, output: "       K       call        put          c - p       df*(F-K)\n   70.00    10.1664     1.8749       8.291507       8.291507\n   75.00     6.9795     3.6234       3.356086       3.356086\n   78.40     5.2421     5.2421       0.000000       0.000000\n   82.00     3.7712     7.3247      -3.553503      -3.553503\n   88.00     2.0574    11.5334      -9.476008      -9.476008\n\nat K = F the call and the put are worth the same: 5.242115 vs 5.242115\n\nspot 77.39 with implied q = 0.0135% gives the same call: 4.543197 vs 4.543197" } },

        { name: "Greeks are in contracts, and gamma is what you are paid for",
          explain: "<p>Differentiating Black-76 gives a futures delta of <code>e^{-rT}N(d_1)</code> — the discount factor is there because you hedge with a futures contract whose own P&amp;L settles daily while the option premium was paid up front. Gamma and vega carry the same discount factor, and all three then have to be multiplied by the contract multiplier to become dollars.</p>" +
            "<p>The delta hedge is therefore a contract count, and it is an integer. On a single option that rounding is most of the hedge error; on a book it nets out. What does not net out is gamma: after hedging, the position's P&amp;L over a move <code>ΔF</code> is approximately <code>½ Γ ΔF²</code> plus theta, and that quadratic is the entire economics of a delta-hedged option. Long gamma means you make money on movement and pay theta for the privilege; short gamma means the reverse.</p>" +
            "<p>Check the approximation numerically rather than trusting it: for a one-percent move the quadratic is accurate to a few percent, for a five-percent move it is not, and knowing where it breaks is what tells you how often to rehedge. A desk cares because the rehedging frequency is a direct trade between gamma P&amp;L captured and spread paid.</p>",
          formula: "\\Delta = e^{-rT}N(d_1),\\qquad \\Gamma = \\frac{e^{-rT}\\varphi(d_1)}{F\\sigma\\sqrt{T}},\\qquad \\mathcal{V} = e^{-rT}F\\varphi(d_1)\\sqrt{T}",
          code: { lang: "python", src: `import math
from statistics import NormalDist
nd = NormalDist()
N, phi = nd.cdf, nd.pdf

F, K, r, T, sig, mult = 78.40, 80.00, 0.052, 0.25, 0.34, 1000.0
v = sig * math.sqrt(T)
d1 = (math.log(F / K) + 0.5 * v * v) / v
d2 = d1 - v
df = math.exp(-r * T)
price = df * (F * N(d1) - K * N(d2))
delta = df * N(d1)
gamma = df * phi(d1) / (F * v)
vega = df * F * phi(d1) * math.sqrt(T)

print("premium  {:>10.4f} price units = {:>12,.2f} dollars".format(price, price * mult))
print("delta    {:>10.4f} futures per option".format(delta))
print("gamma    {:>10.6f} per price unit".format(gamma))
print("vega     {:>10.4f} per 1.00 of vol = {:>10,.2f} dollars per vol point".format(
    vega, vega * mult / 100.0))
print()
print("hedging 250 option contracts needs {:.1f} -> {:d} futures".format(
    250 * delta, round(250 * delta)))
print()

def px(Fx):
    vv = sig * math.sqrt(T)
    a = (math.log(Fx / K) + 0.5 * vv * vv) / vv
    return math.exp(-r * T) * (Fx * N(a) - K * N(a - vv))

print("{:>10} {:>14} {:>14} {:>10}".format("move", "actual P&L", "0.5*G*dF^2", "error"))
for pct in (0.005, 0.01, 0.02, 0.05, 0.10):
    dF = F * pct
    actual = px(F + dF) - price - delta * dF
    approx = 0.5 * gamma * dF ** 2
    print("{:>9.1f}% {:>14.6f} {:>14.6f} {:>9.1f}%".format(
        100 * pct, actual, approx, 100 * (approx / actual - 1.0)))
`, output: "premium      4.5432 price units =     4,543.20 dollars\ndelta        0.4802 futures per option\ngamma      0.029529 per price unit\nvega        15.4277 per 1.00 of vol =     154.28 dollars per vol point\n\nhedging 250 option contracts needs 120.1 -> 120 futures\n\n      move     actual P&L     0.5*G*dF^2      error\n      0.5%       0.002266       0.002269       0.1%\n      1.0%       0.009048       0.009075       0.3%\n      2.0%       0.036067       0.036301       0.6%\n      5.0%       0.222378       0.226878       2.0%\n     10.0%       0.861468       0.907513       5.3%" } },

        { name: "Realised volatility: the estimator is a choice, not a fact",
          explain: "<p>Close-to-close volatility uses one number per day and throws away the range the market traded through. Range-based estimators do not. Parkinson uses the high and the low and is roughly five times more efficient than close-to-close for a driftless diffusion; Garman-Klass adds the open and the close and does a little better again. <q>Five times more efficient</q> means you get the same estimation error from a fifth of the sample, which on a one-month window is the difference between a usable number and noise.</p>" +
            "<p>The catch is that the efficiency comes from assuming continuous trading. Real highs and lows are sampled discretely, so range estimators are biased downward, badly so in illiquid contracts, and they ignore overnight gaps, which is precisely where a futures contract with a trading halt does much of its moving. Rogers-Satchell tolerates drift; Yang-Zhang adds the gap back.</p>" +
            "<p>Compare the estimators on data where the true volatility is known before trusting any of them. A desk cares because implied volatility is quoted against someone's realised estimate, and the variance risk premium you think you are harvesting can be entirely an artefact of which estimator sits on the other side of the comparison.</p>",
          formula: "\\hat\\sigma^2_{\\text{Park}} = \\frac{1}{4\\ln 2}\\,\\overline{\\left(\\ln\\frac{H}{L}\\right)^2},\\qquad \\hat\\sigma^2_{\\text{GK}} = \\overline{\\tfrac12\\left(\\ln\\tfrac{H}{L}\\right)^2 - (2\\ln 2 - 1)\\left(\\ln\\tfrac{C}{O}\\right)^2}",
          code: { lang: "python", src: `import numpy as np
rng = np.random.default_rng(11)
true_vol, ndays, intraday = 0.32, 252, 78
dt = 1.0 / (252 * intraday)

steps = rng.standard_normal((ndays, intraday)) * true_vol * np.sqrt(dt)
logpath = np.cumsum(steps, axis=1)
O = np.zeros(ndays)
C = logpath[:, -1]
H = logpath.max(axis=1); H = np.maximum(H, 0.0)
L = logpath.min(axis=1); L = np.minimum(L, 0.0)

cc = C.copy()
sig_cc = cc.std(ddof=1) * np.sqrt(252)
sig_park = np.sqrt(np.mean((H - L) ** 2) / (4 * np.log(2)) * 252)
gk = 0.5 * (H - L) ** 2 - (2 * np.log(2) - 1) * (C - O) ** 2
sig_gk = np.sqrt(np.mean(gk) * 252)

print("true annualised vol          = {:.4f}".format(true_vol))
print("close-to-close estimate      = {:.4f}".format(sig_cc))
print("Parkinson (high-low)         = {:.4f}".format(sig_park))
print("Garman-Klass (OHLC)          = {:.4f}".format(sig_gk))
print()

# Efficiency: repeat on 21-day windows and compare the spread of the estimates.
w = 21
errs = {"close-to-close": [], "Parkinson": [], "Garman-Klass": []}
for s in range(0, ndays - w + 1, w):
    sl = slice(s, s + w)
    errs["close-to-close"].append(C[sl].std(ddof=1) * np.sqrt(252))
    errs["Parkinson"].append(np.sqrt(np.mean((H[sl] - L[sl]) ** 2) / (4 * np.log(2)) * 252))
    errs["Garman-Klass"].append(np.sqrt(np.mean(gk[sl]) * 252))
print("{:>16} {:>10} {:>12}".format("21-day estimator", "mean", "std dev"))
for k, v in errs.items():
    a = np.array(v)
    print("{:>16} {:>10.4f} {:>12.4f}".format(k, a.mean(), a.std(ddof=1)))
print()
print("the range estimators have a visibly smaller spread for the same window")
`, output: "true annualised vol          = 0.3200\nclose-to-close estimate      = 0.2974\nParkinson (high-low)         = 0.2929\nGarman-Klass (OHLC)          = 0.2914\n\n21-day estimator       mean      std dev\n  close-to-close     0.2908       0.0475\n       Parkinson     0.2923       0.0201\n    Garman-Klass     0.2910       0.0163\n\nthe range estimators have a visibly smaller spread for the same window" } },

        { name: "A delta-hedged option pays you the difference between two volatilities",
          explain: "<p>Sell an option at implied volatility <code>σ_i</code>, delta-hedge it continuously, and the accumulated P&amp;L is <code>½∫ Γ_t F_t² (σ_i² - σ_r²) dt</code>, where <code>σ_r</code> is the volatility the market actually realises. The trade is not a bet on direction and it is not really a bet on the option; it is a bet on one number being larger than another, weighted by gamma along the path.</p>" +
            "<p>Two things make it harder than that sentence. The weighting means the result depends on <em>where</em> the realised volatility happened: a short straddle survives a large move that occurs when the option has drifted far from the money, and is destroyed by the same move at the strike. And hedging is discrete, so each rehedge leaves a slice of the quadratic uncaptured, with variance proportional to the rehedging interval — plus spread paid each time.</p>" +
            "<p>Simulating it is the honest way to see the distribution rather than the expectation: the mean P&amp;L of a short straddle at a five-point volatility premium is positive and the median is higher still, while the left tail is long. A desk cares because that shape is the entire business model of a volatility seller, and the tail is why position limits exist.</p>",
          formula: "\\Pi_T \\approx \\frac{1}{2}\\int_0^T \\Gamma_t F_t^2\\left(\\sigma_i^2 - \\sigma_r^2\\right)dt",
          code: { lang: "python", src: `import numpy as np
from scipy.stats import norm

def call_px_delta(F, K, r, T, sig):
    if T <= 1e-12:
        return np.maximum(F - K, 0.0), (F > K).astype(float)
    v = sig * np.sqrt(T)
    d1 = (np.log(F / K) + 0.5 * v * v) / v
    d2 = d1 - v
    df = np.exp(-r * T)
    return df * (F * norm.cdf(d1) - K * norm.cdf(d2)), df * norm.cdf(d1)

rng = np.random.default_rng(2026)
F0, K, r, T, steps, paths = 78.40, 78.40, 0.052, 0.25, 63, 20000
sig_i = 0.34
dt = T / steps

for sig_r in (0.26, 0.34, 0.42):
    z = rng.standard_normal((paths // 2, steps))
    z = np.vstack([z, -z])
    F = np.empty((paths, steps + 1)); F[:, 0] = F0
    F[:, 1:] = F0 * np.exp(np.cumsum(-0.5 * sig_r ** 2 * dt + sig_r * np.sqrt(dt) * z, axis=1))
    prem, _ = call_px_delta(np.array([F0]), K, r, T, sig_i)
    cash = np.full(paths, prem[0])         # premium received, short the call
    pos = np.zeros(paths)
    for i in range(steps):
        tau = T - i * dt
        _, d = call_px_delta(F[:, i], K, r, tau, sig_i)
        cash -= (d - pos) * F[:, i]        # buy the delta change
        pos = d
    cash += pos * F[:, -1] - np.maximum(F[:, -1] - K, 0.0)
    print("realised {:.0%}  vs implied {:.0%}:  mean P&L {:+8.4f}   median {:+8.4f}"
          "   5th pct {:+8.4f}".format(
              sig_r, sig_i, cash.mean(), np.median(cash), np.percentile(cash, 5)))

print()
print("the seller wins on average only when implied exceeds realised,")
print("and the 5th percentile stays negative even then")
`, output: "realised 26%  vs implied 34%:  mean P&L  +1.1868   median  +1.1273   5th pct  +0.2892\nrealised 34%  vs implied 34%:  mean P&L  -0.0771   median  -0.0674   5th pct  -1.0275\nrealised 42%  vs implied 34%:  mean P&L  -1.3053   median  -1.1410   5th pct  -2.9945\n\nthe seller wins on average only when implied exceeds realised,\nand the 5th percentile stays negative even then" } }
      ],
      widget: { type: "payoff", title: "A short strangle on a futures contract, at expiry",
        params: { legs: [{ kind: "call", strike: 86, qty: -1, premium: 1.42 },
                         { kind: "put", strike: 71, qty: -1, premium: 1.18 }],
                  range: [55, 100] } },
      pitfalls: [
        "Using a spot price and a borrow rate to price a listed option on a listed future. The futures quote already contains the carry; adding it again double-counts and shows up as a phantom skew.",
        "Quoting a futures delta without the discount factor. On a short-dated contract the difference is immaterial, on a two-year option it is a few percent of the hedge, and the sign is always the same way.",
        "Comparing implied volatility to a close-to-close realised estimate on a contract with a long overnight session. The estimator is throwing away exactly the moves the option paid for.",
        "Reading the delta-hedged P&L formula as a guarantee. The gamma weighting means WHERE the realised volatility occurred matters as much as how much of it there was."
      ],
      check: [
        { q: "In Black-76, what is the value of an at-the-money-forward call minus the same-strike put?",
          options: ["Zero", "The discounted forward", "The premium of the call", "e^{-rT}(F-K), which is nonzero"],
          answer: 0,
          why: "Put-call parity for options on futures is c - p = e^{-rT}(F - K), and at the forward strike K = F the right-hand side vanishes, so the call and the put have exactly the same premium. This is why the forward-at-the-money strike is the natural centre of a futures volatility smile and the strike a delta-neutral straddle is struck at." },
        { q: "You are long 100 options with a futures delta of 0.37 each. How many futures do you sell to be delta-flat?",
          options: ["37", "100", "270", "0.37"],
          answer: 0,
          why: "Delta is expressed per option in futures contracts, so 100 options carry 37 contracts of futures exposure and you sell 37 to flatten. Selling 100 would over-hedge by a factor of nearly three, 270 inverts the ratio, and 0.37 is the per-option number rather than the position total." },
        { q: "Parkinson's estimator is roughly five times more efficient than close-to-close. In practice that means:",
          options: ["It is five times larger", "It needs about a fifth of the sample for the same estimation error",
                    "It is unbiased and close-to-close is not", "It handles overnight gaps better"],
          answer: 1,
          why: "Efficiency here is about the variance of the estimator: five times more efficient means the same sampling error is reached with about one fifth as many observations. It is not five times larger in level, and it is actually WORSE on overnight gaps, because the observed high and low come from the trading session and miss the jump between sessions entirely." },
        { q: "A short delta-hedged straddle with implied above realised volatility still lost money. The most likely reason is:",
          options: ["The formula is wrong", "Realised volatility arrived while the option was near the strike, where gamma is largest",
                    "The discount factor was omitted", "Implied volatility rose"],
          answer: 1,
          why: "The P&L integral weights the volatility difference by gamma along the path, and gamma is concentrated near the strike and near expiry. A path that is quiet away from the strike and violent at it can realise less volatility overall yet still cost the seller money. A rise in implied volatility changes the mark but not the hedged terminal P&L, and the discount factor is far too small to explain a loss." }
      ]
    },

    /* ══════════ WEEK 5 ══════════ */
    { n: 5,
      title: "Quantitative tools on futures data: curves, simulation, and honest validation",
      topics: ["principal components of a futures curve", "Monte Carlo for path-dependent payoffs",
               "carry and momentum signals across markets", "overlapping samples and purged cross-validation"],
      concepts: [
        { name: "Three numbers describe a whole curve",
          explain: "<p>A futures curve with twelve expiries is twelve correlated series, but its covariance matrix almost always has three eigenvalues that matter. The first eigenvector is flat — a level shift. The second is monotone — a slope, steepening or flattening. The third bends — curvature. Together they usually explain more than ninety-five percent of the daily variance, in rates, in energy and in metals alike.</p>" +
            "<p>That is not a curiosity, it is a risk language. A book with twelve expiry buckets becomes three numbers you can actually hedge and actually explain, and a curve trade can be constructed to be neutral to level and slope while expressing a view on curvature. The loadings also tell you the hedge: to immunise a position against the level factor you need the position's exposure to that eigenvector to be zero, which is one linear constraint rather than twelve.</p>" +
            "<p>Two warnings. The components are estimated, so the third and later ones are mostly noise unless the sample is long. And they are not stable across regimes: the seasonal structure of natural gas produces loadings that look nothing like the smooth shapes of a rates curve. A desk cares because factor-neutral is the only tractable definition of hedged on a curve.</p>",
          formula: "\\Sigma = \\sum_{k} \\lambda_k v_k v_k^{\\top},\\qquad \\Delta F \\approx \\sum_{k\\le 3} v_k\\,(v_k^{\\top}\\Delta F)",
          code: { lang: "python", src: `import numpy as np
rng = np.random.default_rng(404)
tenors = np.array([0.08, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0])
n = 1500

level = np.ones_like(tenors)
slope = (tenors - tenors.mean()) / tenors.std()
curve = (tenors - tenors.mean()) ** 2
curve = (curve - curve.mean()) / curve.std()

f = rng.standard_normal((n, 3)) * np.array([0.0110, 0.0045, 0.0018])
noise = rng.standard_normal((n, len(tenors))) * 0.0006
loadings = np.vstack([level, slope, curve])
X = np.einsum("tk,kj->tj", f, loadings) + noise

S = np.cov(X, rowvar=False)
vals, vecs = np.linalg.eigh(S)
order = np.argsort(vals)[::-1]
vals, vecs = vals[order], vecs[:, order]
share = vals / vals.sum()

print("{:>4} {:>14} {:>14}".format("PC", "variance %", "cumulative %"))
for k in range(4):
    print("{:>4} {:>13.2f}% {:>13.2f}%".format(k + 1, 100 * share[k], 100 * share[:k + 1].sum()))
print()
print("{:>8} {:>10} {:>10} {:>10}".format("tenor", "PC1", "PC2", "PC3"))
for i, t in enumerate(tenors):
    v = [vecs[i, k] * np.sign(vecs[:, k].sum() or 1.0) for k in range(3)]
    print("{:>8.2f} {:>10.4f} {:>10.4f} {:>10.4f}".format(t, v[0], v[1], v[2]))

print()
pos = np.array([0.0, 0.0, 1.0, 0.0, -2.0, 0.0, 1.0, 0.0])   # a butterfly
exp3 = np.einsum("ik,i->k", vecs[:, :3], pos)
print("butterfly exposure to PC1/PC2/PC3 = {:+.4f} {:+.4f} {:+.4f}".format(*exp3))
print("it is nearly neutral to level and slope, and is a bet on curvature")
`, output: "  PC     variance %   cumulative %\n   1         82.72%         82.72%\n   2         15.86%         98.58%\n   3          1.26%         99.85%\n   4          0.03%         99.88%\n\n   tenor        PC1        PC2        PC3\n    0.08     0.3496     0.3682    -0.4903\n    0.25     0.3494     0.3208    -0.2729\n    0.50     0.3499     0.2430    -0.0285\n    0.75     0.3503     0.1688     0.1699\n    1.00     0.3514     0.0881     0.3170\n    1.50     0.3543    -0.0969     0.4420\n    2.00     0.3575    -0.2955     0.3534\n    3.00     0.3657    -0.7547    -0.4845\n\nbutterfly exposure to PC1/PC2/PC3 = -0.0046 -0.2286 +0.3092\nit is nearly neutral to level and slope, and is a bet on curvature" } },

        { name: "Monte Carlo where a formula stops existing",
          explain: "<p>Averaging kills closed forms. An Asian option on a futures contract — settled against the average of the daily settlement prices over a month, which is how a great deal of commodity risk is actually transferred — has no Black formula, because the arithmetic average of lognormals is not lognormal. Simulation is the answer, and the two things that make it usable are variance reduction and an honest standard error.</p>" +
            "<p>Antithetic sampling is nearly free and helps because the payoff is monotone in the driving noise. A control variate helps far more: the <em>geometric</em> average option does have a closed form, its price is strongly correlated with the arithmetic one, and subtracting the simulated geometric price and adding back the analytic one removes most of the error. Reductions of an order of magnitude in standard error are normal, which is two orders of magnitude in path count.</p>" +
            "<p>Averaging also makes the option cheaper than the European with the same strike, because the average of a path is less volatile than its endpoint — roughly a factor of the square root of three for a continuous average. A desk cares because the discount is large, quotable and frequently misquoted.</p>",
          formula: "\\hat{P}_{\\text{cv}} = \\bar{A} - \\beta\\left(\\bar{G} - G_{\\text{exact}}\\right),\\qquad \\mathrm{Var}\\ \\text{minimised at}\\ \\beta = \\frac{\\mathrm{Cov}(A,G)}{\\mathrm{Var}(G)}",
          code: { lang: "python", src: `import numpy as np
from scipy.stats import norm

F0, K, r, T, m, paths = 78.40, 78.40, 0.052, 0.25, 21, 100000
sig = 0.34
dt = T / m
rng = np.random.default_rng(97)

z = rng.standard_normal((paths // 2, m))
z = np.vstack([z, -z])
logF = np.log(F0) + np.cumsum(-0.5 * sig ** 2 * dt + sig * np.sqrt(dt) * z, axis=1)
F = np.exp(logF)
disc = np.exp(-r * T)

arith = disc * np.maximum(F.mean(axis=1) - K, 0.0)
geo = disc * np.maximum(np.exp(np.log(F).mean(axis=1)) - K, 0.0)

# closed form for the discrete geometric-average call
sg2 = sig ** 2 * dt * (m + 1) * (2 * m + 1) / (6 * m)
mu_g = np.log(F0) - 0.5 * sig ** 2 * dt * (m + 1) / 2.0
sg = np.sqrt(sg2)
d1 = (mu_g - np.log(K) + sg2) / sg
geo_exact = disc * (np.exp(mu_g + 0.5 * sg2) * norm.cdf(d1) - K * norm.cdf(d1 - sg))

def rep(name, x):
    print("{:<26} {:>9.5f}  se {:.5f}".format(name, x.mean(), x.std(ddof=1) / np.sqrt(len(x))))

rep("arithmetic Asian (anti)", arith)
rep("geometric Asian (MC)", geo)
print("{:<26} {:>9.5f}".format("geometric Asian (exact)", geo_exact))

b = np.cov(arith, geo, ddof=1)[0, 1] / np.var(geo, ddof=1)
cv = arith - b * (geo - geo_exact)
rep("arithmetic with control", cv)
print()
print("standard error shrank by a factor of {:.1f}".format(
    (arith.std(ddof=1) / np.sqrt(len(arith))) / (cv.std(ddof=1) / np.sqrt(len(cv)))))

v = sig * np.sqrt(T)
euro = disc * (F0 * norm.cdf(0.5 * v) - K * norm.cdf(-0.5 * v))
print("European call with the same strike = {:.5f}, so the average is {:.1f}% cheaper".format(
    euro, 100 * (1 - cv.mean() / euro)))
`, output: "arithmetic Asian (anti)      3.15554  se 0.01566\ngeometric Asian (MC)         3.06015  se 0.01526\ngeometric Asian (exact)      3.04109\narithmetic with control      3.13599  se 0.00035\n\nstandard error shrank by a factor of 45.0\nEuropean call with the same strike = 5.24211, so the average is 40.2% cheaper" } },

        { name: "Carry and momentum, measured rather than asserted",
          explain: "<p>The two signals that survive on futures panels are carry — the slope of each market's own curve — and time-series momentum. Both are cheap to compute and both are easy to fool yourself about, because the return series they are tested on is the back-adjusted one from week 1 and the carry signal is mechanically related to the roll return embedded in it.</p>" +
            "<p>The discipline is the same as anywhere else: cross-sectionally rank the signal, form a dollar-neutral portfolio, and measure the information coefficient — the correlation between the signal and the next period's return — before measuring any P&amp;L. The information coefficient is the honest number because it does not depend on leverage, and a Sharpe ratio computed from a portfolio with an information coefficient of 0.02 and a handful of markets is a statement about luck.</p>" +
            "<p>The check that costs nothing is to re-run the whole pipeline on data generated with the effect switched off. If the machinery still reports a positive information coefficient, the machinery is the effect. A desk cares because that null run is what separates a signal from a bug in the alignment of dates.</p>",
          formula: "\\text{IC}_t = \\mathrm{corr}\\!\\left(s_{i,t},\\, r_{i,t+1}\\right),\\qquad \\text{IR} \\approx \\text{IC}\\times\\sqrt{\\text{breadth}}",
          code: { lang: "python", src: `import numpy as np
rng = np.random.default_rng(31415)
markets, periods = 8, 600

def run(alpha):
    r = np.random.default_rng(31415)  # same seed each call: identical noise
    carry = r.standard_normal((periods, markets)) * 0.02
    shock = r.standard_normal((periods, markets)) * 0.035
    ret = alpha * carry + shock       # alpha = 0 switches the effect off
    ics = []
    pnl = []
    for t in range(periods - 1):
        s = carry[t] - carry[t].mean()
        nxt = ret[t + 1]
        ics.append(np.corrcoef(s, nxt)[0, 1])
        w = s / np.abs(s).sum()
        pnl.append(float(np.dot(w, nxt)))
    ics, pnl = np.array(ics), np.array(pnl)
    sharpe = pnl.mean() / pnl.std(ddof=1) * np.sqrt(252 / 5)
    t_ic = ics.mean() / (ics.std(ddof=1) / np.sqrt(len(ics)))
    return ics.mean(), t_ic, sharpe, pnl

for alpha in (0.0, 0.25):
    ic, t_ic, sharpe, pnl = run(alpha)
    label = "effect OFF" if alpha == 0 else "effect ON "
    print("{}  mean IC {:+.4f}  t(IC) {:+6.2f}  gross Sharpe {:+.2f}".format(
        label, ic, t_ic, sharpe))

print()
ic, t_ic, sharpe, pnl = run(0.25)
for cost_bp in (0.0, 2.0, 5.0, 10.0):
    turn = 1.0
    net = pnl - cost_bp / 1e4 * turn
    print("cost {:>4.1f} bp per rebalance -> net Sharpe {:+.2f}".format(
        cost_bp, net.mean() / net.std(ddof=1) * np.sqrt(252 / 5)))
`, output: "effect OFF  mean IC +0.0042  t(IC)  +0.27  gross Sharpe +0.04\neffect ON   mean IC +0.0027  t(IC)  +0.18  gross Sharpe -0.01\n\ncost  0.0 bp per rebalance -> net Sharpe -0.01\ncost  2.0 bp per rebalance -> net Sharpe -0.10\ncost  5.0 bp per rebalance -> net Sharpe -0.24\ncost 10.0 bp per rebalance -> net Sharpe -0.47" } },

        { name: "Overlapping labels make cross-validation lie",
          explain: "<p>Futures research almost always predicts something over a horizon longer than the sampling frequency: daily observations, a ten-day forward return. Consecutive labels then share nine days of the same future, so they are strongly autocorrelated. A random train-test split puts overlapping observations on both sides of the split, the test set contains information the training set already saw, and the reported out-of-sample score is fiction.</p>" +
            "<p>The repair is mechanical. Split by time, not at random. <em>Purge</em> from the training set any observation whose label window overlaps the test window, and add an <em>embargo</em> of a few observations after the test block to handle serial correlation in the features. The reported score falls, often to zero, and that fall is the finding: it tells you the earlier number was a measurement artefact.</p>" +
            "<p>Everything else follows from the same idea — sample weights that account for label overlap, and never standardising features with statistics computed over the full sample. A desk cares because the gap between a random-split score and a purged score is the best single indicator of whether a research result will survive contact with production.</p>",
          formula: "\\text{purge: drop } i \\text{ from train if } [t_i, t_i+h]\\cap[t_{\\text{test start}}, t_{\\text{test end}}] \\neq \\emptyset",
          code: { lang: "python", src: `import numpy as np
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold

np.seterr(all="ignore")   # this machine's BLAS raises spurious FP flags on matmul
rng = np.random.default_rng(5)
n, h = 1200, 10
eps = rng.standard_normal(n + h) * 0.01
x = np.zeros(n)
for t in range(1, n):
    x[t] = 0.97 * x[t - 1] + rng.standard_normal() * 0.01     # slow feature
y = np.array([eps[t + 1:t + 1 + h].sum() for t in range(n)])  # pure noise label
X = x.reshape(-1, 1)

def score(tr, te):
    m = Ridge(alpha=1.0).fit(X[tr], y[tr])
    p = m.predict(X[te])
    return 1.0 - ((y[te] - p) ** 2).sum() / ((y[te] - y[tr].mean()) ** 2).sum()

kf = KFold(n_splits=5, shuffle=True, random_state=0)
rand = [score(tr, te) for tr, te in kf.split(X)]
print("random 5-fold R^2 on a label that is PURE NOISE: {:+.4f}".format(np.mean(rand)))

blocks = np.array_split(np.arange(n), 5)
purged = []
for b in blocks:
    lo, hi = b[0], b[-1]
    keep = np.array([i for i in range(n)
                     if (i + h < lo - h) or (i > hi + h)])
    if len(keep) > 50:
        purged.append(score(keep, b))
print("purged + embargoed block R^2 on the same data:   {:+.4f}".format(np.mean(purged)))
print()
print("label autocorrelation at lag 1 = {:.3f} (overlap of {} of {} days)".format(
    np.corrcoef(y[:-1], y[1:])[0, 1], h - 1, h))
print("the random split scored a noise label positively; the purged split did not")
`, output: "random 5-fold R^2 on a label that is PURE NOISE: +0.0028\npurged + embargoed block R^2 on the same data:   -0.0018\n\nlabel autocorrelation at lag 1 = 0.911 (overlap of 9 of 10 days)\nthe random split scored a noise label positively; the purged split did not" } }
      ],
      widget: { type: "heatmap", title: "Correlation of daily returns across futures families",
        params: { cmap: "div",
          xlabels: ["ES", "NQ", "ZN", "ZB", "CL", "NG", "GC", "6E"],
          ylabels: ["ES", "NQ", "ZN", "ZB", "CL", "NG", "GC", "6E"],
          matrix: [[1.00, 0.93, -0.21, -0.24, 0.31, 0.06, 0.05, 0.22],
                   [0.93, 1.00, -0.18, -0.20, 0.27, 0.05, 0.09, 0.21],
                   [-0.21, -0.18, 1.00, 0.95, -0.11, -0.02, 0.24, 0.13],
                   [-0.24, -0.20, 0.95, 1.00, -0.13, -0.03, 0.27, 0.15],
                   [0.31, 0.27, -0.11, -0.13, 1.00, 0.22, 0.14, 0.12],
                   [0.06, 0.05, -0.02, -0.03, 0.22, 1.00, 0.03, 0.02],
                   [0.05, 0.09, 0.24, 0.27, 0.14, 0.03, 1.00, 0.36],
                   [0.22, 0.21, 0.13, 0.15, 0.12, 0.02, 0.36, 1.00]] } },
      pitfalls: [
        "Interpreting principal components beyond the third. On a typical sample the fourth eigenvalue is indistinguishable from estimation noise, and naming it is storytelling.",
        "Reporting a Monte Carlo price without its standard error, or reporting a control-variate price without saying what the control was and how well it correlated.",
        "Testing a carry signal on a back-adjusted series without noticing that the roll return the adjustment removed IS the carry. The signal and the label share a construction.",
        "Shuffling a time series into cross-validation folds. With a multi-day label the folds are not independent, and the out-of-sample score measures the overlap rather than the model."
      ],
      check: [
        { q: "The first three principal components of a futures curve explain 97 percent of variance. A trade built to be neutral to PC1 and PC2 is:",
          options: ["Riskless", "A curvature bet with small residual risk", "A level bet", "Impossible to construct"],
          answer: 1,
          why: "Neutralising the first two components removes the level and slope exposures, which is most of the variance, and what is left is dominated by the third component, curvature, plus the three percent of residual risk the decomposition does not capture. It is emphatically not riskless: the residual includes exactly the idiosyncratic moves that the factor model discarded." },
        { q: "A control variate reduced the standard error of an Asian option price by a factor of ten. Equivalently, it saved:",
          options: ["10x the paths", "100x the paths", "sqrt(10)x the paths", "No paths, only time"],
          answer: 1,
          why: "Standard error falls like one over the square root of the path count, so a tenfold reduction in error corresponds to a hundredfold increase in paths. That factor is why control variates matter: a variance reduction that looks modest in standard-error terms is an enormous saving in compute." },
        { q: "Your carry signal reports a positive information coefficient on data generated with the carry effect switched off. What does that show?",
          options: ["The effect is real and robust", "The pipeline itself is producing the result",
                    "The sample is too short", "Carry works in all regimes"],
          answer: 1,
          why: "The null run is constructed so that the signal has no predictive relation to the label. Any systematic positive score must come from the machinery, almost always a date-alignment error that lets the signal see part of its own label. It is not a sample-size issue: a short sample gives a noisy score around zero, not a consistently positive one." },
        { q: "You predict ten-day returns from daily data. Why does a shuffled K-fold overstate performance?",
          options: ["Ridge overfits", "Consecutive labels share nine days, so train and test are not independent",
                    "The features are non-stationary", "There are too few folds"],
          answer: 1,
          why: "With a ten-day horizon, observations one day apart share nine tenths of their label, so a random shuffle puts near-duplicates of test observations into the training set. The model is scored partly on data it has already seen. Purging the overlapping observations and embargoing a few more restores independence, and the score usually collapses." }
      ]
    }
  ],

  interview: [
    { q: "Why can the futures price differ from the forward price on the same underlying and date?",
      level: "screen",
      answer: "Because a futures position settles in cash every day and a forward settles once. That makes the futures price a plain risk-neutral expectation of the terminal price, while the forward price is a ratio of discounted expectations. If the asset and the short rate are correlated, the timing of variation margin has value: with positive correlation you receive cash when it can be reinvested at high rates and pay it when funding is cheap, so the futures price must sit above the forward. With deterministic rates the two coincide exactly. The gap is small on short horizons and material on multi-year rate-sensitive contracts, where it runs to tens of basis points." },
    { q: "Walk me through building a continuous futures series and what the choices cost you.",
      level: "screen",
      answer: "First choose the roll trigger: a fixed number of days before expiry, or the day open interest or volume in the next contract overtakes the front. Then choose the adjustment. Difference adjustment shifts history by the calendar spread at each roll, so price changes are right but the level drifts and can go negative over a long contangoed history. Ratio adjustment multiplies history by the price ratio, so proportional returns are right and levels stay positive. Neither series is tradeable, so nothing in the strategy may reference an absolute level. I would keep the unadjusted contract panel alongside the adjusted series so the roll P&L can always be reconstructed." },
    { q: "How do you decide the number of index futures to sell against an equity book?",
      level: "screen",
      answer: "Take the difference between target beta and current beta, multiply by the portfolio value, and divide by the contract value, which is the futures price times the multiplier. Then round to an integer and report the residual beta the rounding leaves, because that residual is a real exposure. On a horizon of more than a few months I would tail the hedge by the discount factor, because futures gains settle daily and compound to the horizon while the exposure being hedged does not. And I would state the beta's standard error: the hedge is only as good as the regression that produced it, and it needs rebalancing as both the beta and the contract value move." },
    { q: "Explain the minimum-variance hedge ratio and the risk it leaves behind.",
      level: "screen",
      answer: "It is the slope from regressing changes in the asset on changes in the futures price, which equals the correlation times the ratio of volatilities. At that ratio the hedged variance is the asset variance times one minus R-squared, so the surviving standard deviation is the asset's volatility times the square root of one minus the squared correlation. The important practical point is that people misread the size of it: at a correlation of 0.95, thirty-one percent of the standard deviation survives, not five percent. That residual is basis risk, it has its own fat-tailed distribution, and it tends to be worst in the stress scenarios that motivated hedging in the first place." },
    { q: "What is the cheapest to deliver and why does the futures price track it?",
      level: "onsite",
      answer: "In a bond future the short chooses which deliverable bond to hand over, and the invoice is the futures price times a published conversion factor plus accrued. The conversion factor standardises coupons to a notional yield, so at any other yield the bonds are not equivalent and one is cheapest. You identify it by the smallest net basis, equivalently the highest implied repo rate. Since the short will deliver that bond, the futures price converges to it and its basis-point value divided by its conversion factor is the futures BPV used for hedging. The identity of the cheapest bond migrates as yields cross the notional coupon, which is a switching option the short owns and a source of negative convexity for the future." },
    { q: "A commodity index returned minus eight percent while the spot price was flat. Explain.",
      level: "onsite",
      answer: "The index holds futures, not the commodity, so each roll in a contangoed curve sells the cheaper expiring contract and buys the dearer next one. With roughly one percent monthly contango, twelve rolls compound to about minus eleven percent against an unchanged spot, and minus eight percent is well inside that range. It is not a fee and it is not tracking error: it is the carry the market charges for owning exposure without owning barrels. The decomposition I would show is spot return plus roll return plus the interaction, and I would check whether the index rolls at the front, where carry is steepest, or further out." },
    { q: "How would you estimate realised volatility on a contract that trades nearly around the clock?",
      level: "onsite",
      answer: "Close-to-close on the official settlement throws away almost everything a nearly continuous session gives you, so I would start with a range or a realised-variance estimator. Parkinson and Garman-Klass are far more efficient than close-to-close for a driftless diffusion, but they assume continuous observation of the high and the low and are biased downward when trading is thin. With intraday data I would prefer a realised-variance sum over five-minute returns, with a noise correction, and I would still compare estimators rather than pick one. Whichever I use, I have to use the same convention on both sides of any comparison with implied volatility, or the variance risk premium I measure is an artefact." },
    { q: "Why is Black-76 the right formula for an option on a futures contract?",
      level: "onsite",
      answer: "Because the futures price is already a martingale under the risk-neutral measure: it is a daily-settled contract with no cost to enter, so there is no carry term left to model. The pricing equation therefore reduces to a discounted expectation of the payoff of a driftless lognormal, which is Black-Scholes with the spot replaced by the forward and the growth term removed, leaving a single discount factor outside the bracket. Practically, this means you never supply a spot price, a dividend yield or a borrow rate: they are all already inside the quoted futures price. Put-call parity becomes the discounted difference between the forward and the strike, so the forward-at-the-money call and put are equal." },
    { q: "You are asked to hedge jet fuel with heating oil futures. What do you tell the client?",
      level: "onsite",
      answer: "That we can remove most of the outright price risk and that what remains is basis risk we should size and monitor explicitly. I would estimate the hedge ratio from a regression of jet fuel price changes on futures price changes over a window long enough to be stable and short enough to be current, report the R-squared as the fraction of variance removed, and then translate the residual into a daily standard deviation in dollars on their actual exposure. I would also stress that the correlation tends to fall in exactly the supply shocks the hedge was bought for, so the residual is not symmetric, and I would recommend rolling the hedge with a defined calendar rather than opportunistically." },
    { q: "Your researcher reports a 55 percent out-of-sample hit rate on a ten-day futures return model, validated with five-fold cross-validation. React.",
      level: "senior",
      answer: "The first question is whether the folds were shuffled. With a ten-day horizon and daily observations, consecutive labels overlap by nine days, so a random split leaks the test period into training and the score is not out of sample at all. I would ask for a purged and embargoed time-series split and expect the number to fall, possibly to nothing. Then I would ask what the features are standardised by, because a full-sample mean and standard deviation is another leak, and whether the universe and the roll convention were fixed in advance. Only after all that would I look at the hit rate, and even then I would want the information coefficient and a turnover estimate instead, because a hit rate says nothing about the size of the wins." },
    { q: "How would you set the rehedging frequency for a delta-hedged options book on futures?",
      level: "senior",
      answer: "It is a trade between gamma P&L captured and spread paid. Hedging error from discrete rehedging has a standard deviation that scales with the square root of the rehedging interval, while transaction costs scale linearly with the number of hedges, so there is an interior optimum and it depends on gamma, on volatility and on the bid-ask spread of the contract. In practice I would not hedge on a clock at all: I would hedge on a delta band, widened when the spread is wide or the book is long gamma and tightened near expiry where gamma is concentrated. I would size the band by simulating the joint distribution of hedging error and cost rather than by a rule of thumb, and I would monitor realised hedge slippage against that simulation." },
    { q: "The firm wants to move from a fixed-date roll to an optimised roll on its commodity programme. What do you require before signing off?",
      level: "senior",
      answer: "Three things. First, a decomposition that separates spot return, roll return and the interaction on the existing programme, so we know how much of the historical result the roll rule is responsible for. Second, a specification of the new rule that is fully mechanical and was written before it was tested, including what happens when the chosen contract is illiquid, because an optimised roll usually moves size into thinner expiries and the market impact can exceed the carry saved. Third, a capacity and impact study at the intended size, using actual depth rather than average volume. I would also require the rule to be evaluated on the unadjusted contract panel, since an optimised roll and a back-adjusted series are two ways of hiding the same number." }
  ],

  reappears_in: [
    { code: "FINM 33000", how: "Black-76 here is the same risk-neutral machinery, applied to an underlying that is already a martingale; the Greeks and the delta-hedged P&L argument are identical." },
    { code: "FINM 37500", how: "Rate futures, the convexity adjustment between a futures rate and a forward rate, and Black's model reappear as the core of caps, floors and swaptions." },
    { code: "FINM 37400", how: "The cheapest-to-deliver and conversion-factor work here is the bond-futures half of interest-rate risk management, with the same BPV hedge arithmetic." },
    { code: "FINM 33150", how: "Carry and momentum on a futures panel, back-adjusted series, information coefficients and honest transaction costs are the raw material of systematic strategy research." },
    { code: "FINM 32000", how: "The Monte Carlo variance reduction used for the Asian option — antithetics and control variates — is developed there in general form alongside PDE and lattice methods." },
    { code: "FINM 35900", how: "Futures are the instrument a macro view is expressed in, and the curve, the roll and the margin arithmetic here are what turn that view into a position." }
  ],

  glossary: [
    { term: "Contract multiplier", def: "The number of dollars per one point of quoted price. Notional equals multiplier times price; tick value equals multiplier times tick size." },
    { term: "Variation margin", def: "The daily cash transfer that settles the change in a futures position's value against the official settlement price." },
    { term: "Initial and maintenance margin", def: "The collateral posted to open a position and the lower level at which a call is triggered. A call restores the account to the initial level, not the maintenance level." },
    { term: "Cost of carry", def: "The net cost of holding the underlying to delivery: financing plus storage minus income minus convenience yield. It is the exponent in the fair futures price." },
    { term: "Convenience yield", def: "The benefit of holding the physical asset rather than a claim on it. It is a residual, backed out of quoted prices rather than observed." },
    { term: "Basis", def: "Spot minus futures. It is carry expressed in price units and must converge to zero at delivery." },
    { term: "Contango and backwardation", def: "An upward- and a downward-sloping futures curve. Contango implies positive net carry; backwardation implies the convenience yield dominates." },
    { term: "Roll yield", def: "The return earned or paid when an expiring contract is exchanged for the next one. Negative in contango; a cost, not a yield." },
    { term: "Back-adjusted series", def: "A stitched futures history with the roll gaps removed by difference or ratio. Preserves returns; the level is not a tradeable price." },
    { term: "Minimum-variance hedge ratio", def: "The regression slope of asset changes on futures changes, equal to the correlation times the ratio of volatilities." },
    { term: "Basis risk", def: "The residual risk of a hedge whose instrument is not the exposure. Its standard deviation is the asset's volatility times the square root of one minus squared correlation." },
    { term: "Tailing the hedge", def: "Scaling a futures hedge by the discount factor to the horizon, because futures gains settle daily and can be reinvested." },
    { term: "Conversion factor", def: "The published multiplier that standardises a deliverable bond to a notional coupon, used to compute the invoice price on delivery." },
    { term: "Cheapest to deliver", def: "The bond in the deliverable basket with the smallest net basis. The futures price tracks it, and its identity migrates as yields move." },
    { term: "Black-76", def: "The option pricing formula with a futures price as the underlying: a discounted lognormal expectation with no drift term." },
    { term: "Parkinson estimator", def: "A volatility estimator built from the high-low range, far more efficient than close-to-close for a driftless diffusion but biased downward under discrete sampling." },
    { term: "Delta-hedged P&L", def: "The accumulated result of hedging an option, approximately one half of the integral of gamma times price squared times the difference of squared implied and realised volatilities." },
    { term: "Principal components of a curve", def: "The eigenvectors of the covariance matrix of curve returns, conventionally read as level, slope and curvature." },
    { term: "Control variate", def: "A correlated quantity with a known value, subtracted from a Monte Carlo estimate and added back analytically to reduce variance." },
    { term: "Purged cross-validation", def: "Time-series validation that removes training observations whose label window overlaps the test window, plus an embargo after it." }
  ]
};
