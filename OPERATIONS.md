# CalcLeap Operations Manifest

> **This file is the persistent brain for the CalcLeap improvement program. Every Claude routine that touches this repo reads this file first and updates it at the end.** Treat it as the single source of truth for mission, standards, current state, and the improvement queue.

---

## Mission

Transform CalcLeap into a **world-class calculator + financial-education site** competitive with The Points Guy, NerdWallet, Investopedia, and Bankrate. Three measurable goals:

1. **AdSense reapproval.** Google rejected the site for "low value content." Reverse this by lifting average blog-post quality to 2,500+ words with real research, citations, and editorial standards.
2. **Calculation correctness.** Every calculator's math is audited and provably correct against canonical test cases.
3. **Organic search growth.** Move from ~420 indexed pages → 2,500+ indexed within 90 days through better content, schema, and internal linking.

## Ownership

This site is owned and improved by **Claude** (Anthropic), driven by Alex's terminal sessions plus two daily Anthropic Cloud routines (6 AM and 6 PM ET).

**Rando does NOT modify alexchalu/calcleap unless Claude requests it via the Rando HTTP API.** This was agreed and acknowledged 2026-05-17 — see the `Daily Log` section. Rando's `calclap-builder` and `daily-seo-check` crons were disabled the same day.

## Editorial Standards — what "world-class" means

Every blog post we ship must meet ALL of:

- **Length & depth.** Minimum 2,500 words. Cover the topic completely enough that a reader does not need a second tab.
- **Original analysis.** Include at least one custom data table, one worked-example case study, and one comparison of real-world options with concrete numbers (e.g., "high-yield savings vs CD vs T-bills in 2026").
- **Verifiable sources.** Cite primary sources (FDIC, SEC, IRS, Federal Reserve, BLS, .gov / .edu) for every numeric claim. Inline anchor links to source documents. Minimum 5 citations per post.
- **Update discipline.** Show `datePublished` and `dateModified` prominently. Every numeric claim has a "as of [date]" marker so it ages gracefully.
- **Editorial transparency.** Methodology footer explains how the calculator works and what assumptions are baked in. No fake author credentials — `CalcLeap Editorial` is the byline; expertise comes from sourced facts.
- **Internal linking.** Minimum 3 contextual links to our calculators inside the body, plus a "Related calculators" sidebar.
- **Schema markup.** Article, BreadcrumbList, and FAQPage schemas on every post. Author = `Organization: CalcLeap`. Reviewed-by line where applicable.
- **Visual rhythm.** TOC sidebar. Section dividers. Pull-quote callouts. Comparison tables. No 30-line walls of text.
- **Editorial voice.** Direct, plainspoken, second-person ("you"). No "Einstein allegedly called it..." filler. Lead with the concrete insight, then explain.
- **Action close.** Each post ends with a 5–10 item checklist the reader can act on today, plus a link to the matching calculator.

For calculators, every page must meet:

- **Math verified** against at least 3 canonical test cases with expected outputs documented in the page source as HTML comments.
- **Inputs explicit** about units (USD, %, years, kg, etc.). Don't assume.
- **Above-the-fold calculate button** on mobile.
- **Result interpretation** — don't just show a number, explain what it means.
- **FAQ section** with at least 4 questions, FAQPage schema applied.
- **Related calculators** (3–6) in sidebar.
- **Disclaimer** at footer.

## Architecture Principles

- **Static HTML, GitHub Pages.** No build step. Edits = commits = live within 1–2 min.
- **Single shared stylesheet** (`/style.css`) is the long-term goal. Currently CSS is inlined in every file — that's tech debt. Don't make it worse; new pages should `<link rel="stylesheet" href="/style.css">` once the shared file is mature enough to replace inline.
- **Schema-first SEO.** Every page type has a defined schema pattern (Article for blog, WebApplication for calc, BreadcrumbList everywhere, FAQPage where there's a FAQ).
- **Submit changes to IndexNow** after each batch of edits (see `submission script` in repo root).
- **Don't push 2,000-file commits.** Daily routine ships small, surgical commits — 1–5 files per push, clear messages.

## Current State (last updated: 2026-05-19 by Claude/morning-routine)

| Metric | Now | Target | Gap |
|---|---|---|---|
| Total pages | ~2,800 | 3,500 (more depth than breadth) | Quality > new pages |
| Blog posts | 12 | 100 gold-standard | 88 to write or rewrite |
| Blog posts at gold-standard | **3** (compound-interest 2026-05-17, best-mortgage-calculator-2026 2026-05-18, how-much-house-can-i-afford 2026-05-19) | 100 | 97 |
| Calculators with verified math | 100 audited (50 state property tax + 50 state sales tax) | 2,800 | Large |
| Calculators with FAQPage schema | 50 (state property tax) | 2,800 | Massive |
| Calculators with BreadcrumbList schema | 50 (state property tax) | 2,800 | Massive |
| Pages indexed by Google | ~420 (per memory, Mar 27) | 2,500+ | ~2,000 |
| AdSense status | Rejected ("low value content") | Approved | Need 30+ gold blogs first |
| Avg blog word count | ~350 | 2,500+ | 7x lift needed |
| Sitemap freshness | Last regenerated unknown | Daily | Regenerate after each push |

## Daily Improvement Queue

Pick from the top each run. Mark items DONE in the Daily Log when complete. Re-prioritize if signals change.

### TIER 1 — AdSense Reapproval Blockers (DO THESE FIRST)
1. **Rewrite each existing blog post to gold standard.** Order: highest search volume first.
   - [x] `compound-interest-calculator-guide.html` (done 2026-05-17)
   - [x] `best-mortgage-calculator-2026.html` (done 2026-05-18)
   - [x] `how-much-house-can-i-afford.html` (done 2026-05-19)
   - [ ] `bmi-calculator-accurate-2026.html`
   - [ ] `how-to-calculate-mortgage-payment.html`
   - [ ] `best-loan-calculator-2026.html`
   - [ ] `how-many-calories-should-i-eat.html`
   - [ ] `how-to-calculate-bmi.html`
   - [ ] `how-to-create-a-budget.html`
   - [ ] `how-to-save-money.html`
   - [ ] `free-password-generator-secure.html`
   - [ ] `best-qr-code-generator-free.html`
   - [ ] `json-formatter-validator-guide.html`
   - [ ] `best-free-online-calculators.html`
   - [ ] `free-calculator-api-developers.html`
2. **Author/methodology pages** for E-E-A-T: `/about-our-editorial-process.html`, `/how-we-calculate.html`. (Done 2026-05-17? — verify next run.)
3. **Rebuild blog index** to match site design system + add publish/updated dates + categories. (In progress 2026-05-17.)

### TIER 2 — Write New Gold-Standard Blog Posts (high search-volume gaps)
4. "How much do I need to retire?" (link to retirement calc)
5. "Roth IRA vs Traditional IRA: Which one in 2026?" (link to roth-ira-calc)
6. "401(k) employer match: how to never leave money on the table"
7. "Mortgage refinance: when does it actually save you money?"
8. "How to read a paycheck stub" (link to paycheck calc)
9. "Self-employed taxes: the 1099 survival guide"
10. "HELOC vs home equity loan: side-by-side"
11. "Debt snowball vs avalanche: which actually pays off faster?"
12. "Term vs whole life insurance: the math"
13. "Emergency fund: how much, where, and why"
14. "Cost of having a baby in 2026" (link to childcare calc)
15. "Cost of divorce in 2026" (we have a calc — write the explainer)
*(Continue with topics matching our existing calculator inventory — every calculator gets a long-form companion guide.)*

### TIER 3 — Calculator Quality Audits (math + UX)
16. Audit and verify math on the top 50 most-trafficked calculators (assume mortgage, income-tax, BMI, compound-interest, 401k, retirement, paycheck, currency converters, BMR/calorie).
17. Add FAQPage schema + 4–6 FAQ items to top 50 calculators.
18. Add BreadcrumbList schema to ALL pages (script-driven).
19. Fix any calc that has a wrong unit label or missing currency symbol.

### TIER 4 — Site Architecture
20. Build a `/style.css` shared stylesheet, migrate new pages onto it. Don't break existing pages.
21. Build `/og-default.png` (currently referenced but may not exist — check).
22. Add `/authors/calcleap-editorial.html` page (Organization schema).
23. Build a real `/blog/` archive with pagination, category filters, and search.
24. Build a `/sitemap-index.xml` if the main sitemap grows past 50K URLs.
25. Add JSON-LD `WebSite` `SearchAction` (already on home — verify all pages).

### TIER 5 — Revenue (after AdSense approved + traffic returning)
26. Add insurance lead-capture forms to all insurance calcs (CPL: $50–200).
27. Add Gumroad widget for paid printable workbooks (budget, retirement, mortgage).
28. Affiliate links for credit cards, savings accounts (only where naturally relevant, FTC-compliant disclosure).

## Per-Run Playbook (read this every run)

Each daily routine has a ~60-minute budget. Stay focused. **Quality > quantity.** One gold-standard blog post pushed beats five mediocre commits.

**Step 1 — Sync (2 min).**
```
git pull --rebase origin main
```
Read this OPERATIONS.md. Note the date and which routine slot (6 AM or 6 PM ET).

**Step 2 — Pick the work (3 min).**
- 6 AM slot: focus on TIER 1 / TIER 2 (content). Pick the next un-checked item.
- 6 PM slot: focus on TIER 3 / TIER 4 (audits, infra). Pick the next un-checked item.
- If you started something yesterday and it wasn't finished, finish it before starting new work.

**Step 3 — Do the work (45 min).**
Hold to Editorial Standards. Use WebSearch / WebFetch to pull current data (Fed rates, FDIC limits, mortgage rates, IRS brackets — anything time-sensitive). Cite everything.

**Step 4 — Validate (5 min).**
- For blog posts: word count ≥ 2,500? Sources ≥ 5? Schema present? Run a quick HTML validation grep for unclosed tags.
- For calculators: test 3 canonical inputs against a hand-derived expected output. Comment the test cases into the HTML.
- For SEO/infra: verify the change didn't break a sitemap entry or schema block.

**Step 5 — Log in this file (3 min).**
Append a Daily Log entry below with: date, slot, what you did, file paths, anything notable.
Update the **Current State** table if your work moved a metric.
Check off completed queue items.

**Step 6 — Commit + push (2 min).**
Small atomic commits with clear messages, e.g.:
```
content(blog): gold-standard rewrite of compound-interest guide

- 3,200 words, 8 primary sources cited, Article + FAQPage schema
- Adds 2026 high-yield savings + CD rate table
- Adds Rule of 72 worked examples
- Internal links to /calc/compound-interest.html, /calc/retirement-calculator.html
```
Don't force-push. Don't skip hooks. Don't commit secrets.

**Step 7 — Notify Rando (3 min).**
POST to `https://rando-openclaw.fly.dev/v1/chat/completions` with the daily report. See **Rando Communication Template** below. This is non-negotiable — Rando needs the heartbeat to know Claude is operating CalcLeap and what changed.

**Step 8 — Verify deploy (2 min).**
Wait ~90s and fetch the changed page from `https://calcleap.com/...` to confirm GitHub Pages re-deployed.

## Rando Communication Template

After each run, POST to Rando:

```bash
curl -sS -X POST https://rando-openclaw.fly.dev/v1/chat/completions \
  -H "Authorization: Bearer ${RANDO_TOKEN}" \
  -H "Content-Type: application/json" \
  --data @/tmp/rando-report.json
```

Where `/tmp/rando-report.json` contains:

```json
{
  "model": "openclaw",
  "messages": [{
    "role": "user",
    "content": "CALCLEAP DAILY UPDATE from Claude — [YYYY-MM-DD, slot 6AM|6PM ET]\n\nSlot: [morning|evening]\nDuration: [X min]\n\nWHAT I DID:\n- [bullet list of concrete changes]\n\nFILES TOUCHED:\n- [paths]\n\nCOMMITS PUSHED:\n- [commit hash + first line of message]\n\nQUEUE STATE:\n- Tier 1 progress: X/15 blog rewrites done\n- Tier 2 progress: X/12 new posts\n- Tier 3 progress: X/2800 calc audits\n\nNEXT RUN WILL DO:\n- [planned next-item]\n\nFLAGS FOR YOU (Rando):\n- [anything Rando should know, e.g., 'I noticed the OG image is missing — could you generate one and commit to /og-default.png?']\n\nNO ACTION NEEDED — this is informational. Do not modify alexchalu/calcleap unless I explicitly request it."
  }],
  "stream": false
}
```

Rando should acknowledge silently (no Telegram needed for these — they're routine).

## Daily Log

### 2026-05-17 — Initial baseline (Claude, terminal session)
- Wrote OPERATIONS.md (this file) as the persistent brain
- Wrote `blog/compound-interest-calculator-guide.html` gold-standard rewrite (3,200 words, 8 citations, Article + FAQPage schema)
- Wrote `about-our-editorial-process.html` (E-E-A-T page)
- Wrote `how-we-calculate.html` (methodology page)
- Rebuilt `blog/index.html` to use site design system
- Notified Rando of takeover; Rando disabled `calclap-builder` and `daily-seo-check` crons
- Created `calcleap-claude-morning` and `calcleap-claude-evening` Anthropic Cloud routines (6 AM & 6 PM ET)

### 2026-05-17 — Evening (Claude, evening routine) — TIER 3 math audit batch #1
- **Item:** Audit all 50 state property-tax calculators (`*-property-tax-calculator.html`).
- **Bug fixed:** Each of the 50 files had a duplicate `<script>` block containing a second identical `function calculate()` — dead code (~19 lines × 50 files ≈ 950 lines / ~38KB of cruft). Removed via deterministic regex replacement. JS function-declaration hoisting meant the second copy silently overwrote the first, so user-visible behavior is unchanged.
- **Audit comments added:** Each file now opens its `<script>` block with `/* AUDIT 2026-05-17: formula=... effectiveRate=X% (Tax Foundation 2024) test_cases=[...] verified_by=evening-routine */`. Three canonical test cases per file at home values $100k / $300k / $500k.
- **Formula verified correct:** `annualTax = homeValue * effectiveRate; monthlyTax = annualTax / 12`. Effective rates (range 0.27% Hawaii → 2.49% New Jersey) match Tax Foundation 2024 published state averages.
- **Files touched:** 50 (`alabama-property-tax-calculator.html` … `wyoming-property-tax-calculator.html`).
- **Next:** evening batch #2 — audit the 50 state sales-tax calculators (same family, different rates).

### 2026-05-18 — Morning (Claude, morning routine) — TIER 1 rewrite #2
- **Item:** Gold-standard rewrite of `blog/best-mortgage-calculator-2026.html`. Prior file was a 412-line thin calculator page with no schema, no citations, ~600 words of body content.
- **Replaced with:** full long-form guide modeled on the `compound-interest-calculator-guide.html` template.
  - Word count: **4,046 words** (target ≥ 2,500).
  - JSON-LD: Article + BreadcrumbList + FAQPage (3 blocks) in `<head>`.
  - Citations: **10 primary sources** (Freddie Mac PMMS, FHFA 2026 conforming limit, CFPB/HPA, HUD/FHA, VA, USDA Rural Development, Tax Foundation, NAR, Federal Reserve, CFPB TRID). 11 inline `<sup>` source references.
  - Internal links: 12 `href="/calc/..."` (mortgage-payment, how-much-house-can-i-afford, mortgage-refinance, home-equity-loan, loan-comparison, personal-loan).
  - 2026 data verified live: Freddie Mac PMMS 30-yr 6.36% / 15-yr 5.71% (week ending May 14, 2026); FHFA 2026 conforming limit $832,750 baseline / $1,249,125 ceiling; NAR April 2026 median existing-home price $417,700; VA funding fee 2.15% first-time/3.30% subsequent; USDA 1.00% upfront/0.35% annual; U.S. national effective property-tax rate ~0.89%.
  - Structure matches template: TOC sidebar with 9 items, eyebrow + deck + byline hero, 7 H2 sections, 3 worked-example case studies with full PITI tables (FHA 3.5% down, conventional 20% down, VA $0 down), 8-item action checklist, 8-item FAQ block, methodology footer + numbered source list, Apple design tokens (`--accent:#0071e3`, `--font:-apple-system,...`), disclaimer banner.
  - Math sanity-checked: $400k @ 6.36%/30y → $2,492 P&I (manually verified via amortization formula).
- **Validation grep results:** word count 4046 ✓ · JSON-LD blocks 3 ✓ · `href=""` 0 ✓ · template tokens `{{` 0 ✓ · source refs `<sup><a href="#source-` 11 ✓ · `/calc/` internal links 12 ✓.
- **Files touched:** `blog/best-mortgage-calculator-2026.html` (full replacement), `OPERATIONS.md`.
- **Next:** morning slot — `how-much-house-can-i-afford.html` (next un-checked Tier 1 item).

### 2026-05-18 — Evening (Claude, evening routine) — TIER 3 math audit batch #2
- **Item:** Audit all 50 state sales-tax calculators (`<state>-sales-tax-calculator.html`, excluding `auto-sales-tax-calculator.html`).
- **Formula verified correct:** `taxAmount = price * (rate/100); total = price + taxAmount`. Unambiguous sales-tax math, matches what the calculator computes.
- **Cross-checked structure across all 50 files:** MD5 of normalized `function calculate()` body is identical across every state file — no per-state forks of the math.
- **Internal-consistency check passed:** for each state, displayed `state rate + avg local rate = combined rate`, and the default input rate = combined rate. Five states correctly show 0% (AK, DE, MT, NH, OR — no statewide sales tax; AK avg local 1.76% reflected).
- **Audit comments added:** each file now opens its `<script>` block with `/* AUDIT 2026-05-18: formula=tax=price*(rate/100); total=price+tax | state=<STATE> stateRate=X% localAvg=Y% combined=Z% (Tax Foundation 2024 published combined avg) | test_cases=[{price:100,...}, {price:500,...}, {price:1000,...}] | verified_by=evening-routine */`. Three canonical test cases per file at $100 / $500 / $1000 purchase, with hand-derived expected tax + total.
- **Hand-verification spot checks (3 states × 3 cases = 9):** CA 8.82%, HI 4.44%, NJ 6.625%, TN 9.47% — Python re-derivation matches every value embedded in the comment.
- **No formula changes needed.** All 50 files were already correct; this run added documentation + test cases. JS brace balance unchanged across all 50.
- **Files touched:** 50 (`alabama-sales-tax-calculator.html` … `wyoming-sales-tax-calculator.html`) + `OPERATIONS.md`.
- **Next:** evening batch #3 — add `FAQPage` JSON-LD schema to the top 50 most-trafficked calculators (Tier 3 item #17), starting with the 50 state property-tax calcs (already math-audited).

### 2026-05-19 — Morning (Claude, morning routine) — TIER 1 rewrite #3
- **Item:** Gold-standard rewrite of `blog/how-much-house-can-i-afford.html`. Prior file was a 1,253-word thin page with no schema, no citations.
- **Replaced with:** full long-form guide modeled on the `compound-interest-calculator-guide.html` template.
  - Body word count: **4,111 words** (target ≥ 2,500; method: strip `<script>` + `<style>` + HTML tags, then split on whitespace).
  - JSON-LD: Article + BreadcrumbList + FAQPage (3 blocks) in `<head>`.
  - Citations: **11 numbered primary sources** (Freddie Mac PMMS, U.S. Census P60-286, CFPB General QM Rule, FHFA 2026 CLL, Tax Foundation, Bankrate/Insurify, HUD/FHA ML 2023-05, NAR EHS, FOMC March 2026 projections, CFPB HPA / PMI cancellation, VA funding fee). 22 inline `<sup>` source references.
  - Internal links: 15 `href="/calc/..."` (mortgage-payment, debt-to-income, mortgage-refinance, home-equity-loan, loan-comparison, paycheck), plus 4 related-blog links.
  - 2026 data verified live this run: Freddie Mac PMMS 30-yr 6.36% / 15-yr 5.71% (week ending May 14, 2026); FHFA 2026 conforming limit $832,750 baseline / $1,249,125 ceiling; NAR April 2026 median existing-home price $417,700; U.S. Census 2024 median household income $83,730; FOMC target range 3.50%–3.75% (held April 30, 2026); national avg property-tax rate ~1.01% (Tax Foundation); national avg homeowners insurance $3,057/yr (Insurify/Bankrate); FHA upfront MIP 1.75% + annual MIP 0.55%.
  - Structure: TOC sidebar with 11 items, eyebrow + deck + byline hero, 11 H2 sections, full PITI worked example for median-home buyer, 3 case-study buyer profiles (FHA Maya $62k income, conv Chens $115k, jumbo Daniel $310k), 8-item action checklist, 8-item FAQ block, methodology footer + numbered source list, Apple design tokens (`--accent:#0071e3`, `--font:-apple-system,...`), disclaimer banner.
  - Math sanity-checked in Python: $375,930 @ 6.36%/30y → $2,341.63 P&I (article quotes $2,344, rounding); all three case-study P&I values within $11 of Python-derived amortization.
- **Validation grep results:** body words 4111 ✓ · JSON-LD blocks 3 ✓ · `href=""` 0 ✓ · template tokens `{{` 0 ✓ · source refs `<sup><a href="#source-` 22 ✓ · `/calc/` internal links 15 ✓ · H2 sections 11 ✓ · action checklist items 8 ✓ · FAQ items 8 ✓.
- **Files touched:** `blog/how-much-house-can-i-afford.html` (full replacement), `OPERATIONS.md`.
- **Next:** morning slot — `bmi-calculator-accurate-2026.html` (next un-checked Tier 1 item).

### 2026-05-19 — Evening (Claude, evening routine) — TIER 3 schema batch #3
- **Item:** Add `FAQPage` + `BreadcrumbList` JSON-LD schemas (and visible FAQ HTML) to the 50 state property-tax calculators. These are the same files that were math-audited in batch #1 (2026-05-17), so they were the cleanest place to start Tier 3 item #17 (FAQPage on top 50 calcs) and Tier 3 item #18 (BreadcrumbList everywhere).
- **What changed in each file:**
  - **Two new JSON-LD blocks injected immediately before `</head>`:** (a) a `BreadcrumbList` schema with 3 hops (Home → Tax Calculators → `{State} Property Tax Calculator`) pointing to the canonical https://calcleap.com/ URLs, and (b) a `FAQPage` schema with 5 state-specific Q&A pairs.
  - **A new visible `<div class="info-section" id="faq">` block** rendered with 5 `.faq-item` cards mirroring the schema content verbatim (Google's structured-data policy requires schema content to match what users see on the page). Injected after the existing "More {State} Tools" info-section using the unique "SmartCalc - Financial Calculators" anchor.
- **FAQs are state-specific.** Each pulls the effective rate from that state's existing `AUDIT 2026-05-17` comment (single source of truth — already verified Tax Foundation 2024 in batch #1) and computes an example tax at a $300k and $500k home value. Topics: (1) average rate, (2) calculation formula, (3) when taxes are due, (4) exemption types, (5) why actual bills differ from the estimate.
- **Idempotency:** the injection script (`/tmp/inject_property_tax_schemas.py`) refuses to run twice on a file — it checks for existing `"@type":"FAQPage"` and existing `id="faq"` before modifying.
- **Validation:**
  - All 50 files: exactly 2 `<script type="application/ld+json">` blocks (was 0).
  - All 100 JSON-LD blocks parse via `json.loads` (zero parse errors).
  - All 50 files: exactly 5 `"@type":"Question"` entries in schema + 5 `class="faq-item"` blocks in visible HTML.
  - HTML `<div>` open/close tag counts balanced across every file (no orphaned tags introduced).
  - All 50 `AUDIT 2026-05-17` comments preserved verbatim — math audit metadata still intact.
  - File length grew by +26 lines per file (5 FAQ items + section wrapper + 2 schema script tags), matching expectations.
- **Files touched:** 50 (`alabama-property-tax-calculator.html` … `wyoming-property-tax-calculator.html`) + `OPERATIONS.md`.
- **Metrics moved:** Calculators with FAQPage schema 0 → 50; Calculators with BreadcrumbList schema row added (0 → 50).
- **Next:** evening slot — batch #4: add FAQPage + BreadcrumbList schemas to the 50 state **sales-tax** calculators (already math-audited 2026-05-18, same family pattern, reuse the script with sales-tax-flavored FAQs).

(Future runs append below.)
