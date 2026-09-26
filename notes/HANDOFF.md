# HANDOFF — FinMath Curriculum Arena (written 2026-09-26 18:30 ET, in case the session dies)

Live site: https://sdonadio.github.io/finmath-curriculum-dashboard/   repo: github.com/sdonadio/finmath-curriculum-dashboard
Local preview: `cd ~/PycharmProjects/FinMathCurriculumArena && python3 -m http.server 8765 --bind 127.0.0.1` → http://127.0.0.1:8765/

## State of courses/ (29 total)
Done + live: see `ls courses/`. Missing = every code in data/courses.csv without a file.
Tier A (Sebastien's own, Opus, brief notes/TIER_A_BRIEF.md): 33500 (in progress), 32700 (not started).
Tier B (Sonnet, brief notes/CONTENT_BRIEF.md): everything else. Partial generators may sit in tools/gen_finm_*.py
without a matching courses/ file — finish those first (cheapest).

## Redeploy after any course lands (only files that validate!)
    python3 tools/validate.py courses/finm-XXXXX.js        # must say 0 errors
    python3 tools/build_skills.py && python3 tools/make_course_pages.py
    git add -A && git commit -m "FinMath dashboard: +FINM XXXXX" && git push origin main   # Pages updates in ~1 min

## Full finish sequence (when the last course lands)
    python3 tools/run_snippets.py --check courses/     # every stored output still matches real stdout
    python3 tools/validate.py                          # all files, 0 errors
    python3 tools/sweep.py --keep-going                # headless Chromium: every page, every click, 0 errors
    (merge data/new_tags/*.json into data/skills_seed.js if build_skills complains about single-course tags)

## Rules that must not change
Sonnet for tier-B courses, max 5 agents at a time, laptop plugged in. Opus for 33500/32700. Never edit
data/skills_seed.js from an agent. Never link Canvas/Ed/arena hosts from the public site. Mark Hendricks and
Roger Lee have been sent the link (draft in Gmail) — their pages (36700, 37400, 37500, 33000, 32000) are the
ones colleagues look at first.

## Known nit
courses/finm-34000.js: one snippet lacks np.seterr(all="ignore") → stderr warning → run_snippets --check FAIL.
Add the line to that snippet's src in the file, re-run run_snippets on the file, commit.
