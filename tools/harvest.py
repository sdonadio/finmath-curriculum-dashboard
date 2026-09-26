#!/usr/bin/env python3
"""
harvest.py -- build the canonical inventory + raw-text corpus for the
FinMath Curriculum Arena.

Fetches the public curriculum listing pages, discovers every course page,
extracts structured fields, downloads syllabus PDFs and extracts their text.

Outputs
  data/raw/pages/<slug>.txt        listing-page main text
  data/raw/pages/finm-XXXXX.txt    course-page main text
  data/raw/pdf/finm-XXXXX[-online].pdf
  data/raw/syllabus/finm-XXXXX[-online].txt
  data/courses.csv
  data/harvest_report.md

Usage
  python3 tools/harvest.py [--force] [--no-pdf] [--box-cookie "<cookie header>"]

NOTE  The syllabus PDFs are Box shared links restricted to UChicago accounts.
      Anonymous fetches are redirected to the Box login page, so the syllabus
      corpus comes up empty unless --box-cookie / $BOX_COOKIE is supplied.

Dependencies: requests; pdftotext (poppler) preferred, else pypdf.
"""

from __future__ import annotations

import argparse
import csv
import html as htmllib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import date

try:
    import requests
except ImportError:  # pragma: no cover
    sys.exit("requests is required:  pip3 install --user requests")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
RAW = os.path.join(DATA, "raw")
D_PAGES = os.path.join(RAW, "pages")
D_PDF = os.path.join(RAW, "pdf")
D_SYL = os.path.join(RAW, "syllabus")

BASE = "https://finmath.uchicago.edu"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
MIN_INTERVAL = 0.5          # <= 2 requests / second
FETCHED = os.environ.get("HARVEST_DATE") or date.today().isoformat()

# ---------------------------------------------------------------- listing map

LISTINGS = [
    # (slug,                      path,                                    block)
    ("curriculum",                "/curriculum/",                          None),
    ("required-courses",          "/curriculum/required-courses/",         "core"),
    ("computing",                 "/curriculum/computing/",                "computing"),
    ("electives",                 "/curriculum/electives-1/",              "electives"),
    ("degree-concentrations",     "/curriculum/degree-concentrations/",    None),
    ("project-lab",               "/curriculum/project-lab/",              None),
    ("career-seminar",            "/curriculum/career-seminar/",           None),
]

CONCENTRATIONS = [
    # (id,                    name,                        path slug)
    ("financial-computing",   "Financial Computing",       "financial-computing"),
    ("machine-learning-ai",   "Machine Learning and AI",   "machine-learning-and-ai"),
    ("options-derivatives",   "Options and Derivatives",   "options-and-derivatives"),
    ("rates-credit",          "Rates and Credit",          "rates-and-credit"),
    ("trading",               "Trading",                   "trading"),
]

# Expected roster (for the "found more or fewer" check).
EXPECTED = {
    "core":      ["34000", "33000", "36700"],
    "computing": ["32400", "32800", "33500"],
    "electives": ["32600", "33150", "33160", "34500", "34600", "37400", "37500",
                  "32000", "32700", "32950", "33200", "34700", "35100", "35700",
                  "35900", "37301", "31200", "33100", "33165", "34800", "35600",
                  "37000", "37601"],
}

# The one page-URL / course-code mismatch the program site ships.
URL_CODE_OVERRIDE = {
    "/curriculum/computing/finm-32900/": "32800",
}

# ------------------------------------------------------------------ http

class Fetcher:
    def __init__(self, box_cookie=None):
        self.box_cookie = box_cookie
        self.s = requests.Session()
        self.s.headers.update({
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,"
                      "application/pdf;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        self._last = 0.0

    def _throttle(self):
        gap = time.time() - self._last
        if gap < MIN_INTERVAL:
            time.sleep(MIN_INTERVAL - gap)
        self._last = time.time()

    def get(self, url, **kw):
        self._throttle()
        kw.setdefault("timeout", 45)
        kw.setdefault("allow_redirects", True)
        if self.box_cookie and "box.com" in url:
            h = dict(kw.pop("headers", {}) or {})
            h["Cookie"] = self.box_cookie
            kw["headers"] = h
        return self.s.get(url, **kw)


# ------------------------------------------------------------------ html

TAG_RE = re.compile(r"<[^>]+>")
SCRIPT_RE = re.compile(r"<(script|style)\b.*?</\1>", re.S | re.I)
MAIN_RE = re.compile(
    r'<div class="col-md-9 col-md-push-3 main-content">(.*?)'
    r'(?:<div class="col-md-3 col-md-pull-9 sidebar">|</div>\s*</div>\s*</div>\s*</div>\s*<footer)',
    re.S)


def main_html(page: str) -> str:
    """The article body of a finmath.uchicago.edu page."""
    m = MAIN_RE.search(page)
    if m:
        return m.group(1)
    # Fallback: everything inside role="main" up to the sidebar.
    m = re.search(r'role="main">(.*?)(?:<div class="col-md-3 col-md-pull-9 sidebar">|</footer>)',
                  page, re.S)
    return m.group(1) if m else page


def to_text(frag: str) -> str:
    """Flatten an HTML fragment to readable plain text, one block per line."""
    t = SCRIPT_RE.sub(" ", frag)
    t = re.sub(r"<br\s*/?>", "\n", t, flags=re.I)
    t = re.sub(r"</(p|div|li|h[1-6]|tr|table|ul|ol)>", "\n", t, flags=re.I)
    t = re.sub(r"<li\b[^>]*>", "\n- ", t, flags=re.I)
    t = TAG_RE.sub(" ", t)
    t = htmllib.unescape(t)
    t = t.replace("\xa0", " ").replace("​", "")
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in t.split("\n")]
    out, blank = [], False
    for ln in lines:
        if ln:
            out.append(ln)
            blank = False
        elif not blank:
            out.append("")
            blank = True
    return "\n".join(out).strip() + "\n"


def flat(frag_text: str) -> str:
    """Whitespace-collapsed single line, for regex scanning."""
    return re.sub(r"\s+", " ", frag_text)


# ------------------------------------------------------------------ pdf text

HAVE_PDFTOTEXT = shutil.which("pdftotext") is not None


def ensure_pypdf():
    try:
        import pypdf  # noqa: F401
        return True
    except ImportError:
        print("  … installing pypdf into the user site")
        r = subprocess.run([sys.executable, "-m", "pip", "install", "--user", "-q", "pypdf"])
        if r.returncode != 0:
            return False
        try:
            import pypdf  # noqa: F401
            return True
        except ImportError:
            return False


def pdf_text(path: str):
    """-> (text, n_pages).  Empty text means an image-only / unreadable PDF."""
    text, pages = "", 0
    if HAVE_PDFTOTEXT:
        try:
            out = subprocess.run(["pdftotext", "-layout", "-enc", "UTF-8", path, "-"],
                                 capture_output=True, timeout=180)
            text = out.stdout.decode("utf-8", "replace")
        except Exception as e:
            print("    pdftotext failed: %s" % e)
    if not text.strip() and ensure_pypdf():
        try:
            from pypdf import PdfReader
            rd = PdfReader(path)
            pages = len(rd.pages)
            text = "\n".join((p.extract_text() or "") for p in rd.pages)
        except Exception as e:
            print("    pypdf failed: %s" % e)
    if not pages:
        if ensure_pypdf():
            try:
                from pypdf import PdfReader
                pages = len(PdfReader(path).pages)
            except Exception:
                pages = 0
        if not pages:
            pages = text.count("\f") + (1 if text.strip() else 0)
    return text, pages


WEEK_PATTERNS = [
    re.compile(r"\bweek\s*#?\s*(\d{1,2})\b", re.I),
    re.compile(r"\blecture\s*#?\s*(\d{1,2})\b", re.I),
    re.compile(r"\bsession\s*#?\s*(\d{1,2})\b", re.I),
    re.compile(r"\bclass\s*#?\s*(\d{1,2})\b", re.I),
    re.compile(r"\bday\s*#?\s*(\d{1,2})\b", re.I),
    re.compile(r"\bmodule\s*#?\s*(\d{1,2})\b", re.I),
    re.compile(r"\btopic\s*#?\s*(\d{1,2})\b", re.I),
]


def weekly_outline(text: str) -> str:
    """yes / partial / no -- does the syllabus enumerate a week-by-week plan?"""
    if not text.strip():
        return "no"
    best = 0
    for pat in WEEK_PATTERNS:
        nums = {int(n) for n in pat.findall(text) if 0 < int(n) <= 20}
        best = max(best, len(nums))
    # A dated schedule table counts too.
    dates = re.findall(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}\b",
                       text)
    if len(set(dates)) >= 6:
        best = max(best, len(set(dates)))
    if best >= 5:
        return "yes"
    if best >= 2:
        return "partial"
    return "no"


# ------------------------------------------------------------------ box

BOX_HOST_RE = re.compile(r"(?:uchicago\.)?(?:app\.)?box\.com", re.I)


def box_download(f: Fetcher, url: str):
    """Resolve a Box shared link to PDF bytes.  -> (bytes|None, reason)."""
    m = re.search(r"/s/([A-Za-z0-9]+)", url)
    if not m:
        return None, "box-link-unparseable"
    shared = m.group(1)

    r = f.get(url)
    final = r.url or ""
    ctype = (r.headers.get("Content-Type") or "").lower()
    if "pdf" in ctype and r.content[:5] == b"%PDF-":
        return r.content, "ok"
    if "account.box.com/login" in final or "/login?" in final:
        return None, "box-login-required"

    body = r.text
    fid = None
    for pat in (r'"typedID"\s*:\s*"f_(\d+)"', r'"itemID"\s*:\s*(\d+)',
                r'"file_id"\s*:\s*"?(\d+)', r'/file/(\d+)'):
        mm = re.search(pat, body)
        if mm:
            fid = mm.group(1)
            break
    tries = []
    if fid:
        tries.append("https://uchicago.app.box.com/index.php?rm=box_download_shared_file"
                     "&shared_name=%s&file_id=f_%s" % (shared, fid))
    tries.append("https://uchicago.app.box.com/index.php?rm=box_download_shared_file"
                 "&shared_name=%s" % shared)
    tries.append("https://uchicago.box.com/shared/static/%s.pdf" % shared)
    for u in tries:
        try:
            rr = f.get(u)
        except Exception:
            continue
        if rr.status_code == 200 and rr.content[:5] == b"%PDF-":
            return rr.content, "ok"
    return None, "box-download-failed"


def fetch_pdf(f: Fetcher, url: str):
    """-> (bytes|None, reason)."""
    if BOX_HOST_RE.search(url):
        return box_download(f, url)
    try:
        r = f.get(url)
    except Exception as e:
        return None, "error:%s" % type(e).__name__
    if r.status_code != 200:
        return None, "http-%d" % r.status_code
    if r.content[:5] != b"%PDF-":
        return None, "not-a-pdf"
    return r.content, "ok"


# ------------------------------------------------------------------ parsing

UNITS_RE = re.compile(r"FINM\s*(\d{5})\s*[-–—:]?\s*(.{0,120}?)\s*\((\d{2,3})\s*units?\)",
                      re.I)
QTR_HEAD_RE = re.compile(r"\b(Autumn|Winter|Spring|Summer)\s+Quarter\b", re.I)
COURSE_HREF_RE = re.compile(r'href="([^"]*?/curriculum/[^"]*?/(finm-\d{4,5}[^"/]*)/?)"', re.I)


def parse_listing_units(text: str):
    """-> {code: {'units':int,'title':str,'quarter':str|None}} from a listing page."""
    out = {}
    # Walk quarter headings so each course picks up the section it sits in.
    marks = [(m.start(), m.group(1).capitalize()) for m in QTR_HEAD_RE.finditer(text)]
    flat_t = flat(text)
    # Re-scan with positions on the flattened text for quarter attribution.
    marks_f = [(m.start(), m.group(1).capitalize()) for m in QTR_HEAD_RE.finditer(flat_t)]
    for m in UNITS_RE.finditer(flat_t):
        code, title, units = m.group(1), m.group(2).strip(" -–—"), int(m.group(3))
        qtr = None
        for pos, q in marks_f:
            if pos < m.start():
                qtr = q
        title = re.sub(r"\s+", " ", title).strip()
        out[code] = {"units": units, "title": title, "quarter": qtr}
    _ = marks
    return out


def parse_course_links(page_html: str):
    """-> {code: url} for every /curriculum/.../finm-XXXXX.../ link on the page."""
    found = {}
    for href, slug in COURSE_HREF_RE.findall(page_html):
        url = href if href.startswith("http") else BASE + href
        url = url.split("#")[0].split("?")[0]
        if not url.endswith("/"):
            url += "/"
        path = url.replace(BASE, "")
        code = URL_CODE_OVERRIDE.get(path)
        if not code:
            mm = re.search(r"finm-(\d{5})", slug)
            if not mm:
                continue
            code = mm.group(1)
        found.setdefault(code, url)
    return found


def norm_quarter(v: str) -> str:
    """'Autumn Quarter' -> 'Autumn'; keep a trailing year; drop parentheticals."""
    if not v:
        return ""
    v = re.sub(r"\s*\(.*?\)\s*$", "", v).strip()
    v = re.sub(r"\s+Quarter\b", "", v, flags=re.I).strip()
    return re.sub(r"\s+", " ", v).strip(" .,;")


def parse_course_page(text: str, page_html: str):
    """Pull the structured fields out of a single course page."""
    rec = {"title": "", "instructor": "", "quarter": "", "quarter_raw": "",
           "online_quarter": "",
           "description": "", "syllabus_url": "", "syllabus_online_url": ""}

    lines = [l for l in text.split("\n")]
    nonblank = [l for l in lines if l.strip()]
    if nonblank:
        rec["title"] = nonblank[0].strip()

    # Description: paragraphs before the "In-Person Program" / "Online Program" blocks.
    desc = []
    for ln in nonblank[1:]:
        if re.match(r"^\s*(In[- ]Person Program|Online Program|Quarter\s*:|Instructor\s*:|"
                    r"Syllabus|Online\s*:)", ln, re.I):
            break
        desc.append(ln.strip())
    rec["description"] = " ".join(desc).strip()

    # Split the page into the in-person half and the online half.
    low = text.lower()
    i_on = low.find("online program")
    inperson = text[:i_on] if i_on > 0 else text
    online = text[i_on:] if i_on > 0 else ""

    def grab(block, pat):
        m = re.search(pat, block, re.I)
        return re.sub(r"\s+", " ", m.group(1)).strip(" .;,") if m else ""

    raw_q = grab(inperson, r"Quarter\s*:\s*([^\n]+)")
    rec["quarter_raw"] = raw_q
    rec["quarter"] = norm_quarter(raw_q)
    oq = (grab(online, r"Online\s*:\s*([^\n]+)")
          or grab(online, r"Quarter\s*:\s*([^\n]+)"))
    if not oq:
        oq = grab(text, r"\bOnline\s*:\s*([^\n]+)")
    rec["online_quarter"] = norm_quarter(oq)

    # Instructors: prefer faculty-profile links, in page order, in-person block first.
    fac = re.findall(r'href="[^"]*?/about/faculty-and-lecturers/[^"]*?"[^>]*>(.*?)</a>',
                     page_html, re.S | re.I)
    names, seen = [], set()
    for nm in fac:
        nm = re.sub(r"\s+", " ", htmllib.unescape(TAG_RE.sub("", nm))).strip()
        if nm and nm.lower() not in seen and not nm.lower().startswith("syllabus"):
            seen.add(nm.lower())
            names.append(nm)
    if not names:
        for block in (inperson, online, text):
            v = grab(block, r"Instructors?\s*:\s*([^\n]+)")
            if v:
                names = [x.strip() for x in re.split(r"\s*(?:,|/| and | & )\s*", v) if x.strip()]
                break
    rec["instructor"] = "; ".join(names)

    # Syllabus links -- in-person first, online second when distinct.
    def syl_links(frag_html):
        urls = []
        for href, label in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', frag_html,
                                      re.S | re.I):
            lab = re.sub(r"\s+", " ", htmllib.unescape(TAG_RE.sub("", label))).strip()
            if re.search(r"syllab", lab, re.I) or re.search(r"syllab", href, re.I):
                urls.append(href if href.startswith("http") else BASE + href)
        return urls

    mh = main_html(page_html)
    j = mh.lower().find("online program")
    ip_html, on_html = (mh[:j], mh[j:]) if j > 0 else (mh, "")
    ip = syl_links(ip_html)
    on = syl_links(on_html)
    if ip:
        rec["syllabus_url"] = ip[0]
    if on and (not ip or on[0] != ip[0]):
        rec["syllabus_online_url"] = on[0]
    if not rec["syllabus_url"] and on:
        rec["syllabus_url"] = on[0]
        rec["syllabus_online_url"] = ""
    return rec


# ------------------------------------------------------------------ main

def write(path, s):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-download PDFs that exist")
    ap.add_argument("--no-pdf", action="store_true", help="skip syllabus downloads")
    ap.add_argument("--fetched", default=None, help="override the fetched date (YYYY-MM-DD)")
    ap.add_argument("--box-cookie", default=os.environ.get("BOX_COOKIE"),
                    help="raw Cookie header for uchicago.box.com. The syllabus PDFs are "
                         "shared links restricted to UChicago accounts, so an anonymous "
                         "fetch is redirected to the Box login page. Sign in to Box in a "
                         "browser, copy the Cookie request header from devtools, and pass "
                         "it here (or set BOX_COOKIE) to unlock the syllabus corpus.")
    args = ap.parse_args()
    global FETCHED
    if args.fetched:
        FETCHED = args.fetched

    for d in (D_PAGES, D_PDF, D_SYL):
        os.makedirs(d, exist_ok=True)

    f = Fetcher(box_cookie=args.box_cookie)
    notes = []            # program-level observations for the report
    units_by_code = {}    # code -> {'units','title','quarter'} from listing pages
    block_of = {}         # code -> core|computing|electives
    conc_of = {}          # code -> [concentration ids]
    conc_meta = {}        # id -> {...}
    listing_text = {}

    # ---- listing pages -------------------------------------------------
    print("== listing pages")
    for slug, path, block in LISTINGS:
        r = f.get(BASE + path)
        print("  %-24s %s" % (slug, r.status_code))
        body = main_html(r.text)
        text = to_text(body)
        listing_text[slug] = text
        write(os.path.join(D_PAGES, slug + ".txt"), text)
        if block:
            u = parse_listing_units(text)
            for code, info in u.items():
                units_by_code[code] = info
                block_of[code] = block
            links = parse_course_links(body)
            for code, url in links.items():
                units_by_code.setdefault(code, {"units": "", "title": "", "quarter": None})
                units_by_code[code].setdefault("page_url", url)
                units_by_code[code]["page_url"] = url
                block_of.setdefault(code, block)

    # ---- concentration pages -------------------------------------------
    print("== concentration pages")
    idx_text = listing_text.get("degree-concentrations", "")
    idx_units = {}
    for m in re.finditer(r"([A-Za-z][A-Za-z \-&]+?)\s*\n?\s*(\d{3})\s*units?\s*needed\s*"
                         r"\((\d{3})\s*avail\w*\s*\*?\s*\)", flat(idx_text), re.I):
        idx_units[re.sub(r"\s+", " ", m.group(1)).strip()] = (int(m.group(2)), int(m.group(3)))

    for cid, cname, cslug in CONCENTRATIONS:
        path = "/curriculum/degree-concentrations/%s/" % cslug
        r = f.get(BASE + path)
        print("  %-24s %s" % (cid, r.status_code))
        body = main_html(r.text)
        text = to_text(body)
        write(os.path.join(D_PAGES, "concentration-%s.txt" % cid), text)
        u = parse_listing_units(text)
        for code in u:
            conc_of.setdefault(code, [])
            if cid not in conc_of[code]:
                conc_of[code].append(cid)
            units_by_code.setdefault(code, u[code])
        mm = re.search(r"(\d{3})\s*units?\s*needed\s*\((\d{3})\s*avail\w*\s*\*?\s*\)",
                       flat(text), re.I)
        needed, avail = (int(mm.group(1)), int(mm.group(2))) if mm else ("", "")
        listed = sum(v["units"] for v in u.values() if isinstance(v["units"], int))
        conc_meta[cid] = {
            "id": cid, "name": cname, "url": BASE + path,
            "units_needed": needed, "units_available": avail,
            "courses": sorted(u.keys()), "listed_units": listed,
            "index_pair": idx_units.get(cname),
            "blurb": (text.split("\n")[0] if text else ""),
        }
        if idx_units.get(cname) and idx_units[cname] != (needed, avail):
            notes.append("Concentration %s: index page says %s units needed / %s available, "
                         "the concentration page says %s / %s. Using the concentration page."
                         % (cname, idx_units[cname][0], idx_units[cname][1], needed, avail))
        if isinstance(avail, int) and listed != avail:
            notes.append("Concentration %s: listed course units sum to %d but the page claims "
                         "%d available." % (cname, listed, avail))

    # ---- course pages ---------------------------------------------------
    expected_all = [c for v in EXPECTED.values() for c in v]
    codes = sorted(set(list(units_by_code.keys()) + list(block_of.keys())))
    extra = [c for c in codes if c not in expected_all]
    missing = [c for c in expected_all if c not in codes]
    if extra:
        notes.append("Discovered course codes NOT in the expected 29: %s" % ", ".join(extra))
    if missing:
        notes.append("Expected course codes NOT discovered: %s" % ", ".join(missing))

    # Cross-check against the sitemap: retired course pages are still served but
    # are no longer linked from the curriculum listings.
    try:
        sm = f.get(BASE + "/xml-sitemaps/index.xml").text
        sm_codes = {}
        for u in re.findall(r"https://finmath\.uchicago\.edu/[^<\s]*finm-(\d{4,5})[^<\s]*", sm):
            sm_codes[u] = True
        known = set(codes) | {re.search(r"finm-(\d+)", k).group(1)
                              for k in URL_CODE_OVERRIDE}
        stale = sorted(c for c in sm_codes if c not in known)
        if stale:
            notes.append("Sitemap also serves course pages for FINM %s, but none of them is "
                         "linked from the current Core / Computing / Electives / concentration "
                         "listings. Treated as retired and NOT included in the 29."
                         % ", ".join(stale))
    except Exception as e:
        notes.append("Sitemap cross-check skipped (%s)." % type(e).__name__)

    rows, report = [], []
    print("== course pages (%d)" % len(codes))
    for code in sorted(codes):
        info = units_by_code.get(code, {})
        url = info.get("page_url")
        if not url:
            report.append((code, "NO COURSE PAGE URL FOUND on any listing page", {}))
            continue
        r = f.get(url)
        page = r.text
        body = main_html(page)
        text = to_text(body)
        slug = "finm-%s" % code
        write(os.path.join(D_PAGES, slug + ".txt"), text)
        rec = parse_course_page(text, page)
        miss = []
        if r.status_code != 200:
            miss.append("course page HTTP %d" % r.status_code)
        if not rec["description"]:
            miss.append("no description text")
        if not rec["instructor"]:
            miss.append("no instructor named")
        if not rec["quarter"]:
            miss.append("no in-person quarter")
        if not info.get("units"):
            miss.append("no units on any listing page")
        mcon = re.search(r"Concentrations?\s*:\s*([^\n]+)", text, re.I)
        if mcon:
            def norm(x):
                return re.sub(r"[^a-z0-9]+", " ", x.lower()).strip()
            stated = [norm(x) for x in re.split(r"[,;&/]| \+ ", mcon.group(1)) if norm(x)]
            want = {norm(n) for _i, n, _s in CONCENTRATIONS if _i in conc_of.get(code, [])}
            got = set(stated)
            if want and got and want != got:
                notes.append("FINM %s: course page states concentration %r but the course is "
                             "listed on the %s concentration page."
                             % (code, mcon.group(1).strip(),
                                "/".join(sorted(n for _i, n, _s in CONCENTRATIONS
                                                if _i in conc_of.get(code, [])))))
            if not conc_of.get(code) and got:
                notes.append("FINM %s: course page states concentration %r but the course "
                             "appears on no concentration listing page."
                             % (code, mcon.group(1).strip()))

        if rec.get("quarter_raw") and rec["quarter_raw"] != rec["quarter"]:
            notes.append("FINM %s in-person quarter is recorded verbatim on the course page "
                         "as %r (normalised to %r)."
                         % (code, rec["quarter_raw"], rec["quarter"]))

        lt = (info.get("title") or "").strip().lower()
        ct = (rec["title"] or "").strip().lower()
        if lt and ct and lt != ct:
            notes.append("FINM %s title differs: listing %r vs course page %r"
                         % (code, info.get("title"), rec["title"]))

        # syllabi
        syl_pages = ""
        syl_outline = "n/a" if not rec["syllabus_url"] else "unknown"
        for kind, surl in (("", rec["syllabus_url"]), ("-online", rec["syllabus_online_url"])):
            if not surl:
                if kind == "":
                    miss.append("no syllabus link on the course page")
                continue
            name = slug + kind
            pdfp = os.path.join(D_PDF, name + ".pdf")
            txtp = os.path.join(D_SYL, name + ".txt")
            if args.no_pdf:
                continue
            if not os.path.exists(pdfp) or args.force:
                blob, reason = fetch_pdf(f, surl)
                if blob:
                    with open(pdfp, "wb") as fh:
                        fh.write(blob)
                else:
                    miss.append("syllabus%s not downloadable (%s)" % (kind, reason))
                    continue
            txt, npages = pdf_text(pdfp)
            write(txtp, txt)
            if not txt.strip():
                miss.append("syllabus%s is an image PDF with no extractable text" % kind)
            if kind == "":
                syl_pages = npages
                syl_outline = weekly_outline(txt)
                if syl_outline == "no" and txt.strip():
                    miss.append("syllabus has no week-by-week outline")
                elif syl_outline == "partial":
                    miss.append("syllabus outline is partial")

        rows.append({
            "code": "FINM %s" % code,
            "slug": slug,
            "title": rec["title"] or info.get("title", ""),
            "instructor": rec["instructor"],
            "quarter": rec["quarter"] or (info.get("quarter") or ""),
            "online_quarter": rec["online_quarter"],
            "units": info.get("units", ""),
            "block": block_of.get(code, ""),
            "concentrations": "|".join(conc_of.get(code, [])),
            "page_url": url,
            "syllabus_url": rec["syllabus_url"],
            "syllabus_online_url": rec["syllabus_online_url"],
            "syllabus_pages": syl_pages,
            "syllabus_has_weekly_outline": syl_outline,
            "fetched": FETCHED,
        })
        report.append((code, "; ".join(miss) if miss else "complete", rows[-1]))
        print("  FINM %s  %-52s %s" % (code, (rec["title"] or "?")[:52],
                                       "OK" if not miss else "; ".join(miss)[:70]))

    # ---- courses.csv -----------------------------------------------------
    cols = ["code", "slug", "title", "instructor", "quarter", "online_quarter", "units",
            "block", "concentrations", "page_url", "syllabus_url", "syllabus_online_url",
            "syllabus_pages", "syllabus_has_weekly_outline", "fetched"]
    with open(os.path.join(DATA, "courses.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        for row in sorted(rows, key=lambda r: (["core", "computing", "electives"]
                                               .index(r["block"]) if r["block"] in
                                               ("core", "computing", "electives") else 9,
                                               r["code"])):
            w.writerow(row)

    # ---- harvest_report.md ----------------------------------------------
    L = []
    L.append("# Harvest report — %s" % FETCHED)
    L.append("")
    L.append("Source: public curriculum pages at %s/curriculum/ and the syllabus PDFs "
             "they link. Generated by `tools/harvest.py`." % BASE)
    L.append("")
    n_syl = sum(1 for _c, _m, r in report if r and r.get("syllabus_url"))
    n_txt = len([x for x in os.listdir(D_SYL) if x.endswith(".txt")]) if os.path.isdir(D_SYL) else 0
    L.append("## Syllabus corpus status")
    L.append("")
    L.append("**%d of %d course pages link a syllabus; %d syllabus texts were extracted.**"
             % (n_syl, len(report), n_txt))
    L.append("")
    if n_txt == 0:
        L.append("Every syllabus on the curriculum site is a Box shared link on "
                 "`uchicago.box.com`. Those links are restricted to UChicago accounts: an "
                 "anonymous request is 302'd to "
                 "`uchicago.account.box.com/login?redirect_url=…`, and the Box public "
                 "`/2.0/shared_items` API returns 401. The direct-download forms "
                 "(`rm=box_download_shared_file`, `/shared/static/<hash>.pdf`) are gated the "
                 "same way. **No syllabus PDF text is in this corpus.**")
        L.append("")
        L.append("To unlock it, sign in to Box in a browser, copy the `Cookie` request "
                 "header from devtools and re-run:")
        L.append("")
        L.append("```")
        L.append('BOX_COOKIE="<cookie header>" python3 tools/harvest.py --force')
        L.append("```")
        L.append("")
        L.append("Until then the only per-course source text is the public course page "
                 "(`data/raw/pages/finm-XXXXX.txt`) — an official description of roughly "
                 "80–250 words plus instructor, quarter and concentration. Content agents "
                 "must treat week-by-week structure as **their own construction**, not as "
                 "syllabus-derived, and the `tier: \"B\"` claim in SCHEMA.md is not yet "
                 "supported by a syllabus for any course.")
        L.append("")
    L.append("## Program-level facts")
    L.append("")
    L.append("- Degree total: **1250 units**. A full-quarter course is 100 units; a "
             "first-half or second-half quarter course is 50 units.")
    L.append("- Core: **250 units** required (%d courses)."
             % sum(1 for c in block_of if block_of[c] == "core"))
    L.append("- Computing: **100 units** required, 300 offered (%d courses). Computing units "
             "taken in excess of 100 count as Electives and toward the Financial Computing "
             "concentration." % sum(1 for c in block_of if block_of[c] == "computing"))
    L.append("- Electives: **900 units** required (%d FINM elective courses listed). At least "
             "600 elective units must be strictly FINM courses."
             % sum(1 for c in block_of if block_of[c] == "electives"))
    L.append("- Quarters: Autumn, Winter, Spring, Summer. Autumn is mathematical foundations "
             "plus an introduction to markets; Winter and Spring are statistics, portfolio "
             "theory and applied option pricing plus fixed income and FX; Summer is Project "
             "Lab or an internship; the final Autumn is electives.")
    L.append("")
    L.append("### Concentrations")
    L.append("")
    L.append("| id | name | needed | available | courses listed | listed units |")
    L.append("|---|---|---|---|---|---|")
    for cid, _n, _s in CONCENTRATIONS:
        m = conc_meta[cid]
        L.append("| `%s` | %s | %s | %s | %d | %d |"
                 % (cid, m["name"], m["units_needed"], m["units_available"],
                    len(m["courses"]), m["listed_units"]))
    L.append("")
    for key, title in (("project-lab", "Project Lab"), ("career-seminar", "Career Seminar")):
        L.append("### %s" % title)
        L.append("")
        body = [x for x in listing_text.get(key, "").strip().split("\n") if x.strip()]
        blurb = body[1] if (len(body) > 1 and len(body[0]) < 60) else (body[0] if body else "")
        L.append(blurb)
        L.append("")
    L.append("## Per-course findings")
    L.append("")
    L.append("| code | title | units | block | syllabus | pages | weekly outline | notes |")
    L.append("|---|---|---|---|---|---|---|---|")
    for code, msg, row in report:
        if not row:
            L.append("| FINM %s | — | | | | | | %s |" % (code, msg))
            continue
        has = "yes" if row["syllabus_url"] else "**none**"
        L.append("| %s | %s | %s | %s | %s | %s | %s | %s |"
                 % (row["code"], row["title"], row["units"], row["block"], has,
                    row["syllabus_pages"], row["syllabus_has_weekly_outline"],
                    "" if msg == "complete" else msg))
    L.append("")
    L.append("## Ambiguities and site inconsistencies")
    L.append("")
    if notes:
        for n in notes:
            L.append("- %s" % n)
    else:
        L.append("- None found.")
    L.append("")
    write(os.path.join(DATA, "harvest_report.md"), "\n".join(L) + "\n")

    # A machine-readable dump so the program.js writer does not re-parse.
    write(os.path.join(DATA, "harvest_meta.json"),
          json.dumps({"concentrations": conc_meta, "blocks": block_of,
                      "units": {k: v.get("units") for k, v in units_by_code.items()},
                      "notes": notes, "fetched": FETCHED}, indent=2) + "\n")

    print("\n%d courses -> data/courses.csv" % len(rows))
    for n in notes:
        print("NOTE: %s" % n)


if __name__ == "__main__":
    main()
