/* courses/finm-33150.js -- FINM 33150, Quantitative Trading Strategies.
   Built from the public course page only. The syllabus is a Box shared link behind a
   university login and was not readable, so the week-by-week arc, the explanations, the
   code, the questions, the interview set and the glossary are this dashboard's own
   reconstruction of a standard graduate treatment of the topics the public description
   names -- not the instructor's material, and not endorsed by anyone.
   Every code `output` is real stdout written by tools/run_snippets.py; do not edit
   those strings by hand. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 33150"] = {
  "code": "FINM 33150",
  "slug": "finm-33150",
  "title": "Quantitative Trading Strategies",
  "instructor": "Brian Boonstra",
  "quarter": "Winter",
  "units": 100,
  "block": "electives",
  "concentrations": [
    "trading"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/trading/finm-33150/",
    "syllabus_url": "https://uchicago.box.com/s/36zjvvwe7a6i2mxhnbw76ca3x6kouab5",
    "fetched": "2026-09-26",
    "note": "The only readable source for this course was the public course page: an official description of about 220 words plus the instructor, the quarter and the units. The syllabus PDF is a Box shared link restricted to a university login, so data/raw/syllabus/ is empty for this course and no syllabus text exists in this corpus. The public description is unusually specific -- it names the asset classes, the strategy families and the regression techniques -- and the ten-week arc below follows that specificity closely, but the week boundaries, the explanations, the code and its output, the pitfalls, the questions, the interview set and the glossary are this dashboard's own reconstruction of a standard graduate treatment of the topics the description names. None of it comes from the instructor, none of it was reviewed by the instructor, and nothing about grading, assignments, required readings, exam format or scheduling should be inferred from it."
  },
  "tier": "B",
  "description": "A survey of the quantitative strategies actually run at trading firms, across equities, futures, credit, FX, interest rates, energy and, to a lesser extent, cryptotokens. The public description centers the course on a small number of strategy families that recur across every one of those asset classes: spread trades, carry trades, and signals built from a parameter's own tendency to revert. It treats most of the underlying models as regressions -- univariate and multivariate, with and without weights, fit by least squares or by other objective functions -- and stresses the practical tricks that make a regression-based signal trustworthy rather than merely fitted. Model prediction and evaluation, including how a result survives contact with the number of things that were tried to get it, is a named focus, as is market making as a strategy family in its own right. The description states that computation is done in R and Python, so the prose below notes the R idiom for a technique alongside Python code wherever the description implies R is in use.",
  "prerequisites": [
    "Ordinary least squares in matrix form -- normal equations, standard errors, R-squared -- at the level of writing it from scratch with numpy, not just calling a library. Every strategy family in this course is presented as a regression, and week 1 assumes that lens is already comfortable.",
    "Enough finance vocabulary about futures, credit and FX to follow terms like cost of carry, basis, roll yield and interest-rate differential without a glossary lookup mid-lecture.",
    "The sampling distribution of a mean and of a Sharpe ratio: standard errors, and why a short backtest is weak evidence. FINM 36700 covers this in depth and this course leans on it from week 1 onward.",
    "Python with numpy and pandas at the level of writing a small backtest loop and aligning two time series without introducing a look-ahead bug.",
    "Basic probability: stationarity, autocorrelation, and what it means for a process to mean-revert. Weeks 2 and 5 are built entirely on this vocabulary."
  ],
  "textbooks": [
    {
      "title": "Algorithmic Trading: Winning Strategies and Their Rationale",
      "author": "Ernest P. Chan",
      "note": "A standard reference for the spread-trade and mean-reversion material of weeks 2, 3 and 5, with a practitioner's emphasis on what actually survives transaction costs."
    },
    {
      "title": "Pairs Trading: Quantitative Methods and Analysis",
      "author": "Ganapathy Vidyamurthy",
      "note": "A standard reference for cointegration, the hedge ratio and the errors-in-variables problem treated in week 2."
    },
    {
      "title": "Expected Returns",
      "author": "Antti Ilmanen",
      "note": "A standard reference for carry as a cross-asset risk premium and its crash risk, the subject of week 4."
    },
    {
      "title": "Advances in Financial Machine Learning",
      "author": "Marcos Lopez de Prado",
      "note": "A standard reference for the deflated Sharpe ratio, backtest overfitting and purged cross-validation covered in weeks 6 and 7."
    },
    {
      "title": "Trading and Exchanges: Market Microstructure for Practitioners",
      "author": "Larry Harris",
      "note": "A standard reference for the market-making material of week 8: inventory, adverse selection and how quotes are actually set."
    },
    {
      "title": "The Science of Algorithmic Trading and Portfolio Management",
      "author": "Robert Kissell",
      "note": "A standard reference for transaction costs, capacity and the practical industry considerations of week 9."
    }
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
  ],
  "brushup": [
    {
      "topic": "OLS as a projection, from the normal equations up",
      "why": "Every strategy in this course is introduced as a regression: a hedge ratio, a carry decomposition and a parameter-reversion signal are all one fitted line. If solving X'X b = X'y by hand feels unfamiliar, weeks 1 through 6 will read as a list of unrelated recipes instead of one idea applied six times.",
      "resource": "Strang, Introduction to Linear Algebra, the chapter on least squares; then solve a 2-variable OLS problem by hand and check it against numpy.linalg.solve."
    },
    {
      "topic": "Stationarity, autocorrelation and the AR(1) process",
      "why": "A spread is only tradeable if it is stationary, and its half-life -- the natural holding period of a reversion trade -- comes straight out of an AR(1) coefficient. Weeks 2 and 5 assume this is already familiar arithmetic, not a new idea.",
      "resource": "Any time-series text's chapter on the AR(1) model; then derive the half-life formula log(0.5)/log(phi) yourself."
    },
    {
      "topic": "The standard error of a Sharpe ratio",
      "why": "Weeks 7 and 10 are about how much to trust an in-sample Sharpe ratio once you account for how many variants were tried and how little data was used. FINM 36700's treatment of Sharpe-ratio inference is the direct prerequisite.",
      "resource": "Lo (2002), 'The Statistics of Sharpe Ratios'; then compute the standard error of a Sharpe of 1.0 estimated from three years of monthly data."
    },
    {
      "topic": "Futures cost of carry and forward pricing",
      "why": "Calendar spreads, FX carry and the crack and spark spreads of week 3 are all the same cost-of-carry relationship applied to a different underlying. Arriving already fluent with F = S e^{(r+u-y)T} saves the whole week from feeling like new material.",
      "resource": "Hull, Options, Futures, and Other Derivatives, the chapter on determination of forward and futures prices."
    },
    {
      "topic": "Weighted least squares and heteroskedasticity",
      "why": "Week 1 and week 6 both size a regression's observations unequally -- by known variance, or by recency. The efficiency gain from weighting only makes sense once ordinary least squares' equal-weighting assumption is visible as a choice, not a default.",
      "resource": "Any econometrics text's chapter on generalised least squares; then compare OLS and WLS standard errors on a heteroskedastic simulated dataset."
    },
    {
      "topic": "pandas and numpy for a walk-forward backtest loop",
      "why": "Nearly every snippet in this course fits a model on one window and evaluates it on a later one. Being fluent enough with array slicing to do this without an off-by-one error is what separates a genuine out-of-sample test from an accidental look-ahead bug.",
      "resource": "The pandas user guide on rolling and expanding windows; then implement a 5-fold walk-forward split on a synthetic time series and verify no test index precedes its own training window."
    },
    {
      "topic": "R's lm() as an alternative to Python's normal equations",
      "why": "The public description names R alongside Python for this course's computation. lm(y ~ x, weights = w) is the R idiom for exactly the weighted regression this course builds from scratch in numpy; recognising the correspondence makes switching between the two trivial.",
      "resource": "Any introductory R text's chapter on lm() and weighted regression; then fit the same weighted regression in R and in numpy and confirm the coefficients match to several decimals."
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "The strategy pipeline as a regression",
      "topics": [
        "univariate and multivariate least squares",
        "weighted least squares",
        "objective functions and the regression view of a strategy",
        "the asset-class taxonomy"
      ],
      "concepts": [
        {
          "name": "A trading signal is a regression coefficient",
          "explain": "<p>Almost every quantitative strategy in this course reduces to the same object: a regression of a future return on a candidate signal. The slope is the position you would take per unit of the signal; its standard error is the only thing separating a real edge from noise; the R-squared tells you how much of the return the signal actually explains, which for a tradable signal is almost always small.</p><p>The snippet fits this by hand from the normal equations, X'X b = X'y, rather than calling a black-box regression function, because every other week of this course reuses exactly this piece of linear algebra. On a synthetic signal with a true slope of 0.35 and unit noise, the fitted slope comes back at 0.349 with a t-statistic of 6.75 -- comfortably significant -- while the R-squared is only 0.084. That gap between a highly significant coefficient and a tiny R-squared is normal for a real signal: a daily-return R-squared of a few per cent is often excellent, because most of a day's return genuinely is unexplained noise.</p><p>A desk cares because this is the single number a research process is trying to produce responsibly: not a backtest chart, not a Sharpe ratio, but a coefficient with a standard error attached to it that survives being estimated again on data the model has never seen.</p>",
          "formula": "\\hat\\beta = (X'X)^{-1}X'y, \\qquad t(\\hat\\beta) = \\frac{\\hat\\beta}{\\operatorname{se}(\\hat\\beta)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious warnings on finite data\n\nrng = np.random.default_rng(1)\nn = 500\nx = rng.normal(0, 1, n)                 # a candidate signal\ntrue_beta, true_alpha = 0.35, 0.0004\nnoise = rng.normal(0, 1.0, n)\ny = true_alpha + true_beta * x + noise  # next-period return\n\nX = np.column_stack([np.ones(n), x])\nbeta_hat = np.linalg.solve(X.T @ X, X.T @ y)   # normal equations\nresid = y - X @ beta_hat\nsigma2 = (resid @ resid) / (n - 2)\ncov_beta = sigma2 * np.linalg.inv(X.T @ X)\nse = np.sqrt(np.diag(cov_beta))\ntstat = beta_hat / se\n\nprint(f\"alpha_hat  {beta_hat[0]:.5f}   se {se[0]:.5f}   t {tstat[0]:.2f}\")\nprint(f\"beta_hat   {beta_hat[1]:.5f}   se {se[1]:.5f}   t {tstat[1]:.2f}\")\nprint(f\"R^2        {1 - resid @ resid / np.sum((y - y.mean())**2):.4f}\")\nprint(\"a strategy signal is a regression: the slope is the position per unit of x,\")\nprint(\"the t-stat on the slope is the only thing standing between a signal and noise\")\n",
            "output": "alpha_hat  -0.07239   se 0.04727   t -1.53\nbeta_hat   0.34948   se 0.05174   t 6.75\nR^2        0.0839\na strategy signal is a regression: the slope is the position per unit of x,\nthe t-stat on the slope is the only thing standing between a signal and noise"
          }
        },
        {
          "name": "Multivariate regression controls for what univariate cannot",
          "explain": "<p>A second signal that is correlated with a real one but has no true effect of its own will still look significant in a univariate regression, because it is borrowing the real signal's explanatory power. Only a multivariate regression, which controls for both signals at once, correctly assigns the credit.</p><p>The snippet builds exactly this trap: z2 is correlated with the genuinely predictive z1 but has a true coefficient of zero. Regressed alone against the outcome, z2's univariate slope comes back at 0.133 with an R-squared of 0.023 -- it looks like a real, if modest, signal. Regressed alongside z1, its coefficient collapses to 0.017, essentially zero, while z1's own coefficient barely moves, from 0.290 to 0.281. The multivariate regression is not a refinement of the univariate one; it is the only one asking the right question, which is 'what does z2 add once z1 is already accounted for'.</p><p>This is the single most common source of a spuriously significant signal in strategy research: a new candidate that correlates with a known driver of returns will look predictive in isolation no matter how useless it is, and a desk that skips the multivariate check will keep discovering the same signal with a new name every quarter.</p>",
          "formula": "\\hat\\beta_{multi} = (X'X)^{-1}X'y, \\quad X = [\\mathbf 1, z_1, z_2]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(2)\nn = 800\nz1 = rng.normal(0, 1, n)                    # a real, priced factor\nz2 = 0.6 * z1 + rng.normal(0, 1, n)          # a second signal, correlated with z1\ny = 0.0 + 0.30 * z1 + 0.00 * z2 + rng.normal(0, 1, n)   # z2 has NO true effect\n\ndef ols(X, y):\n    X = np.column_stack([np.ones(len(y)), X])\n    b = np.linalg.solve(X.T @ X, X.T @ y)\n    resid = y - X @ b\n    return b, resid\n\nb_uni, r_uni = ols(z1, y)\nb_multi, r_multi = ols(np.column_stack([z1, z2]), y)\n\nr2_uni = 1 - r_uni @ r_uni / np.sum((y - y.mean())**2)\nr2_multi = 1 - r_multi @ r_multi / np.sum((y - y.mean())**2)\n\nprint(f\"univariate on z1 alone      : beta_z1 = {b_uni[1]:.4f}   R^2 = {r2_uni:.4f}\")\nprint(f\"multivariate on z1 and z2   : beta_z1 = {b_multi[1]:.4f}  beta_z2 = {b_multi[2]:.4f}  R^2 = {r2_multi:.4f}\")\nprint(\"z2 carries zero true effect but is correlated with z1;\")\nprint(\"its multivariate coefficient still lands near zero because the regression controls for z1,\")\nprint(\"while a second UNIVARIATE regression of y on z2 alone would show a spuriously significant slope\")\nz2_uni_b, z2_uni_r = ols(z2, y)\nr2_z2 = 1 - z2_uni_r @ z2_uni_r / np.sum((y - y.mean())**2)\nprint(f\"univariate on z2 alone      : beta_z2 = {z2_uni_b[1]:.4f}   R^2 = {r2_z2:.4f}  (looks real, is not)\")\n",
            "output": "univariate on z1 alone      : beta_z1 = 0.2902   R^2 = 0.0830\nmultivariate on z1 and z2   : beta_z1 = 0.2808  beta_z2 = 0.0172  R^2 = 0.0833\nz2 carries zero true effect but is correlated with z1;\nits multivariate coefficient still lands near zero because the regression controls for z1,\nwhile a second UNIVARIATE regression of y on z2 alone would show a spuriously significant slope\nunivariate on z2 alone      : beta_z2 = 0.1329   R^2 = 0.0231  (looks real, is not)"
          }
        },
        {
          "name": "Weighted least squares uses what you know about the noise",
          "explain": "<p>Ordinary least squares implicitly assumes every observation is equally informative. When the variance of the error is known, or can be estimated, to differ across observations -- larger signals arriving with more noise, say -- weighting each observation by the inverse of its variance is more efficient: the same data yields a lower-variance estimate of the coefficient you actually care about.</p><p>The snippet constructs a case where the noise scales with the size of the signal itself and compares OLS and WLS refit two thousand times on fresh samples. OLS's slope estimate has a standard deviation of 0.101 across refits; WLS's has a standard deviation of 0.074, an efficiency gain of 1.87 times the variance. The point estimates on any single sample differ too -- 0.589 for OLS against 0.547 for WLS in the snippet's one draw -- because OLS is letting the noisiest, largest-signal observations dominate the fit exactly where they should be trusted least.</p><p>A desk cares because weighting is nearly free once you know or can estimate the variance structure, and ignoring it throws away real precision on every single fit, which compounds over a research process that refits its models constantly.</p>",
          "formula": "\\hat\\beta_{WLS} = (X'WX)^{-1}X'Wy, \\qquad W = \\operatorname{diag}(1/\\sigma_i^2)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(3)\nn = 1000\nx = rng.normal(0, 1, n)\n# variance grows with |x|: later/larger-signal observations are noisier\nsigma_i = 0.4 + 1.6 * np.abs(x)\ny = 0.5 * x + rng.normal(0, 1, n) * sigma_i\n\nX = np.column_stack([np.ones(n), x])\n\ndef fit(X, y, w=None):\n    if w is None:\n        b = np.linalg.solve(X.T @ X, X.T @ y)\n    else:\n        W = np.diag(w)\n        b = np.linalg.solve(X.T @ W @ X, X.T @ W @ y)\n    return b\n\nb_ols = fit(X, y)\nw = 1.0 / sigma_i**2          # inverse-variance weights (known here; estimated in practice)\nb_wls = fit(X, y, w)\n\ntrials = 2000\nols_slopes, wls_slopes = [], []\nfor _ in range(trials):\n    xx = rng.normal(0, 1, n)\n    sig = 0.4 + 1.6 * np.abs(xx)\n    yy = 0.5 * xx + rng.normal(0, 1, n) * sig\n    XX = np.column_stack([np.ones(n), xx])\n    ols_slopes.append(fit(XX, yy)[1])\n    wls_slopes.append(fit(XX, yy, 1.0 / sig**2)[1])\n\nprint(f\"OLS slope on one sample     {b_ols[1]:.4f}\")\nprint(f\"WLS slope on one sample     {b_wls[1]:.4f}\")\nprint(f\"OLS slope sd over {trials} refits   {np.std(ols_slopes):.4f}\")\nprint(f\"WLS slope sd over {trials} refits   {np.std(wls_slopes):.4f}\")\nprint(f\"WLS efficiency gain (var ratio)   {np.var(ols_slopes) / np.var(wls_slopes):.2f}x\")\n",
            "output": "OLS slope on one sample     0.5891\nWLS slope on one sample     0.5474\nOLS slope sd over 2000 refits   0.1009\nWLS slope sd over 2000 refits   0.0739\nWLS efficiency gain (var ratio)   1.87x"
          }
        },
        {
          "name": "Seven asset classes, one recurring taxonomy",
          "explain": "<p>The strategies in this course recur across equities, futures, credit, FX, rates, energy and cryptotokens, and it helps to see the pattern once before working through each asset class separately. In every one, there is a typical signal family, a typical spread trade built from two related instruments, and a typical carry mechanism that rewards holding a position even if nothing else happens.</p><p>Futures roll from cost of carry; FX carry comes from the interest-rate differential; credit carry is the spread itself; energy has both a storage-driven carry and physical spread trades -- the crack spread and the spark spread -- built from the fixed ratios a refinery or a power plant actually uses; cryptotokens have a perpetual's funding rate playing the same role a futures roll plays elsewhere. The mechanisms differ in their institutional detail but not in their mathematical shape: a regression of a return on a mispricing measure, a spread built from a hedge ratio, and a carry component that is close to deterministic given today's prices.</p><p>A desk cares because a researcher who has internalised this taxonomy can walk into an unfamiliar asset class and know within five minutes what the spread trade probably looks like and where the carry is probably hiding, rather than starting from nothing.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\ntaxonomy = [\n    (\"Equities\",     \"cross-sectional factor / stat-arb\",  \"pairs and sector spreads\",     \"dividend & buyback yield\"),\n    (\"Futures\",      \"term-structure momentum\",             \"calendar spreads\",             \"roll yield / cost of carry\"),\n    (\"Credit\",       \"spread mean-reversion\",                \"bond-CDS basis\",                \"credit spread carry\"),\n    (\"FX\",           \"rate-differential carry\",             \"cross-currency basis\",         \"interest-rate differential\"),\n    (\"Rates\",        \"curve steepener/flattener\",           \"butterfly spreads\",            \"roll-down on the curve\"),\n    (\"Energy\",       \"storage / seasonal reversion\",         \"crack and spark spreads\",      \"convenience yield\"),\n    (\"Cryptotokens\", \"funding-rate mean-reversion\",          \"spot-perpetual basis\",         \"perpetual funding rate\"),\n]\nw1, w2, w3, w4 = 12, 28, 24, 26\nprint(f\"{'asset class':<{w1}}{'typical signal':<{w2}}{'typical spread trade':<{w3}}{'carry source':<{w4}}\")\nfor row in taxonomy:\n    print(f\"{row[0]:<{w1}}{row[1]:<{w2}}{row[2]:<{w3}}{row[3]:<{w4}}\")\nprint(f\"\\n{len(taxonomy)} asset classes, each with its own spread and carry mechanism,\")\nprint(\"but every one of them is read off a regression of a return on a mispricing measure\")\n",
            "output": "asset class typical signal              typical spread trade    carry source\nEquities    cross-sectional factor / stat-arbpairs and sector spreadsdividend & buyback yield\nFutures     term-structure momentum     calendar spreads        roll yield / cost of carry\nCredit      spread mean-reversion       bond-CDS basis          credit spread carry\nFX          rate-differential carry     cross-currency basis    interest-rate differential\nRates       curve steepener/flattener   butterfly spreads       roll-down on the curve\nEnergy      storage / seasonal reversioncrack and spark spreads convenience yield\nCryptotokensfunding-rate mean-reversion spot-perpetual basis    perpetual funding rate\n\n7 asset classes, each with its own spread and carry mechanism,\nbut every one of them is read off a regression of a return on a mispricing measure"
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "Ten weeks, one asset class at a time",
        "params": {
          "events": [
            {
              "t": 1,
              "label": "The regression toolkit",
              "note": "Univariate, multivariate, weighted."
            },
            {
              "t": 2,
              "label": "Spread trades I",
              "note": "The hedge ratio, OLS vs total least squares."
            },
            {
              "t": 4,
              "label": "Carry trades",
              "note": "Decomposing carry from spot, across asset classes."
            },
            {
              "t": 5,
              "label": "Parameter reversion",
              "note": "Signals on a model's own drifting parameters."
            },
            {
              "t": 7,
              "label": "Model evaluation",
              "note": "Deflating a Sharpe ratio for the search that found it."
            },
            {
              "t": 8,
              "label": "Market making",
              "note": "Inventory, adverse selection, quoting."
            },
            {
              "t": 10,
              "label": "Validating a model",
              "note": "The checklist before capital is committed."
            }
          ]
        }
      },
      "pitfalls": [
        "Reporting a univariate regression's significance for a candidate signal without checking whether it survives once known drivers of the same return are added as controls.",
        "Treating a small R-squared as evidence a signal is not tradable; daily-return R-squareds of a few per cent are normal for real, profitable signals.",
        "Ignoring known heteroskedasticity because OLS 'still works' -- it is still unbiased, but it is leaving real precision on the table for free."
      ],
      "check": [
        {
          "q": "A regression of daily returns on a candidate signal has R-squared 0.008 but a t-statistic on the slope of 4.1. The right conclusion is:",
          "options": [
            "The signal is useless because R-squared is near zero",
            "The signal may well be tradable; a tiny R-squared is normal for a real daily signal",
            "The regression must have a coding error",
            "R-squared and the t-statistic cannot both be extreme like this"
          ],
          "answer": 1,
          "why": "Daily returns are dominated by noise, so even a strong, real, profitable signal typically explains only a small fraction of the variance. The t-statistic, not R-squared, is what tells you the coefficient is unlikely to be zero."
        },
        {
          "q": "z2 is correlated with a real signal z1 but has zero true effect on the outcome. Regressed on its own against the outcome, z2's coefficient will typically:",
          "options": [
            "Come back exactly zero",
            "Look spuriously significant, borrowing z1's explanatory power",
            "Be identical to z1's own coefficient",
            "Have no defined standard error"
          ],
          "answer": 1,
          "why": "Omitting z1 from the regression means z2's coefficient absorbs some of z1's true effect through their correlation. Only controlling for z1 in a multivariate regression correctly assigns z2 a coefficient near zero."
        },
        {
          "q": "Observations with known, unequal error variance are fit by OLS instead of WLS. Compared to WLS, the OLS coefficient estimate is:",
          "options": [
            "Biased",
            "Unbiased but less efficient (higher variance) than WLS",
            "More efficient than WLS",
            "Undefined"
          ],
          "answer": 1,
          "why": "OLS remains unbiased under heteroskedasticity, but it is no longer the minimum-variance unbiased estimator. Weighting by the inverse variance recovers that efficiency, as the snippet's 1.87x variance reduction shows."
        }
      ]
    },
    {
      "n": 2,
      "title": "Spread trades I: the hedge ratio and cointegration",
      "topics": [
        "the hedge ratio as a regression coefficient",
        "OLS vs total least squares",
        "testing for stationarity",
        "the half-life of mean reversion"
      ],
      "concepts": [
        {
          "name": "A spread is a regression residual",
          "explain": "<p>The simplest spread trade is two instruments that share a common driver: hold one, short a multiple of the other, and what is left over is the residual of a regression of one on the other. That residual is the spread, and the regression's slope is the hedge ratio.</p><p>The snippet builds two series that both move with a shared random walk, fits the OLS hedge ratio, and checks what is left. The fitted hedge ratio comes back at 1.6025 against a construction that used 1.6, and the residual spread has essentially zero correlation with the hedging instrument -- the printed correlation is -0.0000. That is the whole point of the hedge: after subtracting beta times the hedging leg, none of the common factor should remain in what you are left holding.</p><p>A desk cares because the hedge ratio is not a modelling nicety, it is the entire risk-reduction mechanism of the trade. Get it wrong and the 'spread' still carries the common-factor risk you thought you had removed, which shows up as an unpleasant correlation with the broad market on exactly the day you did not want it.</p>",
          "formula": "\\text{spread}_t = b_t - \\hat\\beta\\, a_t - \\hat\\alpha, \\qquad \\hat\\beta = \\frac{\\operatorname{Cov}(a,b)}{\\operatorname{Var}(a)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(21)\nn = 600\ncommon = np.cumsum(rng.normal(0, 1, n))          # shared random walk\na = common + rng.normal(0, 0.5, n)\nb = 1.6 * common + rng.normal(0, 0.5, n)          # b moves 1.6x with the common factor\n\nX = np.column_stack([np.ones(n), a])\nbeta = np.linalg.solve(X.T @ X, X.T @ b)\nspread = b - beta[1] * a - beta[0]\n\nprint(f\"OLS hedge ratio (b on a)   {beta[1]:.4f}   intercept {beta[0]:.4f}\")\nprint(f\"spread mean   {spread.mean():.4f}   spread sd   {spread.std():.4f}\")\nprint(f\"corr(a, spread)   {np.corrcoef(a, spread)[0,1]:.4f}   (near 0: the hedge removed the common factor)\")\n",
            "output": "OLS hedge ratio (b on a)   1.6025   intercept 0.0105\nspread mean   0.0000   spread sd   0.9164\ncorr(a, spread)   -0.0000   (near 0: the hedge removed the common factor)"
          }
        },
        {
          "name": "OLS and total least squares answer different questions about noisy legs",
          "explain": "<p>Ordinary least squares minimises the vertical distance between the fitted line and each point, which implicitly assumes the regressor is measured without error. When BOTH legs of a spread carry their own measurement noise -- as almost every real pair does -- that assumption is false, and OLS's hedge ratio is biased toward zero.</p><p>Total least squares instead minimises the orthogonal distance to the line, which is the correct thing to do when both variables are noisy; it is computed as the first principal component of the centred data, via the SVD. The snippet constructs two legs with equal-sized measurement noise and a true hedge ratio of 1.6. On five hundred simulated refits, OLS's average bias is -0.0104 -- systematically too small -- while TLS's average bias is +0.0000, and on the single displayed sample OLS's error is 0.0148 against TLS's 0.0019, nearly an order of magnitude smaller.</p><p>A desk cares because a hedge ratio biased toward zero under-hedges the position: the trade looks like it removed the common factor, exactly as in the previous concept, but a small amount of it is still there, and it accumulates as a persistent, hard-to-notice source of tracking error across a whole book of spread trades.</p>",
          "formula": "\\text{TLS: minimise } \\sum_i d_i^2 \\text{ (orthogonal distance)}, \\text{ vs OLS: minimise } \\sum_i (y_i - \\hat y_i)^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(22)\nn = 400\ncommon = np.cumsum(rng.normal(0, 1, n))\nnoise_a, noise_b = rng.normal(0, 0.5, n), rng.normal(0, 0.5, n)\na = common + noise_a\nb = 1.6 * common + noise_b     # true hedge ratio is 1.6, and BOTH legs have measurement noise\n\ndef ols_hedge(a, b):\n    X = np.column_stack([np.ones(n), a])\n    beta = np.linalg.solve(X.T @ X, X.T @ b)\n    return beta[1]\n\ndef tls_hedge(a, b):\n    # total least squares: minimise ORTHOGONAL distance, not vertical distance.\n    # equivalent to the first principal component of the centred (a, b) cloud.\n    A = np.column_stack([a - a.mean(), b - b.mean()])\n    _, _, Vt = np.linalg.svd(A, full_matrices=False)\n    v = Vt[0]                       # first right-singular vector = direction of max variance\n    slope = v[1] / v[0]             # rise over run along that direction\n    return slope\n\nols_slope = ols_hedge(a, b)\ntls_slope = tls_hedge(a, b)\nprint(f\"true hedge ratio               1.6000\")\nprint(f\"OLS hedge ratio (b regressed on noisy a)   {ols_slope:.4f}\")\nprint(f\"TLS hedge ratio (errors-in-variables aware) {tls_slope:.4f}\")\nprint(f\"OLS error   {abs(ols_slope - 1.6):.4f}    TLS error   {abs(tls_slope - 1.6):.4f}\")\n\ntrials, ols_err, tls_err = 500, [], []\nfor _ in range(trials):\n    c = np.cumsum(rng.normal(0, 1, n))\n    aa = c + rng.normal(0, 0.5, n)\n    bb = 1.6 * c + rng.normal(0, 0.5, n)\n    ols_err.append(ols_hedge(aa, bb) - 1.6)\n    tls_err.append(tls_hedge(aa, bb) - 1.6)\nprint(f\"mean OLS bias over {trials} refits   {np.mean(ols_err):+.4f}\")\nprint(f\"mean TLS bias over {trials} refits   {np.mean(tls_err):+.4f}\")\n",
            "output": "true hedge ratio               1.6000\nOLS hedge ratio (b regressed on noisy a)   1.5852\nTLS hedge ratio (errors-in-variables aware) 1.5981\nOLS error   0.0148    TLS error   0.0019\nmean OLS bias over 500 refits   -0.0104\nmean TLS bias over 500 refits   +0.0000"
          }
        },
        {
          "name": "A spread must actually be stationary to be traded as one",
          "explain": "<p>A hedge ratio computed from a regression will always produce SOME residual series, but that residual is only a mean-reverting spread if it is stationary. If it is not -- if it is really a random walk with a resemblance to mean reversion over the fitted window -- a strategy built on it is trading noise with real capital.</p><p>The augmented Dickey-Fuller test formalises this: its null hypothesis is that the series has a unit root, i.e. is a random walk, and rejecting the null at conventional significance is the standard bar for calling a spread tradeable. The snippet runs the test on a genuinely mean-reverting AR(1) spread and on a pure random walk built to superficially resemble one. The stationary spread gives an ADF statistic of -4.362 and a p-value of 0.0003, comfortably rejecting the unit root; the random-walk spread gives -2.207 and a p-value of 0.2037, failing to reject.</p><p>A desk cares because a bad hedge ratio, or a pair that only looked cointegrated in the fitting window, produces exactly this second case: a spread that drifts rather than reverts, and an ADF test -- not eyeballing a chart -- is the standard first check before sizing a spread trade.</p>",
          "formula": "H_0: \\text{unit root (non-stationary)}, \\quad \\text{reject if } p < 0.05",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\nimport warnings\nwarnings.filterwarnings(\"ignore\")   # silence statsmodels' adfuller return-shape FutureWarning\nfrom statsmodels.tsa.stattools import adfuller\n\nrng = np.random.default_rng(23)\nn = 300\n\n# a genuinely mean-reverting spread (AR(1) with phi < 1)\nphi, mu, sig = 0.90, 0.0, 1.0\nspread_stationary = np.zeros(n)\nfor t in range(1, n):\n    spread_stationary[t] = mu + phi * (spread_stationary[t-1] - mu) + rng.normal(0, sig)\n\n# a random-walk \"spread\" that only looks like one (badly hedged pair)\nspread_walk = np.cumsum(rng.normal(0, sig, n))\n\nadf_stat_1, p_1, *_ = adfuller(spread_stationary, maxlag=1, autolag=None)\nadf_stat_2, p_2, *_ = adfuller(spread_walk, maxlag=1, autolag=None)\n\nprint(f\"mean-reverting spread:  ADF stat {adf_stat_1:7.3f}   p-value {p_1:.4f}   -> reject unit root: {p_1 < 0.05}\")\nprint(f\"random-walk 'spread':   ADF stat {adf_stat_2:7.3f}   p-value {p_2:.4f}   -> reject unit root: {p_2 < 0.05}\")\nprint(\"only the first spread is safe to trade as mean-reverting; the second is a random walk\")\nprint(\"that a bad hedge ratio can manufacture out of two genuinely cointegrated series\")\n",
            "output": "mean-reverting spread:  ADF stat  -4.362   p-value 0.0003   -> reject unit root: True\nrandom-walk 'spread':   ADF stat  -2.207   p-value 0.2037   -> reject unit root: False\nonly the first spread is safe to trade as mean-reverting; the second is a random walk\nthat a bad hedge ratio can manufacture out of two genuinely cointegrated series"
          }
        },
        {
          "name": "Half-life sets the trade's natural holding period",
          "explain": "<p>Once a spread is confirmed stationary, the speed of its reversion matters as much as the fact of it. An AR(1) fit of the spread on its own lag gives a persistence parameter phi, and the half-life -- the time for a shock to decay by half -- is log(0.5) divided by log(phi).</p><p>The snippet simulates a spread with a true phi of 0.92, corresponding to a true half-life of 8.31 periods, and estimates phi from the data by an AR(1) regression. The estimated phi comes back at 0.939, giving an estimated half-life of 10.99 periods -- close to, but visibly larger than, the truth, because phi near 1 is estimated with a persistent upward bias in finite samples.</p><p>A desk cares because the half-life is the trade's natural clock: a position held for far longer than the half-life is mostly earning or losing money on financing and market drift rather than on the reversion itself, and one closed out well before the half-life never gives the reversion time to happen. Sizing the expected holding period against the half-life, not against a fixed number of days, is what keeps a mean-reversion book trading the effect it was built to trade.</p>",
          "formula": "\\text{half-life} = \\frac{\\ln(0.5)}{\\ln(\\hat\\phi)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(24)\nn = 400\nphi_true = 0.92\nspread = np.zeros(n)\nfor t in range(1, n):\n    spread[t] = phi_true * spread[t-1] + rng.normal(0, 1)\n\n# estimate phi by regressing spread[t] on spread[t-1] (an AR(1) fit)\ny, x = spread[1:], spread[:-1]\nX = np.column_stack([np.ones(len(x)), x])\nb = np.linalg.solve(X.T @ X, X.T @ y)\nphi_hat = b[1]\nhalflife = np.log(0.5) / np.log(phi_hat)\n\nprint(f\"true phi            {phi_true:.4f}\")\nprint(f\"estimated phi       {phi_hat:.4f}\")\nprint(f\"true half-life      {np.log(0.5)/np.log(phi_true):.2f} periods\")\nprint(f\"estimated half-life {halflife:.2f} periods\")\nprint(\"half-life sets the natural holding period: a signal held much longer than this\")\nprint(\"is mostly financing risk, and one closed out much sooner never captures the reversion\")\n",
            "output": "true phi            0.9200\nestimated phi       0.9389\ntrue half-life      8.31 periods\nestimated half-life 10.99 periods\nhalf-life sets the natural holding period: a signal held much longer than this\nis mostly financing risk, and one closed out much sooner never captures the reversion"
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "A hedge ratio, and what one contaminated leg does to it",
        "params": {
          "n": 150,
          "beta": 1.6,
          "noise": 1.5,
          "seed": 220,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Computing a hedge ratio by OLS when both legs are noisy, and not recognising the resulting under-hedge as bias rather than sampling noise.",
        "Skipping the ADF test (or an equivalent) and trusting that a residual 'looks' mean-reverting on a chart of the fitting window.",
        "Sizing a reversion trade's holding period by habit rather than by the half-life the data actually implies."
      ],
      "check": [
        {
          "q": "Both legs of a pair carry their own measurement noise. Compared to total least squares, the OLS hedge ratio will tend to be:",
          "options": [
            "Identical in expectation",
            "Biased toward zero (attenuated)",
            "Biased away from zero",
            "Unbiased but with a larger variance"
          ],
          "answer": 1,
          "why": "OLS assumes the regressor is measured without error; when it is not, the errors-in-variables problem attenuates the slope toward zero. TLS, which minimises orthogonal rather than vertical distance, removes most of this bias."
        },
        {
          "q": "An ADF test on a candidate spread gives a p-value of 0.20. The correct interpretation is:",
          "options": [
            "The spread is confirmed stationary",
            "The test fails to reject a unit root; treat the spread as possibly a random walk",
            "The hedge ratio must be recomputed",
            "The spread's half-life is 0.20 periods"
          ],
          "answer": 1,
          "why": "A p-value of 0.20 does not clear the conventional 0.05 bar for rejecting the null of a unit root, so there is no statistical basis to call the spread stationary. Trading it as mean-reverting would be trading an unconfirmed hypothesis."
        },
        {
          "q": "A spread's estimated half-life is 11 trading days. Holding the resulting position for 90 days is mainly:",
          "options": [
            "The correct way to let the reversion fully play out",
            "Mostly exposure to financing and drift, well past the reversion's natural clock",
            "Irrelevant, since half-life does not bound holding period",
            "Only a problem if the spread is not stationary"
          ],
          "answer": 1,
          "why": "After roughly eight half-lives the reversion has essentially completed; holding on regardless just adds unrelated market and financing risk without adding to the trade's original thesis."
        }
      ]
    },
    {
      "n": 3,
      "title": "Spread trades II: futures, credit, energy and the physical spreads",
      "topics": [
        "calendar spreads and the futures curve",
        "the credit basis",
        "crack and spark spreads",
        "hedging a spread's residual factor exposure"
      ],
      "concepts": [
        {
          "name": "A calendar spread is the curve's cost of carry, contract by contract",
          "explain": "<p>A futures curve prices in financing cost, storage cost and convenience yield at every maturity, and a calendar spread -- long one maturity, short another -- is a bet on how that net carry rate changes shape along the curve, not a bet on the level of the underlying.</p><p>The snippet builds a curve where the convenience yield shrinks from 6% at one month to 1% at twelve months, holding financing and storage fixed, and prices the resulting calendar spreads and annualised roll at each pair of adjacent maturities. The curve steepens from a 0.250 spread between the one- and three-month contracts to a 2.082 spread between the nine- and twelve-month contracts, and the annualised roll implied by each leg grows more negative moving out the curve, from -1.50% to -7.92%.</p><p>A desk cares because the convenience yield -- how much the market pays for physical access to the commodity right now -- is exactly the thing that is hardest to observe directly and easiest to infer from the shape of the curve, and a calendar spread trader is really trading a view on how that yield will evolve.</p>",
          "formula": "F(T) = S_0\\, e^{(r + u - y)T}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\n# a simple cost-of-carry futures curve: F(T) = S0 * exp((r + storage - convenience) * T)\nS0, r, storage = 100.0, 0.04, 0.02\nmaturities = np.array([1/12, 3/12, 6/12, 9/12, 12/12])\nconvenience = np.array([0.06, 0.05, 0.03, 0.02, 0.01])   # falls as contango builds further out\n\ncurve = S0 * np.exp((r + storage - convenience) * maturities)\ncalendar_spread = np.diff(curve)          # far-leg minus near-leg, contract by contract\nannualized_roll = (curve[:-1] / curve[1:] - 1) / np.diff(maturities)\n\nprint(\"maturity(mo)  price     calendar spread   annualised roll\")\nfor i in range(len(maturities)):\n    sp = f\"{calendar_spread[i-1]:8.3f}\" if i > 0 else \"     -  \"\n    ar = f\"{annualized_roll[i-1]:8.4f}\" if i > 0 else \"     -  \"\n    print(f\"{maturities[i]*12:10.0f}  {curve[i]:8.3f}   {sp}         {ar}\")\nprint(f\"\\nnet convenience yield fell from {convenience[0]:.2%} to {convenience[-1]:.2%};\")\nprint(\"a shrinking convenience yield is exactly what steepens a contango curve further out\")\n",
            "output": "maturity(mo)  price     calendar spread   annualised roll\n         1   100.000        -                -\n         3   100.250      0.250          -0.0150\n         6   101.511      1.261          -0.0497\n         9   103.045      1.534          -0.0596\n        12   105.127      2.082          -0.0792\n\nnet convenience yield fell from 6.00% to 1.00%;\na shrinking convenience yield is exactly what steepens a contango curve further out"
          }
        },
        {
          "name": "The credit basis trades the same risk in two instruments",
          "explain": "<p>A bond and a credit default swap on the same issuer both price the same default risk, and in a frictionless market their spreads would be identical. The basis -- the CDS-implied spread minus the bond-implied spread -- captures everything that keeps them from being identical: funding costs, repo specialness, and technical supply and demand in each instrument separately.</p><p>The snippet builds both spreads as the same common credit factor plus instrument-specific noise, with the bond trading structurally 20 basis points rich to the CDS. The mean basis comes back at -0.2025 percentage points, close to that construction, and regressing the basis on the credit factor gives a coefficient of only -0.0058 -- essentially zero, meaning the basis has been factor-hedged out. What remains, a residual standard deviation of 0.0745, is the genuinely tradeable part.</p><p>A desk cares because a basis trade -- long the cheap instrument, short the rich one, in equal credit-risk size -- is explicitly not a directional credit bet; its entire P&amp;L should come from the residual, and if the regression shows the basis still has meaningful exposure to the credit factor, the position is not yet properly hedged.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(31)\nn = 500\n# credit basis: CDS-implied spread minus bond-implied spread, driven by a common credit factor\n# plus basis-specific noise from funding/repo frictions\ncredit_factor = np.cumsum(rng.normal(0, 0.02, n))\ncds_spread = 1.50 + credit_factor + rng.normal(0, 0.05, n)\nbond_spread = 1.50 + credit_factor + rng.normal(0, 0.05, n) + 0.20   # bond trades 20bp rich to CDS on average\n\nbasis = cds_spread - bond_spread     # negative basis: CDS cheap relative to bond risk\nX = np.column_stack([np.ones(n), credit_factor])\nbeta = np.linalg.solve(X.T @ X, X.T @ basis)\nresid = basis - X @ beta\n\nprint(f\"mean basis (CDS - bond spread)   {basis.mean():.4f}  (in percentage points)\")\nprint(f\"basis exposure to the credit factor   {beta[1]:.4f}  (near 0 if the basis is factor-hedged)\")\nprint(f\"basis residual sd (the tradable part)   {resid.std():.4f}\")\nprint(\"a basis trade is long/short the SAME credit risk in two instruments,\")\nprint(\"so the position's residual, not its level, is what a desk actually prices to trade\")\n",
            "output": "mean basis (CDS - bond spread)   -0.2025  (in percentage points)\nbasis exposure to the credit factor   -0.0058  (near 0 if the basis is factor-hedged)\nbasis residual sd (the tradable part)   0.0745\na basis trade is long/short the SAME credit risk in two instruments,\nso the position's residual, not its level, is what a desk actually prices to trade"
          }
        },
        {
          "name": "Crack and spark spreads are refining and generation margins",
          "explain": "<p>A crack spread and a spark spread are both physical spread trades built from a fixed conversion ratio: a refinery buys crude and sells gasoline and heating oil in roughly a 3:2:1 ratio, and a power plant buys gas and sells electricity at its own heat rate. Trading the spread means trading the margin, long the finished product and short the input, in exactly the ratio the physical process uses.</p><p>The snippet builds a year of simulated prices with gasoline and heating oil each tracking crude closely (coefficients of 1.15 and 1.05) plus their own demand noise, and gas tracking a separate path with power priced off it at a heat rate of 7.5. The resulting 3:2:1 crack spread averages $7.35 a barrel with a standard deviation of $0.91, and the correlation between crude itself and the crack is only 0.556 -- confirming that the crack trade hedges most, not all, of the crude exposure. The spark spread behaves similarly against gas, with a correlation of only -0.016 once the fixed heat-rate hedge is applied.</p><p>A desk cares because these ratios are set by physical plant, not by a statistical fit, so the 'hedge ratio' here is a fact about the equipment rather than an estimate -- which is both a strength, because it cannot drift the way a fitted hedge ratio can, and a limit, because it cannot be re-optimised either.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(32)\nn = 260   # a year of trading days\ncrude = 60 + np.cumsum(rng.normal(0, 0.6, n))                     # $/bbl\n# gasoline tracks crude closely (it is refined from it) plus its own demand noise\ngasoline = 1.15 * crude + rng.normal(0, 1.0, n)                    # $/bbl-equivalent\n# a 3:2:1 crack spread: sell 2 bbl gasoline + 1 bbl heating oil per 3 bbl crude bought\nheating_oil = 1.05 * crude + rng.normal(0, 1.0, n)\ncrack_3_2_1 = (2 * gasoline + 1 * heating_oil - 3 * crude) / 3.0   # refining margin per bbl\n\n# spark spread: power price minus the fuel cost of generating it at a fixed heat rate\ngas = 3.0 + np.cumsum(rng.normal(0, 0.05, n))                      # $/MMBtu\nheat_rate = 7.5                                                    # MMBtu of gas per MWh\npower = heat_rate * gas + rng.normal(3.0, 1.5, n)                  # $/MWh, with a demand premium\nspark = power - heat_rate * gas\n\nprint(f\"crack spread ($/bbl)   mean {crack_3_2_1.mean():6.3f}   sd {crack_3_2_1.std():5.3f}   \"\n      f\"min {crack_3_2_1.min():6.3f}   max {crack_3_2_1.max():6.3f}\")\nprint(f\"spark spread ($/MWh)   mean {spark.mean():6.3f}   sd {spark.std():5.3f}   \"\n      f\"min {spark.min():6.3f}   max {spark.max():6.3f}\")\nprint(f\"corr(crude, crack)   {np.corrcoef(crude, crack_3_2_1)[0,1]:+.3f}   (a crack trade hedges crude, not eliminates it)\")\nprint(f\"corr(gas, spark)     {np.corrcoef(gas, spark)[0,1]:+.3f}\")\nprint(\"both spreads are refining/generation margins: long the finished product, short the input,\")\nprint(\"in the fixed ratio the physical process actually uses\")\n",
            "output": "crack spread ($/bbl)   mean  7.353   sd 0.912   min  4.992   max 10.070\nspark spread ($/MWh)   mean  2.946   sd 1.453   min -1.833   max  6.338\ncorr(crude, crack)   +0.556   (a crack trade hedges crude, not eliminates it)\ncorr(gas, spark)     -0.016\nboth spreads are refining/generation margins: long the finished product, short the input,\nin the fixed ratio the physical process actually uses"
          }
        },
        {
          "name": "A spread book is only market-neutral to the extent a regression says so",
          "explain": "<p>Every spread trade in this week claims to be hedged against some common factor -- the curve, the credit risk, the input commodity -- but the claim is only as good as the residual exposure that is left over, and the only way to know how much is left is to regress the spread's own P&amp;L on the factor it was meant to remove.</p><p>The snippet does exactly that: it regresses a simulated spread book's daily P&amp;L on the daily change in a common risk factor. The resulting exposure coefficient is 0.1623, and the factor explains 8.76% of the P&amp;L's variance -- small, but not zero. The idiosyncratic, factor-hedged residual has its own daily volatility of 0.5012 and its own (in this particular draw, essentially flat) Sharpe ratio.</p><p>A desk cares because 'market-neutral' is a claim about a regression's R-squared, not an assumption to be taken on faith: an 8.76% R-squared means roughly one-eleventh of the book's P&amp;L variance is really just the underlying factor in disguise, and a portfolio manager sizing many such spread positions together needs to know that residual factor loading adds up across the book even when each individual spread looks hedged.</p>",
          "formula": "P\\&L_t = \\alpha + \\beta \\, \\Delta F_t + \\varepsilon_t",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(33)\nn = 400\ncommon = np.cumsum(rng.normal(0, 1, n))     # a broad risk factor shared by both spread legs\nspread_pnl = rng.normal(0.01, 0.5, n) + 0.15 * np.diff(np.concatenate([[0], common]))\n\nX = np.column_stack([np.ones(n), np.diff(np.concatenate([[0], common]))])\nbeta = np.linalg.solve(X.T @ X, X.T @ spread_pnl)\nresid = spread_pnl - X @ beta\nr2 = 1 - resid @ resid / np.sum((spread_pnl - spread_pnl.mean())**2)\n\nprint(f\"spread P&L exposure to the common factor   {beta[1]:.4f}\")\nprint(f\"fraction of spread P&L variance explained by the factor   {r2:.4f}\")\nprint(f\"idiosyncratic (residual) daily vol of the spread   {resid.std():.4f}\")\nprint(f\"idiosyncratic annualised Sharpe of the residual   {resid.mean()/resid.std()*np.sqrt(252):.3f}\")\nprint(\"a spread book is only market-neutral to the extent this R^2 is small;\")\nprint(\"regressing the P&L on the common factor is how you find out, not by assumption\")\n",
            "output": "spread P&L exposure to the common factor   0.1623\nfraction of spread P&L variance explained by the factor   0.0876\nidiosyncratic (residual) daily vol of the spread   0.5012\nidiosyncratic annualised Sharpe of the residual   0.000\na spread book is only market-neutral to the extent this R^2 is small;\nregressing the P&L on the common factor is how you find out, not by assumption"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "A contango futures curve as the convenience yield shrinks",
        "params": {
          "xlab": "Maturity (months)",
          "ylab": "Futures price",
          "series": [
            {
              "name": "Curve price",
              "x": [
                1,
                3,
                6,
                9,
                12
              ],
              "y": [
                100.0,
                100.25,
                101.51,
                103.04,
                105.13
              ]
            }
          ],
          "log": false
        }
      },
      "pitfalls": [
        "Reading a calendar spread as a bet on the underlying's level rather than on the shape of the carry curve.",
        "Trading a credit basis without first checking, by regression, how much of it is still exposed to the common credit factor.",
        "Assuming a physical spread's fixed conversion ratio is optimal for hedging, when it is set by engineering, not by a fit to minimise variance."
      ],
      "check": [
        {
          "q": "A futures curve's convenience yield shrinks steadily from the front month to the back month, with financing and storage costs unchanged. The calendar spread between adjacent maturities should:",
          "options": [
            "Stay constant",
            "Widen further out the curve",
            "Narrow further out the curve",
            "Be undefined without knowing spot"
          ],
          "answer": 1,
          "why": "A shrinking convenience yield raises the net carry rate (r + storage - convenience) further out the curve, which widens the price gap between adjacent maturities -- exactly what the snippet's growing calendar spreads show."
        },
        {
          "q": "A bond-CDS basis trade is regressed on the common credit factor and comes back with a coefficient of 0.35 and an R-squared of 0.40. The position is:",
          "options": [
            "Fully hedged against credit risk",
            "Still carrying meaningful directional exposure to the credit factor, not yet a clean basis trade",
            "Guaranteed profitable",
            "Mispriced by construction"
          ],
          "answer": 1,
          "why": "An R-squared of 0.40 means 40% of the basis trade's variance is still explained by the very credit factor the trade was supposed to be hedged against. A genuinely hedged basis trade should show a coefficient and R-squared both close to zero."
        },
        {
          "q": "A power plant's spark spread is defined using its actual heat rate of 7.5 MMBtu/MWh. Using a different, incorrect heat rate of 9.0 in the hedge would:",
          "options": [
            "Have no effect, since it is just a scaling constant",
            "Leave the position under- or over-hedged against gas price moves",
            "Only affect the mean, not the variance, of the spread",
            "Automatically be corrected by the market"
          ],
          "answer": 1,
          "why": "The heat rate sets exactly how much gas exposure is being shorted per unit of power held long. Using the wrong physical ratio leaves a residual, unintended gas exposure in what was meant to be a hedged margin position."
        }
      ]
    },
    {
      "n": 4,
      "title": "Carry trades across asset classes",
      "topics": [
        "decomposing carry from spot return",
        "cross-asset carry",
        "correlated crash risk in carry portfolios",
        "carry's negative skew"
      ],
      "concepts": [
        {
          "name": "Carry is the return you earn if nothing else happens",
          "explain": "<p>Every carry trade decomposes into two pieces: the return earned if the price or rate stays exactly where it is, and the return from however much it actually moves. Covered interest parity makes this explicit for FX: the forward rate embeds the interest-rate differential as pure carry, entirely separate from any view on where spot goes.</p><p>The snippet prices a one-year FX forward from a 1.5% domestic and 4.5% foreign rate, giving a forward carry of -2.87% -- the return earned purely from the rate gap if spot is unchanged. Layering three spot scenarios on top shows the total return is carry plus whatever spot did: unchanged spot gives -2.87%, a 2% appreciation gives -0.87%, and a 4% depreciation gives -6.87%.</p><p>A desk cares because a carry trade's entire economic content is the claim that the carry component is more reliable than the spot component, and that claim can only be evaluated once the two pieces are actually separated -- reporting a single blended total return, as most performance reports do by default, hides exactly the distinction the trade is betting on.</p>",
          "formula": "F = S_0 \\frac{1+r_d T}{1+r_f T}, \\qquad \\text{total return} = \\text{carry} + \\Delta S/S",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\n# expected total return = carry + expected change in price/rate (\"spot\")\n# a forward FX rate encodes the interest-rate differential as its carry\nS0, r_dom, r_for, T = 1.2000, 0.015, 0.045, 1.0\nF = S0 * (1 + r_dom * T) / (1 + r_for * T)     # covered interest parity forward\ncarry = (F - S0) / S0                          # the roll/carry embedded in the forward\n\nscenarios = {\"spot unchanged\": 0.0, \"spot appreciates 2%\": 0.02, \"spot depreciates 4%\": -0.04}\nprint(f\"forward carry (roll) implied by the rate gap   {carry:+.4%}\")\nfor name, dspot in scenarios.items():\n    total_return = carry + dspot\n    print(f\"  {name:<22} spot change {dspot:+.2%}   total return {total_return:+.4%}\")\nprint(\"\\ncarry is the return you earn if spot does NOT move; a carry trade is a bet\")\nprint(\"that spot moves by less than the market's compensation for holding it\")\n",
            "output": "forward carry (roll) implied by the rate gap   -2.8708%\n  spot unchanged         spot change +0.00%   total return -2.8708%\n  spot appreciates 2%    spot change +2.00%   total return -0.8708%\n  spot depreciates 4%    spot change -4.00%   total return -6.8708%\n\ncarry is the return you earn if spot does NOT move; a carry trade is a bet\nthat spot moves by less than the market's compensation for holding it"
          }
        },
        {
          "name": "The same decomposition works across every asset class named in this course",
          "explain": "<p>FX carry, the futures roll, an equity dividend yield and a credit spread are the same object -- a return earned for holding a position, largely independent of where the underlying price moves -- expressed in four different institutional forms. Decomposing each into its carry and spot components shows how much of a typical month's realised total return is the stable piece.</p><p>The snippet simulates a month for four such strategies. FX carry, with an annualised carry of 5.5%, realises a carry return of 0.458% for the month against a noisy spot return of -0.069%; the pattern repeats across futures roll, equity dividend carry and credit spread carry, in every case the carry leg's monthly contribution staying close to its annualised rate divided by twelve while the spot leg is the noisy, sign-varying piece.</p><p>A desk cares because recognising the same decomposition across unrelated-looking instruments is what lets a multi-asset carry book be managed as one strategy with four expressions rather than four unrelated bets, and it is also what makes clear that a 'carry strategy' in any of these forms is really a bet that the market's compensation for holding the position will, on average, exceed the noise in the underlying's price.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(41)\nn = 750\nhorizon = 21   # ~1 trading month\n\n# four cross-asset carry strategies, each defined by (annualised carry, spot vol, spot drift)\nstrategies = {\n    \"FX carry (EM vs USD)\":       (0.055, 0.09, -0.010),\n    \"Futures roll (contango oil)\": (0.035, 0.22, 0.005),\n    \"Equity dividend carry\":       (0.020, 0.16, 0.030),\n    \"Credit spread carry (HY)\":    (0.045, 0.05, -0.004),\n}\n\nprint(f\"{'strategy':<28}{'ann. carry':>11}{'realised spot ret':>19}{'realised carry return':>23}{'total':>9}\")\nfor name, (carry_ann, vol, drift_ann) in strategies.items():\n    dt = horizon / 252\n    spot_path = rng.normal(drift_ann * dt, vol * np.sqrt(dt), n)\n    carry_leg = carry_ann * dt * np.ones(n)\n    total = carry_leg + spot_path\n    print(f\"{name:<28}{carry_ann:>10.2%}{spot_path.mean():>19.4%}{carry_leg.mean():>23.4%}{total.mean():>9.4%}\")\n\nprint(\"\\nover many one-month windows the carry component is nearly constant while the spot\")\nprint(\"component is the noisy part -- decomposing the two is what separates a genuine\")\nprint(\"risk premium from a strategy that is really just long spot in disguise\")\n",
            "output": "strategy                     ann. carry  realised spot ret  realised carry return    total\nFX carry (EM vs USD)             5.50%           -0.0693%                0.4583%  0.3890%\nFutures roll (contango oil)      3.50%           -0.1210%                0.2917%  0.1707%\nEquity dividend carry            2.00%            0.1277%                0.1667%  0.2943%\nCredit spread carry (HY)         4.50%           -0.0335%                0.3750%  0.3415%\n\nover many one-month windows the carry component is nearly constant while the spot\ncomponent is the noisy part -- decomposing the two is what separates a genuine\nrisk premium from a strategy that is really just long spot in disguise"
          }
        },
        {
          "name": "Cross-asset carry strategies share one crash factor",
          "explain": "<p>Four carry strategies across different asset classes can look attractively diversified by their pairwise return correlations while all secretly loading on the same underlying risk: a rare, sharp shock that hits every carry trade at once, because every carry trade is compensation for bearing exactly that kind of risk.</p><p>The snippet builds four such strategies, each with its own small positive carry, all loaded to different degrees (0.6 to 1.2) on one shared, fat-tailed shock factor. Their pairwise correlations are modest -- from 0.18 between the dividend and equity carry strategies up to 0.46 between futures roll and credit -- which on a normal day looks like real diversification. But because all four load on the same shock, the individual annualised Sharpe ratios in this simulated window range from -0.40 to 0.46, and the equal-weighted combination comes to only 0.08: far worse than the modest pairwise correlations alone would suggest.</p><p>A desk cares because a correlation matrix computed from ordinary days systematically understates how correlated a set of carry strategies becomes exactly when it matters -- during the shared crash -- and sizing a multi-strategy carry book off day-to-day correlations alone is a reliable way to be surprised by how much risk was actually concentrated in one factor.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(42)\nn = 1200\n# four carry strategies, each with a small positive daily carry, that all also load\n# on one shared crash-risk factor (fat-tailed, mean zero: every one of them is short it)\ncarry_mean = np.array([0.00022, 0.00018, 0.00014, 0.00020])   # FX, futures-roll, equity-div, credit\ncrash_factor = rng.standard_t(4, n) * 0.004\nloadings = np.array([0.6, 0.9, 0.3, 1.2])\nidio = rng.normal(0, 0.006, size=(n, 4))\nreturns = carry_mean[None, :] + loadings[None, :] * crash_factor[:, None] + idio\n\ncorr = np.corrcoef(returns.T)\nport = returns.mean(axis=1)\nport_sharpe = port.mean() / port.std() * np.sqrt(252)\nsingle_sharpe = returns.mean(axis=0) / returns.std(axis=0) * np.sqrt(252)\n\nprint(\"pairwise correlation matrix of the four carry strategies:\")\nnames = [\"FX\", \"roll\", \"div\", \"credit\"]\nprint(\"        \" + \"\".join(f\"{nm:>8}\" for nm in names))\nfor i, nm in enumerate(names):\n    print(f\"{nm:<8}\" + \"\".join(f\"{corr[i,j]:8.2f}\" for j in range(4)))\nprint(f\"\\nindividual annualised Sharpe   \" + \"  \".join(f\"{nm}:{s:.2f}\" for nm, s in zip(names, single_sharpe)))\nprint(f\"equal-weight combined Sharpe   {port_sharpe:.2f}\")\nprint(\"diversification looks good day to day, but all four load on one crash factor,\")\nprint(\"so the combined book's tail risk is far worse than the correlation matrix alone suggests\")\n",
            "output": "pairwise correlation matrix of the four carry strategies:\n              FX    roll     div  credit\nFX          1.00    0.32    0.18    0.38\nroll        0.32    1.00    0.18    0.46\ndiv         0.18    0.18    1.00    0.19\ncredit      0.38    0.46    0.19    1.00\n\nindividual annualised Sharpe   FX:0.38  roll:-0.40  div:0.46  credit:-0.06\nequal-weight combined Sharpe   0.08\ndiversification looks good day to day, but all four load on one crash factor,\nso the combined book's tail risk is far worse than the correlation matrix alone suggests"
          }
        },
        {
          "name": "A Sharpe ratio cannot see the skew that carry is being paid for",
          "explain": "<p>Two return series can have identical means and identical variances -- and therefore identical Sharpe ratios -- while one of them is a symmetric, well-behaved process and the other earns a small steady premium most of the time and gives it all back, and more, in a rare crash. The Sharpe ratio, built from only the first two moments, cannot tell them apart.</p><p>The snippet builds a stylised carry return with a 1-in-250 chance of an 8% crash against a symmetric comparator matched on mean and standard deviation. The carry series shows a skewness of -9.32 and an excess kurtosis of +140.69 -- both far more extreme than real-world carry strategies, deliberately, to make the effect unmistakable -- yet its naive annualised Sharpe ratio of 0.587 is close to the symmetric comparator's 0.622. The probability of a single day worse than -5% is small, 0.36%, but entirely absent from either Sharpe ratio.</p><p>A desk cares because reporting a Sharpe ratio for a carry strategy without also reporting its skewness is reporting half of the risk. The same average, risk-adjusted-looking return can come from two completely different bets on the tail, and only one of them is a bet a risk manager should be comfortable sizing the same way as the other.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(43)\nn = 100000\n# a stylised carry return: small positive drift most of the time, rare large crash\np_crash = 1/250\nnormal_ret = rng.normal(0.0006, 0.004, n)\ncrash = rng.random(n) < p_crash\ncarry_ret = np.where(crash, rng.normal(-0.08, 0.03, n), normal_ret)\n\nsharpe_naive = carry_ret.mean() / carry_ret.std() * np.sqrt(252)\nskew = ((carry_ret - carry_ret.mean())**3).mean() / carry_ret.std()**3\nkurt = ((carry_ret - carry_ret.mean())**4).mean() / carry_ret.std()**4\n\n# a symmetric strategy with the SAME mean and vol but no skew, for comparison\nsymmetric_ret = rng.normal(carry_ret.mean(), carry_ret.std(), n)\nsharpe_symmetric = symmetric_ret.mean() / symmetric_ret.std() * np.sqrt(252)\n\nprint(f\"carry strategy    mean {carry_ret.mean():.5f}  sd {carry_ret.std():.5f}  skew {skew:+.2f}  excess kurt {kurt-3:+.2f}\")\nprint(f\"annualised Sharpe (carry, naive iid)      {sharpe_naive:.3f}\")\nprint(f\"annualised Sharpe (symmetric comparator)  {sharpe_symmetric:.3f}\")\nprint(f\"P(single-day loss worse than -5%)   {np.mean(carry_ret < -0.05):.4%}\")\nprint(\"both strategies show a similar Sharpe ratio, but only one of them is short a crash;\")\nprint(\"a Sharpe ratio computed without looking at skew cannot tell these two apart\")\n",
            "output": "carry strategy    mean 0.00025  sd 0.00680  skew -9.32  excess kurt +140.69\nannualised Sharpe (carry, naive iid)      0.587\nannualised Sharpe (symmetric comparator)  0.622\nP(single-day loss worse than -5%)   0.3600%\nboth strategies show a similar Sharpe ratio, but only one of them is short a crash;\na Sharpe ratio computed without looking at skew cannot tell these two apart"
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Four carry strategies: modest pairwise correlation, one shared crash factor",
        "params": {
          "cmap": "div",
          "xlabels": [
            "FX",
            "roll",
            "div",
            "credit"
          ],
          "ylabels": [
            "FX",
            "roll",
            "div",
            "credit"
          ],
          "matrix": [
            [
              1.0,
              0.32,
              0.18,
              0.38
            ],
            [
              0.32,
              1.0,
              0.18,
              0.46
            ],
            [
              0.18,
              0.18,
              1.0,
              0.19
            ],
            [
              0.38,
              0.46,
              0.19,
              1.0
            ]
          ]
        }
      },
      "pitfalls": [
        "Reporting a carry strategy's total return without decomposing it into the carry and spot components the trade is actually betting on.",
        "Sizing a multi-asset carry book from ordinary-day correlations, which understate the shared crash risk every carry strategy is compensated for bearing.",
        "Comparing two strategies purely by Sharpe ratio when one is negatively skewed and the other is not; they are not the same risk even at an identical Sharpe."
      ],
      "check": [
        {
          "q": "A one-year FX forward embeds a carry of -2.9% from the interest-rate differential. If spot is unchanged over the year, the total return on the carry trade is:",
          "options": [
            "0%, since spot did not move",
            "-2.9%, exactly the carry",
            "+2.9%, the negative of the carry",
            "Undefined without a volatility assumption"
          ],
          "answer": 1,
          "why": "Carry is defined as the return earned if spot does not move; by construction, an unchanged spot means the entire realised return is the carry component."
        },
        {
          "q": "Four carry strategies show pairwise correlations between 0.18 and 0.46 on ordinary days but share one fat-tailed crash factor. The main risk this creates is:",
          "options": [
            "None; modest correlations already price the shared risk correctly",
            "The correlation matrix understates how correlated the strategies become in the shared crash",
            "The strategies must be identical",
            "Fat tails only matter for options books"
          ],
          "answer": 1,
          "why": "A correlation matrix estimated mostly from ordinary days reflects ordinary-day co-movement, not the much higher effective correlation that appears precisely when the shared crash factor realises -- which is exactly when diversification is needed most."
        },
        {
          "q": "Strategy A and Strategy B have identical mean and standard deviation, hence identical Sharpe ratios, but A has skewness -9 and B has skewness 0. The Sharpe ratio:",
          "options": [
            "Correctly captures that A is riskier",
            "Cannot distinguish them, since it is built only from the first two moments",
            "Implies A must have a higher mean",
            "Is undefined when skewness is nonzero"
          ],
          "answer": 1,
          "why": "Sharpe ratio is a function of mean and standard deviation only. Two series can match on both while differing enormously in skew and tail risk, and the Sharpe ratio will report them as equivalent regardless."
        }
      ]
    },
    {
      "n": 5,
      "title": "Parameter reversion",
      "topics": [
        "parameters as their own time series",
        "Ornstein-Uhlenbeck estimation of a rolling parameter",
        "a reversion signal with and without transaction costs",
        "hysteresis and entry/exit bands"
      ],
      "concepts": [
        {
          "name": "A rolling regression coefficient is itself a mean-reverting process",
          "explain": "<p>A model's fitted parameter -- a hedge ratio, a beta, a factor loading -- is not a fixed constant discovered once; refit on a rolling window, it moves over time, and that movement is itself a time series with its own statistical structure, often mean-reverting around some longer-run average.</p><p>The snippet fits a rolling regression coefficient over four hundred overlapping sixty-observation windows against a true parameter path that oscillates slowly between 0.2 and 0.8. The estimated rolling beta ranges from 0.027 to 0.974 -- noisier than the truth, as expected from a short-window fit -- with a mean of 0.506 close to the true path's centre. Crucially, the lag-1 autocorrelation of the estimated beta series itself is 0.923: extremely persistent, which is exactly the property a reversion signal needs to exploit.</p><p>A desk cares because this reframes 'my model's parameter has drifted' from a maintenance problem into a research opportunity: if the parameter's own path is predictable, a signal built on where the parameter is likely to go next is a legitimate second-order strategy layered on top of the first model.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(51)\nn_windows, window = 400, 60\ntrue_beta_path = 0.5 + 0.3 * np.sin(np.linspace(0, 6, n_windows + window))\nbetas = []\nfor i in range(n_windows):\n    x = rng.normal(0, 1, window)\n    y = true_beta_path[i:i+window] * x + rng.normal(0, 0.5, window)\n    X = np.column_stack([np.ones(window), x])\n    b = np.linalg.solve(X.T @ X, X.T @ y)\n    betas.append(b[1])\nbetas = np.array(betas)\n\nprint(f\"true beta path range     [{true_beta_path.min():.3f}, {true_beta_path.max():.3f}]\")\nprint(f\"estimated rolling-beta range  [{betas.min():.3f}, {betas.max():.3f}]\")\nprint(f\"estimated beta mean {betas.mean():.3f}  sd {betas.std():.3f}\")\nprint(f\"lag-1 autocorrelation of the estimated beta series   {np.corrcoef(betas[:-1], betas[1:])[0,1]:.3f}\")\nprint(\"a rolling regression coefficient is itself a time series;\")\nprint(\"its own autocorrelation is what lets you build a signal on WHERE it will go next\")\n",
            "output": "true beta path range     [0.200, 0.800]\nestimated rolling-beta range  [0.027, 0.974]\nestimated beta mean 0.506  sd 0.233\nlag-1 autocorrelation of the estimated beta series   0.923\na rolling regression coefficient is itself a time series;\nits own autocorrelation is what lets you build a signal on WHERE it will go next"
          }
        },
        {
          "name": "Ornstein-Uhlenbeck gives the parameter's own half-life",
          "explain": "<p>Once a drifting parameter is treated as a time series, the natural continuous-time model for something that wanders around a stable long-run level is the Ornstein-Uhlenbeck process, with a mean-reversion speed theta, a long-run mean mu, and a diffusion volatility sigma. Fitting theta and mu from the increments regressed on the level recovers the parameter's own half-life.</p><p>The snippet simulates a true theta of 3.0 and mu of 0.5 and estimates both from the discretised path. The estimated theta comes back at 4.142 against the true 3.0 -- a meaningful overestimate typical of this kind of discretised, noisy AR(1)-style fit -- while mu is recovered almost exactly, 0.510 against 0.500. The resulting estimated half-life of a shock to the parameter is 42.2 trading days, and the estimated stationary standard deviation, 0.081, is reasonably close to the theoretical 0.102 implied by the true parameters.</p><p>A desk cares because the half-life of the PARAMETER, not of the underlying spread or signal, is what tells you how often it is worth re-estimating the model at all: refitting a model whose true parameter reverts on a two-month clock every single day is mostly refitting noise.</p>",
          "formula": "d\\beta_t = \\theta(\\mu-\\beta_t)\\,dt + \\sigma\\,dW_t, \\qquad \\text{half-life} = \\frac{\\ln 2}{\\theta}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(52)\nn = 500\ntheta, mu, sigma, dt = 3.0, 0.5, 0.25, 1/252   # OU parameters for a rolling beta\nbeta_path = np.zeros(n)\nbeta_path[0] = mu\nfor t in range(1, n):\n    beta_path[t] = beta_path[t-1] + theta * (mu - beta_path[t-1]) * dt + sigma * np.sqrt(dt) * rng.normal()\n\n# estimate theta and mu by regressing the increment on the level (an AR(1)-in-continuous-time trick)\ny = np.diff(beta_path)\nx = beta_path[:-1]\nX = np.column_stack([np.ones(len(x)), x])\nb = np.linalg.solve(X.T @ X, X.T @ y)\ntheta_hat = -b[1] / dt\nmu_hat = b[0] / (theta_hat * dt)\nhalflife_days = np.log(2) / theta_hat / dt\n\nprint(f\"true theta {theta:.3f}   estimated theta {theta_hat:.3f}\")\nprint(f\"true mu    {mu:.3f}   estimated mu    {mu_hat:.3f}\")\nprint(f\"half-life of a shock to the parameter   {halflife_days:.1f} trading days\")\nprint(f\"stationary sd of the parameter (theory)  {sigma/np.sqrt(2*theta):.4f}\")\nprint(f\"stationary sd of the parameter (sample)  {beta_path.std():.4f}\")\n",
            "output": "true theta 3.000   estimated theta 4.142\ntrue mu    0.500   estimated mu    0.510\nhalf-life of a shock to the parameter   42.2 trading days\nstationary sd of the parameter (theory)  0.1021\nstationary sd of the parameter (sample)  0.0808"
          }
        },
        {
          "name": "Transaction costs turn a continuous signal into a banded one",
          "explain": "<p>A reversion signal that resizes the position continuously as the parameter moves captures the reversion cleanly in a frictionless world, but every resizing is a trade, and in the presence of costs a continuously updating signal churns constantly on noise that never justified crossing the bid-ask spread in the first place.</p><p>The snippet compares a continuous reversion signal against a version that only changes position once the signal crosses a band, holding position otherwise -- a hysteresis rule. The continuous signal's gross annualised Sharpe of 1.250 barely changes net of a 3-basis-point cost, to 1.240, because in THIS simulation the reversion is fast relative to the cost; but its mean daily turnover of 0.130 is more than double the banded version's 0.055, and the banded signal's net Sharpe, 1.069, is somewhat below the continuous one's once costs are applied consistently at the same rate.</p><p>A desk cares because the right amount of hysteresis depends entirely on the ratio of the signal's natural volatility to the cost per trade, and there is no universal answer: the same signal can be worth trading continuously in a cheap, liquid instrument and worth trading only in bands in an expensive one, and the only way to know is to compute both net of the actual cost, not to assume banding always helps.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(53)\nn = 2000\ntheta, mu, sigma, dt = 4.0, 0.0, 1.0, 1/252\nx = np.zeros(n)\nfor t in range(1, n):\n    x[t] = x[t-1] + theta * (mu - x[t-1]) * dt + sigma * np.sqrt(dt) * rng.normal()\n\ncost_bps = 3.0          # round-trip cost per unit turnover, in return units\nsignal = -x                              # bet on reversion toward mu\nposition = np.clip(signal / x.std(), -2, 2)\npnl_gross = position[:-1] * np.diff(x)\nturnover = np.abs(np.diff(position))\npnl_net = pnl_gross - turnover * cost_bps / 10000.0\n\nsharpe_gross = pnl_gross.mean() / pnl_gross.std() * np.sqrt(252)\nsharpe_net = pnl_net.mean() / pnl_net.std() * np.sqrt(252)\n\n# a cost-aware version: only trade when the signal has moved enough to be worth the cost (hysteresis)\nband = 0.35\npos_band = np.zeros(n)\nfor t in range(1, n):\n    if signal[t] / x.std() > band:\n        pos_band[t] = 2\n    elif signal[t] / x.std() < -band:\n        pos_band[t] = -2\n    else:\n        pos_band[t] = pos_band[t-1]\npnl_band_gross = pos_band[:-1] * np.diff(x)\nturnover_band = np.abs(np.diff(pos_band))\npnl_band_net = pnl_band_gross - turnover_band * cost_bps / 10000.0\nsharpe_band_net = pnl_band_net.mean() / pnl_band_net.std() * np.sqrt(252)\n\nprint(f\"continuous reversion signal:  gross Sharpe {sharpe_gross:.3f}   net-of-cost Sharpe {sharpe_net:.3f}\")\nprint(f\"mean daily turnover (continuous)   {turnover.mean():.3f}\")\nprint(f\"banded (hysteresis) signal:   net-of-cost Sharpe {sharpe_band_net:.3f}\")\nprint(f\"mean daily turnover (banded)       {turnover_band.mean():.3f}\")\n",
            "output": "continuous reversion signal:  gross Sharpe 1.250   net-of-cost Sharpe 1.240\nmean daily turnover (continuous)   0.130\nbanded (hysteresis) signal:   net-of-cost Sharpe 1.069\nmean daily turnover (banded)       0.055"
          }
        },
        {
          "name": "Entry and exit bands are two separate parameters, not one",
          "explain": "<p>A banded reversion signal has at least two thresholds to choose -- how far the signal must move to open a position, and how far it must revert to close one -- and these do not have to be the same value. Separating entry and exit lets a strategy avoid re-entering immediately after closing on noise near the threshold.</p><p>The snippet sweeps four entry/exit combinations on the same simulated reversion process net of a 2-basis-point cost. Tight bands -- entry at 0.5 standard deviations, exit at 0 -- trade about 37 times per thousand days for a net Sharpe of 1.177. Widening to entry 1.5, exit 0.5 cuts trading to about 16 times per thousand days while raising net Sharpe to 1.437, the best of the four in this run; pushing wider still, to entry 2.0, exit 1.0, trades only 5.7 times per thousand days but net Sharpe falls back to 0.989, because the very wide band now misses too much of the reversion.</p><p>A desk cares because the pattern here -- an interior optimum, not a monotonic 'wider is always better' relationship -- is the normal shape of this trade-off, and the specific optimal band found on one dataset should be treated with real suspicion, since it is exactly the kind of parameter that a research process can overfit by trying many combinations, the subject of week 7.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(54)\nn = 3000\ntheta, sigma, dt = 4.0, 1.0, 1/252\nx = np.zeros(n)\nfor t in range(1, n):\n    x[t] = x[t-1] - theta * x[t-1] * dt + sigma * np.sqrt(dt) * rng.normal()\nz = (x - x.mean()) / x.std()\n\ncost_bps = 2.0\nfor entry, exitz in [(0.5, 0.0), (1.0, 0.0), (1.5, 0.5), (2.0, 1.0)]:\n    pos = np.zeros(n)\n    state = 0\n    for t in range(n):\n        if state == 0 and z[t] > entry:\n            state = -1\n        elif state == 0 and z[t] < -entry:\n            state = 1\n        elif state == 1 and z[t] > -exitz:\n            state = 0\n        elif state == -1 and z[t] < exitz:\n            state = 0\n        pos[t] = state\n    pnl_gross = pos[:-1] * np.diff(x)\n    turnover = np.abs(np.diff(pos))\n    pnl_net = pnl_gross - turnover * cost_bps / 10000.0\n    sr = pnl_net.mean() / pnl_net.std() * np.sqrt(252) if pnl_net.std() > 0 else 0.0\n    print(f\"entry z={entry:.1f} exit z={exitz:.1f}   trades/1000d {turnover.astype(bool).sum()/n*1000:6.1f}   net Sharpe {sr:6.3f}\")\nprint(\"wider entry/exit bands trade less often and survive costs better;\")\nprint(\"the 'optimal' band in-sample is almost always tighter than the one that will hold up live\")\n",
            "output": "entry z=0.5 exit z=0.0   trades/1000d   37.0   net Sharpe  1.177\nentry z=1.0 exit z=0.0   trades/1000d   19.7   net Sharpe  1.228\nentry z=1.5 exit z=0.5   trades/1000d   16.3   net Sharpe  1.437\nentry z=2.0 exit z=1.0   trades/1000d    5.7   net Sharpe  0.989\nwider entry/exit bands trade less often and survive costs better;\nthe 'optimal' band in-sample is almost always tighter than the one that will hold up live"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "A mean-reverting parameter path around its long-run level",
        "params": {
          "xlab": "Trading days",
          "ylab": "Rolling parameter estimate",
          "log": false,
          "series": [
            {
              "name": "OU-simulated rolling beta",
              "x": [
                0,
                100,
                200,
                300,
                400,
                499
              ],
              "y": [
                0.5,
                0.56,
                0.48,
                0.52,
                0.47,
                0.51
              ]
            },
            {
              "name": "Long-run mean",
              "x": [
                0,
                499
              ],
              "y": [
                0.5,
                0.5
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Treating a rolling parameter's instability purely as estimation noise, when its persistence can itself be a tradeable signal.",
        "Refitting a model daily when the underlying parameter's own half-life is measured in months, mostly refitting to noise.",
        "Choosing entry and exit bands by grid search on a single dataset and reporting the best combination as if it were the strategy, rather than the best of many tried."
      ],
      "check": [
        {
          "q": "A rolling regression coefficient's own time series has a lag-1 autocorrelation of 0.92. This suggests:",
          "options": [
            "The original model is broken and should be discarded",
            "The parameter's own path is highly persistent and potentially forecastable",
            "The autocorrelation must be a computational error",
            "Nothing; parameter autocorrelation is never informative"
          ],
          "answer": 1,
          "why": "High persistence in the parameter's own series is exactly the property a second-order signal could exploit: knowing where the parameter has been is informative about where it is likely to be next."
        },
        {
          "q": "An OU-fitted mean-reversion speed theta implies a half-life of 42 trading days for a model's own parameter. Refitting the model every single day is:",
          "options": [
            "Necessary to capture the reversion",
            "Mostly refitting to noise, since the parameter barely moves on a daily timescale relative to its own half-life",
            "Equivalent to refitting monthly",
            "Only a concern if theta is negative"
          ],
          "answer": 1,
          "why": "A 42-day half-life means the parameter itself changes very slowly day to day; daily refits are dominated by estimation noise rather than by any real movement in the underlying parameter."
        },
        {
          "q": "A continuous reversion signal and a banded (hysteresis) version of the same signal are compared net of transaction costs. The banded version will generally:",
          "options": [
            "Always have a higher net Sharpe ratio",
            "Trade less, but its relative net performance versus the continuous version depends on the cost level and the signal's own volatility",
            "Have identical turnover to the continuous version",
            "Only be relevant if costs are zero"
          ],
          "answer": 1,
          "why": "Banding always reduces turnover, but whether that raises or lowers net Sharpe depends on how much return the banding gives up versus how much cost it saves -- there is no universal ranking independent of the actual cost and signal parameters."
        },
        {
          "q": "A grid search over entry/exit bands on one backtest finds an 'optimal' combination with the highest net Sharpe. The most important next step is:",
          "options": [
            "Deploy it immediately; the search already found the best answer",
            "Recognise that the best of many tried combinations needs to be evaluated out of sample and, ideally, deflated for the number tried",
            "Widen the bands further, since wider is always better",
            "Nothing further is needed once transaction costs are included"
          ],
          "answer": 1,
          "why": "The best result from a grid search over many combinations is, by construction, inflated relative to its true expected performance -- exactly the multiple-testing problem that week 7's deflated Sharpe ratio addresses directly."
        }
      ]
    },
    {
      "n": 6,
      "title": "Model evaluation I: objective functions and validation",
      "topics": [
        "robust regression under outliers",
        "quantile regression for asymmetric objectives",
        "walk-forward vs shuffled validation",
        "recency weighting"
      ],
      "concepts": [
        {
          "name": "Least squares is not the only, or always the right, objective",
          "explain": "<p>Ordinary least squares minimises squared error, which means a handful of large residuals -- from a bad data print, a corporate action, or a genuine but rare event -- can dominate the fit and drag the estimated relationship away from what holds for the bulk of the data. A robust objective, such as Huber loss, treats small residuals quadratically but large ones linearly, which caps how much any single point can pull the fit.</p><p>The snippet contaminates 5% of a clean linear relationship with true slope 0.4 with large errors and fits both OLS and a Huber regression. OLS's slope is pulled to 0.617, an error of 0.217 from the truth; the Huber fit comes back at 0.396, an error of only 0.004. The eight contaminated points, out of three hundred, were enough to move OLS's slope by more than half.</p><p>A desk cares because real market data is full of exactly this kind of contamination -- stale prints, corporate-action artefacts, data-vendor errors -- and a model-selection process that only ever uses squared-error loss is implicitly assuming a level of data cleanliness that live market data rarely provides.</p>",
          "formula": "L_\\delta(r) = \\begin{cases} \\tfrac12 r^2 & |r|\\le \\delta \\\\ \\delta(|r|-\\tfrac12\\delta) & |r|>\\delta \\end{cases}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\nfrom sklearn.linear_model import HuberRegressor, LinearRegression\n\nrng = np.random.default_rng(61)\nn = 300\nx = rng.normal(0, 1, n)\ny = 0.4 * x + rng.normal(0, 0.3, n)\n# contaminate 5% of points with a large data error (a bad print, a corporate action, etc.)\nbad = rng.random(n) < 0.05\ny[bad] += rng.normal(0, 8, bad.sum())\n\nols = LinearRegression().fit(x.reshape(-1, 1), y)\nhuber = HuberRegressor(epsilon=1.35).fit(x.reshape(-1, 1), y)\n\nprint(f\"true slope        0.400\")\nprint(f\"OLS slope         {ols.coef_[0]:.4f}   (pulled by {bad.sum()} contaminated points)\")\nprint(f\"Huber slope       {huber.coef_[0]:.4f}   (down-weights large residuals instead of squaring them)\")\nprint(f\"OLS error   {abs(ols.coef_[0]-0.4):.4f}    Huber error   {abs(huber.coef_[0]-0.4):.4f}\")\n",
            "output": "true slope        0.400\nOLS slope         0.6166   (pulled by 8 contaminated points)\nHuber slope       0.3960   (down-weights large residuals instead of squaring them)\nOLS error   0.2166    Huber error   0.0040"
          }
        },
        {
          "name": "Quantile regression fits the spread of outcomes, not just the centre",
          "explain": "<p>A least-squares fit describes the conditional mean of an outcome given a predictor, but many trading questions are really about the conditional tails -- how bad can the downside be given this signal, not just what is the average outcome. Quantile regression fits a line to a chosen quantile of the outcome distribution directly.</p><p>The snippet builds a relationship where the SPREAD of outcomes, not just the average, widens with the size of the predictor, and fits the 10th, 50th and 90th percentile regressions. The median regression's slope, 0.153, tracks the mean-style relationship closely; the 10th percentile slope is a similar 0.157, but the 90th percentile slope is only 0.072 -- the upside compresses relative to the downside as the predictor grows, a pattern a single least-squares line cannot see because it only ever reports the centre.</p><p>A desk cares because a risk manager sizing a position off a mean-based model with heteroskedastic, asymmetric conditional risk is systematically mispricing exactly the tail that matters for a stop-loss or a margin calculation, and quantile regression is the direct way to get that tail's slope rather than inferring it from the mean and an assumed error distribution.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\nfrom sklearn.linear_model import QuantileRegressor\n\nrng = np.random.default_rng(62)\nn = 600\nx = rng.normal(0, 1, n)\n# heteroskedastic, right-skewed noise: downside risk grows with |x| faster than upside\nnoise = rng.normal(0, 1, n) * (0.3 + 0.5 * np.abs(x))\ny = 0.2 * x + noise\n\nfor q in (0.10, 0.50, 0.90):\n    qr = QuantileRegressor(quantile=q, alpha=0.0, solver=\"highs\").fit(x.reshape(-1, 1), y)\n    print(f\"quantile {q:.2f}:  intercept {qr.intercept_:7.4f}   slope on x {qr.coef_[0]:7.4f}\")\nprint(\"the median regression tracks the mean-style slope, but the 10th and 90th percentile\")\nprint(\"slopes fan out because the SPREAD of outcomes, not just the centre, depends on x --\")\nprint(\"exactly the case where a single least-squares line hides the risk that matters to a desk\")\n",
            "output": "quantile 0.10:  intercept -0.7942   slope on x  0.1570\nquantile 0.50:  intercept  0.0095   slope on x  0.1528\nquantile 0.90:  intercept  0.8159   slope on x  0.0722\nthe median regression tracks the mean-style slope, but the 10th and 90th percentile\nslopes fan out because the SPREAD of outcomes, not just the centre, depends on x --\nexactly the case where a single least-squares line hides the risk that matters to a desk"
          }
        },
        {
          "name": "A shuffled train/test split can silently leak the future into the past",
          "explain": "<p>Standard cross-validation shuffles observations randomly into folds, which is the right thing to do when observations are exchangeable. Time series are not exchangeable: a regime that changes partway through the sample means a randomly shuffled training set can contain observations from AFTER the point a walk-forward evaluation would ever have seen.</p><p>The snippet builds a relationship whose true coefficient flips from 0.40 to -0.10 halfway through a thousand-observation sample, then compares a random 80/20 shuffled split against a genuine walk-forward split trained only on the first half. The shuffled split's training-set coefficient, 0.133, is a blend of both regimes and its test-set error, 0.322, looks deceptively reasonable because the test fold also contains a mix of both regimes. The walk-forward split's coefficient, 0.394, correctly reflects only the first regime, and its honestly out-of-sample test error against the second (different) regime, 0.505, is visibly worse -- which is the correct, more pessimistic answer.</p><p>A desk cares because the shuffled split's more optimistic number is not a better estimate, it is the wrong question answered confidently: it estimates performance on a blend of regimes the model will never actually encounter in that combination when trading forward in real time.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(63)\nn = 1000\ntrue_beta = np.concatenate([np.full(500, 0.4), np.full(500, -0.1)])   # the relationship breaks halfway\nx = rng.normal(0, 1, n)\ny = true_beta * x + rng.normal(0, 0.5, n)\n\ndef fit_beta(xx, yy):\n    X = np.column_stack([np.ones(len(xx)), xx])\n    return np.linalg.solve(X.T @ X, X.T @ yy)[1]\n\n# standard iid k-fold-style shuffle (WRONG for time series: it can train on the future)\nshuffled_idx = rng.permutation(n)\ntrain_idx, test_idx = shuffled_idx[:800], shuffled_idx[800:]\nbeta_shuffled = fit_beta(x[train_idx], y[train_idx])\npred_shuffled = beta_shuffled * x[test_idx]\nmse_shuffled = np.mean((y[test_idx] - pred_shuffled)**2)\n\n# walk-forward: train only on the past, test only on the future\nbeta_walk = fit_beta(x[:500], y[:500])\npred_walk = beta_walk * x[500:]\nmse_walk = np.mean((y[500:] - pred_walk)**2)\n\nprint(f\"true beta before the break   0.40     true beta after the break   -0.10\")\nprint(f\"shuffled split beta fit on train    {beta_shuffled:.4f}   test MSE {mse_shuffled:.4f}\")\nprint(f\"walk-forward beta fit on the past    {beta_walk:.4f}   test MSE {mse_walk:.4f}\")\nprint(\"the shuffled split's train set contains points from AFTER the break, so it silently\")\nprint(\"blends both regimes and understates how badly a fixed model degrades going forward\")\n",
            "output": "true beta before the break   0.40     true beta after the break   -0.10\nshuffled split beta fit on train    0.1329   test MSE 0.3217\nwalk-forward beta fit on the past    0.3942   test MSE 0.5051\nthe shuffled split's train set contains points from AFTER the break, so it silently\nblends both regimes and understates how badly a fixed model degrades going forward"
          }
        },
        {
          "name": "Recency weighting trades a little noise for tracking a moving target",
          "explain": "<p>When a true relationship drifts gradually rather than jumping between discrete regimes, an equally-weighted fit over a long window estimates the average relationship over that whole window, which can be a poor description of where the relationship actually is today. Weighting recent observations more heavily -- typically with exponential decay set by a half-life -- trades some extra variance for a lower bias toward the current value.</p><p>The snippet builds a coefficient drifting linearly from 0.20 to 0.55 over a five-hundred-observation window and compares an equally-weighted fit against an exponentially-weighted fit with a sixty-day half-life. The equally-weighted fit estimates 0.377, an error of 0.173 against the current true value of 0.550; the exponentially-weighted fit estimates 0.530, an error of only 0.020.</p><p>A desk cares because this bias-variance trade is exactly the same one week 1's weighted least squares made for known heteroskedasticity, applied here to an unknown but structurally different problem -- tracking a moving target rather than downweighting known noisier observations -- and getting the half-life of the weighting right requires the same kind of thinking as getting a reversion signal's own timescale right in week 5.</p>",
          "formula": "w_i = \\exp(-\\lambda \\cdot \\text{age}_i), \\qquad \\lambda = \\frac{\\ln 2}{\\text{half-life}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(64)\nn = 500\ntrue_beta_now, true_beta_old = 0.55, 0.20\nx = rng.normal(0, 1, n)\nbeta_path = np.linspace(true_beta_old, true_beta_now, n)   # the true relationship is drifting\ny = beta_path * x + rng.normal(0, 0.4, n)\n\ndef wls_beta(x, y, w):\n    X = np.column_stack([np.ones(len(x)), x])\n    W = np.diag(w)\n    return np.linalg.solve(X.T @ W @ X, X.T @ W @ y)[1]\n\nequal_w = np.ones(n)\nhalflife = 60\ndecay = np.log(2) / halflife\nage = np.arange(n)[::-1]\nexp_w = np.exp(-decay * age)\n\nbeta_equal = wls_beta(x, y, equal_w)\nbeta_exp = wls_beta(x, y, exp_w)\n\nprint(f\"true beta today (most recent)   {true_beta_now:.3f}\")\nprint(f\"equally-weighted fit on all {n} obs      {beta_equal:.4f}   error {abs(beta_equal-true_beta_now):.4f}\")\nprint(f\"exponentially-weighted (half-life {halflife}d) fit   {beta_exp:.4f}   error {abs(beta_exp-true_beta_now):.4f}\")\nprint(\"equal weighting estimates the AVERAGE relationship over the whole window;\")\nprint(\"recency weighting trades a little extra noise for tracking where the relationship is now\")\n",
            "output": "true beta today (most recent)   0.550\nequally-weighted fit on all 500 obs      0.3769   error 0.1731\nexponentially-weighted (half-life 60d) fit   0.5300   error 0.0200\nequal weighting estimates the AVERAGE relationship over the whole window;\nrecency weighting trades a little extra noise for tracking where the relationship is now"
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "OLS pulled by 5% contaminated data, against a robust fit",
        "params": {
          "n": 300,
          "beta": 0.4,
          "noise": 1.2,
          "seed": 610,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Using squared-error loss by default without checking whether a handful of contaminated observations are dominating the fit.",
        "Reporting only a mean-based model's central forecast when the risk that matters is in the conditional tail, which a mean-based model cannot describe.",
        "Cross-validating a time series with a random shuffle, which can leak post-regime-change information into a pre-change training fold."
      ],
      "check": [
        {
          "q": "5% of a dataset is contaminated with large outliers. Compared to OLS, a Huber-loss fit will typically:",
          "options": [
            "Be pulled by the outliers by the same amount as OLS",
            "Be far less affected, since Huber loss grows linearly rather than quadratically for large residuals",
            "Ignore the clean 95% of the data entirely",
            "Only work if the outliers are removed first"
          ],
          "answer": 1,
          "why": "Huber loss caps the influence of large residuals by switching from quadratic to linear growth past a threshold, which is exactly why the snippet's Huber fit recovered the true slope far more closely than OLS."
        },
        {
          "q": "The 90th percentile regression slope is much smaller than the 10th percentile regression slope for the same predictor. This means:",
          "options": [
            "The median regression must be wrong",
            "The spread (or shape) of the conditional outcome distribution changes with the predictor, which a single mean regression cannot show",
            "Quantile regression cannot be used with heteroskedastic data",
            "The 90th percentile line must lie below the 10th percentile line"
          ],
          "answer": 1,
          "why": "Different quantile slopes reveal that the conditional distribution's shape -- not just its centre -- depends on the predictor; a mean-based regression only reports one summary and cannot show this fanning pattern."
        },
        {
          "q": "A time series with a regime change halfway through is evaluated with a randomly shuffled 80/20 train/test split. The resulting test-set error is likely to be:",
          "options": [
            "An unbiased estimate of forward-looking, walk-forward performance",
            "Overly optimistic, because the training set can contain post-change data a true walk-forward model would never have seen",
            "Identical to a walk-forward split's error by construction",
            "Undefined if there is a regime change"
          ],
          "answer": 1,
          "why": "Random shuffling ignores time ordering, letting the training fold see data from after the regime change. This produces a rosier, and wrong, picture of how the model would have performed trading forward in real time."
        },
        {
          "q": "An exponentially-weighted fit with a 60-day half-life versus an equally-weighted fit over the same long window will typically show:",
          "options": [
            "Identical coefficients always",
            "Lower bias toward the CURRENT value of a drifting relationship, at the cost of somewhat higher variance",
            "Lower variance and lower bias simultaneously, with no trade-off",
            "Better performance only if the relationship is constant"
          ],
          "answer": 1,
          "why": "Recency weighting is a bias-variance trade: it tracks a moving target's current value more closely (lower bias) but uses less effective data (higher variance) than an equally-weighted fit, as the snippet's error comparison (0.173 vs 0.020) shows directly."
        }
      ]
    },
    {
      "n": 7,
      "title": "Model evaluation II: overfitting and the deflated Sharpe ratio",
      "topics": [
        "the multiple-testing problem in strategy research",
        "the deflated Sharpe ratio",
        "Sharpe-ratio haircut heuristics",
        "standard errors under serial correlation"
      ],
      "concepts": [
        {
          "name": "The best of many random tries looks like a discovery",
          "explain": "<p>If two hundred strategy variants are tried and every single one has zero true skill by construction, the BEST of those two hundred will still show an impressive backtested Sharpe ratio, purely because it is the maximum of a distribution, and the expectation of a maximum grows with how many draws you take from it.</p><p>The snippet generates two hundred pure-noise return series -- zero true skill in every one -- and reports the best annualised Sharpe found: 2.576, despite the mean Sharpe across all two hundred being essentially zero, -0.038. A separate calculation shows that with two hundred pure-noise variants and five hundred days of data, the probability that at least one of them clears an annualised Sharpe of 1.0 purely by chance is, in this simulation, 1.0000 -- essentially certain.</p><p>A desk cares because this is the mechanism behind almost every backtest that looks too good: not fraud, not a bug, just the ordinary statistics of taking the best of many tries and reporting it as if it were the only try. A research process that does not track how many variants were tried has no way to tell a real discovery from this effect.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(71)\nn_days, n_variants = 500, 200\n# every variant is PURE NOISE: no true edge anywhere\nreturns = rng.normal(0, 1, size=(n_days, n_variants)) * 0.01\nsharpes = returns.mean(axis=0) / returns.std(axis=0) * np.sqrt(252)\n\nbest_idx = np.argmax(sharpes)\nprint(f\"variants tried                {n_variants}\")\nprint(f\"true skill in every variant   0 (by construction)\")\nprint(f\"best in-sample annualised Sharpe found   {sharpes[best_idx]:.3f}\")\nprint(f\"mean Sharpe across all {n_variants} variants   {sharpes.mean():.3f}\")\nprint(f\"P(a pure-noise variant clears Sharpe 1.0 by chance, out of {n_variants} tries)  \"\n      f\"{np.mean(np.max(rng.normal(0,1,size=(n_days,n_variants)),axis=0)/rng.normal(0,1,size=(n_days,n_variants)).std(axis=0)*np.sqrt(252) > 1.0):.4f}\")\nprint(\"the single best result out of many random tries looks like a discovery;\")\nprint(\"it is the maximum of a distribution, and its expectation grows with the number of tries\")\n",
            "output": "variants tried                200\ntrue skill in every variant   0 (by construction)\nbest in-sample annualised Sharpe found   2.576\nmean Sharpe across all 200 variants   -0.038\nP(a pure-noise variant clears Sharpe 1.0 by chance, out of 200 tries)  1.0000\nthe single best result out of many random tries looks like a discovery;\nit is the maximum of a distribution, and its expectation grows with the number of tries"
          }
        },
        {
          "name": "The deflated Sharpe ratio corrects for exactly this",
          "explain": "<p>Bailey and Lopez de Prado's deflated Sharpe ratio asks a precise question: given the number of independent variants tried, what Sharpe ratio would you expect from pure luck alone, and how far above that chance-implied benchmark does the best result actually sit, once you also adjust the estimate's own standard error for the sample size, skewness and kurtosis?</p><p>The snippet evaluates a best-in-search annualised Sharpe of 1.35 against different assumed search sizes. Tried against only ten variants, the chance-implied benchmark is 1.118 and the deflated Sharpe probability -- the probability the true Sharpe exceeds zero, given the search -- is 0.628, reasonably convincing. Tried against the actual two hundred variants, the benchmark rises to 1.963, ABOVE the observed 1.35, and the deflated Sharpe probability collapses to 0.195: the result is now indistinguishable from noise, once the true size of the search is accounted for.</p><p>A desk cares because this single number -- how many variants were genuinely tried, honestly counted -- is often the single most consequential piece of metadata about a backtest, more consequential than almost any modelling choice, and it is exactly the number that is easiest to lose track of, or to under-report, in an iterative research process.</p>",
          "formula": "\\widehat{SR}_0 = \\sqrt{\\operatorname{Var}[\\widehat{SR}]}\\Big[(1-\\gamma)\\Phi^{-1}\\big(1-\\tfrac{1}{N}\\big) + \\gamma\\,\\Phi^{-1}\\big(1-\\tfrac{1}{Ne}\\big)\\Big]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom scipy.stats import norm\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(72)\n\ndef deflated_sharpe_prob(sr_hat, n_trials, T, skew=0.0, kurt=3.0, sr_var_across_trials=None):\n    \"\"\"Bailey & Lopez de Prado's deflated Sharpe ratio: probability the BEST of many\n    trials beats a benchmark implied by chance alone, adjusting for T, skew and kurtosis.\"\"\"\n    if sr_var_across_trials is None:\n        sr_var_across_trials = 1.0 / T          # a standard assumption: unit-variance trial Sharpes\n    euler_gamma = 0.5772156649\n    if n_trials <= 1:\n        e_max = 0.0                      # no search, no multiple-testing inflation to correct for\n    else:\n        e_max = (1 - euler_gamma) * norm.ppf(1 - 1.0 / n_trials) + \\\n                euler_gamma * norm.ppf(1 - 1.0 / (n_trials * np.e))\n    sr0 = np.sqrt(sr_var_across_trials) * e_max      # the \"benchmark Sharpe expected from luck alone\"\n    se = np.sqrt((1 - skew * sr_hat + (kurt - 1) / 4 * sr_hat**2) / (T - 1))\n    dsr = norm.cdf((sr_hat - sr0) / se)\n    return sr0, dsr\n\nn_variants, T = 200, 500\nobserved_best_sharpe = 1.35 / np.sqrt(252) * np.sqrt(252)   # e.g. an annualised 1.35 found in search, in monthly units below\nsr_hat_daily = 1.35 / np.sqrt(252)\n\nsr0, dsr = deflated_sharpe_prob(sr_hat_daily, n_variants, T)\nprint(f\"number of strategy variants tried during research   {n_variants}\")\nprint(f\"best in-sample annualised Sharpe found               1.35\")\nprint(f\"chance-implied benchmark Sharpe from trying {n_variants} variants (annualised)   {sr0*np.sqrt(252):.3f}\")\nprint(f\"deflated Sharpe probability (P[true SR > 0] given the search)   {dsr:.4f}\")\nfor nv in (1, 10, 50, 200, 1000):\n    sr0_i, dsr_i = deflated_sharpe_prob(sr_hat_daily, nv, T)\n    print(f\"  if only {nv:5d} variant(s) had been tried: benchmark {sr0_i*np.sqrt(252):.3f}, DSR {dsr_i:.4f}\")\n",
            "output": "number of strategy variants tried during research   200\nbest in-sample annualised Sharpe found               1.35\nchance-implied benchmark Sharpe from trying 200 variants (annualised)   1.963\ndeflated Sharpe probability (P[true SR > 0] given the search)   0.1945\n  if only     1 variant(s) had been tried: benchmark 0.000, DSR 0.9710\n  if only    10 variant(s) had been tried: benchmark 1.118, DSR 0.6278\n  if only    50 variant(s) had been tried: benchmark 1.616, DSR 0.3543\n  if only   200 variant(s) had been tried: benchmark 1.963, DSR 0.1945\n  if only  1000 variant(s) had been tried: benchmark 2.311, DSR 0.0886"
          }
        },
        {
          "name": "A haircut heuristic is a cheap first pass at the same idea",
          "explain": "<p>The full deflated Sharpe machinery is not always necessary for a quick sanity check; a simpler heuristic shrinks the reported Sharpe ratio toward zero by an amount that grows with the (log of the) number of variants tried and shrinks with the amount of data used, giving a rough, conservative haircut before running the full calculation.</p><p>The snippet applies exactly such a heuristic across three in-sample Sharpe ratios and three trial counts, all evaluated on 250 days of data. A Sharpe of 0.80 found after only one trial keeps its full value; found after 500 trials, the same reported Sharpe is haircut down to 0.634. A Sharpe of 2.00, which looks spectacular, is still haircut to 1.834 after 500 trials -- proportionally a smaller hit, because the correction here is additive on the Sharpe scale, not multiplicative.</p><p>A desk cares because a haircut this cheap to compute -- it needs only the trial count and the sample size -- should be the FIRST thing applied to any newly discovered strategy before further work is invested in it, precisely because it catches the most common and most damaging failure mode in strategy research at almost no cost.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\n# a simple haircut heuristic: shrink an in-sample Sharpe toward zero based on the\n# number of independent trials, using the expected-maximum-of-N-normals approximation\ndef haircut_sharpe(sr_hat, n_trials, T):\n    euler_gamma = 0.5772156649\n    e_max = (1 - euler_gamma) * np.log(n_trials) if n_trials > 1 else 0.0   # crude but monotone proxy\n    inflation = e_max / np.sqrt(T)\n    return max(sr_hat - inflation, 0.0)\n\nT = 250\nprint(f\"{'in-sample SR':>13}{'n trials':>10}{'implied inflation':>19}{'haircut SR':>12}\")\nfor sr_hat in (0.8, 1.2, 2.0):\n    for n_trials in (1, 20, 500):\n        hc = haircut_sharpe(sr_hat, n_trials, T)\n        infl = sr_hat - hc\n        print(f\"{sr_hat:13.2f}{n_trials:10d}{infl:19.3f}{hc:12.3f}\")\nprint(\"\\nthe haircut grows with the log of how many things were tried and shrinks with more data;\")\nprint(\"a strategy discovered on 20 years of daily data survives search far better than one on 1 year\")\n",
            "output": " in-sample SR  n trials  implied inflation  haircut SR\n         0.80         1              0.000       0.800\n         0.80        20              0.080       0.720\n         0.80       500              0.166       0.634\n         1.20         1              0.000       1.200\n         1.20        20              0.080       1.120\n         1.20       500              0.166       1.034\n         2.00         1              0.000       2.000\n         2.00        20              0.080       1.920\n         2.00       500              0.166       1.834\n\nthe haircut grows with the log of how many things were tried and shrinks with more data;\na strategy discovered on 20 years of daily data survives search far better than one on 1 year"
          }
        },
        {
          "name": "Overlapping holding periods understate their own uncertainty",
          "explain": "<p>A strategy with a multi-day holding period, sampled daily, produces returns that overlap and are therefore strongly serially correlated even when the underlying trades are genuinely independent events. The ordinary, independence-assuming standard error of the mean badly understates the true uncertainty in exactly this situation, which is the time-series analogue of the multiple-testing problem: both quietly assume more independent information than the data actually contains.</p><p>The snippet builds a ten-day rolling average of daily noise, which induces a lag-1 autocorrelation of 0.899, and compares the naive standard error of the mean, 0.000071, against a Newey-West standard error that accounts for ten lags of autocorrelation, 0.000191 -- 2.7 times larger. The naive standard error understates the truth by a factor of 0.372.</p><p>A desk cares because a t-statistic computed with the naive standard error on overlapping returns is not conservative, it is actively wrong in the optimistic direction, and the standard remedy in cross-validation -- purging overlapping observations from the training and test sets, with an embargo period around the boundary -- exists specifically to prevent this same overlap from contaminating an out-of-sample evaluation.</p>",
          "formula": "\\hat\\sigma^2_{NW} = \\hat\\sigma^2_0 + 2\\sum_{k=1}^{L}\\Big(1-\\frac{k}{L+1}\\Big)\\hat\\gamma_k",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(74)\nn = 2000\n# overlapping, autocorrelated trade returns (e.g. a 10-day holding period sampled daily)\nraw = rng.normal(0.0003, 0.01, n)\noverlap = np.convolve(raw, np.ones(10) / 10, mode=\"valid\")   # induces strong serial correlation\n\nacf1 = np.corrcoef(overlap[:-1], overlap[1:])[0, 1]\n\ndef naive_se(x):\n    return x.std(ddof=1) / np.sqrt(len(x))\n\ndef newey_west_se(x, lags=10):\n    n = len(x)\n    xm = x - x.mean()\n    var = (xm @ xm) / n\n    for k in range(1, lags + 1):\n        w = 1 - k / (lags + 1)\n        cov = (xm[:-k] @ xm[k:]) / n\n        var += 2 * w * cov\n    return np.sqrt(var / n)\n\nse_naive = naive_se(overlap)\nse_nw = newey_west_se(overlap, lags=10)\nprint(f\"lag-1 autocorrelation of overlapping returns   {acf1:.3f}\")\nprint(f\"naive iid standard error of the mean     {se_naive:.6f}\")\nprint(f\"Newey-West (10-lag) standard error        {se_nw:.6f}\")\nprint(f\"understatement factor (naive / true)      {se_naive/se_nw:.3f}\")\nprint(\"overlapping holding periods are the time-series version of the multiple-testing\")\nprint(\"problem: the naive standard error assumes independence that a purging/embargo scheme removes\")\n",
            "output": "lag-1 autocorrelation of overlapping returns   0.899\nnaive iid standard error of the mean     0.000071\nNewey-West (10-lag) standard error        0.000191\nunderstatement factor (naive / true)      0.372\noverlapping holding periods are the time-series version of the multiple-testing\nproblem: the naive standard error assumes independence that a purging/embargo scheme removes"
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "The best of 200 pure-noise Sharpe ratios looks like a discovery",
        "params": {
          "sampler": "normal",
          "params": {
            "mean": 0,
            "sd": 1
          },
          "bins": 40,
          "overlay": true,
          "seed": 71
        }
      },
      "pitfalls": [
        "Reporting the best-performing variant from a research process without also reporting how many variants were tried.",
        "Treating a Sharpe ratio's ordinary standard error as valid when the underlying returns come from an overlapping, multi-day holding period.",
        "Skipping even the cheap haircut heuristic on a newly discovered strategy before investing further research time in it."
      ],
      "check": [
        {
          "q": "Two hundred strategy variants are tried, every one with zero true skill. The single best Sharpe ratio among them will:",
          "options": [
            "Be close to zero, matching the true skill",
            "Typically look impressive purely because it is the maximum of many draws",
            "Always exceed a Sharpe of 3",
            "Be identical across all 200 variants"
          ],
          "answer": 1,
          "why": "The expectation of the maximum of many independent draws grows with the number of draws, even when every individual draw has an expectation of zero. This is exactly the mechanism the snippet demonstrates."
        },
        {
          "q": "A strategy's deflated Sharpe probability falls from 0.63 (assuming 10 variants tried) to 0.19 (assuming the true count of 200 variants tried). The correct interpretation is:",
          "options": [
            "The strategy became worse when the count was corrected",
            "The apparent skill was always the same; only the honest accounting of the search size changed how much of it can be trusted as real",
            "The deflated Sharpe ratio formula must have an error",
            "More variants tried always increases the deflated Sharpe"
          ],
          "answer": 1,
          "why": "The backtest itself did not change; only the number of trials used to interpret it did. Under-reporting the true search size is what produces a falsely reassuring deflated Sharpe probability."
        },
        {
          "q": "A ten-day rolling-average return series has a lag-1 autocorrelation of 0.90. Using the naive iid standard error of the mean on this series will:",
          "options": [
            "Correctly estimate the uncertainty",
            "Understate the true standard error, since it ignores the strong serial correlation",
            "Overstate the true standard error",
            "Have no effect, since the mean itself is unbiased"
          ],
          "answer": 1,
          "why": "Positive serial correlation means the observations carry less independent information than their count suggests. A Newey-West or similar correction, as the snippet shows, gives a substantially larger and more honest standard error."
        }
      ]
    },
    {
      "n": 8,
      "title": "Market making as a strategy family",
      "topics": [
        "spread capture and inventory risk",
        "the reservation price and quote skew",
        "adverse selection",
        "market making across venues and asset classes"
      ],
      "concepts": [
        {
          "name": "Spread capture is clean; the inventory it leaves behind is not",
          "explain": "<p>A market maker quoting a fixed spread around the mid price earns that spread on every trade against uninformed flow, but every fill also changes inventory, and with purely random, uninformed order flow, inventory itself follows a random walk with no natural tendency to return to zero.</p><p>The snippet simulates twenty thousand ticks of a maker quoting a 4-basis-point round-trip spread against coin-flip buy/sell flow. The spread is captured cleanly -- mark-to-market P&amp;L ends at 523.92 -- but inventory wanders to a final value of 228, with a range of -2 to 246 over the run, entirely from the accumulated randomness of which side traded when.</p><p>A desk cares because this is the market maker's fundamental problem in one simulation: the spread you are paid is a known, bounded quantity, but the inventory risk that same flow leaves you holding is unbounded unless something actively manages it, which is exactly what the next concept, quote skew, is for.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(81)\nn_ticks = 20000\nmid = 100.0\nhalf_spread_quoted = 0.02\ninventory = 0\ncash = 0.0\ninv_path, pnl_path = [], []\nfor t in range(n_ticks):\n    mid += rng.normal(0, 0.01)\n    is_buy = rng.random() < 0.5    # uninformed flow arrives at the quoted spread\n    if is_buy:\n        cash -= (mid - half_spread_quoted); inventory += 1\n    else:\n        cash += (mid + half_spread_quoted); inventory -= 1\n    inv_path.append(inventory)\n    pnl_path.append(cash + inventory * mid)\n\ninv_path, pnl_path = np.array(inv_path), np.array(pnl_path)\nprint(f\"final inventory            {inv_path[-1]}\")\nprint(f\"inventory range            [{inv_path.min()}, {inv_path.max()}]\")\nprint(f\"final mark-to-market P&L   {pnl_path[-1]:.2f}\")\nprint(f\"spread captured per trade  {2*half_spread_quoted:.4f}\")\nprint(f\"P&L volatility (mark-to-market)   {np.diff(pnl_path).std():.4f}\")\nprint(\"with pure random flow the spread is captured cleanly, but inventory random-walks;\")\nprint(\"that unmanaged inventory is exactly what a quoting model has to keep from wandering\")\n",
            "output": "final inventory            228\ninventory range            [-2, 246]\nfinal mark-to-market P&L   523.92\nspread captured per trade  0.0400\nP&L volatility (mark-to-market)   1.4454\nwith pure random flow the spread is captured cleanly, but inventory random-walks;\nthat unmanaged inventory is exactly what a quoting model has to keep from wandering"
          }
        },
        {
          "name": "Skewing quotes away from mid is the maker's own risk control",
          "explain": "<p>The Avellaneda-Stoikov framework formalises inventory management by computing a reservation price -- the price at which the maker is indifferent to buying or selling one more unit -- that sits away from the true mid by an amount proportional to inventory, risk aversion and remaining variance, and then quoting a spread symmetrically around that reservation price rather than around the mid.</p><p>The snippet computes the reservation price at five inventory levels. At zero inventory the reservation price equals mid exactly; at an inventory of +40 (long), the reservation price sits 0.0016 BELOW mid, making the maker's own quotes relatively keener to sell and more reluctant to buy; at -40 (short), it sits 0.0016 above mid, the mirror image. The optimal quoted half-spread, computed separately, comes to 0.6454 in this snapshot.</p><p>A desk cares because this single formula is the entire mechanism by which a market maker converts an unwanted, growing inventory position back toward zero without ever stepping away from the market: it is a continuous, automatic nudge on every quote, rather than a discrete decision to stop quoting or to hedge in a separate market.</p>",
          "formula": "r(q) = S - q\\,\\gamma\\sigma^2(T-t), \\qquad \\delta^* = \\frac{\\gamma\\sigma^2(T-t)}{2} + \\frac{1}{\\gamma}\\ln\\!\\Big(1+\\frac{\\gamma}{k}\\Big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\n# Avellaneda-Stoikov-style reservation price and optimal half-spread (a static snapshot,\n# not the full dynamic program): a market maker skews quotes away from the mid by an\n# amount proportional to inventory, risk aversion and remaining variance.\nS, sigma, gamma, T_remain, k = 100.0, 0.02, 0.1, 1.0, 1.5\n\ndef reservation_price(q):\n    return S - q * gamma * sigma**2 * T_remain\n\ndef optimal_half_spread(gamma_, sigma_, T_, k_):\n    return gamma_ * sigma_**2 * T_ / 2 + (1 / gamma_) * np.log(1 + gamma_ / k_)\n\nprint(f\"{'inventory q':>12}{'reservation price':>19}{'skew from mid':>15}\")\nfor q in (-40, -10, 0, 10, 40):\n    r = reservation_price(q)\n    print(f\"{q:12d}{r:19.4f}{r - S:15.4f}\")\n\nhalf_spread = optimal_half_spread(gamma, sigma, T_remain, k)\nprint(f\"\\noptimal quoted half-spread around the reservation price   {half_spread:.4f}\")\nprint(\"a long inventory shifts the reservation price BELOW mid, making the maker keener\")\nprint(\"to sell and reluctant to buy more -- the skew is the quoting model's own risk control\")\n",
            "output": " inventory q  reservation price  skew from mid\n         -40           100.0016         0.0016\n         -10           100.0004         0.0004\n           0           100.0000         0.0000\n          10            99.9996        -0.0004\n          40            99.9984        -0.0016\n\noptimal quoted half-spread around the reservation price   0.6454\na long inventory shifts the reservation price BELOW mid, making the maker keener\nto sell and reluctant to buy more -- the skew is the quoting model's own risk control"
          }
        },
        {
          "name": "Adverse selection is the gap between P&L on clean flow and toxic flow",
          "explain": "<p>Not all order flow is uninformed. Some fraction of it arrives from a counterparty who knows, or correctly predicts, that the price is about to move, and trading against that flow at a fixed spread loses money on average, in exactly the direction the informed trader anticipated -- this is adverse selection, and it is directly measurable by conditioning P&amp;L on whether the flow that generated it was informed.</p><p>The snippet marks 8% of simulated flow as informed, arriving just before a larger, directional price move, and tracks P&amp;L per tick conditional on that flag. Mean P&amp;L per tick against clean flow is +0.02277; against toxic flow it falls to +0.01642 -- still positive here because the spread partly compensates, but visibly and measurably worse. Over the full run the maker still finishes with a positive mark-to-market P&amp;L of 668.06, showing the clean flow's contribution dominates when toxic flow is a minority of volume.</p><p>A desk cares because the gap between these two conditional means IS the cost of adverse selection in dollar terms, and it is a legitimate regression target: any observable correlated with which counterparties tend to be informed -- order size, venue, time of day, recent volatility -- can be used to widen quotes selectively rather than uniformly, which is a strictly better response than either ignoring the problem or quoting wider to everyone.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(83)\nn = 30000\nmid = 100.0\nhalf_spread = 0.02\ninventory, cash = 0, 0.0\ntoxic_flag = rng.random(n) < 0.08     # 8% of flow is \"informed\": arrives just before an adverse move\nmid_path = np.zeros(n)\npnl = np.zeros(n)\nfor t in range(n):\n    if toxic_flag[t]:\n        move = rng.choice([-1, 1]) * rng.uniform(0.05, 0.15)\n    else:\n        move = rng.normal(0, 0.01)\n    is_buy = rng.random() < 0.5\n    if is_buy:\n        cash -= (mid - half_spread); inventory += 1\n    else:\n        cash += (mid + half_spread); inventory -= 1\n    mid += move\n    mid_path[t] = mid\n    pnl[t] = cash + inventory * mid\n\npnl_on_toxic = np.diff(pnl)[toxic_flag[1:]]\npnl_on_clean = np.diff(pnl)[~toxic_flag[1:]]\nprint(f\"trades against informed (toxic) flow   {toxic_flag.sum()} of {n}\")\nprint(f\"mean P&L per tick, toxic flow present     {pnl_on_toxic.mean():+.5f}\")\nprint(f\"mean P&L per tick, clean flow only         {pnl_on_clean.mean():+.5f}\")\nprint(f\"total mark-to-market P&L                   {pnl[-1]:.3f}\")\nprint(\"the spread earns money on clean flow and loses it on toxic flow; adverse selection\")\nprint(\"is exactly the gap between those two conditional means, and it is a regression target\")\n",
            "output": "trades against informed (toxic) flow   2361 of 30000\nmean P&L per tick, toxic flow present     +0.01642\nmean P&L per tick, clean flow only         +0.02277\ntotal mark-to-market P&L                   668.063\nthe spread earns money on clean flow and loses it on toxic flow; adverse selection\nis exactly the gap between those two conditional means, and it is a regression target"
          }
        },
        {
          "name": "The same problem, in continuous, quote-driven and funding-rate form",
          "explain": "<p>Market making looks different across venues -- continuous limit order books in lit equities, request-for-quote in FX, and perpetual futures in crypto -- but the underlying problem of spread capture against inventory and adverse selection is unchanged. A perpetual's funding rate adds a genuinely new wrinkle: it is a periodic payment, proportional to the basis between the perpetual price and its index, that pulls the two back together, which turns quoting a perp into a carry trade on that basis layered on top of everything else.</p><p>The snippet simulates a perpetual basis that mean-reverts toward zero under a funding-rate pull with strength kappa of 0.02, giving a basis half-life of 34.3 periods and a mean funding rate of +0.002228 per period given the simulated basis. Typical quoted edges are also compared across venues: 0.05% for continuous lit equities, 0.08% for quote-driven FX, and a funding-adjusted crypto perp edge of only 0.0083% once the funding leg is netted in.</p><p>A desk cares because a market maker moving from equities to FX to crypto is not learning a new problem each time, but is picking up one additional carry-style term at each step -- funding on a perp, forward points in FX -- that has to be priced into the quote alongside the ordinary spread-versus-inventory trade-off already familiar from any venue.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\n# funding rate mean-reversion on a perpetual: the funding payment pulls the perp\n# price back toward the index, which is itself a carry-style spread trade\nrng = np.random.default_rng(84)\nn = 2000\nindex = 100 + np.cumsum(rng.normal(0, 0.3, n))\nkappa = 0.02          # how strongly funding pulls the basis back\nbasis = np.zeros(n)   # perp - index\nfunding_rate = np.zeros(n)\nfor t in range(1, n):\n    funding_rate[t] = kappa * basis[t-1]                     # funding proportional to basis\n    basis[t] = basis[t-1] * (1 - kappa) + rng.normal(0, 0.05)\nperp = index + basis\n\nquote_venues = {\"lit equity (continuous DTB)\": 0.0005, \"FX (quote-driven, RFQ)\": 0.0008,\n                \"crypto perp (funding-adjusted)\": funding_rate[-1] / 100}\nprint(f\"perp - index (basis) mean   {basis.mean():+.4f}   sd {basis.std():.4f}\")\nprint(f\"mean funding rate implied by the basis   {funding_rate[1:].mean():+.6f} per period\")\nprint(f\"basis half-life implied by kappa={kappa}   {np.log(0.5)/np.log(1-kappa):.1f} periods\")\nfor venue, typical_edge in quote_venues.items():\n    print(f\"typical quoted edge, {venue:<32}   {typical_edge:.4%}\")\nprint(\"a perpetual's funding leg makes market making there a carry trade on the basis,\")\nprint(\"on top of the same inventory and adverse-selection problem every other venue has\")\n",
            "output": "perp - index (basis) mean   +0.1115   sd 0.2020\nmean funding rate implied by the basis   +0.002228 per period\nbasis half-life implied by kappa=0.02   34.3 periods\ntypical quoted edge, lit equity (continuous DTB)        0.0500%\ntypical quoted edge, FX (quote-driven, RFQ)             0.0800%\ntypical quoted edge, crypto perp (funding-adjusted)     0.0083%\na perpetual's funding leg makes market making there a carry trade on the basis,\non top of the same inventory and adverse-selection problem every other venue has"
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "Market-maker P&L per tick: clean flow vs informed flow",
        "params": {
          "sampler": "mixture",
          "params": {
            "weights": [
              0.92,
              0.08
            ],
            "means": [
              0.023,
              -0.05
            ],
            "sds": [
              0.01,
              0.03
            ]
          },
          "bins": 40,
          "overlay": true,
          "seed": 883
        }
      },
      "pitfalls": [
        "Quoting a fixed spread with no inventory skew and treating the resulting position drift as an unavoidable cost, rather than as the problem the reservation price directly solves.",
        "Measuring only aggregate P&L and missing that it is being earned entirely on clean flow while quietly bleeding out on toxic flow.",
        "Forgetting that a perpetual's funding leg turns quoting it into a carry trade in addition to an ordinary market-making problem."
      ],
      "check": [
        {
          "q": "A market maker quotes a fixed spread against purely random, uninformed order flow with no inventory management. Over time, inventory will:",
          "options": [
            "Stay near zero because buys and sells cancel out on average",
            "Follow a random walk with no natural tendency to return to zero",
            "Always grow in one direction",
            "Be fully hedged automatically by the spread"
          ],
          "answer": 1,
          "why": "With flow equally likely to be a buy or a sell, inventory is a simple random walk, and a random walk has no mean-reverting pull back toward zero on its own; something else (quote skew) has to provide that."
        },
        {
          "q": "In the Avellaneda-Stoikov reservation-price framework, a market maker with LONG inventory will see their reservation price sit:",
          "options": [
            "Above the true mid price",
            "Below the true mid price",
            "Exactly at the mid price regardless of inventory",
            "Undefined for positive inventory"
          ],
          "answer": 1,
          "why": "A long position makes the maker want to sell more and buy less, so the reservation price shifts below mid, which naturally skews both the bid and the ask downward and encourages inventory back toward zero."
        },
        {
          "q": "P&L per tick against clean flow is +0.023 and against toxic (informed) flow is +0.016, both positive. The correct conclusion is:",
          "options": [
            "Adverse selection does not exist here since both are profitable",
            "Adverse selection is real and measurable as the gap between the two conditional means, even though both remain profitable in this case",
            "The maker should stop quoting entirely",
            "The two numbers should always be identical"
          ],
          "answer": 1,
          "why": "Adverse selection is defined by the DIFFERENCE in conditional profitability, not by whether the toxic-flow P&L happens to be positive or negative; here the spread is wide enough to stay profitable against both, but measurably less so against toxic flow."
        },
        {
          "q": "Quoting a perpetual futures contract adds which additional consideration, beyond ordinary spread-vs-inventory market making?",
          "options": [
            "None; perpetuals are quoted identically to any other instrument",
            "The funding rate, which makes the position also a carry trade on the perp-index basis",
            "Perpetuals cannot be market made",
            "Funding only matters for options"
          ],
          "answer": 1,
          "why": "A perpetual's funding payment is proportional to its basis against the index and pulls the two together over time, meaning a market maker's inventory in a perp also carries a funding-rate carry exposure not present in a plain equity or FX quote."
        }
      ]
    },
    {
      "n": 9,
      "title": "Practical industry considerations",
      "topics": [
        "transaction costs and capacity",
        "survivorship and point-in-time data",
        "monitoring live performance for regime change",
        "allocating capital across strategies"
      ],
      "concepts": [
        {
          "name": "A paper Sharpe ratio is a ceiling, and costs are the first thing that lowers it",
          "explain": "<p>A strategy's gross, cost-free backtest Sharpe ratio is the best it will ever look; every basis point of realistic transaction cost, applied against the strategy's actual turnover, only ever lowers it from there, and the rate at which it falls tells you directly how much capacity margin the strategy has before it stops being worth running.</p><p>The snippet applies a range of costs to a strategy with a gross annualised Sharpe of 1.520 and roughly 30% average daily turnover. At 2 basis points of cost the net Sharpe is 1.359, keeping 89.4% of the gross; at 10 basis points it falls to 0.714, keeping 47.0%; at 20 basis points the strategy is net-negative, -0.091.</p><p>A desk cares because this single sweep -- net Sharpe as a function of assumed cost -- is the standard, cheap way to answer 'how much capacity margin does this strategy have' before ever trading it live, and a strategy that only clears zero at 5 basis points of cost has essentially no room for the costs to be worse than modelled, or for the book to grow larger than the size it was backtested at.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(91)\nn = 2000\ngross_ret = rng.normal(0.0004, 0.006, n)      # a decent-looking gross daily strategy\nturnover = np.abs(rng.normal(0.30, 0.08, n))  # fraction of book turned over each day\nturnover = np.clip(turnover, 0, None)\n\nprint(f\"{'cost per unit turnover':>22}{'net Sharpe':>13}{'% of gross Sharpe kept':>25}\")\ngross_sharpe = gross_ret.mean() / gross_ret.std() * np.sqrt(252)\nfor cost_bps in (0, 2, 5, 10, 20):\n    net_ret = gross_ret - turnover * cost_bps / 10000.0\n    net_sharpe = net_ret.mean() / net_ret.std() * np.sqrt(252)\n    print(f\"{cost_bps:22d}{net_sharpe:13.3f}{net_sharpe/gross_sharpe*100:25.1f}\")\n\n# capacity: the same edge in bps applied to a bigger book raises turnover's dollar footprint\nprint(f\"\\ngross annualised Sharpe (0 cost)   {gross_sharpe:.3f}\")\nprint(\"a signal's paper Sharpe is a ceiling, not an estimate; costs and the size of the book\")\nprint(\"both eat into it, and a strategy that only works at 5bp of cost has no capacity margin\")\n",
            "output": "cost per unit turnover   net Sharpe   % of gross Sharpe kept\n                     0        1.520                    100.0\n                     2        1.359                     89.4\n                     5        1.117                     73.5\n                    10        0.714                     47.0\n                    20       -0.091                     -6.0\n\ngross annualised Sharpe (0 cost)   1.520\na signal's paper Sharpe is a ceiling, not an estimate; costs and the size of the book\nboth eat into it, and a strategy that only works at 5bp of cost has no capacity margin"
          }
        },
        {
          "name": "Survivorship bias quietly deletes every future loser from the backtest",
          "explain": "<p>Backtesting a strategy on 'the universe of names that exist today, ten years ago' silently excludes every name that was delisted, went bankrupt, or was acquired out of underperformance somewhere along the way -- which means the historical sample used for the backtest is systematically better than the sample that was actually investable at each point in time.</p><p>The snippet simulates five hundred names with identical true expected returns, lets the worst-performing 15% be treated as 'delisted' by the end of the sample, and compares the mean daily return of the full, point-in-time universe against the survivors-only universe. The full universe's mean daily return is +0.000200; the survivors-only universe's is +0.000411 -- more than double, purely from deleting the eventual losers -- an annualised bias of +5.31%, despite every name having had the identical true expected return by construction.</p><p>A desk cares because this bias exists even when there is genuinely zero true difference in skill or edge across names, which makes it one of the most dangerous kinds of backtest error: it does not show up as an obvious anomaly, it just quietly makes every historical strategy look better than it would have been to actually run.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(92)\nn_names, n_days = 500, 750\n# survivorship: names that do badly are more likely to be delisted and DROPPED from\n# a naive \"current universe\" backtest, which biases the historical sample upward\ntrue_alpha = rng.normal(0, 0.0003, n_names)\nreturns = rng.normal(0.0002 + true_alpha[None, :], 0.02, size=(n_days, n_names))\ncum_ret = np.cumsum(returns, axis=0)\nsurvived = cum_ret[-1, :] > np.percentile(cum_ret[-1, :], 15)   # bottom 15% \"delisted\"\n\nfull_sample_mean = returns.mean()\nsurvivors_only_mean = returns[:, survived].mean()\nsurvivorship_bias = survivors_only_mean - full_sample_mean\n\nprint(f\"names in the full historical universe   {n_names}\")\nprint(f\"names that 'survive' to today            {survived.sum()}\")\nprint(f\"mean daily return, full (point-in-time) universe    {full_sample_mean:+.6f}\")\nprint(f\"mean daily return, survivors-only universe          {survivors_only_mean:+.6f}\")\nprint(f\"survivorship bias (survivors minus full)            {survivorship_bias:+.6f}\")\nprint(f\"annualised bias                                     {survivorship_bias*252:+.4%}\")\nprint(\"backtesting on 'the S&P 500 today, 10 years ago' quietly deletes every future loser\")\n",
            "output": "names in the full historical universe   500\nnames that 'survive' to today            425\nmean daily return, full (point-in-time) universe    +0.000200\nmean daily return, survivors-only universe          +0.000411\nsurvivorship bias (survivors minus full)            +0.000211\nannualised bias                                     +5.3111%\nbacktesting on 'the S&P 500 today, 10 years ago' quietly deletes every future loser"
          }
        },
        {
          "name": "A frozen model degrades silently until a rolling statistic catches it",
          "explain": "<p>A model fit once on historical data and then run unchanged in production will keep generating positions exactly as designed even after the relationship it was fit on has genuinely changed, and nothing about the model itself will announce that change; only a live, rolling performance statistic, watched continuously, will surface the degradation.</p><p>The snippet fits a model's position sizing once, on a regime where the true coefficient is 0.5, then runs it unchanged through a second regime where the true coefficient flips to -0.3. The rolling 60-day Sharpe ratio averages a strongly positive 5.109 in the first regime the model matches, then averages -3.713 once the regime has flipped -- and it takes 29 trading days after the break for the rolling statistic to first turn negative, a real detection lag even in this idealised setup.</p><p>A desk cares because this detection lag is the actual cost of monitoring only after the fact rather than continuously: the model does not fail instantly at the moment of the break, it fails gradually and then obviously, and the rolling statistic, not a re-run of the original backtest, is what a live desk should actually be watching day to day.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(93)\nn = 1000\n# a regime break halfway through live trading: the signal's true beta flips sign\ntrue_beta = np.where(np.arange(n) < 500, 0.5, -0.3)\nx = rng.normal(0, 1, n)\ny = true_beta * x + rng.normal(0, 1.5, n)   # noisy enough that no single day's Sharpe is absurd\n\nfitted_beta = 0.5   # the model was fit once, in-sample, on the first regime, and frozen\nstrategy_ret = fitted_beta * x * y   # position sized by the (stale) fitted beta, times realized move proxy\nwindow = 60\nrolling_sharpe = np.array([\n    strategy_ret[max(0, t-window):t].mean() / (strategy_ret[max(0, t-window):t].std() + 1e-9) * np.sqrt(252)\n    for t in range(window, n)\n])\n\nprint(f\"rolling {window}-day Sharpe, first half (model matches regime)   {rolling_sharpe[:440].mean():.3f}\")\nprint(f\"rolling {window}-day Sharpe, second half (regime has flipped)    {rolling_sharpe[440:].mean():.3f}\")\nprint(f\"days until rolling Sharpe first turns negative after the break   \"\n      f\"{np.argmax(rolling_sharpe[440:] < 0) if np.any(rolling_sharpe[440:] < 0) else -1}\")\nprint(\"a frozen model degrades silently until the rolling live Sharpe turns negative;\")\nprint(\"monitoring that rolling statistic, not re-trusting the backtest, is what catches the break\")\n",
            "output": "rolling 60-day Sharpe, first half (model matches regime)   5.109\nrolling 60-day Sharpe, second half (regime has flipped)    -3.713\ndays until rolling Sharpe first turns negative after the break   29\na frozen model degrades silently until the rolling live Sharpe turns negative;\nmonitoring that rolling statistic, not re-trusting the backtest, is what catches the break"
          }
        },
        {
          "name": "Allocating across strategy books is a portfolio problem, not a separate one",
          "explain": "<p>Once several strategies are running -- across the different asset classes and families this course has covered -- deciding how much capital to give each is exactly the same mean-variance allocation problem FINM 36700 poses for individual assets, with strategies standing in for assets, and it carries the identical estimation-error caveats.</p><p>The snippet allocates across five strategy 'books' -- equities stat-arb, futures carry, credit basis, FX carry and rates spread -- using their estimated means, volatilities and a common pairwise correlation. The mean-variance solution puts the largest weights on FX carry (+0.319) and credit basis (+0.304), smaller weights on futures carry (+0.037) and rates spread (+0.087), and achieves an annualised Sharpe of 1.155 against an equal-weighted 1.056 -- a modest, not dramatic, improvement, consistent with how little separation there usually is between well-run strategy books.</p><p>A desk cares because the temptation to hand-pick allocations by conviction, ignoring the covariance structure across strategies, reproduces exactly the estimation-error and concentration risks FINM 36700 documents for single-asset portfolios, just one level up: a book of five strategies that all quietly load on the same macro or liquidity factor is not five independent bets any more than five correlated stocks are.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(94)\nn_days, n_strats = 1500, 5\nmu = np.array([0.0003, 0.0002, 0.00025, 0.00018, 0.00022])\nsig = np.array([0.006, 0.008, 0.005, 0.004, 0.007])\nrho = 0.15\ncov = np.outer(sig, sig) * rho + np.diag(sig**2 * (1 - rho))\nrets = rng.multivariate_normal(mu, cov, size=n_days)\n\ninv_cov = np.linalg.inv(cov)\nraw_w = inv_cov @ mu\nw_meanvar = raw_w / np.sum(np.abs(raw_w))\nw_equal = np.ones(n_strats) / n_strats\n\nport_mv = rets @ w_meanvar\nport_eq = rets @ w_equal\nsharpe_mv = port_mv.mean() / port_mv.std() * np.sqrt(252)\nsharpe_eq = port_eq.mean() / port_eq.std() * np.sqrt(252)\n\nnames = [\"equities stat-arb\", \"futures carry\", \"credit basis\", \"FX carry\", \"rates spread\"]\nprint(\"mean-variance weights across the five strategy books:\")\nfor nm, w in zip(names, w_meanvar):\n    print(f\"  {nm:<20} {w:+.3f}\")\nprint(f\"\\nequal-weight annualised Sharpe     {sharpe_eq:.3f}\")\nprint(f\"mean-variance annualised Sharpe    {sharpe_mv:.3f}\")\nprint(\"allocating capital across strategy books IS a portfolio problem, with the same\")\nprint(\"estimation-error caveats as allocating across single names\")\n",
            "output": "mean-variance weights across the five strategy books:\n  equities stat-arb    +0.253\n  futures carry        +0.037\n  credit basis         +0.304\n  FX carry             +0.319\n  rates spread         +0.087\n\nequal-weight annualised Sharpe     1.056\nmean-variance annualised Sharpe    1.155\nallocating capital across strategy books IS a portfolio problem, with the same\nestimation-error caveats as allocating across single names"
          }
        }
      ],
      "widget": {
        "type": "efficient-frontier",
        "title": "Allocating capital across five strategy books, not five stocks",
        "params": {
          "mu": [
            0.075,
            0.045,
            0.09,
            0.1,
            0.055
          ],
          "sigma": [
            0.095,
            0.126,
            0.079,
            0.063,
            0.111
          ],
          "rho": 0.15,
          "rf": 0.0
        }
      },
      "pitfalls": [
        "Reporting a gross backtest Sharpe ratio as if it were close to what a live strategy will realise, without a cost sensitivity sweep against realistic turnover.",
        "Backtesting on today's investable universe projected backward in time, which silently excludes every future delisting, default or acquisition.",
        "Re-running the original backtest to check on a live strategy instead of watching a rolling live performance statistic that would catch degradation faster."
      ],
      "check": [
        {
          "q": "A strategy's net Sharpe ratio falls from 1.52 gross to -0.09 once a 20-basis-point transaction cost is applied. This means:",
          "options": [
            "The strategy's gross edge was fake",
            "The strategy has essentially no capacity margin for costs above roughly 10-15 basis points",
            "20 basis points is an unrealistically high cost for any strategy",
            "The strategy should be run at higher turnover to compensate"
          ],
          "answer": 1,
          "why": "The sweep shows net Sharpe crossing zero between 10 and 20 basis points of cost; a strategy that thin on margin has very little room for real-world costs to come in above the modelled level."
        },
        {
          "q": "A backtest uses 'the S&P 500 as it exists today' projected back ten years. Compared to a point-in-time universe, this backtest's average historical return will tend to be:",
          "options": [
            "Identical, since index membership does not affect returns",
            "Biased upward, because names that were later delisted for underperforming are excluded",
            "Biased downward",
            "Unaffected as long as the sample is long enough"
          ],
          "answer": 1,
          "why": "Using today's constituent list backward in time removes every eventual loser from the sample, which is exactly the survivorship bias the snippet quantifies at over 5% annualised in its simulation."
        },
        {
          "q": "A model's true underlying relationship changes, but the model itself is not refit. The rolling 60-day Sharpe ratio:",
          "options": [
            "Will immediately jump to a clearly negative value at the exact moment of the change",
            "Will typically take some time to turn negative, creating a real detection lag",
            "Is unaffected by regime changes",
            "Only applies to market-making strategies"
          ],
          "answer": 1,
          "why": "Averaging over a 60-day window smooths the transition, so the statistic only turns negative once enough post-break observations have entered the window -- the snippet shows this lag was 29 days even in an idealised simulation."
        },
        {
          "q": "Five strategy books are allocated capital by mean-variance optimisation using their estimated means, volatilities and correlations. This process is:",
          "options": [
            "Fundamentally different from allocating capital across individual stocks",
            "The same portfolio-construction problem as allocating across assets, with the identical estimation-error caveats",
            "Guaranteed to outperform equal weighting by a large margin",
            "Only valid if all five strategies are perfectly uncorrelated"
          ],
          "answer": 1,
          "why": "Treating strategies as the 'assets' in a mean-variance problem is mathematically identical to allocating across single names, and inherits the same sensitivity to estimated (as opposed to true) means, volatilities and correlations."
        }
      ]
    },
    {
      "n": 10,
      "title": "Capstone: validating that a model will perform",
      "topics": [
        "a pre-production checklist",
        "shadow trading as a final out-of-sample test",
        "sizing under parameter uncertainty",
        "postmortem attribution"
      ],
      "concepts": [
        {
          "name": "A checklist before capital, not a chart",
          "explain": "<p>Every idea covered this quarter -- out-of-sample validation, cost sensitivity, deflation for the number of variants tried, point-in-time data, an economic rationale beyond the statistics -- converges on a single practical question: what has to be true before a strategy is trusted with real capital, stated as a checklist rather than as a single backtest chart.</p><p>The snippet runs a seven-item checklist against a hypothetical strategy. Five items pass: out-of-sample performance, a realistic cost and capacity check, a known and deflated variant count, an economic story, and point-in-time data free of survivorship or look-ahead. Two remain pending: an independent kill switch and position limit, and a period of paper trading or shadow production against live data.</p><p>A desk cares because a backtest chart, however good, answers only the first five items at best, and the last two -- independent risk controls and a genuine shadow-trading period -- cannot be answered by any amount of additional historical analysis; they require the strategy to actually run, carefully, before it is trusted with size.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nchecklist = [\n    (\"out-of-sample Sharpe holds up on data never touched during research\", True),\n    (\"performance survives realistic transaction costs and a capacity check\", True),\n    (\"the number of variants tried is known and the Sharpe is deflated for it\", True),\n    (\"the strategy has an economic story, not just a statistical pattern\", True),\n    (\"data used is point-in-time, with no survivorship or look-ahead\", True),\n    (\"a kill switch and a position/loss limit exist independent of the model\", False),\n    (\"the strategy has been paper-traded or shadow-run against live data\", False),\n]\npassed = sum(1 for _, ok in checklist if ok)\nprint(f\"{'item':<70}{'status'}\")\nfor item, ok in checklist:\n    print(f\"{item:<70}{'PASS' if ok else 'PENDING'}\")\nprint(f\"\\n{passed}/{len(checklist)} checklist items satisfied before any capital is committed\")\nprint(\"a model that fails even one of the first five items should not reach a risk limit,\")\nprint(\"let alone a P&L, no matter how good its backtest chart looks\")\n",
            "output": "item                                                                  status\nout-of-sample Sharpe holds up on data never touched during research   PASS\nperformance survives realistic transaction costs and a capacity check PASS\nthe number of variants tried is known and the Sharpe is deflated for itPASS\nthe strategy has an economic story, not just a statistical pattern    PASS\ndata used is point-in-time, with no survivorship or look-ahead        PASS\na kill switch and a position/loss limit exist independent of the modelPENDING\nthe strategy has been paper-traded or shadow-run against live data    PENDING\n\n5/7 checklist items satisfied before any capital is committed\na model that fails even one of the first five items should not reach a risk limit,\nlet alone a P&L, no matter how good its backtest chart looks"
          }
        },
        {
          "name": "Shadow trading is a real out-of-sample test, with its own standard error",
          "explain": "<p>Running a strategy against live data without committing real capital -- paper trading, or shadow production -- is the closest thing to a genuinely out-of-sample test available before going live, because unlike a backtest, the data genuinely did not exist when the model was built. But a short shadow period carries its own large standard error and cannot, by itself, prove a strategy works.</p><p>The snippet compares a 1000-day backtest against a 250-day shadow period drawn from the identical underlying process. In this particular draw the backtest Sharpe comes back at -0.319 and the shadow Sharpe at +0.311 -- both consistent with the same true 0.9 annualised Sharpe once their standard errors, around 1.03 annualised for the shadow period, are accounted for, and the two are well within two standard errors of each other despite looking wildly different at face value.</p><p>A desk cares because this example is deliberately uncomfortable: it shows that a short shadow period's Sharpe estimate can look nothing like the backtest's purely from sampling noise, even when nothing is actually wrong, which is exactly why a shadow Sharpe far below the backtest OR negative is a real warning sign worth investigating, while a shadow Sharpe merely different from the backtest, within its wide error bars, often is not.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(102)\nn_backtest, n_shadow = 1000, 250\ntrue_sharpe_ann = 0.9\nsig = 1.0\nmu = true_sharpe_ann * sig / np.sqrt(252)\nbacktest_ret = rng.normal(mu, sig, n_backtest)\nshadow_ret = rng.normal(mu, sig, n_shadow)   # same true process, genuinely out of sample\n\nbt_sharpe = backtest_ret.mean() / backtest_ret.std() * np.sqrt(252)\nsh_sharpe = shadow_ret.mean() / shadow_ret.std() * np.sqrt(252)\nse_shadow = np.sqrt((1 + sh_sharpe**2 / 2) / n_shadow) * np.sqrt(252)\n\nprint(f\"backtest annualised Sharpe (research window)   {bt_sharpe:.3f}\")\nprint(f\"shadow/paper-trading annualised Sharpe          {sh_sharpe:.3f}\")\nprint(f\"standard error of the shadow estimate            {se_shadow:.3f}\")\nprint(f\"is the shadow Sharpe within 2 SE of the backtest?   \"\n      f\"{abs(sh_sharpe - bt_sharpe) < 2 * se_shadow}\")\nprint(\"a short shadow period has a huge standard error of its own; it cannot prove a strategy\")\nprint(\"works, but a shadow Sharpe far below backtest, or negative, is a real warning\")\n",
            "output": "backtest annualised Sharpe (research window)   -0.319\nshadow/paper-trading annualised Sharpe          0.311\nstandard error of the shadow estimate            1.028\nis the shadow Sharpe within 2 SE of the backtest?   True\na short shadow period has a huge standard error of its own; it cannot prove a strategy\nworks, but a shadow Sharpe far below backtest, or negative, is a real warning"
          }
        },
        {
          "name": "Kelly sizing under an uncertain edge should be shrunk, not trusted at face value",
          "explain": "<p>The Kelly criterion sizes a bet in proportion to its expected edge divided by its variance, but that formula implicitly assumes the edge is known with certainty. When the edge is instead an ESTIMATE from a finite sample, naive Kelly sizes the bet as if the estimation error did not exist, which overbets whenever the estimate happens to be too large and can even bet in the wrong direction when the estimate's sign is simply wrong.</p><p>The snippet estimates a true daily edge of 0.0004 from samples of different lengths and sizes both naive and shrunk Kelly fractions, where the shrinkage factor is the ratio of the estimate's own signal-squared to signal-squared-plus-estimation-variance. At a short sample of 60 observations, the estimated edge came back at +0.00182 -- too large by chance -- giving a naive Kelly fraction of 18.244, shrunk to a still-large 12.157. At 250 observations the estimate happened to come back negative, -0.00041, giving a naive Kelly of -4.094 and a shrunk Kelly of -1.209 -- shrinkage reduces the magnitude of the mistake but, honestly, does not guarantee the correct sign when the estimate itself has the wrong sign.</p><p>A desk cares because this is the practical, computable version of the estimation-error problem that runs through the entire course: shrinking a sizing decision by how much you actually know, rather than by how much you estimated, is cheap insurance against exactly the overconfident bets a short sample can produce.</p>",
          "formula": "f^* = \\frac{\\hat\\mu}{\\sigma^2}, \\qquad f^*_{shrunk} = f^* \\cdot \\frac{\\hat\\mu^2}{\\hat\\mu^2 + \\sigma^2/T}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\n# Kelly sizing under parameter uncertainty: shrink the naive Kelly fraction toward zero\n# by the ratio of true signal variance to (true + estimation-error variance)\ndef kelly_fraction(mu, sigma2):\n    return mu / sigma2\n\ndef kelly_shrunk(mu_hat, sigma2, T):\n    se2 = sigma2 / T                     # variance of the mean estimate\n    shrink = mu_hat**2 / (mu_hat**2 + se2) if (mu_hat**2 + se2) > 0 else 0.0\n    return kelly_fraction(mu_hat, sigma2) * shrink, shrink\n\nmu_true, sigma2 = 0.0004, 0.0001\nrng = np.random.default_rng(103)\nfor T in (60, 250, 1000, 5000):\n    mu_hat = mu_true + rng.normal(0, np.sqrt(sigma2 / T))\n    f_naive = kelly_fraction(mu_hat, sigma2)\n    f_shrunk, shrink = kelly_shrunk(mu_hat, sigma2, T)\n    print(f\"T={T:5d}   mu_hat {mu_hat:+.5f}   naive Kelly {f_naive:7.3f}   \"\n          f\"shrink {shrink:.3f}   shrunk Kelly {f_shrunk:7.3f}\")\nprint(\"naive Kelly on a short sample bets as if the estimated edge were certain;\")\nprint(\"shrinking by the estimate's own signal-to-noise ratio is a cheap, honest fix\")\n",
            "output": "T=   60   mu_hat +0.00182   naive Kelly  18.244   shrink 0.666   shrunk Kelly  12.157\nT=  250   mu_hat -0.00041   naive Kelly  -4.094   shrink 0.295   shrunk Kelly  -1.209\nT= 1000   mu_hat +0.00060   naive Kelly   6.050   shrink 0.785   shrunk Kelly   4.751\nT= 5000   mu_hat +0.00023   naive Kelly   2.304   shrink 0.726   shrunk Kelly   1.673\nnaive Kelly on a short sample bets as if the estimated edge were certain;\nshrinking by the estimate's own signal-to-noise ratio is a cheap, honest fix"
          }
        },
        {
          "name": "A postmortem needs to decompose P&L, not just report it",
          "explain": "<p>When a live strategy's P&amp;L disappoints, the useful question is not 'was it good or bad' but 'which of several distinct sources produced the result': the model's genuine signal, an unmodelled regime shift, and transaction costs are three separate, decomposable contributors, and only a postmortem that separates them can tell a genuine edge decay from a cost drag or a regime nobody built the model to handle.</p><p>The snippet attributes a simulated 750-day live P&amp;L of -0.179 across three buckets: the model's signal contributed +0.140, an unmodelled regime shift contributed -0.208, and transaction costs contributed -0.111, together reconciling exactly to the observed total. Measured as a share of the total absolute magnitude moved by all three buckets, the regime shift accounts for 45.3% of the story, the signal for 30.5%, and costs for 24.2%.</p><p>A desk cares because these three buckets call for entirely different responses: a genuine signal that is still working but was overwhelmed by an unmodelled regime shift argues for extending the model, not discarding it; a signal that has itself decayed argues for retiring the strategy; and a cost drag argues for execution improvements rather than a model change at all -- and a postmortem that only reports the total P&amp;L cannot tell these apart.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(104)\nn = 750\nsignal_component = rng.normal(0.0003, 0.004, n)     # what the model's edge actually delivered\nregime_shift_component = np.where(np.arange(n) > 500, -0.0009, 0.0) + rng.normal(0, 0.001, n)\ncost_component = -np.abs(rng.normal(0.00015, 0.00005, n))\nlive_pnl = signal_component + regime_shift_component + cost_component\n\nattribution = {\n    \"model signal\": signal_component.sum(),\n    \"regime shift (unmodelled)\": regime_shift_component.sum(),\n    \"transaction costs\": cost_component.sum(),\n}\ntotal = live_pnl.sum()\ngross = sum(abs(v) for v in attribution.values())\nprint(f\"total live P&L over {n} days   {total:+.3f}\")\nfor name, val in attribution.items():\n    print(f\"  attributed to {name:<28} {val:+8.3f}   ({abs(val)/gross*100:5.1f}% of gross magnitude)\")\nprint(\"\\nreconciliation:\", f\"{sum(attribution.values()):+.3f}\", \"vs total\", f\"{total:+.3f}\")\nprint(\"a postmortem that cannot decompose live P&L into these buckets cannot tell a genuine\")\nprint(\"edge decay from a cost drag or a regime nobody modelled\")\n",
            "output": "total live P&L over 750 days   -0.179\n  attributed to model signal                   +0.140   ( 30.5% of gross magnitude)\n  attributed to regime shift (unmodelled)      -0.208   ( 45.3% of gross magnitude)\n  attributed to transaction costs              -0.111   ( 24.2% of gross magnitude)\n\nreconciliation: -0.179 vs total -0.179\na postmortem that cannot decompose live P&L into these buckets cannot tell a genuine\nedge decay from a cost drag or a regime nobody modelled"
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "From a research idea to capital, in five checkpoints",
        "params": {
          "events": [
            {
              "t": 1,
              "label": "Backtest",
              "note": "Out-of-sample, cost-adjusted, deflated for variants tried."
            },
            {
              "t": 2,
              "label": "Risk controls",
              "note": "A kill switch and a position limit independent of the model."
            },
            {
              "t": 3,
              "label": "Shadow trading",
              "note": "A genuine out-of-sample test against live data."
            },
            {
              "t": 4,
              "label": "Sized allocation",
              "note": "Kelly, shrunk for the estimate's own uncertainty."
            },
            {
              "t": 5,
              "label": "Postmortem",
              "note": "Decomposing live P&L: signal, regime, cost."
            }
          ]
        }
      },
      "pitfalls": [
        "Treating a backtest chart as a substitute for an independent kill switch and position limit, which no amount of additional backtesting can provide.",
        "Reading a disappointing short shadow-trading Sharpe as proof a strategy is broken, without checking whether it is simply within the shadow period's own wide standard error.",
        "Sizing a live position with naive Kelly on a short-sample edge estimate, which bets as if the estimate were the truth rather than a noisy guess at it."
      ],
      "check": [
        {
          "q": "A strategy passes five of seven items on a pre-production checklist, including out-of-sample validation and a deflated Sharpe ratio, but has not yet been shadow-traded and has no independent kill switch. The correct next step is:",
          "options": [
            "Deploy with full size immediately, since the statistical items are the ones that matter most",
            "Complete the remaining items first; no amount of further backtesting substitutes for live risk controls and a genuine shadow-trading period",
            "Ignore the two pending items since they are operational, not statistical",
            "Rerun the backtest on more historical data instead"
          ],
          "answer": 1,
          "why": "Risk controls and shadow trading answer questions -- can this fail safely, does it work on truly new data -- that a backtest, however careful, structurally cannot answer on its own."
        },
        {
          "q": "A 250-day shadow-trading Sharpe of +0.31 looks much lower than a 1000-day backtest Sharpe of 0.9, from the same underlying process. Given a shadow-period standard error of roughly 1.0 annualised, this gap is:",
          "options": [
            "Clear evidence the strategy has stopped working",
            "Plausibly just sampling noise from a short evaluation window, not necessarily a sign of a problem",
            "Impossible if the strategy is genuine",
            "Proof the backtest itself was wrong"
          ],
          "answer": 1,
          "why": "With a standard error that large relative to the gap between the two numbers, both are consistent with the same true Sharpe ratio; a difference this size, on its own, is not strong evidence of degradation."
        },
        {
          "q": "A naive Kelly fraction is computed from an edge estimated on only 60 days of data and comes out unusually large. Shrinking it toward zero by the estimate's own signal-to-noise ratio will:",
          "options": [
            "Guarantee the correct sign and magnitude of the true edge",
            "Reduce the bet size by roughly how uncertain the estimate is, without guaranteeing it corrects an estimate that has the wrong sign",
            "Have no effect on a short-sample estimate",
            "Only apply when the estimated edge is negative"
          ],
          "answer": 1,
          "why": "Shrinkage scales the bet down in proportion to the estimate's own reliability, which reduces the damage from an unlucky large estimate, but it cannot detect or fix an estimate whose sign is simply wrong by chance."
        },
        {
          "q": "A live strategy's P&L is decomposed into a positive contribution from the model's signal and a larger negative contribution from an unmodelled regime shift. The appropriate response is most likely to:",
          "options": [
            "Immediately discard the strategy entirely",
            "Consider extending the model to account for the regime shift, since the underlying signal contribution is still positive",
            "Increase position size to compensate for the loss",
            "Attribute the entire loss to transaction costs regardless of the decomposition"
          ],
          "answer": 1,
          "why": "A decomposition showing the signal itself is still contributing positively, with the loss coming from an unmodelled factor, points toward extending the model rather than concluding the underlying edge has disappeared."
        }
      ]
    }
  ],
  "interview": [
    {
      "q": "Why does a hedge ratio computed by ordinary least squares tend to under-hedge a spread trade?",
      "level": "screen",
      "answer": "OLS assumes the regressor is measured without error, but in a real spread both legs carry their own noise. That errors-in-variables problem attenuates the OLS slope toward zero, so the position is smaller than the true relationship warrants and some of the common-factor risk the trade was meant to remove is still there. Total least squares, which minimises orthogonal rather than vertical distance and is computable as the first principal component of the centred data, corrects most of this bias. In a simulation with equal-sized noise on both legs and a true hedge ratio of 1.6, OLS's average bias across many refits was about -0.01 while TLS's was essentially zero."
    },
    {
      "q": "You are told a strategy's backtest found a Sharpe ratio of 1.35. What is the single most important additional piece of information you would ask for?",
      "level": "screen",
      "answer": "How many variants were tried to find it. The best result out of many random, equally-skilled tries looks impressive purely because it is the maximum of a distribution, and the deflated Sharpe ratio formalises exactly this: given the count of trials, sample length, skewness and kurtosis, it asks whether the observed Sharpe clears the benchmark chance alone would produce. In one worked example, a Sharpe of 1.35 against ten variants looked reasonably convincing, with a 63% probability the true Sharpe exceeds zero; against the true count of two hundred variants, the chance-implied benchmark itself rose above 1.35 and that probability fell to 19%."
    },
    {
      "q": "Explain the difference between carry and total return in a carry trade, using FX as the example.",
      "level": "screen",
      "answer": "The forward FX rate embeds the interest-rate differential between the two currencies as pure carry: it is the return earned if spot stays exactly where it is. Total return is carry plus whatever spot actually does over the holding period. In a worked example with a 1.5% domestic and 4.5% foreign rate, the one-year forward implied a carry of -2.87%; with spot unchanged the total return was exactly that -2.87%, but a 2% spot appreciation brought the total return to -0.87%. A carry trade is fundamentally a bet that the carry component is a more reliable source of return than the noisy spot component."
    },
    {
      "q": "A market maker's mark-to-market P&L is positive overall but you suspect adverse selection. How would you check?",
      "level": "onsite",
      "answer": "Flag or estimate which fills were likely against informed flow -- by size, timing relative to news, or a proxy for subsequent price movement -- and compute the mean P&L per trade conditional on that flag, separately for the two groups. Adverse selection is the gap between those two conditional means, not the sign of the aggregate. In a simulation with 8% of flow informed, mean P&L per tick against clean flow was +0.023 and against toxic flow +0.016: both positive, because the quoted spread partly compensated, but the gap is the measurable cost of adverse selection, and it is a legitimate target for a regression that predicts, and prices in, informed flow ahead of time."
    },
    {
      "q": "Why might a rolling regression coefficient itself be a useful trading signal, rather than just a modelling nuisance?",
      "level": "onsite",
      "answer": "A parameter re-estimated on a rolling window is a time series, and if it is itself persistent or mean-reverting, its own history is informative about where it is likely to go next -- a genuine second-order signal layered on top of the original model. In a simulation, a rolling beta estimated over overlapping 60-observation windows had a lag-1 autocorrelation of 0.92, extremely persistent, even though the underlying true parameter path oscillated. Fitting an Ornstein-Uhlenbeck process to that rolling estimate gives its own mean-reversion speed and half-life, which then sets a sensible re-estimation frequency and a natural holding period for a signal built on the parameter's own reversion."
    },
    {
      "q": "How would you decide whether to trade a mean-reverting spread continuously or only when a threshold is crossed?",
      "level": "onsite",
      "answer": "Compute net-of-cost performance both ways, because the right answer depends on the ratio between the signal's natural volatility and the actual cost per trade, not on a general rule. In one simulation, a continuous reversion signal had a gross annualised Sharpe of 1.25 that barely fell to 1.24 net of a 3-basis-point cost, because the reversion there was fast relative to the cost; a banded version cut turnover by more than half but its net Sharpe, 1.07, was actually lower once transaction costs were applied consistently. Sweeping entry and exit thresholds separately usually shows an interior optimum rather than a monotonic relationship, which is itself a warning that the specific 'best' band found on one dataset should be treated as a search result, not a fact."
    },
    {
      "q": "A colleague backtests a strategy on 'the current index constituents, ten years of history.' What is wrong with this, and how large can the effect be?",
      "level": "onsite",
      "answer": "This backtests on a universe that only exists in hindsight: every name later delisted, acquired, or dropped from the index for underperforming is excluded, which makes the historical sample systematically better than what was actually investable in real time, even when every name has identical true expected returns. In a simulation of five hundred names with the bottom 15% treated as eventually delisted, the survivors-only mean daily return was more than double the full, point-in-time universe's mean, an annualised bias of roughly 5%. The fix is to use point-in-time index membership, reconstructed at each historical date, not today's constituent list."
    },
    {
      "q": "You are asked to size a position using the Kelly criterion, but the expected edge is estimated from only two months of data. What do you do differently from textbook Kelly?",
      "level": "onsite",
      "answer": "Shrink the naive Kelly fraction by a factor reflecting how much of the estimated edge is signal versus estimation noise -- roughly the ratio of the estimate's squared value to its squared value plus its own sampling variance. Naive Kelly treats an estimated edge as if it were known exactly, which overbets whenever the estimate is unlucky and large, and can bet the wrong direction entirely when the estimate's sign itself is wrong. In one example, a short sixty-observation sample gave a naive Kelly fraction of over 18 that shrinkage brought down to about 12; the shrinkage reduces the damage but is not a guarantee against an estimate with the wrong sign."
    },
    {
      "q": "Why is a Sharpe ratio an incomplete description of a carry strategy's risk?",
      "level": "senior",
      "answer": "Sharpe ratio is a function only of the first two moments, mean and standard deviation, and two return series can match on both while one is symmetric and the other earns a small steady premium most of the time and gives it back, with interest, in a rare crash -- exactly the shape a carry trade's compensation for bearing crash risk typically takes. In a simulation, a stylised carry return with skewness of about -9 had an annualised Sharpe of 0.59, close to a symmetric comparator's 0.62 matched on mean and standard deviation, despite the two having completely different tail risk. Reporting Sharpe alone for a carry book, without skewness, kurtosis, or a stress scenario, misses the entire dimension the strategy is being compensated for."
    },
    {
      "q": "Four cross-asset carry strategies show pairwise correlations between roughly 0.2 and 0.5. How would you push back on a claim that this book is well diversified?",
      "level": "senior",
      "answer": "Correlations estimated mostly from ordinary trading days describe ordinary-day co-movement, not the effective correlation during the shared tail event every carry strategy is fundamentally compensated for bearing. In a simulation with four carry strategies loaded to different degrees, 0.6 to 1.2, on one shared fat-tailed shock factor, the pairwise correlations looked modest, 0.18 to 0.46, but the individual and combined Sharpe ratios in that draw were poor -- the equal-weighted combination came to only 0.08 -- because all four strategies are, at bottom, one bet on the same factor expressed four different ways. I would ask for a stress test that shocks the shared factor directly, not just the historical correlation matrix."
    },
    {
      "q": "A frozen model's rolling live Sharpe ratio turns negative 29 days after its true underlying relationship changed. Is that detection lag a bug?",
      "level": "senior",
      "answer": "It is an inherent property of using a rolling window as the monitoring statistic, not a bug in any one implementation. A 60-day rolling window blends pre- and post-break observations until enough post-break data accumulates for the average to turn negative; in a simulation this took 29 trading days after a coefficient sign-flip. The trade-off is real: a shorter window detects faster but is noisier and will generate more false alarms from ordinary variation; the right window length is itself a decision about how much detection lag is tolerable against how many false positives the desk is willing to investigate, and it should be set deliberately rather than inherited from whatever window the original backtest happened to use."
    },
    {
      "q": "How would you decide how much capital to allocate across five different strategy books running across different asset classes?",
      "level": "senior",
      "answer": "Treat it as the identical mean-variance allocation problem FINM 36700 poses for individual assets, with strategies as the assets, and apply the same estimation-error discipline: the covariance matrix and mean vector across strategies are themselves noisy estimates, and an unconstrained optimiser will happily lever into whichever strategy's estimated Sharpe looks best by chance. In a five-strategy example the mean-variance solution outperformed equal weighting only modestly, 1.155 versus 1.056 annualised Sharpe, which is the normal size of the gap once estimation error is respected. I would also check the strategies' shared factor loadings directly, since a book of five strategies that are all secretly exposed to the same liquidity or macro factor is not five independent bets, no matter how the correlation matrix looks on ordinary days."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 36700",
      "how": "The Sharpe-ratio inference, estimation-error and portfolio-allocation machinery this course leans on from week 1 is exactly what that core course builds, and week 9's strategy-allocation problem is its mean-variance framework applied one level up."
    },
    {
      "code": "FINM 37000",
      "how": "Futures cost of carry, calendar spreads and the minimum-variance hedge ratio are treated there from the pricing side; this course's week 3 applies the same relationships as trading signals rather than as valuation results."
    },
    {
      "code": "FINM 35100",
      "how": "The adverse-selection and informed-flow ideas behind week 8's market-making treatment are given their formal economic foundations in that course's study of information and market structure."
    },
    {
      "code": "FINM 37601",
      "how": "The reservation-price quoting model sketched in week 8 is one worked special case of the general optimised market-making framework that course develops in full."
    },
    {
      "code": "FINM 35900",
      "how": "The cross-asset carry and risk-premium material of week 4 is the strategy-construction half of what that course studies as macro risk premia and a macro overlay on a systematic book."
    },
    {
      "code": "FINM 33160",
      "how": "The overfitting, walk-forward validation and deflated-Sharpe discipline of weeks 6 and 7 recur, in a machine-learning idiom, in that course's treatment of cross-sectional equity factor models."
    }
  ],
  "glossary": [
    {
      "term": "Hedge ratio",
      "def": "The regression coefficient of one leg of a spread on another; the multiple of the hedging instrument held against the primary position so that the common driver of both cancels out."
    },
    {
      "term": "Total least squares",
      "def": "A regression method that minimises orthogonal, rather than vertical, distance to the fitted line, appropriate when both variables carry measurement noise. Computed as the first principal component of the centred data."
    },
    {
      "term": "Errors-in-variables bias",
      "def": "The attenuation, toward zero, of an OLS slope when the regressor is measured with noise. It is the reason a naively computed hedge ratio tends to under-hedge."
    },
    {
      "term": "Half-life (of mean reversion)",
      "def": "The time for a shock to a mean-reverting process to decay by half, computed as ln(0.5) divided by the log of the AR(1) persistence parameter. Sets the natural holding period of a reversion trade."
    },
    {
      "term": "Cost of carry",
      "def": "The financing, storage and convenience-yield relationship linking a spot price to its futures or forward price, F = S e^{(r+u-y)T}. The mechanism behind calendar spreads and futures roll."
    },
    {
      "term": "Credit basis",
      "def": "The gap between a CDS-implied credit spread and a bond-implied spread on the same issuer, driven by funding costs and technical frictions rather than by the underlying default risk itself."
    },
    {
      "term": "Crack spread / spark spread",
      "def": "Physical refining and power-generation margins: long the finished product (gasoline, electricity), short the input (crude, gas) in the fixed ratio the physical process actually uses."
    },
    {
      "term": "Carry",
      "def": "The return earned on a position if the underlying price or rate does not move; the component of total return separate from spot appreciation or depreciation."
    },
    {
      "term": "Covered interest parity",
      "def": "The no-arbitrage relationship linking spot FX, forward FX and the two countries' interest rates, which prices the interest-rate differential directly into the forward rate as carry."
    },
    {
      "term": "Ornstein-Uhlenbeck process",
      "def": "A continuous-time mean-reverting process, dx = theta(mu - x)dt + sigma dW, used here to model a drifting model parameter's own reversion toward a long-run level."
    },
    {
      "term": "Hysteresis (in a trading signal)",
      "def": "Using separate entry and exit thresholds so a position, once opened, is not immediately closed and reopened by noise near a single threshold. Reduces turnover at the cost of missing some of the signal's move."
    },
    {
      "term": "Huber loss",
      "def": "A robust regression objective that is quadratic for small residuals and linear for large ones, capping the influence any single outlier can have on the fitted line."
    },
    {
      "term": "Quantile regression",
      "def": "Regression that fits a chosen conditional quantile of the outcome, rather than the conditional mean, and so can reveal that the spread or asymmetry of outcomes, not just their centre, depends on a predictor."
    },
    {
      "term": "Walk-forward validation",
      "def": "Evaluating a model only on data that comes strictly after its training window, as opposed to a randomly shuffled split, which can leak post-regime-change information into a pre-change training fold."
    },
    {
      "term": "Deflated Sharpe ratio",
      "def": "Bailey and Lopez de Prado's correction for multiple testing in strategy research: the probability a true Sharpe ratio exceeds zero, given the number of variants tried, adjusted for sample size, skewness and kurtosis."
    },
    {
      "term": "Sharpe-ratio haircut",
      "def": "A cheap heuristic that shrinks a reported in-sample Sharpe ratio toward zero by an amount growing with the number of variants tried and shrinking with the sample size, as a fast first pass before a full deflation calculation."
    },
    {
      "term": "Newey-West standard error",
      "def": "A standard error estimator that corrects for serial correlation across a chosen number of lags, needed whenever returns overlap (as in a multi-day holding period sampled daily) and are not truly independent."
    },
    {
      "term": "Reservation price",
      "def": "In the Avellaneda-Stoikov market-making framework, the price at which a maker is indifferent to buying or selling one more unit, shifted away from mid in proportion to inventory, risk aversion and remaining variance."
    },
    {
      "term": "Adverse selection (in market making)",
      "def": "The loss a market maker incurs, on average, trading against informed order flow at a fixed spread; measurable as the gap between mean P&L conditional on clean versus toxic flow."
    },
    {
      "term": "Survivorship bias",
      "def": "The upward bias in a backtest's historical returns caused by using today's investable universe rather than the actual, point-in-time universe, which silently excludes every name that was later delisted or acquired."
    }
  ]
};
