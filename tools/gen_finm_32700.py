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
