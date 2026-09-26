/* courses/finm-32800.js -- FINM 32800, Data Pipelines for Quantitative Research.
   Built from the public course page only. The syllabus is a Box shared link behind a
   university login and was not readable, so the ten-week arc, the explanations, the
   code, the questions, the interview set and the glossary are this dashboard's own
   reconstruction of a standard graduate treatment of the topics the public
   description names -- not the instructor's material, and not endorsed by anyone.
   Every code `output` is real stdout written by tools/run_snippets.py; do not edit
   those strings by hand. Regenerate with tools/gen_finm_32800.py. */
window.COURSES = window.COURSES || {};
window.COURSES["FINM 32800"] = {
  "code": "FINM 32800",
  "slug": "finm-32800",
  "title": "Data Pipelines for Quantitative Research",
  "instructor": "Jeremy Bejarano",
  "quarter": "Autumn",
  "units": 100,
  "block": "computing",
  "concentrations": [],
  "source": {
    "page_url": "https://finmath.uchicago.edu/curriculum/computing/finm-32900/",
    "syllabus_url": "https://uchicago.box.com/s/htsr0ql39jymg6zktkn57o57x7h5lu18",
    "fetched": "2026-09-26",
    "note": "The only source consulted is the public course page, which gives an official description of the course, its instructor, its quarter and its units. The linked syllabus is a Box shared link gated behind a university login and could not be read, so data/raw/syllabus/ is empty for this course. Everything on this page beyond the description block -- the ten-week arc, the concepts, the code, the questions, the interview set, the pitfalls and the glossary -- is the dashboard's own reconstruction of a standard graduate treatment of the tools and case-study datasets the public description names: build automation and CI/CD, dependency management, SQL, unit testing and automated data-quality checks, the command line, Git and pull-request review, applied to pricing and fundamentals data, options data, corporate bond transactions, intraday trades and quotes, and order-book data. It is not the instructor's outline, it was not reviewed by the instructor, and no claim is made about grading, assignments, exam format or which textbook is actually assigned."
  },
  "tier": "B",
  "description": "A hands-on course in building reproducible analytical pipelines end to end: extraction and cleaning, data validation, exploratory analysis and visualization, modeling, and publication and deployment, run as software rather than as one-off notebooks. The public description centers the course on the tool set that recurs across virtually every real research pipeline -- build automation and CI/CD, dependency management, SQL, unit testing and automated data-quality checks, the Linux command line, Git for version control, and peer review through pull requests -- and teaches it through a sequence of case studies, each introducing a new key financial dataset alongside a new set of tools: pricing and fundamentals from CRSP and Compustat, options data from OptionMetrics, corporate bond transactions from FINRA TRACE, intraday trades and quotes from NYSE TAQ, and order-book data from CME Globex. Prior experience with Python and the PyData stack at an intermediate level is assumed; the course does not teach Python itself, only the discipline of running it as a reproducible pipeline rather than a script that happened to work once.",
  "prerequisites": [
    "Python and the PyData stack -- pandas, numpy -- at an intermediate level: comfortable writing a merge, a groupby, and a small script without hand-holding. The course spends no time teaching Python itself and assumes this fluency from the first exercise.",
    "Enough SQL to read a SELECT with a WHERE and a JOIN. Week 9 builds window functions, indexes and query plans on top of that vocabulary; it does not introduce joins from scratch.",
    "A command-line environment at the level of navigating directories, redirecting output, and reading a nonzero exit code. Every exercise in this course is run and debugged from a terminal, not a notebook, starting in week 1.",
    "What a financial time series is, and why it needs a well-defined index and trading calendar. The course does not re-derive this; it exploits it every week, especially in week 3's point-in-time joins.",
    "Basic descriptive statistics -- a mean, a standard deviation, a z-score -- at the level week 6's data-quality checks assume without re-deriving them."
  ],
  "textbooks": [
    {
      "title": "Designing Data-Intensive Applications",
      "author": "Martin Kleppmann",
      "note": "A standard reference for weeks 2, 4, 5 and 8: storage formats, batch and dependency-graph processing, idempotent writes, and partitioning and skew."
    },
    {
      "title": "Fundamentals of Data Engineering",
      "author": "Joe Reis and Matt Housley",
      "note": "A standard reference for the course's overall arc -- source to serving, framed as a lifecycle rather than a single ETL script -- that the ten weeks follow."
    },
    {
      "title": "Streaming Systems",
      "author": "Tyler Akidau, Slava Chernyak and Reuven Lax",
      "note": "A standard reference for week 5's vocabulary of event time versus processing time, watermarks and allowed lateness, used directly in that week's exercises."
    },
    {
      "title": "Learning SQL",
      "author": "Alan Beaulieu",
      "note": "A standard reference for week 9's joins, window functions, and reading a query's execution plan."
    },
    {
      "title": "Python for Data Analysis",
      "author": "Wes McKinney",
      "note": "A standard reference for the pandas idioms -- dtype coercion, groupby, rolling windows -- used from week 1 onward."
    },
    {
      "title": "Site Reliability Engineering",
      "author": "Betsy Beyer, Chris Jones, Jennifer Petoff and Niall Richard Murphy (eds.)",
      "note": "A standard reference for week 6's alerting-threshold arithmetic and week 10's review discipline, both drawn from an operations culture of measured, falsifiable claims rather than anecdote."
    }
  ],
  "skills_built": [
    "etl-pipelines",
    "time-series-alignment",
    "workflow-orchestration",
    "incremental-processing",
    "data-validation",
    "schema-evolution",
    "columnar-storage",
    "sql",
    "crsp-compustat",
    "taq-trades-quotes",
    "optionmetrics",
    "data-lineage",
    "reproducible-research",
    "code-review"
  ],
  "skills_assumed": [
    "python-pandas",
    "numpy",
    "git-version-control"
  ],
  "brushup": [
    {
      "topic": "pandas dtype and null handling at the boundary",
      "why": "Weeks 2 and 6 both hinge on the difference between a string, a NaN and a None, and on pandas' habit of silently coercing one into another. Arriving fluent with this saves both weeks from feeling like a debugging exercise instead of a lesson.",
      "resource": "The pandas user guide's page on working with missing data; then read a small CSV with a blank cell and print the dtype of every column before and after declaring what each column should be."
    },
    {
      "topic": "SELECT ... JOIN ... GROUP BY, before window functions",
      "why": "Week 9 assumes fluency with inner, left and outer joins and GROUP BY before it layers on window functions and query plans; arriving without that vocabulary turns one week's worth of new ideas into two.",
      "resource": "Any SQL primer's chapter on joins and aggregation; then write, by hand, a query that finds a foreign key with no matching row in the table it references."
    },
    {
      "topic": "Hashing as an identity function",
      "why": "Weeks 1, 4, 7 and 10 all use a cryptographic hash as a stand-in for 'the identity of this exact byte sequence' -- content addressing, DAG fingerprints, cache keys and reproducibility manifests are the same trick applied four times.",
      "resource": "Any short explainer of SHA-256's determinism and avalanche property; then hash the same short string twice and a one-character variant of it and compare the results."
    },
    {
      "topic": "Big-O for an unindexed nested loop",
      "why": "Week 9's case for indexing a join rests on n times m versus n times log m; without that as a visible asymptotic argument rather than a rule of thumb, the indexing week reads as folklore rather than as a computable tradeoff.",
      "resource": "Any algorithms text's chapter on search and nested iteration; then count, by hand, how many comparisons a nested loop over two lists of size 20 and 30 actually performs."
    },
    {
      "topic": "A trading calendar, and what 'as of' means for a date",
      "why": "Week 3's entire subject is not confusing period-end with announce-date with trade date; without a working mental model of a financial reporting calendar going in, the three-dates problem reads as a data-quality bug rather than a join design decision.",
      "resource": "Any market-structure primer's discussion of settlement and reporting lags; then write down, for a company you know, the gap between its fiscal quarter-end and the date its results were actually filed."
    },
    {
      "topic": "Reading a traceback and a nonzero exit code",
      "why": "From week 1 onward every exercise runs as a script from a terminal, and diagnosing a failure means reading Python's traceback and knowing which line actually raised, not printing statements until something works.",
      "resource": "Any Python tutorial's section on exceptions and tracebacks; then intentionally break a five-line script three different ways and read exactly what each traceback says."
    }
  ],
  "weeks": [
    {
      "n": 1,
      "title": "Extraction: pulling data you can trust",
      "topics": [
        "cursor vs offset pagination",
        "retry policies and backoff",
        "deduplication by natural key",
        "immutable landing zones, schema-on-read"
      ],
      "concepts": [
        {
          "name": "A cursor is a fact about the data; an offset is a fact about a query",
          "explain": "<p>Every pipeline starts by pulling from someone else's system, one page at a time, and the two ways of doing that pagination fail differently. Offset pagination asks a server for \"rows 10 through 15 of the current result set\"; cursor pagination asks for \"rows whose key is greater than the last one I saw.\" The difference only shows up when the underlying data changes between pages, which on a live venue or vendor feed it always eventually does.</p><p>The snippet drains the same 23-record table both ways while an insert or a delete happens mid-pull. A cursor walk that anchors on the last id it saw comes back with all 23 rows and no duplicates, because \"greater than id 9\" is still true no matter what happened to row 0. Offset pagination is not so lucky: inserting a new row at the top of the table shifts every later page by one, so the pull comes back with 24 rows and one duplicate; deleting a row at the top shifts pages the other way and one row -- id 10 -- is silently never fetched at all.</p><p>A desk cares because a missing row in a research panel does not raise an exception; it just becomes a gap nobody notices until a backtest and a vendor's own totals disagree, and by then the extraction code that caused it may have been retired for months.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# A synthetic vendor endpoint: 23 records, page size 5, two pagination styles.\nRECORDS = [{\"id\": i, \"sym\": [\"AAA\", \"BBB\", \"CCC\"][i % 3], \"px\": 100.0 + i} for i in range(23)]\n\n\ndef page_by_cursor(store, cursor, limit=5):\n    \"\"\"Keyset pagination: 'rows whose id is greater than this cursor'.\"\"\"\n    rows = [r for r in store if r[\"id\"] > cursor][:limit]\n    return rows, (rows[-1][\"id\"] if len(rows) == limit else None)\n\n\ndef page_by_offset(store, offset, limit=5):\n    \"\"\"Offset pagination: 'rows offset..offset+limit of the current result set'.\"\"\"\n    return store[offset:offset + limit]\n\n\ngot, cur, calls = [], -1, 0\nwhile True:\n    rows, cur = page_by_cursor(RECORDS, cur)\n    calls += 1\n    got += rows\n    if cur is None:\n        break\nprint(f\"cursor pull : {calls} calls, {len(got)} rows, distinct {len(set(r['id'] for r in got))}\")\n\n\ndef offset_drain(mutate_at, mutation):\n    live, seen = list(RECORDS), []\n    for off in (0, 5, 10, 15, 20):\n        if off == mutate_at:\n            mutation(live)\n        seen += page_by_offset(live, off)\n    ids = [r[\"id\"] for r in seen]\n    dup = sorted(i for i in set(ids) if ids.count(i) > 1)\n    missing = sorted(set(r[\"id\"] for r in RECORDS) - set(ids))\n    return len(ids), dup, missing\n\n\nn, dup, miss = offset_drain(10, lambda lv: lv.insert(0, {\"id\": 99, \"sym\": \"NEW\", \"px\": 1.0}))\nprint(f\"offset pull, insert at top : {n} rows, duplicated {dup}, missing {miss}\")\nn, dup, miss = offset_drain(10, lambda lv: lv.pop(0))\nprint(f\"offset pull, delete at top : {n} rows, duplicated {dup}, missing {miss}\")\nprint(\"a cursor is a fact about the data; an offset is a fact about a result set that moved\")\n",
            "output": "cursor pull : 5 calls, 23 rows, distinct 23\noffset pull, insert at top : 24 rows, duplicated [9], missing []\noffset pull, delete at top : 22 rows, duplicated [], missing [10]\na cursor is a fact about the data; an offset is a fact about a result set that moved"
          }
        },
        {
          "name": "Exponential backoff has a closed form; jitter breaks its worst property",
          "explain": "<p>A retry policy is a decision about how long to wait before asking again after a failed call, and the three simplest policies -- fixed, exponential, and exponential with random jitter -- behave identically for a single client and very differently for a fleet of them. Fixed backoff always waits the same interval; pure exponential backoff doubles the wait on every failure up to a cap; full jitter draws the wait uniformly between zero and that same exponential ceiling.</p><p>Against one endpoint that fails four times before succeeding, all three eventually get through, but the exponential policy's total wait -- 7.5 seconds here -- is not an empirical accident: it is the closed form base times (2^n minus 1) for n failed attempts, computable before a single request is sent. The policy question that actually matters shows up with ten clients hitting the same rate-limited endpoint at once: run with pure exponential backoff, all ten clients that fail on the same attempt compute the identical delay and retry in lockstep, producing exactly one distinct retry schedule across all ten. Add jitter and the ten clients scatter into ten different schedules.</p><p>That lockstep behavior is a self-inflicted second outage: a fleet that backs off in unison turns one transient failure into a synchronized retry storm against a server that was already struggling. Jitter is not cosmetic; it is what makes a retry policy safe to run at fleet scale rather than for one client in isolation.</p>",
          "formula": "T_n = \\text{base} \\cdot (2^n - 1)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport random\n\n# A fake endpoint that returns 429 (rate limited) for the first `fails` calls,\n# then 200. No sleeping: we accumulate the delay the policy WOULD have waited.\nclass Endpoint:\n    def __init__(self, fails):\n        self.fails, self.calls = fails, 0\n\n    def get(self):\n        self.calls += 1\n        return 429 if self.calls <= self.fails else 200\n\n\ndef fetch(endpoint, policy, base=0.5, cap=8.0, max_tries=6, seed=20240917):\n    rng = random.Random(seed)          # jitter must be seeded or the log is unreproducible\n    waited, sched = 0.0, []\n    for attempt in range(max_tries):\n        if endpoint.get() == 200:\n            return \"ok\", attempt + 1, waited, sched\n        if policy == \"fixed\":\n            d = base\n        elif policy == \"exponential\":\n            d = min(cap, base * 2 ** attempt)\n        else:                                       # full jitter\n            d = rng.uniform(0.0, min(cap, base * 2 ** attempt))\n        sched.append(round(d, 3))\n        waited += d\n    return \"gave up\", max_tries, waited, sched\n\n\nprint(f\"{'policy':<14}{'result':<10}{'calls':>6}{'total wait s':>14}  delays\")\nfor policy in (\"fixed\", \"exponential\", \"jittered\"):\n    res, calls, waited, sched = fetch(Endpoint(fails=4), policy)\n    print(f\"{policy:<14}{res:<10}{calls:>6}{waited:>14.3f}  {sched}\")\n\n# Ten clients hammering one quota: fixed backoff keeps them in lockstep,\n# jitter spreads them out. Count how many share an identical delay schedule.\ndef schedules(policy, n=10):\n    out = []\n    for c in range(n):\n        _, _, _, sched = fetch(Endpoint(fails=3), policy, seed=1000 + c)\n        out.append(tuple(sched))\n    return out\n\n\nfor policy in (\"exponential\", \"jittered\"):\n    s = schedules(policy)\n    print(f\"{policy:<14}10 clients -> {len(set(s))} distinct retry schedule(s)\")\nprint(\"closed form for the pure exponential wait: base*(2^n - 1) =\", 0.5 * (2 ** 4 - 1))\n",
            "output": "policy        result     calls  total wait s  delays\nfixed         ok             5         2.000  [0.5, 0.5, 0.5, 0.5]\nexponential   ok             5         7.500  [0.5, 1.0, 2.0, 4.0]\njittered      ok             5         3.855  [0.016, 0.869, 1.862, 1.107]\nexponential   10 clients -> 1 distinct retry schedule(s)\njittered      10 clients -> 10 distinct retry schedule(s)\nclosed form for the pure exponential wait: base*(2^n - 1) = 7.5"
          }
        },
        {
          "name": "The dedup key must be a fact about the trade, not about the fetch",
          "explain": "<p>Two overlapping pulls of the same TRACE-shaped tape return 12 payloads for what is really 9 distinct trades, because the vendor re-sends anything still inside its retention window and, in this pull, corrects the price on one of them. Deduplicating by hashing the entire row keeps all 12: the corrected trade differs from its earlier copy in exactly the field that changed, so a whole-row hash sees two different records rather than one record with a fix. Deduplicating on the trade's own stable identifier -- here just trade_id -- collapses this correctly to 9 rows, and because \"last write wins\" on that key, the corrected price for trade 4 is the one that survives.</p><p>The general rule is that a dedup key may only contain facts about the thing being deduplicated, never facts about how or when it was retrieved. The snippet's payload carries a retrieved_at timestamp that changes on every pull whether or not the trade itself changed; folding that field into the key, or hashing the whole row including it, turns every re-pull into a spurious new record. Choosing the key is therefore a modeling decision, not a hashing detail: it is where a pipeline author decides what \"the same record\" means, and getting it wrong either loses a legitimate correction or manufactures phantom duplicate trades that inflate every downstream count.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\n\n# Two overlapping fetch windows of the same TRACE-shaped tape. The vendor\n# stamps every payload with when WE pulled it, and re-sends one corrected price.\ndef payload(trade_id, px, pulled_at):\n    return {\"trade_id\": trade_id, \"cusip\": \"37833100AA\", \"px\": px,\n            \"size\": 1_000_000, \"retrieved_at\": pulled_at}\n\n\npull_a = [payload(i, 99.0 + i * 0.25, \"2026-09-20T09:00:00Z\") for i in range(1, 7)]\npull_b = [payload(i, 99.0 + i * 0.25, \"2026-09-20T15:00:00Z\") for i in range(4, 10)]\npull_b[0][\"px\"] = 100.10          # trade 4 was corrected by the vendor\n\n\ndef row_hash(rec):\n    blob = json.dumps(rec, sort_keys=True).encode()\n    return hashlib.sha256(blob).hexdigest()[:12]\n\n\ndef dedup(rows, key_fn):\n    store = {}\n    for r in rows:\n        store[key_fn(r)] = r          # last write wins\n    return store\n\n\nall_rows = pull_a + pull_b\nprint(f\"rows fetched across the two overlapping windows : {len(all_rows)}\")\n\nby_hash = dedup(all_rows, row_hash)\nprint(f\"dedup by hash of the whole row                  : {len(by_hash)} rows kept\")\n\nby_key = dedup(all_rows, lambda r: r[\"trade_id\"])\nprint(f\"dedup by the stable natural key (trade_id)      : {len(by_key)} rows kept\")\nprint(f\"trade 4 after key dedup: px={by_key[4]['px']}  (the correction survived)\")\n\n# The stable key has to be a fact about the TRADE, not about the transport.\nvolatile = [k for k in pull_a[0] if k in (\"retrieved_at\",)]\nprint(f\"fields that must never enter the dedup key      : {volatile}\")\ncounts = {}\nfor r in all_rows:\n    counts[r[\"trade_id\"]] = counts.get(r[\"trade_id\"], 0) + 1\nprint(\"arrivals per trade_id                           :\", dict(sorted(counts.items())))\n",
            "output": "rows fetched across the two overlapping windows : 12\ndedup by hash of the whole row                  : 12 rows kept\ndedup by the stable natural key (trade_id)      : 9 rows kept\ntrade 4 after key dedup: px=100.1  (the correction survived)\nfields that must never enter the dedup key      : ['retrieved_at']\narrivals per trade_id                           : {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1, 8: 1, 9: 1}"
          }
        },
        {
          "name": "Land the raw bytes immutably; decide what they mean at read time",
          "explain": "<p>The extraction contract that scales is deceptively narrow: write the bytes exactly as they arrived, hash them so a later re-read can prove nothing changed, and defer every decision about what those bytes mean to the moment something actually reads them. The snippet lands three small JSON payloads as separate, write-once files with a sha256 recorded for each, then re-reads them and confirms the bytes it gets back are bit-for-bit identical to what was written.</p><p>The payoff shows up when the first parser turns out to be wrong. A naive reader that calls int() on a thousands-separated share count and float() on an empty string throws on every row it cannot coerce and quietly parses 0 of 3 records; a second, fixed reader -- stripping the separator, treating a blank string as missing -- parses all three from the identical bytes on disk, recovering a total of 1,793,750 shares that the first version simply lost. Nothing was re-fetched from the vendor between the two attempts; the fix lived entirely in the parsing code.</p><p>This is why a landing zone is written once and never edited or re-derived in place: it is the one artifact in the pipeline that a parsing bug can never corrupt, because parsing happens strictly downstream of it. Interpretation is cheap to redo; extraction, if the vendor's window has closed, may not be possible to redo at all.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\nimport os\nimport tempfile\n\n# The extraction contract: land the bytes exactly as they arrived, hash them,\n# and do ALL interpretation later. Parsing is a read-time decision.\nRAW = [\n    b'{\"sym\":\"AAA\",\"asof\":\"2026-06-30\",\"eps\":\"1.42\",\"shares\":\"1,204,000\"}',\n    b'{\"sym\":\"BBB\",\"asof\":\"2026-06-30\",\"eps\":\"-0.07\",\"shares\":\"88,500\"}',\n    b'{\"sym\":\"CCC\",\"asof\":\"2026-06-30\",\"eps\":\"\",\"shares\":\"501,250\"}',\n]\n\n\ndef parse_v1(blob):\n    \"\"\"First parser: naive. int() on a thousands-separated string, float('') dies.\"\"\"\n    d = json.loads(blob)\n    try:\n        shares = int(d[\"shares\"])\n    except ValueError:\n        shares = None\n    try:\n        eps = float(d[\"eps\"])\n    except ValueError:\n        eps = None\n    return {\"sym\": d[\"sym\"], \"eps\": eps, \"shares\": shares}\n\n\ndef parse_v2(blob):\n    \"\"\"Second parser: same raw bytes, fixed reader. Nothing was re-fetched.\"\"\"\n    d = json.loads(blob)\n    shares = int(d[\"shares\"].replace(\",\", \"\")) if d[\"shares\"] else None\n    eps = float(d[\"eps\"]) if d[\"eps\"].strip() else None\n    return {\"sym\": d[\"sym\"], \"eps\": eps, \"shares\": shares}\n\n\nwith tempfile.TemporaryDirectory() as landing:\n    manifest = []\n    for i, blob in enumerate(RAW):\n        path = os.path.join(landing, f\"part-{i:03d}.json\")\n        with open(path, \"wb\") as fh:\n            fh.write(blob)\n        manifest.append({\"file\": os.path.basename(path), \"bytes\": len(blob),\n                         \"sha256\": hashlib.sha256(blob).hexdigest()[:12]})\n    print(\"landing zone manifest (immutable, write-once):\")\n    for m in manifest:\n        print(f\"  {m['file']}  {m['bytes']:>3}B  sha256={m['sha256']}\")\n\n    on_disk = sorted(os.listdir(landing))\n    raw_again = [open(os.path.join(landing, f), \"rb\").read() for f in on_disk]\n    print(\"re-read bytes identical to what landed          :\", raw_again == RAW)\n\n    print(\"\\nschema-on-read, same bytes, two parser versions:\")\n    for name, fn in ((\"v1\", parse_v1), (\"v2\", parse_v2)):\n        rows = [fn(b) for b in raw_again]\n        good = sum(1 for r in rows if r[\"shares\"] is not None)\n        total = sum(r[\"shares\"] for r in rows if r[\"shares\"] is not None)\n        print(f\"  {name}: {good}/3 share counts parsed, total {total:,}\")\n    print(\"\\nfixing the reader required zero re-extraction; that is the whole point\")\n",
            "output": "landing zone manifest (immutable, write-once):\n  part-000.json   67B  sha256=f63d25d67d05\n  part-001.json   65B  sha256=f56bb892305f\n  part-002.json   61B  sha256=b24dbebb4035\nre-read bytes identical to what landed          : True\n\nschema-on-read, same bytes, two parser versions:\n  v1: 0/3 share counts parsed, total 0\n  v2: 3/3 share counts parsed, total 1,793,750\n\nfixing the reader required zero re-extraction; that is the whole point"
          }
        }
      ],
      "widget": {
        "type": "curve",
        "title": "Three backoff policies, same failure pattern",
        "params": {
          "series": [
            {
              "name": "fixed",
              "x": [
                1,
                2,
                3,
                4
              ],
              "y": [
                0.5,
                0.5,
                0.5,
                0.5
              ]
            },
            {
              "name": "exponential",
              "x": [
                1,
                2,
                3,
                4
              ],
              "y": [
                0.5,
                1.0,
                2.0,
                4.0
              ]
            },
            {
              "name": "jittered (one draw)",
              "x": [
                1,
                2,
                3,
                4
              ],
              "y": [
                0.016,
                0.869,
                1.862,
                1.107
              ]
            }
          ],
          "xlab": "failed attempt",
          "ylab": "wait before retry (s)"
        }
      },
      "pitfalls": [
        "Paginating a live table by offset and treating the resulting duplicate or missing row as a flaky vendor rather than a consequence of rows shifting under the query between pages.",
        "Running exponential backoff with no jitter across a fleet of clients that all fail at once, so every client computes the same wait and retries in a synchronized storm.",
        "Hashing an entire row for deduplication, so a legitimate vendor correction is kept as a second row instead of overwriting the first.",
        "Editing or re-writing a landing-zone file in place to 'fix' a value, which erases the one copy of the data a parsing bug can always be re-run against."
      ],
      "check": [
        {
          "q": "A vendor feed is paginated by offset, and a row is deleted from the front of the table while a pull is in progress. What happens to the pull?",
          "options": [
            "Nothing; offsets are absolute row numbers",
            "One row is silently skipped, because every later page shifted back by one",
            "The pull raises an exception",
            "Cursor and offset pagination behave identically here"
          ],
          "answer": 1,
          "why": "Offset pagination asks for 'rows N through M of the current result', and deleting a row at the front shifts every later row's position back by one, so whichever row now sits at the boundary between two already-fetched pages is never returned. A cursor anchored on the last key seen is unaffected, because 'greater than key K' does not depend on how many rows currently sit before K."
        },
        {
          "q": "Ten clients all fail against a rate-limited endpoint at the same moment. Which retry policy is most likely to make the outage worse?",
          "options": [
            "Full jitter",
            "Pure exponential backoff with no jitter",
            "Fixed backoff with a very short interval and no cap",
            "Any policy that includes a maximum retry count"
          ],
          "answer": 1,
          "why": "Without jitter, every client that failed on the same attempt number computes an identical delay from the same deterministic formula and therefore retries at the same instant, converting one transient failure into a synchronized retry storm against a server that was already struggling. Jitter spreads that same fleet across many different schedules."
        },
        {
          "q": "A trade record's dedup key should be built from:",
          "options": [
            "A hash of the entire row, including transport metadata like when it was fetched",
            "Only fields that describe the trade itself, never fields that describe the fetch",
            "The order the rows arrived in",
            "The size of the file the row came from"
          ],
          "answer": 1,
          "why": "A field like retrieved_at changes on every re-pull whether or not the underlying trade changed, so including it in the key -- or hashing the whole row -- makes every re-fetch look like a new record. A stable key like trade_id lets a genuine correction overwrite the old value instead of duplicating it."
        }
      ]
    },
    {
      "n": 2,
      "title": "Storage: rows, columns, and what a query actually has to read",
      "topics": [
        "row-oriented vs column-oriented storage",
        "CSV's type ambiguity",
        "columnar compression (parquet)",
        "row-group statistics and sort-order pruning"
      ],
      "concepts": [
        {
          "name": "Row storage and column storage are optimized for different queries, not for different data",
          "explain": "<p>The same 5,000-row, twelve-column table can be laid out two ways: as a list of complete records (row-oriented) or as twelve separate arrays, one per field (column-oriented). Which layout is \"faster\" depends entirely on what the query touches. Summing one column, px, over every row forces a row store to materialize all twelve fields of every record just to reach the one it needs -- 60,000 individual field reads for 5,000 rows -- while a column store reads exactly the 5,000 values of that one array and nothing else, a 12x difference in this snippet, and both arrive at the identical total.</p><p>The second query reverses the advantage: fetching one full record by its row number is the row store's home turf, one contiguous read of twelve fields, while a column store must perform twelve separate seeks, one into each of the twelve column arrays, to reassemble that same record.</p><p>This is the entire reason both layouts exist in production: a research pipeline that scans a handful of columns over millions of rows -- almost every backtest -- wants columnar storage, while an order-management system that reads and writes one whole record at a time per event wants row storage. Neither orientation is a universal upgrade over the other; picking one is picking which of these two queries you are willing to make expensive.</p>",
          "formula": "\\text{values touched (row)} = n_{rows} \\times n_{cols}, \\qquad \\text{values touched (col)} = n_{rows}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# One synthetic TAQ-shaped table, twelve columns, stored two ways.\nrng = np.random.default_rng(32800)\nNROWS, COLS = 5000, [\"ts\", \"sym\", \"px\", \"size\", \"bid\", \"ask\", \"bsz\", \"asz\",\n                     \"venue\", \"cond\", \"seq\", \"flag\"]\n\ncol_store = {c: rng.integers(0, 1000, NROWS) for c in COLS}          # dict of arrays\nrow_store = [{c: col_store[c][i] for c in COLS} for i in range(NROWS)]  # list of dicts\n\n\nclass Counter:\n    \"\"\"Counts every individual FIELD VALUE an engine has to touch.\"\"\"\n    def __init__(self):\n        self.n = 0\n\n    def touch(self, k=1):\n        self.n += k\n        return k\n\n\n# Query A: sum one column over the whole table.\ncr, cc = Counter(), Counter()\ntot_row = 0\nfor r in row_store:\n    cr.touch(len(COLS))              # a row-store read materialises the whole record\n    tot_row += r[\"px\"]\ncc.touch(NROWS)                      # a column store reads exactly one column\ntot_col = int(col_store[\"px\"].sum())\nprint(f\"query A  sum(px) over {NROWS} rows\")\nprint(f\"  row-oriented values touched   : {cr.n:>7}\")\nprint(f\"  column-oriented values touched: {cc.n:>7}\")\nprint(f\"  ratio                         : {cr.n / cc.n:>7.1f}x\")\nprint(f\"  same answer                   : {tot_row == tot_col}\")\n\n# Query B: fetch one whole record by position -- the row store's home turf.\ncr2, cc2 = Counter(), Counter()\ncr2.touch(len(COLS))\ncc2.touch(len(COLS))                 # one seek per column: 12 separate lookups\nprint(f\"\\nquery B  fetch row 1234 in full\")\nprint(f\"  row-oriented values touched   : {cr2.n:>7}  (1 contiguous read)\")\nprint(f\"  column-oriented values touched: {cc2.n:>7}  ({len(COLS)} separate reads)\")\nprint(\"\\norientation is not better or worse; it decides which query is cheap\")\n",
            "output": "query A  sum(px) over 5000 rows\n  row-oriented values touched   :   60000\n  column-oriented values touched:    5000\n  ratio                         :    12.0x\n  same answer                   : True\n\nquery B  fetch row 1234 in full\n  row-oriented values touched   :      12  (1 contiguous read)\n  column-oriented values touched:      12  (12 separate reads)\n\norientation is not better or worse; it decides which query is cheap"
          }
        },
        {
          "name": "CSV cannot carry a type, and four kinds of bugs follow from that",
          "explain": "<p>A CSV file has exactly one native type: text. Every value -- an identifier, a return, a share count, a boolean flag -- is written and read back as a string, and it is entirely up to the reader to guess what it was supposed to be. The snippet writes and re-reads a small CRSP-shaped batch and finds four concrete breakages that follow directly from that. A permno like \"093436\" round-trips as the string it was written as; call int() on it and the leading zero -- part of the identifier -- is gone forever. A volume column sorts correctly as numbers but sorts as \"100\" less than \"1000\" less than \"9\" when compared as text, because CSV gives no signal to know which comparison was intended. A genuinely missing return comes back as an empty string, indistinguishable from a value that really is zero. And Python's bool('False') evaluates to True, because any non-empty string is truthy, so a delisted flag written as the text 'False' reads back as delisted.</p><p>None of these are edge cases; they are what CSV does on ordinary data every time. The fix is not a smarter CSV reader -- it is declaring an explicit schema at the read boundary, converting each column exactly once, on purpose, before anything downstream ever sees the column as a string.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport csv\nimport io\n\n# A CRSP-shaped row with the four things CSV cannot carry: a leading-zero\n# identifier, a genuine missing value, a boolean, and a big integer.\nrows = [\n    {\"permno\": \"010145\", \"date\": \"2026-06-30\", \"ret\": 0.0134, \"vol\": 9, \"delisted\": False},\n    {\"permno\": \"093436\", \"date\": \"2026-06-30\", \"ret\": None, \"vol\": 100, \"delisted\": False},\n    {\"permno\": \"014593\", \"date\": \"2026-06-30\", \"ret\": -0.0072, \"vol\": 1000, \"delisted\": True},\n]\n\nbuf = io.StringIO()\nw = csv.DictWriter(buf, fieldnames=list(rows[0]))\nw.writeheader()\nfor r in rows:\n    w.writerow(r)\ntext = buf.getvalue()\nprint(\"the CSV as written:\")\nprint(\"  \" + \"\\n  \".join(text.strip().split(\"\\n\")))\n\nback = list(csv.DictReader(io.StringIO(text)))\nprint(\"\\nwhat comes back, and what type it is:\")\nfor k in rows[0]:\n    got = back[1][k]\n    print(f\"  {k:<9} {got!r:<14} {type(got).__name__}\")\n\nprint(\"\\nfour concrete breakages:\")\n# 1. numeric-looking identifier\nprint(f\"  1 int(permno)            -> {int(back[0]['permno'])}  (the leading zero is gone forever)\")\n# 2. sorting strings that look like numbers\nvols = [r[\"vol\"] for r in back]\nprint(f\"  2 sorted as text         -> {sorted(vols)}\")\nprint(f\"    sorted as numbers      -> {sorted(int(v) for v in vols)}\")\n# 3. missing vs empty\nprint(f\"  3 ret for permno 093436  -> {back[1]['ret']!r}  is it NULL, or zero, or 'not reported'?\")\n# 4. bool('False')\nprint(f\"  4 bool('False')          -> {bool(back[0]['delisted'])}  every row now reads as delisted\")\n\ntyped = [{\"permno\": r[\"permno\"],\n          \"ret\": float(r[\"ret\"]) if r[\"ret\"] != \"\" else None,\n          \"vol\": int(r[\"vol\"]),\n          \"delisted\": r[\"delisted\"] == \"True\"} for r in back]\nprint(f\"\\nwith an explicit schema at the boundary: delisted flags = \"\n      f\"{[t['delisted'] for t in typed]}, mean ret over non-null = \"\n      f\"{np.mean([t['ret'] for t in typed if t['ret'] is not None]):.4f}\")\n",
            "output": "the CSV as written:\n  permno,date,ret,vol,delisted\n  010145,2026-06-30,0.0134,9,False\n  093436,2026-06-30,,100,False\n  014593,2026-06-30,-0.0072,1000,True\n\nwhat comes back, and what type it is:\n  permno    '093436'       str\n  date      '2026-06-30'   str\n  ret       ''             str\n  vol       '100'          str\n  delisted  'False'        str\n\nfour concrete breakages:\n  1 int(permno)            -> 10145  (the leading zero is gone forever)\n  2 sorted as text         -> ['100', '1000', '9']\n    sorted as numbers      -> [9, 100, 1000]\n  3 ret for permno 093436  -> ''  is it NULL, or zero, or 'not reported'?\n  4 bool('False')          -> True  every row now reads as delisted\n\nwith an explicit schema at the boundary: delisted flags = [False, False, True], mean ret over non-null = 0.0031"
          }
        },
        {
          "name": "Columnar compression turns 'the file is smaller' into 'the query reads less'",
          "explain": "<p>Parquet is column-oriented on disk in addition to in memory, and that lets it apply two independent tricks a row-oriented CSV cannot: per-column compression, and reading only the columns a query names. The snippet writes the identical 200,000-row, six-column order-book-shaped table four ways and measures the bytes each one actually costs. Uncompressed parquet already beats CSV by storing typed binary values instead of printed text (3.2x smaller); adding snappy compression on top reaches 3.8x, and zstd -- slower to write, but the smallest here -- reaches 4.3x.</p><p>The bytes-on-disk number is not the interesting one, though. Parquet's per-column, per-row-group metadata means a query that only needs two of the six columns, px and qty, never has to touch the other four at all: in this file, reading just those two columns transfers 28.9% of the stored bytes. A CSV reader has no such option -- every row is one line of text, and parsing any one field means parsing the whole line, so a CSV scan always reads and re-parses 100% of the file no matter how narrow the query is. Column projection, not just compression, is why a research pipeline reading a handful of fields out of a wide table should default to parquet.</p>",
          "formula": "\\text{bytes read} = \\sum_{c\\,\\in\\,\\text{selected columns}} \\text{bytes}(c)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport os\nimport tempfile\n\nimport pyarrow as pa\nimport pyarrow.csv as pacsv\nimport pyarrow.parquet as pq\n\n# One synthetic order-book-shaped dataset. Deterministic; no vendor data.\nrng = np.random.default_rng(32800)\nN = 200_000\nsym = np.array([\"ESZ6\", \"NQZ6\", \"CLX6\", \"GCZ6\"])[rng.integers(0, 4, N)]   # low cardinality\nside = np.array([\"B\", \"S\"])[rng.integers(0, 2, N)]\ntbl = pa.table({\n    \"ts_ns\": np.arange(N, dtype=\"int64\") * 1_000_000 + 1_600_000_000_000_000_000,\n    \"sym\": pa.array(sym).dictionary_encode(),\n    \"side\": pa.array(side).dictionary_encode(),\n    \"px\": np.round(4500.0 + np.cumsum(rng.normal(0, 0.25, N)), 2),\n    \"qty\": rng.integers(1, 50, N).astype(\"int32\"),\n    \"level\": rng.integers(0, 10, N).astype(\"int8\"),\n})\n\nwith tempfile.TemporaryDirectory() as d:\n    csv_path = os.path.join(d, \"book.csv\")\n    pq_snappy = os.path.join(d, \"book.snappy.parquet\")\n    pq_zstd = os.path.join(d, \"book.zstd.parquet\")\n    pq_none = os.path.join(d, \"book.raw.parquet\")\n\n    pacsv.write_csv(tbl, csv_path)\n    pq.write_table(tbl, pq_snappy, compression=\"snappy\")\n    pq.write_table(tbl, pq_zstd, compression=\"zstd\")\n    pq.write_table(tbl, pq_none, compression=\"none\")\n\n    sizes = {name: os.path.getsize(p) for name, p in\n             ((\"csv\", csv_path), (\"parquet, uncompressed\", pq_none),\n              (\"parquet, snappy\", pq_snappy), (\"parquet, zstd\", pq_zstd))}\n    base = sizes[\"csv\"]\n    print(f\"{N:,} rows x {tbl.num_columns} columns\")\n    print(f\"{'format':<24}{'bytes':>12}{'bytes/row':>11}{'vs CSV':>9}\")\n    for name, b in sizes.items():\n        print(f\"{name:<24}{b:>12,}{b / N:>11.2f}{base / b:>8.1f}x\")\n\n    def bucket(r):\n        for lo, hi in ((1, 2), (2, 4), (4, 8), (8, 16)):\n            if lo <= r < hi:\n                return f\"the {lo}-{hi}x smaller bucket\"\n        return \"over 16x smaller\" if r >= 16 else \"no smaller\"\n\n    r = base / sizes[\"parquet, zstd\"]\n    print(f\"\\nzstd parquet lands in {bucket(r)} (ratio {r:.1f}x)\")\n\n    # And the part that matters more than the file size: what a query must read.\n    pf = pq.ParquetFile(pq_zstd)\n    md = pf.metadata\n    per_col = {}\n    for rg in range(md.num_row_groups):\n        for c in range(md.num_columns):\n            cc = md.row_group(rg).column(c)\n            per_col[cc.path_in_schema] = per_col.get(cc.path_in_schema, 0) + cc.total_compressed_size\n    total = sum(per_col.values())\n    print(f\"\\ncolumn projection: reading only px+qty touches \"\n          f\"{(per_col['px'] + per_col['qty']) / total:.1%} of the stored bytes; \"\n          f\"a CSV reader must parse 100%\")\n",
            "output": "200,000 rows x 6 columns\nformat                         bytes  bytes/row   vs CSV\ncsv                        8,739,960      43.70     1.0x\nparquet, uncompressed      2,737,194      13.69     3.2x\nparquet, snappy            2,275,383      11.38     3.8x\nparquet, zstd              2,009,544      10.05     4.3x\n\nzstd parquet lands in the 4-8x smaller bucket (ratio 4.3x)\n\ncolumn projection: reading only px+qty touches 28.9% of the stored bytes; a CSV reader must parse 100%"
          }
        },
        {
          "name": "Parquet's row-group statistics only prune when the data is sorted on the filter column",
          "explain": "<p>Parquet stores a per-row-group min/max for every column, and a query engine can skip an entire row group without opening it if the filter's range cannot possibly overlap that group's min/max. Whether that skipping actually happens depends entirely on how the data was written, not on the query. The snippet writes the identical 120,000-row time series two ways: once with rows in timestamp order, and once with the same rows randomly shuffled, both in row groups of 10,000.</p><p>Filtering a 1,000-row window out of the sorted file touches exactly one of twelve row groups -- the one whose min/max happens to bracket the requested range -- reading 10,000 rows to keep 1,001 of them, a 10x wasted-read factor that is mostly the unavoidable cost of a row-group granularity coarser than the filter. The identical filter on the shuffled file cannot rule out any row group at all, because every group's min/max spans nearly the whole table once the sort order is destroyed, so all twelve groups are scanned: 120,000 rows read to keep the same 1,001, a 119.9x wasted-read factor -- roughly twelve times worse, one factor for each row group that pruning failed to eliminate.</p><p>The statistics themselves never change between the two files; only the clustering does. Sorting a table on ingest by the column its queries actually filter on is therefore not a cosmetic choice -- it is the entire mechanism that makes row-group pruning do anything at all.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport os\nimport tempfile\n\nimport pyarrow as pa\nimport pyarrow.parquet as pq\n\n# 120,000 rows of a Globex-shaped tape, written in row groups of 10,000.\nrng = np.random.default_rng(7)\nN, RG = 120_000, 10_000\nts = np.arange(N, dtype=\"int64\")                       # monotone: sorted on the filter key\ntbl = pa.table({\"ts\": ts,\n                \"px\": np.round(4500 + np.cumsum(rng.normal(0, 0.2, N)), 2),\n                \"qty\": rng.integers(1, 40, N).astype(\"int32\")})\n\n# The same data with the filter key shuffled: same bytes, useless statistics.\nperm = rng.permutation(N)\nshuffled = tbl.take(perm)\n\nwith tempfile.TemporaryDirectory() as d:\n    for name, t in ((\"sorted\", tbl), (\"shuffled\", shuffled)):\n        path = os.path.join(d, f\"{name}.parquet\")\n        pq.write_table(t, path, row_group_size=RG, compression=\"zstd\")\n        pf = pq.ParquetFile(path)\n        md = pf.metadata\n        lo, hi = 45_000, 46_000                        # a 1,000-row window, 0.83% of the table\n        hit = 0\n        for rg in range(md.num_row_groups):\n            st = md.row_group(rg).column(0).statistics   # ts is column 0\n            if st.max >= lo and st.min <= hi:\n                hit += 1\n        rows_scanned = hit * RG\n        kept = len(t.filter((pa.compute.field(\"ts\") >= lo) & (pa.compute.field(\"ts\") <= hi)))\n        print(f\"{name:<9} row groups {md.num_row_groups:>3}  \"\n              f\"groups that can hold ts in [{lo},{hi}]: {hit:>3}  \"\n              f\"rows scanned {rows_scanned:>7,}  rows kept {kept:>5,}  \"\n              f\"wasted-read factor {rows_scanned / max(kept, 1):>6.1f}x\")\n\nprint(\"\\nparquet statistics are min/max per row group; they only prune when the\")\nprint(\"data is CLUSTERED on the column you filter. Sorting on ingest is the whole trick.\")\n",
            "output": "sorted    row groups  12  groups that can hold ts in [45000,46000]:   1  rows scanned  10,000  rows kept 1,001  wasted-read factor   10.0x\nshuffled  row groups  12  groups that can hold ts in [45000,46000]:  12  rows scanned 120,000  rows kept 1,001  wasted-read factor  119.9x\n\nparquet statistics are min/max per row group; they only prune when the\ndata is CLUSTERED on the column you filter. Sorting on ingest is the whole trick."
          }
        }
      ],
      "widget": null,
      "pitfalls": [
        "Assuming column-oriented storage is a universal upgrade over row-oriented storage, when a workload that reads or writes whole records at a time is exactly the case row storage is built for.",
        "Reading a CSV without declaring types at the boundary, so a leading-zero identifier, a missing value, and a boolean all get silently mangled the same way.",
        "Choosing a compression codec for its ratio alone and ignoring that a query engine's row-group pruning depends on sort order, not on the codec, to skip any bytes at all.",
        "Loading a table without sorting it on the column research queries actually filter on, so parquet's row-group statistics never get the chance to prune anything."
      ],
      "check": [
        {
          "q": "A research pipeline scans two columns out of sixty over 50 million rows for every backtest, and separately an OMS reads and writes one whole order record per event. Which storage orientation fits which workload?",
          "options": [
            "Row storage for both, because it is simpler",
            "Column storage for the backtest scan, row storage for the OMS's per-record reads and writes",
            "Column storage for both, because columnar formats are always faster",
            "It does not matter, since both eventually touch the same bytes"
          ],
          "answer": 1,
          "why": "Column storage reads only the columns a query names, which is exactly what the narrow, wide-table backtest scan wants; row storage reads or writes one complete record per access, which is exactly what the OMS's per-event pattern wants. The two orientations are optimized for opposite access patterns, not ranked best-to-worst."
        },
        {
          "q": "A CSV column of boolean flags is written as the strings 'True' and 'False'. Reading it back with Python's bool() on each string will:",
          "options": [
            "Correctly recover True and False",
            "Return True for every non-empty string, including the literal text 'False'",
            "Raise a TypeError",
            "Only fail on the 'False' rows"
          ],
          "answer": 1,
          "why": "Python's bool() on a string returns True for any non-empty string, and 'False' is four non-empty characters -- so every row, including the ones meant to be False, evaluates to True. CSV never carried a boolean type in the first place; the fix is an explicit schema at the read boundary, not a smarter bool() call."
        },
        {
          "q": "Reading only two columns out of a six-column parquet file transfers a small fraction of the file's bytes. The equivalent CSV reader:",
          "options": [
            "Also transfers a small fraction, since CSV compresses columns independently",
            "Must read and parse essentially the whole file, because every row is one line of undifferentiated text",
            "Transfers zero bytes if the columns are listed first",
            "Depends on which compression codec the CSV uses"
          ],
          "answer": 1,
          "why": "Parquet's columnar layout lets an engine fetch only the byte ranges belonging to the requested columns. CSV has no per-column structure at all -- a row is a single line -- so a reader must parse the entire line, and therefore the entire file, regardless of how few columns the query actually needs."
        },
        {
          "q": "A time series is written to parquet in row groups after being randomly shuffled. Filtering for a narrow range of the timestamp column will:",
          "options": [
            "Prune most row groups, since parquet always tracks per-column statistics",
            "Scan nearly every row group, because a shuffled table's row groups each span almost the full range of the filter column",
            "Fail with an error, since parquet requires sorted input",
            "Run exactly as fast as on the sorted version, since statistics do not depend on order"
          ],
          "answer": 1,
          "why": "Parquet's row-group statistics are a min/max, and pruning only works when a group's min/max cannot possibly contain the filter's range. Shuffling destroys that clustering: every group's min/max ends up close to the whole table's, so almost none can be ruled out, and the engine ends up scanning nearly everything despite the statistics existing."
        }
      ]
    },
    {
      "n": 3,
      "title": "Point-in-time correctness: what you knew, and when you knew it",
      "topics": [
        "as-of joins vs latest-value joins",
        "as-of vs nearest joins on trade/quote data",
        "restatements and lookahead in earnings surprises",
        "bitemporal tables: event time vs knowledge time"
      ],
      "concepts": [
        {
          "name": "A latest-value join answers the wrong question; an as-of join answers the right one",
          "explain": "<p>Fundamentals data gets restated: a company's Q3 book equity as first reported in October can be revised months later, in January, and a naive join that always attaches \"the latest period, latest vintage\" fundamentals row to a price ignores which of those vintages had actually been published on the trade date. The snippet joins three trade dates to a fundamentals table containing one restatement and compares that naive join to a correct as-of join, which restricts to rows already announced by the trade date and only then takes the most recent period and vintage among those.</p><p>Two of the three trade dates in the snippet -- August 15 and November 15, both before the January restatement -- get a book-to-market ratio from the naive join that used a number first published on January 20, months after the trade happened; the resulting signal errors, -0.0347 and -0.0463, are exactly the size of the restatement itself, because that is precisely what the naive join leaked. Only the February trade date, which really did occur after the restatement was public, agrees between the two joins.</p><p>The pattern generalizes badly: a naive join's lookahead is largest exactly where the news was largest, which means it silently overstates a signal's backtested performance most on the very dates a real trader would have found the number most informative and least available.</p>",
          "formula": "\\text{as-of: } \\max\\{\\, f : \\text{announce\\_date}(f) \\le \\text{trade\\_date} \\,\\}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Synthetic, fixed, Compustat-shaped fundamentals: one original filing per\n# quarter plus ONE restatement that cut Q3 book equity, published in January.\n#           gvkey, period_end,   announce_date, book_equity\nFUNDA = [(\"AAA\", \"2026-03-31\", \"2026-04-28\", 1000.0),\n         (\"AAA\", \"2026-06-30\", \"2026-07-29\", 1080.0),\n         (\"AAA\", \"2026-09-30\", \"2026-10-28\", 1120.0),   # as first reported\n         (\"AAA\", \"2026-09-30\", \"2027-01-20\",  930.0)]   # restated, 3 months later\nPRICES = [(\"AAA\", \"2026-08-15\", 4320.0),\n          (\"AAA\", \"2026-11-15\", 4100.0),\n          (\"AAA\", \"2027-02-15\", 3950.0)]\n\ncx = sqlite3.connect(\":memory:\")\ncx.executescript(\"CREATE TABLE funda(gvkey TEXT, period_end TEXT, announce_date TEXT, be REAL);\"\n                 \"CREATE TABLE prices(gvkey TEXT, trade_date TEXT, mktcap REAL);\")\ncx.executemany(\"INSERT INTO funda VALUES (?,?,?,?)\", FUNDA)\ncx.executemany(\"INSERT INTO prices VALUES (?,?,?)\", PRICES)\n\n# NAIVE: join each price to \"the\" fundamentals row -- latest period, latest vintage,\n# with no reference at all to what was public on the trade date.\nNAIVE = \"\"\"\nSELECT p.trade_date, f.period_end, f.announce_date, f.be, f.be / p.mktcap\nFROM prices p JOIN funda f ON f.gvkey = p.gvkey\nWHERE f.rowid = (SELECT rowid FROM funda WHERE gvkey = p.gvkey\n                 ORDER BY period_end DESC, announce_date DESC LIMIT 1)\nORDER BY p.trade_date\"\"\"\n\n# AS-OF: restrict to vintages already announced, then take the latest PERIOD\n# among them, then the latest VINTAGE of that period. Both steps are needed.\nASOF = \"\"\"\nSELECT p.trade_date, f.period_end, f.announce_date, f.be, f.be / p.mktcap\nFROM prices p JOIN funda f ON f.gvkey = p.gvkey\nWHERE f.announce_date <= p.trade_date\n  AND f.rowid = (SELECT rowid FROM funda\n                 WHERE gvkey = p.gvkey AND announce_date <= p.trade_date\n                 ORDER BY period_end DESC, announce_date DESC LIMIT 1)\nORDER BY p.trade_date\"\"\"\n\nnaive, asof = cx.execute(NAIVE).fetchall(), cx.execute(ASOF).fetchall()\nprint(\"           NAIVE latest-value join        CORRECT as-of join\")\nprint(\"trade_date period_end announce   B/M  |  period_end announce   B/M     error\")\nprint(\"-\" * 78)\nfor n, a in zip(naive, asof):\n    print(f\"{n[0]}  {n[1]}  {n[2][5:]}  {n[4]:.4f} |  \"\n          f\"{a[1]}  {a[2][5:]}  {a[4]:.4f}  {n[4] - a[4]:+.4f}\")\n\nprint(\"\\nwhat the naive join actually did:\")\nfor n, a in zip(naive, asof):\n    leak = \"used a number first published \" + n[2] if n[2] > n[0] else \"agrees\"\n    print(f\"  {n[0]}: {leak}\"\n          + (f\"  ({abs(n[4] - a[4]) / a[4]:.1%} signal error)\" if n[2] > n[0] else \"\"))\nprint(\"\\ntwo of the three rows are pure lookahead, and the leak is largest\")\nprint(\"exactly where the restatement was largest -- i.e. where the news was.\")\n",
            "output": "           NAIVE latest-value join        CORRECT as-of join\ntrade_date period_end announce   B/M  |  period_end announce   B/M     error\n------------------------------------------------------------------------------\n2026-08-15  2026-09-30  01-20  0.2153 |  2026-06-30  07-29  0.2500  -0.0347\n2026-11-15  2026-09-30  01-20  0.2268 |  2026-09-30  10-28  0.2732  -0.0463\n2027-02-15  2026-09-30  01-20  0.2354 |  2026-09-30  01-20  0.2354  +0.0000\n\nwhat the naive join actually did:\n  2026-08-15: used a number first published 2027-01-20  (13.9% signal error)\n  2026-11-15: used a number first published 2027-01-20  (17.0% signal error)\n  2027-02-15: agrees\n\ntwo of the three rows are pure lookahead, and the leak is largest\nexactly where the restatement was largest -- i.e. where the news was."
          }
        },
        {
          "name": "The nearest quote is not the right quote -- it can be from the future",
          "explain": "<p>Classifying a trade as buyer- or seller-initiated needs the quote that was live at the moment the trade printed, and there are two plausible-looking ways to find it: take the most recent quote at or before the trade (as-of, backward-looking), or take whichever quote is closest in time, forward or backward (nearest). The snippet runs both against the same five trades and finds that nearest, despite reading as a reasonable default, uses a quote from the future in three of the five cases -- a quote update that had not happened yet at the moment the trade occurred.</p><p>Two of those three future-peeking classifications actually flip the trade's sign relative to the correct backward-looking answer: a trade that a real market participant would have seen as a buy against the quote available at the time gets relabeled a sell once a later quote update is allowed to leak backward into the classification. A trade even one microsecond before a quote refresh is, under the nearest rule, classified by the update that came after it -- the one quote the trader provably could not have seen.</p><p>The as-of join also has to handle the other edge correctly: a trade before any quote exists must return null, not the first quote the code happens to find, because there genuinely was no quote yet to trade against.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport bisect\n\n# TAQ-shaped: a quote tape and a trade tape, microseconds since the open.\nQUOTES = [(1_000, 100.00, 100.02), (1_500, 100.01, 100.03), (2_400, 100.02, 100.04),\n          (3_100, 100.05, 100.07), (3_900, 100.04, 100.06), (5_000, 100.06, 100.08)]\nTRADES = [(1_400, 100.02), (2_400, 100.04), (3_050, 100.03), (3_899, 100.07), (4_800, 100.08)]\n\nqt = [q[0] for q in QUOTES]\n\n\ndef asof_backward(t):\n    \"\"\"Last quote at or before t. The only join a trade classifier may use.\"\"\"\n    i = bisect.bisect_right(qt, t) - 1\n    return None if i < 0 else QUOTES[i]\n\n\ndef nearest(t):\n    \"\"\"Nearest quote in either direction -- looks like a reasonable default. It isn't.\"\"\"\n    i = bisect.bisect_left(qt, t)\n    cands = [j for j in (i - 1, i) if 0 <= j < len(QUOTES)]\n    return QUOTES[min(cands, key=lambda j: abs(qt[j] - t))]\n\n\ndef classify(px, bid, ask):\n    mid = 0.5 * (bid + ask)\n    return \"BUY \" if px > mid else (\"SELL\" if px < mid else \"MID \")\n\n\nprint(\"  trade_us    px |  as-of (backward)        | nearest (peeks forward)\")\nprint(\"-\" * 76)\nflips = 0\nfor t, px in TRADES:\n    b = asof_backward(t)\n    n = nearest(t)\n    cb, cn = classify(px, b[1], b[2]), classify(px, n[1], n[2])\n    flips += cb != cn\n    print(f\"{t:>10} {px:6.2f} | q@{b[0]:<6} {b[1]:.2f}/{b[2]:.2f} {cb} | \"\n          f\"q@{n[0]:<6} {n[1]:.2f}/{n[2]:.2f} {cn}\"\n          + (\"   <-- used a quote from the FUTURE\" if n[0] > t else \"\"))\n\nprint(f\"\\nsign flips caused by the nearest-quote join: {flips} of {len(TRADES)} trades\")\nprint(\"a trade 1 microsecond before a quote update is classified by that update,\")\nprint(\"which is the one quote the trader provably could not have seen.\")\n\n# The other half of the contract: no quote at all before the first trade.\nprint(\"\\nedge case, a trade before the first quote:\", asof_backward(500))\nprint(\"an as-of join must return NULL there, not the first quote it can find.\")\n",
            "output": "  trade_us    px |  as-of (backward)        | nearest (peeks forward)\n----------------------------------------------------------------------------\n      1400 100.02 | q@1000   100.00/100.02 BUY  | q@1500   100.01/100.03 SELL   <-- used a quote from the FUTURE\n      2400 100.04 | q@2400   100.02/100.04 BUY  | q@2400   100.02/100.04 BUY\n      3050 100.03 | q@2400   100.02/100.04 MID  | q@3100   100.05/100.07 SELL   <-- used a quote from the FUTURE\n      3899 100.07 | q@3100   100.05/100.07 BUY  | q@3900   100.04/100.06 BUY    <-- used a quote from the FUTURE\n      4800 100.08 | q@3900   100.04/100.06 BUY  | q@5000   100.06/100.08 BUY    <-- used a quote from the FUTURE\n\nsign flips caused by the nearest-quote join: 2 of 5 trades\na trade 1 microsecond before a quote update is classified by that update,\nwhich is the one quote the trader provably could not have seen.\n\nedge case, a trade before the first quote: None\nan as-of join must return NULL there, not the first quote it can find."
          }
        },
        {
          "name": "A backtest on revised numbers trades a portfolio the as-reported tape never produced",
          "explain": "<p>Earnings numbers get revised after the fact, and a research process that always uses \"the latest\" figure for a historical date is quietly backtesting against information that did not exist on that date. The snippet compares an earnings-surprise signal computed from the as-reported figures against the identical signal computed from the same names' later-revised figures, for ten names in one quarter.</p><p>Six of the ten names were revised at all, and three of those revisions are large enough to flip the sign of the surprise itself -- a name that beat consensus as reported becomes a miss once revised, or the reverse. The rank correlation between the as-reported and as-revised surprise rankings is only 0.188, barely above independent, and the long-short spread the signal would have captured swings from 0.213 as reported to 1.106 as revised -- more than five times larger, entirely a function of which vintage of the data was used, not of anything a trader could have known in real time.</p><p>Most concretely: the top-three names a long-short strategy would select based on the as-reported numbers overlap with the top-three selected from the revised numbers in only one of three names. A backtest built on revised data is therefore not a slightly-noisier version of a real strategy's history; it is a simulation of a portfolio that the as-reported tape, the only tape that ever actually existed in real time, would never have constructed.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# Ten names, one quarter. Each has an AS-REPORTED earnings number and, for some,\n# a later revision. Deterministic: the revision pattern is fixed, not drawn.\nNAMES = [f\"N{i:02d}\" for i in range(10)]\nREPORTED = np.array([1.20, 0.85, 2.10, 0.45, 1.75, 0.95, 1.40, 0.30, 2.60, 1.05])\nREVISION = np.array([0.00, -0.30, 0.05, 0.60, 0.00, -0.55, 0.00, 0.40, -0.10, 0.00])\nREVISED = REPORTED + REVISION\nCONSENSUS = np.array([1.10, 1.00, 1.95, 0.50, 1.80, 1.05, 1.30, 0.35, 2.50, 1.10])\n\nsurprise_rep = (REPORTED - CONSENSUS) / np.abs(CONSENSUS)\nsurprise_rev = (REVISED - CONSENSUS) / np.abs(CONSENSUS)\n\n\ndef rank(x):\n    \"\"\"1 = biggest surprise. argsort of argsort, descending.\"\"\"\n    order = np.argsort(-x, kind=\"stable\")\n    r = np.empty_like(order)\n    r[order] = np.arange(1, len(x) + 1)\n    return r\n\n\nrk_rep, rk_rev = rank(surprise_rep), rank(surprise_rev)\nprint(f\"{'name':<6}{'reported':>9}{'revised':>9}{'surp_rep':>10}{'surp_rev':>10}\"\n      f\"{'rank_rep':>9}{'rank_rev':>9}{'sign flip':>10}\")\nflips = 0\nfor i, nm in enumerate(NAMES):\n    f = np.sign(surprise_rep[i]) != np.sign(surprise_rev[i])\n    flips += bool(f)\n    print(f\"{nm:<6}{REPORTED[i]:>9.2f}{REVISED[i]:>9.2f}{surprise_rep[i]:>10.3f}\"\n          f\"{surprise_rev[i]:>10.3f}{rk_rep[i]:>9}{rk_rev[i]:>9}{'YES' if f else '':>10}\")\n\nnames_rev = sum(REVISION != 0)\nprint(f\"\\nnames revised at all                : {names_rev} of {len(NAMES)}\")\nprint(f\"surprise sign flips                 : {flips}\")\nprint(f\"rank correlation of the two signals : \"\n      f\"{np.corrcoef(rk_rep, rk_rev)[0, 1]:.3f}\")\nprint(f\"long-short spread, as reported      : \"\n      f\"{surprise_rep[rk_rep <= 3].mean() - surprise_rep[rk_rep >= 8].mean():.3f}\")\nprint(f\"long-short spread, as revised       : \"\n      f\"{surprise_rev[rk_rev <= 3].mean() - surprise_rev[rk_rev >= 8].mean():.3f}\")\ntop_rep, top_rev = set(NAMES[i] for i in np.where(rk_rep <= 3)[0]), set(NAMES[i] for i in np.where(rk_rev <= 3)[0])\nprint(f\"top-3 basket, reported {sorted(top_rep)}  revised {sorted(top_rev)}\")\nprint(f\"overlap {len(top_rep & top_rev)}/3 -- a backtest on revised data traded a portfolio\")\nprint(\"that the as-reported tape would never have produced.\")\n",
            "output": "name   reported  revised  surp_rep  surp_rev rank_rep rank_rev sign flip\nN00        1.20     1.20     0.091     0.091        1        4\nN01        0.85     0.55    -0.150    -0.450       10        9\nN02        2.10     2.15     0.077     0.103        2        3\nN03        0.45     1.05    -0.100     1.100        8        1       YES\nN04        1.75     1.75    -0.028    -0.028        5        7\nN05        0.95     0.40    -0.095    -0.619        7       10\nN06        1.40     1.40     0.077     0.077        3        5\nN07        0.30     0.70    -0.143     1.000        9        2       YES\nN08        2.60     2.50     0.040     0.000        4        6       YES\nN09        1.05     1.05    -0.045    -0.045        6        8\n\nnames revised at all                : 6 of 10\nsurprise sign flips                 : 3\nrank correlation of the two signals : 0.188\nlong-short spread, as reported      : 0.213\nlong-short spread, as revised       : 1.106\ntop-3 basket, reported ['N00', 'N02', 'N06']  revised ['N02', 'N03', 'N07']\noverlap 1/3 -- a backtest on revised data traded a portfolio\nthat the as-reported tape would never have produced."
          }
        },
        {
          "name": "A bitemporal table needs two dates, not one, or it silently leaks the future",
          "explain": "<p>A fact about a company's fundamentals has at least three dates attached to it, and confusing any two of them is a bug: period_end is what the number is about, known_from is when the market could first see it, and known_to is when a later vintage superseded it. The snippet stores exactly these three dates and shows that the correct query for \"what did we know as of some past date\" needs both a period_end filter and a knowledge-time window -- known_from at or before the as-of date, and known_to strictly after it -- while a reporting query like \"what do we now believe about Q3\" filters on knowledge time differently, keeping only the currently valid vintage.</p><p>The classic bug is filtering on period_end alone and forgetting knowledge time entirely: the snippet's naive query for \"everything about periods on or before Q3\" returns four rows for what should be three facts, because one period appears twice -- once as originally reported, once as later restated -- and the restated row, known_from a date in 2027, is not actually public as of the query's implicit \"now.\"</p><p>An as-of predicate is therefore two inequalities against two different dates, not one filter against one date. Drop either inequality and the result either duplicates a fact across its vintages or admits a vintage that had not been published yet -- and both failure modes look, to a query that returns without error, like a perfectly plausible answer.</p>",
          "formula": "\\text{as-of}(t)\\ :\\ \\text{known\\_from} \\le t < \\text{known\\_to}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# A bitemporal fact table. THREE dates, and confusing any two is a bug:\n#   period_end     what the number is ABOUT      (event time)\n#   known_from     when we could first see it    (knowledge / valid time)\n#   known_to       when a newer vintage replaced it ('9999-12-31' = current)\nROWS = [\n    (\"AAA\", \"2026-06-30\", \"2026-07-29\", \"9999-12-31\", 1080.0),\n    (\"AAA\", \"2026-09-30\", \"2026-10-28\", \"2027-01-20\",  1120.0),\n    (\"AAA\", \"2026-09-30\", \"2027-01-20\", \"9999-12-31\",   930.0),\n    (\"BBB\", \"2026-09-30\", \"2026-11-04\", \"9999-12-31\",  2210.0),\n]\ncx = sqlite3.connect(\":memory:\")\ncx.execute(\"CREATE TABLE fact(id TEXT, period_end TEXT, known_from TEXT,\"\n           \" known_to TEXT, be REAL)\")\ncx.executemany(\"INSERT INTO fact VALUES (?,?,?,?,?)\", ROWS)\n\nQ = \"\"\"SELECT id, period_end, known_from, be FROM fact\n       WHERE period_end <= :period AND known_from <= :asof AND known_to > :asof\n       ORDER BY id, period_end\"\"\"\n\n\ndef snapshot(asof, period=\"9999-12-31\"):\n    return cx.execute(Q, {\"asof\": asof, \"period\": period}).fetchall()\n\n\nfor asof in (\"2026-08-01\", \"2026-11-15\", \"2027-02-01\"):\n    rows = snapshot(asof)\n    txt = \"  \".join(f\"{r[0]}/{r[1][5:]}={r[3]:.0f}\" for r in rows)\n    print(f\"world as known on {asof}: {txt}\")\n\nprint(\"\\nthe same physical table answers a reporting question too --\")\nprint(\"'what do we NOW believe about Q3', which is a different query:\")\nnow = cx.execute(\"\"\"SELECT id, period_end, be FROM fact\n                    WHERE period_end='2026-09-30' AND known_to='9999-12-31'\n                    ORDER BY id\"\"\").fetchall()\nprint(\"  \", now)\n\nprint(\"\\nand the classic bug: filtering on period_end but not on knowledge time\")\nbug = cx.execute(\"\"\"SELECT id, period_end, known_from, be FROM fact\n                    WHERE period_end <= '2026-09-30' ORDER BY id, known_from\"\"\").fetchall()\nprint(f\"   rows returned: {len(bug)} (one fact appears twice; one is not yet public)\")\nfor r in bug:\n    print(f\"     {r[0]} {r[1]} known_from {r[2]} be {r[3]:.0f}\"\n          + (\"   <-- from the future\" if r[2] > \"2026-11-15\" else \"\"))\nprint(\"\\nan as-of predicate is two inequalities, not one. Drop either and you get\")\nprint(\"duplicated rows or a lookahead, and both look like a plausible result.\")\n",
            "output": "world as known on 2026-08-01: AAA/06-30=1080\nworld as known on 2026-11-15: AAA/06-30=1080  AAA/09-30=1120  BBB/09-30=2210\nworld as known on 2027-02-01: AAA/06-30=1080  AAA/09-30=930  BBB/09-30=2210\n\nthe same physical table answers a reporting question too --\n'what do we NOW believe about Q3', which is a different query:\n   [('AAA', '2026-09-30', 930.0), ('BBB', '2026-09-30', 2210.0)]\n\nand the classic bug: filtering on period_end but not on knowledge time\n   rows returned: 4 (one fact appears twice; one is not yet public)\n     AAA 2026-06-30 known_from 2026-07-29 be 1080\n     AAA 2026-09-30 known_from 2026-10-28 be 1120\n     AAA 2026-09-30 known_from 2027-01-20 be 930   <-- from the future\n     BBB 2026-09-30 known_from 2026-11-04 be 2210\n\nan as-of predicate is two inequalities, not one. Drop either and you get\nduplicated rows or a lookahead, and both look like a plausible result."
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "The same fact, three vintages, three knowledge dates",
        "params": {
          "events": [
            {
              "t": "2026-07-29",
              "label": "AAA Q2 known_from",
              "note": "book equity 1080, still the current vintage"
            },
            {
              "t": "2026-10-28",
              "label": "AAA Q3 first vintage known_from",
              "note": "book equity 1120, as first reported"
            },
            {
              "t": "2026-11-04",
              "label": "BBB Q3 known_from",
              "note": "book equity 2210"
            },
            {
              "t": "2027-01-20",
              "label": "AAA Q3 restated known_from",
              "note": "book equity 930, supersedes the October vintage"
            }
          ]
        }
      },
      "pitfalls": [
        "Joining prices to 'the latest' fundamentals row without an announce-date filter, so a later restatement leaks backward into dates before it was ever public.",
        "Classifying a trade against the nearest quote in time rather than the most recent quote at or before the trade, letting a future quote update relabel a real-time decision.",
        "Backtesting a signal on revised or restated data because it is the only version still easy to query, without checking whether the rankings or the spread survive on the as-reported numbers.",
        "Filtering a bitemporal table on period_end alone, which either duplicates a fact across its vintages or admits one that was not yet public, depending on which vintage the query happens to pick."
      ],
      "check": [
        {
          "q": "A fundamentals number for Q3 is originally reported on Oct 28 and restated on Jan 20 the following year. A trade on Nov 15 should be joined to:",
          "options": [
            "The restated Jan 20 value, since it is more accurate",
            "The Oct 28 value, since that is what was public on Nov 15",
            "Whichever value the database happens to store as 'current'",
            "The average of the two"
          ],
          "answer": 1,
          "why": "An as-of join restricts to vintages already announced by the trade date. On Nov 15 the Jan 20 restatement did not exist yet, so using it is lookahead -- it leaks information from the future into a decision that, in reality, could only have used the Oct 28 figure."
        },
        {
          "q": "Classifying trades by the 'nearest' quote in time instead of the most recent quote at or before the trade will:",
          "options": [
            "Never change the classification, since nearby quotes rarely differ",
            "Occasionally classify a trade using a quote that had not happened yet at the time of the trade",
            "Only matter for trades exactly at a quote's timestamp",
            "Always agree with the as-of backward join"
          ],
          "answer": 1,
          "why": "'Nearest' looks in both directions in time, so a quote update that occurs shortly after a trade can be selected as its classifying quote even though the trader could not have seen it. In the snippet two of five trades flip sign entirely because of this."
        },
        {
          "q": "A backtest built on as-revised (rather than as-reported) earnings data will tend to:",
          "options": [
            "Understate the strategy's historical performance",
            "Overstate how tradeable the signal was, because it uses information not available on the historical trade date",
            "Have no effect, since revisions are usually small",
            "Only matter for names that were never revised"
          ],
          "answer": 1,
          "why": "Revised figures were not knowable on the historical date the backtest pretends to trade on. In the snippet the long-short spread more than quintuples between the as-reported and as-revised versions of the identical signal, and the two versions pick almost entirely different top-ranked names."
        },
        {
          "q": "A bitemporal fact table should be filtered for 'what we knew as of date T' using:",
          "options": [
            "period_end <= T only",
            "known_from <= T only",
            "Both a known_from <= T and a known_to > T condition, in addition to any period_end filter",
            "known_to <= T only"
          ],
          "answer": 2,
          "why": "known_from <= T selects vintages that had already been published by T, and known_to > T excludes any vintage that had already been superseded by an even later vintage before T. Either condition alone either admits an unpublished vintage or a stale, already-superseded one."
        }
      ]
    },
    {
      "n": 4,
      "title": "Orchestration: pipelines as dependency graphs",
      "topics": [
        "DAGs and topological sort",
        "inferring the graph from declared reads/writes",
        "fingerprinting and incremental rebuilds",
        "critical path and parallel scheduling"
      ],
      "concepts": [
        {
          "name": "Kahn's algorithm schedules a DAG -- and proves a cycle by getting stuck",
          "explain": "<p>A research pipeline's tasks -- pull data, clean it, join it, compute a signal, backtest it, report it -- form a directed graph where an edge means \"depends on,\" and a valid execution order exists if and only if that graph has no cycle. Kahn's algorithm finds one: repeatedly take any task whose dependencies have all already run (indegree zero), run it, and reduce the indegree of everything that depended on it. The snippet's twelve-task pipeline, with two diamonds where CRSP/Compustat rejoin at funda_join and trades/quotes rejoin at tca, produces a valid order in which every one of the graph's twelve edges is respected -- checked directly, not assumed, by confirming no dependency appears after the task that needs it.</p><p>Breaking the graph on purpose, by adding a feedback edge from report back into clean_crsp, shows what a cycle looks like mechanically rather than as an abstract warning: five of the twelve tasks -- everything caught in the loop -- never reach indegree zero, so Kahn's queue empties with them still unscheduled. This is not a special case the algorithm needs to detect separately; a cyclic graph rejects itself by construction, because something inside the cycle always still owes a dependency to something else inside it.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nfrom collections import deque\n\n# A research pipeline as a task DAG. Two diamonds: crsp/compustat rejoin at\n# `funda_join`, and taq/quotes rejoin at `tca`.\nDAG = {\n    \"pull_crsp\":     [],\n    \"pull_compustat\": [],\n    \"pull_taq\":      [],\n    \"clean_crsp\":    [\"pull_crsp\"],\n    \"clean_funda\":   [\"pull_compustat\"],\n    \"funda_join\":    [\"clean_crsp\", \"clean_funda\"],      # diamond 1 closes here\n    \"trades\":        [\"pull_taq\"],\n    \"quotes\":        [\"pull_taq\"],\n    \"tca\":           [\"trades\", \"quotes\"],               # diamond 2 closes here\n    \"signal\":        [\"funda_join\"],\n    \"backtest\":      [\"signal\", \"tca\"],\n    \"report\":        [\"backtest\"],\n}\n\n\ndef kahn(dag):\n    \"\"\"Returns (order, ok). ok=False means a cycle: some nodes never reached indegree 0.\"\"\"\n    indeg = {n: 0 for n in dag}\n    children = {n: [] for n in dag}\n    for n, ups in dag.items():\n        for u in ups:\n            if u not in dag:\n                raise KeyError(f\"task {n!r} depends on undeclared task {u!r}\")\n            indeg[n] += 1\n            children[u].append(n)\n    q = deque(sorted(n for n in dag if indeg[n] == 0))    # sorted => deterministic order\n    order = []\n    while q:\n        n = q.popleft()\n        order.append(n)\n        for c in sorted(children[n]):\n            indeg[c] -= 1\n            if indeg[c] == 0:\n                q.append(c)\n    return order, len(order) == len(dag)\n\n\norder, ok = kahn(DAG)\nprint(f\"tasks {len(DAG)}  edges {sum(len(v) for v in DAG.values())}  acyclic {ok}\")\nprint(\"execution order:\")\nfor i, n in enumerate(order, 1):\n    print(f\"  {i:>2}. {n}\")\n\n# Verify the order really respects every edge -- the only test that matters.\npos = {n: i for i, n in enumerate(order)}\nbad = [(u, n) for n, ups in DAG.items() for u in ups if pos[u] > pos[n]]\nprint(f\"edges violated by this order: {len(bad)}\")\n\n# Now break it on purpose: the report feeds back into cleaning.\nCYCLIC = dict(DAG)\nCYCLIC[\"clean_crsp\"] = CYCLIC[\"clean_crsp\"] + [\"report\"]\norder2, ok2 = kahn(CYCLIC)\nstuck = sorted(set(CYCLIC) - set(order2))\nprint(f\"\\nwith report -> clean_crsp added: acyclic {ok2}, \"\n      f\"{len(order2)}/{len(CYCLIC)} tasks schedulable\")\nprint(f\"tasks trapped in the cycle: {stuck}\")\nprint(\"Kahn's algorithm rejects by construction: a cyclic graph has no node\")\nprint(\"left at indegree zero, so the queue empties before the order is complete.\")\n",
            "output": "tasks 12  edges 12  acyclic True\nexecution order:\n   1. pull_compustat\n   2. pull_crsp\n   3. pull_taq\n   4. clean_funda\n   5. clean_crsp\n   6. quotes\n   7. trades\n   8. funda_join\n   9. tca\n  10. signal\n  11. backtest\n  12. report\nedges violated by this order: 0\n\nwith report -> clean_crsp added: acyclic False, 7/12 tasks schedulable\ntasks trapped in the cycle: ['backtest', 'clean_crsp', 'funda_join', 'report', 'signal']\nKahn's algorithm rejects by construction: a cyclic graph has no node\nleft at indegree zero, so the queue empties before the order is complete."
          }
        },
        {
          "name": "The dependency graph should be inferred from declared reads and writes, not hand-maintained",
          "explain": "<p>A pipeline's task graph is only trustworthy if it cannot drift from the code that actually runs, and the way to guarantee that is to have every task declare the files it reads and the files it writes, then infer the graph -- and audit it -- from those declarations rather than from a document someone updates by hand. The snippet audits seven tasks this way and finds three separate classes of defect that a hand-maintained diagram would never surface.</p><p>One task, signal, silently reads a second file it never declared, cur/sector_map.csv; an orchestrator relying only on declared inputs has no way to know it needs to re-run signal when that file changes, so the task keeps whatever stale version a human last left on disk. Two tasks, signal and signal_v2, both write cur/signal.parquet, which means the final content of that file depends on which task happened to run last -- an ordering only constrained up to a topological sort, not fully determined by it. And one artifact, cur/vol.parquet, is produced and read by nothing at all, since the model that once consumed it was retired: a dead intermediate that is still being paid for on every run.</p><p>Each of these is invisible in a diagram and immediate in an audit of declared reads and writes, which is why production orchestrators derive the graph rather than trust a maintained one.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# Tasks declare what they READ and what they WRITE. The graph is then INFERRED\n# from those declarations rather than hand-maintained, which is the only way\n# the graph and the code can be kept honest.\nTASKS = {\n    \"clean_crsp\":  {\"reads\": [\"raw/crsp.parquet\"],                 \"writes\": [\"cur/crsp.parquet\"]},\n    \"clean_funda\": {\"reads\": [\"raw/compustat.parquet\"],            \"writes\": [\"cur/funda.parquet\"]},\n    \"join\":        {\"reads\": [\"cur/crsp.parquet\", \"cur/funda.parquet\"],\n                    \"writes\": [\"cur/panel.parquet\"]},\n    # declares one input but actually reads a second file nobody produces\n    \"signal\":      {\"reads\": [\"cur/panel.parquet\", \"cur/sector_map.csv\"],\n                    \"writes\": [\"cur/signal.parquet\"]},\n    # two tasks writing the same artefact: last one to run wins, nondeterministically\n    \"signal_v2\":   {\"reads\": [\"cur/panel.parquet\"],                \"writes\": [\"cur/signal.parquet\"]},\n    # computed every night, read by nobody since the risk model was retired\n    \"vol_est\":     {\"reads\": [\"cur/crsp.parquet\"],                 \"writes\": [\"cur/vol.parquet\"]},\n    \"backtest\":    {\"reads\": [\"cur/signal.parquet\"],               \"writes\": [\"out/pnl.parquet\"]},\n}\nEXTERNAL = {\"raw/crsp.parquet\", \"raw/compustat.parquet\"}   # the landing zone\n\n\ndef audit(tasks, external):\n    producer = {}\n    dupes = []\n    for t, spec in tasks.items():\n        for a in spec[\"writes\"]:\n            if a in producer:\n                dupes.append((a, producer[a], t))\n            producer[a] = t\n    orphan_inputs, edges = [], []\n    for t, spec in tasks.items():\n        for a in spec[\"reads\"]:\n            if a in producer:\n                edges.append((producer[a], t))\n            elif a not in external:\n                orphan_inputs.append((t, a))\n    consumed = {a for s in tasks.values() for a in s[\"reads\"]}\n    dead = [a for a in producer if a not in consumed and not a.startswith(\"out/\")]\n    return edges, orphan_inputs, dupes, dead\n\n\nedges, orphans, dupes, dead = audit(TASKS, EXTERNAL)\nprint(f\"inferred edges ({len(edges)}):\")\nfor u, v in sorted(edges):\n    print(f\"  {u} -> {v}\")\nprint(f\"\\nundeclared inputs   : {orphans or 'none'}\")\nprint(f\"double-written paths: {[(a, p, q) for a, p, q in dupes] or 'none'}\")\nprint(f\"dead intermediates  : {dead or 'none'}\")\n\nprint(\"\\nwhy each of these is a production incident, not a style nit:\")\nprint(\"  undeclared input    -> the scheduler cannot know when to re-run you;\")\nprint(\"                         the file is whatever the last human left there\")\nprint(\"  double-written path -> the result depends on task ORDER, and the order\")\nprint(\"                         is only constrained up to a topological sort\")\nprint(\"  dead intermediate   -> you are paying to compute something nobody reads\")\n",
            "output": "inferred edges (6):\n  clean_crsp -> join\n  clean_crsp -> vol_est\n  clean_funda -> join\n  join -> signal\n  join -> signal_v2\n  signal_v2 -> backtest\n\nundeclared inputs   : [('signal', 'cur/sector_map.csv')]\ndouble-written paths: [('cur/signal.parquet', 'signal', 'signal_v2')]\ndead intermediates  : ['cur/vol.parquet']\n\nwhy each of these is a production incident, not a style nit:\n  undeclared input    -> the scheduler cannot know when to re-run you;\n                         the file is whatever the last human left there\n  double-written path -> the result depends on task ORDER, and the order\n                         is only constrained up to a topological sort\n  dead intermediate   -> you are paying to compute something nobody reads"
          }
        },
        {
          "name": "A fingerprint is hash(code + inputs + parents' fingerprints) -- and it is the whole staleness check",
          "explain": "<p>Deciding what to re-run after a change is only safe if it can be computed rather than guessed, and the mechanism every modern build tool and orchestrator uses is the same one the snippet implements directly: fingerprint a task as a hash of its own code and external inputs plus the fingerprints of everything it depends on, recursively. Two tasks have identical fingerprints if and only if they would produce identical output, given deterministic code.</p><p>Three separate changes to the same twelve-task DAG show the rule in action. A new day of TAQ data changes pull_taq's fingerprint and therefore every one of its descendants -- six of twelve tasks, including report -- while the other six, upstream of the change or in an unrelated branch, are safely skipped with identical fingerprints to before. Editing one line of signal.py changes only signal and its two downstream tasks, three of twelve, leaving nine untouched. Editing report.py for cosmetics only -- a task with no descendants at all -- changes exactly one fingerprint out of twelve.</p><p>In every case, the set of tasks that actually need to re-run is precisely the changed node plus its descendants, never more and never less. An orchestrator that re-runs the whole graph every time is not incorrect, only wasteful; one that skips anything outside that set is wrong, and -- because it produces an answer rather than an error -- wrong silently.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\n\nDAG = {\"pull_crsp\": [], \"pull_compustat\": [], \"pull_taq\": [],\n       \"clean_crsp\": [\"pull_crsp\"], \"clean_funda\": [\"pull_compustat\"],\n       \"funda_join\": [\"clean_crsp\", \"clean_funda\"],\n       \"trades\": [\"pull_taq\"], \"quotes\": [\"pull_taq\"], \"tca\": [\"trades\", \"quotes\"],\n       \"signal\": [\"funda_join\"], \"backtest\": [\"signal\", \"tca\"], \"report\": [\"backtest\"]}\nCODE = {t: f\"v1::{t}\" for t in DAG}                     # the code each task runs\nINPUT = {\"pull_crsp\": \"crsp-2026-09-26\", \"pull_compustat\": \"cs-2026-09-26\",\n         \"pull_taq\": \"taq-2026-09-26\"}                  # external inputs only\n\n\ndef fingerprints(dag, code, ext):\n    \"\"\"A task's fingerprint = hash(its code + its parents' fingerprints [+ its\n    external input]). This is the entire idea behind make, bazel and every\n    modern orchestrator's staleness check.\"\"\"\n    fp, order = {}, []\n\n    def walk(t):\n        if t in fp:\n            return fp[t]\n        parts = [code[t], ext.get(t, \"\")] + [walk(u) for u in dag[t]]\n        fp[t] = hashlib.sha256(\"|\".join(parts).encode()).hexdigest()[:10]\n        order.append(t)\n        return fp[t]\n\n    for t in dag:\n        walk(t)\n    return fp\n\n\ndef descendants(dag, changed):\n    kids = {t: [] for t in dag}\n    for t, ups in dag.items():\n        for u in ups:\n            kids[u].append(t)\n    seen, stack = set(), list(changed)\n    while stack:\n        t = stack.pop()\n        for c in kids[t]:\n            if c not in seen:\n                seen.add(c)\n                stack.append(c)\n    return seen\n\n\nbase = fingerprints(DAG, CODE, INPUT)\nprint(f\"{len(DAG)} tasks fingerprinted; report = {base['report']}\")\n\nfor label, mutate in (\n        (\"new TAQ day lands (pull_taq input changes)\", lambda c, e: e.update(pull_taq=\"taq-2026-09-27\")),\n        (\"signal code edited (one line in signal.py)\", lambda c, e: c.update(signal=\"v2::signal\")),\n        (\"report cosmetics only (report.py edited)\", lambda c, e: c.update(report=\"v2::report\"))):\n    code, ext = dict(CODE), dict(INPUT)\n    mutate(code, ext)\n    new = fingerprints(DAG, code, ext)\n    dirty = sorted(t for t in DAG if new[t] != base[t])\n    changed_root = [t for t in DAG if code[t] != CODE[t] or ext.get(t) != INPUT.get(t)]\n    print(f\"\\n{label}\")\n    print(f\"  changed node(s)      : {changed_root}\")\n    print(f\"  descendants of it    : {sorted(descendants(DAG, changed_root))}\")\n    print(f\"  fingerprints changed : {len(dirty)}/{len(DAG)}  {dirty}\")\n    print(f\"  tasks safely SKIPPED : {len(DAG) - len(dirty)}\")\nprint(\"\\nthe dirty set is always the changed node plus its descendants, never more.\")\nprint(\"An orchestrator that re-runs the whole graph is not wrong, just expensive;\")\nprint(\"one that re-runs less than this is wrong, and quietly.\")\n",
            "output": "12 tasks fingerprinted; report = 034638cba5\n\nnew TAQ day lands (pull_taq input changes)\n  changed node(s)      : ['pull_taq']\n  descendants of it    : ['backtest', 'quotes', 'report', 'tca', 'trades']\n  fingerprints changed : 6/12  ['backtest', 'pull_taq', 'quotes', 'report', 'tca', 'trades']\n  tasks safely SKIPPED : 6\n\nsignal code edited (one line in signal.py)\n  changed node(s)      : ['signal']\n  descendants of it    : ['backtest', 'report']\n  fingerprints changed : 3/12  ['backtest', 'report', 'signal']\n  tasks safely SKIPPED : 9\n\nreport cosmetics only (report.py edited)\n  changed node(s)      : ['report']\n  descendants of it    : []\n  fingerprints changed : 1/12  ['report']\n  tasks safely SKIPPED : 11\n\nthe dirty set is always the changed node plus its descendants, never more.\nAn orchestrator that re-runs the whole graph is not wrong, just expensive;\none that re-runs less than this is wrong, and quietly."
          }
        },
        {
          "name": "Parallel speed-up is bounded by the critical path, not by the number of workers",
          "explain": "<p>Layering a DAG by longest path from any root gives each task a level, and every task within one level can, in principle, run at the same time, since no edge connects two tasks in the same level. The snippet's twelve-task pipeline totals 107 units of work across six levels, with a maximum level width of four tasks; running level by level with unlimited workers finishes in 73 units, a 1.47x speed-up over the fully serial schedule.</p><p>That level-by-level number is not the true ceiling, though. The actual lower bound on wall-clock time is the critical path -- the single longest chain of dependent tasks by cumulative cost, 71 units here, ending at report -- which is close to but strictly below the level-sum figure, because a level's total width is a looser bound than the specific chain of tasks that cannot be reordered around each other.</p><p>The number that decides whether more parallelism helps at all is pull_taq's own cost, 37% of the pipeline's total work and sitting directly on that critical path. No matter how many workers are added to run the other, independent branches of the DAG concurrently, the pipeline cannot finish before pull_taq does, because everything downstream of it -- trades, quotes, tca, backtest, report -- depends on it directly or transitively. Identifying the critical path, not just counting available parallelism, is what tells an engineer which single task is actually worth making faster.</p>",
          "formula": "\\text{critical path}(t) = \\text{cost}(t) + \\max_{u \\in \\text{parents}(t)} \\text{critical path}(u)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nDAG = {\"pull_crsp\": [], \"pull_compustat\": [], \"pull_taq\": [],\n       \"clean_crsp\": [\"pull_crsp\"], \"clean_funda\": [\"pull_compustat\"],\n       \"funda_join\": [\"clean_crsp\", \"clean_funda\"],\n       \"trades\": [\"pull_taq\"], \"quotes\": [\"pull_taq\"], \"tca\": [\"trades\", \"quotes\"],\n       \"signal\": [\"funda_join\"], \"backtest\": [\"signal\", \"tca\"], \"report\": [\"backtest\"]}\n# relative cost of each task, in \"units of work\" -- not seconds\nCOST = {\"pull_crsp\": 8, \"pull_compustat\": 5, \"pull_taq\": 40, \"clean_crsp\": 3,\n        \"clean_funda\": 2, \"funda_join\": 4, \"trades\": 12, \"quotes\": 15,\n        \"tca\": 9, \"signal\": 2, \"backtest\": 6, \"report\": 1}\n\n\ndef levels(dag):\n    \"\"\"Longest-path layering: level(t) = 1 + max(level(parents)). Every task in\n    a level can run concurrently, because no edge joins two tasks in one level.\"\"\"\n    lv = {}\n\n    def f(t):\n        if t not in lv:\n            lv[t] = 1 + max([f(u) for u in dag[t]] + [0])\n        return lv[t]\n\n    for t in dag:\n        f(t)\n    return lv\n\n\nlv = levels(DAG)\ntotal = sum(COST.values())\nprint(f\"{'level':<7}{'tasks':<44}{'width':>6}{'work':>7}\")\ncrit_by_level = []\nfor k in sorted(set(lv.values())):\n    ts = sorted(t for t in DAG if lv[t] == k)\n    w = sum(COST[t] for t in ts)\n    crit_by_level.append(max(COST[t] for t in ts))\n    print(f\"{k:<7}{', '.join(ts):<44}{len(ts):>6}{w:>7}\")\n\ndepth = max(lv.values())\nwidth = max(sum(1 for t in DAG if lv[t] == k) for k in set(lv.values()))\nprint(f\"\\ntotal work {total} units, graph depth {depth} levels, max width {width} tasks\")\nprint(f\"serial schedule                  : {total} units\")\nprint(f\"unbounded workers, level by level: {sum(crit_by_level)} units \"\n      f\"(speed-up {total / sum(crit_by_level):.2f}x)\")\n\n# The true lower bound is the critical path, not the level sum.\ndef critical(dag, cost):\n    memo = {}\n\n    def f(t):\n        if t not in memo:\n            memo[t] = cost[t] + max([f(u) for u in dag[t]] + [0])\n        return memo[t]\n\n    end = max(dag, key=f)\n    return f(end), end\n\n\ncp, tail = critical(DAG, COST)\nprint(f\"critical path                    : {cp} units, ending at {tail!r} \"\n      f\"(theoretical best speed-up {total / cp:.2f}x)\")\nprint(f\"\\npull_taq alone is {COST['pull_taq'] / total:.0%} of the work and sits on the\")\nprint(\"critical path: no amount of parallelism helps until that task gets faster.\")\n",
            "output": "level  tasks                                        width   work\n1      pull_compustat, pull_crsp, pull_taq              3     53\n2      clean_crsp, clean_funda, quotes, trades          4     32\n3      funda_join, tca                                  2     13\n4      signal                                           1      2\n5      backtest                                         1      6\n6      report                                           1      1\n\ntotal work 107 units, graph depth 6 levels, max width 4 tasks\nserial schedule                  : 107 units\nunbounded workers, level by level: 73 units (speed-up 1.47x)\ncritical path                    : 71 units, ending at 'report' (theoretical best speed-up 1.51x)\n\npull_taq alone is 37% of the work and sits on the\ncritical path: no amount of parallelism helps until that task gets faster."
          }
        }
      ],
      "widget": {
        "type": "tree-diagram",
        "title": "The twelve-task research DAG",
        "params": {
          "nodes": [
            "pull_crsp",
            "pull_compustat",
            "pull_taq",
            "clean_crsp",
            "clean_funda",
            "funda_join",
            "trades",
            "quotes",
            "tca",
            "signal",
            "backtest",
            "report"
          ],
          "edges": [
            [
              "pull_crsp",
              "clean_crsp"
            ],
            [
              "pull_compustat",
              "clean_funda"
            ],
            [
              "clean_crsp",
              "funda_join"
            ],
            [
              "clean_funda",
              "funda_join"
            ],
            [
              "pull_taq",
              "trades"
            ],
            [
              "pull_taq",
              "quotes"
            ],
            [
              "trades",
              "tca"
            ],
            [
              "quotes",
              "tca"
            ],
            [
              "funda_join",
              "signal"
            ],
            [
              "signal",
              "backtest"
            ],
            [
              "tca",
              "backtest"
            ],
            [
              "backtest",
              "report"
            ]
          ]
        }
      },
      "pitfalls": [
        "Hand-maintaining a dependency diagram alongside the code that actually reads and writes files, so the two drift apart the first time someone adds a read without updating the picture.",
        "Two tasks writing the same output path, so the final content of that file depends on execution order rather than being deterministic.",
        "Re-running an entire DAG on every change because computing the correct dirty set feels harder than just rebuilding everything -- correct, but far more expensive than it needs to be.",
        "Adding workers to speed up a pipeline without first finding the critical path, and discovering that the slowest single task was never on the branch that got parallelized."
      ],
      "check": [
        {
          "q": "A task graph has a feedback edge that makes it cyclic. Kahn's algorithm's topological sort will:",
          "options": [
            "Silently produce an order that ignores the cycle",
            "Never schedule the tasks inside the cycle, because they never reach indegree zero",
            "Crash with a stack overflow",
            "Schedule the cycle's tasks in a random order"
          ],
          "answer": 1,
          "why": "Every task inside a genuine cycle owes a dependency to another task also inside the cycle, so at least one of them always has indegree greater than zero -- the queue that drives the algorithm empties before those tasks are ever added to it, which is exactly how the algorithm detects the cycle without any special-case check."
        },
        {
          "q": "Two tasks in a pipeline both write to the same output file. The most accurate description of the resulting bug is:",
          "options": [
            "A crash, since two tasks cannot write the same file",
            "A race condition only under concurrent execution, never under serial execution",
            "The file's final content depends on which task ran last, which is only constrained up to a topological sort, not fully determined",
            "No bug, since the second write always overwrites the first predictably"
          ],
          "answer": 2,
          "why": "A topological sort only guarantees each task runs after its dependencies; it does not fix the relative order of two tasks that are not each other's dependency. Two writers of the same path with no ordering edge between them can therefore run in either order, so the output content is nondeterministic even in a fully serial, non-concurrent run."
        },
        {
          "q": "A single line of code changes in one downstream task's script. An orchestrator using content-hash fingerprints will re-run:",
          "options": [
            "The entire DAG, since any change invalidates everything",
            "Only that task, since fingerprints are hashed per-task in isolation",
            "That task and every one of its descendants, but nothing upstream or in an unrelated branch",
            "Nothing, since fingerprinting only tracks external inputs"
          ],
          "answer": 2,
          "why": "A task's fingerprint depends on its own code plus its parents' fingerprints, so changing one task's code changes its own fingerprint and, because fingerprints propagate downstream, every descendant's fingerprint too. Anything upstream or in a branch that never depends on the changed task keeps an identical fingerprint and is safely skipped."
        },
        {
          "q": "A pipeline's slowest single task sits directly on the critical path and makes up 37% of total work. Adding more parallel workers to the DAG's other branches will:",
          "options": [
            "Make the whole pipeline finish in proportionally less time",
            "Not reduce the pipeline's minimum possible completion time, since everything downstream of that task must still wait for it",
            "Eliminate the need to ever compute a critical path",
            "Only help if the task is also the first one in the DAG"
          ],
          "answer": 1,
          "why": "The critical path is a lower bound on completion time set by the longest chain of dependent tasks, and a task that sits on it constrains that bound directly. Parallelizing independent branches elsewhere can shorten how long those branches take, but cannot make the pipeline finish before the critical-path task itself completes."
        }
      ]
    },
    {
      "n": 5,
      "title": "Idempotency: making a pipeline safe to re-run",
      "topics": [
        "idempotent writes and revision-guarded upserts",
        "watermarks and allowed lateness",
        "append-only ledgers vs snapshot overwrites",
        "partition-swap backfills vs blind appends"
      ],
      "concepts": [
        {
          "name": "Idempotent means: running it three times leaves the same state as running it once",
          "explain": "<p>A pipeline that can be safely retried is one where re-applying the same batch of fills produces an identical final state, not just an identical-looking log. The snippet upserts two overlapping fill batches once, then upserts the same two batches a second and third time, and confirms the resulting rows, positions, and total notional are bit-for-bit identical across both runs -- that identity check, not \"it ran without error,\" is what idempotent actually means.</p><p>The harder case is a replay that arrives out of order: yesterday's batch landing again after a correction to one of its fills has already been applied. A plain upsert with no ordering guard lets the older, uncorrected batch overwrite the newer correction, silently reverting a fix; a revision-guarded upsert -- only apply the incoming row if its revision number is strictly greater than what is stored -- refuses the stale write and leaves the corrected state untouched, matching what a clean two-batch run would have produced.</p><p>Removing the natural key entirely, so every arrival is a plain insert rather than an upsert keyed on fill_id, shows the failure mode idempotency prevents: the same replayed batches inflate one position by 300 phantom shares that were never actually traded. A risk system reading that table will hedge a position that does not exist, while the trader who actually holds the real, smaller position will not.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Batches 1 and 2 OVERLAP on fill_id 4 and 5 -- exactly what a retry after an\n# ambiguous timeout looks like. Batch 2 also carries a CORRECTION to fill 4.\n# rev = the vendor's monotone revision counter for that fill.\nBATCH_1 = [(1, 1, \"AAA\", \"B\", 100, 10.00), (2, 1, \"AAA\", \"B\", 200, 10.02),\n           (3, 1, \"BBB\", \"S\", 150, 7.50), (4, 1, \"AAA\", \"S\", 100, 10.05),\n           (5, 1, \"BBB\", \"B\", 50, 7.45)]\nBATCH_2 = [(4, 2, \"AAA\", \"S\", 100, 10.06),      # corrected price, revision 2\n           (5, 1, \"BBB\", \"B\", 50, 7.45),        # identical replay\n           (6, 1, \"AAA\", \"B\", 300, 10.01), (7, 1, \"BBB\", \"S\", 100, 7.55)]\n\nDDL = (\"CREATE TABLE fills(fill_id INTEGER PRIMARY KEY, rev INTEGER, sym TEXT,\"\n       \" side TEXT, qty INTEGER, px REAL)\")\nUPSERT = (\"INSERT INTO fills VALUES (?,?,?,?,?,?) ON CONFLICT(fill_id) DO UPDATE SET\"\n          \" rev=excluded.rev, sym=excluded.sym, side=excluded.side,\"\n          \" qty=excluded.qty, px=excluded.px\")\nGUARDED = UPSERT + \" WHERE excluded.rev > fills.rev\"     # monotone: replay-order proof\n\n\ndef store(ddl=DDL):\n    cx = sqlite3.connect(\":memory:\")\n    cx.execute(ddl)\n    return cx\n\n\ndef state(cx):\n    rows = cx.execute(\"SELECT * FROM fills ORDER BY fill_id\").fetchall()\n    pos = dict(cx.execute(\"SELECT sym, SUM(CASE side WHEN 'B' THEN qty ELSE -qty END)\"\n                          \" FROM fills GROUP BY sym\").fetchall())\n    return rows, pos, round(cx.execute(\"SELECT SUM(qty*px) FROM fills\").fetchone()[0], 2)\n\n\ndef play(sql, batches):\n    cx = store()\n    for b in batches:\n        cx.executemany(sql, b)\n    cx.commit()\n    return state(cx)\n\n\nonce = play(UPSERT, [BATCH_1, BATCH_2])\ntwice = play(UPSERT, [BATCH_1, BATCH_2, BATCH_2, BATCH_2])\nprint(f\"once   : {len(once[0])} rows  positions {once[1]}  notional {once[2]}\")\nprint(f\"x3 retry: {len(twice[0])} rows  positions {twice[1]}  notional {twice[2]}\")\nprint(f\"IDENTICAL STATE: {once == twice}  <- this is what idempotent means\")\n\n# Now replay OUT OF ORDER: yesterday's batch lands again after the correction.\nooo = play(UPSERT, [BATCH_1, BATCH_2, BATCH_1])\nprint(f\"\\nout-of-order replay, plain upsert : fill 4 px {ooo[0][3][5]}, \"\n      f\"notional {ooo[2]}  identical {ooo == once}\")\nooo_g = play(GUARDED, [BATCH_1, BATCH_2, BATCH_1])\nprint(f\"out-of-order replay, rev-guarded  : fill 4 px {ooo_g[0][3][5]}, \"\n      f\"notional {ooo_g[2]}  identical {ooo_g == play(GUARDED, [BATCH_1, BATCH_2])}\")\n\n# And the same replays with no key at all.\ncx = store(\"CREATE TABLE fills(fill_id INTEGER, rev INTEGER, sym TEXT, side TEXT,\"\n           \" qty INTEGER, px REAL)\")\nfor b in (BATCH_1, BATCH_2, BATCH_2, BATCH_2):\n    cx.executemany(\"INSERT INTO fills VALUES (?,?,?,?,?,?)\", b)\ncx.commit()\ns = state(cx)\nprint(f\"\\nno key, same replays: {len(s[0])} rows, positions {s[1]}\")\nprint(f\"AAA overstated by {s[1]['AAA'] - once[1]['AAA']} shares -- phantom inventory\")\nprint(\"a risk system will hedge and a trader will not have.\")\n",
            "output": "once   : 7 rows  positions {'AAA': 500, 'BBB': -200}  notional 9265.5\nx3 retry: 7 rows  positions {'AAA': 500, 'BBB': -200}  notional 9265.5\nIDENTICAL STATE: True  <- this is what idempotent means\n\nout-of-order replay, plain upsert : fill 4 px 10.05, notional 9264.5  identical False\nout-of-order replay, rev-guarded  : fill 4 px 10.06, notional 9265.5  identical True\n\nno key, same replays: 17 rows, positions {'AAA': 800, 'BBB': -250}\nAAA overstated by 300 shares -- phantom inventory\na risk system will hedge and a trader will not have."
          }
        },
        {
          "name": "Allowed lateness is a business decision about how wrong a report is willing to be",
          "explain": "<p>Late-arriving data is normal in bond markets, where a trade's report can land days after it happened, and any pipeline that closes out a day's totals has to decide how long to wait for stragglers before closing for good. A watermark tracks the latest arrival timestamp seen so far and closes an event-day once the watermark passes that day plus an allowed-lateness window; anything arriving after closing is simply dropped.</p><p>The snippet's fixed set of eleven events, totaling 335 units across five event-days, shows exactly what different lateness budgets cost. With zero days of allowed lateness, two late arrivals are dropped and 75 of 335 units -- 22% of the true total -- are permanently lost, understating one day by fully half its true value; the report itself carries no indication that anything was dropped. Waiting three days recovers everything and drops nothing, because that happens to be exactly as late as this dataset's stragglers ever arrive.</p><p>The alternative strategy -- keep the last k event-days open and recompute them from scratch on every processing day rather than freezing them on a schedule -- reaches the same tradeoff from the other direction: a one- or two-day window is still not wide enough to capture the three-day-late event, while a four-day window is. Neither approach eliminates the tradeoff; both make it explicit and tunable, which a pipeline that simply \"closes the books daily\" with no watermark at all does not.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# Event time vs processing time. A TRACE-shaped tape: bonds report late, so a\n# handful of prints arrive days after the trade actually happened.\nEVENTS = [(1, 1, 10), (1, 1, 20), (2, 2, 30), (2, 2, 15),\n          (2, 4, 25),                                   # 2 days late\n          (3, 3, 40), (3, 3, 10), (3, 6, 50),           # 3 days late, and it is the big one\n          (4, 4, 60), (5, 5, 70), (5, 5, 5)]            # (event_day, arrival_day, notional)\nTRUTH = {}\nfor d, _, n in EVENTS:\n    TRUTH[d] = TRUTH.get(d, 0) + n\nLAST_DAY = max(a for _, a, _ in EVENTS)\n\n\ndef watermark_run(allowed_lateness):\n    \"\"\"Close event-day D once the watermark (max arrival seen) passes\n    D + allowed_lateness. Anything arriving after that is dropped for good.\"\"\"\n    closed, totals, dropped = {}, {}, []\n    wm = 0\n    for d, a, n in sorted(EVENTS, key=lambda e: e[1]):\n        wm = max(wm, a)\n        for day in list(totals):\n            if day not in closed and wm > day + allowed_lateness:\n                closed[day] = totals[day]\n        if d in closed:\n            dropped.append((d, a, n))\n            continue\n        totals[d] = totals.get(d, 0) + n\n    for day, v in totals.items():\n        closed.setdefault(day, v)\n    return closed, dropped\n\n\ndef reprocess_run(k):\n    \"\"\"Keep the last k event-days OPEN and recompute them from scratch every\n    processing day. A day's reported value freezes when it leaves the window.\"\"\"\n    frozen = {}\n    for pday in range(1, LAST_DAY + 1):\n        for d in [x for x in range(max(1, pday - k + 1), pday + 1) if x in TRUTH]:\n            frozen[d] = sum(n for dd, a, n in EVENTS if dd == d and a <= pday)\n    return frozen\n\n\nprint(f\"true totals by event day: {dict(sorted(TRUTH.items()))}   (335 units in all)\")\nprint(f\"\\n{'lateness':>8}  {'reported totals':<40}{'dropped':>8}{'lost':>6}{'worst day':>11}\")\nfor L in (0, 1, 2, 3):\n    got, drop = watermark_run(L)\n    err = max(abs(TRUTH[d] - got.get(d, 0)) / TRUTH[d] for d in TRUTH)\n    print(f\"{L:>8}  {str(dict(sorted(got.items()))):<40}\"\n          f\"{len(drop):>8}{sum(n for _, _, n in drop):>6}{err:>10.0%}\")\n\nprint(f\"\\n{'window k':>8}  {'reported totals':<40}{'exact':>8}{'lost':>6}\")\nfor k in (1, 2, 4):\n    got = reprocess_run(k)\n    lost = sum(TRUTH[d] - got.get(d, 0) for d in TRUTH)\n    print(f\"{k:>8}  {str(dict(sorted(got.items()))):<40}\"\n          f\"{str(all(got[d] == TRUTH[d] for d in TRUTH)):>8}{lost:>6}\")\n\nprint(\"\\nallowed lateness is a business decision about how wrong you are willing\")\nprint(\"to be, stated in days. A one-day watermark lost 75 of 335 units and\")\nprint(\"understated day 3 by half; the report itself never said so.\")\n",
            "output": "true totals by event day: {1: 30, 2: 70, 3: 100, 4: 60, 5: 75}   (335 units in all)\n\nlateness  reported totals                          dropped  lost  worst day\n       0  {1: 30, 2: 45, 3: 50, 4: 60, 5: 75}            2    75       50%\n       1  {1: 30, 2: 45, 3: 50, 4: 60, 5: 75}            2    75       50%\n       2  {1: 30, 2: 70, 3: 50, 4: 60, 5: 75}            1    50       50%\n       3  {1: 30, 2: 70, 3: 100, 4: 60, 5: 75}           0     0        0%\n\nwindow k  reported totals                            exact  lost\n       1  {1: 30, 2: 45, 3: 50, 4: 60, 5: 75}        False    75\n       2  {1: 30, 2: 45, 3: 50, 4: 60, 5: 75}        False    75\n       4  {1: 30, 2: 70, 3: 100, 4: 60, 5: 75}        True     0\n\nallowed lateness is a business decision about how wrong you are willing\nto be, stated in days. A one-day watermark lost 75 of 335 units and\nunderstated day 3 by half; the report itself never said so."
          }
        },
        {
          "name": "Append-only buys an audit trail; a snapshot overwrite throws the history away",
          "explain": "<p>The same stream of fills, including one amendment that revises a quantity downward, can be persisted two ways: append every event, including duplicates from a replay, and deduplicate on read by keeping the latest revision per key; or upsert a single snapshot row per key, overwriting on every new revision. Both, done correctly, converge on the same final positions -- 180 shares of AAA, -150 of BBB in the snippet, matching ground truth -- so correctness alone does not distinguish them.</p><p>What distinguishes them is what each can still answer afterward. The snippet's append-only ledger, queried for fill 4's history, returns both the original quantity and the amended one in the order they were recorded, because neither write was ever destroyed; the snapshot table, by design, only ever held the latest revision, so the same question about \"what did we believe before the amendment\" has no answer at all -- that row was overwritten, not retained.</p><p>A naive read of the append-only ledger, a plain SUM(qty) with no deduplication, gets both positions wrong, because it double-counts every replayed and revised row; only deduplicating on read, keeping the highest revision per key, recovers the correct totals from the same append-only data. That extra read-time cost -- a window function instead of a simple aggregate -- is exactly the price of keeping the audit trail a pure snapshot cannot offer.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# The same fill stream three ways. Events carry (fill_id, rev, sym, qty_signed).\nSTREAM = [(1, 1, \"AAA\", 100), (2, 1, \"AAA\", 200), (3, 1, \"BBB\", -150),\n          (4, 1, \"AAA\", -100), (4, 2, \"AAA\", -120)]      # fill 4 amended downward\nREPLAY = STREAM + STREAM[2:]                              # a partial replay of the tail\n\ncx = sqlite3.connect(\":memory:\")\ncx.executescript(\"\"\"\nCREATE TABLE ledger(seq INTEGER PRIMARY KEY AUTOINCREMENT, fill_id INT, rev INT,\n                    sym TEXT, qty INT);\nCREATE TABLE snap(fill_id INT PRIMARY KEY, rev INT, sym TEXT, qty INT);\n\"\"\")\n\n# APPEND-ONLY: never update, never delete. Duplicates are expected; the READ\n# deduplicates by (fill_id, max rev) and by keeping only the first arrival.\ncx.executemany(\"INSERT INTO ledger(fill_id, rev, sym, qty) VALUES (?,?,?,?)\", REPLAY)\n# UPSERT SNAPSHOT: one row per fill, latest revision wins.\ncx.executemany(\"INSERT INTO snap VALUES (?,?,?,?) ON CONFLICT(fill_id) DO UPDATE\"\n               \" SET rev=excluded.rev, sym=excluded.sym, qty=excluded.qty\"\n               \" WHERE excluded.rev > snap.rev\", REPLAY)\ncx.commit()\n\nnaive = dict(cx.execute(\"SELECT sym, SUM(qty) FROM ledger GROUP BY sym\").fetchall())\ndeduped = dict(cx.execute(\"\"\"\n    SELECT sym, SUM(qty) FROM (\n      SELECT fill_id, sym, qty, rev,\n             ROW_NUMBER() OVER (PARTITION BY fill_id ORDER BY rev DESC, seq DESC) AS rn\n      FROM ledger)\n    WHERE rn = 1 GROUP BY sym\"\"\").fetchall())\nsnapshot = dict(cx.execute(\"SELECT sym, SUM(qty) FROM snap GROUP BY sym\").fetchall())\ntruth = {\"AAA\": 100 + 200 - 120, \"BBB\": -150}\n\nprint(f\"ledger rows written (with the replay) : \"\n      f\"{cx.execute('SELECT COUNT(*) FROM ledger').fetchone()[0]}\")\nprint(f\"snapshot rows                         : \"\n      f\"{cx.execute('SELECT COUNT(*) FROM snap').fetchone()[0]}\")\nprint(f\"\\n{'read path':<34}{'AAA':>7}{'BBB':>7}   correct\")\nfor name, got in ((\"append-only, SUM(qty) raw\", naive),\n                  (\"append-only, dedup on read\", deduped),\n                  (\"upsert snapshot\", snapshot)):\n    print(f\"{name:<34}{got.get('AAA', 0):>7}{got.get('BBB', 0):>7}   {got == truth}\")\nprint(f\"{'ground truth':<34}{truth['AAA']:>7}{truth['BBB']:>7}\")\n\nprint(\"\\nappend-only keeps the amendment history: you can still answer 'what did\")\nprint(\"we think on Tuesday'. Query:\")\nfor r in cx.execute(\"SELECT fill_id, rev, qty FROM ledger WHERE fill_id=4 ORDER BY seq\"):\n    print(f\"  fill 4 revision {r[1]} -> qty {r[2]}\")\nprint(\"the snapshot cannot answer that at all -- it overwrote revision 1.\")\nprint(\"Append-only costs storage and a window function; it buys you an audit trail.\")\n",
            "output": "ledger rows written (with the replay) : 8\nsnapshot rows                         : 4\n\nread path                             AAA    BBB   correct\nappend-only, SUM(qty) raw            -140   -300   False\nappend-only, dedup on read            180   -150   True\nupsert snapshot                       180   -150   True\nground truth                          180   -150\n\nappend-only keeps the amendment history: you can still answer 'what did\nwe think on Tuesday'. Query:\n  fill 4 revision 1 -> qty -100\n  fill 4 revision 2 -> qty -120\n  fill 4 revision 1 -> qty -100\n  fill 4 revision 2 -> qty -120\nthe snapshot cannot answer that at all -- it overwrote revision 1.\nAppend-only costs storage and a window function; it buys you an audit trail."
          }
        },
        {
          "name": "A backfill's unit of change is a whole partition, replaced, never appended into",
          "explain": "<p>Re-deriving a handful of historical days under a corrected cleaning rule -- one that now keeps an extra print per day -- is a backfill, and the snippet shows the two ways to apply it land on very different answers even though both start from the same corrected rows. Blindly appending the re-derived rows for days four through eight into the existing table produces fifty rows and a total of 2,910 where the true, corrected total is 1,995: every one of those five days is now double-counted, because both the old and the new versions of the day sit in the table at once.</p><p>The correct approach deletes and re-inserts one partition -- one full day -- inside a single transaction, so a day's rows are wholly replaced rather than added to. That produces exactly 35 rows and the correct 1,995 total, and running the identical partition-swap backfill two more times leaves the table completely unchanged, which is the idempotency property a blind append never has: appending the same correction repeatedly keeps inflating the total further every time.</p><p>The rule generalizes past this one example: an idempotent backfill's unit of write is always a partition -- a day, a symbol, a batch -- replaced whole, never a set of rows added alongside whatever was already there. Getting this wrong is one of the most common ways a P&amp;L series ends up silently and repeatedly doubled.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Ten trading days of a partitioned table. A backfill re-derives days 4..8\n# because the cleaning rule changed; the new rule keeps one extra print a day.\nDAYS = list(range(1, 11))\nORIGINAL = {d: [(d, i, 10 * d + i) for i in range(3)] for d in DAYS}\nREDERIVED = {d: [(d, i, 10 * d + i) for i in range(4)] for d in range(4, 9)}\n\ncx = sqlite3.connect(\":memory:\")\ncx.execute(\"CREATE TABLE t(day INT, item INT, val INT)\")\nfor d in DAYS:\n    cx.executemany(\"INSERT INTO t VALUES (?,?,?)\", ORIGINAL[d])\ncx.commit()\n\n\ndef totals(c):\n    rows = c.execute(\"SELECT day, COUNT(*), SUM(val) FROM t GROUP BY day ORDER BY day\").fetchall()\n    return {r[0]: (r[1], r[2]) for r in rows}\n\n\nbase = totals(cx)\nprint(f\"before backfill: {sum(v[0] for v in base.values())} rows, \"\n      f\"total {sum(v[1] for v in base.values())}\")\n\n# --- WRONG: blind append of the re-derived partitions\nblind = sqlite3.connect(\":memory:\")\nblind.execute(\"CREATE TABLE t(day INT, item INT, val INT)\")\nfor d in DAYS:\n    blind.executemany(\"INSERT INTO t VALUES (?,?,?)\", ORIGINAL[d])\nfor d, rows in REDERIVED.items():\n    blind.executemany(\"INSERT INTO t VALUES (?,?,?)\", rows)\nblind.commit()\nb = totals(blind)\n\n# --- RIGHT: delete-then-insert, one whole partition at a time, in a transaction\npart = sqlite3.connect(\":memory:\", isolation_level=None)\npart.execute(\"CREATE TABLE t(day INT, item INT, val INT)\")\nfor d in DAYS:\n    part.executemany(\"INSERT INTO t VALUES (?,?,?)\", ORIGINAL[d])\nfor d, rows in REDERIVED.items():\n    part.execute(\"BEGIN\")\n    part.execute(\"DELETE FROM t WHERE day=?\", (d,))\n    part.executemany(\"INSERT INTO t VALUES (?,?,?)\", rows)\n    part.execute(\"COMMIT\")\np = totals(part)\n\n# Run the partition backfill AGAIN -- it must not change anything.\nfor d, rows in REDERIVED.items():\n    part.execute(\"BEGIN\")\n    part.execute(\"DELETE FROM t WHERE day=?\", (d,))\n    part.executemany(\"INSERT INTO t VALUES (?,?,?)\", rows)\n    part.execute(\"COMMIT\")\np2 = totals(part)\n\nprint(f\"\\n{'day':>4}{'orig (n,sum)':>16}{'blind append':>16}{'partition swap':>17}\")\nfor d in DAYS:\n    mark = \"  <- backfilled\" if d in REDERIVED else \"\"\n    print(f\"{d:>4}{str(base[d]):>16}{str(b[d]):>16}{str(p[d]):>17}{mark}\")\nprint(f\"\\nblind append   : {sum(v[0] for v in b.values())} rows, \"\n      f\"total {sum(v[1] for v in b.values())}  (days 4-8 double-counted)\")\nprint(f\"partition swap : {sum(v[0] for v in p.values())} rows, \"\n      f\"total {sum(v[1] for v in p.values())}\")\nprint(f\"run the partition swap twice more: identical = {p == p2}\")\nprint(\"\\nthe unit of an idempotent backfill is a PARTITION, replaced whole.\")\nprint(\"Appending into a partition is how a backfill silently doubles a P&L series.\")\n",
            "output": "before backfill: 30 rows, total 1680\n\n day    orig (n,sum)    blind append   partition swap\n   1         (3, 33)         (3, 33)          (3, 33)\n   2         (3, 63)         (3, 63)          (3, 63)\n   3         (3, 93)         (3, 93)          (3, 93)\n   4        (3, 123)        (7, 289)         (4, 166)  <- backfilled\n   5        (3, 153)        (7, 359)         (4, 206)  <- backfilled\n   6        (3, 183)        (7, 429)         (4, 246)  <- backfilled\n   7        (3, 213)        (7, 499)         (4, 286)  <- backfilled\n   8        (3, 243)        (7, 569)         (4, 326)  <- backfilled\n   9        (3, 273)        (3, 273)         (3, 273)\n  10        (3, 303)        (3, 303)         (3, 303)\n\nblind append   : 50 rows, total 2910  (days 4-8 double-counted)\npartition swap : 35 rows, total 1995\nrun the partition swap twice more: identical = True\n\nthe unit of an idempotent backfill is a PARTITION, replaced whole.\nAppending into a partition is how a backfill silently doubles a P&L series."
          }
        }
      ],
      "widget": {
        "type": "code-trace",
        "title": "Replaying the same fill batch three times",
        "params": {
          "steps": [
            {
              "line": "upsert BATCH_1",
              "state": "rows=5, AAA=500, BBB=-200"
            },
            {
              "line": "upsert BATCH_2",
              "state": "rows=7, AAA=500, BBB=-200, fill4 corrected"
            },
            {
              "line": "upsert BATCH_2 again (retry)",
              "state": "rows=7, identical state"
            },
            {
              "line": "upsert BATCH_2 a third time",
              "state": "rows=7, identical state -- idempotent"
            }
          ]
        }
      },
      "pitfalls": [
        "Upserting fills with no revision guard, so an out-of-order replay of an older batch can silently overwrite a newer correction.",
        "Closing a day's totals with no watermark at all, or with an allowed-lateness window chosen without checking how late this specific dataset's stragglers actually arrive.",
        "Reading an append-only ledger with a plain SUM and no deduplication, double-counting every replay and every revision it was designed to retain.",
        "Backfilling corrected historical data with a blind append instead of a partition swap, which double-counts every day the backfill touches and gets worse each time it is re-run."
      ],
      "check": [
        {
          "q": "Re-applying the identical batch of fills to a table three times in a row should leave the table in:",
          "options": [
            "A state with three times as many rows",
            "A state that grows slightly each time due to floating-point rounding",
            "Exactly the same state as applying it once",
            "An undefined state, since order of application matters"
          ],
          "answer": 2,
          "why": "That exact identity -- state after one application equals state after three -- is the definition of idempotent used here, and it is achieved by upserting on a stable key rather than blindly inserting, so a repeated write updates the same row instead of creating a new one."
        },
        {
          "q": "A pipeline closes each day's totals once its watermark passes that day plus a zero-day allowed-lateness window. A trade that arrives two days late will be:",
          "options": [
            "Included automatically, since watermarks only affect future data",
            "Dropped, and the day's reported total will understate the true total with no indication in the output that anything was lost",
            "Flagged with a warning but still included",
            "Held indefinitely until it can be included"
          ],
          "answer": 1,
          "why": "A zero-day lateness window closes an event-day the moment any later arrival is seen, so a trade arriving after that closing is simply excluded from the total going forward. The report itself carries no signal that this happened -- allowed lateness is a silent tradeoff unless a pipeline explicitly surfaces what it dropped."
        },
        {
          "q": "An append-only ledger that records every fill and every revision, read with a plain SUM(qty) and no deduplication, will:",
          "options": [
            "Always match a snapshot table's totals exactly",
            "Double- or over-count, because replays and multiple revisions of the same fill are all summed as if they were independent events",
            "Under-count, since duplicates are automatically ignored by SQL",
            "Only be wrong if the ledger has a bug"
          ],
          "answer": 1,
          "why": "Append-only storage keeps every write, including replayed duplicates and every revision of an amended fill, so a naive SUM adds all of them together. Getting the correct total requires deduplicating on read -- keeping only the latest revision per key -- which is the extra cost append-only storage trades for its audit trail."
        },
        {
          "q": "A cleaning rule changes and five historical days need to be re-derived. The idempotent way to write the corrected rows back is to:",
          "options": [
            "Append the newly derived rows alongside the existing ones for those days",
            "Delete and re-insert each affected day's partition as a whole, inside a transaction",
            "Update only the rows that changed, leaving the rest of each day untouched",
            "Truncate the entire table and reload everything from scratch every time"
          ],
          "answer": 1,
          "why": "A partition swap replaces a day's data wholly and atomically, so re-running the same backfill twice leaves the table unchanged. Appending the new rows alongside the old ones, by contrast, double-counts every affected day and gets worse each time the backfill is repeated."
        }
      ]
    },
    {
      "n": 6,
      "title": "Data quality: contracts, drift, and alerts nobody trusts",
      "topics": [
        "schema and range contracts at the batch boundary",
        "schema drift: renames, type changes, new nulls",
        "distributional checks and the multiple-testing problem",
        "parsing messy numeric strings: coerce vs raise"
      ],
      "concepts": [
        {
          "name": "A range check catches what a type check cannot: a value that is the wrong kind of impossible",
          "explain": "<p>A column contract declares, once, what every batch is supposed to look like -- a type, whether nulls are allowed, a length or a numeric range -- and checking a batch against it at the boundary turns \"the model produced a strange number\" into \"row 2 violated the ret contract before it ever reached the model.\" The snippet checks five rows against a five-column contract and finds three of them fail at least one rule: a malformed date string one character short, a null permno in a not-nullable column, a null and a negative price where prices must be positive, and a return of -1.40 that fails a range check even though it is a perfectly valid float.</p><p>That last violation is the point of having a range check at all: -1.40 is not merely an unusual number, it is impossible for a simple return on a long position, since losing 140% of an investment is not a thing that can happen. A type check sees a valid float and passes it; only a range check that encodes \"returns cannot go below -1.0\" catches what is very likely a sign error or a units bug upstream.</p><p>The two clean rows are the only two fit to pass downstream in this batch. Nothing here required a model to notice anything was wrong; the boundary check caught it first, cheaply, and named exactly which column and which rule failed.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport math\n\n# A column contract, declared once, checked at the boundary on every batch.\nCONTRACT = {\n    \"permno\":   {\"type\": int,   \"nullable\": False},\n    \"date\":     {\"type\": str,   \"nullable\": False, \"regex\": 10},        # length check\n    \"ret\":      {\"type\": float, \"nullable\": True,  \"range\": (-0.95, 5.0)},\n    \"prc\":      {\"type\": float, \"nullable\": False, \"range\": (0.0001, 1e6)},\n    \"shrout\":   {\"type\": int,   \"nullable\": False, \"range\": (1, 5e10)},\n}\nBATCH = [\n    {\"permno\": 10145, \"date\": \"2026-06-30\", \"ret\": 0.0134, \"prc\": 214.5, \"shrout\": 1_204_000},\n    {\"permno\": 93436, \"date\": \"2026-06-30\", \"ret\": None,    \"prc\": 331.2, \"shrout\": 3_180_000},\n    {\"permno\": 14593, \"date\": \"2026-6-30\",  \"ret\": -1.40,   \"prc\": -12.0, \"shrout\": 15_000_000},\n    {\"permno\": None,  \"date\": \"2026-06-30\", \"ret\": 0.008,   \"prc\": 44.0,  \"shrout\": 900_000},\n    {\"permno\": 22111, \"date\": \"2026-06-30\", \"ret\": 0.02,    \"prc\": None,  \"shrout\": 0},\n]\n\n\ndef validate(batch, contract):\n    viol = {}\n\n    def flag(col, kind, i):\n        viol.setdefault((col, kind), []).append(i)\n\n    for i, row in enumerate(batch):\n        for col, spec in contract.items():\n            if col not in row:\n                flag(col, \"missing column\", i)\n                continue\n            v = row[col]\n            if v is None:\n                if not spec[\"nullable\"]:\n                    flag(col, \"null in NOT NULL column\", i)\n                continue\n            if not isinstance(v, spec[\"type\"]) or (isinstance(v, float) and math.isnan(v)):\n                flag(col, f\"type is {type(v).__name__}, want {spec['type'].__name__}\", i)\n                continue\n            if \"regex\" in spec and len(v) != spec[\"regex\"]:\n                flag(col, f\"length {len(v)}, want {spec['regex']}\", i)\n            if \"range\" in spec:\n                lo, hi = spec[\"range\"]\n                if not lo <= v <= hi:\n                    flag(col, f\"outside [{lo}, {hi}]\", i)\n    return viol\n\n\nviol = validate(BATCH, CONTRACT)\nprint(f\"batch of {len(BATCH)} rows, {len(CONTRACT)} columns under contract\")\nprint(f\"{'column':<9}{'violation':<40}{'rows':>6}  examples\")\nfor (col, kind), rows in sorted(viol.items()):\n    print(f\"{col:<9}{kind:<40}{len(rows):>6}  {rows}\")\nbad_rows = sorted({i for rows in viol.values() for i in rows})\nprint(f\"\\nrows with at least one violation : {len(bad_rows)}/{len(BATCH)} {bad_rows}\")\nprint(f\"rows fit to pass downstream      : {len(BATCH) - len(bad_rows)}\")\n\nprint(\"\\nnote row 2: ret = -1.40 is not merely unusual, it is IMPOSSIBLE for a\")\nprint(\"simple return -- you cannot lose 140% of a long equity position. A range\")\nprint(\"check catches a sign or units bug that no type check ever will.\")\n",
            "output": "batch of 5 rows, 5 columns under contract\ncolumn   violation                                 rows  examples\ndate     length 9, want 10                            1  [2]\npermno   null in NOT NULL column                      1  [3]\nprc      null in NOT NULL column                      1  [4]\nprc      outside [0.0001, 1000000.0]                  1  [2]\nret      outside [-0.95, 5.0]                         1  [2]\nshrout   outside [1, 50000000000.0]                   1  [4]\n\nrows with at least one violation : 3/5 [2, 3, 4]\nrows fit to pass downstream      : 2\n\nnote row 2: ret = -1.40 is not merely unusual, it is IMPOSSIBLE for a\nsimple return -- you cannot lose 140% of a long equity position. A range\ncheck catches a sign or units bug that no type check ever will."
          }
        },
        {
          "name": "Schema drift hides a rename, a type change, and a unit change inside 'the columns look fine'",
          "explain": "<p>A vendor's feed can change shape overnight without ever sending an error: a column gets renamed, a numeric field starts arriving as a string, a previously complete column starts admitting nulls. The snippet infers the schema of a reference batch and a new batch and diffs them structurally, finding five distinct findings from what looks, at a glance, like the same three-row options-shaped table: impl_vol is gone, implied_volatility has appeared in its place with an identical type, open_interest -- never null in the reference -- now carries nulls, and strike, a float in the reference, arrives as a string carrying the vendor's own thousand-times integer convention.</p><p>Each finding maps to a specific silent failure. The rename means any downstream code still calling .get('impl_vol') gets None for every single row rather than an error. Strike arriving as a string means a sort or a moneyness calculation runs lexicographically instead of numerically. The 1000x convention means a strike of 220 is now the string \"220000\", so every moneyness computed against it is off by exactly that factor. And a newly nullable open_interest silently drops two of three rows out of any liquidity filter that assumes the column is always populated.</p><p>A schema check that runs on every batch and asserts the shape has not moved catches all four classes of drift before any of them reaches a model as a wrong number with no error attached to it.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# Batch 1: the reference. Batch 2: the vendor \"improved\" the feed overnight.\nBATCH_1 = [\n    {\"secid\": 108105, \"exdate\": \"2026-12-18\", \"strike\": 220.0, \"impl_vol\": 0.284, \"open_interest\": 4120},\n    {\"secid\": 108105, \"exdate\": \"2026-12-18\", \"strike\": 230.0, \"impl_vol\": 0.271, \"open_interest\": 2870},\n    {\"secid\": 101594, \"exdate\": \"2027-01-15\", \"strike\": 95.0,  \"impl_vol\": 0.412, \"open_interest\": 611},\n]\nBATCH_2 = [\n    # 'impl_vol' renamed to 'implied_volatility'; strike now arrives as a STRING\n    # with the vendor's 1000x integer convention; open_interest can now be null.\n    {\"secid\": 108105, \"exdate\": \"2026-12-18\", \"strike\": \"220000\",\n     \"implied_volatility\": 0.291, \"open_interest\": 4500},\n    {\"secid\": 108105, \"exdate\": \"2026-12-18\", \"strike\": \"230000\",\n     \"implied_volatility\": 0.266, \"open_interest\": None},\n    {\"secid\": 101594, \"exdate\": \"2027-01-15\", \"strike\": \"95000\",\n     \"implied_volatility\": 0.401, \"open_interest\": None},\n]\n\n\ndef infer_schema(batch):\n    \"\"\"Column -> (set of non-null python type names, saw_null, n).\"\"\"\n    cols = {}\n    for row in batch:\n        for k, v in row.items():\n            t, sawnull, n = cols.get(k, (set(), False, 0))\n            if v is None:\n                sawnull = True\n            else:\n                t = t | {type(v).__name__}\n            cols[k] = (t, sawnull, n + 1)\n    return cols\n\n\ndef drift(ref, new):\n    out = []\n    for c in sorted(set(ref) - set(new)):\n        out.append((\"DROPPED\", c, f\"present in reference ({'/'.join(sorted(ref[c][0]))}), absent now\"))\n    for c in sorted(set(new) - set(ref)):\n        out.append((\"ADDED\", c, f\"new column, type {'/'.join(sorted(new[c][0])) or 'all null'}\"))\n    for c in sorted(set(ref) & set(new)):\n        rt, rn, _ = ref[c]\n        nt, nn, _ = new[c]\n        if rt != nt:\n            out.append((\"TYPE CHANGED\", c,\n                        f\"{'/'.join(sorted(rt)) or 'all null'} -> {'/'.join(sorted(nt)) or 'all null'}\"))\n        if nn and not rn:\n            out.append((\"NEWLY NULLABLE\", c, \"reference batch had no nulls; this batch does\"))\n        if rn and not nn:\n            out.append((\"NO LONGER NULL\", c, \"reference batch had nulls; this batch does not\"))\n    # a dropped/added pair with the same type is almost always a RENAME\n    dropped = {c for k, c, _ in out if k == \"DROPPED\"}\n    added = {c for k, c, _ in out if k == \"ADDED\"}\n    for d in sorted(dropped):\n        for a in sorted(added):\n            if ref[d][0] == new[a][0]:\n                out.append((\"LIKELY RENAME\", f\"{d} -> {a}\",\n                            f\"same type {'/'.join(sorted(ref[d][0]))}, one vanished as the other appeared\"))\n    return out\n\n\nref, new = infer_schema(BATCH_1), infer_schema(BATCH_2)\nprint(f\"reference columns: {sorted(ref)}\")\nprint(f\"new batch columns: {sorted(new)}\\n\")\nprint(f\"{'kind':<16}{'column':<34}detail\")\nprint(\"-\" * 92)\nfor kind, col, detail in drift(ref, new):\n    print(f\"{kind:<16}{col:<34}{detail}\")\n\nprint(f\"\\n{len(drift(ref, new))} drift findings. What each one silently breaks:\")\nprint(\"  the rename          -> a downstream .get('impl_vol') returns None for every row\")\nprint(\"  strike as a string  -> a sort or a moneyness ratio is computed lexicographically\")\nprint(\"  the 1000x units     -> strike 220 became 220000: every moneyness is off by 1000x\")\nprint(\"  newly nullable OI   -> a liquidity filter on open_interest drops 2 of 3 rows\")\nprint(\"A schema check is cheap. Every one of those four is a silent wrong answer.\")\n",
            "output": "reference columns: ['exdate', 'impl_vol', 'open_interest', 'secid', 'strike']\nnew batch columns: ['exdate', 'implied_volatility', 'open_interest', 'secid', 'strike']\n\nkind            column                            detail\n--------------------------------------------------------------------------------------------\nDROPPED         impl_vol                          present in reference (float), absent now\nADDED           implied_volatility                new column, type float\nNEWLY NULLABLE  open_interest                     reference batch had no nulls; this batch does\nTYPE CHANGED    strike                            float -> str\nLIKELY RENAME   impl_vol -> implied_volatility    same type float, one vanished as the other appeared\n\n5 drift findings. What each one silently breaks:\n  the rename          -> a downstream .get('impl_vol') returns None for every row\n  strike as a string  -> a sort or a moneyness ratio is computed lexicographically\n  the 1000x units     -> strike 220 became 220000: every moneyness is off by 1000x\n  newly nullable OI   -> a liquidity filter on open_interest drops 2 of 3 rows\nA schema check is cheap. Every one of those four is a silent wrong answer."
          }
        },
        {
          "name": "A distributional check's power depends on the batch size, not on the threshold",
          "explain": "<p>A null-rate check that compares this batch's fraction of missing values to a historical baseline via a z-score sounds like the same test regardless of how many rows the batch contains, and the snippet shows that it is not. A seven-row batch whose null rate has jumped from a 5% baseline to 28.6% -- more than five times higher -- produces a z-score of only 2.86, below a typical alert threshold of 3, because seven observations simply do not carry enough statistical power to distinguish a real shift from noise. The identical 5.7x jump measured on a 4,000-row batch produces a z-score of 68.4, an unambiguous alert, because a larger sample shrinks the standard error the z-score is divided by. The check's sensitivity is a property of the batch size, not of the underlying anomaly.</p><p>The other half of the problem is what happens once a suite runs many such checks together. At a 1% false-positive rate per check, five independent checks produce at least one false alarm on 4.9% of days -- rare enough to trust -- but 400 checks, a realistic count for a real production pipeline, produce a false alarm on 98.2% of days, or roughly once per day, even when nothing is actually wrong.</p><p>A data-quality suite sized without this arithmetic in mind fails in one of two directions: too few checks to catch a real anomaly, or so many that every alert is ignored because almost none of them mean anything.</p>",
          "formula": "P(\\ge 1\\text{ false alarm}) = 1 - (1-\\alpha)^k",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# A two-table panel plus a security master. The batch has one duplicate key,\n# two orphan ids, and a null rate that has quietly tripled.\nMASTER = {10145, 93436, 14593, 22111}\nPANEL = [(10145, \"2026-06-30\", 0.011), (93436, \"2026-06-30\", -0.004),\n         (14593, \"2026-06-30\", 0.007), (14593, \"2026-06-30\", 0.009),   # duplicate PK\n         (55555, \"2026-06-30\", 0.021), (66666, \"2026-06-30\", None),    # orphans\n         (22111, \"2026-06-30\", None)]\n\n# --- 1. primary-key uniqueness\nseen = {}\nfor pid, d, _ in PANEL:\n    seen[(pid, d)] = seen.get((pid, d), 0) + 1\ndupes = {k: v for k, v in seen.items() if v > 1}\nprint(f\"uniqueness   : {len(seen)} distinct keys for {len(PANEL)} rows; \"\n      f\"duplicated {list(dupes)}\")\n\n# --- 2. referential integrity against the security master\norphans = sorted({pid for pid, _, _ in PANEL if pid not in MASTER})\nprint(f\"referential  : {len(orphans)} ids not in the master: {orphans} \"\n      f\"({len(orphans) / len(MASTER | set(orphans)):.0%} of the union)\")\n\n# --- 3. distributional sanity: null rate against a historical baseline\nHIST_NULL_RATE, HIST_N = 0.05, 4000\nnulls = sum(1 for _, _, r in PANEL if r is None)\nn, p_hat = len(PANEL), nulls / len(PANEL)\nse = np.sqrt(HIST_NULL_RATE * (1 - HIST_NULL_RATE) / n)\nz = (p_hat - HIST_NULL_RATE) / se\nprint(f\"null rate    : {p_hat:.1%} this batch vs {HIST_NULL_RATE:.0%} baseline, \"\n      f\"z = {z:+.2f}  {'ALERT' if abs(z) > 3 else 'no alert'}\")\nz_big = (p_hat - HIST_NULL_RATE) / np.sqrt(HIST_NULL_RATE * (1 - HIST_NULL_RATE) / HIST_N)\nprint(f\"               the SAME 5.7x jump on a {HIST_N}-row batch: z = {z_big:+.1f}  ALERT\")\nprint(\"               a distributional check on 7 rows has no power at all; batch\")\nprint(\"               size, not the threshold, is what decides whether it can fire\")\n\n# --- 4. and the arithmetic that decides whether anyone will trust the alerts\nprint(\"\\nthe multiple-testing arithmetic of a data-quality suite:\")\nprint(f\"{'checks k':>9}{'alpha':>8}{'P(>=1 false alarm)':>21}{'clean days per alarm':>22}\")\nfor k in (5, 20, 100, 400):\n    for alpha in (0.01,):\n        p = 1 - (1 - alpha) ** k\n        print(f\"{k:>9}{alpha:>8.2f}{p:>20.1%}{1 / p:>22.1f}\")\nprint(\"\\nWith 400 checks at a 1% per-check false-positive rate you get an alert on\")\nprint(\"98% of perfectly good days. A suite nobody believes is worse than no suite:\")\nprint(\"size the thresholds so the aggregate false-alarm rate is what you can staff.\")\n",
            "output": "uniqueness   : 6 distinct keys for 7 rows; duplicated [(14593, '2026-06-30')]\nreferential  : 2 ids not in the master: [55555, 66666] (33% of the union)\nnull rate    : 28.6% this batch vs 5% baseline, z = +2.86  no alert\n               the SAME 5.7x jump on a 4000-row batch: z = +68.4  ALERT\n               a distributional check on 7 rows has no power at all; batch\n               size, not the threshold, is what decides whether it can fire\n\nthe multiple-testing arithmetic of a data-quality suite:\n checks k   alpha   P(>=1 false alarm)  clean days per alarm\n        5    0.01                4.9%                  20.4\n       20    0.01               18.2%                   5.5\n      100    0.01               63.4%                   1.6\n      400    0.01               98.2%                   1.0\n\nWith 400 checks at a 1% per-check false-positive rate you get an alert on\n98% of perfectly good days. A suite nobody believes is worse than no suite:\nsize the thresholds so the aggregate false-alarm rate is what you can staff."
          }
        },
        {
          "name": "Coercing a bad numeric string to NaN loses the error message; raising keeps it",
          "explain": "<p>Ten price-like strings from a messy feed contain four that are not numbers at all: a vendor sentinel (\"SUPPRESSED\"), a footnote marker glued onto a real value (\"98.75*\"), a thousands separator combined with a unit convention (\"1,002.00\"), and accounting notation for a negative (\"(0.50)\"). Parsing with errors='coerce' turns all four silently into NaN and moves on: the mean of what survives happens to equal the mean computed with full knowledge of what was dropped, because NaN is skipped by default in both cases -- meaning the information loss is invisible not once but twice, first in the parse and again in the aggregate that never flags it.</p><p>Parsing with errors='raise' stops immediately at the first bad row instead, which is safer but not by itself useful: it does not say how many rows are affected or why. A stricter middle path parses everything, reports exactly which rows failed and a plain-language reason for each, and only then decides pass or fail against an explicit bad-fraction threshold -- here, four of ten rows fail, a 40% rate that a real pipeline should gate on rather than silently coerce past.</p><p>Even the strict parser does not resolve the \"1,002.00\" row on its own: fixing the separator recovers a numeric value, 1002.00, but that value still encodes a per-$1,000-face convention the parser has no way to know about. The parser's job is only to surface that ambiguity loudly; deciding what the number actually means is a human judgment call the code should never make silently.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport pandas as pd\n\n# A TRACE-shaped price column the vendor sends as text. Four values are not\n# numbers at all: a suppressed print, a footnote, a thousands separator and a\n# parenthesised negative (accounting notation for a mark-down).\nraw = pd.Series([\"99.25\", \"100.00\", \"SUPPRESSED\", \"101.50\", \"98.75*\",\n                 \"1,002.00\", \"(0.50)\", \"97.00\", \"102.25\", \"100.75\"], name=\"px\")\n\ncoerced = pd.to_numeric(raw, errors=\"coerce\")\nprint(\"errors='coerce'  ->\", list(coerced.round(2)))\nprint(f\"  parsed {coerced.notna().sum()}/{len(raw)} rows; \"\n      f\"{coerced.isna().sum()} became NaN with no message printed anywhere\")\nprint(f\"  mean of what survived : {coerced.mean():.4f}\")\nprint(f\"  mean if you had known : {coerced.dropna().mean():.4f}  (identical -- NaN is\")\nprint(\"                          skipped by default, so the loss is invisible twice)\")\n\ntry:\n    pd.to_numeric(raw, errors=\"raise\")\nexcept (ValueError, TypeError) as exc:\n    print(f\"\\nerrors='raise'   -> {type(exc).__name__}: {str(exc)[:70]}\")\n\n# The loud version: parse, and report exactly which rows and why.\ndef strict_parse(s, *, max_bad_frac=0.0):\n    num = pd.to_numeric(s, errors=\"coerce\")\n    bad = s[num.isna() & s.notna()]\n    frac = len(bad) / len(s)\n    report = {\"n\": len(s), \"bad\": len(bad), \"bad_frac\": frac,\n              \"examples\": list(bad.items())[:5]}\n    if frac > max_bad_frac:\n        return None, report\n    return num, report\n\n\nvals, rep = strict_parse(raw)\nprint(f\"\\nstrict_parse: {rep['bad']}/{rep['n']} unparseable \"\n      f\"({rep['bad_frac']:.0%}); gate says {'FAIL' if vals is None else 'pass'}\")\nfor i, v in rep[\"examples\"]:\n    reason = {\"SUPPRESSED\": \"a sentinel, not a number\",\n              \"98.75*\": \"a footnote marker glued to a value\",\n              \"1,002.00\": \"a separator AND a convention: per $1,000 face, not per 100\",\n              \"(0.50)\": \"accounting notation for a negative\"}.get(v, \"unparseable\")\n    print(f\"  row {i:>2}  {v!r:<14} {reason}\")\n\nfixed = pd.to_numeric(raw.str.replace(\",\", \"\", regex=False)\n                         .str.rstrip(\"*\")\n                         .str.replace(r\"^\\((.*)\\)$\", r\"-\\1\", regex=True)\n                         .replace(\"SUPPRESSED\", np.nan), errors=\"raise\")\nprint(f\"\\nafter handling each case ON PURPOSE: parsed {fixed.notna().sum()}/{len(raw)}, \"\n      f\"mean {fixed.mean():.4f}\")\nprint(f\"the two means differ by {abs(coerced.mean() - fixed.mean()):.4f} \"\n      f\"({abs(coerced.mean() / fixed.mean() - 1):.1%}), all of it from one row -- and note\")\nprint(\"that the strict parser did not FIX the 1,002.00 convention, it SURFACED it.\")\nprint(\"Deciding what that row means is a human's job; the parser's job is to stop.\")\n",
            "output": "errors='coerce'  -> [99.25, 100.0, nan, 101.5, nan, nan, nan, 97.0, 102.25, 100.75]\n  parsed 6/10 rows; 4 became NaN with no message printed anywhere\n  mean of what survived : 100.1250\n  mean if you had known : 100.1250  (identical -- NaN is\n                          skipped by default, so the loss is invisible twice)\n\nerrors='raise'   -> ValueError: Unable to parse string \"SUPPRESSED\" at position 2\n\nstrict_parse: 4/10 unparseable (40%); gate says FAIL\n  row  2  'SUPPRESSED'   a sentinel, not a number\n  row  4  '98.75*'       a footnote marker glued to a value\n  row  5  '1,002.00'     a separator AND a convention: per $1,000 face, not per 100\n  row  6  '(0.50)'       accounting notation for a negative\n\nafter handling each case ON PURPOSE: parsed 9/10, mean 189.0000\nthe two means differ by 88.8750 (47.0%), all of it from one row -- and note\nthat the strict parser did not FIX the 1,002.00 convention, it SURFACED it.\nDeciding what that row means is a human's job; the parser's job is to stop."
          }
        }
      ],
      "widget": {
        "type": "histogram",
        "title": "Same 5.7x null-rate jump, two batch sizes",
        "params": {
          "sampler": "bootstrap",
          "params": {
            "n_small": 7,
            "n_large": 4000,
            "baseline_rate": 0.05,
            "observed_rate": 0.286
          },
          "bins": 20,
          "overlay": "z-score alert threshold"
        }
      },
      "pitfalls": [
        "Running a type check alone and treating anything that passes as 'clean,' when an impossible-but-valid value like a -140% return needs a range check to catch.",
        "Trusting that a vendor feed's columns are stable because no error was thrown, when a rename, a type change, or a new source of nulls can all arrive without any error at all.",
        "Sizing a distributional check's alert threshold without checking whether the batch it runs against is even large enough for the test to have any statistical power.",
        "Silently coercing unparseable numeric strings to NaN and reporting a mean over the survivors, with no record of how many rows were dropped or why."
      ],
      "check": [
        {
          "q": "A batch column has a value of -1.40 for a simple daily equity return. A type check confirms it is a valid float. What additional check is needed to catch it?",
          "options": [
            "A uniqueness check",
            "A referential-integrity check against a master table",
            "A range check, since a return below -1.0 is not merely unusual but numerically impossible for a long position",
            "No further check is needed once the type check passes"
          ],
          "answer": 2,
          "why": "A type check only confirms the value is the right kind of thing (a float); it says nothing about whether that value is a physically possible one. A range check encoding that a simple return cannot go below -100% is what actually catches a sign or units error hiding inside an otherwise well-typed number."
        },
        {
          "q": "A vendor feed renames a column and starts sending its numeric field as a string with no error thrown anywhere. What will most downstream code do?",
          "options": [
            "Raise a clear exception immediately",
            "Silently produce a wrong answer -- a lookup on the old column name returns None, or a numeric comparison runs as string comparison",
            "Automatically detect and correct the rename",
            "Refuse to load the batch at all"
          ],
          "answer": 1,
          "why": "Neither a rename nor a type change is, by itself, an error a parser or a database will complain about -- both are still syntactically valid. Code written against the old shape keeps running and keeps producing an answer, just a silently wrong one, which is exactly what a schema-drift check run on every batch is designed to surface before it does."
        },
        {
          "q": "A null-rate check flags the same 5.7x jump over baseline as an alert on a 4,000-row batch but not on a 7-row batch. This is because:",
          "options": [
            "The 7-row batch's check has a bug",
            "A z-score's statistical power depends on sample size; seven rows cannot distinguish a real shift from noise even at the same relative jump",
            "The 4,000-row batch's threshold was set differently",
            "Null rates are inherently unreliable below 100 rows for any test"
          ],
          "answer": 1,
          "why": "The same relative change produces a much larger z-score on a larger sample because the standard error shrinks with sample size. The check's sensitivity is a function of how many rows it runs against, not a fixed property of the anomaly's size -- which is exactly why alert thresholds have to be set with the batch size in mind."
        },
        {
          "q": "A data-quality suite runs 400 independent checks, each with a 1% false-positive rate. On a perfectly clean day, roughly what fraction of days will produce at least one false alarm?",
          "options": [
            "1%",
            "About 18%",
            "About 98%",
            "0%, since the checks are independent"
          ],
          "answer": 2,
          "why": "With k independent checks each at false-positive rate alpha, the chance of at least one false alarm is 1 minus (1-alpha)^k, which at k=400 and alpha=0.01 comes out to about 98%. A suite with that many checks alerts on nearly every day regardless of data quality, which is exactly why nobody ends up trusting it."
        }
      ]
    },
    {
      "n": 7,
      "title": "Caching: correctness first, hit rate second",
      "topics": [
        "memoization and its correctness precondition (pure functions)",
        "content-addressed cache keys",
        "cache invalidation: naming vs content-addressing",
        "hit rate, skew, and correctness as separate questions"
      ],
      "concepts": [
        {
          "name": "Memoization is only sound for a function that is pure -- and it will not warn you otherwise",
          "explain": "<p>Caching the result of an expensive call by its arguments -- memoization -- is safe exactly when the function being cached is pure: its answer depends only on its arguments, never on anything mutable, on the clock, or on how many times it has already been called. The snippet runs a realistic access pattern of seventeen requests across three names and several report sections that overlap heavily, and a memoized version of the same computation returns identical answers to the unmemoized version -- the maximum absolute difference between the two output sets is exactly zero -- while cutting the number of underlying computations from seventeen to ten, a 41.2% reduction in work with a 41.2% cache hit rate to match.</p><p>The precondition that made that safe is demonstrated by breaking it on purpose: a second function whose return value depends on a mutable counter incremented on every call, rather than on its argument, gets memoized identically -- and the second call to the same argument returns a stale value from the first call's counter state, which happens to look plausible because it is still just an integer. The bug is invisible in this case only because nothing about the wrong answer looks wrong.</p><p>Memoization therefore has to be a decision made about the function, not a decision made about the cache: applying @lru_cache to an impure function does not raise a warning, it just quietly starts returning history-dependent answers as if they were argument-dependent ones.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport functools\n\nCALLS = {\"raw\": 0, \"memo\": 0}\n\n\ndef realised_vol(sym, day, window):\n    \"\"\"Stands in for an expensive windowed aggregation over a tick table.\"\"\"\n    CALLS[\"raw\"] += 1\n    rng = np.random.default_rng(sum(map(ord, sym)) * 997 + day)\n    return float(np.std(rng.normal(0, 0.01, window), ddof=1) * np.sqrt(252))\n\n\n@functools.lru_cache(maxsize=128)\ndef realised_vol_memo(sym, day, window):\n    CALLS[\"memo\"] += 1\n    rng = np.random.default_rng(sum(map(ord, sym)) * 997 + day)\n    return float(np.std(rng.normal(0, 0.01, window), ddof=1) * np.sqrt(252))\n\n\n# A realistic access pattern: a 3-name x 4-day grid, visited by three different\n# report sections that overlap heavily.\nREQUESTS = ([(\"AAA\", d, 500) for d in range(4)] +\n            [(\"BBB\", d, 500) for d in range(4)] +\n            [(\"AAA\", d, 500) for d in range(4)] +           # the risk section again\n            [(\"CCC\", d, 500) for d in range(2)] +\n            [(\"AAA\", 0, 500), (\"BBB\", 1, 500), (\"AAA\", 0, 500)])\n\nraw_out = [realised_vol(*r) for r in REQUESTS]\nmemo_out = [realised_vol_memo(*r) for r in REQUESTS]\n\ninfo = realised_vol_memo.cache_info()\nprint(f\"requests issued            : {len(REQUESTS)}\")\nprint(f\"distinct (sym, day, window): {len(set(REQUESTS))}\")\nprint(f\"uncached function calls    : {CALLS['raw']}\")\nprint(f\"memoised function calls    : {CALLS['memo']}\")\nprint(f\"cache hits {info.hits}, misses {info.misses}, \"\n      f\"hit rate {info.hits / (info.hits + info.misses):.1%}\")\nprint(f\"work avoided               : {1 - CALLS['memo'] / CALLS['raw']:.1%} of the calls\")\nprint(f\"ANSWERS IDENTICAL          : {raw_out == memo_out}\")\nprint(f\"max abs difference         : {max(abs(a - b) for a, b in zip(raw_out, memo_out)):.1e}\")\n\n# The correctness precondition, stated out loud.\nprint(\"\\nmemoisation is only sound for a PURE function of its arguments.\")\ncounter = {\"n\": 0}\n\n\n@functools.lru_cache(maxsize=None)\ndef impure(day):\n    counter[\"n\"] += 1\n    return counter[\"n\"]          # depends on call history, not on `day`\n\n\nprint(f\"  impure(1) first call {impure(1)}, second call {impure(1)}, \"\n      f\"underlying invocations {counter['n']}\")\nprint(\"  the second call returned a stale answer that happened to be right;\")\nprint(\"  with a mutable default, a clock, or a file read in there, it would not be.\")\n",
            "output": "requests issued            : 17\ndistinct (sym, day, window): 10\nuncached function calls    : 17\nmemoised function calls    : 10\ncache hits 7, misses 10, hit rate 41.2%\nwork avoided               : 41.2% of the calls\nANSWERS IDENTICAL          : True\nmax abs difference         : 0.0e+00\n\nmemoisation is only sound for a PURE function of its arguments.\n  impure(1) first call 1, second call 1, underlying invocations 1\n  the second call returned a stale answer that happened to be right;\n  with a mutable default, a clock, or a file read in there, it would not be."
          }
        },
        {
          "name": "A cache key should be built from code version, parameters, and input digest -- never from the call site",
          "explain": "<p>A cache is only correct if two calls that would produce the same answer share a key and two calls that would produce different answers do not, and the snippet shows how easy it is to get this backwards by keying on something convenient instead of on the inputs themselves. Building the key as a digest of the function's code version, its parameters, and a digest of the actual data -- never the call site, the file name, or a timestamp -- makes three genuinely different call sites (report.py's positional call, risk.py's identical call with keyword arguments in a different order, and tca.py's call against a separate copy of the same underlying data) collapse to the exact same key, so only the first one actually computes anything and the other two are free cache hits.</p><p>The same key structure also correctly refuses to collapse calls that are not equivalent: changing the winsorization quantiles from (0.01, 0.99) to (0.05, 0.95) produces a different key, as it must, and bumping the function's own code_version string after a bug fix produces a different key too, even against identical data and parameters, so a stale answer computed by the old, buggy code can never be served for a request that should trigger the fixed one.</p><p>Keying on the call site instead would have produced five separate keys and five separate computations for what was really three unique calls; keying on the file name alone would have collapsed all five into one key and served two answers that were actually wrong.</p>",
          "formula": "\\text{key} = H(\\text{code\\_version} \\,\\Vert\\, \\text{params} \\,\\Vert\\, H(\\text{data}))",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\n\n# A content-addressed cache: the key is a digest of (code version, parameters,\n# input data digest). Not the call site, not the file name, not a timestamp.\nSTORE, STATS = {}, {\"hit\": 0, \"miss\": 0, \"work\": 0}\n\n\ndef digest(obj):\n    return hashlib.sha256(json.dumps(obj, sort_keys=True,\n                                     separators=(\",\", \":\")).encode()).hexdigest()\n\n\ndef cache_key(code_version, params, *input_digests):\n    return digest({\"code\": code_version, \"params\": params,\n                   \"inputs\": sorted(input_digests)})[:16]\n\n\ndef winsorised_mean(data, lo_q, hi_q, code_version=\"wm-1\"):\n    key = cache_key(code_version, {\"lo_q\": lo_q, \"hi_q\": hi_q}, digest(data))\n    if key in STORE:\n        STATS[\"hit\"] += 1\n        return STORE[key], key, \"HIT\"\n    STATS[\"miss\"] += 1\n    STATS[\"work\"] += 1\n    a = np.asarray(data, dtype=float)\n    lo, hi = np.quantile(a, [lo_q, hi_q])\n    val = float(np.clip(a, lo, hi).mean())\n    STORE[key] = val\n    return val, key, \"MISS\"\n\n\nrng = np.random.default_rng(32800)\nreturns = list(np.round(rng.normal(0, 0.02, 200), 6))\n\nprint(f\"{'call site':<44}{'key':<18}{'result':>10}  state\")\nv1, k1, s1 = winsorised_mean(returns, 0.01, 0.99)\nprint(f\"{'report.py: winsorised_mean(r, 0.01, 0.99)':<44}{k1:<18}{v1:>10.6f}  {s1}\")\nv2, k2, s2 = winsorised_mean(returns, hi_q=0.99, lo_q=0.01)      # kwargs, reordered\nprint(f\"{'risk.py:   (hi_q=0.99, lo_q=0.01)':<44}{k2:<18}{v2:>10.6f}  {s2}\")\nv3, k3, s3 = winsorised_mean(list(returns), 0.01, 0.99)          # a copy of the data\nprint(f\"{'tca.py:    same data, different object':<44}{k3:<18}{v3:>10.6f}  {s3}\")\nv4, k4, s4 = winsorised_mean(returns, 0.05, 0.95)                # different params\nprint(f\"{'report.py: (0.05, 0.95) -- new params':<44}{k4:<18}{v4:>10.6f}  {s4}\")\nv5, k5, s5 = winsorised_mean(returns, 0.01, 0.99, code_version=\"wm-2\")\nprint(f\"{'after a bug fix: code_version wm-2':<44}{k5:<18}{v5:>10.6f}  {s5}\")\n\nprint(f\"\\ncache entries {len(STORE)}, hits {STATS['hit']}, misses {STATS['miss']}, \"\n      f\"real computations {STATS['work']}\")\nprint(f\"three different call sites, one key: {k1 == k2 == k3}\")\nprint(f\"different params  -> different key : {k1 != k4}\")\nprint(f\"different code    -> different key : {k1 != k5}\")\nprint(\"\\nkeying on the call site would have given five keys and five computations;\")\nprint(\"keying on the file name would have given ONE key and two wrong answers.\")\n",
            "output": "call site                                   key                   result  state\nreport.py: winsorised_mean(r, 0.01, 0.99)   b456b2a7d526bdb1   -0.000564  MISS\nrisk.py:   (hi_q=0.99, lo_q=0.01)           b456b2a7d526bdb1   -0.000564  HIT\ntca.py:    same data, different object      b456b2a7d526bdb1   -0.000564  HIT\nreport.py: (0.05, 0.95) -- new params       db622031279e1a89   -0.000560  MISS\nafter a bug fix: code_version wm-2          571b4293dd689448   -0.000564  MISS\n\ncache entries 3, hits 2, misses 3, real computations 3\nthree different call sites, one key: True\ndifferent params  -> different key : True\ndifferent code    -> different key : True\n\nkeying on the call site would have given five keys and five computations;\nkeying on the file name would have given ONE key and two wrong answers."
          }
        },
        {
          "name": "A stale cache entry is invisible; a moved cache key is not",
          "explain": "<p>The two hard problems in caching are choosing a name for an entry and knowing when that entry is no longer valid, and the snippet shows they are really the same problem viewed two ways. A gross-exposure calculation is cached first under a human-chosen label, \"gross_eod,\" and separately under a digest of its actual inputs. Both agree with the true value while the inputs are unchanged. Then one input -- a mispriced position -- gets corrected upstream, and the true answer changes.</p><p>The named cache has no way to know anything happened: \"gross_eod\" is still \"gross_eod,\" so the stale, pre-correction value is served with a cache hit, wrong by the full size of the correction -- 4,400, or 3.4% of the true answer -- and nothing about the lookup looks any different from a correct one. The content-addressed cache's key is a digest of the actual position and price data, so the moment the price changes, the key changes with it; the old entry is not deleted, it is simply unreachable, because nothing will ever again compute that exact digest from the corrected data. The lookup misses, recomputes once, and the new entry matches the corrected truth exactly.</p><p>Querying the content cache again after that recomputation is a clean hit with zero further work, matching the correct answer -- confirming that content addressing costs nothing extra on the happy path and, on the invalidation path, dissolves a problem that a named cache cannot solve at all without someone remembering to invalidate it by hand.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\n\n# A slow join-and-aggregate, cached two ways. The upstream table then gets a\n# corrected row -- the everyday event that separates the two schemes.\nPOS = [(\"AAA\", 1000), (\"BBB\", -400), (\"CCC\", 250)]\nPRC = {\"AAA\": 100.0, \"BBB\": 50.0, \"CCC\": 20.0}\nWORK = {\"n\": 0}\n\n\ndef gross_exposure(pos, prc):\n    WORK[\"n\"] += 1\n    return round(sum(abs(q) * prc[s] for s, q in pos), 2)\n\n\ndef digest(obj):\n    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:12]\n\n\nname_cache, content_cache = {}, {}\n\n\ndef by_name(pos, prc, label):\n    \"\"\"Key = a human-chosen label. Naming problem #1.\"\"\"\n    if label in name_cache:\n        return name_cache[label], \"HIT\"\n    v = gross_exposure(pos, prc)\n    name_cache[label] = v\n    return v, \"MISS\"\n\n\ndef by_content(pos, prc):\n    \"\"\"Key = a digest of the actual inputs. Invalidation becomes automatic.\"\"\"\n    k = digest([sorted(pos), sorted(prc.items())])\n    if k in content_cache:\n        return content_cache[k], \"HIT\", k\n    v = gross_exposure(pos, prc)\n    content_cache[k] = v\n    return v, \"MISS\", k\n\n\ntruth0 = gross_exposure(POS, PRC)\nprint(f\"truth with the original prices : {truth0}\")\na, sa = by_name(POS, PRC, \"gross_eod\")\nb, sb, kb = by_content(POS, PRC)\nprint(f\"named cache   {a:>10.2f} {sa}      content cache {b:>10.2f} {sb} key {kb}\")\n\nPRC = dict(PRC, BBB=61.0)          # upstream correction: BBB was mismarked\ntruth1 = gross_exposure(POS, PRC)\na, sa = by_name(POS, PRC, \"gross_eod\")\nb, sb, kb = by_content(POS, PRC)\nprint(f\"\\nafter the BBB price correction, truth = {truth1}\")\nprint(f\"named cache   {a:>10.2f} {sa}   <- STALE, wrong by {truth1 - a:.2f} \"\n      f\"({abs(truth1 - a) / truth1:.1%})\")\nprint(f\"content cache {b:>10.2f} {sb} key {kb}  <- key moved because the input moved\")\n\nprint(f\"\\nunderlying computations performed: {WORK['n']}\")\nprint(f\"named-cache answer equals truth   : {a == truth1}\")\nprint(f\"content-cache answer equals truth : {b == truth1}\")\n\n# Prove the cached path agrees with the uncached path on a repeat, doing no work.\nbefore = WORK[\"n\"]\nagain, s_again, _ = by_content(POS, PRC)\nprint(f\"\\nrepeat query: {again} {s_again}, extra computations \"\n      f\"{WORK['n'] - before}, matches uncached answer {again == truth1}\")\nprint(\"\\nthe two hard cache problems are naming and invalidation. Content addressing\")\nprint(\"dissolves both: the name IS the content, so a stale entry is unreachable.\")\n",
            "output": "truth with the original prices : 125000.0\nnamed cache    125000.00 MISS      content cache  125000.00 MISS key 89416a8a4cb3\n\nafter the BBB price correction, truth = 129400.0\nnamed cache    125000.00 HIT   <- STALE, wrong by 4400.00 (3.4%)\ncontent cache  129400.00 MISS key 07c462fcbd31  <- key moved because the input moved\n\nunderlying computations performed: 5\nnamed-cache answer equals truth   : False\ncontent-cache answer equals truth : True\n\nrepeat query: 129400.0 HIT, extra computations 0, matches uncached answer True\n\nthe two hard cache problems are naming and invalidation. Content addressing\ndissolves both: the name IS the content, so a stale entry is unreachable."
          }
        },
        {
          "name": "Hit rate and correctness are orthogonal; a high hit rate is exactly how staleness hides",
          "explain": "<p>Cache capacity trades cost for hit rate in a way that is easy to measure and easy to mistake for the whole story. Against a request stream over 200 keys with a realistic Zipf-shaped popularity skew -- the top 20 keys already account for 68% of all requests, the top 50 for 81% -- an LRU cache's hit rate rises steeply with capacity: 6.5% at capacity 1, up through 95.1% once the cache is large enough to hold every key. Every one of these configurations, at every capacity, returns answers identical to the uncached computation, because eviction never corrupts a value, it only decides how often the value has to be recomputed.</p><p>Correctness and hit rate are measured completely separately, though, and the snippet shows why that separation matters: a cache of capacity zero is perfectly correct and simply useless, with a 0% hit rate and every answer still right, while a cache with unlimited capacity but one entry that was poisoned once and never invalidated reaches a 100% hit rate while returning wrong answers on 0.4% of all requests -- 16 out of 4,000 -- with every single one of those wrong answers arriving as a confident, fast cache hit.</p><p>A high hit rate is therefore not evidence that a cache is behaving correctly; it is, if anything, exactly the condition under which a stale entry is hardest to notice, because a hit never announces itself as suspicious the way a slow, uncached recomputation might.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nfrom collections import OrderedDict\n\n# A request stream over 200 keys with a Zipf-like popularity profile: a research\n# notebook re-asks about the same few names over and over.\nrng = np.random.default_rng(32800)\nNKEYS, NREQ = 200, 4000\nw = 1.0 / (np.arange(1, NKEYS + 1) ** 1.1)\nw /= w.sum()\nSTREAM = rng.choice(NKEYS, size=NREQ, p=w)\n\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap, self.d, self.hit, self.miss = cap, OrderedDict(), 0, 0\n\n    def get(self, k, compute):\n        if k in self.d:\n            self.hit += 1\n            self.d.move_to_end(k)\n            return self.d[k]\n        self.miss += 1\n        v = compute(k)\n        self.d[k] = v\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)\n        return v\n\n\ndef compute(k):\n    return float(k) * 1.5            # stands in for an expensive aggregation\n\n\ntruth = [compute(int(k)) for k in STREAM]\nprint(f\"{'capacity':>9}{'keys':>6}{'hits':>7}{'misses':>8}{'hit rate':>10}\"\n      f\"{'work saved':>12}{'answers correct':>17}\")\nfor cap in (1, 5, 20, 50, 200):\n    c = LRU(cap)\n    out = [c.get(int(k), compute) for k in STREAM]\n    print(f\"{cap:>9}{NKEYS:>6}{c.hit:>7}{c.miss:>8}{c.hit / NREQ:>9.1%}\"\n          f\"{1 - c.miss / NREQ:>11.1%}{str(out == truth):>17}\")\n\nprint(f\"\\nthe top 20 keys are {w[:20].sum():.0%} of all requests and the top 50 \"\n      f\"are {w[:50].sum():.0%};\")\nprint(\"that skew, not the cache size, is what makes caching worth doing here.\")\n\n# Correctness and hit rate are orthogonal. A cache can be perfectly correct\n# and useless, or extremely effective and wrong.\nc0 = LRU(0)\nout0 = [c0.get(int(k), compute) for k in STREAM]\nprint(f\"\\ncapacity 0 : hit rate {c0.hit / NREQ:.0%}, answers correct {out0 == truth}\")\nbroken = {int(k): compute(int(k)) for k in STREAM}\nbroken[int(STREAM[0])] += 1.0        # one poisoned entry, never invalidated\nout_b = [broken[int(k)] for k in STREAM]\nwrong = sum(1 for a, b in zip(out_b, truth) if a != b)\nprint(f\"capacity inf, one stale entry: hit rate 100%, wrong answers \"\n      f\"{wrong}/{NREQ} ({wrong / NREQ:.1%})\")\nprint(\"\\nMeasure them separately. Hit rate is a cost question you may trade away;\")\nprint(\"correctness is not, and a high hit rate is exactly how a stale entry hides.\")\n",
            "output": " capacity  keys   hits  misses  hit rate  work saved  answers correct\n        1   200    261    3739     6.5%       6.5%             True\n        5   200   1055    2945    26.4%      26.4%             True\n       20   200   2233    1767    55.8%      55.8%             True\n       50   200   2940    1060    73.5%      73.5%             True\n      200   200   3805     195    95.1%      95.1%             True\n\nthe top 20 keys are 68% of all requests and the top 50 are 81%;\nthat skew, not the cache size, is what makes caching worth doing here.\n\ncapacity 0 : hit rate 0%, answers correct True\ncapacity inf, one stale entry: hit rate 100%, wrong answers 16/4000 (0.4%)\n\nMeasure them separately. Hit rate is a cost question you may trade away;\ncorrectness is not, and a high hit rate is exactly how a stale entry hides."
          }
        }
      ],
      "widget": null,
      "pitfalls": [
        "Applying @lru_cache or an equivalent to a function whose result depends on mutable state, wall-clock time, or call history, producing stale-but-plausible answers with no warning.",
        "Keying a cache by call site or by file name instead of by the actual parameters and input data, either recomputing needlessly or serving a wrong answer to a different call that happens to share a name.",
        "Relying on a named cache entry to become stale visibly, when nothing about a cache hit ever announces that the underlying data has since changed.",
        "Reporting a cache's hit rate as evidence it is working correctly, when hit rate and correctness are independent measurements and a high hit rate is exactly what makes a stale entry hard to notice."
      ],
      "check": [
        {
          "q": "A function's cached result depends on a mutable counter that increments on every call, not on the function's argument. Memoizing this function will:",
          "options": [
            "Raise an error the first time it is called twice with the same argument",
            "Correctly cache nothing, since the cache detects impurity",
            "Return a stale, history-dependent value on the second call that looks like a normal, plausible answer",
            "Only fail if the function also touches the filesystem"
          ],
          "answer": 2,
          "why": "A cache has no way to know whether a function is pure; it only stores the last return value for a given argument. If the true return value depends on something other than the argument, the cache will happily serve a stale answer, and because that answer is still a syntactically valid value, nothing about the failure looks wrong."
        },
        {
          "q": "Two different call sites invoke the same function with the same underlying data but pass its keyword arguments in a different order. A cache keyed on (code version, parameters, input digest) will treat these two calls as:",
          "options": [
            "Different, since the call sites differ",
            "The same, since the parameters and the underlying data are identical regardless of argument order or call site",
            "Different, since keyword order changes the key",
            "Undefined behavior"
          ],
          "answer": 1,
          "why": "The key is built from the parameters' actual values and a digest of the data, not from where or how the call was written. Two calls that would produce the same answer collapse to the same key, so the second call is served as a free cache hit rather than recomputed."
        },
        {
          "q": "An upstream price correction changes the true value of a cached calculation. A cache keyed by a human-chosen label will:",
          "options": [
            "Automatically detect the change and recompute",
            "Continue to serve the old, now-incorrect value under the same label, with no indication anything is wrong",
            "Raise a warning that the underlying data changed",
            "Return a null value until manually cleared"
          ],
          "answer": 1,
          "why": "A named cache's key does not depend on the data at all, so a change to the underlying inputs has no effect on whether the label still resolves to an old entry. It does, and the stale value is served as a normal-looking hit -- the exact failure mode content-addressed caching is designed to make impossible."
        },
        {
          "q": "An unlimited-capacity cache reaches a 100% hit rate but has one entry that was never invalidated after an input changed. This cache is:",
          "options": [
            "Necessarily correct, since a 100% hit rate means every answer was computed once and reused consistently",
            "Potentially serving wrong answers on every request that hits the stale entry, since hit rate and correctness are measured independently",
            "Impossible, since unlimited capacity guarantees correctness",
            "Only a problem if the hit rate were lower"
          ],
          "answer": 1,
          "why": "Hit rate measures how often a cache avoids recomputation; it says nothing about whether the stored value is still correct. A stale entry that is never evicted or invalidated will keep being served as a confident hit for every request that maps to it, regardless of how high the overall hit rate looks."
        }
      ]
    },
    {
      "n": 8,
      "title": "Scale: what a query actually has to touch",
      "topics": [
        "memory footprint: typed columns vs strings vs objects",
        "partition pruning: files scanned vs rows kept",
        "join fan-out and cross-join blowup",
        "hash partitioning skew and salting"
      ],
      "concepts": [
        {
          "name": "The question is never how big the dataset is -- it is how big the part your query touches is",
          "explain": "<p>A back-of-envelope memory estimate, done once in writing before any code runs, prevents an expensive surprise: ten typed columns at 50 bytes per row, confirmed against a real numpy allocation that lands at exactly 50 bytes per row, scale linearly and predictably -- 100 million rows already needs roughly 14 GB once a conservative 3x working-set multiplier for copies and intermediate results is applied, which does not fit comfortably in a 16 GB machine's usable memory, and everything past that is simply infeasible on a single box without changing the approach.</p><p>The same data stored as \"everything is a string,\" the natural output of a naive CSV read with one Python object per field, is roughly 10x larger in memory than the typed columnar form -- 5.7 million bytes for 10,000 rows against 500,000 bytes typed -- purely from Python object overhead and string boxing, with no additional information gained.</p><p>The number that actually matters for a research pipeline is not the size of a full dataset but the size of what a specific query has to read: one day of a liquid futures contract at 40 million messages is 1.9 GB, a full trading year of that is half a terabyte, but the two-column, one-hour slice a typical research question actually needs is a tenth of a gigabyte. Sizing a pipeline around \"how big is the whole history\" instead of \"how big is the part this query touches\" leads to solving the wrong scaling problem.</p>",
          "formula": "\\text{bytes} = n_{rows} \\times \\sum_i \\text{itemsize}(c_i)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# Back of the envelope, done once, in writing, before anyone writes a read_csv.\nSCHEMA = [(\"ts_ns\", \"int64\"), (\"sym_id\", \"int32\"), (\"px\", \"float64\"),\n          (\"size\", \"int32\"), (\"bid\", \"float64\"), (\"ask\", \"float64\"),\n          (\"bid_sz\", \"int32\"), (\"ask_sz\", \"int32\"), (\"venue\", \"int8\"),\n          (\"cond\", \"int8\")]\nwidth = sum(np.dtype(t).itemsize for _, t in SCHEMA)\nprint(f\"{len(SCHEMA)} typed columns, {width} bytes per row\")\n\n# Calibrate the arithmetic against a real allocation, so it is not hand-waving.\narr = np.zeros(10_000, dtype=np.dtype(SCHEMA))\nprint(f\"10,000 rows really allocated: {arr.nbytes:,} bytes = {arr.nbytes / 10_000:.0f} B/row\"\n      f\"  (predicted {width})\\n\")\n\nRAM_GB = 16.0\nUSABLE = 0.4                      # what you actually get to use: copies, index, engine\nprint(f\"{'rows':>15}{'raw GB':>10}{'x3 working set':>16}\"\n      f\"   fits in {RAM_GB:.0f}GB x {USABLE:.0%}?\")\nfor rows in (1e6, 1e7, 1e8, 1e9, 1e10):\n    gb = rows * width / 1024 ** 3\n    print(f\"{int(rows):>15,}{gb:>10.2f}{gb * 3:>16.2f}    \"\n          f\"{'yes' if gb * 3 < RAM_GB * USABLE else 'NO'}\")\n\nprint(f\"\\nthe same table as 'everything is a string' CSV, ~44 B/row and a python\")\nprint(\"object per field, is roughly 10x the in-memory footprint of the typed form.\")\nobj = np.array([(\"x\",) * len(SCHEMA)] * 10_000, dtype=object)\nprint(f\"  10,000 rows as python objects: {obj.nbytes + 10_000 * len(SCHEMA) * 49:,} bytes \"\n      f\"(array + ~49B per small str)\")\n\n# One day of a liquid future, and one year of it.\nday_rows = 40e6\nprint(f\"\\none day of a liquid future at {int(day_rows):,} messages: \"\n      f\"{day_rows * width / 1024 ** 3:.1f} GB\")\nprint(f\"one year of trading days (252)              : \"\n      f\"{252 * day_rows * width / 1024 ** 4:.1f} TB\")\nprint(f\"the subset you usually need (2 columns, 1 hour): \"\n      f\"{day_rows / 6.5 * 16 / 1024 ** 3:.2f} GB\")\nprint(\"\\nThat last line is the whole of week 8: the question is never 'how big is\")\nprint(\"the dataset', it is 'how big is the part of it this query has to read'.\")\n",
            "output": "10 typed columns, 50 bytes per row\n10,000 rows really allocated: 500,000 bytes = 50 B/row  (predicted 50)\n\n           rows    raw GB  x3 working set   fits in 16GB x 40%?\n      1,000,000      0.05            0.14    yes\n     10,000,000      0.47            1.40    yes\n    100,000,000      4.66           13.97    NO\n  1,000,000,000     46.57          139.70    NO\n 10,000,000,000    465.66         1396.98    NO\n\nthe same table as 'everything is a string' CSV, ~44 B/row and a python\nobject per field, is roughly 10x the in-memory footprint of the typed form.\n  10,000 rows as python objects: 5,700,000 bytes (array + ~49B per small str)\n\none day of a liquid future at 40,000,000 messages: 1.9 GB\none year of trading days (252)              : 0.5 TB\nthe subset you usually need (2 columns, 1 hour): 0.09 GB\n\nThat last line is the whole of week 8: the question is never 'how big is\nthe dataset', it is 'how big is the part of it this query has to read'."
          }
        },
        {
          "name": "Partitioning makes the file path carry a predicate -- filter on anything else and you read everything",
          "explain": "<p>A dataset partitioned by date and symbol into a hundred files lets a query engine skip entire files without opening them, but only if the filter is written against the columns the partitioning actually uses. The snippet's 200,000-row, hundred-file dataset shows this cleanly: filtering on date alone opens exactly the five files for that date, filtering on symbol alone opens the twenty files for that symbol, and filtering on both together opens exactly the one matching file -- in every one of these cases, the rows scanned equal the rows kept, a wasted-read factor of 1.0x.</p><p>Filtering on px, an ordinary numeric column that is not part of the partitioning scheme, breaks this completely: the engine has no choice but to open all hundred files and scan all 200,000 rows to find the 285 that actually satisfy the condition, a 701.8x wasted-read factor. Running the identical filter against a single unpartitioned file containing the same data is somewhat better -- a 100.0x wasted-read factor -- because that file at least has no partitioning overhead to begin with, but it is still nowhere close to the 1.0x a well-chosen partition key achieves.</p><p>Partitioning is therefore not a form of compression; it is a way of encoding a predicate directly into the filesystem, so that a query engine's file-listing step alone -- before it opens a single byte of any file -- can already rule out most of the dataset. Choosing the partition key means choosing, in advance, which column a pipeline's queries will actually be cheap to filter on.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport os\nimport tempfile\n\nimport pyarrow as pa\nimport pyarrow.dataset as ds\nimport pyarrow.parquet as pq\n\n# 20 days x 5 symbols of synthetic tape, written as a hive-partitioned dataset.\nrng = np.random.default_rng(32800)\nDAYS = [f\"2026-09-{d:02d}\" for d in range(1, 21)]\nSYMS = [\"ESZ6\", \"NQZ6\", \"CLX6\", \"GCZ6\", \"ZNZ6\"]\nPER = 2_000\nrows = {\"date\": [], \"sym\": [], \"px\": [], \"qty\": []}\nfor d in DAYS:\n    for s in SYMS:\n        rows[\"date\"] += [d] * PER\n        rows[\"sym\"] += [s] * PER\n        rows[\"px\"] += list(np.round(100 + rng.normal(0, 1, PER), 3))\n        rows[\"qty\"] += list(rng.integers(1, 20, PER))\ntbl = pa.table(rows)\n\nwith tempfile.TemporaryDirectory() as root:\n    part = os.path.join(root, \"partitioned\")\n    flat = os.path.join(root, \"flat.parquet\")\n    pq.write_to_dataset(tbl, part, partition_cols=[\"date\", \"sym\"])\n    pq.write_table(tbl, flat)\n\n    dset = ds.dataset(part, format=\"parquet\", partitioning=\"hive\")\n    nfrag = len(list(dset.get_fragments()))\n    print(f\"dataset: {tbl.num_rows:,} rows, {nfrag} partition files \"\n          f\"({len(DAYS)} dates x {len(SYMS)} symbols)\")\n\n    def scanned(dataset, flt):\n        frags = list(dataset.get_fragments(filter=flt)) if flt is not None \\\n            else list(dataset.get_fragments())\n        return len(frags), sum(f.count_rows() for f in frags)\n\n    print(f\"\\n{'query':<42}{'files':>7}{'rows scanned':>14}{'rows kept':>11}{'waste':>8}\")\n    queries = [\n        (\"everything\", None),\n        (\"date = 2026-09-07\", ds.field(\"date\") == \"2026-09-07\"),\n        (\"sym = CLX6\", ds.field(\"sym\") == \"CLX6\"),\n        (\"date = 2026-09-07 AND sym = CLX6\",\n         (ds.field(\"date\") == \"2026-09-07\") & (ds.field(\"sym\") == \"CLX6\")),\n        (\"px > 103  (NOT a partition column)\", ds.field(\"px\") > 103.0),\n    ]\n    for label, flt in queries:\n        nf, ns = scanned(dset, flt)\n        kept = dset.count_rows(filter=flt) if flt is not None else tbl.num_rows\n        print(f\"{label:<42}{nf:>7}{ns:>14,}{kept:>11,}{ns / max(kept, 1):>7.1f}x\")\n\n    nf, ns = scanned(ds.dataset(flat, format=\"parquet\"),\n                     (ds.field(\"date\") == \"2026-09-07\") & (ds.field(\"sym\") == \"CLX6\"))\n    print(f\"{'same query on the UNpartitioned file':<42}{nf:>7}{ns:>14,}\"\n          f\"{PER:>11,}{ns / PER:>7.1f}x\")\n\nprint(\"\\npartitioning is not compression; it is a way of making the FILE PATH carry\")\nprint(\"a predicate, so a filter on it eliminates whole files without opening them.\")\nprint(\"Filter on a non-partition column and you are back to reading everything --\")\nprint(\"which is why the partition key must be the column your queries actually use.\")\n",
            "output": "dataset: 200,000 rows, 100 partition files (20 dates x 5 symbols)\n\nquery                                       files  rows scanned  rows kept   waste\neverything                                    100       200,000    200,000    1.0x\ndate = 2026-09-07                               5        10,000     10,000    1.0x\nsym = CLX6                                     20        40,000     40,000    1.0x\ndate = 2026-09-07 AND sym = CLX6                1         2,000      2,000    1.0x\npx > 103  (NOT a partition column)            100       200,000        285  701.8x\nsame query on the UNpartitioned file            1       200,000      2,000  100.0x\n\npartitioning is not compression; it is a way of making the FILE PATH carry\na predicate, so a filter on it eliminates whole files without opening them.\nFilter on a non-partition column and you are back to reading everything --\nwhich is why the partition key must be the column your queries actually use."
          }
        },
        {
          "name": "A join's row count can be sized before running it -- and a cross join is the size you get by accident",
          "explain": "<p>Joining a position table to a price table that unexpectedly carries more than one row per (symbol, date) key -- a preliminary print alongside a final one, say -- produces exactly as many output rows as the sum, over every key, of the two tables' row counts at that key, and that product blows up silently rather than erroring. The snippet's naive equi-join on a duplicated price table returns 64 rows and $638,400 of notional against a correct 40 rows and $400,000 once the join is restricted to one row per key -- an overcount of exactly 1.60x, matching the average number of price rows per key in the dirty table.</p><p>Forgetting the join condition entirely produces the extreme version of the same failure: a cross join of the same two tables returns 2,560 rows, forty times sixty-four, every combination of every row in one table with every row in the other. The size of a cross join is knowable in advance and grows as the product of the two table sizes rather than their sum, so a cross join at a million rows on each side is not merely large, it is 10^12 rows -- tens of thousands of gigabytes at even a modest fifty bytes per row.</p><p>A cross join is therefore the one query whose exact output size can be computed before it ever runs, and it is also the query people run by accident most often, usually by forgetting a join condition rather than by intending one. Counting expected rows before running any join, especially a suspicious one, catches both failures before they become a P&amp;L number that looks merely a little too big.</p>",
          "formula": "|\\text{cross join}| = m \\times n",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Two tables you intend to join on (sym, date). The RIGHT table accidentally\n# carries more than one row per key -- a vendor sent both a preliminary and a\n# final record for some days, and nobody checked.\ncx = sqlite3.connect(\":memory:\")\ncx.executescript(\"CREATE TABLE pos(sym TEXT, dt TEXT, qty INT);\"\n                 \"CREATE TABLE prc(sym TEXT, dt TEXT, px REAL, vintage TEXT);\")\nSYMS, DATES = [\"AAA\", \"BBB\", \"CCC\", \"DDD\"], [f\"2026-09-{d:02d}\" for d in range(1, 11)]\ncx.executemany(\"INSERT INTO pos VALUES (?,?,?)\",\n               [(s, d, 100) for s in SYMS for d in DATES])\nprc = [(s, d, 100.0, \"final\") for s in SYMS for d in DATES]\nprc += [(s, d, 99.5, \"prelim\") for s in SYMS for d in DATES[:4]]      # the duplicates\nprc += [(s, d, 99.0, \"restated\") for s in SYMS for d in DATES[:2]]    # and again\ncx.executemany(\"INSERT INTO prc VALUES (?,?,?,?)\", prc)\ncx.commit()\n\nn_pos = cx.execute(\"SELECT COUNT(*) FROM pos\").fetchone()[0]\nn_prc = cx.execute(\"SELECT COUNT(*) FROM prc\").fetchone()[0]\nprint(f\"pos {n_pos} rows, prc {n_prc} rows\")\n\n# The fan-out check you run BEFORE the join, not after the P&L looks wrong.\nfan = cx.execute(\"SELECT MAX(c), AVG(c) FROM (SELECT COUNT(*) c FROM prc\"\n                 \" GROUP BY sym, dt)\").fetchone()\nprint(f\"rows per (sym, dt) in prc: max {fan[0]}, mean {fan[1]:.2f}  \"\n      f\"-> expected output rows = sum_k a_k*b_k\")\n\njoined = cx.execute(\"SELECT COUNT(*), SUM(qty*px) FROM pos p JOIN prc q\"\n                    \" ON p.sym=q.sym AND p.dt=q.dt\").fetchone()\ndedup = cx.execute(\"SELECT COUNT(*), SUM(qty*px) FROM pos p JOIN prc q\"\n                   \" ON p.sym=q.sym AND p.dt=q.dt AND q.vintage='final'\").fetchone()\nprint(f\"\\n{'join':<34}{'rows out':>10}{'notional':>14}{'vs correct':>12}\")\nprint(f\"{'naive equi-join':<34}{joined[0]:>10}{joined[1]:>14,.0f}\"\n      f\"{joined[1] / dedup[1]:>11.2f}x\")\nprint(f\"{'join to one row per key':<34}{dedup[0]:>10}{dedup[1]:>14,.0f}{1.0:>11.2f}x\")\n\n# And the cross join, which is what a forgotten ON clause actually is.\ncross = cx.execute(\"SELECT COUNT(*) FROM pos, prc\").fetchone()[0]\nprint(f\"\\ncross join pos x prc : {cross:,} rows ({n_pos} x {n_prc})\")\nprint(f\"{'m':>9} {'n':>9}{'cross rows':>14}{'at 50 B/row':>16}\")\nfor m, n in ((1e3, 1e3), (1e4, 1e4), (1e5, 1e5), (1e6, 1e6)):\n    r = m * n\n    print(f\"{int(m):>9,} {int(n):>9,}{r:>14.0e}{r * 50 / 1024 ** 3:>13,.1f} GB\")\nprint(\"\\nA cross join is the one query whose output you can size exactly before\")\nprint(\"running it, and the one people run by accident. Count rows first.\")\n",
            "output": "pos 40 rows, prc 64 rows\nrows per (sym, dt) in prc: max 3, mean 1.60  -> expected output rows = sum_k a_k*b_k\n\njoin                                rows out      notional  vs correct\nnaive equi-join                           64       638,400       1.60x\njoin to one row per key                   40       400,000       1.00x\n\ncross join pos x prc : 2,560 rows (40 x 64)\n        m         n    cross rows     at 50 B/row\n    1,000     1,000         1e+06          0.0 GB\n   10,000    10,000         1e+08          4.7 GB\n  100,000   100,000         1e+10        465.7 GB\n1,000,000 1,000,000         1e+12     46,566.1 GB\n\nA cross join is the one query whose output you can size exactly before\nrunning it, and the one people run by accident. Count rows first."
          }
        },
        {
          "name": "Hashing a key does not fix skew -- it decides which single worker gets stuck with the biggest key",
          "explain": "<p>Splitting a distributed job into partitions by hashing a key looks like it should spread load evenly, and it does when no single key dominates the distribution; it does not when one key is genuinely 55% of the traffic, which is exactly the front-month-contract situation the snippet models. Hashing 200,000 rows across 400 symbol keys into sixteen partitions produces a maximum partition of 111,819 rows against a mean of 12,500 -- an 8.95x skew -- and since a distributed stage finishes only when its slowest partition finishes, the wall-clock cost of that stage is set by the 111,819-row partition, not by the 12,500-row average everyone else waits on it to catch up to.</p><p>Increasing the number of partitions does not fix this, because hashing a single key always sends every one of that key's rows to exactly one partition no matter how many partitions exist: at 1,024 partitions the skew has actually grown to 561.97x, since the dominant key's rows are now concentrated against an even smaller mean. The floor is set directly by the dominant key's share of the traffic -- 55% of rows on one key means the maximum possible skew can never fall below 0.55 times the partition count, for any number of partitions.</p><p>The standard fix, salting, deliberately splits the hottest keys across several artificial sub-keys before hashing, then re-aggregates the results in a second pass: salting the two hottest keys eight ways here brings the skew down from 8.95x to 2.26x, at the explicit cost of that extra aggregation step -- the same DAG discipline, the same idempotency rules, applied to one more failure mode that only appears once a pipeline stops running on a single machine.</p>",
          "formula": "\\text{skew} = \\frac{\\max_p \\text{count}(p)}{\\text{mean}_p \\text{count}(p)}",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\n\n# A distributed engine is the week-4 DAG with each task split into P parallel\n# partitions. The one new failure mode is SKEW: hash the key, and the biggest\n# key still lands entirely on one worker.\nrng = np.random.default_rng(32800)\nN, P = 200_000, 16\n\n# A realistic symbol mix: one dominant front-month contract plus a long tail.\nSYMS = [f\"S{i:03d}\" for i in range(400)]\nw = np.concatenate([[0.55, 0.12, 0.06], np.full(397, 0.27 / 397)])\nkeys = rng.choice(SYMS, size=N, p=w)\n\n\ndef part_of(k, p):\n    return int(hashlib.md5(k.encode()).hexdigest(), 16) % p\n\n\ndef skew(counts):\n    c = np.asarray(counts, dtype=float)\n    return c.max() / c.mean()\n\n\ncounts = np.zeros(P, dtype=int)\nfor k in keys:\n    counts[part_of(k, P)] += 1\nprint(f\"{N:,} rows, {len(SYMS)} distinct keys, {P} partitions\")\nprint(f\"hash partitioning by key : min {counts.min():,}  mean {counts.mean():,.0f}  \"\n      f\"max {counts.max():,}  SKEW {skew(counts):.2f}x\")\nprint(f\"a level finishes when its SLOWEST partition finishes, so the wall-clock\")\nprint(f\"cost is set by {counts.max():,} rows, not by {counts.mean():,.0f}.\")\n\n# More partitions do not fix key skew: one key cannot be split by hashing.\nprint(f\"\\n{'partitions':>11}{'max part':>11}{'mean':>10}{'skew':>8}\")\nfor p in (4, 16, 64, 256, 1024):\n    c = np.zeros(p, dtype=int)\n    for k in keys:\n        c[part_of(k, p)] += 1\n    print(f\"{p:>11}{c.max():>11,}{c.mean():>10,.0f}{skew(c):>7.2f}x\")\ntop = (keys == \"S000\").sum()\nprint(f\"floor: key S000 alone is {top:,} rows ({top / N:.0%}); no hash of the key\")\nprint(\"can put it on two workers, so skew >= 0.55 * P no matter what P is.\")\n\n# The standard fix: salt the hot keys, aggregate twice.\nSALTS = 8\nc2 = np.zeros(P, dtype=int)\nfor i, k in enumerate(keys):\n    salt = i % SALTS if k in (\"S000\", \"S001\") else 0\n    c2[part_of(f\"{k}#{salt}\", P)] += 1\nprint(f\"\\nsalting the two hottest keys {SALTS} ways: max {c2.max():,}  \"\n      f\"SKEW {skew(c2):.2f}x  (from {skew(counts):.2f}x)\")\nprint(\"The cost is a second aggregation pass to re-combine the salted groups.\")\nprint(\"Same DAG, same idempotency rules, same quality gates -- one more failure mode.\")\n",
            "output": "200,000 rows, 400 distinct keys, 16 partitions\nhash partitioning by key : min 2,161  mean 12,500  max 111,819  SKEW 8.95x\na level finishes when its SLOWEST partition finishes, so the wall-clock\ncost is set by 111,819 rows, not by 12,500.\n\n partitions   max part      mean    skew\n          4    122,150    50,000   2.44x\n         16    111,819    12,500   8.95x\n         64    110,603     3,125  35.39x\n        256    109,760       781 140.49x\n       1024    109,760       195 561.97x\nfloor: key S000 alone is 109,599 rows (55%); no hash of the key\ncan put it on two workers, so skew >= 0.55 * P no matter what P is.\n\nsalting the two hottest keys 8 ways: max 28,244  SKEW 2.26x  (from 8.95x)\nThe cost is a second aggregation pass to re-combine the salted groups.\nSame DAG, same idempotency rules, same quality gates -- one more failure mode."
          }
        }
      ],
      "widget": {
        "type": "heatmap",
        "title": "Hash partitioning skew across partition counts",
        "params": {
          "matrix": [
            [
              122150,
              50000
            ],
            [
              111819,
              12500
            ],
            [
              110603,
              3125
            ],
            [
              109760,
              781
            ],
            [
              109760,
              195
            ]
          ],
          "xlabels": [
            "max partition rows",
            "mean partition rows"
          ],
          "ylabels": [
            "4 partitions",
            "16 partitions",
            "64 partitions",
            "256 partitions",
            "1024 partitions"
          ],
          "cmap": "heat"
        }
      },
      "pitfalls": [
        "Estimating a table's total size and stopping there, instead of estimating the size of the specific columns and rows a given query will actually read.",
        "Choosing a partition scheme without checking that it matches the columns queries will filter on -- a filter on any other column reads every partition anyway.",
        "Running a join without first sizing its expected output, and only discovering after the fact that a duplicated key or a missing condition produced a fan-out or a cross join.",
        "Adding more partitions to fix load imbalance in a distributed job, when the imbalance is caused by one dominant key that hashing can never split across workers."
      ],
      "check": [
        {
          "q": "A 100M-row typed table needs roughly 14GB including working-set overhead, on a machine with 16GB of RAM. The most useful next question for sizing this pipeline is:",
          "options": [
            "How much RAM would 1 billion rows need",
            "How big is the specific slice of columns and rows a given research query actually reads",
            "Whether to buy a bigger machine immediately",
            "Whether CSV would use less memory"
          ],
          "answer": 1,
          "why": "Total dataset size only matters if a query genuinely needs to hold the whole thing in memory at once. Most research queries need a narrow slice -- a few columns, a bounded time window -- and sizing a pipeline around that actual working set, rather than the full historical size, is usually what makes an apparently infeasible dataset entirely tractable."
        },
        {
          "q": "A dataset is partitioned by date and symbol. A query filters only on price. The engine will:",
          "options": [
            "Use the date and symbol partitioning to skip most files anyway",
            "Have to scan every partition file, since the filter column is not part of the partitioning scheme",
            "Automatically re-partition the data by price",
            "Return an error, since the filter does not match the partition scheme"
          ],
          "answer": 1,
          "why": "Partition pruning only works when a filter is written against the columns the data is actually partitioned by. A filter on any other column, however selective, gives the engine no information it can use to skip a file's contents ahead of opening it, so every partition file must be scanned."
        },
        {
          "q": "A right-hand join table unexpectedly has 1.6 duplicate rows per key on average. The resulting equi-join's row count relative to a correctly deduplicated join will be:",
          "options": [
            "Identical, since SQL joins deduplicate automatically",
            "Roughly 1.6 times larger, matching the average duplication factor",
            "Exactly double, regardless of the duplication factor",
            "Smaller, since duplicates get merged"
          ],
          "answer": 1,
          "why": "A join's output row count for a given key is the product of the row counts on each side at that key; if one side averages 1.6 rows per key instead of 1, the join's total output scales up by roughly that same factor -- exactly the 1.60x overcount the snippet measures against the correctly deduplicated join."
        },
        {
          "q": "A distributed job hashes rows across 16 partitions, and a single key accounts for 55% of all rows. Increasing the partition count to 1024 will:",
          "options": [
            "Roughly fix the skew, since more partitions spread load more evenly",
            "Fail to fix the skew, and can make the relative skew worse, since hashing always sends one key's rows to exactly one partition",
            "Guarantee perfectly even load",
            "Only help if the key's rows are also sorted"
          ],
          "answer": 1,
          "why": "Hashing routes every row for a given key to exactly one partition, no matter how many partitions exist, so a dominant key's rows can never be split across workers by adding more partitions. The measured skew in the snippet actually increases at higher partition counts, because the mean partition size shrinks while the dominant key's partition size does not."
        }
      ]
    },
    {
      "n": 9,
      "title": "SQL in practice: joins, windows, and reading a query plan",
      "topics": [
        "inner vs left joins and unmapped keys",
        "window functions: PARTITION BY, LAG/LEAD, moving averages, RANK",
        "indexes and reading EXPLAIN QUERY PLAN",
        "identifier mapping tables and validity windows"
      ],
      "concepts": [
        {
          "name": "An inner join is a filter wearing a join's clothes",
          "explain": "<p>Joining a trades table to a security master to attach sector information looks harmless until one symbol has no row in the master at all, and an inner join's default behavior is to simply drop that trade rather than surface the problem. The snippet's seven trades include one, DDD, with no master row; an inner join returns six rows and silently drops $3,400 of notional -- 11.1% of the total -- with no error, no warning, and no visible sign in the output that anything is missing.</p><p>A left join keeps that row, returning all seven trades with a null sector for the unmatched one, which is what actually makes the gap visible: grouping by sector with COALESCE(sector, '&lt;unmapped&gt;') shows the unmapped flow as its own explicit 11.1% share of the aggregate, sitting alongside tech's 62.0% and energy's 26.9%, rather than vanishing into a total that quietly no longer adds up to the true notional.</p><p>The check that belongs inside the pipeline itself, not in a person's head at review time, is a simple assertion on the match rate -- matched rows divided by total rows, 85.7% here -- with a threshold below which the pipeline should fail loudly rather than continue with an unnoticed gap. An inner join used as if it were a full outer view of the data is, functionally, a filter: it removes exactly the rows a pipeline most needs to know about.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\ncx = sqlite3.connect(\":memory:\")\ncx.executescript(\"\"\"\nCREATE TABLE trades(tid INT PRIMARY KEY, sym TEXT, ts INT, px REAL, qty INT);\nCREATE TABLE master(sym TEXT PRIMARY KEY, sector TEXT, adv INT);\n\"\"\")\nTRADES = [(1, \"AAA\", 100, 10.00, 500), (2, \"AAA\", 140, 10.02, 300),\n          (3, \"BBB\", 110,  7.50, 900), (4, \"BBB\", 175,  7.48, 200),\n          (5, \"CCC\", 130, 20.10, 150), (6, \"CCC\", 190, 20.05, 400),\n          (7, \"DDD\", 160,  4.25, 800)]          # DDD is NOT in the master\nMASTER = [(\"AAA\", \"tech\", 1_000_000), (\"BBB\", \"energy\", 400_000),\n          (\"CCC\", \"tech\", 250_000), (\"EEE\", \"financials\", 90_000)]\ncx.executemany(\"INSERT INTO trades VALUES (?,?,?,?,?)\", TRADES)\ncx.executemany(\"INSERT INTO master VALUES (?,?,?)\", MASTER)\ncx.commit()\n\nq = lambda s: cx.execute(s).fetchall()\ninner = q(\"SELECT COUNT(*), SUM(t.qty*t.px) FROM trades t JOIN master m USING(sym)\")\nleft = q(\"SELECT COUNT(*), SUM(t.qty*t.px) FROM trades t LEFT JOIN master m USING(sym)\")\nprint(f\"{'join':<12}{'rows':>6}{'notional':>12}\")\nprint(f\"{'INNER':<12}{inner[0][0]:>6}{inner[0][1]:>12,.0f}\")\nprint(f\"{'LEFT':<12}{left[0][0]:>6}{left[0][1]:>12,.0f}\")\nprint(f\"the INNER join silently dropped {left[0][0] - inner[0][0]} row \"\n      f\"({(left[0][1] - inner[0][1]) / left[0][1]:.1%} of notional)\")\n\nprint(\"\\nthe row that vanished, found by asking for it:\")\nfor r in q(\"\"\"SELECT t.sym, t.qty*t.px AS notional FROM trades t\n              LEFT JOIN master m USING(sym) WHERE m.sym IS NULL\"\"\"):\n    print(f\"  {r[0]}  notional {r[1]:,.0f}  -- no security-master row\")\n\nprint(\"\\naggregate by sector, with the unmapped flow made VISIBLE:\")\nprint(f\"{'sector':<14}{'trades':>7}{'notional':>12}{'share':>8}\")\nfor r in q(\"\"\"SELECT COALESCE(m.sector, '<unmapped>') AS sector, COUNT(*) n,\n                     SUM(t.qty*t.px) notional\n              FROM trades t LEFT JOIN master m USING(sym)\n              GROUP BY sector ORDER BY notional DESC\"\"\"):\n    print(f\"{r[0]:<14}{r[1]:>7}{r[2]:>12,.0f}{r[2] / left[0][1]:>8.1%}\")\n\nprint(\"\\nand the check that belongs in the pipeline, not in your head:\")\nfor r in q(\"\"\"SELECT (SELECT COUNT(*) FROM trades) AS trades,\n                     (SELECT COUNT(*) FROM trades t JOIN master m USING(sym)) AS matched,\n                     (SELECT COUNT(DISTINCT sym) FROM trades WHERE sym NOT IN\n                        (SELECT sym FROM master)) AS unmapped_syms\"\"\"):\n    print(f\"  trades {r[0]}, matched {r[1]}, unmapped symbols {r[2]}  \"\n          f\"-> match rate {r[1] / r[0]:.1%}\")\nprint(\"Assert on the match rate. An inner join is a filter wearing a join's clothes.\")\n",
            "output": "join          rows    notional\nINNER            6      27,287\nLEFT             7      30,687\nthe INNER join silently dropped 1 row (11.1% of notional)\n\nthe row that vanished, found by asking for it:\n  DDD  notional 3,400  -- no security-master row\n\naggregate by sector, with the unmapped flow made VISIBLE:\nsector         trades    notional   share\ntech                4      19,041   62.0%\nenergy              2       8,246   26.9%\n<unmapped>          1       3,400   11.1%\n\nand the check that belongs in the pipeline, not in your head:\n  trades 7, matched 6, unmapped symbols 1  -> match rate 85.7%\nAssert on the match rate. An inner join is a filter wearing a join's clothes."
          }
        },
        {
          "name": "Window functions answer per-symbol questions that a self-join would need three of",
          "explain": "<p>Computing a running position, a lagged return, a time to the next print, a moving average, and a within-symbol rank -- five different per-row questions, each needing to look at other rows -- is exactly what SQL window functions are for, and the snippet runs all five over an eighteen-row, three-symbol tape in a single query using PARTITION BY sym ORDER BY ts. Each window function restarts its computation independently within each symbol's partition: a running signed position resets naturally at the start of each symbol's rows, a LAG-based return in basis points has no previous price to compare against on each symbol's very first row, and a three-row moving average only ever averages rows belonging to the same symbol.</p><p>That partition boundary is not a convenience, it is a correctness requirement. The query confirms three rows have a null LAG -- one per symbol, exactly the first print of each -- when PARTITION BY is present; dropping PARTITION BY collapses the whole table into one ordering, and now only one row in the entire table has a null LAG, because every symbol's first print silently borrows its \"previous price\" from whichever other symbol happened to sort immediately before it. The resulting return, computed across two economically unrelated instruments, comes out as thousands of basis points of pure artifact.</p><p>The same three questions without window functions would require three separate self-joins or a full round trip through pandas; PARTITION BY answers all of them in one pass over the data, correctly, as long as the partition key matches what the question is actually about.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Synthetic trade/quote-shaped rows: three symbols, six prints each.\nrng = np.random.default_rng(32800)\nrows, tid = [], 0\nfor sym, p0 in ((\"AAA\", 100.0), (\"BBB\", 50.0), (\"CCC\", 20.0)):\n    px = p0\n    for k in range(6):\n        px = round(px + rng.normal(0, 0.05), 4)\n        tid += 1\n        rows.append((tid, sym, 1000 + 10 * k, px,\n                     int(rng.integers(1, 6)) * 100, \"B\" if k % 2 == 0 else \"S\"))\n\ncx = sqlite3.connect(\":memory:\")\ncx.execute(\"CREATE TABLE tape(tid INT PRIMARY KEY, sym TEXT, ts INT, px REAL,\"\n           \" qty INT, side TEXT)\")\ncx.executemany(\"INSERT INTO tape VALUES (?,?,?,?,?,?)\", rows)\ncx.commit()\n\nQ = \"\"\"\nSELECT sym, ts, px, qty, side,\n       SUM(CASE side WHEN 'B' THEN qty ELSE -qty END)\n           OVER (PARTITION BY sym ORDER BY ts)                  AS signed_cum,\n       LAG(px)  OVER (PARTITION BY sym ORDER BY ts)             AS prev_px,\n       LEAD(ts) OVER (PARTITION BY sym ORDER BY ts)             AS next_ts,\n       AVG(px)  OVER (PARTITION BY sym ORDER BY ts\n                      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS ma3,\n       RANK()   OVER (PARTITION BY sym ORDER BY qty DESC)       AS qty_rank\nFROM tape ORDER BY sym, ts\"\"\"\n\nprint(f\"{'sym':<5}{'ts':>6}{'px':>9}{'qty':>5}{'sd':>4}{'cum':>7}\"\n      f\"{'ret_bps':>9}{'gap':>5}{'ma3':>9}{'rank':>5}\")\nfor r in cx.execute(Q):\n    sym, ts, px, qty, side, cum, prev, nxt, ma3, rk = r\n    ret = \"\" if prev is None else f\"{1e4 * (px / prev - 1):+.1f}\"\n    gap = \"\" if nxt is None else str(nxt - ts)\n    print(f\"{sym:<5}{ts:>6}{px:>9.4f}{qty:>5}{side:>4}{cum:>7}\"\n          f\"{ret:>9}{gap:>5}{ma3:>9.4f}{rk:>5}\")\n\nprint(\"\\nthe same three questions without window functions would be three\")\nprint(\"self-joins or a pandas round trip. Note what PARTITION BY buys you:\")\nfirsts = cx.execute(\"\"\"SELECT sym, COUNT(*) FROM (\n    SELECT sym, LAG(px) OVER (PARTITION BY sym ORDER BY ts) AS p FROM tape)\n    WHERE p IS NULL GROUP BY sym\"\"\").fetchall()\nprint(f\"  rows with a NULL lag (one per symbol, not one in total): {firsts}\")\nbad = cx.execute(\"\"\"SELECT COUNT(*) FROM (\n    SELECT LAG(px) OVER (ORDER BY ts) AS p FROM tape) WHERE p IS NULL\"\"\").fetchone()[0]\nprint(f\"  drop PARTITION BY and only {bad} row has a NULL lag: every symbol's\")\nprint(\"  first print now takes its 'previous price' from a DIFFERENT symbol,\")\nprint(\"  which is a return of thousands of basis points out of thin air.\")\n",
            "output": "sym      ts       px  qty  sd    cum  ret_bps  gap      ma3 rank\nAAA    1000 100.0664  200   B    200            10 100.0664    4\nAAA    1010 100.0633  400   S   -200     -0.3   10 100.0649    2\nAAA    1020 100.0169  200   B      0     -4.6   10 100.0489    4\nAAA    1030 100.0014  500   S   -500     -1.5   10 100.0272    1\nAAA    1040 100.0113  300   B   -200     +1.0   10 100.0099    3\nAAA    1050 100.0426  200   S   -400     +3.1      100.0184    4\nBBB    1000  49.9614  500   B    500            10  49.9614    1\nBBB    1010  49.8838  300   S    200    -15.5   10  49.9226    4\nBBB    1020  49.8947  200   B    400     +2.2   10  49.9133    5\nBBB    1030  49.9349  200   S    200     +8.1   10  49.9045    5\nBBB    1040  49.9266  500   B    700     -1.7   10  49.9187    1\nBBB    1050  49.9136  400   S    300     -2.6       49.9250    3\nCCC    1000  19.9036  100   B    100            10  19.9036    5\nCCC    1010  19.8293  400   S   -300    -37.3   10  19.8665    3\nCCC    1020  19.8068  100   B   -200    -11.3   10  19.8466    5\nCCC    1030  19.7875  400   S   -600     -9.7   10  19.8079    3\nCCC    1040  19.7281  500   B   -100    -30.0   10  19.7741    1\nCCC    1050  19.7118  500   S   -600     -8.3       19.7425    1\n\nthe same three questions without window functions would be three\nself-joins or a pandas round trip. Note what PARTITION BY buys you:\n  rows with a NULL lag (one per symbol, not one in total): [('AAA', 1), ('BBB', 1), ('CCC', 1)]\n  drop PARTITION BY and only 1 row has a NULL lag: every symbol's\n  first print now takes its 'previous price' from a DIFFERENT symbol,\n  which is a return of thousands of basis points out of thin air."
          }
        },
        {
          "name": "Read the query plan, not the clock: SCAN means every row, SEARCH USING INDEX means a B-tree probe",
          "explain": "<p>Joining a 20,000-row trade tape to a 2,000-row master table on an unindexed column forces a nested-loop plan: for every one of the 20,000 outer rows, scan the entire 2,000-row master looking for a match, 40 million comparisons total. EXPLAIN QUERY PLAN says exactly this before a single row is fetched -- and in this snippet's unindexed case, it also reveals that SQLite built its own temporary index on the fly to avoid the very worst case, paying that build cost inside the query, every single time the query runs, rather than once at schema-creation time.</p><p>Adding a real index on master(sym) changes the plan to SEARCH ... USING INDEX, which is a B-tree probe per outer row rather than a linear scan: the comparison count drops to 20,000 times ceil(log2 (2,000)), about 220,000, a 182x reduction, while the result set is confirmed bit-for-bit identical to the unindexed version. A further covering index on (sector, sym) changes the plan again, letting the engine answer the query's WHERE clause directly from the index without a separate lookup into the master table's rows at all.</p><p>The asymptotic gap between these plans -- n times m for a scan versus n times log m for an index probe -- is exactly why an unindexed research join that feels fine at a few thousand rows becomes unusable as the underlying panel grows, and why reading the plan an engine actually chose, rather than just timing the query once, is the only way to know which regime a given join is really running in.</p>",
          "formula": "\\text{nested loop: } O(n\\cdot m) \\quad\\text{vs.}\\quad \\text{indexed: } O(n\\log m)",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Two tables, joined on sym. No indexes to start with.\nrng = np.random.default_rng(32800)\nNT, NM = 20_000, 2_000\nsyms = [f\"S{i:04d}\" for i in range(NM)]\ncx = sqlite3.connect(\":memory:\")\ncx.executescript(\"CREATE TABLE tape(tid INT, sym TEXT, px REAL);\"\n                 \"CREATE TABLE master(sym TEXT, sector TEXT);\")\ncx.executemany(\"INSERT INTO tape VALUES (?,?,?)\",\n               [(i, syms[int(rng.integers(0, NM))], 100.0) for i in range(NT)])\ncx.executemany(\"INSERT INTO master VALUES (?,?)\",\n               [(s, \"tech\" if i % 3 == 0 else \"other\") for i, s in enumerate(syms)])\ncx.commit()\n\nSQL = (\"SELECT COUNT(*) FROM tape t JOIN master m ON t.sym = m.sym \"\n       \"WHERE m.sector = 'tech'\")\n\n\ndef plan(c, sql):\n    return [r[-1] for r in c.execute(\"EXPLAIN QUERY PLAN \" + sql)]\n\n\nprint(\"no index:\")\nfor line in plan(cx, SQL):\n    print(\"   \", line)\nn0 = cx.execute(SQL).fetchone()[0]\n# nested-loop cost, counted by hand: for each tape row, scan the whole master\nmanual_scan_no_idx = NT * NM\nprint(f\"    result {n0:,} rows; nested-loop comparisons if scanned: \"\n      f\"{NT:,} x {NM:,} = {manual_scan_no_idx:,}\")\n\ncx.execute(\"CREATE INDEX ix_master_sym ON master(sym)\")\ncx.execute(\"ANALYZE\")\nprint(\"\\nwith an index on master(sym):\")\nfor line in plan(cx, SQL):\n    print(\"   \", line)\nn1 = cx.execute(SQL).fetchone()[0]\nmanual_idx = NT * int(np.ceil(np.log2(NM)))\nprint(f\"    result {n1:,} rows (identical: {n0 == n1}); B-tree probes: \"\n       f\"{NT:,} x ceil(log2 {NM:,}) = {manual_idx:,}\")\nprint(f\"    work ratio: {manual_scan_no_idx / manual_idx:,.0f}x fewer comparisons\")\n\ncx.execute(\"CREATE INDEX ix_master_sector_sym ON master(sector, sym)\")\ncx.execute(\"ANALYZE\")\nprint(\"\\nwith a covering index on master(sector, sym):\")\nfor line in plan(cx, SQL):\n    print(\"   \", line)\nprint(f\"    result {cx.execute(SQL).fetchone()[0]:,} rows\")\n\nprint(\"\\nnote the first plan: with no index available sqlite BUILT one on the fly\")\nprint(\"(AUTOMATIC COVERING INDEX) -- it paid the build cost inside the query,\")\nprint(\"every time you run it, instead of once at schema time.\")\nprint(\"\\nread the plan, not the clock. SCAN means every row; SEARCH ... USING INDEX\")\nprint(\"means a B-tree probe per outer row. The asymptotics are n*m versus n*log m,\")\nprint(\"and that gap is why an unindexed research join dies as the panel grows.\")\n",
            "output": "no index:\n    SCAN m\n    SEARCH t USING AUTOMATIC COVERING INDEX (sym=?)\n    result 6,762 rows; nested-loop comparisons if scanned: 20,000 x 2,000 = 40,000,000\n\nwith an index on master(sym):\n    SCAN t\n    BLOOM FILTER ON m (sym=?)\n    SEARCH m USING INDEX ix_master_sym (sym=?)\n    result 6,762 rows (identical: True); B-tree probes: 20,000 x ceil(log2 2,000) = 220,000\n    work ratio: 182x fewer comparisons\n\nwith a covering index on master(sector, sym):\n    SCAN t\n    SEARCH m USING COVERING INDEX ix_master_sector_sym (sector=? AND sym=?)\n    result 6,762 rows\n\nnote the first plan: with no index available sqlite BUILT one on the fly\n(AUTOMATIC COVERING INDEX) -- it paid the build cost inside the query,\nevery time you run it, instead of once at schema time.\n\nread the plan, not the clock. SCAN means every row; SEARCH ... USING INDEX\nmeans a B-tree probe per outer row. The asymptotics are n*m versus n*log m,\nand that gap is why an unindexed research join dies as the panel grows."
          }
        },
        {
          "name": "A ticker is a display label, not a primary key -- joining on one invents rows that never happened",
          "explain": "<p>Linking an options table, keyed by the vendor's own secid, to an equity table keyed by a permanent permno requires a mapping table, and the snippet shows what goes wrong when that mapping is joined on the one identifier both sides happen to share superficially: the ticker. A ticker like \"OLD\" gets reassigned to a different underlying security after the original one changes its symbol, so the same ticker string legitimately refers to two different securities at two different points in time.</p><p>Joining the mapping purely on ticker, with no time bound, produces five rows where the truth is three: the naive join invents two entirely fictitious (date, secid, permno) combinations, pairing the reassigned ticker's later options data with the wrong equity's price history, simply because both rows happen to share the string \"OLD.\" The correct join instead uses the mapping's stable identifier, secid, together with a validity window -- the option's date falling BETWEEN the mapping row's start and stop dates -- and returns exactly the three combinations that actually existed.</p><p>The general rule this demonstrates is that a join key has to be chosen on the basis of how stable its meaning is over time, not on the basis of which column happens to appear in both tables. When the mapping between two identifier systems genuinely can change -- and ticker reassignment is one of the most common ways it does -- the mapping table itself needs a validity window, and every join against it needs a BETWEEN clause to respect it, or the join will fabricate rows that look exactly as plausible as the real ones.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport sqlite3\n\n# Two sources, two identifier systems. Equity prices key on a permanent id;\n# the options file keys on the vendor's own secid; a ticker is the only thing\n# they share -- and tickers get REUSED.\ncx = sqlite3.connect(\":memory:\")\ncx.executescript(\"\"\"\nCREATE TABLE eq(permno INT, dt TEXT, px REAL);\nCREATE TABLE opt(secid INT, dt TEXT, ticker TEXT, iv REAL);\nCREATE TABLE xmap(permno INT, secid INT, ticker TEXT, start TEXT, stop TEXT);\n\"\"\")\ncx.executemany(\"INSERT INTO eq VALUES (?,?,?)\",\n               [(10145, \"2026-03-31\", 210.0), (10145, \"2026-09-30\", 224.0),\n                (77777, \"2026-03-31\",  12.0), (77777, \"2026-09-30\",  14.0)])\ncx.executemany(\"INSERT INTO opt VALUES (?,?,?,?)\",\n               [(108105, \"2026-03-31\", \"OLD\", 0.28), (108105, \"2026-09-30\", \"NEW\", 0.31),\n                (999999, \"2026-09-30\", \"OLD\", 0.55)])      # ticker OLD was REASSIGNED\ncx.executemany(\"INSERT INTO xmap VALUES (?,?,?,?,?)\",\n               [(10145, 108105, \"OLD\", \"2000-01-01\", \"2026-06-30\"),\n                (10145, 108105, \"NEW\", \"2026-07-01\", \"9999-12-31\"),\n                (77777, 999999, \"OLD\", \"2026-07-01\", \"9999-12-31\")])\n\nnaive = cx.execute(\"\"\"\n  SELECT o.dt, o.ticker, o.secid, e.permno, e.px, o.iv\n  FROM opt o JOIN xmap m ON m.ticker = o.ticker          -- ticker only\n             JOIN eq e ON e.permno = m.permno AND e.dt = o.dt\n  ORDER BY o.dt, o.ticker\"\"\").fetchall()\n\ncorrect = cx.execute(\"\"\"\n  SELECT o.dt, o.ticker, o.secid, e.permno, e.px, o.iv\n  FROM opt o JOIN xmap m ON m.secid = o.secid            -- the stable id\n             AND o.dt BETWEEN m.start AND m.stop         -- and the validity window\n             JOIN eq e ON e.permno = m.permno AND e.dt = o.dt\n  ORDER BY o.dt, o.ticker\"\"\").fetchall()\n\nprint(f\"{'join':<10}{'rows':>6}   (dt, ticker, secid, permno, px, iv)\")\nfor name, rs in ((\"naive\", naive), (\"correct\", correct)):\n    print(f\"{name:<10}{len(rs):>6}\")\n    for r in rs:\n        print(f\"            {r}\")\n\nnk = {(r[0], r[2], r[3]) for r in naive}\nck = {(r[0], r[2], r[3]) for r in correct}\nprint(f\"\\n(dt, secid, permno) triples the naive join invented : {sorted(nk - ck)}\")\nprint(f\"triples it missed                                 : {sorted(ck - nk) or 'none'}\")\nprint(f\"rows out: naive {len(naive)} vs correct {len(correct)} -- a fan-out from\"\n      \" a non-unique key\")\nprint(\"\\nthe rule: join on the most stable identifier you have, and if the mapping\")\nprint(\"itself changes over time, the mapping table needs a validity window and the\")\nprint(\"join needs a BETWEEN. A ticker is a display label, not a primary key.\")\n",
            "output": "join        rows   (dt, ticker, secid, permno, px, iv)\nnaive          5\n            ('2026-03-31', 'OLD', 108105, 10145, 210.0, 0.28)\n            ('2026-03-31', 'OLD', 108105, 77777, 12.0, 0.28)\n            ('2026-09-30', 'NEW', 108105, 10145, 224.0, 0.31)\n            ('2026-09-30', 'OLD', 999999, 10145, 224.0, 0.55)\n            ('2026-09-30', 'OLD', 999999, 77777, 14.0, 0.55)\ncorrect        3\n            ('2026-03-31', 'OLD', 108105, 10145, 210.0, 0.28)\n            ('2026-09-30', 'NEW', 108105, 10145, 224.0, 0.31)\n            ('2026-09-30', 'OLD', 999999, 77777, 14.0, 0.55)\n\n(dt, secid, permno) triples the naive join invented : [('2026-03-31', 108105, 77777), ('2026-09-30', 999999, 10145)]\ntriples it missed                                 : none\nrows out: naive 5 vs correct 3 -- a fan-out from a non-unique key\n\nthe rule: join on the most stable identifier you have, and if the mapping\nitself changes over time, the mapping table needs a validity window and the\njoin needs a BETWEEN. A ticker is a display label, not a primary key."
          }
        }
      ],
      "widget": {
        "type": "orderbook",
        "title": "The trade/quote tape behind this week's window-function example",
        "params": {
          "levels": 5,
          "spread": 0.02,
          "seed": 32800
        }
      },
      "pitfalls": [
        "Using an inner join between a fact table and a reference table and treating the absence of an error as evidence nothing was dropped, when an inner join silently filters out any row with no match.",
        "Forgetting PARTITION BY in a window function computed over multiple symbols or accounts, letting one entity's calculation quietly borrow a value from a completely different entity.",
        "Judging a join's performance from how long it took once, rather than from EXPLAIN QUERY PLAN's SCAN/SEARCH distinction, and missing that an index would change the plan's asymptotics entirely.",
        "Joining two tables on a ticker or other display label without a validity window, when the same label can be legitimately reassigned to a different underlying security over time."
      ],
      "check": [
        {
          "q": "A trades table is joined to a security master with an inner join, and one symbol has no row in the master. The inner join will:",
          "options": [
            "Raise a foreign-key error",
            "Include the trade with a null sector",
            "Silently drop the unmatched trade and its notional from the result, with no error",
            "Include the trade twice"
          ],
          "answer": 2,
          "why": "An inner join only returns rows with a match on both sides, so a trade with no corresponding master row is simply excluded -- not flagged, not nulled, just absent -- which is why an inner join used where a left join and an explicit unmapped-rate check were needed can hide a real gap in coverage."
        },
        {
          "q": "A window function computing LAG(px) over a table of multiple symbols' prints, without PARTITION BY sym, will:",
          "options": [
            "Correctly compute each symbol's previous price independently",
            "Compute a 'previous price' that can come from a different symbol entirely, whenever that symbol's rows are adjacent in the chosen ORDER BY",
            "Raise an error, since LAG requires a partition",
            "Return null for every row"
          ],
          "answer": 1,
          "why": "Without PARTITION BY, LAG operates over the entire result set in whatever order it was sorted, so a symbol's first row picks up the 'previous' value from whichever row -- possibly a completely different symbol -- happens to sort immediately before it. The partition clause is what restricts the lookback to rows belonging to the same entity."
        },
        {
          "q": "EXPLAIN QUERY PLAN shows SEARCH master USING INDEX ix_master_sym instead of SCAN master. This means the query engine is now performing:",
          "options": [
            "A full linear scan of the master table for every outer row, same as before",
            "A B-tree probe per outer row, which is asymptotically n log m rather than n times m comparisons",
            "A cross join",
            "No comparisons at all"
          ],
          "answer": 1,
          "why": "SCAN means the engine reads every row of a table; SEARCH USING INDEX means it performs a B-tree lookup per outer row instead. That changes the join's cost from proportional to the product of the two table sizes to proportional to one table size times the log of the other -- the exact 182x reduction in comparisons measured in the snippet."
        },
        {
          "q": "An options table and an equity table share only a ticker symbol as a common field, and that ticker was reassigned to a different security at some point. Joining purely on ticker will:",
          "options": [
            "Correctly link the tables, since ticker is a reliable shared key",
            "Produce extra, fictitious row combinations pairing data from the wrong time period or the wrong underlying security",
            "Fail with a duplicate-key error",
            "Only be a problem if the ticker was reassigned more than once"
          ],
          "answer": 1,
          "why": "A ticker is a label, not a stable identifier -- when it is reassigned, the same string legitimately refers to two different securities at two different times. A join on ticker alone cannot distinguish between them and will fabricate combinations that pair one period's options data with the wrong period's or the wrong security's equity data, exactly the fan-out the snippet measures."
        }
      ]
    },
    {
      "n": 10,
      "title": "Capstone: review, lineage, and reproducibility",
      "topics": [
        "a PR review checklist with blocking vs nit-level findings",
        "data lineage: ancestry, descendants, and fingerprint propagation",
        "a reproducibility manifest: code, data, environment, parameters",
        "putting weeks 1-9 together in one pipeline run"
      ],
      "concepts": [
        {
          "name": "A PR review checklist separates what is blocking from what is a nit -- and both need evidence, not opinion",
          "explain": "<p>Reviewing a pull request against a fixed, weighted checklist -- does it rerun clean from a clean state, are inputs pinned, is the output diff explained by the input diff, is there an as-of predicate on every time-series join, and five more -- turns \"this looks fine to me\" into a specific, falsifiable verdict. The snippet scores three real-shaped PRs against nine such checklist items and reaches three different verdicts: a TRACE loader that fails only the low-weight \"cost stated in rows/bytes\" item earns APPROVE WITH NITS; a \"small fix to the signal\" that fails to pin its inputs and cannot explain its own output diff earns REQUEST CHANGES; a join speedup that cannot rerun clean from a clean state earns REQUEST CHANGES on that basis alone.</p><p>Four items are marked blocking rather than a nit, and each is blocking for the same underlying reason: it cannot be verified after the fact by someone other than the author. A result that only reproduces once is an anecdote; an output that changed for an unexplained reason is itself the bug report, not a detail to note in passing; a lookahead in a time-series join is invisible in the diff and only shows up, much later, as an implausibly good backtest; and unpinned inputs make \"it worked yesterday\" a claim nobody, including the author in six months, can check.</p><p>The checklist's purpose is not to catch every possible mistake -- it is to guarantee that the mistakes it does catch are the ones a reviewer, working only from the diff, actually has the evidence to catch.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\n# The checklist a reviewer actually works through on a pipeline pull request.\n# Each item is a QUESTION WITH EVIDENCE, not an opinion.\nCHECKLIST = [\n    (\"reruns_clean\", \"Does it run twice from a clean state and give the same output?\", 3),\n    (\"inputs_pinned\", \"Are input dataset versions / digests pinned in the change?\", 3),\n    (\"output_diff_explained\", \"Is the diff of the OUTPUT explained by the diff of the INPUT?\", 3),\n    (\"schema_declared\", \"Is the output schema declared and checked at the boundary?\", 2),\n    (\"idempotent_write\", \"Is the write an upsert / partition swap, not a blind append?\", 2),\n    (\"no_lookahead\", \"Does every time-series join use an as-of predicate?\", 3),\n    (\"tests_added\", \"Is there a test that fails without this change?\", 2),\n    (\"cost_stated\", \"Is the change's cost stated in rows/bytes read?\", 1),\n    (\"lineage_emitted\", \"Does the run emit the code version, params and input digests?\", 2),\n]\n\nPRS = {\n    \"PR 412  add TRACE loader\": {\n        \"reruns_clean\": True, \"inputs_pinned\": True, \"output_diff_explained\": True,\n        \"schema_declared\": True, \"idempotent_write\": True, \"no_lookahead\": True,\n        \"tests_added\": True, \"cost_stated\": False, \"lineage_emitted\": True},\n    \"PR 418  'small fix' to the signal\": {\n        \"reruns_clean\": True, \"inputs_pinned\": False, \"output_diff_explained\": False,\n        \"schema_declared\": True, \"idempotent_write\": True, \"no_lookahead\": True,\n        \"tests_added\": False, \"cost_stated\": False, \"lineage_emitted\": True},\n    \"PR 421  speed up the funda join\": {\n        \"reruns_clean\": False, \"inputs_pinned\": True, \"output_diff_explained\": True,\n        \"schema_declared\": False, \"idempotent_write\": False, \"no_lookahead\": True,\n        \"tests_added\": True, \"cost_stated\": True, \"lineage_emitted\": False},\n}\nBLOCKERS = {\"reruns_clean\", \"output_diff_explained\", \"no_lookahead\", \"inputs_pinned\"}\n\n\ndef review(answers):\n    got = sum(w for k, _, w in CHECKLIST if answers.get(k))\n    tot = sum(w for _, _, w in CHECKLIST)\n    fails = [k for k, _, _ in CHECKLIST if not answers.get(k)]\n    blocking = sorted(set(fails) & BLOCKERS)\n    return got, tot, fails, blocking\n\n\nfor name, answers in PRS.items():\n    got, tot, fails, blocking = review(answers)\n    verdict = \"REQUEST CHANGES\" if blocking else (\"APPROVE\" if not fails else \"APPROVE with nits\")\n    print(f\"{name}\")\n    print(f\"  weighted score {got}/{tot}   verdict: {verdict}\")\n    if blocking:\n        for k in blocking:\n            q = next(q for kk, q, _ in CHECKLIST if kk == k)\n            print(f\"    BLOCKING  {k:<22} {q}\")\n    nits = [k for k in fails if k not in blocking]\n    if nits:\n        print(f\"    nits      {', '.join(nits)}\")\n    print()\n\nprint(\"the four blocking items are the ones a reviewer cannot verify later:\")\nprint(\"  reruns_clean          -- otherwise the result is an anecdote\")\nprint(\"  output_diff_explained -- an unexplained output change IS the bug report\")\nprint(\"  no_lookahead          -- invisible in the diff, fatal in the backtest\")\nprint(\"  inputs_pinned         -- without it, 'it worked yesterday' is unfalsifiable\")\n",
            "output": "PR 412  add TRACE loader\n  weighted score 20/21   verdict: APPROVE with nits\n    nits      cost_stated\n\nPR 418  'small fix' to the signal\n  weighted score 12/21   verdict: REQUEST CHANGES\n    BLOCKING  inputs_pinned          Are input dataset versions / digests pinned in the change?\n    BLOCKING  output_diff_explained  Is the diff of the OUTPUT explained by the diff of the INPUT?\n    nits      tests_added, cost_stated\n\nPR 421  speed up the funda join\n  weighted score 12/21   verdict: REQUEST CHANGES\n    BLOCKING  reruns_clean           Does it run twice from a clean state and give the same output?\n    nits      schema_declared, idempotent_write, lineage_emitted\n\nthe four blocking items are the ones a reviewer cannot verify later:\n  reruns_clean          -- otherwise the result is an anecdote\n  output_diff_explained -- an unexplained output change IS the bug report\n  no_lookahead          -- invisible in the diff, fatal in the backtest\n  inputs_pinned         -- without it, 'it worked yesterday' is unfalsifiable"
          }
        },
        {
          "name": "Lineage turns 'the number changed' into a one-line answer",
          "explain": "<p>A report's headline number -- here, out/pnl@v3 -- is the end of a chain of derivation, and lineage is the record of exactly what that chain is: which code, which parameters, and which upstream artifacts produced each step, all the way back to two raw pulls with no further ancestors. The snippet walks that ancestry directly, printing the full tree from the P&amp;L number down through a signal, a joined panel, and two cleaned tables, back to the raw CRSP and Compustat pulls -- and computes a fingerprint for the whole chain, a single hash that changes if and only if anything anywhere in it changes.</p><p>The query that matters during an actual incident runs in the other direction: given that one specific upstream artifact -- say, the raw fundamentals pull -- turns out to be wrong, lineage answers exactly which downstream artifacts must be rebuilt and which already-delivered reports need to be recalled, by walking descendants rather than ancestors. The snippet finds four downstream artifacts affected by a bad raw pull versus three affected by a bad intermediate cleaning step -- different blast radii for different failures, computed rather than guessed.</p><p>And the third query is change detection: moving one parameter, the signal's z-window from 60 to 120, changes exactly two of the pipeline's seven fingerprints -- the signal and everything downstream of it -- while leaving the five unrelated fingerprints untouched. Lineage is what makes \"why did the number change\" answerable in one query instead of an afternoon of manual archaeology.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\n\n# Every run emits a lineage record: what it produced, from what, with which\n# code and which parameters. That record is the pipeline's audit trail.\nRUNS = [\n    {\"out\": \"raw/crsp@v1\", \"ins\": [], \"code\": \"fetch.py@a1b2c3\", \"params\": {\"vendor_asof\": \"2026-09-26\"}},\n    {\"out\": \"raw/funda@v1\", \"ins\": [], \"code\": \"fetch.py@a1b2c3\", \"params\": {\"vendor_asof\": \"2026-09-26\"}},\n    {\"out\": \"cur/crsp@v4\", \"ins\": [\"raw/crsp@v1\"], \"code\": \"clean.py@d4e5f6\", \"params\": {\"winsor\": 0.01}},\n    {\"out\": \"cur/funda@v2\", \"ins\": [\"raw/funda@v1\"], \"code\": \"clean.py@d4e5f6\", \"params\": {\"units\": \"thousands\"}},\n    {\"out\": \"cur/panel@v7\", \"ins\": [\"cur/crsp@v4\", \"cur/funda@v2\"], \"code\": \"join.py@778899\",\n     \"params\": {\"asof\": True, \"lag_days\": 0}},\n    {\"out\": \"out/signal@v3\", \"ins\": [\"cur/panel@v7\"], \"code\": \"signal.py@aabbcc\", \"params\": {\"zwin\": 60}},\n    {\"out\": \"out/pnl@v3\", \"ins\": [\"out/signal@v3\"], \"code\": \"bt.py@ddeeff\", \"params\": {\"tc_bps\": 5}},\n]\nBY_OUT = {r[\"out\"]: r for r in RUNS}\n\n\ndef fingerprint(artifact):\n    r = BY_OUT.get(artifact)\n    if r is None:\n        return \"EXTERNAL:\" + artifact\n    payload = {\"code\": r[\"code\"], \"params\": r[\"params\"],\n               \"ins\": sorted(fingerprint(i) for i in r[\"ins\"])}\n    return hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()[:12]\n\n\ndef ancestry(artifact, depth=0, seen=None):\n    seen = seen if seen is not None else []\n    r = BY_OUT.get(artifact)\n    seen.append((depth, artifact, r[\"code\"] if r else \"-\", r[\"params\"] if r else {}))\n    for i in (r[\"ins\"] if r else []):\n        ancestry(i, depth + 1, seen)\n    return seen\n\n\nprint(\"the number on the desk's report is out/pnl@v3. Where did it come from?\\n\")\nfor depth, art, code, params in ancestry(\"out/pnl@v3\"):\n    print(f\"{'  ' * depth}{'\u2514\u2500 ' if depth else ''}{art:<16} \"\n          f\"code {code:<20} params {params}\")\n\nprint(f\"\\nfingerprint of out/pnl@v3 : {fingerprint('out/pnl@v3')}\")\n\n# The inverse query -- the one you need during an incident.\ndef descendants(artifact):\n    out = []\n    for r in RUNS:\n        if artifact in r[\"ins\"]:\n            out.append(r[\"out\"])\n            out += descendants(r[\"out\"])\n    return out\n\n\nfor bad in (\"raw/funda@v1\", \"cur/crsp@v4\"):\n    print(f\"\\nif {bad} turns out to be wrong, these must be rebuilt and\")\n    print(f\"these reports must be recalled: {descendants(bad)}\")\n\n# And the change-detection query: one parameter moved, what moved with it.\nbase = {r[\"out\"]: fingerprint(r[\"out\"]) for r in RUNS}\nBY_OUT[\"out/signal@v3\"] = dict(BY_OUT[\"out/signal@v3\"], params={\"zwin\": 120})\nnew = {r[\"out\"]: fingerprint(r[\"out\"]) for r in RUNS}\nprint(f\"\\nchanging signal's zwin from 60 to 120 moves \"\n      f\"{sum(base[k] != new[k] for k in base)}/{len(base)} fingerprints: \"\n      f\"{[k for k in base if base[k] != new[k]]}\")\nprint(\"Lineage is what turns 'the number changed' into a one-line answer.\")\n",
            "output": "the number on the desk's report is out/pnl@v3. Where did it come from?\n\nout/pnl@v3       code bt.py@ddeeff         params {'tc_bps': 5}\n  └─ out/signal@v3    code signal.py@aabbcc     params {'zwin': 60}\n    └─ cur/panel@v7     code join.py@778899       params {'asof': True, 'lag_days': 0}\n      └─ cur/crsp@v4      code clean.py@d4e5f6      params {'winsor': 0.01}\n        └─ raw/crsp@v1      code fetch.py@a1b2c3      params {'vendor_asof': '2026-09-26'}\n      └─ cur/funda@v2     code clean.py@d4e5f6      params {'units': 'thousands'}\n        └─ raw/funda@v1     code fetch.py@a1b2c3      params {'vendor_asof': '2026-09-26'}\n\nfingerprint of out/pnl@v3 : 5c83baa55fde\n\nif raw/funda@v1 turns out to be wrong, these must be rebuilt and\nthese reports must be recalled: ['cur/funda@v2', 'cur/panel@v7', 'out/signal@v3', 'out/pnl@v3']\n\nif cur/crsp@v4 turns out to be wrong, these must be rebuilt and\nthese reports must be recalled: ['cur/panel@v7', 'out/signal@v3', 'out/pnl@v3']\n\nchanging signal's zwin from 60 to 120 moves 2/7 fingerprints: ['out/signal@v3', 'out/pnl@v3']\nLineage is what turns 'the number changed' into a one-line answer."
          }
        },
        {
          "name": "A reproducibility manifest hashes code, data, environment, and parameters together",
          "explain": "<p>A single result is only checkable later if the exact conditions that produced it were recorded, and a manifest -- a structured record of every code file's hash, every input file's hash, the runtime environment, and every parameter -- is that record made concrete rather than assumed. The snippet builds one for a small pipeline and confirms the obvious but essential property first: hashing the identical manifest twice produces an identical hash, so \"did anything change\" is a one-line comparison rather than a manual audit of four separate categories of thing.</p><p>The manifest's real value shows up when exactly one thing changes at a time. Perturbing a single parameter, editing a single line of code, or flipping a single byte of an input file each changes the overall manifest hash -- every one of the three perturbations produces a different hash from the baseline and from each other, confirming the manifest is actually sensitive to each of the three categories it claims to track, not just nominally including them.</p><p>A single command that rebuilds the pipeline and a single hash that says whether the rebuild matches a prior run together close the loop that the rest of the course opened: a result reported without this hash cannot be checked by anyone else, and typically cannot be checked by its own author six months later either, which in practice is the person who actually needs to check it, usually while trying to explain why a number in a report from three weeks ago no longer matches what the pipeline produces today.</p>",
          "formula": "\\text{manifest hash} = H(\\text{code} \\,\\Vert\\, \\text{data} \\,\\Vert\\, \\text{env} \\,\\Vert\\, \\text{params})",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\nimport os\nimport platform\nimport sys\nimport tempfile\n\n# A reproducibility manifest pins the three things a rerun needs: the CODE, the\n# DATA, and the ENVIRONMENT. Its hash is the claim \"this result is checkable\".\nCODE = {\"fetch.py\": \"print('fetch')\\n\", \"clean.py\": \"print('clean')\\n\",\n        \"signal.py\": \"Z = 60\\n\"}\nPARAMS = {\"zwin\": 60, \"tc_bps\": 5, \"winsor\": 0.01, \"asof\": True}\n\n\ndef sha(b):\n    return hashlib.sha256(b if isinstance(b, bytes) else b.encode()).hexdigest()\n\n\ndef build_manifest(code, params, data_dir):\n    data = {}\n    for f in sorted(os.listdir(data_dir)):\n        with open(os.path.join(data_dir, f), \"rb\") as fh:\n            data[f] = sha(fh.read())[:16]\n    return {\n        \"code\": {f: sha(src)[:16] for f, src in sorted(code.items())},\n        \"data\": data,\n        \"params\": params,\n        \"env\": {\"python\": \".\".join(map(str, sys.version_info[:3])),\n                \"platform\": platform.system(),\n                \"numpy\": np.__version__},\n    }\n\n\ndef manifest_hash(m):\n    return sha(json.dumps(m, sort_keys=True, separators=(\",\", \":\")))[:16]\n\n\nwith tempfile.TemporaryDirectory() as d:\n    for name, blob in ((\"crsp.csv\", b\"permno,ret\\n10145,0.011\\n\"),\n                       (\"funda.csv\", b\"gvkey,be\\nAAA,1080\\n\")):\n        with open(os.path.join(d, name), \"wb\") as fh:\n            fh.write(blob)\n\n    m1 = build_manifest(CODE, PARAMS, d)\n    print(\"manifest:\")\n    print(json.dumps(m1, indent=2, sort_keys=True))\n    h1 = manifest_hash(m1)\n    print(f\"\\nmanifest hash, run 1 : {h1}\")\n    print(f\"manifest hash, run 2 : {manifest_hash(build_manifest(CODE, PARAMS, d))}\"\n          f\"  identical {manifest_hash(build_manifest(CODE, PARAMS, d)) == h1}\")\n\n    print(\"\\nnow perturb exactly one thing at a time:\")\n    cases = [\n        (\"one parameter (zwin 60 -> 120)\", CODE, dict(PARAMS, zwin=120), None),\n        (\"one line of code (signal.py)\", dict(CODE, **{\"signal.py\": \"Z = 120\\n\"}), PARAMS, None),\n        (\"one input byte (crsp.csv)\", CODE, PARAMS, b\"permno,ret\\n10145,0.012\\n\"),\n    ]\n    for label, code, params, newdata in cases:\n        if newdata is not None:\n            with open(os.path.join(d, \"crsp.csv\"), \"wb\") as fh:\n                fh.write(newdata)\n        h = manifest_hash(build_manifest(code, params, d))\n        print(f\"  {label:<34} -> {h}  changed {h != h1}\")\n        if newdata is not None:\n            with open(os.path.join(d, \"crsp.csv\"), \"wb\") as fh:\n                fh.write(b\"permno,ret\\n10145,0.011\\n\")\n\nprint(\"\\nOne command rebuilds; one hash says whether the rebuild is the same run.\")\nprint(\"A result reported without this hash cannot be checked by anyone, including\")\nprint(\"you in six months, which is the person who will actually need to.\")\n",
            "output": "manifest:\n{\n  \"code\": {\n    \"clean.py\": \"952bd1d943bd00bd\",\n    \"fetch.py\": \"f9e3bf9c7fdf63d0\",\n    \"signal.py\": \"c410234a30416b59\"\n  },\n  \"data\": {\n    \"crsp.csv\": \"0034bbc8dd58e0e2\",\n    \"funda.csv\": \"bca3d0abfbd0b8e8\"\n  },\n  \"env\": {\n    \"numpy\": \"2.2.6\",\n    \"platform\": \"Darwin\",\n    \"python\": \"3.13.5\"\n  },\n  \"params\": {\n    \"asof\": true,\n    \"tc_bps\": 5,\n    \"winsor\": 0.01,\n    \"zwin\": 60\n  }\n}\n\nmanifest hash, run 1 : 1337727cb89e29b1\nmanifest hash, run 2 : 1337727cb89e29b1  identical True\n\nnow perturb exactly one thing at a time:\n  one parameter (zwin 60 -> 120)     -> bc94100e25209812  changed True\n  one line of code (signal.py)       -> e231b867c0376df7  changed True\n  one input byte (crsp.csv)          -> fa8ad18de972b51e  changed True\n\nOne command rebuilds; one hash says whether the rebuild is the same run.\nA result reported without this hash cannot be checked by anyone, including\nyou in six months, which is the person who will actually need to."
          }
        },
        {
          "name": "One pipeline, ten weeks of techniques, one manifest hash at the end",
          "explain": "<p>A capstone run threads every week's technique through a single, short pipeline in order: land and key-dedup four raw rows (week 1), type and validate the schema at the boundary (weeks 2 and 6), apply an as-of filter that respects a restatement's knowledge date (week 3), execute the DAG in dependency order (week 4), upsert idempotently (week 5), check a cache for the joined result before computing it (week 7), read only the two columns and confirm no accidental fan-out occurred (week 8), rank the result with a window function (week 9), and close by writing a manifest that hashes the whole run (week 10).</p><p>Running the identical pipeline a second time reproduces an identical output and an identical manifest hash, with only one real computation performed across both runs -- the cache from week 7 absorbed the second run entirely, which is exactly the behavior a correctly built pipeline should have. Moving the as-of date forward to a point where a restatement has since become public changes one input to the ranking step and nothing else in the pipeline's structure; the ranking output changes, correctly, to reflect the now-public information, and the manifest hash changes right along with it, differing from the first run's hash in a way that is fully explained by that one input.</p><p>Nothing about this capstone pipeline is new relative to weeks 1 through 9; the only new idea is that all nine disciplines -- extraction, typing, point-in-time correctness, orchestration, idempotency, caching, cost-awareness, correct joins, and a hash that proves all of the above -- have to hold simultaneously in one real pipeline, not one at a time in nine separate exercises.</p>",
          "code": {
            "lang": "python",
            "src": "import numpy as np\nnp.seterr(all=\"ignore\")  # this machine's BLAS emits spurious FP warnings on ordinary finite data\n\nimport hashlib\nimport json\nimport sqlite3\nfrom collections import deque\n\n# The whole course in one function. Nine stages, each one a week.\nRAW_PRICES = [(\"AAA\", \"2026-09-28\", 210.0), (\"AAA\", \"2026-09-29\", 212.5),\n              (\"BBB\", \"2026-09-28\", 51.0), (\"BBB\", \"2026-09-29\", 50.2)]\nRAW_FUNDA = [(\"AAA\", \"2026-06-30\", \"2026-07-29\", 1080.0),\n             (\"AAA\", \"2026-06-30\", \"2026-11-12\", 940.0),      # a future restatement\n             (\"BBB\", \"2026-06-30\", \"2026-08-04\", 420.0)]\nCONTRACT = {\"sym\": str, \"dt\": str, \"px\": float}\nDAG = {\"ingest\": [], \"schema\": [\"ingest\"], \"asof\": [\"schema\"], \"quality\": [\"asof\"],\n       \"load\": [\"quality\"], \"query\": [\"load\"], \"manifest\": [\"query\"]}\nCACHE, WORK = {}, {\"n\": 0}\n\n\ndef sha(o):\n    return hashlib.sha256(json.dumps(o, sort_keys=True, default=str).encode()).hexdigest()[:12]\n\n\ndef topo(dag):\n    indeg = {n: len(v) for n, v in dag.items()}\n    kids = {n: [] for n in dag}\n    for n, ups in dag.items():\n        for u in ups:\n            kids[u].append(n)\n    q, order = deque(sorted(n for n in dag if not indeg[n])), []\n    while q:\n        n = q.popleft()\n        order.append(n)\n        for c in sorted(kids[n]):\n            indeg[c] -= 1\n            if not indeg[c]:\n                q.append(c)\n    assert len(order) == len(dag), \"cyclic DAG\"\n    return order\n\n\ndef pipeline(prices, funda, asof_date, log):\n    order = topo(DAG)                                          # wk4\n    log.append(f\"wk4  execution order: {' -> '.join(order)}\")\n\n    landed = [dict(zip((\"sym\", \"dt\", \"px\"), r)) for r in prices]   # wk1\n    seen, dedup = set(), []\n    for r in landed:\n        k = (r[\"sym\"], r[\"dt\"])\n        if k not in seen:\n            seen.add(k)\n            dedup.append(r)\n    log.append(f\"wk1  landed {len(landed)} rows, {len(dedup)} after key dedup\")\n\n    bad = [r for r in dedup if any(not isinstance(r[c], t) for c, t in CONTRACT.items())]\n    assert not bad, f\"schema violations: {bad}\"                    # wk2/wk6\n    log.append(f\"wk2  schema ok: {list(CONTRACT)} typed at the boundary\")\n\n    vintages = {}\n    for sym, period, ann, be in funda:                             # wk3\n        if ann <= asof_date:\n            cur = vintages.get(sym)\n            if cur is None or (period, ann) > (cur[0], cur[1]):\n                vintages[sym] = (period, ann, be)\n    leaked = [f for f in funda if f[2] > asof_date]\n    log.append(f\"wk3  as-of {asof_date}: kept {len(vintages)} vintages, \"\n               f\"excluded {len(leaked)} not-yet-public row(s)\")\n\n    rows = [dict(r, be=vintages[r[\"sym\"]][2]) for r in dedup if r[\"sym\"] in vintages]\n    assert all(r[\"be\"] > 0 and r[\"px\"] > 0 for r in rows)          # wk6\n    log.append(f\"wk6  quality gate passed on {len(rows)} joined rows\")\n\n    cx = sqlite3.connect(\":memory:\")                               # wk5\n    cx.execute(\"CREATE TABLE panel(sym TEXT, dt TEXT, px REAL, be REAL,\"\n               \" PRIMARY KEY(sym, dt))\")\n    cx.executemany(\"INSERT INTO panel VALUES (:sym,:dt,:px,:be) ON CONFLICT(sym,dt)\"\n                   \" DO UPDATE SET px=excluded.px, be=excluded.be\", rows)\n    cx.commit()\n    log.append(f\"wk5  upserted idempotently: {cx.execute('SELECT COUNT(*) FROM panel').fetchone()[0]} rows\")\n\n    key = sha([sorted(map(tuple, (r.values() for r in rows))), asof_date])   # wk7\n    if key in CACHE:\n        out = CACHE[key]\n        log.append(f\"wk7  cache HIT on key {key}, 0 new computations\")\n    else:\n        WORK[\"n\"] += 1\n        out = cx.execute(\"\"\"SELECT sym, ROUND(be/px, 6) AS bm,\n                                   RANK() OVER (ORDER BY be/px DESC) AS rk\n                            FROM panel WHERE dt = (SELECT MAX(dt) FROM panel)\n                            ORDER BY rk\"\"\").fetchall()             # wk9\n        CACHE[key] = out\n        log.append(f\"wk7  cache MISS on key {key}, computed once\")\n    log.append(f\"wk8  rows read {len(rows)}, rows out {len(out)} \"\n               f\"(fan-out {len(out) / max(len(rows), 1):.2f}x, no cross join)\")\n    log.append(f\"wk9  {out}\")\n\n    mani = {\"code\": \"capstone@v1\", \"inputs\": [sha(prices), sha(funda)],\n            \"params\": {\"asof\": asof_date}, \"out\": sha(out)}        # wk10\n    return out, sha(mani), log\n\n\nout1, h1, log1 = pipeline(RAW_PRICES, RAW_FUNDA, \"2026-09-30\", [])\nfor line in log1:\n    print(line)\nprint(f\"wk10 manifest hash {h1}\")\n\nout2, h2, _ = pipeline(RAW_PRICES, RAW_FUNDA, \"2026-09-30\", [])\nprint(f\"\\nrerun: output identical {out1 == out2}, manifest identical {h1 == h2}, \"\n      f\"real computations so far {WORK['n']}\")\nout3, h3, _ = pipeline(RAW_PRICES, RAW_FUNDA, \"2026-12-31\", [])\nprint(f\"as-of moved to 2026-12-31 (the restatement is now public):\")\nprint(f\"  ranking {out3}\")\nprint(f\"  manifest {h3}, differs from the 09-30 run: {h3 != h1}\")\nprint(\"\\nSame code, same inputs, different as-of date -> a different, CORRECT answer,\")\nprint(\"and a manifest hash that says exactly which of the two you are looking at.\")\n",
            "output": "wk4  execution order: ingest -> schema -> asof -> quality -> load -> query -> manifest\nwk1  landed 4 rows, 4 after key dedup\nwk2  schema ok: ['sym', 'dt', 'px'] typed at the boundary\nwk3  as-of 2026-09-30: kept 2 vintages, excluded 1 not-yet-public row(s)\nwk6  quality gate passed on 4 joined rows\nwk5  upserted idempotently: 4 rows\nwk7  cache MISS on key 240d59ff9a08, computed once\nwk8  rows read 4, rows out 2 (fan-out 0.50x, no cross join)\nwk9  [('BBB', 8.366534, 1), ('AAA', 5.082353, 2)]\nwk10 manifest hash 2ac0109eb2a7\n\nrerun: output identical True, manifest identical True, real computations so far 1\nas-of moved to 2026-12-31 (the restatement is now public):\n  ranking [('BBB', 8.366534, 1), ('AAA', 4.423529, 2)]\n  manifest 2e82ebee0d49, differs from the 09-30 run: True\n\nSame code, same inputs, different as-of date -> a different, CORRECT answer,\nand a manifest hash that says exactly which of the two you are looking at."
          }
        }
      ],
      "widget": {
        "type": "timeline",
        "title": "One pipeline, ten weeks of technique",
        "params": {
          "events": [
            {
              "t": 1,
              "label": "land + key-dedup",
              "note": "4 rows landed, 4 after dedup"
            },
            {
              "t": 2,
              "label": "type at the boundary",
              "note": "schema declared and checked"
            },
            {
              "t": 3,
              "label": "as-of filter",
              "note": "restatement respected"
            },
            {
              "t": 4,
              "label": "DAG execution order",
              "note": "ingest -> schema -> asof -> quality -> load -> query -> manifest"
            },
            {
              "t": 5,
              "label": "idempotent upsert",
              "note": "4 rows, rerun-safe"
            },
            {
              "t": 6,
              "label": "quality gate",
              "note": "passed on 4 joined rows"
            },
            {
              "t": 7,
              "label": "cache check",
              "note": "miss once, then hits"
            },
            {
              "t": 8,
              "label": "cost-aware read",
              "note": "2 columns, no cross join"
            },
            {
              "t": 9,
              "label": "window ranking",
              "note": "RANK() over the joined panel"
            },
            {
              "t": 10,
              "label": "manifest hash",
              "note": "one hash, the whole run"
            }
          ]
        }
      },
      "pitfalls": [
        "Reviewing a PR on 'this looks right to me' rather than against a fixed checklist, so the same category of defect -- an unpinned input, an unexplained output diff -- gets caught in one review and missed in the next.",
        "Tracking lineage only forward, from inputs to outputs, when the query that actually matters during an incident is the reverse one: given a bad artifact, what downstream reports need to be recalled.",
        "Building a reproducibility manifest that hashes code and data but not the runtime environment or the parameters, missing exactly the category of change that caused a result to silently stop matching.",
        "Treating each week's discipline -- typing, as-of correctness, idempotency, caching, cost-awareness -- as an isolated exercise rather than a requirement that all of them hold at once in any real pipeline."
      ],
      "check": [
        {
          "q": "A PR review checklist marks 'the output diff is explained by the input diff' as a blocking item rather than a nit. The reasoning is that this item is:",
          "options": [
            "The most common mistake, so it deserves extra weight",
            "Something the reviewer cannot verify after the fact if it is missing -- an unexplained output change is itself the bug report",
            "Easy to automate, unlike the other items",
            "Only relevant for performance-related PRs"
          ],
          "answer": 1,
          "why": "The four blocking items in the checklist share one property: without them, a reviewer working only from the diff has no way to verify the PR is safe, now or later. An output that changed for a reason nobody stated is not a detail to note -- it is the thing the review exists to catch."
        },
        {
          "q": "A raw input artifact is discovered to be wrong. The lineage query that answers 'what needs to be rebuilt and recalled' is:",
          "options": [
            "Ancestry: walking from the bad artifact back to its own inputs",
            "Descendants: walking from the bad artifact forward to everything that consumed it, directly or transitively",
            "A fresh fingerprint of the entire pipeline",
            "There is no way to answer this without re-running everything"
          ],
          "answer": 1,
          "why": "Ancestry answers 'where did this come from,' which is useful for auditing a result but not for responding to a known-bad input. Descendants answers exactly the operational question -- which downstream artifacts and reports depend, directly or transitively, on the artifact now known to be wrong."
        },
        {
          "q": "A reproducibility manifest hashes code, data, environment, and parameters together. If only the runtime environment changes (say, a different numpy version) and nothing else does, the manifest hash should:",
          "options": [
            "Stay the same, since environment does not affect the result",
            "Change, since the manifest is built to be sensitive to every one of the four categories it tracks",
            "Only change if the result itself numerically differs",
            "Be undefined, since environment cannot be hashed"
          ],
          "answer": 1,
          "why": "A manifest that only tracked code and data would miss exactly the class of bug where an environment change silently alters a result -- a different numerical library version, for instance. Including environment in the hash means any change to it is visible in the manifest even before anyone checks whether the output actually differs."
        },
        {
          "q": "Which of the following best describes what a capstone pipeline running all ten weeks' techniques together demonstrates?",
          "options": [
            "Any one discipline, applied carefully, is sufficient for a trustworthy pipeline",
            "All of extraction, typing, point-in-time correctness, orchestration, idempotency, caching, cost-awareness, and correct joins have to hold simultaneously, not just individually",
            "The techniques from different weeks are mutually exclusive and cannot be combined",
            "Caching makes the other nine disciplines unnecessary"
          ],
          "answer": 1,
          "why": "Each week's discipline addresses a different way a pipeline can quietly produce a wrong or unreproducible answer. A real pipeline is only trustworthy if none of those failure modes is left unaddressed -- getting nine of the ten right does not protect against the tenth."
        }
      ]
    }
  ],
  "interview": [
    {
      "q": "What is the difference between cursor-based and offset-based pagination, and when does the difference actually matter?",
      "level": "screen",
      "answer": "Offset pagination asks for rows N through M of the current result set; cursor pagination asks for rows whose key is greater than the last one seen. They return identical results against a static table. The difference appears the moment the underlying data changes mid-pull: an insert or delete before the current offset shifts every later page, causing duplicated or skipped rows, while a cursor anchored on a stable key is unaffected, since 'greater than key K' does not depend on how many rows currently precede K."
    },
    {
      "q": "Why does exponential backoff need jitter when many clients are retrying against the same endpoint?",
      "level": "screen",
      "answer": "Pure exponential backoff computes each client's wait deterministically from its attempt number, so every client that fails on the same attempt computes an identical delay and retries in lockstep -- converting one transient outage into a synchronized retry storm against a server that is already struggling. Jitter draws the wait randomly within that same exponential ceiling, spreading a fleet of clients across many different retry schedules instead of one shared one, which is what actually protects the endpoint during recovery."
    },
    {
      "q": "Why is CSV a risky format for anything downstream of extraction, even though it is simple and human-readable?",
      "level": "screen",
      "answer": "CSV has exactly one native type, text, so every value round-trips as a string and it is entirely up to the reader to guess the intended type. That produces concrete bugs: a leading-zero identifier loses its zero under int(), numeric-looking strings sort lexicographically instead of numerically, an empty string is ambiguous between missing and zero, and Python's bool() treats the literal string 'False' as truthy. The fix is declaring and enforcing an explicit schema once, at the read boundary, rather than trusting inferred types."
    },
    {
      "q": "Explain what an as-of join is and why a naive 'latest value' join is unsafe for point-in-time research.",
      "level": "onsite",
      "answer": "An as-of join restricts a lookup to records already known -- announced, published -- as of the query's reference date, then takes the most recent among those. A 'latest value' join instead always attaches the newest available vintage of a fact regardless of when it was published, which lets a later restatement leak backward into dates before it existed. The resulting lookahead is largest exactly where the restatement was largest, silently inflating a backtested signal's apparent performance precisely on the dates a real trader would have had the least information."
    },
    {
      "q": "Walk through how a DAG orchestrator decides what to re-run after one file changes, and why that set is always the changed node plus its descendants.",
      "level": "onsite",
      "answer": "Each task's fingerprint is a hash of its own code and external inputs plus its parents' fingerprints, recursively, so two tasks have identical fingerprints exactly when they would produce identical output. Changing one task's code or input changes only that task's fingerprint directly; every fingerprint computed from it, meaning every descendant, changes as a consequence, while anything upstream or in an unrelated branch keeps its original fingerprint untouched. Re-running exactly the dirty set -- changed node plus descendants -- is therefore both correct and minimal; re-running less than that silently serves stale results."
    },
    {
      "q": "What makes a database write idempotent, and why does a revision number or similar guard matter for an out-of-order replay?",
      "level": "onsite",
      "answer": "A write is idempotent if applying the same batch any number of times leaves the database in the same state as applying it once -- checked as an identity on the resulting rows, not merely 'it ran without error.' A plain upsert keyed on a stable id is idempotent for repeated replays of the same batch, but an out-of-order replay -- an older batch landing again after a newer correction was already applied -- can overwrite that correction unless the write is guarded to only apply when the incoming revision number is strictly newer than what is stored."
    },
    {
      "q": "How would you design a cache key so that it is safe to share across multiple call sites without risking a stale or wrong answer?",
      "level": "onsite",
      "answer": "The key should be a digest built from the function's code version, its parameters, and a digest of the actual input data -- never the call site, a file name, or a timestamp. That construction correctly collapses genuinely equivalent calls, even from different files or with reordered keyword arguments, into a single cache entry, while any change to the code, the parameters, or the underlying data produces a different key automatically. Keying on something more convenient, like the call site, either multiplies unnecessary recomputation or, worse, collapses genuinely different calls into one wrong shared answer."
    },
    {
      "q": "A data-quality suite runs hundreds of automated checks and nobody trusts the alerts anymore. What is actually going wrong, and how would you fix it?",
      "level": "onsite",
      "answer": "With k independent checks each carrying a small per-check false-positive rate, the probability of at least one false alarm on a perfectly clean day is 1 minus (1 minus that rate) to the k, which grows to near-certainty once a suite runs a few hundred checks -- exactly why nobody trusts an alert anymore, since almost every day produces one regardless of data quality. The fix is sizing thresholds and check counts around the aggregate false-alarm rate a team can actually staff, and separately checking that any given check has enough statistical power at its actual batch size before trusting its threshold at all."
    },
    {
      "q": "Design the write path for a position ledger that needs both correct current positions and an audit trail of every amendment. What are the tradeoffs?",
      "level": "senior",
      "answer": "Append every event, including replays and revisions, and deduplicate on read by keeping the highest revision per key -- versus upserting a single snapshot row per key that always reflects the latest revision. Both, correctly implemented, converge on identical current positions. The append-only ledger can still answer 'what did we believe before the amendment,' because no write is ever destroyed, at the cost of a window function on every read instead of a plain aggregate; the snapshot table is cheaper to query but permanently loses the ability to answer any question about a prior belief once a revision overwrites it."
    },
    {
      "q": "A distributed aggregation job is skewed: one worker takes ten times longer than the rest. Diagnose and fix it.",
      "level": "senior",
      "answer": "Check whether the skew is caused by one or a few dominant keys in a hash partition; a stage finishes only when its slowest partition finishes, and hashing sends every row of a given key to exactly one partition no matter how many partitions exist, so a key that is a large share of total traffic sets a floor on skew that more partitions cannot lower. The standard fix is salting the hot keys -- splitting them across several artificial sub-keys before hashing, then re-aggregating in a second pass -- which trades an extra aggregation step for a much lower skew ratio."
    },
    {
      "q": "Why is a manifest that hashes code, data, environment and parameters together more useful than version-controlling the code alone?",
      "level": "senior",
      "answer": "Version control guarantees the code is reproducible; it says nothing about whether the specific data, runtime environment, or parameters used to produce a given result are recoverable or even recorded. A manifest that hashes all four together is sensitive to a change in any one of them -- a different library version, a corrected input byte, a moved parameter -- and reduces 'did anything change since this result was produced' to a single string comparison rather than a multi-category manual audit, which is what actually lets a result be checked by someone other than its original author, potentially much later."
    },
    {
      "q": "You inherit a research pipeline where results occasionally look wrong for reasons nobody can immediately explain. What would you build first?",
      "level": "senior",
      "answer": "Data lineage that can answer both directions of the same question: given a report's headline number, what upstream code, parameters, and data actually produced it, and separately, given a known-bad upstream artifact, exactly which downstream artifacts and delivered reports depend on it and must be rebuilt or recalled. Paired with a reproducibility manifest that hashes code, data, environment, and parameters together, this turns 'the number changed and nobody knows why' into a one-query answer, and is close to a prerequisite for trusting any other fix made to the pipeline afterward."
    }
  ],
  "reappears_in": [
    {
      "code": "FINM 33150",
      "how": "Its walk-forward backtest loop and its explicit prerequisite of 'aligning two time series without introducing a look-ahead bug' are exactly the point-in-time and as-of-join discipline this course builds in week 3, applied directly to a strategy's own historical evaluation."
    },
    {
      "code": "FINM 34600",
      "how": "High-frequency tick data is the material this course's TAQ-shaped trade/quote joins in weeks 2, 3 and 9 are built from; the microstructure-noise and irregular-sampling problems that course studies statistically are the same tape whose extraction, storage and point-in-time joins this course teaches operationally."
    },
    {
      "code": "FINM 32400",
      "how": "The sibling computing-block course; its git, testing, CI/CD and debugging toolset is the software engineering half of the same discipline this course teaches from the data side -- a pipeline that passes this course's quality gates still needs that course's version control and review workflow to ship safely."
    },
    {
      "code": "FINM 33500",
      "how": "A live systematic trading system needs exactly this course's guarantees -- idempotent order and fill handling, point-in-time market data, a DAG that can be safely re-run -- underneath whatever strategy and execution logic that course adds on top."
    }
  ],
  "glossary": [
    {
      "term": "Cursor pagination",
      "def": "Paginating by asking for rows whose key is greater than the last one seen, rather than by a numeric offset into the current result set. Stable under concurrent inserts and deletes; offset pagination is not."
    },
    {
      "term": "Idempotent write",
      "def": "A write operation such that applying it any number of times leaves the system in the same state as applying it once, typically achieved by upserting on a stable key rather than blindly inserting."
    },
    {
      "term": "Watermark",
      "def": "The latest event timestamp a streaming or batch pipeline has observed so far, used to decide when an event-day or window can be closed and treated as final."
    },
    {
      "term": "Allowed lateness",
      "def": "The window, measured in time, that a pipeline will wait after its watermark passes a given event-day before closing it and permanently dropping any later arrivals for that day."
    },
    {
      "term": "As-of join",
      "def": "A join that, for each row on one side, attaches the most recent matching row on the other side that was already known as of a given reference date or time, rather than the most recent row overall."
    },
    {
      "term": "Bitemporal table",
      "def": "A table that records both when a fact is about (event time, e.g. period_end) and when it became knowable (knowledge time, e.g. known_from and known_to), so that a query can reconstruct what was known as of any past date."
    },
    {
      "term": "Columnar storage",
      "def": "A physical layout that stores each column of a table as a separate, contiguous array rather than storing whole records together, which lets a query read only the columns it names and compress each column more effectively."
    },
    {
      "term": "Row-group pruning",
      "def": "A parquet reader's ability to skip an entire row group without opening it, using that group's stored per-column min/max, whenever a filter's range cannot overlap the group's statistics."
    },
    {
      "term": "Schema drift",
      "def": "An unannounced change in a data feed's shape over time -- a renamed column, a changed type, a newly nullable field -- that is syntactically valid and therefore produces no error, only a silently wrong downstream answer."
    },
    {
      "term": "Directed acyclic graph (DAG)",
      "def": "A graph of tasks connected by dependency edges with no cycle, guaranteeing at least one valid execution order exists; the standard model for a pipeline's task orchestration."
    },
    {
      "term": "Fingerprint (build system)",
      "def": "A hash of a task's own code and external inputs combined with the fingerprints of its dependencies, used to decide, without guessing, exactly which downstream tasks must be re-run after a change."
    },
    {
      "term": "Critical path",
      "def": "The single longest chain of dependent tasks in a DAG by cumulative cost; a hard lower bound on a pipeline's total wall-clock time no matter how much parallelism is applied elsewhere."
    },
    {
      "term": "Content-addressed cache",
      "def": "A cache whose key is derived from a digest of the actual code version, parameters and input data, rather than from a human-chosen name, so that a changed input automatically produces a new, distinct key instead of a stale hit under an old one."
    },
    {
      "term": "Memoization",
      "def": "Caching a function's return value by its arguments so repeated calls with the same arguments avoid recomputation; sound only when the function is pure, meaning its result depends on nothing but those arguments."
    },
    {
      "term": "Partition pruning",
      "def": "A query engine's ability to skip entire partitioned files based on a filter written against the partitioning columns, without reading any of the skipped files' contents."
    },
    {
      "term": "Fan-out (join)",
      "def": "A join producing more output rows than expected because one side carries more than one row per key; the output row count for a given key is the product of the row counts on each side at that key."
    },
    {
      "term": "Partition skew",
      "def": "An uneven distribution of rows across a distributed job's partitions, typically caused by one or a few dominant keys, that sets the job's wall-clock time to its slowest partition's completion time."
    },
    {
      "term": "Salting (hot key)",
      "def": "Splitting a disproportionately large key into several artificial sub-keys before hashing, to spread its rows across multiple partitions, followed by a second aggregation pass to recombine the results."
    },
    {
      "term": "Data lineage",
      "def": "The recorded chain of code, parameters and upstream artifacts that produced a given artifact, queryable both as ancestry (what produced this) and as descendants (what depends on this)."
    },
    {
      "term": "Reproducibility manifest",
      "def": "A structured record hashing a pipeline run's code, input data, runtime environment and parameters together, so that whether two runs are identical reduces to a single hash comparison."
    }
  ]
};
