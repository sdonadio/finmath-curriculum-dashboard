#!/usr/bin/env python3
"""
make_course_pages.py -- emit a static HTML wrapper per course and per
concentration, so deep links are real URLs.

Why this exists
  The site is two query-string templates: course.html?c=FINM+33000 and
  concentration.html?c=financial-computing. That is fine in a browser and
  useless everywhere else. GitHub Pages serves no SPA fallback, a query
  string is not a page, and the links we hand out (LMS, syllabus PDFs,
  emails, search engines) want a plain path. So for every course and every
  concentration this tool writes a wrapper file:

      course-finm-33000.html
      concentration-financial-computing.html

  Each wrapper is the template byte-for-byte with two extra lines injected
  immediately before <script src="app.js"></script>:

      <!-- Static wrapper for FINM 33000. Regenerate with ... -->
      <script>window.COURSE_CODE = "FINM 33000"; window.COURSE_SLUG = "finm-33000";</script>

  app.js reads those globals in preference to the query string, so the
  wrapper and the template render the identical page. The <title> is also
  rewritten so a browser tab, a bookmark and a search result all say which
  course this is.

When to run it
  After editing course.html or concentration.html, and after adding,
  removing or renaming a course or concentration in program.js. Wrappers for
  things that no longer exist are deleted, so the published site never keeps
  a stale page alive.

Where the inventory comes from
  program.js at the repo root. Its object literal is extracted by brace
  matching (strings and comments skipped), run through a tolerant JS-to-JSON
  pass (comments stripped, bare keys quoted, trailing commas dropped, single
  quotes converted) and parsed. If that fails the tool falls back to
  regex-harvesting course codes and concentration ids and says so on stdout
  rather than producing nothing. Any courses/finm-XXXXX.js on disk that
  program.js does not mention still gets a wrapper, with a warning: the two
  ought to agree, but the page must exist either way.

What it prints
  "wrote N course wrappers, M concentration wrappers", plus every removal and
  every warning. Exit 0 = clean, 1 = something was missing or inconsistent.

Usage
  python3 tools/make_course_pages.py
  python3 tools/make_course_pages.py --dry-run

Standard library only.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROGRAM_JS = os.path.join(HERE, "program.js")
COURSES_DIR = os.path.join(HERE, "courses")
COURSE_TPL = os.path.join(HERE, "course.html")
CONC_TPL = os.path.join(HERE, "concentration.html")

ANCHOR = '<script src="app.js"></script>'
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)
COURSE_WRAPPER_RE = re.compile(r"^course-finm-\d+\.html$")
CONC_WRAPPER_RE = re.compile(r"^concentration-[a-z0-9-]+\.html$")
COURSE_FILE_RE = re.compile(r"^(finm-\d+)\.js$")
CODE_RE = re.compile(r"\bFINM[\s\-]?(\d{4,5})\b", re.I)

QUOTES = "\"'`"
IDENT = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$")
SIMPLE_ESCAPES = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f",
                  "v": "\v", "0": "\0", "\\": "\\", '"': '"', "'": "'",
                  "`": "`", "/": "/"}


class ScanError(Exception):
    pass


# --------------------------------------------------------------------------
# the same character scanner run_snippets.py uses, kept local so each tool
# stands alone (they are copied into content-agent sandboxes independently)
# --------------------------------------------------------------------------

def scan_string(text, i):
    """Scan a JS string literal at index i; return (value, index_past_close)."""
    quote = text[i]
    n = len(text)
    out = []
    i += 1
    while i < n:
        c = text[i]
        if c == "\\":
            if i + 1 >= n:
                raise ScanError("file ends inside a string escape")
            e = text[i + 1]
            if e == "u":
                if i + 2 < n and text[i + 2] == "{":
                    j = text.find("}", i + 3)
                    if j < 0:
                        raise ScanError("unterminated \\u{...}")
                    out.append(chr(int(text[i + 3:j], 16)))
                    i = j + 1
                    continue
                out.append(chr(int(text[i + 2:i + 6], 16)))
                i += 6
                continue
            if e == "x":
                out.append(chr(int(text[i + 2:i + 4], 16)))
                i += 4
                continue
            if e == "\n":
                i += 2
                continue
            if e == "\r":
                i += 2
                if i < n and text[i] == "\n":
                    i += 1
                continue
            out.append(SIMPLE_ESCAPES.get(e, e))
            i += 2
            continue
        if c == quote:
            return "".join(out), i + 1
        if c == "\n" and quote != "`":
            raise ScanError("newline inside a %s-quoted string" % quote)
        out.append(c)
        i += 1
    raise ScanError("unterminated string literal")


def skip_comment(text, i):
    if text[i + 1] == "/":
        j = text.find("\n", i)
        return len(text) if j < 0 else j + 1
    j = text.find("*/", i + 2)
    if j < 0:
        raise ScanError("unterminated /* comment")
    return j + 2


def skip_ws(text, i):
    n = len(text)
    while i < n:
        c = text[i]
        if c.isspace():
            i += 1
            continue
        if c == "/" and i + 1 < n and text[i + 1] in "/*":
            i = skip_comment(text, i)
            continue
        return i
    return n


def match_brace(text, start):
    """start is at '{'. Return the index just past the matching '}'."""
    n = len(text)
    i = start
    depth = 0
    while i < n:
        c = text[i]
        if c in QUOTES:
            _v, i = scan_string(text, i)
            continue
        if c == "/" and i + 1 < n and text[i + 1] in "/*":
            i = skip_comment(text, i)
            continue
        if c in "{[":
            depth += 1
        elif c in "}]":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise ScanError("unbalanced braces")


def js_to_json(src):
    """Tolerant JS object literal -> JSON text.

    Strings are re-emitted with json.dumps, bare identifier keys get quoted,
    true/false/null pass through, trailing commas are dropped. Done as one
    token pass rather than a pile of regexes so that a comma, a comment
    marker or a brace inside a blurb string cannot be mangled.
    """
    out = []
    i = 0
    n = len(src)
    while i < n:
        c = src[i]
        if c in QUOTES:
            val, j = scan_string(src, i)
            out.append(json.dumps(val))
            i = j
            continue
        if c == "/" and i + 1 < n and src[i + 1] in "/*":
            i = skip_comment(src, i)
            continue
        if c == ",":
            k = skip_ws(src, i + 1)
            if k < n and src[k] in "}]":
                i += 1                       # trailing comma: drop it
                continue
            out.append(",")
            i += 1
            continue
        if c in IDENT and not c.isdigit():
            j = i
            while j < n and src[j] in IDENT:
                j += 1
            word = src[i:j]
            k = skip_ws(src, j)
            if k < n and src[k] == ":":
                out.append(json.dumps(word))      # bare key
            elif word in ("true", "false", "null"):
                out.append(word)
            elif word == "undefined":
                out.append("null")
            else:
                out.append(json.dumps(word))      # bare word value
            i = j
            continue
        out.append(c)
        i += 1
    return "".join(out)


def find_program_brace(text):
    """Index of the '{' that opens the real window.PROGRAM object.

    Scanned rather than str.find()ed on purpose: program.js opens with a
    banner comment that documents the schema and therefore contains the
    words "window.PROGRAM = {" itself. A naive find lands in the prose and
    parses the documentation. Strings and comments are skipped here, so only
    a genuine `window.PROGRAM = {` assignment matches.
    """
    n = len(text)
    i = 0
    while i < n:
        c = text[i]
        if c in QUOTES:
            _v, i = scan_string(text, i)
            continue
        if c == "/" and i + 1 < n and text[i + 1] in "/*":
            i = skip_comment(text, i)
            continue
        if c == "w" and text.startswith("window", i) and \
                (i == 0 or text[i - 1] not in IDENT):
            j = skip_ws(text, i + 6)
            if j < n and text[j] == ".":
                j = skip_ws(text, j + 1)
                if text.startswith("PROGRAM", j) and \
                        (j + 7 >= n or text[j + 7] not in IDENT):
                    k = skip_ws(text, j + 7)
                    if k < n and text[k] == "=" and \
                            (k + 1 >= n or text[k + 1] != "="):
                        b = skip_ws(text, k + 1)
                        if b < n and text[b] == "{":
                            return b
            i += 6
            continue
        i += 1
    return -1


def load_program(warn):
    """Parse program.js -> (dict, parsed_ok). Returns ({}, False) if absent."""
    if not os.path.isfile(PROGRAM_JS):
        warn("program.js not found at the repo root - another agent has not "
             "written it yet; falling back to courses/*.js for the inventory")
        return {}, False
    try:
        text = open(PROGRAM_JS, "r", encoding="utf-8").read()
    except OSError as exc:
        warn("program.js unreadable: %s" % exc)
        return {}, False

    # First choice: tools/jsload.py, which reads the real JavaScript grammar
    # (comments, bare keys, trailing commas, `+` string concatenation). The
    # js_to_json pass below is kept as a second chance, and the regex harvest
    # as a third, so this tool still works if jsload is unavailable.
    try:
        from jsload import load_global as _load_global
        data = _load_global(PROGRAM_JS, "PROGRAM")
        if isinstance(data, dict) and data:
            return data, True
        warn("jsload found no window.PROGRAM object; trying the JSON pass")
    except Exception as exc:                       # noqa: BLE001 - any failure falls through
        warn("jsload could not read program.js (%s); trying the JSON pass" % exc)

    try:
        b = find_program_brace(text)
    except ScanError as exc:
        warn("program.js could not be scanned (%s)" % exc)
        return _regex_program(text, warn), False
    if b < 0:
        warn("program.js contains no `window.PROGRAM = {` assignment")
        return _regex_program(text, warn), False
    try:
        end = match_brace(text, b)
        data = json.loads(js_to_json(text[b:end]))
        if not isinstance(data, dict):
            raise ValueError("window.PROGRAM is not an object")
        return data, True
    except (ScanError, ValueError) as exc:
        warn("could not parse window.PROGRAM (%s) - falling back to a regex "
             "harvest of course codes and concentration ids" % exc)
        return _regex_program(text, warn), False


def _regex_program(text, warn):
    """Last-ditch inventory: harvest codes and kebab-case ids with regexes."""
    codes = []
    for m in CODE_RE.finditer(text):
        code = "FINM %s" % m.group(1)
        if code not in codes:
            codes.append(code)
    ids = []
    k = text.find("concentrations")
    region = text[k:] if k >= 0 else text
    for m in re.finditer(r"id\s*:\s*[\"']([a-z0-9][a-z0-9-]*)[\"']", region):
        cid = m.group(1)
        if cid not in ids and cid not in ("core", "computing", "electives"):
            ids.append(cid)
    warn("regex fallback found %d course codes and %d concentration ids"
         % (len(codes), len(ids)))
    return {"courses": [{"code": c} for c in codes],
            "concentrations": [{"id": i} for i in ids]}


# --------------------------------------------------------------------------
# inventory
# --------------------------------------------------------------------------

def slugify(code):
    """FINM 33000 -> finm-33000"""
    return re.sub(r"[^a-z0-9]+", "-", (code or "").lower()).strip("-")


def course_inventory(prog, warn):
    """[(code, slug)] from program.js, unioned with courses/*.js on disk."""
    pairs = []
    seen = set()

    def add(code, slug=None):
        code = (code or "").strip()
        if not code:
            return
        slug = slug or slugify(code)
        if slug in seen:
            return
        seen.add(slug)
        pairs.append((code, slug))

    courses = prog.get("courses")
    if isinstance(courses, list) and courses:
        for c in courses:
            if isinstance(c, dict):
                add(c.get("code"), c.get("slug"))
            elif isinstance(c, str):
                add(c)
    else:
        for key in ("blocks", "concentrations"):
            for grp in prog.get(key) or []:
                if isinstance(grp, dict):
                    for code in grp.get("courses") or []:
                        if isinstance(code, str):
                            add(code)

    from_program = set(seen)

    # anything on disk that program.js forgot still needs a page
    if os.path.isdir(COURSES_DIR):
        for f in sorted(os.listdir(COURSES_DIR)):
            m = COURSE_FILE_RE.match(f)
            if not m:
                continue
            slug = m.group(1)
            if slug in from_program:
                continue
            code = _code_from_file(os.path.join(COURSES_DIR, f)) or \
                slug.replace("-", " ").upper()
            warn("courses/%s is not listed in program.js - wrapper written "
                 "anyway as %s" % (f, code))
            add(code, slug)
    elif not pairs:
        warn("courses/ does not exist yet and program.js gave no course list")

    # the reverse mismatch is worth saying out loud too
    if os.path.isdir(COURSES_DIR):
        on_disk = set(m.group(1) for m in
                      (COURSE_FILE_RE.match(f) for f in os.listdir(COURSES_DIR))
                      if m)
        for slug in sorted(from_program - on_disk):
            warn("program.js lists %s but courses/%s.js does not exist yet"
                 % (slug, slug))

    pairs.sort(key=lambda p: p[1])
    return pairs


def _code_from_file(path):
    """Pull the code out of window.COURSES["FINM 33000"] = {...}."""
    try:
        head = open(path, "r", encoding="utf-8").read(4000)
    except OSError:
        return None
    m = re.search(r"window\.COURSES\s*\[\s*[\"']([^\"']+)[\"']\s*\]", head)
    if m:
        return m.group(1)
    m = re.search(r"code\s*:\s*[\"']([^\"']+)[\"']", head)
    return m.group(1) if m else None


def conc_inventory(prog):
    """[(id, name)] from PROGRAM.concentrations."""
    out = []
    seen = set()
    for c in prog.get("concentrations") or []:
        if isinstance(c, dict):
            cid, name = c.get("id"), c.get("name")
        elif isinstance(c, str):
            cid, name = c, None
        else:
            continue
        cid = (cid or "").strip()
        if not cid or cid in seen:
            continue
        seen.add(cid)
        out.append((cid, name or cid.replace("-", " ").title()))
    out.sort(key=lambda p: p[0])
    return out


# --------------------------------------------------------------------------
# generation
# --------------------------------------------------------------------------

def load_template(path, errors):
    name = os.path.basename(path)
    if not os.path.isfile(path):
        errors.append("%s is missing - another agent has not written the "
                      "template yet; cannot generate its wrappers" % name)
        return None
    body = open(path, "r", encoding="utf-8").read()
    if ANCHOR not in body:
        errors.append("%s does not contain %s - cannot inject the page globals"
                      % (name, ANCHOR))
        return None
    return body


def retitle(body, lead):
    """Rewrite <title>, keeping any ' · suffix' the template already had."""
    m = TITLE_RE.search(body)
    if not m:
        return body
    old = m.group(1).strip()
    suffix = old.split(" · ", 1)[1].strip() if " · " in old else ""
    new = "%s · %s" % (lead, suffix) if suffix else lead
    return TITLE_RE.sub(lambda _m: "<title>%s</title>" % new, body, count=1)


def inject(body, comment, script):
    return body.replace(
        ANCHOR,
        "<!-- %s\n     Regenerate with tools/make_course_pages.py after editing "
        "the template. -->\n%s\n%s" % (comment, script, ANCHOR), 1)


def write(path, text, dry_run):
    if dry_run:
        return False
    old = None
    if os.path.isfile(path):
        try:
            old = open(path, "r", encoding="utf-8").read()
        except OSError:
            old = None
    if old == text:
        return False
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)
    return True


def main():
    ap = argparse.ArgumentParser(
        description="Generate static course-*.html / concentration-*.html "
                    "wrappers from the query-string templates.")
    ap.add_argument("--dry-run", action="store_true",
                    help="print what would be written or removed; write nothing")
    args = ap.parse_args()

    warnings = []
    errors = []

    def warn(msg):
        warnings.append(msg)

    prog, parsed = load_program(warn)
    if parsed:
        print("program.js parsed as JSON")
    courses = course_inventory(prog, warn)
    concs = conc_inventory(prog)
    if not concs and prog:
        warn("program.js lists no concentrations")

    # templates are loaded unconditionally: a missing one is always an error,
    # even on a half-built repo where the inventory happens to be empty
    course_tpl = load_template(COURSE_TPL, errors)
    conc_tpl = load_template(CONC_TPL, errors)

    keep = set()
    n_course = 0
    if course_tpl and courses:
        for code, slug in courses:
            body = retitle(course_tpl, code)
            body = inject(
                body,
                "Static wrapper for %s." % code,
                '<script>window.COURSE_CODE = "%s"; window.COURSE_SLUG = "%s";</script>'
                % (code, slug))
            name = "course-%s.html" % slug
            keep.add(name)
            write(os.path.join(HERE, name), body, args.dry_run)
            n_course += 1
            if args.dry_run:
                print("would write %s  (%s)" % (name, code))
    m_conc = 0
    if conc_tpl and concs:
        for cid, name_ in concs:
            body = retitle(conc_tpl, name_)
            body = inject(
                body,
                "Static wrapper for the %s concentration." % name_,
                '<script>window.CONC_ID = "%s";</script>' % cid)
            name = "concentration-%s.html" % cid
            keep.add(name)
            write(os.path.join(HERE, name), body, args.dry_run)
            m_conc += 1
            if args.dry_run:
                print("would write %s  (%s)" % (name, name_))

    # drop wrappers whose course or concentration no longer exists
    stale = []
    if (course_tpl and courses) or (conc_tpl and concs):
        for f in sorted(os.listdir(HERE)):
            if f in keep:
                continue
            if COURSE_WRAPPER_RE.match(f) and course_tpl and courses:
                stale.append(f)
            elif CONC_WRAPPER_RE.match(f) and conc_tpl and concs:
                stale.append(f)
    for f in stale:
        if args.dry_run:
            print("would remove stale wrapper %s" % f)
        else:
            try:
                os.remove(os.path.join(HERE, f))
            except OSError as exc:
                errors.append("could not remove %s: %s" % (f, exc))

    for w in warnings:
        print("WARNING: %s" % w)
    for e in errors:
        print("ERROR: %s" % e)
    if stale and not args.dry_run:
        print("removed %d stale wrapper(s): %s" % (len(stale), ", ".join(stale)))

    prefix = "would write" if args.dry_run else "wrote"
    print("%s %d course wrappers, %d concentration wrappers"
          % (prefix, n_course, m_conc))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
