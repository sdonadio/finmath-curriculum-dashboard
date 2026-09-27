#!/usr/bin/env python3
"""Generator for courses/finm-32700.js -- FINM 32700, Low Latency Trading
Systems (Sebastien Donadio, Spring, 100 units, Financial Computing
concentration).

TIER A. Unlike the tier-B pages, this one is built from the instructor's own
course material, with his permission: the course design arc (the HFT track
syllabus), the per-session speaker guides (session1..9_talking_points.md,
including every in-class lab step), the deck outlines (build_u1.py ...
build_u9.py slide titles) and the per-session focus list of the published
FINM HFT skills dashboard (focus.js: the nine-session mapping and the skills
vocabulary). The nine weeks of the schema are the nine sessions; the midterm
sits inside session 5 and session 9 is the live latency tournament.

Why a generator instead of a hand-edited JS literal: the course file is a
large object with ~45 embedded C++ snippets full of braces and quotes, and
hand-editing one is how a quote or a brace goes missing. This script builds
the whole thing as a Python dict and emits it with json.dumps(indent=2).

    python3 tools/gen_finm_32700.py                       # writes courses/finm-32700.js
    python3 tools/run_snippets.py courses/finm-32700.js    # fills every `output`
    python3 tools/run_snippets.py --check courses/finm-32700.js
    python3 tools/validate.py courses/finm-32700.js        # must be 0 errors
    node --check courses/finm-32700.js

Snippet rules. Every snippet is lang "cpp", compiled by tools/run_snippets.py
with `c++ -std=c++20 -O2` (Apple clang on the author's Mac, GCC or clang on
Linux), standard library only, no files, no network, nothing on stderr, and
DETERMINISTIC: randomness comes from a hand-written splitmix64 seeded with
32700 + week (never from std::*_distribution, whose output is
implementation-defined), and no snippet ever prints a wall-clock timing.
Where the lab times something, the snippet counts the thing that causes the
time instead -- cache lines touched, heap allocations, probes, messages,
syscalls, lost updates -- or runs a stated cost model over a synthetic
latency sample and prints its percentiles, so tools/run_snippets.py --check
stays stable on every machine. Threads appear only where the printed result
is independent of the interleaving (an atomic counter, a checked SPSC
checksum). Each snippet was compiled and run before its prose was written;
`output` is emitted EMPTY here and filled from real stdout by
tools/run_snippets.py.

Skill tags: only tags that already resolve (data/skills_seed.js) go into the
course. The genuinely new tags this course needs are proposed in
data/new_tags/finm-32700.json; EXTRA_TAGS below adds each one to
skills_built automatically as soon as it appears in data/skills_seed.js, so
re-running this generator after the tags are merged is all it takes.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "courses", "finm-32700.js")

HFT_ARENA = "https://sdonadio.github.io/low-latency-trading-arena/"
HFT_SKILLS = "https://sdonadio.github.io/finm-hft-skills-dashboard/"
ST_ARENA = "https://sdonadio.github.io/systematic-trading-arena/"
TEMPLATE = "https://github.com/sdonadio/algoarena-team-template"

# ─────────────────────────────────────────────────────────────────────────
# C++ snippet sources, keyed "w<week>c<concept>" (week = session number).
# ─────────────────────────────────────────────────────────────────────────
SRC = {}

# ═══ Week 1 · Session 1 — microstructure, the book, the p99.9 grade ═══

SRC["w1c1"] = r'''#include <cstdio>
#include <functional>
#include <map>

// The book is two sorted sides. Prices are held as integer TICKS (cents),
// never as doubles: 100.02 is tick 10002, so equality and ordering are exact.
std::map<long, long, std::greater<long>> bids;   // best (highest) first
std::map<long, long> asks;                       // best (lowest) first

void add(char side, long tick, long qty) {
    if (side == 'B') bids[tick] += qty; else asks[tick] += qty;
}

int main() {
    add('B', 10002, 500); add('B', 10001, 800); add('B', 10000, 200);
    add('S', 10004, 300); add('S', 10005, 900); add('S', 10006, 400);
    add('B', 10002, 100);                        // joins the SAME level

    auto [bp, bq] = *bids.begin();
    auto [ap, aq] = *asks.begin();
    double bid = bp / 100.0, ask = ap / 100.0;
    double mid = (bid + ask) / 2, spread = ask - bid;
    double micro = (ask * bq + bid * aq) / double(bq + aq);   // weighted by the OTHER side
    double obi = double(bq - aq) / double(bq + aq);
    long depth = 0; for (auto& [p, q] : bids) depth += q;

    std::printf("touch  %.2f x %ld  /  %.2f x %ld\n", bid, bq, ask, aq);
    std::printf("mid %.4f  spread %.2f (%.2f bps)\n", mid, spread, spread / mid * 1e4);
    std::printf("microprice %.4f  obi %+.3f  -> micro - mid = %+.4f\n", micro, obi, micro - mid);
    std::printf("bid levels %zu, bid depth %ld shares\n", bids.size(), depth);
    double px = 100.00; long tk = 10000;
    for (int i = 0; i < 10; ++i) { px += 0.01; tk += 1; }     // ten one-tick moves up
    std::printf("ten ticks up: double %.17g == 100.10 ? %s   tick %ld == 10010 ? %s\n",
                px, px == 100.10 ? "yes" : "no", tk, tk == 10010 ? "yes" : "no");
}
'''

SRC["w1c2"] = r'''#include <cstdio>
#include <deque>
#include <map>
#include <string>

struct Order { std::string id; long qty; };
// One FIFO queue per price level: price first, then time.
std::map<long, std::deque<Order>> asks;          // tick -> queue, best (lowest) first

long sweep_buy(long limit, long qty, bool market) {
    long filled = 0, cost = 0;
    while (qty > 0 && !asks.empty()) {
        auto it = asks.begin();
        if (!market && it->first > limit) break;          // no longer crosses
        auto& q = it->second;
        Order& head = q.front();                          // oldest at this price
        long take = qty < head.qty ? qty : head.qty;
        std::printf("  fill %4ld @ %.2f against %s\n", take, it->first / 100.0, head.id.c_str());
        filled += take; cost += take * it->first; qty -= take; head.qty -= take;
        if (head.qty == 0) q.pop_front();
        if (q.empty()) asks.erase(it);
    }
    if (filled) std::printf("  filled %ld, avg %.4f", filled, cost / 100.0 / filled);
    std::printf("  remainder %ld %s\n", qty, qty == 0 ? "" : (market ? "CANCELLED (market orders never rest)" : "RESTS as a bid"));
    return filled;
}

int main() {
    asks[10005].push_back({"A1", 300});     // oldest order, worse price
    asks[10004].push_back({"A2", 200});     // better price
    asks[10004].push_back({"A3", 100});     // same price, later -> behind A2
    std::printf("BUY 450 limit 100.05:\n");
    sweep_buy(10005, 450, false);
    std::printf("MARKET BUY 400 into what is left:\n");
    sweep_buy(0, 400, true);
}
'''

SRC["w1c3"] = r'''#include <cstdio>

// The session-1 lab schedule: taker pays 30 bps of notional, maker earns 5 bps.
const double TAKER = 0.0030, REBATE = 0.0005;

int main() {
    double px = 182.50; int qty = 200;
    double notional = px * qty;
    std::printf("notional %.2f  taker fee -%.2f  maker rebate +%.2f  swing %.2f\n",
                notional, TAKER * notional, REBATE * notional, (TAKER + REBATE) * notional);

    // Edge per share you need before a round trip is worth doing, in bps of price.
    // Round trip = two legs; each leg is either taker (pay) or maker (earn).
    struct Plan { const char* name; double leg1, leg2; };
    Plan plans[] = { {"taker in, taker out", TAKER, TAKER},
                     {"maker in, taker out", -REBATE, TAKER},
                     {"maker in, maker out", -REBATE, -REBATE} };
    for (auto& p : plans)
        std::printf("%-22s net fees %+6.1f bps of notional (%s)\n",
                    p.name, (p.leg1 + p.leg2) * 1e4, p.leg1 + p.leg2 > 0 ? "a hurdle the move must clear" : "paid to you");

    // A one-cent spread on a 182.50 stock is only 0.55 bps: fees dwarf it.
    std::printf("1-cent spread = %.2f bps of price\n", 0.01 / px * 1e4);
    double edge_bps = 3.0;
    std::printf("a 3 bps signal: net as taker round trip %+.1f bps, as maker round trip %+.1f bps\n",
                edge_bps - 2 * TAKER * 1e4, edge_bps + 2 * REBATE * 1e4);
}
'''

SRC["w1c4"] = r'''#include <algorithm>
#include <cstdio>
#include <numeric>
#include <vector>

// Deterministic synthetic tick-to-trade sample, in microseconds.
unsigned long long s = 32701;
unsigned long long next() {                          // splitmix64
    s += 0x9E3779B97F4A7C15ULL; unsigned long long z = s;
    z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
    z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL; return z ^ (z >> 31);
}
double u01() { return (next() >> 11) * (1.0 / 9007199254740992.0); }

double pct(const std::vector<double>& v, double p) {   // nearest-rank on a SORTED sample
    std::size_t k = (std::size_t)(p / 100.0 * v.size());
    if (k >= v.size()) k = v.size() - 1;
    return v[k];
}

int main() {
    std::vector<double> t;
    for (int i = 0; i < 100000; ++i) {
        double body = 35.0 + 10.0 * u01();                 // a tight, fast body: 35-45 us
        double r = u01();
        if (r < 0.004)      body += 800 + 4000 * u01();     // rare stall: page fault, preemption
        else if (r < 0.02)  body += 60 + 60 * u01();        // occasional cache-cold tick
        t.push_back(body);
    }
    std::sort(t.begin(), t.end());
    double mean = std::accumulate(t.begin(), t.end(), 0.0) / t.size();
    std::printf("n=%zu  mean=%.1f  p50=%.1f  p99=%.1f  p99.9=%.1f  max=%.1f  (us)\n",
                t.size(), mean, pct(t, 50), pct(t, 99), pct(t, 99.9), t.back());
    long near_mean = std::count_if(t.begin(), t.end(), [&](double x) { return x > mean - 3 && x < mean + 3; });
    std::printf("ticks within 3 us of the mean: %ld of %zu\n", near_mean, t.size());
    std::printf("mean / p50 = %.2f   p99.9 / p50 = %.1f\n", mean / pct(t, 50), pct(t, 99.9) / pct(t, 50));
}
'''

SRC["w1c5"] = r'''#include <cstdio>
#include <initializer_list>

// A race to the matching engine: arrival = your own tick-to-trade + the venue's
// outbound delay for your tier (the arena's LATENCY_MS_DEFAULT vs _COLOCATED).
unsigned long long s = 32711;
unsigned long long next() {
    s += 0x9E3779B97F4A7C15ULL; unsigned long long z = s;
    z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
    z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL; return z ^ (z >> 31);
}
double u01() { return (next() >> 11) * (1.0 / 9007199254740992.0); }

double own_us(double base, double tail_prob, double tail_us) {
    return base * (0.8 + 0.4 * u01()) + (u01() < tail_prob ? tail_us : 0.0);
}

int main() {
    const double DEFAULT_US = 200000, COLO_US = 20000;   // 200 ms vs 20 ms, in microseconds
    int races = 10000;
    struct Bot { const char* name; double base, tail_p, tail_us, tier; int wins; };
    Bot a{"A: fast code, default tier ", 40, 0.001, 5000, DEFAULT_US, 0};
    Bot b{"B: slow code, colocated     ", 400, 0.01, 50000, COLO_US, 0};
    Bot c{"C: fast code, colocated     ", 40, 0.001, 5000, COLO_US, 0};
    for (int i = 0; i < races; ++i) {
        double ta = own_us(a.base, a.tail_p, a.tail_us) + a.tier;
        double tb = own_us(b.base, b.tail_p, b.tail_us) + b.tier;
        double tc = own_us(c.base, c.tail_p, c.tail_us) + c.tier;
        if (ta < tb && ta < tc) a.wins++; else if (tb < tc) b.wins++; else c.wins++;
    }
    for (Bot* x : {&a, &b, &c}) std::printf("%s wins %5d of %d\n", x->name, x->wins, races);
    // Without C in the race: does B beat A?
    int bw = 0;
    for (int i = 0; i < races; ++i)
        if (own_us(b.base, b.tail_p, b.tail_us) + b.tier < own_us(a.base, a.tail_p, a.tail_us) + a.tier) bw++;
    std::printf("B vs A alone: B wins %d of %d -- the tier dominates until everyone buys it\n", bw, races);
}
'''

# ═══ Week 2 · Session 2 — memory hierarchy, layout, ownership ═══

SRC["w2c1"] = r'''#include <cstdio>
#include <cstdint>
#include <vector>

// A pure-CPU model of a 32 KB, 8-way, 64-byte-line L1 cache with LRU
// replacement. We feed it ADDRESSES and count misses -- no timing at all.
struct Cache {
    static const int SETS = 64, WAYS = 8, LINE = 64;
    uint64_t tag[SETS][WAYS]; uint64_t age[SETS][WAYS]; uint64_t clock = 0, hits = 0, misses = 0;
    Cache() { for (auto& s : tag) for (auto& w : s) w = ~0ULL; for (auto& s : age) for (auto& w : s) w = 0; }
    void touch(uint64_t addr) {
        uint64_t line = addr / LINE, set = line % SETS, t = line / SETS; ++clock;
        int victim = 0;
        for (int w = 0; w < WAYS; ++w) {
            if (tag[set][w] == t) { age[set][w] = clock; ++hits; return; }
            if (age[set][w] < age[set][victim]) victim = w;
        }
        tag[set][victim] = t; age[set][victim] = clock; ++misses;
    }
};

uint64_t s = 32702;
uint64_t next() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return s; }   // xorshift64

void report(const char* name, Cache& c) {
    double n = double(c.hits + c.misses), rate = c.misses / n;
    // Model constants (stated, not measured): L1 hit 1 ns, miss to DRAM 100 ns.
    std::printf("%-30s miss rate %6.2f%%   modelled %6.1f ns/access\n", name, 100 * rate, 1 + 99 * rate);
}

int main() {
    const uint64_t N = 1 << 18;                       // 262,144 ints = 1 MB, far bigger than L1
    { Cache c; for (uint64_t i = 0; i < N; ++i) c.touch(4 * i);            report("sequential int scan", c); }
    { Cache c; for (uint64_t i = 0; i < N; ++i) c.touch(64 * (i % (N / 16))); report("stride 64 B (one int per line)", c); }
    { Cache c; for (uint64_t i = 0; i < N; ++i) c.touch(4 * (next() % N)); report("random index (pointer chase)", c); }
    { Cache c; for (int rep = 0; rep < 16; ++rep) for (uint64_t i = 0; i < 4096; ++i) c.touch(4 * i);
      report("16 KB working set, 16 passes", c); }
}
'''

SRC["w2c2"] = r'''#include <cstddef>
#include <cstdio>

struct Quote   { double px; int qty; char tag[40]; };          // AoS, as on the slide
struct Padded  { char side; double px; char venue; int qty; };  // careless field order
struct Packed  { double px; int qty; char side; char venue; };  // same fields, sorted by size

size_t lines(size_t bytes) { return (bytes + 63) / 64; }

int main() {
    std::printf("sizeof(Quote) = %zu (declared %zu, padded to alignof %zu)\n",
                sizeof(Quote), sizeof(double) + sizeof(int) + 40, alignof(Quote));
    std::printf("Padded: side@%zu px@%zu venue@%zu qty@%zu  sizeof %zu\n",
                offsetof(Padded, side), offsetof(Padded, px), offsetof(Padded, venue),
                offsetof(Padded, qty), sizeof(Padded));
    std::printf("Packed: px@%zu qty@%zu side@%zu venue@%zu  sizeof %zu\n",
                offsetof(Packed, px), offsetof(Packed, qty), offsetof(Packed, side),
                offsetof(Packed, venue), sizeof(Packed));

    const size_t n = 1024;                                      // scan 1024 prices
    std::printf("\nscan %zu prices:\n", n);
    std::printf("  AoS  vector<Quote>  : %4zu cache lines (~%zu price bytes used per 64 loaded)\n",
                lines(n * sizeof(Quote)), 64 * sizeof(double) / sizeof(Quote));
    std::printf("  AoS  vector<Padded> : %4zu cache lines\n", lines(n * sizeof(Padded)));
    std::printf("  AoS  vector<Packed> : %4zu cache lines\n", lines(n * sizeof(Packed)));
    std::printf("  SoA  vector<double> : %4zu cache lines (8 prices per line)\n", lines(n * sizeof(double)));
    std::printf("  SoA is %.1fx fewer lines than AoS<Quote>\n",
                double(lines(n * sizeof(Quote))) / lines(n * sizeof(double)));
}
'''

SRC["w2c3"] = r'''#include <atomic>
#include <cstdio>
#include <cstdlib>
#include <new>
#include <vector>

// Count every heap allocation the program makes: replace global operator new.
static std::atomic<long> g_allocs{0};           // atomic: -O2 may not reorder around it
void* operator new(std::size_t n) { ++g_allocs; if (void* p = std::malloc(n)) return p; throw std::bad_alloc(); }
void operator delete(void* p) noexcept { std::free(p); }
void operator delete(void* p, std::size_t) noexcept { std::free(p); }
void* operator new[](std::size_t n) { ++g_allocs; if (void* p = std::malloc(n)) return p; throw std::bad_alloc(); }
void operator delete[](void* p) noexcept { std::free(p); }
void operator delete[](void* p, std::size_t) noexcept { std::free(p); }
void* volatile g_sink;                   // escaping a pointer stops -O2 eliding the new

int main() {
    const int R = 100, C = 50;

    long a0 = g_allocs;                                   // the textbook double**
    double** m = new double*[R];
    for (int i = 0; i < R; ++i) { m[i] = new double[C]; g_sink = m[i]; }
    g_sink = m;
    long naive = g_allocs - a0;

    a0 = g_allocs;                                        // one contiguous block
    double* flat = new double[R * C];
    g_sink = flat;
    long contiguous = g_allocs - a0;
    auto at = [&](int i, int j) -> double& { return flat[i * C + j]; };   // row-major index
    at(3, 7) = 42.0;

    std::printf("double** matrix: %ld allocations, two loads per element\n", naive);
    std::printf("flat matrix:     %ld allocation, one multiply-add per element\n", contiguous);
    std::printf("flat[3*C+7] = %.1f; &at(3,8) - &at(3,7) = %td element, %td bytes\n",
                at(3, 7), &at(3, 8) - &at(3, 7),
                (char*)&at(3, 8) - (char*)&at(3, 7));
    std::printf("row step: &at(4,0) - &at(3,0) = %td elements\n", &at(4, 0) - &at(3, 0));

    a0 = g_allocs;
    std::vector<int> grow; for (int i = 0; i < 100000; ++i) grow.push_back(i);
    long grown = g_allocs - a0;
    a0 = g_allocs;
    std::vector<int> sized; sized.reserve(100000); for (int i = 0; i < 100000; ++i) sized.push_back(i);
    std::printf("100k push_backs: %ld allocations without reserve, %ld with reserve\n",
                grown, g_allocs - a0);

    for (int i = 0; i < R; ++i) delete[] m[i];
    delete[] m; delete[] flat;
}
'''

SRC["w2c4"] = r'''#include <cstdio>
#include <cstring>
#include <utility>
#include <vector>

// Rule of five, instrumented: every special member counts itself.
struct Counts { long copy = 0, move = 0, dtor = 0; };

template <bool NOEXCEPT_MOVE>
struct Order {
    static Counts c;
    char* note;                                             // an owned heap buffer
    explicit Order(const char* s) : note(new char[32]) { std::strncpy(note, s, 31); note[31] = 0; }
    Order(const Order& o) : note(new char[32]) { std::memcpy(note, o.note, 32); ++c.copy; }
    Order(Order&& o) noexcept(NOEXCEPT_MOVE) : note(o.note) { o.note = nullptr; ++c.move; }
    Order& operator=(const Order& o) { if (this != &o) { Order t(o); std::swap(note, t.note); } return *this; }
    Order& operator=(Order&& o) noexcept { std::swap(note, o.note); return *this; }
    ~Order() { delete[] note; ++c.dtor; }
};
template <bool B> Counts Order<B>::c;

template <bool B> void run(const char* label) {
    { std::vector<Order<B>> v; for (int i = 0; i < 1000; ++i) v.emplace_back("limit buy"); }
    auto& c = Order<B>::c;
    std::printf("%-26s copies %4ld  moves %4ld  destructors %4ld\n", label, c.copy, c.move, c.dtor);
}

int main() {
    run<true >("move ctor noexcept:");
    run<false>("move ctor may throw:");
    Order<true> a("sell 100"); Order<true> b = std::move(a);          // steal the buffer
    std::printf("after std::move: a.note is %s, b.note = \"%s\"\n", a.note ? "set" : "nullptr", b.note);
}
'''

SRC["w2c5"] = r'''#include <atomic>
#include <cstdio>
#include <cstdlib>
#include <memory>
#include <new>

static std::atomic<long> g_allocs{0};
void* operator new(std::size_t n) { ++g_allocs; if (void* p = std::malloc(n)) return p; throw std::bad_alloc(); }
void operator delete(void* p) noexcept { std::free(p); }
void operator delete(void* p, std::size_t) noexcept { std::free(p); }

struct Book { const char* name; explicit Book(const char* n) : name(n) {} ~Book() { std::printf("  ~Book(%s)\n", name); } };
struct Node { std::shared_ptr<Node> next; std::weak_ptr<Node> prev; const char* n;
              ~Node() { std::printf("  ~Node(%s)\n", n); } };
struct Leaky { std::shared_ptr<Leaky> other; ~Leaky() { std::printf("  ~Leaky\n"); } };

int main() {
    std::printf("sizeof unique_ptr %zu, shared_ptr %zu, raw pointer %zu\n",
                sizeof(std::unique_ptr<Book>), sizeof(std::shared_ptr<Book>), sizeof(Book*));

    long a0 = g_allocs; auto s1 = std::make_shared<Book>("made");
    long mk = g_allocs - a0; a0 = g_allocs;
    std::shared_ptr<Book> s2(new Book("newed"));
    std::printf("make_shared: %ld allocation; shared_ptr(new T): %ld allocations\n", mk, g_allocs - a0);

    { auto c1 = s1, c2 = s1, c3 = s1;                         // three ATOMIC increments
      std::printf("use_count while copied: %ld\n", s1.use_count()); }
    std::printf("use_count after scope:  %ld\n", s1.use_count());

    auto u = std::make_unique<Book>("owned");
    auto u2 = std::move(u);                                   // transfer; copying would not compile
    std::printf("after move: u %s, u2 %s\n", u ? "owns" : "empty", u2 ? "owns" : "empty");

    std::printf("cycle with shared_ptr both ways:\n");
    { auto x = std::make_shared<Leaky>(), y = std::make_shared<Leaky>(); x->other = y; y->other = x; }
    std::printf("  (no destructor ran: leaked)\ncycle broken with weak_ptr:\n");
    { auto p = std::make_shared<Node>(); p->n = "head";
      auto q = std::make_shared<Node>(); q->n = "tail";
      p->next = q; q->prev = p; }
    std::printf("end of main:\n");
}
'''

# ═══ Week 3 · Session 3 — allocators, pools, templates ═══

SRC["w3c1"] = r'''#include <atomic>
#include <cstdio>
#include <cstdlib>
#include <map>
#include <memory>
#include <new>
#include <string>
#include <vector>

static std::atomic<long> g_allocs{0};
void* operator new(std::size_t n) { ++g_allocs; if (void* p = std::malloc(n)) return p; throw std::bad_alloc(); }
void operator delete(void* p) noexcept { std::free(p); }
void operator delete(void* p, std::size_t) noexcept { std::free(p); }

struct Order { long px, qty; char side; };
std::map<long, long> g_levels;                  // node-based: every new key is a heap node
std::vector<Order> g_out;

// The on_book everybody writes first: correct, and full of hidden `new`.
void on_book_naive(const std::string& sym, long bid, long ask, int tick) {
    std::string key = sym + "/" + std::to_string(tick);         // a long string: heap
    std::vector<long> depth(10, bid);                           // a vector: heap
    g_levels[bid - tick % 50] += 1;                             // a map insert: heap, sometimes
    auto o = std::make_shared<Order>(Order{ask, 100, 'B'});    // control block + object: heap
    g_out.push_back(*o);                                        // growth: heap, sometimes
    (void)key; (void)depth;
}

// Same work, memory owned up front: fixed arrays, a pre-reserved vector, no strings.
struct Hot { long depth[10]; long levels[64] = {}; std::vector<Order> out; } g_hot;
void on_book_hot(long bid, long ask, int tick) {
    for (long& d : g_hot.depth) d = bid;
    g_hot.levels[(bid - tick % 50) & 63] += 1;
    g_hot.out.push_back(Order{ask, 100, 'B'});
}

int main() {
    const int T = 10000;
    long a0 = g_allocs;
    for (int t = 0; t < T; ++t) on_book_naive("AAPL.NASDAQ.EQUITY", 10002, 10004, t);
    long naive = g_allocs - a0;
    g_hot.out.reserve(T);                                       // startup, off the hot path
    a0 = g_allocs;
    for (int t = 0; t < T; ++t) on_book_hot(10002, 10004, t);
    long hot = g_allocs - a0;
    std::printf("naive on_book: %ld heap allocations in %d ticks (%.2f per tick)\n", naive, T, double(naive) / T);
    std::printf("hot on_book:   %ld heap allocations in %d ticks\n", hot, T);
    std::string sso = "AAPL", big = "AAPL.NASDAQ.EQUITY.LONGNAME";
    a0 = g_allocs; std::string c1 = sso; long s1 = g_allocs - a0;
    a0 = g_allocs; std::string c2 = big; long s2 = g_allocs - a0;
    std::printf("copy a %zu-char string: %ld alloc; a %zu-char string: %ld alloc (small-string buffer)\n",
                sso.size(), s1, big.size(), s2);
}
'''

SRC["w3c2"] = r'''#include <cstdio>
#include <new>

struct Order { long id, px, qty; char side; };

// A fixed-size object pool: one buffer owned once, an intrusive free list
// threaded through the unused slots. alloc() and free() are both O(1):
// pop or push the head of the list. No system call, no lock, no search.
template <class T, int N>
class Pool {
    union Slot { Slot* next; alignas(T) unsigned char mem[sizeof(T)]; };
    Slot slots_[N];
    Slot* head_;
    int live_ = 0;
public:
    Pool() : head_(&slots_[0]) {
        for (int i = 0; i < N - 1; ++i) slots_[i].next = &slots_[i + 1];
        slots_[N - 1].next = nullptr;
    }
    template <class... A> T* alloc(A&&... a) {
        if (!head_) return nullptr;                    // exhausted: the caller decides
        Slot* s = head_; head_ = s->next; ++live_;
        return new (s->mem) T{static_cast<A&&>(a)...}; // placement new: construct in place
    }
    void free(T* p) {
        p->~T();                                       // explicit destructor, no delete
        Slot* s = reinterpret_cast<Slot*>(p); s->next = head_; head_ = s; --live_;
    }
    int index(const T* p) const { return int(reinterpret_cast<const Slot*>(p) - slots_); }
    int live() const { return live_; }
};

int main() {
    static Pool<Order, 4> pool;
    Order* a = pool.alloc(1L, 10002L, 100L, 'B');
    Order* b = pool.alloc(2L, 10003L, 200L, 'B');
    Order* c = pool.alloc(3L, 10004L, 300L, 'S');
    std::printf("a,b,c in slots %d,%d,%d  live=%d\n", pool.index(a), pool.index(b), pool.index(c), pool.live());
    pool.free(b);
    Order* d = pool.alloc(4L, 10005L, 400L, 'S');
    std::printf("free(b) then alloc -> slot %d (LIFO: the line b just warmed)  d.px=%ld\n", pool.index(d), d->px);
    Order* e = pool.alloc(5L, 1L, 1L, 'B');
    Order* f = pool.alloc(6L, 1L, 1L, 'B');
    std::printf("e in slot %d, f = %s (pool of 4 is exhausted)  live=%d\n",
                pool.index(e), f ? "ok" : "nullptr", pool.live());
    std::printf("sizeof(Pool<Order,4>) = %zu bytes, all of it reserved before the first tick\n", sizeof(pool));
}
'''

SRC["w3c3"] = r'''#include <cstddef>
#include <cstdio>
#include <new>

// A bump (arena) allocator: allocation is "round up, add". There is no
// per-object free: the whole arena resets at the end of the tick.
class Arena {
    alignas(64) unsigned char buf_[1024];
    std::size_t top_ = 0, high_ = 0;
public:
    void* alloc(std::size_t n, std::size_t align) {
        std::size_t at = (top_ + align - 1) & ~(align - 1);     // align must be a power of two
        if (at + n > sizeof buf_) return nullptr;
        top_ = at + n; if (top_ > high_) high_ = top_;
        return buf_ + at;
    }
    std::size_t offset(const void* p) const { return static_cast<const unsigned char*>(p) - buf_; }
    void reset() { top_ = 0; }
    std::size_t used() const { return top_; }
    std::size_t high_water() const { return high_; }
};

static int g_live = 0;
struct Msg { long seq; double px; Msg(long s, double p) : seq(s), px(p) { ++g_live; } ~Msg() { --g_live; } };

int main() {
    Arena a;
    char* tag = static_cast<char*>(a.alloc(3, 1));                  // 3 bytes at offset 0
    void* raw = a.alloc(sizeof(Msg), alignof(Msg));                 // rounded up to 8
    Msg* m = new (raw) Msg(7, 100.02);                              // placement new
    void* line = a.alloc(64, 64);                                   // its own cache line
    std::printf("tag@%zu  Msg@%zu (sizeof %zu, align %zu)  line@%zu  used=%zu\n",
                a.offset(tag), a.offset(m), sizeof(Msg), alignof(Msg), a.offset(line), a.used());
    std::printf("live Msg objects: %d  seq=%ld px=%.2f\n", g_live, m->seq, m->px);
    m->~Msg();                                                      // explicit destructor call
    a.reset();                                                      // one store frees everything
    std::printf("after ~Msg and reset: live=%d used=%zu\n", g_live, a.used());

    struct Px { long seq; double px; };                             // trivially destructible
    for (int tick = 0; tick < 1000; ++tick) {                      // per-tick scratch, reused
        for (int k = 0; k < 1 + tick % 20; ++k) new (a.alloc(sizeof(Px), alignof(Px))) Px{k, 1.0};
        a.reset();                                                  // no destructors to run
    }
    std::printf("1000 ticks of scratch: high-water %zu of 1024 bytes, zero heap calls\n", a.high_water());
}
'''

SRC["w3c4"] = r'''#include <cstdio>
#include <memory_resource>
#include <string>
#include <vector>

// A memory_resource that forwards to new/delete and COUNTS every call, so we
// can see exactly when a pmr container falls back to the heap.
struct Counting : std::pmr::memory_resource {
    long calls = 0, bytes = 0;
    void* do_allocate(std::size_t n, std::size_t al) override {
        ++calls; bytes += n; return std::pmr::new_delete_resource()->allocate(n, al); }
    void do_deallocate(void* p, std::size_t n, std::size_t al) override {
        std::pmr::new_delete_resource()->deallocate(p, n, al); }
    bool do_is_equal(const std::pmr::memory_resource& o) const noexcept override { return this == &o; }
};

void tick(std::pmr::memory_resource* mr, int t) {
    std::pmr::vector<long> levels(mr);                   // same vector type, different allocator
    levels.reserve(32);
    for (int i = 0; i < 32; ++i) levels.push_back(10000 + i + t);
    std::pmr::string note("per-tick scratch note, long enough to leave SSO", mr);
    (void)note;
}

int main() {
    Counting heap;
    for (int t = 0; t < 1000; ++t) tick(&heap, t);
    std::printf("plain counting resource: %ld upstream allocations for 1000 ticks\n", heap.calls);

    alignas(64) static unsigned char buf[4096];          // stack/static scratch, owned once
    Counting up1;
    for (int t = 0; t < 1000; ++t) {
        std::pmr::monotonic_buffer_resource mono(buf, sizeof buf, &up1);
        tick(&mono, t);                                  // bump-allocates inside buf
    }                                                    // destructor = release(): nothing to free
    std::printf("monotonic over a 4 KB buffer: %ld upstream allocations\n", up1.calls);

    Counting up2;
    { std::pmr::monotonic_buffer_resource small(buf, 128, &up2);
      for (int t = 0; t < 10; ++t) tick(&small, t); }
    std::printf("monotonic over only 128 bytes, 10 ticks: %ld upstream allocations, %ld bytes\n",
                up2.calls, up2.bytes);

    std::pmr::monotonic_buffer_resource strict(buf, 64, std::pmr::null_memory_resource());
    try { tick(&strict, 0); std::printf("fit\n"); }
    catch (const std::bad_alloc&) { std::printf("null upstream: overflow throws bad_alloc instead of touching the heap\n"); }
}
'''

SRC["w3c5"] = r'''#include <cstdio>
#include <cstring>
#include <type_traits>

// A generic field writer: one variadic template, one fold expression, and
// if constexpr choosing the encoding per type AT COMPILE TIME. The compiler
// stamps out a specialised function per call signature -- no runtime switch.
struct Buf { char data[128]; int len = 0; };

template <class T> void put(Buf& b, const T& v) {
    if constexpr (std::is_same_v<T, char>)                 b.data[b.len++] = v;
    else if constexpr (std::is_integral_v<T>)              b.len += std::snprintf(b.data + b.len, 32, "%lld", (long long)v);
    else if constexpr (std::is_convertible_v<T, const char*>) { std::size_t n = std::strlen(v); std::memcpy(b.data + b.len, v, n); b.len += int(n); }
    else static_assert(!sizeof(T), "no encoding for this type");
    b.data[b.len++] = '|';
}
template <class... F> int write_fields(Buf& b, const F&... f) {
    (put(b, f), ...);                                      // left fold over the comma operator
    return int(sizeof...(F));
}

// Runtime polymorphism for comparison: every object carries a vptr.
struct Strategy { virtual long signal(long px) const = 0; virtual ~Strategy() = default; };
struct Momentum : Strategy { long last = 0; long signal(long px) const override { return px - last; } };
struct Plain { long last = 0; long signal(long px) const { return px - last; } };
template <class S> long run(const S& s, long px) { return s.signal(px); }   // resolved at compile time

int main() {
    Buf b;
    int n = write_fields(b, 'B', 10002L, 300, "AAPL", (unsigned short)7);
    b.data[b.len] = 0;
    std::printf("%d fields -> \"%s\" (%d bytes)\n", n, b.data, b.len);
    std::printf("sizeof(Momentum) with vptr = %zu, sizeof(Plain) = %zu\n", sizeof(Momentum), sizeof(Plain));
    Momentum m; m.last = 10000; Plain p; p.last = 10000;
    const Strategy& base = m;
    std::printf("virtual call %ld, template call %ld -- same answer, one needs a vtable load\n",
                base.signal(10002), run(p, 10002));
    // write_fields(b, 3.14);   // would not compile: static_assert "no encoding for this type"
}
'''

# ═══ Week 4 · Session 4 — compile-time dispatch and the order book ═══

SRC["w4c1"] = r'''#include <array>
#include <cstdio>

// Fixed-point prices: 4 implied decimals, so 100.0450 is the integer 1000450.
constexpr std::array<long long, 10> make_pow10() {
    std::array<long long, 10> t{}; long long v = 1;
    for (auto& x : t) { x = v; v *= 10; }
    return t;
}
constexpr auto POW10 = make_pow10();                      // built by the compiler

constexpr long long parse_px(const char* s) {             // "100.045" -> 1000450
    long long whole = 0, frac = 0; int nd = 0;
    while (*s && *s != '.') whole = whole * 10 + (*s++ - '0');
    if (*s == '.') ++s;
    while (*s && nd < 4) { frac = frac * 10 + (*s++ - '0'); ++nd; }
    return whole * POW10[4] + frac * POW10[4 - nd];
}
consteval int band_slots(long long lo, long long hi, long long tick) { return int((hi - lo) / tick) + 1; }

// A compile-time lookup table: the fee in 1e-2 bps for each of 8 liquidity flags.
constexpr std::array<int, 8> FEE = [] { std::array<int, 8> f{};
    for (int i = 0; i < 8; ++i) f[i] = (i & 1) ? -500 : 3000; return f; }();

static_assert(POW10[4] == 10000);
static_assert(parse_px("100.045") == 1000450);
static_assert(parse_px("99.5") == 995000);
static_assert(band_slots(parse_px("95.00"), parse_px("105.00"), 100) == 1001);

int main() {
    // Nothing below is computed at run time except the printf calls: the
    // values are constants baked into the binary, and a wrong one fails the build.
    constexpr long long px = parse_px("100.045");
    constexpr int slots = band_slots(parse_px("95.00"), parse_px("105.00"), 100);
    std::printf("parse_px(\"100.045\") = %lld  (as a price: %lld.%04lld)\n", px, px / POW10[4], px % POW10[4]);
    std::printf("a +/-5%% band around 100.00 at a 1-cent tick = %d slots\n", slots);
    std::printf("fee table (1e-2 bps): taker %d, maker %d\n", FEE[0], FEE[1]);
    volatile int pick = 1;                                    // opaque to the optimiser
    const char* at_runtime = pick ? "185.5" : "0";
    std::printf("same function at run time on \"185.5\": %lld\n", parse_px(at_runtime));
}
'''

SRC["w4c2"] = r'''#include <cstdio>
#include <variant>
#include <vector>

// The arena protocol is a discriminated union keyed on "type". In C++ the
// same idea is std::variant: the tag is checked once, and std::visit jumps
// straight to the right handler -- no inheritance, no heap, no virtual call.
struct BookSnapshot { long bid, ask; };
struct OrderAck     { long id; long queue_ahead; };
struct Fill         { long id, px, qty; };
struct Heartbeat    {};
using Msg = std::variant<BookSnapshot, OrderAck, Fill, Heartbeat>;

template <class... F> struct overloaded : F... { using F::operator()...; };

// CRTP: the base calls the derived class's hook, resolved at compile time.
template <class Derived> struct BotBase {
    long books = 0, fills = 0;
    void dispatch(const Msg& m) {
        std::visit(overloaded{
            [&](const BookSnapshot& b) { ++books; static_cast<Derived*>(this)->on_book(b.bid, b.ask); },
            [&](const Fill& f)         { ++fills; static_cast<Derived*>(this)->on_fill(f.px, f.qty); },
            [&](const OrderAck& a)     { std::printf("  ack id=%ld queue_ahead=%ld\n", a.id, a.queue_ahead); },
            [&](const Heartbeat&)      {} }, m);
    }
};
struct MyBot : BotBase<MyBot> {
    long pos = 0, last_mid2 = 0;
    void on_book(long bid, long ask) { last_mid2 = bid + ask; }
    void on_fill(long, long qty) { pos += qty; }
};

int main() {
    std::vector<Msg> tape = { BookSnapshot{10002, 10004}, OrderAck{7, 3}, Heartbeat{},
                              BookSnapshot{10003, 10004}, Fill{7, 10003, 100}, Fill{7, 10003, 50} };
    MyBot bot;
    for (const Msg& m : tape) bot.dispatch(m);
    std::printf("books=%ld fills=%ld pos=%ld last mid=%.3f\n", bot.books, bot.fills, bot.pos, bot.last_mid2 / 200.0);
    std::printf("sizeof(Msg) = %zu (largest alternative %zu + tag), index of Fill = %zu\n",
                sizeof(Msg), sizeof(Fill), Msg(Fill{}).index());
    std::printf("sizeof(MyBot) = %zu: no vptr, CRTP costs nothing at run time\n", sizeof(MyBot));
}
'''

SRC["w4c3"] = r'''#include <cstdint>
#include <cstdio>
#include <cstring>

// SymMap: open addressing with linear probing. Keys live INLINE in one flat
// array, so a probe sequence walks adjacent memory instead of chasing nodes.
uint64_t fnv1a(const char* s) { uint64_t h = 1469598103934665603ULL;
    while (*s) { h ^= (unsigned char)*s++; h *= 1099511628211ULL; } return h; }

template <int CAP>                                   // CAP is a power of two
struct SymMap {
    struct Slot { char key[12]; int value; bool used; } t[CAP] = {};
    long probes = 0, max_probe = 0;
    int* find_or_insert(const char* k) {
        uint64_t i = fnv1a(k) & (CAP - 1); long p = 1;
        while (t[i].used && std::strcmp(t[i].key, k) != 0) { i = (i + 1) & (CAP - 1); ++p; }
        probes += p; if (p > max_probe) max_probe = p;
        if (!t[i].used) { t[i].used = true; std::strncpy(t[i].key, k, 11); t[i].value = 0; }
        return &t[i].value;
    }
};

template <int CAP> void load(int n) {
    static SymMap<CAP> m; char k[12];
    for (int i = 0; i < n; ++i) { std::snprintf(k, sizeof k, "SYM%04d", i); *m.find_or_insert(k) = i; }
    m.probes = 0; m.max_probe = 0;                   // now measure LOOKUPS of every key
    for (int i = 0; i < n; ++i) { std::snprintf(k, sizeof k, "SYM%04d", i); (void)m.find_or_insert(k); }
    std::printf("cap %5d  keys %4d  load %.2f  avg probes %.2f  max probe %ld  (%zu bytes, 0 nodes)\n",
                CAP, n, double(n) / CAP, double(m.probes) / n, m.max_probe, sizeof(m.t));
}

int main() {
    load<4096>(1000);
    load<2048>(1000);
    load<1024>(700);
    load<1024>(900);
    load<1024>(1000);
    std::printf("chaining (unordered_map) would hold the same 1000 keys in 1000 separate heap nodes\n");
}
'''

SRC["w4c4"] = r'''#include <cstdio>

// The flat, price-indexed book: a BAND of one-cent slots around the open.
// slot = tick - base_tick, so add is one store and the touch is a cached index.
struct FlatSide {
    static const int N = 1001;                        // +/-5% of 100.00 at 1 cent
    long base; long qty[N] = {}; int best = -1; bool is_bid; long scans = 0;
    FlatSide(long b, bool bid) : base(b), is_bid(bid) {}
    bool better(int a, int b) const { return is_bid ? a > b : a < b; }
    bool add(long tick, long q) {
        long s = tick - base;
        if (s < 0 || s >= N) return false;           // outside the band: reject, never resize
        qty[s] += q;
        if (best < 0 || better(int(s), best)) best = int(s);
        return true;
    }
    void cancel(long tick, long q) {
        long s = tick - base; qty[s] -= q;
        if (s == best && qty[s] == 0) {               // the touch emptied: scan for the next one
            int step = is_bid ? -1 : 1, i = best;
            while (i >= 0 && i < N && qty[i] == 0) { i += step; ++scans; }
            best = (i >= 0 && i < N) ? i : -1;
        }
    }
    long best_tick() const { return best < 0 ? -1 : base + best; }
};

int main() {
    FlatSide bids(9500, true);                        // base tick 95.00
    bids.add(10002, 500); bids.add(10001, 800); bids.add(9990, 200);
    std::printf("best bid %.2f (slot %d)\n", bids.best_tick() / 100.0, bids.best);
    bids.cancel(10002, 500);
    std::printf("cancel the touch -> best %.2f after scanning %ld slots\n", bids.best_tick() / 100.0, bids.scans);
    bids.cancel(10001, 800);
    std::printf("cancel again     -> best %.2f after scanning %ld slots in total\n", bids.best_tick() / 100.0, bids.scans);
    std::printf("add at 106.00 (outside band): %s\n", bids.add(10600, 100) ? "accepted" : "rejected");
    std::printf("footprint %zu bytes = %zu cache lines; touch read = one load\n",
                sizeof(bids.qty), sizeof(bids.qty) / 64);
}
'''

SRC["w4c5"] = r'''#include <cstdio>
#include <deque>

// FIFO per price level, and knowing where YOU stand in it. The venue keys
// the queue on arrival sequence; queue_ahead = shares resting in front of you.
struct Resting { int id; long qty; };
std::deque<Resting> level;                          // one price level, oldest first

long queue_ahead(int id) {
    long ahead = 0;
    for (auto& r : level) { if (r.id == id) return ahead; ahead += r.qty; }
    return -1;
}
void trade(long q) {                                 // an aggressive sell eats from the front
    while (q > 0 && !level.empty()) {
        long take = q < level.front().qty ? q : level.front().qty;
        level.front().qty -= take; q -= take;
        if (level.front().qty == 0) level.pop_front();
    }
}
void cancel(int id) { for (auto it = level.begin(); it != level.end(); ++it) if (it->id == id) { level.erase(it); return; } }

int main() {
    level = {{1, 300}, {2, 500}, {99, 200}, {3, 400}};  // we are id 99
    std::printf("joined: queue_ahead = %ld\n", queue_ahead(99));
    trade(600);
    std::printf("after 600 traded: queue_ahead = %ld\n", queue_ahead(99));
    cancel(2);                                           // someone ahead of us leaves
    std::printf("after id 2 cancels: queue_ahead = %ld\n", queue_ahead(99));
    // Now we "requote" at the same price: cancel + new order = back of the line.
    cancel(99); level.push_back({99, 200});
    std::printf("after cancel-and-repost at the SAME price: queue_ahead = %ld\n", queue_ahead(99));
    trade(300);                                          // the next aggressive sell
    long mine = 0; for (auto& r : level) if (r.id == 99) mine = r.qty;
    std::printf("next sell of 300: we filled %ld of 200 (id 3 took it); staying put would have filled all 200\n", 200 - mine);
}
'''

# ═══ Week 5 · Session 5 — midterm; complexity, the cache and atomics ═══

SRC["w5c1"] = r'''#include <cstdio>
#include <initializer_list>

// Big-O counts comparisons; the machine charges for cache lines. Find a price
// level among n sorted levels three ways and count BOTH.
struct Cost { long cmps = 0, lines = 0; };

Cost linear(int n, int target) {               // contiguous array of 8-byte ticks
    Cost c; int i = 0;
    while (i < n) { ++c.cmps; if (i == target) break; ++i; }
    c.lines = (long)(i * 8) / 64 + 1;          // walked memory is sequential
    return c;
}
Cost binary(int n, int target) {               // same array, halving
    Cost c; int lo = 0, hi = n - 1, last_line = -1;
    while (lo <= hi) { int mid = (lo + hi) / 2; ++c.cmps;
        if (mid * 8 / 64 != last_line) { ++c.lines; last_line = mid * 8 / 64; }
        if (mid == target) break; if (mid < target) lo = mid + 1; else hi = mid - 1; }
    return c;
}
Cost tree(int n, int target) {                 // std::map: every node its own heap line
    Cost c; int lo = 0, hi = n - 1;
    while (lo <= hi) { int mid = (lo + hi) / 2; ++c.cmps; ++c.lines;
        if (mid == target) break; if (mid < target) lo = mid + 1; else hi = mid - 1; }
    return c;
}

int main() {
    // Model constants (stated): 1 ns per comparison, 100 ns per cold line, and
    // 5 ns for each further SEQUENTIAL line, which the hardware prefetcher hides.
    for (int n : {8, 16, 1000}) {
        int target = n / 4;                    // the touch region is near the front
        Cost L = linear(n, target), B = binary(n, target), T = tree(n, target);
        std::printf("n=%4d  linear %3ld cmp %2ld lines | binary %2ld cmp %2ld lines | map %2ld cmp %2ld lines\n",
                    n, L.cmps, L.lines, B.cmps, B.lines, T.cmps, T.lines);
        std::printf("        modelled ns: linear %5ld   binary %5ld   map %5ld\n",
                    L.cmps + 100 + 5 * (L.lines - 1), B.cmps + 100 * B.lines, T.cmps + 100 * T.lines);
    }
}
'''

SRC["w5c2"] = r'''#include <cstdio>
#include <vector>

// Amortized O(1) is an AVERAGE. Count the element copies each push_back
// triggers: most cost nothing, and a few copy the whole vector.
int main() {
    std::vector<long> v;
    long total = 0, worst = 0, worst_at = 0, reallocs = 0;
    for (long i = 0; i < 100000; ++i) {
        std::size_t cap = v.capacity();
        v.push_back(i);
        if (v.capacity() != cap) {                 // this push reallocated
            long moved = (long)cap; total += moved; ++reallocs;
            if (moved > worst) { worst = moved; worst_at = i; }
        }
    }
    std::printf("100000 push_backs: %ld reallocations, %ld element copies in total\n", reallocs, total);
    std::printf("amortized: %.2f copies per push   worst single push: %ld copies (push #%ld)\n",
                double(total) / 100000, worst, worst_at);
    std::printf("growth factor seen: capacity %zu for %zu elements\n", v.capacity(), v.size());

    std::vector<long> r; r.reserve(100000);        // startup: pay once, off the hot path
    long rre = 0;
    for (long i = 0; i < 100000; ++i) { std::size_t cap = r.capacity(); r.push_back(i); if (r.capacity() != cap) ++rre; }
    std::printf("with reserve: %ld reallocations -> every push is the same cost: the tail is gone\n", rre);
}
'''

SRC["w5c3"] = r'''#include <cmath>
#include <cstdio>

// A rolling window lives in a ring buffer; its statistics are UPDATED per tick
// (O(1)), never recomputed over the window (O(W)).
unsigned long long s = 32705;
unsigned long long next() { s += 0x9E3779B97F4A7C15ULL; unsigned long long z = s;
    z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL; z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL; return z ^ (z >> 31); }
double u01() { return (next() >> 11) * (1.0 / 9007199254740992.0); }

const int W = 64;                                  // power of two: index with a mask
struct Rolling {
    double buf[W] = {}; unsigned head = 0, n = 0; double sum = 0; long ops = 0;
    double push(double x) {
        if (n == W) sum -= buf[head & (W - 1)]; else ++n;
        buf[head & (W - 1)] = x; ++head; sum += x; ops += 2;
        return sum / n;
    }
};

int main() {
    Rolling r; long recompute_ops = 0; double px = 10000.0, last_inc = 0, last_re = 0;
    double ema = px, alpha = 2.0 / (W + 1);
    double mean = 0, m2 = 0; long k = 0;           // Welford
    double naive_s = 0, naive_ss = 0;              // the textbook E[x^2]-E[x]^2
    static double hist[100000];
    for (int t = 0; t < 100000; ++t) {
        px += (u01() - 0.5) * 0.02; hist[t] = px;
        last_inc = r.push(px);
        int lo = t - W + 1 < 0 ? 0 : t - W + 1; double acc = 0;
        for (int i = lo; i <= t; ++i) { acc += hist[i]; ++recompute_ops; }
        last_re = acc / (t - lo + 1);
        ema += alpha * (px - ema);
        ++k; double d = px - mean; mean += d / k; m2 += d * (px - mean);
        naive_s += px; naive_ss += px * px;
    }
    std::printf("rolling mean: incremental %.6f  recomputed %.6f  |diff| %.1e\n", last_inc, last_re, std::fabs(last_inc - last_re));
    std::printf("work: incremental %ld ops, recompute %ld ops (%.0fx)\n", r.ops, recompute_ops, double(recompute_ops) / r.ops);
    std::printf("EMA(alpha=2/65) %.6f\n", ema);
    double var_w = m2 / (k - 1);
    double var_n = (naive_ss - naive_s * naive_s / k) / (k - 1);
    std::printf("variance: Welford %.10f  naive sum-of-squares %.10f\n", var_w, var_n);
    std::printf("relative error of the naive formula: %.1e (catastrophic cancellation at px ~ 1e4)\n",
                std::fabs(var_n - var_w) / var_w);
}
'''

SRC["w5c4"] = r'''#include <atomic>
#include <cstdio>
#include <thread>

// counter++ is three steps: LOAD, ADD, STORE. Enumerate every interleaving of
// two threads doing it once -- a pure-CPU model of the race, no threads needed.
int lost = 0, ok = 0;
void explore(int pa, int pb, int ra, int rb, int mem) {
    if (pa == 3 && pb == 3) { (mem == 2 ? ok : lost)++; return; }
    if (pa < 3) { int r = ra, m = mem;                  // step thread A
        if (pa == 0) r = m; else if (pa == 1) r = r + 1; else m = r;
        explore(pa + 1, pb, r, rb, m); }
    if (pb < 3) { int r = rb, m = mem;                  // step thread B
        if (pb == 0) r = m; else if (pb == 1) r = r + 1; else m = r;
        explore(pa, pb + 1, ra, r, m); }
}

int main() {
    explore(0, 0, 0, 0, 0);
    std::printf("two threads x one plain ++: %d interleavings, %d give 2, %d LOSE an update\n", ok + lost, ok, lost);

    // The real fix: an atomic read-modify-write. The result no longer depends
    // on the schedule, so this line prints the same thing on every run.
    std::atomic<long> counter{0};
    auto work = [&] { for (int i = 0; i < 1000000; ++i) counter.fetch_add(1, std::memory_order_relaxed); };
    std::thread a(work), b(work); a.join(); b.join();
    std::printf("std::atomic<long> fetch_add(relaxed), 2 threads x 1e6: %ld\n", counter.load());
    std::printf("is_lock_free: %s   (volatile would not help: it orders nothing and is not atomic)\n",
                counter.is_lock_free() ? "yes" : "no");
}
'''

SRC["w5c5"] = r'''#include <atomic>
#include <cstdint>
#include <cstdio>
#include <thread>

// Publishing data safely: write the payload with plain stores, then set a flag
// with RELEASE. A reader that sees the flag with ACQUIRE is guaranteed to see
// the payload too (happens-before). One slot, handed back and forth.
struct Touch { long bid, ask, seq; };
Touch slot;                                       // plain, non-atomic payload
alignas(64) std::atomic<int> full{0};            // 0 = empty, 1 = full: its own cache line

int main() {
    const long N = 200000;
    long torn = 0, checksum = 0;
    std::thread producer([&] {
        for (long i = 1; i <= N; ++i) {
            while (full.load(std::memory_order_acquire) == 1) {}    // wait for the consumer
            slot = Touch{10000 + i % 7, 10002 + i % 7, i};          // plain stores...
            full.store(1, std::memory_order_release);               // ...published by this one
        }
    });
    for (long i = 1; i <= N; ++i) {
        while (full.load(std::memory_order_acquire) == 0) {}        // acquire pairs with release
        Touch t = slot;
        if (t.seq != i || t.ask - t.bid != 2) ++torn;                // a torn or stale read?
        checksum += t.bid;
        full.store(0, std::memory_order_release);
    }
    producer.join();
    std::printf("%ld handoffs, %ld torn or out-of-order reads, checksum %ld\n", N, torn, checksum);
    std::printf("&full %% 64 = %zu: the flag starts its own cache line, apart from the payload\n",
                (std::size_t)(reinterpret_cast<std::uintptr_t>(&full) % 64));
}
'''

# ═══ Week 6 · Session 6 — lock-free pipelines and shared memory ═══

SRC["w6c1"] = r'''#include <atomic>
#include <cstdio>
#include <initializer_list>

// A deterministic replay of the ABA problem on a lock-free stack of node
// indices. "CAS" = compare-and-swap: write only if the value is still what we read.
struct Head { int top; unsigned tag; };
int next_of[8];

bool cas(Head& h, Head expect, Head desired, bool use_tag) {
    bool same = h.top == expect.top && (!use_tag || h.tag == expect.tag);
    if (same) h = desired;
    return same;
}

void scenario(bool use_tag) {
    // stack: A(0) -> B(1) -> C(2)
    next_of[0] = 1; next_of[1] = 2; next_of[2] = -1;
    Head h{0, 0};
    // T1 begins pop(): reads top=A and A->next=B, then is preempted.
    Head seen = h; int seen_next = next_of[seen.top];
    // T2 runs: pop A, pop B, push A back (A's slot is reused).
    h = {next_of[0], h.tag + 1};          // pop A  -> top B
    h = {next_of[1], h.tag + 1};          // pop B  -> top C (B is now free / reused)
    next_of[0] = h.top; h = {0, h.tag + 1};   // push A -> top A again, A->next = C
    // T1 resumes: CAS(top: A -> B)
    bool ok = cas(h, seen, Head{seen_next, seen.tag + 1}, use_tag);
    std::printf("%-18s T1's CAS %s; top is now %c%s\n", use_tag ? "tagged pointer:" : "plain pointer:",
                ok ? "SUCCEEDS" : "fails and retries", "ABC"[h.top],
                ok ? "  <- B was already popped: the stack is corrupt" : "  <- correct");
}

int main() {
    scenario(false);
    scenario(true);
    // The real primitive: a CAS loop that raises a shared high-water mark.
    std::atomic<long> high{0}; long tries = 0;
    for (long v : {5L, 3L, 9L, 9L, 12L}) {
        long cur = high.load(std::memory_order_relaxed);
        while (v > cur && !high.compare_exchange_weak(cur, v, std::memory_order_acq_rel)) ++tries;
    }
    std::printf("CAS-loop max = %ld (single thread, so 0 retries: %ld)  lock-free: %s\n",
                high.load(), tries, high.is_lock_free() ? "yes" : "no");
}
'''

SRC["w6c2"] = r'''#include <atomic>
#include <cstddef>
#include <cstdio>
#include <thread>

// One writer, one reader, a bounded power-of-two ring. The producer owns
// head_, the consumer owns tail_; each index sits on its own cache line.
template <class T, std::size_t N>
class Spsc {
    static_assert((N & (N - 1)) == 0, "capacity must be a power of two");
    alignas(64) std::atomic<std::size_t> head_{0};    // written by producer only
    alignas(64) std::atomic<std::size_t> tail_{0};    // written by consumer only
    alignas(64) T buf_[N];
public:
    bool push(const T& v) {
        std::size_t h = head_.load(std::memory_order_relaxed);
        if (h - tail_.load(std::memory_order_acquire) == N) return false;   // full
        buf_[h & (N - 1)] = v;
        head_.store(h + 1, std::memory_order_release);                      // publish
        return true;
    }
    bool pop(T& out) {
        std::size_t t = tail_.load(std::memory_order_relaxed);
        if (t == head_.load(std::memory_order_acquire)) return false;       // empty
        out = buf_[t & (N - 1)];
        tail_.store(t + 1, std::memory_order_release);                      // free the slot
        return true;
    }
    static std::size_t head_offset() { return offsetof(Spsc, head_); }
    static std::size_t tail_offset() { return offsetof(Spsc, tail_); }
};

struct Tick { long seq, bid, ask; };
static Spsc<Tick, 1024> ring;

int main() {
    const long N = 1000000;
    long out_of_order = 0, sum = 0;
    std::thread producer([] {
        for (long i = 1; i <= N; ++i) { Tick t{i, 10000 + i % 5, 10002 + i % 5}; while (!ring.push(t)) {} }
    });
    long expect = 1;
    for (long got = 0; got < N;) {
        Tick t;
        if (ring.pop(t)) { if (t.seq != expect) ++out_of_order; ++expect; sum += t.ask - t.bid; ++got; }
    }
    producer.join();
    std::printf("%ld ticks through a 1024-slot SPSC ring: %ld out of order, spread checksum %ld\n", N, out_of_order, sum);
    std::printf("head_ at byte %zu, tail_ at byte %zu: %zu bytes apart, never the same line\n",
                Spsc<Tick, 1024>::head_offset(), Spsc<Tick, 1024>::tail_offset(),
                Spsc<Tick, 1024>::tail_offset() - Spsc<Tick, 1024>::head_offset());
}
'''

SRC["w6c3"] = r"""#include <cstdio>
#include <deque>

// Back-pressure: what a BOUNDED queue does when the producer outruns the
// consumer. A deterministic model: every 100 steps a burst of 60 book updates
// (4 symbols, interleaved) hits the socket at once; the strategy handles one
// message per step. "stale" = a message that was already superseded by a newer
// update for the same symbol when the strategy got to it: wasted work.
struct Msg { int sym; long id, arrived; };
enum Policy { BLOCK, DROP_NEWEST, CONFLATE };

void run(Policy pol, const char* name) {
    const int CAP = 16; std::deque<Msg> q, socket;
    long dropped = 0, stalls = 0, processed = 0, stale = 0, age_sum = 0, max_age = 0, id = 0;
    long newest[4] = {0, 0, 0, 0};
    for (long t = 0; t < 10000; ++t) {
        if (t % 100 == 0)
            for (int k = 0; k < 60; ++k) { Msg m{k % 4, ++id, t}; socket.push_back(m); newest[m.sym] = m.id; }
        while (!socket.empty()) {                              // reader thread drains the socket
            Msg m = socket.front();
            if (pol == CONFLATE) {                             // one slot per symbol: overwrite
                bool merged = false;
                for (auto& x : q) if (x.sym == m.sym) { x = m; merged = true; ++dropped; break; }
                if (!merged) q.push_back(m);
                socket.pop_front(); continue;
            }
            if ((long)q.size() < CAP) { q.push_back(m); socket.pop_front(); continue; }
            if (pol == BLOCK) { ++stalls; break; }             // reader waits; data ages in the socket
            ++dropped; socket.pop_front();                     // DROP_NEWEST
        }
        if (!q.empty()) {                                      // strategy: one message per step
            Msg m = q.front(); q.pop_front(); ++processed;
            long age = t - m.arrived; age_sum += age; if (age > max_age) max_age = age;
            if (m.id < newest[m.sym]) ++stale;
        }
    }
    std::printf("%-12s processed %5ld  stale %5ld  dropped/merged %5ld  reader stalls %5ld  age avg %5.1f max %2ld\n",
                name, processed, stale, dropped, stalls, double(age_sum) / processed, max_age);
}

int main() {
    run(BLOCK, "block");
    run(DROP_NEWEST, "drop newest");
    run(CONFLATE, "conflate");
}
"""


SRC["w6c4"] = r'''#include <atomic>
#include <cstddef>
#include <cstdio>
#include <type_traits>

// Across processes the ring lives in a shared-memory segment, so its layout
// is a CONTRACT: fixed-size fields, no pointers (addresses differ per
// process), trivially copyable. For a single "latest touch" slot the classic
// structure is a seqlock: the writer makes seq odd while writing, even when done.
struct alignas(64) TouchSlot {
    std::atomic<unsigned> seq;          // odd = write in progress
    long bid, ask;                      // payload
};
static_assert(std::is_standard_layout_v<TouchSlot>);
static_assert(sizeof(TouchSlot) == 64, "one slot, one cache line");
static_assert(std::atomic<unsigned>::is_always_lock_free, "must work across processes");

// A deterministic, step-by-step replay of one reader racing one writer.
int main() {
    TouchSlot s; s.seq.store(0); s.bid = 10000; s.ask = 10002;
    int retries = 0;
    // Writer step 1: seq -> 1 (odd). Writer step 2: bid = 10001. [reader runs here]
    s.seq.store(1, std::memory_order_relaxed); s.bid = 10001;
    for (int attempt = 0; attempt < 3; ++attempt) {
        unsigned s0 = s.seq.load(std::memory_order_acquire);
        long b = s.bid, a = s.ask;
        std::atomic_thread_fence(std::memory_order_acquire);
        unsigned s1 = s.seq.load(std::memory_order_relaxed);
        if (s0 % 2 == 1 || s0 != s1) {
            ++retries;
            std::printf("read attempt %d: seq %u..%u -> would see bid %ld ask %ld (crossed? %s) -> RETRY\n",
                        attempt, s0, s1, b, a, b >= a ? "yes" : "no");
            // writer finishes: ask = 10003, seq -> 2 (even)
            if (attempt == 0) { s.ask = 10003; s.seq.store(2, std::memory_order_release); }
            continue;
        }
        std::printf("read attempt %d: seq %u stable -> bid %ld ask %ld\n", attempt, s0, b, a);
        break;
    }
    std::printf("retries %d; offsets: seq@%zu bid@%zu ask@%zu, sizeof %zu\n", retries,
                offsetof(TouchSlot, seq), offsetof(TouchSlot, bid), offsetof(TouchSlot, ask), sizeof(TouchSlot));
}
'''

SRC["w6c5"] = r'''#include <barrier>
#include <cstdio>
#include <latch>
#include <semaphore>
#include <thread>
#include <vector>

// C++20 coordination primitives, each doing the job it was built for.
int main() {
    const int W = 4; const long CHUNK = 250000;
    std::vector<long> partial(W, 0);
    long phase_total[3] = {0, 0, 0};
    std::latch start(1);                               // one-shot start gun
    std::barrier sync(W, [&]() noexcept {              // runs once per phase, on one thread
        static int phase = 0; long s = 0; for (long p : partial) s += p; phase_total[phase++] = s; });
    std::vector<std::thread> ts;
    for (int w = 0; w < W; ++w) ts.emplace_back([&, w] {
        start.wait();
        for (int ph = 0; ph < 3; ++ph) {               // three phases, lock-step
            long s = 0;
            for (long i = w * CHUNK; i < (w + 1) * CHUNK; ++i) s += (i % 97) * (ph + 1);
            partial[w] = s;
            sync.arrive_and_wait();
        }
    });
    start.count_down();
    for (auto& t : ts) t.join();
    std::printf("barrier phases: %ld %ld %ld (phase k = k x phase 1)\n", phase_total[0], phase_total[1], phase_total[2]);

    // A counting semaphore as a per-tick message quota (the arena's order_quota).
    std::counting_semaphore<16> quota(6);
    int sent = 0, refused = 0;
    for (int i = 0; i < 8; ++i) (quota.try_acquire() ? sent : refused)++;
    std::printf("quota 6, 8 attempts: sent %d, refused %d\n", sent, refused);
    quota.release(sent);                               // next tick: the budget refills
    std::printf("after refill: try_acquire -> %s\n", quota.try_acquire() ? "sent" : "refused");
}
'''

# ═══ Week 7 · Session 7 — networking, market data, serialization ═══

SRC["w7c1"] = r'''#include <charconv>
#include <cstdio>
#include <string>
#include <string_view>

// FIX is tag=value pairs separated by SOH (0x01). BodyLength (9) counts the
// bytes after it up to the checksum; CheckSum (10) is the byte sum mod 256.
const char SOH = '\x01';

std::string build(std::string_view body) {
    std::string head = "8=FIX.4.4" + std::string(1, SOH) + "9=" + std::to_string(body.size()) + SOH;
    std::string msg = head + std::string(body);
    unsigned sum = 0; for (unsigned char c : msg) sum += c;
    char tail[16]; std::snprintf(tail, sizeof tail, "10=%03u%c", sum % 256, SOH);
    return msg + tail;
}

// A scan loop over a string_view: no copies, no allocations, no DOM.
long field(std::string_view m, int want) {
    std::size_t i = 0;
    while (i < m.size()) {
        std::size_t eq = m.find('=', i), end = m.find(SOH, eq);
        int tag = 0; std::from_chars(m.data() + i, m.data() + eq, tag);
        if (tag == want) { long v = 0; std::from_chars(m.data() + eq + 1, m.data() + end, v); return v; }
        i = end + 1;
    }
    return -1;
}

int main() {
    std::string body = std::string("35=D") + SOH + "11=ORD42" + SOH + "55=AAPL" + SOH +
                       "54=1" + SOH + "38=300" + SOH + "44=18250" + SOH + "40=2" + SOH;
    std::string m = build(body);
    std::string shown = m; for (char& c : shown) if (c == SOH) c = '|';
    std::printf("%s\n", shown.c_str());
    std::printf("BodyLength=%ld  side(54)=%ld  qty(38)=%ld  price(44)=%ld  checksum(10)=%03ld\n",
                field(m, 9), field(m, 54), field(m, 38), field(m, 44), field(m, 10));
    unsigned sum = 0; std::size_t cut = m.rfind("10=");
    for (std::size_t i = 0; i < cut; ++i) sum += (unsigned char)m[i];
    std::printf("receiver recomputes checksum %03u -> %s; total %zu bytes on the wire\n",
                sum % 256, (long)(sum % 256) == field(m, 10) ? "valid" : "CORRUPT", m.size());
}
'''

SRC["w7c2"] = r'''#include <cstdint>
#include <cstdio>
#include <cstring>

// A fixed-width binary "add order", ITCH-style: every field at a known offset,
// integers big-endian on the wire, prices as integers with 4 implied decimals.
// Decoding is a handful of loads and byte swaps -- a copy, not a parse.
#pragma pack(push, 1)
struct AddOrder {                 // 36 bytes, no padding
    char     type;                // 'A'
    uint16_t locate;
    uint64_t timestamp_ns;
    uint64_t order_ref;
    char     side;                // 'B' or 'S'
    uint32_t shares;
    char     stock[8];            // space-padded
    uint32_t price;               // 1e-4 dollars
};
#pragma pack(pop)
static_assert(sizeof(AddOrder) == 36, "wire layout is a contract");

template <class T> T be(T v) {    // host <-> big-endian (this Mac and x86 are little-endian)
    T r = 0; for (std::size_t i = 0; i < sizeof(T); ++i) { r = (r << 8) | (v & 0xFF); v >>= 8; } return r;
}

int main() {
    AddOrder w{};                                           // encode
    w.type = 'A'; w.locate = be<uint16_t>(17); w.timestamp_ns = be<uint64_t>(34200000000123ULL);
    w.order_ref = be<uint64_t>(987654321); w.side = 'B'; w.shares = be<uint32_t>(300);
    std::memcpy(w.stock, "AAPL    ", 8); w.price = be<uint32_t>(1825000);
    unsigned char wire[36]; std::memcpy(wire, &w, sizeof w);

    AddOrder r; std::memcpy(&r, wire, sizeof r);            // decode: one memcpy...
    uint32_t px = be(r.price), qty = be(r.shares);         // ...and byte swaps
    std::printf("type %c side %c shares %u stock %.4s price %u.%04u ref %llu ts %llu\n",
                r.type, r.side, qty, r.stock, px / 10000, px % 10000,
                (unsigned long long)be(r.order_ref), (unsigned long long)be(r.timestamp_ns));
    std::printf("wire bytes 0..6: %02x %02x %02x %02x %02x %02x %02x\n",
                wire[0], wire[1], wire[2], wire[3], wire[4], wire[5], wire[6]);
    const char* json = "{\"type\":\"add_order\",\"locate\":17,\"ts\":34200000000123,\"ref\":987654321,"
                       "\"side\":\"B\",\"shares\":300,\"symbol\":\"AAPL\",\"price\":182.5}";
    std::printf("binary %zu bytes vs the same order as JSON %zu bytes (%.1fx)\n",
                sizeof(AddOrder), std::strlen(json), double(std::strlen(json)) / sizeof(AddOrder));
}
'''

SRC["w7c3"] = r'''#include <cstdint>
#include <cstdio>
#include <cstring>
#include <vector>

// A TCP socket is a BYTE stream: one read() may return half a message or
// three and a half. Frame with a 2-byte length prefix and keep the leftovers.
struct Framer {
    std::vector<unsigned char> acc; long frames = 0, seq_sum = 0;
    void feed(const unsigned char* p, std::size_t n) {
        acc.insert(acc.end(), p, p + n);
        std::size_t off = 0;
        while (acc.size() - off >= 2) {
            std::size_t len = (acc[off] << 8) | acc[off + 1];
            if (acc.size() - off - 2 < len) break;                // incomplete: wait for more
            uint32_t seq; std::memcpy(&seq, &acc[off + 2], 4);
            ++frames; seq_sum += seq; off += 2 + len;
        }
        acc.erase(acc.begin(), acc.begin() + off);                // keep the partial tail
    }
};

int main() {
    std::vector<unsigned char> stream;                           // 1000 messages, 6..25 bytes each
    long want_sum = 0;
    for (uint32_t s = 1; s <= 1000; ++s) {
        std::size_t len = 4 + s % 20; stream.push_back(len >> 8); stream.push_back(len & 0xFF);
        unsigned char body[32] = {}; std::memcpy(body, &s, 4);
        stream.insert(stream.end(), body, body + len); want_sum += s;
    }
    Framer f; std::size_t pos = 0, reads = 0;
    while (pos < stream.size()) {                                // reads of 1..37 bytes
        std::size_t n = 1 + (reads * 7) % 37; if (pos + n > stream.size()) n = stream.size() - pos;
        f.feed(&stream[pos], n); pos += n; ++reads;
    }
    std::printf("%zu bytes in %zu reads -> %ld frames, seq checksum %s, %zu bytes left over\n",
                stream.size(), reads, f.frames, f.seq_sum == want_sum ? "OK" : "WRONG", f.acc.size());

    // UDP multicast has no retransmit: sequence numbers detect the holes.
    uint32_t got[] = {1, 2, 3, 5, 6, 9, 10, 10, 11};
    uint32_t expect = 1;
    for (uint32_t s : got) {
        if (s < expect) { std::printf("seq %u duplicate, dropped\n", s); continue; }
        if (s > expect) std::printf("gap: missing %u..%u -> request gap fill / snapshot\n", expect, s - 1);
        expect = s + 1;
    }
}
'''

SRC["w7c4"] = r'''#include <atomic>
#include <charconv>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <initializer_list>
#include <map>
#include <new>
#include <string>
#include <string_view>

static std::atomic<long> g_allocs{0};
void* operator new(std::size_t n) { ++g_allocs; if (void* p = std::malloc(n)) return p; throw std::bad_alloc(); }
void operator delete(void* p) noexcept { std::free(p); }
void operator delete(void* p, std::size_t) noexcept { std::free(p); }

const char* MSG = "{\"type\":\"book_snapshot\",\"symbol\":\"AAPL\",\"bid\":182.49,\"ask\":182.51,"
                  "\"bid_size\":400,\"ask_size\":680,\"mid\":182.5,\"microprice\":182.4926,\"obi\":-0.2593,"
                  "\"tick\":18231,\"venue\":\"arena\"}";

// "DOM" style: materialise every key and value as strings, then look one up.
double dom_bid(const char* s) {
    std::map<std::string, std::string> kv; const char* p = s;
    while ((p = std::strchr(p, '"'))) {
        const char* k1 = ++p; p = std::strchr(p, '"'); std::string key(k1, p); p += 2;
        const char* v1 = p; while (*p && *p != ',' && *p != '}') ++p;
        kv[key] = std::string(v1, p);
    }
    return std::atof(kv["bid"].c_str());
}
// Targeted: find the one key you need and convert in place. Nothing is copied.
double scan_bid(std::string_view s, long& touched) {
    std::size_t k = s.find("\"bid\":"); touched = (long)(k + 6);
    double v = 0; auto r = std::from_chars(s.data() + k + 6, s.data() + s.size(), v);
    touched += (long)(r.ptr - (s.data() + k + 6));
    return v;
}
// Serialise without printf: digits written backwards into a stack buffer.
int u64toa(unsigned long long v, char* out) {
    char tmp[20]; int n = 0;
    do { tmp[n++] = char('0' + v % 10); v /= 10; } while (v);
    for (int i = 0; i < n; ++i) out[i] = tmp[n - 1 - i];
    out[n] = 0; return n;
}

int main() {
    long a0 = g_allocs; double b1 = dom_bid(MSG); long dom = g_allocs - a0;
    long touched = 0; a0 = g_allocs; double b2 = scan_bid(MSG, touched); long scan = g_allocs - a0;
    std::printf("message %zu bytes\n", std::strlen(MSG));
    std::printf("DOM-style parse: bid %.2f with %ld heap allocations, every byte read\n", b1, dom);
    std::printf("targeted scan:   bid %.2f with %ld heap allocations, %ld bytes read\n", b2, scan, touched);
    int bad = 0; char a[24], b[24];
    for (unsigned long long v : {0ULL, 7ULL, 10ULL, 18250ULL, 987654321ULL, 18446744073709551615ULL}) {
        u64toa(v, a); std::snprintf(b, sizeof b, "%llu", v); if (std::strcmp(a, b)) ++bad;
    }
    std::printf("u64toa vs snprintf on 6 edge values (0, 7, 10, ..., 2^64-1): %d mismatches\n", bad);
}
'''

SRC["w7c5"] = r'''#include <algorithm>
#include <cstdio>
#include <initializer_list>
#include <vector>

// Batching trades latency for throughput. Model (stated constants): an order
// is ready every 10 us; one send() syscall costs 5 us plus 0.2 us per message
// in it. Flush when the batch reaches B messages or the oldest waits 50 us.
void run(int B) {
    std::vector<double> lat; long syscalls = 0; double busy = 0;
    std::vector<double> batch;
    for (int i = 0; i < 20000; ++i) {
        double t = i * 10.0;
        if (!batch.empty() && t - batch.front() >= 50.0) {       // timeout flush
            double cost = 5.0 + 0.2 * batch.size(); busy += cost; ++syscalls;
            for (double b : batch) lat.push_back(batch.front() + 50.0 + cost - b);
            batch.clear();
        }
        batch.push_back(t);
        if ((int)batch.size() == B) {
            double cost = 5.0 + 0.2 * B; busy += cost; ++syscalls;
            for (double b : batch) lat.push_back(t + cost - b);
            batch.clear();
        }
    }
    std::sort(lat.begin(), lat.end());
    auto p = [&](double q) { return lat[(std::size_t)(q * (lat.size() - 1))]; };
    std::printf("batch %2d: %5ld syscalls  cpu in send %6.0f us  latency p50 %5.1f  p99 %5.1f  max %5.1f us\n",
                B, syscalls, busy, p(0.50), p(0.99), lat.back());
}

int main() { for (int B : {1, 2, 4, 8}) run(B); }
'''

# ═══ Week 8 · Session 8 — SIMD, kernel bypass and the latency tail ═══

SRC["w8c1"] = r'''#include <cstdio>
#include <cstring>

// SIMD = one instruction on many lanes. Written portably: 8 independent
// accumulators are exactly what an 8-lane vector add keeps in one register,
// and -O2/-O3 turns this loop shape into real vector instructions.
unsigned s = 32708;
float frand() { s = s * 1664525u + 1013904223u; return float(s >> 8) / 16777216.0f - 0.5f; }

int main() {
    static float x[65536]; static int xi[65536];
    for (int i = 0; i < 65536; ++i) { x[i] = frand() * 100.0f; xi[i] = int(x[i] * 100); }

    float scalar = 0; for (int i = 0; i < 65536; ++i) scalar += x[i];          // one chain
    float lane[8] = {0}; for (int i = 0; i < 65536; i += 8)                    // 8 chains
        for (int k = 0; k < 8; ++k) lane[k] += x[i + k];
    float simd = 0; for (float l : lane) simd += l;

    long long iscalar = 0, ilane[8] = {0}, isimd = 0;
    for (int i = 0; i < 65536; ++i) iscalar += xi[i];
    for (int i = 0; i < 65536; i += 8) for (int k = 0; k < 8; ++k) ilane[k] += xi[i + k];
    for (long long l : ilane) isimd += l;

    unsigned a, b; std::memcpy(&a, &scalar, 4); std::memcpy(&b, &simd, 4);
    std::printf("float sum: 1 chain %.6f  8 lanes %.6f  bits %08x vs %08x -> %s\n",
                scalar, simd, a, b, a == b ? "identical" : "DIFFERENT (reassociation)");
    std::printf("int   sum: 1 chain %lld  8 lanes %lld -> %s\n", iscalar, isimd,
                iscalar == isimd ? "identical (integer + is associative)" : "different");
    std::printf("dependency chain length: %d adds vs %d adds per lane\n", 65536, 65536 / 8);
}
'''

SRC["w8c2"] = r'''#include <algorithm>
#include <cstdio>
#include <initializer_list>
#include <utility>
#include <vector>

// A pure-CPU model of a branch predictor: one 2-bit saturating counter per
// branch (strongly/weakly taken/not-taken). We count its mispredictions on
// the hot-path test `if (x > 0)` for three data orders.
long mispredicts(const std::vector<int>& v) {
    int ctr = 2; long miss = 0;                       // 0,1 predict not-taken; 2,3 predict taken
    for (int x : v) {
        bool taken = x > 0, guess = ctr >= 2;
        if (taken != guess) ++miss;
        ctr = taken ? (ctr < 3 ? ctr + 1 : 3) : (ctr > 0 ? ctr - 1 : 0);
    }
    return miss;
}

unsigned s = 32718;
int rnd() { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return int(s % 2001) - 1000; }

int main() {
    std::vector<int> v(100000); for (int& x : v) x = rnd();
    std::vector<int> sorted = v; std::sort(sorted.begin(), sorted.end());
    std::vector<int> mostly(v.size()); for (std::size_t i = 0; i < v.size(); ++i) mostly[i] = (i % 100 == 0) ? -1 : 1;
    // Model constant (stated): ~15 cycles lost per mispredict.
    for (auto [name, d] : {std::pair{"random signs", &v}, std::pair{"sorted", &sorted}, std::pair{"99% positive", &mostly}}) {
        long m = mispredicts(*d);
        std::printf("%-13s mispredicts %6ld (%5.2f%%)  ~%7ld cycles lost\n", name, m, 100.0 * m / d->size(), 15 * m);
    }
    long a = 0, b = 0;
    for (int x : v) if (x > 0) a += x;                // branchy
    for (int x : v) b += x & ~(x >> 31);              // branchless: sign bit as a mask
    long c = 0; for (int x : v) c += (x > 0) ? x : 0; // what a cmov would do
    std::printf("sum of positives: branchy %ld  mask %ld  select %ld\n", a, b, c);
}
'''

SRC["w8c3"] = r'''#include <algorithm>
#include <cstdio>
#include <vector>

// Kernel bypass as a cost model (all constants are STATED assumptions, in ns).
// Packets arrive in bursts. Kernel path: the NIC coalesces interrupts (fires at
// 8 packets or 20 us), then interrupt + syscall + copy per packet. Bypass path:
// a pinned thread busy-polls the NIC ring in user space; no interrupt, no copy.
const double IRQ = 2000, SYSCALL = 1500, COPY = 400, POLL = 100, PER_PKT = 150;

int main() {
    std::vector<double> arrive;
    for (int burst = 0; burst < 2000; ++burst)                       // 2000 bursts of 1..12 packets
        for (int k = 0; k < 1 + (burst * 7) % 12; ++k) arrive.push_back(burst * 50000.0 + k * 100.0);

    std::vector<double> kern, byp; long irqs = 0, syscalls = 0;
    std::size_t i = 0;
    while (i < arrive.size()) {                                      // kernel path with coalescing
        std::size_t j = i; double fire = arrive[i] + 20000;
        while (j < arrive.size() && j - i < 8 && arrive[j] <= fire) ++j;
        if (j - i == 8) fire = arrive[j - 1];                        // 8th packet triggers early
        ++irqs; double t = fire + IRQ;
        for (std::size_t k = i; k < j; ++k) { ++syscalls; t += SYSCALL + COPY + PER_PKT; kern.push_back(t - arrive[k]); }
        i = j;
    }
    double t = 0;                                                    // bypass path: poll loop
    for (double a : arrive) { t = std::max(t, a + POLL / 2) + PER_PKT; byp.push_back(t - a); }

    auto rep = [](const char* n, std::vector<double> v) {
        std::sort(v.begin(), v.end());
        auto p = [&](double q) { return v[(std::size_t)(q * (v.size() - 1))] / 1000; };
        std::printf("%-8s p50 %6.2f  p99 %6.2f  max %6.2f us\n", n, p(.5), p(.99), v.back() / 1000);
    };
    std::printf("%zu packets: kernel path used %ld interrupts and %ld syscalls; bypass used 0 and 0\n",
                arrive.size(), irqs, syscalls);
    rep("kernel", kern); rep("bypass", byp);
    std::printf("the price: a busy-poll core runs at 100%% even when the market is quiet\n");
}
'''

SRC["w8c4"] = r'''#include <algorithm>
#include <cstdio>
#include <vector>

// Every tail spike has a physical cause. A synthetic tick-to-trade trace in
// ns with three causes injected on a deterministic schedule; each fix removes
// one cause. (Constants are stated model assumptions, not measurements.)
unsigned long long s = 32728;
double u01() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return (s >> 11) * (1.0 / 9007199254740992.0); }

struct Cfg { const char* name; bool prefault, pinned, no_alloc; };

void run(Cfg c) {
    s = 32728; std::vector<double> v;
    for (int t = 0; t < 200000; ++t) {
        double ns = 900 + 300 * u01();                                   // the body
        if (!c.prefault && t < 400) ns += 5000;                          // first-touch page faults
        if (!c.pinned && t % 4000 == 17) ns += 60000 + 40000 * u01();    // preempted by the scheduler
        if (!c.pinned && u01() < 0.002) ns += 8000;                      // migrated core: cold caches
        if (!c.no_alloc && u01() < 0.004) ns += 15000 * u01();           // malloc slow path
        v.push_back(ns);
    }
    std::sort(v.begin(), v.end());
    auto p = [&](double q) { return v[(std::size_t)(q * (v.size() - 1))] / 1000; };
    std::printf("%-28s p50 %5.2f  p99 %6.2f  p99.9 %6.2f  max %7.2f us\n", c.name, p(.5), p(.99), p(.999), v.back() / 1000);
}

int main() {
    run({"baseline", false, false, false});
    run({"+ no alloc on hot path", false, false, true});
    run({"+ pinned, isolated core", false, true, true});
    run({"+ pre-fault at startup", true, true, true});
    // Why huge pages help the TLB: pages needed to map a 64 MB working set.
    long ws = 64L << 20;
    std::printf("64 MB working set: %ld 4 KB pages vs %ld 2 MB pages; a 64-entry TLB covers %ld KB vs %ld MB\n",
                ws / 4096, ws / (2L << 20), 64 * 4L, 64 * 2L);
}
'''

SRC["w8c5"] = r'''#include <algorithm>
#include <cmath>
#include <cstdio>
#include <vector>

// A log-linear latency histogram (the HdrHistogram idea): fixed memory, O(1)
// record, bounded RELATIVE error. Bucket = (power of two, 32 sub-buckets).
struct LogHist {
    static const int SUB = 32; long counts[64 * SUB] = {}; long n = 0;
    static int idx(unsigned long long v) {
        if (v < SUB) return int(v);
        int e = 63 - __builtin_clzll(v);                  // floor(log2 v)
        int sub = int((v >> (e - 5)) & (SUB - 1));        // next 5 bits
        return (e - 4) * SUB + sub;
    }
    static unsigned long long lower(int i) {
        if (i < SUB) return i;
        int e = i / SUB + 4, sub = i % SUB;
        return (1ULL << e) + ((unsigned long long)sub << (e - 5));
    }
    void record(unsigned long long v) { ++counts[idx(v)]; ++n; }
    unsigned long long pct(double p) const {
        long need = (long)std::ceil(p / 100 * n), acc = 0;
        for (int i = 0; i < 64 * SUB; ++i) if ((acc += counts[i]) >= need) return lower(i);
        return 0;
    }
};

unsigned long long s = 32738;
double u01() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return (s >> 11) * (1.0 / 9007199254740992.0); }

int main() {
    LogHist h; std::vector<unsigned long long> exact;
    for (int i = 0; i < 100000; ++i) {
        unsigned long long ns = 20000 + (unsigned long long)(8000 * u01());
        if (u01() < 0.003) ns += (unsigned long long)(2000000 * u01());
        h.record(ns); exact.push_back(ns);
    }
    std::sort(exact.begin(), exact.end());
    for (double p : {50.0, 99.0, 99.9}) {
        unsigned long long e = exact[(std::size_t)std::ceil(p / 100 * exact.size()) - 1], a = h.pct(p);
        std::printf("p%-5g exact %8llu ns  histogram %8llu ns  error %5.2f%%\n", p, e, a, 100.0 * (double(e) - a) / e);
    }
    std::printf("histogram memory: %zu bytes, fixed, whatever the sample size\n", sizeof(h.counts));

    // Coordinated omission: a client sends every 100 us and waits for each reply.
    // One 20 ms stall. The naive log records ONE slow sample; the corrected log
    // also records the ~200 requests that should have been sent during the stall.
    std::vector<double> naive, fixed;
    for (int i = 0; i < 10000; ++i) {
        double lat = (i == 5000) ? 20000 : 30;           // us
        naive.push_back(lat); fixed.push_back(lat);
        if (lat > 100) for (double missed = lat - 100; missed > 0; missed -= 100) fixed.push_back(missed);
    }
    std::sort(naive.begin(), naive.end()); std::sort(fixed.begin(), fixed.end());
    auto q = [](std::vector<double>& v, double p) { return v[(std::size_t)(p * (v.size() - 1))]; };
    std::printf("naive     p99 %7.0f us  p99.9 %7.0f us\n", q(naive, .99), q(naive, .999));
    std::printf("corrected p99 %7.0f us  p99.9 %7.0f us\n", q(fixed, .99), q(fixed, .999));
}
'''

# ═══ Week 9 · Session 9 — latency arbitrage, multi-venue, the tournament ═══

SRC["w9c1"] = r'''#include <cstdio>

// One name, two venues. Venue B's quote lags venue A's by LAG ticks. When B's
// stale ask sits below A's bid, the consolidated book (NBBO) is crossed and
// someone can buy on B and sell on A -- if the gap beats the fees.
unsigned long long s = 32709;
double u01() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return (s >> 11) * (1.0 / 9007199254740992.0); }

int main() {
    const int T = 20000, LAG = 3; const double TAKER_BPS = 30.0;      // the arena's taker fee
    static double midA[T];
    double m = 100.0;
    for (int t = 0; t < T; ++t) {
        double r = u01();
        m += (r < 0.01) ? (u01() - 0.5) * 2.0 : (u01() - 0.5) * 0.04; // rare jumps, small drift
        midA[t] = m;
    }
    long crossed = 0, worth_it = 0; double best_bps = 0, pnl_bps = 0;
    for (int t = LAG; t < T; ++t) {
        double bidA = midA[t] - 0.01, askA = midA[t] + 0.01;
        double bidB = midA[t - LAG] - 0.01, askB = midA[t - LAG] + 0.01;   // stale
        double nbb = bidA > bidB ? bidA : bidB, nbo = askA < askB ? askA : askB;
        if (nbb > nbo) {                                             // crossed NBBO
            ++crossed;
            double gap_bps = (nbb - nbo) / nbo * 1e4;
            if (gap_bps > best_bps) best_bps = gap_bps;
            if (gap_bps > 2 * TAKER_BPS) { ++worth_it; pnl_bps += gap_bps - 2 * TAKER_BPS; }
        }
    }
    std::printf("%d ticks, venue B lags %d ticks: NBBO crossed on %ld ticks\n", T, LAG, crossed);
    std::printf("largest gap %.1f bps; round-trip taker fees %.0f bps\n", best_bps, 2 * TAKER_BPS);
    std::printf("crosses worth taking after fees: %ld (net %.1f bps in total)\n", worth_it, pnl_bps);
}
'''

SRC["w9c2"] = r'''#include <cstdio>

// The race, scored the way the tournament scores it. Four bots see the same
// opportunities; the first order to reach the engine wins. On VOLATILE ticks
// everyone fires at once and each bot's tail probability rises tenfold.
unsigned long long s = 32719;
double u01() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return (s >> 11) * (1.0 / 9007199254740992.0); }

struct Bot { const char* name; double p50_us, tail_p, tail_us; long calm_wins = 0, vol_wins = 0; };

double draw(const Bot& b, bool vol) {
    double t = b.p50_us * (0.9 + 0.2 * u01());
    if (u01() < b.tail_p * (vol ? 10 : 1)) t += b.tail_us * (0.5 + u01());
    return t;
}

int main() {
    Bot bots[4] = { {"lowest median, fat tail  ", 18, 0.060, 900},
                    {"steady, allocation-free  ", 25, 0.0005, 60},
                    {"python-speed             ", 400, 0.01, 5000},
                    {"lock on the hot path     ", 30, 0.004, 3000} };
    long calm = 0, vol = 0;
    for (int r = 0; r < 50000; ++r) {
        bool v = (r % 10 == 0);                          // 1 race in 10 is a volatile tick
        (v ? vol : calm)++;
        int win = 0; double best = 1e18;
        for (int i = 0; i < 4; ++i) { double t = draw(bots[i], v); if (t < best) { best = t; win = i; } }
        (v ? bots[win].vol_wins : bots[win].calm_wins)++;
    }
    std::printf("%-26s %10s %10s\n", "bot", "calm wins", "vol wins");
    for (auto& b : bots)
        std::printf("%-26s %9.1f%% %9.1f%%\n", b.name, 100.0 * b.calm_wins / calm, 100.0 * b.vol_wins / vol);
}
'''

SRC["w9c3"] = r'''#include <cmath>
#include <cstdio>

// A two-sided quoter under a 6-message-per-tick quota. Each requote of one
// side is cancel + new = 2 messages. Policy A requotes both sides every tick.
// Policy B requotes a side only when its price must change: the mid moved,
// or inventory changed the skew. Quote centre = mid - SKEW * inventory.
unsigned long long s = 32729;
double u01() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return (s >> 11) * (1.0 / 9007199254740992.0); }

struct Result { long msgs, rejected, requotes, fills; double avg_queue_age; };

Result run(bool lazy) {
    s = 32729; const int QUOTA = 6; const double SKEW = 0.002;
    long mid = 10000, inv = 0, bid_px = 0, ask_px = 0, bid_age = 0, ask_age = 0;
    Result r{0, 0, 0, 0, 0}; double age_at_fill = 0;
    for (int t = 0; t < 20000; ++t) {
        if (u01() < 0.2) mid += (u01() < 0.5) ? -1 : 1;                   // mid moves 1 tick, 20% of ticks
        int extra = (t % 50 == 0) ? 4 : 0;                                 // other traffic this tick
        long centre = std::lround(mid - SKEW * 100 * inv);
        long want_bid = centre - 1, want_ask = centre + 1;
        int used = extra;
        for (int side = 0; side < 2; ++side) {
            long& px = side ? ask_px : bid_px; long want = side ? want_ask : want_bid; long& age = side ? ask_age : bid_age;
            if (lazy && px == want) continue;                              // price unchanged: keep our place
            if (used + 2 > QUOTA) { ++r.rejected; continue; }
            used += 2; r.msgs += 2; ++r.requotes; px = want; age = 0;      // back of the queue
        }
        ++bid_age; ++ask_age;
        // A resting quote fills once it has aged to the front (5 ticks) and the flow hits it.
        if (bid_age > 5 && u01() < 0.05) { ++inv; ++r.fills; age_at_fill += bid_age; bid_age = 0; }
        if (ask_age > 5 && u01() < 0.05) { --inv; ++r.fills; age_at_fill += ask_age; ask_age = 0; }
    }
    r.avg_queue_age = r.fills ? age_at_fill / r.fills : 0;
    return r;
}

int main() {
    Result a = run(false), b = run(true);
    std::printf("requote every tick : %6ld msgs  %5ld quota rejects  %5ld fills\n", a.msgs, a.rejected, a.fills);
    std::printf("requote on change  : %6ld msgs  %5ld quota rejects  %5ld fills  (avg age at fill %.1f ticks)\n",
                b.msgs, b.rejected, b.fills, b.avg_queue_age);
    std::printf("skew: with inventory +5, quotes centre %.1f ticks below mid\n", 0.002 * 100 * 5);
}
'''

SRC["w9c4"] = r'''#include <cstdio>
#include <initializer_list>
#include <utility>

// Markouts: how did the mid move AFTER each fill, from our side's point of
// view? markout(h) = side * (mid[t+h] - fill_px), side = +1 buy, -1 sell.
// Persistently negative = we are being picked off (adverse selection).
unsigned long long s = 32739;
double u01() { s ^= s << 13; s ^= s >> 7; s ^= s << 17; return (s >> 11) * (1.0 / 9007199254740992.0); }

int main() {
    const int T = 50000; static double mid[T + 100];
    double m = 100.0;
    for (int t = 0; t < T + 100; ++t) { m += (u01() - 0.5) * 0.02; mid[t] = m; }
    // Inject informed flow: before 300 jumps, a fast trader hits our stale quote first.
    struct Acc { double sum[3] = {0, 0, 0}; long n = 0; } benign, toxic;
    int H[3] = {1, 10, 50};
    for (int t = 100; t < T; t += 37) {                              // benign fills: random side
        int side = u01() < 0.5 ? 1 : -1; double px = mid[t] - side * 0.01;   // we earn half-spread
        for (int k = 0; k < 3; ++k) benign.sum[k] += side * (mid[t + H[k]] - px) / px * 1e4;
        ++benign.n;
    }
    for (int j = 0; j < 300; ++j) {                                   // toxic fills: price then jumps
        int t = 150 + j * 160; int side = u01() < 0.5 ? 1 : -1;
        double px = mid[t] - side * 0.01;
        for (int k = 0; k < 3; ++k) {
            double jump = -side * 0.08;                               // the move against us
            toxic.sum[k] += side * (mid[t + H[k]] + jump - px) / px * 1e4;
        }
        ++toxic.n;
    }
    std::printf("%-8s %6s %10s %10s %10s   (bps)\n", "flow", "fills", "+1 tick", "+10", "+50");
    for (auto [name, a] : {std::pair{"benign", &benign}, std::pair{"toxic", &toxic}})
        std::printf("%-8s %6ld %+10.2f %+10.2f %+10.2f\n", name, a->n, a->sum[0] / a->n, a->sum[1] / a->n, a->sum[2] / a->n);
    double all_n = benign.n + toxic.n;
    std::printf("blended +10 markout: %+.2f bps -- %0.1f%% toxic fills are enough to sink it\n",
                (benign.sum[1] + toxic.sum[1]) / all_n, 100.0 * toxic.n / all_n);
}
'''

SRC["w9c5"] = r'''import numpy as np
np.seterr(all="ignore")

# The tournament board ranks every axis separately (p99.9, MM SCORE, PASSIVE%,
# OTR) and the grade is a composite of latency, throughput, queue position
# and fill rate. Illustrative numbers and ILLUSTRATIVE weights (the tail
# carries the most): the point is the shape of the result, not the formula.
teams = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"]
p999_us = np.array([38.0, 55.0, 41.0, 900.0, 47.0, 62.0])        # lower is better
p50_us = np.array([12.0, 21.0, 16.0, 11.0, 19.0, 24.0])
msgs_per_s = np.array([9000, 7000, 8800, 9500, 6000, 7200])      # higher is better
queue_front = np.array([0.22, 0.48, 0.35, 0.18, 0.41, 0.52])     # share of fills from the front
fill_rate = np.array([0.31, 0.44, 0.38, 0.29, 0.40, 0.47])

def score(x, lower_is_better):
    """Rank-based 0..1 score, robust to one team's 900 us outlier."""
    r = np.argsort(np.argsort(-x if not lower_is_better else x))
    return 1 - r / (len(x) - 1)

W = {"p99.9": 0.35, "p50": 0.10, "throughput": 0.15, "queue": 0.20, "fill": 0.20}
parts = {"p99.9": score(p999_us, True), "p50": score(p50_us, True),
         "throughput": score(msgs_per_s, False), "queue": score(queue_front, False),
         "fill": score(fill_rate, False)}
comp = sum(W[k] * parts[k] for k in W)
order = np.argsort(-comp)
print(f"{'team':<8} {'p50':>5} {'p99.9':>6} {'msg/s':>6} {'front':>6} {'fill':>5} {'score':>6}")
for i in order:
    print(f"{teams[i]:<8} {p50_us[i]:>5.0f} {p999_us[i]:>6.0f} {msgs_per_s[i]:>6d} "
          f"{queue_front[i]:>6.2f} {fill_rate[i]:>5.2f} {comp[i]:>6.3f}")
print("fastest p50:", teams[int(np.argmin(p50_us))], "| best p99.9:", teams[int(np.argmin(p999_us))],
      "| composite winner:", teams[int(order[0])])
print(f"mean p99.9 {p999_us.mean():.0f} us vs median {np.median(p999_us):.0f} us -- one tail drags the mean")
'''


# ─────────────────────────────────────────────────────────────────────────
# Weeks. Prose was written after each snippet's real output was seen.
# ─────────────────────────────────────────────────────────────────────────
WEEKS = []


def code(key):
    """A concept's code block; output is filled by tools/run_snippets.py."""
    lang = "python" if SRC[key].startswith("import numpy") else "cpp"
    return {"lang": lang, "src": SRC[key], "output": ""}


def C(name, key, explain, formula=None):
    """One concept: name, explain HTML, optional KaTeX formula, code block."""
    d = {"name": name, "explain": " ".join(explain.split())}
    if formula:
        d["formula"] = formula
    d["code"] = code(key)
    return d


def A(url, text):
    return '<a href="%s">%s</a>' % (url, text)


# ═══ Week 1 · Session 1 ═══
WEEKS.append({
    "n": 1,
    "title": "Session 1 · The HFT landscape and market microstructure: the book, the queue and the p99.9 grade",
    "topics": [
        "what high-frequency trading is: a race, not a forecast",
        "the latency arms race: colocation, microwave, kernel bypass, FPGAs",
        "the central limit order book as two sorted sides",
        "price-time priority and the FIFO queue at every price",
        "orders, fills and maker/taker fees",
        "tick-to-trade and why the grade is the p99.9, not the mean",
        "Lab 1: build the C++ client, connect and get on the latency board",
    ],
    "concepts": [
        C("The book is two sorted sides, held in integer ticks", "w1c1", """
Every venue in this course, the arena included, runs one matching engine over a central limit order book:
resting buys on the bid side sorted high to low, resting sells on the ask side sorted low to high (Deck U1,
"The Central Limit Order Book (CLOB)"). The snippet builds exactly that with two <code>std::map</code>s and
reads the four numbers your <code>on_book</code> hook is handed every tick: the touch 100.02 x 600 / 100.04 x
300, a 2-bps spread, a microprice of 100.0333 and an order-book imbalance of +0.333. The microprice weights
each side's price by the <em>other</em> side's size, so a heavy bid pulls fair value up toward the ask.
<br><br>
The last line is the first performance lesson in disguise. Ten one-cent moves on a <code>double</code> land at
100.10000000000005, which is not equal to 100.10; ten moves on an integer tick land on 10010 exactly. Prices
live on a discrete grid, so hold them as integers. That same fact is what licenses the flat, price-indexed
book of session 4: if prices are integers on a grid, a level's address is arithmetic, not a search.
<br><br>
In the lab you meet this in Lab 1, Step 1 "Read the map: <code>make test</code>": the reference client's
book view is the structure above. In the arena this shows up as the touch and depth your bot reads on every
<code>book_snapshot</code>; the
""" + A(HFT_SKILLS, "FINM HFT skills dashboard") + """ works the same four numbers for session 1.
""", r"\text{micro} = \frac{P_b\,Q_a + P_a\,Q_b}{Q_a + Q_b},\qquad \text{OBI} = \frac{Q_b - Q_a}{Q_b + Q_a}"),
        C("Price first, then time; trades print at the resting price", "w1c2", """
Two rules decide who trades (Deck U1, "Price-Time Priority &amp; the Queue"). A better price always executes
first; at the same price the order that arrived earlier fills first, a strict FIFO queue per level. When an
aggressive order crosses, each slice prints at the <em>resting</em> order's price, not at the aggressor's
limit. The snippet keeps one <code>std::deque</code> per price level and sweeps it. A buy of 450 limit
100.05 fills A2 (200) and A3 (100) at 100.04 before it touches the older A1 at 100.05: price beats time, and
time breaks the tie between A2 and A3. The average paid is 100.0433, worse than the touch the buyer saw when
it decided. A market buy of 400 then finds only 150 left and the remaining 250 is cancelled, because a market
order never rests.
<br><br>
Why this is a latency course and not just a microstructure one: the second rule is where speed turns into
money. Being early in the queue at a price means you fill before the price moves; arriving late puts you
behind everyone who got there first. Queue position is what latency actually buys.
<br><br>
In the lab, Lab 1 Step 3 "Connect and get on the board" sends your first limit order and cancel through the
C++ client; watch the acknowledgement's queue fields. In the arena this is the engine's own rule set, and the
same deque-per-level picture returns as the flat book in session 4.
"""),
        C("Maker/taker fees: the hurdle a trade must clear", "w1c3", """
The arena prints its fee schedule on connect, and in the session-1 lab it is 30 bps of notional for the taker
and a 5 bps rebate for the maker (Deck U1, "Orders, Fills &amp; Fees"). On a 200-share clip at 182.50 that
is a 109.50 fee against an 18.25 rebate: a 127.75 swing decided entirely by whether you crossed the spread or
waited to be crossed. The snippet turns that into the only number that matters for a strategy: the net fee
hurdle of a round trip. Taker in and taker out costs 60 bps; maker in and taker out costs 25 bps; maker on
both legs is paid 10 bps.
<br><br>
Two consequences shape the rest of the term. First, a one-cent spread on this stock is only 0.55 bps, so the
fee, not the spread, dominates the arithmetic of crossing. Second, a 3-bps signal nets &minus;57 bps as a
taker round trip and +13 bps as a maker round trip: small edges are only ever tradeable passively, which
means they are only tradeable if you win queue position. That is why speed matters even to a patient
strategy.
<br><br>
In the lab, Lab 1 Step 4 "Where the metrics come from" has you read the fee lines your client logs. In the
arena the tournament debrief puts a TCA report on screen, fees paid against rebates earned per team, which
is this snippet in dollars.
""", r"\text{hurdle}_{\text{bps}} = 10^4\,(f_1 + f_2),\quad f = +0.0030\ \text{(taker)},\ -0.0005\ \text{(maker)}"),
        C("Tick-to-trade, and why the mean lies", "w1c4", """
Tick-to-trade is the time from market data arriving at your socket to your order leaving it: parse, decide,
serialise, send (Deck U1, "The Metric That Grades You: Tail Latency"). This course grades p50, p99 and
p99.9, and the headline is the last one, because the races that decide P&amp;L are the volatile ticks when
everyone fires at once, exactly when a bad tail appears. The snippet draws a deterministic synthetic sample
of 100,000 ticks: a tight body between 35 and 45 &micro;s, 1.6% cache-cold ticks and 0.4% stalls of a few
milliseconds, the signature of a page fault or a preempted thread.
<br><br>
The printed table is the argument. The median is 40.1 &micro;s, the p99 136.0, the p99.9 3735.0 and the max
4838.4. The mean, 51.6 &micro;s, describes no tick that happened: not a single one of the 100,000 samples lies
within 3 &micro;s of it. The p99.9 is 93 times the median. A latency distribution is heavy-tailed and often
bimodal, and a mean averages the valley between the modes.
<br><br>
The snippet reports nearest-rank percentiles of a sorted sample, which is what the course's replay harness
does. It never times anything: the numbers are a stated synthetic distribution, so the output is the same on
every machine. In the lab you read your own version in Lab 1 Step 4 from the replay report; in the arena it is
the LATENCY tab.
""", r"p_q = x_{(\lceil q n \rceil)}\ \text{of the sorted sample } x_{(1)} \le \dots \le x_{(n)}"),
        C("The arms race: what is coded and what is bought", "w1c5", """
For two decades the industry has paid for microseconds: rack space next to the matching engine, then
microwave links, then kernel-bypass network cards, then FPGAs, each rung a smaller slice of latency at a
steeper price (Deck U1, "The Latency Arms Race" and "Participants, Venues &amp; Colocation"). The arena models
the rung you can buy. The exchange delays each team's outbound messages by its tier: 200 ms by default, 20 ms
with colocation from the shop (<code>LATENCY_MS_DEFAULT</code> against <code>LATENCY_MS_COLOCATED</code>).
<br><br>
The snippet races three bots 10,000 times. A, with fast code on the default tier, wins nothing. B, with slow
code but colocated, beats A in all 10,000 head-to-head races, because a 180 ms tier gap swamps any code
difference. C, with fast code and colocation, wins 9,988 of the three-way races. The lesson is the order of
operations. When tiers differ, the tier dominates; once everyone serious has bought the same tier, the race is
decided by what you coded, and the tail of that code decides the busy ticks.
<br><br>
In the lab, session 1 is the on-ramp: connecting, appearing on the LATENCY board and reading your replay
percentiles are ungraded, and you write your baseline down. In the arena colocation is an upgrade you buy with
season cash, and session 9 asks whether it paid.
"""),
    ],
    "widget": {
        "type": "orderbook",
        "title": "A seeded limit order book: touch, depth and a sweep through the levels",
        "params": {"levels": 8, "spread": 2, "seed": 32701, "mid": 100.03, "tick": 0.01, "size": 600},
    },
    "pitfalls": [
        "Holding prices as doubles: ten one-cent moves do not land on the value you expect, and equality tests on a price level silently fail. Use integer ticks.",
        "Believing your order trades at your limit. It trades at the resting order's price, and a sweep through two levels gets a blended average worse than the touch.",
        "Reporting a mean latency. Heavy-tailed, bimodal samples put the mean in a valley no tick visited; report p50, p99 and p99.9 of a sorted sample.",
        "Ignoring fees when judging an edge: at 30 bps taker, a round trip needs a 60-bps move before it earns anything.",
    ],
    "check": [
        {"q": "Two sell orders rest at 100.04: A2 arrived before A3. A buy limit 100.05 for 250 arrives, and A1 rests at 100.05 but is older than both. Who fills first?",
         "options": ["A1, because it is the oldest order in the book", "A2, then A3: the better price first, and time priority within 100.04", "A2 and A3 pro rata", "A1 and A2 together, since both prices are within the limit"],
         "answer": 1,
         "why": "Price beats time: 100.04 is better for a buyer than 100.05, so the 100.04 queue is exhausted first, and within it A2 precedes A3 by arrival. A1's age only matters against other orders at 100.05. There is no pro-rata allocation in a price-time book."},
        {"q": "A bid of 100.02 x 500 faces an ask of 100.04 x 300. Where is the microprice?",
         "options": ["100.0300, at the mid", "100.0275, below the mid because the ask is thinner", "100.0325, above the mid because the bid is heavier", "100.0400, at the ask"],
         "answer": 2,
         "why": "Microprice = (100.02 x 300 + 100.04 x 500) / 800 = 100.0325. Each price is weighted by the opposite side's size, so the heavy bid pulls fair value toward the ask. The mid ignores size, and the ask is only reached when the bid side is infinitely heavier."},
        {"q": "A bot reports mean 52 us, p50 40 us, p99.9 3.7 ms. Which statement is right?",
         "options": ["The mean is the best summary because it uses every sample", "The p99.9 is an outlier artefact and should be dropped", "The tail is what loses the volatile races; the mean describes almost no real tick", "p50 and mean agree closely, so the distribution is symmetric"],
         "answer": 2,
         "why": "A heavy tail drags the mean away from the body without describing either mode; in the snippet no sample lies within 3 us of the mean. The p99.9 is the graded number precisely because busy ticks are where stalls land. Dropping it hides the problem, and a 30% gap between mean and median is a sign of skew, not symmetry."},
        {"q": "Under the session-1 schedule (taker 30 bps, maker rebate 5 bps), which round trip can a 3-bps edge profit from?",
         "options": ["Taker in, taker out", "Maker in, taker out", "Maker in, maker out", "None: fees always exceed 3 bps"],
         "answer": 2,
         "why": "Maker on both legs is paid 10 bps, so a 3-bps edge nets +13 bps. Taker-taker costs 60 bps and maker-taker 25 bps, both far above the edge. Hence small edges must be traded passively, which makes queue position, and so latency, decisive."},
    ],
})

# ═══ Week 2 · Session 2 ═══
WEEKS.append({
    "n": 2,
    "title": "Session 2 · C++ performance and memory: the hierarchy, layout, pointers and ownership",
    "topics": [
        "the memory hierarchy: registers, L1/L2/L3, DRAM, and stack versus heap",
        "pointers, references and pointer arithmetic; a matrix as one contiguous block",
        "data layout: sizeof, padding, array-of-structs versus struct-of-arrays",
        "the 64-byte cache line, alignment and false sharing",
        "honest benchmarking: release builds, warm-up, sinks, percentiles",
        "classes: constructors, destructors, copy and move, the rule of zero and of five",
        "RAII and smart pointers: unique_ptr, shared_ptr, weak_ptr",
    ],
    "concepts": [
        C("The memory hierarchy, counted in cache misses", "w2c1", """
The CPU is fast and memory is far: an L1 hit costs about a nanosecond and a miss to DRAM about a hundred, so
one miss costs what a hundred hits cost (Deck U2, "The Memory Hierarchy &mdash; Where &micro;s Hide"). The unit
of transfer is a 64-byte line, and the unit of optimisation is therefore the memory access, not the
instruction. The snippet makes that concrete without a stopwatch: it is a pure-CPU model of a 32 KB, 8-way,
LRU L1 cache that is fed addresses and counts misses.
<br><br>
A sequential scan of 1 MB of ints misses 6.25% of the time, one miss per sixteen ints, because each line
brings sixteen neighbours. Touching one int per line misses every time. Random indexing, which is what
chasing pointers through a node-based container looks like to the cache, misses 96.9%. A 16 KB working set
reused sixteen times misses 0.39%. With the stated model costs (1 ns hit, 100 ns miss) that is 7.2 against
96.9 modelled ns per access for the same arithmetic.
<br><br>
The stack wins for the same reason: its top is almost always hot in L1, while a heap object may sit on a
cold line. In the lab this is the background for the combined lab's Step 2 "Stack vs heap, and the sink that
makes it honest". In the arena it is why your <code>on_book</code> should read state that is already hot and
contiguous, and why the widget below is drawn on a log scale.
"""),
        C("Layout is a latency decision: padding, AoS and SoA", "w2c2", """
The compiler pads a struct so every field is aligned, and the padding is invisible in the source (Deck U2,
"Value Semantics &amp; Data Layout &mdash; SoA vs AoS" and the appendix "Object Layout &mdash; sizeof, Padding
&amp; Alignment"). The slide's <code>Quote</code> declares 52 bytes and occupies 56. Two structs with the same
four fields differ by field order alone: <code>Padded</code> (char, double, char, int) is 24 bytes because the
first char drags seven bytes of padding in front of the double; <code>Packed</code>, sorted by size, is 16.
<code>offsetof</code> shows exactly where every field landed.
<br><br>
Now scan 1,024 prices. As an array of <code>Quote</code> the scan touches 896 cache lines, because every line
carries mostly cold bytes you do not need; as a separate array of doubles (struct of arrays) it touches 128,
seven times fewer, with identical arithmetic. SoA also gives the hardware prefetcher a regular unit stride, and
it is the shape a vectoriser wants in session 8.
<br><br>
The practical rule: put the fields the hot path reads together, sort fields by size, and split hot from cold.
In the lab this sits between the combined lab's steps as the layout reading assigned with HW 2. In the arena it
is how you should hold your per-symbol state: one small, hot struct per symbol, with names, logs and
statistics kept elsewhere.
""", r"\text{lines} = \left\lceil \frac{n \cdot \mathrm{sizeof}(T)}{64} \right\rceil"),
        C("Pointers, one contiguous block, and counting every new", "w2c3", """
A pointer is an address with a type, and pointer arithmetic moves in elements, not bytes: <code>p + 1</code>
is one element further on (Deck U2, "Pointer Arithmetic I &mdash; p + 1 Is One ELEMENT"). The snippet replaces
the global <code>operator new</code> with a counting one, which is the honest way to see allocation, and
builds a 100 x 50 matrix twice. The textbook <code>double**</code> costs 101 allocations, with rows scattered
across the heap and two dependent loads per element. One contiguous block costs a single allocation, and
<code>flat[i*C + j]</code> is one multiply-add: the addresses printed confirm one element is 8 bytes and one
row is 50 elements (Deck U2, "A Matrix on the Heap &mdash; One Contiguous Block").
<br><br>
The same counter shows the cost of growth: 100,000 <code>push_back</code>s make 18 allocations without
<code>reserve</code> and one with it. The allocation count is the thing to drive to zero on the hot path; its
timing is unpredictable, since the allocator may walk a free list, take a lock or ask the kernel for a page.
<br><br>
A subtle point the snippet had to handle: at <code>-O2</code> the compiler is allowed to elide a
<code>new</code>/<code>delete</code> pair whose pointer never escapes. Letting the pointer escape keeps the
count honest, which is the benchmarking lesson of Deck U2's "Micro-benchmarking Pitfalls". In the lab this is
Step 2 "Stack vs heap, and the sink that makes it honest".
"""),
        C("Copy, move and the rule of five", "w2c4", """
A class that owns a resource must say what copying and moving mean (Deck U2, "Copy Semantics", "Move
Semantics &mdash; The Two Functions You Write" and "Rule of Zero, Rule of Five"). Copy duplicates the
resource; move steals it and leaves the source empty but valid. The snippet instruments all five special
members of an <code>Order</code> that owns a heap buffer and pushes 1,000 of them into a vector with no
<code>reserve</code>.
<br><br>
The result is the classic surprise. With a <code>noexcept</code> move constructor, every reallocation moves the
existing elements: 1,023 moves and zero copies. Remove <code>noexcept</code> and the same code makes 1,023
copies and zero moves, because <code>std::vector</code> must keep its strong exception guarantee and cannot
risk a move that throws halfway through a reallocation. Each of those copies is a hidden heap allocation. After
<code>std::move</code>, <code>a.note</code> is <code>nullptr</code> and <code>b</code> owns the buffer:
nothing was copied.
<br><br>
The rule of zero is the default you should reach for: hold resources in members that already manage
themselves (<code>std::vector</code>, <code>std::unique_ptr</code>) and write none of the five. When you must
write them, write all five and mark the move operations <code>noexcept</code>. In the lab this is Step 5 "The
Rule of Three, and the double-free you can see", where a class with a destructor but no copy constructor frees
the same buffer twice.
"""),
        C("RAII and choosing a smart pointer", "w2c5", """
RAII ties a resource's lifetime to a scope: acquire in the constructor, release in the destructor, and the
compiler guarantees the release on every exit path, including exceptions (Deck U2, "RAII &mdash; Resource
Acquisition Is Initialization"). <code>unique_ptr</code> is RAII for heap memory: sole ownership, move-only,
and the snippet prints its size as 8 bytes, the same as a raw pointer. <code>shared_ptr</code> is 16 bytes,
a pointer plus a pointer to a control block holding an <em>atomic</em> reference count. <code>make_shared</code>
allocates object and control block together (one allocation); <code>shared_ptr(new T)</code> needs two.
<br><br>
Copying a <code>shared_ptr</code> three times raises the count to 4 and every copy and destruction is an
atomic read-modify-write that bounces a cache line between cores: a hidden cost on a hot path. Two objects
that hold <code>shared_ptr</code>s to each other never reach zero, and the snippet shows no destructor running:
a leak. Making one direction a <code>weak_ptr</code> breaks the cycle and both destructors run. At the end of
<code>main</code> the remaining owners are destroyed in reverse order of construction.
<br><br>
In the lab this is Step 4 "Fix it with <code>unique_ptr</code>" and Step 6 "The <code>shared_ptr</code>
refcount tax, and why <code>on_book</code> must not pay it". In the arena the rule (Deck U2, "In the Arena
&mdash; No Allocation on the Hot Path") is to own state once at startup and pass references into
<code>on_book</code>.
"""),
    ],
    "widget": {
        "type": "curve",
        "title": "The memory hierarchy on a log scale: typical access cost by level (order-of-magnitude figures)",
        "params": {
            "xlab": "Level (1 = register, 2 = L1, 3 = L2, 4 = L3, 5 = DRAM, 6 = page fault)",
            "ylab": "Nanoseconds (log scale)",
            "log": True,
            "series": [
                {"name": "Typical access cost", "x": [1, 2, 3, 4, 5, 6], "y": [0.3, 1, 4, 12, 100, 3000]},
            ],
        },
    },
    "pitfalls": [
        "Timing a loop whose result is never used: at -O2 the optimiser deletes the work, or even the allocation, and you measure nothing.",
        "Declaring a move constructor without noexcept: std::vector then copies on every reallocation, and each copy may allocate.",
        "Passing shared_ptr by value into the hot path: every copy is an atomic increment and decrement on a shared cache line.",
        "Ordering struct fields carelessly: the padding the compiler inserts can make a struct 50% larger than its fields, and every scan pays for it.",
    ],
    "check": [
        {"q": "struct S { char a; double b; char c; int d; }; on a typical 64-bit ABI, what is sizeof(S)?",
         "options": ["14", "16", "24", "32"],
         "answer": 2,
         "why": "a sits at 0, b must be 8-aligned so it goes to 8, c at 16, d at 20, ending at 24, which is already a multiple of the 8-byte alignment. 14 ignores padding; 16 is the size after reordering fields by size, and 32 over-pads."},
        {"q": "Why does std::vector copy, rather than move, elements on reallocation when the element's move constructor is not noexcept?",
         "options": ["Moves are always slower than copies", "To keep the strong exception guarantee: a throwing move halfway through would leave both buffers damaged", "Because moving would invalidate iterators and copying does not", "The standard forbids moves inside containers"],
         "answer": 1,
         "why": "std::vector uses move_if_noexcept: if a move might throw, it copies so that a failure leaves the original buffer intact. Moves are usually cheaper, iterators are invalidated by reallocation either way, and containers move freely when it is safe."},
        {"q": "Which statement about shared_ptr is correct?",
         "options": ["It is the same size as a raw pointer", "Copying it is free because only a pointer is copied", "make_shared performs one allocation for the object and the control block, and copies update an atomic count", "A cycle of shared_ptrs is reclaimed automatically"],
         "answer": 2,
         "why": "shared_ptr is two pointers (16 bytes here), every copy is an atomic increment, and cycles leak unless one edge is a weak_ptr. make_shared co-locates object and control block in one allocation; shared_ptr(new T) needs two."},
        {"q": "Scanning 1,024 prices stored inside 56-byte structs touches 896 cache lines. How many does a packed array of doubles touch?",
         "options": ["64", "128", "448", "896"],
         "answer": 1,
         "why": "1,024 doubles x 8 bytes = 8,192 bytes = 128 lines of 64 bytes. The array of structs pulls 56 bytes per price because the cold fields come along; halving would only apply if the struct were 28 bytes."},
    ],
})

# ═══ Week 3 · Session 3 ═══
WEEKS.append({
    "n": 3,
    "title": "Session 3 · Allocators, pools and templates: pre-own the memory, then write the machinery once",
    "topics": [
        "what new and malloc really cost, and what the hot path needs",
        "the fixed-size object pool with an intrusive free list",
        "arena (bump) allocators, placement new and explicit destructor calls",
        "std::pmr: polymorphic memory resources and a per-tick scratch buffer",
        "function and class templates, deduction and specialisation",
        "variadic templates, fold expressions, type traits, if constexpr and concepts",
        "inheritance and virtual dispatch: the vptr, the vtable and their cost",
    ],
    "concepts": [
        C("What new really costs on the hot path", "w3c1", """
"Don't allocate" is the rule; this concept is about seeing how much a normal-looking <code>on_book</code>
allocates without saying <code>new</code> anywhere (Deck U3, "What new / malloc Really Costs" and "What the
Hot Path Actually Needs"). The snippet counts calls to the global allocator. A first-draft handler that builds a
string key, a small depth vector, inserts into a <code>std::map</code>, makes a <code>shared_ptr</code> and
appends to a growing vector makes 29,065 heap allocations in 10,000 ticks, 2.91 per tick. The same work with
fixed arrays, a vector reserved at startup and no strings makes zero.
<br><br>
Why the count matters more than any one timing: the allocator's cost is not a constant. The same call that
takes tens of nanoseconds on a quiet tick may walk a fragmented free list, take a lock, or fault in a fresh
page on a busy one, and that variance is your p99.9. The last line shows a trap in the other direction: copying
a 4-character <code>std::string</code> allocated nothing (the small-string buffer holds it inline), while a
27-character one allocated. Whether a string allocates depends on its length, which is exactly the kind of
invisible branch a hot path must not have.
<br><br>
In the lab, Step 0 "Read the contract" (<code>make pool</code>) states the target: a pool that serves orders
with no heap call after startup. In the arena, Deck U3's "In the Arena &mdash; Pool Your Bot" asks you to find
every hidden <code>new</code> in <code>on_book</code> and <code>on_fill</code>.
"""),
        C("The fixed-size object pool: O(1) alloc and free", "w3c2", """
A pool owns one buffer of N slots, reserved before the first tick, and threads an intrusive free list through
the slots that are not in use (Deck U3, "The Fixed-Size Object Pool" and "A Fixed-Size Pool in C++"). Each
unused slot stores the pointer to the next free slot inside its own bytes, so the list costs no extra memory.
<code>alloc()</code> pops the head of the list and constructs the object in place with placement new;
<code>free()</code> runs the destructor explicitly and pushes the slot back. Both are O(1), with no system call,
no lock and no search.
<br><br>
The snippet's trace is worth reading line by line. Orders a, b and c take slots 0, 1 and 2. Freeing b and
allocating d hands back slot 1, because the free list is LIFO: the slot most recently used is the one most
likely to still be hot in cache, a property you want. The fourth allocation takes slot 3 and the fifth returns
<code>nullptr</code>: exhaustion is reported to the caller, who decides what to do (reject the order, or size
the pool properly), instead of silently falling back to the heap. The whole pool is 144 bytes of storage
reserved at startup.
<br><br>
In the lab this is Step 1 "One buffer, owned once" and Step 2 "<code>alloc()</code> and <code>free()</code>,
both O(1). Get to green." The code-trace widget below replays the free list. In the arena this is the pool for
your order structs, which Deck U3's "The Session-3 Code &mdash; Pool the Order Struct" wires in.
"""),
        C("Arena allocators, placement new and the explicit destructor", "w3c3", """
When objects share a lifetime, don't free them one by one: free them all at once (Deck U3, "Arena / Bump
Allocator &amp; Placement new"). An arena is a buffer and an offset. Allocation rounds the offset up to the
requested alignment and adds the size; reset sets the offset back to zero. The snippet allocates a 3-byte tag at
offset 0, a 16-byte, 8-aligned <code>Msg</code> at offset 8 (five bytes of padding to reach alignment), and a
64-byte block aligned to 64 at offset 64, a cache line of its own.
<br><br>
Placement new separates the two jobs <code>new</code> normally does: the arena provides the storage, and
<code>new (raw) Msg(7, 100.02)</code> only runs the constructor there. The matching half is an explicit
destructor call, <code>m-&gt;~Msg()</code>, which runs the destructor without releasing storage; the live count
returns to zero, then a single reset frees everything. For trivially destructible types, the snippet's
per-tick loop shows the pattern you want in a trading loop: 1,000 ticks of scratch objects, a high-water mark of
320 of 1,024 bytes, and not one heap call.
<br><br>
The rules that keep this safe: the alignment must be a power of two, every non-trivial object must be
destroyed before the reset, and nothing may keep a pointer into the arena past the reset. In the lab this is
Step 3 "Placement <code>new</code> + explicit destructor".
""", r"\text{offset}' = \big(\text{offset} + a - 1\big)\ \&\ \sim(a - 1),\quad a = 2^k"),
        C("std::pmr: the standard version of all this", "w3c4", """
C++17's polymorphic memory resources let a standard container use your allocation strategy without changing
its type (Deck U3, "std::pmr &mdash; Polymorphic Memory Resources" and "pmr in Practice &mdash; Per-Tick
Scratch Buffer"). A <code>std::pmr::vector&lt;long&gt;</code> takes a <code>memory_resource*</code>; a
<code>monotonic_buffer_resource</code> over a buffer you own is an arena, and an upstream resource says what
happens when the buffer runs out.
<br><br>
The snippet wraps new/delete in a counting resource to make the fallback visible. Driving a per-tick vector
and a long string straight from the heap costs 2,000 upstream allocations over 1,000 ticks. Building a fresh
monotonic resource over a 4 KB static buffer each tick costs zero: the resource bump-allocates inside the buffer
and its destructor releases everything at once. Shrink the buffer to 128 bytes and it overflows, reaching the
heap four times for 3,968 bytes over ten ticks. With <code>null_memory_resource()</code> upstream, overflow
throws <code>bad_alloc</code> instead: in a trading system that is often the right choice, because a loud
failure in testing beats a silent heap call in production.
<br><br>
The trade-off: every pmr allocation goes through a virtual call on the resource, which is cheap next to a heap
allocation but not free, so pmr is the tool for scratch containers, not for the tightest loop. In the lab this
is the pmr reading attached to HW 3; in the arena it is the per-tick working set of your bot.
"""),
        C("Templates, folds and if constexpr against virtual dispatch", "w3c5", """
A template is a recipe the compiler stamps out per type, so generic code costs nothing at run time (Deck U3,
"Function &amp; Class Templates", "Variadic Templates &amp; Parameter Packs", "Fold Expressions (C++17)" and "if
constexpr &amp; C++20 Concepts"). The snippet's field writer is one variadic template: <code>(put(b, f),
...)</code> is a fold over the comma operator that calls <code>put</code> once per argument, and inside it
<code>if constexpr</code> picks the encoding for a <code>char</code>, an integer or a C string at compile time.
Five fields become <code>B|10002|300|AAPL|7|</code>, and a type with no encoding fails the build through
<code>static_assert</code> instead of failing at run time.
<br><br>
The comparison is virtual dispatch (Deck U3, "How It Works &mdash; the vptr and the vtable" and "What Virtual
Costs on the Hot Path"). <code>Momentum</code> derives from an abstract <code>Strategy</code> and is 16 bytes,
because every object carries a vptr; the equivalent plain struct is 8. Both return the same signal, but the
virtual call loads the vptr, loads the function pointer and makes an indirect call the compiler cannot inline,
while the template call is resolved and usually inlined at compile time. That is Deck U3's punchline,
"Zero-Overhead &mdash; Templates vs Virtual Dispatch".
<br><br>
In the lab this is Step 5 "the fold" and Step 6 "<code>if constexpr</code>, and regression check", assigned
at home. In the arena it is the generic codec field writer of Deck U3's session-3 code.
"""),
    ],
    "widget": {
        "type": "code-trace",
        "title": "The object pool's free list, step by step",
        "params": {
            "lang": "cpp",
            "code": "Pool<Order, 4> pool;          // free: 0 -> 1 -> 2 -> 3\nOrder* a = pool.alloc(...);   // pop slot 0\nOrder* b = pool.alloc(...);   // pop slot 1\nOrder* c = pool.alloc(...);   // pop slot 2\npool.free(b);                 // ~Order(); push slot 1\nOrder* d = pool.alloc(...);   // pop slot 1 again (LIFO)\nOrder* e = pool.alloc(...);   // pop slot 3\nOrder* f = pool.alloc(...);   // list empty -> nullptr",
            "steps": [
                {"line": 1, "state": {"free list": "0 -> 1 -> 2 -> 3", "live": "0"}, "note": "All four slots are reserved at startup; no heap call will follow."},
                {"line": 2, "state": {"free list": "1 -> 2 -> 3", "live": "1", "a": "slot 0"}},
                {"line": 3, "state": {"free list": "2 -> 3", "live": "2", "b": "slot 1"}},
                {"line": 4, "state": {"free list": "3", "live": "3", "c": "slot 2"}},
                {"line": 5, "state": {"free list": "1 -> 3", "live": "2"}, "note": "Explicit destructor, then the slot's own bytes store the next pointer."},
                {"line": 6, "state": {"free list": "3", "live": "3", "d": "slot 1"}, "note": "LIFO reuse: the slot b just warmed is still in cache."},
                {"line": 7, "state": {"free list": "(empty)", "live": "4", "e": "slot 3"}},
                {"line": 8, "state": {"free list": "(empty)", "live": "4", "f": "nullptr"}, "note": "Exhaustion is reported; the pool never falls back to the heap."},
            ],
        },
    },
    "pitfalls": [
        "Calling delete on an object built with placement new: the storage belongs to the pool or arena, so run the destructor explicitly and return the slot.",
        "Resetting an arena while objects with non-trivial destructors are still alive in it: their destructors never run and whatever they own leaks.",
        "Rounding an offset to an alignment that is not a power of two: the mask trick only works for 2^k.",
        "Treating std::string as allocation-free because short test strings were: the small-string buffer hides the heap until a longer value arrives.",
    ],
    "check": [
        {"q": "Why is a pool's free list usually LIFO?",
         "options": ["It is the only order a singly linked list supports", "The most recently freed slot is the one most likely to still be in cache", "FIFO order would make alloc O(n)", "LIFO order prevents double frees"],
         "answer": 1,
         "why": "Handing back the slot just freed reuses a warm cache line. A FIFO list is also O(1) with a tail pointer, so complexity is not the reason, and LIFO order does nothing to detect a double free."},
        {"q": "An arena's offset is 3 and the next request is 16 bytes aligned to 8. Where does the object start?",
         "options": ["3", "8", "16", "19"],
         "answer": 1,
         "why": "(3 + 7) & ~7 = 8: round up to the next multiple of the alignment. 3 is misaligned, 16 over-rounds (that would be the answer for alignment 16), and 19 is the end of an object placed at 3."},
        {"q": "A monotonic_buffer_resource over a 64-byte buffer has null_memory_resource() upstream, and a container asks for 256 bytes. What happens?",
         "options": ["The request silently goes to the heap", "The buffer grows automatically", "bad_alloc is thrown", "The container truncates to 64 bytes"],
         "answer": 2,
         "why": "The null resource refuses every request by throwing bad_alloc, which is exactly why you choose it: overflow fails loudly instead of touching the heap. A monotonic resource never grows a buffer it does not own, and containers never truncate silently."},
        {"q": "What does if constexpr buy inside a template, compared with an ordinary if?",
         "options": ["The branch is evaluated faster at run time", "The discarded branch is not instantiated, so it may contain code that would not compile for this type", "It makes the function a coroutine", "It forces the function to be inlined"],
         "answer": 1,
         "why": "With if constexpr the condition is a compile-time constant and the discarded branch is not instantiated for that type, so one template can call snprintf for integers and memcpy for strings. An ordinary if with a constant condition is usually optimised away too, but both branches must still compile. Inlining is a separate decision."},
    ],
})

# ═══ Week 4 · Session 4 ═══
WEEKS.append({
    "n": 4,
    "title": "Session 4 · Compile-time dispatch and the order book: move decisions out of the tick, then flatten the book",
    "topics": [
        "constexpr, consteval and static_assert; compile-time lookup tables",
        "type traits, tag dispatch and if constexpr",
        "CRTP and policy-based design: polymorphism without the vtable",
        "std::variant and std::visit for message dispatch",
        "hash tables: chaining versus open addressing, and the load factor",
        "the flat, price-indexed book level and the band it really is",
        "FIFO per price level and knowing your queue position",
        "the midterm review map",
    ],
    "concepts": [
        C("constexpr: make the compiler do the work", "w4c1", """
Anything the compiler can compute should not be computed during the race (Deck U4, "constexpr, consteval
&amp; static_assert" and "Compile-Time Lookup Tables"). The snippet uses fixed-point prices with four implied
decimals, the representation binary market-data feeds use. A <code>constexpr</code> function builds the
powers-of-ten table, another parses "100.045" into 1000450, a <code>consteval</code> function (which may only
run at compile time) sizes a &plusmn;5% band around 100.00 at one cent as 1,001 slots, and a lambda fills an
8-entry fee table.
<br><br>
The <code>static_assert</code> lines are the point. If <code>parse_px("99.5")</code> did not equal 995000 the
program would not compile; the tests run inside the compiler and cost nothing at run time. Every value printed
from <code>main</code> except the last is a constant baked into the binary. The last line calls the same
<code>parse_px</code> on a string the optimiser cannot see through and gets 1855000 for "185.5": one function,
two execution times, and the compile-time uses are guaranteed to agree with the run-time one.
<br><br>
In the lab this is the reading behind Step 1 "read the contract": the book's band size and tick are
compile-time constants of the contract. In the arena it is how you should hold anything fixed for a session,
such as the tick size, the fee schedule and the band width: as constants the compiler folds into the code.
""", r"\text{px}_{\text{fixed}} = \text{whole}\cdot 10^4 + \text{frac}\cdot 10^{4-d}"),
        C("Static dispatch: std::variant, std::visit and CRTP", "w4c2", """
The arena's protocol is a discriminated union keyed on a <code>type</code> field (Deck U4, "In the Arena
&mdash; Compile-Time Dispatch on the Wire"). In C++ the same idea is <code>std::variant</code>: the tag is
stored once, and <code>std::visit</code> with an overload set jumps straight to the handler for the active
alternative. There is no inheritance, no heap object per message and no virtual call. The snippet feeds a
six-message tape (two snapshots, an ack, a heartbeat, two fills) through a visitor: books=2, fills=2,
position 150, and the ack's queue_ahead printed as it passes.
<br><br>
The bot itself uses CRTP, the curiously recurring template pattern (Deck U4, "CRTP &mdash; Polymorphism
Without the vtable" and "Policy-Based Design (Alexandrescu)"). <code>BotBase&lt;MyBot&gt;</code> calls
<code>static_cast&lt;Derived*&gt;(this)-&gt;on_book(...)</code>, which the compiler resolves and can inline.
The printed sizes make the cost explicit: the variant is 32 bytes (the largest alternative, a 24-byte fill, plus
the tag rounded up), and <code>MyBot</code> has no vptr. Swap in a different policy class and you get a
different, equally fast bot, chosen at compile time.
<br><br>
In the lab this is Step 0, the visitor, live, from week 6's step 5. In the arena it is Deck U4's session-4 code,
"Compile-Time Message Dispatch", applied to every frame your client decodes.
"""),
        C("Open addressing: a symbol map in one flat array", "w4c3", """
A hash table is O(1) only if you respect the cache (Deck U4, "Hash Tables &mdash; O(1) Lookup, If You
Respect the Cache" and "A Cache-Friendly Open-Addressing Probe"). <code>std::unordered_map</code> uses
chaining: each key lives in its own heap node, so a lookup is a hash, a bucket load and at least one pointer
chase to a cold line. Open addressing keeps every key inline in one flat array; on a collision it probes the
next slot, which is usually on the same or the adjacent cache line.
<br><br>
The snippet is the lab's <code>SymMap</code>: FNV-1a hashing, linear probing, a power-of-two capacity so the
index is a mask. It inserts symbols and then counts the probes needed to look every key up. At load factor 0.24
the average is 1.16 probes and the worst 4; at 0.49, 1.36 and 8; at 0.68, 1.60 and 25; at 0.88, 2.94 and 73; at
0.98 the average is 6.48 and one unlucky key needs 336. The average degrades gently and the <em>maximum</em>
explodes, which is the tail you would feel.
<br><br>
The practical rule is to size the table at startup to stay under about 0.5 to 0.7 and never let it grow on the
hot path. In the lab this is Step 4 "<code>SymMap</code>, and the numbers". In the arena, symbols are known at
session open, so the map can be built once and then only read.
""", r"\mathbb{E}[\text{probes}_{\text{hit}}] \approx \tfrac12\left(1 + \frac{1}{1-\alpha}\right),\quad \alpha = n/\text{cap}"),
        C("The flat, price-indexed book and the band it really is", "w4c4", """
Prices sit on a discrete tick grid, so a book side can be an array indexed by arithmetic: slot = tick &minus;
base_tick (Deck U4, "Representing the Book &mdash; Flat Array vs Tree", "A Flat, Price-Indexed Book Level" and
"Add, Cancel &amp; Match on the Flat Book"). Adding liquidity is one store. The best price is a cached index,
so reading the touch is one load with no traversal. The snippet's band is &plusmn;5% around 100.00 at one cent,
1,001 slots of 8 bytes: 8,008 bytes, 125 cache lines, small enough to stay resident.
<br><br>
The cost moves to cancels. When the touch empties, the side scans toward worse prices for the next non-empty
slot: the first cancel scans 1 slot, the second 11 more (12 in total) because the next bid is ten cents away.
That scan is bounded by the band and runs over contiguous memory, which is exactly the access pattern the
prefetcher handles well, whereas a tree would pay a pointer chase per level on every operation. An order
outside the band (106.00) is rejected rather than triggering a resize; the band is a design decision you state
up front, mirroring the venue's own price bands.
<br><br>
In the lab this is Step 2 "the banded book" and Step 3 "<code>cancel</code>, including the scan". In the arena
it is Deck U4's "In the Arena &mdash; Mirror the Exchange": keep a local copy of the venue's book in this shape.
"""),
        C("FIFO per level, and knowing your place in it", "w4c5", """
The engine keys each price level on arrival order, so your standing is a quantity you can compute:
queue_ahead, the shares resting in front of you (Deck U4, "FIFO Per Price Level &mdash; and Your Position in
It"). The arena's acknowledgement and queue-update messages carry it, and queue_ahead = 0 means you are next.
The snippet joins a level behind 800 shares. A 600-share trade eats from the front and leaves 200 ahead; a
cancel by the order in front of you takes you to 0.
<br><br>
Then comes the expensive mistake. The bot "requotes" at the same price, a cancel plus a new order, and lands at
the back with 400 ahead. The next aggressive sell of 300 fills the order that was behind it; the bot fills 0 of
its 200, where staying put would have filled all 200. That is why a good market maker only requotes when the
expected gain beats the queue position it gives up, and why session 9 returns to queue-aware requoting.
<br><br>
The deque here is the teaching version; the lab's book keeps per-level FIFO state inside the flat
structure so a cancel does not walk a linked list across the heap. In the lab this closes Step 3 and feeds
HW 4. In the arena the queue fields on every ack are the data this concept turns into a decision, and the
session also includes the ten-minute midterm review map.
"""),
    ],
    "widget": {
        "type": "tree-diagram",
        "title": "Compile-time dispatch on the wire: one frame, one tag check, one inlined handler",
        "params": {
            "nodes": [
                {"id": "frame", "label": "WebSocket frame (JSON)"},
                {"id": "tag", "label": "read \"type\" once"},
                {"id": "snap", "label": "BookSnapshot"},
                {"id": "ack", "label": "OrderAck"},
                {"id": "fill", "label": "Fill"},
                {"id": "hb", "label": "Heartbeat"},
                {"id": "visit", "label": "std::visit + overloaded{}"},
                {"id": "onbook", "label": "Derived::on_book (CRTP, inlined)"},
                {"id": "queue", "label": "queue_ahead -> requote policy"},
                {"id": "onfill", "label": "Derived::on_fill"},
                {"id": "book", "label": "flat banded book: slot = tick - base"},
            ],
            "edges": [
                {"from": "frame", "to": "tag"}, {"from": "tag", "to": "snap"}, {"from": "tag", "to": "ack"},
                {"from": "tag", "to": "fill"}, {"from": "tag", "to": "hb"},
                {"from": "snap", "to": "visit"}, {"from": "ack", "to": "visit"}, {"from": "fill", "to": "visit"},
                {"from": "hb", "to": "visit"},
                {"from": "visit", "to": "onbook"}, {"from": "visit", "to": "queue"}, {"from": "visit", "to": "onfill"},
                {"from": "onbook", "to": "book"},
            ],
        },
    },
    "pitfalls": [
        "Letting an open-addressing table fill up: the average probe count looks fine at 0.9 while the worst lookup is dozens of slots long.",
        "Resizing the flat book on the hot path when a price leaves the band; decide the band at startup and reject or re-centre off the path.",
        "Cancel-and-repost at the same price to 'refresh' a quote: it resets your queue position to the back.",
        "Believing constexpr guarantees compile-time evaluation: only a constant-expression context (a constexpr variable, static_assert, consteval) forces it.",
    ],
    "check": [
        {"q": "What does consteval add over constexpr for a function?",
         "options": ["Nothing; they are synonyms", "The function must be evaluated at compile time; a run-time call is an error", "The function is evaluated lazily", "The function can allocate at run time"],
         "answer": 1,
         "why": "A consteval function is an immediate function: every call must produce a constant, so a call with run-time arguments fails to compile. A constexpr function may run at either time, as parse_px does in the snippet. Neither makes evaluation lazy."},
        {"q": "Your flat bid side has its best at slot 502 and the next non-empty slot is 490. The best level is fully cancelled. How many slots does the scan inspect before finding the new best?",
         "options": ["1", "12", "490", "1001"],
         "answer": 1,
         "why": "It walks from 502 down through 501 ... 491, 12 slots, which are all contiguous and prefetch well. It does not rescan the whole band, and the cached best index is what makes the common case one load."},
        {"q": "You rest 200 shares with 400 ahead of you at a level. A trader cancels 150 of the 400, then a 300-share market sell arrives. How many of yours fill?",
         "options": ["0", "50", "200", "300"],
         "answer": 1,
         "why": "After the cancel 250 are ahead; the 300-share sell takes those 250 first and the remaining 50 fill against you. Price-time priority fills strictly in queue order, so neither 0 nor your full 200 is right, and 300 ignores the queue entirely."},
        {"q": "Why can a variant plus visit replace a virtual on_message hierarchy with no loss of flexibility for a closed set of message types?",
         "options": ["variant stores every alternative at once", "visit dispatches on the stored index with the handler set known at compile time, so no heap object or vtable is needed", "variant uses RTTI to find the type", "visit only works with inheritance"],
         "answer": 1,
         "why": "A variant holds one alternative plus an index; visit uses the index to call the right overload, typically through a jump table the compiler generates. Because the set of types is closed and known, no base class, heap allocation or vtable is required. It does not use RTTI."},
    ],
})

# ═══ Week 5 · Session 5 ═══
WEEKS.append({
    "n": 5,
    "title": "Session 5 · Midterm, then complexity, the cache and atomics: count misses, update instead of recompute, and publish safely",
    "topics": [
        "MIDTERM in session: remote, closed-book, 30 questions in 90 minutes",
        "Big-O, amortized cost and the real machine",
        "ring buffers and rolling windows",
        "update, don't recompute: online mean, variance (Welford) and EMA",
        "std::thread, data races and why a race is undefined behaviour",
        "happens-before, std::atomic and memory_order",
        "acquire/release publication, and why a lock on the hot path is a tail bomb",
        "mini-lab: reproduce a race, let ThreadSanitizer name it, fix it properly",
    ],
    "concepts": [
        C("Big-O hides the constant, and the constant is your grade", "w5c1", """
Big-O counts operations as n grows; the machine charges for cache lines at the n you actually have (Deck U5,
"Big-O, Amortized, and the Real Machine" and "Optimization Techniques That Move p99.9"). The snippet finds a
price level three ways and counts both comparisons and lines, then applies a stated cost model: 1 ns per
comparison, 100 ns per cold line, 5 ns for each further sequential line because the prefetcher hides it.
<br><br>
For 16 levels, the depth a strategy usually reads, a linear scan does 5 comparisons in 1 line, binary search 4
in 1, and a <code>std::map</code> 4 comparisons but 4 lines, since every node is its own heap allocation:
105, 104 and 404 modelled ns. The tree's O(log n) is real and still four times slower. At 1,000 levels with the
target near the front, the linear scan's 251 comparisons over 32 prefetched lines model at 506 ns against 809
for binary search and 909 for the tree: the "worse" algorithm wins because its memory access is sequential.
<br><br>
The lesson is not "always scan": it is to count the misses before choosing. Books are shallow where the action
is, the touch is near the front, and contiguous memory is cheap to walk. In the arena this is why the flat
book of session 4 beats a map even though both are "fast enough" on paper; in the midterm, expect to be asked
which structure wins at a stated n and why.
""", r"T \approx c_{\text{cmp}}\cdot\#\text{cmp} + c_{\text{miss}}\cdot\#\text{cold lines} + c_{\text{seq}}\cdot\#\text{prefetched lines}"),
        C("Amortized is not worst case", "w5c2", """
<code>push_back</code> is amortized O(1): averaged over many calls the cost per call is constant (Deck U5,
"Big-O, Amortized, and the Real Machine"). The snippet counts the element copies each call triggers. 100,000
pushes cause 18 reallocations and 131,071 copies in total, 1.31 copies per push on average, which is the
amortized story. But push #65,536 alone copies 65,536 elements: the capacity doubles (libc++ grows by a factor
of two here, ending at 131,072 for 100,000 elements), and on that one call every existing element moves.
<br><br>
A trading loop does not experience the average. It experiences each tick, and the tick that triggers a
reallocation is a latency spike proportional to the container's size, arriving at a moment you do not choose,
usually when the container is busiest. That single call is a p99.9 event. With <code>reserve(100000)</code> at
startup the same loop reallocates zero times and every push costs the same.
<br><br>
The same reasoning applies to any structure with amortized guarantees: hash tables that rehash, string
builders, and garbage collectors in other languages. Pay the growth once, off the hot path, and cap the size.
In the arena this is the order and fill history your bot keeps: reserve it at session open. The midterm
routinely asks for the difference between amortized and worst-case cost with a container like this one.
""", r"\text{amortized} = \frac{\sum_i c_i}{n} = O(1),\qquad \max_i c_i = \Theta(n)"),
        C("Ring buffers and update-don't-recompute", "w5c3", """
A rolling window is a ring buffer: fixed capacity, a head index, and the oldest element overwritten by the
newest (Deck U5, "The Ring Buffer &mdash; Fixed-Capacity History" and "Sliding &amp; Rolling Windows"). With a
power-of-two capacity the index is a mask. Its statistics should be <em>updated</em> per tick, not recomputed:
add the new value, subtract the one leaving (Deck U5, "Online Variance &amp; EMA in C++").
<br><br>
The snippet runs 100,000 ticks of a synthetic price with a 64-tick window. The incremental and recomputed
means agree to 3.8e-11 while the incremental version does 200,000 operations against 6,397,984: 32 times less
work, and more importantly a constant cost per tick instead of a cost proportional to the window. The EMA is a
single multiply-add. The variance line shows the other half of the story: the textbook sum-of-squares formula
subtracts two large, nearly equal numbers at a price near 10,000 and loses precision (relative error 1.6e-6
here, and far worse in single precision or at higher prices), while Welford's update stays accurate.
<br><br>
The small 3.8e-11 drift is itself a warning: a running sum that adds and subtracts accumulates rounding, so
long-lived windows re-anchor periodically off the hot path. In the arena this is Deck U5's session-5 code, "An
O(1) Signal on <code>on_book</code>": the microprice and imbalance are handed to you free, and anything you add
on top should cost O(1) per tick.
""", r"\bar x_k = \bar x_{k-1} + \frac{x_k - \bar x_{k-1}}{k},\quad M_k = M_{k-1} + (x_k - \bar x_{k-1})(x_k - \bar x_k)"),
        C("A data race is undefined behaviour, and volatile does not fix it", "w5c4", """
<code>counter++</code> on a plain integer is three steps: load, add, store. Two threads interleaving those
steps can both load the same old value and both store old+1, losing an update, and the C++ standard goes
further: an unsynchronised write racing with another access is undefined behaviour (Deck U5, "std::thread
&mdash; Two Instruction Streams" and "Data Races Are Undefined Behavior"). The snippet proves the loss
without running a thread: it enumerates every interleaving of two single increments. Of the 20 possible
schedules, only 2 (one thread entirely before the other) give 2; 18 lose an update.
<br><br>
The fix is an atomic read-modify-write: <code>fetch_add</code> is indivisible, so the result no longer depends
on the schedule, and two real threads doing a million increments each print 2,000,000 on every run.
<code>memory_order_relaxed</code> is enough for a pure counter because nothing else is published through it.
<code>volatile</code> is the wrong fix: it stops the compiler caching the variable, but it makes nothing
atomic and orders nothing between threads.
<br><br>
This is the whole mini-lab: Step 1 "reproduce the race", Step 2 "let the tool name it" with ThreadSanitizer,
Step 3 "the wrong fix", changing the declaration to <code>volatile</code> and watching TSan still complain,
and Step 4 "fix it properly" with <code>std::atomic&lt;long&gt;</code> and a relaxed <code>fetch_add</code>.
""", r"\#\text{interleavings} = \binom{6}{3} = 20"),
        C("Acquire/release: publishing data without a lock", "w5c5", """
Happens-before is the only rule that matters (Deck U5, "Happens-Before &mdash; the Only Rule That Matters"
and "Acquire / Release &mdash; Publishing Data Safely"). If thread A writes a payload with plain stores and
then stores a flag with <code>memory_order_release</code>, and thread B loads the flag with
<code>memory_order_acquire</code> and sees it set, then every write A made before the release is visible to B
after the acquire. Neither the compiler nor the CPU may move the payload writes below the release or the reads
above the acquire.
<br><br>
The snippet is Deck U5's "A Lock-Free Handoff": one slot passed back and forth 200,000 times between a
producer and a consumer through a single atomic flag. The consumer checks every read for a torn or stale touch
(wrong sequence number, or an ask not two ticks above the bid) and finds 0; the checksum is the same on every run.
The flag is <code>alignas(64)</code> and starts its own cache line (the snippet prints the address modulo 64 as
0), so the spinning reader does not fight the writer over the payload's line.
<br><br>
Why not a mutex? A lock is correct, but on the hot path it is a tail bomb (Deck U5, "Why a Lock on the Hot Path
Is a Tail Bomb"): the uncontended case is fast, and the contended case can put your thread to sleep behind a
holder that was itself preempted, turning nanoseconds into scheduler quanta. In the arena this handoff is the
seed of session 6's SPSC ring between the socket thread and your strategy.
"""),
    ],
    "widget": {
        "type": "timeline",
        "title": "Session 5 run of show: the midterm, then a compressed lecture and a 25-minute race-condition mini-lab (minutes from the start)",
        "params": {
            "events": [
                {"t": 0, "label": "Logistics and exam brief", "note": "No deck: remote-exam checklist, access code."},
                {"t": 10, "label": "MIDTERM starts", "note": "Remote, closed-book, 30 questions in 90 minutes."},
                {"t": 100, "label": "Break and reset", "note": "Ten minutes."},
                {"t": 110, "label": "Compressed lecture", "note": "Complexity in cache terms, rolling windows, threads, atomics, acquire/release."},
                {"t": 150, "label": "Mini-lab Step 1: reproduce the race", "note": "A plain long counter, two threads."},
                {"t": 157, "label": "Step 2: let the tool name it", "note": "Same source, ThreadSanitizer flags."},
                {"t": 165, "label": "Step 3: the wrong fix", "note": "volatile: TSan still reports the race."},
                {"t": 168, "label": "Step 4: fix it properly", "note": "std::atomic<long> with fetch_add(relaxed)."},
                {"t": 175, "label": "Close", "note": "Project phase 1 due tonight; HW 5 in ten days."},
            ],
        },
    },
    "pitfalls": [
        "Reading 'amortized O(1)' as 'every call is cheap': the reallocating call copies the whole container, and it lands on your busiest tick.",
        "Using volatile for inter-thread communication: it neither makes an operation atomic nor orders memory between threads.",
        "Publishing a payload with a relaxed flag store: the reader may see the flag before the data. Pair a release store with an acquire load.",
        "Keeping a running window sum forever: add-and-subtract accumulates rounding; re-anchor it periodically off the hot path.",
    ],
    "check": [
        {"q": "Two threads each execute one plain counter++ on a shared int starting at 0. Which final values are possible under the model the snippet enumerates?",
         "options": ["Only 2", "Only 1", "1 or 2", "0, 1 or 2"],
         "answer": 2,
         "why": "If both threads load before either stores, both store 1; if one completes before the other loads, the result is 2. It cannot be 0 because at least one store of 1 happens. (Formally the race is undefined behaviour, which is why the real fix is an atomic, not an argument about outcomes.)"},
        {"q": "A vector of 65,536 longs is full and you push_back once more. Roughly how many element copies or moves does that call perform with a doubling growth policy?",
         "options": ["1", "about 16 (log2 of the size)", "65,536", "131,072"],
         "answer": 2,
         "why": "The vector allocates a buffer of 131,072 and moves the 65,536 existing elements, then constructs the new one. The amortized cost is about 1.3 per push, but this call alone is Theta(n). 131,072 is the new capacity, not the number moved."},
        {"q": "Thread A writes data, then flag.store(1, release). Thread B does while(!flag.load(acquire)); then reads data. What is guaranteed?",
         "options": ["Nothing, because data is not atomic", "B sees every write A made before the release", "B sees data only if data is volatile", "The guarantee needs memory_order_seq_cst on both sides"],
         "answer": 1,
         "why": "Release/acquire synchronisation creates happens-before from A's writes before the store to B's reads after the load, so plain data written before the release is visible. volatile is irrelevant, and seq_cst is stronger than needed for this one-way publication."},
        {"q": "For 16 price levels, which structure models fastest under the snippet's cost model, and why?",
         "options": ["std::map, because it is O(log n)", "Linear scan or binary search on a contiguous array, because both touch one cache line", "A hash table, because it is O(1)", "std::list, because insertion is O(1)"],
         "answer": 1,
         "why": "Sixteen 8-byte ticks fit in two lines, and the target near the front sits in the first, so both array searches cost about one cold line; the map pays a cold line per node visited. Big-O ranks these by comparisons and misses the dominant term. A list is the worst case for the cache."},
    ],
})

# ═══ Week 6 · Session 6 ═══
WEEKS.append({
    "n": 6,
    "title": "Session 6 · Lock-free pipelines and shared memory: one writer, one reader, a bounded ring",
    "topics": [
        "midterm debrief",
        "compare-and-swap, the atom of lock-free programming",
        "the ABA problem and progress guarantees (lock-free, wait-free)",
        "the SPSC ring buffer, and why alignas(64) is not decoration",
        "back-pressure, bounded queues and head-of-line blocking",
        "across processes: the shared-memory ring and the seqlock",
        "C++20 coordination: latch, barrier, counting_semaphore; parallel algorithms",
        "Lab: build and test the SPSC ring, then run it under ThreadSanitizer",
    ],
    "concepts": [
        C("Compare-and-swap, and how ABA fools it", "w6c1", """
Compare-and-swap writes a new value only if the location still holds the value you read; if not, it fails and
you retry with the fresh value (Deck U6, "Compare-and-Swap &mdash; the Atom of Lock-Free"). Every lock-free
structure is built from CAS loops. The snippet's last line is one: raising a shared high-water mark with
<code>compare_exchange_weak</code>, retrying only when another thread changed the value in between (in a single
thread, never).
<br><br>
The first two lines replay the ABA problem deterministically on a lock-free stack (Deck U6, "The ABA Problem
&amp; Progress Guarantees"). Thread 1 reads top = A and A's next = B, then is preempted. Thread 2 pops A, pops
B, and pushes A back. Thread 1 resumes and its CAS compares top against A, sees A, and succeeds, installing B as
the new top even though B was already popped: the stack is corrupt. The value came back, but it is not the same
state. With a tagged head (a version counter bumped on every change, compared together with the pointer) the
CAS fails, thread 1 retries, and top correctly remains A.
<br><br>
Lock-free is a progress guarantee: some thread always makes progress, even if others are suspended. It is not
a speed guarantee, and it is subtle, which is why this course's pipeline uses the simplest lock-free structure
there is, the single-producer single-consumer ring, where no CAS is needed at all. In the lab, Step 0 "read the
contract, together" starts from exactly that constraint.
"""),
        C("The SPSC ring: two indices, two cache lines", "w6c2", """
With exactly one producer and one consumer, a bounded ring needs no CAS and no lock (Deck U6, "The SPSC Ring
Buffer &mdash; One Writer, One Reader" and "A Minimal SPSC Ring Buffer"). The producer alone writes
<code>head_</code>, the consumer alone writes <code>tail_</code>. To push, the producer checks the ring is not
full (head &minus; tail &lt; N, reading tail with acquire), writes the slot, then publishes with a release store
of head + 1. To pop, the consumer mirrors it. The indices grow forever and the slot is <code>index &amp;
(N &minus; 1)</code>, so full and empty are never ambiguous.
<br><br>
The snippet runs it for real: a producer thread pushes 1,000,000 ticks through a 1,024-slot ring to the main
thread, which checks sequence order and a spread checksum. It prints 0 out of order and checksum 2,000,000 on
every run, because the result depends only on correctness, not on the schedule. The last line shows the layout
detail that makes it fast: <code>head_</code> at byte 0 and <code>tail_</code> at byte 64. Without the two
<code>alignas(64)</code> they would share a line, and every push and pop would invalidate the other core's copy,
the false sharing of session 2, making the threaded version slower than a single thread.
<br><br>
In the lab this is Step 1 "the skeleton and the indices", Step 2 "<code>push</code> and <code>pop</code>",
Step 3 "two threads, for real" and Step 4 "TSan, the last 10 points". The code-trace widget below steps through
head and tail.
""", r"\text{full} \iff h - t = N,\qquad \text{empty} \iff h = t,\qquad \text{slot} = i \,\&\, (N-1)"),
        C("Bounded is a feature: back-pressure and conflation", "w6c3", """
A bounded queue forces a decision when the producer outruns the consumer (Deck U6, "Back-Pressure, Bounded
Queues &amp; Head-of-Line"). The snippet is a deterministic model of your client: every 100 steps a burst of 60
book updates for 4 symbols hits the socket, the strategy handles one message per step, and the queue holds 16.
"Stale" counts messages that were already superseded by a newer update for the same symbol when the strategy
reached them: wasted work on old information.
<br><br>
Blocking processes all 6,000 messages, but 5,600 are stale, the reader thread stalls 4,400 times, and the
average message is 29.5 steps old when handled (worst 59): head-of-line blocking, with the newest data stuck
behind the oldest. Dropping the newest processes 1,600, every one of them stale, because it keeps the old data
and throws away the fresh. Conflation, keeping one slot per symbol and overwriting it, processes 400 messages
with 0 stale and an average age of 1.5 steps.
<br><br>
For market data the right policy is almost always conflation: the strategy wants the latest book, not every
intermediate one. For orders and fills it is the opposite; they must never be dropped or merged, and the queue
must be sized so it never fills. In the arena this is what happens when the class fires at once on a shock tick:
a pipeline that blocks falls behind the tape exactly when it matters.
"""),
        C("Across processes: the shared-memory slot and the seqlock", "w6c4", """
The same ring can cross a process boundary if it lives in a shared-memory segment (Deck U6, "Across
Processes &mdash; the Shared-Memory Ring" and "The Shared-Memory Ring (Project Phase 4)"). Then its layout is a
contract between two binaries: fixed-size fields, no pointers (each process maps the segment at a different
address, so store offsets), standard layout, and atomics that are always lock-free, since a lock-based atomic
would hide a mutex that is not shared. The snippet checks all of that with <code>static_assert</code> and puts
one slot in exactly one 64-byte line.
<br><br>
For a single "latest touch" that one writer updates and many readers poll, the classic structure is a seqlock.
The writer makes the sequence odd, writes, then makes it even; a reader loads the sequence, copies the payload,
loads the sequence again, and retries if it was odd or changed. The snippet replays one collision step by step:
the reader arrives mid-write (sequence 1, odd), would have seen bid 10001 with the old ask 10002, a mixture of
two states, and retries; after the writer finishes (sequence 2) it reads bid 10001 and ask 10003 consistently.
Readers never block the writer, which is exactly what a market-data publisher needs.
<br><br>
In the arena this is the session-9 pickoff: one client per venue, both writing a shared touch cache that is your
Phase 4 shared-memory structure.
"""),
        C("C++20 coordination: latch, barrier, semaphore", "w6c5", """
Not everything is a queue. C++20 adds three coordination primitives, each for one job (Deck U6, "C++20
Coordination &mdash; Barrier, Latch, Semaphore"). A <code>std::latch</code> is a one-shot countdown: the
snippet uses it as a start gun so four worker threads begin together. A <code>std::barrier</code> is reusable:
all four workers compute a partial sum, arrive, and wait; the barrier's completion function runs once per
phase on one thread and combines the partials. The three phase totals print as 47,999,055, 95,998,110 and
143,997,165, exactly 1, 2 and 3 times the first, on every run, because the barrier makes each phase's reads
happen after all of that phase's writes.
<br><br>
A <code>std::counting_semaphore</code> is a budget. The snippet uses one as a per-tick message quota, the
arena's <code>order_quota</code>: with a budget of 6, eight attempts send 6 and refuse 2, and releasing the budget
at the next tick lets sends resume. That is a useful discipline even single-threaded: decide what you will spend
your six messages on before the tick, not after the venue rejects the seventh.
<br><br>
None of these belong inside the tick-to-trade path; they coordinate startup, phases and shutdown around it.
Parallel algorithms (<code>std::execution</code> policies, Deck U6's "Parallel Algorithms") are the same story
for batch work such as calibration or replay analysis. In the lab they are the closing reading; in the arena the
quota is real, dropping to six messages per tick by the tournament.
"""),
    ],
    "widget": {
        "type": "code-trace",
        "title": "An SPSC ring of capacity 4: head, tail and the full/empty tests",
        "params": {
            "lang": "cpp",
            "code": "push(A)   // h - t = 0 < 4: write slot 0, head = 1 (release)\npush(B)   // write slot 1, head = 2\npop()     // t != h: read slot 0 -> A, tail = 1 (release)\npush(C)   // write slot 2, head = 3\npush(D)   // write slot 3, head = 4\npush(E)   // write slot 0 (4 & 3), head = 5\npush(F)   // h - t = 4 = N: FULL -> false\npop()     // read slot 1 -> B, tail = 2",
            "steps": [
                {"line": 1, "state": {"head": "1", "tail": "0", "slots": "[A, -, -, -]"}},
                {"line": 2, "state": {"head": "2", "tail": "0", "slots": "[A, B, -, -]"}},
                {"line": 3, "state": {"head": "2", "tail": "1", "slots": "[-, B, -, -]", "got": "A"}},
                {"line": 4, "state": {"head": "3", "tail": "1", "slots": "[-, B, C, -]"}},
                {"line": 5, "state": {"head": "4", "tail": "1", "slots": "[-, B, C, D]"}},
                {"line": 6, "state": {"head": "5", "tail": "1", "slots": "[E, B, C, D]"}, "note": "The indices keep growing; the slot is the index masked by N - 1."},
                {"line": 7, "state": {"head": "5", "tail": "1", "slots": "[E, B, C, D]", "push": "false"}, "note": "Full is detected without a separate counter: back-pressure, not overwrite."},
                {"line": 8, "state": {"head": "5", "tail": "2", "slots": "[E, -, C, D]", "got": "B"}},
            ],
        },
    },
    "pitfalls": [
        "Putting head and tail on the same cache line: the ring still works, and runs slower than a single thread because the line ping-pongs between cores.",
        "Using an SPSC ring with two producers: nothing in its code arbitrates concurrent writers to head, so pushes silently collide.",
        "Blocking the market-data reader when the queue fills: the newest data waits behind stale data. Conflate book updates; size order queues so they never fill.",
        "Storing pointers inside a shared-memory segment: each process maps it at a different address. Store offsets.",
    ],
    "check": [
        {"q": "In the SPSC ring, why must the producer publish head with a release store after writing the slot?",
         "options": ["To make the store faster", "So a consumer that acquires the new head is guaranteed to see the slot's contents", "Because head is shared by two producers", "Release stores flush the cache line to DRAM"],
         "answer": 1,
         "why": "Release/acquire orders the slot write before the index update as seen by the consumer, so it never reads a slot that is not yet written. There is only one producer by design, and release semantics say nothing about flushing to DRAM."},
        {"q": "What does a tagged (versioned) head defend against in a lock-free stack?",
         "options": ["False sharing", "The ABA problem: a CAS that succeeds because a value returned, though the state changed", "Priority inversion", "Torn 128-bit reads"],
         "answer": 1,
         "why": "The version increments on every change, so a head that went A -> C -> A no longer compares equal to the old (A, version) pair and the stale CAS fails. False sharing is a layout issue, priority inversion is a locking issue, and tearing is about atomic width."},
        {"q": "A burst of 60 book updates for 4 symbols arrives and your strategy can handle only a few before the next burst. Which queue policy is right for market data?",
         "options": ["Block the reader until there is room", "Drop the newest messages", "Conflate: keep the latest update per symbol", "Grow the queue without bound"],
         "answer": 2,
         "why": "The strategy needs the current book, not every intermediate state; conflation delivered 0 stale messages in the snippet. Blocking produced head-of-line blocking and 5,600 stale messages, dropping the newest kept only stale data, and an unbounded queue turns a burst into ever-growing latency."},
        {"q": "A seqlock reader loads seq = 7. What should it do?",
         "options": ["Read the payload: 7 is a valid version", "Retry: an odd sequence means a write is in progress", "Take the writer's lock", "Increment seq to claim the slot"],
         "answer": 1,
         "why": "The writer makes the sequence odd before writing and even after, so an odd value means the payload may be half-written. Readers never take a lock and never write the sequence; that is what lets the writer run unblocked."},
    ],
})

# ═══ Week 7 · Session 7 ═══
WEEKS.append({
    "n": 7,
    "title": "Session 7 · Network protocols, market data and serialization: know the bytes, then stop paying full price to read them",
    "topics": [
        "FIX: tag=value, BodyLength and CheckSum",
        "binary feeds (ITCH/OUCH style) and schema formats (Protobuf, FlatBuffers)",
        "TCP for orders, UDP multicast for data; sequencing and gap fill",
        "framing: a socket is a byte stream, not a message stream",
        "blocking versus non-blocking I/O; epoll, kqueue and the reactor",
        "the cost of a general DOM parser; custom and zero-copy serialization",
        "batching versus latency",
        "Lab: the FIX scan loop, then a hand-rolled u64toa",
    ],
    "concepts": [
        C("FIX: tag=value, the readable ancestor", "w7c1", """
FIX is the lingua franca of order entry: a message is a sequence of <code>tag=value</code> fields separated by
the SOH byte (0x01), opened by <code>8=</code> (the version) and <code>9=</code> (BodyLength, the byte count of
everything after it up to the checksum), and closed by <code>10=</code>, the sum of every preceding byte modulo
256, written as three digits (Deck U7, "FIX &mdash; Tag=Value, the Lingua Franca"). The snippet builds a
new-order-single (35=D) for 300 AAPL at 18250 and prints it with SOH shown as <code>|</code>: BodyLength 48,
CheckSum 045, 70 bytes on the wire. The receiver recomputes the checksum and gets 045: valid.
<br><br>
The parser is the lab's point. It is a scan loop over a <code>std::string_view</code>: find the
<code>=</code>, find the next SOH, convert the tag and the value in place with <code>std::from_chars</code>,
which does not allocate, does not consult the locale and does not throw. No field is copied into a string and
no dictionary is built; asking for tag 44 walks the bytes once and stops.
<br><br>
FIX is readable and flexible, and that is its cost: variable-length text that must be scanned byte by byte.
Fast venues pair it with binary protocols for the hot path. In the lab this is Step 1 "<code>make fix</code>
&rarr; red. Read the contract.", Step 2 "type the scan loop together" and Step 3 "go green, read your number".
""", r"\text{CheckSum} = \Big(\sum_{\text{bytes before } 10=} b_i\Big) \bmod 256"),
        C("Fixed-width binary: decode is a copy, not a parse", "w7c2", """
Binary market-data feeds put every field at a known offset with a known width (Deck U7, "Binary Feeds
&mdash; ITCH / OUCH Style"). The snippet's add-order message is 36 bytes with no padding, checked by
<code>static_assert</code>: a type byte, a 2-byte locate code, 8-byte timestamp and order reference, a side
byte, 4-byte share count, an 8-byte space-padded symbol and a 4-byte price with four implied decimals.
Integers are big-endian on the wire (network byte order), so on a little-endian machine each field is
byte-swapped; the dump shows the type 'A' (0x41) followed by the locate 17 as <code>00 11</code>.
<br><br>
Decoding is one <code>memcpy</code> into the struct and a byte swap per field you use: no scanning for
delimiters, no digit conversion, no branches on content. The same order as JSON is 122 bytes, 3.4 times larger,
and every one of those bytes must be scanned and every number converted from text. Schema formats sit in
between (Deck U7, "Schema Formats &mdash; Protobuf vs FlatBuffers"): Protobuf uses variable-length integers and
must be decoded; FlatBuffers is laid out so a field can be read in place.
<br><br>
Two rules keep binary decoding safe: copy with <code>memcpy</code> rather than casting a pointer into the
receive buffer (alignment and strict aliasing), and treat the layout as a versioned contract. In the arena the
wire is JSON over WebSocket (Deck U7, "In the Arena &mdash; The Wire You Actually Speak"), which is why the next
two concepts are about paying less for it.
"""),
        C("Framing, sequencing and gap fill", "w7c3", """
A TCP socket is a byte stream, not a message stream: one <code>read()</code> may return half a message or three
and a half (Deck U7, "Framing &mdash; Where Does a Message End?"). A framer accumulates bytes, extracts every
complete message and keeps the partial tail for the next read. The snippet length-prefixes 1,000 messages of 6 to
25 bytes into a 15,500-byte stream and delivers it in 818 reads of 1 to 37 bytes, cutting messages at arbitrary
points. The framer recovers exactly 1,000 frames with a correct sequence checksum and 0 bytes left over. A
length prefix makes the boundary explicit; delimiters (FIX's SOH, a newline) work too but must be scanned for.
<br><br>
Market data usually travels over UDP multicast instead (Deck U7, "TCP vs UDP Multicast for Market Data"): one
packet reaches every subscriber at once with no retransmission, so it is fast and fair, and loss is your
problem. Every message carries a sequence number, and the receiver checks it (Deck U7, "WebSocket, Sequencing
&amp; Gap Fill"). The snippet's feed delivers 1, 2, 3, 5, 6, 9, 10, 10, 11: it reports a gap at 4, a gap at 7..8
and a duplicate 10. A gap means your book is wrong until you recover, by requesting a retransmission or
rebuilding from a snapshot; a duplicate must be ignored, or you double-count liquidity.
<br><br>
In the arena, the WebSocket layer does the framing for you, but the rule is the same: never act on a book you
know is missing an update.
"""),
        C("What a general parser costs, and the targeted alternative", "w7c4", """
A general-purpose JSON library builds a document object model: every key and value materialised, typed and
stored, before you ask for the one field you need (Deck U7, "The Cost of a General DOM Parser"). The snippet
parses the arena's 173-byte <code>book_snapshot</code> two ways and counts heap allocations. A DOM-style parse
into a <code>std::map&lt;std::string, std::string&gt;</code> makes 11 allocations and reads every byte to get
the bid, 182.49. A targeted scan finds <code>"bid":</code>, converts in place with <code>from_chars</code>, and
makes 0 allocations after reading 52 bytes.
<br><br>
That is the lab's "Targeted Field Extract" (Deck U7's session-7 code): for the handful of message types on your
hot path, you know the schema, so you do not need a general parser. The trade-off is brittleness: a targeted
scan assumes the key order and formatting, so it must be tested against recorded traffic and fall back to the
full parser when an assumption fails.
<br><br>
The send side is the mirror image (Deck U7, "Custom &amp; Zero-Copy Serialization"). <code>u64toa</code> writes
digits backwards into a stack buffer and reverses them: ten lines, no format-string parsing, no locale. The
snippet checks it against <code>snprintf</code> on six edge values, from 0 to 2^64 &minus; 1, and finds 0
mismatches. In the lab this is Step 4 "<code>u64toa</code> in one shot"; Deck U7's "Prove It &mdash; Benchmark on
a Replay Tape" is how you show the gain honestly.
"""),
        C("Non-blocking I/O, and batching versus latency", "w7c5", """
A blocking read parks your thread until data arrives; a non-blocking socket returns immediately, and an event
loop (epoll on Linux, kqueue on macOS, wrapped by the reactor pattern in Boost.Asio) tells one thread which of
many sockets are ready (Deck U7, "Blocking vs Non-Blocking I/O", "epoll, kqueue &amp; the Event Loop" and "A
Non-Blocking Read Loop"). The next decision is how often to cross into the kernel, and that is a trade-off, not
an optimisation (Deck U7, "Batching vs Latency &mdash; the Core Trade-off").
<br><br>
The snippet is a stated cost model: an order is ready every 10 &micro;s, a send syscall costs 5 &micro;s plus
0.2 &micro;s per message, and a batch flushes at B messages or after 50 &micro;s. Sending each order alone (B = 1)
makes 20,000 syscalls and spends 104,000 &micro;s of CPU in send, with every order out in 5.2 &micro;s. Batching
by 8 cuts that to 3,999 syscalls and 23,994 &micro;s, while the median latency rises to 36.0 &micro;s and the
p99 to 56.0. Batching buys throughput with latency, and it is also what Nagle's algorithm does to a TCP socket
by default, which is why latency-sensitive order sockets set <code>TCP_NODELAY</code>.
<br><br>
For order entry, send immediately; batch only what is not latency-critical (logs, metrics, analytics). In the
arena this is your send path inside <code>on_book</code>: one order, one frame, out now.
""", r"\text{syscalls} \approx \frac{n}{B},\qquad \text{added latency} \approx \frac{B-1}{2}\cdot\Delta t"),
    ],
    "widget": {
        "type": "tree-diagram",
        "title": "From the wire to on_book: where each format and transport sits",
        "params": {
            "nodes": [
                {"id": "nic", "label": "NIC"},
                {"id": "udp", "label": "UDP multicast (market data)"},
                {"id": "tcp", "label": "TCP (order entry)"},
                {"id": "seq", "label": "sequence check, gap fill"},
                {"id": "frame", "label": "framing: length prefix / SOH / WebSocket"},
                {"id": "bin", "label": "binary ITCH-style: memcpy + bswap"},
                {"id": "fix", "label": "FIX tag=value: scan loop"},
                {"id": "json", "label": "arena JSON: targeted field extract"},
                {"id": "onbook", "label": "on_book / on_fill"},
                {"id": "ser", "label": "serialise: u64toa, no printf"},
                {"id": "send", "label": "send now (TCP_NODELAY)"},
            ],
            "edges": [
                {"from": "nic", "to": "udp"}, {"from": "nic", "to": "tcp"},
                {"from": "udp", "to": "seq"}, {"from": "tcp", "to": "frame"}, {"from": "seq", "to": "bin"},
                {"from": "frame", "to": "fix"}, {"from": "frame", "to": "json"},
                {"from": "bin", "to": "onbook"}, {"from": "fix", "to": "onbook"}, {"from": "json", "to": "onbook"},
                {"from": "onbook", "to": "ser"}, {"from": "ser", "to": "send"},
            ],
        },
    },
    "pitfalls": [
        "Assuming one read() returns one message: TCP delivers bytes, so a framer must keep partial tails between reads.",
        "Casting a pointer into the receive buffer to a struct: misaligned access and strict-aliasing violations. memcpy into the struct instead.",
        "Acting on a book after a sequence gap: until you recover by retransmission or snapshot, your view of liquidity is wrong.",
        "Leaving Nagle's algorithm on an order socket: small writes are held back to be batched, adding latency you did not ask for.",
    ],
    "check": [
        {"q": "What does FIX BodyLength (tag 9) count?",
         "options": ["The whole message including the checksum", "The bytes after the BodyLength field up to, but not including, the 10= checksum field", "The number of fields", "The bytes of the header only"],
         "answer": 1,
         "why": "BodyLength counts from the byte after 9=...<SOH> to the SOH before 10=. It excludes the 8= and 9= fields and the checksum; it is a byte count, not a field count."},
        {"q": "A UDP feed delivers sequence numbers 41, 42, 44. What should the handler do?",
         "options": ["Apply 44 and carry on", "Mark the book stale, request 43 (gap fill or snapshot), and do not trade on the gap", "Drop 44 and wait for 43 forever", "Close the connection"],
         "answer": 1,
         "why": "A missing update means the book may be wrong. The standard recovery is to request a retransmission or rebuild from a snapshot and to stop acting on that symbol until you are consistent again. Blindly applying 44 trades on a wrong book; waiting forever never recovers."},
        {"q": "Why is decoding a fixed-width binary message cheaper than decoding the same message as JSON?",
         "options": ["Binary messages are compressed", "Every field is at a known offset and width, so decoding is a copy and a byte swap rather than scanning and digit conversion", "JSON requires a network round trip", "Binary decoding runs on the NIC"],
         "answer": 1,
         "why": "Fixed layout removes delimiter scanning, digit conversion and content-dependent branches; the snippet's order is 36 bytes against 122 as JSON. It is not compressed, and it is decoded on the CPU like anything else."},
        {"q": "In the batching model, raising the batch size from 1 to 8 cut syscalls roughly fivefold. What did it cost?",
         "options": ["Nothing: fewer syscalls are always better", "Median latency rose from about 5 us to about 36 us", "Messages were dropped", "Throughput fell"],
         "answer": 1,
         "why": "Each order waits for its batch to fill or time out, so median latency rose from 5.2 to 36.0 us and p99 to 56 us. Throughput capacity rose, since less CPU goes to syscalls, and nothing was dropped. For order entry that latency is the wrong trade."},
    ],
})

# ═══ Week 8 · Session 8 ═══
WEEKS.append({
    "n": 8,
    "title": "Session 8 · SIMD, kernel bypass and profiling the tail: more per cycle, the OS out of the way, then measure the truth",
    "topics": [
        "the memory wall, the TLB and prefetching",
        "SIMD: one instruction, many lanes; auto-vectorisation",
        "branch prediction and branchless code",
        "syscalls, busy-polling and interrupts; kernel bypass",
        "CPU pinning, core isolation, NUMA and huge pages",
        "why the mean lies; perf, flame graphs and hardware counters",
        "where the tail comes from: page faults, preemption, allocation, jitter",
        "Lab: the compiler-flag matrix on a frozen kernel, then the tail",
    ],
    "concepts": [
        C("SIMD lanes, and the checksum rule", "w8c1", """
SIMD executes one instruction on several lanes at once: with AVX2, eight floats per add (Deck U8, "SIMD
&mdash; One Instruction, Many Lanes"). The snippet writes the shape the auto-vectoriser wants, portably: eight
independent accumulators over a 65,536-element array, which is exactly what an eight-lane vector register holds.
The dependency chain drops from 65,536 serial adds to 8,192 per lane, so the pipeline has independent work
every cycle.
<br><br>
The printed result is the lab's anchor. The single-chain float sum is 528.715149 and the eight-lane sum is
528.752930: different bits, because floating-point addition is not associative and the lanes add in a different
order. The integer version gives 53,031 both ways, because integer addition is associative. That is why a
compiler will not vectorise a float reduction at <code>-O2</code> or <code>-O3</code> alone: reordering the sum
changes the answer, and it needs <code>-ffast-math</code> or <code>-fassociative-math</code> to be allowed to.
<br><br>
In the lab this is Step 1 "the frozen kernel" and Step 2 "build the matrix": you may not edit the kernel, only
the flags (<code>-O3 -march=native -funroll-loops</code>, then LTO and PGO), and the rule on the slide is that
if a faster build prints a different checksum, the optimisation changed the math and does not count. Try
<code>-ffast-math</code>, watch the checksum move, and write one line on whether you would ship it. Step 3
"prove why" uses <code>perf stat</code> to show fewer instructions and higher instructions per cycle.
"""),
        C("Branches: a predictor model, and when to go branchless", "w8c2", """
A modern core guesses every branch's direction and runs ahead speculatively; a wrong guess discards that work,
roughly 15 to 20 cycles (Deck U2, "The Pipeline &amp; Branch Prediction", returning in Deck U8's "Flame Graphs,
Counters &amp; Cycle Counting"). The snippet is a pure-CPU model of the simplest real predictor, a 2-bit
saturating counter, run on the hot-path test <code>if (x &gt; 0)</code> over 100,000 values.
<br><br>
On random signs it mispredicts 49,926 times, 49.93%: a coin flip it cannot learn, about 749,000 cycles lost under
the stated 15-cycle cost. Sort the same data and it mispredicts 3 times. Data that is 99% positive costs 1,001
mispredicts, one per rare negative. The same values, in a different order, change the cost by four orders of
magnitude. The last line computes the sum of positives three ways, branchy, with the sign bit as a mask
(<code>x &amp; ~(x &gt;&gt; 31)</code>) and as a select, all 24,988,718: branchless code gives the same answer
with nothing to mispredict.
<br><br>
The order of moves matters. First make branches predictable: partition or sort the data, and hoist rare cases
(halts, errors, session events) out of the hot loop. Only then go branchless, and only where a counter shows the
predictor losing, because branchless code adds dependent arithmetic and a well-predicted branch is nearly free.
In the lab the <code>branch-misses</code> line of Step 3's <code>perf stat</code> is this snippet measured.
"""),
        C("Get the OS out of the way: kernel bypass as a cost model", "w8c3", """
On the normal path a packet raises an interrupt, the kernel's network stack processes it, and your thread makes
a syscall to copy it out (Deck U8, "Syscalls, Busy-Poll &amp; Interrupts" and "Kernel Bypass &mdash; Skip the
Stack"). Kernel bypass (DPDK, Solarflare's OpenOnload and ef_vi, and similar) maps the network card's receive
ring into user space: a pinned thread busy-polls it, with no interrupt, no syscall and no copy.
<br><br>
The snippet is a cost model, not a measurement, and every constant is stated: interrupt 2 &micro;s, syscall
1.5 &micro;s, copy 0.4 &micro;s, a 100 ns poll loop, 150 ns of per-packet work, and interrupt coalescing that fires
at 8 packets or 20 &micro;s. Over 12,996 packets in bursts, the kernel path takes 2,666 interrupts and 12,996
syscalls, with a median of 18.40 &micro;s and a p99 of 35.75, dominated by coalescing and per-packet syscalls.
The bypass path takes none, with a median of 0.35 &micro;s and a p99 of 0.75, bounded by queueing within a burst.
<br><br>
The price is on the last line: a busy-polling core runs at 100% even when the market is silent, and it must be
pinned and isolated (next concept) or the scheduler will interrupt it. In the arena you cannot bypass the
kernel, since the wire is WebSocket, but the colocation tier is the same idea bought rather than coded (Deck U8,
"In the Arena &mdash; Code the Microseconds, Buy the Rest").
"""),
        C("Every tail spike has a physical cause", "w8c4", """
A tail spike is not noise; it is a specific event you can name (Deck U8, "Where the Tail Comes From" and
"Jitter &amp; the OS Scheduler"). The snippet builds a synthetic 200,000-tick trace with a 0.9 to 1.2
&micro;s body and injects three stated causes on a deterministic schedule: first-touch page faults on the first
400 ticks, scheduler preemption and core migration, and occasional allocator slow paths. Then it removes them
one at a time, the way the lab's Step 5 "the fix" asks you to.
<br><br>
The baseline has a p99.9 of 13.69 &micro;s and a max of 100.08. Removing hot-path allocation takes the p99.9 to
9.08. Pinning the thread to an isolated core removes preemption and migration: p99.9 6.05, max 6.20. Pre-faulting
memory at startup (touching every page, or locking it) removes the last cause: p99.9 and max both 1.20. The
median never moved from 1.05 &micro;s; every fix was invisible to the p50 and decisive for the tail. The last
line explains huge pages: a 64 MB working set needs 16,384 4 KB pages but only 32 2 MB pages, and a 64-entry TLB
covers 256 KB against 128 MB.
<br><br>
In the lab, Step 4 "the tail" runs <code>tail.cpp</code> three times and reads p50, p99, p99.9 and max; Step 5
names the cause and applies the fix. In the arena the tournament debrief asks the fastest team what its last
tail fix was: you want an allocation or a syscall named out loud.
"""),
        C("Why the mean lies, measured properly: histograms and coordinated omission", "w8c5", """
Measuring the tail needs two tools (Deck U8, "Why the Mean Lies", "perf &mdash; Your First Reach" and "Flame
Graphs, Counters &amp; Cycle Counting"). The first is a histogram that can record every sample on the hot path.
Sorting a growing vector cannot; a log-linear histogram, the HdrHistogram idea, can. Each power of two is split
into 32 sub-buckets, so recording is a count-leading-zeros instruction, a shift and an increment, memory is fixed
(16,384 bytes here, whatever the sample size), and the relative error is bounded. The snippet records 100,000
synthetic latencies: p50 24,015 ns exact against 23,552 in the histogram, p99 27,941 against 27,648, p99.9
1,386,436 against 1,376,256, all within 2%.
<br><br>
The second tool is honesty about what was never sent. A load generator that waits for each reply before sending
the next stops sending during a stall, so a 20 ms stall is recorded as one slow sample: the naive p99 and p99.9
are both 30 &micro;s. Recording the roughly 200 requests that should have been sent during the stall, each with
the delay it would have seen, gives a p99 of 9,800 &micro;s and a p99.9 of 18,900: coordinated omission
corrected.
<br><br>
The course's replay harness avoids the problem by construction: it drives a recorded tape at its own clock and
timestamps against a steady clock, never the wall clock. In the lab these are the numbers Step 4 prints; in the
arena they are the LATENCY tab.
""", r"\text{bucket}(v) = 32\,(\lfloor\log_2 v\rfloor - 4) + \big\lfloor v / 2^{\lfloor\log_2 v\rfloor - 5}\big\rfloor \bmod 32"),
    ],
    "widget": {
        "type": "histogram",
        "title": "A tick-to-trade sample in microseconds: a tight body and a thin, long tail",
        "params": {
            "sampler": "bootstrap",
            "params": {"data": [38, 39, 40, 40, 41, 41, 41, 42, 42, 42, 43, 43, 43, 44, 44, 45, 45, 46, 47, 48,
                                39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 46, 47, 49, 52, 58, 71, 96, 140,
                                40, 41, 42, 42, 43, 44, 45, 210, 38, 39]},
            "bins": 40,
            "overlay": False,
            "n": 5000,
            "seed": 32708,
            "q": 0.01,
        },
    },
    "pitfalls": [
        "Accepting a faster build whose checksum changed: -ffast-math reassociates float sums, and the optimisation changed the answer.",
        "Going branchless before measuring: a well-predicted branch is nearly free, and mask arithmetic can lengthen the dependency chain.",
        "Busy-polling on a core the scheduler also uses: the poll loop gets preempted and the tail comes back worse.",
        "Measuring latency with a closed-loop client and no correction: coordinated omission records a long stall as a single sample.",
    ],
    "check": [
        {"q": "A build with -O3 -march=native -ffast-math is 20% faster than -O3 -march=native, but prints a different checksum. What should you conclude?",
         "options": ["Ship it: 20% is significant", "The flag changed the math, since reassociating float operations changes results, so it does not count until the difference is shown to be acceptable", "The first build was wrong", "Checksums always vary between builds"],
         "answer": 1,
         "why": "-ffast-math lets the compiler reorder floating-point operations, which changes rounding, as the snippet shows with 528.715 against 528.753. A deterministic program's checksum does not vary between correct builds, so the change is caused by the flag, and the lab's rule is that it does not count."},
        {"q": "The same 100,000 values are processed unsorted and then sorted. Why can the sorted pass be several times faster on a branchy loop?",
         "options": ["Sorted data uses less memory", "The branch becomes predictable, so mispredictions drop from about half to a handful", "Sorting enables SIMD automatically", "The compiler removes the branch for sorted data"],
         "answer": 1,
         "why": "The predictor learns a long run of not-taken followed by a long run of taken; the snippet counts 3 mispredictions against 49,926. Memory use is the same, and the compiler cannot know at compile time that the data is sorted."},
        {"q": "What does kernel bypass remove from the receive path, and what does it cost?",
         "options": ["It removes the NIC; it costs nothing", "It removes interrupts, syscalls and copies; it costs a core that busy-polls at 100%", "It removes TCP; it costs reliability", "It removes the cache; it costs memory"],
         "answer": 1,
         "why": "User-space polling of the NIC ring skips the interrupt, the kernel stack, the syscall and the copy. The price is a dedicated, pinned core spinning even when idle, plus a more specialised software stack. The NIC and the caches are still there."},
        {"q": "A closed-loop client sends one request every 100 us, waiting for each reply. The server stalls for 20 ms once. What does naive recording report?",
         "options": ["About 200 slow samples", "One slow sample, so the p99 barely moves", "No samples during the stall, so the stall is invisible in the max", "The correct p99.9"],
         "answer": 1,
         "why": "The client sends nothing while it waits, so only the one in-flight request sees the stall: one sample of 20 ms, with the p99 and p99.9 still at 30 us. The max does show it. Correcting for coordinated omission adds the roughly 200 requests that should have been sent."},
    ],
})

# ═══ Week 9 · Session 9 ═══
WEEKS.append({
    "n": 9,
    "title": "Session 9 · Latency arbitrage, market making at speed and the live HFT tournament",
    "topics": [
        "one name, many venues: the NBBO and picking off a stale quote",
        "the race and smart order routing",
        "two-sided quotes, queue-aware requoting and inventory skew",
        "adverse selection and markouts",
        "the hardware frontier, market fairness and the ethics of speed",
        "the tournament: three live rounds on the full market structure",
        "the composite grade: p50/p99/p99.9, throughput, queue position, fill rate",
        "final-exam logistics (remote, in the exam period)",
    ],
    "concepts": [
        C("One name, many venues: the NBBO and the stale quote", "w9c1", """
When one security trades on several venues, the best bid across all of them and the best offer across all of
them form the national best bid and offer (Deck U9, "One Name, Many Venues" and "The NBBO &amp; Picking Off a
Stale Quote"). A venue whose quote has not yet caught up with a move elsewhere is stale, and if its ask sits
below another venue's bid the consolidated book is crossed: buy on the stale venue, sell on the fresh one.
<br><br>
The snippet builds a synthetic mid with small drift and rare jumps on venue A and lets venue B lag by three
ticks. Over 20,000 ticks the NBBO is crossed on 7,072 of them, which sounds like free money. It is not: the
largest gap is 96.2 bps, a round trip at the arena's 30-bps taker fee costs 60, and only 230 crosses clear the
fee, netting 3,430 bps in total. Most "arbitrage" is smaller than the cost of taking it. The profitable crosses
are the jumps, when a large move has happened on one venue and not yet on the other, and those are exactly the
ticks where every fast bot fires at once.
<br><br>
In the arena, <code>multi_venue</code> goes live in the tournament scenario; Deck U9's session-9 code runs one
client per venue writing a shared touch cache, your Phase 4 shared-memory structure, and takes the stale side
when the NBBO crosses. The tournament debrief calls out the most common failure by name: an arb threshold that
ignores the 30-bps taker fee, so the bot either never trades or trades at a loss.
""", r"\text{take if } \frac{\text{bid}_A - \text{ask}_B}{\text{ask}_B} > 2 f_{\text{taker}}"),
        C("The race: why the tail decides the ticks that matter", "w9c2", """
Two bots running the same strategy finish in the order their messages reach the engine, and a smart order
router is only as good as the latency of the path it picks (Deck U9, "The Race &amp; Smart Order Routing").
The snippet races four bots 50,000 times with stated latency profiles, and on one race in ten, the volatile
ticks, everyone fires at once and each bot's tail probability rises tenfold, the way allocation stalls, lock
contention and queueing all get worse under load.
<br><br>
The bot with the lowest median (18 &micro;s) and a fat tail wins 94.0% of the calm races and only 40.3% of the
volatile ones. The steady, allocation-free bot, with a 25 &micro;s median but a tiny tail, wins 5.9% of the calm
races and 59.3% of the volatile ones. A bot with a lock on its hot path wins almost nothing, and a Python-speed
bot nothing at all. The volatile ticks are where the jumps, the crossed NBBOs and the big fills live, so the
steady bot wins the races worth winning. That is the course's thesis in one table: HFT is won on the tail, not
the mean.
<br><br>
In the arena the tournament scenario turns every flag on at once: multi-venue, futures, the longest auctions,
the scarcest short locates and an order quota of six messages per tick. The one question worth asking at every
desk during the rounds is "show me your message count per tick".
"""),
        C("Queue-aware requoting and inventory skew under a quota", "w9c3", """
A market maker keeps a bid and an ask resting and earns the spread when both fill (Deck U9, "Two-Sided Quotes
&mdash; the Maker" and "Queue-Aware Requoting &amp; Inventory Skew"). Two things decide whether that works at
speed: how often you requote, because each requote of a side is a cancel plus a new order and resets your queue
position, and where you centre the quotes, skewed away from your inventory so fills bring you back toward flat.
<br><br>
The snippet runs 20,000 ticks under the tournament's quota of six messages per tick, with a quote filling once it
has aged to the front of its queue. Requoting both sides every tick sends 79,200 messages, hits the quota 400
times, and gets 0 fills: it resets its own queue position before it can ever reach the front. Requoting a side
only when its price must change sends 16,218 messages, hits the quota 72 times, and gets 573 fills, after an
average of 9.0 ticks in the queue. The skew rule centres the quotes at mid minus 0.002 &times; 100 &times;
inventory ticks, so at an inventory of +5 the quotes sit 1.0 tick below mid.
<br><br>
In the arena the debrief asks the best MM SCORE team how many messages a tick it actually used: almost always
fewer than the quota. The watch-list for the rounds starts with rate-limit rejects piling up, six messages spent
on requotes and nothing left when the shock lands.
""", r"\text{centre} = \text{mid} - \kappa\cdot q,\qquad \text{bid} = \text{centre} - \delta,\ \ \text{ask} = \text{centre} + \delta"),
        C("Adverse selection and markouts", "w9c4", """
A quote that fills instantly, every time, is usually bad news: someone with fresher information is hitting a
price you have not updated yet (Deck U9, "Adverse Selection &amp; Markouts"). The diagnostic is the markout:
for each fill, how far did the mid move afterwards, from your side's point of view? The markout at horizon h is
side &times; (mid[t+h] &minus; fill price), with side +1 for a buy and &minus;1 for a sell. Positive means the
fill was worth having; persistently negative means you are being picked off.
<br><br>
The snippet mixes 1,349 benign fills, which earn half the spread and then see a random walk, with 300 toxic
fills that arrive just before an 8-cent move against the quote. Benign flow marks out at about +1 bps at every
horizon; toxic flow at about &minus;7 bps. Blended at +10 ticks, the book loses 0.47 bps per fill, although only
18.2% of fills were toxic. A maker's edge is small and adverse selection is large, so a minority of informed
fills sinks the whole book.
<br><br>
The responses are to widen, to skew away from the toxic side, or to requote faster so the stale quote never
exists, which brings the course back to latency. In the arena the debrief asks anyone with a negative markout:
who was picking you off, and how would you know? The per-team TCA report shows the same thing in dollars.
""", r"\text{markout}(h) = s\,\big(m_{t+h} - p_{\text{fill}}\big) / p_{\text{fill}} \times 10^4\ \text{bps}"),
        C("The tournament grade is a composite", "w9c5", """
The tournament does not grade the median (Deck U9, "In the Arena &mdash; The HFT Tournament" and "The
Tournament Grade &mdash; a Composite"). It combines tick-to-trade p50/p99/p99.9, with the tail percentiles
weighted most on the LATENCY tab, throughput under load, queue position (how often you sit near the front of
the FIFO) and fill rate (did your fast quotes actually trade). Colocation, which cuts the venue's outbound delay
from 200 ms to 20 ms, decides who lands first. The board is read on each axis separately: p99.9, MM SCORE,
PASSIVE% and OTR.
<br><br>
This is the one Python snippet on the page, because it is table analysis rather than systems code. With
illustrative numbers and illustrative weights (not the official formula), it ranks six teams. Delta has the
fastest median (11 &micro;s) and the highest throughput, but a 900 &micro;s p99.9, and finishes last. Alpha, with
the best p99.9, wins the composite; foxtrot, slower but first in queue position and fill rate, finishes third.
The mean p99.9 across teams is 190 &micro;s against a median of 51: one team's tail drags the mean, the same
lesson as session 1, now applied to a leaderboard. Rank-based scoring keeps a single outlier from dominating.
<br><br>
The pedagogical payload of the night is the observation that the round's best p99.9 and its best MM SCORE are
usually different teams. Fast is necessary and not sufficient. The rounds, the debrief and the TCA report on fees
paid against rebates earned close the course; the final exam follows remotely in the exam period.
"""),
    ],
    "widget": {
        "type": "simulate-paths",
        "title": "The cross-venue price gap as a mean-reverting process: brief dislocations that the fastest bot closes",
        "params": {"model": "ou", "params": {"x0": 0.0, "mu": 0.0, "theta": 6.0, "sigma": 0.4},
                   "n_paths": 12, "seed": 32709, "horizon": 1, "steps": 300},
    },
    "pitfalls": [
        "Setting an arb threshold below the round-trip taker fee: at 30 bps per side, a cross must exceed 60 bps before it pays.",
        "Requoting every tick under a six-message quota: you spend the budget resetting your own queue position and have nothing left when the shock lands.",
        "Racing the queue into the closing auction, which matches at a single clearing price where speed does nothing.",
        "Quoting a new listing mid-session with an equity model; check the listing's asset type before quoting it.",
    ],
    "check": [
        {"q": "Venue B's ask is 100.00 while venue A's bid is 100.40 and taker fees are 30 bps per side. Should you take it?",
         "options": ["Yes: any crossed NBBO is free money", "Yes: the gap of about 40 bps beats one taker fee", "No: the gap of about 40 bps is below the 60-bps round-trip fee", "No: you can never trade on a crossed NBBO"],
         "answer": 2,
         "why": "The gap is 0.40/100.00 = 40 bps, and buying on B and selling on A pays the taker fee twice, 60 bps. It fails the hurdle. A cross is an opportunity only after costs, and the round trip needs both legs, not one."},
        {"q": "Bot X has a 18 us median and a fat tail; bot Y has a 25 us median and almost no tail. Which wins more of the volatile races, and why?",
         "options": ["X, because its median is lower", "Y, because on volatile ticks X's tail fires far more often and Y's stays small", "They tie", "Neither: volatility randomises the order"],
         "answer": 1,
         "why": "When everyone fires at once, stalls and contention multiply, so X's tail probability rises tenfold and it is often slower than Y; in the snippet Y wins 59.3% of volatile races against X's 40.3%. The median decides the calm races, which matter less."},
        {"q": "Your fills show +1 bps markouts on most trades but -7 bps on a minority, and the blended markout is negative. What is happening?",
         "options": ["Nothing: markouts are noise", "Adverse selection: a minority of informed fills outweighs the half-spread earned on the rest", "Your fees are too high", "Your queue position is too good"],
         "answer": 1,
         "why": "A maker earns about half the spread per benign fill and loses the whole move on each informed fill, so 18% toxic flow is enough to turn the book negative. Fees change the level, not the split between benign and toxic, and good queue position increases benign fills."},
        {"q": "Why does the tournament use a composite grade instead of p50 alone?",
         "options": ["p50 is hard to measure", "Speed is necessary but not sufficient: the tail, throughput, queue position and fill rate decide whether fast quotes make money", "To reward Python bots", "Because the mean is more accurate"],
         "answer": 1,
         "why": "A bot can have the best median and still lose the races that matter to its tail, spam messages, or never fill; the composite scores the whole path. p50 is easy to measure, and the course's whole argument is that the mean is the least informative summary of a latency distribution."},
    ],
})


# ─────────────────────────────────────────────────────────────────────────
# Course-level fields.
# ─────────────────────────────────────────────────────────────────────────
SOURCE_NOTE = ("Built from the instructor's own syllabus, lecture decks, labs and speaker guides (Autumn 2026), "
               "with his permission; the code, questions and glossary are this dashboard's own and were "
               "executed before publication.")

DESCRIPTION = (
    "In this course you write a C++ trading bot and compete against the rest of the class on a live exchange, and "
    "the axis you are graded on is latency. Profit and loss is table stakes; speed is the score, and HFT is won on "
    "the tail, not the mean, so the grade is p50, p99 and p99.9 tick-to-trade: the time from market data reaching "
    "your socket to your order leaving it. Each session pairs a C++ and systems-performance lecture with an in-class "
    "lab and an arena scenario that rewards exactly that capability. We start from market microstructure and the "
    "limit order book, then work down the stack: memory, cache lines and ownership; pools, arenas and templates; "
    "compile-time dispatch and a flat, cache-resident order book; atomics and lock-free pipelines; network "
    "protocols and zero-copy parsing; SIMD, kernel bypass and profiling the latency tail. The course closes with "
    "latency arbitrage across venues and a live tournament that scores your whole term at once. You leave with the "
    "programming skills to build, measure and defend a low-latency trading system, which is what trading firms "
    "test for."
)

PREREQUISITES = [
    "Working C++: classes, references and pointers, the standard containers and algorithms, and building a "
    "multi-file project with CMake. Session 2 revisits pointers, constructors and destructors, but it moves fast; "
    "FINM 32600 (Computing for Finance in C++) or equivalent experience is the right preparation.",
    "Comfort at the command line and with git: you clone a starter repository, build it, run tests with make, "
    "and submit work from your own repository every week.",
    "Basic market vocabulary: bid, ask, spread, limit and market orders. Session 1 builds the order book from "
    "scratch, but it helps to have met these terms before (FINM 33500 covers them in depth).",
    "Enough probability to read a distribution by its percentiles rather than its mean; nothing beyond an "
    "introductory course.",
]

TEXTBOOKS = [
    {"title": "Effective Modern C++", "author": "Scott Meyers",
     "note": "Course reading (Deck U1, 'How This Class Works'): move semantics, smart pointers, noexcept and the rules sessions 2 and 3 rely on."},
    {"title": "C++ Concurrency in Action (2nd edition)", "author": "Anthony Williams",
     "note": "Course reading: std::thread, atomics, memory ordering and lock-free structures for sessions 5 and 6."},
    {"title": "Modern C++ Design", "author": "Andrei Alexandrescu",
     "note": "Course reading: policy-based design and the template techniques behind session 4's compile-time dispatch."},
]

SKILLS_BUILT = [
    "low-latency-design", "modern-cpp", "cpp-templates", "lock-free-queues", "parallel-programming",
    "inter-process-communication", "code-profiling", "market-microstructure", "order-book-dynamics",
    "market-making", "market-data-feeds", "order-types", "transaction-costs", "unit-testing",
]
SKILLS_ASSUMED = ["cpp-stl", "git-version-control", "shell-and-filesystem"]

# Proposed in data/new_tags/finm-32700.json; each joins skills_built once it is in the seed.
NEW_TAGS = [
    {"tag": "cache-aware-data-layout", "category": "programming",
     "name": "Designing data for the memory hierarchy: cache lines, padding and alignment, struct-of-arrays, false sharing and flat price-indexed structures"},
    {"tag": "custom-memory-allocators", "category": "programming",
     "name": "Removing the heap from the hot path: fixed-size object pools, arena (bump) allocators, placement new and std::pmr memory resources"},
    {"tag": "atomics-memory-ordering", "category": "programming",
     "name": "std::atomic, compare-and-swap, happens-before and acquire/release ordering; data races, ABA and seqlocks"},
    {"tag": "tail-latency-measurement", "category": "programming",
     "name": "Measuring latency honestly: p50/p99/p99.9 of a sorted sample, log-linear histograms, coordinated omission and tail attribution"},
    {"tag": "binary-protocol-parsing", "category": "data",
     "name": "Wire formats on the hot path: FIX tag=value, fixed-width binary feeds, framing, sequencing and gap fill, zero-copy field extraction"},
    {"tag": "kernel-bypass-networking", "category": "programming",
     "name": "Getting the OS out of the way: busy-polling, kernel bypass, CPU pinning and isolation, huge pages and interrupt coalescing"},
    {"tag": "latency-arbitrage", "category": "trading",
     "name": "Cross-venue trading at speed: the NBBO, stale-quote pickoff, colocation and the fee hurdle that decides whether a cross pays"},
]

BRUSHUP = [
    {"topic": "Pointers, references and object lifetime",
     "why": "Session 2 goes from pointer arithmetic to the rule of five and smart pointers in one evening. If the difference between a pointer, a reference and an owning object is not automatic, the ownership half of that session will feel like syntax instead of design.",
     "resource": "FINM 32600's early weeks, or the first chapters of Effective Modern C++"},
    {"topic": "The standard containers and their costs",
     "why": "Every performance argument in the course compares vector, deque, map and unordered_map by what they do in memory. Know which ones are contiguous and which allocate a node per element before session 2.",
     "resource": "cppreference's container pages: read the complexity and iterator-invalidation notes"},
    {"topic": "Building with CMake and running tests",
     "why": "Lab 1 starts with make test and a CMake build of the C++ client. A broken toolchain costs you the first lab.",
     "resource": "The starter repository's README and the AlgoArena team template: " + TEMPLATE},
    {"topic": "Integer arithmetic, bit operations and powers of two",
     "why": "Ring indices are masked with N - 1, alignment is rounded with a mask, branchless code uses the sign bit, and hash tables use power-of-two capacities. Being fluent with &, |, >> and two's complement saves real time from session 3 on.",
     "resource": "Any systems-programming text's chapter on bit manipulation"},
    {"topic": "Percentiles versus means",
     "why": "The grade is p99.9. Know how to compute a nearest-rank percentile from a sorted sample and why a heavy-tailed distribution's mean describes almost nothing.",
     "resource": "Session 1's latency slides and the FINM HFT skills dashboard: " + HFT_SKILLS},
    {"topic": "The limit order book and price-time priority",
     "why": "Sessions 1, 4 and 9 build on the book: two sorted sides, a FIFO queue per price, and trades at the resting price. Arriving with the vocabulary lets session 1 spend its time on why speed buys queue position.",
     "resource": "FINM 33500's first sessions, or the Low-Latency Trading Arena: " + HFT_ARENA},
    {"topic": "Threads and shared memory, conceptually",
     "why": "Sessions 5 and 6 go straight to data races, atomics and memory ordering. Having written one program with two threads and a mutex makes the step to lock-free code much shorter.",
     "resource": "C++ Concurrency in Action, chapters 1 to 3"},
    {"topic": "How a network packet reaches your program",
     "why": "Session 7 and session 8 assume you can picture the path NIC, kernel, socket buffer, read() and your handler. Ten minutes on sockets and TCP versus UDP pays off twice.",
     "resource": "Any introductory networking text's chapters on sockets and transport protocols"},
]

INTERVIEW = [
    {"level": "screen", "q": "Roughly what does an L1 cache hit cost compared with a miss to main memory, and what does that imply for how you write a hot path?",
     "answer": "An L1 hit is on the order of one nanosecond and a miss to DRAM on the order of a hundred, so one miss costs about as much as a hundred hits. The unit of optimisation is therefore the memory access, not the instruction. I keep hot data contiguous and small so it stays in cache, access it sequentially so the prefetcher can run ahead, split hot fields from cold ones (struct of arrays where it helps), and avoid pointer-chasing containers like std::map or linked lists on the hot path. I also count the lines a structure touches before I trust its Big-O: a linear scan of a shallow, contiguous book routinely beats a tree."},
    {"level": "screen", "q": "Why do trading firms quote latency as p99 or p99.9 rather than as a mean?",
     "answer": "Latency distributions are heavy-tailed and often bimodal: a tight body plus rare stalls from page faults, allocation, lock contention or preemption. The mean lands between the modes and describes almost no real event, and it can hide a tail that is a hundred times the median. The races that make money are the volatile ticks when everyone fires at once, which is exactly when the tail appears, so the tail percentile predicts whether you win. I report p50, p99, p99.9 and max from a sorted sample or a log-linear histogram, and I correct for coordinated omission when the load generator is closed-loop."},
    {"level": "screen", "q": "What is RAII, and why prefer unique_ptr to shared_ptr by default?",
     "answer": "RAII ties a resource to an object's lifetime: acquire it in the constructor, release it in the destructor, and the compiler guarantees the release on every exit path, including exceptions. std::unique_ptr applies it to heap memory with sole ownership; it is move-only and the same size as a raw pointer, so it costs nothing. shared_ptr adds a control block with an atomic reference count, so every copy and destruction is a synchronising read-modify-write on a shared cache line, and cycles leak unless broken with weak_ptr. I use unique_ptr for ownership and pass non-owning references or raw pointers into hot functions."},
    {"level": "screen", "q": "A trade executes when an aggressive order crosses the book. At what price, and who fills first at a given price?",
     "answer": "The trade executes at the resting order's price, not the aggressor's limit, and if the aggressor sweeps several levels each slice prints at its own level, giving a blended average. Priority is price first, then time: a better price always fills first, and at the same price the earlier order fills first, in a strict FIFO queue. That second rule is why latency is valuable. Arriving earlier at a price puts you nearer the front, and a cancel-and-replace loses all the time priority you had accumulated. Market orders never rest; any unfilled remainder is cancelled."},
    {"level": "onsite", "q": "Design a single-producer, single-consumer queue between a socket-reader thread and a strategy thread.",
     "answer": "A bounded ring with a power-of-two capacity, so the slot is the index masked by N minus 1. The producer owns head and the consumer owns tail, and both indices grow forever, so full is head minus tail equal to N and empty is head equal to tail. Push checks for full with an acquire load of tail, writes the slot, then publishes with a release store of head plus one; pop mirrors it. Head and tail are each alignas(64) to avoid false sharing. No CAS and no lock are needed because each index has one writer. I would test it with two real threads, a sequence checksum and ThreadSanitizer."},
    {"level": "onsite", "q": "Your on_book handler allocates on the heap. Why does that matter if the average allocation is fast, and how do you remove it?",
     "answer": "The average is not the problem; the variance is. The allocator may walk a fragmented free list, take a lock or fault in a fresh page, so the same call that takes tens of nanoseconds on a quiet tick takes microseconds on a busy one, and that is the p99.9. I find allocations by counting calls to a replaced operator new on a replay tape, then remove them: reserve containers at startup, use fixed arrays, pool objects with an intrusive free list, put per-tick scratch on a monotonic arena or a pmr buffer with a null upstream, and avoid strings that can outgrow the small-string buffer."},
    {"level": "onsite", "q": "What is false sharing, how would you recognise it, and how do you fix it?",
     "answer": "Two threads write different variables that happen to share one 64-byte cache line. Each write invalidates the other core's copy, so the line ping-pongs through the coherence protocol even though there is no logical sharing. The symptom is a multithreaded version that is slower than the single-threaded one, with nothing contended in the source; hardware counters show heavy coherence traffic. The fix is to give each hot variable its own line with alignas(64), as with the head and tail of an SPSC ring, or better, to keep per-thread state and merge it off the hot path."},
    {"level": "onsite", "q": "Explain acquire/release ordering with an example of publishing data between threads.",
     "answer": "Thread A fills a struct with ordinary stores, then stores a flag with memory_order_release. Thread B loads the flag with memory_order_acquire; if it sees the flag set, every write A made before the release is visible to B after the acquire. That is a happens-before edge, and neither the compiler nor the CPU may move the data writes after the release or the reads before the acquire. Relaxed ordering on the flag would allow B to see the flag before the data. volatile does not help, since it neither makes operations atomic nor orders them across threads. seq_cst is stronger than needed for one-way publication."},
    {"level": "onsite", "q": "How would you represent an order book for a single instrument on the hot path?",
     "answer": "Prices sit on a tick grid, so each side is a flat array indexed by tick minus base tick, covering a band around the reference price, for example plus or minus 5% at one cent, which is about a thousand slots of eight bytes and stays cache-resident. Add is one store, the best price is a cached index, and reading the touch is one load. When the best level empties I scan contiguous slots toward worse prices, which prefetches well. Each level keeps FIFO order so I can compute queue_ahead for my own orders. Orders outside the band are rejected or trigger a re-centre off the hot path, never a resize."},
    {"level": "senior", "q": "Your bot shows a 40 microsecond mean and a 5 millisecond p99.9. Walk me through finding and fixing the tail.",
     "answer": "A hundredfold gap is a stall, not slow arithmetic. First I reproduce it deterministically on a recorded tape with a replay harness, so network noise cannot hide it, and I record every sample in a log-linear histogram. Then I attribute the spikes: correlate them with allocation counts, page-fault counters, context switches and core migrations, and look at perf and flame graphs for the slow ticks. The usual causes are heap allocation, first-touch page faults, lock contention and scheduler preemption. The fixes are pools and reserved containers, pre-faulting or locking memory, lock-free handoffs, and pinning to an isolated core. I accept a fix only if p99.9 moves on the same tape."},
    {"level": "senior", "q": "When is kernel bypass worth it, and what does it cost?",
     "answer": "It is worth it when the network path dominates your budget: interrupt handling, the kernel stack, syscalls and copies can cost several microseconds per packet, and interrupt coalescing adds more. Bypass maps the NIC's rings into user space and a pinned thread busy-polls them, removing all of that. The costs are a dedicated core spinning at 100% even when the market is quiet, core isolation so the scheduler never interrupts it, a specialised stack you must maintain, and less tooling. Before buying it I would A/B it against cheaper steps on the same tape, such as busy-polling sockets, pinning and colocation, since they compete for the same latency budget."},
    {"level": "senior", "q": "You see a crossed NBBO across two venues. How do you decide whether to take it, and what makes this strategy fragile?",
     "answer": "I take it only if the gap exceeds the full round-trip cost: two taker fees, expected slippage if the stale quote is gone before I arrive, and any hedging cost. At 30 bps a side, a cross must clear 60 bps. The strategy is a pure race: the profitable crosses are the big jumps, exactly when every fast participant fires, so my win rate depends on my tail latency on volatile ticks, not my median. It is fragile because the edge shrinks as others colocate, because fees and quotas can erase it, and because a stale-quote pickoff is someone else's adverse selection, which invites wider quotes and raises fairness questions about the value of speed."},
]

REAPPEARS_IN = [
    {"code": "FINM 33500", "how": "Systematic Trading Technologies runs the same AlgoArena exchange in Python. Its matching rules, maker/taker fees, message schemas and order-book microstructure are the ones this course's C++ bot trades against, and its asyncio event loop is the Python cousin of the non-blocking read loop in session 7."},
    {"code": "FINM 32600", "how": "Computing for Finance in C++ is the preparation: the containers, classes and templates it introduces are what sessions 2 to 4 take apart for their memory and latency cost."},
    {"code": "FINM 32950", "how": "High-Performance Numerical Computing for Finance applies the session-8 toolkit, SIMD, cache blocking and profiling, to numerical kernels instead of a trading hot path."},
    {"code": "FINM 33150", "how": "Quantitative Trading Strategies designs the signals; this course asks what it costs to compute them inside a microsecond budget and whether their edge survives fees and adverse selection."},
    {"code": "FINM 34600", "how": "The Analysis of High Frequency Data studies the tick data and microstructure noise that the feeds of session 7 deliver; markouts and the latency distributions of sessions 1 and 8 are high-frequency data in their own right."},
    {"code": "FINM 35100", "how": "Information, Trading, and the Structure of Markets gives the theory behind session 9: informed traders, adverse selection, and why a market maker's quotes must account for who is hitting them."},
    {"code": "FINM 32400", "how": "Software Developer Tools for Finance covers the git, testing and build tooling that every lab here assumes, from make test in Lab 1 to the sanitizer runs of sessions 5 and 6."},
    {"code": "FINM 32800", "how": "Data Pipelines for Quantitative Research handles data at rest; the framing, sequencing, conflation and back-pressure of sessions 6 and 7 are the same pipeline ideas under a microsecond budget."},
]

GLOSSARY = [
    {"term": "Tick-to-trade", "def": "The time from market data arriving at your socket to your order leaving it: parse, decide, serialise, send. The course's graded latency."},
    {"term": "p99.9", "def": "The 99.9th percentile of a latency sample: the value below which 999 of every 1,000 ticks fall. The headline grade, because busy ticks are where stalls land."},
    {"term": "Central limit order book (CLOB)", "def": "Resting buy orders sorted high to low and resting sell orders sorted low to high, matched by one engine under price-time priority."},
    {"term": "Price-time priority", "def": "A better price executes first; at equal price, the earlier order executes first, in a strict FIFO queue per level."},
    {"term": "Queue position (queue_ahead)", "def": "The shares resting ahead of your order at its price. Zero means you are next to fill; a cancel-and-replace sends you to the back."},
    {"term": "Microprice", "def": "Top-of-book prices weighted by the opposite side's size, so fair value leans toward the side about to be exhausted."},
    {"term": "Maker/taker", "def": "A fee schedule in which the aggressive (taker) side pays a fee and the passive (maker) side often earns a rebate, both as a fraction of notional."},
    {"term": "Cache line", "def": "The 64-byte unit in which memory moves between DRAM and the CPU caches. The cost of a scan is the number of lines it touches."},
    {"term": "False sharing", "def": "Two threads writing different variables on the same cache line, forcing the line to bounce between cores. Fixed with alignas(64)."},
    {"term": "Struct of arrays (SoA)", "def": "Storing each field in its own contiguous array instead of an array of structs, so a scan of one field touches only that field's bytes."},
    {"term": "RAII", "def": "Resource Acquisition Is Initialization: tie a resource to an object's lifetime so its destructor releases it on every exit path."},
    {"term": "Object pool", "def": "A pre-allocated set of fixed-size slots with an intrusive free list; alloc and free are O(1) and never touch the heap after startup."},
    {"term": "Arena (bump) allocator", "def": "A buffer and an offset: allocation rounds the offset to the alignment and adds the size; reset frees everything at once."},
    {"term": "Placement new", "def": "Constructing an object in storage you already own, separating construction from allocation; paired with an explicit destructor call."},
    {"term": "CRTP", "def": "The curiously recurring template pattern: a base template calls the derived class's methods through a static cast, giving polymorphism without a vtable."},
    {"term": "Acquire/release", "def": "Memory orderings that create happens-before: writes before a release store are visible after an acquire load that reads it."},
    {"term": "SPSC ring buffer", "def": "A bounded single-producer single-consumer queue in which each index has one writer, so it needs no lock and no compare-and-swap."},
    {"term": "Seqlock", "def": "A single-writer structure in which the writer makes a sequence number odd while writing; readers retry if the number was odd or changed."},
    {"term": "Kernel bypass", "def": "Mapping the network card's rings into user space and busy-polling them, removing interrupts, syscalls and copies from the receive path."},
    {"term": "Coordinated omission", "def": "A measurement error in which a closed-loop load generator stops sending during a stall, so the stall is recorded as one sample instead of many."},
]


def seed_tags():
    """Every tag the shared seed already allows (so EXTRA tags can join automatically)."""
    path = os.path.join(HERE, "data", "skills_seed.js")
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return set(re.findall(r'tag\s*:\s*"([a-z0-9-]+)"', fh.read()))
    except OSError:
        return set()


def build():
    known = seed_tags()
    built = list(SKILLS_BUILT) + [t["tag"] for t in NEW_TAGS if t["tag"] in known and t["tag"] not in SKILLS_BUILT]
    return {
        "code": "FINM 32700",
        "slug": "finm-32700",
        "title": "Low Latency Trading Systems",
        "instructor": "Sebastien Donadio",
        "quarter": "Spring",
        "units": 100,
        "block": "electives",
        "concentrations": ["financial-computing"],
        "source": {
            "page_url": "https://finmath.uchicago.edu/curriculum/degree-concentrations/financial-computing/finm-32700/",
            "syllabus_url": "https://uchicago.box.com/s/6npwocd9tmffsbgddwgaujn9xto2gkbb",
            "fetched": "2026-09-26",
            "note": SOURCE_NOTE,
        },
        "tier": "A",
        "description": DESCRIPTION,
        "prerequisites": PREREQUISITES,
        "textbooks": TEXTBOOKS,
        "skills_built": built,
        "skills_assumed": SKILLS_ASSUMED,
        "brushup": BRUSHUP,
        "weeks": WEEKS,
        "interview": INTERVIEW,
        "reappears_in": REAPPEARS_IN,
        "glossary": GLOSSARY,
    }


HEADER = """/* ==========================================================================
   courses/finm-32700.js -- FINM 32700 . Low Latency Trading Systems

   GENERATED by tools/gen_finm_32700.py -- edit the generator, not this file.
   Tier A: built from the instructor's own course material (design arc,
   speaker guides with every in-class lab step, deck outlines, and the
   published per-session focus list), with his permission. Nine weeks =
   sessions 1-9; the midterm sits in session 5 and session 9 is the live
   latency tournament. Every snippet is C++20 (one Python table analysis in
   week 9), deterministic, and its `output` is real stdout written by
   tools/run_snippets.py.
   ========================================================================== */
"""


def main():
    course = build()
    body = json.dumps(course, indent=2, ensure_ascii=False)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(HEADER)
        fh.write("window.COURSES = window.COURSES || {};\n")
        fh.write('window.COURSES["FINM 32700"] = ')
        fh.write(body)
        fh.write(";\n")
    tags_path = os.path.join(HERE, "data", "new_tags", "finm-32700.json")
    with open(tags_path, "w", encoding="utf-8") as fh:
        json.dump(NEW_TAGS, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    n_con = sum(len(w["concepts"]) for w in WEEKS)
    print("wrote %s: %d weeks, %d concepts, %d MCQs, %d interview, %d glossary"
          % (os.path.relpath(OUT, HERE), len(WEEKS), n_con,
             sum(len(w["check"]) for w in WEEKS), len(INTERVIEW), len(GLOSSARY)))
    print("wrote %s: %d proposed tags" % (os.path.relpath(tags_path, HERE), len(NEW_TAGS)))


if __name__ == "__main__":
    main()
