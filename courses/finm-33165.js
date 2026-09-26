/* courses/finm-33165.js -- FINM 33165, Reinforcement Learning and Deep Learning.
   Built from the public course page only; the syllabus is behind a login and was not
   read. The weekly outline, explanations, code, questions and glossary are this
   dashboard's own reconstruction of a standard graduate treatment, not the
   instructor's material. Every code `output` is real stdout, written by
   tools/run_snippets.py -- do not edit those strings by hand. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 33165"] = {
  "code": "FINM 33165",
  "slug": "finm-33165",
  "title": "Reinforcement Learning and Deep Learning",
  "instructor": "Niels Nygaard",
  "quarter": "Autumn",
  "units": 100,
  "block": "electives",
  "concentrations": [
    "machine-learning-ai"
  ],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/machine-learning-and-ai/finm-33165/",
    "syllabus_url": "https://uchicago.box.com/s/at3wj9i03t04q8e7anjev28yft2wxy0e",
    "fetched": "2026-09-26",
    "note": "The syllabus for this course is a shared link that requires a login, so it could not be read; the only source available was the public course page, which gives an official description, the instructor, the quarter and the concentration. Everything else on this page -- the ten-week outline, the explanations, the code, the questions, the interview set and the glossary -- is the dashboard's own reconstruction of a standard graduate treatment of these topics. None of it comes from the instructor, and none of it should be read as endorsed by them or as describing how the course is actually run, assessed or scheduled."
  },
  "tier": "B",
  "description": "Reinforcement learning is an old subject -- the Bellman equation dates from the 1940s -- that was transformed by its combination with neural networks, first in learning to play Atari games at superhuman level, then in playing Go at world-champion level, and most recently in the training of large language models, where it is used for code generation and for making responses more useful. This course covers the deep learning machinery those results rest on and the reinforcement learning theory they apply, and then asks what survives contact with financial data. The stated prerequisites are linear algebra, calculus, probability theory at the level of the probability and stochastic processes course, and basic Python.",
  "prerequisites": [
    "Linear algebra: eigenvalues, the singular value decomposition, and what a projection is.",
    "Multivariable calculus: the chain rule in vector form, gradients and Jacobians.",
    "Probability at the level of the program's probability and stochastic processes course: conditional expectation, Markov chains, laws of large numbers.",
    "Python with numpy at a level that lets you write a vectorised loop and debug a shape error without an IDE.",
    "Comfort with ordinary least squares, including its variance and its failure modes."
  ],
  "textbooks": [
    {
      "title": "Reinforcement Learning: An Introduction",
      "author": "Richard S. Sutton and Andrew G. Barto",
      "note": "The standard reference for the material in weeks 6 to 9; the counterexamples and the deadly-triad discussion follow its treatment."
    },
    {
      "title": "Deep Learning",
      "author": "Ian Goodfellow, Yoshua Bengio and Aaron Courville",
      "note": "A standard reference for backpropagation, initialisation, regularisation and sequence models."
    },
    {
      "title": "Algorithms for Reinforcement Learning",
      "author": "Csaba Szepesvari",
      "note": "A short, rigorous standard reference for the convergence results quoted in weeks 6 to 8."
    },
    {
      "title": "Advances in Financial Machine Learning",
      "author": "Marcos Lopez de Prado",
      "note": "A standard practitioner reference on the validation problems that weeks 1, 5 and 10 keep returning to."
    },
    {
      "title": "Optimal execution of portfolio transactions",
      "author": "Robert Almgren and Neil Chriss",
      "note": "The standard reference behind the execution dynamic program in week 10; widely available as a journal article."
    }
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
  ],
  "brushup": [
    {
      "topic": "The chain rule in vector form",
      "why": "Week 2 is nothing but the chain rule applied in a particular order. If the derivative of a matrix-vector product with respect to the matrix is not automatic, the backward pass will look like a list of rules to memorise rather than one idea applied four times.",
      "resource": "The Matrix Cookbook, sections on derivatives of linear and quadratic forms"
    },
    {
      "topic": "Eigenvalues, the SVD and condition number",
      "why": "Weeks 3 and 4 both live in the eigenbasis: convergence rates, ridge shrinkage factors and the double-descent spike are all statements about singular values. Without the decomposition they are three unrelated facts.",
      "resource": "Strang, Introduction to Linear Algebra, chapters 6 and 7"
    },
    {
      "topic": "Conditional expectation and the tower property",
      "why": "The Bellman equation in week 6 is a tower-property argument and nothing more. Being fluent here turns the derivation into one line instead of a page.",
      "resource": "Williams, Probability with Martingales, chapter 9"
    },
    {
      "topic": "Finite Markov chains",
      "why": "An MDP is a Markov chain with a choice at every state. Transition matrices, stationary distributions and the geometric decay of powers of a substochastic matrix all reappear directly in weeks 6 to 8.",
      "resource": "Norris, Markov Chains, chapter 1"
    },
    {
      "topic": "numpy broadcasting and vectorisation",
      "why": "Every snippet in this course is numpy. A (n,) array silently broadcasting against an (n,1) array is the single commonest bug in a hand-written backward pass, and it produces a plausible number rather than an error.",
      "resource": "The numpy user guide, 'Broadcasting'"
    },
    {
      "topic": "Out-of-sample discipline",
      "why": "Weeks 1, 5 and 10 all turn on the difference between in-sample fit and predictive value. Knowing why a full-sample normalisation is a leak, before the course starts, saves a lot of confusion.",
      "resource": "Hastie, Tibshirani and Friedman, The Elements of Statistical Learning, chapter 7"
    },
    {
      "topic": "Ordinary least squares and its variance",
      "why": "Ridge, early stopping and dropout are all described here as modifications of least squares in the eigenbasis, and the low signal-to-noise argument in week 1 is an OLS calculation.",
      "resource": "Hastie, Tibshirani and Friedman, chapters 3 and 7"
    }
  ],
  "interview": [
    {
      "q": "Explain backpropagation to someone who has told you it is 'how neural networks learn'.",
      "level": "screen",
      "answer": "Backpropagation is not learning, it is differentiation. It computes the gradient of a scalar loss with respect to every parameter by applying the chain rule from the output backwards, reusing the intermediate results the forward pass already cached. Learning is what the optimiser does with that gradient afterwards. The reason it is done backwards rather than forwards is cost: reverse mode computes the full gradient of one scalar output in about two forward passes regardless of the number of parameters, while forward mode would need one pass per parameter. The price is memory, because the whole forward graph has to be retained."
    },
    {
      "q": "How would you check that a custom layer's gradient is correct?",
      "level": "screen",
      "answer": "A central finite-difference check on a small random instance. Perturb each parameter by about 1e-6 in each direction, recompute the loss, and compare the two-sided difference to the analytic gradient. In double precision a correct implementation agrees to roughly 1e-9 relative error or better, so anything at the 1e-3 level is a bug rather than numerical noise. I would run it on a tiny case with a handful of parameters so every partial is checked, keep it as a unit test, and use a central rather than a forward difference because the forward one loses about half the available digits to cancellation."
    },
    {
      "q": "What is the difference between the risk-neutral idea of hedging and what deep hedging does?",
      "level": "onsite",
      "answer": "Classical hedging assumes continuous costless rebalancing, and under that assumption the delta hedge replicates the payoff exactly and the price is unique. Deep hedging drops the assumption. With discrete rebalancing times, transaction costs, market impact and possibly a volatility smile, perfect replication is impossible, so there is no unique price and the question becomes which residual risk profile you prefer. It is posed as a stochastic control problem: choose a trading policy to optimise an objective over the terminal profit and loss, typically mean against standard deviation or a convex risk measure. The optimal policy is generally a no-trade band rather than a delta, and it is learned from simulated paths."
    },
    {
      "q": "Why is temporal-difference learning lower variance than Monte Carlo, and what does it cost you?",
      "level": "onsite",
      "answer": "Monte Carlo's target is the realised return over the whole remaining episode, so its variance accumulates every random transition and reward between now and termination. Temporal difference replaces all of that with one sampled reward plus the current estimate of the next state's value, so its target has the variance of a single step. The cost is bias: while the value estimates are wrong the target is wrong, and the estimate chases itself. The deeper cost appears with function approximation, where bootstrapping is one of the three ingredients of the deadly triad and can make the iteration diverge rather than merely converge slowly."
    },
    {
      "q": "Your colleague trains a deep Q-network without a target network and it diverges. Explain why.",
      "level": "onsite",
      "answer": "The update is semi-gradient: it differentiates the prediction but treats the bootstrapped target as a constant, so it is not the gradient of any objective and has no descent guarantee. When the same parameters appear in both the prediction and the target, and the training distribution differs from the one the greedy policy induces, the expected update can be an expansion rather than a contraction. There is a two-state counterexample with a single weight where the expected update multiplies it by one plus alpha times two gamma minus one, which exceeds one for any discount above a half. A frozen target turns the inner problem into ordinary regression onto fixed labels and restores the Bellman contraction between refreshes."
    },
    {
      "q": "A candidate execution agent is trained in a simulator and beats the benchmark by fifteen per cent. What do you ask?",
      "level": "senior",
      "answer": "First, what the benchmark is, and whether the dynamic-programming optimum for the simulator's own cost model was computed, because an agent that fails to match an exactly solvable benchmark has learned nothing. Second, what the impact model is, because an agent trained against a forgiving impact function will learn to trade aggressively and will pay for it live. Third, whether the evaluation used the same random paths as training. Fourth, how the agent behaves outside the training distribution: a wider spread, a halt, a fast market. Fifth, what the position and participation limits are, because the agent will find the edge of any constraint that is not enforced."
    },
    {
      "q": "What is the deadly triad and how do practitioners work around it?",
      "level": "onsite",
      "answer": "Bootstrapping, function approximation and off-policy training. Any two are safe; all three together can make a semi-gradient value update diverge. The standard mitigations are a target network, which freezes the bootstrap so each outer loop is a contraction followed by a projection, and experience replay, which decorrelates updates and reuses samples. Neither is a proof: replay is itself a source of off-policy data. Other routes are to keep the algorithm on-policy, to use gradient-TD methods that genuinely descend the projected Bellman error, or to restrict the approximator so the projection is non-expanding. In practice people use target networks and replay and monitor the weight norm."
    },
    {
      "q": "Why does an unbaselined policy gradient often fail to learn anything?",
      "level": "onsite",
      "answer": "The score-function estimator multiplies the gradient of the log-policy by the raw return, so its variance scales with the magnitude of the return including any constant offset. If rewards are profit and loss in currency units with an arbitrary level, that offset can be many times the size of the signal and the estimator is almost pure noise. Subtracting any function of the state leaves the estimator unbiased, because the expected score is zero, and can cut the variance by an order of magnitude. The best baseline is a value-function estimate, which turns the multiplier into an advantage. In a toy bandit with a constant offset of twenty, a batch-mean baseline reduced the standard deviation about twentyfold."
    },
    {
      "q": "You are shown an off-policy evaluation saying a new policy earns twice the logged one. How do you audit it?",
      "level": "senior",
      "answer": "I ask for the effective sample size of the importance weights first, before looking at the estimate. Per-step ratios multiply, so weight variance grows exponentially in the horizon and an unbiased estimator can be catastrophically wrong while reporting a small standard error, because the trajectories carrying the weight were never sampled. I want the distribution of the weights, the maximum weight as a share of the total, and the result under weighted importance sampling and a doubly robust estimator as cross-checks. If the effective sample size is in single digits I treat the number as uninformative, the same way I would treat a backtest with three trades."
    },
    {
      "q": "How do you choose the discount factor in a trading problem?",
      "level": "senior",
      "answer": "It is part of the problem specification, not a solver setting. The discount defines an effective horizon of about one over one minus gamma steps, so it should be chosen to match the horizon over which the decision actually matters: a few steps for a child-order placement problem, hundreds for an overnight inventory problem. Raising it does not simply make the agent more far-sighted for free; it slows the Bellman contraction, increases the variance of returns and amplifies value error into policy error by the same factor. If results move a lot with gamma, the state is usually missing the variable that made the problem episodic in the first place, such as time remaining."
    },
    {
      "q": "A strategy validated out-of-sample at Sharpe 2 loses money live. Walk me through the diagnosis.",
      "level": "senior",
      "answer": "I separate three failure modes. Overfitting is ruled out by the held-out result, unless the held-out set was reused during selection, which I would check first. Implementation shortfall is next: fills at mid rather than at a realistic sweep price, latency, and costs assumed rather than measured. If neither explains it, the remaining candidate is non-stationarity, and the diagnostic is whether the sign of the relationship the model learned has changed in the live window. I would compare live feature distributions against training ones, check whether the loss is concentrated in a regime the training window never contained, and cap size until that comparison is clean."
    },
    {
      "q": "When would you genuinely prefer reinforcement learning to dynamic programming on a desk?",
      "level": "senior",
      "answer": "When I cannot write the model down or cannot enumerate the state. A twelve-unit, six-period liquidation is solved exactly by backward induction in milliseconds, and a learned agent that matches it after sixty thousand simulated episodes has bought nothing. The realistic problem is different: the state includes book imbalance, queue position, recent fill history and venue, and the transition dynamics are whatever the market does, so there is no model to solve. Reinforcement learning is then a way of approximating a dynamic program nobody could write. It needs a simulator good enough to trust, and the simulator's flaws become the agent's strategy."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 33160",
      "how": "The supervised machinery of weeks 1 to 5 is the toolkit that course applies to cross-sectional and time-series prediction; the capacity-versus-signal argument of week 1 is the same warning in a different setting."
    },
    {
      "code": "FINM 33100",
      "how": "Shares the loss functions, regularisation and out-of-sample discipline of weeks 1 and 4, at a less algorithmic level and over a half quarter."
    },
    {
      "code": "FINM 34800",
      "how": "Weeks 3 and 4 here are the applied face of that course's theory: gradient descent rates, conditioning, proximal and constrained methods, and ridge as a penalised program."
    },
    {
      "code": "FINM 33200",
      "how": "Reinforcement learning from human and model feedback is how language models are tuned, so the policy-gradient and reward-modelling material in week 9 is the background to that course's agent work."
    },
    {
      "code": "FINM 37601",
      "how": "The execution dynamic program of week 10 is the reduced-form version of the optimisation that course develops properly, with a real order book underneath it."
    },
    {
      "code": "FINM 33150",
      "how": "The backtesting scepticism of weeks 1, 5 and 10, and the non-stationarity experiment in particular, are the failure modes that course's strategy research has to survive."
    }
  ],
  "glossary": [
    {
      "term": "Backpropagation",
      "def": "Reverse-mode application of the chain rule over a computation graph, reusing cached forward values, to obtain the gradient of a scalar loss with respect to every parameter in about two forward passes."
    },
    {
      "term": "Reverse-mode autodiff",
      "def": "Differentiation that propagates the derivative of one output backwards through the graph. Cost is independent of input dimension, at the price of storing the forward graph."
    },
    {
      "term": "Vanishing gradient",
      "def": "The geometric decay of the gradient with depth or sequence length, caused by a product of Jacobians whose typical factor is below one. Gating and skip connections are the standard cures."
    },
    {
      "term": "Condition number",
      "def": "Ratio of the largest to the smallest eigenvalue of the Hessian. It sets the iteration count for gradient descent, linearly for plain descent and as its square root with optimal momentum."
    },
    {
      "term": "Stability threshold",
      "def": "The step size 2/L, where L is the largest curvature. Gradient descent contracts strictly below it, oscillates at it, and diverges geometrically above it."
    },
    {
      "term": "Weight decay",
      "def": "An L2 penalty on the parameters. For squared error it is exactly ridge regression, shrinking each spectral direction by a factor s^2/(s^2+lambda)."
    },
    {
      "term": "Early stopping",
      "def": "Halting optimisation before convergence. From a zero start it fits large-eigenvalue directions first, so it acts as a spectral filter comparable to a ridge penalty."
    },
    {
      "term": "Double descent",
      "def": "The non-monotone shape of test error in capacity: it rises to a spike at the interpolation threshold where parameters equal observations, then falls again as capacity grows further."
    },
    {
      "term": "Markov decision process",
      "def": "States, actions, a transition kernel, a reward function and a discount factor, where next state and reward depend only on the current state and action."
    },
    {
      "term": "Bellman operator",
      "def": "The map from a value estimate to reward plus discounted expected next value. It is a gamma-contraction in the supremum norm, so it has a unique fixed point reached geometrically."
    },
    {
      "term": "Value iteration",
      "def": "Repeated application of the Bellman optimality operator until the value change falls below a tolerance; the optimal policy is then greedy with respect to the result."
    },
    {
      "term": "Policy iteration",
      "def": "Alternating exact policy evaluation with greedy improvement. It terminates in very few rounds because no deterministic policy can repeat, at a linear-solve cost per round."
    },
    {
      "term": "Temporal-difference error",
      "def": "The quantity r + gamma*V(s') - V(s). It is the one-step surprise, the update signal for a critic, and a single-sample estimate of the advantage."
    },
    {
      "term": "Q-learning",
      "def": "Off-policy control that updates toward reward plus the discounted maximum action value at the next state, so it learns the greedy policy whatever behaviour generated the data."
    },
    {
      "term": "SARSA",
      "def": "On-policy control that bootstraps from the action actually taken next, so it evaluates the behaviour policy including its own exploration and prefers routes that survive a slip."
    },
    {
      "term": "Deadly triad",
      "def": "Bootstrapping, function approximation and off-policy training together. Any two are safe; all three can make a semi-gradient value update diverge."
    },
    {
      "term": "Target network",
      "def": "A frozen copy of the value function used to build bootstrapped targets, so that each refresh interval is an ordinary regression and the outer loop inherits the Bellman contraction."
    },
    {
      "term": "Experience replay",
      "def": "A buffer of past transitions sampled uniformly for updates. It decorrelates consecutive data and reuses samples, at the cost of making the data off-policy."
    },
    {
      "term": "Score-function estimator",
      "def": "The identity that lets the gradient of an expectation be written as the expectation of the value times the gradient of the log-density. It is the basis of REINFORCE."
    },
    {
      "term": "Effective sample size",
      "def": "The square of the sum of importance weights divided by the sum of their squares. It says how many trajectories an importance-weighted estimate is really averaging."
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "Learning as function approximation",
      "topics": [
        "supervised learning",
        "why nonlinearity matters",
        "loss functions",
        "universal approximation",
        "the signal-to-noise problem in finance"
      ],
      "concepts": [
        {
          "name": "Depth without nonlinearity buys nothing",
          "explain": "<p>A feed-forward network is an alternating stack: an affine map, a pointwise nonlinearity, an affine map, and so on. The nonlinearity is not decoration. Compose three affine maps and you get one affine map, so a ten-layer linear network has exactly the expressive power of a single matrix and the only thing depth changed is how hard the optimisation is. Worse, a narrow layer in the middle caps the rank of the whole product, so a wide-narrow-wide linear stack is a rank-constrained regression with extra steps.</p><p>Insert a <code>ReLU</code> or a <code>tanh</code> between the layers and the picture changes completely. The composition is now piecewise linear with a number of pieces that grows quickly in depth, and no single affine map can reproduce it. The snippet makes both halves concrete: the linear stack agrees with one matrix to machine precision, and the same weights with a nonlinearity in between leave a residual that no affine map can remove.</p><p>This matters on a desk because almost every failed 'deep' model in finance turns out, on inspection, to be a linear model wearing a costume, and it should have been compared against ridge regression from the first day.</p>",
          "formula": "f(x) = W_L\\,\\sigma\\!\\left(W_{L-1}\\cdots \\sigma(W_1 x + b_1)\\cdots\\right) + b_L",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(0)\nW1, W2, W3 = rng.normal(size=(5, 4)), rng.normal(size=(3, 5)), rng.normal(size=(1, 3))\nx = rng.normal(size=(4, 8))\n\nstacked   = W3 @ (W2 @ (W1 @ x))          # three \"layers\", no nonlinearity\ncollapsed = (W3 @ W2 @ W1) @ x            # one matrix\nprint(f\"linear depth-3 vs one matrix : max|diff| = {np.abs(stacked - collapsed).max():.2e}\")\n\nrelu = lambda z: np.maximum(z, 0.0)\ndeep = W3 @ relu(W2 @ relu(W1 @ x))       # same weights, ReLU between layers\nD = np.vstack([x, np.ones(8)]).T          # best affine map of the inputs\nA, *_ = np.linalg.lstsq(D, deep.T, rcond=None)\nprint(f\"ReLU depth-3 vs best affine  : residual norm = {np.linalg.norm(deep.T - D @ A):.4f}\")\nprint(f\"rank of W2 @ W1 (a 3-unit layer in the middle) = {np.linalg.matrix_rank(W2 @ W1)}\")\n",
            "output": "linear depth-3 vs one matrix : max|diff| = 4.44e-16\nReLU depth-3 vs best affine  : residual norm = 0.3494\nrank of W2 @ W1 (a 3-unit layer in the middle) = 3"
          }
        },
        {
          "name": "The loss decides what you are estimating",
          "explain": "<p>Choosing a loss is not a numerical convenience, it is a statement about which functional of the conditional distribution you want. Minimising expected squared error recovers the conditional mean. Minimising expected absolute error recovers the conditional median. Minimising the pinball loss at level tau recovers the conditional tau-quantile, and minimising cross-entropy recovers the conditional probability. All four are 'the model', and on skewed data they are different numbers.</p><p>Financial targets are skewed almost everywhere: P&amp;L, drawdowns, trade sizes, durations, loss given default. The snippet takes a lognormal sample, where the mean is <code>exp(1/2)</code> and the median is one, and shows the two minimisers landing roughly sixty-five per cent apart on identical data. Neither is wrong. They answer different questions, and the modeller who never asked which question was being answered has simply let the optimiser choose.</p><p>A risk team cares because a 'forecast' handed over without its loss function is unusable: hedging wants a conditional mean, position limits want a conditional quantile, and sizing them from each other is a real way to lose money.</p>",
          "formula": "\\mathbb{E}[(Y-c)^2]\\ \\text{minimised at } c=\\mathbb{E}[Y];\\qquad \\mathbb{E}|Y-c|\\ \\text{minimised at } c=\\mathrm{median}(Y)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\nfrom scipy.optimize import minimize_scalar\n\nrng = np.random.default_rng(1)\ny = rng.lognormal(mean=0.0, sigma=1.0, size=200_000)   # skewed, like a P&L\n\nl2 = minimize_scalar(lambda c: np.mean((y - c) ** 2), bracket=(0.5, 3.0)).x\nl1 = minimize_scalar(lambda c: np.mean(np.abs(y - c)), bracket=(0.5, 3.0)).x\n\nprint(f\"squared-error minimiser  {l2:7.4f}   sample mean    {y.mean():7.4f}   \"\n      f\"theory exp(1/2) {np.exp(0.5):7.4f}\")\nprint(f\"absolute-error minimiser {l1:7.4f}   sample median  {np.median(y):7.4f}   \"\n      f\"theory 1.0000\")\nprint(f\"the two targets differ by {100 * (l2 / l1 - 1):.1f}% on the same data\")\n",
            "output": "squared-error minimiser   1.6438   sample mean     1.6438   theory exp(1/2)  1.6487\nabsolute-error minimiser  0.9979   sample median   0.9979   theory 1.0000\nthe two targets differ by 64.7% on the same data"
          }
        },
        {
          "name": "Universal approximation is an existence theorem",
          "explain": "<p>The classical result says a single hidden layer with enough units can approximate any continuous function on a compact set to any accuracy. It is quoted constantly and almost always misused, because it is an existence statement about weights, not a promise that gradient descent will find them, that the number of units needed is modest, or that the fitted function will generalise off the training set.</p><p>The snippet separates the two questions cleanly. It freezes a random hidden layer and fits only the output weights by least squares, which is a convex problem with a closed-form answer. Approximation error falls steadily as width grows, from about one to under a hundredth, and not one gradient step was taken. That is the approximation half of the story living entirely on its own.</p><p>What the theorem does not supply is the statistical half: with a finite noisy sample, the width that approximates best is emphatically not the width that predicts best. A research team should treat capacity as a budget to be spent against sample size, not as evidence that a bigger model must be a better one.</p>",
          "formula": "\\forall \\varepsilon>0\\ \\exists m,\\ \\sup_{x\\in K}\\Big|f(x)-\\sum_{j=1}^{m} c_j\\,\\sigma(w_j^\\top x + b_j)\\Big| < \\varepsilon",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(2)\nf = lambda x: np.sin(3.0 * x) + 0.3 * x ** 2\nxs = np.linspace(-2.0, 2.0, 400)[:, None]\ntarget = f(xs).ravel()\n\nWpool = 2.0 * rng.normal(size=(1, 256))\nbpool = 2.0 * rng.normal(size=256)\nHpool = np.maximum(xs @ Wpool + bpool, 0.0)            # random ReLU features\nfor m in (4, 16, 64, 256):\n    H = Hpool[:, :m]                                   # nested, so error can only fall\n    w, *_ = np.linalg.lstsq(H, target, rcond=None)     # only the output layer is fitted\n    print(f\"width {m:4d}   sup error {np.abs(H @ w - target).max():.5f}\")\nprint(\"width grows, error falls -- but nothing here was learned by gradient descent\")\n",
            "output": "width    4   sup error 1.07856\nwidth   16   sup error 0.46376\nwidth   64   sup error 0.07855\nwidth  256   sup error 0.00872\nwidth grows, error falls -- but nothing here was learned by gradient descent"
          }
        },
        {
          "name": "Finance is the low signal-to-noise regime",
          "explain": "<p>Image and language tasks have a near-deterministic label: the digit really is a seven and the sentence really is in French. A daily return has a predictable component measured in fractions of a per cent of its variance. That single fact reshapes every modelling decision in this course.</p><p>The snippet builds the honest version of the situation: two hundred and fifty observations, forty candidate predictors, and one weak real signal worth a population R-squared of about half a per cent. Ordinary least squares reports an in-sample R-squared near nineteen per cent, which is almost exactly the ratio of parameters to observations plus the true signal, and its out-of-sample R-squared is negative. The fit did not discover anything; it spent its degrees of freedom memorising noise, and the in-sample number is a mechanical artefact of that spending.</p><p>Every regularisation technique in weeks three and four, and the scepticism about reinforcement learning in week ten, is a response to this regime. A desk cares because the cost of a model that looks good in-sample is not zero: it is the capital allocated to it before the out-of-sample evidence arrives.</p>",
          "formula": "\\mathbb{E}\\big[R^2_{\\text{in}}\\big] \\approx R^2_{\\text{true}} + \\frac{p}{n}\\left(1 - R^2_{\\text{true}}\\right)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(3)\nn, p = 250, 40\nbeta = np.zeros(p); beta[0] = 0.07                    # one weak true predictor\nX  = rng.normal(size=(n, p)); y  = X @ beta + rng.normal(size=n)\nXo = rng.normal(size=(n, p)); yo = Xo @ beta + rng.normal(size=n)\n\nbhat, *_ = np.linalg.lstsq(X, y, rcond=None)\nr2 = lambda yy, yh: 1.0 - ((yy - yh) ** 2).sum() / ((yy - yy.mean()) ** 2).sum()\n\nprint(f\"population R^2      {beta[0] ** 2 / (beta[0] ** 2 + 1):8.4f}\")\nprint(f\"in-sample R^2       {r2(y, X @ bhat):8.4f}   (p/n = {p / n:.2f})\")\nprint(f\"out-of-sample R^2   {r2(yo, Xo @ bhat):+8.4f}\")\nprint(\"in-sample fit is almost entirely the p/n the fit spends on noise\")\n",
            "output": "population R^2        0.0049\nin-sample R^2         0.1864   (p/n = 0.16)\nout-of-sample R^2    -0.1621\nin-sample fit is almost entirely the p/n the fit spends on noise"
          }
        }
      ],
      "widget": {
        "type": "regression",
        "title": "What a real return predictor looks like",
        "params": {
          "n": 250,
          "beta": 0.07,
          "noise": 1.0,
          "seed": 3301,
          "show_resid": true
        }
      },
      "pitfalls": [
        "Quoting universal approximation as a reason to prefer a network. The theorem says a good set of weights exists; it says nothing about finding it, or about what happens off the training sample.",
        "Fitting squared error and then reporting the output as a probability or a quantile. The loss you minimised is the functional you estimated, and nothing else.",
        "Reading an in-sample R-squared on a wide regression as evidence of signal. With p predictors and n rows you get roughly p/n for free, before any signal exists."
      ],
      "check": [
        {
          "q": "You replace a 6-layer linear network with a single matrix and get identical predictions. What does that tell you?",
          "options": [
            "There is a bug in the deep network",
            "Nothing was wrong: composing affine maps gives an affine map, so the two models have the same expressive class",
            "The data is linearly separable",
            "The learning rate was too small"
          ],
          "answer": 1,
          "why": "Without a nonlinearity between layers the product of the weight matrices is a single matrix, so depth adds parameters and optimisation difficulty but not one extra function to the hypothesis class."
        },
        {
          "q": "A model is trained on squared error and its output is used as the probability of a default. The most likely problem is:",
          "options": [
            "The model is estimating a conditional mean, which is only a probability if the target is a 0/1 indicator and the output is constrained to [0,1]",
            "Squared error cannot be minimised for binary targets",
            "Cross-entropy always gives lower error",
            "The optimiser will diverge"
          ],
          "answer": 0,
          "why": "Squared error does estimate the conditional mean, which for a 0/1 target is the probability, but nothing constrains the fitted value to lie in the unit interval, so the estimate can be negative or above one and is badly calibrated in the tails."
        },
        {
          "q": "With n = 250 rows and p = 40 predictors of pure noise, what in-sample R-squared should you expect?",
          "options": [
            "About 0",
            "About 0.16",
            "About 0.5",
            "It depends entirely on the seed"
          ],
          "answer": 1,
          "why": "The expected in-sample R-squared of a least-squares fit on pure noise is p/n, here 40/250 = 0.16; that number is a property of the arithmetic, not of the data."
        },
        {
          "q": "Which comparison would actually justify using a neural network on a daily return prediction task?",
          "options": [
            "Higher in-sample R-squared than a linear model",
            "Lower training loss after more epochs",
            "Better out-of-sample performance than a tuned ridge regression on the same features and the same splits",
            "A larger number of parameters"
          ],
          "answer": 2,
          "why": "The only meaningful benchmark is out-of-sample performance against a well-tuned linear baseline on identical data and identical splits; everything else is a measure of capacity, not of predictive value."
        }
      ]
    },
    {
      "n": 2,
      "title": "Backpropagation and automatic differentiation",
      "topics": [
        "the backward pass",
        "gradient checking",
        "reverse-mode autodiff",
        "initialisation and gradient scale",
        "numerically stable losses"
      ],
      "concepts": [
        {
          "name": "The backward pass is the chain rule, bookkept",
          "explain": "<p>Backpropagation is not an algorithm for computing derivatives, it is the chain rule applied in a particular order with the intermediate results stored. Run the forward pass and keep every pre-activation. Then start from the loss, push the derivative backwards one layer at a time, and at each layer form two things: the gradient with respect to that layer's parameters, and the gradient with respect to its input, which is what the previous layer needs.</p><p>For a one-hidden-layer network with a tanh the whole derivation is four lines, and the snippet writes them out: the output error, the parameter gradients of the second layer, the error pushed back through the weights, and the elementwise multiplication by the tanh derivative. The discipline that makes this trustworthy is the gradient check. Compare every analytic partial against a central finite difference; agreement to around one part in ten billion means the derivation and the code agree.</p><p>Write the check once and keep it. A quant team that cannot gradient-check a custom loss or a custom layer will eventually ship a model whose gradient is subtly wrong, and a subtly wrong gradient trains to a plausible-looking wrong answer rather than crashing.</p>",
          "formula": "\\delta^{(L)} = \\nabla_{\\hat y} \\mathcal{L},\\qquad \\delta^{(l)} = \\left(W_{l+1}^\\top \\delta^{(l+1)}\\right)\\odot \\sigma'(z^{(l)}),\\qquad \\nabla_{W_l}\\mathcal{L} = \\delta^{(l)} a^{(l-1)\\top}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(10)\nd, h, n = 3, 5, 20\nX = rng.normal(size=(n, d)); yt = rng.normal(size=(n, 1))\np0 = np.concatenate([rng.normal(size=d * h) * 0.5, np.zeros(h),\n                     rng.normal(size=h) * 0.5, np.zeros(1)])\n\ndef unpack(p):\n    i = 0\n    W1 = p[i:i + d * h].reshape(d, h); i += d * h\n    b1 = p[i:i + h]; i += h\n    W2 = p[i:i + h].reshape(h, 1); i += h\n    return W1, b1, W2, p[i:i + 1]\n\ndef fwd(p):\n    W1, b1, W2, b2 = unpack(p)\n    Z = X @ W1 + b1; A = np.tanh(Z); Y = A @ W2 + b2\n    return 0.5 * np.mean((Y - yt) ** 2), (Z, A, Y, W1, W2)\n\ndef backprop(p):\n    L, (Z, A, Y, W1, W2) = fwd(p)\n    dY = (Y - yt) / n                       # dL/dY\n    gW2 = A.T @ dY; gb2 = dY.sum(axis=0)\n    dA = dY @ W2.T; dZ = dA * (1 - np.tanh(Z) ** 2)\n    gW1 = X.T @ dZ; gb1 = dZ.sum(axis=0)\n    return L, np.concatenate([gW1.ravel(), gb1, gW2.ravel(), gb2])\n\nL, g = backprop(p0)\neps = 1e-6\nnum = np.array([(fwd(p0 + eps * np.eye(p0.size)[k])[0]\n                 - fwd(p0 - eps * np.eye(p0.size)[k])[0]) / (2 * eps)\n                for k in range(p0.size)])\nprint(f\"loss                         {L:.8f}\")\nprint(f\"parameters checked           {p0.size}\")\nprint(f\"max |backprop - central diff| {np.abs(g - num).max():.3e}\")\nprint(f\"max relative error            {np.abs(g - num).max() / np.abs(num).max():.3e}\")\n",
            "output": "loss                         0.55266828\nparameters checked           26\nmax |backprop - central diff| 1.325e-10\nmax relative error            2.718e-10"
          }
        },
        {
          "name": "Reverse mode, and why it is the cheap direction",
          "explain": "<p>Automatic differentiation comes in two directions. Forward mode propagates a derivative with respect to one input through the whole computation, so a function of n inputs costs n forward sweeps. Reverse mode propagates the derivative of one output backwards, so a scalar-valued function of any number of inputs costs a single sweep at roughly the price of two forward evaluations. Training a network is exactly the scalar-output case, which is why every framework you will use is reverse mode.</p><p>The snippet implements reverse mode from nothing in about thirty lines: a node holds a value, a list of parents with the local partial derivative on each edge, and a gradient accumulator. Building the expression builds the graph; a topological sort and one backwards walk accumulates the chain rule over every path. Both partials of <code>xy + sin(x)e^y</code> come out of one call, matching the hand derivation to eight decimals.</p><p>Knowing what is under the framework is what lets you read a memory profile: reverse mode buys its speed by storing the whole forward graph, which is why activation memory, not parameter count, is usually what limits a model on the machine you actually have.</p>",
          "formula": "\\text{reverse mode: } \\operatorname{cost}\\big(\\nabla f\\big) \\approx c\\cdot \\operatorname{cost}(f)\\ \\text{ with } c\\in[2,4],\\ \\text{independent of } \\dim(x)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n\nclass Node:\n    \"\"\"Scalar reverse-mode autodiff: a value, a gradient slot and a tape.\"\"\"\n    def __init__(self, v, parents=()):\n        self.v, self.parents, self.g = float(v), parents, 0.0\n\n    def __add__(self, o): o = wrap(o); return Node(self.v + o.v, ((self, 1.0), (o, 1.0)))\n    def __mul__(self, o): o = wrap(o); return Node(self.v * o.v, ((self, o.v), (o, self.v)))\n    def sin(self):        return Node(np.sin(self.v), ((self, np.cos(self.v)),))\n    def exp(self):        e = np.exp(self.v); return Node(e, ((self, e),))\n\n    def backward(self):\n        order, seen = [], set()\n        def visit(nd):\n            if id(nd) in seen: return\n            seen.add(id(nd))\n            for pr, _ in nd.parents: visit(pr)\n            order.append(nd)\n        visit(self)\n        self.g = 1.0\n        for nd in reversed(order):\n            for pr, local in nd.parents:\n                pr.g += nd.g * local\n\n\ndef wrap(o): return o if isinstance(o, Node) else Node(o)\n\nx, y = Node(1.3), Node(-0.7)\nf = x * y + x.sin() * y.exp()          # f = xy + sin(x) e^y\nf.backward()\ngx = y.v + np.cos(x.v) * np.exp(y.v)\ngy = x.v + np.sin(x.v) * np.exp(y.v)\nprint(f\"f          = {f.v:.8f}\")\nprint(f\"df/dx tape = {x.g:.8f}   analytic = {gx:.8f}\")\nprint(f\"df/dy tape = {y.g:.8f}   analytic = {gy:.8f}\")\nprint(f\"one backward pass gave both partials; forward mode needs {2} passes\")\n",
            "output": "f          = -0.43151117\ndf/dx tape = -0.56716401   analytic = -0.56716401\ndf/dy tape = 1.77848883   analytic = 1.77848883\none backward pass gave both partials; forward mode needs 2 passes"
          }
        },
        {
          "name": "Initialisation sets whether a gradient survives depth",
          "explain": "<p>The gradient reaching layer one is a product of depth Jacobians. Each Jacobian is a weight matrix multiplied by a diagonal of activation derivatives, so the norm of the product behaves roughly like a scale factor raised to the depth. Slightly below one and the gradient vanishes geometrically; slightly above one and it explodes. Neither failure announces itself: a vanishing gradient looks like a network that trains its last layer and ignores the rest.</p><p>The snippet fixes the width and sweeps the initialisation scale. At scale one half the gradient norm at the input falls by nine orders of magnitude over thirty layers. At scale one point six it grows by an order of magnitude and would overflow at realistic depths. Near one it stays usable. That is the entire content of the Glorot and He initialisation rules: choose the variance so the per-layer factor sits near one for your particular nonlinearity.</p><p>The practical reading for a research team is that 'the model would not train' is rarely a statement about the data. Check the gradient norm per layer before changing the architecture, because an initialisation constant is a cheaper fix than a redesign.</p>",
          "formula": "\\frac{\\partial \\mathcal{L}}{\\partial h^{(0)}} = \\prod_{l=1}^{L} \\left(W_l^\\top D_l\\right)\\frac{\\partial \\mathcal{L}}{\\partial h^{(L)}},\\qquad \\mathrm{Var}(W_{ij}) \\approx \\frac{2}{n_{\\text{in}}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(11)\nwidth = 64\nx = rng.normal(size=(width, 1))\n\ndef grad_norm_at_input(depth, scale):\n    \"\"\"||dL/dh_0|| for L = sum(h_depth), tanh layers, weights ~ N(0, scale^2/width).\"\"\"\n    Ws = [scale * rng.normal(size=(width, width)) / np.sqrt(width) for _ in range(depth)]\n    h, pre = x, []\n    for W in Ws:\n        z = W @ h; pre.append(z); h = np.tanh(z)\n    g = np.ones_like(h)\n    for W, z in zip(reversed(Ws), reversed(pre)):\n        g = W.T @ (g * (1 - np.tanh(z) ** 2))\n    return np.linalg.norm(g)\n\nprint(\"scale   depth 2    depth 10    depth 30\")\nfor scale in (0.5, 1.0, 1.6):\n    row = \"   \".join(f\"{grad_norm_at_input(d, scale):9.3e}\" for d in (2, 10, 30))\n    print(f\"{scale:4.1f}   {row}\")\nprint(\"scale 0.5 vanishes with depth; scale 1.6 explodes; near 1 it is usable\")\n",
            "output": "scale   depth 2    depth 10    depth 30\n 0.5   1.538e+00   6.379e-03   3.751e-09\n 1.0   5.548e+00   2.474e+00   1.776e+00\n 1.6   6.506e+00   2.275e+01   7.404e+01\nscale 0.5 vanishes with depth; scale 1.6 explodes; near 1 it is usable"
          }
        },
        {
          "name": "Stable losses: log-sum-exp and the fused gradient",
          "explain": "<p>A softmax written literally as exponentials over their sum overflows as soon as a logit exceeds about seven hundred, and a deep network with no output normalisation will produce such logits. The fix is the log-sum-exp trick: subtract the maximum logit before exponentiating. It is algebraically the identity map and numerically the difference between a probability vector and a vector of <code>nan</code>.</p><p>The second half of the snippet shows the other reason to treat softmax and cross-entropy as one object rather than two. Differentiate the composed loss and almost everything cancels, leaving the famously clean expression: the gradient with respect to the logits is the predicted probability vector minus the one-hot label. The central-difference check confirms it to eight decimals. Computing softmax and cross-entropy separately and differentiating each is both slower and less stable.</p><p>Any desk that has debugged a model that returned <code>nan</code> after an hour of training has met this. Numerical stability is not a detail bolted on at the end; it is a property of how the loss was written down in the first place.</p>",
          "formula": "\\mathrm{LSE}(z) = z_{\\max} + \\log\\!\\sum_j e^{z_j - z_{\\max}},\\qquad \\frac{\\partial}{\\partial z}\\Big[\\mathrm{LSE}(z) - z^\\top y\\Big] = p - y",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nz = np.array([1200.0, 1201.0, 1199.0])          # logits a deep net really can produce\n\nwith np.errstate(over=\"ignore\", invalid=\"ignore\"):\n    naive = np.exp(z) / np.exp(z).sum()\nstable = np.exp(z - z.max()); stable = stable / stable.sum()\nprint(f\"naive  softmax : {naive}\")\nprint(f\"stable softmax : {np.round(stable, 6)}\")\n\ny = np.array([0.0, 1.0, 0.0])                    # one-hot label\nloss = lambda zz: np.log(np.exp(zz - zz.max()).sum()) + zz.max() - zz @ y\neps = 1e-6\nnum = np.array([(loss(z + eps * e) - loss(z - eps * e)) / (2 * eps) for e in np.eye(3)])\nprint(f\"fused gradient p - y          : {np.round(stable - y, 8)}\")\nprint(f\"central difference            : {np.round(num, 8)}\")\nprint(f\"max |difference|              : {np.abs(stable - y - num).max():.2e}\")\n",
            "output": "naive  softmax : [nan nan nan]\nstable softmax : [0.244728 0.665241 0.090031]\nfused gradient p - y          : [ 0.24472847 -0.33475904  0.09003057]\ncentral difference            : [ 0.24472854 -0.33475908  0.09003065]\nmax |difference|              : 8.00e-08"
          }
        }
      ],
      "widget": {
        "type": "code-trace",
        "title": "One backward pass, layer by layer",
        "params": {
          "lang": "python",
          "code": "Z = X @ W1 + b1\nA = tanh(Z)\nY = A @ W2 + b2\nL = 0.5*mean((Y - target)**2)\ndY = (Y - target)/n\ngW2 = A.T @ dY\ndZ = (dY @ W2.T) * (1 - tanh(Z)**2)\ngW1 = X.T @ dZ",
          "steps": [
            {
              "line": 1,
              "state": {
                "X": "(20,3)",
                "W1": "(3,5)",
                "Z": "(20,5)"
              },
              "note": "Forward: the pre-activation is cached because the backward pass needs it."
            },
            {
              "line": 2,
              "state": {
                "Z": "(20,5)",
                "A": "(20,5)"
              },
              "note": "tanh applied elementwise; A is cached too."
            },
            {
              "line": 3,
              "state": {
                "A": "(20,5)",
                "W2": "(5,1)",
                "Y": "(20,1)"
              },
              "note": "Output layer. Nothing nonlinear here."
            },
            {
              "line": 4,
              "state": {
                "L": "0.55266828"
              },
              "note": "Scalar loss: the only place reverse mode can start."
            },
            {
              "line": 5,
              "state": {
                "dY": "(20,1)"
              },
              "note": "Seed of the backward pass, divided by n because the loss is a mean."
            },
            {
              "line": 6,
              "state": {
                "gW2": "(5,1)"
              },
              "note": "Parameter gradient of layer 2: cached activation times incoming error."
            },
            {
              "line": 7,
              "state": {
                "dZ": "(20,5)"
              },
              "note": "Error pushed back through W2, then through the tanh derivative."
            },
            {
              "line": 8,
              "state": {
                "gW1": "(3,5)"
              },
              "note": "Parameter gradient of layer 1. Max error against central differences: 1.3e-10."
            }
          ]
        }
      },
      "pitfalls": [
        "Shipping a custom layer or a custom loss without a finite-difference gradient check. A wrong gradient does not crash, it trains slowly to the wrong place.",
        "Gradient-checking with a forward difference and a step of 1e-8. Use a central difference around 1e-6, or floating-point cancellation will hide a real bug behind a fake one.",
        "Blaming the data when the gradient norm at the first layer is 1e-9. That is an initialisation or an architecture-depth problem and the data never entered into it.",
        "Computing softmax and cross-entropy as two separate ops. The fused form is both more stable and algebraically simpler."
      ],
      "check": [
        {
          "q": "Why is reverse-mode autodiff the standard choice for training, rather than forward mode?",
          "options": [
            "It is more accurate",
            "The cost of a full gradient is independent of the number of parameters, because the output is a scalar",
            "It uses less memory",
            "Forward mode cannot handle nonlinearities"
          ],
          "answer": 1,
          "why": "Reverse mode costs one backward sweep per scalar output regardless of input dimension, while forward mode costs one sweep per input, so for a loss with millions of parameters reverse mode is the only feasible direction; it uses more memory, not less."
        },
        {
          "q": "Your analytic gradient and a central finite difference agree to 1e-3 relative error. What is the most likely explanation?",
          "options": [
            "That is normal precision for a central difference",
            "There is a bug in the analytic gradient or in one branch of the backward pass",
            "The learning rate is wrong",
            "The loss is not differentiable"
          ],
          "answer": 1,
          "why": "A central difference with a sensible step should agree with a correct analytic gradient to roughly 1e-8 or better in double precision, so an error at the 1e-3 level is a bug, not numerical noise."
        },
        {
          "q": "Gradient norms at the first layer fall by nine orders of magnitude over thirty layers. The most direct fix is:",
          "options": [
            "A smaller learning rate",
            "More training epochs",
            "Rescale the initialisation so the per-layer Jacobian factor sits near one, and add skip connections or gating",
            "A larger batch size"
          ],
          "answer": 2,
          "why": "The product of per-layer Jacobians is geometric in depth, so the cure is to make the per-layer factor close to one through initialisation variance and architectural shortcuts; no learning rate or epoch count fixes a gradient that has already underflowed."
        },
        {
          "q": "Subtracting the maximum logit before exponentiating in a softmax changes the result by:",
          "options": [
            "A constant factor",
            "Nothing at all, algebraically",
            "The maximum logit",
            "It changes the gradient"
          ],
          "answer": 1,
          "why": "The numerator and denominator are both multiplied by exp(-z_max), which cancels exactly, so the trick is an algebraic identity that only alters the floating-point path taken to the same answer."
        }
      ]
    },
    {
      "n": 3,
      "title": "Optimisers and training dynamics",
      "topics": [
        "gradient descent on quadratics",
        "conditioning",
        "momentum",
        "adaptive methods",
        "the stability threshold"
      ],
      "concepts": [
        {
          "name": "Conditioning, not dimension, sets the convergence rate",
          "explain": "<p>Near a minimum, any smooth loss looks quadratic, so the behaviour of gradient descent on a quadratic is the local behaviour of gradient descent on anything. In the eigenbasis of the Hessian the iteration decouples completely: each coordinate is multiplied by one minus the step size times its eigenvalue, every step. The step size you may take is capped by the largest eigenvalue, and the slowest coordinate to converge is governed by the smallest, so the number of iterations scales with the condition number.</p><p>The snippet confirms the textbook rate exactly. With the optimal fixed step, the per-iteration contraction is the ratio of condition number minus one to condition number plus one, to six decimals, for condition numbers of two, ten and a hundred. The dimension of the problem never appears.</p><p>This is the reason feature standardisation is not cosmetic. Two predictors measured in basis points and in percent differ by a factor of ten thousand in scale and put a factor of a hundred million into the condition number of the Gram matrix. A research team that standardises inputs before training is buying convergence speed, not tidiness.</p>",
          "formula": "\\|w_k - w^\\star\\| \\le \\left(\\frac{\\kappa-1}{\\kappa+1}\\right)^{k}\\|w_0 - w^\\star\\|,\\qquad \\kappa = \\frac{\\lambda_{\\max}}{\\lambda_{\\min}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nfor kappa in (2.0, 10.0, 100.0):\n    L, mu = kappa, 1.0                       # f(w) = (1/2)(mu w0^2 + L w1^2)\n    eig = np.array([mu, L])\n    lr = 2.0 / (L + mu)                      # the optimal fixed step\n    w = np.array([1.0, 1.0])\n    f0 = 0.5 * eig @ w ** 2\n    for _ in range(50):\n        w = w - lr * eig * w\n    emp = (0.5 * eig @ w ** 2 / f0) ** (1 / 100.0)     # per-iteration factor on ||w||\n    thy = (kappa - 1) / (kappa + 1)\n    print(f\"kappa {kappa:6.1f}   empirical contraction {emp:.6f}   \"\n          f\"theory (k-1)/(k+1) {thy:.6f}\")\nprint(\"iterations to a fixed accuracy scale linearly in the condition number\")\n",
            "output": "kappa    2.0   empirical contraction 0.333333   theory (k-1)/(k+1) 0.333333\nkappa   10.0   empirical contraction 0.818182   theory (k-1)/(k+1) 0.818182\nkappa  100.0   empirical contraction 0.980198   theory (k-1)/(k+1) 0.980198\niterations to a fixed accuracy scale linearly in the condition number"
          }
        },
        {
          "name": "Momentum turns kappa into root kappa",
          "explain": "<p>Plain gradient descent on an ill-conditioned quadratic zig-zags: it bounces across the narrow direction while creeping along the flat one. Momentum, in its heavy-ball form, keeps a running velocity so that the oscillating components cancel and the consistent component accumulates. With the optimal parameters the iteration count to a fixed accuracy drops from order kappa to order square root of kappa, which is the single biggest free improvement in first-order optimisation.</p><p>The snippet measures it rather than asserting it. At condition number one thousand plain gradient descent needs over seven thousand iterations to reach a tolerance that heavy ball reaches in three hundred and thirty-four, a speed-up of about twenty-two against a square root of thirty-two. The gap widens as conditioning worsens, which is exactly the predicted shape.</p><p>Two warnings ride along. The optimal momentum coefficient depends on the condition number you do not know, and heavy ball is not monotone, so the loss can rise for a few steps on the way down. A practitioner who kills a run at the first uptick will throw away the method that was about to win.</p>",
          "formula": "v_{k+1} = \\beta v_k - \\alpha \\nabla f(w_k),\\quad w_{k+1}=w_k+v_{k+1},\\qquad \\beta^\\star=\\left(\\tfrac{\\sqrt{\\kappa}-1}{\\sqrt{\\kappa}+1}\\right)^{2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n\ndef iters_to(tol, kappa, momentum):\n    eig = np.array([1.0, kappa])\n    w = np.ones(2); v = np.zeros(2)\n    lr = 4.0 / (np.sqrt(kappa) + 1.0) ** 2 if momentum else 2.0 / (1.0 + kappa)\n    beta = ((np.sqrt(kappa) - 1) / (np.sqrt(kappa) + 1)) ** 2 if momentum else 0.0\n    for k in range(1, 200_001):\n        v = beta * v - lr * eig * w\n        w = w + v\n        if 0.5 * eig @ w ** 2 < tol:\n            return k\n    return -1\n\n\nprint(\" kappa   plain GD   heavy ball   ratio   sqrt(kappa)\")\nfor kappa in (10.0, 100.0, 1000.0):\n    a, b = iters_to(1e-10, kappa, False), iters_to(1e-10, kappa, True)\n    print(f\"{kappa:6.0f}   {a:8d}   {b:10d}   {a / b:5.1f}   {np.sqrt(kappa):9.1f}\")\n",
            "output": " kappa   plain GD   heavy ball   ratio   sqrt(kappa)\n    10         62           25     2.5         3.2\n   100        674           93     7.2        10.0\n  1000       7311          334    21.9        31.6"
          }
        },
        {
          "name": "Adaptive steps: what Adam actually does",
          "explain": "<p>Adam keeps two exponential moving averages per parameter: one of the gradient and one of its square. The update is the first divided by the square root of the second, with bias correction for the fact that both averages start at zero. The effect is a per-coordinate step size that is large where gradients have been small and consistent and small where they have been large or erratic, which makes the method far less sensitive to the scaling of individual parameters than plain gradient descent.</p><p>The snippet implements it in six lines and runs both optimisers from the same initialisation on the same tiny network for the same four hundred steps. Adam reaches a training loss of about 0.0041 against 0.0095 for plain gradient descent at the same learning rate. Note the printed irreducible term: the noise variance in the data puts a floor of 0.005 on what any honest fit should reach, so Adam's lower number is partly faster optimisation and partly more overfitting.</p><p>That ambiguity is the point. Faster descent on the training loss is not the objective; a desk should compare optimisers on validation loss at a fixed compute budget, because an optimiser that reaches a sharper minimum sooner can generalise worse.</p>",
          "formula": "m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t,\\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2,\\quad w_t = w_{t-1} - \\alpha\\,\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(12)\nn, d, h = 256, 4, 16\nX = rng.normal(size=(n, d))\nytrue = np.tanh(X @ rng.normal(size=d)) + 0.1 * rng.normal(size=n)\nytrue = ytrue[:, None]\ninit = [rng.normal(size=(d, h)) / np.sqrt(d), np.zeros(h),\n        rng.normal(size=(h, 1)) / np.sqrt(h), np.zeros(1)]\n\n\ndef loss_and_grads(P):\n    W1, b1, W2, b2 = P\n    Z = X @ W1 + b1; A = np.tanh(Z); Y = A @ W2 + b2\n    L = 0.5 * np.mean((Y - ytrue) ** 2)\n    dY = (Y - ytrue) / n\n    dZ = (dY @ W2.T) * (1 - np.tanh(Z) ** 2)\n    return L, [X.T @ dZ, dZ.sum(0), A.T @ dY, dY.sum(0)]\n\n\ndef run(kind, steps=400, lr=0.05):\n    P = [p.copy() for p in init]\n    m = [np.zeros_like(p) for p in P]; v = [np.zeros_like(p) for p in P]\n    for t in range(1, steps + 1):\n        L, G = loss_and_grads(P)\n        for i in range(4):\n            if kind == \"sgd\":\n                P[i] -= lr * G[i]\n            else:\n                m[i] = 0.9 * m[i] + 0.1 * G[i]\n                v[i] = 0.999 * v[i] + 0.001 * G[i] ** 2\n                mh = m[i] / (1 - 0.9 ** t); vh = v[i] / (1 - 0.999 ** t)\n                P[i] -= lr * mh / (np.sqrt(vh) + 1e-8)\n    return loss_and_grads(P)[0]\n\n\nprint(f\"initial loss          {loss_and_grads(init)[0]:.6f}\")\nprint(f\"plain GD,  400 steps  {run('sgd'):.6f}\")\nprint(f\"Adam,      400 steps  {run('adam'):.6f}\")\nprint(f\"irreducible term      {0.5 * 0.01:.6f}  (training loss below this is fitting noise)\")\n",
            "output": "initial loss          0.184886\nplain GD,  400 steps  0.009462\nAdam,      400 steps  0.004080\nirreducible term      0.005000  (training loss below this is fitting noise)"
          }
        },
        {
          "name": "There is a hard stability threshold at two over L",
          "explain": "<p>On a quadratic with largest curvature L, gradient descent multiplies the corresponding coordinate by one minus the step size times L every iteration. That factor has magnitude below one precisely when the step size is below two over L. Below the threshold the iteration contracts; exactly at it, the coordinate flips sign forever with constant magnitude; above it, the iterate grows geometrically and overflows.</p><p>The snippet sweeps the step size around the threshold and prints the loss after two hundred steps. At 0.49 the loss is about 1.6e-07 and falling, at exactly 0.50 it sits at 2.0 and oscillates forever, and at 0.51 it has already reached 1.3e+07. There is nothing gradual about the transition, and the threshold depends only on the largest eigenvalue, which is why one badly scaled feature can make an otherwise sensible learning rate unstable.</p><p>This is the theory behind a piece of standard practice: if a loss turns to <code>nan</code> in the first few hundred steps, halve the learning rate before you touch anything else, and if that fixes it, the real problem was almost certainly an unnormalised input or a badly initialised layer inflating the curvature.</p>",
          "formula": "w_{k+1} = (1-\\alpha\\lambda)\\,w_k \\ \\Rightarrow\\ \\text{convergence iff } 0 < \\alpha < \\frac{2}{\\lambda_{\\max}}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nLmax = 4.0                                  # largest curvature of f(w)=0.5 w' H w\neig = np.array([0.5, 1.0, Lmax])\nprint(f\"stability threshold 2/L = {2.0 / Lmax:.4f}\")\nfor lr in (0.10, 0.40, 0.49, 0.50, 0.51, 0.60):\n    w = np.ones(3)\n    for _ in range(200):\n        w = w - lr * eig * w\n    f = 0.5 * eig @ w ** 2\n    tag = (\"converges\" if np.isfinite(f) and f < 1e-6\n           else \"oscillates, never converges\" if np.isfinite(f) and f < 10 else \"DIVERGES\")\n    print(f\"lr {lr:4.2f}   f after 200 steps {f:11.3e}   {tag}\")\n",
            "output": "stability threshold 2/L = 0.5000\nlr 0.10   f after 200 steps   3.072e-10   converges\nlr 0.40   f after 200 steps   4.305e-40   converges\nlr 0.49   f after 200 steps   1.620e-07   converges\nlr 0.50   f after 200 steps   2.000e+00   oscillates, never converges\nlr 0.51   f after 200 steps   1.301e+07   DIVERGES\nlr 0.60   f after 200 steps   5.653e+58   DIVERGES"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Loss against iteration for three step sizes",
        "params": {
          "xlab": "Iteration",
          "ylab": "Loss (log scale)",
          "log": true,
          "series": [
            {
              "name": "step 0.10 (safe)",
              "x": [
                0,
                25,
                50,
                75,
                100,
                150,
                200
              ],
              "y": [
                2.75,
                0.02181,
                0.001493,
                0.000114,
                8.764e-06,
                5.188e-08,
                3.072e-10
              ]
            },
            {
              "name": "step 0.49 (just inside 2/L)",
              "x": [
                0,
                25,
                50,
                75,
                100,
                150,
                200
              ],
              "y": [
                2.75,
                0.2598,
                0.03374,
                0.004382,
                0.0005692,
                9.603e-06,
                1.62e-07
              ]
            },
            {
              "name": "step 0.51 (past 2/L)",
              "x": [
                0,
                25,
                50,
                75,
                100,
                150,
                200
              ],
              "y": [
                2.75,
                14.21,
                101.0,
                717.8,
                5101.0,
                257700.0,
                13010000.0
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Tuning the learning rate before standardising the inputs. Conditioning sets both the stable step and the convergence rate, so you are tuning a moving target.",
        "Comparing optimisers on training loss. Adam reaching a lower training loss than gradient descent at the same step count can mean faster optimisation or more overfitting, and the two look identical from there.",
        "Killing a momentum run because the loss rose for a few steps. Heavy ball is not a descent method; non-monotonicity is expected behaviour, not a bug.",
        "Assuming the stability threshold is a soft boundary. Past two over the largest curvature the iteration diverges geometrically, with no warning band."
      ],
      "check": [
        {
          "q": "Gradient descent on a quadratic with condition number 400 needs roughly how many times more iterations than one with condition number 100?",
          "options": [
            "2",
            "4",
            "16",
            "400"
          ],
          "answer": 1,
          "why": "Iteration count for plain gradient descent scales linearly in the condition number, so going from 100 to 400 multiplies it by about four; the square-root scaling would be the momentum answer."
        },
        {
          "q": "Your loss becomes nan within 50 steps. The first thing to try is:",
          "options": [
            "Add dropout",
            "Halve the learning rate",
            "Train for more epochs",
            "Increase the batch size"
          ],
          "answer": 1,
          "why": "Blow-up in the first few steps is almost always a step size above the two-over-largest-curvature stability threshold, and halving the learning rate both tests and fixes that hypothesis in one run."
        },
        {
          "q": "What does Adam's second moment estimate v_t actually buy you?",
          "options": [
            "An unbiased estimate of the gradient",
            "A per-coordinate step size that is insensitive to how each parameter happens to be scaled",
            "A guarantee of convergence",
            "Lower memory use than SGD"
          ],
          "answer": 1,
          "why": "Dividing by the square root of the running second moment normalises each coordinate's effective step, which is why Adam tolerates badly scaled parameters; it costs extra memory and offers no convergence guarantee on non-convex problems."
        },
        {
          "q": "With optimal heavy-ball momentum, iterations to a fixed tolerance scale like:",
          "options": [
            "kappa",
            "sqrt(kappa)",
            "log(kappa)",
            "kappa squared"
          ],
          "answer": 1,
          "why": "Heavy ball with the optimal coefficient achieves an accelerated rate whose iteration count grows like the square root of the condition number, which the snippet measures as a 22x speed-up at kappa = 1000 against a predicted 32."
        }
      ]
    },
    {
      "n": 4,
      "title": "Regularisation, generalisation and capacity",
      "topics": [
        "weight decay as ridge",
        "early stopping",
        "dropout as a penalty",
        "double descent",
        "capacity budgeting on noisy data"
      ],
      "concepts": [
        {
          "name": "Weight decay is ridge regression in the eigenbasis",
          "explain": "<p>Adding a penalty proportional to the squared norm of the weights to a squared-error loss gives the ridge estimator, and the clearest way to see what ridge does is through the singular value decomposition of the design matrix. The ordinary least squares solution divides the data's projection onto each singular direction by that direction's singular value. Ridge multiplies each of those terms by a shrinkage factor that is near one where the singular value is large and near zero where it is small.</p><p>So ridge is not uniform shrinkage. It leaves the well-determined directions almost untouched and crushes the directions the data barely identifies, which are exactly the ones whose coefficients would otherwise be dominated by noise. The snippet verifies the identity to machine precision on an ill-conditioned design and prints the smallest filter factor falling from one to about 0.012 as the penalty grows.</p><p>A risk team reads this as the reason a penalised factor model is stable: the penalty is a statement that you do not believe the data has resolved every direction equally well, and covariance estimates in finance essentially never have.</p>",
          "formula": "\\hat\\beta_{\\lambda} = \\sum_j \\frac{s_j^2}{s_j^2+\\lambda}\\,\\frac{u_j^\\top y}{s_j}\\,v_j",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(20)\nn, p = 60, 8\nX = rng.normal(size=(n, p)) @ np.diag(np.linspace(1.0, 0.05, p))   # ill-conditioned\nbeta = rng.normal(size=p)\ny = X @ beta + 0.5 * rng.normal(size=n)\n\nU, s, Vt = np.linalg.svd(X, full_matrices=False)\nfor lam in (0.0, 0.1, 1.0, 10.0):\n    direct = np.linalg.solve(X.T @ X + lam * np.eye(p), X.T @ y)\n    filt = s ** 2 / (s ** 2 + lam)                                 # shrinkage factors\n    spectral = Vt.T @ (filt * (U.T @ y) / np.where(s > 0, s, 1))\n    print(f\"lambda {lam:5.1f}   ||beta||  {np.linalg.norm(direct):7.3f}   \"\n          f\"max|solve - SVD filter| {np.abs(direct - spectral).max():.2e}   \"\n          f\"smallest filter factor {filt.min():.4f}\")\nprint(\"weight decay IS ridge: it damps the directions the data barely identifies\")\n",
            "output": "lambda   0.0   ||beta||    4.529   max|solve - SVD filter| 3.11e-15   smallest filter factor 1.0000\nlambda   0.1   ||beta||    3.224   max|solve - SVD filter| 1.11e-15   smallest filter factor 0.5580\nlambda   1.0   ||beta||    2.343   max|solve - SVD filter| 8.88e-16   smallest filter factor 0.1121\nlambda  10.0   ||beta||    1.770   max|solve - SVD filter| 8.88e-16   smallest filter factor 0.0125\nweight decay IS ridge: it damps the directions the data barely identifies"
          }
        },
        {
          "name": "Early stopping is regularisation you already paid for",
          "explain": "<p>Run gradient descent on a least-squares loss from a zero initialisation and look at the iterate in the eigenbasis of the Gram matrix. Each coordinate approaches its least-squares value at a rate set by its eigenvalue, so the large-eigenvalue directions, which are the well-determined ones, converge first and the small ones arrive last. Stopping early therefore keeps the well-determined part and leaves the poorly determined part near zero, which is what ridge does through a different mechanism.</p><p>The snippet makes the correspondence visible. Test error falls to about 0.767 by step ten, then climbs back to 0.879 and stays there once the iterate has reached the least-squares solution. The best early stop and the best ridge penalty land within four per cent of each other, from opposite directions: one truncates the optimisation, the other truncates the spectrum.</p><p>The practical consequence is that a validation curve that turns upward is not reporting a bug, it is reporting the moment your model started fitting noise. A team with no held-out set has no way to see that moment and will train past it every time.</p>",
          "formula": "w_k = \\sum_j \\Big[1-(1-\\alpha s_j^2)^k\\Big]\\frac{u_j^\\top y}{s_j}\\,v_j\\quad\\text{versus}\\quad \\frac{s_j^2}{s_j^2+\\lambda}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(21)\nn, p = 80, 40\nX = rng.normal(size=(n, p)); beta = rng.normal(size=p) / np.sqrt(p)\ny = X @ beta + 0.7 * rng.normal(size=n)\nXt = rng.normal(size=(2000, p)); yt = Xt @ beta + 0.7 * rng.normal(size=2000)\ntest = lambda b: np.mean((yt - Xt @ b) ** 2)\n\nH = X.T @ X / n; g = X.T @ y / n\nlr = 1.0 / np.linalg.eigvalsh(H).max()\nw = np.zeros(p); best = (1e9, 0)\nfor t in range(1, 4001):\n    w = w - lr * (H @ w - g)\n    if t in (1, 10, 50, 200, 1000, 4000):\n        print(f\"gradient step {t:5d}   test MSE {test(w):.4f}\")\n    e = test(w)\n    if e < best[0]: best = (e, t)\nridge = min((test(np.linalg.solve(X.T @ X + lam * np.eye(p), X.T @ y)), lam)\n            for lam in np.exp(np.linspace(-4, 6, 200)))\nprint(f\"best early stop  step {best[1]:5d}   test MSE {best[0]:.4f}\")\nprint(f\"best ridge       lam  {ridge[1]:7.3f}   test MSE {ridge[0]:.4f}\")\n",
            "output": "gradient step     1   test MSE 1.1445\ngradient step    10   test MSE 0.7670\ngradient step    50   test MSE 0.8635\ngradient step   200   test MSE 0.8789\ngradient step  1000   test MSE 0.8789\ngradient step  4000   test MSE 0.8789\nbest early stop  step    11   test MSE 0.7669\nbest ridge       lam   11.383   test MSE 0.7381"
          }
        },
        {
          "name": "Dropout is an L2 penalty in disguise",
          "explain": "<p>Dropout multiplies each input by an independent Bernoulli mask, rescaled so the mask has mean one. For a linear model the expected squared loss under that noise decomposes exactly: the loss you would have had without dropout, plus a penalty term equal to the variance of the mask times a sum of squared weights each weighted by the mean square of its own input. That is ridge with a data-dependent, per-feature penalty.</p><p>The snippet checks the identity by Monte Carlo. Twenty thousand random masks give an expected dropout loss of 4.544 against an analytic prediction of 4.557, with the penalty term alone worth 1.561. Having the closed form matters because it tells you what the keep probability is actually controlling: the penalty scales as one minus keep over keep, so moving the rate from 0.9 to 0.5 multiplies the implied penalty by nine.</p><p>Two consequences follow for practice. Dropout on standardised features penalises coefficients evenly, and on unstandardised features it penalises the large-scale features hardest, which is rarely what anyone intended. And at prediction time you must stop sampling and use the mean, or your forecast inherits the noise you added on purpose.</p>",
          "formula": "\\mathbb{E}_m\\big[(y-x^\\top(m\\odot w))^2\\big] = (y-x^\\top w)^2 + \\frac{1-p}{p}\\sum_j x_j^2 w_j^2",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(22)\nn, p, keep = 400, 6, 0.6\nX = rng.normal(size=(n, p))\nw = rng.normal(size=p)                                        # the weights we evaluate at\ny = X @ rng.normal(size=p) + rng.normal(size=n)\n\nplain = np.mean((y - X @ w) ** 2)\ndraws = 20_000\nmask = rng.binomial(1, keep, size=(draws, p)) / keep          # inverted dropout\nidx = rng.integers(0, n, draws)\nXi, yi = X[idx], y[idx]\nmc = np.mean((yi - np.sum(Xi * mask * w, axis=1)) ** 2)\n\npenalty = ((1 - keep) / keep) * np.sum((X ** 2).mean(axis=0) * w ** 2)\nprint(f\"plain squared loss                    {plain:.4f}\")\nprint(f\"analytic  plain + dropout penalty     {plain + penalty:.4f}\")\nprint(f\"Monte Carlo expected dropout loss     {mc:.4f}\")\nprint(f\"the penalty term alone                {penalty:.4f}  (an L2 weighted by E[x^2])\")\n",
            "output": "plain squared loss                    2.9956\nanalytic  plain + dropout penalty     4.5566\nMonte Carlo expected dropout loss     4.5442\nthe penalty term alone                1.5611  (an L2 weighted by E[x^2])"
          }
        },
        {
          "name": "Double descent and the interpolation threshold",
          "explain": "<p>The classical bias-variance picture says test error is U-shaped in capacity. It is true up to a point, and the point is where the number of parameters equals the number of observations. There the fit is forced to interpolate with essentially no freedom left over, the smallest singular value of the design is near zero, and the minimum-norm solution has enormous norm. Past that threshold, adding parameters gives the minimum-norm solution more room to interpolate smoothly, and test error falls again, often below the classical optimum.</p><p>The snippet reproduces the shape with random ReLU features and ridgeless least squares on sixty training rows. Test error climbs from 1.13 at ten features to 7.21 at fifty-eight, spikes to about 3833 at exactly sixty, and then falls back to 0.75 by four thousand features. The spike is not a numerical artefact; it is the conditioning of an exactly determined system.</p><p>The trading lesson is blunt. Model comparison near the interpolation threshold is meaningless, and the standard defence is not to pick the peak carefully but to add explicit regularisation, which flattens the spike away entirely.</p>",
          "formula": "\\hat\\beta = \\Phi^{+} y \\ \\ (\\text{minimum norm}),\\qquad \\text{risk peaks at } p/n \\to 1",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(23)\nn, d = 60, 200\nWf = rng.normal(size=(d, 4000)) / np.sqrt(d)\ntheta = rng.normal(size=d) / np.sqrt(d)\n\n\ndef data(m):\n    Z = rng.normal(size=(m, d))\n    return np.maximum(Z @ Wf, 0.0), Z @ theta + 0.3 * rng.normal(size=m)\n\n\nFtr, ytr = data(n)\nFte, yte = data(4000)\nprint(\"  p     p/n    test MSE (ridgeless least squares)\")\nfor p in (10, 30, 50, 58, 60, 62, 80, 200, 1000, 4000):\n    A = Ftr[:, :p]\n    b = np.linalg.pinv(A) @ ytr                       # minimum-norm solution\n    print(f\"{p:5d}  {p / n:5.2f}    {np.mean((yte - Fte[:, :p] @ b) ** 2):12.4f}\")\nprint(\"error peaks at the interpolation threshold p = n and falls again beyond it\")\n",
            "output": "  p     p/n    test MSE (ridgeless least squares)\n   10   0.17          1.1282\n   30   0.50          2.8044\n   50   0.83          6.4131\n   58   0.97          7.2076\n   60   1.00       3833.1831\n   62   1.03         54.1621\n   80   1.33          3.3870\n  200   3.33          1.1728\n 1000  16.67          0.7633\n 4000  66.67          0.7492\nerror peaks at the interpolation threshold p = n and falls again beyond it"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Test error against capacity: the second descent",
        "params": {
          "xlab": "Features p (n = 60 training rows)",
          "ylab": "Test MSE (log scale)",
          "log": true,
          "series": [
            {
              "name": "ridgeless least squares",
              "x": [
                10,
                30,
                50,
                58,
                60,
                62,
                80,
                200,
                1000,
                4000
              ],
              "y": [
                1.1282,
                2.8044,
                6.4131,
                7.2076,
                3833.1831,
                54.1621,
                3.387,
                1.1728,
                0.7633,
                0.7492
              ]
            },
            {
              "name": "irreducible noise",
              "x": [
                10,
                30,
                50,
                58,
                60,
                62,
                80,
                200,
                1000,
                4000
              ],
              "y": [
                0.09,
                0.09,
                0.09,
                0.09,
                0.09,
                0.09,
                0.09,
                0.09,
                0.09,
                0.09
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Applying dropout or weight decay to unstandardised features. Both penalties are implicitly weighted by feature scale, so the model quietly decides that the feature measured in large units matters least.",
        "Choosing a model size by grid search across the interpolation threshold. The spike at p equal to n makes nearby comparisons meaningless; regularise instead.",
        "Leaving dropout active at prediction time, or forgetting the rescaling, so the deployed model is a noisier object than the one that was validated.",
        "Treating a rising validation curve as a training failure rather than as the signal to stop."
      ],
      "check": [
        {
          "q": "Ridge with penalty lambda multiplies the j-th spectral coefficient of the least-squares solution by which factor?",
          "options": [
            "lambda / (s_j^2 + lambda)",
            "s_j^2 / (s_j^2 + lambda)",
            "1 / (1 + lambda)",
            "s_j / (s_j + lambda)"
          ],
          "answer": 1,
          "why": "The ridge filter factor is s_j^2/(s_j^2+lambda), which is near one for large singular values and near zero for small ones, so the penalty shrinks exactly the directions the data has failed to determine."
        },
        {
          "q": "Your test error is lowest at gradient step 11 and rises thereafter to a plateau. This is:",
          "options": [
            "A bug in the optimiser",
            "Early stopping's optimum, where the well-determined directions have converged and the noisy ones have not yet been fitted",
            "Evidence the learning rate is too high",
            "Evidence of a data leak"
          ],
          "answer": 1,
          "why": "Gradient descent from zero fits large-eigenvalue directions first, so the minimum of the test curve is the moment the useful signal has been absorbed and noise-fitting is about to begin; the plateau is the least-squares solution."
        },
        {
          "q": "You halve the dropout keep probability from 0.8 to 0.4. The implied L2 penalty changes by roughly a factor of:",
          "options": [
            "2",
            "0.5",
            "6",
            "1"
          ],
          "answer": 2,
          "why": "The implied penalty scales as (1-p)/p, which moves from 0.25 to 1.5, a factor of six, so a small-looking change in the dropout rate is a large change in regularisation strength."
        },
        {
          "q": "Test error spikes when the number of features exactly equals the number of training rows. Why?",
          "options": [
            "The matrix inverse is undefined",
            "The system is exactly determined, the smallest singular value is near zero, and the interpolating solution has an enormous norm",
            "The data is corrupted at that size",
            "Gradient descent stops converging"
          ],
          "answer": 1,
          "why": "At p = n the design is square and typically very ill-conditioned, so the unique interpolating solution has a huge norm and generalises terribly; with more features the minimum-norm interpolant has freedom to be smoother again."
        }
      ]
    },
    {
      "n": 5,
      "title": "Sequence models: recurrence, gating and attention",
      "topics": [
        "recurrent cells",
        "backpropagation through time",
        "vanishing gradients",
        "gating",
        "scaled dot-product attention",
        "what returns can teach a sequence model"
      ],
      "concepts": [
        {
          "name": "A recurrent cell, and backpropagation through time",
          "explain": "<p>A recurrent cell is one set of weights applied at every time step to a hidden state and the current input. Unrolling it over a sequence of length T produces a feed-forward network T layers deep in which every layer shares the same parameters. That shared-weight structure is the only thing that distinguishes backpropagation through time from ordinary backpropagation: the parameter gradient is a sum of contributions from every time step rather than one contribution per layer.</p><p>The snippet writes the recursion and its backward pass explicitly for a six-step, four-unit tanh cell and checks every one of its twenty-eight partial derivatives against central differences. The agreement is at the 1e-11 level, which is what tells you the accumulation over time steps was done correctly, since the commonest bug in a hand-written recurrent backward pass is overwriting rather than accumulating the shared weight gradient.</p><p>A research team that wants a model over a rolling window of market observations should know this cost structure: a recurrent model's memory grows linearly in the sequence length because every intermediate hidden state has to be kept for the backward pass, which sets a hard limit on how long a lookback you can train on.</p>",
          "formula": "h_t = \\tanh(U x_t + W h_{t-1}),\\qquad \\nabla_W \\mathcal{L} = \\sum_{t=1}^{T}\\delta_t\\,h_{t-1}^{\\top}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(30)\nT, di, dh = 6, 2, 4\nX = rng.normal(size=(T, di)); target = 0.4\nsizes = [(dh, di), (dh, dh), (1, dh)]\np0 = np.concatenate([rng.normal(size=dh * di) * 0.4,\n                     rng.normal(size=dh * dh) * 0.4,\n                     rng.normal(size=dh) * 0.4])\n\ndef split(p):\n    i = 0; out = []\n    for r, c in sizes:\n        out.append(p[i:i + r * c].reshape(r, c)); i += r * c\n    return out\n\ndef forward(p):\n    U, W, V = split(p)\n    h = np.zeros(dh); hs = [h]\n    for t in range(T):\n        h = np.tanh(U @ X[t] + W @ h); hs.append(h)\n    yhat = float(V.ravel() @ h)\n    return 0.5 * (yhat - target) ** 2, (hs, yhat, U, W, V)\n\ndef bptt(p):\n    L, (hs, yhat, U, W, V) = forward(p)\n    gV = (yhat - target) * hs[-1]\n    gU = np.zeros_like(U); gW = np.zeros_like(W)\n    dh_t = (yhat - target) * V.ravel()                 # dL/dh_T\n    for t in range(T, 0, -1):\n        dz = dh_t * (1 - hs[t] ** 2)                   # through the tanh\n        gU += np.outer(dz, X[t - 1])\n        gW += np.outer(dz, hs[t - 1])\n        dh_t = W.T @ dz                                # one step further back\n    return L, np.concatenate([gU.ravel(), gW.ravel(), gV.ravel()])\n\nL, g = bptt(p0)\neps = 1e-6\nnum = np.array([(forward(p0 + eps * e)[0] - forward(p0 - eps * e)[0]) / (2 * eps)\n                for e in np.eye(p0.size)])\nprint(f\"sequence length            {T}\")\nprint(f\"loss                       {L:.8f}\")\nprint(f\"max |BPTT - central diff|  {np.abs(g - num).max():.3e}\")\nprint(f\"gradient norm              {np.linalg.norm(g):.6f}\")\n",
            "output": "sequence length            6\nloss                       0.13693037\nmax |BPTT - central diff|  4.493e-11\ngradient norm              1.241475"
          }
        },
        {
          "name": "Why plain recurrence forgets, and what a gate fixes",
          "explain": "<p>The sensitivity of the final hidden state to the initial one is a product of T Jacobians, each the recurrent weight matrix multiplied by a diagonal of tanh derivatives. Two factors both push the product toward zero: the weight matrix typically has spectral norm below one for stability, and the tanh derivative is at most one and usually much less. Their product compounds, so information from far in the past is unreachable by gradient descent long before it is unreachable in principle.</p><p>The snippet measures the Jacobian norm directly. With a recurrent matrix of spectral norm 0.9, the plain cell's sensitivity is already 1e-04 at ten steps and 1e-41 at a hundred, far below the weight-only bound because the tanh derivative compounds on top. A leaky gated cell that carries the previous state forward with weight 0.95 retains a sensitivity of about 0.066 at a hundred steps. That is the whole idea behind long short-term memory and gated recurrent units: give the gradient a near-identity path to travel along.</p><p>On a desk this is the difference between a model that can use last quarter's information and one that has quietly become a five-day moving average with extra parameters.</p>",
          "formula": "\\frac{\\partial h_T}{\\partial h_0} = \\prod_{t=1}^{T} D_t W,\\qquad \\text{gated: } h_t = g\\,h_{t-1} + (1-g)\\,\\tilde h_t",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(31)\ndh = 16\nW = rng.normal(size=(dh, dh)); W *= 0.9 / np.linalg.norm(W, 2)   # spectral norm 0.9\nx = 0.3 * rng.normal(size=dh)\n\ndef jac_norm(T, gate=None):\n    \"\"\"||d h_T / d h_0||_2 for a plain tanh cell, or a leaky gated one.\"\"\"\n    h = np.zeros(dh); J = np.eye(dh)\n    for _ in range(T):\n        z = W @ h + x\n        hn = np.tanh(z)\n        D = np.diag(1 - hn ** 2)\n        if gate is None:\n            J = (D @ W) @ J; h = hn\n        else:\n            J = (gate * np.eye(dh) + (1 - gate) * D @ W) @ J\n            h = gate * h + (1 - gate) * hn\n    return np.linalg.norm(J, 2)\n\nprint(\"  T     plain tanh cell     leaky gate g=0.95     ||W||_2**T\")\nfor T in (10, 30, 100):\n    print(f\"{T:4d}   {jac_norm(T):16.3e}   {jac_norm(T, 0.95):18.3e}   {0.9 ** T:.3e}\")\nprint(\"the plain cell forgets geometrically; the gate keeps a usable path to h_0\")\n",
            "output": "  T     plain tanh cell     leaky gate g=0.95     ||W||_2**T\n  10          1.925e-04            7.997e-01   3.487e-01\n  30          1.039e-12            4.977e-01   4.239e-02\n 100          2.569e-41            6.632e-02   2.656e-05\nthe plain cell forgets geometrically; the gate keeps a usable path to h_0"
          }
        },
        {
          "name": "Attention arithmetic, and the square-root-d scaling",
          "explain": "<p>Scaled dot-product attention replaces recurrence with a weighted average. Each query is compared with every key by an inner product, the scores are turned into weights by a softmax, and the output is that weighted combination of the values. There is no recursion, so the path from any position to any other has length one and the gradient does not have to survive a product of Jacobians.</p><p>The division by the square root of the key dimension is the part that looks arbitrary and is not. If query and key entries are roughly independent with unit variance, their inner product over d dimensions has standard deviation of order square root of d. Feed scores of that size into a softmax and it saturates: one weight near one, the rest near zero, and gradients near zero with them. The snippet shows raw scores with a standard deviation of 8.8 at d = 64, and mean attention entropy collapsing from 1.00 with the scaling to 0.32 without it, against a maximum of 1.39 for four tokens.</p><p>Anyone reading a modern model's config should be able to say why that constant is there, because the same saturation argument explains temperature in a softmax policy in week nine.</p>",
          "formula": "\\mathrm{Attn}(Q,K,V) = \\mathrm{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d}}\\right)V",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(32)\nn_tok, d = 4, 64\nQ = rng.normal(size=(n_tok, d)); K = rng.normal(size=(n_tok, d)); V = rng.normal(size=(n_tok, d))\n\ndef attend(scale):\n    A = (Q @ K.T) / scale\n    A = A - A.max(axis=1, keepdims=True)\n    P = np.exp(A); P /= P.sum(axis=1, keepdims=True)\n    ent = -(P * np.log(P + 1e-300)).sum(axis=1)\n    return P, ent\n\nP_s, e_s = attend(np.sqrt(d))\nP_u, e_u = attend(1.0)\nprint(f\"raw score sd over token pairs   {np.std(Q @ K.T):.2f}  (grows like sqrt(d) = {np.sqrt(d):.1f})\")\nprint(\"scaled by sqrt(d): attention weights of token 0\")\nprint(\"   \", np.round(P_s[0], 4), f\"  entropy {e_s[0]:.4f}\")\nprint(\"unscaled:          attention weights of token 0\")\nprint(\"   \", np.round(P_u[0], 4), f\"  entropy {e_u[0]:.4f}\")\nprint(f\"mean entropy  scaled {e_s.mean():.4f}   unscaled {e_u.mean():.4f}   \"\n      f\"max possible {np.log(n_tok):.4f}\")\n",
            "output": "raw score sd over token pairs   8.81  (grows like sqrt(d) = 8.0)\nscaled by sqrt(d): attention weights of token 0\n    [0.1332 0.2082 0.3492 0.3095]   entropy 1.3256\nunscaled:          attention weights of token 0\n    [3.000e-04 1.140e-02 7.159e-01 2.724e-01]   entropy 0.6472\nmean entropy  scaled 0.9954   unscaled 0.3213   max possible 1.3863"
          }
        },
        {
          "name": "What a sequence model can and cannot learn from returns",
          "explain": "<p>Put the machinery on a realistic target and the result is sobering. The snippet simulates an autoregressive return series with a coefficient of 0.03, so the theoretical maximum out-of-sample R-squared any model can achieve is the square of that, about nine ten-thousandths. It then applies a fixed nonlinear encoder over a ten-day window with two hundred features and fits ridgeless least squares on four hundred and ninety training rows.</p><p>In-sample R-squared comes out at about 0.41. Out-of-sample R-squared is about minus 0.89: the model is worse than predicting the mean, by a lot. Nothing about the encoder was dishonest and no future information leaked. The capacity was simply enormous relative to a signal worth 0.0009, and a flexible model in that regime finds structure in the noise with complete reliability.</p><p>The conclusion is not that sequence models are useless in finance. It is that they have to be paired with a capacity budget, a genuine out-of-sample protocol, and a prior expectation of how much signal could possibly be there. A desk that cannot state the last of those three numbers has no way to tell a good result from this one.</p>",
          "formula": "R^2_{\\max} = \\phi^2 \\quad\\text{for}\\quad r_t = \\phi r_{t-1} + \\varepsilon_t",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(33)\nphi, n, lag, m = 0.03, 500, 10, 200          # true AR(1) coefficient is tiny\nr = np.zeros(n + 5000)\nfor t in range(1, r.size):\n    r[t] = phi * r[t - 1] + rng.normal()\n\ndef windows(series):\n    Xw = np.lib.stride_tricks.sliding_window_view(series, lag)[:-1]\n    return Xw, series[lag:]\n\nXtr, ytr = windows(r[:n]); Xte, yte = windows(r[n:])\nWf = rng.normal(size=(lag, m)) / np.sqrt(lag); bf = rng.normal(size=m)\nfeat = lambda Z: np.tanh(Z @ Wf + bf)        # a fixed nonlinear sequence encoder\nb = np.linalg.pinv(feat(Xtr)) @ ytr          # ridgeless: it can interpolate\n\nr2 = lambda y, yh: 1 - ((y - yh) ** 2).sum() / ((y - y.mean()) ** 2).sum()\nprint(f\"training rows {len(ytr)}, features {m}\")\nprint(f\"in-sample  R^2   {r2(ytr, feat(Xtr) @ b):+8.4f}\")\nprint(f\"out-of-sample R^2 {r2(yte, feat(Xte) @ b):+8.4f}\")\nprint(f\"best possible R^2 from the true process = phi^2 = {phi ** 2:.4f}\")\n",
            "output": "training rows 490, features 200\nin-sample  R^2    +0.4081\nout-of-sample R^2  -0.8874\nbest possible R^2 from the true process = phi^2 = 0.0009"
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Scaled dot-product attention weights, four tokens",
        "params": {
          "cmap": "seq",
          "xlabels": [
            "key 1",
            "key 2",
            "key 3",
            "key 4"
          ],
          "ylabels": [
            "query 1",
            "query 2",
            "query 3",
            "query 4"
          ],
          "matrix": [
            [
              0.1332,
              0.2082,
              0.3492,
              0.3095
            ],
            [
              0.7242,
              0.2053,
              0.0213,
              0.0491
            ],
            [
              0.0419,
              0.8278,
              0.0774,
              0.0528
            ],
            [
              0.3632,
              0.3973,
              0.0731,
              0.1663
            ]
          ]
        }
      },
      "pitfalls": [
        "Training a recurrent model on a long window and never checking the gradient norm at the far end. If it has vanished, the model is using a short window whatever the code says.",
        "Dropping the 1/sqrt(d) in an attention block. The softmax saturates, the attention weights become one-hot, and the gradient through them dies.",
        "Reading a high in-sample R-squared from a sequence model on returns as evidence of memory in the series. Compare against the maximum R-squared the assumed process could produce.",
        "Overwriting rather than accumulating the shared recurrent weight gradient across time steps. The loss still falls; it just falls to the wrong place."
      ],
      "check": [
        {
          "q": "In backpropagation through time, the gradient with respect to the recurrent weight matrix W is:",
          "options": [
            "The contribution from the last time step only",
            "A sum of contributions from every time step, because W is shared across the unrolled network",
            "The average over time steps",
            "Zero unless the sequence is longer than the hidden dimension"
          ],
          "answer": 1,
          "why": "Unrolling gives one shared parameter used at every layer, so its total derivative is the sum of the partials from each use, which is why accumulation rather than assignment is the correct implementation."
        },
        {
          "q": "A gated cell with gate value near one helps with vanishing gradients because:",
          "options": [
            "It removes the nonlinearity entirely",
            "The state-to-state Jacobian becomes close to the identity, so the product over time steps does not shrink geometrically",
            "It reduces the number of parameters",
            "It makes the loss convex"
          ],
          "answer": 1,
          "why": "Carrying the previous state forward with weight near one gives the Jacobian product a near-identity component, which is the near-lossless path along which a gradient can travel many steps back."
        },
        {
          "q": "You remove the 1/sqrt(d) scaling from an attention block with d = 256. What happens first?",
          "options": [
            "The attention weights become uniform",
            "The softmax saturates to near one-hot weights and the gradient through the attention weights collapses",
            "The output dimension changes",
            "Nothing measurable"
          ],
          "answer": 1,
          "why": "Inner products over d dimensions have standard deviation of order sqrt(d), so at d = 256 the raw scores are large enough that the softmax puts nearly all mass on one key, driving the entropy and the gradient toward zero."
        },
        {
          "q": "A sequence model reports in-sample R-squared 0.41 on a return series generated by an AR(1) with phi = 0.03. The right conclusion is:",
          "options": [
            "The model found nonlinear structure the AR(1) missed",
            "The maximum achievable R-squared is phi^2 = 0.0009, so the fit is entirely overfitting",
            "The simulation is wrong",
            "Out-of-sample R-squared will be about 0.4 too"
          ],
          "answer": 1,
          "why": "The data-generating process caps predictable variance at phi squared, about 0.0009, so an in-sample R-squared three orders of magnitude larger can only be noise-fitting, and the out-of-sample figure duly comes out negative."
        }
      ]
    },
    {
      "n": 6,
      "title": "Markov decision processes and dynamic programming",
      "topics": [
        "states, actions, rewards",
        "discounted return",
        "Bellman equations",
        "policy evaluation",
        "value iteration",
        "policy iteration"
      ],
      "concepts": [
        {
          "name": "The MDP, the return and the value function",
          "explain": "<p>A Markov decision process is five things: a state space, an action space, a transition kernel, a reward function and a discount factor. The Markov assumption is the load-bearing one. It says the next state and reward depend on the current state and action alone, so a state is not a description of the world but a sufficient statistic for the future. Getting the state definition wrong is the commonest way to make a financial problem unsolvable, because a state that omits inventory, or time remaining, or the current regime, is not Markov.</p><p>Fix a policy and the value function is the expected discounted sum of future rewards from each state. For a finite chain this is a linear system, not a limit: the identity minus discount times transition matrix is invertible whenever the discount is below one, and one linear solve gives every state's value exactly. The snippet solves a three-state chain that way and then confirms it by averaging twenty thousand simulated trajectories, which agree to a few hundredths, roughly the size of the Monte Carlo standard error it also prints.</p><p>That contrast is the shape of the whole subject. When you know the model you solve; when you do not, you sample, and everything from week seven onwards is about paying the statistical price of not knowing.</p>",
          "formula": "V^{\\pi}(s) = \\mathbb{E}\\Big[\\sum_{t\\ge 0}\\gamma^{t} r_{t}\\,\\Big|\\,s_0=s\\Big],\\qquad V^{\\pi} = (I-\\gamma P^{\\pi})^{-1} r^{\\pi}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nP = np.array([[0.7, 0.2, 0.1],\n              [0.3, 0.4, 0.3],\n              [0.1, 0.3, 0.6]])\nr = np.array([1.0, -0.5, 0.2])\ngam = 0.9\n\nV = np.linalg.solve(np.eye(3) - gam * P, r)            # the Bellman equation, solved\nprint(\"analytic V  =\", np.round(V, 6))\n\nrng = np.random.default_rng(40)\nH, eps = 250, 20_000                                    # gam**250 is ~ 1e-12\ndisc = gam ** np.arange(H)\nmc = np.zeros(3)\nfor s0 in range(3):\n    s = np.full(eps, s0)\n    tot = np.zeros(eps)\n    for t in range(H):\n        tot += disc[t] * r[s]\n        u = rng.random((eps, 1))\n        s = (u > np.cumsum(P[s], axis=1)).sum(axis=1)\n    mc[s0] = tot.mean()\n    se = tot.std(ddof=1) / np.sqrt(eps)\nprint(\"Monte Carlo =\", np.round(mc, 6))\nprint(f\"max |analytic - Monte Carlo| = {np.abs(V - mc).max():.4f}   \"\n      f\"(Monte Carlo standard error about {se:.4f})\")\n",
            "output": "analytic V  = [4.351196 2.122585 2.531969]\nMonte Carlo = [4.317936 2.129109 2.548323]\nmax |analytic - Monte Carlo| = 0.0333   (Monte Carlo standard error about 0.0117)"
          }
        },
        {
          "name": "The Bellman operator is a contraction",
          "explain": "<p>The Bellman expectation operator maps a value estimate to the immediate reward plus the discounted expectation of that estimate at the next state. Its crucial property is that it shrinks distances: apply it to two different value vectors and their supremum-norm distance is multiplied by at most the discount factor. By the Banach fixed-point theorem the operator therefore has exactly one fixed point, and repeated application converges to it geometrically from any starting vector.</p><p>The snippet starts from zero and prints the error against the exact solution. After a few iterations the ratio of successive errors settles at 0.900000, which is the discount factor to six decimals. That is not a coincidence or a tuning result; it is the contraction modulus, and it tells you the iteration count you need in advance: to gain one decimal digit you need roughly one over the log of one over gamma iterations.</p><p>Practically, the contraction is also what makes every later algorithm plausible. Q-learning, fitted value iteration and target networks are all attempts to keep the contraction property while replacing exact expectations with samples and exact value tables with function approximators, and week eight is about what happens when that attempt fails.</p>",
          "formula": "\\|\\mathcal{T}V - \\mathcal{T}V'\\|_{\\infty} \\le \\gamma\\|V-V'\\|_{\\infty},\\qquad \\mathcal{T}V = r + \\gamma P V",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nP = np.array([[0.7, 0.2, 0.1], [0.3, 0.4, 0.3], [0.1, 0.3, 0.6]])\nr = np.array([1.0, -0.5, 0.2]); gam = 0.9\nVstar = np.linalg.solve(np.eye(3) - gam * P, r)\n\nV = np.zeros(3); prev = np.abs(V - Vstar).max()\nprint(\"  k   ||V_k - V*||_inf    ratio to previous\")\nfor k in range(1, 61):\n    V = r + gam * P @ V\n    e = np.abs(V - Vstar).max()\n    if k in (1, 2, 5, 10, 20, 40, 60):\n        print(f\"{k:3d}   {e:16.3e}    {e / prev:10.6f}\")\n    prev = e\nprint(f\"gamma = {gam}: the Bellman operator is a gamma-contraction in the sup norm\")\n",
            "output": "  k   ||V_k - V*||_inf    ratio to previous\n  1          3.351e+00      0.770178\n  2          2.793e+00      0.833492\n  5          1.881e+00      0.888019\n 10          1.093e+00      0.899345\n 20          3.807e-01      0.899998\n 40          4.629e-02      0.900000\n 60          5.627e-03      0.900000\ngamma = 0.9: the Bellman operator is a gamma-contraction in the sup norm"
          }
        },
        {
          "name": "Value iteration and the greedy policy",
          "explain": "<p>The Bellman optimality operator replaces the expectation over a fixed policy with a maximum over actions. It is still a gamma-contraction, so the same argument gives a unique optimal value function and geometric convergence, and the optimal policy is whatever acts greedily with respect to it. Value iteration is just repeated application of that operator until the change falls below a tolerance.</p><p>The snippet runs it on a deterministic four-by-four grid with a small cost per step and a reward at the goal. It converges in seven sweeps to a tolerance of 1e-12, which is fast because the problem is deterministic and shallow, and it prints both the value surface and the greedy action at each cell. The values increase smoothly toward the goal and the arrows point along a shortest path.</p><p>Two things are worth noticing for later. The greedy policy is often optimal long before the values have converged, which is why policy iteration in the next concept terminates so quickly. And ties are everywhere in a symmetric grid, so two correct implementations can print different arrow patterns and both be optimal, a fact worth remembering before you debug a mismatch that is not one.</p>",
          "formula": "V^{\\star}(s) = \\max_{a}\\Big[r(s,a) + \\gamma\\sum_{s'}P(s'|s,a)V^{\\star}(s')\\Big]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nN, G, gam, STEP = 4, 15, 0.95, -0.04\nMOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]\nARROW = \"^v<>\"\n\ndef step(s, a):\n    rr, cc = divmod(s, N); dr, dc = MOVES[a]\n    ns = min(max(rr + dr, 0), N - 1) * N + min(max(cc + dc, 0), N - 1)\n    return (ns, 1.0) if ns == G else (ns, STEP)\n\nV = np.zeros(N * N); sweeps = 0\nwhile True:\n    Vn = V.copy()\n    for s in range(N * N):\n        if s == G: continue\n        Vn[s] = max(rew + gam * V[ns] for ns, rew in (step(s, a) for a in range(4)))\n    sweeps += 1\n    if np.abs(Vn - V).max() < 1e-12: V = Vn; break\n    V = Vn\n\npi = [int(np.argmax([rew + gam * V[ns] for ns, rew in (step(s, a) for a in range(4))]))\n      for s in range(N * N)]\nprint(f\"value iteration converged in {sweeps} sweeps\")\nfor rr in range(N):\n    print(\"  \" + \"  \".join(f\"{V[rr * N + c]:6.3f}\" for c in range(N)))\nprint(\"greedy policy (G = goal):\")\nfor rr in range(N):\n    print(\"  \" + \" \".join(\"G\" if rr * N + c == G else ARROW[pi[rr * N + c]] for c in range(N)))\n",
            "output": "value iteration converged in 7 sweeps\n   0.593   0.666   0.743   0.824\n   0.666   0.743   0.824   0.910\n   0.743   0.824   0.910   1.000\n   0.824   0.910   1.000   0.000\ngreedy policy (G = goal):\n  v v v v\n  v v v v\n  v v v v\n  > > > G"
          }
        },
        {
          "name": "Policy iteration terminates in very few rounds",
          "explain": "<p>Policy iteration alternates two exact steps. Evaluate the current policy by solving its linear system, then improve it by acting greedily with respect to the value just computed. The policy improvement theorem guarantees the new policy is at least as good everywhere, and since there are finitely many deterministic policies and none can repeat, the loop terminates at an optimal policy.</p><p>In practice it terminates astonishingly fast. The snippet needs six rounds on the same grid and lands on a value function identical to value iteration's to machine precision. The trade-off is per-round cost: each evaluation is a linear solve, cubic in the number of states, against value iteration's cheap sweeps. Modified policy iteration, which truncates the evaluation after a few sweeps, is what most real implementations use.</p><p>The reason this matters beyond the grid is that actor-critic methods in week nine are the sampled, approximate version of exactly this loop: the critic is the evaluation step and the actor is the improvement step, both done incrementally. Understanding why the exact loop converges is what lets you diagnose the approximate one when it does not.</p>",
          "formula": "\\pi_{k+1}(s) = \\arg\\max_a\\Big[r(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V^{\\pi_k}(s')\\Big]\\ \\Rightarrow\\ V^{\\pi_{k+1}} \\ge V^{\\pi_k}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nN, G, gam, STEP = 4, 15, 0.95, -0.04\nMOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\ndef step(s, a):\n    rr, cc = divmod(s, N); dr, dc = MOVES[a]\n    ns = min(max(rr + dr, 0), N - 1) * N + min(max(cc + dc, 0), N - 1)\n    return (ns, 1.0) if ns == G else (ns, STEP)\n\ndef evaluate(pi):\n    \"\"\"Solve the linear system for V^pi exactly instead of iterating.\"\"\"\n    A = np.eye(N * N); b = np.zeros(N * N)\n    for s in range(N * N):\n        if s == G: continue\n        ns, rew = step(s, pi[s]); A[s, ns] -= gam; b[s] = rew\n    return np.linalg.solve(A, b)\n\npi = [0] * (N * N); rounds = 0\nwhile True:\n    V = evaluate(pi); rounds += 1\n    new = [int(np.argmax([rew + gam * V[ns] for ns, rew in (step(s, a) for a in range(4))]))\n           for s in range(N * N)]\n    new[G] = pi[G]\n    if new == pi: break\n    pi = new\n\nVvi = np.zeros(N * N)\nfor _ in range(2000):\n    Vvi = np.array([0.0 if s == G else\n                    max(rew + gam * Vvi[ns] for ns, rew in (step(s, a) for a in range(4)))\n                    for s in range(N * N)])\nprint(f\"policy iteration rounds        {rounds}\")\nprint(f\"max |V_policy_iter - V_value_iter| = {np.abs(V - Vvi).max():.3e}\")\nprint(f\"V at the start corner          {V[0]:.6f}\")\n",
            "output": "policy iteration rounds        6\nmax |V_policy_iter - V_value_iter| = 0.000e+00\nV at the start corner          0.592806"
          }
        }
      ],
      "widget": {
        "type": "tree-diagram",
        "title": "What dynamic programming needs, and what it gives back",
        "params": {
          "nodes": [
            {
              "id": "state",
              "label": "State s"
            },
            {
              "id": "action",
              "label": "Action a"
            },
            {
              "id": "model",
              "label": "Model P, r"
            },
            {
              "id": "next",
              "label": "Next state s'"
            },
            {
              "id": "reward",
              "label": "Reward r"
            },
            {
              "id": "bellman",
              "label": "Bellman operator"
            },
            {
              "id": "value",
              "label": "Value V*"
            },
            {
              "id": "policy",
              "label": "Greedy policy"
            },
            {
              "id": "sample",
              "label": "Sampled transitions"
            },
            {
              "id": "td",
              "label": "TD / Q-learning"
            }
          ],
          "edges": [
            {
              "from": "state",
              "to": "action"
            },
            {
              "from": "action",
              "to": "model"
            },
            {
              "from": "model",
              "to": "next"
            },
            {
              "from": "model",
              "to": "reward"
            },
            {
              "from": "next",
              "to": "bellman"
            },
            {
              "from": "reward",
              "to": "bellman"
            },
            {
              "from": "bellman",
              "to": "value"
            },
            {
              "from": "value",
              "to": "policy"
            },
            {
              "from": "policy",
              "to": "state",
              "label": "acts"
            },
            {
              "from": "action",
              "to": "sample",
              "label": "no model"
            },
            {
              "from": "sample",
              "to": "td"
            },
            {
              "from": "td",
              "to": "value",
              "label": "week 7"
            }
          ]
        }
      },
      "pitfalls": [
        "Defining a state that is not Markov. Omit remaining inventory, time to the close or the current regime and no algorithm in this course can recover; the problem is broken before learning starts.",
        "Treating the discount factor as a free hyperparameter. It sets an effective horizon of about 1/(1-gamma) steps and a contraction rate, so changing it changes the problem, not just the solver.",
        "Comparing two optimal policies cell by cell in a symmetric problem. Ties mean different argmax conventions give different but equally optimal arrows.",
        "Running value iteration to a tight tolerance when the greedy policy stopped changing long ago. The values converge slowly; the policy usually does not."
      ],
      "check": [
        {
          "q": "Why is the Bellman expectation equation solvable by a single linear solve for a finite MDP?",
          "options": [
            "Because rewards are bounded",
            "Because I - gamma*P is invertible for gamma < 1, so V = (I - gamma*P)^-1 r",
            "Because the policy is deterministic",
            "It is not; iteration is always required"
          ],
          "answer": 1,
          "why": "For gamma below one the spectral radius of gamma*P is below one, so I - gamma*P is invertible and the value function is the exact solution of a linear system, with iteration being merely a cheaper route to the same answer."
        },
        {
          "q": "You lower the discount factor from 0.99 to 0.9. What changes?",
          "options": [
            "Only the speed of convergence",
            "The effective horizon falls from about 100 steps to about 10, so the optimal policy itself may change",
            "Nothing, values just rescale",
            "The MDP stops being Markov"
          ],
          "answer": 1,
          "why": "The discount defines an effective horizon of roughly 1/(1-gamma), so lowering it makes the agent genuinely more myopic and can change which action is optimal; it also speeds convergence, but that is a side effect."
        },
        {
          "q": "Policy iteration on a 16-state grid converges in 6 rounds while value iteration needs 7 sweeps to 1e-12. The fair comparison is:",
          "options": [
            "Policy iteration is always faster",
            "Per-round cost differs: policy iteration solves a linear system each round, value iteration does a cheap sweep",
            "They are the same algorithm",
            "Value iteration is more accurate"
          ],
          "answer": 1,
          "why": "Policy iteration takes far fewer rounds but each one costs a linear solve that is cubic in the state count, so on large state spaces the cheap sweeps of value iteration, or a truncated hybrid, usually win."
        },
        {
          "q": "What guarantees that the Bellman optimality operator has a unique fixed point?",
          "options": [
            "Convexity of the reward",
            "It is a gamma-contraction in the supremum norm, so Banach's theorem applies",
            "The state space is finite",
            "The policy is stochastic"
          ],
          "answer": 1,
          "why": "The max over actions preserves the contraction property, so the operator shrinks sup-norm distances by at least gamma and Banach's fixed-point theorem gives existence, uniqueness and geometric convergence from any start."
        }
      ]
    },
    {
      "n": 7,
      "title": "Model-free prediction and control",
      "topics": [
        "Monte Carlo returns",
        "temporal-difference learning",
        "Q-learning",
        "SARSA",
        "on-policy versus off-policy",
        "exploration"
      ],
      "concepts": [
        {
          "name": "Monte Carlo against temporal difference",
          "explain": "<p>Without a model there are two ways to estimate a value. Monte Carlo waits until the episode ends and moves the estimate toward the realised return, which is unbiased but carries the variance of the entire remaining trajectory. Temporal difference bootstraps: it moves the estimate toward the immediate reward plus the current estimate of the next state, which is biased while the estimates are wrong but has the variance of a single transition.</p><p>On the classic five-state random walk the snippet runs both with the same step size and averages over fifty seeds. After two hundred episodes temporal difference reaches a root-mean-square error of about 0.039 against Monte Carlo's 0.111, an almost threefold advantage that comes entirely from the variance reduction. Bootstrapping also means temporal difference can learn from incomplete episodes, which matters when episodes are long or never actually terminate.</p><p>The trade is not free, and week eight is the bill. Bootstrapping is the ingredient that, combined with function approximation and off-policy data, can make learning diverge outright. A desk should read the choice as a variance-against-stability decision rather than as a default.</p>",
          "formula": "\\text{MC: } V(s)\\mathrel{+}=\\alpha\\big(G_t - V(s)\\big);\\qquad \\text{TD(0): } V(s)\\mathrel{+}=\\alpha\\big(r + \\gamma V(s') - V(s)\\big)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n# Sutton's 5-state random walk: terminals at both ends, reward 1 on the right.\nTRUE = np.arange(1, 6) / 6.0\n\ndef episode(rng):\n    s, traj = 2, []\n    while True:\n        nxt = s + (1 if rng.random() < 0.5 else -1)\n        traj.append((s, 1.0 if nxt == 5 else 0.0, nxt))\n        if nxt in (-1, 5): return traj\n        s = nxt\n\ndef run(kind, n_ep, alpha, rng):\n    V = np.full(5, 0.5)\n    for _ in range(n_ep):\n        tr = episode(rng)\n        if kind == \"td\":\n            for s, rew, nxt in tr:\n                vn = 0.0 if nxt in (-1, 5) else V[nxt]\n                V[s] += alpha * (rew + vn - V[s])\n        else:\n            g = sum(rew for _, rew, _ in tr)\n            for s, _, _ in tr:\n                V[s] += alpha * (g - V[s])\n    return V\n\nprint(\"episodes   TD(0) RMSE   every-visit MC RMSE\")\nfor n_ep in (10, 50, 200):\n    rms = {\"td\": [], \"mc\": []}\n    for seed in range(50):\n        for kind in (\"td\", \"mc\"):\n            V = run(kind, n_ep, 0.05, np.random.default_rng(1000 + seed))\n            rms[kind].append(np.sqrt(np.mean((V - TRUE) ** 2)))\n    print(f\"{n_ep:8d}   {np.mean(rms['td']):10.4f}   {np.mean(rms['mc']):18.4f}\")\nprint(\"true values:\", np.round(TRUE, 4))\n",
            "output": "episodes   TD(0) RMSE   every-visit MC RMSE\n      10       0.1749               0.1796\n      50       0.0533               0.1197\n     200       0.0393               0.1112\ntrue values: [0.1667 0.3333 0.5    0.6667 0.8333]"
          }
        },
        {
          "name": "Tabular Q-learning finds the dynamic-programming answer",
          "explain": "<p>Q-learning stores a value for every state-action pair and updates it toward the reward plus the discounted maximum over the next state's actions. The maximum is what makes it off-policy: the target describes the greedy policy regardless of how the data was collected, so an exploratory behaviour policy can be used freely. Under the standard conditions, every pair visited infinitely often and a suitably decaying step size, the table converges to the optimal action-value function.</p><p>The snippet puts that next to the ground truth. It computes the optimal action-value function by value iteration and then learns one from six thousand episodes of epsilon-greedy interaction with no access to the transition model at all. Every one of the sixty state-action pairs is updated, the largest discrepancy is about 0.003, and the greedy action at every non-terminal state is optimal under the dynamic-programming solution.</p><p>Keep the comparison in mind for the rest of the course. Whenever a reinforcement learning result is presented, ask what it is being compared against; on any problem small enough to solve exactly, dynamic programming is the benchmark and learning has to justify its sample cost against it.</p>",
          "formula": "Q(s,a) \\mathrel{+}= \\alpha\\Big[r + \\gamma\\max_{a'}Q(s',a') - Q(s,a)\\Big]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nN, G, gam, STEP = 4, 15, 0.95, -0.04\nMOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\ndef step(s, a):\n    rr, cc = divmod(s, N); dr, dc = MOVES[a]\n    ns = min(max(rr + dr, 0), N - 1) * N + min(max(cc + dc, 0), N - 1)\n    return (ns, 1.0, True) if ns == G else (ns, STEP, False)\n\nQs = np.zeros((16, 4))                                   # Q* by value iteration\nfor _ in range(3000):\n    Qn = np.zeros((16, 4))\n    for s in range(16):\n        if s == G: continue\n        for a in range(4):\n            ns, rew, done = step(s, a)\n            Qn[s, a] = rew + (0.0 if done else gam * Qs[ns].max())\n    Qs = Qn\n\nrng = np.random.default_rng(50)\nQ = np.zeros((16, 4)); alpha, eps = 0.2, 0.25\nfor ep in range(6000):\n    s = int(rng.integers(0, 15))\n    for _ in range(60):\n        a = int(rng.integers(4)) if rng.random() < eps else int(np.argmax(Q[s]))\n        ns, rew, done = step(s, a)\n        tgt = rew + (0.0 if done else gam * Q[ns].max())\n        Q[s, a] += alpha * (tgt - Q[s, a])\n        if done: break\n        s = ns\n\nmask = np.ones((16, 4), bool); mask[G] = False\nprint(f\"state-action pairs updated        : {(np.abs(Q) > 0).sum()} of 60\")\nprint(f\"max |Q_learned - Q*| (non-terminal): {np.abs(Q - Qs)[mask].max():.4f}\")\nopt = sum(int(Qs[s, int(np.argmax(Q[s]))] > Qs[s].max() - 1e-9) for s in range(16) if s != G)\nprint(f\"states whose greedy action is optimal under Q*: {opt} of 15\")\n",
            "output": "state-action pairs updated        : 60 of 60\nmax |Q_learned - Q*| (non-terminal): 0.0030\nstates whose greedy action is optimal under Q*: 15 of 15"
          }
        },
        {
          "name": "SARSA is on-policy, and it knows it might slip",
          "explain": "<p>SARSA replaces the maximum in the Q-learning target with the value of the action actually taken next. That single change makes it on-policy: it evaluates and improves the behaviour policy including its exploration, so the value it learns is the value of an agent that will sometimes act randomly.</p><p>The cliff-walking problem makes the difference vivid. The snippet lays a cliff along the bottom row between start and goal, with a large penalty and a reset for stepping into it. Q-learning learns the optimal path, which runs along the very edge of the cliff, and its greedy return of -9 beats SARSA's -11. But under the epsilon-greedy behaviour that generated the data, the edge path collects -32.6 because a random step occasionally falls off, while SARSA's longer, safer route collects -15.1.</p><p>That is a general and important asymmetry. Off-policy methods learn the value of a policy you are not executing, and if execution is noisy, slow or subject to slippage, the policy you actually run may be much worse than the one you learned. Any execution or hedging agent that will act with latency and partial fills should be evaluated the way SARSA evaluates: including its own imperfections.</p>",
          "formula": "Q(s,a) \\mathrel{+}= \\alpha\\big[r + \\gamma Q(s',a') - Q(s,a)\\big],\\quad a' \\sim \\pi_{\\text{behaviour}}(\\cdot|s')",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nR, C = 3, 8                       # cliff along the bottom row between the corners\nSTART, GOAL = (R - 1) * C, R * C - 1\nCLIFF = set(range((R - 1) * C + 1, R * C - 1))\nMOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\ndef step(s, a):\n    rr, cc = divmod(s, C); dr, dc = MOVES[a]\n    ns = min(max(rr + dr, 0), R - 1) * C + min(max(cc + dc, 0), C - 1)\n    if ns in CLIFF: return START, -100.0, False\n    return ns, -1.0, ns == GOAL\n\ndef learn(kind, episodes=4000, alpha=0.5, eps=0.1, seed=7):\n    rng = np.random.default_rng(seed)\n    Q = np.zeros((R * C, 4))\n    pick = lambda s: int(rng.integers(4)) if rng.random() < eps else int(np.argmax(Q[s]))\n    for _ in range(episodes):\n        s, a = START, None\n        for _ in range(200):\n            if a is None: a = pick(s)\n            ns, rew, done = step(s, a)\n            na = pick(ns)\n            boot = 0.0 if done else (Q[ns, na] if kind == \"sarsa\" else Q[ns].max())\n            Q[s, a] += alpha * (rew + boot - Q[s, a])\n            if done: break\n            s, a = ns, na\n    return Q\n\ndef rollout(Q, eps, seed=99, runs=500):\n    rng = np.random.default_rng(seed); tot = 0.0\n    for _ in range(runs):\n        s = START\n        for _ in range(200):\n            a = int(rng.integers(4)) if rng.random() < eps else int(np.argmax(Q[s]))\n            s, rew, done = step(s, a)\n            tot += rew\n            if done: break\n    return tot / runs\n\nfor kind in (\"sarsa\", \"qlearning\"):\n    Q = learn(kind)\n    print(f\"{kind:9s}  return with eps=0.1 exploration {rollout(Q, 0.1):8.2f}   \"\n          f\"greedy (eps=0) {rollout(Q, 0.0):7.2f}\")\nprint(\"Q-learning learns the optimal cliff-edge path; SARSA learns one that survives slips\")\n",
            "output": "sarsa      return with eps=0.1 exploration   -15.13   greedy (eps=0)  -11.00\nqlearning  return with eps=0.1 exploration   -32.57   greedy (eps=0)   -9.00\nQ-learning learns the optimal cliff-edge path; SARSA learns one that survives slips"
          }
        },
        {
          "name": "Exploration is not optional, and it is not free",
          "explain": "<p>A control algorithm can only improve on what it has tried. A purely greedy agent commits to whatever looked best after very few samples and never revisits the decision, which on a noisy problem means locking onto an arm that got lucky. Epsilon-greedy is the crudest fix: act greedily most of the time, act uniformly at random with probability epsilon, and pay a small permanent tax in exchange for continued information.</p><p>The snippet runs a ten-armed bandit with unit-variance rewards. Pure greed settles at a mean reward of 0.263 against a best arm of 0.45. Epsilon of 0.01 reaches 0.362 and epsilon of 0.10 reaches 0.394. Optimistic initialisation, which starts every value above anything achievable so that every arm disappoints and gets tried, reaches 0.361 while acting greedily throughout.</p><p>The tax is visible in the last row: epsilon of 0.10 keeps exploring forever and so cannot reach 0.45 even asymptotically, which is why practical schedules decay epsilon. For a trading agent the tax is not abstract: exploration means deliberately sending orders you believe are suboptimal, and someone has to have authorised that budget before the agent goes live.</p>",
          "formula": "a_t = \\begin{cases}\\arg\\max_a Q(a) & \\text{w.p. } 1-\\varepsilon\\\\ \\text{uniform} & \\text{w.p. } \\varepsilon\\end{cases}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nmeans = np.array([0.20, 0.25, 0.10, 0.45, 0.30, 0.15, 0.40, 0.05, 0.35, 0.22])\nbest = means.max()\n\ndef bandit(eps, q0=0.0, steps=1500, runs=200):\n    rng = np.random.default_rng(60)\n    tot = np.zeros(steps)\n    for _ in range(runs):\n        Q = np.full(10, q0); n = np.zeros(10)\n        for t in range(steps):\n            a = int(rng.integers(10)) if rng.random() < eps else int(np.argmax(Q))\n            rew = means[a] + rng.normal(0, 1)\n            n[a] += 1; Q[a] += (rew - Q[a]) / n[a]\n            tot[t] += means[a]\n    return tot / runs\n\nfor label, eps, q0 in ((\"greedy, eps=0.00\", 0.00, 0.0), (\"eps=0.01\", 0.01, 0.0),\n                       (\"eps=0.10\", 0.10, 0.0), (\"greedy, optimistic Q0=1\", 0.00, 1.0)):\n    avg = bandit(eps, q0)\n    print(f\"{label:26s}  mean reward last 500 steps {avg[-500:].mean():.4f}   \"\n          f\"regret/step {best - avg[-500:].mean():.4f}\")\nprint(f\"best arm mean {best:.2f}\")\n",
            "output": "greedy, eps=0.00            mean reward last 500 steps 0.2633   regret/step 0.1867\neps=0.01                    mean reward last 500 steps 0.3619   regret/step 0.0881\neps=0.10                    mean reward last 500 steps 0.3936   regret/step 0.0564\ngreedy, optimistic Q0=1     mean reward last 500 steps 0.3607   regret/step 0.0893\nbest arm mean 0.45"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Prediction error against episodes: TD(0) versus Monte Carlo",
        "params": {
          "xlab": "Episodes",
          "ylab": "RMSE against the true values",
          "log": false,
          "series": [
            {
              "name": "TD(0), alpha = 0.05",
              "x": [
                10,
                50,
                200
              ],
              "y": [
                0.1749,
                0.0533,
                0.0393
              ]
            },
            {
              "name": "every-visit Monte Carlo, alpha = 0.05",
              "x": [
                10,
                50,
                200
              ],
              "y": [
                0.1796,
                0.1197,
                0.1112
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Reporting a Q-learning agent's greedy return when the agent will be executed with exploration, latency or partial fills. That is the cliff-walking trap, and the live number is the SARSA one.",
        "Running epsilon-greedy with a fixed epsilon forever and then wondering why the agent never reaches the optimum. A fixed exploration rate is a permanent performance tax.",
        "Assuming Q-learning converges because the theorem says so. The theorem assumes every state-action pair is visited infinitely often, which a greedy behaviour policy violates immediately.",
        "Comparing a learned policy to nothing. On a problem small enough for dynamic programming, the exact answer is the benchmark and the learning cost has to be justified against it."
      ],
      "check": [
        {
          "q": "The essential difference between the Q-learning and SARSA updates is:",
          "options": [
            "The learning rate",
            "Q-learning bootstraps from the max over next actions, SARSA from the action actually taken",
            "SARSA does not bootstrap",
            "Q-learning requires a model"
          ],
          "answer": 1,
          "why": "Replacing the max with the action actually selected is what makes SARSA on-policy: it evaluates the behaviour policy including its exploration, whereas Q-learning evaluates the greedy policy whatever generated the data."
        },
        {
          "q": "On cliff walking with epsilon = 0.1, Q-learning's learned path scores -32.6 in execution while SARSA's scores -15.1. Why?",
          "options": [
            "Q-learning failed to converge",
            "Q-learning learned the optimal path, which runs next to the cliff, and exploration occasionally pushes the agent off it",
            "SARSA found a better path",
            "The reward function differs between the two"
          ],
          "answer": 1,
          "why": "Q-learning's target ignores exploration, so it commits to the shortest path along the cliff edge where a single random action is catastrophic, while SARSA prices in its own exploration and prefers a route that survives a slip."
        },
        {
          "q": "Temporal-difference learning has lower variance than Monte Carlo because:",
          "options": [
            "It uses a smaller learning rate",
            "Its target depends on one transition plus a current estimate, not on the whole remaining trajectory",
            "It is unbiased",
            "It averages over more episodes"
          ],
          "answer": 1,
          "why": "Bootstrapping replaces the random remaining return with a single sampled reward plus an existing estimate, cutting variance sharply at the cost of bias while the estimates are still wrong."
        },
        {
          "q": "Optimistic initialisation encourages exploration because:",
          "options": [
            "It adds noise to the actions",
            "Every action initially disappoints relative to its inflated value, so a greedy agent keeps switching until all have been tried",
            "It increases the learning rate",
            "It only works with a decaying epsilon"
          ],
          "answer": 1,
          "why": "Starting values above anything attainable means each trial lowers that action's estimate below the untried ones, so pure greed systematically sweeps the whole action set without any explicit randomisation."
        }
      ]
    },
    {
      "n": 8,
      "title": "Function approximation in reinforcement learning",
      "topics": [
        "the deadly triad",
        "target networks",
        "fitted Q iteration",
        "experience replay",
        "state aggregation and projection error"
      ],
      "concepts": [
        {
          "name": "The deadly triad, in eleven lines",
          "explain": "<p>Tabular reinforcement learning converges under mild conditions. Replace the table with a function approximator and three ingredients together can break it: bootstrapping, function approximation, and training on data from a different distribution than the one the target policy induces. Any two are safe. All three can diverge, and not slowly.</p><p>The snippet is the smallest counterexample there is. Two states share one weight through features one and two, every reward is zero, and the true value function is zero, which the approximator represents exactly at weight zero. Semi-gradient temporal difference on the transition from the first state has expected update factor one plus the step size times two gamma minus one, which exceeds one for any gamma above one half. Weighting that transition more heavily than the self-loop the policy actually takes sends the weight from one to over two thousand in four hundred updates.</p><p>'Semi-gradient' is the culprit worth naming: the update differentiates the prediction but treats the bootstrapped target as a constant, so it is not the gradient of anything and carries no guarantee of descent. Any team putting a learned value function into production should be able to say which of the three ingredients they have removed.</p>",
          "formula": "w \\mathrel{+}= \\alpha\\big[r + \\gamma\\,\\phi(s')^{\\top}w - \\phi(s)^{\\top}w\\big]\\phi(s)\\ \\Rightarrow\\ \\mathbb{E}[w_{k+1}] = \\big(1+\\alpha(2\\gamma-1)\\big)w_k",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n# Two states, one weight, features phi(s1)=1, phi(s2)=2, all rewards zero.\n# The true value function is V = 0, and the weight w = 0 represents it exactly.\ngam, alpha = 0.99, 0.02\nphi = np.array([1.0, 2.0])\n\ndef td_run(w_on_s1, steps=400):\n    \"\"\"w_on_s1 = share of updates taken from the s1 -> s2 transition.\"\"\"\n    w = 1.0\n    for k in range(steps):\n        if (k % 100) / 100.0 < w_on_s1:\n            s, ns = 0, 1                       # off-policy-heavy transition\n        else:\n            s, ns = 1, 1                       # the self-loop the policy really takes\n        delta = 0.0 + gam * phi[ns] * w - phi[s] * w\n        w += alpha * delta * phi[s]            # semi-gradient: no term for d/dw of the target\n    return w\n\nprint(\" share of s1 updates   weight after 400 semi-gradient updates\")\nfor share in (0.50, 0.70, 0.90, 1.00):\n    print(f\"{share:18.2f}   {td_run(share):14.4f}\")\nprint(\"expansion factor of the pure-s1 update: 1 + alpha*(2*gam - 1) =\"\n      f\" {1 + alpha * (2 * gam - 1):.4f} > 1\")\nprint(\"bootstrapping + function approximation + off-policy data = the deadly triad\")\n",
            "output": " share of s1 updates   weight after 400 semi-gradient updates\n              0.50          41.3476\n              0.70         208.2776\n              0.90        1049.1429\n              1.00        2354.6736\nexpansion factor of the pure-s1 update: 1 + alpha*(2*gam - 1) = 1.0196 > 1\nbootstrapping + function approximation + off-policy data = the deadly triad"
          }
        },
        {
          "name": "A frozen target restores the contraction",
          "explain": "<p>The instability above comes from chasing a target that moves with the parameters being updated. Freeze the target for a while and the picture changes: with the target held fixed, fitting the approximator is an ordinary supervised regression onto fixed labels, and refreshing the target afterwards is one application of the Bellman operator. If the fit is exact, each outer loop is a gamma-contraction in the supremum norm and the iteration converges.</p><p>That is exactly what a target network in a deep Q-network is for, and the snippet strips it to its skeleton: a replay buffer of every transition, a frozen copy of the value function used to build the targets, a batch fit, and a refresh. With one-hot features the fit is exact and the error falls from 0.95 to machine precision by the tenth refresh.</p><p>The honest caveats are two. The fit is never exact with a real approximator, so each outer loop contracts and then adds a projection error, which is what bounds the final quality. And the refresh interval is a genuine trade-off: too short and you are back to chasing a moving target, too long and you are iterating an operator you have already converged against. That hyperparameter deserves more attention than it usually gets.</p>",
          "formula": "Q_{k+1} = \\Pi\\,\\mathcal{T}Q_k,\\qquad \\|\\mathcal{T}Q-\\mathcal{T}Q'\\|_{\\infty}\\le\\gamma\\|Q-Q'\\|_{\\infty}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nN, G, gam, STEP = 4, 15, 0.95, -0.04\nMOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\ndef step(s, a):\n    rr, cc = divmod(s, N); dr, dc = MOVES[a]\n    ns = min(max(rr + dr, 0), N - 1) * N + min(max(cc + dc, 0), N - 1)\n    return (ns, 1.0, True) if ns == G else (ns, STEP, False)\n\ntrans = [[step(s, a) for a in range(4)] for s in range(16)]\nQstar = np.zeros((16, 4))\nfor _ in range(3000):\n    Qstar = np.array([[0.0 if s == G else\n                       trans[s][a][1] + (0.0 if trans[s][a][2] else gam * Qstar[trans[s][a][0]].max())\n                       for a in range(4)] for s in range(16)])\n\n# Fitted Q iteration: a FROZEN target network, and a batch least-squares fit\n# of a linear Q on one-hot (state, action) features -- i.e. a tabular DQN.\nrng = np.random.default_rng(70)\nbuf = [(int(s), int(a)) for s in range(16) for a in range(4) if s != G] * 8\nQ = np.zeros((16, 4))\nfor outer in range(1, 41):\n    target = Q.copy()                       # frozen for the whole inner fit\n    acc = np.zeros((16, 4)); cnt = np.zeros((16, 4))\n    for s, a in buf:\n        ns, rew, done = trans[s][a]\n        acc[s, a] += rew + (0.0 if done else gam * target[ns].max()); cnt[s, a] += 1\n    Q = np.where(cnt > 0, acc / np.maximum(cnt, 1), Q)\n    if outer in (1, 5, 10, 20, 40):\n        m = np.ones((16, 4), bool); m[G] = False\n        print(f\"target-network refresh {outer:3d}   max |Q - Q*| = {np.abs(Q - Qstar)[m].max():.3e}\")\nprint(\"with the target frozen, each outer loop is a gamma-contraction in the sup norm\")\n",
            "output": "target-network refresh   1   max |Q - Q*| = 9.500e-01\ntarget-network refresh   5   max |Q - Q*| = 7.738e-01\ntarget-network refresh  10   max |Q - Q*| = 1.110e-16\ntarget-network refresh  20   max |Q - Q*| = 1.110e-16\ntarget-network refresh  40   max |Q - Q*| = 1.110e-16\nwith the target frozen, each outer loop is a gamma-contraction in the sup norm"
          }
        },
        {
          "name": "Experience replay, and why correlation hurts",
          "explain": "<p>Data collected by an agent arrives in trajectories, and consecutive transitions are strongly dependent. When the learner shares parameters across states, sequentially ordered updates drag those shared parameters toward whatever region the agent happens to be sitting in, and the final estimate depends on where the trajectory ended rather than on the whole distribution.</p><p>The snippet makes the mechanism as bare as possible: a sticky two-state chain, rewards of plus and minus one, and a single shared weight that has to serve both states. State one alone implies a value of plus ten, state two implies minus ten, and the balanced answer is zero. Sequentially ordered updates land anywhere from minus 4.5 to plus 3.0 across forty seeds with a standard deviation of 2.05; the same transitions shuffled through a replay buffer halve that spread to 1.03.</p><p>Replay also buys sample reuse, which matters enormously when each sample is an actual order sent to a market. Neither benefit is free: a buffer holds data generated by older policies, which is off-policy data, which is one of the three ingredients from the first concept. Replay and target networks are the two crutches that make the triad survivable in practice, and they are crutches, not proofs.</p>",
          "formula": "\\mathcal{D} = \\{(s_i,a_i,r_i,s'_i)\\}_{i=1}^{N},\\qquad (s,a,r,s') \\sim \\mathrm{Uniform}(\\mathcal{D})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n# A sticky 2-state chain, and a value function forced to SHARE one parameter\n# across both states (the crudest possible function approximation).\nP = np.array([[0.98, 0.02], [0.02, 0.98]])\nr = np.array([1.0, -1.0]); gam = 0.9\nfixed = {0: r[0] / (1 - gam), 1: r[1] / (1 - gam)}     # what each state alone implies\n\ndef run(shuffle, seed, steps=4000, alpha=0.02):\n    rng = np.random.default_rng(seed)\n    s, traj = 0, []\n    for _ in range(steps):\n        ns = s if rng.random() < P[s, s] else 1 - s\n        traj.append((s, r[s])); s = ns\n    if shuffle:\n        traj = [traj[i] for i in rng.permutation(len(traj))]\n    w = 0.0\n    for st, rew in traj:\n        w += alpha * (rew + gam * w - w)               # one shared weight\n    return w\n\nfor label, sh in ((\"sequential (as collected)\", False), (\"shuffled replay buffer\", True)):\n    ws = np.array([run(sh, 200 + k) for k in range(40)])\n    print(f\"{label:26s}  mean w {ws.mean():+8.3f}   sd across seeds {ws.std():7.3f}   \"\n          f\"range [{ws.min():+7.2f}, {ws.max():+7.2f}]\")\nprint(f\"state 0 alone implies w = {fixed[0]:+.1f}, state 1 alone implies w = {fixed[1]:+.1f}, \"\n      f\"the balanced answer is 0.0\")\nprint(\"correlated data drags a shared parameter to whichever state it last sat in\")\n",
            "output": "sequential (as collected)   mean w   -0.069   sd across seeds   2.054   range [  -4.50,   +3.02]\nshuffled replay buffer      mean w   -0.096   sd across seeds   1.031   range [  -2.72,   +1.68]\nstate 0 alone implies w = +10.0, state 1 alone implies w = -10.0, the balanced answer is 0.0\ncorrelated data drags a shared parameter to whichever state it last sat in"
          }
        },
        {
          "name": "Projection error propagates into the policy",
          "explain": "<p>A function approximator can only represent value functions inside its span, so the best it can do is the projection of the true value function onto that span. The question that matters is not how large the projection error is in value units but what it does to the greedy policy, and the two can be wildly out of proportion.</p><p>The snippet replaces sixteen tabular values on the grid with eight features, one indicator per row and one per column. The projection error is 0.61 against a true value spread of 1.0, which sounds survivable. It is not: the greedy action changes at nine of fifteen states, and the resulting policy never reaches the goal at all, so the value at the start corner falls from plus 0.59 to minus 0.80, the value of wandering forever and paying the step cost.</p><p>The general statement is a standard bound: policy loss is bounded by roughly two gamma over one minus gamma times the value error, a factor of forty at gamma of 0.95. That amplification is why a value-based agent should always be evaluated by running its greedy policy, never by reporting how well its value function fits. A desk reviewing an agent should ask for the policy's realised performance, because a small-looking regression error can hide a policy that does nothing useful.</p>",
          "formula": "\\|V^{\\pi_{\\hat V}} - V^{\\star}\\|_{\\infty} \\le \\frac{2\\gamma}{1-\\gamma}\\,\\|\\hat V - V^{\\star}\\|_{\\infty}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nN, G, gam, STEP = 4, 15, 0.95, -0.04\nMOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n\ndef step(s, a):\n    rr, cc = divmod(s, N); dr, dc = MOVES[a]\n    ns = min(max(rr + dr, 0), N - 1) * N + min(max(cc + dc, 0), N - 1)\n    return (ns, 1.0) if ns == G else (ns, STEP)\n\nV = np.zeros(16)\nfor _ in range(500):\n    V = np.array([0.0 if s == G else max(rew + gam * V[ns]\n                  for ns, rew in (step(s, a) for a in range(4))) for s in range(16)])\n\n# 8 aggregated features: one indicator per row and one per column.\nPhi = np.zeros((16, 8))\nfor s in range(16):\n    rr, cc = divmod(s, N); Phi[s, rr] = 1.0; Phi[s, 4 + cc] = 1.0\nw, *_ = np.linalg.lstsq(Phi, V, rcond=None)\nVhat = Phi @ w\n\ngreedy = lambda Vx: [int(np.argmax([rew + gam * Vx[ns]\n                     for ns, rew in (step(s, a) for a in range(4))])) for s in range(16)]\n\ndef value_of(pi):\n    A = np.eye(16); b = np.zeros(16)\n    for s in range(16):\n        if s == G: continue\n        ns, rew = step(s, pi[s]); A[s, ns] -= gam; b[s] = rew\n    return np.linalg.solve(A, b)\n\npi_true, pi_hat = greedy(V), greedy(Vhat)\nVpi = value_of(pi_hat)\nprint(\"parameters: 16 tabular values  ->  8 row/column features\")\nprint(f\"projection error ||V - Phi w||_inf     {np.abs(V - Vhat).max():.4f}\")\nprint(f\"spread of the true value function      {V.max() - V.min():.4f}\")\nprint(f\"states where the greedy action changes {sum(1 for s in range(16) if s != G and pi_true[s] != pi_hat[s])} of 15\")\nprint(f\"value at the start corner: optimal {V[0]:+.4f}   aggregated-greedy {Vpi[0]:+.4f}\")\n",
            "output": "parameters: 16 tabular values  ->  8 row/column features\nprojection error ||V - Phi w||_inf     0.6058\nspread of the true value function      1.0000\nstates where the greedy action changes 9 of 15\nvalue at the start corner: optimal +0.5928   aggregated-greedy -0.8000"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Divergence of semi-gradient TD as the data goes off-policy",
        "params": {
          "xlab": "Share of updates taken from the off-policy transition",
          "ylab": "Weight after 400 semi-gradient updates (log scale)",
          "log": true,
          "series": [
            {
              "name": "semi-gradient TD, gamma = 0.99",
              "x": [
                0.5,
                0.7,
                0.9,
                1.0
              ],
              "y": [
                41.3476,
                208.2776,
                1049.1429,
                2354.6736
              ]
            },
            {
              "name": "the value that represents V exactly",
              "x": [
                0.5,
                0.7,
                0.9,
                1.0
              ],
              "y": [
                1.0,
                1.0,
                1.0,
                1.0
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Calling a semi-gradient update a gradient step. It differentiates the prediction and not the bootstrapped target, so it is not the gradient of any objective and comes with no descent guarantee.",
        "Reporting the value-function fit error as evidence an agent is good. Policy loss is amplified by roughly 2*gamma/(1-gamma), so a small value error can still produce a useless policy.",
        "Treating the target refresh interval as an unimportant constant. Too short and the target moves with the weights, too long and you are iterating an operator you have already converged against.",
        "Assuming replay fixes the triad. A buffer holds data from older policies, which is off-policy data, so replay trades one ingredient of the triad for another."
      ],
      "check": [
        {
          "q": "Which three ingredients together make up the deadly triad?",
          "options": [
            "Bootstrapping, function approximation and off-policy training",
            "Exploration, discounting and stochastic rewards",
            "Deep networks, replay buffers and target networks",
            "Continuous actions, sparse rewards and long horizons"
          ],
          "answer": 0,
          "why": "Any two of bootstrapping, function approximation and off-policy data are safe; all three together can make a semi-gradient update diverge, as the two-state counterexample shows in a few hundred steps."
        },
        {
          "q": "In the two-state counterexample, why does the weight diverge?",
          "options": [
            "The reward is too large",
            "The expected update multiplies the weight by 1 + alpha(2*gamma - 1), which exceeds one for gamma above one half",
            "The learning rate exceeds 2/L",
            "The features are collinear"
          ],
          "answer": 1,
          "why": "Every reward is zero, so the whole dynamic is the expansion factor of the semi-gradient update, and the feature ratio of two between the states makes that factor exceed one whenever the discount is above a half."
        },
        {
          "q": "A frozen target network helps because:",
          "options": [
            "It reduces memory use",
            "With the target fixed, the inner fit is ordinary supervised regression and the outer loop is one application of a gamma-contraction",
            "It makes the problem on-policy",
            "It removes the need for exploration"
          ],
          "answer": 1,
          "why": "Freezing the target turns the bootstrapped problem into regression onto fixed labels, so each refresh applies the Bellman operator once and inherits its contraction property, up to the error of the inner fit."
        },
        {
          "q": "Your value function fits with a supremum error of 0.6 on a problem whose values span 1.0 and gamma is 0.95. What can you say about the greedy policy?",
          "options": [
            "It will be near-optimal",
            "Very little that is reassuring: the standard bound allows a policy loss of about 2*gamma/(1-gamma) times 0.6, so it must be evaluated by running it",
            "It is guaranteed optimal",
            "The bound does not apply to grids"
          ],
          "answer": 1,
          "why": "The amplification factor at gamma = 0.95 is roughly forty, so a value error of that size permits an arbitrarily bad policy, which is exactly what the snippet's aggregated features produce."
        }
      ]
    },
    {
      "n": 9,
      "title": "Policy gradient methods",
      "topics": [
        "the score-function estimator",
        "REINFORCE",
        "baselines and variance",
        "actor-critic",
        "natural gradients and parameterisation"
      ],
      "concepts": [
        {
          "name": "The policy gradient theorem and the score function",
          "explain": "<p>Value methods learn a value and read a policy off it. Policy gradient methods parameterise the policy directly and ascend the expected return. The obstacle is that the objective is an expectation over trajectories whose distribution depends on the parameters, so you cannot differentiate under the integral naively. The score-function identity solves it: the derivative of the density equals the density times the derivative of its log, so the gradient of the objective is an expectation of reward times the gradient of the log-probability of the action taken.</p><p>That is remarkable because it needs no model and no derivative of the reward. You only need to be able to sample actions and differentiate your own policy's log probability, which for a softmax policy is the one-hot action minus the probability vector. The snippet computes the exact gradient of a three-armed softmax bandit by hand and matches it with four hundred thousand samples, with z-scores of about 0.2 to 0.4: unbiased, as advertised.</p><p>This is the method that scales to continuous actions, which is why execution and hedging problems reach for it: a trade size is a real number and a table of actions is not a useful object there.</p>",
          "formula": "\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\pi_\\theta}\\!\\left[\\,\\nabla_\\theta \\log \\pi_\\theta(a|s)\\,Q^{\\pi}(s,a)\\right]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n# 3-armed bandit, softmax policy pi(a) proportional to exp(theta_a).\ntheta = np.array([0.0, 0.4, -0.3])\nmu = np.array([0.5, 1.0, 0.2])                 # mean reward per arm\np = np.exp(theta) / np.exp(theta).sum()\n\nJ = p @ mu                                     # expected reward\ngrad_true = p * (mu - J)                       # d/dtheta of p @ mu, worked out by hand\n\nrng = np.random.default_rng(80)\nn = 400_000\na = rng.choice(3, size=n, p=p)\nR = mu[a] + rng.normal(0, 1.0, size=n)\nonehot = np.eye(3)[a]\nscore = onehot - p                             # grad log pi(a) for a softmax\nest = (R[:, None] * score).mean(axis=0)\nse = (R[:, None] * score).std(axis=0, ddof=1) / np.sqrt(n)\n\nprint(f\"J(theta)            {J:.6f}\")\nprint(\"analytic gradient  \", np.round(grad_true, 6))\nprint(\"REINFORCE estimate \", np.round(est, 6))\nprint(\"standard error     \", np.round(se, 6))\nprint(\"z-scores           \", np.round((est - grad_true) / se, 3))\n",
            "output": "J(theta)            0.661993\nanalytic gradient   [-0.050112  0.155986 -0.105874]\nREINFORCE estimate  [-0.050313  0.156361 -0.106048]\nstandard error      [0.000854 0.000969 0.000707]\nz-scores            [-0.236  0.387 -0.246]"
          }
        },
        {
          "name": "Baselines cut the variance and cost nothing",
          "explain": "<p>The score-function estimator is unbiased and, on its own, close to unusable. Its variance scales with the size of the reward, including any constant offset, because the estimator multiplies the score by the raw return. Subtract any function of the state from the return and the estimator stays unbiased, since the expected score is zero, while the variance can fall by an order of magnitude.</p><p>The snippet demonstrates it in the least subtle possible way. It adds a constant twenty to every arm's mean reward, which changes nothing about which arm is best and nothing about the true gradient. Without a baseline the estimator's standard deviation is around 0.6 against gradient components of size 0.05 to 0.16, so the signal is buried. Subtracting the batch mean reward leaves the bias at the fourth decimal and cuts the standard deviation by a factor of about twenty.</p><p>The best baseline is an estimate of the state value, which turns the multiplier into an advantage: how much better this action was than the state's average. Getting a baseline right is usually the difference between a policy gradient run that converges and one that wanders. A reward defined with an arbitrary offset, which is easy to do accidentally when rewards are P&amp;L in currency units, is a self-inflicted version of this problem.</p>",
          "formula": "\\nabla_\\theta J = \\mathbb{E}\\big[\\nabla_\\theta\\log\\pi_\\theta(a|s)\\,(Q^{\\pi}(s,a)-b(s))\\big],\\qquad \\mathbb{E}[\\nabla_\\theta\\log\\pi_\\theta]=0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\ntheta = np.array([0.0, 0.4, -0.3])\nmu = np.array([0.5, 1.0, 0.2]) + 20.0          # a large constant offset: pure nuisance\np = np.exp(theta) / np.exp(theta).sum()\ngrad_true = p * (mu - p @ mu)\n\nrng = np.random.default_rng(81)\nn, batch = 256, 4000\nsd = {}\nfor label, use_b in ((\"no baseline\", False), (\"baseline b = mean reward\", True)):\n    ests = np.zeros((batch, 3))\n    for k in range(batch):\n        a = rng.choice(3, size=n, p=p)\n        R = mu[a] + rng.normal(0, 1.0, size=n)\n        adv = R - (R.mean() if use_b else 0.0)\n        ests[k] = (adv[:, None] * (np.eye(3)[a] - p)).mean(axis=0)\n    sd[label] = ests.std(axis=0)\n    print(f\"{label:26s}  bias {np.round(ests.mean(0) - grad_true, 5)}   \"\n          f\"sd {np.round(ests.std(0), 5)}\")\nprint(\"analytic gradient        \", np.round(grad_true, 5))\nprint(f\"variance reduction factor {np.mean(sd['no baseline'] / sd['baseline b = mean reward']):.1f}x\")\n",
            "output": "no baseline                 bias [-0.00698  0.01219 -0.00521]   sd [0.60277 0.6486  0.53585]\nbaseline b = mean reward    bias [ 0.00053 -0.00108  0.00056]   sd [0.02873 0.03084 0.02749]\nanalytic gradient         [-0.05011  0.15599 -0.10587]\nvariance reduction factor 20.5x"
          }
        },
        {
          "name": "Actor-critic: policy iteration, one sample at a time",
          "explain": "<p>An actor-critic keeps two estimates. The critic learns a value function by temporal-difference updates; the actor adjusts the policy parameters in the direction of the score weighted by the temporal-difference error, which is a one-sample estimate of the advantage. It is the sampled, incremental version of policy iteration from week six: the critic is the evaluation step and the actor is the improvement step, interleaved rather than alternated.</p><p>The snippet runs one on a five-state corridor where the optimal action is to move right everywhere. After four thousand episodes the policy assigns probability 0.988 to 0.996 of moving right at every non-terminal state and the critic matches the dynamic-programming value function to within 0.0015. Both halves converged, and either one failing would have been visible separately, which is the practical advantage of the architecture.</p><p>The trade-off is that the critic introduces bias: the advantage estimate is only as good as the value estimate, so a badly fitted critic pushes the actor in a systematically wrong direction. Modern variants spend most of their complexity on this bias-variance dial, through multi-step returns and generalised advantage estimation, and on limiting how far the policy may move in one update.</p>",
          "formula": "\\delta_t = r_t + \\gamma V_w(s_{t+1}) - V_w(s_t);\\quad w \\mathrel{+}= \\alpha_w\\delta_t\\nabla_w V_w;\\quad \\theta \\mathrel{+}= \\alpha_\\theta\\delta_t\\nabla_\\theta\\log\\pi_\\theta(a_t|s_t)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n# A 5-state corridor: action 0 = left, action 1 = right, reward 1 at the right end.\nn_s, gam = 5, 0.9\n\ndef step(s, a):\n    ns = min(max(s + (1 if a == 1 else -1), 0), n_s - 1)\n    return (ns, 1.0, True) if ns == n_s - 1 else (ns, -0.05, False)\n\nVstar = np.zeros(n_s)\nfor _ in range(500):\n    Vstar = np.array([0.0 if s == n_s - 1 else\n                      max(rew + (0 if d else gam * Vstar[ns])\n                          for ns, rew, d in (step(s, a) for a in (0, 1)))\n                      for s in range(n_s)])\n\nrng = np.random.default_rng(82)\ntheta = np.zeros((n_s, 2)); w = np.zeros(n_s)          # actor and critic\nfor ep in range(4000):\n    s = 0\n    for _ in range(50):\n        pr = np.exp(theta[s] - theta[s].max()); pr /= pr.sum()\n        a = int(rng.random() > pr[0])\n        ns, rew, done = step(s, a)\n        delta = rew + (0.0 if done else gam * w[ns]) - w[s]\n        w[s] += 0.10 * delta\n        theta[s] += 0.10 * delta * (np.eye(2)[a] - pr)  # actor: advantage x score\n        if done: break\n        s = ns\n\npi = np.exp(theta - theta.max(1, keepdims=True))\npi /= pi.sum(1, keepdims=True)\nprint(\"P(move right) by state:\", np.round(pi[:, 1], 4))\nprint(\"critic w              :\", np.round(w, 4))\nprint(\"DP optimal V*         :\", np.round(Vstar, 4))\nprint(f\"max |w - V*| over non-terminal states = {np.abs(w - Vstar)[:-1].max():.4f}\")\n",
            "output": "P(move right) by state: [0.9882 0.9963 0.9962 0.9952 0.5   ]\ncritic w              : [0.592 0.715 0.85  1.    0.   ]\nDP optimal V*         : [0.5935 0.715  0.85   1.     0.    ]\nmax |w - V*| over non-terminal states = 0.0015"
          }
        },
        {
          "name": "The gradient direction depends on your parameterisation",
          "explain": "<p>A gradient is not a direction in the space of policies, it is a direction in the space of parameters, and those are different objects. Rescale one coordinate of the parameterisation and the same policy now has a different gradient, so plain gradient ascent takes a different path on a problem that has not changed. That fragility is why policy gradient runs are so sensitive to how the network is built and scaled.</p><p>The natural gradient fixes it by measuring distance between policies, not between parameters, using the Fisher information matrix as the metric. The snippet writes one two-armed problem in three parameterisations that differ only by a scale factor. Plain ascent needs 1082, 2142 and 2163 steps; the natural gradient needs 93 in all three cases, because it is invariant to the reparameterisation by construction.</p><p>Computing and inverting the Fisher matrix exactly is impractical at scale, which is why trust-region and clipped-objective methods exist: they approximate the same idea by bounding the divergence between successive policies instead of inverting a metric. When you read that a method 'limits the KL divergence per update', this is the problem it is solving, and a desk that understands it will stop tuning learning rates that were never the real issue.</p>",
          "formula": "\\tilde\\nabla_\\theta J = F(\\theta)^{-1}\\nabla_\\theta J,\\qquad F(\\theta) = \\mathbb{E}\\big[\\nabla_\\theta\\log\\pi_\\theta\\,\\nabla_\\theta\\log\\pi_\\theta^{\\top}\\big]",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\n# The SAME two-armed problem, written in two parameterisations that differ only\n# by a scale factor on one coordinate. Plain gradient ascent is not invariant.\nmu = np.array([0.0, 1.0])\n\ndef ascend(scale, natural, lr=0.05, tol=0.99):\n    th = np.zeros(2)\n    for k in range(1, 200_001):\n        z = th * np.array([1.0, scale])                 # the re-parameterisation\n        p = np.exp(z - z.max()); p /= p.sum()\n        g = p * (mu - p @ mu) * np.array([1.0, scale])  # chain rule\n        if natural:\n            F = np.diag(p) - np.outer(p, p)             # Fisher information\n            F = F * np.outer([1.0, scale], [1.0, scale])\n            g = np.linalg.pinv(F) @ g\n        th = th + lr * g\n        if p[1] > tol: return k\n    return -1\n\nprint(\" scale   plain gradient steps   natural gradient steps\")\nfor scale in (1.0, 0.1, 0.01):\n    print(f\"{scale:6.2f}   {ascend(scale, False):19d}   {ascend(scale, True):21d}\")\nprint(\"the natural gradient is invariant to how the policy happens to be parameterised\")\n",
            "output": " scale   plain gradient steps   natural gradient steps\n  1.00                  1082                      93\n  0.10                  2142                      93\n  0.01                  2163                      93\nthe natural gradient is invariant to how the policy happens to be parameterised"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Estimator spread with and without a baseline",
        "params": {
          "xlab": "Gradient component",
          "ylab": "Standard deviation across 4000 batches",
          "log": true,
          "series": [
            {
              "name": "no baseline",
              "x": [
                1,
                2,
                3
              ],
              "y": [
                0.60277,
                0.6486,
                0.53585
              ]
            },
            {
              "name": "baseline = batch mean reward",
              "x": [
                1,
                2,
                3
              ],
              "y": [
                0.02873,
                0.03084,
                0.02749
              ]
            },
            {
              "name": "size of the true gradient",
              "x": [
                1,
                2,
                3
              ],
              "y": [
                0.05011,
                0.15599,
                0.10587
              ]
            }
          ]
        }
      },
      "pitfalls": [
        "Leaving an arbitrary constant in the reward. It does not change the optimal policy and it does not change the true gradient, but it inflates the variance of an unbaselined estimator without limit.",
        "Reusing samples across policy updates without an importance correction. The score-function estimator is on-policy, and stale samples bias it in a direction nobody has measured.",
        "Tuning the learning rate to fix behaviour that is really a parameterisation problem. If rescaling a layer changes convergence by a factor of two, the metric is wrong, not the step size.",
        "Trusting a policy gradient run whose critic was never checked. A biased critic pushes the actor consistently in the wrong direction and the loss curve looks fine throughout."
      ],
      "check": [
        {
          "q": "Why can the policy gradient be estimated without knowing the transition model?",
          "options": [
            "Because rewards are observed",
            "Because the score-function identity moves the derivative onto the policy's own log-density, which you can differentiate",
            "Because the environment is Markov",
            "Because the discount factor is below one"
          ],
          "answer": 1,
          "why": "Writing the derivative of the trajectory density as the density times the gradient of its log leaves only the policy's log-probability to differentiate, and the transition terms do not depend on the policy parameters so they drop out."
        },
        {
          "q": "Subtracting a state-dependent baseline from the return leaves the estimator unbiased because:",
          "options": [
            "Baselines are small",
            "The expected score function is zero, so E[b(s) * grad log pi] = 0",
            "The baseline is subtracted after the expectation",
            "It does not; it introduces a small bias"
          ],
          "answer": 1,
          "why": "Since probabilities sum to one, the expectation of the gradient of the log-policy is zero under that policy, so any function of the state multiplied by it contributes nothing to the mean while removing variance."
        },
        {
          "q": "Adding a constant +20 to every reward in an unbaselined REINFORCE run does what?",
          "options": [
            "Changes the optimal policy",
            "Leaves the true gradient unchanged but inflates the estimator's variance enormously",
            "Speeds up convergence",
            "Has no effect at all"
          ],
          "answer": 1,
          "why": "The constant cancels in the true gradient because the expected score is zero, but every sampled term is multiplied by a number twenty units larger, so the Monte Carlo variance grows and the signal is buried in it."
        },
        {
          "q": "You rescale one layer of your policy network by 10 and convergence slows by a factor of two. The principled fix is:",
          "options": [
            "Lower the learning rate",
            "Use a metric on the space of policies rather than parameters, such as a natural gradient or a trust region on the policy divergence",
            "Add more layers",
            "Increase the batch size"
          ],
          "answer": 1,
          "why": "Sensitivity to reparameterisation is exactly the defect the natural gradient removes, by preconditioning with the Fisher information so that a step is measured as a change in the policy distribution rather than in the coordinates."
        }
      ]
    },
    {
      "n": 10,
      "title": "Execution, hedging, and why reinforcement learning is hard on market data",
      "topics": [
        "the execution MDP",
        "dynamic programming versus learning",
        "deep hedging",
        "non-stationarity",
        "off-policy evaluation"
      ],
      "concepts": [
        {
          "name": "Optimal execution is a small dynamic program",
          "explain": "<p>Liquidating an inventory over a fixed horizon is naturally an MDP. The state is time remaining and shares remaining, the action is how much to trade now, and the cost has two competing parts: temporary impact that grows faster than linearly in the trade size, which pushes toward slicing evenly, and the risk of holding unliquidated inventory across a volatile period, which pushes toward trading early.</p><p>With quadratic impact and a quadratic inventory penalty this is the Almgren-Chriss setting, and backward induction solves it exactly in a few lines. The snippet does so on a twelve-unit, six-period problem. With no risk aversion the optimum is precisely the equal slice, two units per period, which is the time-weighted average price schedule. Turn the risk penalty on and the schedule front-loads sharply, to nine units in the first period at a penalty of 0.02, and the total cost rises from 0.24 to 1.06.</p><p>This is the reference answer for the rest of the week. When someone proposes a learned execution agent, the first question is whether it beats the dynamic program on the model it was trained on, and the second is what it does when the model is wrong.</p>",
          "formula": "J_t(q) = \\min_{0\\le v\\le q}\\Big[\\eta v^2 + \\lambda\\sigma^2 (q-v)^2 + J_{t+1}(q-v)\\Big],\\qquad J_T(0)=0",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nQ0, T, eta, lam, sig2 = 12, 6, 0.01, None, 1.0     # inventory units, periods\n\n\ndef schedule(lam):\n    \"\"\"Backward DP: cost = eta*v^2 impact + lam*sig2*q^2 risk, liquidate by T.\"\"\"\n    INF = 1e18\n    J = np.full((T + 1, Q0 + 1), INF); J[T, 0] = 0.0\n    act = np.zeros((T, Q0 + 1), int)\n    for t in range(T - 1, -1, -1):\n        for q in range(Q0 + 1):\n            best, bv = INF, 0\n            for v in range(q + 1):\n                c = eta * v * v + lam * sig2 * (q - v) ** 2 + J[t + 1, q - v]\n                if c < best: best, bv = c, v\n            J[t, q], act[t, q] = best, bv\n    q, path = Q0, []\n    for t in range(T):\n        path.append(act[t, q]); q -= act[t, q]\n    return J[0, Q0], [int(v) for v in path]\n\n\nfor lam in (0.0, 0.02, 0.10):\n    cost, path = schedule(lam)\n    print(f\"lambda {lam:4.2f}   cost {cost:8.4f}   schedule {path}   sum {sum(path)}\")\nprint(f\"with lambda = 0 the optimum is the equal slice Q/T = {Q0 // T} per period (TWAP)\")\n",
            "output": "lambda 0.00   cost   0.2400   schedule [2, 2, 2, 2, 2, 2]   sum 12\nlambda 0.02   cost   1.0600   schedule [9, 2, 1, 0, 0, 0]   sum 12\nlambda 0.10   cost   1.3200   schedule [11, 1, 0, 0, 0, 0]   sum 12\nwith lambda = 0 the optimum is the equal slice Q/T = 2 per period (TWAP)"
          }
        },
        {
          "name": "What learning costs when the answer was already available",
          "explain": "<p>Run tabular Q-learning on exactly the execution problem the previous concept solved, with no knowledge of the cost function's structure, and it recovers the optimal schedule. The snippet reaches a cost of 1.0600 against the dynamic-programming optimum of 1.0600, and the same nine-two-one schedule, with a gap of zero to four decimal places.</p><p>The number worth reading is not the gap, it is the price: sixty thousand simulated parent orders, on a problem with six periods and thirteen inventory levels that backward induction solves in under a millisecond. Learning bought nothing here except independence from knowing the cost function, and on a live desk those sixty thousand episodes would be sixty thousand real executions unless you already had a simulator, in which case you already had the model and could have solved it directly.</p><p>That is the honest case for reinforcement learning in execution. It is not that it beats dynamic programming on the model; it cannot. It is that the realistic problem has a state that dynamic programming cannot enumerate, including book imbalance, recent fills, queue position and venue, and in that regime a learned policy is a way of approximating a dynamic program you could never write down.</p>",
          "formula": "\\text{gap} = \\frac{J^{\\text{learned}} - J^{\\star}}{J^{\\star}},\\qquad \\text{sample cost} = \\text{episodes} \\times \\text{cost per episode}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nQ0, T, eta, lam, sig2 = 12, 6, 0.01, 0.02, 1.0\nINF = 1e18\nJ = np.full((T + 1, Q0 + 1), INF); J[T, 0] = 0.0\nfor t in range(T - 1, -1, -1):\n    for q in range(Q0 + 1):\n        J[t, q] = min(eta * v * v + lam * sig2 * (q - v) ** 2 + J[t + 1, q - v]\n                      for v in range(q + 1))\ndp_cost = J[0, Q0]\n\nrng = np.random.default_rng(90)\nQt = np.zeros((T, Q0 + 1, Q0 + 1))                      # Q[t, q, v], cost-to-go\nfor ep in range(1, 60_001):\n    q, t, eps = Q0, 0, max(0.05, 1.0 - ep / 30_000)\n    alpha = 0.3 if ep < 20_000 else 0.05\n    while t < T:\n        legal = q + 1\n        if t == T - 1:\n            v = q                                        # must finish\n        elif rng.random() < eps:\n            v = int(rng.integers(legal))\n        else:\n            v = int(np.argmin(Qt[t, q, :legal]))\n        c = eta * v * v + lam * sig2 * (q - v) ** 2\n        nxt = 0.0 if t == T - 1 else Qt[t + 1, q - v, :q - v + 1].min()\n        Qt[t, q, v] += alpha * (c + nxt - Qt[t, q, v])\n        q -= v; t += 1\n\nq, path, cost = Q0, [], 0.0\nfor t in range(T):\n    v = q if t == T - 1 else int(np.argmin(Qt[t, q, :q + 1]))\n    cost += eta * v * v + lam * sig2 * (q - v) ** 2\n    path.append(v); q -= v\nprint(f\"dynamic programming optimum   cost {dp_cost:.4f}\")\nprint(f\"tabular Q-learning, 60k eps   cost {cost:.4f}   schedule {path}\")\nprint(f\"gap {100 * (cost / dp_cost - 1):+.2f}%  -- paid for with 60,000 simulated parents\")\n",
            "output": "dynamic programming optimum   cost 1.0600\ntabular Q-learning, 60k eps   cost 1.0600   schedule [9, 2, 1, 0, 0, 0]\ngap +0.00%  -- paid for with 60,000 simulated parents"
          }
        },
        {
          "name": "Deep hedging is a stochastic control problem with costs",
          "explain": "<p>Textbook delta hedging assumes continuous, costless rebalancing. Introduce transaction costs and a finite number of rebalances and the optimal policy is no longer 'hold delta shares'. It becomes a no-trade band: leave the hedge alone while the position is close enough to delta, and trade back only when the gap is worth the cost. Deep hedging is the name for learning that policy directly from simulated paths under whatever objective the desk actually has.</p><p>The snippet builds the trade-off explicitly for a one-month at-the-money call with twenty rebalances, five basis points of cost and forty thousand paths. Rebalancing every step gives a mean P&amp;L of minus 0.095 with a standard deviation of 0.445; a band of 0.20 gives minus 0.064 with a standard deviation of 0.693; not hedging at all gives minus 0.028 with a standard deviation of 3.50. Cost falls monotonically with the band and risk rises, and choosing a point on that curve is a statement of risk appetite, not a mathematical fact.</p><p>The value of framing it as control rather than as a formula is that the same machinery accepts discrete hedging times, market impact, a volatility smile and a utility rather than a variance, none of which the closed-form answer survives.</p>",
          "formula": "\\min_{\\text{policy}}\\ \\mathbb{E}\\big[-\\mathrm{PnL}\\big] + \\lambda\\,\\mathrm{sd}\\big(\\mathrm{PnL}\\big),\\quad \\mathrm{PnL} = p_0 + \\sum_t h_t \\Delta S_t - c\\sum_t |{\\Delta h_t}|S_t - (S_T-K)^{+}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\nfrom scipy.stats import norm\n\nrng = np.random.default_rng(91)\nS0, K, sig, T, steps, paths, cost_bp = 100.0, 100.0, 0.20, 1 / 12, 20, 40_000, 5.0\ndt = T / steps\nZ = rng.normal(size=(paths, steps))\nlogS = np.log(S0) + np.cumsum((-0.5 * sig ** 2) * dt + sig * np.sqrt(dt) * Z, axis=1)\nS = np.hstack([np.full((paths, 1), S0), np.exp(logS)])\n\nd1 = lambda s, tau: (np.log(s / K) + 0.5 * sig ** 2 * tau) / (sig * np.sqrt(np.maximum(tau, 1e-12)))\nprem = S0 * norm.cdf(d1(S0, T)) - K * norm.cdf(d1(S0, T) - sig * np.sqrt(T))\n\n\ndef hedge(band):\n    h = np.zeros(paths); cash = np.full(paths, prem); traded = np.zeros(paths)\n    for t in range(steps):\n        tau = T - t * dt\n        delta = norm.cdf(d1(S[:, t], tau))\n        move = np.abs(delta - h) > band\n        dh = np.where(move, delta - h, 0.0)\n        cash -= dh * S[:, t] + np.abs(dh) * S[:, t] * cost_bp * 1e-4\n        traded += np.abs(dh); h = h + dh\n    cash += h * S[:, -1] - np.maximum(S[:, -1] - K, 0.0)\n    return cash, traded\n\n\nprint(f\"call premium {prem:.4f}   transaction cost {cost_bp:.0f} bp of notional\")\nprint(\" band    mean P&L    sd P&L    mean shares traded\")\nfor band in (0.0, 0.02, 0.05, 0.10, 0.20, 1.00):\n    pnl, tr = hedge(band)\n    print(f\"{band:5.2f}   {pnl.mean():+9.4f}  {pnl.std():8.4f}   {tr.mean():17.3f}\")\nprint(\"no-trade bands trade risk against cost: this is the objective deep hedging learns\")\n",
            "output": "call premium 2.3030   transaction cost 5 bp of notional\n band    mean P&L    sd P&L    mean shares traded\n 0.00     -0.0948    0.4452               1.889\n 0.02     -0.0931    0.4464               1.856\n 0.05     -0.0870    0.4587               1.741\n 0.10     -0.0765    0.5129               1.512\n 0.20     -0.0636    0.6930               1.190\n 1.00     -0.0281    3.5038               0.000\nno-trade bands trade risk against cost: this is the objective deep hedging learns"
          }
        },
        {
          "name": "Non-stationarity is the structural problem",
          "explain": "<p>Every convergence result in this course assumes a fixed MDP. Markets are not one. Participants adapt, regimes change, and a policy that was optimal is not merely stale, it can be exactly wrong, because the sign of the relationship it learned has flipped while the state it observes looks identical.</p><p>The snippet is deliberately blunt. A policy is fitted on a momentum regime and earns an in-sample Sharpe ratio of 2.26 and an out-of-sample Sharpe of 2.10 on fresh data from the same regime, which is exactly the validation result that gets a strategy funded. The same policy on the same asset after the autocorrelation flips sign earns minus 2.02. No overfitting occurred. The environment changed, and nothing in the agent's state told it so.</p><p>The defences are all engineering rather than theory: include regime indicators in the state so the policy can condition rather than assume, retrain on rolling windows with an explicit decay, cap position size so a sign error is survivable, and monitor live performance against the training distribution so the alarm fires before the drawdown does. A desk deploying a learned agent without at least the last of these is running an unmonitored bet on stationarity.</p>",
          "formula": "\\text{Assumed: } (P,r)\\ \\text{fixed}.\\quad\\text{Reality: }(P_t,r_t)\\ \\text{drifts, and } \\pi^{\\star}_{t_0}\\ \\text{can be pessimal at } t_1",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(92)\nn = 4000\n\n\ndef series(phi, gen):\n    r = np.zeros(n)\n    for t in range(1, n):\n        r[t] = phi * r[t - 1] + 0.01 * gen.normal()\n    return r\n\n\ntrain = series(+0.15, np.random.default_rng(1))       # momentum regime\ntestA = series(+0.15, np.random.default_rng(2))\ntestB = series(-0.15, np.random.default_rng(3))       # same asset, reverted\n\n\ndef fit(r):\n    x, y = r[:-1], r[1:]\n    return float((x @ y) / (x @ x))\n\n\ndef sharpe(r, beta):\n    pos = beta * r[:-1] / 0.01\n    pnl = pos * r[1:]\n    return float(np.sqrt(252) * pnl.mean() / pnl.std())\n\n\nb = fit(train)\nprint(f\"policy fitted on the momentum regime: position = {b:+.4f} * last return / vol\")\nprint(f\"Sharpe in-sample (momentum)      {sharpe(train, b):+6.2f}\")\nprint(f\"Sharpe out-of-sample, same regime {sharpe(testA, b):+6.2f}\")\nprint(f\"Sharpe after the regime flips     {sharpe(testB, b):+6.2f}\")\nprint(\"nothing about the state told the agent the sign of the world had changed\")\n",
            "output": "policy fitted on the momentum regime: position = +0.1454 * last return / vol\nSharpe in-sample (momentum)       +2.26\nSharpe out-of-sample, same regime  +2.10\nSharpe after the regime flips      -2.02\nnothing about the state told the agent the sign of the world had changed"
          }
        },
        {
          "name": "Off-policy evaluation, and the effective sample size",
          "explain": "<p>You cannot run a candidate policy in a live market to see whether it is good. So you try to evaluate it on logged data from the policy that was actually running, by reweighting each trajectory by the ratio of the probabilities the two policies assign to it. The estimator is unbiased, and that fact is close to useless, because the weight is a product over time steps and its variance grows exponentially in the horizon.</p><p>The snippet logs twenty thousand trajectories and evaluates a target policy that differs modestly from the logging one. At horizon one the effective sample size is twelve thousand and the estimate is accurate. At horizon twenty it is 2.6, and at horizon forty the estimate is 0.165 against a true value of 3.6 while reporting a standard error of 0.087. That last line is the dangerous one: the estimator is confidently, catastrophically wrong, because the trajectories carrying nearly all the weight were never sampled.</p><p>Always print the effective sample size next to an importance-weighted estimate. Weighted importance sampling, doubly robust estimators and per-step weight clipping all help, and none of them manufactures data that is not in the log. A desk should treat an off-policy evaluation with an effective sample size in single digits the way it would treat a backtest with three trades.</p>",
          "formula": "\\hat V^{\\pi} = \\frac{1}{n}\\sum_i \\left(\\prod_{t}\\frac{\\pi(a_t^i|s_t^i)}{\\mu(a_t^i|s_t^i)}\\right)G_i,\\qquad \\mathrm{ESS} = \\frac{\\left(\\sum_i w_i\\right)^2}{\\sum_i w_i^2}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")          # this machine's BLAS flags spurious matmul warnings\n\nrng = np.random.default_rng(93)\nn, H = 20_000, None\np_target = 0.9                       # target policy picks action 1 with prob 0.9\np_behave = 0.5                       # logged data came from a coin flip\n\nprint(\"  H   IS estimate   true value   IS std err   effective sample size\")\nfor H in (1, 5, 10, 20, 40):\n    A = (rng.random((n, H)) < p_behave).astype(float)\n    rew = (A.sum(axis=1) * 0.1) + 0.05 * rng.normal(size=n)\n    ratio = np.prod(np.where(A == 1, p_target / p_behave, (1 - p_target) / (1 - p_behave)), axis=1)\n    est = (ratio * rew).mean()\n    se = (ratio * rew).std(ddof=1) / np.sqrt(n)\n    ess = ratio.sum() ** 2 / (ratio ** 2).sum()\n    true = 0.1 * H * p_target\n    print(f\"{H:3d}   {est:11.4f}   {true:10.4f}   {se:10.4f}   {ess:20.1f}\")\nprint(f\"logged trajectories: {n}. The effective sample size is what you actually have.\")\n",
            "output": "  H   IS estimate   true value   IS std err   effective sample size\n  1        0.0897       0.0900       0.0008                12160.1\n  5        0.4445       0.4500       0.0116                 1657.9\n 10        0.9614       0.9000       0.0908                  131.2\n 20        2.1268       1.8000       1.3848                    2.6\n 40        0.1651       3.6000       0.0871                    3.7\nlogged trajectories: 20000. The effective sample size is what you actually have."
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "The arc of the quarter",
        "params": {
          "events": [
            {
              "t": 1,
              "label": "Function approximation",
              "note": "Nonlinearity, losses, and the low signal-to-noise regime."
            },
            {
              "t": 2,
              "label": "Backpropagation",
              "note": "The chain rule, bookkept, and always gradient-checked."
            },
            {
              "t": 3,
              "label": "Optimisers",
              "note": "Conditioning sets the rate; 2/L sets the ceiling."
            },
            {
              "t": 4,
              "label": "Regularisation",
              "note": "Ridge, early stopping, dropout, double descent."
            },
            {
              "t": 5,
              "label": "Sequence models",
              "note": "Recurrence, gating, attention, and what returns cannot teach."
            },
            {
              "t": 6,
              "label": "MDPs and dynamic programming",
              "note": "Bellman contraction, value and policy iteration."
            },
            {
              "t": 7,
              "label": "Model-free learning",
              "note": "TD, Q-learning, SARSA, and the price of exploration."
            },
            {
              "t": 8,
              "label": "Function approximation in RL",
              "note": "The deadly triad, target networks, replay."
            },
            {
              "t": 9,
              "label": "Policy gradients",
              "note": "Score functions, baselines, actor-critic, natural gradients."
            },
            {
              "t": 10,
              "label": "Execution and hedging",
              "note": "Dynamic programming as the benchmark; non-stationarity as the enemy."
            }
          ]
        }
      },
      "pitfalls": [
        "Presenting a learned execution agent without the dynamic-programming benchmark on the same model. On any problem small enough to solve exactly, learning has to justify its sample cost.",
        "Reporting an importance-weighted off-policy estimate without the effective sample size. At long horizons the estimator can be wildly wrong while reporting a small standard error.",
        "Validating on held-out data from the same regime and calling it out-of-sample. That tests overfitting; it says nothing about the regime change that will actually break the policy.",
        "Training a hedging agent against a simulator and forgetting that the agent will learn the simulator's artefacts, including any impact model that is too forgiving."
      ],
      "check": [
        {
          "q": "With no risk aversion, the optimal liquidation schedule under quadratic temporary impact is:",
          "options": [
            "Sell everything immediately",
            "Equal slices across the horizon",
            "Sell everything at the end",
            "Proportional to remaining time squared"
          ],
          "answer": 1,
          "why": "With a convex impact cost and no penalty for holding inventory, splitting the order evenly minimises the sum of squares, which is why the risk-neutral Almgren-Chriss answer is the time-weighted average price schedule."
        },
        {
          "q": "Tabular Q-learning matches the dynamic-programming cost on the execution problem after 60,000 episodes. What is the correct conclusion?",
          "options": [
            "Reinforcement learning is better than dynamic programming here",
            "Learning recovered the known answer at a large sample cost, so its case has to rest on problems dynamic programming cannot enumerate",
            "The dynamic program was wrong",
            "60,000 episodes is cheap"
          ],
          "answer": 1,
          "why": "Matching an exactly solvable benchmark is a sanity check, not a win; the argument for learning is that realistic execution states, including book imbalance and queue position, are far too large to enumerate."
        },
        {
          "q": "An importance-sampling off-policy estimate has an effective sample size of 2.6 out of 20,000 logged trajectories. You should:",
          "options": [
            "Report the estimate with its standard error",
            "Treat the estimate as uninformative, because nearly all the weight sits on a handful of trajectories",
            "Increase the discount factor",
            "Use a longer horizon"
          ],
          "answer": 1,
          "why": "An effective sample size in single digits means the estimator is effectively an average of two or three trajectories, so its reported standard error is itself unreliable and the estimate carries no usable information."
        },
        {
          "q": "A policy validated out-of-sample at Sharpe 2.1 scores -2.0 after the autocorrelation of the asset flips sign. The cause is:",
          "options": [
            "Overfitting to the training sample",
            "Non-stationarity: the environment changed and the state gave the agent no way to notice",
            "A bug in the backtest",
            "Too high a learning rate"
          ],
          "answer": 1,
          "why": "Out-of-sample data from the same regime already ruled out overfitting; the failure is that the MDP itself changed, which no amount of in-regime validation can detect and only regime-aware state or live monitoring can catch."
        }
      ]
    }
  ]
};
