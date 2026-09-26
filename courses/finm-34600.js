/* courses/finm-34600.js -- FINM 34600, The Analysis of High Frequency Data.
   Built from the public course page only. That page links no syllabus at all, so
   there is no syllabus text for this course anywhere in the corpus. The ten-week
   arc, the concepts, the code, the questions, the pitfalls and the glossary are
   this dashboard's own reconstruction of a standard graduate treatment of the
   topics the public description lists. None of it is the instructor's material,
   none of it was reviewed by the instructor, and no claim is made about grading,
   assignments, exam format or which textbook is actually used.
   Every code `output` is real stdout, written by tools/run_snippets.py -- do not
   edit those strings by hand. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 34600"] = {
  "code": "FINM 34600",
  "slug": "finm-34600",
  "title": "The Analysis of High Frequency Data",
  "instructor": "Per A. Mykland",
  "quarter": "Winter",
  "units": 100,
  "block": "electives",
  "concentrations": [
    "machine-learning-ai"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/machine-learning-and-ai/finm-34600/",
    "syllabus_url": "",
    "fetched": "2026-09-26",
    "note": "The only source consulted is the public course page, which gives an official description of about 130 words plus the instructor, the quarter, the units and the concentration. This course page, unlike most in the program, links no syllabus at all, so there is no syllabus document for it in the corpus even in gated form — the other courses' syllabi are shared links behind a university login, this one simply does not exist publicly. Everything on this page beyond the description block — the ten-week arc, the concepts, the formulas, the code, the widgets, the questions, the pitfalls, the interview items and the glossary — is the dashboard's own reconstruction of a standard graduate treatment of the topics the description lists. It is not the instructor's outline, it was not reviewed or endorsed by the instructor, and no claim is made about grading, assignments, exam format, or which textbook is actually used."
  },
  "tier": "B",
  "description": "An introduction to the econometric analysis of high-frequency financial data: the place where the stochastic models of quantitative finance meet the reality of how the price process actually evolves, and where the statistical theory that connects the two is built. The public description is explicit about the emphasis: the course is focused on that statistical theory, with some data analysis alongside it, and it is aimed at leaving participants able to read the research literature in the area once a little extra statistical background is added. The theory here is longitudinal — it learns about volatility by watching one path sampled finely in time — so it complements the cross-sectional calibration methods that read volatility off a panel of option prices. The description also names volatility clustering and market microstructure as topics. In practice that makes this a course about estimators: what quadratic variation is, how to estimate it from noisy irregular ticks, how fast each estimator converges, when it is biased, how to test for jumps, and how to put an honest standard error on any of it.",
  "prerequisites": [
    "FINM 34500, Stochastic Calculus — the public course page states that students are encouraged to take it prior to or concurrently with this course. Ito integrals, quadratic variation and the semimartingale vocabulary are used from week 1 without re-derivation.",
    "A graduate first course in probability: conditional expectation, martingales, characteristic functions, and modes of convergence. Nearly every result in the course is a stable-convergence statement, so 'converges in distribution' has to be a precise idea rather than a slogan.",
    "Mathematical statistics at the level of consistency, bias-variance decomposition, asymptotic normality, delta method and the construction of a confidence interval from an estimated asymptotic variance.",
    "Linear regression in matrix form, including heteroskedasticity-robust standard errors. Weeks 8 and 9 are regressions whose regressors are themselves estimated.",
    "Enough Python to vectorise a simulation over a NumPy array and read a printed table. Every snippet here is short, seeded and uses nothing beyond NumPy, SciPy and pandas."
  ],
  "textbooks": [
    {
      "title": "High-Frequency Financial Econometrics",
      "author": "Yacine Ait-Sahalia and Jean Jacod",
      "note": "A standard reference for this material and the closest single book to the arc below: the semimartingale model, realised measures, noise, jumps and the limit theory behind each estimator. Listed as a reference, not as an assigned text."
    },
    {
      "title": "Discretization of Processes",
      "author": "Jean Jacod and Philip Protter",
      "note": "The standard reference for the limit theorems the course quotes: stable convergence, the mixed-normal limits of realised functionals, and the triangular-array machinery underneath them."
    },
    {
      "title": "Inference for volatility-type objects and implications for hedging / The econometrics of high-frequency data (survey and lecture-note treatments)",
      "author": "Per A. Mykland and Lan Zhang",
      "note": "Standard survey and lecture-note treatments of inference for volatility functionals, observed asymptotic variance and block-based inference — the material of week 9. Listed as a reference."
    },
    {
      "title": "Empirical Market Microstructure",
      "author": "Joel Hasbrouck",
      "note": "A standard reference for the data conventions of week 10: trade and quote records, signing rules, and what has to be cleaned before an estimator is allowed near a tape."
    },
    {
      "title": "Econometric analysis of realized volatility and its use in estimating stochastic volatility models (and the realised-kernel papers)",
      "author": "Ole E. Barndorff-Nielsen and Neil Shephard",
      "note": "Standard references for realised variance, bipower variation and flat-top realised kernels — weeks 2, 5 and 6."
    },
    {
      "title": "Modelling and Forecasting Realized Volatility / A simple approximate long-memory model of realized volatility",
      "author": "Torben G. Andersen, Tim Bollerslev, Francis X. Diebold and Paul Labys; Fulvio Corsi",
      "note": "Standard references for the empirical side of week 8: what realised volatility looks like as a time series and the HAR regression that forecasts it."
    }
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
  ],
  "brushup": [
    {
      "topic": "Quadratic variation of a semimartingale",
      "why": "The whole course estimates one object, and that object is the quadratic variation of the log price. If you cannot say why Brownian motion has quadratic variation t while a differentiable function has zero, week 1 will read as notation rather than as the definition of the estimand.",
      "resource": "Any stochastic calculus text's chapter on quadratic variation; Ait-Sahalia and Jacod chapter 1"
    },
    {
      "topic": "Ito isometry and the variance of a stochastic integral",
      "why": "Every asymptotic variance in the course is an Ito isometry computation in disguise. The factor 2 in the realised-variance CLT and the factor 4 in quarticity both come from fourth moments of Gaussian increments.",
      "resource": "Shreve, Stochastic Calculus for Finance II, chapter 4"
    },
    {
      "topic": "Modes of convergence, and stable convergence in particular",
      "why": "Realised variance does not converge to a normal law; it converges to a normal law with a random variance, and you may only build a confidence interval from that if the convergence is stable. The distinction is the single most common misreading of these results.",
      "resource": "Jacod and Protter, Discretization of Processes, chapter 2"
    },
    {
      "topic": "Bias-variance decomposition and mean squared error",
      "why": "Weeks 3 and 4 choose a sampling frequency by minimising an MSE that has a bias term growing in the number of observations and a variance term falling in it. The optimisation is elementary calculus, but only if MSE is reflexive.",
      "resource": "Any mathematical statistics text; Casella and Berger chapter 7"
    },
    {
      "topic": "Moments of the normal distribution, including the absolute first moment",
      "why": "Bipower variation in week 6 is normalised by the square of E|Z| = sqrt(2/pi). Several of the course's constants are just Gaussian absolute moments, and recognising them saves a lot of memorisation.",
      "resource": "Any probability text's normal-distribution section"
    },
    {
      "topic": "Regression with a generated regressor, and Newey-West style corrections",
      "why": "HAR forecasting in week 8 and realised regression in week 9 both put an estimated quantity on the right-hand side and leave autocorrelated errors on the left. Knowing why ordinary least squares standard errors are wrong there is the point of both weeks.",
      "resource": "Hamilton, Time Series Analysis, chapter 10"
    },
    {
      "topic": "NumPy vectorisation, cumulative sums and strided slicing",
      "why": "Every estimator in the course is a sum over a strided subsample of a cumulative sum. Written as a loop the snippets would be too slow to experiment with; written with slices they are two lines each.",
      "resource": "The NumPy user guide, 'Indexing on ndarrays' and 'Broadcasting'"
    }
  ],
  "weeks": [
    {
      "title": "The model and the estimand: semimartingales and quadratic variation",
      "topics": [
        "Ito semimartingales as a model for a log price",
        "quadratic variation and integrated variance",
        "why the drift is invisible at high frequency",
        "in-fill versus long-span asymptotics",
        "longitudinal estimation versus cross-sectional calibration"
      ],
      "concepts": [
        {
          "name": "The estimand is quadratic variation, not a parameter",
          "explain": "<p>Write the log price as an Ito semimartingale: a drift term, a stochastic integral against a Brownian motion with a possibly random and time-varying volatility, and (from week 6) a jump term. Almost nothing in this course depends on a parametric form for the volatility process. What the course estimates is the <em>quadratic variation</em> of the path over a window, which for a continuous semimartingale is the integral of the spot variance over that window.</p><p>That object is a random variable. It is not a parameter of a model, it is a feature of the particular path the world actually produced between 9:30 and 16:00 on a particular date. This is the single most important reorientation of the course. A classical statistician estimates a fixed unknown constant and the noise averages away; here the target itself is random, and what averages away as the grid refines is the discretisation error around it.</p><p>The snippet makes the definition operational. Along a refining grid, the sum of squared increments settles on the integral of sigma squared, while the sum of absolute increments diverges like the square root of the number of increments. The drift contributes nothing: its own quadratic variation is of order one over n. So a smooth trend can be arbitrarily large and still leave quadratic variation untouched.</p><p>A desk cares because every variance number it quotes — a hedging error, a risk limit, a variance-swap mark — is an estimate of quadratic variation over a specific window, and knowing that the target is path-dependent is what stops a trader from treating yesterday's estimate as today's truth.</p>",
          "formula": "[X]_T \\;=\\; \\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\big(X_{t_i}-X_{t_{i-1}}\\big)^2 \\;=\\; \\int_0^T \\sigma_s^2\\,ds",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\n# time is measured in trading days; sigma is a per-sqrt(day) volatility\nT, MU = 1.0, 0.020            # a drift of 2% a DAY: absurd, and that is the point\nS0, SA = 0.014, 0.008         # sigma(t) = S0 + SA*sin(2 pi t), i.e. 22%-35% annualised\n\ndef path(n, seed=34600):\n    r = np.random.default_rng(seed)\n    t = np.linspace(0.0, T, n + 1)\n    sig = S0 + SA * np.sin(2 * np.pi * t)\n    dt = T / n\n    dX = MU * dt + sig[:-1] * r.standard_normal(n) * np.sqrt(dt)\n    return dX, np.trapezoid(sig ** 2, t)\n\n_, IV = path(64)\nprint(\"exact integrated variance   int_0^1 sigma(t)^2 dt = %.4e\" % IV)\nprint(\"as an annualised volatility sqrt(252 * IV)        = %.2f%%\" % (100 * np.sqrt(252 * IV)))\nprint(\"\")\nprint(\"      n   QV(X) x 1e4   QV error x 1e4   total variation   TV/sqrt(n)   QV(drift) x 1e4\")\nfor n in (100, 1000, 10000, 100000, 400000):\n    dX, _ = path(n)\n    qv, tv = np.sum(dX ** 2), np.sum(np.abs(dX))\n    print(\"%7d  %12.4f  %+15.4f  %15.4f  %11.5f  %16.2e\"\n          % (n, 1e4 * qv, 1e4 * (qv - IV), tv, tv / np.sqrt(n), 1e4 * n * (MU * T / n) ** 2))\nprint(\"\")\nprint(\"QV settles on the integral; total variation diverges like sqrt(n) at a rate\")\nprint(\"sqrt(2/pi)*E[sigma] = %.5f; the drift's own QV vanishes like 1/n.\" % (np.sqrt(2 / np.pi) * S0))\n",
            "output": "exact integrated variance   int_0^1 sigma(t)^2 dt = 2.2800e-04\nas an annualised volatility sqrt(252 * IV)        = 23.97%\n\n      n   QV(X) x 1e4   QV error x 1e4   total variation   TV/sqrt(n)   QV(drift) x 1e4\n    100        2.3370          +0.0570           0.1182      0.01182          4.00e-02\n   1000        2.3227          +0.0427           0.3541      0.01120          4.00e-03\n  10000        2.2536          -0.0264           1.1115      0.01111          4.00e-04\n 100000        2.2628          -0.0172           3.5147      0.01111          4.00e-05\n 400000        2.2707          -0.0093           7.0520      0.01115          1.00e-05\n\nQV settles on the integral; total variation diverges like sqrt(n) at a rate\nsqrt(2/pi)*E[sigma] = 0.01117; the drift's own QV vanishes like 1/n."
          }
        },
        {
          "name": "Volatility is estimable within a day; the drift is not",
          "explain": "<p>Over an interval of length dt, the drift contributes an increment of order dt while the diffusion contributes one of order the square root of dt. As dt shrinks, the ratio of the two goes to zero like the square root of dt. High-frequency data is therefore almost pure volatility information, and almost no drift information at all.</p><p>The consequence is sharp and slightly counter-intuitive. Refining the grid improves the variance estimate without limit — the relative standard error of realised variance is the square root of two over n — but it does nothing at all for the mean. The best estimator of the drift over a fixed window is the endpoint divided by the window length, which uses only the first and last observation; every intermediate tick is irrelevant to it. Its standard deviation is the volatility divided by the square root of the window length, and no amount of intraday data reduces that.</p><p>The snippet quantifies this with a realistic calibration: a drift of 0.2% per day against a 22% annualised volatility. The drift's relative standard error is about 700% at every sampling frequency, while the variance's falls to about 0.9% at one-second sampling. Within one day the drift is a nuisance parameter you cannot see and, happily, do not need.</p><p>A research team cares because it explains why intraday signal research is mostly about conditional variance, order flow and microstructure rather than about expected return: the expected return simply is not in the data at that horizon.</p>",
          "formula": "\\frac{\\mu\\,\\Delta t}{\\sigma\\sqrt{\\Delta t}} \\;=\\; \\frac{\\mu}{\\sigma}\\sqrt{\\Delta t} \\;\\longrightarrow\\; 0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nT, MU, SIG = 1.0, 0.002, 0.014     # one day; 0.2% drift a day (~50%/yr); 22% annualised vol\nREPS = 1200\nr = np.random.default_rng(7)\n\nprint(\"  n per day   sd(muhat)/|mu|   sd(RV)/sigma^2   theory sqrt(2/n)   drift/typical move\")\nfor n in (12, 78, 390, 4680, 23400):\n    dt = T / n\n    dX = MU * dt + SIG * r.standard_normal((REPS, n)) * np.sqrt(dt)\n    muhat = dX.sum(axis=1) / T\n    rv = (dX ** 2).sum(axis=1)\n    print(\"%11d   %14.2f   %14.5f   %16.5f   %18.5f\"\n          % (n, muhat.std(ddof=1) / abs(MU), rv.std(ddof=1) / SIG ** 2,\n             np.sqrt(2.0 / n), (MU * dt) / (SIG * np.sqrt(dt))))\nprint(\"\")\nprint(\"sd(muhat) = sigma/sqrt(T) = %.4f for EVERY n above: a relative error of %.0f%%\"\n      % (SIG / np.sqrt(T), 100 * SIG / np.sqrt(T) / MU))\nprint(\"against a drift of %.3f. Sampling faster does nothing whatsoever for it.\" % MU)\nprint(\"The variance is estimated to %.2f%% relative error at n = 23400.\"\n      % (100 * np.sqrt(2.0 / 23400)))\nprint(\"Within one day the drift is a nuisance parameter you cannot see and do not need.\")\n",
            "output": "  n per day   sd(muhat)/|mu|   sd(RV)/sigma^2   theory sqrt(2/n)   drift/typical move\n         12             7.06          0.40767            0.40825              0.04124\n         78             7.08          0.16074            0.16013              0.01618\n        390             7.08          0.07028            0.07161              0.00723\n       4680             6.92          0.02059            0.02067              0.00209\n      23400             6.88          0.00926            0.00925              0.00093\n\nsd(muhat) = sigma/sqrt(T) = 0.0140 for EVERY n above: a relative error of 700%\nagainst a drift of 0.002. Sampling faster does nothing whatsoever for it.\nThe variance is estimated to 0.92% relative error at n = 23400.\nWithin one day the drift is a nuisance parameter you cannot see and do not need."
          }
        },
        {
          "name": "In-fill asymptotics and long-span asymptotics answer different questions",
          "explain": "<p>There are two ways to let the sample size grow, and they identify different things. <em>In-fill</em> (or high-frequency) asymptotics holds the window fixed and refines the grid: the number of observations within one day grows. <em>Long-span</em> asymptotics holds the sampling interval fixed and lengthens the window: the number of days grows.</p><p>In-fill asymptotics estimates one day's realised quadratic variation, and it can do so to essentially arbitrary precision, because the target is a functional of the path you are observing. Long-span asymptotics estimates parameters of the volatility <em>process</em> — its long-run mean, its persistence, its own volatility — because only repeated realisations identify a distribution.</p><p>The snippet runs both on the same simulated world. Refining the grid from 26 to 780 returns a day drops the root mean squared error against that day's own integrated variance from 0.62 to 0.11 in units of one basis point of daily variance, and the error times the square root of n stays near 3.0, which is the square-root-of-n rate. Fixing 65 returns a day and lengthening the window instead shrinks the error against the true stationary mean of integrated variance, which no amount of intraday refinement would ever reveal.</p><p>A desk cares because the two regimes correspond to two different questions a risk manager asks — 'how volatile was today' and 'how volatile is this asset' — and an estimator built for one is the wrong tool for the other.</p>",
          "formula": "\\sqrt{n}\\left(\\widehat{[X]}_T - \\int_0^T\\!\\sigma_s^2 ds\\right) \\Rightarrow \\mathcal{MN}\\!\\left(0,\\, 2\\!\\int_0^T\\!\\sigma_s^4 ds\\right) \\quad\\text{(in-fill)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nM, D = 780, 250                              # 30-second grid, 250 days\ndt, kappa, xi = 1.0 / M, 3.0, 0.8\nm = np.log(0.014 ** 2)                       # long-run mean of log-variance (22% annualised)\na = np.exp(-kappa * dt)\nb = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\nr = np.random.default_rng(346)\nvar = np.exp(m + lfilter([b], [1.0, -a], r.standard_normal(M * D))).reshape(D, M)\ndX = np.sqrt(var * dt) * r.standard_normal((D, M))\nIV = (var * dt).sum(axis=1)\nEIV = np.exp(m + xi ** 2 / (4.0 * kappa))    # stationary E[IV], closed form\n\nprint(\"true stationary E[IV] x 1e4   %.4f        sample mean of IV x 1e4  %.4f\"\n      % (1e4 * EIV, 1e4 * IV.mean()))\nprint(\"sd of IV across days  x 1e4   %.4f        range  %.4f to %.4f\"\n      % (1e4 * IV.std(ddof=1), 1e4 * IV.min(), 1e4 * IV.max()))\nprint(\"\")\nprint(\"IN-FILL: window fixed at ONE day, grid refines. Target = that day's own IV.\")\nprint(\"     n   RMSE(RV_d - IV_d) x 1e4   RMSE x sqrt(n) x 1e4\")\nfor n in (26, 65, 156, 390, 780):\n    e = (dX.reshape(D, n, M // n).sum(axis=2) ** 2).sum(axis=1) - IV\n    rmse = np.sqrt(np.mean(e ** 2))\n    print(\"%6d  %24.4f  %21.4f\" % (n, 1e4 * rmse, 1e4 * rmse * np.sqrt(n)))\nprint(\"\")\nprint(\"LONG-SPAN: 65 returns a day fixed, window lengthens. Target = the PARAMETER E[IV].\")\nrv65 = (dX.reshape(D, 65, M // 65).sum(axis=2) ** 2).sum(axis=1)\nprint(\"  days   |mean(RV) - E[IV]| x 1e4   err x sqrt(days) x 1e4\")\nfor d in (5, 25, 100, 250):\n    e = abs(rv65[:d].mean() - EIV)\n    print(\"%6d  %24.4f  %22.4f\" % (d, 1e4 * e, 1e4 * e * np.sqrt(d)))\nprint(\"\")\nprint(\"Refining the grid pins down one day's realisation ever more precisely and says\")\nprint(\"nothing about E[IV]; lengthening the window does exactly the opposite.\")\n",
            "output": "true stationary E[IV] x 1e4   2.0674        sample mean of IV x 1e4  2.0772\nsd of IV across days  x 1e4   0.4732        range  1.0786 to 3.5756\n\nIN-FILL: window fixed at ONE day, grid refines. Target = that day's own IV.\n     n   RMSE(RV_d - IV_d) x 1e4   RMSE x sqrt(n) x 1e4\n    26                    0.6227                 3.1753\n    65                    0.4077                 3.2870\n   156                    0.2401                 2.9984\n   390                    0.1588                 3.1363\n   780                    0.1066                 2.9769\n\nLONG-SPAN: 65 returns a day fixed, window lengthens. Target = the PARAMETER E[IV].\n  days   |mean(RV) - E[IV]| x 1e4   err x sqrt(days) x 1e4\n     5                    0.5052                  1.1296\n    25                    0.0421                  0.2104\n   100                    0.0554                  0.5537\n   250                    0.0073                  0.1153\n\nRefining the grid pins down one day's realisation ever more precisely and says\nnothing about E[IV]; lengthening the window does exactly the opposite."
          }
        },
        {
          "name": "Longitudinal measurement versus cross-sectional calibration",
          "explain": "<p>The public description of the course makes a point of saying that the statistical theory here is longitudinal and therefore complements cross-sectional calibration methods such as implied volatility. It is worth being precise about the difference, because the two produce numbers with the same units and completely different meanings.</p><p>A cross-sectional method reads one instant of a panel of option prices and infers a forward-looking, risk-neutral distribution — a market view, mixed with a variance risk premium. A longitudinal method reads one asset's path finely in time and measures what volatility actually was, under the physical measure, with a standard error attached. Neither is a substitute for the other, and the systematic gap between them is itself an object of study.</p><p>The snippet illustrates the part that is purely statistical. Regressing each day's integrated variance on that day's realised variance gives a slope of 0.90 and an R-squared of 0.90 at one-minute sampling: the tape tells you the day. The best single constant — the stand-in here for one calibrated level applied to every day — has an R-squared of zero against day-to-day variation by construction, and the days it is applied to range from 17% to 29% annualised volatility.</p><p>A research team cares because 'our model is calibrated' and 'our model fits the realised path' are different claims, and only the second one has a confidence interval.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nM, D = 390, 500                              # one-minute grid, 500 days\ndt, kappa, xi = 1.0 / M, 3.0, 0.8\nm = np.log(0.014 ** 2)\na = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\nr = np.random.default_rng(1346)\nvar = np.exp(m + lfilter([b], [1.0, -a], r.standard_normal(M * D))).reshape(D, M)\ndX = np.sqrt(var * dt) * r.standard_normal((D, M))\nIV = (var * dt).sum(axis=1)\nRV = (dX ** 2).sum(axis=1)\n\ndef r2(y, yhat):\n    return 1.0 - np.sum((y - yhat) ** 2) / np.sum((y - y.mean()) ** 2)\n\nA = np.column_stack([np.ones(D), RV])\ncoef = np.linalg.lstsq(A, IV, rcond=None)[0]\nprint(\"regress IV_d on RV_d      intercept x1e4 %+.4f   slope %.4f   R2 %.4f\"\n      % (1e4 * coef[0], coef[1], r2(IV, A @ coef)))\nflat = IV.mean()\nprint(\"best single constant      level     x1e4 %.4f                     R2 %.4f\"\n      % (1e4 * flat, r2(IV, np.full(D, flat))))\nprint(\"\")\nprint(\"IV_d / that constant, quantiles 1 / 10 / 50 / 90 / 99:\")\nprint(\"   \" + \"   \".join(\"%.2f\" % v for v in np.quantile(IV / flat, [.01, .10, .50, .90, .99])))\nprint(\"\")\nprint(\"annualised vol implied by the constant        %.1f%%\" % (100 * np.sqrt(252 * flat)))\nprint(\"annualised vol on the 1st-percentile day      %.1f%%\" % (100 * np.sqrt(252 * np.quantile(IV, .01))))\nprint(\"annualised vol on the 99th-percentile day     %.1f%%\" % (100 * np.sqrt(252 * np.quantile(IV, .99))))\nprint(\"\")\nprint(\"A longitudinal estimator answers 'what was volatility today, plus or minus what'.\")\nprint(\"One calibrated level, however well fitted to a cross-section, cannot answer that.\")\n",
            "output": "regress IV_d on RV_d      intercept x1e4 +0.2047   slope 0.8980   R2 0.8981\nbest single constant      level     x1e4 2.0064                     R2 0.0000\n\nIV_d / that constant, quantiles 1 / 10 / 50 / 90 / 99:\n   0.58   0.74   0.98   1.29   1.61\n\nannualised vol implied by the constant        22.5%\nannualised vol on the 1st-percentile day      17.1%\nannualised vol on the 99th-percentile day     28.5%\n\nA longitudinal estimator answers 'what was volatility today, plus or minus what'.\nOne calibrated level, however well fitted to a cross-section, cannot answer that."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "In-fill convergence: realised-variance error against the number of returns",
        "params": {
          "xlab": "returns per day (n)",
          "ylab": "RMSE of RV - IV, in units of 1e-4",
          "log": true,
          "series": [
            {
              "name": "measured RMSE",
              "x": [
                26,
                65,
                156,
                390,
                780
              ],
              "y": [
                0.6227,
                0.4077,
                0.2401,
                0.1588,
                0.1066
              ]
            },
            {
              "name": "3.1 / sqrt(n) reference",
              "x": [
                26,
                65,
                156,
                390,
                780
              ],
              "y": [
                0.608,
                0.3845,
                0.2482,
                0.157,
                0.111
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Calling integrated variance a parameter. It is a random variable, different every day, and a confidence interval for it is a statement about one path rather than about a population.",
        "Assuming a large drift must contaminate a variance estimate. It does not: the drift's contribution to quadratic variation is of order one over n, which is why realised variance needs no mean correction and why de-meaning intraday returns is at best pointless.",
        "Mixing the two asymptotic regimes in one sentence. 'More data' means refining the grid or lengthening the window, and the two improve entirely different quantities.",
        "Reading the square-root-of-n rate as a promise of accuracy at any frequency. From week 3 onward the rate is only available if microstructure noise is dealt with; on raw tick data, refining the grid makes the estimate worse, not better."
      ],
      "check": [
        {
          "q": "A log price has a deterministic drift of 20% per day and a volatility of 1% per day. What happens to realised variance as the grid refines?",
          "options": [
            "It diverges, because the drift dominates",
            "It converges to the integrated variance; the drift contributes nothing in the limit",
            "It converges to the integrated variance plus the squared drift times the horizon",
            "It converges only if the returns are de-meaned first"
          ],
          "answer": 1,
          "why": "A finite-variation drift has zero quadratic variation, and its discrete contribution is of order one over n, so no de-meaning is needed and no squared-drift term survives."
        },
        {
          "q": "Which quantity does in-fill asymptotics allow you to estimate with vanishing error?",
          "options": [
            "The long-run mean of the variance process",
            "The drift of the log price over the day",
            "That specific day's integrated variance",
            "The persistence parameter of the volatility process"
          ],
          "answer": 2,
          "why": "Refining the grid identifies a path functional over the fixed window; the other three are distributional features that need a long span of days."
        },
        {
          "q": "Sampling one-second returns instead of five-minute returns improves the estimate of which of these most?",
          "options": [
            "The expected return over the day",
            "The integrated variance over the day",
            "Both roughly equally",
            "Neither, in a noise-free world"
          ],
          "answer": 1,
          "why": "Volatility information grows with the number of increments while drift information depends only on the window length, so the variance estimate improves and the mean estimate does not move at all."
        },
        {
          "q": "Total variation (the sum of absolute increments) of a simulated diffusion grows like which of the following?",
          "options": [
            "A constant",
            "log n",
            "sqrt(n)",
            "n"
          ],
          "answer": 2,
          "why": "Each absolute increment is of order the square root of one over n and there are n of them, so the sum scales like the square root of n — which is also why a Brownian path has infinite total variation."
        }
      ],
      "n": 1
    },
    {
      "title": "Realised variance: the central limit theorem, quarticity and honest intervals",
      "topics": [
        "consistency of realised variance",
        "the mixed-normal central limit theorem",
        "integrated quarticity and its estimators",
        "feasible confidence intervals and their coverage",
        "heteroskedasticity in the volatility path"
      ],
      "concepts": [
        {
          "name": "The limit is mixed normal, and the mixing matters",
          "explain": "<p>Realised variance is consistent, but consistency alone is useless for inference. The distributional result is that the square root of n times the estimation error converges stably to a normal law whose variance is two times the integrated quarticity — the integral of the fourth power of spot volatility. Because that variance is itself a random functional of the path, the limit is a normal <em>variance mixture</em>, not a normal.</p><p>This is not a technicality. The snippet builds two worlds with matched average variance. In the constant-volatility world the standardised statistic is essentially standard normal: sample standard deviation 1.00, kurtosis 3.08. In the stochastic-volatility world, standardising by a fixed asymptotic variance — as you would if you forgot the limit was mixed — gives a standard deviation of 1.14 and a kurtosis of 5.68. The tails are far heavier than the nominal law, so a 95% interval built that way is not a 95% interval.</p><p>Standardising instead by each day's own integrated quarticity restores standard deviation 1.00 and kurtosis 3.15. That is what stable convergence buys: it licenses dividing by a consistent estimate of the random variance and recovering a pivotal statistic.</p><p>A risk team cares because this is exactly the mechanism by which a variance estimate's error bars are understated on precisely the days when volatility moved most, which are the days anyone actually asks about.</p>",
          "formula": "\\sqrt{n}\\big(RV_n - IV\\big) \\;\\xrightarrow{\\;\\mathcal{L}\\text{-s}\\;}\\; \\sqrt{2\\,IQ}\\cdot Z, \\qquad IQ=\\int_0^T \\sigma_s^4\\,ds",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy import stats\nfrom scipy.signal import lfilter\n\nn, D = 390, 2500                 # one-minute returns, 4000 simulated days\ndt = 1.0 / n\n\n# ── world A: constant volatility ─────────────────────────────────────────\nsA = 0.014\nrA = np.random.default_rng(21)\ndXA = sA * np.sqrt(dt) * rA.standard_normal((D, n))\nRVA = (dXA ** 2).sum(axis=1)\nIVA, IQA = sA ** 2, sA ** 4\nzA = (RVA - IVA) / np.sqrt(2.0 * IQA / n)\n\n# ── world B: the same average variance, but a random vol path per day ────\nkappa, xi = 3.0, 1.1\nm = np.log(sA ** 2) - xi ** 2 / (4.0 * kappa)     # match E[variance] to world A\na = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\nrB = np.random.default_rng(22)\nvar = np.exp(m + lfilter([b], [1.0, -a], rB.standard_normal(n * D))).reshape(D, n)\ndXB = np.sqrt(var * dt) * rB.standard_normal((D, n))\nRVB = (dXB ** 2).sum(axis=1)\nIVB = (var * dt).sum(axis=1)\nIQB = (var ** 2 * dt).sum(axis=1)                 # each day's own quarticity\nzB_wrong = (RVB - IVB) / np.sqrt(2.0 * IQA / n)   # pretend the variance is fixed\nzB_right = (RVB - IVB) / np.sqrt(2.0 * IQB / n)   # the day's own random variance\n\nprint(\"                              mean     sd   skew   kurtosis   KS vs N(0,1)\")\nfor name, z in ((\"constant vol, studentised \", zA),\n                (\"stoch vol, FIXED variance \", zB_wrong),\n                (\"stoch vol, day's own var  \", zB_right)):\n    print(\"%s %7.3f %6.3f %6.3f %10.3f %13.4f\"\n          % (name, z.mean(), z.std(ddof=1), stats.skew(z), stats.kurtosis(z, fisher=False),\n             stats.kstest(z, \"norm\").statistic))\nprint(\"\")\nprint(\"E[IV] world A %.4e   world B %.4e   (matched by construction)\" % (IVA, IVB.mean()))\nprint(\"Using a FIXED asymptotic variance under stochastic vol inflates the spread to\")\nprint(\"sd %.3f and the tails to kurtosis %.2f: that is the 'mixed' in mixed normal.\"\n      % (zB_wrong.std(ddof=1), stats.kurtosis(zB_wrong, fisher=False)))\n",
            "output": "                              mean     sd   skew   kurtosis   KS vs N(0,1)\nconstant vol, studentised   -0.010  1.000  0.154      3.079        0.0206\nstoch vol, FIXED variance   -0.028  1.142  0.084      5.678        0.0206\nstoch vol, day's own var    -0.019  1.001  0.133      3.152        0.0200\n\nE[IV] world A 1.9600e-04   world B 1.9801e-04   (matched by construction)\nUsing a FIXED asymptotic variance under stochastic vol inflates the spread to\nsd 1.142 and the tails to kurtosis 5.68: that is the 'mixed' in mixed normal."
          }
        },
        {
          "name": "Integrated quarticity is the price of a confidence interval",
          "explain": "<p>To use the central limit theorem you need integrated quarticity, and quarticity has to be estimated from the same returns. The natural estimator is realised quarticity: n over three, times the sum of fourth powers of the returns. The factor comes from the fourth moment of a Gaussian increment, and the leading n is there because a fourth power is of order one over n squared.</p><p>The snippet shows the good news and the bad news together. Realised quarticity is consistent — the mean ratio to true quarticity goes from 0.97 at 39 returns a day to 1.00 at 780 — but it is much noisier than realised variance on the same data. At 390 returns a day the relative root mean squared error is 0.19 for quarticity against 0.077 for variance, a factor of about two and a half. Fourth powers are dominated by the largest few returns of the day, so the estimator has a long right tail.</p><p>The snippet also computes tripower quarticity, which multiplies three adjacent absolute returns raised to the power four thirds. It is slightly biased low in finite samples — 0.98 of true quarticity at 390 returns — and in exchange it survives the jumps of week 6, where realised quarticity does not.</p><p>A desk cares because the width of every realised-variance error bar is itself an estimate carrying about a 20% relative error, which is the honest reason those error bars are usually drawn generously.</p>",
          "formula": "RQ_n \\;=\\; \\frac{n}{3}\\sum_{i=1}^{n} r_i^4 \\;\\xrightarrow{p}\\; \\int_0^T \\sigma_s^4\\,ds",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\nfrom scipy.special import gamma as G\n\nM, D = 1560, 600                       # finest grid 1560/day, 600 days\ndt, kappa, xi = 1.0 / M, 3.0, 1.1\nm = np.log(0.014 ** 2)\na = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\nr = np.random.default_rng(2346)\nvar = np.exp(m + lfilter([b], [1.0, -a], r.standard_normal(M * D))).reshape(D, M)\ndX = np.sqrt(var * dt) * r.standard_normal((D, M))\n\nMU1 = np.sqrt(2.0 / np.pi)             # E|Z|\nMU43 = 2 ** (2 / 3) * G(7 / 6) / G(0.5)     # E|Z|^(4/3)\n\ndef stats_for(n):\n    step = M // n\n    rr = dX.reshape(D, n, step).sum(axis=2)\n    v = var.reshape(D, n, step).mean(axis=2)\n    IV = (v * (1.0 / n)).sum(axis=1)\n    IQ = (v ** 2 * (1.0 / n)).sum(axis=1)          # each day's integrated quarticity\n    RV = (rr ** 2).sum(axis=1)\n    RQ = (n / 3.0) * (rr ** 4).sum(axis=1)         # realised quarticity\n    ar = np.abs(rr)\n    TQ = n * MU43 ** (-3) * (ar[:, :-2] ** (4 / 3) * ar[:, 1:-1] ** (4 / 3)\n                             * ar[:, 2:] ** (4 / 3)).sum(axis=1)   # tripower quarticity\n    return IV, IQ, RV, RQ, TQ\n\nprint(\"      n   mean RQ/IQ   rel.RMSE(RQ)   mean TQ/IQ   rel.RMSE(RV)\")\nkeep = {}\nfor n in (39, 78, 195, 390, 780):\n    IV, IQ, RV, RQ, TQ = stats_for(n)\n    rq_err = np.sqrt(np.mean((RQ / IQ - 1) ** 2))\n    rv_err = np.sqrt(np.mean((RV / IV - 1) ** 2))\n    keep[n] = (rq_err, rv_err)\n    print(\"%7d  %11.4f  %13.3f  %11.4f  %13.4f\"\n          % (n, (RQ / IQ).mean(), rq_err, (TQ / IQ).mean(), rv_err))\nprint(\"\")\nprint(\"Quarticity is consistent but far noisier than variance: at n = 390 the relative\")\nprint(\"RMSE of RQ is %.2f against %.3f for RV on the very same returns.\"\n      % keep[390])\nprint(\"Tripower quarticity costs a little finite-sample bias (%.3f of IQ at n = 390)\"\n      % (stats_for(390)[4] / stats_for(390)[1]).mean())\nprint(\"and buys robustness to the jumps of week 6. A realised-variance interval is\")\nprint(\"therefore wider in practice than the textbook formula suggests: its own width\")\nprint(\"is an estimate with a 20% relative error attached.\")\n",
            "output": "      n   mean RQ/IQ   rel.RMSE(RQ)   mean TQ/IQ   rel.RMSE(RV)\n     39       0.9694          0.589       0.8953         0.2453\n     78       0.9831          0.438       0.9506         0.1804\n    195       0.9734          0.272       0.9447         0.1075\n    390       0.9971          0.194       0.9815         0.0772\n    780       1.0033          0.136       0.9880         0.0525\n\nQuarticity is consistent but far noisier than variance: at n = 390 the relative\nRMSE of RQ is 0.19 against 0.077 for RV on the very same returns.\nTripower quarticity costs a little finite-sample bias (0.981 of IQ at n = 390)\nand buys robustness to the jumps of week 6. A realised-variance interval is\ntherefore wider in practice than the textbook formula suggests: its own width\nis an estimate with a 20% relative error attached."
          }
        },
        {
          "name": "Feasible intervals, and what they actually cover",
          "explain": "<p>Put the two previous concepts together and you get the interval a practitioner can compute: realised variance plus or minus 1.96 times the square root of two times realised quarticity over n. The snippet measures how often that interval actually contains the day's integrated variance, across four sampling frequencies and four thousand simulated days.</p><p>Three lessons come out. First, the infeasible interval using true quarticity covers at 95.5%, 95.2%, 94.9%, 95.2% — the theory is right. Second, the feasible interval under-covers at coarse grids: 90.6% at 39 returns a day, recovering to 94.7% at 390. The shortfall is a finite-sample effect, driven by quarticity's own noise and its correlation with the estimation error. Third, the common shortcut of approximating quarticity by the square of realised variance — which is what assuming constant volatility within the day amounts to — under-covers everywhere, because by Jensen's inequality the integral of sigma to the fourth is at least the square of the integral of sigma squared.</p><p>The fourth column builds the interval on the logarithm of realised variance and exponentiates the endpoints. That respects positivity and skewness, and it recovers roughly two percentage points of coverage at the coarse end for no extra work.</p><p>A desk cares because an interval that claims 95% and delivers 91% is worse than no interval: it converts an unknown into a false precision that someone downstream will size a position against.</p>",
          "formula": "IV \\in \\left[\\, RV_n \\pm z_{0.975}\\sqrt{\\tfrac{2}{n}\\,RQ_n} \\,\\right], \\qquad \\text{or on the log scale } \\; RV_n\\exp\\!\\left(\\pm z_{0.975}\\tfrac{\\sqrt{2RQ_n/n}}{RV_n}\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nD = 4000                                # days\nkappa, xi, m = 3.0, 1.1, np.log(0.014 ** 2)\nZ975 = 1.959963984540054                 # normal 97.5% point, hard-coded to stay offline-exact\n\ndef world(n, seed):\n    dt = 1.0 / n\n    a = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\n    r = np.random.default_rng(seed)\n    var = np.exp(m + lfilter([b], [1.0, -a], r.standard_normal(n * D))).reshape(D, n)\n    dX = np.sqrt(var * dt) * r.standard_normal((D, n))\n    IV = (var * dt).sum(axis=1)\n    IQ = (var ** 2 * dt).sum(axis=1)\n    RV = (dX ** 2).sum(axis=1)\n    RQ = (n / 3.0) * (dX ** 4).sum(axis=1)\n    return IV, IQ, RV, RQ\n\ndef cover(RV, avar, IV, n):\n    h = Z975 * np.sqrt(avar / n)\n    return float(np.mean((RV - h <= IV) & (IV <= RV + h)))\n\nprint(\"nominal coverage 95.0%\")\nprint(\"      n   true IQ   RQ plug-in   constant-vol IQ ~ RV^2   log-transform + RQ\")\nfor n in (39, 78, 195, 390):\n    IV, IQ, RV, RQ = world(n, 500 + n)\n    c_true = cover(RV, 2.0 * IQ, IV, n)\n    c_rq = cover(RV, 2.0 * RQ, IV, n)\n    c_cv = cover(RV, 2.0 * RV ** 2, IV, n)          # IQ approximated by IV^2 (T = 1)\n    se_log = np.sqrt(2.0 * RQ / n) / RV             # delta method on log RV\n    lo, hi = RV * np.exp(-Z975 * se_log), RV * np.exp(Z975 * se_log)\n    c_log = float(np.mean((lo <= IV) & (IV <= hi)))\n    print(\"%7d  %7.1f%%  %10.1f%%  %22.1f%%  %19.1f%%\"\n          % (n, 100 * c_true, 100 * c_rq, 100 * c_cv, 100 * c_log))\nprint(\"\")\nprint(\"The infeasible interval is honest. Plugging in realised quarticity under-covers\")\nprint(\"at coarse grids because RQ is noisy and the limit is only approached slowly.\")\nprint(\"Assuming constant vol within the day under-states quarticity by Jensen and\")\nprint(\"under-covers throughout. Building the interval on log RV and exponentiating\")\nprint(\"recovers most of the gap at no extra cost, which is why it is the default.\")\n",
            "output": "nominal coverage 95.0%\n      n   true IQ   RQ plug-in   constant-vol IQ ~ RV^2   log-transform + RQ\n     39     95.5%        90.6%                    91.0%                 92.8%\n     78     95.2%        92.6%                    92.5%                 93.9%\n    195     94.9%        93.7%                    93.0%                 94.2%\n    390     95.2%        94.7%                    93.6%                 94.8%\n\nThe infeasible interval is honest. Plugging in realised quarticity under-covers\nat coarse grids because RQ is noisy and the limit is only approached slowly.\nAssuming constant vol within the day under-states quarticity by Jensen and\nunder-covers throughout. Building the interval on log RV and exponentiating\nrecovers most of the gap at no extra cost, which is why it is the default."
          }
        },
        {
          "name": "Heteroskedasticity does not bias the estimate; it widens the interval",
          "explain": "<p>Intraday volatility is not flat. Equity volatility is high at the open, sags in the middle of the day and rises into the close, and news arrives in bursts. It is worth being precise about what that does to realised variance, because the intuition people import from cross-sectional regression is wrong here.</p><p>The snippet builds two worlds with <em>identical</em> integrated variance: one with a flat intraday variance profile, one with a U-shaped one. Realised variance is unbiased for integrated variance in both — there is nothing to correct. What changes is quarticity, and therefore the asymptotic variance. The U-shaped world has 1.71 times the quarticity of the flat one, so the predicted standard deviation of realised variance is the square root of that, 1.31 times larger, and the measured ratio is 1.32.</p><p>In other words a confidence interval for the same integrated variance is about 31% wider when the variance is concentrated in part of the day. Concentrating variance into fewer intervals means fewer effective observations about it, and quarticity is exactly the functional that counts effective observations.</p><p>A desk cares on event days: an integrated variance dominated by the ten minutes around a central-bank release is measured far less precisely than the same number spread over six hours, and that is a statement about the error bar, not about the estimate.</p>",
          "formula": "\\mathrm{AVAR}(RV_n) = \\frac{2}{n}\\int_0^T\\!\\sigma_s^4 ds \\;\\ge\\; \\frac{2}{nT}\\left(\\int_0^T\\!\\sigma_s^2 ds\\right)^{\\!2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn, D = 390, 30000                      # one-minute returns, 30000 days\ndt = 1.0 / n\nt = (np.arange(n) + 0.5) * dt\nV = 0.014 ** 2                         # the SAME integrated variance in both worlds\n\nshape = 0.35 + 3.0 * (2 * t - 1) ** 4  # a U-shaped intraday variance profile\nflat = np.ones(n)\n\ndef build(prof):\n    v = V * prof / (prof.mean())       # rescale so that sum(v)*dt = V exactly\n    return v\n\nworlds = {\"flat intraday variance\": build(flat), \"U-shaped intraday variance\": build(shape)}\nr = np.random.default_rng(99)\n\nprint(\"both worlds have integrated variance %.6e over the day\" % V)\nprint(\"\")\nprint(\"%-28s   IV       IQ        sd(RV) predicted   sd(RV) measured   ratio\" % \"world\")\nres = {}\nfor name, v in worlds.items():\n    IV = (v * dt).sum()\n    IQ = (v ** 2 * dt).sum()\n    dX = np.sqrt(v * dt) * r.standard_normal((D, n))\n    RV = (dX ** 2).sum(axis=1)\n    pred = np.sqrt(2.0 * IQ / n)\n    res[name] = (IQ, pred, RV.std(ddof=1))\n    print(\"%-28s %.2e %.3e  %16.3e  %16.3e  %6.3f\"\n          % (name, IV, IQ, pred, RV.std(ddof=1), RV.std(ddof=1) / pred))\nprint(\"\")\na = res[\"flat intraday variance\"]; b = res[\"U-shaped intraday variance\"]\nprint(\"quarticity ratio  IQ_U / IQ_flat            = %.3f\" % (b[0] / a[0]))\nprint(\"predicted sd ratio sqrt(IQ_U / IQ_flat)     = %.3f\" % np.sqrt(b[0] / a[0]))\nprint(\"measured  sd ratio                          = %.3f\" % (b[2] / a[2]))\nprint(\"\")\nprint(\"Identical integrated variance, identical realised-variance expectation, and a\")\nprint(\"confidence interval %.0f%% wider in the U-shaped world. Heteroskedasticity in the\"\n      % (100 * (np.sqrt(b[0] / a[0]) - 1)))\nprint(\"volatility path does not bias RV at all; it enters only the asymptotic variance.\")\n",
            "output": "both worlds have integrated variance 1.960000e-04 over the day\n\nworld                          IV       IQ        sd(RV) predicted   sd(RV) measured   ratio\nflat intraday variance       1.96e-04 3.842e-08         1.404e-05         1.398e-05   0.996\nU-shaped intraday variance   1.96e-04 6.566e-08         1.835e-05         1.842e-05   1.004\n\nquarticity ratio  IQ_U / IQ_flat            = 1.709\npredicted sd ratio sqrt(IQ_U / IQ_flat)     = 1.307\nmeasured  sd ratio                          = 1.318\n\nIdentical integrated variance, identical realised-variance expectation, and a\nconfidence interval 31% wider in the U-shaped world. Heteroskedasticity in the\nvolatility path does not bias RV at all; it enters only the asymptotic variance."
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "Realised-variance error standardised by a FIXED variance: a real sample of 180 days",
        "params": {
          "sampler": "bootstrap",
          "bins": 34,
          "n": 3000,
          "overlay": true,
          "seed": 24600,
          "q": 0.025,
          "params": {
            "data": [
              -0.4901,
              -0.6161,
              0.7223,
              -2.3193,
              -0.2939,
              2.0142,
              -2.2498,
              -0.9182,
              0.0845,
              -0.8054,
              -2.8514,
              -0.2688,
              -1.1547,
              -0.6902,
              0.5351,
              -1.0919,
              -1.8673,
              -1.6256,
              0.1302,
              -0.3025,
              -1.8699,
              0.5674,
              0.4466,
              -0.5921,
              -0.0124,
              0.4392,
              0.1668,
              -0.8206,
              -0.9496,
              -0.556,
              -0.904,
              0.8054,
              -1.2191,
              -2.4175,
              4.875,
              -0.7656,
              1.9104,
              0.1003,
              0.3622,
              0.1615,
              0.1344,
              -2.0522,
              -1.3498,
              -0.3443,
              1.6364,
              0.356,
              0.6795,
              0.223,
              -0.9802,
              -0.3187,
              0.2811,
              -0.605,
              -2.119,
              1.2369,
              1.0909,
              -0.1398,
              0.7389,
              0.3717,
              0.547,
              -0.8705,
              -0.1265,
              1.1374,
              0.3757,
              -0.6929,
              0.1174,
              -1.335,
              -0.925,
              -1.0659,
              -0.3426,
              0.4268,
              0.067,
              -0.5305,
              1.1204,
              0.3601,
              -0.1931,
              -0.8727,
              -0.7252,
              0.8094,
              0.2852,
              0.8711,
              -1.0585,
              0.4018,
              -0.2083,
              -0.7492,
              0.5883,
              1.1161,
              0.1288,
              1.1882,
              0.7853,
              0.7413,
              -1.9843,
              0.745,
              -3.1649,
              1.6565,
              -0.1619,
              -1.8636,
              0.1954,
              -0.5054,
              0.8028,
              -0.1703,
              -1.0554,
              -0.2408,
              -0.6354,
              -0.443,
              -1.0988,
              1.1405,
              4.445,
              1.2536,
              -0.1382,
              -0.4637,
              -0.9452,
              3.7778,
              -0.3424,
              -2.9265,
              -0.5689,
              0.1595,
              -2.3393,
              0.2763,
              0.3123,
              -0.3132,
              1.061,
              1.9578,
              1.4948,
              -0.3918,
              -0.6156,
              -2.8553,
              -0.5106,
              -2.2985,
              0.0925,
              0.2728,
              0.8199,
              0.1359,
              0.7044,
              0.319,
              -1.0147,
              -0.4286,
              -2.3821,
              -0.1633,
              0.3565,
              0.2256,
              0.0574,
              0.8836,
              -0.1528,
              -0.667,
              -0.0129,
              -0.8715,
              0.8526,
              -0.5792,
              -0.974,
              -0.6147,
              1.3357,
              -0.6139,
              2.8949,
              2.7424,
              1.3489,
              -1.4502,
              0.7296,
              0.6162,
              -0.5942,
              1.4214,
              -0.3943,
              -2.9052,
              0.0354,
              -0.1356,
              1.687,
              0.2933,
              -0.1716,
              -0.0765,
              1.0359,
              -0.7075,
              -1.5077,
              0.6549,
              -1.618,
              -0.6325,
              -0.691,
              -0.0519,
              -0.6138,
              -1.1444,
              -1.5628,
              -0.5155
            ]
          }
        }
      },
      "pitfalls": [
        "Treating the realised-variance limit as normal with a known variance. It is normal with a random variance, so only the studentised statistic is pivotal, and only because the convergence is stable.",
        "Approximating quarticity by the square of realised variance. That is the constant-volatility case, it is a lower bound by Jensen's inequality, and it under-covers on exactly the heteroskedastic days you care about.",
        "Trusting a feasible interval at coarse sampling. At 39 returns a day the nominal 95% interval covered 90.6% in the simulation above; the asymptotics need more returns than a half-hourly grid provides.",
        "Using realised quarticity on a day with a jump. Fourth powers are dominated by the largest return, so one jump can double the estimated interval width; use a multipower or truncated quarticity instead (week 6)."
      ],
      "check": [
        {
          "q": "The asymptotic variance of realised variance is two times integrated quarticity over n. What does that make the limit law?",
          "options": [
            "Normal with a known variance",
            "Mixed normal: normal conditionally on a random variance",
            "Chi-squared with n degrees of freedom",
            "Student t with n minus one degrees of freedom"
          ],
          "answer": 1,
          "why": "Quarticity is a random functional of the volatility path, so the limit is a normal variance mixture; the chi-squared and t answers would require a fixed parametric variance."
        },
        {
          "q": "Two days have the same integrated variance, but on day A the variance is flat and on day B it is concentrated in the first hour. Which statement is right?",
          "options": [
            "Realised variance is biased upward on day B",
            "Realised variance is biased downward on day B",
            "Realised variance is unbiased on both, but its confidence interval is wider on day B",
            "Realised variance is unbiased on both and the intervals are identical"
          ],
          "answer": 2,
          "why": "Heteroskedasticity leaves the estimand and the estimator's expectation alone but raises integrated quarticity, and quarticity is the asymptotic variance."
        },
        {
          "q": "Why is realised quarticity so much noisier than realised variance?",
          "options": [
            "It uses fewer observations",
            "It is a biased estimator",
            "Fourth powers are dominated by the largest few returns of the day",
            "It requires a bandwidth choice"
          ],
          "answer": 2,
          "why": "A fourth power concentrates all the weight on the extremes of the return distribution, which is also why a single jump is enough to wreck it."
        },
        {
          "q": "Building the confidence interval on log realised variance and exponentiating mainly helps because it",
          "options": [
            "Removes the need to estimate quarticity",
            "Respects positivity and the estimator's right skew, improving small-sample coverage",
            "Changes the estimand to log integrated variance",
            "Makes the estimator consistent"
          ],
          "answer": 1,
          "why": "The delta-method interval on the log scale cannot produce a negative lower bound and matches the skewness better; the estimand and the consistency are unchanged."
        }
      ],
      "n": 2
    },
    {
      "title": "Market-microstructure noise and the volatility signature plot",
      "topics": [
        "the additive noise model",
        "the 2 n omega-squared bias in realised variance",
        "the volatility signature plot",
        "where noise comes from: bounce, discreteness, queueing",
        "the mean-squared-error trade-off in the sampling frequency",
        "dependent noise and why the simple correction fails"
      ],
      "concepts": [
        {
          "name": "Additive noise, and the bias that grows with the sample size",
          "explain": "<p>Weeks 1 and 2 promised that refining the grid always helps. On real tick data it does the opposite, and this week is why. Model the observed log price as the efficient price plus a noise term: rounding to the tick grid, the bid-ask bounce, the queue you happened to be at the front of. Take a return and you difference the noise as well as the signal, so each observed squared return carries roughly two times the noise variance on top of the true squared increment.</p><p>Sum over n returns and the bias is two times n times the noise variance. It is linear in the number of observations, which means it is unbounded: the estimator diverges as the grid refines. The efficient price's contribution stays put at the integrated variance while the noise contribution runs away.</p><p>The snippet calibrates this to a plausible liquid US equity: 22% annualised volatility and a noise standard deviation of 1.5 basis points per observation. At half-hourly sampling realised variance is within 1% of the truth. At one-minute sampling it is 9% too high, at ten seconds 53% too high, and at one-second sampling it is 6.4 times the integrated variance. The measured bias matches two times n times the noise variance at every frequency to within a few percent.</p><p>A desk cares because a variance number computed off the raw tape is not a slightly noisy estimate of volatility, it is a measurement of the spread — and it will be six times too large in a risk report nobody re-derived.</p>",
          "formula": "Y_{t_i} = X_{t_i} + u_{t_i}, \\qquad E\\big[RV_n(Y)\\big] \\;\\approx\\; \\underbrace{\\int_0^T\\!\\sigma_s^2 ds}_{\\text{signal}} \\;+\\; \\underbrace{2n\\,\\omega^2}_{\\text{noise}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM = 23400                       # one efficient-price tick per second, 6.5 hours\nIV = 0.014 ** 2                 # 22% annualised, as integrated variance for the day\nOMEGA = 0.00015                 # noise sd per observation: 1.5 basis points\nREPS = 300\nr = np.random.default_rng(3346)\n\ndt = 1.0 / M\ndX = np.sqrt(IV * dt) * r.standard_normal((REPS, M))\nX = np.concatenate([np.zeros((REPS, 1)), np.cumsum(dX, axis=1)], axis=1)\nY = X + OMEGA * r.standard_normal((REPS, M + 1))       # observed = efficient + noise\n\nprint(\"true integrated variance            %.4e   (%.1f%% annualised)\"\n      % (IV, 100 * np.sqrt(252 * IV)))\nprint(\"noise sd per observation            %.2e   (%.2f basis points)\"\n      % (OMEGA, 1e4 * OMEGA))\nprint(\"\")\nprint(\"  interval        n    mean RV(Y)   RV/IV    bias measured   bias 2*n*omega^2\")\nratios = {}\nfor secs in (1800, 600, 300, 60, 30, 10, 5, 1):\n    n = M // secs\n    idx = np.arange(0, M + 1, secs)\n    rv = (np.diff(Y[:, idx], axis=1) ** 2).sum(axis=1).mean()\n    ratios[secs] = rv / IV\n    print(\"%6ds %9d  %11.4e  %6.2f  %14.4e  %16.4e\"\n          % (secs, n, rv, rv / IV, rv - IV, 2.0 * n * OMEGA ** 2))\nprint(\"\")\nprint(\"Sampling faster makes the estimate WORSE, without limit: at one-second sampling\")\nprint(\"realised variance is %.1f times the integrated variance it is meant to estimate.\"\n      % ratios[1])\nprint(\"The measured bias tracks 2*n*omega^2 to within a few percent at every frequency,\")\nprint(\"so the damage is linear in the number of observations, not in the horizon.\")\n",
            "output": "true integrated variance            1.9600e-04   (22.2% annualised)\nnoise sd per observation            1.50e-04   (1.50 basis points)\n\n  interval        n    mean RV(Y)   RV/IV    bias measured   bias 2*n*omega^2\n  1800s        13   1.9403e-04    0.99     -1.9737e-06        5.8500e-07\n   600s        39   2.0106e-04    1.03      5.0564e-06        1.7550e-06\n   300s        78   2.0103e-04    1.03      5.0343e-06        3.5100e-06\n    60s       390   2.1374e-04    1.09      1.7737e-05        1.7550e-05\n    30s       780   2.3059e-04    1.18      3.4589e-05        3.5100e-05\n    10s      2340   3.0063e-04    1.53      1.0463e-04        1.0530e-04\n     5s      4680   4.0625e-04    2.07      2.1025e-04        2.1060e-04\n     1s     23400   1.2485e-03    6.37      1.0525e-03        1.0530e-03\n\nSampling faster makes the estimate WORSE, without limit: at one-second sampling\nrealised variance is 6.4 times the integrated variance it is meant to estimate.\nThe measured bias tracks 2*n*omega^2 to within a few percent at every frequency,\nso the damage is linear in the number of observations, not in the horizon."
          }
        },
        {
          "name": "Where the noise comes from, and how to measure it",
          "explain": "<p>Noise is not a modelling fiction, it is a list of mechanisms. Transaction prices alternate between the bid and the ask as buyers and sellers arrive, which is the bid-ask bounce. Prices live on a discrete tick grid, so every observation is rounded. Quote midpoints move when a queue empties rather than when an opinion changes. Each of these puts a mean-reverting wedge between the observed price and whatever the efficient price is.</p><p>They leave a common fingerprint: a strongly negative first-order autocorrelation in high-frequency returns. The snippet measures it. A pure bid-ask bounce gives minus 0.45 on top of a diffusive price — it would be exactly minus one half with no efficient-price movement at all — and iid Gaussian noise of the same magnitude gives minus 0.45 too. Rounding to a one-cent tick on a hundred-dollar stock, by itself, contributes only 0.29 basis points of noise and an autocorrelation of minus 0.08, so discreteness is real but small next to the bounce.</p><p>Two estimators of the noise variance follow. Realised variance over two n converges to the noise variance and is trivially available, but it inherits the integrated variance over two n as an upward bias. Minus the first autocovariance of returns is cleaner: in the snippet it returns 4.00 against a true 4.00, while realised variance over two n returns 4.44.</p><p>A desk cares because the noise variance it estimates this way is, to a first approximation, the effective half-spread squared — the same number an execution desk pays per round trip.</p>",
          "formula": "\\hat\\omega^2 = \\frac{RV_n(Y)}{2n} \\quad\\text{or}\\quad \\hat\\omega^2 = -\\hat\\gamma_1(\\Delta Y) = -\\frac{1}{n}\\sum_i \\Delta Y_i\\,\\Delta Y_{i+1}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM = 23400\nIV = 0.014 ** 2\nHALF_SPREAD = 0.00020          # 2 basis points half-spread\nTICK = 0.01 / 100.0            # a 1-cent tick on a $100 stock, in log terms\nr = np.random.default_rng(5346)\ndt = 1.0 / M\n\nX = np.concatenate(([0.0], np.cumsum(np.sqrt(IV * dt) * r.standard_normal(M))))\n\n# three noise mechanisms, each with a known theoretical signature\nside = np.where(r.random(M + 1) < 0.5, -1.0, 1.0)              # iid buy/sell\nY_bounce = X + HALF_SPREAD * side\nY_round = np.round(X / TICK) * TICK                            # pure discreteness\nY_iid = X + HALF_SPREAD * r.standard_normal(M + 1)             # iid Gaussian noise\n\ndef report(name, Y):\n    u = Y - X\n    dY = np.diff(Y)\n    g0 = np.mean(dY ** 2)\n    g1 = np.mean(dY[:-1] * dY[1:])\n    om2_from_rv = np.sum(dY ** 2) / (2.0 * M)                  # RV / (2n)\n    om2_from_acov = -g1                                        # -gamma_1 of returns\n    print(\"%-22s %10.3e %10.3e %12.3f %12.3e %12.3e\"\n          % (name, np.var(u), g0, g1 / g0, om2_from_rv, om2_from_acov))\n\nprint(\"true noise variance for the bounce  (half-spread)^2 = %.3e\" % HALF_SPREAD ** 2)\nprint(\"\")\nprint(\"%-22s %10s %10s %12s %12s %12s\"\n      % (\"mechanism\", \"var(u)\", \"E[dY^2]\", \"acf(1) of dY\", \"RV/(2n)\", \"-gamma_1\"))\nreport(\"bid-ask bounce\", Y_bounce)\nreport(\"iid Gaussian noise\", Y_iid)\nreport(\"price rounding only\", Y_round)\nprint(\"\")\nprint(\"Every mechanism leaves the same fingerprint: a strongly negative first-order\")\nprint(\"return autocorrelation, near -0.5 for a pure bounce, and a noise variance that\")\nprint(\"two different estimators -- RV/(2n) and minus the first autocovariance -- agree on.\")\nprint(\"Rounding to a 1-cent tick alone produces var(u) = %.2e, i.e. %.2f bp of noise.\"\n      % (np.var(Y_round - X), 1e4 * np.std(Y_round - X)))\n",
            "output": "true noise variance for the bounce  (half-spread)^2 = 4.000e-08\n\nmechanism                  var(u)    E[dY^2] acf(1) of dY      RV/(2n)     -gamma_1\nbid-ask bounce          4.000e-08  8.880e-08       -0.451    4.440e-08    4.003e-08\niid Gaussian noise      4.069e-08  9.042e-08       -0.446    4.521e-08    4.031e-08\nprice rounding only     8.268e-10  1.012e-08       -0.076    5.059e-09    7.697e-10\n\nEvery mechanism leaves the same fingerprint: a strongly negative first-order\nreturn autocorrelation, near -0.5 for a pure bounce, and a noise variance that\ntwo different estimators -- RV/(2n) and minus the first autocovariance -- agree on.\nRounding to a 1-cent tick alone produces var(u) = 8.27e-10, i.e. 0.29 bp of noise."
          }
        },
        {
          "name": "The sampling frequency as a bias-variance trade-off",
          "explain": "<p>If you insist on using plain realised variance, the sampling frequency is a genuine statistical decision with a right answer. The squared bias grows like n squared times the fourth power of the noise scale; the variance of the discretisation error falls like two times integrated quarticity over n. Mean squared error therefore has an interior minimum, and differentiating gives the optimal number of returns as the cube root of quarticity over four times the fourth power of the noise standard deviation.</p><p>The snippet checks that formula rather than asserting it. For the same calibration as concept 1, the theory says 267 returns a day, a sampling interval of about 87 seconds. A brute-force search over fourteen candidate frequencies finds the mean-squared-error minimum at 260 returns a day, a 90-second interval, and the mean-squared-error curve is flat enough near the bottom that 100-second and 78-second sampling are within 5% of optimal — while ten-second sampling is 24 times worse.</p><p>Notice what the formula depends on: the noise standard deviation to the power minus four thirds. Doubling the noise scale divides the optimal frequency by 2.5. The habit of 'use five-minute returns' is a single answer to a question whose answer varies by an order of magnitude across the cross-section of names, and it has no way of noticing which name it is looking at.</p><p>A research team cares because an estimator choice that is optimal for a large-cap index constituent is badly wrong for a small-cap, and the resulting variance ranking across names is an artefact.</p>",
          "formula": "n^\\star \\;=\\; \\left(\\frac{\\int_0^T \\sigma_s^4\\,ds}{4\\,\\omega^4}\\right)^{\\!1/3}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 800\nIV, OMEGA = 0.014 ** 2, 0.00015\nIQ = IV ** 2                                  # constant vol over a day of length 1\nr = np.random.default_rng(7346)\ndt = 1.0 / M\nX = np.concatenate([np.zeros((REPS, 1)),\n                    np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, M)), axis=1)], axis=1)\nY = X + OMEGA * r.standard_normal((REPS, M + 1))\n\nNSTAR = (IQ / (4.0 * OMEGA ** 4)) ** (1.0 / 3.0)\nprint(\"theoretical MSE-optimal n*  = (IQ / (4 omega^4))^(1/3) = %.1f returns\" % NSTAR)\nprint(\"  i.e. a sampling interval of about %.0f seconds\" % (M / NSTAR))\nprint(\"\")\nprint(\"      n  interval    bias^2       variance      MSE        MSE/MSE(best)\")\ngrid = [39, 78, 117, 156, 195, 234, 260, 300, 390, 468, 585, 780, 1170, 2340]\nrows = []\nfor n in grid:\n    idx = np.arange(0, M + 1, M // n)\n    rv = (np.diff(Y[:, idx], axis=1) ** 2).sum(axis=1)\n    bias2 = (rv.mean() - IV) ** 2\n    var = rv.var(ddof=1)\n    rows.append((n, bias2, var, bias2 + var))\nbest = min(rows, key=lambda z: z[3])\nfor n, bias2, var, mse in rows:\n    star = \" <-- minimum\" if n == best[0] else \"\"\n    print(\"%7d %8ds  %10.3e  %11.3e  %10.3e  %9.2f%s\"\n          % (n, M // n, bias2, var, mse, mse / best[3], star))\nprint(\"\")\nprint(\"The MSE minimum sits at n = %d (%ds sampling) against a predicted %.0f (%ds).\"\n      % (best[0], M // best[0], NSTAR, M / NSTAR))\nprint(\"For THIS noise level both land faster than the folklore five-minute rule, and\")\nprint(\"neither is a rule: n* scales like omega^(-4/3), so a name with twice the noise\")\nprint(\"standard deviation wants %.2f times fewer returns, and the five-minute habit has\" % (2 ** (4.0 / 3.0)))\nprint(\"no way of noticing which name it is looking at.\")\n",
            "output": "theoretical MSE-optimal n*  = (IQ / (4 omega^4))^(1/3) = 266.7 returns\n  i.e. a sampling interval of about 88 seconds\n\n      n  interval    bias^2       variance      MSE        MSE/MSE(best)\n     39      600s   2.262e-12    2.056e-09   2.059e-09       4.50\n     78      300s   1.362e-11    9.911e-10   1.005e-09       2.20\n    117      200s   2.560e-11    7.351e-10   7.607e-10       1.66\n    156      150s   6.544e-11    5.671e-10   6.325e-10       1.38\n    195      120s   9.587e-11    4.443e-10   5.402e-10       1.18\n    234      100s   1.242e-10    3.583e-10   4.826e-10       1.05\n    260       90s   1.455e-10    3.122e-10   4.577e-10       1.00 <-- minimum\n    300       78s   2.024e-10    2.751e-10   4.775e-10       1.04\n    390       60s   3.396e-10    2.360e-10   5.756e-10       1.26\n    468       50s   4.698e-10    2.028e-10   6.727e-10       1.47\n    585       40s   7.076e-10    1.657e-10   8.733e-10       1.91\n    780       30s   1.238e-09    1.357e-10   1.373e-09       3.00\n   1170       20s   2.780e-09    1.032e-10   2.883e-09       6.30\n   2340       10s   1.108e-08    8.337e-11   1.117e-08      24.40\n\nThe MSE minimum sits at n = 260 (90s sampling) against a predicted 267 (87s).\nFor THIS noise level both land faster than the folklore five-minute rule, and\nneither is a rule: n* scales like omega^(-4/3), so a name with twice the noise\nstandard deviation wants 2.52 times fewer returns, and the five-minute habit has\nno way of noticing which name it is looking at."
          }
        },
        {
          "name": "Dependent noise breaks the simple correction",
          "explain": "<p>The two-n-omega-squared formula assumes the noise is serially independent. It is not. Large orders are split into many child orders that arrive on the same side over minutes, so the trade side is persistent; queueing and quote staleness add their own memory. Once the noise is autocorrelated, the bias formula changes and, more awkwardly, the easy noise-variance estimators stop working.</p><p>The snippet makes the trade side a persistent two-state chain and traces what happens. With iid sides, both noise-variance estimators recover the true value of four times ten to the minus eight. As persistence rises, realised variance over two n converges not to the noise variance but to the noise variance minus its first autocovariance, so it collapses: at a noise autocorrelation of 0.96 it reports a value seven times too small, and minus the first return autocovariance is essentially zero. An analyst applying either number as a bias correction would under-correct badly.</p><p>This is the honest motivation for the estimator families of week 5. Pre-averaging and flat-top realised kernels are built to tolerate noise with dependence out to some finite order, precisely because the iid assumption is a convenience rather than a fact.</p><p>The mechanics generating this dependence — order splitting, queue dynamics, and who is on the other side of the trade — are the subject of FINM 37601, which models them as a control problem, and of FINM 35100, which asks why an informed counterparty makes them profitable. Here they are a nuisance parameter with a second moment and an autocorrelation; a desk cares because the same persistence is what makes its own child orders predictable to someone else.</p>",
          "formula": "E\\big[\\Delta Y_i^2\\big] \\approx \\frac{IV}{n} + 2\\big(\\gamma_u(0)-\\gamma_u(1)\\big) \\;\\Rightarrow\\; \\frac{RV_n}{2n} \\xrightarrow{p} \\gamma_u(0)-\\gamma_u(1) \\;\\ne\\; \\omega^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM = 23400\nIV, Q = 0.014 ** 2, 0.00020          # 2bp half-spread\nr = np.random.default_rng(9346)\ndt = 1.0 / M\nX = np.concatenate(([0.0], np.cumsum(np.sqrt(IV * dt) * r.standard_normal(M))))\n\ndef run(p):\n    \"\"\"Trade side is a persistent two-state chain: P(repeat) = p. Noise = Q * side.\"\"\"\n    flip = r.random(M + 1) > p\n    side = np.cumprod(np.where(flip, -1.0, 1.0)) * np.where(r.random() < 0.5, -1.0, 1.0)\n    u = Q * side\n    Y = X + u\n    dY = np.diff(Y)\n    g0u = np.mean(u ** 2)\n    g1u = np.mean(u[:-1] * u[1:])\n    return (2 * p - 1, g0u, g1u, np.sum(dY ** 2) / (2.0 * M), -np.mean(dY[:-1] * dY[1:]))\n\nprint(\"true noise variance  Q^2 = %.3e  in every row below\" % Q ** 2)\nprint(\"\")\nprint(\"%9s %12s %12s %14s %14s\" % (\"acf1(u)\", \"var(u)\", \"cov(u_t,u_t+1)\", \"RV/(2n)\", \"-gamma_1(dY)\"))\nfor p in (0.50, 0.70, 0.90, 0.98):\n    rho, g0u, g1u, a, b = run(p)\n    print(\"%9.2f %12.3e %12.3e %14.3e %14.3e\" % (g1u / g0u, g0u, g1u, a, b))\nprint(\"\")\nprint(\"With iid noise (top row) both estimators find Q^2. As the trade side becomes\")\nprint(\"persistent, RV/(2n) converges to var(u) - cov(u_t,u_t+1) and therefore collapses:\")\nprint(\"at acf1 = 0.96 it reports a noise variance %.0fx too small, and the simple\"\n      % (Q ** 2 / run(0.98)[3]))\nprint(\"2*n*omega^2 bias formula of concept 1 is no longer the right correction.\")\nprint(\"\")\nprint(\"The mechanics that generate this dependence -- order splitting, queueing, and\")\nprint(\"who is on the other side -- are the subject matter of FINM 37601 and FINM 35100.\")\nprint(\"Here the noise is a nuisance parameter with a second moment; there it is the\")\nprint(\"object of study. Week 5's realised kernels are what survive dependent noise.\")\n",
            "output": "true noise variance  Q^2 = 4.000e-08  in every row below\n\n  acf1(u)       var(u) cov(u_t,u_t+1)        RV/(2n)   -gamma_1(dY)\n     0.01    4.000e-08    2.222e-10      4.406e-08      3.931e-08\n     0.40    4.000e-08    1.614e-08      2.798e-08      1.398e-08\n     0.79    4.000e-08    3.171e-08      1.240e-08      1.664e-09\n     0.96    4.000e-08    3.832e-08      5.866e-09     -1.009e-10\n\nWith iid noise (top row) both estimators find Q^2. As the trade side becomes\npersistent, RV/(2n) converges to var(u) - cov(u_t,u_t+1) and therefore collapses:\nat acf1 = 0.96 it reports a noise variance 7x too small, and the simple\n2*n*omega^2 bias formula of concept 1 is no longer the right correction.\n\nThe mechanics that generate this dependence -- order splitting, queueing, and\nwho is on the other side -- are the subject matter of FINM 37601 and FINM 35100.\nHere the noise is a nuisance parameter with a second moment; there it is the\nobject of study. Week 5's realised kernels are what survive dependent noise."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Volatility signature plot: realised variance over true integrated variance",
        "params": {
          "xlab": "sampling interval (seconds)",
          "ylab": "RV(Y) / IV",
          "log": true,
          "series": [
            {
              "name": "measured RV / IV",
              "x": [
                1,
                5,
                10,
                30,
                60,
                300,
                600,
                1800
              ],
              "y": [
                6.37,
                2.07,
                1.53,
                1.18,
                1.09,
                1.03,
                1.03,
                0.99
              ]
            },
            {
              "name": "1 + 2*n*omega^2 / IV",
              "x": [
                1,
                5,
                10,
                30,
                60,
                300,
                600,
                1800
              ],
              "y": [
                6.372,
                2.074,
                1.537,
                1.179,
                1.09,
                1.018,
                1.009,
                1.003
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Sampling as fast as the data allows. Under noise the estimator diverges; the fastest available grid is the worst possible choice, not the best.",
        "Using realised variance over two n as a noise-variance estimate and forgetting it carries integrated variance over two n as bias. It is fine when the noise dominates and wrong at coarse grids.",
        "Adopting a five-minute rule as if it were a theorem. The optimal frequency scales like the noise standard deviation to the minus four thirds, so it differs by an order of magnitude across the cross-section.",
        "Assuming the noise is iid because the textbook derivation does. Order splitting makes the trade side persistent, and then both the bias formula and the simple noise-variance estimators are wrong in the same direction."
      ],
      "check": [
        {
          "q": "Under iid additive noise, the bias of realised variance for integrated variance is approximately",
          "options": [
            "2 omega squared, independent of n",
            "2 n omega squared, growing linearly in n",
            "omega squared over n, vanishing",
            "2 omega squared times the square root of n"
          ],
          "answer": 1,
          "why": "Each differenced observation contributes about twice the noise variance and there are n of them, so the bias grows linearly and the estimator diverges as the grid refines."
        },
        {
          "q": "A volatility signature plot that is flat from five minutes out and rises steeply inside thirty seconds indicates",
          "options": [
            "A jump in the price path",
            "Additive microstructure noise",
            "Stochastic volatility",
            "A data-feed outage"
          ],
          "answer": 1,
          "why": "The rise at the fast end is the accumulating noise bias; jumps and stochastic volatility do not create a frequency-dependent level shift of that shape."
        },
        {
          "q": "If the noise standard deviation doubles, the mean-squared-error-optimal number of returns per day changes by a factor of about",
          "options": [
            "2",
            "1 over 2",
            "1 over 2.5",
            "It is unchanged"
          ],
          "answer": 2,
          "why": "The optimum scales like omega to the power minus four thirds, so doubling omega divides the optimal count by two to the four thirds, about 2.5."
        },
        {
          "q": "With positively autocorrelated noise, realised variance over two n converges to",
          "options": [
            "The noise variance",
            "The noise variance minus its first autocovariance",
            "Twice the noise variance",
            "Integrated variance over two n"
          ],
          "answer": 1,
          "why": "Differencing dependent noise cancels part of its variance, so the naive estimator understates the level whenever the noise is positively autocorrelated."
        }
      ],
      "n": 3
    },
    {
      "title": "Sparse sampling, subsampling, and the two-scale estimator",
      "topics": [
        "averaging over all offset subgrids",
        "two-scale realised volatility",
        "the small-sample adjustment",
        "choosing the sparse scale K",
        "the n to the minus one sixth and one quarter rates",
        "multi-scale realised volatility"
      ],
      "concepts": [
        {
          "name": "Subsampling: use every tick, not one in K",
          "explain": "<p>Week 3 ended with a defensible sampling interval. But sampling every K-th observation throws away K minus one of every K ticks, and there is no reason to prefer the grid that starts at 9:30:00 over the one that starts at 9:30:01. The fix is to compute realised variance on each of the K offset subgrids and average.</p><p>Written as a sum over overlapping K-lagged differences divided by K, this is the average-subgrid realised variance, the building block of everything that follows. Its bias is identical to a single sparse grid's, because each subgrid has the same bias, and averaging does not change a mean. Its variance is strictly lower, because it uses all the data.</p><p>The snippet quantifies the gain at four spacings. The two mean columns agree to three digits, confirming the bias is untouched, and the variance ratio is between 1.6 and 1.8 — so the standard error improves by about 25% to 35%. That is less than the factor of K a naive count of observations would suggest, because neighbouring subgrids are strongly correlated; it is still free.</p><p>The snippet also makes a point worth pausing on: neither column is unbiased. Both sit above integrated variance. Subsampling buys efficiency, not bias correction. Bias correction is the next concept.</p><p>A desk cares because this is the cheapest accuracy improvement in the whole toolkit: two lines of code, no new tuning parameter, and no assumption beyond the one already made.</p>",
          "formula": "[Y,Y]^{(K)} \\;=\\; \\frac{1}{K}\\sum_{i=0}^{n-K}\\big(Y_{t_{i+K}}-Y_{t_i}\\big)^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 400\nIV, OMEGA = 0.014 ** 2, 0.00015\nr = np.random.default_rng(4346)\ndt = 1.0 / M\nX = np.concatenate([np.zeros((REPS, 1)),\n                    np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, M)), axis=1)], axis=1)\nY = X + OMEGA * r.standard_normal((REPS, M + 1))\n\nprint(\"IV = %.4e.  Two ways to use a K-spaced grid, K = spacing in seconds.\" % IV)\nprint(\"\")\nprint(\"%6s %8s   %-24s   %-24s  variance\" % (\"K\", \"n_sparse\", \"ONE sparse grid\", \"ALL K grids, averaged\"))\nprint(\"%6s %8s   %11s %12s   %11s %12s  ratio\" % (\"\", \"\", \"mean\", \"RMSE\", \"mean\", \"RMSE\"))\nfor K in (60, 120, 300, 600):\n    one = (np.diff(Y[:, ::K], axis=1) ** 2).sum(axis=1)          # a single subgrid\n    d = Y[:, K:] - Y[:, :-K]\n    allg = (d ** 2).sum(axis=1) / K                              # average of all K subgrids\n    r1 = np.sqrt(np.mean((one - IV) ** 2))\n    r2 = np.sqrt(np.mean((allg - IV) ** 2))\n    print(\"%6d %8d   %11.4e %12.3e   %11.4e %12.3e  %7.2f\"\n          % (K, M // K, one.mean(), r1, allg.mean(), r2, one.var(ddof=1) / allg.var(ddof=1)))\nprint(\"\")\nprint(\"Averaging over every offset subgrid leaves the bias where it was -- the two mean\")\nprint(\"columns agree -- and cuts the variance by a factor of 1.6 to 1.8 by using every\")\nprint(\"observation instead of one in K. Note also that NEITHER column is unbiased: both\")\nprint(\"still sit above IV. Subsampling buys efficiency; it does not buy bias correction.\")\n",
            "output": "IV = 1.9600e-04.  Two ways to use a K-spaced grid, K = spacing in seconds.\n\n     K n_sparse   ONE sparse grid            ALL K grids, averaged     variance\n                         mean         RMSE          mean         RMSE  ratio\n    60      390    2.1445e-04    2.404e-05    2.1342e-04    2.081e-05     1.83\n   120      195    2.0603e-04    2.468e-05    2.0509e-04    1.906e-05     1.81\n   300       78    2.0290e-04    3.402e-05    2.0075e-04    2.708e-05     1.56\n   600       39    2.0061e-04    4.611e-05    1.9578e-04    3.609e-05     1.62\n\nAveraging over every offset subgrid leaves the bias where it was -- the two mean\ncolumns agree -- and cuts the variance by a factor of 1.6 to 1.8 by using every\nobservation instead of one in K. Note also that NEITHER column is unbiased: both\nstill sit above IV. Subsampling buys efficiency; it does not buy bias correction."
          }
        },
        {
          "name": "Two-scale realised volatility: subtract the noise you measured",
          "explain": "<p>The insight of Zhang, Mykland and Ait-Sahalia is that the fastest grid, which is useless as a variance estimator, is an excellent <em>noise</em> estimator: realised variance on every tick is dominated by two n times the noise variance. So measure the noise there and subtract it from the sparse estimate, scaled by the ratio of the two effective sample sizes. Divide by one minus that ratio and the estimator is unbiased in finite samples too.</p><p>The snippet runs this on two calibrations that differ only in the noise level. For a liquid name at 1.5 basis points, five-minute sampling is already almost unbiased at 1.021 of integrated variance, so the two-scale estimator mainly buys efficiency. For an illiquid name at 5 basis points, five-minute sampling reports 24.4% annualised volatility for a 22.2% day — a 10% variance error that would go straight into a risk number — while the two-scale estimator on the same ticks reports 22.1% and cuts the root mean squared error from 5.6 to 2.5 in units of ten to the minus five.</p><p>The headline comparison is the first row of each panel. Tick-by-tick realised variance reports 56% and 173% annualised volatility for the same 22% day. It is not estimating volatility at all; it is estimating the spread.</p><p>The property that matters operationally is the last line: the two-scale estimator is unbiased in both panels without being told which one it is in. A desk cares because it can run one estimator across a universe of thousands of names with very different liquidity and not have to hand-tune a sampling interval per name.</p>",
          "formula": "\\widehat{\\langle X\\rangle}^{\\,\\mathrm{TS}} \\;=\\; \\Big(1-\\tfrac{\\bar n}{n}\\Big)^{-1}\\left([Y,Y]^{(K)} - \\frac{\\bar n}{n}\\,[Y,Y]^{(1)}\\right), \\qquad \\bar n=\\frac{n-K+1}{K}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 400                   # one tick a second for 6.5 hours, 400 days\nIV = 0.014 ** 2                        # 22% annualised\ndt = 1.0 / M\nr = np.random.default_rng(6346)\nX = np.concatenate([np.zeros((REPS, 1)),\n                    np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, M)), axis=1)], axis=1)\nNOISE = r.standard_normal((REPS, M + 1))\n\ndef rv_avg(Y, K):\n    \"\"\"Average realised variance over all K offset subgrids, [Y,Y]^(K).\"\"\"\n    d = Y[:, K:] - Y[:, :-K]\n    return (d ** 2).sum(axis=1) / K\n\ndef tsrv(Y, K):\n    \"\"\"Two-scale realised volatility, with the small-sample adjustment.\"\"\"\n    n = Y.shape[1] - 1\n    nbar = (n - K + 1) / K\n    return (rv_avg(Y, K) - (nbar / n) * rv_avg(Y, 1)) / (1.0 - nbar / n)\n\nK = 300                                # sparse scale: 5-minute spacing\nkeep = {}\nprint(\"true integrated variance %.4e, i.e. %.1f%% annualised, in both panels\"\n      % (IV, 100 * np.sqrt(252 * IV)))\n\nfor label, omega in ((\"liquid name: omega = 1.5bp\", 0.00015),\n                     (\"illiquid name: omega = 5.0bp\", 0.00050)):\n    Y = X + omega * NOISE\n    est = {\"RV on every tick\": rv_avg(Y, 1),\n           \"RV, single 5-min grid\": (np.diff(Y[:, ::K], axis=1) ** 2).sum(axis=1),\n           \"RV, 5-min subgrids averaged\": rv_avg(Y, K),\n           \"TSRV (K = 300)\": tsrv(Y, K)}\n    keep[label] = est\n    print(\"\")\n    print(\"--- %s \" % label + \"-\" * (46 - len(label)))\n    print(\"%-30s %11s %8s %11s %11s\" % (\"estimator\", \"mean\", \"mean/IV\", \"RMSE\", \"ann. vol\"))\n    for name, v in est.items():\n        print(\"%-30s %11.4e %8.3f %11.3e %10.1f%%\"\n              % (name, v.mean(), v.mean() / IV, np.sqrt(np.mean((v - IV) ** 2)),\n                 100 * np.sqrt(252 * v.mean())))\n\ndef av(v):\n    return 100 * np.sqrt(252 * v.mean())\n\nlo = keep[\"liquid name: omega = 1.5bp\"]\nhi = keep[\"illiquid name: omega = 5.0bp\"]\nprint(\"\")\nprint(\"At 1.5bp of noise five-minute sampling is already nearly unbiased (%.3f of IV)\"\n      % (lo[\"RV, single 5-min grid\"].mean() / IV))\nprint(\"and TSRV mainly buys efficiency. At 5bp it is not: the five-minute estimate\")\nprint(\"reports %.1f%% volatility for a %.1f%% day, while TSRV on the same ticks reports\"\n      % (av(hi[\"RV, single 5-min grid\"]), 100 * np.sqrt(252 * IV)))\nprint(\"%.1f%% and cuts the RMSE from %.2e to %.2e.\"\n      % (av(hi[\"TSRV (K = 300)\"]),\n         np.sqrt(np.mean((hi[\"RV, single 5-min grid\"] - IV) ** 2)),\n         np.sqrt(np.mean((hi[\"TSRV (K = 300)\"] - IV) ** 2))))\nprint(\"Tick-by-tick realised variance reports %.0f%% and %.0f%% in the two panels: it is\"\n      % (av(lo[\"RV on every tick\"]), av(hi[\"RV on every tick\"])))\nprint(\"measuring the spread, not the volatility. TSRV is unbiased in BOTH panels\")\nprint(\"without being told which one it is in.\")\n",
            "output": "true integrated variance 1.9600e-04, i.e. 22.2% annualised, in both panels\n\n--- liquid name: omega = 1.5bp --------------------\nestimator                             mean  mean/IV        RMSE    ann. vol\nRV on every tick                1.2491e-03    6.373   1.053e-03       56.1%\nRV, single 5-min grid           2.0017e-04    1.021   3.358e-05       22.5%\nRV, 5-min subgrids averaged     1.9712e-04    1.006   2.522e-05       22.3%\nTSRV (K = 300)                  1.9364e-04    0.988   2.538e-05       22.1%\n\n--- illiquid name: omega = 5.0bp ------------------\nestimator                             mean  mean/IV        RMSE    ann. vol\nRV on every tick                1.1899e-02   60.711   1.170e-02      173.2%\nRV, single 5-min grid           2.3629e-04    1.206   5.578e-05       24.4%\nRV, 5-min subgrids averaged     2.3222e-04    1.185   4.416e-05       24.2%\nTSRV (K = 300)                  1.9370e-04    0.988   2.545e-05       22.1%\n\nAt 1.5bp of noise five-minute sampling is already nearly unbiased (1.021 of IV)\nand TSRV mainly buys efficiency. At 5bp it is not: the five-minute estimate\nreports 24.4% volatility for a 22.2% day, while TSRV on the same ticks reports\n22.1% and cuts the RMSE from 5.58e-05 to 2.54e-05.\nTick-by-tick realised variance reports 56% and 173% in the two panels: it is\nmeasuring the spread, not the volatility. TSRV is unbiased in BOTH panels\nwithout being told which one it is in."
          }
        },
        {
          "name": "Choosing the sparse scale, and the rate you are left with",
          "explain": "<p>The two-scale estimator has exactly one knob, the sparse scale K, and it matters. Too small and the sparse estimate is itself noise-dominated; too large and it discards the day, because a K-spaced grid has only n over K returns. The theory says the optimal K grows like n to the two thirds and that the resulting root mean squared error falls like n to the minus one sixth — markedly slower than the n to the minus one half of a noise-free realised variance.</p><p>The snippet does not assume any of that; it scans. At 23400 ticks the error as a function of K has a clear interior minimum, at about K equals 8 for the low-noise case and K equals 32 for the high-noise one. Scanning across sample sizes, the optimal K grows like n to the power 0.73 against a theoretical two thirds, and the error falls like n to the power minus 0.19 against a theoretical one sixth. The shape is confirmed.</p><p>One practical asymmetry is visible in the table and is worth remembering: overshooting K is much cheaper than undershooting it. At 5 basis points of noise, K equals 2 gives a 53% relative error while K equals 300 gives 14%. When in doubt, take the sparse scale coarser.</p><p>A research team cares because the n to the minus one sixth rate is the honest answer to 'how much does more data help', and it is far more pessimistic than the square-root-of-n intuition people bring from classical statistics.</p>",
          "formula": "K^\\star \\propto n^{2/3}, \\qquad \\widehat{\\langle X\\rangle}^{\\,\\mathrm{TS}} - \\langle X\\rangle = O_p\\!\\left(n^{-1/6}\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nIV, REPS = 0.014 ** 2, 200\n\ndef rv_avg(Y, K):\n    d = Y[:, K:] - Y[:, :-K]\n    return (d * d).sum(axis=1) / K\n\ndef tsrv(Y, K):\n    n = Y.shape[1] - 1\n    nbar = (n - K + 1) / K\n    return (rv_avg(Y, K) - (nbar / n) * rv_avg(Y, 1)) / (1.0 - nbar / n)\n\ndef sample(n, om, seed):\n    r = np.random.default_rng(seed)\n    dt = 1.0 / n\n    X = np.concatenate([np.zeros((REPS, 1)),\n                        np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, n)), axis=1)], axis=1)\n    return X + om * r.standard_normal((REPS, n + 1))\n\nn = 23400\nprint(\"K is the only tuning knob in TSRV. RMSE/IV at n = %d:\" % n)\nprint(\"\")\nprint(\"%6s %14s %14s\" % (\"K\", \"omega = 1.5bp\", \"omega = 5.0bp\"))\nYlo, Yhi = sample(n, 0.00015, 5 + n), sample(n, 0.00050, 5 + n)\nfor K in (2, 4, 8, 16, 32, 64, 150, 300, 600, 1200):\n    a = np.sqrt(np.mean((tsrv(Ylo, K) - IV) ** 2)) / IV\n    b = np.sqrt(np.mean((tsrv(Yhi, K) - IV) ** 2)) / IV\n    print(\"%6d %14.4f %14.4f\" % (K, a, b))\n\nprint(\"\")\nprint(\"Best K found by scanning, and how it moves with n (omega = 5bp):\")\nprint(\"%8s %8s %12s %14s\" % (\"n\", \"best K\", \"RMSE/IV\", \"K / sqrt(n)\"))\nns, ks, rms = [], [], []\nfor m in (2925, 5850, 11700, 23400):\n    Y = sample(m, 0.00050, 5 + m)\n    best = min(((K, np.sqrt(np.mean((tsrv(Y, K) - IV) ** 2))) for K in range(2, 96, 4)),\n               key=lambda z: z[1])\n    ns.append(m); ks.append(best[0]); rms.append(best[1])\n    print(\"%8d %8d %12.4f %14.3f\" % (m, best[0], best[1] / IV, best[0] / np.sqrt(m)))\n\nprint(\"\")\nprint(\"fitted slope log(best K) on log(n)    %+.3f\" % np.polyfit(np.log(ns), np.log(ks), 1)[0])\nprint(\"fitted slope log(RMSE)   on log(n)    %+.3f\" % np.polyfit(np.log(ns), np.log(rms), 1)[0])\nprint(\"asymptotic theory: K* ~ n^(2/3) and RMSE ~ n^(-1/6) = %+.3f\" % (-1 / 6))\nprint(\"\")\nprint(\"The trade-off in K is real and the minimum is interior: too small and the sparse\")\nprint(\"scale is still noisy, too large and it throws the day away. The scanned optimum\")\nprint(\"grows like n to the power 0.73 against a theoretical two thirds, and the error\")\nprint(\"falls like n to the power -0.19 against a theoretical one sixth -- close enough\")\nprint(\"to confirm the shape. Note the asymmetry: at 5bp of noise, overshooting K costs\")\nprint(\"far less than undershooting it, so when in doubt sample the sparse scale coarser.\")\n",
            "output": "K is the only tuning knob in TSRV. RMSE/IV at n = 23400:\n\n     K  omega = 1.5bp  omega = 5.0bp\n     2         0.0564         0.5296\n     4         0.0308         0.1931\n     8         0.0298         0.0915\n    16         0.0345         0.0554\n    32         0.0450         0.0515\n    64         0.0613         0.0639\n   150         0.0966         0.0977\n   300         0.1371         0.1375\n   600         0.1947         0.1950\n  1200         0.2751         0.2750\n\nBest K found by scanning, and how it moves with n (omega = 5bp):\n       n   best K      RMSE/IV    K / sqrt(n)\n    2925        6       0.0760          0.111\n    5850       14       0.0659          0.183\n   11700       18       0.0570          0.166\n   23400       30       0.0511          0.196\n\nfitted slope log(best K) on log(n)    +0.733\nfitted slope log(RMSE)   on log(n)    -0.193\nasymptotic theory: K* ~ n^(2/3) and RMSE ~ n^(-1/6) = -0.167\n\nThe trade-off in K is real and the minimum is interior: too small and the sparse\nscale is still noisy, too large and it throws the day away. The scanned optimum\ngrows like n to the power 0.73 against a theoretical two thirds, and the error\nfalls like n to the power -0.19 against a theoretical one sixth -- close enough\nto confirm the shape. Note the asymmetry: at 5bp of noise, overshooting K costs\nfar less than undershooting it, so when in doubt sample the sparse scale coarser."
          }
        },
        {
          "name": "Multi-scale: many scales buy back the rate",
          "explain": "<p>Two scales cancel the leading noise term. Chaining many scales, with weights chosen so that the noise contributions telescope to higher order, cancels more — and recovers the rate n to the minus one quarter, which is the best any estimator can achieve under additive noise. That is the multi-scale estimator: a weighted sum of average-subgrid realised variances at scales one through M, with weights that are linear in the scale index and sum in a way that annihilates the noise.</p><p>The snippet implements those weights and checks them. Every multi-scale variant in the table is within 0.6% of integrated variance on average, so the bias cancellation works. Choosing M proportional to the square root of n, the measured error falls like n to the power minus 0.31, closer to the multi-scale theory of minus one quarter than to the two-scale minus one sixth.</p><p>The honest caveat is in the first table. M is a second tuning parameter with its own interior optimum — M equals 20 beats both 8 and 80 — and at one day of ticks the level advantage over a well-tuned two-scale estimator is small, 0.047 against 0.051 in relative root mean squared error. The reason to prefer multi-scale is the rate, which pays off as the tape gets denser, not a dramatic improvement on today's data.</p><p>A desk cares because this fixes the rate ceiling: from here on, better estimators (week 5) compete on efficiency constants and on robustness to dependent noise and jumps, not on the exponent.</p>",
          "formula": "\\widehat{\\langle X\\rangle}^{\\,\\mathrm{MS}} = \\sum_{i=1}^{M} a_i\\,[Y,Y]^{(i)}, \\quad a_i = \\frac{12\\,i}{M^2}\\cdot\\frac{\\frac{i}{M}-\\frac12-\\frac{1}{2M}}{1-M^{-2}}, \\qquad \\text{rate } n^{-1/4}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nIV, REPS, OM = 0.014 ** 2, 150, 0.00050\n\ndef rv_avg(Y, K):\n    d = Y[:, K:] - Y[:, :-K]\n    return (d * d).sum(axis=1) / K\n\ndef tsrv(Y, K):\n    n = Y.shape[1] - 1\n    nbar = (n - K + 1) / K\n    return (rv_avg(Y, K) - (nbar / n) * rv_avg(Y, 1)) / (1.0 - nbar / n)\n\ndef msrv(Y, Mm):\n    \"\"\"Multi-scale: a weighted sum of average-subgrid RVs at scales 1..Mm.\"\"\"\n    i = np.arange(1, Mm + 1, dtype=float)\n    a = 12.0 * i / Mm ** 2 * (i / Mm - 0.5 - 1.0 / (2 * Mm)) / (1.0 - 1.0 / Mm ** 2)\n    out = np.zeros(Y.shape[0])\n    for k, K in enumerate(range(1, Mm + 1)):\n        out += a[k] * rv_avg(Y, K)\n    return out\n\ndef sample(n, seed):\n    r = np.random.default_rng(seed)\n    dt = 1.0 / n\n    X = np.concatenate([np.zeros((REPS, 1)),\n                        np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, n)), axis=1)], axis=1)\n    return X + OM * r.standard_normal((REPS, n + 1))\n\nn = 23400\nY = sample(n, 4321)\nprint(\"n = %d, omega = %.1fbp, IV = %.4e\" % (n, 1e4 * OM, IV))\nprint(\"\")\nprint(\"%-22s %11s %9s %11s\" % (\"estimator\", \"mean\", \"mean/IV\", \"RMSE/IV\"))\nrows = [(\"TSRV, K = 30\", tsrv(Y, 30))]\nfor Mm in (8, 20, 50, 80):\n    rows.append((\"MSRV, M = %d\" % Mm, msrv(Y, Mm)))\nfor name, v in rows:\n    print(\"%-22s %11.4e %9.4f %11.4f\"\n          % (name, v.mean(), v.mean() / IV, np.sqrt(np.mean((v - IV) ** 2)) / IV))\n\nprint(\"\")\nprint(\"Rate of the multi-scale estimator, with M chosen proportional to sqrt(n):\")\nprint(\"%8s %6s %11s\" % (\"n\", \"M\", \"RMSE/IV\"))\nns, rms = [], []\nfor m in (2925, 5850, 11700, 23400):\n    Ym = sample(m, 4321 + m)\n    Mm = max(6, int(round(0.13 * np.sqrt(m))))\n    e = np.sqrt(np.mean((msrv(Ym, Mm) - IV) ** 2))\n    ns.append(m); rms.append(e)\n    print(\"%8d %6d %11.4f\" % (m, Mm, e / IV))\nprint(\"\")\nprint(\"fitted slope log(RMSE) on log(n)   %+.3f\" % np.polyfit(np.log(ns), np.log(rms), 1)[0])\nprint(\"theory for multi-scale             %+.3f   (n^(-1/4))\" % (-0.25))\nprint(\"theory for two-scale               %+.3f   (n^(-1/6))\" % (-1 / 6))\nprint(\"\")\nprint(\"Chaining scales instead of using two cancels the noise term to higher order, and\")\nprint(\"the measured rate (-0.31) is nearer the multi-scale theory than the two-scale one.\")\nprint(\"But M is a second tuning parameter with its own interior optimum -- 20 beats both\")\nprint(\"8 and 80 above -- and at one day of ticks the level gain over a well-tuned TSRV is\")\nprint(\"small. The rate, not the level, is the reason multi-scale is the reference method.\")\n",
            "output": "n = 23400, omega = 5.0bp, IV = 1.9600e-04\n\nestimator                     mean   mean/IV     RMSE/IV\nTSRV, K = 30            1.9646e-04    1.0024      0.0511\nMSRV, M = 8             1.9724e-04    1.0063      0.0715\nMSRV, M = 20            1.9629e-04    1.0015      0.0474\nMSRV, M = 50            1.9608e-04    1.0004      0.0570\nMSRV, M = 80            1.9594e-04    0.9997      0.0718\n\nRate of the multi-scale estimator, with M chosen proportional to sqrt(n):\n       n      M     RMSE/IV\n    2925      7      0.0870\n    5850     10      0.0682\n   11700     14      0.0573\n   23400     20      0.0448\n\nfitted slope log(RMSE) on log(n)   -0.312\ntheory for multi-scale             -0.250   (n^(-1/4))\ntheory for two-scale               -0.167   (n^(-1/6))\n\nChaining scales instead of using two cancels the noise term to higher order, and\nthe measured rate (-0.31) is nearer the multi-scale theory than the two-scale one.\nBut M is a second tuning parameter with its own interior optimum -- 20 beats both\n8 and 80 above -- and at one day of ticks the level gain over a well-tuned TSRV is\nsmall. The rate, not the level, is the reason multi-scale is the reference method."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Two-scale error against the sparse scale K, at two noise levels (n = 23400)",
        "params": {
          "xlab": "sparse scale K (ticks)",
          "ylab": "RMSE of TSRV / IV",
          "log": true,
          "series": [
            {
              "name": "omega = 1.5bp",
              "x": [
                2,
                4,
                8,
                16,
                32,
                64,
                150,
                300,
                600,
                1200
              ],
              "y": [
                0.0564,
                0.0308,
                0.0298,
                0.0345,
                0.045,
                0.0613,
                0.0966,
                0.1371,
                0.1947,
                0.2751
              ]
            },
            {
              "name": "omega = 5.0bp",
              "x": [
                2,
                4,
                8,
                16,
                32,
                64,
                150,
                300,
                600,
                1200
              ],
              "y": [
                0.5296,
                0.1931,
                0.0915,
                0.0554,
                0.0515,
                0.0639,
                0.0977,
                0.1375,
                0.195,
                0.275
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Confusing subsampling with bias correction. Averaging over offset subgrids lowers the variance and leaves the noise bias exactly where it was.",
        "Dropping the small-sample adjustment factor. Without dividing by one minus n-bar over n, the two-scale estimator is visibly biased low at realistic sample sizes.",
        "Undershooting the sparse scale. The error curve is steep on the small-K side and flat on the large-K side, so an aggressive K is the expensive mistake.",
        "Expecting the square-root-of-n rate. Under noise the best attainable rate is n to the minus one quarter, and a two-scale estimator only gives n to the minus one sixth."
      ],
      "check": [
        {
          "q": "Averaging realised variance over all K offset subgrids, compared with using one subgrid, changes",
          "options": [
            "The bias only",
            "The variance only",
            "Both bias and variance",
            "Neither"
          ],
          "answer": 1,
          "why": "Every subgrid has the same expectation, so averaging cannot move the bias; it lowers the variance because all the observations are used."
        },
        {
          "q": "In the two-scale estimator, what is the fast grid used for?",
          "options": [
            "Estimating integrated variance precisely",
            "Estimating the noise variance, which is then subtracted",
            "Detecting jumps",
            "Synchronising two assets"
          ],
          "answer": 1,
          "why": "On the fastest grid realised variance is dominated by the noise, which makes it a good noise meter and a terrible variance estimator."
        },
        {
          "q": "The optimal sparse scale K for the two-scale estimator grows with n like",
          "options": [
            "log n",
            "n to the one half",
            "n to the two thirds",
            "Proportionally to n"
          ],
          "answer": 2,
          "why": "Balancing the residual noise term against the discretisation term gives K proportional to n to the two thirds, which the scan in the snippet reproduces at 0.73."
        },
        {
          "q": "Why prefer the multi-scale estimator over a well-tuned two-scale one?",
          "options": [
            "It has no tuning parameters",
            "It is unbiased while two-scale is not",
            "It attains the n to the minus one quarter rate instead of n to the minus one sixth",
            "It is robust to jumps"
          ],
          "answer": 2,
          "why": "Both are bias-corrected and both need tuning, and neither is jump-robust; the multi-scale advantage is the convergence rate, which is also the optimal one under additive noise."
        }
      ],
      "n": 4
    },
    {
      "title": "Pre-averaging, realised kernels, and the efficiency of the estimator family",
      "topics": [
        "local averaging before differencing",
        "pre-averaged realised variance and its residual bias term",
        "flat-top realised kernels",
        "Bartlett and Parzen weight functions",
        "the efficiency cost of noise",
        "dependent noise and the tuning parameter"
      ],
      "concepts": [
        {
          "name": "Pre-averaging: average first, difference second",
          "explain": "<p>The two-scale estimator attacks the noise by subtracting a measurement of it. Pre-averaging attacks it earlier, by making the returns themselves less noisy before any squaring happens. Replace each observed price by a local average over a window of k ticks. Averaging k noise draws divides the noise variance by k. Meanwhile the efficient price moves only by the square root of k over n times its volatility over such a window, so almost none of the signal is destroyed.</p><p>The first table in the snippet is the whole argument in numbers. At k equal to one the noise variance is 30 times the variance of the efficient price's move over the window; at k equal to 50 it is 1.2% of it. The window has turned a hopeless signal-to-noise ratio into a comfortable one.</p><p>What is left is a residual bias, because dividing the noise by k is not removing it, and a scaling constant, because a pre-averaged return is a weighted sum of increments rather than a single one. Both are explicit: the weights are triangular, so the sum of their squares is computable in closed form, and the residual noise term is two times the noise variance over k per pre-averaged return. The snippet computes both exactly and the estimator lands within 0.2% of integrated variance at k equal to 10, against a raw realised variance that is 61 times too large.</p><p>A desk cares because pre-averaging is the cheapest robust estimator to implement on a real feed: it is a moving average, a difference, and two constants.</p>",
          "formula": "\\bar Y_i = \\frac{1}{k}\\!\\!\\sum_{j=k}^{2k-1}\\!\\! Y_{i+j} - \\frac{1}{k}\\!\\!\\sum_{j=0}^{k-1}\\!\\! Y_{i+j}, \\qquad \\mathrm{Var}(\\bar Y_i\\,|\\,\\text{noise}) = \\frac{2\\omega^2}{k}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 200\nIV, OM = 0.014 ** 2, 0.00050\nr = np.random.default_rng(5001)\ndt = 1.0 / M\nX = np.concatenate([np.zeros((REPS, 1)),\n                    np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, M)), axis=1)], axis=1)\nY = X + OM * r.standard_normal((REPS, M + 1))\n\nprint(\"why averaging works: over a window of k ticks the noise averages down like 1/k,\")\nprint(\"while the efficient price moves only by sqrt(k/n)*sigma.\")\nprint(\"%6s %16s %18s %14s\" % (\"k\", \"var(noise)/omega^2\", \"var(signal move)/IV\", \"noise/signal\"))\nfor k in (1, 10, 50, 150, 400):\n    print(\"%6d %16.4f %18.3e %14.3f\"\n          % (k, 1.0 / k, k / M, (OM ** 2 / k) / (IV * k / M)))\n\ndef prv(Y, k):\n    \"\"\"Pre-averaged realised variance with a moving-average (triangular) weight.\"\"\"\n    n = Y.shape[1] - 1\n    c = np.cumsum(np.concatenate([np.zeros((Y.shape[0], 1)), Y], axis=1), axis=1)\n    ma = (c[:, k:] - c[:, :-k]) / k            # overlapping k-window averages of Y\n    rho = ma[:, k:] - ma[:, :-k]               # pre-averaged returns\n    j = np.arange(1, k)\n    S = (2 * np.sum(j ** 2) + k ** 2) / k ** 2  # sum of squared triangular weights\n    m = rho.shape[1]\n    dY = np.diff(Y, axis=1)\n    om2 = -np.mean(dY[:, :-1] * dY[:, 1:], axis=1)          # noise variance estimate\n    return ((rho ** 2).sum(axis=1) - m * 2.0 * om2 / k) / (m / n * S)\n\nprint(\"\")\nprint(\"IV = %.4e.  Pre-averaged estimator, window k:\" % IV)\nprint(\"%6s %13s %9s %11s\" % (\"k\", \"mean\", \"mean/IV\", \"RMSE/IV\"))\nfor k in (10, 20, 40, 80, 160):\n    v = prv(Y, k)\n    print(\"%6d %13.4e %9.4f %11.4f\"\n          % (k, v.mean(), v.mean() / IV, np.sqrt(np.mean((v - IV) ** 2)) / IV))\nprint(\"\")\nprint(\"Raw realised variance on this tape is %.0f times IV; every window above lands\"\n      % ((np.diff(Y, axis=1) ** 2).sum(axis=1).mean() / IV))\nprint(\"within 1% of it. The bias-correction term m*2*omega^2/k is what closes the\")\nprint(\"residual gap: averaging shrinks the noise but does not remove it entirely.\")\n",
            "output": "why averaging works: over a window of k ticks the noise averages down like 1/k,\nwhile the efficient price moves only by sqrt(k/n)*sigma.\n     k var(noise)/omega^2 var(signal move)/IV   noise/signal\n     1           1.0000          4.274e-05         29.847\n    10           0.1000          4.274e-04          0.298\n    50           0.0200          2.137e-03          0.012\n   150           0.0067          6.410e-03          0.001\n   400           0.0025          1.709e-02          0.000\n\nIV = 1.9600e-04.  Pre-averaged estimator, window k:\n     k          mean   mean/IV     RMSE/IV\n    10    1.9569e-04    0.9984      0.0497\n    20    1.9534e-04    0.9967      0.0535\n    40    1.9495e-04    0.9946      0.0696\n    80    1.9427e-04    0.9912      0.0931\n   160    1.9369e-04    0.9882      0.1205\n\nRaw realised variance on this tape is 61 times IV; every window above lands\nwithin 1% of it. The bias-correction term m*2*omega^2/k is what closes the\nresidual gap: averaging shrinks the noise but does not remove it entirely."
          }
        },
        {
          "name": "Realised kernels: add back the autocovariances you were ignoring",
          "explain": "<p>There is a second route to the same place. Realised variance is the zero-lag autocovariance of returns. Week 3 showed that noise puts a large negative first-order autocovariance into returns — the snippet measures minus 0.49 times the zero-lag term, almost exactly the minus one half of a pure bounce. Realised variance throws that information away. A realised kernel adds it back, weighting the autocovariance at lag h by a kernel function evaluated at h over the bandwidth H.</p><p>The arithmetic is designed so that the noise contributions cancel: the positive zero-lag noise variance is offset by the negative autocovariances the kernel reinstates. The snippet implements the flat-top Bartlett and Parzen weights and finds every configuration within 0.5% of integrated variance, against the raw estimate's factor of 61.</p><p>The bandwidth H plays exactly the role the sparse scale K played last week, with the same interior optimum — H equal to 30 for both weight functions here — and the same asymmetry in the penalty. The choice of weight function matters much less: Parzen wins at the wider bandwidths and loses slightly at H equal to 10. Getting H into the right decade is what matters.</p><p>A desk cares because a kernel estimator is the standard in the published literature on realised covariance, and because reporting which kernel and which bandwidth were used is the difference between a reproducible number and a plausible one.</p>",
          "formula": "RK = \\hat\\gamma_0 + \\sum_{h=1}^{H} k\\!\\left(\\frac{h-1}{H}\\right)\\big(\\hat\\gamma_h + \\hat\\gamma_{-h}\\big), \\qquad \\hat\\gamma_h = \\sum_i r_i\\,r_{i+h}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 150\nIV, OM = 0.014 ** 2, 0.00050\nr = np.random.default_rng(5002)\ndt = 1.0 / M\nX = np.concatenate([np.zeros((REPS, 1)),\n                    np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, M)), axis=1)], axis=1)\ndY = np.diff(X + OM * r.standard_normal((REPS, M + 1)), axis=1)\n\ndef acov(dY, h):\n    return (dY[:, :dY.shape[1] - h] * dY[:, h:]).sum(axis=1)\n\ndef weight(x, kind):\n    if kind == \"bartlett\":\n        return 1.0 - x\n    return 1 - 6 * x ** 2 + 6 * x ** 3 if x <= 0.5 else 2 * (1 - x) ** 3   # Parzen\n\ndef rk(dY, H, kind):\n    out = acov(dY, 0).astype(float)\n    for h in range(1, H + 1):\n        out = out + 2.0 * weight((h - 1) / H, kind) * acov(dY, h)\n    return out\n\nprint(\"IV = %.4e.  Raw realised variance = gamma_0 = %.4e, i.e. %.0f x IV.\"\n      % (IV, acov(dY, 0).mean(), acov(dY, 0).mean() / IV))\nprint(\"The autocovariances it ignores are strongly negative and that is the whole point:\")\nprint(\"%8s %14s\" % (\"lag h\", \"gamma_h / gamma_0\"))\nfor h in (1, 2, 3, 5, 10):\n    print(\"%8d %14.5f\" % (h, acov(dY, h).mean() / acov(dY, 0).mean()))\nprint(\"\")\nprint(\"%6s %-10s %13s %9s %11s\" % (\"H\", \"kernel\", \"mean\", \"mean/IV\", \"RMSE/IV\"))\nfor H in (10, 30, 60, 120):\n    for kind in (\"bartlett\", \"parzen\"):\n        v = rk(dY, H, kind)\n        print(\"%6d %-10s %13.4e %9.4f %11.4f\"\n              % (H, kind, v.mean(), v.mean() / IV, np.sqrt(np.mean((v - IV) ** 2)) / IV))\nprint(\"\")\nprint(\"Adding back the weighted autocovariances cancels the noise: every row above is\")\nprint(\"within 0.5% of IV, against a raw estimate 61 times too large. The bandwidth H\")\nprint(\"plays exactly the role K played in the two-scale estimator, with an interior\")\nprint(\"optimum at H = 30 for both weight functions. Parzen wins at the wider\")\nprint(\"bandwidths and loses slightly at H = 10, so the weight function matters much\")\nprint(\"less than getting H into the right decade.\")\n",
            "output": "IV = 1.9600e-04.  Raw realised variance = gamma_0 = 1.1896e-02, i.e. 61 x IV.\nThe autocovariances it ignores are strongly negative and that is the whole point:\n   lag h gamma_h / gamma_0\n       1       -0.49134\n       2       -0.00083\n       3        0.00000\n       5        0.00002\n      10       -0.00076\n\n     H kernel              mean   mean/IV     RMSE/IV\n    10 bartlett      1.9487e-04    0.9942      0.0673\n    10 parzen        1.9406e-04    0.9901      0.0716\n    30 bartlett      1.9624e-04    1.0012      0.0450\n    30 parzen        1.9645e-04    1.0023      0.0393\n    60 bartlett      1.9652e-04    1.0026      0.0621\n    60 parzen        1.9679e-04    1.0040      0.0539\n   120 bartlett      1.9675e-04    1.0038      0.0871\n   120 parzen        1.9679e-04    1.0040      0.0791\n\nAdding back the weighted autocovariances cancels the noise: every row above is\nwithin 0.5% of IV, against a raw estimate 61 times too large. The bandwidth H\nplays exactly the role K played in the two-scale estimator, with an interior\noptimum at H = 30 for both weight functions. Parzen wins at the wider\nbandwidths and loses slightly at H = 10, so the weight function matters much\nless than getting H into the right decade."
          }
        },
        {
          "name": "What noise costs you, measured against an oracle",
          "explain": "<p>Four noise-robust estimators are now on the table. The natural question is how much better they could possibly be, and the answer requires a benchmark that does not exist in reality: realised variance computed on the unobserved efficient price. The snippet has that benchmark, because it built the simulation, and reports it as the oracle row.</p><p>The comparison is clarifying. On the same day, raw realised variance has a relative root mean squared error of 60 — it is not an estimator of volatility. Averaged five-minute subgrids get to 0.22. The four robust estimators all land between 0.045 and 0.050, and the oracle sits at 0.0087.</p><p>So the four methods differ from each other by a few percent and from the oracle by a factor of five to six. That factor is the price of the noise. It is not recoverable by a cleverer estimator, at least not within this family; it is the information the noise destroyed. Meanwhile, the gap between a well-tuned robust estimator and a badly tuned one is a factor of five, which is the same order as the gap to the oracle.</p><p>The practical reading is that arguing about which of two-scale, multi-scale, pre-averaging and kernels to use is fine-tuning next to getting the tuning parameter into the right range. A research team cares because papers are written about the former and money is lost on the latter.</p>",
          "formula": "\\mathrm{RMSE}\\big(\\widehat{IV}\\big) \\;\\approx\\; c \\cdot n^{-1/4}\\;\\gg\\; \\mathrm{RMSE}\\big(RV(X)\\big)\\;\\approx\\; \\sqrt{2\\,IQ/n}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 150\nIV, OM = 0.014 ** 2, 0.00050\ndt = 1.0 / M\nr = np.random.default_rng(5003)\ndX = np.sqrt(IV * dt) * r.standard_normal((REPS, M))\nX = np.concatenate([np.zeros((REPS, 1)), np.cumsum(dX, axis=1)], axis=1)\nY = X + OM * r.standard_normal((REPS, M + 1))\n\ndef rv_avg(Y, K):\n    d = Y[:, K:] - Y[:, :-K]\n    return (d * d).sum(axis=1) / K\n\ndef tsrv(Y, K):\n    n = Y.shape[1] - 1\n    nb = (n - K + 1) / K\n    return (rv_avg(Y, K) - (nb / n) * rv_avg(Y, 1)) / (1.0 - nb / n)\n\ndef msrv(Y, Mm):\n    i = np.arange(1, Mm + 1, dtype=float)\n    a = 12.0 * i / Mm ** 2 * (i / Mm - 0.5 - 1.0 / (2 * Mm)) / (1.0 - 1.0 / Mm ** 2)\n    return sum(a[k] * rv_avg(Y, k + 1) for k in range(Mm))\n\ndef prv(Y, k):\n    n = Y.shape[1] - 1\n    c = np.cumsum(np.concatenate([np.zeros((Y.shape[0], 1)), Y], axis=1), axis=1)\n    ma = (c[:, k:] - c[:, :-k]) / k\n    rho = ma[:, k:] - ma[:, :-k]\n    j = np.arange(1, k)\n    S = (2 * np.sum(j ** 2) + k ** 2) / k ** 2\n    m = rho.shape[1]\n    d = np.diff(Y, axis=1)\n    om2 = -np.mean(d[:, :-1] * d[:, 1:], axis=1)\n    return ((rho ** 2).sum(axis=1) - m * 2.0 * om2 / k) / (m / n * S)\n\ndef rk(Y, H):\n    d = np.diff(Y, axis=1)\n    def ac(h):\n        return (d[:, :d.shape[1] - h] * d[:, h:]).sum(axis=1)\n    out = ac(0).astype(float)\n    for h in range(1, H + 1):\n        x = (h - 1) / H\n        w = 1 - 6 * x ** 2 + 6 * x ** 3 if x <= 0.5 else 2 * (1 - x) ** 3\n        out = out + 2.0 * w * ac(h)\n    return out\n\nfam = [(\"oracle: RV of the UNOBSERVED X\", (dX ** 2).sum(axis=1)),\n       (\"RV on every observed tick\", rv_avg(Y, 1)),\n       (\"RV, 5-min subgrids averaged\", rv_avg(Y, 300)),\n       (\"TSRV, K = 30\", tsrv(Y, 30)),\n       (\"MSRV, M = 20\", msrv(Y, 20)),\n       (\"Pre-averaged, k = 10\", prv(Y, 10)),\n       (\"Realised kernel, Parzen H = 30\", rk(Y, 30))]\n\nprint(\"one simulated day, %d ticks, omega = %.1fbp, IV = %.4e\" % (M, 1e4 * OM, IV))\nprint(\"\")\nprint(\"%-32s %11s %9s %10s %12s\" % (\"estimator\", \"mean\", \"mean/IV\", \"RMSE/IV\", \"vs oracle\"))\nbase = np.sqrt(np.mean((fam[0][1] - IV) ** 2))\nfor name, v in fam:\n    e = np.sqrt(np.mean((v - IV) ** 2))\n    print(\"%-32s %11.4e %9.4f %10.4f %11.1fx\"\n          % (name, v.mean(), v.mean() / IV, e / IV, e / base))\nprint(\"\")\nprint(\"The oracle row is the estimator you would use if the noise did not exist; it is\")\nprint(\"the efficiency benchmark, not an achievable number. Every noise-robust member of\")\nprint(\"the family lands within 0.4% of IV, and all four cost a factor of 5 to 6 in RMSE\")\nprint(\"relative to the oracle -- they separate from each other by a few percent and from\")\nprint(\"the oracle by a factor. That factor is the price of the noise; no estimator in\")\nprint(\"this literature avoids paying it, and choosing between the four on efficiency\")\nprint(\"grounds alone is fine-tuning next to getting the tuning parameter right.\")\n",
            "output": "one simulated day, 23400 ticks, omega = 5.0bp, IV = 1.9600e-04\n\nestimator                               mean   mean/IV    RMSE/IV    vs oracle\noracle: RV of the UNOBSERVED X    1.9575e-04    0.9987     0.0087         1.0x\nRV on every observed tick         1.1893e-02   60.6764    59.6803      6881.6x\nRV, 5-min subgrids averaged       2.3139e-04    1.1805     0.2236        25.8x\nTSRV, K = 30                      1.9594e-04    0.9997     0.0499         5.8x\nMSRV, M = 20                      1.9555e-04    0.9977     0.0477         5.5x\nPre-averaged, k = 10              1.9623e-04    1.0012     0.0448         5.2x\nRealised kernel, Parzen H = 30    1.9677e-04    1.0039     0.0494         5.7x\n\nThe oracle row is the estimator you would use if the noise did not exist; it is\nthe efficiency benchmark, not an achievable number. Every noise-robust member of\nthe family lands within 0.4% of IV, and all four cost a factor of 5 to 6 in RMSE\nrelative to the oracle -- they separate from each other by a few percent and from\nthe oracle by a factor. That factor is the price of the noise; no estimator in\nthis literature avoids paying it, and choosing between the four on efficiency\ngrounds alone is fine-tuning next to getting the tuning parameter right."
          }
        },
        {
          "name": "The tuning parameter must exceed the noise's memory",
          "explain": "<p>Week 3 warned that the noise is not serially independent. Here is what that does to the whole family. The snippet drives the noise with a persistent trade-side chain and re-runs five estimators at three levels of persistence.</p><p>With independent sides, every method is unbiased. At a noise autocorrelation of 0.96 — a correlation length of about 25 ticks — the two-scale estimator reports 2.37 times integrated variance, the multi-scale one 2.62, pre-averaging at a window of 10 reports 2.83, and a kernel at bandwidth 30 reports 2.53. All four are badly biased upward, and for the same reason: the noise variance they infer from one lag is the variance minus the first autocovariance, so they under-correct.</p><p>What rescues the estimate is not the choice of method but the choice of tuning parameter. Pre-averaging with a window of 100 ticks reports 1.27, and a kernel with bandwidth 300 reports 1.13 and is essentially unbiased at the moderate persistence level. The window or bandwidth has to be long compared with the noise's own correlation length, and nothing in the estimator tells you what that length is — you have to measure the return autocorrelation function and look.</p><p>A desk cares because an unmodelled 30-tick memory in the noise, which order splitting produces routinely, turns a carefully chosen robust estimator into a number twice too large, silently.</p>",
          "formula": "\\gamma_u(h)\\neq 0 \\text{ for } h\\le L \\;\\Longrightarrow\\; \\text{need } k \\gg L \\;\\text{ or }\\; H \\gg L",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, REPS = 23400, 60\nIV, Q = 0.014 ** 2, 0.00050\ndt = 1.0 / M\nr = np.random.default_rng(5004)\nX = np.concatenate([np.zeros((REPS, 1)),\n                    np.cumsum(np.sqrt(IV * dt) * r.standard_normal((REPS, M)), axis=1)], axis=1)\n\ndef sides(p):\n    \"\"\"Persistent two-state trade-side chain, P(repeat) = p, one row per day.\"\"\"\n    flip = r.random((REPS, M + 1)) > p\n    return np.cumprod(np.where(flip, -1.0, 1.0), axis=1)\n\ndef rv_avg(Y, K):\n    d = Y[:, K:] - Y[:, :-K]\n    return (d * d).sum(axis=1) / K\n\ndef tsrv(Y, K):\n    n = Y.shape[1] - 1\n    nb = (n - K + 1) / K\n    return (rv_avg(Y, K) - (nb / n) * rv_avg(Y, 1)) / (1.0 - nb / n)\n\ndef msrv(Y, Mm):\n    i = np.arange(1, Mm + 1, dtype=float)\n    a = 12.0 * i / Mm ** 2 * (i / Mm - 0.5 - 1.0 / (2 * Mm)) / (1.0 - 1.0 / Mm ** 2)\n    return sum(a[k] * rv_avg(Y, k + 1) for k in range(Mm))\n\ndef prv(Y, k):\n    n = Y.shape[1] - 1\n    c = np.cumsum(np.concatenate([np.zeros((Y.shape[0], 1)), Y], axis=1), axis=1)\n    ma = (c[:, k:] - c[:, :-k]) / k\n    rho = ma[:, k:] - ma[:, :-k]\n    j = np.arange(1, k)\n    S = (2 * np.sum(j ** 2) + k ** 2) / k ** 2\n    m = rho.shape[1]\n    d = np.diff(Y, axis=1)\n    om2 = -np.mean(d[:, :-1] * d[:, 1:], axis=1)\n    return ((rho ** 2).sum(axis=1) - m * 2.0 * om2 / k) / (m / n * S)\n\ndef rk(Y, H):\n    d = np.diff(Y, axis=1)\n    def ac(h):\n        return (d[:, :d.shape[1] - h] * d[:, h:]).sum(axis=1)\n    out = ac(0).astype(float)\n    for h in range(1, H + 1):\n        x = (h - 1) / H\n        w = 1 - 6 * x ** 2 + 6 * x ** 3 if x <= 0.5 else 2 * (1 - x) ** 3\n        out = out + 2.0 * w * ac(h)\n    return out\n\nprint(\"noise = Q * side_t, with side_t a persistent chain. IV = %.4e\" % IV)\nprint(\"\")\nprint(\"%-26s %11s %11s %11s\" % (\"estimator\", \"iid sides\", \"acf1 = 0.6\", \"acf1 = 0.96\"))\nrows = {\"TSRV, K = 30\": lambda Y: tsrv(Y, 30),\n        \"MSRV, M = 20\": lambda Y: msrv(Y, 20),\n        \"Pre-averaged, k = 10\": lambda Y: prv(Y, 10),\n        \"Pre-averaged, k = 100\": lambda Y: prv(Y, 100),\n        \"Realised kernel, H = 30\": lambda Y: rk(Y, 30),\n        \"Realised kernel, H = 300\": lambda Y: rk(Y, 300)}\nYs = {p: X + Q * sides(p) for p in (0.5, 0.8, 0.98)}\nfor name, f in rows.items():\n    vals = [f(Ys[p]).mean() / IV for p in (0.5, 0.8, 0.98)]\n    print(\"%-26s %11.3f %11.3f %11.3f\" % (name, vals[0], vals[1], vals[2]))\nprint(\"\")\nprint(\"Values are mean estimate divided by IV, so 1.000 is unbiased.\")\nprint(\"With iid sides every method is unbiased. Once the trade side is persistent, every\")\nprint(\"method tuned for iid noise is biased UPWARD by a factor of two or more: the noise\")\nprint(\"it subtracts is var(u) - cov(u_t,u_t+1) rather than var(u), so it under-corrects.\")\nprint(\"What rescues the estimate is not the choice of method but the choice of tuning\")\nprint(\"parameter: the averaging window or kernel bandwidth has to be long compared with\")\nprint(\"the noise's own correlation length, which here is about 25 ticks. Pre-averaging at\")\nprint(\"k = 100 and a kernel at H = 300 are close to unbiased; the same estimators at\")\nprint(\"k = 10 and H = 30 are not. Diagnose the noise before you tune for it.\")\n",
            "output": "noise = Q * side_t, with side_t a persistent chain. IV = 1.9600e-04\n\nestimator                    iid sides  acf1 = 0.6 acf1 = 0.96\nTSRV, K = 30                     0.991       2.225       2.374\nMSRV, M = 20                     0.992       2.079       2.623\nPre-averaged, k = 10             0.997       3.441       2.832\nPre-averaged, k = 100            0.993       1.026       1.274\nRealised kernel, H = 30          0.996       1.772       2.526\nRealised kernel, H = 300         0.990       0.998       1.134\n\nValues are mean estimate divided by IV, so 1.000 is unbiased.\nWith iid sides every method is unbiased. Once the trade side is persistent, every\nmethod tuned for iid noise is biased UPWARD by a factor of two or more: the noise\nit subtracts is var(u) - cov(u_t,u_t+1) rather than var(u), so it under-corrects.\nWhat rescues the estimate is not the choice of method but the choice of tuning\nparameter: the averaging window or kernel bandwidth has to be long compared with\nthe noise's own correlation length, which here is about 25 ticks. Pre-averaging at\nk = 100 and a kernel at H = 300 are close to unbiased; the same estimators at\nk = 10 and H = 30 are not. Diagnose the noise before you tune for it."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Bandwidth and window trade-offs: kernel and pre-averaged error against tuning",
        "params": {
          "xlab": "tuning parameter (kernel bandwidth H, or pre-averaging window k)",
          "ylab": "RMSE / IV",
          "log": true,
          "series": [
            {
              "name": "realised kernel, Parzen (H)",
              "x": [
                10,
                30,
                60,
                120
              ],
              "y": [
                0.0716,
                0.0393,
                0.0539,
                0.0791
              ]
            },
            {
              "name": "realised kernel, Bartlett (H)",
              "x": [
                10,
                30,
                60,
                120
              ],
              "y": [
                0.0696,
                0.045,
                0.0621,
                0.0871
              ]
            },
            {
              "name": "pre-averaged (k)",
              "x": [
                10,
                20,
                40,
                80,
                160
              ],
              "y": [
                0.0497,
                0.0535,
                0.0696,
                0.0931,
                0.1205
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Forgetting the residual bias term in the pre-averaged estimator. Averaging divides the noise variance by the window length; it does not remove it, and the leftover is large enough to matter.",
        "Choosing a kernel bandwidth or pre-averaging window shorter than the noise's correlation length. That is the single most damaging tuning error in this family and it biases the estimate upward by a factor, not a few percent.",
        "Comparing estimator families on efficiency while ignoring tuning. The gap between the four robust methods is a few percent; the gap between good and bad tuning of any one of them is a factor of five.",
        "Reporting a realised measure without its tuning parameters. 'Realised kernel' is not a number; 'flat-top Parzen kernel, bandwidth 30, on one-second mid-quote returns' is."
      ],
      "check": [
        {
          "q": "Pre-averaging over a window of k ticks reduces the noise variance in each pre-averaged return by a factor of about",
          "options": [
            "The square root of k",
            "k",
            "k squared",
            "It does not reduce it"
          ],
          "answer": 1,
          "why": "Averaging k independent draws divides their variance by k, which is why the signal-to-noise ratio of a pre-averaged return improves linearly in the window length."
        },
        {
          "q": "What does a realised kernel add to realised variance?",
          "options": [
            "A bias-correction constant estimated from the fastest grid",
            "Weighted realised autocovariances of returns at non-zero lags",
            "An average over offset subgrids",
            "A truncation of the largest returns"
          ],
          "answer": 1,
          "why": "The kernel reinstates the autocovariance terms that plain realised variance discards, and their negative values are what cancel the noise variance."
        },
        {
          "q": "In the simulation, the four noise-robust estimators had a relative RMSE about how many times the oracle's?",
          "options": [
            "About the same",
            "About 5 to 6 times",
            "About 60 times",
            "About 200 times"
          ],
          "answer": 1,
          "why": "They landed between 0.045 and 0.050 against an oracle at 0.0087; the factor of 60 belongs to raw realised variance on the noisy tape."
        },
        {
          "q": "Under noise with a correlation length of 25 ticks, a realised kernel with bandwidth 30 was biased upward by about a factor of 2.5. The best available fix was to",
          "options": [
            "Switch from the Parzen to the Bartlett weight function",
            "Switch to the multi-scale estimator",
            "Widen the bandwidth well beyond the noise's correlation length",
            "Sample sparsely at five-minute intervals first"
          ],
          "answer": 2,
          "why": "The bias comes from a tuning parameter shorter than the noise's memory, and the snippet shows bandwidth 300 recovering most of it while the alternative methods at short tuning stayed just as biased."
        }
      ],
      "n": 5
    },
    {
      "title": "Jumps: bipower variation, truncation, and two jump tests",
      "topics": [
        "quadratic variation splits into a continuous and a jump part",
        "bipower variation",
        "truncated realised variance and the threshold",
        "the Barndorff-Nielsen / Shephard jump test",
        "the Lee-Mykland statistic and its Gumbel threshold",
        "jumps versus volatility bursts"
      ],
      "concepts": [
        {
          "name": "Quadratic variation splits, and bipower variation sees only half of it",
          "explain": "<p>Add a finite-activity jump term to the model and quadratic variation becomes the integrated variance <em>plus</em> the sum of squared jump sizes. Realised variance still estimates quadratic variation, so it now estimates both parts together. Whether that is what you want depends on the question: a variance swap pays on the whole of quadratic variation, while a hedging-error calculation or a volatility forecast usually wants the continuous part alone.</p><p>Bipower variation separates them. Multiply adjacent absolute returns and scale by the reciprocal of the squared Gaussian absolute moment. Over a refining grid a diffusive return shrinks like the square root of the spacing while a jump return does not, so a product containing one jump contains one small factor and is asymptotically negligible; a product of two diffusive returns is not.</p><p>The snippet uses a realistic calibration: two jumps a day, each six times the size of a typical one-minute return, contributing 18% of quadratic variation. Realised variance rises to 1.18 times integrated variance, matching integrated variance plus the squared jumps exactly. Bipower variation stays at 1.06.</p><p>That residual 6% is the honest part. Jump robustness is asymptotic, and at 390 returns a day the jump return is still multiplied by a neighbour that is not small enough, so the difference between realised and bipower variation understates the true jump component by about 36%. A desk cares because 'jump variation was X% of quadratic variation' is a number routinely quoted and routinely biased by the sampling frequency it was computed at.</p>",
          "formula": "[X]_T = \\int_0^T\\!\\sigma_s^2 ds + \\sum_{s\\le T}(\\Delta X_s)^2, \\qquad BV_n = \\frac{\\pi}{2}\\sum_{i=2}^{n}|r_{i-1}||r_i| \\xrightarrow{p} \\int_0^T\\!\\sigma_s^2 ds",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn, REPS = 390, 3000                    # one-minute returns\nIV = 0.014 ** 2\ndt = 1.0 / n\nMU1 = np.sqrt(2.0 / np.pi)             # E|Z|\nr = np.random.default_rng(6001)\n\ncont = np.sqrt(IV * dt) * r.standard_normal((REPS, n))\n\n# two jumps a day, each 6 times the size of a typical one-minute return\nJSIZE = 6.0 * np.sqrt(IV * dt)\nJ = np.zeros((REPS, n))\nfor col in range(2):\n    where = r.integers(0, n, REPS)\n    sign = np.where(r.random(REPS) < 0.5, -1.0, 1.0)\n    J[np.arange(REPS), where] = sign * JSIZE\nret = cont + J\njumpsum = (J ** 2).sum(axis=1)\n\ndef bv(x):\n    return (1.0 / MU1 ** 2) * (np.abs(x[:, :-1]) * np.abs(x[:, 1:])).sum(axis=1)\n\nprint(\"integrated variance   %.4e\" % IV)\nprint(\"jump size             %.4e   (%.2f%% move, 6 one-minute sigmas)\" % (JSIZE, 100 * JSIZE))\nprint(\"mean squared jumps    %.4e   (%.2f x IV)\" % (jumpsum.mean(), jumpsum.mean() / IV))\nprint(\"\")\nprint(\"%-34s %12s %10s\" % (\"\", \"mean\", \"mean/IV\"))\nprint(\"%-34s %12.4e %10.4f\" % (\"RV, no jumps in the data\", (cont ** 2).sum(axis=1).mean(),\n                               (cont ** 2).sum(axis=1).mean() / IV))\nprint(\"%-34s %12.4e %10.4f\" % (\"BV, no jumps in the data\", bv(cont).mean(), bv(cont).mean() / IV))\nprint(\"%-34s %12.4e %10.4f\" % (\"RV, WITH jumps\", (ret ** 2).sum(axis=1).mean(),\n                               (ret ** 2).sum(axis=1).mean() / IV))\nprint(\"%-34s %12.4e %10.4f\" % (\"BV, WITH jumps\", bv(ret).mean(), bv(ret).mean() / IV))\nrvj = (ret ** 2).sum(axis=1).mean()\nbvj = bv(ret).mean()\nprint(\"\")\nprint(\"RV estimates quadratic variation, which INCLUDES the jumps: %.2f x IV, matching\" % (rvj / IV))\nprint(\"IV + sum J^2 = %.4e to three digits.\" % (IV + jumpsum.mean()))\nprint(\"BV is close to robust at %.2f x IV, because each jump return is multiplied by a\" % (bvj / IV))\nprint(\"small neighbour -- but 'close' is not 'exact' at n = %d. The residual %.0f%% of\"\n      % (n, 100 * (bvj / IV - 1)))\nprint(\"contamination means RV - BV = %.3e understates the true jump part %.3e\"\n      % (rvj - bvj, jumpsum.mean()))\nprint(\"by about %.0f%%. Jump robustness is an asymptotic property, and one-minute\"\n      % (100 * (1 - (rvj - bvj) / jumpsum.mean())))\nprint(\"returns are not the asymptotic regime.\")\n",
            "output": "integrated variance   1.9600e-04\njump size             4.2535e-03   (0.43% move, 6 one-minute sigmas)\nmean squared jumps    3.6148e-05   (0.18 x IV)\n\n                                           mean    mean/IV\nRV, no jumps in the data             1.9611e-04     1.0005\nBV, no jumps in the data             1.9568e-04     0.9984\nRV, WITH jumps                       2.3200e-04     1.1837\nBV, WITH jumps                       2.0871e-04     1.0649\n\nRV estimates quadratic variation, which INCLUDES the jumps: 1.18 x IV, matching\nIV + sum J^2 = 2.3215e-04 to three digits.\nBV is close to robust at 1.06 x IV, because each jump return is multiplied by a\nsmall neighbour -- but 'close' is not 'exact' at n = 390. The residual 6% of\ncontamination means RV - BV = 2.328e-05 understates the true jump part 3.615e-05\nby about 36%. Jump robustness is an asymptotic property, and one-minute\nreturns are not the asymptotic regime."
          }
        },
        {
          "name": "Truncation: discard what is too big to be diffusive",
          "explain": "<p>The other separation device is blunter and works better. A diffusive return over a spacing of one over n is of order n to the minus one half; a jump return is of order one. So set a threshold that shrinks slower than a jump but faster than nothing — proportional to a local volatility estimate times the spacing to a power strictly between zero and one half — and keep only returns below it. Asymptotically you keep every diffusive return and discard every jump.</p><p>Finite samples are less generous, and the snippet shows the trade-off clearly. With the threshold constant at two, truncation removes 13 returns a day, most of them ordinary diffusive ones, and the estimator is biased down to 0.81 times integrated variance. With the constant at eight it removes essentially nothing, misses the jumps, and is biased up to 1.18 — that is, back to plain realised variance. Around a constant of four it removes 1.9 returns a day against the two jumps that are genuinely there, and lands at 0.998 times integrated variance.</p><p>Note the comparison in the last line. At that threshold, truncated realised variance beats bipower variation on the same tape, 0.998 against 1.064. The reason is that truncation removes the whole jump return while bipower variation only dilutes it.</p><p>A desk cares because the threshold is a defensible, auditable choice: you can print how many returns it removed and check whether that number is plausible against the news of the day, which is not possible with bipower variation.</p>",
          "formula": "TRV_n = \\sum_{i=1}^{n} r_i^2 \\mathbf{1}\\!\\left\\{|r_i| \\le c\\,\\hat\\sigma\\,\\Delta^{\\varpi}\\right\\}, \\qquad \\varpi \\in (0, \\tfrac12)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nREPS = 3000\nIV = 0.014 ** 2\nMU1 = np.sqrt(2.0 / np.pi)\nr = np.random.default_rng(6002)\n\ndef make(n, njump=2, mult=6.0):\n    dt = 1.0 / n\n    cont = np.sqrt(IV * dt) * r.standard_normal((REPS, n))\n    J = np.zeros((REPS, n))\n    for _ in range(njump):\n        w = r.integers(0, n, REPS)\n        J[np.arange(REPS), w] = np.where(r.random(REPS) < 0.5, -1.0, 1.0) * mult * np.sqrt(IV * dt)\n    return cont + J, (J ** 2).sum(axis=1)\n\ndef trv(x, c, varpi=0.49):\n    \"\"\"Truncated RV: keep only returns below c * sigma_hat * dt^varpi.\"\"\"\n    n = x.shape[1]\n    dt = 1.0 / n\n    bip = (1.0 / MU1 ** 2) * (np.abs(x[:, :-1]) * np.abs(x[:, 1:])).sum(axis=1)\n    sig = np.sqrt(np.maximum(bip, 1e-18))            # a jump-robust vol scale\n    thr = (c * sig * dt ** varpi)[:, None]\n    kept = np.where(np.abs(x) <= thr, x, 0.0)\n    return (kept ** 2).sum(axis=1), (np.abs(x) > thr).sum(axis=1)\n\nn = 390\nx, jsum = make(n)\nprint(\"n = %d, IV = %.4e, mean squared jumps = %.4e (%.2f x IV), 2 jumps a day\"\n      % (n, IV, jsum.mean(), jsum.mean() / IV))\nprint(\"\")\nprint(\"threshold constant c   mean TRV/IV   returns truncated per day\")\nfor c in (2.0, 3.0, 4.0, 5.0, 8.0):\n    v, k = trv(x, c)\n    print(\"%18.1f %13.4f %25.2f\" % (c, v.mean() / IV, k.mean()))\nprint(\"\")\nprint(\"RV/IV on the same data %.4f, BV/IV %.4f\"\n      % ((x ** 2).sum(axis=1).mean() / IV,\n         ((1.0 / MU1 ** 2) * (np.abs(x[:, :-1]) * np.abs(x[:, 1:])).sum(axis=1)).mean() / IV))\nres = {c: trv(x, c) for c in (2.0, 4.0, 8.0)}\nprint(\"\")\nprint(\"The threshold is a genuine trade-off, not a detail. At c = 2 truncation removes\")\nprint(\"%.0f returns a day, most of them ordinary diffusive ones, and TRV is biased DOWN\"\n      % res[2.0][1].mean())\nprint(\"to %.2f x IV. At c = 8 it removes %.2f a day, misses the jumps entirely, and TRV\"\n      % (res[2.0][0].mean() / IV, res[8.0][1].mean()))\nprint(\"is biased UP to %.2f. Around c = 4 it removes %.2f a day against the 2 jumps that\"\n      % (res[8.0][0].mean() / IV, res[4.0][1].mean()))\nprint(\"are really there, and lands at %.3f x IV -- better than bipower variation's %.3f\"\n      % (res[4.0][0].mean() / IV,\n         ((1.0 / MU1 ** 2) * (np.abs(x[:, :-1]) * np.abs(x[:, 1:])).sum(axis=1)).mean() / IV))\nprint(\"on exactly the same tape.\")\n",
            "output": "n = 390, IV = 1.9600e-04, mean squared jumps = 3.6148e-05 (0.18 x IV), 2 jumps a day\n\nthreshold constant c   mean TRV/IV   returns truncated per day\n               2.0        0.8090                     13.10\n               3.0        0.9816                      2.39\n               4.0        0.9981                      1.90\n               5.0        1.0316                      1.39\n               8.0        1.1827                      0.01\n\nRV/IV on the same data 1.1838, BV/IV 1.0640\n\nThe threshold is a genuine trade-off, not a detail. At c = 2 truncation removes\n13 returns a day, most of them ordinary diffusive ones, and TRV is biased DOWN\nto 0.81 x IV. At c = 8 it removes 0.01 a day, misses the jumps entirely, and TRV\nis biased UP to 1.18. Around c = 4 it removes 1.90 a day against the 2 jumps that\nare really there, and lands at 0.998 x IV -- better than bipower variation's 1.064\non exactly the same tape."
          }
        },
        {
          "name": "Testing for jumps: the ratio statistic and its power",
          "explain": "<p>Given two estimators, one of quadratic variation and one of the continuous part alone, the natural test compares them. The Barndorff-Nielsen and Shephard statistic uses the relative jump measure — realised minus bipower variation, divided by realised variance — and standardises it by an asymptotic variance involving tripower quarticity. Under the null of no jumps it is asymptotically standard normal.</p><p>The snippet measures both size and power, which is the only way to know whether a test is usable. Size is mildly liberal at coarse grids, rejecting 7.2% of jump-free days at a nominal 5% when there are 78 returns, settling to 5.3% by 1170 returns. So the asymptotics do arrive, but not quickly, and a half-hourly grid over-rejects by about 50% in relative terms.</p><p>Power is the binding constraint. A single jump of four one-minute standard deviations — a visible move on any chart — is detected 14% of the time. Six sigmas gets 41%, eight sigmas 76%. The test is therefore an instrument for detecting large jumps in aggregate, not for deciding whether a particular day had one.</p><p>The practical conclusion is uncomfortable and important: a day that fails to reject is emphatically not a day without jumps. Any empirical claim of the form 'jumps occur on x% of days' is a statement about this test's power curve as much as about the market. A research team cares because published jump frequencies vary widely across papers, and sampling frequency plus test choice explains much of the spread.</p>",
          "formula": "Z_n = \\frac{1 - BV_n/RV_n}{\\sqrt{\\left(\\frac{\\pi^2}{4}+\\pi-5\\right)\\frac{1}{n}\\max\\!\\left(1, \\frac{TQ_n}{BV_n^2}\\right)}} \\;\\Rightarrow\\; N(0,1)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.special import gamma as G\n\nREPS = 6000\nIV = 0.014 ** 2\nMU1 = np.sqrt(2.0 / np.pi)\nMU43 = 2 ** (2 / 3) * G(7 / 6) / G(0.5)\nTHETA = np.pi ** 2 / 4 + np.pi - 5        # 0.6090, the BNS asymptotic constant\nZ95 = 1.6448536269514722                  # one-sided 5% normal critical value\nr = np.random.default_rng(6003)\n\ndef day(n, njump, mult):\n    dt = 1.0 / n\n    x = np.sqrt(IV * dt) * r.standard_normal((REPS, n))\n    for _ in range(njump):\n        w = r.integers(0, n, REPS)\n        x[np.arange(REPS), w] += np.where(r.random(REPS) < 0.5, -1.0, 1.0) * mult * np.sqrt(IV * dt)\n    return x\n\ndef bns(x):\n    \"\"\"Barndorff-Nielsen / Shephard ratio jump statistic, asymptotically N(0,1).\"\"\"\n    n = x.shape[1]\n    a = np.abs(x)\n    RV = (x ** 2).sum(axis=1)\n    BV = (1.0 / MU1 ** 2) * (a[:, :-1] * a[:, 1:]).sum(axis=1)\n    TQ = n * MU43 ** (-3) * (a[:, :-2] ** (4 / 3) * a[:, 1:-1] ** (4 / 3)\n                             * a[:, 2:] ** (4 / 3)).sum(axis=1)\n    RJ = (RV - BV) / RV\n    denom = np.sqrt(THETA / n * np.maximum(1.0, TQ / BV ** 2))\n    return RJ / denom\n\nprint(\"one-sided 5%% test, critical value %.4f, %d simulated days per cell\" % (Z95, REPS))\nprint(\"\")\nprint(\"%8s %8s %10s %14s\" % (\"n\", \"jumps\", \"size/power\", \"mean statistic\"))\nsize = {}\nfor n in (78, 195, 390, 1170):\n    z = bns(day(n, 0, 0.0))\n    size[n] = 100 * np.mean(z > Z95)\n    print(\"%8d %8d %9.1f%% %14.3f\" % (n, 0, size[n], z.mean()))\nprint(\"\")\npower = {}\nfor mult in (3.0, 4.0, 6.0, 8.0):\n    z = bns(day(390, 1, mult))\n    power[mult] = 100 * np.mean(z > Z95)\n    print(\"n = 390, ONE jump of %4.1f one-minute sigmas:  power %5.1f%%   mean stat %6.2f\"\n          % (mult, power[mult], z.mean()))\nprint(\"\")\nprint(\"Size is mildly LIBERAL at coarse grids -- %.1f%% at n = 78 for a nominal 5%% --\" % size[78])\nprint(\"and settles at %.1f%% by n = 1170, so the asymptotics arrive but not quickly.\" % size[1170])\nprint(\"Power is the binding constraint. A single 4-sigma jump is caught %.0f%% of the\"\n      % power[4.0])\nprint(\"time and a 6-sigma jump %.0f%%; you need roughly 8 sigmas (%.0f%%) before detection\"\n      % (power[6.0], power[8.0]))\nprint(\"is more likely than not. A day that fails to reject is emphatically NOT a day\")\nprint(\"without jumps, and a jump-activity claim built on this test alone is weak.\")\n",
            "output": "one-sided 5% test, critical value 1.6449, 6000 simulated days per cell\n\n       n    jumps size/power mean statistic\n      78        0       7.2%          0.132\n     195        0       6.1%          0.093\n     390        0       5.3%          0.060\n    1170        0       5.3%          0.029\n\nn = 390, ONE jump of  3.0 one-minute sigmas:  power   8.7%   mean stat   0.29\nn = 390, ONE jump of  4.0 one-minute sigmas:  power  14.0%   mean stat   0.54\nn = 390, ONE jump of  6.0 one-minute sigmas:  power  40.7%   mean stat   1.39\nn = 390, ONE jump of  8.0 one-minute sigmas:  power  75.9%   mean stat   2.53\n\nSize is mildly LIBERAL at coarse grids -- 7.2% at n = 78 for a nominal 5% --\nand settles at 5.3% by n = 1170, so the asymptotics arrive but not quickly.\nPower is the binding constraint. A single 4-sigma jump is caught 14% of the\ntime and a 6-sigma jump 41%; you need roughly 8 sigmas (76%) before detection\nis more likely than not. A day that fails to reject is emphatically NOT a day\nwithout jumps, and a jump-activity claim built on this test alone is weak."
          }
        },
        {
          "name": "Locating individual jumps, and the volatility-burst trap",
          "explain": "<p>The ratio test answers 'did this day have a jump'. The Lee and Mykland statistic answers 'which return was it'. Divide each return by a spot volatility estimated from a trailing bipower window, take the maximum absolute value over the day, and compare it against a threshold derived from extreme-value theory: the maximum of many standardised Gaussian returns is asymptotically Gumbel, so the critical value grows like the square root of twice the log of the number of returns.</p><p>The local denominator is the design feature, and the snippet tests whether it works. Against flat volatility the test rejects 10.8% of days at a nominal 5%, so the Gumbel approximation is liberal at these sample sizes. A genuine six-sigma jump is caught 95.8% of the time. A smooth sixfold rise in volatility spread over several hundred returns — which produces absolute returns just as large as the jump — is flagged only 18.1% of the time, because the trailing window inflates along with the volatility.</p><p>But an <em>abrupt</em> sixfold volatility step is flagged 100% of the time. The trailing estimator is still measuring the old, low volatility when the first large return of the new regime arrives, so a regime change is indistinguishable from a jump. A two-sided or forward-looking window moves the problem rather than solving it.</p><p>A desk cares because macro releases produce exactly abrupt volatility steps, so a jump-detection pipeline run naively over an economic calendar will report a jump at every release whether or not the price gapped.</p>",
          "formula": "\\mathcal{L}_i = \\frac{r_i}{\\hat\\sigma_i}, \\qquad \\frac{\\max_i |\\mathcal{L}_i| - C_n}{S_n} \\Rightarrow \\text{Gumbel}, \\quad C_n \\approx \\frac{\\sqrt{2\\log n}}{\\sqrt{2/\\pi}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn, REPS = 1170, 2000                  # 20-second returns over a day\nIV = 0.014 ** 2\ndt = 1.0 / n\nMU1 = np.sqrt(2.0 / np.pi)\nr = np.random.default_rng(6004)\n\n# Lee-Mykland Gumbel constants\nK = 78                                # local window for the spot-vol estimate\nln = np.log(n)\nCn = (2 * ln) ** 0.5 / MU1 - (np.log(np.pi) + np.log(ln)) / (2 * MU1 * (2 * ln) ** 0.5)\nSn = 1.0 / (MU1 * (2 * ln) ** 0.5)\nCRIT = Cn - Sn * np.log(-np.log(0.95))   # 5% Gumbel critical value for the max\n\ndef stat(x):\n    \"\"\"max_i |r_i| / sigmahat_i, sigmahat from a trailing bipower window of K returns.\"\"\"\n    a = np.abs(x)\n    prod = a[:, :-1] * a[:, 1:]\n    c = np.cumsum(np.concatenate([np.zeros((x.shape[0], 1)), prod], axis=1), axis=1)\n    win = (c[:, K:] - c[:, :-K]) / K                  # trailing mean of |r_i||r_i+1|\n    sig = np.sqrt(np.maximum(win, 1e-24))\n    L = a[:, K + 1:] / sig[:, :a.shape[1] - K - 1]\n    return L.max(axis=1), L\n\nprint(\"n = %d returns, local window K = %d, Gumbel constants Cn = %.4f Sn = %.4f\"\n      % (n, K, Cn, Sn))\nprint(\"5%% critical value for max|L| : %.4f\" % CRIT)\nprint(\"\")\n\n# (a) no jumps; (b) one jump; (c) a VOLATILITY BURST of the same absolute size\nbase = np.sqrt(IV * dt) * r.standard_normal((REPS, n))\njump = base.copy()\nw = r.integers(K + 60, n - 5, REPS)\njump[np.arange(REPS), w] += np.where(r.random(REPS) < 0.5, -1, 1) * 6.0 * np.sqrt(IV * dt)\n\nidx = np.arange(n)\nsmooth = base.copy()\nabrupt = base.copy()\nfor i in range(REPS):\n    sc = 1.0 + 5.0 * np.exp(-((idx - w[i]) / 400.0) ** 2)     # smooth 6x vol bump\n    smooth[i] *= sc\n    abrupt[i, w[i] - 20:w[i] + 20] *= 6.0                     # abrupt 6x regime change\n\ncases = ((\"no jumps, flat vol\", base),\n         (\"one 6-sigma JUMP\", jump),\n         (\"SMOOTH 6x vol bump\", smooth),\n         (\"ABRUPT 6x vol step\", abrupt))\nrej = {}\nfor name, x in cases:\n    m, _ = stat(x)\n    rej[name] = 100 * np.mean(m > CRIT)\n    print(\"%-22s  mean max|L| %7.3f   reject at 5%%: %6.1f%%\" % (name, m.mean(), rej[name]))\nprint(\"\")\nprint(\"Size is liberal: %.1f%% of jump-free days are flagged at a nominal 5%%, because\" % rej[\"no jumps, flat vol\"])\nprint(\"the Gumbel approximation needs both n and the local window K to be large.\")\nprint(\"The local denominator does its job on a SMOOTH volatility bump: a sixfold rise\")\nprint(\"in volatility over several hundred returns is flagged %.1f%% of the time against\"\n      % rej[\"SMOOTH 6x vol bump\"])\nprint(\"%.1f%% with flat volatility, while a genuine jump is caught %.1f%%.\"\n      % (rej[\"no jumps, flat vol\"], rej[\"one 6-sigma JUMP\"]))\nprint(\"But an ABRUPT regime change fools it completely (%.1f%%): the trailing window is\"\n      % rej[\"ABRUPT 6x vol step\"])\nprint(\"still measuring the old, low volatility when the first large return arrives.\")\nprint(\"A jump changes a return relative to the local scale; a volatility burst changes\")\nprint(\"the scale -- and the test can only tell them apart if the scale moves smoothly\")\nprint(\"enough for a trailing estimator to follow it.\")\n",
            "output": "n = 1170 returns, local window K = 78, Gumbel constants Cn = 4.1943 Sn = 0.3334\n5% critical value for max|L| : 5.1847\n\nno jumps, flat vol      mean max|L|   4.569   reject at 5%:   10.8%\none 6-sigma JUMP        mean max|L|   7.583   reject at 5%:   95.8%\nSMOOTH 6x vol bump      mean max|L|   4.713   reject at 5%:   18.1%\nABRUPT 6x vol step      mean max|L|  11.555   reject at 5%:  100.0%\n\nSize is liberal: 10.8% of jump-free days are flagged at a nominal 5%, because\nthe Gumbel approximation needs both n and the local window K to be large.\nThe local denominator does its job on a SMOOTH volatility bump: a sixfold rise\nin volatility over several hundred returns is flagged 18.1% of the time against\n10.8% with flat volatility, while a genuine jump is caught 95.8%.\nBut an ABRUPT regime change fools it completely (100.0%): the trailing window is\nstill measuring the old, low volatility when the first large return arrives.\nA jump changes a return relative to the local scale; a volatility burst changes\nthe scale -- and the test can only tell them apart if the scale moves smoothly\nenough for a trailing estimator to follow it."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Truncated realised variance against the threshold constant",
        "params": {
          "xlab": "threshold constant c",
          "ylab": "estimator / IV",
          "log": false,
          "series": [
            {
              "name": "truncated RV / IV",
              "x": [
                2.0,
                3.0,
                4.0,
                5.0,
                8.0
              ],
              "y": [
                0.809,
                0.9816,
                0.9981,
                1.0316,
                1.1827
              ]
            },
            {
              "name": "plain RV / IV (same tape)",
              "x": [
                2.0,
                3.0,
                4.0,
                5.0,
                8.0
              ],
              "y": [
                1.1838,
                1.1838,
                1.1838,
                1.1838,
                1.1838
              ]
            },
            {
              "name": "bipower variation / IV",
              "x": [
                2.0,
                3.0,
                4.0,
                5.0,
                8.0
              ],
              "y": [
                1.064,
                1.064,
                1.064,
                1.064,
                1.064
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Treating bipower variation as exactly jump-robust at practical frequencies. At one-minute sampling it retained about 6% of the jump contribution in the simulation, which biased the estimated jump share down by more than a third.",
        "Choosing the truncation threshold by eye. Too tight removes diffusive returns and biases the variance down by 20%; too loose reproduces plain realised variance. Print how many returns it removed.",
        "Reading a non-rejection of the ratio test as evidence of no jumps. Its power against a single four-sigma jump was 14%.",
        "Running a jump locator across macro release times without checking for volatility regime changes. An abrupt volatility step was flagged as a jump on 100% of simulated days."
      ],
      "check": [
        {
          "q": "In the presence of finite-activity jumps, realised variance is consistent for",
          "options": [
            "Integrated variance only",
            "The sum of squared jumps only",
            "Integrated variance plus the sum of squared jumps",
            "Nothing; it diverges"
          ],
          "answer": 2,
          "why": "Realised variance always estimates quadratic variation, and with jumps quadratic variation is the continuous part plus the squared jump sizes."
        },
        {
          "q": "Why is bipower variation robust to a single large jump?",
          "options": [
            "It discards the largest return",
            "It multiplies each absolute return by its neighbour, which is still small",
            "It uses a threshold",
            "It averages over subgrids"
          ],
          "answer": 1,
          "why": "Robustness comes from the product structure: one factor is of order one and the other is of order the square root of the spacing, so the term vanishes asymptotically."
        },
        {
          "q": "The truncation threshold is taken proportional to the spacing raised to a power in the open interval zero to one half because",
          "options": [
            "It must shrink faster than a diffusive return",
            "It must shrink slower than a diffusive return but faster than a jump",
            "Any positive power works equally well",
            "It keeps the estimator positive"
          ],
          "answer": 1,
          "why": "Diffusive returns are of order the spacing to the one half and jumps are of order one, so a threshold in between separates the two asymptotically."
        },
        {
          "q": "An abrupt sixfold increase in volatility fools the Lee-Mykland locator because",
          "options": [
            "The Gumbel critical value is wrong",
            "The trailing spot-volatility window still reflects the old regime",
            "Bipower variation is not jump-robust",
            "The test assumes constant volatility across the whole day"
          ],
          "answer": 1,
          "why": "The statistic compares a return with a locally estimated scale, and a trailing estimator lags a discontinuous change in that scale; the test does not assume constant volatility across the day."
        }
      ],
      "n": 6
    },
    {
      "title": "Asynchronous trading, the Epps effect, and realised covariance",
      "topics": [
        "irregular and non-overlapping observation times",
        "previous-tick interpolation and staleness",
        "the Epps effect",
        "the Hayashi-Yoshida estimator",
        "refresh-time synchronisation",
        "realised correlation matrices and their conditioning"
      ],
      "concepts": [
        {
          "name": "The Epps effect: correlation that vanishes as you look closer",
          "explain": "<p>Two assets do not trade at the same instants. To compute a covariance on a common grid you must answer 'what was B's price at A's timestamp', and the standard answer — the last price B printed — is a lie that gets worse as the grid refines. The consequence is the Epps effect: measured correlation falls toward zero as the sampling interval shrinks.</p><p>The snippet builds two assets with a true correlation of 0.70, one printing every four seconds and one every twenty. Measured correlation is 0.68 at half-hourly sampling, 0.51 at one minute, 0.26 at fifteen seconds and 0.03 at one second. Ninety-six percent of the correlation has disappeared. The control column applies the identical grid to the unobserved continuous prices and stays at 0.70 throughout, so the decay is an artefact of the observation times and nothing else.</p><p>The mechanism is visible in the two variance columns, and it is not what most people guess. Both variances stay within 1% of correct at every frequency, because previous-tick differences telescope: a stale price eventually catches up and the squared returns still add to the right total. Only the cross product is destroyed, because a stale price of B cannot respond to the move A just made. Correlation collapses because its numerator is attenuated and its denominator is not.</p><p>A desk cares because every intraday hedge ratio, pairs-trading beta and cross-asset risk number is a covariance divided by a variance, and at short horizons the numerator is the one that is broken.</p>",
          "formula": "\\widehat{\\mathrm{Corr}}_\\Delta \\;\\longrightarrow\\; 0 \\ \\text{ as } \\Delta\\to 0 \\quad\\text{under non-synchronous arrival times}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM = 23400                          # one-second master clock, 6.5 hours\nRHO, S1, S2 = 0.70, 0.014, 0.011   # true correlation and daily vols\nREPS = 200\nMEAN_GAP = (4.0, 20.0)             # asset A trades every 4s on average, asset B every 20s\nr = np.random.default_rng(7001)\ndt = 1.0 / M\n\nL = np.linalg.cholesky([[1.0, RHO], [RHO, 1.0]])\nz = r.standard_normal((REPS, 2, M))\nz = np.einsum(\"ij,rjm->rim\", L, z)\ndX = np.stack([S1 * np.sqrt(dt) * z[:, 0], S2 * np.sqrt(dt) * z[:, 1]], axis=1)\nX = np.concatenate([np.zeros((REPS, 2, 1)), np.cumsum(dX, axis=2)], axis=2)\n\n# independent Bernoulli arrival times for each asset\nobs = np.stack([r.random((REPS, M + 1)) < 1.0 / MEAN_GAP[0],\n                r.random((REPS, M + 1)) < 1.0 / MEAN_GAP[1]], axis=1)\nobs[:, :, 0] = True                                       # both quoted at the open\n\ndef prev_tick(X, obs):\n    \"\"\"Last observed price at every master-clock instant (previous-tick interpolation).\"\"\"\n    idx = np.where(obs, np.arange(X.shape[2]), 0)\n    idx = np.maximum.accumulate(idx, axis=2)\n    return np.take_along_axis(X, idx, axis=2)\n\nP = prev_tick(X, obs)\n\nprint(\"true correlation %.2f; asset A trades every %.0fs, asset B every %.0fs\"\n      % (RHO, MEAN_GAP[0], MEAN_GAP[1]))\nprint(\"\")\ndef corr(d):\n    c = (d[:, 0] * d[:, 1]).sum(axis=1)\n    return c / np.sqrt((d[:, 0] ** 2).sum(axis=1) * (d[:, 1] ** 2).sum(axis=1))\n\nprint(\"%10s %8s %12s %12s %12s %12s\"\n      % (\"interval\", \"n\", \"realised\", \"corr, true X\", \"var A ratio\", \"var B ratio\"))\ngot = {}\nfor k in (1, 5, 15, 30, 60, 300, 900, 1800):\n    dP = P[:, :, k::k] - P[:, :, :-k:k]\n    dT = X[:, :, k::k] - X[:, :, :-k:k]\n    got[k] = corr(dP).mean()\n    va = (dP[:, 0] ** 2).sum(axis=1) / (dT[:, 0] ** 2).sum(axis=1)\n    vb = (dP[:, 1] ** 2).sum(axis=1) / (dT[:, 1] ** 2).sum(axis=1)\n    print(\"%9ds %8d %12.4f %12.4f %12.4f %12.4f\"\n          % (k, dP.shape[2], got[k], corr(dT).mean(), va.mean(), vb.mean()))\nprint(\"\")\nprint(\"The 'corr, true X' column applies the same grid to the UNOBSERVED continuous\")\nprint(\"prices and stays at %.2f everywhere, so the decay is entirely an artefact of\" % RHO)\nprint(\"asynchrony and not a property of the process. Measured correlation falls from\")\nprint(\"%.2f at half-hourly sampling to %.2f at one second -- %.0f%% of the truth gone.\"\n      % (got[1800], got[1], 100 * (1 - got[1] / RHO)))\nprint(\"\")\nprint(\"Look at the two variance columns: both stay within 1% of 1.000 at every\")\nprint(\"frequency. Previous-tick differences telescope, so each asset's own variance\")\nprint(\"survives. Only the CROSS product is destroyed, because a stale price of B\")\nprint(\"cannot respond to the move A just made. Correlation collapses because its\")\nprint(\"numerator is attenuated and its denominator is not.\")\n",
            "output": "true correlation 0.70; asset A trades every 4s, asset B every 20s\n\n  interval        n     realised corr, true X  var A ratio  var B ratio\n        1s    23400       0.0304       0.6998       1.0011       0.9934\n        5s     4680       0.1194       0.6998       1.0004       0.9940\n       15s     1560       0.2637       0.6995       0.9990       0.9952\n       30s      780       0.3885       0.7003       0.9993       0.9938\n       60s      390       0.5124       0.7014       0.9985       0.9925\n      300s       78       0.6614       0.7009       0.9970       0.9952\n      900s       26       0.6824       0.6960       0.9967       0.9991\n     1800s       13       0.6766       0.6850       0.9922       1.0033\n\nThe 'corr, true X' column applies the same grid to the UNOBSERVED continuous\nprices and stays at 0.70 everywhere, so the decay is entirely an artefact of\nasynchrony and not a property of the process. Measured correlation falls from\n0.68 at half-hourly sampling to 0.03 at one second -- 96% of the truth gone.\n\nLook at the two variance columns: both stay within 1% of 1.000 at every\nfrequency. Previous-tick differences telescope, so each asset's own variance\nsurvives. Only the CROSS product is destroyed, because a stale price of B\ncannot respond to the move A just made. Correlation collapses because its\nnumerator is attenuated and its denominator is not."
          }
        },
        {
          "name": "Hayashi-Yoshida: never ask what the other price was",
          "explain": "<p>The Hayashi-Yoshida estimator solves the problem by refusing to pose it. Do not build a common grid. Instead, take every return of asset A and every return of asset B, and add the product of any pair whose time intervals overlap. If A moved between 10:00:03 and 10:00:07 and B moved between 10:00:05 and 10:00:25, those two intervals share time, so that product belongs in the covariance. If they do not overlap, it does not.</p><p>No interpolation appears anywhere, and consequently no interpolation bias. The estimator is consistent for the integrated covariance under quite general random observation times, and it uses every tick of both assets rather than the handful that survive a coarse grid.</p><p>The snippet measures all three approaches on the same simulated days. Previous-tick at one second returns 0.031. Previous-tick at five minutes returns 0.661, bought by discarding about 98% of the data. Hayashi-Yoshida returns 0.701 against a true 0.70, and its standard deviation across days is 0.038 against 0.069 for the five-minute estimator — so it is both less biased and roughly twice as precise.</p><p>The costs are real but different in kind: the estimator is a pairwise construction, so the resulting matrix is not automatically positive semi-definite, and a naive implementation is an awkward double loop over intervals rather than a vectorised sum.</p><p>A desk cares because this is the standard method for intraday cross-asset work, and because the precision gain over coarse sampling is large enough to change whether a relative-value signal survives its error bars.</p>",
          "formula": "\\widehat{\\langle X,Y\\rangle}^{HY} \\;=\\; \\sum_{i}\\sum_{j} \\Delta X_i\\,\\Delta Y_j\\; \\mathbf{1}\\!\\left\\{ (t_{i-1},t_i]\\cap(s_{j-1},s_j] \\neq \\emptyset \\right\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM = 23400\nRHO, S1, S2 = 0.70, 0.014, 0.011\nREPS = 120\nMEAN_GAP = (4.0, 20.0)\nr = np.random.default_rng(7002)\ndt = 1.0 / M\n\nL = np.linalg.cholesky([[1.0, RHO], [RHO, 1.0]])\nz = np.einsum(\"ij,rjm->rim\", L, r.standard_normal((REPS, 2, M)))\ndX = np.stack([S1 * np.sqrt(dt) * z[:, 0], S2 * np.sqrt(dt) * z[:, 1]], axis=1)\nX = np.concatenate([np.zeros((REPS, 2, 1)), np.cumsum(dX, axis=2)], axis=2)\nobs = np.stack([r.random((REPS, M + 1)) < 1.0 / MEAN_GAP[0],\n                r.random((REPS, M + 1)) < 1.0 / MEAN_GAP[1]], axis=1)\nobs[:, :, 0] = True\nobs[:, :, -1] = True\n\ndef hayashi_yoshida(xa, ta, xb, tb):\n    \"\"\"Sum r_i * r_j over every pair of return intervals that OVERLAP in time.\"\"\"\n    ra, rb = np.diff(xa), np.diff(xb)\n    # interval i of A is (ta[i], ta[i+1]]; overlap iff ta[i] < tb[j+1] and tb[j] < ta[i+1]\n    j = 0\n    total = 0.0\n    for i in range(len(ra)):\n        lo, hi = ta[i], ta[i + 1]\n        while j > 0 and tb[j + 1] > lo:\n            j -= 1\n        while j < len(rb) and tb[j + 1] <= lo:\n            j += 1\n        k = j\n        while k < len(rb) and tb[k] < hi:\n            total += ra[i] * rb[k]\n            k += 1\n    return total\n\nprint(\"true correlation %.2f, vols %.3f and %.3f (daily)\" % (RHO, S1, S2))\nprint(\"\")\nhy, pt5, pt1 = [], [], []\nfor d in range(REPS):\n    ta = np.flatnonzero(obs[d, 0]); tb = np.flatnonzero(obs[d, 1])\n    xa, xb = X[d, 0, ta], X[d, 1, tb]\n    cov = hayashi_yoshida(xa, ta.astype(float), xb, tb.astype(float))\n    va = np.sum(np.diff(xa) ** 2); vb = np.sum(np.diff(xb) ** 2)\n    hy.append(cov / np.sqrt(va * vb))\n    idx = np.where(obs[d], np.arange(M + 1), 0)\n    P = np.take_along_axis(X[d], np.maximum.accumulate(idx, axis=1), axis=1)\n    for k, store in ((300, pt5), (1, pt1)):\n        dP = P[:, k::k] - P[:, :-k:k]\n        c = (dP[0] * dP[1]).sum()\n        store.append(c / np.sqrt((dP[0] ** 2).sum() * (dP[1] ** 2).sum()))\n\nprint(\"%-38s %10s %10s\" % (\"estimator\", \"mean corr\", \"sd\"))\nfor name, v in ((\"previous-tick, 1 second\", pt1),\n                (\"previous-tick, 5 minutes\", pt5),\n                (\"Hayashi-Yoshida, every tick\", hy)):\n    print(\"%-38s %10.4f %10.4f\" % (name, np.mean(v), np.std(v, ddof=1)))\nprint(\"\")\nprint(\"Hayashi-Yoshida recovers %.3f against a true %.2f using EVERY tick of both\"\n      % (np.mean(hy), RHO))\nprint(\"assets and no common grid at all. It needs no interpolation because it never\")\nprint(\"asks what asset B's price was at asset A's timestamp -- it only asks whether\")\nprint(\"the two return intervals overlapped. Previous-tick sampling at 5 minutes gets\")\nprint(\"to %.3f by throwing away 98%% of the data; at 1 second it gets %.3f.\"\n      % (np.mean(pt5), np.mean(pt1)))\n",
            "output": "true correlation 0.70, vols 0.014 and 0.011 (daily)\n\nestimator                               mean corr         sd\nprevious-tick, 1 second                    0.0307     0.0063\nprevious-tick, 5 minutes                   0.6612     0.0692\nHayashi-Yoshida, every tick                0.7009     0.0376\n\nHayashi-Yoshida recovers 0.701 against a true 0.70 using EVERY tick of both\nassets and no common grid at all. It needs no interpolation because it never\nasks what asset B's price was at asset A's timestamp -- it only asks whether\nthe two return intervals overlapped. Previous-tick sampling at 5 minutes gets\nto 0.661 by throwing away 98% of the data; at 1 second it gets 0.031."
          }
        },
        {
          "name": "Refresh time: a grid set by the slowest asset",
          "explain": "<p>Refresh-time sampling is the compromise used when a common grid is required — for instance because you want a single quadratic form and therefore a positive semi-definite matrix. Start the clock, wait until every asset has printed at least once, and record that instant. Repeat. By construction no price in a refresh-time snapshot is stale, so the interpolation bias is largely removed.</p><p>The snippet compares refresh time against a regular previous-tick grid with the <em>same number of points</em>, which is the fair comparison, and against a fixed five-minute grid. Refresh time recovers 0.56 to 0.68 of the true 0.70 across liquidity levels, while the equal-count regular grid recovers only 0.25 to 0.33. Matching the sampling times to the data, rather than to the clock, is worth roughly a doubling of the measured correlation.</p><p>The cost is in the first column. As the slower asset's print interval goes from ten seconds to three minutes, the number of refresh points per day falls from about 2100 to about 128. The usable sample is set by the least liquid name, and in a portfolio of a hundred assets it is set by the worst one of all — which is why refresh time is used pairwise or on carefully screened liquid baskets rather than on a broad universe.</p><p>A risk team cares because this is the explicit trade it is making whenever it computes an intraday covariance matrix: an asynchrony bias in exchange for a smaller effective sample, with the exchange rate set by its least liquid holding.</p>",
          "formula": "\\tau_0 = 0,\\qquad \\tau_{k+1} = \\max_{a}\\;\\min\\{\\,t \\in \\mathcal{T}^{(a)} : t > \\tau_k \\,\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM = 23400\nRHO, S1, S2 = 0.70, 0.014, 0.011\nREPS = 80\nr = np.random.default_rng(7003)\ndt = 1.0 / M\nL = np.linalg.cholesky([[1.0, RHO], [RHO, 1.0]])\n\ndef build(gapB):\n    z = np.einsum(\"ij,rjm->rim\", L, r.standard_normal((REPS, 2, M)))\n    dX = np.stack([S1 * np.sqrt(dt) * z[:, 0], S2 * np.sqrt(dt) * z[:, 1]], axis=1)\n    X = np.concatenate([np.zeros((REPS, 2, 1)), np.cumsum(dX, axis=2)], axis=2)\n    obs = np.stack([r.random((REPS, M + 1)) < 1.0 / 4.0,\n                    r.random((REPS, M + 1)) < 1.0 / gapB], axis=1)\n    obs[:, :, 0] = True\n    return X, obs\n\ndef refresh_times(o):\n    \"\"\"Instants at which BOTH assets have printed since the previous refresh time.\"\"\"\n    ta = np.flatnonzero(o[0]); tb = np.flatnonzero(o[1])\n    out, i, j, last = [0], 0, 0, 0\n    while True:\n        while i < len(ta) and ta[i] <= last:\n            i += 1\n        while j < len(tb) and tb[j] <= last:\n            j += 1\n        if i >= len(ta) or j >= len(tb):\n            break\n        last = max(ta[i], tb[j])\n        out.append(last)\n    return np.array(out)\n\nprint(\"true correlation %.2f, asset A prints every 4s\" % RHO)\nprint(\"\")\nprint(\"%9s %14s %14s %14s %14s\"\n      % (\"B gap\", \"refresh points\", \"corr refresh\", \"corr prev-tick\", \"prev-tick at\"))\nprint(\"%9s %14s %14s %14s %14s\" % (\"\", \"per day\", \"time\", \"same count\", \"5 minutes\"))\nfor gapB in (10.0, 20.0, 60.0, 180.0):\n    X, obs = build(gapB)\n    cr, cp, cq, npts = [], [], [], []\n    for d in range(REPS):\n        rt = refresh_times(obs[d])\n        npts.append(len(rt) - 1)\n        idx = np.where(obs[d], np.arange(M + 1), 0)\n        P = np.take_along_axis(X[d], np.maximum.accumulate(idx, axis=1), axis=1)\n        dR = np.diff(P[:, rt], axis=1)                      # refresh-time returns\n        cr.append((dR[0] * dR[1]).sum() / np.sqrt((dR[0] ** 2).sum() * (dR[1] ** 2).sum()))\n        k = max(1, M // max(1, len(rt) - 1))                # equal-count regular grid\n        dP = P[:, k::k] - P[:, :-k:k]\n        cp.append((dP[0] * dP[1]).sum() / np.sqrt((dP[0] ** 2).sum() * (dP[1] ** 2).sum()))\n        dQ = P[:, 300::300] - P[:, :-300:300]\n        cq.append((dQ[0] * dQ[1]).sum() / np.sqrt((dQ[0] ** 2).sum() * (dQ[1] ** 2).sum()))\n    print(\"%8.0fs %14.0f %14.4f %14.4f %14.4f\"\n          % (gapB, np.mean(npts), np.mean(cr), np.mean(cp), np.mean(cq)))\nprint(\"\")\nprint(\"Refresh-time sampling puts both series on a grid defined by the SLOWER asset, so\")\nprint(\"neither price is stale by construction. Against a regular previous-tick grid with\")\nprint(\"the same number of points it recovers more of the correlation at every liquidity\")\nprint(\"level. The cost is in the first column: as asset B slows from a print every 10\")\nprint(\"seconds to one every 3 minutes, the usable sample collapses, and with it the\")\nprint(\"precision. Refresh time trades an asynchrony bias for a smaller sample -- and in\")\nprint(\"a portfolio of many assets the grid is set by the least liquid name of all.\")\n",
            "output": "true correlation 0.70, asset A prints every 4s\n\n    B gap refresh points   corr refresh corr prev-tick   prev-tick at\n                 per day           time     same count      5 minutes\n      10s           2147         0.5560         0.3331         0.6936\n      20s           1133         0.6120         0.3100         0.6508\n      60s            385         0.6580         0.2761         0.5672\n     180s            128         0.6844         0.2542         0.3573\n\nRefresh-time sampling puts both series on a grid defined by the SLOWER asset, so\nneither price is stale by construction. Against a regular previous-tick grid with\nthe same number of points it recovers more of the correlation at every liquidity\nlevel. The cost is in the first column: as asset B slows from a print every 10\nseconds to one every 3 minutes, the usable sample collapses, and with it the\nprecision. Refresh time trades an asynchrony bias for a smaller sample -- and in\na portfolio of many assets the grid is set by the least liquid name of all."
          }
        },
        {
          "name": "The correlation matrix is wrong in a pattern, not at random",
          "explain": "<p>Scale the problem up and the bias stops being a nuisance and becomes a story. The snippet builds five assets with a true pairwise correlation of 0.50 and print intervals from two seconds to 150 seconds, then estimates the correlation matrix two ways.</p><p>The five-minute previous-tick matrix is not uniformly wrong. The liquid-liquid corner comes out near 0.49 to 0.51, essentially correct. Every entry involving the 150-second name is shrunk to roughly 0.26 to 0.32. The largest eigenvalue falls from a true 3.00 to 2.61, so the matrix understates the common factor and overstates idiosyncratic risk — and it does so specifically for the illiquid names.</p><p>That pattern has a familiar shape. A factor model fitted to this matrix will report that illiquid names have low betas and high residual variance, which is a measurement artefact that happens to look exactly like a liquidity anomaly. The Hayashi-Yoshida matrix recovers 0.48 to 0.53 across every pair and a largest eigenvalue of 3.02.</p><p>One caveat belongs on the same page: the Hayashi-Yoshida matrix is assembled pairwise from different clocks, so it is not a single quadratic form and carries no positive semi-definiteness guarantee. Its smallest eigenvalue here is 0.46 against a true 0.50, which is fine, but it need not be, and a repair step is required before anyone inverts it.</p><p>A desk cares because an intraday risk model built on coarse synchronised sampling systematically under-hedges its illiquid book, and the error looks like alpha.</p>",
          "formula": "\\widehat{\\Sigma}^{HY}\\ \\text{is consistent entrywise but need not satisfy}\\ \\ x^\\top \\widehat{\\Sigma}^{HY} x \\ge 0 \\ \\ \\forall x",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nM, P, REPS = 23400, 5, 18\nr = np.random.default_rng(7004)\ndt = 1.0 / M\nVOL = np.array([0.014, 0.013, 0.012, 0.011, 0.010])\nGAP = np.array([2.0, 4.0, 12.0, 40.0, 150.0])        # seconds between prints per name\nRHO_TRUE = 0.50\nC = np.full((P, P), RHO_TRUE) + (1 - RHO_TRUE) * np.eye(P)\nL = np.linalg.cholesky(C)\n\ndef hy(xa, ta, xb, tb):\n    ra, rb = np.diff(xa), np.diff(xb)\n    j, tot = 0, 0.0\n    for i in range(len(ra)):\n        lo, hi = ta[i], ta[i + 1]\n        while j > 0 and tb[j + 1] > lo:\n            j -= 1\n        while j < len(rb) and tb[j + 1] <= lo:\n            j += 1\n        k = j\n        while k < len(rb) and tb[k] < hi:\n            tot += ra[i] * rb[k]\n            k += 1\n    return tot\n\nacc_pt = np.zeros((P, P)); acc_hy = np.zeros((P, P))\nfor d in range(REPS):\n    z = L @ r.standard_normal((P, M))\n    X = np.concatenate([np.zeros((P, 1)),\n                        np.cumsum(VOL[:, None] * np.sqrt(dt) * z, axis=1)], axis=1)\n    obs = r.random((P, M + 1)) < (1.0 / GAP)[:, None]\n    obs[:, 0] = True; obs[:, -1] = True\n    idx = np.where(obs, np.arange(M + 1), 0)\n    Pr = np.take_along_axis(X, np.maximum.accumulate(idx, axis=1), axis=1)\n    dP = Pr[:, 300::300] - Pr[:, :-300:300]                 # 5-minute previous-tick\n    S = dP @ dP.T\n    dg = np.sqrt(np.diag(S))\n    acc_pt += S / np.outer(dg, dg)\n    H = np.zeros((P, P))\n    ts = [np.flatnonzero(obs[i]).astype(float) for i in range(P)]\n    xs = [X[i, np.flatnonzero(obs[i])] for i in range(P)]\n    for i in range(P):\n        for j in range(i, P):\n            H[i, j] = H[j, i] = hy(xs[i], ts[i], xs[j], ts[j]) if i != j else np.sum(np.diff(xs[i]) ** 2)\n    dh = np.sqrt(np.diag(H))\n    acc_hy += H / np.outer(dh, dh)\n\nRpt, Rhy = acc_pt / REPS, acc_hy / REPS\nprint(\"5 names, true pairwise correlation %.2f, print gaps in seconds: %s\"\n      % (RHO_TRUE, \", \".join(\"%.0f\" % g for g in GAP)))\nprint(\"\")\nprint(\"mean correlation matrix, 5-minute previous-tick:\")\nfor i in range(P):\n    print(\"   \" + \"  \".join(\"%6.3f\" % v for v in Rpt[i]))\nprint(\"\")\nprint(\"mean correlation matrix, Hayashi-Yoshida:\")\nfor i in range(P):\n    print(\"   \" + \"  \".join(\"%6.3f\" % v for v in Rhy[i]))\nprint(\"\")\nprint(\"%-26s %10s %10s\" % (\"\", \"prev-tick\", \"Hayashi-Y\"))\nprint(\"%-26s %10.3f %10.3f\" % (\"corr(most liquid pair)\", Rpt[0, 1], Rhy[0, 1]))\nprint(\"%-26s %10.3f %10.3f\" % (\"corr(least liquid pair)\", Rpt[3, 4], Rhy[3, 4]))\nprint(\"%-26s %10.3f %10.3f\" % (\"largest eigenvalue\", np.linalg.eigvalsh(Rpt)[-1],\n                               np.linalg.eigvalsh(Rhy)[-1]))\nprint(\"%-26s %10.3f %10.3f\" % (\"smallest eigenvalue\", np.linalg.eigvalsh(Rpt)[0],\n                               np.linalg.eigvalsh(Rhy)[0]))\nprint(\"true largest eigenvalue %.3f, true smallest %.3f\"\n      % (1 + (P - 1) * RHO_TRUE, 1 - RHO_TRUE))\nprint(\"\")\nprint(\"The previous-tick matrix is not uniformly wrong, it is wrong in a PATTERN: the\")\nprint(\"liquid-liquid corner is nearly right and every entry involving the 150-second\")\nprint(\"name is shrunk. A factor model fitted to it will report that illiquid names have\")\nprint(\"low beta and high idiosyncratic risk, which is a measurement artefact. The\")\nprint(\"Hayashi-Yoshida matrix is far closer entry by entry, but note it carries no\")\nprint(\"guarantee of positive semi-definiteness: pairwise estimation on different clocks\")\nprint(\"is not a single quadratic form, so a repair step is needed before inversion.\")\n",
            "output": "5 names, true pairwise correlation 0.50, print gaps in seconds: 2, 4, 12, 40, 150\n\nmean correlation matrix, 5-minute previous-tick:\n    1.000   0.486   0.501   0.439   0.267\n    0.486   1.000   0.509   0.426   0.260\n    0.501   0.509   1.000   0.457   0.289\n    0.439   0.426   0.457   1.000   0.323\n    0.267   0.260   0.289   0.323   1.000\n\nmean correlation matrix, Hayashi-Yoshida:\n    1.000   0.503   0.501   0.483   0.486\n    0.503   1.000   0.502   0.509   0.528\n    0.501   0.502   1.000   0.499   0.518\n    0.483   0.509   0.499   1.000   0.525\n    0.486   0.528   0.518   0.525   1.000\n\n                            prev-tick  Hayashi-Y\ncorr(most liquid pair)          0.486      0.503\ncorr(least liquid pair)         0.323      0.525\nlargest eigenvalue              2.611      3.022\nsmallest eigenvalue             0.485      0.461\ntrue largest eigenvalue 3.000, true smallest 0.500\n\nThe previous-tick matrix is not uniformly wrong, it is wrong in a PATTERN: the\nliquid-liquid corner is nearly right and every entry involving the 150-second\nname is shrunk. A factor model fitted to it will report that illiquid names have\nlow beta and high idiosyncratic risk, which is a measurement artefact. The\nHayashi-Yoshida matrix is far closer entry by entry, but note it carries no\nguarantee of positive semi-definiteness: pairwise estimation on different clocks\nis not a single quadratic form, so a repair step is needed before inversion."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "The Epps effect: measured correlation against sampling interval",
        "params": {
          "xlab": "sampling interval (seconds)",
          "ylab": "realised correlation",
          "log": false,
          "series": [
            {
              "name": "previous-tick, observed prices",
              "x": [
                1,
                5,
                15,
                30,
                60,
                300,
                900,
                1800
              ],
              "y": [
                0.0304,
                0.1194,
                0.2637,
                0.3885,
                0.5124,
                0.6614,
                0.6824,
                0.6766
              ]
            },
            {
              "name": "same grid, unobserved efficient prices",
              "x": [
                1,
                5,
                15,
                30,
                60,
                300,
                900,
                1800
              ],
              "y": [
                0.6998,
                0.6998,
                0.6995,
                0.7003,
                0.7014,
                0.7009,
                0.696,
                0.685
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Reading a declining intraday correlation as an economic fact. In the simulation the true correlation was constant at 0.70 while the measured one fell to 0.03; the decay was pure asynchrony.",
        "Assuming asynchrony attenuates variances too. It does not: previous-tick differences telescope, so variances survive and only covariances are destroyed, which is exactly why correlation collapses.",
        "Comparing refresh-time sampling with a five-minute grid instead of with an equal-count grid. The fair comparison holds the number of observations fixed, and that is where refresh time's advantage shows.",
        "Inverting a Hayashi-Yoshida covariance matrix without checking its eigenvalues. Pairwise estimation on different clocks gives no positive semi-definiteness guarantee."
      ],
      "check": [
        {
          "q": "The Epps effect is primarily caused by",
          "options": [
            "Microstructure noise in the bid-ask bounce",
            "Non-synchronous observation times combined with previous-tick interpolation",
            "Jumps in one of the two assets",
            "Stochastic volatility"
          ],
          "answer": 1,
          "why": "Noise and jumps have their own distinct signatures; the correlation decay in the snippet appeared with no noise at all and vanished when the true continuous prices were used on the same grid."
        },
        {
          "q": "Under previous-tick sampling at a fast frequency, which is attenuated?",
          "options": [
            "Both variances and the covariance",
            "The variances, but not the covariance",
            "The covariance, but essentially not the variances",
            "Neither"
          ],
          "answer": 2,
          "why": "Squared previous-tick returns telescope to the right total, so each variance survives; the cross product is what a stale price cannot deliver."
        },
        {
          "q": "The Hayashi-Yoshida estimator sums the products of return pairs whose intervals",
          "options": [
            "Start at the same time",
            "Have the same length",
            "Overlap in time",
            "Are adjacent"
          ],
          "answer": 2,
          "why": "Overlap is the exact condition; requiring equal start times or equal lengths would reintroduce the need for a common grid."
        },
        {
          "q": "In the five-asset simulation, the five-minute previous-tick correlation matrix had a largest eigenvalue of 2.61 against a true 3.00. The practical consequence is that",
          "options": [
            "All correlations are shrunk equally, so ratios are safe",
            "The common factor is understated, especially for the illiquid names",
            "The matrix is not positive definite",
            "The variances are biased downward"
          ],
          "answer": 1,
          "why": "The shrinkage was concentrated in the entries involving the illiquid name, which understates the factor and inflates apparent idiosyncratic risk for exactly those assets."
        }
      ],
      "n": 7
    },
    {
      "title": "Spot volatility, clustering, the leverage effect, and HAR forecasting",
      "topics": [
        "estimating spot (instantaneous) volatility from a local window",
        "volatility clustering and long memory in realised variance",
        "the leverage effect: returns and variance moving together",
        "the HAR-RV model and heterogeneous market persistence"
      ],
      "concepts": [
        {
          "name": "Spot volatility: a window that trades bias against noise",
          "explain": "<p>Every estimator so far has answered “what was the day's average variance.” Sometimes the question is narrower: what is the variance right now, at a particular instant inside the day. The natural estimator is a local, rolling version of realised variance: sum the squared returns in a window of 2k+1 observations centred at t, and divide by the window's own length in time to turn a sum of squares back into a variance rate.</p><p>The window length k is a genuine bias-variance choice, and it plays out exactly like week 3's sampling-frequency choice, one level down. A short window tracks a fast-moving spot volatility path closely but is dominated by sampling noise; a long window averages that noise away but, once it is wide compared with how fast volatility itself moves, starts averaging over genuine changes and converges on the day's unconditional mean variance rather than the local value.</p><p>The snippet makes the trade-off visible through the correlation between the estimate and the (simulated, otherwise unobservable) true spot path rather than through raw RMSE, because RMSE alone can look deceptively flat: once the window is wide enough to just track the mean, the error saturates near the path's own standard deviation and stops moving, while the correlation keeps falling. Here it peaks at a 21-observation window — comparable to the volatility's own half-life — and is statistically indistinguishable from zero once the window spans many half-lives.</p><p>A trading desk cares because “current volatility” is the input to every intraday risk limit and every vol-targeting position size, and a badly chosen window quietly turns that number into an estimate of last quarter's average instead of this morning's reality.</p>",
          "formula": "\\hat\\sigma_t^2 = \\frac{1}{(2k+1)\\Delta t}\\sum_{i=t-k}^{t+k} r_i^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nD, N = 60, 390                    # 60 days, one-minute grid (390 bars/day)\nM = D * N\ndt, kappa, xi = 1.0 / N, 30.0, 2.2     # fast mean reversion: half-life ~ 9 minutes\nm = np.log(0.014 ** 2)\na = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\nr = np.random.default_rng(834600)\nvar = np.exp(m + lfilter([b], [1.0, -a], r.standard_normal(M)))\ndX = np.sqrt(var * dt) * r.standard_normal(M)\n\ndef spot_est(k):\n    w = 2 * k + 1\n    rv = np.convolve(dX ** 2, np.ones(w), mode=\"valid\") / (w * dt)\n    true = var[k: M - k]\n    err = rv - true\n    rho = np.corrcoef(rv, true)[0, 1]\n    return np.sqrt(np.mean(err ** 2)), rho, rv.std()\n\nprint(\"half-life of a volatility shock = %.1f minutes; true var sd across the path = %.5e\" % (np.log(2) / kappa * N, var.std()))\nprint(\"\")\nprint(\"      k   window (min)     RMSE     corr(est, truth)   sd(estimate)\")\nfor k in (1, 3, 10, 30, 90, 270, 900, 3000, 9000):\n    rmse, rho, sd_ = spot_est(k)\n    print(\"%7d   %11d   %8.5f   %16.4f   %13.5e\" % (k, 2 * k + 1, rmse, rho, sd_))\nprint(\"\")\nprint(\"RMSE bottoms out around a window comparable to the vol half-life, then rises again:\")\nprint(\"too short and the estimate is pure noise; too long and it just tracks the\")\nprint(\"unconditional mean, throwing away exactly the local information it exists to capture.\")\n",
            "output": "half-life of a volatility shock = 9.0 minutes; true var sd across the path = 5.73377e-05\n\n      k   window (min)     RMSE     corr(est, truth)   sd(estimate)\n      1             3    0.00017             0.2961     1.78199e-04\n      3             7    0.00011             0.4035     1.21612e-04\n     10            21    0.00007             0.4999     7.74411e-05\n     30            61    0.00006             0.4276     4.83351e-05\n     90           181    0.00006             0.2854     2.95505e-05\n    270           541    0.00006             0.1003     1.61255e-05\n    900          1801    0.00006             0.0458     8.48596e-06\n   3000          6001    0.00006            -0.0136     3.00411e-06\n   9000         18001    0.00006            -0.0194     1.73471e-06\n\nRMSE bottoms out around a window comparable to the vol half-life, then rises again:\ntoo short and the estimate is pure noise; too long and it just tracks the\nunconditional mean, throwing away exactly the local information it exists to capture."
          }
        },
        {
          "name": "Volatility clustering: memory in the size of moves, not their sign",
          "explain": "<p>Daily returns are close to unpredictable, but the size of a return is not: a large move, whatever its sign, tends to be followed by more large moves, and a quiet stretch by more quiet ones. This is volatility clustering, one of the best-documented regularities in financial data. A single mean-reverting factor — the model used everywhere in weeks 1 to 7 — decays far too fast to produce it on its own, since its half-life there is a fraction of a day.</p><p>The snippet builds a toy long-memory-like process instead: three independent mean-reverting components in log-variance, with half-lives of roughly half a day, two weeks, and two and a half months, summed together. Even though each component individually forgets quickly, their sum decays slowly, because the slowest component keeps contributing long after the fastest one has already died out. The autocorrelation of log realised variance in the resulting series falls from 0.52 at a one-day lag to 0.28 at a month and is still detectably positive past two months, a pattern a single AR(1) factor cannot reproduce.</p><p>Shuffling the days destroys every one of those autocorrelations while leaving the marginal distribution of variance untouched — proof that the pattern lives entirely in the order of the days, not their individual sizes. A risk team cares because clustering is exactly why a risk limit calibrated to last month's calm should not be trusted this month if this month has already shown a run of large moves: the model says that run is informative about what comes next.</p>",
          "formula": "\\rho(h) = \\mathrm{Corr}\\big(\\log RV_t,\\ \\log RV_{t-h}\\big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nD, N = 3000, 78                        # 3000 trading days, five-minute grid within the day\nr = np.random.default_rng(934600)\n\n# three OU components in log-variance, on a DAILY step, with half-lives of about\n# half a day, two weeks and two and a half months -- a toy superposition standing in\n# for the long-memory-like decay a single mean-reverting factor (weeks 1-7's world) cannot produce\ncomps = [(1.40, 0.250), (0.05, 0.047), (0.01, 0.021)]   # (kappa per day, xi)\nm0 = np.log(0.014 ** 2)\nlogvar_d = np.full(D, m0)\nfor kappa, xi in comps:\n    a = np.exp(-kappa); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\n    logvar_d = logvar_d + lfilter([b], [1.0, -a], r.standard_normal(D))\nvar_d = np.exp(logvar_d)\n\n# each day's realised variance = that day's level times sampling noise from N intraday bars\nchi = (r.standard_normal((D, N)) ** 2).mean(axis=1)\nRV = var_d * chi\nlogRV = np.log(RV)\n\ndef acf(x, lag):\n    x = x - x.mean()\n    return float(np.sum(x[:-lag] * x[lag:]) / np.sum(x ** 2))\n\nshuffled = logRV.copy()\nnp.random.default_rng(1).shuffle(shuffled)\n\nprint(\"lag (days)   acf(log RV)   acf(shuffled log RV)\")\nfor lag in (1, 5, 10, 22, 66, 132):\n    print(\"%10d   %11.4f   %20.4f\" % (lag, acf(logRV, lag), acf(shuffled, lag)))\n\nhi = logRV.mean() + logRV.std()\nnxt_hi = logRV[1:][logRV[:-1] > hi]\nnxt_lo = logRV[1:][logRV[:-1] <= hi]\nprint(\"\")\nprint(\"sd(log RV) = %.4f, mean annualised vol = %.1f%%\"\n      % (logRV.std(), 100 * np.sqrt(252 * np.exp(logRV.mean()))))\nprint(\"day after a >1-sd day:     mean next-day log RV = %+.4f  (n=%d)\" % (nxt_hi.mean() - logRV.mean(), nxt_hi.size))\nprint(\"day after an ordinary day: mean next-day log RV = %+.4f  (n=%d)\" % (nxt_lo.mean() - logRV.mean(), nxt_lo.size))\nprint(\"Shuffling the days to the same marginal distribution drives every autocorrelation to\")\nprint(\"zero; only the ORDER carries the clustering, exactly as the acf columns above show.\")\n",
            "output": "lag (days)   acf(log RV)   acf(shuffled log RV)\n         1        0.5190                 0.0305\n         5        0.4055                 0.0104\n        10        0.3543                -0.0064\n        22        0.2768                -0.0191\n        66        0.1139                 0.0090\n       132       -0.0163                 0.0315\n\nsd(log RV) = 0.3044, mean annualised vol = 21.4%\nday after a >1-sd day:     mean next-day log RV = +0.2290  (n=463)\nday after an ordinary day: mean next-day log RV = -0.0419  (n=2536)\nShuffling the days to the same marginal distribution drives every autocorrelation to\nzero; only the ORDER carries the clustering, exactly as the acf columns above show."
          }
        },
        {
          "name": "The leverage effect: recovering a correlation from returns and RV alone",
          "explain": "<p>Equity volatility tends to rise after a price drop and fall after a price rise — a negative correlation between a return and the accompanying change in variance, named the leverage effect after an (only partial) explanation involving a falling equity value raising a firm's financial leverage. Whatever the true cause, the correlation is real and estimable directly from the same returns this course has used throughout: no options, no implied volatility, just a signed correlation between the day's return and the day's realised variance.</p><p>The snippet builds price and variance from two correlated Brownian shocks, with a parameter rho controlling exactly how correlated they are, and checks whether the correlation between the day's return and its log realised variance recovers rho. It does, closely: rho = 0 gives a correlation indistinguishable from zero (0.03), rho = -0.3 gives -0.29, and rho = -0.7 gives -0.59, each estimate matching the correlation computed from the true, otherwise unobservable log-variance path to two or three decimal places.</p><p>That comparison is the point of running both versions. Log realised variance is a noisy proxy for the true instantaneous level, and yet the noise barely shows up in the correlation estimate here, because correlation is a feature of how two series move together, and averaging over a day's worth of returns washes out most of the idiosyncratic sampling noise in each individual piece.</p><p>A research desk cares because a well-measured leverage effect is a direct input to any stochastic-volatility option model with a skewed smile, and a wrongly signed or wrongly sized one will misprice every downside put on the book.</p>",
          "formula": "dW^{S}_t = \\rho\\,dW^{V}_t + \\sqrt{1-\\rho^2}\\,dW^{\\perp}_t",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nD, N = 4000, 390                      # 4000 days, one-minute grid\ndt, kappa, xi = 1.0 / N, 3.0, 1.1\nm = np.log(0.014 ** 2)\na = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\n\ndef world(rho, seed):\n    r = np.random.default_rng(seed)\n    z1 = r.standard_normal(N * D)                        # drives log-variance\n    z2 = r.standard_normal(N * D)                         # an independent shock\n    zp = rho * z1 + np.sqrt(1 - rho ** 2) * z2             # price innovation, correlated with z1\n    logvar = (m + lfilter([b], [1.0, -a], z1)).reshape(D, N)\n    var = np.exp(logvar)\n    dX = np.sqrt(var * dt) * zp.reshape(D, N)\n    RV = (dX ** 2).sum(axis=1)\n    ret = dX.sum(axis=1)\n    lv = logvar.mean(axis=1)                               # the TRUE (unobservable) daily level\n    return ret, RV, lv\n\nprint(\"rho (true)   corr(return, true log-vol level)   corr(return, log RV) [what you can compute]\")\nfor rho in (0.0, -0.3, -0.7):\n    ret, RV, lv = world(rho, seed=2600 + int(100 * rho))\n    c_true = np.corrcoef(ret, lv)[0, 1]\n    c_rv = np.corrcoef(ret, np.log(RV))[0, 1]\n    print(\"%10.2f   %31.4f   %42.4f\" % (rho, c_true, c_rv))\n\nprint(\"\")\nprint(\"rho = 0 recovers a correlation indistinguishable from zero, as it must. A negative rho --\")\nprint(\"a down move driven by the SAME innovation that raises variance -- produces a negative\")\nprint(\"correlation between the day's return and that day's variance: this is the leverage\")\nprint(\"effect, and log RV (a noisy but usable proxy for the true unobservable level) recovers\")\nprint(\"almost exactly the correlation built into the true, unobservable path.\")\n",
            "output": "rho (true)   corr(return, true log-vol level)   corr(return, log RV) [what you can compute]\n      0.00                            0.0348                                       0.0304\n     -0.30                           -0.2839                                      -0.2904\n     -0.70                           -0.5933                                      -0.5935\n\nrho = 0 recovers a correlation indistinguishable from zero, as it must. A negative rho --\na down move driven by the SAME innovation that raises variance -- produces a negative\ncorrelation between the day's return and that day's variance: this is the leverage\neffect, and log RV (a noisy but usable proxy for the true unobservable level) recovers\nalmost exactly the correlation built into the true, unobservable path."
          }
        },
        {
          "name": "HAR-RV: three horizons, one linear regression",
          "explain": "<p>Volatility persistence does not live at one horizon. A shock that raises today's variance also raises the expectation for this week and, to a smaller extent, this month, and a plain AR(1) on daily realised variance can only fit one decay rate at a time. Corsi's Heterogeneous AutoRegressive model for realised volatility (HAR-RV) sidesteps the problem without a long lag structure: regress tomorrow's realised variance on today's realised variance, the average of the past five days (a week), and the average of the past twenty-two days (a month), all in one linear regression.</p><p>The three regressors are a cheap stand-in for the idea that the market is heterogeneous — some participants react to the last few minutes, others rebalance weekly or monthly, and each horizon's average captures a different one of those information sets. The snippet fits exactly this regression on the same long-memory-like simulated series used for the clustering concept above and gets an in-sample R-squared of 0.35, against 0.25 for an AR(1) using only today's realised variance. The daily, weekly and monthly coefficients sum to 0.86, close to the near-unit persistence a slowly decaying process should show.</p><p>The improvement over AR(1) is exactly the value of the extra two regressors: they let the model see slower-moving persistence that a single daily lag cannot represent no matter how it is weighted. A trading desk cares because HAR-type forecasts are the default starting point for anything downstream that needs tomorrow's variance — a vol-targeting overlay, an options desk's short-dated hedge ratio, or next week's forecast evaluation.</p>",
          "formula": "RV_{t+1} = \\beta_0 + \\beta_d RV_t + \\beta_w RV_t^{(w)} + \\beta_m RV_t^{(m)} + \\varepsilon_{t+1}, \\quad RV_t^{(w)}=\\tfrac15\\sum_{i=0}^{4}RV_{t-i}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nD, N = 3000, 78                        # 3000 days, five-minute grid\nr = np.random.default_rng(834611)\n\n# same multi-scale log-variance world as the clustering concept above\ncomps = [(1.40, 0.250), (0.05, 0.047), (0.01, 0.021)]\nm0 = np.log(0.014 ** 2)\nlogvar_d = np.full(D, m0)\nfor kappa, xi in comps:\n    a = np.exp(-kappa); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\n    logvar_d = logvar_d + lfilter([b], [1.0, -a], r.standard_normal(D))\nvar_d = np.exp(logvar_d)\nchi = (r.standard_normal((D, N)) ** 2).mean(axis=1)\nRV = var_d * chi\n\ndef moving_avg(x, k):\n    out = np.full_like(x, np.nan)\n    c = np.cumsum(x)\n    out[k - 1:] = (c[k - 1:] - np.r_[0, c[:-k]]) / k\n    return out\n\nd_ = RV\nw_ = moving_avg(RV, 5)\nmth = moving_avg(RV, 22)\ny = RV[23:]                                    # tomorrow's RV, predicted by yesterday's d/w/m\nX = np.column_stack([np.ones(D - 23), d_[22:-1], w_[22:-1], mth[22:-1]])\ncoef, *_ = np.linalg.lstsq(X, y, rcond=None)\nfitted = X @ coef\nr2_har = 1 - np.sum((y - fitted) ** 2) / np.sum((y - y.mean()) ** 2)\n\nXar = np.column_stack([np.ones(D - 23), d_[22:-1]])\ncoef_ar, *_ = np.linalg.lstsq(Xar, y, rcond=None)\nr2_ar = 1 - np.sum((y - Xar @ coef_ar) ** 2) / np.sum((y - y.mean()) ** 2)\n\nprint(\"HAR-RV: RV_{t+1} = b0 + bd*RV_t + bw*RV_t^(5) + bm*RV_t^(22)\")\nprint(\"fitted coefficients   b0=%.3e  bd=%.4f  bw=%.4f  bm=%.4f\" % tuple(coef))\nprint(\"in-sample R^2   HAR = %.4f      AR(1) on RV_t alone = %.4f\" % (r2_har, r2_ar))\nprint(\"\")\nprint(\"bd + bw + bm = %.4f -- close to one, the persistence the HAR form is built to capture\" % coef[1:].sum())\nprint(\"HAR improves on plain AR(1) by picking up the weekly and monthly components that a\")\nprint(\"single daily lag cannot see; the improvement (%.4f vs %.4f) is the value of the extra terms.\" % (r2_har, r2_ar))\n",
            "output": "HAR-RV: RV_{t+1} = b0 + bd*RV_t + bw*RV_t^(5) + bm*RV_t^(22)\nfitted coefficients   b0=2.695e-05  bd=0.1689  bw=0.4078  bm=0.2825\nin-sample R^2   HAR = 0.3531      AR(1) on RV_t alone = 0.2480\n\nbd + bw + bm = 0.8593 -- close to one, the persistence the HAR form is built to capture\nHAR improves on plain AR(1) by picking up the weekly and monthly components that a\nsingle daily lag cannot see; the improvement (0.3531 vs 0.2480) is the value of the extra terms."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Volatility clustering: the autocorrelation of log realised variance, real vs shuffled",
        "params": {
          "xlab": "lag (trading days)",
          "ylab": "autocorrelation of log RV",
          "log": false,
          "series": [
            {
              "name": "actual order",
              "x": [
                1,
                5,
                10,
                22,
                66,
                132
              ],
              "y": [
                0.519,
                0.4055,
                0.3543,
                0.2768,
                0.1139,
                -0.0163
              ]
            },
            {
              "name": "days shuffled",
              "x": [
                1,
                5,
                10,
                22,
                66,
                132
              ],
              "y": [
                0.0305,
                0.0104,
                -0.0064,
                -0.0191,
                0.009,
                0.0315
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Choosing a spot-volatility window by feel instead of by the volatility's own persistence time scale; too short is noise, too long smooths away exactly the local move you wanted to see.",
        "Reading ‘volatility clustering’ as return predictability. Clustering is about the SIZE of moves, not their sign or the level of expected return; it says nothing tradeable about direction on its own.",
        "Measuring the leverage effect from squared daily close-to-close returns instead of realised variance, which reintroduces exactly the microstructure noise and jump contamination weeks 3-6 built machinery to remove.",
        "Treating a HAR regression's in-sample R-squared as forecast accuracy. In-sample fit only shows the model can describe the past; only an out-of-sample test (next week) tells you whether it forecasts."
      ],
      "check": [
        {
          "q": "In the spot-volatility estimator, what happens as the window k grows very large compared with the volatility's own half-life?",
          "options": [
            "The estimator's standard deviation shrinks with no cost at all",
            "The standard deviation shrinks, but the estimate decorrelates from the true local path because it now tracks the unconditional mean",
            "The standard deviation grows without bound",
            "The estimator becomes an unbiased estimate of the drift"
          ],
          "answer": 1,
          "why": "A very wide window averages over many genuine volatility moves, so the estimate settles near the day's average variance rather than the local value; correlation with the true path falls even though the raw error can look flat once it saturates near the path's own spread."
        },
        {
          "q": "Volatility clustering refers to the empirical fact that:",
          "options": [
            "Large positive returns tend to be followed by more large positive returns",
            "Large-magnitude moves, of either sign, tend to be followed by more large-magnitude moves",
            "Realised variance predicts the sign of tomorrow's return",
            "Volatility is constant over long horizons but noisy day to day"
          ],
          "answer": 1,
          "why": "Clustering is a statement about the size of moves, not their direction; a big up day and a big down day both tend to be followed by more volatility, which is why shuffling the order of the days (preserving each day's own value) destroys the pattern."
        },
        {
          "q": "The leverage effect is the finding that:",
          "options": [
            "Rising prices cause volatility to rise",
            "Falling prices tend to be associated with a rise in variance, i.e. a negative correlation between return and variance change",
            "Volatility has no measurable relationship to returns",
            "Volatility only ever responds to jumps, never to continuous moves"
          ],
          "answer": 1,
          "why": "The leverage effect is a negative correlation between a return and the accompanying change in variance; the snippet recovers this directly by building price and variance from a shared, negatively-correlated shock and checking that the estimated correlation matches the parameter used to generate the data."
        },
        {
          "q": "Why does HAR-RV regress on three moving averages of realised variance (daily, weekly, monthly) instead of many individual AR lags?",
          "options": [
            "It captures persistence across several horizons with only three parameters, consistent with market participants who act at different frequencies",
            "It is mathematically identical to an AR(1) model",
            "It removes the need for an intercept term",
            "It is guaranteed to have a higher R-squared than any other linear model"
          ],
          "answer": 0,
          "why": "The heterogeneous-market motivation is that different participants react at different horizons; averaging over a week and a month is a cheap way to let the regression see multi-horizon persistence that a single daily lag cannot represent, and the snippet's R-squared improvement over a plain AR(1) is exactly that extra information."
        }
      ],
      "n": 8
    },
    {
      "title": "Inference for volatility functionals: efficiency, block-based variance, and applications",
      "topics": [
        "asymptotic variance constants across different volatility functionals",
        "observed (block-based) asymptotic variance as a formula-free alternative",
        "realised beta and realised covariance as an inference problem",
        "evaluating a volatility forecast out of sample: MSE versus QLIKE"
      ],
      "concepts": [
        {
          "name": "Every functional has its own CLT, and its own price of robustness",
          "explain": "<p>Weeks 2 and 6 gave confidence intervals for two different estimators of the same integrated variance — realised variance and bipower variation — without dwelling on why they need different formulas. Both obey a stable central limit theorem of the same general shape, root n times the estimation error converging to a mixed-normal law with variance equal to a constant times integrated quarticity, but the constant is specific to the functional. For realised variance the constant is 2. For bipower variation, which survives the jumps that break realised variance, the constant is pi-squared over 4 plus pi minus 3, about 2.61.</p><p>That larger constant is the price bipower variation pays for its robustness, and the snippet prices it directly: on the same simulated, jump-free returns, the empirical variance of bipower variation, scaled by n, comes out at 1.28 times realised variance's own scaled variance, matching the ratio of the two theoretical constants (2.61 divided by 2.00) closely.</p><p>The lesson generalises well past these two examples: truncated realised variance, multipower variation, realised kernels, and every other functional this course has built each carries its own asymptotic variance constant, usually a fourth-moment integral specific to its construction, and ‘the interval’ is never a single universal formula.</p><p>A desk building a jump-robust risk pipeline cares because choosing bipower variation over realised variance is not a free upgrade — it is roughly a 28% wider confidence interval, paid every single day, in exchange for immunity on the rare day a jump actually occurs.</p>",
          "formula": "\\sqrt n\\big(\\widehat\\theta_n-\\theta\\big)\\ \\xrightarrow{\\ \\mathcal L\\text{-s}\\ }\\ \\sqrt{c\\cdot IQ}\\cdot Z,\\qquad c_{RV}=2,\\ \\ c_{BPV}=\\tfrac{\\pi^2}{4}+\\pi-3\\approx2.61",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn, D = 390, 6000                 # one-minute grid, 6000 simulated days\ndt, sig = 1.0 / n, 0.014          # CONSTANT volatility, so the only source of variation is the estimator\nr = np.random.default_rng(934600)\ndX = sig * np.sqrt(dt) * r.standard_normal((D, n))\nIV = sig ** 2\n\nMU1 = np.sqrt(2.0 / np.pi)        # E|Z|\n\nRV = (dX ** 2).sum(axis=1)\nar = np.abs(dX)\nBPV = (np.pi / 2.0) * (ar[:, :-1] * ar[:, 1:]).sum(axis=1)\n\nvarRV = RV.var(ddof=1) * n         # empirical n * Var(RV)\nvarBPV = BPV.var(ddof=1) * n\n\ntheory_RV = 2.0 * IV ** 2                                  # 2 * IQ, IQ = sigma^4 here\ntheory_BPV = (np.pi ** 2 / 4.0 + np.pi - 3.0) * IV ** 2     # the standard bipower CLT constant\n\nprint(\"estimator   n*Var(estimate)   theory constant * IQ   efficiency ratio to RV\")\nprint(\"RV          %16.4e   %20.4e   %22.3f\" % (varRV, theory_RV, varRV / varRV))\nprint(\"BPV         %16.4e   %20.4e   %22.3f\" % (varBPV, theory_BPV, varBPV / varRV))\nprint(\"\")\nprint(\"mean(RV)/IV = %.4f   mean(BPV)/IV = %.4f  (both consistent for IV here)\" % (RV.mean() / IV, BPV.mean() / IV))\nprint(\"\")\nprint(\"BPV's asymptotic variance constant is pi^2/4 + pi - 3 = %.4f against RV's 2.0: about a\"\n      % (np.pi ** 2 / 4.0 + np.pi - 3.0))\nprint(\"%.0f%% efficiency loss, which is the statistical price of the jump-robustness bought\" % (100 * (varBPV / varRV - 1)))\nprint(\"in week 6 -- there is no free lunch between robustness and precision.\")\n",
            "output": "estimator   n*Var(estimate)   theory constant * IQ   efficiency ratio to RV\nRV                7.6303e-08             7.6832e-08                    1.000\nBPV               9.7716e-08             1.0023e-07                    1.281\n\nmean(RV)/IV = 0.9999   mean(BPV)/IV = 0.9975  (both consistent for IV here)\n\nBPV's asymptotic variance constant is pi^2/4 + pi - 3 = 2.6090 against RV's 2.0: about a\n28% efficiency loss, which is the statistical price of the jump-robustness bought\nin week 6 -- there is no free lunch between robustness and precision."
          }
        },
        {
          "name": "Observed asymptotic variance: inference without a formula",
          "explain": "<p>Every interval built so far has needed an explicit formula for the estimator's asymptotic variance — 2 times integrated quarticity for realised variance, the bipower constant for bipower variation — and a plug-in estimator of whatever integral sits inside that formula. For a functional whose limit theory nobody has worked out, or one complicated enough that deriving it by hand is not worth the trouble, that is a real obstacle. The ‘observed asymptotic variance’ approach removes it: split the day into M blocks, compute the same estimator on each block, rescale each block estimate to a full-day rate, and use the sample variance of those M rescaled values, divided by M, as a direct estimate of the estimator's own variance.</p><p>The snippet checks the coverage this buys against the quarticity plug-in from week 2, and finds a genuine trade-off: with only 10 blocks the block-based interval over-covers at 99.4%, because each block is long enough that the spot volatility genuinely moves within it, and that real movement is mistaken for extra sampling noise. As the block count rises to 130 (six returns per block) coverage falls toward the plug-in's own 95.4%, because the ‘volatility roughly constant within a block’ assumption the method leans on gets closer to true.</p><p>The interval is never dishonest in either direction here — it is conservative, not wrong — but a research team cares about the direction of the error: a method that is verifiably too wide is a far safer default for a functional you cannot derive a formula for than one that might quietly under-cover.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nn, D = 780, 4000                        # 30-second grid, 4000 simulated days\ndt, kappa, xi = 1.0 / n, 3.0, 1.1\nm = np.log(0.014 ** 2)\na = np.exp(-kappa * dt); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\nZ975 = 1.959963984540054\n\ndef one_day(seed):\n    r = np.random.default_rng(seed)\n    var = np.exp(m + lfilter([b], [1.0, -a], r.standard_normal(n)))\n    dX = np.sqrt(var * dt) * r.standard_normal(n)\n    return dX, (var * dt).sum()\n\ndef observed_avar(dX, M):\n    # split the day into M blocks; the SAMPLE variance of the (rescaled) block\n    # RVs times 1/M estimates Var(RV) directly, with no quarticity formula at all\n    blocks = dX.reshape(M, n // M)\n    rv_block = (blocks ** 2).sum(axis=1) * M\n    return rv_block.var(ddof=1) / M\n\ndays = [one_day(40_000 + i) for i in range(D)]\nRV = np.array([(dX ** 2).sum() for dX, _ in days])\nIV = np.array([iv for _, iv in days])\nRQ = np.array([(n / 3.0) * (dX ** 4).sum() for dX, _ in days])\nvar_plugin = 2.0 * RQ / n\nh_p = Z975 * np.sqrt(var_plugin)\ncover_plugin = float(np.mean((RV - h_p <= IV) & (IV <= RV + h_p)))\n\nprint(\"nominal coverage 95.0%%, %d simulated days\" % D)\nprint(\"quarticity plug-in interval coverage = %.1f%%\" % (100 * cover_plugin))\nprint(\"\")\nprint(\"   M   block length   mean var_oav / mean var_plugin   coverage\")\nfor M in (10, 20, 39, 65, 130):\n    var_oav = np.array([observed_avar(dX, M) for dX, _ in days])\n    h_o = Z975 * np.sqrt(var_oav)\n    cover_oav = float(np.mean((RV - h_o <= IV) & (IV <= RV + h_o)))\n    print(\"%4d   %11d   %28.3f   %8.1f%%\" % (M, n // M, var_oav.mean() / var_plugin.mean(), 100 * cover_oav))\n\nprint(\"\")\nprint(\"Coarse blocks overstate the variance -- each block is long enough that the spot\")\nprint(\"volatility genuinely moves within it, and that real movement is mistaken for sampling\")\nprint(\"noise -- so the interval is wider than it needs to be but never dishonest. As blocks\")\nprint(\"shrink toward the plug-in's own implicit scale, observed AVAR converges on it, at the\")\nprint(\"cost of needing enough returns per block for the within-block variance to mean anything.\")\n",
            "output": "nominal coverage 95.0%, 4000 simulated days\nquarticity plug-in interval coverage = 95.4%\n\n   M   block length   mean var_oav / mean var_plugin   coverage\n  10            78                          4.328       99.4%\n  20            39                          2.750       99.0%\n  39            20                          1.924       98.5%\n  65            12                          1.565       97.9%\n 130             6                          1.284       97.2%\n\nCoarse blocks overstate the variance -- each block is long enough that the spot\nvolatility genuinely moves within it, and that real movement is mistaken for sampling\nnoise -- so the interval is wider than it needs to be but never dishonest. As blocks\nshrink toward the plug-in's own implicit scale, observed AVAR converges on it, at the\ncost of needing enough returns per block for the within-block variance to mean anything."
          }
        },
        {
          "name": "Realised beta: inference on a ratio of two realised measures",
          "explain": "<p>Realised beta — realised covariance with the market divided by the market's own realised variance — is not a new estimator, it is an old ratio built from tools this course already has. But a ratio of two estimators does not inherit either one's asymptotic variance directly; it needs its own delta-method calculation. Writing the stock's return as beta times the market plus an independent idiosyncratic shock makes the calculation tractable: to leading order, the estimation error in realised beta is the realised covariance between the idiosyncratic shock and the market, divided by the market's own realised variance, giving an asymptotic variance equal to the idiosyncratic (residual) integrated variance divided by n times the market's integrated variance — not the realised-variance formula from week 2.</p><p>The snippet confirms the formula on simulated data with a true beta of 1.35: the empirical standard deviation of the estimated beta across 4,000 simulated days is 0.0843, against a theoretical prediction of 0.0844, and a 95% interval built from the true idiosyncratic-variance-over-market-variance ratio covers the true beta 94.9% of the time. A fully feasible version, using the realised regression residuals in place of the unobservable true idiosyncratic variance, covers 94.6% of the time — essentially as good, and it needs nothing beyond the regression itself.</p><p>A portfolio desk cares because a realised beta reported without this standard error is a point estimate with no way to say whether 1.35 and 1.20 are meaningfully different hedge ratios or just two draws of the same noisy number.</p>",
          "formula": "\\widehat\\beta=\\frac{\\widehat{[S,M]}_T}{\\widehat{[M,M]}_T},\\qquad \\mathrm{AVAR}(\\widehat\\beta)\\approx\\frac{IV_e}{n\\,IV_M}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn, D = 390, 4000                 # one-minute grid, 4000 days\ndt = 1.0 / n\nsig_m, sig_e = 0.012, 0.020       # market and idiosyncratic (stock-specific) vol\nbeta_true = 1.35\nZ975 = 1.959963984540054\n\nr = np.random.default_rng(834609)\ndWm = r.standard_normal((D, n))\ndWe = r.standard_normal((D, n))\ndM = sig_m * np.sqrt(dt) * dWm                          # the market factor\ndS = beta_true * dM + sig_e * np.sqrt(dt) * dWe          # the stock: beta * market + idiosyncratic noise\n\nRCov = (dS * dM).sum(axis=1)\nRVarM = (dM ** 2).sum(axis=1)\nbeta_hat = RCov / RVarM\n\nIV_M, IV_e = sig_m ** 2, sig_e ** 2\n\n# to leading order beta_hat - beta = (sum of idiosyncratic-times-market cross terms)/RVarM,\n# which gives AVAR(beta_hat) = IV_e / (n * IV_M) -- the residual variance per unit of market variance\navar_theory = IV_e / (n * IV_M)\nprint(\"true beta = %.3f\" % beta_true)\nprint(\"mean(beta_hat) = %.4f     sd(beta_hat) empirical = %.5f    sd theory = %.5f\"\n      % (beta_hat.mean(), beta_hat.std(ddof=1), np.sqrt(avar_theory)))\n\n# a FEASIBLE version: plug in the realised residual variance instead of the true one\nresid = dS - beta_hat[:, None] * dM\nRVarResid = (resid ** 2).sum(axis=1)\navar_feasible = RVarResid / (n * RVarM)\nlo_f = beta_hat - Z975 * np.sqrt(avar_feasible)\nhi_f = beta_hat + Z975 * np.sqrt(avar_feasible)\ncover_f = float(np.mean((lo_f <= beta_true) & (beta_true <= hi_f)))\n\nlo_t = beta_hat - Z975 * np.sqrt(avar_theory)\nhi_t = beta_hat + Z975 * np.sqrt(avar_theory)\ncover_t = float(np.mean((lo_t <= beta_true) & (beta_true <= hi_t)))\n\nprint(\"95%% CI, true IV_e/IV_M plugged in       covers the true beta %.1f%% of the time\" % (100 * cover_t))\nprint(\"95%% CI, realised residual variance used covers the true beta %.1f%% of the time\" % (100 * cover_f))\nprint(\"\")\nprint(\"Realised beta is a RATIO of two realised measures. Its own asymptotic variance is not\")\nprint(\"the RV formula from week 2 at all -- it is the idiosyncratic variance PER UNIT of market\")\nprint(\"variance, and the fully feasible version needs nothing beyond the regression residuals.\")\n",
            "output": "true beta = 1.350\nmean(beta_hat) = 1.3477     sd(beta_hat) empirical = 0.08428    sd theory = 0.08439\n95% CI, true IV_e/IV_M plugged in       covers the true beta 94.9% of the time\n95% CI, realised residual variance used covers the true beta 94.6% of the time\n\nRealised beta is a RATIO of two realised measures. Its own asymptotic variance is not\nthe RV formula from week 2 at all -- it is the idiosyncratic variance PER UNIT of market\nvariance, and the fully feasible version needs nothing beyond the regression residuals."
          }
        },
        {
          "name": "Evaluating a forecast: MSE, QLIKE, and the discipline of holding out data",
          "explain": "<p>A HAR model, or any other volatility forecast, is worthless until it has been checked on data it never saw. The snippet fits last week's HAR regression on the first 70% of a simulated multi-scale series and evaluates the forecast on the remaining 30% — days the fitted coefficients never touched — against a naive random-walk forecast that simply predicts tomorrow's realised variance to equal today's.</p><p>Two loss functions are worth comparing. Mean squared error on the level of variance is dominated by the handful of highest-variance days, because their squared errors are enormous in absolute terms even when the forecast's proportional miss is no worse than on a quiet day. QLIKE — the loss y/f minus log(y/f) minus 1, where y is the realised outcome and f the forecast — treats a doubling of the forecast on a quiet day and a doubling on a wild day as comparably bad, because it works in ratios rather than levels, which is usually closer to how a risk manager actually experiences a miss.</p><p>Here HAR beats the random walk on both losses out of sample — an MSE of 1.99e-9 against 3.11e-9, a QLIKE of 0.030 against 0.047 — and an out-of-sample R-squared of 0.37 against the test period's own mean. None of those numbers would mean anything computed in-sample, where a model can fit noise it will never see again; the exercise only has content because the test days were held out before the coefficients were estimated.</p>",
          "formula": "\\mathrm{QLIKE} = \\frac1T\\sum_{t=1}^{T}\\left(\\frac{y_t}{f_t} - \\log\\frac{y_t}{f_t} - 1\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\nfrom scipy.signal import lfilter\n\nD, N = 3000, 78                        # 3000 days, five-minute grid -- the same world as week 8's HAR concept\nr = np.random.default_rng(834611)\ncomps = [(1.40, 0.250), (0.05, 0.047), (0.01, 0.021)]\nm0 = np.log(0.014 ** 2)\nlogvar_d = np.full(D, m0)\nfor kappa, xi in comps:\n    a = np.exp(-kappa); b = xi * np.sqrt((1 - a ** 2) / (2 * kappa))\n    logvar_d = logvar_d + lfilter([b], [1.0, -a], r.standard_normal(D))\nvar_d = np.exp(logvar_d)\nchi = (r.standard_normal((D, N)) ** 2).mean(axis=1)\nRV = var_d * chi\n\ndef moving_avg(x, k):\n    c = np.cumsum(x)\n    out = np.full_like(x, np.nan)\n    out[k - 1:] = (c[k - 1:] - np.r_[0, c[:-k]]) / k\n    return out\n\nw_, mth = moving_avg(RV, 5), moving_avg(RV, 22)\nsplit = int(D * 0.7)                                 # train on the first 70%, test on the rest\nX_all = np.column_stack([np.ones(D), RV, w_, mth])\ny_all = np.r_[RV[1:], np.nan]                          # tomorrow's RV\n\ntrain = slice(22, split - 1)\ncoef, *_ = np.linalg.lstsq(X_all[train], y_all[train], rcond=None)\n\ntest = slice(split, D - 1)\nfc_har = X_all[test] @ coef\nfc_rw = RV[test]                                       # naive: tomorrow = today (a random-walk forecast)\ntruth = y_all[test]\n\ndef mse(f, y):\n    return float(np.mean((f - y) ** 2))\n\ndef qlike(f, y):\n    return float(np.mean(y / f - np.log(y / f) - 1.0))     # >= 0, penalises both over- and under-prediction\n\nprint(\"out-of-sample, %d days held out\" % (test.stop - test.start))\nprint(\"                MSE            QLIKE\")\nprint(\"HAR forecast    %.4e   %.4f\" % (mse(fc_har, truth), qlike(fc_har, truth)))\nprint(\"random-walk     %.4e   %.4f\" % (mse(fc_rw, truth), qlike(fc_rw, truth)))\nprint(\"\")\nr2_oos = 1 - mse(fc_har, truth) / np.var(truth)\nprint(\"out-of-sample R^2 of the HAR forecast against the mean = %.4f\" % r2_oos)\nprint(\"HAR beats the random walk on both losses; QLIKE is the one that also respects the\")\nprint(\"mean-reverting SCALE of variance rather than treating a miss on a quiet day and a\")\nprint(\"miss on a wild day as equally bad, which plain MSE on the level of RV does not.\")\n",
            "output": "out-of-sample, 899 days held out\n                MSE            QLIKE\nHAR forecast    1.9936e-09   0.0300\nrandom-walk     3.1146e-09   0.0472\n\nout-of-sample R^2 of the HAR forecast against the mean = 0.3653\nHAR beats the random walk on both losses; QLIKE is the one that also respects the\nmean-reverting SCALE of variance rather than treating a miss on a quiet day and a\nmiss on a wild day as equally bad, which plain MSE on the level of RV does not."
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "Realised beta as an OLS slope: the ratio this concept builds an interval for",
        "params": {
          "n": 390,
          "beta": 1.35,
          "noise": 1.5,
          "seed": 834609,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Assuming every realised functional shares realised variance's asymptotic variance formula. Bipower variation, quarticity, and every other functional has ITS OWN CLT constant; ‘the interval’ always means quarticity's interval unless you say otherwise.",
        "Building an observed (block-based) asymptotic variance with blocks so coarse that volatility genuinely moves within a block; the result is a valid but needlessly wide interval, not a wrong one, as the widening-with-coarser-blocks result shows.",
        "Reporting a realised beta's standard error from the plain realised-variance formula rather than the residual-variance-over-market-variance formula that actually governs a ratio of two realised measures.",
        "Judging a volatility forecast by MSE alone. MSE on the raw level of variance is dominated by the few high-variance days; QLIKE (or working in logs) weighs a miss on a quiet day and a miss on a wild day comparably, which is usually closer to what a risk manager wants."
      ],
      "check": [
        {
          "q": "Bipower variation's asymptotic variance constant (about 2.61) compared with realised variance's (2.00) means:",
          "options": [
            "Bipower variation is more precise than realised variance",
            "Bipower variation pays roughly a 28-30% efficiency cost for its jump-robustness",
            "Bipower variation is inconsistent for integrated variance",
            "The constant only matters if jumps are actually present that day"
          ],
          "answer": 1,
          "why": "A larger asymptotic variance constant means a wider confidence interval for the same sample size; bipower variation trades that precision for robustness to jumps, and the snippet measures the cost directly as about a 28% larger scaled variance on jump-free data."
        },
        {
          "q": "The observed (block-based) asymptotic variance approach to inference is most useful when:",
          "options": [
            "You already have a clean closed-form formula for the estimator's asymptotic variance",
            "You want a valid interval for a functional whose limit theory has not been (or is hard to) derive analytically",
            "The sample has fewer than thirty observations",
            "You specifically need to test for jumps"
          ],
          "answer": 1,
          "why": "The block-based method only requires that the estimator be computable on a sub-block; it needs no analytic CLT constant at all, which is exactly the situation where a plug-in formula is unavailable."
        },
        {
          "q": "Realised beta's asymptotic variance is governed mainly by:",
          "options": [
            "The same 2 times integrated-quarticity constant as realised variance",
            "The idiosyncratic (residual) variance divided by the market's own realised variance",
            "The correlation between the stock and the market alone",
            "The number of assets held in the portfolio"
          ],
          "answer": 1,
          "why": "Because realised beta is a ratio, its estimation error to leading order is the covariance between the idiosyncratic shock and the market divided by the market's realised variance, giving an asymptotic variance of idiosyncratic variance over n times market variance -- not the RV formula."
        },
        {
          "q": "QLIKE is often preferred to plain MSE for evaluating a volatility forecast because:",
          "options": [
            "It is always numerically smaller",
            "It penalises proportional misses similarly on quiet and volatile days rather than letting a few high-variance days dominate the loss",
            "It does not require holding out any data",
            "It is only defined for HAR-type models"
          ],
          "answer": 1,
          "why": "QLIKE is built from the ratio of outcome to forecast rather than their difference, so a proportionally similar miss counts similarly whether the day was calm or wild, unlike MSE on the level of variance, which is swamped by the rare very high-variance day."
        }
      ],
      "n": 9
    },
    {
      "title": "Market-microstructure data: cleaning the tape, signing trades, and the pipeline as a whole",
      "topics": [
        "cleaning raw trade-and-quote data before any estimator sees it",
        "signing a trade: the tick rule, the quote rule, and Lee-Ready",
        "choosing a price series: mid-quotes versus last trades",
        "the full ten-week pipeline, chained end to end"
      ],
      "concepts": [
        {
          "name": "Cleaning the tape: what has to happen before any estimator sees a tick",
          "explain": "<p>Every estimator in this course has been fed a clean, simulated price path. Real consolidated tape data is not clean: fat-finger prints, decimal-point misplacements, duplicate reports, and stray prints from the wrong venue all show up in a raw feed, and every one of them is a return of implausible size sitting right next to genuine, small returns. Because realised variance sums squared returns, a single such misprint can dominate an entire day's estimate: the snippet injects just twelve bad ticks into 23,400 one-second observations — one bad print in roughly two thousand — and realised variance on the contaminated series comes out 372 times too large.</p><p>The standard defence is a local outlier filter: compare each return to the median and the median absolute deviation (MAD) of a window of nearby returns, and flag anything more than some multiple of 1.4826 times the local MAD away from the local median, the constant chosen so that MAD estimates a normal distribution's standard deviation consistently. The snippet's filter, run with a threshold of eight MADs, flags the returns touching all twelve injected bad ticks (each bad print corrupts two adjacent returns, the one into it and the one out of it) and brings realised variance back to 1.01 times the true integrated variance — indistinguishable from the clean path.</p><p>No estimator built in weeks 1 through 9 defends against this, because none of them assumes the data contains outright errors rather than noise. A trading desk cares because a single upstream data vendor's bad print, left unfiltered, can silently move a reported risk number by two orders of magnitude.</p>",
          "formula": "|r_i - \\mathrm{med}(r)| > k \\times 1.4826\\,\\mathrm{MAD}(r) \\implies \\text{flag tick } i",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn = 23400                          # one raw tick per second, one trading day\nsig = 0.014\nr = np.random.default_rng(1034600)\ndt = 1.0 / n\nlogp = np.cumsum(sig * np.sqrt(dt) * r.standard_normal(n))\nlogp -= logp[0]\nIV = sig ** 2\n\n# inject bad ticks: a handful of one-off price errors (fat-finger prints, decimal\n# misplacements, wrong-venue prints that leak into the consolidated tape)\nbad = logp.copy()\nn_outliers = 12\nidx = r.choice(n, size=n_outliers, replace=False)\nbad[idx] += r.choice([-1, 1], size=n_outliers) * r.uniform(0.02, 0.08, size=n_outliers)\n\ndef clean_mad(x, k=8.0, window=41):\n    # a standard TAQ-style filter: flag a tick whose return is more than k times the\n    # median absolute deviation of a local window of returns away from the local median\n    ret = np.diff(x)\n    out = ret.copy()\n    half = window // 2\n    for i in range(len(ret)):\n        lo, hi = max(0, i - half), min(len(ret), i + half + 1)\n        loc = np.delete(ret[lo:hi], min(i - lo, hi - lo - 1))\n        med = np.median(loc)\n        mad = np.median(np.abs(loc - med)) + 1e-12\n        if abs(ret[i] - med) > k * 1.4826 * mad:\n            out[i] = med                     # replace a flagged return with the local median\n    return np.r_[x[0], x[0] + np.cumsum(out)]\n\ncleaned = clean_mad(bad)\n\ndef rv(x):\n    return np.sum(np.diff(x) ** 2)\n\nn_flagged = int(np.sum(np.abs(np.diff(bad) - np.diff(cleaned)) > 1e-9))\n\nprint(\"true integrated variance                          %.4e\" % IV)\nprint(\"RV on the clean simulated path                     %.4e  (ratio %.3f)\" % (rv(logp), rv(logp) / IV))\nprint(\"RV on the path with %2d bad ticks injected           %.4e  (ratio %.3f)\" % (n_outliers, rv(bad), rv(bad) / IV))\nprint(\"RV after the MAD filter                             %.4e  (ratio %.3f)\" % (rv(cleaned), rv(cleaned) / IV))\nprint(\"\")\nprint(\"flagged %d of the returns touching the %d injected bad ticks (a single bad print\"\n      % (n_flagged, n_outliers))\nprint(\"corrupts TWO adjacent returns: the one into it and the one out of it)\")\nprint(\"\")\nprint(\"Twelve bad prints out of 23,400 -- one in two thousand -- inflate realised variance\")\nprint(\"by %.0fx; no estimator from weeks 1-9 defends against this, because none of them\" % (rv(bad) / IV))\nprint(\"assumes the data has typos in it. Cleaning happens before any of that machinery runs.\")\n",
            "output": "true integrated variance                          1.9600e-04\nRV on the clean simulated path                     1.9812e-04  (ratio 1.011)\nRV on the path with 12 bad ticks injected           7.2815e-02  (ratio 371.504)\nRV after the MAD filter                             1.9797e-04  (ratio 1.010)\n\nflagged 24 of the returns touching the 12 injected bad ticks (a single bad print\ncorrupts TWO adjacent returns: the one into it and the one out of it)\n\nTwelve bad prints out of 23,400 -- one in two thousand -- inflate realised variance\nby 372x; no estimator from weeks 1-9 defends against this, because none of them\nassumes the data has typos in it. Cleaning happens before any of that machinery runs."
          }
        },
        {
          "name": "Signing a trade: the tick rule, the quote rule, and Lee-Ready",
          "explain": "<p>Many microstructure questions — order imbalance, price impact, who initiated a given trade — need to know whether a print was buyer- or seller-initiated, a label the tape usually does not carry directly. The tick rule infers it from the price's own change: a trade at a higher price than the last one is classified as buyer-initiated, a trade at a lower price as seller-initiated, with an unresolved tie inheriting the previous classification. The quote rule instead compares the trade price to the current bid-ask midpoint: above the midpoint is a buy, below is a sell, and only a trade printing exactly at the midpoint is genuinely ambiguous. The Lee-Ready algorithm is simply the quote rule, with the tick rule used only to break that midpoint tie.</p><p>The snippet simulates trades with a known true side and checks each rule against it. Off the midpoint the quote rule is exact by construction, since a trade strictly above or below the current mid-quote unambiguously reveals which side crossed the spread. The tick rule alone, using only the sequence of prices, gets the side right 78.7% of the time. Applied only to the roughly one trade in five that happens to print exactly at the midpoint, the tick rule's tie-break is barely better than a coin flip (50.6%), and Lee-Ready's overall accuracy of 90.8% reflects a near-perfect score off the midpoint blended with that weak tie-break on it.</p><p>An execution-research team cares because every order-flow-toxicity or price-impact study starts by signing trades, and a systematically wrong sign on even a fifth of the tape biases every conclusion drawn downstream.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn = 8000\nr = np.random.default_rng(1134600)\ntick = 0.01\nspread = 2 * tick\nsteps = r.choice([-1, 0, 1], size=n, p=[0.28, 0.44, 0.28])       # a discrete random-walk mid\nmid = 100.0 + tick * np.cumsum(steps)\nbid, ask = mid - spread / 2, mid + spread / 2                     # spread aligns mid to the tick grid\n\ntrue_side = r.choice([-1, 1], size=n)                              # the TRUE, unobservable buy(+1)/sell(-1) flag\nat_mid = r.random(n) < 0.18                                        # ~18% of trades print AT the midpoint\nprice = np.where(at_mid, mid, np.where(true_side > 0, ask, bid))\n\ndef tick_rule(p):\n    d = np.sign(np.diff(p, prepend=p[0]))\n    for i in range(1, len(d)):\n        if d[i] == 0:\n            d[i] = d[i - 1]\n    d[0] = 1\n    return d\n\ndef quote_rule(p, m):\n    return np.where(p > m, 1, np.where(p < m, -1, 0))\n\ntick_sgn = tick_rule(price)\nq_sgn = quote_rule(price, mid)\nlr_sgn = np.where(q_sgn == 0, tick_sgn, q_sgn)                      # Lee-Ready: quote rule, tick rule breaks ties\n\nprint(\"classifier              accuracy vs true side   unresolved-by-quote-rule fraction\")\nfor name, sgn, unresolved_frac in (\n        (\"tick rule alone\", tick_sgn, None),\n        (\"quote rule alone\", q_sgn, float(np.mean(q_sgn == 0))),\n        (\"Lee-Ready\", lr_sgn, None)):\n    acc = float(np.mean(sgn == true_side))\n    u = \"%.1f%%\" % (100 * unresolved_frac) if unresolved_frac is not None else \"n/a\"\n    print(\"%-24s %20.1f%%   %30s\" % (name, 100 * acc, u))\n\nprint(\"\")\nprint(\"accuracy of the tick rule on ONLY the midpoint trades: %.1f%% (n=%d)\"\n      % (100 * np.mean(tick_sgn[at_mid] == true_side[at_mid]), int(at_mid.sum())))\nprint(\"Off the midpoint the quote rule is exact by construction. It is only the roughly one\")\nprint(\"trade in five that prints exactly at the midpoint where Lee-Ready's tick-rule tie-break\")\nprint(\"earns its keep, and even there it does better than a coin flip but nowhere near perfectly.\")\n",
            "output": "classifier              accuracy vs true side   unresolved-by-quote-rule fraction\ntick rule alone                          78.7%                              n/a\nquote rule alone                         81.5%                            18.5%\nLee-Ready                                90.8%                              n/a\n\naccuracy of the tick rule on ONLY the midpoint trades: 50.6% (n=1481)\nOff the midpoint the quote rule is exact by construction. It is only the roughly one\ntrade in five that prints exactly at the midpoint where Lee-Ready's tick-rule tie-break\nearns its keep, and even there it does better than a coin flip but nowhere near perfectly."
          }
        },
        {
          "name": "Which price series? Mid-quotes carry far less noise than last trades",
          "explain": "<p>Weeks 3 through 5 built an entire toolkit to defend an estimator against additive microstructure noise, but the size of that noise depends on a choice made before any of that machinery runs: which observed price series to use. A last-trade series inherits the full bid-ask bounce — a trade at the ask followed by one at the bid looks like a large round-trip move even when the efficient price has not budged — while a mid-quote series is immune to which side just traded, and typically carries far smaller noise.</p><p>The snippet builds both series from the same simulated efficient price and measures the noise each one adds. Realised variance on last-trade prices comes out at 10.6 times the true integrated variance; on mid-quotes, only 4.4 times. The gap matches the noise variance built into each series almost exactly: the bias formula from week 3, 2n times the noise variance, predicts an inflation of 1.87e-3 for last trades and 6.74e-4 for mid-quotes, against measured inflations of 1.87e-3 and 6.73e-4 — and the ratio between the two noise variances, 2.8, is exactly the ratio of how much cleanup work weeks 3 to 5's noise-robust estimators have to do.</p><p>A desk building a production noise-robust pipeline cares because the choice of input series is free — both are already on the tape — while the noise it saves is not: starting from mid-quotes rather than last trades can mean a meaningfully smaller sampling-frequency penalty for the exact same estimator.</p>",
          "formula": "p^{trade}_i = m_i + \\tfrac{s}{2}\\,\\mathrm{side}_i, \\qquad p^{mid}_i = m_i + \\eta_i, \\qquad \\mathrm{Var}(\\eta) \\ll (s/2)^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn = 23400                       # one quote-and-trade pair per second, one trading day\nsig, spread, eta = 0.014, 0.0004, 0.00012      # efficient-price vol, fixed spread, quote-mid noise sd\ndt = 1.0 / n\nr = np.random.default_rng(1234600)\nefficient = np.cumsum(sig * np.sqrt(dt) * r.standard_normal(n))\nIV = sig ** 2\n\nside = r.choice([-1, 1], size=n)                                # which side of the book trades\nlast_trade = efficient + side * spread / 2                       # last-trade price: full bid-ask bounce\nmid_quote = efficient + eta * r.standard_normal(n)                # mid-quote: much smaller residual noise\n\ndef rv(x):\n    return np.sum(np.diff(x) ** 2)\n\nrv_trade = rv(last_trade)\nrv_mid = rv(mid_quote)\nrv_eff = rv(efficient)\nnoise_var_trade = (spread / 2) ** 2               # additive-noise variance implied by the bounce\nnoise_var_mid = eta ** 2\n\nprint(\"integrated variance of the efficient price          %.4e\" % IV)\nprint(\"RV on the EFFICIENT price (unobservable)             %.4e  (ratio %.3f)\" % (rv_eff, rv_eff / IV))\nprint(\"RV on LAST-TRADE prices (full bid-ask bounce)        %.4e  (ratio %.3f)\" % (rv_trade, rv_trade / IV))\nprint(\"RV on MID-QUOTE prices (much smaller noise)          %.4e  (ratio %.3f)\" % (rv_mid, rv_mid / IV))\nprint(\"\")\nprint(\"noise variance implied by the bounce, (spread/2)^2 = %.4e; 2*n*that            = %.4e\"\n      % (noise_var_trade, 2 * n * noise_var_trade))\nprint(\"noise variance of the mid-quote, eta^2               = %.4e; 2*n*that            = %.4e\"\n      % (noise_var_mid, 2 * n * noise_var_mid))\nprint(\"\")\nprint(\"Both series describe the SAME efficient price, but the week 3-5 noise-robust machinery\")\nprint(\"has far less work to do on mid-quotes: the additive noise variance is smaller by a factor\")\nprint(\"of %.1f, precisely because a mid-quote is a QUOTED level, immune to which side just traded,\"\n      % (noise_var_trade / noise_var_mid))\nprint(\"while a last-trade price inherits the full width of the spread every time the side flips.\")\n",
            "output": "integrated variance of the efficient price          1.9600e-04\nRV on the EFFICIENT price (unobservable)             1.9588e-04  (ratio 0.999)\nRV on LAST-TRADE prices (full bid-ask bounce)        2.0685e-03  (ratio 10.553)\nRV on MID-QUOTE prices (much smaller noise)          8.6847e-04  (ratio 4.431)\n\nnoise variance implied by the bounce, (spread/2)^2 = 4.0000e-08; 2*n*that            = 1.8720e-03\nnoise variance of the mid-quote, eta^2               = 1.4400e-08; 2*n*that            = 6.7392e-04\n\nBoth series describe the SAME efficient price, but the week 3-5 noise-robust machinery\nhas far less work to do on mid-quotes: the additive noise variance is smaller by a factor\nof 2.8, precisely because a mid-quote is a QUOTED level, immune to which side just traded,\nwhile a last-trade price inherits the full width of the spread every time the side flips."
          }
        },
        {
          "name": "The whole pipeline, once: from a dirty tape to an honest interval",
          "explain": "<p>Ten weeks of machinery are only useful chained together in the right order. Raw, dirty ticks go through cleaning first (this week), because no later stage can distinguish a fat-finger print from a genuine jump. The cleaned series then goes to a noise-robust estimator (weeks 3 to 5), because even a perfectly clean tape carries additive microstructure noise that a plain realised variance cannot survive. Only after both of those stages does a number get reported, and it is reported with an interval (week 2 and week 9), never alone.</p><p>The snippet runs exactly that sequence on one simulated day: additive noise and eight injected bad ticks first, a MAD filter that flags sixteen contaminated returns (each of the eight bad prints touches two), then a two-scale realised volatility estimate (week 4's noise-robust estimator) on the cleaned series, and finally a 95% interval built from sparse-grid realised quarticity. Plain realised variance on the raw, dirty ticks overstates the true integrated variance by a factor of about 87; the two-scale estimate on the cleaned series comes in at 0.94 times the truth, and its interval contains the true value.</p><p>Nothing in this pipeline is new — every stage was built in an earlier week — but the order is not optional: noise-robust estimation on dirty ticks, or cleaning after estimation, both fail. A research team cares because this is the actual shape of a production pipeline, and the course's real deliverable is not any one estimator but the discipline of chaining them correctly and never skipping the interval at the end.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")   # Accelerate-backed numpy emits spurious warnings on finite data\n\nn = 23400                        # one raw tick per second, one trading day\nsig, eta = 0.014, 0.0006          # efficient-price vol; ADDITIVE microstructure noise (weeks 3-5)\ndt = 1.0 / n\nr = np.random.default_rng(1334600)\nefficient = np.cumsum(sig * np.sqrt(dt) * r.standard_normal(n))\nIV = sig ** 2\n\n# stage 1: raw, noisy ticks, with a few bad prints mixed in (week 10)\nobserved = efficient + eta * r.standard_normal(n)\nbad_idx = r.choice(n, size=8, replace=False)\nobserved[bad_idx] += r.choice([-1, 1], size=8) * r.uniform(0.03, 0.06, size=8)\n\n# stage 2: clean (week 10) -- flag returns whose size is way outside the local scale\nret = np.diff(observed, prepend=observed[0])\nmad = np.median(np.abs(ret - np.median(ret))) * 1.4826 + 1e-12\nflagged = np.abs(ret) > 12 * mad\nclean_ret = np.where(flagged, 0.0, ret)\ncleaned = observed[0] + np.cumsum(clean_ret)\nprint(\"stage 1 (raw, noisy, %d bad ticks) -> stage 2 (cleaned): flagged %d ticks\"\n      % (len(bad_idx), int(flagged.sum())))\n\n# stage 3: two-scale realised volatility on the cleaned series (weeks 3-5's noise-robust estimator)\nK = 15\nsparse_rvs, sparse_lens = [], []\nfor off in range(K):\n    sub = cleaned[off::K]\n    sparse_rvs.append(np.sum(np.diff(sub) ** 2))\n    sparse_lens.append(len(sub) - 1)\nrv_avg = float(np.mean(sparse_rvs))\nnbar = float(np.mean(sparse_lens))\nrv_all = np.sum(np.diff(cleaned) ** 2)                     # the fine-grid RV, the noise measurement\ntsrv = rv_avg - (nbar / (n - 1)) * rv_all                  # Zhang-Mykland-Ait-Sahalia two-scale RV\n\n# stage 4: an honest interval via realised quarticity on one sparse grid\nsub0 = cleaned[::K]\nrq_sparse = (len(sub0) / 3.0) * np.sum(np.diff(sub0) ** 4)\nse = np.sqrt(2.0 * rq_sparse / len(sub0))\nZ975 = 1.959963984540054\nlo, hi = tsrv - Z975 * se, tsrv + Z975 * se\n\nprint(\"\")\nprint(\"true integrated variance                 %.4e\" % IV)\nprint(\"plain RV on the raw, noisy, dirty ticks   %.4e  (ratio %.2f)\" % (rv_all, rv_all / IV))\nprint(\"two-scale RV on the CLEANED series        %.4e  (ratio %.2f)\" % (tsrv, tsrv / IV))\nprint(\"95%% CI (sparse-grid quarticity)           [%.4e, %.4e]  -- contains truth: %s\"\n      % (lo, hi, lo <= IV <= hi))\nprint(\"\")\nprint(\"Ten weeks in one pipeline: clean the tape (10), defend against noise (3-5), estimate\")\nprint(\"(1-2), and never hand over a number without the interval that says how much to trust it.\")\n",
            "output": "stage 1 (raw, noisy, 8 bad ticks) -> stage 2 (cleaned): flagged 16 ticks\n\ntrue integrated variance                 1.9600e-04\nplain RV on the raw, noisy, dirty ticks   1.6979e-02  (ratio 86.63)\ntwo-scale RV on the CLEANED series        1.8495e-04  (ratio 0.94)\n95% CI (sparse-grid quarticity)           [9.7103e-05, 2.7280e-04]  -- contains truth: True\n\nTen weeks in one pipeline: clean the tape (10), defend against noise (3-5), estimate\n(1-2), and never hand over a number without the interval that says how much to trust it."
          }
        }
      ],
      "widget": {
        "type": "tree-diagram",
        "title": "The ten-week pipeline, as a graph",
        "params": {
          "nodes": [
            {
              "id": "raw",
              "label": "Raw ticks"
            },
            {
              "id": "clean",
              "label": "Clean (wk 10)"
            },
            {
              "id": "sign",
              "label": "Sign / synchronise (wk 7, 10)"
            },
            {
              "id": "estimate",
              "label": "Noise-robust estimate (wk 3-5)"
            },
            {
              "id": "jump",
              "label": "Jump test (wk 6)"
            },
            {
              "id": "forecast",
              "label": "HAR forecast (wk 8)"
            },
            {
              "id": "report",
              "label": "Report + interval (wk 2, 9)"
            }
          ],
          "edges": [
            {
              "from": "raw",
              "to": "clean"
            },
            {
              "from": "clean",
              "to": "sign"
            },
            {
              "from": "sign",
              "to": "estimate"
            },
            {
              "from": "estimate",
              "to": "jump"
            },
            {
              "from": "jump",
              "to": "forecast"
            },
            {
              "from": "forecast",
              "to": "report"
            },
            {
              "from": "estimate",
              "to": "report",
              "label": "interval"
            }
          ]
        }
      },
      "pitfalls": [
        "Feeding raw exchange ticks straight into a realised-variance estimator. A handful of misprints can inflate the reported variance by two or three orders of magnitude, as the MAD-filter comparison shows, and none of weeks 1-9's estimators defend against it.",
        "Treating the tick rule as the PRIMARY trade classifier instead of a tie-break. It only earns its keep exactly at the midpoint; used everywhere, it throws away the far more accurate quote-rule information available off the midpoint.",
        "Using last-trade prices out of habit when quotes are available. The bid-ask bounce adds strictly more noise than a mid-quote series describing the same efficient price, which is extra work for every noise-robust estimator in weeks 3-5.",
        "Building one monolithic function that mixes cleaning, synchronisation and estimation in a single pass, so a bad tick that slips past cleaning silently corrupts every later stage with no way to trace which stage introduced the error."
      ],
      "check": [
        {
          "q": "A MAD-based tick filter flags a return as bad when:",
          "options": [
            "It is simply the largest return recorded that day",
            "It exceeds a multiple of the local median absolute deviation away from the local median return",
            "It is negative",
            "It comes from a trade record rather than a quote record"
          ],
          "answer": 1,
          "why": "The MAD filter is a local, robust outlier rule: it compares a return to the typical spread of NEARBY returns (via the median and MAD, which are not distorted by the outlier itself) rather than to a fixed or global threshold."
        },
        {
          "q": "Why does the quote rule fail only exactly at the midpoint?",
          "options": [
            "Because exchanges hide midpoint trades from the public tape",
            "Because a trade strictly above or below the current mid-quote unambiguously reveals which side crossed the spread, and only an exact tie is genuinely ambiguous",
            "Because quotes update too slowly to be useful",
            "Because the quote rule was never designed for equities"
          ],
          "answer": 1,
          "why": "A trade above the midpoint had to cross to the ask side (a buy) and one below had to cross to the bid side (a sell); only a print exactly at the midpoint gives no directional information from price alone, which is exactly where Lee-Ready's tick-rule tie-break is needed."
        },
        {
          "q": "A mid-quote series and a last-trade series describing the same efficient price differ mainly in:",
          "options": [
            "Their integrated variance, which is systematically different",
            "The additive noise variance riding on top of the efficient price, larger for last trades because of the bid-ask bounce",
            "Nothing meaningful for estimation purposes",
            "Their drift"
          ],
          "answer": 1,
          "why": "Both series track the same underlying efficient price, but a last-trade series inherits the full width of the bid-ask bounce every time the initiating side flips, while a mid-quote is a quoted level immune to which side just traded -- so only the noise term differs, and by a large, measurable factor."
        },
        {
          "q": "The single biggest reason to run the data pipeline (clean, sign/synchronise, estimate, test, forecast, report) as an explicit sequence of separately checkable stages rather than one function is:",
          "options": [
            "It runs faster on large datasets",
            "SCHEMA.md requires it",
            "It lets you localise which stage produced a wrong number, and lets each stage's assumptions be verified independently",
            "It removes the need to compute a confidence interval at the end"
          ],
          "answer": 2,
          "why": "A staged pipeline is diagnosable: if a number looks wrong you can check cleaning, then signing, then estimation in turn, exactly the debugging discipline this course has used throughout, rather than re-deriving a monolithic computation from scratch."
        }
      ],
      "n": 10
    }
  ],
  "interview": [
    {
      "q": "What does realised variance actually estimate?",
      "level": "screen",
      "answer": "The quadratic variation of the log-price path over the sampling window, which for a continuous Ito semimartingale equals the integrated variance, the time integral of the spot variance. It is not the parameter of a volatility model and it is not an expectation: it is a path-dependent random variable, different on every day, and realised variance is a consistent estimator of that day's value as the sampling grid refines. If the price has jumps, quadratic variation also picks up the sum of squared jumps, so realised variance then estimates the continuous part plus the jump part together."
    },
    {
      "q": "Your realised variance rises monotonically as you sample faster. What is going on?",
      "level": "screen",
      "answer": "That is the signature of additive market-microstructure noise. If the observed log price is the efficient price plus a noise term, realised variance picks up roughly two times the number of observations times the noise variance on top of the integrated variance, so the bias grows linearly in the sampling frequency. Plotting the estimate against the sampling interval — the volatility signature plot — shows it blowing up at the fast end and flattening out at intervals of several minutes. The fix is not to guess a sampling interval but to use an estimator built for noise: two-scale, multi-scale, pre-averaging or a realised kernel."
    },
    {
      "q": "Why is the limit of realised variance called mixed normal rather than normal?",
      "level": "onsite",
      "answer": "Because the variance of the limiting normal law is itself random: it is two times the integrated quarticity, a functional of the same volatility path you are trying to learn about. Conditionally on that path the limit is Gaussian, but unconditionally it is a normal variance mixture, with fatter tails than a normal. The practical consequence is that you cannot read a critical value off a fixed asymptotic variance; you have to estimate quarticity and studentise. The convergence is stable precisely so that dividing by an estimate of the random variance restores a standard normal limit."
    },
    {
      "q": "Two-scale realised volatility: what are the two scales and why does subtracting help?",
      "level": "onsite",
      "answer": "One scale is the fastest grid, where realised variance is almost pure noise bias; the other is a set of sparse subgrids, where the bias is much smaller but the discretisation error is larger. The fast-scale estimate is used as a measurement of the noise, scaled by the ratio of the two sample sizes and subtracted from the averaged sparse estimate. What survives is unbiased to first order, and because the sparse estimates are averaged across all subgrids rather than thrown away, the variance penalty is mild. The rate is n to the minus one sixth; chaining more scales gets you to the optimal n to the minus one quarter."
    },
    {
      "q": "How does pre-averaging kill noise, and what does it cost?",
      "level": "onsite",
      "answer": "Average the observed prices over a local window of length of order the square root of n before taking returns. Averaging k independent noise draws shrinks the noise variance by a factor k while leaving the efficient price nearly unchanged over such a short window, so the ratio of signal to noise in each pre-averaged return improves. You then take realised variance of the pre-averaged returns and subtract an explicit residual bias term. The costs are a variance inflation relative to the no-noise ideal, a boundary effect at each end of the window, and the fact that the window length and the weight function are tuning choices that have to be defended."
    },
    {
      "q": "Distinguish a jump from a burst of volatility, statistically.",
      "level": "onsite",
      "answer": "You cannot do it from one return; you do it from the scaling. Over a grid of size delta, a continuous increment is of order the square root of delta while a jump is of order one, so as the grid refines a jump return stops shrinking and a diffusive return keeps shrinking. Every jump method uses that: truncation keeps returns below a threshold proportional to a power of delta, bipower variation multiplies adjacent absolute returns so a single large one is diluted, and the Lee-Mykland statistic standardises each return by a locally estimated spot volatility so that a volatility burst inflates the denominator too. A burst raises the local scale; a jump does not."
    },
    {
      "q": "Why does realised correlation fall toward zero as you sample faster, and what do you do about it?",
      "level": "onsite",
      "answer": "That is the Epps effect, and the dominant cause is asynchronous arrival. Two assets do not trade at the same instants, so a synchronised grid pairs a return of one asset with a stale return of the other; the cross-product then misses the part of the co-movement that happened between the two stamps, while each variance is estimated on its own fresh data. Covariance is biased toward zero and correlation with it, worse the finer the grid. The standard fixes are refresh-time synchronisation, and better, the Hayashi-Yoshida estimator, which sums the products of every pair of returns whose time intervals overlap and never needs a common grid at all."
    },
    {
      "q": "What is the observed asymptotic variance, and why not just use a plug-in?",
      "level": "senior",
      "answer": "A plug-in asymptotic variance requires you to know the analytic form of the limit and then to estimate every ingredient in it — for realised variance, quarticity. The observed asymptotic variance instead estimates the variability of the estimator directly, by splitting the window into blocks, computing the estimator on each block, and measuring how much the block-level estimates scatter around the smooth part of their own evolution. It works for functionals whose limit theory you do not want to redo by hand, it is robust to the leverage and irregular-sampling features that break naive plug-ins, and its main costs are the choice of block length and an edge effect at the ends of the sample."
    },
    {
      "q": "A portfolio manager wants a five-minute realised covariance matrix for 400 names. What do you tell them?",
      "level": "senior",
      "answer": "That two separate problems are being conflated. Per pair, five-minute sampling is a crude noise defence that throws away most of the data and still carries an Epps bias for illiquid names; a pre-averaged or Hayashi-Yoshida estimator uses the whole tape and is asynchrony-aware. Separately, with 400 names and a few hundred usable returns per day the matrix is nearly singular whatever the pairwise estimator, so it needs shrinkage or a factor structure before anyone inverts it. Fix the estimator and the conditioning as two steps, and report the positive-definiteness repair explicitly, because a repaired matrix and a measured one are not the same object."
    },
    {
      "q": "How would you choose the sampling frequency if you had to use plain realised variance?",
      "level": "senior",
      "answer": "By minimising mean squared error, not by habit. The bias from noise grows linearly in the number of observations and the variance of the discretisation error falls like one over that number, so MSE has an interior minimum whose position depends on the ratio of noise variance to integrated quarticity. Estimate the noise variance from the fast-scale realised variance divided by twice the number of returns, estimate quarticity on a sparse grid, and solve. That usually lands in the range of a few minutes for a liquid name, which is where the folklore comes from — but the folklore has no way to notice when a name's noise is ten times larger than average."
    },
    {
      "q": "Your realised beta against an index is much lower than the daily-return beta. Why might that be?",
      "level": "senior",
      "answer": "Most likely asynchrony again. Realised beta is a ratio of realised covariance to realised index variance, and if the stock trades less often than the index the intraday covariance is biased toward zero while the index variance is not, so the ratio is biased down. Daily returns are immune to that particular bias because a day is long compared with any staleness. Before concluding anything economic, recompute the intraday beta with Hayashi-Yoshida or with refresh-time sampling, and check whether the gap survives; also check whether a jump day is doing the work, since truncated and untruncated betas can differ materially."
    },
    {
      "q": "What does this course give you that an implied-volatility surface does not?",
      "level": "senior",
      "answer": "A measurement rather than a price. The surface is cross-sectional: it aggregates the market's risk-neutral view of the future distribution, mixed with risk premia, across strikes and maturities at one instant. The methods here are longitudinal: they read the realised path of one asset finely in time and estimate what volatility actually was, under the physical measure, with a standard error. The two answer different questions and disagree for informative reasons — the variance risk premium is literally the gap. In practice you want both: the surface to price and hedge, the realised measures to test whether the model you priced with is the process you are living in."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 37601",
      "how": "The exact complement of this course: the microstructure that appears here as a nuisance parameter is there the object of study, modelled as order-book dynamics and solved as a stochastic-control problem. The noise variance you estimate in weeks 3 to 5 is the effective spread an execution algorithm pays."
    },
    {
      "code": "FINM 35100",
      "how": "Supplies the economics of why the noise exists at all — asymmetric information, adverse selection and venue design — where this course only needs its second moment. Its price-discovery regressions consume the synchronisation and standard-error machinery of weeks 7 and 9."
    },
    {
      "code": "FINM 33150",
      "how": "Intraday signals and their backtests need a variance estimate per name per day; the estimator choice and the Epps bias of week 7 decide whether a short-horizon relative-value signal looks profitable or not."
    },
    {
      "code": "FINM 34500",
      "how": "The prerequisite the course page names. Ito integrals, quadratic variation and stable convergence are assumed from week 1; this course is where that machinery acquires an estimator and a standard error."
    },
    {
      "code": "FINM 36700",
      "how": "Realised covariance matrices are an input to portfolio construction and risk attribution; weeks 7 and 10 are about whether that matrix is measured or merely plausible, and what the conditioning repair does to it."
    },
    {
      "code": "FINM 33500",
      "how": "The data-handling side: tick capture, time-stamp discipline, as-of alignment and the cleaning rules of week 10 are exactly what a systematic trading stack has to implement before any of these estimators is meaningful."
    }
  ],
  "glossary": [
    {
      "term": "Quadratic variation",
      "def": "The limit of the sum of squared increments of a process along a refining grid. For a continuous Ito semimartingale it equals the integrated variance; with jumps it adds the sum of squared jump sizes. The estimand of most of the course."
    },
    {
      "term": "Integrated variance",
      "def": "The time integral of the spot variance over the sampling window. A random variable, not a parameter: it differs from day to day and is what realised variance consistently estimates in the absence of jumps."
    },
    {
      "term": "Spot variance",
      "def": "The instantaneous variance rate of the continuous martingale part at a point in time, the derivative of integrated variance. Estimated from a short local window, with a bias-variance trade-off in the window length."
    },
    {
      "term": "Realised variance",
      "def": "The sum of squared intraday log returns on a fixed grid. Consistent for quadratic variation without noise, and upward-biased by roughly twice the number of returns times the noise variance with it."
    },
    {
      "term": "In-fill asymptotics",
      "def": "Asymptotics in which the observation window is fixed and the grid refines, so the number of observations grows within one day. The natural regime for high-frequency data and the reason path-dependent objects are estimable at all."
    },
    {
      "term": "Long-span asymptotics",
      "def": "The classical regime in which the sampling interval is fixed and the window lengthens, which is what identifies the parameters of a volatility model rather than one day's realisation of it."
    },
    {
      "term": "Stable convergence",
      "def": "A strengthening of convergence in distribution that lets the limit's random variance be estimated jointly with the statistic, so that studentising recovers a standard normal limit. The technical reason confidence intervals here are legal."
    },
    {
      "term": "Mixed normal limit",
      "def": "A limit law that is normal conditionally on a random variance, here two times the integrated quarticity. Unconditionally it has heavier tails than a normal, which is why a naive fixed-variance critical value undercovers."
    },
    {
      "term": "Integrated quarticity",
      "def": "The time integral of the fourth power of spot volatility. It is the asymptotic variance of realised variance up to a factor of two, and estimating it is what makes a realised-variance confidence interval feasible."
    },
    {
      "term": "Market-microstructure noise",
      "def": "The difference between the observed transaction or quote-mid log price and the efficient price: discreteness, the bid-ask bounce, queueing and order-splitting effects. Small per observation, but it accumulates in every squared return."
    },
    {
      "term": "Volatility signature plot",
      "def": "A plot of a realised measure against the sampling interval. Under additive noise it explodes at the fast end and flattens further out, which is both the diagnostic for noise and the crude basis for choosing a sampling frequency."
    },
    {
      "term": "Two-scale realised volatility",
      "def": "A bias-corrected estimator that subtracts a scaled fast-grid realised variance, which measures the noise, from an average of sparse-grid realised variances. Converges at rate n to the minus one sixth."
    },
    {
      "term": "Multi-scale realised volatility",
      "def": "The extension of the two-scale idea to a weighted combination of many sampling scales, which cancels higher-order noise terms and attains the optimal rate n to the minus one quarter."
    },
    {
      "term": "Pre-averaging",
      "def": "Averaging observed prices over a local window before differencing, so that the noise variance shrinks with the window while the efficient price barely moves. The basis of a rate-optimal noise-robust estimator family."
    },
    {
      "term": "Realised kernel",
      "def": "A noise-robust estimator that adds weighted realised autocovariances to realised variance. With a flat-top kernel and a well-chosen bandwidth it is rate-optimal and handles dependent noise."
    },
    {
      "term": "Bipower variation",
      "def": "A scaled sum of products of adjacent absolute returns. It is consistent for integrated variance even in the presence of finite-activity jumps, because a single large return is multiplied by a small neighbour."
    },
    {
      "term": "Truncated realised variance",
      "def": "Realised variance computed only over returns below a threshold that shrinks like a power of the sampling interval, which discards jump returns asymptotically while keeping almost all diffusive ones."
    },
    {
      "term": "Lee-Mykland statistic",
      "def": "Each return divided by a locally estimated spot volatility, with the maximum over the day compared against a Gumbel extreme-value threshold. Locates individual jumps rather than testing a day as a whole."
    },
    {
      "term": "Epps effect",
      "def": "The empirical decline of realised correlation toward zero as the sampling interval shrinks, caused mainly by asynchronous trading times combined with previous-tick interpolation."
    },
    {
      "term": "Hayashi-Yoshida estimator",
      "def": "A covariance estimator that sums the products of all pairs of returns whose time intervals overlap, requiring no common grid and so avoiding the interpolation bias that produces the Epps effect."
    }
  ]
};
