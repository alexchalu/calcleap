# CalcLeap Monetization Plan — v1.0 (2026-07-01)

> Produced by a 7-agent audit (repo inventory, SERP probes, monetization research,
> competitor teardown, synthesis, adversarial critique, final revision) plus manual
> verification. This file is the money counterpart to `OPERATIONS.md` — routines and
> interactive sessions both read it. TIER 0 in `OPERATIONS.md` tracks execution.

## The honest fact base

- **AdSense: REJECTED** for "low value content" (see OPERATIONS.md Mission #1). Reapproval is
  gated on decontamination + consolidation — the content threshold (30+ gold blogs) is already
  met with 45.
- **Traffic: unmeasured but modest.** ~420 pages indexed by Google (~14%). Brave-index probes
  show top-5 rankings only on state × niche long-tail (MN health insurance #2, WA capital gains
  #3, Medicaid eligibility #4, AZ income tax #4, best-HSA-2026 blog #7); invisible on every head
  term. Best guess: 10–100 clicks/day. GA4 (not yet installed) will make this falsifiable.
- **Every monetization surface was disconnected** until 2026-07-01: fake ad slots (3,954 units),
  a stranger's pub ID on 154 pages, untagged Policygenius redirects on 272 lead forms, untagged
  password-manager links, zero analytics, false TCPA consent copy. Decontamination is DONE
  (see TIER 0 log); the revenue wiring is blocked on Alex's account signups below.

## Realistic expectations (do not self-deceive)

- **This week:** $0–25. The work is unblocking, not earning.
- **Month 1:** $10–100/mo run-rate (tagged Policygenius redirect + password-manager affiliates).
- **Quarter end:** first $100 month is the target; $25–400/mo realistic range
  (affiliate $25–250 + AdSense $15–150 if reapproved). Anything projecting $1k/mo in 90 days
  from a ~420-indexed-page base is unserious.
- **The ceiling** is traffic-gated. The two levers that raise it: consolidation (indexed-ratio
  health under Google's scaled-content policy) and the state × niche long-tail clusters that
  already rank (double down there, not on head terms owned by NerdWallet/Bankrate).

## ALEX'S CHECKLIST (nobody else can do these — ~4–6 hours total)

### This week — highest EV hour first
1. **Affiliate network applications** (need W-9 + payout details):
   - Impact — https://impact.com (Policygenius + 1Password run programs here)
   - CJ — https://www.cj.com
   - FlexOffers — https://www.flexoffers.com (fast approvals for small sites)
   - NordPass — https://nordpass.com/affiliate/ (30–40% commissions)
   - Fintel Connect — https://www.fintelconnect.com (HYSA/CD/bank offers, $50–350 per funded account)
   - SmartFinancial publisher program — https://smartfinancial.com (insurance click/lead inventory
     for the 250+ state insurance pages)
2. **GA4 property**: analytics.google.com → create property for calcleap.com → give Claude the
   `G-XXXXXXXXXX` ID → `python inject-ga4.py G-XXXXXXXXXX` (script is ready, repo root).
3. **Search Console** (search.google.com/search-console) + **Bing Webmaster Tools**
   (bing.com/webmasters) — verify calcleap.com. Bing WMT immediately quantifies the known
   Bing/Brave rankings.
4. **AdSense Policy Center readout** (adsense.google.com): record the EXACT findings on the
   rejected account and any resubmission cooldown date. Do NOT resubmit yet — resubmission is
   gated on TIER 0 items M3/M5/M6.

### Decisions pending from Alex
- ~~**Delete `malpractice/`, `mesothelioma/`, `tax-refund/`?**~~ **DECIDED + EXECUTED 2026-07-10**
  (Alex approved; 154 scraped YMYL pages + `generate-malpractice.js` deleted, sitemap pruned to
  2,792 URLs, all generator scripts sanitized of fake ad-unit emission. Recoverable from git history.)
- **Do you recognize `ca-pub-7513498242498681`?** It was on all 154 of those pages (now purged).
  If it's an old account of yours, say so; otherwise someone else was the beneficiary of any
  impressions those pages ever served.

## CLAUDE'S QUEUE (repo-side, tracked as TIER 0 in OPERATIONS.md)

Done 2026-07-01: decontamination sweep (fake units, foreign IDs, wrappers, TCPA copy,
privacy/terms alignment, index.html claim), legacy Jekyll build disabled, GA4 injector ready.

Blocked on Alex: GA4 injection (needs G-ID) · affiliate URL swaps (needs tracking IDs) ·
vertical deletion (needs confirmation).

Not blocked: consent-banner wiring (M6) · thin-clone consolidation batches (M5) · FTC
affiliate-disclosure component (pre-build, deploy with first live affiliate link).

## What we explicitly REJECTED (and why)

- **Full CPL lead-selling** (ping-post, TrustedForm/Jornaya): wrong weight class for a solo
  operator; the old TCPA copy was pure liability with zero fulfillment. Lead forms become
  affiliate click-outs instead. Revisit only if click-out data shows 50+ clicks/week.
- **Gumroad workbooks / donations**: 0.1–0.5% conversion on tiny traffic ≈ $0.
- **More programmatic page volume**: Google indexes 14% of the site — the scaled-content
  pattern is already being refused. Depth > breadth until indexed-ratio recovers.
- **Ezoic**: closed to sites under 250k users (Feb 2026). Journey by Mediavine (1k sessions/mo,
  Jan 2026 threshold) is the realistic post-GA4 upgrade path over AdSense.
