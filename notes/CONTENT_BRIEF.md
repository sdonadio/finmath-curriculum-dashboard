# Content-agent brief — FinMath Curriculum Arena
(Rebuilt 2026-09-26 after the original scratchpad brief was lost in a laptop crash. Lives in the repo now so it survives.)

Repo: ~/PycharmProjects/FinMathCurriculumArena (NOT a git repo yet; do not git init).
Read FIRST: SCHEMA.md (frozen), then one finished course as the exemplar, e.g. courses/finm-34000.js (5-week, 50-unit)
or courses/finm-37500.js / courses/finm-33150.js (9–10-week, 100-unit). Match their depth and tone exactly.
Public source for your course: data/raw/pages/finm-XXXXX.txt (the only readable source; syllabus PDFs are behind Box login).
Roster with instructor / quarter / units: data/courses.csv.

## Deliverable per course
courses/finm-XXXXX.js defining window.COURSES["FINM XXXXX"] exactly per SCHEMA.md. Depth target:
- 100-unit course → 9–10 weeks; 50-unit course → 5 weeks. 3–5 concepts per week, each with explain (150–300 words),
  optional KaTeX formula, and a runnable code snippet (Python; C++ only where the course is a C++ course).
- widget on ≥ 60 % of weeks (types in SCHEMA.md widget menu; params only, no code), 2–4 pitfalls, 3–4 MCQs per week.
- interview: 8–12 items (levels screen/onsite/senior), glossary 10–20, brushup 4–8, reappears_in, prerequisites, textbooks.
- tier: "B" (tier "A" only for FINM 33500 / 32700 which may draw on Sebastien's real course material).
- source.note: copy the wording pattern from finm-34000.js (public page only, reconstruction, not instructor's material).

## Lessons from the earlier agents (follow these)
1. WRITE A PYTHON GENERATOR: tools/gen_finm_XXXXX.py that builds a dict and emits the .js via json.dumps(indent=2).
   Hand-edited 200 KB JS literals lose a quote or brace. See tools/gen_finm_32800.py for the pattern (that one is
   unfinished — only SNIPPETS + header exist).
2. Every Python snippet starts with `import numpy as np` + `np.seterr(all="ignore")` — Accelerate numpy spams stderr
   and tools/run_snippets.py FAILS a snippet that writes to stderr. No warnings module output either. No network, no files
   outside tempfile, deterministic seeds (np.random.default_rng(<course number>)). Runtime < 10 s each.
3. TEST SNIPPETS BEFORE WRITING PROSE: run each snippet locally; then write prose consistent with what it prints.
   Emit code.output as "" — then run `python3 tools/run_snippets.py courses/finm-XXXXX.js` which fills it with real stdout.
4. Skill tags: PREFER tags from data/skills_seed.js (grep it). A genuinely new tag goes to data/new_tags/finm-XXXXX.json
   as [{"tag","category","name"}] — see data/new_tags/finm-34600.json. NEVER edit data/skills_seed.js or skills.js.
   Categories: math, stats-ml, markets, pricing, programming, data, risk, trading. Every skills_assumed tag should be
   plausibly built by some other course in the program (data/courses.csv lists them all).
5. No Math.random anywhere; widgets are params only. Formulas are KaTeX strings (escape backslashes in JSON).
6. Keep going until validate passes; then STOP. Do not touch other courses' files, app.js, widgets.js, program.js.

## Finish checklist (per course, in this order; all must pass)
    python3 tools/gen_finm_XXXXX.py
    python3 tools/run_snippets.py courses/finm-XXXXX.js            # fills output; 0 failures
    python3 tools/run_snippets.py --check courses/finm-XXXXX.js    # PASS
    python3 tools/validate.py courses/finm-XXXXX.js                # 0 errors (warnings OK)
    node --check courses/finm-XXXXX.js

## Report back (short)
Per course: file path, weeks, concepts, widgets, MCQs, interview count, snippet pass count, validate result, new tags added.
