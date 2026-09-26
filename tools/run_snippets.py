#!/usr/bin/env python3
"""
run_snippets.py -- execute every code snippet in courses/*.js and write the
REAL stdout back into its sibling `output` field.

Why this exists
  SCHEMA.md freezes the shape of a concept as
      code: {lang:"python"|"cpp"|"r", src: "...", output: "..."}
  and promises that `output` is the actual stdout of `src`, not something an
  author typed from memory. A course page that prints "0.4382" next to code
  that really prints "0.4381" is worse than no page at all: students trust the
  number. This tool is the mechanism behind that promise. It runs every
  snippet in a throw-away directory, captures stdout, and splices the result
  back into the JS file, so a claim can never drift from the code.

When to run it
  * A content agent runs it right after writing or editing a courses/*.js.
  * CI runs it with --check, which rewrites nothing and exits 1 if any stored
    output is stale or any snippet fails. That is the gate.

How it edits the file
  Not with a JS parser and not with a naive regex. It scans the file
  character by character (strings, // and /* */ comments are skipped so that
  a brace inside them cannot confuse the depth counter), locates each
  `code: { ... }` object, and records the byte span of the `output` string
  literal. New literals are spliced in from the END of the file backwards so
  earlier offsets stay valid, re-encoded in the same quote style that was
  already there. The file is therefore byte-identical apart from the output
  literals themselves: no reformatting, no reflowing, clean diffs.

What it prints
  One line per file:
      courses/finm-33000.js  27 snippets  25 unchanged  2 updated  0 failed
  then a grand total, then a detailed block for every failure naming the file,
  the week and concept it belongs to, the language, and the first error lines.

  Exit 0 = everything ran and everything on disk matches reality.
  Exit 1 = at least one snippet failed, was malformed, or (under --check) is
           out of date.

Usage
  python3 tools/run_snippets.py                    # every courses/*.js
  python3 tools/run_snippets.py courses/finm-33000.js
  python3 tools/run_snippets.py --check            # CI: verify, never write
  python3 tools/run_snippets.py --jobs 4 --timeout 30

Languages
  python / py   run with the interpreter running this tool
  cpp / c++     c++ -std=c++20 -O2, then run the binary
  r             Rscript, but ONLY if Rscript exists; otherwise the snippet is
                SKIPPED (counted separately, output left untouched) because
                SCHEMA.md says to prefer Python when R is unavailable.

Standard library only.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MAX_OUTPUT_CHARS = 8000
ERR_EXCERPT = 2000
QUOTES = "\"'`"
IDENT = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$")

# nice-to-have context for failure reports: the nearest preceding week number
# and concept name, so a failure reads "week 4 - Ito's lemma".
N_RE = re.compile(r"(?<![A-Za-z0-9_$])n\s*:\s*(\d+)")
NAME_RE = re.compile(r"(?<![A-Za-z0-9_$])name\s*:\s*[\"'`]([^\"'`\n]{0,90})")

SIMPLE_ESCAPES = {
    "n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f",
    "v": "\v", "0": "\0", "\\": "\\", '"': '"', "'": "'", "`": "`", "/": "/",
}


class ScanError(Exception):
    """The file is not JS we can safely edit; refuse rather than corrupt it."""


# --------------------------------------------------------------------------
# character scanner
# --------------------------------------------------------------------------

def scan_string(text, i):
    """Scan the JS string literal starting at index i (a ' " or ` character).

    Returns (decoded_value, index_just_past_the_closing_quote).

    Handles backslash escapes (\\n \\t \\" \\' \\\\ \\uXXXX \\u{XXXX} \\xNN)
    and a backslash-newline line continuation. Backticks may span lines;
    template substitution is NOT evaluated (callers should reject "${").
    """
    quote = text[i]
    if quote not in QUOTES:
        raise ScanError("scan_string called at %r, not a quote" % text[i:i + 1])
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
                        raise ScanError("unterminated \\u{...} escape")
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
            if e == "\n":                      # line continuation
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
    """i is at '/' starting a comment. Return the index just past it."""
    if text[i + 1] == "/":
        j = text.find("\n", i)
        return len(text) if j < 0 else j + 1
    j = text.find("*/", i + 2)
    if j < 0:
        raise ScanError("unterminated /* comment")
    return j + 2


def skip_ws(text, i):
    """Skip whitespace and comments; return the next significant index."""
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


def read_ident(text, i):
    """Read an identifier at i; return (word, end) or (None, i)."""
    n = len(text)
    j = i
    while j < n and text[j] in IDENT:
        j += 1
    return (text[i:j], j) if j > i else (None, i)


def parse_object(text, start):
    """Parse the object literal whose '{' is at index `start`.

    Returns (fields, end_index). `fields` maps a depth-1 key to a dict:
        {"kind": "string"|"other", "value": str,
         "start": int, "end": int, "quote": str}
    For a string value, start/end bracket the literal INCLUDING its quotes.
    Nested objects/arrays, strings and comments are skipped, so braces inside
    a snippet (of which there are many) never confuse the depth counter.
    """
    n = len(text)
    i = start + 1
    depth = 1
    fields = {}
    while i < n and depth > 0:
        c = text[i]

        if c in QUOTES:
            val, j = scan_string(text, i)
            k = skip_ws(text, j)
            if depth == 1 and k < n and text[k] == ":":
                i = _record(text, fields, val, skip_ws(text, k + 1))
                continue
            i = j
            continue

        if c == "/" and i + 1 < n and text[i + 1] in "/*":
            i = skip_comment(text, i)
            continue

        if c in "{[":
            depth += 1
            i += 1
            continue

        if c in "}]":
            depth -= 1
            i += 1
            continue

        if depth == 1 and c in IDENT and not c.isdigit():
            word, j = read_ident(text, i)
            k = skip_ws(text, j)
            if k < n and text[k] == ":":
                i = _record(text, fields, word, skip_ws(text, k + 1))
                continue
            i = j
            continue

        i += 1
    return fields, i


def _gap(text, i):
    """Skip whitespace AND comments, so a `+` chain may be commented."""
    while True:
        j = skip_ws(text, i)
        if j < len(text) and text[j] == "/" and text[j + 1:j + 2] in ("/", "*"):
            i = skip_comment(text, j)
            continue
        return j


def _record(text, fields, key, v):
    """Record the value starting at index v under `key`; return where to resume.

    A string value may be a `+` CONCATENATION CHAIN — which it almost always
    is, because a course file writes a multi-line snippet or a 200-word
    `explain` as

        src: "import math\n" +
             "print(math.pi)\n",

    The chain is joined into one value and `start`/`end` bracket the WHOLE
    expression, so rewriting `output` replaces every literal of the chain with
    the single new one rather than corrupting the tail of it.
    """
    n = len(text)
    if v < n and text[v] in QUOTES:
        quote = text[v]
        val, end = scan_string(text, v)
        while True:
            k = _gap(text, end)
            if k < n and text[k] == "+" and text[k + 1:k + 2] != "+" and text[k + 1:k + 2] != "=":
                k2 = _gap(text, k + 1)
                if k2 < n and text[k2] in QUOTES:
                    more, end = scan_string(text, k2)
                    val += more
                    continue
            break
        fields.setdefault(key, {"kind": "string", "value": val,
                                "start": v, "end": end, "quote": quote})
        return end
    word, end = read_ident(text, v)
    if word is not None:
        fields.setdefault(key, {"kind": "other", "value": word,
                                "start": v, "end": end, "quote": ""})
        return end
    fields.setdefault(key, {"kind": "other", "value": "",
                            "start": v, "end": v, "quote": ""})
    return v            # let the main loop handle {, [, numbers, etc.


def js_encode(value, quote='"'):
    """Re-encode `value` as a JS string literal in the given quote style.

    Deliberately minimal: escape the backslash, the quote in use, the three
    whitespace controls and anything below 0x20. Nothing is wrapped or
    reflowed, so the surrounding file keeps its exact formatting.
    """
    if quote not in QUOTES:
        quote = '"'
    out = [quote]
    n = len(value)
    i = 0
    while i < n:
        ch = value[i]
        if ch == "\\":
            out.append("\\\\")
        elif ch == quote:
            out.append("\\" + quote)
        elif ch == "\n":
            out.append("\\n")
        elif ch == "\r":
            out.append("\\r")
        elif ch == "\t":
            out.append("\\t")
        elif ord(ch) < 0x20 or ord(ch) == 0x7f:
            out.append("\\u%04x" % ord(ch))
        elif quote == "`" and ch == "$" and i + 1 < n and value[i + 1] == "{":
            out.append("\\$")
        else:
            out.append(ch)
        i += 1
    out.append(quote)
    return "".join(out)


# --------------------------------------------------------------------------
# snippet collection
# --------------------------------------------------------------------------

class Snippet(object):
    __slots__ = ("path", "rel", "index", "lang", "src", "stored",
                 "out_start", "out_end", "quote", "where",
                 "status", "output", "error")

    def __init__(self, **kw):
        for k in self.__slots__:
            setattr(self, k, kw.get(k))


def _where(text, code_start):
    """Nearest preceding `n:` and `name:` -> a human label for failure reports."""
    head = text[:code_start]
    week = None
    name = None
    ms = N_RE.findall(head)
    if ms:
        week = ms[-1]
    ms = NAME_RE.findall(head)
    if ms:
        name = ms[-1]
    bits = []
    if week:
        bits.append("week %s" % week)
    if name:
        bits.append(name)
    return " - ".join(bits) if bits else "?"


def find_code_objects(text):
    """Yield (code_start_index, fields) for every `code: { ... }` in the file."""
    n = len(text)
    i = 0
    found = []
    while i < n:
        c = text[i]

        if c in QUOTES:
            try:
                val, j = scan_string(text, i)
            except ScanError:
                raise
            # a quoted key:  "code": { ... }
            if val == "code":
                k = skip_ws(text, j)
                if k < n and text[k] == ":":
                    m = skip_ws(text, k + 1)
                    if m < n and text[m] == "{":
                        fields, end = parse_object(text, m)
                        found.append((i, fields))
                        i = end
                        continue
            i = j
            continue

        if c == "/" and i + 1 < n and text[i + 1] in "/*":
            i = skip_comment(text, i)
            continue

        if c == "c" and text.startswith("code", i) and \
                (i == 0 or text[i - 1] not in IDENT):
            j = i + 4
            if j >= n or text[j] not in IDENT:
                k = skip_ws(text, j)
                if k < n and text[k] == ":":
                    m = skip_ws(text, k + 1)
                    if m < n and text[m] == "{":
                        fields, end = parse_object(text, m)
                        found.append((i, fields))
                        i = end
                        continue
            i = j
            continue

        i += 1
    return found


def collect(path):
    """Read one JS file and return (text, snippets, structural_failures)."""
    rel = os.path.relpath(path, HERE)
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()

    fails = []
    try:
        objects = find_code_objects(text)
    except ScanError as exc:
        return text, [], [{"rel": rel, "where": "?", "lang": "?",
                           "msg": "cannot scan file: %s" % exc}]

    snippets = []
    for idx, (code_start, fields) in enumerate(objects):
        where = _where(text, code_start)
        lang = (fields.get("lang") or {}).get("value") or ""
        lang = lang.strip().lower()
        src_f = fields.get("src")
        out_f = fields.get("output")

        if src_f is None or src_f["kind"] != "string":
            fails.append({"rel": rel, "where": where, "lang": lang or "?",
                          "msg": "snippet #%d has no string `src:` field" % idx})
            continue
        if out_f is None:
            fails.append({"rel": rel, "where": where, "lang": lang or "?",
                          "msg": "snippet #%d has no `output:` key - SCHEMA.md "
                                 "requires one; add output:\"\" and re-run" % idx})
            continue
        if out_f["kind"] != "string":
            fails.append({"rel": rel, "where": where, "lang": lang or "?",
                          "msg": "snippet #%d has a non-string `output:`" % idx})
            continue
        if src_f["quote"] == "`" and "${" in text[src_f["start"]:src_f["end"]]:
            fails.append({"rel": rel, "where": where, "lang": lang or "?",
                          "msg": "snippet #%d: backtick `src` contains '${' - "
                                 "template substitution is not supported, use a "
                                 "plain quoted string; snippet skipped" % idx})
            continue

        snippets.append(Snippet(path=path, rel=rel, index=idx, lang=lang,
                                src=src_f["value"], stored=out_f["value"],
                                out_start=out_f["start"], out_end=out_f["end"],
                                quote=out_f["quote"], where=where))
    return text, snippets, fails


# --------------------------------------------------------------------------
# execution
# --------------------------------------------------------------------------

def normalise(stdout):
    """Strip trailing whitespace per line and drop trailing blank lines."""
    lines = [ln.rstrip() for ln in stdout.replace("\r\n", "\n").split("\n")]
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines)


def _excerpt(s):
    s = (s or "").strip()
    return s[:ERR_EXCERPT] + (" ...[truncated]" if len(s) > ERR_EXCERPT else "")


def run_one(snip, timeout):
    """Run a snippet. Sets snip.status in {"ok","fail","skip"}."""
    lang = snip.lang
    tmp = tempfile.mkdtemp(prefix="finmath-snip-")
    try:
        env = dict(os.environ)
        env["PYTHONHASHSEED"] = "0"
        env["PYTHONDONTWRITEBYTECODE"] = "1"

        if lang in ("python", "py", "python3"):
            f = os.path.join(tmp, "snip.py")
            _write(f, snip.src)
            ok, out, err = _exec([sys.executable, "snip.py"], tmp, env, timeout)
            if not ok:
                return _fail(snip, out)
            if err.strip():
                return _fail(snip, "wrote to stderr:\n" + _excerpt(err))
            return _ok(snip, out)

        if lang in ("cpp", "c++", "cxx"):
            cc = shutil.which("c++") or shutil.which("g++") or shutil.which("clang++")
            if not cc:
                return _fail(snip, "no C++ compiler found (looked for c++, g++, clang++)")
            f = os.path.join(tmp, "snip.cpp")
            _write(f, snip.src)
            ok, out, err = _exec([cc, "-std=c++20", "-O2", "-o", "prog", "snip.cpp"],
                                 tmp, env, max(timeout, 60))
            if not ok:
                return _fail(snip, "compile failed:\n" + _excerpt(out))
            # warnings on stderr during compilation are tolerated
            ok, out, err = _exec([os.path.join(tmp, "prog")], tmp, env, timeout)
            if not ok:
                return _fail(snip, out)
            if err.strip():
                return _fail(snip, "program wrote to stderr:\n" + _excerpt(err))
            return _ok(snip, out)

        if lang in ("r", "rscript"):
            if not shutil.which("Rscript"):
                snip.status = "skip"
                snip.output = None
                snip.error = ("R snippet skipped: Rscript not installed - "
                              "SCHEMA.md says use Python instead")
                return snip
            f = os.path.join(tmp, "snip.R")
            _write(f, snip.src)
            ok, out, err = _exec(["Rscript", "--vanilla", "snip.R"], tmp, env, timeout)
            if not ok:
                return _fail(snip, out)
            if err.strip():
                return _fail(snip, "wrote to stderr:\n" + _excerpt(err))
            return _ok(snip, out)

        return _fail(snip, "unknown lang %r - SCHEMA.md allows python, cpp, r"
                     % (snip.lang or ""))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def _write(path, src):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(src if src.endswith("\n") else src + "\n")


def _exec(cmd, cwd, env, timeout):
    """Return (ok, stdout_or_errortext, stderr). ok=False packs the error in [1]."""
    try:
        p = subprocess.run(cmd, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                           timeout=timeout)
    except subprocess.TimeoutExpired:
        return False, "timed out after %gs" % timeout, ""
    except OSError as exc:
        return False, "could not run %s: %s" % (cmd[0], exc), ""
    out = p.stdout.decode("utf-8", "replace")
    err = p.stderr.decode("utf-8", "replace")
    if p.returncode != 0:
        return False, ("exit status %d\n%s" % (p.returncode, _excerpt(err or out))), err
    return True, out, err


def _ok(snip, raw):
    if len(raw) > MAX_OUTPUT_CHARS:
        return _fail(snip, "stdout is %d chars (limit %d) - a page should not "
                     "carry a wall of output; print a summary instead"
                     % (len(raw), MAX_OUTPUT_CHARS))
    snip.status = "ok"
    snip.output = normalise(raw)
    snip.error = None
    return snip


def _fail(snip, msg):
    snip.status = "fail"
    snip.output = None
    snip.error = msg
    return snip


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------

def expand(paths):
    """Turn CLI paths (files or directories) into a sorted list of .js files."""
    out = []
    for p in paths:
        p = p if os.path.isabs(p) else os.path.join(HERE, p)
        if os.path.isdir(p):
            for root, _dirs, files in os.walk(p):
                for f in sorted(files):
                    if f.endswith(".js"):
                        out.append(os.path.join(root, f))
        elif os.path.isfile(p):
            out.append(p)
        else:
            print("skipping %s: no such file or directory" % p)
    seen, uniq = set(), []
    for p in out:
        rp = os.path.realpath(p)
        if rp not in seen:
            seen.add(rp)
            uniq.append(p)
    return uniq


def default_paths():
    files = []
    cdir = os.path.join(HERE, "courses")
    if os.path.isdir(cdir):
        files += [os.path.join(cdir, f) for f in sorted(os.listdir(cdir))
                  if f.endswith(".js")]
    demo = os.path.join(HERE, "tools", "demo_course.js")
    if os.path.isfile(demo):
        files.append(demo)
    return files


def main():
    ap = argparse.ArgumentParser(
        description="Run every code snippet in courses/*.js and store its real stdout.")
    ap.add_argument("paths", nargs="*",
                    help="files or directories (default: courses/*.js "
                         "plus tools/demo_course.js if present)")
    ap.add_argument("--check", action="store_true",
                    help="verify only: write nothing, exit 1 if any output is stale")
    ap.add_argument("--jobs", type=int, default=min(8, os.cpu_count() or 1),
                    help="parallel snippet runners (default: %(default)s)")
    ap.add_argument("--timeout", type=float, default=20.0,
                    help="seconds per snippet (default: %(default)s)")
    args = ap.parse_args()

    files = expand(args.paths) if args.paths else default_paths()
    if not files:
        print("no course files found - courses/*.js does not exist yet; nothing to do")
        return 0

    per_file = []          # [(path, text, [Snippet], [structural failure])]
    todo = []
    for path in files:
        try:
            text, snips, fails = collect(path)
        except (OSError, UnicodeDecodeError) as exc:
            per_file.append((path, "", [], [{"rel": os.path.relpath(path, HERE),
                                             "where": "?", "lang": "?",
                                             "msg": "unreadable: %s" % exc}]))
            continue
        per_file.append((path, text, snips, fails))
        todo.extend(snips)

    if todo:
        jobs = max(1, args.jobs)
        with concurrent.futures.ThreadPoolExecutor(max_workers=jobs) as pool:
            list(pool.map(lambda s: run_one(s, args.timeout), todo))

    tot = {"snip": 0, "same": 0, "upd": 0, "fail": 0, "skip": 0}
    failures = []
    changed_files = 0

    for path, text, snips, fails in per_file:
        rel = os.path.relpath(path, HERE)
        same = upd = bad = skipped = 0
        edits = []
        for f in fails:
            failures.append(f)
            bad += 1
        for s in snips:
            if s.status == "skip":
                skipped += 1
                print("  note: %s [%s] %s" % (rel, s.where, s.error))
                continue
            if s.status != "ok":
                bad += 1
                failures.append({"rel": rel, "where": s.where,
                                 "lang": s.lang or "?", "msg": s.error or "failed"})
                continue
            if s.output == s.stored:
                same += 1
            else:
                upd += 1
                edits.append(s)

        if edits and not args.check:
            # splice from the END backwards so earlier offsets stay valid
            new = text
            for s in sorted(edits, key=lambda x: x.out_start, reverse=True):
                new = new[:s.out_start] + js_encode(s.output, s.quote) + new[s.out_end:]
            try:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(new)
                changed_files += 1
            except OSError as exc:
                bad += len(edits)
                upd = 0
                failures.append({"rel": rel, "where": "?", "lang": "-",
                                 "msg": "could not write file: %s" % exc})
        elif edits and args.check:
            for s in edits:
                failures.append({
                    "rel": rel, "where": s.where, "lang": s.lang or "?",
                    "msg": "stored output is STALE\n  stored: %s\n  actual: %s"
                           % (_short(s.stored), _short(s.output))})
            bad += len(edits)

        n = len(snips) + len(fails)
        tot["snip"] += n
        tot["same"] += same
        tot["upd"] += upd
        tot["fail"] += bad
        tot["skip"] += skipped
        label = "stale" if args.check else "updated"
        line = ("%-34s %3d snippets  %3d unchanged  %3d %s  %3d failed"
                % (rel, n, same, upd, label, bad))
        if skipped:
            line += "  %d skipped" % skipped
        print(line)

    print("-" * 72)
    label = "stale" if args.check else "updated"
    print("TOTAL  %d files  %d snippets  %d unchanged  %d %s  %d failed  %d skipped"
          % (len(per_file), tot["snip"], tot["same"], tot["upd"], label,
             tot["fail"], tot["skip"]))
    if not args.check and changed_files:
        print("rewrote %d file(s)" % changed_files)

    if failures:
        print("")
        print("FAILURES (%d)" % len(failures))
        for f in failures:
            print("")
            print("  %s  [%s]  lang=%s" % (f["rel"], f["where"], f["lang"]))
            for ln in (f["msg"] or "").splitlines()[:14]:
                print("    %s" % ln)
        print("")
        print("FAIL: %d problem(s)" % len(failures))
        return 1

    print("OK: every stored output matches the code that produces it")
    return 0


def _short(s):
    s = (s or "").replace("\n", "\\n")
    return s[:160] + ("..." if len(s) > 160 else "")


if __name__ == "__main__":
    sys.exit(main())
