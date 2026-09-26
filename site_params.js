/* ════════════════════════════════════════════════════════════════════════
   site_params.js — THE ONLY FILE ON THIS SITE THAT NAMES AN INSTITUTION.

   Every .html page carries neutral fallback text and marks the swappable
   words with data-sp / data-sp-href attributes; this file fills them in at
   load time. If this file fails to load the site still reads correctly —
   it just says "the program" instead of naming it.

       <span data-sp="program">the program</span>
       <a data-sp-href="program_url" data-sp="institution">the university</a>

   Values are written with textContent only; nothing is injected as HTML.
   Written by the HARVEST agent; supersedes site_params.stub.js.
   ════════════════════════════════════════════════════════════════════════ */
"use strict";
window.SITE_PARAMS = {
  /* ── naming ─────────────────────────────────────────────────────── */
  institution:       "The University of Chicago",
  institution_short: "UChicago",
  program:           "MS in Financial Mathematics",
  program_short:     "FinMath",
  degree:            "MS in Financial Mathematics",
  site_title:        "Curriculum Arena",

  /* ── links ──────────────────────────────────────────────────────── */
  program_url:       "https://finmath.uchicago.edu/",
  curriculum_url:    "https://finmath.uchicago.edu/curriculum/",
  catalog_url:       "https://finmath.uchicago.edu/curriculum/",
  site_url:          "https://sdonadio.github.io/finmath-curriculum-dashboard/",
  source_url:        "https://finmath.uchicago.edu/curriculum/",
  contact:           "sdonadio@uchicago.edu",

  /* ── provenance ─────────────────────────────────────────────────── */
  /* The date the public curriculum pages behind this site were harvested.
     Course pages cite it in their derivation banner. */
  fetched:           "2026-09-26",

  /* ── behaviour ──────────────────────────────────────────────────── */
  /* localStorage namespace: every key this site writes is
     "<storage_prefix>:<something>", so sibling dashboards published on the
     same github.io origin never collide. */
  storage_prefix:    "finmath-arena",
  /* KaTeX is optional: formulas degrade to monospace TeX when it is absent
     or when the page is opened offline. Set to "" to never load it. */
  katex_css:         "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
  katex_js:          "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js",

  /* ── theme: UChicago identity palette (Maroon #800000 primary; the
     secondary palette colours the blocks and concentrations in program.js;
     see identity.uchicago.edu) ─────────────────────────────────────── */
  accent:            "#800000",
  accent_2:          "#800000"
};

/* ── the applier ─────────────────────────────────────────────────────
   Runs before app.js so every page has its words even if app.js is still
   parsing. app.js calls window.SP_APPLY() again after it renders chrome.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  function apply() {
    var p = window.SITE_PARAMS, i, n, k, nodes;
    if (!p) return;
    nodes = document.querySelectorAll("[data-sp]");
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i]; k = n.getAttribute("data-sp");
      if (Object.prototype.hasOwnProperty.call(p, k) && p[k]) n.textContent = String(p[k]);
    }
    nodes = document.querySelectorAll("[data-sp-href]");
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i]; k = n.getAttribute("data-sp-href");
      if (Object.prototype.hasOwnProperty.call(p, k) && p[k]) n.setAttribute("href", String(p[k]));
      else if (n.tagName === "A") n.removeAttribute("href");
    }
    /* KaTeX, lazily and optionally: a missing CDN must not break a page. */
    if (p.katex_js && !window.__katexRequested) {
      window.__katexRequested = true;
      var css = document.createElement("link");
      css.rel = "stylesheet"; css.href = p.katex_css || "";
      if (p.katex_css) document.head.appendChild(css);
      var js = document.createElement("script");
      js.src = p.katex_js; js.defer = true;
      js.onload = function () {
        if (window.FMCA && window.FMCA.typesetAll) window.FMCA.typesetAll();
      };
      js.onerror = function () { /* offline: formulas stay as monospace TeX */ };
      document.head.appendChild(js);
    }
  }
  window.SP_APPLY = apply;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
}());
