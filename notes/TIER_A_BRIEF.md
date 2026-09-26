# TIER A brief — FINM 33500 and FINM 32700 (Sebastien Donadio's own courses)

These two pages must be the BEST on the site. The instructor is the site's author, so unlike every other
course you have his REAL material and his explicit permission to use it. tier: "A". The provenance banner
text is generated from tier, so set `tier: "A"` and write source.note as: "Built from the instructor's own
syllabus, lecture decks, labs and speaker guides (Autumn 2026), with his permission; the code, questions and
glossary are this dashboard's own and were executed before publication."

Everything in notes/CONTENT_BRIEF.md still applies (generator script, snippet testing, np.seterr, tags,
finish checklist). On top of that:

## Real sources (READ THESE, in this order; do not read anything else in AlgoArena)
FINM 33500 Systematic Trading Technologies (Autumn 2026, Fridays, in-person; sessions 0–9):
- ~/PycharmProjects/AlgoArena/course/systematic-trading/SYLLABUS.md           (authoritative week table + outcomes)
- ~/PycharmProjects/AlgoArena/course/systematic-trading/labs/week01.md … week09.md   (what students actually build)
- ~/PycharmProjects/AlgoArena/course/systematic-trading/session0_talking_points.md … session9_talking_points.md
  (what he actually says in class; skim headings + key numbers, do not read every line)
- ~/PycharmProjects/AlgoArena/course/systematic-trading/build_week1.py … build_week9.py (slide titles = the deck
  outline; grep for title strings rather than reading whole files)
- ~/PycharmProjects/STSkillsArena/focus.js  (the per-session technical focus + skills checklist he already published)
- ~/PycharmProjects/AlgoArena/CLAUDE.md (AlgoArena architecture: roles, matching rules, fees, message discipline)
FINM 32700 Low-Latency Trading Systems (C++; 9 Monday sessions):
- ~/PycharmProjects/AlgoArena/course/hft-uchicago/SPEAKER_GUIDES.md + session1..9_talking_points.md
- ~/PycharmProjects/AlgoArena/course/hft-uchicago/build_u1.py … build_u9.py (slide titles)
- ~/PycharmProjects/FINMHFTSkillsArena/focus.js
- ~/PycharmProjects/AlgoArena/docs/HFT_SYLLABUS.md (design arc; the 9-session mapping is in focus.js)

## Week structure
33500: 10 weeks in the schema = sessions 0–9. weeks[0] = {n:1, title:"Session 0 · Setup and orientation …"} etc.
Use the syllabus table's topics and "capability you leave with" verbatim as the spine. Midterm sits in session 5,
final in exam week (mention in the week text, no dates beyond the syllabus).
32700: 9 weeks = sessions 1–9 (u1..u9), midterm in session 5, final session 9 tournament.

## Higher bar than tier B
- 4–5 concepts per week, each with a snippet that mirrors what the lab actually does (33500: Python — a mini
  price-time CLOB, asyncio event loop with cancellation, typed WebSocket-style message schema with pydantic-like
  validation done in plain Python, event-driven backtester with look-ahead trap, order-book data structures with
  timing, chunked columnar processing, leak-free walk-forward validation, pytest-style property test, model
  card/kill switch; 32700: lang "cpp" compiled with c++ -std=c++20 — cache lines, pointers/RAII, lock-free SPSC
  ring, memory pools, branchless code, timers/latency histograms, kernel-bypass concepts as pure-CPU simulations).
  Snippets stay self-contained (no imports from the AlgoArena repo), deterministic, < 10 s.
- A widget on EVERY week (orderbook, code-trace, tree-diagram, timeline, curve, histogram, simulate-paths).
- Each week's `explain` ties the concept to what the student does in that week's lab and in the arena
  ("In the lab you …", "In the arena this shows up as …"), citing the lab step by its heading.
- 12 interview items (screen/onsite/senior mix) drawn from the syllabus's "capability employers test for" list.
- glossary 20 items; brushup 8; reappears_in must name real FinMath courses (33500 ↔ 32700, 33150, 34600, 35100,
  32400, 32800, 33160).
- prerequisites/textbooks from the syllabus; skills_built from STSkillsArena/FINMHFTSkillsArena focus.js
  vocabulary mapped onto data/skills_seed.js tags (add new tags via data/new_tags/finm-XXXXX.json).
- Public links allowed inside explain HTML (as <a>): https://sdonadio.github.io/systematic-trading-arena/ ,
  https://sdonadio.github.io/systematic-trading-skills-dashboard/ , https://sdonadio.github.io/low-latency-trading-arena/ ,
  https://sdonadio.github.io/finm-hft-skills-dashboard/ , https://github.com/sdonadio/algoarena-team-template .
  NEVER link Canvas, Ed, the arena host names, or anything requiring a login. Never mention any other university.
- description: rewrite from SYLLABUS.md "What this course is for" (first person is fine: the author is the instructor).

Finish checklist per file exactly as in CONTENT_BRIEF.md; C++ snippets must compile under
`c++ -std=c++20` on this Mac (Apple clang). Report per the brief.
