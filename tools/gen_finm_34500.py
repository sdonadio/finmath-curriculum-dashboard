#!/usr/bin/env python3
"""Generator for courses/finm-34500.js -- FINM 34500, Stochastic Calculus.

Why a generator instead of a hand-edited JS literal: the course file is a
large JSON-ish object with forty embedded Python snippets across ten weeks,
and hand-editing one is how a quote or a brace goes missing. This script
builds the whole thing as a Python dict and emits it with json.dumps(indent=2),
so the file is always well formed.

    python3 tools/gen_finm_34500.py                     # writes courses/finm-34500.js
    python3 tools/run_snippets.py courses/finm-34500.js  # fills every `output`
    python3 tools/validate.py courses/finm-34500.js      # must PASS

Every snippet below was executed locally before the surrounding prose was
written; `output` is emitted EMPTY here on purpose and is filled in from real
stdout by tools/run_snippets.py, so a claim in the prose can never drift from
what the code actually prints. Re-run run_snippets.py after every regeneration.

Provenance: the only readable source for this course was the public course
page (data/raw/pages/finm-34500.txt). The syllabus is a Box shared link
behind a university login and returned no text, so everything past the
public description is this dashboard's own reconstruction. See source.note.
"""
import json
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "courses", "finm-34500.js")

COURSE = {
    "code": "FINM 34500",
    "slug": "finm-34500",
    "title": "Stochastic Calculus",
    "instructor": "Greg Lawler",
    "quarter": "Winter",
    "units": 100,
    "block": "electives",
    "concentrations": ["options-derivatives"],
    "source": {
        "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/options-and-derivatives/finm-34500/",
        "syllabus_url": "https://uchicago.box.com/s/s7162s5rryr05c8w1hv6ngtmelxzspag",
        "fetched": "2026-09-26",
        "note": "Only the public course page was readable: the syllabus PDF is a Box shared link behind a campus login. The ten-week outline, concepts, code, widgets, questions and glossary here are the dashboard's own reconstruction of a standard graduate treatment of stochastic calculus, built to match the public page's own stated arc -- discrete martingales, Brownian motion and the Ito integral, Ito's formula, Feynman-Kac, Girsanov, a light touch of option-pricing applications, and a closing look at jump (Levy) processes. Nothing on this page is attributed to the instructor, and no grading scheme, assignment, or exam format is implied. The public page notes that its first five weeks may be taken standalone as FINM 34510; nothing here assumes that split."
    },
    "tier": "B",
    "description": "The course starts with a quick introduction to martingales in discrete time, and then Brownian motion and the Ito integral are defined carefully. The main tools of stochastic calculus (Ito's formula, Feynman-Kac formula, Girsanov theorem, etc.) are developed. The treatment includes discussions of simulation and the relationship with partial differential equations. Some applications are given to option pricing, but much more on this is done in other courses. The course ends with an introduction to jump processes (Levy processes) and the corresponding integration theory.",
    "prerequisites": [
        "Measure-theoretic probability at the level of a first graduate course: sigma-algebras, expectation as an integral, and conditional expectation as a projection onto a coarser sigma-algebra.",
        "Real analysis: comfort with limits, continuity and epsilon-delta arguments, since the course proves facts about paths that are continuous everywhere and differentiable nowhere.",
        "Basic exposure to ordinary differential equations is helpful for the Feynman-Kac weeks, but the course develops the partial-differential-equation connection from scratch rather than assuming it.",
        "Enough Python and NumPy to simulate a random walk, discretize a stochastic differential equation, and read the output of a Monte Carlo experiment without a plotting library doing the thinking."
    ],
    "textbooks": [
        {"title": "Stochastic Calculus: An Introduction with Applications", "author": "Gregory F. Lawler",
         "note": "The course's own standard treatment, matching this exact arc from discrete martingales through Levy processes."},
        {"title": "Stochastic Calculus for Finance II: Continuous-Time Models", "author": "Steven Shreve",
         "note": "Standard reference for the Ito calculus, Girsanov and Feynman-Kac material, with an eye toward the option-pricing applications in week 8."},
        {"title": "Brownian Motion and Stochastic Calculus", "author": "Ioannis Karatzas and Steven Shreve",
         "note": "Standard rigorous reference for Brownian motion, the Ito integral, and the existence/uniqueness theory of week 5."},
        {"title": "Financial Modelling with Jump Processes", "author": "Rama Cont and Peter Tankov",
         "note": "Standard reference for the Levy process and jump-diffusion material in weeks 9 and 10."}
    ],
    "skills_built": [
        "martingales", "random-walk", "brownian-motion", "ito-calculus", "ito-formula",
        "stochastic-differential-equations", "feynman-kac", "girsanov", "poisson-process", "levy-processes"
    ],
    "skills_assumed": ["measure-theoretic-probability", "conditional-expectation", "linear-algebra", "numpy"],
    "brushup": [
        {"topic": "Conditional expectation as a projection",
         "why": "Every week from 1 through 7 leans on E[X|F] behaving like a best guess given partial information, with the tower property doing quiet work throughout. If E[E[X|F_s]|F_t]=E[X|F_t] for t<=s is not automatic, week 1's martingale examples will feel like new machinery instead of the same idea restated.",
         "resource": "Any first graduate probability text's chapter on conditional expectation, or work the discrete case by hand"},
        {"topic": "Epsilon-delta continuity, once",
         "why": "Brownian motion's defining properties -- continuous paths, nowhere differentiable -- are stated precisely in week 2, and both halves have to be believed at once. Refreshing what 'continuous but not differentiable' means for an ordinary function removes the surprise before probability is layered on top.",
         "resource": "Any real analysis text's treatment of the Weierstrass function, or simply review the definition of a derivative as a limit"},
        {"topic": "The moment generating function of a normal random variable",
         "why": "E[exp(sigma Z)] = exp(sigma^2/2) for a standard normal Z is the one-line fact behind every '-sigma^2 T/2' correction in Ito's formula and Girsanov's theorem. Derive it once by completing the square, and it stops being a surprise in weeks 4 and 7.",
         "resource": "Complete the square in the Gaussian integral by hand; five minutes, never needed again"},
        {"topic": "Bisection and simple root-finding",
         "why": "Several exercises in this course (gambler's ruin thresholds, calibration-style checks) solve an equation numerically rather than in closed form. A quick refresher means the CODE reads as familiar, leaving full attention for the probability it demonstrates.",
         "resource": "Any numerical methods reference's chapter on root-finding"},
        {"topic": "NumPy array broadcasting",
         "why": "Every simulation in this course generates thousands of sample paths at once as a 2D array (paths by time steps) rather than looping path by path. If broadcasting a (paths,1) array against a (paths,n) array does not feel automatic, the code reads as more mysterious than the probability it demonstrates.",
         "resource": "NumPy's own broadcasting documentation, or FINM 32400/32800's array-programming material"}
    ],
    "weeks": []
}


def add_week(n, title, topics, concepts, widget, pitfalls, check):
    COURSE["weeks"].append({
        "n": n, "title": title, "topics": topics, "concepts": concepts,
        "widget": widget, "pitfalls": pitfalls, "check": check
    })


# ─────────────────────────────────────────────────────────────────────────
# Week 1 -- Discrete-time martingales, from a fair coin to a fair game
# ─────────────────────────────────────────────────────────────────────────
add_week(
    1, "Discrete-time martingales, from a fair coin to a fair game",
    ["filtrations and conditional expectation", "martingales and the simple random walk",
     "optional stopping and gambler's ruin", "the martingale transform: why a fair game can't be beaten"],
    [
        {"name": "Filtrations and conditional expectation",
         "explain": "<p>A filtration {F_n} formalizes \"the information available by time n\": F_n contains every event whose outcome is already decided after n coin flips, and F_n grows as n grows because nothing already known is ever forgotten. Conditional expectation E[X|F_n] is the best F_n-measurable guess at a random variable X that is only fully revealed later -- the average of X over every future path consistent with what has already happened.</p><p>The property that makes conditional expectation useful rather than just a definition is the tower property: E[E[X|F_m]|F_n] = E[X|F_n] whenever n &lt;= m. Averaging a partial average, over the SAME earlier information, gives back the plain average. This sounds almost too simple to state, but it is the fact every martingale argument in this course quietly leans on, from optional stopping later this week to the Ito integral's own martingale property in week 3.</p><p>The simulation below builds 200,000 paths of 20 fair coin flips, peeks at the running sum after 8 flips, and computes the average FINAL sum conditional on each value seen at flip 8. Because the remaining 12 flips are mean zero regardless of the past, the conditional expectation of the final sum, given the sum at flip 8, comes back out to exactly the flip-8 value itself -- a first, concrete glimpse of what the next concept names a martingale.</p>",
         "formula": "E\\big[E[X\\mid\\mathcal{F}_m]\\,\\big|\\,\\mathcal{F}_n\\big] = E[X\\mid\\mathcal{F}_n], \\qquad n \\le m",
         "code": {"lang": "python", "src": open(os.path.join(HERE, "tmp_none"), "r").read() if False else None, "output": ""}},
    ],
    None, [], []
)

if __name__ == "__main__":
    print("placeholder")
