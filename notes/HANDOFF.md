# HANDOFF — FinMath Curriculum Arena (written 2026-09-26 18:30 ET, in case the session dies)

Live site: https://sdonadio.github.io/finmath-curriculum-dashboard/   repo: github.com/sdonadio/finmath-curriculum-dashboard
Local preview: `cd ~/PycharmProjects/FinMathCurriculumArena && python3 -m http.server 8765 --bind 127.0.0.1` → http://127.0.0.1:8765/

## CHECKPOINT 2026-09-26 ~21:15 ET — both tier-A courses LIVE; everything else FROZEN by Sebastien
17 course files live. FINM 33500 (e66b39d) and FINM 32700 (8417fbd) done per notes/TIER_A_BRIEF.md, 0 errors,
sweep clean. 13 tier-B courses missing: 31200 32000 32400 32600 32950 33100 33160 33200 34500 35600 35700 35900 (+ none tier A).
HIS RULE: do NOT relaunch tier-B agents until he confirms Mark Hendricks has replied. When he does: Sonnet ≤5,
brief notes/CONTENT_BRIEF.md, reuse notes/scratch_snippets/ + tools/gen_finm_34500.py stub.

## (older) CHECKPOINT 2026-09-26 18:40 ET — all agents stopped by request (account switch)
15 course files live (see `ls courses/`). 14 missing: 31200 32000 32400 32600 32700 32950 33100 33160 33200 33500 34500 35600 35700 35900.
Partial work saved:
- tools/gen_finm_33500.py  (26 KB, Opus tier A, week 1 snippets only) → finish with Opus per notes/TIER_A_BRIEF.md
- tools/gen_finm_34500.py  (10 KB stub) → rewrite
- notes/scratch_snippets/  → tested snippet .py files the stopped agents left (c1wXcY = 32000 Numerical Methods,
  others for 35700 / 31200 / 35600 / 32400); reuse them as SNIPPETS when relaunching those courses.
Relaunch plan (≤5 Sonnet + Opus for 33500/32700): 34500 · 32000+35700 · 31200+35600 · 32400 · 33500 (Opus); then
32700 (Opus) · 32600+32950 · 33100+33160 · 33200+35900.

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
(fixed 3b11bab) finm-34000.js np.seterr — run_snippets --check now passes on every file.
