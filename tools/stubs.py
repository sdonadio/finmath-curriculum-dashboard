#!/usr/bin/env python3
"""Install (and remove) the SHELL agent's placeholder data files.

The shell — pages, app.js, widgets.js, styles.css, the tools — was built
before the HARVEST agent landed `program.js`, `site_params.js` and
`data/skills_seed.js`, and before the content agents landed `courses/*.js`.
Without those files the pages still render (app.js treats every data file as
optional), but a browser logs a 404 for each missing <script src>, and
tools/sweep.py fails a page on any console error. So the smoke test needs
placeholders.

    python3 tools/stubs.py --install    # copy <x>.stub.js -> <x>.js, ONLY if
                                        # the real file is absent; also copy
                                        # tools/demo_course.js into courses/
    python3 tools/stubs.py --remove     # delete ONLY what --install created
    python3 tools/stubs.py --status     # say what is stub, real or missing

SAFETY. --install never overwrites an existing file, and --remove only
deletes files it recorded in .stubs-installed. A stub is additionally
self-identifying: each carries a `stub: true` field and a banner saying so,
and app.js shows an amber "stub data" strip on any page built from one. So a
stub cannot be mistaken for harvested content, and a harvest landing halfway
through cannot be clobbered.

WHEN THE REAL FILES LAND
    python3 tools/stubs.py --remove
    rm program.stub.js site_params.stub.js data/skills_seed.stub.js
and delete the "Stubs" section of README.md. tools/demo_course.js STAYS —
it is the fixture validate.py and run_snippets.py test against; it must not
live under courses/, which is why --install copies it and --remove deletes
the copy.
"""
import argparse
import os
import shutil
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER = os.path.join(HERE, ".stubs-installed")

# (stub source, destination) — both relative to the repo root
PAIRS = [
    ("site_params.stub.js", "site_params.js"),
    ("program.stub.js", "program.js"),
    (os.path.join("data", "skills_seed.stub.js"), os.path.join("data", "skills_seed.js")),
    (os.path.join("tools", "demo_course.js"), os.path.join("courses", "finm-00000.js")),
]


def read_ledger():
    if not os.path.exists(LEDGER):
        return []
    with open(LEDGER, "r", encoding="utf-8") as fh:
        return [ln.strip() for ln in fh
                if ln.strip() and not ln.lstrip().startswith("#")]


def write_ledger(items):
    if not items:
        if os.path.exists(LEDGER):
            os.remove(LEDGER)
        return
    with open(LEDGER, "w", encoding="utf-8") as fh:
        fh.write("# files tools/stubs.py created. tools/stubs.py --remove deletes exactly these.\n")
        for i in items:
            fh.write(i + "\n")


def install():
    made = list(read_ledger())
    for src, dst in PAIRS:
        s, d = os.path.join(HERE, src), os.path.join(HERE, dst)
        if not os.path.exists(s):
            print("  skip    %s (no stub source)" % dst)
            continue
        if os.path.exists(d):
            print("  keep    %s (already exists — not overwritten)" % dst)
            continue
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copyfile(s, d)
        if dst not in made:
            made.append(dst)
        print("  install %s  <-  %s" % (dst, src))
    write_ledger(made)
    print("stubs: %d placeholder%s in place" % (len(made), "" if len(made) == 1 else "s"))
    return 0


def remove():
    made = read_ledger()
    gone = 0
    for dst in made:
        d = os.path.join(HERE, dst)
        if os.path.exists(d):
            os.remove(d)
            gone += 1
            print("  remove  %s" % dst)
        else:
            print("  absent  %s" % dst)
    write_ledger([])
    print("stubs: removed %d placeholder%s" % (gone, "" if gone == 1 else "s"))
    return 0


def status():
    made = set(read_ledger())
    for _src, dst in PAIRS:
        d = os.path.join(HERE, dst)
        if not os.path.exists(d):
            state = "MISSING"
        elif dst in made:
            state = "stub (installed by tools/stubs.py)"
        else:
            state = "real"
        print("  %-28s %s" % (dst, state))
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--install", action="store_true")
    g.add_argument("--remove", action="store_true")
    g.add_argument("--status", action="store_true")
    a = ap.parse_args()
    return install() if a.install else (remove() if a.remove else status())


if __name__ == "__main__":
    sys.exit(main())
