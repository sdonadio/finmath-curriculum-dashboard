/* courses/finm-34000.js — Probability and Stochastic Processes.
 *
 * Built from the public course page only. The syllabus PDF is a Box shared
 * link restricted to a university login, so no syllabus text was available:
 * the week-by-week arc, explanations, code, questions and glossary below are
 * this dashboard's own reconstruction of a standard graduate treatment of the
 * topics the public page lists, in the order it lists them. Nothing here is
 * the instructor's material and nothing here is endorsed by the instructor.
 *
 * Every `output` field is the real stdout of the snippet above it, captured
 * by tools/run_snippets.py. Do not hand-edit an output.
 */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 34000"] = {
  "code": "FINM 34000",
  "slug": "finm-34000",
  "title": "Probability and Stochastic Processes",
  "instructor": "Greg Lawler",
  "quarter": "September Launch",
  "units": 50,
  "block": "core",
  "concentrations": [],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/required-courses/finm-34000/",
    "syllabus_url": "https://uchicago.box.com/s/ifnx9mxn2mklzbjfmwvowo2aw1q3f42a",
    "fetched": "2026-09-26",
    "note": "The only source consulted is the public course page, which gives an official description of the course, its instructor, its quarter and its units. The linked syllabus is a Box shared link gated behind a university login and could not be read, so data/raw/syllabus/ is empty for this course. Everything on this page beyond the description block — the five-week arc, the concepts, the code, the questions, the pitfalls and the glossary — is the dashboard's own reconstruction of a standard graduate treatment of the listed topics. It is not the instructor's outline, it was not reviewed by the instructor, and no claim is made about grading, assignments, exam format or which textbook is actually assigned."
  },
  "tier": "B",
  "description": "A mathematical introduction to probability and stochastic processes. The main focus is discrete probability and combinatorial analysis, with some continuous probability; examples and applications are emphasised over theory. The topics the public page lists, in approximate order, are conditional expectation, simple random walk, Markov chains, martingales in discrete time, the Poisson and some other jump processes, and a first introduction to Brownian motion. The stated mathematical prerequisite is an undergraduate (post-calculus) course in probability and/or statistics. The course runs as a September Launch, in the month before the in-person autumn quarter begins, which makes it the foundation every later quantitative course in the degree stands on: it is where conditional expectation stops being a formula and becomes the object that pricing, filtering and risk all reduce to.",
  "prerequisites": [
    "An undergraduate, post-calculus course in probability and/or statistics — this is the prerequisite the public course page states.",
    "Calculus through multivariable integration, and enough linear algebra to multiply matrices, solve a small linear system and read an eigenvector.",
    "Series and limits: geometric sums, comparison tests, and Stirling's approximation are used without ceremony from week 2 onward.",
    "Enough Python to write a loop, index a NumPy array and read a printed table. Every snippet here is short and vectorised; none of them needs a library beyond NumPy and SciPy."
  ],
  "textbooks": [
    {
      "title": "Introduction to Stochastic Processes",
      "author": "Gregory F. Lawler",
      "note": "A standard reference for this material: discrete Markov chains, martingales, Poisson processes and a first Brownian motion, at about the level and in about the order the public page lists. Listed as a reference, not as an assigned text."
    },
    {
      "title": "Probability with Martingales",
      "author": "David Williams",
      "note": "A standard reference for conditional expectation as a projection and for the discrete-time martingale theorems of week 4."
    },
    {
      "title": "Probability: Theory and Examples",
      "author": "Rick Durrett",
      "note": "A standard graduate reference if you want the measure-theoretic statements behind the examples worked here."
    },
    {
      "title": "Markov Chains and Mixing Times",
      "author": "David A. Levin and Yuval Peres",
      "note": "A standard reference for week 3: stationarity, the spectral gap and how fast a chain forgets where it started."
    },
    {
      "title": "A First Course in Probability",
      "author": "Sheldon Ross",
      "note": "The undergraduate level the stated prerequisite refers to; useful for brushing up combinatorics and conditioning before week 1."
    }
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
  ],
  "brushup": [
    {
      "topic": "Conditioning on an event, and Bayes' rule",
      "why": "Week 1 replaces P(A|B) with E[X | G] for a sigma-algebra G in about twenty minutes. If the elementary version is not reflexive, the general one will look like notation rather than an idea.",
      "resource": "Ross, A First Course in Probability, chapter 3"
    },
    {
      "topic": "Geometric series and Stirling's approximation",
      "why": "The recurrence argument in week 2 turns on whether a sum of terms of order 1/sqrt(n) diverges, and the gambler's-ruin formula is a geometric sum in disguise.",
      "resource": "Any calculus text's series chapter; Feller volume I, chapter 2 for Stirling"
    },
    {
      "topic": "Matrix powers, eigenvalues and eigenvectors",
      "why": "A Markov chain is a matrix, its long-run behaviour is its leading eigenvector, and the speed at which it forgets its start is the modulus of its second eigenvalue. Week 3 is linear algebra with a probabilistic reading.",
      "resource": "Strang, Introduction to Linear Algebra, chapters 5 and 6"
    },
    {
      "topic": "The normal distribution and the central limit theorem",
      "why": "Weeks 2 and 5 both consist of watching a lattice object become a Gaussian one. You should be able to state the CLT precisely and say what it does not promise about tails.",
      "resource": "Ross, chapter 8"
    },
    {
      "topic": "The exponential distribution and its memorylessness",
      "why": "The Poisson process in week 5 is defined by exponential gaps, and every property it has follows from the fact that an exponential clock forgets how long it has been running.",
      "resource": "Ross, chapter 5"
    },
    {
      "topic": "NumPy vectorisation and broadcasting",
      "why": "Every snippet in this course simulates tens of thousands of paths at once. A (n,) array silently broadcasting against an (n,1) one is the single commonest bug in a first simulation, and it produces a plausible wrong number rather than an error.",
      "resource": "The NumPy user guide, 'Broadcasting'"
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "Information, measurability and conditional expectation",
      "topics": [
        "sample spaces and sigma-algebras",
        "filtrations as information",
        "conditional expectation given a sigma-algebra",
        "the tower property",
        "L2 projection",
        "law of total variance"
      ],
      "concepts": [
        {
          "name": "A sigma-algebra is a description of what you know",
          "explain": "<p>A probability space is a triple: a set of outcomes, a collection of subsets you are allowed to assign probability to, and the assignment itself. The middle object, the sigma-algebra, is the one that does the work in this course, because it is not really a technical nuisance about non-measurable sets — it is a bookkeeping device for <em>information</em>. On a finite space a sigma-algebra is exactly a partition of the outcomes into atoms, and knowing the sigma-algebra means knowing which atom you are in and nothing finer.</p><p>Once you read it that way, measurability stops being jargon. A random variable is measurable with respect to a sigma-algebra precisely when it is constant on every atom: the information determines its value. In a market that is the difference between the price you can see and the price you cannot. A filtration is then an increasing family of sigma-algebras, one per date, and 'increasing' encodes the only assumption about memory we ever make, namely that you do not forget. Three coin flips generate a filtration with 2, 4 and 8 atoms: the first flip splits the world in two, the second into four, the third resolves everything.</p><p>A desk cares because every risk report, every hedge and every backtest is an assertion that a particular quantity was computable from information available at the time. Look-ahead bias is a measurability failure, stated in English.</p>",
          "formula": "\\mathcal{F}_1 \\subseteq \\mathcal{F}_2 \\subseteq \\cdots \\subseteq \\mathcal{F}",
          "code": {
            "lang": "python",
            "src": "import itertools\n\nomega = list(itertools.product((-1, 1), repeat=3))       # 8 equally likely paths\n\ndef partition(label):\n    cells = {}\n    for w in omega:\n        cells.setdefault(label(w), []).append(w)\n    return list(cells.values())\n\nF0 = partition(lambda w: 0)          # know nothing\nF1 = partition(lambda w: w[0])       # know the first flip\nF2 = partition(lambda w: w[:2])\nF3 = partition(lambda w: w)          # know everything\n\nfor name, P in ((\"F0\", F0), (\"F1\", F1), (\"F2\", F2), (\"F3\", F3)):\n    print(\"%s: %d atom(s) of size %s\" % (name, len(P), sorted(len(c) for c in P)))\n\ndef measurable(f, P):\n    return all(len({f(w) for w in c}) == 1 for c in P)\n\ntests = {\"X1 (first flip)\": lambda w: w[0],\n         \"S2 = X1+X2    \": lambda w: sum(w[:2]),\n         \"S3 = X1+X2+X3 \": lambda w: sum(w),\n         \"max(S1,S2,S3) \": lambda w: max(sum(w[:k]) for k in (1, 2, 3))}\nprint(\"\")\nprint(\"%-16s  F0     F1     F2     F3\" % \"measurable wrt\")\nfor nm, f in tests.items():\n    flags = [\"%-5s\" % measurable(f, P) for P in (F0, F1, F2, F3)]\n    print(\"%-16s  %s\" % (nm, \"  \".join(flags)))\n",
            "output": "F0: 1 atom(s) of size [8]\nF1: 2 atom(s) of size [4, 4]\nF2: 4 atom(s) of size [2, 2, 2, 2]\nF3: 8 atom(s) of size [1, 1, 1, 1, 1, 1, 1, 1]\n\nmeasurable wrt    F0     F1     F2     F3\nX1 (first flip)   False  True   True   True\nS2 = X1+X2        False  False  True   True\nS3 = X1+X2+X3     False  False  False  True\nmax(S1,S2,S3)     False  False  False  True"
          }
        },
        {
          "name": "Conditional expectation is an average over the atom you are in",
          "explain": "<p>On a finite space, E[X | G] is defined pointwise: at an outcome w, look up the atom of G containing w and average X over it with the conditional probabilities. The result is a <em>random variable</em>, not a number, and it is G-measurable by construction — constant on atoms, which is exactly what 'computable from the information in G' means.</p><p>Two properties then do almost all the work in the rest of the course. The tower property says that averaging over a fine partition and then over a coarse one is the same as averaging over the coarse one directly: E[E[X | F_2] | F_1] = E[X | F_1] whenever F_1 sits inside F_2. The taking-out-what-is-known property says that a G-measurable factor passes through the conditional expectation like a constant. Everything else — martingales, risk-neutral pricing, the Kalman filter — is these two facts applied repeatedly.</p><p>The code checks the tower property on the three-flip space with exact rational arithmetic, so the equality is not 'close', it is an identity. It also shows the fact you will use in week 4 without thinking: for a sum of independent mean-zero steps, E[S_3 | F_1] = S_1, because the future steps average away and the past is known.</p><p>A desk cares because marking a book is a conditional expectation and the tower property is why a two-stage valuation cannot disagree with a one-stage one.</p>",
          "formula": "E\\big[E[X \\mid \\mathcal{F}_2] \\,\\big|\\, \\mathcal{F}_1\\big] = E[X \\mid \\mathcal{F}_1], \\quad \\mathcal{F}_1 \\subseteq \\mathcal{F}_2",
          "code": {
            "lang": "python",
            "src": "import itertools\nfrom fractions import Fraction\n\nomega = list(itertools.product((-1, 1), repeat=3))\nS3 = {w: Fraction(sum(w)) for w in omega}\n\ndef cond_exp(f, k):\n    \"\"\"E[f | F_k] as a dict on omega, F_k = sigma(X_1..X_k). Exact arithmetic.\"\"\"\n    cells = {}\n    for w in omega:\n        cells.setdefault(w[:k], []).append(w)\n    out = {}\n    for w in omega:\n        cell = cells[w[:k]]\n        out[w] = sum(f[u] for u in cell) / len(cell)\n    return out\n\nE0, E1, E2, E3 = (cond_exp(S3, k) for k in (0, 1, 2, 3))\n\nprint(\"E[S3]        =\", E0[omega[0]])\nprint(\"E[S3|F1] values:\", sorted({str(v) for v in E1.values()}))\nprint(\"E[S3|F2] values:\", sorted({str(v) for v in E2.values()}))\nprint(\"E[S3|F3] == S3 :\", all(E3[w] == S3[w] for w in omega))\nprint(\"E[S3|F1] == S1 :\", all(E1[w] == w[0] for w in omega))\n\ntower = cond_exp(E2, 1)\nprint(\"tower E[E[S3|F2]|F1] == E[S3|F1] :\", all(tower[w] == E1[w] for w in omega))\n\n# taking out what is known: X1 is F1-measurable\nX1S3 = {w: Fraction(w[0]) * S3[w] for w in omega}\nlhs = cond_exp(X1S3, 1)\nrhs = {w: Fraction(w[0]) * E1[w] for w in omega}\nprint(\"E[X1*S3|F1] == X1*E[S3|F1]       :\", all(lhs[w] == rhs[w] for w in omega))\n",
            "output": "E[S3]        = 0\nE[S3|F1] values: ['-1', '1']\nE[S3|F2] values: ['-2', '0', '2']\nE[S3|F3] == S3 : True\nE[S3|F1] == S1 : True\ntower E[E[S3|F2]|F1] == E[S3|F1] : True\nE[X1*S3|F1] == X1*E[S3|F1]       : True"
          }
        },
        {
          "name": "Conditional expectation is the orthogonal projection onto what you know",
          "explain": "<p>The definition by atoms is concrete but does not generalise. The characterisation that does is this: E[X | G] is the unique G-measurable random variable Y with E[(X - Y)Z] = 0 for every bounded G-measurable Z. In L2 language, E[X | G] is the orthogonal projection of X onto the subspace of G-measurable square-integrable variables, and the residual X - E[X | G] is orthogonal to everything you know.</p><p>That single sentence buys you three things. It says conditional expectation is the best predictor of X in mean square among all functions of the available information, which is why forecasting and conditioning are the same subject. It says the projection is linear and idempotent, which is the tower property again, now geometric. And it connects the abstraction to something you can compute: when G is generated by a finite partition, regressing X on the indicator functions of the cells reproduces the cell means exactly, so ordinary least squares <em>is</em> conditional expectation restricted to a finite-dimensional subspace.</p><p>The code does that regression on 200,000 simulated points and checks both halves: the coefficients equal the cell means, and the residual is numerically orthogonal to each indicator. A research team cares because this is the honest answer to 'what is a regression estimating?' — a conditional expectation, and only a linear one because the subspace was chosen to be linear.</p>",
          "formula": "E[X \\mid \\mathcal{G}] = \\arg\\min_{Y \\in L^2(\\mathcal{G})} E\\big[(X-Y)^2\\big]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")\n\nrng = np.random.default_rng(20240301)\nn = 200_000\nX = rng.integers(0, 4, size=n)                       # four cells => sigma(X) has four atoms\ncell_mean = np.array([1.0, -0.5, 2.0, 0.25])\nY = cell_mean[X] + rng.normal(0.0, 1.0, n)\n\nD = np.eye(4)[X]                                     # indicator basis of sigma(X)\nbeta, *_ = np.linalg.lstsq(D, Y, rcond=None)\nemp = np.array([Y[X == k].mean() for k in range(4)])\n\nprint(\"true cell means :\", np.round(cell_mean, 4))\nprint(\"OLS coefficients:\", np.round(beta, 4))\nprint(\"sample means    :\", np.round(emp, 4))\nprint(\"OLS == cell means to %.1e\" % np.abs(beta - emp).max())\n\nresid = Y - D @ beta\nprint(\"max |E[resid * 1_A]|      = %.2e   (orthogonality)\" % np.abs(D.T @ resid / n).max())\nprint(\"E[Y] - E[E[Y|X]]          = %.2e   (tower)\" % (Y.mean() - (D @ beta).mean()))\nprint(\"Var(Y) = %.4f, Var(fit) = %.4f, Var(resid) = %.4f, sum = %.4f\"\n      % (Y.var(), (D @ beta).var(), resid.var(), (D @ beta).var() + resid.var()))\n",
            "output": "true cell means : [ 1.   -0.5   2.    0.25]\nOLS coefficients: [ 0.9938 -0.4989  2.001   0.2528]\nsample means    : [ 0.9938 -0.4989  2.001   0.2528]\nOLS == cell means to 8.3e-14\nmax |E[resid * 1_A]|      = 2.09e-14   (orthogonality)\nE[Y] - E[E[Y|X]]          = -2.04e-14   (tower)\nVar(Y) = 1.8524, Var(fit) = 0.8550, Var(resid) = 0.9974, sum = 1.8524"
          }
        },
        {
          "name": "The law of total variance, and what information is worth",
          "explain": "<p>Splitting a variance along a conditioning variable is the most useful immediate consequence of the projection picture. Because the fitted part and the residual are orthogonal, their variances add: Var(Y) = E[Var(Y | X)] + Var(E[Y | X]). The first term is the risk you still carry after learning X — the irreducible part — and the second is the risk X explained away.</p><p>This is the whole content of 'how much is this signal worth', stated before anyone says the word alpha. If X is a forecast, Var(E[Y | X]) / Var(Y) is the fraction of variance it removes, which is the population R-squared; the remaining E[Var(Y | X)] is what no amount of cleverness with that X will ever remove. It is also the decomposition behind risk attribution: total P&L variance splits into a part explained by factor exposures and a residual, and the split is exact, not approximate, because it is Pythagoras.</p><p>The snippet builds a three-regime mixture where both the conditional mean and the conditional variance depend on the regime, then compares the simulated total variance with the two exact components. Notice that the regime with the widest spread contributes through the first term and the regime with the most extreme mean contributes through the second: they are genuinely different kinds of risk, and conflating them is how a book looks diversified until the regime changes.</p>",
          "formula": "\\operatorname{Var}(Y) = E\\big[\\operatorname{Var}(Y \\mid X)\\big] + \\operatorname{Var}\\big(E[Y \\mid X]\\big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nrng = np.random.default_rng(11)\nn = 500_000\nm  = np.array([0.0, 0.8, -1.2])      # conditional means\ns  = np.array([1.0, 0.4,  2.0])      # conditional standard deviations\npr = np.array([0.5, 0.3,  0.2])      # regime probabilities\n\nX = rng.choice(3, size=n, p=pr)\nY = m[X] + s[X] * rng.standard_normal(n)\n\nwithin  = float(np.average(s ** 2, weights=pr))                       # E[Var(Y|X)]\nmbar    = float(np.average(m, weights=pr))\nbetween = float(np.average((m - mbar) ** 2, weights=pr))              # Var(E[Y|X])\n\nprint(\"E[Y]        sample %.4f   exact %.4f\" % (Y.mean(), mbar))\nprint(\"Var(Y)      sample %.4f   exact %.4f\" % (Y.var(), within + between))\nprint(\"E[Var(Y|X)]                exact %.4f   (%.1f%% of total)\"\n      % (within, 100 * within / (within + between)))\nprint(\"Var(E[Y|X])                exact %.4f   (%.1f%% of total)\"\n      % (between, 100 * between / (within + between)))\nprint(\"knowing the regime removes %.1f%% of the variance and nothing more\"\n      % (100 * between / (within + between)))\n",
            "output": "E[Y]        sample 0.0014   exact 0.0000\nVar(Y)      sample 1.8276   exact 1.8280\nE[Var(Y|X)]                exact 1.3480   (73.7% of total)\nVar(E[Y|X])                exact 0.4800   (26.3% of total)\nknowing the regime removes 26.3% of the variance and nothing more"
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "Conditional expectation as the line you project onto",
        "params": {
          "n": 140,
          "beta": 0.9,
          "noise": 1.6,
          "seed": 3301,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Treating E[X | G] as a number. It is a random variable, and almost every confusing step in week 4 comes from having quietly collapsed it to its own expectation.",
        "Assuming E[XY | G] = E[X | G] E[Y | G]. That needs conditional independence, not just independence of X and Y, and it is false in general.",
        "Reading 'X is independent of G' as 'E[X | G] = 0'. It gives E[X | G] = E[X], which is zero only if X was already centred.",
        "Confusing the partition generated by a variable with the variable itself: sigma(X) and sigma(3X + 7) are the same information, so the conditional expectations agree."
      ],
      "check": [
        {
          "q": "On a finite probability space, a random variable Y is measurable with respect to the sigma-algebra G if and only if:",
          "options": [
            "Y is independent of every event in G",
            "Y is constant on every atom of G",
            "Y has finite variance under every measure equivalent to P",
            "Y can be written as a linear function of the indicators of the outcomes"
          ],
          "answer": 1,
          "why": "On a finite space a sigma-algebra is a partition, and measurability means the information in G pins down the value: Y must be constant on each atom. Independence is unrelated and in fact nearly the opposite. Finite variance is automatic on a finite space. The last option describes measurability with respect to the full sigma-algebra, not G."
        },
        {
          "q": "F_1 is contained in F_2. Which statement is always true?",
          "options": [
            "E[E[X | F_1] | F_2] = E[X | F_2]",
            "E[E[X | F_2] | F_1] = E[X | F_1]",
            "Var(E[X | F_1]) >= Var(E[X | F_2])",
            "E[X | F_1] and E[X | F_2] have the same distribution"
          ],
          "answer": 1,
          "why": "The tower property says the coarser conditioning wins: project onto the fine subspace, then onto the coarse one, and you land where projecting straight onto the coarse one would have. The first option is false because E[X | F_1] is already F_2-measurable, so re-conditioning returns it unchanged. More information cannot explain less variance, so the inequality points the wrong way, and the two projections have genuinely different distributions."
        },
        {
          "q": "You regress Y on the indicator variables of a four-cell partition of X, with no intercept. The fitted coefficients equal:",
          "options": [
            "the within-cell variances",
            "the cell means of Y",
            "the cell probabilities",
            "the correlations between Y and each indicator"
          ],
          "answer": 1,
          "why": "Regressing on a complete set of cell indicators projects Y onto the space of functions constant on cells, and that projection is exactly the conditional expectation, whose value on a cell is the cell mean. Variances and probabilities are not what least squares is minimising over here, and a correlation is a scaled quantity that would not reproduce the level of Y."
        },
        {
          "q": "A signal X explains 30% of the variance of a return Y. The law of total variance says the remaining 70% is:",
          "options": [
            "E[Var(Y | X)], the variance no function of X can remove",
            "Var(E[Y | X]), the variance the signal creates",
            "measurement error in X",
            "the variance of X itself"
          ],
          "answer": 0,
          "why": "The decomposition splits Var(Y) into Var(E[Y|X]), which is what the best possible function of X explains, and E[Var(Y|X)], the average leftover risk inside each value of X. Since the explained piece is 30%, the residual piece is 70% and it is a hard floor for any predictor built from X alone. It is not measurement error, and Var(X) does not enter the identity at all."
        }
      ]
    },
    {
      "n": 2,
      "title": "Simple random walk: scaling, reflection and ruin",
      "topics": [
        "increments and the binomial law",
        "the central limit scaling",
        "reflection principle",
        "gambler's ruin",
        "harmonic functions",
        "recurrence and transience"
      ],
      "concepts": [
        {
          "name": "The walk, its exact law, and the Gaussian that approximates it",
          "explain": "<p>Simple random walk is the sum of independent steps that are plus or minus one with probability one half. Everything about it at a fixed time is combinatorics: S_n = 2B - n where B is Binomial(n, 1/2), so P(S_n = k) is a binomial coefficient over 2^n and the distribution lives on the lattice of integers with the parity of n. The mean is zero and the variance is n, which is the single most important scaling fact in the course: displacement grows like the square root of time, not like time.</p><p>The central limit theorem says the standardised walk converges to a standard normal, and the code measures how fast. The Berry-Esseen bound promises the maximum gap between the exact and normal cumulative distribution functions falls like C over the square root of n, and with a continuity correction you see exactly that: the error drops by roughly a factor of two each time n quadruples. What you should take away is not that the normal approximation is good, but that its error has a rate, and that rate is slow.</p><p>A desk cares because the square-root-of-time rule is how volatility is quoted, scaled and compared across horizons, and because the slow convergence of the CLT is why one-day-to-ten-day VaR scaling is defensible and one-day-to-one-year scaling is not.</p>",
          "formula": "P(S_n = k) = \\binom{n}{\\tfrac{n+k}{2}} 2^{-n}, \\qquad \\frac{S_n}{\\sqrt{n}} \\Rightarrow N(0,1)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom scipy.stats import binom, norm\n\nprint(\" n      max |F_exact - F_normal|   sqrt(n) * error   P(S_n = 0)\")\nfor n in (10, 40, 160, 640, 2560):\n    k = np.arange(n + 1)\n    s = 2 * k - n                                   # the values S_n can take\n    cdf_exact = binom.cdf(k, n, 0.5)\n    cdf_norm = norm.cdf((s + 1.0) / np.sqrt(n))     # +1 = continuity correction\n    err = float(np.abs(cdf_exact - cdf_norm).max())\n    p0 = binom.pmf(n // 2, n, 0.5) if n % 2 == 0 else 0.0\n    print(\"%5d   %22.6f   %15.4f   %10.6f\" % (n, err, err * np.sqrt(n), p0))\n\nprint(\"\")\nprint(\"mean and variance are exact, not approximate:\")\nfor n in (10, 160, 2560):\n    k = np.arange(n + 1); s = 2 * k - n; p = binom.pmf(k, n, 0.5)\n    print(\"  n=%5d   E[S_n] = %+.1e   Var(S_n) = %8.2f   (n = %d)\"\n          % (n, float((s * p).sum()), float((s * s * p).sum()), n))\n",
            "output": " n      max |F_exact - F_normal|   sqrt(n) * error   P(S_n = 0)\n   10                 0.002686            0.0085     0.246094\n   40                 0.000678            0.0043     0.125371\n  160                 0.000170            0.0021     0.062980\n  640                 0.000042            0.0011     0.031527\n 2560                 0.000011            0.0005     0.015768\n\nmean and variance are exact, not approximate:\n  n=   10   E[S_n] = +1.2e-16   Var(S_n) =    10.00   (n = 10)\n  n=  160   E[S_n] = +0.0e+00   Var(S_n) =   160.00   (n = 160)\n  n= 2560   E[S_n] = -7.1e-15   Var(S_n) =  2560.00   (n = 2560)"
          }
        },
        {
          "name": "The reflection principle and the running maximum",
          "explain": "<p>Fixed-time questions about a random walk are binomial coefficients. Questions about the whole path — did it ever reach a level, when did it first do so — need one extra idea, and the reflection principle is that idea. Take any path that reaches level a at some time and ends above a, and reflect the portion after the first hitting time about the line y = a. You get a path that ends below a, and the map is a bijection between the two sets. Because all paths of length n are equally likely, the counts are equal and so are the probabilities.</p><p>Rearranged, that gives P(max_{k<=n} S_k >= a) = 2 P(S_n > a) + P(S_n = a): a question about a supremum over the whole path answered by a single marginal. The same argument gives the first-passage law and, in the scaling limit of week 5, the distribution of the maximum of Brownian motion. It is the reason barrier options have closed forms at all.</p><p>The code verifies the identity by brute force over all 1024 paths of length ten, so there is no simulation error to hide behind: the two sides agree to machine precision. It also prints the first-passage decomposition. A structuring desk cares because every knock-in, knock-out and stop-loss is a statement about a running extremum, and the difference between monitoring continuously and monitoring daily is precisely the difference between this identity and its discretely sampled cousin.</p>",
          "formula": "P\\Big(\\max_{k \\le n} S_k \\ge a\\Big) = 2\\,P(S_n > a) + P(S_n = a)",
          "code": {
            "lang": "python",
            "src": "import itertools\nimport numpy as np\n\nn = 10\npaths = np.array(list(itertools.product((-1, 1), repeat=n)))\nS = np.cumsum(paths, axis=1)\nP = 1.0 / len(paths)\nprint(\"enumerated %d paths of length %d exactly\" % (len(paths), n))\nprint(\"\")\nprint(\"  a    P(max >= a)    2P(S_n>a)+P(S_n=a)      gap\")\nfor a in (1, 2, 3, 4, 5):\n    lhs = P * (S.max(axis=1) >= a).sum()\n    rhs = P * (2 * (S[:, -1] > a).sum() + (S[:, -1] == a).sum())\n    print(\"%3d   %12.6f   %20.6f   %8.1e\" % (a, lhs, rhs, abs(lhs - rhs)))\n\nprint(\"\")\na = 3\nfirst = np.array([np.argmax(row >= a) if (row >= a).any() else -1 for row in S])\nprint(\"first passage to a = %d, conditional on ever getting there:\" % a)\nfor t in range(a, n + 1):\n    q = P * (first == t - 1).sum()\n    if q > 0:\n        print(\"  P(tau = %2d) = %.6f\" % (t, q))\nprint(\"  P(tau <= %d) = %.6f\" % (n, P * (first >= 0).sum()))\n",
            "output": "enumerated 1024 paths of length 10 exactly\n\n  a    P(max >= a)    2P(S_n>a)+P(S_n=a)      gap\n  1       0.753906               0.753906    0.0e+00\n  2       0.548828               0.548828    0.0e+00\n  3       0.343750               0.343750    0.0e+00\n  4       0.226562               0.226562    0.0e+00\n  5       0.109375               0.109375    0.0e+00\n\nfirst passage to a = 3, conditional on ever getting there:\n  P(tau =  3) = 0.125000\n  P(tau =  5) = 0.093750\n  P(tau =  7) = 0.070312\n  P(tau =  9) = 0.054688\n  P(tau <= 10) = 0.343750"
          }
        },
        {
          "name": "Gambler's ruin: a difference equation with a probabilistic meaning",
          "explain": "<p>Start at a, walk until you hit 0 or N. Let h(a) be the probability of hitting 0 first. Conditioning on the first step gives h(a) = p h(a+1) + (1-p) h(a-1) with h(0) = 1 and h(N) = 0. That is a second-order linear difference equation, and its solutions are the discrete harmonic functions of the walk: h is harmonic exactly when h(S_n) is a martingale, which is the link to week 4.</p><p>For a fair walk the solution is linear, h(a) = 1 - a/N, so your chance of doubling a stake before losing it is proportional to how much you started with. For a biased walk the solution is geometric in r = (1-p)/p, and the dependence on the edge is brutally nonlinear: at p = 0.48 with a = 5 and N = 10 you are already nearly two to one against, even though the per-bet edge is only two percent. That asymmetry is the mathematical content of the phrase 'risk of ruin' and the reason position sizing exists as a discipline.</p><p>The code solves the recursion in closed form and checks it against a vectorised simulation of twenty thousand independent gamblers per case. A trading desk cares because the same equation governs the probability that a strategy hits a drawdown limit before it reaches its target, and because it shows that a small negative edge plus enough repetitions is indistinguishable from certainty.</p>",
          "formula": "h(a) = \\frac{r^{a} - r^{N}}{1 - r^{N}}, \\quad r = \\frac{1-p}{p}; \\qquad h(a) = 1 - \\frac{a}{N} \\text{ if } p = \\tfrac12",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\ndef ruin_exact(a, N, p):\n    if abs(p - 0.5) < 1e-12:\n        return 1.0 - a / N\n    r = (1 - p) / p\n    return (r ** a - r ** N) / (1 - r ** N)\n\ndef ruin_sim(a, N, p, trials, rng, maxsteps=4000):\n    x = np.full(trials, a, dtype=np.int64)\n    alive = np.ones(trials, dtype=bool)\n    for _ in range(maxsteps):\n        m = int(alive.sum())\n        if m == 0:\n            break\n        x[alive] += np.where(rng.random(m) < p, 1, -1)\n        alive = (x > 0) & (x < N)\n    return float((x == 0).mean()), int(alive.sum())\n\nrng = np.random.default_rng(5)\nprint(\"  a   N     p     exact ruin   simulated   still running\")\nfor (a, N, p) in ((5, 10, 0.50), (5, 10, 0.48), (5, 10, 0.45), (2, 20, 0.55), (10, 20, 0.52)):\n    sim, left = ruin_sim(a, N, p, 20_000, rng)\n    print(\"%3d %3d  %.2f   %10.4f   %9.4f   %12d\" % (a, N, p, ruin_exact(a, N, p), sim, left))\n\nprint(\"\")\nprint(\"a 2%% edge against you, fair-looking bets, 5 up and 5 down:\")\nprint(\"  p = 0.50 -> ruin %.3f ;  p = 0.48 -> ruin %.3f ;  p = 0.45 -> ruin %.3f\"\n      % (ruin_exact(5, 10, 0.50), ruin_exact(5, 10, 0.48), ruin_exact(5, 10, 0.45)))\n",
            "output": "  a   N     p     exact ruin   simulated   still running\n  5  10  0.50       0.5000      0.5004              0\n  5  10  0.48       0.5987      0.6020              0\n  5  10  0.45       0.7317      0.7294              0\n  2  20  0.55       0.6633      0.6596              0\n 10  20  0.52       0.3099      0.3133              0\n\na 2%% edge against you, fair-looking bets, 5 up and 5 down:\n  p = 0.50 -> ruin 0.500 ;  p = 0.48 -> ruin 0.599 ;  p = 0.45 -> ruin 0.732"
          }
        },
        {
          "name": "Recurrence in one dimension, transience in three",
          "explain": "<p>Does the walk come back? In one dimension the probability of being at the origin after 2m steps is the central binomial coefficient over 4^m, which Stirling's formula pins at about 1 over the square root of pi m. The sum of those probabilities is the expected number of visits to the origin, and since the terms decay like m^(-1/2) the sum diverges: the expected number of visits is infinite, so the walk returns with probability one and returns infinitely often. It is recurrent, but only just — the expected time to return is infinite.</p><p>In three dimensions the same probability decays like m^(-3/2), the sum converges, and the walk escapes to infinity with positive probability. Polya's theorem in one line: a drunk finds his way home, a drunk bird may not. The boundary case is dimension two, where the decay is m^(-1) and the sum barely diverges.</p><p>The code computes the exact one-dimensional return probabilities with SciPy, checks the Stirling asymptotic, shows the partial sums tracking 2 sqrt(N/pi), and then simulates three-dimensional walks to see the return frequency stall well below one. A research team cares because 'recurrent but with infinite expected return time' is the honest description of a mean-reverting spread with no clock on it: it will come back, and you cannot budget for when.</p>",
          "formula": "u_{2m} = \\binom{2m}{m} 2^{-2m} \\sim \\frac{1}{\\sqrt{\\pi m}}, \\qquad \\sum_m u_{2m} = \\infty \\text{ in } d=1",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom scipy.stats import binom\n\nm = np.arange(1, 100_001)\nu = binom.pmf(m, 2 * m, 0.5)                       # P(S_2m = 0) in one dimension\nprint(\"Stirling check: u_2m * sqrt(pi m) at m = 10, 1000, 100000: %.5f  %.5f  %.5f\"\n      % (u[9] * np.sqrt(np.pi * 10), u[999] * np.sqrt(np.pi * 1000),\n         u[-1] * np.sqrt(np.pi * m[-1])))\nprint(\"\")\nprint(\"      M      sum_{m<=M} u_2m     2 sqrt(M/pi)\")\nfor M in (10, 100, 1000, 10_000, 100_000):\n    print(\"%7d   %17.3f   %14.3f\" % (M, u[:M].sum(), 2 * np.sqrt(M / np.pi)))\n\nprint(\"\")\nrng = np.random.default_rng(3)\ntrials, steps = 4000, 8000\npos = np.zeros((trials, 3), dtype=np.int64)\nret = np.zeros(trials, dtype=bool)\nidx = np.arange(trials)\nfor _ in range(steps):\n    axis = rng.integers(0, 3, trials)\n    pos[idx, axis] += rng.integers(0, 2, trials) * 2 - 1\n    ret |= (pos == 0).all(axis=1)\nprint(\"3-d walk: returned to the origin within %d steps in %.3f of %d trials\"\n      % (steps, ret.mean(), trials))\nprint(\"Polya's constant (true return probability in d=3) is about 0.3405\")\n",
            "output": "Stirling check: u_2m * sqrt(pi m) at m = 10, 1000, 100000: 0.98758  0.99988  1.00000\n\n      M      sum_{m<=M} u_2m     2 sqrt(M/pi)\n     10               2.700            3.568\n    100              10.326           11.284\n   1000              34.696           35.682\n  10000             111.842          112.838\n 100000             355.826          356.825\n\n3-d walk: returned to the origin within 8000 steps in 0.343 of 4000 trials\nPolya's constant (true return probability in d=3) is about 0.3405"
          }
        }
      ],
      "widget": [
        {
          "type": "histogram",
          "title": "The walk at a fixed time is asymptotically Gaussian",
          "params": {
            "sampler": "normal",
            "params": {
              "mu": 0,
              "sigma": 1
            },
            "bins": 41,
            "overlay": true,
            "n": 6000,
            "seed": 2207
          }
        },
        {
          "type": "slider-formula",
          "title": "Ruin probability as the edge and the bankroll move",
          "params": {
            "formula": "h(a) = \\frac{r^{a}-r^{N}}{1-r^{N}}, \\quad r=\\frac{1-p}{p}",
            "inputs": [
              {
                "name": "p",
                "label": "P(up step)",
                "min": 0.35,
                "max": 0.65,
                "step": 0.005,
                "init": 0.49
              },
              {
                "name": "a",
                "label": "Starting bankroll",
                "min": 1,
                "max": 40,
                "step": 1,
                "init": 5
              },
              {
                "name": "N",
                "label": "Target (absorbing)",
                "min": 2,
                "max": 80,
                "step": 1,
                "init": 10
              }
            ],
            "compute": [
              {
                "name": "r",
                "label": "r = (1-p)/p",
                "expr": "(1-p)/p",
                "fmt": "5"
              },
              {
                "name": "ruin",
                "label": "P(ruin)",
                "expr": "(pow(r,a)-pow(r,N))/(1-pow(r,N))",
                "fmt": "5"
              },
              {
                "name": "fair",
                "label": "P(ruin) if p = 0.5",
                "expr": "1 - a/N",
                "fmt": "5"
              }
            ]
          }
        }
      ],
      "pitfalls": [
        "Using the normal approximation for a tail probability at small n. The CLT controls the centre; at three or four standard deviations the relative error is still large when n is a few dozen.",
        "Forgetting parity. P(S_n = k) is zero unless k and n have the same parity, and a simulation that reports a smooth density has been binned badly.",
        "Reading recurrence as 'it comes back soon'. In one dimension the return time has infinite expectation, so recurrence guarantees nothing about horizon.",
        "Applying the reflection identity to a discretely monitored barrier and expecting the continuous-time answer. Discrete monitoring always gives a smaller hitting probability."
      ],
      "check": [
        {
          "q": "For simple random walk, P(max over the first 10 steps >= 3) compared with P(S_10 >= 3) is:",
          "options": [
            "smaller",
            "the same",
            "roughly twice as large",
            "exactly ten times as large"
          ],
          "answer": 2,
          "why": "The reflection principle gives P(max >= a) = 2P(S_n > a) + P(S_n = a), which is about double the terminal tail because every path ending below the level that touched it is matched by a reflected partner ending above. It cannot be smaller, since ending above a requires having reached a. Equality would say the path never comes back down, and the factor of ten is arbitrary."
        },
        {
          "q": "A gambler starts with 5 units, quits at 10, and each bet wins with probability 0.48. The ruin probability is closest to:",
          "options": [
            "0.50",
            "0.52",
            "0.60",
            "0.98"
          ],
          "answer": 2,
          "why": "With r = 0.52/0.48 the geometric formula gives about 0.60, so a two-percent per-bet disadvantage turns an even-money race into three-to-two against. The value 0.50 is the fair-game answer and 0.52 mistakes the ruin probability for r itself. 0.98 would need either a far larger edge against the gambler or a far longer race than five units in each direction."
        },
        {
          "q": "The sum over m of P(S_2m = 0) for one-dimensional simple random walk:",
          "options": [
            "converges, so the walk is transient",
            "diverges, so the walk is recurrent",
            "equals 1 by normalisation",
            "is finite but has no closed form"
          ],
          "answer": 1,
          "why": "That sum is the expected number of visits to the origin. The terms behave like 1/sqrt(pi m), a divergent series, so the expected number of visits is infinite and the walk must return with probability one, hence infinitely often. A convergent sum is what happens in three dimensions and is the signature of transience. The sum is not a probability, so it has no reason to equal one."
        },
        {
          "q": "You quadruple n and the maximum error of the normal approximation to the walk's CDF roughly:",
          "options": [
            "quarters",
            "halves",
            "is unchanged",
            "doubles"
          ],
          "answer": 1,
          "why": "Berry-Esseen bounds the Kolmogorov distance by a constant over the square root of n, and for the symmetric walk that rate is attained. Quadrupling n divides the square root of n by two, so the error halves. Quartering would require an order-1/n rate, which no central limit theorem gives for a lattice variable, and the error certainly does not stay put or grow."
        }
      ]
    },
    {
      "n": 3,
      "title": "Markov chains: transition matrices, stationarity and absorption",
      "topics": [
        "the Markov property",
        "Chapman-Kolmogorov",
        "communicating classes and period",
        "stationary distribution",
        "rate of convergence",
        "first-step analysis",
        "fundamental matrix"
      ],
      "concepts": [
        {
          "name": "The Markov property is a statement about conditional expectation",
          "explain": "<p>A process is Markov if, given the present, the past adds nothing: E[f(X_{n+1}) | F_n] = E[f(X_{n+1}) | X_n]. On a finite state space that collapses to a matrix P whose (i,j) entry is the probability of moving from i to j in one step. Rows are probability vectors, so P is stochastic, and the n-step transition probabilities are literally the matrix power P^n. That is the Chapman-Kolmogorov identity: P^(m+n) = P^m P^n is nothing more than 'condition on where you were at time m and sum'.</p><p>Two conventions matter and are worth fixing now. Distributions are row vectors and they act on the right: if mu is the law at time 0, mu P^n is the law at time n. Functions are column vectors and P acts on the left: (P f)(i) = E[f(X_1) | X_0 = i]. Keeping those straight is the difference between a stationary distribution and a harmonic function, and getting them backwards is the most common first bug.</p><p>The snippet builds a three-state chain with one absorbing state, computes the five-step law two ways — matrix power and a 200,000-path simulation — and confirms the Chapman-Kolmogorov factorisation. A credit desk cares because the entire ratings-migration apparatus, and with it a large part of regulatory capital, is this matrix and this power.</p>",
          "formula": "P^{(n)}_{ij} = (P^n)_{ij}, \\qquad P^{(m+n)} = P^{(m)}P^{(n)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nP = np.array([[0.90, 0.08, 0.02],\n              [0.15, 0.75, 0.10],\n              [0.00, 0.00, 1.00]])\nassert np.allclose(P.sum(axis=1), 1.0)\n\nn = 5\nPn = np.linalg.matrix_power(P, n)\nprint(\"P^5, row 0:\", np.round(Pn[0], 6))\nprint(\"P^5, row 1:\", np.round(Pn[1], 6))\nprint(\"P^2 @ P^3 == P^5 :\", bool(np.allclose(P @ P @ P @ P @ P, Pn)))\n\nrng = np.random.default_rng(31)\ntrials = 200_000\ncum = np.cumsum(P, axis=1)\nstate = np.zeros(trials, dtype=int)\nfor _ in range(n):\n    u = rng.random(trials)\n    state = (u[:, None] > cum[state]).sum(axis=1)\nemp = np.bincount(state, minlength=3) / trials\nprint(\"simulated from state 0 :\", np.round(emp, 6))\nprint(\"max |simulated - P^5[0]| = %.4f  (MC se ~ %.4f)\"\n      % (np.abs(emp - Pn[0]).max(), np.sqrt(0.25 / trials)))\n",
            "output": "P^5, row 0: [0.665169 0.194922 0.139909]\nP^5, row 1: [0.365478 0.299691 0.334831]\nP^2 @ P^3 == P^5 : True\nsimulated from state 0 : [0.66402  0.195395 0.140585]\nmax |simulated - P^5[0]| = 0.0011  (MC se ~ 0.0011)"
          }
        },
        {
          "name": "Classes, periodicity and what 'eventually' means",
          "explain": "<p>Before asking where a chain settles you have to ask whether the question is well posed. State j is reachable from i if some power of P has a positive (i,j) entry; i and j communicate if each is reachable from the other. Communication is an equivalence relation, so the state space splits into classes, and a class is recurrent if the chain cannot leave it and transient if it can. A chain is irreducible when there is exactly one class.</p><p>Period is the second obstruction. The period of a state is the greatest common divisor of the times at which return has positive probability; if that gcd exceeds one the chain cycles and P^n never converges, even though time averages still do. A deterministic three-cycle has period three and a perfectly good stationary distribution that it never approaches. Aperiodicity is what you need for the limit, and a single self-loop anywhere in an irreducible chain is enough to buy it.</p><p>The code builds a chain with a period-three cycle plus one transient state that feeds into it, extracts reachability by boolean matrix powers, recovers the classes, computes the period from the set of possible return times, and confirms the transient state is abandoned. A quant cares because a model whose chain is reducible has a hidden absorbing regime, and a calibration that averages over a periodic chain reports a distribution the process is never actually in.</p>",
          "formula": "d(i) = \\gcd\\{ n \\ge 1 : P^{n}_{ii} > 0 \\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom math import gcd\n\nP = np.array([[0.0, 1.0, 0.0, 0.0],\n              [0.0, 0.0, 1.0, 0.0],\n              [1.0, 0.0, 0.0, 0.0],\n              [0.5, 0.0, 0.0, 0.5]])\nn = P.shape[0]\n\nadj = (P > 0).astype(int)\nreach = np.zeros((n, n), dtype=int)\nM = np.eye(n, dtype=int)\nfor _ in range(2 * n):\n    M = ((M @ adj) > 0).astype(int)\n    reach |= M\nprint(\"reachability matrix (i -> j in one or more steps):\")\nprint(reach)\n\ncomm = reach & reach.T\nclasses = sorted({tuple(np.flatnonzero(comm[i])) for i in range(n)})\nprint(\"communicating classes:\", classes)\n\nfor i in range(n):\n    times = [k for k in range(1, 3 * n + 1)\n             if np.linalg.matrix_power(P, k)[i, i] > 1e-12]\n    d = 0\n    for t in times:\n        d = gcd(d, t)\n    print(\"state %d: return times %s -> period %d\" % (i, times[:5], d))\n\nP200 = np.linalg.matrix_power(P, 200)\nprint(\"P^200[3,3] = %.3e  -> state 3 is transient\" % P200[3, 3])\nprint(\"P^200[0,0] = %.3f, P^201[0,0] = %.3f  -> no limit, the cycle never dies\"\n      % (P200[0, 0], np.linalg.matrix_power(P, 201)[0, 0]))\n",
            "output": "reachability matrix (i -> j in one or more steps):\n[[1 1 1 0]\n [1 1 1 0]\n [1 1 1 0]\n [1 1 1 1]]\ncommunicating classes: [(np.int64(0), np.int64(1), np.int64(2)), (np.int64(3),)]\nstate 0: return times [3, 6, 9, 12] -> period 3\nstate 1: return times [3, 6, 9, 12] -> period 3\nstate 2: return times [3, 6, 9, 12] -> period 3\nstate 3: return times [1, 2, 3, 4, 5] -> period 1\nP^200[3,3] = 6.223e-61  -> state 3 is transient\nP^200[0,0] = 0.000, P^201[0,0] = 1.000  -> no limit, the cycle never dies"
          }
        },
        {
          "name": "Stationary distribution and the speed of forgetting",
          "explain": "<p>A stationary distribution is a row vector pi with pi P = pi and non-negative entries summing to one: it is a left eigenvector of P for eigenvalue one, which always exists because P is stochastic. For an irreducible aperiodic chain it is unique and the law at time n converges to it from any start. The interesting question is how fast.</p><p>The answer is spectral. Write the eigenvalues of P in decreasing modulus; the first is one and, under irreducibility and aperiodicity, all the others are strictly inside the unit disc. The total variation distance from stationarity then decays like the modulus of the second eigenvalue raised to the n-th power. The gap between one and that modulus is the spectral gap, and its reciprocal is the relaxation time — the natural clock of the chain, the analogue of a mean-reversion half-life.</p><p>The code solves for pi as an eigenvector, verifies pi P = pi, and prints the total variation distance alongside the predicted geometric rate; the two track each other over four orders of magnitude. A systematic desk cares because the relaxation time of a regime-switching model tells you the horizon over which the regime label is still informative, and therefore how long a regime-conditional signal can be held before it is just noise with extra steps.</p>",
          "formula": "\\pi P = \\pi, \\qquad \\| \\mu P^{n} - \\pi \\|_{TV} \\le C\\,|\\lambda_2|^{\\,n}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nP = np.array([[0.85, 0.10, 0.05],\n              [0.20, 0.70, 0.10],\n              [0.05, 0.25, 0.70]])\nvals, vecs = np.linalg.eig(P.T)\ni1 = int(np.argmin(np.abs(vals - 1.0)))\npi = np.real(vecs[:, i1]); pi = pi / pi.sum()\nprint(\"stationary pi        :\", np.round(pi, 6))\nprint(\"pi P == pi           :\", bool(np.allclose(pi @ P, pi)))\nmods = np.sort(np.abs(vals))[::-1]\nlam2 = float(mods[1])\nprint(\"eigenvalue moduli    :\", np.round(mods, 6))\nprint(\"spectral gap 1-|l2|  : %.6f   relaxation time %.3f steps\" % (1 - lam2, 1 / (1 - lam2)))\nprint(\"\")\nmu = np.array([1.0, 0.0, 0.0])\nprint(\"  n        TV distance      |lambda_2|^n      ratio\")\nfor k in (1, 2, 5, 10, 20, 40, 80):\n    tv = 0.5 * np.abs(mu @ np.linalg.matrix_power(P, k) - pi).sum()\n    print(\"%4d   %14.3e   %14.3e   %8.4f\" % (k, tv, lam2 ** k, tv / lam2 ** k))\n",
            "output": "stationary pi        : [0.490566 0.320755 0.188679]\npi P == pi           : True\neigenvalue moduli    : [1.       0.715139 0.534861]\nspectral gap 1-|l2|  : 0.284861   relaxation time 3.510 steps\n\n  n        TV distance      |lambda_2|^n      ratio\n   1        3.594e-01        7.151e-01     0.5026\n   2        2.544e-01        5.114e-01     0.4975\n   5        9.141e-02        1.870e-01     0.4887\n  10        1.693e-02        3.499e-02     0.4838\n  20        5.905e-04        1.224e-03     0.4824\n  40        7.227e-07        1.498e-06     0.4824\n  80        1.083e-12        2.245e-12     0.4825"
          }
        },
        {
          "name": "First-step analysis: absorption probabilities and expected hitting times",
          "explain": "<p>Almost every practical chain question is 'where does it end up, and how long does it take'. Both are answered by conditioning on the first step, which turns a path question into a linear system. Split the states into transient and absorbing, write P in block form with Q the transient-to-transient block and R the transient-to-absorbing block. Then N = (I - Q)^{-1} is the fundamental matrix: its (i,j) entry is the expected number of visits to transient state j starting from i, its row sums are the expected times to absorption, and B = N R holds the absorption probabilities.</p><p>The geometric series interpretation is worth internalising: (I - Q)^{-1} = I + Q + Q^2 + ..., and the k-th term counts visits at time k. The inverse exists precisely because Q has spectral radius below one, which is the algebraic way of saying the chain really does leave the transient set.</p><p>The snippet applies this to a small ratings chain with default and maturity as the two absorbing states, computes default probabilities and expected survival times in closed form, then confirms both with 100,000 simulated issuers. A credit desk cares because that B matrix is a term structure of default probabilities computed without a single simulation, and because the row sums of N are the expected lives that discounting needs. The same machinery prices a knock-out on a lattice and computes expected time to fill in a queue model.</p>",
          "formula": "N = (I-Q)^{-1}, \\qquad B = N R, \\qquad E_i[\\tau] = \\sum_j N_{ij}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nnames = [\"D\", \"B\", \"BB\", \"BBB\", \"M\"]                 # D = default, M = matured\nP = np.array([[1.00, 0.00, 0.00, 0.00, 0.00],\n              [0.08, 0.72, 0.15, 0.00, 0.05],\n              [0.01, 0.10, 0.74, 0.10, 0.05],\n              [0.00, 0.02, 0.10, 0.83, 0.05],\n              [0.00, 0.00, 0.00, 0.00, 1.00]])\nassert np.allclose(P.sum(axis=1), 1.0)\n\nT = [1, 2, 3]                                        # transient states\nQ = P[np.ix_(T, T)]\nR = P[np.ix_(T, [0, 4])]\nN = np.linalg.inv(np.eye(len(T)) - Q)\nB = N @ R\nprint(\"fundamental matrix N (expected visits):\")\nprint(np.round(N, 4))\nprint(\"\")\nprint(\"start   P(default)   P(matured)   E[steps to absorption]\")\nfor k, t in enumerate(T):\n    print(\"%5s   %10.4f   %10.4f   %20.3f\" % (names[t], B[k, 0], B[k, 1], N[k].sum()))\n\nrng = np.random.default_rng(99)\ntrials = 100_000\ncum = np.cumsum(P, axis=1)\ns = np.full(trials, 2)                               # start at BB\nsteps = np.zeros(trials)\nalive = np.ones(trials, dtype=bool)\nfor _ in range(2000):\n    m = int(alive.sum())\n    if m == 0:\n        break\n    u = rng.random(m)\n    s[alive] = (u[:, None] > cum[s[alive]]).sum(axis=1)\n    steps[alive] += 1\n    alive = (s != 0) & (s != 4)\nprint(\"\")\nprint(\"simulated from BB: P(default) = %.4f, E[steps] = %.3f  (closed form %.4f, %.3f)\"\n      % ((s == 0).mean(), steps.mean(), B[1, 0], N[1].sum()))\n",
            "output": "fundamental matrix N (expected visits):\n[[5.0847 3.7913 2.2302]\n [2.8249 7.077  4.1629]\n [2.2599 4.609  8.5935]]\n\nstart   P(default)   P(matured)   E[steps to absorption]\n    B       0.4447       0.5553                 11.106\n   BB       0.2968       0.7032                 14.065\n  BBB       0.2269       0.7731                 15.462\n\nsimulated from BB: P(default) = 0.2964, E[steps] = 14.029  (closed form 0.2968, 14.065)"
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "A ratings transition matrix, read as a picture",
        "params": {
          "cmap": "seq",
          "xlabels": [
            "D",
            "B",
            "BB",
            "BBB",
            "M"
          ],
          "ylabels": [
            "D",
            "B",
            "BB",
            "BBB",
            "M"
          ],
          "matrix": [
            [
              1.0,
              0.0,
              0.0,
              0.0,
              0.0
            ],
            [
              0.08,
              0.72,
              0.15,
              0.0,
              0.05
            ],
            [
              0.01,
              0.1,
              0.74,
              0.1,
              0.05
            ],
            [
              0.0,
              0.02,
              0.1,
              0.83,
              0.05
            ],
            [
              0.0,
              0.0,
              0.0,
              0.0,
              1.0
            ]
          ]
        }
      },
      "pitfalls": [
        "Mixing up row and column conventions. Distributions multiply P on the right, functions on the left; swap them and you will compute a harmonic function and call it a stationary law.",
        "Solving pi P = pi without imposing that the entries sum to one. The eigenvector is only determined up to scale, and numpy will hand you one of unit Euclidean norm.",
        "Assuming P^n converges because a stationary distribution exists. Periodicity kills the limit while leaving stationarity intact.",
        "Inverting I - Q when Q includes an absorbing state by mistake. The matrix is then singular, and a library may return a pseudo-inverse rather than an error."
      ],
      "check": [
        {
          "q": "An irreducible chain on four states has eigenvalues 1, -1, 0.3 and -0.2. Which is true?",
          "options": [
            "It converges to its stationary distribution geometrically at rate 0.3",
            "It has period 2, so the n-step law does not converge",
            "It has no stationary distribution",
            "It is transient"
          ],
          "answer": 1,
          "why": "An eigenvalue of modulus one other than the Perron root is the spectral signature of periodicity, and -1 means period two: the chain alternates between two halves of the state space forever. A stationary distribution still exists and is unique, and time averages still converge, but the n-step law oscillates. A finite irreducible chain is always recurrent, so transience is impossible."
        },
        {
          "q": "For an absorbing chain, the row sums of N = (I - Q)^{-1} give:",
          "options": [
            "the absorption probabilities",
            "the stationary distribution",
            "the expected number of steps before absorption",
            "the eigenvalues of Q"
          ],
          "answer": 2,
          "why": "Entry N[i][j] counts expected visits to transient state j starting from i, so summing across j counts expected visits to the transient set as a whole, which is exactly the expected time to absorption. The absorption probabilities are N R, which needs the R block as well. A chain with absorbing states has its stationary mass on the absorbing states, and the eigenvalues of Q are a different object entirely."
        },
        {
          "q": "You double the spectral gap of a Markov chain. The number of steps needed to get within a fixed total variation distance of stationarity roughly:",
          "options": [
            "doubles",
            "halves",
            "is unchanged",
            "quadruples"
          ],
          "answer": 1,
          "why": "Distance decays like |lambda_2|^n, so the mixing time scales like 1/log(1/|lambda_2|), which for a small gap is approximately the reciprocal of the gap. Doubling the gap therefore halves the number of steps. The relationship is inverse, not direct, so doubling or quadrupling is the wrong direction, and the mixing time certainly does depend on the gap."
        },
        {
          "q": "A ratings chain says a BB issuer defaults with probability 0.01 per period. Over ten periods the default probability is:",
          "options": [
            "exactly 0.10",
            "exactly 1 - 0.99^10",
            "read off the (BB, D) entry of P^10, which accounts for migration first",
            "undefined without a recovery assumption"
          ],
          "answer": 2,
          "why": "The issuer does not stay BB. It migrates up and down, and its hazard changes with each move, so the ten-period default probability is the (BB, D) entry of the tenth matrix power, not a product of identical one-period survivals. Both 0.10 and 1 - 0.99^10 assume a frozen rating, which is exactly the effect a transition matrix exists to capture. Recovery affects loss given default, not the probability."
        }
      ]
    },
    {
      "n": 4,
      "title": "Martingales in discrete time",
      "topics": [
        "martingales, sub- and supermartingales",
        "stopping times",
        "optional stopping",
        "the martingale transform",
        "Doob decomposition",
        "martingale convergence"
      ],
      "concepts": [
        {
          "name": "A martingale is a fair game, written as a conditional expectation",
          "explain": "<p>Given a filtration, an adapted integrable process M is a martingale if E[M_{n+1} | F_n] = M_n: the best forecast of tomorrow, given everything known today, is today's value. Replace the equality by a greater-than and you have a submartingale, a less-than and a supermartingale. The names are unfortunate — a supermartingale goes down on average — but the definitions are the whole of the theory's input.</p><p>Three examples carry most of the course. Simple random walk itself is a martingale. So is S_n^2 - n, which is the discrete ancestor of the statement that Brownian motion has quadratic variation t and the reason the Ito correction exists at all. And for a biased walk the exponential, or Wald, martingale exp(lambda S_n) / (cosh lambda)^n corrects the drift by an exponential factor — the discrete-time Girsanov density, visible three courses early.</p><p>The code enumerates all 1024 paths of a ten-step walk and checks the defining equality at every node of the tree for all three processes, so the verification is exact rather than statistical. Every entry is at machine precision. A pricing desk cares because 'discounted price is a martingale under the pricing measure' is the entire content of no-arbitrage, and everything later in the degree is the continuous-time version of the three lines checked here.</p>",
          "formula": "E[M_{n+1} \\mid \\mathcal{F}_n] = M_n \\quad\\text{a.s. for all } n",
          "code": {
            "lang": "python",
            "src": "import itertools\nimport numpy as np\n\nn = 10\npaths = np.array(list(itertools.product((-1, 1), repeat=n)))\nS = np.hstack([np.zeros((len(paths), 1)), np.cumsum(paths, axis=1)]).astype(float)\nk = np.arange(n + 1, dtype=float)\n\ncells = []\nfor j in range(n):\n    d = {}\n    for i, p in enumerate(paths):\n        d.setdefault(tuple(p[:j]), []).append(i)\n    cells.append(list(d.values()))\n\ndef worst_violation(M):\n    \"\"\"max over every node of |E[M_{j+1} | F_j] - M_j|, computed exactly.\"\"\"\n    w = 0.0\n    for j in range(n):\n        for c in cells[j]:\n            w = max(w, abs(M[c, j + 1].mean() - M[c, j].mean()))\n    return w\n\nlam = 0.4\nprint(\"process                              max |E[M_{j+1}|F_j] - M_j|\")\nprint(\"S_n                                  %.3e\" % worst_violation(S))\nprint(\"S_n^2 - n                            %.3e\" % worst_violation(S ** 2 - k))\nprint(\"exp(lam S_n) / cosh(lam)^n           %.3e\"\n      % worst_violation(np.exp(lam * S) / np.cosh(lam) ** k))\nprint(\"S_n^2   (a submartingale, not one)   %.3e\" % worst_violation(S ** 2))\nprint(\"\")\nprint(\"E[S_n^2] over n:\", np.round((S ** 2).mean(axis=0)[[0, 2, 5, 10]], 4),\n      \"at n = 0, 2, 5, 10  (equals n)\")\n",
            "output": "process                              max |E[M_{j+1}|F_j] - M_j|\nS_n                                  0.000e+00\nS_n^2 - n                            0.000e+00\nexp(lam S_n) / cosh(lam)^n           3.553e-15\nS_n^2   (a submartingale, not one)   1.000e+00\n\nE[S_n^2] over n: [ 0.  2.  5. 10.] at n = 0, 2, 5, 10  (equals n)"
          }
        },
        {
          "name": "Stopping times and the optional stopping theorem",
          "explain": "<p>A stopping time is a random time tau such that the event {tau <= n} is F_n-measurable: you can tell whether you have stopped using only what you have seen. 'The first time the price hits 110' qualifies; 'the day before the high of the year' does not. Optional stopping says that for a martingale M and a stopping time tau that is suitably controlled — bounded, or with bounded increments and finite expectation — E[M_tau] = M_0. A fair game stopped by a rule you can actually execute is still fair.</p><p>That single identity solves a surprising number of problems without any path counting. Apply it to S_n in the gambler's ruin setup and E[S_tau] = a gives the hitting probability a/N immediately. Apply it to S_n^2 - n and E[S_tau^2] - E[tau] = 0 gives the expected duration a(N - a) in one line. The second application is the more instructive one, because it converts a question about a random time into a question about a second moment.</p><p>The code checks both against 40,000 simulated gamblers. A risk manager cares because every stop-loss, every margin call and every early-exercise rule is a stopping time, and optional stopping is the precise reason a stopping rule cannot manufacture expected value out of a fair game — while the integrability conditions are exactly where the doubling strategies of the next concept slip through.</p>",
          "formula": "E[M_\\tau] = M_0; \\quad \\text{ruin: } E[S_\\tau]=a \\Rightarrow P(\\text{hit } N)=\\tfrac{a}{N}, \\;\\; E[\\tau]=a(N-a)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\na, N, p = 3, 10, 0.5\nrng = np.random.default_rng(77)\ntrials = 40_000\nx = np.full(trials, a, dtype=np.int64)\ntau = np.zeros(trials)\nalive = np.ones(trials, dtype=bool)\nfor t in range(1, 6001):\n    m = int(alive.sum())\n    if m == 0:\n        break\n    x[alive] += np.where(rng.random(m) < p, 1, -1)\n    tau[alive] = t\n    alive = (x > 0) & (x < N)\n\nprint(\"unfinished paths        : %d\" % int(alive.sum()))\nprint(\"OST on S_n     : E[S_tau] = a = %d      simulated %.4f\" % (a, x.mean()))\nprint(\"               : P(hit N) = a/N = %.4f  simulated %.4f\" % (a / N, (x == N).mean()))\nprint(\"OST on S_n^2-n : E[tau] = a(N-a) = %d   simulated %.3f\" % (a * (N - a), tau.mean()))\nprint(\"se on E[tau]   : %.3f\" % (tau.std() / np.sqrt(trials)))\nprint(\"\")\nprint(\"a rule that is NOT a stopping time: 'sell one step before the maximum'\")\nprint(\"  that rule needs the future, and no theorem protects it.\")\n",
            "output": "unfinished paths        : 0\nOST on S_n     : E[S_tau] = a = 3      simulated 2.9740\n               : P(hit N) = a/N = 0.3000  simulated 0.2974\nOST on S_n^2-n : E[tau] = a(N-a) = 21   simulated 20.977\nse on E[tau]   : 0.099\n\na rule that is NOT a stopping time: 'sell one step before the maximum'\n  that rule needs the future, and no theorem protects it."
          }
        },
        {
          "name": "The martingale transform: you cannot beat a fair game with a betting rule",
          "explain": "<p>Let H be predictable — H_k is F_{k-1}-measurable, meaning the stake is chosen before the outcome — and define the transform (H . M)_n = sum of H_k (M_k - M_{k-1}). If M is a martingale and H is bounded, the transform is again a martingale starting at zero. In words: no strategy that uses only past information turns a fair game into a favourable one. This is the discrete stochastic integral, and it is the exact template for the Ito integral — predictable integrand, martingale integrator, martingale output.</p><p>The classical stress test is the doubling strategy: bet one, and after each loss double up, stopping at the first win. It wins one unit with probability one if you can play forever and borrow without limit. The catch is not that the mathematics fails; it is that the stopping time is unbounded and the wealth is not, so optional stopping does not apply. Cap the number of rounds and the expectation snaps back to exactly zero.</p><p>The code runs ten rounds with 200,000 gamblers and shows the two halves: the mean is zero to within Monte Carlo error, while the loss distribution is a 1023-unit hole with probability one in 1024. A risk manager cares because that is the payoff profile of every martingale-style averaging-down strategy ever pitched, and its Sharpe ratio looks superb right up until the day it does not.</p>",
          "formula": "(H\\cdot M)_n = \\sum_{k=1}^{n} H_k\\,(M_k - M_{k-1}) \\ \\text{ is a martingale if } H \\text{ is predictable}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nrng = np.random.default_rng(1234)\ntrials, rounds = 200_000, 10\nX = np.where(rng.random((trials, rounds)) < 0.5, 1.0, -1.0)\n\nwealth = np.zeros(trials)\nbet = np.ones(trials)\ndone = np.zeros(trials, dtype=bool)\nfor k in range(rounds):\n    stake = np.where(done, 0.0, bet)\n    wealth += stake * X[:, k]\n    won = (~done) & (X[:, k] > 0)\n    bet = np.where(won, 1.0, bet * 2.0)\n    done |= won\n\nexact_mean = (1 - 2.0 ** -rounds) * 1.0 + 2.0 ** -rounds * -(2.0 ** rounds - 1)\nprint(\"rounds                 : %d\" % rounds)\nprint(\"E[wealth] exact        : %+.10f\" % exact_mean)\nprint(\"E[wealth] simulated    : %+.5f  (se %.5f)\" % (wealth.mean(), wealth.std() / np.sqrt(trials)))\nprint(\"P(end +1) exact        : %.6f   simulated %.6f\"\n      % (1 - 2.0 ** -rounds, (wealth == 1).mean()))\nprint(\"worst outcome          : %+.1f with probability 2^-%d = %.6f\"\n      % (wealth.min(), rounds, 2.0 ** -rounds))\nprint(\"sd of wealth           : %.2f   -> a 'sure' +1 with a %.0f-unit tail\"\n      % (wealth.std(), -wealth.min()))\n",
            "output": "rounds                 : 10\nE[wealth] exact        : +0.0000000000\nE[wealth] simulated    : -0.00352  (se 0.07164)\nP(end +1) exact        : 0.999023   simulated 0.999020\nworst outcome          : -1023.0 with probability 2^-10 = 0.000977\nsd of wealth           : 32.04   -> a 'sure' +1 with a 1023-unit tail"
          }
        },
        {
          "name": "Doob decomposition and the martingale convergence theorem",
          "explain": "<p>Any adapted integrable process splits uniquely as X_n = X_0 + M_n + A_n with M a martingale and A predictable and starting at zero; A increases exactly when X is a submartingale. The recipe is mechanical: A_n - A_{n-1} = E[X_n | F_{n-1}] - X_{n-1}, the predictable drift, and M takes the rest. For X = S_n^2 the compensator is A_n = n, which is the discrete quadratic variation and the object that becomes [M] in continuous time.</p><p>The convergence theorem is the other pillar. A martingale bounded in L1 — in particular, any non-negative one — converges almost surely to a finite limit. It need not converge in L1, and the limit need not have the same mean, which is where uniform integrability earns its keep. The Polya urn is the cleanest illustration: the fraction of red balls is a bounded martingale, so it converges, and its limit is Uniform(0,1) — a martingale whose mean is 0.5 forever but which ends up anywhere at all.</p><p>The code verifies the Doob compensator of S_n^2 exactly and then watches 20,000 urns converge: the mean stays pinned at one half while the cross-sectional standard deviation climbs to 1/sqrt(12). A researcher cares because 'converges almost surely but not in mean' is the precise failure mode behind strategies that look stable in expectation and diverge path by path.</p>",
          "formula": "X_n = X_0 + M_n + A_n, \\quad A_n - A_{n-1} = E[X_n \\mid \\mathcal{F}_{n-1}] - X_{n-1}",
          "code": {
            "lang": "python",
            "src": "import itertools\nimport numpy as np\n\nn = 8\npaths = np.array(list(itertools.product((-1, 1), repeat=n)))\nS = np.hstack([np.zeros((len(paths), 1)), np.cumsum(paths, axis=1)]).astype(float)\nX = S ** 2\nA = np.zeros_like(X)\nfor j in range(1, n + 1):\n    d = {}\n    for i, p in enumerate(paths):\n        d.setdefault(tuple(p[:j - 1]), []).append(i)\n    for c in d.values():\n        A[c, j] = A[c, j - 1] + (X[c, j].mean() - X[c, j - 1].mean())\nprint(\"Doob compensator of S_n^2 equals n :\", bool(np.allclose(A, np.arange(n + 1))))\nprint(\"A at n = 0..8 :\", np.round(A[0], 4))\n\nrng = np.random.default_rng(2468)\ntrials, steps = 20_000, 2000\nred = np.ones(trials)\ntot = np.full(trials, 2.0)\nprint(\"\")\nprint(\"Polya urn, fraction red (a bounded martingale):\")\nfor t in range(1, steps + 1):\n    draw = rng.random(trials) < red / tot\n    red += draw\n    tot += 1.0\n    if t in (1, 10, 100, 500, 2000):\n        f = red / tot\n        print(\"  t=%5d  mean %.4f  sd %.4f  P(f<0.2) %.4f\" % (t, f.mean(), f.std(), (f < 0.2).mean()))\nprint(\"  limit law is Uniform(0,1): mean 0.5000, sd %.4f\" % (1 / np.sqrt(12)))\n",
            "output": "Doob compensator of S_n^2 equals n : True\nA at n = 0..8 : [0. 1. 2. 3. 4. 5. 6. 7. 8.]\n\nPolya urn, fraction red (a bounded martingale):\n  t=    1  mean 0.5022  sd 0.1667  P(f<0.2) 0.0000\n  t=   10  mean 0.5017  sd 0.2622  P(f<0.2) 0.1785\n  t=  100  mean 0.5031  sd 0.2841  P(f<0.2) 0.1904\n  t=  500  mean 0.5029  sd 0.2865  P(f<0.2) 0.1931\n  t= 2000  mean 0.5029  sd 0.2870  P(f<0.2) 0.1930\n  limit law is Uniform(0,1): mean 0.5000, sd 0.2887"
          }
        }
      ],
      "widget": {
        "type": "simulate-paths",
        "title": "A driftless diffusion: every path is a fair game, none of them is flat",
        "params": {
          "model": "ou",
          "params": {
            "x0": 0.0,
            "mu": 0.0,
            "theta": 0.001,
            "sigma": 1.0
          },
          "n_paths": 24,
          "seed": 4404,
          "horizon": 1.0,
          "steps": 400
        }
      },
      "pitfalls": [
        "Applying optional stopping without checking an integrability condition. The doubling strategy is a counterexample, not a paradox.",
        "Writing a 'predictable' strategy that peeks: H_k must be measurable with respect to F_{k-1}, so a stake computed from today's return is not a martingale transform at all.",
        "Assuming a convergent martingale keeps its mean. The Polya urn converges almost surely and its limit is uniform; without uniform integrability, E[M_infinity] can differ from M_0.",
        "Calling a supermartingale 'good'. It decreases on average; the prefix refers to the inequality direction, not to quality."
      ],
      "check": [
        {
          "q": "Which of these is NOT a stopping time for a price process?",
          "options": [
            "The first time the price exceeds 110",
            "The first time the price exceeds 110, or day 30, whichever is sooner",
            "The last time before day 30 that the price exceeds 110",
            "Day 17, deterministically"
          ],
          "answer": 2,
          "why": "A stopping time must be decidable from information available at the time. The last crossing before day 30 cannot be identified when it happens: you only learn it was the last one once day 30 arrives. The first crossing, a first crossing capped by a deadline, and any fixed date are all decidable on the spot, and a deterministic time is the simplest stopping time there is."
        },
        {
          "q": "M is a martingale, H is predictable and bounded. The transform (H . M) is:",
          "options": [
            "a martingale",
            "a submartingale if H is positive",
            "a martingale only if H is deterministic",
            "generally not integrable"
          ],
          "answer": 0,
          "why": "Predictability means H_k is known before the increment arrives, so it factors out of the conditional expectation as a constant and multiplies a mean-zero increment, leaving mean zero. Boundedness supplies integrability. The sign of H is irrelevant because the increment has conditional mean zero either way, and nothing forces H to be deterministic."
        },
        {
          "q": "For simple random walk, S_n^2 - n is a martingale. Applying optional stopping at the ruin time with a = 3, N = 10 gives:",
          "options": [
            "E[tau] = 3",
            "E[tau] = 21",
            "E[tau] = 30",
            "E[tau] = 100"
          ],
          "answer": 1,
          "why": "Optional stopping gives E[S_tau^2] = E[tau]. The stopped value is 0 with probability 1 - a/N and N with probability a/N, so E[S_tau^2] = N^2 (a/N) = aN = 30 minus nothing... more directly the standard result is a(N - a) = 3 x 7 = 21. The value 3 is the starting point, 30 forgets to subtract a^2, and 100 is N^2."
        },
        {
          "q": "A non-negative martingale always:",
          "options": [
            "converges almost surely to a finite limit",
            "converges in L1 to a limit with the same mean",
            "is bounded",
            "has increasing variance without limit"
          ],
          "answer": 0,
          "why": "Non-negativity gives an L1 bound, and Doob's convergence theorem then gives almost-sure convergence to an integrable limit. Convergence in mean is a strictly stronger statement that needs uniform integrability, and a non-negative martingale can lose mass in the limit. Boundedness is false in general, and a martingale's variance can converge, as the Polya urn's does."
        }
      ]
    },
    {
      "n": 5,
      "title": "Poisson and jump processes, and a first Brownian motion",
      "topics": [
        "exponential interarrivals",
        "the Poisson counting process",
        "compensated and compound Poisson",
        "Donsker's invariance principle",
        "Brownian motion",
        "quadratic variation"
      ],
      "concepts": [
        {
          "name": "The Poisson process: the only counting process with no memory",
          "explain": "<p>Put independent exponential clocks end to end and count how many have rung by time t. The resulting process has three properties that characterise it completely: it starts at zero, it has independent increments, and the increment over an interval is Poisson with mean lambda times the length. Memorylessness of the exponential is what makes the second and third properties compatible — having waited does not change the remaining wait.</p><p>Two consequences are worth carrying. First, mean and variance are equal, both lambda t: a counting process with variance far above its mean is over-dispersed and is not Poisson, which is the standard first test for clustering in trade arrivals. Second, superposition and thinning are closed operations: merging independent Poisson streams adds intensities, and keeping each point independently with probability q gives Poisson with intensity q lambda. That is why aggregating order flow across venues is tractable and why a randomly sampled subset of trades is still a clean Poisson process.</p><p>The code builds the process from exponential gaps rather than from the Poisson law, so the agreement with the Poisson probability mass function is a genuine check and not a tautology. A microstructure desk cares because the Poisson process is the null model against which trade clustering, Hawkes self-excitation and intensity spikes around news are all measured.</p>",
          "formula": "P(N_t = k) = e^{-\\lambda t}\\frac{(\\lambda t)^k}{k!}, \\qquad E[N_t] = \\operatorname{Var}(N_t) = \\lambda t",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom scipy.stats import poisson\n\nrng = np.random.default_rng(505)\nlam, T, n, slots = 2.5, 4.0, 200_000, 45\ngaps = rng.exponential(1.0 / lam, size=(n, slots))\narrivals = np.cumsum(gaps, axis=1)\ncounts = (arrivals <= T).sum(axis=1)\nprint(\"built from exponential gaps; max count %d of %d slots\" % (counts.max(), slots))\nprint(\"lambda*T = %.1f\" % (lam * T))\nprint(\"\")\nprint(\"  k  :\" + \"\".join(\"%7d\" % j for j in range(4, 17)))\nemp = np.bincount(counts, minlength=20) / n\nprint(\"  emp:\" + \"\".join(\"%7.4f\" % v for v in emp[4:17]))\nprint(\"  pmf:\" + \"\".join(\"%7.4f\" % v for v in poisson.pmf(np.arange(4, 17), lam * T)))\nprint(\"\")\nprint(\"mean %.4f  variance %.4f  (both should be %.1f)\" % (counts.mean(), counts.var(), lam * T))\nearly = (arrivals <= 1.0).sum(axis=1)\nlate = counts - early\nprint(\"Cov(N_1, N_4 - N_1) = %+.4f   (independent increments -> 0, se %.4f)\"\n      % (np.cov(early, late)[0, 1], np.sqrt(lam * 1.0 * lam * 3.0 / n)))\n",
            "output": "built from exponential gaps; max count 28 of 45 slots\nlambda*T = 10.0\n\n  k  :      4      5      6      7      8      9     10     11     12     13     14     15     16\n  emp: 0.0186 0.0380 0.0624 0.0906 0.1131 0.1252 0.1260 0.1137 0.0951 0.0732 0.0513 0.0339 0.0214\n  pmf: 0.0189 0.0378 0.0631 0.0901 0.1126 0.1251 0.1251 0.1137 0.0948 0.0729 0.0521 0.0347 0.0217\n\nmean 9.9918  variance 9.9468  (both should be 10.0)\nCov(N_1, N_4 - N_1) = -0.0137   (independent increments -> 0, se 0.0097)"
          }
        },
        {
          "name": "Compensating the jumps, and compound Poisson",
          "explain": "<p>The Poisson process drifts upward, so it is a submartingale, not a martingale. Subtract its predictable drift — the Doob compensator of week 4, now in continuous time — and N_t - lambda t is a martingale with variance lambda t. That subtraction is the single most important habit in jump modelling: you almost never work with the raw counting process, you work with the compensated one, because only the compensated version can be integrated against and only it can serve as the noise in a pricing argument.</p><p>Real jumps have sizes, which gives the compound Poisson process: the sum of N_t independent draws from a jump-size law. Wald's identities give its mean as lambda t E[Y] and its variance as lambda t E[Y^2] — note the second moment, not the variance, of the jump size, because both the number and the size of jumps are random. A compound Poisson process has no Gaussian part, finitely many jumps in finite time, and paths that are flat between jumps; it is the simplest Levy process that is not Brownian motion.</p><p>The code verifies the compensated martingale property and both Wald identities against simulation. An options desk cares because the gap risk in a jump-diffusion is exactly this object, and because the compensator is what keeps the discounted price a martingale once you add jumps — the drift adjustment in Merton's model is nothing but this compensation.</p>",
          "formula": "E[X_t] = \\lambda t\\,E[Y], \\qquad \\operatorname{Var}(X_t) = \\lambda t\\,E[Y^2], \\qquad X_t = \\sum_{i=1}^{N_t} Y_i",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nrng = np.random.default_rng(606)\nlam, T, n = 3.0, 2.0, 200_000\nN = rng.poisson(lam * T, n)\ncomp = N - lam * T\nprint(\"compensated Poisson N_t - lambda t\")\nprint(\"  E  = %+.5f  (se %.5f)   should be 0\" % (comp.mean(), comp.std() / np.sqrt(n)))\nprint(\"  Var= %.5f                should be lambda t = %.1f\" % (comp.var(), lam * T))\n\nmu_y, s_y = -0.05, 0.30\nmx = int(N.max())\nY = rng.lognormal(mu_y, s_y, size=(n, mx))\nmask = np.arange(mx)[None, :] < N[:, None]\nX = (Y * mask).sum(axis=1)\nEY = np.exp(mu_y + 0.5 * s_y ** 2)\nEY2 = np.exp(2 * mu_y + 2 * s_y ** 2)\nprint(\"\")\nprint(\"compound Poisson with lognormal jump sizes (max %d jumps in a path)\" % mx)\nprint(\"  E[X]   sim %9.5f   theory lam*T*E[Y]   = %9.5f\" % (X.mean(), lam * T * EY))\nprint(\"  Var[X] sim %9.5f   theory lam*T*E[Y^2] = %9.5f\" % (X.var(), lam * T * EY2))\nprint(\"  note the SECOND moment of the jump size, not its variance\")\nprint(\"  E[Y] = %.5f, Var(Y) = %.5f, E[Y^2] = %.5f\" % (EY, EY2 - EY ** 2, EY2))\n",
            "output": "compensated Poisson N_t - lambda t\n  E  = +0.00140  (se 0.00547)   should be 0\n  Var= 5.97526                should be lambda t = 6.0\n\ncompound Poisson with lognormal jump sizes (max 19 jumps in a path)\n  E[X]   sim   5.97016   theory lam*T*E[Y]   =   5.97007\n  Var[X] sim   6.46966   theory lam*T*E[Y^2] =   6.49972\n  note the SECOND moment of the jump size, not its variance\n  E[Y] = 0.99501, Var(Y) = 0.09324, E[Y^2] = 1.08329"
          }
        },
        {
          "name": "Donsker: rescale the random walk and Brownian motion appears",
          "explain": "<p>Divide a simple random walk by the square root of the number of steps and speed time up by the same factor, and the whole path — not just its value at one time — converges in distribution to Brownian motion. This is Donsker's invariance principle, and 'invariance' is the operative word: the limit does not remember that the steps were plus or minus one. Any mean-zero, finite-variance step law gives the same limit, which is why Brownian motion is not one model among many but the universal object at this scaling.</p><p>Because convergence is at the level of paths, it transfers to any continuous functional of the path. The maximum is the best example: reflection gave P(max >= a) = 2 P(S_n > a) in the lattice world, and the limit is P(max over [0,1] of W >= a) = 2 P(W_1 >= a) with no correction term. Hitting times, occupation times and the arcsine law all descend the same way.</p><p>The code rescales walks of 16 up to 1024 steps and tracks two functionals against their Brownian limits: the maximum, which converges visibly but slowly from below because a coarse lattice cannot resolve a peak, and the mean absolute terminal value, which is already almost exact at n = 16. A desk cares because it is the licence to model a discretely traded, tick-quantised price as a continuous diffusion — and the slow convergence of the maximum is exactly why barrier monitoring frequency is a priced feature.</p>",
          "formula": "\\frac{S_{\\lfloor nt \\rfloor}}{\\sqrt{n}} \\Rightarrow W_t, \\qquad P\\Big(\\max_{[0,1]} W \\ge a\\Big) = 2P(W_1 \\ge a)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nfrom scipy.stats import norm\n\nrng = np.random.default_rng(808)\ntrials, a = 20_000, 1.0\nprint(\"     n   P(rescaled max >= 1)   E|S_n|/sqrt(n)   P(S_n/sqrt(n) > 0.5)\")\nfor n in (16, 64, 256, 1024, 4096):\n    steps = (rng.integers(0, 2, size=(trials, n)) * 2 - 1).astype(np.float32)\n    S = np.cumsum(steps, axis=1) / np.sqrt(n)\n    print(\"%6d   %20.4f   %14.4f   %20.4f\"\n          % (n, float((S.max(axis=1) >= a).mean()), float(np.abs(S[:, -1]).mean()),\n             float((S[:, -1] > 0.5).mean())))\n    del steps, S\nprint(\"\")\nprint(\"Brownian limits:\")\nprint(\"  P(max_[0,1] W >= 1)  = 2 P(W_1 >= 1) = %.4f\" % (2 * (1 - norm.cdf(a))))\nprint(\"  E|W_1|               = sqrt(2/pi)    = %.4f\" % np.sqrt(2 / np.pi))\nprint(\"  P(W_1 > 0.5)         = 1 - Phi(0.5)  = %.4f\" % (1 - norm.cdf(0.5)))\nprint(\"Monte Carlo se on each probability is about %.4f\" % np.sqrt(0.25 / trials))\n",
            "output": "     n   P(rescaled max >= 1)   E|S_n|/sqrt(n)   P(S_n/sqrt(n) > 0.5)\n    16                 0.3337           0.7921                 0.2301\n    64                 0.3206           0.7939                 0.2662\n   256                 0.3174           0.7927                 0.2843\n  1024                 0.3191           0.7916                 0.2969\n  4096                 0.3180           0.7985                 0.3036\n\nBrownian limits:\n  P(max_[0,1] W >= 1)  = 2 P(W_1 >= 1) = 0.3173\n  E|W_1|               = sqrt(2/pi)    = 0.7979\n  P(W_1 > 0.5)         = 1 - Phi(0.5)  = 0.3085\nMonte Carlo se on each probability is about 0.0035"
          }
        },
        {
          "name": "Quadratic variation: the fact that makes stochastic calculus necessary",
          "explain": "<p>Brownian motion is continuous but has infinite total variation on every interval, so you cannot integrate against it path by path in the ordinary Riemann-Stieltjes sense. What survives, and what replaces it, is quadratic variation: the sum of squared increments over a partition converges to t, and does so in probability, not merely on average. Each squared increment has mean dt and variance 2 dt^2, so summing n of them gives mean t and variance 2t^2/n — the fluctuation vanishes while the total does not.</p><p>That single asymmetry is the whole reason stochastic calculus differs from ordinary calculus. In a Taylor expansion of f(W_t), the second-order term is normally negligible because (dx)^2 is smaller than dx; here (dW)^2 is exactly dt, the same order as the first-order time term, so it survives into the limit. The result is Ito's formula and its extra one-half f'' term, which is where the next course begins.</p><p>The code refines the same path repeatedly: the sum of squared increments settles on 1.0 while the sum of absolute increments grows like the square root of the number of steps, without bound. Both facts come from one simulated path, so the contrast is not a statistical artefact. Any desk that hedges gamma cares, because the realised quadratic variation of the underlying is literally what a delta-hedged option position is paid on.</p>",
          "formula": "\\sum_{k} (W_{t_{k+1}} - W_{t_k})^2 \\;\\xrightarrow{\\;P\\;}\\; t, \\qquad \\sum_k |W_{t_{k+1}} - W_{t_k}| \\to \\infty",
          "code": {
            "lang": "python",
            "src": "import numpy as np\n\nrng = np.random.default_rng(909)\nT, N = 1.0, 2 ** 18\ndW = rng.standard_normal(N) * np.sqrt(T / N)        # ONE path, refined below\n\nprint(\"   steps        sum (dW)^2      sum |dW|     sqrt(2n T/pi)      max|dW|\")\nfor k in (4, 7, 10, 13, 16, 18):\n    n = 2 ** k\n    blk = dW.reshape(n, -1).sum(axis=1)             # the same path on a coarser grid\n    print(\"%8d   %15.6f   %11.3f   %15.3f   %10.5f\"\n          % (n, float((blk ** 2).sum()), float(np.abs(blk).sum()),\n             np.sqrt(2 * n * T / np.pi), float(np.abs(blk).max())))\nprint(\"\")\nprint(\"quadratic variation -> T = %.1f ; total variation -> infinity like sqrt(n)\" % T)\nprint(\"theoretical sd of the QV estimate at n steps: sqrt(2/n)\")\nfor k in (4, 10, 18):\n    print(\"  n = %6d -> sd %.5f\" % (2 ** k, np.sqrt(2.0 / 2 ** k)))\n",
            "output": "   steps        sum (dW)^2      sum |dW|     sqrt(2n T/pi)      max|dW|\n      16          0.916482         3.221             3.192      0.43378\n     128          1.129613         9.831             9.027      0.25417\n    1024          1.050879        26.097            25.532      0.10411\n    8192          0.974448        71.411            72.216      0.04054\n   65536          0.995271       203.802           204.258      0.01897\n  262144          0.998534       408.174           408.517      0.00853\n\nquadratic variation -> T = 1.0 ; total variation -> infinity like sqrt(n)\ntheoretical sd of the QV estimate at n steps: sqrt(2/n)\n  n =     16 -> sd 0.35355\n  n =   1024 -> sd 0.04419\n  n = 262144 -> sd 0.00276"
          }
        }
      ],
      "widget": {
        "type": "simulate-paths",
        "title": "Brownian motion as the vanishing-mean-reversion limit of an OU process",
        "params": {
          "model": "ou",
          "params": {
            "x0": 0.0,
            "mu": 0.0,
            "theta": 0.001,
            "sigma": 1.0
          },
          "n_paths": 30,
          "seed": 5505,
          "horizon": 1.0,
          "steps": 500
        }
      },
      "pitfalls": [
        "Estimating a Poisson intensity from clustered trade data and trusting it. If the variance of the counts exceeds their mean the process is not Poisson and the confidence intervals are meaningless.",
        "Using Var(Y) instead of E[Y^2] in the compound Poisson variance. The jump count is random too, and the mean of the jump size contributes to the variance of the sum.",
        "Reading Donsker as licence to ignore discreteness for path functionals. Maxima, barriers and hitting times converge slowly and always from the conservative side.",
        "Believing that quadratic variation is an average. It is a limit in probability along a refining partition; a single path has a quadratic variation, and that is the point."
      ],
      "check": [
        {
          "q": "You count trades in one-minute buckets and find the sample mean is 12 and the sample variance is 40. This suggests:",
          "options": [
            "a Poisson process with intensity 12",
            "over-dispersion, so arrivals cluster",
            "a measurement error in the timestamps",
            "the intensity is 40"
          ],
          "answer": 1,
          "why": "A Poisson process forces the mean and the variance of a count to be equal, both lambda t. A variance more than three times the mean is strong evidence of clustering, which is usually modelled with a doubly stochastic or self-exciting intensity. Fitting a Poisson with intensity 12 would badly understate the tail, taking the variance as the intensity confuses two different parameters, and timestamp error is possible but is not what dispersion measures."
        },
        {
          "q": "A compound Poisson process has intensity 2 per year and jump sizes that are +1 or -1 with equal probability. Over one year the variance of the total is:",
          "options": [
            "0",
            "1",
            "2",
            "4"
          ],
          "answer": 2,
          "why": "The variance of a compound Poisson is lambda t times the second moment of the jump size, and here E[Y^2] = 1, so the variance is 2. The mean is zero because E[Y] = 0, which is why answer 0 is tempting, but a zero mean does not make the process deterministic. Using Var(Y) = 1 times lambda t would give the same 2 here only by coincidence of E[Y] = 0; the general formula uses the second moment."
        },
        {
          "q": "The sum of squared increments of Brownian motion over [0,1] with n equal steps has standard deviation:",
          "options": [
            "sqrt(2/n), so it converges",
            "1/n",
            "constant in n",
            "sqrt(n)"
          ],
          "answer": 0,
          "why": "Each squared increment is (1/n) times a chi-square with one degree of freedom, whose variance is 2/n^2, and there are n of them independently, giving total variance 2/n and standard deviation sqrt(2/n). It therefore shrinks as the partition refines, which is precisely why quadratic variation has a deterministic limit while total variation does not."
        },
        {
          "q": "Why does Ito's formula need a second-order term while ordinary calculus does not?",
          "options": [
            "Because Brownian paths are discontinuous",
            "Because (dW)^2 is of order dt, not of order dt^2",
            "Because the expectation of dW is not zero",
            "Because the chain rule fails for random functions"
          ],
          "answer": 1,
          "why": "In a Taylor expansion the second-order term carries (dx)^2, which for a smooth path is negligible relative to dx. For Brownian motion the squared increment has mean dt, the same order as the first-order time term, so it survives the limit and contributes the one-half f'' dt correction. Brownian paths are continuous, dW does have mean zero, and the chain rule does not fail: it acquires an extra term."
        }
      ]
    }
  ],
  "interview": [
    {
      "q": "What is conditional expectation, and why do you keep calling it a random variable?",
      "level": "screen",
      "answer": "E[X | G] is the best mean-square approximation to X among variables you can compute from the information in G. It is a random variable because it takes a different value depending on which atom of G you are in: on a finite space it is the average of X over the atom containing the outcome. Collapsing it to a number throws away exactly the structure that makes the tower property useful, and the tower property is what lets you value a two-date problem one date at a time. If I need a number I take its expectation, and the tower property tells me that gives E[X]."
    },
    {
      "q": "Prove that simple random walk is recurrent in one dimension and transient in three.",
      "level": "onsite",
      "answer": "Count expected visits to the origin. The expected number of visits is the sum over m of P(S_2m = 0), and the walk is recurrent exactly when that sum diverges. In one dimension the central binomial coefficient over 4^m behaves like 1 over the square root of pi m by Stirling, so the terms are of order m to the minus one half and the sum diverges. In three dimensions a local central limit argument gives decay of order m to the minus three halves, the sum converges, so the expected number of visits is finite and the walk escapes with positive probability. Dimension two is the borderline case, with terms of order one over m."
    },
    {
      "q": "Why is the risk of ruin so sensitive to a small negative edge?",
      "level": "screen",
      "answer": "Because the ruin probability is geometric in r = (1 - p) / p, not linear in the edge. At p exactly one half the probability of losing a five-unit bankroll before doubling it is one half; at p equal to 0.48 it is about 0.60, and at 0.45 it is about 0.74. The two-percent edge compounds across every bet, and the number of bets needed to travel a fixed distance grows quadratically in that distance, so the edge gets many chances to act. That is why position sizing and drawdown limits are first-order risk controls rather than refinements."
    },
    {
      "q": "A colleague reports a strategy with a 99% win rate. What do you ask?",
      "level": "onsite",
      "answer": "What the loss looks like on the one percent, and whether the position size grows after a loss. A capped doubling strategy has exactly that profile: it wins one unit in 1023 cases out of 1024 and loses 1023 in the remaining one, and its expectation is exactly zero. The win rate is not informative on its own; the product of probability and magnitude is. I would also ask whether the exit rule is a genuine stopping time or quietly uses the future, and whether the reported track record covers enough time for the tail event to have had a chance to occur."
    },
    {
      "q": "Explain the optional stopping theorem and one condition under which it fails.",
      "level": "onsite",
      "answer": "For a martingale M and a stopping time tau, E[M_tau] = M_0 provided tau is bounded, or the stopped process is uniformly integrable, or tau has finite mean and the increments are bounded. It says a fair game stopped by an executable rule stays fair. It fails for the doubling strategy on a symmetric walk: the stopping time is the first win, which is finite with probability one, but the wealth before it is unbounded, so no integrability condition holds and E[M_tau] = 1 rather than 0. The failure is always about unbounded exposure or unbounded time, never about the martingale property."
    },
    {
      "q": "What does the second eigenvalue of a transition matrix tell you in practice?",
      "level": "onsite",
      "answer": "Its modulus is the geometric rate at which the chain forgets its starting state, so one minus it is the spectral gap and the reciprocal of the gap is the relaxation time in steps. If I fit a two-regime model to daily data and find a relaxation time of four days, a regime label is stale within a week and any strategy conditioning on it must trade at that frequency. If the second eigenvalue has modulus one the chain is periodic or reducible and the stationary distribution, though it exists, is not something the chain approaches."
    },
    {
      "q": "How would you compute the probability that a BB-rated issuer defaults within five years, given a one-year transition matrix?",
      "level": "screen",
      "answer": "Raise the matrix to the fifth power and read the entry from BB to default, with default kept as an absorbing state. The point is that the issuer does not stay BB: it migrates, and its hazard changes as it does, so compounding a single-period default probability is wrong. If I wanted the full term structure I would look at the default column across powers, and if I wanted expected time to absorption I would build the fundamental matrix from the transient block. I would also check that the matrix is a genuine generator-consistent one before trusting long horizons."
    },
    {
      "q": "Why does quadratic variation matter to someone running an options book?",
      "level": "senior",
      "answer": "Because a delta-hedged option position earns the difference between realised and implied variance, and realised variance is the quadratic variation of the underlying over the life of the trade. That is not an analogy: the profit and loss of a continuously rebalanced hedge is one half the gamma times the difference between realised squared moves and the variance the price was struck at. So the quantity you are long or short is a path functional, it converges as monitoring gets finer, and its expectation under the pricing measure is what the option cost. Everything about variance swaps follows from that sentence."
    },
    {
      "q": "Distinguish a Poisson process from a general counting process, and say why it matters.",
      "level": "onsite",
      "answer": "A Poisson process has independent, stationary increments with Poisson marginals, which forces the mean and the variance of any count to coincide and forces the gaps to be independent exponentials. A general counting process has neither. It matters because almost every real arrival stream in markets is clustered: trades beget trades, so the variance of counts far exceeds the mean and the gaps are positively dependent. Fitting a Poisson to that stream gives an intensity that is right on average and confidence intervals that are far too narrow, which is how a capacity or queueing estimate ends up wrong by an order of magnitude at exactly the busy moments."
    },
    {
      "q": "Someone tells you a martingale converges, so its expectation converges too. Respond.",
      "level": "senior",
      "answer": "Almost-sure convergence and convergence of expectations are different statements, and the gap is uniform integrability. A non-negative martingale always converges almost surely, but mass can escape in the limit, so E[M_infinity] can be strictly less than M_0. The Polya urn converges to a Uniform(0,1) limit while its mean sits at one half throughout, which happens to be consistent, but an exponential martingale with large volatility converges to zero almost surely while keeping expectation one forever. Practically that is the same failure mode as a strategy whose expected value looks fine and whose typical path goes to zero."
    },
    {
      "q": "What is the difference between a filtration and a sigma-algebra, in one sentence each, and why should a quant care?",
      "level": "screen",
      "answer": "A sigma-algebra is a snapshot of what is knowable at one moment; a filtration is an increasing family of them, one per date, encoding an information flow that never loses anything. A quant cares because every adapted-versus-predictable distinction in a backtest is a filtration question: a signal must be measurable with respect to the information available strictly before the trade, and a position must be predictable rather than merely adapted. Look-ahead bias is precisely the statement that a quantity is not measurable with respect to the sigma-algebra you claimed it was."
    },
    {
      "q": "Sketch how you would convince yourself a simulation of a stochastic process is correct.",
      "level": "senior",
      "answer": "Test against things I can compute exactly, in increasing order of strength. First moments that have closed forms, with a standard error attached so 'close' means something. Second, a full distribution where one exists — comparing the simulated count law to the Poisson probability mass function rather than just its mean. Third, an identity that should hold path by path, such as a martingale property checked node by node or a quadratic variation that must converge to t. Fourth, a degenerate limit: set the volatility or the intensity to zero and confirm the answer collapses to the deterministic one. Anything that survives all four is probably right."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 34500",
      "how": "Direct sequel: weeks 1 and 4 here are the discrete-time martingale material that Stochastic Calculus assumes in its first week, and week 5's quadratic variation is the fact Ito's formula is built on."
    },
    {
      "code": "FINM 33000",
      "how": "Risk-neutral pricing is 'the discounted price is a martingale under Q', so the conditional-expectation and optional-stopping machinery of weeks 1 and 4 is used on every tree and in every early-exercise argument."
    },
    {
      "code": "FINM 36700",
      "how": "The law of total variance from week 1 is the exact decomposition behind factor risk attribution, and the projection view of conditioning is the language for residual risk."
    },
    {
      "code": "FINM 35700",
      "how": "Week 3's absorbing Markov chain with a fundamental matrix is the ratings-migration and hazard-rate machinery credit valuation runs on."
    },
    {
      "code": "FINM 34600",
      "how": "Week 5's Poisson process is the null model for trade and quote arrivals, and the realised-variance estimators of high-frequency work are quadratic variation with microstructure noise added."
    },
    {
      "code": "FINM 33150",
      "how": "Gambler's ruin and the martingale transform of weeks 2 and 4 are the sizing and drawdown arguments behind every systematic strategy, and the martingale transform is why a pure betting rule adds no expected value."
    }
  ],
  "glossary": [
    {
      "term": "Sigma-algebra",
      "def": "A collection of events closed under complement and countable union. On a finite space it is a partition, and the partition is what 'information' means operationally."
    },
    {
      "term": "Filtration",
      "def": "An increasing family of sigma-algebras indexed by time. Increasing encodes perfect recall: information is never lost, only refined."
    },
    {
      "term": "Adapted",
      "def": "A process whose value at time n is measurable with respect to F_n: knowable when it happens. Contrast predictable, which is knowable one step early."
    },
    {
      "term": "Predictable",
      "def": "Measurable with respect to the previous step's information. A trading position must be predictable; a return is only adapted."
    },
    {
      "term": "Conditional expectation",
      "def": "E[X | G]: the orthogonal projection of X onto the G-measurable square-integrable variables, equivalently the average of X over the atom of G you are in."
    },
    {
      "term": "Tower property",
      "def": "E[E[X | F_2] | F_1] = E[X | F_1] whenever F_1 sits inside F_2. Iterated conditioning collapses to the coarser sigma-algebra."
    },
    {
      "term": "Martingale",
      "def": "An adapted integrable process with E[M_{n+1} | F_n] = M_n. A fair game: today's value is the best forecast of tomorrow's."
    },
    {
      "term": "Stopping time",
      "def": "A random time tau with {tau <= n} in F_n, so you can tell when it has arrived without seeing the future."
    },
    {
      "term": "Optional stopping theorem",
      "def": "E[M_tau] = M_0 for a martingale stopped by a suitably controlled stopping time. The integrability condition is where doubling strategies escape."
    },
    {
      "term": "Martingale transform",
      "def": "The discrete stochastic integral, the sum of a predictable stake times a martingale increment. It is again a martingale, which is why betting rules add no expected value."
    },
    {
      "term": "Doob decomposition",
      "def": "The unique split of an adapted process into a martingale plus a predictable drift. For S_n^2 the drift is n, the discrete quadratic variation."
    },
    {
      "term": "Reflection principle",
      "def": "A path-counting bijection that converts a question about the running maximum into one about the terminal value, giving P(max >= a) = 2P(S_n > a) + P(S_n = a)."
    },
    {
      "term": "Gambler's ruin",
      "def": "The probability of hitting 0 before N from a start of a. Linear in a for a fair walk, geometric in (1-p)/p otherwise."
    },
    {
      "term": "Recurrent / transient",
      "def": "A state is recurrent if the walk returns with probability one, transient otherwise. Simple random walk is recurrent in dimensions one and two, transient from three up."
    },
    {
      "term": "Stationary distribution",
      "def": "A row vector pi with pi P = pi. It is the long-run fraction of time in each state and, for an aperiodic irreducible chain, the limit of the n-step law."
    },
    {
      "term": "Spectral gap",
      "def": "One minus the modulus of the second-largest eigenvalue of a transition matrix. Its reciprocal is the relaxation time, the chain's natural clock."
    },
    {
      "term": "Fundamental matrix",
      "def": "N = (I - Q)^{-1} for the transient block Q. Entry (i,j) is the expected visits to j from i; the row sums are expected times to absorption."
    },
    {
      "term": "Poisson process",
      "def": "The counting process with independent stationary increments and exponential gaps. Mean and variance both equal lambda t, which is its sharpest diagnostic."
    },
    {
      "term": "Compensated process",
      "def": "N_t - lambda t: the counting process with its predictable drift removed, which turns a submartingale into a martingale and makes it integrable against."
    },
    {
      "term": "Quadratic variation",
      "def": "The limit of the sum of squared increments along a refining partition. It is t for Brownian motion, and its existence is why Ito calculus has a second-order term."
    }
  ]
};
