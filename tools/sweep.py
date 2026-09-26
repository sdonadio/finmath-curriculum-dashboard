#!/usr/bin/env python3
"""
sweep.py -- load every page of the site in a real browser, click every
control on it, and assert zero console errors.

Why this exists
  The site is vanilla JS with no build step and no framework, which means no
  compiler is watching for a typo in a widget's parameter name, a KaTeX call
  on a page that never loaded KaTeX, or a null dereference in a tab handler
  that only runs after the third click. The only honest test is to drive the
  thing. This tool opens every page in headless Chromium, listens for console
  errors, uncaught page errors and failed requests, then exercises every
  slider, select, checkbox, radio, button, <summary> and text input it can
  find, re-checking the error lists as it goes so a failure can be pinned to
  the interaction that caused it. It then re-loads every page at phone width
  and asserts no horizontal overflow.

  SCHEMA.md's page conventions end with "every page loads with 0 console
  errors (Playwright sweep)". This is that sweep.

Why a local HTTP server
  course.html injects <script src="courses/finm-XXXXX.js"> at runtime. Under
  file:// that is a cross-origin request and the browser blocks it, so the
  page would look broken for reasons that have nothing to do with the code.
  The tool therefore serves the repo root itself on an ephemeral port. Pass
  --base to skip the server and sweep a deployed URL instead.

What counts as a failure
  A console error, an uncaught exception, a failed request, an empty body, a
  body containing "could not be loaded", an exception while interacting, or
  horizontal overflow at 390px. A console warning is reported but does not
  fail. A failed request for KaTeX is reported as a WARNING only: the site is
  required to degrade gracefully when the CDN is unreachable, so an offline
  machine must not turn the whole sweep red.

What it prints
  One line per page:
      OK   index.html                     (37 clicks, 0 errors, 1 warning)
      FAIL course.html?c=FINM+33000       (12 clicks, 2 errors, 0 warnings)
  with each error indented underneath, naming the interaction that produced
  it. The last line is "swept N pages, M failures, K warnings".

  Exit 0 = clean. Exit 1 = at least one page failed. Exit 2 = Playwright is
  not installed (so CI can tell "broken site" from "broken runner").

Usage
  python3 tools/sweep.py
  python3 tools/sweep.py --headed --only 'course*'
  python3 tools/sweep.py --base https://example.github.io/FinMathCurriculumArena/

Requires Playwright (pip install playwright && playwright install chromium);
everything else is the standard library.
"""

from __future__ import annotations

import argparse
import fnmatch
import functools
import http.server
import os
import re
import sys
import threading
import urllib.parse

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    from playwright.sync_api import sync_playwright, Error as PWError
except ImportError:
    print("playwright not installed - pip install playwright && playwright install chromium")
    sys.exit(2)

COURSE_FILE_RE = re.compile(r"^(finm-\d+)\.js$")
SKIP_CLICK_RE = re.compile(r"reset|clear my progress", re.I)
MOBILE = {"width": 390, "height": 844}
DESKTOP = {"width": 1280, "height": 900}

OVERFLOW_JS = """() => {
  const lim = window.innerWidth + 2;
  let worst = null, right = 0;
  const all = document.querySelectorAll('*');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    if (r.right > right) { right = r.right; worst = el; }
  }
  let desc = null;
  if (worst) {
    desc = worst.tagName.toLowerCase();
    if (worst.id) desc += '#' + worst.id;
    const cn = worst.getAttribute('class');
    if (cn) desc += '.' + cn.trim().split(/\\s+/).join('.');
  }
  return {scrollWidth: document.documentElement.scrollWidth,
          inner: window.innerWidth, limit: lim, right: Math.round(right), el: desc};
}"""

SET_RANGE_JS = """(el, v) => {
  el.value = v;
  el.dispatchEvent(new Event('input', {bubbles: true}));
  el.dispatchEvent(new Event('change', {bubbles: true}));
}"""

RANGE_INFO_JS = """(el) => ({min: el.min === '' ? 0 : parseFloat(el.min),
                            max: el.max === '' ? 100 : parseFloat(el.max)})"""

FILL_JS = """(el, v) => {
  el.value = v;
  el.dispatchEvent(new Event('input', {bubbles: true}));
  el.dispatchEvent(new Event('change', {bubbles: true}));
}"""


# --------------------------------------------------------------------------
# local server
# --------------------------------------------------------------------------

class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):      # keep the sweep output readable
        pass


def start_server(root):
    """Serve `root` on an ephemeral port from a daemon thread. Returns base URL."""
    handler = functools.partial(_QuietHandler, directory=root)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    httpd.daemon_threads = True
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, "http://127.0.0.1:%d/" % port


# --------------------------------------------------------------------------
# page inventory
# --------------------------------------------------------------------------

def program_bits():
    """(course codes, concentration ids, quarters) - best effort, never raises."""
    codes, ids, quarters = [], [], []
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import make_course_pages as mcp
        prog, _ok = mcp.load_program(lambda _m: None)
        ids = [cid for cid, _n in mcp.conc_inventory(prog)]
        q = prog.get("quarters")
        if isinstance(q, list):
            quarters = [x for x in q if isinstance(x, str)]
    except Exception:
        # make_course_pages.py may not be importable on a half-built repo
        path = os.path.join(HERE, "program.js")
        if os.path.isfile(path):
            try:
                text = open(path, "r", encoding="utf-8").read()
                ids = list(dict.fromkeys(
                    re.findall(r"id\s*:\s*[\"']([a-z0-9][a-z0-9-]*)[\"']", text)))
                ids = [i for i in ids if i not in ("core", "computing", "electives")]
                m = re.search(r"quarters\s*:\s*\[([^\]]*)\]", text)
                if m:
                    quarters = re.findall(r"[\"']([^\"']+)[\"']", m.group(1))
            except OSError:
                pass

    cdir = os.path.join(HERE, "courses")
    if os.path.isdir(cdir):
        for f in sorted(os.listdir(cdir)):
            m = COURSE_FILE_RE.match(f)
            if not m:
                continue
            code = None
            try:
                head = open(os.path.join(cdir, f), "r", encoding="utf-8").read(4000)
                mm = re.search(r"window\.COURSES\s*\[\s*[\"']([^\"']+)[\"']\s*\]", head)
                code = mm.group(1) if mm else None
            except OSError:
                pass
            codes.append(code or m.group(1).replace("-", " ").upper())
    return codes, ids, quarters


def page_list(only):
    """Every root *.html plus the parameterised template variants."""
    pages = []
    if os.path.isdir(HERE):
        pages += sorted(f for f in os.listdir(HERE) if f.endswith(".html"))
    if not pages:
        print("no *.html at the repo root yet - nothing to sweep")

    codes, ids, quarters = program_bits()
    q = urllib.parse.quote_plus
    if "course.html" in pages:
        pages += ["course.html?c=%s" % q(c) for c in codes]
    if "concentration.html" in pages:
        pages += ["concentration.html?c=%s" % q(i) for i in ids]
    if "quarter.html" in pages:
        pages += ["quarter.html?q=%s" % q(x) for x in quarters]

    if only:
        pages = [p for p in pages if fnmatch.fnmatch(p, only)]
    return pages


# --------------------------------------------------------------------------
# listeners
# --------------------------------------------------------------------------

class Recorder(object):
    """Collects console errors, page errors, failed requests and warnings."""

    def __init__(self):
        self.errors = []        # [{"text":..., "during":...}]
        self.warnings = []
        self.during = "page load"

    def attach(self, page):
        page.on("console", self._console)
        page.on("pageerror", self._pageerror)
        page.on("requestfailed", self._reqfailed)

    def _add(self, text):
        self.errors.append({"text": text, "during": self.during})

    def _warn(self, text):
        self.warnings.append({"text": text, "during": self.during})

    def _console(self, msg):
        try:
            t = msg.type
            text = msg.text
            loc = msg.location or {}
        except Exception:
            return
        where = ""
        if loc.get("url"):
            where = " (%s:%s)" % (loc.get("url"), loc.get("lineNumber"))
        if t == "error":
            if "katex" in (text or "").lower() or "katex" in (loc.get("url") or "").lower():
                self._warn("console error mentioning KaTeX (CDN offline is tolerated): "
                           + text)
            else:
                self._add("console error: " + text + where)
        elif t == "warning":
            self._warn("console warning: " + text)

    def _pageerror(self, exc):
        self._add("uncaught page error: %s" % exc)

    def _reqfailed(self, request):
        try:
            url = request.url
            failure = request.failure or ""
        except Exception:
            return
        low = url.lower()
        if "favicon" in low:
            return
        if url.startswith("data:") and "ERR_ABORTED" in (failure or ""):
            return
        if "katex" in low:
            self._warn("request failed for KaTeX (%s) - the site must degrade "
                       "offline, so this is not a failure: %s" % (url, failure))
            return
        self._add("request failed: %s (%s)" % (url, failure))


# --------------------------------------------------------------------------
# interaction
# --------------------------------------------------------------------------

EXPAND_JS = """
() => {
  const ds = document.querySelectorAll('details');
  let n = 0;
  ds.forEach(d => { if (!d.open) { d.open = true; n++; } });
  return n;
}
"""


def interact(page, rec, max_clicks):
    """Exercise every control on the page. Returns the interaction count."""
    n = [0]
    stop = [False]

    def budget():
        return n[0] < max_clicks and not stop[0]

    def do(desc, fn):
        if not budget():
            return
        n[0] += 1
        rec.during = desc
        try:
            fn()
            page.wait_for_timeout(20)
        except PWError as exc:
            rec.errors.append({"text": "interaction raised: %s"
                               % str(exc).splitlines()[0], "during": desc})
        except Exception as exc:                      # noqa: BLE001
            rec.errors.append({"text": "interaction raised: %s" % exc,
                               "during": desc})
        if n[0] % 20 == 0:
            page.wait_for_timeout(60)

    # ── expand every <details> BEFORE collecting elements ────────────
    # A course page keeps each week in a collapsed <details>, so its widget
    # sliders, selects and buttons are not in the layout until the week is
    # opened. Setting `open` fires the toggle event the page listens for, so
    # the week body (and every widget in it) is built and laid out, and the
    # collection below then sees the controls. Without this the sweep clicks
    # the summaries and stops — the widgets are never exercised at all.
    try:
        opened = page.evaluate(EXPAND_JS)
        if opened:
            page.wait_for_timeout(250)
    except Exception as exc:                          # noqa: BLE001
        rec.errors.append({"text": "expanding <details> raised: %s" % exc,
                           "during": "expand details"})

    start_url = page.url

    def navigated():
        if page.url != start_url:
            rec.errors.append({"text": "click navigated away to %s; remaining "
                                       "controls on this page were not exercised"
                                       % page.url,
                               "during": rec.during})
            stop[0] = True
            return True
        return False

    # sliders -------------------------------------------------------------
    for i, el in enumerate(_all(page, "input[type=range]")):
        if not budget():
            break
        if not _enabled(el):
            continue
        try:
            info = el.evaluate(RANGE_INFO_JS)
            lo, hi = float(info["min"]), float(info["max"])
        except Exception:
            lo, hi = 0.0, 100.0
        for label, v in (("min", lo), ("mid", (lo + hi) / 2.0), ("max", hi)):
            do("range #%d -> %s (%g)" % (i, label, v),
               functools.partial(el.evaluate, SET_RANGE_JS, _num(v)))
        if navigated():
            return n[0]

    # selects -------------------------------------------------------------
    for i, el in enumerate(_all(page, "select")):
        if not budget():
            break
        # A disabled control is a deliberate state, not a bug: index.html
        # disables its Skill filter when skills.js lists no tags yet. Driving
        # one just times out, so skip it — _clickable already does the same
        # for buttons.
        if not _enabled(el):
            continue
        try:
            values = el.evaluate("el => Array.from(el.options).map(o => o.value)")
        except Exception:
            values = []
        for v in (values or [])[:6]:
            do("select #%d -> %r" % (i, v),
               functools.partial(el.select_option, value=v, timeout=3000))
        if navigated():
            return n[0]

    # checkboxes and radios ----------------------------------------------
    for sel in ("input[type=checkbox]", "input[type=radio]"):
        for i, el in enumerate(_all(page, sel)):
            if not budget():
                break
            if not _clickable(el):
                continue
            do("%s #%d click" % (sel, i),
               functools.partial(el.click, timeout=3000, force=True))
            if navigated():
                return n[0]

    # buttons, summaries, role=button -------------------------------------
    for sel in ("button", "summary", "[role=button]"):
        for i, el in enumerate(_all(page, sel)):
            if not budget():
                break
            try:
                if el.get_attribute("data-sweep") == "skip":
                    continue
                label = (el.inner_text() or el.get_attribute("aria-label") or "").strip()
            except Exception:
                label = ""
            if SKIP_CLICK_RE.search(label):
                continue                      # would wipe localStorage mid-sweep
            if not _clickable(el):
                continue
            do("%s #%d %r" % (sel, i, label[:40]),
               functools.partial(el.click, timeout=3000))
            if navigated():
                return n[0]

    # text and search inputs ----------------------------------------------
    for sel in ("input[type=search]", "input[type=text]"):
        for i, el in enumerate(_all(page, sel)):
            if not budget():
                break
            if not _clickable(el):
                continue
            do("%s #%d fill 'vol'" % (sel, i),
               functools.partial(el.evaluate, FILL_JS, "vol"))
            do("%s #%d clear" % (sel, i),
               functools.partial(el.evaluate, FILL_JS, ""))
            if navigated():
                return n[0]

    rec.during = "after interactions"
    page.wait_for_timeout(150)
    return n[0]


def _num(v):
    return str(int(v)) if float(v).is_integer() else repr(float(v))


def _all(page, selector):
    try:
        return page.query_selector_all(selector)
    except Exception:
        return []


def _enabled(el):
    """Visible and not disabled — the precondition for driving a control."""
    try:
        return bool(el.is_enabled()) and bool(el.is_visible())
    except Exception:                                 # noqa: BLE001
        return False


def _clickable(el):
    try:
        return el.is_visible() and el.is_enabled()
    except Exception:
        return False


# --------------------------------------------------------------------------
# one page
# --------------------------------------------------------------------------

def sweep_page(context, base, rel, max_clicks, timeout, do_interact):
    """Load one page (optionally interacting). Returns (clicks, rec)."""
    rec = Recorder()
    page = context.new_page()
    rec.attach(page)
    url = urllib.parse.urljoin(base, rel)
    clicks = 0
    try:
        try:
            page.goto(url, wait_until="load", timeout=timeout)
        except PWError as exc:
            rec.errors.append({"text": "navigation failed: %s"
                               % str(exc).splitlines()[0], "during": "goto"})
            return 0, rec
        page.wait_for_timeout(250)

        try:
            body = page.evaluate("() => (document.body ? document.body.innerText : '').trim()")
        except PWError:
            body = ""
        if not body:
            rec.errors.append({"text": "page rendered an empty body",
                               "during": "render check"})
        elif "could not be loaded" in body.lower():
            i = body.lower().find("could not be loaded")
            rec.errors.append({"text": "page shows a load-failure message: %r"
                               % body[max(0, i - 60):i + 40].replace("\n", " "),
                               "during": "render check"})

        if do_interact:
            clicks = interact(page, rec, max_clicks)
        else:
            # Expand the weeks here too: a collapsed <details> has no laid-out
            # content, so an overflow check on a course page would only ever
            # measure the header. The widgets are the thing most likely to
            # overflow a 390px viewport, so they must be on screen for this.
            try:
                if page.evaluate(EXPAND_JS):
                    page.wait_for_timeout(300)
            except Exception as exc:                  # noqa: BLE001
                rec.errors.append({"text": "expanding <details> raised: %s" % exc,
                                   "during": "expand details"})
            info = page.evaluate(OVERFLOW_JS)
            if info["scrollWidth"] > info["limit"]:
                rec.errors.append({
                    "text": "horizontal overflow at %dpx: scrollWidth=%d, widest "
                            "element right edge %dpx is %s"
                            % (info["inner"], info["scrollWidth"], info["right"],
                               info["el"] or "unknown"),
                    "during": "mobile layout"})
    finally:
        try:
            page.close()
        except Exception:
            pass
    return clicks, rec


def report(status, rel, clicks, rec, width=None):
    tag = "%-38s" % (rel if width is None else "%s @%dpx" % (rel, width))
    print("%-4s %s (%d clicks, %d errors, %d warning%s)"
          % (status, tag, clicks, len(rec.errors), len(rec.warnings),
             "" if len(rec.warnings) == 1 else "s"))
    for e in rec.errors:
        print("       ERROR  [%s] %s" % (e["during"], _one(e["text"])))
    for w in rec.warnings[:5]:
        print("       warn   [%s] %s" % (w["during"], _one(w["text"])))
    if len(rec.warnings) > 5:
        print("       warn   ... and %d more warnings" % (len(rec.warnings) - 5))


def _one(text):
    text = " ".join((text or "").split())
    return text[:300] + ("..." if len(text) > 300 else "")


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(
        description="Load every page in Chromium, click everything, assert zero "
                    "console errors.")
    ap.add_argument("--headed", action="store_true", help="show the browser")
    ap.add_argument("--base", default=None,
                    help="sweep a deployed URL instead of serving the repo root")
    ap.add_argument("--only", default=None,
                    help="fnmatch filter over the page list, e.g. 'course*'")
    ap.add_argument("--max-clicks", type=int, default=120,
                    help="interaction budget per page (default: %(default)s)")
    ap.add_argument("--timeout", type=int, default=20000,
                    help="navigation timeout in ms (default: %(default)s)")
    ap.add_argument("--keep-going", action="store_true", default=True,
                    help="always sweep every page (the default)")
    args = ap.parse_args()

    pages = page_list(args.only)
    if not pages:
        print("swept 0 pages, 0 failures, 0 warnings")
        return 0

    httpd = None
    if args.base:
        base = args.base if args.base.endswith("/") else args.base + "/"
    else:
        httpd, base = start_server(HERE)
        print("serving %s at %s" % (HERE, base))

    failures = 0
    warnings = 0
    swept = 0
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=not args.headed)
            try:
                ctx = browser.new_context(viewport=DESKTOP)
                for rel in pages:
                    clicks, rec = sweep_page(ctx, base, rel, args.max_clicks,
                                             args.timeout, True)
                    swept += 1
                    warnings += len(rec.warnings)
                    bad = bool(rec.errors)
                    failures += 1 if bad else 0
                    report("FAIL" if bad else "OK", rel, clicks, rec)
                ctx.close()

                print("-- mobile pass (390x844, no interactions) --")
                ctx = browser.new_context(viewport=MOBILE)
                for rel in pages:
                    _c, rec = sweep_page(ctx, base, rel, 0, args.timeout, False)
                    warnings += len(rec.warnings)
                    bad = bool(rec.errors)
                    failures += 1 if bad else 0
                    report("FAIL" if bad else "OK", rel, 0, rec, width=390)
                ctx.close()
            finally:
                browser.close()
    finally:
        if httpd is not None:
            httpd.shutdown()
            httpd.server_close()

    print("swept %d pages, %d failures, %d warnings" % (swept, failures, warnings))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
