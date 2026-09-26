#!/usr/bin/env python3
"""Generate skills.js — the shared skill vocabulary — from courses/*.js.

SCHEMA.md freezes the vocabulary rule:

    Kebab-case, shared across all 29 courses. tools/build_skills.py collects
    every tag and fails if a tag appears in exactly one course *and* is not in
    skills_seed.js's allow-list (catches typos and near-duplicates).
    Categories: math, stats-ml, markets, pricing, programming, data, risk,
    trading. Prefer an existing tag over a new one.

This tool implements exactly that, and two things more that cost nothing and
save an afternoon: it prints NEAR-DUPLICATE SUSPECTS (pairs of tags within a
small edit distance of each other, e.g. `monte-carlo` vs `monte-carlo-methods`)
whether or not they are singletons, and it emits a compact COURSE INDEX
alongside the tags so index.html can filter by skill and show per-course
progress without loading 29 deep course files.

    python3 tools/build_skills.py              # write skills.js, exit 1 on a violation
    python3 tools/build_skills.py --check      # do not write; exit 1 if stale or invalid
    python3 tools/build_skills.py --dry-run    # print the report, write nothing
    python3 tools/build_skills.py --distance 3 # widen the near-duplicate search

── data/skills_seed.js ────────────────────────────────────────────────
The seed is written by the harvest agent and is where a tag gets its human
name, its category and (optionally) permission to be used by exactly one
course. Any of these three shapes is accepted:

    window.SKILLS_SEED = {
      categories: [{id:"math", name:"Mathematics", color:"#2e6db4"}, …],
      tags: { "risk-neutral-pricing": {name:"Risk-neutral pricing",
                                       category:"pricing", blurb:"…"}, … },
      allow: ["a-tag-only-one-course-legitimately-uses", …]
    };

`tags` may instead be an ARRAY of {tag, name, category, blurb}. Or the whole
seed may be keyed BY CATEGORY, which is the shape the harvest agent emits:

    window.SKILLS_SEED = {
      math:    [{tag:"conditional-expectation", name:"…", blurb:"…"}, …],
      pricing: [ … ], …                       // one key per category id
    };

In that shape the key IS the category, so no `category` field is needed on
each tag, and a single `name` longer than ~48 characters is read as the blurb
(with a readable name derived from the tag) — the harvest seed writes one
descriptive sentence per tag rather than a short label.

`allow` may be omitted, in which case every tag NAMED IN THE SEED is allowed
to be a singleton — the seed is then simply the allow-list. A tag that is in
neither the seed nor two courses is a typo until someone says otherwise.

── skills.js (the output) ─────────────────────────────────────────────
    window.SKILLS = {
      generated: "2026-09-26",
      categories: [{id, name, color}, …],
      tags: [{tag, name, category, blurb, built_in:[CODE…], assumed_in:[CODE…]}, …],
      courses: [{code, slug, title, quarter, units, block, concentrations,
                 tier, weeks, concepts, mcqs, widgets, prerequisites,
                 skills_built, skills_assumed}, …]
    };
app.js treats every part of it as optional, so a half-built site still renders.
"""
import argparse
import datetime
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jsload import JsLoadError, load_assignments, load_global   # noqa: E402

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COURSES_DIR = os.path.join(HERE, "courses")
SEED_PATH = os.path.join(HERE, "data", "skills_seed.js")
OUT_PATH = os.path.join(HERE, "skills.js")

# SCHEMA.md's category list, used when the seed does not supply its own.
DEFAULT_CATEGORIES = [
    # UChicago identity palette (secondary colours; light variants where the
    # dark background needs them). Maroon is reserved for pricing.
    ("math", "Mathematics", "#155f83"),            # blue
    ("stats-ml", "Statistics & ML", "#642822"),    # dark violet-brown
    ("markets", "Markets & institutions", "#58593f"),  # dark green
    ("pricing", "Pricing & valuation", "#800000"),     # maroon
    ("programming", "Programming & systems", "#b45f20"),  # orange
    ("data", "Data & infrastructure", "#357d96"),  # light blue
    ("risk", "Risk", "#8f3931"),                   # red
    ("trading", "Trading & execution", "#91ab5a"), # light green
]
TAG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


# ── near-duplicate detection ──────────────────────────────────────────
def edit_distance(a, b, cap):
    """Levenshtein distance, short-circuited once it is known to exceed cap."""
    if abs(len(a) - len(b)) > cap:
        return cap + 1
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        best = i
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
            best = min(best, cur[j])
        if best > cap:
            return cap + 1
        prev = cur
    return prev[-1]


def near_duplicates(tags, cap):
    """Pairs within `cap` edits, plus pairs where one is a prefix of the other."""
    out = []
    ordered = sorted(tags)
    for i, a in enumerate(ordered):
        for b in ordered[i + 1:]:
            if abs(len(a) - len(b)) > max(cap, 12):
                continue
            d = edit_distance(a, b, cap)
            if d <= cap:
                out.append((a, b, "%d edit%s apart" % (d, "" if d == 1 else "s")))
            elif a.replace("-", "") == b.replace("-", ""):
                out.append((a, b, "same letters, different hyphenation"))
            elif b.startswith(a + "-") or a.startswith(b + "-"):
                out.append((a, b, "one extends the other"))
    return out


# ── the seed ──────────────────────────────────────────────────────────
def read_seed(path):
    """-> (categories[list of dict], tag_meta{tag: {...}}, allow set, note)."""
    if not os.path.exists(path):
        return ([{"id": i, "name": n, "color": c} for i, n, c in DEFAULT_CATEGORIES],
                {}, set(),
                "data/skills_seed.js is absent — using SCHEMA.md's default categories "
                "and allowing no singleton tags.")
    seed = load_global(path, "SKILLS_SEED", default={}) or {}
    defaults = {i: (n, c) for i, n, c in DEFAULT_CATEGORIES}
    cats = seed.get("categories")
    meta = {}

    def absorb(tag, info, category=None):
        """Normalise one seed entry into {name, category, blurb}."""
        if isinstance(info, str):
            info = {"name": info}
        elif not isinstance(info, dict):
            info = {}
        name = str(info.get("name") or "").strip()
        blurb = str(info.get("blurb") or "").strip()
        # the harvest seed writes one descriptive sentence as `name`; a long
        # one is a blurb, and the short human name is derived from the tag
        if name and not blurb and len(name) > 48:
            name, blurb = "", name
        meta[tag] = {
            "name": name or str(tag).replace("-", " ").capitalize(),
            "category": info.get("category") or category or "",
            "blurb": blurb,
        }

    raw = seed.get("tags")
    if isinstance(raw, dict):
        for tag, info in raw.items():
            absorb(tag, info)
    elif isinstance(raw, list):
        for info in raw:
            if isinstance(info, dict) and info.get("tag"):
                absorb(info["tag"], info, info.get("category"))
            elif isinstance(info, str):
                absorb(info, {})
    else:
        # category-keyed shape: every top-level key that maps to a list of
        # tag entries is a category id
        for key, val in seed.items():
            if key in ("categories", "allow", "tags", "stub", "generated", "fetched"):
                continue
            if not isinstance(val, list):
                continue
            for info in val:
                if isinstance(info, dict) and info.get("tag"):
                    absorb(info["tag"], info, key)
                elif isinstance(info, str):
                    absorb(info, {}, key)

    if not isinstance(cats, list) or not cats:
        used = []
        for info in meta.values():
            if info["category"] and info["category"] not in used:
                used.append(info["category"])
        for i, _n, _c in DEFAULT_CATEGORIES:
            if i not in used:
                used.append(i)
        cats = [{"id": i,
                 "name": defaults.get(i, (i.replace("-", " ").title(), "#9aa0a6"))[0],
                 "color": defaults.get(i, (i, "#767676"))[1]} for i in used]

    allow = seed.get("allow")
    if isinstance(allow, list):
        allow = set(str(a) for a in allow)
    else:
        allow = set(meta.keys())          # no explicit list: the seed IS the list
    return cats, meta, allow, ""


# ── the courses ───────────────────────────────────────────────────────
def read_courses(paths):
    """-> (list of (path, code, course_dict), list of error strings)."""
    out, errs = [], []
    for p in paths:
        try:
            found = load_assignments(p, "COURSES")
        except JsLoadError as exc:
            errs.append("%s: %s" % (os.path.relpath(p, HERE), exc))
            continue
        if not found:
            errs.append("%s: defines no window.COURSES[\"…\"] assignment" % os.path.relpath(p, HERE))
            continue
        for code, course in sorted(found.items()):
            if not isinstance(course, dict):
                errs.append("%s: window.COURSES[%r] is not an object" % (os.path.relpath(p, HERE), code))
                continue
            out.append((p, code, course))
    return out, errs


def course_files():
    if not os.path.isdir(COURSES_DIR):
        return []
    return sorted(os.path.join(COURSES_DIR, f) for f in os.listdir(COURSES_DIR)
                  if f.endswith(".js") and not f.startswith("."))


def week_counts(course):
    weeks = course.get("weeks") or []
    concepts = mcqs = widgets = 0
    for w in weeks:
        if not isinstance(w, dict):
            continue
        concepts += len(w.get("concepts") or [])
        mcqs += len(w.get("check") or [])
        wid = w.get("widget")
        widgets += len(wid) if isinstance(wid, list) else (1 if wid else 0)
    return len(weeks), concepts, mcqs, widgets


def build(courses, cats, meta, allow, cap):
    """-> (payload dict, errors[], warnings[], report lines[])."""
    errors, warnings, report = [], [], []
    built, assumed, seen_in = {}, {}, {}

    index = []
    for _path, code, c in courses:
        nw, nc, nq, nwid = week_counts(c)
        index.append({
            "code": code,
            "slug": c.get("slug") or code.lower().replace(" ", "-"),
            "title": c.get("title", ""),
            "instructor": c.get("instructor", ""),
            "quarter": c.get("quarter", ""),
            "units": c.get("units", 0),
            "block": c.get("block", ""),
            "tier": c.get("tier", ""),
            "concentrations": list(c.get("concentrations") or []),
            "weeks": nw, "concepts": nc, "mcqs": nq, "widgets": nwid,
            "prerequisites": list(c.get("prerequisites") or []),
            "skills_built": list(c.get("skills_built") or []),
            "skills_assumed": list(c.get("skills_assumed") or []),
        })
        for tag in c.get("skills_built") or []:
            built.setdefault(tag, []).append(code)
            seen_in.setdefault(tag, set()).add(code)
        for tag in c.get("skills_assumed") or []:
            assumed.setdefault(tag, []).append(code)
            seen_in.setdefault(tag, set()).add(code)

    all_tags = sorted(seen_in)

    # 1 · shape of the tag itself
    for tag in all_tags:
        if not TAG_RE.match(tag):
            errors.append("tag %r is not kebab-case (lowercase words joined by single hyphens)" % tag)

    # 2 · THE SCHEMA RULE: a tag used by exactly one course must be seeded
    singletons = [t for t in all_tags if len(seen_in[t]) == 1]
    unseeded = [t for t in singletons if t not in allow]
    for tag in unseeded:
        only = sorted(seen_in[tag])[0]
        errors.append(
            "tag %r is used by one course only (%s) and is not in data/skills_seed.js's "
            "allow-list — it is a typo, a near-duplicate of an existing tag, or it needs "
            "seeding on purpose" % (tag, only))

    # 3 · category resolution
    cat_ids = set(c.get("id") for c in cats)
    for tag in all_tags:
        cat = (meta.get(tag) or {}).get("category")
        if cat and cat not in cat_ids:
            errors.append("tag %r claims category %r, which data/skills_seed.js does not define" % (tag, cat))
        elif not cat:
            warnings.append("tag %r has no category in the seed — it will show as 'other'" % tag)

    # 4 · seeded tags nobody uses
    for tag in sorted(set(meta) - set(all_tags)):
        warnings.append("seed tag %r is used by no course" % tag)

    # 5 · near-duplicate suspects
    dupes = near_duplicates(all_tags, cap)
    for a, b, why in dupes:
        warnings.append("near-duplicate suspects: %r / %r (%s)" % (a, b, why))

    # 6 · the balance report
    gaps = [t for t in all_tags if not built.get(t)]
    for tag in gaps:
        warnings.append("tag %r is assumed by %s but built by no course" %
                        (tag, ", ".join(sorted(seen_in[tag]))))

    tags_out = []
    for tag in all_tags:
        info = meta.get(tag) or {}
        tags_out.append({
            "tag": tag,
            "name": info.get("name") or tag.replace("-", " "),
            "category": info.get("category") or "",
            "blurb": info.get("blurb") or "",
            "built_in": sorted(set(built.get(tag, []))),
            "assumed_in": sorted(set(assumed.get(tag, []))),
        })

    report.append("courses read      : %d" % len(courses))
    report.append("distinct tags     : %d" % len(all_tags))
    report.append("  built somewhere : %d" % len([t for t in all_tags if built.get(t)]))
    report.append("  assumed only    : %d" % len(gaps))
    report.append("  singletons      : %d (%d allowed by the seed)"
                  % (len(singletons), len(singletons) - len(unseeded)))
    report.append("near-dup suspects : %d" % len(dupes))

    payload = {
        "generated": datetime.date.today().isoformat(),
        "categories": cats,
        "tags": tags_out,
        "courses": sorted(index, key=lambda r: r["code"]),
    }
    return payload, errors, warnings, report


HEADER = """/* ════════════════════════════════════════════════════════════════════════
   skills.js — GENERATED. Do not edit by hand.

   Written by tools/build_skills.py from courses/*.js and data/skills_seed.js.
   Regenerate it after adding or editing any course:

       python3 tools/build_skills.py

   It carries two things:
     tags[]    the shared vocabulary — every skill tag, its category, and the
               courses that BUILD it and that ASSUME it. skills.html is this
               table; a chip on a course page links into it by #<tag>.
     courses[] a compact index — counts and tag lists only, no week content —
               so index.html can filter by skill and show progress without
               loading 29 deep course files.
   ════════════════════════════════════════════════════════════════════════ */
"use strict";
window.SKILLS = """


def render(payload):
    return HEADER + json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=False) + ";\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("paths", nargs="*", help="course files (default: courses/*.js)")
    ap.add_argument("--check", action="store_true",
                    help="do not write; exit 1 if skills.js is missing, stale or invalid")
    ap.add_argument("--dry-run", action="store_true", help="report only, write nothing")
    ap.add_argument("--distance", type=int, default=2,
                    help="edit distance for the near-duplicate search (default 2)")
    ap.add_argument("--allow-empty", action="store_true",
                    help="write a valid but empty skills.js when courses/ holds no course "
                         "(use after removing the demo fixture, so the index is not stale)")
    ap.add_argument("--out", default=OUT_PATH)
    args = ap.parse_args()

    paths = [os.path.abspath(p) for p in args.paths] or course_files()
    if not paths and not args.allow_empty:
        print("no course files found in courses/ — nothing to do")
        print("(expected before any course is written; skills.js is LEFT ALONE so a mistyped")
        print(" path cannot wipe a good index. Use --allow-empty to write an empty one.)")
        return 0

    cats, meta, allow, note = read_seed(SEED_PATH)
    if note:
        print("note: " + note)
    courses, read_errs = read_courses(paths)
    payload, errors, warnings, report = build(courses, cats, meta, allow, args.distance)
    errors = read_errs + errors

    for line in report:
        print("  " + line)
    for w in warnings:
        print("  warn  " + w)
    for e in errors:
        print("  ERROR " + e)

    if errors:
        print("build_skills: %d error%s — skills.js NOT written"
              % (len(errors), "" if len(errors) == 1 else "s"))
        return 1

    text = render(payload)
    if args.dry_run:
        print("build_skills: %d tags over %d courses (dry run, nothing written)"
              % (len(payload["tags"]), len(payload["courses"])))
        return 0
    if args.check:
        old = ""
        if os.path.exists(args.out):
            with open(args.out, "r", encoding="utf-8") as fh:
                old = fh.read()
        # the generated date always differs; compare everything else
        strip = lambda s: re.sub(r'"generated":\s*"[^"]*"', '"generated":""', s)
        if strip(old) != strip(text):
            print("build_skills: skills.js is STALE — run tools/build_skills.py")
            return 1
        print("build_skills: skills.js is up to date (%d tags, %d courses)"
              % (len(payload["tags"]), len(payload["courses"])))
        return 0

    with open(args.out, "w", encoding="utf-8") as fh:
        fh.write(text)
    print("build_skills: wrote %s — %d tags over %d courses, %d warning%s"
          % (os.path.relpath(args.out, HERE), len(payload["tags"]), len(payload["courses"]),
             len(warnings), "" if len(warnings) == 1 else "s"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
