#!/usr/bin/env python3
"""Read the site's data files (plain `window.X = {...};` globals) from Python.

The site has no build step: every data file is a <script> that assigns a
literal to a global. That is perfect for the browser and awkward for a tool,
because the literals are *JavaScript*, not JSON — they carry comments, bare
identifier keys, trailing commas, single quotes, and (this is the one that
breaks every naive approach) long `explain` strings written as

    "first paragraph … " +
    "second paragraph … "

`json.loads` cannot read any of that. So this module implements a small
recursive-descent reader for the subset of JavaScript a data file is allowed
to contain:

    object      { key: value, … }      key = identifier | string | number
    array       [ value, … ]
    string      "…" | '…' | `…`        with \\n \\t \\" \\\\ \\uXXXX \\xNN escapes
    number      -1  2.5  1e-3
    keyword     true | false | null     (null → None)
    expression  value ( '+' value )*    string concatenation, numeric addition
    comments    // … and /* … */        anywhere whitespace is allowed
    trailing commas everywhere

Anything else — a function, a template substitution `${…}`, an identifier used
as a value — raises JsLoadError naming the line, because a data file that
needs it is a data file that has stopped being data.

    from jsload import load_assignments, load_global, JsLoadError

    load_global(path, "PROGRAM")        -> dict        (window.PROGRAM = {…})
    load_assignments(path, "COURSES")   -> {key: dict} (window.COURSES["X"] = {…})

Both are used by tools/build_skills.py and tools/validate.py. tools/
run_snippets.py deliberately does NOT use this module: it edits the file as
text so the formatting survives, and a parse-then-print round trip would not.
"""
import os
import re

__all__ = ["JsLoadError", "JsReader", "load_global", "load_assignments", "find_assignments"]


class JsLoadError(Exception):
    """A data file contains something this reader will not accept."""


_ID = re.compile(r"[A-Za-z_$][A-Za-z0-9_$]*")
_NUM = re.compile(r"-?(?:0[xX][0-9a-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)")
_ESCAPES = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v",
            "0": "\0", "'": "'", '"': '"', "`": "`", "\\": "\\", "/": "/"}


class JsReader(object):
    """A cursor over one file's text, with the literal grammar above."""

    def __init__(self, text, name="<string>"):
        self.s = text
        self.n = len(text)
        self.i = 0
        self.name = name

    # ── position reporting ────────────────────────────────────────────
    def line(self, at=None):
        return self.s.count("\n", 0, self.i if at is None else at) + 1

    def bail(self, msg, at=None):
        raise JsLoadError("%s:%d: %s" % (self.name, self.line(at), msg))

    # ── whitespace and comments ───────────────────────────────────────
    def ws(self):
        s, n = self.s, self.n
        while self.i < n:
            c = s[self.i]
            if c in " \t\r\n\f\v ﻿":
                self.i += 1
            elif c == "/" and self.i + 1 < n and s[self.i + 1] == "/":
                j = s.find("\n", self.i)
                self.i = n if j < 0 else j + 1
            elif c == "/" and self.i + 1 < n and s[self.i + 1] == "*":
                j = s.find("*/", self.i + 2)
                if j < 0:
                    self.bail("unterminated /* comment")
                self.i = j + 2
            else:
                return

    def peek(self):
        self.ws()
        return self.s[self.i] if self.i < self.n else ""

    def eat(self, ch):
        self.ws()
        if self.i < self.n and self.s[self.i] == ch:
            self.i += 1
            return True
        return False

    def expect(self, ch):
        if not self.eat(ch):
            self.bail("expected %r, found %r" % (ch, self.s[self.i:self.i + 12]))

    # ── string literals ───────────────────────────────────────────────
    def string(self):
        """Read the literal at the cursor (the cursor sits on the quote)."""
        s, n = self.s, self.n
        q = s[self.i]
        if q not in "\"'`":
            self.bail("expected a string")
        i = self.i + 1
        out = []
        while i < n:
            c = s[i]
            if c == "\\":
                if i + 1 >= n:
                    self.bail("string ends in a backslash")
                e = s[i + 1]
                if e == "u":
                    if i + 2 < n and s[i + 2] == "{":
                        j = s.find("}", i + 3)
                        if j < 0:
                            self.bail("unterminated \\u{…}")
                        out.append(chr(int(s[i + 3:j], 16)))
                        i = j + 1
                    else:
                        out.append(chr(int(s[i + 2:i + 6], 16)))
                        i += 6
                elif e == "x":
                    out.append(chr(int(s[i + 2:i + 4], 16)))
                    i += 4
                elif e == "\n":
                    i += 2                      # line continuation
                elif e == "\r":
                    i += 3 if s[i + 2:i + 3] == "\n" else 2
                else:
                    out.append(_ESCAPES.get(e, e))
                    i += 2
                continue
            if c == q:
                self.i = i + 1
                return "".join(out)
            if c == "\n" and q != "`":
                self.bail("newline inside a %s-quoted string" % q)
            if q == "`" and c == "$" and s[i + 1:i + 2] == "{":
                self.bail("template substitution ${…} in a data file")
            out.append(c)
            i += 1
        self.bail("unterminated string")

    # ── values ────────────────────────────────────────────────────────
    def value(self):
        """One value, possibly a chain of `+` concatenations."""
        v = self.atom()
        while True:
            save = self.i
            self.ws()
            if self.i < self.n and self.s[self.i] == "+" and self.s[self.i + 1:self.i + 2] != "+":
                self.i += 1
                rhs = self.atom()
                if isinstance(v, str) or isinstance(rhs, str):
                    v = "%s%s" % (v, rhs)
                elif isinstance(v, (int, float)) and isinstance(rhs, (int, float)):
                    v = v + rhs
                else:
                    self.bail("cannot add %s to %s" % (type(rhs).__name__, type(v).__name__))
            else:
                self.i = save
                return v

    def atom(self):
        self.ws()
        if self.i >= self.n:
            self.bail("unexpected end of file")
        c = self.s[self.i]
        if c == "{":
            return self.object()
        if c == "[":
            return self.array()
        if c in "\"'`":
            return self.string()
        if c == "(":
            self.i += 1
            v = self.value()
            self.expect(")")
            return v
        m = _NUM.match(self.s, self.i)
        if m:
            self.i = m.end()
            t = m.group(0)
            if t[:2].lower() in ("0x", "-0") and "x" in t.lower():
                return int(t, 16)
            return float(t) if re.search(r"[.eE]", t) else int(t)
        m = _ID.match(self.s, self.i)
        if m:
            word = m.group(0)
            if word in ("true", "false", "null", "undefined"):
                self.i = m.end()
                return {"true": True, "false": False}.get(word)
            self.bail("identifier %r used as a value — a data file must be literal" % word)
        self.bail("cannot read a value at %r" % self.s[self.i:self.i + 20])

    def array(self):
        self.expect("[")
        out = []
        while True:
            if self.eat("]"):
                return out
            out.append(self.value())
            if self.eat(","):
                continue
            self.expect("]")
            return out

    def object(self):
        self.expect("{")
        out = {}
        while True:
            if self.eat("}"):
                return out
            self.ws()
            c = self.s[self.i] if self.i < self.n else ""
            if c in "\"'`":
                key = self.string()
            else:
                m = _ID.match(self.s, self.i) or _NUM.match(self.s, self.i)
                if not m:
                    self.bail("expected a key at %r" % self.s[self.i:self.i + 20])
                key = m.group(0)
                self.i = m.end()
            self.expect(":")
            out[key] = self.value()
            if self.eat(","):
                continue
            self.expect("}")
            return out


# ── locating the assignments in a file ────────────────────────────────
def find_assignments(text, global_name, name="<string>"):
    """Every real `window.<global_name>[...] = value` / `window.<global_name> = value`.

    Returns a list of (subscript, value). `subscript` is None for a plain
    assignment and the string key for a subscripted one. Matches inside
    strings and comments are skipped, which matters because program.stub.js
    documents its own shape inside a /* … */ banner.
    """
    r = JsReader(text, name)
    pat = re.compile(r"window\s*\.\s*" + re.escape(global_name) + r"\s*(\[|=[^=])")
    out = []
    i = 0
    while True:
        r.i = i
        r.ws()                                   # skip comments/whitespace
        if r.i >= r.n:
            break
        c = text[r.i]
        if c in "\"'`":                          # a string: skip it whole
            r.string()
            i = r.i
            continue
        m = pat.match(text, r.i)
        if not m:
            i = r.i + 1
            continue
        r.i = m.end() - 1                        # sit on '[' or the char after '='
        if m.group(1) == "[":
            r.i = m.end()
            r.ws()
            key = r.string()
            r.expect("]")
            r.ws()
            if not r.eat("="):
                i = r.i
                continue
        else:
            key = None
        # `window.X = window.X || {}` is a guard, not data: skip it
        save = r.i
        r.ws()
        if re.match(r"window\s*\.\s*" + re.escape(global_name) + r"\s*\|\|", text[r.i:]):
            i = text.find(";", r.i)
            i = r.n if i < 0 else i + 1
            continue
        r.i = save
        out.append((key, r.value()))
        i = r.i
    return out


def load_text(path):
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read()


def load_global(path, global_name, default=None):
    """The value of `window.<global_name> = {...}` in `path`, or `default`."""
    if not os.path.exists(path):
        return default
    found = find_assignments(load_text(path), global_name, os.path.basename(path))
    for key, val in found:
        if key is None:
            return val
    return default


def load_assignments(path, global_name):
    """`{subscript: value}` for every `window.<global_name>["k"] = {...}`."""
    if not os.path.exists(path):
        return {}
    out = {}
    for key, val in find_assignments(load_text(path), global_name, os.path.basename(path)):
        if key is not None:
            out[key] = val
    return out


if __name__ == "__main__":                       # a tiny self-test
    import json as _json
    import sys
    if len(sys.argv) < 3:
        print("usage: python3 tools/jsload.py <file.js> <GLOBAL> [--subscripts]")
        raise SystemExit(2)
    f, g = sys.argv[1], sys.argv[2]
    data = load_assignments(f, g) if "--subscripts" in sys.argv else load_global(f, g)
    print(_json.dumps(data, indent=2, default=str)[:4000])
