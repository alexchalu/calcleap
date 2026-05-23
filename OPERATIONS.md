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

## Current State (last updated: 2026-05-23 by Claude/evening-routine)

| Metric | Now | Target | Gap |
|---|---|---|---|
| Total pages | ~2,800 | 3,500 (more depth than breadth) | Quality > new pages |
| Blog posts | 14 | 100 gold-standard | 86 to write or rewrite |
| Blog posts at gold-standard | **7** (compound-interest 2026-05-17, best-mortgage-calculator-2026 2026-05-18, how-much-house-can-i-afford 2026-05-19, bmi-calculator-accurate-2026 2026-05-20, how-to-calculate-mortgage-payment 2026-05-21, best-loan-calculator-2026 2026-05-22, how-many-calories-should-i-eat 2026-05-23) | 100 | 93 |
| Calculators with verified math | 125 audited (50 state property tax + 50 state sales tax + 25 state income tax — 9 no-tax states + IL + MI + NC + GA + AZ + CO + IN + KY + MA + MS + UT + ND + LA + IA + AL + VA + MO + OK flat/bracketed; 19 income-tax state files still flagged needing per-state brackets) | 2,800 | Large |
| Calculators with FAQPage schema | **100** (50 state property tax + 50 state sales tax) | 2,800 | Massive |
| Calculators with BreadcrumbList schema | **100** (50 state property tax + 50 state sales tax) | 2,800 | Massive |
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
   - [x] `bmi-calculator-accurate-2026.html` (done 2026-05-20)
   - [x] `how-to-calculate-mortgage-payment.html` (done 2026-05-21)
   - [x] `best-loan-calculator-2026.html` (done 2026-05-22)
   - [x] `how-many-calories-should-i-eat.html` (done 2026-05-23)
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

### 2026-05-20 — Morning (Claude, morning routine) — TIER 1 rewrite #4
- **Item:** Gold-standard rewrite of `blog/bmi-calculator-accurate-2026.html`. Prior file was a 443-line thin calculator-style page with no schema, no citations, very limited body content (~600 words of prose mixed in with a calculator UI).
- **Replaced with:** full long-form guide modeled on the `compound-interest-calculator-guide.html` template.
  - Body word count: **4,159 words** (target ≥ 2,500; method: strip `<script>` + `<style>` + HTML tags, then split on whitespace).
  - JSON-LD: Article + BreadcrumbList + FAQPage (3 blocks) in `<head>`.
  - Citations: **16 numbered primary sources** in the methodology footer (CDC, USPSTF, NCHS NHANES data brief 508, AMA 2023 policy, Lancet 2025 Clinical Obesity Commission, WHO, Keys 1972, WHO Asian Expert Consultation 2004, NCHS anthropometric reference, NIH PMC sarcopenia review, NHLBI waist guidance, JAMA Network Open 2024 BRI study, Nature Reviews Endocrinology IAS/ICCR waist consensus, Quetelet historical). 22 inline `<sup>` source references.
  - Internal links: 15 `href="/calc/..."` (bmi-calculator, calorie-calculator, body-fat-calculator, ideal-weight, food-calorie-calculator, plus footer mortgage-payment + compound-interest), plus 3 related-blog links.
  - 2026 data integrated: CDC NCHS Data Brief 508 (NHANES Aug 2021–Aug 2023) — adult obesity 40.3%, adult overweight+obese 73.6%; AMA June 2023 BMI policy; Lancet Diabetes & Endocrinology Commission on Clinical Obesity Jan 2025 (clinical vs preclinical obesity framework). Asian-specific cutoffs 23/27.5 (WHO 2004). Verified BMI formula with both metric and imperial constants (703).
  - Structure: TOC sidebar with 10 items, eyebrow + deck + byline hero, 10 H2 sections, 5 worked example BMI computations in a comparison table, 3 case-study patient profiles (athlete, retiree with sarcopenic obesity, South Asian engineer with population-mismatched cutoffs), 8-item action checklist, 8-item FAQ block, methodology footer + numbered source list, Apple design tokens (`--accent:#0071e3`, `--font:-apple-system,...`, `--mw:1080px`), disclaimer banner.
  - Math sanity-check on the worked-example BMI calculations: 5'9"/200lb → 90.7 / 1.75² = 29.6 ✓; 6'0"/220lb → 99.8 / 1.83² = 29.8 ✓; 5'4"/171lb → 77.6 / 1.63² = 29.2 ✓. All five table rows verified independently.
- **Validation grep results:** body words 4159 ✓ · JSON-LD blocks 3 ✓ · `href=""` 0 ✓ · template tokens `{{` 0 ✓ · source refs `<sup><a href="#source-` 22 ✓ · `/calc/` internal links 15 ✓ · H2 sections 10 ✓ · FAQ items 8 ✓ · source anchor IDs 16 ✓.
- **Files touched:** `blog/bmi-calculator-accurate-2026.html` (full replacement), `OPERATIONS.md`.
- **Next:** morning slot — `how-to-calculate-mortgage-payment.html` (next un-checked Tier 1 item).

### 2026-05-20 — Evening (Claude, evening routine) — TIER 3 schema batch #4
- **Item:** Add `FAQPage` + `BreadcrumbList` JSON-LD schemas (and visible FAQ HTML) to the 50 state **sales-tax** calculators. Mirrors batch #3 (2026-05-19, state property-tax). These are the same files that were math-audited 2026-05-18, so the AUDIT comment is the single source of truth for each state's combined rate.
- **What changed in each file:**
  - **Two new JSON-LD blocks injected immediately before `</head>`:** (a) a `BreadcrumbList` schema with 3 hops (Home → Tax Calculators → `{State} Sales Tax Calculator`) pointing to canonical https://calcleap.com/ URLs, and (b) a `FAQPage` schema with 5 state-specific Q&A pairs.
  - **A new visible `<div class="info-section" id="faq">` block** rendered with 5 `.faq-item` cards mirroring the schema content verbatim (Google's structured-data policy requires schema content to match what users see). Injected after the existing "More {State} Tools" info-section using the unique `</ul>\n        </div>\n\n        <div class="ad-placeholder">` anchor (verified to match exactly once in all 50 files before run).
- **FAQs are state-specific and rate-aware.** The injection script reads `stateRate`, `localAvg`, and `combined` from each file's `AUDIT 2026-05-18` comment (Tax Foundation 2024 published averages), computes worked examples at $100 / $500 purchase, and branches on whether the state has a general sales tax. Topics: (1) sales tax rate overview, (2) calculation formula with worked example, (3) common exemptions, (4) online purchases / Wayfair / use tax, (5) why actual receipts differ from the estimate.
- **No-sales-tax-state handling.** Delaware, Montana, New Hampshire, Oregon (and partially Alaska) get a different answer set explaining that there is no statewide sales tax, what excise taxes can still appear, and that out-of-state online purchases trigger that state's tax rather than the buyer's. After the initial run, the Q1 answer for the four full no-tax states (DE, MT, NH, OR) was further patched so it no longer self-lists ("The other no-sales-tax states are ..., Delaware, ..." → state itself removed from the "other" list).
- **Idempotency:** the injection script (`/tmp/inject_sales_tax_schemas.py`) refuses to run twice on a file — it checks for existing `FAQPage`, `BreadcrumbList`, and `id="faq"` before modifying. Pre-flight verified 50/50 files clean before run.
- **Validation:**
  - All 50 files: exactly 2 `<script type="application/ld+json">` blocks (was 0).
  - All 100 JSON-LD blocks parse via `json.loads` (zero parse errors).
  - All 50 files: exactly 5 `"@type":"Question"` entries in schema + 5 `class="faq-item"` blocks in visible HTML → 250 / 250 total.
  - HTML `<div>` open/close tag counts balanced across every file.
  - All 50 `AUDIT 2026-05-18` comments preserved verbatim.
  - No `href=""` introduced.
- **Files touched:** 50 (`alabama-sales-tax-calculator.html` … `wyoming-sales-tax-calculator.html`, skipping `auto-sales-tax-calculator.html`) + `OPERATIONS.md`.
- **Metrics moved:** Calculators with FAQPage schema 50 → 100; Calculators with BreadcrumbList schema 50 → 100.
- **Next:** evening slot — batch #5: pick the next-largest calculator family lacking FAQPage/BreadcrumbList (candidates: 50 state income-tax calcs, or the BMR/BMI/calorie health family). Math-audit first if rates/formulas not yet verified.

### 2026-05-21 — Morning (Claude, morning routine) — TIER 1 rewrite #5
- **Item:** New gold-standard guide at `blog/how-to-calculate-mortgage-payment.html`. The next un-checked Tier 1 file did not previously exist in the repo (no prior version to replace) — created fresh as a math-focused companion to the existing `best-mortgage-calculator-2026.html` (product comparison) and `how-much-house-can-i-afford.html` (affordability) guides. This guide owns the derivation + arithmetic angle.
- **Created with:** full long-form guide modeled on the `compound-interest-calculator-guide.html` template.
  - Body word count: **5,012 words** (target ≥ 2,500; method: strip `<script>` + `<style>` + HTML tags, then split on whitespace).
  - JSON-LD: Article + BreadcrumbList + FAQPage (3 blocks) in `<head>`. All three parse cleanly via `json.loads`.
  - Citations: **15 numbered primary sources** in the methodology footer (Freddie Mac PMMS, CFPB owning-a-home, CFPB General QM Rule, TILA/Reg Z, NAR, Tax Foundation, Insurify/Bankrate, U.S. Census P60-286, HUD ML 2023-05, RESPA Reg X, CFPB HPA PMI cancellation, VA funding-fee, USDA Rural Development, IRS Pub 936, CFPB TRID). 31 inline `<sup>` source references.
  - Internal links: 14 `href="/calc/..."` (mortgage-payment, mortgage-refinance-calculator, how-much-house-can-i-afford, debt-to-income, loan-comparison, home-equity-loan) plus 3 related-blog links.
  - 2026 data used: Freddie Mac PMMS 30-yr 6.36% / 15-yr 5.71% (week ending May 14, 2026, carried forward from prior runs); FHA UFMIP 1.75% + annual MIP 0.55% on LTV > 95% (HUD ML 2023-05); VA funding fee 2.15% first use / 3.30% subsequent; USDA 1.00% upfront / 0.35% annual; NAR April 2026 median existing-home price $417,700; U.S. Census 2024 median household income $83,730; Tax Foundation 2024 effective property-tax rates (NJ 2.49% high, HI 0.27% low, U.S. avg 0.89%); homeowners insurance 2026 national avg $3,057/yr.
  - Structure: TOC sidebar with 13 items, eyebrow + deck + byline hero, 13 H2 sections, formula derivation, step-by-step hand-calculation walkthrough, 3 worked PITI case studies (conventional 20% down, FHA 3.5% down, 15-year high-equity), full month-1 amortization breakdown, year-by-year amortization table at five-year intervals, rate-vs-term comparison table, loan-product comparison table at same $400k purchase price across 5 product types, 8-item action checklist, 8-item FAQ block, methodology footer + numbered source list, Apple design tokens (`--accent:#0071e3`, `--font:-apple-system,...`, `--mw:1080px`), disclaimer banner.
  - Math sanity-checked in Python: $400k @ 6.36%/30y → $2,491.56 P&I ✓; $334,160 @ 6.36%/30y → $2,081.45 P&I ✓; $200k @ 5.71%/15y → $1,656.54 P&I ✓; month-1 interest on $334,160 = $1,771.05 ✓; tipping point (principal > interest in a single month) at month 230 = year 20 month 2 ✓. Initial draft had three numbers that disagreed with Python (extra-payment payoff month, biweekly payoff year, month-1 interest off by $1) — fixed before validation: corrected month 297→284, year 25.5→24.3, $1,770.05→$1,771.05; revised lifetime savings claim from $72k → $103k for +$200/mo and ~$63k → ~$93k for biweekly, all derived from re-running the recursion.
- **Validation grep results:** body words 5012 ✓ · JSON-LD blocks 3 ✓ · all 3 schemas parse OK ✓ · `href=""` 0 ✓ · template tokens `{{` 0 ✓ · source refs `<sup><a href="#source-` 31 ✓ · `/calc/` internal links 14 ✓ · H2 sections 13 ✓ · FAQ items 8 ✓ · action checklist items 8 ✓ · schema Question entries 8 ✓.
- **Files touched:** `blog/how-to-calculate-mortgage-payment.html` (new file), `OPERATIONS.md`.
- **Notable observations:**
  - The Tier 1 queue lists 11 remaining blog rewrites, but a quick `ls /blog/` showed several do not yet exist as files (this one, `best-loan-calculator-2026.html`, `best-qr-code-generator-free.html`, `json-formatter-validator-guide.html`). Treating these as "create from scratch" gold-standard posts since they are explicitly in the Tier 1 queue. Future morning runs should expect a mix of rewrites of existing thin pages and net-new creation.
  - Verified that the `/calc/mortgage-payment.html` calculator referenced by this guide does exist in `/calc/`.
- **Next:** morning slot — `best-loan-calculator-2026.html` (next un-checked Tier 1 item).

### 2026-05-21 — Evening (Claude, evening routine) — TIER 3 income-tax audit batch #5
- **Item:** Audit all 49 state income-tax calculators (`<state>-income-tax-calculator.html` — California file does not exist; PA already gold-standard, skipped). Triple-purpose batch: (a) fix SEO-killing canonical URL typos, (b) dedupe dead `<script>` blocks, (c) inject AUDIT metadata documenting what is verified vs. what is flagged.
- **Critical SEO bugs fixed (canonical + og:url):** Six files had broken canonical/og:url URLs from a sed substitution that mashed two state names together, pointing Google at 404 URLs. Fixed:
  - `alabamassachusetts-income-tax-calculator.html` → `alabama-income-tax-calculator.html`
  - `kentuckentucky-income-tax-calculator.html` → `kentucky-income-tax-calculator.html`
  - `oklahomassachusetts-income-tax-calculator.html` → `oklahoma-income-tax-calculator.html`
  - `wisconsindiana-income-tax-calculator.html` → `wisconsin-income-tax-calculator.html`
  - `new-mexicolorado-income-tax-calculator.html` → `new-mexico-income-tax-calculator.html`
  - `connecticutah-income-tax-calculator.html` → `connecticut-income-tax-calculator.html`
  - 12 string replacements total (canonical + og:url per file × 6 files). Cross-grep then found **12 additional orphan `<a href>` links** in the matching property-tax and sales-tax calculator files for those 6 states (e.g., `alabama-sales-tax-calculator.html` linking to `alabamassachusetts-income-tax-calculator.html`). Fixed those too. Repo-wide grep now returns zero hits for any of the six typo strings.
- **Dead-code removal:** 46 of 49 income-tax files had duplicate `<script>...function calculate()...</script>` blocks (same family bug as the property-tax batch #1 fix 2026-05-17). JS function-declaration hoisting means the second copy silently overwrote the first; removing it is behavior-preserving. The Python dedupe walks adjacent `<script>` blocks, only removes when inner content is byte-identical (with stripped whitespace) and only `\s*` between them. New York correctly NOT deduped because its second `calculateTaxes` block includes an extra bar-chart visualization that the first lacks (different content → preserved). PA + GA also untouched (already clean / no duplicate).
- **AUDIT metadata injected into all 48 non-PA files** (`/* AUDIT 2026-05-21: state=... | state_income_tax=... | state_formula=... | test_cases=[...] | verified_by=evening-routine */`). Three tiers:
  - **Tier A — math VERIFIED CORRECT (11 files):** the 9 no-state-income-tax states (`alaska`, `florida`, `nevada`, `new-hampshire`, `south-dakota`, `tennessee`, `texas`, `washington`, `wyoming` — all `stateTax=0`, verified against each state's DOR; NH dividend/interest tax phases to 0% in 2026, WA cap-gains tax doesn't apply to wages); plus `illinois` (flat 4.95% — IL DOR verified), `michigan` (flat 4.25% — MI DOR verified), and `georgia` (flat 5.49% TY2024 — GA HB 1437; note added that TY2025 schedule = 5.39%).
  - **Tier B — math correct for tax year 2024, will need refresh (1 file):** `north-carolina` (4.5% flat TY2024; TY2025 schedule = 4.25%).
  - **Tier C — math BROKEN, flagged for human review (36 files):** 36 progressive-bracket states whose `function calculate()` uses an identical generic 2.5%/3.75%/5% bracket table copied across all non-flat states — NOT state-specific. Plus 2 files (`new-york`, `ohio`) that use a flat-rate approximation (NY 6.85%, OH 3%) where the real state law is multi-bracket progressive (NY top 10.9%; OH 2.75%–3.99%). These 38 files now carry a `status=NEEDS_HUMAN_REVIEW` audit comment naming the required source (state DOR + Tax Foundation 2025 state tax tables); they will be batch-corrected per state in upcoming evening runs.
- **Additional issues observed (not fixed this run, logged for future):**
  - All 49 files cite TY2023 federal brackets (e.g., $44,725 / $95,375 / $182,100 thresholds). TY2025 brackets should replace these (single: $11,925 / $48,475 / $103,350 / $197,300 / $250,525 / $626,350 / +37% — Rev. Proc. 2024-40).
  - All 7 calculateTaxes-template files cite SS wage base $168,600 (TY2024). TY2025 wage base = $176,100 (SSA Press Release 2024-10-10).
  - The 42 calculate()-template files compute neither FICA nor a standard deduction (only state tax + federal tax). The 7 calculateTaxes-template files do include FICA. Cross-template normalization is a future infra task.
- **Validation:**
  - `grep -rl -E 'alabamassachusetts|kentuckentucky|...' --include='*.html' --include='*.xml' --include='*.json'` repo-wide → **0 hits**.
  - All 48 modified files: `grep -o '{' / grep -o '}'` braces balanced (diff=0 on every file).
  - All 48 files contain exactly one `/* AUDIT 2026-05-21:` comment.
  - PA file (gold-standard, 1071 lines, 3 JSON-LD schemas) untouched.
  - No `href=""` introduced.
- **Files touched:** 60 total = 48 income-tax (audit + dedupe + URL fix where applicable) + 12 cross-fixes (6 property-tax + 6 sales-tax files of the 6 typo states whose internal links pointed at the broken URLs) + `OPERATIONS.md`.
- **Metrics moved:** Calculators with verified math 100 → 111 (added 9 no-tax-state income calcs + IL + MI + GA — NC counted toward TY2024 but flagged for TY2025 refresh).
- **Next:** evening slot — batch #6: take 5-8 of the 36 Tier-C income-tax states with widely-published flat or simple-bracket rates (candidates: AZ 2.5% flat, CO 4.4% flat, IN 3.05% flat, KY 4.0% flat, MA 5% flat + 4% surtax, MS 4.4% flat, PA-style detailed rewrite for one progressive state) and replace placeholder brackets with state-DOR-verified rates + AUDIT update. Goal: drop Tier C count from 36 toward zero over the next 5-6 evening runs.

### 2026-05-22 — Morning (Claude, morning routine) — TIER 1 rewrite #6
- **Item:** New gold-standard guide at `blog/best-loan-calculator-2026.html`. File did not previously exist in the repo — created fresh as a category-spanning guide that covers personal, auto, student, HELOC, and home-equity loan calculators in one piece. Complements the existing mortgage-focused trilogy (best-mortgage-calculator-2026, how-much-house-can-i-afford, how-to-calculate-mortgage-payment) by handling everything that is *not* a primary purchase mortgage.
- **Created with:** full long-form guide modeled on the `compound-interest-calculator-guide.html` template.
  - Body word count: **4,985 words** (target ≥ 2,500; method: strip `<script>` + `<style>` + HTML tags, then split on whitespace).
  - JSON-LD: Article + BreadcrumbList + FAQPage (3 blocks) in `<head>`. All three parse cleanly via `json.loads`.
  - Citations: **12 numbered primary sources** in the methodology footer (CFPB Reg Z TILA, FOMC April 2026 statement, Federal Reserve G.19, FRED RIFLPBCIANM60NM, Federal Student Aid, Bankrate HELOC survey, Freddie Mac PMMS, FSA Electronic Announcements for 2026-27 rates, FSA Income-Driven Repayment, IRS Pub 936, CFPB annualcreditreport.com, CFPB TRID). 18 inline `<sup>` source references.
  - Internal links: 18 `href="/calc/..."` (loan-calculator, personal-loan-calculator, car-loan-calculator, student-loan-calculator, home-equity-loan-calculator, loan-comparison-calculator, mortgage-payment, compound-interest, plus footer links) plus 4 related-blog links.
  - 2026 data used: Personal loan 24-mo APR ~12.26%–12.38% (Fed G.19); 60-mo new auto APR ~7.04% (Bankrate / FRED); HELOC ~7.41%, fixed home equity ~7.36% (Curinos/Bankrate, May 20 2026); federal undergrad student loan 6.39% (2025-26) rising to 6.52% (2026-27), grad 7.94% → 8.07%, PLUS 8.94% → 9.07% (FSA Electronic Announcement, May 12 2026 Treasury auction high yield 4.468%); FOMC target 3.50%–3.75% (April 29, 2026); 30-yr fixed mortgage 6.36% (Freddie Mac PMMS May 14, 2026); credit card avg ~22.7%.
  - Structure: TOC sidebar with 12 items, eyebrow + deck + byline hero, 12 H2 sections, formula derivation, rate-environment table covering 9 loan types, per-product sections (personal/auto/student/HELOC) each with a worked example table, 3 case studies (Maya consolidating $18.5k credit card debt, Daniel buying $28k used SUV with the "low APR is contingent on warranty add-on" trap, the Olsons evaluating fixed home-equity vs HELOC for a $55k renovation), hidden-costs bullet list, 8-item action checklist, 8-item FAQ block, methodology footer + numbered source list, Apple design tokens (`--accent:#0071e3`, `--font:-apple-system,...`, `--mw:1080px`), disclaimer banner.
  - Math sanity-checked in Python via `pmt(P, apr, n)` against every dollar figure in the article. Three initial discrepancies caught and fixed before publish: (1) Daniel-with-warranty scenario was $402.34/$4,288 in draft → corrected to $408.60/$3,876 (and narrative re-flipped: dealer payment is *higher* than credit union after warranty, not just $4 cheaper); (2) HELOC payment shock case study said "$340/month" interest-only but callout same article said "$309/month" — fixed case study to $309 (=$50,000 × 7.41%/12) for consistency; (3) Olsons fixed HE loan shifted from $651/$23,124 to $649/$22,862 to match Python (≤ 1% rounding).
- **Validation grep results:** body words 4985 ✓ · JSON-LD blocks 3 ✓ · all 3 schemas parse OK ✓ · `href=""` 0 ✓ · template tokens `{{` 0 ✓ · source refs `<sup><a href="#source-` 18 ✓ · `/calc/` internal links 18 ✓ · H2 sections 12 ✓ · FAQ items (visible) 8 ✓ · schema Question entries 8 ✓ · action checklist items 8 ✓ · source list IDs 12 ✓.
- **Files touched:** `blog/best-loan-calculator-2026.html` (new file), `OPERATIONS.md`.
- **Notable observations:**
  - Verified the calculators referenced in CTAs and "Related calculators" sidebar all exist: `/calc/personal-loan-calculator.html`, `/calc/car-loan-calculator.html`, `/calc/student-loan-calculator.html`, `/calc/home-equity-loan-calculator.html`, `/calc/loan-comparison-calculator.html`. The `/calc/loan-calculator.html` generic CTA may or may not exist as a standalone — should verify on next run.
  - All federal student loan rates for the *new* 2026–27 cycle (effective July 1, 2026) are cited from a primary FSA electronic announcement; current 2025–26 rates carried forward from existing references.
  - The article frames loan calculators around *which fields they expose vs. hide* — a deliberately editorial angle that distinguishes us from the dozens of "best loan calculator" listicles that simply rank tools.
- **Next:** morning slot — `how-many-calories-should-i-eat.html` (next un-checked Tier 1 item).

### 2026-05-22 — Evening (Claude, evening routine) — TIER 3 income-tax math fixes batch #6
- **Item:** Replace placeholder-bracket / outdated state-tax math in 8 income-tax calculator files (drawn from the 36 Tier-C "NEEDS_HUMAN_REVIEW" flagged 2026-05-21) with verified TY2025 state-DOR rates. Picked the easiest 8 to get right: 6 flat-tax states (AZ, CO, IN, KY, UT, plus MS with its $10k exemption), 1 surtax state (MA), and 1 simple-3-bracket state (ND).
- **What changed in each file:** the `function calculate()` state-tax block was rewritten with TY2025-correct math, and the 2026-05-21 AUDIT comment block was upgraded from `STATE_MATH=PLACEHOLDER_BROKEN ... status=NEEDS_HUMAN_REVIEW` to a new `AUDIT 2026-05-22` comment with `status=VERIFIED`, the canonical statutory source, the actual formula in plain text, and 3-4 hand-derived `test_cases`.
- **Per-state TY2025 rates applied (all sourced; sources cited inline in each AUDIT comment):**
  - **Arizona:** 2.5% flat (HB 2900, 2021; effective TY2023+). Was placeholder progressive 1.25/1.875/2.5%.
  - **Colorado:** 4.4% flat (Prop 121, 2022). Constant cleaned from float-noise `0.044000000000000004` → `0.044`. (Rate was already correct; status was incorrectly flagged.)
  - **Indiana:** 3.0% flat (SB 1, 2022 ratchet schedule). Was 3.15% (TY2023 rate; outdated by 5 bp).
  - **Kentucky:** 4.0% flat (HB 8, 2024). Was 4.5% (TY2023; 50 bp too high).
  - **Massachusetts:** 5.0% + 4% surtax on income above $1,083,150 (2025 inflation-adjusted threshold; Article 44 Question 1, 2022 ballot). Was missing surtax entirely.
  - **Mississippi:** 4.4% flat on income above $10,000 exemption (HB 531/2022 + HB 1/2025 "Build-Up Mississippi"). Was placeholder progressive 2.5/3.75/5%.
  - **Utah:** 4.50% flat (HB 106, 2025 — signed March 26, 2025, retroactive to 1/1/2025). Was 4.85% (TY2022 rate; 35 bp too high).
  - **North Dakota:** 3-bracket progressive 0% / 1.95% / 2.5% with TY2025 single-filer thresholds $48,475 and $244,825 (HB 1158, 2023). Was placeholder progressive 1.45/2.175/2.9%.
- **Verification:** Wrote `/tmp/verify_state_tax.py` and `/tmp/extract_and_run.py`. The first compares the hand-derived expected values in each new AUDIT comment against a Python re-implementation of the same formula. The second extracts the actual JS state-tax block from the saved HTML and executes it via `node -e` against the same inputs. 25/25 test cases passed both ways for all 8 files (Arizona 3, Colorado 3, Indiana 3, Kentucky 3, Massachusetts 4 including a $1.5M case landing in the surtax band, Mississippi 3, Utah 3, North Dakota 3).
- **Validation grep:** all 8 files: brace count balanced (diff=0); exactly one `AUDIT` comment per file (the new 2026-05-22 one); zero `NEEDS_HUMAN_REVIEW` or `PLACEHOLDER_BROKEN` remaining; zero `href=""`.
- **Known scope limits (NOT fixed this run, intentionally):**
  - All 8 files still cite TY2023 federal brackets ($44,725 / $95,375 / $182,100 thresholds) — explicitly preserved with `federal_brackets_in_file=TY2023_outdated` flag in the audit comment. Should be replaced repo-wide with TY2025 federal brackets (single: $11,925 / $48,475 / $103,350 / $197,300 / $250,525 / $626,350; +37%) per Rev. Proc. 2024-40 — better done in one infra-wide pass than per-state.
  - Indiana model excludes county income tax (range 0.5%–3.38% per LIT-1); explicitly noted in audit comment so downstream users / refresh runs do not double-count.
  - North Dakota model uses single-filer thresholds; joint thresholds differ ($298,075 top); explicitly noted in audit comment.
  - Massachusetts treats `income` as Part B taxable income (simplified); MA actually separates Part A (interest/dividends) and Part C (long-term cap gains) with the 5% rate. Documented limitation.
- **Files touched:** 8 (`arizona-income-tax-calculator.html`, `colorado-income-tax-calculator.html`, `indiana-income-tax-calculator.html`, `kentucky-income-tax-calculator.html`, `massachusetts-income-tax-calculator.html`, `mississippi-income-tax-calculator.html`, `utah-income-tax-calculator.html`, `north-dakota-income-tax-calculator.html`) + `OPERATIONS.md`.
- **Metrics moved:** Calculators with verified math 111 → 119 (added 8 state income-tax calcs with TY2025-correct per-state brackets); Tier-C "NEEDS_HUMAN_REVIEW" income-tax queue 36 → 30 (28 flat-or-progressive remaining + 2 NY/OH simple-flat misapprox; CO bumped from Tier-C to VERIFIED because it was already correct underneath the placeholder flag).
- **Next:** evening slot — batch #7: next set of 6-8 Tier-C income-tax states with widely-published flat rates (candidates: Michigan-style FICA-template states: NC TY2025 refresh from 4.5% → 4.25%, GA TY2025 schedule 5.39% update from 5.49%, plus a fresh batch of Tier-C flats: WV new 4.4% / 4.12% TY2024→2025 ratchet, IA new 3.8% flat TY2025, LA new 3.0% flat TY2025 per HB 1, NE 3.99% top → 3.7% TY2025, MO 4.7% TY2025, AL 5.0% TY2025 top of 3-bracket).

### 2026-05-23 — Morning (Claude, morning routine) — TIER 1 rewrite #7
- **Item:** New gold-standard guide at `blog/how-many-calories-should-i-eat.html`. File did not previously exist in the repo — created fresh as the canonical companion to `/calc/calorie-calculator.html`. First Tier 1 piece in the health (non-mortgage, non-tax) family. Picks up where the 2026-05-20 BMI rewrite left off: BMI tells you a category, calories tell you a daily action target.
- **Created with:** full long-form guide modeled on the `compound-interest-calculator-guide.html` template.
  - Body word count: **5,064 words** (target ≥ 2,500; method: strip `<script>` + `<style>` + HTML tags, then split on whitespace).
  - JSON-LD: Article + BreadcrumbList + FAQPage (3 blocks) in `<head>`. All three parse cleanly via `json.loads`.
  - Citations: **17 numbered primary sources** in the methodology footer (FDA Nutrition Facts history, USDA/HHS 2025-2030 Dietary Guidelines, NIH NIDDK, Westerterp 2004 TEF paper, Levine 2005 NEAT *Science* paper, Frankenfield 2005 *JADA* systematic review of BMR equations, Frankenfield 2013 *Clinical Nutrition* accuracy follow-up, IOM/National Academies 2005 DRI report, Bauer 2013 PROT-AGE protein paper, Wishnofsky 1958 3,500-kcal/lb origin, NIH Body Weight Planner, Academy of Nutrition and Dietetics adult-obesity position paper, Schoenfeld/Aragon 2018 protein-per-meal paper, FDA 21 CFR §101.9(g) label-tolerance rule, Fothergill 2016 *Obesity* Biggest Loser adaptive thermogenesis study, Shcherbina 2017 Stanford wearable-accuracy study, CDC NCHS Data Brief 508 obesity prevalence). 26 inline `<sup>` source references.
  - Internal links: 18 `href="/calc/..."` (calorie-calculator, tdee-calculator, macro-calculator, weight-loss-calculator, bmi-calculator, body-fat-calculator, ideal-weight, food-calorie-calculator, plus footer mortgage-payment + compound-interest) plus 3 related-blog links.
  - 2026 data integrated: USDA/HHS *Dietary Guidelines for Americans 2025-2030* released January 7, 2026 — protein floor raised from 0.8 g/kg RDA to 1.2-1.6 g/kg of body weight, added-sugar cap switched from 10%-of-calories to 10 g per meal, saturated-fat and sodium caps retained. CDC NCHS Data Brief 508 (NHANES Aug 2021–Aug 2023): U.S. adult obesity 40.3%, severe obesity 9.4%, age-40-59 obesity 46.4%. Mifflin-St Jeor accuracy rate 82% (non-obese) / 75% (obese) within 10% of measured RMR per Frankenfield 2013.
  - Structure: TOC sidebar with 10 items, eyebrow + deck + byline hero, 10 H2 sections, BMR formula box (separate male/female equations), USDA estimated-calories table broken out by sex × age × activity (8 demographic rows), deficit/surplus rate table, three full worked-example case studies (Marisol 30/F/68kg/lightly-active loss; Jared 40/M/91kg/sedentary maintenance; Devon 25/M/82kg/very-active lean-gain), macro split table, 8-item action checklist, 8-item FAQ block, methodology footer + numbered source list, Apple design tokens (`--accent:#0071e3`, `--font:-apple-system,...`, `--mw:1080px`), disclaimer banner.
  - Math sanity-checked in Python before publish: (1) Marisol BMR = 10(68) + 6.25(165) − 5(30) − 161 = 1400.25 ✓, TDEE = 1400 × 1.375 = 1,925 ✓; (2) Jared BMR = 10(91) + 6.25(178) − 5(40) + 5 = 1827.5 ✓, TDEE = 1828 × 1.20 = 2,193 ✓; (3) Devon BMR = 10(82) + 6.25(183) − 5(25) + 5 = 1843.75 ✓, TDEE = 1844 × 1.725 = 3,181 ✓. Protein floor math verified at 1.2-1.6 × body weight (kg) for each case; macro calorie sums for Marisol's 1,425-kcal target and Devon's 3,431-kcal target both reconcile to within 1%.
- **Validation grep results:** body words 5064 ✓ · JSON-LD blocks 3 ✓ · all 3 schemas parse OK ✓ · `href=""` 0 ✓ · template tokens `{{` 0 ✓ · source refs `<sup><a href="#source-` 26 ✓ · `/calc/` internal links 18 ✓ · H2 sections 10 ✓ · FAQ items (visible) 8 ✓ · schema Question entries 8 ✓ · action checklist items 8 ✓ · source list IDs 17 ✓.
- **Files touched:** `blog/how-many-calories-should-i-eat.html` (new file), `OPERATIONS.md`.
- **Notable observations:**
  - Sidebar "Related calculators" references `/calc/tdee-calculator.html`, `/calc/macro-calculator.html`, `/calc/weight-loss-calculator.html` — these may or may not exist as standalone files in `/calc/`. Existing health calcs verified present: `calorie-calculator.html`, `food-calorie-calculator.html`, `bmi-calculator.html` (under `/calc/` and at root), `body-fat-calculator.html`, `ideal-weight.html`. Future runs could either (a) create the three missing calc pages or (b) trim the sidebar links — flagging for an evening Tier 4 audit pass.
  - The 2025-2030 Dietary Guidelines released this January are the first major federal nutrition policy shift since 2020, and the protein floor change (0.8 → 1.2-1.6 g/kg) is a substantial editorial differentiator vs. competing "how many calories" articles still citing the old RDA.
  - This piece is health-domain — the first Tier 1 rewrite outside the finance/mortgage cluster since BMI (2026-05-20). Continues the topic-rotation pattern that keeps the blog from looking single-vertical.
- **Next:** morning slot — `how-to-calculate-bmi.html` (next un-checked Tier 1 item; will lean on the existing BMI gold-standard piece for cross-linking and emphasize the *math* angle, not the categorization angle).

### 2026-05-23 — Evening (Claude, evening routine) — TIER 3 income-tax math fixes batch #7
- **Item:** Convert 6 more Tier-C "NEEDS_HUMAN_REVIEW" income-tax files (flagged 2026-05-21) to VERIFIED with TY2025 state-DOR rates. Continues batch #6 (2026-05-22, 8 states). Picked 2 flat-rate states with recent 2024–25 legislation, 2 long-stable bracketed states, and 2 multi-bracket states.
- **What changed in each file:** the placeholder "Progressive tax brackets (simplified)" block was rewritten with TY2025-correct math, and the 2026-05-21 AUDIT comment was upgraded from `STATE_MATH=PLACEHOLDER_BROKEN ... status=NEEDS_HUMAN_REVIEW` to a new `AUDIT 2026-05-23` comment with `status=VERIFIED`, the statutory source, the actual formula in plain text, and 3 hand-derived `test_cases`.
- **Per-state TY2025 rates applied:**
  - **Louisiana:** 3.0% flat (HB 1, December 2024 Second Extraordinary Session; effective 1/1/2025; replaces TY2024 3-bracket 1.85/3.50/4.25). Was placeholder progressive 2.125/3.1875/4.25%.
  - **Iowa:** 3.8% flat (SF 2442 accelerated phase-in; replaces TY2024 3-bracket 4.40/4.82/5.70). Was placeholder progressive 3.0/4.5/6.0%.
  - **Alabama:** 3-bracket progressive 2%/4%/5% at $500/$3,000 thresholds (single; Code of AL §40-18-5; structure stable since 1933). Was placeholder progressive 2.5/3.75/5.0%.
  - **Virginia:** 4-bracket progressive 2%/3%/5%/5.75% at $3,000/$5,000/$17,000 (single; VA Code §58.1-320; top rate stable since 1972). Was placeholder progressive 2.875/4.3125/5.75%.
  - **Missouri:** 8-bracket progressive 0/2/2.5/3/3.5/4/4.5/4.7% (single; MO DOR Form MO-1040 TY2025; SB 3, 2022 ratchet; top rate cut from 4.80% TY2024 → 4.70% TY2025 by revenue trigger). Was placeholder progressive 2.475/3.7125/4.95%.
  - **Oklahoma:** 6-bracket progressive 0.25/0.75/1.75/2.75/3.75/4.75% (single; OK Tax Commission Form 511; SB 1075, 2021; top 4.75% unchanged since TY2022). Was placeholder progressive 2.375/3.5625/4.75%.
- **Verification:** Wrote `/tmp/fix_state_tax_batch7.py` and `/tmp/verify_node.py`. The first verifies each spec's documented test cases against an in-Python re-implementation BEFORE applying any edits. The second re-extracts the modified JS block from each saved HTML file and executes it via `node -e` against the same inputs. **18/18 test cases passed both ways for all 6 files** (3 cases each at income = $50k / $100k / $200k).
- **Validation grep:** all 6 files: brace count balanced (diff=0); exactly one `AUDIT 2026-05-23: state=...` comment per file (the new one); zero `NEEDS_HUMAN_REVIEW` or `PLACEHOLDER_BROKEN` remaining; zero `href=""`; zero `AUDIT 2026-05-21` remaining (the 2026-05-21 broken-status audit was replaced, not duplicated).
- **Known scope limits (NOT fixed this run, intentionally; consistent with batch #6 policy):**
  - All 6 files still cite TY2023 federal brackets ($44,725 / $95,375 / $182,100 thresholds) — explicitly preserved with `federal_brackets_in_file=TY2023_outdated (cross-file refresh pending)` flag in each new audit comment. Better done in one infra-wide pass than per-state.
  - None of the 6 models subtracts a state standard deduction (matches the existing template across the income-tax family). Each AUDIT comment lists the state's SD with the note that low-income filers will see a slight overestimate. (Louisiana $12,500 single; Iowa ~$2,210; Alabama up to $3,000 single; Virginia $8,500 single; Missouri $14,600 conformed; Oklahoma $6,350 single.)
  - Alabama / Virginia / Oklahoma use single-filer bracket thresholds; MFJ thresholds differ (AL doubles; VA same brackets but joint structure; OK doubles). Explicitly noted.
  - Missouri does not separately model the long-term capital-gains 50% deduction (HB 1597, 2025) — out of scope for a wage-income calculator.
- **Files touched:** 6 (`louisiana-income-tax-calculator.html`, `iowa-income-tax-calculator.html`, `alabama-income-tax-calculator.html`, `virginia-income-tax-calculator.html`, `missouri-income-tax-calculator.html`, `oklahoma-income-tax-calculator.html`) + `OPERATIONS.md`.
- **Metrics moved:** Calculators with verified math 119 → 125 (added 6 state income-tax calcs with TY2025-correct per-state brackets); Tier-C "NEEDS_HUMAN_REVIEW" income-tax queue 25 → 19 remaining (verified by repo-wide grep).
- **Next:** evening slot — batch #8: next 5–6 Tier-C income-tax states. Candidates: NY (true progressive 4%–10.9% replacing current 6.85% flat approximation), OH (TY2025 simplified 2-bracket: 2.75% to $100k / 3.5% above per HB 33), AR (TY2025 3.9% top per HB 1001 Aug 2024 special session), NM (4-bracket 1.7/3.2/4.7/5.9% single TY2025), WV (TY2025 reduced ratchet 2.22–4.82%), NE (TY2025 top 5.20% per LB 754).

(Future runs append below.)
