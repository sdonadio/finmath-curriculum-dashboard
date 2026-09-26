"use strict";
/* ═══════════════════════════════════════════════════════════════════════
   FinMath Curriculum Arena — widgets.js
   ONE renderer for every interactive figure on the site. Course files
   (courses/finm-XXXXX.js) never draw anything: a week carries at most a
   plain data object

       widget: { type: "payoff", title: "Bull call spread", params: {…} }

   and app.js hands that object to this file. Nothing here knows about a
   course, an institution or a page.

   ── public API (app.js depends on it, do not change the shape) ─────────
     window.WIDGETS.version            "1"
     window.WIDGETS.types              array of the 13 type ids, SCHEMA order
     window.WIDGETS.has(type)          boolean
     window.WIDGETS.render(host, spec, opts)
                                       clears `host`, appends exactly one
                                       <figure class="widget"> and returns it
     window.WIDGETS.tex(node, s, disp) KaTeX into `node` if KaTeX is loaded,
                                       else <code class="texfall">s</code>

   render() NEVER throws. Unknown type, missing params, ragged matrix, a
   content author's typo — all of it lands in the same readable fallback:
       <figure class="widget"><figcaption class="wcap">…</figcaption>
         <p class="wnote">…what went wrong…</p></figure>
   Nothing in this file writes to the console: a Playwright sweep asserts
   zero console output on every page.

   ── house rules ───────────────────────────────────────────────────────
   * ES5 only. var, function, no arrows, no template literals, no classes.
     The site is static, no build step, and must also open from file://.
   * The platform RNG is never called — not once. Every random number comes
     from lcg(seed) below, so a figure looks the same on every machine and
     in every screenshot.
     Default seed 12345 when params.seed is absent; a "Reseed" button walks
     the seed deterministically (seed = seed*7 + 13).
   * No external library except KaTeX, and KaTeX is OPTIONAL: it is used
     only for `formula` strings and only when window.katex exists.
   * No run-time code construction anywhere — no string is ever turned into
     a function: the slider-formula widget ships its own tokenizer →
     shunting-yard → RPN machine instead.
   * Data text reaches the DOM through textContent / SVG text nodes only.
     No HTML-string sink is ever written to.
   * All SVG is built with createElementNS; every <svg> carries a viewBox,
     role="img" and an aria-label. Widths are never inlined — styles.css
     owns `svg{display:block;max-width:100%;height:auto}`.

   ── markup contract (styles.css owns these class names) ───────────────
     figure.widget[data-wtype]
       figcaption.wcap   title + span.wtype
       div.svgwrap       > svg[viewBox][role=img][aria-label]
       div.wctl          div.ctl (label+input/select) · div.sw (segmented)
                         · button.btn          ← hidden in print
       div.stats         div.stat > div.sl + div.sv[.acc|.ok|.warn|.bad]
       div.legend        span > i[style=background] + text
       p.whelp           one sentence, always present, printed
   Because .wctl does not print, every widget must already say something
   true at its initial parameter values.

   Every generated DOM id is prefixed "w<N>-" from a module counter, so a
   page with ten widgets never collides.

   ── adding a 14th type ────────────────────────────────────────────────
     1. write  function drawThing(c, p) { … }  using the shared helpers
        (c is the instance context: c.canvas/ c.controls/ c.stats/ c.legend/
        c.help/ c.id; p is the params object, already defaulted by you);
     2. add one line to TYPES: `"thing": drawThing`;
     3. add the id to TYPE_ORDER so window.WIDGETS.types stays in SCHEMA
        order;
     4. document the params in SCHEMA.md's widget menu table.
   That is the whole extension point.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {

  /* ───────────────────────── constants ──────────────────────────────── */

  var SVGNS = "http://www.w3.org/2000/svg";
  var W = 660;                       /* logical canvas width, every widget */
  var WCOUNT = 0;                    /* instance counter → unique dom ids   */

  var GRID_INK  = "#666666";         /* axis text / strong rules            */
  var FAINT_INK = "#e6e6e6";         /* interior grid rules                 */
  var AXIS_INK  = "#bdbdbd";         /* zero line / frame                   */
  var LABEL_INK = "#8a8a8a";         /* secondary labels                    */
  var BODY_INK  = "#363636";

  /* fixed 8-colour series palette — chosen to read on the dark theme */
  /* Brand secondary palette as used by the programme site stylesheet,
     full strength so series read on the white canvas */
  var PALETTE = ["#155f83", "#da680d", "#58593f", "#800000",
                 "#357d96", "#8f3931", "#91ab5a", "#f8a429"];
  var POS_INK = "#5f7a2a", NEG_INK = "#8f3931", WARN_INK = "#da680d";

  var DEF_ACCENT = "#800000", DEF_ACCENT2 = "#800000";

  /* ───────────────────── tiny DOM / SVG helpers ─────────────────────── */

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = String(text);
    return e;
  }
  function add(parent, child) { if (parent && child) parent.appendChild(child); return child; }
  function clearNode(n) { while (n && n.firstChild) { n.removeChild(n.firstChild); } return n; }

  function mk(tag, attrs) {
    var e = document.createElementNS(SVGNS, tag), k;
    if (attrs) {
      for (k in attrs) {
        if (attrs.hasOwnProperty(k) && attrs[k] !== null && attrs[k] !== undefined) {
          e.setAttribute(k, attrs[k]);
        }
      }
    }
    return e;
  }
  function svgText(x, y, s, size, fill, anchor, weight) {
    var t = mk("text", {
      x: r1(x), y: r1(y), "font-size": size || 10,
      "font-family": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      fill: fill || LABEL_INK
    });
    if (anchor) { t.setAttribute("text-anchor", anchor); }
    if (weight) { t.setAttribute("font-weight", weight); }
    t.textContent = (s === undefined || s === null) ? "" : String(s);
    return t;
  }
  function r1(v) { return (isFinite(v) ? Math.round(v * 10) / 10 : 0); }

  /* ────────────────────── coercion / formatting ─────────────────────── */

  function num(v, dflt, lo, hi) {
    var x;
    if (typeof v === "number") { x = v; }
    else if (typeof v === "string" && v.replace(/\s+/g, "") !== "") { x = parseFloat(v); }
    else { x = NaN; }
    if (!isFinite(x)) { x = dflt; }
    if (!isFinite(x)) { x = 0; }
    if (lo !== undefined && lo !== null && isFinite(lo) && x < lo) { x = lo; }
    if (hi !== undefined && hi !== null && isFinite(hi) && x > hi) { x = hi; }
    return x;
  }
  function int(v, dflt, lo, hi) { return Math.round(num(v, dflt, lo, hi)); }
  function arr(v) { return (Object.prototype.toString.call(v) === "[object Array]") ? v : []; }
  function str(v, dflt) {
    if (v === undefined || v === null) { return dflt === undefined ? "" : dflt; }
    return String(v);
  }
  function bool(v, dflt) { return (v === undefined || v === null) ? !!dflt : !!v; }
  function numArr(v) {
    var a = arr(v), out = [], i;
    for (i = 0; i < a.length; i++) {
      if (typeof a[i] === "number" ? isFinite(a[i]) : isFinite(parseFloat(a[i]))) {
        out.push(num(a[i], 0));
      }
    }
    return out;
  }
  function has(obj, k) {
    return !!obj && typeof obj === "object" && Object.prototype.hasOwnProperty.call(obj, k);
  }

  /* fmt(x)      → a short human number      fmt(x, 3) → fixed decimals
     a non-finite value always prints the em dash, never "NaN".          */
  function fmt(x, d) {
    if (x === undefined || x === null || !isFinite(x)) { return "—"; }
    if (d !== undefined && d !== null) { return x.toFixed(d); }
    var a = Math.abs(x);
    if (a === 0) { return "0"; }
    if (a >= 1e6) { return (x / 1e6).toFixed(2) + "M"; }
    if (a >= 1e4) { return x.toFixed(0); }
    if (a >= 100) { return x.toFixed(1); }
    if (a >= 1) { return x.toFixed(2); }
    if (a >= 0.01) { return x.toFixed(3); }
    if (a >= 1e-6) { return x.toFixed(6); }
    return x.toExponential(2);
  }
  function pct(x, d) {
    if (!isFinite(x)) { return "—"; }
    return (x * 100).toFixed(d === undefined ? 1 : d) + "%";
  }
  function sgn(x, d) {
    if (!isFinite(x)) { return "—"; }
    return (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d === undefined ? 2 : d);
  }
  function money(x, d) {
    if (!isFinite(x)) { return "—"; }
    return (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(d === undefined ? 2 : d);
  }

  /* ───────────────────────── seeded randomness ──────────────────────── */
  /* The one and only source of randomness in this file — the platform RNG
     is never called, so every figure is byte-identical run to run.        */

  function lcg(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
  }
  function gauss(rnd) {
    var u = rnd();
    if (u < 1e-12) { u = 1e-12; }
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
  }
  function bumpSeed(s) { return ((s * 7 + 13) >>> 0) || 1; }

  /* ───────────────────────── small statistics ───────────────────────── */

  function mean(a) { var s = 0, i; for (i = 0; i < a.length; i++) { s += a[i]; } return a.length ? s / a.length : NaN; }
  function sdev(a) {
    var m = mean(a), s = 0, i;
    if (a.length < 2) { return NaN; }
    for (i = 0; i < a.length; i++) { s += (a[i] - m) * (a[i] - m); }
    return Math.sqrt(s / (a.length - 1));
  }
  function moment(a, k) {
    var m = mean(a), s = 0, i;
    for (i = 0; i < a.length; i++) { s += Math.pow(a[i] - m, k); }
    return a.length ? s / a.length : NaN;
  }
  function skewOf(a) {
    var m2 = moment(a, 2), m3 = moment(a, 3);
    return (m2 > 0) ? m3 / Math.pow(m2, 1.5) : NaN;
  }
  function exKurtOf(a) {
    var m2 = moment(a, 2), m4 = moment(a, 4);
    return (m2 > 0) ? m4 / (m2 * m2) - 3 : NaN;
  }
  function sorted(a) { var b = a.slice(); b.sort(function (x, y) { return x - y; }); return b; }
  function quantile(sortedArr, q) {
    var n = sortedArr.length, pos, lo, hi, f;
    if (!n) { return NaN; }
    pos = (n - 1) * Math.max(0, Math.min(1, q));
    lo = Math.floor(pos); hi = Math.ceil(pos); f = pos - lo;
    return sortedArr[lo] * (1 - f) + sortedArr[hi] * f;
  }
  function minOf(a) { var m = Infinity, i; for (i = 0; i < a.length; i++) { if (a[i] < m) { m = a[i]; } } return m; }
  function maxOf(a) { var m = -Infinity, i; for (i = 0; i < a.length; i++) { if (a[i] > m) { m = a[i]; } } return m; }

  /* erf / normal cdf / normal pdf — Abramowitz & Stegun 7.1.26 */
  function erf(x) {
    var s = x < 0 ? -1 : 1, ax = Math.abs(x), t, y;
    t = 1 / (1 + 0.3275911 * ax);
    y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t
             + 0.254829592) * t * Math.exp(-ax * ax);
    return s * y;
  }
  function ncdf(x) { return 0.5 * (1 + erf(x / Math.SQRT2)); }
  function npdf(x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); }

  /* ─────────────────────── colour handling ──────────────────────────── */

  function cssVar(name, dflt) {
    try {
      var cs = window.getComputedStyle(document.documentElement);
      var v = cs ? cs.getPropertyValue(name) : "";
      v = v ? String(v).replace(/^\s+/, "").replace(/\s+$/, "") : "";
      return v ? v : dflt;
    } catch (e) { return dflt; }
  }
  function accent() { return cssVar("--accent", DEF_ACCENT); }
  function accent2() { return cssVar("--accent-2", DEF_ACCENT2); }

  function hex2rgb(h) {
    var s = String(h).replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(s)) { s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]; }
    if (!/^[0-9a-fA-F]{6}$/.test(s)) { return [88, 166, 255]; }
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }
  function rgb2hex(c) {
    var out = "#", i, t;
    for (i = 0; i < 3; i++) {
      t = Math.max(0, Math.min(255, Math.round(c[i]))).toString(16);
      out += (t.length < 2 ? "0" + t : t);
    }
    return out;
  }
  function mixHex(a, b, t) {
    var ca = hex2rgb(a), cb = hex2rgb(b), i, o = [];
    for (i = 0; i < 3; i++) { o.push(ca[i] + (cb[i] - ca[i]) * Math.max(0, Math.min(1, t))); }
    return rgb2hex(o);
  }
  function rgba(hexc, alpha) {
    var c = hex2rgb(hexc);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + alpha + ")";
  }
  function series(i) { return PALETTE[((i % PALETTE.length) + PALETTE.length) % PALETTE.length]; }

  /* colorScale(t, cmap) — t in [0,1] for "seq"/"mono", in [-1,1] for "div" */
  var RAMPS = {
    seq:  ["#fbf3f3", "#f0d6d6", "#dfa9a9", "#c87070", "#a83a3a", "#800000", "#4d0000"],
    mono: ["#f7f7f7", "#e0e0e0", "#c4c4c4", "#a0a0a0", "#767676", "#4a4a4a", "#222222"],
    div:  ["#8f3931", "#c07a73", "#e6cfcc", "#f2f2f2", "#c9dde6", "#5f9bb3", "#155f83"]
  };
  function colorScale(t, cmap) {
    var ramp = RAMPS[cmap] || RAMPS.seq, u, i, f;
    u = (cmap === "div") ? (num(t, 0, -1, 1) + 1) / 2 : num(t, 0, 0, 1);
    if (!isFinite(u)) { u = 0; }
    u = Math.max(0, Math.min(1, u));
    f = u * (ramp.length - 1);
    i = Math.floor(f);
    if (i >= ramp.length - 1) { return ramp[ramp.length - 1]; }
    return mixHex(ramp[i], ramp[i + 1], f - i);
  }

  /* ─────────────────────── plot geometry helpers ────────────────────── */

  function plot(w, h, l, r, t, b, x0, x1, y0, y1) {
    if (!isFinite(x0) || !isFinite(x1) || x1 <= x0) { x0 = isFinite(x0) ? x0 : 0; x1 = x0 + 1; }
    if (!isFinite(y0) || !isFinite(y1) || y1 <= y0) { y0 = isFinite(y0) ? y0 : 0; y1 = y0 + 1; }
    return { W: w, H: h, l: l, r: r, t: t, b: b, x0: x0, x1: x1, y0: y0, y1: y1,
             iw: w - l - r, ih: h - t - b };
  }
  function padRange(lo, hi, frac) {
    var m;
    if (!isFinite(lo) || !isFinite(hi)) { return [0, 1]; }
    if (hi <= lo) { m = Math.max(1e-6, Math.abs(hi) * 0.1 + 0.5); return [lo - m, hi + m]; }
    m = (hi - lo) * (frac === undefined ? 0.08 : frac);
    return [lo - m, hi + m];
  }
  function xat(p, x) { return p.l + (x - p.x0) / (p.x1 - p.x0) * p.iw; }
  function yat(p, y) { return p.H - p.b - (y - p.y0) / (p.y1 - p.y0) * p.ih; }

  function niceStep(range, n) {
    var raw = range / Math.max(1, n), mag, norm;
    if (!isFinite(raw) || raw <= 0) { return 1; }
    mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    norm = raw / mag;
    if (norm <= 1) { return mag; }
    if (norm <= 2) { return 2 * mag; }
    if (norm <= 2.5) { return 2.5 * mag; }
    if (norm <= 5) { return 5 * mag; }
    return 10 * mag;
  }
  function niceTicks(lo, hi, n) {
    var out = [], s, v, guard = 0;
    if (!isFinite(lo) || !isFinite(hi) || hi <= lo) { return [lo]; }
    s = niceStep(hi - lo, n || 4);
    v = Math.ceil(lo / s - 1e-9) * s;
    while (v <= hi + s * 1e-9 && guard < 400) {
      out.push(Math.abs(v) < s * 1e-9 ? 0 : v);
      v += s; guard++;
    }
    return out.length ? out : [lo, hi];
  }

  /* axes(svg, p, o)
       o.yfmt/o.xfmt   value → label     o.yn/o.xn  tick counts
       o.xticks        explicit x tick values (else niceTicks)
       o.xlabels       explicit labels paired with o.xticks
       o.ylab/o.xlab   axis titles        o.noGrid  rules off, ink only     */
  function axes(svg, p, o) {
    var i, v, yy, xx, ticks, lbl;
    o = o || {};
    ticks = o.yticks || niceTicks(p.y0, p.y1, o.yn || 4);
    for (i = 0; i < ticks.length; i++) {
      v = ticks[i]; yy = yat(p, v);
      if (!isFinite(yy)) { continue; }
      svg.appendChild(mk("line", {
        x1: r1(p.l), y1: r1(yy), x2: r1(p.W - p.r), y2: r1(yy),
        stroke: (Math.abs(v) < 1e-12 ? AXIS_INK : FAINT_INK), "stroke-width": 1
      }));
      svg.appendChild(svgText(p.l - 6, yy + 3.5, (o.yfmt ? o.yfmt(v) : fmt(v)), 9, GRID_INK, "end"));
    }
    if (o.xticks || o.xn) {
      ticks = o.xticks || niceTicks(p.x0, p.x1, o.xn || 5);
      lbl = [];
      for (i = 0; i < ticks.length; i++) {
        xx = xat(p, ticks[i]);
        lbl.push(o.xlabels ? str(o.xlabels[i], "")
                           : (o.xfmt ? o.xfmt(ticks[i]) : fmt(ticks[i])));
        if (!isFinite(xx) || o.noGrid) { continue; }
        svg.appendChild(mk("line", {
          x1: r1(xx), y1: r1(p.t), x2: r1(xx), y2: r1(p.H - p.b),
          stroke: FAINT_INK, "stroke-width": 1
        }));
      }
      xlabels(svg, p, lbl, ticks);
    }
    svg.appendChild(mk("line", {
      x1: r1(p.l), y1: r1(p.H - p.b), x2: r1(p.W - p.r), y2: r1(p.H - p.b),
      stroke: AXIS_INK, "stroke-width": 1
    }));
    if (o.xlab) {
      svg.appendChild(svgText(p.l + p.iw / 2, p.H - 4, o.xlab, 9.5, LABEL_INK, "middle"));
    }
    if (o.ylab) {
      var ty = svgText(0, 0, o.ylab, 9.5, LABEL_INK, "middle");
      ty.setAttribute("x", r1(11));
      ty.setAttribute("y", r1(p.t + p.ih / 2));
      ty.setAttribute("transform", "rotate(-90 11 " + r1(p.t + p.ih / 2) + ")");
      svg.appendChild(ty);
    }
  }

  function pathFor(p, xs, ys) {
    var d = "", i, px, py, started = false;
    for (i = 0; i < ys.length; i++) {
      if (!isFinite(ys[i])) { started = false; continue; }
      px = xat(p, xs ? xs[i] : i); py = yat(p, ys[i]);
      if (!isFinite(px) || !isFinite(py)) { started = false; continue; }
      d += (started ? " L" : "M") + r1(px) + " " + r1(py);
      started = true;
    }
    return d;
  }
  function polyline(svg, p, xs, ys, color, width, dash, opacity) {
    var d = pathFor(p, xs, ys), path;
    if (!d) { return null; }
    path = mk("path", { d: d, fill: "none", stroke: color, "stroke-width": width || 1.7,
                        "stroke-linejoin": "round", "stroke-linecap": "round" });
    if (dash) { path.setAttribute("stroke-dasharray", dash); }
    if (opacity !== undefined && opacity !== null) { path.setAttribute("opacity", opacity); }
    svg.appendChild(path);
    return path;
  }
  function scatter(svg, p, xs, ys, color, rad, opacity) {
    var i, px, py;
    for (i = 0; i < ys.length; i++) {
      if (!isFinite(ys[i])) { continue; }
      px = xat(p, xs ? xs[i] : i); py = yat(p, ys[i]);
      if (!isFinite(px) || !isFinite(py)) { continue; }
      svg.appendChild(mk("circle", { cx: r1(px), cy: r1(py), r: rad || 2.6, fill: color,
                                     opacity: (opacity === undefined ? null : opacity) }));
    }
  }
  function xlabels(svg, p, labels, xs) {
    var i, px;
    for (i = 0; i < labels.length; i++) {
      px = xat(p, xs ? xs[i] : i);
      if (!isFinite(px)) { continue; }
      svg.appendChild(svgText(px, p.H - p.b + 15, labels[i], 9, GRID_INK, "middle"));
    }
  }
  function vrule(svg, p, x, color, dash, width) {
    var px = xat(p, x);
    if (!isFinite(px)) { return null; }
    return svg.appendChild(mk("line", {
      x1: r1(px), y1: r1(p.t), x2: r1(px), y2: r1(p.H - p.b),
      stroke: color, "stroke-width": width || 1.2,
      "stroke-dasharray": dash || null
    }));
  }
  function band(svg, p, xs, lo, hi, color, opacity) {
    var d = "", i, px, py, n = lo.length, any = false;
    for (i = 0; i < n; i++) {
      if (!isFinite(hi[i])) { continue; }
      px = xat(p, xs ? xs[i] : i); py = yat(p, hi[i]);
      d += (any ? " L" : "M") + r1(px) + " " + r1(py); any = true;
    }
    for (i = n - 1; i >= 0; i--) {
      if (!isFinite(lo[i])) { continue; }
      px = xat(p, xs ? xs[i] : i); py = yat(p, lo[i]);
      d += " L" + r1(px) + " " + r1(py);
    }
    if (!any) { return; }
    d += " Z";
    svg.appendChild(mk("path", { d: d, fill: color, opacity: opacity === undefined ? 0.16 : opacity,
                                 stroke: "none" }));
  }
  /* shaded area between a sampled curve and a horizontal baseline, split at
     the crossings so profit and loss can take different colours           */
  function shadeSigned(svg, p, xs, ys, base, colPos, colNeg, opacity) {
    var i, segs = [], cur = null, side, xprev, yprev, xc, t;
    for (i = 0; i < ys.length; i++) {
      side = ys[i] > base ? 1 : (ys[i] < base ? -1 : 0);
      if (cur && cur.side !== side && side !== 0) {
        if (i > 0) {
          xprev = xs[i - 1]; yprev = ys[i - 1];
          t = (base - yprev) / ((ys[i] - yprev) || 1e-12);
          xc = xprev + t * (xs[i] - xprev);
          cur.xs.push(xc); cur.ys.push(base);
        }
        segs.push(cur); cur = null;
      }
      if (side === 0) { continue; }
      if (!cur) {
        cur = { side: side, xs: [], ys: [] };
        if (i > 0) {
          xprev = xs[i - 1]; yprev = ys[i - 1];
          t = (base - yprev) / ((ys[i] - yprev) || 1e-12);
          xc = xprev + t * (xs[i] - xprev);
          if (isFinite(xc)) { cur.xs.push(xc); cur.ys.push(base); }
        }
      }
      cur.xs.push(xs[i]); cur.ys.push(ys[i]);
    }
    if (cur) { segs.push(cur); }
    for (i = 0; i < segs.length; i++) {
      var s = segs[i], d = "", j;
      for (j = 0; j < s.xs.length; j++) {
        d += (j ? " L" : "M") + r1(xat(p, s.xs[j])) + " " + r1(yat(p, s.ys[j]));
      }
      d += " L" + r1(xat(p, s.xs[s.xs.length - 1])) + " " + r1(yat(p, base));
      d += " L" + r1(xat(p, s.xs[0])) + " " + r1(yat(p, base)) + " Z";
      svg.appendChild(mk("path", { d: d, fill: s.side > 0 ? colPos : colNeg,
                                   opacity: opacity === undefined ? 0.17 : opacity, stroke: "none" }));
    }
  }

  /* ──────────────────────── control builders ───────────────────────── */
  /* Every builder returns a DOM node already wired. Handlers are wrapped
     in try/catch by safe(), so a bad param can never surface an exception
     from an event listener.                                              */

  function safe(fn) {
    return function () {
      try { return fn.apply(this, arguments); } catch (e) { return undefined; }
    };
  }

  /* slider(c, o) — o: {key,label,min,max,step,value,fmt,onInput}
     Redraws on "input" (the range event), never on "change".            */
  function slider(c, o) {
    var id = c.id(o.key);
    var wrap = el("div", "ctl");
    var lab = document.createElement("label");
    var val = document.createElement("b");
    var inp = document.createElement("input");
    lab.setAttribute("for", id);
    lab.appendChild(document.createTextNode(str(o.label, o.key) + " "));
    val.id = id + "v";
    lab.appendChild(val);
    inp.type = "range";
    inp.id = id;
    inp.min = String(o.min);
    inp.max = String(o.max);
    inp.step = String(o.step === undefined ? 1 : o.step);
    inp.value = String(o.value);
    inp.setAttribute("aria-label", str(o.label, o.key));
    add(wrap, lab); add(wrap, inp);
    function get() { return num(inp.value, num(o.value, 0)); }
    function show() { val.textContent = o.fmt ? String(o.fmt(get())) : fmt(get()); }
    inp.addEventListener("input", safe(function () {
      show();
      if (o.onInput) { o.onInput(get()); }
    }));
    show();
    return { node: wrap, input: inp, get: get,
             set: function (v) { inp.value = String(v); show(); },
             refresh: show };
  }

  /* segmented(c, o) — o: {label, options:[{v,label}], value, onChange}
     multi:true turns it into independent chips (onChange(value, pressed)) */
  function segmented(c, o) {
    var g = el("div", "sw");
    var opts = arr(o.options), btns = [], i;
    g.setAttribute("role", "group");
    g.setAttribute("aria-label", str(o.label, "options"));
    function press(b, on) { b.setAttribute("aria-pressed", on ? "true" : "false"); }
    function build(op) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = str(op.label, op.v);
      press(b, o.multi ? !!op.on : (op.v === o.value));
      b.addEventListener("click", safe(function () {
        var j;
        if (o.multi) {
          var now = b.getAttribute("aria-pressed") !== "true";
          press(b, now);
          if (o.onChange) { o.onChange(op.v, now); }
        } else {
          for (j = 0; j < btns.length; j++) { press(btns[j], btns[j] === b); }
          if (o.onChange) { o.onChange(op.v); }
        }
      }));
      return b;
    }
    for (i = 0; i < opts.length; i++) { btns.push(add(g, build(opts[i]))); }
    return { node: g, buttons: btns };
  }

  /* selectCtl(c, o) — o: {key,label,options:[{v,label}],value,onChange} */
  function selectCtl(c, o) {
    var id = c.id(o.key);
    var wrap = el("div", "ctl");
    var lab = document.createElement("label");
    var sel = document.createElement("select");
    var opts = arr(o.options), i, op;
    lab.setAttribute("for", id);
    lab.appendChild(document.createTextNode(str(o.label, o.key)));
    sel.id = id;
    sel.setAttribute("aria-label", str(o.label, o.key));
    for (i = 0; i < opts.length; i++) {
      op = document.createElement("option");
      op.value = String(opts[i].v);
      op.textContent = str(opts[i].label, opts[i].v);
      if (String(opts[i].v) === String(o.value)) { op.selected = true; }
      sel.appendChild(op);
    }
    add(wrap, lab); add(wrap, sel);
    sel.addEventListener("change", safe(function () {
      if (o.onChange) { o.onChange(sel.value); }
    }));
    return { node: wrap, select: sel, get: function () { return sel.value; } };
  }

  function button(label, onClick, cls) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls ? ("btn " + cls) : "btn";
    b.textContent = label;
    b.addEventListener("click", safe(function () { if (onClick) { onClick(b); } }));
    return b;
  }

  /* an on/off control: a .btn that carries aria-pressed and the "on" class */
  function toggleBtn(label, on, onChange) {
    var b = button(label, null, on ? "on" : null);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.addEventListener("click", safe(function () {
      var now = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", now ? "true" : "false");
      b.className = now ? "btn on" : "btn";
      if (onChange) { onChange(now); }
    }));
    return b;
  }

  /* statStrip(parent, defs) — the .stats readout strip.
     defs: [{key,label,cls}] → {set(key,text,cls), label(key,text)}      */
  function statStrip(parent, defs) {
    var box = el("div", "stats"), map = {}, i, s, v;
    for (i = 0; i < defs.length; i++) {
      s = el("div", "stat");
      add(s, el("div", "sl", defs[i].label));
      v = el("div", "sv " + str(defs[i].cls, "acc"), "—");
      add(s, v);
      map[defs[i].key] = v;
      add(box, s);
    }
    add(parent, box);
    return {
      node: box,
      set: function (k, text, cls) {
        var n = map[k];
        if (!n) { return; }
        n.textContent = (text === undefined || text === null || text === "") ? "—" : String(text);
        if (cls !== undefined) { n.className = "sv " + (cls || "acc"); }
      },
      label: function (k, text) {
        var n = map[k];
        if (n && n.previousSibling) { n.previousSibling.textContent = String(text); }
      }
    };
  }

  /* ───────────────────────── instance context ──────────────────────── */

  function makeCtx(type, title) {
    WCOUNT++;
    var c = { n: WCOUNT, type: type, title: title };
    var cap;

    c.id = function (suffix) { return "w" + c.n + "-" + String(suffix).replace(/[^A-Za-z0-9_-]+/g, "-"); };

    c.fig = el("figure", "widget");
    c.fig.setAttribute("data-wtype", type);
    cap = el("figcaption", "wcap", title);
    add(cap, el("span", "wtype", type));
    add(c.fig, cap);

    /* canvas(h, desc) → an <svg> inside a .svgwrap, already labelled */
    c.canvas = function (h, desc) {
      var wrap = el("div", "svgwrap");
      var svg = mk("svg", {
        viewBox: "0 0 " + W + " " + h,
        role: "img",
        "aria-label": title + " — " + type + " figure" + (desc ? ": " + desc : "")
      });
      add(wrap, svg); add(c.fig, wrap);
      svg.__wrap = wrap;
      return svg;
    };
    c.resize = function (svg, w, h) {
      svg.setAttribute("viewBox", "0 0 " + Math.round(w) + " " + Math.round(h));
    };

    /* controls() → the single .wctl strip, created on first use */
    c.controls = function () {
      if (!c._ctl) { c._ctl = el("div", "wctl"); add(c.fig, c._ctl); }
      return c._ctl;
    };
    c.ctl = function (node) { add(c.controls(), node); return node; };

    /* stats(defs) → {set(key, text, cls)} over a .stats strip */
    c.stats = function (defs) { return statStrip(c.fig, defs); };

    /* legend(items) — items: [{color, label}] ; returns the node so a
       widget can rebuild it when its series set changes                  */
    c.legend = function (items) {
      var box = el("div", "legend"), i, sp, sw;
      for (i = 0; i < items.length; i++) {
        sp = document.createElement("span");
        sw = document.createElement("i");
        sw.setAttribute("style", "background:" + items[i].color);
        add(sp, sw);
        sp.appendChild(document.createTextNode(" " + str(items[i].label, "")));
        add(box, sp);
      }
      add(c.fig, box);
      return box;
    };
    c.relegend = function (box, items) {
      var i, sp, sw;
      clearNode(box);
      for (i = 0; i < items.length; i++) {
        sp = document.createElement("span");
        sw = document.createElement("i");
        sw.setAttribute("style", "background:" + items[i].color);
        add(sp, sw);
        sp.appendChild(document.createTextNode(" " + str(items[i].label, "")));
        add(box, sp);
      }
    };

    /* help(text) — the printed one-liner; always call it last */
    c.help = function (text) { add(c.fig, el("p", "whelp", text)); };
    c.note = function (text) { add(c.fig, el("p", "wnote", text)); };

    return c;
  }

  /* ─────────────────────── the fallback figure ─────────────────────── */

  function fallback(host, title, type, msg) {
    var f = el("figure", "widget"), cap;
    if (type) { f.setAttribute("data-wtype", String(type)); }
    cap = el("figcaption", "wcap", str(title, "Widget"));
    if (type) { add(cap, el("span", "wtype", String(type))); }
    add(f, cap);
    add(f, el("p", "wnote", msg));
    if (host) { clearNode(host); host.appendChild(f); }
    return f;
  }

  /* ──────────────────────────── KaTeX ──────────────────────────────── */

  function tex(node, texString, displayMode) {
    try {
      if (!node) { return; }
      clearNode(node);
      var s = (texString === undefined || texString === null) ? "" : String(texString);
      if (!s) { return; }
      if (window.katex && window.katex.render) {
        try {
          window.katex.render(s, node, { displayMode: !!displayMode, throwOnError: false });
          return;
        } catch (e) { clearNode(node); }
      }
      node.appendChild(el("code", "texfall", s));
    } catch (e) { /* a formula must never take a page down */ }
  }

  /* ═══════════════════════════════════════════════════════════════════
     1. payoff — terminal payoff / P&L of a book of legs
     params: legs:[{kind:"call"|"put"|"stock"|"bond", strike, qty, premium}],
             range:[lo,hi]          optional: samples
     For a stock leg `premium` is the cost basis (defaults to `strike`);
     for a bond leg `strike` is the face (defaults to 100) and `premium`
     the price paid.
     ═══════════════════════════════════════════════════════════════════ */
  function drawPayoff(c, p) {
    var legsIn = arr(p.legs), legs = [], i, L, refs = [], mid, rng = numArr(p.range);
    var N = int(p.samples, 481, 61, 1401);

    for (i = 0; i < legsIn.length && legs.length < 8; i++) {
      var g = legsIn[i] || {};
      var kind = str(g.kind, "call").toLowerCase();
      if (kind !== "call" && kind !== "put" && kind !== "stock" && kind !== "bond") { kind = "call"; }
      L = { kind: kind,
            strike: num(g.strike, kind === "bond" ? 100 : 100, -1e7, 1e7),
            qty: num(g.qty, 1, -1e5, 1e5) };
      L.face = (kind === "bond") ? (L.strike > 0 ? L.strike : 100) : 0;
      if (has(g, "premium")) { L.premium = num(g.premium, 0, -1e7, 1e7); }
      else if (kind === "stock") { L.premium = L.strike > 0 ? L.strike : 100; }
      else if (kind === "bond") { L.premium = L.face; }
      else { L.premium = 0; }
      L.name = (L.qty >= 0 ? "+" : "−") + Math.abs(L.qty) + " " + kind +
               (kind === "call" || kind === "put" ? " " + fmt(L.strike) : "");
      refs.push(kind === "bond" ? L.face : L.strike);
      legs.push(L);
    }
    if (!legs.length) {
      legs.push({ kind: "call", strike: 100, qty: 1, premium: 5, face: 0, name: "+1 call 100" });
      refs.push(100);
    }
    mid = mean(refs);
    if (!isFinite(mid) || mid <= 0) { mid = 100; }
    var lo = (rng.length > 1 && rng[1] > rng[0]) ? rng[0] : Math.max(0, mid * 0.55);
    var hi = (rng.length > 1 && rng[1] > rng[0]) ? rng[1] : mid * 1.45;

    function gross(L, S) {
      if (L.kind === "call") { return L.qty * Math.max(S - L.strike, 0); }
      if (L.kind === "put") { return L.qty * Math.max(L.strike - S, 0); }
      if (L.kind === "stock") { return L.qty * S; }
      return L.qty * L.face;
    }
    var netPrem = 0;
    for (i = 0; i < legs.length; i++) { netPrem += legs[i].qty * legs[i].premium; }

    var st = { spot: (lo + hi) / 2, showLegs: legs.length > 1, prem: true };
    var svg = c.canvas(320, "payoff at expiry against the underlying price");
    var spotS;

    c.ctl((spotS = slider(c, {
      key: "spot", label: "Spot at expiry", min: lo, max: hi,
      step: Math.max(1e-6, (hi - lo) / 400), value: st.spot,
      fmt: function (v) { return fmt(v); },
      onInput: function (v) { st.spot = v; redraw(); }
    })).node);
    c.ctl(segmented(c, {
      label: "what to draw", value: st.showLegs ? "legs" : "net",
      options: [{ v: "net", label: "Net" }, { v: "legs", label: "Net + legs" }],
      onChange: function (v) { st.showLegs = (v === "legs"); redraw(); }
    }).node);
    c.ctl(toggleBtn("Include premium", st.prem, function (on) { st.prem = on; redraw(); }));

    var S = c.stats([
      { key: "at", label: "P&L at spot" },
      { key: "maxp", label: "Max profit", cls: "ok" },
      { key: "maxl", label: "Max loss", cls: "bad" },
      { key: "be", label: "Breakeven" },
      { key: "prem", label: "Net premium" }
    ]);
    var leg = c.legend([{ color: accent2(), label: "net" }]);

    function redraw() {
      var xs = [], ys = [], i2, j, s, v, curves = [], items = [];
      var pr = st.prem ? 1 : 0;
      for (i2 = 0; i2 < N; i2++) {
        s = lo + (hi - lo) * i2 / (N - 1);
        v = 0;
        for (j = 0; j < legs.length; j++) { v += gross(legs[j], s) - pr * legs[j].qty * legs[j].premium; }
        xs.push(s); ys.push(v);
      }
      if (st.showLegs) {
        for (j = 0; j < legs.length; j++) {
          var cy = [];
          for (i2 = 0; i2 < N; i2++) { cy.push(gross(legs[j], xs[i2]) - pr * legs[j].qty * legs[j].premium); }
          curves.push({ y: cy, color: series(j), name: legs[j].name });
        }
      }
      var ylo = minOf(ys), yhi = maxOf(ys);
      for (j = 0; j < curves.length; j++) {
        ylo = Math.min(ylo, minOf(curves[j].y));
        yhi = Math.max(yhi, maxOf(curves[j].y));
      }
      if (ylo > 0) { ylo = 0; }
      if (yhi < 0) { yhi = 0; }
      var pr2 = padRange(ylo, yhi, 0.12);
      var P = plot(W, 320, 58, 16, 18, 34, lo, hi, pr2[0], pr2[1]);
      clearNode(svg);
      axes(svg, P, { xn: 6, yn: 5, xlab: "underlying at expiry", ylab: st.prem ? "P&L" : "payoff" });
      shadeSigned(svg, P, xs, ys, 0, POS_INK, NEG_INK, 0.15);
      for (j = 0; j < curves.length; j++) {
        polyline(svg, P, xs, curves[j].y, curves[j].color, 1.2, "4 3", 0.75);
      }
      polyline(svg, P, xs, ys, accent2(), 2.2);

      /* breakevens */
      var bes = [];
      for (i2 = 1; i2 < N; i2++) {
        if ((ys[i2 - 1] <= 0 && ys[i2] > 0) || (ys[i2 - 1] >= 0 && ys[i2] < 0)) {
          var t = (0 - ys[i2 - 1]) / ((ys[i2] - ys[i2 - 1]) || 1e-12);
          bes.push(xs[i2 - 1] + t * (xs[i2] - xs[i2 - 1]));
        }
      }
      for (i2 = 0; i2 < bes.length && i2 < 6; i2++) {
        vrule(svg, P, bes[i2], WARN_INK, "3 3", 1);
        svg.appendChild(mk("circle", { cx: r1(xat(P, bes[i2])), cy: r1(yat(P, 0)), r: 3.2,
                                       fill: WARN_INK }));
      }
      /* strikes */
      for (j = 0; j < legs.length; j++) {
        if (legs[j].kind === "call" || legs[j].kind === "put") {
          var xk = xat(P, legs[j].strike);
          if (xk >= P.l && xk <= P.W - P.r) {
            svg.appendChild(mk("line", { x1: r1(xk), y1: r1(P.H - P.b), x2: r1(xk),
                                         y2: r1(P.H - P.b - 6), stroke: GRID_INK, "stroke-width": 1.4 }));
          }
        }
      }
      /* spot marker */
      var sv = 0;
      for (j = 0; j < legs.length; j++) { sv += gross(legs[j], st.spot) - pr * legs[j].qty * legs[j].premium; }
      vrule(svg, P, st.spot, accent(), null, 1.4);
      var cx = xat(P, st.spot), cyv = yat(P, sv);
      if (isFinite(cyv)) {
        svg.appendChild(mk("circle", { cx: r1(cx), cy: r1(cyv), r: 4, fill: accent2(),
                                       stroke: "#ffffff", "stroke-width": 1.4 }));
        svg.appendChild(svgText(Math.min(cx + 7, P.W - P.r - 4), Math.max(cyv - 8, P.t + 10),
                                fmt(st.spot) + " → " + fmt(sv), 9.5, accent2(),
                                cx > P.W - 120 ? "end" : "start", "700"));
      }

      var maxp = maxOf(ys), maxl = minOf(ys), eps = 1e-9;
      /* an extreme only counts as unbounded if the curve is still moving at
         the edge of the plotted range — a capped spread is not unbounded   */
      var upRight = ys[N - 1] - ys[N - 2] > eps, upLeft = ys[0] - ys[1] > eps;
      var dnRight = ys[N - 1] - ys[N - 2] < -eps, dnLeft = ys[0] - ys[1] < -eps;
      var openHi = (Math.abs(maxp - ys[N - 1]) < eps && upRight) || (Math.abs(maxp - ys[0]) < eps && upLeft);
      var openLo = (Math.abs(maxl - ys[N - 1]) < eps && dnRight) || (Math.abs(maxl - ys[0]) < eps && dnLeft);
      S.set("at", fmt(sv), sv >= 0 ? "ok" : "bad");
      S.set("maxp", fmt(maxp) + (openHi ? "*" : ""), "ok");
      S.set("maxl", fmt(maxl) + (openLo ? "*" : ""), "bad");
      if (!bes.length) { S.set("be", "none in range", "warn"); }
      else if (bes.length <= 3) {
        var bl = [];
        for (i2 = 0; i2 < bes.length; i2++) {
          bl.push(Math.abs(bes[i2]) < 1000 ? bes[i2].toFixed(2) : fmt(bes[i2]));
        }
        S.set("be", bl.join(" / "), "warn");
      } else { S.set("be", bes.length + " points", "warn"); }
      S.set("prem", (netPrem >= 0 ? "paid " : "received ") + fmt(Math.abs(netPrem)),
            netPrem >= 0 ? "bad" : "ok");

      items = [{ color: accent2(), label: st.prem ? "net P&L" : "net payoff" }];
      for (j = 0; j < curves.length; j++) { items.push({ color: curves[j].color, label: curves[j].name }); }
      items.push({ color: WARN_INK, label: "breakeven" });
      c.relegend(leg, items);
    }

    c.help("Drag the spot slider to read the payoff at any terminal price; the segmented control adds the individual legs, and “Include premium” switches between payoff at expiry and P&L net of the " + fmt(Math.abs(netPrem)) + " premium. A starred max means the extreme sits at the edge of the plotted range, so it is unbounded.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     2. binomial-tree — CRR lattice, priced in full, drawn to six steps
     params: S0, u, d, r, steps, K, kind   optional: T (years), style
     ═══════════════════════════════════════════════════════════════════ */
  function drawBinomial(c, p) {
    var MAXDRAW = 6;
    var st = {
      S0: num(p.S0, 100, 0.01, 1e6),
      u: num(p.u, 1.15, 1.001, 3),
      d: has(p, "d") ? num(p.d, 0.87, 0.01, 0.999) : 0,
      r: num(p.r, 0.03, -0.2, 0.5),
      steps: int(p.steps, 4, 1, 12),
      K: num(p.K, 100, 0.01, 1e6),
      kind: (str(p.kind, "call").toLowerCase() === "put") ? "put" : "call",
      style: (str(p.style, "european").toLowerCase() === "american") ? "american" : "european",
      show: "option",
      T: num(p.T, 0, 0, 30)
    };
    var dGiven = has(p, "d");
    var svg = c.canvas(340, "recombining binomial lattice of stock and option values");

    function dOf() { return dGiven ? st.d : 1 / st.u; }
    function price() {
      var n = st.steps, dt = (st.T > 0 ? st.T / n : 1), u = st.u, d = dOf();
      var gr = Math.exp(st.r * dt), disc = Math.exp(-st.r * dt);
      var q = (gr - d) / ((u - d) || 1e-12);
      var S = [], V = [], i, j, row, prev, inl, cont;
      for (i = 0; i <= n; i++) {
        row = [];
        for (j = 0; j <= i; j++) { row.push(st.S0 * Math.pow(u, j) * Math.pow(d, i - j)); }
        S.push(row);
      }
      for (i = 0; i <= n; i++) { V.push([]); }
      for (j = 0; j <= n; j++) {
        V[n][j] = st.kind === "call" ? Math.max(S[n][j] - st.K, 0) : Math.max(st.K - S[n][j], 0);
      }
      for (i = n - 1; i >= 0; i--) {
        for (j = 0; j <= i; j++) {
          cont = disc * (q * V[i + 1][j + 1] + (1 - q) * V[i + 1][j]);
          if (st.style === "american") {
            inl = st.kind === "call" ? Math.max(S[i][j] - st.K, 0) : Math.max(st.K - S[i][j], 0);
            cont = Math.max(cont, inl);
          }
          V[i][j] = cont;
        }
      }
      var delta = (V[1] && V[1].length > 1)
        ? (V[1][1] - V[1][0]) / ((S[1][1] - S[1][0]) || 1e-12) : NaN;
      return { S: S, V: V, q: q, delta: delta, dt: dt, d: d, disc: disc };
    }

    c.ctl(slider(c, { key: "steps", label: "Steps", min: 1, max: 12, step: 1, value: st.steps,
                      fmt: function (v) { return String(Math.round(v)); },
                      onInput: function (v) { st.steps = Math.round(v); redraw(); } }).node);
    c.ctl(slider(c, { key: "u", label: "Up factor u", min: 1.01, max: 1.6, step: 0.01, value: st.u,
                      fmt: function (v) { return v.toFixed(2) + " (d " + (dGiven ? st.d : 1 / v).toFixed(3) + ")"; },
                      onInput: function (v) { st.u = v; redraw(); } }).node);
    c.ctl(slider(c, { key: "r", label: "Rate r", min: -0.05, max: 0.25, step: 0.005, value: st.r,
                      fmt: function (v) { return pct(v, 1); },
                      onInput: function (v) { st.r = v; redraw(); } }).node);
    c.ctl(selectCtl(c, { key: "kind", label: "Option", value: st.kind,
                         options: [{ v: "call", label: "Call" }, { v: "put", label: "Put" }],
                         onChange: function (v) { st.kind = v; redraw(); } }).node);
    c.ctl(segmented(c, { label: "exercise style", value: st.style,
                         options: [{ v: "european", label: "European" }, { v: "american", label: "American" }],
                         onChange: function (v) { st.style = v; redraw(); } }).node);
    c.ctl(segmented(c, { label: "node contents", value: st.show,
                         options: [{ v: "stock", label: "Show: stock" }, { v: "option", label: "Show: option" }],
                         onChange: function (v) { st.show = v; redraw(); } }).node);

    var S2 = c.stats([
      { key: "px", label: "Option price" },
      { key: "q", label: "Risk-neutral p" },
      { key: "delta", label: "Delta at root" },
      { key: "ud", label: "u / d" },
      { key: "drawn", label: "Lattice drawn" }
    ]);
    c.legend([{ color: accent2(), label: "node value" },
              { color: POS_INK, label: "in the money at expiry" },
              { color: GRID_INK, label: "branch" }]);

    function redraw() {
      var R = price(), n = st.steps, shown = Math.min(n, MAXDRAW);
      var H = 340, pad = { l: 46, r: 58, t: 26, b: 34 };
      var i, j, x, y, bw = 58, bh = 20;
      clearNode(svg);
      var colw = (W - pad.l - pad.r) / Math.max(1, shown);
      var rowh = (H - pad.t - pad.b) / Math.max(1, shown);

      function nx(i2) { return pad.l + i2 * colw; }
      function ny(i2, j2) { return pad.t + (H - pad.t - pad.b) / 2 - (2 * j2 - i2) * rowh / 2; }

      /* branches first */
      for (i = 0; i < shown; i++) {
        for (j = 0; j <= i; j++) {
          var x0 = nx(i), y0 = ny(i, j);
          var t2;
          for (t2 = 0; t2 < 2; t2++) {
            svg.appendChild(mk("line", {
              x1: r1(x0 + bw / 2 - 12), y1: r1(y0), x2: r1(nx(i + 1) - bw / 2 + 12),
              y2: r1(ny(i + 1, j + t2)), stroke: GRID_INK, "stroke-width": 0.9, opacity: 0.6
            }));
          }
        }
      }
      /* nodes */
      for (i = 0; i <= shown; i++) {
        for (j = 0; j <= i; j++) {
          x = nx(i); y = ny(i, j);
          var sval = R.S[i][j], oval = R.V[i][j];
          var itm = st.kind === "call" ? (sval > st.K) : (sval < st.K);
          var fill = (i === shown && itm) ? rgba(POS_INK, 0.2) : "#efefef";
          var strokec = (i === 0) ? accent2() : (itm && i === shown ? POS_INK : AXIS_INK);
          svg.appendChild(mk("rect", {
            x: r1(x - bw / 2), y: r1(y - bh / 2), width: bw, height: bh, rx: 5,
            fill: fill, stroke: strokec, "stroke-width": i === 0 ? 1.6 : 1
          }));
          svg.appendChild(svgText(x, y + 3.6,
            st.show === "stock" ? fmt(sval) : fmt(oval), 9.5,
            st.show === "stock" ? BODY_INK : accent2(), "middle", "700"));
        }
      }
      for (i = 0; i <= shown; i++) {
        svg.appendChild(svgText(nx(i), H - 12, "t=" + i, 9, GRID_INK, "middle"));
      }
      if (n > shown) {
        svg.appendChild(svgText(W - 24, pad.t + (H - pad.t - pad.b) / 2 + 4, "…", 22, GRID_INK, "middle"));
        svg.appendChild(svgText(W - 24, H - 12, "of " + n, 9, GRID_INK, "middle"));
      }
      svg.appendChild(svgText(pad.l - 30, pad.t - 10,
        (st.show === "stock" ? "stock price" : (st.style === "american" ? "American " : "European ") + st.kind + " value")
        + " · K = " + fmt(st.K), 9.5, GRID_INK, "start"));

      S2.set("px", fmt(R.V[0][0], 4));
      S2.set("q", isFinite(R.q) ? R.q.toFixed(4) : "—",
             (R.q > 0 && R.q < 1) ? "acc" : "bad");
      S2.set("delta", fmt(R.delta, 4));
      S2.set("ud", st.u.toFixed(3) + " / " + R.d.toFixed(3));
      S2.set("drawn", (n > shown ? shown + " of " + n : String(n)) + " steps");
    }

    c.help("Steps, u and r rebuild the lattice and re-price it in full; the option select and the European / American switch change the payoff and the early-exercise test; “Show” swaps the number printed in each node between the stock price and the option value. Only the first six steps are drawn, the price always uses every step. A p outside (0,1) turns red — that parameter set admits arbitrage.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     3. curve — multi-series line chart with a crosshair
     params: series:[{name,x:[],y:[]}], xlab, ylab, log
     ═══════════════════════════════════════════════════════════════════ */
  function drawCurve(c, p) {
    var sin = arr(p.series), ss = [], i, j, xs, ys;
    for (i = 0; i < sin.length && ss.length < 8; i++) {
      var s = sin[i] || {};
      ys = numArr(s.y);
      xs = numArr(s.x);
      if (!ys.length) { continue; }
      if (xs.length !== ys.length) {
        xs = [];
        for (j = 0; j < ys.length; j++) { xs.push(j); }
      }
      ss.push({ name: str(s.name, "series " + (ss.length + 1)), x: xs, y: ys,
                color: str(s.color, series(ss.length)), on: true });
    }
    if (!ss.length) {
      c.note("This curve has no plottable series: each entry of params.series needs a numeric y array.");
      c.help("Nothing to draw yet — the widget expects series:[{name, x:[…], y:[…]}].");
      return;
    }
    var st = { log: bool(p.log, false), cross: 0.5 };
    var xlab = str(p.xlab, "x"), ylab = str(p.ylab, "y");
    var svg = c.canvas(320, "line chart of " + ss.length + " series");

    var gx0 = Infinity, gx1 = -Infinity;
    for (i = 0; i < ss.length; i++) {
      gx0 = Math.min(gx0, minOf(ss[i].x));
      gx1 = Math.max(gx1, maxOf(ss[i].x));
    }
    if (!(gx1 > gx0)) { gx1 = gx0 + 1; }

    var copts = [];
    for (i = 0; i < ss.length; i++) { copts.push({ v: i, label: ss[i].name, on: true }); }
    c.ctl(segmented(c, {
      label: "series visibility", multi: true, options: copts,
      onChange: function (v, on) { ss[v].on = on; redraw(); }
    }).node);
    c.ctl(toggleBtn("Log y", st.log, function (on) { st.log = on; redraw(); }));
    c.ctl(slider(c, {
      key: "cross", label: "Crosshair (" + xlab + ")", min: 0, max: 1, step: 0.002, value: st.cross,
      fmt: function (v) { return fmt(gx0 + (gx1 - gx0) * v); },
      onInput: function (v) { st.cross = v; redraw(); }
    }).node);

    var defs = [{ key: "_x", label: xlab }];
    for (i = 0; i < ss.length; i++) { defs.push({ key: "s" + i, label: ss[i].name }); }
    var S = c.stats(defs.slice(0, 7));
    var leg = c.legend([]);

    function interp(s, x) {
      var k, t;
      if (!s.x.length) { return NaN; }
      if (x <= s.x[0]) { return s.y[0]; }
      if (x >= s.x[s.x.length - 1]) { return s.y[s.y.length - 1]; }
      for (k = 1; k < s.x.length; k++) {
        if (s.x[k] >= x) {
          t = (x - s.x[k - 1]) / ((s.x[k] - s.x[k - 1]) || 1e-12);
          return s.y[k - 1] + t * (s.y[k] - s.y[k - 1]);
        }
      }
      return s.y[s.y.length - 1];
    }

    function redraw() {
      var vis = [], k, lo = Infinity, hi = -Infinity, items = [], usable = true;
      for (k = 0; k < ss.length; k++) { if (ss[k].on) { vis.push(ss[k]); } }
      for (k = 0; k < vis.length; k++) {
        lo = Math.min(lo, minOf(vis[k].y));
        hi = Math.max(hi, maxOf(vis[k].y));
      }
      if (!vis.length) { lo = 0; hi = 1; }
      var useLog = st.log && lo > 0;
      var ylo, yhi, pr;
      if (useLog) {
        ylo = Math.log(lo) / Math.LN10; yhi = Math.log(hi) / Math.LN10;
        pr = padRange(ylo, yhi, 0.08);
      } else {
        pr = padRange(lo, hi, 0.08);
      }
      var P = plot(W, 320, 62, 16, 18, 36, gx0, gx1, pr[0], pr[1]);
      clearNode(svg);
      axes(svg, P, {
        xn: 6, yn: 5, xlab: xlab, ylab: ylab + (useLog ? " (log10)" : ""),
        yfmt: function (v) { return useLog ? fmt(Math.pow(10, v)) : fmt(v); }
      });
      for (k = 0; k < vis.length; k++) {
        var yy = vis[k].y, plotted = [], q;
        if (useLog) {
          plotted = [];
          for (q = 0; q < yy.length; q++) {
            plotted.push(yy[q] > 0 ? Math.log(yy[q]) / Math.LN10 : NaN);
          }
        } else { plotted = yy; }
        polyline(svg, P, vis[k].x, plotted, vis[k].color, 1.9);
        if (vis[k].x.length <= 40) {
          scatter(svg, P, vis[k].x, plotted, vis[k].color, 2.4);
        }
        items.push({ color: vis[k].color, label: vis[k].name });
      }
      if (st.log && !useLog) {
        svg.appendChild(svgText(P.l + 6, P.t + 12,
          "log y needs strictly positive values — showing linear", 9.5, WARN_INK, "start"));
      }
      var xc = gx0 + (gx1 - gx0) * st.cross;
      vrule(svg, P, xc, accent(), "4 3", 1.3);
      S.set("_x", fmt(xc));
      for (k = 0; k < ss.length && k < 6; k++) {
        if (!ss[k].on) { S.set("s" + k, "hidden", "warn"); continue; }
        var v = interp(ss[k], xc);
        S.set("s" + k, fmt(v), "acc");
        var pv = useLog ? (v > 0 ? Math.log(v) / Math.LN10 : NaN) : v;
        if (isFinite(pv)) {
          svg.appendChild(mk("circle", { cx: r1(xat(P, xc)), cy: r1(yat(P, pv)), r: 3.4,
                                         fill: ss[k].color, stroke: "#ffffff", "stroke-width": 1.2 }));
        }
      }
      c.relegend(leg, items.length ? items : [{ color: GRID_INK, label: "all series hidden" }]);
    }

    c.help("Each chip shows or hides one series, “Log y” switches the vertical axis to base-10 logs (only when every visible value is positive), and the crosshair slider sweeps a vertical rule that reads every visible series into the stat strip.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     4. simulate-paths — gbm / ou / heston-lite, every draw from the LCG
     params: model, params:{…}, n_paths, seed, horizon   optional: steps
     ═══════════════════════════════════════════════════════════════════ */
  function drawPaths(c, p) {
    var model = str(p.model, "gbm").toLowerCase();
    if (model !== "gbm" && model !== "ou" && model !== "heston-lite") { model = "gbm"; }
    var mp = (p.params && typeof p.params === "object") ? p.params : {};
    var st = {
      n: int(p.n_paths, 20, 1, 60),
      seed: int(p.seed, 12345, 1, 2147483646),
      hz: num(p.horizon, 1, 0.02, 30),
      steps: int(p.steps, 200, 10, 1000),
      band: true,
      s0: num(mp.s0, 100, 0.01, 1e7),
      mu: num(mp.mu, model === "ou" ? 0 : 0.07, -5, 5),
      sigma: num(mp.sigma, model === "ou" ? 0.3 : 0.2, 0.0001, 5),
      x0: num(mp.x0, 1, -1e5, 1e5),
      theta: num(mp.theta, model === "ou" ? 2 : 1.5, 0.001, 50),
      v0: num(mp.v0, 0.04, 0.0001, 4),
      kappa: num(mp.kappa, 2, 0.01, 50),
      vtheta: num(mp.theta, 0.04, 0.0001, 4),
      xi: num(mp.xi, 0.5, 0.001, 5)
    };
    if (model === "ou") { st.mu = num(mp.mu, 0, -1e5, 1e5); }

    var svg = c.canvas(320, model + " sample paths");
    var vsvg = c.canvas(140, "variance path of the first simulated trajectory");
    vsvg.__wrap.hidden = (model !== "heston-lite");

    function simulate() {
      var rnd = lcg(st.seed), n = st.n, m = st.steps, dt = st.hz / m;
      var paths = [], vpath = [], i, k, x, v, z1, z2, row, vrow;
      for (i = 0; i < n; i++) {
        row = []; vrow = [];
        if (model === "ou") { x = st.x0; } else { x = st.s0; }
        v = st.v0;
        row.push(x); vrow.push(v);
        for (k = 0; k < m; k++) {
          z1 = gauss(rnd);
          if (model === "gbm") {
            x = x * Math.exp((st.mu - 0.5 * st.sigma * st.sigma) * dt + st.sigma * Math.sqrt(dt) * z1);
          } else if (model === "ou") {
            x = x + st.theta * (st.mu - x) * dt + st.sigma * Math.sqrt(dt) * z1;
          } else {
            z2 = gauss(rnd);
            var vp = Math.max(v, 0);
            x = x * Math.exp((st.mu - 0.5 * vp) * dt + Math.sqrt(vp * dt) * z1);
            v = v + st.kappa * (st.vtheta - vp) * dt + st.xi * Math.sqrt(vp * dt) * z2;
            if (v < 0) { v = 0; }
          }
          row.push(x); vrow.push(v);
        }
        paths.push(row);
        if (i === 0) { vpath = vrow; }
      }
      return { paths: paths, vpath: vpath, dt: dt };
    }

    c.ctl(slider(c, { key: "np", label: "Paths", min: 1, max: 60, step: 1, value: st.n,
                      fmt: function (v) { return String(Math.round(v)); },
                      onInput: function (v) { st.n = Math.round(v); redraw(); } }).node);
    if (model === "heston-lite") {
      c.ctl(slider(c, { key: "xi", label: "Vol of vol ξ", min: 0.05, max: 2, step: 0.01, value: st.xi,
                        fmt: function (v) { return v.toFixed(2); },
                        onInput: function (v) { st.xi = v; redraw(); } }).node);
    } else {
      c.ctl(slider(c, { key: "sig", label: "Volatility σ", min: 0.01, max: 1.2, step: 0.01, value: st.sigma,
                        fmt: function (v) { return v.toFixed(2); },
                        onInput: function (v) { st.sigma = v; redraw(); } }).node);
    }
    c.ctl(slider(c, { key: "hz", label: "Horizon", min: 0.1, max: 5, step: 0.1, value: st.hz,
                      fmt: function (v) { return v.toFixed(1) + " y"; },
                      onInput: function (v) { st.hz = v; redraw(); } }).node);
    c.ctl(toggleBtn("Mean ± 1 sd band", st.band, function (on) { st.band = on; redraw(); }));
    c.ctl(button("Reseed →", function () { st.seed = bumpSeed(st.seed); redraw(); }));

    var S = c.stats([
      { key: "m", label: "Terminal mean" },
      { key: "sd", label: "Terminal sd" },
      { key: "q5", label: "5% quantile", cls: "bad" },
      { key: "q95", label: "95% quantile", cls: "ok" },
      { key: "seed", label: "Seed" }
    ]);
    c.legend([{ color: series(0), label: "sample paths" },
              { color: accent2(), label: "cross-sectional mean" },
              { color: rgba(accent2(), 0.5), label: "± 1 sd" }]);

    function redraw() {
      var R = simulate(), n = R.paths.length, m = st.steps, i, k;
      var lo = Infinity, hi = -Infinity;
      for (i = 0; i < n; i++) {
        lo = Math.min(lo, minOf(R.paths[i]));
        hi = Math.max(hi, maxOf(R.paths[i]));
      }
      var pr = padRange(lo, hi, 0.06);
      var P = plot(W, 320, 60, 16, 18, 34, 0, st.hz, pr[0], pr[1]);
      var xs = [];
      for (k = 0; k <= m; k++) { xs.push(k * R.dt); }
      clearNode(svg);
      axes(svg, P, { xn: 5, yn: 5, xlab: "time (years)",
                     ylab: model === "ou" ? "x(t)" : "S(t)",
                     xfmt: function (v) { return v.toFixed(2); } });
      var alpha = n > 30 ? 0.35 : (n > 10 ? 0.5 : 0.85);
      for (i = 0; i < n; i++) {
        polyline(svg, P, xs, R.paths[i], series(i % PALETTE.length), 1.1, null, alpha);
      }
      /* cross-sectional mean and band */
      var mus = [], up = [], dn = [], col;
      for (k = 0; k <= m; k++) {
        col = [];
        for (i = 0; i < n; i++) { col.push(R.paths[i][k]); }
        var mm = mean(col), ssd = n > 1 ? sdev(col) : 0;
        mus.push(mm); up.push(mm + ssd); dn.push(mm - ssd);
      }
      if (st.band && n > 1) { band(svg, P, xs, dn, up, accent2(), 0.14); }
      polyline(svg, P, xs, mus, accent2(), 2);

      var term = [];
      for (i = 0; i < n; i++) { term.push(R.paths[i][m]); }
      var so = sorted(term);
      S.set("m", fmt(mean(term)));
      S.set("sd", n > 1 ? fmt(sdev(term)) : "—");
      S.set("q5", fmt(quantile(so, 0.05)), "bad");
      S.set("q95", fmt(quantile(so, 0.95)), "ok");
      S.set("seed", String(st.seed));

      if (model === "heston-lite") {
        var vp = R.vpath, PV = plot(W, 140, 60, 16, 14, 26, 0, st.hz,
                                    0, Math.max(1e-6, maxOf(vp) * 1.15));
        clearNode(vsvg);
        axes(vsvg, PV, { xn: 5, yn: 3, xlab: "time (years)", ylab: "v(t)",
                         yfmt: function (v) { return v.toFixed(3); },
                         xfmt: function (v) { return v.toFixed(2); } });
        polyline(vsvg, PV, xs, vp, WARN_INK, 1.6);
        vsvg.appendChild(mk("line", { x1: r1(PV.l), y1: r1(yat(PV, st.vtheta)),
                                      x2: r1(PV.W - PV.r), y2: r1(yat(PV, st.vtheta)),
                                      stroke: GRID_INK, "stroke-width": 1, "stroke-dasharray": "4 3" }));
        vsvg.appendChild(svgText(PV.l + 5, PV.t + 11,
          "variance path of path 1 · long-run θ = " + st.vtheta.toFixed(3), 9, GRID_INK, "start"));
      }
    }

    c.help("The paths slider adds or removes trajectories, the "
      + (model === "heston-lite" ? "vol-of-vol" : "volatility")
      + " and horizon sliders change the process, and “Reseed” walks the LCG seed to a different — but still reproducible — draw. Everything on screen comes from seed " + st.seed + ".");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     5. histogram — sampling distributions, tails, VaR and ES
     params: sampler, params:{…}, bins, overlay   optional: n, seed
     ═══════════════════════════════════════════════════════════════════ */
  function drawHistogram(c, p) {
    var sampler = str(p.sampler, "normal").toLowerCase();
    if (sampler !== "normal" && sampler !== "t" && sampler !== "mixture" && sampler !== "bootstrap") {
      sampler = "normal";
    }
    var sp = (p.params && typeof p.params === "object") ? p.params : {};
    var given = numArr(sp.data);
    var st = {
      sampler: sampler,
      bins: int(p.bins, 36, 5, 90),
      n: int(p.n, 2000, 50, 20000),
      overlay: bool(p.overlay, true),
      seed: int(p.seed, 12345, 1, 2147483646),
      q: num(p.q, 0.05, 0.001, 0.5)
    };
    var pr = {
      mu: num(sp.mu, 0, -1e6, 1e6), sigma: num(sp.sigma, 1, 1e-6, 1e6),
      df: int(sp.df, 4, 1, 60),
      pmix: num(sp.p, 0.85, 0, 1),
      mu1: num(sp.mu1, 0, -1e6, 1e6), s1: num(sp.s1, 1, 1e-6, 1e6),
      mu2: num(sp.mu2, -2, -1e6, 1e6), s2: num(sp.s2, 3, 1e-6, 1e6)
    };
    /* bootstrap with no data: a seeded base sample, and the help says so */
    var base = given.slice(), synthBase = false;
    if (sampler === "bootstrap" && base.length < 2) {
      var br = lcg(20240917), bi;
      for (bi = 0; bi < 80; bi++) {
        base.push(br() < 0.88 ? gauss(br) : -2.5 - 2.2 * Math.abs(gauss(br)));
      }
      synthBase = true;
    }

    var svg = c.canvas(320, "sample histogram with a tail marker");

    function draws() {
      var rnd = lcg(st.seed), out = [], i, k, z, ch;
      for (i = 0; i < st.n; i++) {
        if (st.sampler === "normal") {
          out.push(pr.mu + pr.sigma * gauss(rnd));
        } else if (st.sampler === "t") {
          z = gauss(rnd); ch = 0;
          for (k = 0; k < pr.df; k++) { var g2 = gauss(rnd); ch += g2 * g2; }
          out.push(z / Math.sqrt(ch / pr.df));
        } else if (st.sampler === "mixture") {
          out.push(rnd() < pr.pmix ? pr.mu1 + pr.s1 * gauss(rnd) : pr.mu2 + pr.s2 * gauss(rnd));
        } else {
          out.push(base[Math.floor(rnd() * base.length) % base.length]);
        }
      }
      return out;
    }

    c.ctl(selectCtl(c, { key: "samp", label: "Sampler", value: st.sampler,
      options: [{ v: "normal", label: "Normal" }, { v: "t", label: "Student t" },
                { v: "mixture", label: "Two-component mixture" }, { v: "bootstrap", label: "Bootstrap" }],
      onChange: function (v) { st.sampler = v; redraw(); } }).node);
    c.ctl(slider(c, { key: "bins", label: "Bins", min: 5, max: 90, step: 1, value: st.bins,
                      fmt: function (v) { return String(Math.round(v)); },
                      onInput: function (v) { st.bins = Math.round(v); redraw(); } }).node);
    c.ctl(slider(c, { key: "n", label: "Sample size", min: 50, max: 8000, step: 50, value: Math.min(st.n, 8000),
                      fmt: function (v) { return String(Math.round(v)); },
                      onInput: function (v) { st.n = Math.round(v); redraw(); } }).node);
    c.ctl(slider(c, { key: "q", label: "Tail quantile", min: 0.005, max: 0.25, step: 0.005, value: st.q,
                      fmt: function (v) { return pct(v, 1); },
                      onInput: function (v) { st.q = v; redraw(); } }).node);
    c.ctl(toggleBtn("Normal overlay", st.overlay, function (on) { st.overlay = on; redraw(); }));
    c.ctl(button("Reseed →", function () { st.seed = bumpSeed(st.seed); redraw(); }));

    var S = c.stats([
      { key: "mean", label: "Mean" }, { key: "sd", label: "Sd" },
      { key: "skew", label: "Skew" }, { key: "kurt", label: "Excess kurt" },
      { key: "var", label: "VaR", cls: "bad" }, { key: "es", label: "ES", cls: "bad" }
    ]);
    var leg = c.legend([{ color: accent(), label: "sample" },
                        { color: accent2(), label: "matched normal density" },
                        { color: NEG_INK, label: "tail quantile" }]);

    function redraw() {
      var x = draws(), so = sorted(x), i, b;
      var m = mean(x), s = sdev(x);
      var lo = quantile(so, 0.001), hi = quantile(so, 0.999);
      if (!(hi > lo)) { hi = lo + 1; }
      var nb = st.bins, counts = [], wbin = (hi - lo) / nb;
      for (i = 0; i < nb; i++) { counts.push(0); }
      for (i = 0; i < x.length; i++) {
        b = Math.floor((x[i] - lo) / wbin);
        if (b < 0) { b = 0; }
        if (b > nb - 1) { b = nb - 1; }
        counts[b]++;
      }
      var cmax = Math.max(1, maxOf(counts));
      var P = plot(W, 320, 58, 16, 20, 34, lo, hi, 0, cmax * 1.1);
      clearNode(svg);
      axes(svg, P, { xn: 6, yn: 4, xlab: "value", ylab: "count",
                     yfmt: function (v) { return v.toFixed(0); } });
      var bw = P.iw / nb;
      for (i = 0; i < nb; i++) {
        var h = counts[i] / (cmax * 1.1) * P.ih;
        svg.appendChild(mk("rect", {
          x: r1(P.l + i * bw + 0.6), y: r1(P.H - P.b - h),
          width: r1(Math.max(1, bw - 1.2)), height: r1(Math.max(0.5, h)),
          fill: rgba(accent(), 0.62), stroke: rgba(accent2(), 0.35), "stroke-width": 0.6
        }));
      }
      if (st.overlay && isFinite(s) && s > 0) {
        var dx = [], dy = [], k, xv;
        for (k = 0; k <= 160; k++) {
          xv = lo + (hi - lo) * k / 160;
          dx.push(xv);
          dy.push(npdf((xv - m) / s) / s * x.length * wbin);
        }
        polyline(svg, P, dx, dy, accent2(), 1.8, "5 3");
      }
      var vq = quantile(so, st.q), tail = [], es;
      for (i = 0; i < so.length; i++) { if (so[i] <= vq) { tail.push(so[i]); } }
      es = tail.length ? mean(tail) : NaN;
      vrule(svg, P, vq, NEG_INK, "4 3", 1.5);
      svg.appendChild(svgText(Math.max(P.l + 4, xat(P, vq) + 5), P.t + 12,
        "q" + (st.q * 100).toFixed(1) + "% = " + fmt(vq), 9.5, NEG_INK, "start", "700"));
      /* shade the tail region */
      var xl = xat(P, P.x0), xr = xat(P, vq);
      if (xr > xl) {
        svg.appendChild(mk("rect", { x: r1(xl), y: r1(P.t), width: r1(xr - xl), height: r1(P.ih),
                                     fill: rgba(NEG_INK, 0.10) }));
      }
      svg.appendChild(svgText(P.l + 5, P.t + 12 + (xat(P, vq) > P.l + 150 ? 0 : 14),
        st.n + " draws · " + st.sampler + (st.sampler === "bootstrap" ? " of " + base.length + " observations" : ""),
        9, GRID_INK, "start"));

      S.set("mean", fmt(m));
      S.set("sd", fmt(s));
      S.set("skew", fmt(skewOf(x), 3));
      S.set("kurt", fmt(exKurtOf(x), 3), Math.abs(exKurtOf(x)) > 1 ? "warn" : "acc");
      S.set("var", fmt(-vq), "bad");
      S.set("es", fmt(-es), "bad");
      S.label("var", "VaR " + (100 * (1 - st.q)).toFixed(1) + "%");
      S.label("es", "ES " + (100 * (1 - st.q)).toFixed(1) + "%");
    }

    c.help("Pick a sampler, then move bins, sample size and the tail quantile: VaR and ES in the stat strip are the empirical quantile and the mean beyond it, reported as positive losses. “Reseed” redraws from a new deterministic seed."
      + (synthBase ? " No bootstrap data was supplied, so the resampling pool is a seeded 80-observation base sample with a fat left tail." : ""));
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     A SAFE expression machine for the slider-formula widget.
     tokenizer → shunting-yard → RPN runner. No code is ever constructed at
     run time: a malformed expression simply produces NaN and the stat
     shows "—".
     grammar:  + - * / ^  unary minus  ( )  f(a, b)  identifiers, numbers
     ═══════════════════════════════════════════════════════════════════ */

  var PREC  = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "u-": 4, "u+": 4 };
  var RIGHT = { "^": true, "u-": true, "u+": true };

  function signOf(x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }
  var FUNCS = {
    exp:   function (a) { return Math.exp(a[0]); },
    ln:    function (a) { return a[0] > 0 ? Math.log(a[0]) : NaN; },
    log:   function (a) { return a[0] > 0 ? Math.log(a[0]) : NaN; },
    log10: function (a) { return a[0] > 0 ? Math.log(a[0]) / Math.LN10 : NaN; },
    sqrt:  function (a) { return a[0] >= 0 ? Math.sqrt(a[0]) : NaN; },
    abs:   function (a) { return Math.abs(a[0]); },
    min:   function (a) { return Math.min.apply(null, a); },
    max:   function (a) { return Math.max.apply(null, a); },
    pow:   function (a) { return Math.pow(a[0], a.length > 1 ? a[1] : 1); },
    floor: function (a) { return Math.floor(a[0]); },
    ceil:  function (a) { return Math.ceil(a[0]); },
    round: function (a) { return Math.round(a[0]); },
    sin:   function (a) { return Math.sin(a[0]); },
    cos:   function (a) { return Math.cos(a[0]); },
    tan:   function (a) { return Math.tan(a[0]); },
    atan:  function (a) { return Math.atan(a[0]); },
    erf:   function (a) { return erf(a[0]); },
    ncdf:  function (a) { return ncdf(a[0]); },
    npdf:  function (a) { return npdf(a[0]); },
    sign:  function (a) { return signOf(a[0]); }
  };
  var CONSTS = { pi: Math.PI, PI: Math.PI, e: Math.E, E: Math.E };

  function tokenize(src) {
    var s = String(src), out = [], i = 0, j, k, ch;
    while (i < s.length) {
      ch = s.charAt(i);
      if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") { i++; continue; }
      if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(s.charAt(i + 1)))) {
        j = i;
        while (j < s.length && /[0-9.]/.test(s.charAt(j))) { j++; }
        if (j < s.length && (s.charAt(j) === "e" || s.charAt(j) === "E")) {
          k = j + 1;
          if (k < s.length && (s.charAt(k) === "+" || s.charAt(k) === "-")) { k++; }
          if (k < s.length && /[0-9]/.test(s.charAt(k))) {
            j = k;
            while (j < s.length && /[0-9]/.test(s.charAt(j))) { j++; }
          }
        }
        out.push({ t: "num", v: parseFloat(s.slice(i, j)) });
        i = j; continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        j = i;
        while (j < s.length && /[A-Za-z0-9_]/.test(s.charAt(j))) { j++; }
        out.push({ t: "name", v: s.slice(i, j) });
        i = j; continue;
      }
      if ("+-*/^(),".indexOf(ch) >= 0) { out.push({ t: ch }); i++; continue; }
      return null;
    }
    return out;
  }

  function toRpn(tokens) {
    var out = [], ops = [], argc = [], i, tk, prev = null, top, op, unary, f, nargs;
    if (!tokens || !tokens.length) { return null; }
    for (i = 0; i < tokens.length; i++) {
      tk = tokens[i];
      if (tk.t === "num") { out.push(tk); }
      else if (tk.t === "name") {
        if (i + 1 < tokens.length && tokens[i + 1].t === "(") { ops.push({ t: "fn", v: tk.v }); }
        else { out.push({ t: "var", v: tk.v }); }
      } else if (tk.t === ",") {
        while (ops.length && ops[ops.length - 1].t !== "(") { out.push(ops.pop()); }
        if (!ops.length || !argc.length) { return null; }
        argc[argc.length - 1]++;
      } else if (tk.t === "(") {
        argc.push((ops.length && ops[ops.length - 1].t === "fn") ? 1 : 0);
        ops.push({ t: "(" });
      } else if (tk.t === ")") {
        while (ops.length && ops[ops.length - 1].t !== "(") { out.push(ops.pop()); }
        if (!ops.length) { return null; }
        ops.pop();
        nargs = argc.length ? argc.pop() : 0;
        if (ops.length && ops[ops.length - 1].t === "fn") {
          f = ops.pop();
          f.n = nargs > 0 ? nargs : 1;
          out.push(f);
        }
      } else {
        op = tk.t;
        unary = (prev === null || (prev.t !== "num" && prev.t !== "name" && prev.t !== ")"));
        if (unary && (op === "-" || op === "+")) { op = "u" + op; }
        if (!PREC.hasOwnProperty(op)) { return null; }
        while (ops.length) {
          top = ops[ops.length - 1];
          if (top.t === "(" || top.t === "fn") { break; }
          if (PREC[top.t] > PREC[op] || (PREC[top.t] === PREC[op] && !RIGHT[op])) { out.push(ops.pop()); }
          else { break; }
        }
        ops.push({ t: op });
      }
      prev = tk;
    }
    while (ops.length) {
      top = ops.pop();
      if (top.t === "(" || top.t === "fn") { return null; }
      out.push(top);
    }
    return out.length ? out : null;
  }

  function rpnRun(rpn, scope) {
    var stk = [], i, t, a, b, args, k, fn, v;
    if (!rpn) { return NaN; }
    for (i = 0; i < rpn.length; i++) {
      t = rpn[i];
      if (t.t === "num") { stk.push(t.v); }
      else if (t.t === "var") {
        if (CONSTS.hasOwnProperty(t.v)) { stk.push(CONSTS[t.v]); }
        else {
          v = (scope && Object.prototype.hasOwnProperty.call(scope, t.v)) ? scope[t.v] : undefined;
          if (typeof v !== "number" || !isFinite(v)) { return NaN; }
          stk.push(v);
        }
      } else if (t.t === "fn") {
        fn = FUNCS.hasOwnProperty(t.v) ? FUNCS[t.v] : null;
        if (!fn) { return NaN; }
        args = [];
        for (k = 0; k < t.n; k++) {
          if (!stk.length) { return NaN; }
          args.unshift(stk.pop());
        }
        stk.push(fn(args));
      } else if (t.t === "u-") {
        if (!stk.length) { return NaN; }
        stk.push(-stk.pop());
      } else if (t.t === "u+") {
        if (!stk.length) { return NaN; }
      } else {
        if (stk.length < 2) { return NaN; }
        b = stk.pop(); a = stk.pop();
        if (t.t === "+") { stk.push(a + b); }
        else if (t.t === "-") { stk.push(a - b); }
        else if (t.t === "*") { stk.push(a * b); }
        else if (t.t === "/") { stk.push(b === 0 ? NaN : a / b); }
        else if (t.t === "^") { stk.push(Math.pow(a, b)); }
        else { return NaN; }
      }
    }
    if (stk.length !== 1) { return NaN; }
    return isFinite(stk[0]) ? stk[0] : NaN;
  }

  /* compileExpr(src) → function(scope) → number (NaN if anything is wrong) */
  function compileExpr(src) {
    var rpn = null, ok = false;
    try { rpn = toRpn(tokenize(src)); ok = !!rpn; } catch (e) { ok = false; }
    return function (scope) {
      if (!ok) { return NaN; }
      try { return rpnRun(rpn, scope); } catch (e2) { return NaN; }
    };
  }

  /* ═══════════════════════════════════════════════════════════════════
     6. slider-formula — a KaTeX formula, its sliders, and a sensitivity
     params: formula, inputs:[{name,min,max,step,init,label}],
             compute (string) | compute:[{name,expr,label,fmt}]
     ═══════════════════════════════════════════════════════════════════ */
  function valueFmt(v, f) {
    if (!isFinite(v)) { return "—"; }
    if (typeof f === "number") { return v.toFixed(Math.max(0, Math.min(10, Math.round(f)))); }
    if (f === "pct") { return pct(v, 2); }
    if (f === "bps") { return (v * 10000).toFixed(1) + " bp"; }
    if (f === "money") { return money(v); }
    if (f === "int") { return v.toFixed(0); }
    if (typeof f === "string" && /^[0-9]$/.test(f)) { return v.toFixed(parseInt(f, 10)); }
    return fmt(v);
  }

  function drawSliderFormula(c, p) {
    var inputsIn = arr(p.inputs), ins = [], i, stmts = [], cmp = p.compute;

    for (i = 0; i < inputsIn.length && ins.length < 8; i++) {
      var g = inputsIn[i] || {};
      var nm = str(g.name, "").replace(/[^A-Za-z0-9_]/g, "");
      if (!nm || /^[0-9]/.test(nm)) { nm = "x" + (ins.length + 1); }
      var mn = num(g.min, 0, -1e9, 1e9), mx = num(g.max, mn + 1, -1e9, 1e9);
      if (!(mx > mn)) { mx = mn + 1; }
      ins.push({
        name: nm, min: mn, max: mx,
        step: num(g.step, (mx - mn) / 100, 1e-9, mx - mn),
        init: num(g.init, (mn + mx) / 2, mn, mx),
        label: str(g.label, nm)
      });
    }
    if (typeof cmp === "string") {
      stmts.push({ name: "result", expr: cmp, label: "Result", fmt: null });
    } else {
      var ca = arr(cmp);
      for (i = 0; i < ca.length && stmts.length < 6; i++) {
        var s0 = ca[i] || {};
        var sn = str(s0.name, "v" + (i + 1)).replace(/[^A-Za-z0-9_]/g, "");
        if (!sn || /^[0-9]/.test(sn)) { sn = "v" + (i + 1); }
        stmts.push({ name: sn, expr: str(s0.expr, ""), label: str(s0.label, sn),
                     fmt: (s0.fmt === undefined ? null : s0.fmt) });
      }
    }
    if (!stmts.length) {
      c.note("This formula widget has nothing to compute: pass compute as an expression string or as an array of {name, expr, label} statements.");
      c.help("Nothing to compute yet — the widget expects a `compute` expression.");
      return;
    }
    for (i = 0; i < stmts.length; i++) { stmts[i].run = compileExpr(stmts[i].expr); }

    /* formula block sits above the sliders */
    var fdiv = el("div", "formula");
    add(c.fig, fdiv);
    tex(fdiv, str(p.formula, ""), true);

    var svg = c.canvas(260, "sensitivity of the output to the first input");
    var vals = {}, sliders = [];
    for (i = 0; i < ins.length; i++) { vals[ins[i].name] = ins[i].init; }

    function computeAll(over) {
      var scope = {}, k, nme, v;
      for (k in vals) { if (vals.hasOwnProperty(k)) { scope[k] = vals[k]; } }
      if (over) { for (k in over) { if (over.hasOwnProperty(k)) { scope[k] = over[k]; } } }
      var out = [];
      for (k = 0; k < stmts.length; k++) {
        v = stmts[k].run(scope);
        nme = stmts[k].name;
        if (isFinite(v)) { scope[nme] = v; }
        out.push(v);
      }
      return { values: out, scope: scope, primary: out[out.length - 1] };
    }

    (function () {
      var k;
      for (k = 0; k < ins.length; k++) {
        (function (inp) {
          var sl = slider(c, {
            key: "in-" + inp.name, label: inp.label, min: inp.min, max: inp.max,
            step: inp.step, value: inp.init,
            fmt: function (v) { return fmt(v); },
            onInput: function (v) { vals[inp.name] = v; redraw(); }
          });
          sliders.push(sl);
          c.ctl(sl.node);
        }(ins[k]));
      }
      c.ctl(button("Reset inputs", function () {
        var q;
        for (q = 0; q < ins.length; q++) { vals[ins[q].name] = ins[q].init; sliders[q].set(ins[q].init); }
        redraw();
      }));
    }());

    var defs = [], bad = [];
    for (i = 0; i < stmts.length; i++) {
      defs.push({ key: "s" + i, label: stmts[i].label, cls: (i === stmts.length - 1) ? "acc" : "ok" });
      if (!stmts[i].expr) { bad.push(stmts[i].name); }
    }
    var S = c.stats(defs);
    c.legend([{ color: accent2(), label: "output vs " + (ins.length ? ins[0].label : "input") },
              { color: accent(), label: "current value" }]);

    function redraw() {
      var R = computeAll(null), i2, k, xs = [], ys = [], xv, ok = 0;
      for (i2 = 0; i2 < stmts.length; i2++) {
        S.set("s" + i2, valueFmt(R.values[i2], stmts[i2].fmt),
              isFinite(R.values[i2]) ? ((i2 === stmts.length - 1) ? "acc" : "ok") : "bad");
      }
      clearNode(svg);
      if (!ins.length) {
        svg.appendChild(svgText(W / 2, 130, "no sliders declared — the value above is constant",
                                11, GRID_INK, "middle"));
        return;
      }
      var first = ins[0], over = {};
      for (k = 0; k <= 120; k++) {
        xv = first.min + (first.max - first.min) * k / 120;
        over[first.name] = xv;
        var rr = computeAll(over);
        xs.push(xv);
        ys.push(rr.primary);
        if (isFinite(rr.primary)) { ok++; }
      }
      var fin = [];
      for (k = 0; k < ys.length; k++) { if (isFinite(ys[k])) { fin.push(ys[k]); } }
      if (!fin.length) {
        svg.appendChild(svgText(W / 2, 130,
          "the expression did not produce a number over this range", 11, WARN_INK, "middle"));
        return;
      }
      var pr = padRange(minOf(fin), maxOf(fin), 0.1);
      var P = plot(W, 260, 62, 16, 18, 34, first.min, first.max, pr[0], pr[1]);
      axes(svg, P, { xn: 6, yn: 4, xlab: first.label, ylab: stmts[stmts.length - 1].label });
      polyline(svg, P, xs, ys, accent2(), 2);
      var cur = vals[first.name];
      vrule(svg, P, cur, accent(), "4 3", 1.3);
      if (isFinite(R.primary)) {
        svg.appendChild(mk("circle", { cx: r1(xat(P, cur)), cy: r1(yat(P, R.primary)), r: 4.2,
                                       fill: accent2(), stroke: "#ffffff", "stroke-width": 1.4 }));
        svg.appendChild(svgText(Math.min(xat(P, cur) + 8, P.W - P.r - 4),
                                Math.max(yat(P, R.primary) - 9, P.t + 11),
                                valueFmt(R.primary, stmts[stmts.length - 1].fmt), 10, accent2(),
                                xat(P, cur) > P.W - 120 ? "end" : "start", "700"));
      }
      if (ok < 121) {
        svg.appendChild(svgText(P.l + 5, P.t + 12,
          (121 - ok) + " of 121 sweep points are undefined", 9, WARN_INK, "start"));
      }
    }

    c.help("Each slider feeds one named input into the expression; the curve sweeps "
      + (ins.length ? ins[0].label : "the first input")
      + " across its whole range with the other inputs held, and the marker sits at the current setting."
      + (bad.length ? " One computed line has an empty expression, so it reads “—”." : ""));
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     7. orderbook — a seeded limit order book, depth bars and a sweep
     params: levels, spread (ticks), seed   optional: mid, tick, size
     ═══════════════════════════════════════════════════════════════════ */
  function drawOrderbook(c, p) {
    var st = {
      levels: int(p.levels, 8, 2, 16),
      spread: int(p.spread, 2, 1, 40),
      seed: int(p.seed, 12345, 1, 2147483646),
      mid: num(p.mid, 100, 0.01, 1e6),
      tick: num(p.tick, 0.01, 1e-6, 100),
      base: num(p.size, 900, 1, 1e7),
      decay: num(p.decay, 0.18, 0, 2),
      imb: num(p.imbalance, 0, -1, 1),
      sweep: 0
    };
    var svg = c.canvas(300, "limit order book depth with bids left and asks right");

    function book() {
      var rnd = lcg(st.seed), bids = [], asks = [], i, q, px;
      for (i = 0; i < st.levels; i++) {
        px = st.mid - st.spread * st.tick / 2 - i * st.tick;
        q = st.base * Math.exp(-st.decay * i) * (0.55 + 0.9 * rnd()) * (1 + st.imb);
        bids.push({ px: px, qty: Math.max(1, Math.round(q)) });
      }
      for (i = 0; i < st.levels; i++) {
        px = st.mid + st.spread * st.tick / 2 + i * st.tick;
        q = st.base * Math.exp(-st.decay * i) * (0.55 + 0.9 * rnd()) * (1 - st.imb);
        asks.push({ px: px, qty: Math.max(1, Math.round(q)) });
      }
      return { bids: bids, asks: asks };
    }

    var sweepSlider;
    c.ctl(slider(c, { key: "lv", label: "Levels", min: 2, max: 16, step: 1, value: st.levels,
                      fmt: function (v) { return String(Math.round(v)); },
                      onInput: function (v) { st.levels = Math.round(v); redraw(); } }).node);
    c.ctl(slider(c, { key: "sp", label: "Spread", min: 1, max: 20, step: 1, value: st.spread,
                      fmt: function (v) { return Math.round(v) + " tick" + (v > 1 ? "s" : ""); },
                      onInput: function (v) { st.spread = Math.round(v); redraw(); } }).node);
    c.ctl(slider(c, { key: "imb", label: "Imbalance", min: -0.9, max: 0.9, step: 0.05, value: st.imb,
                      fmt: function (v) { return sgn(v, 2); },
                      onInput: function (v) { st.imb = v; redraw(); } }).node);
    sweepSlider = slider(c, { key: "sw", label: "Sweep size", min: 0, max: 100, step: 1, value: 0,
                              fmt: function (v) { return Math.round(v) + "% of ask depth"; },
                              onInput: function (v) { st.sweep = v / 100; redraw(); } });
    c.ctl(sweepSlider.node);
    c.ctl(button("Reseed →", function () { st.seed = bumpSeed(st.seed); redraw(); }));

    var S = c.stats([
      { key: "mid", label: "Mid" }, { key: "spr", label: "Spread" },
      { key: "mic", label: "Microprice" }, { key: "obi", label: "OBI" },
      { key: "vwap", label: "Sweep VWAP" }, { key: "slip", label: "Slippage", cls: "warn" }
    ]);
    c.legend([{ color: POS_INK, label: "bid depth" }, { color: NEG_INK, label: "ask depth" },
              { color: accent2(), label: "cumulative depth" },
              { color: WARN_INK, label: "levels consumed by the sweep" }]);

    function redraw() {
      var B = book(), i, rowH = 20, H = 54 + st.levels * rowH + 26;
      var cxl = W / 2 - 44, cxr = W / 2 + 44, maxBar = cxl - 26;
      clearNode(svg);
      c.resize(svg, W, H);

      var maxQ = 1, cumB = [], cumA = [], sb = 0, sa = 0;
      for (i = 0; i < st.levels; i++) {
        maxQ = Math.max(maxQ, B.bids[i].qty, B.asks[i].qty);
        sb += B.bids[i].qty; cumB.push(sb);
        sa += B.asks[i].qty; cumA.push(sa);
      }
      var maxCum = Math.max(sb, sa, 1);
      var sweepQty = Math.round(st.sweep * sa);

      svg.appendChild(svgText(cxl - 8, 24, "BID SIZE", 9, GRID_INK, "end", "700"));
      svg.appendChild(svgText(W / 2, 24, "PRICE", 9, GRID_INK, "middle", "700"));
      svg.appendChild(svgText(cxr + 8, 24, "ASK SIZE", 9, GRID_INK, "start", "700"));

      var remaining = sweepQty, notional = 0, filled = 0;
      for (i = 0; i < st.levels; i++) {
        var y = 40 + i * rowH, bq = B.bids[i].qty, aq = B.asks[i].qty;
        var wb = bq / maxQ * maxBar, wa = aq / maxQ * maxBar;
        var take = Math.min(remaining, aq);
        if (take > 0) { notional += take * B.asks[i].px; filled += take; remaining -= take; }

        svg.appendChild(mk("rect", { x: r1(cxl - wb), y: r1(y + 2), width: r1(Math.max(1, wb)),
                                     height: rowH - 6, rx: 2, fill: rgba(POS_INK, 0.38),
                                     stroke: rgba(POS_INK, 0.7), "stroke-width": 0.7 }));
        svg.appendChild(mk("rect", { x: r1(cxr), y: r1(y + 2), width: r1(Math.max(1, wa)),
                                     height: rowH - 6, rx: 2,
                                     fill: take > 0 ? rgba(WARN_INK, 0.45) : rgba(NEG_INK, 0.38),
                                     stroke: take > 0 ? WARN_INK : rgba(NEG_INK, 0.7),
                                     "stroke-width": take > 0 ? 1.2 : 0.7 }));
        svg.appendChild(svgText(cxl - 8, y + 13, String(bq), 9.5, LABEL_INK, "end"));
        svg.appendChild(svgText(cxr + 8, y + 13, String(aq), 9.5, LABEL_INK, "start"));
        svg.appendChild(svgText(W / 2 - 6, y + 13, B.bids[i].px.toFixed(2), 9.5, POS_INK, "end"));
        svg.appendChild(svgText(W / 2 + 6, y + 13, B.asks[i].px.toFixed(2), 9.5, NEG_INK, "start"));
      }
      /* cumulative-depth staircases, one per side */
      var db = "", da = "", yy;
      for (i = 0; i < st.levels; i++) {
        yy = 40 + i * rowH;
        var xb = cxl - cumB[i] / maxCum * maxBar, xa = cxr + cumA[i] / maxCum * maxBar;
        db += (i ? " L" : "M") + r1(xb) + " " + r1(yy) + " L" + r1(xb) + " " + r1(yy + rowH);
        da += (i ? " L" : "M") + r1(xa) + " " + r1(yy) + " L" + r1(xa) + " " + r1(yy + rowH);
      }
      svg.appendChild(mk("path", { d: db, fill: "none", stroke: accent2(), "stroke-width": 1.4,
                                   opacity: 0.85 }));
      svg.appendChild(mk("path", { d: da, fill: "none", stroke: accent2(), "stroke-width": 1.4,
                                   opacity: 0.85 }));
      svg.appendChild(mk("line", { x1: r1(W / 2), y1: 30, x2: r1(W / 2), y2: r1(40 + st.levels * rowH),
                                   stroke: AXIS_INK, "stroke-width": 1 }));
      svg.appendChild(svgText(W / 2, H - 10,
        "cumulative depth " + sb + " bid / " + sa + " ask · seed " + st.seed, 9, GRID_INK, "middle"));

      var bb = B.bids[0], ba = B.asks[0];
      var mid = (bb.px + ba.px) / 2;
      var micro = (bb.px * ba.qty + ba.px * bb.qty) / ((bb.qty + ba.qty) || 1);
      var obi = (sb - sa) / ((sb + sa) || 1);
      var vwap = filled > 0 ? notional / filled : NaN;
      S.set("mid", mid.toFixed(3));
      S.set("spr", (ba.px - bb.px).toFixed(3) + " (" + st.spread + "t)");
      S.set("mic", micro.toFixed(3), micro > mid ? "ok" : "bad");
      S.set("obi", sgn(obi, 3), obi > 0 ? "ok" : "bad");
      S.set("vwap", filled > 0 ? vwap.toFixed(3) + " ×" + filled : "—");
      S.set("slip", filled > 0 ? ((vwap / mid - 1) * 10000).toFixed(1) + " bp" : "—", "warn");
    }

    c.help("Levels and spread reshape the book, the imbalance slider tilts size from the ask side to the bid side, and the sweep slider walks a marketable buy through the asks and reports its VWAP and slippage against the mid. Sizes are drawn from seed " + st.seed + ".");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     8. heatmap — matrix + colour bar
     params: matrix:[[…]], xlabels:[], ylabels:[], cmap:"div"|"seq"
     ═══════════════════════════════════════════════════════════════════ */
  function drawHeatmap(c, p) {
    var rowsIn = arr(p.matrix), M = [], i, j, ncol = -1, bad = false;
    for (i = 0; i < rowsIn.length; i++) {
      var row = numArr(rowsIn[i]);
      if (!row.length) { bad = true; break; }
      if (ncol < 0) { ncol = row.length; }
      else if (row.length !== ncol) { bad = true; break; }
      M.push(row);
    }
    if (bad || !M.length || ncol < 1) {
      c.note("This heatmap needs a rectangular numeric matrix: params.matrix must be a non-empty array of equal-length numeric rows.");
      c.help("Nothing to draw — the matrix was empty or ragged.");
      return;
    }
    var nrow = M.length;
    var xl = arr(p.xlabels), yl = arr(p.ylabels);
    var lo = Infinity, hi = -Infinity;
    for (i = 0; i < nrow; i++) {
      lo = Math.min(lo, minOf(M[i]));
      hi = Math.max(hi, maxOf(M[i]));
    }
    var amax = Math.max(Math.abs(lo), Math.abs(hi), 1e-9);
    var cm0 = str(p.cmap, "seq");
    if (cm0 !== "div" && cm0 !== "seq" && cm0 !== "mono") { cm0 = "seq"; }
    var st = { cmap: cm0, vals: (ncol * nrow <= 120), clamp: 1 };

    var svg = c.canvas(300, nrow + " by " + ncol + " matrix as a colour grid");

    c.ctl(selectCtl(c, { key: "cm", label: "Colour map", value: st.cmap,
      options: [{ v: "div", label: "Diverging" }, { v: "seq", label: "Sequential" },
                { v: "mono", label: "Mono" }],
      onChange: function (v) { st.cmap = v; redraw(); } }).node);
    c.ctl(slider(c, { key: "cl", label: "Colour clamp", min: 0.1, max: 1, step: 0.05, value: 1,
                      fmt: function (v) { return "±" + fmt(v * (st.cmap === "div" ? amax : hi)); },
                      onInput: function (v) { st.clamp = v; redraw(); } }).node);
    c.ctl(toggleBtn("Show values", st.vals, function (on) { st.vals = on; redraw(); }));

    var S = c.stats([
      { key: "dim", label: "Shape" }, { key: "min", label: "Min", cls: "bad" },
      { key: "max", label: "Max", cls: "ok" }, { key: "mean", label: "Mean" }
    ]);

    function redraw() {
      var padL = 96, padR = 74, padT = 34, padB = 40;
      var cw = Math.max(10, Math.min(56, (W - padL - padR) / ncol));
      var ch = Math.max(10, Math.min(38, 420 / Math.max(1, nrow)));
      var gw = cw * ncol, gh = ch * nrow;
      var H = padT + gh + padB;
      var i2, j2, v, t, col, all = [];
      clearNode(svg);
      c.resize(svg, W, H);
      var hiC = st.cmap === "div" ? amax * st.clamp : (hi * st.clamp);
      var loC = st.cmap === "div" ? -hiC : lo;
      for (i2 = 0; i2 < nrow; i2++) {
        for (j2 = 0; j2 < ncol; j2++) {
          v = M[i2][j2]; all.push(v);
          if (st.cmap === "div") { t = Math.max(-1, Math.min(1, v / (hiC || 1e-9))); }
          else { t = (hiC > loC) ? (v - loC) / (hiC - loC) : 0.5; }
          col = colorScale(t, st.cmap);
          svg.appendChild(mk("rect", {
            x: r1(padL + j2 * cw), y: r1(padT + i2 * ch), width: r1(cw - 1), height: r1(ch - 1),
            fill: col, stroke: "#ffffff", "stroke-width": 0.5
          }));
          if (st.vals && cw >= 30 && ch >= 15) {
            svg.appendChild(svgText(padL + j2 * cw + cw / 2, padT + i2 * ch + ch / 2 + 3.4,
              Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2), Math.min(9.5, cw / 4),
              "#ffffff", "middle", "700"));
          }
        }
      }
      for (i2 = 0; i2 < nrow; i2++) {
        svg.appendChild(svgText(padL - 7, padT + i2 * ch + ch / 2 + 3.4,
          str(yl[i2], "r" + (i2 + 1)), 9.5, LABEL_INK, "end"));
      }
      for (j2 = 0; j2 < ncol; j2++) {
        svg.appendChild(svgText(padL + j2 * cw + cw / 2, padT + gh + 14,
          str(xl[j2], "c" + (j2 + 1)), 9.5, LABEL_INK, "middle"));
      }
      /* colour bar */
      var bx = padL + gw + 22, bw = 14, bh = Math.max(60, gh), k, seg = 40;
      for (k = 0; k < seg; k++) {
        var tt = 1 - k / (seg - 1);
        svg.appendChild(mk("rect", {
          x: r1(bx), y: r1(padT + k * bh / seg), width: bw, height: r1(bh / seg + 0.6),
          fill: colorScale(st.cmap === "div" ? (tt * 2 - 1) : tt, st.cmap)
        }));
      }
      svg.appendChild(svgText(bx + bw + 5, padT + 8, fmt(st.cmap === "div" ? hiC : hiC), 9, GRID_INK, "start"));
      svg.appendChild(svgText(bx + bw + 5, padT + bh, fmt(st.cmap === "div" ? -hiC : loC), 9, GRID_INK, "start"));
      svg.appendChild(svgText(padL, 20, str(p.title_x, "") || (ncol + " columns × " + nrow + " rows"),
                              9.5, GRID_INK, "start"));

      S.set("dim", nrow + " × " + ncol);
      S.set("min", fmt(lo), "bad");
      S.set("max", fmt(hi), "ok");
      S.set("mean", fmt(mean(all)));
    }

    c.help("The colour-map select swaps between a diverging scale (centred on zero, for correlations and signed greeks), a sequential scale and a neutral mono ramp; the clamp slider saturates the extremes so the middle of the range gets more contrast, and “Show values” prints the number inside each cell.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     9. regression — seeded scatter, OLS fit, residuals, leverage
     params: n, beta, noise, seed, show_resid   optional: alpha
     ═══════════════════════════════════════════════════════════════════ */
  function drawRegression(c, p) {
    var st = {
      n: int(p.n, 80, 5, 400),
      beta: num(p.beta, 1.2, -5, 5),
      noise: num(p.noise, 1, 0, 8),
      seed: int(p.seed, 12345, 1, 2147483646),
      resid: bool(p.show_resid, false),
      alpha: num(p.alpha, 0, -100, 100),
      outlier: false
    };
    var svg = c.canvas(320, "scatter with the fitted least-squares line");

    function sample() {
      var rnd = lcg(st.seed), xs = [], ys = [], i;
      for (i = 0; i < st.n; i++) {
        var x = gauss(rnd);
        xs.push(x);
        ys.push(st.alpha + st.beta * x + st.noise * gauss(rnd));
      }
      if (st.outlier) {
        xs.push(4.2);
        ys.push(st.alpha - 3.2 * st.beta - 4 * Math.max(0.5, st.noise));
      }
      return { x: xs, y: ys };
    }
    function ols(x, y) {
      var n = x.length, mx = mean(x), my = mean(y), sxy = 0, sxx = 0, i, b1, b0, sse = 0, sst = 0, se, t;
      for (i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); }
      b1 = sxx > 0 ? sxy / sxx : NaN;
      b0 = my - b1 * mx;
      for (i = 0; i < n; i++) {
        var r = y[i] - (b0 + b1 * x[i]);
        sse += r * r; sst += (y[i] - my) * (y[i] - my);
      }
      se = (n > 2 && sxx > 0) ? Math.sqrt(sse / (n - 2) / sxx) : NaN;
      t = (se > 0) ? b1 / se : NaN;
      return { b0: b0, b1: b1, se: se, t: t, r2: sst > 0 ? 1 - sse / sst : NaN, n: n };
    }

    c.ctl(slider(c, { key: "n", label: "Observations", min: 5, max: 300, step: 5, value: st.n,
                      fmt: function (v) { return String(Math.round(v)); },
                      onInput: function (v) { st.n = Math.round(v); redraw(); } }).node);
    c.ctl(slider(c, { key: "b", label: "True beta", min: -3, max: 3, step: 0.05, value: st.beta,
                      fmt: function (v) { return v.toFixed(2); },
                      onInput: function (v) { st.beta = v; redraw(); } }).node);
    c.ctl(slider(c, { key: "s", label: "Noise sd", min: 0, max: 4, step: 0.05, value: st.noise,
                      fmt: function (v) { return v.toFixed(2); },
                      onInput: function (v) { st.noise = v; redraw(); } }).node);
    c.ctl(toggleBtn("Residuals", st.resid, function (on) { st.resid = on; redraw(); }));
    c.ctl(toggleBtn("Add an outlier", st.outlier, function (on) { st.outlier = on; redraw(); }));
    c.ctl(button("Reseed →", function () { st.seed = bumpSeed(st.seed); redraw(); }));

    var S = c.stats([
      { key: "bh", label: "Beta-hat" }, { key: "se", label: "Std error" },
      { key: "t", label: "t-stat" }, { key: "r2", label: "R²" },
      { key: "tb", label: "True beta", cls: "ok" }
    ]);
    c.legend([{ color: series(0), label: "observations" },
              { color: accent2(), label: "OLS fit" },
              { color: GRID_INK, label: "true line" },
              { color: NEG_INK, label: "residual" }]);

    function redraw() {
      var D = sample(), F = ols(D.x, D.y), i, H = st.resid ? 400 : 320;
      var xr = padRange(minOf(D.x), maxOf(D.x), 0.08);
      var yr = padRange(minOf(D.y), maxOf(D.y), 0.1);
      var topH = st.resid ? 290 : 320;
      clearNode(svg);
      c.resize(svg, W, H);
      var P = plot(W, topH, 58, 16, 18, 34, xr[0], xr[1], yr[0], yr[1]);
      axes(svg, P, { xn: 6, yn: 5, xlab: "x", ylab: "y" });
      if (st.resid) {
        for (i = 0; i < D.x.length; i++) {
          var yh = F.b0 + F.b1 * D.x[i];
          svg.appendChild(mk("line", { x1: r1(xat(P, D.x[i])), y1: r1(yat(P, D.y[i])),
                                       x2: r1(xat(P, D.x[i])), y2: r1(yat(P, yh)),
                                       stroke: rgba(NEG_INK, 0.55), "stroke-width": 0.9 }));
        }
      }
      var lx = [xr[0], xr[1]];
      polyline(svg, P, lx, [st.alpha + st.beta * xr[0], st.alpha + st.beta * xr[1]],
               GRID_INK, 1.3, "5 4");
      polyline(svg, P, lx, [F.b0 + F.b1 * xr[0], F.b0 + F.b1 * xr[1]], accent2(), 2.2);
      scatter(svg, P, D.x, D.y, series(0), 2.8, 0.85);
      if (st.outlier) {
        var oi = D.x.length - 1;
        svg.appendChild(mk("circle", { cx: r1(xat(P, D.x[oi])), cy: r1(yat(P, D.y[oi])), r: 5.4,
                                       fill: "none", stroke: WARN_INK, "stroke-width": 1.8 }));
        svg.appendChild(svgText(xat(P, D.x[oi]) - 9, yat(P, D.y[oi]) + 3.6, "leverage point",
                                9, WARN_INK, "end", "700"));
      }
      if (st.resid) {
        var res = [], rp;
        for (i = 0; i < D.x.length; i++) { res.push(D.y[i] - (F.b0 + F.b1 * D.x[i])); }
        var rr = padRange(minOf(res), maxOf(res), 0.15);
        rp = plot(W, H, 58, 16, 306, 24, xr[0], xr[1], rr[0], rr[1]);
        axes(svg, rp, { yn: 2, xn: 0, ylab: "resid" });
        for (i = 0; i < D.x.length; i++) {
          svg.appendChild(mk("line", { x1: r1(xat(rp, D.x[i])), y1: r1(yat(rp, 0)),
                                       x2: r1(xat(rp, D.x[i])), y2: r1(yat(rp, res[i])),
                                       stroke: rgba(NEG_INK, 0.5), "stroke-width": 0.9 }));
        }
        scatter(svg, rp, D.x, res, NEG_INK, 2.1, 0.9);
      }

      S.set("bh", fmt(F.b1, 4), Math.abs(F.b1 - st.beta) < (isFinite(F.se) ? 2 * F.se : 1e9) ? "acc" : "warn");
      S.set("se", fmt(F.se, 4));
      S.set("t", fmt(F.t, 2), Math.abs(F.t) > 1.96 ? "ok" : "warn");
      S.set("r2", fmt(F.r2, 3));
      S.set("tb", fmt(st.beta, 2), "ok");
    }

    c.help("Sample size, the true slope and the noise level regenerate the seeded data and refit by least squares; “Residuals” adds the stems and a residual panel, and “Add an outlier” drops one high-leverage point at x ≈ 4.2 so you can watch beta-hat, its standard error and R² move together.");
    redraw();
  }

  /* ─────────── small dense linear algebra (n ≤ 8, Gauss–Jordan) ─────── */
  function matInv(A) {
    var n = A.length, i, j, k, M = [], piv, f, out = [];
    for (i = 0; i < n; i++) {
      M.push([]);
      for (j = 0; j < n; j++) { M[i].push(A[i][j]); }
      for (j = 0; j < n; j++) { M[i].push(i === j ? 1 : 0); }
    }
    for (i = 0; i < n; i++) {
      piv = i;
      for (k = i; k < n; k++) { if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) { piv = k; } }
      if (!isFinite(M[piv][i]) || Math.abs(M[piv][i]) < 1e-12) { return null; }
      if (piv !== i) { var tmp = M[i]; M[i] = M[piv]; M[piv] = tmp; }
      f = M[i][i];
      for (j = 0; j < 2 * n; j++) { M[i][j] /= f; }
      for (k = 0; k < n; k++) {
        if (k === i) { continue; }
        f = M[k][i];
        if (!f) { continue; }
        for (j = 0; j < 2 * n; j++) { M[k][j] -= f * M[i][j]; }
      }
    }
    for (i = 0; i < n; i++) {
      out.push([]);
      for (j = 0; j < n; j++) {
        if (!isFinite(M[i][n + j])) { return null; }
        out[i].push(M[i][n + j]);
      }
    }
    return out;
  }
  function matVec(A, v) {
    var i, j, out = [], s;
    for (i = 0; i < A.length; i++) {
      s = 0;
      for (j = 0; j < v.length; j++) { s += A[i][j] * v[j]; }
      out.push(s);
    }
    return out;
  }
  function dot(a, b) { var s = 0, i; for (i = 0; i < a.length; i++) { s += a[i] * b[i]; } return s; }

  /* ═══════════════════════════════════════════════════════════════════
     10. efficient-frontier — assets, frontier, tangency and the CAL
     params: mu:[], sigma:[], rho, rf   optional: names:[], seed
     ═══════════════════════════════════════════════════════════════════ */
  function drawFrontier(c, p) {
    var mu = numArr(p.mu), sg = numArr(p.sigma), i, j;
    if (mu.length < 2 || sg.length < 2) {
      mu = mu.length >= 2 ? mu : [0.06, 0.11];
      sg = sg.length >= 2 ? sg : [0.10, 0.22];
    }
    var n = Math.min(mu.length, sg.length, 8);
    mu = mu.slice(0, n); sg = sg.slice(0, n);
    for (i = 0; i < n; i++) { sg[i] = Math.max(1e-4, Math.abs(sg[i])); }
    var names = arr(p.names);
    var st = {
      rho: num(p.rho, 0.25, -0.99, 0.99),
      rf: num(p.rf, 0.02, -0.02, 0.2),
      shorts: bool(p.shorts, false),
      cloud: n > 2,
      seed: int(p.seed, 12345, 1, 2147483646)
    };
    var svg = c.canvas(330, "mean–standard-deviation frontier with the capital allocation line");

    function cov(rho) {
      var S = [], a, b;
      for (a = 0; a < n; a++) {
        S.push([]);
        for (b = 0; b < n; b++) { S[a].push(a === b ? sg[a] * sg[a] : rho * sg[a] * sg[b]); }
      }
      return S;
    }
    function pvar(S, w) {
      var s = 0, a, b;
      for (a = 0; a < n; a++) { for (b = 0; b < n; b++) { s += w[a] * w[b] * S[a][b]; } }
      return s;
    }
    function port(S, w) {
      var v = pvar(S, w);
      return { w: w, mu: dot(w, mu), sd: Math.sqrt(Math.max(0, v)) };
    }
    function candidates(S) {
      var out = [], k, w, s2, rnd, a;
      if (n === 2) {
        var loW = st.shorts ? -0.6 : 0, hiW = st.shorts ? 1.6 : 1;
        for (k = 0; k <= 320; k++) {
          var t = loW + (hiW - loW) * k / 320;
          out.push(port(S, [t, 1 - t]));
        }
      } else {
        rnd = lcg(st.seed);
        for (k = 0; k < 900; k++) {
          w = []; s2 = 0;
          for (a = 0; a < n; a++) {
            var u = st.shorts ? gauss(rnd) : -Math.log(Math.max(1e-9, rnd()));
            w.push(u); s2 += u;
          }
          if (Math.abs(s2) < 1e-6) { continue; }
          for (a = 0; a < n; a++) { w[a] = w[a] / s2; }
          out.push(port(S, w));
        }
      }
      return out;
    }

    c.ctl(slider(c, { key: "rho", label: "Correlation ρ", min: -0.95, max: 0.95, step: 0.05, value: st.rho,
                      fmt: function (v) { return v.toFixed(2); },
                      onInput: function (v) { st.rho = v; redraw(); } }).node);
    c.ctl(slider(c, { key: "rf", label: "Risk-free rate", min: -0.01, max: 0.12, step: 0.0025, value: st.rf,
                      fmt: function (v) { return pct(v, 2); },
                      onInput: function (v) { st.rf = v; redraw(); } }).node);
    c.ctl(toggleBtn("Allow shorts", st.shorts, function (on) { st.shorts = on; redraw(); }));
    c.ctl(toggleBtn("Show random portfolios", st.cloud, function (on) { st.cloud = on; redraw(); }));

    var S2 = c.stats([
      { key: "mv", label: "Min-var σ" }, { key: "tr", label: "Tangency return" },
      { key: "ts", label: "Tangency σ" }, { key: "sh", label: "Sharpe", cls: "ok" },
      { key: "w", label: "Tangency w" }
    ]);
    c.legend([{ color: series(1), label: "individual assets" },
              { color: accent2(), label: "frontier" },
              { color: POS_INK, label: "tangency portfolio" },
              { color: WARN_INK, label: "capital allocation line" },
              { color: rgba(series(4), 0.5), label: "random portfolios" }]);

    function redraw() {
      var rhoMin = -1 / (n - 1) + 0.02;
      var rho = Math.max(rhoMin, Math.min(0.98, st.rho));
      var S = cov(rho), inv = matInv(S), k, a;
      var cand = candidates(S);
      var ones = [], excess = [];
      for (a = 0; a < n; a++) { ones.push(1); excess.push(mu[a] - st.rf); }

      var mv = null, tg = null, frontier = null;
      if (inv && st.shorts) {
        var wz = matVec(inv, ones), dz = 0;
        for (a = 0; a < n; a++) { dz += wz[a]; }
        if (Math.abs(dz) > 1e-9) {
          for (a = 0; a < n; a++) { wz[a] /= dz; }
          mv = port(S, wz);
        }
        var wt = matVec(inv, excess), dt = 0;
        for (a = 0; a < n; a++) { dt += wt[a]; }
        if (Math.abs(dt) > 1e-9) {
          for (a = 0; a < n; a++) { wt[a] /= dt; }
          tg = port(S, wt);
        }
        if (mv && tg) {
          frontier = [];
          for (k = -60; k <= 200; k++) {
            var al = k / 100, w2 = [];
            for (a = 0; a < n; a++) { w2.push(al * tg.w[a] + (1 - al) * mv.w[a]); }
            frontier.push(port(S, w2));
          }
        }
      }
      /* numeric fall-backs (long-only, or a singular covariance) */
      if (!mv) {
        for (k = 0; k < cand.length; k++) { if (!mv || cand[k].sd < mv.sd) { mv = cand[k]; } }
      }
      if (!tg) {
        var bestS = -Infinity;
        for (k = 0; k < cand.length; k++) {
          var sh = cand[k].sd > 1e-9 ? (cand[k].mu - st.rf) / cand[k].sd : -Infinity;
          if (sh > bestS) { bestS = sh; tg = cand[k]; }
        }
      }
      if (!frontier) {
        if (n === 2) { frontier = cand.slice(); }
        else {
          var bins = 60, lo = Infinity, hi = -Infinity, best = [];
          for (k = 0; k < cand.length; k++) { lo = Math.min(lo, cand[k].sd); hi = Math.max(hi, cand[k].sd); }
          for (k = 0; k < bins; k++) { best.push(null); }
          for (k = 0; k < cand.length; k++) {
            var b = Math.floor((cand[k].sd - lo) / ((hi - lo) || 1) * (bins - 1));
            b = Math.max(0, Math.min(bins - 1, b));
            if (!best[b] || cand[k].mu > best[b].mu) { best[b] = cand[k]; }
          }
          frontier = [];
          for (k = 0; k < bins; k++) { if (best[k]) { frontier.push(best[k]); } }
        }
      }
      frontier.sort(function (x, y) { return x.sd - y.sd; });

      var xs = [], ys = [], xlo = 0, xhi = 0, ylo = Infinity, yhi = -Infinity;
      for (k = 0; k < frontier.length; k++) {
        xs.push(frontier[k].sd); ys.push(frontier[k].mu);
        xhi = Math.max(xhi, frontier[k].sd);
        ylo = Math.min(ylo, frontier[k].mu); yhi = Math.max(yhi, frontier[k].mu);
      }
      for (a = 0; a < n; a++) {
        xhi = Math.max(xhi, sg[a]); ylo = Math.min(ylo, mu[a]); yhi = Math.max(yhi, mu[a]);
      }
      ylo = Math.min(ylo, st.rf); yhi = Math.max(yhi, st.rf);
      if (tg) { xhi = Math.max(xhi, tg.sd); }
      var yr = padRange(ylo, yhi, 0.12);
      var P = plot(W, 330, 62, 18, 20, 38, 0, xhi * 1.18 + 1e-6, yr[0], yr[1]);
      clearNode(svg);
      axes(svg, P, { xn: 6, yn: 5, xlab: "standard deviation", ylab: "expected return",
                     xfmt: function (v) { return pct(v, 0); },
                     yfmt: function (v) { return pct(v, 1); } });

      if (st.cloud) {
        var step = Math.max(1, Math.floor(cand.length / 420));
        for (k = 0; k < cand.length; k += step) {
          svg.appendChild(mk("circle", { cx: r1(xat(P, cand[k].sd)), cy: r1(yat(P, cand[k].mu)),
                                         r: 1.6, fill: series(4), opacity: 0.35 }));
        }
      }
      polyline(svg, P, xs, ys, accent2(), 2.1);
      /* capital allocation line */
      if (tg && tg.sd > 1e-9) {
        var slope = (tg.mu - st.rf) / tg.sd, xEnd = P.x1;
        polyline(svg, P, [0, xEnd], [st.rf, st.rf + slope * xEnd], WARN_INK, 1.5, "6 4");
        svg.appendChild(mk("circle", { cx: r1(xat(P, tg.sd)), cy: r1(yat(P, tg.mu)), r: 5,
                                       fill: POS_INK, stroke: "#ffffff", "stroke-width": 1.4 }));
        svg.appendChild(svgText(xat(P, tg.sd) + 8, yat(P, tg.mu) - 7, "tangency", 9.5, POS_INK, "start", "700"));
      }
      svg.appendChild(mk("circle", { cx: r1(xat(P, 0)), cy: r1(yat(P, st.rf)), r: 3.4, fill: WARN_INK }));
      svg.appendChild(svgText(xat(P, 0) + 7, yat(P, st.rf) + 13, "rf " + pct(st.rf, 2), 9, WARN_INK, "start"));
      if (mv) {
        svg.appendChild(mk("circle", { cx: r1(xat(P, mv.sd)), cy: r1(yat(P, mv.mu)), r: 4,
                                       fill: accent2(), stroke: "#ffffff", "stroke-width": 1.2 }));
        svg.appendChild(svgText(xat(P, mv.sd) - 8, yat(P, mv.mu) + 3.6, "min-var", 9.5, accent2(), "end"));
      }
      for (a = 0; a < n; a++) {
        svg.appendChild(mk("rect", { x: r1(xat(P, sg[a]) - 3.4), y: r1(yat(P, mu[a]) - 3.4),
                                     width: 6.8, height: 6.8, fill: series(1) }));
        svg.appendChild(svgText(xat(P, sg[a]) + 7, yat(P, mu[a]) + 3.6,
                                str(names[a], "asset " + (a + 1)), 9, LABEL_INK, "start"));
      }
      if (Math.abs(rho - st.rho) > 1e-9) {
        svg.appendChild(svgText(P.l + 6, P.t + 12,
          "ρ clamped to " + rho.toFixed(2) + " — below that the covariance is not positive definite",
          9, WARN_INK, "start"));
      }

      S2.set("mv", mv ? pct(mv.sd, 2) : "—");
      S2.set("tr", tg ? pct(tg.mu, 2) : "—");
      S2.set("ts", tg ? pct(tg.sd, 2) : "—");
      S2.set("sh", tg && tg.sd > 1e-9 ? ((tg.mu - st.rf) / tg.sd).toFixed(3) : "—", "ok");
      if (tg) {
        var ws = [];
        for (a = 0; a < Math.min(3, n); a++) { ws.push((tg.w[a] * 100).toFixed(0) + "%"); }
        S2.set("w", ws.join(" / ") + (n > 3 ? " …" : ""));
      } else { S2.set("w", "—"); }
    }

    c.help("ρ sets the equicorrelation between every pair of assets and rf moves the intercept of the capital allocation line; “Allow shorts” switches between the long-only feasible set and the unconstrained analytic frontier, and “Show random portfolios” paints the seeded weight cloud behind it.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     11. tree-diagram — layered DAG, depth computed from the edges
     params: nodes:[{id,label,level?}], edges:[{from,to,label?}]
     ═══════════════════════════════════════════════════════════════════ */
  function drawTree(c, p) {
    var nin = arr(p.nodes), ein = arr(p.edges), nodes = [], byId = {}, edges = [], i;
    for (i = 0; i < nin.length && nodes.length < 40; i++) {
      var g = nin[i] || {};
      var id = str(g.id, "");
      if (!id || byId.hasOwnProperty(id)) { continue; }
      var nd = { id: id, label: str(g.label, id), depth: has(g, "level") ? int(g.level, 0, 0, 30) : -1,
                 fixed: has(g, "level"), out: [], inn: [] };
      byId[id] = nd;
      nodes.push(nd);
    }
    if (!nodes.length) {
      c.note("This diagram has no nodes: params.nodes must be an array of {id, label} objects.");
      c.help("Nothing to draw — the node list was empty.");
      return;
    }
    for (i = 0; i < ein.length && edges.length < 120; i++) {
      var e = ein[i] || {};
      var f = str(e.from, ""), t = str(e.to, "");
      if (!byId.hasOwnProperty(f) || !byId.hasOwnProperty(t) || f === t) { continue; }
      edges.push({ from: f, to: t, label: str(e.label, "") });
      byId[f].out.push(t);
      byId[t].inn.push(f);
    }
    /* longest-path depth, relaxed at most N times so a cycle cannot hang */
    (function () {
      var k, changed = true, guard = 0, a, nd, src;
      for (k = 0; k < nodes.length; k++) { if (!nodes[k].fixed) { nodes[k].depth = 0; } }
      while (changed && guard < nodes.length + 2) {
        changed = false; guard++;
        for (k = 0; k < edges.length; k++) {
          src = byId[edges[k].from]; nd = byId[edges[k].to];
          if (nd.fixed) { continue; }
          if (nd.depth < src.depth + 1) { nd.depth = src.depth + 1; changed = true; }
        }
      }
      for (a = 0; a < nodes.length; a++) { if (nodes[a].depth > 30) { nodes[a].depth = 30; } }
    }());

    var st = { dir: "lr", focus: "" };
    var svg = c.canvas(320, "layered diagram of " + nodes.length + " nodes and " + edges.length + " edges");
    var arrowId = c.id("arrow"), arrowHiId = c.id("arrowhi");

    var selOpts = [{ v: "", label: "— no highlight —" }];
    for (i = 0; i < nodes.length; i++) { selOpts.push({ v: nodes[i].id, label: nodes[i].label }); }
    c.ctl(segmented(c, { label: "layout direction", value: st.dir,
      options: [{ v: "lr", label: "Left→right" }, { v: "tb", label: "Top→bottom" }],
      onChange: function (v) { st.dir = v; redraw(); } }).node);
    c.ctl(selectCtl(c, { key: "focus", label: "Highlight paths into", value: "", options: selOpts,
      onChange: function (v) { st.focus = v; redraw(); } }).node);

    var S = c.stats([
      { key: "n", label: "Nodes" }, { key: "e", label: "Edges" },
      { key: "d", label: "Depth" }, { key: "hl", label: "Highlighted" }
    ]);
    c.legend([{ color: series(2), label: "root (no incoming edge)" },
              { color: series(1), label: "leaf" },
              { color: AXIS_INK, label: "interior node" },
              { color: accent2(), label: "on a path into the selected node" }]);

    function ancestors(target) {
      var set = {}, stack = [target], guard = 0, cur, k;
      if (!target || !byId.hasOwnProperty(target)) { return set; }
      set[target] = true;
      while (stack.length && guard < 2000) {
        guard++;
        cur = stack.pop();
        for (k = 0; k < byId[cur].inn.length; k++) {
          if (!set[byId[cur].inn[k]]) { set[byId[cur].inn[k]] = true; stack.push(byId[cur].inn[k]); }
        }
      }
      return set;
    }

    function wrap2(s, per) {
      var words = String(s).split(/\s+/), lines = [""], k;
      for (k = 0; k < words.length; k++) {
        if (!lines[lines.length - 1]) { lines[lines.length - 1] = words[k]; }
        else if ((lines[lines.length - 1] + " " + words[k]).length <= per) {
          lines[lines.length - 1] += " " + words[k];
        } else if (lines.length < 2) { lines.push(words[k]); }
        else { lines[1] = lines[1].slice(0, Math.max(0, per - 1)) + "…"; break; }
      }
      return lines;
    }

    function redraw() {
      var BW = 124, BH = 38, GX = 52, GY = 20, i2, k;
      var byDepth = {}, maxD = 0, nd;
      for (i2 = 0; i2 < nodes.length; i2++) {
        nd = nodes[i2];
        if (!byDepth[nd.depth]) { byDepth[nd.depth] = []; }
        byDepth[nd.depth].push(nd);
        maxD = Math.max(maxD, nd.depth);
      }
      var widest = 1;
      for (k in byDepth) { if (byDepth.hasOwnProperty(k)) { widest = Math.max(widest, byDepth[k].length); } }

      var CW, CH, pos = {};
      if (st.dir === "lr") {
        CW = Math.max(W, 40 + (maxD + 1) * (BW + GX));
        CH = Math.max(220, 46 + widest * (BH + GY));
      } else {
        CW = Math.max(W, 40 + widest * (BW + 24));
        CH = Math.max(220, 46 + (maxD + 1) * (BH + 44));
      }
      clearNode(svg);
      c.resize(svg, CW, CH);

      var defs = mk("defs");
      function marker(id, color) {
        var m = mk("marker", { id: id, viewBox: "0 0 10 10", refX: 9, refY: 5,
                               markerWidth: 6, markerHeight: 6, orient: "auto" });
        m.appendChild(mk("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));
        return m;
      }
      defs.appendChild(marker(arrowId, GRID_INK));
      defs.appendChild(marker(arrowHiId, accent2()));
      svg.appendChild(defs);

      for (k in byDepth) {
        if (!byDepth.hasOwnProperty(k)) { continue; }
        var lane = byDepth[k], cnt = lane.length;
        for (i2 = 0; i2 < cnt; i2++) {
          if (st.dir === "lr") {
            pos[lane[i2].id] = {
              x: 26 + Number(k) * (BW + GX) + BW / 2,
              y: CH / 2 + (i2 - (cnt - 1) / 2) * (BH + GY)
            };
          } else {
            pos[lane[i2].id] = {
              x: CW / 2 + (i2 - (cnt - 1) / 2) * (BW + 24),
              y: 30 + Number(k) * (BH + 44) + BH / 2
            };
          }
        }
      }

      var hl = ancestors(st.focus), hlCount = 0;
      for (k in hl) { if (hl.hasOwnProperty(k)) { hlCount++; } }

      for (i2 = 0; i2 < edges.length; i2++) {
        var a = pos[edges[i2].from], b = pos[edges[i2].to];
        if (!a || !b) { continue; }
        var on = st.focus && hl[edges[i2].from] && hl[edges[i2].to];
        var x1, y1, x2, y2;
        if (st.dir === "lr") {
          x1 = a.x + BW / 2; y1 = a.y; x2 = b.x - BW / 2; y2 = b.y;
        } else {
          x1 = a.x; y1 = a.y + BH / 2; x2 = b.x; y2 = b.y - BH / 2;
        }
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        var d = (st.dir === "lr")
          ? "M" + r1(x1) + " " + r1(y1) + " C" + r1(mx) + " " + r1(y1) + " " + r1(mx) + " " + r1(y2) + " " + r1(x2) + " " + r1(y2)
          : "M" + r1(x1) + " " + r1(y1) + " C" + r1(x1) + " " + r1(my) + " " + r1(x2) + " " + r1(my) + " " + r1(x2) + " " + r1(y2);
        svg.appendChild(mk("path", {
          d: d, fill: "none", stroke: on ? accent2() : GRID_INK,
          "stroke-width": on ? 2 : 1.1, opacity: st.focus && !on ? 0.28 : 0.9,
          "marker-end": "url(#" + (on ? arrowHiId : arrowId) + ")"
        }));
        if (edges[i2].label) {
          svg.appendChild(svgText(mx, my - 4, edges[i2].label, 8.5,
                                  on ? accent2() : GRID_INK, "middle"));
        }
      }
      for (i2 = 0; i2 < nodes.length; i2++) {
        nd = nodes[i2];
        var q = pos[nd.id];
        if (!q) { continue; }
        var isRoot = nd.inn.length === 0, isLeaf = nd.out.length === 0;
        var on2 = st.focus ? !!hl[nd.id] : false;
        var stroke = on2 ? accent2() : (isRoot ? series(2) : (isLeaf ? series(1) : AXIS_INK));
        svg.appendChild(mk("rect", {
          x: r1(q.x - BW / 2), y: r1(q.y - BH / 2), width: BW, height: BH, rx: 8,
          fill: on2 ? rgba(accent2(), 0.16) : "#efefef", stroke: stroke,
          "stroke-width": (nd.id === st.focus) ? 2.2 : 1.2,
          opacity: st.focus && !on2 ? 0.4 : 1
        }));
        var lines = wrap2(nd.label, 17);
        if (lines.length === 1) {
          svg.appendChild(svgText(q.x, q.y + 3.6, lines[0], 9.5, on2 ? "#fff" : BODY_INK, "middle", "650"));
        } else {
          svg.appendChild(svgText(q.x, q.y - 2, lines[0], 9.5, on2 ? "#fff" : BODY_INK, "middle", "650"));
          svg.appendChild(svgText(q.x, q.y + 10, lines[1], 9.5, on2 ? "#fff" : BODY_INK, "middle", "650"));
        }
      }

      S.set("n", String(nodes.length));
      S.set("e", String(edges.length));
      S.set("d", String(maxD + 1) + " layers");
      S.set("hl", st.focus ? (hlCount + " on paths into " + str(byId[st.focus] && byId[st.focus].label, st.focus)) : "none");
    }

    c.help("The direction switch re-lays the same graph left-to-right or top-to-bottom, and the select highlights one node together with every edge and ancestor on a path into it; depth comes from the edges (a node with no incoming edge is a root) unless a node carries an explicit level.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     12. timeline — numeric or ISO-dated events on one axis
     params: events:[{t, label, note?}]
     ═══════════════════════════════════════════════════════════════════ */
  function parseWhen(v) {
    var s, m, f;
    if (typeof v === "number" && isFinite(v)) { return { v: v, date: false }; }
    s = str(v, "");
    m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/.exec(s);
    if (m) {
      return { v: Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1,
                           m[3] ? parseInt(m[3], 10) : 1) / 86400000, date: true };
    }
    f = parseFloat(s);
    if (isFinite(f)) { return { v: f, date: false }; }
    return null;
  }
  function pad2(x) { return (x < 10 ? "0" : "") + x; }
  function dayLabel(days, span) {
    var d = new Date(Math.round(days) * 86400000);
    if (span > 1460) { return String(d.getUTCFullYear()); }
    if (span > 120) { return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1); }
    return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate());
  }

  function drawTimeline(c, p) {
    var ein = arr(p.events), evs = [], i, anyDate = false;
    for (i = 0; i < ein.length && evs.length < 60; i++) {
      var g = ein[i] || {};
      var w = parseWhen(g.t);
      if (!w) { continue; }
      if (w.date) { anyDate = true; }
      evs.push({ t: w.v, label: str(g.label, "event " + (evs.length + 1)), note: str(g.note, ""),
                 isDate: w.date });
    }
    if (!evs.length) {
      c.note("This timeline has no usable events: each entry needs a numeric or ISO-dated `t` and a label.");
      c.help("Nothing to draw — no event carried a readable date or number.");
      return;
    }
    evs.sort(function (a, b) { return a.t - b.t; });
    var t0 = evs[0].t, t1 = evs[evs.length - 1].t;
    if (!(t1 > t0)) { t1 = t0 + 1; }
    var full = t1 - t0;
    var st = { zoom: 1, cur: 0 };
    var svg = c.canvas(250, "timeline of " + evs.length + " events");

    var zs = slider(c, { key: "zoom", label: "Visible span", min: 0.1, max: 1, step: 0.02, value: 1,
                         fmt: function (v) { return (v * 100).toFixed(0) + "%"; },
                         onInput: function (v) { st.zoom = v; redraw(); } });
    c.ctl(zs.node);
    c.ctl(button("◀ Prev", function () { st.cur = Math.max(0, st.cur - 1); redraw(); }));
    c.ctl(button("Next ▶", function () { st.cur = Math.min(evs.length - 1, st.cur + 1); redraw(); }));

    var S = c.stats([
      { key: "k", label: "Event" }, { key: "when", label: "When" },
      { key: "lab", label: "Label" }, { key: "note", label: "Note", cls: "ok" }
    ]);
    c.legend([{ color: accent2(), label: "event" }, { color: accent(), label: "highlighted" },
              { color: GRID_INK, label: "axis" }]);

    function fmtT(v, span) {
      return anyDate ? dayLabel(v, span) : fmt(v);
    }

    function redraw() {
      var H = 250, axisY = 128, i2;
      var span = Math.max(full * st.zoom, full / 400 + 1e-9);
      var centre = evs[st.cur].t;
      var lo = centre - span / 2, hi = centre + span / 2;
      if (lo < t0 - full * 0.05) { lo = t0 - full * 0.05; hi = lo + span; }
      if (hi > t1 + full * 0.05) { hi = t1 + full * 0.05; lo = hi - span; }
      var P = plot(W, H, 26, 26, 20, 40, lo, hi, 0, 1);
      clearNode(svg);
      svg.appendChild(mk("line", { x1: r1(P.l), y1: axisY, x2: r1(P.W - P.r), y2: axisY,
                                   stroke: GRID_INK, "stroke-width": 1.6 }));
      var ticks = niceTicks(lo, hi, 6);
      for (i2 = 0; i2 < ticks.length; i2++) {
        var tx = xat(P, ticks[i2]);
        svg.appendChild(mk("line", { x1: r1(tx), y1: axisY, x2: r1(tx), y2: axisY + 6,
                                     stroke: AXIS_INK, "stroke-width": 1 }));
        svg.appendChild(svgText(tx, axisY + 19, fmtT(ticks[i2], hi - lo), 9, GRID_INK, "middle"));
      }
      var above = true, shown = 0;
      for (i2 = 0; i2 < evs.length; i2++) {
        var e = evs[i2];
        if (e.t < lo || e.t > hi) { continue; }
        var x = xat(P, e.t), cur = (i2 === st.cur);
        var lift = above ? -1 : 1;
        var tier = (shown % 2 === 0) ? 44 : 74;
        var ly = axisY + lift * tier;
        svg.appendChild(mk("line", { x1: r1(x), y1: axisY, x2: r1(x), y2: r1(ly + lift * -4),
                                     stroke: cur ? accent() : rgba(accent2(), 0.55),
                                     "stroke-width": cur ? 1.8 : 1, "stroke-dasharray": cur ? null : "3 3" }));
        svg.appendChild(mk("circle", { cx: r1(x), cy: axisY, r: cur ? 5.2 : 3.4,
                                       fill: cur ? accent() : accent2(),
                                       stroke: "#ffffff", "stroke-width": 1.2 }));
        var anchor = x < P.l + 60 ? "start" : (x > P.W - P.r - 60 ? "end" : "middle");
        svg.appendChild(svgText(x, ly, e.label.length > 26 ? e.label.slice(0, 25) + "…" : e.label,
                                cur ? 10.5 : 9.5, cur ? "#fff" : LABEL_INK, anchor, cur ? "700" : "600"));
        svg.appendChild(svgText(x, ly + lift * 12, fmtT(e.t, hi - lo), 8.5,
                                cur ? accent2() : GRID_INK, anchor));
        above = !above; shown++;
      }
      svg.appendChild(svgText(P.l, H - 8, shown + " of " + evs.length + " events in view", 9, GRID_INK, "start"));

      S.set("k", (st.cur + 1) + " / " + evs.length);
      S.set("when", fmtT(evs[st.cur].t, full));
      S.set("lab", evs[st.cur].label);
      S.set("note", evs[st.cur].note || "—", "ok");
    }

    c.help("The span slider zooms the visible window around the highlighted event, and Prev / Next step the highlight through the events in order — the stat strip always reads the highlighted event's date, label and note.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     13. code-trace — source on the left, the step's state on the right
     params: code?, lang?, steps:[{line, state, note?}]
     ═══════════════════════════════════════════════════════════════════ */
  function drawCodeTrace(c, p) {
    var src = str(p.code, ""), lines = src ? src.replace(/\r\n?/g, "\n").split("\n") : [];
    var lang = str(p.lang, "python");
    var sin = arr(p.steps), steps = [], i;
    for (i = 0; i < sin.length && steps.length < 200; i++) {
      var g = sin[i] || {};
      var stt = {};
      if (g.state && typeof g.state === "object") { stt = g.state; }
      else if (g.state !== undefined && g.state !== null) { stt = { "": String(g.state) }; }
      steps.push({ line: int(g.line, 0, 0, 100000), state: stt, note: str(g.note, "") });
    }
    if (!steps.length) {
      c.note("This trace has no steps: params.steps must be an array of {line, state} objects.");
      c.help("Nothing to step through — the steps array was empty.");
      return;
    }
    var st = { i: 0 };

    var wrap = el("div", "svgwrap");
    var grid = el("div", "ctrace");
    grid.setAttribute("style", "display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px;align-items:start");
    var codePane = el("div", "ctcode");
    codePane.setAttribute("style", "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.8px;line-height:1.65;overflow-x:auto");
    var statePane = el("div", "ctstate");
    statePane.setAttribute("style", "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.8px");
    add(grid, codePane); add(grid, statePane);
    add(wrap, grid); add(c.fig, wrap);

    var stepSlider = slider(c, {
      key: "step", label: "Step", min: 1, max: steps.length, step: 1, value: 1,
      fmt: function (v) { return Math.round(v) + " / " + steps.length; },
      onInput: function (v) { st.i = Math.round(v) - 1; redraw(); }
    });
    c.ctl(stepSlider.node);
    function setStep(k) {
      st.i = Math.max(0, Math.min(steps.length - 1, k));
      stepSlider.set(st.i + 1);
      redraw();
    }
    c.ctl(button("◀", function () { setStep(st.i - 1); }));
    c.ctl(button("▶", function () { setStep(st.i + 1); }));
    c.ctl(button("Restart", function () { setStep(0); }));

    var S = c.stats([
      { key: "k", label: "Step" }, { key: "ln", label: "Line" },
      { key: "vars", label: "Bindings" }, { key: "note", label: "Note", cls: "ok" }
    ]);
    c.legend([{ color: accent2(), label: "executing line" },
              { color: WARN_INK, label: "binding changed at this step" }]);

    function redraw() {
      var cur = steps[st.i], prev = st.i > 0 ? steps[st.i - 1] : null, i2, k, row, keys = [];
      clearNode(codePane);
      clearNode(statePane);

      if (lines.length) {
        for (i2 = 0; i2 < lines.length; i2++) {
          var on = (cur.line === i2 + 1);
          row = el("div", on ? "ctline on" : "ctline");
          row.setAttribute("style", "display:flex;gap:10px;padding:1px 6px;border-radius:4px;"
            + (on ? "background:rgba(88,166,255,.16);box-shadow:inset 2px 0 0 " + accent2() + ";color:#fff"
                  : "color:#4a4a4a"));
          var ln = el("span", "ctln", String(i2 + 1));
          ln.setAttribute("style", "color:#8a8a8a;min-width:2.2em;text-align:right;flex:none");
          add(row, ln);
          var sc = el("span", "ctsrc", lines[i2] === "" ? " " : lines[i2]);
          sc.setAttribute("style", "white-space:pre");
          add(row, sc);
          add(codePane, row);
        }
      } else {
        for (i2 = 0; i2 < steps.length; i2++) {
          var on2 = (i2 === st.i);
          row = el("div", on2 ? "ctline on" : "ctline");
          row.setAttribute("style", "display:flex;gap:10px;padding:2px 6px;border-radius:4px;"
            + (on2 ? "background:rgba(21,95,131,.14);color:#111" : "color:#666666"));
          add(row, (function () {
            var n2 = el("span", "ctln", "#" + (i2 + 1));
            n2.setAttribute("style", "color:#8a8a8a;min-width:2.6em;flex:none");
            return n2;
          }()));
          add(row, el("span", "ctsrc",
            (steps[i2].line ? "line " + steps[i2].line + " · " : "") + (steps[i2].note || "step")));
          add(codePane, row);
        }
      }

      var head = el("div", "ctshead", "STATE AFTER STEP " + (st.i + 1));
      head.setAttribute("style", "font-size:9.5px;letter-spacing:1px;color:#8a8a8a;font-weight:700;margin-bottom:6px");
      add(statePane, head);
      for (k in cur.state) {
        if (Object.prototype.hasOwnProperty.call(cur.state, k)) { keys.push(k); }
      }
      keys.sort();
      if (!keys.length) {
        var none = el("div", null, "— no bindings recorded —");
        none.setAttribute("style", "color:#8a8a8a");
        add(statePane, none);
      }
      for (i2 = 0; i2 < keys.length; i2++) {
        var kk = keys[i2];
        var nowV = String(cur.state[kk]);
        var wasV = (prev && Object.prototype.hasOwnProperty.call(prev.state, kk))
                     ? String(prev.state[kk]) : null;
        var changed = (wasV === null) || (wasV !== nowV);
        row = el("div", changed ? "ctrow chg" : "ctrow");
        row.setAttribute("style", "display:flex;justify-content:space-between;gap:10px;padding:3px 7px;"
          + "border-radius:4px;margin-bottom:2px;"
          + (changed ? "background:rgba(218,104,13,.16);color:#111" : "color:#666666"));
        add(row, el("span", "ctk", kk === "" ? "state" : kk));
        var vspan = el("span", "ctv", nowV);
        vspan.setAttribute("style", "font-weight:700;color:" + (changed ? WARN_INK : BODY_INK));
        add(row, vspan);
        add(statePane, row);
      }

      S.set("k", (st.i + 1) + " / " + steps.length);
      S.set("ln", cur.line ? String(cur.line) : "—");
      S.set("vars", String(keys.length));
      S.set("note", cur.note || "—", "ok");
    }

    c.help("The step slider and the ◀ / ▶ buttons walk the trace one step at a time"
      + (lines.length ? " and highlight the executing " + lang + " line" : "")
      + "; any binding whose value differs from the previous step is marked, and “Restart” returns to step 1. There is no timer — nothing moves unless you move it.");
    redraw();
  }

  /* ═══════════════════════════════════════════════════════════════════
     THE REGISTRY — one entry per type. Adding a type is one line here
     plus one id in TYPE_ORDER.
     ═══════════════════════════════════════════════════════════════════ */

  var TYPE_ORDER = [
    "payoff", "binomial-tree", "curve", "simulate-paths", "histogram",
    "slider-formula", "orderbook", "heatmap", "regression",
    "efficient-frontier", "tree-diagram", "timeline", "code-trace"
  ];
  var TYPES = {
    "payoff":             drawPayoff,
    "binomial-tree":      drawBinomial,
    "curve":              drawCurve,
    "simulate-paths":     drawPaths,
    "histogram":          drawHistogram,
    "slider-formula":     drawSliderFormula,
    "orderbook":          drawOrderbook,
    "heatmap":            drawHeatmap,
    "regression":         drawRegression,
    "efficient-frontier": drawFrontier,
    "tree-diagram":       drawTree,
    "timeline":           drawTimeline,
    "code-trace":         drawCodeTrace
  };

  /* ───────────────────────────── render ─────────────────────────────── */

  function render(host, spec, opts) {
    var type = "", title = "Widget", params = {}, c = null;
    try {
      if (host) { clearNode(host); }
      if (!spec || typeof spec !== "object") {
        return fallback(host, title, "", "This widget has no specification: app.js expects {type, title, params}.");
      }
      type = str(spec.type, "").replace(/^\s+/, "").replace(/\s+$/, "");
      title = str(spec.title, "") || (type || "Widget");
      params = (spec.params && typeof spec.params === "object") ? spec.params : {};
      if (opts && typeof opts === "object" && opts.seed !== undefined && !has(params, "seed")) {
        /* a page may pin a seed without touching the course file */
        var clone = {}, k;
        for (k in params) { if (params.hasOwnProperty(k)) { clone[k] = params[k]; } }
        clone.seed = opts.seed;
        params = clone;
      }
      if (!type) {
        return fallback(host, title, "", "This widget is missing its `type`. Known types: " + TYPE_ORDER.join(", ") + ".");
      }
      if (!TYPES.hasOwnProperty(type)) {
        return fallback(host, title, type, "Unknown widget type “" + type + "”. Known types: " + TYPE_ORDER.join(", ") + ".");
      }
      c = makeCtx(type, title);
      TYPES[type](c, params);
      if (!c.fig.querySelector || !c.fig.querySelector("p.whelp")) {
        /* a drawer that returned early without its help line still gets one */
        if (!c.fig.getElementsByClassName || !c.fig.getElementsByClassName("whelp").length) {
          c.help("Interactive figure.");
        }
      }
      if (host) { host.appendChild(c.fig); }
      return c.fig;
    } catch (e) {
      var msg = "This figure could not be drawn from the parameters supplied";
      try { if (e && e.message) { msg += " (" + String(e.message) + ")"; } } catch (e2) { /* ignore */ }
      return fallback(host, title, type, msg + ". The rest of the page is unaffected.");
    }
  }

  /* ─────────────────────────── public API ───────────────────────────── */

  window.WIDGETS = {
    version: "1",
    types: TYPE_ORDER.slice(),
    has: function (type) { return TYPES.hasOwnProperty(str(type, "")); },
    render: render,
    tex: tex
  };

}());
