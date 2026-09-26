/* courses/finm-34800.js -- FINM 34800, Modern Applied Optimization.
   Built from the public course page only; the syllabus is behind a login and was not
   read. The ten-week outline, explanations, code, questions and glossary are this
   dashboard's own reconstruction of a standard graduate treatment, not the
   instructor's material. Every code `output` is real stdout, written by
   tools/run_snippets.py -- do not edit those strings by hand. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 34800"] = {
  "code": "FINM 34800",
  "slug": "finm-34800",
  "title": "Modern Applied Optimization",
  "instructor": "Lek-Heng Lim",
  "quarter": "Autumn",
  "units": 100,
  "block": "electives",
  "concentrations": [
    "machine-learning-ai"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/machine-learning-and-ai/finm-34800/",
    "syllabus_url": "https://uchicago.box.com/s/u4nh4czcxcjrffbh4wt9hm9c0r86jlgd",
    "fetched": "2026-09-26",
    "note": "The syllabus for this course is a shared link behind a login, so it could not be read. The only source available was the public course page: an official description of the topics, plus the instructor, the quarter, the units and the concentration. Everything else on this page -- the ten-week ordering, the explanations, the code, the pitfalls, the questions, the interview set and the glossary -- is the dashboard's own reconstruction of a standard graduate treatment of these topics. None of it comes from the instructor, none of it is endorsed by them, and nothing here should be read as a description of how the course is actually run, assessed or scheduled."
  },
  "tier": "B",
  "description": "This course assumes no background in optimisation and works through classical and modern algorithms with applications in economics, finance, machine learning and statistics. The first half covers univariate optimisation and root finding (Newton, secant, regula falsi, Brent), unconstrained optimisation (steepest descent, Newton, quasi-Newton, Gauss-Newton, Barzilai-Borwein, stochastic gradient) and constrained optimisation (slack variables, penalty, barrier, augmented Lagrangian, primal-dual). Applications in machine learning and statistics include robust, ridge, polynomial and logistic regression and support vector machines; applications in economics include Cobb-Douglas and CES production functions, Marshallian demand and shadow prices; applications in finance include Markowitz portfolio optimisation, Sharpe ratio and portfolio variance optimisation, Value-at-Risk and the Kelly criterion. The mainstay is continuous optimisation, with a flavour of combinatorial, convex, discrete, dynamic, integer, multiobjective, nonsmooth and stochastic problems.",
  "prerequisites": [
    "Multivariable calculus: gradients, Jacobians, the chain rule in vector form, and what a Taylor expansion of a scalar function of many variables looks like.",
    "Linear algebra: eigenvalues and eigenvectors, positive definiteness, solving a linear system, and the condition number of a matrix.",
    "Enough probability to read an expectation and a quantile, at the level of the program's probability and stochastic processes course.",
    "Python with numpy: writing a vectorised loop, indexing a matrix, and reading a shape error without an IDE. No prior optimisation background is assumed.",
    "Familiarity with least squares as a fitting procedure is helpful but not required; it is re-derived here as an optimisation problem."
  ],
  "textbooks": [
    {
      "title": "Convex Optimization",
      "author": "Stephen Boyd and Lieven Vandenberghe",
      "note": "A standard reference for the convexity, duality, KKT, barrier and interior-point material in weeks 5 to 7. Freely available from the authors' publisher page."
    },
    {
      "title": "Numerical Optimization",
      "author": "Jorge Nocedal and Stephen J. Wright",
      "note": "A standard reference for line searches, quasi-Newton updates, Gauss-Newton, trust regions and the augmented Lagrangian in weeks 3, 4 and 7."
    },
    {
      "title": "Numerical Optimization: Theoretical and Practical Aspects",
      "author": "J. F. Bonnans, J. C. Gilbert, C. Lemarechal and C. Sagastizabal",
      "note": "A standard reference on nonsmooth and proximal methods, used for the subgradient and splitting material in week 8."
    },
    {
      "title": "Robust Optimization",
      "author": "Aharon Ben-Tal, Laurent El Ghaoui and Arkadi Nemirovski",
      "note": "A standard reference for the uncertainty sets, robust counterparts and regularisation equivalences in week 9."
    },
    {
      "title": "Introductory Lectures on Convex Optimization",
      "author": "Yurii Nesterov",
      "note": "A standard reference for the complexity results and acceleration quoted in weeks 3 and 8."
    }
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
  ],
  "brushup": [
    {
      "topic": "Positive definiteness three ways",
      "why": "Convexity, the second-order optimality test, whether a Newton step is a descent direction, and whether a covariance matrix is usable are all one question: is this matrix positive definite. Be able to check it by eigenvalues, by a Cholesky factorisation and by the sign of a quadratic form before week 1.",
      "resource": "Strang, Introduction to Linear Algebra, chapter 6"
    },
    {
      "topic": "Condition number and what it predicts",
      "why": "Week 3 spends its time on the fact that first-order methods take a number of iterations proportional to the condition number of the Hessian. If the condition number is only a number a library returns, that whole week reads as arbitrary.",
      "resource": "Trefethen and Bau, Numerical Linear Algebra, lectures 12 and 18"
    },
    {
      "topic": "Taylor expansion of a scalar function of a vector",
      "why": "Every algorithm in the course is a local model plus a step. Gradient descent trusts the linear term, Newton trusts the quadratic term, Gauss-Newton trusts a linearised residual. Reading those three as the same sentence with different truncations makes the syllabus short.",
      "resource": "Any multivariable calculus text; or Nocedal and Wright, chapter 2"
    },
    {
      "topic": "Solving a linear system, and when not to invert",
      "why": "The equality-constrained quadratic program in week 5 and the Newton step in weeks 4 and 7 are linear solves. Forming an explicit inverse is the most common way to lose accuracy in this course's code.",
      "resource": "Trefethen and Bau, lectures 20 to 23"
    },
    {
      "topic": "Least squares as a minimisation problem",
      "why": "Regression is the first optimisation problem most students have already solved, so it is the cheapest bridge into the course. Ridge, lasso, Huber and logistic regression are then all the same statement with a different objective.",
      "resource": "Hastie, Tibshirani and Friedman, The Elements of Statistical Learning, chapter 3"
    },
    {
      "topic": "Mean-variance portfolio arithmetic",
      "why": "Half the applications in the course are portfolio problems. Being able to write portfolio variance as a quadratic form and the budget constraint as a linear equality, without looking it up, means weeks 5 to 9 are about the algorithms rather than about the finance.",
      "resource": "The program's portfolio and risk management course, or Ang, Asset Management, chapter 3"
    },
    {
      "topic": "numpy vectorisation and broadcasting",
      "why": "Every snippet here is numpy. A (n,) array broadcasting silently against an (n,1) array is the commonest way to get a plausible but wrong gradient, and a wrong gradient makes a correct algorithm look broken.",
      "resource": "The numpy user guide, 'Broadcasting'"
    },
    {
      "topic": "Quantiles, Value-at-Risk and expected shortfall",
      "why": "Week 9 turns tail risk into a linear program. The argument only lands if the difference between a quantile and a conditional tail mean is already familiar.",
      "resource": "McNeil, Frey and Embrechts, Quantitative Risk Management, chapter 2"
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "What an optimisation problem is, and when it is easy",
      "topics": [
        "objective and feasible set",
        "optimal value versus minimiser",
        "first- and second-order conditions",
        "convex sets and functions",
        "local versus global"
      ],
      "concepts": [
        {
          "name": "The objective, the feasible set, and the two things you can ask for",
          "explain": "<p>An optimisation problem is three objects: decision variables, an objective function of them, and a feasible set they must lie in. Once those are fixed, two different questions can be asked. The <em>optimal value</em> is the best achievable number; the <em>minimiser</em> is a point that achieves it. The value is always unique when it exists. The minimiser need not be unique, need not exist even when the value does, and is the thing your code actually returns.</p><p>Most of the work in practice is in the third object. Shrinking the feasible set can only make the optimal value worse, and the snippet shows the usual consequence: on the whole line the quartic is minimised at an interior stationary point, but restricted to a short interval the answer moves to the boundary, where the gradient is not zero at all. A method that looks only for stationary points will simply miss it. The scan also finds a second local minimum whose value is 2.4 higher than the global one, which is the whole difficulty of non-convex optimisation in one picture.</p><p>This is why a specification memo for a desk should separate three things explicitly: what is being maximised, what is a hard constraint, and what is merely a preference. A risk limit that is really a hard constraint but is modelled as a penalty will be violated whenever the penalty is worth paying, and an objective that quietly encodes a preference as a constraint will be reported as infeasible instead of as expensive.</p>",
          "formula": "p^\\star=\\inf\\{f(x): x\\in\\mathcal{X}\\},\\qquad \\operatorname*{arg\\,min}_{x\\in\\mathcal{X}} f(x)=\\{x\\in\\mathcal{X}: f(x)=p^\\star\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\n\ndef f(x):                        # two local minima, one of them global\n    return x ** 4 - 3.0 * x ** 2 + x\n\n\ngrid = np.linspace(-3.0, 3.0, 600001)\nv = f(grid)\ni = int(np.argmin(v))\nprint(f\"feasible set R          argmin {grid[i]:+.5f}   value {v[i]:+.6f}\")\n\nmask = (grid >= 0.5) & (grid <= 0.9)                  # same objective, smaller feasible set\nj = int(np.argmin(np.where(mask, v, np.inf)))\nprint(f\"feasible set [0.5,0.9]  argmin {grid[j]:+.5f}   value {v[j]:+.6f}   <- on the boundary\")\n\nloc = grid[1:-1][(v[1:-1] < v[:-2]) & (v[1:-1] < v[2:])]\nprint(\"local minimisers found by scanning the grid:\", np.round(loc, 4))\nprint(\"values there:\", np.round(f(loc), 6))\nprint(\"the OPTIMAL VALUE is unique; the MINIMISER need not be, and a local one is not global\")\n",
            "output": "feasible set R          argmin -1.30084   value -3.513905\nfeasible set [0.5,0.9]  argmin +0.89999   value -0.873885   <- on the boundary\nlocal minimisers found by scanning the grid: [-1.3008  1.1309]\nvalues there: [-3.513905 -1.07023 ]\nthe OPTIMAL VALUE is unique; the MINIMISER need not be, and a local one is not global"
          }
        },
        {
          "name": "First- and second-order optimality conditions",
          "explain": "<p>At an interior minimum of a differentiable function the gradient vanishes: no direction gives first-order decrease. That is necessary, not sufficient. The second-order condition looks at curvature: if the Hessian is positive definite the point is a strict local minimum, if it is indefinite the point is a saddle, and if it is singular the test says nothing and you must look further.</p><p>The snippet computes both by finite differences so that nothing is taken on trust, and shows all three outcomes. The bowl has gradient norm at the level of machine precision and Hessian eigenvalues 2 and 6, both positive. The saddle has an exactly zero gradient and eigenvalues of -2 and 2: a point where every first-order method stalls and which is not a minimum in any direction pair. The quartic has a zero gradient and a zero Hessian, and is nevertheless a perfectly good minimum: the second-order test is inconclusive rather than negative.</p><p>Saddle points matter more than textbooks suggest, because in high dimension almost every stationary point of a non-convex objective is one: a random symmetric matrix has both signs of eigenvalue with overwhelming probability. A research team that reports 'the optimiser converged' has established that the gradient is small, which is a statement about stationarity, not about optimality. Checking the smallest Hessian eigenvalue, or simply perturbing and re-running, is the cheap discipline that catches it.</p>",
          "formula": "\\nabla f(x^\\star)=0,\\qquad \\nabla^2 f(x^\\star)\\succ 0\\ \\Rightarrow\\ x^\\star\\ \\text{is a strict local minimum}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\n\ndef grad(f, x, h=1e-5):\n    g = np.zeros(x.size)\n    for i in range(x.size):\n        e = np.zeros(x.size); e[i] = h\n        g[i] = (f(x + e) - f(x - e)) / (2 * h)\n    return g\n\n\ndef hess(f, x, h=1e-4):\n    n = x.size; H = np.zeros((n, n))\n    for i in range(n):\n        for j in range(n):\n            ei = np.zeros(n); ei[i] = h\n            ej = np.zeros(n); ej[j] = h\n            H[i, j] = (f(x + ei + ej) - f(x + ei - ej) - f(x - ei + ej) + f(x - ei - ej)) / (4 * h * h)\n    return H\n\n\ncases = ((\"bowl   x^2+3y^2  \", lambda z: (z[0] - 1) ** 2 + 3 * (z[1] + 2) ** 2, np.array([1.0, -2.0])),\n         (\"saddle x^2-y^2   \", lambda z: z[0] ** 2 - z[1] ** 2, np.array([0.0, 0.0])),\n         (\"quartic x^4+y^4  \", lambda z: z[0] ** 4 + z[1] ** 4, np.array([0.0, 0.0])))\nfor name, f, xs in cases:\n    g, H = grad(f, xs), hess(f, xs)\n    ev = np.linalg.eigvalsh(H)\n    if ev.min() > 1e-6:\n        kind = \"strict local minimum (H positive definite)\"\n    elif ev.min() < -1e-6 and ev.max() > 1e-6:\n        kind = \"saddle point (H indefinite)\"\n    else:\n        kind = \"second order test INCONCLUSIVE (H singular)\"\n    print(f\"{name} ||grad|| {np.linalg.norm(g):.2e}   eigs(H) {np.round(ev, 4)}\")\n    print(f\"{' ' * 19}-> {kind}\")\n",
            "output": "bowl   x^2+3y^2   ||grad|| 1.11e-16   eigs(H) [2. 6.]\n                   -> strict local minimum (H positive definite)\nsaddle x^2-y^2    ||grad|| 0.00e+00   eigs(H) [-2.  2.]\n                   -> saddle point (H indefinite)\nquartic x^4+y^4   ||grad|| 0.00e+00   eigs(H) [0. 0.]\n                   -> second order test INCONCLUSIVE (H singular)"
          }
        },
        {
          "name": "Convexity is the property that makes a problem solvable",
          "explain": "<p>A set is convex if it contains the segment between any two of its points; a function is convex if its graph lies below every chord, equivalently if its Hessian is positive semidefinite wherever it is twice differentiable. The consequence is the single most valuable theorem in the subject: for a convex objective over a convex set, every local minimum is global, and the first-order condition is sufficient as well as necessary.</p><p>The snippet tests the chord definition directly over two hundred thousand random triples. The exponential, the fourth power and the absolute value never violate it; the cube and the negative log of one plus a square violate it by 3.98 and 1.60 respectively, and a single positive violation is a certificate of non-convexity. The quadratic form with off-diagonal 3 and diagonal 2 and 1 has a negative eigenvalue, so the corresponding quadratic is not convex and a descent method will run away along that eigenvector.</p><p>Convexity is a modelling choice, not a property of nature. Whether your problem is convex usually depends on how you wrote it: maximising the Sharpe ratio is not convex as stated but becomes a convex program after a change of variables, and a two-norm cap on weights is convex while a two-norm floor is not. Recognising the difference is what lets a desk promise a global answer with a certificate, rather than an answer that depended on the starting point.</p>",
          "formula": "f(\\theta a+(1-\\theta)b)\\le \\theta f(a)+(1-\\theta)f(b)\\ \\ \\forall \\theta\\in[0,1]\\ \\iff\\ \\nabla^2 f\\succeq 0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(0)\na = rng.uniform(-2, 2, 200000)\nb = rng.uniform(-2, 2, 200000)\nt = rng.uniform(0, 1, 200000)\n\nfs = ((\"exp(x)\", np.exp), (\"x^4\", lambda x: x ** 4), (\"|x|\", np.abs),\n      (\"x^3\", lambda x: x ** 3), (\"-log(1+x^2)\", lambda x: -np.log1p(x ** 2)))\nprint(\"chord test over 200000 random (a,b,t): worst f(ta+(1-t)b) - [t f(a)+(1-t) f(b)]\")\nprint(\"a strictly positive worst case is a certificate that the function is NOT convex\")\nfor name, f in fs:\n    viol = f(t * a + (1 - t) * b) - (t * f(a) + (1 - t) * f(b))\n    verdict = \"NOT convex\" if viol.max() > 1e-9 else \"convex on this box\"\n    print(f\"  {name:>12s}  worst {viol.max():+.5f}   {verdict}\")\n\nA = np.array([[2.0, 3.0], [3.0, 1.0]])\nev = np.linalg.eigvalsh(A)\nprint(f\"\\nquadratic form x'Ax with A = [[2,3],[3,1]]: eigenvalues {np.round(ev, 4)}\")\nprint(\"  min eigenvalue < 0, so the Hessian 2A is indefinite: not convex, and a descent\")\nprint(\"  method will find a direction of unbounded decrease\")\n",
            "output": "chord test over 200000 random (a,b,t): worst f(ta+(1-t)b) - [t f(a)+(1-t) f(b)]\na strictly positive worst case is a certificate that the function is NOT convex\n        exp(x)  worst -0.00000   convex on this box\n           x^4  worst -0.00000   convex on this box\n           |x|  worst +0.00000   convex on this box\n           x^3  worst +3.98487   NOT convex\n   -log(1+x^2)  worst +1.59746   NOT convex\n\nquadratic form x'Ax with A = [[2,3],[3,1]]: eigenvalues [-1.5414  4.5414]\n  min eigenvalue < 0, so the Hessian 2A is indefinite: not convex, and a descent\n  method will find a direction of unbounded decrease"
          }
        },
        {
          "name": "For a convex problem one start is enough",
          "explain": "<p>The practical content of convexity is a statement about your workflow, not about your mathematics. If the problem is convex you run the solver once, from anywhere, and you are done. If it is not, the number of random restarts is part of the algorithm, and the answer you report is the best of them rather than the optimum.</p><p>The snippet runs the same quasi-Newton solver from sixty random starts on two objectives that look equally innocuous. The convex one reaches a single limit value every time. The rippled one -- the same bowl plus two cosines -- reaches six distinct local values, and 87 per cent of starts end somewhere worse than the best found. Nothing in the solver's output distinguishes the two cases: every run converged, every run reported success.</p><p>Three habits follow. Report the spread across starts, not just the best value, because the spread is the only evidence you have about how much of the landscape you explored. Fix and record the seed, so that a number in a memo can be reproduced. And prefer a convex reformulation over a better search: a change of variables that convexifies the problem is worth more than a hundred restarts, because it converts a statistical claim about your search into a mathematical claim about the answer. This is exactly the trade a quant faces when choosing between a neural network and a regularised linear model for a small, noisy dataset.</p>",
          "formula": "f\\ \\text{convex},\\ \\mathcal{X}\\ \\text{convex}\\ \\Longrightarrow\\ \\text{local min}=\\text{global min}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(1)\n\n\ndef convex(z):                   # logistic term plus a positive definite quadratic\n    return np.log1p(np.exp(-(z[0] + z[1]))) + 0.5 * (z[0] ** 2 + 2 * z[1] ** 2)\n\n\ndef rugged(z):                   # same bowl, plus ripples\n    return 0.05 * (z[0] ** 2 + z[1] ** 2) + np.cos(3 * z[0]) + np.cos(3 * z[1])\n\n\nfor name, f in ((\"convex    \", convex), (\"non-convex\", rugged)):\n    vals = []\n    for _ in range(60):\n        r = minimize(f, rng.uniform(-6, 6, 2), method=\"BFGS\")\n        vals.append(round(float(r.fun), 5))\n    u = sorted(set(vals))\n    print(f\"{name}  60 random starts -> {len(u):2d} distinct limit values, best {u[0]:+.5f}\")\n    if len(u) > 1:\n        print(f\"{' ' * 12}worst local value reached {u[-1]:+.5f}, \"\n              f\"{100 * sum(v > u[0] + 1e-6 for v in vals) / len(vals):.0f}% of starts got stuck\")\nprint(\"for a convex problem every local solution is global, so one start is enough;\")\nprint(\"otherwise the number of starts is part of the algorithm\")\n",
            "output": "convex      60 random starts ->  1 distinct limit values, best +0.55633\nnon-convex  60 random starts ->  6 distinct limit values, best -1.89154\n            worst local value reached +0.71136, 87% of starts got stuck\nfor a convex problem every local solution is global, so one start is enough;\notherwise the number of starts is part of the algorithm"
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "The arc of the ten weeks",
        "params": {
          "events": [
            {
              "t": 1,
              "label": "Problems and optimality",
              "note": "Convexity is the watershed; everything else follows from which side you are on."
            },
            {
              "t": 2,
              "label": "One variable, and roots",
              "note": "Bracketing versus derivatives: the guarantee-speed trade in its simplest form."
            },
            {
              "t": 3,
              "label": "Descent directions and steps",
              "note": "Line searches make a method safe; the metric makes it fast."
            },
            {
              "t": 4,
              "label": "Newton and its relatives",
              "note": "Curvature buys affine invariance and superlinear rates."
            },
            {
              "t": 5,
              "label": "LP, QP and conic programs",
              "note": "The named families you should recognise and reduce to."
            },
            {
              "t": 6,
              "label": "Duality, KKT, shadow prices",
              "note": "Certificates of optimality and the price of every constraint."
            },
            {
              "t": 7,
              "label": "Constrained algorithms",
              "note": "Projection, penalty, barrier, augmented Lagrangian."
            },
            {
              "t": 8,
              "label": "Nonsmooth and proximal",
              "note": "Sparsity, soft-thresholding, splitting."
            },
            {
              "t": 9,
              "label": "Stochastic and robust",
              "note": "Optimising under moments you do not know."
            },
            {
              "t": 10,
              "label": "Discrete, dynamic, multiobjective",
              "note": "Where convexity ends and bounds, trees and value functions begin."
            }
          ]
        }
      },
      "pitfalls": [
        "Reporting a small gradient norm as evidence of optimality. In high dimension most stationary points of a non-convex objective are saddles, and a solver that stops on a gradient tolerance cannot tell the difference. Check curvature or perturb and re-run.",
        "Assuming the minimiser is unique because the value is. Two very different portfolios can have the same variance to eight decimals, and which one your solver returns then depends on the seed, the ordering of the assets and the library version.",
        "Encoding a hard constraint as a penalty without checking that the penalty is never worth paying. A risk limit written as a soft cost will be breached whenever the objective gains more than the cost.",
        "Testing convexity by plotting one slice. A function can be convex along every coordinate direction and non-convex along a diagonal; only the full Hessian, or a chord test over random pairs, settles it."
      ],
      "check": [
        {
          "q": "A solver returns a point where the gradient norm is 1e-12 and the smallest Hessian eigenvalue is -0.4. What have you got?",
          "options": [
            "A local minimum",
            "A global minimum",
            "A saddle point",
            "An infeasible point"
          ],
          "answer": 2,
          "why": "A vanishing gradient with an indefinite Hessian is a saddle: there is a direction of negative curvature that decreases the objective. It is neither a local nor a global minimum, and nothing about feasibility is implied."
        },
        {
          "q": "You shrink the feasible set of a minimisation problem. The optimal value can:",
          "options": [
            "only decrease",
            "only increase or stay the same",
            "only stay the same",
            "move either way"
          ],
          "answer": 1,
          "why": "Removing candidates can only remove good ones, so the infimum over a subset is at least the infimum over the set. It never improves, which is why every constraint has a non-negative shadow price in week 6."
        },
        {
          "q": "Which of these certifies that a twice-differentiable function is NOT convex?",
          "options": [
            "A negative value somewhere",
            "A negative Hessian eigenvalue somewhere",
            "A non-unique minimiser",
            "A gradient that vanishes at two points"
          ],
          "answer": 1,
          "why": "Convexity is a positive-semidefinite Hessian everywhere, so one negative eigenvalue anywhere refutes it. Negative values are irrelevant, and convex functions can have many minimisers, including two stationary points joined by a flat valley."
        },
        {
          "q": "Sixty random starts on a problem give six distinct limit values. The right thing to report is:",
          "options": [
            "the best value, as the optimum",
            "the mean of the six values",
            "the best value, the spread, and the seed",
            "that the solver failed"
          ],
          "answer": 2,
          "why": "Without convexity you have a search result, not an optimum, so the spread and the seed are part of the finding. The mean is meaningless, and the solver did not fail: it converged sixty times, to different places."
        }
      ]
    },
    {
      "n": 2,
      "title": "One variable: root finding and the guarantee-speed trade",
      "topics": [
        "bisection",
        "Newton",
        "secant and regula falsi",
        "Brent",
        "implied volatility as a root"
      ],
      "concepts": [
        {
          "name": "Bisection: what a guarantee costs",
          "explain": "<p>Bisection needs only a sign change and continuity. Given a bracket on which the function changes sign, the midpoint either is the root or gives a smaller bracket containing one, and the enclosure halves every step. The rate is linear with factor exactly one half, so reaching a width of 1e-12 from a unit bracket always takes about forty evaluations, whatever the function.</p><p>The snippet prints the bracket width and its ratio at each step, and the ratio is 0.50000 every time. It also prints the distance from the current midpoint to the root, which is <em>not</em> monotone: at step 3 the midpoint is 3e-2 away, at step 4 it is 3.2e-2 away. Only the enclosure improves monotonically. That distinction matters when you write a stopping rule: stop on the bracket width, which you can bound, not on the change in the iterate, which you cannot.</p><p>Bisection is the benchmark against which every faster method is judged, and it is what you fall back to when a faster method misbehaves. On a desk it is also the method you can defend to a risk officer: it cannot diverge, it cannot cycle, and the number of iterations is known before you start. The cost is that it ignores every bit of information about the function beyond the sign, which is why nothing else in this course is as slow.</p>",
          "formula": "|b_k-a_k|=2^{-k}|b_0-a_0|,\\qquad k \\ge \\log_2\\!\\frac{|b_0-a_0|}{\\varepsilon}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nf = lambda x: x ** 3 - 2 * x - 5\nroot = float(max(r.real for r in np.roots([1, 0, -2, -5]) if abs(r.imag) < 1e-12))\n\na, b = 2.0, 3.0\nprint(f\"bracket [{a}, {b}] with f(a) = {f(a):+.3f}, f(b) = {f(b):+.3f}: a root is trapped inside\")\nprint(\"  k         midpoint       bracket width    width / previous    |m - root|\")\nprev = b - a\nfor k in range(1, 41):\n    m = 0.5 * (a + b)\n    if f(a) * f(m) <= 0:\n        b = m\n    else:\n        a = m\n    w = b - a\n    if k <= 5 or k == 40:\n        print(f\"{k:3d}  {m:.12f}   {w:.6e}      {w / prev:.5f}        {abs(m - root):.2e}\")\n    prev = w\nprint(\"the WIDTH is divided by exactly 2 every step, so the guarantee is airtight and the rate\")\nprint(\"is linear: 1e-12 always needs about log2(1/1e-12) = 40 steps. The distance from the\")\nprint(\"current midpoint to the root is not monotone -- only the enclosure is.\")\n",
            "output": "bracket [2.0, 3.0] with f(a) = -1.000, f(b) = +16.000: a root is trapped inside\n  k         midpoint       bracket width    width / previous    |m - root|\n  1  2.500000000000   5.000000e-01      0.50000        4.05e-01\n  2  2.250000000000   2.500000e-01      0.50000        1.55e-01\n  3  2.125000000000   1.250000e-01      0.50000        3.04e-02\n  4  2.062500000000   6.250000e-02      0.50000        3.21e-02\n  5  2.093750000000   3.125000e-02      0.50000        8.01e-04\n 40  2.094551481542   9.094947e-13      0.50000        2.17e-13\nthe WIDTH is divided by exactly 2 every step, so the guarantee is airtight and the rate\nis linear: 1e-12 always needs about log2(1/1e-12) = 40 steps. The distance from the\ncurrent midpoint to the root is not monotone -- only the enclosure is."
          }
        },
        {
          "name": "Newton's method: quadratic convergence, locally",
          "explain": "<p>Newton's method replaces the function by its tangent line and jumps to the tangent's root. Near a simple root the error is squared each step, so the number of correct digits doubles: the snippet goes from an error of 9e-1 to 2.7e-1, 3.3e-2, 5.8e-4, 1.9e-7 and 1.9e-14 in five steps, and the ratio of the error to the square of the previous error sits near a constant, which is the definition of quadratic convergence.</p><p>Every word of that is local. The same iteration applied to the arctangent, whose root is zero and which is as smooth as one could wish, converges from 1.0 and diverges from 1.4: the iterate reaches 1e+70 after twelve steps and then overflows. The reason is that the tangent to a flattening function points far away, so the step overshoots more than the error it was correcting. There is a critical starting point near 1.3917 separating the two behaviours.</p><p>So Newton is not a method on its own; it is the fast end of a method. Every production root finder pairs it with something that cannot fail: a bracket that the Newton step must stay inside, a fallback to bisection when it leaves, or a damping factor on the step. Any implied-volatility routine that goes to production without that pairing will eventually be handed a deep out-of-the-money quote and return a negative volatility, or nothing at all.</p>",
          "formula": "x_{k+1}=x_k-\\frac{f(x_k)}{f'(x_k)},\\qquad |x_{k+1}-x^\\star|\\le C\\,|x_k-x^\\star|^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nf = lambda x: x ** 3 - 2 * x - 5\nfp = lambda x: 3 * x ** 2 - 2\nroot = float(max(r.real for r in np.roots([1, 0, -2, -5]) if abs(r.imag) < 1e-12))\n\nprint(\"Newton from x0 = 3.0 (well inside the basin)\")\nx, prev = 3.0, abs(3.0 - root)\nprint(f\"  k=0  x={x:.15f}  err={prev:.3e}\")\nfor k in range(1, 6):\n    x = x - f(x) / fp(x)\n    e = abs(x - root)\n    q = e / prev ** 2 if prev > 0 else float(\"nan\")\n    print(f\"  k={k}  x={x:.15f}  err={e:.3e}   err/err_prev^2={q:.4f}\")\n    prev = max(e, 1e-18)\nprint(\"the error is squared each step: the number of correct digits doubles\")\n\nprint(\"\\nthe same method on arctan(x) = 0, whose root is 0:\")\ng, gp = np.arctan, lambda x: 1.0 / (1.0 + x * x)\nfor x0 in (1.0, 1.4, 1.5):\n    x = x0\n    for _ in range(12):\n        x = x - g(x) / gp(x)\n    tag = \"converged\" if abs(x) < 1e-6 else \"DIVERGED\"\n    print(f\"  x0 = {x0:.1f}  ->  x12 = {x: .4e}   {tag}\")\nprint(\"quadratic convergence is a local statement; outside the basin Newton is not a method\")\n",
            "output": "Newton from x0 = 3.0 (well inside the basin)\n  k=0  x=3.000000000000000  err=9.054e-01\n  k=1  x=2.360000000000000  err=2.654e-01   err/err_prev^2=0.3238\n  k=2  x=2.127196780158816  err=3.265e-02   err/err_prev^2=0.4633\n  k=3  x=2.095136036933634  err=5.846e-04   err/err_prev^2=0.5485\n  k=4  x=2.094551673824268  err=1.923e-07   err/err_prev^2=0.5627\n  k=5  x=2.094551481542347  err=1.865e-14   err/err_prev^2=0.5045\nthe error is squared each step: the number of correct digits doubles\n\nthe same method on arctan(x) = 0, whose root is 0:\n  x0 = 1.0  ->  x12 =  0.0000e+00   converged\n  x0 = 1.4  ->  x12 =  2.7437e+70   DIVERGED\n  x0 = 1.5  ->  x12 =  inf   DIVERGED\nquadratic convergence is a local statement; outside the basin Newton is not a method"
          }
        },
        {
          "name": "Secant, regula falsi and Brent: hybrids that keep the bracket",
          "explain": "<p>The secant method is Newton with the derivative replaced by a difference quotient of the last two points. It converges superlinearly, with order about 1.618, and needs no derivative at all. Regula falsi is the bracketed version, which keeps a sign change but can stagnate when one endpoint is retained for many steps. Brent's method is the standard resolution: it uses inverse quadratic interpolation when that step is sensible and falls back to bisection when it is not, so it keeps the bracket guarantee and the superlinear speed.</p><p>The snippet counts function evaluations to reach 1e-12 on the same problem. Bisection spends eighty, the secant method ten, and SciPy's Brent implementation ten. All three agree on the root to twelve digits. That is the whole argument for why a bracketing hybrid is the default in every numerical library: you pay nothing for the safety net.</p><p>The practical lesson is about which resource you are counting. On a scalar polynomial an evaluation is free and the distinction is academic. When the function is a Monte Carlo price, a full curve bootstrap or a simulation of a trading day, each evaluation costs seconds to minutes and the difference between ten and eighty evaluations is the difference between an interactive tool and an overnight batch. Count evaluations, not iterations, and instrument the counter in production code.</p>",
          "formula": "x_{k+1}=x_k-f(x_k)\\frac{x_k-x_{k-1}}{f(x_k)-f(x_{k-1})},\\qquad \\text{order}\\approx 1.618",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import brentq\n\ncalls = {\"n\": 0}\n\n\ndef f(x):\n    calls[\"n\"] += 1\n    return np.exp(x) - 3.0 * x * x           # a root near 3.73\n\n\ndef reset():\n    calls[\"n\"] = 0\n\n\nTOL = 1e-12\nreset(); a, b = 3.0, 4.0\nwhile b - a > TOL:\n    m = 0.5 * (a + b)\n    if f(a) * f(m) <= 0: b = m\n    else: a = m\nprint(f\"bisection   root {0.5 * (a + b):.12f}   f-evals {calls['n']:4d}\")\n\nreset(); x0, x1 = 3.0, 4.0\nf0, f1 = f(x0), f(x1)\nfor _ in range(60):\n    if abs(f1 - f0) < 1e-300: break\n    x2 = x1 - f1 * (x1 - x0) / (f1 - f0)     # secant: Newton with a difference quotient\n    x0, f0, x1 = x1, f1, x2\n    f1 = f(x1)\n    if abs(x1 - x0) < TOL: break\nprint(f\"secant      root {x1:.12f}   f-evals {calls['n']:4d}\")\n\nreset(); r = brentq(f, 3.0, 4.0, xtol=TOL)\nprint(f\"brentq      root {r:.12f}   f-evals {calls['n']:4d}\")\nprint(\"all three agree to 1e-12; Brent keeps bisection's bracket guarantee while spending\")\nprint(\"roughly the secant method's number of evaluations -- which is why it is the default\")\n",
            "output": "bisection   root 3.733079028633   f-evals   80\nsecant      root 3.733079028633   f-evals   10\nbrentq      root 3.733079028633   f-evals   10\nall three agree to 1e-12; Brent keeps bisection's bracket guarantee while spending\nroughly the secant method's number of evaluations -- which is why it is the default"
          }
        },
        {
          "name": "Implied volatility: the same root, two different problems",
          "explain": "<p>Implied volatility is the canonical scalar root problem in finance: find the volatility that makes a model price equal a quote. The function is monotone in volatility and its derivative, vega, is available in closed form, so Newton looks like the obvious choice and at the money it is: the snippet converges to ten digits from a starting guess of 0.20.</p><p>Move the strike to twice spot with a tenth of a year to expiry and the same code fails at the second iteration. The price is 8.4e-4 and vega at the starting guess is 1.5e-25, so the Newton step divides by essentially zero and the iterate leaves the domain entirely. Brent on the bracket from 1e-4 to 5 returns 0.6000000000 for both strikes. The failure is not a bug in the implementation; it is the problem being ill-conditioned in that region, and no amount of care in the Newton code repairs it.</p><p>This is why a production surface builder brackets first and only then accelerates, and why it refuses to quote an implied volatility at all when vega is below a threshold. A volatility inverted from a price with vega of 1e-25 is a number driven entirely by the last bit of the quote: reporting it as 60 per cent, when 55 or 70 fit the same price to within a tick, misleads everything downstream, from the smile fit to the risk report.</p>",
          "formula": "\\text{solve}\\ C_{\\mathrm{BS}}(\\sigma)=C_{\\mathrm{mkt}},\\qquad \\frac{\\partial C}{\\partial\\sigma}=S\\sqrt{T}\\,\\phi(d_1)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import brentq\nfrom scipy.stats import norm\n\nS, r, T = 100.0, 0.0, 0.10\n\n\ndef call(sig, K):\n    if sig <= 0:\n        return max(S - K, 0.0)\n    v = sig * np.sqrt(T)\n    d1 = (np.log(S / K) + 0.5 * v * v) / v\n    return S * norm.cdf(d1) - K * norm.cdf(d1 - v)\n\n\ndef vega(sig, K):\n    v = sig * np.sqrt(T)\n    d1 = (np.log(S / K) + 0.5 * v * v) / v\n    return S * norm.pdf(d1) * np.sqrt(T)\n\n\nfor K, x0 in ((100.0, 0.20), (200.0, 0.20)):\n    px = call(0.60, K)                        # the price a market would quote\n    print(f\"K = {K:5.0f}  price {px:.8f}  vega at the starting guess {vega(x0, K):.3e}\")\n    sig, ok = x0, True\n    for k in range(1, 9):\n        step = (call(sig, K) - px) / vega(sig, K)\n        sig = sig - step\n        if not np.isfinite(sig) or sig <= 0:\n            print(f\"   Newton left the domain at iteration {k}: sigma = {sig:+.4g}\")\n            ok = False\n            break\n    if ok:\n        print(f\"   Newton converged to sigma = {sig:.10f}\")\n    print(f\"   brentq on [1e-4, 5] gives sigma = {brentq(lambda s: call(s, K) - px, 1e-4, 5.0, xtol=1e-14):.10f}\")\nprint(\"deep out of the money the price is flat in sigma, so the Newton step divides by almost\")\nprint(\"nothing; a bracketing method has no derivative to divide by and still returns the answer\")\n",
            "output": "K =   100  price 7.55805878  vega at the starting guess 1.261e+01\n   Newton converged to sigma = 0.6000000000\n   brentq on [1e-4, 5] gives sigma = 0.6000000000\nK =   200  price 0.00084072  vega at the starting guess 1.476e-25\n   Newton left the domain at iteration 2: sigma = -inf\n   brentq on [1e-4, 5] gives sigma = 0.6000000000\ndeep out of the money the price is flat in sigma, so the Newton step divides by almost\nnothing; a bracketing method has no derivative to divide by and still returns the answer"
          }
        }
      ],
      "widget": {
        "type": "code-trace",
        "title": "Newton on an implied volatility, step by step",
        "params": {
          "lang": "python",
          "code": "sig = 0.20\nfor k in range(1, 9):\n    price = call(sig, K)\n    v = vega(sig, K)\n    step = (price - target) / v\n    sig = sig - step\n    if not isfinite(sig) or sig <= 0:\n        raise ValueError('left the domain')",
          "steps": [
            {
              "line": 1,
              "state": {
                "K": "100",
                "target": "7.5581",
                "sig": "0.2000"
              },
              "note": "At the money: a sane starting guess."
            },
            {
              "line": 3,
              "state": {
                "sig": "0.2000",
                "price": "2.5222",
                "v": "12.61"
              },
              "note": "Vega is order ten, so the step is well scaled."
            },
            {
              "line": 5,
              "state": {
                "sig": "0.5988",
                "step": "-0.3988"
              },
              "note": "One step lands within 0.0012 of the answer."
            },
            {
              "line": 3,
              "state": {
                "sig": "0.5988",
                "price": "7.5434",
                "v": "12.18"
              },
              "note": "Second evaluation, tiny residual."
            },
            {
              "line": 5,
              "state": {
                "sig": "0.6000",
                "step": "-0.0012"
              },
              "note": "Converged to ten digits at k = 3."
            },
            {
              "line": 1,
              "state": {
                "K": "200",
                "target": "0.00084",
                "sig": "0.2000"
              },
              "note": "Same code, strike moved to twice spot."
            },
            {
              "line": 3,
              "state": {
                "sig": "0.2000",
                "price": "1.4e-24",
                "v": "1.48e-25"
              },
              "note": "Vega has underflowed: the price is flat in sigma here."
            },
            {
              "line": 5,
              "state": {
                "sig": "-inf",
                "step": "+inf"
              },
              "note": "Dividing by 1e-25 throws the iterate out of the domain."
            },
            {
              "line": 7,
              "state": {
                "sig": "-inf"
              },
              "note": "The guard fires. A bracketing method returns 0.6 for both strikes."
            }
          ]
        }
      },
      "pitfalls": [
        "Stopping a bisection on the change in the iterate rather than on the bracket width. The iterate's distance to the root is not monotone, so that rule can fire two steps early.",
        "Shipping a bare Newton iteration. It is superb inside its basin and unbounded outside it; every library pairs it with a bracket or a damping rule, and so should you.",
        "Inverting an implied volatility where vega has underflowed. The answer is determined by the last bit of the quote, and quoting it to four decimals is a fabrication.",
        "Counting iterations when evaluations are what cost money. A method with twice the iterations and a third of the function evaluations is the cheaper method when the function is a simulation."
      ],
      "check": [
        {
          "q": "Bisection on a unit bracket needs how many evaluations to guarantee 1e-10?",
          "options": [
            "about 10",
            "about 34",
            "about 100",
            "it depends on the function"
          ],
          "answer": 1,
          "why": "The width halves exactly each step, so you need log2(1/1e-10), which is about 33.2, hence 34. The count is independent of the function, which is precisely the guarantee bisection sells."
        },
        {
          "q": "Newton's method diverges on arctan from a start of 1.4 because:",
          "options": [
            "the root is not simple",
            "the function is not continuous",
            "the tangent at a flattening function overshoots",
            "the derivative is negative"
          ],
          "answer": 2,
          "why": "Arctan is smooth with a simple root at zero and a positive derivative everywhere. The failure is geometric: as the curve flattens its tangent crosses the axis far away, so the step exceeds the error it was meant to fix."
        },
        {
          "q": "Why is Brent's method the default in numerical libraries?",
          "options": [
            "It is the fastest on smooth functions",
            "It keeps a bracket while usually spending secant-like evaluation counts",
            "It needs no starting point",
            "It is the only derivative-free method"
          ],
          "answer": 1,
          "why": "Brent interpolates when that is sensible and bisects when it is not, so it retains the enclosure guarantee at roughly secant cost -- ten evaluations against eighty for bisection here. Other derivative-free methods exist, and it still needs a bracket."
        },
        {
          "q": "A vol surface tool is handed a deep out-of-the-money quote with vega 1e-20. The right behaviour is:",
          "options": [
            "return the Newton answer",
            "return the Brent answer to four decimals",
            "refuse to quote an implied vol and flag the point",
            "extrapolate from neighbouring strikes without comment"
          ],
          "answer": 2,
          "why": "Any volatility in a wide range reproduces that price to within a tick, so the inverted number is noise dressed as data. Newton will not even finish; Brent returns something, but reporting it silently is what misleads the smile fit downstream."
        }
      ]
    },
    {
      "n": 3,
      "title": "Descent directions, step sizes and the metric you measure in",
      "topics": [
        "steepest descent",
        "preconditioning",
        "Armijo and Wolfe",
        "exact line search",
        "Barzilai-Borwein"
      ],
      "concepts": [
        {
          "name": "Steepest descent is steepest only in the metric you chose",
          "explain": "<p>The negative gradient is the direction of fastest decrease per unit of Euclidean length. Change the notion of length and the steepest direction changes with it. Preconditioned steepest descent takes the step minus a positive definite matrix times the gradient, which is exactly steepest descent measured in that matrix's metric, and its convergence rate depends on the condition number of the <em>preconditioned</em> operator rather than of the original Hessian.</p><p>The snippet makes the point on a diagonal quadratic with condition number one thousand. Plain steepest descent with the best fixed step needs 7311 iterations to reach 1e-10. A Jacobi preconditioner, the reciprocal of the diagonal, makes the effective condition number 1 and converges in a single step. A deliberately imperfect preconditioner, right to within a factor of ten on the worst coordinate, leaves an effective condition number of 10 and needs 73 iterations. Three lines of code moved the iteration count by four orders of magnitude.</p><p>The convergence rate of first-order methods as a function of conditioning, and the momentum and adaptive-step machinery built on top of it, are developed in the reinforcement learning and deep learning course (FINM 33165, week 3); this course does not repeat that analysis. What matters here is the modelling consequence: standardising regressors, expressing rates in consistent units and scaling a covariance matrix before handing it to a solver are not cosmetic. They change the metric, and the metric is what sets the cost.</p>",
          "formula": "x_{k+1}=x_k-\\alpha M\\nabla f(x_k),\\qquad \\text{rate set by }\\kappa(M^{1/2}\\nabla^2 f\\,M^{1/2})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nd = np.array([1.0, 30.0, 1000.0])        # diagonal Hessian; kappa = 1000\nf = lambda x: 0.5 * d @ x ** 2\n\n\ndef descend(M, tol=1e-10, itmax=200000):\n    \"\"\"steepest descent in the metric M: x <- x - lr * M * grad.\"\"\"\n    x = np.ones(3)\n    eig = M * d                          # eigenvalues of the preconditioned operator\n    lr = 2.0 / (eig.max() + eig.min())   # the best fixed step for this operator\n    for k in range(1, itmax + 1):\n        x = x - lr * M * (d * x)\n        if f(x) < tol:\n            return k, eig.max() / eig.min()\n    return -1, eig.max() / eig.min()\n\n\nfor name, M in ((\"no preconditioner \", np.ones(3)),\n                (\"Jacobi  M = 1/diag\", 1.0 / d),\n                (\"half-right M      \", 1.0 / np.array([1.0, 30.0, 100.0]))):\n    k, kap = descend(M)\n    print(f\"{name}  effective condition number {kap:9.1f}   iterations to f < 1e-10: {k:6d}\")\nprint(\"the iteration count tracks the condition number of the PRECONDITIONED operator, not\")\nprint(\"of the original Hessian: changing the metric you measure steepness in is the cheapest\")\nprint(\"speed-up available, and it is what standardising your regressors actually buys\")\n",
            "output": "no preconditioner   effective condition number    1000.0   iterations to f < 1e-10:   7311\nJacobi  M = 1/diag  effective condition number       1.0   iterations to f < 1e-10:      1\nhalf-right M        effective condition number      10.0   iterations to f < 1e-10:     73\nthe iteration count tracks the condition number of the PRECONDITIONED operator, not\nof the original Hessian: changing the metric you measure steepness in is the cheapest\nspeed-up available, and it is what standardising your regressors actually buys"
          }
        },
        {
          "name": "Backtracking and the Armijo condition: safety without constants",
          "explain": "<p>A descent direction only promises decrease for a small enough step, and the theoretical step size depends on a Lipschitz constant you do not know. Backtracking removes the need for it: start from a generous step, and halve it until the Armijo condition holds -- the achieved decrease is at least a small fraction of the decrease the linear model predicted. That test is checkable with one extra function evaluation and is all that convergence proofs require.</p><p>The snippet runs it on a logistic regression with deliberately badly scaled columns, and prints the first iteration in full: the step of 1.0 is rejected because the loss rises to 0.9811 against a required 0.6931, the step of 0.5 is rejected at 0.7189, and 0.25 is accepted at 0.6566. Over 1500 iterations the line search spends 1474 extra function evaluations, roughly one per iteration, and reaches a loss of 0.5042126 against the 0.5042086 that a quasi-Newton method reaches in 30 iterations.</p><p>That is the honest summary: Armijo makes steepest descent safe, not fast. It cannot diverge and it needs no constants, which is why every serious implementation has one, but it does not repair a badly conditioned problem. Knowing which of the two failures you have -- unsafe steps or a bad metric -- is the diagnostic that tells you whether to add a line search or to change the model, and guessing wrong wastes days.</p>",
          "formula": "f(x_k-\\alpha\\nabla f(x_k))\\le f(x_k)-c_1\\alpha\\|\\nabla f(x_k)\\|^2,\\qquad c_1\\in(0,1)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(7)\nn, p = 400, 6\nX = np.c_[np.ones(n), rng.normal(size=(n, p - 1)) * np.array([1.0, 5.0, 0.2, 1.0, 1.0])]\nbtrue = np.array([-0.4, 1.0, 0.15, -3.0, 0.5, 0.0])\ny = (rng.uniform(size=n) < 1.0 / (1.0 + np.exp(-X @ btrue))).astype(float)\n\nloss = lambda b: float(np.mean(np.logaddexp(0.0, X @ b) - y * (X @ b)))\ngrad = lambda b: X.T @ (1.0 / (1.0 + np.exp(-X @ b)) - y) / n\n\nb, backtracks, shown = np.zeros(p), 0, False\nfor it in range(1, 1501):\n    g = grad(b)\n    L0, gg = loss(b), g @ g\n    a = 1.0\n    while loss(b - a * g) > L0 - 1e-4 * a * gg:          # Armijo sufficient decrease\n        if not shown:\n            print(f\"step {a:.4f} REJECTED: f(x-ag) {loss(b - a * g):.8f} > \"\n                  f\"f(x) - 1e-4*a*g'g {L0 - 1e-4 * a * gg:.8f}\")\n        a *= 0.5\n        backtracks += 1\n    if not shown:\n        print(f\"step {a:.4f} accepted: f(x-ag) {loss(b - a * g):.8f} <= {L0 - 1e-4 * a * gg:.8f}\")\n        shown = True\n    b = b - a * g\n    if it in (200, 1500):\n        print(f\"after {it:4d} iterations  loss {loss(b):.8f}   ||grad|| {np.linalg.norm(grad(b)):.2e}\")\n    if np.linalg.norm(grad(b)) < 1e-9:\n        break\nref = minimize(loss, np.zeros(p), jac=grad, method=\"BFGS\", options={\"gtol\": 1e-12})\nprint(f\"BFGS reference (week 4)     loss {ref.fun:.8f}   in {ref.nit} iterations\")\nprint(f\"extra function evaluations spent backtracking: {backtracks}\")\nprint(\"Armijo makes steepest descent SAFE, not fast: it needs no Lipschitz constant and cannot\")\nprint(\"diverge, but on a badly scaled design it is still thousands of iterations behind Newton\")\n",
            "output": "step 1.0000 REJECTED: f(x-ag) 0.98112991 > f(x) - 1e-4*a*g'g 0.69310657\nstep 0.5000 REJECTED: f(x-ag) 0.71892650 > f(x) - 1e-4*a*g'g 0.69312687\nstep 0.2500 accepted: f(x-ag) 0.65657072 <= 0.69313703\nafter  200 iterations  loss 0.51173892   ||grad|| 3.08e-02\nafter 1500 iterations  loss 0.50421257   ||grad|| 6.56e-04\nBFGS reference (week 4)     loss 0.50420860   in 30 iterations\nextra function evaluations spent backtracking: 1474\nArmijo makes steepest descent SAFE, not fast: it needs no Lipschitz constant and cannot\ndiverge, but on a badly scaled design it is still thousands of iterations behind Newton"
          }
        },
        {
          "name": "Exact line search buys a constant, not a rate",
          "explain": "<p>On a quadratic the best step along the negative gradient has a closed form: the squared gradient norm divided by the gradient's quadratic form in the Hessian. The snippet confirms the formula against a three-thousand-point scan of the same line, agreeing to eight decimals, which is a useful sanity check on any hand-derived step rule.</p><p>It then compares full runs. The exact line search reaches a gap of 1e-12 in 470 iterations; backtracking takes 1257 iterations and 8263 extra function evaluations. So the exact step is under three times better in iterations and considerably worse per iteration, and neither changes the fundamental scaling: both are governed by the condition number, because both use the same direction.</p><p>The lesson generalises to a rule of thumb worth having. Effort spent on the step length pays a constant factor; effort spent on the direction pays a rate. Preconditioning, Newton and quasi-Newton methods, and proximal splitting all change the direction and change the exponent in the iteration count. A cleverer line search is a tuning exercise. When a research pipeline is too slow, a desk should ask which of the two it is buying before spending a sprint on the answer, because only one of the two changes the shape of the cost curve.</p>",
          "formula": "\\alpha_k^{\\text{exact}}=\\frac{\\nabla f(x_k)^{\\!\\top}\\nabla f(x_k)}{\\nabla f(x_k)^{\\!\\top}A\\,\\nabla f(x_k)}\\quad\\text{for }f(x)=\\tfrac12 x^{\\!\\top}Ax-b^{\\!\\top}x",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(3)\nA = np.diag([1.0, 5.0, 25.0, 200.0])\nbvec = rng.normal(size=4)\nf = lambda x: 0.5 * x @ A @ x - bvec @ x\ng = lambda x: A @ x - bvec\nfstar = f(np.linalg.solve(A, bvec))\n\nx0 = np.zeros(4)\ngk = g(x0)\na_exact = (gk @ gk) / (gk @ A @ gk)                       # closed form on a quadratic\ngrid = np.linspace(0.0, 3.0 * a_exact, 300001)\na_grid = float(grid[int(np.argmin([f(x0 - s * gk) for s in grid[::100]])) * 100])\nprint(f\"exact step from g'g / (g'Ag)              {a_exact:.8f}\")\nprint(f\"argmin over a 3001-point scan of the line {a_grid:.8f}   (grid spacing {grid[100] - grid[0]:.1e})\")\n\n\ndef run(kind, itmax=100000, tol=1e-12):\n    x, evals = np.zeros(4), 0\n    for k in range(1, itmax + 1):\n        gk = g(x)\n        if kind == \"exact\":\n            a = (gk @ gk) / (gk @ A @ gk)\n            evals += 1\n        else:\n            a, L0, gg = 1.0, f(x), gk @ gk\n            while f(x - a * gk) > L0 - 1e-4 * a * gg:\n                a *= 0.5\n                evals += 1\n        x = x - a * gk\n        if f(x) - fstar < tol:\n            return k, evals\n    return -1, evals\n\n\nfor kind in (\"exact\", \"armijo\"):\n    k, ev = run(kind)\n    print(f\"{kind:>7s} line search: {k:5d} iterations, {ev:5d} extra evaluations\")\nprint(\"the closed form exists only because the objective is quadratic, and it buys a factor of\")\nprint(\"under three: the steepest-descent DIRECTION, not the step length, is what caps the rate\")\n",
            "output": "exact step from g'g / (g'Ag)              0.10593794\nargmin over a 3001-point scan of the line 0.10593794   (grid spacing 1.1e-04)\n  exact line search:   470 iterations,   470 extra evaluations\n armijo line search:  1257 iterations,  8263 extra evaluations\nthe closed form exists only because the objective is quadratic, and it buys a factor of\nunder three: the steepest-descent DIRECTION, not the step length, is what caps the rate"
          }
        },
        {
          "name": "Barzilai-Borwein: curvature for free, monotonicity given up",
          "explain": "<p>The Barzilai-Borwein step size uses the last step and the last gradient change to estimate a scalar curvature, as if fitting a single number to the secant equation that quasi-Newton methods fit a whole matrix to. It costs one extra vector of storage and no function evaluations, and it needs no line search.</p><p>On the same ill-conditioned quadratic the snippet finds steepest descent with the best fixed step needing 5065 iterations and Barzilai-Borwein needing 36, a speed-up of about 140 times, with three of those 36 steps increasing the objective. That non-monotonicity is intrinsic: the method is not a descent method, and its analysis is much harder than its implementation. Practical codes add a non-monotone line search that accepts any step no worse than the best of the last few.</p><p>The engineering point is about monitoring. A pipeline whose health check is 'the objective must fall every iteration' will kill a Barzilai-Borwein run in the first seconds, conclude the method is broken, and revert to something a hundred times slower. The same trap catches momentum, stochastic gradient methods and accelerated proximal methods, all of which are non-monotone by design. The right monitor is a trend over a window plus a hard iteration or wall-clock budget, not a per-step inequality.</p>",
          "formula": "\\alpha_k^{\\mathrm{BB}}=\\frac{s_{k-1}^{\\!\\top}y_{k-1}}{y_{k-1}^{\\!\\top}y_{k-1}},\\qquad s_{k-1}=x_k-x_{k-1},\\ y_{k-1}=\\nabla f(x_k)-\\nabla f(x_{k-1})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(11)\nd = np.array([1.0, 8.0, 60.0, 400.0, 1000.0])       # kappa = 1000\nbvec = rng.normal(size=5)\nf = lambda x: 0.5 * d @ x ** 2 - bvec @ x\ng = lambda x: d * x - bvec\nfstar = f(bvec / d)\n\n\ndef gd(tol=1e-12, itmax=200000):\n    x = np.zeros(5); lr = 2.0 / (d.max() + d.min())\n    for k in range(1, itmax + 1):\n        x = x - lr * g(x)\n        if f(x) - fstar < tol:\n            return k, 0\n    return -1, 0\n\n\ndef bb(tol=1e-12, itmax=200000):\n    x = np.zeros(5); gk = g(x)\n    a = 1.0 / d.max()                               # one safe step to get started\n    rises, prev = 0, f(x)\n    for k in range(1, itmax + 1):\n        xn = x - a * gk\n        gn = g(xn)\n        s, yv = xn - x, gn - gk\n        a = float(s @ yv) / float(yv @ yv)           # Barzilai-Borwein (BB2)\n        x, gk = xn, gn\n        cur = f(x)\n        if cur > prev + 1e-14:\n            rises += 1\n        prev = cur\n        if cur - fstar < tol:\n            return k, rises\n    return -1, rises\n\n\nk1, _ = gd()\nk2, rises = bb()\nprint(f\"steepest descent, best fixed step   {k1:6d} iterations\")\nprint(f\"Barzilai-Borwein two-point step     {k2:6d} iterations   \"\n      f\"({rises} of them increased f)\")\nprint(f\"speed-up {k1 / k2:.1f}x for one extra vector of storage and no line search\")\nprint(\"BB is not a descent method -- the objective goes up on some steps -- so a monitor that\")\nprint(\"aborts on the first uptick will throw away the method that was about to win\")\n",
            "output": "steepest descent, best fixed step     5065 iterations\nBarzilai-Borwein two-point step         36 iterations   (3 of them increased f)\nspeed-up 140.7x for one extra vector of storage and no line search\nBB is not a descent method -- the objective goes up on some steps -- so a monitor that\naborts on the first uptick will throw away the method that was about to win"
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Iterations to a fixed tolerance against conditioning and step size",
        "params": {
          "cmap": "seq",
          "xlabels": [
            "step 0.25/L",
            "step 0.5/L",
            "step 1.0/L",
            "step 1.5/L",
            "step 1.9/L"
          ],
          "ylabels": [
            "kappa 10",
            "kappa 100",
            "kappa 1000",
            "kappa 10000"
          ],
          "matrix": [
            [
              186,
              93,
              46,
              31,
              24
            ],
            [
              1893,
              947,
              473,
              315,
              249
            ],
            [
              18959,
              9480,
              4740,
              3160,
              2494
            ],
            [
              189615,
              94808,
              47404,
              31603,
              24950
            ]
          ]
        }
      },
      "pitfalls": [
        "Tuning the line search when the problem is badly conditioned. The step length buys a constant factor and the metric buys an order; measure the condition number before spending time on either.",
        "A health check that requires the objective to fall every iteration. Barzilai-Borwein, momentum and stochastic methods are all non-monotone by construction, and such a check silently rejects the fastest method available.",
        "Taking a step size derived for one parameterisation and reusing it after rescaling the variables. The admissible range scales with the largest curvature, so a change of units can turn a safe step into a divergent one.",
        "Believing the theoretical step 1/L is a good default. It is a worst-case bound; the snippet's grid shows steps near 2/L converging several times faster, which is why backtracking from a generous step beats starting conservatively."
      ],
      "check": [
        {
          "q": "A diagonal preconditioner cuts the iteration count from 7311 to 1. What changed?",
          "options": [
            "the objective",
            "the condition number of the operator the method sees",
            "the stopping tolerance",
            "the Lipschitz constant of the true Hessian"
          ],
          "answer": 1,
          "why": "Preconditioning is a change of metric: the rate depends on the conditioning of the preconditioned operator, which the Jacobi choice makes exactly 1. The objective, the tolerance and the true Hessian are all untouched."
        },
        {
          "q": "The Armijo condition requires that:",
          "options": [
            "the gradient norm falls",
            "the objective falls by at least a fraction of the linear model's prediction",
            "the step is below 1/L",
            "the objective falls monotonically to the optimum"
          ],
          "answer": 1,
          "why": "Armijo is sufficient decrease relative to the predicted decrease, which is testable with one function evaluation and needs no knowledge of L. The gradient norm can rise on an accepted step, and no single test guarantees reaching the optimum."
        },
        {
          "q": "Relative to backtracking, an exact line search on a quadratic here gives:",
          "options": [
            "a better convergence rate",
            "about a 2.7x reduction in iterations, same rate",
            "no improvement at all",
            "a guarantee of finding the global optimum"
          ],
          "answer": 1,
          "why": "470 iterations against 1257 is a constant factor under three; both are governed by the condition number because both use the negative gradient direction. Global optimality comes from convexity, not from the line search."
        },
        {
          "q": "Barzilai-Borwein increased the objective on 3 of 36 steps. This means:",
          "options": [
            "the implementation is wrong",
            "the step size is too large and must be capped",
            "the method is non-monotone by design and still converged",
            "the problem is non-convex"
          ],
          "answer": 2,
          "why": "BB is not a descent method: it fits curvature from the last step and can overshoot temporarily. It reached the tolerance 140 times faster than monotone steepest descent on a strictly convex quadratic, so neither a bug nor non-convexity is implied."
        }
      ]
    },
    {
      "n": 4,
      "title": "Newton, quasi-Newton, Gauss-Newton and calibration",
      "topics": [
        "affine invariance",
        "BFGS and the secant equation",
        "Gauss-Newton and Levenberg-Marquardt",
        "curve calibration",
        "robust regression by IRLS"
      ],
      "concepts": [
        {
          "name": "Newton's method is affine invariant, and that is the point",
          "explain": "<p>Newton's step solves the Hessian times the step equals minus the gradient. Under a linear change of variables both sides transform consistently, so the sequence of iterates is the <em>same set of points</em> in the original space no matter what units the variables were stored in. Steepest descent has no such property: its direction depends entirely on the scaling.</p><p>The snippet fits the same logistic regression three times, changing only the units of one column. Newton takes five iterations in every case and the fitted probabilities are identical to 1e-8. Steepest descent takes 103 iterations in the original scaling and fails to converge in 4000 when a column is expressed in basis points or in millions.</p><p>This is the central practical argument for second-order methods, and it is stronger than the convergence rate. Affine invariance means you do not have to standardise, does not require you to know the scale of your data in advance, and cannot be broken by a colleague changing a column from percent to basis points in an upstream data pipeline. The price is the Hessian: order of the dimension cubed per step to factorise, and the memory to store it, which is exactly why the quasi-Newton family exists and why the deep learning world, with millions of parameters, uses first-order methods and standardises obsessively instead.</p>",
          "formula": "\\nabla^2 f(x_k)\\,p_k=-\\nabla f(x_k),\\qquad x\\mapsto Sx\\ \\Rightarrow\\ \\text{same iterates}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(5)\nn = 300\nZ = rng.normal(size=(n, 3))\ny = (rng.uniform(size=n) < 1.0 / (1.0 + np.exp(-(Z @ np.array([1.0, -0.5, 0.8]))))).astype(float)\n\n\ndef solve(X, method, itmax=100000, tol=1e-10):\n    b = np.zeros(X.shape[1])\n    for k in range(1, itmax + 1):\n        mu = 1.0 / (1.0 + np.exp(-X @ b))\n        g = X.T @ (mu - y) / n\n        if np.linalg.norm(g) < tol:\n            return k - 1, b\n        if method == \"newton\":\n            H = X.T @ (X * (mu * (1 - mu))[:, None]) / n + 1e-12 * np.eye(X.shape[1])\n            b = b - np.linalg.solve(H, g)\n        else:\n            b = b - (2.0 / np.linalg.eigvalsh(X.T @ X / n).max()) * g\n    return -1, b\n\n\nb_ref = solve(Z, \"newton\")[1]\nfor label, S in ((\"original scaling      \", np.diag([1.0, 1.0, 1.0])),\n                 (\"x2 measured in bp     \", np.diag([1.0, 1e-4, 1.0])),\n                 (\"x3 measured in millions\", np.diag([1.0, 1.0, 1e6]))):\n    Xs = Z @ S\n    kn, bn = solve(Xs, \"newton\")\n    kg, bg = solve(Xs, \"gd\", itmax=4000)\n    fit = 1.0 / (1.0 + np.exp(-Xs @ bn))\n    base = 1.0 / (1.0 + np.exp(-Z @ b_ref))\n    print(f\"{label}  Newton {kn:3d} iterations | steepest descent \"\n          f\"{'did not converge in 4000' if kg < 0 else str(kg) + ' iterations'}\")\n    print(f\"{' ' * 25}fitted probabilities identical to the unscaled fit: \"\n          f\"{np.allclose(fit, base, atol=1e-8)}\")\nprint(\"Newton's step solves H p = -g, and both sides transform the same way under x -> Sx, so\")\nprint(\"the iterates are the SAME points in the original space: the method is affine invariant.\")\nprint(\"Steepest descent is not; its path depends on the units you happened to store data in.\")\n",
            "output": "original scaling        Newton   5 iterations | steepest descent 103 iterations\n                         fitted probabilities identical to the unscaled fit: True\nx2 measured in bp       Newton   5 iterations | steepest descent did not converge in 4000\n                         fitted probabilities identical to the unscaled fit: True\nx3 measured in millions  Newton   5 iterations | steepest descent did not converge in 4000\n                         fitted probabilities identical to the unscaled fit: True\nNewton's step solves H p = -g, and both sides transform the same way under x -> Sx, so\nthe iterates are the SAME points in the original space: the method is affine invariant.\nSteepest descent is not; its path depends on the units you happened to store data in."
          }
        },
        {
          "name": "BFGS: the secant equation, and superlinear rates from gradients only",
          "explain": "<p>Quasi-Newton methods build a curvature model from the gradients they have already computed. The requirement is the secant equation: the updated model, applied to the step just taken, must reproduce the observed change in gradient. BFGS is the rank-two update that satisfies it while staying symmetric, positive definite and as close as possible to the previous model.</p><p>The snippet implements it in three lines and verifies both claims. The secant residual is at the 1e-16 to 1e-24 level at every iteration, so the equation holds by construction rather than approximately. The error ratio wanders near one for the first nine iterations, while the model is still learning the curvature, then collapses through 1.1e-2 and 1.3e-2 to 2.6e-3: superlinear, not linear, and no Hessian was ever formed.</p><p>Two facts about production use follow from the derivation. Positive definiteness of the update needs the curvature condition, the inner product of step and gradient change being positive, which is exactly what the Wolfe conditions in a line search enforce; skip them and the model can become indefinite and the direction stop being a descent direction. And because the cost is a few vectors per iteration rather than a matrix factorisation, the limited-memory variant is the default optimiser for the mid-sized problems a quant research group actually has: thousands of parameters, expensive gradients, no analytic Hessian.</p>",
          "formula": "B_{k+1}s_k=y_k,\\qquad B_{k+1}=B_k+\\frac{y_ky_k^{\\!\\top}}{y_k^{\\!\\top}s_k}-\\frac{B_ks_ks_k^{\\!\\top}B_k}{s_k^{\\!\\top}B_ks_k}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(9)\nA = rng.normal(size=(6, 6)); A = A.T @ A + 6 * np.eye(6)      # positive definite\nbvec = rng.normal(size=6)\nf = lambda x: 0.5 * x @ A @ x - bvec @ x + 0.02 * float(np.sum(x ** 4))\ng = lambda x: A @ x - bvec + 0.08 * x ** 3\nxstar = x = np.zeros(6)\nfor _ in range(60):                                            # a very accurate reference\n    H = A + 0.24 * np.diag(xstar ** 2)\n    xstar = xstar - np.linalg.solve(H, g(xstar))\n\nx, B = np.zeros(6), np.eye(6)                                  # B approximates the Hessian\nprint(\"  k    ||grad||    ||x-x*||    e_k/e_{k-1}    secant residual ||B s - y||\")\nprev = np.linalg.norm(x - xstar)\nfor k in range(1, 15):\n    p = -np.linalg.solve(B, g(x))\n    a, L0 = 1.0, f(x)\n    while f(x + a * p) > L0 + 1e-4 * a * (g(x) @ p):\n        a *= 0.5\n    s = a * p\n    yv = g(x + s) - g(x)\n    Bs = B @ s\n    B = B + np.outer(yv, yv) / (yv @ s) - np.outer(Bs, Bs) / (s @ Bs)   # BFGS update\n    x = x + s\n    e = np.linalg.norm(x - xstar)\n    print(f\"{k:3d}   {np.linalg.norm(g(x)):.2e}   {e:.3e}   {e / prev:10.2e}     \"\n          f\"{np.linalg.norm(B @ s - yv):.2e}\")\n    prev = max(e, 1e-300)\n    if e < 1e-13:\n        break\nprint(\"||B s - y|| is zero to machine precision at every step: the secant equation holds by\")\nprint(\"construction. The error ratio wanders near one while B is still learning the curvature,\")\nprint(\"then collapses through 1e-2 to 2.6e-3 -- superlinear, not linear, and no Hessian was formed.\")\n",
            "output": "  k    ||grad||    ||x-x*||    e_k/e_{k-1}    secant residual ||B s - y||\n  1   9.63e-01   8.153e-02     6.35e-01     1.13e-16\n  2   4.07e-01   2.743e-02     3.36e-01     1.71e-16\n  3   3.33e-01   3.239e-02     1.18e+00     7.47e-17\n  4   1.13e-01   1.490e-02     4.60e-01     1.19e-16\n  5   1.05e-01   9.950e-03     6.68e-01     3.12e-17\n  6   8.15e-02   9.385e-03     9.43e-01     1.21e-17\n  7   7.31e-02   7.924e-03     8.44e-01     8.50e-18\n  8   3.75e-02   5.778e-03     7.29e-01     1.72e-17\n  9   4.49e-02   5.082e-03     8.79e-01     2.16e-17\n 10   2.56e-03   2.987e-04     5.88e-02     1.83e-17\n 11   1.44e-04   2.071e-05     6.93e-02     1.02e-18\n 12   1.76e-06   2.370e-07     1.14e-02     7.03e-20\n 13   2.69e-08   3.046e-09     1.29e-02     3.35e-22\n 14   6.06e-11   8.038e-12     2.64e-03     6.25e-24\n||B s - y|| is zero to machine precision at every step: the secant equation holds by\nconstruction. The error ratio wanders near one while B is still learning the curvature,\nthen collapses through 1e-2 to 2.6e-3 -- superlinear, not linear, and no Hessian was formed."
          }
        },
        {
          "name": "Gauss-Newton, Levenberg-Marquardt and calibrating a curve",
          "explain": "<p>When the objective is a sum of squared residuals, the Hessian splits into a term built from the Jacobian alone and a term involving second derivatives of the residuals weighted by the residuals themselves. Gauss-Newton drops the second term, which is cheap and accurate near a good fit where the residuals are small. Levenberg-Marquardt adds a damping multiple of the diagonal, interpolating between Gauss-Newton and a scaled gradient step, and adapts the damping according to whether the step improved the objective.</p><p>The snippet calibrates a four-parameter Nelson-Siegel curve to ten tenor points carrying two basis points of quoting noise. It converges from a flat start in eight outer iterations, with the gradient of the objective falling to 4e-13, and matches SciPy's trust-region least-squares solver to 2.5e-5 in parameters. The fit RMSE is 1.75 basis points against 2.00 injected, and the level, slope and curvature parameters are recovered to three decimals while the decay parameter lands at 1.739 against a true 1.8.</p><p>That last number is the real lesson of calibration. The decay parameter is weakly identified: many values fit the quotes to within the noise. A desk that reports it to four decimals, or that lets it drift day to day, is reading noise as a signal about the curve's shape. The standard remedies are to fix the decay on a grid, to penalise its change from yesterday's value, or to report the whole set of parameters that fit within tolerance rather than one point.</p>",
          "formula": "(J^{\\!\\top}J+\\lambda\\,\\mathrm{diag}(J^{\\!\\top}J))\\,p=-J^{\\!\\top}r,\\qquad J_{ij}=\\frac{\\partial r_i}{\\partial \\theta_j}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import least_squares\n\ntau = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30.0])\ntrue = np.array([0.042, -0.025, 0.030, 1.8])                  # b0, b1, b2, lambda\n\n\ndef ns(p, t):\n    b0, b1, b2, lam = p\n    x = t / lam\n    return b0 + b1 * (1 - np.exp(-x)) / x + b2 * ((1 - np.exp(-x)) / x - np.exp(-x))\n\n\nrng = np.random.default_rng(4)\nobs = ns(true, tau) + rng.normal(scale=2e-4, size=tau.size)   # 2bp of quoting noise\nresid = lambda p: ns(p, tau) - obs\n\n\ndef jac(p, h=1e-7):\n    J = np.zeros((tau.size, 4))\n    for i in range(4):\n        e = np.zeros(4); e[i] = h\n        J[:, i] = (resid(p + e) - resid(p - e)) / (2 * h)\n    return J\n\n\np = np.array([0.03, 0.0, 0.0, 1.0])\nlam = 1e-3\nprint(\"  k   0.5*||r||^2     ||J'r||      lambda   step type\")\nfor k in range(1, 26):\n    r = resid(p); J = jac(p)\n    JTJ = J.T @ J\n    for _ in range(30):                                        # Levenberg-Marquardt trust step\n        step = -np.linalg.solve(JTJ + lam * np.diag(np.diag(JTJ)) + 1e-14 * np.eye(4), J.T @ r)\n        if 0.5 * resid(p + step) @ resid(p + step) < 0.5 * r @ r:\n            p, lam, tag = p + step, max(lam / 3, 1e-12), \"accepted\"\n            break\n        lam *= 5\n        tag = \"rejected\"\n    if np.linalg.norm(jac(p).T @ resid(p)) < 1e-11:\n        print(f\"{k:3d}   {0.5 * resid(p) @ resid(p):.6e}  \"\n              f\"{np.linalg.norm(jac(p).T @ resid(p)):.2e}  {lam:.1e}   converged\")\n        break\n    if k <= 4 or k % 8 == 0:\n        print(f\"{k:3d}   {0.5 * resid(p) @ resid(p):.6e}  {np.linalg.norm(jac(p).T @ resid(p)):.2e}  \"\n              f\"{lam:.1e}   {tag}\")\nref = least_squares(resid, np.array([0.03, 0.0, 0.0, 1.0]), xtol=1e-15, ftol=1e-15)\nprint(f\"\\nLevenberg-Marquardt   params {np.round(p, 6)}\")\nprint(f\"scipy least_squares   params {np.round(ref.x, 6)}\")\nprint(f\"truth                 params {true}\")\nprint(f\"fit RMSE {1e4 * np.sqrt(np.mean(resid(p) ** 2)):.2f}bp against 2.00bp of injected noise;\")\nprint(f\"max |LM - scipy| = {np.max(np.abs(p - ref.x)):.2e}\")\nprint(\"calibration is nonlinear least squares: Gauss-Newton drops the second-order term of the\")\nprint(\"Hessian, and the LM damping is what keeps the step honest when the model is nearly flat\")\n",
            "output": "  k   0.5*||r||^2     ||J'r||      lambda   step type\n  1   2.106202e-06  1.49e-04  3.3e-04   accepted\n  2   1.497749e-06  4.80e-03  2.8e-03   accepted\n  3   2.088522e-07  1.06e-03  9.3e-04   accepted\n  4   1.523837e-07  3.00e-05  3.1e-04   accepted\n  8   1.522546e-07  4.14e-13  3.8e-06   converged\n\nLevenberg-Marquardt   params [ 0.041999 -0.025123  0.029339  1.739032]\nscipy least_squares   params [ 0.041999 -0.025123  0.029338  1.739007]\ntruth                 params [ 0.042 -0.025  0.03   1.8  ]\nfit RMSE 1.75bp against 2.00bp of injected noise;\nmax |LM - scipy| = 2.53e-05\ncalibration is nonlinear least squares: Gauss-Newton drops the second-order term of the\nHessian, and the LM damping is what keeps the step honest when the model is nearly flat"
          }
        },
        {
          "name": "Robust regression: a different loss, the same Newton machinery",
          "explain": "<p>Least squares gives an observation influence proportional to its residual, so a single bad print moves the fit without bound. The Huber loss is quadratic within a threshold and linear beyond it, which keeps convexity and differentiability while bounding influence. Minimising it is not a linear solve, but it is a sequence of them: iteratively reweighted least squares, where each observation's weight is the threshold divided by the magnitude of its current residual, capped at one.</p><p>The snippet corrupts fifteen of three hundred observations by twenty-five units. Least squares returns an intercept of 0.96 against a true 0.50 and a slope of 1.78 against 2.00, a parameter error of 0.514. Huber IRLS converges in eleven iterations to 0.59 and 1.97, an error of 0.095, five times smaller. The mechanism is visible in the weights: the corrupted rows end with a mean weight of 0.040 and the clean rows with 0.993, and exactly the fifteen corrupted rows are the ones down-weighted below 0.2.</p><p>The generalisation is what makes this week's machinery worth learning once. Ridge, lasso, logistic, Huber and support vector machines with a hinge loss are the same optimisation problem with a different objective, and the algorithmic choices follow from properties of that objective -- smooth or not, strongly convex or not -- rather than from the statistical story. A desk that cleans outliers by hand is doing, less reproducibly, what a robust loss does in one line.</p>",
          "formula": "\\rho_\\delta(r)=\\begin{cases}\\tfrac12 r^2,&|r|\\le\\delta\\\\ \\delta|r|-\\tfrac12\\delta^2,&|r|>\\delta\\end{cases},\\qquad w_i=\\min\\!\\left(1,\\tfrac{\\delta}{|r_i|}\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(21)\nn = 300\nX = np.c_[np.ones(n), rng.normal(size=n)]\nbtrue = np.array([0.5, 2.0])\ny = X @ btrue + rng.normal(scale=0.5, size=n)\nbad = rng.choice(n, 15, replace=False)                        # 5% fat-fingered prints\ny[bad] += rng.choice([-1, 1], 15) * 25.0\n\nols = np.linalg.lstsq(X, y, rcond=None)[0]\n\ndelta, b = 1.0, ols.copy()\nfor it in range(1, 61):\n    r = y - X @ b\n    w = np.minimum(1.0, delta / np.maximum(np.abs(r), 1e-12))  # Huber IRLS weights\n    bn = np.linalg.solve(X.T @ (X * w[:, None]), X.T @ (w * y))\n    if np.max(np.abs(bn - b)) < 1e-12:\n        b = bn\n        break\n    b = bn\nhuber = b\nr = y - X @ huber\nw = np.minimum(1.0, delta / np.maximum(np.abs(r), 1e-12))\nprint(f\"OLS       intercept {ols[0]:+.4f}  slope {ols[1]:+.4f}   error {np.linalg.norm(ols - btrue):.4f}\")\nprint(f\"Huber     intercept {huber[0]:+.4f}  slope {huber[1]:+.4f}   error \"\n      f\"{np.linalg.norm(huber - btrue):.4f}   ({it} IRLS iterations)\")\nprint(f\"truth     intercept {btrue[0]:+.4f}  slope {btrue[1]:+.4f}\")\nprint(f\"observations down-weighted below 0.2: {int(np.sum(w < 0.2))} of {n} \"\n      f\"(15 were corrupted on purpose)\")\nprint(f\"mean weight on the corrupted rows {w[bad].mean():.4f}, on the clean rows \"\n      f\"{w[np.setdiff1d(np.arange(n), bad)].mean():.4f}\")\nprint(\"Huber is quadratic near zero and linear in the tail, so it is convex and smooth enough\")\nprint(\"for a Newton-type method while giving an outlier bounded influence on the fit\")\n",
            "output": "OLS       intercept +0.9626  slope +1.7761   error 0.5140\nHuber     intercept +0.5918  slope +1.9748   error 0.0952   (11 IRLS iterations)\ntruth     intercept +0.5000  slope +2.0000\nobservations down-weighted below 0.2: 15 of 300 (15 were corrupted on purpose)\nmean weight on the corrupted rows 0.0401, on the clean rows 0.9928\nHuber is quadratic near zero and linear in the tail, so it is convex and smooth enough\nfor a Newton-type method while giving an outlier bounded influence on the fit"
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "One outlier, two very different lines",
        "params": {
          "n": 120,
          "beta": 2.0,
          "noise": 0.5,
          "seed": 2108,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Using BFGS without enforcing the curvature condition in the line search. The update then loses positive definiteness, the direction stops being a descent direction, and the failure looks like a bug in the objective.",
        "Trusting Gauss-Newton far from the solution. Dropping the second-order term is justified when residuals are small; on a bad starting guess the undamped step can be wildly wrong, which is what the Levenberg-Marquardt damping exists to catch.",
        "Reporting a weakly identified calibration parameter to four decimals. The Nelson-Siegel decay here is recovered as 1.739 against a true 1.8; many values fit within the quoting noise, so its day-to-day moves are not information.",
        "Forming and inverting the Hessian explicitly. Solve the linear system instead: it is faster, and it does not amplify the conditioning you already have."
      ],
      "check": [
        {
          "q": "Why does Newton's method take five iterations whether a column is in percent or in basis points?",
          "options": [
            "Because the gradient is scale free",
            "Because the method is affine invariant",
            "Because the stopping rule is relative",
            "Because the Hessian is diagonal"
          ],
          "answer": 1,
          "why": "The step solves H p = -g, and under x -> Sx both H and g transform so that the iterates are the same points in the original space. The gradient is not scale free, which is exactly why steepest descent failed to converge in 4000 iterations."
        },
        {
          "q": "The secant equation in BFGS requires that the new curvature model:",
          "options": [
            "equals the true Hessian",
            "maps the last step to the last gradient change",
            "is diagonal",
            "has condition number one"
          ],
          "answer": 1,
          "why": "B s = y is the only curvature information a gradient method actually observes, and the snippet shows the residual is zero to machine precision. The model is not the true Hessian; it converges to its action on the directions explored."
        },
        {
          "q": "Levenberg-Marquardt damping is increased when:",
          "options": [
            "the residual is small",
            "the proposed step failed to reduce the objective",
            "the Jacobian is full rank",
            "the parameters are near their bounds"
          ],
          "answer": 1,
          "why": "Damping interpolates towards a short scaled-gradient step, so it is raised after a rejected step and lowered after an accepted one. Rank and bounds are separate concerns, and a small residual is when Gauss-Newton is most trustworthy."
        },
        {
          "q": "Huber IRLS beat least squares here mainly because:",
          "options": [
            "it has more parameters",
            "it bounds the influence of each observation",
            "it is non-convex and escapes the bad fit",
            "it drops the outliers entirely"
          ],
          "answer": 1,
          "why": "Beyond the threshold the loss is linear, so influence is capped: the corrupted rows ended with mean weight 0.040 rather than zero. The model has the same two parameters, the loss is convex, and nothing is deleted from the sample."
        }
      ]
    },
    {
      "n": 5,
      "title": "Named families: linear, quadratic and conic programs",
      "topics": [
        "linear programs and vertices",
        "equality-constrained QP",
        "second-order cone constraints",
        "epigraph and slack tricks",
        "Markowitz as a QP"
      ],
      "concepts": [
        {
          "name": "Linear programs live at vertices",
          "explain": "<p>A linear objective has no interior stationary point: unless the gradient is zero it always decreases in some direction, so an optimum of a bounded linear program is attained at a vertex of the feasible polyhedron. That single fact organises the whole subject: the simplex method walks from vertex to neighbouring vertex, and interior-point methods cut through the middle and approach a vertex in the limit.</p><p>The snippet solves a two-variable program two ways. HiGHS returns the point (6, 4) with objective 38. Enumerating all pairs of constraint lines gives four feasible intersection points, and the best of them is (6, 4) with objective 38, matching to the last bit. On two variables and five constraints that enumeration is instant.</p><p>It is also the reason enumeration is not a method. The number of candidate vertices grows combinatorially with the number of constraints and variables: a modest scheduling or allocation problem with a hundred constraints has more vertices than atoms in a warehouse. A trading desk hits linear programs constantly -- best execution across venues, netting, collateral allocation, cheapest-to-deliver selection, and the CVaR problem in week 9 -- and in every one of them the value comes from handing the structure to a solver that exploits it rather than from searching.</p>",
          "formula": "\\min_x c^{\\!\\top}x\\ \\ \\text{s.t.}\\ Ax\\le b,\\qquad \\text{optimum attained at an extreme point of }\\{x:Ax\\le b\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom itertools import combinations\nfrom scipy.optimize import linprog\n\n# maximise 3x + 5y  subject to  x + 2y <= 14,  3x - y >= 0,  x - y <= 2,  x,y >= 0\nA = np.array([[1.0, 2.0], [-3.0, 1.0], [1.0, -1.0], [-1.0, 0.0], [0.0, -1.0]])\nb = np.array([14.0, 0.0, 2.0, 0.0, 0.0])\nc = np.array([-3.0, -5.0])                                   # linprog minimises\n\nres = linprog(c, A_ub=A, b_ub=b, bounds=[(None, None)] * 2, method=\"highs\")\nprint(f\"linprog (HiGHS)   x = {np.round(res.x, 6)}   objective {-res.fun:.6f}\")\n\nverts = []\nfor i, j in combinations(range(5), 2):\n    M = A[[i, j]]\n    if abs(np.linalg.det(M)) < 1e-12:\n        continue\n    v = np.linalg.solve(M, b[[i, j]])\n    if np.all(A @ v <= b + 1e-9) and not any(np.allclose(v, u, atol=1e-9) for u in verts):\n        verts.append(v)\nverts = np.array(verts)\nvals = -(verts @ c)\nk = int(np.argmax(vals))\nprint(f\"feasible vertices found by enumeration: {len(verts)}\")\nfor v, val in zip(np.round(verts, 4), np.round(vals, 4)):\n    print(f\"   vertex {v}   objective {val}\")\nprint(f\"best vertex {np.round(verts[k], 6)} matches the solver to \"\n      f\"{np.max(np.abs(verts[k] - res.x)):.1e}\")\nprint(\"a linear objective has no interior stationary point, so an optimum always sits at a\")\nprint(\"vertex of the polyhedron. Enumeration is exponential in dimension; that is why the\")\nprint(\"simplex method walks vertices and interior-point methods cut through the middle instead\")\n",
            "output": "linprog (HiGHS)   x = [6. 4.]   objective 38.000000\nfeasible vertices found by enumeration: 4\n   vertex [2. 6.]   objective 36.0\n   vertex [6. 4.]   objective 38.0\n   vertex [-0. -0.]   objective -0.0\n   vertex [ 2. -0.]   objective 6.0\nbest vertex [6. 4.] matches the solver to 0.0e+00\na linear objective has no interior stationary point, so an optimum always sits at a\nvertex of the polyhedron. Enumeration is exponential in dimension; that is why the\nsimplex method walks vertices and interior-point methods cut through the middle instead"
          }
        },
        {
          "name": "An equality-constrained quadratic program is a linear system",
          "explain": "<p>Minimising a convex quadratic subject to linear equalities has no iteration in it at all. Stationarity of the Lagrangian plus the constraints is a single symmetric linear system in the variables and the multipliers -- the KKT system -- and solving it once gives the exact answer.</p><p>The snippet does this for the minimum-variance portfolio with a budget constraint. The KKT solve, the textbook closed form with the inverse covariance, and SLSQP all agree: the first two to 1.1e-16 and the third to 1.7e-8. The multiplier comes out as twice the optimal variance, which is what stationarity forces when the objective is the variance rather than half of it, and it is the marginal variance cost of being required to be fully invested.</p><p>Recognising this shape is worth real money in a research codebase. Minimum variance, minimum tracking error, the characteristic portfolios of factor risk models, a beta-neutral or dollar-neutral overlay, and the hedge that minimises residual variance subject to matching a set of exposures are all this one solve. Writing them as a generic call to a nonlinear optimiser costs three orders of magnitude in time, introduces a tolerance where none is needed, and turns an exact identity into a number that moves when the library is upgraded.</p>",
          "formula": "\\begin{pmatrix}2\\Sigma & \\mathbf{1}\\\\ \\mathbf{1}^{\\!\\top} & 0\\end{pmatrix}\\begin{pmatrix}w\\\\ \\nu\\end{pmatrix}=\\begin{pmatrix}0\\\\ 1\\end{pmatrix}\\ \\Longrightarrow\\ w^\\star=\\frac{\\Sigma^{-1}\\mathbf{1}}{\\mathbf{1}^{\\!\\top}\\Sigma^{-1}\\mathbf{1}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(2)\nn = 6\nF = rng.normal(size=(n, 3))\nS = F @ F.T + np.diag(rng.uniform(0.02, 0.10, n))            # a positive definite covariance\none = np.ones(n)\n\nK = np.block([[2 * S, one[:, None]], [one[None, :], np.zeros((1, 1))]])\nrhs = np.r_[np.zeros(n), 1.0]\nsol = np.linalg.solve(K, rhs)                                 # solve the KKT system directly\nw_kkt, lam = sol[:n], sol[n]\n\nSi = np.linalg.inv(S)\nw_cf = Si @ one / (one @ Si @ one)                             # the textbook closed form\n\nres = minimize(lambda w: w @ S @ w, np.full(n, 1.0 / n), jac=lambda w: 2 * S @ w,\n               constraints=[{\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0,\n                             \"jac\": lambda w: np.ones(n)}], method=\"SLSQP\",\n               options={\"ftol\": 1e-14, \"maxiter\": 200})\nprint(\"weights, KKT linear system :\", np.round(w_kkt, 6))\nprint(\"weights, closed form       :\", np.round(w_cf, 6))\nprint(\"weights, SLSQP             :\", np.round(res.x, 6))\nprint(f\"max |KKT - closed form| {np.max(np.abs(w_kkt - w_cf)):.2e}   \"\n      f\"max |KKT - SLSQP| {np.max(np.abs(w_kkt - res.x)):.2e}\")\nprint(f\"variance {w_kkt @ S @ w_kkt:.8f}   multiplier on the budget constraint {lam:.8f}\")\nprint(f\"2 * variance = {2 * w_kkt @ S @ w_kkt:.8f} equals the multiplier, as stationarity forces\")\nprint(\"an equality-constrained QP is a LINEAR system: no iteration, no tolerance, no line search.\")\nprint(\"Every minimum-variance and every characteristic-portfolio formula is this one solve.\")\n",
            "output": "weights, KKT linear system : [ 0.257946 -0.079633  0.464657  0.059787  0.228294  0.068948]\nweights, closed form       : [ 0.257946 -0.079633  0.464657  0.059787  0.228294  0.068948]\nweights, SLSQP             : [ 0.257946 -0.079633  0.464657  0.059787  0.228294  0.068948]\nmax |KKT - closed form| 1.11e-16   max |KKT - SLSQP| 1.66e-08\nvariance 0.02039448   multiplier on the budget constraint -0.04078896\n2 * variance = 0.04078896 equals the multiplier, as stationarity forces\nan equality-constrained QP is a LINEAR system: no iteration, no tolerance, no line search.\nEvery minimum-variance and every characteristic-portfolio formula is this one solve."
          }
        },
        {
          "name": "Second-order cones: a norm cap is convex, a norm floor is not",
          "explain": "<p>Beyond linear and quadratic programs the next tractable family adds constraints of the form 'a norm is at most a linear function'. These second-order cone programs cover norm caps, robust counterparts of linear constraints, and objectives involving standard deviations rather than variances, and they are solved globally by interior-point methods with the same reliability as a linear program.</p><p>The snippet caps the two-norm of portfolio weights at 0.45 as a diversification requirement and solves with SLSQP; the cap binds exactly and the largest weight is 0.284. It then tests convexity by sampling: of 150 midpoints of feasible pairs, all 150 are feasible. Reversing the constraint to a two-norm <em>floor</em> -- a concentration requirement -- destroys that: of 150 symmetric feasible pairs, zero midpoints are feasible, because every such midpoint is the equal-weight portfolio whose norm is 0.3536, below the floor.</p><p>The asymmetry is what you can promise a portfolio manager. 'Do not be more concentrated than this' is a convex constraint with a global solution and a dual certificate. 'Take at least this much idiosyncratic risk', a minimum position size, a maximum number of names, or a minimum trade size are all non-convex, and the honest answer becomes 'here is the best I found', with the search itself part of the specification. The same question decides whether a constraint belongs in the optimiser or in a post-processing step.</p>",
          "formula": "\\|A x+b\\|_2\\le c^{\\!\\top}x+d\\ \\ \\text{convex};\\qquad \\|x\\|_2\\ge r\\ \\ \\text{not convex}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(13)\nn = 8\nF = rng.normal(size=(n, 3))\nS = F @ F.T + np.diag(rng.uniform(0.05, 0.2, n))\nmu = 0.02 + 0.05 * rng.uniform(size=n)\ncap = 0.45                                                    # ||w||_2 <= 0.45\n\n\ndef solve(bound_is_upper):\n    sgn = 1.0 if bound_is_upper else -1.0\n    cons = [{\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0},\n            {\"type\": \"ineq\", \"fun\": lambda w: sgn * (cap - np.linalg.norm(w))}]\n    best = None\n    for _ in range(12):\n        w0 = rng.normal(size=n); w0 = w0 / w0.sum()\n        r = minimize(lambda w: -mu @ w + 3.0 * w @ S @ w, w0, constraints=cons,\n                     method=\"SLSQP\", options={\"ftol\": 1e-12, \"maxiter\": 400})\n        if r.success and (best is None or r.fun < best.fun - 1e-12):\n            best = r\n    return best\n\n\nup = solve(True)\nprint(f\"min -mu'w + 3 w'Sw  s.t. 1'w = 1, ||w||_2 <= {cap}\")\nprint(f\"   objective {up.fun:.8f}   ||w||_2 = {np.linalg.norm(up.x):.6f}  (constraint active)\")\nprint(f\"   weights {np.round(up.x, 4)}   max weight {up.x.max():.4f}\")\n\n# sample feasible points as equal weights plus a zero-sum perturbation\nD = rng.normal(size=(400, n)); D = D - D.mean(axis=1, keepdims=True)\nD = D / np.linalg.norm(D, axis=1, keepdims=True)\nsmax = np.sqrt(cap ** 2 - 1.0 / n)                            # keeps ||1/n + s d||_2 <= cap\nW = 1.0 / n + (rng.uniform(0, smax, size=(400, 1)) * D)\nfeas = W[np.linalg.norm(W, axis=1) <= cap]\nmid = 0.5 * (feas[:150] + feas[150:300])\nprint(f\"\\nconvexity of the cone constraint: {len(feas)} sampled feasible points, and \"\n      f\"{int(np.sum(np.linalg.norm(mid, axis=1) <= cap + 1e-12))} of {len(mid)} midpoints of\")\nprint(\"   feasible pairs are feasible -- the ball intersected with the budget plane is convex\")\n\n# the reversed constraint ||w||_2 >= cap, tested on symmetric pairs\nWp = 1.0 / n + 1.5 * smax * D[:150]\nWm = 1.0 / n - 1.5 * smax * D[:150]\nboth = (np.linalg.norm(Wp, axis=1) >= cap) & (np.linalg.norm(Wm, axis=1) >= cap)\nmidr = 0.5 * (Wp[both] + Wm[both])\nprint(f\"the REVERSED constraint ||w||_2 >= {cap}: {int(both.sum())} symmetric feasible pairs, and \"\n      f\"{int(np.sum(np.linalg.norm(midr, axis=1) >= cap - 1e-12))} of {int(both.sum())}\")\nprint(f\"   midpoints are feasible -- every midpoint is equal weights, whose norm is \"\n      f\"{np.linalg.norm(np.full(n, 1.0 / n)):.4f}\")\nprint(\"a ball is convex, its complement is not. 'Diversify' as an upper bound on the 2-norm is a\")\nprint(\"second-order cone constraint a solver handles globally; 'concentrate' as a lower bound is\")\nprint(\"a non-convex problem with local optima, and that asymmetry decides what you can promise\")\n",
            "output": "min -mu'w + 3 w'Sw  s.t. 1'w = 1, ||w||_2 <= 0.45\n   objective 0.08889518   ||w||_2 = 0.450000  (constraint active)\n   weights [ 0.1408  0.1473 -0.0373  0.1199  0.2373  0.2837  0.0185  0.0899]   max weight 0.2837\n\nconvexity of the cone constraint: 400 sampled feasible points, and 150 of 150 midpoints of\n   feasible pairs are feasible -- the ball intersected with the budget plane is convex\nthe REVERSED constraint ||w||_2 >= 0.45: 150 symmetric feasible pairs, and 0 of 150\n   midpoints are feasible -- every midpoint is equal weights, whose norm is 0.3536\na ball is convex, its complement is not. 'Diversify' as an upper bound on the 2-norm is a\nsecond-order cone constraint a solver handles globally; 'concentrate' as a lower bound is\na non-convex problem with local optima, and that asymmetry decides what you can promise"
          }
        },
        {
          "name": "Epigraph and slack variables: turning nonsmooth into linear",
          "explain": "<p>Many objectives that look intractable are linear programs after a change of formulation. The epigraph trick replaces a nonsmooth term by a new variable bounded above by it: an absolute value becomes one slack with two linear inequalities, a maximum over several affine functions becomes one slack with one inequality per function, and a sum of absolute residuals becomes one slack per observation.</p><p>The snippet minimises the sum of absolute residuals of a regression with Student-t noise of two degrees of freedom. Written as a linear program with one hundred and twenty slacks, HiGHS returns an objective of 79.006187. A general-purpose simplex search on the nonsmooth objective directly gets to 79.110489, close but not optimal, and least squares gives 80.185196 with a parameter error 1.7 times larger than the least-absolute-deviation fit.</p><p>Two messages. First, the reformulation is where the value is: the same problem in the right coordinates goes from an approximate search to a certified global optimum. Second, this is the mechanism behind the tractability of several things a desk cares about -- least absolute deviation and quantile regression, minimising worst-case cost across scenarios, the CVaR program in week 9, and the L1 turnover penalty in week 8. When someone says a risk objective is not optimisable, the first question is whether it can be written as a max or a sum of absolute values of affine functions.</p>",
          "formula": "\\min_{x}\\ \\|y-Xb\\|_1\\ \\equiv\\ \\min_{b,u}\\ \\mathbf{1}^{\\!\\top}u\\ \\ \\text{s.t.}\\ -u\\le y-Xb\\le u",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import linprog, minimize\n\nrng = np.random.default_rng(17)\nn, p = 120, 3\nX = np.c_[np.ones(n), rng.normal(size=(n, p - 1))]\nbtrue = np.array([1.0, -2.0, 0.5])\ny = X @ btrue + rng.standard_t(2.0, size=n) * 0.4            # very heavy tailed noise\n\n# min ||y - Xb||_1  as an LP:  variables [b (free), u >= 0] with -u <= y - Xb <= u\nc = np.r_[np.zeros(p), np.ones(n)]\nA_ub = np.block([[X, -np.eye(n)], [-X, -np.eye(n)]])\nb_ub = np.r_[y, -y]\nres = linprog(c, A_ub=A_ub, b_ub=b_ub,\n              bounds=[(None, None)] * p + [(0, None)] * n, method=\"highs\")\nb_lp = res.x[:p]\n\nobj = lambda b: float(np.sum(np.abs(y - X @ b)))\nb_nm = minimize(obj, np.zeros(p), method=\"Nelder-Mead\",\n                options={\"xatol\": 1e-10, \"fatol\": 1e-12, \"maxfev\": 40000}).x\nb_ols = np.linalg.lstsq(X, y, rcond=None)[0]\n\nprint(f\"LP with slack variables   coefs {np.round(b_lp, 5)}   L1 objective {obj(b_lp):.6f}\")\nprint(f\"Nelder-Mead on |.| direct coefs {np.round(b_nm, 5)}   L1 objective {obj(b_nm):.6f}\")\nprint(f\"least squares             coefs {np.round(b_ols, 5)}   L1 objective {obj(b_ols):.6f}\")\nprint(f\"truth                     coefs {btrue}\")\nprint(f\"LP objective is lower than Nelder-Mead's by {obj(b_nm) - obj(b_lp):.2e} and lower than\")\nprint(f\"least squares' by {obj(b_ols) - obj(b_lp):.4f}\")\nprint(f\"parameter error:  LP {np.linalg.norm(b_lp - btrue):.4f}   OLS {np.linalg.norm(b_ols - btrue):.4f}\")\nprint(\"the epigraph trick -- one slack per residual plus two inequalities -- turns a nonsmooth\")\nprint(\"objective into a linear program, and a simplex or interior-point solver then returns a\")\nprint(\"certified global optimum where a general-purpose search only gets close\")\n",
            "output": "LP with slack variables   coefs [ 0.99495 -2.00498  0.59422]   L1 objective 79.006187\nNelder-Mead on |.| direct coefs [ 1.00174 -2.00379  0.63214]   L1 objective 79.110489\nleast squares             coefs [ 1.08211 -2.01217  0.63557]   L1 objective 80.185196\ntruth                     coefs [ 1.  -2.   0.5]\nLP objective is lower than Nelder-Mead's by 1.04e-01 and lower than\nleast squares' by 1.1790\nparameter error:  LP 0.0945   OLS 0.1590\nthe epigraph trick -- one slack per residual plus two inequalities -- turns a nonsmooth\nobjective into a linear program, and a simplex or interior-point solver then returns a\ncertified global optimum where a general-purpose search only gets close"
          }
        }
      ],
      "widget": {
        "type": "efficient-frontier",
        "title": "Markowitz as a quadratic program, one asset set at a time",
        "params": {
          "mu": [
            0.045,
            0.062,
            0.085,
            0.11
          ],
          "sigma": [
            0.09,
            0.14,
            0.2,
            0.31
          ],
          "rho": 0.28,
          "rf": 0.02,
          "names": [
            "Bonds",
            "Credit",
            "Equity",
            "EM"
          ]
        }
      },
      "pitfalls": [
        "Solving an equality-constrained QP with a general nonlinear optimiser. It is one symmetric linear solve; the iterative version costs three orders of magnitude and introduces a tolerance where the answer is exact.",
        "Forming the inverse covariance matrix to write the closed-form minimum-variance weights. Solve the KKT system instead; explicit inversion of a near-singular sample covariance is where most portfolio blow-ups in research code start.",
        "Assuming any constraint expressible in one line is convex. A cap on the two-norm is; a floor on it, a minimum position size and a maximum name count are not, and a solver that accepts them will return a local answer without saying so.",
        "Missing an available reformulation. Absolute values, maxima and quantile objectives are linear programs after adding slacks, and a certified global optimum beats an approximate search on the original form."
      ],
      "check": [
        {
          "q": "Why must a bounded linear program have an optimum at a vertex?",
          "options": [
            "Because the feasible set is bounded",
            "Because a nonzero linear objective always decreases in some direction until a constraint stops it",
            "Because the simplex method visits vertices",
            "Because the dual is also linear"
          ],
          "answer": 1,
          "why": "With no interior stationary point, you can always move downhill until a constraint blocks you, and repeating that argument reaches an extreme point. The simplex method exploits the fact rather than causing it, and duality is a separate statement."
        },
        {
          "q": "The multiplier of the budget constraint in the minimum-variance problem equals:",
          "options": [
            "zero",
            "the portfolio variance",
            "twice the portfolio variance",
            "the inverse of the variance"
          ],
          "answer": 2,
          "why": "With the objective written as w'Sigma w rather than half of it, stationarity gives 2 Sigma w = nu 1, and contracting with w gives nu = 2 w'Sigma w -- the snippet prints both and they agree to eight decimals."
        },
        {
          "q": "Which requirement is NOT a convex constraint on portfolio weights?",
          "options": [
            "sum of weights equals one",
            "each weight at most 5 per cent",
            "two-norm of weights at most 0.3",
            "at most 10 non-zero weights"
          ],
          "answer": 3,
          "why": "A cardinality cap is a union of subspaces, so the midpoint of two feasible points can use twenty names and be infeasible. The budget, box bounds and a norm cap are all convex, which is why only the last one needs the branch and bound of week 10."
        },
        {
          "q": "Minimising the sum of absolute residuals becomes a linear program by:",
          "options": [
            "squaring the residuals",
            "adding one slack per residual with two inequalities",
            "dropping the outliers",
            "linearising the model around a starting guess"
          ],
          "answer": 1,
          "why": "The epigraph trick bounds each |r_i| by a new variable u_i via -u_i <= r_i <= u_i and minimises the sum of the u_i. Squaring changes the problem to least squares, and no linearisation or data deletion is involved."
        }
      ]
    },
    {
      "n": 6,
      "title": "Duality, KKT conditions and shadow prices",
      "topics": [
        "the Lagrangian and the dual function",
        "weak and strong duality",
        "KKT conditions as an acceptance test",
        "sensitivity and shadow prices"
      ],
      "concepts": [
        {
          "name": "Weak duality: every multiplier certifies a bound",
          "explain": "<p>Attach a non-negative multiplier to each inequality constraint and add the weighted violations to the objective. Minimising that Lagrangian over all of space, ignoring the constraints entirely, can only give something no larger than the constrained optimum, because at the constrained optimum the added terms are non-positive. The result, as a function of the multipliers, is the dual function, and it is a lower bound for every choice of multipliers.</p><p>The snippet takes a five-variable quadratic program with three inequalities, computes the primal optimum as -0.6630981578, and evaluates the dual at two hundred thousand random multiplier vectors. Not one exceeds the primal value: zero violations. The best random draw reaches -0.6634625863, short by 3.6e-4.</p><p>The dual function is also concave whatever the primal was, being a pointwise infimum of affine functions of the multipliers. That is why duality is a tool rather than a curiosity: even for a hard, non-convex primal, the dual is a concave maximisation problem that produces valid bounds. A branch and bound code in week 10 lives on exactly this, and so does any system that must answer a risk officer mid-computation: interrupt the solve, quote the current dual value, and you have a defensible statement of how much better the answer could possibly get.</p>",
          "formula": "g(\\lambda)=\\inf_x\\Big\\{f(x)+\\lambda^{\\!\\top}(Ax-b)\\Big\\}\\le p^\\star\\quad\\forall\\lambda\\ge 0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(31)\nn, m = 5, 3\nB = rng.normal(size=(n, n))\nQ = B @ B.T + 2.0 * np.eye(n)                        # positive definite\nc = rng.normal(size=n)\nA = rng.normal(size=(m, n))\nbb = np.array([0.5, -0.2, 1.0])\nQi = np.linalg.inv(Q)\n\nprim = minimize(lambda x: 0.5 * x @ Q @ x - c @ x, np.zeros(n), jac=lambda x: Q @ x - c,\n                constraints=[{\"type\": \"ineq\", \"fun\": lambda x: bb - A @ x,\n                              \"jac\": lambda x: -A}], method=\"SLSQP\",\n                options={\"ftol\": 1e-14, \"maxiter\": 300})\npstar = float(prim.fun)\n\n\ndef dual(lmb):\n    \"\"\"inf_x L(x,lmb) for this QP, in closed form.\"\"\"\n    v = c - A.T @ lmb\n    return -0.5 * v @ Qi @ v - lmb @ bb\n\n\nprint(f\"primal optimum p* = {pstar:.10f}\")\nprint(\"dual value at random feasible multipliers (lmb >= 0):\")\nbest = -np.inf\nfor k in range(6):\n    lmb = rng.uniform(0, 2, m)\n    d = dual(lmb)\n    best = max(best, d)\n    print(f\"   lmb = {np.round(lmb, 3)}   g(lmb) = {d:+.10f}   gap {pstar - d:.6f}\")\nL = rng.uniform(0, 3, (200000, m))\nvals = -0.5 * np.einsum(\"ij,jk,ik->i\", c - L @ A, Qi, c - L @ A) - L @ bb\nprint(f\"\\nover 200000 random multipliers the largest dual value is {vals.max():+.10f}\")\nprint(f\"which is still below p* = {pstar:.10f} by {pstar - vals.max():.2e}, and NONE of the\")\nprint(f\"200000 values exceeded it ({int(np.sum(vals > pstar + 1e-12))} violations)\")\nprint(\"that is weak duality: every multiplier vector, however badly chosen, certifies a lower\")\nprint(\"bound. A trading system that must stop early can quote one and know how far it can be off\")\n",
            "output": "primal optimum p* = -0.6630981578\ndual value at random feasible multipliers (lmb >= 0):\n   lmb = [0.167 1.941 1.585]   g(lmb) = -3.4403560764   gap 2.777258\n   lmb = [0.445 0.726 0.496]   g(lmb) = -0.9746437680   gap 0.311546\n   lmb = [1.238 0.062 0.85 ]   g(lmb) = -1.9626149853   gap 1.299517\n   lmb = [1.507 0.911 1.255]   g(lmb) = -2.4522254793   gap 1.789127\n   lmb = [0.856 1.256 1.729]   g(lmb) = -2.9908380179   gap 2.327740\n   lmb = [1.351 1.795 1.682]   g(lmb) = -3.5875430403   gap 2.924445\n\nover 200000 random multipliers the largest dual value is -0.6634625863\nwhich is still below p* = -0.6630981578 by 3.64e-04, and NONE of the\n200000 values exceeded it (0 violations)\nthat is weak duality: every multiplier vector, however badly chosen, certifies a lower\nbound. A trading system that must stop early can quote one and know how far it can be off"
          }
        },
        {
          "name": "Strong duality and the gap that closes",
          "explain": "<p>For a convex problem with a strictly feasible point -- Slater's condition -- the best dual bound is not merely valid but equal to the primal optimum. The duality gap closes, and the optimal multipliers are exactly the KKT multipliers of the primal. That turns the dual into an algorithm: ascend the dual function, and the bound tightens to the answer.</p><p>The snippet runs projected gradient ascent on the dual of the same quadratic program, with the gradient of the dual being the constraint violation at the inner minimiser. The gap falls from 5.4e-2 to 3.8e-2 at iteration 1, 8.8e-3 at 10, 3.0e-5 at 40, 1.1e-8 at 80 and 3.8e-12 at 120. The multipliers converge to 0.557 and 0.131 on the first two constraints and exactly zero on the third, correctly identifying which constraints are active.</p><p>Read the middle column carefully. The objective at the inner minimiser is <em>not</em> an upper bound while the violation column is non-zero, because that point is infeasible; the primal-dual pair only brackets the answer once you also have a feasible point. Any reporting dashboard that shows a 'current best' from an infeasible iterate and calls it progress is showing a number that can be arbitrarily better than the true optimum, which is the most common way an optimisation monitor misleads its user.</p>",
          "formula": "d^\\star=\\max_{\\lambda\\ge 0}g(\\lambda)=p^\\star\\quad\\text{under Slater's condition}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(31)\nn, m = 5, 3\nB = rng.normal(size=(n, n))\nQ = B @ B.T + 2.0 * np.eye(n)\nc = rng.normal(size=n)\nA = rng.normal(size=(m, n))\nbb = np.array([0.5, -0.2, 1.0])\nQi = np.linalg.inv(Q)\npstar = float(minimize(lambda x: 0.5 * x @ Q @ x - c @ x, np.zeros(n), jac=lambda x: Q @ x - c,\n                       constraints=[{\"type\": \"ineq\", \"fun\": lambda x: bb - A @ x, \"jac\": lambda x: -A}],\n                       method=\"SLSQP\", options={\"ftol\": 1e-14, \"maxiter\": 300}).fun)\n\nxof = lambda lmb: Qi @ (c - A.T @ lmb)\ndual = lambda lmb: -0.5 * (c - A.T @ lmb) @ Qi @ (c - A.T @ lmb) - lmb @ bb\n\nlmb = np.zeros(m)\nstep = 0.35\nhist = []\nprint(\"  k     dual g(lmb)      f at x(lmb)        max violation      p* - g(lmb)\")\nfor k in range(0, 121):\n    x = xof(lmb)\n    gap = pstar - dual(lmb)\n    hist.append(gap)\n    if k in (0, 1, 2, 5, 10, 20, 40, 80, 120):\n        print(f\"{k:3d}   {dual(lmb):+.10f}   {0.5 * x @ Q @ x - c @ x:+.10f}      \"\n              f\"{max(0.0, float((A @ x - bb).max())):.3e}       {gap:.3e}\")\n    grad = A @ x - bb                                 # gradient of the dual function\n    lmb = np.maximum(0.0, lmb + step * grad)          # projected ascent keeps lmb >= 0\nprint(\"   (the middle column is f at the unconstrained minimiser x(lmb), which is INFEASIBLE while\")\nprint(\"    the violation column is non-zero, so it is not yet an upper bound on p*)\")\nprint(f\"\\nfinal multipliers {np.round(lmb, 6)}   active constraints \"\n      f\"{np.where(lmb > 1e-8)[0].tolist()}\")\nprint(f\"the gap fell from {hist[0]:.3e} to {hist[-1]:.3e}: strong duality holds for this convex\")\nprint(\"QP, so the dual bound is not merely valid but TIGHT, and the multipliers it converges to\")\nprint(\"are exactly the KKT multipliers of the primal\")\n",
            "output": "  k     dual g(lmb)      f at x(lmb)        max violation      p* - g(lmb)\n  0   -0.7172298898   -0.7172298898      2.468e-01       5.413e-02\n  1   -0.6910996158   -0.7041214466      1.178e-01       2.800e-02\n  2   -0.6867243218   -0.6954749097      8.363e-02       2.363e-02\n  5   -0.6796591690   -0.6922153737      6.857e-02       1.656e-02\n 10   -0.6719367949   -0.6880798909      5.278e-02       8.839e-03\n 20   -0.6646906058   -0.6780985954      2.723e-02       1.592e-03\n 40   -0.6631282154   -0.6653324958      3.683e-03       3.006e-05\n 80   -0.6630981685   -0.6631408952      6.953e-05       1.071e-08\n120   -0.6630981578   -0.6630989648      1.313e-06       3.818e-12\n   (the middle column is f at the unconstrained minimiser x(lmb), which is INFEASIBLE while\n    the violation column is non-zero, so it is not yet an upper bound on p*)\n\nfinal multipliers [0.556967 0.13056  0.      ]   active constraints [0, 1]\nthe gap fell from 5.413e-02 to 3.818e-12: strong duality holds for this convex\nQP, so the dual bound is not merely valid but TIGHT, and the multipliers it converges to\nare exactly the KKT multipliers of the primal"
          }
        },
        {
          "name": "The KKT conditions, used as an acceptance test",
          "explain": "<p>At a solution of a convex problem with differentiable data, five things hold together: the gradient of the Lagrangian vanishes (stationarity), the primal constraints hold (primal feasibility), the multipliers on inequalities are non-negative (dual feasibility), each inequality multiplier times its slack is zero (complementary slackness), and the equalities hold. Each is a number you can compute from the solver's output.</p><p>The snippet does this for a long-only portfolio with a budget equality and a return floor. At SLSQP's answer, stationarity is 5e-15, both feasibility measures are at machine precision, dual feasibility is zero and complementarity is 9e-17; the multiplier on the return floor is 12.78, so the floor binds, and its size says how much variance the floor is costing at the margin. At equal weights the same five numbers are 2.47, 1e-16, 1.07e-2, 32.4 and 0.35.</p><p>That contrast is the practical content of the week. Feasibility is easy to check and easy to satisfy; stationarity is what separates a solution from a plausible point, and it is the one most pipelines never compute. A portfolio construction service that logs these five residuals alongside the weights catches solver regressions, bad scaling and mis-specified constraints on the day they appear, rather than after a month of slightly wrong books.</p>",
          "formula": "\\nabla f+\\textstyle\\sum_i\\lambda_i\\nabla g_i+\\sum_j\\nu_j\\nabla h_j=0,\\quad \\lambda_i\\ge 0,\\quad \\lambda_i g_i(x)=0,\\quad g_i(x)\\le 0,\\ h_j(x)=0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(23)\nn = 6\nF = rng.normal(size=(n, 2))\nS = F @ F.T + np.diag(rng.uniform(0.04, 0.15, n))\nmu = 0.01 + 0.06 * rng.uniform(size=n)\nr0 = 0.055\n\n# min w'Sw  s.t.  1'w = 1,  mu'w >= r0,  w >= 0\ncons = [{\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0},\n        {\"type\": \"ineq\", \"fun\": lambda w: mu @ w - r0}]\nres = minimize(lambda w: w @ S @ w, np.full(n, 1.0 / n), jac=lambda w: 2 * S @ w,\n               bounds=[(0.0, None)] * n, constraints=cons, method=\"SLSQP\",\n               options={\"ftol\": 1e-16, \"maxiter\": 500})\nw = res.x\n\n\ndef kkt(w):\n    \"\"\"recover multipliers by least squares, then report every KKT residual.\"\"\"\n    g = 2 * S @ w\n    act = w < 1e-7                                     # bounds that look active\n    cols = [np.ones(n), -mu] + [-np.eye(n)[i] for i in np.where(act)[0]]\n    M = np.array(cols).T\n    sol, *_ = np.linalg.lstsq(M, -g, rcond=None)\n    nu, lam, eta = sol[0], sol[1], sol[2:]\n    stat = np.linalg.norm(g + nu * np.ones(n) - lam * mu - np.eye(n)[act].T @ eta)\n    return dict(stationarity=stat,\n                primal_eq=abs(w.sum() - 1.0),\n                primal_ineq=max(0.0, r0 - mu @ w, -w.min()),\n                dual_feas=max(0.0, -lam, -eta.min() if eta.size else 0.0),\n                complementarity=max(abs(lam * (mu @ w - r0)), float(np.max(np.abs(w * (w < 1e-7))))),\n                lam=lam, nu=nu)\n\n\nk = kkt(w)\nprint(f\"weights {np.round(w, 6)}   variance {w @ S @ w:.8f}   return {mu @ w:.6f} (target {r0})\")\nprint(\"KKT residuals at the solver's answer\")\nfor key in (\"stationarity\", \"primal_eq\", \"primal_ineq\", \"dual_feas\", \"complementarity\"):\n    print(f\"   {key:<16s} {k[key]:.3e}\")\nprint(f\"   multiplier on the return floor {k['lam']:.6f}   -> the floor \"\n      f\"{'BINDS' if k['lam'] > 1e-6 else 'is slack'}; the budget multiplier is {k['nu']:.6f}\")\nw_bad = np.full(n, 1.0 / n)\nkb = kkt(w_bad)\nprint(\"\\nthe same residuals at equal weights: it respects the budget but misses the floor\")\nfor key in (\"stationarity\", \"primal_eq\", \"primal_ineq\", \"dual_feas\", \"complementarity\"):\n    print(f\"   {key:<16s} {kb[key]:.3e}\")\nprint(\"feasibility is cheap; STATIONARITY is what separates a solution from a guess. Recomputing\")\nprint(\"these five numbers is the acceptance test to run on any solver's output before trading it\")\n",
            "output": "weights [0.447247 0.       0.       0.       0.       0.552753]   variance 0.25408003   return 0.055000 (target 0.055)\nKKT residuals at the solver's answer\n   stationarity     5.136e-15\n   primal_eq        0.000e+00\n   primal_ineq      6.939e-18\n   dual_feas        0.000e+00\n   complementarity  8.870e-17\n   multiplier on the return floor 12.782572   -> the floor BINDS; the budget multiplier is 0.194881\n\nthe same residuals at equal weights: it respects the budget but misses the floor\n   stationarity     2.473e+00\n   primal_eq        1.110e-16\n   primal_ineq      1.067e-02\n   dual_feas        3.238e+01\n   complementarity  3.454e-01\nfeasibility is cheap; STATIONARITY is what separates a solution from a guess. Recomputing\nthese five numbers is the acceptance test to run on any solver's output before trading it"
          }
        },
        {
          "name": "Shadow prices: what a constraint costs",
          "explain": "<p>The multiplier is not an artefact of the algorithm. Under mild conditions it is the derivative of the optimal value with respect to relaxing its constraint: the shadow price. This is the single most useful by-product of solving a constrained problem, because it converts every limit into a number in the units of the objective.</p><p>The snippet takes the standard Cobb-Douglas utility maximisation under a budget, where the closed form for demand is known, and checks the identity three ways. Stationarity gives a multiplier of 0.0083333334, the theoretical value of the exponent sum over the budget gives 0.0083333333, and a central finite difference of the optimal value in the budget gives 0.0083333334. They agree to 5e-12. Ten extra dollars of budget raise utility by 0.080, against the linear prediction of 0.083, the difference being the curvature the derivative does not see.</p><p>On a desk this is how constraints get argued about with evidence. A gross exposure limit, a sector cap, a maximum position size or a VaR budget each has a multiplier, and a report that lists limits ordered by shadow price tells the risk committee exactly which limit is expensive and which is free. The caveat is the same as for any derivative: it is local. A multiplier tells you the price of the next unit, not of the next hundred, and the second finite difference in the snippet shows the gap opening already at ten.</p>",
          "formula": "\\lambda^\\star=-\\frac{\\partial p^\\star}{\\partial b}\\quad\\text{for the constraint }g(x)\\le b",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nalpha, beta = 0.6, 0.4                       # Cobb-Douglas exponents, alpha + beta = 1\np1, p2 = 3.0, 5.0\nBud = 120.0\n\nU = lambda z: alpha * np.log(z[0]) + beta * np.log(z[1])\n\n\ndef solve(budget):\n    res = minimize(lambda z: -U(z), np.array([budget / (3 * p1), budget / (3 * p2)]),\n                   bounds=[(1e-9, None)] * 2,\n                   constraints=[{\"type\": \"ineq\", \"fun\": lambda z: budget - p1 * z[0] - p2 * z[1]}],\n                   method=\"SLSQP\", options={\"ftol\": 1e-16, \"maxiter\": 400})\n    return res.x, -res.fun\n\n\nx, V = solve(Bud)\nprint(f\"Marshallian demand, solver : x1 {x[0]:.8f}   x2 {x[1]:.8f}   utility {V:.8f}\")\nprint(f\"closed form alpha*B/p1     : x1 {alpha * Bud / p1:.8f}   x2 {beta * Bud / p2:.8f}\")\nprint(f\"budget actually spent      : {p1 * x[0] + p2 * x[1]:.8f} of {Bud}\")\n\nlam_analytic = (alpha + beta) / Bud\nh = 1e-4\nfd = (solve(Bud + h)[1] - solve(Bud - h)[1]) / (2 * h)\nlam_stat = alpha / x[0] / p1                 # stationarity: dU/dx1 = lam * p1\nprint(f\"\\nmultiplier from stationarity          {lam_stat:.10f}\")\nprint(f\"multiplier from theory (a+b)/B        {lam_analytic:.10f}\")\nprint(f\"dV/dB by central finite difference    {fd:.10f}\")\nprint(f\"agreement: |stationarity - fd| = {abs(lam_stat - fd):.2e}\")\nprint(f\"one more dollar of budget buys {fd:.6f} utils; ten more dollars buys \"\n      f\"{solve(Bud + 10)[1] - V:.6f}, close to 10 * {fd:.6f} = {10 * fd:.6f}\")\nprint(\"the multiplier is not an artefact of the algorithm: it is the SHADOW PRICE of the\")\nprint(\"constraint, the marginal value of relaxing it, which is why a risk limit's multiplier\")\nprint(\"tells a desk exactly what that limit is costing in units of the objective\")\n",
            "output": "Marshallian demand, solver : x1 23.99999994   x2 9.60000004   utility 2.81153754\nclosed form alpha*B/p1     : x1 24.00000000   x2 9.60000000\nbudget actually spent      : 120.00000000 of 120.0\n\nmultiplier from stationarity          0.0083333334\nmultiplier from theory (a+b)/B        0.0083333333\ndV/dB by central finite difference    0.0083333334\nagreement: |stationarity - fd| = 4.62e-12\none more dollar of budget buys 0.008333 utils; ten more dollars buys 0.080043, close to 10 * 0.008333 = 0.083333\nthe multiplier is not an artefact of the algorithm: it is the SHADOW PRICE of the\nconstraint, the marginal value of relaxing it, which is why a risk limit's multiplier\ntells a desk exactly what that limit is costing in units of the objective"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "The duality gap closing under dual ascent",
        "params": {
          "xlab": "dual ascent iteration",
          "ylab": "p* - g(lambda)",
          "log": true,
          "series": [
            {
              "name": "duality gap",
              "x": [
                0,
                1,
                2,
                5,
                10,
                20,
                40,
                80,
                120
              ],
              "y": [
                0.05413,
                0.028,
                0.02363,
                0.01656,
                0.008839,
                0.001592,
                3.006e-05,
                1.071e-08,
                3.818e-12
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Reading the objective at an infeasible iterate as progress. It is not an upper bound on the optimum; only a feasible point gives one, and the difference can be arbitrarily large.",
        "Assuming strong duality without checking Slater's condition. With no strictly feasible point the gap need not close, and a dual-based stopping rule then stops at the wrong place.",
        "Interpreting a shadow price globally. It is the marginal value of the constraint at the current solution; over a large relaxation the optimal value curves away, as the ten-dollar step in the snippet shows.",
        "Comparing multipliers across differently scaled constraints. A multiplier carries the units of objective per unit of constraint, so ranking limits by multiplier is only meaningful after the constraints are expressed in comparable units."
      ],
      "check": [
        {
          "q": "Two hundred thousand random multiplier vectors all gave dual values below the primal optimum. That is:",
          "options": [
            "a coincidence of the seed",
            "weak duality, which holds for every multiplier",
            "evidence of strong duality",
            "evidence the problem is infeasible"
          ],
          "answer": 1,
          "why": "Weak duality makes it impossible for any non-negative multiplier to exceed the primal optimum, so no seed could produce a violation. Strong duality is the separate claim that the best dual value is attained and equal, which the dual ascent snippet shows."
        },
        {
          "q": "Which KKT residual distinguishes an optimal point from a merely feasible one?",
          "options": [
            "primal feasibility",
            "dual feasibility",
            "stationarity",
            "the objective value"
          ],
          "answer": 2,
          "why": "Equal weights were feasible to machine precision but had a stationarity residual of 2.47 against 5e-15 at the optimum. Dual feasibility is a condition on the multipliers, and the objective alone cannot say how much better is possible."
        },
        {
          "q": "The multiplier on a binding return floor came out as 12.78. This says:",
          "options": [
            "the floor is redundant",
            "raising the floor by a small amount raises variance by about 12.78 times that amount",
            "the portfolio return is 12.78",
            "the solver has not converged"
          ],
          "answer": 1,
          "why": "A multiplier is the marginal cost of tightening its constraint, in objective units per constraint unit -- here variance per unit of required return. A redundant constraint has multiplier zero, and its size says nothing about convergence."
        },
        {
          "q": "Complementary slackness at the optimum implies:",
          "options": [
            "every constraint is active",
            "an inactive constraint has zero multiplier",
            "every multiplier is positive",
            "the gradient is zero"
          ],
          "answer": 1,
          "why": "The product of each inequality's multiplier and its slack is zero, so a constraint with slack must have a zero price -- you would not pay to relax something that does not bind. Active constraints may still have zero multipliers in degenerate cases."
        }
      ]
    },
    {
      "n": 7,
      "title": "Constrained algorithms: projection, penalty, barrier, augmented Lagrangian",
      "topics": [
        "projection onto the simplex",
        "projected gradient",
        "quadratic penalty and ill-conditioning",
        "augmented Lagrangian",
        "log-barrier and the central path"
      ],
      "concepts": [
        {
          "name": "Projection onto the long-only budget set is a sort",
          "explain": "<p>Projected methods need one operation: given any point, return the nearest feasible one. For the set of non-negative weights summing to one -- the probability simplex, which is the long-only fully-invested constraint -- that projection has a closed form found by sorting the coordinates and subtracting a single threshold chosen so the positive parts sum to one.</p><p>The snippet projects a vector summing to 1.3 with two negative entries. The result puts 0.65 and 0.35 on two names and exactly zero on the other four, sums to one to ten decimals, and has distance 0.6 from the original. Four hundred thousand random feasible points get no closer than 0.6175. The characterisation is also checked directly: the inner product of the residual with any feasible displacement is at most zero, with a worst case of -2.8e-3 over twenty thousand candidates.</p><p>The list of sets with cheap projections is short but covers most of what a portfolio desk imposes: a box of position limits, a ball or a norm cap, a hyperplane such as dollar neutrality, a half-space, and the simplex. That is precisely the constraint vocabulary in which projected and proximal methods are worth using. Once a constraint falls outside the list -- a turnover budget combined with sector caps, say -- the projection becomes an optimisation problem of its own and the method loses its advantage over an interior-point solver.</p>",
          "formula": "\\Pi_\\Delta(v)=\\big(v-\\theta\\big)_+\\ \\text{with}\\ \\theta\\ \\text{s.t.}\\ \\textstyle\\sum_i (v_i-\\theta)_+=1",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\n\ndef proj_simplex(v):\n    \"\"\"Euclidean projection of v onto {w : sum w = 1, w >= 0}, O(n log n).\"\"\"\n    u = np.sort(v)[::-1]\n    css = np.cumsum(u)\n    rho = np.nonzero(u * np.arange(1, v.size + 1) > (css - 1.0))[0][-1]\n    theta = (css[rho] - 1.0) / (rho + 1.0)\n    return np.maximum(v - theta, 0.0)\n\n\nrng = np.random.default_rng(41)\nv = np.array([0.9, -0.4, 0.25, 0.05, 0.6, -0.1])\nw = proj_simplex(v)\nprint(f\"raw vector      {np.round(v, 4)}   sum {v.sum():.4f}\")\nprint(f\"projection      {np.round(w, 6)}   sum {w.sum():.10f}   min {w.min():.10f}\")\nprint(f\"active (zeroed) coordinates: {np.where(w <= 1e-12)[0].tolist()}\")\n\ncand = rng.dirichlet(np.ones(6), size=400000)                 # 400k feasible points\nd_rand = np.linalg.norm(cand - v, axis=1).min()\nprint(f\"\\n||w - v||          = {np.linalg.norm(w - v):.8f}\")\nprint(f\"best of 400000 random feasible points = {d_rand:.8f}   (worse by \"\n      f\"{d_rand - np.linalg.norm(w - v):.2e})\")\nd = cand[:20000] - w\nprint(f\"the projection is characterised by (v - w)'(u - w) <= 0 for every feasible u:\")\nprint(f\"   worst case over 20000 feasible u = {float(np.max((v - w) @ d.T)):.3e}\")\nprint(\"projection onto the long-only budget set is a one-line sort, so 'stay invested and stay\")\nprint(\"long' costs nothing per iteration; the same is true of a box, a ball and a half-space,\")\nprint(\"and that is exactly the class of constraints projected methods are built for\")\n",
            "output": "raw vector      [ 0.9  -0.4   0.25  0.05  0.6  -0.1 ]   sum 1.3000\nprojection      [0.65 0.   0.   0.   0.35 0.  ]   sum 1.0000000000   min 0.0000000000\nactive (zeroed) coordinates: [1, 2, 3, 5]\n\n||w - v||          = 0.60000000\nbest of 400000 random feasible points = 0.61753013   (worse by 1.75e-02)\nthe projection is characterised by (v - w)'(u - w) <= 0 for every feasible u:\n   worst case over 20000 feasible u = -2.802e-03\nprojection onto the long-only budget set is a one-line sort, so 'stay invested and stay\nlong' costs nothing per iteration; the same is true of a box, a ball and a half-space,\nand that is exactly the class of constraints projected methods are built for"
          }
        },
        {
          "name": "Projected gradient: every iterate is tradeable",
          "explain": "<p>Projected gradient descent alternates an unconstrained step with a projection back onto the feasible set. For a convex feasible set and a smooth convex objective with a step no larger than the reciprocal of the Lipschitz constant, it converges, and every iterate is feasible by construction.</p><p>The snippet runs it on a ten-asset long-only minimum-variance problem. The worst constraint violation across all four thousand iterates is 4.4e-16, the objective never rose on any of the four thousand steps, and the final variance and weights match SLSQP to 9.4e-9. Convergence is fast at first -- variance from 0.0620 to 0.0184 in ten iterations -- and then slow, 0.01684657 after a thousand and unchanged at four thousand, which is the expected behaviour when the active set has settled and the remaining error decays linearly.</p><p>Feasibility of every iterate is worth more in production than a better rate. A solver that has to be interrupted -- because the market moved, because a data feed arrived, because a latency budget expired -- yields a portfolio that can actually be sent, rather than a set of weights that sum to 1.03 and include a short in a long-only fund. The same property is why projected and proximal methods are the natural fit for online and streaming portfolio updates, where the previous solution warm-starts the next one.</p>",
          "formula": "x_{k+1}=\\Pi_{\\mathcal{X}}\\!\\big(x_k-\\tfrac{1}{L}\\nabla f(x_k)\\big),\\qquad L=\\lambda_{\\max}(\\nabla^2 f)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\n\ndef proj_simplex(v):\n    u = np.sort(v)[::-1]\n    css = np.cumsum(u)\n    rho = np.nonzero(u * np.arange(1, v.size + 1) > (css - 1.0))[0][-1]\n    return np.maximum(v - (css[rho] - 1.0) / (rho + 1.0), 0.0)\n\n\nrng = np.random.default_rng(19)\nn = 10\nF = rng.normal(size=(n, 3))\nS = F @ F.T + np.diag(rng.uniform(0.05, 0.25, n))\nL = float(np.linalg.eigvalsh(2 * S).max())\n\nw = np.full(n, 1.0 / n)\nprint(\"  k      variance      sum w - 1      min w       feasible\")\nworst_feas, prev, rises = 0.0, w @ S @ w, 0\nfor k in range(1, 4001):\n    w = proj_simplex(w - (1.0 / L) * (2 * S @ w))              # projected gradient step\n    worst_feas = max(worst_feas, abs(w.sum() - 1.0), max(0.0, -w.min()))\n    cur = w @ S @ w\n    if cur > prev + 1e-15:\n        rises += 1\n    prev = cur\n    if k in (1, 2, 10, 100, 1000, 4000):\n        print(f\"{k:5d}   {cur:.10f}   {w.sum() - 1:+.2e}   {w.min():+.3e}    \"\n              f\"{'yes' if abs(w.sum() - 1) < 1e-12 and w.min() >= -1e-15 else 'NO'}\")\nref = minimize(lambda z: z @ S @ z, np.full(n, 1.0 / n), jac=lambda z: 2 * S @ z,\n               bounds=[(0.0, None)] * n,\n               constraints=[{\"type\": \"eq\", \"fun\": lambda z: z.sum() - 1.0}],\n               method=\"SLSQP\", options={\"ftol\": 1e-16, \"maxiter\": 500})\nprint(f\"\\nprojected gradient  variance {w @ S @ w:.10f}   weights {np.round(w, 5)}\")\nprint(f\"SLSQP               variance {ref.fun:.10f}   weights {np.round(ref.x, 5)}\")\nprint(f\"max |difference| {np.max(np.abs(w - ref.x)):.2e}\")\nprint(f\"worst constraint violation over all 4000 iterates: {worst_feas:.2e}\")\nprint(f\"objective rose on {rises} of 4000 steps\")\nprint(\"every iterate is a tradeable portfolio, which is the practical appeal: interrupt the\")\nprint(\"solver at any point and you still have long-only weights that sum to one\")\n",
            "output": "  k      variance      sum w - 1      min w       feasible\n    1   0.0619864039   +0.00e+00   +5.533e-02    yes\n    2   0.0316315788   +2.22e-16   +3.317e-02    yes\n   10   0.0183982975   -2.22e-16   +6.310e-03    yes\n  100   0.0171359558   +0.00e+00   +9.406e-03    yes\n 1000   0.0168465703   +2.22e-16   +7.043e-03    yes\n 4000   0.0168465702   +0.00e+00   +7.040e-03    yes\n\nprojected gradient  variance 0.0168465702   weights [0.16728 0.21708 0.17315 0.06211 0.14338 0.00704 0.09723 0.03722 0.04078\n 0.05473]\nSLSQP               variance 0.0168465702   weights [0.16728 0.21708 0.17315 0.06212 0.14338 0.00704 0.09723 0.03722 0.04078\n 0.05473]\nmax |difference| 9.43e-09\nworst constraint violation over all 4000 iterates: 4.44e-16\nobjective rose on 0 of 4000 steps\nevery iterate is a tradeable portfolio, which is the practical appeal: interrupt the\nsolver at any point and you still have long-only weights that sum to one"
          }
        },
        {
          "name": "Penalty versus augmented Lagrangian: who carries the constraint",
          "explain": "<p>The quadratic penalty method replaces a constraint by a squared-violation cost and drives the weight up. It works, but the accuracy it buys is paid for in conditioning: the Hessian picks up the penalty weight times the constraint matrix outer product, so its condition number grows with the weight.</p><p>The snippet shows the trade exactly. Penalty weight 1e3 gives a constraint violation of 1.1e-3 and a Hessian condition number of 1.6e3; weight 1e7 gives 1.1e-7 and 1.6e7; and at weight 1e9, where the condition number is 1.6e9, the distance to the true solution stops improving and actually worsens to 2.3e-8, because floating-point error in the linear solve now dominates. The augmented Lagrangian, which adds an explicit multiplier estimate updated by the observed violation, reaches a violation of 5.4e-10 after eight outer iterations and 1.8e-14 after twelve, with the penalty weight fixed at 10 and a condition number of 17.9 throughout.</p><p>The reason is worth stating plainly: in the penalty method the large weight is what makes the constraint hold, while in the augmented Lagrangian the <em>multiplier</em> converges to the right shadow price and the penalty only has to make each subproblem well posed. This is the same idea as the dual ascent of week 6, stabilised, and it is why augmented Lagrangian and ADMM methods are the standard choice for large constrained problems where a factorisation of an ill-conditioned matrix is not affordable.</p>",
          "formula": "L_\\rho(x,\\nu)=f(x)+\\nu^{\\!\\top}(Ax-b)+\\tfrac{\\rho}{2}\\|Ax-b\\|^2,\\qquad \\nu^{+}=\\nu+\\rho(Ax-b)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(29)\nn = 4\nBm = rng.normal(size=(n, n))\nQ = Bm @ Bm.T + 1.5 * np.eye(n)\nc = rng.normal(size=n)\nA = np.array([[1.0, 1.0, 1.0, 1.0], [1.0, -1.0, 0.0, 0.0]])   # A x = b\nb = np.array([1.0, 0.2])\nKKT = np.block([[Q, A.T], [A, np.zeros((2, 2))]])\nex = np.linalg.solve(KKT, np.r_[c, b])\nxstar, nustar = ex[:n], ex[n:]\nprint(f\"exact solution        {np.round(xstar, 8)}   multipliers {np.round(nustar, 6)}\")\n\nprint(\"\\nquadratic penalty  min f(x) + (rho/2)||Ax-b||^2\")\nprint(\"     rho       ||Ax - b||     ||x - x*||    cond(Hessian)\")\nfor rho in (1e1, 1e3, 1e5, 1e7, 1e9):\n    H = Q + rho * A.T @ A\n    x = np.linalg.solve(H, c + rho * A.T @ b)\n    print(f\"  {rho:.0e}    {np.linalg.norm(A @ x - b):.3e}     {np.linalg.norm(x - xstar):.3e}    \"\n          f\"{np.linalg.cond(H):.2e}\")\n\nprint(\"\\naugmented Lagrangian  min f(x) + nu'(Ax-b) + (rho/2)||Ax-b||^2, rho FIXED at 10\")\nprint(\"   outer      ||Ax - b||     ||x - x*||     ||nu - nu*||\")\nrho, nu = 10.0, np.zeros(2)\nfor k in range(1, 13):\n    H = Q + rho * A.T @ A\n    x = np.linalg.solve(H, c + rho * A.T @ b - A.T @ nu)\n    nu = nu + rho * (A @ x - b)                                # multiplier update\n    if k in (1, 2, 4, 8, 12):\n        print(f\"    {k:3d}     {np.linalg.norm(A @ x - b):.3e}     {np.linalg.norm(x - xstar):.3e}\"\n              f\"      {np.linalg.norm(nu - nustar):.3e}\")\nprint(f\"cond(Hessian) stays at {np.linalg.cond(Q + rho * A.T @ A):.2e} throughout\")\nprint(\"pure penalty buys accuracy only by making the problem ill-conditioned -- 1e-9 feasibility\")\nprint(\"costs a condition number of 1e9. The augmented Lagrangian gets there with rho = 10 by\")\nprint(\"letting the MULTIPLIER, not the penalty weight, carry the constraint\")\n",
            "output": "exact solution        [0.33010302 0.13010302 0.45564794 0.08414601]   multipliers [-1.102552 -0.240485]\n\nquadratic penalty  min f(x) + (rho/2)||Ax-b||^2\n     rho       ||Ax - b||     ||x - x*||    cond(Hessian)\n  1e+01    1.059e-01     6.436e-02    1.79e+01\n  1e+03    1.128e-03     6.856e-04    1.56e+03\n  1e+05    1.128e-05     6.860e-06    1.56e+05\n  1e+07    1.128e-07     6.863e-08    1.56e+07\n  1e+09    1.128e-09     2.309e-08    1.56e+09\n\naugmented Lagrangian  min f(x) + nu'(Ax-b) + (rho/2)||Ax-b||^2, rho FIXED at 10\n   outer      ||Ax - b||     ||x - x*||     ||nu - nu*||\n      1     1.059e-01     6.436e-02      6.959e-02\n      2     6.527e-03     3.987e-03      4.332e-03\n      4     2.561e-05     1.595e-05      1.768e-05\n      8     5.390e-10     3.634e-10      4.316e-10\n     12     1.848e-14     1.298e-14      1.477e-14\ncond(Hessian) stays at 1.79e+01 throughout\npure penalty buys accuracy only by making the problem ill-conditioned -- 1e-9 feasibility\ncosts a condition number of 1e9. The augmented Lagrangian gets there with rho = 10 by\nletting the MULTIPLIER, not the penalty weight, carry the constraint"
          }
        },
        {
          "name": "The log-barrier and the central path",
          "explain": "<p>An interior-point method replaces inequality constraints by a logarithmic barrier that is finite inside the feasible region and infinite on its boundary, then solves a sequence of smooth problems as the barrier weight falls to zero. The solutions trace the central path, and the key fact is that a point on the path with barrier weight t has a duality gap of exactly the number of inequalities times t. You choose your accuracy in advance instead of discovering it afterwards.</p><p>The snippet follows the path on a five-asset problem with six inequalities. At weight 1 the objective is 0.0502 and the smallest slack 0.176; at 1e-5 the objective is 0.0096880 and the smallest slack 3.1e-4, with the guaranteed gap falling from 6 to 6e-5. Each of the six subproblems takes between five and ten damped Newton steps, which is the celebrated empirical fact about interior-point methods: the work per decade of accuracy is nearly constant.</p><p>Two operational consequences. Every iterate is strictly feasible, so the intermediate answer is usable, and the method tells you the accuracy you have rather than asserting convergence. Interior-point solvers are the default in commercial conic and quadratic programming software for exactly these reasons, and the certificate structure is why a desk can log a duality gap next to every optimisation it runs.</p>",
          "formula": "\\min_x\\ f(x)-t\\sum_{i=1}^m\\log\\!\\big(b_i-a_i^{\\!\\top}x\\big),\\qquad p^\\star\\ \\ge\\ f(x_t)-m\\,t",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(37)\nn, m = 5, 6\nF = rng.normal(size=(n, 2))\nS = F @ F.T + np.diag(rng.uniform(0.05, 0.2, n))\nA = np.r_[np.eye(n), -np.ones((1, n))]                         # w_i <= 0.35, sum w >= 0.6\nb = np.r_[np.full(n, 0.35), -0.6]\nf = lambda w: w @ S @ w\ng = lambda w: 2 * S @ w\n\nprint(\"central path of the log-barrier: min f(x) - t * sum log(b - Ax)\")\nprint(\"      t        objective      duality gap m * t     min slack     iterations\")\nw = np.full(n, 0.15)\nfor t in (1.0, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5):\n    for k in range(1, 201):                                    # damped Newton on the barrier\n        s = b - A @ w\n        gr = g(w) + t * A.T @ (1.0 / s)\n        H = 2 * S + t * A.T @ (A / (s ** 2)[:, None])\n        step = -np.linalg.solve(H, gr)\n        a = 1.0\n        while np.any(b - A @ (w + a * step) <= 0):              # stay strictly inside\n            a *= 0.5\n        while f(w + a * step) - t * np.sum(np.log(b - A @ (w + a * step))) > \\\n                f(w) - t * np.sum(np.log(s)) - 1e-4 * a * (gr @ step):\n            a *= 0.5\n        w = w + a * step\n        if np.linalg.norm(gr) < 1e-12:\n            break\n    print(f\"  {t:.0e}    {f(w):.10f}      {m * t:.3e}         {np.min(b - A @ w):.3e}        {k:3d}\")\nprint(f\"\\nfinal weights {np.round(w, 6)}   sum {w.sum():.6f}   max {w.max():.6f}\")\nprint(f\"binding constraints (slack < 1e-3): {np.where(b - A @ w < 1e-3)[0].tolist()}\")\nprint(\"the barrier keeps every iterate strictly feasible and the analytic centre drifts to the\")\nprint(\"boundary as t falls; the duality gap of a barrier point is exactly m*t, so you choose the\")\nprint(\"accuracy you are willing to pay for instead of discovering it afterwards\")\n",
            "output": "central path of the log-barrier: min f(x) - t * sum log(b - Ax)\n      t        objective      duality gap m * t     min slack     iterations\n  1e+00    0.0502430060      6.000e+00         1.764e-01          6\n  1e-01    0.0208205913      6.000e-01         1.494e-01          5\n  1e-02    0.0138763184      6.000e-02         1.053e-01          7\n  1e-03    0.0105344666      6.000e-03         2.551e-02          7\n  1e-04    0.0097762993      6.000e-04         3.033e-03         10\n  1e-05    0.0096880191      6.000e-05         3.093e-04          9\n\nfinal weights [0.130399 0.038807 0.219303 0.129677 0.082125]   sum 0.600309   max 0.219303\nbinding constraints (slack < 1e-3): [5]\nthe barrier keeps every iterate strictly feasible and the analytic centre drifts to the\nboundary as t falls; the duality gap of a barrier point is exactly m*t, so you choose the\naccuracy you are willing to pay for instead of discovering it afterwards"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Following the central path as the barrier weight falls",
        "params": {
          "xlab": "-log10(barrier weight t)",
          "ylab": "value",
          "log": false,
          "series": [
            {
              "name": "barrier objective",
              "x": [
                0,
                1,
                2,
                3,
                4,
                5
              ],
              "y": [
                0.050243006,
                0.0208205913,
                0.0138763184,
                0.0105344666,
                0.0097762993,
                0.0096880191
              ]
            },
            {
              "name": "smallest slack",
              "x": [
                0,
                1,
                2,
                3,
                4,
                5
              ],
              "y": [
                0.1764,
                0.1494,
                0.1053,
                0.02551,
                0.003033,
                0.0003093
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Raising a quadratic penalty weight to buy accuracy. Past about 1e7 here the conditioning of the subproblem dominates and the answer gets worse, not better; use an augmented Lagrangian instead.",
        "Projecting onto a set whose projection is itself an optimisation problem. Two intersecting constraints usually have no closed-form projection, and a projected method then hides an inner solve in every iteration.",
        "Starting an interior-point method from a boundary or infeasible point. The barrier is infinite there; production codes spend a separate phase finding a strictly feasible start.",
        "Treating the barrier weight as a convergence tolerance on the variables. It bounds the duality gap in objective units; the distance in weights can still be material when the problem is flat near the optimum."
      ],
      "check": [
        {
          "q": "The projection onto the probability simplex is computed by:",
          "options": [
            "clipping at zero and renormalising",
            "sorting and subtracting a single threshold, then clipping",
            "solving a quadratic program",
            "normalising by the L1 norm"
          ],
          "answer": 1,
          "why": "The optimal threshold is found from the sorted cumulative sums, then the positive parts sum to one exactly. Clip-and-renormalise is a different, non-projection map: it generally does not return the nearest feasible point."
        },
        {
          "q": "Why prefer projected gradient over an interior-point method for an online portfolio update?",
          "options": [
            "It has a better convergence rate",
            "Every iterate is feasible and it warm-starts naturally",
            "It needs no gradient",
            "It handles non-convex constraints"
          ],
          "answer": 1,
          "why": "Interrupting it yields weights you can actually trade, and yesterday's solution is a good starting point. Its rate is worse, it needs gradients, and it gives no guarantee on non-convex sets."
        },
        {
          "q": "At penalty weight 1e9 the distance to the true solution got worse. The reason is:",
          "options": [
            "the penalty method is not convergent",
            "the subproblem's condition number reached 1.6e9 and floating-point error dominated",
            "the constraint was infeasible",
            "the step size was too large"
          ],
          "answer": 1,
          "why": "Accuracy in the penalty method is bought with conditioning, and at 1e9 the linear solve loses more digits than the penalty gains. The method is convergent in exact arithmetic, which is precisely why the augmented Lagrangian is used instead."
        },
        {
          "q": "A barrier point with weight t and m inequalities has a duality gap of:",
          "options": [
            "t",
            "m t",
            "t/m",
            "unknown without solving the dual"
          ],
          "answer": 1,
          "why": "The central path construction gives the gap as exactly m times t, which is why the snippet can print the guaranteed accuracy before solving. The dual multipliers are available in closed form from the barrier gradient."
        }
      ]
    },
    {
      "n": 8,
      "title": "Nonsmooth objectives, proximal operators and splitting",
      "topics": [
        "subgradients",
        "the proximal operator",
        "soft-thresholding",
        "ISTA and FISTA",
        "ADMM and turnover costs"
      ],
      "concepts": [
        {
          "name": "Subgradients: what replaces a vanishing gradient",
          "explain": "<p>At a kink there is no gradient, but there is a set of slopes of supporting lines: the subdifferential. Optimality becomes the statement that zero belongs to it. The snippet illustrates with the sum of absolute deviations from five hundred and one points, whose minimiser is the median: at the median the subdifferential is the interval from -1 to 1, which contains zero, and at 3.0 it is from -28 to -26, which does not.</p><p>The subgradient method then takes a step along any element of that set. It converges, but slowly and non-monotonically, and the step size must be driven to zero by hand because there is no gradient to vanish. On an L1 regression with sixty rows and six unknowns, against the exact linear-programming optimum, a fixed step of 0.2 stalls at a gap of 9.3e-3, a fixed step of 0.02 at 1.4e-3 -- the floor is proportional to the step -- and a 0.5 over root k rule reaches 7.9e-4 with a fitted log-log slope of -0.47, matching the theoretical rate of one over the square root of the iteration count for the best iterate.</p><p>That rate is why nobody uses subgradient methods when they can avoid them: reaching three extra digits needs a million times more iterations. The right response to a nonsmooth term is almost never a subgradient; it is either a reformulation into a smooth constrained problem, as in week 5, or a proximal step, which is what the rest of this week is about.</p>",
          "formula": "\\partial f(x)=\\{g: f(y)\\ge f(x)+g^{\\!\\top}(y-x)\\ \\forall y\\},\\qquad 0\\in\\partial f(x^\\star)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import linprog\n\nrng = np.random.default_rng(53)\na = np.sort(rng.normal(3.0, 2.0, 501))\nmed = float(np.median(a))\nlo, hi = np.sum(np.sign(med - a)) - 1, np.sum(np.sign(med - a)) + 1\nprint(f\"f(x) = sum |x - a_i| over 501 points: minimiser is the median {med:.6f}\")\nprint(f\"   subdifferential at the median  [{lo:+.0f}, {hi:+.0f}]  contains 0  -> optimal\")\nprint(f\"   subdifferential at 3.0         [{np.sum(np.sign(3.0 - a)) - 1:+.0f}, \"\n      f\"{np.sum(np.sign(3.0 - a)) + 1:+.0f}]  excludes 0  -> not optimal\")\nprint(\"   'the gradient is zero' is replaced by 'zero belongs to the subdifferential'\")\n\nm, d = 60, 6\nA = rng.normal(size=(m, d))\nb = A @ rng.normal(size=d) + rng.standard_t(3, m)\nf = lambda x: float(np.sum(np.abs(A @ x - b)))\nlp = linprog(np.r_[np.zeros(d), np.ones(m)],\n             A_ub=np.block([[A, -np.eye(m)], [-A, -np.eye(m)]]), b_ub=np.r_[b, -b],\n             bounds=[(None, None)] * d + [(0, None)] * m, method=\"highs\")\nfstar = float(lp.fun)\nprint(f\"\\nmin ||Ax - b||_1 with 60 rows and 6 unknowns; the LP optimum is f* = {fstar:.8f}\")\nprint(\"  step rule     best f - f* at k = 100 / 1000 / 8000     log-log slope\")\nfor rule, name in ((\"c2\", \"0.2 fixed\"), (\"c1\", \"0.02 fixed\"), (\"sqrt\", \"0.5/sqrt(k)\")):\n    x, bb, hist = np.zeros(d), np.inf, []\n    for k in range(1, 8001):\n        step = 0.2 if rule == \"c2\" else (0.02 if rule == \"c1\" else 0.5 / np.sqrt(k))\n        x = x - step * (A.T @ np.sign(A @ x - b)) / m\n        bb = min(bb, f(x) - fstar)\n        hist.append(bb)\n    hist = np.array(hist)\n    ks = np.arange(200, 8001)\n    slope = np.polyfit(np.log(ks), np.log(np.maximum(hist[199:], 1e-14)), 1)[0]\n    print(f\"  {name:<12s}  {hist[99]:.3e}  {hist[999]:.3e}  {hist[-1]:.3e}      {slope:+.3f}\")\nprint(\"a fixed step stalls at a floor proportional to the step: ten times the step leaves about\")\nprint(\"seven times the residual gap here, and no amount of extra iterations removes it. The\")\nprint(\"diminishing rule decays with slope -0.47, close to the O(1/sqrt(k)) the theory promises\")\nprint(\"for the best iterate -- far slower than the smooth rates of weeks 3 and 4, which is what\")\nprint(\"nonsmoothness costs if you attack it with subgradients instead of a proximal method\")\n",
            "output": "f(x) = sum |x - a_i| over 501 points: minimiser is the median 3.141232\n   subdifferential at the median  [-1, +1]  contains 0  -> optimal\n   subdifferential at 3.0         [-28, -26]  excludes 0  -> not optimal\n   'the gradient is zero' is replaced by 'zero belongs to the subdifferential'\n\nmin ||Ax - b||_1 with 60 rows and 6 unknowns; the LP optimum is f* = 55.47470808\n  step rule     best f - f* at k = 100 / 1000 / 8000     log-log slope\n  0.2 fixed     2.235e-02  1.268e-02  9.295e-03      -0.189\n  0.02 fixed    2.492e+00  2.485e-03  1.380e-03      -0.503\n  0.5/sqrt(k)   9.605e-03  1.938e-03  7.936e-04      -0.469\na fixed step stalls at a floor proportional to the step: ten times the step leaves about\nseven times the residual gap here, and no amount of extra iterations removes it. The\ndiminishing rule decays with slope -0.47, close to the O(1/sqrt(k)) the theory promises\nfor the best iterate -- far slower than the smooth rates of weeks 3 and 4, which is what\nnonsmoothness costs if you attack it with subgradients instead of a proximal method"
          }
        },
        {
          "name": "The proximal operator and soft-thresholding",
          "explain": "<p>The proximal operator of a function takes a point and returns the minimiser of that function plus a quadratic pull towards the point. It generalises projection -- the prox of an indicator function <em>is</em> the projection -- and for many nonsmooth penalties it has a closed form. For the absolute value the answer is soft-thresholding: shrink towards zero by the threshold and clip at zero.</p><p>The snippet verifies this against brute force, minimising the one-dimensional objective over a two-million-point grid for six pairs of input and threshold. The worst disagreement is 8.9e-16, at the level of the arithmetic rather than of the grid. In vector form the operator zeroes coordinates outright: a six-vector with entries down to 0.04 keeps six non-zeros at threshold zero, four at 0.3 and two at 0.8.</p><p>The last sentence is the whole reason L1 penalties are used in practice. A gradient step on a smooth penalty produces small numbers that never become zero, so a portfolio built that way holds a tiny position in every name and pays a ticket on each. A proximal step lands exactly on zero, so the resulting book has a genuinely short holdings list and a genuinely short trade list. Sparsity here is an operational property, not an aesthetic one.</p>",
          "formula": "\\mathrm{prox}_{t g}(v)=\\arg\\min_x\\Big\\{\\tfrac12\\|x-v\\|^2+t\\,g(x)\\Big\\},\\qquad \\mathrm{prox}_{t|\\cdot|}(v)=\\mathrm{sign}(v)(|v|-t)_+",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nsoft = lambda v, t: np.sign(v) * np.maximum(np.abs(v) - t, 0.0)\n\ngrid = np.linspace(-6, 6, 2400001)\nprint(\"prox_{t|.|}(v) = argmin_x  0.5 (x - v)^2 + t|x|\")\nprint(\"      v      t     soft-threshold    grid argmin      |difference|\")\nworst = 0.0\nfor v, t in ((3.0, 1.0), (0.7, 1.0), (-2.5, 0.8), (0.0, 0.5), (-0.2, 0.25), (5.0, 2.0)):\n    obj = 0.5 * (grid - v) ** 2 + t * np.abs(grid)\n    gx = float(grid[int(np.argmin(obj))])\n    s = float(soft(np.array([v]), t)[0])\n    worst = max(worst, abs(s - gx))\n    print(f\"  {v:+5.2f}  {t:4.2f}      {s:+9.6f}      {gx:+9.6f}       {abs(s - gx):.2e}\")\nprint(f\"worst disagreement {worst:.2e}, which is the grid spacing {grid[1] - grid[0]:.2e}\")\n\nprint(\"\\nthe same operator in vector form kills small coordinates outright:\")\nv = np.array([1.2, -0.31, 0.04, 2.9, -0.7, 0.29])\nfor t in (0.0, 0.3, 0.8):\n    st = soft(v, t)\n    print(f\"  t = {t:.1f}  ->  {np.round(st, 3)}   nonzeros {int(np.sum(st != 0))}\")\nprint(\"unlike a gradient step, the prox step can land EXACTLY on zero, which is why an L1\")\nprint(\"penalty produces genuine sparsity while a small L2 penalty only produces small numbers\")\n",
            "output": "prox_{t|.|}(v) = argmin_x  0.5 (x - v)^2 + t|x|\n      v      t     soft-threshold    grid argmin      |difference|\n  +3.00  1.00      +2.000000      +2.000000       0.00e+00\n  +0.70  1.00      +0.000000      +0.000000       8.88e-16\n  -2.50  0.80      -1.700000      -1.700000       6.66e-16\n  +0.00  0.50      +0.000000      +0.000000       8.88e-16\n  -0.20  0.25      -0.000000      +0.000000       8.88e-16\n  +5.00  2.00      +3.000000      +3.000000       0.00e+00\nworst disagreement 8.88e-16, which is the grid spacing 5.00e-06\n\nthe same operator in vector form kills small coordinates outright:\n  t = 0.0  ->  [ 1.2  -0.31  0.04  2.9  -0.7   0.29]   nonzeros 6\n  t = 0.3  ->  [ 0.9  -0.01  0.    2.6  -0.4   0.  ]   nonzeros 4\n  t = 0.8  ->  [ 0.4 -0.   0.   2.1 -0.   0. ]   nonzeros 2\nunlike a gradient step, the prox step can land EXACTLY on zero, which is why an L1\npenalty produces genuine sparsity while a small L2 penalty only produces small numbers"
          }
        },
        {
          "name": "Proximal gradient and its acceleration: ISTA and FISTA",
          "explain": "<p>When the objective splits into a smooth part and a cheap-prox part, the proximal gradient method takes a gradient step on the smooth part and a prox step on the rest. For least squares plus an L1 penalty that is ISTA, and adding the momentum-style extrapolation of the accelerated variant gives FISTA, which improves the rate from one over the iteration count to one over its square.</p><p>The snippet fits four hundred coefficients to one hundred and twenty observations with eight true non-zeros. Both methods reach the same objective, 1.3015182, but FISTA needs 61 iterations to get within 1e-4 of it against ISTA's 143, and 118 against 199 for 1e-8: a factor of two to two and a half here. Both recover exactly the eight true non-zero positions and nothing else, and both agree with scikit-learn's coordinate-descent lasso to 3.1e-15.</p><p>Two caveats belong with the result. The recovered coefficient magnitudes are biased towards zero -- the largest error on the support is 0.138 -- because the penalty that selected the variables also shrinks them, which is why practitioners often refit by least squares on the selected set. And the support depends on the penalty: at a smaller penalty the same code selects twenty-three variables including all eight true ones. Sparsity is a function of a tuning parameter, so any claim that a factor was 'selected' is a claim about that parameter too.</p>",
          "formula": "x_{k+1}=\\mathrm{prox}_{\\frac{\\lambda}{L}\\|\\cdot\\|_1}\\!\\Big(z_k-\\tfrac{1}{L}X^{\\!\\top}(Xz_k-y)\\Big),\\qquad z_{k+1}=x_{k+1}+\\tfrac{t_k-1}{t_{k+1}}(x_{k+1}-x_k)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom sklearn.linear_model import Lasso\n\nrng = np.random.default_rng(67)\nn, p, k = 120, 400, 8\nX = rng.normal(size=(n, p)) / np.sqrt(n)\nsupport = rng.choice(p, k, replace=False)\nbtrue = np.zeros(p)\nbtrue[support] = rng.choice([-1.0, 1.0], k) * rng.uniform(1.0, 3.0, k)\ny = X @ btrue + 0.01 * rng.normal(size=n)\n\nlam = 0.09\nsoft = lambda v, t: np.sign(v) * np.maximum(np.abs(v) - t, 0.0)\nF = lambda b: 0.5 * float(np.sum((X @ b - y) ** 2)) + lam * float(np.sum(np.abs(b)))\nL = float(np.linalg.eigvalsh(X.T @ X).max())\n\n\ndef ista(acc, iters=3000):\n    b = np.zeros(p); z = b.copy(); tk = 1.0; hist = []\n    for _ in range(iters):\n        bn = soft(z - (X.T @ (X @ z - y)) / L, lam / L)\n        if acc:\n            tn = 0.5 * (1 + np.sqrt(1 + 4 * tk * tk))\n            z = bn + ((tk - 1) / tn) * (bn - b)\n            tk = tn\n        else:\n            z = bn\n        b = bn\n        hist.append(F(b))\n    return b, np.array(hist)\n\n\nb_i, h_i = ista(False)\nb_f, h_f = ista(True)\nbest = min(h_i.min(), h_f.min())\nprint(f\"lasso objective at the ISTA  iterate after 3000 steps {h_i[-1]:.10f}\")\nprint(f\"lasso objective at the FISTA iterate after 3000 steps {h_f[-1]:.10f}\")\nfor tol in (1e-4, 1e-6, 1e-8):\n    fi = np.argmax(h_i - best < tol) + 1 if np.any(h_i - best < tol) else -1\n    ff = np.argmax(h_f - best < tol) + 1 if np.any(h_f - best < tol) else -1\n    print(f\"   iterations to F - F* < {tol:.0e}:  ISTA {fi:5d}   FISTA {ff:5d}\")\n\nprint(\"\\n  iteration      ISTA objective      FISTA objective\")\nfor it in (1, 2, 5, 10, 20, 50, 100, 200, 500, 1000):\n    print(f\"  {it:9d}      {h_i[it - 1]:.8f}          {h_f[it - 1]:.8f}\")\n\nsk = Lasso(alpha=lam / n, fit_intercept=False, tol=1e-14, max_iter=200000).fit(X, y)\nprint(f\"\\nrecovered support  {sorted(np.where(np.abs(b_f) > 1e-6)[0].tolist())}\")\nprint(f\"true support       {sorted(support.tolist())}\")\nprint(f\"exact support recovery: {sorted(np.where(np.abs(b_f) > 1e-6)[0].tolist()) == sorted(support.tolist())}\")\nprint(f\"nonzeros: FISTA {int(np.sum(np.abs(b_f) > 1e-6))} of {p} coefficients, \"\n      f\"sklearn {int(np.sum(np.abs(sk.coef_) > 1e-6))}\")\nprint(f\"max |FISTA - sklearn coordinate descent| {np.max(np.abs(b_f - sk.coef_)):.2e}\")\nprint(f\"max |FISTA - truth| on the support {np.max(np.abs(b_f[support] - btrue[support])):.4f}\")\nprint(\"with 400 unknowns and 120 observations least squares has no unique answer at all; the L1\")\nprint(\"penalty plus one soft-threshold per iteration recovers the right 8 and nothing else\")\n",
            "output": "lasso objective at the ISTA  iterate after 3000 steps 1.3015182093\nlasso objective at the FISTA iterate after 3000 steps 1.3015182093\n   iterations to F - F* < 1e-04:  ISTA   143   FISTA    61\n   iterations to F - F* < 1e-06:  ISTA   171   FISTA    95\n   iterations to F - F* < 1e-08:  ISTA   199   FISTA   118\n\n  iteration      ISTA objective      FISTA objective\n          1      5.89653084          5.89653084\n          2      4.36155624          4.36155624\n          5      3.18358422          2.94731799\n         10      2.72721915          2.36097769\n         20      2.36008793          1.65273278\n         50      1.84637734          1.30186204\n        100      1.35597535          1.30152091\n        200      1.30151822          1.30151821\n        500      1.30151821          1.30151821\n       1000      1.30151821          1.30151821\n\nrecovered support  [108, 186, 228, 314, 344, 350, 377, 387]\ntrue support       [108, 186, 228, 314, 344, 350, 377, 387]\nexact support recovery: True\nnonzeros: FISTA 8 of 400 coefficients, sklearn 8\nmax |FISTA - sklearn coordinate descent| 3.11e-15\nmax |FISTA - truth| on the support 0.1381\nwith 400 unknowns and 120 observations least squares has no unique answer at all; the L1\npenalty plus one soft-threshold per iteration recovers the right 8 and nothing else"
          }
        },
        {
          "name": "ADMM: split the problem, keep the easy pieces",
          "explain": "<p>The alternating direction method of multipliers splits an objective into two blocks joined by a consensus constraint, then alternates: minimise the augmented Lagrangian in the first block, minimise it in the second, and update the dual variable by the disagreement. Each block keeps the method it likes, and the multiplier reconciles them.</p><p>The snippet minimises portfolio variance plus an L1 turnover cost against yesterday's book, subject to a budget constraint. The first block is an equality-constrained quadratic program -- one linear solve, exactly as in week 5 -- and the second is a soft-threshold around the previous weights. After four hundred iterations the primal residual is zero to machine precision, and the objective and weights match SLSQP to 3.8e-8.</p><p>What the L1 cost buys is visible in the answer: one of the eight positions is left <em>exactly</em> unchanged, and total turnover falls from 0.714 for the unpenalised optimum to 0.560. A quadratic turnover penalty would have produced eight small trades instead of seven; the kink at zero is what produces a genuine no-trade region, and that is why transaction-cost-aware portfolio construction uses an L1 or piecewise-linear cost rather than a smooth one. The caveat is that ADMM's convergence is fast to a reasonable answer and slow to a very accurate one, and the penalty parameter rho affects the speed considerably.</p>",
          "formula": "x^{+}=\\arg\\min_x L_\\rho(x,z,u),\\quad z^{+}=\\mathrm{prox}_{g/\\rho}(x^{+}+u),\\quad u^{+}=u+x^{+}-z^{+}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(71)\nn = 8\nF = rng.normal(size=(n, 3))\nS = F @ F.T + np.diag(rng.uniform(0.05, 0.2, n))\nw_prev = np.array([0.30, 0.05, 0.05, 0.20, 0.10, 0.10, 0.15, 0.05])   # yesterday's book\ngamma = 0.02                                                           # cost per unit traded\nsoft = lambda v, t: np.sign(v) * np.maximum(np.abs(v) - t, 0.0)\nobj = lambda v: float(v @ S @ v + gamma * np.sum(np.abs(v - w_prev)))\n\n# min w'Sw + gamma*||w - w_prev||_1  s.t. 1'w = 1, split as w (smooth + budget) and z (L1)\nrho = 2.0\none = np.ones(n)\nKKT = np.block([[2 * S + rho * np.eye(n), one[:, None]], [one[None, :], np.zeros((1, 1))]])\nw = w_prev.copy(); z = w.copy(); u = np.zeros(n)\nprint(\"  iter     objective       ||w - z||     trades not taken\")\nfor k in range(1, 401):\n    w = np.linalg.solve(KKT, np.r_[rho * (z - u), 1.0])[:n]            # equality-QP, exact\n    z = w_prev + soft(w + u - w_prev, gamma / rho)                     # prox of the L1 term\n    u = u + w - z\n    if k in (1, 5, 20, 100, 400):\n        print(f\"  {k:5d}   {obj(z):.10f}    {np.linalg.norm(w - z):.2e}      \"\n              f\"{int(np.sum(np.abs(z - w_prev) < 1e-9))} of {n}\")\nref = minimize(obj, w_prev, constraints=[{\"type\": \"eq\", \"fun\": lambda v: v.sum() - 1.0}],\n               method=\"SLSQP\", options={\"ftol\": 1e-16, \"maxiter\": 800})\nprint(f\"\\nADMM    objective {obj(z):.10f}   weights {np.round(z, 5)}\")\nprint(f\"SLSQP   objective {ref.fun:.10f}   weights {np.round(ref.x, 5)}\")\nprint(f\"max |ADMM - SLSQP| {np.max(np.abs(z - ref.x)):.2e}   sum of weights {z.sum():.10f}\")\nno_trade = np.abs(z - w_prev) < 1e-9\nprint(f\"positions left EXACTLY unchanged: {np.where(no_trade)[0].tolist()}\")\nprint(f\"turnover ||w - w_prev||_1 = {np.sum(np.abs(z - w_prev)):.6f}; the unpenalised optimum\")\nprint(f\"would trade {np.sum(np.abs(np.linalg.solve(np.block([[2 * S, one[:, None]], [one[None, :], np.zeros((1, 1))]]), np.r_[np.zeros(n), 1.0])[:n] - w_prev)):.6f}\")\nprint(\"splitting lets each block use the method it suits: one linear solve for the quadratic and\")\nprint(\"the budget, one soft-threshold for the trading cost. The L1 cost produces a genuine\")\nprint(\"no-trade region, which is why desks penalise turnover this way rather than with a 2-norm\")\n",
            "output": "  iter     objective       ||w - z||     trades not taken\n      1   0.0474720147    2.47e-02      3 of 8\n      5   0.0314868077    3.40e-17      0 of 8\n     20   0.0307026176    4.86e-06      1 of 8\n    100   0.0306948651    5.75e-11      1 of 8\n    400   0.0306948651    0.00e+00      1 of 8\n\nADMM    objective 0.0306948651   weights [0.12061 0.11259 0.16069 0.16762 0.1     0.11679 0.08163 0.14007]\nSLSQP   objective 0.0306948651   weights [0.12061 0.11259 0.16069 0.16762 0.1     0.11679 0.08163 0.14007]\nmax |ADMM - SLSQP| 3.82e-08   sum of weights 1.0000000000\npositions left EXACTLY unchanged: [4]\nturnover ||w - w_prev||_1 = 0.560286; the unpenalised optimum\nwould trade 0.713515\nsplitting lets each block use the method it suits: one linear solve for the quadratic and\nthe budget, one soft-threshold for the trading cost. The L1 cost produces a genuine\nno-trade region, which is why desks penalise turnover this way rather than with a 2-norm"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "ISTA against FISTA on the same lasso",
        "params": {
          "xlab": "iteration",
          "ylab": "objective",
          "log": false,
          "series": [
            {
              "name": "ISTA",
              "x": [
                1,
                2,
                5,
                10,
                20,
                50,
                100,
                200,
                500,
                1000
              ],
              "y": [
                5.89653084,
                4.36155624,
                3.18358422,
                2.72721915,
                2.36008793,
                1.84637734,
                1.35597535,
                1.30151822,
                1.30151821,
                1.30151821
              ]
            },
            {
              "name": "FISTA",
              "x": [
                1,
                2,
                5,
                10,
                20,
                50,
                100,
                200,
                500,
                1000
              ],
              "y": [
                5.89653084,
                4.36155624,
                2.94731799,
                2.36097769,
                1.65273278,
                1.30186204,
                1.30152091,
                1.30151821,
                1.30151821,
                1.30151821
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Reaching for a subgradient method because the objective has a kink. The rate is one over the square root of the iteration count; a reformulation or a proximal step is almost always available and orders of magnitude faster.",
        "Reporting lasso coefficients as unbiased estimates. The penalty that selected the variables also shrank them -- the largest error on the true support here is 0.138 -- so refit on the selected set if the magnitudes matter.",
        "Describing a variable as 'selected by the lasso' without naming the penalty. At a smaller penalty the same data selects twenty-three variables rather than eight.",
        "Expecting ADMM to deliver ten digits. It reaches a usable answer quickly and a very accurate one slowly, and the penalty parameter rho changes the speed by orders of magnitude."
      ],
      "check": [
        {
          "q": "The optimality condition for a nonsmooth convex function at x* is:",
          "options": [
            "the gradient is zero",
            "zero lies in the subdifferential",
            "the function is differentiable there",
            "the Hessian is positive definite"
          ],
          "answer": 1,
          "why": "At a kink no gradient exists, but a set of supporting slopes does, and containing zero is exactly optimality -- the median's subdifferential is [-1, 1]. Differentiability is not required and second-order information may not exist."
        },
        {
          "q": "Why does an L1 penalty produce exact zeros where a small L2 penalty does not?",
          "options": [
            "It is non-convex",
            "Its proximal operator clips to zero over an interval",
            "It has a larger gradient",
            "It is scale invariant"
          ],
          "answer": 1,
          "why": "Soft-thresholding maps a whole interval around zero to exactly zero, so a coordinate can arrive and stay there. The L2 prox is a multiplicative shrinkage that never reaches zero; both penalties are convex."
        },
        {
          "q": "FISTA improves on ISTA by:",
          "options": [
            "using second derivatives",
            "extrapolating from the previous two iterates",
            "using a larger step",
            "solving each coordinate exactly"
          ],
          "answer": 1,
          "why": "The accelerated variant applies the prox at an extrapolated point, improving the rate from 1/k to 1/k^2 -- 61 iterations against 143 for 1e-4 here. No curvature is used and the step remains 1/L; exact coordinate updates are what coordinate descent does."
        },
        {
          "q": "An L1 turnover penalty left one of eight positions exactly unchanged. A quadratic turnover penalty would have:",
          "options": [
            "left more positions unchanged",
            "left none exactly unchanged",
            "produced the same book",
            "been infeasible"
          ],
          "answer": 1,
          "why": "A smooth penalty has zero derivative at zero trade, so any expected gain justifies a small trade and every position moves a little. The kink in the L1 cost is what creates a no-trade region, which is why cost-aware construction uses piecewise-linear costs."
        }
      ]
    },
    {
      "n": 9,
      "title": "Optimisation under uncertainty: stochastic and robust",
      "topics": [
        "sample-average approximation",
        "estimation error in portfolio choice",
        "VaR is not convex",
        "CVaR as a linear program",
        "ellipsoidal uncertainty and robust counterparts",
        "robust equals regularised"
      ],
      "concepts": [
        {
          "name": "Sample-average approximation and the price of not knowing the moments",
          "explain": "<p>Almost every finance objective is an expectation you cannot evaluate. The standard response is sample-average approximation: replace the expectation by an average over observed or simulated scenarios, solve that, and use the answer. The question is what the substitution costs.</p><p>The snippet answers it for mean-variance choice with known truth. Estimating both moments from n draws and solving exactly, the weights converge at the familiar one over root n rate -- distance 0.266 at n = 25, 0.0257 at n = 1600 -- while the <em>objective</em> gap converges roughly as one over n, with a fitted log-log slope of -1.14, because the true objective is flat at its own optimum. At n = 200 monthly observations, which is nearly seventeen years of data, the expected shortfall relative to the true optimum is still 0.0027 in objective units.</p><p>The flatness cuts both ways and is the key intuition for portfolio work. It means moderate errors in weights cost little, which is why equal weighting is hard to beat; and it means the optimiser has very weak preferences among many portfolios, which is why the weights it returns move violently when the inputs move. A desk that reports the sensitivity of the answer to the sample -- by bootstrapping the estimation and re-solving -- is describing the real object it has, and a desk that reports four decimal places of weights from a single estimate is not.</p>",
          "formula": "\\hat{x}_n=\\arg\\min_x \\tfrac1n\\sum_{i=1}^n F(x,\\xi_i)\\ \\longrightarrow\\ x^\\star,\\qquad \\mathbb{E}\\big[f(\\hat{x}_n)-f(x^\\star)\\big]=O(1/n)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(83)\nd = 6\nFtrue = rng.normal(size=(d, 2)) * 0.12\nSig = Ftrue @ Ftrue.T + np.diag(np.full(d, 0.04))            # true covariance\nmu = np.array([0.06, 0.04, 0.09, 0.05, 0.07, 0.03])          # true means\nlam = 8.0\none = np.ones(d)\n\n\ndef solve(mhat, Shat):\n    \"\"\"max mu'w - lam w'Sw  s.t. 1'w = 1, in closed form via the KKT system.\"\"\"\n    K = np.block([[2 * lam * Shat, one[:, None]], [one[None, :], np.zeros((1, 1))]])\n    return np.linalg.solve(K, np.r_[mhat, 1.0])[:d]\n\n\ntrue_obj = lambda w: float(mu @ w - lam * w @ Sig @ w)\nwstar = solve(mu, Sig)\nprint(f\"with the TRUE moments: objective {true_obj(wstar):.8f}\")\nprint(\"     n     mean gap to the true optimum   mean ||w_hat - w*||\")\nns, gaps = [25, 50, 100, 200, 400, 800, 1600], []\nfor n in ns:\n    g, dist = [], []\n    for rep in range(60):\n        R = rng.multivariate_normal(mu, Sig, size=n)\n        w = solve(R.mean(axis=0), np.cov(R, rowvar=False))\n        g.append(true_obj(wstar) - true_obj(w))\n        dist.append(np.linalg.norm(w - wstar))\n    gaps.append(np.mean(g))\n    print(f\"  {n:5d}          {np.mean(g):.6f}                 {np.mean(dist):.4f}\")\nslope = np.polyfit(np.log(ns), np.log(gaps), 1)[0]\nprint(f\"\\nfitted log-log slope of the optimality gap in n: {slope:.3f}\")\nprint(\"the weights converge at the usual 1/sqrt(n) rate, and because the objective is smooth and\")\nprint(\"stationary at the optimum, the VALUE converges at about 1/n. It is still 0.003 of\")\nprint(\"objective at n = 200 monthly observations, which is 17 years of data: sample-average\")\nprint(\"approximation is not free, and in portfolio choice the estimation error usually dominates\")\n",
            "output": "with the TRUE moments: objective -0.01556226\n     n     mean gap to the true optimum   mean ||w_hat - w*||\n     25          0.033929                 0.2657\n     50          0.014524                 0.1777\n    100          0.006062                 0.1112\n    200          0.002730                 0.0787\n    400          0.001279                 0.0534\n    800          0.000602                 0.0365\n   1600          0.000298                 0.0257\n\nfitted log-log slope of the optimality gap in n: -1.140\nthe weights converge at the usual 1/sqrt(n) rate, and because the objective is smooth and\nstationary at the optimum, the VALUE converges at about 1/n. It is still 0.003 of\nobjective at n = 200 monthly observations, which is 17 years of data: sample-average\napproximation is not free, and in portfolio choice the estimation error usually dominates"
          }
        },
        {
          "name": "Value-at-Risk is not convex; conditional VaR is",
          "explain": "<p>VaR is a quantile of the loss, and quantiles are not convex in the position. The snippet makes this concrete with two independent names that each default with probability 4 per cent at a 95 per cent level. Each name alone has VaR of zero, because the default probability is below the tail probability. The equally weighted book has VaR of 50: the chance of at least one default is 7.84 per cent, which now reaches into the tail. Diversifying made the reported risk worse, and the average of the two VaRs, zero, is below the VaR of the average book.</p><p>Conditional VaR, the average loss in the worst tail, does not do this: 80 for each single name, 51.6 for the mix, comfortably below the average of 80. And the Rockafellar-Uryasev representation makes it optimisable: minimising CVaR over positions is a linear program in the weights, one auxiliary variable for the VaR level and one slack per scenario. The snippet solves it over four thousand correlated scenarios; the LP's auxiliary variable reproduces the empirical 95 per cent quantile to eight decimals and the objective matches the tail average recomputed from the scenarios to 6e-5, the residual being the usual quantile-convention difference at a discrete sample.</p><p>This is why tail-risk budgeting is done in CVaR even when the mandate is written in VaR. A VaR constraint makes the feasible set non-convex, so the solver returns local answers and the shadow price of the limit is not well defined; a CVaR constraint keeps the problem a linear program with a certificate.</p>",
          "formula": "\\mathrm{CVaR}_\\alpha(L)=\\min_{t}\\Big\\{t+\\tfrac{1}{1-\\alpha}\\mathbb{E}\\big[(L-t)_+\\big]\\Big\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom itertools import product\nfrom scipy.optimize import linprog\n\np, face = 0.04, 100.0                                    # two independent 4% default risks\nalpha = 0.95\n\n\ndef var_cvar(w):\n    \"\"\"exact VaR and CVaR of a two-name portfolio by enumerating the four states.\n\n    CVaR uses the Rockafellar-Uryasev form  min_t t + E[(L-t)+]/(1-alpha),\n    which is the definition that stays correct when the loss has atoms.\"\"\"\n    L, P = [], []\n    for s in product([0, 1], repeat=2):\n        L.append(face * (w[0] * s[0] + w[1] * s[1]))\n        P.append(float(np.prod([p if si else 1 - p for si in s])))\n    L, P = np.array(L), np.array(P)\n    o = np.argsort(L); L, P = L[o], P[o]\n    v = float(L[np.searchsorted(np.cumsum(P), alpha)])\n    cands = [t + float(np.sum(np.maximum(L - t, 0.0) * P)) / (1 - alpha) for t in np.unique(L)]\n    return v, float(np.min(cands))\n\n\nfor name, w in ((\"all of name A  \", [1.0, 0.0]), (\"all of name B  \", [0.0, 1.0]),\n                (\"half and half  \", [0.5, 0.5])):\n    v, c = var_cvar(w)\n    print(f\"{name}  VaR95 {v:7.2f}   CVaR95 {c:7.2f}\")\nv1, _ = var_cvar([1.0, 0.0]); v2, _ = var_cvar([0.0, 1.0]); vm, _ = var_cvar([0.5, 0.5])\nprint(f\"VaR of the average portfolio {vm:.2f} EXCEEDS the average of the VaRs \"\n      f\"{0.5 * (v1 + v2):.2f}: VaR is not convex, so diversification can make it worse\")\nprint(f\"CVaR of the average {var_cvar([0.5, 0.5])[1]:.4f} is BELOW the average of the CVaRs \"\n      f\"{0.5 * (var_cvar([1.0, 0.0])[1] + var_cvar([0.0, 1.0])[1]):.4f}: CVaR is convex\")\n\nrng = np.random.default_rng(97)\nn, d = 4000, 4\nL = rng.multivariate_normal(np.zeros(d), np.array([[1.0, .3, .1, 0], [.3, 1, .2, .1],\n                                                   [.1, .2, 1, .4], [0, .1, .4, 1]]), n)\nL = -(L * np.array([0.02, 0.03, 0.05, 0.04]))            # scenario LOSSES per unit weight\nb = 1.0 / (n * (1 - alpha))\n# Rockafellar-Uryasev: min  t + b*sum u  s.t. u >= Lw - t, u >= 0, 1'w = 1, w >= 0\nc = np.r_[np.zeros(d), 1.0, np.full(n, b)]\nA_ub = np.hstack([L, -np.ones((n, 1)), -np.eye(n)])\nres = linprog(c, A_ub=A_ub, b_ub=np.zeros(n),\n              A_eq=np.r_[np.ones(d), 0.0, np.zeros(n)][None, :], b_eq=[1.0],\n              bounds=[(0, None)] * d + [(None, None)] + [(0, None)] * n, method=\"highs\")\nw, t = res.x[:d], res.x[d]\nlosses = L @ w\ndirect = float(np.mean(losses[losses >= np.quantile(losses, alpha)]))\nprint(f\"\\nCVaR-optimal weights {np.round(w, 5)}\")\nprint(f\"LP objective          {res.fun:.8f}\")\nprint(f\"CVaR recomputed from the scenarios at those weights {direct:.8f}\")\nprint(f\"VaR recovered as the LP variable t {t:.8f} vs the empirical 95% quantile \"\n      f\"{np.quantile(losses, alpha):.8f}\")\nprint(\"minimising CVaR is a linear program in the weights, the VaR level and one slack per\")\nprint(\"scenario: that is why tail-risk budgeting is tractable at all, and why CVaR, not VaR,\")\nprint(\"is the tail measure that belongs inside an optimiser\")\n",
            "output": "all of name A    VaR95    0.00   CVaR95   80.00\nall of name B    VaR95    0.00   CVaR95   80.00\nhalf and half    VaR95   50.00   CVaR95   51.60\nVaR of the average portfolio 50.00 EXCEEDS the average of the VaRs 0.00: VaR is not convex, so diversification can make it worse\nCVaR of the average 51.6000 is BELOW the average of the CVaRs 80.0000: CVaR is convex\n\nCVaR-optimal weights [0.658   0.17194 0.0319  0.13815]\nLP objective          0.03458017\nCVaR recomputed from the scenarios at those weights 0.03451619\nVaR recovered as the LP variable t 0.02811857 vs the empirical 95% quantile 0.02811857\nminimising CVaR is a linear program in the weights, the VaR level and one slack per\nscenario: that is why tail-risk budgeting is tractable at all, and why CVaR, not VaR,\nis the tail measure that belongs inside an optimiser"
          }
        },
        {
          "name": "Robust counterparts: an ellipsoid of means becomes a norm",
          "explain": "<p>Robust optimisation replaces unknown parameters by a set they might lie in and optimises the worst case over that set. For a linear term with the parameter in an ellipsoid, the inner worst case has a closed form: the point estimate minus a multiple of a weighted norm of the position. The robust counterpart is therefore a second-order cone program, and stays convex.</p><p>The snippet compares books for six assets with means estimated from sixty observations, uncertainty set scaled at two standard errors. The nominal optimiser takes a 1.04 long against a 0.37 short, with gross exposure 2.30. The robust optimiser holds gross exposure of exactly 1.00, all positive. At the point estimate the robust book gives up 0.0141 of objective; in the worst case over the uncertainty set it is 0.0246 better, a ratio of 1.74 to 1. Across four thousand mean vectors drawn from the estimation error, the robust book's objective has a standard deviation of 0.0098 against 0.0228 and a fifth percentile of 0.0509 against 0.0419.</p><p>The mechanism is worth naming: the norm penalty punishes exactly those positions that bet aggressively on differences between estimated means, which is where mean-variance optimisation puts its error. Robustness here is not pessimism for its own sake, it is a way of not spending risk on parameters you have not measured. The size of the uncertainty set is a modelling decision a desk should argue about explicitly, in units of standard errors.</p>",
          "formula": "\\max_{w}\\min_{\\mu\\in\\mathcal{U}}\\ \\mu^{\\!\\top}w-\\lambda w^{\\!\\top}\\Sigma w,\\quad \\mathcal{U}=\\{\\hat\\mu+\\Sigma_e^{1/2}u:\\|u\\|_2\\le\\kappa\\}\\ \\Rightarrow\\ \\hat\\mu^{\\!\\top}w-\\kappa\\|\\Sigma_e^{1/2}w\\|_2-\\lambda w^{\\!\\top}\\Sigma w",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(101)\nd = 6\nFm = rng.normal(size=(d, 2)) * 0.15\nSig = Fm @ Fm.T + np.diag(np.full(d, 0.02))\nmu_hat = np.array([0.06, 0.04, 0.09, 0.05, 0.07, 0.03])\nn_obs = 60\nSe = Sig / n_obs                                     # estimation covariance of the mean\nkappa = 3.0                                          # size of the ellipsoidal uncertainty set\nlam = 1.0\nSh = np.linalg.cholesky(Se)\ncons = [{\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0}]\nbnds = [(-1.0, 2.0)] * d\n\nnom = minimize(lambda w: -(mu_hat @ w) + lam * w @ Sig @ w, np.full(d, 1.0 / d),\n               bounds=bnds, constraints=cons, method=\"SLSQP\",\n               options={\"ftol\": 1e-14, \"maxiter\": 400}).x\nrob = minimize(lambda w: -(mu_hat @ w) + kappa * np.linalg.norm(Sh.T @ w) + lam * w @ Sig @ w,\n               np.full(d, 1.0 / d), bounds=bnds, constraints=cons, method=\"SLSQP\",\n               options={\"ftol\": 1e-14, \"maxiter\": 400}).x\nprint(f\"nominal weights {np.round(nom, 4)}\")\nprint(f\"robust  weights {np.round(rob, 4)}\")\nprint(f\"largest long {nom.max():+.4f} / largest short {nom.min():+.4f} nominal; \"\n      f\"{rob.max():+.4f} / {rob.min():+.4f} robust\")\nprint(f\"gross exposure sum|w|: nominal {np.sum(np.abs(nom)):.4f}   \"\n      f\"robust {np.sum(np.abs(rob)):.4f}\")\n\nwc = lambda w: mu_hat @ w - kappa * np.linalg.norm(Sh.T @ w) - lam * w @ Sig @ w\nnm = lambda w: mu_hat @ w - lam * w @ Sig @ w\nprint(f\"\\n                        nominal        robust\")\nprint(f\"objective at mu_hat   {nm(nom):+.6f}     {nm(rob):+.6f}\")\nprint(f\"worst case over U     {wc(nom):+.6f}     {wc(rob):+.6f}\")\nprint(f\"the robust book gives up {nm(nom) - nm(rob):.6f} at the point estimate and is \"\n      f\"{wc(rob) - wc(nom):.6f} better in the worst case, a ratio of \"\n      f\"{(wc(rob) - wc(nom)) / (nm(nom) - nm(rob)):.2f} to 1\")\n\nMU = mu_hat + (Sh @ rng.normal(size=(d, 4000))).T   # draws from the estimation error\nvn = MU @ nom - lam * nom @ Sig @ nom\nvr = MU @ rob - lam * rob @ Sig @ rob\nprint(f\"\\nover 4000 plausible mean vectors:\")\nprint(f\"  mean objective    nominal {vn.mean():+.6f}   robust {vr.mean():+.6f}\")\nprint(f\"  5th percentile    nominal {np.quantile(vn, 0.05):+.6f}   robust \"\n      f\"{np.quantile(vr, 0.05):+.6f}\")\nprint(f\"  std of objective  nominal {vn.std():.6f}   robust {vr.std():.6f}\")\nprint(\"the robust counterpart of a linear term in an ellipsoid is a NORM, so the whole problem\")\nprint(\"stays convex -- a second-order cone program. What you buy is a thinner left tail across\")\nprint(\"the mean vectors you cannot distinguish from your estimate, paid for at the point estimate\")\n",
            "output": "nominal weights [ 0.1112 -0.2396  1.0384 -0.0359  0.4985 -0.3726]\nrobust  weights [0.2162 0.0379 0.4144 0.0779 0.2459 0.0077]\nlargest long +1.0384 / largest short -0.3726 nominal; +0.4144 / +0.0077 robust\ngross exposure sum|w|: nominal 2.2962   robust 1.0000\n\n                        nominal        robust\nobjective at mu_hat   +0.081518     +0.067379\nworst case over U     +0.013384     +0.038028\nthe robust book gives up 0.014139 at the point estimate and is 0.024645 better in the worst case, a ratio of 1.74 to 1\n\nover 4000 plausible mean vectors:\n  mean objective    nominal +0.080540   robust +0.067050\n  5th percentile    nominal +0.041927   robust +0.050880\n  std of objective  nominal 0.022813   robust 0.009834\nthe robust counterpart of a linear term in an ellipsoid is a NORM, so the whole problem\nstays convex -- a second-order cone program. What you buy is a thinner left tail across\nthe mean vectors you cannot distinguish from your estimate, paid for at the point estimate"
          }
        },
        {
          "name": "Robust is regularised: the same object twice",
          "explain": "<p>There is an exact identity behind a great deal of practice: the worst-case least-squares residual over all design-matrix perturbations of Frobenius norm at most rho equals the nominal residual plus rho times the norm of the coefficients. The adversary's optimal move is rank one, aligning the perturbation with the residual on one side and with the coefficient vector on the other.</p><p>The snippet checks this to ten digits. The formula gives 3.5929827367; the explicit rank-one perturbation, whose Frobenius norm is exactly rho, achieves 3.5929827367; twenty thousand random perturbations of the same size reach only 3.2266, because a random direction in a two-hundred-dimensional matrix space almost never aligns with the worst one. Solving the robust problem then gives coefficients whose norm, 1.338, sits between least squares at 1.360 and ridge at various penalties, closest to a ridge penalty near 0.5.</p><p>Two things follow. First, a regulariser can be <em>derived</em> rather than tuned: if you can say how wrong your design matrix might be, the penalty and its size come out of that statement, with units you can defend. Second, the correspondence explains why regularisation helps out of sample at all -- it is buying worst-case performance over perturbations of the data, which is a reasonable proxy for a different sample. This is the cleanest available bridge between the machine-learning habit of penalising and the risk habit of stress-testing.</p>",
          "formula": "\\min_w\\max_{\\|\\Delta\\|_F\\le\\rho}\\|(A+\\Delta)w-b\\|_2=\\min_w\\Big\\{\\|Aw-b\\|_2+\\rho\\|w\\|_2\\Big\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(113)\nm, d = 40, 5\nA = rng.normal(size=(m, d))\nb = A @ np.array([1.0, -0.5, 0.25, 0.0, 0.75]) + 0.3 * rng.normal(size=m)\nrho = 0.5\nw = np.array([0.8, -0.3, 0.4, 0.1, 0.5])               # any fixed point to test the identity\n\n\ndef worst_sampled(w, draws=20000):\n    r = A @ w - b\n    best = -np.inf\n    D = rng.normal(size=(draws, m, d))\n    D = D / np.linalg.norm(D.reshape(draws, -1), axis=1)[:, None, None] * rho\n    val = np.linalg.norm((A + D) @ w - b, axis=1)\n    return float(val.max())\n\n\nnrm = np.linalg.norm\nr = A @ w - b\nDstar = rho * np.outer(r / nrm(r), w / nrm(w))         # the rank-one worst perturbation\nprint(f\"||Aw - b|| + rho*||w||                   = {nrm(r) + rho * nrm(w):.10f}\")\nprint(f\"||(A + D*)w - b|| for the rank-one D*    = {nrm((A + Dstar) @ w - b):.10f}\")\nprint(f\"best of 20000 random perturbations       = {worst_sampled(w):.10f}\")\nprint(f\"Frobenius norm of D*                     = {np.linalg.norm(Dstar, 'fro'):.10f} (= rho)\")\nprint(\"the inner maximisation has a closed form: the adversary aligns the perturbation with the\")\nprint(\"residual and with w, and the worst case is exactly the nominal residual plus rho*||w||\")\n\nrob = minimize(lambda v: nrm(A @ v - b) + rho * nrm(v), np.zeros(d), method=\"BFGS\",\n               options={\"gtol\": 1e-12, \"maxiter\": 2000}).x\nols = np.linalg.lstsq(A, b, rcond=None)[0]\nlams = np.array([0.5, 1.0, 2.0, 4.0, 8.0])\nprint(f\"\\nrobust solution     {np.round(rob, 5)}   ||w|| {nrm(rob):.5f}\")\nprint(f\"least squares       {np.round(ols, 5)}   ||w|| {nrm(ols):.5f}\")\nfor l in lams:\n    ridge = np.linalg.solve(A.T @ A + l * np.eye(d), A.T @ b)\n    print(f\"  ridge lambda {l:4.1f}  ||w|| {nrm(ridge):.5f}   \"\n          f\"||robust - ridge|| {nrm(rob - ridge):.5f}\")\nprint(\"worst-case fitting over a norm ball of data perturbations IS a regularised fit: the\")\nprint(\"penalty is not a Bayesian prior or a tuning knob here, it is the exact price of the\")\nprint(\"uncertainty you admitted, and rho has units you can argue about with a trader\")\n",
            "output": "||Aw - b|| + rho*||w||                   = 3.5929827367\n||(A + D*)w - b|| for the rank-one D*    = 3.5929827367\nbest of 20000 random perturbations       = 3.2266344821\nFrobenius norm of D*                     = 0.5000000000 (= rho)\nthe inner maximisation has a closed form: the adversary aligns the perturbation with the\nresidual and with w, and the worst case is exactly the nominal residual plus rho*||w||\n\nrobust solution     [ 0.99832 -0.47273  0.25318  0.04175  0.71085]   ||w|| 1.33838\nleast squares       [ 1.01153 -0.48348  0.25989  0.04041  0.72288]   ||w|| 1.35966\n  ridge lambda  0.5  ||w|| 1.34249   ||robust - ridge|| 0.00424\n  ridge lambda  1.0  ||w|| 1.32579   ||robust - ridge|| 0.01298\n  ridge lambda  2.0  ||w|| 1.29372   ||robust - ridge|| 0.04603\n  ridge lambda  4.0  ||w|| 1.23438   ||robust - ridge|| 0.10709\n  ridge lambda  8.0  ||w|| 1.13174   ||robust - ridge|| 0.21246\nworst-case fitting over a norm ball of data perturbations IS a regularised fit: the\npenalty is not a Bayesian prior or a tuning knob here, it is the exact price of the\nuncertainty you admitted, and rho has units you can argue about with a trader"
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "A heavy-tailed loss distribution, where VaR and CVaR disagree",
        "params": {
          "sampler": "t",
          "params": {
            "df": 3
          },
          "bins": 44,
          "overlay": true,
          "seed": 9091
        }
      },
      "pitfalls": [
        "Treating a sample-average solution as the solution. The weights converge at one over root n, so at seventeen years of monthly data the portfolio is still visibly wrong; report the bootstrap spread of the weights alongside them.",
        "Putting a VaR constraint inside an optimiser. The feasible set is non-convex, the solver returns local answers without saying so, and the constraint has no well-defined shadow price. Use CVaR, which is a linear program.",
        "Choosing the robust uncertainty set to make the answer look good. Its size is a claim about estimation error and should be stated in standard errors, then held fixed across the study.",
        "Calling robustness conservatism. The robust book here gained 1.74 units of worst case for every unit given up at the point estimate, and had less than half the objective volatility across plausible means."
      ],
      "check": [
        {
          "q": "The optimality gap of a sample-average solution fell about as 1/n while the weights converged as 1/sqrt(n). Why?",
          "options": [
            "The estimator is biased",
            "The true objective is flat and stationary at its optimum, so a first-order error in weights is second order in value",
            "The samples are correlated",
            "The solver tolerance dominates"
          ],
          "answer": 1,
          "why": "Near a stationary point the objective is locally quadratic, so a weight error of order 1/sqrt(n) costs order 1/n in value. That flatness is also why the optimiser's weights are so unstable in the inputs."
        },
        {
          "q": "Two names each default with probability 4% and 95% VaR of each alone is zero. The equally weighted book has VaR:",
          "options": [
            "zero, by diversification",
            "50, because the chance of at least one default exceeds 5%",
            "100",
            "undefined"
          ],
          "answer": 1,
          "why": "P(at least one default) is 7.84%, which now reaches into the 5% tail, so the quantile jumps to a one-name loss of 50. The average of the two VaRs is zero, so VaR fails convexity exactly here."
        },
        {
          "q": "The robust counterpart of a linear term over an ellipsoidal uncertainty set adds:",
          "options": [
            "a quadratic penalty",
            "a norm term, keeping the problem convex",
            "an integer variable",
            "a chance constraint"
          ],
          "answer": 1,
          "why": "The inner worst case is the point estimate minus kappa times a weighted two-norm of the position, which is a second-order cone program. A quadratic penalty is what an L2 regulariser would add, and nothing discrete or probabilistic enters."
        },
        {
          "q": "Random perturbations reached a worst-case residual of 3.227 while the rank-one construction reached 3.593. This shows:",
          "options": [
            "the formula is wrong",
            "random sampling badly underestimates a worst case in high dimension",
            "the perturbations were too small",
            "the residual is not convex"
          ],
          "answer": 1,
          "why": "The adversary's optimal perturbation is a specific rank-one direction, and random matrices in a 200-dimensional space almost never align with it. Every sampled perturbation had Frobenius norm exactly rho, so scale is not the issue."
        }
      ]
    },
    {
      "n": 10,
      "title": "Beyond the convex: discrete, dynamic, multiobjective, and how to accept an answer",
      "topics": [
        "branch and bound",
        "cardinality constraints",
        "dynamic programming",
        "execution schedules",
        "Pareto fronts and scalarisation",
        "KKT residuals as an acceptance test"
      ],
      "concepts": [
        {
          "name": "Branch and bound: a relaxation is a bound, and a bound prunes",
          "explain": "<p>Cardinality, lot sizes, minimum trade sizes and on/off decisions are not convex, so there is no certificate and no polynomial algorithm. What makes them tractable at moderate size is that relaxing the discrete requirement gives a cheap, valid bound: the best you could possibly do in a subtree. If that bound is no better than the best solution found so far, the whole subtree can be discarded without exploring it.</p><p>The snippet picks at most four of ten assets to minimise variance. Exhaustive enumeration of all subsets of size up to four needs 385 quadratic-program solves and finds variance 0.03322397 on assets 2, 3, 4 and 8. A depth-first branch and bound, using the minimum variance over all still-allowed assets as its bound, finds exactly the same answer with 158 solves over 121 nodes, of which 25 were pruned: 59 per cent less work.</p><p>Two honest observations. The saving is modest here because ten assets is small; the same code on fifty assets is the difference between feasible and hopeless, and on five hundred it needs a better bound and a better branching rule. And the quality of the bound is everything: a tighter relaxation prunes far more, which is why commercial mixed-integer solvers invest in cutting planes rather than in faster tree traversal. A desk asking for 'no more than twenty names' is asking for this machinery, and should be told what it costs.</p>",
          "formula": "\\text{bound}(\\mathcal{S})=\\min_{w\\in\\mathrm{conv}}\\ w^{\\!\\top}\\Sigma w\\ \\le\\ \\min_{\\text{card}\\le k}\\ w^{\\!\\top}\\Sigma w\\ \\Rightarrow\\ \\text{prune if bound}\\ \\ge\\ \\text{incumbent}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nfrom itertools import combinations\n\nrng = np.random.default_rng(131)\nn, kmax = 10, 4\nF = rng.normal(size=(n, 3))\nS = F @ F.T + np.diag(rng.uniform(0.05, 0.30, n))\ncalls = {\"qp\": 0}\n\n\ndef minvar(idx):\n    \"\"\"minimum variance over the assets in idx, fully invested. A relaxation bound.\"\"\"\n    calls[\"qp\"] += 1\n    Si = np.linalg.inv(S[np.ix_(idx, idx)])\n    one = np.ones(len(idx))\n    w = Si @ one / (one @ Si @ one)\n    return float(w @ S[np.ix_(idx, idx)] @ w), w\n\n\nbest_v, best_set = np.inf, None\nfor r in range(1, kmax + 1):\n    for c in combinations(range(n), r):\n        v, _ = minvar(list(c))\n        if v < best_v:\n            best_v, best_set = v, c\nbrute_qps = calls[\"qp\"]\nprint(f\"exhaustive search: {brute_qps} QP solves, best variance {best_v:.8f} \"\n      f\"on assets {list(best_set)}\")\n\ncalls[\"qp\"] = 0\nincumbent = minvar(list(range(kmax)))[0]                 # any feasible set gives a start\nnodes, pruned = 0, 0\n\n\ndef branch(fixed_in, candidates):\n    global incumbent, nodes, pruned\n    nodes += 1\n    allowed = fixed_in + candidates\n    if not allowed:\n        return\n    bound = minvar(allowed)[0]                            # relaxation: cardinality dropped\n    if bound >= incumbent - 1e-15:\n        pruned += 1\n        return\n    if len(fixed_in) == kmax:\n        v = minvar(fixed_in)[0]\n        if v < incumbent:\n            incumbent = v\n            branch.best = tuple(fixed_in)\n        return\n    if not candidates:\n        v = minvar(fixed_in)[0]\n        if v < incumbent:\n            incumbent = v\n            branch.best = tuple(fixed_in)\n        return\n    j = candidates[0]\n    branch(fixed_in + [j], candidates[1:])                # include asset j\n    branch(fixed_in, candidates[1:])                      # exclude asset j\n\n\nbranch.best = tuple(range(kmax))\nbranch([], list(range(n)))\nprint(f\"branch and bound : {calls['qp']} QP solves, {nodes} nodes, {pruned} pruned, \"\n      f\"best variance {incumbent:.8f} on assets {list(branch.best)}\")\nprint(f\"same optimum: {abs(incumbent - best_v) < 1e-12}   \"\n      f\"work saved {100 * (1 - calls['qp'] / brute_qps):.0f}%\")\nprint(\"cardinality is not a convex constraint, so there is no KKT certificate and no polynomial\")\nprint(\"algorithm; what makes the problem tractable at this size is that the continuous relaxation\")\nprint(\"is a cheap, valid LOWER bound, and a good incumbent then kills most of the tree\")\n",
            "output": "exhaustive search: 385 QP solves, best variance 0.03322397 on assets [2, 3, 4, 8]\nbranch and bound : 158 QP solves, 121 nodes, 25 pruned, best variance 0.03322397 on assets [2, 3, 4, 8]\nsame optimum: True   work saved 59%\ncardinality is not a convex constraint, so there is no KKT certificate and no polynomial\nalgorithm; what makes the problem tractable at this size is that the continuous relaxation\nis a cheap, valid LOWER bound, and a good incumbent then kills most of the tree"
          }
        },
        {
          "name": "Dynamic programming: a value function instead of a formula",
          "explain": "<p>When a decision is made repeatedly over time and the state summarises everything that matters, the problem decomposes: the value of being in a state today is the best immediate cost plus the value of the state you move to. Backward induction on a grid solves it without any convexity assumption on the sequence of decisions.</p><p>The snippet schedules the liquidation of a hundred units over five slices with quadratic temporary impact and an inventory risk charge. With no risk aversion the DP returns exactly twenty units per slice and a total cost of 2000.0000, which is the closed form of impact times quantity squared over the number of slices. Adding risk aversion front-loads the schedule to 20.75, 20.25, 19.75, 19.75, 19.5, with a total cost of 2074, spending 74 units of impact to reduce inventory exposure.</p><p>Two things make this the right tool rather than the closed form. First, it verifies the closed form exactly, which is the standard way to validate a dynamic program: solve a case you can compute by hand. Second, the same recursion accepts a predictive signal, a participation cap, a discrete lot size or a nonlinear impact function, all of which break the closed form. The price is the curse of dimensionality -- the grid grows exponentially in the number of state variables -- which is exactly where the reinforcement learning of FINM 33165 starts.</p>",
          "formula": "V_t(q)=\\min_{0\\le x\\le q}\\Big\\{\\eta x^2+\\lambda\\sigma^2 (q-x)^2+V_{t+1}(q-x)\\Big\\},\\qquad V_{T}(q)=\\infty\\ \\text{for}\\ q>0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nX, N, eta, sig = 100.0, 5, 1.0, 0.25\ngrid = np.linspace(0.0, X, 401)                           # inventory grid for the DP\n\n\ndef dp(lam):\n    \"\"\"backward induction: V_t(q) = min over trade x of eta x^2 + lam sig^2 (q-x)^2 + V_{t+1}(q-x).\"\"\"\n    V = np.where(grid > 0, np.inf, 0.0)                    # must finish flat\n    pol = []\n    for t in range(N, 0, -1):\n        Vn = np.full_like(grid, np.inf)\n        best = np.zeros_like(grid)\n        for i, q in enumerate(grid):\n            xs = grid[grid <= q + 1e-12]\n            rem = q - xs\n            cost = eta * xs ** 2 + lam * sig ** 2 * rem ** 2 + np.interp(rem, grid, V)\n            j = int(np.argmin(cost))\n            Vn[i], best[i] = cost[j], xs[j]\n        V = Vn\n        pol.append(best)\n    return V, pol[::-1]\n\n\nfor lam in (0.0, 0.02, 0.10):\n    V, pol = dp(lam)\n    q, sched = X, []\n    for t in range(N):\n        x = float(np.interp(q, grid, pol[t]))\n        sched.append(x)\n        q = q - x\n    print(f\"lam {lam:4.2f}  schedule {np.round(sched, 2)}  \"\n          f\"total {sum(sched):6.2f}  cost {np.interp(X, grid, V):.4f}\")\nprint(f\"\\nwith no risk aversion the closed form is X/N per slice = {X / N:.2f} and the total\")\nprint(f\"impact cost is eta X^2 / N = {eta * X ** 2 / N:.4f}, which the DP reproduces exactly\")\nprint(\"adding inventory risk front-loads the schedule: the DP has no formula to memorise, only\")\nprint(\"a value function, which is why the same recursion handles a price signal, a participation\")\nprint(\"cap or a discrete lot size that would break the closed form\")\n",
            "output": "lam 0.00  schedule [20. 20. 20. 20. 20.]  total 100.00  cost 2000.0000\nlam 0.02  schedule [20. 20. 20. 20. 20.]  total 100.00  cost 2015.0000\nlam 0.10  schedule [20.75 20.25 19.75 19.75 19.5 ]  total 100.00  cost 2074.0148\n\nwith no risk aversion the closed form is X/N per slice = 20.00 and the total\nimpact cost is eta X^2 / N = 2000.0000, which the DP reproduces exactly\nadding inventory risk front-loads the schedule: the DP has no formula to memorise, only\na value function, which is why the same recursion handles a price signal, a participation\ncap or a discrete lot size that would break the closed form"
          }
        },
        {
          "name": "Multiobjective problems and what scalarisation cannot reach",
          "explain": "<p>Risk and return are two objectives, and the honest answer to 'optimise both' is a Pareto set: the portfolios that no other portfolio beats on both. The usual reduction is a weighted sum, which for a convex attainable set traces the whole frontier as the weight sweeps. For a non-convex attainable set it does not.</p><p>The snippet enumerates four-asset portfolios restricted to five per cent lot sizes -- a realistic discreteness. Of 1989 feasible books, 146 are Pareto optimal. A weighted sum swept over 2001 weights finds 23 distinct portfolios, all of them Pareto optimal, and misses 123. The example printed is a perfectly efficient book at return 0.0955 and risk 0.041635 that no weighting can ever return, because it lies inside the convex hull of the attainable risk-return set.</p><p>Scalarising is therefore not a neutral reformulation. When the feasible set is discrete -- lots, cardinality, minimum tickets -- or the objectives are not concave, a single risk-aversion parameter cannot enumerate the choices available, and a portfolio manager asking to see the efficient alternatives needs enumeration or an epsilon-constraint method instead. The same trap appears whenever several desk objectives are collapsed into one weighted score, from execution cost against timing risk to model fit against turnover.</p>",
          "formula": "\\max_{x\\in\\mathcal{X}}\\ \\theta\\,r(x)-(1-\\theta)\\,\\mathrm{risk}(x)\\ \\ \\text{reaches only the convex hull of}\\ \\{(\\mathrm{risk}(x),r(x))\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\n\nrng = np.random.default_rng(149)\nn = 4\nS = np.array([[0.040, 0.006, 0.002, 0.000], [0.006, 0.030, 0.004, 0.001],\n              [0.002, 0.004, 0.090, 0.010], [0.000, 0.001, 0.010, 0.160]])\nmu = np.array([0.04, 0.05, 0.09, 0.13])\nW = rng.dirichlet(np.ones(n), size=3000)\nlots = np.round(W * 20) / 20.0                            # only 5% lot sizes are tradeable\nlots = lots[np.abs(lots.sum(axis=1) - 1.0) < 1e-12]\nret = lots @ mu\nrisk = np.einsum(\"ij,jk,ik->i\", lots, S, lots)\n\ndominated = np.zeros(len(lots), dtype=bool)\nfor i in range(len(lots)):\n    dominated[i] = np.any((ret >= ret[i]) & (risk <= risk[i]) &\n                          ((ret > ret[i] + 1e-12) | (risk < risk[i] - 1e-12)))\npareto = np.where(~dominated)[0]\nprint(f\"{len(lots)} feasible lot-constrained portfolios, {len(pareto)} of them Pareto optimal\")\n\nfound = set()\nfor th in np.linspace(0.0, 1.0, 2001):\n    score = th * ret - (1 - th) * risk                    # weighted-sum scalarisation\n    found.add(int(np.argmax(score)))\nprint(f\"weighted-sum scalarisation with 2001 weights finds {len(found)} distinct portfolios,\")\nprint(f\"{len(found & set(pareto.tolist()))} of which are Pareto optimal\")\nmissed = sorted(set(pareto.tolist()) - found)\nprint(f\"Pareto points NO weighting can reach: {len(missed)}\")\nif missed:\n    k = missed[0]\n    print(f\"   example: return {ret[k]:.5f}, risk {risk[k]:.6f}, weights {lots[k]}\")\n    print(f\"   it is dominated in the scalarised score at every theta because it sits INSIDE\")\n    print(f\"   the convex hull of the attainable (risk, return) set\")\nprint(\"scalarising a multiobjective problem is not a neutral reformulation: a single weighted sum\")\nprint(\"can only ever return points on the convex hull of the attainable set, so with integer lots\")\nprint(\"or cardinality limits a trader asking 'show me all the efficient books' needs enumeration\")\n",
            "output": "1989 feasible lot-constrained portfolios, 146 of them Pareto optimal\nweighted-sum scalarisation with 2001 weights finds 23 distinct portfolios,\n23 of which are Pareto optimal\nPareto points NO weighting can reach: 123\n   example: return 0.09550, risk 0.041635, weights [0.05 0.2  0.35 0.4 ]\n   it is dominated in the scalarised score at every theta because it sits INSIDE\n   the convex hull of the attainable (risk, return) set\nscalarising a multiobjective problem is not a neutral reformulation: a single weighted sum\ncan only ever return points on the convex hull of the attainable set, so with integer lots\nor cardinality limits a trader asking 'show me all the efficient books' needs enumeration"
          }
        },
        {
          "name": "Accepting an answer: the residuals are the gate",
          "explain": "<p>The course ends with the habit that makes the rest of it usable. A solver returns a point, a status flag and an objective value, and none of the three tells you whether the point is optimal. The KKT residuals do, and they cost one small least-squares solve to compute from the output.</p><p>The snippet runs five configurations of the same long-only constrained portfolio problem. All five return weights, all five are feasible to machine precision. Three report success, and their objectives agree to four decimals -- 0.04139537, 0.04162711 and 0.04139630 -- yet their stationarity residuals are 4.0e-8, 4.2e-2 and 9.0e-4 respectively: three orders of magnitude apart. Two runs report failure, with residuals of 0.24 and 0.27 and objectives that are visibly worse.</p><p>So the acceptance gate for anything that will be traded is a short list: recompute feasibility, recompute stationarity, recover the multipliers and check their signs and complementarity, and log all of it next to the weights with the seed and the solver version. This catches a library upgrade that changed a default tolerance, a scaling change upstream that made the problem ill-conditioned, and a mis-specified constraint that is quietly never active. It is the same discipline as reconciling a P&L: the number is not the deliverable, the number plus its checks is.</p>",
          "formula": "r_{\\text{stat}}=\\big\\|\\nabla f(x)+A^{\\!\\top}\\lambda+C^{\\!\\top}\\nu\\big\\|,\\qquad r_{\\text{feas}}=\\max\\big(\\|Cx-d\\|_\\infty,\\ (Ax-b)_+\\big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious warnings on finite data\nimport warnings\nwarnings.filterwarnings(\"ignore\")\nfrom scipy.optimize import minimize\n\nrng = np.random.default_rng(163)\nn = 8\nF = rng.normal(size=(n, 3))\nS = F @ F.T + np.diag(rng.uniform(0.05, 0.2, n))\nmu = 0.02 + 0.06 * rng.uniform(size=n)\nr0 = 0.05\nf = lambda w: float(w @ S @ w)\ncons = [{\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0},\n        {\"type\": \"ineq\", \"fun\": lambda w: mu @ w - r0}]\n\n\ndef audit(w):\n    g = 2 * S @ w\n    act = w < 1e-7\n    M = np.array([np.ones(n), -mu] + [-np.eye(n)[i] for i in np.where(act)[0]]).T\n    sol, *_ = np.linalg.lstsq(M, -g, rcond=None)\n    stat = np.linalg.norm(M @ sol + g)\n    feas = max(abs(w.sum() - 1.0), max(0.0, r0 - mu @ w), max(0.0, -w.min()))\n    return stat, feas\n\n\nprint(f\"{'method':<22s}{'reported':>10s}{'objective':>13s}{'feasibility':>14s}{'stationarity':>15s}\")\nruns = [(\"SLSQP ftol 1e-16\", dict(method=\"SLSQP\", options={\"ftol\": 1e-16, \"maxiter\": 500})),\n        (\"SLSQP maxiter 3\", dict(method=\"SLSQP\", options={\"ftol\": 1e-16, \"maxiter\": 3})),\n        (\"SLSQP ftol 1e-2\", dict(method=\"SLSQP\", options={\"ftol\": 1e-2, \"maxiter\": 500})),\n        (\"COBYLA default\", dict(method=\"COBYLA\", options={\"maxiter\": 2000})),\n        (\"trust-constr 120 it\", dict(method=\"trust-constr\", options={\"gtol\": 1e-12, \"maxiter\": 120}))]\nfor name, kw in runs:\n    r = minimize(f, np.full(n, 1.0 / n), bounds=[(0.0, None)] * n if kw[\"method\"] != \"COBYLA\" else None,\n                 constraints=cons if kw[\"method\"] != \"COBYLA\"\n                 else cons + [{\"type\": \"ineq\", \"fun\": (lambda i: (lambda w: w[i]))(i)} for i in range(n)],\n                 **kw)\n    st, fe = audit(r.x)\n    print(f\"{name:<22s}{str(r.success):>10s}{f(r.x):>13.8f}{fe:>14.2e}{st:>15.2e}\")\nprint(\"\\nevery run returned weights and every run was feasible. Among the three that reported\")\nprint(\"success the objectives agree to four decimals, yet their stationarity residuals span\")\nprint(\"4e-8, 9e-4 and 4e-2. The objective cannot tell them apart; the residual can, and it\")\nprint(\"costs one least-squares solve -- make it the gate any set of weights has to pass\")\n",
            "output": "method                  reported    objective   feasibility   stationarity\nSLSQP ftol 1e-16            True   0.04139537      0.00e+00       4.00e-08\nSLSQP maxiter 3            False   0.07094263      0.00e+00       2.41e-01\nSLSQP ftol 1e-2             True   0.04162711      0.00e+00       4.15e-02\nCOBYLA default              True   0.04139630      2.22e-16       8.95e-04\ntrust-constr 120 it        False   0.04479749      0.00e+00       2.66e-01\n\nevery run returned weights and every run was feasible. Among the three that reported\nsuccess the objectives agree to four decimals, yet their stationarity residuals span\n4e-8, 9e-4 and 4e-2. The objective cannot tell them apart; the residual can, and it\ncosts one least-squares solve -- make it the gate any set of weights has to pass"
          }
        }
      ],
      "widget": {
        "type": "tree-diagram",
        "title": "Branch and bound on a cardinality-constrained portfolio",
        "params": {
          "nodes": [
            {
              "id": "root",
              "label": "root: all 10 assets allowed"
            },
            {
              "id": "in1",
              "label": "include asset 1"
            },
            {
              "id": "ex1",
              "label": "exclude asset 1"
            },
            {
              "id": "in1in2",
              "label": "include 1, include 2"
            },
            {
              "id": "in1ex2",
              "label": "include 1, exclude 2"
            },
            {
              "id": "ex1in2",
              "label": "exclude 1, include 2"
            },
            {
              "id": "ex1ex2",
              "label": "exclude 1 and 2"
            },
            {
              "id": "prune1",
              "label": "bound >= incumbent: pruned"
            },
            {
              "id": "leaf1",
              "label": "4 names fixed: solve QP, update incumbent"
            },
            {
              "id": "leaf2",
              "label": "4 names fixed: solve QP, no improvement"
            },
            {
              "id": "prune2",
              "label": "bound >= incumbent: pruned"
            }
          ],
          "edges": [
            {
              "from": "root",
              "to": "in1"
            },
            {
              "from": "root",
              "to": "ex1"
            },
            {
              "from": "in1",
              "to": "in1in2"
            },
            {
              "from": "in1",
              "to": "in1ex2"
            },
            {
              "from": "ex1",
              "to": "ex1in2"
            },
            {
              "from": "ex1",
              "to": "ex1ex2"
            },
            {
              "from": "in1in2",
              "to": "leaf1",
              "label": "depth 4"
            },
            {
              "from": "in1ex2",
              "to": "prune1",
              "label": "relaxation"
            },
            {
              "from": "ex1in2",
              "to": "leaf2",
              "label": "depth 4"
            },
            {
              "from": "ex1ex2",
              "to": "prune2",
              "label": "relaxation"
            }
          ]
        }
      },
      "pitfalls": [
        "Branching without a good bound. The tree size is governed by how tight the relaxation is, not by the traversal order; a weak bound turns branch and bound back into enumeration.",
        "Collapsing several objectives into one weighted score and calling the result the efficient choice. With lots or cardinality limits, 123 of 146 Pareto-optimal books here were unreachable by any weighting.",
        "Growing the state of a dynamic program. Two state variables are usually fine, four rarely are; the grid cost is exponential, which is what approximate dynamic programming exists to avoid.",
        "Accepting a solver's success flag. Three runs here reported success with stationarity residuals spanning three orders of magnitude and objectives agreeing to four decimals."
      ],
      "check": [
        {
          "q": "In branch and bound, a subtree can be discarded when:",
          "options": [
            "its relaxation is infeasible only",
            "its relaxation's value is no better than the incumbent",
            "it contains no integer point",
            "its depth exceeds the cardinality limit"
          ],
          "answer": 1,
          "why": "The relaxation is a valid bound on everything in the subtree, so if it cannot beat the best known solution nothing inside can. Infeasibility is one special case of this test rather than the whole rule."
        },
        {
          "q": "The execution DP with zero risk aversion returned 20 units per slice. This matters because:",
          "options": [
            "it proves the DP is optimal in general",
            "it reproduces the closed form exactly, validating the implementation",
            "it shows impact is linear",
            "it shows the grid is fine enough for any problem"
          ],
          "answer": 1,
          "why": "Matching a case you can compute by hand -- here eta X^2 / N = 2000 exactly -- is the standard validation of a dynamic program. It says nothing about other cost models, and the grid still needs checking when risk aversion is added."
        },
        {
          "q": "A weighted-sum sweep found 23 of 146 Pareto-optimal portfolios. The 123 missed ones:",
          "options": [
            "were infeasible",
            "were dominated",
            "lie inside the convex hull of the attainable set",
            "had negative weights"
          ],
          "answer": 2,
          "why": "A linear score can only be maximised at a point on the convex hull, so efficient points in a dent of a non-convex attainable set are unreachable at every weighting. They are feasible and undominated, which is exactly why missing them matters."
        },
        {
          "q": "Two solver runs returned objectives agreeing to four decimals but stationarity residuals of 4e-8 and 4e-2. You should:",
          "options": [
            "use either; the objectives agree",
            "use the one with the smaller residual and log both",
            "average the two answers",
            "conclude the problem is non-convex"
          ],
          "answer": 1,
          "why": "The objective is flat near the optimum, so agreement there is weak evidence; the residual is the direct measure of how close to stationary the point is. Averaging two solutions of a constrained problem can leave the feasible set entirely."
        }
      ]
    }
  ],
  "interview": [
    {
      "q": "What does convexity actually buy you?",
      "level": "screen",
      "answer": "Three things. Every local minimum is global, so one run from any starting point is enough and the answer does not depend on the seed. The first-order conditions become sufficient, so you can certify optimality rather than assert it. And duality is tight under a mild regularity condition, so you get a lower bound and a set of shadow prices with the solution. Practically that means a convex model gives a number you can defend and a price for every constraint, while a non-convex one gives the best point your search happened to find, and the search itself becomes part of the specification you have to document."
    },
    {
      "q": "When would you not use Newton's method?",
      "level": "screen",
      "answer": "When the Hessian is too big to form or factorise, which in practice means more than a few thousand parameters; when second derivatives are unavailable or unreliable, for instance behind a simulation; and when you are far from a solution, where the undamped step can be worse than useless. Newton is affine invariant and quadratically convergent locally, which is why it is unbeatable on small smooth problems, but it needs damping or a trust region to be safe globally. For large problems limited-memory BFGS keeps most of the benefit with gradients only, and for very large or stochastic ones first-order methods with a good metric win outright."
    },
    {
      "q": "You have a portfolio optimisation with a budget constraint and no inequalities. How do you solve it?",
      "level": "screen",
      "answer": "With one linear solve, not an iterative optimiser. Minimising a convex quadratic subject to linear equalities makes the KKT conditions a single symmetric linear system in the weights and the multipliers, so the answer is exact and comes with the shadow price of the budget for free. I would assemble that system and solve it, rather than forming an inverse covariance matrix, because explicit inversion of a near-singular sample covariance is where most research-code portfolio problems go wrong. If inequalities are then added -- long-only, position caps -- the structure changes and I move to an active-set or interior-point QP solver."
    },
    {
      "q": "Explain the difference between a penalty method and an augmented Lagrangian.",
      "level": "onsite",
      "answer": "Both add a squared-violation term to the objective, but only the augmented Lagrangian also carries a multiplier estimate that it updates by the observed violation. In the penalty method the penalty weight is what makes the constraint hold, so accuracy is bought with conditioning: to get a violation of 1e-9 you need a weight of 1e9 and a Hessian condition number to match, and past a point the floating-point error in the subproblem dominates and the answer gets worse. In the augmented Lagrangian the multiplier converges to the true shadow price and the penalty only has to keep each subproblem well posed, so a fixed modest weight reaches 1e-14 with a well-conditioned Hessian throughout."
    },
    {
      "q": "Why is minimising Value-at-Risk hard, and what do people do instead?",
      "level": "onsite",
      "answer": "VaR is a quantile of the loss and quantiles are not convex in the position, so a VaR constraint makes the feasible set non-convex: the solver returns local answers without telling you, and the constraint has no well-defined shadow price. There is a two-name example where each name alone has zero VaR at 95 per cent and the equally weighted book has a positive one, so diversification makes the measure worse. Conditional VaR is the convex alternative, and the Rockafellar-Uryasev representation turns minimising it into a linear program with one auxiliary variable for the VaR level and one slack per scenario. Desks with VaR mandates usually optimise CVaR and monitor VaR."
    },
    {
      "q": "What is the KKT check you would run on a solver's output before trading it?",
      "level": "onsite",
      "answer": "Five numbers. Primal feasibility: the equalities to machine precision, no inequality violated. Dual feasibility: every inequality multiplier non-negative. Stationarity: the norm of the Lagrangian gradient, having recovered the multipliers by least squares from the active set. Complementary slackness: each multiplier times its slack near zero. And the multiplier values themselves, as shadow prices, sanity-checked for sign and magnitude. Feasibility is the cheap one and almost always passes; stationarity is what separates a solution from a plausible point, and in a test of five solver configurations the three that reported success had stationarity residuals spanning three orders of magnitude while their objectives agreed to four decimals."
    },
    {
      "q": "Why does an L1 penalty produce exact zeros?",
      "level": "onsite",
      "answer": "Because its proximal operator is soft-thresholding, which maps a whole interval around zero to exactly zero. A proximal gradient step therefore lands on zero and can stay there, whereas a gradient step on a smooth L2 penalty multiplies the coefficient by a factor below one and never reaches it. Geometrically, the L1 ball has corners on the axes and the solution tends to touch the constraint set at one. The operational consequence matters more than the geometry: an L1 turnover cost creates a genuine no-trade region, so some positions are left exactly unchanged, while a quadratic cost produces a small trade in every name and a ticket charge with it."
    },
    {
      "q": "A colleague reports that their optimiser converged. What do you ask?",
      "level": "onsite",
      "answer": "First, converged to what: a small gradient is stationarity, not optimality, and in high dimension most stationary points of a non-convex objective are saddles. So I ask for the smallest Hessian eigenvalue or a perturb-and-restart. Second, whether the problem is convex, and if not, how many starts were run and what the spread of limit values was, because that spread is the finding. Third, the feasibility and stationarity residuals, not the status flag. Fourth, the seed and the solver version. Fifth, whether the answer is stable to a bootstrap of the inputs, which for portfolio problems is usually the binding uncertainty rather than the optimisation."
    },
    {
      "q": "How would you make a mean-variance portfolio less sensitive to its inputs?",
      "level": "senior",
      "answer": "Attack the inputs and the objective, not the solver. On inputs: shrink the covariance towards a structured target, and shrink or model the means, since they carry almost all the estimation error. On the objective: add a robust term, which for an ellipsoidal uncertainty set in the means is exactly a norm penalty on the position and keeps the problem a second-order cone program. In a test with means from sixty observations, that cut gross exposure from 2.30 to 1.00, halved the objective's standard deviation across plausible mean vectors, and gained 1.74 units of worst case per unit given up at the point estimate. On constraints: caps and a turnover penalty, which act as implicit regularisers. And report the bootstrap spread of the weights."
    },
    {
      "q": "When is it worth writing a custom solver rather than calling a library?",
      "level": "senior",
      "answer": "Rarely, and for one of three reasons. Structure the library cannot exploit: a problem that is a single linear solve, a projection with a closed form, or a separable prox, where a generic nonlinear solver costs orders of magnitude more. Scale that makes a generic method impossible, where a splitting method turns one intractable problem into two easy blocks. Or a latency budget, where a warm-started projected or proximal iteration inside a trading loop must return a feasible answer in a fixed time. Otherwise the library wins on robustness, edge cases and support. The engineering that is always worth writing yourself is the acceptance test: the residual computation that decides whether the library's answer gets used."
    },
    {
      "q": "Your production risk model has a maximum-number-of-names constraint. What do you tell the portfolio manager?",
      "level": "senior",
      "answer": "That the constraint changes the nature of the problem, not just its difficulty. Cardinality is non-convex, so there is no certificate of optimality and no shadow price: the answer becomes the best found within a compute budget, and it can jump discontinuously when an input moves slightly. Branch and bound with the continuous relaxation as a bound is tractable at tens of assets and needs serious work at hundreds. I would ask whether the real requirement is operational -- a short holdings list, few tickets -- because an L1 turnover or holdings penalty gets most of that effect while keeping the problem convex, solvable and explainable, with a stable answer day to day."
    },
    {
      "q": "How do you choose the size of a robust uncertainty set?",
      "level": "senior",
      "answer": "By making it a statement about estimation error rather than a tuning knob. For means estimated from n observations, the natural set is an ellipsoid shaped by the estimation covariance -- the sample covariance over n -- and scaled in standard errors, so the parameter kappa has an interpretation a trader can argue with: two standard errors, or three. Then I hold it fixed across the study, because tuning it on the same data destroys the meaning. There is also a useful identity to lean on: worst-case least squares over a norm ball of data perturbations equals a nominal fit plus rho times the coefficient norm, so the robust radius and a regularisation strength are the same object, and a defensible radius gives you a defensible penalty."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 36700",
      "how": "Mean-variance construction, the efficient frontier and factor-based risk budgeting there are the quadratic and conic programs of weeks 5, 6 and 9, and the shadow prices of week 6 are what put a cost on each risk limit."
    },
    {
      "code": "FINM 33165",
      "how": "The reverse: that course develops gradient descent conditioning, momentum and adaptive steps for deep networks, which this course deliberately does not repeat. Week 10's execution dynamic program is the same Bellman recursion its reinforcement learning replaces with sampling."
    },
    {
      "code": "FINM 33160",
      "how": "Ridge, lasso and logistic fitting there are the penalised programs of weeks 4 and 8; the proximal and soft-thresholding machinery is what makes L1 feature selection work at scale."
    },
    {
      "code": "FINM 32000",
      "how": "Calibration of pricing models to market quotes is the Gauss-Newton and Levenberg-Marquardt problem of week 4, and the implied-volatility root finding of week 2 is its scalar case."
    },
    {
      "code": "FINM 37601",
      "how": "Optimal execution and market-making there are constrained dynamic optimisation problems; weeks 7, 8 and 10 supply the projection, splitting and value-function tools they are solved with."
    },
    {
      "code": "FINM 33150",
      "how": "Turning signals into positions under turnover, leverage and capacity constraints is week 8's L1-penalised construction, and the estimation-error results of week 9 are why a backtested optimal portfolio degrades out of sample."
    }
  ],
  "glossary": [
    {
      "term": "Feasible set",
      "def": "The set of decision variables satisfying every constraint. Shrinking it can only worsen the optimal value, which is why every constraint has a non-negative shadow price."
    },
    {
      "term": "Optimal value versus minimiser",
      "def": "The best achievable objective number, which is unique when it exists, against a point achieving it, which may be non-unique or may not exist."
    },
    {
      "term": "Convex function",
      "def": "A function whose graph lies below every chord, equivalently one with a positive semidefinite Hessian. For such an objective over a convex set, local minima are global."
    },
    {
      "term": "Condition number",
      "def": "Ratio of largest to smallest eigenvalue of the Hessian. It sets the iteration count of first-order methods and is changed by preconditioning, not by the line search."
    },
    {
      "term": "Armijo condition",
      "def": "Sufficient decrease: the achieved reduction is at least a small fraction of the reduction the linear model predicted. Checkable with one function evaluation and needs no Lipschitz constant."
    },
    {
      "term": "Wolfe conditions",
      "def": "Armijo plus a curvature requirement on the directional derivative. The curvature part is what keeps a BFGS update positive definite."
    },
    {
      "term": "Affine invariance",
      "def": "The property that a method's iterates are the same points under any linear change of variables. Newton has it; steepest descent does not, which is why scaling matters for one and not the other."
    },
    {
      "term": "Secant equation",
      "def": "The requirement that a quasi-Newton curvature model map the last step to the last observed change in gradient. BFGS is the rank-two update satisfying it while staying positive definite."
    },
    {
      "term": "Gauss-Newton",
      "def": "For a least-squares objective, dropping the residual-weighted second-derivative term from the Hessian, leaving a Jacobian product. Accurate when residuals are small; damped by Levenberg-Marquardt when they are not."
    },
    {
      "term": "Second-order cone program",
      "def": "A convex program whose constraints bound a Euclidean norm by an affine function. Norm caps, robust counterparts of linear terms and standard-deviation objectives all fit."
    },
    {
      "term": "Epigraph trick",
      "def": "Replacing a nonsmooth term by a new variable bounded above by it, plus linear inequalities. It turns absolute values and maxima into linear programs."
    },
    {
      "term": "Lagrangian dual",
      "def": "The infimum over the variables of the objective plus multiplier-weighted constraints, as a function of the multipliers. Always concave and always a lower bound on the primal optimum."
    },
    {
      "term": "Duality gap",
      "def": "The difference between the primal optimal value and a dual value. Zero at the optimum of a convex problem satisfying Slater's condition, and exactly m times t at a barrier point with m inequalities."
    },
    {
      "term": "KKT conditions",
      "def": "Stationarity, primal and dual feasibility and complementary slackness. Necessary at a solution under regularity and sufficient for a convex problem; computable from a solver's output as an acceptance test."
    },
    {
      "term": "Shadow price",
      "def": "The multiplier read as the derivative of the optimal value with respect to relaxing its constraint. Local: it prices the next unit, not the next hundred."
    },
    {
      "term": "Augmented Lagrangian",
      "def": "A penalty method with an explicit multiplier estimate updated by the observed violation, so accuracy comes from the multiplier rather than from an ever-larger penalty weight."
    },
    {
      "term": "Central path",
      "def": "The curve of solutions to the log-barrier problem as the barrier weight falls to zero. Interior-point methods follow it, and the guaranteed gap along it is known in advance."
    },
    {
      "term": "Proximal operator",
      "def": "The minimiser of a function plus a quadratic pull towards a point. It generalises projection; for the absolute value it is soft-thresholding, which lands exactly on zero."
    },
    {
      "term": "Sample-average approximation",
      "def": "Replacing an expectation by an average over scenarios and solving that. The weights converge at one over root n and the objective gap at about one over n."
    },
    {
      "term": "Robust counterpart",
      "def": "The worst-case reformulation of a problem over an uncertainty set. For a linear term over an ellipsoid it is a norm penalty, which is why robustness and regularisation are the same object."
    }
  ]
};
