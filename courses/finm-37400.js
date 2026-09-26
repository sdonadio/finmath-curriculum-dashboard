/* courses/finm-37400.js — FINM 37400 · Fixed Income
 *
 * Built from the public course page only. The syllabus PDF is a Box shared
 * link restricted to a university login, so data/raw/syllabus/ is empty for
 * this course: the week-by-week arc, explanations, code, questions and
 * glossary below are this dashboard's own reconstruction of a standard
 * graduate treatment of the topics the public description names, not the
 * instructor's material and not endorsed by anyone.
 */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 37400"] = {
  code: "FINM 37400",
  slug: "finm-37400",
  title: "Fixed Income",
  instructor: "Mark Hendricks",
  quarter: "Winter",
  units: 50,
  block: "electives",
  concentrations: ["rates-credit"],
  source: {
    page_url: "https://finmath.uchicago.edu/curriculum/degree-concentrations/rates-and-credit/finm-37400/",
    syllabus_url: "https://uchicago.box.com/s/y5166j07wdj2n2cnoil7jg1c8nvm1iqb",
    fetched: "2026-09-26",
    note: "Only the public course page was readable. The syllabus PDF sits behind a Box login, so no syllabus text is in the corpus. Everything below the official description — the five-week arc, the concepts, the code, the questions, the pitfalls and the glossary — is this dashboard's own reconstruction of a standard graduate treatment of these topics. It is not the instructor's outline, it was not reviewed by the instructor, and no grading, assignment or reading requirement should be inferred from it."
  },
  tier: "B",
  description: "Mathematical modelling, statistical analysis and market structure for pricing and managing fixed income products. The public description names the yield curve; interest-rate risk through duration, convexity and factor approaches; products such as swaps, caps and floors; and rate trading strategies including inflation and the Expectations Hypothesis. It explicitly leaves specialised derivative models and credit risk to other courses while building the fundamentals those courses need.",

  prerequisites: [
    "Calculus and linear algebra: you will differentiate a discounted cash flow sum by hand and solve small linear systems for hedge ratios.",
    "Probability through conditional expectation and the idea of a martingale; the Expectations Hypothesis week is an argument about conditional expectations.",
    "Comfort with least squares, including reading a regression coefficient and its standard error.",
    "Python with numpy: every idea in the course is three lines of array arithmetic once you know which array you want."
  ],
  textbooks: [
    { title: "Fixed Income Securities: Tools for Today's Markets", author: "Bruce Tuckman and Angel Serrat",
      note: "Standard reference for this material: curve construction, DV01, key-rate risk, carry and the swap market." },
    { title: "Fixed Income Securities: Valuation, Risk, and Risk Management", author: "Pietro Veronesi",
      note: "Standard reference for this material, stronger on the modelling and the term-structure chapters." },
    { title: "Expected Returns", author: "Antti Ilmanen",
      note: "Standard reference for the carry, roll-down and term-premium material and for the empirical record on the Expectations Hypothesis." },
    { title: "Bond Markets, Analysis, and Strategies", author: "Frank J. Fabozzi",
      note: "Standard reference for market conventions, day counts and instrument descriptions." }
  ],

  skills_built: ["yield-curve", "duration-convexity", "interest-rate-risk", "hedging",
                 "carry-trade", "pca", "spread-trades", "factor-models", "linear-regression"],
  skills_assumed: ["linear-algebra", "numpy", "conditional-expectation", "risk-neutral-pricing"],

  brushup: [
    { topic: "Geometric series and the annuity factor",
      why: "Every price in the course is a finite geometric sum. If you can write the annuity factor from memory you will read the par-swap-rate formula as arithmetic rather than as a result to memorise.",
      resource: "Any calculus text's section on finite geometric series; then derive the level-payment annuity factor yourself." },
    { topic: "Differentiating a sum of discounted cash flows",
      why: "Duration is one derivative and convexity is two. Doing the differentiation once by hand is what makes the minus signs and the extra power of the discount factor stop being mysterious.",
      resource: "Work d/dy of sum c_k (1 + y/f)^(-fk) on paper before week 2." },
    { topic: "Eigenvalues of a symmetric matrix",
      why: "Week 3 is a principal component analysis of curve changes. You need to believe that a covariance matrix has orthogonal eigenvectors and that the eigenvalues are the variances along them.",
      resource: "Strang, Introduction to Linear Algebra, the chapter on symmetric matrices and the spectral theorem." },
    { topic: "OLS in matrix form, and what the slope coefficient means",
      why: "The Expectations Hypothesis is tested with a single regression. Knowing that a slope of one is the null and that the standard error decides whether you can reject it is the whole exercise.",
      resource: "Any econometrics text on the simple regression model; then simulate data where you know the answer." },
    { topic: "Day-count and compounding conventions",
      why: "More first-year errors in fixed income come from quoting conventions than from mathematics. ACT/360 and 30/360 disagree by a few basis points and that is exactly the size of the trade.",
      resource: "Read the conventions section of any market handbook, then reproduce an accrued-interest figure by hand." },
    { topic: "numpy interpolation and vectorised arithmetic",
      why: "Curve work is interpolation plus elementwise multiplication. Knowing numpy.interp and broadcasting turns each week's code into ten lines.",
      resource: "The numpy user guide's pages on interp and on broadcasting." }
  ],

  weeks: [
    /* ══════════ WEEK 1 ══════════ */
    { n: 1,
      title: "Discount factors, conventions, and building a curve",
      topics: ["discount factors as the primitive", "compounding and day-count conventions",
               "bootstrapping from par instruments", "interpolation and implied forwards"],
      concepts: [
        { name: "The discount factor is the price; the rate is a quote",
          explain: `<p>A fixed income desk does not really trade interest rates. It trades the present
            value of a payment on a date, and that price is the discount factor <code>Z(0,T)</code>: what
            you pay today for one unit delivered at <code>T</code>. Everything else in the course is a
            function of a vector of discount factors. A rate, by contrast, is a way of quoting a discount
            factor, and it only means something once you say how it compounds. The same
            <code>Z(0,T)</code> can be reported as a continuously compounded zero rate, an annually
            compounded one, a semiannual bond-equivalent yield or a simple money-market rate, and the four
            numbers differ by several basis points at ten years.</p>
            <p>This matters because comparisons across markets are comparisons across conventions. A
            money-market instrument quoted ACT/360 simple and a Treasury quoted semiannual bond-equivalent
            are not directly comparable even when they refer to the same borrowing. The discipline that
            saves you is to convert every quote to a discount factor first, do the arithmetic in discount
            factor space, and convert back only at the end when someone asks for a number in the
            convention they expect.</p>
            <p>A desk cares because a convention error is a systematic, silent mispricing: it does not
            look like a bug, it looks like a small edge, and it survives until a counterparty on the other
            convention takes the other side every day.</p>`,
          formula: "Z(0,T) = e^{-z_c T} = (1+z_a)^{-T} = \\left(1+\\tfrac{z_s}{2}\\right)^{-2T} = \\frac{1}{1+z_m T}",
          code: { lang: "python", src: `import math

Ts = [0.5, 1.0, 2.0, 5.0, 10.0]
DF = [0.98261, 0.96514, 0.93017, 0.82900, 0.68800]

print(" T       DF     cont   annual     semi   simple")
for T, z in zip(Ts, DF):
    cc = -math.log(z) / T
    ann = z ** (-1.0 / T) - 1.0
    semi = 2.0 * (z ** (-0.5 / T) - 1.0)
    simple = (1.0 / z - 1.0) / T
    print(f"{T:5.1f} {z:8.5f} {100*cc:7.3f} {100*ann:8.3f} {100*semi:8.3f} {100*simple:8.3f}")

gaps = [abs(2.0 * (z ** (-0.5 / T) - 1.0) - (1.0 / z - 1.0) / T) for T, z in zip(Ts, DF)]
print(f"largest gap between two quotes of the SAME price: {1e4*max(gaps):.1f} bp")`,
            output: " T       DF     cont   annual     semi   simple\n  0.5  0.98261   3.509    3.571    3.540    3.540\n  1.0  0.96514   3.548    3.612    3.580    3.612\n  2.0  0.93017   3.619    3.686    3.652    3.754\n  5.0  0.82900   3.751    3.822    3.786    4.125\n 10.0  0.68800   3.740    3.810    3.775    4.535\nlargest gap between two quotes of the SAME price: 76.0 bp" } },

        { name: "Day counts, accrual, and clean versus dirty price",
          explain: `<p>Between coupon dates a bond's buyer owes the seller the coupon that has accrued.
            How much has accrued depends on a day-count convention that is pure market custom: ACT/360 for
            most money-market and swap floating legs, 30/360 for many corporate bonds and swap fixed legs,
            ACT/ACT for Treasuries. Each rule answers the question "what fraction of a year is this?"
            differently, and over a six-month period the answers differ by enough to move the accrued
            interest on a hundred million of notional by tens of thousands.</p>
            <p>The quoted price of a bond is the clean price, which excludes accrued interest; the price
            you actually pay is the dirty price, which includes it. Every valuation formula you write
            produces a dirty price, because a discounted cash flow sum knows nothing about the convention
            that splits it. Forgetting the split is the classic first-week error: your model says 101.4,
            the screen says 100.2, and the missing 1.2 is four and a half months of a 3.2 per cent
            coupon.</p>
            <p>Desks care because settlement is a cash instruction. A model that is right on the clean
            price and wrong on accrued still wires the wrong amount, and reconciliation breaks find it
            the next morning rather than at the moment of the trade.</p>`,
          formula: "P_{\\text{dirty}} = P_{\\text{clean}} + \\text{AI}, \\qquad \\text{AI} = c \\cdot \\tau(d_0, d_s)",
          code: { lang: "python", src: `from datetime import date

def act360(d1, d2):
    return (d2 - d1).days / 360.0

def act365(d1, d2):
    return (d2 - d1).days / 365.0

def thirty360(d1, d2):
    dd1 = min(d1.day, 30)
    dd2 = min(d2.day, 30) if dd1 == 30 else d2.day
    return ((d2.year - d1.year) * 360 + (d2.month - d1.month) * 30 + (dd2 - dd1)) / 360.0

last, settle = date(2026, 2, 15), date(2026, 8, 31)
coupon_rate = 0.032
notional = 100000000.0

for name, f in (("ACT/360", act360), ("ACT/365", act365), ("30/360", thirty360)):
    yf = f(last, settle)
    ai = notional * coupon_rate * yf
    print(f"{name:8s} year fraction {yf:.6f}   accrued on 100m notional {ai:14,.2f}")

spread = notional * coupon_rate * (act360(last, settle) - thirty360(last, settle))
print(f"ACT/360 minus 30/360 on the same period: {spread:,.2f}")`,
            output: "ACT/360  year fraction 0.547222   accrued on 100m notional   1,751,111.11\nACT/365  year fraction 0.539726   accrued on 100m notional   1,727,123.29\n30/360   year fraction 0.544444   accrued on 100m notional   1,742,222.22\nACT/360 minus 30/360 on the same period: 8,888.89" } },

        { name: "Bootstrapping a discount curve from par instruments",
          explain: `<p>Nobody quotes discount factors. The market quotes par instruments: bills, par
            coupon bonds, and par swap rates. Bootstrapping is the sequential inversion that turns those
            quotes into discount factors. Take the shortest instrument, for which there is only one
            unknown discount factor, and solve. Move to the next, where every discount factor but the last
            is now known, and solve again. After one pass you have a discount factor at every quoted
            maturity, and by construction the curve reprices every input instrument exactly.</p>
            <p>The algebra for a par coupon bond paying <code>c/2</code> twice a year is one line: the
            price is one hundred, so one hundred equals the coupon times the annuity of already-known
            discount factors plus one hundred and the final coupon times the unknown final discount factor.
            Rearranged, the new discount factor is a ratio, and the annuity accumulates as you sweep
            forward.</p>
            <p>The exact-reprice property is the point, and it is also the test. If the bootstrapped curve
            does not return one hundred when you reprice the input bond, you have a convention error or an
            off-by-one in the cash flow schedule. Desks care because the curve is the shared
            infrastructure: every trader, every risk report and every P&amp;L attribution reads from it, so
            a curve that does not reprice its own inputs pollutes every number downstream at once.</p>`,
          formula: "Z(T_n) = \\frac{1 - \\frac{c_n}{2}\\sum_{i<n} Z(T_i)}{1 + \\frac{c_n}{2}}",
          code: { lang: "python", src: `import math

par = [(0.5, 0.0425), (1.0, 0.0438), (1.5, 0.0446),
       (2.0, 0.0451), (2.5, 0.0454), (3.0, 0.0455)]

Z, annuity = {}, 0.0
for T, c in par:
    Z[T] = (1.0 - (c / 2.0) * annuity) / (1.0 + c / 2.0)
    annuity += Z[T]
    print(f"T={T:4.1f}  par={100*c:5.2f}%   Z={Z[T]:.6f}   zero(cc)={100*(-math.log(Z[T])/T):6.3f}%")

c3 = dict(par)[3.0]
pv = sum((c3 / 2.0) * 100.0 * Z[t] for t, _ in par) + 100.0 * Z[3.0]
print(f"reprice of the 3y par bond off the bootstrapped curve: {pv:.10f}")
print(f"error versus par: {abs(pv - 100.0):.2e}")`,
            output: "T= 0.5  par= 4.25%   Z=0.979192   zero(cc)= 4.205%\nT= 1.0  par= 4.38%   Z=0.957585   zero(cc)= 4.334%\nT= 1.5  par= 4.46%   Z=0.935938   zero(cc)= 4.414%\nT= 2.0  par= 4.51%   Z=0.914596   zero(cc)= 4.464%\nT= 2.5  par= 4.54%   Z=0.893740   zero(cc)= 4.494%\nT= 3.0  par= 4.55%   Z=0.873631   zero(cc)= 4.503%\nreprice of the 3y par bond off the bootstrapped curve: 100.0000000000\nerror versus par: 0.00e+00" } },

        { name: "Interpolation is a modelling choice, and forwards expose it",
          explain: `<p>Bootstrapping gives discount factors at the quoted maturities and says nothing
            about the dates in between, but every real trade settles on a date in between. You must choose
            an interpolation rule, and the choice is not cosmetic. Linear interpolation on zero rates,
            linear on log discount factors, and cubic splines on either all pass through the same knots
            and all disagree between them.</p>
            <p>The disagreement is invisible if you only look at discount factors, because the curves are
            pinned at the knots and the gaps are in the fifth decimal. It becomes obvious the moment you
            differentiate. The instantaneous forward rate is minus the derivative of the log discount
            factor, so an interpolation rule that is merely continuous produces forwards that are
            piecewise constant and jump at every knot, while linear-on-zero produces forwards that are
            piecewise linear but kinked. A forward curve with implausible sawtooth structure is the
            signature of an interpolation choice, not of the market.</p>
            <p>Desks care because forwards are what get traded and hedged. A forward-starting swap, a
            futures roll or a carry calculation reads the forward curve directly, so an artefact of
            interpolation becomes a fake trading signal and, worse, a fake risk number in the key-rate
            report.</p>`,
          formula: "f(0,t) = -\\frac{\\partial}{\\partial t}\\ln Z(0,t), \\qquad f(T_1,T_2) = \\frac{\\ln Z(0,T_1) - \\ln Z(0,T_2)}{T_2 - T_1}",
          code: { lang: "python", src: `import numpy as np

knots = np.array([0.5, 1.0, 2.0, 3.0, 5.0, 7.0, 10.0])
zc = np.array([0.0420, 0.0432, 0.0445, 0.0452, 0.0460, 0.0466, 0.0470])
logdf = -zc * knots

grid = np.arange(0.5, 10.0001, 0.25)
df_z = np.exp(-np.interp(grid, knots, zc) * grid)
df_l = np.exp(np.interp(grid, knots, logdf))

f_z = -np.diff(np.log(df_z)) / np.diff(grid)
f_l = -np.diff(np.log(df_l)) / np.diff(grid)

print("largest discount-factor disagreement between the two rules: %.2e" % np.max(np.abs(df_z - df_l)))
print("at the knots themselves:                                    %.2e"
      % np.max(np.abs(np.exp(-zc * knots) - np.exp(logdf))))
print("3m forward, linear on zero rates : min %.3f%%  max %.3f%%  largest step %.1f bp"
      % (100 * f_z.min(), 100 * f_z.max(), 1e4 * np.max(np.abs(np.diff(f_z)))))
print("3m forward, linear on log DF     : min %.3f%%  max %.3f%%  largest step %.1f bp"
      % (100 * f_l.min(), 100 * f_l.max(), 1e4 * np.max(np.abs(np.diff(f_l)))))
nz = len(np.unique(np.round(f_z, 10)))
nl = len(np.unique(np.round(f_l, 10)))
print(f"distinct 3m forward values: linear on zeros {nz}, linear on log DF {nl}")
print("log-linear gives one flat forward per segment and a jump at every knot: "
      "same inputs, different forward curve, and the rule is the model")`,
            output: "largest discount-factor disagreement between the two rules: 3.33e-04\nat the knots themselves:                                    0.00e+00\n3m forward, linear on zero rates : min 4.380%  max 4.863%  largest step 12.0 bp\n3m forward, linear on log DF     : min 4.440%  max 4.810%  largest step 14.0 bp\ndistinct 3m forward values: linear on zeros 35, linear on log DF 6\nlog-linear gives one flat forward per segment and a jump at every knot: same inputs, different forward curve, and the rule is the model" } }
      ],
      widget: { type: "curve", title: "Three views of one curve: discount factors, zero rates, forwards",
        params: { xlab: "Maturity (years)", ylab: "Level", log: false,
          series: [
            { name: "Zero rate (%)", x: [0.5, 1, 2, 3, 5, 7, 10, 20, 30],
              y: [4.20, 4.32, 4.45, 4.52, 4.60, 4.66, 4.70, 4.78, 4.80] },
            { name: "1y forward rate (%)", x: [0.5, 1, 2, 3, 5, 7, 10, 20, 30],
              y: [4.32, 4.44, 4.58, 4.66, 4.74, 4.80, 4.84, 4.86, 4.80] },
            { name: "Discount factor x 10", x: [0.5, 1, 2, 3, 5, 7, 10, 20, 30],
              y: [9.79, 9.58, 9.15, 8.73, 7.94, 7.22, 6.25, 3.85, 2.37] }] } },
      pitfalls: [
        "Comparing a money-market quote and a bond yield without converting both to discount factors first. They are the same price in two languages and the translation is worth basis points.",
        "Bootstrapping without checking that the curve reprices its own inputs. The check costs one line and catches every schedule and convention bug at once.",
        "Choosing an interpolation rule by what looks smooth on the zero curve. Judge it on the forward curve, which is where the artefacts live and where the trades are.",
        "Treating accrued interest as a rounding detail. It is a cash instruction, and the model price is always dirty whether or not you labelled it so."
      ],
      check: [
        { q: "Two desks quote the same ten-year discount factor, one as a continuously compounded zero rate and one as a semiannual bond-equivalent yield. What should you expect?",
          options: ["Identical numbers, since the price is the same",
                    "Numbers that differ by several basis points, with the semiannual quote higher",
                    "Numbers that differ by several percentage points",
                    "The continuous quote is always higher because e is bigger than 2"],
          answer: 1,
          why: "The price is identical but the quote is not: more frequent compounding needs a lower nominal rate to reach the same discount factor, so the continuously compounded rate is the lowest of the family and the semiannual quote sits above it, by a few basis points at ten-year maturities. The difference is not percentage points; and the last option confuses the base of the exponential with the compounding frequency, which is what actually drives the gap." },
        { q: "Your bootstrapped curve reprices the two-year par bond at 99.94 instead of 100. The most likely cause is:",
          options: ["Interpolation error between knots",
                    "A genuine arbitrage in the quoted par rates",
                    "A schedule or day-count mismatch between the bootstrap and the reprice",
                    "Floating point accumulation over four coupon periods"],
          answer: 2,
          why: "Bootstrapping is an exact inversion: at the input maturities the curve reprices the inputs to machine precision by construction, so interpolation between knots cannot be responsible for an error at a knot, and six basis points of price is far larger than any floating-point accumulation over four terms. A six-cent error is the size of a day-count or coupon-date disagreement between the two pieces of code, and that is where to look before believing you have found an arbitrage." },
        { q: "A forward curve built from your discount curve is piecewise constant and jumps at every input maturity. What does that tell you?",
          options: ["The market expects rates to jump on those dates",
                    "You interpolated linearly on log discount factors",
                    "Your bootstrap failed",
                    "The curve is inverted"],
          answer: 1,
          why: "A forward rate is the negative slope of the log discount factor. Linear interpolation of the log discount factor makes that slope constant within each segment and discontinuous at the knots, which is exactly a piecewise-constant forward curve with jumps at the inputs. It is an artefact of the interpolation rule, not a market expectation, not a bootstrap failure, and it has nothing to do with the sign of the curve's slope." },
        { q: "Which quantity is convention-free?",
          options: ["The par yield", "The discount factor", "The simple money-market rate", "The bond-equivalent yield"],
          answer: 1,
          why: "The discount factor is a price: the number of units you pay today for one unit at a future date, with no compounding frequency and no day-count rule attached. Every rate in the other three answers is a way of quoting that price and only means something once the compounding convention and day-count basis are stated, which is why converting to discount factors is the first step whenever quotes from different markets have to be compared." }
      ]
    },

    /* ══════════ WEEK 2 ══════════ */
    { n: 2,
      title: "Price, yield, duration, convexity and the DV01 hedge",
      topics: ["the price-yield map", "Macaulay and modified duration", "DV01", "convexity", "hedge ratios"],
      concepts: [
        { name: "Yield is a summary statistic, not a model",
          explain: `<p>The yield to maturity is the single discount rate that, applied to every cash flow
            of a bond, reproduces its price. It is therefore a change of variable, not a theory: it
            compresses a whole discount curve into one number that is specific to that bond's cash flow
            pattern. Two bonds with the same maturity but different coupons have different yields even off
            the same curve, because they weight the curve's segments differently.</p>
            <p>The map from yield to price is smooth, strictly decreasing and convex, which is why
            inverting it is easy: bisection or Newton converges to machine precision in a handful of
            iterations, and no closed form is needed. Working in yield space is convenient for quoting and
            for comparing bonds of similar structure, and it is the space in which duration and convexity
            are defined. It is also the space in which you can fool yourself, because a yield pickup
            between two bonds can be entirely a coupon effect or a curve-shape effect rather than a
            relative-value signal.</p>
            <p>Desks care because yield is the lingua franca of the market: trades are discussed in yield,
            but risk is managed in price. Being fluent in both directions, and knowing that the bridge is
            a monotone one-dimensional root-find, is a prerequisite for everything that follows.</p>`,
          formula: "P(y) = \\sum_{k=1}^{n} \\frac{c/f}{(1+y/f)^k} + \\frac{100}{(1+y/f)^n}",
          code: { lang: "python", src: `def price(y, cpn, T, f=2):
    n = int(round(T * f))
    c = 100.0 * cpn / f
    v = 1.0 + y / f
    return sum(c / v ** k for k in range(1, n + 1)) + 100.0 / v ** n

def ytm(p, cpn, T, f=2, lo=-0.05, hi=0.60):
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if price(mid, cpn, T, f) > p:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)

for y in (0.03, 0.04, 0.05, 0.06):
    p = price(y, 0.04, 10)
    print(f"y={100*y:5.2f}%   price={p:9.5f}   inverted yield={100*ytm(p, 0.04, 10):9.6f}%")

import math
zc = lambda t: 0.040 + 0.008 * (1.0 - math.exp(-t / 3.0))
def curve_price(cpn, T, f=2):
    n = int(round(T * f))
    return sum((100.0 * cpn / f + (100.0 if k == n else 0.0)) * math.exp(-zc(k / f) * k / f)
               for k in range(1, n + 1))

for cpn in (0.02, 0.04, 0.08):
    p = curve_price(cpn, 10)
    print(f"coupon {100*cpn:4.1f}%  price off the SAME zero curve {p:9.5f}  "
          f"yield {100*ytm(p, cpn, 10):8.5f}%")
print("one curve, three yields: the yield depends on the bond's own cash-flow weights")`,
            output: "y= 3.00%   price=108.58432   inverted yield= 3.000000%\ny= 4.00%   price=100.00000   inverted yield= 4.000000%\ny= 5.00%   price= 92.20542   inverted yield= 5.000000%\ny= 6.00%   price= 85.12253   inverted yield= 6.000000%\ncoupon  2.0%  price off the SAME zero curve  77.84858  yield  4.81746%\ncoupon  4.0%  price off the SAME zero curve  93.64197  yield  4.80833%\ncoupon  8.0%  price off the SAME zero curve 125.22875  yield  4.79461%\none curve, three yields: the yield depends on the bond's own cash-flow weights" } },

        { name: "Duration and DV01: the first derivative, two ways of quoting it",
          explain: `<p>Macaulay duration is the cash-flow-weighted average time to payment, with weights
            equal to each payment's share of present value. Modified duration is Macaulay duration divided
            by one plus the periodic yield, and it is the elasticity you actually want: the percentage
            price change per unit change in yield. DV01, also called the dollar value of an basis point or
            PV01, is modified duration times price times one basis point, and it is the number a risk
            system stores because it is additive across positions in currency units.</p>
            <p>The three are the same object in three units, and the reason to keep all three is
            communication. A portfolio manager thinks in years of duration because it is comparable across
            portfolios of different size. A trader thinks in DV01 because it answers "how much do I lose
            on a basis point" without further arithmetic. A quant thinks in the derivative because it is
            what the algebra produces.</p>
            <p>The test that matters is that the analytic derivative agrees with a numerical reprice. Bump
            the yield down a basis point and up a basis point, take half the difference, and you should
            recover DV01 to several decimal places. Desks care because this reconciliation is the daily
            sanity check between the analytics library and the risk engine: when they disagree, one of
            them has the wrong schedule, and finding out at four in the afternoon is much cheaper than
            finding out from the overnight P&amp;L.</p>`,
          formula: "D_{\\text{mod}} = \\frac{D_{\\text{mac}}}{1+y/f}, \\qquad \\text{DV01} = P \\cdot D_{\\text{mod}} \\cdot 10^{-4}",
          code: { lang: "python", src: `def legs(cpn, T, f=2):
    n = int(round(T * f))
    return [(k / f, 100.0 * cpn / f + (100.0 if k == n else 0.0)) for k in range(1, n + 1)]

def pv(y, cf, f=2):
    return sum(c / (1 + y / f) ** (f * t) for t, c in cf)

cf, y = legs(0.04, 10), 0.045
P = pv(y, cf)
mac = sum(t * c / (1 + y / 2) ** (2 * t) for t, c in cf) / P
mod = mac / (1 + y / 2)

print(f"price                      = {P:.6f}")
print(f"Macaulay duration          = {mac:.6f} years")
print(f"modified duration          = {mod:.6f}")
print(f"DV01 from the formula      = {P * mod * 1e-4:.6f}")
print(f"DV01 from a 1bp reprice    = {0.5 * (pv(y - 1e-4, cf) - pv(y + 1e-4, cf)):.6f}")
print(f"absolute difference        = {abs(P * mod * 1e-4 - 0.5 * (pv(y - 1e-4, cf) - pv(y + 1e-4, cf))):.2e}")

zero = [(10.0, 100.0)]
print(f"a 10y zero: Macaulay duration = {10.0:.2f}y exactly, DV01 = "
      f"{0.5 * (pv(y - 1e-4, zero) - pv(y + 1e-4, zero)):.6f}")`,
            output: "price                      = 96.009072\nMacaulay duration          = 8.297798 years\nmodified duration          = 8.115206\nDV01 from the formula      = 0.077913\nDV01 from a 1bp reprice    = 0.077913\nabsolute difference        = 1.30e-08\na 10y zero: Macaulay duration = 10.00y exactly, DV01 = 0.062672" } },

        { name: "Convexity: where the linear approximation stops being good enough",
          explain: `<p>Duration is the first term of a Taylor expansion, so it is exact only for
            infinitesimal moves. Convexity is the second derivative, scaled by price, and it is positive
            for every ordinary bond: the price-yield curve bends upward, so a duration estimate
            understates the gain when yields fall and overstates the loss when they rise. Adding half of
            convexity times the squared yield change recovers most of the error.</p>
            <p>The practical question is how big a move you can ignore it for. For a ten-year bond the
            duration-only estimate is fine to a fraction of a cent at twenty-five basis points, visibly
            wrong at a hundred, and badly wrong at two hundred, and the error is always in the holder's
            favour for a long position in a positively convex bond. That asymmetry is not a free lunch: in
            equilibrium a more convex bond trades at a slightly lower yield, and the yield give-up is the
            price of the convexity.</p>
            <p>Desks care for two reasons. First, risk limits stated in DV01 alone are blind to the second
            order, so a portfolio can be DV01-flat and still make or lose money on a large move. Second,
            convexity is itself a traded quantity: barbell-versus-bullet, long-dated swaps and mortgage
            hedging are all in part trades about whether the market is charging enough for it.</p>`,
          formula: "\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}}\\,\\Delta y + \\tfrac{1}{2}C\\,(\\Delta y)^2, \\qquad C = \\frac{1}{P}\\frac{d^2P}{dy^2}",
          code: { lang: "python", src: `def legs(cpn, T, f=2):
    n = int(round(T * f))
    return [(k / f, 100.0 * cpn / f + (100.0 if k == n else 0.0)) for k in range(1, n + 1)]

def pv(y, cf, f=2):
    return sum(c / (1 + y / f) ** (f * t) for t, c in cf)

cf, y = legs(0.04, 10), 0.045
P = pv(y, cf)
mac = sum(t * c / (1 + y / 2) ** (2 * t) for t, c in cf) / P
mod = mac / (1 + y / 2)
conv = sum(t * (t + 0.5) * c / (1 + y / 2) ** (2 * t + 2) for t, c in cf) / P

print(f"modified duration {mod:.4f}   convexity {conv:.4f}")
print("  shift     exact        duration only    error       plus convexity   error")
for bp in (25, 100, 200, -200):
    dy = bp * 1e-4
    exact = pv(y + dy, cf) - P
    lin = -P * mod * dy
    quad = lin + 0.5 * P * conv * dy * dy
    print(f"{bp:+6d}bp  {exact:+10.5f}   {lin:+12.5f}  {exact-lin:+9.5f}   {quad:+12.5f}  {exact-quad:+9.5f}")
print("the duration error has the same sign for up and down moves: that is convexity, not noise")`,
            output: "modified duration 8.1152   convexity 78.0053\n  shift     exact        duration only    error       plus convexity   error\n   +25bp    -1.92463       -1.94783   +0.02320       -1.92443   -0.00020\n  +100bp    -7.42951       -7.79133   +0.36182       -7.41687   -0.01264\n  +200bp   -14.18325      -15.58267   +1.39941      -14.08483   -0.09843\n  -200bp   +17.19042      +15.58267   +1.60775      +17.08051   +0.10991\nthe duration error has the same sign for up and down moves: that is convexity, not noise" } },

        { name: "The DV01-neutral hedge and the risk it does not remove",
          explain: `<p>The simplest hedge in fixed income is to offset the DV01 of one instrument with
            another: hold a ten-year bond, short enough face of a two-year bond that the two DV01s cancel,
            and the position is insensitive to a parallel shift of yields. The hedge ratio is the ratio of
            the DV01s per unit of face, and because the two-year has far less DV01 per hundred of face you
            need several times as much of it.</p>
            <p>What the hedge removes is precisely one thing: a move in which both yields change by the
            same amount. What it leaves behind is everything else. If the two-year rises ten basis points
            while the ten-year rises thirty, the hedge does nothing about the twenty basis point
            difference, and the resulting profit or loss can be larger than the unhedged exposure to a
            small parallel move. A DV01-neutral position is not a flat position, it is a pure curve
            position, and traders use it that way on purpose.</p>
            <p>There is also a second-order residual: two bonds with the same DV01 have different
            convexity, so even an exactly parallel move leaves a small gain or loss that grows with the
            square of the shift. Desks care because "hedged" in a risk report usually means DV01-hedged
            against one factor, and the next week's material exists to say what the other factors are.</p>`,
          formula: "h = \\frac{\\text{DV01}_{\\text{target}}}{\\text{DV01}_{\\text{hedge}}}, \\qquad \\Delta \\Pi \\approx \\text{DV01}_{t}\\,\\Delta y_t - h\\,\\text{DV01}_{h}\\,\\Delta y_h",
          code: { lang: "python", src: `def legs(cpn, T, f=2):
    n = int(round(T * f))
    return [(k / f, 100.0 * cpn / f + (100.0 if k == n else 0.0)) for k in range(1, n + 1)]

def pv(y, cf, f=2):
    return sum(c / (1 + y / f) ** (f * t) for t, c in cf)

def dv01(y, cf):
    return 0.5 * (pv(y - 1e-4, cf) - pv(y + 1e-4, cf))

cf2, y2 = legs(0.0425, 2), 0.0425
cf10, y10 = legs(0.046, 10), 0.046
d2, d10 = dv01(y2, cf2), dv01(y10, cf10)
h = d10 / d2

print(f"DV01 per 100 face: 2y {d2:.5f}   10y {d10:.5f}")
print(f"short {h:.3f} of 2y face per 1 of 10y face to be DV01 neutral")
print("  scenario                    unhedged      hedged")
for name, s2, s10 in (("parallel +25bp", 25, 25), ("parallel -25bp", -25, -25),
                      ("bear flattener +50/+10", 50, 10), ("steepener -10/+30", -10, 30),
                      ("parallel +200bp", 200, 200)):
    dp10 = pv(y10 + s10 * 1e-4, cf10) - pv(y10, cf10)
    dp2 = pv(y2 + s2 * 1e-4, cf2) - pv(y2, cf2)
    print(f"  {name:26s} {dp10:+9.4f}   {dp10 - h * dp2:+9.4f}")`,
            output: "DV01 per 100 face: 2y 0.01898   10y 0.07944\nshort 4.185 of 2y face per 1 of 10y face to be DV01 neutral\n  scenario                    unhedged      hedged\n  parallel +25bp               -1.9625     +0.0175\n  parallel -25bp               +2.0098     +0.0178\n  bear flattener +50/+10       -0.7906     +3.1574\n  steepener -10/+30            -2.3495     -3.1448\n  parallel +200bp             -14.4731     +1.0372" } }
      ],
      widget: { type: "slider-formula", title: "Duration and convexity against an exact reprice",
        params: { formula: "\\frac{\\Delta P}{P} \\approx -D\\,\\Delta y + \\tfrac{1}{2}C\\,(\\Delta y)^2",
          inputs: [
            { name: "D", label: "Modified duration (years)", min: 0.5, max: 25, step: 0.1, init: 7.9 },
            { name: "C", label: "Convexity", min: 0, max: 900, step: 5, init: 75 },
            { name: "dy", label: "Yield change (bp)", min: -300, max: 300, step: 5, init: 100 },
            { name: "P", label: "Price", min: 50, max: 150, step: 1, init: 96 }],
          compute: [
            { name: "lin", label: "Duration term (% of price)", expr: "-D*dy/10000*100", fmt: "3" },
            { name: "cvx", label: "Convexity term (% of price)", expr: "0.5*C*(dy/10000)^2*100", fmt: "3" },
            { name: "tot", label: "Estimated price change", expr: "P*(lin+cvx)/100", fmt: "4" }] } },
      pitfalls: [
        "Quoting duration without saying Macaulay or modified. They differ by the factor one plus the periodic yield, which is over two per cent at current levels and enough to matter in a hedge ratio.",
        "Comparing yields across bonds with very different coupons and calling the difference relative value. Much of it is the coupon changing the cash flow weights on the same curve.",
        "Believing a DV01-neutral book is risk-free. It is flat to one factor and fully exposed to slope, curvature, convexity and spread.",
        "Using an analytic duration from a textbook formula on a bond with an odd first coupon or an embedded option. Bump and reprice instead; the numerical derivative is always defined."
      ],
      check: [
        { q: "A ten-year zero-coupon bond and a ten-year 8% coupon bond are priced off the same curve. Which has the larger Macaulay duration?",
          options: ["The coupon bond, because it pays more", "The zero, because all its value is at ten years",
                    "They are equal, because both mature in ten years", "It depends on the level of yields"],
          answer: 1,
          why: "Macaulay duration is the present-value-weighted average time to payment. For the zero every unit of value arrives at year ten, so the duration equals the maturity exactly. The coupon bond delivers part of its value earlier, which pulls the weighted average below ten. Paying more cash earlier shortens duration rather than lengthening it, and while the level of yields does shift the weights slightly, it can never reverse this ordering." },
        { q: "Your duration estimate of the loss on a +200bp move is larger than the loss you get from an exact reprice. Why?",
          options: ["A bug: the duration estimate should be smaller",
                    "Positive convexity: the price-yield curve bends away from the tangent line",
                    "The yield used in the duration was stale",
                    "Accrued interest was double counted"],
          answer: 1,
          why: "For an ordinary bond the price-yield relationship is convex, so the tangent line at the current yield lies below the true curve on both sides. Following the tangent therefore overstates the loss when yields rise and understates the gain when they fall. That is the expected behaviour of a positively convex instrument, not a bug, and it appears even with a perfectly current yield and correctly handled accrued interest." },
        { q: "You are DV01-neutral in a two-year versus ten-year position. Rates rise 40bp at the two-year point and 40bp at the ten-year point. What P&L do you expect?",
          options: ["Exactly zero", "A small gain or loss from the convexity difference",
                    "A large loss proportional to the ten-year DV01", "A gain equal to the carry"],
          answer: 1,
          why: "DV01 neutrality cancels the first-order response to an equal move at both points, so the linear terms offset exactly. What remains is second order: the two legs have different convexity, so the curvature of their price-yield relations does not cancel and a small residual appears, growing with the square of the shift. It is not exactly zero, it is not proportional to a single leg's DV01, and carry is a separate effect that accrues with time rather than with the shift." },
        { q: "Which statement about DV01 is correct?",
          options: ["It is dimensionless", "It is additive across positions in a portfolio",
                    "It is the same for all bonds of the same maturity", "It rises when the price falls, other things equal"],
          answer: 1,
          why: "DV01 is expressed in currency per basis point, so it is not dimensionless, and because it is a currency amount it adds straightforwardly across positions, which is exactly why risk systems store it in that form. Two bonds of the same maturity but different coupons have different DV01s because their cash-flow weights differ, and DV01 is the product of price and modified duration, so a lower price tends to reduce it rather than raise it." }
      ]
    },

    /* ══════════ WEEK 3 ══════════ */
    { n: 3,
      title: "Multi-factor rate risk: key rates, level, slope and curvature",
      topics: ["the failure of the one-factor view", "key-rate durations and partial DV01s",
               "principal components of curve changes", "two-factor hedging"],
      concepts: [
        { name: "One number cannot describe curve risk",
          explain: `<p>Duration answers a question that the market rarely asks: what happens if every
            yield moves by the same amount. Real curve changes have a shape. Some days the whole curve
            shifts, some days the front end moves and the long end does not, some days the belly moves
            against the wings. A position whose DV01 is zero can therefore lose money on a perfectly
            ordinary day, and a position with large DV01 can be almost flat if the move happens where it
            has no exposure.</p>
            <p>The standard demonstration is the barbell against the bullet. Build a portfolio of a
            two-year and a ten-year bond that matches both the present value and the DV01 of a five-year
            bond. Under a parallel shift the two behave almost identically, differing only by the barbell's
            extra convexity. Under a steepening or a butterfly move they diverge immediately, because the
            barbell has its exposure at the two ends of the curve while the bullet has it in the middle.
            The barbell-bullet trade is therefore a trade on curve shape and on convexity, and it is sold
            as such.</p>
            <p>Desks care because this is where the language of risk reporting comes from. A single
            duration number is a summary suitable for a client letter; a trading book needs a vector of
            exposures, and the rest of the week is about what the entries of that vector should be.</p>`,
          formula: "\\Delta P \\approx -\\sum_{j} \\text{KRD}_j \\cdot \\Delta y_j",
          code: { lang: "python", src: `import numpy as np

def legs(cpn, T, f=2):
    n = int(round(T * f))
    return [(k / f, 100.0 * cpn / f + (100.0 if k == n else 0.0)) for k in range(1, n + 1)]

def pv(y, cf, f=2):
    return sum(c / (1 + y / f) ** (f * t) for t, c in cf)

def dv01(y, cf):
    return 0.5 * (pv(y - 1e-4, cf) - pv(y + 1e-4, cf))

ys = {2: 0.0425, 5: 0.0448, 10: 0.0462}
bonds = {T: legs(ys[T], T) for T in ys}
d = {T: dv01(ys[T], bonds[T]) for T in ys}

A = np.array([[d[2], d[10]], [pv(ys[2], bonds[2]), pv(ys[10], bonds[10])]])
b = np.array([d[5], pv(ys[5], bonds[5])])
w2, w10 = np.linalg.solve(A, b)
print(f"barbell matching the 5y on PV and DV01: {w2:.4f} units of 2y, {w10:.4f} units of 10y")

print("  scenario                       bullet    barbell   difference")
for name, sh in (("parallel +20bp", {2: 20, 5: 20, 10: 20}),
                 ("parallel +150bp", {2: 150, 5: 150, 10: 150}),
                 ("steepener -10/+5/+30", {2: -10, 5: 5, 10: 30}),
                 ("butterfly +10/-15/+10", {2: 10, 5: -15, 10: 10})):
    bullet = pv(ys[5] + sh[5] * 1e-4, bonds[5]) - pv(ys[5], bonds[5])
    barbell = (w2 * (pv(ys[2] + sh[2] * 1e-4, bonds[2]) - pv(ys[2], bonds[2]))
               + w10 * (pv(ys[10] + sh[10] * 1e-4, bonds[10]) - pv(ys[10], bonds[10])))
    print(f"  {name:28s} {bullet:+8.4f}  {barbell:+8.4f}  {barbell-bullet:+9.4f}")`,
            output: "barbell matching the 5y on PV and DV01: 0.5798 units of 2y, 0.4202 units of 10y\n  scenario                       bullet    barbell   difference\n  parallel +20bp                -0.8825   -0.8802    +0.0022\n  parallel +150bp               -6.4009   -6.2840    +0.1169\n  steepener -10/+5/+30          -0.2215   -0.8761    -0.6547\n  butterfly +10/-15/+10         +0.6679   -0.4418    -1.1097" } },

        { name: "Key-rate durations: a vector of exposures that adds up",
          explain: `<p>A key-rate duration, or partial DV01, is the price change from bumping one point of
            the zero curve by a basis point while holding the others fixed and letting the interpolation
            rule spread the bump over the neighbouring segments. Do it for every knot and you get a vector
            whose entries say where on the curve the position is exposed. The vector is far more
            informative than its sum, because it tells you which hedging instrument to use, not merely how
            much risk there is.</p>
            <p>The property that makes the vector trustworthy is additivity: because a parallel shift is
            the sum of all the individual key-rate bumps, the partial DV01s add to the total DV01, up to a
            tiny second-order term. That identity is the unit test. If your partials do not sum to the
            parallel bump, the bump shapes do not tile the curve, usually because the first or last knot
            is not extrapolated flat.</p>
            <p>The choice of key rates is itself a decision. Too few and the vector hides the risk you
            care about; too many and neighbouring entries become nearly collinear and the implied hedge
            becomes unstable. Desks care because the key-rate report is what a rates trader actually looks
            at in the morning: it maps directly onto the liquid hedging instruments, which are quoted at
            exactly the standard tenors the key rates are chosen to match.</p>`,
          formula: "\\text{KRD}_j = -\\frac{\\partial P}{\\partial y_j}\\cdot 10^{-4}, \\qquad \\sum_j \\text{KRD}_j \\approx \\text{DV01}",
          code: { lang: "python", src: `import numpy as np

key = np.array([0.5, 1.0, 2.0, 3.0, 5.0, 7.0, 10.0])
z0 = np.array([0.0420, 0.0432, 0.0445, 0.0452, 0.0460, 0.0466, 0.0470])

t = np.arange(0.5, 10.0001, 0.5)
c = np.full_like(t, 2.0)
c[-1] += 100.0

def price(z):
    return float(np.sum(c * np.exp(-np.interp(t, key, z) * t)))

P = price(z0)
krd = []
for i in range(len(key)):
    zp, zm = z0.copy(), z0.copy()
    zp[i] += 1e-4
    zm[i] -= 1e-4
    krd.append(0.5 * (price(zm) - price(zp)))

total = 0.5 * (price(z0 - 1e-4) - price(z0 + 1e-4))
print(f"price of the 4% 10y bond off this curve = {P:.5f}")
for T, k in zip(key, krd):
    print(f"  key rate {T:4.1f}y   partial DV01 {k:+.6f}")
print(f"sum of partial DV01s        = {sum(krd):.6f}")
print(f"DV01 from one parallel bump = {total:.6f}")
print(f"difference                  = {abs(sum(krd) - total):.2e}")`,
            output: "price of the 4% 10y bond off this curve = 94.16004\n  key rate  0.5y   partial DV01 +0.000098\n  key rate  1.0y   partial DV01 +0.000332\n  key rate  2.0y   partial DV01 +0.000730\n  key rate  3.0y   partial DV01 +0.001712\n  key rate  5.0y   partial DV01 +0.003161\n  key rate  7.0y   partial DV01 +0.005181\n  key rate 10.0y   partial DV01 +0.066665\nsum of partial DV01s        = 0.077879\nDV01 from one parallel bump = 0.077879\ndifference                  = 5.47e-10" } },

        { name: "Principal components: level, slope and curvature are empirical, not assumed",
          explain: `<p>Key rates are a coordinate system chosen by the analyst. Principal component
            analysis instead lets the data choose. Collect daily changes in zero rates across tenors, form
            the covariance matrix, and take its eigenvectors. In every developed rates market the answer
            is the same: the first eigenvector is nearly flat across tenors, the second changes sign once,
            and the third changes sign twice. They are named level, slope and curvature after their
            shapes, and together they routinely explain well over ninety-five per cent of the variance of
            curve changes.</p>
            <p>This is an empirical regularity, not a theorem, and it is the reason a three-factor view of
            the curve is the working standard. It also tells you how much hedging is worth doing: a
            position hedged against the first three components has residual risk equal to the remaining
            eigenvalues, which are small but not zero and are exactly the part of curve risk that no
            liquid instrument isolates cleanly.</p>
            <p>Two practical warnings. Eigenvectors are defined only up to sign, so any interpretation of
            the direction has to be pinned down by convention. And the decomposition is of the sample
            covariance, so it inherits the sample period: a curve estimated during a policy-tightening
            cycle will show a different level-slope split than one estimated during a flat-rate period.
            Desks care because the factor exposures, not the raw key rates, are what risk limits are
            usually written against.</p>`,
          formula: "\\Sigma = V \\Lambda V^{\\top}, \\qquad \\Delta z_t \\approx \\sum_{i=1}^{3} f_{i,t} \\, v_i",
          code: { lang: "python", src: `import numpy as np

rng = np.random.default_rng(7)
tenors = np.array([0.5, 1, 2, 3, 5, 7, 10, 20, 30], dtype=float)
lt = np.log(tenors)

level = np.ones_like(tenors)
slope = (lt - lt.mean()) / np.std(lt)
curv = (lt - lt.mean()) ** 2
curv = (curv - curv.mean()) / np.std(curv)

n = 2500
f = rng.standard_normal((n, 3)) * np.array([6.0, 2.2, 0.8])
dz = (np.dot(f, np.vstack([level, slope, curv]))
      + 0.25 * rng.standard_normal((n, len(tenors)))) * 1e-4

X = dz - dz.mean(axis=0)
C = np.cov(X, rowvar=False)
w, V = np.linalg.eigh(C)
order = np.argsort(w)[::-1]
w, V = w[order], V[:, order]
share = w / w.sum()

print("variance explained: " + "  ".join(f"PC{i+1} {100*share[i]:5.2f}%" for i in range(4)))
print(f"first three together: {100*share[:3].sum():.2f}%")
for i in range(3):
    v = V[:, i]
    v = v * np.sign(v[np.argmax(np.abs(v))])
    print(f"PC{i+1} loadings  " + " ".join(f"{x:+.2f}" for x in v)
          + f"   sign changes {int(np.sum(np.diff(np.sign(v)) != 0))}")
print(f"daily sd of the PC1 score = {1e4*np.sqrt(w[0]):.1f} bp of a unit-norm level move")`,
            output: "variance explained: PC1 86.71%  PC2 11.61%  PC3  1.57%  PC4  0.02%\nfirst three together: 99.90%\nPC1 loadings  +0.33 +0.33 +0.33 +0.33 +0.33 +0.33 +0.33 +0.33 +0.34   sign changes 0\nPC2 loadings  +0.59 +0.39 +0.20 +0.09 -0.04 -0.13 -0.22 -0.39 -0.49   sign changes 1\nPC3 loadings  +0.55 +0.05 -0.25 -0.33 -0.33 -0.27 -0.16 +0.22 +0.52   sign changes 2\ndaily sd of the PC1 score = 17.7 bp of a unit-norm level move" } },

        { name: "Hedging two factors at once",
          explain: `<p>Once the curve has a factor structure, hedging becomes a small linear algebra
            problem. Compute the partial DV01 vector of the position and of each candidate hedge
            instrument, project each vector onto the factor shapes to get factor exposures, and solve for
            the instrument weights that zero the exposures you care about. With two instruments you can
            kill two factors; with three, three.</p>
            <p>What survives is instructive. A seven-year bond hedged against level and slope with a
            two-year and a ten-year still has curvature exposure, because the bullet sits in the belly and
            the hedges sit at the wings: that is the butterfly risk, and it is the residual by
            construction rather than by accident. Adding a five-year to the hedge set kills it and leaves
            a smaller residual in the fourth factor, and so on down the eigenvalue ladder.</p>
            <p>The engineering point is that the whole calculation is a matrix of partial DV01s times a
            matrix of factor shapes, solved once. The judgement point is choosing which factors to hedge:
            hedging everything is expensive in bid-ask and in financing, and the third and fourth factors
            are often better left as deliberate exposure than as a cost. Desks care because this is the
            arithmetic behind the sentence "we run the book level-neutral and slope-neutral and take
            curvature risk", which is a real and common mandate.</p>`,
          formula: "E = K S^{\\top}, \\qquad w = \\left(E_{\\text{hedges}}\\right)^{-1} E_{\\text{target}}",
          code: { lang: "python", src: `import numpy as np

key = np.array([0.5, 1.0, 2.0, 3.0, 5.0, 7.0, 10.0])
z0 = np.array([0.0420, 0.0432, 0.0445, 0.0452, 0.0460, 0.0466, 0.0470])

def bond(T, cpn):
    t = np.arange(0.5, T + 1e-9, 0.5)
    c = np.full_like(t, 100.0 * cpn / 2.0)
    c[-1] += 100.0
    return t, c

def pv(t, c, z):
    return float(np.sum(c * np.exp(-np.interp(t, key, z) * t)))

def partials(t, c):
    out = []
    for i in range(len(key)):
        zp, zm = z0.copy(), z0.copy()
        zp[i] += 1e-4
        zm[i] -= 1e-4
        out.append(0.5 * (pv(t, c, zm) - pv(t, c, zp)))
    return np.array(out)

K = np.vstack([partials(*bond(7, 0.0466)), partials(*bond(2, 0.0445)), partials(*bond(10, 0.0470))])

lt = np.log(key)
level = np.ones_like(key)
slope = (lt - lt.mean()) / np.std(lt)
curv = (lt - lt.mean()) ** 2
curv = (curv - curv.mean()) / np.std(curv)

S = np.vstack([level, slope])
E = np.dot(K, S.T)
w = np.linalg.solve(np.array([[E[1, 0], E[2, 0]], [E[1, 1], E[2, 1]]]), E[0])
print(f"7y bond exposures: level {E[0,0]:+.5f}  slope {E[0,1]:+.5f}")
print(f"hedge: sell {w[0]:.4f} units of the 2y and {w[1]:.4f} units of the 10y")

res = K[0] - w[0] * K[1] - w[1] * K[2]
print("residual partial DV01s: " + " ".join(f"{x:+.4f}" for x in res))
print(f"residual level {np.dot(res, level):+.7f}   slope {np.dot(res, slope):+.7f}   "
      f"curvature {np.dot(res, curv):+.5f}")
print("two instruments kill two factors exactly; the curvature is what the trade is now about")`,
            output: "7y bond exposures: level +0.06034  slope +0.05265\nhedge: sell 0.6592 units of the 2y and 0.5907 units of the 10y\nresidual partial DV01s: -0.0000 -0.0001 -0.0121 +0.0008 +0.0015 +0.0497 -0.0398\nresidual level +0.0000000   slope -0.0000000   curvature -0.02546\ntwo instruments kill two factors exactly; the curvature is what the trade is now about" } }
      ],
      widget: { type: "heatmap", title: "Partial DV01 by instrument and key rate (per 100 face)",
        params: { cmap: "div",
          xlabels: ["6m", "1y", "2y", "3y", "5y", "7y", "10y", "30y"],
          ylabels: ["2y bond", "5y bond", "10y bond", "30y bond", "5y10y fwd", "2s10s steepener"],
          matrix: [[0.010, 0.019, 0.163, 0.000, 0.000, 0.000, 0.000, 0.000],
                   [0.010, 0.019, 0.038, 0.055, 0.324, 0.000, 0.000, 0.000],
                   [0.009, 0.018, 0.035, 0.050, 0.086, 0.104, 0.500, 0.000],
                   [0.008, 0.016, 0.031, 0.044, 0.073, 0.088, 0.190, 1.220],
                   [0.000, 0.000, 0.000, 0.000, -0.330, 0.110, 0.560, 0.000],
                   [-0.480, -0.060, -0.410, 0.000, 0.000, 0.000, 0.500, 0.000]] } },
      pitfalls: [
        "Bumping a key rate without deciding what happens outside the first and last knot. Flat extrapolation is the usual convention, and without it the partials will not sum to the parallel DV01.",
        "Reading a principal component's sign as meaningful. Eigenvectors come out of the solver with an arbitrary sign; fix it by convention before anyone interprets a loading.",
        "Estimating the factor structure on one regime and hedging in another. The level-slope split from a tightening cycle does not transfer to a pinned-at-zero period.",
        "Adding key rates until the hedge matrix is nearly singular. Neighbouring tenors are highly collinear and the implied weights explode long before the report looks wrong."
      ],
      check: [
        { q: "Your partial DV01s sum to 0.71 but the parallel-bump DV01 is 0.78. What is the most likely cause?",
          options: ["Second-order convexity effects", "The key-rate bumps do not tile the whole curve",
                    "The bond has an embedded option", "The interpolation rule is nonlinear"],
          answer: 1,
          why: "A parallel shift is the sum of the individual key-rate bumps only if those bumps add up to a constant one-basis-point shift everywhere, which requires flat extrapolation beyond the first and last knots. A nine per cent shortfall is far too large to be the second-order term, which is a fraction of a basis point of price at this scale, and neither an embedded option nor a nonlinear interpolation rule would produce a clean additivity gap of that size." },
        { q: "In a standard PCA of daily zero-rate changes, the second component typically has loadings that:",
          options: ["Are all the same sign and nearly equal", "Change sign once across the tenor range",
                    "Change sign twice across the tenor range", "Are zero at the short end and constant thereafter"],
          answer: 1,
          why: "The components are conventionally named for their shapes: the first is nearly flat and all one sign, which is why it is called level; the second changes sign once, short end against long end, which is slope; the third changes sign twice, wings against belly, which is curvature. A component that is zero at the short end and constant afterwards is not a shape the covariance of curve changes produces." },
        { q: "A barbell and a bullet are matched on present value and DV01. Which statement is true?",
          options: ["They behave identically under every yield-curve move",
                    "The barbell has more convexity and more exposure to curve shape",
                    "The bullet has more convexity", "The match makes both positions riskless"],
          answer: 1,
          why: "Matching present value and DV01 pins the zeroth and first order under a parallel move only. The barbell spreads its cash flows to the two wings, which raises the dispersion of payment times and therefore its convexity, and it places its exposure where a steepening or butterfly move bites. The bullet, concentrated in the belly, has the lower convexity, and neither position is remotely riskless: the match is precisely what turns the pair into a pure shape-and-convexity trade." }
      ]
    },

    /* ══════════ WEEK 4 ══════════ */
    { n: 4,
      title: "Forwards, carry, roll-down, and the Expectations Hypothesis",
      topics: ["forward rates", "carry and roll-down decomposition", "the Campbell-Shiller regression",
               "term premium", "breakeven inflation"],
      concepts: [
        { name: "Forward rates are prices you can lock in today",
          explain: `<p>Given discount factors at two maturities, the forward rate between them is not a
            forecast: it is the rate at which you can contract today to borrow or lend over that future
            period, enforced by a static replication. Buy the longer zero, finance it to the shorter date,
            and the amount you owe at the shorter date divided by what you receive at the longer date is
            exactly the forward discount factor. If a dealer quoted anything else you could lock in a
            riskless profit with two trades.</p>
            <p>This is worth saying carefully because the forward curve is constantly misread. A forward
            curve that slopes upward is often described as the market expecting rate rises. That
            interpretation requires an extra assumption — that investors demand no compensation for
            holding duration — which is exactly the Expectations Hypothesis that the rest of the week is
            about testing. Absent that assumption, the forward is an expectation plus a term premium, and
            the two pieces are not separately observable from prices alone.</p>
            <p>Desks care because forwards are the natural quoting convention for anything that starts in
            the future: forward-starting swaps, futures, and the roll of a futures position. They are also
            how you state a view precisely. "I think the two-year rate in one year will be lower than the
            one-year forward two-year rate" is a tradeable sentence; "I think rates will fall" is not.</p>`,
          formula: "Z(0,T_1) \\cdot Z^{f}(T_1,T_2) = Z(0,T_2), \\qquad f(T_1,T_2) = \\frac{1}{T_2-T_1}\\left(\\frac{Z(0,T_1)}{Z(0,T_2)} - 1\\right)",
          code: { lang: "python", src: `import numpy as np

T = np.array([0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0])
z = np.array([0.0420, 0.0432, 0.0440, 0.0445, 0.0449, 0.0452, 0.0457, 0.0460])
DF = np.exp(-z * T)

print(" start   end   forward (cc)   forward (simple)")
for i in range(len(T) - 1):
    tau = T[i + 1] - T[i]
    fcc = (z[i + 1] * T[i + 1] - z[i] * T[i]) / tau
    fsim = (DF[i] / DF[i + 1] - 1.0) / tau
    print(f" {T[i]:5.1f} {T[i+1]:5.1f}   {100*fcc:9.4f}%      {100*fsim:9.4f}%")

fwd_price = DF[5] / DF[1]
print(f"1y forward price of the 3y zero = {fwd_price:.6f}")
cash_today = DF[5]
owed_at_1y = cash_today / DF[1]
print(f"buy the 3y zero today for {cash_today:.6f}, finance it to 1y, owe {owed_at_1y:.6f}")
print(f"replication error against the quoted forward = {abs(owed_at_1y - fwd_price):.2e}")`,
            output: " start   end   forward (cc)   forward (simple)\n   0.5   1.0      4.4400%         4.4897%\n   1.0   1.5      4.5600%         4.6124%\n   1.5   2.0      4.6000%         4.6533%\n   2.0   2.5      4.6500%         4.7045%\n   2.5   3.0      4.6700%         4.7249%\n   3.0   4.0      4.7200%         4.8332%\n   4.0   5.0      4.7200%         4.8332%\n1y forward price of the 3y zero = 0.911740\nbuy the 3y zero today for 0.873192, finance it to 1y, owe 0.911740\nreplication error against the quoted forward = 0.00e+00" } },

        { name: "Carry and roll-down: what you earn if nothing happens",
          explain: `<p>Ask what a bond position returns over three months if the zero curve is exactly
            unchanged. The answer is not zero, and it has two named pieces. Carry is the coupon income
            earned over the period minus the cost of financing the position, usually at repo. Roll-down is
            the price change that comes from the bond simply becoming three months shorter and therefore
            being discounted off a different part of the same static curve: on an upward-sloping curve,
            shorter means a lower discount rate and a higher price.</p>
            <p>The split is a definition, so the two pieces add to the total by construction; the content
            is in the sizes. A steep front end produces large roll-down and makes a position look
            attractive before any view is expressed, which is exactly why carry-and-roll screens are a
            staple of relative-value desks and exactly why they are dangerous. Carry and roll are the
            return you get if your forecast is that nothing moves, and a curve that is steep is steep for
            a reason.</p>
            <p>The honest framing is that carry plus roll-down is the break-even: it is how much yields
            have to rise before the position loses money. Desks care because that break-even is the
            comparable quantity across trades of different maturities and different instruments, and
            because it is the number that gets quoted when a trade idea is pitched.</p>`,
          formula: "R_{\\text{horizon}} \\approx \\underbrace{c\\,h - r_{\\text{repo}} P h}_{\\text{carry}} + \\underbrace{P_{h}^{\\text{static}} - P_0 - c\\,h}_{\\text{roll-down}}",
          code: { lang: "python", src: `import numpy as np

key = np.array([0.25, 0.5, 1, 2, 3, 4, 5, 7, 10], dtype=float)
z = np.array([0.0400, 0.0415, 0.0430, 0.0445, 0.0452, 0.0457, 0.0460, 0.0466, 0.0470])

def df(t):
    t = np.asarray(t, dtype=float)
    return np.exp(-np.interp(t, key, z) * t)

cpn, h = 0.046, 0.25
t0 = np.arange(0.5, 5.0001, 0.5)
c0 = np.full_like(t0, 100.0 * cpn / 2.0)
c0[-1] += 100.0

P0 = float(np.sum(c0 * df(t0)))
t1 = t0 - h
P1 = float(np.sum(c0[t1 > 0] * df(t1[t1 > 0])))

repo = float(np.interp(h, key, z))
fin = P0 * (np.exp(repo * h) - 1.0)
accr = 100.0 * cpn * h

carry = accr - fin
roll = P1 - P0 - accr
total = P1 - P0 - fin

print(f"price today                          = {P0:10.5f}")
print(f"price in 3m on an unchanged curve    = {P1:10.5f}")
print(f"coupon accrued                       = {accr:+10.5f}")
print(f"repo cost at {100*repo:.2f}%                 = {-fin:+10.5f}")
print(f"carry                                = {carry:+10.5f}")
print(f"roll-down                            = {roll:+10.5f}")
print(f"carry + roll-down                    = {carry + roll:+10.6f}")
print(f"total 3m P and L, curve unchanged    = {total:+10.6f}")

dv = 0.5 * (float(np.sum(c0 * df(t0) * np.exp(1e-4 * t0)))
            - float(np.sum(c0 * df(t0) * np.exp(-1e-4 * t0))))
print(f"break-even: yields can rise {total/dv:.1f} bp over 3m before the trade loses")`,
            output: "price today                          =   99.80789\nprice in 3m on an unchanged curve    =  100.99249\ncoupon accrued                       =   +1.15000\nrepo cost at 4.00%                 =   -1.00309\ncarry                                =   +0.14691\nroll-down                            =   +0.03460\ncarry + roll-down                    =  +0.181516\ntotal 3m P and L, curve unchanged    =  +0.181516\nbreak-even: yields can rise 4.0 bp over 3m before the trade loses" } },

        { name: "The Expectations Hypothesis and the Campbell-Shiller regression",
          explain: `<p>The Expectations Hypothesis says the long yield is the average of expected future
            short yields, so that forward rates are unbiased forecasts and no maturity earns a systematic
            excess return. It is a sharp, testable statement. Campbell and Shiller's test regresses the
            change in the long yield over the next period on the current slope, scaled by maturity. Under
            the hypothesis the population slope coefficient is exactly one, whatever the dynamics of the
            short rate happen to be — the algebra cancels the persistence parameter.</p>
            <p>That is what makes the test interesting: the null is a number, not a shape. Run it on
            simulated data generated under the hypothesis and you recover one to within sampling error.
            Run it on decades of actual government bond data and the estimate is reliably below one, often
            negative at long maturities. A steep curve does not, on average, precede rising long yields;
            it precedes excess returns to holding duration.</p>
            <p>The interpretation is a time-varying term premium. The slope is partly a forecast and partly
            compensation for bearing duration risk, and the compensation moves around, which drags the
            regression coefficient away from one. Desks care because this is the empirical foundation of
            carry trades in rates: the systematic tendency of the curve slope to predict excess returns
            rather than rate changes is precisely the return that duration-extension and steepener
            strategies harvest, and the risk premium interpretation says exactly when it should be
            expected to hurt.</p>`,
          formula: "y^{(n-1)}_{t+1} - y^{(n)}_{t} = \\alpha + \\beta\\,\\frac{y^{(n)}_t - y^{(1)}_t}{n-1} + \\varepsilon_{t+1}, \\qquad H_0: \\beta = 1",
          code: { lang: "python", src: `import numpy as np

rng = np.random.default_rng(11)
N, phi, mu, sig = 60000, 0.97, 0.04, 0.0025

r = np.empty(N)
r[0] = mu
for t in range(1, N):
    r[t] = mu + phi * (r[t - 1] - mu) + sig * rng.standard_normal()

def a(n):
    return np.mean(phi ** np.arange(n))

def ols(x, y):
    X = np.column_stack([np.ones_like(x), x])
    b, *_ = np.linalg.lstsq(X, y, rcond=None)
    resid = y - np.dot(X, b)
    s2 = float(np.dot(resid, resid)) / (len(y) - 2)
    se = np.sqrt(s2 * np.linalg.inv(np.dot(X.T, X))[1, 1])
    return b[1], se

n = 20
# case A: pure expectations, no term premium
yn = mu + a(n) * (r - mu)
yn1 = mu + a(n - 1) * (r - mu)
x = (yn[:-1] - r[:-1]) / (n - 1)
y = yn1[1:] - yn[:-1]
bA, seA = ols(x, y)
print(f"pure expectations : beta = {bA:7.4f}  (se {seA:.4f})   null is 1")

# case B: a persistent, mean-reverting term premium loaded on the long yield
p = np.empty(N)
p[0] = 0.0
for t in range(1, N):
    p[t] = 0.98 * p[t - 1] + 0.0009 * rng.standard_normal()
ynB = yn + p
ynB1 = yn1 + p * (n - 1) / n
xB = (ynB[:-1] - r[:-1]) / (n - 1)
yB = ynB1[1:] - ynB[:-1]
bB, seB = ols(xB, yB)
print(f"time-varying premium: beta = {bB:7.4f}  (se {seB:.4f})   rejects 1 by "
      f"{abs(bB-1)/seB:.1f} standard errors")
print("the slope stops forecasting rate changes exactly when it starts forecasting excess returns")`,
            output: "pure expectations : beta =  0.9926  (se 0.0605)   null is 1\ntime-varying premium: beta = -0.7923  (se 0.0321)   rejects 1 by 55.9 standard errors\nthe slope stops forecasting rate changes exactly when it starts forecasting excess returns" } },

        { name: "Inflation: breakevens are traded spreads, not survey forecasts",
          explain: `<p>An inflation-linked bond pays coupons and principal indexed to a price level, so its
            yield is a real yield. The difference between the nominal yield and the real yield at the same
            maturity is the breakeven inflation rate: the average inflation over the period at which the
            two bonds deliver the same return. It is quoted as a spread and traded directly through
            inflation swaps.</p>
            <p>The temptation is to read a breakeven as the market's inflation forecast. It is not, for
            two reasons that pull in opposite directions. Nominal bonds are exposed to inflation risk, so
            investors demand an inflation risk premium that pushes the breakeven above expected inflation.
            Inflation-linked bonds are less liquid and command a liquidity concession that raises their
            real yield and therefore pushes the breakeven down. The observed breakeven is expected
            inflation plus the first effect minus the second, and neither term is directly observable.</p>
            <p>There are further wrinkles a desk lives with: the indexation lag means the nearest coupons
            are already known, seasonality in the price index makes short-dated breakevens oscillate, and
            the deflation floor on principal is an embedded option that matters when the price level has
            fallen since issue. Desks care because the breakeven is one of the cleanest expressions of a
            macro view available in liquid size, and because the decomposition tells you which part of a
            breakeven move was a change in the view and which was a change in the premium.</p>`,
          formula: "\\text{BE} = y_{\\text{nom}} - y_{\\text{real}} = \\mathbb{E}[\\pi] + \\text{IRP} - \\text{LIQ}",
          code: { lang: "python", src: `import numpy as np

T = np.array([2.0, 5.0, 10.0, 30.0])
nom = np.array([0.0451, 0.0460, 0.0470, 0.0485])
real = np.array([0.0185, 0.0192, 0.0198, 0.0210])

be_diff = nom - real
be_comp = np.exp(nom - real) - 1.0

print("   T   nominal    real    BE (difference)   BE (compounded)")
for i in range(len(T)):
    print(f" {T[i]:4.0f}y  {100*nom[i]:6.3f}%  {100*real[i]:6.3f}%     {1e4*be_diff[i]:8.1f} bp       {1e4*be_comp[i]:8.1f} bp")

exp_infl = np.array([0.0245, 0.0240, 0.0235, 0.0230])
liq = np.array([0.0008, 0.0010, 0.0012, 0.0015])
irp = be_diff - exp_infl + liq

print("assumed expected inflation (bp): " + " ".join(f"{1e4*x:6.0f}" for x in exp_infl))
print("assumed TIPS liquidity  (bp):    " + " ".join(f"{1e4*x:6.0f}" for x in liq))
print("implied inflation risk premium:  " + " ".join(f"{1e4*x:+6.0f}" for x in irp))
print("a 10bp move in the 10y breakeven is a change in view, in premium, or in liquidity, "
      "and prices alone cannot tell you which")`,
            output: "   T   nominal    real    BE (difference)   BE (compounded)\n    2y   4.510%   1.850%        266.0 bp          269.6 bp\n    5y   4.600%   1.920%        268.0 bp          271.6 bp\n   10y   4.700%   1.980%        272.0 bp          275.7 bp\n   30y   4.850%   2.100%        275.0 bp          278.8 bp\nassumed expected inflation (bp):    245    240    235    230\nassumed TIPS liquidity  (bp):         8     10     12     15\nimplied inflation risk premium:     +29    +38    +49    +60\na 10bp move in the 10y breakeven is a change in view, in premium, or in liquidity, and prices alone cannot tell you which" } }
      ],
      widget: { type: "curve", title: "Spot curve, one-year-forward curve, and where roll-down comes from",
        params: { xlab: "Maturity (years)", ylab: "Zero rate (%)", log: false,
          series: [
            { name: "Spot zero curve", x: [0.25, 0.5, 1, 2, 3, 4, 5, 7, 10],
              y: [4.00, 4.15, 4.30, 4.45, 4.52, 4.57, 4.60, 4.66, 4.70] },
            { name: "1y forward curve", x: [0.25, 0.5, 1, 2, 3, 4, 5, 7, 10],
              y: [4.42, 4.51, 4.60, 4.63, 4.66, 4.68, 4.71, 4.75, 4.78] },
            { name: "Curve unchanged in 1y (roll path)", x: [0.25, 0.5, 1, 2, 3, 4, 5, 7, 10],
              y: [4.00, 4.15, 4.30, 4.45, 4.52, 4.57, 4.60, 4.66, 4.70] }] } },
      pitfalls: [
        "Calling the forward curve a forecast. It is a replicable price; calling it a forecast assumes away the term premium that the Campbell-Shiller evidence says is there and moving.",
        "Screening trades on carry and roll alone. It ranks steep-curve positions at the top by construction, which is the same as ranking by how much duration risk you are taking.",
        "Reading a breakeven as expected inflation. It also contains an inflation risk premium and a liquidity concession, and short-dated breakevens additionally carry index seasonality and a known indexation lag.",
        "Testing the Expectations Hypothesis with overlapping horizons and ordinary standard errors. Overlap induces serial correlation in the residuals and makes the rejection look far stronger than it is."
      ],
      check: [
        { q: "The one-year forward two-year rate is 4.8% while the current two-year rate is 4.4%. Under the Expectations Hypothesis this means:",
          options: ["The market is certain rates will rise", "The expected two-year rate in one year is 4.8%",
                    "The term premium is 40bp", "Two-year bonds are cheap"],
          answer: 1,
          why: "The Expectations Hypothesis is exactly the assumption that forwards are unbiased expectations with no risk compensation, so under it the forward equals the expected future spot. It says nothing about certainty, since an expectation is compatible with wide dispersion. It cannot simultaneously imply a non-zero term premium, because a zero term premium is the hypothesis itself, and richness or cheapness is a relative-value judgement the identity does not make." },
        { q: "A position shows large positive roll-down. What does that tell you?",
          options: ["The trade is profitable", "The curve is steep where the position sits",
                    "The position is DV01 neutral", "Financing is cheap"],
          answer: 1,
          why: "Roll-down is the price gain from the instrument shortening along a static curve, so it is large precisely where the curve is steep at the position's maturity. It is a statement about curve shape, not about realised profit, which also depends on whether the curve stays put. Cheap financing shows up in carry rather than roll-down, and neither quantity says anything about the position's DV01." },
        { q: "The Campbell-Shiller slope coefficient is estimated at -0.6 on long maturities. The standard interpretation is:",
          options: ["The regression is misspecified", "Long yields fall when the curve is steep, violating the hypothesis in a way consistent with a time-varying term premium",
                    "The short rate is a random walk", "Inflation expectations are unanchored"],
          answer: 1,
          why: "Under the null the coefficient is exactly one regardless of how persistent the short rate is, so a reliably negative estimate says the steep curve is not forecasting the rate rises the hypothesis requires; instead it is forecasting excess returns to duration, which is the signature of a term premium that varies over time. A random-walk short rate would still give a coefficient of one, and nothing in this regression identifies whether inflation expectations are anchored." },
        { q: "Ten-year breakeven inflation rises 15bp. Which is NOT a possible cause?",
          options: ["Expected inflation rose", "The inflation risk premium rose",
                    "Inflation-linked bonds became more liquid relative to nominals", "The real yield rose while the nominal yield was unchanged"],
          answer: 3,
          why: "The breakeven is the nominal yield minus the real yield, so a rise in the real yield with the nominal yield unchanged mechanically lowers the breakeven rather than raising it. Each of the other three raises it: a higher inflation forecast and a higher inflation risk premium both push the nominal yield up relative to the real one, and better relative liquidity in linkers removes part of the concession that had been depressing the spread." }
      ]
    },

    /* ══════════ WEEK 5 ══════════ */
    { n: 5,
      title: "Swaps, caps and floors, and a first term-structure model",
      topics: ["the par swap rate", "annuity and swap DV01", "dual-curve discounting",
               "cap-floor parity and Black's formula", "the Vasicek model and its limits"],
      concepts: [
        { name: "A swap is a curve instrument: the par rate is a ratio",
          explain: `<p>An interest rate swap exchanges a fixed coupon for a floating rate on the same
            notional. Value the floating leg by the telescoping argument — under single-curve assumptions
            the present value of receiving the floating rate on a unit notional over the life of the swap
            is just one minus the final discount factor — and the fixed leg is the fixed rate times the
            annuity, the discounted sum of the accrual-weighted payment dates. Setting the two equal gives
            the par swap rate as a ratio: one minus the terminal discount factor, over the annuity.</p>
            <p>Two consequences follow immediately. First, a swap at inception has zero value, which is
            why swaps are the natural instrument for taking duration risk without using balance sheet: no
            principal changes hands. Second, all the sensitivity of the swap's value to the curve is
            carried by the annuity and the terminal discount factor, so a swap's DV01 is the annuity times
            one basis point, to a very good approximation. That single fact turns most swap risk
            arithmetic into a one-line calculation.</p>
            <p>Desks care because the swap curve is the reference curve for most of the rates market. It
            is quoted at every standard tenor, it is liquid, and it is the hedging instrument of choice for
            anything with a rate exposure, so being able to move between par swap rates, discount factors
            and annuities without thinking is the basic fluency of the job.</p>`,
          formula: "s(T) = \\frac{1 - Z(0,T)}{A(T)}, \\qquad A(T) = \\sum_{i} \\tau_i Z(0,T_i)",
          code: { lang: "python", src: `import numpy as np

key = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10], dtype=float)
z = np.array([0.0400, 0.0415, 0.0430, 0.0445, 0.0452, 0.0460, 0.0466, 0.0470])

def DF(t, zz=z):
    t = np.asarray(t, dtype=float)
    return np.exp(-np.interp(t, key, zz) * t)

fixed_t = np.arange(0.5, 10.0001, 0.5)
ann = 0.5 * float(np.sum(DF(fixed_t)))
s = float((1.0 - DF(10.0)) / ann)

print(f"10y semiannual annuity              = {ann:.6f}")
print(f"par swap rate                       = {100*s:.5f}%")
print(f"PV fixed leg at the par rate        = {s*ann:.10f}")
print(f"PV floating leg = 1 - Z(10)         = {float(1.0 - DF(10.0)):.10f}")
print(f"net PV at inception                 = {s*ann - float(1.0 - DF(10.0)):.2e}")

def par(zz):
    a = 0.5 * float(np.sum(DF(fixed_t, zz)))
    return float((1.0 - DF(10.0, zz)) / a)

print(f"1bp parallel zero shift moves the par rate by {1e4*(par(z+1e-4)-par(z)):.4f} bp")
print(f"DV01 of 100m notional (annuity x 1bp)        = {ann*1e-4*1e8:,.0f}")`,
            output: "10y semiannual annuity              = 7.915241\npar swap rate                       = 4.73767%\nPV fixed leg at the par rate        = 0.3749977317\nPV floating leg = 1 - Z(10)         = 0.3749977317\nnet PV at inception                 = 0.00e+00\n1bp parallel zero shift moves the par rate by 1.0198 bp\nDV01 of 100m notional (annuity x 1bp)        = 79,152" } },

        { name: "Dual-curve discounting: one curve is not enough",
          explain: `<p>The single-curve picture above assumes the rate you project for the floating leg and
            the rate you discount with are the same. Since the credit crisis that assumption is dead. A
            collateralised swap is discounted at the rate paid on the collateral, which is an overnight
            rate; the floating leg, if it references a term rate or a spread-bearing index, is projected
            off a different curve. Modern practice builds an overnight discount curve and one forwarding
            curve per index, and values every swap with both.</p>
            <p>The mechanics are straightforward once the two curves are separate. Forward rates come from
            the forwarding curve, each cash flow is discounted on the overnight curve, and the par rate
            becomes the discount-weighted average of forwards rather than a telescoping ratio. The
            telescoping shortcut is exactly what the second curve breaks.</p>
            <p>The size of the effect is worth knowing precisely, because it is smaller than people
            expect in one place and larger in another. For a swap struck at its own par rate the effect
            is second order: the discount factors appear in both legs and mostly cancel, so a twelve
            basis point basis moves the par rate by a fraction of a basis point. For a seasoned or
            off-market swap nothing cancels, and the revaluation runs to tens of thousands per hundred
            million. The annuity itself also changes, so the reported DV01 moves. And the basis between
            the two curves is a risk factor of its own: a book can be flat to each curve separately and
            still exposed to that spread.</p>
            <p>Desks care because this is the difference between a valuation that reconciles with the
            counterparty and one that does not, and because collateral terms — which currency, which
            index, whether there is a threshold — change the discount curve and therefore the price.</p>`,
          formula: "V = \\sum_i \\tau_i \\left(K - F_i\\right) D^{\\text{OIS}}(T_i), \\qquad K^{*} = \\frac{\\sum_i \\tau_i F_i D^{\\text{OIS}}(T_i)}{\\sum_i \\tau_i D^{\\text{OIS}}(T_i)}",
          code: { lang: "python", src: `import numpy as np

key = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10], dtype=float)
ois = np.array([0.0390, 0.0403, 0.0417, 0.0431, 0.0438, 0.0446, 0.0452, 0.0456])
basis = 0.0012

t = np.arange(0.5, 10.0001, 0.5)

def dfc(tt, zz):
    return np.exp(-np.interp(tt, key, zz) * tt)

D = dfc(t, ois)
F = dfc(t, ois + basis)
Fprev = np.concatenate([[1.0], F[:-1]])
fwd = (Fprev / F - 1.0) / 0.5

ann_ois = 0.5 * float(np.sum(D))
K_dual = float(0.5 * np.sum(fwd * D) / ann_ois)

D1 = dfc(t, ois + basis)
K_single = float((1.0 - D1[-1]) / (0.5 * np.sum(D1)))

print(f"forwarding curve sits {1e4*basis:.0f} bp above the discount curve")
print(f"single-curve par rate (forwarding curve used for both) = {100*K_single:.5f}%")
print(f"dual-curve par rate (overnight discounting)            = {100*K_dual:.5f}%")
print(f"difference                                             = {1e4*(K_dual-K_single):+.3f} bp")

print("the PAR rate barely moves: swapping the discount curve is a second-order "
      "effect on a swap that is worth zero")

notional = 1e8
ann_fwd = 0.5 * float(np.sum(D1))
print(f"annuity on the discount curve  {ann_ois:.6f}   on the forwarding curve {ann_fwd:.6f}")
print(f"DV01 of 100m notional differs by {notional*1e-4*(ann_ois-ann_fwd):,.0f} per bp")

K_old = 0.0300
pv_dual = notional * 0.5 * float(np.sum((fwd - K_old) * D))
pv_single = notional * 0.5 * float(np.sum((fwd - K_old) * D1))
print(f"seasoned pay-fixed swap struck at 3.00%: dual-curve PV {pv_dual:,.0f}, "
      f"single-curve PV {pv_single:,.0f}")
print(f"valuation difference on a 100m off-market swap = {pv_dual-pv_single:,.0f}")`,
            output: "forwarding curve sits 12 bp above the discount curve\nsingle-curve par rate (forwarding curve used for both) = 4.71735%\ndual-curve par rate (overnight discounting)            = 4.71782%\ndifference                                             = +0.047 bp\nthe PAR rate barely moves: swapping the discount curve is a second-order effect on a swap that is worth zero\nannuity on the discount curve  7.969183   on the forwarding curve 7.922803\nDV01 of 100m notional differs by 464 per bp\nseasoned pay-fixed swap struck at 3.00%: dual-curve PV 13,689,635, single-curve PV 13,606,237\nvaluation difference on a 100m off-market swap = 83,398" } },

        { name: "Caps, floors and the parity that ties them to the swap",
          explain: `<p>A cap is a strip of European options on a forward rate, one per accrual period,
            each paying the excess of the realised rate over a strike. A floor is the same strip of puts.
            Market convention prices each caplet with Black's formula, treating the forward rate as
            lognormal with a quoted volatility, and discounting with the curve. The quoted instrument is
            the whole strip, and the vol quoted against it is a flat volatility that reproduces the strip
            price, not the volatility of any single caplet.</p>
            <p>The structural fact worth memorising is parity: a cap minus a floor at the same strike and
            schedule is a payer swap at that strike. It follows from the payoff identity that the positive
            part of a difference minus the positive part of its negative is the difference itself, applied
            period by period and discounted. Parity is model-free, so it holds whatever volatility you
            use and whatever the distribution of rates, and it is therefore the first check on any caps
            and floors implementation.</p>
            <p>Parity also pins down at-the-money conventions: a cap and a floor struck at the par swap
            rate have the same price, because the swap they differ by has zero value. Desks care because
            it makes the two products interchangeable for risk purposes and because it is the arbitrage
            that keeps the two vol surfaces consistent; a caps desk that quotes floors off an inconsistent
            surface is quoting a free swap to whoever notices.</p>`,
          formula: "\\text{Cap}(K) - \\text{Floor}(K) = \\sum_i \\tau_i (F_i - K) D(T_i) = \\text{Payer swap}(K)",
          code: { lang: "python", src: `import numpy as np
from math import log, sqrt
from statistics import NormalDist

N = NormalDist().cdf

def black(F, K, vol, T, D, call=True):
    if T <= 0 or vol <= 0 or F <= 0:
        return D * (max(F - K, 0.0) if call else max(K - F, 0.0))
    d1 = (log(F / K) + 0.5 * vol * vol * T) / (vol * sqrt(T))
    d2 = d1 - vol * sqrt(T)
    return D * (F * N(d1) - K * N(d2)) if call else D * (K * N(-d2) - F * N(-d1))

key = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10], dtype=float)
z = np.array([0.0400, 0.0415, 0.0430, 0.0445, 0.0452, 0.0460, 0.0466, 0.0470])
t = np.arange(0.5, 5.0001, 0.5)
D = np.exp(-np.interp(t, key, z) * t)
Dprev = np.concatenate([[1.0], D[:-1]])
fwd = (Dprev / D - 1.0) / 0.5
reset = t - 0.5

vol, notional = 0.28, 1e8
for K in (0.040, 0.046, 0.052):
    cap = sum(notional * 0.5 * black(fwd[i], K, vol, reset[i], D[i], True) for i in range(1, len(t)))
    flr = sum(notional * 0.5 * black(fwd[i], K, vol, reset[i], D[i], False) for i in range(1, len(t)))
    swp = sum(notional * 0.5 * (fwd[i] - K) * D[i] for i in range(1, len(t)))
    print(f"K={100*K:5.2f}%  cap {cap:14,.2f}  floor {flr:14,.2f}  "
          f"cap-floor {cap-flr:14,.2f}  payer swap {swp:14,.2f}  gap {abs(cap-flr-swp):.2e}")

atm = sum(0.5 * fwd[i] * D[i] for i in range(1, len(t))) / sum(0.5 * D[i] for i in range(1, len(t)))
print(f"forward par rate over the cap schedule = {100*atm:.5f}%: at this strike cap and floor "
      f"must be worth the same")`,
            output: "K= 4.00%  cap   4,419,482.92  floor   1,668,459.62  cap-floor   2,751,023.30  payer swap   2,751,023.30  gap 4.66e-10\nK= 4.60%  cap   3,229,315.85  floor   2,839,592.01  cap-floor     389,723.83  payer swap     389,723.83  gap 4.66e-10\nK= 5.20%  cap   2,362,016.39  floor   4,333,592.02  cap-floor  -1,971,575.63  payer swap  -1,971,575.63  gap 2.33e-10\nforward par rate over the cap schedule = 4.69903%: at this strike cap and floor must be worth the same" } },

        { name: "Vasicek: what one factor buys you and what it cannot fit",
          explain: `<p>The course's applied treatment of term-structure models starts with the simplest
            affine one. Vasicek assumes the short rate is an Ornstein-Uhlenbeck process: mean-reverting at
            speed kappa toward a long-run level theta, with constant volatility. Because the model is
            affine, zero-coupon bond prices have a closed form — an exponential of a linear function of
            the short rate — with coefficients that depend only on the parameters and the maturity. The
            whole curve is then a deterministic function of one state variable.</p>
            <p>That is the attraction and also the limitation. With three parameters and one state, the
            model can produce upward-sloping, downward-sloping and modestly humped curves, but it cannot
            fit an observed curve exactly, and the residuals are tens of basis points at the maturities
            that matter. Its long rate is a constant determined by the parameters, so it cannot reprice a
            long end that has moved. It also permits negative rates, which for decades was cited as a
            fatal flaw and is now regarded as a feature.</p>
            <p>The pedagogical value is that it makes three ideas concrete before they are needed
            elsewhere: that a model of the short rate implies a whole curve, that the market price of risk
            is what separates the real-world drift from the pricing drift, and that an equilibrium model
            which does not reprice today's curve cannot be used to price derivatives off it. That last
            point is the entire motivation for the calibrated no-arbitrage models — Ho-Lee, Hull-White,
            interest-rate trees — that the derivatives course takes up.</p>`,
          formula: "P(t,T) = A(t,T)e^{-B(t,T)r_t}, \\quad B = \\frac{1-e^{-\\kappa \\tau}}{\\kappa}, \\quad \\ln A = \\left(\\theta - \\frac{\\sigma^2}{2\\kappa^2}\\right)(B-\\tau) - \\frac{\\sigma^2 B^2}{4\\kappa}",
          code: { lang: "python", src: `import numpy as np

kap, theta, sig, r0 = 0.35, 0.050, 0.010, 0.038

def B(tau):
    return (1.0 - np.exp(-kap * tau)) / kap

def logA(tau):
    b = B(tau)
    return (theta - sig ** 2 / (2 * kap ** 2)) * (b - tau) - sig ** 2 * b ** 2 / (4 * kap)

T = np.array([0.5, 1, 2, 3, 5, 7, 10, 20, 30], dtype=float)
P = np.exp(logA(T) - B(T) * r0)
zv = -np.log(P) / T
mkt = np.array([0.0415, 0.0430, 0.0445, 0.0452, 0.0460, 0.0466, 0.0470, 0.0478, 0.0480])

print("    T   Vasicek   market    error")
for i in range(len(T)):
    print(f" {T[i]:5.1f}   {100*zv[i]:6.3f}%  {100*mkt[i]:6.3f}%   {1e4*(zv[i]-mkt[i]):+7.1f} bp")

print(f"rms fit error across the curve      = {1e4*np.sqrt(np.mean((zv-mkt)**2)):.1f} bp")
print(f"model long rate (tau to infinity)   = {100*(theta - sig**2/(2*kap**2)):.3f}%")
print(f"market 30y                          = {100*mkt[-1]:.3f}%")
print("a three-parameter equilibrium model cannot reprice today's curve, "
      "which is why derivative pricing needs a calibrated no-arbitrage version")`,
            output: "    T   Vasicek   market    error\n   0.5    3.899%   4.150%     -25.1 bp\n   1.0    3.986%   4.300%     -31.4 bp\n   2.0    4.133%   4.450%     -31.7 bp\n   3.0    4.250%   4.520%     -27.0 bp\n   5.0    4.420%   4.600%     -18.0 bp\n   7.0    4.534%   4.660%     -12.6 bp\n  10.0    4.643%   4.700%      -5.7 bp\n  20.0    4.797%   4.780%      +1.7 bp\n  30.0    4.851%   4.800%      +5.1 bp\nrms fit error across the curve      = 20.8 bp\nmodel long rate (tau to infinity)   = 4.959%\nmarket 30y                          = 4.800%\na three-parameter equilibrium model cannot reprice today's curve, which is why derivative pricing needs a calibrated no-arbitrage version" } }
      ],
      widget: [
        { type: "timeline", title: "The life of a ten-year swap, from trade to termination",
          params: { events: [
            { t: 0, label: "Trade date", note: "Par rate agreed; PV is zero, no principal moves." },
            { t: 2, label: "Spot start (T+2)", note: "Accrual begins; the first floating rate fixes." },
            { t: 3, label: "First fixing", note: "The reference rate for period one is observed and locked." },
            { t: 30, label: "Daily collateral", note: "Variation margin flows on the mark; the discount curve is the collateral rate." },
            { t: 183, label: "First payment", note: "Fixed leg pays semiannually, floating quarterly in many markets." },
            { t: 365, label: "First anniversary", note: "The swap has rolled down one year of the curve; carry and roll realise." },
            { t: 1825, label: "Five years in", note: "Remaining annuity halves; DV01 falls roughly with it." },
            { t: 3650, label: "Maturity", note: "Final exchange; no principal, only the last coupon difference." }] } },
        { type: "slider-formula", title: "Par swap rate as one minus the discount factor over the annuity",
          params: { formula: "s(T) = \\frac{1 - e^{-zT}}{A(T)}",
            inputs: [
              { name: "z", label: "Flat zero rate (%)", min: 0.5, max: 9, step: 0.05, init: 4.6 },
              { name: "T", label: "Swap tenor (years)", min: 1, max: 30, step: 1, init: 10 },
              { name: "f", label: "Fixed payments per year", min: 1, max: 4, step: 1, init: 2 }],
            compute: [
              { name: "zz", label: "Zero rate (decimal)", expr: "z/100", fmt: "4" },
              { name: "A", label: "Annuity", expr: "(1-exp(-zz*T))/(f*(exp(zz/f)-1))", fmt: "4" },
              { name: "s", label: "Par swap rate (%)", expr: "100*(1-exp(-zz*T))/A", fmt: "4" }] } }
      ],
      pitfalls: [
        "Valuing a collateralised swap on a single curve. The par rate barely notices, which is what makes the error easy to miss, but seasoned off-market swaps revalue by tens of thousands per hundred million and the reported annuity and DV01 move with the discount curve.",
        "Quoting a cap's flat volatility as if it were the volatility of every caplet in the strip. It is the single number that reprices the whole strip, and the caplet volatilities behind it are not flat.",
        "Reading the par swap rate off a formula without checking the schedule and day-count of the fixed leg. Annual 30/360 and semiannual ACT/360 fixed legs give different par rates on the same curve.",
        "Using an equilibrium short-rate model that does not reprice today's curve to value a derivative. Any mispricing of the underlying curve flows straight into the option price."
      ],
      check: [
        { q: "The par swap rate equals one minus the terminal discount factor divided by the annuity. Which assumption does this shortcut require?",
          options: ["Constant volatility", "The same curve is used to project the floating leg and to discount",
                    "Semiannual payment frequency", "A flat yield curve"],
          answer: 1,
          why: "The telescoping argument that collapses the floating leg to one minus the terminal discount factor works only when each projected forward rate is the same rate used to discount that period, which is the single-curve assumption. Once discounting moves to a collateral curve the sum no longer telescopes and the par rate becomes a discount-weighted average of forwards. Volatility never enters a linear product, and the identity holds at any payment frequency and any curve shape." },
        { q: "A cap and a floor on the same schedule, struck at the forward par swap rate for that schedule, have prices that:",
          options: ["Are equal", "Differ by the annuity", "Differ by the volatility", "Cannot be compared"],
          answer: 0,
          why: "Cap minus floor at a common strike equals a payer swap at that strike, and a swap struck at its own par rate has zero present value. The two option prices must therefore coincide at that strike. The identity is model-free, so no volatility assumption enters and the annuity appears only inside the swap valuation that is zero; the relation is precisely what makes the products comparable rather than incomparable." },
        { q: "The Vasicek model fits the short end of a curve well but misses the thirty-year point by 40bp. The standard fix for pricing derivatives is:",
          options: ["Refit with a larger volatility", "Move to a model with a time-dependent drift calibrated to the observed curve",
                    "Use a different day-count convention", "Add a second state variable with the same equilibrium structure"],
          answer: 1,
          why: "An equilibrium model has too few parameters to reproduce an arbitrary observed curve, so any derivative priced off it inherits a mispriced underlying. The no-arbitrage answer is a time-dependent drift function chosen so that the model reprices today's curve exactly, which is what Ho-Lee and Hull-White do. Raising volatility distorts option prices without fixing the curve, day counts are a basis-point-scale convention issue, and a second equilibrium factor improves the shape but still does not force an exact fit." },
        { q: "Two swaps have identical tenor and notional but one is collateralised in a currency with a higher overnight rate. What differs?",
          options: ["Nothing; the par rate is set by the forward curve alone",
                    "The discount curve, and therefore the par rate and the PV",
                    "Only the credit risk", "Only the day-count convention"],
          answer: 1,
          why: "The collateral agreement determines the rate paid on posted margin, and that rate is the correct discount curve for the swap's cash flows. A different collateral currency therefore means a different discount curve, which changes the discount-weighted average of forwards that defines the par rate and changes the present value of any off-market swap. Collateralisation is what largely removes the credit component, and the day-count convention is a separate contractual choice." }
      ]
    }
  ],

  interview: [
    { q: "What is DV01 and how would you compute it for a bond with an odd first coupon?",
      level: "screen",
      answer: "DV01 is the change in a position's value for a one basis point change in yield, expressed in currency, which is why risk systems store it: it adds across positions. For a clean bullet you can use price times modified duration times one basis point. For an odd first coupon, an amortising schedule or anything with an embedded option, I would not trust a closed form: I bump the yield or the curve down one basis point and up one basis point, reprice with the actual cash flow schedule both times, and take half the difference. The numerical derivative is always defined, it uses the same code path as valuation, and it catches schedule bugs that an analytic formula silently hides." },
    { q: "Explain the difference between Macaulay duration and modified duration, and when the distinction matters.",
      level: "screen",
      answer: "Macaulay duration is the present-value-weighted average time to receipt of the cash flows, measured in years. Modified duration is Macaulay divided by one plus the periodic yield, and it is the percentage price sensitivity per unit of yield. The distinction matters whenever you turn duration into a hedge: at a four and a half per cent semiannual yield the divisor is about 1.0225, so using Macaulay where modified belongs overstates the hedge by a bit over two per cent. On a hundred million of ten-year risk that is real money, and it is the kind of error that shows up as a small persistent bleed rather than as an obvious break." },
    { q: "A client asks why you bootstrap a curve rather than just fitting a smooth function to yields. What do you say?",
      level: "screen",
      answer: "Because the curve has to reprice the instruments it was built from. Bootstrapping is an exact sequential inversion, so every input par rate is recovered to machine precision, and that means a hedge computed off the curve is a hedge in the instruments you can actually trade. A smoothed fit will miss each input by a little, and those misses become phantom relative-value signals and small but systematic hedge errors. Smoothing has its place when inputs are noisy or overlapping, but then you are deliberately choosing to disbelieve some quotes, and that should be a stated decision rather than a side effect of the fitting method." },
    { q: "Your portfolio is DV01-neutral and you still lost money on a day when rates moved. Walk me through the diagnosis.",
      level: "onsite",
      answer: "DV01 neutrality removes exposure to one shape of move only: an equal shift at every tenor. I would pull the key-rate report first and check whether the loss lines up with the shape of the day's move, which it usually does: a steepener will hit a position that is long the belly and short the wings even when the net DV01 is zero. Next I would look at the size of the move, because a large parallel shift leaves a convexity residual between legs with different cash flow dispersion. Then carry and roll, which accrue regardless of the move. If none of those explain it, I start suspecting the curve build or a stale mark rather than the risk." },
    { q: "Why is the first principal component of yield-curve changes almost flat, and what do you do with that fact?",
      level: "onsite",
      answer: "Empirically most of the variance in daily curve changes is common across tenors: rates move together because they share a monetary policy and inflation outlook, so the dominant eigenvector of the covariance matrix has loadings of the same sign and similar size. Typically it explains eighty to ninety per cent of variance, with slope and curvature taking most of the rest. Practically it justifies duration as a first-order risk measure and tells you how much residual risk remains after a duration hedge. It also shapes limits: a book run level-neutral and slope-neutral is taking a deliberate curvature bet, and the factor decomposition is how you size that bet against its historical volatility." },
    { q: "Derive the par swap rate from discount factors and say what breaks under dual-curve discounting.",
      level: "onsite",
      answer: "Under a single curve, receiving the floating rate on a unit notional over the life of the swap has present value one minus the terminal discount factor, because each period's forward payment telescopes against the discount factors. The fixed leg is the rate times the annuity, the accrual-weighted sum of discount factors. Setting them equal gives the par rate as one minus the terminal discount factor over the annuity. Dual-curve discounting breaks the telescoping: forwards come from the projection curve while discounting uses the collateral curve, so the products no longer cancel. The par rate becomes the discount-weighted average of the projected forwards, and the basis between the two curves becomes a separate risk factor." },
    { q: "How do you decide whether a carry-and-roll screen is showing you an opportunity or just showing you risk?",
      level: "onsite",
      answer: "Carry and roll is the return if the curve does not move, so a screen sorted on it ranks positions by how steep the curve is where they sit, which is close to ranking by how much duration and curve risk you are taking. The first thing I do is convert it to a break-even: how many basis points can the relevant rates move against me before the trade loses. Then I compare that break-even to the realised volatility of that part of the curve over the holding period. A trade that earns thirty basis points of carry against a segment that moves forty basis points a month is not carry, it is a short volatility position wearing a carry costume." },
    { q: "The Expectations Hypothesis fails in the data. Does that mean forward rates are useless?",
      level: "onsite",
      answer: "No, it means they are prices rather than forecasts. A forward rate is enforced by static replication: you can lock it in today with a spot trade and financing, so it is the correct break-even for any view about the future spot rate. What the evidence says is that the forward is a biased forecast, systematically above the subsequent realised rate at longer maturities, and that the bias is the term premium and varies over time. That makes forwards more useful, not less: they define the hurdle a forecast has to beat, and the gap between the forward and a reasonable expectation is an estimate of the compensation on offer for bearing duration." },
    { q: "How would you hedge a thirty-year liability with liquid instruments, and what would you still be exposed to?",
      level: "senior",
      answer: "I would compute the liability's partial DV01 vector across standard key rates and solve for weights in the liquid tenors, typically ten and thirty year swaps or futures, that zero the level and slope exposure, adding a third instrument if the curvature exposure is material relative to limits. What remains is real. The long end is where the liquid grid is coarsest, so the residual sits in maturities with no clean hedge; the hedge instruments have different convexity from a long-dated liability, so large moves leave a gap; and if the liability is in one currency and collateral in another, there is a cross-currency basis exposure. I would size and monitor each of those rather than describe the position as hedged." },
    { q: "A junior colleague reports that a new curve build changed the ten-year DV01 of the book by three per cent. How do you investigate?",
      level: "senior",
      answer: "I would bisect. First, does the new curve reprice its own inputs; if not, the build is wrong and nothing else matters. Second, hold the inputs fixed and switch only the interpolation rule, because a change from linear on zeros to linear on log discount factors moves forwards and therefore key-rate risk without moving any quoted price. Third, check whether the key-rate bump shapes changed, since partial DV01s that no longer sum to the parallel bump indicate the extrapolation convention moved. Only after those would I look at the instrument set. Three per cent is exactly the scale of an interpolation or bump-shape change, and almost never the scale of a genuine market move." },
    { q: "What is the term premium, and how would you estimate one?",
      level: "senior",
      answer: "It is the extra expected return for holding a long bond instead of rolling short ones, equivalently the gap between the forward rate and the expected future spot. It is not observable, so any estimate is a model. The two standard families are affine term-structure models estimated on yields with restrictions that separate the expectations component from the risk compensation, and survey-based approaches that take professional forecasts of short rates as the expectations component and treat the residual as premium. I would report both, because they disagree by enough to change a trading conclusion, and I would be explicit that the level of a term premium estimate is far less reliable than its changes." },
    { q: "When would you prefer a swap to a cash bond to express a rates view, and what does that choice cost you?",
      level: "senior",
      answer: "A swap needs no principal, so it expresses duration without funding a balance sheet, and it is available at any tenor rather than only where a bond happens to have been issued. That makes it the default for a pure curve view. The costs are that you take on the collateral and discounting arrangements, so the position is sensitive to the basis between the projection and discount curves; you have no specialness or repo pickup that a cash bond in demand might earn; and you are exposed to swap spread, the difference between swap and government yields, which has its own drivers and can move against you even when your rate view is right." }
  ],

  reappears_in: [
    { code: "FINM 35700", how: "The discount curve, annuity and DV01 built here are the risk-free scaffolding on which the risky discount factor, the CDS premium leg and the credit-spread duration are constructed." },
    { code: "FINM 37500", how: "Caps, floors and the swap curve return as the underlyings for Black's model and for calibrated interest-rate trees; the Vasicek fit failure is exactly the motivation for that course's no-arbitrage models." },
    { code: "FINM 37301", how: "Covered interest parity and cross-currency basis are the same discount-factor arithmetic applied to two curves at once, and FX forwards are the forward rates of week 4 in another market." },
    { code: "FINM 36700", how: "Duration, key-rate exposures and the level-slope-curvature factors slot directly into the factor-model and portfolio-risk machinery as the fixed income block of a multi-asset risk model." },
    { code: "FINM 33150", how: "Carry, roll-down and the Campbell-Shiller evidence are the economic rationale behind rates carry and curve trades, and the break-even framing is how those signals are sized." },
    { code: "FINM 35900", how: "The term premium, breakeven inflation and the Expectations Hypothesis are the asset-pricing side of the macro views that course expresses through rates and inflation markets." }
  ],

  glossary: [
    { term: "Discount factor", def: "The present value of one unit paid at a future date. Convention-free: every quoted rate is a way of reporting it, and curve arithmetic is cleanest done directly in discount factors." },
    { term: "Bootstrapping", def: "Sequentially inverting quoted par instruments into discount factors, shortest first, so that the resulting curve reprices every input exactly." },
    { term: "Zero rate", def: "The single rate that discounts one cash flow at one maturity. Only meaningful once the compounding convention is stated." },
    { term: "Forward rate", def: "The rate for a future period implied by two discount factors and enforced by static replication. A price, not a forecast, unless you assume no term premium." },
    { term: "Clean and dirty price", def: "The quoted price excludes accrued interest; the settled price includes it. Every discounted cash flow model produces the dirty price." },
    { term: "Macaulay duration", def: "The present-value-weighted average time to receipt of a bond's cash flows, in years. Equals maturity for a zero-coupon bond." },
    { term: "Modified duration", def: "Macaulay duration divided by one plus the periodic yield: the percentage price change per unit change in yield." },
    { term: "DV01", def: "The currency change in value for a one basis point move in yield. Additive across a portfolio, which is why risk systems store it." },
    { term: "Convexity", def: "The second derivative of price with respect to yield, scaled by price. Positive for ordinary bonds, so duration overstates losses and understates gains." },
    { term: "Key-rate duration", def: "The sensitivity of a position to a one basis point bump at a single curve tenor with the others held. The partials sum to the parallel DV01 when the bump shapes tile the curve." },
    { term: "Level, slope, curvature", def: "The first three principal components of curve changes, named for their loading shapes. Together they typically explain well over ninety-five per cent of daily variance." },
    { term: "Barbell and bullet", def: "A pair of positions matched on duration but differing in cash flow dispersion. The barbell has more convexity and more exposure to curve shape." },
    { term: "Carry", def: "Coupon income less financing cost over a holding period, independent of any price move." },
    { term: "Roll-down", def: "The price change from an instrument shortening along a static curve. Large where the curve is steep at the position's maturity." },
    { term: "Expectations Hypothesis", def: "The claim that long yields are averages of expected future short yields, so forwards are unbiased forecasts and no maturity earns a systematic excess return." },
    { term: "Term premium", def: "The expected excess return for holding duration; the unobservable wedge between a forward rate and the expected future spot rate." },
    { term: "Breakeven inflation", def: "The nominal minus real yield at a maturity. Expected inflation plus an inflation risk premium minus the liquidity concession on inflation-linked bonds." },
    { term: "Annuity factor", def: "The accrual-weighted sum of discount factors over a payment schedule. The swap's fixed-leg present value per unit of rate, and to first order its DV01 per basis point." },
    { term: "Dual-curve discounting", def: "Projecting floating cash flows off one curve while discounting on the collateral rate curve. Breaks the telescoping shortcut and creates a basis risk factor." },
    { term: "Cap-floor parity", def: "A cap minus a floor at the same strike and schedule equals a payer swap at that strike. Model-free, so it is the first test of any caps implementation." }
  ]
};
