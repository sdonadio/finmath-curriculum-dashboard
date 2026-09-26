#!/usr/bin/env python3
"""Schema-check every course file, and the site around them.

This is the gate a course file has to pass before it is allowed on the site.
It reads SCHEMA.md's frozen contract and enforces it mechanically, so a
content agent gets told exactly what is wrong instead of discovering it as a
blank section on a page.

    python3 tools/validate.py                    # every courses/*.js + the demo fixture
    python3 tools/validate.py courses/finm-33000.js
    python3 tools/validate.py --strict           # promote every warning to an error
    python3 tools/validate.py --no-site          # course files only, skip the site checks
    python3 tools/validate.py --quiet            # only the failures and the summary

WHAT IT CHECKS
  Per course file
   C1  the file defines exactly one window.COURSES["CODE"] = {...}
   C2  required fields present and of the right type: code slug title quarter
       units block concentrations source tier description prerequisites
       textbooks skills_built skills_assumed brushup weeks interview
       reappears_in glossary
   C3  the file name, the `slug` and the `code` all agree
   C4  source.page_url / source.syllabus_url are http(s); source.fetched is
       an ISO date; tier is a single letter
   C5  block and quarter resolve against program.js; every concentration id
       resolves against program.js
   C6  week count is 5, or 9–10; week numbers are 1..n with no gaps or repeats
   C7  >= 3 concepts per week (SCHEMA's depth target is 3–5; >5 warns)
   C8  every concept has name, explain, and code{lang,src,output}; lang is
       python/cpp/r; `output` key present (run_snippets.py fills it); explain
       word count 150–300 warns outside the band
   C9  a widget on >= 60% of weeks; every widget type is one widgets.js knows;
       every widget has a title and a params object
   C10 3–4 MCQs per week; exactly 4 options; answer is an int index in range;
       `why` present and non-trivial; no two options identical
   C11 8–12 interview items; level in screen/onsite/senior; answer 60–150
       words (warns outside)
   C12 glossary 10–20 items with term+def; brushup 4–8 with topic/why/resource
   C13 every skill tag is kebab-case and resolves (skills.js if built, else
       data/skills_seed.js, else "any tag the corpus uses twice")
   C14 reappears_in codes resolve to a course in program.js
   C15 no `Math.random`, no `eval(`, no `new Function` anywhere in the file
   C16 the institution string appears in NO file except site_params.js
   C17 every internal href/src in the file resolves to a file on disk

  Site-wide (skip with --no-site)
   S1  the five page templates exist and carry a body[data-page]
   S2  every href/src in every .html resolves (query and hash stripped)
   S3  app.js / widgets.js / styles.css exist; app.js and widgets.js parse
       under `node --check` when node is available
   S4  no Math.random / eval( / new Function in any .js the site ships
   S5  the institution string appears only in site_params.js
   S6  every course listed in program.js either has a courses/<slug>.js or is
       reported as unwritten (a warning, not an error)
   S7  every courses/<slug>.js is listed in program.js (an error: an orphan
       page is unreachable from the map)

Exit code 0 when there are no errors, 1 otherwise. Warnings never fail the
run unless --strict is given.
"""
import argparse
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jsload import JsLoadError, load_assignments, load_global   # noqa: E402

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COURSES_DIR = os.path.join(HERE, "courses")
DEMO = os.path.join(HERE, "tools", "demo_course.js")
# the fixture may be copied into courses/ for a sweep; that is not an orphan page
DEMO_SLUG = "finm-00000"

REQUIRED = [
    ("code", str), ("slug", str), ("title", str), ("quarter", str), ("units", (int, float)),
    ("block", str), ("concentrations", list), ("source", dict), ("tier", str),
    ("description", str), ("prerequisites", list), ("textbooks", list),
    ("skills_built", list), ("skills_assumed", list), ("brushup", list),
    ("weeks", list), ("interview", list), ("reappears_in", list), ("glossary", list),
]
LANGS = ("python", "cpp", "c++", "r")
LEVELS = ("screen", "onsite", "senior")
TAG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ISO_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
BANNED = [("Math.random", "Math.random"), ("eval(", "eval("), ("new Function", "new Function")]
# institution names that must never leak outside site_params.js, even before
# site_params.js exists (the harvest agent writes the real list into it)
KNOWN_INSTITUTIONS = ["University of Chicago", "UChicago", "Columbia University",
                      "Chicago Booth", "the University of Chicago"]
# an href we can ignore: external, in-page, a protocol, or a query-only jump
SKIP_HREF = re.compile(r"^(https?:|mailto:|tel:|data:|javascript:|//|#|\?)")
HREF_RE = re.compile(r"""\b(?:href|src)\s*=\s*["']([^"']+)["']""")
JSPATH_RE = re.compile(r"""["'](?!//)((?:\./)?[A-Za-z0-9_./-]+\.(?:html|js|css|png|svg|pdf))["']""")
WORD_RE = re.compile(r"[A-Za-z0-9'’-]+")
URL_RE = re.compile(r"""https?://[^\s"'<>)\]]+""")


class Report(object):
    def __init__(self, quiet=False):
        self.errors = []
        self.warnings = []
        self.quiet = quiet
        self.where = ""

    def err(self, msg):
        self.errors.append("%s%s" % (self.where, msg))

    def warn(self, msg):
        self.warnings.append("%s%s" % (self.where, msg))


def words(text):
    return len(WORD_RE.findall(re.sub(r"<[^>]+>", " ", str(text or ""))))


def strip_html(text):
    return re.sub(r"<[^>]+>", "", str(text or ""))


# ── reference data the checks resolve against ─────────────────────────
def load_reference():
    ref = {"program": None, "skills": None, "seed": None, "widget_types": None,
           "institutions": list(KNOWN_INSTITUTIONS)}
    for name, glob, key in (("program.js", "PROGRAM", "program"),
                            ("skills.js", "SKILLS", "skills"),
                            (os.path.join("data", "skills_seed.js"), "SKILLS_SEED", "seed")):
        path = os.path.join(HERE, name)
        if os.path.exists(path):
            try:
                ref[key] = load_global(path, glob)
            except JsLoadError as exc:
                ref.setdefault("load_errors", []).append("%s: %s" % (name, exc))
    sp_path = os.path.join(HERE, "site_params.js")
    if os.path.exists(sp_path):
        try:
            sp = load_global(sp_path, "SITE_PARAMS") or {}
            for k in ("institution", "institution_short"):
                v = str(sp.get(k) or "").strip()
                if len(v) > 3 and v not in ref["institutions"]:
                    ref["institutions"].append(v)
        except JsLoadError:
            pass
    # the widget menu, read from widgets.js so the two can never drift
    wpath = os.path.join(HERE, "widgets.js")
    if os.path.exists(wpath):
        with open(wpath, "r", encoding="utf-8") as fh:
            src = fh.read()
        m = re.search(r"types\s*:\s*\[(.*?)\]", src, re.S)
        if m:
            ids = re.findall(r"""["']([a-z][a-z0-9-]*)["']""", m.group(1))
            if ids:
                ref["widget_types"] = set(ids)
    if not ref["widget_types"]:
        ref["widget_types"] = set("""payoff binomial-tree curve simulate-paths histogram
            slider-formula orderbook heatmap regression efficient-frontier tree-diagram
            timeline code-trace""".split())
    return ref


def known_tags(ref, corpus_counts):
    """A tag resolves if skills.js knows it, or the seed knows it, or the
    corpus uses it in two or more courses (build_skills.py's own rule).

    The seed is read through build_skills.read_seed rather than re-parsed
    here, so the two tools can never disagree about which tags are allowed —
    the seed has three accepted shapes and only one implementation of them.
    """
    ok = set()
    if isinstance(ref.get("skills"), dict):
        for t in ref["skills"].get("tags") or []:
            if isinstance(t, dict) and t.get("tag"):
                ok.add(t["tag"])
    try:
        from build_skills import read_seed
        _cats, meta, allow, _note = read_seed(os.path.join(HERE, "data", "skills_seed.js"))
        ok |= set(meta) | set(allow)
    except Exception:                                  # noqa: BLE001
        if isinstance(ref.get("seed"), dict):
            raw = ref["seed"].get("tags")
            if isinstance(raw, dict):
                ok |= set(raw)
            elif isinstance(raw, list):
                for t in raw:
                    ok.add(t.get("tag") if isinstance(t, dict) else t)
            ok |= set(ref["seed"].get("allow") or [])
    ok |= set(t for t, n in corpus_counts.items() if n >= 2)
    return ok


# ── per-course checks ─────────────────────────────────────────────────
def check_course(path, rep, ref, tag_ok):
    rel = os.path.relpath(path, HERE)
    with open(path, "r", encoding="utf-8") as fh:
        raw = fh.read()

    # C15 · banned constructs, checked on the raw text
    for needle, label in BANNED:
        if needle in raw:
            rep.where = "%s: " % rel
            rep.err("contains %s — widgets are seeded, and a data file must be literal" % label)

    # C16 · institution leakage. URLs are exempt — a source link necessarily
    # contains the school's domain — so they are blanked before the search.
    deurl = URL_RE.sub(" ", raw)
    for inst in ref["institutions"]:
        if inst and inst in deurl:
            rep.where = "%s: " % rel
            rep.err("names the institution (%r). Only site_params.js may; pages use data-sp nodes" % inst)

    # C17 · internal paths mentioned in the file
    for target in set(JSPATH_RE.findall(raw)):
        if SKIP_HREF.match(target):
            continue
        if not os.path.exists(os.path.join(HERE, target.lstrip("./"))):
            rep.where = "%s: " % rel
            rep.warn("mentions %r, which does not exist on disk" % target)

    try:
        found = load_assignments(path, "COURSES")
    except JsLoadError as exc:
        rep.where = ""
        rep.err("%s: cannot be read — %s" % (rel, exc))
        return None, None

    if len(found) != 1:                                                        # C1
        rep.where = "%s: " % rel
        rep.err("defines %d window.COURSES[...] assignments; a course file must define exactly one"
                % len(found))
        if not found:
            return None, None
    code, C = sorted(found.items())[0]
    rep.where = "%s [%s]: " % (rel, code)

    # C2 · required fields
    for field, typ in REQUIRED:
        if field not in C:
            rep.err("missing required field %r" % field)
        elif not isinstance(C[field], typ):
            rep.err("field %r should be %s, found %s"
                    % (field, getattr(typ, "__name__", typ), type(C[field]).__name__))
    if not str(C.get("description", "")).strip():
        rep.err("description is empty")
    elif words(C.get("description")) < 25:
        rep.warn("description is only %d words — a card and a meta tag both use it"
                 % words(C.get("description")))

    # C3 · file name / slug / code agree
    slug = str(C.get("slug", ""))
    fname = os.path.splitext(os.path.basename(path))[0]
    if slug and not SLUG_RE.match(slug):
        rep.err("slug %r is not kebab-case" % slug)
    derived = re.sub(r"[^a-z0-9]+", "-", str(C.get("code", code)).lower()).strip("-")
    if slug and derived and slug != derived:
        rep.err("slug %r does not match code %r (expected %r)" % (slug, C.get("code"), derived))
    if str(C.get("code", "")) != code:
        rep.err("the window.COURSES key %r and the object's own code %r differ" % (code, C.get("code")))
    if fname != slug and rel.startswith("courses" + os.sep):
        rep.err("file is named %s.js but the slug is %r" % (fname, slug))

    # C4 · provenance
    src = C.get("source") or {}
    for k in ("page_url", "syllabus_url"):
        v = str(src.get(k, "") or "")
        if not v:
            rep.warn("source.%s is empty — the provenance banner will have no link" % k)
        elif not v.startswith("http"):
            rep.err("source.%s is not an http(s) URL: %r" % (k, v))
    if not ISO_RE.match(str(src.get("fetched", "") or "")):
        rep.err("source.fetched should be an ISO date (YYYY-MM-DD), found %r" % src.get("fetched"))
    if not re.match(r"^[A-Z]$", str(C.get("tier", ""))):
        rep.err("tier should be a single capital letter, found %r" % C.get("tier"))

    # C5 · block / quarter / concentrations resolve
    P = ref.get("program")
    if isinstance(P, dict):
        blocks = set(b.get("id") for b in (P.get("blocks") or []) if isinstance(b, dict))
        concs = set(c.get("id") for c in (P.get("concentrations") or []) if isinstance(c, dict))
        quarters = set(P.get("quarters") or [])
        if blocks and C.get("block") not in blocks:
            rep.err("block %r is not one of program.js's blocks (%s)"
                    % (C.get("block"), ", ".join(sorted(blocks))))
        if quarters and C.get("quarter") not in quarters:
            # program.js's own index carries values like "September Launch",
            # so an unlisted quarter is a scheduling quirk, not a schema break.
            # quarter.html files it under "Quarter not recorded".
            rep.warn("quarter %r is not one of program.js's quarters (%s) — quarter.html "
                     "will file it under 'Quarter not recorded'"
                     % (C.get("quarter"), ", ".join(sorted(quarters))))
        for cid in C.get("concentrations") or []:
            if concs and cid not in concs:
                rep.err("concentration id %r is not in program.js" % cid)
        if C.get("block") in ("core", "computing") and (C.get("concentrations") or []):
            rep.warn("SCHEMA.md says concentrations is [] for core/computing courses")

    # C6 · weeks
    weeks = [w for w in (C.get("weeks") or []) if isinstance(w, dict)]
    nw = len(weeks)
    if nw not in (5,) and not (9 <= nw <= 10):
        rep.err("%d weeks — SCHEMA.md allows 9–10 for a quarter course, or 5 for a half-quarter one" % nw)
    ns = [w.get("n") for w in weeks]
    if ns != list(range(1, nw + 1)):
        rep.err("week numbers should be 1..%d in order, found %r" % (nw, ns))

    # C7–C10 · inside each week
    weeks_with_widget = 0
    for w in weeks:
        n = w.get("n")
        rep.where = "%s [%s] week %s: " % (rel, code, n)
        if not str(w.get("title", "")).strip():
            rep.err("has no title")
        if not (w.get("topics") or []):
            rep.warn("lists no topics")

        concepts = [c for c in (w.get("concepts") or []) if isinstance(c, dict)]
        if len(concepts) < 3:
            rep.err("has %d concepts — SCHEMA.md requires 3–5" % len(concepts))
        elif len(concepts) > 5:
            rep.warn("has %d concepts — SCHEMA.md's band is 3–5" % len(concepts))
        for ci, c in enumerate(concepts, 1):                                    # C8
            tag = "concept %d (%s)" % (ci, str(c.get("name", "unnamed"))[:40])
            if not str(c.get("name", "")).strip():
                rep.err("%s has no name" % tag)
            ex = c.get("explain")
            if not str(ex or "").strip():
                rep.err("%s has no explain text" % tag)
            else:
                wc = words(ex)
                if wc < 150 or wc > 300:
                    rep.warn("%s explain is %d words — SCHEMA.md's band is 150–300" % (tag, wc))
            code_obj = c.get("code")
            if not isinstance(code_obj, dict):
                rep.err("%s has no code object" % tag)
                continue
            lang = str(code_obj.get("lang", "")).lower()
            if lang not in LANGS:
                rep.err("%s code.lang is %r — expected one of %s" % (tag, lang, ", ".join(LANGS)))
            if not str(code_obj.get("src", "")).strip():
                rep.err("%s code.src is empty" % tag)
            if "output" not in code_obj:
                rep.err("%s code has no `output` key — add output:\"\" and run tools/run_snippets.py" % tag)
            elif not str(code_obj.get("output", "")).strip():
                rep.warn("%s code.output is empty — run tools/run_snippets.py to capture it" % tag)
            if c.get("formula") is not None and not str(c.get("formula", "")).strip():
                rep.warn("%s has an empty formula string; omit the key instead" % tag)

        widgets = w.get("widget")                                               # C9
        wlist = widgets if isinstance(widgets, list) else ([widgets] if widgets else [])
        if wlist:
            weeks_with_widget += 1
        for wd in wlist:
            if not isinstance(wd, dict):
                rep.err("widget entry is not an object")
                continue
            t = str(wd.get("type", ""))
            if t not in ref["widget_types"]:
                rep.err("widget type %r is not in the widget menu (%s)"
                        % (t, ", ".join(sorted(ref["widget_types"]))))
            if not str(wd.get("title", "")).strip():
                rep.err("widget %r has no title" % t)
            if not isinstance(wd.get("params"), dict):
                rep.err("widget %r has no params object" % t)

        checks = [q for q in (w.get("check") or []) if isinstance(q, dict)]      # C10
        if not 3 <= len(checks) <= 4:
            rep.err("has %d check questions — SCHEMA.md requires 3–4" % len(checks))
        for qi, q in enumerate(checks, 1):
            qt = "check %d" % qi
            if not str(q.get("q", "")).strip():
                rep.err("%s has no question text" % qt)
            opts = q.get("options")
            if not isinstance(opts, list) or len(opts) != 4:
                rep.err("%s must have exactly 4 options, found %s"
                        % (qt, len(opts) if isinstance(opts, list) else type(opts).__name__))
                opts = opts if isinstance(opts, list) else []
            if len(set(str(o).strip().lower() for o in opts)) != len(opts):
                rep.err("%s has duplicate options" % qt)
            for o in opts:
                if not str(o).strip():
                    rep.err("%s has an empty option" % qt)
            a = q.get("answer")
            if not isinstance(a, int) or isinstance(a, bool):
                rep.err("%s answer must be an integer index, found %r" % (qt, a))
            elif not 0 <= a < len(opts):
                rep.err("%s answer index %d is out of range for %d options" % (qt, a, len(opts)))
            why = str(q.get("why", "") or "")
            if not why.strip():
                rep.err("%s has no `why` feedback" % qt)
            elif words(why) < 20:
                rep.warn("%s feedback is only %d words — say why the distractors are wrong too" % (qt, words(why)))

        pit = w.get("pitfalls") or []
        if not 2 <= len(pit) <= 4:
            rep.err("has %d pitfalls — SCHEMA.md requires 2–4" % len(pit))

    rep.where = "%s [%s]: " % (rel, code)
    if nw:
        frac = weeks_with_widget / float(nw)
        if frac < 0.6:
            rep.err("only %d of %d weeks carry a widget (%.0f%%) — SCHEMA.md requires at least 60%%"
                    % (weeks_with_widget, nw, frac * 100))

    # C11 · interview
    iv = [q for q in (C.get("interview") or []) if isinstance(q, dict)]
    if not 8 <= len(iv) <= 12:
        rep.err("%d interview items — SCHEMA.md requires 8–12" % len(iv))
    for qi, q in enumerate(iv, 1):
        if not str(q.get("q", "")).strip():
            rep.err("interview %d has no question" % qi)
        lv = str(q.get("level", "")).lower()
        if lv not in LEVELS:
            rep.err("interview %d level is %r — expected screen, onsite or senior" % (qi, lv))
        wc = words(q.get("answer"))
        if wc == 0:
            rep.err("interview %d has no answer" % qi)
        elif wc < 60 or wc > 150:
            rep.warn("interview %d answer is %d words — SCHEMA.md's band is 60–150" % (qi, wc))

    # C12 · glossary and brush-up
    gl = [g for g in (C.get("glossary") or []) if isinstance(g, dict)]
    if not 10 <= len(gl) <= 20:
        rep.err("%d glossary entries — SCHEMA.md requires 10–20" % len(gl))
    for g in gl:
        if not str(g.get("term", "")).strip() or not str(g.get("def", "")).strip():
            rep.err("glossary entry %r is missing a term or a definition" % (g.get("term") or g))
    bu = [b for b in (C.get("brushup") or []) if isinstance(b, dict)]
    if not 4 <= len(bu) <= 8:
        rep.err("%d brush-up items — SCHEMA.md requires 4–8" % len(bu))
    for b in bu:
        for k in ("topic", "why", "resource"):
            if not str(b.get(k, "")).strip():
                rep.warn("brush-up %r has no %s" % (str(b.get("topic"))[:30], k))

    # textbooks
    for t in C.get("textbooks") or []:
        if not isinstance(t, dict) or not str(t.get("title", "")).strip():
            rep.err("a textbook entry has no title")

    # C13 · skill tags
    for field in ("skills_built", "skills_assumed"):
        tags = C.get(field) or []
        if not tags and field == "skills_built":
            rep.err("skills_built is empty — every course builds something")
        for t in tags:
            if not TAG_RE.match(str(t)):
                rep.err("%s tag %r is not kebab-case" % (field, t))
            elif tag_ok is not None and t not in tag_ok:
                rep.err("%s tag %r resolves nowhere: it is in no other course, not in "
                        "data/skills_seed.js, and not in skills.js" % (field, t))
        if len(set(tags)) != len(tags):
            rep.err("%s has duplicate tags" % field)
    overlap = set(C.get("skills_built") or []) & set(C.get("skills_assumed") or [])
    if overlap:
        rep.warn("these tags are both built and assumed: %s" % ", ".join(sorted(overlap)))

    # C14 · reappears_in
    known_codes = set()
    if isinstance(P, dict):
        for b in P.get("blocks") or []:
            known_codes |= set(b.get("courses") or [])
        for c2 in P.get("concentrations") or []:
            known_codes |= set(c2.get("courses") or [])
        for c2 in P.get("courses") or []:
            if isinstance(c2, dict) and c2.get("code"):
                known_codes.add(c2["code"])
    norm = lambda s: re.sub(r"[^A-Z0-9]", "", str(s).upper())
    known_norm = set(norm(k) for k in known_codes)
    for r in C.get("reappears_in") or []:
        if not isinstance(r, dict):
            rep.err("a reappears_in entry is not an object")
            continue
        if known_norm and norm(r.get("code")) not in known_norm:
            rep.err("reappears_in names %r, which program.js does not list" % r.get("code"))
        if not str(r.get("how", "")).strip():
            rep.err("reappears_in %r does not say how" % r.get("code"))

    rep.where = ""
    return code, C


# ── site-wide checks ──────────────────────────────────────────────────
def check_site(rep, ref, course_codes):
    PAGES = ["index.html", "course.html", "concentration.html", "quarter.html", "skills.html"]
    for page in PAGES:                                                          # S1
        path = os.path.join(HERE, page)
        rep.where = "%s: " % page
        if not os.path.exists(path):
            rep.err("template is missing")
            continue
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()
        if not re.search(r"""<body[^>]*\bdata-page\s*=\s*["'][a-z]+["']""", html):
            rep.err("<body> has no data-page attribute, so app.js cannot dispatch")

    for name in sorted(os.listdir(HERE)):                                       # S2
        if not name.endswith(".html"):
            continue
        rep.where = "%s: " % name
        with open(os.path.join(HERE, name), "r", encoding="utf-8") as fh:
            html = fh.read()
        for target in sorted(set(HREF_RE.findall(html))):
            if SKIP_HREF.match(target):
                continue
            clean = target.split("#")[0].split("?")[0].lstrip("./")
            if clean and not os.path.exists(os.path.join(HERE, clean)):
                # program.js / skills.js / site_params.js are generated or harvested
                if clean in ("program.js", "skills.js", "site_params.js"):
                    rep.warn("links to %s, which has not been generated yet" % clean)
                else:
                    rep.err("links to %r, which does not exist" % target)

    for name in ("app.js", "widgets.js", "styles.css"):                         # S3
        rep.where = "%s: " % name
        if not os.path.exists(os.path.join(HERE, name)):
            rep.err("is missing")
    node = _which("node")
    if node:
        for name in ("app.js", "widgets.js"):
            p = os.path.join(HERE, name)
            if not os.path.exists(p):
                continue
            rep.where = "%s: " % name
            proc = subprocess.run([node, "--check", p], capture_output=True, text=True)
            if proc.returncode != 0:
                rep.err("does not parse: %s" % (proc.stderr.strip().splitlines() or [""])[0])
    else:
        rep.where = ""
        rep.warn("node is not installed, so app.js / widgets.js were not syntax-checked")

    ship = [f for f in sorted(os.listdir(HERE)) if f.endswith(".js") and not f.endswith(".stub.js")]
    for name in ship:                                                           # S4
        rep.where = "%s: " % name
        with open(os.path.join(HERE, name), "r", encoding="utf-8") as fh:
            body = fh.read()
        for needle, label in BANNED:
            if needle in body:
                rep.err("contains %s" % label)
        if name != "site_params.js":                                            # S5
            debody = URL_RE.sub(" ", body)
            for inst in ref["institutions"]:
                if inst and inst in debody:
                    rep.err("names the institution (%r); only site_params.js may" % inst)

    P = ref.get("program")                                                      # S6 / S7
    rep.where = ""
    if isinstance(P, dict):
        listed = {}
        for b in P.get("blocks") or []:
            for c in b.get("courses") or []:
                listed[re.sub(r"[^a-z0-9]+", "-", str(c).lower()).strip("-")] = c
        for c in P.get("courses") or []:
            if isinstance(c, dict) and c.get("code"):
                listed[c.get("slug") or re.sub(r"[^a-z0-9]+", "-", c["code"].lower()).strip("-")] = c["code"]
        on_disk = set()
        if os.path.isdir(COURSES_DIR):
            on_disk = set(os.path.splitext(f)[0] for f in os.listdir(COURSES_DIR) if f.endswith(".js"))
        for slug, code in sorted(listed.items()):
            if slug not in on_disk:
                rep.warn("program.js lists %s but courses/%s.js does not exist yet" % (code, slug))
        for slug in sorted(on_disk - set(listed)):
            if slug == DEMO_SLUG:
                rep.warn("courses/%s.js is the demo fixture (tools/stubs.py --install put it there). "
                         "Run tools/stubs.py --remove before publishing" % slug)
                continue
            rep.err("courses/%s.js exists but program.js does not list it — the page is unreachable "
                    "from the map and make_course_pages.py will not build a wrapper for it" % slug)
    else:
        rep.warn("program.js is absent, so block/quarter/concentration ids were not checked")


def _which(prog):
    for d in os.environ.get("PATH", "").split(os.pathsep):
        p = os.path.join(d, prog)
        if os.path.isfile(p) and os.access(p, os.X_OK):
            return p
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("paths", nargs="*", help="course files (default: courses/*.js and the demo fixture)")
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors")
    ap.add_argument("--no-site", action="store_true", help="skip the site-wide checks")
    ap.add_argument("--quiet", action="store_true", help="print failures and the summary only")
    args = ap.parse_args()

    paths = [os.path.abspath(p) for p in args.paths]
    if not paths:
        if os.path.isdir(COURSES_DIR):
            paths = sorted(os.path.join(COURSES_DIR, f) for f in os.listdir(COURSES_DIR)
                           if f.endswith(".js") and not f.startswith("."))
        if os.path.exists(DEMO):
            paths.append(DEMO)
    missing = [p for p in paths if not os.path.exists(p)]
    if missing:
        print("no such file: " + ", ".join(missing))
        return 1

    ref = load_reference()
    rep = Report(args.quiet)
    for e in ref.get("load_errors") or []:
        rep.err(e)

    # first pass: how many courses use each tag (build_skills.py's rule needs it)
    counts = {}
    parsed = []
    for p in paths:
        try:
            found = load_assignments(p, "COURSES")
        except JsLoadError:
            found = {}
        parsed.append((p, found))
        for _code, c in found.items():
            if not isinstance(c, dict):
                continue
            for t in set((c.get("skills_built") or []) + (c.get("skills_assumed") or [])):
                counts[t] = counts.get(t, 0) + 1
    tag_ok = known_tags(ref, counts)

    codes = []
    for p in paths:
        code, _ = check_course(p, rep, ref, tag_ok)
        if code:
            codes.append(code)
        if not args.quiet:
            print("  checked %s" % os.path.relpath(p, HERE))

    if not args.no_site:
        check_site(rep, ref, codes)

    if args.strict:
        rep.errors.extend(rep.warnings)
        rep.warnings = []

    if rep.warnings and not args.quiet:
        print("")
        for w in rep.warnings:
            print("  warn   " + w)
    if rep.errors:
        print("")
        for e in rep.errors:
            print("  ERROR  " + e)

    print("")
    print("validate: %d file%s · %d error%s · %d warning%s%s"
          % (len(paths), "" if len(paths) == 1 else "s",
             len(rep.errors), "" if len(rep.errors) == 1 else "s",
             len(rep.warnings), "" if len(rep.warnings) == 1 else "s",
             "  (--strict)" if args.strict else ""))
    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())
