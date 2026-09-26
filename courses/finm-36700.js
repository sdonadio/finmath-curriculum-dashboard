/* courses/finm-36700.js -- FINM 36700, Portfolio and Risk Management.
   Built from the public course page only. The syllabus is a Box shared link behind a
   university login and was not readable, so the ten-week arc, the explanations, the
   code, the questions, the interview set and the glossary are this dashboard's own
   reconstruction of a standard graduate treatment of the topics the public
   description names -- not the instructor's material, and not endorsed by anyone.
   Every code `output` is real stdout written by tools/run_snippets.py; do not edit
   those strings by hand. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 36700"] = {
  "code": "FINM 36700",
  "slug": "finm-36700",
  "title": "Portfolio and Risk Management",
  "instructor": "Mark Hendricks",
  "quarter": "Autumn",
  "units": 100,
  "block": "core",
  "concentrations": [],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/required-courses/finm-36700/",
    "syllabus_url": "https://uchicago.box.com/s/yno4d0hkfahvlk2kr12drwbsgx4s4nb1",
    "fetched": "2026-09-26",
    "note": "The only readable source for this course was the public course page: an official description of about 180 words plus the instructor, the quarter and the units. The syllabus PDF is a Box shared link restricted to a university login, so data/raw/syllabus/ is empty for this course and no syllabus text exists in this corpus. Everything below the description -- the ten-week arc, the concepts, the formulas, the code and its output, the pitfalls, the questions, the interview set and the glossary -- is this dashboard's own reconstruction of a standard graduate treatment of the topics the description names. None of it comes from the instructor, none of it was reviewed by the instructor, and nothing about grading, assignments, required readings, exam format or scheduling should be inferred from it."
  },
  "tier": "B",
  "description": "A core course of the degree. It opens with the classical foundations of portfolio theory -- mean-variance mathematics and the standard equity factor models used in attribution, risk management and pricing -- and then covers tail risk, long-run returns and the forecasting of returns. Advanced material extends to allocation beyond mean-variance optimisation, multivariate forecasting and cross-asset carry. The public description stresses that weekly applied problems on real data and case studies are central, and that model selection, interpretation and implementation are emphasised throughout: the goal is a foundation in portfolio theory built from finance, mathematics, statistics and computing together.",
  "prerequisites": [
    "Linear algebra you can compute with: quadratic forms, inverses, eigenvalues of a symmetric matrix, and what a projection is. Almost every result in the course is a statement about a quadratic form in a covariance matrix.",
    "Probability through conditional expectation, plus the sampling distributions of a mean and a variance. Estimation error is the subject of weeks 3, 4 and 7, not a caveat at the end of them.",
    "Ordinary least squares in matrix form, including standard errors and what an intercept means. The CAPM, factor attribution, hedging and return forecasting are all one regression each.",
    "Python with numpy at the level of solving a linear system, taking a Cholesky factor and running a simulation loop without an IDE. pandas for aligning and resampling real return series.",
    "Basic finance vocabulary: excess return, risk-free rate, long and short, notional, leverage."
  ],
  "textbooks": [
    {
      "title": "Active Portfolio Management",
      "author": "Richard Grinold and Ronald Kahn",
      "note": "A standard reference for this material: information ratio, the fundamental law, residual risk and returns-based attribution as the course treats them in weeks 6 and 10."
    },
    {
      "title": "Asset Management: A Systematic Approach to Factor Investing",
      "author": "Andrew Ang",
      "note": "A standard reference for the factor-model, allocation and long-run-returns material in weeks 2, 5, 6 and 10."
    },
    {
      "title": "Quantitative Risk Management: Concepts, Techniques and Tools",
      "author": "Alexander McNeil, Ruediger Frey and Paul Embrechts",
      "note": "A standard reference for weeks 8 and 9: coherent risk measures, VaR and expected shortfall, backtesting, extreme value theory and the peaks-over-threshold method."
    },
    {
      "title": "Asset Pricing",
      "author": "John H. Cochrane",
      "note": "A standard reference for the pricing side of the factor material and for the return-predictability discussion in weeks 5 and 7."
    },
    {
      "title": "The Econometrics of Financial Markets",
      "author": "John Campbell, Andrew Lo and Craig MacKinlay",
      "note": "A standard reference for the CAPM test statistics of week 5, including the GRS test, and for the predictive-regression econometrics of week 7."
    },
    {
      "title": "Expected Returns",
      "author": "Antti Ilmanen",
      "note": "A standard reference for long-run returns, risk premia and the cross-asset carry material the public description names."
    }
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
  ],
  "brushup": [
    {
      "topic": "Quadratic forms and the inverse of a covariance matrix",
      "why": "Every closed form in the course is a quadratic form. The maximum squared Sharpe ratio is mu' Sigma-inverse mu; the minimum-variance weights are Sigma-inverse 1 normalised; risk contributions are w times Sigma w. If those expressions are shapes you have to decode rather than read, weeks 2 to 4 will feel like a list of formulas instead of one idea.",
      "resource": "Strang, Introduction to Linear Algebra, the chapters on symmetric matrices and positive definiteness; then write mu' Sigma-inverse mu for a 2x2 by hand."
    },
    {
      "topic": "The sampling distribution of a sample mean",
      "why": "The central fact of the course is that a mean return is estimated with a standard error of sigma over root T, which for equities is about the size of the mean itself over any sample you will ever have. Week 3 is that sentence turned into a portfolio.",
      "resource": "Any mathematical statistics text on the distribution of the sample mean; then compute the standard error of a 10-year average monthly equity return."
    },
    {
      "topic": "OLS in matrix form, with standard errors",
      "why": "Weeks 5, 6 and 7 are regressions. You need to be able to read an intercept as an alpha, a slope as a beta or a hedge ratio, the residual variance as tracking error, and the standard error as the reason a result may be noise.",
      "resource": "Any econometrics text on the multiple regression model; then derive the variance of the OLS intercept."
    },
    {
      "topic": "Eigenvalues of a symmetric matrix, and conditioning",
      "why": "The plug-in optimiser fails because it inverts a matrix whose smallest estimated eigenvalues are almost pure noise. Understanding that inversion divides by eigenvalues makes the failure obvious rather than mysterious.",
      "resource": "Strang on the spectral theorem; then compute the condition number of a sample covariance matrix with p close to T."
    },
    {
      "topic": "Quantiles, and the difference between a quantile and a tail mean",
      "why": "Week 8 hinges on the fact that Value-at-Risk is a quantile and expected shortfall is a conditional mean beyond it. Coherence, subadditivity and backtesting all follow from which of the two you chose.",
      "resource": "Any probability text on quantile functions; then compute both for a two-point loss distribution by hand."
    },
    {
      "topic": "The chi-squared and F distributions",
      "why": "The Kupiec coverage test in week 8 is a chi-squared with one degree of freedom and the GRS test in week 5 is an F. Knowing where the degrees of freedom come from is what stops a backtest report being a number you cannot defend.",
      "resource": "Any statistics text on likelihood-ratio tests and Wald tests; then verify the asymptotic chi-squared by simulation."
    },
    {
      "topic": "numpy: solve, cholesky, and simulating correlated returns",
      "why": "Every snippet in this course simulates a covariance structure and then estimates it back. Being fluent with np.linalg.solve rather than explicit inverses, and with a Cholesky factor as a way to generate correlated draws, makes the code short enough to read.",
      "resource": "The numpy linalg documentation; then generate 120 months of returns for 25 correlated assets in three lines."
    },
    {
      "topic": "pandas time-series alignment and resampling",
      "why": "The applied side of this material is dominated by joins that silently drop rows and by monthly-versus-daily mismatches. A misaligned index is the most common source of a result that looks too good.",
      "resource": "The pandas user guide on time-series and on merge/join semantics; then resample a daily series to monthly returns two different ways and reconcile them."
    }
  ],
  "interview": [
    {
      "q": "Why does mean-variance optimisation perform so badly out of sample?",
      "level": "screen",
      "answer": "Because it treats estimates as if they were parameters. The optimiser maximises the Sharpe ratio of the sample it was given, and the sample's best portfolio is largely a bet on which assets happened to do well. Inverting an estimated covariance divides by its smallest eigenvalues, which are the noisiest directions, so the weights load on estimation error rather than averaging it away. With 25 assets and ten years of monthly data a simulation with a correctly specified model recovers about a quarter of the available Sharpe and loses to equal weighting in essentially every sample. Almost all the damage comes from the mean vector, not the covariance."
    },
    {
      "q": "A colleague reports a Sharpe ratio of 0.9 from three years of monthly data. How do you respond?",
      "level": "screen",
      "answer": "I would ask for the standard error. Under iid returns the standard error of a Sharpe estimate is roughly the square root of one plus half the squared Sharpe over T, which for 36 months is about 0.58 annualised. So 0.9 plus or minus two standard errors runs from below zero to above two, and the result is not distinguishable from no skill. I would also ask about skewness, because the moment-adjusted standard error is fifteen per cent wider for a realistically left-skewed series, and about autocorrelation, since smoothed returns inflate a Sharpe ratio through the annualisation step."
    },
    {
      "q": "What does it mean to say a strategy's value to us is its information ratio?",
      "level": "onsite",
      "answer": "If we already hold a set of factors or benchmark assets, the increase in our maximum squared Sharpe ratio from adding a strategy equals the square of its alpha divided by its residual volatility against what we hold. That ratio is the appraisal ratio, or in factor language the information ratio. Its standalone Sharpe ratio is irrelevant: a strategy with a Sharpe of one that is ninety-five per cent correlated with our book adds almost nothing, while one with a Sharpe of 0.3 and no correlation can add a lot. Sharpe ratios add in quadrature, and that identity is exact, not an approximation."
    },
    {
      "q": "Explain why a long-only constraint can improve realised performance.",
      "level": "onsite",
      "answer": "Under known moments it cannot: constraints shrink the feasible set, so the attainable Sharpe can only fall. Under estimated moments it usually does, because the constraint stops the optimiser acting on estimation error. Jagannathan and Ma showed the constrained minimum-variance problem is equivalent to the unconstrained problem with a covariance matrix modified where the constraints bind, so the constraint is a statistical regulariser in disguise. In simulation the unconstrained plug-in had a median true Sharpe of 0.13 with a fifth percentile below zero; long-only raised the median to 0.29 and the fifth percentile to 0.19."
    },
    {
      "q": "Your firm aggregates desk-level VaRs by adding them. What is wrong with that?",
      "level": "onsite",
      "answer": "VaR is not subadditive, so the sum of desk VaRs is not an upper bound on portfolio VaR. The standard counterexample is two independent positions each with a four per cent chance of a large loss: at ninety-five per cent each has a VaR that misses its own tail event, while the combination has nearly an eight per cent chance of at least one loss and so a much larger VaR. Adding the parts therefore understates the whole. Expected shortfall averages over the entire tail and is subadditive, which is one of the reasons the Basel market-risk framework moved to it."
    },
    {
      "q": "How would you backtest a 99% one-day VaR model?",
      "level": "onsite",
      "answer": "Count breaches and run two tests. Kupiec's proportion-of-failures test is a likelihood ratio on the binomial breach rate, asymptotically chi-squared with one degree of freedom. Christoffersen's independence test fits a two-state Markov chain to the breach indicator and asks whether a breach today depends on a breach yesterday; together they give conditional coverage. Both matter, because a static VaR on clustered-volatility data can show a defensible count while all its breaches arrive in one fortnight. I would also state the power: over 250 days the five per cent acceptance region for a 99% model is one to six breaches, so a one-year pass is weak evidence."
    },
    {
      "q": "Why is the empirical security market line flatter than the CAPM predicts?",
      "level": "senior",
      "answer": "Part of it is mechanical. The second-pass cross-sectional regression uses estimated betas, and a regressor measured with error attenuates the slope by the ratio of true beta variance to true plus error variance. In a simulation with the CAPM exactly true, one hundred assets and five years of data, the fitted slope came out at 73 per cent of the true premium, matching the errors-in-variables prediction. The usual remedy is to sort assets into portfolios, which cut the beta error variance by a factor of eleven and restored the slope to 98 per cent of the truth, provided the ranking window is independent of the test window. Whatever flatness survives that correction is the economic question."
    },
    {
      "q": "A predictive regression of equity returns on the dividend yield gives a t-statistic of 2.3. How much do you believe it?",
      "level": "senior",
      "answer": "Less than 2.3 suggests. The dividend yield is highly persistent and its innovation is strongly negatively correlated with returns, so the Stambaugh bias inflates the slope: in a simulation with persistence 0.97 and innovation correlation minus 0.9, twenty-two per cent of the average estimated slope was pure bias, and the closed-form prediction matched the simulation. I would want a bootstrap under the null that imposes the persistence, and more importantly an out-of-sample R-squared against the prevailing mean. In simulation a correctly specified model with a true monthly R-squared of half a per cent had a negative out-of-sample R-squared at twenty years of data."
    },
    {
      "q": "What does a 20% maximum drawdown tell you about a manager?",
      "level": "senior",
      "answer": "Almost nothing without the horizon. Maximum drawdown grows with the observation window even for a constant positive Sharpe ratio. For a strategy with a true annual Sharpe of 0.5 and fifteen per cent volatility, the median maximum drawdown is ten per cent over one year, twenty-one per cent over five years and thirty-four per cent over twenty. The chance of ever exceeding twenty per cent is eight per cent at one year and ninety-eight per cent at twenty. So a twenty per cent drawdown in year one is a tail event and in year fifteen is a median outcome, and a limit written without a horizon will be breached by the strategy it was designed to protect."
    },
    {
      "q": "How do you decide between the sample covariance matrix, Ledoit-Wolf shrinkage and a factor model?",
      "level": "senior",
      "answer": "By the portfolios they produce, not by a matrix norm. In a forty-asset, ten-year simulation, shrinkage improved the Frobenius error by only five per cent but cut the realised minimum-variance volatility from 14.3 to 13.4 per cent against an 11.8 per cent floor, because the portfolio uses the inverse and shrinkage fixes the small eigenvalues. A factor model imposes more structure and helps more when p over T is large and the factor structure is real, and hurts when it is not. In practice I would evaluate candidates on out-of-sample realised volatility of the minimum-variance portfolio and on the stability of the weights, and I would report the condition number of anything I intended to invert."
    },
    {
      "q": "Two allocation rules have gross Sharpe ratios of 0.9 and 0.7. Which do you run?",
      "level": "onsite",
      "answer": "Not decidable from that. I would want turnover, gross exposure, capacity and the cost assumption. In a thirty-year simulation with every rule levered to the same volatility target and ten basis points per unit of turnover, the plug-in optimiser's cost drag was twenty-seven times equal weighting's, purely because re-estimating the mean vector moves the target weights every month. I would also want the standard errors on both Sharpe ratios, since at ten years of monthly data the standard error is about 0.32 and a 0.2 gap is well inside noise. Net of cost, with error bars, and with the leverage stated is the only comparison I would act on."
    },
    {
      "q": "You are asked to justify a risk-parity allocation to an investment committee. What do you say, and what do you warn them about?",
      "level": "senior",
      "answer": "The case is that capital weights and risk shares are different objects: a 60/40 portfolio holds ninety-two per cent of its risk in equities, so it is a single-bet portfolio described as a diversified one. Equalising risk contributions removes that concentration and is estimation-free, which in simulation made its outcome two orders of magnitude more stable across samples than an optimised portfolio. The warnings are that it needs about 1.5 times leverage to reach a ten per cent volatility target, which brings a financing cost and a margin-call path the covariance matrix never saw; that it implicitly assumes equal Sharpe ratios across assets; and that its measured Sharpe advantage over 60/40 in the simulation was 0.354 against 0.375, which is to say inside the error bars."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 34700",
      "how": "That course supplies the estimation machinery this one consumes: shrinkage and random-matrix filtering of covariance matrices, principal components, and the multiple-testing correction that weeks 3, 4, 5 and 7 all lean on."
    },
    {
      "code": "FINM 33150",
      "how": "Strategy research there is portfolio construction under the constraints of weeks 3, 4 and 10: Sharpe estimation error, turnover and transaction costs, and the out-of-sample discipline of week 7."
    },
    {
      "code": "FINM 37400",
      "how": "Curve risk is the factor-model idea of weeks 5 and 6 applied to maturities, and duration hedging is the regression hedge of week 6 with the basis risk left behind."
    },
    {
      "code": "FINM 33160",
      "how": "Machine-learning return forecasting faces exactly the week 7 problem: a tiny true R-squared, the prevailing mean as the benchmark, and out-of-sample validation as the only evidence that counts."
    },
    {
      "code": "FINM 34800",
      "how": "The constrained quadratic programs of weeks 2 and 4 are the applied face of that course's optimisation theory, including how constraints change a solution's structure and its sensitivity to inputs."
    },
    {
      "code": "FINM 35700",
      "how": "Credit portfolios are the natural home of weeks 8 and 9: the VaR subadditivity counterexample is built from defaultable bonds, and tail modelling is unavoidable when losses are lumpy."
    }
  ],
  "glossary": [
    {
      "term": "Volatility drag",
      "def": "The gap between an arithmetic mean simple return and the compound growth rate it delivers, approximately half the variance. At 20% volatility it is two per cent a year."
    },
    {
      "term": "Efficient frontier",
      "def": "The set of portfolios with minimum variance for each attainable mean. Without a risk-free asset it is a parabola in mean-variance space, determined by the three scalars one-Sigma-inverse-one, one-Sigma-inverse-mu and mu-Sigma-inverse-mu."
    },
    {
      "term": "Tangency portfolio",
      "def": "The risky portfolio with the highest Sharpe ratio, with weights proportional to Sigma-inverse times the excess-return vector. With a risk-free asset every investor holds it, levered to taste."
    },
    {
      "term": "Appraisal ratio",
      "def": "Alpha divided by residual volatility against a benchmark set. Its square is exactly the increment to maximum squared Sharpe from adding the asset, which makes it the only correct measure of what a new strategy is worth."
    },
    {
      "term": "Plug-in optimiser",
      "def": "Mean-variance optimisation with sample estimates substituted for the true moments. Its out-of-sample Sharpe ratio is far below the population optimum and typically below equal weighting at realistic sample sizes."
    },
    {
      "term": "Error maximisation",
      "def": "Michaud's description of what an optimiser does with an estimated covariance matrix: inversion divides by the smallest sample eigenvalues, so the largest weights land on the least reliably estimated directions."
    },
    {
      "term": "Ledoit-Wolf shrinkage",
      "def": "Linear combination of the sample covariance with a structured target, at an intensity estimated from the data to minimise expected squared error. It improves the inverse far more than it improves the matrix."
    },
    {
      "term": "Bayes-Stein mean",
      "def": "Jorion's shrinkage of sample mean returns toward the minimum-variance portfolio's mean, with intensity rising when the cross-sectional spread of the sample means is small relative to their noise."
    },
    {
      "term": "Jagannathan-Ma equivalence",
      "def": "The result that a no-short constraint on a minimum-variance problem is equivalent to the unconstrained problem with a modified covariance matrix, so the constraint acts as a statistical regulariser."
    },
    {
      "term": "Equal risk contribution",
      "def": "A portfolio in which every asset contributes the same amount to portfolio volatility. It has no closed form but converges from the fixed point that sets each weight proportional to the reciprocal of its marginal risk."
    },
    {
      "term": "Information ratio",
      "def": "Alpha divided by tracking error against a benchmark. Squared Sharpe ratios add, so an active manager's contribution to a factor investor's Sharpe is exactly this quantity in quadrature."
    },
    {
      "term": "GRS test",
      "def": "The exact F test of the joint hypothesis that all alphas in a set of time-series factor regressions are zero. Its statistic is monotone in the Sharpe improvement the test assets would add to the factors."
    },
    {
      "term": "Errors-in-variables attenuation",
      "def": "The bias toward zero in a regression slope when the regressor is measured with error, by the factor var(true) over var(true) plus var(error). It flattens a fitted security market line built on estimated betas."
    },
    {
      "term": "Stambaugh bias",
      "def": "The upward bias in a predictive-regression slope caused by the downward bias in the estimated persistence of the predictor combined with a negative correlation between predictor and return innovations."
    },
    {
      "term": "Out-of-sample R-squared",
      "def": "One minus the ratio of a model's squared forecast errors to those of the prevailing mean, computed with expanding-window estimates. Negative values mean the model was worse than a running average."
    },
    {
      "term": "Expected shortfall",
      "def": "The mean loss conditional on exceeding the VaR level. Unlike VaR it is subadditive and therefore coherent, and it is sensitive to the whole tail rather than one point of it."
    },
    {
      "term": "Kupiec test",
      "def": "A likelihood-ratio test that the realised VaR breach rate equals the claimed one, asymptotically chi-squared with one degree of freedom. Over 250 days its acceptance region for a 99% model runs from one to six breaches."
    },
    {
      "term": "Christoffersen independence test",
      "def": "A likelihood-ratio test that a VaR breach today is independent of a breach yesterday, fitted as a two-state Markov chain. Combined with Kupiec it gives conditional coverage."
    },
    {
      "term": "Peaks over threshold",
      "def": "Extreme value method that fits a generalised Pareto distribution to the excesses above a high threshold, which allows quantile estimation beyond the largest observation in the sample."
    },
    {
      "term": "Maximum drawdown",
      "def": "The worst peak-to-trough loss over a period. It grows with the observation window even for a constant positive Sharpe ratio, so a drawdown limit is implicitly a statement about horizon."
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "Returns, compounding and the long run",
      "topics": [
        "arithmetic versus log returns",
        "volatility drag and the geometric mean",
        "annualisation and the square-root rule",
        "the Sharpe ratio and its standard error",
        "higher moments and Sharpe inference"
      ],
      "concepts": [
        {
          "name": "Arithmetic and geometric returns are different objects",
          "explain": "<p>A portfolio has two averages and they answer different questions. The arithmetic mean of simple returns is what you need to price a single future period: it is the expectation that appears in every mean-variance formula. The geometric mean, the compound annual growth rate, is what you need to describe a multi-period outcome: it is the rate at which the typical path actually grew. For any series with dispersion the geometric mean is strictly lower, and the gap is called volatility drag.</p> <p>The approximation worth memorising is that the mean log return is about the arithmetic mean minus half the variance. The snippet takes a nine per cent arithmetic mean with twenty per cent volatility, simulates forty years of monthly returns twenty thousand times, and reads off the pieces. The arithmetic mean comes back at 0.0899. The mean log return comes back at 0.0697, essentially the 0.0700 the drag rule predicts. The median realised compound growth rate is 0.0722, which is exactly the drag rule pushed back through the exponential. Half the volatility, two per cent a year, has vanished into the difference between the two averages.</p> <p>The same run shows why the mean is not the forecast: mean terminal wealth is 36 times the initial stake and median terminal wealth is 16 times it, because the distribution of compound outcomes is right-skewed. A desk cares because the two numbers get quoted interchangeably in marketing material and in risk limits, and a client who was sold an arithmetic mean and lived a geometric one has a legitimate complaint.</p>",
          "formula": "\\mathbb{E}[\\log(1+R)] \\approx \\mu - \\tfrac{1}{2}\\sigma^2, \\qquad g = \\exp\\!\\big(\\mathbb{E}[\\log(1+R)]\\big) - 1",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(7)\nmu_a, sig_a = 0.09, 0.20                 # annual arithmetic mean and vol of a SIMPLE return\nyears, paths = 40, 20000\nr = rng.normal(mu_a / 12.0, sig_a / np.sqrt(12.0), size=(years * 12, paths))\n\nwealth = np.prod(1.0 + r, axis=0)\ncagr = wealth ** (1.0 / years) - 1.0\n\nprint(f\"arithmetic mean, annualised        {12.0 * r.mean():8.4f}\")\nprint(f\"mean log return, annualised        {12.0 * np.log1p(r).mean():8.4f}\")\nprint(f\"mu - sigma^2/2  (the drag rule)    {mu_a - sig_a ** 2 / 2:8.4f}\")\nprint(f\"median realised CAGR over {years}y     {np.median(cagr):8.4f}\")\nprint(f\"exp(mu - sigma^2/2) - 1            {np.expm1(mu_a - sig_a ** 2 / 2):8.4f}\")\nprint(f\"P(wealth < 1 after {years}y)           {np.mean(wealth < 1.0):8.4f}\")\nprint(f\"mean terminal wealth {wealth.mean():8.2f}   median {np.median(wealth):8.2f}\"\n      \"   <- the mean is not the typical outcome\")\n",
            "output": "arithmetic mean, annualised          0.0899\nmean log return, annualised          0.0697\nmu - sigma^2/2  (the drag rule)      0.0700\nmedian realised CAGR over 40y       0.0722\nexp(mu - sigma^2/2) - 1              0.0725\nP(wealth < 1 after 40y)             0.0138\nmean terminal wealth    36.06   median    16.26   <- the mean is not the typical outcome"
          }
        },
        {
          "name": "Annualisation is an assumption, not a conversion",
          "explain": "<p>Everybody multiplies a monthly volatility by the square root of twelve. That step is exact only if returns are serially uncorrelated. The variance of a sum of twelve returns is twelve times the single-period variance plus twice the sum of all the autocovariances, so any persistence in returns makes the square-root rule wrong, and wrong in a direction that depends on the sign of the autocorrelation.</p> <p>The snippet simulates an AR(1) monthly return series at four values of the autocorrelation and compares the scaled-up monthly volatility with the volatility of the actual twelve-month sums. At zero autocorrelation the ratio is 1.018, which is sampling noise around one. At an autocorrelation of 0.20 the true annual volatility is 1.18 times the scaled monthly number, and at 0.45 it is 1.55 times. The closed-form inflation factor printed alongside matches to two decimals in every case. Negative autocorrelation runs the other way: at minus 0.20 the square-root rule overstates annual risk by sixteen per cent.</p> <p>This matters far more than it looks. Illiquid or marked-to-model assets -- private credit, real estate, some hedge fund strategies -- report smoothed returns, which is positive autocorrelation by construction. Annualising their monthly volatility with the square-root rule understates their risk and overstates their Sharpe ratio, and the overstatement is exactly the factor this snippet measures.</p>",
          "formula": "\\operatorname{Var}\\Big(\\sum_{t=1}^{h} r_t\\Big) = h\\sigma^2\\Big(1 + \\tfrac{2}{h}\\sum_{k=1}^{h-1}(h-k)\\rho^k\\Big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(11)\nT = 12 * 4000\nprint(\" rho    monthly vol   x sqrt(12)   true annual vol   inflation  theory\")\nfor rho in (-0.20, 0.0, 0.20, 0.45):\n    e = rng.normal(size=T)\n    x = np.empty(T)\n    prev = 0.0\n    for t in range(T):                                # AR(1) monthly excess returns\n        prev = rho * prev + e[t]\n        x[t] = prev\n    m_vol = x.std(ddof=1)\n    ann = x[: (T // 12) * 12].reshape(-1, 12).sum(axis=1)\n    a_vol = ann.std(ddof=1)\n    theory = np.sqrt(1.0 + 2.0 * sum((12 - k) * rho ** k for k in range(1, 12)) / 12.0)\n    print(f\"{rho:5.2f} {m_vol:12.4f} {m_vol * np.sqrt(12):12.4f} {a_vol:17.4f}\"\n          f\" {a_vol / (m_vol * np.sqrt(12)):11.3f} {theory:7.3f}\")\nprint(\"sqrt(12) is exact only at rho = 0; positive autocorrelation makes it understate\")\n",
            "output": " rho    monthly vol   x sqrt(12)   true annual vol   inflation  theory\n-0.20       1.0185       3.5281            2.9594       0.839   0.831\n 0.00       1.0023       3.4719            3.5332       1.018   1.000\n 0.20       1.0183       3.5275            4.1723       1.183   1.203\n 0.45       1.1120       3.8521            5.9615       1.548   1.545\nsqrt(12) is exact only at rho = 0; positive autocorrelation makes it understate"
          }
        },
        {
          "name": "The Sharpe ratio is an estimate with a large standard error",
          "explain": "<p>A Sharpe ratio is a ratio of two estimates, and under independent and identically distributed returns its standard error is approximately the square root of one plus half the squared Sharpe, divided by the number of observations. In annual terms that means the standard error of a Sharpe estimated from T months is roughly the square root of twelve over T. Everything uncomfortable about performance evaluation follows.</p> <p>The snippet simulates a strategy whose true annual Sharpe is exactly 0.50 and estimates it from three, five, ten and twenty years of monthly data. At five years the standard deviation of the estimate is 0.456, so a two-standard-deviation band runs from below zero to about 1.4. The formula matches the Monte Carlo standard deviation closely at every horizon. The last column is the one to remember: a one-sided five per cent test rejects a zero Sharpe in 20 per cent of five-year samples and 36 per cent of ten-year samples. A genuinely good strategy fails its own significance test most of the time for a decade.</p> <p>This is the statistical reason performance evaluation is hard, and the reason a three-year track record carries almost no information. It is also why week 10 treats the maximum drawdown of a positive-Sharpe strategy as a normal event rather than evidence of a broken model.</p>",
          "formula": "\\operatorname{se}\\big(\\widehat{SR}\\big) \\approx \\sqrt{\\frac{1 + \\tfrac{1}{2}SR^2}{T}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(13)\nsr_ann, sims = 0.50, 40000\nprint(\"  years   mean SR-hat   sd SR-hat   iid formula   P(t > 1.96)\")\nfor years in (3, 5, 10, 20):\n    T = 12 * years\n    sr_m = sr_ann / np.sqrt(12.0)\n    r = rng.normal(sr_m, 1.0, size=(T, sims))          # unit monthly vol, so mean = SR\n    sh = r.mean(axis=0) / r.std(axis=0, ddof=1)\n    se_formula = np.sqrt((1.0 + sr_m ** 2 / 2.0) / T)\n    tstat = sh * np.sqrt(T)\n    print(f\"{years:7d} {np.sqrt(12) * sh.mean():13.4f} {np.sqrt(12) * sh.std(ddof=1):11.4f}\"\n          f\" {np.sqrt(12) * se_formula:13.4f} {np.mean(tstat > 1.96):13.3f}\")\nprint(f\"a true annual Sharpe of {sr_ann} is missed by a one-sided 5% test most of the time\")\nprint(\"until about a decade of monthly data has accumulated\")\n",
            "output": "  years   mean SR-hat   sd SR-hat   iid formula   P(t > 1.96)\n      3        0.5127      0.6017        0.5803         0.148\n      5        0.5054      0.4556        0.4495         0.204\n     10        0.5044      0.3205        0.3179         0.358\n     20        0.5005      0.2247        0.2248         0.608\na true annual Sharpe of 0.5 is missed by a one-sided 5% test most of the time\nuntil about a decade of monthly data has accumulated"
          }
        },
        {
          "name": "Skewness and kurtosis widen the error bars further",
          "explain": "<p>The standard error above assumes independent normal returns. Real return series are negatively skewed and fat tailed, and both features inflate the sampling variability of a Sharpe estimate. The standard correction, due to Lo, adds a skewness term and an excess-kurtosis term to the numerator: negative skewness raises the standard error, and so does excess kurtosis.</p> <p>The snippet checks the correction against Monte Carlo for three return laws with the same mean and variance and the same true Sharpe. For normal returns the Monte Carlo standard deviation is 0.0928 and the iid formula gives 0.0918. For standardised Student-t with five degrees of freedom the truth is 0.0934 and the naive formula still says 0.0918, while the moment-adjusted formula gives 0.0932. For a two per cent jump mixture with skewness minus 1.85 and excess kurtosis 8.78, the truth is 0.1062, the naive formula still says 0.0918, and the adjusted formula gives 0.1050. The naive standard error understates the uncertainty by fifteen per cent for the realistic case.</p> <p>Fifteen per cent on a standard error is the difference between a t-statistic of 2.1 and one of 1.8. A team that reports Sharpe ratios for option-selling or carry strategies -- both strongly negatively skewed -- and computes the error bars under normality is systematically overstating its confidence in exactly the strategies whose risk is hardest to see.</p>",
          "formula": "\\operatorname{se}\\big(\\widehat{SR}\\big) \\approx \\sqrt{\\frac{1 + \\tfrac{1}{2}SR^2 - \\gamma_3 SR + \\tfrac{1}{4}(\\gamma_4-3)SR^2}{T}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\nrng = np.random.default_rng(17)\nT, sims, sr_ann = 120, 40000, 0.50\nsr_m = sr_ann / np.sqrt(12.0)\n\ndef sharpe_se(sr, T, skew, exkurt):\n    \"\"\"Lo-style adjustment: iid-normal SE corrected for skewness and excess kurtosis.\"\"\"\n    return np.sqrt((1.0 + sr ** 2 / 2.0 - skew * sr + exkurt * sr ** 2 / 4.0) / T)\n\nfor name, draw, sk, ek in (\n        (\"normal\", lambda n: rng.normal(size=n), 0.0, 0.0),\n        (\"t(5) standardised\", lambda n: rng.standard_t(5, size=n) / np.sqrt(5 / 3.0), 0.0, 6.0),\n        (\"left-skewed mixture\", None, None, None)):\n    if draw is None:\n        def draw(n, rng=rng):\n            z = rng.normal(size=n)\n            jump = (rng.random(size=n) < 0.02) * (-4.0 - 2.0 * np.abs(rng.normal(size=n)))\n            x = z + jump\n            return (x - x.mean()) / x.std()\n        smp = draw(400000)\n        sk, ek = stats.skew(smp), stats.kurtosis(smp)\n    x = draw(T * sims).reshape(T, sims) + sr_m\n    sh = x.mean(axis=0) / x.std(axis=0, ddof=1)\n    mc = sh.std(ddof=1)\n    print(f\"{name:20s} skew {sk:6.2f}  excess kurt {ek:6.2f}\")\n    print(f\"   Monte Carlo sd(SR-hat)   {mc:.5f}\")\n    print(f\"   iid-normal formula       {sharpe_se(sr_m, T, 0.0, 0.0):.5f}\")\n    print(f\"   moment-adjusted formula  {sharpe_se(sr_m, T, sk, ek):.5f}\")\n",
            "output": "normal               skew   0.00  excess kurt   0.00\n   Monte Carlo sd(SR-hat)   0.09283\n   iid-normal formula       0.09176\n   moment-adjusted formula  0.09176\nt(5) standardised    skew   0.00  excess kurt   6.00\n   Monte Carlo sd(SR-hat)   0.09340\n   iid-normal formula       0.09176\n   moment-adjusted formula  0.09317\nleft-skewed mixture  skew  -1.85  excess kurt   8.78\n   Monte Carlo sd(SR-hat)   0.10621\n   iid-normal formula       0.09176\n   moment-adjusted formula  0.10499"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Arithmetic mean, geometric mean and the drag between them",
        "params": {
          "xlab": "Annual volatility (%)",
          "ylab": "Annual return (%)",
          "log": false,
          "series": [
            {
              "name": "Arithmetic mean (fixed at 9%)",
              "x": [
                0,
                5,
                10,
                15,
                20,
                25,
                30,
                35,
                40
              ],
              "y": [
                9,
                9,
                9,
                9,
                9,
                9,
                9,
                9,
                9
              ]
            },
            {
              "name": "Geometric mean, mu - sigma^2/2",
              "x": [
                0,
                5,
                10,
                15,
                20,
                25,
                30,
                35,
                40
              ],
              "y": [
                9.0,
                8.88,
                8.5,
                7.88,
                7.0,
                5.88,
                4.5,
                2.88,
                1.0
              ]
            },
            {
              "name": "Volatility drag, sigma^2/2",
              "x": [
                0,
                5,
                10,
                15,
                20,
                25,
                30,
                35,
                40
              ],
              "y": [
                0.0,
                0.12,
                0.5,
                1.12,
                2.0,
                3.12,
                4.5,
                6.12,
                8.0
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Quoting an arithmetic mean as the growth rate a client will experience. At 20% volatility the two differ by two per cent a year, which over a decade is a quarter of the terminal wealth.",
        "Annualising a monthly volatility with the square root of twelve for a smoothed or illiquid return series. Positive autocorrelation means that number understates risk, and the Sharpe ratio built on it is inflated by the same factor.",
        "Comparing Sharpe ratios estimated over different sample lengths as if they were the same kind of number. A 0.9 over three years and a 0.6 over twenty years are not in the same league, and the longer record is the stronger evidence.",
        "Computing Sharpe standard errors under normality for a negatively skewed strategy. The error bars come out about fifteen per cent too narrow precisely where the tail risk lives."
      ],
      "check": [
        {
          "q": "A fund reports a 9% arithmetic mean return and 20% volatility. What compound growth rate should a long-horizon investor expect?",
          "options": [
            "9%, the reported mean",
            "About 7%, because volatility drag is about sigma-squared over two",
            "About 11%, because compounding adds to the mean",
            "It cannot be estimated without the skewness"
          ],
          "answer": 1,
          "why": "The mean log return is approximately mu minus half the variance, here 0.09 - 0.02 = 0.07, and the simulation confirms a median CAGR consistent with that."
        },
        {
          "q": "A private-credit fund reports monthly returns with an autocorrelation of 0.45. Annualising its monthly volatility by the square root of twelve will:",
          "options": [
            "Be exact, since the square-root rule holds for any stationary series",
            "Overstate annual volatility by about 50%",
            "Understate annual volatility by about a third, because positive autocorrelation adds autocovariance terms",
            "Have no effect on the reported Sharpe ratio"
          ],
          "answer": 2,
          "why": "True annual volatility is about 1.55 times the scaled monthly figure at rho = 0.45, so the naive number is roughly a third too low and the Sharpe ratio built on it is inflated by 1.55."
        },
        {
          "q": "Over five years of monthly data, roughly what is the standard error of an estimated annual Sharpe ratio near 0.5?",
          "options": [
            "About 0.05",
            "About 0.15",
            "About 0.45",
            "About 1.5"
          ],
          "answer": 2,
          "why": "The iid formula gives root(12/60) times a factor near one, about 0.45, which the simulation reproduces; a two-sigma band therefore spans zero."
        },
        {
          "q": "Why does negative skewness raise the standard error of a Sharpe estimate?",
          "options": [
            "It does not; only the variance enters",
            "Because the moment-adjusted standard error carries a minus-skewness-times-Sharpe term, so left-skewed returns make the estimate noisier",
            "Because negative skewness lowers the mean",
            "Because it makes the returns autocorrelated"
          ],
          "answer": 1,
          "why": "The Lo correction adds a term of minus gamma-three times SR; with negative skewness that term is positive and inflates the standard error, which the jump-mixture case confirms at 0.106 against the naive 0.092."
        }
      ]
    },
    {
      "n": 2,
      "title": "Mean-variance mathematics and the efficient frontier",
      "topics": [
        "the frontier in closed form",
        "the tangency portfolio and two-fund separation",
        "what adding an asset is worth",
        "constraints and the feasible set"
      ],
      "concepts": [
        {
          "name": "The frontier is a parabola, and three scalars determine it",
          "explain": "<p>Minimising a portfolio variance subject to a budget constraint and a target mean is a quadratic program with linear constraints, so it has a closed-form solution. Write A for one-transpose Sigma-inverse one, B for one-transpose Sigma-inverse mu and C for mu-transpose Sigma-inverse mu. Then the minimum variance attainable at target mean m is a quadratic in m with those three scalars as coefficients: the frontier is a parabola in mean-variance space and a hyperbola in mean-standard-deviation space. The vertex is the global minimum-variance portfolio, with mean B over A and variance one over A.</p> <p>The snippet does this for four assets and then checks the closed form against solving the Karush-Kuhn-Tucker system directly as a six-by-six linear system. The two agree to five decimals at every target mean, and the weights sum to one to six decimals. The numbers themselves are worth noticing: the global minimum-variance portfolio has an annual volatility of 8.0 per cent, and pushing the target mean from 5.5 to 9.0 per cent more than doubles the volatility, from 8.9 to 20.6 per cent. The frontier is flat near the vertex and steep away from it.</p> <p>The practical value of the closed form is not that anyone computes frontiers this way in production -- constraints make that impossible -- but that it tells you which features of the inputs matter. A, B and C are all quadratic forms in Sigma-inverse, so every conclusion in this course depends on an inverted covariance matrix, which is precisely the object that week 3 shows you cannot estimate.</p>",
          "formula": "\\sigma^2(m) = \\frac{A m^2 - 2Bm + C}{AC - B^2}, \\quad A = \\mathbf{1}'\\Sigma^{-1}\\mathbf{1},\\ B = \\mathbf{1}'\\Sigma^{-1}\\mu,\\ C = \\mu'\\Sigma^{-1}\\mu",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nmu = np.array([0.055, 0.075, 0.100, 0.040])              # annual excess returns\nsd = np.array([0.140, 0.190, 0.260, 0.090])\nR = np.array([[1.00, 0.55, 0.40, 0.15],\n              [0.55, 1.00, 0.52, 0.10],\n              [0.40, 0.52, 1.00, 0.05],\n              [0.15, 0.10, 0.05, 1.00]])\nS = np.outer(sd, sd) * R\none = np.ones(4)\nSi = np.linalg.inv(S)\nA, B, C = one @ Si @ one, one @ Si @ mu, mu @ Si @ mu\nD = A * C - B ** 2\nprint(f\"A = {A:9.3f}   B = {B:8.4f}   C = {C:8.5f}   D = AC - B^2 = {D:.5f}\")\nprint(f\"global minimum variance: mean {B / A:7.4f}  vol {1 / np.sqrt(A):7.4f}\\n\")\nprint(\" target mean   closed-form vol   KKT-solved vol   sum of weights\")\nfor m in (0.04, 0.055, 0.07, 0.09):\n    v_cf = np.sqrt((A * m ** 2 - 2 * B * m + C) / D)\n    # solve the same problem as a linear system from the KKT conditions\n    K = np.zeros((6, 6))\n    K[:4, :4] = 2 * S\n    K[:4, 4], K[4, :4] = one, one\n    K[:4, 5], K[5, :4] = mu, mu\n    rhs = np.array([0, 0, 0, 0, 1.0, m])\n    w = np.linalg.solve(K, rhs)[:4]\n    print(f\"{m:12.4f} {v_cf:17.5f} {np.sqrt(w @ S @ w):16.5f} {w.sum():16.6f}\")\nprint(\"\\nthe frontier is a parabola in (mean, variance): two numbers, A and B/A, fix its vertex\")\n",
            "output": "A =   156.546   B =   7.1819   C =  0.38359   D = AC - B^2 = 8.46912\nglobal minimum variance: mean  0.0459  vol  0.0799\n\n target mean   closed-form vol   KKT-solved vol   sum of weights\n      0.0400           0.08382          0.08382         1.000000\n      0.0550           0.08903          0.08903         1.000000\n      0.0700           0.13094          0.13094         1.000000\n      0.0900           0.20585          0.20585         1.000000\n\nthe frontier is a parabola in (mean, variance): two numbers, A and B/A, fix its vertex"
          }
        },
        {
          "name": "The tangency portfolio and two-fund separation",
          "explain": "<p>Introduce a risk-free asset and the picture simplifies radically. The set of attainable portfolios becomes a straight line from the risk-free rate through the one risky portfolio with the highest Sharpe ratio, and the weights of that tangency portfolio are Sigma-inverse times the vector of excess returns, normalised. Its Sharpe ratio is the square root of mu-transpose Sigma-inverse mu, the same C that appeared in the frontier formula. Every investor, whatever their risk aversion, holds the same risky portfolio and differs only in how much cash they hold against it. That is two-fund separation.</p> <p>The snippet computes the tangency and global minimum-variance portfolios for the same four assets, confirms that the tangency Sharpe of 0.6193 equals the closed form, then searches a fine grid of mixtures of the two portfolios. The best mixture is found at a weight of exactly 1.000 on the tangency portfolio, with Sharpe 0.6193 -- the grid rediscovers the algebra. The second table takes three target means, builds the portfolio both as a mixture of the two funds and directly from the frontier weights, and finds the weights agree to machine precision.</p> <p>Two-fund separation is why the industry can sell a single balanced fund and a cash sleeve rather than a bespoke portfolio per client, and it is why an asset's contribution is judged against one benchmark portfolio rather than in isolation. It also sets up the one honest question about any new strategy: what does it add to the portfolio somebody already owns?</p>",
          "formula": "w_{\\text{tan}} \\propto \\Sigma^{-1}(\\mu - r_f\\mathbf{1}), \\qquad SR_{\\text{tan}} = \\sqrt{(\\mu-r_f\\mathbf{1})'\\Sigma^{-1}(\\mu-r_f\\mathbf{1})}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nmu = np.array([0.055, 0.075, 0.100, 0.040])\nsd = np.array([0.140, 0.190, 0.260, 0.090])\nR = np.array([[1.00, 0.55, 0.40, 0.15],\n              [0.55, 1.00, 0.52, 0.10],\n              [0.40, 0.52, 1.00, 0.05],\n              [0.15, 0.10, 0.05, 1.00]])\nS = np.outer(sd, sd) * R\nSi = np.linalg.inv(S)\none = np.ones(4)\n\nw_tan = Si @ mu / (one @ Si @ mu)                  # risk-free rate already subtracted\nw_gmv = Si @ one / (one @ Si @ one)\nsharpe = lambda w: (w @ mu) / np.sqrt(w @ S @ w)\nprint(\"tangency weights  \", np.round(w_tan, 4), f\"  Sharpe {sharpe(w_tan):.4f}\")\nprint(\"GMV weights       \", np.round(w_gmv, 4), f\"  Sharpe {sharpe(w_gmv):.4f}\")\nprint(f\"closed form sqrt(mu' S^-1 mu) = {np.sqrt(mu @ Si @ mu):.4f}\\n\")\n\nbest = max(((sharpe(a * w_tan + (1 - a) * w_gmv), a) for a in np.linspace(-1, 3, 40001)))\nprint(f\"grid over mixtures of the two funds: best Sharpe {best[0]:.4f} at a = {best[1]:.3f}\")\nprint(\"every frontier portfolio is a mix of these two, and the best Sharpe is at a = 1\")\nprint(\"\\n target mean  from the two funds   direct frontier weights   max |difference|\")\nfor m in (0.04, 0.07, 0.09):\n    a = (m - w_gmv @ mu) / (w_tan @ mu - w_gmv @ mu)\n    w2 = a * w_tan + (1 - a) * w_gmv\n    A, B, C = one @ Si @ one, one @ Si @ mu, mu @ Si @ mu\n    lam = (C - B * m) / (A * C - B ** 2)\n    gam = (A * m - B) / (A * C - B ** 2)\n    wd = Si @ (lam * one + gam * mu)\n    print(f\"{m:12.4f} {np.sqrt(w2 @ S @ w2):18.5f} {np.sqrt(wd @ S @ wd):24.5f}\"\n          f\" {np.abs(w2 - wd).max():18.2e}\")\n",
            "output": "tangency weights   [0.1612 0.1106 0.1187 0.6095]   Sharpe 0.6193\nGMV weights        [0.2079 0.0436 0.0206 0.7279]   Sharpe 0.5740\nclosed form sqrt(mu' S^-1 mu) = 0.6193\n\ngrid over mixtures of the two funds: best Sharpe 0.6193 at a = 1.000\nevery frontier portfolio is a mix of these two, and the best Sharpe is at a = 1\n\n target mean  from the two funds   direct frontier weights   max |difference|\n      0.0400            0.08382                  0.08382           1.25e-16\n      0.0700            0.13094                  0.13094           5.55e-16\n      0.0900            0.20585                  0.20585           8.88e-16"
          }
        },
        {
          "name": "An asset is worth exactly its appraisal ratio",
          "explain": "<p>Here is the cleanest result in portfolio theory. Take a set of benchmark assets and compute the maximum squared Sharpe ratio they attain. Now add one more asset, regress its excess return on the benchmark excess returns, and call the intercept alpha and the residual volatility sigma-epsilon. The maximum squared Sharpe of the enlarged set is exactly the old squared Sharpe plus alpha squared over sigma-epsilon squared. The ratio alpha over sigma-epsilon is the appraisal ratio, and Sharpe ratios add in quadrature.</p> <p>The snippet verifies the identity to six decimals. Assets one to three attain a squared Sharpe of 0.232014. Regressing asset four on all three gives an alpha of 0.03463 and a residual volatility of 0.0889, an appraisal ratio of 0.389. Adding the square of that to 0.232014 gives 0.383587, which is precisely the squared Sharpe of all four assets. Note that the single-asset Sharpe ratios never enter: asset four's own Sharpe is irrelevant, and its correlation with the others enters only through the residual.</p> <p>This is the criterion a desk should apply to every new strategy, every new manager and every new market. Not \"what is its Sharpe\" but \"what is its alpha against what we already hold, divided by the risk that alpha comes wrapped in\". A strategy with a standalone Sharpe of 1.0 that is ninety-five per cent correlated with the existing book adds nothing; a strategy with a Sharpe of 0.3 and no correlation adds a great deal.</p>",
          "formula": "SR^2_{\\text{full}} = SR^2_{\\text{bench}} + \\left(\\frac{\\alpha}{\\sigma_\\varepsilon}\\right)^{2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nmu = np.array([0.055, 0.075, 0.100, 0.040])\nsd = np.array([0.140, 0.190, 0.260, 0.090])\nR = np.array([[1.00, 0.55, 0.40, 0.15],\n              [0.55, 1.00, 0.52, 0.10],\n              [0.40, 0.52, 1.00, 0.05],\n              [0.15, 0.10, 0.05, 1.00]])\nS = np.outer(sd, sd) * R\n\ndef max_sr2(mu, S):\n    return mu @ np.linalg.inv(S) @ mu\n\nfor k in (2, 3, 4):\n    sub = slice(0, k)\n    print(f\"assets 1..{k}: max Sharpe = {np.sqrt(max_sr2(mu[sub], S[sub, sub])):.4f}\")\n\n# what does adding asset 4 to the 1..3 set buy? Regress it on the OLD tangency portfolio.\nmu3, S3 = mu[:3], S[:3, :3]\nbeta = np.linalg.solve(S3, S[:3, 3])                     # regress r4 on r1,r2,r3\nalpha = mu[3] - beta @ mu3\nresid_var = S[3, 3] - beta @ S[:3, 3]\nprint(f\"\\nasset 4 on assets 1-3: betas {np.round(beta, 4)}  alpha {alpha:+.5f}\"\n      f\"  residual vol {np.sqrt(resid_var):.4f}\")\nprint(f\"appraisal ratio alpha/sigma_eps      {alpha / np.sqrt(resid_var):+.5f}\")\nprint(f\"SR^2 with 3 assets                   {max_sr2(mu3, S3):.6f}\")\nprint(f\"SR^2 with 3 assets + (a/s_eps)^2     \"\n      f\"{max_sr2(mu3, S3) + alpha ** 2 / resid_var:.6f}\")\nprint(f\"SR^2 with all 4 assets               {max_sr2(mu, S):.6f}\")\nprint(\"an asset is worth adding only through its alpha per unit of RESIDUAL risk\")\n",
            "output": "assets 1..2: max Sharpe = 0.4473\nassets 1..3: max Sharpe = 0.4817\nassets 1..4: max Sharpe = 0.6193\n\nasset 4 on assets 1-3: betas [ 0.0901  0.0169 -0.0085]  alpha +0.03463  residual vol 0.0889\nappraisal ratio alpha/sigma_eps      +0.38932\nSR^2 with 3 assets                   0.232014\nSR^2 with 3 assets + (a/s_eps)^2     0.383587\nSR^2 with all 4 assets               0.383587\nan asset is worth adding only through its alpha per unit of RESIDUAL risk"
          }
        },
        {
          "name": "Constraints shrink the feasible set, and the true frontier with it",
          "explain": "<p>No real mandate allows unlimited shorting or unlimited concentration. Once you add a no-short constraint or a position cap, there is no closed form: the problem is still a convex quadratic program, but with inequality constraints it must be solved numerically and the solution has a different character. Some assets sit exactly at their bound and the rest are interior, so the portfolio behaves like an unconstrained optimum over a smaller asset set.</p> <p>The snippet adds a fifth asset with a low expected return and an 0.88 correlation with the fourth, which is exactly the configuration an optimiser loves: a near-duplicate with a worse mean is a short. The unconstrained solution goes long 3.93 of asset four and short 3.69 of asset five, a gross exposure of 8.4 times capital, and earns a Sharpe of 0.777. Forbidding shorts drops the Sharpe to 0.619 and zeroes asset five. Capping every position at 35 per cent drops it further to 0.579.</p> <p>Under the true moments, this is all loss: constraints remove portfolios from the feasible set, so the attainable Sharpe can only fall. That is the entire content of the classical answer to \"why not just constrain it\". Week 3 destroys that answer. Once the moments are estimated rather than known, the same constraints stop the optimiser from acting on noise, and they raise the Sharpe you actually realise. Hold both facts at once: constraints cost you something real and buy you something larger.</p>",
          "formula": "\\min_{w} w'\\Sigma w \\quad \\text{s.t.}\\ \\mathbf{1}'w = 1,\\ \\mu'w = m,\\ 0 \\le w_i \\le \\bar{w}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy.optimize import minimize\n\nmu = np.array([0.055, 0.075, 0.100, 0.040, 0.012])\nsd = np.array([0.140, 0.190, 0.260, 0.090, 0.075])\nR = np.array([[1.00, 0.55, 0.40, 0.15, 0.12],\n              [0.55, 1.00, 0.52, 0.10, 0.08],\n              [0.40, 0.52, 1.00, 0.05, 0.02],\n              [0.15, 0.10, 0.05, 1.00, 0.88],\n              [0.12, 0.08, 0.02, 0.88, 1.00]])\nS = np.outer(sd, sd) * R\nn = len(mu)\nneg_sr = lambda w: -(w @ mu) / np.sqrt(w @ S @ w)\nbudget = {\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0}\nx0 = np.ones(n) / n\n\nunc = np.linalg.solve(S, mu); unc = unc / unc.sum()\nlo = minimize(neg_sr, x0, method=\"SLSQP\", constraints=[budget],\n              bounds=[(0.0, 1.0)] * n, options={\"maxiter\": 400, \"ftol\": 1e-12})\ncap = minimize(neg_sr, x0, method=\"SLSQP\", constraints=[budget],\n               bounds=[(0.0, 0.35)] * n, options={\"maxiter\": 400, \"ftol\": 1e-12})\n\nfor name, w in ((\"unconstrained\", unc), (\"long only\", lo.x), (\"long only, cap 35%\", cap.x)):\n    print(f\"{name:20s} Sharpe {-neg_sr(w):.4f}  weights {np.round(w, 3)}\"\n          f\"  gross {np.abs(w).sum():.2f}\")\nprint(\"\\nconstraints can only lower the attainable Sharpe under the TRUE moments;\")\nprint(\"week 3 shows they can raise it once the moments are estimated\")\n",
            "output": "unconstrained        Sharpe 0.7771  weights [ 0.31   0.235  0.21   3.931 -3.687]  gross 8.37\nlong only            Sharpe 0.6193  weights [0.161 0.111 0.119 0.609 0.   ]  gross 1.00\nlong only, cap 35%   Sharpe 0.5786  weights [0.269 0.146 0.141 0.35  0.095]  gross 1.00\n\nconstraints can only lower the attainable Sharpe under the TRUE moments;\nweek 3 shows they can raise it once the moments are estimated"
          }
        }
      ],
      "widget": {
        "type": "efficient-frontier",
        "title": "Three assets, the frontier, and the tangency line",
        "params": {
          "mu": [
            0.055,
            0.075,
            0.1
          ],
          "sigma": [
            0.14,
            0.19,
            0.26
          ],
          "rho": 0.45,
          "rf": 0.02
        }
      },
      "pitfalls": [
        "Reading the frontier's flatness near the vertex as a licence to ignore the target mean. The flatness is exactly why estimation error in mu moves the chosen portfolio so far for so little gain in expected return.",
        "Forgetting to subtract the risk-free rate before forming the tangency portfolio. Sigma-inverse applied to raw returns rather than excess returns gives a different portfolio and a meaningless Sharpe ratio.",
        "Judging a candidate strategy by its own Sharpe ratio. The only thing that matters is alpha over residual volatility against the portfolio you already hold, and the two can rank strategies in opposite orders.",
        "Believing that constraints must reduce performance because they reduce the feasible set. That is true of the population problem and false of the estimated one, which is the only one you can actually solve."
      ],
      "check": [
        {
          "q": "The maximum Sharpe ratio attainable from a set of risky assets and a risk-free asset equals:",
          "options": [
            "The largest individual asset Sharpe ratio",
            "The square root of mu-excess-transpose Sigma-inverse mu-excess",
            "One over the square root of one-transpose Sigma-inverse one",
            "B over A in the frontier constants"
          ],
          "answer": 1,
          "why": "That quadratic form is the frontier constant C in excess-return units, and the snippet confirms the tangency Sharpe of 0.6193 equals its square root."
        },
        {
          "q": "A new fund has a standalone Sharpe of 0.40 but an alpha of zero against the factors you already own. What does adding it do to your maximum Sharpe?",
          "options": [
            "Raises it by 0.40 in quadrature",
            "Raises it slightly because of diversification",
            "Leaves it unchanged, because the increment is alpha over residual volatility and alpha is zero",
            "Lowers it because of the extra variance"
          ],
          "answer": 2,
          "why": "The increment to squared Sharpe is exactly the squared appraisal ratio alpha over sigma-epsilon; with zero alpha the fund is replicable by what you hold and adds nothing."
        },
        {
          "q": "Why does the unconstrained optimiser in the snippet take a 3.9 long and a 3.7 short in two assets with 0.88 correlation?",
          "options": [
            "Because it is maximising leverage",
            "Because a near-duplicate with a lower mean is a nearly risk-free spread, so the optimiser scales it up",
            "Because the covariance matrix is singular",
            "Because the budget constraint forces it"
          ],
          "answer": 1,
          "why": "Two highly correlated assets with different means define a low-variance spread with a positive expected return, and an unconstrained mean-variance optimiser will take as much of it as the budget constraint permits."
        },
        {
          "q": "Under the TRUE moments, adding a long-only constraint to a mean-variance problem:",
          "options": [
            "Can raise the attainable Sharpe ratio",
            "Can only lower or leave unchanged the attainable Sharpe ratio",
            "Has no effect on the Sharpe ratio",
            "Makes the problem non-convex"
          ],
          "answer": 1,
          "why": "Constraints shrink the feasible set, so the population optimum can only get worse; the snippet shows 0.777 falling to 0.619. The benefit of constraints appears only once moments are estimated."
        }
      ]
    },
    {
      "n": 3,
      "title": "Estimation error: why the plug-in optimiser fails",
      "topics": [
        "the plug-in portfolio out of sample",
        "which input does the damage",
        "error maximisation and conditioning",
        "how much data the optimiser needs"
      ],
      "concepts": [
        {
          "name": "The plug-in optimiser loses to equal weights",
          "explain": "<p>The mean-variance machinery of week 2 takes mu and Sigma as known. In practice you estimate them from a sample and substitute the estimates, which is called the plug-in approach. This concept is the experiment that shows what that substitution costs. The setup is deliberately favourable: twenty-five assets with a genuine one-factor structure, small but real alphas, ten years of monthly data, correctly specified model, no non-stationarity, no transaction costs, no estimation of the model form.</p> <p>The true tangency portfolio has an annual Sharpe of 0.461. The plug-in portfolio built from ten years of data has a median true Sharpe of 0.118 -- it captures a quarter of what was available. Equal weighting, which estimates nothing at all, delivers 0.335. Across four hundred independent samples the plug-in beat equal weighting in zero per cent of them. The median gross leverage of the plug-in portfolio is 13.1 times capital.</p> <p>Read those numbers slowly, because the natural reaction is to look for the bug. There is none. The optimiser is doing exactly what it was asked to do: find the portfolio that maximises the Sharpe ratio of the sample it was given. The sample's highest-Sharpe portfolio is mostly a bet on which assets happened to do well, and that bet does not repeat. This result, in one form or another, is why the practical portfolio construction of the rest of the course looks nothing like the algebra of week 2, and why a research team that reports the in-sample frontier has reported nothing.</p>",
          "formula": "\\hat{w} = \\hat{\\Sigma}^{-1}\\hat{\\mu}, \\qquad SR_{\\text{true}}(\\hat w) = \\frac{\\hat w' \\mu}{\\sqrt{\\hat w' \\Sigma \\hat w}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\np, T, trials = 25, 120, 400\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)     # TRUE Sharpe of a weight vector\n\nw_true = np.linalg.solve(S, mu)\nw_eq = np.ones(p) / p\nrng = np.random.default_rng(101)\nplug, gross = [], []\nfor _ in range(trials):\n    X = mu + rng.normal(size=(T, p)) @ L.T\n    w = np.linalg.solve(np.cov(X, rowvar=False), X.mean(axis=0))\n    plug.append(psr(w))\n    gross.append(np.abs(w / w.sum()).sum())\n\nplug = np.array(plug)\nprint(f\"p = {p} assets, T = {T} months of estimation data, {trials} independent samples\\n\")\nprint(f\"TRUE tangency portfolio   Sharpe {psr(w_true):6.3f}   (the unreachable ceiling)\")\nprint(f\"plug-in optimiser, median Sharpe  {np.median(plug):6.3f}\"\n      f\"   5th pct {np.percentile(plug, 5):6.3f}   95th {np.percentile(plug, 95):6.3f}\")\nprint(f\"equal weight (1/N)        Sharpe {psr(w_eq):6.3f}   (no estimation at all)\")\nprint(f\"\\nplug-in beats 1/N in {100 * np.mean(plug > psr(w_eq)):.0f}% of samples\")\nprint(f\"median gross leverage of the plug-in portfolio: {np.median(gross):.1f}x\")\nprint(f\"fraction of the true Sharpe captured by the plug-in: \"\n      f\"{np.median(plug) / psr(w_true):.2f}\")\n",
            "output": "p = 25 assets, T = 120 months of estimation data, 400 independent samples\n\nTRUE tangency portfolio   Sharpe  0.461   (the unreachable ceiling)\nplug-in optimiser, median Sharpe   0.118   5th pct -0.013   95th  0.243\nequal weight (1/N)        Sharpe  0.335   (no estimation at all)\n\nplug-in beats 1/N in 0% of samples\nmedian gross leverage of the plug-in portfolio: 13.1x\nfraction of the true Sharpe captured by the plug-in: 0.26"
          }
        },
        {
          "name": "Almost all the damage comes from the mean vector",
          "explain": "<p>If the plug-in portfolio fails, which input is to blame? The experiment that answers this feeds the optimiser three of the four possible combinations of true and estimated inputs and reads off the true Sharpe of each resulting portfolio. It is a diagnostic you can only run in simulation, which is exactly why simulation belongs in a portfolio course.</p> <p>With both inputs estimated, the median true Sharpe is 0.112 against a ceiling of 0.461: 76 per cent of the available Sharpe is destroyed. Give the optimiser the true mean vector and make it estimate only the covariance matrix, and it recovers 0.414, losing just 10 per cent. Give it the true covariance and make it estimate only the means, and it collapses back to 0.131, losing 72 per cent. The mean vector carries essentially all the damage.</p> <p>The reason is a signal-to-noise calculation. A monthly mean return is estimated with standard error sigma over root T; for a twenty per cent volatility asset over ten years that is about 1.8 per cent a year against an expected return of perhaps six per cent. A variance, by contrast, is estimated with a relative standard error of about root two over root T, which over the same sample is under five per cent. You are estimating expected returns with a thirty per cent error and covariances with a five per cent one, and the optimiser is far more sensitive to the former.</p> <p>Every practical technique in week 4 is a response to this diagnosis: shrink the means hard, or refuse to use them at all.</p>",
          "formula": "\\operatorname{se}(\\hat\\mu_i) = \\frac{\\sigma_i}{\\sqrt{T}}, \\qquad \\frac{\\operatorname{se}(\\hat\\sigma^2_i)}{\\sigma^2_i} \\approx \\sqrt{\\frac{2}{T}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\np, T, trials = 25, 120, 400\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)\nrng = np.random.default_rng(202)\n\nout = {k: [] for k in (\"both estimated\", \"mu true, Sigma estimated\",\n                       \"mu estimated, Sigma true\", \"both true\")}\nfor _ in range(trials):\n    X = mu + rng.normal(size=(T, p)) @ L.T\n    mh, Sh = X.mean(axis=0), np.cov(X, rowvar=False)\n    out[\"both estimated\"].append(psr(np.linalg.solve(Sh, mh)))\n    out[\"mu true, Sigma estimated\"].append(psr(np.linalg.solve(Sh, mu)))\n    out[\"mu estimated, Sigma true\"].append(psr(np.linalg.solve(S, mh)))\n    out[\"both true\"].append(psr(np.linalg.solve(S, mu)))\n\nprint(f\"true tangency Sharpe {psr(np.linalg.solve(S, mu)):.3f};  p = {p}, T = {T}\\n\")\nprint(\"what is estimated              median true Sharpe   share of the ceiling lost\")\nceiling = psr(np.linalg.solve(S, mu))\nfor k, v in out.items():\n    med = np.median(v)\n    print(f\"{k:30s} {med:12.3f} {100 * (1 - med / ceiling):22.0f}%\")\nprint(\"\\nnearly all of the damage comes from the mean vector, not the covariance matrix\")\n",
            "output": "true tangency Sharpe 0.461;  p = 25, T = 120\n\nwhat is estimated              median true Sharpe   share of the ceiling lost\nboth estimated                        0.112                     76%\nmu true, Sigma estimated              0.414                     10%\nmu estimated, Sigma true              0.131                     72%\nboth true                             0.461                      0%\n\nnearly all of the damage comes from the mean vector, not the covariance matrix"
          }
        },
        {
          "name": "Error maximisation: the optimiser hunts for the noise",
          "explain": "<p>Michaud called mean-variance optimisation an error-maximiser, and the mechanism is worth seeing explicitly. Inverting a covariance matrix divides by its eigenvalues. The smallest sample eigenvalues correspond to portfolios of assets that happened to move together in the sample, and those portfolios have almost no estimated variance. Dividing an estimated mean by an almost-zero estimated variance produces an enormous weight. The optimiser is not averaging estimation error away; it is systematically loading on the directions where the estimate is least reliable.</p> <p>The snippet sweeps the sample length for twenty-five assets. The true covariance has a condition number of 29. At thirty months the median sample condition number is 1361, at sixty months it is 98, and only at six hundred months does it settle near 33. Gross leverage is 15 to 17 times capital at short samples and still 9 times at fifty years of data, with a single position reaching 1.9 times capital at the shortest sample. The true Sharpe of the resulting portfolio rises monotonically with T, from 0.043 to 0.254, and never reaches the 0.461 ceiling.</p> <p>There are two separate diagnostics on a portfolio here, and both are free. Look at the condition number of the covariance estimate you are about to invert, and look at the gross leverage of the answer. A risk system that reports neither will let a fifteen-times levered position on an estimation artefact through unchallenged.</p>",
          "formula": "\\hat\\Sigma^{-1} = \\sum_{k} \\frac{1}{\\hat\\lambda_k} v_k v_k', \\qquad \\kappa(\\hat\\Sigma) = \\frac{\\hat\\lambda_{\\max}}{\\hat\\lambda_{\\min}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\np = 25\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)\nrng = np.random.default_rng(303)\n\nprint(f\"true Sigma condition number {np.linalg.cond(S):8.1f}\\n\")\nprint(\"   T   p/T   cond(Sigma-hat)   gross leverage   max weight   median true Sharpe\")\nfor T in (30, 60, 120, 240, 600):\n    conds, grosses, mx, srs = [], [], [], []\n    for _ in range(200):\n        X = mu + rng.normal(size=(T, p)) @ L.T\n        Sh = np.cov(X, rowvar=False)\n        w = np.linalg.solve(Sh, X.mean(axis=0)); w = w / w.sum()\n        conds.append(np.linalg.cond(Sh)); grosses.append(np.abs(w).sum())\n        mx.append(np.abs(w).max()); srs.append(psr(w))\n    print(f\"{T:4d} {p / T:5.2f} {np.median(conds):17.1f} {np.median(grosses):16.1f}\"\n          f\" {np.median(mx):12.2f} {np.median(srs):21.3f}\")\nprint(\"\\nthe optimiser does not average estimation error, it seeks it out:\")\nprint(\"small estimated eigenvalues become large weights on the noisiest combinations\")\n",
            "output": "true Sigma condition number     29.3\n\n   T   p/T   cond(Sigma-hat)   gross leverage   max weight   median true Sharpe\n  30  0.83            1360.8             14.9         1.94                 0.043\n  60  0.42              98.4             16.7         1.94                 0.065\n 120  0.21              50.2             15.1         1.84                 0.094\n 240  0.10              37.5             10.9         1.33                 0.154\n 600  0.04              32.5              9.0         1.10                 0.254\n\nthe optimiser does not average estimation error, it seeks it out:\nsmall estimated eigenvalues become large weights on the noisiest combinations"
          }
        },
        {
          "name": "How much data would the plug-in actually need?",
          "explain": "<p>The natural follow-up question is quantitative: at what sample length does the plug-in optimiser start earning its keep? The answer depends on the ratio of the number of assets to the number of observations, and it is far larger than anyone's intuition.</p> <p>The snippet holds twenty-five assets fixed and sweeps the sample from five years to two hundred years of monthly data. At sixty months the plug-in's median true Sharpe is 0.074 and it beats equal weighting in zero per cent of samples. At two hundred and forty months, twenty years, it is 0.174 and wins one per cent of the time. At nine hundred and sixty months, eighty years, it is 0.296 and wins nineteen per cent of the time. Only at two thousand four hundred months -- two centuries -- does it win 83 per cent of samples, with a median Sharpe of 0.366, still below the 0.461 ceiling.</p> <p>The scaling behind this is that the expected loss from estimation grows roughly with the number of assets divided by the sample length, so a ratio of T over p in the low tens is not nearly enough. Kan and Zhou and the papers around them make the statement precise; the simulation makes it visceral.</p> <p>The practical conclusion is not that optimisation is useless. It is that an optimiser is only as good as the prior you put into it, so the question shifts from \"what is the optimum\" to \"what do I believe strongly enough to hand the optimiser\". That is the agenda of week 4.</p>",
          "formula": "\\mathbb{E}\\big[SR^2_{\\text{true}}(\\hat w)\\big] \\approx SR^2 \\cdot \\frac{1}{1 + \\frac{p}{T}\\left(1 + \\frac{1}{SR^2}\\right)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\np = 25\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)\nrng = np.random.default_rng(404)\neq = psr(np.ones(p) / p)\nceiling = psr(np.linalg.solve(S, mu))\n\nprint(f\"ceiling (true tangency) {ceiling:.3f}    1/N benchmark {eq:.3f}\\n\")\nprint(\"    T   T/p   plug-in median   plug-in mean   beats 1/N\")\nfor T in (60, 120, 240, 480, 960, 2400):\n    srs = []\n    for _ in range(300):\n        X = mu + rng.normal(size=(T, p)) @ L.T\n        srs.append(psr(np.linalg.solve(np.cov(X, rowvar=False), X.mean(axis=0))))\n    srs = np.array(srs)\n    print(f\"{T:5d} {T / p:5.1f} {np.median(srs):16.3f} {srs.mean():14.3f}\"\n          f\" {100 * np.mean(srs > eq):10.0f}%\")\nprint(f\"\\nwith {p} assets the plug-in needs on the order of decades of monthly data\")\nprint(\"before it reliably beats a portfolio that estimates nothing\")\n",
            "output": "ceiling (true tangency) 0.461    1/N benchmark 0.335\n\n    T   T/p   plug-in median   plug-in mean   beats 1/N\n   60   2.4            0.074          0.071          0%\n  120   4.8            0.116          0.115          0%\n  240   9.6            0.174          0.169          1%\n  480  19.2            0.230          0.221          2%\n  960  38.4            0.296          0.292         19%\n 2400  96.0            0.366          0.362         83%\n\nwith 25 assets the plug-in needs on the order of decades of monthly data\nbefore it reliably beats a portfolio that estimates nothing"
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "The out-of-sample Sharpe of a plug-in portfolio is a distribution, not a number",
        "params": {
          "sampler": "normal",
          "params": {
            "mu": 0.118,
            "sigma": 0.072
          },
          "bins": 34,
          "overlay": true,
          "seed": 3607
        }
      },
      "pitfalls": [
        "Reporting the in-sample efficient frontier as a result. It is an upper bound that no investor can reach, and its distance from the achievable frontier grows with the number of assets.",
        "Concluding from the failure that the covariance matrix needs more work. The diagnostic says the mean vector carries three quarters of the loss; polishing Sigma while plugging in a sample mean is solving the easier problem.",
        "Treating gross leverage as an output to be reported rather than a diagnostic to be acted on. Thirteen times capital from twenty-five assets is a statement about the estimate, not about the opportunity.",
        "Assuming more assets must be better because week 2 said the frontier can only improve. Adding assets raises p and therefore raises estimation error faster than it raises the attainable Sharpe."
      ],
      "check": [
        {
          "q": "In the simulation with 25 assets and 120 months, the plug-in tangency portfolio beat equal weighting in what fraction of samples?",
          "options": [
            "About 80%",
            "About half",
            "About 20%",
            "Essentially none"
          ],
          "answer": 3,
          "why": "The snippet reports zero out of four hundred samples: with p/T around 0.2 the plug-in's median true Sharpe of 0.118 is far below equal weighting's 0.335."
        },
        {
          "q": "Which decomposition does the simulation support?",
          "options": [
            "Covariance error does most of the damage",
            "Mean error does most of the damage",
            "The two contribute about equally",
            "Neither matters once you normalise the weights"
          ],
          "answer": 1,
          "why": "Feeding the true mu with an estimated Sigma recovers 0.414 of the 0.461 ceiling, while the true Sigma with an estimated mu recovers only 0.131."
        },
        {
          "q": "Why does an estimated covariance matrix produce extreme portfolio weights?",
          "options": [
            "Because sample covariances are biased upward",
            "Because inversion divides by eigenvalues, and the smallest sample eigenvalues are noise, so the optimiser levers the least reliable directions",
            "Because the budget constraint is not enforced",
            "Because returns are not normal"
          ],
          "answer": 1,
          "why": "The condition number of the sample covariance rises from 29 to over 1300 as T falls, and gross leverage rises with it; inverting a noisy small eigenvalue is exactly the mechanism."
        },
        {
          "q": "With 25 assets, roughly how much monthly data did the plug-in need before it beat equal weighting in most samples?",
          "options": [
            "About 5 years",
            "About 20 years",
            "About 80 years",
            "About 200 years"
          ],
          "answer": 3,
          "why": "The sweep shows a 19% win rate at 960 months and 83% only at 2400 months; T/p in the low tens is nowhere near enough."
        }
      ]
    },
    {
      "n": 4,
      "title": "Shrinkage, constraints and allocation beyond mean-variance",
      "topics": [
        "linear shrinkage of the covariance matrix",
        "shrinking expected returns",
        "constraints as an implicit prior",
        "risk-based allocation rules"
      ],
      "concepts": [
        {
          "name": "Linear shrinkage of the covariance matrix",
          "explain": "<p>A sample covariance matrix is unbiased but badly conditioned: its large eigenvalues are overestimated and its small ones underestimated, and with p close to T the spread is enormous. Linear shrinkage pulls the estimate toward a structured target, usually a scaled identity or a constant-correlation matrix, with an intensity chosen to minimise expected squared error. Ledoit and Wolf derived that optimal intensity in closed form from the data, so no tuning parameter is left to the user.</p> <p>The snippet runs forty assets on ten years of monthly data, a p over T of one third, and reports both an accuracy measure and a portfolio measure. The mean shrinkage intensity chosen is 0.106, so about a tenth of the way to the target. The relative Frobenius error falls from 0.290 to 0.276 -- a modest improvement, and it would be dishonest to call it dramatic. The portfolio consequence is larger: the minimum-variance portfolio built on the sample matrix realises a 14.3 per cent annual volatility, the one built on the shrunk matrix realises 13.4 per cent, equal weighting realises 16.5 per cent, and the unattainable optimum using the true covariance is 11.8 per cent. Shrinkage closes about a third of the gap between the sample estimator and the truth.</p> <p>Note which metric moved. The matrix barely got more accurate in norm; the portfolio got noticeably better. That is because minimum-variance weights depend on the inverse, and shrinkage improves the inverse far more than it improves the matrix. A risk team should therefore evaluate a covariance estimator by the realised volatility of the portfolios built from it, not by a matrix distance.</p>",
          "formula": "\\hat\\Sigma_{\\text{shrunk}} = \\alpha \\cdot \\frac{\\operatorname{tr}\\hat\\Sigma}{p} I + (1-\\alpha)\\hat\\Sigma, \\qquad \\alpha^{\\star} = \\frac{\\mathbb{E}\\lVert \\hat\\Sigma - \\Sigma\\rVert_F^2}{\\mathbb{E}\\lVert F - \\Sigma\\rVert_F^2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\nfrom sklearn.covariance import LedoitWolf\n\np, T, trials = 40, 120, 100\nmu, S = true_model(p, seed=1)\nL = np.linalg.cholesky(S)\nrng = np.random.default_rng(505)\n\ndef frob(A, B):\n    return np.linalg.norm(A - B, \"fro\") / np.linalg.norm(B, \"fro\")\n\nrows = {\"sample\": [], \"Ledoit-Wolf\": []}\nvols = {\"sample\": [], \"Ledoit-Wolf\": [], \"1/N\": []}\nshr = []\none = np.ones(p)\nfor _ in range(trials):\n    X = mu + rng.normal(size=(T, p)) @ L.T\n    Ss = np.cov(X, rowvar=False)\n    lw = LedoitWolf().fit(X)\n    Sl, a = lw.covariance_, lw.shrinkage_\n    shr.append(a)\n    for name, M in ((\"sample\", Ss), (\"Ledoit-Wolf\", Sl)):\n        rows[name].append(frob(M, S))\n        w = np.linalg.solve(M, one); w = w / w.sum()                  # minimum variance\n        vols[name].append(np.sqrt(12 * w @ S @ w))\n    w = one / p\n    vols[\"1/N\"].append(np.sqrt(12 * w @ S @ w))\n\nw_opt = np.linalg.solve(S, one); w_opt = w_opt / w_opt.sum()\nprint(f\"p = {p}, T = {T}, p/T = {p / T:.2f};  mean shrinkage intensity {np.mean(shr):.3f}\\n\")\nprint(\"estimator      relative Frobenius error   realised min-var vol (annual)\")\nfor name in (\"sample\", \"Ledoit-Wolf\"):\n    print(f\"{name:14s} {np.median(rows[name]):25.4f} {np.median(vols[name]):32.4f}\")\nprint(f\"{'1/N':14s} {'-':>25s} {np.median(vols['1/N']):32.4f}\")\nprint(f\"{'true Sigma':14s} {0.0:25.4f} {np.sqrt(12 * w_opt @ S @ w_opt):32.4f}\")\nprint(\"\\nshrinkage buys a better-conditioned matrix, and the portfolio that uses it\")\nprint(\"actually realises a lower volatility out of sample\")\n",
            "output": "p = 40, T = 120, p/T = 0.33;  mean shrinkage intensity 0.106\n\nestimator      relative Frobenius error   realised min-var vol (annual)\nsample                            0.2899                           0.1432\nLedoit-Wolf                       0.2756                           0.1335\n1/N                                    -                           0.1654\ntrue Sigma                        0.0000                           0.1177\n\nshrinkage buys a better-conditioned matrix, and the portfolio that uses it\nactually realises a lower volatility out of sample"
          }
        },
        {
          "name": "Shrinking the means helps, and not nearly enough",
          "explain": "<p>Week 3 located the damage in the mean vector, so the obvious repair is to shrink the sample means toward a common value. Jorion's Bayes-Stein estimator shrinks each asset's sample mean toward the mean of the minimum-variance portfolio, with an intensity that grows when the cross-sectional spread of the sample means is small relative to their estimation noise. This is the James-Stein idea applied to a portfolio problem, and it dominates the sample mean in expected squared error.</p> <p>The snippet confirms both halves of the story honestly. On forty assets and ten years of data, the average shrinkage weight placed on the grand mean is 0.415, so the estimator discards nearly half the cross-sectional information in the sample means. The sum of squared errors in the mean vector falls from 0.00229 to 0.00106, better than halved. The median true Sharpe of the resulting optimised portfolio rises from 0.085 to 0.093, and equal weighting, which uses no means at all, sits at 0.329.</p> <p>The improvement is real, statistically clean, and economically irrelevant at this sample size. Halving the error in an unusable input leaves it unusable. The honest reading of this experiment is not that shrinkage does not work, but that at p over T of one third no estimator of expected returns can rescue a mean-variance optimiser, and the sensible response is a portfolio rule that does not need expected returns. That is what the last two concepts of this week are about.</p>",
          "formula": "\\hat\\mu_{\\text{BS}} = \\lambda \\hat\\mu_{\\text{mv}}\\mathbf{1} + (1-\\lambda)\\hat\\mu, \\qquad \\lambda = \\frac{p+2}{p+2+T(\\hat\\mu - \\hat\\mu_{\\text{mv}}\\mathbf{1})'\\hat\\Sigma^{-1}(\\hat\\mu-\\hat\\mu_{\\text{mv}}\\mathbf{1})}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\np, T, trials = 40, 120, 400\nmu, S = true_model(p, seed=1)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)\nrng = np.random.default_rng(606)\none = np.ones(p)\n\ndef jorion(mh, Sh, T, p):\n    \"\"\"Shrink the sample mean toward the mean of the minimum-variance portfolio.\"\"\"\n    Si = np.linalg.inv(Sh)\n    m0 = (one @ Si @ mh) / (one @ Si @ one)\n    d = mh - m0 * one\n    lam = (p + 2.0) / (p + 2.0 + T * (d @ Si @ d))\n    return m0 * one + (1.0 - lam) * d, lam\n\nmse = {\"sample mean\": [], \"shrunk mean\": []}\nsr = {\"sample mean\": [], \"shrunk mean\": [], \"1/N\": []}\nlams = []\nfor _ in range(trials):\n    X = mu + rng.normal(size=(T, p)) @ L.T\n    mh, Sh = X.mean(axis=0), np.cov(X, rowvar=False)\n    ms, lam = jorion(mh, Sh, T, p)\n    lams.append(lam)\n    mse[\"sample mean\"].append(np.sum((mh - mu) ** 2))\n    mse[\"shrunk mean\"].append(np.sum((ms - mu) ** 2))\n    sr[\"sample mean\"].append(psr(np.linalg.solve(Sh, mh)))\n    sr[\"shrunk mean\"].append(psr(np.linalg.solve(Sh, ms)))\n    sr[\"1/N\"].append(psr(one / p))\n\nprint(f\"p = {p}, T = {T};  true tangency Sharpe {psr(np.linalg.solve(S, mu)):.3f}\")\nprint(f\"mean shrinkage weight on the grand mean: {np.mean(lams):.3f}\\n\")\nprint(\"mean estimator   sum of squared error   median true Sharpe of the optimiser\")\nfor k in (\"sample mean\", \"shrunk mean\"):\n    print(f\"{k:16s} {np.median(mse[k]):22.6f} {np.median(sr[k]):36.3f}\")\nprint(f\"{'1/N (no mu at all)':16s} {'-':>22s} {np.median(sr['1/N']):36.3f}\")\nprint(\"\\nhalving the squared error in mu-hat moves the realised Sharpe from 0.085 to 0.093:\")\nprint(\"real, and nowhere near enough. At p/T = 1/3 no mean estimator rescues the plug-in.\")\n",
            "output": "p = 40, T = 120;  true tangency Sharpe 0.467\nmean shrinkage weight on the grand mean: 0.415\n\nmean estimator   sum of squared error   median true Sharpe of the optimiser\nsample mean                    0.002293                                0.085\nshrunk mean                    0.001061                                0.093\n1/N (no mu at all)                      -                                0.329\n\nhalving the squared error in mu-hat moves the realised Sharpe from 0.085 to 0.093:\nreal, and nowhere near enough. At p/T = 1/3 no mean estimator rescues the plug-in."
          }
        },
        {
          "name": "A short-sale constraint is a prior in disguise",
          "explain": "<p>Jagannathan and Ma proved something initially paradoxical: imposing a no-short constraint on a minimum-variance problem is mathematically equivalent to solving the unconstrained problem with a modified covariance matrix, where the modification shrinks the covariances of the assets whose constraints bind. A constraint that looks like an arbitrary institutional restriction turns out to be a well-behaved regularisation of the estimate. The economic consequence is that constraints, which must hurt under known moments, can help under estimated ones.</p> <p>The snippet puts numbers on it for twenty-five assets and ten years of data. The unconstrained plug-in has a median true Sharpe of 0.127, with a fifth percentile of minus 0.049: in one sample in twenty it is a losing portfolio. The long-only plug-in has a median of 0.285 and a fifth percentile of 0.192, so its worst cases are still respectable. Equal weighting is a flat 0.335 with no dispersion at all, because it does not depend on the sample.</p> <p>Two things are happening simultaneously. The constraint costs you the genuinely attractive short positions -- recall week 2, where forbidding shorts cut the true Sharpe from 0.777 to 0.619. And it saves you from the spurious ones, which at this sample size are far more numerous. The net effect at realistic sample sizes is strongly positive. When a portfolio manager says the position limits are there for risk reasons, this is the statistically respectable version of that claim.</p>",
          "formula": "\\min_{w \\ge 0} w'\\hat\\Sigma w \\ \\Longleftrightarrow\\ \\min_{w} w'\\tilde\\Sigma w, \\quad \\tilde\\Sigma = \\hat\\Sigma - \\delta\\mathbf{1}' - \\mathbf{1}\\delta'",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\nfrom scipy.optimize import minimize\n\np, T, trials = 25, 120, 120\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)\nrng = np.random.default_rng(707)\none = np.ones(p)\nbudget = {\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0}\n\nres = {\"unconstrained plug-in\": [], \"long-only plug-in\": [], \"1/N\": []}\nfor _ in range(trials):\n    X = mu + rng.normal(size=(T, p)) @ L.T\n    mh, Sh = X.mean(axis=0), np.cov(X, rowvar=False)\n    res[\"unconstrained plug-in\"].append(psr(np.linalg.solve(Sh, mh)))\n    f = lambda w: -(w @ mh) / np.sqrt(w @ Sh @ w)\n    o = minimize(f, one / p, method=\"SLSQP\", bounds=[(0, 1)] * p,\n                 constraints=[budget], options={\"maxiter\": 300, \"ftol\": 1e-10})\n    res[\"long-only plug-in\"].append(psr(o.x))\n    res[\"1/N\"].append(psr(one / p))\n\nprint(f\"p = {p}, T = {T};  ceiling {psr(np.linalg.solve(S, mu)):.3f}\\n\")\nprint(\"portfolio rule              median TRUE Sharpe   5th pct   95th pct\")\nfor k, v in res.items():\n    print(f\"{k:27s} {np.median(v):18.3f} {np.percentile(v, 5):9.3f}\"\n          f\" {np.percentile(v, 95):10.3f}\")\nprint(\"\\nthe short-sale constraint throws away part of the feasible set and STILL wins:\")\nprint(\"it is a crude prior that stops the optimiser acting on noise (Jagannathan-Ma)\")\n",
            "output": "p = 25, T = 120;  ceiling 0.461\n\nportfolio rule              median TRUE Sharpe   5th pct   95th pct\nunconstrained plug-in                    0.127    -0.049      0.245\nlong-only plug-in                        0.285     0.192      0.349\n1/N                                      0.335     0.335      0.335\n\nthe short-sale constraint throws away part of the feasible set and STILL wins:\nit is a crude prior that stops the optimiser acting on noise (Jagannathan-Ma)"
          }
        },
        {
          "name": "Risk-based rules: equal risk contribution and inverse volatility",
          "explain": "<p>If expected returns cannot be estimated, build a portfolio that does not use them. Inverse-volatility weighting sets each weight proportional to one over that asset's volatility. Equal risk contribution, or risk parity, goes further and equalises each asset's contribution to portfolio volatility, which accounts for correlations. It has no closed form but a one-line fixed point converges fast: set each weight proportional to the reciprocal of its marginal risk and renormalise.</p> <p>The snippet first confirms the fixed point works: under the true covariance the risk contributions all come out at 0.0400, exactly one twenty-fifth. It then compares four rules over three hundred samples. The plug-in tangency has a median true Sharpe of 0.116 with a standard deviation of 0.083 across samples. Equal risk contribution gives 0.326 with a standard deviation of 0.0036. Inverse volatility gives 0.335 with 0.0013. Equal weighting gives 0.335 with zero dispersion, since it does not look at the data.</p> <p>The second column is the whole point. The risk-based rules are not just better on average, they are two orders of magnitude more stable across samples. They also leave 0.13 of Sharpe on the table relative to the true optimum, which is the price of refusing to forecast. Every real portfolio process sits somewhere on that trade-off, and the honest question for a desk is how much forecasting skill it can actually demonstrate out of sample -- because that is the only thing that justifies moving away from the estimation-free end.</p>",
          "formula": "\\text{RC}_i = \\frac{w_i (\\Sigma w)_i}{\\sqrt{w'\\Sigma w}}, \\qquad \\text{ERC: } w_i \\propto \\frac{1}{(\\Sigma w)_i}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    \"\"\"One priced market factor, CAPM means plus small alphas. Annual units.\"\"\"\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0                  # monthly units\n\n\np, T, trials = 25, 120, 300\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\npsr = lambda w: np.sqrt(12) * (w @ mu) / np.sqrt(w @ S @ w)\none = np.ones(p)\n\ndef erc(Sh, iters=2000):\n    \"\"\"Equal risk contribution by the standard fixed point w_i <- 1 / (Sigma w)_i.\"\"\"\n    w = one / p\n    for _ in range(iters):\n        g = Sh @ w\n        w_new = 1.0 / g\n        w_new /= w_new.sum()\n        if np.abs(w_new - w).max() < 1e-12:\n            w = w_new\n            break\n        w = w_new\n    return w\n\nw_erc = erc(S)\nrc = w_erc * (S @ w_erc) / (w_erc @ S @ w_erc)\nprint(f\"ERC under the TRUE covariance: risk contributions range \"\n      f\"{rc.min():.4f} to {rc.max():.4f} (equal = {1 / p:.4f})\")\nprint(f\"inverse-vol weights vs ERC weights, max gap \"\n      f\"{np.abs(w_erc - (iv := (1 / np.sqrt(np.diag(S))) / (1 / np.sqrt(np.diag(S))).sum())).max():.4f}\\n\")\n\nrng = np.random.default_rng(808)\nout = {\"plug-in tangency\": [], \"ERC on Sigma-hat\": [], \"inverse vol\": [], \"1/N\": []}\nfor _ in range(trials):\n    X = mu + rng.normal(size=(T, p)) @ L.T\n    mh, Sh = X.mean(axis=0), np.cov(X, rowvar=False)\n    out[\"plug-in tangency\"].append(psr(np.linalg.solve(Sh, mh)))\n    out[\"ERC on Sigma-hat\"].append(psr(erc(Sh, 500)))\n    sdh = np.sqrt(np.diag(Sh))\n    out[\"inverse vol\"].append(psr((1 / sdh) / (1 / sdh).sum()))\n    out[\"1/N\"].append(psr(one / p))\nprint(\"rule                 median TRUE Sharpe   sd across samples\")\nfor k, v in out.items():\n    print(f\"{k:20s} {np.median(v):18.3f} {np.std(v):20.4f}\")\nprint(f\"\\nceiling {psr(np.linalg.solve(S, mu)):.3f}. Rules that never touch mu are stable but capped;\")\nprint(\"the plug-in has the higher ceiling and much the worse realisation.\")\n",
            "output": "ERC under the TRUE covariance: risk contributions range 0.0400 to 0.0400 (equal = 0.0400)\ninverse-vol weights vs ERC weights, max gap 0.0167\n\nrule                 median TRUE Sharpe   sd across samples\nplug-in tangency                  0.116               0.0831\nERC on Sigma-hat                  0.326               0.0036\ninverse vol                       0.335               0.0013\n1/N                               0.335               0.0000\n\nceiling 0.461. Rules that never touch mu are stable but capped;\nthe plug-in has the higher ceiling and much the worse realisation."
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Sample correlation, shrunk correlation, and the truth (40 assets, 120 months)",
        "params": {
          "cmap": "div",
          "xlabels": [
            "A1",
            "A2",
            "A3",
            "A4",
            "A5",
            "A6",
            "A7",
            "A8"
          ],
          "ylabels": [
            "A1",
            "A2",
            "A3",
            "A4",
            "A5",
            "A6",
            "A7",
            "A8"
          ],
          "matrix": [
            [
              1.0,
              0.44,
              0.31,
              0.52,
              0.28,
              0.39,
              0.47,
              0.25
            ],
            [
              0.44,
              1.0,
              0.36,
              0.41,
              0.33,
              0.3,
              0.38,
              0.29
            ],
            [
              0.31,
              0.36,
              1.0,
              0.34,
              0.26,
              0.24,
              0.29,
              0.21
            ],
            [
              0.52,
              0.41,
              0.34,
              1.0,
              0.35,
              0.42,
              0.51,
              0.3
            ],
            [
              0.28,
              0.33,
              0.26,
              0.35,
              1.0,
              0.27,
              0.32,
              0.24
            ],
            [
              0.39,
              0.3,
              0.24,
              0.42,
              0.27,
              1.0,
              0.4,
              0.23
            ],
            [
              0.47,
              0.38,
              0.29,
              0.51,
              0.32,
              0.4,
              1.0,
              0.28
            ],
            [
              0.25,
              0.29,
              0.21,
              0.3,
              0.24,
              0.23,
              0.28,
              1.0
            ]
          ]
        }
      },
      "pitfalls": [
        "Treating the Ledoit-Wolf intensity as a knob to tune on out-of-sample performance. It is estimated from the data to minimise expected squared error; re-tuning it on the test set is exactly the overfitting the estimator was built to avoid.",
        "Judging a covariance estimator by a matrix norm. The snippet's Frobenius improvement is 5% while the portfolio volatility improvement is 6% of the level and a third of the gap to the truth; the inverse is what the portfolio uses.",
        "Believing mean shrinkage solves the plug-in problem. Halving the squared error in mu-hat moved the realised Sharpe from 0.085 to 0.093 against a benchmark of 0.329.",
        "Selling risk parity as a free lunch. It is estimation-free and stable, and it gives up real Sharpe relative to a genuinely informed forecast, and it needs leverage to reach an equity-like return."
      ],
      "check": [
        {
          "q": "Ledoit-Wolf shrinkage improved the Frobenius accuracy of the covariance estimate by about 5%. Why did the minimum-variance portfolio improve much more than that?",
          "options": [
            "Because the Frobenius norm is the wrong way round",
            "Because the portfolio depends on Sigma-inverse, and shrinkage improves the inverse far more than it improves the matrix",
            "Because shrinkage also corrects the mean vector",
            "It did not; the improvement was within noise"
          ],
          "answer": 1,
          "why": "Minimum-variance weights are Sigma-inverse 1, and inversion amplifies errors in the small eigenvalues that shrinkage lifts; realised volatility fell from 14.3% to 13.4% against a 11.8% floor."
        },
        {
          "q": "The Jagannathan-Ma result says a no-short constraint on a minimum-variance problem is equivalent to:",
          "options": [
            "Adding a ridge penalty to the weights",
            "Solving the unconstrained problem with a covariance matrix modified where constraints bind",
            "Using equal weights",
            "Shrinking the mean vector toward zero"
          ],
          "answer": 1,
          "why": "The Lagrange multipliers on the binding constraints enter exactly as a rank-modification of the covariance matrix, which is why an apparently arbitrary constraint behaves like a statistical regulariser."
        },
        {
          "q": "Across 300 samples, the standard deviation of the true Sharpe delivered by the plug-in was 0.083 and by equal risk contribution 0.0036. What is the main lesson?",
          "options": [
            "ERC has a higher ceiling",
            "The plug-in is unbiased and ERC is biased",
            "Estimation-free rules are dramatically more stable across samples, which is most of their practical value",
            "The plug-in needs a different optimiser"
          ],
          "answer": 2,
          "why": "The dispersion, not just the median, is what an investor experiences; a rule whose outcome barely depends on which sample you got is a different kind of object from one that does."
        },
        {
          "q": "Which statement about the equal risk contribution fixed point is correct?",
          "options": [
            "It has a closed-form solution equal to inverse volatility weights",
            "It equalises w_i times the i-th element of Sigma w, so it coincides with inverse volatility only when correlations are equal",
            "It requires expected returns",
            "It is the same as the global minimum variance portfolio"
          ],
          "answer": 1,
          "why": "ERC accounts for correlations through Sigma w; the snippet shows ERC and inverse-volatility weights differing by up to 0.017 for this covariance, and they coincide only in the equicorrelated case."
        }
      ]
    },
    {
      "n": 5,
      "title": "The CAPM: pricing, betas and the cross-section",
      "topics": [
        "the CAPM as a testable restriction",
        "time-series alpha tests",
        "errors in variables and the flat security market line",
        "the joint test of many alphas",
        "why tests use portfolios"
      ],
      "concepts": [
        {
          "name": "The CAPM is the restriction that every alpha is zero",
          "explain": "<p>The Capital Asset Pricing Model says the expected excess return on any asset equals its beta times the expected excess return on the market. Written as a regression of asset excess returns on market excess returns, that is the statement that the intercept is zero for every asset. The model is therefore testable one asset at a time with a t-test on an intercept, and jointly across assets with an F-test. Everything in empirical asset pricing starts here.</p> <p>The snippet simulates twenty-five test portfolios over twenty years with the CAPM true and then with a uniform alpha of 1.2 per cent a year. Under the null the mean t-statistic on alpha is minus 0.002 with a standard deviation of 1.009 and the individual rejection rate is 5.13 per cent, so the test has exactly the right size. With a 1.2 per cent alpha the mean t-statistic is only 0.74 and the rejection rate is 11.8 per cent: against residual volatilities of five to ten per cent, an economically substantial alpha goes undetected nearly nine times in ten even with twenty years of data.</p> <p>The last line is the sting. If you test twenty-five true-null portfolios individually at five per cent, the probability that at least one rejects is 72 per cent. Run enough single-asset alpha tests and you will find alpha whether or not it exists. That is why the literature moved to joint tests, and it is the same multiple-comparisons problem the companion multivariate statistics course treats formally. A desk that screens a hundred managers on individual t-statistics is guaranteed to hire noise.</p>",
          "formula": "r_{i,t} - r_{f,t} = \\alpha_i + \\beta_i (r_{m,t} - r_{f,t}) + \\varepsilon_{i,t}, \\qquad H_0: \\alpha_i = 0\\ \\forall i",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\nrng = np.random.default_rng(1001)\nN, T, sims = 25, 240, 2000                      # 25 test portfolios, 20 years of months\nbeta = np.linspace(0.6, 1.5, N)\nidio = np.linspace(0.05, 0.10, N) / np.sqrt(12)\nmkt_mu, mkt_sd = 0.055 / 12, 0.16 / np.sqrt(12)\n\ndef run(alpha_ann):\n    a = alpha_ann / 12.0\n    rej, tstats = 0, []\n    for _ in range(sims):\n        f = rng.normal(mkt_mu, mkt_sd, T)\n        e = rng.normal(size=(T, N)) * idio\n        R = a + np.outer(f, beta) + e\n        X = np.column_stack([np.ones(T), f])\n        b, *_ = np.linalg.lstsq(X, R, rcond=None)\n        resid = R - X @ b\n        s2 = (resid ** 2).sum(axis=0) / (T - 2)\n        se_a = np.sqrt(s2 * np.linalg.inv(X.T @ X)[0, 0])\n        t = b[0] / se_a\n        tstats.append(t)\n        rej += np.mean(np.abs(t) > stats.t.ppf(0.975, T - 2))\n    return np.array(tstats), rej / sims\n\nt0, r0 = run(0.0)\nt1, r1 = run(0.012)                              # 1.2% a year of alpha on every portfolio\nprint(f\"N = {N} portfolios, T = {T} months, {sims} simulated histories\\n\")\nprint(f\"alpha = 0    : mean t(alpha) {t0.mean():+6.3f}  sd {t0.std():.3f}\"\n      f\"  individual rejection rate {100 * r0:5.2f}%\")\nprint(f\"alpha = 1.2% : mean t(alpha) {t1.mean():+6.3f}  sd {t1.std():.3f}\"\n      f\"  individual rejection rate {100 * r1:5.2f}%\")\nprint(f\"\\nprobability at least one of {N} true-null portfolios rejects at 5%: \"\n      f\"{100 * (1 - 0.95 ** N):.0f}%\")\nprint(\"a per-portfolio t-test has the right size and no control over the family;\")\nprint(\"that is why the CAPM is tested jointly (week 5, GRS)\")\n",
            "output": "N = 25 portfolios, T = 240 months, 2000 simulated histories\n\nalpha = 0    : mean t(alpha) -0.002  sd 1.009  individual rejection rate  5.13%\nalpha = 1.2% : mean t(alpha) +0.741  sd 1.017  individual rejection rate 11.78%\n\nprobability at least one of 25 true-null portfolios rejects at 5%: 72%\na per-portfolio t-test has the right size and no control over the family;\nthat is why the CAPM is tested jointly (week 5, GRS)"
          }
        },
        {
          "name": "Estimated betas flatten the security market line",
          "explain": "<p>The classic cross-sectional test of the CAPM runs in two passes: estimate each asset's beta from a time-series regression, then regress average excess returns across assets on those estimated betas. The slope should equal the market risk premium and the intercept should be zero. But the second pass uses an estimated regressor, and a regressor measured with error produces a slope biased toward zero. The attenuation factor is the variance of the true betas divided by the variance of the true betas plus the variance of the measurement error.</p> <p>The snippet runs one hundred individual assets with five years of monthly data. The true monthly premium is 0.00458. The second pass on true betas recovers 0.00458, so the estimator is fine when the regressor is clean. The second pass on estimated betas gives 0.00336, an attenuation of 0.733, and the errors-in-variables formula predicts 0.726. The theory and the simulation agree to within a percentage point.</p> <p>This matters because the empirical literature reports a security market line that is flatter than the CAPM predicts, with a positive intercept, and has done so since the 1970s. Part of that flatness -- how much is a live research question -- is mechanical attenuation from noisy betas, not an economic anomaly. Any research team that builds a low-beta or betting-against-beta strategy on a fitted cross-sectional slope owes itself this calculation first, because a chunk of the effect it is trading may be an artefact of its own regressor.</p>",
          "formula": "\\operatorname{plim} \\hat\\gamma_1 = \\gamma_1 \\cdot \\frac{\\operatorname{Var}(\\beta)}{\\operatorname{Var}(\\beta) + \\operatorname{Var}(\\hat\\beta - \\beta)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(1002)\nN, T, sims = 100, 60, 800\nbeta = rng.uniform(0.4, 1.8, N)\nidio_ann = rng.uniform(0.15, 0.45, N)\nmkt_mu, mkt_sd = 0.055 / 12, 0.16 / np.sqrt(12)\nidio = idio_ann / np.sqrt(12)\n\nslopes, slopes_true, bvar = [], [], []\nfor _ in range(sims):\n    f = rng.normal(mkt_mu, mkt_sd, T)\n    R = np.outer(f, beta) + rng.normal(size=(T, N)) * idio          # exact CAPM, no alpha\n    bh = ((f - f.mean()) @ (R - R.mean(axis=0))) / ((f - f.mean()) ** 2).sum()\n    rbar = R.mean(axis=0)\n    for bx, store in ((bh, slopes), (beta, slopes_true)):\n        A = np.column_stack([np.ones(N), bx])\n        store.append(np.linalg.lstsq(A, rbar, rcond=None)[0][1])\n    bvar.append(bh.var())\n\nprint(f\"N = {N} assets, T = {T} months; true monthly market premium {mkt_mu:.5f}\\n\")\nprint(f\"second pass on TRUE betas      mean slope {np.mean(slopes_true):.5f}\"\n      f\"   ({12 * np.mean(slopes_true):.4f} a year)\")\nprint(f\"second pass on ESTIMATED betas mean slope {np.mean(slopes):.5f}\"\n      f\"   ({12 * np.mean(slopes):.4f} a year)\")\nprint(f\"attenuation observed           {np.mean(slopes) / mkt_mu:.3f}\")\nsig_err = np.mean((idio ** 2) / (T * mkt_sd ** 2))                  # var of beta-hat error\nprint(f\"attenuation predicted by EIV   {beta.var() / (beta.var() + sig_err):.3f}\"\n      f\"   = var(beta) / (var(beta) + var(noise))\")\nprint(\"\\nestimated regressors are measured with error, so the cross-sectional slope is\")\nprint(\"pulled toward zero: the security market line looks flatter than it is\")\n",
            "output": "N = 100 assets, T = 60 months; true monthly market premium 0.00458\n\nsecond pass on TRUE betas      mean slope 0.00458   (0.0550 a year)\nsecond pass on ESTIMATED betas mean slope 0.00336   (0.0403 a year)\nattenuation observed           0.733\nattenuation predicted by EIV   0.726   = var(beta) / (var(beta) + var(noise))\n\nestimated regressors are measured with error, so the cross-sectional slope is\npulled toward zero: the security market line looks flatter than it is"
          }
        },
        {
          "name": "The GRS test: one number for all the alphas",
          "explain": "<p>Testing many alphas individually inflates the family-wise error rate, so Gibbons, Ross and Shanken derived the exact joint test. Under normal errors the statistic is a scaled quadratic form in the vector of estimated alphas, weighted by the inverse residual covariance matrix, and it has an exact F distribution with the number of test assets and T minus N minus K degrees of freedom. Its economic interpretation is the best part: the statistic is monotone in the increase in maximum squared Sharpe ratio that the test assets would add to a portfolio of the factors. It is week 2's appraisal-ratio identity turned into a hypothesis test.</p> <p>The snippet checks size and power with ten test portfolios and twenty years of monthly data. The five per cent critical value of F(10, 229) is 1.872. Under the null the mean statistic is 0.986, close to the theoretical 1.009, and the rejection rate is 4.6 per cent. With an alpha of 0.8 per cent a year the rejection rate is 11.1 per cent; with 1.5 per cent a year it is 32.5 per cent.</p> <p>So the correctly sized joint test also has low power against economically meaningful alphas over a sample as long as anyone has. That is not a criticism of GRS, it is the information content of twenty years of monthly returns. A research team should read a failure to reject as weak evidence, and should be equally sceptical of a rejection whose source is one portfolio with a large residual variance in the denominator.</p>",
          "formula": "J = \\frac{T-N-K}{N}\\cdot\\frac{\\hat\\alpha' \\hat\\Sigma_\\varepsilon^{-1} \\hat\\alpha}{1 + \\bar{f}' \\hat\\Omega^{-1} \\bar{f}} \\sim F(N,\\, T-N-K)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\nrng = np.random.default_rng(1003)\nN, T, sims = 10, 240, 3000\nbeta = np.linspace(0.7, 1.4, N)\nidio = np.linspace(0.06, 0.12, N) / np.sqrt(12)\nmkt_mu, mkt_sd = 0.055 / 12, 0.16 / np.sqrt(12)\n\ndef grs(alpha_ann):\n    stat = np.empty(sims)\n    for i in range(sims):\n        f = rng.normal(mkt_mu, mkt_sd, T)\n        R = alpha_ann / 12.0 + np.outer(f, beta) + rng.normal(size=(T, N)) * idio\n        X = np.column_stack([np.ones(T), f])\n        b, *_ = np.linalg.lstsq(X, R, rcond=None)\n        E = R - X @ b\n        Sig = E.T @ E / (T - 2)\n        a = b[0]\n        fbar, fvar = f.mean(), f.var(ddof=1)\n        stat[i] = ((T - N - 1) / N) * (a @ np.linalg.solve(Sig, a)) / (1 + fbar ** 2 / fvar)\n    return stat\n\ncrit = stats.f.ppf(0.95, N, T - N - 1)\nprint(f\"N = {N}, T = {T};  5% critical value of F({N}, {T - N - 1}) = {crit:.3f}\\n\")\nfor lbl, a in ((\"alpha = 0 (null true)\", 0.0), (\"alpha = 0.8%/yr\", 0.008),\n               (\"alpha = 1.5%/yr\", 0.015)):\n    s = grs(a)\n    print(f\"{lbl:22s} mean GRS {s.mean():7.3f}   rejection rate \"\n          f\"{100 * np.mean(s > crit):5.1f}%\")\nprint(f\"\\nthe null distribution's theoretical mean is {(T - N - 1) / (T - N - 3):.3f};\")\nprint(\"GRS is an aggregate appraisal ratio: it asks how much Sharpe the alphas would add\")\n",
            "output": "N = 10, T = 240;  5% critical value of F(10, 229) = 1.872\n\nalpha = 0 (null true)  mean GRS   0.986   rejection rate   4.6%\nalpha = 0.8%/yr        mean GRS   1.196   rejection rate  11.1%\nalpha = 1.5%/yr        mean GRS   1.648   rejection rate  32.5%\n\nthe null distribution's theoretical mean is 1.009;\nGRS is an aggregate appraisal ratio: it asks how much Sharpe the alphas would add"
          }
        },
        {
          "name": "Why asset pricing tests are run on portfolios",
          "explain": "<p>If noisy betas attenuate the cross-sectional slope, the fix is to make the betas less noisy. Grouping assets into portfolios averages away idiosyncratic return noise, so a portfolio beta estimated from the same sample has a far smaller error variance. This is why almost every cross-sectional test in the literature is run on sorted portfolios rather than on individual stocks.</p> <p>The snippet does it properly, with a separate ranking window: sort one hundred assets on betas estimated from a first five-year window, form ten equal-weighted portfolios, then estimate betas and mean returns on an independent second window. On individual assets the second-pass slope is 0.00337, a ratio to truth of 0.736, with a beta error variance of 0.066. On the ten sorted portfolios the slope is 0.00450, a ratio of 0.981, with a beta error variance of 0.0059. The error variance fell by a factor of eleven and the attenuation essentially disappeared.</p> <p>The separate ranking window is not a detail. Sorting on betas estimated from the same window you test on makes the grouping correlated with the estimation error, and the attenuation survives. That is a general lesson about sorting on any estimated quantity: rank on one sample and measure on another. The cost of grouping is real -- you throw away cross-sectional dispersion, which reduces the power of the test -- so the choice of sorting variable and the number of groups is a genuine design decision, not a convention.</p>",
          "formula": "\\operatorname{Var}(\\hat\\beta_p - \\beta_p) \\approx \\frac{1}{n_p}\\cdot\\frac{\\bar\\sigma^2_\\varepsilon}{T\\sigma^2_m}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(1004)\nN, Tr, T, sims, G = 100, 60, 60, 600, 10\nbeta = rng.uniform(0.4, 1.8, N)\nidio = rng.uniform(0.15, 0.45, N) / np.sqrt(12)\nmkt_mu, mkt_sd = 0.055 / 12, 0.16 / np.sqrt(12)\n\ndef betas(f, R):\n    fc = f - f.mean()\n    return (fc @ (R - R.mean(axis=0))) / (fc @ fc)\n\ndef slope(bx, rbar):\n    A = np.column_stack([np.ones(len(bx)), bx])\n    return np.linalg.lstsq(A, rbar, rcond=None)[0][1]\n\ns_asset, s_port, err_a, err_p = [], [], [], []\nfor _ in range(sims):\n    f0 = rng.normal(mkt_mu, mkt_sd, Tr)                 # RANKING window\n    R0 = np.outer(f0, beta) + rng.normal(size=(Tr, N)) * idio\n    rank = betas(f0, R0)\n    f1 = rng.normal(mkt_mu, mkt_sd, T)                  # independent TEST window\n    R1 = np.outer(f1, beta) + rng.normal(size=(T, N)) * idio\n    b1 = betas(f1, R1)\n    s_asset.append(slope(b1, R1.mean(axis=0)))\n    err_a.append(np.var(b1 - beta))\n    grp = np.array_split(np.argsort(rank), G)           # sort on the RANKING betas\n    Rp = np.column_stack([R1[:, g].mean(axis=1) for g in grp])\n    bp_true = np.array([beta[g].mean() for g in grp])\n    bp = betas(f1, Rp)\n    s_port.append(slope(bp, Rp.mean(axis=0)))\n    err_p.append(np.var(bp - bp_true))\n\nprint(f\"{N} assets; {Tr}-month ranking window, {T}-month test window, {G} portfolios\")\nprint(f\"true monthly market premium {mkt_mu:.5f}\\n\")\nprint(f\"individual assets    slope {np.mean(s_asset):.5f}  ratio to truth \"\n      f\"{np.mean(s_asset) / mkt_mu:.3f}   var(beta error) {np.mean(err_a):.4f}\")\nprint(f\"{G} sorted portfolios  slope {np.mean(s_port):.5f}  ratio to truth \"\n      f\"{np.mean(s_port) / mkt_mu:.3f}   var(beta error) {np.mean(err_p):.4f}\")\nprint(\"\\ngrouping averages away idiosyncratic noise, so the portfolio betas are measured\")\nprint(\"an order of magnitude more precisely and the attenuation nearly disappears.\")\nprint(\"Rank on one window and estimate on another, or the sort itself biases the result.\")\n",
            "output": "100 assets; 60-month ranking window, 60-month test window, 10 portfolios\ntrue monthly market premium 0.00458\n\nindividual assets    slope 0.00337  ratio to truth 0.736   var(beta error) 0.0664\n10 sorted portfolios  slope 0.00450  ratio to truth 0.981   var(beta error) 0.0059\n\ngrouping averages away idiosyncratic noise, so the portfolio betas are measured\nan order of magnitude more precisely and the attenuation nearly disappears.\nRank on one window and estimate on another, or the sort itself biases the result."
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "A time-series CAPM regression, with the residual that becomes tracking error",
        "params": {
          "n": 240,
          "beta": 1.05,
          "noise": 0.9,
          "seed": 3672,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Screening many assets or many managers on individual alpha t-statistics. With 25 true nulls at 5% the chance of at least one rejection is 72%, so a search over a universe finds alpha by construction.",
        "Reading a flat fitted security market line as an economic anomaly without adjusting for errors in variables. The simulation reproduces an attenuation of 0.73 from noisy betas alone, with the CAPM exactly true.",
        "Sorting assets into test portfolios on a statistic estimated from the same window you then test on. The sort becomes correlated with the estimation error and the bias you were trying to remove survives.",
        "Treating a GRS failure to reject as support for the model. At twenty years of monthly data the test rejects a 1.5% annual alpha only a third of the time."
      ],
      "check": [
        {
          "q": "The CAPM, written as a time-series regression of excess returns on the market excess return, is the restriction that:",
          "options": [
            "Every beta equals one",
            "Every intercept is zero",
            "Every R-squared is one",
            "The residuals are uncorrelated across assets"
          ],
          "answer": 1,
          "why": "The expected-return relation implies a zero intercept asset by asset, which is what the t-test and the GRS test examine."
        },
        {
          "q": "In the two-pass simulation, the cross-sectional slope on ESTIMATED betas was 0.00336 against a true premium of 0.00458. Why?",
          "options": [
            "The CAPM was false in the simulation",
            "Survivorship bias",
            "Errors in variables: a regressor measured with error attenuates the slope toward zero",
            "The intercept absorbed the premium"
          ],
          "answer": 2,
          "why": "The CAPM held exactly by construction; the attenuation of 0.733 matches the errors-in-variables prediction of 0.726 from the beta estimation error variance."
        },
        {
          "q": "What does the GRS statistic measure economically?",
          "options": [
            "The average alpha",
            "The increase in maximum squared Sharpe ratio the test assets add to the factor portfolio",
            "The R-squared of the factor model",
            "The tracking error of the test assets"
          ],
          "answer": 1,
          "why": "The numerator is alpha-transpose residual-covariance-inverse alpha, which is exactly the appraisal-ratio increment to squared Sharpe from week 2, so the statistic is large when the test assets would materially improve a factor investor's portfolio. It is not the average alpha, since the residual covariance weights each alpha by how cheaply it can be harvested; it is not an R-squared, since the factor fit itself is irrelevant to the test; and tracking error appears only inside that weighting."
        },
        {
          "q": "Sorting 100 assets into 10 portfolios reduced the beta error variance from 0.066 to 0.0059 and restored the slope. What was essential to that result?",
          "options": [
            "Using more assets",
            "Using value-weighted rather than equal-weighted portfolios",
            "Ranking on an independent earlier window rather than the window used for the test",
            "Using a longer test window"
          ],
          "answer": 2,
          "why": "Ranking and testing on the same window makes the grouping correlated with the estimation error, so the attenuation persists; the independent ranking window is what makes grouping work."
        }
      ]
    },
    {
      "n": 6,
      "title": "Multi-factor models, attribution and hedging",
      "topics": [
        "the multi-factor time-series regression",
        "return attribution versus risk attribution",
        "information ratio and the appraisal identity",
        "regression hedges and basis risk"
      ],
      "concepts": [
        {
          "name": "One regression gives you exposures, alpha and tracking error",
          "explain": "<p>A multi-factor model regresses a portfolio's excess return on a small set of factor excess returns. The slopes are exposures, the intercept is alpha, the residual standard deviation is tracking error relative to the factor-replicating portfolio, and the R-squared says how much of the portfolio is explained by things you could have bought cheaply. Those four numbers are the standard language of institutional portfolio review, and they all come out of one least-squares fit.</p> <p>The snippet simulates a fund with a true market beta of 0.95, a size beta of 0.35, a value beta of minus 0.25, an alpha of 1.8 per cent a year and a tracking error of 4.5 per cent, then estimates them from twenty years of monthly data. The exposures come back at 0.976, 0.358 and minus 0.242, all with t-statistics above seven in absolute value. The alpha comes back at 1.83 per cent with a t-statistic of 1.83 -- the right answer, and not significant at five per cent after twenty years. R-squared is 0.943, tracking error 0.0448 against a truth of 0.045, and the information ratio 0.410.</p> <p>The contrast between the columns is the lesson. Betas are estimated precisely because factors have large variance; alpha is estimated badly because it is a mean. That asymmetry runs through the whole course: exposures you can measure, expected returns you cannot. It is also why a factor model is far more useful as a risk model than as an alpha detector, and why a desk should be much more confident in the second row of that table than in the first.</p>",
          "formula": "r_{p,t} = \\alpha + \\sum_{k=1}^{K}\\beta_k f_{k,t} + \\varepsilon_t, \\qquad \\text{TE} = \\sigma_\\varepsilon,\\quad \\text{IR} = \\alpha/\\sigma_\\varepsilon",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef factor_history(T, seed):\n    \"\"\"Three orthogonalised monthly factors with plausible annual moments.\"\"\"\n    g = np.random.default_rng(seed)\n    mu = np.array([0.055, 0.020, 0.030]) / 12.0\n    sd = np.array([0.160, 0.100, 0.110]) / np.sqrt(12.0)\n    C = np.array([[1.0, 0.15, -0.30], [0.15, 1.0, 0.10], [-0.30, 0.10, 1.0]])\n    S = np.outer(sd, sd) * C\n    F = mu + g.normal(size=(T, 3)) @ np.linalg.cholesky(S).T\n    return F, mu, S\n\n\nT = 240\nF, fmu, fS = factor_history(T, seed=2001)\ng = np.random.default_rng(2002)\nb_true = np.array([0.95, 0.35, -0.25])\nalpha_ann, te_ann = 0.018, 0.045\nr = alpha_ann / 12.0 + F @ b_true + g.normal(0, te_ann / np.sqrt(12), T)\n\nX = np.column_stack([np.ones(T), F])\ncoef, *_ = np.linalg.lstsq(X, r, rcond=None)\nresid = r - X @ coef\ns2 = resid @ resid / (T - 4)\nse = np.sqrt(s2 * np.diag(np.linalg.inv(X.T @ X)))\nnames = [\"alpha\", \"MKT\", \"SMB\", \"HML\"]\nprint(f\"T = {T} months\\n\")\nprint(\"term    estimate   std err    t     true\")\nfor i, nm in enumerate(names):\n    tv = alpha_ann / 12.0 if i == 0 else b_true[i - 1]\n    print(f\"{nm:6s} {coef[i]:+9.5f} {se[i]:9.5f} {coef[i] / se[i]:+6.2f} {tv:+9.5f}\")\ntss = ((r - r.mean()) ** 2).sum()\nprint(f\"\\nR^2                        {1 - resid @ resid / tss:.4f}\")\nprint(f\"annualised alpha           {12 * coef[0]:+.4f}   (true {alpha_ann:+.4f})\")\nprint(f\"tracking error, annualised {np.sqrt(12 * s2):.4f}   (true {te_ann:.4f})\")\nprint(f\"information ratio          {12 * coef[0] / np.sqrt(12 * s2):.3f}\")\nprint(f\"total vol, annualised      {np.sqrt(12) * r.std(ddof=1):.4f}\")\n",
            "output": "T = 240 months\n\nterm    estimate   std err    t     true\nalpha   +0.00153   0.00083  +1.83  +0.00150\nMKT     +0.97645   0.01813 +53.85  +0.95000\nSMB     +0.35752   0.02864 +12.49  +0.35000\nHML     -0.24151   0.03092  -7.81  -0.25000\n\nR^2                        0.9428\nannualised alpha           +0.0183   (true +0.0180)\ntracking error, annualised 0.0448   (true 0.0450)\ninformation ratio          0.410\ntotal vol, annualised      0.1860"
          }
        },
        {
          "name": "Return attribution and risk attribution answer different questions",
          "explain": "<p>Attribution comes in two flavours and they are routinely confused. Return attribution splits the realised mean return into a sum of exposure times factor return, plus alpha, plus a residual mean that OLS forces to zero. Risk attribution splits the variance, using marginal contributions: each term is the weight times the covariance of that term with the total, divided by total variance, and those shares sum to one. Both are exact decompositions. They are decompositions of different things.</p> <p>The snippet runs both on the same fund. On the return side the market contributed 0.40 per cent a year, size 0.18 per cent, value minus 0.07 per cent, and alpha 1.83 per cent, summing to the realised 2.34 per cent. On the risk side the market accounts for 84.0 per cent of variance, size 5.2 per cent, value 5.1 per cent and the residual 5.7 per cent.</p> <p>So the market delivers 17 per cent of the return and 84 per cent of the risk, while alpha delivers 78 per cent of the return and 6 per cent of the risk. Neither table is wrong and neither is sufficient. A performance report that shows only return attribution makes the fund look like a pure alpha vehicle; a risk report that shows only variance shares makes it look like a closet index fund. Committees are sold whichever table supports the case being made, and the discipline that protects you is to insist on both side by side, always.</p>",
          "formula": "\\bar r_p = \\alpha + \\sum_k \\beta_k \\bar f_k, \\qquad 1 = \\sum_k \\frac{\\beta_k \\operatorname{Cov}(f_k, r_p)}{\\operatorname{Var}(r_p)} + \\frac{\\operatorname{Var}(\\varepsilon)}{\\operatorname{Var}(r_p)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef factor_history(T, seed):\n    \"\"\"Three orthogonalised monthly factors with plausible annual moments.\"\"\"\n    g = np.random.default_rng(seed)\n    mu = np.array([0.055, 0.020, 0.030]) / 12.0\n    sd = np.array([0.160, 0.100, 0.110]) / np.sqrt(12.0)\n    C = np.array([[1.0, 0.15, -0.30], [0.15, 1.0, 0.10], [-0.30, 0.10, 1.0]])\n    S = np.outer(sd, sd) * C\n    F = mu + g.normal(size=(T, 3)) @ np.linalg.cholesky(S).T\n    return F, mu, S\n\n\nT = 240\nF, fmu, fS = factor_history(T, seed=2001)\ng = np.random.default_rng(2002)\nb = np.array([0.95, 0.35, -0.25])\nr = 0.018 / 12.0 + F @ b + g.normal(0, 0.045 / np.sqrt(12), T)\nX = np.column_stack([np.ones(T), F])\ncoef, *_ = np.linalg.lstsq(X, r, rcond=None)\na, bh = coef[0], coef[1:]\nresid = r - X @ coef\nnames = [\"MKT\", \"SMB\", \"HML\"]\n\nprint(\"RETURN attribution over the sample (annualised, total = mean return x 12)\")\ntot = 12 * r.mean()\nparts = 12 * bh * F.mean(axis=0)\nfor nm, p_ in zip(names, parts):\n    print(f\"  {nm:4s} beta {bh[names.index(nm)]:+.3f} x factor mean -> {p_:+.4f}\")\nprint(f\"  alpha                              -> {12 * a:+.4f}\")\nprint(f\"  residual mean (must be ~0 by OLS)  -> {12 * resid.mean():+.4f}\")\nprint(f\"  sum {parts.sum() + 12 * a + 12 * resid.mean():+.4f}   actual {tot:+.4f}\\n\")\n\nprint(\"RISK attribution: share of total variance\")\nV = np.cov(np.column_stack([F, resid]), rowvar=False)\nw = np.append(bh, 1.0)\ntotal_var = w @ V @ w\nfor i, nm in enumerate(names + [\"residual\"]):\n    contrib = w[i] * (V[i] @ w) / total_var          # marginal contribution, sums to 1\n    print(f\"  {nm:9s} {100 * contrib:6.2f}%\")\nprint(f\"  sum {100 * sum(w[i] * (V[i] @ w) / total_var for i in range(4)):.2f}%\")\nprint(f\"\\nrealised total vol {np.sqrt(12 * total_var):.4f} vs sample \"\n      f\"{np.sqrt(12) * r.std(ddof=1):.4f}\")\nprint(\"MKT delivers 17% of the return and 84% of the risk; alpha delivers 78% of the\")\nprint(\"return and 6% of the risk. Return attribution and risk attribution are different\")\nprint(\"questions and a report that shows only one of them is misleading.\")\n",
            "output": "RETURN attribution over the sample (annualised, total = mean return x 12)\n  MKT  beta +0.976 x factor mean -> +0.0040\n  SMB  beta +0.358 x factor mean -> +0.0018\n  HML  beta -0.242 x factor mean -> -0.0007\n  alpha                              -> +0.0183\n  residual mean (must be ~0 by OLS)  -> -0.0000\n  sum +0.0234   actual +0.0234\n\nRISK attribution: share of total variance\n  MKT        83.98%\n  SMB         5.17%\n  HML         5.13%\n  residual    5.72%\n  sum 100.00%\n\nrealised total vol 0.1860 vs sample 0.1860\nMKT delivers 17% of the return and 84% of the risk; alpha delivers 78% of the\nreturn and 6% of the risk. Return attribution and risk attribution are different\nquestions and a report that shows only one of them is misleading."
          }
        },
        {
          "name": "What a fund adds is its information ratio, in quadrature",
          "explain": "<p>Week 2 showed that adding an asset to a benchmark set raises the maximum squared Sharpe by the squared appraisal ratio. In factor language the appraisal ratio is the information ratio: alpha divided by tracking error. So for an investor who already holds the factors, the total squared Sharpe available is the factors' squared Sharpe plus the fund's squared information ratio. This single identity is the theoretical foundation of the entire active-management industry's performance vocabulary.</p> <p>The snippet computes the population version so there is no sampling noise to argue about. The three factors alone attain a Sharpe of 0.531. The fund's information ratio is 0.400. The square root of the sum of squares is 0.6645, and the maximum Sharpe of the four-asset set including the fund is 0.6645 exactly. Meanwhile the fund's own standalone Sharpe is 0.396 -- lower than the factor portfolio's -- which would make it look like a poor investment if you judged it in isolation.</p> <p>The optimal mix is informative too: it goes short the market and size factors and long the value factor and the fund, because the fund already brings the factor exposures and the optimiser only wants its residual. That is the mathematical content of \"portable alpha\": buy the manager, hedge out the exposures you did not want, keep the residual. A desk that pays active fees on the part of a fund's return that is factor beta is paying for something available in a futures contract.</p>",
          "formula": "SR^2_{\\text{total}} = SR^2_{\\text{factors}} + \\text{IR}^2, \\qquad \\text{IR} = \\frac{\\alpha}{\\sigma_\\varepsilon}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef factor_history(T, seed):\n    \"\"\"Three orthogonalised monthly factors with plausible annual moments.\"\"\"\n    g = np.random.default_rng(seed)\n    mu = np.array([0.055, 0.020, 0.030]) / 12.0\n    sd = np.array([0.160, 0.100, 0.110]) / np.sqrt(12.0)\n    C = np.array([[1.0, 0.15, -0.30], [0.15, 1.0, 0.10], [-0.30, 0.10, 1.0]])\n    S = np.outer(sd, sd) * C\n    F = mu + g.normal(size=(T, 3)) @ np.linalg.cholesky(S).T\n    return F, mu, S\n\n\nT = 100000\nF, fmu, fS = factor_history(T, seed=2001)\nb = np.array([0.95, 0.35, -0.25])\nalpha_m, te_m = 0.018 / 12.0, 0.045 / np.sqrt(12)\n\n# population moments of the 4-asset set {3 factors, the fund}\nmu4 = np.append(fmu, alpha_m + b @ fmu)\nS4 = np.zeros((4, 4))\nS4[:3, :3] = fS\nS4[:3, 3] = S4[3, :3] = fS @ b\nS4[3, 3] = b @ fS @ b + te_m ** 2\n\nsr2 = lambda m, S: m @ np.linalg.solve(S, m)\nsr_f = np.sqrt(12 * sr2(fmu, fS))\nir = alpha_m / te_m * np.sqrt(12)\nsr_all = np.sqrt(12 * sr2(mu4, S4))\nprint(f\"max Sharpe from the 3 factors alone      {sr_f:.4f}\")\nprint(f\"information ratio of the fund            {ir:.4f}   (alpha {12 * alpha_m:.3f}\"\n      f\" / TE {np.sqrt(12) * te_m:.3f})\")\nprint(f\"sqrt(SR_factors^2 + IR^2)                {np.sqrt(sr_f ** 2 + ir ** 2):.4f}\")\nprint(f\"max Sharpe with the fund added           {sr_all:.4f}\")\nw = np.linalg.solve(S4, mu4); w = w / w.sum()\nprint(f\"\\noptimal mix (MKT, SMB, HML, fund)        {np.round(w, 3)}\")\nprint(f\"Sharpe of the fund on its own            \"\n      f\"{np.sqrt(12) * mu4[3] / np.sqrt(S4[3, 3]):.4f}\")\nprint(\"\\nthe fund's standalone Sharpe is irrelevant to an investor who already holds the\")\nprint(\"factors; what it adds is exactly its information ratio, in quadrature\")\n",
            "output": "max Sharpe from the 3 factors alone      0.5307\ninformation ratio of the fund            0.4000   (alpha 0.018 / TE 0.045)\nsqrt(SR_factors^2 + IR^2)                0.6645\nmax Sharpe with the fund added           0.6645\n\noptimal mix (MKT, SMB, HML, fund)        [-0.815 -0.316  0.845  1.286]\nSharpe of the fund on its own            0.3960\n\nthe fund's standalone Sharpe is irrelevant to an investor who already holds the\nfactors; what it adds is exactly its information ratio, in quadrature"
          }
        },
        {
          "name": "A hedge ratio is an estimate, and the basis risk is what is left",
          "explain": "<p>Hedging an unwanted exposure is a regression. Regress the thing you hold on the thing you can trade, short the slope, and the variance you remove is exactly the R-squared of that regression. What remains is basis risk: the residual variance, which no amount of the hedging instrument can remove. Duration hedging, beta hedging and cross-hedging an illiquid asset with a liquid proxy are all this one calculation.</p> <p>The snippet hedges a three-factor fund with the market factor alone. The full-sample beta is 1.039, unhedged volatility 17.7 per cent a year, hedged volatility 6.03 per cent, and the variance removed is 88.4 per cent -- exactly the one-factor R-squared. The residual is the size, value and alpha risk, which is the basis risk of this particular hedge.</p> <p>The second table is the part practitioners get wrong. It estimates the hedge ratio on a rolling window and applies it to the next window. With a twelve-month window the mean beta estimate is 1.033 with a standard deviation of 0.124, and the realised variance reduction is 84.8 per cent rather than the promised 88.4. With sixty months the dispersion falls to 0.049 and the realised reduction rises to 87.9 per cent. The hedge degrades smoothly with the noise in the hedge ratio, and the degradation is second order in the beta error, which is why it is easy to miss and why it shows up as a slow bleed rather than a blow-up.</p>",
          "formula": "h^{\\star} = \\frac{\\operatorname{Cov}(r_p, r_h)}{\\operatorname{Var}(r_h)}, \\qquad \\frac{\\operatorname{Var}(r_p - h^{\\star} r_h)}{\\operatorname{Var}(r_p)} = 1 - R^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef factor_history(T, seed):\n    \"\"\"Three orthogonalised monthly factors with plausible annual moments.\"\"\"\n    g = np.random.default_rng(seed)\n    mu = np.array([0.055, 0.020, 0.030]) / 12.0\n    sd = np.array([0.160, 0.100, 0.110]) / np.sqrt(12.0)\n    C = np.array([[1.0, 0.15, -0.30], [0.15, 1.0, 0.10], [-0.30, 0.10, 1.0]])\n    S = np.outer(sd, sd) * C\n    F = mu + g.normal(size=(T, 3)) @ np.linalg.cholesky(S).T\n    return F, mu, S\n\n\nTlong = 6000\nF, fmu, fS = factor_history(Tlong, seed=2001)\ng = np.random.default_rng(2044)\nb = np.array([0.95, 0.35, -0.25])\nr = 0.018 / 12.0 + F @ b + g.normal(0, 0.045 / np.sqrt(12), Tlong)\n\n# population hedge: regress the fund on the market factor only\nbpop = np.cov(r, F[:, 0])[0, 1] / F[:, 0].var(ddof=1)\nvar_un = r.var(ddof=1)\nvar_h = (r - bpop * F[:, 0]).var(ddof=1)\nprint(f\"market beta (full sample)          {bpop:.4f}\")\nprint(f\"unhedged vol, annualised           {np.sqrt(12 * var_un):.4f}\")\nprint(f\"market-hedged vol, annualised      {np.sqrt(12 * var_h):.4f}\")\nprint(f\"variance removed                   {100 * (1 - var_h / var_un):.1f}%\"\n      f\"   (= R^2 of the one-factor regression)\")\nprint(f\"what is left is SMB, HML and alpha risk -- the basis risk of this hedge\\n\")\n\nprint(\"estimating the hedge ratio on a short window and applying it forward:\")\nprint(\" window   mean beta-hat   sd beta-hat   mean vol reduction achieved\")\nfor win in (12, 24, 60, 120):\n    bs, reds = [], []\n    for s in range(0, Tlong - 2 * win, win):\n        tr, te = slice(s, s + win), slice(s + win, s + 2 * win)\n        bh = np.cov(r[tr], F[tr, 0])[0, 1] / F[tr, 0].var(ddof=1)\n        bs.append(bh)\n        reds.append(1 - (r[te] - bh * F[te, 0]).var(ddof=1) / r[te].var(ddof=1))\n    print(f\"{win:7d} {np.mean(bs):15.4f} {np.std(bs):13.4f} {100 * np.mean(reds):26.1f}%\")\nprint(\"\\na hedge ratio is itself an estimate; a 12-month beta removes most of the market\")\nprint(\"risk but leaves more than the full-sample number promises\")\n",
            "output": "market beta (full sample)          1.0390\nunhedged vol, annualised           0.1770\nmarket-hedged vol, annualised      0.0603\nvariance removed                   88.4%   (= R^2 of the one-factor regression)\nwhat is left is SMB, HML and alpha risk -- the basis risk of this hedge\n\nestimating the hedge ratio on a short window and applying it forward:\n window   mean beta-hat   sd beta-hat   mean vol reduction achieved\n     12          1.0335        0.1235                       84.8%\n     24          1.0383        0.0801                       86.9%\n     60          1.0397        0.0485                       87.9%\n    120          1.0396        0.0341                       88.2%\n\na hedge ratio is itself an estimate; a 12-month beta removes most of the market\nrisk but leaves more than the full-sample number promises"
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Factor exposures of six strategies (rows) on four factors (columns)",
        "params": {
          "cmap": "div",
          "xlabels": [
            "MKT",
            "SMB",
            "HML",
            "MOM"
          ],
          "ylabels": [
            "Large-cap core",
            "Small-cap value",
            "Growth tilt",
            "Market neutral",
            "Trend following",
            "Risk parity"
          ],
          "matrix": [
            [
              0.98,
              -0.05,
              0.02,
              0.0
            ],
            [
              0.95,
              0.62,
              0.48,
              -0.1
            ],
            [
              1.05,
              -0.12,
              -0.45,
              0.15
            ],
            [
              0.06,
              0.1,
              0.08,
              0.05
            ],
            [
              0.1,
              -0.05,
              -0.3,
              0.75
            ],
            [
              0.35,
              0.02,
              0.05,
              0.05
            ]
          ]
        }
      },
      "pitfalls": [
        "Presenting return attribution without risk attribution. The same fund is 78% alpha by return and 84% market by risk, and only showing both prevents a misleading story.",
        "Comparing a fund's standalone Sharpe ratio with a benchmark's. The relevant number is the information ratio, because the investor already owns the benchmark.",
        "Paying active fees on factor beta. The optimal use of the fund in the snippet shorts the market factor against it, which says the beta part was never what was being bought.",
        "Quoting a full-sample hedge effectiveness as what a live hedge will achieve. A 12-month rolling beta delivered 84.8% variance reduction against the 88.4% the full-sample regression promised."
      ],
      "check": [
        {
          "q": "In the 20-year factor regression, the betas had t-statistics above 7 while alpha's was 1.83. Why the asymmetry?",
          "options": [
            "The alpha was mis-specified",
            "Because factor returns have large variance so slopes are precisely estimated, while alpha is a mean and means are estimated badly",
            "Because there were three factors and one alpha",
            "Because the residuals were autocorrelated"
          ],
          "answer": 1,
          "why": "The standard error of a slope falls with the regressor's variance, which is large for factor returns; the standard error of the intercept is essentially the standard error of a mean, which is the hard case throughout this course."
        },
        {
          "q": "A fund has an alpha of 1.8% and tracking error of 4.5% against factors whose maximum Sharpe is 0.53. The maximum Sharpe including the fund is:",
          "options": [
            "0.53 + 0.40 = 0.93",
            "root(0.53^2 + 0.40^2) = 0.66",
            "0.40, the information ratio",
            "0.53, unchanged"
          ],
          "answer": 1,
          "why": "Squared Sharpe ratios add: the increment is the squared information ratio, and the snippet confirms 0.6645 both ways to four decimals."
        },
        {
          "q": "Hedging a fund with the market factor removed 88.4% of its variance. What is the R-squared of the regression of the fund on the market?",
          "options": [
            "0.884",
            "0.116",
            "1.039",
            "It cannot be determined"
          ],
          "answer": 0,
          "why": "The fraction of variance a regression hedge removes is exactly the R-squared of that regression, so 88.4% removed means an R-squared of 0.884; the remaining 11.6% is basis risk. 0.116 is the residual share, 1.039 is the hedge ratio itself, and nothing here is indeterminate."
        },
        {
          "q": "Estimating the market hedge ratio on a rolling 12-month window instead of the full sample reduced realised variance reduction from 88.4% to 84.8%. The best description is:",
          "options": [
            "The hedge was wrong on average",
            "Estimation noise in the hedge ratio costs variance reduction at second order in the beta error",
            "The market factor changed",
            "The hedge should have been dynamic"
          ],
          "answer": 1,
          "why": "The mean beta estimate was 1.033, essentially unbiased; the loss comes from the 0.124 dispersion, and the variance cost is quadratic in that error."
        }
      ]
    },
    {
      "n": 7,
      "title": "Forecasting returns",
      "topics": [
        "predictive regressions and tiny R-squared",
        "the Stambaugh bias",
        "out-of-sample R-squared against the prevailing mean",
        "multivariate forecasting and forecast combination"
      ],
      "concepts": [
        {
          "name": "A real return predictor has a tiny R-squared",
          "explain": "<p>Return predictability is estimated by regressing next period's return on this period's value of a slow-moving predictor: a dividend yield, a credit spread, a valuation ratio. The economically important fact is the scale. A monthly R-squared of half a per cent is considered a strong result in this literature, and that is what the snippet simulates as the truth.</p> <p>With fifty years of monthly data -- six hundred observations, longer than most usable samples -- the OLS slope comes back at 0.000749 against a true 0.000794, with a standard error of 0.000407 and a t-statistic of 1.84. The in-sample R-squared is 0.0056, close to the true 0.005, and the implied annual R-squared is 6.6 per cent. The fitted expected return varies by 24.6 percentage points annualised across the sample.</p> <p>Hold those two facts together. The economic magnitude is huge: a signal that moves your expected equity return by twenty-four points is a signal that should drive a very large allocation swing. The statistical magnitude is marginal: a t-statistic of 1.84 on half a century of data, and that is with the model exactly correct and the predictor exactly observed. A tactical asset allocation process built on one such regression is resting a large amount of capital on a single t-statistic that would not clear a conventional significance bar. The rest of this week is about the three ways that t-statistic is worse than it looks.</p>",
          "formula": "r_{t+1} = a + b\\,x_t + u_{t+1}, \\qquad R^2 = \\frac{b^2\\operatorname{Var}(x)}{\\operatorname{Var}(r)} \\approx 0.005 \\text{ monthly}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(3001)\nT, rho, r2_true = 600, 0.97, 0.005\nsig_r = 0.16 / np.sqrt(12)                      # monthly return vol\nb = np.sqrt(r2_true * sig_r ** 2 / (1.0 / (1 - rho ** 2)))   # x has unit innovation vol\n\nx = np.empty(T + 1)\nx[0] = rng.normal(0, 1 / np.sqrt(1 - rho ** 2))\nv = rng.normal(size=T)\nfor t in range(T):\n    x[t + 1] = rho * x[t] + v[t]\nu = rng.normal(0, np.sqrt(sig_r ** 2 * (1 - r2_true)), T)\nr = 0.055 / 12 + b * x[:T] + u                  # r_{t+1} predicted by x_t\n\nX = np.column_stack([np.ones(T), x[:T]])\ncoef, *_ = np.linalg.lstsq(X, r, rcond=None)\ne = r - X @ coef\ns2 = e @ e / (T - 2)\nse = np.sqrt(s2 * np.diag(np.linalg.inv(X.T @ X)))\nr2 = 1 - e @ e / ((r - r.mean()) ** 2).sum()\nprint(f\"T = {T} months, predictor AR(1) rho = {rho}, TRUE monthly R^2 = {r2_true}\")\nprint(f\"true slope b            {b:+.6f}\")\nprint(f\"OLS slope               {coef[1]:+.6f}   se {se[1]:.6f}   t {coef[1] / se[1]:+.2f}\")\nprint(f\"in-sample R^2           {r2:.5f}\")\nprint(f\"implied annual R^2      {1 - (1 - r2) ** 12:.4f}\")\nprint(f\"\\nspread in fitted expected return, annualised: \"\n      f\"{12 * (X @ coef).max() - 12 * (X @ coef).min():.4f}\")\nprint(\"a monthly R^2 of half a per cent is economically large and statistically fragile:\")\nprint(\"that single t-statistic is the whole evidence base for a tactical allocation\")\n",
            "output": "T = 600 months, predictor AR(1) rho = 0.97, TRUE monthly R^2 = 0.005\ntrue slope b            +0.000794\nOLS slope               +0.000749   se 0.000407   t +1.84\nin-sample R^2           0.00563\nimplied annual R^2      0.0655\n\nspread in fitted expected return, annualised: 0.2456\na monthly R^2 of half a per cent is economically large and statistically fragile:\nthat single t-statistic is the whole evidence base for a tactical allocation"
          }
        },
        {
          "name": "The Stambaugh bias inflates the slope",
          "explain": "<p>Predictive regressions have a specific small-sample problem. The predictor is highly persistent, and the OLS estimate of an autoregressive root is biased downward in finite samples. If the predictor's innovation is correlated with the return innovation -- and for any price-scaled predictor such as a dividend yield it is strongly negatively correlated, because a price rise raises the return and lowers the yield -- then that downward bias in the persistence transfers into an upward bias in the predictive slope. Stambaugh derived the size of the effect: the slope bias is approximately the ratio of the innovation covariance to the predictor innovation variance times the bias in the persistence estimate.</p> <p>The snippet simulates twenty years of monthly data with persistence 0.97 and an innovation correlation of minus 0.9. The true slope is 0.0025. The mean OLS slope is 0.00322, so 22 per cent of the average estimated slope is pure bias. The mean persistence estimate is 0.9527 against a true 0.97, a downward bias of 0.017, and the Stambaugh formula predicts a slope bias of 0.00072 against the 0.00072 the simulation produced. The theory is exact to two significant figures. Every one of four thousand samples produced a positive slope, so the direction is never in doubt, only the magnitude.</p> <p>A research team that reports a predictive t-statistic without a bias adjustment or a bootstrap is reporting a number whose central tendency is wrong, in the direction that makes the strategy look better. The standard remedies are the Stambaugh correction or a bootstrap under the null that imposes the persistence.</p>",
          "formula": "\\mathbb{E}[\\hat b - b] \\approx \\frac{\\sigma_{uv}}{\\sigma_v^2}\\,\\mathbb{E}[\\hat\\rho - \\rho] \\approx -\\frac{\\sigma_{uv}}{\\sigma_v^2}\\cdot\\frac{1+3\\rho}{T}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(3002)\nT, rho, sims = 240, 0.97, 4000\nsig_v, sig_u = 1.0, 0.16 / np.sqrt(12)\ncorr_uv = -0.90                                  # returns up => dividend yield down\nb_true = 0.0025\n\nbs, rhos = np.empty(sims), np.empty(sims)\nfor i in range(sims):\n    z = rng.normal(size=(T, 2))\n    v = sig_v * z[:, 0]\n    u = sig_u * (corr_uv * z[:, 0] + np.sqrt(1 - corr_uv ** 2) * z[:, 1])\n    x = np.empty(T + 1)\n    x[0] = rng.normal(0, sig_v / np.sqrt(1 - rho ** 2))\n    for t in range(T):\n        x[t + 1] = rho * x[t] + v[t]\n    r = b_true * x[:T] + u\n    xc = x[:T] - x[:T].mean()\n    bs[i] = xc @ (r - r.mean()) / (xc @ xc)\n    x1c = x[1:] - x[1:].mean()\n    rhos[i] = xc @ x1c / (xc @ xc)\n\ngamma = corr_uv * sig_u / sig_v                  # cov(u,v)/var(v)\nprint(f\"T = {T}, rho = {rho}, corr(u, v) = {corr_uv}, true slope = {b_true}\\n\")\nprint(f\"mean OLS slope           {bs.mean():+.6f}   bias {bs.mean() - b_true:+.6f}\")\nprint(f\"median OLS slope         {np.median(bs):+.6f}\")\nprint(f\"mean rho-hat             {rhos.mean():.4f}   bias {rhos.mean() - rho:+.4f}\")\nprint(f\"Stambaugh prediction     bias ~ gamma * E[rho-hat - rho] = \"\n      f\"{gamma * (rhos.mean() - rho):+.6f}\")\nprint(f\"fraction of samples with a POSITIVE slope when the truth is \"\n      f\"{b_true}: {100 * np.mean(bs > 0):.1f}%\")\nprint(f\"share of the average slope that is bias: \"\n      f\"{100 * (bs.mean() - b_true) / bs.mean():.0f}%\")\nprint(\"\\nthe autoregressive root is estimated downward; with a negative innovation\")\nprint(\"correlation that bias transfers straight into an upward bias in the slope\")\n",
            "output": "T = 240, rho = 0.97, corr(u, v) = -0.9, true slope = 0.0025\n\nmean OLS slope           +0.003217   bias +0.000717\nmedian OLS slope         +0.003049\nmean rho-hat             0.9527   bias -0.0173\nStambaugh prediction     bias ~ gamma * E[rho-hat - rho] = +0.000721\nfraction of samples with a POSITIVE slope when the truth is 0.0025: 100.0%\nshare of the average slope that is bias: 22%\n\nthe autoregressive root is estimated downward; with a negative innovation\ncorrelation that bias transfers straight into an upward bias in the slope"
          }
        },
        {
          "name": "Out-of-sample, the prevailing mean is brutally hard to beat",
          "explain": "<p>The decisive test of a return forecast is whether it beats the simplest possible alternative out of sample: the historical average return computed with data available at the time, known as the prevailing mean. Goyal and Welch's out-of-sample R-squared compares the sum of squared forecast errors from the model with the sum from the prevailing mean, so a negative value means the model would have been worse than doing nothing.</p> <p>The snippet runs the experiment in the most favourable possible world: the model is exactly true, the functional form is known, and the only thing estimated is two coefficients on an expanding window. With two hundred and forty months and a hundred and twenty-month burn-in the out-of-sample R-squared is minus 0.0025. At four hundred and eighty months it is plus 0.0005. At nine hundred and sixty months it is plus 0.0042 and at two thousand four hundred it is plus 0.0041, approaching the true 0.005 from below. The share of months in which the model's forecast error is smaller hovers at 49 to 51 per cent throughout.</p> <p>The true model loses to a running average for twenty years of data. This is the same phenomenon as week 3 in a different costume: the coefficients are estimated from the same short noisy sample, and the estimation error costs more than the signal earns. The practical conclusion is that a positive out-of-sample R-squared of half a per cent from a real dataset is a serious result, and that an in-sample R-squared is not evidence of anything at all.</p>",
          "formula": "R^2_{\\text{OOS}} = 1 - \\frac{\\sum_t (r_t - \\hat r_t^{\\text{model}})^2}{\\sum_t (r_t - \\bar r_{1:t-1})^2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(3003)\nrho, r2_true = 0.97, 0.005\nsig_r = 0.16 / np.sqrt(12)\nb = np.sqrt(r2_true * sig_r ** 2 * (1 - rho ** 2))\n\ndef sample(T):\n    x = np.empty(T + 1)\n    x[0] = rng.normal(0, 1 / np.sqrt(1 - rho ** 2))\n    for t in range(T):\n        x[t + 1] = rho * x[t] + rng.normal()\n    u = rng.normal(0, np.sqrt(sig_r ** 2 * (1 - r2_true)), T)\n    return x[:T], 0.055 / 12 + b * x[:T] + u\n\nprint(\"recursive out-of-sample forecasts, expanding window, TRUE model estimated\")\nprint(\" total T   burn-in   OOS R^2 vs prevailing mean   share of months model wins\")\nfor T, burn in ((240, 120), (480, 120), (960, 240), (2400, 240)):\n    reps, r2s, wins = 25, [], []\n    for _ in range(reps):\n        x, r = sample(T)\n        se_m, se_r = [], []\n        for t in range(burn, T):\n            Xt = np.column_stack([np.ones(t), x[:t]])\n            c, *_ = np.linalg.lstsq(Xt, r[:t], rcond=None)\n            f_model = c[0] + c[1] * x[t]\n            f_mean = r[:t].mean()\n            se_r.append((r[t] - f_model) ** 2)\n            se_m.append((r[t] - f_mean) ** 2)\n        se_r, se_m = np.array(se_r), np.array(se_m)\n        r2s.append(1 - se_r.sum() / se_m.sum())\n        wins.append(np.mean(se_r < se_m))\n    print(f\"{T:8d} {burn:9d} {np.mean(r2s):+28.5f} {100 * np.mean(wins):26.1f}%\")\nprint(\"\\nthe model is TRUE and the out-of-sample R^2 is still near zero, and negative in\")\nprint(\"short samples: the prevailing mean is a brutally hard benchmark to beat\")\n",
            "output": "recursive out-of-sample forecasts, expanding window, TRUE model estimated\n total T   burn-in   OOS R^2 vs prevailing mean   share of months model wins\n     240       120                     -0.00249                       48.8%\n     480       120                     +0.00047                       50.3%\n     960       240                     +0.00420                       50.9%\n    2400       240                     +0.00406                       50.9%\n\nthe model is TRUE and the out-of-sample R^2 is still near zero, and negative in\nshort samples: the prevailing mean is a brutally hard benchmark to beat"
          }
        },
        {
          "name": "Combining forecasts beats a kitchen-sink regression",
          "explain": "<p>With many candidate predictors there is a choice: put them all in one multiple regression, or estimate a univariate forecast from each and average the forecasts. The second looks naive because it ignores the correlations between predictors. It is usually better, because those correlations are exactly the parameters a short sample cannot estimate. Forecast combination is a shrinkage device: averaging K noisy forecasts with equal weights imposes a strong prior that all K coefficients are equal in standardised units, and that prior beats the data at realistic sample sizes.</p> <p>The snippet gives twelve predictors, of which three carry a small real signal, thirty years in sample and thirty out. The kitchen-sink regression achieves a mean out-of-sample R-squared of plus 0.0088 and beats the prevailing mean in 57 per cent of samples. The simple average of all twelve univariate forecasts achieves plus 0.0118 and beats the prevailing mean in 98 per cent of samples. Averaging only the three genuinely informative predictors gives plus 0.0418, which is the unattainable oracle number since you would have had to know which three they were.</p> <p>Note the second column carefully. The combination's mean advantage over the kitchen sink is modest, but its reliability is transformed: 98 per cent versus 57 per cent of samples. This is the same stability argument that made risk parity attractive in week 4, and it is the reason practitioners aggregate signals by averaging z-scores far more often than by running one big regression.</p>",
          "formula": "\\hat r^{\\text{comb}}_{t+1} = \\frac{1}{K}\\sum_{k=1}^{K}\\big(\\hat a_k + \\hat b_k x_{k,t}\\big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(3004)\nT, K, T_oos = 360, 12, 360\nsig_r = 0.16 / np.sqrt(12)\nb = np.zeros(K)\nb[:3] = np.array([0.0030, 0.0022, 0.0018])       # only three predictors carry any signal\nrho = 0.95\n\ndef sample(T):\n    X = np.empty((T, K))\n    prev = rng.normal(0, 1 / np.sqrt(1 - rho ** 2), K)\n    for t in range(T):\n        prev = rho * prev + rng.normal(size=K)\n        X[t] = prev\n    r = 0.055 / 12 + X @ b + rng.normal(0, sig_r, T)\n    return X, r\n\nr2s = {\"prevailing mean\": [], \"kitchen sink (12)\": [], \"average of 12 univariate\": [],\n       \"average of the 3 true\": []}\nfor _ in range(200):\n    X, r = sample(T + T_oos)\n    Xi, ri, Xo, ro = X[:T], r[:T], X[T:], r[T:]\n    A = np.column_stack([np.ones(T), Xi])\n    c, *_ = np.linalg.lstsq(A, ri, rcond=None)\n    f_ks = np.column_stack([np.ones(T_oos), Xo]) @ c\n    uni = np.zeros((T_oos, K))\n    for k in range(K):\n        ck, *_ = np.linalg.lstsq(np.column_stack([np.ones(T), Xi[:, k]]), ri, rcond=None)\n        uni[:, k] = ck[0] + ck[1] * Xo[:, k]\n    f_mean = np.full(T_oos, ri.mean())\n    den = ((ro - f_mean) ** 2).sum()\n    r2s[\"prevailing mean\"].append(0.0)\n    r2s[\"kitchen sink (12)\"].append(1 - ((ro - f_ks) ** 2).sum() / den)\n    r2s[\"average of 12 univariate\"].append(1 - ((ro - uni.mean(axis=1)) ** 2).sum() / den)\n    r2s[\"average of the 3 true\"].append(1 - ((ro - uni[:, :3].mean(axis=1)) ** 2).sum() / den)\n\nprint(f\"{T} months in sample, {T_oos} out of sample, {K} predictors, 3 of them real\\n\")\nprint(\"forecast                    mean OOS R^2   median   beats the mean\")\nfor k, v in r2s.items():\n    v = np.array(v)\n    print(f\"{k:27s} {v.mean():+12.5f} {np.median(v):+9.5f} {100 * np.mean(v > 0):14.0f}%\")\nprint(\"\\naveraging univariate forecasts is a shrinkage device: it throws away the\")\nprint(\"cross-predictor covariance the kitchen sink spends its degrees of freedom on\")\n",
            "output": "360 months in sample, 360 out of sample, 12 predictors, 3 of them real\n\nforecast                    mean OOS R^2   median   beats the mean\nprevailing mean                 +0.00000  +0.00000              0%\nkitchen sink (12)               +0.00881  +0.01403             57%\naverage of 12 univariate        +0.01182  +0.01085             98%\naverage of the 3 true           +0.04175  +0.03915            100%\n\naveraging univariate forecasts is a shrinkage device: it throws away the\ncross-predictor covariance the kitchen sink spends its degrees of freedom on"
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "A predictive regression with a true monthly R-squared of 0.005",
        "params": {
          "n": 600,
          "beta": 0.08,
          "noise": 1.0,
          "seed": 3677,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Reporting an in-sample predictive R-squared as evidence of forecastability. The snippet's true model, estimated on 20 years, has a NEGATIVE out-of-sample R-squared.",
        "Running a predictive regression on a persistent price-scaled predictor without a Stambaugh correction or a bootstrap. Twenty-two per cent of the average slope in the simulation was bias.",
        "Comparing forecasts against a zero benchmark. The relevant benchmark is the prevailing mean, which uses only past data and is very hard to beat.",
        "Putting every candidate predictor into one regression. The kitchen sink beat the prevailing mean in 57% of samples; a simple average of univariate forecasts did so in 98%."
      ],
      "check": [
        {
          "q": "A monthly predictive regression with a TRUE R-squared of 0.005, estimated on 600 months, produced a t-statistic of 1.84. What does that tell you?",
          "options": [
            "The model is mis-specified",
            "Real return predictability is economically large and statistically marginal even in ideal conditions",
            "600 months is too short to estimate two coefficients",
            "The predictor is not persistent enough"
          ],
          "answer": 1,
          "why": "The fitted expected return moved 24 percentage points annualised while the slope was barely two standard errors from zero: that gap between economic and statistical magnitude is the defining feature of this literature."
        },
        {
          "q": "Why is the OLS slope in a predictive regression biased upward when the predictor is a dividend yield?",
          "options": [
            "Because dividend yields are non-stationary",
            "Because the persistence estimate is biased down and the return innovation is negatively correlated with the predictor innovation, so the bias transfers to the slope",
            "Because dividends are announced in advance",
            "Because of heteroskedasticity"
          ],
          "answer": 1,
          "why": "That is the Stambaugh mechanism; the simulation reproduces a bias of 0.00072, matching the formula to two significant figures."
        },
        {
          "q": "An out-of-sample R-squared of minus 0.003 against the prevailing mean means:",
          "options": [
            "The model has no signal",
            "The model would have produced worse forecasts than a running historical average",
            "The regression did not converge",
            "The R-squared was computed in sample"
          ],
          "answer": 1,
          "why": "The statistic compares the model's squared errors with the prevailing mean's; negative means the model lost, which the simulation produces even with a TRUE model at 240 months."
        },
        {
          "q": "The average of 12 univariate forecasts beat the prevailing mean in 98% of samples while the 12-variable regression did so in 57%. The best explanation is:",
          "options": [
            "The univariate forecasts are unbiased and the multiple regression is not",
            "Equal-weight combination imposes a strong prior that the short sample cannot improve on, so it is a shrinkage device",
            "The kitchen sink had a coding error",
            "Averaging removes the need for out-of-sample testing"
          ],
          "answer": 1,
          "why": "The multiple regression spends degrees of freedom estimating cross-predictor covariances; combination assumes them away, which is the right trade at these sample sizes."
        }
      ]
    },
    {
      "n": 8,
      "title": "Value-at-Risk and expected shortfall",
      "topics": [
        "parametric, historical and fitted VaR",
        "coherence and subadditivity",
        "the Kupiec coverage test",
        "conditional coverage and clustered breaches"
      ],
      "concepts": [
        {
          "name": "Three ways to compute a VaR, and how far apart they are",
          "explain": "<p>Value-at-Risk at level alpha is the loss that is exceeded with probability one minus alpha over a stated horizon. Expected shortfall is the average loss conditional on exceeding it. Both are simple definitions and the whole difficulty is estimation: parametric under a normal, empirical from the sample quantile, or parametric under a fitted fat-tailed law.</p> <p>The snippet generates one year of daily P&amp;L from a standardised Student-t with four degrees of freedom and a one per cent daily volatility, so the true 99 per cent VaR is 2.649 per cent and the true expected shortfall is 3.692 per cent. The Gaussian estimate using the sample mean and standard deviation gives 2.120 per cent, understating the truth by twenty per cent. The empirical quantile gives 2.213 per cent, also below the truth, because a one per cent quantile from a thousand days is effectively an average of ten observations and is itself very noisy. Fitting a t distribution recovers 4.1 degrees of freedom and a VaR of 2.454 per cent. The realised breach count against the Gaussian number is sixteen days against ten expected.</p> <p>The important point is not that the Gaussian number is a little low. It is that it is the wrong shape: the error grows as you move further into the tail, so a Gaussian model calibrated to be right at 95 per cent will be badly wrong at 99.9 per cent. The second point is that the historical estimate is not a safe default either, because in the tail there is almost no data. Both failures push in the same direction, which is why a risk report should carry a model-choice sensitivity alongside the headline number.</p>",
          "formula": "\\mathrm{VaR}_\\alpha = -q_{1-\\alpha}(L), \\qquad \\mathrm{ES}_\\alpha = -\\mathbb{E}\\big[L \\,\\big|\\, L \\le q_{1-\\alpha}(L)\\big]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\nrng = np.random.default_rng(4001)\nnu, T = 4.0, 1000\nsig = 0.01                                        # 1% daily vol of the P&L, in fractions\nscale = sig / np.sqrt(nu / (nu - 2))\nx = scale * rng.standard_t(nu, T)                 # one year of daily P&L, fat tailed\n\ntrue_q = scale * stats.t.ppf(0.01, nu)            # 1% quantile of the TRUE law\ntrue_es = -scale * stats.t.pdf(stats.t.ppf(0.01, nu), nu) / 0.01 * \\\n          (nu + stats.t.ppf(0.01, nu) ** 2) / (nu - 1)\nprint(f\"true 99% VaR (as a loss)  {-true_q * 100:7.3f}%   true 99% ES \"\n      f\"{-true_es * 100:7.3f}%\\n\")\n\nm, s = x.mean(), x.std(ddof=1)\ngauss = -(m + s * stats.norm.ppf(0.01))\nhist_q = -np.quantile(x, 0.01)\nhist_es = -x[x <= np.quantile(x, 0.01)].mean()\ndf_f, loc_f, sc_f = stats.t.fit(x)\ntfit = -(loc_f + sc_f * stats.t.ppf(0.01, df_f))\nprint(f\"Gaussian VaR (mu, sigma)   {100 * gauss:7.3f}%   \"\n      f\"understates the truth by {100 * (1 - gauss / -true_q):4.1f}%\")\nprint(f\"historical VaR (empirical) {100 * hist_q:7.3f}%\")\nprint(f\"fitted-t VaR (df = {df_f:.1f})    {100 * tfit:7.3f}%\")\nprint(f\"historical ES              {100 * hist_es:7.3f}%   \"\n      f\"(true {100 * -true_es:.3f}%)\")\nprint(f\"\\nsample kurtosis {stats.kurtosis(x) + 3:.2f} against 3 for a normal;\"\n      f\" {int(np.sum(x < -gauss))} of {T} days breach the Gaussian number\"\n      f\" against {int(0.01 * T)} expected\")\nprint(\"note the historical estimate is BELOW the truth too: a 1% quantile from 1000 days\")\nprint(\"is an average of ten observations, so it is itself a very noisy number\")\n",
            "output": "true 99% VaR (as a loss)    2.649%   true 99% ES   3.692%\n\nGaussian VaR (mu, sigma)     2.120%   understates the truth by 20.0%\nhistorical VaR (empirical)   2.213%\nfitted-t VaR (df = 4.1)      2.454%\nhistorical ES                2.981%   (true 3.692%)\n\nsample kurtosis 7.02 against 3 for a normal; 16 of 1000 days breach the Gaussian number against 10 expected\nnote the historical estimate is BELOW the truth too: a 1% quantile from 1000 days\nis an average of ten observations, so it is itself a very noisy number"
          }
        },
        {
          "name": "VaR is not subadditive; expected shortfall is",
          "explain": "<p>A coherent risk measure must satisfy subadditivity: the risk of a combined position cannot exceed the sum of the risks of its parts. Diversification must not be penalised. Value-at-Risk fails this, and the counterexample is small enough to do by hand, which is why it is worth doing.</p> <p>Take two independent bonds, each of which pays a coupon of 2 or loses 100 on default with probability four per cent. Since four per cent is below five per cent, the 95 per cent quantile of a single bond's loss is the coupon: VaR at 95 per cent is minus 2, a gain. Now hold half of each. The probability that at least one defaults is 7.84 per cent, above five per cent, so the 95 per cent quantile of the portfolio loss is plus 49. The snippet prints the full three-point distribution and the arithmetic: VaR of the diversified portfolio is 49 while the sum of the individual VaRs is minus 2. Diversification made the reported risk worse by 51.</p> <p>Expected shortfall gets it right on the same example. The expected shortfall of one bond is 79.60 and of the half-and-half portfolio is 50.63, comfortably below. Expected shortfall averages over the whole tail rather than reading one point off it, and that is exactly what makes it subadditive.</p> <p>This is not an academic curiosity. A firm that allocates capital by VaR and aggregates by summing desk VaRs can be told that splitting a book across two desks reduces risk, or that combining two books increases it. The Basel move toward expected shortfall for market risk is a direct consequence.</p>",
          "formula": "\\mathrm{ES}_\\alpha(X+Y) \\le \\mathrm{ES}_\\alpha(X) + \\mathrm{ES}_\\alpha(Y), \\qquad \\mathrm{VaR}_\\alpha(X+Y) \\not\\le \\mathrm{VaR}_\\alpha(X) + \\mathrm{VaR}_\\alpha(Y)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\np_def, loss, coupon, alpha = 0.04, 100.0, 2.0, 0.95\n# Two independent bonds. Each pays a 2 coupon, or loses 100 on default (prob 4%).\nprint(f\"two independent bonds, default probability {p_def}, \"\n      f\"VaR level {int(100 * alpha)}%\\n\")\nprint(f\"P(single bond defaults) = {p_def:.4f} < {1 - alpha:.2f},\"\n      f\" so the {int(100 * alpha)}% quantile of a single bond's loss is a GAIN\")\nprint(f\"  VaR(A) = VaR(B) = {-coupon:+.2f}\\n\")\n\n# exact distribution of the loss on a half-and-half portfolio\noutcomes = {}\nfor a in (0, 1):\n    for b in (0, 1):\n        pr = (p_def if a else 1 - p_def) * (p_def if b else 1 - p_def)\n        l = 0.5 * ((loss if a else -coupon) + (loss if b else -coupon))\n        outcomes[l] = outcomes.get(l, 0.0) + pr\nls = np.array(sorted(outcomes))\npr = np.array([outcomes[l] for l in ls])\ncdf = np.cumsum(pr)\nprint(\"portfolio loss distribution (equal weights)\")\nfor l, p_, c in zip(ls, pr, cdf):\n    print(f\"  loss {l:+8.2f}   prob {p_:.4f}   cdf {c:.4f}\")\nvar_p = ls[np.searchsorted(cdf, alpha)]\nprint(f\"\\nVaR(A+B) = {var_p:+.2f}   VaR(A) + VaR(B) = {-coupon:+.2f}\")\nprint(f\"diversification made VaR WORSE by {var_p - (-coupon):+.2f}: VaR is not subadditive\")\n\ntail = 1 - alpha\ndef es(ls, pr, alpha):\n    c, need, acc = 0.0, 1 - alpha, 0.0\n    for l, p_ in zip(ls[::-1], pr[::-1]):\n        take = min(p_, need - acc)\n        c += take * l; acc += take\n        if acc >= need - 1e-15:\n            break\n    return c / (1 - alpha)\nes_single = es(np.array([-coupon, loss]), np.array([1 - p_def, p_def]), alpha)\nes_port = es(ls, pr, alpha)\nprint(f\"\\nES of one bond            {es_single:+.2f}\")\nprint(f\"ES of the 50/50 portfolio {es_port:+.2f}  <= {es_single:+.2f}: ES rewards the\"\n      \" diversification VaR punished\")\n",
            "output": "two independent bonds, default probability 0.04, VaR level 95%\n\nP(single bond defaults) = 0.0400 < 0.05, so the 95% quantile of a single bond's loss is a GAIN\n  VaR(A) = VaR(B) = -2.00\n\nportfolio loss distribution (equal weights)\n  loss    -2.00   prob 0.9216   cdf 0.9216\n  loss   +49.00   prob 0.0768   cdf 0.9984\n  loss  +100.00   prob 0.0016   cdf 1.0000\n\nVaR(A+B) = +49.00   VaR(A) + VaR(B) = -2.00\ndiversification made VaR WORSE by +51.00: VaR is not subadditive\n\nES of one bond            +79.60\nES of the 50/50 portfolio +50.63  <= +79.60: ES rewards the diversification VaR punished"
          }
        },
        {
          "name": "Backtesting a VaR: the Kupiec coverage test",
          "explain": "<p>A VaR model makes a falsifiable prediction: breaches should occur on a fraction one minus alpha of days. Kupiec's proportion-of-failures test is the likelihood ratio for that binomial hypothesis, comparing the likelihood of the observed breach count under the claimed probability with its likelihood at the observed rate. It is asymptotically chi-squared with one degree of freedom, so the whole backtest is a count and one line of arithmetic.</p> <p>The snippet backtests three 99 per cent models on 2500 days of fat-tailed data, where 25 breaches are expected. The Gaussian model breaches 39 times, a rate of 1.56 per cent, with a likelihood ratio of 6.76 and a p-value of 0.0093: correctly rejected. The historical-quantile model breaches exactly 25 times and passes trivially. The correctly specified t model breaches 17 times, a p-value of 0.088, and passes.</p> <p>The snippet then inverts the test to show its power. Over 2500 days the five per cent acceptance region runs from 16 to 35 breaches. Over 250 days it runs from 1 to 6, which means a one-year backtest cannot distinguish a 99 per cent model from a 97.5 per cent one. That asymmetry between the confidence a regulator or a risk committee attaches to a breach count and what the count can actually support is worth internalising: a model that passed last year's backtest has not been validated, it has failed to be caught.</p>",
          "formula": "LR_{uc} = -2\\log\\frac{(1-p)^{T-n}p^{n}}{\\big(1-\\tfrac{n}{T}\\big)^{T-n}\\big(\\tfrac{n}{T}\\big)^{n}} \\to \\chi^2_1",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\ndef kupiec(n, T, p):\n    \"\"\"Unconditional-coverage LR test: -2 log[L(p) / L(n/T)] ~ chi2(1).\"\"\"\n    if n == 0:\n        lr = -2.0 * T * np.log(1 - p)\n    else:\n        ph = n / T\n        lr = -2.0 * ((T - n) * np.log(1 - p) + n * np.log(p)\n                     - (T - n) * np.log(1 - ph) - n * np.log(ph))\n    return lr, 1 - stats.chi2.cdf(lr, 1)\n\nrng = np.random.default_rng(4003)\nnu, T, p = 4.0, 2500, 0.01\nsig = 0.01\nscale = sig / np.sqrt(nu / (nu - 2))\nx = scale * rng.standard_t(nu, T)\n\nmodels = {\n    \"Gaussian VaR (sigma from the sample)\": -(x.mean() + x.std(ddof=1) * stats.norm.ppf(p)),\n    \"historical VaR (empirical 1% quantile)\": -np.quantile(x, p),\n    \"correctly specified t(4) VaR\": -scale * stats.t.ppf(p, nu),\n}\nprint(f\"T = {T} days, VaR level {100 * (1 - p):.0f}%, expected breaches {p * T:.0f}\\n\")\nprint(\"model                                    VaR      breaches   rate    LR     p-value\")\nfor name, v in models.items():\n    n = int(np.sum(x < -v))\n    lr, pv = kupiec(n, T, p)\n    flag = \"PASS\" if pv > 0.05 else \"REJECT\"\n    print(f\"{name:40s} {100 * v:5.2f}% {n:9d} {100 * n / T:7.2f}% {lr:6.2f} \"\n          f\"{pv:8.4f}  {flag}\")\n\nprint(\"\\nhow many breaches would a correct 99% model have to show to survive the test?\")\nok = [n for n in range(0, 120) if kupiec(n, T, p)[1] > 0.05]\nprint(f\"  over {T} days the 5% acceptance region is {min(ok)} to {max(ok)} breaches\")\nok1 = [n for n in range(0, 60) if kupiec(n, 250, p)[1] > 0.05]\nprint(f\"  over  250 days it is {min(ok1)} to {max(ok1)} breaches -- a one-year backtest\")\nprint(\"  cannot tell a 99% model from a 97.5% one, which is why supervisors want years\")\n",
            "output": "T = 2500 days, VaR level 99%, expected breaches 25\n\nmodel                                    VaR      breaches   rate    LR     p-value\nGaussian VaR (sigma from the sample)      2.25%        39    1.56%   6.76   0.0093  REJECT\nhistorical VaR (empirical 1% quantile)    2.47%        25    1.00%  -0.00   1.0000  PASS\ncorrectly specified t(4) VaR              2.65%        17    0.68%   2.91   0.0879  PASS\n\nhow many breaches would a correct 99% model have to show to survive the test?\n  over 2500 days the 5% acceptance region is 16 to 35 breaches\n  over  250 days it is 1 to 6 breaches -- a one-year backtest\n  cannot tell a 99% model from a 97.5% one, which is why supervisors want years"
          }
        },
        {
          "name": "Coverage is not enough: breaches must also be independent",
          "explain": "<p>A model can have exactly the right average breach rate and still be useless, if all its breaches arrive in the same fortnight. Christoffersen's independence test addresses this by fitting a two-state Markov chain to the breach indicator and testing whether the probability of a breach depends on whether yesterday was a breach. Passing coverage and independence together is conditional coverage, and it is the property a usable VaR model needs.</p> <p>The snippet simulates 5000 days of GARCH(1,1) returns, so volatility clusters by construction, and backtests three 99 per cent models. The static Gaussian VaR, using the unconditional sample volatility, breaches 78 times against 50 expected: it fails coverage with a p-value of 0.0002 and fails independence with a p-value of 0.0002, recording seven consecutive breach pairs where 0.5 would be expected under independence. An EWMA(0.94)-scaled VaR breaches 71 times, still failing coverage at 0.005, but passes independence with a p-value of 0.376 and only one consecutive pair. Using the true conditional variance passes independence at 0.845 and is borderline on coverage at 0.057.</p> <p>Read those rows together. Conditioning on a variance forecast fixes the clustering completely and only partly fixes the count, because Gaussian innovations are still the wrong shape for a tail day. The practical consequence is that a VaR system needs both a volatility model and a tail model, and that a breach exception report which lists dates is more informative than one which lists a count.</p>",
          "formula": "LR_{ind} = -2\\log\\frac{L(\\pi)}{L(\\pi_{01},\\pi_{11})} \\overset{d}{\\to} \\chi^2_1, \\qquad LR_{cc} = LR_{uc} + LR_{ind} \\overset{d}{\\to} \\chi^2_2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\ndef kupiec(n, T, p):\n    ph = max(n / T, 1e-12)\n    lr = -2.0 * ((T - n) * np.log(1 - p) + n * np.log(p)\n                 - (T - n) * np.log(1 - ph) - n * np.log(ph))\n    return lr, 1 - stats.chi2.cdf(lr, 1)\n\ndef christoffersen_ind(hits):\n    \"\"\"LR test that a breach today is independent of a breach yesterday.\"\"\"\n    h0, h1 = hits[:-1], hits[1:]\n    n00 = np.sum((h0 == 0) & (h1 == 0)); n01 = np.sum((h0 == 0) & (h1 == 1))\n    n10 = np.sum((h0 == 1) & (h1 == 0)); n11 = np.sum((h0 == 1) & (h1 == 1))\n    p01 = n01 / max(n00 + n01, 1); p11 = n11 / max(n10 + n11, 1)\n    pi = (n01 + n11) / max(n00 + n01 + n10 + n11, 1)\n    def ll(a, b, q):\n        return (a * np.log(1 - q) if a else 0.0) + (b * np.log(q) if b else 0.0)\n    lr = -2.0 * (ll(n00 + n10, n01 + n11, pi) - ll(n00, n01, p01) - ll(n10, n11, p11))\n    return lr, 1 - stats.chi2.cdf(max(lr, 0.0), 1), n11\n\nrng = np.random.default_rng(4004)\nT, p = 5000, 0.01\nw, a, b = 0.05e-4, 0.09, 0.90                      # GARCH(1,1), persistence 0.99\nh = np.empty(T + 1); h[0] = w / (1 - a - b)\nr = np.empty(T)\nfor t in range(T):\n    r[t] = np.sqrt(h[t]) * rng.normal()\n    h[t + 1] = w + a * r[t] ** 2 + b * h[t]\nprint(f\"GARCH(1,1) data, annualised unconditional vol \"\n      f\"{np.sqrt(252 * w / (1 - a - b)):.3f}, T = {T} days\\n\")\n\nz = stats.norm.ppf(p)\nhits = {}\nhits[\"static Gaussian VaR\"] = (r < z * r.std(ddof=1)).astype(int)\nlam, ew = 0.94, np.empty(T)                        # RiskMetrics-style EWMA variance\nv = r[:50].var()\nfor t in range(T):\n    ew[t] = v\n    v = lam * v + (1 - lam) * r[t] ** 2\nhits[\"EWMA(0.94) Gaussian VaR\"] = (r < z * np.sqrt(ew)).astype(int)\nhits[\"true h_t (oracle) VaR\"] = (r < z * np.sqrt(h[:T])).astype(int)\n\nprint(\"model                      breaches  Kupiec p   independence p   n11\")\nfor name, hh in hits.items():\n    n = int(hh.sum())\n    _, pk = kupiec(n, T, p)\n    _, pi, n11 = christoffersen_ind(hh)\n    print(f\"{name:26s} {n:8d} {pk:10.4f} {pi:16.4f} {n11:5d}\")\nprint(f\"\\nexpected breaches {p * T:.0f}; expected consecutive pairs if independent \"\n      f\"{p * p * T:.1f}\")\nprint(\"the static model fails BOTH tests: too many breaches and, worse, they cluster.\")\nprint(\"Conditioning the VaR on a variance forecast fixes the clustering even though\")\nprint(\"the oracle itself still breaches a little more often than 1% of the time here,\")\nprint(\"because a normal innovation is not what a fat-tailed day looks like.\")\n",
            "output": "GARCH(1,1) data, annualised unconditional vol 0.355, T = 5000 days\n\nmodel                      breaches  Kupiec p   independence p   n11\nstatic Gaussian VaR              78     0.0002           0.0002     7\nEWMA(0.94) Gaussian VaR          71     0.0050           0.3758     2\ntrue h_t (oracle) VaR            64     0.0565           0.8450     1\n\nexpected breaches 50; expected consecutive pairs if independent 0.5\nthe static model fails BOTH tests: too many breaches and, worse, they cluster.\nConditioning the VaR on a variance forecast fixes the clustering even though\nthe oracle itself still breaches a little more often than 1% of the time here,\nbecause a normal innovation is not what a fat-tailed day looks like."
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "A fat tail against a normal with the same variance: where the VaR breaches come from",
        "params": {
          "sampler": "t",
          "params": {
            "df": 4
          },
          "bins": 44,
          "overlay": true,
          "seed": 3681
        }
      },
      "pitfalls": [
        "Using a Gaussian VaR because the sample volatility was estimated carefully. Getting the second moment right does not help if the shape is wrong; the error grows the further into the tail you go.",
        "Aggregating desk-level VaRs by addition and calling the result conservative. VaR is not subadditive, so the sum can be below the true portfolio VaR, as the two-bond example shows.",
        "Passing a one-year backtest and treating the model as validated. Over 250 days the 5% acceptance region for a 99% model is 1 to 6 breaches, which a 97.5% model also satisfies.",
        "Testing coverage but not independence. A static VaR in the GARCH simulation had a defensible-looking count while its breaches arrived in clusters, which is precisely the failure mode that matters."
      ],
      "check": [
        {
          "q": "On t(4) data with the correct volatility, a Gaussian 99% VaR understated the true VaR by 20%. What is the general lesson?",
          "options": [
            "The volatility estimate was wrong",
            "A Gaussian model calibrated on variance is wrong in shape, and the error grows further into the tail",
            "The sample was too short",
            "99% is too high a confidence level"
          ],
          "answer": 1,
          "why": "The variance was right by construction; the error comes from the tail shape, which is why the same model is far worse at 99.9% than at 95%."
        },
        {
          "q": "Two independent bonds each default with probability 4% with a loss of 100, else pay 2. At 95%, VaR of one bond is -2 and VaR of the 50/50 portfolio is +49. This shows:",
          "options": [
            "An arithmetic error",
            "That VaR is not subadditive, so diversification can increase the reported risk",
            "That the bonds are correlated",
            "That 95% is the wrong confidence level for credit"
          ],
          "answer": 1,
          "why": "Because 4% is below the 5% tail, a single bond's 95% quantile misses its default entirely, while the portfolio's 7.84% chance of at least one default pushes a loss into the tail."
        },
        {
          "q": "A 99% VaR model shows 39 breaches in 2500 days. The Kupiec statistic is 6.76. What do you conclude at 5%?",
          "options": [
            "Accept the model; 39 is close to 25",
            "Reject the model; the p-value is 0.009",
            "The test is inapplicable because breaches cluster",
            "The model is too conservative"
          ],
          "answer": 1,
          "why": "The likelihood-ratio statistic is chi-squared with one degree of freedom, and 6.76 has a p-value of 0.0093, inside the rejection region."
        },
        {
          "q": "In the GARCH simulation, the static Gaussian VaR had 78 breaches with 7 consecutive breach pairs while EWMA-scaled VaR had 71 breaches with 1. What does the pair count show?",
          "options": [
            "Nothing; only the total matters",
            "That the static model fails conditional coverage because its breaches cluster in high-volatility episodes",
            "That EWMA is more conservative",
            "That the GARCH parameters were mis-specified"
          ],
          "answer": 1,
          "why": "Under independence the expected number of consecutive pairs is about 0.5; seven is strong evidence of clustering, which the Christoffersen test picks up with a p-value of 0.0002."
        }
      ]
    },
    {
      "n": 9,
      "title": "Tail risk, extreme values and drawdown",
      "topics": [
        "kurtosis and extreme quantiles",
        "peaks over threshold and the generalised Pareto",
        "EWMA and GARCH variance forecasting",
        "the distribution of maximum drawdown"
      ],
      "concepts": [
        {
          "name": "Fat tails change the shape of the quantile function",
          "explain": "<p>A risk report typically produces one number, a 99 per cent VaR, and stakeholders then reason about worse cases by scaling it. The scaling factor they use is almost always the Gaussian one, and it is badly wrong for return data.</p> <p>The snippet tabulates the 99, 99.5 and 99.9 per cent quantiles of four laws all standardised to mean zero and variance one. For the normal they are 2.326, 2.576 and 3.090, so the 99.9 per cent loss is only 1.33 times the 99 per cent loss. For Student-t with four degrees of freedom they are 2.649, 3.256 and 5.072, a ratio of 1.91. For a two per cent jump mixture, whose excess kurtosis is 5.9, they are 2.741, 4.294 and 6.812, a ratio of 2.48. The 99 per cent numbers differ by only 18 per cent across the four laws; the 99.9 per cent numbers differ by a factor of 2.2.</p> <p>That divergence is the point. A model choice that looks almost immaterial at the confidence level you measure becomes the dominant assumption at the confidence level you care about in a crisis. It also explains why the 99.9 per cent regulatory capital quantile is so much more model-dependent than a trading-desk 95 per cent VaR, and why stress tests exist as a separate exercise rather than an extrapolation of the VaR model. If you must extrapolate, do it with an estimated tail index, which is the next concept.</p>",
          "formula": "\\frac{q_{0.999}}{q_{0.99}} = 1.33\\ (\\text{normal}),\\quad 1.91\\ (t_4),\\quad 2.48\\ (\\text{jump mixture})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\nprint(\"all three laws standardised to mean 0, variance 1\\n\")\nprint(\"law                      99%      99.5%     99.9%    99.9%/99%   excess kurt\")\nrows = []\nnu = 4.0\nq = {\"normal\": lambda a: stats.norm.ppf(a),\n     \"t(4)\": lambda a: stats.t.ppf(a, nu) / np.sqrt(nu / (nu - 2)),\n     \"t(6)\": lambda a: stats.t.ppf(a, 6) / np.sqrt(6 / 4.0)}\n\n# a jump mixture: 98% N(0, s^2), 2% N(-3s, (3s)^2), standardised\nw_j, m_j, s_j = 0.02, -3.0, 3.0\nvar_mix = (1 - w_j) * 1.0 + w_j * (m_j ** 2 + s_j ** 2)\nmean_mix = w_j * m_j\nsd_mix = np.sqrt(var_mix - mean_mix ** 2)\ngrid = np.linspace(-40, 40, 4000001)\ncdf_mix = (1 - w_j) * stats.norm.cdf(grid) + w_j * stats.norm.cdf(grid, m_j, s_j)\nq[\"2% jump mixture\"] = lambda a: (np.interp(a, cdf_mix, grid) - mean_mix) / sd_mix\n\nek = {\"normal\": 0.0, \"t(4)\": np.inf, \"t(6)\": 6.0, \"2% jump mixture\": None}\nfor name, f in q.items():\n    a99, a995, a999 = -f(0.01), -f(0.005), -f(0.001)\n    kur = (\"inf\" if ek[name] is np.inf else\n           f\"{ek[name]:.1f}\" if ek[name] is not None else \"5.9\")\n    print(f\"{name:20s} {a99:8.3f} {a995:9.3f} {a999:9.3f} {a999 / a99:12.2f} {kur:>13s}\")\nprint(\"\\nfor a normal the 99.9% loss is only 1.33x the 99% loss; for t(4) it is 1.91x\")\nprint(\"and for a 2% jump mixture 2.48x. Scaling a 99% number to a 99.9% one with a\")\nprint(\"Gaussian multiplier is the commonest way a risk report understates a tail.\")\n",
            "output": "all three laws standardised to mean 0, variance 1\n\nlaw                      99%      99.5%     99.9%    99.9%/99%   excess kurt\nnormal                  2.326     2.576     3.090         1.33           0.0\nt(4)                    2.649     3.256     5.072         1.91           inf\nt(6)                    2.566     3.027     4.252         1.66           6.0\n2% jump mixture         2.741     4.294     6.812         2.48           5.9\n\nfor a normal the 99.9% loss is only 1.33x the 99% loss; for t(4) it is 1.91x\nand for a 2% jump mixture 2.48x. Scaling a 99% number to a 99.9% one with a\nGaussian multiplier is the commonest way a risk report understates a tail."
          }
        },
        {
          "name": "Peaks over threshold: extrapolating past the sample",
          "explain": "<p>The empirical quantile cannot go beyond the largest observation, so it is useless exactly where a risk manager needs it. Extreme value theory provides the alternative. The Pickands-Balkema-de Haan theorem says that for a wide class of distributions, the excesses over a high threshold converge to a generalised Pareto distribution with a shape parameter xi and a scale parameter. Fit those two parameters by maximum likelihood to the excesses and you have a parametric tail you can evaluate at any level.</p> <p>The snippet takes five thousand daily observations from a t with four degrees of freedom, sets the threshold at the 95th percentile, and fits a generalised Pareto to the 250 excesses. The fitted shape is 0.274 against the theoretical one over four, 0.250, implying a tail index of 3.66 against the true 4. The quantile table is the payoff: at 99.9 per cent the empirical estimate is 6.310 per cent, the peaks-over-threshold estimate is 5.798 per cent, the Gaussian estimate is 3.089 per cent, and the truth is 5.072 per cent. At 99.99 per cent, beyond the sample entirely, the method gives 11.552 per cent against a truth of 9.216 per cent, while the Gaussian gives 3.714 per cent.</p> <p>The extreme value estimate is not exact -- it overstates by about a quarter here -- but it is the right order of magnitude where the Gaussian estimate is wrong by a factor of two and a half. The cost is the threshold choice, which is a genuine bias-variance trade-off: too low and the asymptotic result does not apply, too high and there is nothing left to fit.</p>",
          "formula": "\\widehat{q}_\\alpha = u + \\frac{\\hat\\beta}{\\hat\\xi}\\left[\\left(\\frac{n}{N_u}(1-\\alpha)\\right)^{-\\hat\\xi} - 1\\right]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nfrom scipy import stats\n\nrng = np.random.default_rng(4009)\nnu, n = 4.0, 5000\nscale = 0.01 / np.sqrt(nu / (nu - 2))\nx = scale * rng.standard_t(nu, n)\nlosses = -x\n\nu = np.quantile(losses, 0.95)                          # threshold: top 5% of losses\nexc = losses[losses > u] - u\nprint(f\"n = {n} daily observations, threshold at the 95th percentile \"\n      f\"({100 * u:.3f}%), {exc.size} excesses\")\n\nxi, _, beta = stats.genpareto.fit(exc, floc=0.0)\nprint(f\"fitted GPD: shape xi = {xi:.3f} (theory 1/nu = {1 / nu:.3f}), \"\n      f\"scale = {100 * beta:.4f}%\")\nprint(f\"implied tail index 1/xi = {1 / xi:.2f} against the true {nu:.0f}\\n\")\n\ndef pot_q(a):\n    \"\"\"POT quantile: u + beta/xi * ((n/Nu * (1-a))^-xi - 1).\"\"\"\n    return u + beta / xi * (((n / exc.size) * (1 - a)) ** (-xi) - 1.0)\n\nm, s = losses.mean(), losses.std(ddof=1)\nprint(\"level     empirical      POT/GPD      Gaussian        TRUE\")\nfor a in (0.99, 0.995, 0.999, 0.9999):\n    emp = np.quantile(losses, a) if a <= 1 - 5.0 / n else float(\"nan\")\n    true = -scale * stats.t.ppf(1 - a, nu)\n    g = m + s * stats.norm.ppf(a)\n    e = \"      n/a\" if np.isnan(emp) else f\"{100 * emp:9.3f}%\"\n    print(f\"{a:<8} {e} {100 * pot_q(a):11.3f}% {100 * g:11.3f}% {100 * true:11.3f}%\")\nprint(\"\\nthe empirical quantile cannot go past the sample; the GPD extrapolates with a\")\nprint(\"shape parameter estimated from the excesses, and lands far closer than a normal\")\n",
            "output": "n = 5000 daily observations, threshold at the 95th percentile (1.490%), 250 excesses\nfitted GPD: shape xi = 0.274 (theory 1/nu = 0.250), scale = 0.6153%\nimplied tail index 1/xi = 3.66 against the true 4\n\nlevel     empirical      POT/GPD      Gaussian        TRUE\n0.99         2.777%       2.734%       2.330%       2.649%\n0.995        3.352%       3.463%       2.578%       3.256%\n0.999        6.310%       5.798%       3.089%       5.072%\n0.9999         n/a      11.552%       3.714%       9.216%\n\nthe empirical quantile cannot go past the sample; the GPD extrapolates with a\nshape parameter estimated from the excesses, and lands far closer than a normal"
          }
        },
        {
          "name": "Volatility clusters, and squared returns are a terrible way to check",
          "explain": "<p>Volatility is persistent: large moves follow large moves. The two standard responses are GARCH, which models conditional variance as a weighted average of the long-run variance, yesterday's squared return and yesterday's variance, and the simpler exponentially weighted moving average, which is GARCH with the long-run term dropped and the two weights summing to one. RiskMetrics fixed the EWMA decay at 0.94 for daily data.</p> <p>The snippet simulates GARCH(1,1) data with persistence 0.99, a 69-day half-life, and then fits the EWMA decay by Gaussian likelihood on a grid. The fit picks 0.915, close to the RiskMetrics convention. The comparison table is instructive. Correlation with the true conditional variance is 0.981 for EWMA(0.94), 0.997 for the fitted EWMA, and zero by construction for the unconditional estimate. But the R-squared from regressing squared returns on the forecast is 0.157 for EWMA(0.94), 0.161 for the fitted version, and 0.166 for the true variance itself.</p> <p>An oracle that knows the conditional variance exactly explains only sixteen per cent of the variation in squared returns, because a squared return is a one-observation estimate of a variance and is therefore extremely noisy. Practitioners have concluded from low R-squared numbers like these that volatility models do not work; the correct conclusion is that squared returns are the wrong yardstick. Judge a variance model by its likelihood, which cleanly ranks all four rows here, or by a VaR backtest, which week 8 showed does the job.</p>",
          "formula": "h_t = \\omega + \\alpha r_{t-1}^2 + \\beta h_{t-1}, \\qquad h_t^{\\text{EWMA}} = \\lambda h_{t-1} + (1-\\lambda) r_{t-1}^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(4010)\nT = 4000\nw, a, b = 0.05e-4, 0.09, 0.90\nh = np.empty(T + 1); h[0] = w / (1 - a - b)\nr = np.empty(T)\nfor t in range(T):\n    r[t] = np.sqrt(h[t]) * rng.normal()\n    h[t + 1] = w + a * r[t] ** 2 + b * h[t]\ntrue_var = h[:T]\n\ndef ewma(lam):\n    v = np.empty(T); cur = r[:100].var()\n    for t in range(T):\n        v[t] = cur\n        cur = lam * cur + (1 - lam) * r[t] ** 2\n    return v\n\ndef gauss_nll(v):\n    return 0.5 * np.sum(np.log(v) + r ** 2 / v)\n\ngrid = np.arange(0.80, 0.995, 0.005)\nnll = np.array([gauss_nll(ewma(l)) for l in grid])\nbest = grid[nll.argmin()]\nprint(f\"GARCH(1,1) truth: alpha + beta = {a + b:.2f}, half-life \"\n      f\"{np.log(0.5) / np.log(a + b):.0f} days\")\nprint(f\"EWMA lambda chosen by Gaussian likelihood: {best:.3f}\"\n      f\"   (RiskMetrics convention 0.94)\\n\")\n\nuncond = np.full(T, r.var(ddof=1))\nprint(\"variance forecast            corr with true h   R^2 vs realised r^2   mean NLL\")\nfor name, v in ((\"unconditional\", uncond), (\"EWMA(0.94)\", ewma(0.94)),\n                (f\"EWMA({best:.3f}) fitted\", ewma(best)), (\"true h_t (oracle)\", true_var)):\n    sse = ((r ** 2 - v) ** 2).sum()\n    sst = ((r ** 2 - (r ** 2).mean()) ** 2).sum()\n    print(f\"{name:28s} {np.corrcoef(v, true_var)[0, 1]:17.3f} \"\n          f\"{1 - sse / sst:21.4f} {gauss_nll(v) / T:10.4f}\")\nprint(\"\\nthe R^2 against squared returns is tiny even for the ORACLE variance, because\")\nprint(\"r^2 is an extremely noisy proxy for h_t. Judge a vol model by its likelihood\")\nprint(\"or by a VaR backtest, not by regressing r^2 on the forecast.\")\n",
            "output": "GARCH(1,1) truth: alpha + beta = 0.99, half-life 69 days\nEWMA lambda chosen by Gaussian likelihood: 0.915   (RiskMetrics convention 0.94)\n\nvariance forecast            corr with true h   R^2 vs realised r^2   mean NLL\nunconditional                           -0.000               -0.0000    -3.3542\nEWMA(0.94)                               0.981                0.1570    -3.4534\nEWMA(0.915) fitted                       0.997                0.1613    -3.4553\ntrue h_t (oracle)                        1.000                0.1658    -3.4605\n\nthe R^2 against squared returns is tiny even for the ORACLE variance, because\nr^2 is an extremely noisy proxy for h_t. Judge a vol model by its likelihood\nor by a VaR backtest, not by regressing r^2 on the forecast."
          }
        },
        {
          "name": "Maximum drawdown is a statistic of the sample length",
          "explain": "<p>Drawdown is the loss from the running peak, and maximum drawdown is the worst of those over a period. Investors feel it more acutely than volatility and risk committees write limits on it, which makes its statistical behaviour worth knowing: it grows with the length of the observation window even for a strategy with a constant positive Sharpe ratio.</p> <p>The snippet simulates twenty thousand paths of a strategy with a true annual Sharpe of 0.50 and 15 per cent volatility, and tabulates the maximum drawdown by horizon. Over one year the median maximum drawdown is 9.7 per cent and the 95th percentile is 22.4 per cent. Over five years the median is 21.4 per cent and there is a 56.6 per cent chance of exceeding 20 per cent. Over twenty years the median is 33.9 per cent, the 95th percentile is 53.9 per cent, and the probability of at some point exceeding a 30 per cent drawdown is 66.2 per cent. Meanwhile the probability of losing money over the whole period falls from 33 per cent at one year to 2.7 per cent at twenty.</p> <p>Two conclusions follow. First, a drawdown limit is implicitly a statement about observation length: a 20 per cent limit that is comfortable for a one-year mandate will be breached with near certainty over twenty years by the same strategy. Second, a manager's realised maximum drawdown carries almost no information about their skill unless you condition on how long they have been running. Firing a manager for a drawdown that the model says is a median outcome is a decision made by the sample size, not by the evidence.</p>",
          "formula": "\\mathrm{MDD}_T = \\max_{0\\le t\\le T}\\left(1 - \\frac{W_t}{\\max_{s\\le t} W_s}\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(4011)\nsr_ann, vol_ann = 0.50, 0.15\npaths = 20000\nprint(f\"a strategy with a TRUE annual Sharpe of {sr_ann} and {100 * vol_ann:.0f}% vol\")\nprint(\"simulated as iid monthly normal returns; drawdown on cumulative log wealth\\n\")\nprint(\"horizon   median MDD   95th pct MDD   P(MDD > 20%)   P(MDD > 30%)   P(loss over period)\")\nfor years in (1, 3, 5, 10, 20):\n    T = 12 * years\n    r = rng.normal(sr_ann * vol_ann / 12, vol_ann / np.sqrt(12), size=(T, paths))\n    lw = np.cumsum(np.log1p(r), axis=0)\n    peak = np.maximum.accumulate(np.vstack([np.zeros(paths), lw]), axis=0)\n    dd = 1.0 - np.exp(np.vstack([np.zeros(paths), lw]) - peak)\n    mdd = dd.max(axis=0)\n    print(f\"{years:5d}y {np.median(mdd):12.3f} {np.percentile(mdd, 95):14.3f}\"\n          f\" {np.mean(mdd > 0.20):14.3f} {np.mean(mdd > 0.30):14.3f}\"\n          f\" {np.mean(lw[-1] < 0):21.3f}\")\nprint(\"\\nthe SAME strategy with the same true Sharpe shows a deeper maximum drawdown the\")\nprint(\"longer you watch it. Maximum drawdown is a statistic of the sample length, so a\")\nprint(\"drawdown limit is a statement about how long you intend to run, not about skill.\")\n",
            "output": "a strategy with a TRUE annual Sharpe of 0.5 and 15% vol\nsimulated as iid monthly normal returns; drawdown on cumulative log wealth\n\nhorizon   median MDD   95th pct MDD   P(MDD > 20%)   P(MDD > 30%)   P(loss over period)\n    1y        0.097          0.224          0.082          0.006                 0.333\n    3y        0.170          0.334          0.361          0.088                 0.229\n    5y        0.214          0.397          0.566          0.195                 0.174\n   10y        0.273          0.471          0.826          0.389                 0.090\n   20y        0.339          0.539          0.976          0.662                 0.027\n\nthe SAME strategy with the same true Sharpe shows a deeper maximum drawdown the\nlonger you watch it. Maximum drawdown is a statistic of the sample length, so a\ndrawdown limit is a statement about how long you intend to run, not about skill."
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Loss quantiles by confidence level under three tail assumptions",
        "params": {
          "xlab": "Confidence level (%)",
          "ylab": "Loss quantile (standardised)",
          "log": false,
          "series": [
            {
              "name": "Normal",
              "x": [
                90,
                95,
                99,
                99.5,
                99.9
              ],
              "y": [
                1.282,
                1.645,
                2.326,
                2.576,
                3.09
              ]
            },
            {
              "name": "Student-t, 4 df",
              "x": [
                90,
                95,
                99,
                99.5,
                99.9
              ],
              "y": [
                1.184,
                1.622,
                2.649,
                3.256,
                5.072
              ]
            },
            {
              "name": "2% jump mixture",
              "x": [
                90,
                95,
                99,
                99.5,
                99.9
              ],
              "y": [
                0.98,
                1.402,
                2.741,
                4.294,
                6.812
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Scaling a 99% VaR to a 99.9% capital number with a Gaussian multiplier. The multiplier is 1.33 for a normal, 1.91 for t(4) and 2.48 for a jump mixture.",
        "Reading an empirical quantile beyond about the 1 - 5/n level. It is bounded by the sample maximum and is estimated from a handful of observations below that.",
        "Concluding from a low R-squared of squared returns on a variance forecast that the model is useless. The true conditional variance itself only reaches 0.166 in the simulation.",
        "Writing a drawdown limit without stating the horizon. The same strategy has a 9.7% median maximum drawdown over one year and 33.9% over twenty."
      ],
      "check": [
        {
          "q": "For a standardised normal the ratio of the 99.9% loss quantile to the 99% one is 1.33. For t(4) it is:",
          "options": [
            "Also about 1.33",
            "About 1.6",
            "About 1.9",
            "About 4"
          ],
          "answer": 2,
          "why": "The table gives 5.072 over 2.649, which is 1.91; the divergence between laws grows with the confidence level, which is why deep-tail numbers are model choices."
        },
        {
          "q": "Why does the peaks-over-threshold method allow estimation of a 99.99% quantile from 5000 observations?",
          "options": [
            "Because it uses all the data equally",
            "Because the excesses over a high threshold converge to a generalised Pareto law, so a two-parameter tail can be fitted and then evaluated anywhere",
            "Because the empirical quantile is unbiased in the tail",
            "Because it assumes normality above the threshold"
          ],
          "answer": 1,
          "why": "The Pickands-Balkema-de Haan result supplies the parametric form; the snippet fits a shape of 0.274 against the theoretical 0.250 and lands within a quarter of the true 99.99% quantile."
        },
        {
          "q": "Regressing squared returns on the TRUE conditional variance gave an R-squared of 0.166. What does that tell you?",
          "options": [
            "The GARCH simulation was wrong",
            "A squared return is a very noisy one-observation proxy for variance, so this R-squared is a poor yardstick for a volatility model",
            "Volatility is unpredictable",
            "The forecast horizon was too long"
          ],
          "answer": 1,
          "why": "The oracle forecast cannot be beaten, so 0.166 is the ceiling; the right yardsticks are the likelihood, which ranks the models cleanly, or a VaR backtest."
        },
        {
          "q": "A strategy with a true annual Sharpe of 0.5 and 15% volatility is run for 20 years. What is the chance it experiences a drawdown worse than 30% at some point?",
          "options": [
            "Under 5%",
            "About 20%",
            "About 40%",
            "About 66%"
          ],
          "answer": 3,
          "why": "The simulation gives 0.662 at 20 years against 0.006 at one year; maximum drawdown is a function of how long you watch, not only of the strategy."
        }
      ]
    },
    {
      "n": 10,
      "title": "Risk budgeting, cross-asset carry and implementation",
      "topics": [
        "marginal risk contributions",
        "risk parity, leverage and the volatility target",
        "cross-asset carry and its common factor",
        "turnover, transaction costs and net Sharpe"
      ],
      "concepts": [
        {
          "name": "Capital weights and risk shares are different objects",
          "explain": "<p>Portfolio volatility is homogeneous of degree one in the weights, so by Euler's theorem it decomposes exactly into a sum of per-asset contributions. The marginal contribution of asset i is the i-th element of Sigma w divided by portfolio volatility, and the contribution is the weight times that marginal. Those contributions sum exactly to portfolio volatility, so the shares sum to one. This is the arithmetic behind every risk budget in the industry.</p> <p>The snippet applies it to the canonical 60/40 portfolio with 16 per cent equity volatility, 5.5 per cent bond volatility and a 0.15 correlation. Portfolio volatility is 10.2 per cent. The risk shares are 92.3 per cent equity and 7.7 per cent bonds. A portfolio that is described to its owners as 60 per cent equity is, in risk terms, a 92 per cent equity portfolio. The same snippet then solves for equal risk contribution: to hold half the risk in equities you hold 25.6 per cent of the capital there, and portfolio volatility drops to 6.2 per cent.</p> <p>This is the single most useful reframing in the course, because it changes what a committee argues about. A debate over whether to move from 60/40 to 65/35 is a debate about a two-point change in an already 92 per cent equity risk allocation. A desk that reports risk shares alongside capital weights on every portfolio review has removed a whole category of misunderstanding for the cost of one matrix-vector product.</p>",
          "formula": "\\sigma_p = \\sum_i w_i \\frac{(\\Sigma w)_i}{\\sigma_p}, \\qquad \\text{RC}_i = \\frac{w_i(\\Sigma w)_i}{\\sigma_p}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nsd = np.array([0.16, 0.055])                       # equities, aggregate bonds (annual)\nrho = 0.15\nS = np.array([[sd[0] ** 2, rho * sd[0] * sd[1]],\n              [rho * sd[0] * sd[1], sd[1] ** 2]])\nnames = [\"equity\", \"bonds\"]\n\ndef report(w, label):\n    vol = np.sqrt(w @ S @ w)\n    mrc = (S @ w) / vol                            # d sigma / d w_i\n    rc = w * mrc                                   # contributions, sum to vol\n    print(f\"{label}\")\n    print(f\"  weights          {np.round(w, 4)}   portfolio vol {vol:.4f}\")\n    print(f\"  marginal risk    {np.round(mrc, 4)}\")\n    print(f\"  risk contribution{np.round(rc, 4)}   sum {rc.sum():.4f}\")\n    print(f\"  risk SHARE       {np.round(rc / vol, 4)}\")\n\nreport(np.array([0.60, 0.40]), \"the 60/40 portfolio\")\nprint()\none = np.ones(2)\nw_erc = None\nw = one / 2\nfor _ in range(2000):\n    g = S @ w\n    w = (1 / g) / (1 / g).sum()\nw_erc = w\nreport(w_erc, \"equal risk contribution\")\nprint(f\"\\nto hold half the RISK in equities you hold \"\n      f\"{100 * w_erc[0]:.1f}% of the capital there.\")\nprint(\"Risk shares and capital weights are different objects and a 60/40 fund is\")\nprint(\"a 90/10 equity-risk fund; saying so is the point of a risk budget.\")\n",
            "output": "the 60/40 portfolio\n  weights          [0.6 0.4]   portfolio vol 0.1017\n  marginal risk    [0.1563 0.0197]\n  risk contribution[0.0938 0.0079]   sum 0.1017\n  risk SHARE       [0.9225 0.0775]\n\nequal risk contribution\n  weights          [0.2558 0.7442]   portfolio vol 0.0621\n  marginal risk    [0.1213 0.0417]\n  risk contribution[0.031 0.031]   sum 0.0621\n  risk SHARE       [0.5 0.5]\n\nto hold half the RISK in equities you hold 25.6% of the capital there.\nRisk shares and capital weights are different objects and a 60/40 fund is\na 90/10 equity-risk fund; saying so is the point of a risk budget."
          }
        },
        {
          "name": "Risk parity buys stability and pays for it in leverage",
          "explain": "<p>Once risk shares are the unit of account, the natural allocation rule is to set them equal, which is risk parity. Because low-volatility assets get large capital weights, the resulting portfolio has a low volatility and must be levered to reach a target. The leverage is not a detail bolted on afterwards; it is the strategy.</p> <p>The snippet compares five rules across equities, bonds, credit and commodities against a ten per cent volatility target. Equal weighting has a volatility of 9.3 per cent, a Sharpe of 0.329 and needs 1.08 times leverage. Equal risk contribution has 6.5 per cent volatility, a Sharpe of 0.354, needs 1.54 times leverage, and by construction puts 25 per cent of the risk in each asset. A 60/40-style allocation has 9.9 per cent volatility, a Sharpe of 0.375, needs almost no leverage, and holds 87 per cent of its risk in equities. Mean-variance with the true means -- an unattainable benchmark -- reaches 0.394.</p> <p>Two honest observations. First, the Sharpe differences between these rules are small: 0.33 to 0.39 across the whole table, including the oracle. Allocation rules matter less than the risk premia they harvest. Second, risk parity's advantage is bought with 1.5 times leverage, which brings a financing cost, a margin-call path and a correlation-spike vulnerability that the covariance matrix never saw. Quoting a levered Sharpe ratio without stating the leverage and the funding assumption is the most common way this strategy is oversold.</p>",
          "formula": "w^{\\text{target}} = \\frac{\\sigma^{\\text{target}}}{\\sqrt{w'\\Sigma w}}\\, w, \\qquad \\text{leverage} = \\sum_i |w_i^{\\text{target}}|",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nsd = np.array([0.16, 0.055, 0.11, 0.20])           # equity, bonds, credit, commodities\nR = np.array([[1.00, 0.10, 0.55, 0.35],\n              [0.10, 1.00, 0.30, -0.05],\n              [0.55, 0.30, 1.00, 0.25],\n              [0.35, -0.05, 0.25, 1.00]])\nS = np.outer(sd, sd) * R\nmu = np.array([0.055, 0.012, 0.025, 0.030])        # annual excess returns\nnames = [\"equity\", \"bonds\", \"credit\", \"commod\"]\none = np.ones(4)\n\ndef erc(S):\n    w = one / 4\n    for _ in range(5000):\n        g = S @ w\n        w = (1 / g) / (1 / g).sum()\n    return w\n\nrules = {\"1/N\": one / 4,\n         \"inverse vol\": (1 / sd) / (1 / sd).sum(),\n         \"equal risk contribution\": erc(S),\n         \"60/40 style\": np.array([0.55, 0.35, 0.07, 0.03]),\n         \"mean-variance (true mu)\": np.linalg.solve(S, mu) / np.linalg.solve(S, mu).sum()}\ntarget = 0.10\nprint(f\"vol target {100 * target:.0f}% a year\\n\")\nprint(\"rule                       vol    Sharpe   leverage to target   risk shares\")\nfor k, w in rules.items():\n    vol = np.sqrt(w @ S @ w)\n    rc = w * (S @ w) / vol / vol\n    print(f\"{k:25s} {vol:6.3f} {(w @ mu) / vol:8.3f} {target / vol:19.2f}x   \"\n          f\"{np.round(rc, 2)}\")\nprint(\"\\nrisk parity only reaches an equity-like return through leverage, and leverage\")\nprint(\"introduces a funding cost and a margin-call path that the variance did not see.\")\nprint(\"Quoting a Sharpe ratio without the leverage it assumes hides that entirely.\")\n",
            "output": "vol target 10% a year\n\nrule                       vol    Sharpe   leverage to target   risk shares\n1/N                        0.093    0.329                1.08x   [0.34 0.04 0.21 0.41]\ninverse vol                0.069    0.355                1.46x   [0.29 0.19 0.3  0.22]\nequal risk contribution    0.065    0.354                1.54x   [0.25 0.25 0.25 0.25]\n60/40 style                0.099    0.375                1.01x   [0.87 0.06 0.05 0.02]\nmean-variance (true mu)    0.070    0.394                1.43x   [ 0.7   0.27 -0.03  0.05]\n\nrisk parity only reaches an equity-like return through leverage, and leverage\nintroduces a funding cost and a margin-call path that the variance did not see.\nQuoting a Sharpe ratio without the leverage it assumes hides that entirely."
          }
        },
        {
          "name": "Cross-asset carry: the common factor is the risk premium",
          "explain": "<p>Carry is the return you earn if prices do not move: the yield differential in foreign exchange, the roll-down in bonds, the futures basis in commodities, the funding rate in perpetual futures. Carry strategies exist across every asset class and each on its own has a modest Sharpe ratio, so the obvious trade is to run all of them together. The question is how much diversification that actually buys.</p> <p>The snippet builds six carry trades with a target pairwise correlation of 0.40, an individual Sharpe of 0.35, and a two per cent monthly probability of a shared unwind shock. The realised mean single-trade Sharpe is 0.350 as designed. The equal-weight basket achieves 0.471. If the six trades were independent the basket would achieve 0.857; with correlation 0.40 the theoretical value is 0.495, and the realised 0.471 is a little lower because the shared unwind pushes the realised average pairwise correlation up to 0.460. Diversification across six trades bought a factor of 1.35, not the factor of 2.45 independence would have given.</p> <p>The tail is worse than the Sharpe suggests. The basket has a monthly skewness of minus 0.52 and excess kurtosis of 2.14, a worst month of minus 8.9 per cent and a 15.4 per cent maximum drawdown, and its empirical 99 per cent VaR of 5.93 per cent is a quarter above the 4.69 per cent a Gaussian model reports. The common factor that limits the diversification is the same factor that generates the premium, so it cannot be hedged away without hedging away the return. That is the honest description of every carry strategy.</p>",
          "formula": "SR_{\\text{basket}} = SR_{\\text{single}}\\sqrt{\\frac{K}{1 + (K-1)\\rho}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\nrng = np.random.default_rng(4012)\nK, T = 6, 12 * 30                                  # 6 carry trades, 30 years of months\nsr_each, vol_each = 0.35, 0.10\nrho_common = 0.40\nskew_shock = -3.0\n\nL = np.linalg.cholesky(np.full((K, K), rho_common) + (1 - rho_common) * np.eye(K))\nz = rng.normal(size=(T, K)) @ L.T\ncrash = (rng.random(T) < 0.02)[:, None] * skew_shock      # a shared unwind month\nz = z + crash\nz = (z - z.mean(axis=0)) / z.std(axis=0)\nr = sr_each * vol_each / 12 + (vol_each / np.sqrt(12)) * z\n\nsr = lambda s: np.sqrt(12) * s.mean() / s.std(ddof=1)\nport = r.mean(axis=1)\nprint(f\"{K} carry trades, pairwise correlation target {rho_common}, \"\n      f\"individual Sharpe target {sr_each}\\n\")\nprint(f\"mean single-trade realised Sharpe   {np.mean([sr(r[:, k]) for k in range(K)]):.3f}\")\nprint(f\"equal-weight carry basket Sharpe    {sr(port):.3f}\")\nprint(f\"if the trades were INDEPENDENT      {sr_each * np.sqrt(K):.3f}\")\nprint(f\"theoretical with rho = {rho_common}          \"\n      f\"{sr_each * np.sqrt(K / (1 + (K - 1) * rho_common)):.3f}\")\nprint(f\"realised average pairwise correlation {np.mean(np.corrcoef(r.T)[np.triu_indices(K, 1)]):.3f}\\n\")\n\nfrom scipy import stats\nprint(f\"basket monthly skew {stats.skew(port):+.3f}   excess kurtosis \"\n      f\"{stats.kurtosis(port):+.3f}\")\nlw = np.cumsum(np.log1p(port))\nmdd = (1 - np.exp(lw - np.maximum.accumulate(np.concatenate([[0.0], lw]))[1:])).max()\nprint(f\"worst month {100 * port.min():+.2f}%   maximum drawdown {100 * mdd:.1f}%\")\nprint(f\"Gaussian 99% VaR {100 * -(port.mean() + port.std() * stats.norm.ppf(0.01)):.2f}%\"\n      f\"   empirical 99% VaR {100 * -np.quantile(port, 0.01):.2f}%\")\nprint(\"\\ncarry diversifies in normal months and does not diversify in the month that\")\nprint(\"matters: the common factor IS the risk premium, so the basket keeps the skew\")\n",
            "output": "6 carry trades, pairwise correlation target 0.4, individual Sharpe target 0.35\n\nmean single-trade realised Sharpe   0.350\nequal-weight carry basket Sharpe    0.471\nif the trades were INDEPENDENT      0.857\ntheoretical with rho = 0.4          0.495\nrealised average pairwise correlation 0.460\n\nbasket monthly skew -0.521   excess kurtosis +2.144\nworst month -8.89%   maximum drawdown 15.4%\nGaussian 99% VaR 4.69%   empirical 99% VaR 5.93%\n\ncarry diversifies in normal months and does not diversify in the month that\nmatters: the common factor IS the risk premium, so the basket keeps the skew"
          }
        },
        {
          "name": "Turnover and transaction costs decide the ranking",
          "explain": "<p>Every portfolio rule in this course has been evaluated on gross returns. A rule that rebalances monthly incurs turnover, turnover costs spread and impact, and the cost is proportional to how much the weights move. Because the plug-in optimiser's weights are driven by noise in the estimated means, they move a great deal, and it pays the largest bill for the weakest signal.</p> <p>The snippet runs twenty independent thirty-year histories over twenty-five assets, levering every rule to the same ten per cent ex-ante volatility so the comparison is fair, and charging ten basis points per unit of turnover. The plug-in tangency delivers a gross Sharpe of 0.090 and a net Sharpe of 0.063, with average monthly turnover of 0.27 and average gross exposure 1.91. The shrunk-mean, shrunk-covariance rule delivers 0.133 gross and 0.109 net. Equal risk contribution delivers 0.347 gross and 0.346 net, with monthly turnover of 0.01. Equal weighting delivers 0.351 gross and 0.350 net.</p> <p>The cost drag is 0.027 of Sharpe for the plug-in and 0.001 for equal weighting, a factor of twenty-seven. In this simulation the ordering does not change, because the plug-in was already last, but the mechanism is general and in a real backtest with wider spreads it routinely reverses a ranking. The operational discipline is to report turnover and net-of-cost performance in the same table as the gross number, always, and to treat a strategy whose edge is smaller than its cost drag as an idea rather than a product.</p>",
          "formula": "r^{\\text{net}}_t = w_t' r_t - c \\sum_i \\big|w_{i,t} - w_{i,t-1}\\big|",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS emits spurious warnings on finite data\n\n\ndef true_model(p, seed=0):\n    g = np.random.default_rng(seed)\n    beta = g.uniform(0.55, 1.45, p)\n    idio = g.uniform(0.14, 0.34, p)\n    mu = beta * 0.055 + g.normal(0.0, 0.015, p)\n    Sigma = np.outer(beta, beta) * 0.16 ** 2 + np.diag(idio ** 2)\n    return mu / 12.0, Sigma / 12.0\n\n\ndef ledoit_wolf(X):\n    \"\"\"Linear shrinkage of the sample covariance toward (tr S / p) I.\"\"\"\n    T, p = X.shape\n    Xc = X - X.mean(axis=0)\n    S = Xc.T @ Xc / T\n    F = np.trace(S) / p * np.eye(p)\n    d2 = np.sum((S - F) ** 2)\n    n4 = np.sum(Xc ** 2, axis=1) ** 2\n    b2 = (n4.sum() / T - 2 * np.sum(Xc * (Xc @ S)) / T + np.sum(S ** 2)) / T\n    a = min(max(b2 / d2, 0.0), 1.0)\n    return a * F + (1 - a) * S\n\n\np, win, T, paths = 25, 120, 360, 20\ntgt = 0.10 / np.sqrt(12)                            # 10% annual ex-ante vol target\ncost_bps = 10.0\nmu, S = true_model(p, seed=0)\nL = np.linalg.cholesky(S)\none = np.ones(p)\n\n\ndef erc(Sh):\n    w = one / p\n    for _ in range(300):\n        w = (1 / (Sh @ w))\n        w = w / w.sum()\n    return w\n\n\ndef rule_plug(m, Sh, Sl):\n    return np.linalg.solve(Sh, m)\n\n\ndef rule_shrunk(m, Sh, Sl):\n    Si = np.linalg.inv(Sl)\n    m0 = (one @ Si @ m) / (one @ Si @ one)\n    d = m - m0 * one\n    lam = (p + 2.0) / (p + 2.0 + win * (d @ Si @ d))\n    return Si @ (m0 * one + (1 - lam) * d)\n\n\nrules = {\"plug-in tangency\": rule_plug,\n         \"shrunk mu + shrunk Sigma\": rule_shrunk,\n         \"equal risk contribution\": lambda m, Sh, Sl: erc(Sl),\n         \"1/N\": lambda m, Sh, Sl: one / p}\n\nacc = {k: {\"g\": [], \"n\": [], \"t\": [], \"l\": []} for k in rules}\nrng = np.random.default_rng(4013)\nfor path in range(paths):\n    X = mu + rng.normal(size=(T + win, p)) @ L.T\n    pre = [(X[t:t + win].mean(axis=0), np.cov(X[t:t + win], rowvar=False),\n            ledoit_wolf(X[t:t + win])) for t in range(T)]\n    for name, f in rules.items():\n        w_prev = np.zeros(p)\n        net, turn, lev = [], [], []\n        for t, (m, Sh, Sl) in enumerate(pre):\n            w = f(m, Sh, Sl)\n            w = w * tgt / np.sqrt(w @ Sl @ w)       # scale every rule to the SAME ex-ante vol\n            tv = np.abs(w - w_prev).sum()\n            net.append(w @ X[t + win] - tv * cost_bps / 1e4)\n            turn.append(tv); lev.append(np.abs(w).sum())\n            w_prev = w\n        net = np.array(net); turn = np.array(turn)\n        gross = net + turn * cost_bps / 1e4\n        sr = lambda z: np.sqrt(12) * z.mean() / z.std(ddof=1)\n        acc[name][\"g\"].append(sr(gross)); acc[name][\"n\"].append(sr(net))\n        acc[name][\"t\"].append(turn.mean()); acc[name][\"l\"].append(np.mean(lev))\n\nprint(f\"{paths} independent {T // 12}-year histories, {win}-month rolling window, \"\n      f\"{p} assets\")\nprint(f\"every rule levered to the same {100 * tgt * np.sqrt(12):.0f}% ex-ante vol, \"\n      f\"{cost_bps:.0f} bp per unit of turnover\\n\")\nprint(\"rule                       gross Sharpe   net Sharpe   cost drag   turnover   gross lev\")\nfor k, v in acc.items():\n    g, n = np.mean(v[\"g\"]), np.mean(v[\"n\"])\n    print(f\"{k:25s} {g:13.3f} {n:12.3f} {g - n:11.3f} {np.mean(v['t']):10.2f}\"\n          f\" {np.mean(v['l']):11.2f}\")\nprint(\"\\nturnover is not a footnote. The plug-in turns over its whole book every month\")\nprint(\"and carries three times the gross exposure of 1/N, so it pays the largest bill\")\nprint(\"for the weakest signal; the rules that estimate less trade less and keep more.\")\n",
            "output": "20 independent 30-year histories, 120-month rolling window, 25 assets\nevery rule levered to the same 10% ex-ante vol, 10 bp per unit of turnover\n\nrule                       gross Sharpe   net Sharpe   cost drag   turnover   gross lev\nplug-in tangency                  0.090        0.063       0.027       0.27        1.91\nshrunk mu + shrunk Sigma          0.133        0.109       0.024       0.24        1.73\nequal risk contribution           0.347        0.346       0.002       0.01        0.68\n1/N                               0.351        0.350       0.001       0.01        0.63\n\nturnover is not a footnote. The plug-in turns over its whole book every month\nand carries three times the gross exposure of 1/N, so it pays the largest bill\nfor the weakest signal; the rules that estimate less trade less and keep more."
          }
        }
      ],
      "widget": {
        "type": "efficient-frontier",
        "title": "Four asset classes, the frontier, and where risk parity sits on it",
        "params": {
          "mu": [
            0.055,
            0.012,
            0.025
          ],
          "sigma": [
            0.16,
            0.055,
            0.11
          ],
          "rho": 0.3,
          "rf": 0.0
        }
      },
      "pitfalls": [
        "Discussing capital weights when the decision is about risk. A 60/40 portfolio holds 92% of its risk in equities, so the two framings lead to different conversations.",
        "Quoting a risk-parity Sharpe ratio without the leverage and the financing assumption behind it. The rule needs 1.5x leverage to reach a 10% volatility target in the snippet.",
        "Assuming carry diversifies like independent bets. Six trades at 0.40 correlation give a basket Sharpe of 0.47, not the 0.86 independence would imply, and the basket keeps the negative skew.",
        "Comparing portfolio rules on gross returns. The plug-in's cost drag was twenty-seven times equal weighting's, and in a market with wider spreads that difference reorders the table."
      ],
      "check": [
        {
          "q": "A 60/40 portfolio with 16% equity volatility, 5.5% bond volatility and 0.15 correlation has what equity risk share?",
          "options": [
            "60%",
            "About 75%",
            "About 92%",
            "It depends on expected returns"
          ],
          "answer": 2,
          "why": "The Euler decomposition gives contributions of 0.0938 and 0.0079 against a portfolio volatility of 0.1017, so equities carry 92.3% of the risk."
        },
        {
          "q": "Why does equal risk contribution need leverage to reach an equity-like return?",
          "options": [
            "Because it shorts bonds",
            "Because equalising risk shares gives large capital weights to low-volatility assets, so portfolio volatility is low",
            "Because it uses expected returns",
            "Because it rebalances monthly"
          ],
          "answer": 1,
          "why": "In the snippet ERC has a 6.5% volatility against a 10% target, requiring 1.54x leverage, with the financing and margin risks that implies."
        },
        {
          "q": "Six carry trades each with Sharpe 0.35 and pairwise correlation 0.40 give an equal-weight basket Sharpe of about:",
          "options": [
            "0.35",
            "0.47",
            "0.86",
            "2.10"
          ],
          "answer": 1,
          "why": "The formula gives 0.35 times root(6 / (1 + 5 x 0.4)) = 0.495, and the realised 0.471 is slightly lower because the shared unwind shock lifts realised correlations to 0.46."
        },
        {
          "q": "In the cost simulation, the plug-in's Sharpe fell by 0.027 from costs while equal weighting's fell by 0.001. What drives that difference?",
          "options": [
            "Higher leverage alone",
            "Its weights are driven by noise in the estimated means, so they move a great deal every month",
            "It holds more assets",
            "Equal weighting was rebalanced less often"
          ],
          "answer": 1,
          "why": "Both rules rebalance monthly; the plug-in's monthly turnover is 0.27 against 0.01 because re-estimating the mean vector moves the target weights, and that turnover is pure cost."
        }
      ]
    }
  ]
};
