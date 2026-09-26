import sys, json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8790/index.html"
SHOTS = "/Users/sdonadio/PycharmProjects/TeachingWithClaudeUChicago/notes/shots"

results = {
    "console_errors": [],
    "page_errors": [],
    "clicks": [],
    "overflow": {},
    "notes": [],
}

def log_console(msg, viewport):
    if msg.type == "error":
        results["console_errors"].append(f"[{viewport}] {msg.text}")

def log_pageerror(err, viewport):
    results["page_errors"].append(f"[{viewport}] {err}")

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ---------- Desktop 1280x900 ----------
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.on("console", lambda m: log_console(m, "1280x900"))
    page.on("pageerror", lambda e: log_pageerror(e, "1280x900"))
    page.goto(URL, wait_until="networkidle")
    page.screenshot(path=f"{SHOTS}/desktop_hero.png")

    # click every nav link (smooth-scroll + active highlight)
    nav_links = page.query_selector_all("nav.primary-nav a[data-nav]")
    for a in nav_links:
        href = a.get_attribute("href")
        a.click()
        page.wait_for_timeout(150)
        results["clicks"].append(f"nav:{href}")

    # click every tab in "What I built"
    tabs = page.query_selector_all("#what-i-built .tablist [role='tab']")
    for t in tabs:
        t.click()
        page.wait_for_timeout(80)
        sel = t.get_attribute("aria-selected")
        results["clicks"].append(f"course-tab:{t.inner_text().strip()[:30]} selected={sel}")
    page.screenshot(path=f"{SHOTS}/desktop_tabs.png")

    # click every diagram node
    nodes = page.query_selector_all(".diagram-node")
    for n in nodes:
        n.click()
        page.wait_for_timeout(80)
        results["clicks"].append(f"diagram-node:{n.get_attribute('data-node')}")
    page.screenshot(path=f"{SHOTS}/desktop_diagram.png")

    # click every checklist checkbox + toggle
    checkboxes = page.query_selector_all("#checklist input[type='checkbox']")
    for cb in checkboxes:
        cb.click()
        results["clicks"].append(f"checklist-checkbox:{cb.get_attribute('id')}")
    toggles = page.query_selector_all("#checklist .step-toggle")
    for tog in toggles:
        tog.click()
        page.wait_for_timeout(50)
        results["clicks"].append(f"checklist-toggle:{tog.get_attribute('id')}")
    progress_text = page.inner_text("#checklistProgress")
    results["notes"].append(f"checklist progress after checking all: {progress_text.strip()[:40]}")
    page.screenshot(path=f"{SHOTS}/desktop_checklist.png")

    # reset progress
    page.click("#resetProgress")
    page.wait_for_timeout(50)
    results["clicks"].append("checklist:resetProgress")

    # expand all / collapse all playbook, then click every accordion item
    page.click("#expandAllPlaybook")
    page.wait_for_timeout(80)
    results["clicks"].append("playbook:expandAll")
    page.click("#collapseAllPlaybook")
    page.wait_for_timeout(80)
    results["clicks"].append("playbook:collapseAll")

    accordion_triggers = page.query_selector_all("#playbookAccordion .accordion-trigger")
    for trig in accordion_triggers:
        trig.click()
        page.wait_for_timeout(50)
        results["clicks"].append(f"playbook-accordion:{trig.get_attribute('id')}")
    page.screenshot(path=f"{SHOTS}/desktop_playbook.png")

    # click every copy button
    copy_buttons = page.query_selector_all(".copy-btn")
    for btn in copy_buttons:
        btn.click()
        page.wait_for_timeout(50)
        results["clicks"].append(f"copy-btn:{btn.get_attribute('data-copy-target')}")

    # click every stepper step + prev/next
    step_buttons = page.query_selector_all(".stepper-track [role='tab']")
    for sb in step_buttons:
        sb.click()
        page.wait_for_timeout(50)
        results["clicks"].append(f"stepper:{sb.inner_text().strip()[:20]}")
    page.click("#stepPrev")
    page.wait_for_timeout(50)
    results["clicks"].append("stepper:prev")
    page.click("#stepNext")
    page.wait_for_timeout(50)
    results["clicks"].append("stepper:next")
    page.screenshot(path=f"{SHOTS}/desktop_stepper.png")

    # click every FAQ accordion item, then test filter
    faq_triggers = page.query_selector_all("#faqListA .accordion-trigger, #faqListB .accordion-trigger")
    for trig in faq_triggers:
        trig.click()
        page.wait_for_timeout(30)
        results["clicks"].append(f"faq-accordion:{trig.get_attribute('id')}")
    page.fill("#faqFilter", "FERPA")
    page.wait_for_timeout(80)
    visible_faq = page.eval_on_selector_all(".faq-item:not([hidden])", "els => els.length")
    results["notes"].append(f"FAQ filter 'FERPA' -> {visible_faq} visible items")
    page.fill("#faqFilter", "zzzznomatch")
    page.wait_for_timeout(80)
    empty_visible = page.is_visible("#faqEmpty")
    results["notes"].append(f"FAQ filter no-match empty message visible: {empty_visible}")
    page.fill("#faqFilter", "")
    page.wait_for_timeout(80)
    page.screenshot(path=f"{SHOTS}/desktop_faq.png")

    overflow_1280 = page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    results["overflow"]["1280"] = {
        "scrollWidth": page.evaluate("document.documentElement.scrollWidth"),
        "innerWidth": page.evaluate("window.innerWidth"),
        "ok": overflow_1280,
    }

    page.close()

    # ---------- Mobile 390x844 ----------
    page2 = browser.new_page(viewport={"width": 390, "height": 844})
    page2.on("console", lambda m: log_console(m, "390x844"))
    page2.on("pageerror", lambda e: log_pageerror(e, "390x844"))
    page2.goto(URL, wait_until="networkidle")
    page2.screenshot(path=f"{SHOTS}/mobile_hero.png")

    # repeat a subset of interactions on mobile
    tabs2 = page2.query_selector_all("#what-i-built .tablist [role='tab']")
    for t in tabs2:
        t.click()
        page2.wait_for_timeout(60)
        results["clicks"].append(f"mobile-course-tab:{t.inner_text().strip()[:20]}")

    nodes2 = page2.query_selector_all(".diagram-node")
    for n in nodes2:
        n.click()
        page2.wait_for_timeout(60)
        results["clicks"].append(f"mobile-diagram-node:{n.get_attribute('data-node')}")

    cb2 = page2.query_selector_all("#checklist input[type='checkbox']")
    for cb in cb2:
        cb.click()
        results["clicks"].append(f"mobile-checklist-checkbox:{cb.get_attribute('id')}")
    tog2 = page2.query_selector_all("#checklist .step-toggle")
    for tog in tog2:
        tog.click()
        page2.wait_for_timeout(40)
        results["clicks"].append(f"mobile-checklist-toggle:{tog.get_attribute('id')}")
    page2.click("#resetProgress")

    acc2 = page2.query_selector_all("#playbookAccordion .accordion-trigger")
    for trig in acc2:
        trig.click()
        page2.wait_for_timeout(40)
        results["clicks"].append(f"mobile-playbook-accordion:{trig.get_attribute('id')}")

    copy2 = page2.query_selector_all(".copy-btn")
    for btn in copy2:
        btn.click()
        page2.wait_for_timeout(40)
        results["clicks"].append(f"mobile-copy-btn:{btn.get_attribute('data-copy-target')}")

    step2 = page2.query_selector_all(".stepper-track [role='tab']")
    for sb in step2:
        sb.click()
        page2.wait_for_timeout(40)
        results["clicks"].append(f"mobile-stepper:{sb.inner_text().strip()[:20]}")

    faq2 = page2.query_selector_all("#faqListA .accordion-trigger, #faqListB .accordion-trigger")
    for trig in faq2:
        trig.click()
        page2.wait_for_timeout(30)
        results["clicks"].append(f"mobile-faq-accordion:{trig.get_attribute('id')}")
    page2.fill("#faqFilter", "cost")
    page2.wait_for_timeout(60)
    visible_faq2 = page2.eval_on_selector_all(".faq-item:not([hidden])", "els => els.length")
    results["notes"].append(f"mobile FAQ filter 'cost' -> {visible_faq2} visible items")
    page2.fill("#faqFilter", "")
    page2.wait_for_timeout(60)

    page2.screenshot(path=f"{SHOTS}/mobile_full.png", full_page=True)

    scrollWidth = page2.evaluate("document.documentElement.scrollWidth")
    innerWidth = page2.evaluate("window.innerWidth")
    results["overflow"]["390"] = {
        "scrollWidth": scrollWidth,
        "innerWidth": innerWidth,
        "ok": scrollWidth <= innerWidth,
    }

    page2.close()
    browser.close()

print(json.dumps(results, indent=2))

# write a small summary file for the TEST_REPORT
with open("/private/tmp/claude-501/-Users-sdonadio-PycharmProjects-AlgoArena/4aa465e5-de65-42f1-a4fd-ec51944d8da2/scratchpad/test_results.json", "w") as f:
    json.dump(results, f, indent=2)
